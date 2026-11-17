"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Printer, Edit2, AlertCircle } from "lucide-react";
import { exportInvoicesApi } from "../services/exportInvoicesApi";
import ExportInvoicePrintDocument from "../components/ExportInvoicePrintDocument";
import { printInvoiceElement } from "../utils/printInvoiceUtil";

export default function ExportInvoiceViewPage({ id }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (id) {
      exportInvoicesApi
        .getInvoice(id)
        .then((res) => {
          if (!isMounted) return;
          if (res?.data) {
            setInvoice(res.data);
          }
        })
        .catch((err) => {
          if (!isMounted) return;
          console.error(err);
          setError("Failed to load invoice");
          toast.error("Failed to load invoice #" + id);
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handlePrint = () => {
    const title = invoice?.invoiceNumber
      ? `Export_Invoice_${invoice.invoiceNumber}`
      : "Export_Invoice";
    printInvoiceElement("export-invoice-print-area", title);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        <span className="text-sm font-medium text-gray-600">Loading export invoice document...</span>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="p-6 max-w-xl mx-auto mt-12 bg-white rounded-2xl border border-red-200 text-center space-y-4">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
        <h2 className="text-base font-bold text-gray-900">Invoice Not Found</h2>
        <p className="text-xs text-gray-600">Could not find export invoice #{id}.</p>
        <button
          type="button"
          onClick={() => router.push("/documents/export-invoices")}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Invoices</span>
        </button>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-[1200px] mx-auto print:p-0 print:m-0">
      {/* Action Header (Hidden when printing) */}
      <div className="sticky top-2 z-20 flex items-center justify-between p-2.5 mb-4 bg-white/90 backdrop-blur-md rounded-xl border border-gray-100 shadow-xs print:hidden">
        <button
          type="button"
          onClick={() => router.push("/documents/export-invoices")}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-blue-600 cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Invoices List</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push(`/documents/export-invoices/${id}/edit`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer transition-colors"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer transition-colors"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* A4 Printed Sheet */}
      <div className="bg-white shadow-lg rounded-sm border border-gray-200 overflow-hidden print:shadow-none print:border-none">
        <ExportInvoicePrintDocument invoice={invoice} />
      </div>
    </div>
  );
}
