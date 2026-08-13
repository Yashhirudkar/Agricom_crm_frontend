import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

export const fetchPartners = createAsyncThunk("partners/fetchAll", async (params, { rejectWithValue, signal }) => {
  try {
    const res = await axiosClient.get("/masters/partners", { params, signal });
    return res.data;
  } catch (err) {
    if (err.name === 'CanceledError' || axiosClient.isCancel?.(err)) {
      return rejectWithValue("canceled");
    }
    return rejectWithValue(err.response?.data?.message || "Failed to fetch partners");
  }
});

export const createPartner = createAsyncThunk("partners/create", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/masters/partners", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create partner");
  }
});

export const updatePartner = createAsyncThunk("partners/update", async ({ id, ...data }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.patch(`/masters/partners/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update partner");
  }
});

export const deletePartner = createAsyncThunk("partners/delete", async (arg, { rejectWithValue }) => {
  try {
    const id = typeof arg === "object" ? arg.id : arg;
    const reason = typeof arg === "object" ? arg.reason : undefined;
    await axiosClient.delete(`/masters/partners/${id}`, { params: { reason } });
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete partner");
  }
});

export const restorePartner = createAsyncThunk("partners/restore", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosClient.patch(`/masters/partners/${id}/restore`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to restore partner");
  }
});

export const permanentDeletePartner = createAsyncThunk("partners/permanentDelete", async (arg, { rejectWithValue }) => {
  try {
    const id = typeof arg === "object" ? arg.id : arg;
    const reason = typeof arg === "object" ? arg.reason : undefined;
    await axiosClient.delete(`/masters/partners/${id}/permanent`, { params: { reason } });
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to permanently delete partner");
  }
});

const partnerSlice = createSlice({
  name: "partners",
  initialState: {
    list: [],
    totalCount: 0,
    totalPages: 1,
    currentPage: 1,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearPartnersError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPartners.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchPartners.fulfilled, (state, action) => { 
      state.isLoading = false; 
      state.list = action.payload.data || []; 
      state.totalCount = action.payload.total || 0;
      state.totalPages = action.payload.totalPages || 1;
      state.currentPage = action.payload.page || 1;
    })
      .addCase(fetchPartners.rejected, (state, action) => {
        if (action.meta.aborted) {
          return;
        }
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(createPartner.fulfilled, (state, action) => { state.list.unshift(action.payload); state.totalCount += 1; })
      .addCase(createPartner.rejected, (state, action) => { state.error = action.payload; })

      .addCase(updatePartner.fulfilled, (state, action) => {
        const idx = state.list.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(updatePartner.rejected, (state, action) => { state.error = action.payload; })

      .addCase(deletePartner.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(deletePartner.rejected, (state, action) => { state.error = action.payload; })

      .addCase(restorePartner.fulfilled, (state, action) => {
        const idx = state.list.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(restorePartner.rejected, (state, action) => { state.error = action.payload; })

      .addCase(permanentDeletePartner.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(permanentDeletePartner.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearPartnersError } = partnerSlice.actions;

export const selectPartners = (state) => state.entities.partners.list;
export const selectPartnersTotalCount = (state) => state.entities.partners.totalCount;
export const selectPartnersTotalPages = (state) => state.entities.partners.totalPages;
export const selectPartnersLoading = (state) => state.entities.partners.isLoading;
export const selectPartnersError = (state) => state.entities.partners.error;

export default partnerSlice.reducer;
