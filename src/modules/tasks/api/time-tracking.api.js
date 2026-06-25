import axiosClient from "../../../lib/axios";

export const TimeTrackingAPI = {
  getTimeLogs: async (taskId) => {
    const { data } = await axiosClient.get(`/v1/tasks/${taskId}/time`);
    return data.data;
  },
  startTimer: async (taskId) => {
    const { data } = await axiosClient.post(`/v1/tasks/${taskId}/time/start`);
    return data.data;
  },
  pauseTimer: async (taskId) => {
    const { data } = await axiosClient.post(`/v1/tasks/${taskId}/time/pause`);
    return data.data;
  },
  resumeTimer: async (taskId) => {
    const { data } = await axiosClient.post(`/v1/tasks/${taskId}/time/resume`);
    return data.data;
  },
  stopTimer: async (taskId) => {
    const { data } = await axiosClient.post(`/v1/tasks/${taskId}/time/stop`);
    return data.data;
  },
  addManualEntry: async (taskId, payload) => {
    const { data } = await axiosClient.post(`/v1/tasks/${taskId}/time/manual`, payload);
    return data.data;
  }
};
