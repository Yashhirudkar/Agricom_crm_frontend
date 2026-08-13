import axiosClient from "@/lib/axios";

export const shipmentsApi = {
  getShipments: (params) => axiosClient.get("/sales-contracts/shipments", { params }),
  getStats: (params) => axiosClient.get("/sales-contracts/shipments/stats", { params }),
  updateShipment: (id, data) => axiosClient.patch(`/sales-contracts/shipments/${id}`, data),
  getExportExcelUrl: (params) => {
    const query = new URLSearchParams(params).toString();
    const baseURL = axiosClient.defaults.baseURL || "";
    return `${baseURL}/sales-contracts/shipments/export/excel?${query}`;
  },
};
