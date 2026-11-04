"use client";
import React, { useState, useEffect } from "react";
import { Search, X, ChevronDown, Filter, RotateCcw, Rocket } from "lucide-react";
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
  statsConfig = [],
  selectedShipments = [],
  onExecuteBulk,
  onDeselect,
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

  const selectCls = "appearance-none pr-8 pl-3 h-[34px] md:h-9 lg:h-10 text-xs border border-gray-200 bg-gray-50 rounded-lg lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] text-gray-700 w-full";
  const inpCls = "px-3 h-[34px] md:h-9 lg:h-10 text-xs border border-gray-200 bg-gray-50 rounded-lg lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] text-gray-700 w-full";
  const lblCls = "block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1";

  return (
    <div>
      {/* Top Filter Bar */}
      <div className="px-2.5 sm:px-4 py-1.5 lg:py-2 border-b border-gray-100 flex flex-wrap items-center justify-between gap-1.5 lg:gap-2">
        
        {/* Search */}
        <div className="w-full basis-full flex-none md:w-full md:basis-full lg:w-[55%] lg:basis-auto 2xl:w-1/2 relative min-w-0">
          <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by Shipment Ref, Business Ref, Buyer, Supplier..."
            value={filters.search || ""}
            onChange={(e) => handleChange("search", e.target.value)}
            className="w-full pl-8 pr-7 h-[34px] md:h-9 lg:h-10 text-[13px] lg:text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] transition-all"
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
        <div className="flex items-center gap-1.5 order-3 shrink-0">
          {/* Bulk Execute Workspace Action */}
          {selectedShipments.length > 0 && (
            <div className="flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-200">
              <button
                type="button"
                onClick={onExecuteBulk}
                className="px-2.5 md:px-3 h-8 md:h-9 lg:h-10 bg-[#007aff] hover:bg-blue-600 text-white rounded-lg lg:rounded-xl text-[11px] lg:text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-blue-500/20 whitespace-nowrap"
                title="Execute workspace for selected shipments"
              >
                <Rocket className="h-3.5 w-3.5 text-purple-200 animate-pulse" />
                <span>Execute Workspace ({selectedShipments.length})</span>
              </button>
              <button
                type="button"
                onClick={onDeselect}
                className="px-2 py-2 text-xs font-medium text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                title="Clear selected shipments"
              >
                Clear
              </button>
            </div>
          )}

          {/* Filter drawer/panel toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`w-[58px] md:w-[64px] lg:w-[72px] px-1 h-8 md:h-9 lg:h-10 rounded-lg lg:rounded-xl flex items-center justify-center gap-0.5 md:gap-1 text-[10px] lg:text-[11px] font-semibold border transition-all cursor-pointer ${
              showAdvanced
                ? "bg-blue-50 border-blue-200 text-[#007aff]"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Filter</span>
          </button>

          <div className="flex items-center gap-1.5">
            {statsConfig.map((card) => (
              <div
                key={card.label}
                className="h-8 w-[72px] min-w-[72px] md:h-9 md:w-auto md:min-w-[86px] lg:h-10 lg:min-w-[92px] px-1 md:px-2 lg:px-2.5 bg-white border border-gray-200 rounded-lg shadow-xs flex items-center justify-between gap-1 md:gap-1.5"
              >
                <div className="min-w-0">
                  <p className="text-[6px] md:text-[8px] font-bold text-gray-400 uppercase tracking-wide truncate">{card.label}</p>
                  <p className="text-xs md:text-sm leading-none font-extrabold text-gray-900 mt-0.5">{card.value}</p>
                </div>
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${card.badgeColor}`} />
              </div>
            ))}
          </div>

          {/* Reset Filters */}
          <button
            onClick={onReset}
            className="h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 flex items-center justify-center border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-700 rounded-lg lg:rounded-xl transition-all cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

        </div>

      </div>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <div className="bg-gray-50/60 border-b border-gray-100 p-2.5 sm:p-4 lg:p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4 animate-in fade-in slide-in-from-top-3 duration-250">
          {/* Timeline */}
          <div>
            <label className={lblCls}>Timeline</label>
            <div className="relative">
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
          </div>

          {/* Status */}
          <div>
            <label className={lblCls}>Status</label>
            <div className="relative">
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
          </div>
          
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

          {/* Business Reference */}
          <div>
            <label className={lblCls}>Business Ref No.</label>
            <input
              type="text"
              placeholder="Business Ref No."
              value={filters.businessReference || ""}
              onChange={(e) => handleChange("businessReference", e.target.value)}
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

    </div>
  );
}
