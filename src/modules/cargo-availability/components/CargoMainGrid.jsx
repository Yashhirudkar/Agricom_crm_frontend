"use client";
import React from "react";
import {
  FileText,
  Boxes,
  Layers,
  ChevronRight,
  User,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  Eye,
} from "lucide-react";

export default function CargoMainGrid({
  data = [],
  isLoading = false,
  onOpenReadinessModal,
  onOpenAllocationModal,
  onSelectRecord,
  onSortBusinessReference,
}) {
  // Helper to ensure single, accurate business status
  const getRowBusinessStatus = (row) => {
    if (
      row.status &&
      [
        "Not Ready",
        "Ready",
        "Partially Allocated",
        "Fully Allocated",
        "Loading",
        "Dispatched",
        "Completed",
      ].includes(row.status)
    ) {
      return row.status;
    }

    const isReady =
      row.isReady ||
      row.status === "Ready" ||
      row.status === "Allocated" ||
      row.status === "Dispatched" ||
      row.status === "Completed" ||
      Number(row.readyQty || 0) > 0;

    if (!isReady) return "Not Ready";

    const trucksCount = Number(row.noOfTrucks || 0);
    const loadedQty = Number(row.loadedQty || 0);
    const dispatchedQty = Number(row.dispatchedQty || 0);
    const allocatedQty = Number(row.allocatedQty || 0);
    const readyQty = Number(row.readyQty || row.purchaseQty || 0);
    const purchaseQty = Number(row.purchaseQty || 0);

    if (loadedQty >= purchaseQty && purchaseQty > 0 && trucksCount > 0) return "Completed";
    if (
      dispatchedQty > 0 &&
      (dispatchedQty >= purchaseQty || (allocatedQty > 0 && dispatchedQty >= allocatedQty))
    )
      return "Dispatched";
    if (trucksCount > 0) return "Loading";
    if (allocatedQty >= readyQty && readyQty > 0) return "Fully Allocated";
    if (allocatedQty > 0 && allocatedQty < readyQty) return "Partially Allocated";
    return "Ready";
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Ready":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            Ready
          </span>
        );
      case "Partially Allocated":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Layers className="h-3 w-3 text-blue-600" />
            Partially Allocated
          </span>
        );
      case "Fully Allocated":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <Layers className="h-3 w-3 text-purple-600" />
            Fully Allocated
          </span>
        );
      case "Loading":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Truck className="h-3 w-3 text-indigo-600" />
            Loading
          </span>
        );
      case "Dispatched":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
            Dispatched
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <CheckCircle2 className="h-3 w-3 text-slate-500" />
            Completed
          </span>
        );
      case "Not Ready":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="h-3 w-3 text-amber-600" />
            Not Ready
          </span>
        );
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
          Cargo availability records automatically sync when Purchase Contracts are created.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden font-sans">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Purchase Contract</th>
              <th className="py-3 px-4">
                {onSortBusinessReference ? (
                  <button
                    type="button"
                    onClick={onSortBusinessReference}
                    className="hover:text-gray-900 cursor-pointer"
                  >
                    Business Ref No.
                  </button>
                ) : (
                  "Business Ref No."
                )}
              </th>
              <th className="py-3 px-4">Supplier & Buyer</th>
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4 text-right">Purchase Qty</th>
              <th className="py-3 px-4 text-right">Ready Qty</th>
              <th className="py-3 px-4 text-right">Allocated Qty</th>
              <th className="py-3 px-4 text-right">Available Cargo</th>
              <th className="py-3 px-4 text-right">Loaded / Dispatched</th>
              <th className="py-3 px-4">Business Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {data.map((row) => {
              const contract = row.purchaseContract || {};
              const product = row.product || {};
              const supplier = contract.seller?.entityName || "—";
              const buyer = contract.buyer?.entityName || "—";
              const contractNo =
                contract.contractNumber || `PC-${contract.id || row.purchaseContractId}`;
              const businessStatus = getRowBusinessStatus(row);

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

                  <td className="py-3 px-4 font-mono font-semibold text-indigo-700 whitespace-nowrap">
                    {row.businessReference ||
                      row.businessTransaction?.businessReference ||
                      contract.businessReference ||
                      "—"}
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
                      <span>
                        {product.name || row.purchaseContractItem?.productName || "Product"}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right font-bold text-gray-900 font-mono">
                    {Number(row.purchaseQty || 0).toLocaleString()} MT
                  </td>

                  <td className="py-3 px-4 text-right font-bold text-emerald-600 font-mono">
                    {Number(row.readyQty || 0).toLocaleString()} MT
                  </td>

                  <td className="py-3 px-4 text-right font-bold text-purple-600 font-mono">
                    {Number(row.allocatedQty || 0).toLocaleString()} MT
                  </td>

                  <td className="py-3 px-4 text-right font-bold text-cyan-600 font-mono">
                    {Number(row.availableQty || 0).toLocaleString()} MT
                  </td>

                  <td className="py-3 px-4 text-right font-mono text-[11px]">
                    <span className="text-indigo-600 font-bold">{row.loadedQty || 0} MT</span>
                    <span className="text-gray-400 px-1">/</span>
                    <span className="text-sky-600 font-bold">{row.dispatchedQty || 0} MT</span>
                  </td>

                  {/* Single Business Status Column */}
                  <td className="py-3 px-4">{getStatusBadge(businessStatus)}</td>

                  {/* Context-Aware Actions (No duplicate Ready button!) */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* 1. NOT READY -> Show "Set Ready" */}
                      {businessStatus === "Not Ready" && (
                        <button
                          onClick={() => onOpenReadinessModal(row)}
                          className="px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-colors cursor-pointer"
                          title="Confirm Cargo Readiness"
                        >
                          <Clock className="h-3.5 w-3.5 text-amber-600" />
                          <span>Set Ready</span>
                        </button>
                      )}

                      {/* 2. READY -> Show "Allocate" */}
                      {businessStatus === "Ready" && (
                        <button
                          onClick={() => onOpenAllocationModal(row)}
                          className="px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-colors cursor-pointer"
                          title="Allocate Cargo to Sales Shipment"
                        >
                          <Layers className="h-3.5 w-3.5" />
                          <span>Allocate</span>
                        </button>
                      )}

                      {/* 3. PARTIALLY ALLOCATED -> Show "Allocate More" and "View Allocation" */}
                      {businessStatus === "Partially Allocated" && (
                        <>
                          <button
                            onClick={() => onOpenAllocationModal(row)}
                            className="px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-colors cursor-pointer"
                            title={`Allocate remaining ${Number(row.availableQty || 0).toLocaleString()} MT`}
                          >
                            <Layers className="h-3.5 w-3.5" />
                            <span>Allocate More</span>
                          </button>
                          <button
                            onClick={() => onSelectRecord(row.id)}
                            className="px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
                            title="View Active Allocations"
                          >
                            <span>View Allocation</span>
                          </button>
                        </>
                      )}

                      {/* 4. FULLY ALLOCATED -> Hide Allocate button! Show "View Allocation" */}
                      {businessStatus === "Fully Allocated" && (
                        <button
                          onClick={() => onSelectRecord(row.id)}
                          className="px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-colors cursor-pointer"
                          title="View Allocation Details"
                        >
                          <Layers className="h-3.5 w-3.5" />
                          <span>View Allocation</span>
                        </button>
                      )}

                      {/* 5. LOADING -> Show "View Loading" */}
                      {businessStatus === "Loading" && (
                        <button
                          onClick={() => onSelectRecord(row.id)}
                          className="px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer"
                          title="View Truck Loading Execution"
                        >
                          <Truck className="h-3.5 w-3.5 text-indigo-600" />
                          <span>View Loading</span>
                        </button>
                      )}

                      {/* 6. DISPATCHED or COMPLETED -> Show "View Details" */}
                      {(businessStatus === "Dispatched" || businessStatus === "Completed") && (
                        <button
                          onClick={() => onSelectRecord(row.id)}
                          className="px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
                          title="View Full Shipment History"
                        >
                          <Eye className="h-3.5 w-3.5 text-slate-500" />
                          <span>View Details</span>
                        </button>
                      )}

                      {/* Standard Chevron */}
                      <button
                        onClick={() => onSelectRecord(row.id)}
                        className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                        title="Open Details Drawer"
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
