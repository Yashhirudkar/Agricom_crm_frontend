import React from "react";
import { Clock, Coffee, Briefcase, ShieldCheck, LogOut, AlertCircle } from "lucide-react";

/**
 * Format string like "09:30" or "18:00" or ISO to "09:30 AM" / "06:00 PM"
 */
const formatPolicyTime = (timeStr, defaultStr = "") => {
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
const calculateGraceEnd = (startTimeStr, graceMins = 5) => {
  if (!startTimeStr) return "09:35";
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

export default function PolicyInfoBar({ hrPolicy }) {
  const shiftStartRaw = hrPolicy?.defaultShiftStartTime || "09:30";
  const shiftEndRaw = hrPolicy?.defaultShiftEndTime || "18:00";
  const breakStartRaw = hrPolicy?.defaultBreakStartTime || "13:00";
  const breakEndRaw = hrPolicy?.defaultBreakEndTime || "13:30";

  const shiftStartFormatted = formatPolicyTime(shiftStartRaw, "09:30 AM");
  const shiftEndFormatted = formatPolicyTime(shiftEndRaw, "06:00 PM");
  const shiftStr = `${shiftStartFormatted} – ${shiftEndFormatted}`;

  const breakStartFormatted = formatPolicyTime(breakStartRaw, "01:00 PM");
  const breakEndFormatted = formatPolicyTime(breakEndRaw, "01:30 PM");
  const breakStr = hrPolicy?.defaultBreakMinutes
    ? `${breakStartFormatted} – ${breakEndFormatted} (${hrPolicy.defaultBreakMinutes}m)`
    : `${breakStartFormatted} – ${breakEndFormatted}`;

  const requiredHours = hrPolicy?.defaultWorkingHoursPerDay ?? hrPolicy?.minHoursForPresent ?? 7;
  const graceMinutes = hrPolicy?.lateComingGraceMinutes ?? 5;

  const graceStartShort = shiftStartRaw.slice(0, 5);
  const graceEndShort = calculateGraceEnd(shiftStartRaw, graceMinutes);
  const graceStr = `${graceStartShort} – ${graceEndShort} (${graceMinutes}m)`;

  const checkoutGrace = hrPolicy?.checkoutGraceMinutes ?? 15;
  const lateThreshold = hrPolicy?.monthlyLateThreshold ?? 3;

  return (
    <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl px-4 py-2.5 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-xs">

        {/* Shift */}
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="text-slate-500 font-medium">Shift:</span>
          <span className="font-semibold text-slate-800">{shiftStr}</span>
        </div>

        {/* Break */}
        <div className="flex items-center gap-1.5">
          <Coffee className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="text-slate-500 font-medium">Break:</span>
          <span className="font-semibold text-slate-800">{breakStr}</span>
        </div>

        {/* Required Hours */}
        <div className="flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="text-slate-500 font-medium">Required Hours:</span>
          <span className="font-semibold text-slate-800">{requiredHours} Hours</span>
        </div>

        {/* Grace */}
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="text-slate-500 font-medium">Grace:</span>
          <span className="font-semibold text-slate-800">{graceStr}</span>
        </div>

        {/* Late Policy */}
        <div className="flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="text-slate-500 font-medium">Late Policy:</span>
          <span className="font-semibold text-slate-800">{lateThreshold} Marks / Month</span>
        </div>

      </div>
    </div>
  );
}
