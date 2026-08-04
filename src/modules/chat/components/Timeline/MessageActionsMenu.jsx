import React, { useState, useRef, useEffect } from "react";
import {
  Smile, MessageSquare, Copy, Pin, Edit3, Trash2,
  Forward, Star, Download, History, MoreHorizontal
} from "lucide-react";

const EMOJIS = ["👍", "❤️", "😂", "😮", "😢"];

const MessageActionsMenu = React.memo(({
  msg,
  isOutgoing,
  onReact,
  onReply,
  onReplyInThread,
  onForward,
  onCopy,
  onEdit,
  onDelete,
  onPin,
  onUnpin,
  onStar,
  onBookmark,
  onDownload,
  onShareLink,
  onViewReadReceipts,
  onViewEditHistory,
  onReport
}) => {
  const [showEmoji, setShowEmoji] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const isPinned = !!msg.pinnedAt;

  // Handle click outside to close dropdown menu
  useEffect(() => {
    if (!showDropdown) return;
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  return (
    <div
      className="absolute -top-3.5 right-4 flex items-center gap-0.5 bg-white border border-slate-200/80 rounded-xl shadow-md p-0.5 z-20 select-none animate-in fade-in zoom-in-95 slide-in-from-top-0.5 duration-100 ease-out"
      style={{ whiteSpace: "nowrap" }}
    >
      {/* Quick Emoji Reactions */}
      <div className="relative">
        <button
          onClick={() => setShowEmoji(v => !v)}
          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-700 cursor-pointer"
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
                onClick={() => { onReact(msg.id, e); setShowEmoji(false); }}
                className="text-base hover:scale-125 transition-transform p-0.5 cursor-pointer"
              >
                {e}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {onReplyInThread && (
        <button
          onClick={onReplyInThread}
          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-700 cursor-pointer"
          title="Reply in Thread"
        >
          <MessageSquare className="h-3.5 w-3.5" />
        </button>
      )}

      <button
        onClick={onCopy}
        className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-700 cursor-pointer"
        title="Copy"
      >
        <Copy className="h-3.5 w-3.5" />
      </button>

      <button
        onClick={() => isPinned ? onUnpin(msg.id) : onPin(msg.id)}
        className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-700 cursor-pointer"
        title={isPinned ? "Unpin" : "Pin"}
      >
        <Pin className={`h-3.5 w-3.5 ${isPinned ? "text-amber-600 fill-amber-600" : ""}`} />
      </button>

      {/* More Options Dropdown Trigger */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(v => !v)}
          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-700 cursor-pointer"
          title="More actions"
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>

        {showDropdown && (
          <div
            className={`absolute bottom-full mb-1 w-48 bg-white border border-slate-200/80 rounded-xl shadow-2xl py-1 z-30 flex flex-col text-left
              ${isOutgoing ? "right-0" : "left-0"}`}
          >
            {onReply && (
              <button
                onClick={() => { onReply(); setShowDropdown(false); }}
                className="px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer w-full text-left font-medium"
              >
                <MessageSquare className="h-3.5 w-3.5 text-slate-400" /> Reply Quote
              </button>
            )}

            {onForward && (
              <button
                onClick={() => { onForward(); setShowDropdown(false); }}
                className="px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer w-full text-left font-medium"
              >
                <Forward className="h-3.5 w-3.5 text-slate-400" /> Forward Message
              </button>
            )}

            {onEdit && isOutgoing && (
              <button
                onClick={() => { onEdit(); setShowDropdown(false); }}
                className="px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer w-full text-left font-medium border-t border-slate-100"
              >
                <Edit3 className="h-3.5 w-3.5 text-slate-400" /> Edit Message
              </button>
            )}

            {onStar && (
              <button
                onClick={() => { onStar(); setShowDropdown(false); }}
                className="px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer w-full text-left font-medium"
              >
                <Star className="h-3.5 w-3.5 text-slate-400" /> Star / Bookmark
              </button>
            )}

            {onDownload && (msg.type === "FILE" || msg.type === "IMAGE") && (
              <button
                onClick={() => { onDownload(); setShowDropdown(false); }}
                className="px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer w-full text-left font-medium border-t border-slate-100"
              >
                <Download className="h-3.5 w-3.5 text-slate-400" /> Download Asset
              </button>
            )}

            {onViewEditHistory && msg.editedAt && (
              <button
                onClick={() => { onViewEditHistory(); setShowDropdown(false); }}
                className="px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer w-full text-left font-medium"
              >
                <History className="h-3.5 w-3.5 text-slate-400" /> Edit History
              </button>
            )}

            {onDelete && isOutgoing && (
              <button
                onClick={() => { onDelete(); setShowDropdown(false); }}
                className="px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer w-full text-left font-medium border-t border-slate-100"
              >
                <Trash2 className="h-3.5 w-3.5 text-red-400" /> Delete Message
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

MessageActionsMenu.displayName = "MessageActionsMenu";

export default MessageActionsMenu;
