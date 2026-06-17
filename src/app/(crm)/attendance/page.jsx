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
import { Search, Filter, Download, Users, UserCheck, UserX, Clock, Coffee, Briefcase, LogOut, AlertOctagon, Play } from "lucide-react";

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
    // Assuming employee object has department and branch. If not, this is a placeholder for UI demo
    if (filters.department && r.employee?.departmentId?.toString() !== filters.department) return false;
    if (filters.branch && r.employee?.branchId?.toString() !== filters.branch) return false;
    return true;
  });

  const stats = {
    total: filteredAttendance.length, // Typically would come from employee count, but using records for now
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
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Attendance Dashboard</h1>
          <p className="text-gray-500 mt-1">Monitor organization-wide attendance, punches, and exceptions.</p>
        </div>
        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
          />
          <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 shadow-sm transition-colors text-gray-700">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-gray-500 font-medium text-sm mr-2">
          <Filter className="w-4 h-4" /> Filters:
        </div>
        <select 
          value={filters.department} 
          onChange={e => setFilters({...filters, department: e.target.value})}
          className="bg-gray-50 border border-gray-200 text-sm rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">All Departments</option>
          <option value="1">Engineering</option>
          <option value="2">Sales</option>
          <option value="3">HR</option>
        </select>
        
        <select 
          value={filters.branch} 
          onChange={e => setFilters({...filters, branch: e.target.value})}
          className="bg-gray-50 border border-gray-200 text-sm rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">All Branches</option>
          <option value="1">Headquarters</option>
          <option value="2">Regional Office</option>
        </select>

        <select 
          value={filters.shift} 
          onChange={e => setFilters({...filters, shift: e.target.value})}
          className="bg-gray-50 border border-gray-200 text-sm rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">All Shifts</option>
          <option value="1">General Shift</option>
          <option value="2">Night Shift</option>
        </select>
      </div>

      {/* STATS METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <MetricCard title="Total Employees" value={stats.total} icon={Users} color="blue" />
        <MetricCard title="Present" value={stats.present} icon={UserCheck} color="emerald" />
        <MetricCard title="Absent" value={stats.absent} icon={UserX} color="rose" />
        <MetricCard title="On Leave" value={stats.onLeave} icon={Briefcase} color="purple" />
        <MetricCard title="Late In" value={stats.late} icon={Clock} color="amber" />
        
        <MetricCard title="Working Now" value={stats.workingNow} icon={Play} color="blue" />
        <MetricCard title="On Break" value={stats.onBreak} icon={Coffee} color="amber" />
        <MetricCard title="Checked Out" value={stats.checkedOut} icon={LogOut} color="gray" />
        <div className="col-span-2 lg:col-span-2 bg-rose-50 border border-rose-100 p-5 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-200 text-rose-700 rounded-xl flex items-center justify-center">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-rose-900 uppercase tracking-wider">Needs Regularization</div>
              <div className="text-sm text-rose-700 font-medium">Pending exceptions to review</div>
            </div>
          </div>
          <div className="text-4xl font-black text-rose-600">{stats.needsRegularization}</div>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Live Attendance Roster</h2>
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search employees..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <div className="text-gray-500 font-medium">Loading live attendance...</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-gray-100">
                  <th className="p-5">Employee</th>
                  <th className="p-5">Live State</th>
                  <th className="p-5">Status</th>
                  <th className="p-5">Check In</th>
                  <th className="p-5">Check Out</th>
                  <th className="p-5 text-right">Work Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAttendance.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 flex items-center justify-center font-bold text-sm shadow-inner">
                          {record.employee?.user?.name?.charAt(0) || "E"}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">{record.employee?.user?.name || `Emp #${record.employeeId}`}</div>
                          <div className="text-xs font-medium text-gray-500">{record.employee?.designation?.name || "Employee"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        record.attendanceState === 'WORKING' ? 'bg-emerald-100 text-emerald-700' :
                        record.attendanceState === 'ON_BREAK' ? 'bg-amber-100 text-amber-700' :
                        record.attendanceState === 'CHECKED_OUT' ? 'bg-gray-100 text-gray-600' :
                        'bg-gray-100 text-gray-400'
                      }`}>
                        {record.attendanceState === 'WORKING' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>}
                        {record.attendanceState?.replace('_', ' ') || 'NO PUNCH'}
                      </span>
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-bold ${
                        record.attendanceStatus === 'PRESENT' ? 'text-emerald-700 border border-emerald-200 bg-emerald-50' :
                        record.attendanceStatus === 'HALF_DAY' ? 'text-amber-700 border border-amber-200 bg-amber-50' :
                        record.attendanceStatus === 'ABSENT' ? 'text-rose-700 border border-rose-200 bg-rose-50' :
                        record.attendanceStatus === 'LATE' ? 'text-orange-700 border border-orange-200 bg-orange-50' :
                        record.attendanceStatus === 'ON_LEAVE' ? 'text-purple-700 border border-purple-200 bg-purple-50' :
                        'text-gray-600 border border-gray-200 bg-gray-50'
                      }`}>
                        {record.attendanceStatus || '-'}
                      </span>
                    </td>
                    <td className="p-5 text-sm font-medium text-gray-700">
                      {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}
                      {record.lateMinutes > 0 && <span className="ml-2 text-xs font-bold text-rose-500">+{record.lateMinutes}m</span>}
                    </td>
                    <td className="p-5 text-sm font-medium text-gray-700">
                      {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}
                    </td>
                    <td className="p-5 text-sm font-bold text-gray-900 text-right tabular-nums">
                      {record.totalHours || '0.00'} h
                    </td>
                  </tr>
                ))}
                {filteredAttendance.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-12 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="text-gray-900 font-bold mb-1">No Records Found</div>
                      <div className="text-gray-500 text-sm">No attendance punches found for the selected date and filters.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable Metric Card
function MetricCard({ title, value, icon: Icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    gray: "bg-gray-50 text-gray-600 border-gray-200",
  };
  
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center border ${colors[color]}`}>
          <Icon className="w-5 h-5 fill-current opacity-20" />
          <Icon className="w-5 h-5 absolute" />
        </div>
        <span className="font-bold text-gray-500 text-xs uppercase tracking-wider">{title}</span>
      </div>
      <div className="text-3xl font-black text-gray-900">{value}</div>
    </div>
  );
}
