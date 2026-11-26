"use client";

import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
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

function CountryTooltip({ active, payload, currencyMeta }) {
  if (!active || !payload?.length) return null;
  const item = payload[0]?.payload || {};

  return (
    <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg px-3.5 py-2.5 text-xs">
      <p className="font-bold text-gray-900 mb-1.5">{item.name}</p>
      <div className="space-y-1 tabular-nums">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-gray-600">
            <span className="w-2 h-2 rounded-full bg-[#007aff]" />
            Revenue
          </span>
          <span className="font-semibold text-gray-900">
            {formatCurrencyValue(item.revenue, currencyMeta)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-gray-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Quantity
          </span>
          <span className="font-semibold text-gray-900">
            {formatNumber(item.quantity, 2)} MT
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 pt-1 border-t border-gray-100">
          <span className="text-gray-500">Orders / Share</span>
          <span className="font-semibold text-gray-800">
            {item.orders || 0} ({(item.pct || 0).toFixed(1)}%)
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CountrySalesBarChart({
  title = "Country-wise Sales",
  subtitle = "Destination revenue and volume comparison",
  data = [],
  currencyMeta,
  maxItems = 10,
}) {
  const [seriesMode, setSeriesMode] = useState("both"); // 'both' | 'revenue' | 'quantity'

  const chartData = useMemo(() => data.slice(0, maxItems), [data, maxItems]);
  const showRevenue = seriesMode === "both" || seriesMode === "revenue";
  const showQuantity = seriesMode === "both" || seriesMode === "quantity";

  const toggleControl = (
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
  );

  return (
    <ChartCard
      title={title}
      subtitle={
        data.length > maxItems
          ? `Top ${maxItems} of ${data.length} countries by revenue`
          : subtitle
      }
      action={toggleControl}
      empty={chartData.length === 0}
      emptyMessage="No destination country sales data for the selected filters."
      exportTitle={title}
    >
      <div className="w-full h-[265px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          initialDimension={{ width: 460, height: 265 }}
        >
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 12, left: 4, bottom: 8 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "#475569", fontSize: 11, fontWeight: 500 }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
              interval={0}
              tickFormatter={(name) =>
                name && name.length > 12 ? `${name.slice(0, 11)}…` : name
              }
            />
            {showRevenue && (
              <YAxis
                yAxisId="revenue"
                orientation="left"
                tickFormatter={(v) => formatCompactCurrency(v, currencyMeta)}
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={60}
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
                width={58}
              />
            )}
            <Tooltip
              content={<CountryTooltip currencyMeta={currencyMeta} />}
              cursor={{ fill: "#f8fafc" }}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "6px" }}
              iconType="circle"
            />
            {showRevenue && (
              <Bar
                yAxisId="revenue"
                dataKey="revenue"
                name="Revenue"
                fill="#007aff"
                radius={[6, 6, 0, 0]}
                maxBarSize={28}
                isAnimationActive={false}
              />
            )}
            {showQuantity && (
              <Bar
                yAxisId="quantity"
                dataKey="quantity"
                name="Quantity (MT)"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
                maxBarSize={28}
                isAnimationActive={false}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
