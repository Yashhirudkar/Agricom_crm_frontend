import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

export const holidaysAdapter = createEntityAdapter();

export const fetchHolidays = createAsyncThunk("entities/holidays/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/holidays", { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch holidays");
  }
});

export const fetchHolidayById = createAsyncThunk("entities/holidays/fetchById", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get(`/holidays/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch holiday");
  }
});

export const createHoliday = createAsyncThunk("entities/holidays/create", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/holidays", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create holiday");
  }
});

export const updateHoliday = createAsyncThunk("entities/holidays/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.put(`/holidays/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update holiday");
  }
});

export const deleteHoliday = createAsyncThunk("entities/holidays/delete", async (id, { rejectWithValue }) => {
  try {
    await axiosClient.delete(`/holidays/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete holiday");
  }
});

const holidaysSlice = createSlice({
  name: "holidays",
  initialState: holidaysAdapter.getInitialState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    current: null,
    isLoading: false,
    error: null,
  }),
  reducers: {
    clearHolidaysError(state) { state.error = null; },
    clearCurrentHoliday(state) { state.current = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHolidays.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchHolidays.fulfilled, (state, action) => { 
        state.isLoading = false; 
        holidaysAdapter.setAll(state, action.payload.data || action.payload);
        state.total = action.payload.total || action.payload.length;
        state.page = action.payload.page || 1;
        state.limit = action.payload.limit || 10;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchHolidays.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(fetchHolidayById.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchHolidayById.fulfilled, (state, action) => { 
        state.isLoading = false; 
        state.current = action.payload; 
        holidaysAdapter.upsertOne(state, action.payload);
      })
      .addCase(fetchHolidayById.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(createHoliday.fulfilled, (state, action) => {
        holidaysAdapter.addOne(state, action.payload);
      })
      .addCase(createHoliday.rejected, (state, action) => { state.error = action.payload; })

      .addCase(updateHoliday.fulfilled, (state, action) => {
        holidaysAdapter.upsertOne(state, action.payload);
        if (state.current?.id === action.payload.id) {
          state.current = { ...state.current, ...action.payload };
        }
      })
      .addCase(updateHoliday.rejected, (state, action) => { state.error = action.payload; })

      .addCase(deleteHoliday.fulfilled, (state, action) => {
        holidaysAdapter.removeOne(state, action.payload);
      })
      .addCase(deleteHoliday.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearHolidaysError, clearCurrentHoliday } = holidaysSlice.actions;

export const {
  selectAll: selectAllHolidays,
  selectById: selectHolidayById
} = holidaysAdapter.getSelectors(state => state.entities.holidays);

export const selectHolidaysData = createSelector(
  [
    selectAllHolidays,
    (state) => state.entities.holidays.total,
    (state) => state.entities.holidays.page,
    (state) => state.entities.holidays.limit,
    (state) => state.entities.holidays.totalPages
  ],
  (data, total, page, limit, totalPages) => ({
    data,
    total,
    page,
    limit,
    totalPages
  })
);

export const selectCurrentHoliday = (state) => state.entities.holidays.current;
export const selectHolidaysLoading = (state) => state.entities.holidays.isLoading;
export const selectHolidaysError = (state) => state.entities.holidays.error;

export default holidaysSlice.reducer;
