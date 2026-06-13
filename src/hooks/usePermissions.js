import { useSelector } from "react-redux";
import { selectUserPermissions, selectUserType } from "@/store/slices/authSlice";

/**
 * A custom hook to check if the current user has specific permissions.
 */
export function usePermissions() {
  const permissions = useSelector(selectUserPermissions);
  const userType = useSelector(selectUserType);

  /**
   * Check if the user has a specific permission (e.g., 'employees:create')
   * Super Admins and Client Admins might bypass these checks depending on business logic,
   * but typically we can allow Super Admin and Client Admin all access.
   */
  const hasPermission = (requiredPermission) => {
    if (!requiredPermission) return true;
    
    // Admins bypass all permission checks
    if (userType === "super_admin" || userType === "client_admin") return true;

    return permissions.includes(requiredPermission.toLowerCase());
  };

  /**
   * Check if the user has ANY of the given permissions
   */
  const hasAnyPermission = (requiredPermissions = []) => {
    if (requiredPermissions.length === 0) return true;
    if (userType === "super_admin" || userType === "client_admin") return true;
    return requiredPermissions.some(p => permissions.includes(p.toLowerCase()));
  };

  /**
   * Check if the user has ALL of the given permissions
   */
  const hasAllPermissions = (requiredPermissions = []) => {
    if (requiredPermissions.length === 0) return true;
    if (userType === "super_admin" || userType === "client_admin") return true;
    return requiredPermissions.every(p => permissions.includes(p.toLowerCase()));
  };

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  };
}
