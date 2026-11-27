"use client";

import React, { useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useMonthlySalesTarget } from "@/hooks/useMonthlySalesTarget";
import SetMonthlyTargetModal from "./SetMonthlyTargetModal";
import ConfirmMonthlyTargetModal from "./ConfirmMonthlyTargetModal";

/**
 * Full-screen gate for Sales role users.
 * Prevents the dashboard or any protected CRM view from rendering until
 * the current month's sales target has been entered, confirmed, and locked.
 */
export default function SalesMonthlyTargetGate({ children }) {
  const {
    isSales,
    currentPeriod,
    stats,
    hasTarget,
    isLoading,
    error,
    refetch,
    setTarget,
    isSaving,
  } = useMonthlySalesTarget();

  const [draftState, setDraftState] = useState({
    period: currentPeriod,
    isConfirmOpen: false,
    pendingTargetValue: null,
  });

  // Automatically clear stale draft state if the month rolls over on the 1st
  const isSamePeriod = draftState.period === currentPeriod;
  const isConfirmOpen = isSamePeriod ? draftState.isConfirmOpen : false;
  const pendingTargetValue = isSamePeriod ? draftState.pendingTargetValue : null;

  // Non-Sales users bypass the target gate completely
  if (!isSales) {
    return <>{children}</>;
  }

  // If backend rejects with 403 (role mismatch / non-sales on server), do not lock out user
  if (error?.response?.status === 403) {
    return <>{children}</>;
  }

  // Block dashboard rendering while verifying current month target status
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-[#f8f9fc]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
          <p className="text-sm text-gray-500 font-medium">
            Checking monthly target...
          </p>
        </div>
      </div>
    );
  }

  // If check fails due to network/server error, block dashboard and provide Retry
  if (error && !hasTarget) {
    return (
      <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-[#f8f9fc] p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md p-6 text-center space-y-4">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-900">
              Unable to Verify Monthly Target
            </h3>
            <p className="text-xs text-gray-500">
              Please check your connection and retry before accessing your dashboard.
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Target not entered & locked for the current month -> block dashboard completely
  if (!hasTarget) {
    const monthName =
      stats?.monthName ||
      new Date().toLocaleString("en-US", {
        month: "long",
        timeZone: "Asia/Kolkata",
      });
    const year =
      stats?.year ||
      Number(currentPeriod?.split("-")?.[0]) ||
      new Date().getFullYear();

    const handleProceedToConfirm = (val) => {
      setDraftState({
        period: currentPeriod,
        isConfirmOpen: true,
        pendingTargetValue: val,
      });
    };

    const handleBackToEdit = () => {
      setDraftState({
        period: currentPeriod,
        isConfirmOpen: false,
        pendingTargetValue,
      });
    };

    const handleConfirmSave = async () => {
      if (!pendingTargetValue) return;
      try {
        await setTarget({
          targetMT: pendingTargetValue,
          month: stats?.month,
          year: stats?.year,
        });
        setDraftState({
          period: currentPeriod,
          isConfirmOpen: false,
          pendingTargetValue: null,
        });
      } catch {
        // Error toast handled by mutation
      }
    };

    return (
      <div className="fixed inset-0 z-[9998] bg-[#f8f9fc] overflow-hidden">
        <SetMonthlyTargetModal
          key={`${currentPeriod}-${isConfirmOpen ? "confirm" : "edit"}`}
          isOpen={!isConfirmOpen}
          onProceedToConfirm={handleProceedToConfirm}
          monthName={monthName}
          year={year}
          initialValue={pendingTargetValue ?? ""}
        />
        <ConfirmMonthlyTargetModal
          isOpen={isConfirmOpen}
          onBack={handleBackToEdit}
          onConfirm={handleConfirmSave}
          targetValue={pendingTargetValue}
          monthName={monthName}
          year={year}
          isSubmitting={isSaving}
        />
      </div>
    );
  }

  // Target is set and permanently locked for this month -> allow dashboard access
  return <>{children}</>;
}
