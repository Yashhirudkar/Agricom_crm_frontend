"use client";
import React from "react";
import {
  FileText,
  Boxes,
  Plus,
  Layers,
  ChevronRight,
  User,
  Package,
} from "lucide-react";

export default function CargoMainGrid({
  data = [],
  isLoading = false,
  onOpenReadinessModal,
  onOpenAllocationModal,
  onSelectRecord,
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Ready Pool":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Ready Pool</span>;
      case "Allocated":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">Allocated</span>;
      case "Dispatched":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">Dispatched</span>;
      case "Completed":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200">Completed</span>;
      case "Partially Ready":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Partially Ready</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-50 text-gray-600 border border-gray-200">{status || "Pending"}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 font-medium">
        Loading Cargo Availability records...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <Boxes className="h-10 w-10 text-gray-300 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-gray-800">No Cargo Availability Records</h3>
        <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
          Cargo availability records automatically sync when Purchase Contracts are approved or saved.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Purchase Contract / Item</th>
              <th className="py-3 px-4">Supplier & Buyer</th>
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4 text-right">Purchase Qty</th>
              <th className="py-3 px-4 text-right">Ready Qty</th>
              <th className="py-3 px-4 text-right">Allocated Qty</th>
              <th className="py-3 px-4 text-right">Available Qty</th>
              <th className="py-3 px-4 text-right">Loaded / Dispatched</th>
              <th className="py-3 px-4 text-center">Entries</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {data.map((row) => {
              const contract = row.purchaseContract || {};
              const product = row.product || {};
              const supplier = contract.seller?.entityName || "—";
              const buyer = contract.buyer?.entityName || "—";
              const contractNo = contract.contractNumber || `PC-${contract.id || row.purchaseContractId}`;

              return (
                <tr key={row.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-gray-900 group-hover:text-[#007aff]">
                          {contractNo}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono">
                          Item #{row.purchaseContractItemId || row.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-gray-900 font-semibold">{supplier}</div>
                    <div className="text-[10px] text-gray-400 flex items-center gap-1">
                      <User className="h-3 w-3 text-gray-400" />
                      <span>{buyer}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-gray-800 flex items-center gap-1.5">
                      <Package className="h-3.5 w-3.5 text-amber-500" />
                      <span>{product.name || row.purchaseContractItem?.productName || "Product"}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right font-bold text-gray-900">
                    {row.purchaseQty} MT
                  </td>

                  <td className="py-3 px-4 text-right font-bold text-emerald-600">
                    {row.readyQty} MT
                  </td>

                  <td className="py-3 px-4 text-right font-bold text-purple-600">
                    {row.allocatedQty} MT
                  </td>

                  <td className="py-3 px-4 text-right font-bold text-cyan-600">
                    {row.availableQty} MT
                  </td>

                  <td className="py-3 px-4 text-right font-mono text-[11px]">
                    <span className="text-indigo-600 font-bold">{row.loadedQty} MT</span>
                    <span className="text-gray-400 px-1">/</span>
                    <span className="text-sky-600 font-bold">{row.dispatchedQty} MT</span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <div className="text-[11px] font-semibold text-gray-600">
                      {row.noOfReadinessEntries || 0} Readiness / {row.noOfTrucks || 0} Trucks
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    {getStatusBadge(row.status)}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpenReadinessModal(row)}
                        className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[11px] font-bold flex items-center gap-1 border border-emerald-200 transition-colors"
                        title="Add Readiness Entry"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Readiness</span>
                      </button>

                      <button
                        onClick={() => onOpenAllocationModal(row)}
                        className="px-2 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded text-[11px] font-bold flex items-center gap-1 border border-purple-200 transition-colors"
                        title="Allocate to Shipment"
                      >
                        <Layers className="h-3 w-3" />
                        <span>Allocate</span>
                      </button>

                      <button
                        onClick={() => onSelectRecord(row.id)}
                        className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
