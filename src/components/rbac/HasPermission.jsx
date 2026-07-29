"use client";

import React from "react";
import { usePermissions } from "@/hooks/usePermissions";

/**
 * A wrapper component that conditionally renders its children based on user permissions.
 * 
 * @param {Object} props
 * @param {string} props.permission - A single permission string (e.g., 'employees:create')
 * @param {string[]} props.anyPermission - Array of permissions, requires at least one
 * @param {string[]} props.allPermissions - Array of permissions, requires all
 * @param {React.ReactNode} props.children - The content to render if authorized
 * @param {React.ReactNode} props.fallback - The content to render if unauthorized
 */
export default function HasPermission({
  permission,
  anyPermission,
  allPermissions,
  children,
  fallback = null
}) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  let isAuthorized = true;

  if (permission) {
    isAuthorized = isAuthorized && hasPermission(permission);
  }
  if (anyPermission && anyPermission.length > 0) {
    isAuthorized = isAuthorized && hasAnyPermission(anyPermission);
  }
  if (allPermissions && allPermissions.length > 0) {
    isAuthorized = isAuthorized && hasAllPermissions(allPermissions);
  }

  if (isAuthorized) {
    return <>{children}</>;
  }

  // If NOT authorized: hide children completely (unless a fallback is provided)
  return fallback;
}
