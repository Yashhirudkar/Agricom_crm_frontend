import axiosClient from "@/lib/axios";

export const enquiryApi = {
  getAll: (params) => axiosClient.get("/enquiries", { params }),
  getOne: (id) => axiosClient.get(`/enquiries/${id}`),
  create: (data) => axiosClient.post("/enquiries", data),
  update: (id, data) => axiosClient.patch(`/enquiries/${id}`, data),
  remove: (id) => axiosClient.delete(`/enquiries/${id}`),
};
