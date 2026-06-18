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
import { fetchShifts } from "@/store/entities/shiftsSlice";
import { Search, Filter, Download, Users, UserCheck, UserX, Clock, Coffee, Briefcase, LogOut, AlertOctagon, Play, ChevronLeft, ChevronRight } from "lucide-react";

export default function AttendanceDashboardPage() {
  const dispatch = useDispatch();
  const companyAttendance = useSelector(selectCompanyAttendance) || [];
  const corrections = useSelector(selectCorrections) || [];
  const isLoading = useSelector(selectAttendanceLoading);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [filters, setFilters] = useState({ department: '', branch: '', shift: '' });

  useEffect(() => {
    dispatch(fetchCompanyAttendance({ date }));
    dispatch(fetchCorrections());
    dispatch(fetchShifts());
  }, [dispatch, date]);

  // Apply frontend filters
  const filteredAttendance = companyAttendance.filter(r => {
    if (filters.shift && r.shiftId?.toString() !== filters.shift) return false;
    if (filters.department && r.employee?.departmentId?.toString() !== filters.department) return false;
    if (filters.branch && r.employee?.branchId?.toString() !== filters.branch) return false;
    return true;
  });

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

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto flex flex-col h-screen bg-gray-50 overflow-hidden">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Attendance Dashboard</h1>
          <p className="text-xs text-gray-500">Monitor organization-wide attendance, punches, and exceptions.</p>
        </div>
        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm bg-white"
          />
          <button className="flex items-center gap-1.5 bg-white border border-gray-300 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-50 shadow-sm transition-colors text-gray-700">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200 flex flex-wrap gap-2 items-center mb-3 shrink-0">
        <div className="flex items-center gap-1.5 text-gray-500 font-medium text-xs mr-1">
          <Filter className="w-3.5 h-3.5" /> Filters:
        </div>
        <select
          value={filters.department}
          onChange={e => setFilters({ ...filters, department: e.target.value })}
          className="bg-gray-50 border border-gray-200 text-[11px] rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">All Departments</option>
          <option value="1">Engineering</option>
          <option value="2">Sales</option>
          <option value="3">HR</option>
        </select>

        <select
          value={filters.branch}
          onChange={e => setFilters({ ...filters, branch: e.target.value })}
          className="bg-gray-50 border border-gray-200 text-[11px] rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">All Branches</option>
          <option value="1">Headquarters</option>
          <option value="2">Regional Office</option>
        </select>

        <select
          value={filters.shift}
          onChange={e => setFilters({ ...filters, shift: e.target.value })}
          className="bg-gray-50 border border-gray-200 text-[11px] rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">All Shifts</option>
          <option value="1">General Shift</option>
          <option value="2">Night Shift</option>
        </select>
      </div>

      {/* ULTRA COMPACT SINGLE ROW METRICS */}
      <div className="flex w-full gap-2 mb-3 shrink-0 overflow-x-auto pb-1 scrollbar-hide">
        <MetricCard title="Total Emps" value={stats.total} icon={Users} color="blue" />
        <MetricCard title="Present" value={stats.present} icon={UserCheck} color="emerald" />
        <MetricCard title="Absent" value={stats.absent} icon={UserX} color="rose" />
        <MetricCard title="On Leave" value={stats.onLeave} icon={Briefcase} color="purple" />
        <MetricCard title="Late In" value={stats.late} icon={Clock} color="amber" />
        <MetricCard title="Working Now" value={stats.workingNow} icon={Play} color="blue" />
        <MetricCard title="On Break" value={stats.onBreak} icon={Coffee} color="amber" />
        <MetricCard title="Checked Out" value={stats.checkedOut} icon={LogOut} color="gray" />
        <MetricCard title="Exceptions" value={stats.needsRegularization} icon={AlertOctagon} color="rose" />
      </div>

      {/* DATA TABLE AREA */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col min-h-0 flex-1">
        <div className="p-2.5 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 shrink-0">
          <h2 className="text-xs font-bold text-gray-800">Live Attendance Roster</h2>
          <div className="relative w-56">
            <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              className="w-full pl-7 pr-3 py-1 bg-white border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
              <div className="text-gray-500 text-xs font-medium">Loading live attendance...</div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="sticky top-0 bg-white z-10 shadow-sm">
                <tr className="text-gray-500 text-[10px] font-bold uppercase tracking-wider border-b border-gray-200">
                  <th className="px-4 py-2">Employee</th>
                  <th className="px-4 py-2">Live State</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Check In</th>
                  <th className="px-4 py-2">Check Out</th>
                  <th className="px-4 py-2 text-right">Work Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAttendance.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center font-bold text-xs">
                          {record.employee?.firstName?.charAt(0) || "E"}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-900">{record.employee?.firstName ? `${record.employee.firstName} ${record.employee.lastName || ''}`.trim() : `Emp #${record.employeeId}`}</div>
                          <div className="text-[10px] font-medium text-gray-500">{record.employee?.designation?.name || "Employee"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${record.attendanceState === 'WORKING' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          record.attendanceState === 'ON_BREAK' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                            record.attendanceState === 'CHECKED_OUT' ? 'bg-gray-50 text-gray-600 border border-gray-200' :
                              'bg-gray-50 text-gray-400 border border-gray-200'
                        }`}>
                        {record.attendanceState === 'WORKING' && <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>}
                        {record.attendanceState?.replace('_', ' ') || 'NO PUNCH'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${record.attendanceStatus === 'PRESENT' ? 'text-emerald-700 bg-emerald-50' :
                          record.attendanceStatus === 'HALF_DAY' ? 'text-amber-700 bg-amber-50' :
                            record.attendanceStatus === 'ABSENT' ? 'text-rose-700 bg-rose-50' :
                              record.attendanceStatus === 'LATE' ? 'text-orange-700 bg-orange-50' :
                                record.attendanceStatus === 'ON_LEAVE' ? 'text-purple-700 bg-purple-50' :
                                  'text-gray-600 bg-gray-50'
                        }`}>
                        {record.attendanceStatus || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-xs font-medium text-gray-700">
                      {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                      {record.lateMinutes > 0 && <span className="ml-1.5 text-[9px] font-bold text-rose-500 bg-rose-50 px-1 py-0.5 rounded">+{record.lateMinutes}m</span>}
                    </td>
                    <td className="px-4 py-2.5 text-xs font-medium text-gray-700">
                      {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                    </td>
                    <td className="px-4 py-2.5 text-xs font-bold text-gray-900 text-right tabular-nums">
                      {record.totalHours || '0.00'} <span className="text-gray-400 font-normal">h</span>
                    </td>
                  </tr>
                ))}
                {filteredAttendance.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-10 text-center">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 border border-gray-100 mb-2">
                        <Users className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="text-gray-800 text-xs font-bold">No Records Found</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// Ultra Compact Single-Line Metric Card
function MetricCard({ title, value, icon: Icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    gray: "bg-gray-50 text-gray-500 border-gray-200",
  };

  return (
    <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 flex items-center gap-2.5 min-w-[130px] flex-1 shrink-0 hover:shadow-md transition-shadow">
      <div className={`w-8 h-8 shrink-0 rounded-md flex items-center justify-center border ${colors[color]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex flex-col overflow-hidden">
        <span className="font-bold text-gray-400 text-[9px] uppercase tracking-wider truncate">{title}</span>
        <span className="text-lg font-black text-gray-800 leading-tight">{value}</span>
      </div>
    </div>
  );
}