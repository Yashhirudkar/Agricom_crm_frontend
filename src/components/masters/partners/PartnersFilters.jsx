import React, { useState, useEffect } from "react";
import { Search, RotateCcw } from "lucide-react";

export default function PartnersFilters({
  search,
  setSearch,
  isActiveFilter,
  setIsActiveFilter,
  setCurrentPage,
  totalCount,
  partnerRoles = [],
  countries = [],
  roleFilter,
  setRoleFilter,
  countryFilter,
  setCountryFilter,
  dnbRiskFilter,
  setDnbRiskFilter,
}) {
  const [localSearch, setLocalSearch] = useState(search);

  const isDirty = !!(localSearch || roleFilter || countryFilter || dnbRiskFilter || isActiveFilter !== "true");

  const handleClear = () => {
    setLocalSearch("");
    setSearch("");
    setRoleFilter("");
    setCountryFilter("");
    setDnbRiskFilter("");
    setIsActiveFilter("true");
    setCurrentPage(1);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search) {
        setSearch(localSearch);
        setCurrentPage(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, search, setSearch, setCurrentPage]);

  return (
    <div className="p-4 border-b border-gray-100 flex flex-col lg:flex-row gap-4 items-center justify-between bg-gray-50/30">
      <div className="flex flex-col sm:flex-row gap-3 items-center w-full lg:w-auto flex-wrap">
        <div className="relative w-full sm:w-60">
          <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search partners by name..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] transition-all"
          />
        </div>

        {/* Dynamic Partner Role Filter */}
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] transition-all"
        >
          <option value="">All Roles</option>
          {partnerRoles.map((role) => (
            <option key={`filter-role-${role.id}`} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>

        {/* Dynamic Country Filter */}
        <select
          value={countryFilter}
          onChange={(e) => {
            setCountryFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] transition-all"
        >
          <option value="">All Countries</option>
          {countries.map((c) => (
            <option key={`filter-country-${c}`} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* D&B Risk & Failure Score Filter */}
        <select
          value={dnbRiskFilter}
          onChange={(e) => {
            setDnbRiskFilter(e.target.value);
            setCurrentPage(1);
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
          value={isActiveFilter}
          onChange={(e) => {
            setIsActiveFilter(e.target.value);
            setCurrentPage(1);
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
      <div className="text-xs text-gray-500 font-medium whitespace-nowrap lg:self-center self-end">
        Total Partners: {totalCount}
      </div>
    </div>
  );
}
