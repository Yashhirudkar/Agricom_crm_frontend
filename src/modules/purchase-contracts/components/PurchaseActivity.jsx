"use client";
import React, { useState } from "react";
import {
  Activity,
  User,
  Clock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FileCheck,
  Ship,
  RefreshCw,
} from "lucide-react";
import { usePurchaseContractActivity } from "../hooks/usePurchaseContracts";

const ACTION_ICONS = {
  PC_CREATED: Sparkles,
  PC_UPDATED: RefreshCw,
  STATUS_CHANGED: RefreshCw,
  SHIPMENT_ADDED: Ship,
  SHIPMENT_REMOVED: Ship,
  DOCUMENT_ADDED: FileCheck,
  DOCUMENT_UPLOADED: FileCheck,
  DOCUMENT_DELETED: FileCheck,
};

const ACTION_COLORS = {
  PC_CREATED: "text-purple-600 bg-purple-50 border-purple-200",
  STATUS_CHANGED: "text-blue-600 bg-blue-50 border-blue-200",
  SHIPMENT_ADDED: "text-emerald-600 bg-emerald-50 border-emerald-200",
  SHIPMENT_REMOVED: "text-red-600 bg-red-50 border-red-200",
  DOCUMENT_UPLOADED: "text-teal-600 bg-teal-50 border-teal-200",
  DOCUMENT_DELETED: "text-amber-600 bg-amber-50 border-amber-200",
};

export default function PurchaseActivity({ contractId }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePurchaseContractActivity(contractId, page);

  const activities = data?.data || [];
  const totalPages = data?.totalPages || 1;

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center animate-pulse">
        <Activity className="h-8 w-8 text-purple-500 mx-auto mb-2 animate-bounce" />
        <span className="text-xs font-semibold text-gray-500">Loading activity feed...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Activity Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Activity className="h-4 w-4 text-purple-600" />
            Operational Activity & Domain Stream
          </h3>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Audit trail of human-readable domain events for operations teams.
          </p>
        </div>
        <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100 font-mono">
          {data?.total || 0} Total Events
        </span>
      </div>

      {/* Activity Timeline List */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="space-y-4">
          {activities.map((act) => {
            const Icon = ACTION_ICONS[act.action] || Activity;
            const colorClass = ACTION_COLORS[act.action] || "text-gray-600 bg-gray-50 border-gray-200";
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
                className="flex items-start gap-4 p-3.5 rounded-xl border border-gray-100 hover:border-purple-100 hover:bg-purple-50/20 transition-all"
              >
                <div className={`p-2 rounded-xl border ${colorClass} mt-0.5 flex-shrink-0`}>
                  <Icon className="h-4 w-4" />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">
                      {act.description || act.action}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {dateStr}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-gray-500">
                    <span className="inline-flex items-center gap-1 font-semibold text-gray-700">
                      <User className="h-3 w-3 text-gray-400" />
                      User ID: #{act.performedBy || "System"}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="font-mono text-[10px] bg-gray-100 px-1.5 py-0.2 rounded font-semibold text-gray-600">
                      {act.action}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {activities.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Activity className="h-8 w-8 mx-auto mb-2 text-gray-300 stroke-[1.2]" />
              <p className="text-xs font-semibold text-gray-600">No activity logged yet</p>
              <p className="text-[11px] text-gray-400 mt-1">
                Domain events will be recorded automatically as operations progress.
              </p>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs">
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
