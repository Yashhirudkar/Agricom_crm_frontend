import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";
import { fetchCurrentUser } from "./authSlice";

export const switchCompanyContext = createAsyncThunk(
  "companyContext/switch",
  async (companyId, { dispatch, rejectWithValue }) => {
    try {
      // 1. Post to switch-workspace API
      await axiosClient.post("/auth/switch-workspace", { companyId: Number(companyId) });

      // 2. Set in localStorage for non-React/initial bootstrap access
      localStorage.setItem("activeCompanyId", companyId.toString());

      // 3. Sync profile, workspace roles, and permissions
      const userResult = await dispatch(fetchCurrentUser()).unwrap();

      // 4. Trigger sidebar and route rebuild
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("sidebar-updated"));
      }

      return {
        companyId: companyId.toString(),
        company: userResult.company
      };
    } catch (err) {
      console.error("Failed to switch company context:", err);
      return rejectWithValue(err.response?.data?.message || "Failed to switch workspace context");
    }
  }
);

const companyContextSlice = createSlice({
  name: "companyContext",
  initialState: {
    activeCompanyId: typeof window !== "undefined" ? localStorage.getItem("activeCompanyId") : null,
    activeCompany: null,
    isLoading: false,
    isInitialized: false,
  },
  reducers: {
    setActiveCompany(state, action) {
      const companyId = action.payload?.id || action.payload;
      if (companyId) {
        state.activeCompanyId = companyId.toString();
        if (action.payload?.name) {
          state.activeCompany = action.payload;
        }
        if (typeof window !== "undefined") {
          localStorage.setItem("activeCompanyId", companyId.toString());
        }
      } else {
        state.activeCompanyId = null;
        state.activeCompany = null;
        if (typeof window !== "undefined") {
          localStorage.removeItem("activeCompanyId");
        }
      }
    },
    setInitialized(state, action) {
      state.isInitialized = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(switchCompanyContext.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(switchCompanyContext.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeCompanyId = action.payload.companyId;
        state.activeCompany = action.payload.company;
        state.isInitialized = true;
      })
      .addCase(switchCompanyContext.rejected, (state) => {
        state.isLoading = false;
      })
      // Matchers to sync whenever user logs in or profile is fetched
      .addMatcher(
        (action) => action.type === "auth/fetchCurrentUser/fulfilled" || action.type === "auth/login/fulfilled",
        (state, action) => {
          const user = action.payload.user || action.payload;
          if (user?.company) {
            state.activeCompany = user.company;
            state.activeCompanyId = user.company.id?.toString() || null;
            if (state.activeCompanyId && typeof window !== "undefined") {
              localStorage.setItem("activeCompanyId", state.activeCompanyId);
            }
          }
          state.isInitialized = true;
        }
      )
      // Matchers to clear context on logout
      .addMatcher(
        (action) => action.type === "auth/logout/fulfilled" || action.type === "auth/logout/rejected",
        (state) => {
          state.activeCompanyId = null;
          state.activeCompany = null;
          state.isInitialized = false;
          if (typeof window !== "undefined") {
            localStorage.removeItem("activeCompanyId");
          }
        }
      );
  }
});

export const { setActiveCompany, setInitialized } = companyContextSlice.actions;

export const selectActiveCompanyId = (state) => state.companyContext.activeCompanyId;
export const selectActiveCompany = (state) => state.companyContext.activeCompany;
export const selectCompanyContextLoading = (state) => state.companyContext.isLoading;
export const selectCompanyContextInitialized = (state) => state.companyContext.isInitialized;

export default companyContextSlice.reducer;
