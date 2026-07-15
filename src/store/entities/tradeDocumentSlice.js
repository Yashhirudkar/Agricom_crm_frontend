import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

export const fetchTradeDocuments = createAsyncThunk("tradeDocuments/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/masters/trade-documents", { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch trade documents");
  }
});

export const createTradeDocument = createAsyncThunk("tradeDocuments/create", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/masters/trade-documents", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create trade document");
  }
});

export const updateTradeDocument = createAsyncThunk("tradeDocuments/update", async ({ id, ...data }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.patch(`/masters/trade-documents/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update trade document");
  }
});

export const deleteTradeDocument = createAsyncThunk("tradeDocuments/delete", async (arg, { rejectWithValue }) => {
  try {
    const id = typeof arg === "object" ? arg.id : arg;
    const reason = typeof arg === "object" ? arg.reason : undefined;
    await axiosClient.delete(`/masters/trade-documents/${id}`, { params: { reason } });
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete trade document");
  }
});

export const restoreTradeDocument = createAsyncThunk("tradeDocuments/restore", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosClient.patch(`/masters/trade-documents/${id}/restore`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to restore trade document");
  }
});

export const permanentDeleteTradeDocument = createAsyncThunk("tradeDocuments/permanentDelete", async (arg, { rejectWithValue }) => {
  try {
    const id = typeof arg === "object" ? arg.id : arg;
    const reason = typeof arg === "object" ? arg.reason : undefined;
    await axiosClient.delete(`/masters/trade-documents/${id}/permanent`, { params: { reason } });
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to permanently delete trade document");
  }
});

const tradeDocumentSlice = createSlice({
  name: "tradeDocuments",
  initialState: {
    list: [],
    totalCount: 0,
    totalPages: 1,
    currentPage: 1,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearTradeDocumentsError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTradeDocuments.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchTradeDocuments.fulfilled, (state, action) => { 
      state.isLoading = false; 
      state.list = action.payload.data || []; 
      state.totalCount = action.payload.total || 0;
      state.totalPages = action.payload.totalPages || 1;
      state.currentPage = action.payload.page || 1;
    })
      .addCase(fetchTradeDocuments.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(createTradeDocument.fulfilled, (state, action) => { state.list.unshift(action.payload); state.totalCount += 1; })
      .addCase(createTradeDocument.rejected, (state, action) => { state.error = action.payload; })

      .addCase(updateTradeDocument.fulfilled, (state, action) => {
        const idx = state.list.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(updateTradeDocument.rejected, (state, action) => { state.error = action.payload; })

      .addCase(deleteTradeDocument.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(deleteTradeDocument.rejected, (state, action) => { state.error = action.payload; })

      .addCase(restoreTradeDocument.fulfilled, (state, action) => {
        const idx = state.list.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(restoreTradeDocument.rejected, (state, action) => { state.error = action.payload; })

      .addCase(permanentDeleteTradeDocument.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(permanentDeleteTradeDocument.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearTradeDocumentsError } = tradeDocumentSlice.actions;

export const selectTradeDocuments = (state) => state.entities.tradeDocuments.list;
export const selectTradeDocumentsTotalCount = (state) => state.entities.tradeDocuments.totalCount;
export const selectTradeDocumentsTotalPages = (state) => state.entities.tradeDocuments.totalPages;
export const selectTradeDocumentsLoading = (state) => state.entities.tradeDocuments.isLoading;
export const selectTradeDocumentsError = (state) => state.entities.tradeDocuments.error;

export default tradeDocumentSlice.reducer;
