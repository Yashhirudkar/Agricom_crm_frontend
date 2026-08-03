"use client";

import React from "react";
import ChatSocketProvider from "@/modules/chat/components/ChatSocketProvider";

export default function ChatLayout({ children }) {
  return (
    <ChatSocketProvider>
      <div className="w-full h-[calc(100vh-64px)] flex overflow-hidden bg-slate-50 font-sans">
        {children}
      </div>
    </ChatSocketProvider>
  );
}
