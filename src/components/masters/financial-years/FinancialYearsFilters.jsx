import React from "react";
import { Search } from "lucide-react";

export default function FinancialYearsFilters({ search, setSearch, isActiveFilter, setIsActiveFilter, setCurrentPage, totalCount }) {
  return (
    <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search financial years..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] transition-all"
          />
        </div>
        <select
          value={isActiveFilter}
          onChange={(e) => {
            setIsActiveFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full sm:w-36 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] transition-all"
        >
          <option value="all">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      <div className="text-xs font-medium text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm self-start sm:self-auto">
        Total: <span className="text-gray-900 font-bold">{totalCount}</span>
      </div>
    </div>
  );
}
