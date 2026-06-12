import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const fetchRoles = createAsyncThunk("roles/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/GetRoles");
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch roles");
  }
});

export const createRole = createAsyncThunk("roles/create", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/CreateRole", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create role");
  }
});

export const updateRole = createAsyncThunk("roles/update", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/UpdateRole", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update role");
  }
});

export const deleteRole = createAsyncThunk("roles/delete", async (id, { rejectWithValue }) => {
  try {
    await axiosClient.post("/DeleteRole", { id });
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete role");
  }
});

export const fetchRolePermissions = createAsyncThunk("roles/fetchPermissions", async (roleId, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get(`/GetRolePermissions?roleId=${roleId}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch role permissions");
  }
});

// ─── Slice ────────────────────────────────────────────────────────────────────

const rolesSlice = createSlice({
  name: "roles",
  initialState: {
    list: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearRolesError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchRoles.fulfilled, (state, action) => { state.isLoading = false; state.list = action.payload; })
      .addCase(fetchRoles.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(createRole.fulfilled, (state, action) => { state.list.unshift(action.payload); })
      .addCase(createRole.rejected, (state, action) => { state.error = action.payload; })

      .addCase(updateRole.fulfilled, (state, action) => {
        const idx = state.list.findIndex((r) => r.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(updateRole.rejected, (state, action) => { state.error = action.payload; })

      .addCase(deleteRole.fulfilled, (state, action) => {
        state.list = state.list.filter((r) => r.id !== action.payload);
      })
      .addCase(deleteRole.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearRolesError } = rolesSlice.actions;

export const selectRoles = (state) => state.roles.list;
export const selectRolesLoading = (state) => state.roles.isLoading;
export const selectRolesError = (state) => state.roles.error;

export default rolesSlice.reducer;
