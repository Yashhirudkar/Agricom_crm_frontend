"use client";

import React, { useState } from "react";
import Tabs from "./components/Tabs";
import CurrencyTab from "./components/CurrencyTab";
import ShipmentTypeTab from "./components/ShipmentTypeTab";
import PaymentTermTab from "./components/PaymentTermTab";
import TradeDocumentTab from "./components/TradeDocumentTab";

const TABS = [
  { id: "currencies", label: "Currencies" },
  { id: "shipment-types", label: "Shipment Types" },
  { id: "payment-terms", label: "Payment Terms" },
  { id: "trade-documents", label: "Trade Documents" },
];

export default function SalesMastersPage() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [openedTabs, setOpenedTabs] = useState({ [TABS[0].id]: true });

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setOpenedTabs((prev) => ({ ...prev, [tabId]: true }));
  };

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Sales Masters
        </h1>
        <p className="text-xs text-gray-400 font-medium">
          Manage configuration for sales contracts.
        </p>
      </div>

      <Tabs tabs={TABS} activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="mt-4">
        {/* Lazy mount strategy with CSS hidden for state preservation */}
        
        {openedTabs["currencies"] && (
          <div className={activeTab === "currencies" ? "block animate-in fade-in duration-300" : "hidden"}>
            <CurrencyTab />
          </div>
        )}

        {openedTabs["shipment-types"] && (
          <div className={activeTab === "shipment-types" ? "block animate-in fade-in duration-300" : "hidden"}>
            <ShipmentTypeTab />
          </div>
        )}

        {openedTabs["payment-terms"] && (
          <div className={activeTab === "payment-terms" ? "block animate-in fade-in duration-300" : "hidden"}>
            <PaymentTermTab />
          </div>
        )}

        {openedTabs["trade-documents"] && (
          <div className={activeTab === "trade-documents" ? "block animate-in fade-in duration-300" : "hidden"}>
            <TradeDocumentTab />
          </div>
        )}
      </div>
    </div>
  );
}
