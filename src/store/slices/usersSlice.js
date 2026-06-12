import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

export const fetchUsers = createAsyncThunk("users/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/GetUsers");
    return res.data; // { users: [], meta: { maxUsers, currentUsers, canAddMore, ... } | null }
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch users");
  }
});

export const createUser = createAsyncThunk("users/create", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/CreateUser", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create user");
  }
});

export const updateUser = createAsyncThunk("users/update", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/UpdateUser", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update user");
  }
});

export const deleteUser = createAsyncThunk("users/delete", async (id, { rejectWithValue }) => {
  try {
    await axiosClient.post("/DeleteUser", { id });
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete user");
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState: {
    list: [],
    meta: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearUsersError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        // Check if backend returned { users, meta } or just []
        if (action.payload && action.payload.users !== undefined) {
          state.list = action.payload.users;
          state.meta = action.payload.meta;
        } else {
          state.list = action.payload || [];
          state.meta = null;
        }
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(createUser.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        if (state.meta) { state.meta.currentUsers += 1; state.meta.canAddMore = state.meta.currentUsers < state.meta.maxUsers; }
      })
      .addCase(createUser.rejected, (state, action) => { state.error = action.payload; })

      .addCase(updateUser.fulfilled, (state, action) => {
        const idx = state.list.findIndex((u) => u.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => { state.error = action.payload; })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.list = state.list.filter((u) => u.id !== action.payload);
        if (state.meta) { state.meta.currentUsers -= 1; state.meta.canAddMore = state.meta.currentUsers < state.meta.maxUsers; }
      })
      .addCase(deleteUser.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearUsersError } = usersSlice.actions;
export const selectUsers = (state) => state.users.list;
export const selectUsersMeta = (state) => state.users.meta;
export const selectUsersLoading = (state) => state.users.isLoading;
export const selectUsersError = (state) => state.users.error;

export default usersSlice.reducer;
