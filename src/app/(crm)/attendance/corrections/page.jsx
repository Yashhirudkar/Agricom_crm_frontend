"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCorrections, approveCorrection, rejectCorrection,
  fetchRegularizationHistory,
  selectCorrections, selectAttendanceLoading, selectRegularizationHistory,
  selectAttendanceError, clearAttendanceError
} from "@/store/entities/attendanceSlice";
import { Check, X, Clock, Calendar, AlertCircle, MessageSquare, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { selectActiveCompanyId } from "@/store/slices/companyContextSlice";

export default function CorrectionsPage() {
  const dispatch = useDispatch();
  const corrections = useSelector(selectCorrections) || [];
  const history = useSelector(selectRegularizationHistory) || { data: [], page: 1, totalPages: 1, totalCount: 0 };
  const isLoading = useSelector(selectAttendanceLoading);
  const error = useSelector(selectAttendanceError);
  const user = useSelector(state => state.auth?.user);
  const activeCompanyId = useSelector(selectActiveCompanyId);

  const [activeTab, setActiveTab] = useState("PENDING"); // PENDING | HISTORY
  const [remarks, setRemarks] = useState({});

  // History Filters
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchEmployee, setSearchEmployee] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    dispatch(clearAttendanceError());
    if (activeTab === "PENDING") {
      dispatch(fetchCorrections());
    } else {
      fetchHistory();
    }
  }, [activeTab, dispatch, page, limit, statusFilter, startDate, endDate, activeCompanyId]);

  const fetchHistory = () => {
    dispatch(fetchRegularizationHistory({
      page,
      limit,
      status: statusFilter,
      search: searchEmployee,
      startDate,
      endDate
    }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchHistory();
  };

  const handleApprove = async (id) => {
    dispatch(clearAttendanceError());
    if (confirm("Approve this regularization request?")) {
      const res = await dispatch(approveCorrection({ id, data: { remarks: remarks[id] || "" } }));
      if (res.meta.requestStatus === "fulfilled") {
        dispatch(fetchCorrections());
      }
    }
  };

  const handleReject = async (id) => {
    dispatch(clearAttendanceError());
    if (confirm("Reject this regularization request?")) {
      const res = await dispatch(rejectCorrection({ id, data: { remarks: remarks[id] || "" } }));
      if (res.meta.requestStatus === "fulfilled") {
        dispatch(fetchCorrections());
      }
    }
  };

  const handleRemarksChange = (id, val) => {
    setRemarks(prev => ({ ...prev, [id]: val }));
  };

  const pendingCorrections = corrections.filter(c => c.status === 'PENDING');

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Header Section */}
      <div className="mb-6 border-b border-slate-200 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">Attendance Regularization</h1>
          <p className="text-sm text-slate-500 mt-1.5">Review and manage employee time regularization requests</p>
        </div>
        <div className="text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-md border border-slate-200 shadow-sm">
          Pending Requests: <span className="text-blue-600 font-bold ml-1">{pendingCorrections.length}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("PENDING")}
          className={`pb-3 px-2 text-sm font-medium transition-colors border-b-2 ${activeTab === "PENDING" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          Pending Requests
        </button>
        <button
          onClick={() => { setActiveTab("HISTORY"); setPage(1); }}
          className={`pb-3 px-2 text-sm font-medium transition-colors border-b-2 ${activeTab === "HISTORY" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          History
        </button>
      </div>

      {/* Error Alert Display */}
      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-sm font-semibold flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => dispatch(clearAttendanceError())} className="text-rose-500 hover:text-rose-700 font-bold ml-2">✕</button>
        </div>
      )}

      {activeTab === "PENDING" && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          {/* Table Header (Desktop Only) */}
          {pendingCorrections.length > 0 && (
            <div className="hidden lg:grid grid-cols-12 gap-4 p-4 border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <div className="col-span-3">Employee Details</div>
              <div className="col-span-2">Date & Type</div>
              <div className="col-span-2">Proposed Timings</div>
              <div className="col-span-2">Reason</div>
              <div className="col-span-3 text-right">Remarks & Actions</div>
            </div>
          )}

          <div className="divide-y divide-slate-100">
            {pendingCorrections.map(correction => {
              const isOwnRequest = user?.type !== "client_admin" && user?.employeeId === correction.employeeId;

              return (
                <div
                  key={correction.id}
                  className={`p-4 lg:p-5 transition-colors hover:bg-slate-50/50 flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:items-center relative ${isOwnRequest ? 'bg-orange-50/30' : ''}`}
                >
                  {/* 1. Employee Details */}
                  <div className="col-span-3 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center font-semibold shrink-0">
                      {correction.employee?.user?.name?.charAt(0) || "E"}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">{correction.employee?.user?.name || `Employee #${correction.employeeId}`}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{correction.employee?.designation?.name || "Employee"}</p>
                      {isOwnRequest && (
                        <span className="inline-block mt-1.5 text-[10px] font-semibold bg-orange-100 text-orange-700 px-2 py-0.5 rounded border border-orange-200">
                          Self Approval Blocked
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 2. Date & Request Type */}
                  <div className="col-span-2 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-sm text-slate-800">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium">{correction.metadata?.date || '-'}</span>
                    </div>
                    <span className="text-[11px] font-medium text-slate-500 bg-slate-100 w-max px-2 py-0.5 rounded">
                      {correction.type?.replace('_', ' ') || correction.requestType?.replace('_', ' ') || 'REGULARIZATION'}
                    </span>
                  </div>

                  {/* 3. Timings */}
                  <div className="col-span-2 flex items-start gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <div className="text-sm text-slate-700 font-medium flex flex-col">
                      <span>{correction.metadata?.proposedCheckInTime ? new Date(correction.metadata.proposedCheckInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}</span>
                      <span className="text-slate-400 text-xs">to</span>
                      <span>{correction.metadata?.proposedCheckOutTime ? new Date(correction.metadata.proposedCheckOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}</span>
                    </div>
                  </div>

                  {/* 4. Reason */}
                  <div className="col-span-2">
                    <div className="text-sm text-slate-600 line-clamp-2 bg-slate-50 p-2 border border-slate-100 rounded text-xs" title={correction.reason}>
                      <AlertCircle className="w-3 h-3 inline mr-1 text-slate-400 mb-0.5" />
                      {correction.reason || "No reason provided"}
                    </div>
                  </div>

                  {/* 5. Actions & Remarks */}
                  <div className="col-span-3 flex flex-col gap-2 w-full lg:ml-auto lg:max-w-xs">
                    <div className="relative">
                      <MessageSquare className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Add remarks..."
                        value={remarks[correction.id] || ''}
                        onChange={(e) => handleRemarksChange(correction.id, e.target.value)}
                        disabled={isOwnRequest}
                        className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-all disabled:opacity-50 text-slate-700"
                      />
                    </div>

                    <div className="flex flex-row gap-2">
                      <button
                        onClick={() => handleReject(correction.id)}
                        disabled={isLoading || isOwnRequest}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                      <button
                        onClick={() => handleApprove(correction.id)}
                        disabled={isLoading || isOwnRequest}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded bg-blue-900 text-white font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm disabled:cursor-not-allowed"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}

            {pendingCorrections.length === 0 && (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-medium text-slate-800">All Caught Up</h3>
                <p className="text-sm text-slate-500 mt-1">There are no pending regularization requests at the moment.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "HISTORY" && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
          {/* Filters */}
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap gap-4 items-end">
            <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-slate-500 mb-1">Search Employee</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Name..."
                  value={searchEmployee}
                  onChange={(e) => setSearchEmployee(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded focus:ring-1 focus:ring-blue-400 outline-none text-slate-700"
                />
              </div>
            </form>
            
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="w-full md:w-32 py-2 px-3 text-sm border border-slate-200 rounded focus:ring-1 focus:ring-blue-400 outline-none bg-white text-slate-700"
              >
                <option value="">All</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                className="w-full py-2 px-3 text-sm border border-slate-200 rounded focus:ring-1 focus:ring-blue-400 outline-none bg-white text-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                className="w-full py-2 px-3 text-sm border border-slate-200 rounded focus:ring-1 focus:ring-blue-400 outline-none bg-white text-slate-700"
              />
            </div>
          </div>

          {/* History Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Employee Name</th>
                  <th className="px-4 py-3 font-semibold">Attendance Date</th>
                  <th className="px-4 py-3 font-semibold">Request Created</th>
                  <th className="px-4 py-3 font-semibold">Proposed In/Out</th>
                  <th className="px-4 py-3 font-semibold">Request Type</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Actioned By</th>
                  <th className="px-4 py-3 font-semibold">Action Date</th>
                  <th className="px-4 py-3 font-semibold">Action Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr><td colSpan="9" className="text-center py-8">Loading...</td></tr>
                ) : history?.data?.length > 0 ? (
                  history.data.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {item.employee?.user?.name || `Employee #${item.employeeId}`}
                      </td>
                      <td className="px-4 py-3">{item.metadata?.date || '-'}</td>
                      <td className="px-4 py-3">{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-xs">
                        {item.metadata?.proposedCheckInTime ? new Date(item.metadata.proposedCheckInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                        <br/><span className="text-slate-400">to</span><br/>
                        {item.metadata?.proposedCheckOutTime ? new Date(item.metadata.proposedCheckOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-medium">
                          {item.type?.replace('_', ' ') || item.requestType?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${item.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {item.approver?.user?.name || (item.approvedBy ? `Admin #${item.approvedBy}` : '-')}
                      </td>
                      <td className="px-4 py-3 text-xs">{item.updatedAt ? new Date(item.updatedAt).toLocaleString() : '-'}</td>
                      <td className="px-4 py-3 text-xs max-w-[150px] truncate" title={item.remarks}>{item.remarks || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="9" className="text-center py-8 text-slate-500">No history found matching filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {history.totalPages > 1 && (
            <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Showing page <span className="font-semibold text-slate-700">{history.page}</span> of <span className="font-semibold text-slate-700">{history.totalPages}</span>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={history.page <= 1}
                  className="p-1.5 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-600" />
                </button>
                <button
                  onClick={() => setPage(p => Math.min(history.totalPages, p + 1))}
                  disabled={history.page >= history.totalPages}
                  className="p-1.5 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}