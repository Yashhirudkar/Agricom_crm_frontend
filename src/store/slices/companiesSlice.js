import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

export const fetchCompanies = createAsyncThunk("companies/fetchAll", async (params = {}, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/GetCompanies", { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch companies");
  }
});

export const createCompany = createAsyncThunk("companies/create", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/CreateCompany", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create company");
  }
});

export const updateCompany = createAsyncThunk("companies/update", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/UpdateCompany", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update company");
  }
});

export const deleteCompany = createAsyncThunk("companies/delete", async (id, { rejectWithValue }) => {
  try {
    await axiosClient.post("/DeleteCompany", { id });
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete company");
  }
});

const companiesSlice = createSlice({
  name: "companies",
  initialState: {
    list: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCompaniesError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload && typeof action.payload === 'object' && !Array.isArray(action.payload)) {
          state.list = action.payload.data || [];
          state.total = action.payload.total || 0;
          state.page = action.payload.page || 1;
          state.limit = action.payload.limit || 10;
          state.totalPages = action.payload.totalPages || 1;
        } else {
          state.list = action.payload || [];
        }
      })
      .addCase(fetchCompanies.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(createCompany.fulfilled, (state, action) => { state.list.unshift(action.payload); })
      .addCase(createCompany.rejected, (state, action) => { state.error = action.payload; })

      .addCase(updateCompany.fulfilled, (state, action) => {
        const idx = state.list.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(updateCompany.rejected, (state, action) => { state.error = action.payload; })

      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteCompany.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearCompaniesError } = companiesSlice.actions;

export const selectCompanies = (state) => state.companies.list;
export const selectCompaniesMetadata = (state) => ({
  total: state.companies.total,
  page: state.companies.page,
  limit: state.companies.limit,
  totalPages: state.companies.totalPages,
});
export const selectCompaniesLoading = (state) => state.companies.isLoading;
export const selectCompaniesError = (state) => state.companies.error;

export default companiesSlice.reducer;
