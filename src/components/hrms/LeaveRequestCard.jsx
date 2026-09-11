"use client";

/**
 * LeaveRequestCard
 *
 * Extracted from leave-approvals/page.jsx.
 * Visually identical to the original — no design changes.
 * Wrapped in React.memo to avoid unnecessary re-renders when the
 * virtualizer recalculates visible rows but card data hasn't changed.
 *
 * Uses stable `leaveRequest.id` as key (enforced by parent).
 */

import { memo } from "react";
import HasPermission from "@/components/rbac/HasPermission";
import {
  Check, AlertCircle, X, CheckCircle2, FileText, Calendar,
  Building2, Shield, Loader2,
} from "lucide-react";
import { format, parseISO } from "date-fns";

function LeaveRequestCard({
  leave,
  isActiveTabPending,
  loadingId,
  highlightedId,
  onApprove,
  onRejectClick,
}) {
  const isHighlighted = highlightedId === leave.id;

  return (
    <div
      className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col"
      style={
        isHighlighted
          ? { animation: "notif-highlight 2.5s ease-out forwards" }
          : undefined
      }
    >
      {/* ---- Header: avatar initials + status badge ---- */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-50 text-[#007aff] flex items-center justify-center font-bold text-sm">
            {leave.employee?.firstName?.charAt(0)}
            {leave.employee?.lastName?.charAt(0)}
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">
              {leave.employee?.firstName} {leave.employee?.lastName}
            </h3>
            <p className="text-[10px] text-gray-400 font-mono mt-0.5">
              {leave.employee?.employeeCode}
            </p>
          </div>
        </div>
        {leave.status !== "PENDING" && (
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              leave.status === "APPROVED"
                ? "bg-green-50 text-green-600"
                : leave.status === "REJECTED"
                ? "bg-red-50 text-red-600"
                : "bg-gray-50 text-gray-500"
            }`}
          >
            {leave.status}
          </span>
        )}
      </div>

      {/* ---- Body ---- */}
      <div className="space-y-3 flex-1">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Shield className="h-3.5 w-3.5 text-gray-400" />
          {leave.employee?.designation?.name || "No Designation"}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Building2 className="h-3.5 w-3.5 text-gray-400" />
          {leave.employee?.department?.name || "No Department"}
        </div>

        {/* Leave details block */}
        <div className="bg-gray-50 rounded-xl p-3 mt-2 border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Leave Details
            </span>
            <span className="text-xs font-bold text-[#007aff] bg-blue-50 px-2 py-0.5 rounded">
              {leave.leaveType?.name}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
            <Calendar className="h-4 w-4 text-gray-400" />
            {leave.fromDate ? format(parseISO(leave.fromDate), "MMM dd") : "—"}
            {leave.fromDate !== leave.toDate && leave.toDate
              ? ` - ${format(parseISO(leave.toDate), "MMM dd")}`
              : ""}
            <span className="text-gray-400 font-normal">
              ({leave.totalDays} {leave.totalDays === 1 ? "day" : "days"})
            </span>
          </div>
          {leave.isHalfDay && (
            <div className="text-[10px] text-purple-500 font-bold mt-1">
              Half Day
            </div>
          )}
        </div>

        {/* Reason */}
        <div className="text-xs text-gray-600 pt-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Reason
          </span>
          {leave.reason}
        </div>

        {/* Attachment */}
        {leave.attachmentUrl && (
          <div className="pt-2">
            <a
              href={leave.attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-[#007aff] text-[10px] font-bold rounded-lg hover:bg-blue-100 transition-colors"
            >
              <FileText className="h-3.5 w-3.5" /> View Attachment
            </a>
          </div>
        )}

        {/* Remarks (history only) */}
        {leave.status !== "PENDING" && leave.rejectedReason && (
          <div className="pt-3 border-t border-gray-100 mt-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Remarks
            </span>
            <p className="text-xs text-gray-600 italic">"{leave.rejectedReason}"</p>
          </div>
        )}
      </div>

      {/* ---- Approve / Reject actions (PENDING tab only) ---- */}
      {isActiveTabPending && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
          <HasPermission permission="leave:approve">
            <button
              onClick={() => onRejectClick(leave)}
              disabled={!!loadingId}
              className="flex-1 py-2 bg-white border border-red-200 text-red-600 rounded-xl hover:bg-red-50 text-xs font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <X className="h-4 w-4" /> Reject
            </button>
            <button
              onClick={() => onApprove(leave.id)}
              disabled={!!loadingId}
              className="flex-1 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 text-xs font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm shadow-green-500/20"
            >
              {loadingId === leave.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              {loadingId === leave.id ? "Approving..." : "Approve"}
            </button>
          </HasPermission>
        </div>
      )}
    </div>
  );
}

export default memo(LeaveRequestCard);
