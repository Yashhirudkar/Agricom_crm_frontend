import React from "react";

export default function StatusBadge({ status }) {
  const isStatus = (match) => status?.toLowerCase() === match.toLowerCase();

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
        isStatus("active")
          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
          : isStatus("invited")
          ? "bg-amber-50 text-amber-700 border border-amber-100"
          : isStatus("suspended")
          ? "bg-red-50 text-red-700 border border-red-100"
          : "bg-gray-50 text-gray-400 border border-gray-200"
      }`}
    >
      <span
        className={`h-1 w-1 rounded-full ${
          isStatus("active")
            ? "bg-green-500"
            : isStatus("invited")
            ? "bg-amber-500"
            : isStatus("suspended")
            ? "bg-red-500"
            : "bg-gray-300"
        }`}
      />
      {status}
    </span>
  );
}
