"use client";
import React, { useState, useEffect, useCallback } from "react";
import { cargoAvailabilityApi } from "../services/cargoAvailabilityApi";
import MttReadinessTab from "./MttReadinessTab";
import MttReadinessFormModal from "./MttReadinessFormModal";
import ExporterLoadingTab from "./ExporterLoadingTab";
import ExporterLoadingDrawer from "./ExporterLoadingDrawer";
import {
  X,
  Truck,
  Plus,
  FileCheck2,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function CargoAvailabilityDrawer({ shipment, onClose }) {
  const [activeTab, setActiveTab] = useState("loading");

  const [cargoData, setCargoData] = useState(null);
  const [loadingCargo, setLoadingCargo] = useState(false);

  // Modals & Drawers
  const [openReadinessModal, setOpenReadinessModal] = useState(false);
  const [openLoadingDrawer, setOpenLoadingDrawer] = useState(false);
  const [activeLoadingRecord, setActiveLoadingRecord] = useState(null);
  const [selectedCargoRecord, setSelectedCargoRecord] = useState(null);

  const fetchCargoData = useCallback(async () => {
    if (!shipment?.id) return;
    try {
      setLoadingCargo(true);
      const res = await cargoAvailabilityApi.getByShipmentId(shipment.id);
      const data = res.data || res;
      setCargoData(data);
      if (data.cargoAvailabilityRecords && data.cargoAvailabilityRecords.length > 0) {
        setSelectedCargoRecord(data.cargoAvailabilityRecords[0]);
      }
    } catch (err) {
      console.error("Failed to fetch cargo data for shipment drawer", err);
    } finally {
      setLoadingCargo(false);
    }
  }, [shipment?.id]);

  useEffect(() => {
    if (shipment?.id) {
      fetchCargoData();
    }
  }, [shipment?.id, fetchCargoData]);

  if (!shipment) return null;

  const contract = shipment.salesContract || {};
  const buyer = contract.buyer || {};

  const cargoRecords = cargoData?.cargoAvailabilityRecords || [];
  const loadingEntries = cargoData?.loadingEntries || [];
  const targetCargoRecord = selectedCargoRecord || cargoRecords[0];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[150] bg-slate-900/30 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide-over Execution Workspace (82vw width, ultra-compact header) */}
      <div
        className="fixed right-0 top-0 bottom-0 z-[160] bg-slate-50 shadow-2xl flex flex-col font-sans border-l border-slate-200 animate-in slide-in-from-right duration-300"
        style={{ width: "82vw", maxWidth: "1440px", minWidth: "600px" }}
      >
        {/* Ultra-Compact Header (44px height) */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-white flex-shrink-0">
          <div className="flex items-center gap-2.5 text-xs">
            <div className="w-7 h-7 rounded-md bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
              <Truck className="h-3.5 w-3.5" />
            </div>
            <div className="flex items-center gap-2 flex-wrap text-slate-700">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Cargo Execution Workspace</h2>
              <span className="text-slate-300 font-normal">|</span>
              <span className="font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 font-bold">
                {shipment.shipmentReference || `Shipment #${shipment.id}`}
              </span>
              <span className="text-slate-300 font-normal">|</span>
              <span className="text-slate-600 font-medium">
                Buyer: <strong className="text-slate-900 font-semibold">{buyer.entityName || "Client"}</strong>
              </span>
              <span className="text-slate-300 font-normal">|</span>
              <span className="text-slate-600 font-medium">
                Product: <strong className="text-slate-900 font-semibold">{shipment.products?.[0]?.name || "—"}</strong> ({shipment.quantity || 0} MT)
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Task-Focused Navigation Tabs (No Overview, No Allocation) */}
        <div className="flex items-center justify-between px-4 border-b border-slate-200 bg-white flex-shrink-0">
          <div className="flex items-center gap-1">
            {[
              { id: "loading", label: "Exporter Loading", icon: Truck, badge: loadingEntries.length },
              { id: "readiness", label: "MTT Readiness", icon: CheckCircle2, badge: targetCargoRecord?.noOfReadinessEntries || 0 },
              { id: "documents", label: "Documents", icon: FileCheck2 },
              { id: "audit", label: "Activity Log", icon: Clock },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? "border-indigo-600 text-indigo-600 font-bold"
                      : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isActive ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Action Button based on active tab */}
          <div>
            {activeTab === "loading" && (
              <button
                onClick={() => {
                  setActiveLoadingRecord(null);
                  setOpenLoadingDrawer(true);
                }}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+ Truck Loading</span>
              </button>
            )}
            {activeTab === "readiness" && (
              <button
                onClick={() => setOpenReadinessModal(true)}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+ Add Readiness</span>
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Workspace Body (Compact 16px Padding) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* TAB 1: EXPORTER LOADING */}
          {activeTab === "loading" && (
            <ExporterLoadingTab
              loadingEntries={loadingEntries}
              onOpenDrawer={(rec) => {
                setActiveLoadingRecord(rec);
                setOpenLoadingDrawer(true);
              }}
              onNewLoading={() => {
                setActiveLoadingRecord(null);
                setOpenLoadingDrawer(true);
              }}
            />
          )}

          {/* TAB 2: MTT READINESS */}
          {activeTab === "readiness" && (
            <div>
              {targetCargoRecord ? (
                <MttReadinessTab cargoRecord={targetCargoRecord} onRefresh={fetchCargoData} />
              ) : (
                <div className="bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center text-slate-400 text-xs">
                  No cargo availability record linked to this contract item yet.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DOCUMENTS */}
          {activeTab === "documents" && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-[0_1px_3px_rgba(0,0,0,0.03)] text-xs">
              <h3 className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck2 className="h-4 w-4 text-teal-600" />
                Cargo Execution Documents &amp; Certificates
              </h3>
              <p className="text-slate-500">
                Uploaded weighbridge slips, quality inspection certificates, and dispatch gate passes.
              </p>
            </div>
          )}

          {/* TAB 4: ACTIVITY LOG */}
          {activeTab === "audit" && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-[0_1px_3px_rgba(0,0,0,0.03)] text-xs">
              <h3 className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-slate-500" />
                Operational Audit Trail
              </h3>
              <p className="text-slate-500">
                Timestamped log of readiness entries, truck weighbridge inputs, and dispatch stage changes.
              </p>
            </div>
          )}

        </div>

        {/* Ultra-Compact Footer */}
        <div className="flex-shrink-0 px-4 py-2 border-t border-slate-200 bg-white flex items-center justify-between">
          <div className="text-[11px] text-slate-400 font-medium">
            Execution Workspace &bull; Task-Focused Operations
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>

      {/* Modals */}
      {openReadinessModal && targetCargoRecord && (
        <MttReadinessFormModal
          cargoRecord={targetCargoRecord}
          onClose={() => setOpenReadinessModal(false)}
          onSuccess={fetchCargoData}
        />
      )}

      {openLoadingDrawer && (
        <ExporterLoadingDrawer
          cargoRecord={targetCargoRecord}
          loadingRecord={activeLoadingRecord}
          defaultShipmentId={shipment.id}
          onClose={() => setOpenLoadingDrawer(false)}
          onSuccess={fetchCargoData}
        />
      )}
    </>
  );
}