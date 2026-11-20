"use client";
import React, { useState, useEffect } from "react";
import {
  X,
  Truck,
  CheckCircle2,
  FileText,
  Building2,
  Layers,
} from "lucide-react";
import { logisticsApi } from "@/modules/logistics/services/logisticsApi";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import {
  isFreightAllocatedForShipment,
  isFreightRequiredForShipment,
} from "../utils/freightRuleEngine";
import { normalizeTruckCapacity } from "@/modules/logistics/utils/truckCapacity";

export default function FreightAllocationDrawer({
  shipment,
  onClose,
}) {
  useEscapeKey(onClose, Boolean(shipment));

  const [logisticsDetails, setLogisticsDetails] = useState(null);

  const isFreightRequired = isFreightRequiredForShipment(shipment);
  const isFreightAllocated = isFreightAllocatedForShipment(shipment);

  useEffect(() => {
    if (!shipment || !isFreightRequired || !isFreightAllocated) return;

    logisticsApi
      .getShipmentWorkspace(shipment.id)
      .then((res) => setLogisticsDetails(res.data || res))
      .catch((err) => {
        console.warn("Could not load full logistics details:", err);
      });
  }, [shipment, isFreightRequired, isFreightAllocated]);

  if (!shipment || !isFreightRequired || !isFreightAllocated) return null;

  const contract = shipment.salesContract || {};
  const buyer = contract.buyer || {};
  const businessRef =
    shipment.businessReference ||
    shipment.businessTransaction?.businessReference ||
    "—";

  const pol =
    contract.portOfLoading ||
    contract.originLocationName ||
    shipment.origin ||
    "—";
  const pod =
    contract.portOfDischarge ||
    contract.destinationLocationName ||
    shipment.destination ||
    "—";

  const currency = contract.currencyCode || "USD";
  const directFreight = shipment.freight ? Number(shipment.freight) : null;

  // Linked logistics information
  const logisticsRecord = logisticsDetails?.logistics;
  const quotesList = logisticsRecord?.quotes || [];
  const selectedQuote =
    logisticsRecord?.selectedFreight ||
    quotesList.find((q) => q.isPreferred) ||
    quotesList[0];

  const preferredCarrier =
    selectedQuote?.seller?.entityName ||
    selectedQuote?.carrier ||
    (directFreight !== null ? "Direct Rate on Shipment" : "—");

  const freightAmountDisplay =
    selectedQuote?.freightAmount !== undefined && selectedQuote?.freightAmount !== null
      ? `${Number(selectedQuote.freightAmount).toLocaleString("en-US", {
          minimumFractionDigits: 2,
        })} ${selectedQuote.currency || currency}`
      : directFreight !== null
      ? `${directFreight.toLocaleString("en-US", {
          minimumFractionDigits: 2,
        })} ${currency}`
      : "—";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[150] bg-slate-900/30 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div
        className="fixed right-0 top-0 bottom-0 z-[160] w-full md:w-[85vw] lg:w-[70vw] lg:max-w-[850px] bg-slate-50 shadow-2xl flex flex-col font-sans border-l border-slate-200 animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-slate-200 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Truck className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">
                  Freight Allocation Details
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="h-3 w-3" />
                  Allocated
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-tight mt-0.5">
                Shipment Ref:{" "}
                <span className="font-semibold text-slate-700">
                  {shipment.shipmentReference || `#${shipment.id}`}
                </span>
                {" "}•{" "}
                Business Ref No.:{" "}
                <span className="font-semibold text-indigo-700">
                  {businessRef}
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Close Drawer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Summary Cards */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
            <div className="border-r border-slate-100 last:border-r-0 pr-4">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Freight Charge
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg font-extrabold text-emerald-700">
                  {freightAmountDisplay}
                </span>
              </div>
            </div>

            <div className="border-r border-slate-100 last:border-r-0 pr-4">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Preferred Transporter
              </span>
              <span
                className="text-xs font-bold text-slate-800 mt-1 block truncate"
                title={preferredCarrier}
              >
                {preferredCarrier}
              </span>
            </div>

            <div className="border-r border-slate-100 last:border-r-0 pr-4">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Route
              </span>
              <span
                className="text-xs font-semibold text-slate-700 mt-1 block truncate"
                title={`${pol} → ${pod}`}
              >
                {pol} → {pod}
              </span>
            </div>

            <div className="pr-4">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Target Cargo
              </span>
              <span className="text-xs font-bold text-slate-800 mt-1 block">
                {shipment.quantity ? `${shipment.quantity} MT` : "—"}{" "}
                {shipment.noOfContainers ? `(${shipment.noOfContainers} Cont.)` : ""}
              </span>
            </div>
          </div>

          {/* Freight Allocation Breakdown */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <FileText className="h-4 w-4 text-indigo-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Freight Allocation Breakdown
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50/80 border border-slate-100 rounded-lg">
                <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                  Source Type
                </span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                  {selectedQuote
                    ? "Carrier Freight Quote"
                    : directFreight !== null
                    ? "Direct Rate on Shipment"
                    : "Linked Logistics Record"}
                </span>
              </div>

              <div className="p-3 bg-slate-50/80 border border-slate-100 rounded-lg">
                <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                  Transit Duration
                </span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                  {selectedQuote?.transitDays
                    ? `${selectedQuote.transitDays} Days`
                    : "Standard Transit"}
                </span>
              </div>

              <div className="p-3 bg-slate-50/80 border border-slate-100 rounded-lg">
                <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                  Equipment Type
                </span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                  {selectedQuote?.containerType ||
                    (selectedQuote?.truckType || selectedQuote?.truckCapacity
                      ? [selectedQuote.truckType, selectedQuote.truckCapacity ? normalizeTruckCapacity(selectedQuote.truckCapacity) : null].filter(Boolean).join(" · ")
                      : selectedQuote?.vehicleType || "Standard 20'/40' Containers")}
                </span>
              </div>

              <div className="p-3 bg-slate-50/80 border border-slate-100 rounded-lg">
                <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                  Validity Date
                </span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                  {selectedQuote?.validityDate
                    ? new Date(selectedQuote.validityDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "Continuous Validity"}
                </span>
              </div>

              <div className="p-3 bg-slate-50/80 border border-slate-100 rounded-lg">
                <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                  Buyer (Consignee)
                </span>
                <span
                  className="text-xs font-bold text-slate-800 mt-0.5 block truncate"
                  title={buyer.entityName}
                >
                  {buyer.entityName || "—"}
                </span>
              </div>

              <div className="p-3 bg-slate-50/80 border border-slate-100 rounded-lg">
                <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                  Sales Contract
                </span>
                <span className="text-xs font-bold text-blue-600 mt-0.5 block font-mono">
                  {contract.contractNumber || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Received Carrier Quotes */}
          {quotesList.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Layers className="h-4 w-4 text-purple-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Received Carrier Quotes ({quotesList.length})
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <th className="py-2.5 px-3">Carrier / Partner</th>
                      <th className="py-2.5 px-3">Equipment</th>
                      <th className="py-2.5 px-3 text-right">Freight Amount</th>
                      <th className="py-2.5 px-3 text-center">Transit Days</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {quotesList.map((q) => {
                      const isPref = q.isPreferred || q.id === selectedQuote?.id;
                      return (
                        <tr
                          key={q.id}
                          className={isPref ? "bg-emerald-50/40 font-medium" : "hover:bg-slate-50/50"}
                        >
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-1.5 font-bold text-slate-900">
                              <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              <span>{q.seller?.entityName || q.carrier || "Partner"}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {q.containerType || q.containerSize || "Standard"}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                            {Number(q.freightAmount || 0).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}{" "}
                            {q.currency || currency}
                          </td>
                          <td className="py-2.5 px-3 text-center text-slate-600">
                            {q.transitDays ? `${q.transitDays}d` : "—"}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {isPref ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" />
                                Preferred
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-medium">
                                Received
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
