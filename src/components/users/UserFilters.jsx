import React from "react";
import { Search } from "lucide-react";
import useSystemOptions from "@/hooks/useSystemOptions";

export default function UserFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  companyFilter,
  setCompanyFilter,
  setCurrentPage,
  companies,
  filteredCount,
}) {
  const { options } = useSystemOptions();

  return (
    <div className="p-4 border-b border-gray-50 bg-gray-50/20 flex flex-wrap gap-4 items-center justify-between">
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search Input */}
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff] text-gray-600 transition-colors"
            placeholder="Search user profile..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
        </div>

        {/* Status Selector */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs outline-none focus:border-[#007aff]"
        >
          <option value="all">All Statuses</option>
          {options?.users?.statuses?.map(s => (
            <option key={s.value} value={s.value.toLowerCase()}>{s.label}</option>
          ))}
        </select>

        {/* Company Scope Selector */}
        <select
          value={companyFilter}
          onChange={(e) => {
            setCompanyFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs outline-none focus:border-[#007aff]"
        >
          <option value="all">All Workspaces</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
        {filteredCount} Users found
      </div>
    </div>
  );
}
