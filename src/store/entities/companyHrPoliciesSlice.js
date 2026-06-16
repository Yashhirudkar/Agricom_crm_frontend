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
export const selectHrPoliciesLoading = (state) => state.entities.companyHrPolicies.isLoading;
export const selectHrPoliciesError = (state) => state.entities.companyHrPolicies.error;

export default companyHrPoliciesSlice.reducer;
