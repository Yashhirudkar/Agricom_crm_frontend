import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

export const branchesAdapter = createEntityAdapter();

export const fetchBranches = createAsyncThunk("entities/branches/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/branches", { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch branches");
  }
});

export const fetchBranchById = createAsyncThunk("entities/branches/fetchById", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get(`/branches/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch branch");
  }
});

export const createBranch = createAsyncThunk("entities/branches/create", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/branches", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create branch");
  }
});

export const updateBranch = createAsyncThunk("entities/branches/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.put(`/branches/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update branch");
  }
});

export const deleteBranch = createAsyncThunk("entities/branches/delete", async (id, { rejectWithValue }) => {
  try {
    await axiosClient.delete(`/branches/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete branch");
  }
});

const branchesSlice = createSlice({
  name: "branches",
  initialState: branchesAdapter.getInitialState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    current: null,
    isLoading: false,
    error: null,
  }),
  reducers: {
    clearBranchesError(state) { state.error = null; },
    clearCurrentBranch(state) { state.current = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranches.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchBranches.fulfilled, (state, action) => { 
        state.isLoading = false; 
        branchesAdapter.setAll(state, action.payload.data || action.payload);
        state.total = action.payload.total || action.payload.length;
        state.page = action.payload.page || 1;
        state.limit = action.payload.limit || 10;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchBranches.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(fetchBranchById.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchBranchById.fulfilled, (state, action) => { 
        state.isLoading = false; 
        state.current = action.payload; 
        branchesAdapter.upsertOne(state, action.payload);
      })
      .addCase(fetchBranchById.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(createBranch.fulfilled, (state, action) => {
        branchesAdapter.addOne(state, action.payload);
      })
      .addCase(createBranch.rejected, (state, action) => { state.error = action.payload; })

      .addCase(updateBranch.fulfilled, (state, action) => {
        branchesAdapter.upsertOne(state, action.payload);
        if (state.current?.id === action.payload.id) {
          state.current = { ...state.current, ...action.payload };
        }
      })
      .addCase(updateBranch.rejected, (state, action) => { state.error = action.payload; })

      .addCase(deleteBranch.fulfilled, (state, action) => {
        branchesAdapter.removeOne(state, action.payload);
      })
      .addCase(deleteBranch.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearBranchesError, clearCurrentBranch } = branchesSlice.actions;

export const {
  selectAll: selectAllBranches,
  selectById: selectBranchById
} = branchesAdapter.getSelectors(state => state.entities.branches);

export const selectBranchesData = createSelector(
  [
    selectAllBranches,
    (state) => state.entities.branches.total,
    (state) => state.entities.branches.page,
    (state) => state.entities.branches.limit,
    (state) => state.entities.branches.totalPages
  ],
  (data, total, page, limit, totalPages) => ({
    data,
    total,
    page,
    limit,
    totalPages
  })
);

export const selectCurrentBranch = (state) => state.entities.branches.current;
export const selectBranchesLoading = (state) => state.entities.branches.isLoading;
export const selectBranchesError = (state) => state.entities.branches.error;

export default branchesSlice.reducer;
