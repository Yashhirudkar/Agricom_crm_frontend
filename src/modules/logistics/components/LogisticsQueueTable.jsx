import React from "react";
import { Truck, Ship, Train, ArrowRight, Eye, EyeOff } from "lucide-react";

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
          {mode === "All" ? "No Enquiries in Logistics Queue" : `No ${scopeText}enquiries found.`}
        </p>
        <p className="text-xs text-gray-400 mt-1">Pending enquiries will appear here for transport management.</p>
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
    const origins = e.loadingPoints?.length 
      ? e.loadingPoints.map(p => p.loadingPoint)
      : [getOriginText(e)].filter(x => x && x !== "—");
    return origins.length ? origins : ["—"];
  };

  const getDestinations = (e) => {
    const destinations = e.destinations?.length
      ? e.destinations.map(d => d.destination)
      : [getDestinationText(e)].filter(x => x && x !== "—");
    return destinations.length ? destinations : ["—"];
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case "SHIP": return <Ship className="h-3.5 w-3.5 text-blue-500" />;
      case "RAIL": return <Train className="h-3.5 w-3.5 text-indigo-500" />;
      default:     return <Truck className="h-3.5 w-3.5 text-emerald-500" />;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/60">
            {["Enquiry No.", "Date", "Product", "Qty (MT)", "From", "To", "Mode", "Logistics Status", "Action"].map((h) => (
              <th key={h} className="px-4 py-3 text-left font-semibold text-gray-500 tracking-wide whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((e) => {
            const logisticsStatus = e.logistics?.status || "Pending";
            const badgeClass = LOGISTICS_STATUS_CLASSES[logisticsStatus] || "bg-gray-50 text-gray-600 border-gray-100";
            const isHighlighted = highlightedRowId === e.id;

            return (
              <tr key={e.id} className={`transition-all duration-500 group hover:bg-gray-50/70 ${isHighlighted ? "bg-blue-50/50 shadow-inner" : ""}`}>
                <td className="px-4 py-4.5 font-mono font-bold text-[#007aff] whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span>{e.enquiryNo}</span>
                    {(!e.logistics || e.logistics.isViewed === false) && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-red-100 text-red-600 border border-red-200">
                        New
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4.5 text-gray-600 whitespace-nowrap">
                  {e.enquiryDate
                    ? new Date(e.enquiryDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                    : "—"}
                </td>
                <td className="px-4 py-4.5 text-gray-600 whitespace-nowrap max-w-[150px] truncate" title={e.product?.name || ""}>
                  {e.product?.name || "—"}
                </td>
                <td className="px-4 py-4.5 text-gray-800 font-bold tabular-nums">
                  {Number(e.quantity || 0).toLocaleString("en-IN")}
                </td>
                <td className="px-4 py-4.5 text-gray-600 whitespace-nowrap">
                  {(() => {
                    const origins = getOrigins(e);
                    const firstOrigin = origins[0];
                    return (
                      <div className="flex flex-col">
                        <span className="max-w-[150px] truncate" title={firstOrigin}>
                          {firstOrigin}
                        </span>
                        {origins.length > 1 && (
                          <span className="text-[10px] text-blue-600 font-semibold mt-0.5">
                            +{origins.length - 1} More
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </td>
                <td className="px-4 py-4.5 text-gray-600 whitespace-nowrap">
                  {(() => {
                    const dests = getDestinations(e);
                    const firstDest = dests[0];
                    return (
                      <div className="flex flex-col">
                        <span className="max-w-[150px] truncate" title={firstDest}>
                          {firstDest}
                        </span>
                        {dests.length > 1 && (
                          <span className="text-[10px] text-blue-600 font-semibold mt-0.5">
                            +{dests.length - 1} More
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </td>
                <td className="px-4 py-4.5 text-gray-600 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 font-semibold text-gray-700 capitalize">
                    {getModeIcon(e.shipmentMode)}
                    <span className="text-[10px]">{e.shipmentMode ? e.shipmentMode.toLowerCase() : "road"}</span>
                  </div>
                </td>
                <td className="px-4 py-4.5 whitespace-nowrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeClass}`}>
                    {logisticsStatus}
                  </span>
                </td>
                <td className="px-4 py-4.5 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onManage(e)}
                      className="px-3 py-1 bg-white hover:bg-slate-50 border border-gray-200 text-gray-700 rounded-lg flex items-center gap-1 text-[11px] font-bold shadow-2xs hover:border-gray-300 transition-colors cursor-pointer"
                    >
                      Transport <ArrowRight className="h-3 w-3 text-gray-400" />
                    </button>
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
