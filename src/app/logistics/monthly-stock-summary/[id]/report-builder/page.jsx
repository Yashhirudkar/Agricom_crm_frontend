import React from "react";
import MonthlyStockReportBuilderPage from "@/modules/logistics/pages/MonthlyStockReportBuilderPage";

export const metadata = {
  title: "Monthly Stock Report Builder | Agricom ERP",
  description: "Full-screen spreadsheet workspace for building monthly dynamic stock reports.",
};

export default async function Page({ params }) {
  const resolvedParams = await params;
  return <MonthlyStockReportBuilderPage id={resolvedParams.id} />;
}
