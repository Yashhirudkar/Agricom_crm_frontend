"use client";

import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, fetchCurrentUser } from "@/store/slices/authSlice";
import { fetchLeaveBalances, selectLeaveBalancesData, selectLeaveBalancesError } from "@/store/entities/leaveBalancesSlice";
import { fetchLeaveTypes, selectLeaveTypesData } from "@/store/entities/leaveTypesSlice";
import {
  fetchMyLeaves,
  applyLeave,
  cancelLeave,
  selectLeaveRequestsData,
  selectLeaveRequestsLoading,
  selectLeaveRequestsError
} from "@/store/entities/leaveRequestsSlice";
import Modal from "@/components/modals/Modal";
import ConfirmModal from "@/components/modals/ConfirmModal";
import {
  Plus, Calendar as CalendarIcon, Check, AlertCircle, Clock, XCircle, FileText, UploadCloud, CalendarDays, UserX
} from "lucide-react";
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay } from "date-fns";
import { getFriendlyError } from "@/lib/errorMessages";

function MyLeavesContent() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const balances = useSelector(selectLeaveBalancesData) || [];
  const balancesError = useSelector(selectLeaveBalancesError);
  const { data: leaveTypes } = useSelector(selectLeaveTypesData) || { data: [] };
  const { data: myLeaves } = useSelector(selectLeaveRequestsData) || { data: [] };
  const isLoading = useSelector(selectLeaveRequestsLoading);
  const requestsError = useSelector(selectLeaveRequestsError);

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [activeTab, setActiveTab] = useState("PENDING");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'calendar'
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  const isEmployee = user?.employeeId || user?.employee;

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      if (isEmployee) {
        dispatch(fetchLeaveBalances({ employeeId: user.employeeId || user.employee?.id || "me", year: new Date().getFullYear() }));
        dispatch(fetchMyLeaves({}));
      }
      dispatch(fetchLeaveTypes({}));
    }
  }, [dispatch, user, isEmployee]);

  // Apply Leave Modal
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applyForm, setApplyForm] = useState({
    leaveTypeId: "",
    fromDate: "",
    toDate: "",
    reason: "",
    isHalfDay: false,
    file: null
  });

  const handleApplyChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setApplyForm(prev => ({ ...prev, file: files[0] }));
    } else {
      setApplyForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    }
  };

  const submitApplyLeave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append("leaveTypeId", applyForm.leaveTypeId);
      formData.append("fromDate", applyForm.fromDate);
      formData.append("toDate", applyForm.toDate);
      formData.append("reason", applyForm.reason);
      formData.append("isHalfDay", applyForm.isHalfDay);
      if (applyForm.file) {
        formData.append("file", applyForm.file);
      }

      await dispatch(applyLeave(formData)).unwrap();
      showToast("Leave applied successfully");
      setIsApplyModalOpen(false);
      setApplyForm({ leaveTypeId: "", fromDate: "", toDate: "", reason: "", isHalfDay: false, file: null });
      // Refresh
      dispatch(fetchMyLeaves({}));
      dispatch(fetchLeaveBalances({ employeeId: user?.employeeId || user?.employee?.id || "me", year: new Date().getFullYear() }));
    } catch (err) {
      showToast(getFriendlyError(err), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel Leave
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  const handleCancelLeave = async () => {
    if (!cancelReason.trim()) {
      showToast("Please provide a cancellation reason", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      await dispatch(cancelLeave({ id: cancelTarget.id, reason: cancelReason })).unwrap();
      showToast("Leave cancelled successfully");
      setCancelTarget(null);
      setCancelReason("");
      dispatch(fetchMyLeaves({}));
      dispatch(fetchLeaveBalances({ employeeId: user?.employeeId || user?.employee?.id || "me", year: new Date().getFullYear() }));
    } catch (err) {
      showToast(getFriendlyError(err), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Status mapping
  const statusConfig = {
    PENDING: { label: "Pending", className: "bg-yellow-50 text-yellow-600 border border-yellow-100", icon: Clock },
    APPROVED: { label: "Approved", className: "bg-green-50 text-green-600 border border-green-100", icon: Check },
    REJECTED: { label: "Rejected", className: "bg-red-50 text-red-600 border border-red-100", icon: XCircle },
    CANCELLED: { label: "Cancelled", className: "bg-gray-50 text-gray-500 border border-gray-100", icon: AlertCircle }
  };

  const filteredLeaves = myLeaves.filter(l => l.status === activeTab);

  // Calendar Helpers
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonthDate),
    end: endOfMonth(currentMonthDate)
  });
  const startDay = getDay(startOfMonth(currentMonthDate)); // 0 = Sunday
  const blanks = Array.from({ length: startDay === 0 ? 6 : startDay - 1 }, (_, i) => i); // Assuming Monday start

  const getLeaveStatusForDay = (date) => {
    for (const req of myLeaves) {
      if (req.status === "CANCELLED") continue;
      const start = parseISO(req.fromDate);
      const end = parseISO(req.toDate);
      if (date >= start && date <= end) {
        return req.status; // 'PENDING', 'APPROVED', 'REJECTED'
      }
    }
    return null;
  };

  if (!isEmployee) {
    const isAdmin = user?.type === "client_admin" || user?.type === "super_admin";
    return (
      <div className="p-6 md:p-8 max-w-[1200px] mx-auto space-y-6">
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="h-20 w-20 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-6">
            <UserX className="h-10 w-10" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            {isAdmin ? "Admin Account" : "Employee Profile Not Linked"}
          </h2>
          <p className="text-sm text-gray-500 mt-2 max-w-md">
            {isAdmin 
              ? "Leave requests can only be submitted by employee accounts."
              : "Your user account is not currently linked to an employee profile. Leave management features are only available to registered employees."}
          </p>
          {!isAdmin && (
            <p className="text-[11px] text-gray-400 mt-6 font-medium uppercase tracking-widest">
              Contact your HR administrator for assistance.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto space-y-6">
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-xs font-bold text-white transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
          {toast.type === "error" ? <AlertCircle className="h-4 w-4" /> : <Check className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-[#007aff]" />
            My Leaves
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Apply and track your leave requests.
          </p>
        </div>
        <button
          onClick={() => setIsApplyModalOpen(true)}
          className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm shadow-blue-500/20 transition-colors"
        >
          <Plus className="h-4 w-4" /> Apply Leave
        </button>
      </div>

      {/* Leave Balance Widget */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {balances.map(bal => {
          const total = Number(bal.totalAllocated) || 0;
          const used = Number(bal.usedDays) || 0;
          const pending = Number(bal.pendingDays) || 0;
          const remaining = Number(bal.remainingDays) ?? (total - used - pending);
          const usedPct = total > 0 ? Math.round((used / total) * 100) : 0;
          return (
            <div key={bal.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-3 shadow-xs hover:shadow-sm transition-shadow">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{bal.leaveType?.name}</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-gray-800">{remaining}</span>
                <span className="text-xs font-medium text-gray-400">days left</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full bg-[#007aff] transition-all"
                  style={{ width: `${Math.min(usedPct, 100)}%` }}
                />
              </div>
              <div className="text-[10px] text-gray-400 flex justify-between">
                <span>Used {used}</span>
                <span>Total {total}</span>
              </div>
              {pending > 0 && (
                <div className="text-[10px] text-amber-500 font-semibold">{pending} day{pending !== 1 ? 's' : ''} pending approval</div>
              )}
            </div>
          );
        })}
        {balances.length === 0 && (
          <div className="col-span-full text-center py-6 text-xs text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
            No leave balances available.
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50/30 flex items-center justify-between px-4">
          <div className="flex">
            {["PENDING", "APPROVED", "REJECTED", "CANCELLED"].map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setViewMode("list"); }}
                className={`px-6 py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === tab && viewMode === "list" ? "border-[#007aff] text-[#007aff]" : "border-transparent text-gray-400 hover:text-gray-700"}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button
            onClick={() => setViewMode(viewMode === "list" ? "calendar" : "list")}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${viewMode === "calendar" ? "bg-blue-50 text-[#007aff]" : "text-gray-500 hover:bg-gray-100"}`}
          >
            <CalendarDays className="h-4 w-4" />
            {viewMode === "list" ? "Calendar View" : "List View"}
          </button>
        </div>

        {viewMode === "list" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/10 text-gray-400 uppercase tracking-widest text-[10px] font-bold">
                  <th className="px-6 py-4">Leave Type</th>
                  <th className="px-6 py-4">Date Range</th>
                  <th className="px-6 py-4">Days</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Approver</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredLeaves.length > 0 ? (
                  filteredLeaves.map((leave, idx) => {
                    const StatusIcon = statusConfig[leave.status]?.icon || AlertCircle;
                    return (
                      <tr key={leave.id || idx} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-800">{leave.leaveType?.name}</div>
                          {leave.isHalfDay && <span className="text-[10px] text-purple-500 font-medium">Half Day</span>}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {format(parseISO(leave.fromDate), "MMM dd, yyyy")}
                          {leave.fromDate !== leave.toDate && ` - ${format(parseISO(leave.toDate), "MMM dd, yyyy")}`}
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-700">{leave.totalDays}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold ${statusConfig[leave.status]?.className}`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig[leave.status]?.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {leave.approver ? `${leave.approver.firstName} ${leave.approver.lastName}` : "-"}
                          {leave.remarks && <div className="text-[10px] text-gray-400 mt-1 italic">"{leave.remarks}"</div>}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {leave.status === "PENDING" && (
                            <button
                              onClick={() => setCancelTarget(leave)}
                              className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400 font-semibold">
                      No {activeTab.toLowerCase()} leave requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">{format(currentMonthDate, "MMMM yyyy")}</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentMonthDate(d => new Date(d.setMonth(d.getMonth() - 1)))}
                  className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 text-xs font-semibold text-gray-600"
                >
                  Prev
                </button>
                <button 
                  onClick={() => setCurrentMonthDate(new Date())}
                  className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 text-xs font-semibold text-gray-600"
                >
                  Today
                </button>
                <button 
                  onClick={() => setCurrentMonthDate(d => new Date(d.setMonth(d.getMonth() + 1)))}
                  className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 text-xs font-semibold text-gray-600"
                >
                  Next
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-xl overflow-hidden border border-gray-200">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                <div key={d} className="bg-gray-50 py-2 text-center text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  {d}
                </div>
              ))}
              
              {blanks.map(b => <div key={`blank-${b}`} className="bg-white min-h-[80px]" />)}
              
              {daysInMonth.map(day => {
                const status = getLeaveStatusForDay(day);
                let bgClass = "bg-white";
                let textClass = "text-gray-700";
                
                if (status === "APPROVED") { bgClass = "bg-green-100"; textClass = "text-green-800"; }
                else if (status === "PENDING") { bgClass = "bg-yellow-100"; textClass = "text-yellow-800"; }
                else if (status === "REJECTED") { bgClass = "bg-red-100"; textClass = "text-red-800"; }

                const isToday = isSameDay(day, new Date());

                return (
                  <div key={day.toISOString()} className={`min-h-[80px] p-2 flex flex-col items-center border-t border-gray-100 transition-colors ${bgClass}`}>
                    <span className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? "bg-[#007aff] text-white" : textClass}`}>
                      {format(day, "d")}
                    </span>
                    {status && (
                      <div className="mt-auto pt-1 w-full flex justify-center">
                        <span className={`h-1.5 w-1.5 rounded-full ${status === "APPROVED" ? "bg-green-500" : status === "PENDING" ? "bg-yellow-500" : "bg-red-500"}`} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex justify-center gap-6">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <span className="w-3 h-3 rounded-sm bg-green-100 border border-green-200" /> Approved
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <span className="w-3 h-3 rounded-sm bg-yellow-100 border border-yellow-200" /> Pending
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <span className="w-3 h-3 rounded-sm bg-red-100 border border-red-200" /> Rejected
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Apply Leave"
        size="md"
      >
        <form onSubmit={submitApplyLeave} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Leave Type <span className="text-red-500">*</span></label>
            <select
              name="leaveTypeId"
              required
              value={applyForm.leaveTypeId}
              onChange={handleApplyChange}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff] text-gray-700"
            >
              <option value="">Select Leave Type</option>
              {leaveTypes.filter(lt => lt.isActive).map(lt => (
                <option key={lt.id} value={lt.id}>{lt.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">From Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                name="fromDate"
                required
                value={applyForm.fromDate}
                onChange={handleApplyChange}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff] text-gray-700"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">To Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                name="toDate"
                required
                value={applyForm.toDate}
                min={applyForm.fromDate}
                onChange={handleApplyChange}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff] text-gray-700"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isHalfDay"
              name="isHalfDay"
              checked={applyForm.isHalfDay}
              onChange={handleApplyChange}
              className="w-4 h-4 rounded text-[#007aff] focus:ring-[#007aff] border-gray-300"
            />
            <label htmlFor="isHalfDay" className="text-xs font-medium text-gray-700 cursor-pointer">
              This is a Half Day leave
            </label>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Reason <span className="text-red-500">*</span></label>
            <textarea
              name="reason"
              required
              rows={3}
              value={applyForm.reason}
              onChange={handleApplyChange}
              placeholder="State your reason for leave..."
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff] text-gray-700 resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Attachment (Optional)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-8 w-8 text-gray-400" />
                <div className="flex text-xs text-gray-600 justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-[#007aff] hover:underline focus-within:outline-none">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file" type="file" className="sr-only" onChange={handleApplyChange} accept=".pdf,.jpg,.jpeg,.png" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-[10px] text-gray-400">PDF, PNG, JPG up to 10MB</p>
                {applyForm.file && (
                  <div className="text-xs font-bold text-green-600 mt-2 flex items-center justify-center gap-1">
                    <FileText className="h-3 w-3" /> {applyForm.file.name}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsApplyModalOpen(false)}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#007aff] text-white rounded-xl hover:bg-blue-600 text-xs font-semibold disabled:opacity-50 transition-colors shadow-sm shadow-blue-500/20"
            >
              {isSubmitting ? "Applying..." : "Submit Request"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Cancel Leave Modal */}
      {cancelTarget && (
        <Modal
          isOpen={true}
          onClose={() => setCancelTarget(null)}
          title="Cancel Leave Request"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-xs text-gray-600">
              Are you sure you want to cancel your leave request for <span className="font-bold">{cancelTarget.leaveType?.name}</span> from <span className="font-bold">{format(parseISO(cancelTarget.fromDate), "MMM dd")}</span>?
            </p>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Cancellation Reason <span className="text-red-500">*</span></label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Why are you cancelling?"
                rows={2}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-gray-700 resize-none"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                className="px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-xs font-semibold"
              >
                Keep Leave
              </button>
              <button
                onClick={handleCancelLeave}
                disabled={isSubmitting}
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 text-xs font-semibold disabled:opacity-50"
              >
                {isSubmitting ? "Cancelling..." : "Cancel Request"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default function MyLeavesPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-400">Loading...</p>
      </div>
    }>
      <MyLeavesContent />
    </Suspense>
  );
}
