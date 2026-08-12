import axiosClient from "@/lib/axios";

export const FollowUpsAPI = {
  getStats: async () => {
    const { data } = await axiosClient.get("/follow-ups/dashboard/stats");
    return data;
  },

  getList: async (params) => {
    const { data } = await axiosClient.get("/follow-ups/dashboard/list", { params });
    return data;
  },

  getHeader: async () => {
    const { data } = await axiosClient.get("/follow-ups/header");
    return data;
  },

  getReminders: async () => {
    const { data } = await axiosClient.get("/follow-ups/reminders");
    return data;
  },

  complete: async (id, payload) => {
    const { data } = await axiosClient.patch(`/follow-ups/${id}/complete`, payload);
    return data;
  },

  reschedule: async (id, payload) => {
    const { data } = await axiosClient.patch(`/follow-ups/${id}/reschedule`, payload);
    return data;
  },
};
