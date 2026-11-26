"use client";

import React from "react";

export default function ChartCard({
  title,
  subtitle,
  action,
  badge,
  children,
  empty = false,
  emptyMessage = "No data available for the selected filters.",
  className = "",
  exportTitle,
}) {
  return (
    <section
      data-chart-card={exportTitle || title ? "true" : undefined}
      data-chart-title={exportTitle || title}
      className={`bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-5 flex flex-col break-inside-avoid ${className}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[15px] font-bold text-gray-900 tracking-tight">
              {title}
            </h3>
            {badge && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        {action && (
          <div data-export-hide="true" className="flex items-center gap-1.5 shrink-0">
            {action}
          </div>
        )}
      </div>

      {empty ? (
        <div className="flex-1 min-h-[220px] flex items-center justify-center text-sm text-gray-400 text-center px-4">
          {emptyMessage}
        </div>
      ) : (
        <div className="flex-1 min-h-0">{children}</div>
      )}
    </section>
  );
}
