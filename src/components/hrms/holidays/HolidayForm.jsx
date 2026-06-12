"use client";

import React, { useState, useEffect } from "react";
import { createHoliday, updateHoliday } from "../../../lib/api/holidays";
import axiosClient from "../../../lib/axios";

// Helper function to calculate the exact occurrence of a weekday in its month (1st, 2nd, etc.)
const getOccurrenceInMonth = (date) => {
  const day = date.getDay();
  let count = 0;
  // Use noon to avoid timezone/DST shift issues
  for (let d = 1; d <= date.getDate(); d++) {
    const current = new Date(date.getFullYear(), date.getMonth(), d, 12, 0, 0);
    if (current.getDay() === day) {
      count++;
    }
  }
  return count;
};

// Helper function to calculate matching dates for selected weekdays in a range
const getDatesForWeekdays = (startDateStr, endDateStr, selectedDays, selectedWeeks) => {
  const dates = [];
  
  // Parse YYYY-MM-DD manually to prevent UTC timezone shift
  const [sYear, sMonth, sDay] = startDateStr.split("-").map(Number);
  const [eYear, eMonth, eDay] = endDateStr.split("-").map(Number);
  
  const start = new Date(sYear, sMonth - 1, sDay, 12, 0, 0);
  const end = new Date(eYear, eMonth - 1, eDay, 12, 0, 0);

  const current = new Date(start);
  while (current <= end) {
    const dayOfWeek = current.getDay(); // 0 is Sunday, 6 is Saturday
    if (selectedDays.includes(dayOfWeek)) {
      const occurrence = getOccurrenceInMonth(current);
      
      if (selectedWeeks.includes(occurrence)) {
        const year = current.getFullYear();
        const month = String(current.getMonth() + 1).padStart(2, "0");
        const day = String(current.getDate()).padStart(2, "0");
        dates.push(`${year}-${month}-${day}`);
      }
    }
    // Safely increment date (retaining noon hour)
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

export default function HolidayForm({ holiday, onSave, onCancel }) {
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({
    title: "",
    holidayDate: "",
    holidayType: "PUBLIC",
    description: "",
    isOptional: false,
    appliesTo: "all",
    companyIds: [],
    // Bulk weekly off options
    startDate: `${currentYear}-01-01`,
    endDate: `${currentYear}-12-31`,
    selectedDays: [0], // Default Sunday
    selectedWeeks: [1, 2, 3, 4, 5], // Default all weeks
    // Half Day options
    isHalfDay: false,
    startTime: "09:30",
    endTime: "15:00",
  });

  const [mode, setMode] = useState("single"); // "single" or "bulk"
  const [bulkProgress, setBulkProgress] = useState(null); // { current: number, total: number }
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch available companies for the select
    const fetchCompanies = async () => {
      try {
        const res = await axiosClient.get("/GetCompanies");
        setCompanies(res.data || []);
      } catch (err) {
        console.error("Error fetching companies", err);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (holiday) {
      setMode("single");
      
      const desc = holiday.description || "";
      const metaMatch = desc.match(/\[HalfDayTime:(\d{2}:\d{2})-(\d{2}:\d{2})\]/);
      const isHalfDay = !!metaMatch;
      const startTime = isHalfDay ? metaMatch[1] : "09:30";
      const endTime = isHalfDay ? metaMatch[2] : "15:00";
      let cleanDesc = desc;
      if (isHalfDay) {
        cleanDesc = cleanDesc.replace(/\[HalfDayTime:\d{2}:\d{2}-\d{2}:\d{2}\]/g, "").trim();
        cleanDesc = cleanDesc.replace(/Half Day Timings:[^\n]*\n?/g, "").trim();
      }

      setFormData({
        title: holiday.title || "",
        holidayDate: holiday.holidayDate || "",
        holidayType: holiday.holidayType || "PUBLIC",
        description: cleanDesc,
        isOptional: holiday.isOptional || false,
        appliesTo: holiday.holidayCompanies?.length > 0 ? "selected" : "all",
        companyIds: holiday.holidayCompanies?.map((hc) => hc.companyId) || [],
        startDate: `${currentYear}-01-01`,
        endDate: `${currentYear}-12-31`,
        selectedDays: [0],
        selectedWeeks: [1, 2, 3, 4, 5],
        isHalfDay,
        startTime,
        endTime,
      });
    }
  }, [holiday, currentYear]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDayToggle = (dayValue) => {
    setFormData((prev) => {
      const isSelected = prev.selectedDays.includes(dayValue);
      return {
        ...prev,
        selectedDays: isSelected
          ? prev.selectedDays.filter((d) => d !== dayValue)
          : [...prev.selectedDays, dayValue],
      };
    });
  };

  const handleWeekToggle = (weekValue) => {
    setFormData((prev) => {
      const isSelected = prev.selectedWeeks.includes(weekValue);
      return {
        ...prev,
        selectedWeeks: isSelected
          ? prev.selectedWeeks.filter((w) => w !== weekValue)
          : [...prev.selectedWeeks, weekValue],
      };
    });
  };

  const handleCompanyChange = (companyId) => {
    setFormData((prev) => {
      const isSelected = prev.companyIds.includes(companyId);
      return {
        ...prev,
        companyIds: isSelected
          ? prev.companyIds.filter((id) => id !== companyId)
          : [...prev.companyIds, companyId],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Helper to format time
    const formatTime12h = (time24) => {
      if (!time24) return "";
      const [hourStr, minStr] = time24.split(":");
      const hour = parseInt(hourStr, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minStr} ${ampm}`;
    };

    // Construct description with half day timing
    let finalDescription = formData.description;
    if (formData.isHalfDay) {
      const timingStr = `Half Day Timings: ${formatTime12h(formData.startTime)} - ${formatTime12h(formData.endTime)}`;
      finalDescription = `${timingStr}\n${formData.description || ""}\n[HalfDayTime:${formData.startTime}-${formData.endTime}]`.trim();
    }

    // Single Holiday mode
    if (holiday?.id || mode === "single") {
      const payload = {
        title: formData.title,
        holidayDate: formData.holidayDate,
        holidayType: formData.holidayType,
        description: finalDescription,
        isOptional: formData.isOptional,
        companyIds: formData.appliesTo === "selected" ? formData.companyIds : [],
      };

      try {
        if (holiday?.id) {
          await updateHoliday(holiday.id, payload);
        } else {
          await createHoliday(payload);
        }
        onSave();
      } catch (err) {
        setError(err?.response?.data?.message || "Something went wrong.");
        setLoading(false);
      }
      return;
    }

    // Bulk Weekly Off mode
    const selectedDays = formData.selectedDays;
    if (!selectedDays || selectedDays.length === 0) {
      setError("Please select at least one day of the week.");
      setLoading(false);
      return;
    }

    const selectedWeeks = formData.selectedWeeks;
    if (!selectedWeeks || selectedWeeks.length === 0) {
      setError("Please select at least one occurrence in the month.");
      setLoading(false);
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      setError("Please specify both start and end dates.");
      setLoading(false);
      return;
    }

    const matchingDates = getDatesForWeekdays(formData.startDate, formData.endDate, selectedDays, selectedWeeks);
    if (matchingDates.length === 0) {
      setError("No matching days found in the selected date range.");
      setLoading(false);
      return;
    }

    const confirmMsg = `This will generate ${matchingDates.length} holidays in the calendar. Do you want to proceed?`;
    if (!window.confirm(confirmMsg)) {
      setLoading(false);
      return;
    }

    setBulkProgress({ current: 0, total: matchingDates.length });

    try {
      const companyIds = formData.appliesTo === "selected" ? formData.companyIds : [];
      
      for (let i = 0; i < matchingDates.length; i++) {
        const dateStr = matchingDates[i];
        const payload = {
          title: formData.title,
          holidayDate: dateStr,
          holidayType: formData.holidayType,
          description: finalDescription,
          isOptional: formData.isOptional,
          companyIds,
        };

        await createHoliday(payload);
        setBulkProgress({ current: i + 1, total: matchingDates.length });
      }

      onSave();
    } catch (err) {
      setError(
        `Failed at holiday ${bulkProgress?.current + 1 || 1} of ${matchingDates.length}: ` + 
        (err?.response?.data?.message || err.message || "Something went wrong.")
      );
    } finally {
      setLoading(false);
      setBulkProgress(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}

      {/* Mode Toggle Switch - Only show if creating a new holiday */}
      {!holiday && (
        <div className="flex bg-gray-100 p-1 rounded-xl mb-5">
          <button
            type="button"
            onClick={() => setMode("single")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === "single"
                ? "bg-white text-blue-600 shadow-sm border border-gray-200/50"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Single Holiday
          </button>
          <button
            type="button"
            onClick={() => setMode("bulk")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === "bulk"
                ? "bg-white text-blue-600 shadow-sm border border-gray-200/50"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Bulk Weekly Offs
          </button>
        </div>
      )}

      {/* Bulk Progress Bar */}
      {bulkProgress && (
        <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-100 flex flex-col items-center justify-center space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
            <span className="text-xs font-bold text-blue-800">
              Generating Holidays: {bulkProgress.current} of {bulkProgress.total} ({Math.round((bulkProgress.current / bulkProgress.total) * 100)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-150"
              style={{ width: `${(bulkProgress.current / bulkProgress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {mode === "bulk" ? "Holiday/Off Name *" : "Holiday Name *"}
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={mode === "bulk" ? "e.g. Sunday Weekly Off" : "e.g. Independence Day"}
        />
      </div>

      {mode === "single" ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
          <input
            type="date"
            name="holidayDate"
            value={formData.holidayDate}
            onChange={handleChange}
            required={mode === "single"}
            className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ) : (
        <>
          {/* Weekday checkboxes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Days of the Week *</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Sunday", value: 0 },
                { label: "Monday", value: 1 },
                { label: "Tuesday", value: 2 },
                { label: "Wednesday", value: 3 },
                { label: "Thursday", value: 4 },
                { label: "Friday", value: 5 },
                { label: "Saturday", value: 6 },
              ].map((day) => {
                const isSelected = formData.selectedDays.includes(day.value);
                return (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => handleDayToggle(day.value)}
                    className={`py-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                      isSelected
                        ? "bg-blue-50 border-blue-200 text-blue-700 font-bold"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {day.label.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Week of month checkboxes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Occurrences in Month *</label>
            <div className="grid grid-cols-5 gap-2">
              {[
                { label: "1st Week", value: 1 },
                { label: "2nd Week", value: 2 },
                { label: "3rd Week", value: 3 },
                { label: "4th Week", value: 4 },
                { label: "5th Week", value: 5 },
              ].map((wk) => {
                const isSelected = formData.selectedWeeks.includes(wk.value);
                return (
                  <button
                    key={wk.value}
                    type="button"
                    onClick={() => handleWeekToggle(wk.value)}
                    className={`py-2 text-[10px] font-semibold rounded-lg border text-center transition-all ${
                      isSelected
                        ? "bg-blue-50 border-blue-200 text-blue-700 font-bold"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {wk.label.split(" ")[0]}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Select weeks of the month to apply (e.g. check 2nd & 4th Saturday).</p>
          </div>

          {/* Date range picker */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required={mode === "bulk"}
                className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required={mode === "bulk"}
                className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
        <select
          name="holidayType"
          value={formData.holidayType}
          onChange={handleChange}
          required
          className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="PUBLIC">Public Holiday</option>
          <option value="COMPANY">Company Holiday</option>
          <option value="SHUTDOWN">Office Shutdown</option>
          <option value="FESTIVAL">Festival Holiday</option>
          <option value="REGIONAL">Regional Holiday</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Optional description..."
        ></textarea>
      </div>

      <div className="flex items-center">
        <input
          id="isOptional"
          type="checkbox"
          name="isOptional"
          checked={formData.isOptional}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <label htmlFor="isOptional" className="ml-2 block text-sm text-gray-700">
          Mark as Optional Holiday
        </label>
      </div>

      {/* Half Day Option */}
      <div className="border-t border-gray-150 pt-4 space-y-4">
        <div className="flex items-center">
          <input
            id="isHalfDay"
            type="checkbox"
            name="isHalfDay"
            checked={formData.isHalfDay}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="isHalfDay" className="ml-2 block text-sm font-medium text-gray-700">
            Is Half Day?
          </label>
        </div>

        {formData.isHalfDay && (
          <div className="grid grid-cols-2 gap-4 pl-6">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required={formData.isHalfDay}
                className="w-full text-gray-700 px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">End Time</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required={formData.isHalfDay}
                className="w-full text-gray-700 px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Scope</h4>
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              id="appliesAll"
              name="appliesTo"
              type="radio"
              value="all"
              checked={formData.appliesTo === "all"}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300"
            />
            <label htmlFor="appliesAll" className="ml-3 block text-sm font-medium text-gray-700">
              Entire Client
              <p className="text-xs text-gray-500 font-normal mt-0.5">Applies to all companies</p>
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="appliesSelected"
              name="appliesTo"
              type="radio"
              value="selected"
              checked={formData.appliesTo === "selected"}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300"
            />
            <label htmlFor="appliesSelected" className="ml-3 block text-sm font-medium text-gray-700">
              Selected Companies
              <p className="text-xs text-gray-500 font-normal mt-0.5">Applies only to specific offices</p>
            </label>
          </div>
        </div>

        {formData.appliesTo === "selected" && (
          <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50 max-h-48 overflow-y-auto">
            {companies.length === 0 ? (
              <p className="text-sm text-gray-500">No companies found.</p>
            ) : (
              <div className="space-y-2">
                {companies.map((company) => (
                  <div key={company.id} className="flex items-center">
                    <input
                      id={`company-${company.id}`}
                      type="checkbox"
                      checked={formData.companyIds.includes(company.id)}
                      onChange={() => handleCompanyChange(company.id)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor={`company-${company.id}`} className="ml-2 block text-sm text-gray-700">
                      {company.name}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? (mode === "bulk" ? "Generating..." : "Saving...") : "Save Holiday"}
        </button>
      </div>
    </form>
  );
}
