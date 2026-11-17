"use client";
import React from "react";
import { Search, RotateCcw } from "lucide-react";

export default function ExportInvoicesFilter({
  filters,
  setFilters,
  onReset,
}) {
  const handleChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      page: 1,
    }));
  };

  return (
    <div className="p-4 border-b border-gray-100 bg-white space-y-3">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search invoice #, business ref #, contract #, buyer..."
            value={filters.search || ""}
            onChange={(e) => handleChange("search", e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50/50"
          />
        </div>

        {/* Filters and Reset */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Status Filter */}
          <select
            value={filters.status || ""}
            onChange={(e) => handleChange("status", e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Issued">Issued</option>
            <option value="Paid">Paid</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Currency Filter */}
          <select
            value={filters.currency || ""}
            onChange={(e) => handleChange("currency", e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Currencies</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="INR">INR</option>
            <option value="GBP">GBP</option>
          </select>

          {/* Date Range */}
          <input
            type="date"
            value={filters.invoiceDateFrom || ""}
            onChange={(e) => handleChange("invoiceDateFrom", e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-700 bg-white"
            title="From Date"
          />
          <span className="text-gray-400 text-xs">to</span>
          <input
            type="date"
            value={filters.invoiceDateTo || ""}
            onChange={(e) => handleChange("invoiceDateTo", e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-700 bg-white"
            title="To Date"
          />

          {/* Reset Button */}
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
              title="Reset Filters"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
