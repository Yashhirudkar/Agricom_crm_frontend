import React from "react";
import { getScheduleStatus } from "../utils/scheduleUtils";

export default function ScheduleBadge({ date }) {
  const daysDiff = getScheduleStatus(date);

  if (daysDiff === null || isNaN(daysDiff)) {
    return <span className="text-gray-400">—</span>;
  }

  if (daysDiff === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200 shadow-xs">
        <span className="h-1.5 w-1.5 rounded-full bg-gray-500"></span>
        Today
      </span>
    );
  }

  if (daysDiff > 0) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 shadow-xs">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
        + {daysDiff} Days
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 shadow-xs">
      <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
      - {Math.abs(daysDiff)} Days
    </span>
  );
}
