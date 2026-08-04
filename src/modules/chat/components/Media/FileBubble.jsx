import React from "react";
import { Paperclip, Download } from "lucide-react";

const FileBubble = React.memo(({ msg }) => {
  const attachment = msg.attachments?.[0] || msg.attachment || {};
  const src = attachment.filePath || "";
  const name = attachment.fileName || "attachment.bin";
  const size = attachment.fileSize
    ? `${(attachment.fileSize / 1024).toFixed(1)} KB`
    : "Generic File";

  return (
    <div className="flex flex-col gap-1.5 select-none">
      <div className="w-80 p-3 bg-white border border-slate-200/60 rounded-xl flex items-center gap-3.5 shadow-xs">
        <div className="h-10 w-10 bg-slate-50 text-slate-500 rounded-lg flex items-center justify-center shrink-0">
          <Paperclip className="h-5 w-5" />
        </div>

        <div className="flex-1 min-w-0 flex flex-col">
          <span className="text-[12px] font-bold text-slate-800 truncate" title={name}>
            {name}
          </span>
          <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
            {size}
          </span>
        </div>

        <a
          href={src}
          download={name}
          className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-slate-700 transition-colors cursor-pointer shrink-0"
          title="Download File"
        >
          <Download className="h-4 w-4" />
        </a>
      </div>

      {msg.content && (
        <p className="text-[13px] text-slate-800 leading-normal pl-0.5 mt-0.5 whitespace-pre-wrap select-text">
          {msg.content}
        </p>
      )}
    </div>
  );
});

FileBubble.displayName = "FileBubble";

export default FileBubble;
