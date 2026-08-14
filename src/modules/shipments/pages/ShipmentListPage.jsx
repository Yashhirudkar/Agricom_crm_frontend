"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Ship, ClipboardCheck, AlertCircle, RefreshCw } from "lucide-react";
import { shipmentsApi } from "../services/shipmentsApi";
import ShipmentsFilter from "../components/ShipmentsFilter";
import ShipmentsTable from "../components/ShipmentsTable";
import ShipmentDetailsDrawer from "../components/ShipmentDetailsDrawer";
import ShipmentEditModal from "../components/ShipmentEditModal";
import ContractViewModal from "@/modules/sales-contracts/components/ContractViewModal";
import DocumentUploadDrawer from "@/modules/sales-contracts/components/DocumentUploadDrawer";
import Pagination from "@/components/common/Pagination";


export default function ShipmentListPage({ preSelectedShipmentId }) {
  // Filters State
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
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
    sortBy: "shipmentDate",
    sortOrder: "ASC"
  });

  // Toast state (matches existing project pattern)
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
  const [editShipment, setEditShipment] = useState(null);     // Edit modal target
  const [viewContractId, setViewContractId] = useState(null); // Contract modal target
  const [docContract, setDocContract] = useState(null);       // Document drawer target
  const [selectedShipments, setSelectedShipments] = useState([]); // Bulk actions checkbox tracker

  // API Fetches
  const fetchShipments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await shipmentsApi.getShipments(filters);
      if (res?.data) {
        setShipments(res.data.data || []);
        setTotal(res.data.total || 0);
        setTotalPages(res.data.totalPages || 0);
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to load shipments registry", "error");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await shipmentsApi.getStats(filters);
      if (res?.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [filters]);

  // Trigger loading list and stats
  useEffect(() => {
    fetchShipments();
    fetchStats();
  }, [fetchShipments, fetchStats]);

  // Deep Link Selection Handler
  useEffect(() => {
    if (preSelectedShipmentId) {
      const loadPreselected = async () => {
        try {
          const res = await shipmentsApi.getShipments({ limit: 100, page: 1 });
          if (res?.data?.data) {
            const match = res.data.data.find(s => String(s.id) === String(preSelectedShipmentId));
            if (match) {
              // Inject timeline & checklist mapping before opening drawer
              const timelineRes = await shipmentsApi.getShipments({ search: match.shipmentReference });
              if (timelineRes?.data?.data?.[0]) {
                setActiveShipment(timelineRes.data.data[0]);
              } else {
                setActiveShipment(match);
              }
            }
          }
        } catch (e) {
          console.error("Failed to auto-open deep linked shipment", e);
        }
      };
      loadPreselected();
    }
  }, [preSelectedShipmentId]);

  // Reset Filters Handler
  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
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
      sortBy: "shipmentDate",
      sortOrder: "ASC"
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
    <div className="p-6 md:p-8 max-w-[1700px] mx-auto space-y-6 print:p-0 print:shadow-none">

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

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Ship className="h-5.5 w-5.5 text-[#007aff]" />
            Shipments Management
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Track and monitor shipment timeline states, documentation completeness, and operational workflow statuses.
          </p>
        </div>
        <button
          onClick={fetchShipments}
          className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh Registry
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 gap-3 max-w-md print:grid-cols-2">
        {statsConfig.map((card, idx) => (
          <div
            key={idx}
            className="p-3 bg-white border border-gray-200 rounded-xl shadow-xs transition-all hover:translate-y-[-1px] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{card.label}</p>
              <span className={`h-1.5 w-1.5 rounded-full ${card.badgeColor}`} />
            </div>
            <p className="text-lg font-extrabold text-gray-900 mt-1">{card.value}</p>
          </div>
        ))}
      </div>


      {/* Filtering Panel */}
      <div className="print:hidden">
        <ShipmentsFilter
          filters={filters}
          setFilters={setFilters}
          onReset={handleResetFilters}
          total={total}
        />
      </div>

      {/* Data Grid table card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden print:border-none">
        <ShipmentsTable
          shipments={shipments}
          loading={loading}
          selectedShipments={selectedShipments}
          setSelectedShipments={setSelectedShipments}
          onRowClick={(s) => setActiveShipment(s)}
          onViewContract={(id) => setViewContractId(id)}
          onEditShipment={(s) => setEditShipment(s)}
          onManageDocuments={(contractObj) => setDocContract(contractObj)}
          onPrintShipment={handlePrintSingleShipment}
        />

        <div className="print:hidden">
          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            onPageChange={(p) => setFilters(prev => ({ ...prev, page: p }))}
          />
        </div>
      </div>

      {/* Shipment Details Drawer */}
      {activeShipment && (
        <ShipmentDetailsDrawer
          shipment={activeShipment}
          onClose={() => setActiveShipment(null)}
          onViewContract={(id) => setViewContractId(id)}
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

    </div>
  );
}
