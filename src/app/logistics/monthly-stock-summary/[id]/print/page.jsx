import React from "react";
import MonthlyStockReportPrintPage from "@/modules/logistics/pages/MonthlyStockReportPrintPage";

export const metadata = {
  title: "Print Monthly Stock Report | Agricom ERP",
  description: "Dedicated print route for clean A4 monthly stock report.",
};

export default async function Page({ params }) {
  const resolvedParams = await params;
  return <MonthlyStockReportPrintPage id={resolvedParams.id} />;
}
