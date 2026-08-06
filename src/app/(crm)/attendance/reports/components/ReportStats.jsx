import React from "react";
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Clock, CalendarRange } from "lucide-react";

/**
 * Format string like "09:30" or "18:00" or ISO to "09:30 AM" / "06:00 PM"
 */
const formatPolicyTime = (timeStr, defaultStr = "09:30 AM") => {
  if (!timeStr) return defaultStr;
  if (typeof timeStr === "string" && (timeStr.toLowerCase().includes("am") || timeStr.toLowerCase().includes("pm"))) {
    return timeStr;
  }
  if (typeof timeStr === "string" && timeStr.includes(":")) {
    const [hStr, mStr] = timeStr.split(":");
    let h = parseInt(hStr, 10);
    const m = parseInt(mStr || "0", 10);
    if (isNaN(h)) return defaultStr;
    const period = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
  }
  return defaultStr;
};

/**
 * Calculate Grace End Time string given start time and grace minutes
 */
const calculateGraceEnd = (startTimeStr = "09:30", graceMins = 5) => {
  if (!startTimeStr || !startTimeStr.includes(":")) return "09:35";
  const [hStr, mStr] = startTimeStr.split(":");
  let h = parseInt(hStr, 10);
  let m = parseInt(mStr || "0", 10);
  if (isNaN(h) || isNaN(m)) return "09:35";

  m += graceMins;
  if (m >= 60) {
    h += Math.floor(m / 60);
    m = m % 60;
  }
  h = h % 24;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

/**
 * Helper to convert decimal hours (e.g. 35.33) into "35h 20m"
 */
const formatHoursMins = (decimalHours) => {
  const num = parseFloat(decimalHours);
  if (!num || isNaN(num) || num <= 0) return "0h 0m";
  const h = Math.floor(num);
  const m = Math.round((num - h) * 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

export default function ReportStats({ stats, records = [], hrPolicy }) {
  const safeStats = stats || { present: 0, absent: 0, late: 0, halfDay: 0, overtime: 0 };

  const presentCount = records.length > 0
    ? records.filter(r => r.status === 'PRESENT').length
    : (safeStats.present || 0);

  const absentCount = records.length > 0
    ? records.filter(r => r.status === 'ABSENT').length
    : (safeStats.absent || 0);

  const lateCount = records.length > 0
    ? records.filter(r => r.isLate || (r.lateMinutes && r.lateMinutes > 0)).length
    : (safeStats.lateCount ?? safeStats.late ?? 0);

  const lateThreshold = hrPolicy?.monthlyLateThreshold ?? 3;

  // Dynamic Grace Window calculations derived directly from HR policy
  const shiftStartRaw = hrPolicy?.defaultShiftStartTime || "09:30";
  const graceMinutes = hrPolicy?.lateComingGraceMinutes ?? 5;
  const graceStartFormatted = formatPolicyTime(shiftStartRaw, "09:30 AM");
  const graceEndRaw = calculateGraceEnd(shiftStartRaw, graceMinutes);
  const graceEndFormatted = formatPolicyTime(graceEndRaw, "09:35 AM");
  const graceWindowStr = `${graceStartFormatted} – ${graceEndFormatted}`;

  // Compute total working hours from records or stats if available
  const totalWorkHoursVal = records.length > 0
    ? records.reduce((acc, r) => acc + (parseFloat(r.workHours) || 0), 0)
    : (safeStats.totalWorkHours || 0);

  const totalOvertimeVal = records.length > 0
    ? records.reduce((acc, r) => acc + (parseFloat(r.overtime) || 0), 0)
    : (safeStats.totalOvertimeHours || 0);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">

      {/* 🟢 Present */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Present</span>
          <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-xl font-bold text-slate-900 leading-none">{presentCount}</div>
          <div className="text-[11px] font-medium text-emerald-700 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
            Days Present
          </div>
        </div>
      </div>

      {/* 🔴 Absent */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Absent</span>
          <div className="w-6 h-6 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center">
            <XCircle className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-xl font-bold text-slate-900 leading-none">{absentCount}</div>
          <div className="text-[11px] font-medium text-rose-700 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block"></span>
            Days Absent
          </div>
        </div>
      </div>

      {/* 🟠 Late Marks */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Late Marks</span>
          <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-xl font-bold text-slate-900 leading-none">{lateCount}</div>
          <div className="text-[11px] font-medium text-slate-500 mt-1">
            Monthly Tracker ({lateCount}/{lateThreshold})
          </div>
        </div>
      </div>

      {/* 🟣 Working Hours */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Working Hours</span>
          <div className="w-6 h-6 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center">
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-xl font-bold text-slate-900 leading-none">
            {formatHoursMins(totalWorkHoursVal)}
          </div>
          <div className="text-[11px] font-medium text-purple-700 mt-1">
            Total Duration
          </div>
        </div>
      </div>

      {/* 🔵 Overtime */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Overtime</span>
          <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
            <CalendarRange className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-xl font-bold text-slate-900 leading-none">
            {formatHoursMins(totalOvertimeVal)}
          </div>
          <div className="text-[11px] font-medium text-blue-700 mt-1">
            Approved OT
          </div>
        </div>
      </div>

    </div>
  );
}