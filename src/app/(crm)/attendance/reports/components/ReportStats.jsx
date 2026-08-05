import React from "react";
import { CheckCircle, XCircle, AlertTriangle, Clock, CalendarRange } from "lucide-react";

export default function ReportStats({ stats }) {
  const safeStats = stats || { present: 0, absent: 0, late: 0, halfDay: 0, overtime: 0 };

  return (
    <div className="bg-white border border-gray-200 p-1 md:p-1.2 sm:p-1.5">
      <div className="flex flex-wrap md:flex-nowrap items-center gap-y-3 md:gap-y-0 md:divide-x md:divide-gray-200">

        {/* Present */}
        <div className="flex items-center justify-right gap-6 w-[48%] md:flex-1 md:px-2">
          <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" /> Present
          </div>
          <div className="text-md font-black text-gray-900">{safeStats.present}</div>
        </div>

        {/* Absent */}
        <div className="flex items-center justify-right gap-6 w-[48%] md:flex-1 md:px-2">
          <div className="text-[11px] font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" /> Absent
          </div>
          <div className="text-md font-black text-gray-900">{safeStats.absent}</div>
        </div>

        {/* Late Count */}
        <div className="flex items-center justify-right gap-6 w-[48%] md:flex-1 md:px-2">
          <div className="text-[11px] font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> Late Count
          </div>
          <div className="text-md font-black text-gray-900">{safeStats.lateCount ?? safeStats.late ?? 0}</div>
        </div>

        {/* Half Day */}
        <div className="flex items-center justify-right gap-6 w-[48%] md:flex-1 md:px-2">
          <div className="text-[11px] font-bold text-orange-600 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Half Day
          </div>
          <div className="text-md font-black text-gray-900">{safeStats.halfDay}</div>
        </div>

        {/* Overtime */}
        <div className="flex items-center justify-right gap-6 w-full md:flex-1 md:px-2">
          <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
            <CalendarRange className="w-3.5 h-3.5" /> Overtime
          </div>
          <div className="text-md font-black text-gray-900">{safeStats.totalOvertimeHours || 0} h</div>
        </div>

      </div>
    </div>
  );
}