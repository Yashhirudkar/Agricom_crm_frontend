import React from "react";
import { Clock, History, AlertCircle } from "lucide-react";

export default function TodaySummary({ timeObj, todayRecord }) {
  const getBreakDuration = () => {
    if (!todayRecord?.logs || todayRecord.logs.length === 0) return "0h 0m";
    const logs = [...todayRecord.logs].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    let breakDurationMs = 0;
    let breakStart = null;
    for (const log of logs) {
      const actionType = log.actionType || log.punchType; // support legacy migration field mapping fallback
      const ts = log.timestamp || log.punchTime;
      if (actionType === "BREAK_START") {
        breakStart = new Date(ts).getTime();
      } else if (actionType === "BREAK_END" && breakStart) {
        breakDurationMs += new Date(ts).getTime() - breakStart;
        breakStart = null;
      }
    }
    if (breakStart && todayRecord.attendanceState === "ON_BREAK") {
      breakDurationMs += new Date().getTime() - breakStart;
    }
    const mins = Math.floor(breakDurationMs / (1000 * 60));
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  const getOvertime = () => {
    const ot = parseFloat(todayRecord?.overtimeHours || 0);
    if (!ot || isNaN(ot)) return "0h 0m";
    const hrs = Math.floor(ot);
    const mins = Math.round((ot - hrs) * 60);
    return `${hrs}h ${mins}m`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-gray-800">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Today's Summary</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center py-2 border-b border-gray-50">
          <div className="flex items-center gap-3 text-gray-600 font-medium text-sm">
            <Clock className="w-5 h-5 text-[#007aff]" /> Working Hours
          </div>
          <div className="font-bold text-gray-900 text-sm">
            {timeObj.h}h {timeObj.m}m
          </div>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-50">
          <div className="flex items-center gap-3 text-gray-600 font-medium text-sm">
            <History className="w-5 h-5 text-gray-400" /> Break Hours
          </div>
          <div className="font-bold text-gray-900 text-sm">{getBreakDuration()}</div>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-50">
          <div className="flex items-center gap-3 text-gray-600 font-medium text-sm">
            <AlertCircle className="w-5 h-5 text-red-400" /> Late By
          </div>
          <div className="font-bold text-red-500 text-sm">
            {todayRecord?.lateMinutes > 0
              ? `${todayRecord.lateMinutes}m`
              : "00h 00m"}
          </div>
        </div>
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center gap-3 text-gray-600 font-medium text-sm">
            <Clock className="w-5 h-5 text-gray-400" /> Overtime
          </div>
          <div className="font-bold text-gray-900 text-sm">{getOvertime()}</div>
        </div>
      </div>
    </div>
  );
}
