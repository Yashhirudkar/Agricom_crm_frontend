import { useSelector } from "react-redux";
import { selectUserPermissions, selectUserType } from "@/store/slices/authSlice";

/**
 * A custom hook to check if the current user has specific permissions.
 */
export function usePermissions() {
  const permissions = useSelector(selectUserPermissions);
  const user = useSelector((state) => state.auth.user);
  const userType = user?.type;
  
  const checkIsAdmin = () => {
    // 1. Check global userType
    if (userType) {
      const type = String(userType).toLowerCase().trim();
      if (type === "super_admin" || type === "client_admin" || type === "admin") return true;
    }
    
    // 2. Check workspace-level roles
    if (user?.workspaces && Array.isArray(user.workspaces)) {
      return user.workspaces.some(ws => {
        if (!ws.role || !ws.role.name) return false;
        const roleName = String(ws.role.name).toLowerCase().trim();
        return roleName === "client admin" || roleName === "admin" || roleName === "super admin";
      });
    }

    return false;
  };

  /**
   * Check if the user has a specific permission (e.g., 'employees:create')
   * Super Admins and Client Admins might bypass these checks depending on business logic,
   * but typically we can allow Super Admin and Client Admin all access.
   */
  const hasPermission = (requiredPermission) => {
    if (!requiredPermission) return true;
    if (checkIsAdmin()) return true;

    return permissions?.includes(requiredPermission.toLowerCase());
  };

  /**
   * Check if the user has ANY of the given permissions
   */
  const hasAnyPermission = (requiredPermissions = []) => {
    if (requiredPermissions.length === 0) return true;
    if (checkIsAdmin()) return true;
    return requiredPermissions.some(p => permissions?.includes(p.toLowerCase()));
  };

  /**
   * Check if the user has ALL of the given permissions
   */
  const hasAllPermissions = (requiredPermissions = []) => {
    if (requiredPermissions.length === 0) return true;
    if (checkIsAdmin()) return true;
    return requiredPermissions.every(p => permissions?.includes(p.toLowerCase()));
  };

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  };
}
