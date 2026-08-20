"use client";
import React from "react";
import {
  DollarSign,
  Scale,
  Truck,
  RefreshCw,
  FileSpreadsheet,
  Layers,
  Ship,
  TrendingUp,
} from "lucide-react";

export default function PurchaseFinance({ summary, shipments = [], loading }) {
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center animate-pulse">
        <DollarSign className="h-8 w-8 text-emerald-500 mx-auto mb-2 animate-bounce" />
        <span className="text-xs font-semibold text-gray-500">Loading financial aggregation...</span>
      </div>
    );
  }

  const currency = summary?.contractInfo?.currency || "USD";
  const fin = summary?.financialSummary || {};

  const cards = [
    {
      title: "Total Quantity",
      value: `${Number(fin.totalQuantity || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })} MT`,
      icon: Scale,
      color: "text-purple-600 bg-purple-50 border-purple-100",
    },
    {
      title: "Average Purchase Rate",
      value: `${currency} ${Number(fin.avgPurchaseRate || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })} / MT`,
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      title: "Average Freight",
      value: `${currency} ${Number(fin.avgFreight || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: Truck,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      title: "Average Forex",
      value: `${Number(fin.avgForex || 0).toFixed(4)}`,
      icon: RefreshCw,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    },
    {
      title: "Contract Value",
      value: `${currency} ${Number(fin.contractValue || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: "text-teal-600 bg-teal-50 border-teal-100",
    },
    {
      title: "Shipment Count",
      value: `${fin.shipmentCount || 0} Shipments`,
      icon: Ship,
      color: "text-slate-700 bg-slate-100 border-slate-200",
    },
    {
      title: "Container Count",
      value: `${fin.containerCount || 0} Containers`,
      icon: Layers,
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 7 Financial Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {cards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 truncate">
                  {c.title}
                </span>
                <div className={`p-1 rounded-lg border ${c.color}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>
              <div className="text-sm font-extrabold text-gray-900 font-mono tracking-tight truncate">
                {c.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Per-Shipment Financial Breakdown Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            Financial Breakdown by Shipment
          </h3>
          <span className="text-[10px] text-gray-400 font-semibold uppercase">
            Live Database Aggregation
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[9px]">
                <th className="px-4 py-3">Shipment Ref</th>
                <th className="px-4 py-3 text-right">Quantity (MT)</th>
                <th className="px-4 py-3 text-right">Purchase Rate</th>
                <th className="px-4 py-3 text-right">Freight</th>
                <th className="px-4 py-3 text-right">Forex Rate</th>
                <th className="px-4 py-3 text-right">Subtotal Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {shipments.map((s) => {
                const qty = Number(s.quantity || 0);
                const rate = Number(s.purchaseRate || 0);
                const val = qty * rate;
                return (
                  <tr key={s.linkId || s.shipmentId} className="hover:bg-emerald-50/20 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-gray-900">
                      {s.shipmentReference || `Shipment #${s.shipmentNo}`}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-gray-800">
                      {qty.toLocaleString("en-US", { minimumFractionDigits: 2 })} MT
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-gray-700">
                      {currency} {rate.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-gray-600">
                      {s.freight ? `${currency} ${Number(s.freight).toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-gray-600">
                      {s.forex ? Number(s.forex).toFixed(4) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-extrabold text-emerald-700">
                      {currency} {val.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}

              {shipments.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400 italic">
                    No linked shipments for financial breakdown.
                  </td>
                </tr>
              )}
            </tbody>
            {shipments.length > 0 && (
              <tfoot>
                <tr className="bg-slate-50 font-bold border-t-2 border-slate-200 text-gray-900">
                  <td className="px-4 py-3 text-left">TOTAL AGGREGATED</td>
                  <td className="px-4 py-3 text-right font-mono">
                    {Number(fin.totalQuantity || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })} MT
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-gray-600">
                    AVG: {currency} {Number(fin.avgPurchaseRate || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-gray-600">
                    TOT: {currency} {Number(fin.totalFreight || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-gray-600">
                    AVG: {Number(fin.avgForex || 0).toFixed(4)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-emerald-700">
                    {currency} {Number(fin.contractValue || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
