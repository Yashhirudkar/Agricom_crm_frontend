import axiosClient from "../../../lib/axios";

export const ChecklistAPI = {
  getChecklists: async (taskId) => {
    const { data } = await axiosClient.get(`/v1/tasks/${taskId}/checklists`);
    return data.data;
  },
  createChecklist: async (taskId, payload) => {
    const { data } = await axiosClient.post(`/v1/tasks/${taskId}/checklists`, payload);
    return data.data;
  },
  updateChecklist: async (taskId, checklistId, payload) => {
    const { data } = await axiosClient.patch(`/v1/tasks/${taskId}/checklists/${checklistId}`, payload);
    return data.data;
  },
  toggleChecklist: async (taskId, checklistId) => {
    const { data } = await axiosClient.patch(`/v1/tasks/${taskId}/checklists/${checklistId}/toggle`);
    return data.data;
  },
  deleteChecklist: async (taskId, checklistId) => {
    const { data } = await axiosClient.delete(`/v1/tasks/${taskId}/checklists/${checklistId}`);
    return data;
  },
  reorderChecklists: async (taskId, orderedIds) => {
    const { data } = await axiosClient.post(`/v1/tasks/${taskId}/checklists/reorder`, { orderedIds });
    return data;
  }
};
