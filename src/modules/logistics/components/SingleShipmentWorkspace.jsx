"use client";
import React from "react";
import {
  Package,
  Calendar,
  CheckCircle,
  Clock,
  Plus,
  FileCheck,
  Star,
  FileText,
  Edit2,
  Trash2,
  AlertTriangle,
  Loader2,
  Truck,
} from "lucide-react";

export default function SingleShipmentWorkspace({
  shipment,
  details,
  isReadOnly = false,
  onAddQuote,
  onEditQuote,
  onDeleteQuote,
  onSetPreferred,
  onExecuteShipment,
  executingShipmentId,
  expiringSoonIds = [],
  getPartnerInitials,
}) {
  if (!shipment) return null;

  const sQuotes = shipment.quotes || [];
  const prefQuote = shipment.preferredQuote || sQuotes.find((q) => q.isPreferred);

  return (
    <div className="space-y-5">
      {/* ========================================================================= */}
      {/* 1. SELECTED SHIPMENT COMMAND CARD                                         */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 via-blue-50/30 to-indigo-50/20 border-b border-slate-200/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-sm shadow-blue-500/20 shrink-0">
              <Package className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Shipment Ref:
                </span>
                <span className="px-3 py-1 rounded-lg text-sm font-black font-mono tracking-wider bg-blue-600 text-white shadow-2xs">
                  {shipment.shipmentReference || `REF-${String(shipment.id).padStart(5, "0")}`}
                </span>
                {shipment.status && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {shipment.status}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600 font-medium mt-1 flex-wrap">
                <span className="font-bold text-slate-900">
                  {shipment.quantity ? `${Number(shipment.quantity).toLocaleString()} MT` : "— MT"}
                </span>
                {shipment.noOfContainers > 0 && (
                  <>
                    <span>•</span>
                    <span>
                      {shipment.noOfContainers}{" "}
                      {shipment.noOfContainers === 1 ? "Container" : "Containers"}
                    </span>
                  </>
                )}
                {shipment.shipmentDate && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      Loading:{" "}
                      {new Date(shipment.shipmentDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Gate Badges & Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap justify-end shrink-0">
            {/* Cargo Gate */}
            <span
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 select-none ${
                shipment.cargoReady
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              {shipment.cargoReady ? (
                <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Clock className="h-3.5 w-3.5 text-amber-600" />
              )}
              <span>Cargo: {shipment.cargoReady ? "Ready" : "Pending"}</span>
            </span>

            {/* Freight Gate */}
            <span
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 select-none ${
                shipment.freightReady || Boolean(prefQuote)
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-rose-50 text-rose-700 border-rose-200"
              }`}
            >
              {shipment.freightReady || Boolean(prefQuote) ? (
                <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Clock className="h-3.5 w-3.5 text-rose-500" />
              )}
              <span>
                Freight: {shipment.freightReady || Boolean(prefQuote) ? "Allocated" : "Pending"}
              </span>
            </span>

            {!isReadOnly && (
              <>
                {/* Add Freight Quote Button */}
                <button
                  type="button"
                  onClick={() => onAddQuote(shipment)}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl flex items-center gap-1.5 text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Freight Quote
                </button>

                {/* Execute Shipment Button */}
                {shipment.status === "Executed" ? (
                  <span className="px-3.5 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold flex items-center gap-1.5 text-xs select-none">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Executed
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={!shipment.readyForShipment || executingShipmentId === shipment.id}
                    onClick={() => onExecuteShipment(shipment.id, shipment.shipmentReference)}
                    title={
                      shipment.readyForShipment
                        ? "Click to execute this shipment independently"
                        : shipment.readinessReason ||
                          "Both Cargo and Freight allocations are required before execution"
                    }
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl flex items-center gap-1.5 text-xs shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all active:scale-95"
                  >
                    {executingShipmentId === shipment.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <FileCheck className="h-3.5 w-3.5" />
                    )}
                    Execute Shipment
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. FREIGHT QUOTES SECTION (BELOW SELECTED SHIPMENT)                      */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Preferred Carrier Ribbon (if selected) */}
          {prefQuote && (
            <div className="bg-gradient-to-r from-purple-50 via-indigo-50/60 to-purple-50/40 border border-purple-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                  <Star className="h-4 w-4 fill-white" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-purple-950 flex items-center gap-2">
                    <span>Preferred Carrier:</span>
                    <span className="font-black text-purple-700 bg-white px-2 py-0.5 rounded border border-purple-200">
                      {prefQuote.seller?.entityName || prefQuote.carrier || "Transport Partner"}
                    </span>
                  </div>
                  <div className="text-[11px] text-purple-700 font-medium flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {prefQuote.transitDays} Transit Days
                    </span>
                    <span>•</span>
                    <span>Quote #{prefQuote.quoteNumber || "Q-1"}</span>
                    {prefQuote.validityDate && (
                      <>
                        <span>•</span>
                        <span>
                          Valid till{" "}
                          {new Date(prefQuote.validityDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
                    Locked Freight Rate
                  </div>
                  <div className="text-sm font-black text-purple-950 font-mono">
                    {prefQuote.currency || "INR"}{" "}
                    {Number(prefQuote.freightAmount || 0).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase bg-purple-600 text-white shadow-2xs">
                  Locked
                </span>
              </div>
            </div>
          )}

          {/* Freight Quotes Header & Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-blue-600" />
                  <span>Freight Quotes ({sQuotes.length})</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Competitive transport quotes evaluated for shipment {shipment.shipmentReference}
                </p>
              </div>
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() => onAddQuote(shipment)}
                  className="px-3 py-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Quote
                </button>
              )}
            </div>

            {sQuotes.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700 border-collapse">
                    <thead className="bg-slate-50/90 border-b border-slate-200 text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-3 py-2.5">Transport Partner</th>
                        <th className="px-3 py-2.5">Contact Person</th>
                        <th className="px-3 py-2.5 text-center">Transit</th>
                        <th className="px-3 py-2.5">Validity</th>
                        <th className="px-3 py-2.5 text-right">Freight Rate</th>
                        <th className="px-3 py-2.5 text-center">Preferred Status</th>
                        <th className="px-3 py-2.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {sQuotes.map((q) => {
                        const isPreferred = q.isPreferred || (prefQuote && prefQuote.id === q.id);
                        const isExpiring = expiringSoonIds.includes(q.id);
                        const initials = getPartnerInitials ? getPartnerInitials(q.seller?.entityName) : "TP";

                        return (
                          <tr
                            key={q.id}
                            className={`transition-colors hover:bg-slate-50/80 ${
                              isPreferred ? "bg-purple-50/40 font-semibold" : ""
                            }`}
                          >
                            {/* Transport Partner */}
                            <td className="px-3 py-2">
                              <div className="flex items-center gap-3">
                                <div className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-extrabold text-[10px] flex items-center justify-center shrink-0 shadow-xs">
                                  {initials}
                                </div>
                                <div>
                                  <div className="font-extrabold text-slate-900 flex items-center gap-1.5 text-xs">
                                    <span>{q.seller?.entityName || "Logistics Seller"}</span>
                                    {isPreferred && (
                                      <span className="px-1.5 py-0.2 rounded bg-purple-600 text-white text-[9px] font-extrabold flex items-center gap-0.5">
                                        <Star className="h-2 w-2 fill-white" /> Preferred
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[9px] text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
                                    <span className="font-mono text-slate-700">{q.quoteNumber}</span>
                                    <span>•</span>
                                    <span>v{q.version}</span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Contact Person */}
                            <td className="px-3 py-2">
                              <div>
                                <div className="font-bold text-slate-800 text-[11px]">
                                  {q.contactPerson || "N/A"}
                                </div>
                                <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                                  {q.contactNumber ? `📞 ${q.contactNumber}` : "N/A"}
                                </div>
                              </div>
                            </td>

                            {/* Transit */}
                            <td className="px-3 py-2 text-center">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800 font-extrabold text-[10px]">
                                <Clock className="h-3 w-3 text-blue-600" /> {q.transitDays} Days
                              </span>
                            </td>

                            {/* Validity */}
                            <td className="px-3 py-2">
                              <div className="font-bold text-slate-800 text-[11px]">
                                {q.validityDate
                                  ? new Date(q.validityDate).toLocaleDateString("en-IN", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })
                                  : "N/A"}
                              </div>
                              {isExpiring && (
                                <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded mt-0.5">
                                  <AlertTriangle className="h-2.5 w-2.5 text-amber-600" /> Expiring Soon
                                </span>
                              )}
                            </td>

                            {/* Freight Rate */}
                            <td className="px-3 py-2 text-right">
                              <div className="font-mono font-black text-slate-900 text-xs">
                                {q.currency || "INR"}{" "}
                                {Number(q.freightAmount || 0).toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                })}
                              </div>
                              {(Number(q.fuelCharges) > 0 || Number(q.additionalCharges) > 0) && (
                                <div className="text-[9px] text-slate-400 mt-0.5 font-mono">
                                  +Fuel: {q.fuelCharges || 0} | +Add: {q.additionalCharges || 0}
                                </div>
                              )}
                            </td>

                            {/* Preferred Status */}
                            <td className="px-3 py-2 text-center">
                              <button
                                type="button"
                                onClick={() => !isReadOnly && onSetPreferred(q.id)}
                                disabled={isReadOnly}
                                className={`px-2.5 py-1 rounded-lg font-extrabold text-[10px] transition-all inline-flex items-center gap-1.5 ${
                                  isPreferred
                                    ? "bg-purple-600 text-white shadow-xs"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200"
                                }`}
                              >
                                <Star className={`h-3 w-3 ${isPreferred ? "fill-white" : ""}`} />
                                <span>{isPreferred ? "Preferred" : "Select"}</span>
                              </button>
                            </td>

                            {/* Actions */}
                            <td className="px-3 py-2 text-right">
                              {!isReadOnly ? (
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    type="button"
                                    onClick={() => onEditQuote(q, shipment)}
                                    className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                    title="Revise Quote"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => onDeleteQuote(q.id)}
                                    className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                    title="Delete Quote"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[10px] text-slate-400 font-mono">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center bg-slate-50/70 rounded-xl border border-dashed border-slate-200">
                <Truck className="h-8 w-8 text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-600">No freight quotes added yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Request quotations from transporters or enter rates directly for this shipment.
                </p>
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() => onAddQuote(shipment)}
                    className="mt-3 px-3 py-1.5 text-xs font-bold text-blue-600 bg-white hover:bg-blue-50 rounded-lg border border-blue-200 shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add First Freight Quote
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

