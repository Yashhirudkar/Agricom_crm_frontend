import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

export const fetchDepartments = createAsyncThunk("departments/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/departments", { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch departments");
  }
});

export const fetchDepartmentById = createAsyncThunk("departments/fetchById", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get(`/departments/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch department");
  }
});

export const createDepartment = createAsyncThunk("departments/create", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/departments", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create department");
  }
});

export const updateDepartment = createAsyncThunk("departments/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.put(`/departments/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update department");
  }
});

export const deleteDepartment = createAsyncThunk("departments/delete", async (id, { rejectWithValue }) => {
  try {
    await axiosClient.delete(`/departments/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete department");
  }
});

const departmentsSlice = createSlice({
  name: "departments",
  initialState: {
    data: { data: [], total: 0, page: 1, limit: 10, totalPages: 0 },
    current: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearDepartmentsError(state) { state.error = null; },
    clearCurrentDepartment(state) { state.current = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchDepartments.fulfilled, (state, action) => { state.isLoading = false; state.data = action.payload; })
      .addCase(fetchDepartments.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(fetchDepartmentById.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchDepartmentById.fulfilled, (state, action) => { state.isLoading = false; state.current = action.payload; })
      .addCase(fetchDepartmentById.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(createDepartment.fulfilled, (state, action) => {
        // Just invalidate/refetch in component, or unshift if we ignore pagination
        if (state.data?.data) {
          state.data.data.unshift(action.payload);
        }
      })
      .addCase(createDepartment.rejected, (state, action) => { state.error = action.payload; })

      .addCase(updateDepartment.fulfilled, (state, action) => {
        if (state.data?.data) {
          const idx = state.data.data.findIndex((d) => d.id === action.payload.id);
          if (idx !== -1) state.data.data[idx] = { ...state.data.data[idx], ...action.payload };
        }
        if (state.current?.id === action.payload.id) {
          state.current = { ...state.current, ...action.payload };
        }
      })
      .addCase(updateDepartment.rejected, (state, action) => { state.error = action.payload; })

      .addCase(deleteDepartment.fulfilled, (state, action) => {
        if (state.data?.data) {
          state.data.data = state.data.data.filter((d) => d.id !== action.payload);
        }
      })
      .addCase(deleteDepartment.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearDepartmentsError, clearCurrentDepartment } = departmentsSlice.actions;

export const selectDepartmentsData = (state) => state.departments.data;
export const selectCurrentDepartment = (state) => state.departments.current;
export const selectDepartmentsLoading = (state) => state.departments.isLoading;
export const selectDepartmentsError = (state) => state.departments.error;

export default departmentsSlice.reducer;
