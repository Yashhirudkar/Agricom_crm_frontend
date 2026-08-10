"use client";

import React from "react";

// ChatSocketProvider is already mounted globally by AppShell for all
// authenticated pages. Do NOT wrap it here again — a second instance would
// call connectSocket() a second time, tearing down AppShell's socket and
// destroying all global notification + attendance listeners.
export default function ChatLayout({ children }) {
  return (
    <div className="w-full h-[calc(100vh-64px)] flex overflow-hidden bg-slate-50 font-sans">
      {children}
    </div>
  );
}
