"use client";
import React, { useState } from "react";
import { DollarSign, ChevronDown } from "lucide-react";
import { PORTS_BY_COUNTRY } from "@/constants/portsData";

export default function CommercialSection({ form, setForm, errors, masters, isView }) {
  const inp = "w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] bg-white transition-all";
  const lbl = "block text-[11px] font-semibold text-gray-600 mb-1.5";
  const err = "text-[10px] text-red-500 mt-1";

  const originCountry = masters.countries.find(c => c.id === form.originCountryId);
  const destCountry = masters.countries.find(c => c.id === form.destinationCountryId);
  const originCode = originCountry?.code || originCountry?.iso2Code || originCountry?.iso2 || "";
  const destCode = destCountry?.code || destCountry?.iso2Code || destCountry?.iso2 || "";
  const originPorts = PORTS_BY_COUNTRY[originCode] || [];
  const destPorts = PORTS_BY_COUNTRY[destCode] || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2.5">
        <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
          <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900">Commercial Details</h2>
          <p className="text-[10px] text-gray-400">Shipment, payment, and currency terms</p>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Origin Country */}
        <div>
          <label className={lbl}>Shipment From (Country) <span className="text-red-500">*</span></label>
          <div className="relative">
            <select
              value={form.originCountryId || ""}
              onChange={e => setForm(f => ({ ...f, originCountryId: e.target.value ? Number(e.target.value) : "", portOfLoading: "" }))}
              disabled={isView}
              className={`${inp} appearance-none pr-8 ${errors.originCountryId ? "border-red-300" : ""}`}
            >
              <option value="">Select Origin Country</option>
              {masters.countries.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
          </div>
          {errors.originCountryId && <p className={err}>{errors.originCountryId}</p>}
        </div>

        {/* Port of Loading */}
        <div>
          <label className={lbl}>Port of Loading</label>
          <div className="relative">
            <select
              value={form.portOfLoading || ""}
              onChange={e => setForm(f => ({ ...f, portOfLoading: e.target.value }))}
              disabled={isView || !originCode}
              className={`${inp} appearance-none pr-8 disabled:opacity-60`}
            >
              <option value="">{originCode ? "Select Port of Loading" : "Select origin country first"}</option>
              {originPorts.map(p => (
                <option key={p.code} value={p.name}>{p.name}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
          </div>
        </div>

        {/* Destination Country */}
        <div>
          <label className={lbl}>Destination Country <span className="text-red-500">*</span></label>
          <div className="relative">
            <select
              value={form.destinationCountryId || ""}
              onChange={e => setForm(f => ({ ...f, destinationCountryId: e.target.value ? Number(e.target.value) : "", portOfDischarge: "" }))}
              disabled={isView}
              className={`${inp} appearance-none pr-8 ${errors.destinationCountryId ? "border-red-300" : ""}`}
            >
              <option value="">Select Destination Country</option>
              {masters.countries.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
          </div>
          {errors.destinationCountryId && <p className={err}>{errors.destinationCountryId}</p>}
        </div>

        {/* Port of Discharge */}
        <div>
          <label className={lbl}>Port of Discharge</label>
          <div className="relative">
            <select
              value={form.portOfDischarge || ""}
              onChange={e => setForm(f => ({ ...f, portOfDischarge: e.target.value }))}
              disabled={isView || !destCode}
              className={`${inp} appearance-none pr-8 disabled:opacity-60`}
            >
              <option value="">{destCode ? "Select Port of Discharge" : "Select destination country first"}</option>
              {destPorts.map(p => (
                <option key={p.code} value={p.name}>{p.name}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
          </div>
        </div>

        {/* Shipment Type */}
        <div>
          <label className={lbl}>Shipment Type <span className="text-red-500">*</span></label>
          <div className="relative">
            <select
              value={form.shipmentTypeId || ""}
              onChange={e => setForm(f => ({ ...f, shipmentTypeId: e.target.value ? Number(e.target.value) : "" }))}
              disabled={isView}
              className={`${inp} appearance-none pr-8 ${errors.shipmentTypeId ? "border-red-300" : ""}`}
            >
              <option value="">Select Shipment Type</option>
              {masters.shipmentTypes.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
          </div>
          {errors.shipmentTypeId && <p className={err}>{errors.shipmentTypeId}</p>}
        </div>

        {/* Payment Terms */}
        <div>
          <label className={lbl}>Payment Terms <span className="text-red-500">*</span></label>
          <div className="relative">
            <select
              value={form.paymentTermId || ""}
              onChange={e => setForm(f => ({ ...f, paymentTermId: e.target.value ? Number(e.target.value) : "" }))}
              disabled={isView}
              className={`${inp} appearance-none pr-8 ${errors.paymentTermId ? "border-red-300" : ""}`}
            >
              <option value="">Select Payment Terms</option>
              {masters.paymentTerms.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
          </div>
          {errors.paymentTermId && <p className={err}>{errors.paymentTermId}</p>}
        </div>

        {/* Currency */}
        <div>
          <label className={lbl}>Currency <span className="text-red-500">*</span></label>
          <div className="relative">
            <select
              value={form.currencyCode || ""}
              onChange={e => setForm(f => ({ ...f, currencyCode: e.target.value }))}
              disabled={isView}
              className={`${inp} appearance-none pr-8 ${errors.currencyCode ? "border-red-300" : ""}`}
            >
              <option value="">Select Currency</option>
              {masters.currencies.map(c => (
                <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
          </div>
          {errors.currencyCode && <p className={err}>{errors.currencyCode}</p>}
        </div>
      </div>
    </div>
  );
}
