import React from "react";
import { Loader2, Fingerprint, LogOut, Info } from "lucide-react";

export default function TodayAttendanceCard({
  isWorking,
  timeObj,
  firstIn,
  currentShift,
  handleAction,
  actionLoading,
  canCheckIn,
  canCheckOut,
  dashOffset,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 relative overflow-hidden">
      {/* Subtle decorative background glow for premium feel */}
      <div className="absolute top-0 right-0 w-30 h-30 bg-slate-900/[0.02] rounded-full blur-3xl -mr-20 -mt-20"></div>

      <div className="flex justify-between items-center mb-8 relative z-10">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          Today's Attendance
        </h2>
        {isWorking && (
          <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-md flex items-center gap-1.5 border border-emerald-100 shadow-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            Working
          </div>
        )}
      </div>

      {/* Circular Timer UI */}
      <div className="flex justify-center mb-8 relative z-10">
        <div className="relative flex justify-center items-center w-64 h-64">
          {/* SVG Progress Ring */}
          <svg
            className="w-full h-full transform -rotate-90 drop-shadow-sm"
            viewBox="0 0 100 100"
          >
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth="2.5"
            />
            {/* Active Green Track */}
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="transparent"
              stroke="#10b981"
              strokeWidth="3.5"
              strokeDasharray="289"
              strokeDashoffset={isWorking ? dashOffset : 289}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-in-out drop-shadow-[0_0_6px_rgba(16,185,129,0.4)]"
            />
          </svg>

          {/* Inner Timer Content */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">
              Working Since
            </span>
            <div className="text-4xl font-black text-slate-900 tracking-tight tabular-nums mt-1 mb-2">
              {timeObj.h}:{timeObj.m}:{timeObj.s}
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm font-extrabold text-slate-800">
                {firstIn}
              </span>
              <span className="text-[10px] font-bold text-emerald-500 mt-0.5 uppercase tracking-wider">
                Check-in
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Shift Info */}
      <div className="text-center mb-8 relative z-10 bg-slate-50 py-3 rounded-xl border border-slate-100 mx-8">
        <div className="text-sm font-bold text-slate-800 uppercase tracking-wide">
          {currentShift.name}
        </div>
        <div className="text-xs font-semibold text-slate-500 mt-0.5">
          {currentShift.startTime} - {currentShift.endTime}
        </div>
      </div>

      {/* Action Buttons - Refined & Side-by-Side */}
      <div className="flex flex-row gap-3 mb-6 relative z-10">
        <button
          onClick={() => handleAction("checkIn", "in")}
          disabled={!!actionLoading || !canCheckIn}
          className={`flex-1 py-3 px-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all ${
            canCheckIn
              ? "bg-[#007aff] hover:bg-blue-600 text-white shadow-sm shadow-blue-500/20 cursor-pointer"
              : "bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed"
          }`}
        >
          {actionLoading === "in" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Fingerprint className="w-4 h-4" />
          )}
          {actionLoading === "in" ? "Processing..." : "Check In"}
        </button>

        <button
          onClick={() => handleAction("checkOut", "out")}
          disabled={!!actionLoading || !canCheckOut}
          className={`flex-1 py-3 px-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all ${
            canCheckOut
              ? "bg-rose-500 hover:bg-rose-600 text-white shadow-sm shadow-rose-500/20 cursor-pointer"
              : "bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed"
          }`}
        >
          {actionLoading === "out" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <LogOut className="w-4 h-4" />
          )}
          {actionLoading === "out" ? "Processing..." : "Check Out"}
        </button>
      </div>

      {/* Note Area */}
      <div className="bg-slate-50 text-slate-600 text-[11px] font-medium py-3 px-4 rounded-xl flex items-start gap-2 border border-slate-200 relative z-10">
        <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
        <p>
          Working hours are calculated strictly based on your verified check-in
          and check-out timestamps. Location tracking is active.
        </p>
      </div>
    </div>
  );
}
