import React, { useState } from "react";
import { FileText, Eye, Download } from "lucide-react";
import MediaViewer from "./MediaViewer";
import { getAvatarUrl } from "@/lib/axios";

const PdfBubble = React.memo(({ msg }) => {
  const [showViewer, setShowViewer] = useState(false);

  const attachment = msg.attachments?.[0] || msg.attachment || {};
  const rawSrc = attachment.filePath || msg.payload?.filePath || "";
  const src = rawSrc ? getAvatarUrl(rawSrc) : "";
  const name = attachment.fileName || msg.payload?.fileName || "document.pdf";
  const sizeVal = attachment.fileSize || msg.payload?.fileSize;
  const size = sizeVal
    ? `${(sizeVal / 1024).toFixed(1)} KB`
    : "PDF Document";

  return (
    <div className="flex flex-col gap-1.5 select-none">
      <div className="w-80 p-3 bg-white border border-slate-200/60 rounded-xl flex items-center gap-3.5 shadow-xs">
        <div className="h-10 w-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center shrink-0">
          <FileText className="h-5 w-5" />
        </div>

        <div className="flex-1 min-w-0 flex flex-col">
          <span className="text-[12px] font-bold text-slate-800 truncate" title={name}>
            {name}
          </span>
          <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
            {size}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setShowViewer(true)}
            className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
            title="Read Document"
          >
            <Eye className="h-4 w-4" />
          </button>
          <a
            href={src}
            download={name}
            className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
            title="Download Document"
          >
            <Download className="h-4 w-4" />
          </a>
        </div>
      </div>

      {msg.content && (
        <p className="text-[13px] text-slate-800 leading-normal pl-0.5 mt-0.5 whitespace-pre-wrap select-text">
          {msg.content}
        </p>
      )}

      {/* Lightbox PDF Portal Viewer */}
      {showViewer && (
        <MediaViewer
          currentMedia={{ src, name, type: "PDF" }}
          mediaList={[{ src, name, type: "PDF" }]}
          onClose={() => setShowViewer(false)}
        />
      )}
    </div>
  );
});

PdfBubble.displayName = "PdfBubble";

export default PdfBubble;
