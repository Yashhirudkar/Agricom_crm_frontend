"use client";

import React, { useEffect, useState } from "react";
import { getUpcomingHolidays } from "../../../lib/api/holidays";
import { format } from "date-fns";
import { Calendar, Clock, Sparkles } from "lucide-react";

const getHolidayBadgeStyles = (type, isOptional) => {
  if (isOptional) {
    return {
      bg: "bg-amber-50",
      text: "text-amber-800",
      border: "border-amber-200/60",
      dot: "bg-amber-500",
      tag: "bg-amber-100 text-amber-800"
    };
  }
  switch (type) {
    case "PUBLIC":
      return {
        bg: "bg-rose-50",
        text: "text-rose-800",
        border: "border-rose-200/60",
        dot: "bg-rose-500",
        tag: "bg-rose-100 text-rose-800"
      };
    case "COMPANY":
      return {
        bg: "bg-blue-50",
        text: "text-blue-800",
        border: "border-blue-200/60",
        dot: "bg-blue-500",
        tag: "bg-blue-100 text-blue-800"
      };
    case "SHUTDOWN":
      return {
        bg: "bg-purple-50",
        text: "text-purple-800",
        border: "border-purple-200/60",
        dot: "bg-purple-500",
        tag: "bg-purple-100 text-purple-800"
      };
    case "FESTIVAL":
      return {
        bg: "bg-emerald-50",
        text: "text-emerald-800",
        border: "border-emerald-200/60",
        dot: "bg-emerald-500",
        tag: "bg-emerald-100 text-emerald-800"
      };
    case "REGIONAL":
      return {
        bg: "bg-teal-50",
        text: "text-teal-800",
        border: "border-teal-200/60",
        dot: "bg-teal-500",
        tag: "bg-teal-100 text-teal-800"
      };
    default:
      return {
        bg: "bg-slate-50",
        text: "text-slate-800",
        border: "border-slate-200/60",
        dot: "bg-slate-500",
        tag: "bg-slate-100 text-slate-800"
      };
  }
};

const parseLocalDate = (dateStr) => {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const getRelativeDays = (dateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const holidayDate = parseLocalDate(dateStr);
  if (holidayDate) {
    holidayDate.setHours(0, 0, 0, 0);
  }

  const diffTime = holidayDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays < 0) return "Passed";
  if (diffDays < 7) return `In ${diffDays} days`;

  const weeks = Math.floor(diffDays / 7);
  if (diffDays % 7 === 0) {
    return `In ${weeks} week${weeks > 1 ? "s" : ""}`;
  }
  return `In ${diffDays} days`;
};

const isWeeklyOffHelper = (h) => {
  if (h.isWeeklyOff) return true;
  if (!h.title) return false;
  const t = h.title.toLowerCase().trim();

  const weekdays = [
    "sunday", "sinday",
    "saturday", "saturaday",
    "monday", "tuesday", "wednesday", "thursday", "friday"
  ];
  if (weekdays.includes(t)) return true;

  const words = t.split(/[\s-_]+/);
  const isOff = words.includes("off") || words.includes("offday") || t.includes("weekly off") || t.includes("weekly-off");

  const hasWeekday = words.some(w => [
    "sun", "sunday", "sinday",
    "sat", "satday", "saturday", "saturaday",
    "mon", "monday", "tue", "tuesday", "wed", "wednesday", "thu", "thursday", "fri", "friday"
  ].includes(w));

  if ((isOff && hasWeekday) || t.includes("weekly off") || t.includes("weekly-off")) {
    return true;
  }
  return false;
};

export default function UpcomingHolidaysWidget() {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const res = await getUpcomingHolidays();
        const data = res?.data || res || [];
        const filtered = data.filter((h) => !isWeeklyOffHelper(h));
        setHolidays(filtered);
      } catch (err) {
        console.error("Failed to fetch upcoming holidays:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUpcoming();
  }, []);

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm h-full flex flex-col hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-3">
        <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
          <Calendar size={18} className="text-blue-600" />
          Upcoming Holidays
        </h3>
        {!loading && holidays.length > 0 && (
          <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100/50">
            {holidays.length} Active
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex-1 flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-blue-600"></div>
        </div>
      ) : holidays.length === 0 ? (
        <div className="flex-1 flex flex-col justify-center items-center text-gray-400 py-10 text-center">
          <Sparkles size={28} className="text-gray-300 mb-2 stroke-[1.5]" />
          <p className="text-xs font-semibold">No upcoming holidays</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Check back later or add new entries</p>
        </div>
      ) : (
        <div className="space-y-3.5 flex-1 overflow-y-auto pr-1">
          {holidays.slice(0, 8).map((h) => {
            const theme = getHolidayBadgeStyles(h.holidayType, h.isOptional);
            const relativeTime = getRelativeDays(h.holidayDate);
            const isNear = relativeTime === "Today" || relativeTime === "Tomorrow" || relativeTime.includes("1 day") || relativeTime.includes("2 days");

            return (
              <div
                key={h.id}
                className="flex gap-3.5 group p-2.5 rounded-xl border border-transparent hover:border-gray-100 hover:bg-slate-50/50 transition-all duration-200"
              >
                {/* Calendar Date Badge */}
                <div className={`flex flex-col items-center justify-center h-12 w-11 rounded-xl border ${theme.border} ${theme.bg} shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-105`}>
                  <span className={`text-sm font-extrabold ${theme.text} leading-none`}>
                    {format(parseLocalDate(h.holidayDate), "dd")}
                  </span>
                  <span className={`text-[9px] font-extrabold uppercase mt-0.5 ${theme.text} opacity-80 tracking-wider`}>
                    {format(parseLocalDate(h.holidayDate), "MMM")}
                  </span>
                </div>

                {/* Details Content */}
                <div className="flex flex-col justify-center min-w-0 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h4 className="text-xs font-extrabold text-gray-900 group-hover:text-blue-700 transition-colors truncate max-w-[150px]">
                      {h.title
                        ?.split(" ")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join(" ")}
                    </h4>

                    {/* Countdown/Relative Time Badge */}
                    <span className={`inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isNear
                      ? "bg-amber-100 text-amber-800 border border-amber-200/50 animate-pulse"
                      : "bg-slate-100 text-slate-600"
                      }`}>
                      <Clock size={8} />
                      {relativeTime}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`h-1.5 w-1.5 rounded-full ${theme.dot}`} />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      {h.isOptional ? "Optional Holiday" : h.isHalfDay ? "Half Day Holiday" : `${h.holidayType} Holiday`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}