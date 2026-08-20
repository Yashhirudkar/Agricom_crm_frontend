"use client";
import React, { useState } from "react";
import {
  Ship,
  Eye,
  Plus,
  Trash2,
  Calendar,
  Layers,
  DollarSign,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import ShipmentDetailsDrawer from "@/modules/shipments/components/ShipmentDetailsDrawer";

const STATUS_COLORS = {
  Scheduled: "bg-slate-50 text-slate-700 border-slate-200",
  Dispatched: "bg-teal-50 text-teal-700 border-teal-200",
  "In Transit": "bg-amber-50 text-amber-700 border-amber-200",
  Sailed: "bg-sky-50 text-sky-700 border-sky-200",
  Arrived: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
};

export default function PurchaseShipmentTable({
  shipments = [],
  loading,
  onAddShipment,
  onRemoveShipment,
  allAvailableShipments = [],
}) {
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedShipmentIdToAdd, setSelectedShipmentIdToAdd] = useState("");

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center animate-pulse">
        <Ship className="h-8 w-8 text-purple-400 mx-auto mb-2 animate-bounce" />
        <span className="text-xs font-semibold text-gray-500">Loading operational shipments...</span>
      </div>
    );
  }

  const handleOpenDrawer = (shipment) => {
    setSelectedShipment(shipment);
  };

  const handleLinkShipmentSubmit = (e) => {
    e.preventDefault();
    if (!selectedShipmentIdToAdd) return;
    onAddShipment(Number(selectedShipmentIdToAdd));
    setShowAddModal(false);
    setSelectedShipmentIdToAdd("");
  };

  // Filter out shipments already linked
  const unlinkedShipments = allAvailableShipments.filter(
    (s) => !shipments.some((linked) => linked.shipmentId === s.id)
  );

  return (
    <div className="space-y-4">
      {/* Table Top Toolbar */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Ship className="h-4 w-4 text-purple-600" />
            Execution Shipments ({shipments.length})
          </h3>
          <p className="text-[11px] text-gray-500">
            Live joined metrics from Sales Contract Shipment records.
          </p>
        </div>

        {unlinkedShipments.length > 0 && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Link Existing Shipment
          </button>
        )}
      </div>

      {/* Shipments Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[9px]">
                <th className="px-4 py-3">Shipment Ref</th>
                <th className="px-4 py-3">Shipment Date</th>
                <th className="px-4 py-3 text-right">Qty (MT)</th>
                <th className="px-4 py-3 text-right">Containers</th>
                <th className="px-4 py-3 text-right">Purchase Rate</th>
                <th className="px-4 py-3 text-right">Freight</th>
                <th className="px-4 py-3 text-right">Forex</th>
                <th className="px-4 py-3">Timeline</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {shipments.map((s) => {
                const timeline = s.timeline || {};
                return (
                  <tr
                    key={s.linkId || s.shipmentId}
                    onClick={() => handleOpenDrawer(s)}
                    className="hover:bg-purple-50/40 cursor-pointer transition-colors group"
                  >
                    {/* Shipment Ref */}
                    <td className="px-4 py-3 font-mono font-bold text-gray-900">
                      <div className="flex items-center gap-1.5">
                        <Ship className="h-3.5 w-3.5 text-purple-500" />
                        <span>{s.shipmentReference || `Shipment #${s.shipmentNo}`}</span>
                      </div>
                    </td>

                    {/* Shipment Date */}
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {s.shipmentDate
                        ? new Date(s.shipmentDate).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>

                    {/* Qty */}
                    <td className="px-4 py-3 text-right font-mono font-bold text-gray-900">
                      {s.quantity ? Number(s.quantity).toLocaleString("en-US", { minimumFractionDigits: 2 }) : "0.00"}
                    </td>

                    {/* Containers */}
                    <td className="px-4 py-3 text-right font-mono text-gray-700">
                      {s.noOfContainers ?? 0}
                    </td>

                    {/* Purchase Rate */}
                    <td className="px-4 py-3 text-right font-mono font-medium text-gray-800">
                      {s.purchaseRate ? Number(s.purchaseRate).toLocaleString("en-US", { minimumFractionDigits: 2 }) : "—"}
                    </td>

                    {/* Freight */}
                    <td className="px-4 py-3 text-right font-mono text-gray-600">
                      {s.freight ? Number(s.freight).toLocaleString("en-US", { minimumFractionDigits: 2 }) : "—"}
                    </td>

                    {/* Forex */}
                    <td className="px-4 py-3 text-right font-mono text-gray-600">
                      {s.forex ? Number(s.forex).toLocaleString("en-US", { minimumFractionDigits: 2 }) : "—"}
                    </td>

                    {/* Timeline */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          timeline.type === "today"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : timeline.type === "tomorrow" || timeline.type === "upcoming"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : timeline.type === "overdue"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-gray-50 text-gray-500 border-gray-200"
                        }`}
                      >
                        {timeline.label || "—"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                          STATUS_COLORS[s.status] || "bg-gray-100 text-gray-700 border-gray-200"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenDrawer(s)}
                          className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        {onRemoveShipment && (
                          <button
                            onClick={() => onRemoveShipment(s.shipmentId)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Unlink Shipment"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {shipments.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-gray-400">
                    <Ship className="h-8 w-8 mx-auto mb-2 text-gray-300 stroke-[1.2]" />
                    <p className="text-xs font-semibold text-gray-600">No shipments linked to this execution contract</p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Shipments generated from the Sales Contract will be attached here.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REUSED COMPONENT: Existing Shipment Details Drawer */}
      {selectedShipment && (
        <ShipmentDetailsDrawer
          shipment={selectedShipment}
          onClose={() => setSelectedShipment(null)}
          onViewContract={() => {}}
        />
      )}

      {/* Add Shipment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Ship className="h-4 w-4 text-purple-600" />
              Link Existing Shipment
            </h3>
            <p className="text-xs text-gray-500">
              Select an unlinked shipment from the associated Sales Contract.
            </p>
            <form onSubmit={handleLinkShipmentSubmit} className="space-y-4">
              <select
                value={selectedShipmentIdToAdd}
                onChange={(e) => setSelectedShipmentIdToAdd(e.target.value)}
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium text-gray-800 focus:ring-2 focus:ring-purple-400 focus:outline-hidden"
                required
              >
                <option value="">-- Select Shipment --</option>
                {unlinkedShipments.map((s) => (
                  <option key={s.id} value={s.id}>
                    Shipment #{s.shipmentNo} ({s.shipmentReference || "Ref"}) - {s.quantity} MT
                  </option>
                ))}
              </select>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedShipmentIdToAdd}
                  className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors disabled:opacity-50"
                >
                  Link Shipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
