"use client";

import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { mastersApi } from "@/modules/sales-contracts/services/salesContractApi";
import { Coins, Search, Check, AlertCircle, RefreshCw } from "lucide-react";

export default function CurrencyTab() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [togglingId, setTogglingId] = useState(null);

  const itemsPerPage = 25;
  const queryClient = useQueryClient();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const status = statusFilter === "all" ? undefined : statusFilter === "true" ? "Active" : "Inactive";
  const { data: pageData, isLoading, isError, error } = useQuery({
    queryKey: ["currency-master", currentPage, debouncedSearch, statusFilter],
    queryFn: async () => {
      const res = await mastersApi.getCurrencies({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch || undefined,
        status,
      });
      return res.data || { data: [], total: 0, totalPages: 1 };
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const items = pageData?.data || [];
  const total = pageData?.total || 0;
  const totalPages = pageData?.totalPages || 1;

  useEffect(() => {
    if (!isError) return;
    console.error("Failed to load currencies", error);
    setToast({ msg: "Failed to load currencies master", type: "error" });
  }, [isError, error]);

  const handleToggle = async (currency) => {
    setTogglingId(currency.id);
    try {
      await mastersApi.toggleCurrency(currency.id);
      const newActive = !currency.isActive;
      showToast(
        `${currency.code} (${currency.name}) is now ${
          newActive ? "ON (Visible in dropdown)" : "OFF (Hidden from dropdown)"
        }`
      );
      await queryClient.invalidateQueries({ queryKey: ["currency-master"] });
    } catch (err) {
      showToast("Failed to toggle currency status", "error");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-xs font-bold text-white transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${
            toast.type === "error" ? "bg-red-500" : "bg-emerald-600"
          }`}
        >
          {toast.type === "error" ? <AlertCircle className="h-4 w-4" /> : <Check className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Coins className="h-5 w-5 text-[#007aff]" />
            Currency Master
          </h2>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Turn ON to show currency in contract dropdowns, or turn OFF to hide it.
          </p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by code (e.g. USD, INR) or name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <label className="text-[11px] font-semibold text-gray-500">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] bg-white font-medium text-gray-700"
            >
              <option value="all">All Currencies ({total})</option>
              <option value="true">Active Only (ON)</option>
              <option value="false">Inactive Only (OFF)</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left font-bold text-gray-600">Code</th>
                <th className="px-4 py-3 text-left font-bold text-gray-600">Name</th>
                <th className="px-4 py-3 text-left font-bold text-gray-600">Symbol</th>
                <th className="px-4 py-3 text-center font-bold text-gray-600">Show in Dropdown (ON / OFF)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw className="h-5 w-5 text-[#007aff] animate-spin" />
                      <span className="text-xs text-gray-400 font-semibold">Loading currencies...</span>
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-400 font-medium">
                    No currencies matching &quot;{search}&quot;.
                  </td>
                </tr>
              ) : (
                items.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3 font-bold text-gray-900 tracking-wide">{c.code}</td>
                    <td className="px-4 py-3 text-gray-700 font-medium">{c.name}</td>
                    <td className="px-4 py-3 font-mono font-bold text-blue-600 text-sm">{c.symbol || "—"}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="inline-flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleToggle(c)}
                          disabled={togglingId === c.id}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            c.isActive ? "bg-emerald-500" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              c.isActive ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                        <span className={`text-[11px] font-bold ${c.isActive ? "text-emerald-600" : "text-gray-400"}`}>
                          {c.isActive ? "ON" : "OFF"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[11px] text-gray-400 font-medium">
              Showing {items.length} of {total} world currencies (Page {currentPage} of {totalPages})
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
