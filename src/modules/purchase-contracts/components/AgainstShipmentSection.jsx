"use client";
import React from "react";
import { Ship, CheckSquare, Square, Calendar } from "lucide-react";

export default function AgainstShipmentSection({
  allAvailableShipments = [],
  selectedShipmentIds = [],
  onToggleShipment,
}) {
  const selectedShipments = allAvailableShipments.filter((s) =>
    selectedShipmentIds.includes(s.id)
  );
  const selectedCount = selectedShipments.length;

  const totalSelectedQty = selectedShipments.reduce(
    (sum, s) => sum + Number(s.quantity || 0),
    0
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      {/* Compact Section Header */}
      <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Ship className="h-3.5 w-3.5 text-[#007aff]" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-gray-900">Against Shipment *</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#007aff] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 font-mono">
            Selected: {selectedCount} Shipment{selectedCount !== 1 ? "s" : ""} ({totalSelectedQty.toLocaleString("en-IN", { minimumFractionDigits: 2 })} MT)
          </span>
        </div>
      </div>

      {/* Compact Shipment Grid */}
      <div className="p-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {allAvailableShipments.map((s) => {
            const isChecked = selectedShipmentIds.includes(s.id);
            const refNo = s.shipmentReference || `SC-${s.salesContract?.contractNumber || ""}/${s.shipmentNo}`;
            const dateStr = s.shipmentDate
              ? new Date(s.shipmentDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                })
              : "—";

            return (
              <div
                key={s.id}
                onClick={() => onToggleShipment(s.id)}
                className={`px-3 py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                  isChecked
                    ? "bg-blue-50/60 border-[#007aff]/40 shadow-2xs"
                    : "bg-gray-50/40 border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="text-[#007aff] flex-shrink-0">
                  {isChecked ? (
                    <CheckSquare className="h-4 w-4 fill-[#007aff] text-white" />
                  ) : (
                    <Square className="h-4 w-4 text-gray-300" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono font-bold text-[11px] text-gray-900 truncate">
                      {refNo}
                    </span>
                    <span className="text-[9px] font-bold text-gray-500 font-mono bg-white px-1.5 py-0.2 rounded border border-gray-200 flex-shrink-0">
                      {s.noOfContainers ?? 0} Cont.
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5">
                    <span className="font-bold text-gray-800 font-mono">
                      {Number(s.quantity || 0).toLocaleString("en-IN")} MT
                    </span>
                    <span>•</span>
                    <span className="text-gray-400 font-medium">{dateStr}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {allAvailableShipments.length === 0 && (
            <div className="col-span-full text-center py-4 text-gray-400 text-xs italic">
              No shipments found in linked Sales Contract.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
