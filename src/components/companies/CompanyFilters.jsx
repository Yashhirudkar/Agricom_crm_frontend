import React from "react";
import { Search, Filter } from "lucide-react";

export default function CompanyFilters({
  search,
  setSearch,
  companyTypeFilter,
  setCompanyTypeFilter,
  industryTypeFilter,
  setIndustryTypeFilter,
  statusFilter,
  setStatusFilter,
  setCurrentPage,
  filteredCount,
  totalCount,
  options,
}) {
  return (
    <div className="p-4 border-b border-gray-50 bg-gray-50/20 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] text-gray-700 transition-all shadow-sm"
            placeholder="Search enterprise workspaces..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-1 py-1 shadow-sm shrink-0">
            <Filter className="h-4 w-4 text-gray-400 ml-2" />
            <select
              className="border-none bg-transparent text-xs outline-none text-gray-600 cursor-pointer py-1.5 pr-2"
              value={companyTypeFilter}
              onChange={(e) => { setCompanyTypeFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="ALL">All Types</option>
              {options?.companies?.types?.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <select
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] text-gray-600 bg-white cursor-pointer shadow-sm transition-all shrink-0"
            value={industryTypeFilter}
            onChange={(e) => { setIndustryTypeFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="ALL">All Industries</option>
            {options?.companies?.industryTypes?.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] text-gray-600 bg-white cursor-pointer shadow-sm transition-all shrink-0"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="ALL">All Status</option>
            {options?.companies?.statuses?.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0 text-center sm:text-right">
        Showing {filteredCount} of {totalCount} Companies
      </div>
    </div>
  );
}
