"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { selectUserType } from "@/store/slices/authSlice";
import { usePermissions } from "@/hooks/usePermissions";
import { selectActiveCompanyId } from "@/store/slices/companyContextSlice";
import {
  fetchCompanyHrPolicies,
  fetchCompanyHrPolicyPreview,
  fetchCompanyHrPolicyHistory,
  fetchCompanyHrPolicyImpact,
  upsertCompanyHrPolicies,
  selectCurrentHrPolicy,
  selectHrPolicyPreview,
  selectHrPolicyHistory,
  selectHrPolicyImpact,
  selectHrPoliciesLoading,
} from "@/store/entities/companyHrPoliciesSlice";
import {
  Shield,
  Check,
  AlertCircle,
  Save,
  Clock,
  Calendar,
  Settings,
  History,
  Lock,
  CheckCircle2,
  Sliders,
  Smartphone,
  MapPin,
  Camera,
  Sparkles,
  Users,
  ChevronRight,
  User,
} from "lucide-react";
import EnterpriseTimePicker from "@/components/common/EnterpriseTimePicker";
import PolicyPreviewPanel from "@/components/attendance/PolicyPreviewPanel";
import PolicyVersionHistoryDrawer from "@/components/attendance/PolicyVersionHistoryDrawer";
import PolicyImpactModal from "@/components/attendance/PolicyImpactModal";

const DAYS_OF_WEEK = [
  { label: "Su", full: "Sunday", value: 0 },
  { label: "Mo", full: "Monday", value: 1 },
  { label: "Tu", full: "Tuesday", value: 2 },
  { label: "We", full: "Wednesday", value: 3 },
  { label: "Th", full: "Thursday", value: 4 },
  { label: "Fr", full: "Friday", value: 5 },
  { label: "Sa", full: "Saturday", value: 6 },
];

