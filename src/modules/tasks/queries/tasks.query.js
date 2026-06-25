import { useQuery } from "@tanstack/react-query";
import { TaskAPI } from "../api";
import { TASK_QUERY_KEYS } from "../constants/query-keys";

export const useTasksQuery = (filters) => {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.list(filters),
    queryFn: () => TaskAPI.getTasks(filters),
    // Keep previous data while fetching new pages/filters to avoid flickering
    placeholderData: (previousData) => previousData,
  });
};

export const useTaskDetailQuery = (taskId) => {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.detail(taskId),
    queryFn: () => TaskAPI.getTaskById(taskId),
    enabled: !!taskId,
  });
};

export const useTaskStatusesQuery = () => {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.statuses,
    queryFn: () => TaskAPI.getStatuses(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useTaskPrioritiesQuery = () => {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.priorities,
    queryFn: () => TaskAPI.getPriorities(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useTaskStatusTransitionsQuery = () => {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.statusTransitions,
    queryFn: () => TaskAPI.getStatusTransitions(),
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
