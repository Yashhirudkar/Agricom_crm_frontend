"use client";
import React from "react";
import {
  Scale,
  Layers,
  CheckCircle2,
  Ship,
  AlertTriangle,
  FileText,
} from "lucide-react";

export default function PurchaseAllocationSummaryCards({
  allocationSummary = {},
  loading = false,
}) {
  if (loading) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-xs animate-pulse">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const {
    salesContractQty = 0,
    alreadyAllocatedQty = 0,
    availableBalanceQty = 0,
    currentPurchaseQty = 0,
    remainingBalance = 0,
    overAllocatedQty = 0,
    isOverAllocated = false,
  } = allocationSummary;

  const cards = [
    {
      title: "Sales Contract Qty",
      value: `${Number(salesContractQty).toLocaleString("en-IN", { minimumFractionDigits: 2 })} MT`,
      subtitle: "Linked SC Total",
      icon: FileText,
      color: "text-slate-700 bg-slate-100 border-slate-200",
      bgCard: "bg-slate-50/50 border-slate-200/80",
    },
    {
      title: "Already Allocated",
      value: `${Number(alreadyAllocatedQty).toLocaleString("en-IN", { minimumFractionDigits: 2 })} MT`,
      subtitle: "Other Active Purchase Contracts",
      icon: Layers,
      color: "text-purple-700 bg-purple-100 border-purple-200",
      bgCard: "bg-purple-50/30 border-purple-200/70",
    },
    {
      title: "Available Balance",
      value: `${Number(availableBalanceQty).toLocaleString("en-IN", { minimumFractionDigits: 2 })} MT`,
      subtitle: "SC Qty - Already Allocated",
      icon: CheckCircle2,
      color: "text-indigo-700 bg-indigo-100 border-indigo-200",
      bgCard: "bg-indigo-50/30 border-indigo-200/70",
    },
    {
      title: "Current Purchase",
      value: `${Number(currentPurchaseQty).toLocaleString("en-IN", { minimumFractionDigits: 2 })} MT`,
      subtitle: "Selected Shipments Qty",
      icon: Ship,
      color: "text-blue-700 bg-blue-100 border-blue-200",
      bgCard: "bg-blue-50/30 border-blue-200/70",
    },
    isOverAllocated
      ? {
          title: "Over Allocated",
          value: `${Number(overAllocatedQty).toLocaleString("en-IN", { minimumFractionDigits: 2 })} MT`,
          subtitle: `Exceeds Available by ${Number(overAllocatedQty).toLocaleString("en-IN", { minimumFractionDigits: 2 })} MT`,
          icon: AlertTriangle,
          color: "text-red-700 bg-red-100 border-red-300",
          bgCard: "bg-red-50 border-red-300 ring-2 ring-red-500/20",
          isCritical: true,
        }
      : {
          title: "Remaining Balance",
          value: `${Number(remainingBalance).toLocaleString("en-IN", { minimumFractionDigits: 2 })} MT`,
          subtitle: "Unallocated Balance",
          icon: Scale,
          color: "text-emerald-700 bg-emerald-100 border-emerald-200",
          bgCard: "bg-emerald-50/40 border-emerald-200/80",
        },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      {/* Section Header */}
      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-6 w-6 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Scale className="h-3.5 w-3.5 text-[#007aff]" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Purchase Allocation Summary
            </h2>
          </div>
        </div>

        {isOverAllocated ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-300 animate-pulse">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Over Allocated by {Number(overAllocatedQty).toLocaleString("en-IN", { minimumFractionDigits: 2 })} MT</span>
          </span>
        ) : (
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-100 font-mono">
            Allocation Status: Normal ({Number(remainingBalance).toLocaleString("en-IN", { minimumFractionDigits: 2 })} MT Remaining)
          </span>
        )}
      </div>

      {/* Cards Grid */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition-all ${card.bgCard}`}
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600 truncate">
                  {card.title}
                </span>
                <div className={`p-1 rounded-lg border ${card.color}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>
              <div className={`text-base font-extrabold font-mono tracking-tight ${card.isCritical ? "text-red-700" : "text-gray-900"}`}>
                {card.value}
              </div>
              <div className="text-[10px] text-gray-500 font-medium truncate mt-0.5">
                {card.subtitle}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
