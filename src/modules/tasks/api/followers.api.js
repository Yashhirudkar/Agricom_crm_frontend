import axiosClient from "../../../lib/axios";

export const FollowerAPI = {
  getFollowers: async (taskId) => {
    const { data } = await axiosClient.get(`/v1/tasks/${taskId}/followers`);
    return data.data;
  },
  addFollower: async (taskId, employeeId) => {
    const { data } = await axiosClient.post(`/v1/tasks/${taskId}/followers`, { employeeId });
    return data.data;
  },
  removeFollower: async (taskId, employeeId) => {
    const { data } = await axiosClient.delete(`/v1/tasks/${taskId}/followers/${employeeId}`);
    return data;
  }
};
