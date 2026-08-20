"use client";
import React from "react";
import { DollarSign, Scale, Truck, RefreshCw, Layers, TrendingUp } from "lucide-react";

export default function PurchaseFinancialSummary({ summary, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse text-center">
        <DollarSign className="h-6 w-6 text-emerald-600 mx-auto mb-2 animate-bounce" />
        <span className="text-xs font-semibold text-gray-400">Loading financial totals...</span>
      </div>
    );
  }

  const currency = summary?.contractInfo?.currency || "USD";
  const fin = summary?.financialSummary || {};

  const metrics = [
    {
      label: "Total Executed Quantity",
      value: `${Number(fin.totalQuantity || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })} MT`,
      icon: Scale,
      color: "text-purple-600 bg-purple-50",
    },
    {
      label: "Avg Purchase Rate",
      value: `${currency} ${Number(fin.avgPurchaseRate || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Total Freight",
      value: `${currency} ${Number(fin.totalFreight || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: Truck,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Avg Forex Rate",
      value: `${Number(fin.avgForex || 0).toFixed(4)}`,
      icon: RefreshCw,
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      label: "Total Purchase Value",
      value: `${currency} ${Number(fin.contractValue || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: "text-teal-600 bg-teal-50",
    },
    {
      label: "Total Containers",
      value: `${fin.containerCount || 0} Containers`,
      icon: Layers,
      color: "text-amber-600 bg-amber-50",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      {/* Section Header */}
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
            <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Financial Summary</h2>
            <p className="text-[10px] text-gray-400">Total purchase commitments, rates, and container totals</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">
          {currency} Total
        </span>
      </div>

      {/* Grid Row */}
      <div className="p-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider truncate">
                  {m.label}
                </span>
                <div className={`p-1 rounded-lg ${m.color}`}>
                  <Icon className="h-3 w-3" />
                </div>
              </div>
              <div className="text-sm font-bold text-gray-900 font-mono tracking-tight truncate">
                {m.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
