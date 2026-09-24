"use client";
import React from "react";
import { Search, RotateCcw } from "lucide-react";

export default function CargoAvailabilityFilter({ filters, onChange, onReset }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3.5 mb-5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
      <div className="flex-1 flex items-center gap-3 w-full">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Purchase Contract No, Supplier name..."
            value={filters.search || ""}
            onChange={(e) => onChange("search", e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <select
          value={filters.status || ""}
          onChange={(e) => onChange("status", e.target.value)}
          className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 font-medium"
        >
          <option value="">All Statuses</option>
          <option value="Pending Readiness">Pending Readiness</option>
          <option value="Partially Ready">Partially Ready</option>
          <option value="Ready Pool">Ready Pool</option>
          <option value="Allocated">Allocated</option>
          <option value="Dispatched">Dispatched</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <button
        onClick={onReset}
        className="px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer self-end md:self-auto"
      >
        <RotateCcw className="h-3.5 w-3.5 text-gray-500" />
        <span>Reset Filters</span>
      </button>
    </div>
  );
}
