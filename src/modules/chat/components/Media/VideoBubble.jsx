import React, { useState } from "react";
import { Play } from "lucide-react";
import MediaViewer from "./MediaViewer";
import { getAvatarUrl } from "@/lib/axios";

const VideoBubble = React.memo(({ msg }) => {
  const [showViewer, setShowViewer] = useState(false);

  const attachment = msg.attachments?.[0] || msg.attachment || {};
  const rawSrc = attachment.filePath || msg.payload?.filePath || "";
  const src = rawSrc ? getAvatarUrl(rawSrc) : "";
  const name = attachment.fileName || msg.payload?.fileName || "video.mp4";

  return (
    <div className="flex flex-col gap-1.5 select-none">
      {/* Video cover frame */}
      <div
        onClick={() => setShowViewer(true)}
        className="relative group rounded-xl overflow-hidden border border-slate-100 bg-slate-900 cursor-pointer w-80 h-48 shadow-xs flex items-center justify-center"
      >
        <video
          src={src}
          className="w-full h-full object-cover opacity-80"
          muted
          playsInline
        />
        {/* Hover play buttons */}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-colors group-hover:bg-black/35">
          <div className="p-3 bg-white/20 backdrop-blur-md hover:bg-white/35 rounded-full text-white cursor-pointer transition-transform group-hover:scale-105 shadow-md">
            <Play className="h-6 w-6 fill-white" />
          </div>
        </div>
      </div>

      {msg.content && (
        <p className="text-[13px] text-slate-800 leading-normal pl-0.5 mt-0.5 whitespace-pre-wrap select-text">
          {msg.content}
        </p>
      )}

      {/* Lightbox Video Portal Viewer */}
      {showViewer && (
        <MediaViewer
          currentMedia={{ src, name, type: "VIDEO" }}
          mediaList={[{ src, name, type: "VIDEO" }]}
          onClose={() => setShowViewer(false)}
        />
      )}
    </div>
  );
});

VideoBubble.displayName = "VideoBubble";

export default VideoBubble;
