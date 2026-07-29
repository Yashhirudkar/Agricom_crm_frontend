import axiosClient from "../../../lib/axios";

const generateUUID = () => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

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
        'Idempotency-Key': generateUUID()
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
  },

  // Subtasks
  getSubtasks: async (taskId) => {
    const { data } = await axiosClient.get(`/v1/tasks/${taskId}/subtasks`);
    return data.data || [];
  },

  createSubtask: async (taskId, payload) => {
    const { data } = await axiosClient.post(`/v1/tasks/${taskId}/subtasks`, payload);
    return data.data;
  },

  deleteSubtask: async (taskId, subtaskId) => {
    const { data } = await axiosClient.delete(`/v1/tasks/${taskId}/subtasks/${subtaskId}`);
    return data;
  },
};
