import React from "react";
import { Search } from "lucide-react";

export default function ClientFilters({
  search,
  setSearch,
  setCurrentPage,
  filteredCount,
  totalCount,
}) {
  return (
    <div className="p-4 border-b border-gray-50 bg-gray-50/20 flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="relative w-full max-w-xs">
        <input
          type="text"
          className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff] text-gray-600 transition-colors"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
      </div>

      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
        Showing {filteredCount} of {totalCount} Clients
      </div>
    </div>
  );
}
