"use client";
import React from "react";
import { Users, ChevronDown } from "lucide-react";

export default function PartySection({ form, setForm, errors, masters, isView }) {
  const inp = "w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] bg-white transition-all appearance-none";
  const lbl = "block text-[11px] font-semibold text-gray-600 mb-1.5";
  const err = "text-[10px] text-red-500 mt-1";

  const buyers = masters.buyers || [];
  const sellers = masters.sellers || [];
  const brokers = masters.brokers || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2.5">
        <div className="h-7 w-7 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
          <Users className="h-3.5 w-3.5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900">Parties</h2>
          <p className="text-[10px] text-gray-400">Buyer, seller, and broker information</p>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Buyer */}
        <div>
          <label className={lbl}>Buyer <span className="text-red-500">*</span></label>
          <div className="relative">
            <select
              value={form.buyerId || ""}
              onChange={e => setForm(f => ({ ...f, buyerId: e.target.value ? Number(e.target.value) : "" }))}
              disabled={isView || buyers.length === 0}
              className={`${inp} pr-8 ${errors.buyerId ? "border-red-300" : ""}`}
            >
              {buyers.length === 0 ? (
                <option value="">No Buyer Found</option>
              ) : (
                <>
                  <option value="">Select Buyer</option>
                  {buyers.map(p => (
                    <option key={p.id} value={p.id}>{p.name || p.entityName}</option>
                  ))}
                </>
              )}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
          </div>
          {errors.buyerId && <p className={err}>{errors.buyerId}</p>}
        </div>

        {/* Seller */}
        <div>
          <label className={lbl}>Seller <span className="text-red-500">*</span></label>
          <div className="relative">
            <select
              value={form.sellerId || ""}
              onChange={e => setForm(f => ({ ...f, sellerId: e.target.value ? Number(e.target.value) : "" }))}
              disabled={isView || sellers.length === 0}
              className={`${inp} pr-8 ${errors.sellerId ? "border-red-300" : ""}`}
            >
              {sellers.length === 0 ? (
                <option value="">No Seller Found</option>
              ) : (
                <>
                  <option value="">Select Seller</option>
                  {sellers.map(p => (
                    <option key={p.id} value={p.id}>{p.name || p.entityName}</option>
                  ))}
                </>
              )}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
          </div>
          {errors.sellerId && <p className={err}>{errors.sellerId}</p>}
        </div>

        {/* Broker */}
        <div>
          <label className={lbl}>Broker <span className="text-[10px] text-gray-400">(Optional)</span></label>
          <div className="relative">
            <select
              value={form.brokerId || ""}
              onChange={e => setForm(f => ({ ...f, brokerId: e.target.value ? Number(e.target.value) : null }))}
              disabled={isView || brokers.length === 0}
              className={`${inp} pr-8`}
            >
              {brokers.length === 0 ? (
                <option value="">No Broker Found</option>
              ) : (
                <>
                  <option value="">Select Broker (Optional)</option>
                  {brokers.map(p => (
                    <option key={p.id} value={p.id}>{p.name || p.entityName}</option>
                  ))}
                </>
              )}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
