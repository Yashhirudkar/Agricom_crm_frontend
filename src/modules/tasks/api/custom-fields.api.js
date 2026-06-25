import axiosClient from "../../../lib/axios";

export const CustomFieldAPI = {
  getCustomFields: async () => {
    const { data } = await axiosClient.get(`/v1/tasks/custom-fields`);
    return data.data;
  },
  createCustomField: async (payload) => {
    const { data } = await axiosClient.post(`/v1/tasks/custom-fields`, payload);
    return data.data;
  },
  updateCustomField: async (fieldId, payload) => {
    const { data } = await axiosClient.patch(`/v1/tasks/custom-fields/${fieldId}`, payload);
    return data.data;
  },
  deleteCustomField: async (fieldId) => {
    const { data } = await axiosClient.delete(`/v1/tasks/custom-fields/${fieldId}`);
    return data;
  },
  
  // Task specific values
  getTaskValues: async (taskId) => {
    const { data } = await axiosClient.get(`/v1/tasks/${taskId}/custom-fields`);
    return data.data;
  },
  setTaskValues: async (taskId, payload) => {
    const { data } = await axiosClient.post(`/v1/tasks/${taskId}/custom-fields`, payload);
    return data.data;
  }
};
