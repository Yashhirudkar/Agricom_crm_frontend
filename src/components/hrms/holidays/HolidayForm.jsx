"use client";

import React, { useState, useEffect } from "react";
import { createHoliday, updateHoliday, createRecurringHolidays } from "../../../lib/api/holidays";
import axiosClient from "../../../lib/axios";

import HolidayBasicDetails from "./HolidayBasicDetails";
import HolidayRecurrenceForm from "./HolidayRecurrenceForm";
import HolidayScopeForm from "./HolidayScopeForm";

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
        const companyList = res.data?.data || (Array.isArray(res.data) ? res.data : []);
        setCompanies(companyList);
      } catch (err) {
        console.error("Error fetching companies", err);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (holiday) {
      setMode("single");
      
      setFormData({
        title: holiday.title || "",
        holidayDate: holiday.holidayDate || "",
        holidayType: holiday.holidayType || "PUBLIC",
        description: holiday.description || "",
        isOptional: holiday.isOptional || false,
        appliesTo: holiday.holidayCompanies?.length > 0 ? "selected" : "all",
        companyIds: holiday.holidayCompanies?.map((hc) => hc.companyId) || [],
        startDate: `${currentYear}-01-01`,
        endDate: `${currentYear}-12-31`,
        selectedDays: [0],
        selectedWeeks: [1, 2, 3, 4, 5],
        isHalfDay: holiday.isHalfDay || false,
        startTime: holiday.halfDayStart || "09:30",
        endTime: holiday.halfDayEnd || "15:00",
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

    const isWeeklyOff = mode === "bulk";

    // Single Holiday mode
    if (holiday?.id || mode === "single") {
      const payload = {
        title: formData.title,
        holidayDate: formData.holidayDate,
        holidayType: formData.holidayType,
        description: formData.description,
        isOptional: formData.isOptional,
        isWeeklyOff: false, // Explicit boolean field
        isHalfDay: formData.isHalfDay,
        halfDayStart: formData.isHalfDay ? formData.startTime : null,
        halfDayEnd: formData.isHalfDay ? formData.endTime : null,
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

    const confirmMsg = `This will generate recurring holidays in the calendar based on your selection. Do you want to proceed?`;
    if (!window.confirm(confirmMsg)) {
      setLoading(false);
      return;
    }

    try {
      const payload = {
        title: formData.title,
        holidayType: formData.holidayType,
        description: formData.description,
        isOptional: formData.isOptional,
        isWeeklyOff: true, // Explicit boolean field
        isHalfDay: formData.isHalfDay,
        halfDayStart: formData.isHalfDay ? formData.startTime : null,
        halfDayEnd: formData.isHalfDay ? formData.endTime : null,
        companyIds: formData.appliesTo === "selected" ? formData.companyIds : [],
        weekdays: selectedDays,
        occurrences: selectedWeeks,
        startDate: formData.startDate,
        endDate: formData.endDate,
      };

      await createRecurringHolidays(payload);
      onSave();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Something went wrong.");
    } finally {
      setLoading(false);
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

      <HolidayBasicDetails
        formData={formData}
        handleChange={handleChange}
        mode={mode}
      />

      {mode === "bulk" && (
        <HolidayRecurrenceForm
          formData={formData}
          handleChange={handleChange}
          handleDayToggle={handleDayToggle}
          handleWeekToggle={handleWeekToggle}
        />
      )}

      <HolidayScopeForm
        formData={formData}
        handleChange={handleChange}
        companies={companies}
        handleCompanyChange={handleCompanyChange}
      />

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
