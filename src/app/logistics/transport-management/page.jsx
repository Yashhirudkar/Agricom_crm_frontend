import React, { Suspense } from "react";
import LogisticsQueuePage from "@/modules/logistics/pages/LogisticsQueuePage";

export const metadata = {
  title: "Transport Management | Agricom ERP",
  description: "Enterprise Logistics & Freight Management Workspace",
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-xs font-semibold text-gray-400">Loading transport management...</div>
        </div>
      }
    >
      <LogisticsQueuePage />
    </Suspense>
  );
}