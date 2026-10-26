"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Truck,
  Ship,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building2,
  Calendar,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  DollarSign,
  Package,
  Pencil,
  Plus,
} from "lucide-react";
import { logisticsApi } from "@/modules/logistics/services/logisticsApi";

export default function FreightAllocationDrawer({
  shipment,
  onClose,
  onEditShipment,
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [logisticsDetails, setLogisticsDetails] = useState(null);

  useEffect(() => {
    if (!shipment) return;

    // If linked to an enquiry/logistics, fetch details
    const targetEnquiryId =
      shipment.logisticsId || shipment.logistics?.enquiryId;
    if (targetEnquiryId) {
      setLoading(true);
      logisticsApi
        .getDetails(targetEnquiryId)
        .then((res) => {
          setLogisticsDetails(res.data || res);
        })
        .catch((err) => {
          console.warn("Could not load full logistics details:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [shipment]);

  if (!shipment) return null;

  const contract = shipment.salesContract || {};
  const buyer = contract.buyer || {};
  const seller = contract.seller || {};
  const businessRef =
    shipment.businessReference ||
    shipment.businessTransaction?.businessReference ||
    "â€”";

  const pol =
    contract.portOfLoading ||
    contract.originLocationName ||
    "â€”";
  const pod =
    contract.portOfDischarge ||
    contract.destinationLocationName ||
    "â€”";

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
    (directFreight !== null ? "Direct Rate on Shipment" : "â€”");

  const freightAmountDisplay =
    selectedQuote?.freightAmount !== undefined && selectedQuote?.freightAmount !== null
      ? `${Number(selectedQuote.freightAmount).toLocaleString("en-US", {
          minimumFractionDigits: 2,
        })} ${selectedQuote.currency || currency}`
      : directFreight !== null
      ? `${directFreight.toLocaleString("en-US", {
          minimumFractionDigits: 2,
        })} ${currency}`
      : "â€”";

  const handleOpenTransportManagement = () => {
    const params = new URLSearchParams();
    if (businessRef && !businessRef.includes('?') && businessRef !== '—') {
      params.set("search", businessRef);
      params.set("businessRef", businessRef);
    } else if (shipment.shipmentReference) {
      params.set("search", shipment.shipmentReference);
      params.set("businessRef", shipment.shipmentReference);
    }
    if (shipment.logisticsId) {
      params.set("logisticsId", String(shipment.logisticsId));
    }
    if (shipment.salesContract?.enquiryId) {
      params.set("enquiryId", String(shipment.salesContract.enquiryId));
    }
    params.set("openDrawer", "true");
    router.push(`/logistics/transport-management?${params.toString()}`);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[150] bg-slate-900/30 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div
        className="fixed right-0 top-0 bottom-0 z-[160] bg-slate-50 shadow-2xl flex flex-col font-sans border-l border-slate-200 animate-in slide-in-from-right duration-300"
        style={{ width: "70vw", maxWidth: "1000px", minWidth: "500px" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 bg-white flex-shrink-0">
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
                {" "}&bull;{" "}
                Business Ref No.:{" "}
                <span className="font-semibold text-indigo-700">
                  {businessRef}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenTransportManagement}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Transport Workspace</span>
              <ExternalLink className="h-3 w-3" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Top Key Metrics Banner */}
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
              <span className="text-xs font-bold text-slate-800 mt-1 block truncate" title={preferredCarrier}>
                {preferredCarrier}
              </span>
            </div>

            <div className="border-r border-slate-100 last:border-r-0 pr-4">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Route
              </span>
              <span className="text-xs font-semibold text-slate-700 mt-1 block truncate" title={`${pol} âž” ${pod}`}>
                {pol} âž” {pod}
              </span>
            </div>

            <div className="pr-4">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Target Cargo
              </span>
              <span className="text-xs font-bold text-slate-800 mt-1 block">
                {shipment.quantity ? `${shipment.quantity} MT` : "â€”"}{" "}
                {shipment.noOfContainers ? `(${shipment.noOfContainers} Cont.)` : ""}
              </span>
            </div>
          </div>

          {/* Allocation Breakdown Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Freight Allocation Breakdown
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Readiness Gate Passed
              </span>
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
                    selectedQuote?.vehicleType ||
                    "Standard 20'/40' Containers"}
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
                <span className="text-xs font-bold text-slate-800 mt-0.5 block truncate" title={buyer.entityName}>
                  {buyer.entityName || "â€”"}
                </span>
              </div>

              <div className="p-3 bg-slate-50/80 border border-slate-100 rounded-lg">
                <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                  Sales Contract
                </span>
                <span className="text-xs font-bold text-blue-600 mt-0.5 block font-mono">
                  {contract.contractNumber || "â€”"}
                </span>
              </div>
            </div>
          </div>

          {/* Freight Quotes Comparative Table (if multiple quotes exist) */}
          {quotesList.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-purple-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Received Carrier Quotes ({quotesList.length})
                  </h3>
                </div>
                <span className="text-[11px] text-slate-500">
                  Preferred carrier is used for readiness
                </span>
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
                            {q.transitDays ? `${q.transitDays}d` : "â€”"}
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

          {/* Quick Action Navigation Bar */}
          <div className="bg-linear-to-r from-indigo-50/60 to-blue-50/40 border border-indigo-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-indigo-900">
                Logistics & Transport Management
              </h4>
              <p className="text-[11px] text-indigo-600 mt-0.5">
                Manage truck dispatches, compare live container shipping lines, or upload bill of lading documents.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {onEditShipment && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEditShipment(shipment);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Pencil className="h-3 w-3 text-slate-500" />
                  <span>Edit Direct Rate</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleOpenTransportManagement}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>Open Transport Workspace</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between">
          <div className="text-[11px] text-slate-400 font-medium">
            Shipment Readiness &bull; Freight Allocation Gate
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}