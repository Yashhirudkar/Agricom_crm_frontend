import axiosClient from "../lib/axios";

export const rbacApi = {
  getRoles: async (params = {}) => {
    const response = await axiosClient.get("/v1/roles", { params });
    return response.data;
  },
  getRoleById: async (id) => {
    const response = await axiosClient.get(`/v1/roles/${id}`);
    return response.data;
  },
  createRole: async (data) => {
    const response = await axiosClient.post("/v1/roles", data);
    return response.data;
  },
  updateRole: async (id, data) => {
    const response = await axiosClient.patch(`/v1/roles/${id}`, data);
    return response.data;
  },
  deleteRole: async (id) => {
    const response = await axiosClient.delete(`/v1/roles/${id}`);
    return response.data;
  },
};
