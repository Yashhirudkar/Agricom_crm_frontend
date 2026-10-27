import React, { useState } from "react";
import {
  Ship,
  Clipboard,
  User,
  Loader2,
  Check,
  Rocket,
  CheckCircle2,
  XCircle,
  Package,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { purchaseContractApi } from "@/modules/purchase-contracts/services/purchaseContractApi";
import { shipmentsApi } from "../services/shipmentsApi";

import ManualReadinessModal from "./ManualReadinessModal";
import ShipmentStuffingExecutionModal from "./ShipmentStuffingExecutionModal";

// Standardized Timeline Color Map
const TIMELINE_STYLES = {
  today: "bg-green-100 text-green-800 border-green-200",
  tomorrow: "bg-blue-100 text-blue-800 border-blue-200",
  upcoming: "bg-indigo-100 text-indigo-800 border-indigo-200",
  overdue: "bg-red-100 text-red-800 border-red-200",
  completed: "bg-gray-100 text-gray-800 border-gray-200",
  cancelled: "bg-gray-100 text-gray-500 border-gray-200",
};

// Dynamic Tooltip Reason Helper for Shipment Readiness
const getExecuteDisabledTooltip = (shipment) => {
  if (shipment?.readyForShipment) {
    return "Execute Shipment Stuffing";
  }
  if (shipment?.isManualOverride && shipment?.manualReadyOverride === false) {
    return shipment.manualReadyReason
      ? `Blocked by manual override: ${shipment.manualReadyReason}`
      : "Blocked by manual override.";
  }
  const cargoPending = !shipment?.cargoReady;
  const freightPending = !shipment?.freightReady;

  if (cargoPending && freightPending) {
    return "Cargo and Freight allocations are pending.";
  }
  if (cargoPending) {
    return "Cargo allocation is pending.";
  }
  if (freightPending) {
    return "Freight allocation is pending.";
  }
  return "Shipment is not ready for execution.";
};

export default function ShipmentsTable({
  onRefresh,
  shipments,
  loading,
  onRowClick,
  onSortBusinessReference,
  onViewContract,
  onEditShipment,
  onManageDocuments,
  onPrintShipment,
  onExecutePurchase,
  onOpenCargoDrawer,
  onOpenFreightDrawer,
  selectedShipments = [],
  setSelectedShipments,
}) {
  const router = useRouter();
  const [copiedId, setCopiedId] = useState(null);
  const [manualReadinessShipment, setManualReadinessShipment] = useState(null);
  const [stuffingShipment, setStuffingShipment] = useState(null);
  const [executingId, setExecutingId] = useState(null);
  const [executedShipmentIds, setExecutedShipmentIds] = useState(new Set());

  const handleCopy = (e, text, id) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedShipments(shipments.map((s) => s.id));
    } else {
      setSelectedShipments([]);
    }
  };

  const handleSelectOne = (e, id) => {
    e.stopPropagation();
    if (e.target.checked) {
      setSelectedShipments((prev) => [...prev, id]);
    } else {
      setSelectedShipments((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleCargoClick = (e, s) => {
    e.stopPropagation();
    console.log("[ShipmentsTable] handleCargoClick triggered for shipment:", {
      id: s.id,
      shipmentReference: s.shipmentReference,
      cargoReady: s.cargoReady,
      contractType: s.salesContract?.contractType,
    });
    if (onOpenCargoDrawer) {
      onOpenCargoDrawer(s);
    }
  };

  const handleFreightClick = (e, s) => {
    e.stopPropagation();
    if (s.freightReady) {
      // IF status == YES -> Open Freight Allocation details directly on the Shipment page
      if (onOpenFreightDrawer) {
        onOpenFreightDrawer(s);
      } else {
        const searchVal =
          s.businessReference ||
          s.businessTransaction?.businessReference ||
          s.shipmentReference ||
          "";
        const params = new URLSearchParams();
        if (searchVal) {
          params.set("search", searchVal);
          params.set("businessRef", searchVal);
        }
        if (s.logisticsId) {
          params.set("logisticsId", String(s.logisticsId));
        }
        if (s.salesContract?.enquiryId) {
          params.set("enquiryId", String(s.salesContract.enquiryId));
        }
        params.set("openDrawer", "true");
        router.push(`/logistics/transport-management?${params.toString()}`);
      }
    } else {
      // IF status == NO -> Redirect directly with openDrawer=true so TransportDrawer opens automatically
      const searchVal =
        s.businessReference ||
        s.businessTransaction?.businessReference ||
        s.shipmentReference ||
        "";
      const params = new URLSearchParams();
      if (searchVal) {
        params.set("search", searchVal);
        params.set("businessRef", searchVal);
      }
      if (s.logisticsId) {
        params.set("logisticsId", String(s.logisticsId));
      }
      if (s.salesContract?.enquiryId) {
        params.set("enquiryId", String(s.salesContract.enquiryId));
      }
      params.set("openDrawer", "true");
      router.push(`/logistics/transport-management?${params.toString()}`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-500 gap-3 bg-white">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        <span className="text-sm font-medium">Loading shipments registry...</span>
      </div>
    );
  }

  if (shipments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-3 bg-white">
        <Ship className="h-12 w-12 text-gray-300 stroke-[1.5]" />
        <span className="text-sm font-medium text-gray-700">No shipments found</span>
        <span className="text-sm text-gray-500 max-w-sm text-center">
          No records match the current filters. Modify your search criteria or add shipments to Sales Contracts.
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
              <th className="px-4 py-3 w-12 text-center">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={shipments.length > 0 && selectedShipments.length === shipments.length}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                />
              </th>
              <th className="px-4 py-3 whitespace-nowrap">Shipment Ref</th>
              <th className="px-4 py-3 whitespace-nowrap">
                {onSortBusinessReference ? (
                  <button type="button" onClick={onSortBusinessReference} className="hover:text-blue-600 font-medium">
                    Business Ref No.
                  </button>
                ) : (
                  "Business Ref No."
                )}
              </th>
              <th className="px-4 py-3 whitespace-nowrap">Timeline</th>
              <th className="px-4 py-3 whitespace-nowrap">Shipment Date</th>
              <th className="px-4 py-3 whitespace-nowrap">Buyer</th>
              <th className="px-4 py-3 whitespace-nowrap">Seller</th>
              <th className="px-4 py-3 whitespace-nowrap">Product</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">Qty (MT)</th>
              <th className="px-4 py-3 text-center whitespace-nowrap">Cargo Allocation</th>
              <th className="px-4 py-3 text-center whitespace-nowrap">Freight Allocation</th>
              <th className="px-4 py-3 text-right whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {shipments.map((s) => {
              const contract = s.salesContract || {};
              const buyer = contract.buyer || {};
              const seller = contract.seller || {};
              const timelineObj = s.timeline || {};

              const productsList = s.products || [];
              const primaryProduct = productsList[0]?.name || "â€”";
              const productDisplay =
                productsList.length > 1
                  ? `${primaryProduct} + ${productsList.length - 1} more`
                  : primaryProduct;

              const isSelected = selectedShipments.includes(s.id);
              // Show "Stuffed / Executed" button ONLY when stuffing is actually Completed
              // stuffingCompleted = backend sets this true only when stuffingStatus === 'Completed'
              // If shipment is Executed but stuffing is Pending/Draft → show "Execute" button instead
              const isExecuted =
                s.stuffingCompleted === true ||
                executedShipmentIds.has(s.id);

              return (
                <tr
                  key={s.id}
                  onClick={() => onRowClick(s)}
                  className={`hover:bg-gray-50 transition-colors cursor-pointer ${isSelected ? "bg-blue-50/50" : ""
                    }`}
                >
                  {/* Checkbox */}
                  <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleSelectOne(e, s.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                    />
                  </td>

                  {/* Shipment Ref */}
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap group">
                    <div className="flex items-center gap-2">
                      <span title={s.shipmentReference || ""}>
                        {s.shipmentReference
                          ? s.shipmentReference.length > 8
                            ? `${s.shipmentReference.slice(0, 8)}...`
                            : s.shipmentReference
                          : "â€”"}
                      </span>
                      {s.shipmentReference && (
                        <button
                          onClick={(e) => handleCopy(e, s.shipmentReference, `ref-${s.id}`)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-700 transition-opacity"
                          title="Copy Reference"
                        >
                          {copiedId === `ref-${s.id}` ? (
                            <Check className="h-3.5 w-3.5 text-green-600" />
                          ) : (
                            <Clipboard className="h-3.5 w-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Business Ref */}
                  <td className="px-4 py-3 font-medium text-blue-600 whitespace-nowrap">
                    {s.businessReference || s.businessTransaction?.businessReference || "â€”"}
                  </td>

                  {/* Timeline */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex flex-col items-start gap-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-xs font-medium capitalize ${TIMELINE_STYLES[timelineObj.type] || "bg-gray-100 text-gray-700 border-gray-200"
                          }`}
                      >
                        {timelineObj.label || "Unknown"}
                      </span>
                      {s.executionStatus && (
                        <span className="text-[10px] font-semibold text-indigo-700">
                          {s.executionStatus}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Shipment Date */}
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {s.shipmentDate
                      ? new Date(s.shipmentDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      : "â€”"}
                  </td>

                  {/* Buyer */}
                  <td className="px-4 py-3 whitespace-nowrap text-gray-900 font-medium" onClick={(e) => e.stopPropagation()}>
                    {buyer.entityName ? (
                      buyer.id ? (
                        <button
                          onClick={() => router.push(`/masters/partners?partnerId=${buyer.id}`)}
                          className="hover:text-blue-600 hover:underline flex items-center gap-1.5"
                          title={buyer.entityName}
                        >
                          <User className="h-4 w-4 text-gray-400 shrink-0" />
                          <span>
                            {buyer.entityName.length > 10
                              ? `${buyer.entityName.slice(0, 10)}...`
                              : buyer.entityName}
                          </span>
                        </button>
                      ) : (
                        <span className="flex items-center gap-1.5 text-gray-900" title={buyer.entityName}>
                          <User className="h-4 w-4 text-gray-400 shrink-0" />
                          <span>
                            {buyer.entityName.length > 10
                              ? `${buyer.entityName.slice(0, 10)}...`
                              : buyer.entityName}
                          </span>
                        </span>
                      )
                    ) : (
                      "â€”"
                    )}
                  </td>

                  {/* Seller */}
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600" title={seller.entityName || ""}>
                    {seller.entityName || "â€”"}
                  </td>

                  {/* Product */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {productsList.length > 0 ? (
                      <div className="flex items-center gap-2 text-gray-700" title={primaryProduct}>
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="truncate max-w-[150px]">{productDisplay}</span>
                      </div>
                    ) : (
                      "â€”"
                    )}
                  </td>

                  {/* Qty (MT) */}
                  <td className="px-4 py-3 text-right font-medium text-gray-900 whitespace-nowrap">
                    {s.quantity
                      ? (Number.isInteger(Number(s.quantity)) ? Number(s.quantity).toLocaleString("en-US") : Number(s.quantity).toLocaleString("en-US", { minimumFractionDigits: 2 }))
                      : "0"}
                  </td>

                  {/* Cargo Allocation Column */}
                  <td className="px-4 py-3 whitespace-nowrap text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={(e) => handleCargoClick(e, s)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium transition-all cursor-pointer shadow-2xs hover:shadow-xs hover:scale-105 active:scale-95 ${s.cargoReady
                        ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:border-green-300"
                        : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:border-red-300"
                        }`}
                      title={
                        s.cargoReady
                          ? "Cargo Allocated. Click to view Cargo Allocation details."
                          : "Cargo Not Allocated. Click to allocate cargo."
                      }
                    >
                      {s.cargoReady ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-red-600" />
                      )}
                      <span>{s.cargoReady ? "Yes" : "No"}</span>
                    </button>
                  </td>

                  {/* Freight Allocation Column */}
                  <td className="px-4 py-3 whitespace-nowrap text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={(e) => handleFreightClick(e, s)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium transition-all cursor-pointer shadow-2xs hover:shadow-xs hover:scale-105 active:scale-95 ${s.freightReady
                        ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:border-green-300"
                        : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:border-red-300"
                        }`}
                      title={
                        s.freightReady
                          ? "Freight Allocated. Click to view Freight Allocation details."
                          : "Freight Not Allocated. Click to complete freight allocation."
                      }
                    >
                      {s.freightReady ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-red-600" />
                      )}
                      <span>{s.freightReady ? "Yes" : "No"}</span>
                    </button>
                  </td>

                  {/* Actions - Execute Stuffing Form & Readiness Control */}
                  <td className="px-4 py-3 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Shipment Readiness Control (Manual Override) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setManualReadinessShipment(s);
                        }}
                        className={`inline-flex items-center gap-1 px-2 py-1.5 rounded-md border text-xs font-medium transition-all cursor-pointer ${s.isManualOverride
                            ? s.manualReadyOverride
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                              : "bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100"
                            : "bg-white text-gray-500 hover:text-gray-800 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                          }`}
                        title={
                          s.isManualOverride
                            ? `Manual Override active: ${s.manualReadyOverride ? "Force Ready" : "Block Execution"}. Click to change.`
                            : "Shipment Readiness Control (Manual Override)"
                        }
                      >
                        <ShieldCheck className={`h-3.5 w-3.5 ${s.isManualOverride ? (s.manualReadyOverride ? "text-emerald-600" : "text-rose-600") : "text-gray-400"}`} />
                        {s.isManualOverride && (
                          <span className="text-[10px] font-bold">
                            {s.manualReadyOverride ? "Override" : "Blocked"}
                          </span>
                        )}
                      </button>

                      {/* Execute Button */}
                      {isExecuted ? (
                        <button
                          type="button"
                          title="Shipment executed. Click to view or edit Stuffing Execution."
                          onClick={(e) => {
                            e.stopPropagation();
                            setStuffingShipment(s);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 shadow-xs transition-colors cursor-pointer"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Stuffed / Executed</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={!s.readyForShipment}
                          title={getExecuteDisabledTooltip(s)}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!s.readyForShipment) return;
                            setStuffingShipment(s);
                          }}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors shadow-xs ${s.readyForShipment
                            ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm cursor-pointer"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                        >
                          <Rocket className="h-3.5 w-3.5" />
                          <span>Execute</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ManualReadinessModal
        isOpen={!!manualReadinessShipment}
        shipment={manualReadinessShipment}
        onClose={() => setManualReadinessShipment(null)}
        onSaveSuccess={() => {
          setManualReadinessShipment(null);
          if (onRefresh) onRefresh();
        }}
      />

      {/* Shipment Stuffing Execution Modal */}
      {stuffingShipment && (
        <ShipmentStuffingExecutionModal
          isOpen={!!stuffingShipment}
          shipment={stuffingShipment}
          onClose={() => setStuffingShipment(null)}
          onSaveSuccess={() => {
            setStuffingShipment(null);
            if (onRefresh) onRefresh();
          }}
        />
      )}
    </>
  );
}