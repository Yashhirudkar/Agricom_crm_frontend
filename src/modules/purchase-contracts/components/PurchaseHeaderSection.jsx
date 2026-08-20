"use client";
import React, { useState } from "react";
import {
  ArrowLeft,
  FileText,
  Save,
  Download,
  Building2,
  Calendar,
  ChevronDown,
  Sparkles,
  Link as LinkIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

const STATUS_BADGE_CLASSES = {
  Draft: "bg-slate-100 text-slate-700 border-slate-300",
  "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
  "Awaiting Documents": "bg-amber-50 text-amber-700 border-amber-200",
  "Ready for Dispatch": "bg-indigo-50 text-indigo-700 border-indigo-200",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Closed: "bg-gray-100 text-gray-700 border-gray-300",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
};

const ALLOWED_TRANSITIONS = {
  Draft: ["In Progress", "Cancelled"],
  "In Progress": ["Awaiting Documents", "Ready for Dispatch", "Cancelled"],
  "Awaiting Documents": ["In Progress", "Ready for Dispatch", "Cancelled"],
  "Ready for Dispatch": ["Completed", "Cancelled"],
  Completed: ["Closed"],
  Closed: [],
  Cancelled: [],
};

export default function PurchaseHeaderSection({
  contract,
  summary,
  onSave,
  saving,
  onUpdateStatus,
  updatingStatus,
}) {
  const router = useRouter();
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const contractNo = summary?.contractInfo?.contractNumber || `PC-${contract?.salesContract?.contractNumber || contract?.id || ""}`;
  const salesContractNo = contract?.salesContract?.contractNumber ? `SC-${contract.salesContract.contractNumber}` : "—";
  const status = contract?.status || "Draft";
  const buyerName = summary?.commercialInfo?.buyer?.entityName || contract?.salesContract?.buyer?.entityName || "—";
  const supplierName = summary?.commercialInfo?.seller?.entityName || contract?.salesContract?.seller?.entityName || "—";
  const createdAtStr = contract?.createdAt
    ? new Date(contract.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  const nextStatuses = ALLOWED_TRANSITIONS[status] || [];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left Side: Title & Subtitle Info */}
        <div className="flex items-start gap-3.5">
          <button
            onClick={() => router.push("/sales-contracts")}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors mt-0.5"
            title="Back to Sales Contracts"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#007aff] font-bold">
                <FileText className="h-4 w-4" />
              </div>
              <h1 className="text-lg font-bold text-gray-900 tracking-tight font-mono">
                {contractNo}
              </h1>

              {/* Status Badge + Transition Dropdown */}
              <div className="relative">
                <button
                  onClick={() => nextStatuses.length > 0 && setShowStatusDropdown(!showStatusDropdown)}
                  disabled={nextStatuses.length === 0 || updatingStatus}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-bold transition-all ${
                    STATUS_BADGE_CLASSES[status] || "bg-gray-100 text-gray-700 border-gray-300"
                  } ${nextStatuses.length > 0 ? "hover:ring-2 hover:ring-[#007aff]/20 cursor-pointer" : ""}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  <span>{status}</span>
                  {nextStatuses.length > 0 && <ChevronDown className="h-3 w-3 opacity-70" />}
                </button>

                {showStatusDropdown && nextStatuses.length > 0 && (
                  <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1 text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                      Advance Status To
                    </div>
                    {nextStatuses.map((st) => (
                      <button
                        key={st}
                        onClick={() => {
                          onUpdateStatus(st);
                          setShowStatusDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#007aff] flex items-center gap-2 transition-colors"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-[#007aff]" />
                        <span>{st}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sub-info bar */}
            <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500 flex-wrap">
              <div className="flex items-center gap-1 font-medium">
                <LinkIcon className="h-3 w-3 text-gray-400" />
                <span>Sales Ref:</span>
                <span className="font-bold text-[#007aff] font-mono">{salesContractNo}</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1">
                <Building2 className="h-3 w-3 text-gray-400" />
                <span>Buyer:</span>
                <span className="font-semibold text-gray-800">{buyerName}</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1">
                <Building2 className="h-3 w-3 text-gray-400" />
                <span>Supplier:</span>
                <span className="font-semibold text-gray-800">{supplierName}</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-gray-400" />
                <span>Created:</span>
                <span className="font-semibold text-gray-700">{createdAtStr}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors shadow-2xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#007aff] hover:bg-blue-600 rounded-xl transition-colors shadow-xs disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
