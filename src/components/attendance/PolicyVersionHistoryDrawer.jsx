"use client";

import React from "react";
import { X, History, RotateCcw, CheckCircle2, User, Calendar, FileText } from "lucide-react";

export default function PolicyVersionHistoryDrawer({
  isOpen,
  onClose,
  historyLogs = [],
  onRestoreVersion,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* White Theme Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-[#007aff] border border-blue-100">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-gray-900">Policy Audit & Version History</h2>
              <p className="text-[11px] text-gray-500 font-medium">Track and restore past HR policy snapshots</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {historyLogs.length > 0 ? (
            historyLogs.map((ver, idx) => (
              <div
                key={ver.id || idx}
                className={`rounded-2xl border p-4 transition-all space-y-3 ${
                  idx === 0
                    ? "border-blue-200 bg-blue-50/40 shadow-xs"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-blue-600 text-white shadow-2xs">
                      {ver.versionNumber || `v1.${historyLogs.length - idx}`}
                    </span>
                    {idx === 0 && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Active Version
                      </span>
                    )}
                  </div>
                  {idx !== 0 && ver.newValue && (
                    <button
                      onClick={() => {
                        onRestoreVersion(ver.newValue);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#007aff] hover:bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Restore Snapshot
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500 border-t border-b border-gray-100 py-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                    <span>{ver.createdAt ? new Date(ver.createdAt).toLocaleString() : "Date N/A"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-gray-400" />
                    <span>{ver.createdBy || "Admin"}</span>
                  </div>
                </div>

                {ver.newValue && (
                  <div>
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
                      Snapshot Values
                    </span>
                    <div className="text-[11px] text-gray-600 bg-gray-50 p-2.5 rounded-xl font-mono space-y-1">
                      <div>Shift: {ver.newValue.defaultShiftStartTime || "--:--"} - {ver.newValue.defaultShiftEndTime || "--:--"}</div>
                      <div>Grace: {ver.newValue.lateComingGraceMinutes ?? "N/A"}m | Allowed Late: {ver.newValue.monthlyLateThreshold ?? "N/A"}</div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="py-12 text-center space-y-3">
              <FileText className="h-10 w-10 text-gray-300 mx-auto" />
              <p className="text-xs font-bold text-gray-700">No Audit History Recorded</p>
              <p className="text-[11px] text-gray-400 max-w-xs mx-auto">
                No previous policy versions or audit change logs have been saved for this company yet.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
          <p className="text-[11px] text-gray-400">
            Audit history logs are provided directly from backend database records.
          </p>
        </div>
      </div>
    </div>
  );
}
