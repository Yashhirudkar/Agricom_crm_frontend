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
} from "recharts";
import ChartCard from "./ChartCard";
import {
  ANALYTICS_COLORS,
  formatCompactCurrency,
  formatCompactNumber,
  formatCurrencyValue,
  formatNumber,
} from "@/app/(crm)/reports/sales/utils/salesAnalyticsUtils";

const METRICS = [
  { key: "revenue", label: "Revenue", color: "#007aff" },
  { key: "quantity", label: "Quantity", color: "#10b981" },
  { key: "orders", label: "Orders", color: "#6366f1" },
];

function HorizontalBarTooltip({ active, payload, currencyMeta }) {
  if (!active || !payload?.length) return null;
  const item = payload[0]?.payload || {};

  return (
    <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg px-3.5 py-2.5 text-xs">
      <p className="font-bold text-gray-900 mb-1.5">
        {item.fullName || item.name}
      </p>
      <div className="space-y-1 tabular-nums">
        <div className="flex items-center justify-between gap-4">
          <span className="text-gray-500">Revenue</span>
          <span className="font-semibold text-gray-900">
            {formatCurrencyValue(item.revenue, currencyMeta)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-gray-500">Quantity</span>
          <span className="font-semibold text-gray-900">
            {formatNumber(item.quantity, 2)} MT
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-gray-500">Orders</span>
          <span className="font-semibold text-gray-900">{item.orders || 0}</span>
        </div>
      </div>
    </div>
  );
}

export default function HorizontalBarChart({
  title = "Executive Performance",
  subtitle = "Compare sales executives by revenue, quantity, or orders",
  data = [],
  currencyMeta,
}) {
  const [metric, setMetric] = useState("revenue");

  const activeMetricConfig =
    METRICS.find((m) => m.key === metric) || METRICS[0];

  const sortedData = useMemo(() => {
    return [...data]
      .sort((a, b) => (b[metric] || 0) - (a[metric] || 0))
      .map((item, idx) => ({
        ...item,
        fill: ANALYTICS_COLORS[idx % (ANALYTICS_COLORS.length - 1)],
      }));
  }, [data, metric]);

  const chartHeight = Math.max(230, sortedData.length * 42 + 24);

  const formatXAxis = (val) => {
    if (metric === "revenue") return formatCompactCurrency(val, currencyMeta);
    if (metric === "quantity") return `${formatCompactNumber(val)} MT`;
    return formatCompactNumber(val);
  };

  const toggleControl = (
    <div className="inline-flex rounded-lg bg-gray-100 p-0.5 text-[11px] font-semibold">
      {METRICS.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => setMetric(opt.key)}
          className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
            metric === opt.key
              ? "bg-white text-gray-900 shadow-2xs"
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
      subtitle={subtitle}
      action={toggleControl}
      empty={sortedData.length === 0}
      emptyMessage="No executive performance data for the selected filters."
      exportTitle={title}
    >
      <div className="max-h-[290px] overflow-y-auto pr-1">
        <div className="w-full" style={{ height: chartHeight }}>
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
            initialDimension={{ width: 460, height: 240 }}
          >
            <BarChart
              data={sortedData}
              layout="vertical"
              margin={{ top: 4, right: 20, left: 4, bottom: 4 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
                horizontal={false}
              />
              <XAxis
                type="number"
                tickFormatter={formatXAxis}
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
                allowDecimals={metric !== "orders"}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={96}
                tick={{ fill: "#334155", fontSize: 12, fontWeight: 600 }}
                tickFormatter={(name) =>
                  name && name.length > 13 ? `${name.slice(0, 12)}…` : name
                }
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<HorizontalBarTooltip currencyMeta={currencyMeta} />}
                cursor={{ fill: "#f8fafc" }}
              />
              <Bar
                dataKey={metric}
                name={activeMetricConfig.label}
                fill={activeMetricConfig.color}
                radius={[0, 6, 6, 0]}
                barSize={20}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ChartCard>
  );
}
