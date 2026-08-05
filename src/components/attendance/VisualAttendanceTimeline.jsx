"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentHrPolicy } from "@/store/entities/companyHrPoliciesSlice";
import { Coffee, Briefcase, Clock } from "lucide-react";

/**
 * Utility helper to convert time string (HH:MM / HH:MM:SS / 12h / 24h / ISO) to total minutes from midnight
 */
const getMinutesFromTime = (timeStr) => {
  if (!timeStr) return null;
  
  if (typeof timeStr === "string" && (timeStr.includes("T") || timeStr.includes("-"))) {
    const d = new Date(timeStr);
    if (!isNaN(d.getTime())) {
      return d.getHours() * 60 + d.getMinutes();
    }
  }

  if (typeof timeStr === "string" && (timeStr.toLowerCase().includes("am") || timeStr.toLowerCase().includes("pm"))) {
    const parts = timeStr.trim().split(" ");
    const isPm = parts[1].toLowerCase() === "pm";
    const [hStr, mStr] = parts[0].split(":");
    let h = parseInt(hStr, 10);
    const m = parseInt(mStr || "0", 10);
    if (isPm && h < 12) h += 12;
    if (!isPm && h === 12) h = 0;
    return h * 60 + m;
  }

  if (typeof timeStr === "string" && timeStr.includes(":")) {
    const [hStr, mStr] = timeStr.split(":");
    return parseInt(hStr, 10) * 60 + parseInt(mStr || "0", 10);
  }

  return null;
};

/**
 * Utility helper to format minutes from midnight into 12h time string (e.g., 01:00 PM)
 */
const formatMinutesTo12h = (totalMins) => {
  if (totalMins === null || isNaN(totalMins)) return "--:--";
  const normalizedMins = ((totalMins % 1440) + 1440) % 1440;
  let hours = Math.floor(normalizedMins / 60);
  const mins = Math.floor(normalizedMins % 60);
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")} ${period}`;
};

/**
 * Utility helper to format duration in minutes to human readable string (e.g., "30 mins" or "3h 30m")
 */
const formatDurationMins = (mins) => {
  if (!mins || mins <= 0) return "0 mins";
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  if (h === 0) return `${m} mins`;
  if (m === 0) return `${h} hrs`;
  return `${h}h ${m}m`;
};

