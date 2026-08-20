"use client";
import React, { useState } from "react";
import {
  ArrowLeft,
  RefreshCw,
  Printer,
  Download,
  FileText,
  Building2,
  Calendar,
  ShieldCheck,
  ChevronDown,
  Sparkles,
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

export default function PurchaseContractHeader({
  contract,
  summary,
  onRefresh,
  onUpdateStatus,
  updatingStatus,
}) {
  const router = useRouter();
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const contractNo = summary?.contractInfo?.contractNumber || `PC-${contract?.salesContract?.contractNumber || contract?.id || ""}`;
  const status = contract?.status || "Draft";
  const buyerName = summary?.commercialInfo?.buyer?.entityName || contract?.salesContract?.buyer?.entityName || "—";
  const sellerName = summary?.commercialInfo?.seller?.entityName || contract?.salesContract?.seller?.entityName || "—";
  const createdAtStr = contract?.createdAt
    ? new Date(contract.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";
  const healthScore = summary?.health?.healthScore ?? 100;
  const riskLevel = summary?.health?.riskLevel || "Low";

  const nextStatuses = ALLOWED_TRANSITIONS[status] || [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-xs sticky top-0 z-40">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Side: Back + Contract Info */}
        <div className="flex items-start gap-4">
          <button
            onClick={() => router.push("/sales-contracts")}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors mt-0.5"
            title="Back to Sales Contracts"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 font-bold">
                <FileText className="h-5 w-5" />
              </div>
              <h1 className="text-xl font-bold font-mono text-gray-900 tracking-tight flex items-center gap-2">
                {contractNo}
              </h1>

              {/* Status Badge + Transition Dropdown */}
              <div className="relative">
                <button
                  onClick={() => nextStatuses.length > 0 && setShowStatusDropdown(!showStatusDropdown)}
                  disabled={nextStatuses.length === 0 || updatingStatus}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold transition-all shadow-2xs ${
                    STATUS_BADGE_CLASSES[status] || "bg-gray-100 text-gray-700 border-gray-300"
                  } ${nextStatuses.length > 0 ? "hover:ring-2 hover:ring-purple-400/30 cursor-pointer" : ""}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  <span>{status}</span>
                  {nextStatuses.length > 0 && <ChevronDown className="h-3 w-3 opacity-70" />}
                </button>

                {showStatusDropdown && nextStatuses.length > 0 && (
                  <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Advance Status To
                    </div>
                    {nextStatuses.map((st) => (
                      <button
                        key={st}
                        onClick={() => {
                          onUpdateStatus(st);
                          setShowStatusDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2 transition-colors"
                      >
                        <Sparkles className="h-3 w-3 text-purple-500" />
                        <span>{st}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sub-meta bar */}
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 flex-wrap">
              <div className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-gray-400" />
                <span className="font-semibold text-gray-700">Buyer:</span>
                <span>{buyerName}</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-gray-400" />
                <span className="font-semibold text-gray-700">Seller:</span>
                <span>{sellerName}</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                <span className="font-semibold text-gray-700">Created:</span>
                <span>{createdAtStr}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Health Score Tag & Action Buttons */}
        <div className="flex items-center gap-3 self-end lg:self-center">
          {/* Health Score Pill */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <div className="text-right">
              <div className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                Health Score
              </div>
              <div className="text-xs font-bold text-gray-800 font-mono">
                {healthScore}% <span className="text-[10px] font-normal text-emerald-600">({riskLevel})</span>
              </div>
            </div>
          </div>

          <div className="h-8 w-px bg-gray-200 hidden sm:block" />

          {/* Buttons */}
          <button
            onClick={onRefresh}
            className="p-2 text-gray-500 hover:text-[#007aff] hover:bg-blue-50 border border-gray-200 rounded-xl transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={handlePrint}
            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors"
            title="Print Workspace"
          >
            <Printer className="h-4 w-4" />
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#007aff] hover:bg-blue-600 rounded-xl shadow-xs transition-colors"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export Workspace</span>
          </button>
        </div>
      </div>
    </div>
  );
}
