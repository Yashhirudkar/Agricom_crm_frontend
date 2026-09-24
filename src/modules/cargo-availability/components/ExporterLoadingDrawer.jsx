"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  Truck,
  Ship,
  FileText,
  Layers,
  AlertTriangle,
  Clock,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Warehouse,
  Tag,
} from "lucide-react";
import { cargoAvailabilityApi } from "../services/cargoAvailabilityApi";
import axiosClient from "@/lib/axios";

const STAGES = [
  "Draft",
  "Truck Arrived",
  "Weighment In",
  "Loading Started",
  "Loading Completed",
  "Weighment Out",
  "Dispatched",
  "Reached Destination",
  "Unloaded",
  "Verified",
  "Completed",
];

export default function ExporterLoadingDrawer({
  cargoRecord,
  loadingRecord = null,
  defaultShipmentId = null,
  onClose,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shipments, setShipments] = useState([]);
  const [autoShipmentInfo, setAutoShipmentInfo] = useState(null);

  const isEdit = Boolean(loadingRecord?.id);

  const [formData, setFormData] = useState({
    cargoAvailabilityId: cargoRecord?.id,
    shipmentId: loadingRecord?.shipmentId || defaultShipmentId || "",
    warehouseName: loadingRecord?.warehouseName || "",
    loadingDate: loadingRecord?.loadingDate || new Date().toISOString().split("T")[0],
    arrivalTime: loadingRecord?.arrivalTime || "09:00",
    truckNo: loadingRecord?.truckNo || "",
    trailerNo: loadingRecord?.trailerNo || "",
    driverName: loadingRecord?.driverName || "",
    driverMobile: loadingRecord?.driverMobile || "",
    transporter: loadingRecord?.transporter || "",
    licenseNumber: loadingRecord?.licenseNumber || "",
    vehicleType: loadingRecord?.vehicleType || "Heavy Truck",
    bagBulk: loadingRecord?.bagBulk || "Bag",
    bagsCount: loadingRecord?.bagsCount || 0,
    loadedQty: loadingRecord?.loadedQty || "",
    loadedWeight: loadingRecord?.loadedWeight || "",
    avgBagWeight: loadingRecord?.avgBagWeight || 50,
    sealNumber: loadingRecord?.sealNumber || "",
    containerNumber: loadingRecord?.containerNumber || "",
    loadingLocation: loadingRecord?.loadingLocation || "",
    stackNumber: loadingRecord?.stackNumber || "",
    lotNumber: loadingRecord?.lotNumber || "",
    batchNumber: loadingRecord?.batchNumber || "",
    weighmentInWeight: loadingRecord?.weighmentInWeight || 0,
    weighmentOutWeight: loadingRecord?.weighmentOutWeight || 0,
    unloadLocation: loadingRecord?.unloadLocation || "",
    unloadedWeight: loadingRecord?.unloadedWeight || "",
    shortQty: loadingRecord?.shortQty || 0,
    damageQty: loadingRecord?.damageQty || 0,
    differenceReason: loadingRecord?.differenceReason || "",
    ewayBillNo: loadingRecord?.ewayBillNo || "",
    lrNumber: loadingRecord?.lrNumber || "",
    invoiceNumber: loadingRecord?.invoiceNumber || "",
    gatePassNumber: loadingRecord?.gatePassNumber || "",
    remarks: loadingRecord?.remarks || "",
    status: loadingRecord?.status || "Truck Arrived",
  });

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const res = await axiosClient.get("/sales-contracts/shipments", { params: { limit: 100 } });
        setShipments(res.data?.data || res.data || []);
      } catch (err) {
        console.error("Failed to load shipments", err);
      }
    };
    fetchShipments();
  }, []);

  useEffect(() => {
    if (!formData.shipmentId) {
      setAutoShipmentInfo(null);
      return;
    }

    const fetchInfo = async () => {
      try {
        const res = await cargoAvailabilityApi.getShipmentInfo(formData.shipmentId);
        setAutoShipmentInfo(res.data || res);
      } catch (err) {
        console.error("Failed to auto-fetch shipment info", err);
      }
    };
    fetchInfo();
  }, [formData.shipmentId]);

  const handleChange = (f, v) => {
    setFormData((prev) => ({ ...prev, [f]: v }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.shipmentId) {
      setError("Please select a target Shipment. Shipment selection is mandatory.");
      return;
    }

    if (!formData.truckNo) {
      setError("Please enter the Truck Number.");
      return;
    }

    try {
      setLoading(true);
      if (isEdit) {
        await cargoAvailabilityApi.updateLoadingStatus(loadingRecord.id, formData);
      } else {
        await cargoAvailabilityApi.createLoading({
          ...formData,
          loadedQty: Number(formData.loadedQty || formData.loadedWeight || 0),
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to save truck loading record", err);
      setError(err.response?.data?.message || "Failed to save truck loading execution.");
    } finally {
      setLoading(false);
    }
  };

  const selectedShipmentObj = autoShipmentInfo?.shipment || {};
  const salesContract = selectedShipmentObj.salesContract || {};
  const buyer = salesContract.buyer || {};
  const seller = salesContract.seller || {};

  const currentStageIdx = STAGES.indexOf(formData.status);

  const cardCls = "bg-white border border-slate-200 rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3.5";
  const itemCls = "flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-b-0";
  const lblCls = "font-medium text-slate-500";
  const valCls = "font-semibold text-slate-800 text-right";
  const inputCls = "w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium";
  const labelCls = "block text-[11px] font-semibold text-slate-600 mb-1";

  return (
    <>
      {/* Dark overlay backdrop */}
      <div
        className="fixed inset-0 z-[190] bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Centered Modal Dialog Wrapper */}
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[88vh] flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Truck className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">
                  {isEdit ? `Truck Loading Execution (#${loadingRecord.id})` : "New Truck Loading & Dispatch"}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono font-medium">
                  {formData.truckNo || "Vehicle Entry"}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Log weighbridge metrics, driver information, warehouse stacks, and dispatch execution
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="loading-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/60">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Clean Stepper & Stage Selector */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Clock className="h-4 w-4 text-indigo-600" />
                <span>Dispatch Stage Progression</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 font-medium">Set Current Stage:</span>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="px-2.5 py-1 text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg focus:outline-none"
                >
                  {STAGES.map((stg) => (
                    <option key={stg} value={stg}>
                      {stg}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Stepper Bar */}
            <div className="grid grid-cols-11 gap-1 pt-1">
              {STAGES.map((stg, idx) => {
                const isActive = formData.status === stg;
                const isCompleted = currentStageIdx > idx;

                return (
                  <button
                    key={stg}
                    type="button"
                    onClick={() => handleChange("status", stg)}
                    title={`Click to set stage: ${stg}`}
                    className="group flex flex-col items-center gap-1.5 focus:outline-none cursor-pointer"
                  >
                    <div
                      className={`w-full h-1.5 rounded-full transition-all ${isActive
                          ? "bg-indigo-600 shadow-xs"
                          : isCompleted
                            ? "bg-emerald-500"
                            : "bg-slate-200 group-hover:bg-slate-300"
                        }`}
                    />
                    <span
                      className={`text-[9px] font-semibold truncate w-full text-center block ${isActive
                          ? "text-indigo-700 font-bold"
                          : isCompleted
                            ? "text-emerald-700"
                            : "text-slate-400 group-hover:text-slate-600"
                        }`}
                    >
                      {idx + 1}. {stg}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2-Column Responsive Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

            {/* Left Column (6 Cols) */}
            <div className="lg:col-span-6 space-y-5">
              {/* Section 1: Shipment Binding */}
              <div className={cardCls}>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Ship className="h-4 w-4 text-blue-600" />
                    1. Shipment Selection &amp; Allocation
                  </h3>
                  {formData.shipmentId && (
                    <Link
                      href={`/sales/shipments?search=${selectedShipmentObj.shipmentReference || formData.shipmentId}`}
                      target="_blank"
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
                    >
                      <span>Open Shipment</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  )}
                </div>

                <div>
                  <label className={labelCls}>Target Shipment *</label>
                  <select
                    required
                    value={formData.shipmentId}
                    onChange={(e) => handleChange("shipmentId", e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Select Target Sales Contract Shipment...</option>
                    {shipments.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.shipmentReference || `Shipment #${s.id}`} &bull; {s.salesContract?.contractNumber || "SC"} ({s.quantity} MT)
                      </option>
                    ))}
                  </select>
                </div>

                {autoShipmentInfo && (
                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <div className={itemCls}>
                      <span className={lblCls}>Sales Contract</span>
                      <span className={valCls}>{salesContract.contractNumber || "—"}</span>
                    </div>
                    <div className={itemCls}>
                      <span className={lblCls}>Counterparties</span>
                      <span className={valCls}>
                        {buyer.entityName || "—"} / {seller.entityName || "—"}
                      </span>
                    </div>
                    <div className={itemCls}>
                      <span className={lblCls}>Port / Incoterms</span>
                      <span className={valCls}>
                        {salesContract.portOfDischarge || "—"} ({salesContract.incoterms || "FOB"})
                      </span>
                    </div>
                    <div className="mt-2 p-2.5 bg-indigo-50/70 border border-indigo-100 rounded-lg flex items-center justify-between text-xs">
                      <span className="font-semibold text-indigo-900">Remaining Balance</span>
                      <span className="font-extrabold text-indigo-700 text-sm">
                        {autoShipmentInfo.remainingShipmentQty} MT
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 2: Warehouse, Timing & Scheduling */}
              <div className={cardCls}>
                <div className="pb-2 border-b border-slate-100">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Warehouse className="h-4 w-4 text-emerald-600" />
                    2. Warehouse &amp; Scheduling Details
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Warehouse Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Central Silo 4"
                      value={formData.warehouseName}
                      onChange={(e) => handleChange("warehouseName", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Loading Location / Bay</label>
                    <input
                      type="text"
                      placeholder="Bay #3 / Yard East"
                      value={formData.loadingLocation}
                      onChange={(e) => handleChange("loadingLocation", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Loading Date</label>
                    <input
                      type="date"
                      value={formData.loadingDate}
                      onChange={(e) => handleChange("loadingDate", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Arrival Time</label>
                    <input
                      type="time"
                      value={formData.arrivalTime}
                      onChange={(e) => handleChange("arrivalTime", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Stacks, Lots, Batch Numbers */}
                <div className="grid grid-cols-3 gap-2.5 pt-1 border-t border-slate-100">
                  <div>
                    <label className={labelCls}>Stack Number</label>
                    <input
                      type="text"
                      placeholder="STK-01"
                      value={formData.stackNumber}
                      onChange={(e) => handleChange("stackNumber", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Lot Number</label>
                    <input
                      type="text"
                      placeholder="LOT-88"
                      value={formData.lotNumber}
                      onChange={(e) => handleChange("lotNumber", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Batch Number</label>
                    <input
                      type="text"
                      placeholder="BTCH-2026"
                      value={formData.batchNumber}
                      onChange={(e) => handleChange("batchNumber", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Truck & Driver Information */}
              <div className={cardCls}>
                <div className="pb-2 border-b border-slate-100">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Truck className="h-4 w-4 text-indigo-600" />
                    3. Vehicle &amp; Driver Particulars
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Truck Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="MH-04-AB-1234"
                      value={formData.truckNo}
                      onChange={(e) => handleChange("truckNo", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Trailer Number</label>
                    <input
                      type="text"
                      placeholder="TR-55"
                      value={formData.trailerNo}
                      onChange={(e) => handleChange("trailerNo", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Transporter Company</label>
                    <input
                      type="text"
                      placeholder="Logistics Partner Ltd"
                      value={formData.transporter}
                      onChange={(e) => handleChange("transporter", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Vehicle Type</label>
                    <input
                      type="text"
                      placeholder="Heavy Multi-Axle"
                      value={formData.vehicleType}
                      onChange={(e) => handleChange("vehicleType", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  <div>
                    <label className={labelCls}>Driver Name</label>
                    <input
                      type="text"
                      placeholder="Name"
                      value={formData.driverName}
                      onChange={(e) => handleChange("driverName", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Driver Mobile</label>
                    <input
                      type="text"
                      placeholder="+91 98765..."
                      value={formData.driverMobile}
                      onChange={(e) => handleChange("driverMobile", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>License Number</label>
                    <input
                      type="text"
                      placeholder="DL-XXXX"
                      value={formData.licenseNumber}
                      onChange={(e) => handleChange("licenseNumber", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (6 Cols) */}
            <div className="lg:col-span-6 space-y-5">
              {/* Section 4: Loading & Weighbridge Details */}
              <div className={cardCls}>
                <div className="pb-2 border-b border-slate-100">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-emerald-600" />
                    4. Cargo Weight &amp; Containerization
                  </h3>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={labelCls}>Packaging Mode</label>
                    <select
                      value={formData.bagBulk}
                      onChange={(e) => handleChange("bagBulk", e.target.value)}
                      className={inputCls}
                    >
                      <option value="Bag">Bag</option>
                      <option value="Bulk">Bulk</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Bags Count</label>
                    <input
                      type="number"
                      placeholder="1000"
                      value={formData.bagsCount}
                      onChange={(e) => handleChange("bagsCount", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Avg Bag Wt (KG)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="50"
                      value={formData.avgBagWeight}
                      onChange={(e) => handleChange("avgBagWeight", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={labelCls}>Loaded Qty (MT) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="40.00"
                      value={formData.loadedWeight || formData.loadedQty}
                      onChange={(e) => {
                        handleChange("loadedWeight", e.target.value);
                        handleChange("loadedQty", e.target.value);
                      }}
                      className={`${inputCls} font-bold text-indigo-700`}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Seal Number</label>
                    <input
                      type="text"
                      placeholder="SEAL-9988"
                      value={formData.sealNumber}
                      onChange={(e) => handleChange("sealNumber", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Container Number</label>
                    <input
                      type="text"
                      placeholder="MSCU-1234567"
                      value={formData.containerNumber}
                      onChange={(e) => handleChange("containerNumber", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
                  <div>
                    <label className={labelCls}>Weighment In (Gross MT)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="55.00"
                      value={formData.weighmentInWeight}
                      onChange={(e) => handleChange("weighmentInWeight", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Weighment Out (Tare MT)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="15.00"
                      value={formData.weighmentOutWeight}
                      onChange={(e) => handleChange("weighmentOutWeight", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Unloading & Variance Audit */}
              <div className={cardCls}>
                <div className="pb-2 border-b border-slate-100">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    5. Unloading &amp; Weight Variance Audit
                  </h3>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className={labelCls}>Unload Location</label>
                    <input
                      type="text"
                      placeholder="Port Yard / Client Warehouse"
                      value={formData.unloadLocation}
                      onChange={(e) => handleChange("unloadLocation", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Unloaded Wt (MT)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="39.80"
                      value={formData.unloadedWeight}
                      onChange={(e) => handleChange("unloadedWeight", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Shortage / Damage (MT)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.20"
                      value={formData.shortQty}
                      onChange={(e) => handleChange("shortQty", e.target.value)}
                      className={`${inputCls} font-bold text-rose-600`}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Variance Reason / Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Moisture evaporation during transit, calibration delta..."
                    value={formData.differenceReason}
                    onChange={(e) => handleChange("differenceReason", e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Section 6: Regulatory & Documentation */}
              <div className={cardCls}>
                <div className="pb-2 border-b border-slate-100">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-purple-600" />
                    6. Regulatory &amp; Invoicing References
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>E-Way Bill No</label>
                    <input
                      type="text"
                      placeholder="EWB-12345"
                      value={formData.ewayBillNo}
                      onChange={(e) => handleChange("ewayBillNo", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>LR Number</label>
                    <input
                      type="text"
                      placeholder="LR-9876"
                      value={formData.lrNumber}
                      onChange={(e) => handleChange("lrNumber", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Invoice Number</label>
                    <input
                      type="text"
                      placeholder="INV-2026-01"
                      value={formData.invoiceNumber}
                      onChange={(e) => handleChange("invoiceNumber", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Gate Pass No</label>
                    <input
                      type="text"
                      placeholder="GP-5544"
                      value={formData.gatePassNumber}
                      onChange={(e) => handleChange("gatePassNumber", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <label className={labelCls}>Operational Remarks / Special Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Enter any driver remarks, container physical condition notes, or seal remarks..."
                    value={formData.remarks}
                    onChange={(e) => handleChange("remarks", e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>

            </div>

          </div>
        </form>

        {/* Sticky Solid Footer */}
        <div className="flex-shrink-0 px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="loading-form"
            disabled={loading}
            className="px-5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Saving..." : isEdit ? "Update Execution" : "Submit Loading Record"}
          </button>
        </div>
      </div>
    </div>
  </>
);
}