"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCorrections, approveCorrection, rejectCorrection,
  selectCorrections, selectAttendanceLoading
} from "@/store/entities/attendanceSlice";
import { Check, X, Clock, Calendar, AlertCircle, MessageSquare } from "lucide-react";

export default function CorrectionsPage() {
  const dispatch = useDispatch();
  const corrections = useSelector(selectCorrections) || [];
  const isLoading = useSelector(selectAttendanceLoading);
  const user = useSelector(state => state.auth?.user);

  const [remarks, setRemarks] = useState({});
  
  console.log("USER =", user);
  console.log("logged employeeId =", user?.employeeId);

  useEffect(() => {
    dispatch(fetchCorrections());
  }, [dispatch]);

  const handleApprove = async (id) => {
    console.log("CLICKED");
    if (confirm("Approve this regularization request?")) {
      const result = await dispatch(approveCorrection({ id, data: { remarks: remarks[id] || "" } }));
      console.log(result);
      dispatch(fetchCorrections());
    }
  };

  const handleReject = async (id) => {
    console.log("CLICKED");
    if (confirm("Reject this regularization request?")) {
      const result = await dispatch(rejectCorrection({ id, data: { remarks: remarks[id] || "" } }));
      console.log(result);
      dispatch(fetchCorrections());
    }
  };

  const handleRemarksChange = (id, val) => {
    setRemarks(prev => ({ ...prev, [id]: val }));
  };

  const pendingCorrections = corrections.filter(c => c.status === 'PENDING');

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto min-h-screen bg-slate-50 font-sans">
      {/* Header Section */}
      <div className="mb-8 border-b border-slate-200 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">Attendance Regularization</h1>
          <p className="text-sm text-slate-500 mt-1.5">Review and manage employee time regularization requests</p>
        </div>
        <div className="text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-md border border-slate-200 shadow-sm">
          Pending Requests: <span className="text-blue-600 font-bold ml-1">{pendingCorrections.length}</span>
        </div>
      </div>

      {/* Main Content */}
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
            console.log("correction.employeeId =", correction.employeeId);
            console.log("isOwnRequest =", isOwnRequest);

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
                    {correction.requestType?.replace('_', ' ') || 'REGULARIZATION'}
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
                      className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-all disabled:opacity-50"
                    />
                  </div>

                  {/* Buttons kept side-by-side explicitly */}
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

          {/* Empty State */}
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
    </div>
  );
}