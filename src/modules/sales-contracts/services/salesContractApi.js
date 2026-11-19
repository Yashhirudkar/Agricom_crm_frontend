import axiosClient from "@/lib/axios";

export const salesContractApi = {
  getAll: (params) => axiosClient.get("/sales-contracts", { params }),
  getOne: (id) => axiosClient.get(`/sales-contracts/${id}`),
  create: (data) => axiosClient.post("/sales-contracts", data),
  update: (id, data) => axiosClient.patch(`/sales-contracts/${id}`, data),
  updateStatus: (id, status) =>
    axiosClient.patch(`/sales-contracts/${id}/status`, { status }),
  remove: (id) => axiosClient.delete(`/sales-contracts/${id}`),

  getNextContractNumber: (sellerId, buyerId, financialYear) =>
    axiosClient.get("/sales-contracts/next-number", {
      params: { sellerId, buyerId, financialYear },
    }),

  getDocuments: (id) => axiosClient.get(`/sales-contracts/${id}/documents`),
  uploadDocument: (id, tradeDocumentId, data, onUploadProgress) =>
    axiosClient.post(`/sales-contracts/${id}/documents/${tradeDocumentId}/upload`, data, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    }),
  deleteDocument: (id, tradeDocumentId) =>
    axiosClient.delete(`/sales-contracts/${id}/documents/${tradeDocumentId}`),

  getFilterFinancialYears: () =>
    axiosClient.get("/sales-contracts/financial-years"),
};

let currenciesCache = null;
let currenciesCacheTime = 0;
let currenciesInFlightPromise = null;

const invalidateCurrenciesCache = () => {
  currenciesCache = null;
  currenciesCacheTime = 0;
  currenciesInFlightPromise = null;
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
  getProductsOptions: (params) =>
    axiosClient.get("/masters/products/options", { params }),
  getCountries: () =>
    Promise.resolve({ data: { data: [] } }),
  getBagTypes: () =>
    axiosClient.get("/masters/bag-types", { params: { isActive: true } }),
  getPackingTypes: () =>
    axiosClient.get("/masters/packing-types", { params: { isActive: true } }),
  getBagSpecs: () =>
    axiosClient.get("/masters/bag-specifications", { params: { isActive: true, limit: 100 } }),
  getStitchingTypes: () =>
    axiosClient.get("/masters/stitching-types").catch(() => ({ data: [] })),
  getMarkingTypes: () =>
    axiosClient.get("/masters/marking-types").catch(() => ({ data: [] })),

  getCurrencies: (params) => {
    const isStandardActiveQuery =
      params &&
      params.status === "Active" &&
      !params.search &&
      (!params.page || Number(params.page) === 1);

    const now = Date.now();
    if (isStandardActiveQuery && currenciesCache && now - currenciesCacheTime < 60000) {
      return Promise.resolve(currenciesCache);
    }
    if (isStandardActiveQuery && currenciesInFlightPromise) {
      return currenciesInFlightPromise;
    }

    const reqPromise = axiosClient
      .get("/masters/currencies", { params })
      .then((res) => {
        if (isStandardActiveQuery) {
          currenciesCache = res;
          currenciesCacheTime = Date.now();
        }
        return res;
      })
      .finally(() => {
        if (isStandardActiveQuery) {
          currenciesInFlightPromise = null;
        }
      });

    if (isStandardActiveQuery) {
      currenciesInFlightPromise = reqPromise;
    }
    return reqPromise;
  },

  invalidateCurrenciesCache,
  createCurrency: (data) => {
    invalidateCurrenciesCache();
    return axiosClient.post("/masters/currencies", data);
  },
  updateCurrency: (id, data) => {
    invalidateCurrenciesCache();
    return axiosClient.patch(`/masters/currencies/${id}`, data);
  },
  toggleCurrency: (id) => {
    invalidateCurrenciesCache();
    return axiosClient.patch(`/masters/currencies/${id}/toggle`);
  },
  deleteCurrency: (id) => {
    invalidateCurrenciesCache();
    return axiosClient.delete(`/masters/currencies/${id}`);
  },
};
