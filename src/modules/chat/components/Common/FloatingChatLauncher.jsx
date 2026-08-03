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

  // Sync total unread count periodically or on click
  useEffect(() => {
    if (!canReadChat) return;

    const fetchUnread = async () => {
      try {
        const res = await axiosClient.get("/chat/unread/total");
        setUnreadCount(res.data?.total || 0);
      } catch (err) {
        console.error("Failed to fetch unread total:", err);
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 15000); // 15s interval sync
    return () => clearInterval(interval);
  }, [canReadChat]);

  // Bind Keyboard Shortcut Ctrl+Shift+C
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!canReadChat) return null;

  return (
    <>
      {/* Floating launcher trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-45 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-blue-500/30"
        title="Toggle Chat Workspace (Ctrl + Shift + C)"
      >
        <MessageCircleMore className="h-6 w-6 stroke-[2] group-hover:rotate-12 transition-transform duration-300" />
        
        {/* Heartbeat Network Indicator dot */}
        <span className={`absolute top-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-slate-900 ${
          socketStatus === "CONNECTED" ? "bg-emerald-500" : "bg-amber-500"
        }`} title={socketStatus === "CONNECTED" ? "Heartbeat active" : "Reconnecting..."}></span>

        {/* Unread message badge indicator */}
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -left-1.5 bg-red-655 bg-red-650 bg-red-500 border border-slate-900 text-white font-bold text-[10px] h-5 min-w-[20px] rounded-full flex items-center justify-center px-1 shadow-sm animate-bounce">
            {unreadCount}
          </span>
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
