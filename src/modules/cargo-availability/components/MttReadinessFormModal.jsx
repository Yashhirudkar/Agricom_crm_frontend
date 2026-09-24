"use client";
import React, { useState } from "react";
import { X, CheckCircle2, ShieldCheck } from "lucide-react";
import { cargoAvailabilityApi } from "../services/cargoAvailabilityApi";

export default function MttReadinessFormModal({ cargoRecord, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const contract = cargoRecord?.purchaseContract || {};
  const product = cargoRecord?.product || {};

  const [formData, setFormData] = useState({
    cargoAvailabilityId: cargoRecord?.id,
    warehouseName: "",
    readyDate: new Date().toISOString().split("T")[0],
    readyQty: "",
    bagBulk: "Bag",
    uom: "MT",
    lotNumber: "",
    batchNumber: "",
    stackNumber: "",
    storageLocation: "",
    moisture: "",
    foreignMatter: "",
    qualityGrade: "",
    inspectionStatus: "Passed",
    qcRemarks: "",
    remarks: "",
    internalNotes: "",
    status: "Pending Approval",
  });

  const handleChange = (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.readyQty || Number(formData.readyQty) <= 0) {
      setError("Please enter a valid Ready Quantity (> 0).");
      return;
    }

    try {
      setLoading(true);
      await cargoAvailabilityApi.createReadiness({
        ...formData,
        readyQty: Number(formData.readyQty),
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to add readiness entry", err);
      setError(err.response?.data?.message || "Failed to create readiness entry.");
    } finally {
      setLoading(false);
    }
  };

  if (!cargoRecord) return null;

  return (
    <>
      <div className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-xs animate-in fade-in duration-200" onClick={onClose} />
      <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-emerald-50/60 border-b border-emerald-100 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">MTT Readiness Entry</h2>
                <p className="text-xs text-gray-500 font-medium">
                  {contract.contractNumber || `PC-${contract.id}`} &bull; {product.name || "Product"}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold">
                {error}
              </div>
            )}

            {/* Read-Only Summary */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 grid grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Purchase Contract</span>
                <div className="font-bold text-gray-900 mt-0.5">{contract.contractNumber || `PC-${contract.id}`}</div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Supplier</span>
                <div className="font-bold text-gray-900 mt-0.5">{contract.seller?.entityName || "—"}</div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Purchase Qty</span>
                <div className="font-bold text-gray-900 mt-0.5">{cargoRecord.purchaseQty} MT</div>
              </div>
            </div>

            {/* Section 1: General Readiness */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                General Readiness
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Warehouse Name / Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. WH-A Main Storage"
                    value={formData.warehouseName}
                    onChange={(e) => handleChange("warehouseName", e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Ready Date</label>
                  <input
                    type="date"
                    required
                    value={formData.readyDate}
                    onChange={(e) => handleChange("readyDate", e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Ready Quantity</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 50"
                    value={formData.readyQty}
                    onChange={(e) => handleChange("readyQty", e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Packaging</label>
                  <select
                    value={formData.bagBulk}
                    onChange={(e) => handleChange("bagBulk", e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 font-semibold"
                  >
                    <option value="Bag">Bag</option>
                    <option value="Bulk">Bulk</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">UOM</label>
                  <input
                    type="text"
                    value={formData.uom}
                    onChange={(e) => handleChange("uom", e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Warehouse Identification */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Warehouse Identification
              </h3>
              <div className="grid grid-cols-4 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Lot Number</label>
                  <input
                    type="text"
                    placeholder="LOT-101"
                    value={formData.lotNumber}
                    onChange={(e) => handleChange("lotNumber", e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Batch Number</label>
                  <input
                    type="text"
                    placeholder="BATCH-A"
                    value={formData.batchNumber}
                    onChange={(e) => handleChange("batchNumber", e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Stack Number</label>
                  <input
                    type="text"
                    placeholder="STACK-05"
                    value={formData.stackNumber}
                    onChange={(e) => handleChange("stackNumber", e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Storage Location</label>
                  <input
                    type="text"
                    placeholder="Bay 3"
                    value={formData.storageLocation}
                    onChange={(e) => handleChange("storageLocation", e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Quality Parameters */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Quality Inspection Parameters
              </h3>
              <div className="grid grid-cols-4 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Moisture (%)</label>
                  <input
                    type="text"
                    placeholder="12%"
                    value={formData.moisture}
                    onChange={(e) => handleChange("moisture", e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Foreign Matter (%)</label>
                  <input
                    type="text"
                    placeholder="1.5%"
                    value={formData.foreignMatter}
                    onChange={(e) => handleChange("foreignMatter", e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Quality Grade</label>
                  <input
                    type="text"
                    placeholder="Grade A"
                    value={formData.qualityGrade}
                    onChange={(e) => handleChange("qualityGrade", e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Inspection Status</label>
                  <select
                    value={formData.inspectionStatus}
                    onChange={(e) => handleChange("inspectionStatus", e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg font-medium"
                  >
                    <option value="Passed">Passed</option>
                    <option value="Pending">Pending Inspection</option>
                    <option value="Conditional">Conditional Pass</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">QC Remarks</label>
                <textarea
                  rows={2}
                  placeholder="Quality inspection notes..."
                  value={formData.qcRemarks}
                  onChange={(e) => handleChange("qcRemarks", e.target.value)}
                  className="w-full p-2 text-xs bg-gray-50 border border-gray-200 rounded-lg"
                />
              </div>
            </div>

            {/* Approval Workflow State */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-0.5">Initial Workflow Status</label>
                <span className="text-[10px] text-gray-400">Approved status adds directly to available stock pool</span>
              </div>
              <select
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg font-bold"
              >
                <option value="Pending Approval">Pending Approval</option>
                <option value="Approved">Approved Immediately</option>
                <option value="Draft">Save as Draft</option>
              </select>
            </div>

            {/* Footer Buttons */}
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
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Saving..." : "Save Readiness Entry"}
              </button>
            </div>

          </form>

        </div>
      </div>
    </>
  );
}
