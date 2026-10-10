import axiosClient from "@/lib/axios";

export const enquiriesApi = {
  getAll: (params) => axiosClient.get("/enquiries", { params }),
  getOne: (id) => axiosClient.get(`/enquiries/${id}`).then((res) => res.data?.data ?? res.data),
  create: (data) => axiosClient.post("/enquiries", data),
  update: (id, data) => axiosClient.patch(`/enquiries/${id}`, data),
  remove: (id, reason) => axiosClient.delete(`/enquiries/${id}`, { params: { reason } }),
  getLoadingPoints: (id) =>
    axiosClient.get(`/enquiries/${id}/loading-points`).then((res) => res.data?.data ?? res.data ?? []),
  updateLoadingPoints: (id, payload) =>
    axiosClient.put(`/enquiries/${id}/loading-points`, payload),
  getDestinations: (id) =>
    axiosClient.get(`/enquiries/${id}/destinations`).then((res) => res.data?.data ?? res.data ?? []),
  updateDestinations: (id, destinations) =>
    axiosClient.put(`/enquiries/${id}/destinations`, { destinations }),
};


export const mastersApi = {
  getPartnerRoles: (params) =>
    axiosClient.get("/masters/partner-roles/options", { params }),
  getPartners: (params) =>
    axiosClient.get("/masters/partners/options", { params }),
  getProducts: (params) =>
    axiosClient.get("/masters/products/options", { params }),
  getCountries: (params) =>
    Promise.resolve({ data: { data: [] } }),
  getPackingTypes: () =>
    axiosClient.get("/masters/packing-types/options", { params: { isActive: true } }),
  getShipmentTypes: (params) =>
    axiosClient.get("/masters/shipment-types/options", { params }),
};
