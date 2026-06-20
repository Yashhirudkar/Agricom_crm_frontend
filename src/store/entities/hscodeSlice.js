import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

export const fetchHSCodes = createAsyncThunk("hscodes/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/masters/hs-codes", { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch HS Codes");
  }
});

export const createHSCode = createAsyncThunk("hscodes/create", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/masters/hs-codes", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create HS Code");
  }
});

export const updateHSCode = createAsyncThunk("hscodes/update", async ({ id, ...data }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.patch(`/masters/hs-codes/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update HS Code");
  }
});

export const deleteHSCode = createAsyncThunk("hscodes/delete", async (id, { rejectWithValue }) => {
  try {
    await axiosClient.delete(`/masters/hs-codes/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete HS Code");
  }
});

const hscodeSlice = createSlice({
  name: "hscodes",
  initialState: {
    list: [],
    totalCount: 0,
    totalPages: 1,
    currentPage: 1,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearHSCodesError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHSCodes.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchHSCodes.fulfilled, (state, action) => { 
        state.isLoading = false; 
        state.list = action.payload.data || []; 
        state.totalCount = action.payload.total || 0;
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.page || 1;
      })
      .addCase(fetchHSCodes.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(createHSCode.fulfilled, (state, action) => { state.list.unshift(action.payload); state.totalCount += 1; })
      .addCase(createHSCode.rejected, (state, action) => { state.error = action.payload; })

      .addCase(updateHSCode.fulfilled, (state, action) => {
        const idx = state.list.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(updateHSCode.rejected, (state, action) => { state.error = action.payload; })

      .addCase(deleteHSCode.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(deleteHSCode.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearHSCodesError } = hscodeSlice.actions;

export const selectHSCodes = (state) => state.entities.hscodes.list;
export const selectHSCodesTotalCount = (state) => state.entities.hscodes.totalCount;
export const selectHSCodesTotalPages = (state) => state.entities.hscodes.totalPages;
export const selectHSCodesLoading = (state) => state.entities.hscodes.isLoading;
export const selectHSCodesError = (state) => state.entities.hscodes.error;

export default hscodeSlice.reducer;
