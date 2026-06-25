import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskAPI } from "../api";
import { TASK_QUERY_KEYS } from "../constants/query-keys";
import { toast } from "sonner";

export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => TaskAPI.createTask(payload),
    onSuccess: () => {
      toast.success("Task created successfully");
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.lists() });
    },
  });
};

export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => TaskAPI.updateTask(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: TASK_QUERY_KEYS.lists() });
      const previousLists = queryClient.getQueriesData({ queryKey: TASK_QUERY_KEYS.lists() });

      queryClient.setQueriesData({ queryKey: TASK_QUERY_KEYS.lists() }, (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map(task => 
            task.id === id ? { ...task, ...payload } : task
          )
        };
      });

      return { previousLists };
    },
    onError: (err, variables, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Failed to update task");
    },
    onSuccess: (data, { id }) => {
      toast.success("Task updated successfully");
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.lists() });
    },
  });
};

// Optimistic Change Status
export const useChangeTaskStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => TaskAPI.changeStatus(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: TASK_QUERY_KEYS.lists() });
      const previousLists = queryClient.getQueriesData({ queryKey: TASK_QUERY_KEYS.lists() });

      queryClient.setQueriesData({ queryKey: TASK_QUERY_KEYS.lists() }, (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map(task => 
            task.id === id ? { ...task, statusId: payload.statusId } : task
          )
        };
      });

      return { previousLists };
    },
    onError: (err, variables, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Failed to change status");
    },
    onSuccess: (data, { id, payload }, context) => {
      let oldStatusId = null;
      if (context?.previousLists?.length > 0 && context.previousLists[0][1]) {
        const task = context.previousLists[0][1].data?.find(t => t.id === id);
        if (task) oldStatusId = task.statusId;
      }

      toast.success("Status changed", {
        action: oldStatusId ? {
          label: "Undo",
          onClick: () => {
            TaskAPI.changeStatus(id, { statusId: oldStatusId, version: 0 }).then(() => {
              queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.lists() });
              toast.success("Undo successful");
            });
          }
        } : undefined
      });
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.lists() });
    },
  });
};

// Optimistic Archive
export const useArchiveTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isArchived }) => TaskAPI.archiveTask(id, isArchived),
    onMutate: async ({ id, isArchived }) => {
      await queryClient.cancelQueries({ queryKey: TASK_QUERY_KEYS.lists() });
      const previousLists = queryClient.getQueriesData({ queryKey: TASK_QUERY_KEYS.lists() });

      queryClient.setQueriesData({ queryKey: TASK_QUERY_KEYS.lists() }, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map(task => 
            task.id === id ? { ...task, isArchived } : task
          )
        };
      });

      return { previousLists };
    },
    onError: (err, variables, context) => {
      context.previousLists.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      toast.error("Failed to update archive status");
    },
    onSuccess: (data, { id, isArchived }) => {
      toast.success(isArchived ? "Task archived" : "Task unarchived", {
        action: {
          label: "Undo",
          onClick: () => {
            TaskAPI.archiveTask(id, !isArchived).then(() => {
              queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.lists() });
              toast.success("Undo successful");
            });
          }
        }
      });
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.lists() });
    },
  });
};

export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => TaskAPI.deleteTask(id),
    onSuccess: () => {
      toast.success("Task deleted permanently");
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.lists() });
    },
  });
};

// BULK MUTATIONS
export const useBulkArchiveTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ids, isArchived }) => {
      return Promise.all(ids.map(id => TaskAPI.archiveTask(id, isArchived)));
    },
    onMutate: async ({ ids, isArchived }) => {
      await queryClient.cancelQueries({ queryKey: TASK_QUERY_KEYS.lists() });
      const previousLists = queryClient.getQueriesData({ queryKey: TASK_QUERY_KEYS.lists() });

      queryClient.setQueriesData({ queryKey: TASK_QUERY_KEYS.lists() }, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map(task => ids.includes(task.id) ? { ...task, isArchived } : task)
        };
      });
      return { previousLists };
    },
    onError: (err, variables, context) => {
      context.previousLists.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      toast.error("Failed to archive tasks");
    },
    onSuccess: (data, { ids, isArchived }) => {
      toast.success(isArchived ? `Archived ${ids.length} tasks` : `Unarchived ${ids.length} tasks`, {
        action: {
          label: "Undo",
          onClick: () => {
             Promise.all(ids.map(id => TaskAPI.archiveTask(id, !isArchived))).then(() => {
                 queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.lists() });
                 toast.success("Undo successful");
             });
          }
        }
      });
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.lists() });
    },
  });
};

export const useBulkDeleteTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ids }) => {
      return Promise.all(ids.map(id => TaskAPI.deleteTask(id)));
    },
    onMutate: async ({ ids }) => {
      await queryClient.cancelQueries({ queryKey: TASK_QUERY_KEYS.lists() });
      const previousLists = queryClient.getQueriesData({ queryKey: TASK_QUERY_KEYS.lists() });

      queryClient.setQueriesData({ queryKey: TASK_QUERY_KEYS.lists() }, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.filter(task => !ids.includes(task.id))
        };
      });
      return { previousLists };
    },
    onError: (err, variables, context) => {
      context.previousLists.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      toast.error("Failed to delete tasks");
    },
    onSuccess: (data, { ids }) => {
      toast.success(`Deleted ${ids.length} tasks permanently`);
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.lists() });
    },
  });
};

export const useBulkChangeTaskStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ids, payload }) => {
      return Promise.all(ids.map(id => TaskAPI.changeStatus(id, payload)));
    },
    onMutate: async ({ ids, payload }) => {
      await queryClient.cancelQueries({ queryKey: TASK_QUERY_KEYS.lists() });
      const previousLists = queryClient.getQueriesData({ queryKey: TASK_QUERY_KEYS.lists() });

      queryClient.setQueriesData({ queryKey: TASK_QUERY_KEYS.lists() }, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map(task => ids.includes(task.id) ? { ...task, statusId: payload.statusId } : task)
        };
      });
      return { previousLists };
    },
    onError: (err, variables, context) => {
      context.previousLists.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      toast.error("Failed to change status for tasks");
    },
    onSuccess: (data, { ids, payload }, context) => {
      // Find old statuses to allow undo
      let oldStatuses = {};
      if (context.previousLists.length > 0 && context.previousLists[0][1]) {
        context.previousLists[0][1].data?.forEach(t => {
          if (ids.includes(t.id)) {
            oldStatuses[t.id] = t.statusId;
          }
        });
      }

      toast.success(`Status changed for ${ids.length} tasks`, {
        action: Object.keys(oldStatuses).length > 0 ? {
          label: "Undo",
          onClick: () => {
            Promise.all(Object.entries(oldStatuses).map(([id, oldStatusId]) => 
              TaskAPI.changeStatus(id, { statusId: oldStatusId })
            )).then(() => {
              queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.lists() });
              toast.success("Undo successful");
            });
          }
        } : undefined
      });
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.lists() });
    },
  });
};
