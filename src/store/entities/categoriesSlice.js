import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

export const fetchCategories = createAsyncThunk("categories/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/masters/categories", { params });
    // Assuming NestJS backend returns data directly or inside .data
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch categories");
  }
});

export const createCategory = createAsyncThunk("categories/create", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/masters/categories", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create category");
  }
});

export const updateCategory = createAsyncThunk("categories/update", async ({ id, ...data }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.patch(`/masters/categories/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update category");
  }
});

export const deleteCategory = createAsyncThunk("categories/delete", async (arg, { rejectWithValue }) => {
  try {
    const id = typeof arg === "object" ? arg.id : arg;
    const reason = typeof arg === "object" ? arg.reason : undefined;
    await axiosClient.delete(`/masters/categories/${id}`, { params: { reason } });
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete category");
  }
});

export const restoreCategory = createAsyncThunk("categories/restore", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosClient.patch(`/masters/categories/${id}/restore`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to restore category");
  }
});

export const permanentDeleteCategory = createAsyncThunk("categories/permanentDelete", async (arg, { rejectWithValue }) => {
  try {
    const id = typeof arg === "object" ? arg.id : arg;
    const reason = typeof arg === "object" ? arg.reason : undefined;
    await axiosClient.delete(`/masters/categories/${id}/permanent`, { params: { reason } });
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to permanently delete category");
  }
});

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    list: [],
    totalCount: 0,
    totalPages: 1,
    currentPage: 1,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCategoriesError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchCategories.fulfilled, (state, action) => { 
        state.isLoading = false; 
        state.list = action.payload.data || action.payload || []; 
        state.totalCount = action.payload.total || (action.payload.data ? action.payload.data.length : state.list.length);
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.page || 1;
      })
      .addCase(fetchCategories.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(createCategory.fulfilled, (state, action) => { state.list.unshift(action.payload); state.totalCount += 1; })
      .addCase(createCategory.rejected, (state, action) => { state.error = action.payload; })

      .addCase(updateCategory.fulfilled, (state, action) => {
        const idx = state.list.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(updateCategory.rejected, (state, action) => { state.error = action.payload; })

      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(deleteCategory.rejected, (state, action) => { state.error = action.payload; })

      .addCase(restoreCategory.fulfilled, (state, action) => {
        const idx = state.list.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(restoreCategory.rejected, (state, action) => { state.error = action.payload; })

      .addCase(permanentDeleteCategory.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(permanentDeleteCategory.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearCategoriesError } = categoriesSlice.actions;

export const selectCategories = (state) => state.entities.categories.list;
export const selectCategoriesTotalCount = (state) => state.entities.categories.totalCount;
export const selectCategoriesTotalPages = (state) => state.entities.categories.totalPages;
export const selectCategoriesLoading = (state) => state.entities.categories.isLoading;
export const selectCategoriesError = (state) => state.entities.categories.error;

export default categoriesSlice.reducer;
