"use client";
import React from "react";
import { Search, X } from "lucide-react";

export default function EnquiriesFilter({ search, setSearch, setPage, total, createdBy, setCreatedBy, productId, setProductId, masters }) {
  return (
    <div className="px-5 py-3.5 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <div className="flex-1 relative min-w-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by enquiry number..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-9 pr-8 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] transition-all"
        />
        {search && (
          <button
            onClick={() => { setSearch(""); setPage(1); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <select
          value={productId || ""}
          onChange={(e) => { setProductId(e.target.value); setPage(1); }}
          className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] transition-all max-w-[150px] truncate"
        >
          <option value="">All Products</option>
          {masters?.products?.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <select
          value={createdBy || ""}
          onChange={(e) => { setCreatedBy(e.target.value); setPage(1); }}
          className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] transition-all max-w-[150px] truncate"
        >
          <option value="">All Creators</option>
          {masters?.users?.map(u => (
            <option key={u.value} value={u.value}>{u.label}</option>
          ))}
        </select>
      </div>

      <span className="text-[11px] font-semibold text-gray-400 whitespace-nowrap">
        {total} enquir{total !== 1 ? "ies" : "y"}
      </span>
    </div>
  );
}
