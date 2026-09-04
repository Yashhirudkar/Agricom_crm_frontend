"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Drawer from "@/components/drawers/Drawer";
import CountryMultiSelect from "@/components/common/CountryMultiSelect";
import { monthlyStockSummaryApi } from "../services/monthlyStockSummaryApi";
import { toast } from "sonner";
import { Sparkles, Globe, Calendar, CheckCircle2, Lock, FileSpreadsheet, ExternalLink } from "lucide-react";

const MONTH_OPTIONS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const YEAR_OPTIONS = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

export default function MonthlyStockSummaryDrawer({
  isOpen,
  onClose,
  mode = "add", // "add" | "edit" | "view" | "duplicate"
  initialData = null,
  onSuccess,
}) {
  const router = useRouter();

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [form, setForm] = useState({
    month: currentMonth,
    year: currentYear,
    countries: [{ iso2Code: "IN", countryName: "India" }],
    status: "Draft",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [reportDetails, setReportDetails] = useState(null);

  const fetchFullDetails = async (id) => {
    try {
      const res = await monthlyStockSummaryApi.getById(id);
      setReportDetails(res.data);
    } catch (err) {
      console.error("Fetch report details error:", err);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setReportDetails(null);
      return;
    }

    if (initialData?.id) {
      fetchFullDetails(initialData.id);
    }

    if (initialData) {
      if (mode === "duplicate") {
        // Intelligent Next-Month Duplication Logic:
        // Dec 2026 -> Jan 2027 (month=1, year=2027)
        let nextMonth = initialData.month + 1;
        let nextYear = initialData.year;
        if (nextMonth > 12) {
          nextMonth = 1;
          nextYear += 1;
        }

        setForm({
          month: nextMonth,
          year: nextYear,
          countries: initialData.countries?.map((c) => ({
            iso2Code: c.iso2Code,
            countryName: c.countryName,
          })) || [],
          status: "Draft",
        });
      } else {
        setForm({
          month: initialData.month || currentMonth,
          year: initialData.year || currentYear,
          countries: initialData.countries?.map((c) => ({
            iso2Code: c.iso2Code,
            countryName: c.countryName,
          })) || [],
          status: initialData.status || "Draft",
        });
      }
    } else {
      setForm({
        month: currentMonth,
        year: currentYear,
        countries: [{ iso2Code: "IN", countryName: "India" }],
        status: "Draft",
      });
    }

    setErrors({});
  }, [isOpen, initialData, mode]);

  // Dynamically compute live report title preview
  const liveReportTitle = useMemo(() => {
    if (!form.countries || form.countries.length === 0) return "STOCK SUMMARY";
    if (form.countries.length >= 5) return "GLOBAL STOCK SUMMARY";
    const countryNames = form.countries.map((c) => (c.countryName || "").toUpperCase());
    return countryNames.join(" / ") + " STOCK";
  }, [form.countries]);

  const isReadOnly = mode === "view" || (mode === "edit" && initialData?.status === "Published");

  const drawerTitle =
    mode === "add"
      ? "+ Add Monthly Entry"
      : mode === "edit"
      ? "Edit Monthly Entry"
      : mode === "duplicate"
      ? "Duplicate Monthly Entry"
      : "Monthly Stock Summary Details";

  const drawerSubtitle =
    mode === "view"
      ? `Report #${initialData?.id || ""} - ${liveReportTitle}`
      : "Maintain monthly stock summary parameters for consolidated reporting.";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isReadOnly) return;

    const newErrors = {};
    if (!form.month) newErrors.month = "Report month is required";
    if (!form.year) newErrors.year = "Report year is required";
    if (!form.countries || form.countries.length === 0) {
      newErrors.countries = "Select at least one country for report scope";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        month: Number(form.month),
        year: Number(form.year),
        countries: form.countries,
        status: form.status,
        ...(mode === "duplicate" && initialData?.id && { sourceSummaryId: initialData.id }),
      };

      if (mode === "edit" && initialData?.id) {
        await monthlyStockSummaryApi.update(initialData.id, payload);
        toast.success("Monthly Stock Summary updated successfully!");
        onSuccess?.();
        onClose();
        router.push(`/logistics/monthly-stock-summary/${initialData.id}/report-builder?mode=edit`);
      } else {
        const res = await monthlyStockSummaryApi.create(payload);
        const newRecord = res.data;
        toast.success(
          mode === "duplicate"
            ? "Monthly Stock Summary duplicated successfully!"
            : "Monthly Stock Summary created successfully!"
        );
        onSuccess?.();
        onClose();
        if (newRecord?.id) {
          router.push(`/logistics/monthly-stock-summary/${newRecord.id}/report-builder?mode=edit`);
        }
      }
    } catch (err) {
      console.error("Save error:", err);
      const serverMsg = err.response?.data?.message;
      if (serverMsg) {
        toast.error(serverMsg);
        if (serverMsg.toLowerCase().includes("already exists")) {
          setErrors({ month: serverMsg, year: serverMsg });
        }
      } else {
        toast.error("Failed to save Monthly Stock Summary.");
      }
    } finally {
      setLoading(false);
    }
  };

  const footerButtons = (
    <div className="flex items-center gap-3 w-full justify-end">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
      >
        {isReadOnly ? "Close" : "Cancel"}
      </button>

      {!isReadOnly && (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="px-5 py-2 text-xs font-semibold text-white bg-[#007aff] hover:bg-blue-600 rounded-xl transition-colors shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {mode === "edit" ? "Update Entry" : mode === "duplicate" ? "Create Duplicate" : "Save Monthly Entry"}
        </button>
      )}
    </div>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={drawerTitle}
      subtitle={drawerSubtitle}
      footer={footerButtons}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Read-only Alert banner if published */}
        {mode === "edit" && initialData?.status === "Published" && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-amber-800 text-xs font-medium">
            <Lock className="h-4 w-4 flex-shrink-0 text-amber-600" />
            <span>This report is Published and read-only. Edit operations are restricted.</span>
          </div>
        )}

        {/* SECTION 1: Scope & Countries Selection */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-[#007aff]" />
              Stock Scope (Countries) <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-gray-400 font-medium">Multi-select searchable</span>
          </div>

          <CountryMultiSelect
            disabled={isReadOnly}
            value={form.countries}
            onChange={(val) => {
              setForm((f) => ({ ...f, countries: val }));
              if (errors.countries) setErrors((e) => ({ ...e, countries: undefined }));
            }}
            error={!!errors.countries}
          />
          {errors.countries && <p className="text-[11px] text-red-500 font-medium">{errors.countries}</p>}

          {/* Styled Live Report Title Card */}
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-100/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Generated Report Title Preview
              </span>
              <span className="text-[10px] text-gray-400 bg-white/80 px-2 py-0.5 rounded-full border border-gray-100 font-mono">
                Auto-calculated
              </span>
            </div>

            <div className="py-2 px-3 bg-white/90 rounded-lg border border-blue-200/60 shadow-2xs text-center">
              <span className="text-sm font-extrabold text-gray-900 tracking-wide font-mono">
                {liveReportTitle}
              </span>
            </div>

            <p className="text-[11px] text-gray-400 font-medium text-center">
              This title is generated automatically based on the selected scope.
            </p>
          </div>
        </div>

        {/* SECTION 2: Basic Information (Month, Year, Status) */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs space-y-4">
          <label className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-[#007aff]" />
            Report Period & Status
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Report Month */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Report Month <span className="text-red-500">*</span>
              </label>
              <select
                disabled={isReadOnly}
                value={form.month}
                onChange={(e) => {
                  setForm((f) => ({ ...f, month: Number(e.target.value) }));
                  if (errors.month) setErrors((e) => ({ ...e, month: undefined }));
                }}
                className={`w-full px-3 py-2 text-xs border rounded-xl bg-white focus:outline-none focus:border-[#007aff] ${
                  errors.month ? "border-red-500" : "border-gray-200"
                } ${isReadOnly ? "bg-gray-50 opacity-80 cursor-not-allowed" : ""}`}
              >
                {MONTH_OPTIONS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Report Year */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Report Year <span className="text-red-500">*</span>
              </label>
              <select
                disabled={isReadOnly}
                value={form.year}
                onChange={(e) => {
                  setForm((f) => ({ ...f, year: Number(e.target.value) }));
                  if (errors.year) setErrors((e) => ({ ...e, year: undefined }));
                }}
                className={`w-full px-3 py-2 text-xs border rounded-xl bg-white focus:outline-none focus:border-[#007aff] ${
                  errors.year ? "border-red-500" : "border-gray-200"
                } ${isReadOnly ? "bg-gray-50 opacity-80 cursor-not-allowed" : ""}`}
              >
                {YEAR_OPTIONS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                disabled={isReadOnly}
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className={`w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[#007aff] ${
                  isReadOnly ? "bg-gray-50 opacity-80 cursor-not-allowed" : ""
                }`}
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>

          {(errors.month || errors.year) && (
            <p className="text-[11px] text-red-500 font-medium">{errors.month || errors.year}</p>
          )}
        </div>

        {/* SECTION 3: Report Stock Sections Launcher */}
        {initialData?.id ? (
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                <FileSpreadsheet className="h-4 w-4 text-[#007aff]" />
                REPORT STOCK SECTIONS
              </div>
              {reportDetails?.sections && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-[#007aff]">
                  {reportDetails.sections.length} {reportDetails.sections.length === 1 ? "Section" : "Sections"}
                </span>
              )}
            </div>

            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              This report contains dynamic spreadsheet sections. Metadata is maintained here; all section, column, and row editing happens in the full-screen report builder workspace.
            </p>

            {reportDetails?.updatedAt && (
              <div className="text-[11px] text-gray-400 font-medium flex items-center justify-between pt-2 border-t border-gray-100">
                <span>Last Updated</span>
                <span>{new Date(reportDetails.updatedAt).toLocaleString()}</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                onClose();
                router.push(`/logistics/monthly-stock-summary/${initialData.id}/report-builder`);
              }}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#007aff] to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ExternalLink className="h-4 w-4" />
              Open Report Builder
            </button>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-2xl border border-dashed border-gray-200 text-center space-y-2">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-[#007aff]">
              <Sparkles className="h-5 w-5" />
            </div>
            <h4 className="text-xs font-bold text-gray-800">Report Builder Workspace</h4>
            <p className="text-[11px] text-gray-400 font-medium">
              Save this monthly summary entry to open the full-screen report builder workspace.
            </p>
          </div>
        )}
      </form>
    </Drawer>
  );
}
