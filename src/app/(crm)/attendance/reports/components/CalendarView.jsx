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
    <div className="bg-white border-t border-l border-gray-200 overflow-hidden">
      {/* Header Row - Days of the week */}
      <div className="grid grid-cols-7 bg-white">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="px-3 py-3 text-[14px] font-normal text-gray-500 border-r border-b border-gray-200"
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
            className={`min-h-[140px] border-r border-b border-gray-200 ${b === 0 ? 'bg-[#fcf9ed]' : 'bg-white'}`}
          ></div>
        ))}

        {/* Actual Days */}
        {calendarDays.map(day => {
          const dateObj = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), day);
          const dayOfWeek = dateObj.getDay();
          const record = getRecordForDate(dateObj);

          // Zoho highlights Sunday column with a faint yellow tint
          const isSunday = dayOfWeek === 0;
          const isToday = new Date().toDateString() === dateObj.toDateString();

          let pillStyle = "";
          let statusLabel = "";

          const hasPunch = Boolean(record?.checkIn || record?.checkOut);
          const checkInTime = formatDisplayTime(record?.checkIn);
          let checkOutTime = formatDisplayTime(record?.checkOut);
          let workHrs = record?.workHours || 0;

          if (!record?.checkOut && isToday && record?.attendanceState === "WORKING") {
            checkOutTime = formatDisplayTime(now, false);
            const checkInMs = new Date(record?.checkIn).getTime();
            workHrs = Math.max(0, (now.getTime() - checkInMs) / (1000 * 60 * 60));
          }

          const hours = Math.floor(workHrs);
          const mins = Math.round((workHrs - hours) * 60);
          const totalHoursStr = `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;

          if (record) {
            // Mapping to exact Zoho style colors with thick left border
            switch (record.status) {
              case 'PRESENT':
                pillStyle = "bg-[#e8f5e9] border border-[#c8e6c9] border-l-[3px] border-l-[#4caf50] text-[#1b5e20]";
                statusLabel = "Present";
                break;
              case 'ABSENT':
                pillStyle = "bg-[#ffebee] border border-[#ffcdd2] border-l-[3px] border-l-[#f44336] text-[#b71c1c]";
                statusLabel = "Absent";
                break;
              case 'ON_LEAVE':
                pillStyle = "bg-[#f3e5f5] border border-[#e1bee7] border-l-[3px] border-l-[#9c27b0] text-[#4a148c]";
                statusLabel = "Leave";
                break;
              case 'HALF_DAY':
                pillStyle = "bg-[#fff3e0] border border-[#ffe0b2] border-l-[3px] border-l-[#ff9800] text-[#e65100]";
                statusLabel = "Half Day";
                break;
              case 'LATE':
                pillStyle = "bg-[#fff8e1] border border-[#ffecb3] border-l-[3px] border-l-[#ffc107] text-[#f57f17]";
                statusLabel = "Late";
                break;
              case 'WEEK_OFF':
                pillStyle = "bg-gray-50 border border-gray-200 border-l-[3px] border-l-gray-400 text-gray-700";
                statusLabel = "Week Off";
                break;
              case 'HOLIDAY':
                pillStyle = "bg-[#e8eaf6] border border-[#c5cae9] border-l-[3px] border-l-[#3f51b5] text-[#1a237e]";
                statusLabel = "Holiday";
                break;
              default:
                // If status is null but there is a punch
                if (hasPunch) {
                  if (record.attendanceState === 'WORKING') {
                    pillStyle = "bg-blue-50 border border-blue-200 border-l-[3px] border-l-blue-500 text-blue-700";
                    statusLabel = "Working";
                  } else {
                    pillStyle = "bg-amber-50 border border-amber-200 border-l-[3px] border-l-amber-500 text-amber-700";
                    statusLabel = "Checked In";
                  }
                }
                break;
            }
          }

          const showDetails = hasPunch;

          return (
            <div
              key={day}
              className={`min-h-[140px] p-2 border-r border-b border-gray-200 flex flex-col ${isSunday ? "bg-[#fcf9ed]" : "bg-white"} ${isToday ? "ring-inset ring-2 ring-blue-100" : ""}`}
            >
              {/* Date Number top-left */}
              <span className={`text-[13px] mb-2 pl-1 pt-1 ${isToday ? "text-blue-600 font-bold" : "text-gray-500"}`}>{day}</span>

              {/* Status Pill matching Zoho */}
              {record && record.status !== 'UPCOMING' && statusLabel && (
                <div className={`flex flex-col p-2 rounded-[4px] mt-1 ${pillStyle}`}>
                  <span className="text-[13px] font-medium leading-tight">{statusLabel}</span>

                  {showDetails && (
                    <span className="text-[11px] font-medium mt-1 opacity-80">
                      {totalHoursStr} Hrs
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}