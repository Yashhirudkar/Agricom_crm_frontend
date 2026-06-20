import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";

export default function HSCodesFilters({ search, setSearch, setCurrentPage, totalCount }) {
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
      <div className="relative w-full sm:max-w-xs">
        <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search HS Codes..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] transition-all"
        />
      </div>
      <div className="text-xs text-gray-500 font-medium">
        Total HS Codes: {totalCount}
      </div>
    </div>
  );
}
