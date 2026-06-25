import axiosClient from "../../../lib/axios";

export const TaskEmployeeAPI = {
  getAssignableEmployees: async (params) => {
    const { data } = await axiosClient.get("/v1/tasks/employees/assignable", { params });
    return data.data;
  }
};
