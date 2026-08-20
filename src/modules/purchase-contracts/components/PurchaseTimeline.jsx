"use client";
import React from "react";
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Ship,
  Calendar,
  Anchor,
  Navigation,
  PackageCheck,
} from "lucide-react";

export default function PurchaseTimeline({ timeline = [], loading, contract }) {
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center animate-pulse">
        <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2 animate-bounce" />
        <span className="text-xs font-semibold text-gray-500">Loading execution timeline...</span>
      </div>
    );
  }

  const contractCreatedDate = contract?.createdAt
    ? new Date(contract.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              Operational Execution Timeline
            </h3>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Live status progression across all linked shipments & contract lifecycle events.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px]">
              🟢 Completed
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px]">
              🔵 Upcoming
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-[10px]">
              🔴 Overdue
            </span>
          </div>
        </div>
      </div>

      {/* Main Vertical Timeline Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs">
        <div className="relative border-l-2 border-purple-100 ml-4 pl-6 space-y-8">

          {/* Event 1: Contract Initialization */}
          <div className="relative">
            <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
              ✓
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-900 flex items-center gap-2">
                  <span>Purchase Contract Workspace Initialized</span>
                  <span className="text-[10px] bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0.2 rounded font-bold">
                    SYSTEM EVENT
                  </span>
                </h4>
                <span className="text-[10px] text-gray-400 font-mono">{contractCreatedDate}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Execution contract created from Sales Contract #{contract?.salesContract?.contractNumber || "—"}.
              </p>
            </div>
          </div>

          {/* Per-Shipment Milestone Timelines */}
          {timeline.map((item, idx) => {
            const isOverdue = item.isOverdue;
            const isCompleted = item.isCompleted;
            const statusColor = isCompleted
              ? "bg-emerald-500 text-white"
              : isOverdue
              ? "bg-red-500 text-white"
              : "bg-blue-500 text-white";

            const badgeStyle = isCompleted
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : isOverdue
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-blue-50 text-blue-700 border-blue-200";

            return (
              <div key={idx} className="relative group">
                <div className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full ${statusColor} flex items-center justify-center text-xs font-bold shadow-xs`}>
                  {isCompleted ? "✓" : isOverdue ? "!" : idx + 2}
                </div>

                <div className="bg-gray-50/70 border border-gray-200/80 rounded-xl p-4 space-y-3 hover:bg-white hover:shadow-xs transition-all">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Ship className="h-4 w-4 text-purple-600" />
                      <span className="text-xs font-bold font-mono text-gray-900">
                        {item.shipmentReference || `Shipment #${item.shipmentNo}`}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeStyle}`}>
                        {isCompleted
                          ? "Delivered"
                          : isOverdue
                          ? `Overdue ${Math.abs(item.daysRemaining)} Days`
                          : item.daysRemaining === 0
                          ? "Today"
                          : `In ${item.daysRemaining} Days`}
                      </span>
                    </div>

                    <div className="text-[11px] text-gray-500 font-medium">
                      Date: <span className="font-bold text-gray-800">{new Date(item.shipmentDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                    </div>
                  </div>

                  {/* Milestones Horizontal Bar */}
                  <div className="pt-2 border-t border-gray-200/60">
                    <div className="grid grid-cols-5 gap-1 text-[9px] font-bold text-center">
                      {(item.milestones || []).map((m, mIdx) => {
                        const mBg =
                          m.status === "completed"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                            : m.status === "active"
                            ? "bg-blue-100 text-blue-800 border-blue-300 animate-pulse"
                            : "bg-gray-100 text-gray-400 border-gray-200";
                        return (
                          <div key={mIdx} className={`p-1.5 rounded-lg border ${mBg}`}>
                            {m.label}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {timeline.length === 0 && (
            <div className="text-xs text-gray-400 py-6 italic">
              No active shipment milestone timelines available yet.
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
