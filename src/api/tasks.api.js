import axiosClient from "../lib/axios";

/**
 * Tasks API module encapsulating all endpoints for task management.
 */

export const tasksApi = {
  /**
   * Fetch paginated list of tasks.
   * @param {Object} params - Query params (e.g. statusId, priorityId, search)
   */
  getAll: async (params = {}) => {
    const response = await axiosClient.get("/v1/tasks", { params });
    return response.data;
  },

  /**
   * Fetch a single task by ID.
   * @param {number|string} id
   */
  getById: async (id) => {
    const response = await axiosClient.get(`/v1/tasks/${id}`);
    return response.data;
  },

  /**
   * Create a new task.
   * @param {import("../types/task.types").CreateTaskDto} data
   */
  create: async (data) => {
    // Generate an idempotency key for safe retries
    const idempotencyKey = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const response = await axiosClient.post("/v1/tasks", data, {
      headers: { "Idempotency-Key": idempotencyKey },
    });
    return response.data;
  },

  /**
   * Update a task. Note: requires version for optimistic locking.
   * @param {number|string} id
   * @param {import("../types/task.types").UpdateTaskDto} data
   */
  update: async (id, data) => {
    const response = await axiosClient.patch(`/v1/tasks/${id}`, data);
    return response.data;
  },

  /**
   * Archive or unarchive a task.
   * @param {number|string} id
   * @param {boolean} isArchived
   */
  archive: async (id, isArchived) => {
    const response = await axiosClient.patch(`/v1/tasks/${id}/archive`, { isArchived });
    return response.data;
  },

  /**
   * Soft delete a task.
   * @param {number|string} id
   */
  delete: async (id) => {
    const response = await axiosClient.delete(`/v1/tasks/${id}`);
    return response.data;
  },

  /**
   * Restore a soft deleted task.
   * @param {number|string} id
   */
  restore: async (id) => {
    const response = await axiosClient.patch(`/v1/tasks/${id}/restore`);
    return response.data;
  },
};
