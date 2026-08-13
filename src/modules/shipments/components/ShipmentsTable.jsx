import React, { useState } from "react";
import { Ship, Clipboard, User, Eye, Loader2, Check } from "lucide-react";
import { useRouter } from "next/navigation";

// Category Emoji Mapper
const getProductEmoji = (productName) => {
  const name = productName?.toUpperCase() || "";
  if (
    name.includes("RICE") ||
    name.includes("MILLET") ||
    name.includes("WHEAT") ||
    name.includes("MAIZE") ||
    name.includes("CORN") ||
    name.includes("GRAIN")
  )
    return "🌾";
  if (name.includes("OIL")) return "🛢️";
  if (name.includes("SUGAR")) return "🍬";
  if (name.includes("SPICE") || name.includes("PEPPER") || name.includes("CHILI")) return "🌶️";
  if (name.includes("BEAN") || name.includes("COFFEE") || name.includes("SOYA")) return "🫘";
  return "📦";
};

// Workflow Status CSS Map
const WORKFLOW_COLORS = {
  Scheduled: "bg-slate-50 text-slate-700 border-slate-200",
  Ready: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Stuffing: "bg-cyan-50 text-cyan-700 border-cyan-200",
  Dispatched: "bg-teal-50 text-teal-700 border-teal-200",
  "In Transit": "bg-amber-50 text-amber-700 border-amber-200",
  "At Port": "bg-pink-50 text-pink-700 border-pink-200",
  Sailed: "bg-sky-50 text-sky-700 border-sky-200",
  Arrived: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
};

// Timeline Color CSS Map
const TIMELINE_COLORS = {
  today: "bg-emerald-50 text-emerald-700 border-emerald-200",
  tomorrow: "bg-blue-50 text-blue-700 border-blue-200",
  upcoming: "bg-blue-50 text-blue-700 border-blue-200",
  overdue: "bg-red-50 text-red-700 border-red-200",
  completed: "bg-gray-100 text-gray-700 border-gray-200",
  cancelled: "bg-gray-50 text-gray-400 border-gray-200",
};

const TIMELINE_EMOJIS = {
  today: "🟢",
  tomorrow: "🔵",
  upcoming: "🔵",
  overdue: "🔴",
  completed: "⚫",
  cancelled: "⚪",
};

