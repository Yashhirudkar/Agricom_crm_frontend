import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

export const leaveTypesAdapter = createEntityAdapter();

export const fetchLeaveTypes = createAsyncThunk("entities/leaveTypes/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/leave-types", { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch leave types");
  }
});

export const fetchLeaveTypesForApply = createAsyncThunk("entities/leaveTypes/fetchForApply", async (params, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/leave-types/for-apply", { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch leave types");
  }
});

export const fetchLeaveTypeById = createAsyncThunk("entities/leaveTypes/fetchById", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get(`/leave-types/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch leave type");
  }
});

export const createLeaveType = createAsyncThunk("entities/leaveTypes/create", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/leave-types", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create leave type");
  }
});

export const updateLeaveType = createAsyncThunk("entities/leaveTypes/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.put(`/leave-types/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update leave type");
  }
});

export const deleteLeaveType = createAsyncThunk("entities/leaveTypes/delete", async (id, { rejectWithValue }) => {
  try {
    await axiosClient.delete(`/leave-types/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete leave type");
  }
});

const leaveTypesSlice = createSlice({
  name: "leaveTypes",
  initialState: leaveTypesAdapter.getInitialState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    current: null,
    isLoading: false,
    error: null,
  }),
  reducers: {
    clearLeaveTypesError(state) { state.error = null; },
    clearCurrentLeaveType(state) { state.current = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaveTypes.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchLeaveTypes.fulfilled, (state, action) => { 
        state.isLoading = false; 
        leaveTypesAdapter.setAll(state, action.payload.data || action.payload);
        state.total = action.payload.total || action.payload.length;
        state.page = action.payload.page || 1;
        state.limit = action.payload.limit || 10;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchLeaveTypes.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(fetchLeaveTypesForApply.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchLeaveTypesForApply.fulfilled, (state, action) => { 
        state.isLoading = false; 
        leaveTypesAdapter.setAll(state, action.payload.data || action.payload);
        state.total = action.payload.total || action.payload.length;
        state.page = action.payload.page || 1;
        state.limit = action.payload.limit || 10;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchLeaveTypesForApply.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(fetchLeaveTypeById.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchLeaveTypeById.fulfilled, (state, action) => { 
        state.isLoading = false; 
        state.current = action.payload; 
        leaveTypesAdapter.upsertOne(state, action.payload);
      })
      .addCase(fetchLeaveTypeById.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(createLeaveType.fulfilled, (state, action) => {
        leaveTypesAdapter.addOne(state, action.payload);
      })
      .addCase(createLeaveType.rejected, (state, action) => { state.error = action.payload; })

      .addCase(updateLeaveType.fulfilled, (state, action) => {
        leaveTypesAdapter.upsertOne(state, action.payload);
        if (state.current?.id === action.payload.id) {
          state.current = { ...state.current, ...action.payload };
        }
      })
      .addCase(updateLeaveType.rejected, (state, action) => { state.error = action.payload; })

      .addCase(deleteLeaveType.fulfilled, (state, action) => {
        leaveTypesAdapter.removeOne(state, action.payload);
      })
      .addCase(deleteLeaveType.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearLeaveTypesError, clearCurrentLeaveType } = leaveTypesSlice.actions;

export const {
  selectAll: selectAllLeaveTypes,
  selectById: selectLeaveTypeById
} = leaveTypesAdapter.getSelectors(state => state.entities.leaveTypes);

export const selectLeaveTypesData = createSelector(
  [
    selectAllLeaveTypes,
    (state) => state.entities.leaveTypes.total,
    (state) => state.entities.leaveTypes.page,
    (state) => state.entities.leaveTypes.limit,
    (state) => state.entities.leaveTypes.totalPages
  ],
  (data, total, page, limit, totalPages) => ({
    data,
    total,
    page,
    limit,
    totalPages
  })
);

export const selectCurrentLeaveType = (state) => state.entities.leaveTypes.current;
export const selectLeaveTypesLoading = (state) => state.entities.leaveTypes.isLoading;
export const selectLeaveTypesError = (state) => state.entities.leaveTypes.error;

export default leaveTypesSlice.reducer;
