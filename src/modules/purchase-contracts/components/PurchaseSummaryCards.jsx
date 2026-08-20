"use client";
import React from "react";
import {
  Ship,
  Scale,
  DollarSign,
  CheckCircle2,
  FileCheck,
  AlertTriangle,
  Clock,
} from "lucide-react";

export default function PurchaseSummaryCards({ summary, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 animate-pulse h-24" />
        ))}
      </div>
    );
  }

  const currency = summary?.contractInfo?.currency || "USD";
  const fin = summary?.financialSummary || {};
  const doc = summary?.documentSummary || {};
  const health = summary?.health || {};
  const time = summary?.timelineSummary || {};

  const cards = [
    {
      title: "Total Shipments",
      value: fin.shipmentCount ?? 0,
      unit: "shipment(s)",
      icon: Ship,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      title: "Total Quantity",
      value: Number(fin.totalQuantity || 0).toLocaleString("en-US", { minimumFractionDigits: 2 }),
      unit: "MT",
      icon: Scale,
      color: "text-purple-600 bg-purple-50 border-purple-100",
    },
    {
      title: "Contract Value",
      value: `${currency} ${Number(fin.contractValue || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      unit: "total value",
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      title: "Shipment Completion",
      value: `${health.shipmentCompletion ?? 0}%`,
      unit: "delivered",
      icon: CheckCircle2,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    },
    {
      title: "Document Completion",
      value: `${doc.completionPct ?? 100}%`,
      unit: `${doc.uploaded || 0}/${doc.total || 0} docs`,
      icon: FileCheck,
      color: "text-teal-600 bg-teal-50 border-teal-100",
    },
    {
      title: "Overdue Shipments",
      value: time.overdue ?? health.overdueCount ?? 0,
      unit: "delayed",
      icon: AlertTriangle,
      color: (time.overdue || 0) > 0 ? "text-red-600 bg-red-50 border-red-200" : "text-gray-600 bg-gray-50 border-gray-200",
    },
    {
      title: "Upcoming Shipments",
      value: time.upcoming ?? health.upcomingCount ?? 0,
      unit: "pending dispatch",
      icon: Clock,
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white border border-gray-200/70 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 truncate">
                {card.title}
              </span>
              <div className={`p-1.5 rounded-xl border ${card.color}`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
            </div>
            <div>
              <div className="text-base font-extrabold text-gray-900 font-mono tracking-tight">
                {card.value}
              </div>
              <div className="text-[10px] text-gray-400 font-medium truncate mt-0.5">
                {card.unit}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
