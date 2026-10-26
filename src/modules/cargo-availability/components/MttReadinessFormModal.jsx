"use client";
import React, { useState } from "react";
import { X, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { cargoAvailabilityApi } from "../services/cargoAvailabilityApi";
import { toast } from "sonner";

export default function MttReadinessFormModal({
  cargoRecord,
  shipment = null,
  onClose,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const targetShipment = shipment || cargoRecord?.currentShipment || null;
  const isLinkedToCurrentShipment = Boolean(targetShipment);

  const contract = cargoRecord?.purchaseContract || {};
  const product = cargoRecord?.product || {};
  const supplierName = contract.seller?.entityName || "—";
  const businessRef =
    cargoRecord?.businessReference ||
    cargoRecord?.businessTransaction?.businessReference ||
    contract.businessReference ||
    targetShipment?.businessReference ||
    "—";
  const contractNo =
    contract.contractNumber || `PC-${contract.id || cargoRecord?.purchaseContractId || ""}`;
  const productName = product.name || cargoRecord?.purchaseContractItem?.productName || "Product";

  const allocatedQty = Number(cargoRecord?.allocatedQty || 0);
  const hasAllocations = allocatedQty > 0;
  const hasBlockingAllocations = hasAllocations && !isLinkedToCurrentShipment;

  // Initial status correctly recognizing active readiness and shipment allocation state
  const isAlreadyReady =
    (isLinkedToCurrentShipment && Boolean(targetShipment.cargoReady)) ||
    Boolean(cargoRecord?.isReady) ||
    cargoRecord?.status === "Ready" ||
    cargoRecord?.status === "Allocated" ||
    cargoRecord?.status === "Partially Allocated" ||
    cargoRecord?.status === "Fully Allocated" ||
    cargoRecord?.status === "Loading" ||
    cargoRecord?.status === "Dispatched" ||
    cargoRecord?.status === "Completed";

  const initialStatus = isAlreadyReady ? "Ready" : "Not Ready";

  const [status, setStatus] = useState(initialStatus);
  const [readyDate, setReadyDate] = useState(
    cargoRecord?.readyDate || new Date().toISOString().split("T")[0]
  );
  const [remarks, setRemarks] = useState(cargoRecord?.remarks || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (status === "Not Ready" && hasBlockingAllocations) {
      const msg = `Cannot mark cargo as Not Ready because ${allocatedQty.toLocaleString()} MT is actively allocated to other shipment(s). Please cancel active allocations first.`;
      setError(msg);
      toast.error(msg);
      return;
    }

    if (status === "Ready" && !readyDate) {
      setError("Please select a Ready Date.");
      toast.error("Please select a Ready Date.");
      return;
    }

    try {
      setLoading(true);
      const res = await cargoAvailabilityApi.createReadiness({
        cargoAvailabilityId: cargoRecord.id && !isNaN(Number(cargoRecord.id)) ? Number(cargoRecord.id) : null,
        status,
        readyDate: readyDate || new Date().toISOString().split("T")[0],
        remarks: remarks?.trim() || null,
        shipmentId: targetShipment?.id || null,
      });
      toast.success("Cargo readiness updated successfully.");
      onSuccess?.(res?.data || res);
      onClose?.();
    } catch (err) {
      console.error("Failed to update readiness status", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to update readiness status.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!cargoRecord) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-slate-100">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-emerald-50/70 border-b border-emerald-100 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">MTT Cargo Readiness</h2>
                <p className="text-xs text-gray-500 font-medium">
                  Confirm cargo readiness for allocation and loading
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

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Read-Only Contract Information Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Purchase Contract No.
                  </span>
                  <span className="font-bold text-slate-900 mt-0.5 block">
                    {contractNo}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Business Ref
                  </span>
                  <span className="font-mono font-semibold text-indigo-700 mt-0.5 block">
                    {businessRef}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-200/80">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Supplier
                  </span>
                  <span className="font-semibold text-slate-800 mt-0.5 block truncate" title={supplierName}>
                    {supplierName}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Product
                  </span>
                  <span className="font-semibold text-slate-800 mt-0.5 block truncate" title={productName}>
                    {productName}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Purchase Quantity
                </span>
                <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">
                  {Number(cargoRecord.purchaseQty || 0).toLocaleString()} MT
                </div>
              </div>
            </div>

            {/* Ready Status (Clean Toggle Selection) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                Ready Status <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Ready Option */}
                <label
                  onClick={() => setStatus("Ready")}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 cursor-pointer transition-all ${
                    status === "Ready"
                      ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-xs"
                      : "bg-white border-slate-200 text-slate-600 font-medium hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="readyStatus"
                    value="Ready"
                    checked={status === "Ready"}
                    onChange={() => setStatus("Ready")}
                    className="text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <CheckCircle2
                    className={`h-4 w-4 ${status === "Ready" ? "text-emerald-600" : "text-slate-400"}`}
                  />
                  <span className="text-xs">Ready</span>
                </label>

                {/* Not Ready Option */}
                <label
                  onClick={() => {
                    if (hasBlockingAllocations) {
                      toast.error(`Cannot mark as Not Ready: ${allocatedQty.toLocaleString()} MT is actively allocated to other shipments.`);
                      return;
                    }
                    setStatus("Not Ready");
                  }}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all ${
                    hasBlockingAllocations
                      ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60"
                      : status === "Not Ready"
                        ? "bg-amber-50 border-amber-500 text-amber-900 font-bold shadow-xs cursor-pointer"
                        : "bg-white border-slate-200 text-slate-600 font-medium hover:border-slate-300 cursor-pointer"
                  }`}
                  title={hasBlockingAllocations ? `Cannot mark as Not Ready: ${allocatedQty.toLocaleString()} MT is actively allocated to other shipments.` : ""}
                >
                  <input
                    type="radio"
                    name="readyStatus"
                    value="Not Ready"
                    disabled={hasBlockingAllocations}
                    checked={status === "Not Ready"}
                    onChange={() => {
                      if (!hasBlockingAllocations) setStatus("Not Ready");
                    }}
                    className="text-amber-600 focus:ring-amber-500 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <Clock
                    className={`h-4 w-4 ${status === "Not Ready" ? "text-amber-600" : "text-slate-400"}`}
                  />
                  <span className="text-xs">Not Ready</span>
                </label>
              </div>

              {hasBlockingAllocations && (
                <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800 flex items-start gap-2">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
                  <span>
                    This cargo currently has <strong>${allocatedQty.toLocaleString()} MT</strong> actively allocated to other shipments.
                  </span>
                </div>
              )}
            </div>

            {/* Date Input (Shown when Ready) */}
            {status === "Ready" && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ready Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={readyDate}
                  onChange={(e) => setReadyDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium text-slate-800"
                />
              </div>
            )}

            {/* Remarks Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Remarks <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                rows={3}
                placeholder="Enter readiness notes, warehouse confirmation, inspection notes..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-800 font-medium placeholder-slate-400"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                {loading ? "Saving..." : "Save Readiness"}
              </button>
            </div>
          </form>

        </div>
      </div>
    </>
  );
}
