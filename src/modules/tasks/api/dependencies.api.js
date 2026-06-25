import axiosClient from "../../../lib/axios";

export const DependencyAPI = {
  getDependencies: async (taskId) => {
    const { data } = await axiosClient.get(`/v1/tasks/${taskId}/dependencies`);
    return data.data;
  },
  createDependency: async (taskId, payload) => {
    const { data } = await axiosClient.post(`/v1/tasks/${taskId}/dependencies`, payload);
    return data.data;
  },
  removeDependency: async (taskId, dependencyId) => {
    const { data } = await axiosClient.delete(`/v1/tasks/${taskId}/dependencies/${dependencyId}`);
    return data;
  }
};
