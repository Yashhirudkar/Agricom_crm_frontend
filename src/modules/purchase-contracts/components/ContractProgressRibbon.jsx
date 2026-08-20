"use client";
import React from "react";
import { Check, Clock, AlertTriangle, Circle } from "lucide-react";

const LIFECYCLE_STAGES = [
  { key: "Draft", label: "Draft Stage" },
  { key: "In Progress", label: "In Progress" },
  { key: "Awaiting Documents", label: "Awaiting Docs" },
  { key: "Ready for Dispatch", label: "Ready for Dispatch" },
  { key: "Completed", label: "Completed" },
  { key: "Closed", label: "Closed" },
];

export default function ContractProgressRibbon({ currentStatus = "Draft" }) {
  if (currentStatus === "Cancelled") {
    return (
      <div className="bg-red-950/40 border border-red-900/50 rounded-2xl p-4 flex items-center gap-3 text-red-300">
        <AlertTriangle className="h-5 w-5 text-red-400" />
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider">Contract Cancelled</h4>
          <p className="text-[11px] text-red-400/80">
            This operational purchase contract has been marked as cancelled. No further dispatch actions can be executed.
          </p>
        </div>
      </div>
    );
  }

  const currentIdx = LIFECYCLE_STAGES.findIndex((s) => s.key === currentStatus);

  return (
    <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-purple-600" />
          Execution Lifecycle Ribbon
        </span>
        <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100 font-mono">
          Stage {currentIdx >= 0 ? currentIdx + 1 : 1} of {LIFECYCLE_STAGES.length}: {currentStatus}
        </span>
      </div>

      {/* Ribbon Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {LIFECYCLE_STAGES.map((stage, idx) => {
          const isPassed = currentIdx > idx;
          const isCurrent = currentIdx === idx;

          let cardStyle = "bg-gray-50 border-gray-200 text-gray-400";
          let badgeIcon = <Circle className="h-3.5 w-3.5 stroke-[1.5]" />;

          if (isPassed) {
            cardStyle = "bg-emerald-50/70 border-emerald-200 text-emerald-800 font-semibold";
            badgeIcon = <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[3]" />;
          } else if (isCurrent) {
            cardStyle = "bg-purple-600 text-white border-purple-600 font-bold shadow-md shadow-purple-600/20 ring-2 ring-purple-300/50";
            badgeIcon = <Clock className="h-3.5 w-3.5 text-purple-200 animate-spin" />;
          }

          return (
            <div
              key={stage.key}
              className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${cardStyle}`}
            >
              <div className="truncate">
                <div className="text-[9px] opacity-75 font-mono uppercase tracking-wider">
                  Step 0{idx + 1}
                </div>
                <div className="font-bold truncate mt-0.5">{stage.label}</div>
              </div>
              <div className="ml-1 flex-shrink-0">{badgeIcon}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
