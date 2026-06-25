import axiosClient from "../../../lib/axios";

export const TaskAPI = {
  getTasks: async (params) => {
    const { data } = await axiosClient.get("/v1/tasks", { params });
    return data;
  },

  getTaskById: async (id) => {
    const { data } = await axiosClient.get(`/v1/tasks/${id}`);
    return data.data; // Assuming backend wraps single items in { success, data }
  },

  createTask: async (payload) => {
    const { data } = await axiosClient.post("/v1/tasks", payload, {
      headers: {
        'Idempotency-Key': crypto.randomUUID()
      }
    });
    return data.data;
  },

  updateTask: async (id, payload) => {
    const { data } = await axiosClient.patch(`/v1/tasks/${id}`, payload);
    return data.data;
  },

  changeStatus: async (id, payload) => {
    const { data } = await axiosClient.patch(`/v1/tasks/${id}/status`, payload);
    return data.data;
  },

  archiveTask: async (id, isArchived) => {
    const { data } = await axiosClient.patch(`/v1/tasks/${id}/archive`, { isArchived });
    return data.data;
  },

  deleteTask: async (id) => {
    const { data } = await axiosClient.delete(`/v1/tasks/${id}`);
    return data;
  },

  getStatuses: async () => {
    const { data } = await axiosClient.get("/v1/tasks/meta/statuses");
    return data.data;
  },

  getPriorities: async () => {
    const { data } = await axiosClient.get("/v1/tasks/meta/priorities");
    return data.data;
  },
  
  getStatusTransitions: async () => {
    const { data } = await axiosClient.get("/v1/tasks/status-transitions");
    return data.data;
  }
};
