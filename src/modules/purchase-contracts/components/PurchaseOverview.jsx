"use client";
import React from "react";
import {
  Building2,
  Briefcase,
  CreditCard,
  Ship,
  MapPin,
  Package,
  DollarSign,
} from "lucide-react";

export default function PurchaseOverview({ contract, summary }) {
  const salesContract = contract?.salesContract || {};
  const buyer = summary?.commercialInfo?.buyer || salesContract.buyer || {};
  const seller = summary?.commercialInfo?.seller || salesContract.seller || {};
  const broker = summary?.commercialInfo?.broker || salesContract.broker || {};
  const paymentTerm = summary?.commercialInfo?.paymentTerm?.name || salesContract.paymentTerm?.name || "—";
  const shipmentType = salesContract.shipmentType?.name || "—";
  const currencyCode = salesContract.currencyCode || "USD";
  const origin = salesContract.originCountry || "—";
  const destination = salesContract.destinationCountry || "—";
  const portLoading = salesContract.portOfLoading || "—";
  const portDischarge = salesContract.portOfDischarge || "—";

  const products = summary?.productSummary || salesContract.items || [];

  return (
    <div className="space-y-6">
      {/* Grid 1: Commercial Parties & Logistics Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Commercial Parties */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-3">
            <Building2 className="h-4 w-4 text-purple-600" />
            Commercial Parties
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-start justify-between py-1.5 border-b border-dashed border-gray-100">
              <span className="font-semibold text-gray-500">Buyer (Client)</span>
              <span className="font-bold text-gray-800 text-right">{buyer.entityName || buyer.name || "—"}</span>
            </div>
            <div className="flex items-start justify-between py-1.5 border-b border-dashed border-gray-100">
              <span className="font-semibold text-gray-500">Seller (Entity)</span>
              <span className="font-bold text-gray-800 text-right">{seller.entityName || seller.name || "—"}</span>
            </div>
            <div className="flex items-start justify-between py-1.5 border-b border-dashed border-gray-100">
              <span className="font-semibold text-gray-500">Broker / Agent</span>
              <span className="font-bold text-gray-800 text-right">{broker.entityName || broker.name || "None (Direct)"}</span>
            </div>

          </div>
        </div>

        {/* Commercial Terms & Logistics */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-3">
            <CreditCard className="h-4 w-4 text-blue-600" />
            Terms & Logistics Setup
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-start justify-between py-1.5 border-b border-dashed border-gray-100">
              <span className="font-semibold text-gray-500">Payment Terms</span>
              <span className="font-bold text-gray-800 text-right">{paymentTerm}</span>
            </div>
            <div className="flex items-start justify-between py-1.5 border-b border-dashed border-gray-100">
              <span className="font-semibold text-gray-500">Currency</span>
              <span className="font-bold text-gray-800 font-mono">{currencyCode}</span>
            </div>
            <div className="flex items-start justify-between py-1.5 border-b border-dashed border-gray-100">
              <span className="font-semibold text-gray-500">Shipment Type</span>
              <span className="font-bold text-gray-800 text-right">{shipmentType}</span>
            </div>
            <div className="flex items-start justify-between py-1.5 border-b border-dashed border-gray-100">
              <span className="font-semibold text-gray-500">Origin → Destination</span>
              <span className="font-bold text-gray-800 text-right flex items-center gap-1">
                <MapPin className="h-3 w-3 text-red-500" />
                {origin} → {destination}
              </span>
            </div>
            <div className="flex items-start justify-between py-1.5">
              <span className="font-semibold text-gray-500">Ports (Loading → Discharge)</span>
              <span className="font-bold text-gray-800 text-right">
                {portLoading} → {portDischarge}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Grid 2: Registered Product Breakdown */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Package className="h-4 w-4 text-emerald-600" />
            Contracted Commodity Products
          </h3>
          <span className="text-[10px] text-gray-400 font-semibold uppercase">Readonly Contract Reference</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[9px] border-b border-gray-100">
                <th className="px-4 py-2.5">Product Name</th>
                <th className="px-4 py-2.5 text-right">Quantity (MT)</th>
                <th className="px-4 py-2.5 text-right">Unit Price</th>
                <th className="px-4 py-2.5 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((item, i) => {
                const prodName = item.product?.name || item.productName || item.description || "Commodity Item";
                const qty = Number(item.quantity || 0);
                const price = Number(item.unitPrice || 0);
                const amt = Number(item.amount || qty * price);
                return (
                  <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-800 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      {prodName}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-gray-800">
                      {qty.toLocaleString("en-US", { minimumFractionDigits: 2 })} MT
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-gray-600">
                      {currencyCode} {price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-emerald-700">
                      {currencyCode} {amt.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-400 italic">
                    No products associated with this contract.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
