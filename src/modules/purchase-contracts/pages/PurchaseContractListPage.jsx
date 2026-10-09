"use client";
import React, { useState } from "react";
import {
  FileText,
  Search,
  Filter,
  Eye,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Plus,
  Truck,
  Pencil,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  usePurchaseContractsList,
  usePurchaseContractDashboard,
  useClearPurchaseContractDrafts,
} from "../hooks/usePurchaseContracts";
import ConfirmModal from "@/components/modals/ConfirmModal";

const STATUS_BADGE_CLASSES = {
  Draft: "bg-slate-100 text-slate-700 border-slate-300",
  "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
  "Awaiting Documents": "bg-amber-50 text-amber-700 border-amber-200",
  "Ready for Dispatch": "bg-indigo-50 text-indigo-700 border-indigo-200",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Closed: "bg-gray-100 text-gray-700 border-gray-300",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
};

export default function PurchaseContractListPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const params = {
    page,
    limit: 10,
    ...(search && { search }),
    ...(statusFilter && { status: statusFilter }),
  };

  const [showClearDraftsModal, setShowClearDraftsModal] = useState(false);

  const { data: listData, isLoading: loadingList, refetch: refetchList } = usePurchaseContractsList(params);
  const { data: dashboard } = usePurchaseContractDashboard();
  const { mutate: clearDrafts, isPending: clearingDrafts } = useClearPurchaseContractDrafts();

  const contracts = listData?.data || [];
  const total = listData?.total || 0;
  const totalPages = listData?.totalPages || 1;

  const stats = dashboard?.contracts || {};
  const shipments = dashboard?.shipments || {};
  const financials = dashboard?.financials || {};

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 space-y-3.5 max-w-7xl mx-auto">
      {/* Top Banner & Header (Compact) */}
      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-tight">
              Purchase Contract Workspaces
            </h1>
            <p className="text-[11px] text-gray-500">
              Aggregated trade execution layer from Sales Contracts & Shipments.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowClearDraftsModal(true)}
            disabled={clearingDrafts}
            className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear Drafts</span>
          </button>
          <button
            onClick={() => router.push("/sales/purchase-contracts/new")}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Purchase Contract</span>
          </button>
          <button
            onClick={() => refetchList()}
            className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 border border-gray-200 rounded-lg transition-colors cursor-pointer"
            title="Refresh List"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Dashboard KPI Row (Ultra Compact) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        <div className="bg-white border border-gray-200 rounded-xl px-3.5 py-2 shadow-xs flex items-center justify-between">
          <span className="text-[11px] font-semibold text-gray-500">Total Contracts</span>
          <span className="text-base font-extrabold text-gray-900 font-mono">{stats.total || 0}</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl px-3.5 py-2 shadow-xs flex items-center justify-between">
          <span className="text-[11px] font-semibold text-blue-600">Active</span>
          <span className="text-base font-extrabold text-blue-700 font-mono">{stats.active || 0}</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl px-3.5 py-2 shadow-xs flex items-center justify-between">
          <span className="text-[11px] font-semibold text-amber-600">Awaiting Docs</span>
          <span className="text-base font-extrabold text-amber-700 font-mono">{stats.awaitingDocuments || 0}</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl px-3.5 py-2 shadow-xs flex items-center justify-between">
          <span className="text-[11px] font-semibold text-red-600">Overdue</span>
          <span className="text-base font-extrabold text-red-700 font-mono">{shipments.overdue || 0}</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl px-3.5 py-2 shadow-xs flex items-center justify-between col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-emerald-600">Active Value</span>
          <span className="text-sm font-extrabold text-emerald-700 font-mono">
            ${Number(financials.totalValue || 0).toLocaleString("en-US", { minimumFractionDigits: 0 })}
          </span>
        </div>
      </div>

      {/* Filter Toolbar (Slim) */}
      <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-xs flex items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full max-w-xs">
          <Search className="h-3.5 w-3.5 text-gray-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search contract number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-hidden"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 font-medium text-gray-700 focus:ring-2 focus:ring-purple-400 focus:outline-hidden"
          >
            <option value="">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="In Progress">In Progress</option>
            <option value="Awaiting Documents">Awaiting Documents</option>
            <option value="Ready for Dispatch">Ready for Dispatch</option>
            <option value="Completed">Completed</option>
            <option value="Closed">Closed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
        {loadingList ? (
          <div className="p-8 text-center text-gray-400 animate-pulse">
            <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-purple-600" />
            <span className="text-xs font-semibold">Loading workspaces...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[9px]">
                  <th className="px-3.5 py-2.5">Contract Number</th>
                  <th className="px-3.5 py-2.5">Status</th>
                  <th className="px-3.5 py-2.5">Buyer</th>
                  <th className="px-3.5 py-2.5">Product</th>
                  <th className="px-3.5 py-2.5">Packing</th>
                  <th className="px-3.5 py-2.5 text-right">Qty</th>
                  <th className="px-3.5 py-2.5 text-right">Total Containers</th>
                  <th className="px-3.5 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {contracts.map((pc) => {
                  const pcNo = pc.contractNumber || `PC-${pc.salesContract?.contractNumber || pc.id}`;
                  const buyerName = pc.salesContract?.buyer?.entityName || pc.buyer?.entityName || "—";
                  const productNames = (pc.productNames && pc.productNames.length > 0)
                    ? pc.productNames.join(", ")
                    : (pc.salesContract?.items?.map((i) => i.product?.name).filter(Boolean).join(", ") || "—");
                  const packings = (pc.packings && pc.packings.length > 0)
                    ? pc.packings.join(", ")
                    : (pc.packing || "—");
                  const totalContainers = pc.totalContainers ?? 0;

                  return (
                    <tr
                      key={pc.id}
                      onClick={() => router.push(`/sales/purchase-contracts/${pc.id}`)}
                      className="hover:bg-purple-50/40 cursor-pointer transition-colors group"
                    >
                      <td className="px-3.5 py-2.5 font-mono font-bold text-purple-700 flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-purple-500" />
                        <span>{pcNo}</span>
                      </td>

                      <td className="px-3.5 py-2.5 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${STATUS_BADGE_CLASSES[pc.status] || "bg-gray-100 text-gray-700 border-gray-200"
                            }`}
                        >
                          {pc.status}
                        </span>
                      </td>

                      <td className="px-3.5 py-2.5 font-semibold text-gray-800 max-w-[140px] truncate">
                        {buyerName}
                      </td>

                      <td className="px-3.5 py-2.5 text-gray-700 max-w-[120px] truncate" title={productNames}>
                        {productNames}
                      </td>

                      <td className="px-3.5 py-2.5 text-gray-600 max-w-[100px] truncate" title={packings}>
                        {packings}
                      </td>

                      <td className="px-3.5 py-2.5 text-right font-mono font-semibold text-gray-700 whitespace-nowrap">
                        {pc.quantity ? pc.quantity : <span className="text-gray-400 font-normal">—</span>}
                      </td>

                      <td className="px-3.5 py-2.5 text-right font-mono font-bold text-gray-800">
                        {totalContainers > 0 ? totalContainers : <span className="text-gray-400 font-normal">—</span>}
                      </td>

                      <td className="px-3.5 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => router.push(`/sales/cargo-availability?purchaseContractId=${pc.id}`)}
                            className="px-2 py-1 text-[10px] font-bold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 rounded-lg transition-colors inline-flex items-center gap-1 border border-cyan-200/60"
                            title="Open Cargo Availability"
                          >
                            <Truck className="h-3 w-3" />
                            <span>Cargo</span>
                          </button>
                          <button
                            onClick={() => router.push(`/sales/purchase-contracts/${pc.id}?mode=view`)}
                            className="p-1.5 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors inline-flex items-center border border-purple-200/50"
                            title="View"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => router.push(`/sales/purchase-contracts/${pc.id}`)}
                            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors inline-flex items-center border border-gray-200/50"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {contracts.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-400">
                      <FileText className="h-6 w-6 mx-auto mb-1 text-gray-300 stroke-[1.2]" />
                      <p className="text-xs font-semibold text-gray-600">No purchase contracts found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer (Compact) */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-3.5 py-2 border-t border-gray-100 text-xs">
            <span className="text-gray-500 text-[11px]">
              Page <span className="font-bold text-gray-800">{page}</span> of{" "}
              <span className="font-bold text-gray-800">{totalPages}</span> ({total} total)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showClearDraftsModal}
        onClose={() => setShowClearDraftsModal(false)}
        onConfirm={() => {
          setShowClearDraftsModal(false);
          clearDrafts();
        }}
        title="Clear Drafts"
        message="Are you sure you want to clear all draft purchase contracts?"
        confirmText="Clear Drafts"
        confirmButtonClass="bg-red-500 hover:bg-red-600"
        iconBgClass="bg-red-50"
        iconColorClass="text-red-500"
      />
    </div>
  );
}