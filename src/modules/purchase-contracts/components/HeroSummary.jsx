"use client";
import React from "react";
import {
  ArrowLeft,
  RefreshCw,
  Printer,
  Download,
  Building2,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  ChevronDown,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";

const STATUS_BADGE_CLASSES = {
  Draft: "bg-slate-800 text-slate-200 border-slate-700",
  "In Progress": "bg-blue-950/80 text-blue-300 border-blue-800/80",
  "Awaiting Documents": "bg-amber-950/80 text-amber-300 border-amber-800/80",
  "Ready for Dispatch": "bg-indigo-950/80 text-indigo-300 border-indigo-800/80",
  Completed: "bg-emerald-950/80 text-emerald-300 border-emerald-800/80",
  Closed: "bg-gray-900 text-gray-400 border-gray-800",
  Cancelled: "bg-red-950/80 text-red-300 border-red-800/80",
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

export default function HeroSummary({
  contract,
  summary,
  onRefresh,
  onUpdateStatus,
  updatingStatus,
}) {
  const router = useRouter();
  const [showStatusMenu, setShowStatusMenu] = React.useState(false);

  const contractNo = summary?.contractInfo?.contractNumber || `PC-${contract?.salesContract?.contractNumber || contract?.id || ""}`;
  const status = contract?.status || "Draft";

  const buyer = summary?.commercialInfo?.buyer?.entityName || contract?.salesContract?.buyer?.entityName || "—";
  const seller = summary?.commercialInfo?.seller?.entityName || contract?.salesContract?.seller?.entityName || "—";
  const currency = summary?.contractInfo?.currency || contract?.salesContract?.currencyCode || "USD";
  const origin = contract?.salesContract?.originCountry || "—";
  const dest = contract?.salesContract?.destinationCountry || "—";
  const totalQty = summary?.financialSummary?.totalQuantity || 0;
  const contractValue = summary?.financialSummary?.contractValue || 0;

  const nextStatuses = ALLOWED_TRANSITIONS[status] || [];

  return (
    <div className="bg-slate-950 text-white border-b border-slate-800/80 shadow-2xl relative overflow-hidden">
      {/* Background Subtle Gradient & Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6 relative z-10">

        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/sales-contracts")}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-colors border border-slate-800"
              title="Return to Sales Registry"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
              <Zap className="h-4 w-4 text-purple-400 animate-pulse" />
              <span className="font-semibold uppercase tracking-wider text-slate-300">Operational Command Center</span>
              <span>/</span>
              <span className="text-purple-400 font-bold">{contractNo}</span>
            </div>
          </div>

          {/* Quick Command Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 rounded-xl transition-colors"
              title="Live Refresh Matrix"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={() => window.print()}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 rounded-xl transition-colors"
              title="Print Command Sheet"
            >
              <Printer className="h-4 w-4" />
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-lg shadow-purple-950/50 transition-all border border-purple-500/30"
            >
              <Download className="h-4 w-4" />
              <span>Export Execution Dossier</span>
            </button>
          </div>
        </div>

        {/* Hero Title & Primary Metadata Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

          {/* Left Column: Contract Identifier & Route */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-black font-mono tracking-tight text-white flex items-center gap-3">
                {contractNo}
              </h1>

              {/* Status Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => nextStatuses.length > 0 && setShowStatusMenu(!showStatusMenu)}
                  disabled={nextStatuses.length === 0 || updatingStatus}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all shadow-md ${
                    STATUS_BADGE_CLASSES[status] || "bg-slate-800 text-slate-300 border-slate-700"
                  } ${nextStatuses.length > 0 ? "hover:border-purple-400 cursor-pointer" : ""}`}
                >
                  <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                  <span>{status}</span>
                  {nextStatuses.length > 0 && <ChevronDown className="h-3.5 w-3.5 opacity-70" />}
                </button>

                {showStatusMenu && (
                  <div className="absolute left-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Advance Workflow To
                    </div>
                    {nextStatuses.map((st) => (
                      <button
                        key={st}
                        onClick={() => {
                          onUpdateStatus(st);
                          setShowStatusMenu(false);
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-purple-950/60 hover:text-purple-300 flex items-center gap-2 transition-colors"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                        <span>{st}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Trade Route & Counterparties Banner */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800/80 px-3 py-1.5 rounded-xl font-medium">
                <Building2 className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-slate-400">Buyer:</span>
                <span className="font-bold text-white">{buyer}</span>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800/80 px-3 py-1.5 rounded-xl font-medium">
                <Building2 className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-slate-400">Seller:</span>
                <span className="font-bold text-white">{seller}</span>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800/80 px-3 py-1.5 rounded-xl font-medium">
                <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                <span className="font-bold text-emerald-300">{origin}</span>
                <span className="text-slate-500">➔</span>
                <span className="font-bold text-emerald-300">{dest}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Key Commercial Exposure Metrics */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Total Executed Volume
              </span>
              <div className="text-xl font-black font-mono text-purple-300 mt-1">
                {Number(totalQty).toLocaleString("en-US", { minimumFractionDigits: 2 })} <span className="text-xs font-normal text-slate-400">MT</span>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Total Financial Exposure
              </span>
              <div className="text-xl font-black font-mono text-emerald-400 mt-1">
                {currency} {Number(contractValue).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
