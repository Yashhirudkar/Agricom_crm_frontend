"use client";
import React from "react";
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
  ExternalLink
} from "lucide-react";

export default function ShipmentDetailsDrawer({ shipment, onClose, onViewContract }) {
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
      year: "numeric"
    });
  };

  const cardCls = "bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col gap-2.5";
  const itemCls = "flex items-center justify-between text-xs py-1 border-b border-dashed border-slate-200/60 last:border-b-0";
  const lblCls = "font-bold text-gray-500";
  const valCls = "font-bold text-gray-800 text-right";

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[150] bg-black/30 backdrop-blur-xs animate-in fade-in duration-200" onClick={onClose} />

      {/* Slide-over Panel */}
      <div className="fixed right-0 top-0 bottom-0 z-[160] w-full max-w-lg bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/60 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <Ship className="h-4.5 w-4.5 text-[#007aff]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Shipment Details</h2>
              <p className="text-[10px] text-gray-400 font-mono mt-0.5">{shipment.shipmentReference || "DRAFT"}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* Section 1: Shipment Info */}
          <div className={cardCls}>
            <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Ship className="h-3.5 w-3.5 text-blue-500" />
              Shipment Information
            </h3>
            <div className={itemCls}>
              <span className={lblCls}>Reference</span>
              <span className="font-mono font-bold text-gray-800 text-xs">{shipment.shipmentReference || "—"}</span>
            </div>
            <div className={itemCls}>
              <span className={lblCls}>Shipment Number</span>
              <span className={valCls}>Shipment #{shipment.shipmentNo || "—"}</span>
            </div>
            <div className={itemCls}>
              <span className={lblCls}>Shipment Date</span>
              <span className={valCls}>{formatDate(shipment.shipmentDate)}</span>
            </div>
          </div>

          {/* Section 2: Timeline state */}
          <div className={cardCls}>
            <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Calendar className="h-3.5 w-3.5 text-indigo-500" />
              Timeline & Dispatch
            </h3>
            <div className={itemCls}>
              <span className={lblCls}>Urgency / Timeline</span>
              <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${timelineObj.type === "today" ? "bg-green-50 text-green-700 border-green-200" :
                timelineObj.type === "tomorrow" || timelineObj.type === "upcoming" ? "bg-blue-50 text-blue-700 border-blue-200" :
                  timelineObj.type === "overdue" ? "bg-red-50 text-red-700 border-red-200" :
                    "bg-gray-100 text-gray-700 border-gray-200"
                }`}>
                {timelineObj.label || "—"}
              </span>
            </div>
            <div className={itemCls}>
              <span className={lblCls}>Workflow Status</span>
              <span className="px-2 py-0.5 rounded-md border text-[10px] font-bold bg-slate-100 border-slate-200 text-slate-700">
                {shipment.status || "—"}
              </span>
            </div>
          </div>

          {/* Section 3: Commercial Info */}
          <div className={cardCls}>
            <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <FileText className="h-3.5 w-3.5 text-emerald-500" />
              Commercial Details
            </h3>
            <div className={itemCls}>
              <span className={lblCls}>Contract No</span>
              <button
                onClick={() => onViewContract(contract.id)}
                className="text-[#007aff] font-bold flex items-center gap-1.5 font-sans"
              >
                <span>{contract.contractNumber || "—"}</span>
              </button>
            </div>
            <div className={itemCls}>
              <span className={lblCls}>Currency</span>
              <span className={valCls}>{contract.currencyCode || "—"}</span>
            </div>
            <div className={itemCls}>
              <span className={lblCls}>Rate / MT</span>
              <span className={valCls}>
                {shipment.ratePerMt ? `${Number(shipment.ratePerMt).toFixed(2)} ${contract.currencyCode}` : "—"}
              </span>
            </div>
            <div className={itemCls}>
              <span className={lblCls}>Purchase Rate</span>
              <span className={valCls}>
                {shipment.purchaseRate ? `${Number(shipment.purchaseRate).toFixed(2)} ${contract.currencyCode}` : "—"}
              </span>
            </div>
            <div className={itemCls}>
              <span className={lblCls}>Freight Charge</span>
              <span className={valCls}>
                {shipment.freight ? `${Number(shipment.freight).toFixed(2)}` : "—"}
              </span>
            </div>
            <div className={itemCls}>
              <span className={lblCls}>Forex Conversion</span>
              <span className={valCls}>
                {shipment.forex ? `${Number(shipment.forex).toFixed(2)}` : "—"}
              </span>
            </div>
          </div>

          {/* Section 4: Buyer / Seller Parties */}
          <div className={cardCls}>
            <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <User className="h-3.5 w-3.5 text-amber-500" />
              Parties
            </h3>
            <div className={itemCls}>
              <span className={lblCls}>Buyer / Client</span>
              <span className={valCls}>{buyer.entityName || "—"}</span>
            </div>
            <div className={itemCls}>
              <span className={lblCls}>Seller / Entity</span>
              <span className={valCls}>{seller.entityName || "—"}</span>
            </div>
          </div>

          {/* Section 5: Product Details */}
          <div className={cardCls}>
            <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Package className="h-3.5 w-3.5 text-orange-500" />
              Product Details
            </h3>
            {products.map((p, idx) => (
              <div key={idx} className={itemCls}>
                <span className={lblCls}>Product Name</span>
                <span className={valCls}>{p.name || "—"}</span>
              </div>
            ))}
            {products.length === 0 && (
              <div className="text-xs text-gray-400 italic">No products registered.</div>
            )}
          </div>

          {/* Section 6: Container Specs */}
          <div className={cardCls}>
            <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Layers className="h-3.5 w-3.5 text-teal-500" />
              Containers & Load
            </h3>
            <div className={itemCls}>
              <span className={lblCls}>Quantity (MT)</span>
              <span className={valCls}>{shipment.quantity ? `${shipment.quantity} MT` : "—"}</span>
            </div>
            <div className={itemCls}>
              <span className={lblCls}>No. of Containers</span>
              <span className={valCls}>{shipment.noOfContainers ?? "0"}</span>
            </div>
          </div>

          {/* Section 7: Documents checklist */}
          <div className={cardCls}>
            <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <FileCheck2 className="h-3.5 w-3.5 text-emerald-500" />
              Documents Status
            </h3>
            <div className="space-y-1.5 pt-2">
              {docProgress.checklist.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-600 font-medium">{doc.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${doc.uploaded
                    ? "bg-green-50 text-green-700 border-green-200"
                    : doc.isMandatory
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-gray-50 text-gray-500 border-gray-200"
                    }`}>
                    {doc.uploaded ? "Uploaded" : doc.isMandatory ? "Required" : "Optional"}
                  </span>
                </div>
              ))}
              {docProgress.checklist.length === 0 && (
                <div className="text-xs text-gray-400 italic">No document checklist registered.</div>
              )}
            </div>
          </div>

          {/* Section 8: Remarks */}
          <div className={cardCls}>
            <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <FileText className="h-3.5 w-3.5 text-slate-500" />
              Remarks
            </h3>
            <p className="text-xs text-gray-700 font-medium bg-white p-3 rounded-lg border border-slate-200/50 whitespace-pre-wrap">
              {shipment.remarks || "No remarks entered."}
            </p>
          </div>

          {/* Section 9: Activity/Audit */}
          <div className={cardCls}>
            <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Clock className="h-3.5 w-3.5 text-gray-500" />
              Audit Trail
            </h3>
            <div className={itemCls}>
              <span className={lblCls}>Created On</span>
              <span className={valCls}>{formatDate(shipment.createdAt || shipment.created_at)}</span>
            </div>
            <div className={itemCls}>
              <span className={lblCls}>Last Updated On</span>
              <span className={valCls}>{formatDate(shipment.updatedAt || shipment.updated_at)}</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-5 py-3 border-t border-gray-100 bg-gray-50/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </>
  );
}
