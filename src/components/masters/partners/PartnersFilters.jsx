import React, { useState, useEffect } from "react";
import { Search, RotateCcw, X } from "lucide-react";

export default function PartnersFilters({
  filters,
  setFilters,
  totalCount,
  partnerRoles = [],
  countries = [],
  isLoading,
}) {
  const [localSearch, setLocalSearch] = useState(filters.search);

  const isDirty = !!(localSearch || filters.role || filters.country || filters.dbRisk || filters.status !== "true");

  const handleClear = () => {
    setLocalSearch("");
    setFilters({
      search: "",
      role: "",
      country: "",
      dbRisk: "",
      status: "true",
      page: 1,
      limit: filters.limit,
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.search) {
        setFilters((prev) => ({
          ...prev,
          search: localSearch,
          page: 1,
        }));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, filters.search, setFilters]);

  // Sync local search with external search state (e.g. on reset)
  useEffect(() => {
    if (filters.search !== localSearch) {
      setLocalSearch(filters.search);
    }
  }, [filters.search]);

  return (
    <div className="p-4 border-b border-gray-100 flex flex-col lg:flex-row gap-4 items-center justify-between bg-gray-50/30">
      <div className="flex flex-col sm:flex-row gap-3 items-center w-full lg:w-auto flex-wrap">
        <div className="relative w-full sm:w-72">
          <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, phone, email..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-9 pr-10 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] transition-all"
          />
          {localSearch.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setLocalSearch("");
                setFilters((prev) => ({ ...prev, search: "", page: 1 }));
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-center"
              title="Clear search"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Dynamic Partner Role Filter */}
        <select
          value={filters.role}
          onChange={(e) => {
            setFilters((prev) => ({ ...prev, role: e.target.value, page: 1 }));
          }}
          className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] transition-all"
        >
          <option value="">All Roles</option>
          {[...partnerRoles].sort((a, b) => (a.name || "").localeCompare(b.name || "")).map((role) => (
            <option key={`filter-role-${role.id}`} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>

        {/* Dynamic Country Filter */}
        <select
          value={filters.country}
          onChange={(e) => {
            setFilters((prev) => ({ ...prev, country: e.target.value, page: 1 }));
          }}
          className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] transition-all"
        >
          <option value="">All Countries</option>
          {[...countries].sort((a, b) => a.localeCompare(b)).map((c) => (
            <option key={`filter-country-${c}`} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* D&B Risk & Failure Score Filter */}
        <select
          value={filters.dbRisk}
          onChange={(e) => {
            setFilters((prev) => ({ ...prev, dbRisk: e.target.value, page: 1 }));
          }}
          className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] transition-all"
        >
          <option value="">All D&B Risk</option>
          <option value="VERY_LOW">🟢 Very Low (90 – 100)</option>
          <option value="LOW">🟢 Low (75 – 89)</option>
          <option value="MODERATE_LOW">🟡 Moderate-Low (60 – 74)</option>
          <option value="MODERATE">🟠 Moderate (40 – 59)</option>
          <option value="HIGH">🔴 High (20 – 39)</option>
          <option value="VERY_HIGH">🔴 Very High (1 – 19)</option>
          <option value="UNKNOWN">⚪ Unknown (0 / No Score)</option>
        </select>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => {
            setFilters((prev) => ({ ...prev, status: e.target.value, page: 1 }));
          }}
          className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] transition-all"
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
          <option value="">All Statuses</option>
        </select>

        {/* Clear Filters Button */}
        {isDirty && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none"
            title="Reset all filters"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>
      <div className="text-xs text-gray-500 font-medium whitespace-nowrap lg:self-center self-end flex items-center gap-2">
        {isLoading && (
          <span className="h-3 w-3 rounded-full border border-gray-300 border-t-[#007aff] animate-spin inline-block" />
        )}
        Total Partners: {totalCount}
      </div>
    </div>
  );
}
