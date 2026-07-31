/**
 * Centralized Notification Router
 * ================================
 * Owns ALL routing logic for notification deep-links.
 * Backend only sends: referenceType, referenceId, entityType, entityId, payload.
 * This file decides where to navigate.
 *
 * Adding a new notification type?
 *  → Add a single entry to ROUTE_MAPPERS below. That's it.
 */

/**
 * Route mapper: entityType → function(notification) → URL string
 *
 * Each function receives the full notification object so it can use
 * entityId, payload.tab, payload.highlight, etc.
 *
 * Rules:
 *  - Keep routes as close to existing Next.js pages as possible.
 *  - Use query params to pass context (requestId, partnerId, enquiryId).
 *  - Never generate absolute URLs — always relative paths.
 */
export const ROUTE_MAPPERS = {
  // ── Leave Notifications ──────────────────────────────────────────────────
  /**
   * Leave request submitted by an employee → goes to approvals page
   * (Managers / HR see this)
   */
  LEAVE_REQUEST: (notif) => {
    const id = notif.entityId;
    // If referenceType is leave_approved or leave_rejected or leave_cancelled,
    // the employee should see their own leaves, not the approvals list.
    const rt = (notif.referenceType || '').toLowerCase();
    if (rt === 'leave_approved' || rt === 'leave_rejected' || rt === 'leave_cancelled') {
      return id ? `/my-leaves?requestId=${id}` : '/my-leaves';
    }
    // leave_applied → approvals page for the approver
    return id ? `/leave-approvals?requestId=${id}` : '/leave-approvals';
  },

  // ── Task Notifications ────────────────────────────────────────────────────
  /** Task assigned / updated / completed → task detail page */
  TASK: (notif) => {
    const id = notif.entityId;
    return id ? `/tasks/${id}` : '/tasks';
  },

  // ── Holiday Notifications ─────────────────────────────────────────────────
  /** Holiday announced → holidays calendar page */
  HOLIDAY: () => '/holidays',

  // ── Attendance Notifications ──────────────────────────────────────────────
  /** Check-in / check-out reminder → attendance page */
  ATTENDANCE_REMINDER: () => '/attendance',

  /** Attendance conflict (e.g., checked in on a leave day) → attendance page */
  ATTENDANCE_CONFLICT: () => '/attendance',

  // ── Chat / Follow-up Notifications ───────────────────────────────────────
  /**
   * New follow-up added on an enquiry → enquiries list with drawer auto-open.
   * The EnquiriesListPage reads `enquiryId` from query and auto-opens the drawer.
   */
  ENQUIRY_CHAT: (notif) => {
    const id = notif.entityId;
    return id ? `/enquiries?enquiryId=${id}` : '/enquiries';
  },

  /**
   * New follow-up added on a partner → partners list with drawer auto-open.
   * The PartnersPage reads `partnerId` from query and auto-opens the drawer.
   */
  PARTNER_CHAT: (notif) => {
    const id = notif.entityId;
    return id ? `/masters/partners?partnerId=${id}` : '/masters/partners';
  },
};

/**
 * Resolves the target URL for a given notification.
 *
 * Falls back to `/` when no mapper is found so the click is never a no-op.
 *
 * @param {object} notification - Notification object from Redux store / WebSocket.
 * @returns {string} Relative URL to navigate to.
 */
export function resolveNotificationUrl(notification) {
  const entityType = notification.entityType?.toUpperCase?.() || '';
  const mapper = ROUTE_MAPPERS[entityType];

  if (!mapper) {
    console.warn(`[notificationRouter] No route mapper found for entityType: "${entityType}". Falling back to "/".`);
    // Graceful fallback: if payload has a url, use it (legacy support)
    return notification.payload?.url || '/';
  }

  try {
    return mapper(notification);
  } catch (err) {
    console.error(`[notificationRouter] Error resolving route for entityType: "${entityType}"`, err);
    return '/';
  }
}

/**
 * Full notification click handler.
 *
 * Flow:
 *   1. markAsRead() — optimistic Redux update + API call
 *   2. resolveNotificationUrl() — get target path
 *   3. router.push() — navigate
 *
 * Usage in Header.jsx:
 *   const handleClick = createNotificationClickHandler(dispatch, router);
 *   <div onClick={() => handleClick(notif)} />
 *
 * @param {function} dispatch - Redux dispatch
 * @param {object} router - Next.js router (from useRouter)
 * @param {function} markNotificationRead - Redux thunk action creator
 * @param {function} [onClose] - Optional callback to close notification panel
 * @returns {function} Click handler: (notification) => void
 */
export function createNotificationClickHandler(dispatch, router, markNotificationRead, onClose) {
  return async function handleNotificationClick(notification) {
    // Step 1: Mark as read (fire-and-forget; don't block navigation)
    if (!notification.isRead) {
      dispatch(markNotificationRead(notification.id));
    }

    // Step 2: Resolve target URL
    const url = resolveNotificationUrl(notification);

    // Step 3: Close the dropdown first (better UX)
    if (typeof onClose === 'function') {
      onClose();
    }

    // Step 4: Navigate
    router.push(url);
  };
}
