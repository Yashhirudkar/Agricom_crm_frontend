"use client";

import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUserType } from "@/store/slices/authSlice";
import { usePermissions } from "@/hooks/usePermissions";
import { selectActiveCompanyId } from "@/store/slices/companyContextSlice";
import {
  fetchCompanyHrPolicies,
  upsertCompanyHrPolicies,
  selectCurrentHrPolicy,
  selectHrPoliciesLoading,
  selectHrPoliciesError,
  clearCompanyHrPoliciesError,
} from "@/store/entities/companyHrPoliciesSlice";
import {
  Shield,
  Check,
  AlertCircle,
  Save,
  Clock,
  Calendar,
  Settings
} from "lucide-react";

function HrPoliciesContent() {
  const dispatch = useDispatch();
  const { hasPermission } = usePermissions();
  const canUpdate = hasPermission("hrpolicy:update");

  const userType = useSelector(selectUserType);
  const activeCompanyId = useSelector(selectActiveCompanyId) || "";

  const currentPolicy = useSelector(selectCurrentHrPolicy);
  const isLoading = useSelector(selectHrPoliciesLoading);
  const error = useSelector(selectHrPoliciesError);

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    probationMonths: 3,
    noticePeriodDays: 30,
    retirementAge: 60,
    minHalfDayHours: 4,
    minFullDayHours: 8,
    defaultShiftStartTime: "09:00",
    defaultShiftEndTime: "18:00",
    lateMarkGraceMinutes: 15,
    allowAttendanceCorrection: true
  });

  useEffect(() => {
    if (currentPolicy) {
      setForm({
        probationMonths: currentPolicy.probationPeriodDays ? Math.floor(currentPolicy.probationPeriodDays / 30) : 3,
        noticePeriodDays: currentPolicy.defaultNoticePeriodDays ?? 30,
        retirementAge: currentPolicy.retirementAge ?? 60,
        minHalfDayHours: currentPolicy.minHoursForHalfDay ?? 4,
        minFullDayHours: currentPolicy.minHoursForPresent ?? 8,
        defaultShiftStartTime: currentPolicy.defaultShiftStartTime || "09:00",
        defaultShiftEndTime: currentPolicy.defaultShiftEndTime || "18:00",
        lateMarkGraceMinutes: currentPolicy.lateComingGraceMinutes ?? 15,
        allowAttendanceCorrection: currentPolicy.allowAttendanceCorrection ?? true
      });
    } else {
      // Defaults
      setForm({
        probationMonths: 3,
        noticePeriodDays: 30,
        retirementAge: 60,
        minHalfDayHours: 4,
        minFullDayHours: 8,
        defaultShiftStartTime: "09:00",
        defaultShiftEndTime: "18:00",
        lateMarkGraceMinutes: 15,
        allowAttendanceCorrection: true
      });
    }
  }, [currentPolicy]);

  useEffect(() => {
    if (activeCompanyId) {
      dispatch(fetchCompanyHrPolicies());
    }
  }, [dispatch, activeCompanyId]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        retirementAge: Number(form.retirementAge),
        defaultShiftStartTime: form.defaultShiftStartTime,
        defaultShiftEndTime: form.defaultShiftEndTime,
        probationPeriodDays: Number(form.probationMonths) * 30,
        defaultNoticePeriodDays: Number(form.noticePeriodDays),
        minHoursForHalfDay: Number(form.minHalfDayHours),
        minHoursForPresent: Number(form.minFullDayHours),
        lateComingGraceMinutes: Number(form.lateMarkGraceMinutes),
        allowAttendanceCorrection: Boolean(form.allowAttendanceCorrection)
      };
      await dispatch(upsertCompanyHrPolicies(payload)).unwrap();
      showToast("Company HR Policies updated successfully");
    } catch (err) {
      showToast(err || "Save failed", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading && !currentPolicy) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-400">Loading Policies...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto space-y-6">
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-xs font-bold text-white transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
          {toast.type === "error" ? <AlertCircle className="h-4 w-4" /> : <Check className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Shield className="h-6 w-6 text-[#007aff]" />
            HR Policies
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Configure global HR rules and limits for the entire company.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-gray-50 bg-gray-50/20 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <h2 className="text-sm font-bold text-gray-800">Employment Terms</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Probation Period (Months)</label>
                <input
                  type="number"
                  disabled={!canUpdate}
                  value={form.probationMonths}
                  onChange={e => setForm({ ...form, probationMonths: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Notice Period (Days)</label>
                <input
                  type="number"
                  disabled={!canUpdate}
                  value={form.noticePeriodDays}
                  onChange={e => setForm({ ...form, noticePeriodDays: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Retirement Age</label>
                <input
                  type="number"
                  disabled={!canUpdate}
                  value={form.retirementAge}
                  onChange={e => setForm({ ...form, retirementAge: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-gray-50 bg-gray-50/20 flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-400" />
              <h2 className="text-sm font-bold text-gray-800">Attendance & Shifts</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Min Half Day Hours</label>
                <input
                  type="number"
                  step="0.5"
                  disabled={!canUpdate}
                  value={form.minHalfDayHours}
                  onChange={e => setForm({ ...form, minHalfDayHours: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Min Full Day Hours</label>
                <input
                  type="number"
                  step="0.5"
                  disabled={!canUpdate}
                  value={form.minFullDayHours}
                  onChange={e => setForm({ ...form, minFullDayHours: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Default Start Time</label>
                <input
                  type="time"
                  disabled={!canUpdate}
                  value={form.defaultShiftStartTime}
                  onChange={e => setForm({ ...form, defaultShiftStartTime: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Default End Time</label>
                <input
                  type="time"
                  disabled={!canUpdate}
                  value={form.defaultShiftEndTime}
                  onChange={e => setForm({ ...form, defaultShiftEndTime: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Late Mark Grace (Mins)</label>
                <input
                  type="number"
                  disabled={!canUpdate}
                  value={form.lateMarkGraceMinutes}
                  onChange={e => setForm({ ...form, lateMarkGraceMinutes: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Attendance Correction</label>
                <select
                  disabled={!canUpdate}
                  value={form.allowAttendanceCorrection ? "true" : "false"}
                  onChange={e => setForm({ ...form, allowAttendanceCorrection: e.target.value === "true" })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed bg-white"
                >
                  <option value="true">Allowed</option>
                  <option value="false">Not Allowed</option>
                </select>
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving || !canUpdate}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors ${!canUpdate
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                  : "bg-[#007aff] hover:bg-blue-600 text-white cursor-pointer shadow-md"
                }`}
            >
              {isSaving ? (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Global Policies
            </button>
          </div>
        </form>
    </div>
  );
}

export default function HrPoliciesPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-400">Loading...</p>
      </div>
    }>
      <HrPoliciesContent />
    </Suspense>
  );
}
