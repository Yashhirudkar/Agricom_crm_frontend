import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

export const shiftsAdapter = createEntityAdapter();

export const fetchShifts = createAsyncThunk("entities/shifts/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/shifts");
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch shifts");
  }
});

export const fetchShiftById = createAsyncThunk("entities/shifts/fetchById", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get(`/shifts/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch shift");
  }
});

export const createShift = createAsyncThunk("entities/shifts/create", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/shifts", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create shift");
  }
});

export const updateShift = createAsyncThunk("entities/shifts/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.put(`/shifts/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update shift");
  }
});

export const deleteShift = createAsyncThunk("entities/shifts/delete", async (id, { rejectWithValue }) => {
  try {
    await axiosClient.delete(`/shifts/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete shift");
  }
});

const shiftsSlice = createSlice({
  name: "shifts",
  initialState: shiftsAdapter.getInitialState({
    isLoading: false,
    error: null,
  }),
  reducers: {
    clearShiftsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShifts.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchShifts.fulfilled, (state, action) => { 
        state.isLoading = false; 
        shiftsAdapter.setAll(state, action.payload); 
      })
      .addCase(fetchShifts.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(fetchShiftById.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchShiftById.fulfilled, (state, action) => { 
        state.isLoading = false; 
        shiftsAdapter.upsertOne(state, action.payload); 
      })
      .addCase(fetchShiftById.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(createShift.fulfilled, (state, action) => { shiftsAdapter.addOne(state, action.payload); })
      .addCase(createShift.rejected, (state, action) => { state.error = action.payload; })

      .addCase(updateShift.fulfilled, (state, action) => { shiftsAdapter.upsertOne(state, action.payload); })
      .addCase(updateShift.rejected, (state, action) => { state.error = action.payload; })

      .addCase(deleteShift.fulfilled, (state, action) => { shiftsAdapter.removeOne(state, action.payload); })
      .addCase(deleteShift.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearShiftsError } = shiftsSlice.actions;

export const { 
  selectAll: selectAllShifts, 
  selectById: selectShiftById 
} = shiftsAdapter.getSelectors(state => state.entities.shifts);

export const selectShiftsLoading = (state) => state.entities.shifts.isLoading;
export const selectShiftsError = (state) => state.entities.shifts.error;

export default shiftsSlice.reducer;
