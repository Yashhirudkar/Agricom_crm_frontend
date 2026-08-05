/**
 * Enterprise Channel Posting Permission Utility
 *
 * Dual-layer permission model:
 *   Layer 1 — Global RBAC: does the user have `chat:create` permission?
 *   Layer 2 — Channel Policy: does the channel's postingPolicy allow this user?
 *
 * Both layers must pass → canPost = true
 *
 * Supported postingPolicy values:
 *   EVERYONE        — anyone with chat:create can post
 *   ADMINS          — OWNER or ADMIN role in the conversation
 *   OWNER           — OWNER role only
 *   SELECTED_ROLES  — role listed in allowedRoles[]
 *   SELECTED_USERS  — userId listed in allowedPosters[] (user IDs)
 *
 * Used by:
 *   - page.jsx            → show/hide composer vs read-only banner
 *   - usePermissions.js   → checkChannelPostPermission()
 *   - GroupSettingsPanel  → validate permission before save
 */

/**
 * Posting policy constants — mirrors backend enum values.
 * Never hardcode strings across the codebase — import from here.
 */
export const POSTING_POLICY = {
  EVERYONE: "EVERYONE",
  ADMINS: "ADMINS",
  OWNER: "OWNER",
  SELECTED_ROLES: "SELECTED_ROLES",
  SELECTED_USERS: "SELECTED_USERS",
};

/**
 * Human-readable labels for each posting policy.
 * Used in GroupSettingsPanel Posting Permissions tab.
 */
export const POSTING_POLICY_LABELS = {
  [POSTING_POLICY.EVERYONE]: "Everyone",
  [POSTING_POLICY.ADMINS]: "Admins only (Owner + Admins)",
  [POSTING_POLICY.OWNER]: "Owner only",
  [POSTING_POLICY.SELECTED_ROLES]: "Selected Roles",
  [POSTING_POLICY.SELECTED_USERS]: "Selected Users",
};

/**
 * Resolve the current user's membership object from conversation.members.
 * Returns null if user is not a member.
 *
 * @param {object} conversation
 * @param {object} currentUser
 * @returns {object|null}
 */
export function resolveCurrentMember(conversation, currentUser) {
  if (!conversation || !currentUser) return null;
  const members = conversation.members || [];
  const uid = currentUser?.id || currentUser?.userId;
  return (
    members.find((m) => Number(m.userId || m.user?.id) === Number(uid)) || null
  );
}

/**
 * Check whether this conversation is a restricted channel type.
 * Returns true for CHANNEL and ANNOUNCEMENT_CHANNEL (future-proof).
 * Groups, DMs, and PRIVATE_GROUP always allow posting.
 *
 * @param {object} conversation
 * @returns {boolean}
 */
export function isRestrictedChannelType(conversation) {
  if (!conversation) return false;
  const type = conversation.type;
  return type === "CHANNEL" || type === "ANNOUNCEMENT_CHANNEL";
}

/**
 * Core dual-layer permission check.
 *
 * @param {object}   conversation   — active conversation object from API
 * @param {object}   currentUser    — logged-in user (from Redux authSlice)
 * @param {Function} hasPermission  — from usePermissions() hook
 * @returns {boolean}               — true = user can post, false = read-only
 */
