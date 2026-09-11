"use client";

import { useEffect, useState, useRef, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/store/slices/authSlice";
import { selectActiveCompanyId } from "@/store/slices/companyContextSlice";
import {
  // Keep these Redux actions — approve/reject/cancel still go through Redux
  approveLeave,
  rejectLeave,
} from "@/store/entities/leaveRequestsSlice";
import {
  useInfiniteLeaveApprovals,
  useManagerSummaryStats,
  useLeaveApprovalsInvalidator,
} from "@/hooks/useInfiniteLeaveApprovals";
import { subscribeToSocketEvent, unsubscribeFromSocketEvent } from "@/lib/socket";
import Modal from "@/components/modals/Modal";
import HasPermission from "@/components/rbac/HasPermission";
import VirtualizedLeaveGrid from "@/components/hrms/VirtualizedLeaveGrid";
import {
  Check,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { getFriendlyError } from "@/lib/errorMessages";
import axiosClient from "@/lib/axios";

// ------------------------------------------------------------------ //

function LeaveApprovalsContent() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const activeCompanyId = useSelector(selectActiveCompanyId);
  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestId");

  // ---- Tabs ----
  const [activeTab, setActiveTab] = useState("PENDING");

  // ---- Infinite scroll data (React Query, NOT Redux) ----
  const {
    items,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteLeaveApprovals(activeTab, activeCompanyId);

  // ---- Summary stats (independent from infinite scroll) ----
  const { data: statsData } = useManagerSummaryStats(activeCompanyId);
  const summaryStats = statsData ?? {
    onLeaveToday: 0,
    totalRequests: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    totalLeaveDays: 0,
  };

  // ---- Socket invalidation ----
  const invalidateLeaveQueries = useLeaveApprovalsInvalidator(activeCompanyId);

  useEffect(() => {
    const handleNotification = (payload) => {
      const entityType = (payload?.entityType || "").toUpperCase();
      if (entityType === "LEAVE_REQUEST") {
        // Only invalidate the affected queries — not all leave data
        invalidateLeaveQueries();
      }
    };
    subscribeToSocketEvent("notification", handleNotification);
    return () => unsubscribeFromSocketEvent("notification", handleNotification);
  }, [invalidateLeaveQueries]);

  // ---- Toast ----
  const [toast, setToast] = useState(null);
  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ---- Approve ----
  const [loadingId, setLoadingId] = useState(null);

  const handleApprove = useCallback(
    async (leaveId) => {
      if (loadingId) return;
      setLoadingId(leaveId);
      try {
        await dispatch(
          approveLeave({ id: leaveId, remarks: "Approved by manager" })
        ).unwrap();
        showToast("Leave approved successfully");
        // Invalidate the React Query cache — refetch both tabs + stats
        invalidateLeaveQueries();
      } catch (err) {
        showToast(getFriendlyError(err), "error");
      } finally {
        setLoadingId(null);
      }
    },
    [dispatch, invalidateLeaveQueries, loadingId, showToast]
  );

  // ---- Reject modal ----
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectRemarks, setRejectRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRejectClick = useCallback((leave) => {
    setRejectTarget(leave);
    setRejectRemarks("");
  }, []);

  const handleReject = useCallback(async () => {
    if (!rejectRemarks.trim()) {
      showToast("Rejection remarks are mandatory", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      await dispatch(
        rejectLeave({ id: rejectTarget.id, remarks: rejectRemarks })
      ).unwrap();
      showToast("Leave rejected successfully");
      setRejectTarget(null);
      setRejectRemarks("");
      invalidateLeaveQueries();
    } catch (err) {
      showToast(getFriendlyError(err), "error");
    } finally {
      setIsSubmitting(false);
    }
  }, [dispatch, invalidateLeaveQueries, rejectRemarks, rejectTarget, showToast]);

  // ---- Deep-link: ?requestId=123 ----
  // With virtualization the card may not be in DOM.
  // Instead fetch the individual request and highlight it.
  const [highlightedId, setHighlightedId] = useState(null);
  const cardRefs = useRef({});

  useEffect(() => {
    if (!requestId || !activeCompanyId) return;
    const id = parseInt(requestId, 10);

    // First check if the card is already loaded in the current pages
    const existing = items.find((l) => l.id === id);
    if (existing) {
      const isPending = existing.status === "PENDING";
      setActiveTab(isPending ? "PENDING" : "HISTORY");
      setTimeout(() => {
        const el = cardRefs.current[id];
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        setHighlightedId(id);
        setTimeout(() => setHighlightedId(null), 2500);
      }, 150);
      return;
    }

    // Not yet loaded — fetch individually and switch tab
    axiosClient
      .get(`/leave-requests/${id}`)
      .then((res) => {
        const leave = res.data;
        if (!leave) return;
        const isPending = leave.status === "PENDING";
        setActiveTab(isPending ? "PENDING" : "HISTORY");
        setHighlightedId(id);
        setTimeout(() => setHighlightedId(null), 2500);
      })
      .catch(() => {
        // Silently ignore — deep-link is best-effort
      });
  }, [requestId, activeCompanyId]); // intentionally exclude items to avoid loop

  // ---- Pending count badge (from stats, not from loaded pages) ----
  const pendingCount = summaryStats.pending ?? 0;

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto space-y-6">
      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-xs font-bold text-white transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${
            toast.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {toast.type === "error" ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          {toast.msg}
        </div>
      )}

      {/* ---- Page header (unchanged) ---- */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <CheckCircle2 className="h-6 w-6 text-[#007aff]" />
          Leave Approvals &amp; Manager Analytics
        </h1>
        <p className="text-xs text-gray-400 font-medium mt-1">
          Review and take action on all leave requests from your team.
        </p>
      </div>

      {/* ---- Summary cards (now from manager-stats API, not loaded pages) ---- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white border border-gray-100 rounded-2xl p-3.5 shadow-xs">
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-purple-600 block">
            On Leave Today
          </span>
          <span className="text-xl font-black text-purple-700 block mt-0.5">
            {summaryStats.onLeaveToday}
          </span>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-3.5 shadow-xs">
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-gray-400 block">
            Total Requests
          </span>
          <span className="text-xl font-black text-gray-900 block mt-0.5">
            {summaryStats.totalRequests}
          </span>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-3.5 shadow-xs">
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-emerald-600 block">
            Approved
          </span>
          <span className="text-xl font-black text-emerald-600 block mt-0.5">
            {summaryStats.approved}
          </span>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-3.5 shadow-xs">
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-amber-600 block">
            Pending
          </span>
          <span className="text-xl font-black text-amber-600 block mt-0.5">
            {summaryStats.pending}
          </span>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-3.5 shadow-xs">
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-blue-100 block">
            Total Leave Days
          </span>
          <span className="text-xl font-black text-white block mt-0.5">
            {summaryStats.totalLeaveDays}{" "}
            <span className="text-[10px] font-normal">Days</span>
          </span>
        </div>
      </div>

      {/* ---- Tabs (unchanged) ---- */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("PENDING")}
          className={`pb-3 px-2 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${
            activeTab === "PENDING"
              ? "border-[#007aff] text-[#007aff]"
              : "border-transparent text-gray-400 hover:text-gray-700"
          }`}
        >
          Pending Requests
          {pendingCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("HISTORY")}
          className={`pb-3 px-2 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${
            activeTab === "HISTORY"
              ? "border-[#007aff] text-[#007aff]"
              : "border-transparent text-gray-400 hover:text-gray-700"
          }`}
        >
          Approval History
        </button>
      </div>

      {/* ---- Virtualized card grid ---- */}
      <VirtualizedLeaveGrid
        items={items}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        isError={isError}
        fetchNextPage={fetchNextPage}
        isActiveTabPending={activeTab === "PENDING"}
        loadingId={loadingId}
        highlightedId={highlightedId}
        cardRefs={cardRefs}
        onApprove={handleApprove}
        onRejectClick={handleRejectClick}
      />

      {/* ---- Reject modal (unchanged) ---- */}
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
                  You are about to reject the leave request for{" "}
                  <span className="font-bold">
                    {rejectTarget.employee?.firstName}{" "}
                    {rejectTarget.employee?.lastName}
                  </span>
                  .
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Rejection Remarks <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={rejectRemarks}
                onChange={(e) => setRejectRemarks(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                rows={3}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-gray-700 resize-none"
              />
              <p className="text-[10px] text-gray-400">
                Remarks are mandatory and will be visible to the employee.
              </p>
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
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
          <p className="text-xs font-semibold text-gray-400">Loading...</p>
        </div>
      }
    >
      <LeaveApprovalsContent />
    </Suspense>
  );
}
