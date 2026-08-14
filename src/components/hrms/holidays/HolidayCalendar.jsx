"use client";

import React, { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Sparkles, Calendar as CalendarIcon, List } from "lucide-react";
import "./calendar-styles.css";

const getHolidayColor = (type, isOptional) => {
  if (isOptional) return "#f59e0b"; // Amber / Orange
  switch (type) {
    case "PUBLIC":
      return "#ef4444"; // Red
    case "COMPANY":
      return "#3b82f6"; // Blue
    case "SHUTDOWN":
      return "#a855f7"; // Purple
    case "FESTIVAL":
      return "#10b981"; // Emerald
    case "REGIONAL":
      return "#14b8a6"; // Teal
    default:
      return "#64748b"; // Slate
  }
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

const parseLocalDate = (dateStr) => {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export default function HolidayCalendar({ holidays, onHolidayClick }) {
  const calendarRef = useRef(null);
  const dateInputRef = useRef(null);

  const [currentTitle, setCurrentTitle] = useState("");
  const [currentView, setCurrentView] = useState("dayGridMonth");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentDateStr, setCurrentDateStr] = useState(format(new Date(), "yyyy-MM-dd"));

  const events = holidays
    .filter((h) => !(isWeeklyOffHelper(h) && currentView === "dayGridMonth"))
    .map((h) => {
      const isWeekly = isWeeklyOffHelper(h);
      return {
        id: h.id,
        title: h.title,
        start: h.holidayDate,
        allDay: true,
        backgroundColor: isWeekly ? "transparent" : getHolidayColor(h.holidayType, h.isOptional),
        borderColor: isWeekly ? "transparent" : getHolidayColor(h.holidayType, h.isOptional),
        textColor: isWeekly ? "inherit" : undefined,
        extendedProps: { ...h },
      };
    });

  const getDayCellClassNames = (arg) => {
    const year = arg.date.getFullYear();
    const month = String(arg.date.getMonth() + 1).padStart(2, '0');
    const day = String(arg.date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const isWeekly = holidays.some((h) => h.holidayDate === dateStr && isWeeklyOffHelper(h));
    if (isWeekly) {
      const dayOfWeek = arg.date.getDay();
      if (dayOfWeek === 0) return ["sunday-off-cell"];
      if (dayOfWeek === 6) return ["saturday-off-cell"];
      return ["has-weekly-off"];
    }
    return [];
  };

  const handleEventClick = (clickInfo) => {
    const holidayData = clickInfo.event.extendedProps;
    onHolidayClick(holidayData);
  };

  const handlePrev = () => {
    calendarRef.current?.getApi().prev();
  };

  const handleNext = () => {
    calendarRef.current?.getApi().next();
  };

  const handleToday = () => {
    calendarRef.current?.getApi().today();
  };

  const handleChangeView = (viewType) => {
    calendarRef.current?.getApi().changeView(viewType);
    setCurrentView(viewType);
  };

  const handleDateChange = (e) => {
    const selectedVal = e.target.value;
    if (selectedVal) {
      setCurrentDateStr(selectedVal);
      calendarRef.current?.getApi().gotoDate(selectedVal);
    }
  };

  const handleOpenPicker = (e) => {
    e?.stopPropagation();
    try {
      if (dateInputRef.current) {
        if (typeof dateInputRef.current.showPicker === "function") {
          dateInputRef.current.showPicker();
        } else {
          dateInputRef.current.click();
        }
      }
    } catch (err) {
      console.error("Error opening date picker:", err);
    }
  };

  const handleDatesSet = (dateInfo) => {
    setCurrentTitle(dateInfo.view.title);
    setCurrentView(dateInfo.view.type);

    const start = dateInfo.view.currentStart;
    if (start) {
      setCurrentMonth(start.getMonth());
      setCurrentYear(start.getFullYear());
      setCurrentDateStr(format(start, "yyyy-MM-dd"));
    }
  };

  // Calculate dynamic month holidays count on every render when holidays prop or active month changes
  const activeMonthHolidaysCount = holidays.filter((h) => {
    if (isWeeklyOffHelper(h)) return false;
    const d = parseLocalDate(h.holidayDate);
    return d && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;

  // Custom Event Card Rendering
  const renderEventContent = (eventInfo) => {
    const { extendedProps, title } = eventInfo.event;
    const holidayType = extendedProps.holidayType;
    const isOptional = extendedProps.isOptional;
    const isWeekly = extendedProps.isWeeklyOff;
    const isMonthView = eventInfo.view.type === "dayGridMonth";

    if (isWeekly) {
      return null;
    }

    let colorTheme = {
      border: "border-slate-500",
      text: "text-slate-600",
      btn: "bg-slate-500",
      bg: "bg-slate-50/80"
    };

    if (isOptional) {
      colorTheme = {
        border: "border-amber-500",
        text: "text-amber-600",
        btn: "bg-amber-500",
        bg: "bg-amber-50/80"
      };
    } else {
      switch (holidayType) {
        case "PUBLIC":
          colorTheme = {
            border: "border-rose-500",
            text: "text-rose-600",
            btn: "bg-rose-500",
            bg: "bg-rose-50/80"
          };
          break;
        case "COMPANY":
          colorTheme = {
            border: "border-blue-500",
            text: "text-blue-600",
            btn: "bg-blue-500",
            bg: "bg-blue-50/80"
          };
          break;
        case "SHUTDOWN":
          colorTheme = {
            border: "border-purple-500",
            text: "text-purple-600",
            btn: "bg-purple-500",
            bg: "bg-purple-50/80"
          };
          break;
        case "FESTIVAL":
          colorTheme = {
            border: "border-emerald-500",
            text: "text-emerald-600",
            btn: "bg-emerald-500",
            bg: "bg-emerald-50/80"
          };
          break;
        case "REGIONAL":
          colorTheme = {
            border: "border-teal-500",
            text: "text-teal-600",
            btn: "bg-teal-500",
            bg: "bg-teal-50/80"
          };
          break;
        default:
          colorTheme = {
            border: "border-slate-500",
            text: "text-slate-600",
            btn: "bg-slate-500",
            bg: "bg-slate-50/80"
          };
          break;
      }
    }

    const isHalfDay = extendedProps.isHalfDay;
    if (isHalfDay) {
      colorTheme = {
        border: "border-amber-500",
        text: "text-amber-700",
        btn: "bg-amber-100",
        bg: "bg-amber-50"
      };
    }

    if (!isMonthView) {
      return (
        <div className="flex items-center gap-2 py-1 px-2 font-semibold text-xs">
          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${colorTheme.btn}`} />
          <span className={`${colorTheme.text} font-bold`}>{title}</span>
          {isHalfDay && (
            <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded font-medium">
              Half Day
            </span>
          )}
        </div>
      );
    }

    return (
      <div
        className={`relative w-full h-full ${colorTheme.bg} pl-2 pr-2.5 pt-6 pb-6 ${colorTheme.border} rounded-r-md flex flex-col justify-end overflow-hidden cursor-pointer transition-all hover:brightness-95`}
      >
        <div
          className={`text-[10.5px] sm:text-[11px] font-bold ${colorTheme.text} leading-tight break-words`}
          style={{
            whiteSpace: "normal",
            wordBreak: "break-word",
            overflowWrap: "anywhere"
          }}
          title={title}
        >
          {title}
        </div>
        {isHalfDay && (
          <div className="text-[8.5px] font-semibold text-amber-700/90 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
            Half Day • {extendedProps.halfDayStart && extendedProps.halfDayStart.slice(0, 5)} - {extendedProps.halfDayEnd && extendedProps.halfDayEnd.slice(0, 5)}
          </div>
        )}
      </div>
    );
  };

  // Get upcoming holidays
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const upcomingHolidays = holidays
    .filter((h) => h.holidayDate >= todayStr && !isWeeklyOffHelper(h))
    .sort((a, b) => parseLocalDate(a.holidayDate) - parseLocalDate(b.holidayDate))
    .slice(0, 5);

  return (
    <div className="holiday-calendar-container flex flex-col h-full">
      {/* Premium Custom Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 pb-4 border-b border-gray-100">
        <div className="flex items-center flex-wrap gap-3.5">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">{currentTitle}</h2>

          <button
            type="button"
            onClick={handleOpenPicker}
            className="relative flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-blue-700 bg-blue-50/90 hover:bg-blue-100/80 border border-blue-200/80 rounded-xl transition-all shadow-xs cursor-pointer group"
            title="Click to open calendar"
          >
            <CalendarIcon size={14} className="text-blue-600 shrink-0" />
            <span>{currentYear}</span>
            <input
              type="date"
              ref={dateInputRef}
              value={currentDateStr}
              onChange={handleDateChange}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
          </button>

          <button
            onClick={handleToday}
            className="px-3 py-1.5 text-xs font-bold text-gray-700 hover:text-blue-600 bg-white hover:bg-blue-50/50 border border-gray-200 hover:border-blue-200 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            Today
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Calendar statistics count */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-500 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5">
            <span className="font-bold text-slate-800">{activeMonthHolidaysCount}</span>
            <span>holidays this month</span>
          </div>

          {/* View Toggles */}
          <div className="flex bg-gray-100/80 border border-gray-200/50 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => handleChangeView("dayGridMonth")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${currentView === "dayGridMonth"
                ? "bg-white text-blue-600 shadow-sm border border-gray-100"
                : "text-gray-500 hover:text-gray-900"
                }`}
            >
              <CalendarIcon size={13} />
              Month
            </button>
            <button
              onClick={() => handleChangeView("listYear")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${currentView === "listYear"
                ? "bg-white text-blue-600 shadow-sm border border-gray-100"
                : "text-gray-500 hover:text-gray-900"
                }`}
            >
              <List size={13} />
              List
            </button>
          </div>
        </div>
      </div>

      {/* FullCalendar Component */}
      <div className="flex-1 bg-white">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView="dayGridMonth"
          headerToolbar={false} /* Disabled default header */
          events={events}
          eventClick={handleEventClick}
          height="auto"
          eventDisplay="block"
          dayMaxEvents={3}
          datesSet={handleDatesSet}
          eventContent={renderEventContent}
          dayCellClassNames={getDayCellClassNames}
        />
      </div>

      {/* Mockup-Inspired Bottom Horizontal Holiday Ticker */}
      {upcomingHolidays.length > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50/60 to-indigo-50/30 rounded-2xl border-2 border-dashed border-blue-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200 hover:border-blue-300">
          <div className="flex items-center gap-2 shrink-0">
            <Sparkles size={16} className="text-blue-500 animate-pulse" />
            <span className="text-sm font-extrabold text-blue-900 tracking-wide">Upcoming Holidays :</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            {upcomingHolidays.map((h, i) => {
              const formattedDate = format(parseLocalDate(h.holidayDate), "dd MMM");
              return (
                <button
                  key={h.id}
                  onClick={() => onHolidayClick(h)}
                  className="flex items-center gap-2 bg-white hover:bg-blue-50/60 border border-gray-100 hover:border-blue-100/80 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-700 hover:text-blue-800 transition-all duration-150 shadow-[0_1px_2px_rgba(0,0,0,0.02)] group/item cursor-pointer"
                >
                  <span className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-[10px] font-extrabold group-hover/item:bg-blue-100">
                    {formattedDate}
                  </span>
                  <span className="line-clamp-1">{h.title}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handleChangeView("listYear")}
            className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer shrink-0"
            title="View Full Holidays List"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

