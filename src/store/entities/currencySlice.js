import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

export const fetchCurrencies = createAsyncThunk("currencies/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/masters/currencies", { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch currencies");
  }
});

export const createCurrency = createAsyncThunk("currencies/create", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/masters/currencies", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create currency");
  }
});

export const updateCurrency = createAsyncThunk("currencies/update", async ({ id, ...data }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.patch(`/masters/currencies/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update currency");
  }
});

export const deleteCurrency = createAsyncThunk("currencies/delete", async (arg, { rejectWithValue }) => {
  try {
    const id = typeof arg === "object" ? arg.id : arg;
    const reason = typeof arg === "object" ? arg.reason : undefined;
    await axiosClient.delete(`/masters/currencies/${id}`, { params: { reason } });
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete currency");
  }
});

export const restoreCurrency = createAsyncThunk("currencies/restore", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosClient.patch(`/masters/currencies/${id}/restore`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to restore currency");
  }
});

export const permanentDeleteCurrency = createAsyncThunk("currencies/permanentDelete", async (arg, { rejectWithValue }) => {
  try {
    const id = typeof arg === "object" ? arg.id : arg;
    const reason = typeof arg === "object" ? arg.reason : undefined;
    await axiosClient.delete(`/masters/currencies/${id}/permanent`, { params: { reason } });
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to permanently delete currency");
  }
});

const currencySlice = createSlice({
  name: "currencies",
  initialState: {
    list: [],
    totalCount: 0,
    totalPages: 1,
    currentPage: 1,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCurrenciesError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrencies.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchCurrencies.fulfilled, (state, action) => { 
      state.isLoading = false; 
      state.list = action.payload.data || []; 
      state.totalCount = action.payload.total || 0;
      state.totalPages = action.payload.totalPages || 1;
      state.currentPage = action.payload.page || 1;
    })
      .addCase(fetchCurrencies.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(createCurrency.fulfilled, (state, action) => { state.list.unshift(action.payload); state.totalCount += 1; })
      .addCase(createCurrency.rejected, (state, action) => { state.error = action.payload; })

      .addCase(updateCurrency.fulfilled, (state, action) => {
        const idx = state.list.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(updateCurrency.rejected, (state, action) => { state.error = action.payload; })

      .addCase(deleteCurrency.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(deleteCurrency.rejected, (state, action) => { state.error = action.payload; })

      .addCase(restoreCurrency.fulfilled, (state, action) => {
        const idx = state.list.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(restoreCurrency.rejected, (state, action) => { state.error = action.payload; })

      .addCase(permanentDeleteCurrency.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(permanentDeleteCurrency.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearCurrenciesError } = currencySlice.actions;

export const selectCurrencies = (state) => state.entities.currencies.list;
export const selectCurrenciesTotalCount = (state) => state.entities.currencies.totalCount;
export const selectCurrenciesTotalPages = (state) => state.entities.currencies.totalPages;
export const selectCurrenciesLoading = (state) => state.entities.currencies.isLoading;
export const selectCurrenciesError = (state) => state.entities.currencies.error;

export default currencySlice.reducer;
