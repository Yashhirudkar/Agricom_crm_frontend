import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

export const fetchPermissions = createAsyncThunk("permissions/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/GetPermissions");
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch permissions");
  }
});

export const createPermission = createAsyncThunk("permissions/create", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/CreatePermission", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create permission");
  }
});

export const updatePermission = createAsyncThunk("permissions/update", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/UpdatePermission", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update permission");
  }
});

export const deletePermission = createAsyncThunk("permissions/delete", async (id, { rejectWithValue }) => {
  try {
    await axiosClient.post("/DeletePermission", { id });
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete permission");
  }
});

const permissionsSlice = createSlice({
  name: "permissions",
  initialState: {
    list: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearPermissionsError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermissions.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchPermissions.fulfilled, (state, action) => { state.isLoading = false; state.list = action.payload; })
      .addCase(fetchPermissions.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(createPermission.fulfilled, (state, action) => { state.list.unshift(action.payload); })
      .addCase(createPermission.rejected, (state, action) => { state.error = action.payload; })

      .addCase(updatePermission.fulfilled, (state, action) => {
        const idx = state.list.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(updatePermission.rejected, (state, action) => { state.error = action.payload; })

      .addCase(deletePermission.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p.id !== action.payload);
      })
      .addCase(deletePermission.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearPermissionsError } = permissionsSlice.actions;

export const selectPermissions = (state) => state.permissions.list;
export const selectPermissionsLoading = (state) => state.permissions.isLoading;
export const selectPermissionsError = (state) => state.permissions.error;

export default permissionsSlice.reducer;
