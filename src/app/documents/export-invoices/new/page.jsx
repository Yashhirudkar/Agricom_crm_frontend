"use client";
import React, { Suspense } from "react";
import ExportInvoiceCreatePage from "@/modules/export-invoices/pages/ExportInvoiceCreatePage";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-xs font-semibold text-gray-400">Loading invoice generator...</div>
        </div>
      }
    >
      <ExportInvoiceCreatePage />
    </Suspense>
  );
}

