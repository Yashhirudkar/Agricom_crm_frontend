import React, { useRef, useState } from "react";
import {
  Ship,
  User,
  Loader2,
  Check,
  Rocket,
  CheckCircle2,
  XCircle,
  Package,
  Copy,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { purchaseContractApi } from "@/modules/purchase-contracts/services/purchaseContractApi";
import { shipmentsApi } from "../services/shipmentsApi";

import ManualReadinessModal from "./ManualReadinessModal";
import ShipmentStuffingExecutionModal from "./ShipmentStuffingExecutionModal";
import ShipmentRefTooltip from "./ShipmentRefTooltip";

const getTimelineDisplay = (timeline = {}) => {
  const parsedDays = Number(timeline.days);
  const days = Number.isFinite(parsedDays)
    ? parsedDays
    : Number(timeline.daysRemaining);
  const isOverdue = timeline.type === "overdue" || (Number.isFinite(days) && days < 0);
  const dayCount = Number.isFinite(days)
    ? Math.abs(days)
    : Math.abs(Number(timeline.label?.match(/\d+/)?.[0] || 0));

  if (!Number.isFinite(days) && !timeline.label?.match(/\d+/)) {
    return {
      value: "—",
      className: "text-gray-500",
      title: timeline.label || "Timeline unavailable",
    };
  }

  if (isOverdue) {
    return {
      value: dayCount,
      className: "text-red-600",
      title: `Overdue by ${dayCount} days`,
    };
  }

  if (timeline.type === "today" || dayCount === 0) {
    return {
      value: 0,
      className: "text-green-600",
      title: "Due Today",
    };
  }

  return {
    value: dayCount,
    className: "text-green-600",
    title: `Due in ${dayCount} days`,
  };
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
  const [manualReadinessShipment, setManualReadinessShipment] = useState(null);
  const [stuffingShipment, setStuffingShipment] = useState(null);
  const [executingId, setExecutingId] = useState(null);
  const [executedShipmentIds, setExecutedShipmentIds] = useState(new Set());
  const tableScrollRef = useRef(null);

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

  const handleCopyBusinessReference = async (e, reference) => {
    e.stopPropagation();
    if (!reference || reference === "—") return;

    try {
      await navigator.clipboard.writeText(reference);
      toast.success("Business reference copied");
    } catch (error) {
      console.error("Failed to copy business reference", error);
      toast.error("Unable to copy business reference");
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

  const handleExecuteShipment = (e, s) => {
    e.stopPropagation();
    if (!s.cargoReady || !s.freightReady || !s.readyForShipment) return;
    setStuffingShipment(s);
  };

  const handleFreightClick = (e, s) => {
    e.stopPropagation();
    const isFreightNotApplicable =
      s.isFreightNotApplicable ||
      s.freightAllocationStatus === "Not Applicable" ||
      s.salesContract?.shipmentType?.purchaseContractDeliveryPlaceRequired === false;
    if (isFreightNotApplicable) return;
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
        params.set("shipmentId", String(s.id));
        if (s.shipmentReference) params.set("shipmentRef", s.shipmentReference);
        params.set("from", "shipments");
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
      params.set("shipmentId", String(s.id));
      if (s.shipmentReference) params.set("shipmentRef", s.shipmentReference);
      params.set("from", "shipments");
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
      <div className="shipment-table-shell flex min-h-0 flex-1 w-full min-w-0 flex-col">
        <div
          ref={tableScrollRef}
          className="shipment-table-wrapper min-h-0 flex-1 w-full min-w-0 overflow-x-auto overflow-y-auto overscroll-contain"
          style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "thin" }}
        >
        <table className="shipment-table w-full table-auto whitespace-nowrap text-sm text-left border-collapse">
          <colgroup>
            <col style={{ width: "40px" }} />
            <col style={{ width: "130px" }} />
            <col style={{ width: "80px" }} />
            <col style={{ width: "120px" }} />
            <col style={{ width: "160px" }} />
            <col style={{ width: "180px" }} />
            <col style={{ width: "160px" }} />
            <col style={{ width: "70px" }} />
            <col style={{ width: "120px" }} />
            <col style={{ width: "120px" }} />
            <col style={{ width: "120px" }} />
          </colgroup>
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
              <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3 w-12 text-center">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={shipments.length > 0 && selectedShipments.length === shipments.length}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                />
              </th>
              <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3 whitespace-nowrap">
                {onSortBusinessReference ? (
                  <button type="button" onClick={onSortBusinessReference} className="hover:text-blue-600 font-medium">
                    Business Ref No.
                  </button>
                ) : (
                  "Business Ref No."
                )}
              </th>
              <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3 text-center whitespace-nowrap">Timeline (Days)</th>
              <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3 whitespace-nowrap">Shipment Date</th>
              <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3 whitespace-nowrap">Buyer</th>
              <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3 whitespace-nowrap">Supplier</th>
              <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3 whitespace-nowrap">Commodity</th>
              <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3 text-center whitespace-nowrap">Qty (MT)</th>
              <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3 text-center whitespace-nowrap">Cargo Allocation</th>
              <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3 text-center whitespace-nowrap">Freight Allocation</th>
              <th className="sticky top-0 z-10 bg-gray-50 px-3 py-3 text-right whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {shipments.map((s) => {
              const contract = s.salesContract || {};
              const buyer = contract.buyer || {};
              const seller = contract.seller || {};
              const timelineObj = s.timeline || {};
              const timelineDisplay = getTimelineDisplay(timelineObj);

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
              const allocationsReady = Boolean(s.cargoReady && s.freightReady);
              const canExecute = allocationsReady && s.readyForShipment;

              return (
                <tr
                  key={s.id}
                  onClick={() => onRowClick(s)}
                  className={`hover:bg-gray-50 transition-colors cursor-pointer ${isSelected ? "bg-blue-50/50" : ""
                    }`}
                >
                  {/* Checkbox */}
                  <td className="px-3 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleSelectOne(e, s.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                    />
                  </td>

                  {/* Business Ref */}
                  <td className="px-3 py-3 font-medium text-blue-600 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <ShipmentRefTooltip shipment={s}>
                        <span className="hover:underline cursor-pointer">
                          {s.businessReference || s.businessTransaction?.businessReference || "—"}
                        </span>
                      </ShipmentRefTooltip>
                      {(s.businessReference || s.businessTransaction?.businessReference) && (
                        <button
                          type="button"
                          onClick={(e) => handleCopyBusinessReference(
                            e,
                            s.businessReference || s.businessTransaction?.businessReference,
                          )}
                          className="text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                          title="Copy business reference"
                          aria-label="Copy business reference"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Timeline */}
                  <td className="px-3 py-3 text-center whitespace-nowrap">
                    <div className="flex flex-col items-center gap-1">
                      <span
                        title={timelineDisplay.title}
                        className={`text-sm font-semibold ${timelineDisplay.className}`}
                      >
                        {timelineDisplay.value}
                      </span>
                      {s.executionStatus && (
                        <span className="text-[10px] font-semibold text-indigo-700">
                          {s.executionStatus}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Shipment Date */}
                  <td className="px-3 py-3 text-gray-600 whitespace-nowrap">
                    {s.shipmentDate
                      ? new Date(s.shipmentDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      : "â€”"}
                  </td>

                  {/* Buyer */}
                  <td className="px-3 py-3 whitespace-nowrap text-gray-900 font-medium" onClick={(e) => e.stopPropagation()}>
                    {buyer.entityName ? (
                      buyer.id ? (
                        <button
                          onClick={() => router.push(`/masters/partners?partnerId=${buyer.id}`)}
                          className="group relative max-w-full hover:text-blue-600 hover:underline flex items-center gap-1.5"
                        >
                          <User className="h-4 w-4 text-gray-400 shrink-0" />
                          <span className="min-w-0 max-w-[112px] truncate">{buyer.entityName}</span>
                          <span className="pointer-events-none invisible absolute left-0 top-full z-30 mt-1 max-w-xs whitespace-normal rounded-md bg-white px-2.5 py-1.5 text-xs font-normal text-gray-700 opacity-0 shadow-lg ring-1 ring-gray-200 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 [transition-delay:200ms]">
                            {buyer.entityName}
                          </span>
                        </button>
                      ) : (
                        <span className="group relative flex max-w-full items-center gap-1.5 text-gray-900">
                          <User className="h-4 w-4 text-gray-400 shrink-0" />
                          <span className="min-w-0 max-w-[112px] truncate">{buyer.entityName}</span>
                          <span className="pointer-events-none invisible absolute left-0 top-full z-30 mt-1 max-w-xs whitespace-normal rounded-md bg-white px-2.5 py-1.5 text-xs font-normal text-gray-700 opacity-0 shadow-lg ring-1 ring-gray-200 transition-opacity group-hover:visible group-hover:opacity-100 [transition-delay:200ms]">
                            {buyer.entityName}
                          </span>
                        </span>
                      )
                    ) : (
                      "â€”"
                    )}
                  </td>

                  {/* Seller */}
                  <td className="group relative px-3 py-3 whitespace-nowrap text-gray-600">
                    <span className="block max-w-[124px] truncate">
                      {seller.entityName || "â€”"}
                    </span>
                    {seller.entityName && (
                      <span className="pointer-events-none invisible absolute left-3 top-full z-30 mt-1 max-w-xs whitespace-normal rounded-md bg-white px-2.5 py-1.5 text-xs text-gray-700 opacity-0 shadow-lg ring-1 ring-gray-200 transition-opacity group-hover:visible group-hover:opacity-100 [transition-delay:200ms]">
                        {seller.entityName}
                      </span>
                    )}
                  </td>

                  {/* Product */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    {productsList.length > 0 ? (
                      <div className="flex items-center gap-2 text-gray-700" title={primaryProduct}>
                        <Package className="h-4 w-4 text-gray-400" />
                        <span>{productDisplay}</span>
                      </div>
                    ) : (
                      "â€”"
                    )}
                  </td>

                  {/* Qty (MT) */}
                  <td className="px-3 py-3 text-center font-medium text-gray-900 whitespace-nowrap">
                    {s.quantity
                      ? (Number.isInteger(Number(s.quantity)) ? Number(s.quantity).toLocaleString("en-US") : Number(s.quantity).toLocaleString("en-US", { minimumFractionDigits: 2 }))
                      : "0"}
                  </td>

                  {/* Cargo Allocation Column */}
                  <td className="px-3 py-3 whitespace-nowrap text-center" onClick={(e) => e.stopPropagation()}>
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
                  <td className="px-3 py-3 whitespace-nowrap text-center" onClick={(e) => e.stopPropagation()}>
                    {(() => {
                      const isFreightNotApplicable =
                        s.isFreightNotApplicable ||
                        s.freightAllocationStatus === "Not Applicable" ||
                        s.salesContract?.shipmentType?.purchaseContractDeliveryPlaceRequired === false;

                      if (isFreightNotApplicable) {
                        return (
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium bg-slate-100 text-slate-600 border-slate-200 cursor-not-allowed shadow-2xs"
                            title="Freight Allocation is automatically Yes for this Shipment Type (configured in Shipment Type Master)"
                          >
                            Yes
                          </span>
                        );
                      }

                      return (
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
                      );
                    })()}
                  </td>

                  {/* Actions - Execute Stuffing Form & Readiness Control */}
                  <td className="px-3 py-3 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
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
                          disabled={!canExecute}
                          title={
                            !allocationsReady
                              ? "Complete Cargo & Freight Allocation first"
                              : getExecuteDisabledTooltip(s)
                          }
                          onClick={(e) => handleExecuteShipment(e, s)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors shadow-xs ${
                            canExecute
                              ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm cursor-pointer"
                              : "bg-gray-100 text-gray-400 border border-gray-200 opacity-60 cursor-not-allowed"
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