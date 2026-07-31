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
                <tr
                  key={leave.id || idx}
                  ref={(el) => { if (rowRefs && el) rowRefs.current[leave.id] = el; }}
                  className="hover:bg-gray-50/70 transition-colors"
                  style={highlightedId === leave.id ? {
                    animation: 'notif-highlight 2.5s ease-out forwards',
                  } : {}}
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
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                        statusConfig[leave.status]?.className
                      }`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusConfig[leave.status]?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {leave.status === "PENDING" ? (
                      "-"
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
                      </div>
                    )}
                    {leave.remarks && (
                      <div className="text-[10px] text-gray-400 mt-1 italic">
                        "{leave.remarks}"
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
                colSpan="6"
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
