import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectUserPermissions, selectUserType } from "@/store/slices/authSlice";

const normalizePermission = (permKey) => {
  if (!permKey) return "";
  let perm = permKey.toLowerCase().trim();

  // Normalize dot-separated permissions (e.g. chat.group.rename -> chat_group:rename)
  if (perm.includes('.')) {
    perm = perm.replace(/\./g, ':');
  }
  if (perm.startsWith('chat:group:')) {
    perm = perm.replace('chat:group:', 'chat_group:');
  }

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

  if (resource === 'sales_contracts' || resource === 'sales_contract') {
    resource = 'sales-contract';
  }

  if (resource === 'follow-up' || resource === 'follow_ups') {
    resource = 'follow_up';
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

  /**
   * Multi-layer validation for chat group actions
   * combines: general RBAC + conversation membership + conversation states + group role hierarchy
   */
  const checkGroupPermission = (action, conversation, currentUser) => {
    if (!conversation) return false;

    // Super/Client Admins bypass restrictions
    if (checkIsAdmin()) return true;

    // Check 1: User has general RBAC permission
    const permissionKey = action.includes(':') || action.includes('.')
      ? action
      : `chat_group:${action}`;

    if (!hasPermission(permissionKey)) return false;

    // DMs bypass group membership role rules, only check general RBAC
    if (conversation.type === "DIRECT") return true;

    // Check 2: Check if user is a member of the conversation group
    const members = conversation.members || [];
    const currentUserId = currentUser?.id || currentUser?.userId;
    const memberObj = members.find(m => {
      const mId = m.userId || m.user?.id;
      return Number(mId) === Number(currentUserId);
    });
    if (!memberObj) return false;

    // Check 3: Check conversation policies (frozen/archived status)
    const isFrozen = conversation.isLocked || conversation.isFrozen;
    const isArchived = conversation.isArchived;
    if ((isFrozen || isArchived) && [
      'rename', 'change_photo', 'change_description', 'add_members',
      'remove_members', 'promote_admin', 'demote_admin', 'delete',
      'manage_permissions', 'manage_invite_link'
    ].includes(action)) {
      const userRole = memberObj.role;
      if (userRole !== 'OWNER' && userRole !== 'ADMIN') {
        return false;
      }
    }

    // Check 4: Check group role permission level (Owner, Admin, Moderator, Member, Guest)
    const userRole = memberObj.role || 'MEMBER';
    if (userRole === 'OWNER') return true;

    if (userRole === 'ADMIN') {
      if (action === 'delete') return false; // Only Owner can delete the entire group
      return true;
    }

    if (userRole === 'MODERATOR') {
      // Moderators can edit details, invite users, and remove members
      if ([
        'rename', 'change_photo', 'change_description',
        'add_members', 'remove_members', 'manage_invite_link'
      ].includes(action)) {
        return true;
      }
      return false;
    }

    if (userRole === 'MEMBER') {
      // Normal members can only leave the group
      if (action === 'leave') return true;
      return false;
    }

    if (userRole === 'GUEST') {
      return false; // Guests cannot perform any group edits or leave/add
    }

    return false;
  };

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    checkGroupPermission
  };
}

export default usePermissions;
