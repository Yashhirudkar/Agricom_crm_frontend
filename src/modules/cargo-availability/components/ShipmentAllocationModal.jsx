"use client";
import React, { useState, useEffect } from "react";
import { X, Layers, ArrowRight, Lock } from "lucide-react";
import { cargoAvailabilityApi } from "../services/cargoAvailabilityApi";
import axiosClient from "@/lib/axios";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import useFinalizationLock from "@/hooks/useFinalizationLock";
import CompletedBadge from "@/components/badges/CompletedBadge";

export default function ShipmentAllocationModal({
  cargoRecord,
  targetShipment = null,
  defaultShipmentId = null,
  onClose,
  onSuccess,
}) {
  useEscapeKey(onClose, Boolean(cargoRecord));

  const isCargoCompleted =
    cargoRecord?.status === "Completed" ||
    (Number(cargoRecord?.allocatedQty || 0) >= Number(cargoRecord?.purchaseQty || 0) &&
      Number(cargoRecord?.purchaseQty || 0) > 0);

  const { isReadOnly, isOneTimeAllowed, canOverride } = useFinalizationLock({
    status: isCargoCompleted ? "Completed" : cargoRecord?.status,
    module: "cargo_allocation",
    oneTimeEditUsed: cargoRecord?.oneTimeCompletedEditUsed,
  });

  const [loading, setLoading] = useState(false);
  const [shipments, setShipments] = useState([]);
  const initialShipmentId = defaultShipmentId || targetShipment?.id ? String(defaultShipmentId || targetShipment.id) : "";
  const [shipmentId, setShipmentId] = useState(initialShipmentId);
  const initialQty = targetShipment?.quantity
    ? Math.min(Number(targetShipment.quantity), Number(cargoRecord?.availableQty || targetShipment.quantity))
    : "";
  const [allocatedQty, setAllocatedQty] = useState(initialQty ? String(initialQty) : "");
  const [error, setError] = useState("");

  const contract = cargoRecord?.purchaseContract || {};
  const product = cargoRecord?.product || {};

  useEffect(() => {
    if (defaultShipmentId || targetShipment?.id) {
      setShipmentId(String(defaultShipmentId || targetShipment.id));
      if (!allocatedQty && (targetShipment?.quantity || cargoRecord?.availableQty)) {
        const maxAlloc = Math.min(
          Number(targetShipment?.quantity || cargoRecord?.availableQty || 0),
          Number(cargoRecord?.availableQty || targetShipment?.quantity || 0)
        );
        if (maxAlloc > 0) setAllocatedQty(String(maxAlloc));
      }
    }
  }, [defaultShipmentId, targetShipment, cargoRecord]);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const res = await axiosClient.get("/sales-contracts/shipments", {
          params: { limit: 100 },
        });
        setShipments(res.data?.data || res.data || []);
      } catch (err) {
        console.error("Failed to load shipments for allocation", err);
      }
    };
    fetchShipments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isReadOnly) return;
    setError("");

    if (!shipmentId) {
      setError("Please select a target Sales Shipment.");
      return;
    }

    if (!allocatedQty || Number(allocatedQty) <= 0) {
      setError("Please enter a valid Quantity to Allocate (> 0).");
      return;
    }

    if (Number(allocatedQty) > Number(cargoRecord.availableQty)) {
      setError(
        `Cannot allocate ${allocatedQty} MT. Available Cargo is only ${cargoRecord.availableQty} MT.`
      );
      return;
    }

    try {
      setLoading(true);
      const res = await cargoAvailabilityApi.createAllocation({
        cargoAvailabilityId: cargoRecord.id,
        shipmentId: Number(shipmentId),
        allocatedQty: Number(allocatedQty),
      });
      if (onSuccess) {
        onSuccess(
          res?.data || res || { cargoRecord, shipmentId: Number(shipmentId), allocatedQty: Number(allocatedQty) },
          cargoRecord
        );
      }
      onClose();
    } catch (err) {
      console.error("Failed to allocate cargo to shipment", err);
      setError(err.response?.data?.message || "Failed to create shipment allocation.");
    } finally {
      setLoading(false);
    }
  };

  if (!cargoRecord) return null;

  const displayShipments =
    targetShipment && !shipments.some((s) => String(s.id) === String(targetShipment.id))
      ? [targetShipment, ...shipments]
      : shipments;

  return (
    <>
      <div
        className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-slate-100">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-purple-50/70 border-b border-purple-100 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center">
                <Layers className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-gray-900">
                    {isReadOnly ? "View Cargo Allocation" : "Allocate Cargo to Sales Shipment"}
                  </h2>
                  {isCargoCompleted && (
                    <CompletedBadge
                      isReadOnly={isReadOnly}
                      isOneTimeAllowed={isOneTimeAllowed}
                      canOverride={canOverride}
                    />
                  )}
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  {isReadOnly
                    ? "Finalized record locked in read-only mode"
                    : isOneTimeAllowed
                    ? "1 Correction remaining: Saving will permanently lock this record"
                    : "Reserve cargo for customer export delivery"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {isOneTimeAllowed && (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-800 font-semibold flex items-center gap-2">
                <Lock className="h-4 w-4 text-amber-600 shrink-0" />
                <span>You have 1 correction remaining. Saving this allocation will permanently lock this record.</span>
              </div>
            )}

            {isReadOnly && (
              <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold flex items-center gap-2">
                <Lock className="h-4 w-4 text-slate-500 shrink-0" />
                <span>This cargo allocation is completed. Modifying requires the <code>cargo_allocation:edit_completed</code> permission.</span>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold">
                {error}
              </div>
            )}

            {/* Available Cargo Info Card */}
            <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-4 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                  Available Cargo
                </span>
                <div className="text-lg font-extrabold text-purple-900 font-mono mt-0.5">
                  {Number(cargoRecord.availableQty || 0).toLocaleString()} MT
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Product
                </span>
                <div className="font-bold text-slate-800 mt-0.5">
                  {product.name || cargoRecord?.purchaseContractItem?.productName || "Product"}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Sales Shipment <span className="text-red-500">*</span>
              </label>
              {isReadOnly ? (
                <div className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-700 select-none">
                  {displayShipments.find((s) => String(s.id) === String(shipmentId))?.shipmentReference ||
                    (shipmentId ? `Shipment #${shipmentId}` : "—")}
                </div>
              ) : (
                <select
                  required
                  value={shipmentId}
                  onChange={(e) => setShipmentId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 font-medium text-slate-800"
                >
                  <option value="">Select a Sales Contract Shipment...</option>
                  {displayShipments.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.shipmentReference || `Shipment #${s.id}`} &bull;{" "}
                      {s.salesContract?.contractNumber || "SC"} ({Number(s.quantity || 0).toLocaleString()} MT)
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Quantity to Allocate (MT) <span className="text-red-500">*</span>
              </label>
              {isReadOnly ? (
                <div className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-900 font-mono select-none">
                  {allocatedQty ? `${Number(allocatedQty).toLocaleString()} MT` : "— MT"}
                </div>
              ) : (
                <input
                  type="number"
                  step="0.01"
                  required
                  max={cargoRecord.availableQty}
                  placeholder={`Max available: ${Number(cargoRecord.availableQty || 0).toLocaleString()} MT`}
                  value={allocatedQty}
                  onChange={(e) => setAllocatedQty(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 font-bold text-slate-900"
                />
              )}
            </div>

            <div className="text-[11px] text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-purple-500 flex-shrink-0" />
              <span>
                Allocating cargo assigns it to the sales shipment for truck loading.
              </span>
            </div>

            {/* Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                {isReadOnly ? "Close" : "Cancel"}
              </button>
              {!isReadOnly && (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  {loading ? "Allocating..." : isOneTimeAllowed ? "Save Final Allocation" : "Allocate Cargo"}
                </button>
              )}
            </div>
          </form>

        </div>
      </div>
    </>
  );
}
