import axiosClient from "../../../lib/axios";

export const TemplateAPI = {
  getTemplates: async () => {
    const { data } = await axiosClient.get(`/v1/tasks/templates`);
    return data.data;
  },
  createTemplate: async (payload) => {
    const { data } = await axiosClient.post(`/v1/tasks/templates`, payload);
    return data.data;
  },
  updateTemplate: async (templateId, payload) => {
    const { data } = await axiosClient.patch(`/v1/tasks/templates/${templateId}`, payload);
    return data.data;
  },
  deleteTemplate: async (templateId) => {
    const { data } = await axiosClient.delete(`/v1/tasks/templates/${templateId}`);
    return data;
  },
  cloneTemplate: async (templateId, payload) => {
    const { data } = await axiosClient.post(`/v1/tasks/templates/${templateId}/clone`, payload);
    return data.data;
  }
};
