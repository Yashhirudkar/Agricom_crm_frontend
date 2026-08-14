"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Search,
  Settings,
  MoreVertical,
  X,
  FileText,
  Link as LinkIcon,
  Lock,
  Pin,
  Star,
} from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { getAvatarUrl } from "@/lib/axios";
import MessageTimeline from "@/modules/chat/components/Timeline/MessageTimeline";
import RichComposer from "@/modules/chat/components/Composer/RichComposer";
import ErrorBoundary from "@/modules/chat/components/Common/ErrorBoundary";
import { HeaderSkeleton, MessagesSkeleton } from "@/modules/chat/components/Common/SkeletonLoading";
import UserProfileModal from "@/modules/chat/components/Common/UserProfileModal";

export default function ChatMainPanel({
  showSidebarMobile,
  activeConversationId,
  activeConversation,
  activeDetails,
  headerSubtitle,
  rightPanelTab,
  isLoadingMessages,
  mergedMessagesList,
  user,
  typingUsersMap,
  uploadQueue,
  composerInput,
  setComposerInput,
  employeeLookup,
  editingMessage,
  setEditingMessage,
  replyingToMessage,
  setReplyingToMessage,
  canPost,
  presenceMap,
  onSetShowSidebarMobile,
  onTogglePanel,
  onSend,
  onFileUpload,
  onSendVoice,
  onComposerChange,
  onComposerSubmit,
  onReact,
  onPin,
  onUnpin,
  onStar,
  onDelete,
  onReply,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  // Pinned banner
  activePinnedMessage,
  onBannerUnpin,
  onOpenPinnedPanel,
}) {
  const [headerProfileModalOpen, setHeaderProfileModalOpen] = useState(false);

  return (
    <main
      className={`flex-1 min-w-0 flex flex-col h-full bg-white overflow-hidden transition-all duration-200
        ${showSidebarMobile ? "hidden md:flex" : "flex w-full"}`}
    >
      {!activeConversationId ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 bg-white">
          <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100 shadow-xs">
            <MessageSquare className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="font-bold text-slate-850 text-sm">No Chat Selected</h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1">
            Select a public channel, private group, or direct message from the sidebar to begin.
          </p>
        </div>
      ) : isLoadingMessages ? (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <HeaderSkeleton />
          <MessagesSkeleton />
        </div>
      ) : (
        <>
          {/* Top Header */}
          <header className="h-[60px] px-4 border-b border-slate-200/60 bg-white flex items-center justify-between flex-shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.01)] select-none">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* Mobile Back button */}
              <button
                onClick={() => onSetShowSidebarMobile(true)}
                className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg md:hidden transition-colors cursor-pointer mr-0.5"
                title="Back to list"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>

              <div
                onClick={() => setHeaderProfileModalOpen(true)}
                className="relative flex-shrink-0 cursor-pointer group"
                title="View Image"
              >
                {activeDetails?.avatar ? (
                  <img
                    src={getAvatarUrl(activeDetails.avatar)}
                    alt={activeDetails.title}
                    className="h-10 w-10 rounded-full object-cover border border-slate-200 group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className={`h-10 w-10 rounded-full border flex items-center justify-center text-sm font-bold group-hover:scale-105 transition-transform ${
                    activeConversation?.type === "CHANNEL"
                      ? "bg-blue-50 text-blue-600 border border-blue-100"
                      : activeConversation?.type === "GROUP"
                      ? "bg-slate-100 text-slate-700 border border-slate-250"
                      : activeDetails?.avatarClass || "bg-slate-100 text-slate-700"
                  }`}>
                    {activeConversation?.type === "CHANNEL" ? "#" : activeDetails?.initials || "G"}
                  </div>
                )}
                {activeConversation?.type === "DIRECT" && (
                  <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${
                    activeDetails?.presence === "ONLINE" ? "bg-emerald-500" :
                    activeDetails?.presence === "AWAY" ? "bg-amber-500" :
                    activeDetails?.presence === "BUSY" ? "bg-red-500" :
                    "bg-slate-400"
                  }`} />
                )}
              </div>

              <div
                className="min-w-0 cursor-pointer"
                onClick={() => setHeaderProfileModalOpen(true)}
              >
                <div className="flex items-center gap-1.5">
                  <h1 className="font-bold text-slate-900 text-sm md:text-[14.5px] truncate leading-none hover:text-blue-600 transition-colors">{activeDetails?.title}</h1>
                  {activeConversation?.isLocked && <Lock className="h-3 w-3 text-amber-500" />}
                </div>
                {activeDetails?.isTyping ? (
                  <p className="text-[10px] text-emerald-600 font-semibold animate-pulse mt-1">{activeDetails.typingText}</p>
                ) : (
                  <p className="text-[10.5px] text-slate-400 font-medium truncate max-w-[280px] md:max-w-[450px] mt-1 select-text">
                    {headerSubtitle}
                  </p>
                )}
              </div>
            </div>

            {headerProfileModalOpen && (
              <UserProfileModal
                user={{
                  name: activeDetails?.title,
                  avatarUrl: activeDetails?.avatar,
                  presence: activeDetails?.presence,
                  role: activeConversation?.type === "CHANNEL" ? "Channel" : activeConversation?.type === "GROUP" ? "Group Chat" : "Team Member"
                }}
                isOpen={headerProfileModalOpen}
                onClose={() => setHeaderProfileModalOpen(false)}
              />
            )}

            <div className="flex items-center gap-1.5 flex-shrink-0 select-none">
              <button
                onClick={() => onTogglePanel("PINNED_MESSAGES")}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${rightPanelTab === "PINNED_MESSAGES" ? "bg-slate-100 text-slate-900 font-bold" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"}`}
                title="Pinned messages"
              >
                <Pin className="h-4 w-4 rotate-45" />
              </button>

              <button
                onClick={() => onTogglePanel("STARRED_MESSAGES")}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${rightPanelTab === "STARRED_MESSAGES" ? "bg-slate-100 text-slate-900 font-bold" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"}`}
                title="Starred messages"
              >
                <Star className="h-4 w-4" />
              </button>

              <button
                onClick={() => onTogglePanel("INFO")}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${rightPanelTab === "INFO" ? "bg-slate-100 text-slate-800" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"}`}
                title="ERP Context Info"
              >
                <LinkIcon className="h-4 w-4" />
              </button>

              {activeConversation?.type !== "DIRECT" ? (
                <button
                  onClick={() => onTogglePanel("GROUP_SETTINGS")}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${rightPanelTab === "GROUP_SETTINGS" ? "bg-slate-100 text-slate-800 animate-in duration-100" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"}`}
                  title="Group Settings"
                >
                  <Settings className="h-4 w-4 hover:rotate-45 transition-transform duration-200" />
                </button>
              ) : (
                <button
                  onClick={() => onTogglePanel("SETTINGS")}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${rightPanelTab === "SETTINGS" ? "bg-slate-100 text-slate-800" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"}`}
                  title="Governance Policies"
                >
                  <Settings className="h-4 w-4" />
                </button>
              )}
            </div>
          </header>

          {/* ── PINNED MESSAGE BANNER (Telegram-style) ── */}
          {activePinnedMessage?.message && (
            <div
              onClick={onOpenPinnedPanel}
              className="flex items-center gap-2.5 px-4 py-2 bg-blue-50/70 border-b border-blue-100 cursor-pointer hover:bg-blue-50 transition-colors select-none group flex-shrink-0"
              title="Click to see all pinned messages"
            >
              <div className="flex-shrink-0 text-blue-500">
                <Pin className="h-3.5 w-3.5 rotate-45" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9.5px] font-bold text-blue-600 uppercase tracking-wider leading-none mb-0.5">
                  Pinned — {activePinnedMessage.message.sender?.name || "Unknown"}
                </p>
                <p className="text-[11px] text-slate-600 truncate leading-tight">
                  {activePinnedMessage.message.content}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBannerUnpin(activePinnedMessage.message.id);
                }}
                className="flex-shrink-0 p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                title="Unpin message"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* Message timeline list */}
          <ErrorBoundary title="Message Timeline Error">
            <MessageTimeline
              messages={mergedMessagesList}
              currentUser={user}
              conversation={activeConversation}
              typingUsers={typingUsersMap[activeConversationId] || []}
              activeConversationId={activeConversationId}
              onReact={onReact}
              onPin={onPin}
              onUnpin={onUnpin}
              onStar={onStar}
              onEdit={(msg) => {
                setEditingMessage(msg);
                setComposerInput(msg.content);
                setReplyingToMessage(null);
              }}
              onDelete={onDelete}
              onReply={(msg) => {
                setReplyingToMessage(msg);
                setEditingMessage(null);
              }}
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              presenceMap={presenceMap}
            />
          </ErrorBoundary>

          {/* Active upload progress overlays */}
          {Object.entries(uploadQueue).map(([id, item]) => (
            <div key={id} className="mx-6 my-2 p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3 max-w-sm shadow-md animate-in slide-in-from-bottom-2">
              <FileText className="h-7 w-7 text-blue-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-slate-800 truncate">{item.fileName}</p>
                <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden mt-1.5">
                  <div className="bg-blue-600 h-full" style={{ width: `${item.progress}%` }}></div>
                </div>
              </div>
            </div>
          ))}

          {/* Tiptap-based Rich Text Composer Footer */}
          <footer className="px-3 py-2 bg-white border-t border-slate-200/60 flex flex-col gap-1 flex-shrink-0">
            {/* ── CHANNEL READ-ONLY NOTICE ── */}
            {!canPost ? (
              <p className="text-center text-[11px] text-slate-400 py-2 select-none">
                Only admin can send messages.
              </p>
            ) : (
              // ── NORMAL COMPOSER ──
              <>
                {editingMessage && (
                  <div className="bg-blue-50/80 border-l-[3px] border-blue-500 rounded-md px-2.5 py-1.5 flex items-center justify-between text-[11px] animate-in slide-in-from-bottom-1 duration-100 mb-0.5 select-none">
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="font-bold text-blue-700 text-[10px] leading-none mb-0.5">Editing message</div>
                      <div className="text-slate-500 truncate text-[11px]">
                        {editingMessage.content}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setEditingMessage(null);
                        setComposerInput("");
                      }}
                      className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer shrink-0"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {replyingToMessage && (
                  <div className="bg-slate-50 border-l-[3px] border-blue-500 rounded-md px-2.5 py-1.5 flex items-center justify-between text-[11px] animate-in slide-in-from-bottom-1 duration-100 mb-0.5 select-none">
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="font-bold text-blue-600 text-[10px] leading-none mb-0.5">
                        Replying to {replyingToMessage.sender?.name || "Teammate"}
                      </div>
                      <div className="text-slate-500 truncate text-[11px]">
                        {replyingToMessage.content}
                      </div>
                    </div>
                    <button
                      onClick={() => setReplyingToMessage(null)}
                      className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer shrink-0"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                <ErrorBoundary title="Composer Input Error">
                  <RichComposer
                    value={composerInput}
                    employees={Object.entries(employeeLookup).map(([id, emp]) => ({ id, name: emp.name }))}
                    onSendVoice={onSendVoice}
                    onSendFile={onFileUpload}
                    onChange={onComposerChange}
                    placeholder="Type a message..."
                    onSubmit={(text) => {
                      onSend(text);
                      onComposerSubmit();
                    }}
                  />
                </ErrorBoundary>
              </>
            )}
          </footer>
        </>
      )}
    </main>
  );
}
