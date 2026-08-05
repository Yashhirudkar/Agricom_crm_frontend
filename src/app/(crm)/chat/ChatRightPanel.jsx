"use client";

import React from "react";
import { X, Link as LinkIcon, Pin, Star } from "lucide-react";
import ErrorBoundary from "@/modules/chat/components/Common/ErrorBoundary";
import AdminSettingsPanel from "@/modules/chat/components/Admin/AdminSettingsPanel";
import GroupSettingsPanel from "@/modules/chat/components/Admin/GroupSettingsPanel";

export default function ChatRightPanel({
  rightPanelTab,
  onClose,
  // INFO panel
  loadingErp,
  erpDetail,
  activeConversation,
  // PINNED panel
  loadingPinned,
  pinnedMessages,
  onUnpin,
  setPinnedMessages,
  // STARRED panel
  loadingStarred,
  starredMessages,
  onUnstar,
  setStarredMessages,
  // SETTINGS panel
  companyId,
  // GROUP_SETTINGS panel
  user,
  onUpdateConversation,
}) {
  return (
    <aside
      className={`border-l border-slate-200 flex flex-col bg-white overflow-hidden transition-all duration-300 flex-shrink-0
        ${rightPanelTab ? "w-full md:w-[360px] fixed md:relative right-0 top-0 bottom-0 h-full z-50 md:z-auto" : "w-0 border-l-0"}`}
    >
      {/* ── INFO: ERP Context ── */}
      {rightPanelTab === "INFO" && (
        <div className="w-full md:w-[360px] h-full flex flex-col text-slate-700">
          <header className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 flex-shrink-0">
            <h3 className="font-bold text-slate-900 text-xs flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-blue-500" />
              <span>ERP Context Discussions</span>
            </h3>
            <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded cursor-pointer">
              <X className="h-4 w-4 text-slate-500" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loadingErp ? (
              <div className="p-3 text-center text-xs text-slate-400 animate-pulse">
                Loading ERP context reference...
              </div>
            ) : erpDetail ? (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-2 animate-in fade-in duration-100">
                <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest block">
                  Context Reference
                </span>
                <h4 className="font-bold text-slate-800 text-xs">
                  [{activeConversation?.entityType}] {erpDetail.entityName || erpDetail.title || "Linked Discussion"}
                </h4>
                <p className="text-[10px] text-slate-500 font-medium">
                  Entity ID: #{activeConversation?.entityId}
                </p>
                <p className="text-[10px] text-slate-400 mt-1 italic leading-relaxed">
                  All messages in this channel are linked polymorphic entries associated with this active ERP document context.
                </p>
              </div>
            ) : (
              <div className="p-3 text-center text-xs text-slate-400">
                No active ERP document linked to this conversation channel.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── PINNED MESSAGES ── */}
      {rightPanelTab === "PINNED_MESSAGES" && (
        <div className="w-full md:w-[360px] h-full flex flex-col text-slate-700">
          <header className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 flex-shrink-0">
            <h3 className="font-bold text-slate-900 text-xs flex items-center gap-2">
              <Pin className="h-4 w-4 text-blue-500 rotate-45" />
              <span>Pinned Messages</span>
            </h3>
            <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded cursor-pointer">
              <X className="h-4 w-4 text-slate-500" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAFBFD]">
            {loadingPinned ? (
              <div className="p-3 text-center text-xs text-slate-400 animate-pulse">
                Loading pinned messages...
              </div>
            ) : pinnedMessages.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
                <span className="text-2xl">📌</span>
                <span>No pinned messages in this chat.</span>
              </div>
            ) : (
              pinnedMessages.map((pin) => {
                const m = pin.message;
                if (!m) return null;
                return (
                  <div key={pin.id} className="p-3 bg-white border border-slate-200/80 rounded-xl shadow-xs flex flex-col gap-1.5 hover:border-slate-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-800">
                        {m.sender?.name || "Unknown"}
                      </span>
                      <span className="text-[9px] text-slate-400">
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-[11.5px] text-slate-600 break-words leading-relaxed select-text">
                      {m.content}
                    </p>
                    <div className="flex justify-end pt-1 border-t border-slate-50">
                      <button
                        onClick={() => onUnpin(pin, m)}
                        className="text-[9.5px] font-bold text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer bg-red-50 px-2 py-1 rounded-md hover:bg-red-100 transition-colors"
                      >
                        Unpin
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ── STARRED MESSAGES ── */}
      {rightPanelTab === "STARRED_MESSAGES" && (
        <div className="w-full md:w-[360px] h-full flex flex-col text-slate-700">
          <header className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 flex-shrink-0">
            <h3 className="font-bold text-slate-900 text-xs flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span>Starred Messages</span>
            </h3>
            <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded cursor-pointer">
              <X className="h-4 w-4 text-slate-500" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAFBFD]">
            {loadingStarred ? (
              <div className="p-3 text-center text-xs text-slate-400 animate-pulse">
                Loading starred messages...
              </div>
            ) : starredMessages.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
                <span className="text-2xl">⭐</span>
                <span>No starred messages.</span>
              </div>
            ) : (
              starredMessages.map((m) => {
                if (!m) return null;
                return (
                  <div key={m.id} className="p-3 bg-white border border-slate-200/80 rounded-xl shadow-xs flex flex-col gap-1.5 hover:border-slate-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-800">
                        {m.sender?.name || "Unknown"}
                      </span>
                      <span className="text-[9px] text-slate-400">
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-[11.5px] text-slate-600 break-words leading-relaxed select-text">
                      {m.content}
                    </p>
                    <div className="flex justify-between items-center pt-1 border-t border-slate-50">
                      <span className="text-[8px] font-medium text-slate-400 uppercase tracking-wider">
                        In: {m.conversation?.name || "Chat"}
                      </span>
                      <button
                        onClick={() => onUnstar(m)}
                        className="text-[9.5px] font-bold text-slate-500 hover:text-red-650 flex items-center gap-1 cursor-pointer bg-slate-50 hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
                      >
                        Unstar
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ── ADMIN SETTINGS ── */}
      {rightPanelTab === "SETTINGS" && (
        <ErrorBoundary title="Settings Panel Error">
          <AdminSettingsPanel
            companyId={companyId}
            onClose={onClose}
          />
        </ErrorBoundary>
      )}

      {/* ── GROUP SETTINGS ── */}
      {rightPanelTab === "GROUP_SETTINGS" && (
        <ErrorBoundary title="Group Settings Panel Error">
          <GroupSettingsPanel
            conversation={activeConversation}
            currentUser={user}
            onClose={onClose}
            onUpdateConversation={onUpdateConversation}
          />
        </ErrorBoundary>
      )}
    </aside>
  );
}
