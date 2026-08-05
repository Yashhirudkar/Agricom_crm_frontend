"use client";

import React from "react";

/**
 * Utility to convert 24-hour string to 12-hour parts { h, m, period }
 */
export const parse24to12 = (time24) => {
  if (!time24) return { h: "12", m: "00", period: "AM" };

  if (typeof time24 === "string" && (time24.toLowerCase().includes("am") || time24.toLowerCase().includes("pm"))) {
    const parts = time24.trim().split(" ");
    const [h, m] = parts[0].split(":");
    return {
      h: String(parseInt(h || "12", 10)).padStart(2, "0"),
      m: String(parseInt(m || "0", 10)).padStart(2, "0"),
      period: (parts[1] || "AM").toUpperCase(),
    };
  }

  if (typeof time24 === "string" && time24.includes(":")) {
    const [hStr, mStr] = time24.split(":");
    let h = parseInt(hStr || "12", 10);
    const m = parseInt(mStr || "0", 10);
    const period = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;
    return {
      h: String(h).padStart(2, "0"),
      m: String(m).padStart(2, "0"),
      period,
    };
  }

  return { h: "12", m: "00", period: "AM" };
};

/**
 * Utility to convert 12-hour parts { h, m, period } back to "13:00" 24-hour string
 */
export const format12to24 = (hStr, mStr, period) => {
  let h = parseInt(hStr || "12", 10);
  const m = parseInt(mStr || "0", 10);
  if (period === "PM" && h < 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

export default function TimePicker12h({ value, onChange, disabled = false, label }) {
  const { h, m, period } = parse24to12(value);

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
  const minutes = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

  const handleHourChange = (newH) => {
    const new24 = format12to24(newH, m, period);
    onChange(new24);
  };

  const handleMinuteChange = (newM) => {
    const new24 = format12to24(h, newM, period);
    onChange(new24);
  };

  const handlePeriodChange = (newP) => {
    const new24 = format12to24(h, m, newP);
    onChange(new24);
  };

  return (
    <div>
      {label && <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{label}</label>}
      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-xs focus-within:ring-1 focus-within:ring-[#007aff]">
        {/* Hour Select */}
        <select
          disabled={disabled}
          value={h}
          onChange={(e) => handleHourChange(e.target.value)}
          className="bg-transparent text-xs font-bold text-gray-800 outline-none cursor-pointer py-1 px-1 disabled:cursor-not-allowed"
        >
          {hours.map((hr) => (
            <option key={hr} value={hr}>
              {hr}
            </option>
          ))}
        </select>
        <span className="text-gray-400 font-bold text-xs">:</span>
        {/* Minute Select */}
        <select
          disabled={disabled}
          value={minutes.includes(m) ? m : "00"}
          onChange={(e) => handleMinuteChange(e.target.value)}
          className="bg-transparent text-xs font-bold text-gray-800 outline-none cursor-pointer py-1 px-1 disabled:cursor-not-allowed"
        >
          {minutes.map((mn) => (
            <option key={mn} value={mn}>
              {mn}
            </option>
          ))}
        </select>
        {/* AM / PM Select */}
        <select
          disabled={disabled}
          value={period}
          onChange={(e) => handlePeriodChange(e.target.value)}
          className="bg-blue-50 text-[#007aff] text-xs font-extrabold outline-none cursor-pointer py-1 px-1.5 rounded-lg border border-blue-100 disabled:cursor-not-allowed ml-auto"
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
}
