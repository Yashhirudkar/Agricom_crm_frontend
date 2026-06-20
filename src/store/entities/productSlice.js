import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

export const fetchProducts = createAsyncThunk("products/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/masters/products", { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch products");
  }
});

export const createProduct = createAsyncThunk("products/create", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/masters/products", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create product");
  }
});

export const updateProduct = createAsyncThunk("products/update", async ({ id, ...data }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.patch(`/masters/products/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update product");
  }
});

export const deleteProduct = createAsyncThunk("products/delete", async (id, { rejectWithValue }) => {
  try {
    await axiosClient.delete(`/masters/products/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete product");
  }
});

const productSlice = createSlice({
  name: "products",
  initialState: {
    list: [],
    totalCount: 0,
    totalPages: 1,
    currentPage: 1,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearProductsError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => { 
        state.isLoading = false; 
        state.list = action.payload.data || []; 
        state.totalCount = action.payload.total || 0;
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.page || 1;
      })
      .addCase(fetchProducts.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(createProduct.fulfilled, (state, action) => { state.list.unshift(action.payload); state.totalCount += 1; })
      .addCase(createProduct.rejected, (state, action) => { state.error = action.payload; })

      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.list.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => { state.error = action.payload; })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(deleteProduct.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearProductsError } = productSlice.actions;

export const selectProducts = (state) => state.entities.products.list;
export const selectProductsTotalCount = (state) => state.entities.products.totalCount;
export const selectProductsTotalPages = (state) => state.entities.products.totalPages;
export const selectProductsLoading = (state) => state.entities.products.isLoading;
export const selectProductsError = (state) => state.entities.products.error;

export default productSlice.reducer;
