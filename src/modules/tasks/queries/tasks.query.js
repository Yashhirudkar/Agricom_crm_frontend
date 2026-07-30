import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { TaskAPI } from "../api";
import { TASK_QUERY_KEYS } from "../constants/query-keys";

export const useTasksQuery = (filters) => {
  return useInfiniteQuery({
    queryKey: TASK_QUERY_KEYS.list(filters),
    queryFn: ({ pageParam, signal }) => TaskAPI.getTasks({ ...filters, cursor: pageParam }, { signal }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 0,
    gcTime: 1000 * 60 * 5, // 5 minutes cache retention
    refetchOnWindowFocus: false,
    retry: 1,
    maxPages: 10, // Prune older pages to keep browser memory lightweight
    refetchInterval: () => (typeof window !== 'undefined' && window.socketConnected) ? false : 60000 // Polling fallback (60s)
  });
};

export const useTaskDetailQuery = (taskId) => {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.detail(taskId),
    queryFn: () => TaskAPI.getTaskById(taskId),
    enabled: !!taskId,
  });
};

export const useTaskStatusesQuery = (companyId) => {
  return useQuery({
    queryKey: [...TASK_QUERY_KEYS.statuses, companyId || 'active'],
    queryFn: () => TaskAPI.getStatuses(companyId),
    staleTime: 0, 
  });
};

export const useTaskPrioritiesQuery = (companyId) => {
  return useQuery({
    queryKey: [...TASK_QUERY_KEYS.priorities, companyId || 'active'],
    queryFn: () => TaskAPI.getPriorities(companyId),
    staleTime: 0,
  });
};

export const useTaskStatusTransitionsQuery = (companyId) => {
  return useQuery({
    queryKey: [...TASK_QUERY_KEYS.statusTransitions, companyId || 'active'],
    queryFn: () => TaskAPI.getStatusTransitions(companyId),
    staleTime: 1000 * 60 * 60,
  });
};

export const useSubtasksQuery = (taskId) => {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.subtasks(taskId),
    queryFn: () => TaskAPI.getSubtasks(taskId),
    enabled: !!taskId,
    staleTime: 30 * 1000, // 30s — subtasks can change frequently
  });
};
