/**
 * useInfiniteLeaveApprovals
 *
 * Custom hook for infinite-scroll + cursor-based pagination on the
 * Leave Approvals & Manager Analytics page.
 *
 * Uses @tanstack/react-query v5 useInfiniteQuery.
 * React Query is the single source of truth for this data — no Redux.
 *
 * Architecture:
 *   GET /leave-requests/paginated?tab=PENDING|HISTORY&cursor=&limit=30
 *   → { items: [...], pagination: { nextCursor, hasMore } }
 */

import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import axiosClient from "@/lib/axios";

const PAGE_SIZE = 30;

// ------------------------------------------------------------------ //
//  Fetch function
// ------------------------------------------------------------------ //

/**
 * Fetch one page of leave requests.
 * signal is provided by React Query for automatic request cancellation
 * when the query key changes (tab switch, company change, etc.)
 */
async function fetchLeaveRequestsPage({ pageParam, queryKey, signal }) {
  const [, tab, companyId] = queryKey;

  if (!companyId) {
    return { items: [], pagination: { nextCursor: null, hasMore: false } };
  }

  const params = {
    tab,
    limit: PAGE_SIZE,
    ...(pageParam ? { cursor: pageParam } : {}),
  };

  const res = await axiosClient.get("/leave-requests/paginated", {
    params,
    signal, // React Query passes AbortSignal automatically
  });

  return res.data;
}

// ------------------------------------------------------------------ //
//  Main infinite query hook
// ------------------------------------------------------------------ //

/**
 * @param {string} tab      - 'PENDING' | 'HISTORY'
 * @param {number|null} companyId - active company from Redux/context
 */
export function useInfiniteLeaveApprovals(tab, companyId) {
  const result = useInfiniteQuery({
    // Include tab + companyId in queryKey so switching either
    // resets and refetches automatically.
    queryKey: ["leave-approvals", tab, companyId],

    queryFn: fetchLeaveRequestsPage,

    // Extract the cursor for the NEXT page from the last fetched page.
    getNextPageParam: (lastPage) => {
      if (!lastPage?.pagination?.hasMore) return undefined;
      return lastPage.pagination.nextCursor ?? undefined;
    },

    // Only fetch when we have a valid companyId
    enabled: Boolean(companyId),

    // 30s before data is considered stale — avoids refetching on every
    // focus/mount while keeping data reasonably fresh.
    staleTime: 30_000,

    // Keep cached pages for 5 minutes after all consumers unmount.
    gcTime: 5 * 60_000,

    // Do NOT refetch on every window focus (this is a manager review
    // page — realtime is handled via socket invalidation below).
    refetchOnWindowFocus: false,
  });

  // Flatten all pages into a single array with useMemo to avoid
  // recalculating on every render.
  const items = useMemo(
    () => result.data?.pages.flatMap((page) => page.items ?? []) ?? [],
    [result.data],
  );

  return {
    items,
    fetchNextPage: result.fetchNextPage,
    hasNextPage: result.hasNextPage ?? false,
    isFetchingNextPage: result.isFetchingNextPage,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
    status: result.status,
  };
}

// ------------------------------------------------------------------ //
//  Manager summary stats hook
// ------------------------------------------------------------------ //

/**
 * Independent summary card aggregations.
 * Never depends on the infinite-scroll page state.
 * Cached for 60s (reasonable for aggregate counts).
 */
export function useManagerSummaryStats(companyId) {
  return useQuery({
    queryKey: ["leave-manager-stats", companyId],
    queryFn: async ({ signal }) => {
      if (!companyId) return null;
      const res = await axiosClient.get("/leave-requests/manager-stats", {
        signal,
      });
      return res.data;
    },
    enabled: Boolean(companyId),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });
}

// ------------------------------------------------------------------ //
//  Utility: invalidate leave approval queries
//  (called from socket event handler after a leave status change)
// ------------------------------------------------------------------ //

/**
 * Returns a function that invalidates both the infinite list and the
 * summary stats when a leave request is created/updated/deleted.
 *
 * Usage:
 *   const invalidate = useLeaveApprovalsInvalidator(companyId);
 *   // inside socket handler:
 *   invalidate();
 */
export function useLeaveApprovalsInvalidator(companyId) {
  const queryClient = useQueryClient();
  return () => {
    // Invalidate both tabs
    queryClient.invalidateQueries({ queryKey: ["leave-approvals", "PENDING", companyId] });
    queryClient.invalidateQueries({ queryKey: ["leave-approvals", "HISTORY", companyId] });
    queryClient.invalidateQueries({ queryKey: ["leave-manager-stats", companyId] });
  };
}
