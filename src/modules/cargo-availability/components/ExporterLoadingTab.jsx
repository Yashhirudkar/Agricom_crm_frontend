"use client";
import React from "react";
import Link from "next/link";
import { Search, RotateCcw, Truck, Plus, ChevronRight } from "lucide-react";

export default function ExporterLoadingTab({
  loadingEntries = [],
  metrics = {},
  filters = {},
  error = "",
  onFilterChange,
  onResetFilters,
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
      case "Loading Completed":
      case "Stuffing Completed":
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">{status}</span>;
      case "Dispatched":
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">Dispatched</span>;
      case "Stuffing Started":
      case "Stuffing In Progress":
      case "Loading Started":
      case "Weighment In":
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">{status}</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200">{status || "Truck Arrived"}</span>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
        {[
          ["Stuffing Jobs", metrics.totalStuffingJobs],
          ["Pending", metrics.pending],
          ["In Progress", metrics.inProgress],
          ["Completed", metrics.completed],
          ["Today's Loading", `${Number(metrics.todaysLoading || 0).toFixed(2)} MT`],
          ["Loaded", `${Number(metrics.totalLoadedQuantity || 0).toFixed(2)} MT`],
          ["Remaining", `${Number(metrics.remainingQuantity || 0).toFixed(2)} MT`],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-xs">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</div>
            <div className="mt-1 text-sm font-bold text-slate-900">{value ?? 0}</div>
          </div>
        ))}
      </div>

      {error && (
        <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-xs">
        {[
          ["search", "Search shipment, buyer, seller, product"],
          ["businessReference", "Business Ref"],
          ["shipmentReference", "Shipment Ref"],
          ["buyer", "Buyer"],
          ["seller", "Seller"],
          ["product", "Product"],
        ].map(([key, placeholder]) => (
          <div key={key} className="relative">
            {key === "search" && <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />}
            <input
              value={filters[key] || ""}
              onChange={(event) => onFilterChange(key, event.target.value)}
              placeholder={placeholder}
              aria-label={placeholder}
              className={`w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-indigo-500 ${key === "search" ? "pl-8" : ""}`}
            />
          </div>
        ))}
        <select
          value={filters.status || ""}
          onChange={(event) => onFilterChange("status", event.target.value)}
          aria-label="Execution status"
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-indigo-500"
        >
          <option value="">All Statuses</option>
          {["Pending", "Ready", "Truck Arrived", "Weighment In", "Stuffing Started", "Loading Started", "Stuffing In Progress", "Stuffing Completed", "Loading Completed", "Weighment Out", "Ready For Dispatch", "Dispatched", "Reached Destination", "Unloaded", "Verified", "Completed"].map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <input type="date" aria-label="Loading date from" value={filters.dateFrom || ""} onChange={(event) => onFilterChange("dateFrom", event.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs" />
        <input type="date" aria-label="Loading date to" value={filters.dateTo || ""} onChange={(event) => onFilterChange("dateTo", event.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs" />
        <button type="button" onClick={onResetFilters} className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200">
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
      </div>

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
          <p className="text-[11px] text-gray-400 mt-0.5">Click &quot;+ New Truck Loading&quot; to record truck arrival &amp; loading execution.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-4">Loading Date</th>
                <th className="py-2.5 px-4">Truck & Transporter</th>
                <th className="py-2.5 px-4">Shipment Reference</th>
                <th className="py-2.5 px-4">Business Ref No.</th>
                <th className="py-2.5 px-4">Purchase Contract</th>
                <th className="py-2.5 px-4">Buyer / Seller</th>
                <th className="py-2.5 px-4">Product</th>
                <th className="py-2.5 px-4 text-right">Allocated Qty</th>
                <th className="py-2.5 px-4">Warehouse & Location</th>
                <th className="py-2.5 px-4 text-right">Loaded Qty</th>
                <th className="py-2.5 px-4 text-right">Remaining Qty</th>
                <th className="py-2.5 px-4 text-right">Unloaded Wt</th>
                <th className="py-2.5 px-4">Variance Audit</th>
                <th className="py-2.5 px-4">Stage Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {loadingEntries.map((row) => {
                const shipment = row.shipment || {};
                const contract = shipment.salesContract || {};
                const firstItem = contract.items?.[0] || {};
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
                        <span>{row.truckNo || "Truck pending"}</span>
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

                    <td className="py-3 px-4 font-mono font-semibold text-indigo-700 whitespace-nowrap">
                      {row.businessReference || row.businessTransaction?.businessReference || "—"}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-700">
                      {contract.purchaseContracts?.[0]?.contractNumber || "—"}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{contract.buyer?.entityName || "—"}</div>
                      <div className="text-[10px] text-slate-500">{contract.seller?.entityName || "—"}</div>
                    </td>
                    <td className="py-3 px-4">{firstItem.product?.name || "—"}</td>
                    <td className="py-3 px-4 text-right">
                      {Number(row.shipmentAllocation?.allocatedQty || 0).toFixed(2)} MT
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-800 font-semibold">{row.warehouseName || "Warehouse"}</div>
                      <div className="text-[10px] text-slate-500">Warehouse: {row.warehouseStatus || "Pending"}</div>
                      <div className="text-[10px] text-gray-400">Seal: {row.sealNumber || "—"}</div>
                    </td>

                    <td className="py-3 px-4 text-right font-bold text-indigo-700 text-sm">
                      {row.loadedQty || row.loadedWeight || 0} MT
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-700">
                      {Number(row.remainingQty || 0).toFixed(2)} MT
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
    </div>
  );
}
