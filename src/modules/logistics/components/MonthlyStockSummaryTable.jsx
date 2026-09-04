"use client";

import React from "react";
import { Eye, Edit2, Copy, Trash2, Send, FileText } from "lucide-react";

export default function MonthlyStockSummaryTable({
  data = [],
  loading = false,
  onView,
  onEdit,
  onPublish,
  onDuplicate,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="inline-block w-6 h-6 border-2 border-[#007aff] border-t-transparent rounded-full animate-spin mb-2" />
        <p className="text-xs text-gray-400 font-medium">Loading monthly stock summaries...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-12 text-center space-y-3">
        <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mx-auto text-gray-400">
          <FileText className="h-6 w-6" />
        </div>
        <p className="text-sm font-semibold text-gray-800">No Monthly Stock Summaries Found</p>
        <p className="text-xs text-gray-400 max-w-sm mx-auto">
          Create your first monthly entry report to begin managing stock summaries.
        </p>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            <th className="py-3.5 px-4 pl-6">Month</th>
            <th className="py-3.5 px-4">Year</th>
            <th className="py-3.5 px-4">Scope</th>
            <th className="py-3.5 px-4">Report Title</th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4">Created By</th>
            <th className="py-3.5 px-4">Updated</th>
            <th className="py-3.5 px-4 pr-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
          {data.map((row) => {
            const isPublished = row.status === "Published";
            const countryList = row.countries
              ?.map((c) => c.countryName)
              .join(", ");

            return (
              <tr
                key={row.id}
                className="hover:bg-gray-50/60 transition-colors group"
              >
                {/* Month */}
                <td className="py-3.5 px-4 pl-6 font-semibold text-gray-900">
                  {row.monthName || row.month}
                </td>

                {/* Year */}
                <td className="py-3.5 px-4 font-mono font-medium text-gray-600">
                  {row.year}
                </td>

                {/* Scope */}
                <td className="py-3.5 px-4 font-medium text-gray-800 max-w-[180px] truncate" title={countryList}>
                  {countryList || "—"}
                </td>

                {/* Report Title */}
                <td className="py-3.5 px-4 font-bold text-gray-900 font-mono tracking-tight">
                  {row.reportTitle || "—"}
                </td>

                {/* Status Badge */}
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                      isPublished
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isPublished ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                    {row.status}
                  </span>
                </td>

                {/* Created By */}
                <td className="py-3.5 px-4 text-gray-600 font-medium">
                  {row.creator?.name || row.creator?.email || "Admin"}
                </td>

                {/* Updated */}
                <td className="py-3.5 px-4 text-gray-400 font-medium text-[11px]">
                  {formatDate(row.updatedAt || row.createdAt)}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 pr-6 text-right">
                  <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100">
                    {/* View */}
                    <button
                      onClick={() => onView?.(row)}
                      title="View Full-Screen Report Builder (Read-Only)"
                      className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => onEdit?.(row)}
                      title={isPublished ? "View Published Report (Read-Only)" : "Edit Full-Screen Report Builder"}
                      className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>

                    {/* Publish (Draft only) */}
                    {!isPublished && (
                      <button
                        onClick={() => onPublish?.(row)}
                        title="Publish Report"
                        className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    )}

                    {/* Duplicate */}
                    <button
                      onClick={() => onDuplicate?.(row)}
                      title="Duplicate (Suggest Next Month)"
                      className="p-1.5 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Copy className="h-4 w-4" />
                    </button>

                    {/* Delete (Draft only) */}
                    {!isPublished && (
                      <button
                        onClick={() => onDelete?.(row)}
                        title="Delete Entry"
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
