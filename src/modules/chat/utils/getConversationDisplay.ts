export interface ConversationDisplay {
  title: string;
  subtitle: string;
  avatar: string | null;
  initials: string;
  avatarClass: string;
  presence: 'ONLINE' | 'AWAY' | 'BUSY' | 'OFFLINE';
  department: string;
  designation: string;
  status: string;
  lastSeenText: string;
  otherMember: any | null;
  isTyping: boolean;
  typingText: string;
}

const colors = [
  "bg-rose-100 text-rose-700 border-rose-200",
  "bg-sky-100 text-sky-700 border-sky-200",
  "bg-emerald-100 text-emerald-700 border-emerald-200",
  "bg-amber-100 text-amber-700 border-amber-200",
  "bg-purple-100 text-purple-700 border-purple-200",
  "bg-pink-100 text-pink-700 border-pink-200",
  "bg-indigo-100 text-indigo-700 border-indigo-200",
  "bg-teal-100 text-teal-700 border-teal-200",
];

const getAvatarStyle = (name: string): string => {
  let hash = 0;
  const cleanName = name || "Staff Member";
  for (let i = 0; i < cleanName.length; i++) {
    hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const getInitials = (name: string): string => {
  if (!name) return "EE";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const formatLastSeen = (lastLogin: string | Date | null): string => {
  if (!lastLogin) return "Offline";
  const loginDate = new Date(lastLogin);
  const now = new Date();
  const diffMs = now.getTime() - loginDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

export function getConversationDisplay(
  conversation: any,
  currentUser: any,
  presenceMap: Record<number, { status: string, lastSeen: string | null }> = {},
  typingState: any = {}
): ConversationDisplay {
  if (!conversation) {
    return {
      title: "",
      subtitle: "",
      avatar: null,
      initials: "EE",
      avatarClass: colors[0],
      presence: "OFFLINE",
      department: "",
      designation: "",
      status: "",
      lastSeenText: "",
      otherMember: null,
      isTyping: false,
      typingText: ""
    };
  }

  // typing status resolution
  const conversationTyping = typingState[conversation.id] || [];
  const isTyping = conversationTyping.length > 0;
  const typingText = isTyping
    ? conversationTyping.length === 1
      ? `${conversationTyping[0].name} is typing...`
      : "Several people are typing..."
    : "";

  // 1. Group / Channel display resolution
  if (conversation.type !== "DIRECT") {
    const title = conversation.type === "CHANNEL" 
      ? `#${conversation.name || "channel"}` 
      : conversation.name || "Private Group";
    
    return {
      title,
      subtitle: conversation.description || "No description set",
      avatar: conversation.avatarUrl || conversation.photoUrl || null,
      initials: getInitials(conversation.name),
      avatarClass: getAvatarStyle(conversation.name),
      presence: "OFFLINE",
      department: "",
      designation: "",
      status: "",
      lastSeenText: "",
      otherMember: null,
      isTyping,
      typingText
    };
  }

  // 2. Direct Message Display Resolution
  const currentUserId = currentUser?.id ? Number(currentUser.id) : null;
  const members = conversation.members || [];
  
  // Find recipient checking both m.user.id and m.userId, converting to Numbers for type safety
  const otherMember = members.find((m: any) => {
    const memberUserId = m.user?.id || m.userId;
    if (!memberUserId || !currentUserId) return false;
    return Number(memberUserId) !== currentUserId;
  });

  // Diagnostic warning logging if DM resolution fails
  if (!otherMember || !otherMember.user) {
    let reason = "Unknown reason";
    if (members.length === 0) {
      reason = "Backend include missing (members list is empty/undefined)";
    } else if (!currentUserId) {
      reason = "Current user context is missing or not yet loaded";
    } else if (members.length === 1) {
      reason = "Missing second member (DM conversation has only 1 member)";
    } else if (otherMember && !otherMember.user) {
      reason = "User association eager-loading is missing in backend API response";
    } else {
      reason = "Invalid member mapping (all member IDs equal current user ID)";
    }

    console.warn(`[getConversationDisplay] DM identity resolution failed for Conv #${conversation.id}. Reason: ${reason}.`, {
      conversationId: conversation.id,
      currentUserId,
      membersCount: members.length,
      membersList: members.map((m: any) => ({
        userId: m.userId,
        nestedUserId: m.user?.id,
        hasUser: !!m.user
      }))
    });

    return {
      title: "Direct Message",
      subtitle: `No recipient (${reason})`,
      avatar: null,
      initials: "DM",
      avatarClass: colors[0],
      presence: "OFFLINE",
      department: "",
      designation: "",
      status: "",
      lastSeenText: "",
      otherMember: null,
      isTyping,
      typingText
    };
  }

  const userObj = otherMember.user;
  const empObj = userObj.employee;

  const resolvedName = empObj
    ? `${empObj.firstName || ""} ${empObj.lastName || ""}`.trim()
    : userObj.name || userObj.email || "Direct Message";

  const designation = empObj?.designation?.name || "";
  const department = empObj?.department?.name || "";

  let subtitle = "";
  if (designation && department) {
    subtitle = `${designation} • ${department}`;
  } else {
    subtitle = designation || department || userObj.email || "";
  }

  // Real-time presence lookup from socket events
  const socketPresence = presenceMap[userObj.id];

  let rawPresence: string;
  if (socketPresence?.status) {
    // Authoritative: live socket presence event received
    rawPresence = socketPresence.status;
  } else if (userObj.presence) {
    // Fallback 1: presence field from DB/API
    rawPresence = userObj.presence;
  } else if (userObj.lastLogin) {
    // Fallback 2: if logged in within the last 5 minutes, treat as ONLINE
    // (covers the case where the other user was already online before this
    //  component mounted and never fired a presence_changed socket event)
    const diffMs = Date.now() - new Date(userObj.lastLogin).getTime();
    rawPresence = diffMs < 5 * 60 * 1000 ? "ONLINE" : "OFFLINE";
  } else {
    rawPresence = "OFFLINE";
  }

  const presence = (["ONLINE", "AWAY", "BUSY"].includes(rawPresence.toUpperCase()))
    ? rawPresence.toUpperCase() as any
    : "OFFLINE";

  // Only show last-seen timestamp when the user is actually offline
  const lastSeenVal = presence === "OFFLINE"
    ? (socketPresence?.lastSeen || userObj.lastLogin)
    : null;

  const lastSeenText = presence === "ONLINE"
    ? "Online"
    : presence === "AWAY"
    ? "Away"
    : presence === "BUSY"
    ? "Busy"
    : lastSeenVal
    ? `Last seen ${formatLastSeen(lastSeenVal)}`
    : "Offline";

  const avatar = userObj.avatarUrl || null;
  const initials = getInitials(resolvedName);
  const avatarClass = getAvatarStyle(resolvedName);

  return {
    title: resolvedName,
    subtitle,
    avatar,
    initials,
    avatarClass,
    presence,
    department,
    designation,
    status: userObj.status || "Active",
    lastSeenText,
    otherMember,
    isTyping,
    typingText
  };
}
