"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  checkIn, checkOut, fetchMyAttendance, requestCorrection,
  selectMyAttendance, selectAttendanceLoading, selectAttendanceError,
  clearAttendanceError, clearAttendanceSuccessMessage, selectAttendanceSuccess
} from "@/store/entities/attendanceSlice";
import { fetchShifts, selectAllShifts } from "@/store/entities/shiftsSlice";
import {
  AlertCircle, CheckCircle2, HelpCircle, X, Clock, Loader2,
  Calendar, Fingerprint, LogOut, Info, MapPin, History
} from "lucide-react";
import { getFriendlyError } from "@/lib/errorMessages";

// Function to calculate live time diff taking into account all sessions for today
const calculateLiveTimer = (logs) => {
  if (!logs || logs.length === 0) return { h: "00", m: "00", s: "00" };

  const sortedLogs = [...logs].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  let totalMs = 0;
  let lastIn = null;

  for (const log of sortedLogs) {
    if (log.actionType === 'CHECK_IN') {
      lastIn = new Date(log.timestamp);
    } else if (log.actionType === 'CHECK_OUT' && lastIn) {
      totalMs += (new Date(log.timestamp) - lastIn);
      lastIn = null;
    }
  }

  if (lastIn) {
    totalMs += (new Date() - lastIn);
  }

  if (totalMs < 0) return { h: "00", m: "00", s: "00" };

  const h = Math.floor(totalMs / (1000 * 60 * 60));
  const m = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((totalMs % (1000 * 60)) / 1000);

  return {
    h: h.toString().padStart(2, '0'),
    m: m.toString().padStart(2, '0'),
    s: s.toString().padStart(2, '0')
  };
};

