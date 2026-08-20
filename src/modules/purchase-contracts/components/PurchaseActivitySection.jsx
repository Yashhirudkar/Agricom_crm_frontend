"use client";
import React, { useState } from "react";
import { Activity, Clock, User, ChevronLeft, ChevronRight } from "lucide-react";
import { usePurchaseContractActivity } from "../hooks/usePurchaseContracts";

export default function PurchaseActivitySection({ contractId }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePurchaseContractActivity(contractId, page);

  const activities = data?.data || [];
  const totalPages = data?.totalPages || 1;

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center animate-pulse">
        <Activity className="h-7 w-7 text-gray-400 mx-auto mb-2 animate-bounce" />
        <span className="text-xs font-semibold text-gray-400">Loading activity timeline...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      {/* Section Header */}
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
            <Activity className="h-3.5 w-3.5 text-gray-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Activity Timeline</h2>
            <p className="text-[10px] text-gray-400">Chronological history of events and updates</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-gray-600 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded">
          {data?.total || 0} Events
        </span>
      </div>

      {/* Activity List */}
      <div className="p-5 space-y-3">
        {activities.map((act) => {
          const dateStr = act.createdAt
            ? new Date(act.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "—";

          return (
            <div
              key={act.id}
              className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-all text-xs"
            >
              <div className="w-2 h-2 rounded-full bg-[#007aff] mt-1.5 flex-shrink-0" />

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">
                    {act.description || act.action}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {dateStr}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-gray-500">
                  <span className="inline-flex items-center gap-1 font-semibold text-gray-700">
                    <User className="h-3 w-3 text-gray-400" />
                    User #{act.performedBy || "System"}
                  </span>
                  <span>•</span>
                  <span className="font-mono text-[10px] bg-white border border-gray-200 px-1.5 py-0.2 rounded font-medium text-gray-600">
                    {act.action}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {activities.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-xs italic">
            No activity recorded yet.
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
            <span className="text-gray-500">
              Page <span className="font-bold text-gray-800">{page}</span> of{" "}
              <span className="font-bold text-gray-800">{totalPages}</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
