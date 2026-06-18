"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMonthlyReport, selectMonthlyReport, selectAttendanceLoading } from "@/store/entities/attendanceSlice";
import { Calendar as CalendarIcon, Download, ChevronLeft, ChevronRight, LayoutList } from "lucide-react";

import ReportStats from "./components/ReportStats";
import CalendarView from "./components/CalendarView";
import ListView from "./components/ListView";

export default function ReportsPage() {
  const dispatch = useDispatch();
  const reportData = useSelector(selectMonthlyReport) || {};
  const isLoading = useSelector(selectAttendanceLoading);

  // States
  const [referenceDate, setReferenceDate] = useState(new Date()); // Current tracking date
  const [viewMode, setViewMode] = useState("list"); // 'calendar' | 'list'
  const [listRange, setListRange] = useState("week"); // 'week' | 'month'

  useEffect(() => {
    // Fetch monthly report whenever the month of referenceDate changes
    dispatch(fetchMonthlyReport({
      month: referenceDate.getMonth() + 1,
      year: referenceDate.getFullYear()
    }));
  }, [dispatch, referenceDate.getMonth(), referenceDate.getFullYear()]);

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

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-8 bg-gray-50 min-h-screen">

      {/* Top Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Attendance Summary</h1>
          <p className="text-gray-500 mt-1">Review your attendance timeline and overall summary.</p>
        </div>

        <div className="flex gap-3 mt-4 md:mt-0 items-center flex-wrap">

          {/* Main View Toggle (Calendar vs List) */}
          <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm p-1">
            <button onClick={() => setViewMode('list')} className={`px-4 py-1.5 text-sm font-bold transition-all rounded-lg flex items-center gap-1.5 ${viewMode === 'list' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}><LayoutList className="w-4 h-4" /> List</button>
            <button onClick={() => setViewMode('calendar')} className={`px-4 py-1.5 text-sm font-bold transition-all rounded-lg flex items-center gap-1.5 ${viewMode === 'calendar' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}><CalendarIcon className="w-4 h-4" /> Calendar</button>
          </div>

          {/* Sub Filter: Weekly vs Monthly (Only visible in List view) */}
          {viewMode === 'list' && (
            <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm p-1">
              <button onClick={() => setListRange('week')} className={`px-4 py-1.5 text-sm font-bold transition-all rounded-lg flex items-center gap-1.5 ${listRange === 'week' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}>Weekly</button>
              <button onClick={() => setListRange('month')} className={`px-4 py-1.5 text-sm font-bold transition-all rounded-lg flex items-center gap-1.5 ${listRange === 'month' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}>Monthly</button>
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
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm bg-white"
          />

          <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 shadow-md transition-all">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-0 border  border-gray-100 ">
        {/* Summary Cards */}
        <ReportStats stats={stats} />

        <div className="bg-white  shadow-sm  overflow-hidden p-6 md:p-8 ">

          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : viewMode === 'calendar' ? (
            <CalendarView referenceDate={referenceDate} records={records} />
          ) : (
            <ListView daysInView={daysInView} records={records} />
          )}
        </div>
      </div>
    </div>
  );
}