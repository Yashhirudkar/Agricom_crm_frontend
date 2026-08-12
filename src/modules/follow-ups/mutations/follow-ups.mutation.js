import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FollowUpsAPI } from "../api/follow-ups.api";
import { FOLLOW_UP_QUERY_KEYS } from "../queries/follow-ups.query";
import { toast } from "sonner";

export const useCompleteFollowUpMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, ourResponse }) =>
      FollowUpsAPI.complete(id, { status, ourResponse }),
    onSuccess: (data, variables) => {
      toast.success("Follow-up marked as completed successfully!");
      // Immediately remove completed follow-up from reminders cache for zero-latency UI updates
      queryClient.setQueryData(FOLLOW_UP_QUERY_KEYS.reminders(), (old) => {
        if (!old) return old;
        return old.filter((item) => item.id !== variables.id);
      });
      // Invalidate all follow-up queries to update counts and tables
      queryClient.invalidateQueries({ queryKey: FOLLOW_UP_QUERY_KEYS.all });
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "Failed to complete follow-up";
      toast.error(msg);
    },
  });
};

export const useRescheduleFollowUpMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, nextFollowupDate, ourResponse }) =>
      FollowUpsAPI.reschedule(id, { nextFollowupDate, ourResponse }),
    onSuccess: (data) => {
      toast.success("Follow-up rescheduled successfully!");
      queryClient.invalidateQueries({ queryKey: FOLLOW_UP_QUERY_KEYS.all });
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "Failed to reschedule follow-up";
      toast.error(msg);
    },
  });
};
