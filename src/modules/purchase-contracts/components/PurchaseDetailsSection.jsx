"use client";
import React from "react";
import { DollarSign, ChevronDown } from "lucide-react";

export default function PurchaseDetailsSection({
  form,
  setForm,
  masters,
  isView = false,
}) {
  const inp =
    "w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] bg-white transition-all";
  const lbl = "block text-[11px] font-semibold text-gray-600 mb-1.5";

  const shipmentTypeOptions = (masters?.shipmentTypes && Array.isArray(masters.shipmentTypes))
    ? masters.shipmentTypes.map((s) => ({ id: s.id || s.name, name: s.name }))
    : [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      {/* Section Header */}
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2.5">
        <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
          <DollarSign className="h-3.5 w-3.5 text-[#007aff]" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900">Purchase Details</h2>
          <p className="text-[10px] text-gray-400">
            Procurement terms, rates, forex, and supplier arrangements
          </p>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Row 1: Supplier & Broker */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Supplier */}
          <div>
            <label className={lbl}>Supplier / Exporter</label>
            <input
              type="text"
              value={form.supplierName || ""}
              readOnly
              className={`${inp} bg-gray-50 text-gray-700 font-semibold`}
            />
          </div>

          {/* Broker */}
          <div>
            <label className={lbl}>Broker / Agent</label>
            <input
              type="text"
              value={form.brokerName || ""}
              readOnly
              className={`${inp} bg-gray-50 text-gray-700`}
            />
          </div>
        </div>

        {/* Row 2: Rates & Financial Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
          {/* Purchase Currency */}
          <div>
            <label className={lbl}>Purchase Currency</label>
            <input
              type="text"
              value={form.currencyCode || ""}
              readOnly
              className={`${inp} bg-white font-mono font-bold text-gray-800`}
            />
          </div>

          {/* Purchase Rate */}
          <div>
            <label className={lbl}>Avg Purchase Rate / MT</label>
            <input
              type="text"
              value={form.avgPurchaseRate ? `${Number(form.avgPurchaseRate).toFixed(2)}` : ""}
              readOnly
              className={`${inp} bg-white font-mono font-bold text-gray-800`}
            />
          </div>

          {/* Freight Charge */}
          <div>
            <label className={lbl}>Freight Commitment</label>
            <input
              type="text"
              value={form.totalFreight ? `${Number(form.totalFreight).toFixed(2)}` : ""}
              readOnly
              className={`${inp} bg-white font-mono font-semibold text-gray-700`}
            />
          </div>

          {/* Forex Conversion */}
          <div>
            <label className={lbl}>Forex Conversion Rate</label>
            <input
              type="text"
              value={form.avgForex ? `${Number(form.avgForex).toFixed(4)}` : ""}
              readOnly
              className={`${inp} bg-white font-mono font-semibold text-gray-700`}
            />
          </div>
        </div>

        {/* Row 3: Incoterm & Payment Terms */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Incoterm */}
          <div>
            <label className={lbl}>Incoterm</label>
            <input
              type="text"
              value={form.incoterm || ""}
              readOnly
              className={`${inp} bg-gray-50 font-medium text-gray-800`}
            />
          </div>

          {/* Payment Terms */}
          <div>
            <label className={lbl}>Payment Terms</label>
            <input
              type="text"
              value={form.paymentTermsName || ""}
              readOnly
              className={`${inp} bg-gray-50 font-medium text-gray-800`}
            />
          </div>

          {/* Delivery Period */}
          <div>
            <label className={lbl}>Delivery / Dispatch Period</label>
            <input
              type="text"
              value={form.deliveryPeriod || ""}
              readOnly
              className={`${inp} bg-gray-50 text-gray-700`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
