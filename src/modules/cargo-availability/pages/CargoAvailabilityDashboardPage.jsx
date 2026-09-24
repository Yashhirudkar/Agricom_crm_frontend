"use client";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Boxes, CheckCircle2, Truck, RefreshCw, ChevronRight, ArrowLeft } from "lucide-react";
import { cargoAvailabilityApi } from "../services/cargoAvailabilityApi";
import CargoDashboardKpis from "../components/CargoDashboardKpis";
import CargoAvailabilityFilter from "../components/CargoAvailabilityFilter";
import CargoMainGrid from "../components/CargoMainGrid";
import MttReadinessTab from "../components/MttReadinessTab";
import MttReadinessFormModal from "../components/MttReadinessFormModal";
import ShipmentAllocationModal from "../components/ShipmentAllocationModal";
import ExporterLoadingTab from "../components/ExporterLoadingTab";
import ExporterLoadingDrawer from "../components/ExporterLoadingDrawer";

function CargoAvailabilityContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryShipmentId = searchParams.get("shipmentId");
  const queryShipmentNo = searchParams.get("shipmentNo");
  const queryPurchaseContractId = searchParams.get("purchaseContractId");
  const queryContractNo = searchParams.get("contractNo");
  const queryCargoId = searchParams.get("cargoAvailabilityId");
  const queryTab = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState(queryTab || "grid");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [records, setRecords] = useState([]);
  const [selectedRecordId, setSelectedRecordId] = useState(queryCargoId || null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [filters, setFilters] = useState({
    search: queryShipmentNo || queryContractNo || "",
    status: "",
  });

  // Modal / Drawer states
  const [openReadinessModal, setOpenReadinessModal] = useState(false);
  const [openAllocationModal, setOpenAllocationModal] = useState(false);
  const [openLoadingDrawer, setOpenLoadingDrawer] = useState(false);
  const [activeLoadingRecord, setActiveLoadingRecord] = useState(null);

  const [allLoadingEntries, setAllLoadingEntries] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [statsRes, listRes, loadingRes] = await Promise.all([
        cargoAvailabilityApi.getStats(),
        cargoAvailabilityApi.getCargoAvailabilityList(filters),
        cargoAvailabilityApi.getAllLoadingEntries().catch(() => ({ data: [] })),
      ]);
      setStats(statsRes.data || statsRes);
      const dataList = listRes.data?.data || listRes.data || [];
      setRecords(dataList);
      setAllLoadingEntries(loadingRes.data || loadingRes || []);

      let targetId = selectedRecordId;
      if (!targetId && queryCargoId) {
        targetId = queryCargoId;
      }

      if (!targetId && queryPurchaseContractId) {
        const match = dataList.find((r) => r.purchaseContractId === queryPurchaseContractId);
        if (match) targetId = match.id;
      }

      if (targetId) {
        const found = dataList.find((r) => r.id === targetId);
        if (found) {
          const detailRes = await cargoAvailabilityApi.getCargoAvailabilityById(targetId);
          setSelectedRecord(detailRes.data || detailRes);
          setSelectedRecordId(targetId);
        }
      } else if (dataList.length > 0 && !selectedRecord) {
        setSelectedRecord(dataList[0]);
        setSelectedRecordId(dataList[0].id);
      }
    } catch (err) {
      console.error("Failed to load Cargo Availability data", err);
    } finally {
      setIsLoading(false);
    }
  }, [filters, selectedRecordId, queryCargoId, queryPurchaseContractId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ search: "", status: "" });
  };

  const handleSelectRecord = async (id) => {
    if (!id || isNaN(Number(id))) return;
    setSelectedRecordId(id);
    try {
      const res = await cargoAvailabilityApi.getCargoAvailabilityById(id);
      setSelectedRecord(res.data || res);
    } catch (err) {
      console.error("Failed to load cargo record details", err);
    }
  };

  return (
    <div className="w-full max-w-[98%] 2xl:max-w-[1850px] mx-auto px-4 sm:px-6 py-6 font-sans space-y-6">

      {/* Smart Context Breadcrumb Banner */}
      {(queryShipmentId || queryPurchaseContractId) && (
        <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-5 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>Sales</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            {queryShipmentId ? (
              <>
                <Link href="/sales/shipments" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                  Shipments
                </Link>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-blue-700 font-semibold">{queryShipmentNo || "Shipment"}</span>
              </>
            ) : (
              <>
                <Link href="/purchase-contracts" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                  Purchase Contracts
                </Link>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-blue-700 font-semibold">{queryContractNo || "Contract"}</span>
              </>
            )}
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-md border border-slate-200">
              Cargo Availability Execution
            </span>
          </div>

          {queryShipmentId && (
            <Link
              href="/sales/shipments"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg px-3 py-1.5 transition-colors shadow-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-slate-500" />
              <span>Back to Shipment</span>
            </Link>
          )}
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#007aff]">
              <Boxes className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Cargo Availability &amp; Operations</h1>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                Operational execution layer managing warehouse readiness (MTT) through truck loading and dispatch.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin text-blue-600" : ""}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <CargoDashboardKpis stats={stats} isLoading={isLoading} />

      {/* Tabs Bar */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("grid")}
            className={`px-4 py-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${activeTab === "grid"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
              }`}
          >
            <Boxes className="h-4 w-4" />
            <span>Main Cargo Grid</span>
          </button>

          <button
            onClick={() => setActiveTab("readiness")}
            className={`px-4 py-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${activeTab === "readiness"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
              }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>MTT Readiness Entries</span>
          </button>

          <button
            onClick={() => setActiveTab("loading")}
            className={`px-4 py-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${activeTab === "loading"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
              }`}
          >
            <Truck className="h-4 w-4" />
            <span>Exporter Loading Execution</span>
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      {activeTab === "grid" && (
        <div className="space-y-4">
          <CargoAvailabilityFilter
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />

          <CargoMainGrid
            data={records}
            isLoading={isLoading}
            onOpenReadinessModal={(rec) => {
              setSelectedRecord(rec);
              setOpenReadinessModal(true);
            }}
            onOpenAllocationModal={(rec) => {
              setSelectedRecord(rec);
              setOpenAllocationModal(true);
            }}
            onSelectRecord={(id) => {
              handleSelectRecord(id);
              setActiveTab("readiness");
            }}
          />
        </div>
      )}

      {/* MTT Readiness Tab View */}
      {activeTab === "readiness" && (
        <div className="space-y-4">
          <MttReadinessTab
            cargoRecord={selectedRecord || records[0]}
            onRefresh={fetchData}
          />
        </div>
      )}

      {/* Exporter Loading Tab View */}
      {activeTab === "loading" && (
        <div className="space-y-4">
          <ExporterLoadingTab
            loadingEntries={allLoadingEntries.length > 0 ? allLoadingEntries : (selectedRecord?.loadingEntries || [])}
            onOpenDrawer={(rec) => {
              setActiveLoadingRecord(rec);
              setOpenLoadingDrawer(true);
            }}
            onNewLoading={() => {
              setActiveLoadingRecord(null);
              setOpenLoadingDrawer(true);
            }}
          />
        </div>
      )}

      {/* Modals & Drawers */}
      {openReadinessModal && (
        <MttReadinessFormModal
          cargoRecord={selectedRecord}
          onClose={() => setOpenReadinessModal(false)}
          onSuccess={fetchData}
        />
      )}

      {openAllocationModal && (
        <ShipmentAllocationModal
          cargoRecord={selectedRecord}
          onClose={() => setOpenAllocationModal(false)}
          onSuccess={fetchData}
        />
      )}

      {openLoadingDrawer && (
        <ExporterLoadingDrawer
          cargoRecord={selectedRecord || records[0]}
          loadingRecord={activeLoadingRecord}
          onClose={() => setOpenLoadingDrawer(false)}
          onSuccess={fetchData}
        />
      )}

    </div>
  );
}

export default function CargoAvailabilityDashboardPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-slate-500 font-medium">Loading Cargo Operations...</div>}>
      <CargoAvailabilityContent />
    </Suspense>
  );
}