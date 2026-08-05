import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

export const leaveRequestsAdapter = createEntityAdapter();

export const applyLeave = createAsyncThunk("entities/leaveRequests/apply", async (formData, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/leave-requests/apply", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to apply leave");
  }
});

export const fetchLeaveRequests = createAsyncThunk("entities/leaveRequests/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/leave-requests", { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch leave requests");
  }
});

export const fetchMyLeaves = createAsyncThunk("entities/leaveRequests/fetchMy", async (params, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/leave-requests/my-leaves", { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch my leaves");
  }
});

export const fetchLeaveDashboardSummary = createAsyncThunk("entities/leaveRequests/fetchSummary", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/leave-requests/dashboard/summary");
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch dashboard summary");
  }
});

export const approveLeave = createAsyncThunk("entities/leaveRequests/approve", async ({ id, remarks }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.put(`/leave-requests/${id}/approve`, { remarks });
    return { id, ...res.data };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to approve leave");
  }
});

export const rejectLeave = createAsyncThunk("entities/leaveRequests/reject", async ({ id, remarks }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.put(`/leave-requests/${id}/reject`, { reason: remarks });
    return { id, ...res.data };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to reject leave");
  }
});

export const cancelLeave = createAsyncThunk("entities/leaveRequests/cancel", async ({ id, reason }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.put(`/leave-requests/${id}/cancel`, { reason });
    return { id, ...res.data };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to cancel leave");
  }
});

const leaveRequestsSlice = createSlice({
  name: "leaveRequests",
  initialState: leaveRequestsAdapter.getInitialState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    dashboardSummary: null,
    isLoading: false,
    error: null,
  }),
  reducers: {
    clearLeaveRequestsError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All (Company)
      .addCase(fetchLeaveRequests.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchLeaveRequests.fulfilled, (state, action) => { 
        state.isLoading = false; 
        const payload = action.payload;
        const data = payload.data || payload;
        const meta = payload.meta || {};
        leaveRequestsAdapter.setAll(state, data);
        state.total = meta.total ?? payload.total ?? (Array.isArray(data) ? data.length : 0);
        state.page = meta.page ?? payload.page ?? 1;
        state.limit = meta.limit ?? payload.limit ?? 10;
        state.totalPages = meta.totalPages ?? payload.totalPages ?? 1;
      })
      .addCase(fetchLeaveRequests.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      // Fetch My Leaves
      .addCase(fetchMyLeaves.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchMyLeaves.fulfilled, (state, action) => { 
        state.isLoading = false; 
        const payload = action.payload;
        const data = payload.data || payload;
        const meta = payload.meta || {};
        leaveRequestsAdapter.setAll(state, data);
        state.total = meta.total ?? payload.total ?? (Array.isArray(data) ? data.length : 0);
        state.page = meta.page ?? payload.page ?? 1;
        state.limit = meta.limit ?? payload.limit ?? 10;
        state.totalPages = meta.totalPages ?? payload.totalPages ?? 1;
      })
      .addCase(fetchMyLeaves.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      // Apply Leave
      .addCase(applyLeave.fulfilled, (state, action) => {
        leaveRequestsAdapter.addOne(state, action.payload);
      })
      .addCase(applyLeave.rejected, (state, action) => { state.error = action.payload; })

      // Dashboard Summary
      .addCase(fetchLeaveDashboardSummary.fulfilled, (state, action) => {
        state.dashboardSummary = action.payload;
      })

      // Status updates (Approve, Reject, Cancel)
      // Backend may return { message: '...' } instead of full entity.
      // Guard: only upsert if the payload has a valid id (i.e. it's the full entity).
      // Otherwise, remove the stale entity so it doesn't render with undefined dates.
      .addCase(approveLeave.fulfilled, (state, action) => {
        if (action.payload?.id) {
          leaveRequestsAdapter.upsertOne(state, action.payload);
        } else {
          leaveRequestsAdapter.removeOne(state, action.meta.arg.id);
        }
      })
      .addCase(rejectLeave.fulfilled, (state, action) => {
        if (action.payload?.id) {
          leaveRequestsAdapter.upsertOne(state, action.payload);
        } else {
          leaveRequestsAdapter.removeOne(state, action.meta.arg.id);
        }
      })
      .addCase(cancelLeave.fulfilled, (state, action) => {
        if (action.payload?.id) {
          leaveRequestsAdapter.upsertOne(state, action.payload);
        } else {
          leaveRequestsAdapter.removeOne(state, action.meta.arg.id);
        }
      });
  },
});

export const { clearLeaveRequestsError } = leaveRequestsSlice.actions;

export const {
  selectAll: selectAllLeaveRequests,
  selectById: selectLeaveRequestById
} = leaveRequestsAdapter.getSelectors(state => state.entities.leaveRequests);

export const selectLeaveRequestsData = createSelector(
  [
    selectAllLeaveRequests,
    (state) => state.entities.leaveRequests.total,
    (state) => state.entities.leaveRequests.page,
    (state) => state.entities.leaveRequests.limit,
    (state) => state.entities.leaveRequests.totalPages,
    (state) => state.entities.leaveRequests.dashboardSummary
  ],
  (data, total, page, limit, totalPages, dashboardSummary) => ({
    data,
    total,
    page,
    limit,
    totalPages,
    dashboardSummary
  })
);

export const selectLeaveRequestsLoading = (state) => state.entities.leaveRequests.isLoading;
export const selectLeaveRequestsError = (state) => state.entities.leaveRequests.error;

export default leaveRequestsSlice.reducer;
