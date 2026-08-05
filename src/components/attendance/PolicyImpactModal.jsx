"use client";

import React from "react";
import { AlertCircle, CheckCircle2, ShieldAlert, Users, ArrowRight, X, Loader2 } from "lucide-react";
import { parse24to12 } from "@/components/common/EnterpriseTimePicker";

export default function PolicyImpactModal({
  isOpen,
  onClose,
  onConfirm,
  currentPolicy,
  newForm,
  impactData,
  isSaving,
}) {
  if (!isOpen) return null;

  const fmt = (val) => {
    if (val === null || val === undefined || val === "") return "Not Set";
    if (typeof val === "string" && val.includes(":")) {
      const { h, m, period } = parse24to12(val);
      if (!h || !m) return "Not Set";
      return `${h}:${m} ${period}`;
    }
    return String(val);
  };

  const getDiffs = () => {
    const diffs = [];
    if (!currentPolicy) {
      diffs.push({ label: "Policy Deployment", oldVal: "Unconfigured", newVal: "New Policy Draft" });
      return diffs;
    }

    const check = (label, oldVal, newVal, suffix = "") => {
      const o = fmt(oldVal);
      const n = fmt(newVal);
      if (o !== n && n !== "Not Set") {
        diffs.push({ label, oldVal: `${o}${suffix}`, newVal: `${n}${suffix}` });
      }
    };

    check("Office Start", currentPolicy.defaultShiftStartTime, newForm.defaultShiftStartTime);
    check("Office End", currentPolicy.defaultShiftEndTime, newForm.defaultShiftEndTime);
    check("Break Duration", currentPolicy.defaultBreakMinutes, newForm.defaultBreakMinutes, " mins");
    check("Late Grace", currentPolicy.lateComingGraceMinutes, newForm.lateMarkGraceMinutes, " mins");
    check("Allowed Late Marks", currentPolicy.monthlyLateThreshold, newForm.monthlyLateThreshold, " / month");
    check("Check-in After (Half Day)", currentPolicy.halfDayAfterTime, newForm.halfDayAfterTime);
    check("Check-in After (Absent)", currentPolicy.absentAfterTime, newForm.absentAfterTime);
    check("Early Checkout Grace", currentPolicy.checkoutGraceMinutes, newForm.checkoutGraceMinutes, " mins");
    check("Required Full Day", currentPolicy.minHoursForPresent, newForm.minFullDayHours, " hours");
    check("Required Half Day", currentPolicy.minHoursForHalfDay, newForm.minHalfDayHours, " hours");

    return diffs;
  };

  const diffs = getDiffs();
  const affectedEmployees = impactData?.affectedEmployees ?? null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
        {/* White Theme Header */}
        <div className="bg-white p-6 border-b border-gray-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 border border-blue-100 text-[#007aff]">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">Policy Impact Analysis & Deployment</h2>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Review governance impact before publishing global HR policy changes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Headcount Impact Card */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-100 text-[#007aff]">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase">Headcount Scope</span>
                <p className="text-sm font-bold text-gray-900">
                  {affectedEmployees !== null
                    ? `${affectedEmployees} Active Company Employees`
                    : "Active Company Headcount"}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-blue-600 text-white shadow-2xs">
              Backend Evaluated
            </span>
          </div>

          {/* Changed Parameters Summary */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
              Modified Rules ({diffs.length})
            </h3>
            {diffs.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {diffs.map((d, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-gray-50 border border-gray-200/80 p-3 rounded-xl text-xs"
                  >
                    <span className="font-bold text-gray-800">{d.label}</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-gray-400 line-through">{d.oldVal}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#007aff]" />
                      <span className="font-bold text-[#007aff] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                        {d.newVal}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic bg-gray-50 p-3 rounded-xl border border-gray-100">
                No shift threshold values modified.
              </p>
            )}
          </div>

          {/* Governance Notes */}
          <div className="border-t border-gray-100 pt-4 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              <span>Will apply immediately to all active company shifts & attendance.</span>
            </div>
            <div className="flex items-center gap-2 text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-100">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>Does NOT recalculate or corrupt historical attendance audit records.</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={() => onConfirm({ effectiveOption: "IMMEDIATELY", customDate: "" })}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#007aff] hover:bg-blue-600 text-white shadow-md flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            Confirm & Deploy Policy
          </button>
        </div>
      </div>
    </div>
  );
}
