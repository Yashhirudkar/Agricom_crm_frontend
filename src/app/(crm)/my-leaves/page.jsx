"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, fetchCurrentUser } from "@/store/slices/authSlice";
import { fetchLeaveBalances, selectLeaveBalancesData, selectLeaveBalancesError } from "@/store/entities/leaveBalancesSlice";
import { fetchLeaveTypesForApply, selectLeaveTypesData } from "@/store/entities/leaveTypesSlice";
import {
  fetchMyLeaves,
  applyLeave,
  cancelLeave,
  selectLeaveRequestsData,
  selectLeaveRequestsLoading,
  selectLeaveRequestsError
} from "@/store/entities/leaveRequestsSlice";
import { Plus, Calendar as CalendarIcon, Check, AlertCircle, Clock, XCircle, CalendarDays, UserX } from "lucide-react";
import { startOfMonth, endOfMonth, eachDayOfInterval, getDay, parseISO } from "date-fns";
import { getFriendlyError } from "@/lib/errorMessages";
import { subscribeToSocketEvent, unsubscribeFromSocketEvent } from "@/lib/socket";

import LeaveBalanceWidget from "@/components/my-leaves/LeaveBalanceWidget";
import MyLeavesListTable from "@/components/my-leaves/MyLeavesListTable";
import MyLeavesCalendarView from "@/components/my-leaves/MyLeavesCalendarView";
import ApplyLeaveModal from "@/components/my-leaves/ApplyLeaveModal";
import CancelLeaveModal from "@/components/my-leaves/CancelLeaveModal";
import Pagination from "@/components/common/Pagination";

function MyLeavesContent() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const balances = useSelector(selectLeaveBalancesData) || [];
  const balancesError = useSelector(selectLeaveBalancesError);
  const { data: leaveTypes } = useSelector(selectLeaveTypesData) || { data: [] };
  const { data: myLeaves, totalPages } = useSelector(selectLeaveRequestsData) || { data: [], totalPages: 1 };
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [highlightedId, setHighlightedId] = useState(null);
  const rowRefs = useRef({});

  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestId");

  const isEmployee = user?.employeeId || user?.employee;

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      if (isEmployee) {
        dispatch(fetchLeaveBalances({ employeeId: user.employeeId || user.employee?.id || "me", year: new Date().getFullYear() }));
      }
      dispatch(fetchLeaveTypesForApply({}));
    }
  }, [dispatch, user, isEmployee]);

  useEffect(() => {
    if (user && isEmployee) {
      if (viewMode === "list") {
        dispatch(fetchMyLeaves({ page: currentPage, limit: itemsPerPage, status: activeTab }));
      } else {
        // Fetch all for the current month in calendar view (could be optimized)
        dispatch(fetchMyLeaves({ limit: 100 }));
      }
    }
  }, [dispatch, user, isEmployee, currentPage, activeTab, viewMode]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, viewMode]);

  // Realtime: refetch when any LEAVE_REQUEST notification arrives on the socket
  // (covers leave_approved, leave_rejected, leave_cancelled sent to the employee)
  useEffect(() => {
    const handleNotification = (payload) => {
      const entityType = (payload?.entityType || '').toUpperCase();
      if (entityType === 'LEAVE_REQUEST') {
        // Re-fetch current view
        if (viewMode === 'list') {
          dispatch(fetchMyLeaves({ page: currentPage, limit: itemsPerPage, status: activeTab }));
        } else {
          dispatch(fetchMyLeaves({ limit: 100 }));
        }
        // Also refresh leave balances so the balance widget stays accurate
        if (user) {
          dispatch(fetchLeaveBalances({
            employeeId: user.employeeId || user.employee?.id || 'me',
            year: new Date().getFullYear()
          }));
        }
      }
    };
    subscribeToSocketEvent('notification', handleNotification);
    return () => unsubscribeFromSocketEvent('notification', handleNotification);
  }, [dispatch, user, viewMode, currentPage, activeTab]);

  // Deep-link: auto-switch tab and highlight the requested leave row
  useEffect(() => {
    if (!requestId || myLeaves.length === 0) return;
    const id = parseInt(requestId, 10);
    const leave = myLeaves.find((l) => l.id === id);

    if (leave) {
      // Switch to the correct tab
      const tabMap = {
        PENDING: "PENDING",
        APPROVED: "APPROVED",
        REJECTED: "REJECTED",
        CANCELLED: "CANCELLED",
      };
      const targetTab = tabMap[leave.status] || "PENDING";
      setActiveTab(targetTab);

      setTimeout(() => {
        const el = rowRefs.current[id];
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        setHighlightedId(id);
        setTimeout(() => setHighlightedId(null), 2500);
      }, 150);
    } else {
      // Not on current page — fetch all to find it, then switch tab
      // Dispatch a broader fetch without status filter to locate the record
      dispatch(fetchMyLeaves({ page: 1, limit: 100 }));
    }
  }, [requestId, myLeaves, dispatch]);

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

  // In list view, myLeaves is already filtered by backend
  // In calendar view, myLeaves has all statuses
  const filteredLeaves = viewMode === "list" ? myLeaves : myLeaves.filter(l => l.status === activeTab);

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
          className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm shadow-blue-500/20 transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Apply Leave
        </button>
      </div>

      <LeaveBalanceWidget balances={balances} />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50/30 flex items-center justify-between px-4">
          <div className="flex">
            {["PENDING", "APPROVED", "REJECTED", "CANCELLED"].map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setViewMode("list"); }}
                className={`px-6 py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${activeTab === tab && viewMode === "list" ? "border-[#007aff] text-[#007aff]" : "border-transparent text-gray-400 hover:text-gray-700"}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button
            onClick={() => setViewMode(viewMode === "list" ? "calendar" : "list")}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${viewMode === "calendar" ? "bg-blue-50 text-[#007aff]" : "text-gray-500 hover:bg-gray-100"}`}
          >
            <CalendarDays className="h-4 w-4" />
            {viewMode === "list" ? "Calendar View" : "List View"}
          </button>
        </div>

        {viewMode === "list" ? (
          <>
            <MyLeavesListTable
              filteredLeaves={filteredLeaves}
              activeTab={activeTab}
              statusConfig={statusConfig}
              setCancelTarget={setCancelTarget}
              highlightedId={highlightedId}
              rowRefs={rowRefs}
            />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        ) : (
          <MyLeavesCalendarView
            currentMonthDate={currentMonthDate}
            setCurrentMonthDate={setCurrentMonthDate}
            daysInMonth={daysInMonth}
            blanks={blanks}
            getLeaveStatusForDay={getLeaveStatusForDay}
          />
        )}
      </div>

      <ApplyLeaveModal
        isApplyModalOpen={isApplyModalOpen}
        setIsApplyModalOpen={setIsApplyModalOpen}
        submitApplyLeave={submitApplyLeave}
        applyForm={applyForm}
        handleApplyChange={handleApplyChange}
        leaveTypes={leaveTypes}
        isSubmitting={isSubmitting}
      />

      <CancelLeaveModal
        cancelTarget={cancelTarget}
        setCancelTarget={setCancelTarget}
        cancelReason={cancelReason}
        setCancelReason={setCancelReason}
        handleCancelLeave={handleCancelLeave}
        isSubmitting={isSubmitting}
      />
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
