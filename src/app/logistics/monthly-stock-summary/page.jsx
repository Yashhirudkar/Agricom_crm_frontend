import React from "react";
import MonthlyStockSummaryPage from "@/modules/logistics/pages/MonthlyStockSummaryPage";

export const metadata = {
  title: "Monthly Stock Summary | Agricom ERP",
  description: "Manage monthly management stock reports used for generating consolidated stock summaries.",
};

export default function Page() {
  return <MonthlyStockSummaryPage />;
}
