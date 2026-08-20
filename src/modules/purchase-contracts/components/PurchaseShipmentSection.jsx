"use client";
import React from "react";
import { Ship, Eye } from "lucide-react";
import ShipmentDetailsDrawer from "@/modules/shipments/components/ShipmentDetailsDrawer";

export default function PurchaseShipmentSection({
  shipments = [],
  shipmentScheduleData = {},
  onUpdateShipmentSchedule,
  loading = false,
  currencyCode = "INR",
  allocationSummary = {},
}) {
  const [selectedShipment, setSelectedShipment] = React.useState(null);

  const selCls = "w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#007aff]/30 focus:border-[#007aff] bg-white";
  const inpCls = "w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#007aff]/30 focus:border-[#007aff] bg-white";

  const totalQty = shipments.reduce((s, item) => s + (Number(item.quantity) || 0), 0);
  const totalContainers = shipments.reduce((s, item) => s + (Number(item.noOfContainers) || 0), 0);

  const {
    remainingBalance = 0,
    overAllocatedQty = 0,
    isOverAllocated = false,
  } = allocationSummary;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center animate-pulse">
        <Ship className="h-7 w-7 text-[#007aff] mx-auto mb-2 animate-bounce" />
        <span className="text-xs font-semibold text-gray-400">Loading shipment schedule...</span>
      </div>
    );
  }

  const handleChange = (shipmentId, field, value) => {
    if (onUpdateShipmentSchedule) {
      onUpdateShipmentSchedule(shipmentId, field, value);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      {/* Section Header */}
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Ship className="h-3.5 w-3.5 text-[#007aff]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Shipment Schedule</h2>
            <p className="text-[10px] text-gray-400">Auto-populated from selected shipments. Fill purchase rates, forex, &amp; freight.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isOverAllocated ? (
            <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg font-mono">
              Stock Shortfall: -{Number(overAllocatedQty).toLocaleString("en-IN", { minimumFractionDigits: 2 })} MT 🔴
            </span>
          ) : (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg font-mono">
              Stock Available: +{Number(remainingBalance).toLocaleString("en-IN", { minimumFractionDigits: 2 })} MT 🟢
            </span>
          )}
          <span className="text-xs font-bold text-[#007aff] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 font-mono">
            {shipments.length} Shipment{shipments.length !== 1 ? "s" : ""} · {totalQty.toLocaleString("en-IN", { minimumFractionDigits: 2 })} MT
          </span>
        </div>
      </div>

      {/* Shipment Schedule Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider text-[9px]">
              <th className="px-3 py-2.5 text-center">#</th>
              <th className="px-3 py-2.5">Shipment Ref</th>
              <th className="px-3 py-2.5">Date</th>
              <th className="px-3 py-2.5 text-center">Containers</th>
              <th className="px-3 py-2.5 min-w-[80px]">Currency</th>
              <th className="px-3 py-2.5 min-w-[100px]">Purchase Rate</th>
              <th className="px-3 py-2.5 min-w-[100px]">Forex</th>
              <th className="px-3 py-2.5 min-w-[100px]">Freight</th>
              <th className="px-3 py-2.5 text-right min-w-[90px]">Qty (MT)</th>
              <th className="px-3 py-2.5 text-right min-w-[110px]">Stock Balance</th>
              <th className="px-3 py-2.5 min-w-[130px]">Remarks</th>
              <th className="px-3 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {shipments.map((s, idx) => {
              const rowData = shipmentScheduleData[s.id] || {};
              const refNo = s.shipmentReference || `SC-${s.salesContract?.contractNumber || ""}/${s.shipmentNo}`;
              const dateStr = s.shipmentDate
                ? new Date(s.shipmentDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "—";

              return (
                <tr key={s.id} className="hover:bg-blue-50/20 transition-colors">
                  {/* Index */}
                  <td className="px-3 py-2 text-center text-gray-400 font-semibold">{idx + 1}</td>

                  {/* Shipment Ref */}
                  <td className="px-3 py-2 font-mono font-bold text-gray-900 whitespace-nowrap">
                    {refNo}
                  </td>

                  {/* Date */}
                  <td className="px-3 py-2 text-gray-600 whitespace-nowrap font-medium">
                    {dateStr}
                  </td>

                  {/* Containers */}
                  <td className="px-3 py-2 text-center font-mono text-gray-700">
                    <span className="bg-gray-50 px-2 py-0.5 rounded border border-gray-200 font-semibold">
                      {s.noOfContainers ?? 0}
                    </span>
                  </td>

                  {/* Currency */}
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={rowData.currencyCode || s.currencyCode || currencyCode || "INR"}
                      onChange={(e) => handleChange(s.id, "currencyCode", e.target.value)}
                      className={`${inpCls} uppercase font-mono font-semibold text-gray-800`}
                    />
                  </td>

                  {/* Purchase Rate */}
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={rowData.purchaseRate ?? s.purchaseRate ?? ""}
                      onChange={(e) => handleChange(s.id, "purchaseRate", e.target.value)}
                      placeholder="0.00"
                      className={`${inpCls} font-mono font-bold text-gray-900`}
                    />
                  </td>

                  {/* Forex */}
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={rowData.forex ?? s.forex ?? ""}
                      onChange={(e) => handleChange(s.id, "forex", e.target.value)}
                      placeholder="0.00"
                      className={`${inpCls} font-mono text-gray-800`}
                    />
                  </td>

                  {/* Freight */}
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={rowData.freight ?? s.freight ?? ""}
                      onChange={(e) => handleChange(s.id, "freight", e.target.value)}
                      placeholder="0.00"
                      className={`${inpCls} font-mono text-gray-800`}
                    />
                  </td>

                  {/* Qty (MT) */}
                  <td className="px-3 py-2 text-right font-mono font-bold text-gray-900 whitespace-nowrap">
                    {Number(s.quantity || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>

                  {/* Stock Balance (Readonly Column) */}
                  <td className="px-3 py-2 text-right whitespace-nowrap font-mono font-bold">
                    {isOverAllocated ? (
                      <span
                        className="text-red-600 inline-flex items-center gap-1"
                        title="Shortfall"
                      >
                        -{Number(overAllocatedQty).toLocaleString("en-IN", { minimumFractionDigits: 2 })} MT 🔴
                      </span>
                    ) : (
                      <span
                        className="text-emerald-600 inline-flex items-center gap-1"
                        title="Stock Available"
                      >
                        +{Number(remainingBalance).toLocaleString("en-IN", { minimumFractionDigits: 2 })} MT 🟢
                      </span>
                    )}
                  </td>

                  {/* Remarks */}
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={rowData.remarks ?? s.remarks ?? ""}
                      onChange={(e) => handleChange(s.id, "remarks", e.target.value)}
                      placeholder="Remarks"
                      className={inpCls}
                    />
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedShipment(s)}
                      className="p-1.5 text-gray-400 hover:text-[#007aff] hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}

            {shipments.length === 0 && (
              <tr>
                <td colSpan={12} className="text-center py-10 text-gray-400">
                  <Ship className="h-8 w-8 mx-auto mb-2 text-gray-300 stroke-[1.2]" />
                  <p className="text-xs font-semibold text-gray-600">No shipments selected</p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Select 1 or more shipments in &quot;Against Shipment&quot; section above to populate schedule.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
          {shipments.length > 0 && (
            <tfoot>
              <tr className="bg-gray-50/80 border-t border-gray-200 font-bold text-xs">
                <td colSpan={3} className="px-3 py-2.5 text-right text-gray-600">Total:</td>
                <td className="px-3 py-2.5 text-center font-mono text-gray-900">{totalContainers}</td>
                <td colSpan={4}></td>
                <td className="px-3 py-2.5 text-right font-mono text-gray-900">{totalQty.toLocaleString("en-IN", { minimumFractionDigits: 2 })} MT</td>
                <td className="px-3 py-2.5 text-right whitespace-nowrap font-mono font-bold">
                  {isOverAllocated ? (
                    <span className="text-red-600" title="Shortfall">
                      -{Number(overAllocatedQty).toLocaleString("en-IN", { minimumFractionDigits: 2 })} MT 🔴
                    </span>
                  ) : (
                    <span className="text-emerald-600" title="Stock Available">
                      +{Number(remainingBalance).toLocaleString("en-IN", { minimumFractionDigits: 2 })} MT 🟢
                    </span>
                  )}
                </td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Shipment Details Drawer */}
      {selectedShipment && (
        <ShipmentDetailsDrawer
          shipment={selectedShipment}
          onClose={() => setSelectedShipment(null)}
          onViewContract={() => {}}
        />
      )}
    </div>
  );
}
