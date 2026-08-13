"use client";
import React, { Suspense } from "react";
import ShipmentListPage from "@/modules/shipments/pages/ShipmentListPage";

export default function Page({ params }) {
  // Extract id from params (supports react useParams or direct prop unpacking in app router client pages)
  const shipmentId = params?.id;

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xs font-semibold text-gray-400">Loading shipment details...</div>
      </div>
    }>
      <ShipmentListPage preSelectedShipmentId={shipmentId} />
    </Suspense>
  );
}
