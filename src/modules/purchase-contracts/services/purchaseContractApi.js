import axiosClient from "@/lib/axios";

export const purchaseContractApi = {
  getDashboard: () => axiosClient.get("/purchase-contracts/dashboard"),
  getAll: (params) => axiosClient.get("/purchase-contracts", { params }),
  create: (data) => axiosClient.post("/purchase-contracts", data),
  getOne: (id) => axiosClient.get(`/purchase-contracts/${id}`),
  getSummary: (id) => axiosClient.get(`/purchase-contracts/${id}/summary`),
  getTimeline: (id) => axiosClient.get(`/purchase-contracts/${id}/timeline`),
  update: (id, data) => axiosClient.patch(`/purchase-contracts/${id}`, data),
  updateStatus: (id, status) =>
    axiosClient.patch(`/purchase-contracts/${id}/status`, { status }),
  remove: (id) => axiosClient.delete(`/purchase-contracts/${id}`),

  // Shipments
  getShipments: (id) => axiosClient.get(`/purchase-contracts/${id}/shipments`),
  addShipment: (id, shipmentId) =>
    axiosClient.post(`/purchase-contracts/${id}/shipments`, { shipmentId }),
  removeShipment: (id, shipmentId) =>
    axiosClient.delete(`/purchase-contracts/${id}/shipments/${shipmentId}`),

  // Documents
  getDocuments: (id) => axiosClient.get(`/purchase-contracts/${id}/documents`),
  addRequiredDocument: (id, tradeDocumentId) =>
    axiosClient.post(`/purchase-contracts/${id}/documents`, { tradeDocumentId }),
  uploadDocument: (id, tradeDocumentId, formData, companyId = 1) =>
    axiosClient.post(
      `/purchase-contracts/${id}/documents/${tradeDocumentId}/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-company-id": companyId.toString(),
        },
      }
    ),
  deleteDocument: (id, tradeDocumentId) =>
    axiosClient.delete(`/purchase-contracts/${id}/documents/${tradeDocumentId}`),

  // Activity Log
  getActivity: (id, params) =>
    axiosClient.get(`/purchase-contracts/${id}/activity`, { params }),

  // Attachments
  getAttachments: (id) => axiosClient.get(`/purchase-contracts/${id}/attachments`),
  uploadAttachment: (id, formData, companyId = 1) =>
    axiosClient.post(`/purchase-contracts/${id}/attachments`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-company-id": companyId.toString(),
      },
    }),
  deleteAttachment: (id, attachmentId) =>
    axiosClient.delete(`/purchase-contracts/${id}/attachments/${attachmentId}`),
};

