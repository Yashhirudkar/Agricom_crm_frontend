"use client";

import React, { useRef, useEffect, useLayoutEffect, useState, useMemo, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

// Import decoupled timeline subcomponents
import DateDivider from "./DateDivider";
import UnreadDivider from "./UnreadDivider";
import SystemMessage from "./SystemMessage";
import TypingIndicator from "./TypingIndicator";
import MessageBubble from "./MessageBubble";

function formatDateLabel(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const msgDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  if (msgDay.getTime() === today.getTime()) return "Today";
  if (msgDay.getTime() === yesterday.getTime()) return "Yesterday";

  const diffDays = Math.floor((today - msgDay) / 86400000);
  if (diffDays < 7) return d.toLocaleDateString([], { weekday: "long" });
  return d.toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" });
}

function isSameDay(a, b) {
  if (!a || !b) return false;
  const da = new Date(a), db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

function generateUUID() {
  return "uuid-xxxx-xxxx-4xxx-yxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ─── Empty State Component ────────────────────────────────────────────────────

const EmptyState = React.memo(({ conversation }) => {
  const otherName = conversation?.name || "Teammate";
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none max-w-sm mx-auto h-full">
      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center mb-4 border border-blue-100/60 shadow-sm animate-in zoom-in-75 duration-200">
        <span className="text-3xl">💬</span>
      </div>
      <h3 className="font-extrabold text-slate-800 text-sm mb-1">
        {conversation?.type === "DIRECT" ? `Direct Message with ${otherName}` : `Welcome to ${otherName}`}
      </h3>
      <p className="text-[11px] text-slate-400 font-medium max-w-[280px] leading-relaxed">
        Start sending secure messages. All conversations are private, synchronized, and encrypted in transit.
      </p>

      {/* Visual Tip Box */}
      <div className="mt-5 p-3 bg-white border border-slate-200/70 rounded-xl w-full text-left space-y-2 shadow-sm">
        <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-widest block">Quick Tips</span>
        <div className="text-[11px] text-slate-500 space-y-1.5">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
            <span>Toggle formatting toolbar using the <strong className="text-slate-700">Aa</strong> button.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
            <span>Press <kbd className="px-1 bg-slate-50 border rounded text-[9px] font-mono">ESC</kbd> to exit edit/reply modes or panels.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
            <span>Drag & drop files directly onto chat to upload.</span>
          </div>
        </div>
      </div>
    </div>
  );
});
EmptyState.displayName = "EmptyState";

// ─── Bounded Scroll Cache ──────────────────────────────────────────────────────

class BoundedScrollCache {
  constructor(maxSize = 50) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }
  get(key) {
    if (!this.cache.has(key)) return undefined;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val); // Move to end (recently used)
    return val;
  }
  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
  has(key) {
    return this.cache.has(key);
  }
}

const globalScrollCache = new BoundedScrollCache(50);

// Helper to clear the entire scroll cache (e.g., on logout or workspace switch)
export const clearChatScrollCache = () => {
  globalScrollCache.cache.clear();
};

// Helper to remove a single conversation's cache (e.g., on conversation delete)
export const removeChatScrollCacheEntry = (conversationId) => {
  globalScrollCache.cache.delete(conversationId);
};

// ─── Main Component ────────────────────────────────────────────────────────────

