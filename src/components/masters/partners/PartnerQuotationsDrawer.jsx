"use client";

import React, { useState, useEffect } from "react";
import Drawer from "@/components/common/Drawer";
import { FileText, ExternalLink, RefreshCw, Calendar, Globe, DollarSign } from "lucide-react";
import axiosClient from "@/lib/axios";
import QuotationPreviewDrawer from "@/modules/follow-ups/components/QuotationPreviewDrawer";

export default function PartnerQuotationsDrawer({ isOpen, onClose, partner }) {
  const [quotations, setQuotations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (isOpen && partner?.id) {
      fetchQuotations();
    } else {
      setQuotations([]);
    }
  }, [isOpen, partner]);

  const fetchQuotations = async () => {
    setIsLoading(true);
    try {
      const res = await axiosClient.get("/quotations", {
        params: {
          buyerId: partner.id,
          limit: 100,
        },
      });
      // Filter out Draft and soft-deleted quotations
      const list = (res.data?.data || res.data || []).filter(
        (q) => q.status !== "Draft" && !q.deletedAt
      );
      setQuotations(list);
    } catch (err) {
      console.error("Failed to load partner quotations", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenPreview = (q) => {
    setSelectedQuotation(q);
    setIsPreviewOpen(true);
  };

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        title={partner ? `Quotations — ${partner.entityName}` : "Partner Quotations"}
        widthClass="w-full sm:w-[600px] md:w-[700px]"
      >
        <div className="flex flex-col h-full bg-slate-50 overflow-hidden font-sans">
          
          {/* Header Summary Pill */}
          <div className="shrink-0 bg-white border-b border-slate-200 px-5 py-3 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Generated Quotes</span>
              <span className="bg-violet-100 text-violet-700 border border-violet-200 text-xs font-extrabold px-2 py-0.5 rounded-full">
                {quotations.length}
              </span>
            </div>
            <button
              onClick={fetchQuotations}
              disabled={isLoading}
              className="p-1.5 border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors disabled:opacity-50"
              title="Refresh Quotations List"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-2">
                <div className="h-6 w-6 rounded-full border-2 border-violet-600 border-t-transparent animate-spin" />
                <p className="text-xs font-semibold text-slate-500">Loading quotations...</p>
              </div>
            ) : quotations.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-slate-200 rounded-2xl bg-white p-6">
                <FileText className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700">No Generated Quotations</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-[260px] mx-auto">
                  No active generated quotations found for this partner.
                </p>
              </div>
            ) : (
              quotations.map((q) => {
                const itemsList = q.items || q.QuotationItems || q.quotationItems || q.item || [];
                const item = (Array.isArray(itemsList) ? itemsList[0] : itemsList) || {};
                const productName = item.product?.name || item.productName || item.subTypeSpec || q.productName || "Agri Product";
                const rawPrice = item.offeredPrice ?? q.offeredPrice ?? q.price;
                const parsedPrice = parseFloat(rawPrice);
                const price = isNaN(parsedPrice) ? "—" : parsedPrice.toLocaleString("en-IN");

                return (
                  <div
                    key={q.id}
                    onClick={() => handleOpenPreview(q)}
                    className="bg-white border border-slate-200/80 hover:border-violet-300 p-4 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col gap-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-violet-600 shrink-0" />
                        <span className="text-sm font-extrabold text-slate-900 group-hover:text-violet-600 transition-colors">
                          {q.quotationNumber}
                        </span>
                      </div>
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {q.status}
                      </span>
                    </div>

                    {/* Product & Price */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-50/60 p-2.5 rounded-xl border border-slate-100 text-xs">
                      <div>
                        <span className="text-[9.5px] font-bold uppercase text-slate-400 block">Product</span>
                        <span className="font-bold text-slate-800 truncate block" title={productName}>
                          {productName}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9.5px] font-bold uppercase text-slate-400 block">Offered Price</span>
                        <span className="font-extrabold text-emerald-700 block">
                          {price} {q.currencyCode} / MT
                        </span>
                      </div>
                    </div>

                    {/* Footer Meta */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-1">
                        <Globe className="w-3 h-3 text-slate-400" />
                        <span>{q.destinationCountry || "Global"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="shrink-0 bg-white p-3 border-t border-slate-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>

        </div>
      </Drawer>

      {/* Embedded Quotation Preview Drawer */}
      <QuotationPreviewDrawer
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setSelectedQuotation(null);
        }}
        quotationData={selectedQuotation}
      />
    </>
  );
}
