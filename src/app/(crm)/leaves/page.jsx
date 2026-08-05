"use client";

import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeaveRequests, selectLeaveRequestsData, selectLeaveRequestsLoading } from "@/store/entities/leaveRequestsSlice";
import { selectUserType } from "@/store/slices/authSlice";
import { selectActiveCompanyId } from "@/store/slices/companyContextSlice";
import { fetchLeaveTypes, selectLeaveTypesData } from "@/store/entities/leaveTypesSlice";

import HasPermission from "@/components/rbac/HasPermission";
import {
  Check, AlertCircle, Filter, X, Download, Clock, XCircle, Search, CalendarDays, User as UserIcon
} from "lucide-react";
import { format, parseISO } from "date-fns";
import SearchableSelect from "@/components/common/SearchableSelect";
import axiosClient from "@/lib/axios";

function AdminLeavesContent() {
  const dispatch = useDispatch();
  const userType = useSelector(selectUserType);
  const activeCompanyId = useSelector(selectActiveCompanyId) || "";

  const { data: leaves, total, page, totalPages } = useSelector(selectLeaveRequestsData) || { data: [], total: 0, page: 1, totalPages: 0 };
  const isLoading = useSelector(selectLeaveRequestsLoading);

  const { data: leaveTypes } = useSelector(selectLeaveTypesData) || { data: [] };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filters state - using parameter names matching backend GetLeaveRequestsFilterDto
  const [filters, setFilters] = useState({
    search: "",
    employeeId: "",
    branchId: "",
    departmentId: "",
    status: "",
    leaveTypeId: "",
    startDate: "",
    endDate: "",
    month: ""
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);

  // Trigger state to force re-fetch when filters are applied
  const [fetchTrigger, setFetchTrigger] = useState(0);

  useEffect(() => {
    if (activeCompanyId) {
      dispatch(fetchLeaveTypes({}));
    }
  }, [dispatch, activeCompanyId]);

  useEffect(() => {
    if (!activeCompanyId) return;
    const query = { page: currentPage, limit: itemsPerPage };
    Object.entries(filters).forEach(([key, val]) => {
      if (val) query[key] = val;
    });
    dispatch(fetchLeaveRequests(query));
  }, [dispatch, activeCompanyId, currentPage, fetchTrigger]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    setCurrentPage(1);
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
      month: ""
    });
    setSelectedEmp(null);
    setSelectedBranch(null);
    setSelectedDept(null);
    setCurrentPage(1);
    setFetchTrigger(prev => prev + 1);
  };

  // Exclude 'search' from the count of active advanced filters
  const activeFilterCount = Object.entries(filters).filter(([key, val]) => key !== "search" && Boolean(val)).length;

  // Helper to build page numbers with ellipsis
  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    pages.push(1);
    if (currentPage > 4) pages.push("...");
    
    const start = Math.max(2, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (currentPage < totalPages - 3) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-[#007aff]" />
            Leave Dashboard
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Monitor and manage all employee leave requests across the company.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  applyFilters();
                }
              }}
              placeholder="Search by employee name or code..."
              className="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff] text-gray-700 transition-colors shadow-xs"
            />
            {filters.search && (
              <button
                onClick={() => {
                  setFilters(prev => ({ ...prev, search: "" }));
                  setCurrentPage(1);
                  setFetchTrigger(prev => prev + 1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`px-4 py-2 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold shadow-sm transition-colors cursor-pointer shrink-0 ${isFilterOpen || activeFilterCount > 0 ? "bg-[#007aff] text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"}`}
          >
            <Filter className="h-4 w-4" /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>
      </div>

      <div className="space-y-4">
          {/* Advanced Filters Panel */}
          {isFilterOpen && (
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" /> Advanced Filters
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
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</label>
                  <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff] text-gray-700">
                    <option value="">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Leave Type</label>
                  <select name="leaveTypeId" value={filters.leaveTypeId} onChange={handleFilterChange} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff] text-gray-700">
                    <option value="">All Leave Types</option>
                    {leaveTypes.map(lt => (
                      <option key={lt.id} value={lt.id}>{lt.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">From Date</label>
                  <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff] text-gray-700" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">To Date</label>
                  <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff] text-gray-700" />
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

          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-gray-50 bg-gray-50/20 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Total {total} Leave Requests
              </div>
              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="h-4 w-4 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin" />
                  Loading...
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/30 text-gray-400 uppercase tracking-widest text-[10px] font-bold">
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">Leave Info</th>
                    <th className="px-6 py-4">Dates</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Approver</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {leaves.length > 0 ? (
                    leaves.map((leave, idx) => (
                      <tr key={leave.id || idx} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-800">{leave.employee?.firstName} {leave.employee?.lastName}</span>
                            <span className="text-[10px] text-gray-400 font-mono mt-0.5">{leave.employee?.employeeCode}</span>
                            <span className="text-[10px] text-gray-500 mt-1">{leave.employee?.department?.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-[#007aff]">{leave.leaveType?.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{leave.totalDays} Days {leave.isHalfDay ? '(Half Day)' : ''}</div>
                          {leave.reason && <div className="text-[10px] text-gray-400 italic mt-1 truncate max-w-[150px]" title={leave.reason}>"{leave.reason}"</div>}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          <div className="font-medium">{format(parseISO(leave.fromDate), "MMM dd, yyyy")}</div>
                          {leave.fromDate !== leave.toDate && <div className="text-[10px] text-gray-400 mt-0.5">to {format(parseISO(leave.toDate), "MMM dd, yyyy")}</div>}
                        </td>
                        <td className="px-6 py-4">
                          {(() => {
                            if (leave.status === "PENDING") return <span className="px-2 py-0.5 bg-yellow-50 text-yellow-600 border border-yellow-100 rounded text-[10px] font-bold">Pending</span>;
                            if (leave.status === "APPROVED") return <span className="px-2 py-0.5 bg-green-50 text-green-600 border border-green-100 rounded text-[10px] font-bold">Approved</span>;
                            if (leave.status === "REJECTED") return <span className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded text-[10px] font-bold">Rejected</span>;
                            return <span className="px-2 py-0.5 bg-gray-50 text-gray-500 border border-gray-100 rounded text-[10px] font-bold">Cancelled</span>;
                          })()}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {leave.approver ? (
                            <div className="flex flex-col">
                              <span>{leave.approver.firstName} {leave.approver.lastName}</span>
                              {leave.remarks && <span className="text-[10px] text-gray-400 italic mt-0.5 max-w-[150px] truncate" title={leave.remarks}>"{leave.remarks}"</span>}
                            </div>
                          ) : leave.approverName ? (
                            <span>{leave.approverName}</span>
                          ) : "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-400 font-semibold">
                        {isLoading ? "Loading leave requests..." : "No leave requests found matching the current filters."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-gray-100 bg-gray-50/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[11px] text-gray-400 font-medium">
                  Showing {((currentPage - 1) * itemsPerPage) + 1}–{Math.min(currentPage * itemsPerPage, total)} of {total} results
                </span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className="px-3 py-1.5 text-xs font-semibold bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    ← Prev
                  </button>

                  {getPageNumbers().map((pg, i) =>
                    pg === "..." ? (
                      <span key={`ellipsis-${i}`} className="px-2 py-1.5 text-xs text-gray-400 select-none">…</span>
                    ) : (
                      <button
                        key={pg}
                        onClick={() => setCurrentPage(pg)}
                        className={`min-w-[32px] px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                          currentPage === pg
                            ? "bg-[#007aff] text-white border-[#007aff] shadow-sm shadow-blue-300"
                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {pg}
                      </button>
                    )
                  )}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    className="px-3 py-1.5 text-xs font-semibold bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
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
