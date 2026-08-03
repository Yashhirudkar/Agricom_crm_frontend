"use client";

import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import {
  MessageSquare, Pin, Copy, Forward, MoreHorizontal,
  Smile, CheckCheck, Check, Edit3
} from "lucide-react";
import { useDispatch } from "react-redux";
import { setActiveThreadId } from "@/modules/chat/store/chatSlice";

// ─── Helpers ────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "bg-rose-400 text-white",
  "bg-sky-500 text-white",
  "bg-emerald-500 text-white",
  "bg-amber-500 text-white",
  "bg-purple-500 text-white",
  "bg-pink-500 text-white",
  "bg-indigo-500 text-white",
  "bg-teal-500 text-white",
  "bg-orange-500 text-white",
  "bg-cyan-500 text-white",
];

function getAvatarColor(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name = "") {
  if (!name) return "?";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function formatTime(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

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

// ─── Avatar Component ────────────────────────────────────────────────────────

function Avatar({ sender, size = "md" }) {
  const sz = size === "sm" ? "h-7 w-7 text-[9px]" : "h-9 w-9 text-[10px]";
  if (sender?.avatarUrl) {
    return (
      <img
        src={sender.avatarUrl}
        alt={sender.name}
        className={`${sz} rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0`}
      />
    );
  }
  const colorClass = getAvatarColor(sender?.name || "");
  return (
    <div className={`${sz} rounded-full ${colorClass} flex items-center justify-center font-bold flex-shrink-0 shadow-sm border-2 border-white`}>
      {getInitials(sender?.name)}
    </div>
  );
}

// ─── Date Divider ────────────────────────────────────────────────────────────

function DateDivider({ label }) {
  return (
    <div className="flex items-center justify-center my-4 select-none">
      <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-semibold rounded-full border border-slate-200/80 shadow-xs tracking-wide">
        {label}
      </span>
    </div>
  );
}

// ─── Hover Toolbar ────────────────────────────────────────────────────────────

function HoverToolbar({ isOutgoing, onReact, onReply, onPin, onCopy, messageId }) {
  const EMOJIS = ["👍", "❤️", "😂", "😮", "😢"];
  const [showEmoji, setShowEmoji] = useState(false);

  return (
    <div
      className={`absolute top-0 flex items-center gap-0.5 bg-white border border-slate-200/80 rounded-xl shadow-lg p-1 z-20
        ${isOutgoing ? "right-full mr-2" : "left-full ml-2"}`}
      style={{ whiteSpace: "nowrap" }}
    >
      {/* Emoji Picker toggle */}
      <div className="relative">
        <button
          onClick={() => setShowEmoji(v => !v)}
          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-700"
          title="React"
        >
          <Smile className="h-3.5 w-3.5" />
        </button>
        {showEmoji && (
          <div className={`absolute bottom-full mb-1 flex gap-1 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5
            ${isOutgoing ? "right-0" : "left-0"}`}>
            {EMOJIS.map(e => (
              <button
                key={e}
                onClick={() => { onReact(messageId, e); setShowEmoji(false); }}
                className="text-base hover:scale-125 transition-transform p-0.5"
              >
                {e}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Reply */}
      <button
        onClick={onReply}
        className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-700"
        title="Reply"
      >
        <MessageSquare className="h-3.5 w-3.5" />
      </button>

      {/* Copy */}
      <button
        onClick={onCopy}
        className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-700"
        title="Copy"
      >
        <Copy className="h-3.5 w-3.5" />
      </button>

      {/* Pin */}
      <button
        onClick={onPin}
        className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-700"
        title="Pin"
      >
        <Pin className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ─── Reaction Badges ─────────────────────────────────────────────────────────

function ReactionBadges({ reactions, isOutgoing, onReact, messageId }) {
  if (!reactions || reactions.length === 0) return null;

  // Group by emoji
  const grouped = reactions.reduce((acc, r) => {
    acc[r.reaction] = (acc[r.reaction] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className={`flex flex-wrap gap-1 mt-1.5 ${isOutgoing ? "justify-end" : "justify-start"}`}>
      {Object.entries(grouped).map(([emoji, count]) => (
        <button
          key={emoji}
          onClick={() => onReact(messageId, emoji)}
          className="flex items-center gap-0.5 px-1.5 py-0.5 bg-white border border-slate-200 rounded-full text-[11px] shadow-xs hover:border-blue-300 hover:bg-blue-50 transition-all"
        >
          <span>{emoji}</span>
          {count > 1 && <span className="text-slate-500 text-[9px] font-bold">{count}</span>}
        </button>
      ))}
    </div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({ msg, isOutgoing, showAvatar, showSenderName, onReact, onPin, onUnpin, dispatch }) {
  const [hovered, setHovered] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard?.writeText(msg.content || "");
  }, [msg.content]);

  const handleReply = useCallback(() => {
    dispatch(setActiveThreadId(msg.id));
  }, [msg.id, dispatch]);

  const isPinned = !!msg.pinnedAt;
  const isEdited = !!msg.editedAt;

  // Determine bubble corner radius logic (WhatsApp-style)
  const bubbleRadius = isOutgoing
    ? "rounded-[18px] rounded-br-[4px]"
    : "rounded-[18px] rounded-bl-[4px]";

  return (
    <div
      className={`flex items-end gap-2 group ${isOutgoing ? "flex-row-reverse" : "flex-row"} relative`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Avatar slot — always reserve space for alignment */}
      <div className="w-9 flex-shrink-0 self-end">
        {showAvatar && !isOutgoing && <Avatar sender={msg.sender} />}
      </div>

      {/* Bubble column */}
      <div className={`flex flex-col max-w-[65%] md:max-w-[70%] ${isOutgoing ? "items-end" : "items-start"}`}>
        {/* Sender name (only for incoming, only when sender changes) */}
        {showSenderName && !isOutgoing && (
          <span className="text-[10px] font-bold text-slate-500 mb-1 pl-1 tracking-wide">
            {msg.sender?.name || "Unknown"}
          </span>
        )}

        {/* The bubble itself */}
        <div className="relative">
          {/* Hover toolbar */}
          {hovered && (
            <HoverToolbar
              isOutgoing={isOutgoing}
              messageId={msg.id}
              onReact={onReact}
              onReply={handleReply}
              onPin={() => isPinned ? onUnpin(msg.id) : onPin(msg.id)}
              onCopy={handleCopy}
            />
          )}

          <div
            className={`relative px-3.5 py-2.5 ${bubbleRadius} shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all
              ${isOutgoing
                ? "bg-[#DCF8C6] text-slate-800"
                : "bg-white text-slate-800 border border-slate-100"
              }`}
          >
            {/* Pinned indicator */}
            {isPinned && (
              <div className="flex items-center gap-1 mb-1 opacity-60">
                <Pin className="h-2.5 w-2.5 text-amber-600" />
                <span className="text-[8px] font-bold text-amber-600 uppercase tracking-wider">Pinned</span>
              </div>
            )}

            {/* Message text */}
            <p className="text-[13px] leading-[1.55] break-words whitespace-pre-wrap">
              {msg.content}
            </p>

            {/* Meta row: edited + time + ticks */}
            <div className={`flex items-center gap-1 mt-1 ${isOutgoing ? "justify-end" : "justify-end"}`}>
              {isEdited && (
                <span className="text-[9px] text-slate-400 italic flex items-center gap-0.5">
                  <Edit3 className="h-2 w-2" /> edited
                </span>
              )}
              <span className="text-[10px] text-slate-400 leading-none">
                {formatTime(msg.createdAt)}
              </span>
              {isOutgoing && (
                <CheckCheck className="h-3 w-3 text-blue-500 flex-shrink-0" />
              )}
            </div>
          </div>
        </div>

        {/* Reactions below bubble */}
        <ReactionBadges
          reactions={msg.reactions}
          isOutgoing={isOutgoing}
          onReact={onReact}
          messageId={msg.id}
        />
      </div>
    </div>
  );
}

// ─── System Message ────────────────────────────────────────────────────────────

function SystemMessage({ content }) {
  return (
    <div className="flex justify-center my-2">
      <span className="px-3 py-1 bg-slate-100/80 text-slate-500 text-[10px] font-medium rounded-full border border-slate-200/60 max-w-xs text-center">
        {content}
      </span>
    </div>
  );
}

// ─── Typing Indicator ─────────────────────────────────────────────────────────

function TypingIndicator({ names }) {
  const label = names.length === 1
    ? `${names[0]} is typing`
    : names.length === 2
    ? `${names[0]} and ${names[1]} are typing`
    : "Several people are typing";

  return (
    <div className="flex items-end gap-2 animate-in fade-in slide-in-from-bottom-1 duration-200">
      <div className="w-9 flex-shrink-0" />
      <div className="flex flex-col items-start">
        <span className="text-[10px] text-slate-400 mb-1 pl-1">{label}</span>
        <div className="px-4 py-3 bg-white border border-slate-100 rounded-[18px] rounded-bl-[4px] shadow-sm">
          <div className="flex items-center gap-1">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="h-2 w-2 rounded-full bg-slate-400"
                style={{
                  animation: `typing-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ conversation, currentUser }) {
  const otherName = conversation?.name || "this conversation";

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none">
      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-5 shadow-sm border border-blue-100">
        <span className="text-4xl">👋</span>
      </div>
      <h3 className="font-bold text-slate-800 text-base mb-1">
        Start your conversation
      </h3>
      <p className="text-sm text-blue-600 font-semibold mb-0.5">{otherName}</p>
      <p className="text-xs text-slate-400 mt-3 max-w-[220px] leading-relaxed">
        Messages are end-to-end synchronized and secure.
      </p>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function MessageTimeline({
  messages = [],
  currentUser,
  activeConversationId,
  onReact,
  onPin,
  onUnpin,
  conversation,
  typingUsers = [],
}) {
  const bottomRef = useRef(null);
  const dispatch = useDispatch();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Build enriched message list with date dividers and avatar-show logic
  const enriched = useMemo(() => {
    const items = [];

    messages.forEach((msg, idx) => {
      const prev = messages[idx - 1];

      // Date divider
      if (!prev || !isSameDay(prev.createdAt, msg.createdAt)) {
        items.push({ type: "DATE", label: formatDateLabel(msg.createdAt), key: `date-${idx}` });
      }

      const prevMsg = prev;
      const isSameSenderAsPrev =
        prevMsg && prevMsg.type !== "SYSTEM" && prevMsg.senderId === msg.senderId && isSameDay(prevMsg.createdAt, msg.createdAt);

      const showAvatar = !isSameSenderAsPrev;
      const showSenderName = !isSameSenderAsPrev;

      // Determine if outgoing (sent by current user)
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
        key: msg.id || `msg-${idx}`,
        // Slightly bigger gap when sender changes
        extraGap: !isSameSenderAsPrev,
      });
    });

    return items;
  }, [messages, currentUser]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <EmptyState conversation={conversation} currentUser={currentUser} />
      </div>
    );
  }

  return (
    <>
      {/* Inject keyframes for typing bounce animation */}
      <style>{`
        @keyframes typing-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes msg-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .msg-animate {
          animation: msg-in 180ms ease-out both;
        }
      `}</style>

      <div
        className="flex-1 overflow-y-auto scroll-smooth"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.08) 1px, transparent 0)",
          backgroundSize: "24px 24px",
          backgroundColor: "#f8fafc",
        }}
      >
        <div className="px-4 py-4 flex flex-col gap-0.5 min-h-full">
          {enriched.map((item) => {
            if (item.type === "DATE") {
              return <DateDivider key={item.key} label={item.label} />;
            }

            const { msg, isOutgoing, showAvatar, showSenderName, extraGap } = item;

            if (msg.type === "SYSTEM") {
              return <SystemMessage key={item.key} content={msg.content} />;
            }

            return (
              <div
                key={item.key}
                className={`msg-animate ${extraGap ? "mt-3" : "mt-0.5"}`}
              >
                <MessageBubble
                  msg={msg}
                  isOutgoing={isOutgoing}
                  showAvatar={showAvatar}
                  showSenderName={showSenderName}
                  onReact={onReact}
                  onPin={onPin}
                  onUnpin={onUnpin}
                  dispatch={dispatch}
                />
              </div>
            );
          })}

          {/* Typing indicator */}
          {typingUsers.length > 0 && (
            <div className="mt-2">
              <TypingIndicator names={typingUsers.map(u => u.name)} />
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={bottomRef} className="h-2" />
        </div>
      </div>
    </>
  );
}
