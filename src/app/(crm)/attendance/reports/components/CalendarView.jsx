import React, { useState, useEffect } from "react";
import { formatDisplayTime, formatDateString } from "../utils";

export default function CalendarView({ referenceDate, records }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calendar Specific Variables
  const calendarDaysInMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0).getDate();
  const calendarFirstDay = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1).getDay();
  const calendarDays = Array.from({ length: calendarDaysInMonth }, (_, i) => i + 1);
  const calendarBlanks = Array.from({ length: calendarFirstDay }, (_, i) => i);

  const getRecordForDate = (dateObj) => {
    const dateStr = formatDateString(dateObj);
    return records.find(r => r.date === dateStr);
  };

  return (
    <div className="bg-white border-t border-l border-slate-200/80 rounded-xl overflow-hidden shadow-2xs">
      {/* Header Row - Days of the week */}
      <div className="grid grid-cols-7 bg-slate-50/80">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="px-3 py-2.5 text-xs font-semibold text-slate-600 border-r border-b border-slate-200/80 text-center tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {/* Blank spots for first week offset */}
        {calendarBlanks.map(b => (
          <div
            key={`blank-${b}`}
            className={`min-h-[120px] border-r border-b border-slate-200/80 ${b === 0 ? 'bg-amber-50/20' : 'bg-slate-50/30'}`}
          ></div>
        ))}

        {/* Actual Days */}
        {calendarDays.map(day => {
          const dateObj = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), day);
          const dayOfWeek = dateObj.getDay();
          const record = getRecordForDate(dateObj);

          // Zoho highlights Sunday column with a faint tint
          const isSunday = dayOfWeek === 0;
          const isToday = new Date().toDateString() === dateObj.toDateString();

          const hasPunch = Boolean(record?.checkIn || record?.checkOut);
          let workHrs = record?.workHours || 0;

          if (!record?.checkOut && isToday && record?.attendanceState === "WORKING") {
            const checkInMs = new Date(record?.checkIn).getTime();
            workHrs = Math.max(0, (now.getTime() - checkInMs) / (1000 * 60 * 60));
          }

          const hours = Math.floor(workHrs);
          const mins = Math.round((workHrs - hours) * 60);
          const totalHoursStr = `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;

          let statusPills = [];
          if (record) {
            const empStatus = record.employeeStatus || (record.status === 'LATE' ? 'PRESENT' : record.status);

            if (empStatus === 'PRESENT') {
              statusPills.push({
                label: 'Present',
                style: 'bg-emerald-50 border border-emerald-200/60 border-l-[3px] border-l-emerald-500 text-emerald-800'
              });
            } else if (empStatus === 'HALF_DAY') {
              statusPills.push({
                label: 'Half Day',
                style: 'bg-orange-50 border border-orange-200/60 border-l-[3px] border-l-orange-500 text-orange-800'
              });
            } else if (empStatus === 'ABSENT') {
              statusPills.push({
                label: 'Absent',
                style: 'bg-rose-50 border border-rose-200/60 border-l-[3px] border-l-rose-500 text-rose-800'
              });
            } else if (empStatus === 'ON_LEAVE') {
              statusPills.push({
                label: 'Leave',
                style: 'bg-purple-50 border border-purple-200/60 border-l-[3px] border-l-purple-500 text-purple-800'
              });
            } else if (empStatus === 'WEEK_OFF') {
              statusPills.push({
                label: 'Week Off',
                style: 'bg-slate-50 border border-slate-200/60 border-l-[3px] border-l-slate-400 text-slate-700'
              });
            } else if (empStatus === 'HOLIDAY') {
              statusPills.push({
                label: 'Holiday',
                style: 'bg-indigo-50 border border-indigo-200/60 border-l-[3px] border-l-indigo-500 text-indigo-800'
              });
            } else {
              if (hasPunch) {
                if (record.attendanceState === 'WORKING') {
                  statusPills.push({
                    label: 'Working',
                    style: 'bg-blue-50 border border-blue-200/60 border-l-[3px] border-l-blue-500 text-blue-800'
                  });
                } else {
                  statusPills.push({
                    label: 'Checked In',
                    style: 'bg-amber-50 border border-amber-200/60 border-l-[3px] border-l-amber-500 text-amber-800'
                  });
                }
              }
            }
          }

          const showDetails = hasPunch;

          return (
            <div
              key={day}
              className={`min-h-[120px] p-2 border-r border-b border-slate-200/80 flex flex-col justify-between transition-colors ${
                isSunday ? "bg-slate-50/40" : "bg-white"
              } ${isToday ? "ring-inset ring-2 ring-blue-400/50 bg-blue-50/20" : ""}`}
            >
              <div>
                {/* Date Number top-left */}
                <span className={`text-[12px] font-bold inline-block px-1 rounded ${isToday ? "text-blue-600 bg-blue-100/60" : "text-slate-600"}`}>
                  {day}
                </span>

                {/* Status Pill matching Zoho */}
                {record && record.status !== 'UPCOMING' && statusPills.length > 0 && (
                  <div className="flex flex-col gap-1 mt-1.5">
                    {statusPills.map((pill, pIdx) => (
                      <div key={pIdx} className={`flex flex-col px-2 py-1 rounded-[6px] shadow-2xs ${pill.style}`}>
                        <span className="text-[11px] font-semibold leading-tight">{pill.label}</span>
                        {pIdx === 0 && showDetails && (
                          <span className="text-[9px] font-medium mt-0.5 opacity-85">
                            {totalHoursStr} Hrs
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Muted placeholder for non-record or upcoming days */}
              {(!record || record.status === 'UPCOMING') && (
                <div className="text-[10px] text-slate-300 font-normal italic select-none pb-1 pl-1">
                  No Activity
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}