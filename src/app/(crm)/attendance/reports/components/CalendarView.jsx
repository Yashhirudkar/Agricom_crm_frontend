import React from "react";
import { formatDisplayTime, formatDateString } from "../utils";

export default function CalendarView({ referenceDate, records }) {
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

          let pillStyle = "";
          let statusLabel = "";
          let timeStr = "";

          if (record) {
            timeStr = formatDisplayTime(record.checkIn);

            // Mapping to exact Zoho style colors
            switch (record.status) {
              case 'PRESENT':
                pillStyle = "bg-[#e8f5e9] border-[#c8e6c9] text-[#1b5e20]";
                statusLabel = "Present";
                break;
              case 'ABSENT':
                pillStyle = "bg-[#ffebee] border-[#ffcdd2] text-[#b71c1c]";
                statusLabel = "Absent";
                break;
              case 'ON_LEAVE':
                pillStyle = "bg-[#f3e5f5] border-[#e1bee7] text-[#4a148c]";
                statusLabel = "Leave";
                break;
              case 'HALF_DAY':
                pillStyle = "bg-[#fff3e0] border-[#ffe0b2] text-[#e65100]";
                statusLabel = "Half Day";
                break;
              case 'LATE':
                pillStyle = "bg-[#fff8e1] border-[#ffecb3] text-[#f57f17]";
                statusLabel = "Late";
                break;
              case 'WEEK_OFF':
                pillStyle = "bg-gray-100 border-gray-200 text-gray-700";
                statusLabel = "Week Off";
                break;
              case 'HOLIDAY':
                pillStyle = "bg-[#e8eaf6] border-[#c5cae9] text-[#1a237e]";
                statusLabel = "Holiday";
                break;
              default:
                break;
            }
          }

          return (
            <div
              key={day}
              className={`min-h-[140px] p-2 border-r border-b border-gray-200 flex flex-col ${isSunday ? "bg-[#fcf9ed]" : "bg-white"}`}
            >
              {/* Date Number top-left */}
              <span className="text-[13px] text-gray-500 mb-2 pl-1 pt-1">{day}</span>

              {/* Status Pill matching Zoho */}
              {record && record.status !== 'UPCOMING' && (
                <div className={`flex flex-col p-2 border rounded-[4px] mt-1 ${pillStyle}`}>
                  <span className="text-[13px] font-medium leading-tight">{statusLabel}</span>
                  {timeStr && (
                    <span className="text-[11px] opacity-80 mt-1">{timeStr}</span>
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