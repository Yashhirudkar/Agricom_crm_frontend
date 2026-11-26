"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Tooltip } from "recharts";
import ChartCard from "./ChartCard";
import {
  formatCurrencyValue,
  formatNumber,
} from "@/app/(crm)/reports/sales/utils/salesAnalyticsUtils";

function DonutTooltip({ active, payload, currencyMeta }) {
  if (!active || !payload?.length) return null;
  const item = payload[0]?.payload || {};

  return (
    <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg px-3.5 py-2.5 text-xs max-w-[240px]">
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: item.fill || "#007aff" }}
        />
        <p className="font-bold text-gray-900 truncate">
          {item.fullName || item.name}
        </p>
      </div>
      <div className="space-y-1 tabular-nums">
        <div className="flex items-center justify-between gap-4">
          <span className="text-gray-500">Share</span>
          <span className="font-bold text-blue-600">
            {(item.pct || 0).toFixed(1)}%
          </span>
        </div>
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

export default function DonutDistributionChart({
  title,
  subtitle,
  data = [],
  currencyMeta,
  centerLabel = "Total",
  centerValue = "",
  emptyMessage = "No distribution data available.",
}) {
  const hasData = data.length > 0 && data.some((d) => d.value > 0);

  return (
    <ChartCard
      title={title}
      subtitle={subtitle}
      empty={!hasData}
      emptyMessage={emptyMessage}
      exportTitle={title}
    >
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        {/* Donut Canvas */}
        <div className="sm:col-span-5 relative h-[230px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
            initialDimension={{ width: 220, height: 230 }}
          >
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="86%"
                paddingAngle={data.length > 1 ? 2 : 0}
                cornerRadius={4}
                stroke="#ffffff"
                strokeWidth={2}
                isAnimationActive={false}
              />
              <Tooltip content={<DonutTooltip currencyMeta={currencyMeta} />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Summary Overlay */}
          {centerValue && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                {centerLabel}
              </span>
              <span className="text-sm font-bold text-gray-900 tabular-nums mt-0.5 truncate max-w-[110px]">
                {centerValue}
              </span>
            </div>
          )}
        </div>

        {/* Clean Percentage & Value Legend */}
        <div className="sm:col-span-7 space-y-2 max-h-[235px] overflow-y-auto pr-1">
          {data.map((item) => (
            <div
              key={item.id || item.name}
              className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.fill }}
                />
                <span
                  className="text-xs font-medium text-gray-700 truncate"
                  title={item.fullName || item.name}
                >
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-2.5 shrink-0 tabular-nums">
                <span className="text-xs text-gray-500 hidden md:inline">
                  {formatCurrencyValue(item.revenue, currencyMeta)}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-gray-800 text-[11px] font-bold min-w-[46px] justify-center">
                  {item.pct.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}
