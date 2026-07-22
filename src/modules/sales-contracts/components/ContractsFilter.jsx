"use client";
import React, { useState, useEffect } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import { salesContractApi } from "../services/salesContractApi";

const STATUSES = ["", "Draft", "Active", "Cancelled", "Closed"];

export default function ContractsFilter({
  search, setSearch,
  status, setStatus,
  financialYearFilter, setFinancialYearFilter,
  setPage, total,
}) {
  const [historicalYears, setHistoricalYears] = useState([]);

  // Fetch distinct financial years stored in the database for filtering
  useEffect(() => {
    const load = async () => {
      try {
        const res = await salesContractApi.getFilterFinancialYears();
        // API returns string[] from SELECT DISTINCT financial_year ORDER BY DESC
        setHistoricalYears(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error("Failed to load financial years for filter", e);
      }
    };
    load();
  }, []);

  return (
    <div className="px-5 py-3.5 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
      {/* Contract Number Search */}
      <div className="flex-1 relative min-w-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by contract number..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-9 pr-8 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] transition-all"
        />
        {search && (
          <button
            onClick={() => { setSearch(""); setPage(1); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Financial Year Filter */}
      {historicalYears.length > 0 && (
        <div className="relative">
          <select
            value={financialYearFilter}
            onChange={(e) => { setFinancialYearFilter(e.target.value); setPage(1); }}
            className="appearance-none pr-8 pl-3 py-2 text-xs border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] text-gray-600"
          >
            <option value="">All Financial Years</option>
            {historicalYears.map(fy => (
              <option key={fy} value={fy}>{fy}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
        </div>
      )}

      {/* Status Filter */}
      <div className="relative">
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="appearance-none pr-8 pl-3 py-2 text-xs border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] text-gray-600"
        >
          <option value="">All Statuses</option>
          {STATUSES.filter(Boolean).map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
      </div>

      <span className="text-[11px] font-semibold text-gray-400 whitespace-nowrap">
        {total} contract{total !== 1 ? "s" : ""}
      </span>
    </div>
  );
}
