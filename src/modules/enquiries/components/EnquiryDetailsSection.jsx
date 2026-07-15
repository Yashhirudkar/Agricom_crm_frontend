"use client";
import React from "react";
import { Package, ChevronDown } from "lucide-react";
import { PORTS_BY_COUNTRY } from "@/constants/portsData";

export default function EnquiryDetailsSection({ form, setForm, errors, masters = {}, isView }) {
  const {
    partners = [],
    countries = [],
    partnerRoles = [],
    products = [],
    packingTypes = [],
    shipmentTypes = []
  } = masters || {};

  const inp = "w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] bg-white transition-all";
  const lbl = "block text-[11px] font-semibold text-gray-600 mb-1.5";
  const err = "text-[10px] text-red-500 mt-1";

  // Filter partners based on selected role
  const rolePartners = form.partnerRoleId
    ? partners.filter(p => p.partnerRoleId === form.partnerRoleId)
    : [];

  // Port logic based on Origin Country
  const originCountry = countries.find(c => c.id === form.originCountryId);
  const originCode = originCountry?.code || originCountry?.iso2Code || originCountry?.iso2 || "";
  const originPorts = PORTS_BY_COUNTRY[originCode] || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2.5">
        <div className="h-7 w-7 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
          <Package className="h-3.5 w-3.5 text-orange-600" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900">Enquiry Details</h2>
          <p className="text-[10px] text-gray-400">Partner, product, and shipping requirements</p>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Partner Role */}
        <div>
          <label className={lbl}>Partner Role <span className="text-red-500">*</span></label>
          <div className="relative">
            <select
              value={form.partnerRoleId || ""}
              onChange={e => setForm(f => ({ ...f, partnerRoleId: e.target.value ? Number(e.target.value) : "", partnerId: "" }))}
              disabled={isView}
              className={`${inp} appearance-none pr-8 ${errors.partnerRoleId ? "border-red-300" : ""}`}
            >
              <option value="">Select Role</option>
              {partnerRoles.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
          </div>
          {errors.partnerRoleId && <p className={err}>{errors.partnerRoleId}</p>}
        </div>

        {/* Partner */}
        <div>
          <label className={lbl}>Partner <span className="text-red-500">*</span></label>
          <div className="relative">
            <select
              value={form.partnerId || ""}
              onChange={e => setForm(f => ({ ...f, partnerId: e.target.value ? Number(e.target.value) : "" }))}
              disabled={isView || !form.partnerRoleId}
              className={`${inp} appearance-none pr-8 disabled:opacity-60 ${errors.partnerId ? "border-red-300" : ""}`}
            >
              <option value="">{form.partnerRoleId ? "Select Partner" : "Select Role first"}</option>
              {rolePartners.map(p => (
                <option key={p.id} value={p.id}>{p.entityName}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
          </div>
          {errors.partnerId && <p className={err}>{errors.partnerId}</p>}
        </div>

        {/* Product */}
        <div>
          <label className={lbl}>Product <span className="text-red-500">*</span></label>
          <div className="relative">
            <select
              value={form.productId || ""}
              onChange={e => setForm(f => ({ ...f, productId: e.target.value ? Number(e.target.value) : "" }))}
              disabled={isView}
              className={`${inp} appearance-none pr-8 ${errors.productId ? "border-red-300" : ""}`}
            >
              <option value="">Select Product</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
          </div>
          {errors.productId && <p className={err}>{errors.productId}</p>}
        </div>

        {/* Origin Country */}
        <div>
          <label className={lbl}>Origin Country</label>
          <div className="relative">
            <select
              value={form.originCountryId || ""}
              onChange={e => setForm(f => ({ ...f, originCountryId: e.target.value ? Number(e.target.value) : "", podPort: "" }))}
              disabled={isView}
              className={`${inp} appearance-none pr-8`}
            >
              <option value="">Select Origin Country</option>
              {countries.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
          </div>
        </div>

        {/* Port of Discharge (podPort) */}
        <div>
          <label className={lbl}>Port (POD / POL)</label>
          <div className="relative">
            <select
              value={form.podPort || ""}
              onChange={e => setForm(f => ({ ...f, podPort: e.target.value }))}
              disabled={isView || !originCode}
              className={`${inp} appearance-none pr-8 disabled:opacity-60`}
            >
              <option value="">{originCode ? "Select Port" : "Select Origin Country first"}</option>
              {originPorts.map(p => (
                <option key={p.code} value={p.name}>{p.name}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
          </div>
        </div>

        {/* Packing Type */}
        <div>
          <label className={lbl}>Packing Type</label>
          <div className="relative">
            <select
              value={form.packingTypeId || ""}
              onChange={e => setForm(f => ({ ...f, packingTypeId: e.target.value ? Number(e.target.value) : "" }))}
              disabled={isView}
              className={`${inp} appearance-none pr-8`}
            >
              <option value="">Select Packing Type</option>
              {packingTypes.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
          </div>
        </div>

        {/* Purity */}
        <div>
          <label className={lbl}>Purity</label>
          <div className="relative">
            <select
              value={form.purity || ""}
              onChange={e => setForm(f => ({ ...f, purity: e.target.value }))}
              disabled={isView}
              className={`${inp} appearance-none pr-8`}
            >
              <option value="">Select Purity</option>
              <option value="99.99%">99.99%</option>
              <option value="99%">99%</option>
              <option value="98%">98%</option>
              <option value="97%">97%</option>
              <option value="96%">96%</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
          </div>
        </div>

        {/* Shipment Type */}
        <div>
          <label className={lbl}>Shipment Type</label>
          <div className="relative">
            <select
              value={form.shipmentType || ""}
              onChange={e => setForm(f => ({ ...f, shipmentType: e.target.value }))}
              disabled={isView}
              className={`${inp} appearance-none pr-8`}
            >
              <option value="">Select Shipment Type</option>
              <option value="FCL">FCL</option>
              <option value="VESSEL">VESSEL</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
          </div>
        </div>

        {/* Shipment Date */}
        <div>
          <label className={lbl}>Expected Shipment Date</label>
          <input
            type="date"
            value={form.shipmentDate}
            onChange={e => setForm(f => ({ ...f, shipmentDate: e.target.value }))}
            disabled={isView}
            className={inp}
          />
        </div>

        {/* Quantity */}
        <div>
          <label className={lbl}>Quantity (MT)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.quantity || ""}
            onChange={e => setForm(f => ({ ...f, quantity: e.target.value ? Number(e.target.value) : "" }))}
            disabled={isView}
            placeholder="0.00"
            className={inp}
          />
        </div>

        {/* Buying Interest */}
        <div>
          <label className={lbl}>Bid</label>
          <input
            type="number"
            min="0"
            max="100"
            value={form.buyingInterest || ""}
            onChange={e => setForm(f => ({ ...f, buyingInterest: e.target.value ? Number(e.target.value) : "" }))}
            disabled={isView}
            placeholder="e.g. 75"
            className={inp}
          />
        </div>

        {/* Potential Enquiry */}
        <div className="flex items-center pt-5">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                checked={form.potentialEnquiry}
                onChange={e => setForm(f => ({ ...f, potentialEnquiry: e.target.checked }))}
                disabled={isView}
                className="peer sr-only"
              />
              <div className="w-4 h-4 border-2 border-gray-300 rounded bg-white transition-all peer-checked:bg-[#007aff] peer-checked:border-[#007aff] group-hover:border-[#007aff]"></div>
              <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none">
                <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[11px] font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">
              Mark as High Potential
            </span>
          </label>
        </div>

      </div>
    </div>
  );
}