export function canUserPost(conversation, currentUser, hasPermission) {
  // Non-channels (Group, DM, Private Group) — always allow
  if (!isRestrictedChannelType(conversation)) return true;

  // Layer 1 — Global RBAC: must have chat:create
  // Super/Client Admins will pass this automatically via hasPermission logic
  if (!hasPermission("chat:create")) return false;

  const policy = conversation.postingPolicy || POSTING_POLICY.EVERYONE;
  const currentMember = resolveCurrentMember(conversation, currentUser);

  // Layer 2 — Channel Policy
  switch (policy) {
    case POSTING_POLICY.EVERYONE:
      return true;

    case POSTING_POLICY.OWNER: {
      const role = currentMember?.role;
      return role === "OWNER";
    }

    case POSTING_POLICY.ADMINS: {
      const role = currentMember?.role;
      return role === "OWNER" || role === "ADMIN";
    }

    case POSTING_POLICY.SELECTED_ROLES: {
      // allowedRoles: string[] of role names e.g. ["HR_MANAGER", "DIRECTOR"]
      const allowedRoles = conversation.allowedRoles || [];
      if (allowedRoles.length === 0) return false;

      const role = currentMember?.role;
      if (!role) return false;

      // Check conversation-level member role (OWNER/ADMIN always pass)
      if (role === "OWNER" || role === "ADMIN") return true;

      // Check against RBAC role names from user's workspaces / user.role
      const userRoleNames = getUserRoleNames(currentUser);
      return userRoleNames.some((r) =>
        allowedRoles.some(
          (allowed) => allowed.toLowerCase() === r.toLowerCase()
        )
      );
    }

    case POSTING_POLICY.SELECTED_USERS: {
      // allowedPosters: number[] of userId values
      const allowedPosters = conversation.allowedPosters || [];
      if (allowedPosters.length === 0) return false;

      const uid = Number(currentUser?.id || currentUser?.userId);
      const memberRole = currentMember?.role;

      // OWNER always bypasses
      if (memberRole === "OWNER") return true;

      return allowedPosters.some((id) => Number(id) === uid);
    }

    default:
      // Unknown policy → default open
      return true;
  }
}

/**
 * Extract user role names from their workspace memberships.
 * Used for SELECTED_ROLES policy matching.
 *
 * @param {object} currentUser
 * @returns {string[]}
 */
function getUserRoleNames(currentUser) {
  const roles = [];

  // From workspaces array
  if (currentUser?.workspaces && Array.isArray(currentUser.workspaces)) {
    currentUser.workspaces.forEach((ws) => {
      if (ws?.role?.name) roles.push(ws.role.name);
    });
  }

  // From direct role field
  if (currentUser?.role?.name) roles.push(currentUser.role.name);
  if (typeof currentUser?.role === "string") roles.push(currentUser.role);

  return roles;
}

/**
 * Derive sidebar badge label and style for a channel.
 *
 * Returns null if no badge needed (policy = EVERYONE or non-channel).
 *
 * @param {object} conversation
 * @returns {{ label: string, className: string } | null}
 */
export function getChannelBadge(conversation) {
  if (!isRestrictedChannelType(conversation)) return null;

  const policy = conversation.postingPolicy || POSTING_POLICY.EVERYONE;

  if (policy === POSTING_POLICY.EVERYONE) return null;

  if (conversation.type === "ANNOUNCEMENT_CHANNEL") {
    return {
      label: "ANNOUNCEMENT",
      className:
        "bg-amber-50 text-amber-700 border border-amber-200",
    };
  }

  if (
    policy === POSTING_POLICY.OWNER ||
    policy === POSTING_POLICY.ADMINS ||
    policy === POSTING_POLICY.SELECTED_ROLES ||
    policy === POSTING_POLICY.SELECTED_USERS
  ) {
    return {
      label: "ADMIN ONLY",
      className:
        "bg-violet-50 text-violet-700 border border-violet-200",
    };
  }

  return null;
}

/**
 * Derive header subtitle suffix for a channel.
 * Appended after member count: "2 Members • Announcement Channel"
 *
 * @param {object} conversation
 * @returns {string}
 */
export function getChannelHeaderSuffix(conversation) {
  if (!isRestrictedChannelType(conversation)) return "";

  const policy = conversation.postingPolicy || POSTING_POLICY.EVERYONE;
  if (policy === POSTING_POLICY.EVERYONE) return "";

  if (conversation.type === "ANNOUNCEMENT_CHANNEL") {
    return "Announcement Channel";
  }

  if (policy === POSTING_POLICY.ADMINS || policy === POSTING_POLICY.OWNER) {
    return "Admin Posting";
  }

  if (
    policy === POSTING_POLICY.SELECTED_ROLES ||
    policy === POSTING_POLICY.SELECTED_USERS
  ) {
    return "Restricted Posting";
  }

  return "";
}
