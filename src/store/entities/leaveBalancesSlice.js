import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

export const fetchLeaveBalances = createAsyncThunk("entities/leaveBalances/fetchForEmployee", async ({ employeeId, year }, { rejectWithValue }) => {
  try {
    const params = year ? { year } : {};
    const res = await axiosClient.get(`/leave-balances/employee/${employeeId}`, { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch leave balances");
  }
});

const leaveBalancesSlice = createSlice({
  name: "leaveBalances",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearLeaveBalancesError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaveBalances.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchLeaveBalances.fulfilled, (state, action) => { 
        state.isLoading = false; 
        state.data = action.payload;
      })
      .addCase(fetchLeaveBalances.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });
  },
});

export const { clearLeaveBalancesError } = leaveBalancesSlice.actions;

export const selectLeaveBalancesData = (state) => state.entities.leaveBalances.data;
export const selectLeaveBalancesLoading = (state) => state.entities.leaveBalances.isLoading;
export const selectLeaveBalancesError = (state) => state.entities.leaveBalances.error;

export default leaveBalancesSlice.reducer;
