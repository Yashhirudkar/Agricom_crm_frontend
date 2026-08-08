import React from "react";
import { MessageCircle, Trash2, FileSignature, Edit2 } from "lucide-react";

export default function EnquiriesTable({ enquiries, loading, onFollowUp, onDelete, onExecute, onEdit }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin" />
        <p className="text-xs text-gray-400 font-semibold">Loading enquiries...</p>
      </div>
    );
  }

  if (!enquiries.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
          <svg className="h-7 w-7 text-[#007aff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-sm font-bold text-gray-700">No Enquiries Found</p>
        <p className="text-xs text-gray-400 mt-1">Create your first enquiry to get started.</p>
      </div>
    );
  }

  const getOriginText = (e) => {
    if (e.shipmentMode === "SHIP") {
      return e.originPort ? `🚢 ${e.originPort}` : "—";
    }
    if (e.shipmentMode === "ROAD" || e.shipmentMode === "RAIL") {
      const icon = e.shipmentMode === "ROAD" ? "🚛 " : "🚆 ";
      const parts = [e.originCity, e.originState, e.originCountryId].filter(Boolean);
      return parts.length > 0 ? `${icon}${parts.join(", ")}` : "—";
    }
    return e.originCountryName || "—";
  };

  const getDestinationText = (e) => {
    if (e.shipmentMode === "SHIP") {
      return e.destinationPort || e.podName ? `🚢 ${e.destinationPort || e.podName}` : "—";
    }
    if (e.shipmentMode === "ROAD" || e.shipmentMode === "RAIL") {
      const icon = e.shipmentMode === "ROAD" ? "🚛 " : "🚆 ";
      const parts = [e.destinationCity, e.destinationState, e.destinationCountry].filter(Boolean);
      return parts.length > 0 ? `${icon}${parts.join(", ")}` : "—";
    }
    return e.podName || "—";
  };

  const getShipmentTypeLabel = (type) => {
    if (!type) return "—";
    const mapping = {
      FCL: "FCL",
      VESSEL: "Vessel",
      TRUCK: "Truck",
      WAGON: "Wagon",
      TRUCK_WAGON: "Truck + Wagon"
    };
    return mapping[type] || type;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/60">
            {["Enquiry No.", "Date", "Partner", "Product", "Origin", "Purity", "Packing", "POD", "Shipment", "Qty (MT)", "Shipment Date", "Bid", "Potential", "Actions"].map(h => (
              <th key={h} className="px-3 py-3 text-left font-semibold text-gray-500 tracking-wide whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {enquiries.map((e) => {
            return (
              <tr
                key={e.id}
                className="transition-colors group hover:bg-gray-50/70"
              >
                <td className="px-3 py-3 font-mono font-bold text-[#007aff] whitespace-nowrap">
                  {e.enquiryNo}
                </td>
                <td className="px-3 py-3 text-gray-600 whitespace-nowrap">
                  {e.enquiryDate ? new Date(e.enquiryDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                </td>
                <td className="px-3 py-3 text-gray-800 font-medium whitespace-nowrap max-w-[150px] truncate" title={e.partnerName || ""}>
                  {e.partnerName || "—"}
                </td>
                <td className="px-3 py-3 text-gray-600 whitespace-nowrap max-w-[150px] truncate" title={e.productName || ""}>
                  {e.productName || "—"}
                </td>
                <td className="px-3 py-3 text-gray-600 whitespace-nowrap max-w-[200px] truncate" title={getOriginText(e)}>
                  {getOriginText(e)}
                </td>
                <td className="px-3 py-3 text-gray-600 whitespace-nowrap">
                  {e.purity || "—"}
                </td>
                <td className="px-3 py-3 text-gray-600 whitespace-nowrap">
                  {e.packingName || "—"}
                </td>
                <td className="px-3 py-3 text-gray-600 whitespace-nowrap max-w-[200px] truncate" title={getDestinationText(e)}>
                  {getDestinationText(e)}
                </td>
                <td className="px-3 py-3 text-gray-600 whitespace-nowrap">
                  {getShipmentTypeLabel(e.shipmentType)}
                </td>
                <td className="px-3 py-3 text-gray-800 font-semibold tabular-nums">
                  {Number(e.quantity || 0).toLocaleString("en-IN")}
                </td>
                <td className="px-3 py-3 text-gray-600 whitespace-nowrap">
                  {e.shipmentDate ? new Date(e.shipmentDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                </td>
                <td className="px-3 py-3 text-gray-800 font-semibold tabular-nums whitespace-nowrap">
                  {e.buyingInterest ? `${e.bidCurrency || "USD"} ${Number(e.buyingInterest).toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "—"}
                </td>
                <td className="px-3 py-3 text-gray-600 whitespace-nowrap">
                  {e.potentialEnquiry ? "Yes" : "No"}
                </td>

                <td className="px-3 py-3">
                  <div className="flex items-center gap-1">
                    {e.status === "CONFIRMED" && (
                      <button
                        onClick={() => onExecute?.(e)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Execute Contract"
                      >
                        <FileSignature className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => onEdit?.(e)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onFollowUp(e)}
                      className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                      title="Follow Up (Chat)"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(e)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
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
