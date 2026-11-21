import axiosInstance from "@/lib/axios";

export const banksApi = {
  // Domestic Banks
  getDomesticBanks: (params = {}) => axiosInstance.get("/banks/domestic", { params }),
  getDomesticBank: (id) => axiosInstance.get(`/banks/domestic/${id}`),
  createDomesticBank: (data) => axiosInstance.post("/banks/domestic", data),
  updateDomesticBank: (id, data) => axiosInstance.patch(`/banks/domestic/${id}`, data),
  deleteDomesticBank: (id) => axiosInstance.delete(`/banks/domestic/${id}`),

  // Nostro Banks
  getNostroBanks: (params = {}) => axiosInstance.get("/banks/nostro", { params }),
  getNostroBank: (id) => axiosInstance.get(`/banks/nostro/${id}`),
  createNostroBank: (data) => axiosInstance.post("/banks/nostro", data),
  updateNostroBank: (id, data) => axiosInstance.patch(`/banks/nostro/${id}`, data),
  deleteNostroBank: (id) => axiosInstance.delete(`/banks/nostro/${id}`),

  // Document Resolution & Options
  resolveBankForDocument: (currency, companyId) =>
    axiosInstance.get("/banks/resolve", { params: { currency, companyId } }),
  getBankOptions: (currency, companyId) =>
    axiosInstance.get("/banks/options", { params: { currency, companyId } }),
};

export default banksApi;
