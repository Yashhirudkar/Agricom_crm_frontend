"use client";

import React, { useState, useEffect } from "react";
import Drawer from "@/components/common/Drawer";
import QuotationPreview from "./QuotationPreview";
import { FileText, Download, Mail, CheckCircle, RefreshCw, Trash2 } from "lucide-react";
import axiosClient from "@/lib/axios";
import { toast } from "sonner";
import ConfirmModal from "@/components/modals/ConfirmModal";

export default function QuotationPreviewDrawer({ isOpen, onClose, quotationId, quotationData, onDeleteSuccess }) {
  const [quotation, setQuotation] = useState(quotationData || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (quotationData) {
        setQuotation(quotationData);
      } else if (quotationId) {
        setIsLoading(true);
        axiosClient
          .get(`/quotations/${quotationId}`)
          .then((res) => {
            setQuotation(res.data);
          })
          .catch((err) => {
            console.error("Failed to load quotation", err);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    } else {
      setQuotation(null);
    }
  }, [isOpen, quotationId, quotationData]);

  const handleConfirmDelete = async () => {
    if (!quotation?.id) return;
    const quoteNo = quotation.quotationNumber || "this quotation";

    setIsDeleting(true);
    try {
      await axiosClient.delete(`/quotations/${quotation.id}`);
      toast.success(`Quotation ${quoteNo} deleted successfully`);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("quotation-deleted", { detail: { id: quotation.id } }));
      }
      if (onDeleteSuccess) onDeleteSuccess(quotation.id);
      setIsConfirmOpen(false);
      onClose();
    } catch (err) {
      console.error("Failed to delete quotation", err);
      toast.error(err.response?.data?.message || "Failed to delete quotation");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        title="Quotation Details"
        widthClass="w-full sm:w-[650px] md:w-[750px] lg:w-[850px]"
      >
        <div className="flex flex-col h-full bg-slate-50 overflow-hidden font-sans">
          
          {/* Sub-Header Actions Toolbar */}
          <div className="shrink-0 bg-white border-b border-slate-200 px-5 py-2.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-violet-600" />
                {quotation?.quotationNumber || "Quotation Preview"}
              </span>
              {quotation?.status && (
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {quotation.status}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {quotation && (
                <button
                  type="button"
                  onClick={() => setIsConfirmOpen(true)}
                  disabled={isDeleting}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  title="Delete Quotation"
                >
                  {isDeleting ? (
                    <div className="h-3.5 w-3.5 rounded-full border-2 border-rose-600 border-t-transparent animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              )}
              <button
                type="button"
                disabled
                className="opacity-50 cursor-not-allowed px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-400 font-bold text-xs rounded-xl flex items-center gap-1.5"
                title="Download PDF feature coming soon"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </button>
              <button
                type="button"
                disabled
                className="opacity-50 cursor-not-allowed px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-400 font-bold text-xs rounded-xl flex items-center gap-1.5"
                title="Email Buyer feature coming soon"
              >
                <Mail className="w-3.5 h-3.5" />
                Email Buyer
              </button>
            </div>
          </div>


          {/* Scrollable Preview Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-2">
                <div className="h-6 w-6 rounded-full border-2 border-violet-600 border-t-transparent animate-spin" />
                <p className="text-xs font-semibold text-slate-500">Loading quotation...</p>
              </div>
            ) : !quotation ? (
              <div className="text-center py-16 text-slate-400 font-semibold text-xs">
                Quotation record could not be found or was removed.
              </div>
            ) : (
              <QuotationPreview quotation={quotation} />
            )}
          </div>

          {/* Compact Footer */}
          <div className="shrink-0 bg-white p-3 border-t border-slate-200 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>

        </div>
      </Drawer>

      {/* Delete Confirmation UI Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Quotation"
        message={`Are you sure you want to delete quotation "${quotation?.quotationNumber || ''}"? This action cannot be undone.`}
      />
    </>
  );
}

