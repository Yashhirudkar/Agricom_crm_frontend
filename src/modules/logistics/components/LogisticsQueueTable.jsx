import React from "react";
import { Truck, ArrowRight, Eye, EyeOff } from "lucide-react";

const LOGISTICS_STATUS_CLASSES = {
  "Pending": "bg-gray-50 text-gray-600 border-gray-100",
  "Freight Requested": "bg-orange-50 text-orange-700 border-orange-200",
  "Quotes Received": "bg-blue-50 text-blue-700 border-blue-200",
  "Preferred Quote Selected": "bg-purple-50 text-purple-700 border-purple-200",
  "Transport Assigned": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Shipment Created": "bg-teal-50 text-teal-700 border-teal-200",
  "In Transit": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "Delivered": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Closed": "bg-gray-100 text-gray-700 border-gray-300",
};

export default function LogisticsQueueTable({
  data,
  loading,
  onManage,
  onToggleHidden,
  hiddenOnly = false,
  isPurchaseContractsTab = false,
  mode = "All",
  highlightedRowId,
}) {

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin" />
        <p className="text-xs text-gray-400 font-semibold">Loading logistics queue...</p>
      </div>
    );
  }

  if (!data.length) {
    const scopeText = mode === "All" ? "" : `${mode} `;
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
          <Truck className="h-7 w-7 text-gray-400" />
        </div>
        <p className="text-sm font-bold text-gray-700">
          {isPurchaseContractsTab
            ? (mode === "All" ? "No Purchase Contracts in Logistics Queue" : `No ${scopeText}Purchase Contracts found.`)
            : (mode === "All" ? "No Enquiries in Logistics Queue" : `No ${scopeText}enquiries found.`)}
        </p>
        <p className="text-xs text-gray-400 mt-1">Pending shipments will appear here for transport management.</p>
      </div>
    );
  }

  const getOriginText = (e) => {
    if (e.shipmentMode === "SHIP") {
      return e.originPort
        ? `🚢 ${e.originPort}`
        : e.originCountryId
          ? `🌍 ${e.originCountryId}`
          : "—";
    }
    if (e.shipmentMode === "ROAD" || e.shipmentMode === "RAIL") {
      const parts = [e.originCity, e.originState, e.originCountryId].filter(Boolean);
      return parts.length > 0 ? parts.join(", ") : "—";
    }
    return e.originPort || e.originCity || e.originState || e.originCountryId || "—";
  };

  const getDestinationText = (e) => {
    if (e.shipmentMode === "SHIP") {
      return e.destinationPort || e.podPort || "—";
    }
    if (e.shipmentMode === "ROAD" || e.shipmentMode === "RAIL") {
      const parts = [e.destinationCity, e.destinationState, e.destinationCountry].filter(Boolean);
      return parts.length > 0 ? parts.join(", ") : "—";
    }
    return e.destinationPort || e.podPort || e.destinationCity || e.destinationState || e.destinationCountry || "—";
  };

  const getOrigins = (e) => {
    if (e.origin) return [e.origin];
    if (e.transportRoute?.origin) return [e.transportRoute.origin];
    if (e.transportDetails?.length) {
      return e.transportDetails.map(p => p.origin).filter(Boolean);
    }
    const defaultOrigin = getOriginText(e);
    return defaultOrigin && defaultOrigin !== "—" ? [defaultOrigin] : ["—"];
  };

  const getDestinations = (e) => {
    if (e.destination) return [e.destination];
    if (e.transportRoute?.destination) return [e.transportRoute.destination];
    if (e.transportDetails?.length) {
      return e.transportDetails.map(d => d.destination).filter(Boolean);
    }
    const destinations = e.destinations?.length
      ? e.destinations.map(d => d.destination)
      : [getDestinationText(e)].filter(x => x && x !== "—");
    return destinations.length ? destinations : ["—"];
  };

  return (
    <div className="w-full overflow-hidden">
      <table className="w-full table-fixed text-xs" style={{ tableLayout: "fixed", width: "100%" }}>
        <colgroup>
          <col style={{ width: "9%" }} />
          <col style={{ width: "7%" }} />
          <col style={{ width: "13%" }} />
          <col style={{ width: "6%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "16%" }} />
          <col style={{ width: "13%" }} />
          <col style={{ width: "12%" }} />
        </colgroup>
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/60">
            {["Enquiry / PC No.", "Date", "Product", "Qty (MT)", "From", "To", "Shipment Type", "Logistics Status", "Action"].map((h) => (
              <th key={h} className={`h-11 ${h === "Qty (MT)" ? "pl-2 pr-4" : "px-2"} py-2 font-semibold text-gray-500 tracking-wide whitespace-nowrap ${h === "Date" || h === "Qty (MT)" ? "text-center" : "text-left"}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((e, idx) => {
            const logisticsStatus = e.logistics?.status || "Pending";
            const badgeClass = LOGISTICS_STATUS_CLASSES[logisticsStatus] || "bg-gray-50 text-gray-600 border-gray-100";
            const isHighlighted = highlightedRowId === e.id;
            const isFreightPendingEnquiry = !e.purchaseContract && logisticsStatus === "Pending";
            const showNewBadge =
              !isFreightPendingEnquiry &&
              (!e.logistics || e.logistics.isViewed === false);
            const businessReference =
              e.purchaseContract?.businessReference ||
              e.businessReference ||
              e.businessTransaction?.businessReference ||
              "";

            return (
              <tr key={e.queueRowId || (e.transportDetailId ? `${e.id}_${e.transportDetailId}` : `${e.id}_${idx}`)} className={`transition-all duration-500 group hover:bg-gray-50/70 ${isHighlighted ? "bg-blue-50/50 shadow-inner" : ""} ${isFreightPendingEnquiry ? "logistics-pending-row" : ""}`}>
                <td className="h-[44px] px-3 py-1 font-mono font-bold text-[#007aff]">
                  {isFreightPendingEnquiry && (
                    <svg aria-hidden="true" className="freight-pending-scanner">
                      {/* Static subtle border — always visible, never animated */}
                      <rect
                        x="0.5"
                        y="0.5"
                        width="calc(100% - 1px)"
                        height="calc(100% - 1px)"
                        rx="3"
                        className="freight-pending-scanner__base"
                      />
                      {/* Single red dot — 9 units out of pathLength 1000 → ~9px */}
                      <rect
                        x="0.5"
                        y="0.5"
                        width="calc(100% - 1px)"
                        height="calc(100% - 1px)"
                        rx="3"
                        pathLength="1000"
                        className="freight-pending-scanner__dot"
                      />
                    </svg>
                  )}
                  <div className="flex min-w-0 flex-col items-start leading-tight">
                    {e.purchaseContract?.contractNumber ? (
                      <>
                        <span className="max-w-full truncate text-gray-900 font-bold" title={e.purchaseContract.contractNumber}>
                          {e.purchaseContract.contractNumber}
                        </span>
                        <div className="flex min-w-0 max-w-full items-center gap-1">
                          {businessReference ? (
                            <span className="truncate text-[10px] text-indigo-600 font-normal" title={businessReference}>{businessReference}</span>
                          ) : e.enquiryNo ? (
                            <span className="truncate text-[10px] text-gray-400 font-normal" title={`Enq: ${e.enquiryNo}`}>Enq: {e.enquiryNo}</span>
                          ) : null}
                          {showNewBadge && (
                            <span className="shrink-0 rounded border border-red-200 bg-red-100 px-1 py-0.5 text-[8px] font-extrabold uppercase leading-none text-red-600">
                              New
                            </span>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="max-w-full truncate">{e.enquiryNo || ""}</span>
                        {showNewBadge && (
                          <span className="mt-0.5 rounded border border-red-200 bg-red-100 px-1 py-0.5 text-[8px] font-extrabold uppercase leading-none text-red-600">
                            New
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </td>
                <td className="h-[44px] px-3 py-2 text-center text-gray-600 whitespace-nowrap">
                  {e.enquiryDate
                    ? new Date(e.enquiryDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                    : "—"}
                </td>
                <td className="h-[44px] px-2 py-2 text-gray-600 truncate" title={e.purchaseContract?.productName || e.product?.name || ""}>
                  {e.purchaseContract?.productName || e.product?.name || "—"}
                </td>
                <td className="h-[44px] pl-2 pr-4 py-2 text-center text-gray-800 font-bold tabular-nums">
                  {Number(e.purchaseContract?.quantity != null ? e.purchaseContract.quantity : (e.quantity || 0)).toLocaleString("en-IN")}
                </td>
                <td className="h-[44px] px-2 py-2 text-gray-600 truncate">
                  {(() => {
                    const hasPurchaseContract = Boolean(e.purchaseContract);
                    const origins = getOrigins(e);
                    const defaultOrigin = origins[0] || "—";
                    const originDisplay = (e.origin && e.origin !== "—")
                      ? e.origin
                      : (hasPurchaseContract
                        ? (e.purchaseContract.placeOfLoading || defaultOrigin)
                        : defaultOrigin);

                    return (
                      <div className="flex flex-col items-start">
                        <span className="block max-w-full truncate rounded-sm bg-amber-100 px-1 font-semibold text-amber-900" title={originDisplay}>
                          {originDisplay}
                        </span>
                        {origins.length > 1 && (
                          <span className="text-[10px] text-blue-600 font-semibold">+{origins.length - 1} More</span>
                        )}
                      </div>
                    );
                  })()}
                </td>
                <td className="h-[44px] px-2 py-2 text-gray-600 truncate">
                  {(() => {
                    const sc = e.salesContract;
                    const hasSc = Boolean(sc && (sc.destinationLocationName || sc.deliveryPlace));
                    const dests = getDestinations(e);
                    const defaultDest = dests[0] || "—";
                    const destDisplay = (e.destination && e.destination !== "—")
                      ? e.destination
                      : (hasSc
                        ? (sc.destinationLocationName || sc.deliveryPlace || defaultDest)
                        : defaultDest);

                    return (
                      <div className="flex flex-col items-start">
                        <span className="block max-w-full truncate rounded-sm bg-amber-100 px-1 font-semibold text-amber-900" title={destDisplay}>
                          {destDisplay}
                        </span>
                        {dests.length > 1 && (
                          <span className="text-[10px] text-blue-600 font-semibold">+{dests.length - 1} More</span>
                        )}
                      </div>
                    );
                  })()}
                </td>
                <td className="h-[44px] px-3 py-1 text-gray-600 whitespace-nowrap">
                  <div className="flex flex-col items-start gap-0.5">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[10px]">
                      {e.incoterm || e.transportRoute?.incoterm || e.purchaseContract?.shipmentTypeName || "—"}
                    </span>
                    <div className="font-semibold text-gray-700 capitalize">
                      <span className="text-[10px]">{e.shipmentMode ? e.shipmentMode.toLowerCase() : "road"}</span>
                    </div>
                  </div>
                </td>
                <td className="h-[44px] px-3 py-2 whitespace-nowrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeClass}`}>
                    {logisticsStatus}
                  </span>
                </td>
                <td className="h-[44px] px-3 py-2 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onManage(e)}
                      className="h-8 px-2.5 bg-white hover:bg-slate-50 border border-gray-200 text-gray-700 rounded-md flex items-center gap-1 text-[11px] font-bold shadow-2xs hover:border-gray-300 transition-colors cursor-pointer"
                    >
                      Transport <ArrowRight className="h-3 w-3 text-gray-400" />
                    </button>
                    {!isPurchaseContractsTab && (
                      <button
                        onClick={() => onToggleHidden?.(e)}
                        className="p-1.5 text-gray-400 hover:text-[#007aff] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title={hiddenOnly ? "Show in Transport" : "Hide from Transport"}
                        aria-label={hiddenOnly ? "Show in Transport" : "Hide from Transport"}
                      >
                        {hiddenOnly ? (
                          <Eye className="h-3.5 w-3.5" />
                        ) : (
                          <EyeOff className="h-3.5 w-3.5" />
                        )}
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
  );
}
