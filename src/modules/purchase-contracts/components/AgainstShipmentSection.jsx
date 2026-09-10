"use client";
import React, { useState } from "react";
import { Ship, Plus, CheckSquare, Square, Trash2, Edit3 } from "lucide-react";
import ShipmentSelectionDrawer from "./ShipmentSelectionDrawer";

export default function AgainstShipmentSection({
  isManual = false,
  productItems = [],
  contractBuyerId = null,
  shipmentAllocations = [], // array of { shipmentId, purchaseContractItemId, allocatedQuantity, shipment }
  onUpdateAllocations,
  allAvailableShipments = [],
  selectedShipmentIds = [],
  onToggleShipment,
}) {
  const [activeDrawerItem, setActiveDrawerItem] = useState(null);

  // If SC-linked existing simple flow (not manual & no item-based allocations)
  const isSimpleSCFlow = !isManual && productItems.length === 0;

  if (isSimpleSCFlow) {
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

  // Product-wise Shipment Allocation View (Manual MTT & Multi-Item Flow)
  const itemsToDisplay = productItems.length > 0 ? productItems : [
    { id: null, productName: "Primary Product Item", quantity: 0 }
  ];

  const handleApplyItemAllocations = (newItemAllocations) => {
    // Retain allocations for other product items, replace allocations for activeDrawerItem
    const activeItemId = activeDrawerItem?.id;

    const otherItemAllocations = shipmentAllocations.filter(
      (a) => a.purchaseContractItemId !== activeItemId
    );

    const merged = [...otherItemAllocations, ...newItemAllocations];
    onUpdateAllocations(merged);
  };

  const handleRemoveAllocation = (shipmentId) => {
    const updated = shipmentAllocations.filter((a) => a.shipmentId !== shipmentId);
    onUpdateAllocations(updated);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden space-y-4">
      {/* Section Header */}
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Ship className="h-3.5 w-3.5 text-[#007aff]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Against Shipment Allocation</h2>
            <p className="text-[10px] text-gray-400">Map eligible shipments product-wise with partial MT allocation</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {itemsToDisplay.map((item, index) => {
          const itemId = item.id;
          const pName = item.productName || item.product?.name || `Product Item #${index + 1}`;
          const itemContractQty = Number(item.quantity || 0);

          // Get allocated shipments for this product item
          const itemAllocations = shipmentAllocations.filter(
            (a) => a.purchaseContractItemId === itemId || (itemsToDisplay.length === 1 && !a.purchaseContractItemId)
          );

          const totalAssignedForProduct = itemAllocations.reduce(
            (sum, a) => sum + Number(a.allocatedQuantity || 0),
            0
          );

          const remainingQty = Math.max(0, itemContractQty - totalAssignedForProduct);

          return (
            <div
              key={itemId || index}
              className="border border-gray-200 rounded-2xl p-4 bg-gray-50/30 space-y-3"
            >
              {/* Product Header & Live Metrics */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-gray-100 shadow-2xs">
                <div>
                  <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#007aff]" />
                    {pName}
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                    Product-wise Shipment Mapping
                  </p>
                </div>

                {/* Metrics Breakdown */}
                <div className="flex items-center gap-3 text-xs">
                  <div className="px-3 py-1 bg-gray-100 rounded-lg text-center">
                    <span className="text-[9px] text-gray-400 font-bold block uppercase">Contract Qty</span>
                    <span className="font-mono font-bold text-gray-900">{itemContractQty.toFixed(2)} MT</span>
                  </div>

                  <div className="px-3 py-1 bg-blue-50 rounded-lg text-center">
                    <span className="text-[9px] text-blue-600 font-bold block uppercase">Assigned</span>
                    <span className="font-mono font-bold text-blue-700">{totalAssignedForProduct.toFixed(2)} MT</span>
                  </div>

                  <div className="px-3 py-1 bg-emerald-50 rounded-lg text-center">
                    <span className="text-[9px] text-emerald-600 font-bold block uppercase">Remaining</span>
                    <span className="font-mono font-bold text-emerald-700">{remainingQty.toFixed(2)} MT</span>
                  </div>

                  <button
                    onClick={() => setActiveDrawerItem(item)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#007aff] hover:bg-blue-600 rounded-xl transition-colors shadow-2xs inline-flex items-center gap-1.5 cursor-pointer ml-2"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Select Shipments</span>
                  </button>
                </div>
              </div>

              {/* Allocated Shipments List for this Product Item */}
              <div className="space-y-2">
                {itemAllocations.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {itemAllocations.map((alloc) => {
                      const sObj = alloc.shipment || allAvailableShipments.find((s) => s.id === alloc.shipmentId) || {};
                      const refNo = sObj.shipmentReference || (sObj.salesContract?.contractNumber ? `SC-${sObj.salesContract.contractNumber}/${sObj.shipmentNo}` : `Shipment #${alloc.shipmentId}`);
                      const totalShipmentQty = Number(sObj.quantity || 0);

                      return (
                        <div
                          key={alloc.shipmentId}
                          className="bg-white p-3 rounded-xl border border-gray-200 flex items-center justify-between gap-2 shadow-2xs hover:border-gray-300 transition-all"
                        >
                          <div>
                            <span className="font-mono font-bold text-xs text-gray-900 block">
                              {refNo}
                            </span>
                            <span className="text-[10px] text-gray-500 font-medium">
                              Shipment Qty: <strong className="font-mono text-gray-700">{totalShipmentQty} MT</strong>
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 text-xs font-mono font-extrabold text-[#007aff] bg-blue-50 border border-blue-100 rounded-lg">
                              {Number(alloc.allocatedQuantity).toFixed(2)} MT
                            </span>
                            <button
                              onClick={() => handleRemoveAllocation(alloc.shipmentId)}
                              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Remove Shipment Allocation"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white border border-dashed border-gray-200 rounded-xl p-4 text-center text-xs text-gray-400">
                    No shipments mapped for {pName}. Click <strong>Select Shipments</strong> to attach shipments.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Shipment Selection Drawer Component */}
      <ShipmentSelectionDrawer
        isOpen={Boolean(activeDrawerItem)}
        onClose={() => setActiveDrawerItem(null)}
        productItem={activeDrawerItem}
        contractBuyerId={contractBuyerId}
        currentAllocations={shipmentAllocations.filter(
          (a) => a.purchaseContractItemId === activeDrawerItem?.id
        )}
        allAvailableShipments={allAvailableShipments}
        onApplyAllocations={handleApplyItemAllocations}
      />
    </div>
  );
}
