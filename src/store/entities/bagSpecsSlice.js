import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

// ─── BAG TYPES ────────────────────────────────────────────────────────────────

export const fetchBagTypes = createAsyncThunk("bagSpecs/fetchBagTypes", async (params, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/masters/bag-types", { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch bag types");
  }
});

export const createBagType = createAsyncThunk("bagSpecs/createBagType", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/masters/bag-types", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create bag type");
  }
});

export const updateBagType = createAsyncThunk("bagSpecs/updateBagType", async ({ id, ...data }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.patch(`/masters/bag-types/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update bag type");
  }
});

export const deleteBagType = createAsyncThunk("bagSpecs/deleteBagType", async (id, { rejectWithValue }) => {
  try {
    await axiosClient.delete(`/masters/bag-types/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete bag type");
  }
});

// ─── PACKING TYPES ────────────────────────────────────────────────────────────

export const fetchPackingTypes = createAsyncThunk("bagSpecs/fetchPackingTypes", async (params, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/masters/packing-types", { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch packing types");
  }
});

export const createPackingType = createAsyncThunk("bagSpecs/createPackingType", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/masters/packing-types", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create packing type");
  }
});

export const updatePackingType = createAsyncThunk("bagSpecs/updatePackingType", async ({ id, ...data }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.patch(`/masters/packing-types/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update packing type");
  }
});

export const deletePackingType = createAsyncThunk("bagSpecs/deletePackingType", async (id, { rejectWithValue }) => {
  try {
    await axiosClient.delete(`/masters/packing-types/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete packing type");
  }
});

// ─── BAG SPECIFICATIONS ───────────────────────────────────────────────────────

export const fetchBagSpecs = createAsyncThunk("bagSpecs/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/masters/bag-specifications", { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch bag specifications");
  }
});

export const createBagSpec = createAsyncThunk("bagSpecs/create", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/masters/bag-specifications", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create bag specification");
  }
});

export const updateBagSpec = createAsyncThunk("bagSpecs/update", async ({ id, ...data }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.patch(`/masters/bag-specifications/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update bag specification");
  }
});

export const deleteBagSpec = createAsyncThunk("bagSpecs/delete", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosClient.delete(`/masters/bag-specifications/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete bag specification");
  }
});

// ─── PRODUCT PACKAGING ASSIGNMENTS ───────────────────────────────────────────

export const fetchProductPackaging = createAsyncThunk("bagSpecs/fetchProductPackaging", async (productId, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get(`/masters/products/${productId}/packaging`);
    return { productId, specs: res.data };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch product packaging");
  }
});

export const assignProductPackaging = createAsyncThunk("bagSpecs/assignProductPackaging", async ({ productId, bagSpecificationIds }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.put(`/masters/products/${productId}/packaging`, { bagSpecificationIds });
    return { productId, specs: res.data };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to assign packaging");
  }
});

// ─── SLICE ────────────────────────────────────────────────────────────────────

const bagSpecsSlice = createSlice({
  name: "bagSpecs",
  initialState: {
    // Bag Types
    bagTypes: [],
    bagTypesLoading: false,
    bagTypesError: null,
    // Packing Types
    packingTypes: [],
    packingTypesLoading: false,
    packingTypesError: null,
    // Bag Specifications
    list: [],
    totalCount: 0,
    totalPages: 1,
    currentPage: 1,
    isLoading: false,
    error: null,
    // Product Packaging map: { [productId]: BagSpec[] }
    productPackaging: {},
  },
  reducers: {
    clearBagSpecsError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    // Bag Types
    builder
      .addCase(fetchBagTypes.pending, (state) => { state.bagTypesLoading = true; state.bagTypesError = null; })
      .addCase(fetchBagTypes.fulfilled, (state, action) => { state.bagTypesLoading = false; state.bagTypes = action.payload; })
      .addCase(fetchBagTypes.rejected, (state, action) => { state.bagTypesLoading = false; state.bagTypesError = action.payload; })
      .addCase(createBagType.fulfilled, (state, action) => { state.bagTypes.push(action.payload); state.bagTypes.sort((a, b) => a.name.localeCompare(b.name)); })
      .addCase(updateBagType.fulfilled, (state, action) => { const idx = state.bagTypes.findIndex(t => t.id === action.payload.id); if (idx !== -1) state.bagTypes[idx] = action.payload; })
      .addCase(deleteBagType.fulfilled, (state, action) => { state.bagTypes = state.bagTypes.filter(t => t.id !== action.payload); });

    // Packing Types
    builder
      .addCase(fetchPackingTypes.pending, (state) => { state.packingTypesLoading = true; state.packingTypesError = null; })
      .addCase(fetchPackingTypes.fulfilled, (state, action) => { state.packingTypesLoading = false; state.packingTypes = action.payload; })
      .addCase(fetchPackingTypes.rejected, (state, action) => { state.packingTypesLoading = false; state.packingTypesError = action.payload; })
      .addCase(createPackingType.fulfilled, (state, action) => { state.packingTypes.push(action.payload); state.packingTypes.sort((a, b) => a.name.localeCompare(b.name)); })
      .addCase(updatePackingType.fulfilled, (state, action) => { const idx = state.packingTypes.findIndex(t => t.id === action.payload.id); if (idx !== -1) state.packingTypes[idx] = action.payload; })
      .addCase(deletePackingType.fulfilled, (state, action) => { state.packingTypes = state.packingTypes.filter(t => t.id !== action.payload); });

    // Bag Specifications
    builder
      .addCase(fetchBagSpecs.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchBagSpecs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.data || [];
        state.totalCount = action.payload.total || 0;
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.page || 1;
      })
      .addCase(fetchBagSpecs.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      .addCase(createBagSpec.fulfilled, (state, action) => { state.list.unshift(action.payload); state.totalCount += 1; })
      .addCase(updateBagSpec.fulfilled, (state, action) => {
        const idx = state.list.findIndex(s => s.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(deleteBagSpec.fulfilled, (state, action) => {
        const idx = state.list.findIndex(s => s.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      });

    // Product Packaging
    builder
      .addCase(fetchProductPackaging.fulfilled, (state, action) => {
        state.productPackaging[action.payload.productId] = action.payload.specs;
      })
      .addCase(assignProductPackaging.fulfilled, (state, action) => {
        state.productPackaging[action.payload.productId] = action.payload.specs;
      });
  },
});

export const { clearBagSpecsError } = bagSpecsSlice.actions;

export const selectBagTypes = (state) => state.entities.bagSpecs.bagTypes;
export const selectPackingTypes = (state) => state.entities.bagSpecs.packingTypes;
export const selectBagSpecs = (state) => state.entities.bagSpecs.list;
export const selectBagSpecsTotalCount = (state) => state.entities.bagSpecs.totalCount;
export const selectBagSpecsTotalPages = (state) => state.entities.bagSpecs.totalPages;
export const selectBagSpecsLoading = (state) => state.entities.bagSpecs.isLoading;
export const selectBagSpecsError = (state) => state.entities.bagSpecs.error;
export const selectProductPackaging = (productId) => (state) =>
  state.entities.bagSpecs.productPackaging[productId] || [];

export default bagSpecsSlice.reducer;
