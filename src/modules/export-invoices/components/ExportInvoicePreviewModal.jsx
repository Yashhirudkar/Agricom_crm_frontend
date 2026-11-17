"use client";
import React, { useEffect } from "react";
import { X, Printer, Download } from "lucide-react";
import ExportInvoicePrintDocument from "./ExportInvoicePrintDocument";
import { printInvoiceElement } from "../utils/printInvoiceUtil";
import { useEscapeKey } from "@/hooks/useEscapeKey";

export default function ExportInvoicePreviewModal({ isOpen, invoice, onClose }) {
  useEscapeKey(onClose, isOpen && Boolean(invoice));

  useEffect(() => {
    if (!isOpen) return;

    // Prevent body scrolling behind the modal
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    const title = invoice?.invoiceNumber
      ? `Export_Invoice_${invoice.invoiceNumber}`
      : "Export_Invoice";
    printInvoiceElement("export-invoice-print-area", title);
  };

  return (
    <div
      id="invoice-preview-backdrop"
      className="fixed inset-0 z-[120] print:static print:block print:bg-white print:overflow-visible print:border-none"
    >
      {/* Background Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm print:hidden"
        onClick={onClose}
      />

      {/* Floating Action Bar - Clean Light Theme, Fixed to viewport */}
      <div className="fixed top-4 right-4 sm:right-6 z-[140] flex items-center gap-2 bg-white/95 backdrop-blur-md p-1.5 rounded-xl shadow-xl border border-gray-200 text-gray-800 print:hidden pointer-events-auto">
        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer transition-colors"
          title="Print or Save as PDF"
        >
          <Printer className="h-4 w-4" />
          <span>Print / PDF</span>
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 shadow-xs cursor-pointer transition-colors"
          title="Download PDF"
        >
          <Download className="h-4 w-4" />
          <span>Download</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
          title="Close Preview (Esc)"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Scrollable Document Container */}
      <div
        className="fixed inset-0 z-[125] overflow-y-auto flex justify-center items-start p-2 sm:p-4 print:p-0 print:m-0 print:static print:block print:overflow-visible"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose?.();
          }
        }}
      >
        {/* Printable Sheet Wrapper */}
        <div className="my-8 print:my-0 print:p-0 print:w-full shadow-2xl rounded-sm print:shadow-none print:rounded-none bg-white">
          <ExportInvoicePrintDocument invoice={invoice} id="export-invoice-print-area" />
        </div>
      </div>
    </div>
  );
}
