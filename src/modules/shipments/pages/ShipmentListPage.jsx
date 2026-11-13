"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Ship, AlertCircle, RefreshCw, Rocket, ChevronRight, Boxes, FileSpreadsheet } from "lucide-react";
import Link from "next/link";
import { shipmentsApi } from "../services/shipmentsApi";
import { purchaseContractApi } from "@/modules/purchase-contracts/services/purchaseContractApi";
import ShipmentsFilter from "../components/ShipmentsFilter";
import ShipmentsTable from "../components/ShipmentsTable";
import ShipmentDetailsDrawer from "../components/ShipmentDetailsDrawer";
import ShipmentEditModal from "../components/ShipmentEditModal";
import ContractViewModal from "@/modules/sales-contracts/components/ContractViewModal";
import DocumentUploadDrawer from "@/modules/sales-contracts/components/DocumentUploadDrawer";
import Pagination from "@/components/common/Pagination";
import CargoAvailabilityDrawer from "@/modules/cargo-availability/components/CargoAvailabilityDrawer";
import ShipmentAllocationModal from "@/modules/cargo-availability/components/ShipmentAllocationModal";
import MttReadinessFormModal from "@/modules/cargo-availability/components/MttReadinessFormModal";
import { cargoAvailabilityApi } from "@/modules/cargo-availability/services/cargoAvailabilityApi";
import FreightAllocationDrawer from "../components/FreightAllocationDrawer";

