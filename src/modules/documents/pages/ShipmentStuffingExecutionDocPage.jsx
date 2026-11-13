"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FileText, AlertCircle, RefreshCw, FileSpreadsheet } from "lucide-react";
import { shipmentsApi } from "@/modules/shipments/services/shipmentsApi";
import ShipmentsFilter from "@/modules/shipments/components/ShipmentsFilter";
import DocumentsShipmentsTable from "../components/DocumentsShipmentsTable";
import ShipmentDetailsDrawer from "@/modules/shipments/components/ShipmentDetailsDrawer";
import ShipmentEditModal from "@/modules/shipments/components/ShipmentEditModal";
import ShipmentStuffingExecutionModal from "@/modules/shipments/components/ShipmentStuffingExecutionModal";
import ContractViewModal from "@/modules/sales-contracts/components/ContractViewModal";
import Pagination from "@/components/common/Pagination";
import { usePermissions } from "@/hooks/usePermissions";

export default function ShipmentStuffingExecutionDocPage({ contextContractNo }) {
  const { hasPermission } = usePermissions();

  // Sorting and pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    sortBy: "shipmentDate",
    sortOrder: "DESC",
  });

  // Filter state
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

  // Combined filters for subcomponents
  const filters = useMemo(() => {
    return {
      ...commonFilters,
      page: pagination.page,
      limit: pagination.limit,
      sortBy: pagination.sortBy,
      sortOrder: pagination.sortOrder,
      tab: "executed",
      status: commonFilters.status || "executed",
    };
  }, [commonFilters, pagination]);

  // Toast state
  const [toastMsg, setToastMsg] = useState(null);
  const showToast = (msg, type = "success") => {
    setToastMsg({ msg, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Data States
  const [shipments, setShipments] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Modal / Drawer Active States
  const [activeShipment, setActiveShipment] = useState(null); // Detail drawer target
  const [stuffingShipment, setStuffingShipment] = useState(null); // Stuffing execution modal target
  const [editShipment, setEditShipment] = useState(null); // Edit modal target
  const [viewContractId, setViewContractId] = useState(null); // Contract modal target
  const [selectedShipments, setSelectedShipments] = useState([]);

  // Filter update handler preserving pagination & filters
  const handleSetFilters = useCallback((updater) => {
    const currentCombined = {
      ...commonFilters,
      page: pagination.page,
      limit: pagination.limit,
      sortBy: pagination.sortBy,
      sortOrder: pagination.sortOrder,
      tab: "executed",
    };
    const next = typeof updater === "function" ? updater(currentCombined) : updater;

    const nextCommon = { ...commonFilters };
    const nextPagination = { ...pagination };
    let paginationChanged = false;

    ["page", "limit", "sortBy", "sortOrder"].forEach((field) => {
      if (next[field] !== undefined && next[field] !== pagination[field]) {
        nextPagination[field] = next[field];
        paginationChanged = true;
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
      nextPagination.page = 1;
      setCommonFilters(nextCommon);
      setPagination(nextPagination);
    } else if (paginationChanged) {
      setPagination(nextPagination);
    }
  }, [commonFilters, pagination]);

  const handleResetFilters = () => {
    setCommonFilters({
      search: "",
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
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // API Fetches
  const fetchShipments = useCallback(async (opts = {}) => {
    if (!opts?.silent) {
      setLoading(true);
    }
    try {
      const queryParams = {
        ...commonFilters,
        page: pagination.page,
        limit: pagination.limit,
        sortBy: pagination.sortBy,
        sortOrder: pagination.sortOrder,
        tab: "executed",
        status: commonFilters.status || "executed",
      };
      const res = await shipmentsApi.getShipments(queryParams);
      if (res?.data) {
        setShipments(res.data.data || []);
        setTotal(res.data.total || 0);
        setTotalPages(res.data.totalPages || 0);
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to load completed shipments", "error");
    } finally {
      if (!opts?.silent) {
        setLoading(false);
      }
    }
  }, [pagination, commonFilters]);

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      const response = await shipmentsApi.exportExcel({
        ...commonFilters,
        tab: "executed",
        status: commonFilters.status || "executed",
        sortBy: pagination.sortBy,
        sortOrder: pagination.sortOrder,
      });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `shipment-stuffing-execution.xlsx`;
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

  const handleSortBusinessReference = () => {
    setPagination((prev) => ({
      ...prev,
      sortBy: "businessReference",
      sortOrder: prev.sortBy === "businessReference" && prev.sortOrder === "ASC" ? "DESC" : "ASC",
      page: 1,
    }));
  };

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  // RBAC Permission Guard
  if (!hasPermission("shipment_stuffing_execution:view")) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">403 Access Denied</h1>
          <p className="mt-2 text-sm text-slate-500">
            You do not have permission to view Shipment Stuffing Execution Documents.
          </p>
        </div>
      </div>
    );
  }

  const statsConfig = [
    { label: "Completed Executions", value: total, badgeColor: "bg-[#007aff]" },
  ];

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden p-3 sm:p-4 lg:p-5 xl:p-6 max-w-[1700px] mx-auto space-y-2 lg:space-y-3 print:p-0 print:shadow-none">
      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`fixed top-5 right-5 z-[500] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-xs font-bold text-white transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${
            toastMsg.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {toastMsg.type === "error" ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4 hidden" />
          )}
          {toastMsg.msg}
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 print:hidden">
        <div className="min-w-0">
          <h1 className="text-xl max-sm:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <FileText className="h-5.5 w-5.5 text-[#007aff]" />
            Shipment Stuffing Execution
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-0.5 max-w-3xl">
            View, track, and manage stuffing execution documentation for completed shipments.
          </p>
        </div>
        <div className="flex w-full lg:w-auto items-center gap-2">
          <button
            type="button"
            onClick={handleExportExcel}
            disabled={exporting}
            className="flex-1 lg:flex-none max-sm:flex-none max-sm:w-8 max-sm:px-0 justify-center px-3 py-1.5 min-h-[32px] sm:min-h-[36px] border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg lg:rounded-xl flex items-center gap-1.5 text-[12px] sm:text-xs font-semibold cursor-pointer transition-colors disabled:opacity-50"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {exporting ? "Exporting..." : "Export Excel"}
            </span>
          </button>
          <button
            type="button"
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
        <div className="print:hidden">
          <ShipmentsFilter
            filters={filters}
            setFilters={handleSetFilters}
            activeTab="executed"
            statsConfig={statsConfig}
            onReset={handleResetFilters}
            total={total}
            selectedShipments={selectedShipments}
            onDeselect={() => setSelectedShipments([])}
          />
        </div>

        <DocumentsShipmentsTable
          shipments={shipments}
          loading={loading}
          selectedShipments={selectedShipments}
          setSelectedShipments={setSelectedShipments}
          onRowClick={(s) => setActiveShipment(s)}
          onSortBusinessReference={handleSortBusinessReference}
          onOpenDocument={(s) => setStuffingShipment(s)}
        />

        <div className="print:hidden">
          <Pagination
            currentPage={pagination.page}
            totalPages={totalPages}
            onPageChange={(p) =>
              setPagination((prev) => ({
                ...prev,
                page: p,
              }))
            }
            totalItems={total}
            itemsPerPage={pagination.limit}
            onLimitChange={(newLimit) =>
              setPagination((prev) => ({
                ...prev,
                limit: newLimit,
                page: 1,
              }))
            }
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
        />
      )}

      {/* Shipment Stuffing Execution Modal (Reused Component) */}
      {stuffingShipment && (
        <ShipmentStuffingExecutionModal
          isOpen={!!stuffingShipment}
          shipment={stuffingShipment}
          onClose={() => setStuffingShipment(null)}
          onSaveSuccess={() => {
            setStuffingShipment(null);
            fetchShipments();
            showToast("Stuffing execution document saved successfully", "success");
          }}
        />
      )}

      {/* Shipment Edit Modal */}
      {editShipment && (
        <ShipmentEditModal
          shipment={editShipment}
          isOpen={editShipment !== null}
          onClose={() => setEditShipment(null)}
          onSaveSuccess={() => {
            fetchShipments();
          }}
        />
      )}

      {/* Contract Details Modal */}
      {viewContractId && (
        <ContractViewModal
          contractId={viewContractId}
          onClose={() => setViewContractId(null)}
        />
      )}
    </div>
  );
}

