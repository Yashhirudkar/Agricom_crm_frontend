"use client";

import React, { useState, useEffect } from "react";
import { MessageCircleMore } from "lucide-react";
import { useSelector } from "react-redux";
import { usePermissions } from "@/hooks/usePermissions";
import { selectSocketStatus } from "@/modules/chat/store/chatSlice";
import ChatWorkspaceModal from "./ChatWorkspaceModal";
import axiosClient from "@/lib/axios";

export default function FloatingChatLauncher() {
  const { hasPermission } = usePermissions();
  const socketStatus = useSelector(selectSocketStatus);
  
  // Permission checks
  const canReadChat = hasPermission("chat:read");
  
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const fetchUnread = async () => {
    try {
      const res = await axiosClient.get("/chat/unread/total");
      const data = res.data?.data || res.data || {};
      const count = data.total ?? data.totalUnreadMessages ?? (typeof data === "number" ? data : 0);
      setUnreadCount(count);
    } catch (err) {
      console.warn("Failed to fetch unread total:", err?.message || err);
    }
  };

  // Sync total unread count periodically or on real-time events
  useEffect(() => {
    if (!canReadChat) return;

    fetchUnread();

    const handleUnreadUpdate = () => {
      setHasNewMessage(true);
      fetchUnread();
    };

    window.addEventListener("chat:unread-updated", handleUnreadUpdate);
    window.addEventListener("chat-message-received", handleUnreadUpdate);
    window.addEventListener("chat:new-message", handleUnreadUpdate);
    window.addEventListener("focus", handleUnreadUpdate);

    // 3-second interval sync for fast response
    const interval = setInterval(fetchUnread, 3000);

    return () => {
      window.removeEventListener("chat:unread-updated", handleUnreadUpdate);
      window.removeEventListener("chat-message-received", handleUnreadUpdate);
      window.removeEventListener("chat:new-message", handleUnreadUpdate);
      window.removeEventListener("focus", handleUnreadUpdate);
      clearInterval(interval);
    };
  }, [canReadChat]);

  // Reset new message indicator when opening modal
  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      setHasNewMessage(false);
    } else {
      fetchUnread();
    }
  };

  // Bind Keyboard Shortcut Ctrl+Shift+C
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        handleToggle();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!canReadChat) return null;

  const showGreenDot = (unreadCount > 0 || hasNewMessage) && !isOpen;

  return (
    <>
      {/* Floating launcher trigger button */}
      <button
        onClick={handleToggle}
        className="fixed bottom-6 right-6 z-45 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-blue-500/30"
        title="Toggle Chat Workspace (Ctrl + Shift + C)"
      >
        <MessageCircleMore className="h-6 w-6 stroke-[2] group-hover:rotate-12 transition-transform duration-300" />
        
        {/* Unread message dot indicator - only shown when unread messages exist */}
        {showGreenDot && (
          <span
            className="absolute top-0.5 right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-slate-900 shadow-sm animate-pulse"
            title={`${unreadCount || 1} unread message(s)`}
          />
        )}
      </button>

      {/* Primary Workspace dialogue modal */}
      <ChatWorkspaceModal 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
