"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMonthlyReport, selectMonthlyReport, selectAttendanceLoading } from "@/store/entities/attendanceSlice";
import { fetchAttendancePolicy, selectCurrentHrPolicy } from "@/store/entities/companyHrPoliciesSlice";
import { Calendar as CalendarIcon, Download, LayoutList, RefreshCw } from "lucide-react";
import { selectActiveCompanyId } from "@/store/slices/companyContextSlice";

import ReportStats from "./components/ReportStats";
import PolicyInfoBar from "./components/PolicyInfoBar";
import CalendarView from "./components/CalendarView";
import ListView from "./components/ListView";

export default function ReportsPage() {
  const dispatch = useDispatch();
  const reportData = useSelector(selectMonthlyReport) || {};
  const isLoading = useSelector(selectAttendanceLoading);
  const activeCompanyId = useSelector(selectActiveCompanyId);
  const hrPolicy = useSelector(selectCurrentHrPolicy);

  // States
  const [referenceDate, setReferenceDate] = useState(new Date()); // Current tracking date
  const [viewMode, setViewMode] = useState("list"); // 'calendar' | 'list'
  const [listRange, setListRange] = useState("week"); // 'week' | 'month'

  useEffect(() => {
    dispatch(fetchAttendancePolicy());
  }, [dispatch, activeCompanyId]);

  useEffect(() => {
    // Fetch monthly report whenever the month of referenceDate changes
    dispatch(fetchMonthlyReport({
      month: referenceDate.getMonth() + 1,
      year: referenceDate.getFullYear()
    }));
  }, [dispatch, activeCompanyId, referenceDate.getMonth(), referenceDate.getFullYear()]);

  // Generate Dates Array based on 'week' or 'month'
  const getDaysInView = () => {
    const dates = [];
    if (viewMode === 'list' && listRange === 'week') {
      // Get Sunday of the current referenceDate
      const d = new Date(referenceDate);
      const day = d.getDay();
      const diff = d.getDate() - day;
      const startOfWeek = new Date(d.setDate(diff));

      // Array of 7 days (Sun to Sat)
      for (let i = 0; i < 7; i++) {
        const weekDay = new Date(startOfWeek);
        weekDay.setDate(weekDay.getDate() + i);
        dates.push(weekDay);
      }
    } else {
      // Whole Month logic
      const daysInMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        dates.push(new Date(referenceDate.getFullYear(), referenceDate.getMonth(), i));
      }
    }
    return dates;
  };

  const daysInView = getDaysInView();

  // API Data Setup
  const reportArray = Array.isArray(reportData) ? reportData : [];
  const currentReport = reportArray.length > 0 ? reportArray[0] : null;
  const stats = currentReport?.summary || { present: 0, absent: 0, late: 0, halfDay: 0, overtime: 0 };
  const records = currentReport?.days || [];

  // Derive filtered records matching visible dates in view (Weekly vs Monthly)
  const visibleDateSet = new Set(daysInView.map(d => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }));
  const filteredRecords = records.filter(r => visibleDateSet.has(r.date));

  const handleExport = () => {
    if (records.length === 0) return;
    const headers = ["Date", "Status", "Live State", "Check In", "Check Out", "Work Hours", "Overtime", "Late Minutes", "Conflict"];
    const rows = records.map(r => [
      r.date || "",
      r.status || "",
      r.attendanceState || "",
      r.checkIn ? new Date(r.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
      r.checkOut ? new Date(r.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
      r.workHours || 0,
      r.overtime || 0,
      r.lateMinutes || 0,
      r.isConflict ? "Yes" : "No"
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(","), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_summary_${referenceDate.getFullYear()}_${referenceDate.getMonth() + 1}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-6 bg-slate-50/50 min-h-screen">

      {/* Top Header & Zoho-style Controls Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 md:p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Attendance Summary</h1>
          <p className="text-slate-500 text-xs mt-1 font-medium">Review your attendance timeline, policy rules and overall summary.</p>
        </div>

        <div className="flex gap-2.5 items-center flex-wrap">

          {/* Main View Toggle (Calendar vs List) */}
          <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-xs font-semibold transition-all rounded-lg flex items-center gap-1.5 ${viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              <LayoutList className="w-3.5 h-3.5" /> List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 text-xs font-semibold transition-all rounded-lg flex items-center gap-1.5 ${viewMode === 'calendar'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" /> Calendar
            </button>
          </div>

          {/* Sub Filter: Weekly vs Monthly (Only visible in List view) */}
          {viewMode === 'list' && (
            <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
              <button
                onClick={() => setListRange('week')}
                className={`px-3 py-1.5 text-xs font-semibold transition-all rounded-lg ${listRange === 'week'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setListRange('month')}
                className={`px-3 py-1.5 text-xs font-semibold transition-all rounded-lg ${listRange === 'month'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                Monthly
              </button>
            </div>
          )}

          {/* Date Selector */}
          <input
            type="date"
            value={`${referenceDate.getFullYear()}-${String(referenceDate.getMonth() + 1).padStart(2, '0')}-${String(referenceDate.getDate()).padStart(2, '0')}`}
            onChange={(e) => {
              if (e.target.value) {
                const [y, m, d] = e.target.value.split('-');
                setReferenceDate(new Date(y, m - 1, d));
              }
            }}
            className="h-9 border border-slate-200/80 rounded-xl px-3 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none shadow-2xs bg-white transition-all"
          />

          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={records.length === 0}
            className="h-9 flex items-center gap-1.5 bg-slate-900 text-white px-4 rounded-xl text-xs font-bold hover:bg-slate-800 shadow-2xs transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      {/* Dynamic Policy Info Ribbon Bar */}
      <PolicyInfoBar hrPolicy={hrPolicy} />

      {/* KPI Cards Summary Strip */}
      <ReportStats stats={stats} records={filteredRecords} hrPolicy={hrPolicy} />

      {/* Attendance Timeline / Main View Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden p-4 md:p-6">
        {isLoading ? (
          <div className="h-64 flex items-center justify-center gap-3">
            <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
            <span className="text-xs font-semibold text-slate-500">Loading attendance summary...</span>
          </div>
        ) : viewMode === 'calendar' ? (
          <CalendarView referenceDate={referenceDate} records={records} />
        ) : (
          <ListView daysInView={daysInView} records={records} />
        )}
      </div>

    </div>
  );
}