import React from "react";
import { calculateTimePercent, formatDisplayTime, formatDateString } from "../utils";

export default function ListView({ daysInView, records }) {
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
        const checkOutTime = formatDisplayTime(record?.checkOut);
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
            className={`flex items-center px-4 md:px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
              isToday ? "bg-blue-50/20" : "bg-white"
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
            <div className="flex-1 flex items-center gap-2 md:gap-4 px-2 md:px-4 min-w-[200px] md:min-w-[300px]">
              <div className="w-14 md:w-16 text-right flex-shrink-0">
                {hasPunch && <span className="text-[11px] md:text-[13px] font-bold text-gray-800">{checkInTime || "--:--"}</span>}
              </div>

              <div className="flex-1 relative flex items-center h-6">
                <div className="absolute inset-x-0 flex items-center justify-between w-full">
                  <div className="flex gap-[3px]">
                    <div className="w-[4px] h-[4px] rounded-full bg-gray-200"></div>
                    <div className="w-[4px] h-[4px] rounded-full bg-gray-200"></div>
                  </div>
                  <div className="flex-1 h-[2px] bg-gray-100 mx-2"></div>
                  <div className="flex gap-[3px]">
                    <div className="w-[4px] h-[4px] rounded-full bg-gray-200"></div>
                    <div className="w-[4px] h-[4px] rounded-full bg-gray-200"></div>
                  </div>
                </div>

                <div className="absolute inset-x-6 top-0 bottom-0 flex items-center z-10">
                  {hasPunch ? (
                    (() => {
                      const startPercent = calculateTimePercent(record.checkIn);
                      let endPercent = record.checkOut ? calculateTimePercent(record.checkOut) : 100;
                      if (!record.checkOut && isToday) endPercent = calculateTimePercent(new Date());
                      const barWidth = Math.max(endPercent - startPercent, 0);

                      return (
                        <div
                          className="absolute h-[2px] bg-emerald-400 rounded-full"
                          style={{ left: `${startPercent}%`, width: `${barWidth}%` }}
                        >
                          <div className="absolute w-[8px] h-[8px] md:w-[9px] md:h-[9px] bg-emerald-500 rounded-full top-1/2 -translate-y-1/2 -left-1 ring-2 ring-white"></div>
                          {record.checkOut && (
                            <div className="absolute w-[8px] h-[8px] md:w-[9px] md:h-[9px] bg-rose-400 rounded-full top-1/2 -translate-y-1/2 -right-1 ring-2 ring-white"></div>
                          )}
                        </div>
                      );
                    })()
                  ) : isNonWorking && st.label ? (
                    <div className="w-full flex items-center justify-center relative">
                      <div className={`absolute w-full h-[2px] ${st.lineColor}`}></div>
                      <div
                        className={`relative z-10 px-2 py-0.5 rounded text-[10px] md:text-[11px] font-bold bg-white border ${st.borderColor} ${st.textColor}`}
                      >
                        {st.label}
                      </div>
                    </div>
                  ) : record?.status === "UPCOMING" ? (
                    <div className="w-full flex items-center justify-center text-[12px] text-gray-400 font-bold">
                      -
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="w-14 md:w-16 flex-shrink-0">
                {hasPunch && <span className="text-[11px] md:text-[13px] font-bold text-gray-800">{checkOutTime || "--:--"}</span>}
              </div>
            </div>

            {/* Total Hours */}
            <div className="w-20 md:w-24 text-right flex flex-col justify-center flex-shrink-0">
              <span
                className={`text-[12px] md:text-[13px] font-bold ${
                  isNonWorking && !hasPunch ? "text-gray-400" : "text-gray-800"
                }`}
              >
                {isNonWorking && !hasPunch ? "00:00" : totalHoursStr}
              </span>
              <span className="text-[9px] md:text-[10px] text-gray-500">Hrs worked</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
