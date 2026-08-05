"use client";

import React, { useState, useRef, useEffect } from "react";
import { Clock, ChevronDown, Check, X } from "lucide-react";

/**
 * Utility to convert 24-hour string "13:30" to 12-hour parts { h: "01", m: "30", period: "PM" }
 * If time24 is empty/null, returns empty string parts without inventing hardcoded defaults!
 */
export const parse24to12 = (time24) => {
  if (!time24) return { h: "", m: "", period: "AM" };

  if (typeof time24 === "string" && (time24.toLowerCase().includes("am") || time24.toLowerCase().includes("pm"))) {
    const parts = time24.trim().split(" ");
    const [h, m] = parts[0].split(":");
    return {
      h: h ? String(parseInt(h, 10)).padStart(2, "0") : "",
      m: m ? String(parseInt(m, 10)).padStart(2, "0") : "",
      period: (parts[1] || "AM").toUpperCase(),
    };
  }

  if (typeof time24 === "string" && time24.includes(":")) {
    const [hStr, mStr] = time24.split(":");
    let h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    if (isNaN(h)) return { h: "", m: "", period: "AM" };
    const period = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;
    return {
      h: String(h).padStart(2, "0"),
      m: isNaN(m) ? "00" : String(m).padStart(2, "0"),
      period,
    };
  }

  return { h: "", m: "", period: "AM" };
};

/**
 * Utility to convert 12-hour parts { h, m, period } back to "13:30" 24-hour string
 */
export const format12to24 = (hStr, mStr, period) => {
  if (!hStr) return "";
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr || "0", 10);
  if (period === "PM" && h < 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

const QUICK_PRESETS = [
  { label: "09:00 AM", value: "09:00" },
  { label: "09:30 AM", value: "09:30" },
  { label: "10:00 AM", value: "10:00" },
  { label: "01:00 PM", value: "13:00" },
  { label: "01:30 PM", value: "13:30" },
  { label: "06:00 PM", value: "18:00" },
  { label: "07:00 PM", value: "19:00" },
];

export default function EnterpriseTimePicker({
  value,
  onChange,
  disabled = false,
  label,
  hint,
  error,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const { h, m, period } = parse24to12(value);

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
  const minutes = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectHour = (newH) => {
    onChange(format12to24(newH, m || "00", period));
  };

  const handleSelectMinute = (newM) => {
    onChange(format12to24(h || "12", newM, period));
  };

  const handleSelectPeriod = (newP) => {
    onChange(format12to24(h || "12", m || "00", newP));
  };

  const formattedDisplay = h && m ? `${h}:${m} ${period}` : "";

  return (
    <div className={`relative w-full ${isOpen ? "z-40" : "z-10"}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border bg-white text-xs font-semibold transition-all shadow-xs ${
            error
              ? "border-red-300 ring-2 ring-red-100 text-red-700"
              : isOpen
              ? "border-[#007aff] ring-2 ring-blue-100 text-gray-900"
              : "border-gray-200 hover:border-gray-300 text-gray-800"
          } ${disabled ? "bg-gray-50 text-gray-400 cursor-not-allowed opacity-75" : "cursor-pointer"}`}
        >
          <div className="flex items-center gap-2">
            <Clock className={`h-4 w-4 ${disabled ? "text-gray-300" : "text-[#007aff]"}`} />
            <span
              className={`text-sm font-bold font-mono tracking-wide ${
                formattedDisplay ? "text-gray-900" : "text-gray-400 font-normal italic"
              }`}
            >
              {formattedDisplay || "Select Time"}
            </span>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-[#007aff]" : ""
            }`}
          />
        </button>
      </div>

      {hint && !error && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
      {error && <p className="text-[11px] font-semibold text-red-500 mt-1">{error}</p>}

      {isOpen && !disabled && (
        <div className="absolute left-0 top-full mt-2 z-50 w-72 bg-white rounded-2xl border border-gray-100 shadow-2xl p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Select Time
            </span>
            <div className="flex items-center gap-2">
              <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200">
                {["AM", "PM"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handleSelectPeriod(p)}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      period === p
                        ? "bg-[#007aff] text-white shadow-xs"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Hours Scroll Column */}
            <div>
              <span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">
                Hour
              </span>
              <div className="max-h-36 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
                {hours.map((hr) => (
                  <button
                    key={hr}
                    type="button"
                    onClick={() => handleSelectHour(hr)}
                    className={`w-full text-left px-2.5 py-1 rounded-lg text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                      h === hr
                        ? "bg-blue-50 text-[#007aff] font-extrabold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span>{hr}</span>
                    {h === hr && <Check className="h-3 w-3 text-[#007aff]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Minutes Scroll Column */}
            <div>
              <span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">
                Minute
              </span>
              <div className="max-h-36 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
                {minutes.map((mn) => (
                  <button
                    key={mn}
                    type="button"
                    onClick={() => handleSelectMinute(mn)}
                    className={`w-full text-left px-2.5 py-1 rounded-lg text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                      m === mn
                        ? "bg-blue-50 text-[#007aff] font-extrabold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span>{mn}</span>
                    {m === mn && <Check className="h-3 w-3 text-[#007aff]" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Presets & Apply Button */}
          <div className="border-t border-gray-100 pt-3 space-y-3">
            <div>
              <span className="block text-[10px] font-extrabold text-gray-400 uppercase mb-2">
                Quick Presets
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => {
                      onChange(preset.value);
                      setIsOpen(false);
                    }}
                    className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all border cursor-pointer ${
                      value === preset.value
                        ? "bg-blue-50 text-[#007aff] border-blue-200"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end border-t border-gray-100 pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full py-1.5 rounded-xl bg-[#007aff] hover:bg-blue-600 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
