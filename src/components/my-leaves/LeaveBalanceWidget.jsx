import React from "react";
import { Calendar, HeartPulse, Clock } from "lucide-react";

export default function LeaveBalanceWidget({ balances }) {
  if (!balances || balances.length === 0) {
    return (
      <div className="py-4 px-6 text-xs text-slate-400 bg-white rounded-xl border border-dashed border-slate-200 text-center font-medium">
        No leave balances available.
      </div>
    );
  }

  const getTheme = (name = "") => {
    const n = name.toLowerCase();
    if (n.includes("casual")) {
      return {
        badge: "bg-blue-50 text-blue-600 border border-blue-100",
        bar: "bg-blue-500",
        icon: Calendar,
      };
    }
    if (n.includes("sick")) {
      return {
        badge: "bg-emerald-50 text-emerald-600 border border-emerald-100",
        bar: "bg-emerald-500",
        icon: HeartPulse,
      };
    }
    return {
      badge: "bg-purple-50 text-purple-600 border border-purple-100",
      bar: "bg-purple-500",
      icon: Clock,
    };
  };

  return (
    <div className="flex flex-wrap gap-3">
      {balances.map((bal) => {
        const total = Number(bal.totalAllocated) || 0;
        const used = Number(bal.usedDays) || 0;
        const pending = Number(bal.pendingDays) || 0;
        const remaining = Number(bal.remainingDays) ?? Math.max(0, total - used - pending);
        const usedPct = total > 0 ? Math.round((used / total) * 100) : 0;
        const theme = getTheme(bal.leaveType?.name);
        const IconComponent = theme.icon;

        return (
          <div
            key={bal.id}
            className="w-full sm:w-[210px] bg-white rounded-xl border border-slate-200/80 p-3 flex flex-col justify-between gap-2 shadow-2xs hover:shadow-xs transition-all"
          >
            {/* Header: Title + Icon Badge */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-slate-600 truncate max-w-[130px]">
                {bal.leaveType?.name}
              </span>
              <div className={`p-1 rounded-lg ${theme.badge}`}>
                <IconComponent className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Content: Big count & days left */}
            <div className="flex items-baseline gap-1.5 my-0.5">
              <span className="text-2xl font-black text-slate-900 leading-none">{remaining}</span>
              <span className="text-[11px] font-semibold text-slate-400">/ {total} days left</span>
            </div>

            {/* Progress & Subtext */}
            <div className="space-y-1">
              <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                <div
                  className={`h-1 rounded-full ${theme.bar} transition-all`}
                  style={{ width: `${Math.min(usedPct, 100)}%` }}
                />
              </div>
              <div className="text-[10px] font-semibold text-slate-400 flex justify-between">
                <span>Used: {used}</span>
                {pending > 0 ? (
                  <span className="text-amber-600 font-bold">{pending} pending</span>
                ) : (
                  <span className="text-emerald-600 font-medium">Active</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
