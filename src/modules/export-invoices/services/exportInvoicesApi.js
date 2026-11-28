import axiosClient from "@/lib/axios";

export const exportInvoicesApi = {
  // Pre-populate ERP data from single shipment (existing flow)
  getInitData: (shipmentId) =>
    axiosClient.get(`/export-invoices/init/${shipmentId}`),

  // Pre-populate combined ERP data from StuffingExecutionGroup
  getInitDataFromGroup: (stuffingGroupId) =>
    axiosClient.get(`/export-invoices/init-group/${stuffingGroupId}`),

  // Pre-populate combined ERP data from multiple selected shipmentIds
  getInitDataFromShipments: (shipmentIds) =>
    axiosClient.get(`/export-invoices/init-multi`, {
      params: {
        shipmentIds: Array.isArray(shipmentIds)
          ? shipmentIds.join(",")
          : shipmentIds,
      },
    }),

  // Preview next number based on contract and manual sequence
  getNextNumber: (contractNumber, manualSequence) =>
    axiosClient.get(`/export-invoices/next-number`, {
      params: { contractNumber, manualSequence },
    }),

  // Set initial sequence manually
  setInitialSequence: (sequence) =>
    axiosClient.post(`/export-invoices/sequence/initial`, { sequence }),

  // Get available bank options
  getBankOptions: (currency) =>
    axiosClient.get(`/export-invoices/banks`, {
      params: { currency },
    }),

  // Upload temporary signature image
  uploadSignature: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.post(`/export-invoices/upload-signature`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Upload temporary stamp image
  uploadStamp: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.post(`/export-invoices/upload-stamp`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Create invoice
  createInvoice: (data) =>
    axiosClient.post(`/export-invoices`, data),

  // List invoices with filters and pagination
  getInvoices: (params) =>
    axiosClient.get(`/export-invoices`, { params }),

  // Get single invoice
  getInvoice: (id) =>
    axiosClient.get(`/export-invoices/${id}`),

  // Update invoice
  updateInvoice: (id, data) =>
    axiosClient.put(`/export-invoices/${id}`, data),

  // Delete invoice
  deleteInvoice: (id) =>
    axiosClient.delete(`/export-invoices/${id}`),
};

