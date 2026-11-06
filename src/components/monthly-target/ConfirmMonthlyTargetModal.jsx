"use client";

import React from "react";
import { AlertTriangle, Lock, Loader2 } from "lucide-react";

export default function ConfirmMonthlyTargetModal({
  isOpen,
  onClose,
  onConfirm,
  targetValue,
  monthName,
  year,
  isSubmitting,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Warning Banner */}
        <div className="bg-amber-50 border-b border-amber-100 px-6 py-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 leading-tight">
              Confirm Monthly Target
            </h3>
            <p className="text-xs text-amber-700 font-medium mt-0.5">
              Permanent Confirmation Required
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 font-medium">Month:</span>
              <span className="font-bold text-gray-800">
                {monthName} {year}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 font-medium">Target:</span>
              <span className="font-extrabold text-blue-600 text-lg">
                {targetValue} MT
              </span>
            </div>
          </div>

          {/* Critical Lock Warning */}
          <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-3.5 text-xs text-red-800">
            <Lock className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Once you save this target, it cannot be edited later.</p>
              <p className="text-red-700 mt-0.5">
                The target will be permanently locked for this month and will automatically track your Sales Contracts.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onConfirm}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow transition-all flex items-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Confirm"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

