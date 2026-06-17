"use client";
import { Activity, Clock, Calendar, CheckSquare } from "lucide-react";

export default function Widgets({ activities, attendance, leaveSummary, type }) {
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500 delay-200">

      {/* Attendance Widget */}
      {type === 'FULL' && attendance && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h4 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-[#007aff]" /> Attendance Summary
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Present</p>
              <p className="text-2xl font-black text-slate-800 mt-1">{attendance.presentDays}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Absent</p>
              <p className="text-2xl font-black text-rose-500 mt-1">{attendance.absentDays}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Late Entries</p>
              <p className="text-2xl font-black text-slate-800 mt-1">{attendance.lateEntries}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Health</p>
              <p className="text-2xl font-black text-[#007aff] mt-1">{attendance.attendancePercentage}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Leave Balances */}
      {type === 'FULL' && leaveSummary && leaveSummary.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h4 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#007aff]" /> Leave Balances
          </h4>
          <div className="space-y-4">
            {leaveSummary.map((leave, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-800">Leave Type {leave.leaveTypeId}</p>
                  <p className="text-[11px] font-semibold text-slate-400">Total: {leave.totalAllocated}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-emerald-600">{leave.remainingDays}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Left</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h4 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
          <Activity className="h-4 w-4 text-[#007aff]" /> Recent Activity
        </h4>

        {activities && activities.length > 0 ? (
          <div className="space-y-5">
            {activities.slice(0, 5).map((act, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-[#007aff] mt-1.5"></div>
                  {idx !== Math.min(activities.length, 5) - 1 && (
                    <div className="w-0.5 h-full bg-slate-100 my-1"></div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">
                    Updated <span className="font-bold text-slate-900">{act.fieldName}</span>
                  </p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {act.oldValue ? `Changed from '${act.oldValue}'` : 'Added new detail'}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {timeAgo(act.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400 font-medium text-center py-4">No recent activity.</p>
        )}
      </div>

    </div>
  );
}