import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentHrPolicy } from "@/store/entities/companyHrPoliciesSlice";
import { formatDisplayTime, formatDateString } from "../utils";
import VisualAttendanceTimeline from "@/components/attendance/VisualAttendanceTimeline";

export default function ListView({ daysInView, records }) {
  const [now, setNow] = useState(new Date());
  const hrPolicy = useSelector(selectCurrentHrPolicy);

  const defaultShiftStart = hrPolicy?.defaultShiftStartTime;
  const defaultShiftEnd = hrPolicy?.defaultShiftEndTime;
  const defaultBreakStart = hrPolicy?.defaultBreakStartTime;
  const defaultBreakEnd = hrPolicy?.defaultBreakEndTime;

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
    <div className="flex flex-col bg-white rounded-xl border border-slate-200/80 overflow-hidden">
      {daysInView.map((dateObj, index) => {
        const record = getRecordForDate(dateObj);
        const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
        const dayNum = String(dateObj.getDate()).padStart(2, "0");
        const isToday = new Date().toDateString() === dateObj.toDateString();

        const checkInTime = formatDisplayTime(record?.checkIn);
        let checkOutTime = formatDisplayTime(record?.checkOut);
        if (!record?.checkOut && isToday && record?.attendanceState === "WORKING") {
          checkOutTime = formatDisplayTime(now, true);
        }

        const hasPunch = Boolean(record?.checkIn || record?.checkOut);
        const workHrs = record?.workHours || 0;
        const hours = Math.floor(workHrs);
        const mins = Math.round((workHrs - hours) * 60);
        const totalHoursStr = `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;

        // Minimalist status map
        const statusMap = {
          ABSENT: {
            label: "Absent",
            textColor: "text-rose-600",
            lineColor: "bg-rose-100",
            borderColor: "border-rose-200/60",
          },
          ON_LEAVE: {
            label: "On Leave",
            textColor: "text-purple-600",
            lineColor: "bg-purple-100",
            borderColor: "border-purple-200/60",
          },
          WEEK_OFF: {
            label: "Weekend",
            textColor: "text-slate-500",
            lineColor: "bg-amber-100/60",
            borderColor: "border-amber-200/50",
          },
          HOLIDAY: {
            label: "Holiday",
            textColor: "text-indigo-600",
            lineColor: "bg-indigo-100",
            borderColor: "border-indigo-200/60",
          },
        };

        const st = statusMap[record?.status] || {
          label: "",
          textColor: "text-slate-400",
          lineColor: "bg-transparent",
          borderColor: "border-transparent",
        };
        const isNonWorking =
          (["WEEK_OFF", "HOLIDAY", "ON_LEAVE", "ABSENT", "UPCOMING"].includes(record?.status) && !hasPunch) || !record;

        return (
          <div
            key={index}
            className={`flex items-center px-4 md:px-6 py-3.5 border-b border-slate-100 hover:bg-slate-50/70 transition-colors ${
              isToday ? "bg-blue-50/30" : "bg-white"
            }`}
          >
            {/* Day & Date */}
            <div className="w-12 md:w-16 flex flex-col items-center justify-center flex-shrink-0">
              <span className="text-[10px] md:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{dayName}</span>
              <span className={`text-sm md:text-base font-bold ${isToday ? "text-blue-600" : "text-slate-800"}`}>
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
                    shiftStart={record.shift?.startTime || defaultShiftStart}
                    shiftEnd={record.shift?.endTime || defaultShiftEnd}
                    breakStart={record.shift?.breakStartTime || defaultBreakStart}
                    breakEnd={record.shift?.breakEndTime || defaultBreakEnd}
                    showLabels={false}
                    compact={true}
                  />
                ) : isNonWorking && st.label ? (
                  <div className="w-full flex items-center justify-center relative py-1">
                    <div className={`absolute w-full h-[1.5px] ${st.lineColor}`}></div>
                    <div
                      className={`relative z-10 px-2.5 py-0.5 rounded-full text-[10px] md:text-[11px] font-medium bg-white border ${st.borderColor} ${st.textColor} shadow-2xs`}
                    >
                      {st.label}
                    </div>
                  </div>
                ) : record?.status === "UPCOMING" || !record ? (
                  <div className="w-full flex items-center justify-center text-[11px] text-slate-400/60 font-medium py-1 select-none">
                    No Activity
                  </div>
                ) : (
                  <div className="w-full flex items-center justify-center text-[11px] text-slate-400/60 font-medium py-1 select-none">
                    No Attendance
                  </div>
                )}
              </div>
            </div>

            {/* Total Hours & Right Side Status Badges */}
            <div className="w-24 md:w-28 text-right flex flex-col justify-center flex-shrink-0 items-end">
              <span
                className={`text-[12px] md:text-[13px] font-bold ${
                  isNonWorking && !record?.checkIn ? "text-slate-400/70" : "text-slate-800"
                }`}
              >
                {isNonWorking && !record?.checkIn ? "00:00" : totalHoursStr}
              </span>
              <span className="text-[9px] md:text-[10px] text-slate-400 font-medium">Hrs worked</span>
              
              {/* Clean Enterprise Badges */}
              {(record?.employeeStatus === "PRESENT" || record?.status === "PRESENT" || record?.status === "LATE") && (
                <span className="mt-1 inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-full px-2 py-0.5">
                  Present
                </span>
              )}
              {record?.status === "HALF_DAY" && (
                <span className="mt-1 inline-block text-[10px] font-semibold text-orange-700 bg-orange-50 border border-orange-200/60 rounded-full px-2 py-0.5">
                  Half Day
                </span>
              )}
              {record?.status === "ABSENT" && (
                <span className="mt-1 inline-block text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200/60 rounded-full px-2 py-0.5">
                  Absent
                </span>
              )}
              {record?.isConflict && (
                <span className="mt-1 inline-block text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200/60 rounded-full px-2 py-0.5">
                  Conflict
                </span>
              )}
              {record?.isIgnored && (
                <span className="mt-1 inline-block text-[10px] font-semibold text-slate-600 bg-slate-100 border border-slate-200/60 rounded-full px-2 py-0.5">
                  Ignored
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
