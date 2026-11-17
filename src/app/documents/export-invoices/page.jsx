"use client";
import React, { Suspense } from "react";
import ExportInvoiceListPage from "@/modules/export-invoices/pages/ExportInvoiceListPage";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-xs font-semibold text-gray-400">Loading export invoices...</div>
        </div>
      }
    >
      <ExportInvoiceListPage />
    </Suspense>
  );
}

