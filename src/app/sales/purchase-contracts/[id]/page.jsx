"use client";
import React from "react";
import PurchaseContractWorkspacePage from "@/modules/purchase-contracts/pages/PurchaseContractWorkspacePage";

export default function Page({ params }) {
  // Unwrap Next.js app router async params safely
  const resolvedParams = params && typeof params.then === "function" ? React.use(params) : params;
  const contractId = resolvedParams?.id;

  return <PurchaseContractWorkspacePage contractId={contractId} />;
}
