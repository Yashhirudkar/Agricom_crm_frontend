import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

export const fetchFinancialYears = createAsyncThunk("financialYears/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/masters/financial-years", { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch financial years");
  }
});

export const createFinancialYear = createAsyncThunk("financialYears/create", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/masters/financial-years", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create financial year");
  }
});

export const updateFinancialYear = createAsyncThunk("financialYears/update", async ({ id, ...data }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.patch(`/masters/financial-years/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update financial year");
  }
});

export const deleteFinancialYear = createAsyncThunk("financialYears/delete", async (arg, { rejectWithValue }) => {
  try {
    const id = typeof arg === "object" ? arg.id : arg;
    const reason = typeof arg === "object" ? arg.reason : undefined;
    await axiosClient.delete(`/masters/financial-years/${id}`, { params: { reason } });
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete financial year");
  }
});

export const restoreFinancialYear = createAsyncThunk("financialYears/restore", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosClient.patch(`/masters/financial-years/${id}/restore`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to restore financial year");
  }
});

export const permanentDeleteFinancialYear = createAsyncThunk("financialYears/permanentDelete", async (arg, { rejectWithValue }) => {
  try {
    const id = typeof arg === "object" ? arg.id : arg;
    const reason = typeof arg === "object" ? arg.reason : undefined;
    await axiosClient.delete(`/masters/financial-years/${id}/permanent`, { params: { reason } });
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to permanently delete financial year");
  }
});

const financialYearSlice = createSlice({
  name: "financialYears",
  initialState: {
    list: [],
    totalCount: 0,
    totalPages: 1,
    currentPage: 1,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearFinancialYearsError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFinancialYears.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchFinancialYears.fulfilled, (state, action) => { 
      state.isLoading = false; 
      state.list = action.payload.data || []; 
      state.totalCount = action.payload.total || 0;
      state.totalPages = action.payload.totalPages || 1;
      state.currentPage = action.payload.page || 1;
    })
      .addCase(fetchFinancialYears.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(createFinancialYear.fulfilled, (state, action) => { state.list.unshift(action.payload); state.totalCount += 1; })
      .addCase(createFinancialYear.rejected, (state, action) => { state.error = action.payload; })

      .addCase(updateFinancialYear.fulfilled, (state, action) => {
        const idx = state.list.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(updateFinancialYear.rejected, (state, action) => { state.error = action.payload; })

      .addCase(deleteFinancialYear.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(deleteFinancialYear.rejected, (state, action) => { state.error = action.payload; })

      .addCase(restoreFinancialYear.fulfilled, (state, action) => {
        const idx = state.list.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(restoreFinancialYear.rejected, (state, action) => { state.error = action.payload; })

      .addCase(permanentDeleteFinancialYear.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(permanentDeleteFinancialYear.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearFinancialYearsError } = financialYearSlice.actions;

export const selectFinancialYears = (state) => state.entities.financialYears.list;
export const selectFinancialYearsTotalCount = (state) => state.entities.financialYears.totalCount;
export const selectFinancialYearsTotalPages = (state) => state.entities.financialYears.totalPages;
export const selectFinancialYearsLoading = (state) => state.entities.financialYears.isLoading;
export const selectFinancialYearsError = (state) => state.entities.financialYears.error;

export default financialYearSlice.reducer;
