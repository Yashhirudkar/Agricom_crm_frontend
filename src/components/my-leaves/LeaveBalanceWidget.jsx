import React from "react";

export default function LeaveBalanceWidget({ balances }) {
  if (balances.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-4">
        <div className="text-center py-6 text-xs text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
          No leave balances available.
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {balances.map((bal) => {
        const total = Number(bal.totalAllocated) || 0;
        const used = Number(bal.usedDays) || 0;
        const pending = Number(bal.pendingDays) || 0;
        const remaining = Number(bal.remainingDays) ?? total - used - pending;
        const usedPct = total > 0 ? Math.round((used / total) * 100) : 0;
        return (
          <div
            key={bal.id}
            className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-3 shadow-xs hover:shadow-sm transition-shadow"
          >
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              {bal.leaveType?.name}
            </span>
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
              <div className="text-[10px] text-amber-500 font-semibold">
                {pending} day{pending !== 1 ? "s" : ""} pending approval
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
