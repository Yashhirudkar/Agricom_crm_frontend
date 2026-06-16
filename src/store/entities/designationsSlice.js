import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

export const designationsAdapter = createEntityAdapter();

export const fetchDesignations = createAsyncThunk("entities/designations/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/designations", { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch designations");
  }
});

export const fetchDesignationHierarchy = createAsyncThunk("entities/designations/fetchHierarchy", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/designations/hierarchy");
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch designation hierarchy");
  }
});

export const fetchDesignationById = createAsyncThunk("entities/designations/fetchById", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get(`/designations/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch designation");
  }
});

export const createDesignation = createAsyncThunk("entities/designations/create", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/designations", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create designation");
  }
});

export const updateDesignation = createAsyncThunk("entities/designations/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.put(`/designations/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update designation");
  }
});

export const deleteDesignation = createAsyncThunk("entities/designations/delete", async (id, { rejectWithValue }) => {
  try {
    await axiosClient.delete(`/designations/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete designation");
  }
});

const designationsSlice = createSlice({
  name: "designations",
  initialState: designationsAdapter.getInitialState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    current: null,
    hierarchyData: [],
    isLoading: false,
    isHierarchyLoading: false,
    error: null,
  }),
  reducers: {
    clearDesignationsError(state) { state.error = null; },
    clearCurrentDesignation(state) { state.current = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDesignations.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchDesignations.fulfilled, (state, action) => { 
        state.isLoading = false; 
        designationsAdapter.setAll(state, action.payload.data);
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchDesignations.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(fetchDesignationHierarchy.pending, (state) => { state.isHierarchyLoading = true; })
      .addCase(fetchDesignationHierarchy.fulfilled, (state, action) => { state.isHierarchyLoading = false; state.hierarchyData = action.payload; })
      .addCase(fetchDesignationHierarchy.rejected, (state, action) => { state.isHierarchyLoading = false; state.error = action.payload; })

      .addCase(fetchDesignationById.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchDesignationById.fulfilled, (state, action) => { 
        state.isLoading = false; 
        state.current = action.payload; 
        designationsAdapter.upsertOne(state, action.payload);
      })
      .addCase(fetchDesignationById.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(createDesignation.fulfilled, (state, action) => {
        designationsAdapter.addOne(state, action.payload);
      })
      .addCase(createDesignation.rejected, (state, action) => { state.error = action.payload; })

      .addCase(updateDesignation.fulfilled, (state, action) => {
        designationsAdapter.upsertOne(state, action.payload);
        if (state.current?.id === action.payload.id) {
          state.current = { ...state.current, ...action.payload };
        }
      })
      .addCase(updateDesignation.rejected, (state, action) => { state.error = action.payload; })

      .addCase(deleteDesignation.fulfilled, (state, action) => {
        designationsAdapter.removeOne(state, action.payload);
      })
      .addCase(deleteDesignation.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearDesignationsError, clearCurrentDesignation } = designationsSlice.actions;

export const {
  selectAll: selectAllDesignations,
  selectById: selectDesignationById
} = designationsAdapter.getSelectors(state => state.entities.designations);

export const selectDesignationsData = createSelector(
  [
    selectAllDesignations,
    (state) => state.entities.designations.total,
    (state) => state.entities.designations.page,
    (state) => state.entities.designations.limit,
    (state) => state.entities.designations.totalPages
  ],
  (data, total, page, limit, totalPages) => ({
    data,
    total,
    page,
    limit,
    totalPages
  })
);

export const selectDesignationHierarchy = (state) => state.entities.designations.hierarchyData;
export const selectCurrentDesignation = (state) => state.entities.designations.current;
export const selectDesignationsLoading = (state) => state.entities.designations.isLoading;
export const selectDesignationsError = (state) => state.entities.designations.error;

export default designationsSlice.reducer;
