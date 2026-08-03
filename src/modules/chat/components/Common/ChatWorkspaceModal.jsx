"use client";

import React, { useState } from "react";
import { Maximize2, Minimize2, X, Minus } from "lucide-react";
import ChatPage from "@/app/(crm)/chat/page";

export default function ChatWorkspaceModal({ isOpen, onClose }) {
  const [isMaximized, setIsMaximized] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className={`bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
          isMaximized 
            ? "w-screen h-screen rounded-none" 
            : "w-full h-full md:w-11/12 md:max-w-6xl md:h-[80vh] md:rounded-xl"
        }`}
      >
        {/* Top Control Bar */}
        <div className="h-10 bg-slate-50 px-4 border-b border-slate-200/80 flex items-center justify-between flex-shrink-0 text-slate-500">
          <span className="text-xs font-semibold text-slate-800">Agricom Chat Workspace</span>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose} 
              className="p-1 hover:bg-slate-200 hover:text-slate-800 rounded transition-colors"
              title="Minimize Workspace"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setIsMaximized(!isMaximized)} 
              className="p-1 hover:bg-slate-200 hover:text-slate-800 rounded transition-colors"
              title={isMaximized ? "Restore Size" : "Maximize Workspace"}
            >
              {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            <button 
              onClick={onClose} 
              className="p-1 hover:bg-red-50 hover:text-red-655 rounded transition-colors"
              title="Close Workspace"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Core Chat Page Component */}
        <div className="flex-1 overflow-hidden">
          <ChatPage />
        </div>
      </div>
    </div>
  );
}
