import axiosClient from "@/lib/axios";

export const portsApi = {
  // ─── Ports ───────────────────────────────────────────────────────────────────
  getPorts: async (params = {}) => {
    const res = await axiosClient.get("/masters/ports", { params });
    return res.data;
  },

  getPortById: async (id) => {
    const res = await axiosClient.get(`/masters/ports/${id}`);
    return res.data;
  },

  createPort: async (data) => {
    const res = await axiosClient.post("/masters/ports", data);
    return res.data;
  },

  updatePort: async (id, data) => {
    const res = await axiosClient.put(`/masters/ports/${id}`, data);
    return res.data;
  },

  togglePortStatus: async (id) => {
    const res = await axiosClient.patch(`/masters/ports/${id}/toggle`);
    return res.data;
  },

  deletePort: async (id) => {
    const res = await axiosClient.delete(`/masters/ports/${id}`);
    return res.data;
  },

  addShippingLineToPort: async (portId, data) => {
    const res = await axiosClient.post(`/masters/ports/${portId}/shipping-lines`, data);
    return res.data;
  },

  removeShippingLineFromPort: async (portId, lineId) => {
    const res = await axiosClient.delete(`/masters/ports/${portId}/shipping-lines/${lineId}`);
    return res.data;
  },

  importPorts: async (payload) => {
    if (payload instanceof FormData) {
      const res = await axiosClient.post("/masters/ports/import", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    }
    const res = await axiosClient.post("/masters/ports/import", { rows: payload });
    return res.data;
  },

  exportPorts: async () => {
    const res = await axiosClient.get("/masters/ports/export", {
      responseType: "blob",
    });
    return res.data;
  },

  getImportTemplate: async () => {
    const res = await axiosClient.get("/masters/ports/template", {
      responseType: "blob",
    });
    return res.data;
  },

  // ─── Shipping Lines ──────────────────────────────────────────────────────────
  getShippingLines: async (params = {}) => {
    const res = await axiosClient.get("/masters/shipping-lines", { params });
    return res.data;
  },

  getShippingLineById: async (id) => {
    const res = await axiosClient.get(`/masters/shipping-lines/${id}`);
    return res.data;
  },

  createShippingLine: async (data) => {
    const res = await axiosClient.post("/masters/shipping-lines", data);
    return res.data;
  },

  updateShippingLine: async (id, data) => {
    const res = await axiosClient.put(`/masters/shipping-lines/${id}`, data);
    return res.data;
  },

  toggleShippingLineStatus: async (id) => {
    const res = await axiosClient.patch(`/masters/shipping-lines/${id}/toggle`);
    return res.data;
  },

  deleteShippingLine: async (id) => {
    const res = await axiosClient.delete(`/masters/shipping-lines/${id}`);
    return res.data;
  },

  // ─── Countries ───────────────────────────────────────────────────────────────
  getCountries: async (params = {}) => {
    const res = await axiosClient.get("/masters/countries", { params });
    return res.data;
  },

  createCountry: async (data) => {
    const res = await axiosClient.post("/masters/countries", data);
    return res.data;
  },
};
