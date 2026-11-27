"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { monthlyTargetApi } from "@/api/monthlyTarget.api";
import { useSalesRole } from "./useSalesRole";
import { getSocketInstance } from "@/lib/socket";
import { toast } from "sonner";

export const MONTHLY_TARGET_QUERY_KEY = ["monthly-sales-target"];

/**
 * Returns current YYYY-MM in IST ('Asia/Kolkata') so month rollovers on the
 * 1st of every month are detected immediately even if a tab stays open overnight.
 */
export function getCurrentISTPeriod() {
  try {
    return new Date()
      .toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
      .slice(0, 7);
  } catch {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }
}

const MonthlySalesTargetContext = createContext(null);

function useMonthlySalesTargetCore({ enabled = true } = {}) {
  const { isSales, user, activeCompanyId } = useSalesRole();
  const queryClient = useQueryClient();
  const [currentPeriod, setCurrentPeriod] = useState(getCurrentISTPeriod);
  const isActive = Boolean(enabled && isSales && user);

  // Detect 1st-of-month rollover even when the app stays open across midnight
  useEffect(() => {
    if (!isActive) return;

    const checkPeriodRollover = () => {
      const latest = getCurrentISTPeriod();
      setCurrentPeriod((prev) => (prev !== latest ? latest : prev));
    };

    checkPeriodRollover();
    const interval = setInterval(checkPeriodRollover, 30 * 1000);
    window.addEventListener("focus", checkPeriodRollover);
    document.addEventListener("visibilitychange", checkPeriodRollover);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", checkPeriodRollover);
      document.removeEventListener("visibilitychange", checkPeriodRollover);
    };
  }, [isActive]);

  const activeQueryKey = [
    ...MONTHLY_TARGET_QUERY_KEY,
    user?.id ?? null,
    activeCompanyId ?? null,
    currentPeriod,
  ];

  // 1. Fetch current monthly target and real-time dynamically calculated stats
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: activeQueryKey,
    queryFn: async () => {
      const res = await monthlyTargetApi.getCurrent();
      return res.data;
    },
    enabled: isActive,
    staleTime: 1000 * 30, // 30 seconds
    refetchOnWindowFocus: true,
    retry: 1,
  });

  // 2. Real-time Socket & Window Event Subscriptions
  useEffect(() => {
    if (!isActive) return;

    const socket = getSocketInstance();
    const handleTargetUpdated = (payload) => {
      console.log("[useMonthlySalesTarget] Target updated event received:", payload);
      queryClient.invalidateQueries({ queryKey: MONTHLY_TARGET_QUERY_KEY });
    };

    if (socket) {
      socket.on("sales-target:updated", handleTargetUpdated);
    }

    // Custom window event for local tab instantaneous synchronization
    const handleLocalContractChange = () => {
      console.log("[useMonthlySalesTarget] Local sales contract changed, refreshing target stats");
      queryClient.invalidateQueries({ queryKey: MONTHLY_TARGET_QUERY_KEY });
    };

    window.addEventListener("sales-contract-changed", handleLocalContractChange);

    return () => {
      if (socket) {
        socket.off("sales-target:updated", handleTargetUpdated);
      }
      window.removeEventListener("sales-contract-changed", handleLocalContractChange);
    };
  }, [isActive, queryClient]);

  // 3. Mutation to set target once (Locked permanently after save)
  const setTargetMutation = useMutation({
    mutationFn: async ({ targetMT, month, year }) => {
      const res = await monthlyTargetApi.create({ targetMT, month, year });
      return res.data;
    },
    onSuccess: (responseData) => {
      if (responseData) {
        queryClient.setQueryData(activeQueryKey, responseData);
      }
      queryClient.invalidateQueries({ queryKey: MONTHLY_TARGET_QUERY_KEY });
      toast.success(
        `Monthly Target of ${responseData?.stats?.targetMT || ""} MT locked for ${responseData?.stats?.monthName || "this month"}.`
      );
    },
    onError: (err) => {
      const status = err?.response?.status;
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to set monthly target.";
      if (status === 400 && String(msg).toLowerCase().includes("already been set")) {
        queryClient.invalidateQueries({ queryKey: MONTHLY_TARGET_QUERY_KEY });
      }
      toast.error(msg);
    },
  });

  const targetMT = Number(data?.stats?.targetMT ?? 0);
  const hasTarget = Boolean(
    data?.hasTarget && data?.target?.isLocked && Number.isFinite(targetMT) && targetMT > 0
  );

  return {
    isSales,
    currentPeriod,
    targetData: data?.target || null,
    stats: data?.stats || null,
    hasTarget,
    isLoading: enabled && isLoading && isSales,
    isFetching,
    error,
    refetch,
    setTarget: setTargetMutation.mutateAsync,
    isSaving: setTargetMutation.isPending,
  };
}

export function MonthlySalesTargetProvider({ children }) {
  const value = useMonthlySalesTargetCore({ enabled: true });
  return (
    <MonthlySalesTargetContext.Provider value={value}>
      {children}
    </MonthlySalesTargetContext.Provider>
  );
}

export function useMonthlySalesTarget() {
  const contextValue = useContext(MonthlySalesTargetContext);
  const fallbackValue = useMonthlySalesTargetCore({ enabled: !contextValue });
  return contextValue || fallbackValue;
}

export default useMonthlySalesTarget;
