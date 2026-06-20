import React from "react";
import { format, isSameDay } from "date-fns";

export default function MyLeavesCalendarView({
  currentMonthDate,
  setCurrentMonthDate,
  daysInMonth,
  blanks,
  getLeaveStatusForDay,
}) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">
          {format(currentMonthDate, "MMMM yyyy")}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() =>
              setCurrentMonthDate((d) => new Date(d.setMonth(d.getMonth() - 1)))
            }
            className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 text-xs font-semibold text-gray-600"
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentMonthDate(new Date())}
            className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 text-xs font-semibold text-gray-600"
          >
            Today
          </button>
          <button
            onClick={() =>
              setCurrentMonthDate((d) => new Date(d.setMonth(d.getMonth() + 1)))
            }
            className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 text-xs font-semibold text-gray-600"
          >
            Next
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-xl overflow-hidden border border-gray-200">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div
            key={d}
            className="bg-gray-50 py-2 text-center text-[10px] font-bold text-gray-500 uppercase tracking-wider"
          >
            {d}
          </div>
        ))}

        {blanks.map((b) => (
          <div key={`blank-${b}`} className="bg-white min-h-[80px]" />
        ))}

        {daysInMonth.map((day) => {
          const status = getLeaveStatusForDay(day);
          let bgClass = "bg-white";
          let textClass = "text-gray-700";

          if (status === "APPROVED") {
            bgClass = "bg-green-100";
            textClass = "text-green-800";
          } else if (status === "PENDING") {
            bgClass = "bg-yellow-100";
            textClass = "text-yellow-800";
          } else if (status === "REJECTED") {
            bgClass = "bg-red-100";
            textClass = "text-red-800";
          }

          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={day.toISOString()}
              className={`min-h-[80px] p-2 flex flex-col items-center border-t border-gray-100 transition-colors ${bgClass}`}
            >
              <span
                className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full ${
                  isToday ? "bg-[#007aff] text-white" : textClass
                }`}
              >
                {format(day, "d")}
              </span>
              {status && (
                <div className="mt-auto pt-1 w-full flex justify-center">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      status === "APPROVED"
                        ? "bg-green-500"
                        : status === "PENDING"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex justify-center gap-6">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
          <span className="w-3 h-3 rounded-sm bg-green-100 border border-green-200" />{" "}
          Approved
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
          <span className="w-3 h-3 rounded-sm bg-yellow-100 border border-yellow-200" />{" "}
          Pending
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
          <span className="w-3 h-3 rounded-sm bg-red-100 border border-red-200" />{" "}
          Rejected
        </div>
      </div>
    </div>
  );
}
