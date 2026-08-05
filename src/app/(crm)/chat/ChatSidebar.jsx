"use client";

import React from "react";
import { Search, Plus } from "lucide-react";
import ConversationList from "@/modules/chat/components/Sidebar/ConversationList";
import ErrorBoundary from "@/modules/chat/components/Common/ErrorBoundary";
import { SidebarSkeleton } from "@/modules/chat/components/Common/SkeletonLoading";

export default function ChatSidebar({
  showSidebarMobile,
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  onCreateClick,
  conversations,
  isLoadingConversations,
  user,
  presenceMap,
}) {
  return (
    <aside
      className={`w-[280px] flex-shrink-0 flex flex-col bg-[#F7F8FA] text-slate-700 border-r border-slate-200/60 h-full overflow-hidden transition-all duration-200
        ${showSidebarMobile ? "flex w-full md:w-[295px]" : "hidden md:flex"}`}
    >
      {/* Workspace Brand */}
      <div className="h-[56px] px-3.5 border-b border-slate-200/70 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[#3B82F6] flex items-center justify-center text-white text-xs font-extrabold tracking-tight shadow-sm">
            AG
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-[13.5px] leading-none">Agricom CRM</h2>
            <span className="text-[9.5px] text-slate-400 font-semibold uppercase tracking-wider">Enterprise Hub</span>
          </div>
        </div>
        <button
          onClick={onCreateClick}
          className="p-1.5 hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
          title="Create Channel or Group"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Global Search Bar */}
      <div className="px-3 py-2 border-b border-slate-200/60">
        <div className="relative">
          <Search className="absolute left-2.5 top-[7px] h-3 w-3 text-slate-400" />
          <input
            id="sidebar-search"
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-7 pr-3 py-1.5 bg-white border border-slate-200/80 text-[12px] text-slate-800 placeholder-slate-400 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10 transition-all"
          />
        </div>
      </div>

      {/* Dynamic Category filter toggles */}
      <div className="px-1.5 pt-2 pb-1 flex gap-0.3 text-[10px] font-bold border-r border-slate-200/60 border-l border-slate-200 border-b border-slate-200 text-slate-500 select-none overflow-x-auto">
        <button onClick={() => setFilterType("ALL")} className={`px-2.5 py-1 rounded-full cursor-pointer transition-colors shrink-0 ${filterType === "ALL" ? "bg-blue-50 text-blue-700" : "hover:bg-slate-200/60"}`}>All</button>
        <button onClick={() => setFilterType("GROUPS")} className={`px-2.5 py-1 rounded-full cursor-pointer transition-colors shrink-0 ${filterType === "GROUPS" ? "bg-blue-50 text-blue-700" : "hover:bg-slate-200/60"}`}>Groups</button>
        <button onClick={() => setFilterType("CHANNELS")} className={`px-2.5 py-1 rounded-full cursor-pointer transition-colors shrink-0 ${filterType === "CHANNELS" ? "bg-blue-50 text-blue-700" : "hover:bg-slate-200/60"}`}>Channels</button>
        <button onClick={() => setFilterType("DMS")} className={`px-2.5 py-1 rounded-full cursor-pointer transition-colors shrink-0 ${filterType === "DMS" ? "bg-blue-50 text-blue-700" : "hover:bg-slate-200/60"}`}>DMs</button>
        <button onClick={() => setFilterType("ARCHIVED")} className={`px-2.5 py-1 rounded-full cursor-pointer transition-colors shrink-0 ${filterType === "ARCHIVED" ? "bg-blue-50 text-blue-700" : "hover:bg-slate-200/60"}`}>Archived</button>
      </div>

      {/* Scroll list */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoadingConversations ? (
          <SidebarSkeleton />
        ) : (
          <ErrorBoundary title="Sidebar List Error">
            <ConversationList
              conversations={conversations}
              filterType={filterType}
              searchQuery={searchQuery}
              currentUser={user}
              presenceMap={presenceMap}
            />
          </ErrorBoundary>
        )}
      </div>

      <div className="px-3.5 py-2.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400 select-none">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          <span className="font-medium">Connected</span>
        </div>
        <span>v1.2.0</span>
      </div>
    </aside>
  );
}
