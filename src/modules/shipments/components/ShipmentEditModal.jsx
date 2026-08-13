"use client";
import React, { useState, useEffect } from "react";
import { X, Check, Loader2 } from "lucide-react";
import { shipmentsApi } from "../services/shipmentsApi";
import { toast } from "sonner";

const WORKFLOW_STATUSES = [
  "Scheduled",
  "Ready",
  "Stuffing",
  "Dispatched",
  "In Transit",
  "At Port",
  "Sailed",
  "Arrived",
  "Delivered",
  "Cancelled"
];

export default function ShipmentEditModal({ shipment, isOpen, onClose, onSaveSuccess }) {
  const [form, setForm] = useState({
    shipmentDate: "",
    noOfContainers: "",
    quantity: "",
    ratePerMt: "",
    purchaseRate: "",
    forex: "",
    freight: "",
    status: "Scheduled",
    remarks: "",
    shipmentNo: ""
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (shipment) {
      setForm({
        shipmentDate: shipment.shipmentDate || "",
        noOfContainers: shipment.noOfContainers || "",
        quantity: shipment.quantity || "",
        ratePerMt: shipment.ratePerMt || "",
        purchaseRate: shipment.purchaseRate || "",
        forex: shipment.forex || "",
        freight: shipment.freight || "",
        status: shipment.status || "Scheduled",
        remarks: shipment.remarks || "",
        shipmentNo: shipment.shipmentNo || ""
      });
      setErrors({});
    }
  }, [shipment]);

  if (!isOpen || !shipment) return null;

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Validations
    const errs = {};
    if (!form.shipmentDate) errs.shipmentDate = "Shipment date is required";
    if (!form.quantity || parseFloat(form.quantity) <= 0) errs.quantity = "Quantity must be greater than 0";
    if (form.noOfContainers !== "" && parseInt(form.noOfContainers, 10) < 0) {
      errs.noOfContainers = "Containers count cannot be negative";
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        shipmentDate: form.shipmentDate,
        quantity: parseFloat(form.quantity),
        noOfContainers: form.noOfContainers ? parseInt(form.noOfContainers, 10) : null,
        ratePerMt: form.ratePerMt ? parseFloat(form.ratePerMt) : null,
        purchaseRate: form.purchaseRate ? parseFloat(form.purchaseRate) : null,
        forex: form.forex ? parseFloat(form.forex) : null,
        freight: form.freight ? parseFloat(form.freight) : null,
        status: form.status,
        remarks: form.remarks || null,
        shipmentNo: form.shipmentNo ? parseInt(form.shipmentNo, 10) : null
      };

      const res = await shipmentsApi.updateShipment(shipment.id, payload);
      toast.success("Shipment record updated successfully");
      onSaveSuccess(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update shipment records.");
    } finally {
      setIsSaving(false);
    }
  };

  const labelCls = "block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5";
  const inpCls = "w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] bg-white transition-all";
  const errCls = "text-[10px] text-red-500 mt-1";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-xl mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/60">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Edit Shipment Operational Details</h3>
            <p className="text-[10px] text-gray-400 font-mono mt-0.5">{shipment.shipmentReference}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave}>
          <div className="p-5 max-h-[70vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Shipment Number */}
            <div>
              <label className={labelCls}>Shipment No</label>
              <input
                type="number"
                min={1}
                value={form.shipmentNo}
                onChange={(e) => handleInputChange("shipmentNo", e.target.value)}
                className={inpCls}
              />
            </div>

            {/* Status */}
            <div>
              <label className={labelCls}>Workflow Status</label>
              <div className="relative">
                <select
                  value={form.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className={`${inpCls} appearance-none pr-8`}
                >
                  {WORKFLOW_STATUSES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</span>
              </div>
            </div>

            {/* Shipment Date */}
            <div>
              <label className={labelCls}>Shipment Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                value={form.shipmentDate}
                onChange={(e) => handleInputChange("shipmentDate", e.target.value)}
                className={`${inpCls} ${errors.shipmentDate ? "border-red-300" : ""}`}
              />
              {errors.shipmentDate && <p className={errCls}>{errors.shipmentDate}</p>}
            </div>

            {/* Containers */}
            <div>
              <label className={labelCls}>Containers Count</label>
              <input
                type="number"
                min={0}
                placeholder="0"
                value={form.noOfContainers}
                onChange={(e) => handleInputChange("noOfContainers", e.target.value)}
                className={`${inpCls} ${errors.noOfContainers ? "border-red-300" : ""}`}
              />
              {errors.noOfContainers && <p className={errCls}>{errors.noOfContainers}</p>}
            </div>

            {/* Quantity */}
            <div>
              <label className={labelCls}>Quantity (MT) <span className="text-red-500">*</span></label>
              <input
                type="number"
                step="0.01"
                min={0.01}
                placeholder="0.00"
                value={form.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                className={`${inpCls} ${errors.quantity ? "border-red-300" : ""}`}
              />
              {errors.quantity && <p className={errCls}>{errors.quantity}</p>}
            </div>

            {/* Rate */}
            <div>
              <label className={labelCls}>Selling Rate / MT ({shipment.salesContract?.currencyCode})</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={form.ratePerMt}
                onChange={(e) => handleInputChange("ratePerMt", e.target.value)}
                className={inpCls}
              />
            </div>

            {/* Purchase Rate */}
            <div>
              <label className={labelCls}>Purchase Rate / MT ({shipment.salesContract?.currencyCode})</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={form.purchaseRate}
                onChange={(e) => handleInputChange("purchaseRate", e.target.value)}
                className={inpCls}
              />
            </div>

            {/* Freight */}
            <div>
              <label className={labelCls}>Freight Charge</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={form.freight}
                onChange={(e) => handleInputChange("freight", e.target.value)}
                className={inpCls}
              />
            </div>

            {/* Forex */}
            <div>
              <label className={labelCls}>Forex Conversion Rate</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={form.forex}
                onChange={(e) => handleInputChange("forex", e.target.value)}
                className={inpCls}
              />
            </div>

            {/* Remarks */}
            <div className="sm:col-span-2">
              <label className={labelCls}>Remarks</label>
              <textarea
                placeholder="Enter shipment notes, tracking details..."
                value={form.remarks}
                onChange={(e) => handleInputChange("remarks", e.target.value)}
                rows={3}
                className={`${inpCls} resize-none`}
              />
            </div>

          </div>

          {/* Footer actions */}
          <div className="flex-shrink-0 px-5 py-4 border-t border-gray-100 bg-gray-50/60 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#007aff] hover:bg-blue-600 rounded-xl flex items-center gap-1.5 shadow-sm shadow-blue-500/10 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
              Save Changes
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
