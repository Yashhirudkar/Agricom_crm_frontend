import { useQuery } from "@tanstack/react-query";
import { FollowUpsAPI } from "../api/follow-ups.api";

export const FOLLOW_UP_QUERY_KEYS = {
  all: ["follow-ups"],
  stats: () => [...FOLLOW_UP_QUERY_KEYS.all, "stats"],
  list: (params) => [...FOLLOW_UP_QUERY_KEYS.all, "list", params],
  header: () => [...FOLLOW_UP_QUERY_KEYS.all, "header"],
  reminders: () => [...FOLLOW_UP_QUERY_KEYS.all, "reminders"],
};

export const useFollowUpStatsQuery = (enabled = true) => {
  return useQuery({
    queryKey: FOLLOW_UP_QUERY_KEYS.stats(),
    queryFn: () => FollowUpsAPI.getStats(),
    staleTime: 1000 * 30, // 30 seconds
    refetchOnWindowFocus: false,
    enabled,
  });
};

export const useFollowUpListQuery = (params) => {
  return useQuery({
    queryKey: FOLLOW_UP_QUERY_KEYS.list(params),
    queryFn: () => FollowUpsAPI.getList(params),
    staleTime: 1000 * 15, // 15 seconds
    refetchOnWindowFocus: false,
  });
};

export const useFollowUpHeaderQuery = (enabled = true) => {
  return useQuery({
    queryKey: FOLLOW_UP_QUERY_KEYS.header(),
    queryFn: () => FollowUpsAPI.getHeader(),
    staleTime: 1000 * 30, // 30 seconds
    refetchOnWindowFocus: false,
    enabled,
  });
};

export const useFollowUpRemindersQuery = (enabled = true) => {
  return useQuery({
    queryKey: FOLLOW_UP_QUERY_KEYS.reminders(),
    queryFn: () => FollowUpsAPI.getReminders(),
    refetchInterval: 30000, // Refetch every 30 seconds (tab inactive = pauses automatically)
    refetchOnWindowFocus: false,
    enabled,
  });
};
