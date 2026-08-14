"use client";

import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMonthlyLeaveSummary,
  selectMonthlyLeaveSummary,
  selectLeaveRequestsLoading
} from "@/store/entities/leaveRequestsSlice";
import { selectUserType } from "@/store/slices/authSlice";
import { selectActiveCompanyId } from "@/store/slices/companyContextSlice";
import { fetchLeaveTypes, selectLeaveTypesData } from "@/store/entities/leaveTypesSlice";

import HasPermission from "@/components/rbac/HasPermission";
import {
  Check, AlertCircle, Filter, X, Download, Clock, XCircle, Search, CalendarDays, User as UserIcon,
  Users, CheckCircle2, AlertTriangle, Palmtree, Calendar, Layers, ChevronRight, BarChart2, ArrowRight, FileText, Loader2
} from "lucide-react";
import { format, parseISO } from "date-fns";
import SearchableSelect from "@/components/common/SearchableSelect";
import axiosClient from "@/lib/axios";

function AdminLeavesContent() {
  const dispatch = useDispatch();
  const userType = useSelector(selectUserType);
  const activeCompanyId = useSelector(selectActiveCompanyId) || "";

  const monthlySummary = useSelector(selectMonthlyLeaveSummary);
  const isLoading = useSelector(selectLeaveRequestsLoading);

  const { data: leaveTypes } = useSelector(selectLeaveTypesData) || { data: [] };

  const [summaryPage, setSummaryPage] = useState(1);

  // Selected month state (default to current YYYY-MM)
  const currentMonthStr = format(new Date(), "yyyy-MM");

  // Filters state - matching backend GetLeaveRequestsFilterDto
  const [filters, setFilters] = useState({
    search: "",
    employeeId: "",
    branchId: "",
    departmentId: "",
    status: "",
    leaveTypeId: "",
    startDate: "",
    endDate: "",
    month: currentMonthStr
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);

  // Drawer modal state for employee leave details
  const [selectedEmployeeForDrawer, setSelectedEmployeeForDrawer] = useState(null);
  const [employeeLeaves, setEmployeeLeaves] = useState([]);
  const [isDrawerLoading, setIsDrawerLoading] = useState(false);

  // Trigger state to force re-fetch when filters are applied
  const [fetchTrigger, setFetchTrigger] = useState(0);

  useEffect(() => {
    if (activeCompanyId) {
      dispatch(fetchLeaveTypes({}));
    }
  }, [dispatch, activeCompanyId]);

  // Fetch monthly summary analytics with pagination
  useEffect(() => {
    if (!activeCompanyId) return;
    dispatch(fetchMonthlyLeaveSummary({
      month: filters.month || currentMonthStr,
      departmentId: filters.departmentId || undefined,
      branchId: filters.branchId || undefined,
      page: summaryPage,
      limit: 10,
    }));
  }, [dispatch, activeCompanyId, summaryPage, fetchTrigger, filters.month, filters.departmentId, filters.branchId]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    setSummaryPage(1);
    setFetchTrigger(prev => prev + 1);
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      employeeId: "",
      branchId: "",
      departmentId: "",
      status: "",
      leaveTypeId: "",
      startDate: "",
      endDate: "",
      month: currentMonthStr
    });
    setSelectedEmp(null);
    setSelectedBranch(null);
    setSelectedDept(null);
    setSummaryPage(1);
    setFetchTrigger(prev => prev + 1);
  };

  // Open Drawer Modal for employee
  const handleOpenEmployeeDrawer = async (emp) => {
    setSelectedEmployeeForDrawer(emp);
    setIsDrawerLoading(true);
    try {
      const res = await axiosClient.get("/leave-requests", {
        params: {
          employeeId: emp.employeeId,
          month: filters.month || currentMonthStr,
          limit: 100,
        },
      });
      setEmployeeLeaves(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch employee leaves for drawer", err);
      setEmployeeLeaves([]);
    } finally {
      setIsDrawerLoading(false);
    }
  };

  // Exclude 'search' & default 'month' from active count
  const activeFilterCount = Object.entries(filters).filter(([key, val]) => key !== "search" && Boolean(val)).length;

  const cards = monthlySummary?.summaryCards || {
    employeesOnLeaveToday: 0,
    totalRequests: 0,
    approvedLeaves: 0,
    pendingApprovals: 0,
    rejectedLeaves: 0,
    totalLeaveDaysTaken: 0,
  };

  const employeeSummaries = monthlySummary?.employeeSummaries || [];
  const summaryMeta = monthlySummary?.meta || { page: 1, limit: 10, total: employeeSummaries.length, totalPages: 1 };
  const summaryTotalPages = summaryMeta.totalPages || 1;
  const monthLabel = monthlySummary?.monthLabel || format(new Date(), "MMMM yyyy");

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto space-y-4 select-none">
      {/* ── Page Header & Action Controls (Compact) ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 px-5 rounded-2xl border border-gray-100 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-blue-50 text-[#007aff]">
              <CalendarDays className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 tracking-tight">
                Leave Dashboard & Analytics
              </h1>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                Overview of employee leave utilization and monthly leave summaries ({monthLabel}).
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Month Selector */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            <input
              type="month"
              name="month"
              value={filters.month}
              onChange={(e) => {
                handleFilterChange(e);
                setFetchTrigger(prev => prev + 1);
              }}
              className="bg-transparent text-xs font-bold text-gray-700 outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition-colors cursor-pointer shrink-0 ${isFilterOpen || activeFilterCount > 0 ? "bg-[#007aff] text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"}`}
          >
            <Filter className="h-3.5 w-3.5" /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {isFilterOpen && (
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" /> Advanced HRMS Filters
            </h3>
            <button onClick={() => setIsFilterOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Employee</label>
              <SearchableSelect
                endpoint="/employees/options"
                value={selectedEmp}
                onChange={(val) => {
                  setSelectedEmp(val);
                  setFilters({ ...filters, employeeId: val ? val.value : "" });
                }}
                placeholder="All Employees"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Branch</label>
              <SearchableSelect
                endpoint="/branches/options"
                value={selectedBranch}
                onChange={(val) => {
                  setSelectedBranch(val);
                  setFilters({ ...filters, branchId: val ? val.value : "" });
                }}
                placeholder="All Branches"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Department</label>
              <SearchableSelect
                endpoint="/departments/options"
                value={selectedDept}
                onChange={(val) => {
                  setSelectedDept(val);
                  setFilters({ ...filters, departmentId: val ? val.value : "" });
                }}
                placeholder="All Departments"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Month</label>
              <input type="month" name="month" value={filters.month} onChange={handleFilterChange} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff] text-gray-700" />
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button onClick={resetFilters} className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
              Reset Filters
            </button>
            <button onClick={applyFilters} className="px-5 py-2 text-xs font-semibold text-white bg-[#007aff] hover:bg-blue-600 rounded-xl shadow-sm shadow-blue-500/20 transition-colors cursor-pointer">
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* ── SECTION 1: Summary Cards Banner (Compact & Sleek) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Current Month */}
        <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-gray-400">Current Month</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Calendar className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1.5">
            <span className="text-xs font-bold text-gray-900 block truncate">{monthLabel}</span>
            <span className="text-[9.5px] text-gray-400 font-medium block">Selected Period</span>
          </div>
        </div>

        {/* Employees on Leave Today */}
        <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-purple-600">Leave Today</span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Users className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-lg font-bold text-purple-700">{cards.employeesOnLeaveToday}</span>
            <span className="text-[9.5px] text-gray-400 font-medium">Employees</span>
          </div>
        </div>

        {/* Total Leave Requests */}
        <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-gray-400">Total Requests</span>
            <div className="p-1.5 rounded-lg bg-[#007aff]/10 text-[#007aff]">
              <Layers className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-lg font-bold text-gray-900">{cards.totalRequests}</span>
            <span className="text-[9.5px] text-gray-400 font-medium">Requests</span>
          </div>
        </div>

        {/* Approved Leaves */}
        <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-emerald-600">Approved</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-lg font-bold text-emerald-600">{cards.approvedLeaves}</span>
            <span className="text-[9.5px] text-gray-400 font-medium">Approved</span>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-amber-600">Pending</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-lg font-bold text-amber-600">{cards.pendingApprovals}</span>
            <span className="text-[9.5px] text-gray-400 font-medium">Pending</span>
          </div>
        </div>

        {/* Total Days Taken */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl p-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-blue-100">Total Days Taken</span>
            <div className="p-1.5 rounded-lg bg-white/10 text-white backdrop-blur-md">
              <Palmtree className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-lg font-bold text-white">{cards.totalLeaveDaysTaken} <span className="text-[10px] font-normal text-blue-100">Days</span></span>
            <span className="text-[9.5px] text-blue-100/80 font-medium">Approved</span>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: Monthly Employee Leave Summary Table (Main Dashboard Table) ── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gray-50/50">
          <div>
            <h2 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-[#007aff]" />
              Monthly Employee Leave Summary ({monthLabel})
            </h2>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              Click on any employee row to open their detailed leave requests drawer modal.
            </p>
          </div>
          <span className="px-3 py-1 bg-blue-50 text-[#007aff] text-xs font-bold rounded-xl border border-blue-100">
            {summaryMeta.total} Employees Tracked
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/40 text-gray-400 uppercase tracking-widest text-[10px] font-bold">
                <th className="px-6 py-3.5">Employee</th>
                <th className="px-6 py-3.5 text-center">This Month</th>
                <th className="px-6 py-3.5 text-center">Approved</th>
                <th className="px-6 py-3.5 text-center">Pending</th>
                <th className="px-6 py-3.5 text-center">Rejected</th>
                <th className="px-6 py-3.5">Last Leave Date</th>
                <th className="px-6 py-3.5">Annual Balance Progress</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {employeeSummaries.length > 0 ? (
                employeeSummaries.map((emp) => {
                  const percent = Math.min(100, Math.round((emp.yearlyUsedDays / (emp.yearlyAllocatedDays || 24)) * 100));
                  return (
                    <tr
                      key={emp.employeeId}
                      onClick={() => handleOpenEmployeeDrawer(emp)}
                      className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-200 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            {emp.employeeName?.split(" ").map(n => n.charAt(0)).join("").substring(0, 2)}
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 block group-hover:text-[#007aff] transition-colors">{emp.employeeName}</span>
                            <span className="text-[10px] text-gray-400 font-mono">{emp.employeeCode || "—"}</span>
                            <span className="text-[10px] text-gray-500 block mt-0.5 font-medium">
                              {[emp.departmentName, emp.designationName].filter(Boolean).join(" • ") || "—"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold ${emp.thisMonthDays > 0 ? "bg-blue-50 text-[#007aff] border border-blue-100" : "bg-gray-50 text-gray-400"}`}>
                          {emp.thisMonthDays} Days
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-emerald-600">
                        {emp.approvedCount}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-amber-600">
                        {emp.pendingCount}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-red-500">
                        {emp.rejectedCount}
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">
                        {emp.lastLeaveDate ? format(parseISO(emp.lastLeaveDate), "dd MMM yyyy") : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-6 py-4 min-w-[180px]">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[11px] font-bold text-gray-600">
                            <span>{emp.yearlyUsedDays} / {emp.yearlyAllocatedDays} Days</span>
                            <span className="text-[10px] text-gray-400">{percent}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${percent > 80 ? "bg-red-500" : percent > 50 ? "bg-amber-500" : "bg-blue-600"}`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#007aff] group-hover:translate-x-0.5 transition-transform">
                          View Details <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-400 font-semibold">
                    No employee leave activity recorded for {monthLabel}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Section 2 Pagination Controls */}
        {summaryTotalPages > 1 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-gray-400 font-medium">
              Showing {((summaryPage - 1) * 10) + 1}–{Math.min(summaryPage * 10, summaryMeta.total)} of {summaryMeta.total} employees
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={summaryPage === 1}
                onClick={() => setSummaryPage((p) => Math.max(p - 1, 1))}
                className="px-3 py-1.5 text-xs font-semibold bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                ← Prev
              </button>

              {Array.from({ length: summaryTotalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setSummaryPage(pg)}
                  className={`min-w-[32px] px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    summaryPage === pg
                      ? "bg-[#007aff] text-white border-[#007aff] shadow-sm shadow-blue-300"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {pg}
                </button>
              ))}

              <button
                disabled={summaryPage === summaryTotalPages}
                onClick={() => setSummaryPage((p) => Math.min(p + 1, summaryTotalPages))}
                className="px-3 py-1.5 text-xs font-semibold bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── EMPLOYEE LEAVE DETAILS DRAWER MODAL ── */}
      {selectedEmployeeForDrawer && (
        <div
          className="fixed inset-0 z-[9999] bg-slate-900/40 backdrop-blur-xs flex justify-end transition-opacity animate-in fade-in duration-200"
          onClick={() => setSelectedEmployeeForDrawer(null)}
        >
          <div
            className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-gray-100 flex items-start justify-between bg-gray-50/50">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-2xl bg-[#007aff] text-white flex items-center justify-center font-bold text-base shadow-sm shadow-blue-500/20">
                  {selectedEmployeeForDrawer.employeeName?.split(" ").map(n => n.charAt(0)).join("").substring(0, 2)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    {selectedEmployeeForDrawer.employeeName}
                    <span className="text-xs font-mono font-medium text-gray-400 bg-white px-2 py-0.5 rounded border border-gray-200">
                      {selectedEmployeeForDrawer.employeeCode}
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">
                    {[selectedEmployeeForDrawer.departmentName, selectedEmployeeForDrawer.designationName].filter(Boolean).join(" • ") || "No Department/Role"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEmployeeForDrawer(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-white border border-transparent hover:border-gray-200 transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Metrics Bar in Drawer */}
            <div className="grid grid-cols-4 gap-2 p-4 bg-slate-50 border-b border-gray-100 text-center">
              <div className="bg-white p-2.5 rounded-xl border border-gray-200/60 shadow-2xs">
                <span className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider block">This Month</span>
                <span className="text-sm font-black text-[#007aff] mt-0.5 block">{selectedEmployeeForDrawer.thisMonthDays} Days</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-gray-200/60 shadow-2xs">
                <span className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider block">Approved</span>
                <span className="text-sm font-black text-emerald-600 mt-0.5 block">{selectedEmployeeForDrawer.approvedCount}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-gray-200/60 shadow-2xs">
                <span className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider block">Pending</span>
                <span className="text-sm font-black text-amber-600 mt-0.5 block">{selectedEmployeeForDrawer.pendingCount}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-gray-200/60 shadow-2xs">
                <span className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider block">Annual Used</span>
                <span className="text-sm font-black text-purple-600 mt-0.5 block">{selectedEmployeeForDrawer.yearlyUsedDays} / {selectedEmployeeForDrawer.yearlyAllocatedDays}</span>
              </div>
            </div>

            {/* Drawer Requests List Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#007aff]" />
                  Leave Applications ({monthLabel})
                </h4>
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                  {employeeLeaves.length} Records
                </span>
              </div>

              {isDrawerLoading ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <Loader2 className="h-7 w-7 animate-spin text-[#007aff] mb-2" />
                  <p className="text-xs font-medium">Fetching employee leave log...</p>
                </div>
              ) : employeeLeaves.length > 0 ? (
                <div className="space-y-3">
                  {employeeLeaves.map((leave) => (
                    <div key={leave.id} className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-shadow space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs font-bold text-[#007aff] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                            {leave.leaveType?.name || "Leave"}
                          </span>
                          <div className="flex items-center gap-2 text-xs font-semibold text-gray-800 mt-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {format(parseISO(leave.fromDate), "MMM dd, yyyy")}
                            {leave.fromDate !== leave.toDate && ` - ${format(parseISO(leave.toDate), "MMM dd, yyyy")}`}
                            <span className="text-gray-400 font-normal">({leave.totalDays} {leave.totalDays === 1 ? 'day' : 'days'})</span>
                          </div>
                        </div>
                        {(() => {
                          if (leave.status === "PENDING") return <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-[10px] font-bold">Pending</span>;
                          if (leave.status === "APPROVED") return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-[10px] font-bold">Approved</span>;
                          if (leave.status === "REJECTED") return <span className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-xl text-[10px] font-bold">Rejected</span>;
                          return <span className="px-2.5 py-1 bg-gray-50 text-gray-600 border border-gray-200 rounded-xl text-[10px] font-bold">Cancelled</span>;
                        })()}
                      </div>

                      {leave.reason && (
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs text-gray-600">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Reason</span>
                          "{leave.reason}"
                        </div>
                      )}

                      {leave.approverName && (
                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                          <span>Approver: <strong className="text-gray-700">{leave.approverName}</strong></span>
                          {leave.remarks && <span className="italic truncate max-w-[200px]">"{leave.remarks}"</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-2xl p-10 text-center border border-dashed border-gray-200">
                  <CheckCircle2 className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-gray-700">No Leave Details</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">No individual leave records found for this employee in {monthLabel}.</p>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
              <button
                onClick={() => setSelectedEmployeeForDrawer(null)}
                className="px-5 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-colors cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminLeavesPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-400">Loading...</p>
      </div>
    }>
      <AdminLeavesContent />
    </Suspense>
  );
}
