import React, { useState } from "react";
import { Eye, Download } from "lucide-react";
import MediaViewer from "./MediaViewer";
import { getAvatarUrl } from "@/lib/axios";

const ImageBubble = React.memo(({ msg }) => {
  const [showViewer, setShowViewer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const msgAttachment = msg.attachments?.[0] || msg.attachment || {};
  const dbAttachment = msgAttachment.attachment || msgAttachment;

  const rawSrc =
    dbAttachment.filePath ||
    (dbAttachment.storagePath ? `/attachments/download/${dbAttachment.storagePath}` : null) ||
    (dbAttachment.storedName ? `/attachments/download/${dbAttachment.storedName}` : null) ||
    msg.payload?.filePath ||
    "";

  const src = rawSrc ? getAvatarUrl(rawSrc) : "";
  const name = dbAttachment.fileName || dbAttachment.originalName || msg.payload?.fileName || msg.payload?.originalName || "image.png";

  const isFilename = msg.content && (
    msg.content === name ||
    msg.content === dbAttachment.originalName ||
    msg.content === msg.payload?.fileName ||
    msg.content === msg.payload?.originalName
  );

  return (
    <div className="flex flex-col gap-1.5 select-none">
      {/* Visual Image container with pre-measured bounds */}
      <div className="relative group rounded-xl overflow-hidden border border-slate-100 bg-slate-50 cursor-pointer max-w-sm max-h-64 shadow-xs"
           onClick={() => setShowViewer(true)}>
        {loading && !hasError && (
          <div className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center text-xs text-slate-400 min-h-[120px]">
            Loading preview...
          </div>
        )}
        {hasError && (
          <div className="p-6 bg-slate-100/90 flex flex-col items-center justify-center text-xs text-slate-500 gap-1 text-center min-h-[100px]">
            <span className="font-semibold">Unable to load image preview</span>
            <span className="text-[10px] text-slate-400">{name}</span>
          </div>
        )}
        {src && !hasError && (
          <img
            src={src}
            alt={name}
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setHasError(true);
            }}
            className={`w-full max-h-64 object-cover transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"}`}
          />
        )}

        {/* Hover actions overlay */}
        <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white cursor-pointer transition-colors" title="Zoom">
            <Eye className="h-4 w-4" />
          </button>
          <a
            href={src}
            download={name}
            onClick={(e) => e.stopPropagation()}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white cursor-pointer transition-colors"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </a>
        </div>
      </div>

      {msg.content && !isFilename && (
        <p className="text-[13px] text-slate-800 leading-normal pl-0.5 mt-0.5 whitespace-pre-wrap select-text">
          {msg.content}
        </p>
      )}

      {/* Lightbox Portal Viewer */}
      {showViewer && (
        <MediaViewer
          currentMedia={{ src, name, type: "IMAGE" }}
          mediaList={[{ src, name, type: "IMAGE" }]}
          onClose={() => setShowViewer(false)}
        />
      )}
    </div>
  );
});

ImageBubble.displayName = "ImageBubble";

export default ImageBubble;
