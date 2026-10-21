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
      title: "Ready Cargo",
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
      title: "Available Cargo",
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
      title: "Not Ready Cargo",
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
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-20 bg-slate-100 rounded-xl animate-pulse border border-slate-200"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6 font-sans">
      {cards.slice(0, 6).map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="p-3.5 rounded-xl border border-slate-200/80 bg-white shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {c.title}
              </span>
              <div className={`p-1 rounded-md ${c.bg}`}>
                <Icon className={`h-3.5 w-3.5 ${c.color}`} />
              </div>
            </div>
            <div className="text-base font-extrabold text-slate-900 font-mono">
              {c.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
