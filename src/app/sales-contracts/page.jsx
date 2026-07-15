"use client";
import { Suspense } from "react";
import SalesContractListPage from "@/modules/sales-contracts/pages/SalesContractListPage";

export default function SalesContractsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
          <p className="text-xs font-semibold text-gray-400">Loading...</p>
        </div>
      }
    >
      <SalesContractListPage />
    </Suspense>
  );
}
