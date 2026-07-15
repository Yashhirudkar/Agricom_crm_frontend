import axios from "axios";

let store;

export const injectStore = (_store) => {
  store = _store;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: {
    serialize: function (params) {
      const searchParams = new URLSearchParams();
      for (const key of Object.keys(params)) {
        const val = params[key];
        if (Array.isArray(val)) {
          val.forEach(v => searchParams.append(key, v));
        } else if (val !== undefined && val !== null) {
          searchParams.append(key, val);
        }
      }
      return searchParams.toString();
    }
  }
});

// Request interceptor — attach Bearer token and activeCompanyId
axiosClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      let activeCompanyId = localStorage.getItem("activeCompanyId");

      if (store) {
        const state = store.getState();
        const user = state.auth?.user;

        // Fallback: if no activeCompanyId in localStorage, try user's own companyId
        if (!activeCompanyId && user?.lastCompanyId) {
          activeCompanyId = user.lastCompanyId.toString();
        }
        if (!activeCompanyId && user?.companyId) {
          activeCompanyId = user.companyId.toString();
        }

        // If we have an ID and user is NOT super_admin, validate workspace access
        if (activeCompanyId && user && user.type !== "super_admin") {
          const workspaces = user.workspaces || [];
          const hasAccess = workspaces.some(w => w.id.toString() === activeCompanyId.toString());

          if (!hasAccess) {
            if (workspaces.length > 0) {
              activeCompanyId = workspaces[0].id.toString();
              localStorage.setItem("activeCompanyId", activeCompanyId);
            } else {
              activeCompanyId = null;
              localStorage.removeItem("activeCompanyId");
            }
          }
        }
      }

      if (activeCompanyId) {
        config.headers["x-company-id"] = activeCompanyId;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

import { toast } from "sonner";

// Response interceptor — on 401, clear session and redirect to /login
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("[Axios Error]", error.config?.url, error.response?.status, error.response?.data);

    if (typeof window !== "undefined") {
      if (error.response?.status === 401) {
        sessionStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // Extract error message from standard backend DTO or fallback
      const message = error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred.";

      // Don't toast 404s globally if they are expected (optional), but for enterprise usually we toast 4xx and 5xx
      if (error.response?.status >= 400 && error.response?.status !== 404) {
        toast.error(message);
      } else if (error.message === "Network Error") {
        toast.error("Network connection lost. Please check your internet connection.");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
