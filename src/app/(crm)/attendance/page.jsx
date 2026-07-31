"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCompanyAttendance,
  fetchCorrections,
  selectCompanyAttendance,
  selectCorrections,
  selectAttendanceLoading
} from "@/store/entities/attendanceSlice";
import { fetchShifts, selectAllShifts } from "@/store/entities/shiftsSlice";
import { fetchDepartments, selectAllDepartments } from "@/store/entities/departmentsSlice";
import { fetchBranches, selectAllBranches } from "@/store/entities/branchesSlice";
import {
  Search,
  Filter,
  Download,
  Users,
  UserCheck,
  UserX,
  Clock,
  Coffee,
  Briefcase,
  LogOut,
  AlertOctagon,
  Play,
  ChevronLeft,
  ChevronRight,
  Building2,
  RefreshCw,
  User as UserIcon,
  Calendar
} from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { useRouter } from "next/navigation";
import { selectActiveCompanyId, selectActiveCompany } from "@/store/slices/companyContextSlice";

export default function AttendanceDashboardPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { hasPermission } = usePermissions();
  const activeCompanyId = useSelector(selectActiveCompanyId);
  const activeCompany = useSelector(selectActiveCompany);

  const canReadDashboard = hasPermission("attendance_dashboard:read");
  const canReadCorrections = hasPermission("attendance_regularization:read");
  const canReadShifts = hasPermission("attendance_activity:read");
  const canReadDepartments = hasPermission("departments:read");
  const canReadBranches = hasPermission("branches:read");

  const companyAttendance = useSelector(selectCompanyAttendance) || [];
  const corrections = useSelector(selectCorrections) || [];
  const isLoading = useSelector(selectAttendanceLoading);

  const departments = useSelector(selectAllDepartments) || [];
  const branches = useSelector(selectAllBranches) || [];
  const shifts = useSelector(selectAllShifts) || [];

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [filters, setFilters] = useState({ department: '', branch: '', shift: '', status: '' });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 15;
  const [now, setNow] = useState(new Date());
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    if (!canReadDashboard) {
      router.replace("/attendance/my-attendance");
    }
  }, [canReadDashboard, router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (companyAttendance && companyAttendance.length > 0) {
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }
  }, [companyAttendance]);

  const getWorkHours = (record) => {
    if ((record.attendanceState === 'WORKING' || record.attendanceState === 'ON_BREAK') && record.checkInTime && !record.checkOutTime) {
      const start = new Date(record.checkInTime).getTime();
      const current = now.getTime();
      const diffMs = Math.max(0, current - start);
      const totalMinutes = Math.floor(diffMs / (1000 * 60));
      const hrs = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;
      return `${hrs}h ${mins}m`;
    }
    if (record.totalHours) {
      const hoursNum = parseFloat(record.totalHours);
      if (!isNaN(hoursNum)) {
        const hrs = Math.floor(hoursNum);
        const mins = Math.round((hoursNum - hrs) * 60);
        return `${hrs}h ${mins}m`;
      }
    }
    return '0h 0m';
  };

  useEffect(() => {
    if (canReadDashboard) {
      dispatch(fetchCompanyAttendance({ date }));
    }
    if (canReadCorrections) {
      dispatch(fetchCorrections());
    }
    if (canReadShifts) {
      dispatch(fetchShifts());
    }
    if (canReadDepartments) {
      dispatch(fetchDepartments());
    }
    if (canReadBranches) {
      dispatch(fetchBranches());
    }
  }, [dispatch, date, activeCompanyId, canReadDashboard, canReadCorrections, canReadShifts, canReadDepartments, canReadBranches]);

  // Reset pagination on filter or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  // Apply frontend filters and search term
  const filteredAttendance = companyAttendance.filter(r => {
    if (filters.shift && r.shiftId?.toString() !== filters.shift) return false;
    if (filters.department && r.employee?.departmentId?.toString() !== filters.department) return false;
    if (filters.branch && r.employee?.branchId?.toString() !== filters.branch) return false;
    if (filters.status && r.attendanceStatus !== filters.status) return false;

    if (searchTerm) {
      const fullName = `${r.employee?.firstName || ''} ${r.employee?.lastName || ''}`.toLowerCase();
      const code = (r.employee?.employeeCode || '').toLowerCase();
      const search = searchTerm.toLowerCase();
      if (!fullName.includes(search) && !code.includes(search)) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredAttendance.length / PAGE_SIZE);
  const paginatedAttendance = filteredAttendance.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const stats = {
    total: filteredAttendance.length,
    present: filteredAttendance.filter(r => r.attendanceStatus === 'PRESENT' || r.attendanceStatus === 'HALF_DAY').length,
    absent: filteredAttendance.filter(r => r.attendanceStatus === 'ABSENT').length,
    late: filteredAttendance.filter(r => r.lateMinutes > 0).length,
    onLeave: filteredAttendance.filter(r => r.attendanceStatus === 'ON_LEAVE').length,
    workingNow: filteredAttendance.filter(r => r.attendanceState === 'WORKING').length,
    onBreak: filteredAttendance.filter(r => r.attendanceState === 'ON_BREAK').length,
    checkedOut: filteredAttendance.filter(r => r.attendanceState === 'CHECKED_OUT').length,
    needsRegularization: corrections.filter(c => c.status === 'PENDING').length,
  };

  const handleExport = () => {
    if (filteredAttendance.length === 0) return;
    const headers = ["Employee Code", "Employee Name", "Department", "Branch", "Shift", "Date", "Status", "Live State", "Check In", "Check Out", "Work Hours"];
    const rows = filteredAttendance.map(r => [
      r.employee?.employeeCode || "",
      `${r.employee?.firstName || ""} ${r.employee?.lastName || ""}`.trim(),
      r.employee?.department?.name || "",
      r.employee?.branch?.name || "",
      r.shift?.name || "",
      r.date || "",
      r.attendanceStatus || "",
      r.attendanceState || "",
      r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
      r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
      getWorkHours(r)
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_report_${date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRefresh = () => {
    if (canReadDashboard) {
      dispatch(fetchCompanyAttendance({ date }));
    }
  };

  const resetFilters = () => {
    setFilters({ department: '', branch: '', shift: '', status: '' });
    setSearchTerm("");
  };

  return (
    <div className="p-4 max-w-[1600px] mx-auto space-y-4 min-h-screen bg-[#f8f9fa]">

      {/* 1. COMPACT EXECUTIVE HEADER */}
      <div className="bg-white rounded-xl border border-slate-200 px-5 py-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">Attendance Dashboard</h1>
          {activeCompany && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-50 border border-slate-200 text-slate-600 rounded text-[11px] font-semibold">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              {activeCompany.name}
            </span>
          )}
          {lastUpdated && (
            <span className="text-[11px] text-slate-400 font-medium border-l border-slate-200 pl-3">
              Last updated: {lastUpdated}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-slate-200 hover:border-slate-300 rounded px-2.5 py-1 text-xs font-semibold focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-slate-600 cursor-pointer transition-all"
          />
          <button
            onClick={handleRefresh}
            className="p-1.5 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-500 hover:text-slate-700 rounded transition-all cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleExport}
            disabled={filteredAttendance.length === 0}
            className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded text-xs font-bold hover:bg-slate-50 hover:border-slate-300 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" /> Export
          </button>
        </div>
      </div>

      {/* 2. EXECUTIVE KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Attendance Strength"
          value={`${stats.present} / ${stats.total}`}
          subtext={`${stats.workingNow} currently active`}
          icon={UserCheck}
        />
        <KpiCard
          title="Absentees & Leaves"
          value={stats.absent}
          subtext={`${stats.onLeave} on approved leave`}
          icon={UserX}
        />
        <KpiCard
          title="Late Arrival Exceptions"
          value={stats.late}
          subtext="Grace marking anomalies"
          icon={Clock}
        />
        <KpiCard
          title="Pending Regularization"
          value={stats.needsRegularization}
          subtext="Waiting manager approval"
          icon={AlertOctagon}
        />
      </div>

      {/* 3. PROFESSIONAL TOOLBAR */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 shadow-xs">
        <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
          <div className="relative w-full md:w-56 shrink-0">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search employee or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 focus:bg-white rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-700 placeholder-slate-400 transition-all font-medium"
            />
          </div>

          <select
            value={filters.department}
            onChange={e => setFilters({ ...filters, department: e.target.value })}
            className="bg-white border border-slate-200 text-xs rounded px-2 py-1.5 focus:ring-1 focus:ring-blue-500 outline-none text-slate-600 font-semibold cursor-pointer"
          >
            <option value="">Dept: All</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id.toString()}>{dept.name}</option>
            ))}
          </select>

          <select
            value={filters.branch}
            onChange={e => setFilters({ ...filters, branch: e.target.value })}
            className="bg-white border border-slate-200 text-xs rounded px-2 py-1.5 focus:ring-1 focus:ring-blue-500 outline-none text-slate-600 font-semibold cursor-pointer"
          >
            <option value="">Branch: All</option>
            {branches.map(br => (
              <option key={br.id} value={br.id.toString()}>{br.name}</option>
            ))}
          </select>

          <select
            value={filters.shift}
            onChange={e => setFilters({ ...filters, shift: e.target.value })}
            className="bg-white border border-slate-200 text-xs rounded px-2 py-1.5 focus:ring-1 focus:ring-blue-500 outline-none text-slate-600 font-semibold cursor-pointer"
          >
            <option value="">Shift: All</option>
            {shifts.map(sh => (
              <option key={sh.id} value={sh.id.toString()}>{sh.name}</option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={e => setFilters({ ...filters, status: e.target.value })}
            className="bg-white border border-slate-200 text-xs rounded px-2 py-1.5 focus:ring-1 focus:ring-blue-500 outline-none text-slate-600 font-semibold cursor-pointer"
          >
            <option value="">Status: All</option>
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
            <option value="HALF_DAY">Half Day</option>
            <option value="ON_LEAVE">On Leave</option>
          </select>
        </div>

        <div className="flex justify-end shrink-0">
          <button
            onClick={resetFilters}
            className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold rounded transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* 4. LIVE ATTENDANCE TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center">
              <div className="w-6 h-6 border-2 border-blue-100 border-t-blue-500 rounded-full animate-spin mb-3"></div>
              <div className="text-slate-400 text-xs font-semibold">Updating attendance list...</div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase tracking-wider text-[10px] font-bold sticky top-0 bg-white z-10">
                  <th className="px-5 py-3">Employee</th>
                  <th className="px-5 py-3">Emp ID</th>
                  <th className="px-5 py-3">Department</th>
                  <th className="px-5 py-3">Shift Schedule</th>
                  <th className="px-5 py-3">Punch In</th>
                  <th className="px-5 py-3">Punch Out</th>
                  <th className="px-5 py-3">Live State</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Work Duration</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {paginatedAttendance.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-blue-50 text-[#007aff] flex items-center justify-center font-bold text-[10px] shrink-0">
                          {record.employee?.firstName?.charAt(0) || "E"}
                        </div>
                        <span className="font-bold text-slate-800 text-xs">
                          {record.employee?.firstName ? `${record.employee.firstName} ${record.employee.lastName || ''}`.trim() : `Emp #${record.employeeId}`}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-2 text-slate-400 font-mono text-[10px]">
                      {record.employee?.employeeCode}
                    </td>
                    <td className="px-5 py-2 text-slate-600 font-medium">
                      {record.employee?.department?.name || "-"}
                    </td>
                    <td className="px-5 py-2 text-slate-600 font-semibold">
                      {record.shift?.name || "-"}
                    </td>
                    <td className="px-5 py-2 text-slate-600 font-medium">
                      {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                      {record.lateMinutes > 0 && <span className="ml-1.5 text-[9px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-1 py-0.5 rounded">+{record.lateMinutes}m</span>}
                    </td>
                    <td className="px-5 py-2 text-slate-600 font-medium">
                      {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                    </td>
                    <td className="px-5 py-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${record.attendanceState === 'WORKING' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/50' :
                        record.attendanceState === 'ON_BREAK' ? 'bg-amber-50 text-amber-700 border border-amber-100/50' :
                          record.attendanceState === 'CHECKED_OUT' ? 'bg-slate-50 text-slate-600 border border-slate-200/50' :
                            'bg-slate-50 text-slate-400 border border-slate-200/50'
                        }`}>
                        {record.attendanceState === 'WORKING' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>}
                        {record.attendanceState?.replace('_', ' ') || 'NO PUNCH'}
                      </span>
                    </td>
                    <td className="px-5 py-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${record.attendanceStatus === 'PRESENT' ? 'text-emerald-700 bg-emerald-50' :
                        record.attendanceStatus === 'HALF_DAY' ? 'text-amber-700 bg-amber-50' :
                          record.attendanceStatus === 'ABSENT' ? 'text-rose-700 bg-rose-50' :
                            record.attendanceStatus === 'LATE' ? 'text-orange-700 bg-orange-50' :
                              record.attendanceStatus === 'ON_LEAVE' ? 'text-purple-700 bg-purple-50' :
                                'text-slate-600 bg-slate-50'
                        }`}>
                        {record.attendanceStatus || '-'}
                      </span>
                    </td>
                    <td className="px-5 py-2 text-right font-bold text-slate-800 tabular-nums">
                      {getWorkHours(record)}
                    </td>
                    <td className="px-5 py-2 text-center">
                      <div className="flex justify-center items-center gap-0.5">
                        {canReadCorrections && (
                          <button
                            onClick={() => router.push(`/attendance/corrections`)}
                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded transition-all"
                            title="Regularization corrections"
                          >
                            <AlertOctagon className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredAttendance.length === 0 && (
                  <tr>
                    <td colSpan="10" className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Users className="w-8 h-8 text-slate-300 mb-2" />
                        <h3 className="text-xs font-bold text-slate-800 mb-1">No attendance records found</h3>
                        <p className="text-[11px] text-slate-400 max-w-[280px] mx-auto leading-normal">
                          Adjust filters or check date parameters to find records.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="p-3.5 border-t border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
            <div className="text-[11px] font-semibold text-slate-500">
              Showing {(currentPage - 1) * PAGE_SIZE + 1} to {Math.min(currentPage * PAGE_SIZE, filteredAttendance.length)} of {filteredAttendance.length} entries
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1 border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white shadow-xs transition-all cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-slate-600" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1 border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white shadow-xs transition-all cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Enterprise KPI Card component
function KpiCard({ title, value, subtext, icon: Icon }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
      <div className="flex-1 min-w-0 pr-2">
        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block truncate">{title}</span>
        <span className="text-2xl font-bold text-slate-800 tracking-tight mt-1 block">{value}</span>
        <span className="text-[11px] text-slate-500 font-medium mt-1 block truncate">{subtext}</span>
      </div>
      <div className="w-8 h-8 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center shadow-xs shrink-0">
        <Icon className="w-4.5 h-4.5 text-slate-400" />
      </div>
    </div>
  );
}