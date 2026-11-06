"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { monthlyTargetApi } from "@/api/monthlyTarget.api";
import { useSalesRole } from "./useSalesRole";
import { getSocketInstance } from "@/lib/socket";
import { toast } from "sonner";

export const MONTHLY_TARGET_QUERY_KEY = ["monthly-sales-target"];

export function useMonthlySalesTarget() {
  const { isSales, user } = useSalesRole();
  const queryClient = useQueryClient();

  // 1. Fetch current monthly target and real-time dynamically calculated stats
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: MONTHLY_TARGET_QUERY_KEY,
    queryFn: async () => {
      const res = await monthlyTargetApi.getCurrent();
      return res.data;
    },
    enabled: !!isSales && !!user,
    staleTime: 1000 * 30, // 30 seconds
    refetchOnWindowFocus: true,
  });

  // 2. Real-time Socket & Window Event Subscriptions
  useEffect(() => {
    if (!isSales || !user) return;

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
  }, [isSales, user, queryClient]);

  // 3. Mutation to set target once (Locked permanently after save)
  const setTargetMutation = useMutation({
    mutationFn: async ({ targetMT, month, year }) => {
      const res = await monthlyTargetApi.create({ targetMT, month, year });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: MONTHLY_TARGET_QUERY_KEY });
      toast.success(
        `Monthly Target of ${data?.stats?.targetMT || ""} MT locked for ${data?.stats?.monthName || "this month"}.`
      );
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to set monthly target.";
      toast.error(msg);
    },
  });

  return {
    isSales,
    targetData: data?.target || null,
    stats: data?.stats || null,
    hasTarget: !!data?.hasTarget,
    isLoading: isLoading && isSales,
    isFetching,
    error,
    refetch,
    setTarget: setTargetMutation.mutateAsync,
    isSaving: setTargetMutation.isPending,
  };
}

export default useMonthlySalesTarget;

