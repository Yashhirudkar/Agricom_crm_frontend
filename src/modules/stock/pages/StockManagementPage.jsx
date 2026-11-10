"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { Layers, PackageSearch, AlertCircle } from "lucide-react";
import { stockApi } from "../services/stockApi";
import StockDashboardCards from "../components/StockDashboardCards";
import StockFilters from "../components/StockFilters";
import MasterStockTable from "../components/MasterStockTable";
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

  // Fetch Stock List Hierarchical Data on Filter Change
  const fetchStockList = useCallback(async (activeFilters) => {
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
  }, [filters]);

  // Fetch Dashboard Summary Metrics
  const fetchDashboard = useCallback(async () => {
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
  }, []);

  // Initial load & automatic refresh on shipment execution
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

    // Automatically refresh Stock Management when any shipment is executed anywhere in the app
    const handleShipmentExecuted = () => {
      fetchDashboard();
      fetchStockList(filters);
    };
    window.addEventListener("shipment-executed", handleShipmentExecuted);

    return () => {
      isMounted = false;
      window.removeEventListener("shipment-executed", handleShipmentExecuted);
    };
  }, [fetchDashboard, fetchStockList, filters]);

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

  // Keep active product in sync with fresh data when countryGroups updates
  const activeProduct = useMemo(() => {
    if (!selectedProduct || !selectedCountryName) return null;
    const countryGroup = countryGroups.find(
      (cg) => cg.country.toLowerCase() === selectedCountryName.toLowerCase(),
    );
    return (
      countryGroup?.products.find(
        (p) =>
          p.product.toLowerCase() === selectedProduct.product?.toLowerCase(),
      ) || selectedProduct
    );
  }, [countryGroups, selectedProduct, selectedCountryName]);

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

        {/* Unified Filter + Table Container */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* Filter Toolbar */}
          <StockFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onRefresh={handleRefresh}
            isLoading={isLoading}
          />

          {/* Error Alert */}
          {error && (
            <div className="m-4 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-800 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
              <div>
                <span className="font-semibold">Unable to load stock data:</span> {error}
              </div>
            </div>
          )}

          {/* Loading Skeletons */}
          {isLoading && (
            <div className="p-6 animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <div key={idx} className="h-10 bg-gray-100 rounded w-full"></div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && countryGroups.length === 0 && (
            <div className="p-12 text-center max-w-xl mx-auto my-4">
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

          {/* Master Excel-Style Stock Table */}
          {!isLoading && countryGroups.length > 0 && (
            <MasterStockTable
              countryGroups={countryGroups}
              onSelectProduct={handleSelectProduct}
              summary={summary}
            />
          )}
        </div>
      </div>

      {/* Product Detail Drawer with Purchase Contracts & Executed Movements */}
      <StockProductDrawer
        key={`${selectedCountryName}-${activeProduct?.product || ""}`}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        selectedProduct={activeProduct}
        countryName={selectedCountryName}
      />
    </div>
  );
}
