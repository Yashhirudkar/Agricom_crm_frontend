import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

export const fetchCountries = createAsyncThunk("countries/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/masters/countries", { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch countries");
  }
});

export const createCountry = createAsyncThunk("countries/create", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/masters/countries", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create country");
  }
});

export const updateCountry = createAsyncThunk("countries/update", async ({ id, ...data }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.patch(`/masters/countries/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update country");
  }
});

export const deleteCountry = createAsyncThunk("countries/delete", async (id, { rejectWithValue }) => {
  try {
    await axiosClient.delete(`/masters/countries/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete country");
  }
});

const countriesSlice = createSlice({
  name: "countries",
  initialState: {
    list: [],
    totalCount: 0,
    totalPages: 1,
    currentPage: 1,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCountriesError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchCountries.fulfilled, (state, action) => { 
        state.isLoading = false; 
        state.list = action.payload.data || []; 
        state.totalCount = action.payload.total || 0;
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.page || 1;
      })
      .addCase(fetchCountries.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(createCountry.fulfilled, (state, action) => { state.list.unshift(action.payload); state.totalCount += 1; })
      .addCase(createCountry.rejected, (state, action) => { state.error = action.payload; })

      .addCase(updateCountry.fulfilled, (state, action) => {
        const idx = state.list.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(updateCountry.rejected, (state, action) => { state.error = action.payload; })

      .addCase(deleteCountry.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(deleteCountry.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearCountriesError } = countriesSlice.actions;

export const selectCountries = (state) => state.entities.countries.list;
export const selectCountriesTotalCount = (state) => state.entities.countries.totalCount;
export const selectCountriesTotalPages = (state) => state.entities.countries.totalPages;
export const selectCountriesLoading = (state) => state.entities.countries.isLoading;
export const selectCountriesError = (state) => state.entities.countries.error;

export default countriesSlice.reducer;
