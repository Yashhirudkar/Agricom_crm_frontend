"use client";

import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import ChartCard from "./ChartCard";
import {
  formatCompactCurrency,
  formatCompactNumber,
  formatCurrencyValue,
  formatNumber,
} from "@/app/(crm)/reports/sales/utils/salesAnalyticsUtils";

function TrendTooltip({ active, payload, label, currencyMeta }) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload || {};

  return (
    <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg px-3.5 py-2.5 text-xs">
      <p className="font-bold text-gray-900 mb-1.5">{label}</p>
      <div className="space-y-1 tabular-nums">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-gray-600">
            <span className="w-2 h-2 rounded-full bg-[#007aff]" />
            Revenue
          </span>
          <span className="font-semibold text-gray-900">
            {formatCurrencyValue(row.revenue, currencyMeta)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-gray-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Quantity
          </span>
          <span className="font-semibold text-gray-900">
            {formatNumber(row.quantity, 2)} MT
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 pt-1 border-t border-gray-100">
          <span className="text-gray-500">Orders</span>
          <span className="font-semibold text-gray-800">{row.orders || 0}</span>
        </div>
      </div>
    </div>
  );
}

export default function SalesTrendLineChart({
  monthlyData = [],
  dailyData = [],
  currencyMeta,
  activeMonthLabel = "",
}) {
  const [granularity, setGranularity] = useState("monthly"); // 'monthly' | 'daily'
  const [seriesMode, setSeriesMode] = useState("both"); // 'both' | 'revenue' | 'quantity'

  const chartData = useMemo(() => {
    if (granularity === "daily" && dailyData.length > 0) {
      return dailyData;
    }
    return monthlyData;
  }, [granularity, monthlyData, dailyData]);

  const hasData = chartData.some((d) => d.revenue > 0 || d.quantity > 0 || d.orders > 0);
  const showRevenue = seriesMode === "both" || seriesMode === "revenue";
  const showQuantity = seriesMode === "both" || seriesMode === "quantity";

  const actionControls = (
    <div className="flex flex-wrap items-center gap-2">
      {dailyData.length > 0 && (
        <div className="inline-flex rounded-lg bg-gray-100 p-0.5 text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setGranularity("monthly")}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              granularity === "monthly"
                ? "bg-white text-gray-900 shadow-2xs"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setGranularity("daily")}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              granularity === "daily"
                ? "bg-white text-gray-900 shadow-2xs"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Daily
          </button>
        </div>
      )}

      <div className="inline-flex rounded-lg bg-gray-100 p-0.5 text-[11px] font-semibold">
        {[
          { key: "both", label: "Both" },
          { key: "revenue", label: "Revenue" },
          { key: "quantity", label: "Qty" },
        ].map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setSeriesMode(opt.key)}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              seriesMode === opt.key
                ? "bg-white text-[#007aff] shadow-2xs"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <ChartCard
      title="Monthly Sales Trend"
      subtitle={
        granularity === "daily"
          ? "Daily revenue and quantity movement within the filtered period"
          : "Month-wise revenue and quantity trajectory (Jan – Dec)"
      }
      badge={
        granularity === "monthly" && activeMonthLabel
          ? `Filtered: ${activeMonthLabel}`
          : undefined
      }
      action={actionControls}
      empty={!hasData}
      emptyMessage="No dated order activity available for the selected filters."
      exportTitle="Monthly Sales Trend"
    >
      <div className="w-full h-[290px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          initialDimension={{ width: 640, height: 290 }}
        >
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 16, left: 6, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
              interval={granularity === "daily" && chartData.length > 14 ? "preserveStartEnd" : 0}
            />
            {showRevenue && (
              <YAxis
                yAxisId="revenue"
                orientation="left"
                tickFormatter={(v) => formatCompactCurrency(v, currencyMeta)}
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={64}
              />
            )}
            {showQuantity && (
              <YAxis
                yAxisId="quantity"
                orientation={showRevenue ? "right" : "left"}
                tickFormatter={(v) => `${formatCompactNumber(v)} MT`}
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={64}
              />
            )}
            <Tooltip
              content={<TrendTooltip currencyMeta={currencyMeta} />}
              cursor={{ stroke: "#cbd5e1", strokeDasharray: "4 4" }}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
              iconType="circle"
            />
            {showRevenue && (
              <Line
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#007aff"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: "#007aff", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
              />
            )}
            {showQuantity && (
              <Line
                yAxisId="quantity"
                type="monotone"
                dataKey="quantity"
                name="Quantity (MT)"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
