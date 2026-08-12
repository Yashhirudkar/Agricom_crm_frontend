import axiosClient from "@/lib/axios";

export const salesContractApi = {
  getAll: (params) => axiosClient.get("/sales-contracts", { params }),
  getOne: (id) => axiosClient.get(`/sales-contracts/${id}`),
  create: (data) => axiosClient.post("/sales-contracts", data),
  update: (id, data) => axiosClient.patch(`/sales-contracts/${id}`, data),
  updateStatus: (id, status) =>
    axiosClient.patch(`/sales-contracts/${id}/status`, { status }),
  remove: (id) => axiosClient.delete(`/sales-contracts/${id}`),

  // Document Endpoints
  getDocuments: (id) => axiosClient.get(`/sales-contracts/${id}/documents`),
  uploadDocument: (id, tradeDocumentId, data, onUploadProgress) =>
    axiosClient.post(`/sales-contracts/${id}/documents/${tradeDocumentId}/upload`, data, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    }),
  deleteDocument: (id, tradeDocumentId) =>
    axiosClient.delete(`/sales-contracts/${id}/documents/${tradeDocumentId}`),

  // Returns distinct financial years stored in the database for list filtering
  getFilterFinancialYears: () =>
    axiosClient.get("/sales-contracts/financial-years"),
};

export const mastersApi = {
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
  getPartnersOptions: (params) =>
    axiosClient.get("/masters/partners/options", { params }),
  getProducts: (params) =>
    axiosClient.get("/masters/products", { params }),
  getCountries: (params) =>
    Promise.resolve({ data: { data: [] } }),
  // bag-types and packing-types use isActive (boolean), not status
  getBagTypes: () =>
    axiosClient.get("/masters/bag-types", { params: { isActive: true } }),
  getPackingTypes: () =>
    axiosClient.get("/masters/packing-types", { params: { isActive: true } }),
  // bag-specifications uses isActive param
  getBagSpecs: () =>
    axiosClient.get("/masters/bag-specifications", { params: { isActive: true, limit: 100 } }),
  getCurrencies: (params) =>
    axiosClient.get("/masters/currencies", { params }),
  createCurrency: (data) =>
    axiosClient.post("/masters/currencies", data),
  updateCurrency: (id, data) =>
    axiosClient.patch(`/masters/currencies/${id}`, data),
  toggleCurrency: (id) =>
    axiosClient.patch(`/masters/currencies/${id}/toggle`),
  deleteCurrency: (id) =>
    axiosClient.delete(`/masters/currencies/${id}`),
};
