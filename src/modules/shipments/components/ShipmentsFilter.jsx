"use client";
import React, { useState, useEffect } from "react";
import { Search, X, ChevronDown, Filter, RotateCcw } from "lucide-react";
import { mastersApi, salesContractApi } from "@/modules/sales-contracts/services/salesContractApi";
import CountrySelect from "@/components/common/CountrySelect";

const WORKFLOW_STATUSES = [
  "Scheduled",
  "Ready",
  "Stuffing",
  "Dispatched",
  "In Transit",
  "At Port",
  "Sailed",
  "Arrived",
  "Delivered",
  "Cancelled"
];

const TIMELINE_STATES = [
  { value: "Today", label: "Today" },
  { value: "Tomorrow", label: "Tomorrow" },
  { value: "Upcoming", label: "Upcoming" },
  { value: "Overdue", label: "Overdue" },
  { value: "Completed", label: "Completed" }
];

const MONTHS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" }
];

export default function ShipmentsFilter({
  filters,
  setFilters,
  onReset,
  total,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [buyers, setBuyers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [financialYears, setFinancialYears] = useState([]);
  const [years, setYears] = useState([]);

  useEffect(() => {
    const loadMasters = async () => {
      try {
        const [partnersRes, productsRes, fyRes] = await Promise.all([
          mastersApi.getPartnersOptions({ limit: 100 }),
          mastersApi.getProductsOptions({ limit: 100 }),
          salesContractApi.getFilterFinancialYears()
        ]);

        if (partnersRes?.data?.data) {
          const list = partnersRes.data.data;
          // Split buyers and sellers or use both lists
          setBuyers(list.filter(p => p.roles?.some(r => r.name === "Buyer") || true));
          setSellers(list.filter(p => p.roles?.some(r => r.name === "Seller") || true));
        }
        if (productsRes?.data?.data) {
          setProducts(productsRes.data.data);
        }
        if (fyRes?.data) {
          setFinancialYears(fyRes.data);
        }

        // Generate matching years dynamically from current date - 2 to + 3
        const currentYear = new Date().getFullYear();
        const yearList = [];
        for (let y = currentYear - 2; y <= currentYear + 3; y++) {
          yearList.push(y.toString());
        }
        setYears(yearList);
      } catch (err) {
        console.error("Failed to load master filters", err);
      }
    };
    loadMasters();
  }, []);

  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const selectCls = "appearance-none pr-8 pl-3 py-2 text-xs border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] text-gray-700 w-full";
  const inpCls = "px-3 py-2 text-xs border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] text-gray-700 w-full";
  const lblCls = "block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1";

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-xs overflow-hidden">
      {/* Top Filter Bar */}
      <div className="px-5 py-3.5 border-b border-gray-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="flex-1 relative min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by shipment ref, contract no, buyer, product..."
            value={filters.search || ""}
            onChange={(e) => handleChange("search", e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] transition-all"
          />
          {filters.search && (
            <button
              onClick={() => handleChange("search", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
          {/* Timeline filter shortcut */}
          <div className="relative min-w-[130px]">
            <select
              value={filters.timeline || ""}
              onChange={(e) => handleChange("timeline", e.target.value)}
              className={selectCls}
            >
              <option value="">All Timelines</option>
              {TIMELINE_STATES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
          </div>

          {/* Status filter shortcut */}
          <div className="relative min-w-[140px]">
            <select
              value={filters.status || ""}
              onChange={(e) => handleChange("status", e.target.value)}
              className={selectCls}
            >
              <option value="">All Statuses</option>
              {WORKFLOW_STATUSES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
          </div>

          {/* Toggle Advanced */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 text-xs font-semibold border transition-all cursor-pointer ${
              showAdvanced
                ? "bg-blue-50 border-blue-200 text-[#007aff]"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            Advanced
          </button>

          {/* Reset Filters */}
          <button
            onClick={onReset}
            className="p-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-700 rounded-xl transition-all cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

        </div>

      </div>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <div className="bg-gray-50/60 border-b border-gray-100 p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-3 duration-250">
          
          {/* Shipment Ref */}
          <div>
            <label className={lblCls}>Shipment Ref</label>
            <input
              type="text"
              placeholder="e.g. 00125/1/C2"
              value={filters.shipmentReference || ""}
              onChange={(e) => handleChange("shipmentReference", e.target.value)}
              className={inpCls}
            />
          </div>

          {/* Contract No */}
          <div>
            <label className={lblCls}>Contract No</label>
            <input
              type="text"
              placeholder="e.g. FA-00125"
              value={filters.contractNumber || ""}
              onChange={(e) => handleChange("contractNumber", e.target.value)}
              className={inpCls}
            />
          </div>

          {/* Buyer */}
          <div>
            <label className={lblCls}>Buyer</label>
            <div className="relative">
              <select
                value={filters.buyerId || ""}
                onChange={(e) => handleChange("buyerId", e.target.value)}
                className={selectCls}
              >
                <option value="">Select Buyer</option>
                {buyers.map(b => (
                  <option key={b.id} value={b.id}>{b.entityName || b.name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
            </div>
          </div>

          {/* Seller */}
          <div>
            <label className={lblCls}>Seller</label>
            <div className="relative">
              <select
                value={filters.sellerId || ""}
                onChange={(e) => handleChange("sellerId", e.target.value)}
                className={selectCls}
              >
                <option value="">Select Seller</option>
                {sellers.map(s => (
                  <option key={s.id} value={s.id}>{s.entityName || s.name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
            </div>
          </div>

          {/* Product */}
          <div>
            <label className={lblCls}>Product</label>
            <div className="relative">
              <select
                value={filters.productId || ""}
                onChange={(e) => handleChange("productId", e.target.value)}
                className={selectCls}
              >
                <option value="">Select Product</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
            </div>
          </div>

          {/* Country */}
          <div>
            <label className={lblCls}>Country</label>
            <CountrySelect
              value={filters.country || ""}
              onChange={(val) => handleChange("country", val?.name || "")}
            />
          </div>

          {/* Port of Loading */}
          <div>
            <label className={lblCls}>Origin Port</label>
            <input
              type="text"
              placeholder="e.g. Mundra"
              value={filters.portOfLoading || ""}
              onChange={(e) => handleChange("portOfLoading", e.target.value)}
              className={inpCls}
            />
          </div>

          {/* Port of Discharge */}
          <div>
            <label className={lblCls}>Destination Port</label>
            <input
              type="text"
              placeholder="e.g. Jebel Ali"
              value={filters.portOfDischarge || ""}
              onChange={(e) => handleChange("portOfDischarge", e.target.value)}
              className={inpCls}
            />
          </div>

          {/* Financial Year */}
          <div>
            <label className={lblCls}>Financial Year</label>
            <div className="relative">
              <select
                value={filters.financialYear || ""}
                onChange={(e) => handleChange("financialYear", e.target.value)}
                className={selectCls}
              >
                <option value="">Select Financial Year</option>
                {financialYears.map(fy => (
                  <option key={fy} value={fy}>{fy}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
            </div>
          </div>

          {/* Month */}
          <div>
            <label className={lblCls}>Shipment Month</label>
            <div className="relative">
              <select
                value={filters.shipmentMonth || ""}
                onChange={(e) => handleChange("shipmentMonth", e.target.value)}
                className={selectCls}
              >
                <option value="">Select Month</option>
                {MONTHS.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
            </div>
          </div>

          {/* Year */}
          <div>
            <label className={lblCls}>Shipment Year</label>
            <div className="relative">
              <select
                value={filters.shipmentYear || ""}
                onChange={(e) => handleChange("shipmentYear", e.target.value)}
                className={selectCls}
              >
                <option value="">Select Year</option>
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
            </div>
          </div>

          {/* Currency */}
          <div>
            <label className={lblCls}>Currency</label>
            <input
              type="text"
              placeholder="e.g. USD, EUR"
              value={filters.currency || ""}
              onChange={(e) => handleChange("currency", e.target.value)}
              className={inpCls}
            />
          </div>

          {/* Shipment Date From */}
          <div>
            <label className={lblCls}>Shipment Date From</label>
            <input
              type="date"
              value={filters.shipmentDateFrom || ""}
              onChange={(e) => handleChange("shipmentDateFrom", e.target.value)}
              className={inpCls}
            />
          </div>

          {/* Shipment Date To */}
          <div>
            <label className={lblCls}>Shipment Date To</label>
            <input
              type="date"
              value={filters.shipmentDateTo || ""}
              onChange={(e) => handleChange("shipmentDateTo", e.target.value)}
              className={inpCls}
            />
          </div>

        </div>
      )}

      {/* Row Counter (only shown if advanced is closed, as helper) */}
      {!showAdvanced && (
        <div className="px-5 py-2 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between text-[11px] font-semibold text-gray-400">
          <span>Filtered Results: {total} shipment{total !== 1 ? "s" : ""}</span>
        </div>
      )}
    </div>
  );
}
