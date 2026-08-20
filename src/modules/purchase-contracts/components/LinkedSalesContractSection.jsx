"use client";
import React from "react";
import { Link as LinkIcon, Building2, MapPin, Package, CreditCard, Ship } from "lucide-react";

export default function LinkedSalesContractSection({ contract, summary }) {
  const salesContract = contract?.salesContract || {};
  const buyer = summary?.commercialInfo?.buyer || salesContract.buyer || {};
  const origin = salesContract.originCountry || "—";
  const dest = salesContract.destinationCountry || "—";
  const portLoading = salesContract.portOfLoading || "—";
  const portDischarge = salesContract.portOfDischarge || "—";
  const shipmentType = salesContract.shipmentType?.name || "—";
  const paymentTerm = salesContract.paymentTerm?.name || "—";
  const products = summary?.productSummary || salesContract.items || [];

  const inp = "w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 text-gray-700 font-medium";
  const lbl = "block text-[11px] font-semibold text-gray-600 mb-1.5";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      {/* Section Header */}
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
            <LinkIcon className="h-3.5 w-3.5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Linked Sales Contract Reference</h2>
            <p className="text-[10px] text-gray-400">Readonly commercial baseline from original Sales Contract</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 border border-purple-100 px-2.5 py-1 rounded-lg">
          SC-{salesContract.contractNumber || "—"}
        </span>
      </div>

      <div className="p-5 space-y-5">
        {/* Row 1: Contract Number, Buyer, Commodity */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={lbl}>Sales Contract No.</label>
            <input type="text" value={`SC-${salesContract.contractNumber || "—"}`} readOnly className={`${inp} font-mono font-bold text-[#007aff]`} />
          </div>
          <div>
            <label className={lbl}>Buyer (Client)</label>
            <input type="text" value={buyer.entityName || buyer.name || "—"} readOnly className={`${inp} font-semibold`} />
          </div>
          <div>
            <label className={lbl}>Commodity Products</label>
            <input type="text" value={products.map(p => p.product?.name || p.productName || "Product").join(", ") || "—"} readOnly className={`${inp} font-semibold`} />
          </div>
        </div>

        {/* Row 2: Route & Ports */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div>
            <label className={lbl}>Origin → Destination</label>
            <input type="text" value={`${origin} ➔ ${dest}`} readOnly className={`${inp} bg-white font-semibold text-emerald-800`} />
          </div>
          <div>
            <label className={lbl}>Port of Loading → Discharge</label>
            <input type="text" value={`${portLoading} ➔ ${portDischarge}`} readOnly className={`${inp} bg-white`} />
          </div>
          <div>
            <label className={lbl}>Shipment Type</label>
            <input type="text" value={shipmentType} readOnly className={`${inp} bg-white`} />
          </div>
        </div>

        {/* Row 3: Product Table */}
        {products.length > 0 && (
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[9px] border-b border-gray-100">
                  <th className="px-4 py-2.5">Product Name</th>
                  <th className="px-4 py-2.5 text-right">Quantity (MT)</th>
                  <th className="px-4 py-2.5 text-right">Sales Unit Price</th>
                  <th className="px-4 py-2.5 text-right">Sales Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-2.5 font-semibold text-gray-800">
                      {item.product?.name || item.productName || "Commodity"}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono font-bold text-gray-800">
                      {Number(item.quantity || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })} MT
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-gray-600">
                      {salesContract.currencyCode} {Number(item.unitPrice || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono font-bold text-purple-700">
                      {salesContract.currencyCode} {Number(item.amount || (item.quantity * item.unitPrice) || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
