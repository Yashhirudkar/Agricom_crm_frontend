import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

export const fetchPartnerRoles = createAsyncThunk("partnerRoles/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/masters/partner-roles", { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch partner roles");
  }
});

export const createPartnerRole = createAsyncThunk("partnerRoles/create", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/masters/partner-roles", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create partner role");
  }
});

export const updatePartnerRole = createAsyncThunk("partnerRoles/update", async ({ id, ...data }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.patch(`/masters/partner-roles/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update partner role");
  }
});

export const deletePartnerRole = createAsyncThunk("partnerRoles/delete", async (arg, { rejectWithValue }) => {
  try {
    const id = typeof arg === "object" ? arg.id : arg;
    const reason = typeof arg === "object" ? arg.reason : undefined;
    await axiosClient.delete(`/masters/partner-roles/${id}`, { params: { reason } });
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete partner role");
  }
});

export const restorePartnerRole = createAsyncThunk("partnerRoles/restore", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosClient.patch(`/masters/partner-roles/${id}/restore`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to restore partner role");
  }
});

export const permanentDeletePartnerRole = createAsyncThunk("partnerRoles/permanentDelete", async (arg, { rejectWithValue }) => {
  try {
    const id = typeof arg === "object" ? arg.id : arg;
    const reason = typeof arg === "object" ? arg.reason : undefined;
    await axiosClient.delete(`/masters/partner-roles/${id}/permanent`, { params: { reason } });
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to permanently delete partner role");
  }
});

const partnerRoleSlice = createSlice({
  name: "partnerRoles",
  initialState: {
    list: [],
    totalCount: 0,
    totalPages: 1,
    currentPage: 1,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearPartnerRolesError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPartnerRoles.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchPartnerRoles.fulfilled, (state, action) => { 
        state.isLoading = false; 
        state.list = action.payload.data || []; 
        state.totalCount = action.payload.total || 0;
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.page || 1;
      })
      .addCase(fetchPartnerRoles.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(createPartnerRole.fulfilled, (state, action) => { state.list.unshift(action.payload); state.totalCount += 1; })
      .addCase(createPartnerRole.rejected, (state, action) => { state.error = action.payload; })

      .addCase(updatePartnerRole.fulfilled, (state, action) => {
        const idx = state.list.findIndex((r) => r.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(updatePartnerRole.rejected, (state, action) => { state.error = action.payload; })

      .addCase(deletePartnerRole.fulfilled, (state, action) => {
        state.list = state.list.filter((r) => r.id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(deletePartnerRole.rejected, (state, action) => { state.error = action.payload; })

      .addCase(restorePartnerRole.fulfilled, (state, action) => {
        const idx = state.list.findIndex((r) => r.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(restorePartnerRole.rejected, (state, action) => { state.error = action.payload; })

      .addCase(permanentDeletePartnerRole.fulfilled, (state, action) => {
        state.list = state.list.filter((r) => r.id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(permanentDeletePartnerRole.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearPartnerRolesError } = partnerRoleSlice.actions;

export const selectPartnerRoles = (state) => state.entities.partnerRoles.list;
export const selectPartnerRolesTotalCount = (state) => state.entities.partnerRoles.totalCount;
export const selectPartnerRolesTotalPages = (state) => state.entities.partnerRoles.totalPages;
export const selectPartnerRolesLoading = (state) => state.entities.partnerRoles.isLoading;
export const selectPartnerRolesError = (state) => state.entities.partnerRoles.error;

export default partnerRoleSlice.reducer;
