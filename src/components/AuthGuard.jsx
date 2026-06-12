"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import {
  selectIsAuthenticated,
  selectIsInitialized,
  fetchCurrentUser,
  rehydrateToken,
  selectUser,
} from "@/store/slices/authSlice";
import axiosClient from "@/lib/axios";

const PUBLIC_ROUTES = ["/login", "/accept-invitation"];

export function AuthGuard({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isInitialized = useSelector(selectIsInitialized);
  const user = useSelector(selectUser);

  useEffect(() => {
    // On first load: rehydrate token from localStorage and fetch user
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      dispatch(rehydrateToken());
      dispatch(fetchCurrentUser());
    } else {
      // No token — mark as initialized so the guard knows to redirect
      dispatch({ type: "auth/fetchCurrentUser/rejected" });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isInitialized) return;

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    if (!isAuthenticated && !isPublicRoute) {
      router.replace("/login");
      return;
    }

    if (isAuthenticated) {
      if (isPublicRoute) {
        router.replace("/");
        return;
      }

      // Check if workspace selection is required
      if (user && user.type !== "super_admin") {
        const workspaces = user.workspaces || [];
        const activeCompanyId = localStorage.getItem("activeCompanyId");

        if (workspaces.length > 1 && !activeCompanyId) {
          if (pathname !== "/select-company") {
            router.replace("/select-company");
            return;
          }
        } else if (workspaces.length === 1 && !activeCompanyId) {
          localStorage.setItem("activeCompanyId", workspaces[0].id.toString());
          axiosClient.post("/auth/switch-workspace", { companyId: workspaces[0].id }).catch(console.error);
        } else if (activeCompanyId && pathname === "/select-company") {
          router.replace("/");
          return;
        }
      }
    }
  }, [isAuthenticated, isInitialized, pathname, router, user]);

  // Show nothing while initializing to prevent flicker
  if (!isInitialized) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#f8f9fc]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // On public routes, always render
  if (PUBLIC_ROUTES.includes(pathname)) return <>{children}</>;

  // On protected routes, only render if authenticated
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
