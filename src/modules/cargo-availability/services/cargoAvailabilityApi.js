import axiosClient from "@/lib/axios";

export const cargoAvailabilityApi = {
  getCargoAvailabilityList: (params) => axiosClient.get("/cargo-availability", { params }),
  getStats: () => axiosClient.get("/cargo-availability/stats"),
  getCargoAvailabilityById: (id) => axiosClient.get(`/cargo-availability/${id}`),
  getShipmentInfo: (shipmentId) => axiosClient.get(`/cargo-availability/shipment-info/${shipmentId}`),
  getByShipmentId: (shipmentId) => axiosClient.get(`/cargo-availability/by-shipment/${shipmentId}`),
  createReadiness: (data) => axiosClient.post("/cargo-availability/readiness", data),
  approveReadiness: (id, status) => axiosClient.patch(`/cargo-availability/readiness/${id}/approve`, { status }),
  createAllocation: (data) => axiosClient.post("/cargo-availability/allocations", data),
  getAllLoadingEntries: () => axiosClient.get("/cargo-availability/loading"),
  createLoading: (data) => axiosClient.post("/cargo-availability/loading", data),
  updateLoadingStatus: (id, data) => axiosClient.put(`/cargo-availability/loading/${id}`, data),
};

