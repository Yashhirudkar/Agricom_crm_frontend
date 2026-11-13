"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ShipmentStuffingExecutionDocPage from "@/modules/documents/pages/ShipmentStuffingExecutionDocPage";

function ShipmentStuffingExecutionContent() {
  const searchParams = useSearchParams();
  const contractNo = searchParams.get("contractNo") || null;

  return (
    <ShipmentStuffingExecutionDocPage
      contextContractNo={contractNo}
    />
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-xs font-semibold text-gray-400">Loading documents...</div>
        </div>
      }
    >
      <ShipmentStuffingExecutionContent />
    </Suspense>
  );
}

