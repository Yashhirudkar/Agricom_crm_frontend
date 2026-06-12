import axiosClient from "../axios";

export const getHolidays = async (params) => {
  const response = await axiosClient.get("/holidays", { params });
  return response.data;
};

export const getUpcomingHolidays = async () => {
  const response = await axiosClient.get("/holidays/upcoming");
  return response.data;
};

export const getHolidayById = async (id) => {
  const response = await axiosClient.get(`/holidays/${id}`);
  return response.data;
};

export const createHoliday = async (data) => {
  const response = await axiosClient.post("/holidays", data);
  return response.data;
};

export const createRecurringHolidays = async (data) => {
  const response = await axiosClient.post("/holidays/recurring", data);
  return response.data;
};

export const updateHoliday = async (id, data) => {
  const response = await axiosClient.put(`/holidays/${id}`, data);
  return response.data;
};

export const deleteHoliday = async (id) => {
  const response = await axiosClient.delete(`/holidays/${id}`);
  return response.data;
};
