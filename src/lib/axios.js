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
});

// Request interceptor — attach Bearer token and activeCompanyId
axiosClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      const rawCompanyId = localStorage.getItem("activeCompanyId");
      if (rawCompanyId) {
        let activeCompanyId = rawCompanyId;
        
        if (store) {
          const state = store.getState();
          const user = state.auth?.user;
          
          if (user && user.type !== "super_admin") {
            const workspaces = user.workspaces || [];
            const hasAccess = workspaces.some(w => w.id.toString() === rawCompanyId.toString());
            
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
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — on 401, clear session and redirect to /login
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
