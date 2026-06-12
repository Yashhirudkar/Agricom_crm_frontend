import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

export const fetchClients = createAsyncThunk("clients/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/clients/GetClients");
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch clients");
  }
});

export const createClient = createAsyncThunk("clients/create", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/clients/CreateClient", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create client");
  }
});

export const updateClient = createAsyncThunk("clients/update", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/clients/UpdateClient", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update client");
  }
});

export const deleteClient = createAsyncThunk("clients/delete", async (id, { rejectWithValue }) => {
  try {
    await axiosClient.post("/clients/DeleteClient", { id });
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete client");
  }
});

const clientsSlice = createSlice({
  name: "clients",
  initialState: {
    list: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearClientsError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(createClient.fulfilled, (state, action) => { state.list.unshift(action.payload); })
      .addCase(createClient.rejected, (state, action) => { state.error = action.payload; })

      .addCase(updateClient.fulfilled, (state, action) => {
        const idx = state.list.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(updateClient.rejected, (state, action) => { state.error = action.payload; })

      .addCase(deleteClient.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteClient.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearClientsError } = clientsSlice.actions;
export const selectClients = (state) => state.clients.list;
export const selectClientsLoading = (state) => state.clients.isLoading;
export const selectClientsError = (state) => state.clients.error;

export default clientsSlice.reducer;
