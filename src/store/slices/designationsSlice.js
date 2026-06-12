import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

export const fetchDesignations = createAsyncThunk("designations/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/designations", { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch designations");
  }
});

export const fetchDesignationById = createAsyncThunk("designations/fetchById", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get(`/designations/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch designation");
  }
});

export const createDesignation = createAsyncThunk("designations/create", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/designations", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create designation");
  }
});

export const updateDesignation = createAsyncThunk("designations/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.put(`/designations/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update designation");
  }
});

export const deleteDesignation = createAsyncThunk("designations/delete", async (id, { rejectWithValue }) => {
  try {
    await axiosClient.delete(`/designations/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete designation");
  }
});

const designationsSlice = createSlice({
  name: "designations",
  initialState: {
    data: { data: [], total: 0, page: 1, limit: 10, totalPages: 0 },
    current: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearDesignationsError(state) { state.error = null; },
    clearCurrentDesignation(state) { state.current = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDesignations.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchDesignations.fulfilled, (state, action) => { state.isLoading = false; state.data = action.payload; })
      .addCase(fetchDesignations.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(fetchDesignationById.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchDesignationById.fulfilled, (state, action) => { state.isLoading = false; state.current = action.payload; })
      .addCase(fetchDesignationById.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(createDesignation.fulfilled, (state, action) => {
        if (state.data?.data) {
          state.data.data.unshift(action.payload);
        }
      })
      .addCase(createDesignation.rejected, (state, action) => { state.error = action.payload; })

      .addCase(updateDesignation.fulfilled, (state, action) => {
        if (state.data?.data) {
          const idx = state.data.data.findIndex((d) => d.id === action.payload.id);
          if (idx !== -1) state.data.data[idx] = { ...state.data.data[idx], ...action.payload };
        }
        if (state.current?.id === action.payload.id) {
          state.current = { ...state.current, ...action.payload };
        }
      })
      .addCase(updateDesignation.rejected, (state, action) => { state.error = action.payload; })

      .addCase(deleteDesignation.fulfilled, (state, action) => {
        if (state.data?.data) {
          state.data.data = state.data.data.filter((d) => d.id !== action.payload);
        }
      })
      .addCase(deleteDesignation.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearDesignationsError, clearCurrentDesignation } = designationsSlice.actions;

export const selectDesignationsData = (state) => state.designations.data;
export const selectCurrentDesignation = (state) => state.designations.current;
export const selectDesignationsLoading = (state) => state.designations.isLoading;
export const selectDesignationsError = (state) => state.designations.error;

export default designationsSlice.reducer;
