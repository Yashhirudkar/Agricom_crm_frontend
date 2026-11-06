import axiosClient from "@/lib/axios";

export const monthlyTargetApi = {
  getCurrent: (params) => axiosClient.get("/monthly-targets/current", { params }),
  create: (data) => axiosClient.post("/monthly-targets", data),
  getHistory: () => axiosClient.get("/monthly-targets/history"),
};

export default monthlyTargetApi;

