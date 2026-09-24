import React from "react";
import CargoAvailabilityDashboardPage from "@/modules/cargo-availability/pages/CargoAvailabilityDashboardPage";

export const metadata = {
  title: "Cargo Availability & Operations | Agricom CRM",
  description: "ERP standard cargo readiness, stock allocations, and truck loading execution module.",
};

export default function CargoAvailabilityPage() {
  return <CargoAvailabilityDashboardPage />;
}
