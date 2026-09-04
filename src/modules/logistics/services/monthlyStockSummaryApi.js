import axiosClient from "@/lib/axios";

export const monthlyStockSummaryApi = {
  getAll: (params) => axiosClient.get("/logistics/monthly-stock-summary", { params }),
  getById: (id) => axiosClient.get(`/logistics/monthly-stock-summary/${id}`),
  create: (data) => axiosClient.post("/logistics/monthly-stock-summary", data),
  update: (id, data) => axiosClient.patch(`/logistics/monthly-stock-summary/${id}`, data),
  publish: (id) => axiosClient.patch(`/logistics/monthly-stock-summary/${id}/publish`),
  delete: (id) => axiosClient.delete(`/logistics/monthly-stock-summary/${id}`),

  // Section APIs
  addSection: (summaryId, data) => axiosClient.post(`/logistics/monthly-stock-summary/${summaryId}/sections`, data),
  updateSection: (summaryId, sectionId, data) => axiosClient.patch(`/logistics/monthly-stock-summary/${summaryId}/sections/${sectionId}`, data),
  deleteSection: (summaryId, sectionId) => axiosClient.delete(`/logistics/monthly-stock-summary/${summaryId}/sections/${sectionId}`),
  duplicateSection: (summaryId, sectionId) => axiosClient.post(`/logistics/monthly-stock-summary/${summaryId}/sections/${sectionId}/duplicate`),
  reorderSections: (summaryId, items) => axiosClient.patch(`/logistics/monthly-stock-summary/${summaryId}/sections/reorder`, { items }),

  // Column APIs
  addColumn: (summaryId, sectionId, data) => axiosClient.post(`/logistics/monthly-stock-summary/${summaryId}/sections/${sectionId}/columns`, data),
  updateColumn: (summaryId, sectionId, columnId, data) => axiosClient.patch(`/logistics/monthly-stock-summary/${summaryId}/sections/${sectionId}/columns/${columnId}`, data),
  deleteColumn: (summaryId, sectionId, columnId) => axiosClient.delete(`/logistics/monthly-stock-summary/${summaryId}/sections/${sectionId}/columns/${columnId}`),
  reorderColumns: (summaryId, sectionId, items) => axiosClient.patch(`/logistics/monthly-stock-summary/${summaryId}/sections/${sectionId}/columns/reorder`, { items }),
  duplicateColumn: (summaryId, sectionId, columnId) => axiosClient.post(`/logistics/monthly-stock-summary/${summaryId}/sections/${sectionId}/columns/${columnId}/duplicate`),

  // Row APIs
  addRow: (summaryId, sectionId, data) => axiosClient.post(`/logistics/monthly-stock-summary/${summaryId}/sections/${sectionId}/rows`, data),
  deleteRow: (summaryId, sectionId, rowId) => axiosClient.delete(`/logistics/monthly-stock-summary/${summaryId}/sections/${sectionId}/rows/${rowId}`),
  reorderRows: (summaryId, sectionId, items) => axiosClient.patch(`/logistics/monthly-stock-summary/${summaryId}/sections/${sectionId}/rows/reorder`, { items }),

  // Bulk Save APIs
  bulkSaveSection: (summaryId, sectionId, data) => axiosClient.post(`/logistics/monthly-stock-summary/${summaryId}/sections/${sectionId}/save`, data),
  saveAll: (summaryId, data) => axiosClient.post(`/logistics/monthly-stock-summary/${summaryId}/save-all`, data),
};

