import axiosClient from "../../../lib/axios";

export const TaskAttachmentAPI = {
  getAttachments: async (taskId) => {
    const { data } = await axiosClient.get(`/v1/tasks/${taskId}/attachments`);
    return data.data;
  },
  uploadAttachment: async (taskId, formData) => {
    const { data } = await axiosClient.post(`/v1/tasks/${taskId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return data.data;
  },
  deleteAttachment: async (taskId, attachmentId) => {
    const { data } = await axiosClient.delete(`/v1/tasks/${taskId}/attachments/${attachmentId}`);
    return data;
  }
};
