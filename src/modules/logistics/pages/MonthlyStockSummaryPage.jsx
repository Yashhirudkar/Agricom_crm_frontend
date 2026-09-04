"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileText, Plus, Search, Filter, AlertTriangle, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { monthlyStockSummaryApi } from "../services/monthlyStockSummaryApi";
import MonthlyStockSummaryTable from "../components/MonthlyStockSummaryTable";
import MonthlyStockSummaryDrawer from "../components/MonthlyStockSummaryDrawer";
import MonthlyStockReportBuilderPage from "./MonthlyStockReportBuilderPage";
import Pagination from "@/components/common/Pagination";

const MONTH_LIST = [
  { value: "All", label: "All Months" },
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

const YEAR_LIST = ["All", 2024, 2025, 2026, 2027, 2028, 2029, 2030];

export default function MonthlyStockSummaryPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("add"); // "add" | "edit" | "view" | "duplicate"
  const [selectedRecord, setSelectedRecord] = useState(null);

  // 95% Width Slide-Over Report Builder Drawer state
  const [builderDrawer, setBuilderDrawer] = useState({
    isOpen: false,
    id: null,
    mode: "edit",
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [monthFilter, yearFilter, statusFilter]);

  // Fetch list
  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 10,
          ...(debouncedSearch && { search: debouncedSearch }),
          ...(monthFilter !== "All" && { month: Number(monthFilter) }),
          ...(yearFilter !== "All" && { year: Number(yearFilter) }),
          ...(statusFilter !== "All" && { status: statusFilter }),
        };

        const res = await monthlyStockSummaryApi.getAll(params);
        if (!cancelled) {
          setData(res.data?.data || []);
          setTotal(res.data?.total || 0);
          setTotalPages(res.data?.totalPages || 1);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch monthly stock summaries", err);
          toast.error("Failed to load monthly stock summaries.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [page, debouncedSearch, monthFilter, yearFilter, statusFilter, refreshKey]);

  const handleOpenAdd = () => {
    setSelectedRecord(null);
    setDrawerMode("add");
    setDrawerOpen(true);
  };

  const handleOpenView = (record) => {
    setBuilderDrawer({ isOpen: true, id: record.id, mode: "view" });
  };

  const handleOpenEdit = (record) => {
    setBuilderDrawer({ isOpen: true, id: record.id, mode: "edit" });
  };

  const handleOpenDuplicate = (record) => {
    setSelectedRecord(record);
    setDrawerMode("duplicate");
    setDrawerOpen(true);
  };

  const [deleteRecordTarget, setDeleteRecordTarget] = useState(null);
  const [publishRecordTarget, setPublishRecordTarget] = useState(null);

  const handlePublish = (record) => {
    setPublishRecordTarget(record);
  };

  const confirmPublishRecord = async () => {
    if (!publishRecordTarget) return;
    try {
      await monthlyStockSummaryApi.publish(publishRecordTarget.id);
      toast.success(`Report "${publishRecordTarget.reportTitle}" published successfully!`);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error("Publish error:", err);
      toast.error(err.response?.data?.message || "Failed to publish report.");
    } finally {
      setPublishRecordTarget(null);
    }
  };

  const handleDelete = (record) => {
    setDeleteRecordTarget(record);
  };

  const confirmDeleteRecord = async () => {
    if (!deleteRecordTarget) return;
    try {
      await monthlyStockSummaryApi.delete(deleteRecordTarget.id);
      toast.success("Draft report deleted successfully.");
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error("Delete report error:", err);
      toast.error(err.response?.data?.message || "Failed to delete report.");
    } finally {
      setDeleteRecordTarget(null);
    }
  };

  return (
    <div className={`p-6 md:p-8 max-w-[1600px] mx-auto space-y-6 ${builderDrawer.isOpen ? "no-print" : ""}`}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
            <FileText className="h-6 w-6 text-[#007aff]" />
            Monthly Stock Summary
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Manage monthly management stock reports used for generating consolidated stock summaries.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Monthly Entry
        </button>
      </div>

      {/* Filter and Search Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Tabs */}
          <div className="flex items-center bg-gray-50/80 p-1 rounded-xl border border-gray-100">
            {["All", "Draft", "Published"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  statusFilter === st
                    ? "bg-white text-gray-900 shadow-xs border border-gray-200/50"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Month Filter Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="px-3 py-1.5 text-xs border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[#007aff] text-gray-700 font-medium"
            >
              {MONTH_LIST.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="px-3 py-1.5 text-xs border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[#007aff] text-gray-700 font-medium"
            >
              {YEAR_LIST.map((y) => (
                <option key={y} value={y}>
                  {y === "All" ? "All Years" : y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Creator or Country..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff]"
          />
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
        <MonthlyStockSummaryTable
          data={data}
          loading={loading}
          onView={handleOpenView}
          onEdit={handleOpenEdit}
          onPublish={handlePublish}
          onDuplicate={handleOpenDuplicate}
          onDelete={handleDelete}
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {/* Form Drawer */}
      <MonthlyStockSummaryDrawer
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedRecord(null);
        }}
        mode={drawerMode}
        initialData={selectedRecord}
        onSuccess={() => setRefreshKey((k) => k + 1)}
      />

      {/* 95% Width Slide-over Full-Screen Report Builder Drawer */}
      {builderDrawer.isOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setBuilderDrawer({ isOpen: false, id: null, mode: "edit" });
              setRefreshKey((k) => k + 1);
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200 cursor-pointer print:static print:bg-white print:p-0 print:m-0 print:w-full print:h-auto print:block"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-[95vw] h-full shadow-2xl border-l border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300 cursor-default print:w-full print:h-auto print:shadow-none print:border-none print:overflow-visible print:block"
          >


            {/* 95% Drawer Content */}
            <div className="flex-1 overflow-y-auto bg-gray-50/50 p-2 md:p-4 print:p-0 print:bg-white print:overflow-visible">
              <MonthlyStockReportBuilderPage
                id={builderDrawer.id}
                isModal={true}
                overrideMode={builderDrawer.mode}
                onClose={() => {
                  setBuilderDrawer({ isOpen: false, id: null, mode: "edit" });
                  setRefreshKey((k) => k + 1);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Draft Modal */}
      {deleteRecordTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white p-6 max-w-sm w-full shadow-2xl rounded-xl space-y-4 border border-gray-200 text-left">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2.5 bg-red-50 rounded-xl">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Delete Draft Report</h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Are you sure you want to delete <span className="font-bold text-gray-900">"{deleteRecordTarget.monthName} {deleteRecordTarget.year}"</span> draft report?
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
              This action cannot be undone. All report sections and cell values will be permanently removed.
            </p>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDeleteRecordTarget(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteRecord}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Delete Draft
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Report Modal */}
      {publishRecordTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white p-6 max-w-sm w-full shadow-2xl rounded-xl space-y-4 border border-gray-200 text-left">
            <div className="flex items-center gap-3 text-emerald-600">
              <div className="p-2.5 bg-emerald-50 rounded-xl">
                <Sparkles className="h-5 w-5 text-[#107c41]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Publish Monthly Stock Report</h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Report: <span className="font-bold text-gray-900">{publishRecordTarget.reportTitle}</span>
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-600 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100">
              Published reports become read-only for audit compliance.
            </p>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setPublishRecordTarget(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmPublishRecord}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#107c41] hover:bg-emerald-800 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Publish Report Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