export default function MessageTimeline({
  messages = [],
  currentUser,
  activeConversationId,
  onReact,
  onPin,
  onUnpin,
  onStar,
  onBookmark,
  onDownload,
  onShareLink,
  onViewReadReceipts,
  onViewEditHistory,
  onReport,
  onEdit,
  onDelete,
  onReply,
  conversation,
  typingUsers = [],
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  presenceMap = {}
}) {
  const scrollRef = useRef(null);
  const topSentinelRef = useRef(null);

  const cached = globalScrollCache.get(activeConversationId);

  // Dynamic bubble heights caching map to eliminate pixel jumps
  const elementHeightsMap = useRef(cached ? cached.elementHeights : new Map());

  // Local count for incoming unreads when scrolled up
  const [unreadIncomingCount, setUnreadIncomingCount] = useState(0);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  // Unified Rendering Pipeline
  const pipelineItems = useMemo(() => {
    const items = [];
    let unreadDividerInserted = false;

    const myMembership = conversation?.members?.find(m => {
      const mId = m.userId || m.user?.id;
      return Number(mId) === Number(currentUser?.id || currentUser?.userId);
    });
    const lastReadMessageId = myMembership?.lastReadMessageId;

    messages.forEach((msg, idx) => {
      const prev = messages[idx - 1];
      const next = messages[idx + 1];

      // 1. Date Divider
      if (!prev || !isSameDay(prev.createdAt, msg.createdAt)) {
        items.push({
          type: "DATE",
          label: formatDateLabel(msg.createdAt),
          key: `date-${msg.createdAt}-${idx}`,
        });
      }

      // 2. Unread Divider
      if (
        lastReadMessageId &&
        !unreadDividerInserted &&
        Number(msg.id) > Number(lastReadMessageId) &&
        msg.senderId !== currentUser?.id &&
        msg.senderId !== currentUser?.userId
      ) {
        items.push({
          type: "UNREAD",
          key: `unread-divider-${msg.id}`,
        });
        unreadDividerInserted = true;
      }

      // 3. Spacing and consecutive speaker check (consecutive threshold: 5 mins)
      const isSameSenderAsPrev =
        prev &&
        prev.type !== "SYSTEM" &&
        prev.senderId === msg.senderId &&
        isSameDay(prev.createdAt, msg.createdAt) &&
        (new Date(msg.createdAt).getTime() - new Date(prev.createdAt).getTime()) < 5 * 60 * 1000;

      const isSameSenderAsNext =
        next &&
        next.type !== "SYSTEM" &&
        next.senderId === msg.senderId &&
        isSameDay(msg.createdAt, next.createdAt) &&
        (new Date(next.createdAt).getTime() - new Date(msg.createdAt).getTime()) < 5 * 60 * 1000;

      let bubblePosition = "single";
      if (isSameSenderAsPrev && isSameSenderAsNext) bubblePosition = "middle";
      else if (isSameSenderAsPrev && !isSameSenderAsNext) bubblePosition = "end";
      else if (!isSameSenderAsPrev && isSameSenderAsNext) bubblePosition = "start";

      const showAvatar = !isSameSenderAsPrev;
      const showSenderName = !isSameSenderAsPrev;

      const isOutgoing =
        currentUser &&
        (msg.senderId === currentUser.id ||
          msg.senderId === currentUser.userId ||
          msg.sender?.id === currentUser.id);

      items.push({
        type: "MSG",
        msg,
        isOutgoing,
        showAvatar,
        showSenderName,
        bubblePosition,
        key: msg.id || msg.clientMessageId || `msg-fallback-${generateUUID()}`,
        extraGap: !isSameSenderAsPrev,
      });
    });

    // 4. Typing Indicator
    if (typingUsers.length > 0) {
      items.push({
        type: "TYPING",
        key: `typing-indicator-${typingUsers.map(u => u.userId).join("-")}`,
        users: typingUsers,
      });
    }

    return items;
  }, [messages, currentUser, conversation, typingUsers]);

  // ─── Virtualization setup ──────────────────────────────────────────────────

  const rowVirtualizer = useVirtualizer({
    count: pipelineItems.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: useCallback((index) => {
      const item = pipelineItems[index];
      if (!item) return 70;
      
      const cachedData = globalScrollCache.get(activeConversationId);
      const heights = cachedData ? cachedData.elementHeights : elementHeightsMap.current;

      if (heights.has(item.key)) {
        return heights.get(item.key);
      }
      if (item.type === "DATE") return 36;
      if (item.type === "UNREAD") return 28;
      if (item.type === "TYPING") return 50;
      return 70;
    }, [pipelineItems, activeConversationId]),
    overscan: 15,
    getItemKey: useCallback((index) => {
      const item = pipelineItems[index];
      return item ? item.key : index;
    }, [pipelineItems]),
    initialOffset: cached?.scrollTop ?? 0,
  });

  const totalSize = rowVirtualizer.getTotalSize();
  const prevTotalSize = useRef(0);
  const prevScrollTop = useRef(0);
  const isFetchingNextPageRef = useRef(isFetchingNextPage);

  // Throttled measure callback to optimize ResizeObserver and load triggers
  const measurePending = useRef(false);
  const throttledMeasure = useCallback(() => {
    if (!measurePending.current) {
      measurePending.current = true;
      requestAnimationFrame(() => {
        measurePending.current = false;
        rowVirtualizer.measure();
      });
    }
  }, [rowVirtualizer]);

  // Custom measuring handler syncing values with elementHeightsMap cache
  const measureElement = useCallback((el) => {
    if (!el) return;
    rowVirtualizer.measureElement(el);
    const index = Number(el.getAttribute("data-index"));
    const item = pipelineItems[index];
    if (item && item.key) {
      const height = el.getBoundingClientRect().height;
      elementHeightsMap.current.set(item.key, height);
      if (activeConversationId) {
        const cachedData = globalScrollCache.get(activeConversationId) || { scrollTop: 0 };
        globalScrollCache.set(activeConversationId, {
          scrollTop: cachedData.scrollTop,
          elementHeights: elementHeightsMap.current
        });
      }
      throttledMeasure();
    }
  }, [rowVirtualizer, pipelineItems, activeConversationId, throttledMeasure]);

  // Determine active visible date for floating sticky header
  const visibleItems = rowVirtualizer.getVirtualItems();
  const activeDateLabel = useMemo(() => {
    if (visibleItems.length === 0) return "";
    const firstItem = visibleItems[0];
    const item = pipelineItems[firstItem.index];
    if (!item) return "";
    if (item.type === "DATE") return item.label;
    if (item.type === "MSG" && item.msg?.createdAt) {
      return formatDateLabel(item.msg.createdAt);
    }
    // Search forward if the first visible item isn't direct text
    for (let i = firstItem.index; i < pipelineItems.length; i++) {
      const current = pipelineItems[i];
      if (current.type === "DATE") return current.label;
      if (current.type === "MSG" && current.msg?.createdAt) {
        return formatDateLabel(current.msg.createdAt);
      }
    }
    return "";
  }, [visibleItems, pipelineItems]);

  // ─── Manual Scroll Restoration, Anchoring, and Pinning ──────────────────────

  useLayoutEffect(() => {
    prevTotalSize.current = 0;
    prevScrollTop.current = 0;

    const container = scrollRef.current;
    if (container) {
      const currentCached = globalScrollCache.get(activeConversationId);
      elementHeightsMap.current = currentCached ? currentCached.elementHeights : new Map();

      if (currentCached !== undefined) {
        container.scrollTop = currentCached.scrollTop;
        rowVirtualizer.scrollToOffset(currentCached.scrollTop);
      } else {
        container.scrollTop = container.scrollHeight;
        rowVirtualizer.scrollToOffset(container.scrollHeight);
        requestAnimationFrame(() => {
          if (scrollRef.current) {
            rowVirtualizer.scrollToIndex(pipelineItems.length - 1, { align: "end" });
          }
        });
      }
      requestAnimationFrame(() => {
        rowVirtualizer.measure();
      });
    }
  }, [activeConversationId]);

  useLayoutEffect(() => {
    const container = scrollRef.current;
    if (!container || !activeConversationId) return;

    const sizeDiff = totalSize - prevTotalSize.current;

    // Initial sync of refs after switch/mount
    if (prevTotalSize.current === 0) {
      prevTotalSize.current = totalSize;
      prevScrollTop.current = container.scrollTop;
      isFetchingNextPageRef.current = isFetchingNextPage;
      return;
    }

    const prevDistanceFromBottom = prevTotalSize.current - prevScrollTop.current - container.clientHeight;
    const bottomThreshold = Math.max(container.clientHeight * 0.15, 120);

    // 1. Reverse Pagination Anchoring
    if (isFetchingNextPageRef.current && !isFetchingNextPage) {
      if (sizeDiff > 0) {
        container.scrollTop += sizeDiff;
      }
    }
    isFetchingNextPageRef.current = isFetchingNextPage;

    // 2. Bottom Pinning for new messages & dynamic measures
    const lastMsg = messages[messages.length - 1];
    const isOutgoing = lastMsg && currentUser && (
      lastMsg.senderId === currentUser.id ||
      lastMsg.senderId === currentUser.userId ||
      lastMsg.sender?.id === currentUser.id
    );

    const isAppend = sizeDiff > 0 && !isFetchingNextPage;
    const hasCache = globalScrollCache.has(activeConversationId);

    if (isAppend) {
      if (prevDistanceFromBottom <= bottomThreshold || isOutgoing) {
        container.scrollTop = container.scrollHeight;
      }
    } else if (!hasCache && prevDistanceFromBottom <= bottomThreshold) {
      container.scrollTop = container.scrollHeight;
    }

    prevTotalSize.current = totalSize;
    prevScrollTop.current = container.scrollTop;
  }, [totalSize, isFetchingNextPage, messages, currentUser, activeConversationId, pipelineItems.length]);

  // ─── Infinite Scroll sentinel IntersectionObserver ──────────────────────────

  useEffect(() => {
    const sentinel = topSentinelRef.current;
    const scrollContainer = scrollRef.current;
    if (!sentinel || !scrollContainer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: scrollContainer,
        rootMargin: "150px",
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ─── Auto Scroll Bounds & Incoming message alert checks ────────────────────

  const prevMsgLength = useRef(messages.length);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || messages.length === 0) return;

    const currentLen = messages.length;
    const isNewMessage = currentLen > prevMsgLength.current;
    prevMsgLength.current = currentLen;

    if (!isNewMessage) return;

    const lastMsg = messages[messages.length - 1];
    const isOutgoing =
      currentUser &&
      (lastMsg.senderId === currentUser.id ||
        lastMsg.senderId === currentUser.userId ||
        lastMsg.sender?.id === currentUser.id);

    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    const bottomThreshold = Math.max(container.clientHeight * 0.15, 120);

    if (isOutgoing || distanceFromBottom <= bottomThreshold) {
      setUnreadIncomingCount(0);
    } else {
      setUnreadIncomingCount(prev => prev + 1);
    }
  }, [messages, currentUser]);

  const scrollSavePending = useRef(false);

  // Handle scrolling actions
  const handleScroll = useCallback((e) => {
    const container = e.currentTarget;
    const scrollTop = container.scrollTop;
    prevScrollTop.current = scrollTop;

    if (activeConversationId) {
      if (!scrollSavePending.current) {
        scrollSavePending.current = true;
        requestAnimationFrame(() => {
          scrollSavePending.current = false;
          const cachedData = globalScrollCache.get(activeConversationId);
          globalScrollCache.set(activeConversationId, {
            scrollTop: scrollRef.current ? scrollRef.current.scrollTop : scrollTop,
            elementHeights: cachedData ? cachedData.elementHeights : new Map()
          });
        });
      }
    }

    const distanceFromBottom = container.scrollHeight - scrollTop - container.clientHeight;
    const bottomThreshold = Math.max(container.clientHeight * 0.15, 120);

    if (distanceFromBottom <= bottomThreshold) {
      setUnreadIncomingCount(0);
    }
    setShowScrollBottom(distanceFromBottom > 300);
  }, [activeConversationId]);

  const handleScrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
    setUnreadIncomingCount(0);
    setShowScrollBottom(false);
  }, []);

  // ─── Renderer Router mapping ────────────────────────────────────────────────

  const renderItem = useCallback((item) => {
    if (item.type === "DATE") {
      return <DateDivider label={item.label} />;
    }

    if (item.type === "UNREAD") {
      return <UnreadDivider />;
    }

    if (item.type === "TYPING") {
      return <TypingIndicator names={item.users.map(u => u.name)} />;
    }

    const { msg, isOutgoing, showAvatar, showSenderName, bubblePosition, extraGap } = item;

    if (msg.type === "SYSTEM") {
      return <SystemMessage content={msg.content} />;
    }

    const senderId = msg.senderId || msg.sender?.id;
    const senderPresence = presenceMap[senderId]?.status;

    return (
      <div className={`msg-animate ${extraGap ? "mt-2.5" : "mt-[3px]"}`}>
        <MessageBubble
          msg={msg}
          isOutgoing={isOutgoing}
          showAvatar={showAvatar}
          showSenderName={showSenderName}
          bubblePosition={bubblePosition}
          onReact={onReact}
          onPin={onPin}
          onUnpin={onUnpin}
          onStar={onStar}
          onBookmark={onBookmark}
          onDownload={onDownload}
          onShareLink={onShareLink}
          onViewReadReceipts={onViewReadReceipts}
          onViewEditHistory={onViewEditHistory}
          onReport={onReport}
          onEdit={onEdit}
          onDelete={onDelete}
          onReply={onReply}
          conversation={conversation}
          currentUser={currentUser}
          presence={senderPresence}
        />
      </div>
    );
  }, [onReact, onPin, onUnpin, onStar, onBookmark, onDownload, onShareLink, onViewReadReceipts, onViewEditHistory, onReport, onEdit, onDelete, onReply, conversation, currentUser, presenceMap]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background: "linear-gradient(180deg, #FAFBFD 0%, #F3F5F9 100%)" }}>
        <EmptyState conversation={conversation} />
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes typing-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes msg-in {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .msg-animate {
          animation: msg-in 150ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        /* Subtle dot-grid texture on the timeline background,
           purely decorative and GPU-cheap (single repeating radial-gradient). */
        .chat-bg-texture {
          background-color: #F4F6FA;
          background-image:
            radial-gradient(circle at 1px 1px, rgba(100, 116, 139, 0.07) 1px, transparent 0);
          background-size: 22px 22px;
        }

        /* Thin custom scrollbar so it doesn't fight the polished look */
        .chat-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .chat-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(100, 116, 139, 0.25);
          border-radius: 999px;
        }
        .chat-scroll::-webkit-scrollbar-thumb:hover {
          background-color: rgba(100, 116, 139, 0.4);
        }

        /* Bubble tail shapes — only shown on the terminal bubble of a group
           (bubblePosition "single" or "end") via data attribute on wrapper. */
        .bubble-tail-out[data-tail="1"]::after {
          content: "";
          position: absolute;
          bottom: 0;
          right: -6px;
          width: 12px;
          height: 14px;
          background: inherit;
          clip-path: polygon(0 0, 0% 100%, 100% 100%);
          border-bottom-left-radius: 2px;
        }
        .bubble-tail-in[data-tail="1"]::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: -6px;
          width: 12px;
          height: 14px;
          background: inherit;
          clip-path: polygon(100% 0, 0% 100%, 100% 100%);
          border-bottom-right-radius: 2px;
        }
      `}</style>

      <div className="flex-1 relative flex flex-col overflow-hidden">
        {/* Floating sticky Date Header overlay */}
        {activeDateLabel && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none select-none animate-in fade-in duration-200">
            <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-slate-600 font-bold text-[9px] rounded-full border border-slate-200/60 shadow-md tracking-wide">
              {activeDateLabel}
            </span>
          </div>
        )}

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto chat-bg-texture chat-scroll pb-6"
          style={{
            position: "relative",
            scrollBehavior: "auto"
          }}
        >
          <div
            ref={topSentinelRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "1px",
              pointerEvents: "none",
            }}
          />

          <div
            className="w-full relative px-4 py-3"
            style={{ height: `${totalSize}px` }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const item = pipelineItems[virtualRow.index];
              if (!item) return null;

              return (
                <div
                  key={virtualRow.key}
                  ref={measureElement}
                  data-index={virtualRow.index}
                  className="absolute left-0 w-full px-3"
                  style={{
                    top: 0,
                    transform: `translateY(${virtualRow.start}px)`,
                    contain: "layout"
                  }}
                >
                  {renderItem(item)}
                </div>
              );
            })}
          </div>
        </div>

        {showScrollBottom && (
          <button
            onClick={handleScrollToBottom}
            className="absolute bottom-5 right-5 h-10 w-10 text-white rounded-full shadow-xl flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-90 shrink-0 animate-in fade-in zoom-in-75 duration-150 hover:brightness-110"
            style={{ background: "linear-gradient(135deg, #4F92F6 0%, #3B6FE0 100%)" }}
            title="Scroll to bottom"
          >
            <div className="relative">
              <span className="text-sm font-bold">↓</span>
              {unreadIncomingCount > 0 && (
                <span className="absolute -top-3.5 -right-3.5 min-w-[16px] px-1 py-0.5 bg-red-500 text-white text-[8px] font-bold rounded-full border-2 border-white leading-none flex items-center justify-center">
                  {unreadIncomingCount}
                </span>
              )}
            </div>
          </button>
        )}
      </div>
    </>
  );
}