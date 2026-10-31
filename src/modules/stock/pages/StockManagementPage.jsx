"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Layers, PackageSearch, AlertCircle } from "lucide-react";
import { stockApi } from "../services/stockApi";
import StockDashboardCards from "../components/StockDashboardCards";
import StockFilters from "../components/StockFilters";
import CountryStockCard from "../components/CountryStockCard";
import StockProductDrawer from "../components/StockProductDrawer";

export default function StockManagementPage() {
  const [summary, setSummary] = useState(null);
  const [countryGroups, setCountryGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [filters, setFilters] = useState({
    search: "",
    country: "",
    product: "",
    supplier: "",
    buyer: "",
  });

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCountryName, setSelectedCountryName] = useState("");

  // Initial load
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        const [dashRes, listRes] = await Promise.all([
          stockApi.getDashboard(),
          stockApi.getStockList(),
        ]);
        if (isMounted) {
          setSummary(dashRes.data || null);
          const list = Array.isArray(listRes.data) ? listRes.data : listRes.data?.data || [];
          setCountryGroups(list);
          setIsLoading(false);
          setIsDashboardLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load initial stock data:", err);
          const msg = err.response?.data?.message || "Failed to load stock data";
          setError(msg);
          setIsLoading(false);
          setIsDashboardLoading(false);
          toast.error(msg);
        }
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch Stock List Hierarchical Data on Filter Change
  const fetchStockList = async (activeFilters) => {
    try {
      setIsLoading(true);
      setError(null);

      // Clean empty string params
      const params = {};
      const targetFilters = activeFilters || filters;
      for (const [key, val] of Object.entries(targetFilters)) {
        if (val && String(val).trim() !== "") {
          params[key] = String(val).trim();
        }
      }

      const res = await stockApi.getStockList(params);
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setCountryGroups(data);
    } catch (err) {
      console.error("Failed to fetch stock list:", err);
      const msg = err.response?.data?.message || "Failed to load stock data";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Dashboard Summary Metrics
  const fetchDashboard = async () => {
    try {
      setIsDashboardLoading(true);
      const res = await stockApi.getDashboard();
      setSummary(res.data || null);
    } catch (err) {
      console.error("Failed to fetch stock dashboard metrics:", err);
      toast.error("Failed to load dashboard metrics");
    } finally {
      setIsDashboardLoading(false);
    }
  };

  // Handle filter submission
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchStockList(newFilters);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchDashboard();
    fetchStockList(filters);
  };

  // Open product drawer
  const handleSelectProduct = (productItem, country) => {
    setSelectedProduct(productItem);
    setSelectedCountryName(country);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Page Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-100">
                <Layers className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                Stock Management
              </h1>
            </div>
            <p className="text-sm text-gray-500 mt-1 pl-11">
              Automatic Country-wise Product Stock dynamically generated from Purchase Contracts
            </p>
          </div>
        </div>

        {/* Dashboard Summary Cards */}
        <StockDashboardCards summary={summary} isLoading={isDashboardLoading} />

        {/* Filter Toolbar */}
        <StockFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onRefresh={handleRefresh}
          isLoading={isLoading}
        />

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-800 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
            <div>
              <span className="font-semibold">Unable to load stock data:</span> {error}
            </div>
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 animate-pulse h-64 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="h-5 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="space-y-3 py-4 flex-1">
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-100 rounded w-4/6"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && countryGroups.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm max-w-xl mx-auto my-8">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <PackageSearch className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No Stock Data Available</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
              There are no active purchase contracts with place of loading matching your filter criteria.
            </p>
            <button
              onClick={() => handleFilterChange({ search: "", country: "", product: "", supplier: "", buyer: "" })}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Excel Dashboard Grid: 1 col on mobile, 2 cols on desktop, 3 cols on large screen */}
        {!isLoading && countryGroups.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
            {countryGroups.map((group) => (
              <CountryStockCard
                key={group.country}
                countryGroup={group}
                onSelectProduct={handleSelectProduct}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Detail Drawer with Purchase Contracts */}
      <StockProductDrawer
        key={`${selectedCountryName}-${selectedProduct?.product || ""}`}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        selectedProduct={selectedProduct}
        countryName={selectedCountryName}
      />
    </div>
  );
}
