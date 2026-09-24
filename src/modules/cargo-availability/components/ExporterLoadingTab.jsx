"use client";
import React from "react";
import Link from "next/link";
import { Truck, Plus, AlertTriangle, ShieldCheck, FileText, ChevronRight, Ship } from "lucide-react";

export default function ExporterLoadingTab({
  loadingEntries = [],
  onOpenDrawer,
  onNewLoading,
}) {
  const getVarianceBadge = (level) => {
    switch (level) {
      case "Yellow Alert":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-50 text-yellow-700 border border-yellow-200">Yellow Alert (&gt;0.5%)</span>;
      case "Orange Alert":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-200">Orange Alert (&gt;1.0%)</span>;
      case "Red Claim Required":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 animate-pulse">Red Claim (&gt;2.0%)</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Normal (&lt;0.5%)</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
      case "Verified":
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">{status}</span>;
      case "Dispatched":
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">Dispatched</span>;
      case "Loading Started":
      case "Weighment In":
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">{status}</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200">{status || "Truck Arrived"}</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
      <div className="px-4 py-3 bg-gray-50/60 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-indigo-600" />
          <h3 className="text-xs font-bold text-gray-800">Exporter Loading Execution & Dispatch Records</h3>
        </div>
        <button
          onClick={onNewLoading}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Truck Loading</span>
        </button>
      </div>

      {!loadingEntries || loadingEntries.length === 0 ? (
        <div className="p-8 text-center text-gray-400">
          <Truck className="h-8 w-8 text-gray-300 mx-auto mb-2" />
          <h4 className="text-xs font-bold text-gray-700">No Truck Loading Records</h4>
          <p className="text-[11px] text-gray-400 mt-0.5">Click "+ New Truck Loading" to record truck arrival & loading execution.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-4">Loading Date</th>
                <th className="py-2.5 px-4">Truck & Transporter</th>
                <th className="py-2.5 px-4">Shipment Reference</th>
                <th className="py-2.5 px-4">Warehouse & Location</th>
                <th className="py-2.5 px-4 text-right">Loaded Qty</th>
                <th className="py-2.5 px-4 text-right">Unloaded Wt</th>
                <th className="py-2.5 px-4">Variance Audit</th>
                <th className="py-2.5 px-4">Stage Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {loadingEntries.map((row) => {
                const shipment = row.shipment || {};
                const shipRef = shipment.shipmentReference || (row.shipmentId ? `Shipment #${row.shipmentId}` : null);

                return (
                  <tr
                    key={row.id}
                    onClick={() => onOpenDrawer(row)}
                    className="hover:bg-indigo-50/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-bold text-gray-900">
                      {row.loadingDate ? new Date(row.loadingDate).toLocaleDateString("en-GB") : "—"}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-gray-900 flex items-center gap-1.5">
                        <Truck className="h-3.5 w-3.5 text-indigo-500" />
                        <span>{row.truckNo}</span>
                      </div>
                      <div className="text-[10px] text-gray-400">
                        Driver: {row.driverName || "—"} ({row.transporter || "—"})
                      </div>
                    </td>

                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <div className="font-mono font-bold text-indigo-600">
                          {shipRef || "—"}
                        </div>
                        {row.shipmentId && (
                          <Link
                            href={`/sales/shipments?search=${shipment.shipmentReference || row.shipmentId}`}
                            className="px-2 py-0.5 bg-blue-50 text-[#007aff] hover:bg-blue-100 border border-blue-200 rounded text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Open Linked Shipment"
                          >
                            <span>🚢 Shipment</span>
                          </Link>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-gray-800 font-semibold">{row.warehouseName || "Warehouse"}</div>
                      <div className="text-[10px] text-gray-400">Seal: {row.sealNumber || "—"}</div>
                    </td>

                    <td className="py-3 px-4 text-right font-bold text-indigo-700 text-sm">
                      {row.loadedQty || row.loadedWeight || 0} MT
                    </td>

                    <td className="py-3 px-4 text-right font-bold text-teal-600">
                      {row.unloadedWeight ? `${row.unloadedWeight} MT` : "—"}
                    </td>

                    <td className="py-3 px-4">
                      {getVarianceBadge(row.varianceLevel)}
                    </td>

                    <td className="py-3 px-4">
                      {getStatusBadge(row.status)}
                    </td>

                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onOpenDrawer(row)}
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded text-[11px] font-bold flex items-center gap-1 ml-auto transition-colors cursor-pointer border border-indigo-200/60"
                      >
                        <span>View / Edit</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

