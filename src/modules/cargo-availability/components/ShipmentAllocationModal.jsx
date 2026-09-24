"use client";
import React, { useState, useEffect } from "react";
import { X, Layers, ArrowRight } from "lucide-react";
import { cargoAvailabilityApi } from "../services/cargoAvailabilityApi";
import axiosClient from "@/lib/axios";

export default function ShipmentAllocationModal({ cargoRecord, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [shipments, setShipments] = useState([]);
  const [shipmentId, setShipmentId] = useState("");
  const [allocatedQty, setAllocatedQty] = useState("");
  const [error, setError] = useState("");

  const contract = cargoRecord?.purchaseContract || {};
  const product = cargoRecord?.product || {};

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
    setError("");

    if (!shipmentId) {
      setError("Please select a target Shipment.");
      return;
    }

    if (!allocatedQty || Number(allocatedQty) <= 0) {
      setError("Please enter a valid Allocated Quantity (> 0).");
      return;
    }

    if (Number(allocatedQty) > Number(cargoRecord.availableQty)) {
      setError(`Cannot allocate ${allocatedQty} MT. Available Ready Stock is only ${cargoRecord.availableQty} MT.`);
      return;
    }

    try {
      setLoading(true);
      await cargoAvailabilityApi.createAllocation({
        cargoAvailabilityId: cargoRecord.id,
        shipmentId: Number(shipmentId),
        allocatedQty: Number(allocatedQty),
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to allocate stock to shipment", err);
      setError(err.response?.data?.message || "Failed to create shipment allocation.");
    } finally {
      setLoading(false);
    }
  };

  if (!cargoRecord) return null;

  return (
    <>
      <div className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-xs animate-in fade-in duration-200" onClick={onClose} />
      <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-purple-50/60 border-b border-purple-100 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center">
                <Layers className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Allocate Ready Stock to Shipment</h2>
                <p className="text-xs text-purple-700 font-semibold mt-0.5">
                  FIFO Reservation Strategy Enabled
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold">
                {error}
              </div>
            )}

            {/* Ready Stock Pool Info */}
            <div className="bg-purple-50/40 border border-purple-100 rounded-xl p-3.5 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] font-bold text-purple-600 uppercase">Available Ready Stock</span>
                <div className="text-base font-extrabold text-purple-900 mt-0.5">{cargoRecord.availableQty} MT</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Product</span>
                <div className="font-bold text-gray-800 mt-0.5">{product.name || "Product"}</div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Target Shipment *</label>
              <select
                required
                value={shipmentId}
                onChange={(e) => setShipmentId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 font-medium"
              >
                <option value="">Select a Sales Contract Shipment...</option>
                {shipments.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.shipmentReference || `Shipment #${s.id}`} &bull; {s.salesContract?.contractNumber || "SC"} ({s.quantity} MT)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Quantity to Allocate (MT) *</label>
              <input
                type="number"
                step="0.01"
                required
                max={cargoRecord.availableQty}
                placeholder={`Max available: ${cargoRecord.availableQty} MT`}
                value={allocatedQty}
                onChange={(e) => setAllocatedQty(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 font-bold"
              />
            </div>

            <div className="text-[11px] text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-purple-500 flex-shrink-0" />
              <span>Allocated stock moves status to <strong>Reserved</strong> for truck loading execution.</span>
            </div>

            {/* Buttons */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Allocating..." : "Confirm Stock Allocation"}
              </button>
            </div>
          </form>

        </div>
      </div>
    </>
  );
}
