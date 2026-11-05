import React, { useState } from "react";
import { Search, RotateCcw, X } from "lucide-react";

export default function StockFilters({ filters, onFilterChange, onRefresh, isLoading }) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [prevFilters, setPrevFilters] = useState(filters);

  // Recommended React pattern to sync state with prop changes without triggering cascading effect renders
  if (filters !== prevFilters) {
    setPrevFilters(filters);
    setLocalFilters(filters);
  }

  const handleChange = (field, value) => {
    const updated = { ...localFilters, [field]: value };
    setLocalFilters(updated);
  };

  const handleApply = (e) => {
    if (e) e.preventDefault();
    onFilterChange(localFilters);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleApply();
    }
  };

  const handleReset = () => {
    const resetValues = {
      search: "",
      country: "",
      product: "",
      supplier: "",
      buyer: "",
    };
    setLocalFilters(resetValues);
    onFilterChange(resetValues);
  };

  const hasActiveFilters = Object.values(localFilters).some((val) => Boolean(val && val.trim() !== ""));

  return (
    <div className="sticky top-0 z-30 bg-white/95 px-4 py-3 backdrop-blur-sm border-b border-gray-200">
      <form onSubmit={handleApply} className="flex flex-wrap lg:flex-nowrap items-center gap-3">
        {/* Single Unified Search & Filter Input */}
        <div className="relative flex-1 min-w-[300px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search contract, ref, country, product, supplier, buyer..."
            value={localFilters.search || ""}
            onChange={(e) => handleChange("search", e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Search className="w-3.5 h-3.5" />
            Apply Filters
          </button>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh Stock Data"
            className="px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-indigo-600" : ""}`} />
            Refresh
          </button>
        </div>
      </form>
    </div>
  );
}
