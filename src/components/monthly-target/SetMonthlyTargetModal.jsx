"use client";

import React, { useState } from "react";
import { Target, X } from "lucide-react";

export default function SetMonthlyTargetModal({
  isOpen,
  onClose,
  onProceedToConfirm,
  monthName,
  year,
}) {
  const [targetValue, setTargetValue] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    const num = parseFloat(targetValue);
    if (!targetValue || isNaN(num) || num <= 0) {
      setError("Please enter a valid target greater than 0 MT.");
      return;
    }
    setError("");
    onProceedToConfirm(num);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold leading-snug">Set Monthly Target</h3>
              <p className="text-xs text-blue-100 font-medium">
                {monthName} {year}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-1.5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
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
                placeholder="500"
                value={targetValue}
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
              Set your total metric ton (MT) achievement target for {monthName} {year}.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow transition-all"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

