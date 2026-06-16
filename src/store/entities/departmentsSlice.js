import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

export const departmentsAdapter = createEntityAdapter();

export const fetchDepartments = createAsyncThunk("entities/departments/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/departments", { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch departments");
  }
});

export const fetchDepartmentTree = createAsyncThunk("entities/departments/fetchTree", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/departments/tree");
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch department tree");
  }
});

export const fetchDepartmentById = createAsyncThunk("entities/departments/fetchById", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get(`/departments/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch department");
  }
});

export const createDepartment = createAsyncThunk("entities/departments/create", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/departments", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create department");
  }
});

export const updateDepartment = createAsyncThunk("entities/departments/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.put(`/departments/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update department");
  }
});

export const deleteDepartment = createAsyncThunk("entities/departments/delete", async (id, { rejectWithValue }) => {
  try {
    await axiosClient.delete(`/departments/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete department");
  }
});

const departmentsSlice = createSlice({
  name: "departments",
  initialState: departmentsAdapter.getInitialState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    current: null,
    treeData: [],
    isLoading: false,
    isTreeLoading: false,
    error: null,
  }),
  reducers: {
    clearDepartmentsError(state) { state.error = null; },
    clearCurrentDepartment(state) { state.current = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchDepartments.fulfilled, (state, action) => { 
        state.isLoading = false; 
        departmentsAdapter.setAll(state, action.payload.data);
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchDepartments.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(fetchDepartmentTree.pending, (state) => { state.isTreeLoading = true; })
      .addCase(fetchDepartmentTree.fulfilled, (state, action) => { state.isTreeLoading = false; state.treeData = action.payload; })
      .addCase(fetchDepartmentTree.rejected, (state, action) => { state.isTreeLoading = false; state.error = action.payload; })

      .addCase(fetchDepartmentById.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchDepartmentById.fulfilled, (state, action) => { 
        state.isLoading = false; 
        state.current = action.payload; 
        departmentsAdapter.upsertOne(state, action.payload);
      })
      .addCase(fetchDepartmentById.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(createDepartment.fulfilled, (state, action) => {
        departmentsAdapter.addOne(state, action.payload);
      })
      .addCase(createDepartment.rejected, (state, action) => { state.error = action.payload; })

      .addCase(updateDepartment.fulfilled, (state, action) => {
        departmentsAdapter.upsertOne(state, action.payload);
        if (state.current?.id === action.payload.id) {
          state.current = { ...state.current, ...action.payload };
        }
      })
      .addCase(updateDepartment.rejected, (state, action) => { state.error = action.payload; })

      .addCase(deleteDepartment.fulfilled, (state, action) => {
        departmentsAdapter.removeOne(state, action.payload);
      })
      .addCase(deleteDepartment.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearDepartmentsError, clearCurrentDepartment } = departmentsSlice.actions;

export const {
  selectAll: selectAllDepartments,
  selectById: selectDepartmentById
} = departmentsAdapter.getSelectors(state => state.entities.departments);

export const selectDepartmentsData = createSelector(
  [
    selectAllDepartments,
    (state) => state.entities.departments.total,
    (state) => state.entities.departments.page,
    (state) => state.entities.departments.limit,
    (state) => state.entities.departments.totalPages
  ],
  (data, total, page, limit, totalPages) => ({
    data,
    total,
    page,
    limit,
    totalPages
  })
);

export const selectDepartmentTree = (state) => state.entities.departments.treeData;
export const selectCurrentDepartment = (state) => state.entities.departments.current;
export const selectDepartmentsLoading = (state) => state.entities.departments.isLoading;
export const selectDepartmentsError = (state) => state.entities.departments.error;

export default departmentsSlice.reducer;
