import React, { useState, useMemo, useCallback, useRef } from "react";
import { Pin, Ban } from "lucide-react";
import Avatar from "./Avatar";
import MessageStatus from "./MessageStatus";
import MessageActionsMenu from "./MessageActionsMenu";
import ReactionBadges from "./ReactionBadges";
import MessageRenderer from "./MessageRenderer";
import { toast } from "sonner";

function formatTime(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Outgoing SVG tail (bottom-right) — matches the gradient bubble via currentColor + gradient defs
const OutgoingTail = () => (
  <svg
    className="absolute bottom-0 -right-[5.5px] h-[10px] w-[8px] z-10 pointer-events-none"
    viewBox="0 0 8 10"
    fill="url(#outgoingTailGradient)"
  >
    <defs>
      <linearGradient id="outgoingTailGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#4F92F6" />
        <stop offset="100%" stopColor="#3B6FE0" />
      </linearGradient>
    </defs>
    <path d="M0,10 C4,10 8,8 8,0 L8,10 Z" />
  </svg>
);

// Incoming SVG tail (bottom-left)
const IncomingTail = () => (
  <svg
    className="absolute bottom-0 -left-[5.5px] text-white h-[10px] w-[8px] z-10 pointer-events-none drop-shadow-[0_1px_0.5px_rgba(0,0,0,0.02)]"
    viewBox="0 0 8 10"
    fill="currentColor"
  >
    <path d="M8,10 C4,10 0,8 0,0 L0,10 Z" />
  </svg>
);

const MessageBubble = React.memo(({
  msg,
  isOutgoing,
  showAvatar,
  showSenderName,
  bubblePosition,
  onReact,
  onPin,
  onUnpin,
  onStar,
  onDownload,
  onViewEditHistory,
  onEdit,
  onDelete,
  onReply,
  dispatch,
  conversation,
  currentUser,
  presence
}) => {
  const [hovered, setHovered] = useState(false);
  const touchTimer = useRef(null);

  const isPinned = !!msg.pinnedAt;
  const isEdited = !!msg.editedAt;

  // WhatsApp/Telegram style grouping corners: tail bottom-right or bottom-left on last/single stack item
  const getBubbleCorners = useCallback(() => {
    const isLastOrSingle = bubblePosition === "end" || bubblePosition === "single";
    const isFirstOrSingle = bubblePosition === "start" || bubblePosition === "single";
    if (isOutgoing) {
      if (isLastOrSingle) return "rounded-[14px] rounded-br-[4px]";
      if (isFirstOrSingle) return "rounded-[14px] rounded-tr-[4px]";
      return "rounded-[14px] rounded-r-[4px]";
    } else {
      if (isLastOrSingle) return "rounded-[14px] rounded-bl-[4px]";
      if (isFirstOrSingle) return "rounded-[14px] rounded-tl-[4px]";
      return "rounded-[14px] rounded-l-[4px]";
    }
  }, [isOutgoing, bubblePosition]);

  // Real-time O(1) Read Receipts validation logic
  const otherMember = useMemo(() => {
    if (!conversation?.members) return null;
    const currentId = currentUser?.id || currentUser?.userId;
    return conversation.members.find(m => {
      const mId = m.userId || m.user?.id;
      return Number(mId) !== Number(currentId);
    });
  }, [conversation, currentUser]);

  const isRead = useMemo(() => {
    if (msg.isOptimistic) return false;
    if (!otherMember || !otherMember.lastReadMessageId) return false;
    return Number(otherMember.lastReadMessageId) >= Number(msg.id);
  }, [otherMember, msg.id, msg.isOptimistic]);

  // Touch handlers for mobile long press triggers
  const handleTouchStart = useCallback(() => {
    touchTimer.current = setTimeout(() => {
      setHovered(true);
    }, 600);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchTimer.current) {
      clearTimeout(touchTimer.current);
    }
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(msg.content);
    toast.success("Copied to clipboard!");
  }, [msg.content]);

  const handleReply = useCallback(() => {
    if (onReply) onReply(msg);
  }, [msg, onReply]);

  const handleEdit = useCallback(() => {
    if (onEdit) onEdit(msg);
  }, [msg, onEdit]);

  const handleDelete = useCallback(() => {
    if (onDelete) onDelete(msg.id);
  }, [msg.id, onDelete]);

  const handleStar = useCallback(() => {
    if (onStar) onStar(msg.id);
  }, [msg.id, onStar]);

  const handleDownload = useCallback(() => {
    if (onDownload) onDownload(msg.id);
  }, [msg.id, onDownload]);

  const handleViewEditHistory = useCallback(() => {
    if (onViewEditHistory) onViewEditHistory(msg.id);
  }, [msg.id, onViewEditHistory]);

  const isLastOrSingle = bubblePosition === "end" || bubblePosition === "single";

  return (
    <div
      className={`flex items-start gap-2 group ${isOutgoing ? "flex-row-reverse" : "flex-row"} relative`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchEnd}
    >
      {/* Avatar block — aligned to first message only */}
      <div className="w-8 flex-shrink-0 self-start mt-0.5 select-none">
        {showAvatar && !isOutgoing && (
          <Avatar sender={msg.sender} presence={presence} size="sm" />
        )}
      </div>

      {/* Bubble Content column */}
      <div className={`flex flex-col max-w-[72%] w-fit ${isOutgoing ? "items-end" : "items-start"}`}>
        <div className="relative">
          {hovered && !msg.isDeleted && (
            <MessageActionsMenu
              msg={msg}
              isOutgoing={isOutgoing}
              onReact={onReact}
              onPin={onPin}
              onUnpin={onUnpin}
              onCopy={handleCopy}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onReply={handleReply}
              onStar={handleStar}
              onDownload={handleDownload}
              onViewEditHistory={handleViewEditHistory}
            />
          )}

          {/* SVG tails removed as requested to avoid side-tail clipping/overflow artifacts */}

          <div
            className={`relative px-3 pt-1.5 pb-4 min-w-[75px] ${getBubbleCorners()} transition-all duration-150 text-left
              ${isOutgoing
                ? "text-white shadow-[0_1px_2px_rgba(59,111,224,0.25)]"
                : "bg-white text-slate-800 border border-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
              } ${msg.isOptimistic && msg.status !== "FAILED" ? "opacity-60" : ""}`}
            style={
              isOutgoing
                ? { background: "linear-gradient(135deg, #4F92F6 0%, #3B6FE0 100%)" }
                : undefined
            }
          >
            {showSenderName && !isOutgoing && conversation?.type !== "DIRECT" && (
              <span className="text-[10px] font-bold text-blue-600 block mb-0.5 select-none leading-none tracking-tight">
                {msg.sender?.name || "Unknown"}
              </span>
            )}

            {/* Telegram style Reply Preview */}
            {msg.parentMessage && !msg.isDeleted && (
              <div
                className={`mb-1 px-2 py-0.5 rounded-sm border-l-[3px] text-left overflow-hidden select-none
                  ${isOutgoing
                    ? "bg-white/10 border-white/60"
                    : "bg-slate-50 border-blue-500"
                  }`}
              >
                <span className={`text-[9.5px] font-bold block leading-none mb-0.5 ${isOutgoing ? "text-white/80" : "text-blue-600"}`}>
                  {msg.parentMessage.sender?.name || "Unknown"}
                </span>
                <span className={`block truncate text-[11px] leading-tight ${isOutgoing ? "text-white/70" : "text-slate-500"}`}>
                  {msg.parentMessage.content}
                </span>
              </div>
            )}

            {isPinned && !msg.isDeleted && (
              <div className="flex items-center gap-1 mb-0.5 opacity-70">
                <Pin className={`h-2.5 w-2.5 ${isOutgoing ? "text-blue-100" : "text-amber-600"}`} />
                <span className={`text-[8px] font-bold uppercase tracking-wider ${isOutgoing ? "text-blue-100" : "text-amber-600"}`}>Pinned</span>
              </div>
            )}

            {/* Message Content Body */}
            <div className="text-[13.5px] leading-[1.5] break-words pr-4 text-slate-850 select-text">
              {msg.isDeleted ? (
                <div className={`flex items-center gap-1.5 py-0.5 select-none italic text-[12.5px] ${
                  isOutgoing ? "text-white/80" : "text-slate-500"
                }`}>
                  <Ban className="h-3.5 w-3.5 opacity-80 flex-shrink-0" />
                  <span>{isOutgoing ? "You deleted this message" : "This message was deleted"}</span>
                </div>
              ) : (
                <MessageRenderer
                  msg={msg}
                  conversation={conversation}
                  currentUser={currentUser}
                />
              )}
            </div>

            {/* Absolute Telegram-style inline bottom-right timestamp */}
            <div className="absolute bottom-0.5 right-1.5 flex items-center gap-1 select-none">
              {isEdited && (
                <span className={`text-[8.5px] italic leading-none ${isOutgoing ? "text-white/60" : "text-slate-400/60"
                  }`}>
                  edited
                </span>
              )}
              <span className={`text-[9px] leading-none ${isOutgoing ? "text-white/80" : "text-slate-400"
                }`}>
                {formatTime(msg.createdAt)}
              </span>
              <MessageStatus
                msg={msg}
                isOutgoing={isOutgoing}
                isRead={isRead}
              />
            </div>
          </div>
        </div>

        <ReactionBadges
          reactions={msg.reactions}
          isOutgoing={isOutgoing}
          onReact={onReact}
          messageId={msg.id}
        />
      </div>
    </div>
  );
}, (prev, next) => {
  return (
    prev.msg.id === next.msg.id &&
    prev.msg.content === next.msg.content &&
    prev.msg.isOptimistic === next.msg.isOptimistic &&
    prev.msg.status === next.msg.status &&
    prev.msg.editedAt === next.msg.editedAt &&
    prev.msg.pinnedAt === next.msg.pinnedAt &&
    prev.bubblePosition === next.bubblePosition &&
    prev.showAvatar === next.showAvatar &&
    prev.showSenderName === next.showSenderName &&
    prev.presence === next.presence &&
    JSON.stringify(prev.msg.reactions) === JSON.stringify(next.msg.reactions) &&
    prev.conversation?.members?.length === next.conversation?.members?.length
  );
});

MessageBubble.displayName = "MessageBubble";

export default MessageBubble;