"use client";
import React, { Suspense, use } from "react";
import ExportInvoiceEditPage from "@/modules/export-invoices/pages/ExportInvoiceEditPage";

export default function Page({ params }) {
  const unwrappedParams = use(params);
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-xs font-semibold text-gray-400">Loading invoice editor...</div>
        </div>
      }
    >
      <ExportInvoiceEditPage id={unwrappedParams.id} />
    </Suspense>
  );
}

