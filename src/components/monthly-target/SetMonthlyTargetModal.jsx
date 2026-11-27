"use client";

import React, { useState } from "react";
import { Target } from "lucide-react";
import { useEscapeKey } from "@/hooks/useEscapeKey";

/**
 * Mandatory Monthly Target Entry Modal.
 * Cannot be closed, cancelled, or bypassed via Escape or backdrop click.
 * Only proceeds once a valid positive target (> 0 MT) is entered and saved.
 */
export default function SetMonthlyTargetModal({
  isOpen,
  onProceedToConfirm,
  monthName,
  year,
  initialValue = "",
}) {
  // Swallow Escape key so the modal cannot be dismissed under any circumstance
  useEscapeKey(() => {}, isOpen);

  const [targetValue, setTargetValue] = useState(
    initialValue ? String(initialValue) : ""
  );
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    const num = parseFloat(targetValue);
    if (!targetValue || !Number.isFinite(num) || num <= 0) {
      setError("Please enter a valid target greater than 0 MT.");
      return;
    }
    setError("");
    onProceedToConfirm(num);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/45 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="set-monthly-target-title"
        className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header — intentionally has no close/cross button */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
            <Target className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 id="set-monthly-target-title" className="text-lg font-bold leading-snug">
              Set Monthly Target
            </h3>
            <p className="text-xs text-blue-100 font-medium">
              {monthName} {year}
            </p>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Enter Target
            </label>
            <div className="relative">
              <input
                type="number"
                step="any"
                min="0.01"
                required
                placeholder="500"
                value={targetValue}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "+" || e.key === "e" || e.key === "E") {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  setTargetValue(e.target.value);
                  if (error) setError("");
                }}
                autoFocus
                className="w-full px-4 py-3 text-2xl font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-14"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-sm text-gray-500 pointer-events-none">
                MT
              </span>
            </div>
            {error && (
              <p className="text-xs font-semibold text-rose-500">{error}</p>
            )}
            <p className="text-xs text-gray-500">
              Set your total metric ton (MT) achievement target for {monthName} {year}. Entering your target is required to continue.
            </p>
          </div>

          {/* Actions — intentionally has no Cancel button */}
          <div className="pt-3 border-t border-gray-100">
            <button
              type="submit"
              className="w-full px-6 py-3 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow transition-all cursor-pointer"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
