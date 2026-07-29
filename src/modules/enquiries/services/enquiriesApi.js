import axiosClient from "@/lib/axios";

export const enquiriesApi = {
  getAll: (params) => axiosClient.get("/enquiries", { params }),
  create: (data) => axiosClient.post("/enquiries", data),
  remove: (id, reason) => axiosClient.delete(`/enquiries/${id}`, { params: { reason } }),
};

export const mastersApi = {
  getPartnerRoles: (params) =>
    axiosClient.get("/masters/partner-roles/options", { params }),
  getPartners: (params) =>
    axiosClient.get("/masters/partners", { params }),
  getProducts: (params) =>
    axiosClient.get("/masters/products/options", { params }),
  getCountries: (params) =>
    Promise.resolve({ data: { data: [] } }),
  getPackingTypes: () =>
    axiosClient.get("/masters/packing-types/options", { params: { isActive: true } }),
  getShipmentTypes: (params) =>
    axiosClient.get("/masters/shipment-types/options", { params }),
};
