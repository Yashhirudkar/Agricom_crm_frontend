"use client";

import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Pin,
  Star,
  VolumeX,
  Hash,
  Users
} from "lucide-react";
import {
  setActiveConversationId,
  selectActiveConversationId,
  selectTypingState,
  selectComposerDrafts
} from "@/modules/chat/store/chatSlice";
import { getConversationDisplay } from "@/modules/chat/utils/getConversationDisplay";
import Avatar from "../Timeline/Avatar";

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

export default function ConversationList({
  conversations,
  filterType,
  searchQuery,
  currentUser,
  presenceMap = {}
}) {
  const dispatch = useDispatch();
  const activeId = useSelector(selectActiveConversationId);
  const typingState = useSelector(selectTypingState);
  const drafts = useSelector(selectComposerDrafts) || {};

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

        // Most recent activity last
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [conversations, filterType, searchQuery, currentUser, presenceMap, typingState]);

  return (
    <div className="flex-1 overflow-y-auto space-y-2 pr-1 select-none">
      {filteredList.length === 0 ? (
        <div className="text-center text-xs text-slate-400 py-8">
          No conversations found.
        </div>
      ) : (
        <ul className="space-y-[3px]">
          {filteredList.map((c) => {
            const isActive = activeId === c.id;
            const currentUserMembership = c.members?.find((m) => m.userId === currentUser?.id) || {};
            const isMuted = currentUserMembership.isMuted;
            const isPinned = currentUserMembership.isPinned;
            const isFavorite = currentUserMembership.isFavorite;
            const unreadCount = currentUserMembership.unreadMessagesCount || 0;

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
                  className={`w-full flex items-center h-[58px] pr-3 rounded-r-lg rounded-l-none text-xs transition-all duration-100 cursor-pointer text-slate-700
                    ${isActive
                      ? "bg-slate-100/90 border-l-[3.5px] border-blue-600 pl-[8.5px] font-semibold shadow-xs"
                      : "border-l-[3.5px] border-transparent pl-[8.5px] hover:bg-slate-100/50 hover:text-slate-900"
                    }`}
                >
                  <div className="flex items-center gap-2.5 truncate flex-1 min-w-0 h-full">
                    {/* Avatar presence rendering */}
                    <div className="relative flex-shrink-0">
                      {c.type === "DIRECT" ? (
                        <Avatar sender={senderDetails} presence={details.presence} size="md" />
                      ) : (
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center border transition-colors ${isActive
                            ? "bg-blue-50 border-blue-200 text-blue-600"
                            : "bg-slate-200/50 border-slate-200/20 text-slate-500"
                          }`}>
                          {c.type === "CHANNEL" ? (
                            <Hash className="h-5.5 w-5.5" />
                          ) : (
                            <Users className="h-5.5 w-5.5" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Meta info columns */}
                    <div className="flex flex-col items-start truncate flex-grow text-left">
                      <div className="flex items-center justify-between w-full">
                        <span className={`truncate text-[13px] leading-tight ${isActive ? "text-slate-900 font-bold" : "text-slate-800 font-semibold"}`}>
                          {details.title}
                        </span>
                        <span className={`text-[10px] shrink-0 ml-2 ${isActive ? "text-slate-600 font-semibold" : "text-slate-400"}`}>
                          {lastMsgTime}
                        </span>
                      </div>

                      <div className="flex items-center justify-between w-full mt-0.5">
                        {details.isTyping ? (
                          <span className={`text-[10.5px] font-semibold animate-pulse ${isActive ? "text-blue-700" : "text-emerald-600"}`}>
                            typing...
                          </span>
                        ) : (
                          <span className={`text-[11.5px] truncate max-w-[160px] sm:max-w-[180px] leading-tight ${isActive ? "text-slate-700 font-medium" : "text-slate-500"}`}>
                            {lastMsgContent}
                          </span>
                        )}

                        <div className="flex items-center gap-1 shrink-0 ml-2 select-none">
                          {isPinned && <Pin className={`h-3 w-3 rotate-45 ${isActive ? "text-blue-600" : "text-blue-500"}`} />}
                          {isFavorite && <Star className={`h-3 w-3 ${isActive ? "text-amber-500 fill-amber-500" : "text-amber-500 fill-amber-500"}`} />}
                          {isMuted && <VolumeX className={`h-3 w-3 ${isActive ? "text-slate-500" : "text-slate-450 text-slate-400"}`} />}
                          {unreadCount > 0 && !isActive && (
                            <span className="px-1.5 py-0.5 bg-blue-600 text-white text-[9.5px] font-bold rounded-full leading-none min-w-[16px] text-center">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
