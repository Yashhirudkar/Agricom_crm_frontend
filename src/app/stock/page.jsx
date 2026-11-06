import StockManagementAccess from "@/modules/stock/pages/StockManagementAccess";

export const metadata = {
  title: "Stock Management | Agricom CRM",
  description: "Automatic Country-wise Product Stock dynamically generated from Purchase Contracts and Shipment Allocations.",
};

export default function Page() {
  return <StockManagementAccess />;
}
