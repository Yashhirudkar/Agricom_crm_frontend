import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskAPI } from "../api";
import { TASK_QUERY_KEYS } from "../constants/query-keys";
import { toast } from "sonner";

// Helper to update tasks matching a predicate across infinite query pages
const updateCachedTasks = (queryClient, predicate, updater) => {
  queryClient.setQueriesData({ queryKey: TASK_QUERY_KEYS.lists() }, (old) => {
    if (!old) return old;
    if (old.pages) {
      return {
        ...old,
        pages: old.pages.map(page => {
          const items = page.items || page.data || [];
          const updatedItems = items.map(task => predicate(task) ? updater(task) : task);
          return {
            ...page,
            items: updatedItems,
            data: updatedItems
          };
        })
      };
    }
    if (!old.data) return old;
    return {
      ...old,
      data: old.data.map(task => predicate(task) ? updater(task) : task),
      items: old.items ? old.items.map(task => predicate(task) ? updater(task) : task) : undefined
    };
  });
};

// Helper to remove tasks from cache
const removeCachedTasks = (queryClient, predicate) => {
  queryClient.setQueriesData({ queryKey: TASK_QUERY_KEYS.lists() }, (old) => {
    if (!old) return old;
    if (old.pages) {
      return {
        ...old,
        pages: old.pages.map(page => {
          const items = page.items || page.data || [];
          const updatedItems = items.filter(task => !predicate(task));
          return {
            ...page,
            items: updatedItems,
            data: updatedItems
          };
        })
      };
    }
    if (!old.data) return old;
    return {
      ...old,
      data: old.data.filter(task => !predicate(task)),
      items: old.items ? old.items.filter(task => !predicate(task)) : undefined
    };
  });
};

export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => TaskAPI.createTask(payload),
    onSuccess: (newTask) => {
      toast.success("Task created successfully");
      queryClient.setQueriesData({ queryKey: TASK_QUERY_KEYS.lists() }, (old) => {
        if (!old) return old;
        if (old.pages) {
          const firstPage = old.pages[0];
          if (!firstPage) return old;
          const items = firstPage.items || firstPage.data || [];
          const updatedFirstPage = {
            ...firstPage,
            items: [newTask, ...items],
            data: [newTask, ...items],
          };
          return {
            ...old,
            pages: [updatedFirstPage, ...old.pages.slice(1)],
          };
        }
        return {
          ...old,
          data: [newTask, ...(old.data || [])],
          items: old.items ? [newTask, ...old.items] : undefined
        };
      });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to create task");
    }
  });
};

export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => TaskAPI.updateTask(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: TASK_QUERY_KEYS.lists() });
      const previousLists = queryClient.getQueriesData({ queryKey: TASK_QUERY_KEYS.lists() });

      updateCachedTasks(queryClient, (task) => task.id === id, (task) => ({ ...task, ...payload }));

      return { previousLists };
    },
    onError: (err, variables, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(err?.response?.data?.message || "Failed to update task");
    },
    onSuccess: (data, { id }) => {
      toast.success("Task updated successfully");
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.detail(id) });
    },
  });
};

export const useChangeTaskStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => TaskAPI.changeStatus(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: TASK_QUERY_KEYS.lists() });
      const previousLists = queryClient.getQueriesData({ queryKey: TASK_QUERY_KEYS.lists() });

      updateCachedTasks(queryClient, (task) => task.id === id, (task) => ({ ...task, statusId: payload.statusId }));

      return { previousLists };
    },
    onError: (err, variables, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(err?.response?.data?.message || "Failed to change status");
    },
    onSuccess: (data, { id, payload }, context) => {
      let oldStatusId = null;
      if (context?.previousLists?.length > 0 && context.previousLists[0][1]) {
        const pages = context.previousLists[0][1].pages;
        const allTasks = pages ? pages.flatMap(p => p.items || p.data || []) : (context.previousLists[0][1].data || []);
        const task = allTasks.find(t => t.id === id);
        if (task) oldStatusId = task.statusId;
      }

      toast.success("Status changed", {
        action: oldStatusId ? {
          label: "Undo",
          onClick: () => {
            TaskAPI.changeStatus(id, { statusId: oldStatusId, version: 0 }).then(() => {
              queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.detail(id) });
              updateCachedTasks(queryClient, (task) => task.id === id, (task) => ({ ...task, statusId: oldStatusId }));
              toast.success("Undo successful");
            });
          }
        } : undefined
      });
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.detail(id) });
    },
  });
};

export const useArchiveTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isArchived }) => TaskAPI.archiveTask(id, isArchived),
    onMutate: async ({ id, isArchived }) => {
      await queryClient.cancelQueries({ queryKey: TASK_QUERY_KEYS.lists() });
      const previousLists = queryClient.getQueriesData({ queryKey: TASK_QUERY_KEYS.lists() });

      // Prune immediately if we are archiving and NOT viewing archived tasks
      removeCachedTasks(queryClient, (task) => task.id === id);

      return { previousLists };
    },
    onError: (err, variables, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Failed to update archive status");
    },
    onSuccess: (data, { id, isArchived }) => {
      toast.success(isArchived ? "Task archived" : "Task unarchived", {
        action: {
          label: "Undo",
          onClick: () => {
            TaskAPI.archiveTask(id, !isArchived).then(() => {
              queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.detail(id) });
              queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.lists() });
              toast.success("Undo successful");
            });
          }
        }
      });
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.detail(id) });
    },
  });
};

