"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ShipmentListPage from "@/modules/shipments/pages/ShipmentListPage";

function ShipmentsPageContent() {
  const searchParams = useSearchParams();

  const shipmentId = searchParams.get("shipmentId") || null;
  const openCargo = searchParams.get("openCargo") === "true";
  const contractNo = searchParams.get("contractNo") || null;

  return (
    <ShipmentListPage
      preSelectedShipmentId={shipmentId}
      preOpenCargo={openCargo}
      contextContractNo={contractNo}
    />
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-xs font-semibold text-gray-400">Loading shipments...</div>
        </div>
      }
    >
      <ShipmentsPageContent />
    </Suspense>
  );
}
