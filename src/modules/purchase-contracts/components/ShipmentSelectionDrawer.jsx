"use client";
import React, { useState, useEffect, useMemo } from "react";
import { X, Search, Filter, Ship, Check, AlertCircle, ArrowUpDown } from "lucide-react";
import { shipmentsApi } from "@/modules/shipments/services/shipmentsApi";

export default function ShipmentSelectionDrawer({
  isOpen,
  onClose,
  productItem,
  contractBuyerId,
  currentAllocations = [], // array of { shipmentId, purchaseContractItemId, allocatedQuantity, shipment }
  allAvailableShipments = [], // optional fallback list passed from parent
  onApplyAllocations,
}) {
  const [loading, setLoading] = useState(false);
  const [fetchedShipments, setFetchedShipments] = useState([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("date"); // "date" | "available"
  const [sortOrder, setSortOrder] = useState("desc");

  // Selection state: Map of shipmentId -> allocatedQuantity (number)
  const [selectedAllocations, setSelectedAllocations] = useState({});

  // Initialize selectedAllocations when drawer opens or currentAllocations change
  useEffect(() => {
    if (isOpen) {
      const initialMap = {};
      currentAllocations.forEach((alloc) => {
        if (alloc.shipmentId) {
          initialMap[alloc.shipmentId] = Number(alloc.allocatedQuantity) || 0;
        }
      });
      setSelectedAllocations(initialMap);
    }
  }, [isOpen, currentAllocations]);

  // Fetch shipments matching product / buyer if possible, fallback to allAvailableShipments
  useEffect(() => {
    if (!isOpen) return;

    const fetchEligibleShipments = async () => {
      setLoading(true);
      try {
        const params = { limit: 100 };
        if (productItem?.productId) params.productId = productItem.productId;
        if (contractBuyerId) params.buyerId = contractBuyerId;

        const res = await shipmentsApi.getShipments(params);
        const list = res?.data?.data || res?.data || [];
        setFetchedShipments(list);
      } catch (err) {
        console.warn("Falling back to parent shipments list", err);
        setFetchedShipments(allAvailableShipments);
      } finally {
        setLoading(false);
      }
    };

    fetchEligibleShipments();
  }, [isOpen, productItem, contractBuyerId, allAvailableShipments]);

  // Combine fetched list & allAvailableShipments to ensure all available shipments are represented
  const candidateShipments = useMemo(() => {
    const map = new Map();
    // Add allAvailableShipments first
    allAvailableShipments.forEach((s) => {
      if (s.id) map.set(s.id, s);
    });
    // Add fetchedShipments
    fetchedShipments.forEach((s) => {
      if (s.id) map.set(s.id, s);
    });
    return Array.from(map.values());
  }, [allAvailableShipments, fetchedShipments]);

  // Filter & sort candidate shipments
  const filteredShipments = useMemo(() => {
    const targetProductId = productItem?.productId;

    return candidateShipments
      .filter((s) => {
        // Product matching: check if shipment's item matches or salesContract item matches
        if (targetProductId) {
          const sProdId = s.productId || s.item?.productId || s.salesContract?.items?.[0]?.productId;
          if (sProdId && String(sProdId) !== String(targetProductId)) {
            // Check if contract items contain targetProductId
            const matchInItems = s.salesContract?.items?.some(
              (it) => String(it.productId) === String(targetProductId)
            );
            if (!matchInItems && sProdId) return false;
          }
        }

        // Search query matching
        if (search.trim()) {
          const q = search.toLowerCase();
          const refNo = (s.shipmentReference || "").toLowerCase();
          const scNo = (s.salesContract?.contractNumber || "").toLowerCase();
          const shpNo = String(s.shipmentNo || "").toLowerCase();
          if (!refNo.includes(q) && !scNo.includes(q) && !shpNo.includes(q)) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortField === "date") {
          const dA = new Date(a.shipmentDate || 0).getTime();
          const dB = new Date(b.shipmentDate || 0).getTime();
          return sortOrder === "desc" ? dB - dA : dA - dB;
        } else {
          // Sort by available allocatable qty
          const availA = Number(a.quantity || 0) - Number(a.alreadyAllocatedQty || 0);
          const availB = Number(b.quantity || 0) - Number(b.alreadyAllocatedQty || 0);
          return sortOrder === "desc" ? availB - availA : availA - availB;
        }
      });
  }, [candidateShipments, productItem, search, sortField, sortOrder]);

  // Compute live selection totals for metrics banner
  const contractItemQty = Number(productItem?.quantity || 0);
  const totalAssignedQty = Object.values(selectedAllocations).reduce(
    (sum, q) => sum + (Number(q) || 0),
    0
  );
  const remainingContractQty = Math.max(0, contractItemQty - totalAssignedQty);
  const isOverAllocated = totalAssignedQty > contractItemQty;

  const toggleSelectShipment = (shipment) => {
    const sId = shipment.id;
    const isCurrentlySelected = selectedAllocations.hasOwnProperty(sId);

    if (isCurrentlySelected) {
      const nextMap = { ...selectedAllocations };
      delete nextMap[sId];
      setSelectedAllocations(nextMap);
    } else {
      // Auto-suggest allocation qty: min of (remaining contract item qty, available shipment allocatable qty)
      const totalShipmentQty = Number(shipment.quantity || 0);
      const alreadyAllocated = Number(shipment.alreadyAllocatedQty || 0);
      const availableShipmentQty = Math.max(0, totalShipmentQty - alreadyAllocated);

      const defaultAllocated = remainingContractQty > 0
        ? Math.min(remainingContractQty, availableShipmentQty > 0 ? availableShipmentQty : totalShipmentQty)
        : (availableShipmentQty > 0 ? availableShipmentQty : totalShipmentQty);

      setSelectedAllocations((prev) => ({
        ...prev,
        [sId]: Number(defaultAllocated.toFixed(2)),
      }));
    }
  };

  const handleQtyChange = (sId, valueStr) => {
    const val = valueStr === "" ? 0 : parseFloat(valueStr);
    setSelectedAllocations((prev) => ({
      ...prev,
      [sId]: isNaN(val) ? 0 : val,
    }));
  };

  const handleApply = () => {
    const allocationsArray = Object.entries(selectedAllocations)
      .filter(([_, qty]) => Number(qty) > 0)
      .map(([sId, qty]) => {
        const sObj = candidateShipments.find((s) => String(s.id) === String(sId));
        return {
          shipmentId: Number(sId),
          purchaseContractItemId: productItem?.id || null,
          allocatedQuantity: Number(qty),
          shipment: sObj,
        };
      });

    onApplyAllocations(allocationsArray);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end transition-opacity">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">

        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-[#007aff] rounded-xl">
              <Ship className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 leading-tight">
                Select Shipments for Allocation
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Product: <span className="font-semibold text-gray-800">{productItem?.productName || productItem?.product?.name || "Product Item"}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded-xl transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Product Item Contract Allocation Metric Card */}
        <div className="p-4 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-purple-50/70 border-b border-gray-200/80">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-gray-200/60 shadow-2xs">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5">
                Contract Item Qty
              </span>
              <span className="text-sm font-extrabold text-gray-900 font-mono">
                {contractItemQty.toLocaleString("en-IN", { minimumFractionDigits: 2 })} MT
              </span>
            </div>

            <div className="bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-gray-200/60 shadow-2xs">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block mb-0.5">
                Selected Allocated
              </span>
              <span className="text-sm font-extrabold text-blue-700 font-mono">
                {totalAssignedQty.toLocaleString("en-IN", { minimumFractionDigits: 2 })} MT
              </span>
            </div>

            <div className={`p-2.5 rounded-xl border shadow-2xs ${isOverAllocated
              ? "bg-red-50/90 border-red-200 text-red-700"
              : "bg-white/80 border-gray-200/60 text-emerald-700"
              }`}>
              <span className="text-[10px] font-bold uppercase tracking-wider block mb-0.5">
                {isOverAllocated ? "Over-Allocated" : "Remaining Qty"}
              </span>
              <span className="text-sm font-extrabold font-mono">
                {isOverAllocated
                  ? `+${(totalAssignedQty - contractItemQty).toFixed(2)} MT`
                  : `${remainingContractQty.toFixed(2)} MT`}
              </span>
            </div>
          </div>

          {isOverAllocated && (
            <div className="mt-2.5 px-3 py-1.5 bg-red-100/80 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700 font-medium">
              <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Warning: Total allocated shipment quantity exceeds contract item quantity ({contractItemQty} MT).</span>
            </div>
          )}
        </div>

        {/* Toolbar (Search & Filters) */}
        <div className="px-4 py-3 border-b border-gray-100 bg-white flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="h-3.5 w-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Shipment Ref or SC No..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSortField(sortField === "date" ? "available" : "date");
              }}
              className="px-2.5 py-1.5 text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              title="Toggle Sort Field"
            >
              <ArrowUpDown className="h-3 w-3 text-gray-500" />
              <span>{sortField === "date" ? "Sort: Date" : "Sort: Available"}</span>
            </button>
          </div>
        </div>

        {/* Eligible Shipments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/40">
          {loading ? (
            <div className="py-12 text-center text-gray-400 text-xs font-medium animate-pulse">
              Fetching eligible shipments...
            </div>
          ) : (
            filteredShipments.map((shipment) => {
              const sId = shipment.id;
              const isSelected = selectedAllocations.hasOwnProperty(sId);
              const totalShipmentQty = Number(shipment.quantity || 0);
              const alreadyAllocated = Number(shipment.alreadyAllocatedQty || 0);
              const availableAllocatable = Math.max(0, totalShipmentQty - alreadyAllocated);
              const currentAllocatedInput = selectedAllocations[sId] ?? 0;

              const refNo = shipment.shipmentReference || `SC-${shipment.salesContract?.contractNumber || ""}/${shipment.shipmentNo}`;
              const dateStr = shipment.shipmentDate
                ? new Date(shipment.shipmentDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
                : "—";

              return (
                <div
                  key={sId}
                  className={`p-3.5 rounded-2xl border transition-all ${isSelected
                    ? "bg-white border-[#007aff] shadow-md ring-1 ring-[#007aff]/30"
                    : "bg-white border-gray-200 hover:border-gray-300 shadow-2xs"
                    }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      onClick={() => toggleSelectShipment(shipment)}
                      className="flex items-start gap-3 flex-1 cursor-pointer"
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? "bg-[#007aff] border-[#007aff] text-white" : "border-gray-300 bg-white"
                        }`}>
                        {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-gray-900">
                            {refNo}
                          </span>
                          {shipment.salesContract?.buyer?.entityName && (
                            <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                              Buyer: {shipment.salesContract.buyer.entityName}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-2">
                          <span>Dispatch Date: <strong className="text-gray-700 font-mono">{dateStr}</strong></span>
                          <span>•</span>
                          <span>Containers: <strong className="text-gray-700 font-mono">{shipment.noOfContainers || "—"}</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Metrics & Partial Allocation Row */}
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                    {/* Live Balance Card per Shipment */}
                    <div className="flex items-center gap-3 text-[11px]">
                      <div>
                        <span className="text-gray-400 block text-[9px] uppercase font-bold">Total Qty</span>
                        <span className="font-mono font-bold text-gray-800">{totalShipmentQty.toFixed(2)} MT</span>
                      </div>
                      <div className="border-l border-gray-200 pl-3">
                        <span className="text-gray-400 block text-[9px] uppercase font-bold">Allocated</span>
                        <span className="font-mono font-semibold text-amber-700">{alreadyAllocated.toFixed(2)} MT</span>
                      </div>
                      <div className="border-l border-gray-200 pl-3">
                        <span className="text-gray-400 block text-[9px] uppercase font-bold">Pending</span>
                        <span className={`font-mono font-bold ${availableAllocatable > 0 ? "text-emerald-700" : "text-gray-400"}`}>
                          {availableAllocatable.toFixed(2)} MT
                        </span>
                      </div>
                    </div>

                    {/* Quantity Input when selected */}
                    {isSelected && (
                      <div className="flex items-center gap-1.5 bg-blue-50/70 p-1.5 rounded-xl border border-blue-200">
                        <span className="text-[10px] font-bold text-[#007aff] uppercase px-1">Allocated MT:</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max={availableAllocatable || totalShipmentQty}
                          value={currentAllocatedInput === 0 ? "" : currentAllocatedInput}
                          onChange={(e) => handleQtyChange(sId, e.target.value)}
                          className="w-24 px-2 py-1 text-xs font-mono font-bold text-gray-900 bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007aff]/30"
                          placeholder="0.00"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {!loading && filteredShipments.length === 0 && (
            <div className="py-16 text-center text-gray-400 space-y-2">
              <Ship className="h-8 w-8 mx-auto text-gray-300 stroke-[1.2]" />
              <p className="text-xs font-semibold text-gray-600">No eligible shipments found</p>
              <p className="text-[11px] text-gray-400 max-w-xs mx-auto">
                No shipments matching {productItem?.productName || "selected product"} with available allocatable quantity were found.
              </p>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#007aff] hover:bg-blue-600 rounded-xl transition-colors shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="h-4 w-4" />
            <span>Apply Allocations ({Object.keys(selectedAllocations).length} Shipments, {totalAssignedQty.toFixed(2)} MT)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