export default function ShipmentListPage({ preSelectedShipmentId, preOpenCargo, preOpenFreight, contextContractNo }) {
  const router = useRouter();
  // Active Tab: "pending" | "executed"
  const [activeTab, setActiveTab] = useState("pending");

  // Per-tab pagination and sorting state
  const [tabParams, setTabParams] = useState({
    pending: {
      page: 1,
      limit: 10,
      sortBy: "shipmentDate",
      sortOrder: "ASC",
    },
    executed: {
      page: 1,
      limit: 10,
      sortBy: "shipmentDate",
      sortOrder: "DESC",
    },
  });

  // Common filters shared across tabs
  const [commonFilters, setCommonFilters] = useState({
    search: contextContractNo || "",
    businessReference: "",
    status: "",
    timeline: "",
    buyerId: "",
    sellerId: "",
    productId: "",
    country: "",
    portOfLoading: "",
    portOfDischarge: "",
    currency: "",
    financialYear: "",
    shipmentMonth: "",
    shipmentYear: "",
    shipmentDateFrom: "",
    shipmentDateTo: "",
  });

  // Tab counts from backend
  const [tabCounts, setTabCounts] = useState({
    pending: 0,
    executed: 0,
  });

  // Combined filters for subcomponents
  const filters = useMemo(() => {
    const currentTabParams = tabParams[activeTab] || {
      page: 1,
      limit: 10,
      sortBy: "shipmentDate",
      sortOrder: "ASC",
    };
    return {
      ...commonFilters,
      page: currentTabParams.page,
      limit: currentTabParams.limit,
      sortBy: currentTabParams.sortBy,
      sortOrder: currentTabParams.sortOrder,
      tab: activeTab,
      status: commonFilters.status || activeTab,
    };
  }, [commonFilters, tabParams, activeTab]);

  // Toast state (matches existing project pattern)
  const [toastMsg, setToastMsg] = useState(null);
  const showToast = (msg, type = "success") => {
    setToastMsg({ msg, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

    const isMttShipment = (s, targetCargo = null) => {
    const contract = s?.salesContract || {};
    const contractType = String(contract.contractType || s?.contractType || "").trim().toUpperCase();
    const shipmentType = String(contract.shipmentType?.name || contract.shipmentType || s?.shipmentType || "").trim().toUpperCase();
    const purchaseType = String(s?.purchaseContract?.purchaseType || s?.purchaseType || "").trim().toUpperCase();
    
    // Explicit MTT markings
    if (contractType === "MTT" || shipmentType === "MTT" || purchaseType === "MTT") return true;
    if (Array.isArray(s?.purchaseContracts) && s.purchaseContracts.some(pc => String(pc.purchaseType || "").toUpperCase() === "MTT")) return true;
    if (targetCargo?.cargoType === "MTT" || String(targetCargo?.purchaseContract?.purchaseType || "").toUpperCase() === "MTT") return true;

    // Non-export contract types are MTT domestic workflows
    if (contractType && contractType !== "EXPORT" && contractType !== "IMPORT") return true;

    // Even if contractType is "Export", if there are NO sea ports and NO containers, or transport is truck/road, it is MTT (Domestic Truck Loading)
    const hasSeaPorts = Boolean(
      contract.portOfLoading || contract.port_of_loading ||
      contract.portOfDischarge || contract.port_of_discharge ||
      s?.originPortId || s?.destinationPortId
    );
    const hasContainers = Boolean(Number(s?.noOfContainers || s?.no_of_containers || 0) > 0);
    const isTruckTransport = String(contract.originTransportMode || contract.origin_transport_mode || "").toLowerCase() === "truck" ||
      String(contract.originTransportMode || contract.origin_transport_mode || "").toLowerCase() === "road";

    if (!hasSeaPorts && !hasContainers) return true;
    if (isTruckTransport) return true;

    return false;
  };

  const handleOpenCargoAllocation = async (s) => {
    console.log("[ShipmentListPage] handleOpenCargoAllocation invoked for shipment:", {
      id: s.id,
      ref: s.shipmentReference,
      cargoReady: s.cargoReady,
      contractType: s.salesContract?.contractType,
    });

    try {
      setLoadingAllocation(true);
      const res = await cargoAvailabilityApi.getByShipmentId(s.id);
      const data = res?.data || res || {};
      const cargoRecords = data.cargoAvailabilityRecords || [];
      const allocations = data.allocations || [];

      const targetCargo = cargoRecords[0] || allocations[0]?.cargoAvailability || null;
      const isMtt = isMttShipment(s, targetCargo);
      console.log("[ShipmentListPage] isMtt evaluation:", isMtt, "for shipment:", s.id);

      if (isMtt) {
        // MTT WORKFLOW: Open MTT Cargo Readiness Modal directly on current page (/sales/shipments)
        // DO NOT open Cargo Execution Workspace!
        // DO NOT mount CargoAvailabilityDrawer!
        // DO NOT navigate away or change URL!
        let mttCargo = targetCargo;
        if (!mttCargo) {
          const listRes = await cargoAvailabilityApi.getCargoAvailabilityList({
            limit: 20,
            productId: s.products?.[0]?.id || s.salesContract?.items?.[0]?.productId,
          });
          const listData = listRes?.data?.data || listRes?.data || [];
          mttCargo = listData.find(
            (c) =>
              c.purchaseContract?.purchaseType === "MTT" ||
              c.purchaseContract?.salesContract?.contractType === "MTT" ||
              c.cargoType === "MTT"
          ) || listData[0];
        }

        if (!mttCargo) {
          mttCargo = {
            id: null,
            purchaseContractId: s.purchaseContract?.id || null,
            purchaseContract: s.purchaseContract || {
              contractNumber: s.salesContract?.contractNumber || `SHIP-${s.id}`,
              seller: s.salesContract?.seller || { entityName: "Vendor / Warehouse" },
              businessReference: s.businessReference || s.businessTransaction?.businessReference,
            },
            product: s.products?.[0] || { name: "Product" },
            purchaseQty: s.quantity || 0,
            availableQty: s.quantity || 0,
            allocatedQty: s.cargoReady ? (s.quantity || 0) : 0,
            status: s.cargoReady ? "Ready" : "Not Ready",
            isReady: s.cargoReady,
          };
        }

        console.log("[ShipmentListPage] Opening MttReadinessFormModal with cargo:", mttCargo.id || "provisioned");
        setMttReadinessCargoRecord({
          ...mttCargo,
          isReady: s.cargoReady,
          status: s.cargoReady ? "Ready" : mttCargo.status || "Not Ready",
          currentShipment: s,
        });
      } else {
        // Export Cargo: Keep separate and independent. Open Cargo Availability Drawer on the current page
        console.log("[ShipmentListPage] Opening Export Cargo Execution Workspace for shipment:", s.id);
        setCargoShipment(s);
      }
    } catch (err) {
      console.error("[ShipmentListPage] Error preparing cargo readiness:", err);
      showToast("Failed to load cargo readiness details.", "error");
    } finally {
      setLoadingAllocation(false);
    }
  };

  const handleReadinessSuccess = () => {
    setMttReadinessCargoRecord(null);
    fetchShipments();
    fetchStats();
    showToast("Cargo readiness updated successfully.", "success");
  };

  // Data States
  const [shipments, setShipments] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Stats State
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    upcoming: 0,
    delayed: 0,
    inTransit: 0,
    pendingDocuments: 0,
    totalContainers: 0,
    totalQuantity: 0
  });

  // Modal / Drawer Active States
  const [activeShipment, setActiveShipment] = useState(null); // Detail drawer target
  const [cargoShipment, setCargoShipment] = useState(null);   // Cargo availability drawer target
  const [freightShipment, setFreightShipment] = useState(null); // Freight allocation drawer target
  const [editShipment, setEditShipment] = useState(null);     // Edit modal target
  const [viewContractId, setViewContractId] = useState(null); // Contract modal target
  const [docContract, setDocContract] = useState(null);       // Document drawer target
  const [selectedShipments, setSelectedShipments] = useState([]); // Bulk actions checkbox tracker

  // MTT Cargo Allocation & Readiness Workflow State
  const [allocationCargoRecord, setAllocationCargoRecord] = useState(null);
  const [allocationTargetShipment, setAllocationTargetShipment] = useState(null);
  const [mttReadinessCargoRecord, setMttReadinessCargoRecord] = useState(null);
  const [loadingAllocation, setLoadingAllocation] = useState(false);


  // Tab change handler
  const handleTabChange = (newTab) => {
    if (newTab === activeTab) return;
    setActiveTab(newTab);
    setSelectedShipments([]);
  };

  // Filter update handler preserving tab pagination & shared filters
  const handleSetFilters = useCallback((updater) => {
    const currentTabParams = tabParams[activeTab] || {
      page: 1,
      limit: 10,
      sortBy: "shipmentDate",
      sortOrder: "ASC",
    };
    const currentCombined = {
      ...commonFilters,
      page: currentTabParams.page,
      limit: currentTabParams.limit,
      sortBy: currentTabParams.sortBy,
      sortOrder: currentTabParams.sortOrder,
      tab: activeTab,
    };
    const next = typeof updater === "function" ? updater(currentCombined) : updater;

    const nextCommon = { ...commonFilters };
    const nextTabParams = { ...tabParams };
    let tabParamChanged = false;

    ["page", "limit", "sortBy", "sortOrder"].forEach((field) => {
      if (next[field] !== undefined && next[field] !== currentTabParams[field]) {
        nextTabParams[activeTab] = {
          ...nextTabParams[activeTab],
          [field]: next[field],
        };
        tabParamChanged = true;
      }
    });

    let commonChanged = false;
    Object.keys(next).forEach((key) => {
      if (!["page", "limit", "sortBy", "sortOrder", "tab"].includes(key)) {
        if (next[key] !== nextCommon[key]) {
          nextCommon[key] = next[key];
          commonChanged = true;
        }
      }
    });

    if (commonChanged) {
      nextTabParams[activeTab] = {
        ...nextTabParams[activeTab],
        page: 1,
      };
      setCommonFilters(nextCommon);
      setTabParams(nextTabParams);
    } else if (tabParamChanged) {
      setTabParams(nextTabParams);
    }
  }, [activeTab, commonFilters, tabParams]);

  // API Fetches
  const fetchShipments = useCallback(async (opts = {}) => {
    if (!opts?.silent) {
      setLoading(true);
    }
    try {
      const currentTabParams = tabParams[activeTab] || {
        page: 1,
        limit: 10,
        sortBy: "shipmentDate",
        sortOrder: "ASC",
      };
      const queryParams = {
        ...commonFilters,
        page: currentTabParams.page,
        limit: currentTabParams.limit,
        sortBy: currentTabParams.sortBy,
        sortOrder: currentTabParams.sortOrder,
        tab: activeTab,
        status: commonFilters.status || activeTab,
      };
      const res = await shipmentsApi.getShipments(queryParams);
      if (res?.data) {
        setShipments(res.data.data || []);
        setTotal(res.data.total || 0);
        setTotalPages(res.data.totalPages || 0);
        if (res.data.pendingCount !== undefined && res.data.executedCount !== undefined) {
          setTabCounts({
            pending: res.data.pendingCount,
            executed: res.data.executedCount,
          });
        }
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to load shipments registry", "error");
    } finally {
      if (!opts?.silent) {
        setLoading(false);
      }
    }
  }, [activeTab, tabParams, commonFilters]);

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      const currentTabConfig = tabParams[activeTab] || {
        sortBy: "shipmentDate",
        sortOrder: "ASC",
      };
      const response = await shipmentsApi.exportExcel({
        ...commonFilters,
        tab: activeTab,
        status: commonFilters.status || activeTab,
        sortBy: currentTabConfig.sortBy,
        sortOrder: currentTabConfig.sortOrder,
      });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${activeTab}-shipments.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export shipments", error);
      showToast("Failed to export shipments", "error");
    } finally {
      setExporting(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await shipmentsApi.getStats(commonFilters);
      if (res?.data) {
        setStats(res.data);
        if (res.data.pendingCount !== undefined && res.data.executedCount !== undefined) {
          setTabCounts((prev) => ({
            pending: res.data.pendingCount ?? prev.pending,
            executed: res.data.executedCount ?? prev.executed,
          }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle successful execution with automatic movement between tabs
  const handleShipmentExecuted = (executedShipment) => {
    if (activeTab === "pending") {
      setShipments((prev) => prev.filter((s) => s.id !== executedShipment.id));
      setTotal((prev) => Math.max(0, prev - 1));
    }
    setTabCounts((prev) => ({
      pending: Math.max(0, prev.pending - 1),
      executed: prev.executed + 1,
    }));
    setStats((prev) => ({
      ...prev,
      pendingCount: Math.max(0, (prev.pendingCount || 1) - 1),
      executedCount: (prev.executedCount || 0) + 1,
    }));
    fetchShipments({ silent: true });
    fetchStats();
  };

  // Listen for custom shipment-executed event
  useEffect(() => {
    const handleCustomExecuted = (e) => {
      const executedId = e.detail?.shipmentId;
      if (executedId) {
        if (activeTab === "pending") {
          setShipments((prev) => prev.filter((s) => s.id !== executedId));
          setTotal((prev) => Math.max(0, prev - 1));
        }
        setTabCounts((prev) => ({
          pending: Math.max(0, prev.pending - 1),
          executed: prev.executed + 1,
        }));
        fetchShipments({ silent: true });
        fetchStats();
      }
    };

    window.addEventListener("shipment-executed", handleCustomExecuted);
    return () => {
      window.removeEventListener("shipment-executed", handleCustomExecuted);
    };
  }, [activeTab, fetchShipments]);

  // Trigger loading list and stats
  useEffect(() => {
    fetchShipments();
    fetchStats();
  }, [fetchShipments]);

  // Deep Link Selection Handler (supports ?shipmentId=X&openCargo=true)
  useEffect(() => {
    if (preSelectedShipmentId) {
      const loadPreselected = async () => {
        try {
          const res = await shipmentsApi.getShipments({ limit: 100, page: 1, tab: "all" });
          if (res?.data?.data) {
            const match = res.data.data.find(s => String(s.id) === String(preSelectedShipmentId));
            if (match) {
              const timelineRes = await shipmentsApi.getShipments({ search: match.shipmentReference, tab: "all" });
              const resolved = timelineRes?.data?.data?.[0] || match;
              if (preOpenCargo) {
                // Delegate to handleOpenCargoAllocation to ensure MTT opens modal, not workspace
                handleOpenCargoAllocation(resolved);
              } else if (preOpenFreight) {
                // Auto-open FreightAllocationDrawer when ?openFreight=true
                setFreightShipment(resolved);
              } else {
                // Default: open ShipmentDetailsDrawer
                setActiveShipment(resolved);
              }
            }
          }
        } catch (e) {
          console.error("Failed to auto-open deep linked shipment", e);
        }
      };
      loadPreselected();
    }
  }, [preSelectedShipmentId, preOpenCargo, preOpenFreight]);

  // Reset Filters Handler
  const handleResetFilters = () => {
    setCommonFilters({
      search: "",
      status: "",
      timeline: "",
      buyerId: "",
      sellerId: "",
      productId: "",
      country: "",
      portOfLoading: "",
      portOfDischarge: "",
      currency: "",
      financialYear: "",
      shipmentMonth: "",
      shipmentYear: "",
      shipmentDateFrom: "",
      shipmentDateTo: "",
      businessReference: "",
    });
    setTabParams({
      pending: { page: 1, limit: 10, sortBy: "shipmentDate", sortOrder: "ASC" },
      executed: { page: 1, limit: 10, sortBy: "shipmentDate", sortOrder: "DESC" },
    });
    setSelectedShipments([]);
    showToast("Filters cleared successfully");
  };


  const handlePrintSingleShipment = (shipment) => {
    showToast(`Preparing print layout for ${shipment.shipmentReference}...`);
    // Direct browser print logic or window focus print
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Shipment Print - ${shipment.shipmentReference}</title>
          <style>
            body { font-family: monospace; padding: 20px; line-height: 1.6; }
            h2 { border-bottom: 2px solid #000; padding-bottom: 10px; }
            .grid { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-top: 20px; }
            .item { font-size: 14px; margin-bottom: 8px; }
            .bold { font-weight: bold; }
          </style>
        </head>
        <body onload="window.print();window.close();">
          <h2>SHIPMENT DETAILED VOUCHER</h2>
          <div class="item"><span class="bold">Reference:</span> ${shipment.shipmentReference}</div>
          <div class="item"><span class="bold">Business Ref No.:</span> ${shipment.businessReference || shipment.businessTransaction?.businessReference || "—"}</div>
          <div class="item"><span class="bold">Shipment Date:</span> ${new Date(shipment.shipmentDate).toLocaleDateString()}</div>
          <div class="item"><span class="bold">Workflow Status:</span> ${shipment.status}</div>
          
          <div class="grid">
            <div>
              <h3>Commercial Info</h3>
              <div class="item"><span class="bold">Contract:</span> ${shipment.salesContract?.contractNumber}</div>
              <div class="item"><span class="bold">Buyer:</span> ${shipment.salesContract?.buyer?.entityName}</div>
              <div class="item"><span class="bold">Selling Rate:</span> ${shipment.ratePerMt} ${shipment.salesContract?.currencyCode}</div>
              <div class="item"><span class="bold">Purchase Rate:</span> ${shipment.purchaseRate} ${shipment.salesContract?.currencyCode}</div>
            </div>
            <div>
              <h3>Cargo Load</h3>
              <div class="item"><span class="bold">Quantity (MT):</span> ${shipment.quantity}</div>
              <div class="item"><span class="bold">Containers count:</span> ${shipment.noOfContainers}</div>
              <div class="item"><span class="bold">Port of Loading:</span> ${shipment.salesContract?.portOfLoading || "—"}</div>
              <div class="item"><span class="bold">Port of Discharge:</span> ${shipment.salesContract?.portOfDischarge || "—"}</div>
            </div>
          </div>
          <div class="item" style="margin-top: 40px;"><span class="bold">Remarks:</span> ${shipment.remarks || "—"}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Stat Card Display Setup
  const statsConfig = [
    { label: "Total Shipments", value: stats.total, badgeColor: "bg-[#007aff]" },
    { label: "Delayed", value: stats.delayed, badgeColor: "bg-red-500" }
  ];

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden p-3 sm:p-4 lg:p-5 xl:p-6 max-w-[1700px] mx-auto space-y-2 lg:space-y-3 print:p-0 print:shadow-none">

      {/* Toast Notification */}
      {toastMsg && (
        <div className={`fixed top-5 right-5 z-[500] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-xs font-bold text-white transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${toastMsg.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}>
          {toastMsg.type === "error"
            ? <AlertCircle className="h-4 w-4" />
            : <AlertCircle className="h-4 w-4 hidden" />}
          {toastMsg.msg}
        </div>
      )}

      {/* Smart Context Breadcrumb Banner (shown when navigated via URL params) */}
      {(preSelectedShipmentId || contextContractNo) && (
        <div className="flex flex-wrap items-center gap-2 px-3 sm:px-4 py-2.5 bg-indigo-50/80 border border-indigo-100 rounded-xl text-xs font-semibold text-indigo-700 print:hidden">
          <Boxes className="h-3.5 w-3.5 text-indigo-500 flex-shrink-0" />
          <Link href="/sales/cargo-availability" className="hover:underline text-indigo-600">Cargo Availability</Link>
          <ChevronRight className="h-3 w-3 text-indigo-400" />
          <span className="text-indigo-800">Shipments Registry</span>
          {contextContractNo && (
            <>
              <ChevronRight className="h-3 w-3 text-indigo-400" />
              <span className="text-indigo-900 font-bold">{contextContractNo}</span>
            </>
          )}
          {preOpenCargo && (
            <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-200">🚚 Auto-Opening Cargo</span>
          )}
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 print:hidden">
        <div className="min-w-0">
          <h1 className="text-xl max-sm:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Ship className="h-5.5 w-5.5 text-[#007aff]" />
            Shipments Management
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-0.5 max-w-3xl">
            Track and monitor shipment timeline states, documentation completeness, and operational workflow statuses.
          </p>
        </div>
        <div className="flex w-full lg:w-auto items-center gap-2">
          <button
            onClick={handleExportExcel}
            disabled={exporting}
            className="flex-1 lg:flex-none max-sm:flex-none max-sm:w-8 max-sm:px-0 justify-center px-3 py-1.5 min-h-[32px] sm:min-h-[36px] border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg lg:rounded-xl flex items-center gap-1.5 text-[12px] sm:text-xs font-semibold cursor-pointer transition-colors disabled:opacity-50"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{exporting ? "Exporting..." : "Export Excel"}</span>
          </button>
          <button
            onClick={() => fetchShipments()}
            className="flex-1 lg:flex-none max-sm:flex-none max-sm:w-8 max-sm:px-0 justify-center px-3 py-1.5 min-h-[32px] sm:min-h-[36px] border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg lg:rounded-xl flex items-center gap-1.5 text-[12px] sm:text-xs font-semibold cursor-pointer transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Refresh Registry</span>
          </button>
        </div>
      </div>

      {/* Main Container Card: Unified Filter, Table and Pagination */}
      <div className="flex min-h-0 flex-1 flex-col bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden print:border-none">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 px-3 sm:px-5 bg-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-1 sm:gap-4">
            <button
              type="button"
              onClick={() => handleTabChange("pending")}
              className={`relative py-3.5 px-3 sm:px-4 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all duration-200 cursor-pointer ${
                activeTab === "pending"
                  ? "text-[#007aff] font-bold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <span>Pending</span>
              <span
                className={`px-2 py-0.5 text-[11px] sm:text-xs rounded-full font-bold transition-all duration-200 ${
                  activeTab === "pending"
                    ? "bg-blue-50 text-[#007aff] ring-1 ring-blue-500/20"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {tabCounts.pending}
              </span>
              {activeTab === "pending" && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#007aff] rounded-t-full transition-all duration-200" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("executed")}
              className={`relative py-3.5 px-3 sm:px-4 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all duration-200 cursor-pointer ${
                activeTab === "executed"
                  ? "text-[#007aff] font-bold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <span>Stuffed / Executed</span>
              <span
                className={`px-2 py-0.5 text-[11px] sm:text-xs rounded-full font-bold transition-all duration-200 ${
                  activeTab === "executed"
                    ? "bg-blue-50 text-[#007aff] ring-1 ring-blue-500/20"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {tabCounts.executed}
              </span>
              {activeTab === "executed" && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#007aff] rounded-t-full transition-all duration-200" />
              )}
            </button>
          </div>
        </div>

        <div className="print:hidden">
          <ShipmentsFilter
            filters={filters}
            setFilters={handleSetFilters}
            activeTab={activeTab}
            statsConfig={statsConfig}
            onReset={handleResetFilters}
            total={total}
            selectedShipments={selectedShipments}
            onDeselect={() => setSelectedShipments([])}
            onExecuteBulk={async () => {
              try {
                const selectedObjs = shipments.filter((s) => selectedShipments.includes(s.id));
                const unreadyShipments = selectedObjs.filter((s) => !s.readyForShipment);
                if (unreadyShipments.length > 0) {
                  showToast("Cannot execute: Selected shipment(s) pending Cargo or Freight allocation.", "error");
                  return;
                }
                const salesContractId = selectedObjs[0]?.salesContractId || selectedObjs[0]?.salesContract?.id;
                if (!salesContractId) {
                  showToast("Could not determine Sales Contract for selected shipments", "error");
                  return;
                }
                const selectedContractIds = new Set(
                  selectedObjs.map((shipment) =>
                    Number(shipment.salesContractId || shipment.salesContract?.id),
                  ),
                );
                if (selectedContractIds.size !== 1) {
                  showToast("Execute Workspace can only include shipments from one Sales Contract.", "error");
                  return;
                }
                const targetIds = selectedShipments.map(Number);
                await purchaseContractApi.create({
                  salesContractId: Number(salesContractId),
                  shipmentIds: targetIds,
                });
                await Promise.all(
                  targetIds.map((id) => shipmentsApi.updateShipment(id, { status: "Executed" }))
                );
                showToast("Shipments executed successfully", "success");

                // Immediately remove executed rows from Pending view
                setShipments((prev) => prev.filter((s) => !targetIds.includes(s.id)));
                setTotal((prev) => Math.max(0, prev - targetIds.length));
                setTabCounts((prev) => ({
                  pending: Math.max(0, prev.pending - targetIds.length),
                  executed: prev.executed + targetIds.length,
                }));
                setSelectedShipments([]);
                fetchShipments({ silent: true });
                fetchStats();
              } catch (err) {
                console.error("Failed bulk purchase contract execution", err);
                showToast("Failed to execute shipments", "error");
              }
            }}
          />
        </div>
        <ShipmentsTable
          onRefresh={fetchShipments}
          onShipmentExecuted={handleShipmentExecuted}
          activeTab={activeTab}
          shipments={shipments}
          onSortBusinessReference={() => setTabParams((current) => ({
            ...current,
            [activeTab]: {
              ...current[activeTab],
              sortBy: "businessReference",
              sortOrder: current[activeTab]?.sortOrder === "ASC" ? "DESC" : "ASC",
              page: 1,
            },
          }))}
          loading={loading}
          selectedShipments={selectedShipments}
          setSelectedShipments={setSelectedShipments}
          onRowClick={(s) => setActiveShipment(s)}
          onViewContract={(id) => setViewContractId(id)}
          onEditShipment={(s) => setEditShipment(s)}
          onManageDocuments={(contractObj) => setDocContract(contractObj)}
          onPrintShipment={handlePrintSingleShipment}
          onOpenCargoDrawer={handleOpenCargoAllocation}
          onOpenFreightDrawer={(s) => setFreightShipment(s)}
        />

        <div className="print:hidden">
          <Pagination
            currentPage={tabParams[activeTab]?.page || 1}
            totalPages={totalPages}
            onPageChange={(p) => setTabParams((prev) => ({
              ...prev,
              [activeTab]: { ...prev[activeTab], page: p },
            }))}
            totalItems={total}
            itemsPerPage={tabParams[activeTab]?.limit || 10}
            onLimitChange={(newLimit) => setTabParams((prev) => ({
              ...prev,
              [activeTab]: { ...prev[activeTab], limit: newLimit, page: 1 },
            }))}
            itemName="shipments"
          />
        </div>
      </div>

      {/* Shipment Details Drawer (Commercial Document) */}
      {activeShipment && (
        <ShipmentDetailsDrawer
          shipment={activeShipment}
          onClose={() => setActiveShipment(null)}
          onViewContract={(id) => setViewContractId(id)}
          onOpenCargoDrawer={handleOpenCargoAllocation}
        />
      )}

      {/* Cargo Availability Dedicated Drawer (Operational Execution Workspace) */}
      {cargoShipment && (
        <CargoAvailabilityDrawer
          shipment={cargoShipment}
          onClose={() => setCargoShipment(null)}
        />
      )}

      {/* Freight Allocation Dedicated Drawer */}
      {freightShipment && (
        <FreightAllocationDrawer
          shipment={freightShipment}
          onClose={() => setFreightShipment(null)}
          onEditShipment={(s) => setEditShipment(s)}
        />
      )}

      {/* Shipment Independent Edit Modal */}
      {editShipment && (
        <ShipmentEditModal
          shipment={editShipment}
          isOpen={editShipment !== null}
          onClose={() => setEditShipment(null)}
          onSaveSuccess={() => {
            fetchShipments();
            fetchStats();
          }}
        />
      )}

      {/* Contract Details Popup (Reused from Sales Contracts) */}
      {viewContractId && (
        <ContractViewModal
          contractId={viewContractId}
          onClose={() => setViewContractId(null)}
        />
      )}

      {/* Document Upload Drawer (Reused from Sales Contracts) */}
      {docContract && (
        <DocumentUploadDrawer
          contract={docContract}
          onClose={() => setDocContract(null)}
          onRefreshList={() => {
            fetchShipments();
            fetchStats();
          }}
        />
      )}

      {/* Allocate Cargo Modal (Direct MTT Workflow) */}
      {allocationCargoRecord && (
        <ShipmentAllocationModal
          cargoRecord={allocationCargoRecord}
          targetShipment={allocationTargetShipment}
          defaultShipmentId={allocationTargetShipment?.id}
          onClose={() => {
            setAllocationCargoRecord(null);
            setAllocationTargetShipment(null);
          }}
          onSuccess={handleAllocationSuccess}
        />
      )}

      {/* MTT Cargo Readiness Modal (Triggered automatically if not already confirmed) */}
      {mttReadinessCargoRecord && (
        <MttReadinessFormModal
          cargoRecord={mttReadinessCargoRecord}
          shipment={mttReadinessCargoRecord.currentShipment}
          onClose={() => setMttReadinessCargoRecord(null)}
          onSuccess={handleReadinessSuccess}
        />
      )}
    </div>
  );
}
