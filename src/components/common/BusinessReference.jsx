
"use client";

import React from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { copyToClipboard } from "@/utils/clipboard";

export default function BusinessReference({ reference, className = "" }) {
  if (!reference) return null;

  const handleCopy = async () => {
    try {
      await copyToClipboard(reference);
      toast.success("Reference No. copied");
    } catch (error) {
      console.error("Failed to copy reference number", error);
      toast.error("Unable to copy reference number");
    }
  };

  return (
    <div className={`flex items-center gap-2 min-w-0 ${className}`}>
      <span className="text-[15px] font-semibold text-[#007aff] truncate">{reference}</span>
      <button
        type="button"
        onClick={handleCopy}
        className="shrink-0 p-0.5 text-[#007aff] hover:text-blue-700 transition-colors cursor-pointer"
        title="Copy Reference No."
        aria-label="Copy Reference No."
      >
        <Copy className="h-4 w-4" />
      </button>
    </div>
  );
}
