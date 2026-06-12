import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Step 1: Login to get tokens
      const loginRes = await axiosClient.post("/auth/login", { email, password });
      const { accessToken } = loginRes.data;

      // Step 2: Save token to localStorage so interceptor can use it immediately
      localStorage.setItem("accessToken", accessToken);

      // Step 3: Fetch current user profile
      const meRes = await axiosClient.get("/auth/me");

      return { accessToken, user: meRes.data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Login failed. Check your credentials."
      );
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get("/auth/me");
      return res.data;
    } catch (err) {
      return rejectWithValue("Session expired");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.post("/auth/logout");
    } catch (_) {
      // Even if the API call fails, we still clear local session
    } finally {
      localStorage.removeItem("accessToken");
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,           // { id, email, isActive, companyId, ... }
    accessToken: null,
    isAuthenticated: false,
    isLoading: false,
    isInitialized: false, // true after first session check on app load
    error: null,
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
    // Called on app boot to rehydrate token from localStorage
    rehydrateToken(state) {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("accessToken");
        if (token) {
          state.accessToken = token;
        }
      }
    },
    setInitialized(state) {
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    // ── Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isInitialized = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });

    // ── Fetch Current User (on app boot)
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isInitialized = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
        }
      });

    // ── Logout
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        // Force local clear even on API error
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, rehydrateToken, setInitialized } = authSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectIsInitialized = (state) => state.auth.isInitialized;
export const selectUserType = (state) => state.auth.user?.type;

export default authSlice.reducer;
