import React from "react";
import { Search, Network } from "lucide-react";

export default function DepartmentFilters({
  search,
  setSearch,
  setCurrentPage,
  viewMode,
  setViewMode,
  total,
}) {
  return (
    <div className="p-4 border-b border-gray-50 bg-gray-50/20 flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="relative w-full max-w-xs">
        <input
          type="text"
          className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff] text-gray-600 transition-colors"
          placeholder="Search departments..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-white border border-gray-200 rounded-xl p-1 flex">
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              viewMode === "list"
                ? "bg-[#007aff] text-white"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode("tree")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
              viewMode === "tree"
                ? "bg-[#007aff] text-white"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Network className="h-3 w-3" /> Tree
          </button>
        </div>
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-2">
          Total {total}
        </div>
      </div>
    </div>
  );
}
