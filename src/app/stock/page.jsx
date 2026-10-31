import React from "react";
import StockManagementPage from "@/modules/stock/pages/StockManagementPage";

export const metadata = {
  title: "Stock Management | Agricom CRM",
  description: "Automatic Country-wise Product Stock dynamically generated from Purchase Contracts and Shipment Allocations.",
};

export default function Page() {
  return <StockManagementPage />;
}

