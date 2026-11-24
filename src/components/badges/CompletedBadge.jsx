import React from "react";
import { Lock, Unlock, AlertCircle } from "lucide-react";

export default function CompletedBadge({
  isReadOnly: _isReadOnly = true,
  isOneTimeAllowed = false,
  canOverride = false,
  className = "",
  size = "sm",
}) {
  const iconSize = size === "xs" ? "h-2.5 w-2.5" : "h-3 w-3";
  const textSize = size === "xs" ? "text-[10px]" : "text-xs";

  // State 1: Override Permission Active (unlimited edits)
  if (canOverride) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs ${textSize} ${className}`}
        title="Completed record in edit mode via override permission (unlimited edits allowed)"
      >
        <Unlock className={`${iconSize} text-indigo-600`} />
        <span>Completed (Override Active)</span>
      </span>
    );
  }

  // State 2: 1-Time Correction Allowed
  if (isOneTimeAllowed) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs ${textSize} ${className}`}
        title="1 correction remaining. Once changes are saved, this record will be permanently locked."
      >
        <AlertCircle className={`${iconSize} text-amber-600`} />
        <span>Completed (1 Correction Left)</span>
      </span>
    );
  }

  // State 3: Permanently Read-Only (locked)
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700 border border-slate-300 shadow-2xs ${textSize} ${className}`}
      title="This record has been finalized and locked permanently."
    >
      <Lock className={`${iconSize} text-slate-500`} />
      <span>Completed (Read Only)</span>
    </span>
  );
}
