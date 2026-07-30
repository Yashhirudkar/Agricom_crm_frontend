import { useQuery } from "@tanstack/react-query";
import { TaskAPI } from "../api";
import { TASK_QUERY_KEYS } from "../constants/query-keys";

export const useTasksQuery = (filters) => {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.list(filters),
    queryFn: () => TaskAPI.getTasks(filters),
    // staleTime: 0 ensures a fresh backend API call on every preset/filter change
    staleTime: 0,
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
