import React, { useState, useEffect } from "react";
import { calculateTimePercent, formatDisplayTime, formatDateString } from "../utils";
import VisualAttendanceTimeline from "@/components/attendance/VisualAttendanceTimeline";

export default function ListView({ daysInView, records }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getRecordForDate = (dateObj) => {
    const dateStr = formatDateString(dateObj);
    return records.find((r) => r.date === dateStr);
  };


  return (
    <div className="flex flex-col bg-white -mx-4 -my-4 sm:m-0 sm:border sm:border-gray-100 sm:rounded-2xl sm:overflow-hidden">
      {daysInView.map((dateObj, index) => {
        const record = getRecordForDate(dateObj);
        const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
        const dayNum = String(dateObj.getDate()).padStart(2, "0");
        const isToday = new Date().toDateString() === dateObj.toDateString();


        const checkInTime = formatDisplayTime(record?.checkIn);
        let checkOutTime = formatDisplayTime(record?.checkOut);
        let workHrs = record?.workHours || 0;

        if (!record?.checkOut && isToday && record?.attendanceState === "WORKING") {
          checkOutTime = formatDisplayTime(now, true);
          const checkInMs = new Date(record.checkIn).getTime();
          workHrs = Math.max(0, (now.getTime() - checkInMs) / (1000 * 60 * 60));
        }

        const hasPunch = Boolean(record?.checkIn || record?.checkOut);
        const hours = Math.floor(workHrs);
        const mins = Math.round((workHrs - hours) * 60);
        const totalHoursStr = `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;

        // Minimalist status map
        const statusMap = {
          ABSENT: {
            label: "Absent",
            textColor: "text-rose-600",
            lineColor: "bg-rose-100",
            borderColor: "border-rose-100",
          },
          ON_LEAVE: {
            label: "On Leave",
            textColor: "text-purple-600",
            lineColor: "bg-purple-100",
            borderColor: "border-purple-100",
          },
          WEEK_OFF: {
            label: "Weekend",
            textColor: "text-gray-600",
            lineColor: "bg-amber-100",
            borderColor: "border-amber-100",
          },
          HOLIDAY: {
            label: "Holiday",
            textColor: "text-indigo-600",
            lineColor: "bg-indigo-100",
            borderColor: "border-indigo-100",
          },
        };

        const st = statusMap[record?.status] || {
          label: "",
          textColor: "text-gray-400",
          lineColor: "bg-transparent",
          borderColor: "border-transparent",
        };
        const isNonWorking =
          (["WEEK_OFF", "HOLIDAY", "ON_LEAVE", "ABSENT", "UPCOMING"].includes(record?.status) && !hasPunch) || !record;

        return (
          <div
            key={index}
            className={`flex items-center px-4 md:px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${isToday ? "bg-blue-50/20" : "bg-white"
              }`}
          >
            {/* Day & Date */}
            <div className="w-12 md:w-16 flex flex-col items-center justify-center flex-shrink-0">
              <span className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase">{dayName}</span>
              <span className={`text-sm md:text-base font-bold ${isToday ? "text-blue-600" : "text-gray-700"}`}>
                {dayNum}
              </span>
            </div>

            {/* Main Timeline Section */}
            <div className="flex-1 flex items-center gap-2 md:gap-4 px-2 md:px-4 min-w-[220px] md:min-w-[320px]">
              <div className="w-full">
                {hasPunch ? (
                  <VisualAttendanceTimeline
                    checkIn={record.checkIn}
                    checkOut={record.checkOut}
                    logs={record.logs}
                    isWorking={record.attendanceState === "WORKING" && isToday}
                    shiftStart={record.shift?.startTime || "09:30"}
                    shiftEnd={record.shift?.endTime || "18:00"}
                    breakStart={record.shift?.breakStartTime || "13:00"}
                    breakEnd={record.shift?.breakEndTime || "13:30"}
                    showLabels={false}
                    compact={true}
                  />
                ) : isNonWorking && st.label ? (
                  <div className="w-full flex items-center justify-center relative py-1">
                    <div className={`absolute w-full h-[2px] ${st.lineColor}`}></div>
                    <div
                      className={`relative z-10 px-2 py-0.5 rounded text-[10px] md:text-[11px] font-bold bg-white border ${st.borderColor} ${st.textColor}`}
                    >
                      {st.label}
                    </div>
                  </div>
                ) : record?.status === "UPCOMING" ? (
                  <div className="w-full flex items-center justify-center text-[12px] text-gray-400 font-bold py-1">
                    -
                  </div>
                ) : null}
              </div>
            </div>

            {/* Total Hours */}
            <div className="w-20 md:w-24 text-right flex flex-col justify-center flex-shrink-0">
              <span
                className={`text-[12px] md:text-[13px] font-bold ${isNonWorking && !record?.checkIn ? "text-gray-400" : "text-gray-800"
                  }`}
              >
                {isNonWorking && !record?.checkIn ? "00:00" : totalHoursStr}
              </span>
              <span className="text-[9px] md:text-[10px] text-gray-500">Hrs worked</span>
              {record?.isConflict && (
                <span className="mt-1 inline-block text-[9px] font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded px-1 self-end">
                  Conflict: Yes
                </span>
              )}
              {record?.isIgnored && (
                <span className="mt-1 inline-block text-[9px] font-bold text-gray-500 bg-gray-50 border border-gray-200 rounded px-1 self-end">
                  Ignored: Leave
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