export default function MyAttendancePage() {
  const dispatch = useDispatch();
  const myAttendance = useSelector(selectMyAttendance) || [];
  const shifts = useSelector(selectAllShifts) || [];
  const isLoading = useSelector(selectAttendanceLoading);
  const error = useSelector(selectAttendanceError);
  const success = useSelector(selectAttendanceSuccess);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionForm, setCorrectionForm] = useState({ date: '', expectedCheckIn: '', expectedCheckOut: '', reason: '' });
  const [correctionError, setCorrectionError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    dispatch(fetchShifts());
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    dispatch(fetchMyAttendance({ startDate: startDate.toLocaleDateString('en-CA'), endDate: new Date().toLocaleDateString('en-CA') }));

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [dispatch]);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        dispatch(clearAttendanceError());
        dispatch(clearAttendanceSuccessMessage());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success, dispatch]);

  const todayStr = new Date().toLocaleDateString('en-CA');
  const todayRecord = myAttendance.find(r => r.date === todayStr);
  const currentShift = todayRecord?.shiftId ? shifts.find(s => s.id === todayRecord.shiftId) : (shifts[0] || { name: 'General Shift', startTime: '09:30 AM', endTime: '06:30 PM' });

  const handleAction = async (action, type) => {
    if (actionLoading) return;
    setActionLoading(type);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const doAction = (coords = {}) =>
      dispatch(action(coords)).then((result) => {
        if (!result.error) {
          dispatch(fetchMyAttendance({
            startDate: startDate.toLocaleDateString('en-CA'),
            endDate: new Date().toLocaleDateString('en-CA')
          }));
        }
        setActionLoading(null);
      }).catch(() => setActionLoading(null));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => doAction({ locationLat: position.coords.latitude, locationLng: position.coords.longitude }),
        () => doAction({}),
        { timeout: 5000 }
      );
    } else {
      doAction({});
    }
  };

  const handleCorrectionSubmit = (e) => {
    e.preventDefault();
    setCorrectionError('');
    if (!correctionForm.date || !correctionForm.reason) {
      setCorrectionError('Date and Reason are required.');
      return;
    }
    dispatch(requestCorrection({
      requestType: 'MISSED_PUNCH',
      date: correctionForm.date,
      checkInTime: correctionForm.expectedCheckIn || undefined,
      checkOutTime: correctionForm.expectedCheckOut || undefined,
      reason: correctionForm.reason
    })).then((result) => {
      if (!result.error) {
        setShowCorrectionModal(false);
        setCorrectionForm({ date: '', expectedCheckIn: '', expectedCheckOut: '', reason: '' });
        setCorrectionError('');
      } else {
        setCorrectionError(getFriendlyError(result.payload));
      }
    });
  };

  // Activity Timeline Data
  const activityLogs = todayRecord?.logs || [];

  let isWorking = false;
  let firstIn = "--:-- --";

  if (activityLogs.length > 0) {
    const sortedLogs = [...activityLogs].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const checkIns = sortedLogs.filter(l => l.actionType === 'CHECK_IN');

    if (checkIns.length > 0) {
      firstIn = new Date(checkIns[0].timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    }

    const lastAction = sortedLogs[sortedLogs.length - 1].actionType;
    if (lastAction === 'CHECK_IN') {
      isWorking = true;
    }
  }

  const canCheckIn = !isWorking;
  const canCheckOut = isWorking;
  const timeObj = calculateLiveTimer(activityLogs);

  // Apple Watch style progress calculation
  const totalSeconds = Number(timeObj.h) * 3600 + Number(timeObj.m) * 60 + Number(timeObj.s);
  const maxWorkSeconds = 9 * 60 * 60; // 9 hours
  const progress = Math.min(totalSeconds / maxWorkSeconds, 1);
  
  const dashOffset = 289 - progress * 289;
  const angle = progress * 360;

  // Helper for timeline dots & badges
  const getTimelineStyles = (type) => {
    switch (type) {
      case 'CHECK_IN': return { dot: 'bg-emerald-500', badgeBg: 'bg-emerald-100', badgeText: 'text-emerald-700', label: 'IN', actionLabel: 'Checked In' };
      case 'CHECK_OUT': return { dot: 'bg-rose-500', badgeBg: 'bg-rose-100', badgeText: 'text-rose-700', label: 'OUT', actionLabel: 'Checked Out' };
      case 'BREAK_START': return { dot: 'bg-yellow-400', badgeBg: 'bg-yellow-100', badgeText: 'text-yellow-700', label: 'BREAK START', actionLabel: 'Break Started' };
      case 'BREAK_END': return { dot: 'bg-emerald-500', badgeBg: 'bg-emerald-100', badgeText: 'text-emerald-700', label: 'BREAK END', actionLabel: 'Break Ended' };
      default: return { dot: 'bg-gray-400', badgeBg: 'bg-gray-100', badgeText: 'text-gray-700', label: type, actionLabel: type };
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">

        {/* LEFT COLUMN */}
        <div className="flex-1 space-y-6">

          {/* Status Messages */}
          {(error || success) && (
            <div className={`p-4 rounded-lg flex items-center gap-3 ${error ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
              {error ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> : <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
              <span className="font-medium">{error || success}</span>
            </div>
          )}

          {/* MAIN PUNCH CARD */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 relative overflow-hidden">
            {/* Subtle decorative background glow for premium feel */}
            <div className="absolute top-0 right-0 w-30 h-30 bg-slate-900/[0.02] rounded-full blur-3xl -mr-20 -mt-20"></div>

            <div className="flex justify-between items-center mb-8 relative z-10">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                Today's Attendance
              </h2>
              <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-sm font-semibold rounded-md flex items-center gap-1.5 border border-emerald-100">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                Working
              </div>
            </div>

            {/* Circular Timer UI */}
            <div className="flex justify-center mb-8 relative z-10">
              <div className="relative flex justify-center items-center w-64 h-64">
                {/* SVG Progress Ring */}
                <svg className="w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
                  {/* Background Track */}
                  <circle cx="50" cy="50" r="46" fill="transparent" stroke="#f1f5f9" strokeWidth="2.5" />
                  {/* Active Green Track */}
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="transparent"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeDasharray="289"
                    strokeDashoffset={isWorking ? dashOffset : 289}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-in-out drop-shadow-[0_0_6px_rgba(16,185,129,0.4)]"
                  />
                </svg>

                {/* Inner Timer Content */}
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
                    Working Since
                  </span>
                  <div className="text-4xl font-extrabold text-slate-900 tracking-tight tabular-nums mt-1 mb-2">
                    {timeObj.h}:{timeObj.m}:{timeObj.s}
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-bold text-slate-800">{firstIn}</span>
                    <span className="text-xs font-semibold text-emerald-500 mt-0.5">Check-in</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shift Info */}
            <div className="text-center mb-8 relative z-10">
              <div className="text-base font-bold text-slate-800">{currentShift.name}</div>
              <div className="text-sm font-medium text-slate-500">{currentShift.startTime} - {currentShift.endTime}</div>
            </div>

            {/* Action Buttons - Refined & Side-by-Side */}
            <div className="flex flex-row gap-3 mb-6 relative z-10">
              <button
                onClick={() => handleAction(checkIn, 'in')}
                disabled={!!actionLoading || !canCheckIn}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold flex justify-center items-center gap-2 transition-all ${canCheckIn
                  ? 'bg-green-600 hover:bg-green-800 text-white shadow-md cursor-pointer'
                  : 'bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed'
                  }`}
              >
                {actionLoading === 'in' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Fingerprint className="w-4 h-4" />}
                {actionLoading === 'in' ? 'Processing...' : 'Check In'}
              </button>

              <button
                onClick={() => handleAction(checkOut, 'out')}
                disabled={!!actionLoading || !canCheckOut}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold flex justify-center items-center gap-2 transition-all ${canCheckOut
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-200 cursor-pointer'
                  : 'bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed'
                  }`}
              >
                {actionLoading === 'out' ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                {actionLoading === 'out' ? 'Processing...' : 'Check Out'}
              </button>
            </div>

            {/* Note Area */}
            <div className="bg-slate-50 text-slate-600 text-xs py-3 px-4 rounded-lg flex items-start gap-2 border border-slate-200 relative z-10">
              <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <p>Working hours are calculated strictly based on your verified check-in and check-out timestamps.</p>
            </div>
          </div>

          {/* THIS WEEK OVERVIEW (Static UI Representation) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">This Week Overview</h3>
            <div className="flex justify-between items-center overflow-x-auto gap-2 pb-2">
              {[
                { day: 'MON', date: '15', status: 'P', color: 'text-emerald-500 bg-emerald-50 border-emerald-100' },
                { day: 'TUE', date: '16', status: 'P', color: 'text-emerald-500 bg-emerald-50 border-emerald-100' },
                { day: 'WED', date: '17', status: 'W', color: 'text-blue-600 bg-blue-50 border-blue-200', active: true },
                { day: 'THU', date: '18', status: '-', color: 'text-gray-400 bg-gray-50 border-gray-100' },
                { day: 'FRI', date: '19', status: '-', color: 'text-gray-400 bg-gray-50 border-gray-100' },
                { day: 'SAT', date: '20', status: 'WO', color: 'text-orange-500 bg-orange-50 border-orange-100' },
                { day: 'SUN', date: '21', status: 'WO', color: 'text-orange-500 bg-orange-50 border-orange-100' },
              ].map((item, idx) => (
                <div key={idx} className={`flex flex-col items-center justify-center p-4 rounded-2xl min-w-[70px] ${item.active ? 'border-2 border-blue-400 bg-blue-50/50' : 'border border-gray-100'}`}>
                  <span className="text-xs text-gray-400 font-semibold mb-1">{item.day}</span>
                  <span className={`text-xl font-bold mb-3 ${item.active ? 'text-blue-600' : 'text-gray-800'}`}>{item.date}</span>
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold border ${item.color}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* HELP & CORRECTION CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50/50 rounded-2xl border border-blue-100 p-6 flex flex-col justify-between">
              <div>
                <h4 className="text-blue-700 font-bold mb-1">Forgot to punch?</h4>
                <p className="text-sm text-gray-600 mb-4">Request for regularization if you forgot to check-in or check-out.</p>
              </div>
              <button
                onClick={() => setShowCorrectionModal(true)}
                className="self-end px-4 py-2 border border-blue-200 text-blue-600 bg-white hover:bg-blue-50 rounded-lg text-sm font-semibold transition-colors"
              >
                Request Regularization
              </button>
            </div>

            <div className="bg-blue-50/50 rounded-2xl border border-blue-100 p-6 flex flex-col justify-between">
              <div>
                <h4 className="text-blue-700 font-bold mb-1">Need help?</h4>
                <p className="text-sm text-gray-600 mb-4">Contact your HR or Manager for any attendance related issues.</p>
              </div>
              <button
                className="self-end px-4 py-2 border border-blue-200 text-blue-600 bg-white hover:bg-blue-50 rounded-lg text-sm font-semibold transition-colors"
              >
                Contact HR
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full lg:w-[400px] space-y-6">

          {/* TODAY'S SUMMARY */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Today's Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <div className="flex items-center gap-3 text-gray-600 font-medium">
                  <Clock className="w-5 h-5 text-gray-400" /> Working Hours
                </div>
                <div className="font-bold text-gray-900">{timeObj.h}h {timeObj.m}m</div>
              </div>
              <div className="flex justify-between items-center py-2">
                <div className="flex items-center gap-3 text-gray-600 font-medium">
                  <History className="w-5 h-5 text-gray-400" /> Break Hours
                </div>
                <div className="font-bold text-gray-900">00h 30m</div> {/* Static as per UI mock */}
              </div>
              <div className="flex justify-between items-center py-2">
                <div className="flex items-center gap-3 text-gray-600 font-medium">
                  <AlertCircle className="w-5 h-5 text-red-400" /> Late By
                </div>
                <div className="font-bold text-red-500">{todayRecord?.lateMinutes > 0 ? `${todayRecord.lateMinutes}m` : '00h 15m'}</div>
              </div>
              <div className="flex justify-between items-center py-2">
                <div className="flex items-center gap-3 text-gray-600 font-medium">
                  <Clock className="w-5 h-5 text-gray-400" /> Overtime
                </div>
                <div className="font-bold text-gray-900">00h 00m</div>
              </div>
            </div>
          </div>

          {/* TODAY'S TIMELINE */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Today's Timeline</h3>

            <div className="relative pl-4 border-l-2 border-gray-100 ml-4 space-y-8">
              {activityLogs.length > 0 ? [...activityLogs]
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .slice(0, 5)
                .reverse()
                .map((log, idx) => {
                  const styles = getTimelineStyles(log.actionType);
                  return (
                    <div key={idx} className="relative">
                      {/* Dot */}
                      <div className={`absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full ring-4 ring-white ${styles.dot}`}></div>

                      <div className="flex flex-col gap-2 pl-4">
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-bold text-gray-800">
                            {new Date(log.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${styles.badgeBg} ${styles.badgeText}`}>
                            {styles.label}
                          </span>
                        </div>

                        <div>
                          <div className="text-sm font-semibold text-gray-900">{styles.actionLabel}</div>
                          {(log.actionType === 'CHECK_IN' || log.actionType === 'CHECK_OUT') && (
                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" /> Location: Office
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                <div className="text-gray-500 text-sm ml-4 py-4">No activity recorded for today.</div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* CORRECTION MODAL */}
      {showCorrectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900">Request Regularization</h3>
              <button onClick={() => setShowCorrectionModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCorrectionSubmit} className="p-6 space-y-4">
              {correctionError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-xs font-medium text-red-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />{correctionError}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={correctionForm.date}
                  onChange={e => setCorrectionForm({ ...correctionForm, date: e.target.value })}
                  className="w-full px-3 py-2 border text-gray-800 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected In</label>
                  <input
                    type="datetime-local"
                    value={correctionForm.expectedCheckIn}
                    onChange={e => setCorrectionForm({ ...correctionForm, expectedCheckIn: e.target.value })}
                    className="w-full px-3 py-2 text-gray-800 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Out</label>
                  <input
                    type="datetime-local"
                    value={correctionForm.expectedCheckOut}
                    onChange={e => setCorrectionForm({ ...correctionForm, expectedCheckOut: e.target.value })}
                    className="w-full px-3 py-2 border text-gray-800 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Explain why..."
                  value={correctionForm.reason}
                  onChange={e => setCorrectionForm({ ...correctionForm, reason: e.target.value })}
                  className="w-full px-3 py-2 text-gray-800 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                ></textarea>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCorrectionModal(false)}
                  className="flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}