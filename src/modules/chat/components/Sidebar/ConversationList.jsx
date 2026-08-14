"use client";

import React, { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Pin,
  Star,
  VolumeX,
  Hash,
  Users,
  PinOff,
  Volume2,
  Trash2,
  Archive,
  LogOut,
  FileText,
  Settings,
  Edit3,
  UserPlus
} from "lucide-react";
import {
  setActiveConversationId,
  selectActiveConversationId,
  selectTypingState,
  selectComposerDrafts,
  setRightPanelTab
} from "@/modules/chat/store/chatSlice";
import { getConversationDisplay } from "@/modules/chat/utils/getConversationDisplay";
import Avatar from "../Timeline/Avatar";
import UserProfileModal from "../Common/UserProfileModal";
import { getAvatarUrl } from "@/lib/axios";
import { ChatAPI } from "@/api/chat.api";
import { useQueryClient } from "@tanstack/react-query";
import { CHAT_QUERY_KEYS } from "@/modules/chat/constants/query-keys";
import { toast } from "sonner";
import axiosClient from "@/lib/axios";

const formatLastMessageTime = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();

  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return d.toLocaleDateString([], { month: '2-digit', day: '2-digit' });
};

// ── Custom Confirmation Modal (Premium replacement for browser alerts) ───

function ConfirmModal({ isOpen, onClose, title, message, confirmLabel, cancelLabel, onConfirm, isDestructive }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 text-left">
        <div className="p-5">
          <h3 className="text-slate-900 font-bold text-[13.5px] mb-1.5">{title}</h3>
          <p className="text-slate-500 text-[11.5px] leading-relaxed">{message}</p>
        </div>
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-slate-350 text-slate-700 rounded-lg text-[11px] font-bold cursor-pointer transition-colors"
          >
            {cancelLabel || "Cancel"}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-3.5 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-colors text-white
              ${isDestructive
                ? "bg-red-655 bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {confirmLabel || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Right-click context menu ──────────────────────────────────────────────────

function ConversationContextMenu({
  x,
  y,
  onClose,
  conversation,
  currentUser,
  isPinned,
  isMuted,
  isFavorite,
  isPrivileged,
  onPin,
  onUnpin,
  onMute,
  onUnmute,
  onFavorite,
  onUnfavorite,
  onArchive,
  onUnarchive,
  onClear,
  onExport,
  onLeave,
  onRename,
  onDeleteGroup,
  onOpenSettings
}) {
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  // Adjust position so menu doesn't go off screen
  const menuStyle = {
    position: "fixed",
    top: y,
    left: x,
    zIndex: 9999,
  };

  const isDM = conversation.type === "DIRECT";
  const isGroup = conversation.type === "GROUP";
  const isChannel = conversation.type === "CHANNEL";

  return (
    <div
      ref={ref}
      style={menuStyle}
      className="w-48 bg-white border border-slate-200/80 rounded-xl shadow-2xl py-1 text-[11px] overflow-hidden animate-in fade-in zoom-in-95 duration-100 select-none"
    >
      {/* ── SHARED OPTIONS (Pin/Unpin, Favorite, Mute) ── */}
      {isPinned ? (
        <button
          onClick={() => { onUnpin(); onClose(); }}
          className="w-full flex items-center gap-2 px-3.5 py-1.5 text-slate-700 hover:bg-slate-50 cursor-pointer font-medium text-left transition-colors"
        >
          <PinOff className="h-3.5 w-3.5 text-slate-400" />
          Unpin conversation
        </button>
      ) : (
        <button
          onClick={() => { onPin(); onClose(); }}
          className="w-full flex items-center gap-2 px-3.5 py-1.5 text-slate-700 hover:bg-slate-50 cursor-pointer font-medium text-left transition-colors"
        >
          <Pin className="h-3.5 w-3.5 text-slate-400" />
          Pin to top
        </button>
      )}

      {isFavorite ? (
        <button
          onClick={() => { onUnfavorite(); onClose(); }}
          className="w-full flex items-center gap-2 px-3.5 py-1.5 text-slate-700 hover:bg-slate-50 cursor-pointer font-medium text-left transition-colors"
        >
          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
          Remove from Favorites
        </button>
      ) : (
        <button
          onClick={() => { onFavorite(); onClose(); }}
          className="w-full flex items-center gap-2 px-3.5 py-1.5 text-slate-700 hover:bg-slate-50 cursor-pointer font-medium text-left transition-colors"
        >
          <Star className="h-3.5 w-3.5 text-slate-400" />
          Add to Favorites
        </button>
      )}

      {isMuted ? (
        <button
          onClick={() => { onUnmute(); onClose(); }}
          className="w-full flex items-center gap-2 px-3.5 py-1.5 text-slate-700 hover:bg-slate-50 cursor-pointer font-medium text-left transition-colors"
        >
          <Volume2 className="h-3.5 w-3.5 text-slate-400" />
          Unmute notifications
        </button>
      ) : (
        <button
          onClick={() => { onMute(); onClose(); }}
          className="w-full flex items-center gap-2 px-3.5 py-1.5 text-slate-700 hover:bg-slate-50 cursor-pointer font-medium text-left transition-colors"
        >
          <VolumeX className="h-3.5 w-3.5 text-slate-400" />
          Mute notifications
        </button>
      )}

      <div className="border-t border-slate-100 my-1"></div>

      {/* ── CONVERSATION TYPE SPECIFIC OPTIONS ── */}
      {isDM && (
        <>
          {conversation.isArchived ? (
            <button
              onClick={() => { onUnarchive(); onClose(); }}
              className="w-full flex items-center gap-2 px-3.5 py-1.5 text-slate-700 hover:bg-slate-50 cursor-pointer font-medium text-left transition-colors"
            >
              <Archive className="h-3.5 w-3.5 text-slate-400" />
              Unarchive Chat
            </button>
          ) : (
            <button
              onClick={() => { onArchive(); onClose(); }}
              className="w-full flex items-center gap-2 px-3.5 py-1.5 text-slate-700 hover:bg-slate-50 cursor-pointer font-medium text-left transition-colors"
            >
              <Archive className="h-3.5 w-3.5 text-slate-400" />
              Archive Chat
            </button>
          )}
          <button
            onClick={() => { onClear(); onClose(); }}
            className="w-full flex items-center gap-2 px-3.5 py-1.5 text-slate-700 hover:bg-slate-50 cursor-pointer font-medium text-left transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5 text-slate-400" />
            Clear Chat
          </button>
          <button
            onClick={() => { onExport(); onClose(); }}
            className="w-full flex items-center gap-2 px-3.5 py-1.5 text-slate-700 hover:bg-slate-50 cursor-pointer font-medium text-left transition-colors"
          >
            <FileText className="h-3.5 w-3.5 text-slate-400" />
            Export Chat Transcript
          </button>
        </>
      )}

      {isGroup && (
        <>
          {conversation.isArchived ? (
            <button
              onClick={() => { onUnarchive(); onClose(); }}
              className="w-full flex items-center gap-2 px-3.5 py-1.5 text-slate-700 hover:bg-slate-50 cursor-pointer font-medium text-left transition-colors"
            >
              <Archive className="h-3.5 w-3.5 text-slate-400" />
              Unarchive Chat
            </button>
          ) : (
            <button
              onClick={() => { onArchive(); onClose(); }}
              className="w-full flex items-center gap-2 px-3.5 py-1.5 text-slate-700 hover:bg-slate-50 cursor-pointer font-medium text-left transition-colors"
            >
              <Archive className="h-3.5 w-3.5 text-slate-400" />
              Archive Chat
            </button>
          )}
          <button
            onClick={() => { onLeave(); onClose(); }}
            className="w-full flex items-center gap-2 px-3.5 py-1.5 text-red-650 hover:bg-red-50 cursor-pointer font-medium text-left transition-colors"
          >
            <LogOut className="h-3.5 w-3.5 text-red-400" />
            Leave Group
          </button>

          {isPrivileged && (
            <>
              <div className="border-t border-slate-100 my-1"></div>
              <span className="px-3.5 py-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Admin Options</span>
              <button
                onClick={() => { onDeleteGroup(); onClose(); }}
                className="w-full flex items-center gap-2 px-3.5 py-1.5 text-red-600 hover:bg-red-55 cursor-pointer font-bold text-left transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5 text-red-400" />
                Delete Group
              </button>
            </>
          )}
        </>
      )}

      {isChannel && (
        <>


          {isPrivileged && (
            <>
              <div className="border-t border-slate-100 my-1"></div>
              <span className="px-3.5 py-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Admin Options</span>
              <button
                onClick={() => { onDeleteGroup(); onClose(); }}
                className="w-full flex items-center gap-2 px-3.5 py-1.5 text-red-655 hover:bg-red-50/60 cursor-pointer font-bold text-left transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5 text-red-400" />
                Delete Channel
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default function ConversationList({
  conversations,
  filterType,
  searchQuery,
  currentUser,
  presenceMap = {}
}) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const activeId = useSelector(selectActiveConversationId);
  const typingState = useSelector(selectTypingState);
  const drafts = useSelector(selectComposerDrafts) || {};

  // Context menu state
  const [contextMenu, setContextMenu] = useState(null); // { x, y, conversation, isPinned, isMuted, isFavorite, isPrivileged }

  // Custom Confirmation Modal state
  const [modalConfig, setModalConfig] = useState(null); // { title, message, confirmLabel, cancelLabel, onConfirm, isDestructive }
  const [selectedAvatarUser, setSelectedAvatarUser] = useState(null);

  const handleContextMenu = useCallback((e, c, isPinned, isMuted, isFavorite, isPrivileged) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, conversation: c, isPinned, isMuted, isFavorite, isPrivileged });
  }, []);

  const handleCloseMenu = useCallback(() => setContextMenu(null), []);

  const handlePin = useCallback(async (c) => {
    const userId = currentUser?.id || currentUser?.userId;
    if (!userId) return;
    try {
      await ChatAPI.pinConversation(c.id, userId);
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversations() });
      toast.success("Conversation pinned.");
    } catch (err) {
      toast.error("Failed to pin conversation.");
    }
  }, [currentUser, queryClient]);

  const handleUnpin = useCallback(async (c) => {
    const userId = currentUser?.id || currentUser?.userId;
    if (!userId) return;
    try {
      await ChatAPI.unpinConversation(c.id, userId);
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversations() });
      toast.success("Conversation unpinned.");
    } catch (err) {
      toast.error("Failed to unpin conversation.");
    }
  }, [currentUser, queryClient]);

  const handleMuteSelf = useCallback(async (c, mute) => {
    const userId = currentUser?.id || currentUser?.userId;
    if (!userId) return;
    try {
      await ChatAPI.muteConversationSelf(c.id, userId, mute);
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversations() });
      toast.success(mute ? "Notifications muted." : "Notifications unmuted.");
    } catch (err) {
      toast.error("Failed to update notification settings.");
    }
  }, [currentUser, queryClient]);

  const handleFavorite = useCallback(async (c, fav) => {
    const userId = currentUser?.id || currentUser?.userId;
    if (!userId) return;
    try {
      if (fav) {
        await ChatAPI.favoriteConversation(c.id, userId);
      } else {
        await ChatAPI.unfavoriteConversation(c.id, userId);
      }
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversations() });
      toast.success(fav ? "Added to Favorites." : "Removed from Favorites.");
    } catch (err) {
      toast.error("Failed to update Favorites.");
    }
  }, [currentUser, queryClient]);



  const handleArchive = useCallback(async (c) => {
    try {
      await ChatAPI.archiveConversation(c.id);
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversations() });
      if (activeId === c.id) {
        dispatch(setActiveConversationId(null));
      }
      toast.success("Conversation archived.");
    } catch (err) {
      toast.error("Failed to archive conversation.");
    }
  }, [queryClient, activeId, dispatch]);

  const handleUnarchive = useCallback(async (c) => {
    try {
      await ChatAPI.unarchiveConversation(c.id);
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversations() });
      toast.success("Conversation unarchived.");
    } catch (err) {
      toast.error("Failed to unarchive conversation.");
    }
  }, [queryClient]);

  const handleClearChat = useCallback((c) => {
    setModalConfig({
      title: "Clear Chat",
      message: `Are you sure you want to clear your chat history for "${c.name || 'this conversation'}"? This action cannot be undone.`,
      confirmLabel: "Clear Chat",
      cancelLabel: "Cancel",
      isDestructive: true,
      onConfirm: async () => {
        try {
          await ChatAPI.clearChat(c.id);
          queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.messages(c.id) });
          queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversations() });
          toast.success("Conversation history cleared.");
        } catch (err) {
          toast.error("Failed to clear conversation history.");
        }
      }
    });
  }, [queryClient]);

  const handleExportChat = useCallback(async (c) => {
    try {
      const res = await ChatAPI.exportConversationTranscript(c.id);
      const element = document.createElement("a");
      const file = new Blob([JSON.stringify(res, null, 2)], { type: "application/json" });
      element.href = URL.createObjectURL(file);
      element.download = `${c.name || "chat"}_transcript.json`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success("Chat transcript exported successfully!");
    } catch (err) {
      toast.error("Failed to export chat transcript.");
    }
  }, []);

  const handleLeaveGroup = useCallback((c) => {
    setModalConfig({
      title: "Leave Group",
      message: `Are you sure you want to leave the group "${c.name || 'this group'}"? You will no longer receive or be able to send any messages in this group.`,
      confirmLabel: "Leave Group",
      cancelLabel: "Cancel",
      isDestructive: true,
      onConfirm: async () => {
        try {
          await axiosClient.post(`/chat/conversations/${c.id}/leave`);
          queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversations() });
          if (activeId === c.id) {
            dispatch(setActiveConversationId(null));
          }
          toast.success("You left the group.");
        } catch (err) {
          toast.error("Failed to leave group.");
        }
      }
    });
  }, [queryClient, activeId, dispatch]);

  const handleRename = useCallback(async (c) => {
    const newName = window.prompt("Enter new name:", c.name || "");
    if (!newName || !newName.trim()) return;
    try {
      await ChatAPI.updateConversation(c.id, { name: newName.trim() });
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversations() });
      toast.success("Renamed successfully.");
    } catch (err) {
      toast.error("Failed to rename.");
    }
  }, [queryClient]);

  const handleDeleteGroup = useCallback((c) => {
    const desc = c.type === "CHANNEL" ? "channel" : "group";
    setModalConfig({
      title: `Delete ${desc.charAt(0).toUpperCase() + desc.slice(1)}`,
      message: `WARNING: Are you sure you want to permanently delete the ${desc} "${c.name || 'this workspace'}"? All chat history and shared assets will be deleted forever. This action cannot be undone.`,
      confirmLabel: `Delete ${desc.charAt(0).toUpperCase() + desc.slice(1)}`,
      cancelLabel: "Cancel",
      isDestructive: true,
      onConfirm: async () => {
        try {
          await ChatAPI.deleteConversation(c.id);
          queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversations() });
          if (activeId === c.id) {
            dispatch(setActiveConversationId(null));
          }
          toast.success(`${desc.charAt(0).toUpperCase() + desc.slice(1)} permanently deleted.`);
        } catch (err) {
          toast.error(`Failed to delete ${desc}.`);
        }
      }
    });
  }, [queryClient, activeId, dispatch]);

  const handleOpenSettings = useCallback(() => {
    dispatch(setRightPanelTab("GROUP_SETTINGS"));
  }, [dispatch]);

  // Filter and sort conversations
  const filteredList = useMemo(() => {
    return conversations
      .filter((c) => {
        const details = getConversationDisplay(c, currentUser, presenceMap, typingState);
        const query = searchQuery.trim().toLowerCase();

        if (!query) {
          // Category filter matching
          if (filterType === "CHANNELS") return c.type === "CHANNEL";
          if (filterType === "DMS") return c.type === "DIRECT";
          if (filterType === "GROUPS") return c.type === "GROUP";
          return true;
        }

        const matchesSearch =
          details.title?.toLowerCase().includes(query) ||
          details.subtitle?.toLowerCase().includes(query) ||
          details.department?.toLowerCase().includes(query) ||
          details.designation?.toLowerCase().includes(query) ||
          (details.otherMember?.user?.email && details.otherMember.user.email.toLowerCase().includes(query)) ||
          (details.otherMember?.user?.employee?.mobile && details.otherMember.user.employee.mobile.toLowerCase().includes(query));

        if (!matchesSearch) return false;

        // Category filter matching
        if (filterType === "CHANNELS") return c.type === "CHANNEL";
        if (filterType === "DMS") return c.type === "DIRECT";
        if (filterType === "GROUPS") return c.type === "GROUP";
        return true;
      })
      .sort((a, b) => {
        const currentUserMembershipA = a.members?.find((m) => m.userId === currentUser?.id) || {};
        const currentUserMembershipB = b.members?.find((m) => m.userId === currentUser?.id) || {};

        // Pinned first
        const aPinned = currentUserMembershipA.isPinned ? 1 : 0;
        const bPinned = currentUserMembershipB.isPinned ? 1 : 0;
        if (aPinned !== bPinned) return bPinned - aPinned;

        // Favorites second
        const aFav = currentUserMembershipA.isFavorite ? 1 : 0;
        const bFav = currentUserMembershipB.isFavorite ? 1 : 0;
        if (aFav !== bFav) return bFav - aFav;

        // Most recent activity last (uses lastMessage.createdAt if available, fallback to updatedAt)
        const timeA = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : new Date(a.updatedAt).getTime();
        const timeB = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : new Date(b.updatedAt).getTime();
        return timeB - timeA;
      });
  }, [conversations, filterType, searchQuery, currentUser, presenceMap, typingState]);

  return (
    <div className="flex-1 overflow-y-auto space-y-2 pr-1 select-none">
      {filteredList.length === 0 ? (
        <div className="text-center text-xs text-slate-400 py-8">
          No conversations found.
        </div>
      ) : (
        <ul className="space-y-0.5 px-1">
          {filteredList.map((c) => {
            const isActive = activeId === c.id;
            const currentUserMembership = c.members?.find((m) => m.userId === currentUser?.id) || {};
            const isMuted = currentUserMembership.isNotificationMuted || currentUserMembership.isMuted;
            const isPinned = currentUserMembership.isPinned;
            const isFavorite = currentUserMembership.isFavorite;
            const unreadCount = c.unreadCount !== undefined ? c.unreadCount : (currentUserMembership.unreadMessagesCount || 0);
            const isPrivileged = ["OWNER", "ADMIN", "MODERATOR"].includes(currentUserMembership.role);

            const details = getConversationDisplay(c, currentUser, presenceMap, typingState);

            // Construct virtual sender details for DM avatar rendering
            const senderDetails = {
              name: details.title,
              avatarUrl: details.avatar
            };

            const hasLastMessage = !!c.lastMessage;

            // Draft prefix check
            const draft = drafts[c.id];
            const hasDraft = draft && draft.trim().length > 0;

            const lastMsgContent = hasDraft ? (
              <span className={isActive ? "text-orange-700 font-medium" : "text-orange-600 font-semibold"}>
                <span className="italic">Draft: </span>{draft}
              </span>
            ) : hasLastMessage
              ? c.lastMessage.type === "FILE"
                ? "📎 File"
                : c.lastMessage.type === "VOICE"
                  ? "🎤 Voice message"
                  : c.lastMessage.content
              : details.subtitle;

            const lastMsgTime = hasLastMessage
              ? formatLastMessageTime(c.lastMessage.createdAt)
              : formatLastMessageTime(c.updatedAt);

            return (
              <li key={c.id} className="list-none">
                <button
                  onClick={() => dispatch(setActiveConversationId(c.id))}
                  onContextMenu={(e) => handleContextMenu(e, c, isPinned, isMuted, isFavorite, isPrivileged)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer group
                    ${isActive
                      ? "bg-blue-50/80 border border-blue-100 shadow-sm"
                      : "border border-transparent hover:bg-slate-50/80 hover:border-slate-100/60"
                    }`}
                >
                  {/* Avatar */}
                  <div
                    className="relative flex-shrink-0 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAvatarUser({
                        name: details.title,
                        avatarUrl: details.avatar,
                        presence: details.presence,
                      });
                    }}
                  >
                    {c.type === "DIRECT" ? (
                      <Avatar sender={senderDetails} presence={details.presence} size="md" disableModal />
                    ) : details.avatar ? (
                      <img
                        src={getAvatarUrl(details.avatar)}
                        alt={details.title}
                        className="h-10 w-10 rounded-full object-cover border border-slate-200 group-hover:ring-2 group-hover:ring-blue-100 transition-all"
                      />
                    ) : (
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center border transition-all
                        ${isActive
                          ? "bg-blue-100 border-blue-200 text-blue-600"
                          : "bg-slate-100 border-slate-200 text-slate-500 group-hover:bg-slate-200/70"
                        }`}>
                        {c.type === "CHANNEL" ? (
                          <Hash className="h-5 w-5" />
                        ) : (
                          <Users className="h-5 w-5" />
                        )}
                      </div>
                    )}

                    {/* Pinned badge on avatar */}
                    {isPinned && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center shadow-sm">
                        <Pin className="h-2 w-2 text-white" />
                      </span>
                    )}
                  </div>

                  {/* Text content */}
                  <div className="flex flex-col flex-1 min-w-0 gap-[1px]">

                    {/* Row 1: Name + Time */}
                    <div className="flex items-center justify-between w-full">
                      <span className={`truncate text-[14.5px] leading-snug
                        ${unreadCount > 0 && !isActive
                          ? "font-bold text-slate-900"
                          : isActive ? "font-semibold text-blue-700" : "font-semibold text-slate-800 group-hover:text-slate-900"
                        }`}>
                        {details.title}
                      </span>
                      <span className={`text-[11px] font-medium shrink-0 ml-2 tabular-nums
                        ${unreadCount > 0 && !isActive ? "text-emerald-600 font-semibold" : isActive ? "text-blue-500" : "text-slate-400"}`}>
                        {lastMsgTime}
                      </span>
                    </div>

                    {/* Row 2: Preview + Unread badge */}
                    <div className="flex items-center justify-between w-full mt-0.5">
                      <div className="flex-1 min-w-0 flex items-center gap-1.5">
                        {isMuted && <VolumeX className="h-3 w-3 text-slate-400 flex-shrink-0" />}
                        {isPinned && <Pin className={`h-3 w-3 rotate-45 flex-shrink-0 ${isActive ? "text-blue-500" : "text-blue-400"}`} />}
                        {isFavorite && <Star className="h-3 w-3 text-amber-400 fill-amber-400 flex-shrink-0" />}
                        {details.isTyping ? (
                          <span className={`text-[11.5px] font-semibold animate-pulse
                            ${isActive ? "text-blue-600" : "text-emerald-600"}`}>
                            typing...
                          </span>
                        ) : (
                          <span className={`text-[12.5px] truncate leading-tight
                            ${unreadCount > 0 && !isActive
                              ? "text-slate-700 font-medium"
                              : isActive ? "text-slate-600" : "text-slate-500"
                            }`}>
                            {lastMsgContent}
                          </span>
                        )}
                      </div>

                      {/* WhatsApp-style unread badge */}
                      {unreadCount > 0 && !isActive && (
                        <span className="ml-2 flex-shrink-0 h-5 min-w-[20px] px-1.5 bg-emerald-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm leading-none">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </div>

                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* Right-click context menu */}
      {contextMenu && (
        <ConversationContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          conversation={contextMenu.conversation}
          currentUser={currentUser}
          isPinned={contextMenu.isPinned}
          isMuted={contextMenu.isMuted}
          isFavorite={contextMenu.isFavorite}
          isPrivileged={contextMenu.isPrivileged}
          onClose={handleCloseMenu}
          onPin={() => handlePin(contextMenu.conversation)}
          onUnpin={() => handleUnpin(contextMenu.conversation)}
          onMute={() => handleMuteSelf(contextMenu.conversation, true)}
          onUnmute={() => handleMuteSelf(contextMenu.conversation, false)}
          onFavorite={() => handleFavorite(contextMenu.conversation, true)}
          onUnfavorite={() => handleFavorite(contextMenu.conversation, false)}
          onArchive={() => handleArchive(contextMenu.conversation)}
          onUnarchive={() => handleUnarchive(contextMenu.conversation)}
          onClear={() => handleClearChat(contextMenu.conversation)}
          onExport={() => handleExportChat(contextMenu.conversation)}
          onLeave={() => handleLeaveGroup(contextMenu.conversation)}
          onRename={() => handleRename(contextMenu.conversation)}
          onDeleteGroup={() => handleDeleteGroup(contextMenu.conversation)}
          onOpenSettings={handleOpenSettings}
        />
      )}

      {/* Premium Custom Confirmation Modal */}
      {modalConfig && (
        <ConfirmModal
          isOpen={!!modalConfig}
          onClose={() => setModalConfig(null)}
          title={modalConfig.title}
          message={modalConfig.message}
          confirmLabel={modalConfig.confirmLabel}
          cancelLabel={modalConfig.cancelLabel}
          onConfirm={modalConfig.onConfirm}
          isDestructive={modalConfig.isDestructive}
        />
      )}

      {/* Full Image Preview Modal */}
      {selectedAvatarUser && (
        <UserProfileModal
          user={selectedAvatarUser}
          isOpen={!!selectedAvatarUser}
          onClose={() => setSelectedAvatarUser(null)}
        />
      )}
    </div>
  );
}
