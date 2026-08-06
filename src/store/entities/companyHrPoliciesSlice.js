import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

export const companyHrPoliciesAdapter = createEntityAdapter();

export const fetchCompanyHrPolicies = createAsyncThunk("entities/companyHrPolicies/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/company/hr-policies");
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch company HR policies");
  }
});

export const fetchAttendancePolicy = createAsyncThunk("entities/companyHrPolicies/fetchAttendancePolicy", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/attendance/policy");
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch attendance policy");
  }
});

export const fetchCompanyHrPolicyPreview = createAsyncThunk("entities/companyHrPolicies/fetchPreview", async (formData, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/company/hr-policies/preview", formData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch policy preview");
  }
});

export const fetchCompanyHrPolicyHistory = createAsyncThunk("entities/companyHrPolicies/fetchHistory", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/company/hr-policies/history");
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch policy history");
  }
});

export const fetchCompanyHrPolicyImpact = createAsyncThunk("entities/companyHrPolicies/fetchImpact", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/company/hr-policies/impact");
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch policy impact");
  }
});

export const upsertCompanyHrPolicies = createAsyncThunk("entities/companyHrPolicies/upsert", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.put("/company/hr-policies", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to upsert company HR policies");
  }
});

const companyHrPoliciesSlice = createSlice({
  name: "companyHrPolicies",
  initialState: companyHrPoliciesAdapter.getInitialState({
    currentPolicy: null,
    preview: null,
    history: [],
    impact: null,
    isLoading: false,
    error: null,
  }),
  reducers: {
    clearCompanyHrPoliciesError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyHrPolicies.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchCompanyHrPolicies.fulfilled, (state, action) => { 
        state.isLoading = false; 
        state.currentPolicy = action.payload;
        if (action.payload?.id) {
          companyHrPoliciesAdapter.upsertOne(state, action.payload);
        }
      })
      .addCase(fetchCompanyHrPolicies.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(fetchAttendancePolicy.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchAttendancePolicy.fulfilled, (state, action) => { 
        state.isLoading = false; 
        state.currentPolicy = action.payload;
        if (action.payload?.id) {
          companyHrPoliciesAdapter.upsertOne(state, action.payload);
        }
      })
      .addCase(fetchAttendancePolicy.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(fetchCompanyHrPolicyPreview.fulfilled, (state, action) => {
        state.preview = action.payload;
      })
      .addCase(fetchCompanyHrPolicyHistory.fulfilled, (state, action) => {
        state.history = action.payload || [];
      })
      .addCase(fetchCompanyHrPolicyImpact.fulfilled, (state, action) => {
        state.impact = action.payload;
      })

      .addCase(upsertCompanyHrPolicies.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(upsertCompanyHrPolicies.fulfilled, (state, action) => { 
        state.isLoading = false; 
        state.currentPolicy = action.payload;
        companyHrPoliciesAdapter.upsertOne(state, action.payload);
      })
      .addCase(upsertCompanyHrPolicies.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });
  },
});

export const { clearCompanyHrPoliciesError } = companyHrPoliciesSlice.actions;

export const selectCurrentHrPolicy = (state) => state.entities.companyHrPolicies.currentPolicy;
export const selectHrPolicyPreview = (state) => state.entities.companyHrPolicies.preview;
export const selectHrPolicyHistory = (state) => state.entities.companyHrPolicies.history;
export const selectHrPolicyImpact = (state) => state.entities.companyHrPolicies.impact;
export const selectHrPoliciesLoading = (state) => state.entities.companyHrPolicies.isLoading;
export const selectHrPoliciesError = (state) => state.entities.companyHrPolicies.error;

export default companyHrPoliciesSlice.reducer;
