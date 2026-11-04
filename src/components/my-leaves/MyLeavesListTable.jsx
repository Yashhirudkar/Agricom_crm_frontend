import React from "react";
import { format, parseISO } from "date-fns";
import { AlertCircle } from "lucide-react";

export default function MyLeavesListTable({
  filteredLeaves,
  activeTab,
  statusConfig,
  setCancelTarget,
  highlightedId,
  rowRefs,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/10 text-gray-400 uppercase tracking-widest text-[10px] font-bold">
            <th className="px-6 py-4">Leave Type</th>
            <th className="px-6 py-4">Date Range</th>
            <th className="px-6 py-4">Days</th>
            <th className="px-6 py-4">Work Handover</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Approver / History</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-xs">
          {filteredLeaves.length > 0 ? (
            filteredLeaves.map((leave, idx) => {
              const isCancelledAfterApproval =
                leave.status === "CANCELLED_AFTER_APPROVAL" ||
                leave.cancelledAfterApproval;
              const currentStatus = isCancelledAfterApproval
                ? "CANCELLED_AFTER_APPROVAL"
                : leave.status;
              const StatusIcon =
                statusConfig[currentStatus]?.icon || AlertCircle;

              return (
                <tr
                  key={leave.id || idx}
                  ref={(el) => {
                    if (rowRefs && el) rowRefs.current[leave.id] = el;
                  }}
                  className="hover:bg-gray-50/70 transition-colors"
                  style={
                    highlightedId === leave.id
                      ? {
                          animation: "notif-highlight 2.5s ease-out forwards",
                        }
                      : {}
                  }
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-800">
                      {leave.leaveType?.name}
                    </div>
                    {leave.isHalfDay && (
                      <span className="text-[10px] text-purple-500 font-medium">
                        Half Day
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {format(parseISO(leave.fromDate), "MMM dd, yyyy")}
                    {leave.fromDate !== leave.toDate &&
                      ` - ${format(parseISO(leave.toDate), "MMM dd, yyyy")}`}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-700">
                    {leave.totalDays}
                  </td>
                  <td className="px-6 py-4">
                    {leave.handoverUsers && leave.handoverUsers.length > 0 ? (
                      <div className="flex flex-wrap gap-1 max-w-[220px]">
                        {leave.handoverUsers.map((hu) => (
                          <span
                            key={hu.id || hu.userId}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50/70 border border-blue-100 text-[#007aff] rounded-md text-[11px] font-medium"
                          >
                            <span>👤</span>
                            <span>{hu.name || hu.user?.name || "Colleague"}</span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-300 text-[11px]">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                        statusConfig[currentStatus]?.className ||
                        "bg-gray-50 text-gray-500 border border-gray-100"
                      }`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusConfig[currentStatus]?.label || currentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {leave.status === "PENDING" ? (
                      "-"
                    ) : isCancelledAfterApproval ? (
                      <div className="space-y-1 max-w-xs">
                        <div>
                          <span className="text-[9.5px] font-bold uppercase tracking-wider text-gray-400 block">
                            Cancelled By
                          </span>
                          <span className="font-semibold text-gray-800 text-[11px] block">
                            {leave.cancelledByName ||
                              leave.cancelledBy ||
                              "HR Manager"}
                          </span>
                          {leave.cancelledAt && (
                            <span className="text-[10px] text-gray-400 block">
                              {format(
                                parseISO(leave.cancelledAt),
                                "dd-MMM-yyyy hh:mm a"
                              )}
                            </span>
                          )}
                        </div>
                        {leave.cancellationReason && (
                          <div className="text-[10.5px] text-gray-600 bg-amber-50/60 p-2 rounded-lg border border-amber-200/50 mt-1">
                            <span className="font-bold text-gray-500 text-[9.5px] uppercase tracking-wider block mb-0.5">
                              Cancellation Reason:
                            </span>
                            &quot;{leave.cancellationReason}&quot;
                          </div>
                        )}
                        {leave.approverName && (
                          <div className="text-[10px] text-gray-400 pt-0.5">
                            Approved by:{" "}
                            <span className="font-medium text-gray-600">
                              {leave.approverName}
                            </span>
                            {leave.approvedAt &&
                              ` (${format(parseISO(leave.approvedAt), "dd-MMM-yyyy")})`}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div className="font-semibold text-gray-700">
                          {leave.approverName || "Former User"}
                        </div>
                        {leave.approvedAt && (
                          <div className="text-[10px] text-gray-400 mt-0.5">
                            {format(parseISO(leave.approvedAt), "MMM dd, yyyy")}
                          </div>
                        )}
                        {leave.rejectedReason && (
                          <div className="text-[10px] text-red-500 mt-1 italic">
                            &quot;{leave.rejectedReason}&quot;
                          </div>
                        )}
                        {leave.remarks && (
                          <div className="text-[10px] text-gray-400 mt-1 italic">
                            &quot;{leave.remarks}&quot;
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {leave.status === "PENDING" && (
                      <button
                        onClick={() => setCancelTarget(leave)}
                        className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors cursor-pointer"
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
              <td
                colSpan="7"
                className="px-6 py-12 text-center text-gray-400 font-semibold"
              >
                No {activeTab.toLowerCase()} leave requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
