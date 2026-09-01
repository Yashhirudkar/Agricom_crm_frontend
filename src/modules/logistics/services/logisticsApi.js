import axiosClient from "@/lib/axios";

export const logisticsApi = {
  getAll: (params) => axiosClient.get("/logistics", { params }),
  getDetails: (enquiryId) => axiosClient.get(`/logistics/enquiry/${enquiryId}`),
  addFreightQuote: (id, data) => axiosClient.post(`/logistics/${id}/quotes`, data),
  updateFreightQuote: (id, quoteId, data) =>
    axiosClient.patch(`/logistics/${id}/quotes/${quoteId}`, data),
  deleteFreightQuote: (id, quoteId) =>
    axiosClient.delete(`/logistics/${id}/quotes/${quoteId}`),
  setPreferredQuote: (id, quoteId) =>
    axiosClient.patch(`/logistics/${id}/quotes/${quoteId}/preferred`),
  updateStatus: (id, data) => axiosClient.patch(`/logistics/${id}/status`, data),
  generateShipment: (id) => axiosClient.post(`/logistics/${id}/generate-shipment`),

  // Polymorphic Attachments
  getAttachments: (id) => axiosClient.get(`/logistics/${id}/attachments`),
  uploadAttachment: (id, formData, companyId = 1) =>
    axiosClient.post(`/logistics/${id}/attachments`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-company-id": companyId.toString(),
      },
    }),
  deleteAttachment: (id, attachmentId) =>
    axiosClient.delete(`/logistics/${id}/attachments/${attachmentId}`),

  // Timeline Activities
  getActivities: (id) => axiosClient.get(`/logistics/${id}/activity`),
};
