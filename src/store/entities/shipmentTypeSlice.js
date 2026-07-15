import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

export const fetchShipmentTypes = createAsyncThunk("shipmentTypes/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/masters/shipment-types", { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch shipment types");
  }
});

export const createShipmentType = createAsyncThunk("shipmentTypes/create", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/masters/shipment-types", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create shipment type");
  }
});

export const updateShipmentType = createAsyncThunk("shipmentTypes/update", async ({ id, ...data }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.patch(`/masters/shipment-types/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update shipment type");
  }
});

export const deleteShipmentType = createAsyncThunk("shipmentTypes/delete", async (arg, { rejectWithValue }) => {
  try {
    const id = typeof arg === "object" ? arg.id : arg;
    const reason = typeof arg === "object" ? arg.reason : undefined;
    await axiosClient.delete(`/masters/shipment-types/${id}`, { params: { reason } });
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete shipment type");
  }
});

export const restoreShipmentType = createAsyncThunk("shipmentTypes/restore", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosClient.patch(`/masters/shipment-types/${id}/restore`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to restore shipment type");
  }
});

export const permanentDeleteShipmentType = createAsyncThunk("shipmentTypes/permanentDelete", async (arg, { rejectWithValue }) => {
  try {
    const id = typeof arg === "object" ? arg.id : arg;
    const reason = typeof arg === "object" ? arg.reason : undefined;
    await axiosClient.delete(`/masters/shipment-types/${id}/permanent`, { params: { reason } });
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to permanently delete shipment type");
  }
});

const shipmentTypeSlice = createSlice({
  name: "shipmentTypes",
  initialState: {
    list: [],
    totalCount: 0,
    totalPages: 1,
    currentPage: 1,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearShipmentTypesError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShipmentTypes.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchShipmentTypes.fulfilled, (state, action) => { 
      state.isLoading = false; 
      state.list = action.payload.data || []; 
      state.totalCount = action.payload.total || 0;
      state.totalPages = action.payload.totalPages || 1;
      state.currentPage = action.payload.page || 1;
    })
      .addCase(fetchShipmentTypes.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(createShipmentType.fulfilled, (state, action) => { state.list.unshift(action.payload); state.totalCount += 1; })
      .addCase(createShipmentType.rejected, (state, action) => { state.error = action.payload; })

      .addCase(updateShipmentType.fulfilled, (state, action) => {
        const idx = state.list.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(updateShipmentType.rejected, (state, action) => { state.error = action.payload; })

      .addCase(deleteShipmentType.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(deleteShipmentType.rejected, (state, action) => { state.error = action.payload; })

      .addCase(restoreShipmentType.fulfilled, (state, action) => {
        const idx = state.list.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(restoreShipmentType.rejected, (state, action) => { state.error = action.payload; })

      .addCase(permanentDeleteShipmentType.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(permanentDeleteShipmentType.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearShipmentTypesError } = shipmentTypeSlice.actions;

export const selectShipmentTypes = (state) => state.entities.shipmentTypes.list;
export const selectShipmentTypesTotalCount = (state) => state.entities.shipmentTypes.totalCount;
export const selectShipmentTypesTotalPages = (state) => state.entities.shipmentTypes.totalPages;
export const selectShipmentTypesLoading = (state) => state.entities.shipmentTypes.isLoading;
export const selectShipmentTypesError = (state) => state.entities.shipmentTypes.error;

export default shipmentTypeSlice.reducer;
