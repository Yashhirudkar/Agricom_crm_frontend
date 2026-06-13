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

  // If NOT authorized: return disabled version of children instead of hiding
  if (React.isValidElement(children)) {
    const existingClassName = children.props.className || "";
    
    // Remove hover effects and cursor classes to make it look frozen
    const cleanClassName = existingClassName
      .split(" ")
      .filter(c => !c.startsWith("hover:") && !c.startsWith("cursor-") && c !== "")
      .join(" ");

    return React.cloneElement(children, {
      disabled: true,
      "aria-disabled": true,
      title: "You don't have permission to perform this action",
      className: `${cleanClassName} opacity-40 cursor-not-allowed`,
      onClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
      }
    });
  }

  // Fallback for non-element children
  return (
    <span 
      title="You don't have permission to perform this action" 
      className="opacity-40 cursor-not-allowed inline-block"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
    >
      {children}
    </span>
  );
}
