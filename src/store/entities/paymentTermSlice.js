import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

export const fetchPaymentTerms = createAsyncThunk("paymentTerms/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/masters/payment-terms", { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch payment terms");
  }
});

export const createPaymentTerm = createAsyncThunk("paymentTerms/create", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/masters/payment-terms", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create payment term");
  }
});

export const updatePaymentTerm = createAsyncThunk("paymentTerms/update", async ({ id, ...data }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.patch(`/masters/payment-terms/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update payment term");
  }
});

export const deletePaymentTerm = createAsyncThunk("paymentTerms/delete", async (arg, { rejectWithValue }) => {
  try {
    const id = typeof arg === "object" ? arg.id : arg;
    const reason = typeof arg === "object" ? arg.reason : undefined;
    await axiosClient.delete(`/masters/payment-terms/${id}`, { params: { reason } });
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete payment term");
  }
});

export const restorePaymentTerm = createAsyncThunk("paymentTerms/restore", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosClient.patch(`/masters/payment-terms/${id}/restore`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to restore payment term");
  }
});

export const permanentDeletePaymentTerm = createAsyncThunk("paymentTerms/permanentDelete", async (arg, { rejectWithValue }) => {
  try {
    const id = typeof arg === "object" ? arg.id : arg;
    const reason = typeof arg === "object" ? arg.reason : undefined;
    await axiosClient.delete(`/masters/payment-terms/${id}/permanent`, { params: { reason } });
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to permanently delete payment term");
  }
});

const paymentTermSlice = createSlice({
  name: "paymentTerms",
  initialState: {
    list: [],
    totalCount: 0,
    totalPages: 1,
    currentPage: 1,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearPaymentTermsError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentTerms.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchPaymentTerms.fulfilled, (state, action) => { 
      state.isLoading = false; 
      state.list = action.payload.data || []; 
      state.totalCount = action.payload.total || 0;
      state.totalPages = action.payload.totalPages || 1;
      state.currentPage = action.payload.page || 1;
    })
      .addCase(fetchPaymentTerms.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(createPaymentTerm.fulfilled, (state, action) => { state.list.unshift(action.payload); state.totalCount += 1; })
      .addCase(createPaymentTerm.rejected, (state, action) => { state.error = action.payload; })

      .addCase(updatePaymentTerm.fulfilled, (state, action) => {
        const idx = state.list.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(updatePaymentTerm.rejected, (state, action) => { state.error = action.payload; })

      .addCase(deletePaymentTerm.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(deletePaymentTerm.rejected, (state, action) => { state.error = action.payload; })

      .addCase(restorePaymentTerm.fulfilled, (state, action) => {
        const idx = state.list.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(restorePaymentTerm.rejected, (state, action) => { state.error = action.payload; })

      .addCase(permanentDeletePaymentTerm.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(permanentDeletePaymentTerm.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearPaymentTermsError } = paymentTermSlice.actions;

export const selectPaymentTerms = (state) => state.entities.paymentTerms.list;
export const selectPaymentTermsTotalCount = (state) => state.entities.paymentTerms.totalCount;
export const selectPaymentTermsTotalPages = (state) => state.entities.paymentTerms.totalPages;
export const selectPaymentTermsLoading = (state) => state.entities.paymentTerms.isLoading;
export const selectPaymentTermsError = (state) => state.entities.paymentTerms.error;

export default paymentTermSlice.reducer;
