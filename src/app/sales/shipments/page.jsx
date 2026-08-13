"use client";
import React, { Suspense } from "react";
import ShipmentListPage from "@/modules/shipments/pages/ShipmentListPage";

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xs font-semibold text-gray-400">Loading shipments...</div>
      </div>
    }>
      <ShipmentListPage />
    </Suspense>
  );
}
