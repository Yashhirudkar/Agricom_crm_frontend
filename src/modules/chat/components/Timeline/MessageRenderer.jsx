import React from "react";
import dynamic from "next/dynamic";

// Lazy-load complex media and poll cards to keep bundle size small
const PollCard = dynamic(() => import("../Polls/PollCard"), {
  loading: () => <div className="h-20 w-48 bg-slate-50 border border-slate-200 animate-pulse rounded-xl" />,
  ssr: false
});

const ImageBubble = dynamic(() => import("../Media/ImageBubble"), {
  loading: () => <div className="h-32 w-48 bg-slate-50 animate-pulse rounded-xl" />,
  ssr: false
});

const VideoBubble = dynamic(() => import("../Media/VideoBubble"), {
  loading: () => <div className="h-32 w-48 bg-slate-50 animate-pulse rounded-xl" />,
  ssr: false
});

const AudioBubble = dynamic(() => import("../Media/AudioBubble"), {
  loading: () => <div className="h-10 w-48 bg-slate-50 animate-pulse rounded-xl" />,
  ssr: false
});

const PdfBubble = dynamic(() => import("../Media/PdfBubble"), {
  loading: () => <div className="h-14 w-48 bg-slate-50 animate-pulse rounded-xl" />,
  ssr: false
});

const FileBubble = dynamic(() => import("../Media/FileBubble"), {
  loading: () => <div className="h-14 w-48 bg-slate-50 animate-pulse rounded-xl" />,
  ssr: false
});

// Inline Text Renderer
const TextBubble = React.memo(({ msg }) => {
  return (
    <p className="text-[13px] leading-[1.55] break-words whitespace-pre-wrap select-text">
      {msg.content}
    </p>
  );
});
TextBubble.displayName = "TextBubble";

// Inline ERP Context link bubble
const ErpBubble = React.memo(({ msg }) => {
  const meta = msg.payload || {};
  return (
    <div className="flex flex-col gap-1 p-2 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200/60 max-w-sm select-none cursor-pointer transition-colors">
      <div className="flex items-center gap-1.5 text-[9px] font-bold text-blue-600 uppercase tracking-wider">
        <span>💼 ERP LINKED: {meta.entityType || "Lead"}</span>
      </div>
      <p className="text-[12px] font-semibold text-slate-800 truncate">
        {meta.entityName || msg.content}
      </p>
      <span className="text-[10px] text-slate-400">
        ID: {meta.entityId || "N/A"}
      </span>
    </div>
  );
});
ErpBubble.displayName = "ErpBubble";

// Core registry mapping keys to component templates
const Registry = {
  TEXT: TextBubble,
  IMAGE: ImageBubble,
  VIDEO: VideoBubble,
  PDF: PdfBubble,
  VOICE: AudioBubble,
  AUDIO: AudioBubble,
  FILE: FileBubble,
  POLL: PollCard,
  ERP: ErpBubble,
};

const MessageRenderer = React.memo(({ msg, conversation, currentUser }) => {
  const type = msg.type || "TEXT";
  const TargetComponent = Registry[type] || TextBubble;

  return (
    <div className="w-full">
      <TargetComponent
        msg={msg}
        conversation={conversation}
        currentUser={currentUser}
      />
    </div>
  );
});

MessageRenderer.displayName = "MessageRenderer";

export default MessageRenderer;
