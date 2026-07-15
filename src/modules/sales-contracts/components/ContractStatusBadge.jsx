"use client";
import React from "react";
import { FileText, Calendar, Building2, Globe, CheckCircle2, Clock, XCircle, Archive } from "lucide-react";

const STATUS_CONFIG = {
  Draft:     { icon: Clock,         cls: "bg-amber-50 text-amber-700 border-amber-100",    dot: "bg-amber-400" },
  Active:    { icon: CheckCircle2,  cls: "bg-emerald-50 text-emerald-700 border-emerald-100", dot: "bg-emerald-500" },
  Cancelled: { icon: XCircle,       cls: "bg-red-50 text-red-600 border-red-100",          dot: "bg-red-500" },
  Closed:    { icon: Archive,       cls: "bg-gray-100 text-gray-500 border-gray-200",      dot: "bg-gray-400" },
};

export default function ContractStatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Draft;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${cfg.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}
