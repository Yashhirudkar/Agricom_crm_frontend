"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpDown,
  ArrowUpRight,
  Award,
  BarChart3,
  Crown,
  DollarSign,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  Layers,
  Minus,
  Package,
  RefreshCw,
  ShoppingCart,
  Tag,
  X,
} from "lucide-react";
import Drawer from "@/components/common/Drawer";
import SalesTrendLineChart from "@/components/charts/SalesTrendLineChart";
import DonutDistributionChart from "@/components/charts/DonutDistributionChart";
import HorizontalBarChart from "@/components/charts/HorizontalBarChart";
import CountrySalesBarChart from "@/components/charts/CountrySalesBarChart";
import { toast } from "@/lib/toast";
import {
  computeSalesAnalytics,
  formatCompactCurrency,
  formatCurrencyValue,
  formatNumber,
} from "../utils/salesAnalyticsUtils";
import {
  exportSalesAnalyticsExcel,
  exportSalesAnalyticsPdf,
  exportSalesAnalyticsPng,
} from "../utils/salesAnalyticsExport";

function KpiCard({ title, value, subtitle, icon: Icon, iconBg, iconColor }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-4 flex flex-col justify-between min-w-0">
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider leading-tight">
          {title}
        </span>
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3 min-w-0">
        <p
          className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight truncate tabular-nums"
          title={String(value)}
        >
          {value}
        </p>
        {subtitle && (
          <p
            className="text-[11px] text-gray-500 mt-1 truncate font-medium"
            title={String(subtitle)}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

function MomComparisonCard({
  title,
  currentValue,
  previousValue,
  currentLabel,
  previousLabel,
  deltaPct,
  canCompare,
}) {
  const isPositive = deltaPct !== null && deltaPct > 0;
  const isNegative = deltaPct !== null && deltaPct < 0;

  let badgeClass = "bg-gray-100 text-gray-600 border-gray-200";
  let DeltaIcon = Minus;
  if (deltaPct !== null) {
    if (isPositive) {
      badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
      DeltaIcon = ArrowUpRight;
    } else if (isNegative) {
      badgeClass = "bg-rose-50 text-rose-700 border-rose-200";
      DeltaIcon = ArrowDownRight;
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </span>
        <span
          className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold border tabular-nums ${badgeClass}`}
        >
          <DeltaIcon className="w-3.5 h-3.5" />
          {deltaPct === null
            ? "N/A"
            : `${deltaPct > 0 ? "+" : ""}${deltaPct.toFixed(1)}%`}
        </span>
      </div>

      <div className="mt-2.5 flex items-baseline justify-between gap-3">
        <div>
          <p className="text-[11px] text-gray-400 font-medium">{currentLabel}</p>
          <p className="text-lg font-bold text-gray-900 tabular-nums mt-0.5">
            {currentValue}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-gray-400 font-medium">
            {canCompare ? previousLabel : "Previous Month"}
          </p>
          <p className="text-sm font-semibold text-gray-600 tabular-nums mt-0.5">
            {canCompare ? previousValue : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SalesAnalyticsDrawer({
  isOpen,
  onClose,
  orders = [],
  loading = false,
  error = null,
  onRetry,
  filters = {},
  options = {},
  availableExecutives = [],
  canExport = false,
}) {
  const dashboardRef = useRef(null);
  const [exportingType, setExportingType] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "revenue",
    direction: "desc",
  });

  const analytics = useMemo(
    () => computeSalesAnalytics(orders, filters, options, availableExecutives),
    [orders, filters, options, availableExecutives]
  );

  const sortedProductRows = useMemo(() => {
    const rows = [...analytics.productPerformanceTable];
    const { key, direction } = sortConfig;
    const multiplier = direction === "asc" ? 1 : -1;

    rows.sort((a, b) => {
      if (key === "name") {
        return multiplier * a.name.localeCompare(b.name);
      }
      return multiplier * ((a[key] || 0) - (b[key] || 0));
    });
    return rows;
  }, [analytics.productPerformanceTable, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "desc" ? "asc" : "desc" }
        : { key, direction: key === "name" ? "asc" : "desc" }
    );
  };

  const handleExportExcel = async () => {
    try {
      setExportingType("excel");
      await exportSalesAnalyticsExcel({ analytics, orders });
      toast.success("Analytics exported to Excel successfully.");
    } catch (err) {
      console.error("Failed to export analytics Excel:", err);
      toast.error("Failed to export analytics Excel.");
    } finally {
      setExportingType(null);
    }
  };

  const handleExportPng = async () => {
    try {
      setExportingType("png");
      await exportSalesAnalyticsPng({
        containerEl: dashboardRef.current,
        analytics,
      });
      toast.success("Analytics PNG downloaded.");
    } catch (err) {
      console.error("Failed to export analytics PNG:", err);
      toast.error("Failed to export analytics PNG.");
    } finally {
      setExportingType(null);
    }
  };

  const handleExportPdf = () => {
    try {
      setExportingType("pdf");
      const ok = exportSalesAnalyticsPdf({
        elementId: "sales-analytics-print-area",
      });
      if (!ok) {
        toast.error("Unable to open PDF export view.");
      }
    } catch (err) {
      console.error("Failed to export analytics PDF:", err);
      toast.error("Failed to export analytics PDF.");
    } finally {
      setTimeout(() => setExportingType(null), 500);
    }
  };

  const {
    currencyMeta,
    activeFilters,
    kpis,
    monthOverMonth,
    monthlyTrend,
    dailyTrend,
    productDistribution,
    executivePerformance,
    countrySales,
    customerContribution,
  } = analytics;

  const activeMonthChip = filters.month
    ? activeFilters.find((c) => c.key === "month")?.value || ""
    : "";

  const revenueSubtitle =
    currencyMeta.mode === "mixed"
      ? currencyMeta.breakdown
          .slice(0, 2)
          .map((b) => `${b.code} ${formatNumber(b.total)}`)
          .join(" · ")
      : currencyMeta.code
      ? `${currencyMeta.code} confirmed sales`
      : "Confirmed order value";

  const showExportActions =
    canExport && !loading && !error && orders.length > 0;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      hideHeader
      widthClass="w-full sm:w-[95vw] lg:w-[90vw] xl:w-[86vw] max-w-[1440px]"
    >
      {/* Sticky Drawer Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-5 sm:px-6 py-4 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-[#007aff] flex items-center justify-center shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                  Sales Analytics Dashboard
                </h2>
                {!loading && !error && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 tabular-nums">
                    {orders.length} {orders.length === 1 ? "Order" : "Orders"}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5 truncate">
                Visual performance insights derived directly from the active report filters.
              </p>
            </div>
          </div>

          {/* Export Analytics & Close Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {showExportActions && (
              <>
                <button
                  type="button"
                  onClick={handleExportPdf}
                  disabled={Boolean(exportingType)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg shadow-2xs hover:bg-gray-50 transition-colors text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  <FileText className="w-3.5 h-3.5 text-rose-600" />
                  Export PDF
                </button>
                <button
                  type="button"
                  onClick={handleExportPng}
                  disabled={Boolean(exportingType)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg shadow-2xs hover:bg-gray-50 transition-colors text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                  {exportingType === "png" ? "Exporting..." : "Export PNG"}
                </button>
                <button
                  type="button"
                  onClick={handleExportExcel}
                  disabled={Boolean(exportingType)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg shadow-2xs hover:bg-gray-50 transition-colors text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  {exportingType === "excel" ? "Exporting..." : "Export Excel"}
                </button>
                <div className="h-5 w-px bg-gray-200 mx-0.5 hidden sm:block" />
              </>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label="Close Analytics Drawer"
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Active Filter Context Bar */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mr-1">
            Active Filters:
          </span>
          {activeFilters.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[11px] font-medium"
            >
              <span className="text-gray-400">{chip.label}:</span>
              <span className="font-semibold text-gray-800">{chip.value}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto bg-gray-50/80 p-5 sm:p-6">
        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-gray-100 p-4 h-[106px] animate-pulse"
                >
                  <div className="h-3 w-20 bg-gray-200 rounded mb-4" />
                  <div className="h-6 w-28 bg-gray-200 rounded mb-2" />
                  <div className="h-2.5 w-24 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
            <div className="bg-white/90 rounded-2xl border border-gray-100 py-20 text-center text-gray-500 font-medium animate-pulse">
              Loading report data...
            </div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-10 max-w-lg mx-auto my-12 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Unable to Load Analytics
            </h3>
            <p className="text-sm text-gray-500 mb-5">{error}</p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#007aff] hover:bg-[#0062cc] text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            )}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 py-20 px-6 text-center text-gray-500">
            No confirmed orders found for the selected filters.
          </div>
        ) : (
          <div
            id="sales-analytics-print-area"
            ref={dashboardRef}
            className="space-y-6"
          >
            {/* PDF-only Report Header */}
            <div className="hidden print:block border-b border-gray-200 pb-3 mb-4">
              <h1 className="text-xl font-bold text-gray-900">
                Monthly Sales Analysis — Analytics Report
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                {activeFilters.map((f) => `${f.label}: ${f.value}`).join(" • ")} | Generated{" "}
                {new Date().toLocaleString()}
              </p>
            </div>

            {/* 1. Top KPI Cards */}
            <section aria-label="Key Performance Indicators">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <KpiCard
                  title="Total Revenue"
                  value={formatCurrencyValue(kpis.totalRevenue, currencyMeta)}
                  subtitle={revenueSubtitle}
                  icon={DollarSign}
                  iconBg="bg-blue-50"
                  iconColor="text-[#007aff]"
                />
                <KpiCard
                  title="Total Quantity"
                  value={`${formatNumber(kpis.totalQuantity, 2)} MT`}
                  subtitle={`Avg ${formatNumber(kpis.avgOrderQty, 1)} MT / order`}
                  icon={Package}
                  iconBg="bg-emerald-50"
                  iconColor="text-emerald-600"
                />
                <KpiCard
                  title="Avg Selling Price"
                  value={`${formatCurrencyValue(kpis.avgSellingPrice, currencyMeta)} / MT`}
                  subtitle="Weighted per MT"
                  icon={Tag}
                  iconBg="bg-indigo-50"
                  iconColor="text-indigo-600"
                />
                <KpiCard
                  title="Total Orders"
                  value={formatNumber(kpis.totalOrders)}
                  subtitle={`${kpis.uniqueCustomers} buyers · ${kpis.activeExecutives} execs`}
                  icon={ShoppingCart}
                  iconBg="bg-amber-50"
                  iconColor="text-amber-600"
                />
                <KpiCard
                  title="Top Customer"
                  value={kpis.topCustomer?.name || "N/A"}
                  subtitle={
                    kpis.topCustomer
                      ? `${formatCurrencyValue(kpis.topCustomer.revenue, currencyMeta)} (${kpis.topCustomer.sharePct.toFixed(1)}%)`
                      : "No customer data"
                  }
                  icon={Crown}
                  iconBg="bg-pink-50"
                  iconColor="text-pink-600"
                />
                <KpiCard
                  title="Top Executive"
                  value={kpis.topExecutive?.name || "N/A"}
                  subtitle={
                    kpis.topExecutive
                      ? `${kpis.topExecutive.orders} orders · ${formatCurrencyValue(kpis.topExecutive.revenue, currencyMeta)}`
                      : "No executive data"
                  }
                  icon={Award}
                  iconBg="bg-cyan-50"
                  iconColor="text-cyan-600"
                />
              </div>
            </section>

            {/* 2. Month-over-Month Comparison Cards */}
            <section aria-label="Month-over-Month Comparison" className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#007aff]" />
                  <h3 className="text-sm font-bold text-gray-800 tracking-tight">
                    Month-over-Month Comparison
                  </h3>
                  <span className="text-xs text-gray-500">
                    ({monthOverMonth.currentLabel} vs {monthOverMonth.previousLabel})
                  </span>
                </div>
                {!monthOverMonth.canCompare && (
                  <span className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200/70 px-2.5 py-0.5 rounded-full">
                    {monthOverMonth.isSingleMonthFilter
                      ? "Single month selected — choose 'All Months' for MoM % comparison"
                      : "Multiple months needed for MoM % comparison"}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MomComparisonCard
                  title="Revenue"
                  currentValue={formatCurrencyValue(
                    monthOverMonth.revenue.current,
                    currencyMeta
                  )}
                  previousValue={formatCurrencyValue(
                    monthOverMonth.revenue.previous,
                    currencyMeta
                  )}
                  currentLabel={monthOverMonth.currentLabel}
                  previousLabel={monthOverMonth.previousLabel}
                  deltaPct={monthOverMonth.revenue.deltaPct}
                  canCompare={monthOverMonth.canCompare}
                />
                <MomComparisonCard
                  title="Quantity"
                  currentValue={`${formatNumber(
                    monthOverMonth.quantity.current,
                    2
                  )} MT`}
                  previousValue={`${formatNumber(
                    monthOverMonth.quantity.previous,
                    2
                  )} MT`}
                  currentLabel={monthOverMonth.currentLabel}
                  previousLabel={monthOverMonth.previousLabel}
                  deltaPct={monthOverMonth.quantity.deltaPct}
                  canCompare={monthOverMonth.canCompare}
                />
                <MomComparisonCard
                  title="Orders"
                  currentValue={formatNumber(monthOverMonth.orders.current)}
                  previousValue={formatNumber(monthOverMonth.orders.previous)}
                  currentLabel={monthOverMonth.currentLabel}
                  previousLabel={monthOverMonth.previousLabel}
                  deltaPct={monthOverMonth.orders.deltaPct}
                  canCompare={monthOverMonth.canCompare}
                />
              </div>
            </section>

            {/* 3. Monthly Sales Trend */}
            <SalesTrendLineChart
              monthlyData={monthlyTrend}
              dailyData={dailyTrend}
              currencyMeta={currencyMeta}
              activeMonthLabel={activeMonthChip}
            />

            {/* 4. Product Distribution & Executive Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DonutDistributionChart
                title="Product Distribution"
                subtitle="Share of sales across product lines"
                data={productDistribution}
                currencyMeta={currencyMeta}
                centerLabel="Products"
                centerValue={formatCompactCurrency(
                  kpis.totalRevenue,
                  currencyMeta
                )}
                emptyMessage="No product distribution data available."
              />

              <HorizontalBarChart
                title="Executive Performance"
                subtitle="Compare executives by revenue, quantity, or order count"
                data={executivePerformance}
                currencyMeta={currencyMeta}
              />
            </div>

            {/* 5. Country-wise Sales & Customer Contribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CountrySalesBarChart
                title="Country-wise Sales"
                subtitle="Destination revenue and quantity (MT)"
                data={countrySales}
                currencyMeta={currencyMeta}
              />

              <DonutDistributionChart
                title="Customer Contribution"
                subtitle="Top 10 customers & remaining share"
                data={customerContribution}
                currencyMeta={currencyMeta}
                centerLabel="Top Buyers"
                centerValue={`${kpis.uniqueCustomers}`}
                emptyMessage="No customer contribution data available."
              />
            </div>

            {/* 6. Product Performance Table */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden break-inside-avoid">
              <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-[15px] font-bold text-gray-900 tracking-tight">
                    Product Performance Table
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Orders, quantity, revenue, average realized price, and revenue contribution per product
                  </p>
                </div>
                <span className="text-xs font-semibold text-gray-500 tabular-nums">
                  {sortedProductRows.length}{" "}
                  {sortedProductRows.length === 1 ? "Product" : "Products"}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse min-w-[760px]">
                  <thead className="bg-gray-50/80 text-gray-500 font-medium border-b border-gray-100 text-xs tracking-wider uppercase">
                    <tr>
                      {[
                        { key: "name", label: "Product", align: "left" },
                        { key: "orders", label: "Orders", align: "right" },
                        { key: "quantity", label: "Quantity (MT)", align: "right" },
                        { key: "revenue", label: "Revenue", align: "right" },
                        { key: "avgPrice", label: "Average Price", align: "right" },
                        {
                          key: "contributionPct",
                          label: "Contribution %",
                          align: "right",
                        },
                      ].map((col) => (
                        <th
                          key={col.key}
                          className={`py-3.5 px-5 font-semibold ${
                            col.align === "right" ? "text-right" : "text-left"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleSort(col.key)}
                            className={`inline-flex items-center gap-1 hover:text-gray-800 transition-colors cursor-pointer ${
                              col.align === "right" ? "flex-row-reverse" : ""
                            }`}
                          >
                            <span>{col.label}</span>
                            <ArrowUpDown
                              className={`w-3 h-3 ${
                                sortConfig.key === col.key
                                  ? "text-[#007aff]"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-gray-700">
                    {sortedProductRows.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-gray-50/80 transition-colors"
                      >
                        <td className="py-3.5 px-5 font-semibold text-gray-900">
                          {row.name}
                        </td>
                        <td className="py-3.5 px-5 text-right tabular-nums text-gray-600">
                          {formatNumber(row.orders)}
                        </td>
                        <td className="py-3.5 px-5 text-right tabular-nums font-medium text-gray-800">
                          {formatNumber(row.quantity, 2)}
                        </td>
                        <td className="py-3.5 px-5 text-right tabular-nums font-semibold text-gray-900">
                          {formatCurrencyValue(row.revenue, currencyMeta)}
                        </td>
                        <td className="py-3.5 px-5 text-right tabular-nums text-gray-600">
                          {formatCurrencyValue(row.avgPrice, currencyMeta)}
                          <span className="text-[11px] text-gray-400 ml-1">
                            / MT
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right tabular-nums">
                          <div className="inline-flex items-center gap-2.5 justify-end min-w-[120px]">
                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#007aff] rounded-full"
                                style={{
                                  width: `${Math.min(100, Math.max(0, row.contributionPct))}%`,
                                }}
                              />
                            </div>
                            <span className="font-bold text-blue-700 w-12 text-right">
                              {row.contributionPct.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50/80 border-t border-gray-100 font-bold text-gray-900 text-sm">
                    <tr>
                      <td className="py-3.5 px-5 uppercase tracking-wider text-[11px] text-gray-400">
                        Total
                      </td>
                      <td className="py-3.5 px-5 text-right tabular-nums">
                        {formatNumber(kpis.totalOrders)}
                      </td>
                      <td className="py-3.5 px-5 text-right tabular-nums text-blue-700 bg-blue-50/30">
                        {formatNumber(kpis.totalQuantity, 2)}{" "}
                        <span className="text-xs text-blue-500/70 font-medium">
                          MT
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right tabular-nums text-emerald-700 bg-emerald-50/30">
                        {formatCurrencyValue(kpis.totalRevenue, currencyMeta)}
                      </td>
                      <td className="py-3.5 px-5 text-right tabular-nums text-gray-700">
                        {formatCurrencyValue(kpis.avgSellingPrice, currencyMeta)}{" "}
                        <span className="text-xs text-gray-400 font-medium">
                          / MT
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right tabular-nums text-gray-700">
                        100.0%
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>
          </div>
        )}
      </div>
    </Drawer>
  );
}
