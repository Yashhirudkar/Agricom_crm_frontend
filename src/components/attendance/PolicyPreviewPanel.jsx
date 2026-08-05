"use client";

import React from "react";
import { parse24to12 } from "@/components/common/EnterpriseTimePicker";
import { Clock, ShieldCheck, AlertTriangle, XCircle, CheckCircle2, Info, Sparkles } from "lucide-react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Pure presentation helper for time string formatting (24h -> 12h)
 */
const formatDisplay = (time24) => {
  if (time24 === null || time24 === undefined || time24 === "") return "—";
  const { h, m, period } = parse24to12(time24);
  if (!h || !m) return "—";
  return `${h}:${m} ${period}`;
};

export default function PolicyPreviewPanel({ preview }) {
  if (!preview || preview.isConfigured !== true) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2 text-[#007aff]">
            <ShieldCheck className="h-5 w-5" />
            <h3 className="text-sm font-bold tracking-tight text-gray-900">Policy Preview Engine</h3>
          </div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-[#007aff]">
            Live Engine
          </span>
        </div>
        <div className="py-10 text-center space-y-2">
          <Clock className="h-9 w-9 text-gray-300 mx-auto animate-pulse" />
          <p className="text-xs font-bold text-gray-800">Working Schedule Unconfigured</p>
          <p className="text-[11px] text-gray-400 max-w-xs mx-auto font-medium">
            Configure Office Start and End times to evaluate the backend policy engine in real time.
          </p>
        </div>
      </div>
    );
  }

  const {
    shiftStart,
    shiftEnd,
    graceStart,
    graceEnd,
    lateWindowStart,
    lateWindowEnd,
    halfDayStart,
    halfDayEnd,
    absentAfter,
    grossShiftHours,
    netWorkingHours,
    requiredWorkingHours,
    monthlyLateThreshold,
    latePenaltyAction,
    breakMinutes,
    checkoutGraceMinutes,
    weeklyOffDays = [],
  } = preview;

  return (
    <div className="space-y-6 sticky top-6">
      {/* Pure Backend Policy Summary Card (Zoho/Keka Minimalist White Theme) */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100/90 space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-[#007aff]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-gray-900 tracking-tight">
                Policy Rule Summary
              </h3>
              <p className="text-[11px] text-gray-400 font-medium">Evaluated Engine Metrics</p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-blue-50 text-[#007aff] border border-blue-100/60">
            Engine Output
          </span>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
              Active Shift
            </span>
            <p className="text-sm font-extrabold text-gray-900 font-mono">
              {formatDisplay(shiftStart)} – {formatDisplay(shiftEnd)}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
              Required Hours
            </span>
            <p className="text-sm font-extrabold text-emerald-600">
              {requiredWorkingHours !== null &&
              requiredWorkingHours !== undefined &&
              requiredWorkingHours !== ""
                ? `${requiredWorkingHours} Hours`
                : "Not Configured"}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
              Shift Gross / Net
            </span>
            <p className="text-xs font-semibold text-gray-700">
              {grossShiftHours !== null && grossShiftHours !== undefined
                ? `${grossShiftHours}h gross`
                : "—"}{" "}
              •{" "}
              <span className="text-[#007aff] font-bold">
                {netWorkingHours !== null && netWorkingHours !== undefined
                  ? `${netWorkingHours}h net`
                  : "—"}
              </span>
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
              Break Deduction
            </span>
            <p className="text-xs font-semibold text-gray-700">
              {breakMinutes !== null && breakMinutes !== undefined && breakMinutes !== ""
                ? `${breakMinutes} Minutes`
                : "Not Configured"}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
              Grace Period
            </span>
            <p className="text-xs font-bold text-amber-600">
              {graceStart && graceEnd
                ? `${formatDisplay(graceStart)} – ${formatDisplay(graceEnd)}`
                : "Not Configured"}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
              Early Checkout Grace
            </span>
            <p className="text-xs font-bold text-amber-600">
              {checkoutGraceMinutes !== null &&
              checkoutGraceMinutes !== undefined &&
              checkoutGraceMinutes !== ""
                ? `${checkoutGraceMinutes} Minutes`
                : "Not Configured"}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
              Allowed Late Marks
            </span>
            <p className="text-xs font-extrabold text-gray-900">
              {monthlyLateThreshold !== null &&
              monthlyLateThreshold !== undefined &&
              monthlyLateThreshold !== ""
                ? `${monthlyLateThreshold} / Month`
                : "Not Configured"}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
              Weekly Offs
            </span>
            <div className="flex flex-wrap gap-1 mt-0.5">
              {Array.isArray(weeklyOffDays) && weeklyOffDays.length > 0 ? (
                weeklyOffDays.map((d) => (
                  <span
                    key={d}
                    className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-blue-50 text-[#007aff]"
                  >
                    {WEEKDAYS[d]}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400">None</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pure Engine Evaluation Timeline (Zoho/Keka Left Color Strip Style) */}
      <div className="bg-white rounded-3xl border border-gray-100/90 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#007aff]" />
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Shift Evaluation Timeline
            </h3>
          </div>
        </div>

        <div className="space-y-3">
          {/* On-Time Grace Bracket */}
          {graceStart !== null && graceEnd !== null && (
            <div className="p-3.5 rounded-2xl bg-white border border-gray-100 border-l-4 border-l-emerald-500 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-900 font-mono">
                  {formatDisplay(graceStart)} – {formatDisplay(graceEnd)}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <CheckCircle2 className="h-3 w-3" />
                  Present (On-Time)
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">
                Check-in within engine grace window. Marked Present without penalties.
              </p>
            </div>
          )}

          {/* Late Flag Bracket */}
          {lateWindowStart !== null && (
            <div className="p-3.5 rounded-2xl bg-white border border-gray-100 border-l-4 border-l-amber-500 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-900 font-mono">
                  {formatDisplay(lateWindowStart)}
                  {lateWindowEnd !== null ? ` – ${formatDisplay(lateWindowEnd)}` : ""}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                  <AlertTriangle className="h-3 w-3" />
                  Present (Late Flagged)
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">
                Evaluated as Late Arrival by policy engine.
              </p>
            </div>
          )}

          {/* Half Day Bracket */}
          {halfDayStart !== null && (
            <div className="p-3.5 rounded-2xl bg-white border border-gray-100 border-l-4 border-l-orange-500 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-900 font-mono">
                  {formatDisplay(halfDayStart)}
                  {halfDayEnd !== null ? ` – ${formatDisplay(halfDayEnd)}` : ""}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md">
                  <Info className="h-3 w-3" />
                  Half Day Penalty
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">
                Check-in after half day threshold evaluated as Half Day status.
              </p>
            </div>
          )}

          {/* Absent Bracket */}
          {absentAfter !== null && (
            <div className="p-3.5 rounded-2xl bg-white border border-gray-100 border-l-4 border-l-red-500 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-900 font-mono">
                  After {formatDisplay(absentAfter)}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-red-700 bg-red-50 px-2 py-0.5 rounded-md">
                  <XCircle className="h-3 w-3" />
                  Automatic Absent
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">
                Check-in after cutoff evaluated as Automatic Absent.
              </p>
            </div>
          )}
        </div>

        {/* Penalty Notes */}
        {monthlyLateThreshold !== null &&
          monthlyLateThreshold !== undefined &&
          monthlyLateThreshold !== "" &&
          latePenaltyAction !== null &&
          latePenaltyAction !== undefined && (
            <div className="border-t border-gray-100 pt-3 text-xs">
              <div className="flex items-start gap-2 text-gray-600 bg-gray-50/80 p-3 rounded-2xl">
                <Info className="h-4 w-4 text-[#007aff] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-gray-800">Late Penalty Action:</span>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                    Exceeding {monthlyLateThreshold} late marks in a single month triggers{" "}
                    <span className="font-bold text-amber-700">{latePenaltyAction}</span>.
                  </p>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
