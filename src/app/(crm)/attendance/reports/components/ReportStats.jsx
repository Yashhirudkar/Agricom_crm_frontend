import React from "react";
import { CheckCircle, XCircle, AlertTriangle, Clock, CalendarRange } from "lucide-react";

export default function ReportStats({ stats }) {
  const safeStats = stats || { present: 0, absent: 0, late: 0, halfDay: 0, overtime: 0 };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-center">
        <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5 mb-2">
          <CheckCircle className="w-4 h-4" /> Present
        </div>
        <div className="text-3xl font-black text-gray-900">{safeStats.present}</div>
      </div>
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-center">
        <div className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5 mb-2">
          <XCircle className="w-4 h-4" /> Absent
        </div>
        <div className="text-3xl font-black text-gray-900">{safeStats.absent}</div>
      </div>
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-center">
        <div className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5 mb-2">
          <AlertTriangle className="w-4 h-4" /> Late
        </div>
        <div className="text-3xl font-black text-gray-900">{safeStats.late}</div>
      </div>
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-center">
        <div className="text-xs font-bold text-orange-600 uppercase tracking-wider flex items-center gap-1.5 mb-2">
          <Clock className="w-4 h-4" /> Half Day
        </div>
        <div className="text-3xl font-black text-gray-900">{safeStats.halfDay}</div>
      </div>
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-center">
        <div className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5 mb-2">
          <CalendarRange className="w-4 h-4" /> Overtime
        </div>
        <div className="text-3xl font-black text-gray-900">{safeStats.totalOvertimeHours || 0} h</div>
      </div>
    </div>
  );
}
