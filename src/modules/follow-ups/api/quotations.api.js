import axiosClient from '@/lib/axios';

export const QuotationsAPI = {
  create: (payload) =>
    axiosClient.post('/quotations', payload).then((r) => r.data),

  getList: (params) =>
    axiosClient.get('/quotations', { params }).then((r) => r.data),

  getOne: (id) =>
    axiosClient.get(`/quotations/${id}`).then((r) => r.data),

  update: (id, payload) =>
    axiosClient.patch(`/quotations/${id}`, payload).then((r) => r.data),

  remove: (id) =>
    axiosClient.delete(`/quotations/${id}`).then((r) => r.data),
};
