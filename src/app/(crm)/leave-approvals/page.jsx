"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/store/slices/authSlice";
import { selectActiveCompanyId } from "@/store/slices/companyContextSlice";
import {
  fetchLeaveRequests,
  fetchMonthlyLeaveSummary,
  approveLeave,
  rejectLeave,
  selectLeaveRequestsData,
  selectMonthlyLeaveSummary,
  selectLeaveRequestsLoading
} from "@/store/entities/leaveRequestsSlice";
import { subscribeToSocketEvent, unsubscribeFromSocketEvent } from "@/lib/socket";
import Modal from "@/components/modals/Modal";
import HasPermission from "@/components/rbac/HasPermission";
import {
  Check, AlertCircle, X, CheckCircle2, XCircle, FileText, Calendar, Building2, User as UserIcon, Shield, Loader2, Users, Layers, Clock, Palmtree, BarChart2
} from "lucide-react";
import { format, parseISO } from "date-fns";
import Image from "next/image";
import { getFriendlyError } from "@/lib/errorMessages";

function LeaveApprovalsContent() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const activeCompanyId = useSelector(selectActiveCompanyId);
  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestId");

  const { data: allLeaves } = useSelector(selectLeaveRequestsData) || { data: [] };
  const monthlySummary = useSelector(selectMonthlyLeaveSummary);
  const isLoading = useSelector(selectLeaveRequestsLoading);

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [activeTab, setActiveTab] = useState("PENDING");
  const [highlightedId, setHighlightedId] = useState(null);
  const cardRefs = useRef({});

  useEffect(() => {
    if (activeCompanyId) {
      dispatch(fetchLeaveRequests({}));
      dispatch(fetchMonthlyLeaveSummary({}));
    }
  }, [dispatch, activeCompanyId]);

  // Realtime: refetch when any LEAVE_REQUEST notification arrives on the socket
  useEffect(() => {
    const handleNotification = (payload) => {
      const entityType = (payload?.entityType || '').toUpperCase();
      if (entityType === 'LEAVE_REQUEST') {
        dispatch(fetchLeaveRequests({}));
      }
    };
    subscribeToSocketEvent('notification', handleNotification);
    return () => unsubscribeFromSocketEvent('notification', handleNotification);
  }, [dispatch]);

  // Deep-link: auto-switch tab and highlight the requested leave card
  useEffect(() => {
    if (!requestId || allLeaves.length === 0) return;
    const id = parseInt(requestId, 10);
    const leave = allLeaves.find((l) => l.id === id);
    if (!leave) return;

    // Switch to the correct tab
    const isPending = leave.status === "PENDING";
    setActiveTab(isPending ? "PENDING" : "HISTORY");

    // Wait for the tab to render, then scroll and flash
    setTimeout(() => {
      const el = cardRefs.current[id];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      setHighlightedId(id);
      // Remove highlight after animation
      setTimeout(() => setHighlightedId(null), 2500);
    }, 150);
  }, [requestId, allLeaves]);

  const filteredLeaves = allLeaves.filter(l => activeTab === "PENDING" ? l.status === "PENDING" : l.status !== "PENDING");

  // Reject Modal
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectRemarks, setRejectRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

  const handleApprove = async (leaveId) => {
    if (loadingId) return; // prevent double click
    setLoadingId(leaveId);
    try {
      await dispatch(approveLeave({ id: leaveId, remarks: "Approved by manager" })).unwrap();
      showToast("Leave approved successfully");
      dispatch(fetchLeaveRequests({}));
    } catch (err) {
      showToast(getFriendlyError(err), "error");
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectRemarks.trim()) {
      showToast("Rejection remarks are mandatory", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      await dispatch(rejectLeave({ id: rejectTarget.id, remarks: rejectRemarks })).unwrap();
      showToast("Leave rejected successfully");
      setRejectTarget(null);
      setRejectRemarks("");
      dispatch(fetchLeaveRequests({}));
    } catch (err) {
      showToast(getFriendlyError(err), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && allLeaves.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-400">Loading Approvals...</p>
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

      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <CheckCircle2 className="h-6 w-6 text-[#007aff]" />
          Leave Approvals & Manager Analytics
        </h1>
        <p className="text-xs text-gray-400 font-medium mt-1">
          Review and take action on leave requests from your team ({monthlySummary?.monthLabel || format(new Date(), "MMMM yyyy")}).
        </p>
      </div>

      {/* Summary Cards Banner */}
      {monthlySummary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white border border-gray-100 rounded-2xl p-3.5 shadow-xs">
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-gray-400 block">Period</span>
            <span className="text-xs font-bold text-gray-900 truncate block mt-1">{monthlySummary.monthLabel}</span>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-3.5 shadow-xs">
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-purple-600 block">On Leave Today</span>
            <span className="text-xl font-black text-purple-700 block mt-0.5">{monthlySummary.summaryCards?.employeesOnLeaveToday || 0}</span>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-3.5 shadow-xs">
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-gray-400 block">Total Requests</span>
            <span className="text-xl font-black text-gray-900 block mt-0.5">{monthlySummary.summaryCards?.totalRequests || 0}</span>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-3.5 shadow-xs">
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-emerald-600 block">Approved</span>
            <span className="text-xl font-black text-emerald-600 block mt-0.5">{monthlySummary.summaryCards?.approvedLeaves || 0}</span>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-3.5 shadow-xs">
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-amber-600 block">Pending</span>
            <span className="text-xl font-black text-amber-600 block mt-0.5">{monthlySummary.summaryCards?.pendingApprovals || 0}</span>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-3.5 shadow-xs">
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-blue-100 block">Total Leave Days</span>
            <span className="text-xl font-black text-white block mt-0.5">{monthlySummary.summaryCards?.totalLeaveDaysTaken || 0} <span className="text-[10px] font-normal">Days</span></span>
          </div>
        </div>
      )}

      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("PENDING")}
          className={`pb-3 px-2 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === "PENDING" ? "border-[#007aff] text-[#007aff]" : "border-transparent text-gray-400 hover:text-gray-700"}`}
        >
          Pending Requests
          {allLeaves.filter(l => l.status === "PENDING").length > 0 && (
            <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {allLeaves.filter(l => l.status === "PENDING").length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("HISTORY")}
          className={`pb-3 px-2 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === "HISTORY" ? "border-[#007aff] text-[#007aff]" : "border-transparent text-gray-400 hover:text-gray-700"}`}
        >
          Approval History
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLeaves.length > 0 ? (
          filteredLeaves.map((leave, idx) => (
            <div
              key={leave.id || idx}
              ref={(el) => { if (el) cardRefs.current[leave.id] = el; }}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col"
              style={highlightedId === leave.id ? {
                animation: 'notif-highlight 2.5s ease-out forwards',
              } : {}}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-50 text-[#007aff] flex items-center justify-center font-bold text-sm">
                    {leave.employee?.firstName?.charAt(0)}{leave.employee?.lastName?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{leave.employee?.firstName} {leave.employee?.lastName}</h3>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">{leave.employee?.employeeCode}</p>
                  </div>
                </div>
                {leave.status !== "PENDING" && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${leave.status === 'APPROVED' ? 'bg-green-50 text-green-600' : leave.status === 'REJECTED' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-500'}`}>
                    {leave.status}
                  </span>
                )}
              </div>

              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Shield className="h-3.5 w-3.5 text-gray-400" /> {leave.employee?.designation?.name || "No Designation"}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Building2 className="h-3.5 w-3.5 text-gray-400" /> {leave.employee?.department?.name || "No Department"}
                </div>
                
                <div className="bg-gray-50 rounded-xl p-3 mt-2 border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Leave Details</span>
                    <span className="text-xs font-bold text-[#007aff] bg-blue-50 px-2 py-0.5 rounded">{leave.leaveType?.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {leave.fromDate ? format(parseISO(leave.fromDate), "MMM dd") : '—'}
                    {leave.fromDate !== leave.toDate && leave.toDate
                      ? ` - ${format(parseISO(leave.toDate), "MMM dd")}`
                      : ''}
                    <span className="text-gray-400 font-normal">({leave.totalDays} {leave.totalDays === 1 ? 'day' : 'days'})</span>
                  </div>
                  {leave.isHalfDay && <div className="text-[10px] text-purple-500 font-bold mt-1">Half Day</div>}
                </div>

                <div className="text-xs text-gray-600 pt-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Reason</span>
                  {leave.reason}
                </div>

                {leave.attachmentUrl && (
                  <div className="pt-2">
                    <a href={leave.attachmentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-[#007aff] text-[10px] font-bold rounded-lg hover:bg-blue-100 transition-colors">
                      <FileText className="h-3.5 w-3.5" /> View Attachment
                    </a>
                  </div>
                )}
                
                {leave.status !== "PENDING" && leave.remarks && (
                  <div className="pt-3 border-t border-gray-100 mt-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Remarks</span>
                    <p className="text-xs text-gray-600 italic">"{leave.remarks}"</p>
                  </div>
                )}
              </div>

              {activeTab === "PENDING" && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <HasPermission permission="leave:approve">
                    <button
                      onClick={() => setRejectTarget(leave)}
                      disabled={!!loadingId}
                      className="flex-1 py-2 bg-white border border-red-200 text-red-600 rounded-xl hover:bg-red-50 text-xs font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      <X className="h-4 w-4" /> Reject
                    </button>
                    <button
                      onClick={() => handleApprove(leave.id)}
                      disabled={!!loadingId}
                      className="flex-1 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 text-xs font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm shadow-green-500/20"
                    >
                      {loadingId === leave.id
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <Check className="h-4 w-4" />}
                      {loadingId === leave.id ? "Approving..." : "Approve"}
                    </button>
                  </HasPermission>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
            <CheckCircle2 className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <h2 className="text-sm font-bold text-gray-700 mb-1">All Caught Up!</h2>
            <p className="text-xs text-gray-500">
              There are no {activeTab === "PENDING" ? "pending leave requests" : "past approvals"} to show.
            </p>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectTarget && (
        <Modal
          isOpen={true}
          onClose={() => setRejectTarget(null)}
          title="Reject Leave Request"
          size="sm"
        >
          <div className="space-y-4">
            <div className="bg-red-50 p-3 rounded-xl border border-red-100 flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-red-800 font-medium">
                  You are about to reject the leave request for <span className="font-bold">{rejectTarget.employee?.firstName} {rejectTarget.employee?.lastName}</span>.
                </p>
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Rejection Remarks <span className="text-red-500">*</span></label>
              <textarea
                required
                value={rejectRemarks}
                onChange={(e) => setRejectRemarks(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                rows={3}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-gray-700 resize-none"
              />
              <p className="text-[10px] text-gray-400">Remarks are mandatory and will be visible to the employee.</p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRejectTarget(null)}
                className="px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={isSubmitting || !rejectRemarks.trim()}
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-red-500/20 flex items-center gap-2"
              >
                {isSubmitting ? "Rejecting..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default function LeaveApprovalsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-400">Loading...</p>
      </div>
    }>
      <LeaveApprovalsContent />
    </Suspense>
  );
}
