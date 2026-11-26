"use client";
import React from "react";
import { Search, X, RotateCcw, Rocket, Train } from "lucide-react";

export default function ShipmentsFilter({
  filters,
  setFilters,
  onReset,
  statsConfig = [],
  selectedShipments = [],
  onExecuteBulk,
  canOpenRailTransportWorkspace = false,
  railTransportCount = 0,
  onOpenRailTransportWorkspace,
  canOpenMultiStuffingExecution = false,
  multiStuffingExecutionCount = 0,
  onOpenMultiStuffingExecution,
  onDeselect,
  activeTab = "pending",
}) {
  const handleSearchChange = (value) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  return (
    <div>
      {/* Unified Search Bar */}
      <div className="px-2.5 sm:px-4 py-1.5 lg:py-2 border-b border-gray-100 flex flex-wrap items-center justify-between gap-1.5 lg:gap-2">
        {/* Global Search covering Shipment Ref, Business Ref, Contract No, Buyer, Seller, Product, Country */}
        <div className="w-full basis-full flex-none md:w-full md:basis-full lg:w-[55%] lg:basis-auto 2xl:w-1/2 relative min-w-0">
          <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by Shipment Ref, Business Ref, Contract No, Buyer, Seller, Product, Country..."
            value={filters.search || ""}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-8 pr-7 h-[34px] md:h-9 lg:h-10 text-[13px] lg:text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] transition-all"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              title="Clear search"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 order-3 shrink-0">
          {/* Bulk Execute Workspace Action */}
          {selectedShipments.length > 0 && activeTab !== "executed" && (
            <div className="flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-200">
              {selectedShipments.length > 1 &&
                canOpenRailTransportWorkspace &&
                onOpenRailTransportWorkspace && (
                  <button
                    type="button"
                    onClick={onOpenRailTransportWorkspace}
                    className="px-2.5 md:px-3 h-8 md:h-9 lg:h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg lg:rounded-xl text-[11px] lg:text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-indigo-500/20 whitespace-nowrap"
                    title="Open Transport Workspace for selected Rail shipments (Freight Quote auto-applies to all selected shipments)"
                  >
                    <Train className="h-3.5 w-3.5 text-indigo-100" />
                    <span>
                      Transport Workspace ({railTransportCount || selectedShipments.length})
                    </span>
                  </button>
                )}
              {selectedShipments.length > 1 &&
                canOpenMultiStuffingExecution &&
                onOpenMultiStuffingExecution && (
                  <button
                    type="button"
                    onClick={onOpenMultiStuffingExecution}
                    className="px-2.5 md:px-3 h-8 md:h-9 lg:h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg lg:rounded-xl text-[11px] lg:text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-emerald-500/20 whitespace-nowrap"
                    title="Execute Stuffing together for selected Truck or Rail shipments"
                  >
                    <Rocket className="h-3.5 w-3.5 text-emerald-100" />
                    <span>
                      Execute Stuffing ({multiStuffingExecutionCount || selectedShipments.length})
                    </span>
                  </button>
                )}
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

          <div className="flex items-center gap-1.5">
            {statsConfig.map((card) => (
              <div
                key={card.label}
                className="h-8 w-[72px] min-w-[72px] md:h-9 md:w-auto md:min-w-[86px] lg:h-10 lg:min-w-[92px] px-1 md:px-2 lg:px-2.5 bg-white border border-gray-200 rounded-lg shadow-xs flex items-center justify-between gap-1 md:gap-1.5"
              >
                <div className="min-w-0">
                  <p className="text-[6px] md:text-[8px] font-bold text-gray-400 uppercase tracking-wide truncate">
                    {card.label}
                  </p>
                  <p className="text-xs md:text-sm leading-none font-extrabold text-gray-900 mt-0.5">
                    {card.value}
                  </p>
                </div>
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${card.badgeColor}`} />
              </div>
            ))}
          </div>

          {/* Reset Search */}
          <button
            type="button"
            onClick={onReset}
            className="h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 flex items-center justify-center border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-700 rounded-lg lg:rounded-xl transition-all cursor-pointer"
            title="Reset Search"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
