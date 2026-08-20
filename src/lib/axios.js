import axios from "axios";

let store;

export const injectStore = (_store) => {
  store = _store;
};

export const getBackendUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "");
  }
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:5000`;
  }
  return "http://localhost:5000";
};
export const getAvatarUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("blob:") || url.startsWith("data:")) return url;
  const baseUrl = getBackendUrl();
  let path = url.startsWith("/") ? url : "/" + url;
  if (path.startsWith("/attachments/") && !path.startsWith("/api/")) {
    path = "/api" + path;
  }
  if (path.includes("/attachments/")) {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (token) {
      const separator = path.includes("?") ? "&" : "?";
      path = `${path}${separator}token=${encodeURIComponent(token)}`;
    }
  }
  return `${baseUrl}${path}`;
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
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      let activeCompanyId = null;
      if (typeof window !== "undefined") {
        activeCompanyId = localStorage.getItem("activeCompanyId");
      }
      if (!activeCompanyId && store) {
        activeCompanyId = store.getState().companyContext?.activeCompanyId;
      }

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

import { toast } from "./toast";

// Silent Refresh state variables
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor — on 401, perform silent refresh with refresh token
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }
    const originalRequest = error.config;

    const isBackgroundPolling = originalRequest?.url?.includes("/chat/unread/total");

    const isRefreshable401 =
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !originalRequest?.url?.includes("/auth/login") &&
      !originalRequest?.url?.includes("/auth/refresh");

    if (!isRefreshable401 && !isBackgroundPolling) {
      if (error.response) {
        console.error("[Axios Error]", originalRequest?.url, error.response.status, error.response.data);
      } else if (!axios.isCancel(error)) {
        console.error("[Axios Error]", originalRequest?.url, error.message || error);
      }
    }

    if (typeof window !== "undefined") {
      if (error.response?.status === 401 && !originalRequest?._retry && !originalRequest?.url?.includes("/auth/login")) {
        // Prevent infinite loop if refresh endpoint itself returns 401
        if (originalRequest.url?.includes("/auth/refresh")) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axiosClient(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
          isRefreshing = false;
          return Promise.reject(error);
        }

        try {
          const res = await axios.post(`${originalRequest.baseURL || BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = res.data;
          localStorage.setItem("accessToken", accessToken);
          if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
          }

          axiosClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

          processQueue(null, accessToken);
          isRefreshing = false;

          return axiosClient(originalRequest);
        } catch (err) {
          processQueue(err, null);
          isRefreshing = false;
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          return Promise.reject(err);
        }
      }

      // Extract error message from standard backend DTO or fallback
      const message = error.response?.data?.message || error.response?.data?.error || "An unexpected error occurred.";

      const isConversations403 = error.response?.status === 403 && originalRequest?.url?.includes("/conversations");

      // Don't toast 404s globally if they are expected (optional), but for enterprise usually we toast 4xx and 5xx
      // Also ignore 401s here to prevent displaying error messages to users when silent refresh is about to occur
      if (error.response?.status >= 400 && error.response?.status !== 404 && error.response?.status !== 401 && !isConversations403) {
        toast.error(message);
      } else if (error.message === "Network Error" && !isBackgroundPolling) {
        toast.error("Network connection lost. Please check your internet connection.");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
