"use client";
import React from "react";
import {
  Package,
  CheckCircle2,
  Layers,
  Boxes,
  Truck,
  Send,
  CheckCheck,
  Clock,
  AlertCircle,
  AlertTriangle,
  FileText,
} from "lucide-react";

export default function CargoDashboardKpis({ stats = {}, isLoading = false }) {
  const cards = [
    {
      title: "Total Purchase Qty",
      value: `${(stats.totalPurchaseQty || 0).toLocaleString()} MT`,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50 border-blue-100",
    },
    {
      title: "Ready Qty Pool",
      value: `${(stats.totalReadyQty || 0).toLocaleString()} MT`,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50 border-emerald-100",
    },
    {
      title: "Allocated Qty",
      value: `${(stats.totalAllocatedQty || 0).toLocaleString()} MT`,
      icon: Layers,
      color: "text-purple-600",
      bg: "bg-purple-50 border-purple-100",
    },
    {
      title: "Available Ready Stock",
      value: `${(stats.totalAvailableQty || 0).toLocaleString()} MT`,
      icon: Boxes,
      color: "text-cyan-600",
      bg: "bg-cyan-50 border-cyan-100",
    },
    {
      title: "Loaded Qty",
      value: `${(stats.totalLoadedQty || 0).toLocaleString()} MT`,
      icon: Truck,
      color: "text-indigo-600",
      bg: "bg-indigo-50 border-indigo-100",
    },
    {
      title: "Dispatched Qty",
      value: `${(stats.totalDispatchedQty || 0).toLocaleString()} MT`,
      icon: Send,
      color: "text-sky-600",
      bg: "bg-sky-50 border-sky-100",
    },
    {
      title: "Delivered Qty",
      value: `${(stats.totalDeliveredQty || 0).toLocaleString()} MT`,
      icon: CheckCheck,
      color: "text-teal-600",
      bg: "bg-teal-50 border-teal-100",
    },
    {
      title: "Pending Readiness",
      value: stats.pendingReadinessCount || 0,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-100",
    },
    {
      title: "Pending Trucks / Loading",
      value: stats.pendingTrucksCount || 0,
      icon: AlertCircle,
      color: "text-orange-600",
      bg: "bg-orange-50 border-orange-100",
    },
    {
      title: "Variance Alerts",
      value: stats.varianceAlertsCount || 0,
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50 border-red-100",
    },
    {
      title: "Trucks Loaded Today",
      value: stats.trucksLoadedToday || 0,
      icon: FileText,
      color: "text-slate-700",
      bg: "bg-slate-100 border-slate-200",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
        {Array.from({ length: 11 }).map((_, idx) => (
          <div key={idx} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white border border-gray-100 hover:border-gray-200 rounded-xl p-3.5 flex flex-col justify-between shadow-xs transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-gray-500 line-clamp-1">{card.title}</span>
              <div className={`p-1.5 rounded-lg border ${card.bg}`}>
                <Icon className={`h-3.5 w-3.5 ${card.color}`} />
              </div>
            </div>
            <div className="text-base font-bold text-gray-900 tracking-tight">{card.value}</div>
          </div>
        );
      })}
    </div>
  );
}
