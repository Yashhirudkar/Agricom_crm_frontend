"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectUser, selectUserType } from "@/store/slices/authSlice";

/**
 * Hook to strictly determine if the current logged-in user is a Sales user.
 * 
 * Rules:
 * - Sales -> true
 * - Admin -> false
 * - Client Admin -> false
 * - Logistics -> false
 * - Operations -> false
 * - Any other role -> false
 */
export function useSalesRole() {
  const user = useSelector(selectUser);
  const userType = useSelector(selectUserType);

  const isSales = useMemo(() => {
    if (!user) return false;

    // 1. Explicit admin user types are excluded
    const normalizedType = String(userType || user.type || "").toLowerCase().trim();
    if (
      normalizedType === "super_admin" ||
      normalizedType === "client_admin" ||
      normalizedType === "admin"
    ) {
      return false;
    }

    // 2. Check active workspace role
    const activeCompanyId =
      typeof window !== "undefined"
        ? localStorage.getItem("activeCompanyId")
        : null;

    const workspaces = user.workspaces || [];
    const activeWorkspace =
      workspaces.find((w) => w.id?.toString() === activeCompanyId?.toString()) ||
      workspaces[0];

    const activeRoleName = String(
      activeWorkspace?.role?.name || ""
    ).toLowerCase().trim();

    if (activeRoleName) {
      // Must strictly be sales
      return activeRoleName === "sales";
    }

    // 3. Fallback to user roles list
    const roles = user.roles || [];
    const hasSalesRole = roles.some(
      (r) => String(r.name || "").toLowerCase().trim() === "sales"
    );

    const hasExcludedRole = roles.some((r) => {
      const name = String(r.name || "").toLowerCase().trim();
      return (
        name === "admin" ||
        name === "client admin" ||
        name === "logistics" ||
        name === "operations"
      );
    });

    return hasSalesRole && !hasExcludedRole;
  }, [user, userType]);

  return { isSales, user };
}

export default useSalesRole;

