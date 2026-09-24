"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { purchaseContractApi } from "@/modules/purchase-contracts/services/purchaseContractApi";
import {
  X,
  Ship,
  Calendar,
  FileText,
  User,
  Package,
  Layers,
  FileCheck2,
  Clock,
  ExternalLink,
  Rocket,
  Boxes,
  ArrowUpRight,
  AlertCircle,
} from "lucide-react";

export default function ShipmentDetailsDrawer({ shipment, onClose, onViewContract, onOpenCargoDrawer }) {
  const router = useRouter();
  if (!shipment) return null;

  const contract = shipment.salesContract || {};
  const buyer = contract.buyer || {};
  const seller = contract.seller || {};
  const products = shipment.products || [];
  const timelineObj = shipment.timeline || {};
  const docProgress = shipment.documentProgress || { checklist: [] };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleExecuteWorkspace = async () => {
    try {
      const salesContractId = shipment.salesContractId || shipment.salesContract?.id;
      if (!salesContractId) return;
      const res = await purchaseContractApi.create({
        salesContractId: Number(salesContractId),
        shipmentIds: [Number(shipment.id)],
      });
      const pcId = res.data?.id;
      if (pcId) {
        router.push(`/sales/purchase-contracts/${pcId}?shipmentId=${shipment.id}`);
      }
    } catch (err) {
      console.error("Failed to open Purchase Contract workspace", err);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[150] bg-slate-900/30 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div
        className="fixed right-0 top-0 bottom-0 z-[160] bg-slate-50/50 shadow-2xl flex flex-col font-sans border-l border-slate-200 animate-in slide-in-from-right duration-300"
        style={{ width: "72vw", maxWidth: "1280px", minWidth: "540px" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Ship className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">Shipment Details</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono font-medium">
                  #{shipment.shipmentNo || "1"}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-tight">
                {shipment.shipmentReference || "DRAFT"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleExecuteWorkspace}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Rocket className="h-3.5 w-3.5" />
              <span>Execute Workspace</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Top Key Metrics Banner */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] grid grid-cols-2 md:grid-cols-3 gap-4 items-center">
            <div className="border-r border-slate-100 last:border-r-0 pr-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Target Quantity</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-extrabold text-slate-900">{shipment.quantity || 0}</span>
                <span className="text-xs font-bold text-slate-500">MT</span>
              </div>
            </div>

            <div className="border-r border-slate-100 last:border-r-0 pr-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Containers</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-extrabold text-slate-900">{shipment.noOfContainers ?? "0"}</span>
                <span className="text-xs font-medium text-slate-500">Units</span>
              </div>
            </div>

            <div className="border-r border-slate-100 last:border-r-0 pr-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Timeline & Status</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {shipment.status || "Scheduled"}
                </span>
                {timelineObj.label && (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${timelineObj.type === "overdue"
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}>
                    {timelineObj.label}
                  </span>
                )}
              </div>
            </div>

          </div>

          {/* Main 2-Column Structured Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

            {/* Left Column: Commercial & Logistics Scope (7 cols) */}
            <div className="lg:col-span-7 space-y-5">

              {/* Commercial & Contract Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-emerald-600" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Commercial & Financials</h3>
                  </div>
                  {contract.id && (
                    <button
                      onClick={() => onViewContract(contract.id)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <span>Contract: {contract.contractNumber || "—"}</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-2.5 bg-slate-50/70 border border-slate-100 rounded-lg">
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">Currency</span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5 block">{contract.currencyCode || "—"}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50/70 border border-slate-100 rounded-lg">
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">Rate / MT</span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                      {shipment.ratePerMt ? `${Number(shipment.ratePerMt).toFixed(2)} ${contract.currencyCode}` : "—"}
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50/70 border border-slate-100 rounded-lg">
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">Purchase Rate</span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                      {shipment.purchaseRate ? `${Number(shipment.purchaseRate).toFixed(2)} ${contract.currencyCode}` : "—"}
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50/70 border border-slate-100 rounded-lg">
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">Freight Charge</span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                      {shipment.freight ? `${Number(shipment.freight).toFixed(2)}` : "—"}
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50/70 border border-slate-100 rounded-lg">
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">Forex Conversion</span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                      {shipment.forex ? `${Number(shipment.forex).toFixed(2)}` : "—"}
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50/70 border border-slate-100 rounded-lg">
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">Shipment Date</span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5 block">{formatDate(shipment.shipmentDate)}</span>
                  </div>
                </div>
              </div>

              {/* Parties Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
                  <User className="h-4 w-4 text-amber-500" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Counterparties</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Buyer / Client</span>
                    <p className="text-xs font-bold text-slate-800 mt-1">{buyer.entityName || "—"}</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Seller / Entity</span>
                    <p className="text-xs font-bold text-slate-800 mt-1">{seller.entityName || "—"}</p>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                <div className="flex items-center gap-2 pb-3 mb-2 border-b border-slate-100">
                  <Package className="h-4 w-4 text-indigo-500" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Registered Products</h3>
                </div>

                <div className="divide-y divide-slate-100">
                  {products.map((p, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{p.name || "—"}</span>
                      <span className="text-slate-400 text-[11px] font-mono">Item #{idx + 1}</span>
                    </div>
                  ))}
                  {products.length === 0 && (
                    <div className="py-4 text-center text-xs text-slate-400 italic">No products registered for this shipment.</div>
                  )}
                </div>
              </div>

            </div>

            {/* Right Column: Execution, Docs & Audit (5 cols) */}
            <div className="lg:col-span-5 space-y-5">

              {/* Document Progress */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="h-4 w-4 text-teal-600" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Documents Status</h3>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {docProgress.checklist.filter(d => d.uploaded).length}/{docProgress.checklist.length || 0} Ready
                  </span>
                </div>

                <div className="space-y-2">
                  {docProgress.checklist.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50/70 border border-slate-100 text-xs"
                    >
                      <span className="font-medium text-slate-700 truncate pr-2">{doc.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border flex-shrink-0 ${doc.uploaded
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : doc.isMandatory
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}
                      >
                        {doc.uploaded ? "Uploaded" : doc.isMandatory ? "Required" : "Optional"}
                      </span>
                    </div>
                  ))}
                  {docProgress.checklist.length === 0 && (
                    <div className="py-3 text-center text-xs text-slate-400 italic">No document checklist registered.</div>
                  )}
                </div>
              </div>

              {/* Remarks Box */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-2 mb-2 border-b border-slate-100">
                  Remarks / Notes
                </h3>
                <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-100 min-h-[60px] whitespace-pre-wrap">
                  {shipment.remarks || "No remarks entered."}
                </div>
              </div>

              {/* Audit Meta */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] text-xs text-slate-500">
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-600 text-[10px] pb-2 border-b border-slate-100">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  Audit Trail
                </div>
                <div className="mt-2.5 space-y-1.5">
                  <div className="flex justify-between">
                    <span>Created</span>
                    <span className="font-medium text-slate-700">{formatDate(shipment.createdAt || shipment.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated</span>
                    <span className="font-medium text-slate-700">{formatDate(shipment.updatedAt || shipment.updated_at)}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Sticky Footer */}
        <div className="flex-shrink-0 px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}