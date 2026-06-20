import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";

export default function CountriesFilters({ search, setSearch, isActiveFilter, setIsActiveFilter, setCurrentPage, totalCount }) {
  const [localSearch, setLocalSearch] = useState(search);

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
    <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/30">
      <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
        <div className="relative w-full sm:w-64">
          <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search countries..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] transition-all"
          />
        </div>
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
      </div>
      <div className="text-xs text-gray-500 font-medium whitespace-nowrap">
        Total Countries: {totalCount}
      </div>
    </div>
  );
}