export default function VisualAttendanceTimeline({
  checkIn,
  checkOut,
  logs = [],
  shiftStart,
  shiftEnd,
  breakStart,
  breakEnd,
  isWorking = false,
  compact = false,
  showLabels = true,
}) {
  const [activeTooltip, setActiveTooltip] = useState(null);
  const hrPolicy = useSelector(selectCurrentHrPolicy);

  const effectiveShiftStart = shiftStart || hrPolicy?.defaultShiftStartTime;
  const effectiveShiftEnd = shiftEnd || hrPolicy?.defaultShiftEndTime;
  const effectiveBreakStart = breakStart || hrPolicy?.defaultBreakStartTime;
  const effectiveBreakEnd = breakEnd || hrPolicy?.defaultBreakEndTime;

  const checkInMins = getMinutesFromTime(checkIn);
  let checkOutMins = getMinutesFromTime(checkOut);

  if (!checkOutMins && checkInMins !== null && isWorking) {
    const now = new Date();
    checkOutMins = now.getHours() * 60 + now.getMinutes();
  }

  if (checkInMins === null) {
    return (
      <div className="w-full flex items-center justify-center py-2 text-xs text-gray-400 font-semibold italic">
        No check-in record available
      </div>
    );
  }

  // Dynamic shift window bounds derived from props or HR Policy
  const defaultStart = getMinutesFromTime(effectiveShiftStart);
  const defaultEnd = getMinutesFromTime(effectiveShiftEnd);

  const effectiveOut = checkOutMins !== null ? checkOutMins : Math.max(checkInMins + 1, (defaultStart !== null ? defaultStart + 60 : checkInMins + 60));
  const windowStart = defaultStart !== null ? Math.min(defaultStart, checkInMins) : checkInMins;
  const windowEnd = defaultEnd !== null ? Math.max(defaultEnd, effectiveOut) : effectiveOut;
  const totalWindowSpan = Math.max(windowEnd - windowStart, 1);

  const getPercent = (timeMins) => {
    const clamped = Math.max(windowStart, Math.min(windowEnd, timeMins));
    return ((clamped - windowStart) / totalWindowSpan) * 100;
  };

  // 1. Extract Lunch Break Intervals
  const rawBreaks = [];
  if (logs && logs.length > 0) {
    const sortedLogs = [...logs].sort(
      (a, b) => new Date(a.timestamp || a.punchTime) - new Date(b.timestamp || b.punchTime)
    );
    let currentBreakStart = null;
    for (const log of sortedLogs) {
      const type = log.actionType || log.punchType;
      const ts = log.timestamp || log.punchTime;
      if (type === "BREAK_START") {
        currentBreakStart = getMinutesFromTime(ts);
      } else if (type === "BREAK_END" && currentBreakStart !== null) {
        const breakEndMins = getMinutesFromTime(ts);
        if (breakEndMins > currentBreakStart) {
          rawBreaks.push({ start: currentBreakStart, end: breakEndMins });
        }
        currentBreakStart = null;
      }
    }
  }

  // Dynamic lunch break interval from policy / shift if no explicit break logs exist
  if (rawBreaks.length === 0) {
    const defaultLunchStart = getMinutesFromTime(effectiveBreakStart);
    const defaultLunchEnd = getMinutesFromTime(effectiveBreakEnd);
    if (defaultLunchStart !== null && defaultLunchEnd !== null) {
      if (checkInMins <= defaultLunchStart && effectiveOut > defaultLunchStart) {
        rawBreaks.push({ start: defaultLunchStart, end: Math.min(defaultLunchEnd, effectiveOut), isDefault: true });
      }
    }
  }

  // Filter breaks: A break is ONLY valid for this record if its start time is AFTER/AT check-in and BEFORE check-out
  const validBreaks = rawBreaks.filter(
    (brk) => brk.start >= checkInMins && brk.start < effectiveOut
  );

  // Work Segments: Split [checkInMins, effectiveOut] around overlapping valid breaks
  const workSegments = [];
  let workCursor = checkInMins;

  validBreaks.forEach((brk) => {
    if (brk.start > workCursor && brk.start < effectiveOut) {
      const segEnd = Math.min(brk.start, effectiveOut);
      if (segEnd > workCursor) {
        workSegments.push({ start: workCursor, end: segEnd, duration: segEnd - workCursor });
      }
      workCursor = Math.max(workCursor, brk.end);
    } else if (brk.end > workCursor) {
      workCursor = Math.max(workCursor, brk.end);
    }
  });

  if (workCursor < effectiveOut) {
    workSegments.push({ start: workCursor, end: effectiveOut, duration: effectiveOut - workCursor });
  }

  const checkInPercent = getPercent(checkInMins);
  const checkOutPercent = getPercent(effectiveOut);

  return (
    <div className="w-full select-none py-1">
      {showLabels && (
        <div className="flex justify-between items-center mb-2 px-1 text-xs font-bold text-slate-700">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100"></div>
            <span>In: {formatMinutesTo12h(checkInMins)}</span>
          </div>
          {validBreaks.length > 0 && (
            <div className="hidden sm:flex items-center gap-1 text-[11px] text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
              <Coffee className="w-3 h-3 text-amber-500" />
              <span>Lunch Break: {formatMinutesTo12h(validBreaks[0].start)} – {formatMinutesTo12h(validBreaks[0].end)}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <span>Out: {checkOutMins ? formatMinutesTo12h(checkOutMins) : "Working"}</span>
            <div className={`w-2.5 h-2.5 rounded-full ${checkOutMins ? "bg-rose-500 ring-2 ring-rose-100" : "bg-emerald-500 animate-ping"}`}></div>
          </div>
        </div>
      )}

      {/* Main Timeline Track */}
      <div className={`relative w-full ${compact ? "h-[3px]" : "h-1.5"} bg-slate-100 rounded-full flex items-center overflow-visible border-0`}>
        {/* Render Break Intervals on Track */}
        {validBreaks.map((brk, idx) => {
          const brkStartPct = getPercent(brk.start);
          const brkEndPct = getPercent(brk.end);
          const brkWidth = Math.max(brkEndPct - brkStartPct, 0.5);

          return (
            <React.Fragment key={`break-${idx}`}>
              <div
                onMouseEnter={() => setActiveTooltip({ type: "BREAK", start: brk.start, end: brk.end, isDefault: brk.isDefault, id: `brk-${idx}` })}
                onMouseLeave={() => setActiveTooltip(null)}
                className="absolute h-full bg-amber-500 hover:bg-amber-600 transition-colors cursor-pointer z-10 rounded-xs"
                style={{ left: `${brkStartPct}%`, width: `${brkWidth}%` }}
              >
                {activeTooltip?.id === `brk-${idx}` && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                    <div className="bg-slate-900/95 text-white rounded-xl py-2 px-3 shadow-xl backdrop-blur-md border border-slate-700/50 text-left min-w-[140px] whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase mb-1 border-b border-slate-700/60 pb-1 text-amber-400">
                        <Coffee className="w-3.5 h-3.5 text-amber-400" />
                        <span>Lunch Break</span>
                      </div>
                      <div className="text-xs font-extrabold text-slate-100">
                        {formatMinutesTo12h(brk.start)} – {formatMinutesTo12h(brk.end)}
                      </div>
                      <div className="text-[10px] font-medium text-slate-400 mt-0.5">
                        Duration: {formatDurationMins(brk.end - brk.start)}
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-slate-900 rotate-45 mx-auto -mt-1 border-r border-b border-slate-700/50"></div>
                  </div>
                )}
              </div>

              {/* Small Orange Break Dots */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 ${compact ? "w-1.5 h-1.5" : "w-2 h-2"} rounded-full bg-amber-500 ring-2 ring-white`}
                style={{ left: `${brkStartPct}%` }}
                title={`Break Start: ${formatMinutesTo12h(brk.start)}`}
              ></div>
              <div
                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 ${compact ? "w-1.5 h-1.5" : "w-2 h-2"} rounded-full bg-amber-500 ring-2 ring-white`}
                style={{ left: `${brkEndPct}%` }}
                title={`Break End: ${formatMinutesTo12h(brk.end)}`}
              ></div>
            </React.Fragment>
          );
        })}

        {/* Render Work Segments (Green line starting EXACTLY from check-in time) */}
        {workSegments.map((seg, idx) => {
          const segStartPct = getPercent(seg.start);
          const segEndPct = getPercent(seg.end);
          const segWidth = Math.max(segEndPct - segStartPct, 0.5);

          return (
            <div
              key={`work-${idx}`}
              onMouseEnter={() => setActiveTooltip({ type: "WORK", start: seg.start, end: seg.end, id: `work-${idx}` })}
              onMouseLeave={() => setActiveTooltip(null)}
              className="absolute h-full bg-emerald-400 hover:bg-emerald-500 transition-colors cursor-pointer z-15 rounded-full"
              style={{ left: `${segStartPct}%`, width: `${segWidth}%` }}
            >
              {activeTooltip?.id === `work-${idx}` && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                  <div className="bg-slate-900/95 text-white rounded-xl py-2 px-3 shadow-xl backdrop-blur-md border border-slate-700/50 text-left min-w-[140px] whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase mb-1 border-b border-slate-700/60 pb-1 text-emerald-400">
                      <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Working Time</span>
                    </div>
                    <div className="text-xs font-extrabold text-slate-100">
                      {formatMinutesTo12h(seg.start)} – {formatMinutesTo12h(seg.end)}
                    </div>
                    <div className="text-[10px] font-medium text-slate-400 mt-0.5">
                      Duration: {formatDurationMins(seg.end - seg.start)}
                    </div>
                  </div>
                  <div className="w-2 h-2 bg-slate-900 rotate-45 mx-auto -mt-1 border-r border-b border-slate-700/50"></div>
                </div>
              )}
            </div>
          );
        })}

        {/* Check-In Start Marker Dot (Placed EXACTLY at check-in time position) */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 ${compact ? "w-2.5 h-2.5" : "w-3 h-3"} rounded-full bg-emerald-500 ring-2 ring-white shadow-xs flex items-center justify-center`}
          style={{ left: `${checkInPercent}%` }}
          title={`Check-In: ${formatMinutesTo12h(checkInMins)}`}
        >
          <div className="w-1 h-1 rounded-full bg-white"></div>
        </div>

        {/* Check-Out / Active Working Marker Dot (Placed EXACTLY at check-out time position) */}
        {isWorking && (!checkOut || checkOutMins === null || checkOutMins === undefined) ? (
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 flex items-center justify-center"
            style={{ left: `${checkOutPercent}%` }}
          >
            {/* Outer radar pulse */}
            <div className="absolute w-[18px] h-[18px] rounded-full bg-emerald-300 animate-radar"></div>
            {/* Main glowing dot */}
            <div className="w-[9px] h-[9px] bg-emerald-500 rounded-full ring-2 ring-white shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
          </div>
        ) : (
          <div
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 ${compact ? "w-2.5 h-2.5" : "w-3 h-3"} rounded-full bg-rose-500 ring-2 ring-white shadow-xs flex items-center justify-center`}
            style={{ left: `${checkOutPercent}%` }}
            title={`Check-Out: ${formatMinutesTo12h(effectiveOut)}`}
          >
            <div className="w-1 h-1 rounded-full bg-white"></div>
          </div>
        )}
      </div>

      {/* Legend Footer */}
      {!compact && (
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mt-2 px-1">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
              <span>Working Time</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span>
              <span>Lunch Break (30m)</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 font-medium hidden xs:block">
            Shift: {formatMinutesTo12h(windowStart)} – {formatMinutesTo12h(windowEnd)}
          </div>
        </div>
      )}
    </div>
  );
}
