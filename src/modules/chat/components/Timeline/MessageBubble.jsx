import React, { useState, useMemo, useCallback, useRef } from "react";
import { Ban } from "lucide-react";
import MessageStatus from "./MessageStatus";
import MessageActionsMenu from "./MessageActionsMenu";
import ReactionBadges from "./ReactionBadges";
import MessageRenderer from "./MessageRenderer";
import { toast } from "sonner";

function formatTime(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const MessageBubble = React.memo(({
  msg,
  isOutgoing,
  onReact,
  onPin,
  onUnpin,
  onStar,
  onDownload,
  onViewEditHistory,
  onEdit,
  onDelete,
  onReply,
  conversation,
  currentUser
}) => {
  const [hovered, setHovered] = useState(false);
  const touchTimer = useRef(null);

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

  return (
    <div
      className={`flex items-start gap-2 group ${isOutgoing ? "flex-row-reverse" : "flex-row"} relative`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchEnd}
    >
      {/* Bubble Content column */}
      <div className={`flex flex-col max-w-[65%] w-fit ${isOutgoing ? "items-end" : "items-start"}`}>
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
            className={`relative px-[14px] py-[10px] min-w-[75px] rounded-[18px] transition-all duration-200 ease-in-out hover:-translate-y-px text-left
              ${isOutgoing
                ? "bg-[#DCF8C6] text-[#111827] shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                : "bg-[#FFFFFF] text-[#1F2937] shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
              } ${msg.isOptimistic && msg.status !== "FAILED" ? "opacity-60" : ""}`}
          >
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
              <span className="text-[11px] leading-none text-[#9CA3AF]">
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