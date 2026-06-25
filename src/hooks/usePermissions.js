import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectUserPermissions, selectUserType } from "@/store/slices/authSlice";

const normalizePermission = (permKey) => {
  if (!permKey) return "";
  let perm = permKey.toLowerCase().trim();
  let [resource, action] = perm.split(':');

  if (resource === 'tasks') {
    resource = 'task';
  }

  if (action === 'view') {
    action = 'read';
  }

  if (action === 'edit') {
    action = 'update';
  }

  if (resource === 'manager' && action === 'approve_leave') {
    resource = 'leave';
    action = 'approve';
  }

  if (resource === 'employees') {
    if (['upload_document', 'upload'].includes(action)) {
      resource = 'employee_documents';
      action = 'upload';
    } else if (['view_document', 'read_document'].includes(action)) {
      resource = 'employee_documents';
      action = 'read';
    } else if (['verify_document', 'verify'].includes(action)) {
      resource = 'employee_documents';
      action = 'verify';
    } else if (['download_document', 'download'].includes(action)) {
      resource = 'employee_documents';
      action = 'download';
    } else if (['delete_document'].includes(action)) {
      resource = 'employee_documents';
      action = 'delete';
    } else if (
      [
        'assign_manager',
        'change_manager',
        'view_team',
        'view_hierarchy',
      ].includes(action)
    ) {
      resource = 'employee_hierarchy';
    } else if (['manage_lifecycle', 'manage'].includes(action)) {
      resource = 'employee_lifecycle';
      action = 'manage';
    }
  }

  return `${resource}:${action}`;
};

/**
 * A custom hook to check if the current user has specific permissions.
 */
export function usePermissions() {
  const permissions = useSelector(selectUserPermissions);
  const user = useSelector((state) => state.auth.user);
  const userType = user?.type;

  const normalizedUserPermissions = useMemo(() => {
    return permissions?.map(p => normalizePermission(p)) || [];
  }, [permissions]);
  
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

    return normalizedUserPermissions.includes(normalizePermission(requiredPermission));
  };

  /**
   * Check if the user has ANY of the given permissions
   */
  const hasAnyPermission = (requiredPermissions = []) => {
    if (requiredPermissions.length === 0) return true;
    if (checkIsAdmin()) return true;
    return requiredPermissions.some(p => normalizedUserPermissions.includes(normalizePermission(p)));
  };

  /**
   * Check if the user has ALL of the given permissions
   */
  const hasAllPermissions = (requiredPermissions = []) => {
    if (requiredPermissions.length === 0) return true;
    if (checkIsAdmin()) return true;
    return requiredPermissions.every(p => normalizedUserPermissions.includes(normalizePermission(p)));
  };

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  };
}
