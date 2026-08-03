"use client";

import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Pin, 
  Star, 
  VolumeX, 
  Hash, 
  Users, 
  User 
} from "lucide-react";
import { 
  setActiveConversationId, 
  selectActiveConversationId,
  selectTypingState
} from "@/modules/chat/store/chatSlice";
import { getConversationDisplay } from "@/modules/chat/utils/getConversationDisplay";

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

  const getPresenceColor = (presence) => {
    switch (presence) {
      case "ONLINE":
        return "bg-emerald-500 border-white";
      case "AWAY":
        return "bg-amber-500 border-white";
      case "BUSY":
        return "bg-red-500 border-white";
      default:
        return "bg-slate-400 border-white";
    }
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-4">
      {filteredList.length === 0 ? (
        <div className="text-center text-xs text-slate-500 py-6">
          No conversations found.
        </div>
      ) : (
        <ul className="space-y-0.5">
          {filteredList.map((c) => {
            const isActive = activeId === c.id;
            const currentUserMembership = c.members?.find((m) => m.userId === currentUser?.id) || {};
            const isMuted = currentUserMembership.isMuted;
            const isPinned = currentUserMembership.isPinned;
            const isFavorite = currentUserMembership.isFavorite;
            const unreadCount = currentUserMembership.unreadMessagesCount || 0;

            const details = getConversationDisplay(c, currentUser, presenceMap, typingState);

            return (
              <li key={c.id}>
                <button
                  onClick={() => dispatch(setActiveConversationId(c.id))}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all ${
                    isActive 
                      ? "bg-blue-600 text-white font-medium shadow-sm animate-in fade-in-50 duration-150" 
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3 truncate flex-1 mr-2">
                    
                    {/* Avatar with Presence Indicator */}
                    <div className="relative flex-shrink-0">
                      {c.type === "DIRECT" ? (
                        <>
                          {details.avatar ? (
                            <img
                              src={details.avatar}
                              alt={details.title}
                              className="h-8 w-8 rounded-full object-cover border border-slate-200/80"
                            />
                          ) : (
                            <div className={`h-8 w-8 rounded-full border flex items-center justify-center text-[10px] font-bold ${details.avatarClass}`}>
                              {details.initials}
                            </div>
                          )}
                          {/* Real-time Presence Dot */}
                          <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 ${getPresenceColor(details.presence)}`} />
                        </>
                      ) : (
                        <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200/50">
                          {c.type === "CHANNEL" ? (
                            <Hash className={`h-4 w-4 ${isActive ? "text-blue-200" : "text-slate-400"}`} />
                          ) : (
                            <Users className={`h-4 w-4 ${isActive ? "text-blue-200" : "text-slate-400"}`} />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Metadata Content */}
                    <div className="flex flex-col items-start truncate text-left">
                      <span className={`truncate text-xs ${isActive ? "text-white font-bold" : "text-slate-900 font-semibold"}`}>
                        {details.title}
                      </span>
                      {details.isTyping ? (
                        <span className={`text-[10px] font-medium animate-pulse ${isActive ? "text-emerald-200" : "text-emerald-600"}`}>
                          typing...
                        </span>
                      ) : (
                        details.subtitle && (
                          <span className={`text-[9px] truncate max-w-[170px] ${isActive ? "text-slate-200" : "text-slate-400"}`}>
                            {details.subtitle}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* Actions & Alerts */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {isPinned && <Pin className="h-3 w-3 text-blue-400 rotate-45" />}
                    {isFavorite && <Star className="h-3 w-3 text-amber-400 fill-amber-400" />}
                    {isMuted && <VolumeX className="h-3 w-3 text-slate-400" />}
                    {unreadCount > 0 && !isActive && (
                      <span className="px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full">
                        {unreadCount}
                      </span>
                    )}
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
