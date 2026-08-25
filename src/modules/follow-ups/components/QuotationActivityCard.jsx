"use client";

import React from "react";
import { FileText, ArrowRight } from "lucide-react";

export default function QuotationActivityCard({ quotation, onClick }) {
  if (!quotation) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-400 italic">
        📄 Quotation activity unavailable
      </div>
    );
  }

  const quotationNumber = quotation.quotationNumber || "AQ-000000-000000";
  const itemsList = quotation.items || quotation.QuotationItems || quotation.quotationItems || quotation.item || [];
  const item = (Array.isArray(itemsList) ? itemsList[0] : itemsList) || {};
  const productName = item.product?.name || item.productName || item.subTypeSpec || quotation.productName || "Agri Commodity Product";
  const rawPrice = item.offeredPrice ?? quotation.offeredPrice ?? quotation.price;
  const parsedPrice = parseFloat(rawPrice);
  const price = isNaN(parsedPrice) ? "—" : parsedPrice.toLocaleString("en-IN");
  const currency = quotation.currencyCode || "USD";

  return (
    <div
      onClick={() => onClick && onClick(quotation)}
      className="group w-full max-w-sm bg-gradient-to-r from-violet-50/90 to-indigo-50/70 hover:from-violet-100/90 hover:to-indigo-100/80 border border-violet-200/80 hover:border-violet-300 rounded-xl p-2.5 transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer flex flex-col gap-1 select-none"
    >
      {/* Header Pill */}
      <div className="flex items-center justify-between border-b border-violet-100/80 pb-1">
        <div className="flex items-center gap-1.5 text-violet-700 font-extrabold text-[11px]">
          <FileText className="w-3.5 h-3.5 text-violet-600 shrink-0" />
          <span>Quotation Generated</span>
        </div>
        <span className="text-[9px] font-bold text-violet-500 bg-violet-100/60 px-1.5 py-0.2 rounded group-hover:bg-violet-200/80 transition-colors">
          {quotation.status || "Generated"}
        </span>
      </div>

      {/* Ultra-compact fields (No Labels) */}
      <div className="flex flex-col gap-0.5 pt-0.5">
        <span className="text-[12px] font-black text-slate-800 tracking-tight">
          {quotationNumber}
        </span>
        <span className="text-[11px] font-bold text-slate-700 truncate" title={productName}>
          {productName}
        </span>
        <span className="text-[11px] font-extrabold text-emerald-700">
          {price} {currency} / MT
        </span>
      </div>
    </div>
  );
}
