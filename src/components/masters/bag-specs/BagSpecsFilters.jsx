"use client";

import React from "react";
import { Search, Filter } from "lucide-react";

export default function BagSpecsFilters({
  search,
  setSearch,
  bagTypeFilter,
  setBagTypeFilter,
  packingTypeFilter,
  setPackingTypeFilter,
  isActiveFilter,
  setIsActiveFilter,
  bagTypes,
  packingTypes,
  setCurrentPage,
  totalCount,
}) {
  return (
    <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap gap-3 items-center justify-between">
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            id="bag-spec-search"
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search..."
            className="pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none text-gray-600 bg-white w-44 shadow-sm"
          />
        </div>

        {/* Bag Type Filter */}
        <select
          id="bag-type-filter"
          value={bagTypeFilter}
          onChange={(e) => { setBagTypeFilter(e.target.value); setCurrentPage(1); }}
          className="border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-600 bg-white focus:outline-none shadow-sm"
        >
          <option value="">All Bag Types</option>
          {bagTypes.map((bt) => (
            <option key={bt.id} value={bt.id}>{bt.name}</option>
          ))}
        </select>

        {/* Packing Type Filter */}
        <select
          id="packing-type-filter"
          value={packingTypeFilter}
          onChange={(e) => { setPackingTypeFilter(e.target.value); setCurrentPage(1); }}
          className="border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-600 bg-white focus:outline-none shadow-sm"
        >
          <option value="">All Packing Types</option>
          {packingTypes.map((pt) => (
            <option key={pt.id} value={pt.id}>{pt.name}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          id="status-filter"
          value={isActiveFilter}
          onChange={(e) => { setIsActiveFilter(e.target.value); setCurrentPage(1); }}
          className="border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-600 bg-white focus:outline-none shadow-sm"
        >
          <option value="true">Active Only</option>
          <option value="false">Inactive Only</option>
          <option value="">All Status</option>
        </select>
      </div>

      <span className="text-[11px] text-gray-400 font-semibold ml-auto">
        {totalCount} specification{totalCount !== 1 ? "s" : ""}
      </span>
    </div>
  );
}
