import axiosClient from "@/lib/axios";

export const stockApi = {
  getDashboard: () => axiosClient.get("/stock/dashboard"),
  getStockList: (params) => axiosClient.get("/stock", { params }),
};