export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => TaskAPI.deleteTask(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: TASK_QUERY_KEYS.lists() });
      const previousLists = queryClient.getQueriesData({ queryKey: TASK_QUERY_KEYS.lists() });

      removeCachedTasks(queryClient, (task) => task.id === id);

      return { previousLists };
    },
    onError: (err, variables, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Failed to delete task");
    },
    onSuccess: () => {
      toast.success("Task deleted permanently");
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.lists() });
    },
  });
};

// BULK MUTATIONS (Single transactional requests)
export const useBulkArchiveTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => TaskAPI.bulkArchive(payload),
    onMutate: async ({ selectAll, excludedIds, ids, isArchived }) => {
      await queryClient.cancelQueries({ queryKey: TASK_QUERY_KEYS.lists() });
      const previousLists = queryClient.getQueriesData({ queryKey: TASK_QUERY_KEYS.lists() });

      const predicate = (task) => selectAll ? !excludedIds.includes(task.id) : ids.includes(task.id);
      removeCachedTasks(queryClient, predicate);

      return { previousLists };
    },
    onError: (err, variables, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Failed to archive tasks");
    },
    onSuccess: (data, { isArchived }) => {
      toast.success(isArchived ? `Archived matching tasks` : `Unarchived matching tasks`);
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.lists() });
    },
  });
};

export const useBulkDeleteTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => TaskAPI.bulkDelete(payload),
    onMutate: async ({ selectAll, excludedIds, ids }) => {
      await queryClient.cancelQueries({ queryKey: TASK_QUERY_KEYS.lists() });
      const previousLists = queryClient.getQueriesData({ queryKey: TASK_QUERY_KEYS.lists() });

      const predicate = (task) => selectAll ? !excludedIds.includes(task.id) : ids.includes(task.id);
      removeCachedTasks(queryClient, predicate);

      return { previousLists };
    },
    onError: (err, variables, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Failed to delete tasks");
    },
    onSuccess: () => {
      toast.success(`Deleted tasks permanently`);
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.lists() });
    },
  });
};

export const useBulkChangeTaskStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => TaskAPI.bulkChangeStatus(payload),
    onMutate: async ({ selectAll, excludedIds, ids, statusId }) => {
      await queryClient.cancelQueries({ queryKey: TASK_QUERY_KEYS.lists() });
      const previousLists = queryClient.getQueriesData({ queryKey: TASK_QUERY_KEYS.lists() });

      const predicate = (task) => selectAll ? !excludedIds.includes(task.id) : ids.includes(task.id);
      updateCachedTasks(queryClient, predicate, (task) => ({ ...task, statusId }));

      return { previousLists };
    },
    onError: (err, variables, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(err?.response?.data?.message || "Failed to change status for tasks");
    },
    onSuccess: () => {
      toast.success(`Status updated for tasks`);
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.lists() });
    },
  });
};

// ── Subtask Mutations ────────────────────────────────────────────────────────

export const useCreateSubtaskMutation = (parentTaskId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => TaskAPI.createSubtask(parentTaskId, payload),
    onSuccess: (newSubtask) => {
      toast.success("Subtask created successfully");
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.subtasks(parentTaskId) });
      
      queryClient.setQueriesData({ queryKey: TASK_QUERY_KEYS.lists() }, (old) => {
        if (!old) return old;
        if (old.pages) {
          return {
            ...old,
            pages: old.pages.map(page => {
              const items = page.items || page.data || [];
              return {
                ...page,
                items: [...items, newSubtask],
                data: [...items, newSubtask]
              };
            })
          };
        }
        return {
          ...old,
          data: [...(old.data || []), newSubtask],
          items: old.items ? [...old.items, newSubtask] : undefined
        };
      });
    },
    onError: (err) => {
      const message = err?.response?.data?.message || "Failed to create subtask";
      toast.error(message);
    },
  });
};

export const useDeleteSubtaskMutation = (parentTaskId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subtaskId) => TaskAPI.deleteSubtask(parentTaskId, subtaskId),
    onMutate: async (subtaskId) => {
      await queryClient.cancelQueries({ queryKey: TASK_QUERY_KEYS.lists() });
      const previousLists = queryClient.getQueriesData({ queryKey: TASK_QUERY_KEYS.lists() });

      removeCachedTasks(queryClient, (task) => task.id === subtaskId);

      return { previousLists };
    },
    onError: (err, variables, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Failed to delete subtask");
    },
    onSuccess: () => {
      toast.success("Subtask deleted");
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.subtasks(parentTaskId) });
    },
  });
};
