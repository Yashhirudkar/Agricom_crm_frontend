import axiosClient from "@/lib/axios";

export const salesContractApi = {
  getAll: (params) => axiosClient.get("/sales-contracts", { params }),
  getOne: (id) => axiosClient.get(`/sales-contracts/${id}`),
  create: (data) => axiosClient.post("/sales-contracts", data),
  update: (id, data) => axiosClient.patch(`/sales-contracts/${id}`, data),
  updateStatus: (id, status) =>
    axiosClient.patch(`/sales-contracts/${id}/status`, { status }),
  remove: (id) => axiosClient.delete(`/sales-contracts/${id}`),
};

export const mastersApi = {
  getFinancialYears: (params) =>
    axiosClient.get("/masters/financial-years", { params }),

  getShipmentTypes: (params) =>
    axiosClient.get("/masters/shipment-types", { params }),
  getPaymentTerms: (params) =>
    axiosClient.get("/masters/payment-terms", { params }),
  getTradeDocuments: (params) =>
    axiosClient.get("/masters/trade-documents", { params }),
  getPartnerRoles: (params) =>
    axiosClient.get("/masters/partner-roles", { params }),
  getPartners: (params) =>
    axiosClient.get("/masters/partners", { params }),
  getProducts: (params) =>
    axiosClient.get("/masters/products", { params }),
  getCountries: (params) =>
    axiosClient.get("/masters/countries", { params }),
  // bag-types and packing-types use isActive (boolean), not status
  getBagTypes: () =>
    axiosClient.get("/masters/bag-types", { params: { isActive: true } }),
  getPackingTypes: () =>
    axiosClient.get("/masters/packing-types", { params: { isActive: true } }),
  // bag-specifications uses isActive param
  getBagSpecs: () =>
    axiosClient.get("/masters/bag-specifications", { params: { isActive: true, limit: 100 } }),
};