function ToggleSwitch({ enabled, onChange, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        enabled ? "bg-[#007aff]" : "bg-gray-200"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function HrPoliciesContent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const userType = useSelector(selectUserType);
  const { hasPermission } = usePermissions();

  const isSuperAdmin = userType === "super_admin" || userType === "client_admin";
  const canRead = hasPermission("hrpolicy:read") || hasPermission("hrpolicy:view");
  const canUpdate = hasPermission("hrpolicy:update");
  const hasAccess = isSuperAdmin || canRead;

  const activeCompanyId = useSelector(selectActiveCompanyId) || "";

  const currentPolicy = useSelector(selectCurrentHrPolicy);
  const policyPreview = useSelector(selectHrPolicyPreview);
  const historyLogs = useSelector(selectHrPolicyHistory);
  const impactData = useSelector(selectHrPolicyImpact);
  const isLoading = useSelector(selectHrPoliciesLoading);

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const [isSaving, setIsSaving] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isImpactModalOpen, setIsImpactModalOpen] = useState(false);

  // Clean Form State with ZERO Hardcoded Business Defaults
  const [form, setForm] = useState({
    probationMonths: "",
    noticePeriodDays: "",
    minHalfDayHours: "",
    minFullDayHours: "",
    defaultShiftStartTime: "",
    defaultShiftEndTime: "",
    defaultBreakStartTime: "",
    defaultBreakEndTime: "",
    defaultBreakMinutes: "",
    lateMarkGraceMinutes: "",
    monthlyLateThreshold: "",
    halfDayAfterTime: "",
    absentAfterTime: "",
    checkoutGraceMinutes: "",
    allowAttendanceCorrection: true,
    weeklyOffDays: [0, 6],
    autoCheckoutTime: "",
    overtimeStartAfter: "",
    maxCorrectionDays: "",
    latePenaltyAction: "HALF_DAY",
    missedCheckoutAction: "AUTO_CHECKOUT",
    geofencingRequired: false,
    selfieRequired: false,
    deviceRestriction: true,
    sandwichPolicyAllowed: false,
    holidayBetweenLeave: true,
    weeklyOffBetweenLeave: true,
  });

  // Populate form ONLY from backend policy response and normalize numeric database strings
  useEffect(() => {
    if (currentPolicy && currentPolicy.id) {
      setForm({
        probationMonths:
          currentPolicy.probationPeriodDays != null
            ? String(Math.floor(Number(currentPolicy.probationPeriodDays) / 30))
            : "",
        noticePeriodDays:
          currentPolicy.defaultNoticePeriodDays != null
            ? String(Number(currentPolicy.defaultNoticePeriodDays))
            : "",
        minHalfDayHours:
          currentPolicy.minHoursForHalfDay != null
            ? String(Number(currentPolicy.minHoursForHalfDay))
            : "",
        minFullDayHours:
          currentPolicy.minHoursForPresent != null
            ? String(Number(currentPolicy.minHoursForPresent))
            : "",
        defaultShiftStartTime: currentPolicy.defaultShiftStartTime || "",
        defaultShiftEndTime: currentPolicy.defaultShiftEndTime || "",
        defaultBreakStartTime: currentPolicy.defaultBreakStartTime || "",
        defaultBreakEndTime: currentPolicy.defaultBreakEndTime || "",
        defaultBreakMinutes:
          currentPolicy.defaultBreakMinutes != null
            ? String(Number(currentPolicy.defaultBreakMinutes))
            : "",
        lateMarkGraceMinutes:
          currentPolicy.lateComingGraceMinutes != null
            ? String(Number(currentPolicy.lateComingGraceMinutes))
            : "",
        monthlyLateThreshold:
          currentPolicy.monthlyLateThreshold != null
            ? String(Number(currentPolicy.monthlyLateThreshold))
            : "",
        halfDayAfterTime: currentPolicy.halfDayAfterTime || "",
        absentAfterTime: currentPolicy.absentAfterTime || "",
        checkoutGraceMinutes:
          currentPolicy.checkoutGraceMinutes != null
            ? String(Number(currentPolicy.checkoutGraceMinutes))
            : "",
        allowAttendanceCorrection:
          currentPolicy.allowAttendanceCorrection ?? true,
        weeklyOffDays: Array.isArray(currentPolicy.weeklyOffDays)
          ? currentPolicy.weeklyOffDays.map(Number)
          : [0, 6],
        autoCheckoutTime: currentPolicy.autoCheckoutTime || "",
        overtimeStartAfter:
          currentPolicy.overtimeStartAfter != null
            ? String(Number(currentPolicy.overtimeStartAfter))
            : "",
        maxCorrectionDays:
          currentPolicy.maxCorrectionDays != null
            ? String(Number(currentPolicy.maxCorrectionDays))
            : "",
        latePenaltyAction: currentPolicy.latePenaltyAction || "HALF_DAY",
        missedCheckoutAction: "AUTO_CHECKOUT",
        geofencingRequired: currentPolicy.geofencingRequired ?? false,
        selfieRequired: currentPolicy.selfieRequired ?? false,
        deviceRestriction: currentPolicy.deviceRestriction ?? true,
        sandwichPolicyAllowed: currentPolicy.sandwichPolicyAllowed ?? false,
        holidayBetweenLeave: currentPolicy.holidayBetweenLeave ?? true,
        weeklyOffBetweenLeave: currentPolicy.weeklyOffBetweenLeave ?? true,
      });
    } else {
      setForm({
        probationMonths: "",
        noticePeriodDays: "",
        minHalfDayHours: "",
        minFullDayHours: "",
        defaultShiftStartTime: "",
        defaultShiftEndTime: "",
        defaultBreakStartTime: "",
        defaultBreakEndTime: "",
        defaultBreakMinutes: "",
        lateMarkGraceMinutes: "",
        monthlyLateThreshold: "",
        halfDayAfterTime: "",
        absentAfterTime: "",
        checkoutGraceMinutes: "",
        allowAttendanceCorrection: true,
        weeklyOffDays: [0, 6],
        autoCheckoutTime: "",
        overtimeStartAfter: "",
        maxCorrectionDays: "",
        latePenaltyAction: "HALF_DAY",
        missedCheckoutAction: "AUTO_CHECKOUT",
        geofencingRequired: false,
        selfieRequired: false,
        deviceRestriction: true,
        sandwichPolicyAllowed: false,
        holidayBetweenLeave: true,
        weeklyOffBetweenLeave: true,
      });
    }
  }, [currentPolicy]);

  useEffect(() => {
    if (activeCompanyId && hasAccess) {
      dispatch(fetchCompanyHrPolicies());
      dispatch(fetchCompanyHrPolicyHistory());
      dispatch(fetchCompanyHrPolicyImpact());
    }
  }, [dispatch, activeCompanyId, hasAccess]);

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-lg mx-auto my-12">
        <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mb-4">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
        <p className="text-sm text-slate-500 max-w-sm mb-6">
          You do not have permission (<code className="font-semibold text-rose-600">hrpolicy:read</code>) to access the HR Policy Management page.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl transition-all cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Request backend AttendancePolicyEngineService to evaluate preview DTO whenever form draft changes!
  useEffect(() => {
    if (form.defaultShiftStartTime && form.defaultShiftEndTime) {
      dispatch(fetchCompanyHrPolicyPreview(form));
    }
  }, [
    dispatch,
    form.defaultShiftStartTime,
    form.defaultShiftEndTime,
    form.defaultBreakStartTime,
    form.defaultBreakEndTime,
    form.defaultBreakMinutes,
    form.lateMarkGraceMinutes,
    form.monthlyLateThreshold,
    form.halfDayAfterTime,
    form.absentAfterTime,
    form.minFullDayHours,
    form.latePenaltyAction,
    form.checkoutGraceMinutes,
    form.weeklyOffDays,
  ]);

  // Real-time Policy Validation Engine
  const validationErrors = useMemo(() => {
    const errs = {};

    if (form.defaultShiftStartTime && form.defaultShiftEndTime) {
      const [sH, sM] = form.defaultShiftStartTime.split(":").map(Number);
      const [eH, eM] = form.defaultShiftEndTime.split(":").map(Number);
      if (eH * 60 + eM <= sH * 60 + sM) {
        errs.shiftTime = "Office End time must be after Office Start time.";
      }
    }

    if (form.defaultBreakStartTime && form.defaultBreakEndTime) {
      const [bSH, bSM] = form.defaultBreakStartTime.split(":").map(Number);
      const [bEH, bEM] = form.defaultBreakEndTime.split(":").map(Number);
      if (bEH * 60 + bEM <= bSH * 60 + bSM) {
        errs.breakTime = "Break End time must be after Break Start time.";
      }
    }

    if (form.halfDayAfterTime && form.absentAfterTime) {
      const [hH, hM] = form.halfDayAfterTime.split(":").map(Number);
      const [aH, aM] = form.absentAfterTime.split(":").map(Number);
      if (aH * 60 + aM <= hH * 60 + hM) {
        errs.thresholdTime = "Check-in After (Half Day) must occur before Check-in After (Absent).";
      }
    }

    const grossShiftHours = policyPreview?.grossShiftHours;
    if (
      form.minFullDayHours &&
      grossShiftHours !== null &&
      grossShiftHours !== undefined &&
      Number(form.minFullDayHours) > grossShiftHours
    ) {
      errs.minHours = `Required Full Day hours (${form.minFullDayHours}h) cannot exceed total shift gross duration (${grossShiftHours}h).`;
    }

    return errs;
  }, [
    form.defaultShiftStartTime,
    form.defaultShiftEndTime,
    form.defaultBreakStartTime,
    form.defaultBreakEndTime,
    form.halfDayAfterTime,
    form.absentAfterTime,
    form.minFullDayHours,
    policyPreview?.grossShiftHours,
  ]);

  const isValid = Object.keys(validationErrors).length === 0;

  // Normalized Dirty state tracking comparing numeric values against current stored policy
  const isDirty = useMemo(() => {
    if (!currentPolicy || !currentPolicy.id) {
      return (
        Boolean(form.defaultShiftStartTime) ||
        Boolean(form.defaultShiftEndTime) ||
        Boolean(form.minFullDayHours) ||
        Boolean(form.probationMonths)
      );
    }

    const isNumDiff = (formVal, policyVal) => {
      if ((formVal === "" || formVal === null || formVal === undefined) && (policyVal === null || policyVal === undefined)) {
        return false;
      }
      return Number(formVal) !== Number(policyVal);
    };

    return (
      isNumDiff(
        form.probationMonths,
        currentPolicy.probationPeriodDays != null ? Math.floor(currentPolicy.probationPeriodDays / 30) : null
      ) ||
      isNumDiff(form.noticePeriodDays, currentPolicy.defaultNoticePeriodDays) ||
      isNumDiff(form.minHalfDayHours, currentPolicy.minHoursForHalfDay) ||
      isNumDiff(form.minFullDayHours, currentPolicy.minHoursForPresent) ||
      form.defaultShiftStartTime !== (currentPolicy.defaultShiftStartTime || "") ||
      form.defaultShiftEndTime !== (currentPolicy.defaultShiftEndTime || "") ||
      form.defaultBreakStartTime !== (currentPolicy.defaultBreakStartTime || "") ||
      form.defaultBreakEndTime !== (currentPolicy.defaultBreakEndTime || "") ||
      isNumDiff(form.lateMarkGraceMinutes, currentPolicy.lateComingGraceMinutes) ||
      isNumDiff(form.monthlyLateThreshold, currentPolicy.monthlyLateThreshold) ||
      form.halfDayAfterTime !== (currentPolicy.halfDayAfterTime || "") ||
      form.absentAfterTime !== (currentPolicy.absentAfterTime || "") ||
      isNumDiff(form.checkoutGraceMinutes, currentPolicy.checkoutGraceMinutes) ||
      Boolean(form.allowAttendanceCorrection) !== Boolean(currentPolicy.allowAttendanceCorrection) ||
      form.autoCheckoutTime !== (currentPolicy.autoCheckoutTime || "") ||
      isNumDiff(form.overtimeStartAfter, currentPolicy.overtimeStartAfter) ||
      isNumDiff(form.maxCorrectionDays, currentPolicy.maxCorrectionDays) ||
      form.latePenaltyAction !== (currentPolicy.latePenaltyAction || "HALF_DAY") ||
      Boolean(form.geofencingRequired) !== Boolean(currentPolicy.geofencingRequired ?? false) ||
      Boolean(form.selfieRequired) !== Boolean(currentPolicy.selfieRequired ?? false) ||
      Boolean(form.deviceRestriction) !== Boolean(currentPolicy.deviceRestriction ?? true) ||
      JSON.stringify(form.weeklyOffDays) !== JSON.stringify(currentPolicy.weeklyOffDays ?? [0, 6])
    );
  }, [form, currentPolicy]);

  const toggleWeeklyOffDay = (dayValue) => {
    if (!canUpdate) return;
    const currentOffs = form.weeklyOffDays || [];
    let updated;
    if (currentOffs.includes(dayValue)) {
      updated = currentOffs.filter((d) => d !== dayValue);
    } else {
      updated = [...currentOffs, dayValue].sort();
    }
    setForm((prev) => ({ ...prev, weeklyOffDays: updated }));
  };

  const handleResetForm = () => {
    if (currentPolicy && currentPolicy.id) {
      setForm({
        probationMonths:
          currentPolicy.probationPeriodDays != null
            ? String(Math.floor(Number(currentPolicy.probationPeriodDays) / 30))
            : "",
        noticePeriodDays:
          currentPolicy.defaultNoticePeriodDays != null
            ? String(Number(currentPolicy.defaultNoticePeriodDays))
            : "",
        minHalfDayHours:
          currentPolicy.minHoursForHalfDay != null
            ? String(Number(currentPolicy.minHoursForHalfDay))
            : "",
        minFullDayHours:
          currentPolicy.minHoursForPresent != null
            ? String(Number(currentPolicy.minHoursForPresent))
            : "",
        defaultShiftStartTime: currentPolicy.defaultShiftStartTime || "",
        defaultShiftEndTime: currentPolicy.defaultShiftEndTime || "",
        defaultBreakStartTime: currentPolicy.defaultBreakStartTime || "",
        defaultBreakEndTime: currentPolicy.defaultBreakEndTime || "",
        defaultBreakMinutes:
          currentPolicy.defaultBreakMinutes != null
            ? String(Number(currentPolicy.defaultBreakMinutes))
            : "",
        lateMarkGraceMinutes:
          currentPolicy.lateComingGraceMinutes != null
            ? String(Number(currentPolicy.lateComingGraceMinutes))
            : "",
        monthlyLateThreshold:
          currentPolicy.monthlyLateThreshold != null
            ? String(Number(currentPolicy.monthlyLateThreshold))
            : "",
        halfDayAfterTime: currentPolicy.halfDayAfterTime || "",
        absentAfterTime: currentPolicy.absentAfterTime || "",
        checkoutGraceMinutes:
          currentPolicy.checkoutGraceMinutes != null
            ? String(Number(currentPolicy.checkoutGraceMinutes))
            : "",
        allowAttendanceCorrection: currentPolicy.allowAttendanceCorrection ?? true,
        weeklyOffDays: currentPolicy.weeklyOffDays ?? [0, 6],
        autoCheckoutTime: currentPolicy.autoCheckoutTime || "",
        overtimeStartAfter:
          currentPolicy.overtimeStartAfter != null
            ? String(Number(currentPolicy.overtimeStartAfter))
            : "",
        maxCorrectionDays:
          currentPolicy.maxCorrectionDays != null
            ? String(Number(currentPolicy.maxCorrectionDays))
            : "",
        latePenaltyAction: currentPolicy.latePenaltyAction || "HALF_DAY",
        missedCheckoutAction: "AUTO_CHECKOUT",
        geofencingRequired: false,
        selfieRequired: false,
        deviceRestriction: true,
        sandwichPolicyAllowed: false,
        holidayBetweenLeave: true,
        weeklyOffBetweenLeave: true,
      });
      showToast("Reset form draft to active database policy", "info");
    } else {
      setForm({
        probationMonths: "",
        noticePeriodDays: "",
        retirementAge: "",
        minHalfDayHours: "",
        minFullDayHours: "",
        defaultShiftStartTime: "",
        defaultShiftEndTime: "",
        defaultBreakStartTime: "",
        defaultBreakEndTime: "",
        defaultBreakMinutes: "",
        lateMarkGraceMinutes: "",
        monthlyLateThreshold: "",
        halfDayAfterTime: "",
        absentAfterTime: "",
        checkoutGraceMinutes: "",
        allowAttendanceCorrection: true,
        weeklyOffDays: [0, 6],
        autoCheckoutTime: "",
        overtimeStartAfter: "",
        maxCorrectionDays: "",
        latePenaltyAction: "HALF_DAY",
        missedCheckoutAction: "AUTO_CHECKOUT",
        geofencingRequired: false,
        selfieRequired: false,
        deviceRestriction: true,
        sandwichPolicyAllowed: false,
        holidayBetweenLeave: true,
        weeklyOffBetweenLeave: true,
      });
      showToast("Cleared form draft", "info");
    }
  };

  const handleConfirmDeploy = async ({ effectiveOption, customDate }) => {
    setIsSaving(true);
    try {
      const payload = {
        defaultShiftStartTime: form.defaultShiftStartTime || undefined,
        defaultShiftEndTime: form.defaultShiftEndTime || undefined,
        defaultBreakStartTime: form.defaultBreakStartTime || undefined,
        defaultBreakEndTime: form.defaultBreakEndTime || undefined,
        defaultBreakMinutes: form.defaultBreakMinutes ? Number(form.defaultBreakMinutes) : undefined,
        probationPeriodDays: form.probationMonths ? Number(form.probationMonths) * 30 : undefined,
        defaultNoticePeriodDays: form.noticePeriodDays ? Number(form.noticePeriodDays) : undefined,
        minHoursForHalfDay: form.minHalfDayHours ? Number(form.minHalfDayHours) : undefined,
        minHoursForPresent: form.minFullDayHours ? Number(form.minFullDayHours) : undefined,
        lateComingGraceMinutes: form.lateMarkGraceMinutes ? Number(form.lateMarkGraceMinutes) : undefined,
        monthlyLateThreshold: form.monthlyLateThreshold ? Number(form.monthlyLateThreshold) : undefined,
        halfDayAfterTime: form.halfDayAfterTime || undefined,
        absentAfterTime: form.absentAfterTime || undefined,
        checkoutGraceMinutes: form.checkoutGraceMinutes ? Number(form.checkoutGraceMinutes) : undefined,
        allowAttendanceCorrection: Boolean(form.allowAttendanceCorrection),
        weeklyOffDays: form.weeklyOffDays,
        autoCheckoutTime: form.autoCheckoutTime || undefined,
        overtimeStartAfter: form.overtimeStartAfter ? Number(form.overtimeStartAfter) : undefined,
        maxCorrectionDays: form.maxCorrectionDays ? Number(form.maxCorrectionDays) : undefined,
        latePenaltyAction: form.latePenaltyAction,
      };
      await dispatch(upsertCompanyHrPolicies(payload)).unwrap();
      await dispatch(fetchCompanyHrPolicies()).unwrap();
      dispatch(fetchCompanyHrPolicyHistory());
      dispatch(fetchCompanyHrPolicyImpact());
      if (form.defaultShiftStartTime && form.defaultShiftEndTime) {
        dispatch(fetchCompanyHrPolicyPreview(form));
      }
      setIsImpactModalOpen(false);
      showToast("Company HR Policy deployed successfully", "success");
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
        <p className="text-xs font-semibold text-gray-400">Loading Enterprise Policies...</p>
      </div>
    );
  }

  const isConfigured = Boolean(currentPolicy && currentPolicy.id);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1536px] mx-auto space-y-6 pb-28">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[150] flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-xs font-bold text-white transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${
            toast.type === "error"
              ? "bg-red-500"
              : toast.type === "info"
              ? "bg-slate-800"
              : "bg-emerald-600"
          }`}
        >
          {toast.type === "error" ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          {toast.msg}
        </div>
      )}

      {/* Clean Enterprise Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl border border-gray-100 p-6 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-blue-50 text-[#007aff]">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                HR & Attendance Governance
              </h1>
              <span
                className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                  isConfigured
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {isConfigured ? "Policy Active" : "Unconfigured"}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Enterprise attendance policy engine & governance controls.
            </p>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsHistoryOpen(true)}
            className="px-4 py-2.5 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
          >
            <History className="h-4 w-4 text-[#007aff]" />
            Audit History ({historyLogs?.length || 0})
          </button>
        </div>
      </div>

      {/* Unconfigured Alert */}
      {!isConfigured && (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-4 flex items-start gap-3 text-amber-800 shadow-xs">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs font-semibold">
            <p className="font-bold text-sm text-amber-900 mb-0.5">Company HR Policy Not Configured</p>
            <p className="font-medium text-amber-800">
              No HR Policy is currently saved in the database for this company. Set shift and attendance rules below and deploy.
            </p>
          </div>
        </div>
      )}

      {/* Validation Errors Global Banner */}
      {!isValid && (
        <div className="bg-red-50/70 border border-red-200/80 rounded-3xl p-4 flex items-start gap-3 text-red-800 shadow-xs">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs font-semibold space-y-1">
            <p className="font-bold text-sm text-red-900">Policy Validation Errors</p>
            {Object.values(validationErrors).map((msg, idx) => (
              <p key={idx} className="font-medium">• {msg}</p>
            ))}
          </div>
        </div>
      )}

      {/* Responsive Grid: Left Form Cards (7 Cols) & Right Sticky Panel (5 Cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Section Cards */}
        <div className="xl:col-span-7 space-y-6">
          {/* Section 1: Employment Rules */}
          <div className="bg-white rounded-3xl border border-gray-100/90 shadow-xs relative">
            <div className="p-5 border-b border-gray-100 bg-gray-50/40 flex items-center justify-between rounded-t-3xl">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#007aff]" />
                <h2 className="text-sm font-extrabold text-gray-900">Employment Rules</h2>
              </div>
              <span className="text-[11px] text-gray-400 font-medium">Core Tenure Limits</span>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                  Probation Period (Months)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    disabled={!canUpdate}
                    placeholder="e.g. 3"
                    value={form.probationMonths}
                    onChange={(e) => setForm((prev) => ({ ...prev, probationMonths: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-100 focus:border-[#007aff] outline-none text-gray-800 disabled:bg-gray-50"
                  />
                  <span className="absolute right-3 top-2.5 text-[11px] font-bold text-gray-400">
                    Months
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                  Notice Period (Days)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    disabled={!canUpdate}
                    placeholder="e.g. 30"
                    value={form.noticePeriodDays}
                    onChange={(e) => setForm((prev) => ({ ...prev, noticePeriodDays: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-100 focus:border-[#007aff] outline-none text-gray-800 disabled:bg-gray-50"
                  />
                  <span className="absolute right-3 top-2.5 text-[11px] font-bold text-gray-400">
                    Days
                  </span>
                </div>
              </div>


            </div>
          </div>

          {/* Section 2: Working Schedule */}
          <div className="bg-white rounded-3xl border border-gray-100/90 shadow-xs relative">
            <div className="p-5 border-b border-gray-100 bg-gray-50/40 flex items-center justify-between rounded-t-3xl">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#007aff]" />
                <h2 className="text-sm font-extrabold text-gray-900">Working Schedule</h2>
              </div>
              {policyPreview?.grossShiftHours !== null &&
                policyPreview?.grossShiftHours !== undefined && (
                  <span className="text-xs font-bold text-[#007aff] bg-blue-50 px-3 py-1 rounded-full border border-blue-100/60 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    Gross: {policyPreview.grossShiftHours}h | Net: {policyPreview.netWorkingHours}h
                  </span>
                )}
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <EnterpriseTimePicker
                  label="Office Start Time"
                  disabled={!canUpdate}
                  value={form.defaultShiftStartTime}
                  onChange={(val) => setForm((prev) => ({ ...prev, defaultShiftStartTime: val }))}
                  error={validationErrors.shiftTime}
                />

                <EnterpriseTimePicker
                  label="Office End Time"
                  disabled={!canUpdate}
                  value={form.defaultShiftEndTime}
                  onChange={(val) => setForm((prev) => ({ ...prev, defaultShiftEndTime: val }))}
                  error={validationErrors.shiftTime}
                />
              </div>

              <div className="border-t border-gray-100 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <EnterpriseTimePicker
                  label="Break Start Time"
                  disabled={!canUpdate}
                  value={form.defaultBreakStartTime}
                  onChange={(val) => setForm((prev) => ({ ...prev, defaultBreakStartTime: val }))}
                  error={validationErrors.breakTime}
                />

                <EnterpriseTimePicker
                  label="Break End Time"
                  disabled={!canUpdate}
                  value={form.defaultBreakEndTime}
                  onChange={(val) => setForm((prev) => ({ ...prev, defaultBreakEndTime: val }))}
                  error={validationErrors.breakTime}
                />

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                    Break Duration
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      readOnly
                      disabled
                      placeholder="Auto-calculated"
                      value={policyPreview?.breakMinutes ?? form.defaultBreakMinutes}
                      className="w-full border border-gray-200 bg-slate-50/70 rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-800 cursor-not-allowed"
                    />
                    <span className="absolute right-3 top-2.5 text-[11px] font-bold text-[#007aff] bg-blue-50 px-1.5 py-0.5 rounded">
                      Engine
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Attendance Rules */}
          <div className="bg-white rounded-3xl border border-gray-100/90 shadow-xs relative">
            <div className="p-5 border-b border-gray-100 bg-gray-50/40 flex items-center justify-between rounded-t-3xl">
              <div className="flex items-center gap-2">
                <Sliders className="h-5 w-5 text-[#007aff]" />
                <h2 className="text-sm font-extrabold text-gray-900">Attendance Rules</h2>
              </div>
              <span className="text-[11px] text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Lock className="h-3 w-3" />
                Evaluation Rules
              </span>
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                  Required Full Day Hours
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    disabled={!canUpdate}
                    placeholder="e.g. 8"
                    value={form.minFullDayHours}
                    onChange={(e) => setForm((prev) => ({ ...prev, minFullDayHours: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-100 focus:border-[#007aff] outline-none text-gray-800 disabled:bg-gray-50"
                  />
                  <span className="absolute right-3 top-2.5 text-[11px] font-bold text-gray-400">
                    Hours
                  </span>
                </div>
                {validationErrors.minHours && (
                  <p className="text-[11px] font-semibold text-red-500 mt-1">
                    {validationErrors.minHours}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                  Required Half Day Hours
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    disabled={!canUpdate}
                    placeholder="e.g. 4"
                    value={form.minHalfDayHours}
                    onChange={(e) => setForm((prev) => ({ ...prev, minHalfDayHours: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-100 focus:border-[#007aff] outline-none text-gray-800 disabled:bg-gray-50"
                  />
                  <span className="absolute right-3 top-2.5 text-[11px] font-bold text-gray-400">
                    Hours
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                  Late Grace (Mins)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    disabled={!canUpdate}
                    placeholder="e.g. 5"
                    value={form.lateMarkGraceMinutes}
                    onChange={(e) => setForm((prev) => ({ ...prev, lateMarkGraceMinutes: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-100 focus:border-[#007aff] outline-none text-gray-800 disabled:bg-gray-50"
                  />
                  <span className="absolute right-3 top-2.5 text-[11px] font-bold text-gray-400">
                    Mins
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                  Early Checkout Grace
                </label>
                <div className="relative">
                  <input
                    type="number"
                    disabled={!canUpdate}
                    placeholder="e.g. 5"
                    value={form.checkoutGraceMinutes}
                    onChange={(e) => setForm((prev) => ({ ...prev, checkoutGraceMinutes: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-100 focus:border-[#007aff] outline-none text-gray-800 disabled:bg-gray-50"
                  />
                  <span className="absolute right-3 top-2.5 text-[11px] font-bold text-gray-400">
                    Mins
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                  Allowed Late Marks / Month
                </label>
                <input
                  type="number"
                  disabled={!canUpdate}
                  placeholder="e.g. 3"
                  value={form.monthlyLateThreshold}
                  onChange={(e) => setForm((prev) => ({ ...prev, monthlyLateThreshold: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-100 focus:border-[#007aff] outline-none text-gray-800 disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                  Late Penalty Action
                </label>
                <select
                  disabled={!canUpdate}
                  value={form.latePenaltyAction}
                  onChange={(e) => setForm((prev) => ({ ...prev, latePenaltyAction: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-100 focus:border-[#007aff] outline-none text-gray-800 disabled:bg-gray-50 bg-white"
                >
                  <option value="HALF_DAY">Half Day Deduction</option>
                  <option value="WARNING">Official Warning Flag</option>
                  <option value="SALARY_DEDUCTION">Salary Deduction (Hour-Based)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Penalty Rules */}
          <div className="bg-white rounded-3xl border border-gray-100/90 shadow-xs relative">
            <div className="p-5 border-b border-gray-100 bg-gray-50/40 flex items-center justify-between rounded-t-3xl">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-[#007aff]" />
                <h2 className="text-sm font-extrabold text-gray-900">Penalty Cutoffs</h2>
              </div>
              <span className="text-[11px] text-gray-400 font-medium">Automatic Status Boundaries</span>
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <EnterpriseTimePicker
                label="Check-in After (Half Day)"
                disabled={!canUpdate}
                value={form.halfDayAfterTime}
                onChange={(val) => setForm((prev) => ({ ...prev, halfDayAfterTime: val }))}
                error={validationErrors.thresholdTime}
              />

              <EnterpriseTimePicker
                label="Check-in After (Absent)"
                disabled={!canUpdate}
                value={form.absentAfterTime}
                onChange={(val) => setForm((prev) => ({ ...prev, absentAfterTime: val }))}
                error={validationErrors.thresholdTime}
              />

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                  Attendance Correction
                </label>
                <select
                  disabled={!canUpdate}
                  value={form.allowAttendanceCorrection ? "true" : "false"}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, allowAttendanceCorrection: e.target.value === "true" }))
                  }
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-100 focus:border-[#007aff] outline-none text-gray-800 disabled:bg-gray-50 bg-white"
                >
                  <option value="true">Allowed (Manager Approval)</option>
                  <option value="false">Disabled globally</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 5: Enterprise Controls with Zoho/iOS Style Toggle Switches */}
          <div className="bg-white rounded-3xl border border-gray-100/90 shadow-xs relative">
            <div className="p-5 border-b border-gray-100 bg-gray-50/40 flex items-center justify-between rounded-t-3xl">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-[#007aff]" />
                <h2 className="text-sm font-extrabold text-gray-900">Enterprise Controls</h2>
              </div>
              <span className="text-[11px] text-gray-400 font-medium">Security & Automation</span>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <EnterpriseTimePicker
                  label="Auto Checkout Time"
                  disabled={!canUpdate}
                  value={form.autoCheckoutTime}
                  onChange={(val) => setForm((prev) => ({ ...prev, autoCheckoutTime: val }))}
                  hint="Automatic checkout for open sessions"
                />

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                    Overtime Starts After
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      disabled={!canUpdate}
                      placeholder="e.g. 0"
                      value={form.overtimeStartAfter}
                      onChange={(e) => setForm((prev) => ({ ...prev, overtimeStartAfter: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-100 focus:border-[#007aff] outline-none text-gray-800 disabled:bg-gray-50"
                    />
                    <span className="absolute right-3 top-2.5 text-[11px] font-bold text-gray-400">
                      Mins
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                    Max Correction Days
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      disabled={!canUpdate}
                      placeholder="e.g. 30"
                      value={form.maxCorrectionDays}
                      onChange={(e) => setForm((prev) => ({ ...prev, maxCorrectionDays: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-100 focus:border-[#007aff] outline-none text-gray-800 disabled:bg-gray-50"
                    />
                    <span className="absolute right-3 top-2.5 text-[11px] font-bold text-gray-400">
                      Days
                    </span>
                  </div>
                </div>
              </div>

              {/* Zoho/iOS Style Toggle Switch Grid */}
              <div className="border-t border-gray-100 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-200/80 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-50 text-[#007aff]">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-gray-900">Geo-fencing</span>
                      <span className="block text-[10px] text-gray-500 font-medium">GPS location check</span>
                    </div>
                  </div>
                  <ToggleSwitch
                    enabled={form.geofencingRequired}
                    onChange={(val) => setForm((prev) => ({ ...prev, geofencingRequired: val }))}
                    disabled={!canUpdate}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-200/80 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-50 text-[#007aff]">
                      <Camera className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-gray-900">Selfie Verification</span>
                      <span className="block text-[10px] text-gray-500 font-medium">Face check-in required</span>
                    </div>
                  </div>
                  <ToggleSwitch
                    enabled={form.selfieRequired}
                    onChange={(val) => setForm((prev) => ({ ...prev, selfieRequired: val }))}
                    disabled={!canUpdate}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-200/80 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-50 text-[#007aff]">
                      <Smartphone className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-gray-900">Device Restriction</span>
                      <span className="block text-[10px] text-gray-500 font-medium">Bound to registered device</span>
                    </div>
                  </div>
                  <ToggleSwitch
                    enabled={form.deviceRestriction}
                    onChange={(val) => setForm((prev) => ({ ...prev, deviceRestriction: val }))}
                    disabled={!canUpdate}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: Zoho-Style Weekly Off Schedule */}
          <div className="bg-white rounded-3xl border border-gray-100/90 shadow-xs relative">
            <div className="p-5 border-b border-gray-100 bg-gray-50/40 flex items-center justify-between rounded-t-3xl">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#007aff]" />
                <h2 className="text-sm font-extrabold text-gray-900">Weekly Off Schedule</h2>
              </div>
              <span className="text-[11px] text-gray-400 font-medium">Non-working Days</span>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-gray-500 font-medium">
                Designated weekly off days automatically bypass attendance checks and late mark penalties.
              </p>

              {/* Zoho Style Large Pill Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-7 gap-2.5">
                {DAYS_OF_WEEK.map((day) => {
                  const isSelected = (form.weeklyOffDays || []).includes(day.value);
                  return (
                    <button
                      key={day.value}
                      type="button"
                      disabled={!canUpdate}
                      onClick={() => toggleWeeklyOffDay(day.value)}
                      className={`py-3.5 px-3 rounded-2xl text-xs transition-all border cursor-pointer flex flex-col items-center gap-1 ${
                        isSelected
                          ? "bg-[#007aff] text-white border-[#007aff] shadow-md shadow-blue-500/20 font-extrabold"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 font-semibold"
                      } disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      <span className="text-sm tracking-wide">{day.label}</span>
                      <span
                        className={`text-[9px] uppercase tracking-wider ${
                          isSelected ? "text-blue-100 font-bold" : "text-gray-400 font-medium"
                        }`}
                      >
                        {day.full.slice(0, 3)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Policy Preview Panel & Governance Widgets (5 Cols) */}
        <div className="xl:col-span-5 space-y-6">
          {/* Policy Engine Evaluation Panel */}
          <PolicyPreviewPanel preview={policyPreview} />

          {/* Dedicated Governance Audit & Version Card (Point 6 & Point 11) */}
          <div className="bg-white rounded-3xl border border-gray-100/90 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-[#007aff]">
                  <History className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-gray-900">Governance & Audit</h3>
                  <p className="text-[11px] text-gray-400 font-medium">Database policy snapshot status</p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                {isConfigured ? "v1.0 Active" : "Draft"}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/80 border border-gray-100">
                <span className="text-gray-500 font-medium">Last Updated</span>
                <span className="font-bold text-gray-900">
                  {currentPolicy?.updatedAt
                    ? new Date(currentPolicy.updatedAt).toLocaleString()
                    : "No policy saved yet"}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/80 border border-gray-100">
                <span className="text-gray-500 font-medium">Updated By</span>
                <div className="flex items-center gap-1.5 font-bold text-gray-900">
                  <User className="h-3.5 w-3.5 text-[#007aff]" />
                  <span>
                    {currentPolicy?.updater?.name
                      ? currentPolicy.updater.name
                      : currentPolicy?.updatedBy
                      ? `User #${currentPolicy.updatedBy}`
                      : "System Initialized"}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsHistoryOpen(true)}
              className="w-full py-2.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 text-[#007aff] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>View Full Version History ({historyLogs?.length || 0})</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Real-time Headcount Scope Card */}
          <div className="bg-white rounded-3xl border border-gray-100/90 shadow-xs p-6 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-2xl bg-blue-50 text-[#007aff]">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Affected Headcount
                </span>
                <p className="text-sm font-extrabold text-gray-900 mt-0.5">
                  {impactData?.affectedEmployees !== null && impactData?.affectedEmployees !== undefined
                    ? `${impactData.affectedEmployees} Active Employees`
                    : "Evaluating Headcount..."}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-blue-50 text-[#007aff]">
              Active Scope
            </span>
          </div>
        </div>
      </div>

      {/* STICKY BOTTOM ACTION BAR FOR UNSAVED CHANGES (WHITE THEME) */}
      {isDirty && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl bg-white/95 text-gray-900 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-gray-200/80 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-6 duration-300">
          <div className="flex items-center gap-3 pl-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#007aff]" />
            </span>
            <div>
              <p className="text-xs font-extrabold text-gray-900">Unsaved Policy Changes</p>
              <p className="text-[11px] text-gray-500 font-medium">
                You have modified policy parameters in draft.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetForm}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!isValid || !canUpdate || isSaving}
              onClick={() => setIsImpactModalOpen(true)}
              className="px-6 py-2 rounded-xl text-xs font-bold bg-[#007aff] hover:bg-blue-600 text-white shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Version History Drawer */}
      <PolicyVersionHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        historyLogs={historyLogs}
        onRestoreVersion={(configSnapshot) => {
          if (configSnapshot) {
            setForm((prev) => ({
              ...prev,
              defaultShiftStartTime: configSnapshot.defaultShiftStartTime || "",
              defaultShiftEndTime: configSnapshot.defaultShiftEndTime || "",
              defaultBreakStartTime: configSnapshot.defaultBreakStartTime || "",
              defaultBreakEndTime: configSnapshot.defaultBreakEndTime || "",
              defaultBreakMinutes: configSnapshot.defaultBreakMinutes ?? "",
              lateMarkGraceMinutes: configSnapshot.lateComingGraceMinutes ?? "",
              monthlyLateThreshold: configSnapshot.monthlyLateThreshold ?? "",
              halfDayAfterTime: configSnapshot.halfDayAfterTime || "",
              absentAfterTime: configSnapshot.absentAfterTime || "",
              checkoutGraceMinutes: configSnapshot.checkoutGraceMinutes ?? "",
              minFullDayHours: configSnapshot.minHoursForPresent ?? "",
              minHalfDayHours: configSnapshot.minHoursForHalfDay ?? "",
              probationMonths: configSnapshot.probationPeriodDays
                ? String(Math.floor(configSnapshot.probationPeriodDays / 30))
                : "",
              noticePeriodDays: configSnapshot.defaultNoticePeriodDays ?? "",
              weeklyOffDays: configSnapshot.weeklyOffDays ?? [0, 6],
            }));
            showToast("Restored selected audit snapshot into form draft", "info");
          }
        }}
      />

      {/* Pre-save Impact Analysis Modal */}
      <PolicyImpactModal
        isOpen={isImpactModalOpen}
        onClose={() => setIsImpactModalOpen(false)}
        onConfirm={handleConfirmDeploy}
        currentPolicy={currentPolicy}
        newForm={form}
        impactData={impactData}
        isSaving={isSaving}
      />
    </div>
  );
}

export default function HrPoliciesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
          <p className="text-xs font-semibold text-gray-400">Loading Policies...</p>
        </div>
      }
    >
      <HrPoliciesContent />
    </Suspense>
  );
}
