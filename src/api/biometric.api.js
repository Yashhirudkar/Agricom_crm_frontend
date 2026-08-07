import axiosClient from "../lib/axios";

export const biometricApi = {
  // ─── DEVICE MANAGEMENT ────────────────────────────────────────────────────
  getDevices: async () => {
    const res = await axiosClient.get("/biometric/devices");
    return res.data;
  },

  registerDevice: async (data) => {
    const res = await axiosClient.post("/biometric/devices", data);
    return res.data;
  },

  updateDevice: async (id, data) => {
    const res = await axiosClient.put(`/biometric/devices/${id}`, data);
    return res.data;
  },

  deleteDevice: async (id) => {
    const res = await axiosClient.delete(`/biometric/devices/${id}`);
    return res.data;
  },

  regenerateKey: async (id) => {
    const res = await axiosClient.post(`/biometric/devices/${id}/regenerate-key`);
    return res.data;
  },

  probeDevice: async (id) => {
    const res = await axiosClient.post(`/biometric/devices/${id}/probe`);
    return res.data;
  },

  syncDevice: async (id) => {
    const res = await axiosClient.post(`/biometric/devices/${id}/sync`);
    return res.data;
  },


  // ─── USER MAPPING ─────────────────────────────────────────────────────────
  getUnknownUsers: async () => {
    const res = await axiosClient.get("/biometric/punches/unknown-users");
    return res.data;
  },

  mapUser: async (biometricUserId, employeeId) => {
    const res = await axiosClient.post("/biometric/punches/map-user", {
      biometricUserId,
      employeeId,
    });
    return res.data;
  },

  mapUserBulk: async (mappings) => {
    const res = await axiosClient.post("/biometric/punches/map-user-bulk", {
      mappings,
    });
    return res.data;
  },

  // ─── PUNCH LOGS & RETRIES ─────────────────────────────────────────────────
  getPunchLogs: async (params = {}) => {
    const res = await axiosClient.get("/biometric/punches/logs", { params });
    return res.data;
  },

  retryFailed: async (id) => {
    const res = await axiosClient.post(`/biometric/punches/${id}/retry`);
    return res.data;
  },

  retryAllFailed: async () => {
    const res = await axiosClient.post("/biometric/punches/retry-all");
    return res.data;
  },

  // ─── METRICS & MONITORING ─────────────────────────────────────────────────
  getMetrics: async () => {
    const res = await axiosClient.get("/biometric/metrics");
    return res.data;
  },
};