export default function ShipmentsTable({
  shipments,
  loading,
  onRowClick,
  onViewContract,
  onEditShipment,
  onManageDocuments,
  onPrintShipment,
  selectedShipments = [],
  setSelectedShipments,
}) {
  const router = useRouter();
  const [copiedId, setCopiedId] = useState(null);

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3 bg-white">
        <Loader2 className="h-7 w-7 text-[#007aff] animate-spin" />
        <span className="text-xs font-semibold">Loading shipments registry...</span>
      </div>
    );
  }

  if (shipments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2.5 bg-white">
        <Ship className="h-10 w-10 text-gray-300 stroke-[1.2]" />
        <span className="text-xs font-semibold text-gray-600">No shipments found</span>
        <span className="text-[10px] text-gray-400 max-w-[280px] text-center">
          No records match the current filters. Modify your search criteria or add shipments to Sales Contracts.
        </span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto relative">
      <table className="w-full text-xs text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-500 font-bold select-none uppercase tracking-wider text-[9px]">
            <th className="px-4 py-3.5 w-8">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={shipments.length > 0 && selectedShipments.length === shipments.length}
                className="h-3.5 w-3.5 rounded border-gray-300 text-[#007aff] focus:ring-[#007aff]"
              />
            </th>
            <th className="px-4 py-3.5 whitespace-nowrap">Shipment Ref</th>
            <th className="px-4 py-3.5 whitespace-nowrap">Timeline</th>
            <th className="px-4 py-3.5 whitespace-nowrap">Status</th>
            <th className="px-4 py-3.5 whitespace-nowrap">Shipment Date</th>
            <th className="px-4 py-3.5 whitespace-nowrap">Buyer</th>
            <th className="px-4 py-3.5 whitespace-nowrap">Seller</th>
            <th className="px-4 py-3.5 whitespace-nowrap">Product</th>
            <th className="px-4 py-3.5 text-right whitespace-nowrap">Qty (MT)</th>
            <th className="px-4 py-3.5 text-right whitespace-nowrap">Purchase Rate</th>
            <th className="px-4 py-3.5 text-right whitespace-nowrap">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {shipments.map((s) => {
            const contract = s.salesContract || {};
            const buyer = contract.buyer || {};
            const seller = contract.seller || {};
            const timelineObj = s.timeline || {};

            const productsList = s.products || [];
            const primaryProduct = productsList[0]?.name || "—";
            const productDisplay =
              productsList.length > 1
                ? `${primaryProduct} + ${productsList.length - 1} more`
                : primaryProduct;

            const isSelected = selectedShipments.includes(s.id);

            return (
              <tr
                key={s.id}
                onClick={() => onRowClick(s)}
                className={`hover:bg-[#007aff]/5 cursor-pointer transition-colors ${isSelected ? "bg-[#007aff]/3" : ""
                  }`}
              >
                {/* Checkbox */}
                <td className="px-4 py-3 w-8" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => handleSelectOne(e, s.id)}
                    className="h-3.5 w-3.5 rounded border-gray-300 text-[#007aff] focus:ring-[#007aff]"
                  />
                </td>

                {/* Shipment Ref */}
                <td className="px-4 py-3 font-mono font-bold text-gray-700 whitespace-nowrap relative group/ref">
                  <div className="flex items-center gap-1.5">
                    <span>{s.shipmentReference || "—"}</span>
                    <button
                      onClick={(e) => handleCopy(e, s.shipmentReference, `ref-${s.id}`)}
                      className="opacity-0 group-hover/ref:opacity-100 p-0.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 transition-all"
                      title="Copy Reference"
                    >
                      {copiedId === `ref-${s.id}` ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Clipboard className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </td>

                {/* Timeline chip */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-bold ${TIMELINE_COLORS[timelineObj.type] || "bg-gray-50 text-gray-500 border-gray-200"
                      }`}
                  >
                    <span>{TIMELINE_EMOJIS[timelineObj.type] || "⚪"}</span>
                    <span>{timelineObj.label}</span>
                  </span>
                </td>

                {/* Workflow Status */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-lg border text-[10px] font-bold ${WORKFLOW_COLORS[s.status] || "bg-slate-50 text-slate-600 border-slate-200"
                      }`}
                  >
                    {s.status}
                  </span>
                </td>

                {/* Shipment Date */}
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {s.shipmentDate
                    ? new Date(s.shipmentDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    : "—"}
                </td>

                {/* Buyer */}
                <td
                  className="px-4 py-3 whitespace-nowrap font-medium text-gray-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  {buyer.id ? (
                    <button
                      onClick={() => router.push(`/masters/partners?partnerId=${buyer.id}`)}
                      className="text-gray-700 hover:text-[#007aff] hover:underline flex items-center gap-1.5 text-left"
                    >
                      <User className="h-3 w-3 text-gray-400" />
                      <span>{buyer.entityName || "—"}</span>
                    </button>
                  ) : (
                    "—"
                  )}
                </td>

                {/* Seller */}
                <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                  {seller.entityName || "—"}
                </td>

                {/* Product */}
                <td className="px-4 py-3 whitespace-nowrap">
                  {productsList.length > 0 ? (
                    <span className="inline-flex items-center gap-1.5 bg-blue-50/50 border border-blue-100 px-2 py-0.5 rounded-lg text-gray-700 font-semibold">
                      <span>{getProductEmoji(primaryProduct)}</span>
                      <span className="truncate max-w-[120px]" title={primaryProduct}>
                        {productDisplay}
                      </span>
                    </span>
                  ) : (
                    "—"
                  )}
                </td>

                {/* Qty (MT) */}
                <td className="px-4 py-3 text-right font-bold text-gray-800 whitespace-nowrap">
                  {s.quantity
                    ? Number(s.quantity).toLocaleString("en-US", { minimumFractionDigits: 2 })
                    : "0.00"}
                </td>

                {/* Purchase Rate */}
                <td className="px-4 py-3 text-right font-medium text-gray-700 whitespace-nowrap">
                  {s.purchaseRate
                    ? Number(s.purchaseRate).toLocaleString("en-US", { minimumFractionDigits: 2 })
                    : "—"}
                </td>

                {/* Open Drawer */}
                <td className="px-3 py-3 w-10" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onRowClick(s)}
                    className="p-1.5 rounded-lg text-gray-300 hover:text-[#007aff] hover:bg-blue-50 transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-3.5 w-3.5 text-gray-700" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
