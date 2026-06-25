import axiosClient from "../../../lib/axios";

export const CommentAPI = {
  getComments: async (taskId, page = 1, limit = 20) => {
    const { data } = await axiosClient.get(`/v1/tasks/${taskId}/comments`, { params: { page, limit } });
    return data; // returns paginated structure
  },
  createComment: async (taskId, payload) => {
    const { data } = await axiosClient.post(`/v1/tasks/${taskId}/comments`, payload);
    return data.data;
  },
  updateComment: async (taskId, commentId, payload) => {
    const { data } = await axiosClient.patch(`/v1/tasks/${taskId}/comments/${commentId}`, payload);
    return data.data;
  },
  deleteComment: async (taskId, commentId) => {
    const { data } = await axiosClient.delete(`/v1/tasks/${taskId}/comments/${commentId}`);
    return data;
  }
};
