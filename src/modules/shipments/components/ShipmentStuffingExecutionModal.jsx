"use client";
import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  X,
  Check,
  Rocket,
  FileText,
  Layers,
  Truck,
  Package,
  Ship,
  Building2,
  User,
  Calendar,
  Clock,
  Scale,
  Upload,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  FileCheck,
  Info,
  MapPin,
  Anchor,
  Globe,
  Tag,
  Loader2,
  FileSpreadsheet,
  Download,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { shipmentsApi } from "../services/shipmentsApi";
import axiosClient from "@/lib/axios";

// Quick Preset Document Names
const PRESET_DOCUMENTS = [
  "CMR",
  "Weight Slip",
  "Loading Photos",
  "Phytosanitary Certificate",
  "Shipping Bill",
  "BL Draft",
  "Commercial Invoice",
  "Packing List",
  "Other Documents",
];

export default function ShipmentStuffingExecutionModal({
  isOpen,
  shipment,
  onClose,
  onSaveSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successToast, setSuccessToast] = useState("");

  // Drawer width toggle (defaults to 90% horizontal width)
  const [isFullWidth, setIsFullWidth] = useState(false);

  // Accordion toggle for Auto-Populated Details (Section 1)
  const [isAutoExpanded, setIsAutoExpanded] = useState(false);

  // Instant fallback auto-population from shipment props
  const fallbackAuto = useMemo(() => {
    if (!shipment) return {};
    const contract = shipment.salesContract || {};
    const item = contract.items?.[0] || {};
    const product = shipment.products?.[0] || item.product || {};
    const bagSizeKg = item.bagSpecification?.size ? Number(item.bagSpecification.size) : 0;
    const qtyMt = Number(shipment.quantity || 0);
    return {
      shipmentRef: shipment.shipmentReference || `SHP-${shipment.id}`,
      businessRefNo: shipment.businessReference || shipment.businessTransaction?.businessReference || "—",
      salesContractNo: contract.contractNumber || "—",
      purchaseContractNo: "—",
      enquiryRef: contract.enquiry?.enquiryReference || "—",
      buyer: contract.buyer?.entityName || "—",
      seller: contract.seller?.entityName || "—",
      product: product.name || "—",
      commodityGrade: product.grade || item.remarks || "—",
      quantityMt: qtyMt,
      packingType: item.packingType?.name || "—",
      bagSize: bagSizeKg ? `${bagSizeKg} Kg` : "—",
      totalBags: bagSizeKg ? Math.round((qtyMt * 1000) / bagSizeKg) : 0,
      incoterm: contract.paymentTerm?.name || contract.contractType || "—",
      shipmentDate: shipment.shipmentDate || "",
      freightType: contract.shipmentType?.name || "—",
      shipmentType: contract.contractType || "Export",
      route: `${contract.portOfLoading || "—"} ➔ ${contract.portOfDischarge || "—"}`,
      originPort: contract.portOfLoading || "—",
      destinationPort: contract.portOfDischarge || "—",
      originCountry: contract.originCountry || "—",
      destinationCountry: contract.destinationCountry || "—",
      allocatedWeight: 0,
      availableWeight: 0,
      balanceWeight: 0,
      remainingQuantity: qtyMt,
      warehouse: "—",
      shippingLine: "",
      vessel: "",
      voyage: "",
      containerType: shipment.noOfContainers ? `${shipment.noOfContainers} container(s)` : "—",
      freightForwarder: "",
      etd: shipment.shipmentDate || "",
      eta: "",
      pol: contract.portOfLoading || "—",
      pod: contract.portOfDischarge || "—",
      sellerCompany: contract.seller?.entityName || "—",
      sellerAddress: contract.seller?.address || "—",
      gst: contract.seller?.taxId || "—",
      iec: contract.seller?.registrationNumber || "—",
      contactDetails: contract.seller?.contactEmail || "—",
      buyerName: contract.buyer?.entityName || "—",
      buyerAddress: contract.buyer?.address || "—",
      buyerCountry: contract.buyer?.country || "—",
      buyerContactPerson: contract.buyer?.contactEmail || "—",
    };
  }, [shipment]);

  // Auto-populated data from backend
  const [autoData, setAutoData] = useState(fallbackAuto);
  const [tradeDocsList, setTradeDocsList] = useState([]);

  // Section 2: Stuffing Information
  const [stuffingInfo, setStuffingInfo] = useState({
    stuffingDate: new Date().toISOString().split("T")[0],
    stuffingStartTime: "10:00",
    stuffingEndTime: "16:00",
    stuffingLocation: "",
    supervisor: "",
    operator: "",
  });

  // Section 3: Loading & Weights
  const [loadingInfo, setLoadingInfo] = useState({
    loadingDate: new Date().toISOString().split("T")[0],
    loadingStartTime: "",
    loadingEndTime: "",
    actualLoadingWeight: "",
    grossWeight: "",
    netWeight: "",
  });

  // Freight Details (Editable if missing)
  const [freightData, setFreightData] = useState({
    shippingLine: "",
    vessel: "",
    voyage: "",
    containerType: "",
    freightForwarder: "",
    etd: "",
    eta: "",
    pol: "",
    pod: "",
  });

  // Section 4: Dynamic Containers
  const [containers, setContainers] = useState([
    {
      containerNo: "",
      containerSize: "",
      vehicleNumber: "",
      sealNo: "",
      stuffingDate: "",
      warehouse: "",
      status: "Pending",
      remarks: "",
      tareWeight: "",
      grossWeight: "",
      netWeight: "",
    },
  ]);

  // Section 5: Dynamic Trucks
  const [trucks, setTrucks] = useState([
    {
      truckNo: "",
      driver: "",
      mobile: "",
      transporter: "",
    },
  ]);

  // Section 6: Dynamic Attachments
  const [attachments, setAttachments] = useState([]);

  // Section 7: Execution Remarks
  const [remarks, setRemarks] = useState("");

  // Existing stuffing execution status
  const [stuffingStatus, setStuffingStatus] = useState("Draft");
  const [executionStatus, setExecutionStatus] = useState("Draft");

  // Fetch Auto-Populated Data and Trade Documents Master
  useEffect(() => {
    if (!isOpen || !shipment?.id) return;

    let isMounted = true;
    setAutoData(fallbackAuto);
    setLoading(true);
    setErrorMsg("");

    const fetchData = async () => {
      try {
        const res = await shipmentsApi.getStuffingExecution(shipment.id);

        const data = res?.data || res || {};
        const auto = data.autoPopulated || {};

        if (isMounted) {
          const mergedAuto = { ...fallbackAuto, ...auto };
          setAutoData(mergedAuto);

          // Populate initial freight data from auto-populated
          setFreightData({
            shippingLine: mergedAuto.shippingLine || "",
            vessel: mergedAuto.vessel || "",
            voyage: mergedAuto.voyage || "",
            containerType: mergedAuto.containerType || "",
            freightForwarder: mergedAuto.freightForwarder || "",
            etd: mergedAuto.etd || "",
            eta: mergedAuto.eta || "",
            pol: mergedAuto.pol || "",
            pod: mergedAuto.pod || "",
          });

          // If existing stuffing execution exists, load it
          const existing = data.existingStuffing;
          if (existing) {
            setStuffingStatus(existing.stuffingStatus || "Draft");
            setExecutionStatus(existing.executionStatus || "Draft");
            setStuffingInfo({
              stuffingDate: existing.stuffingDate || new Date().toISOString().split("T")[0],
              stuffingStartTime: existing.stuffingStartTime || "10:00",
              stuffingEndTime: existing.stuffingEndTime || "16:00",
              stuffingLocation: existing.stuffingLocation || mergedAuto.warehouse || "",
              supervisor: existing.supervisor || "",
              operator: existing.operator || "",
            });
            setLoadingInfo({
              loadingDate: existing.loadingDate || new Date().toISOString().split("T")[0],
              loadingStartTime: existing.loadingStartTime || "",
              loadingEndTime: existing.loadingEndTime || "",
              actualLoadingWeight: Number(existing.actualLoadingWeight) > 0 ? existing.actualLoadingWeight : "",
              grossWeight: existing.grossWeight || "",
              netWeight: Number(existing.netWeight) > 0 ? existing.netWeight : "",
            });
            if (existing.freightOverrides) {
              setFreightData((prev) => ({ ...prev, ...existing.freightOverrides }));
            }
            if (Array.isArray(existing.containers) && existing.containers.length > 0) {
              setContainers(existing.containers);
            }
            if (Array.isArray(existing.trucks) && existing.trucks.length > 0) {
              setTrucks(
                existing.trucks.map((t) => ({
                  truckNo: t.truckNo || "",
                  driver: t.driver || "",
                  mobile: t.mobile || t.driverPhone || "",
                  transporter: t.transporter || "",
                }))
              );
            }
            if (Array.isArray(existing.attachments) && existing.attachments.length > 0) {
              setAttachments(existing.attachments);
            }
            if (existing.remarks) {
              setRemarks(existing.remarks);
            }
          } else {
            // Defaults initialized with auto-data
            setStuffingInfo((prev) => ({
              ...prev,
              stuffingLocation: mergedAuto.warehouse || "",
            }));
          }
        }

        // 2. Fetch Document Master
        try {
          const docRes = await axiosClient.get("/masters/trade-documents", { params: { limit: 100 } });
          const docItems = docRes.data?.data || docRes.data || [];
          if (isMounted) {
            setTradeDocsList(docItems);
          }
        } catch (docErr) {
          console.warn("Could not load Document Master, using presets fallback:", docErr);
        }
      } catch (err) {
        console.error("Failed to fetch stuffing execution data:", err);
        if (isMounted) {
          setErrorMsg(
            err.response?.data?.message ||
              "Could not start the stuffing workflow for this shipment.",
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [isOpen, shipment?.id, fallbackAuto]);

  // Combined Document Options (Trade Document Master + Presets)
  const availableDocumentNames = useMemo(() => {
    const fromMaster = tradeDocsList.map((d) => d.name).filter(Boolean);
    const combined = Array.from(new Set([...PRESET_DOCUMENTS, ...fromMaster]));
    return combined;
  }, [tradeDocsList]);

  // Container Handlers
  const handleAddContainer = () => {
    setContainers((prev) => [
      ...prev,
      { containerNo: "", containerSize: "", vehicleNumber: "", sealNo: "", stuffingDate: "", warehouse: "", status: "Pending", remarks: "", tareWeight: "", grossWeight: "", netWeight: "" },
    ]);
  };

  const handleRemoveContainer = (index) => {
    if (containers.length <= 1) return;
    setContainers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleContainerChange = (index, field, value) => {
    setContainers((prev) => {
      const updated = [...prev];
      const row = { ...updated[index], [field]: value };

      // Auto-calculate Net Weight = Gross - Tare
      if (field === "grossWeight" || field === "tareWeight") {
        const gross = parseFloat(field === "grossWeight" ? value : row.grossWeight) || 0;
        const tare = parseFloat(field === "tareWeight" ? value : row.tareWeight) || 0;
        if (gross > 0 && tare > 0) {
          row.netWeight = Math.max(0, parseFloat((gross - tare).toFixed(2)));
        }
      }

      updated[index] = row;
      return updated;
    });
  };

  // Truck Handlers
  const handleAddTruck = () => {
    setTrucks((prev) => [
      ...prev,
      { truckNo: "", driver: "", mobile: "", transporter: "" },
    ]);
  };

  const handleRemoveTruck = (index) => {
    if (trucks.length <= 1) return;
    setTrucks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTruckChange = (index, field, value) => {
    setTrucks((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Attachment Handlers
  const handleAddAttachment = (presetName = "") => {
    setAttachments((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        documentName: presetName || PRESET_DOCUMENTS[0],
        fileName: "",
        fileUrl: "",
        fileSize: 0,
        remarks: "",
        isUploading: false,
      },
    ]);
  };

  const handleRemoveAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAttachmentChange = (index, field, value) => {
    setAttachments((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleFileUpload = async (index, file) => {
    if (!file) return;

    setAttachments((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], isUploading: true };
      return updated;
    });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await shipmentsApi.uploadStuffingAttachment(shipment.id, formData);
      const data = res.data || res;

      setAttachments((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          fileName: data.originalName || file.name,
          fileUrl: data.storagePath || `/api/uploads/${data.fileName}`,
          fileSize: data.fileSize || file.size,
          mimeType: data.mimeType || file.type,
          isUploading: false,
        };
        return updated;
      });
    } catch (err) {
      console.error("Failed to upload attachment:", err);
      setErrorMsg("Failed to upload file. Please try again.");
      setAttachments((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], isUploading: false };
        return updated;
      });
    }
  };

  // Submit Handler
  const handleSave = async (action = "draft") => {
    setErrorMsg("");
    setSuccessToast("");

    // Client-side validation when Completing Stuffing
    if (action === "complete") {
      const weight = parseFloat(loadingInfo.actualLoadingWeight) || 0;
      if (weight <= 0) {
        const msg = "Actual Loading Weight (MT) is required before completing stuffing. Please enter a valid weight in Section 2.";
        setErrorMsg(msg);
        toast.error(msg);
        return;
      }
      const maxShipmentQty = Number(autoData.quantityMt || shipment?.quantity || 0);
      if (maxShipmentQty > 0 && weight > maxShipmentQty) {
        const msg = `Actual Loading Weight (${weight} MT) exceeds shipment quantity (${maxShipmentQty} MT).`;
        setErrorMsg(msg);
        toast.error(msg);
        return;
      }
      const allocatedQty = Number(autoData.allocatedWeight || autoData.allocatedQuantity || 0);
      if (allocatedQty > 0 && weight > allocatedQty) {
        const msg = `Actual Loading Weight (${weight} MT) exceeds cargo allocated quantity (${allocatedQty} MT).`;
        setErrorMsg(msg);
        toast.error(msg);
        return;
      }
    }

    setSubmitting(true);

    try {
      const payload = {
        action: action, // "draft" | "complete"
        stuffingStatus: action === "complete" ? "Completed" : "Draft",
        executionStatus: action === "complete" ? "Loading Completed" : "Pending",
        stuffingDate: stuffingInfo.stuffingDate,
        stuffingStartTime: stuffingInfo.stuffingStartTime,
        stuffingEndTime: stuffingInfo.stuffingEndTime,
        stuffingLocation: stuffingInfo.stuffingLocation,
        supervisor: stuffingInfo.supervisor,
        loadingDate: loadingInfo.loadingDate,
        loadingStartTime: loadingInfo.loadingStartTime,
        loadingEndTime: loadingInfo.loadingEndTime,
        operator: stuffingInfo.operator,
        actualLoadingWeight: parseFloat(loadingInfo.actualLoadingWeight) || 0,
        grossWeight: parseFloat(loadingInfo.grossWeight) || 0,
        netWeight: parseFloat(loadingInfo.netWeight) || 0,
        freightOverrides: freightData,
        containers: containers.filter((c) => c.containerNo?.trim()),
        trucks: trucks.filter((t) => t.truckNo?.trim() !== "" || t.driver?.trim() !== "" || t.mobile?.trim() !== "" || t.transporter?.trim() !== ""),
        attachments: attachments.filter((a) => a.documentName || a.fileName),
        remarks: remarks,
        autoPopulated: autoData,
      };

      const res = await shipmentsApi.saveStuffingExecution(shipment.id, payload);
      const data = res.data || res;

      const successMsg = action === "complete"
        ? "Stuffing Completed! Shipment status set to Executed."
        : "Stuffing Draft saved successfully.";
      setSuccessToast(successMsg);
      toast.success(successMsg);

      if (action === "complete") {
        setStuffingStatus("Completed");
        setExecutionStatus("Stuffed");
      }

      setTimeout(() => {
        if (onSaveSuccess) onSaveSuccess(data);
      }, 700);
    } catch (err) {
      console.error("Failed to save stuffing execution:", err);
      const msg = err.response?.data?.message || "Failed to save stuffing execution form.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[195] bg-slate-900/35 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel (90% Horizontal Width) */}
      <div
        className={`fixed right-0 top-0 bottom-0 z-[200] bg-white shadow-2xl flex flex-col font-sans border-l border-slate-200 animate-in slide-in-from-right duration-300 transition-all ${isFullWidth ? "w-full" : "w-full sm:w-[90vw]"
          }`}
        style={{ width: isFullWidth ? "100vw" : "90vw", maxWidth: "100vw" }}
      >
        {/* DRAWER HEADER - PURE WHITE THEME */}
        <div className="px-6 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Shipment Stuffing Execution Form
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  85% Auto-Populated
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase border ${executionStatus === "Stuffed" || stuffingStatus === "Completed"
                    ? "bg-purple-50 text-purple-700 border-purple-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                >
                  {executionStatus === "Stuffed" || stuffingStatus === "Completed"
                    ? "Completed / Stuffed"
                    : "Draft Execution"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                <span>
                  Shipment Ref: <strong className="font-semibold text-slate-800">{autoData.shipmentRef || shipment.shipmentReference || "N/A"}</strong>
                </span>
                <span className="text-slate-300">•</span>
                <span>
                  Business Ref: <strong className="font-semibold text-slate-800">{autoData.businessRefNo || shipment.businessReference || "N/A"}</strong>
                </span>
                <span className="text-slate-300">•</span>
                <span>
                  Sales Contract: <strong className="font-semibold text-slate-800">{autoData.salesContractNo || "N/A"}</strong>
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFullWidth(!isFullWidth)}
              className="px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200 flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow-2xs"
              title={isFullWidth ? "Switch to 90% Width Drawer" : "Switch to Full Screen (100%)"}
            >
              {isFullWidth ? (
                <>
                  <Minimize2 className="h-3.5 w-3.5 text-slate-500" />
                  <span className="hidden sm:inline">90% Width</span>
                </>
              ) : (
                <>
                  <Maximize2 className="h-3.5 w-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Full Screen</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close Drawer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* TOP SUMMARY METRIC STRIP */}
        <div className="bg-slate-50/80 border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 text-xs flex-shrink-0">
          <div className="flex items-center gap-6 flex-wrap">
            <div>
              <span className="text-slate-500 font-medium">Product & Grade:</span>
              <p className="font-bold text-slate-900">{autoData.product || "Soybean"} ({autoData.commodityGrade || "Grade A"})</p>
            </div>
            <div className="h-7 w-px bg-slate-200 hidden sm:block" />
            <div>
              <span className="text-slate-500 font-medium">Quantity (MT):</span>
              <p className="font-bold text-indigo-700 text-sm">{autoData.quantityMt || 0} MT ({autoData.totalBags || 0} Bags)</p>
            </div>
            <div className="h-7 w-px bg-slate-200 hidden sm:block" />
            <div>
              <span className="text-slate-500 font-medium">Allocated Cargo:</span>
              <p className="font-bold text-emerald-700">{autoData.allocatedWeight || 0} MT <span className="text-slate-400 font-normal">(Bal: {autoData.balanceWeight || 0} MT)</span></p>
            </div>
            <div className="h-7 w-px bg-slate-200 hidden sm:block" />
            <div>
              <span className="text-slate-500 font-medium">Incoterm & Route:</span>
              <p className="font-bold text-slate-800">{autoData.incoterm || "FOB"} • {autoData.originPort || "POL"} ➔ {autoData.destinationPort || "POD"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
              Execution Entry Mode
            </span>
          </div>
        </div>

        {/* TOAST / ALERTS */}
        {errorMsg && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successToast && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{successToast}</span>
          </div>
        )}

        {/* DRAWER BODY (SINGLE UNIFIED WORKFLOW) */}
        <div className="flex-1 overflow-y-auto px-6 lg:px-8 py-5 space-y-6 bg-slate-50/40">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <p className="text-sm font-medium">Fetching 80–90% pre-filled data across Shipment, Contract, Cargo & Freight...</p>
            </div>
          ) : (
            <div className="space-y-6">

              {/* 1. AUTO-POPULATED DETAILS (READ ONLY) - ACCORDION */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <button
                  type="button"
                  onClick={() => setIsAutoExpanded(!isAutoExpanded)}
                  className="w-full px-4.5 py-3.5 bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-center justify-between text-left cursor-pointer border-b border-slate-200"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">
                          1. Auto-Populated Details (Read Only)
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          85% Masters
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Shipment & Contract, Cargo Allocation, Freight & Logistics, Seller & Buyer Details
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-indigo-600 font-semibold hidden sm:inline">
                      {isAutoExpanded ? "Collapse Details" : "Expand to View Details"}
                    </span>
                    {isAutoExpanded ? (
                      <ChevronUp className="h-4 w-4 text-slate-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-500" />
                    )}
                  </div>
                </button>

                {/* Collapsed Compact Strip */}
                {!isAutoExpanded && (
                  <div className="px-4.5 py-2.5 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-slate-600">
                      <span><strong>Contract:</strong> {autoData.salesContractNo || "N/A"}</span>
                      <span><strong>Buyer:</strong> {autoData.buyer || "N/A"}</span>
                      <span><strong>Product:</strong> {autoData.product || "Soybean"} ({autoData.commodityGrade || "Grade A"})</span>
                      <span><strong>Qty:</strong> {autoData.quantityMt || 0} MT</span>
                      <span><strong>Allocated:</strong> {autoData.allocatedWeight || 0} MT</span>
                      <span><strong>Route:</strong> {autoData.originPort || "POL"} ➔ {autoData.destinationPort || "POD"}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAutoExpanded(true)}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                    >
                      View All Masters
                    </button>
                  </div>
                )}

                {/* Expanded Full Details */}
                {isAutoExpanded && (
                  <div className="p-4 sm:p-5 space-y-4 bg-slate-50/50">

                    {/* 1.1 Shipment & Sales Contract */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                      <div className="flex items-center gap-2 pb-2.5 mb-3 border-b border-slate-100 text-indigo-700 font-bold text-xs">
                        <Package className="h-4 w-4 text-indigo-600" />
                        <span>Shipment & Sales Contract Master</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-3 gap-x-4 text-xs">
                        <div>
                          <span className="text-slate-400 font-medium">Shipment Ref</span>
                          <p className="font-semibold text-slate-900">{autoData.shipmentRef || "—"}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Business Ref No.</span>
                          <p className="font-semibold text-slate-900">{autoData.businessRefNo || "—"}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Sales Contract No.</span>
                          <p className="font-semibold text-slate-900">{autoData.salesContractNo || "—"}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Purchase Contract No.</span>
                          <p className="font-semibold text-slate-900">{autoData.purchaseContractNo || "—"}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Enquiry Ref</span>
                          <p className="font-semibold text-slate-900">{autoData.enquiryRef || "—"}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Buyer</span>
                          <p className="font-semibold text-slate-900">{autoData.buyer || "—"}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Seller</span>
                          <p className="font-semibold text-slate-900">{autoData.seller || "—"}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Product</span>
                          <p className="font-semibold text-slate-900">{autoData.product || "—"}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Commodity Grade</span>
                          <p className="font-semibold text-slate-900">{autoData.commodityGrade || "—"}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Quantity (MT)</span>
                          <p className="font-bold text-indigo-700">{autoData.quantityMt || 0} MT</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Packing Type</span>
                          <p className="font-semibold text-slate-900">{autoData.packingType || "—"}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Bag Size & Total Bags</span>
                          <p className="font-semibold text-slate-900">{autoData.bagSize || "50 Kg"} • {autoData.totalBags || 0} Bags</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Incoterm</span>
                          <p className="font-semibold text-slate-900">{autoData.incoterm || "FOB"}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Shipment Date</span>
                          <p className="font-semibold text-slate-900">{autoData.shipmentDate || "—"}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Freight & Shipment Type</span>
                          <p className="font-semibold text-slate-900">{autoData.freightType || "Sea"} • {autoData.shipmentType || "Export"}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Route</span>
                          <p className="font-semibold text-slate-900">{autoData.route || "—"}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Origin Country & Port</span>
                          <p className="font-semibold text-slate-900">{autoData.originCountry || "—"} ({autoData.originPort || "—"})</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Destination Country & Port</span>
                          <p className="font-semibold text-slate-900">{autoData.destinationCountry || "—"} ({autoData.destinationPort || "—"})</p>
                        </div>
                      </div>
                    </div>

                    {/* 1.2 Cargo Allocation */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                      <div className="flex items-center gap-2 pb-2.5 mb-3 border-b border-slate-100 text-emerald-700 font-bold text-xs">
                        <Layers className="h-4 w-4 text-emerald-600" />
                        <span>Cargo Allocation Master</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
                        <div>
                          <span className="text-slate-400 font-medium">Allocated Cargo Lots</span>
                          <p className="font-semibold text-slate-900">{autoData.allocatedCargoLots || "LOT-" + shipment.id}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Warehouse</span>
                          <p className="font-semibold text-slate-900">{autoData.warehouse || "Main Warehouse"}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Available Weight</span>
                          <p className="font-bold text-slate-900">{autoData.availableWeight || 0} MT</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Allocated Weight</span>
                          <p className="font-bold text-emerald-700">{autoData.allocatedWeight || 0} MT</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Balance Weight</span>
                          <p className="font-bold text-slate-700">{autoData.balanceWeight || 0} MT</p>
                        </div>
                      </div>
                    </div>

                    {/* 1.3 Freight & Logistics */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs">
                          <Ship className="h-4 w-4 text-indigo-600" />
                          <span>Freight & Logistics Master (Editable if not available)</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="block text-slate-500 font-semibold mb-1">Shipping Line</label>
                          <input
                            type="text"
                            placeholder="e.g. Maersk / MSC"
                            value={freightData.shippingLine}
                            onChange={(e) => setFreightData((prev) => ({ ...prev, shippingLine: e.target.value }))}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-indigo-500 outline-hidden font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold mb-1">Vessel</label>
                          <input
                            type="text"
                            placeholder="e.g. Ever Given"
                            value={freightData.vessel}
                            onChange={(e) => setFreightData((prev) => ({ ...prev, vessel: e.target.value }))}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-indigo-500 outline-hidden font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold mb-1">Voyage</label>
                          <input
                            type="text"
                            placeholder="e.g. 2401E"
                            value={freightData.voyage}
                            onChange={(e) => setFreightData((prev) => ({ ...prev, voyage: e.target.value }))}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-indigo-500 outline-hidden font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold mb-1">Container Type</label>
                          <input
                            type="text"
                            placeholder="e.g. 20' Standard Container"
                            value={freightData.containerType}
                            onChange={(e) => setFreightData((prev) => ({ ...prev, containerType: e.target.value }))}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-indigo-500 outline-hidden font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold mb-1">Freight Forwarder</label>
                          <input
                            type="text"
                            placeholder="e.g. Ocean Blue Forwarders"
                            value={freightData.freightForwarder}
                            onChange={(e) => setFreightData((prev) => ({ ...prev, freightForwarder: e.target.value }))}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-indigo-500 outline-hidden font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold mb-1">ETD</label>
                          <input
                            type="date"
                            value={freightData.etd}
                            onChange={(e) => setFreightData((prev) => ({ ...prev, etd: e.target.value }))}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-indigo-500 outline-hidden font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold mb-1">ETA</label>
                          <input
                            type="date"
                            value={freightData.eta}
                            onChange={(e) => setFreightData((prev) => ({ ...prev, eta: e.target.value }))}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-indigo-500 outline-hidden font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold mb-1">POL (Port of Loading)</label>
                          <input
                            type="text"
                            placeholder="e.g. Nhava Sheva"
                            value={freightData.pol}
                            onChange={(e) => setFreightData((prev) => ({ ...prev, pol: e.target.value }))}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-indigo-500 outline-hidden font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold mb-1">POD (Port of Discharge)</label>
                          <input
                            type="text"
                            placeholder="e.g. Jebel Ali"
                            value={freightData.pod}
                            onChange={(e) => setFreightData((prev) => ({ ...prev, pod: e.target.value }))}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-indigo-500 outline-hidden font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 1.4 & 1.5 Seller & Buyer Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Seller Details */}
                      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                        <div className="flex items-center gap-2 pb-2 mb-2.5 border-b border-slate-100 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                          <Building2 className="h-4 w-4 text-indigo-600" />
                          <span>Seller Details</span>
                        </div>
                        <div className="space-y-1.5 text-xs">
                          <div>
                            <span className="text-slate-400 font-medium">Company Name</span>
                            <p className="font-semibold text-slate-900">{autoData.sellerCompany || "—"}</p>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium">Address</span>
                            <p className="font-medium text-slate-800">{autoData.sellerAddress || "—"}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-slate-400 font-medium">GST / Tax ID</span>
                              <p className="font-semibold text-slate-900">{autoData.gst || "—"}</p>
                            </div>
                            <div>
                              <span className="text-slate-400 font-medium">IEC</span>
                              <p className="font-semibold text-slate-900">{autoData.iec || "—"}</p>
                            </div>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium">Contact</span>
                            <p className="font-medium text-slate-800">{autoData.contactDetails || "—"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Buyer Details */}
                      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                        <div className="flex items-center gap-2 pb-2 mb-2.5 border-b border-slate-100 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                          <User className="h-4 w-4 text-indigo-600" />
                          <span>Buyer Details</span>
                        </div>
                        <div className="space-y-1.5 text-xs">
                          <div>
                            <span className="text-slate-400 font-medium">Buyer Name</span>
                            <p className="font-semibold text-slate-900">{autoData.buyerName || "—"}</p>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium">Address</span>
                            <p className="font-medium text-slate-800">{autoData.buyerAddress || "—"}</p>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium">Country</span>
                            <p className="font-semibold text-slate-900">{autoData.buyerCountry || "—"}</p>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium">Contact Person</span>
                            <p className="font-medium text-slate-800">{autoData.buyerContactPerson || "—"}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>

              {/* 2. LOADING & WEIGHTS */}
              <div className="bg-white border border-slate-200 rounded-xl p-4.5 shadow-xs">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                    <Scale className="h-4 w-4 text-indigo-600" />
                    <span>2. Loading & Weights</span>
                  </div>
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold">
                    Weighbridge Slip Sync
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      Date of Loading
                    </label>
                    <input
                      type="date"
                      value={loadingInfo.loadingDate}
                      onChange={(e) => setLoadingInfo((prev) => ({ ...prev, loadingDate: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-indigo-500 outline-hidden font-medium hover:cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      Actual Loading Weight (MT)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 26.50"
                      value={loadingInfo.actualLoadingWeight}
                      onChange={(e) => setLoadingInfo((prev) => ({ ...prev, actualLoadingWeight: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-indigo-500 outline-hidden font-bold text-indigo-700"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Gross Weight (MT)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 30.20"
                      value={loadingInfo.grossWeight}
                      onChange={(e) => setLoadingInfo((prev) => ({ ...prev, grossWeight: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-indigo-500 outline-hidden font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Net Weight (MT)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 26.50"
                      value={loadingInfo.netWeight}
                      onChange={(e) => setLoadingInfo((prev) => ({ ...prev, netWeight: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:border-indigo-500 outline-hidden font-semibold text-emerald-700"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 text-xs mt-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Loading Start</label>
                    <input type="time" value={loadingInfo.loadingStartTime} onChange={(e) => setLoadingInfo((prev) => ({ ...prev, loadingStartTime: e.target.value }))} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Loading End</label>
                    <input type="time" value={loadingInfo.loadingEndTime} onChange={(e) => setLoadingInfo((prev) => ({ ...prev, loadingEndTime: e.target.value }))} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Supervisor</label>
                    <input value={stuffingInfo.supervisor} onChange={(e) => setStuffingInfo((prev) => ({ ...prev, supervisor: e.target.value }))} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Operator</label>
                    <input value={stuffingInfo.operator} onChange={(e) => setStuffingInfo((prev) => ({ ...prev, operator: e.target.value }))} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2" />
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs">
                  <span className="font-semibold text-indigo-900">Remaining after this loading</span>
                  <span className="font-bold text-indigo-700">
                    {Math.max(0, Number(autoData.remainingQuantity ?? autoData.quantityMt ?? 0) - Number(loadingInfo.actualLoadingWeight || 0)).toFixed(2)} MT
                  </span>
                </div>
              </div>

              {/* 3. CONTAINER DETAILS (DYNAMIC) */}
              <div className="bg-white border border-slate-200 rounded-xl p-4.5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-indigo-600" />
                    <span className="font-bold text-sm text-indigo-700">3. Container Details (Dynamic)</span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {containers.length} {containers.length === 1 ? "Container" : "Containers"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddContainer}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Container</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Container No.</th>
                        <th className="py-2.5 px-3">Size</th>
                        <th className="py-2.5 px-3">Vehicle No.</th>
                        <th className="py-2.5 px-3">Seal No.</th>
                        <th className="py-2.5 px-3">Stuffing Date</th>
                        <th className="py-2.5 px-3">Warehouse</th>
                        <th className="py-2.5 px-3">Container Status</th>
                        <th className="py-2.5 px-3">Remarks</th>
                        <th className="py-2.5 px-3">Tare Wt (MT)</th>
                        <th className="py-2.5 px-3">Gross Wt (MT)</th>
                        <th className="py-2.5 px-3">Net Wt (MT)</th>
                        <th className="py-2.5 px-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {containers.map((c, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2 px-3 text-slate-400 font-bold">{idx + 1}</td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              placeholder="e.g. MSKU1234567"
                              value={c.containerNo}
                              onChange={(e) => handleContainerChange(idx, "containerNo", e.target.value.toUpperCase())}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md font-mono text-xs focus:border-indigo-500 outline-hidden font-medium"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select value={c.containerSize || ""} onChange={(e) => handleContainerChange(idx, "containerSize", e.target.value)} className="min-w-20 rounded border border-slate-200 px-2 py-1.5">
                              <option value="">Select</option><option value="20 FT">20 FT</option><option value="40 FT">40 FT</option><option value="40 HC">40 HC</option>
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input type="text" value={c.vehicleNumber || ""} onChange={(e) => handleContainerChange(idx, "vehicleNumber", e.target.value.toUpperCase())} placeholder="Vehicle No." className="min-w-28 rounded border border-slate-200 px-2 py-1.5" />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              placeholder="e.g. SL987654"
                              value={c.sealNo}
                              onChange={(e) => handleContainerChange(idx, "sealNo", e.target.value.toUpperCase())}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md font-mono text-xs focus:border-indigo-500 outline-hidden font-medium"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input type="date" value={c.stuffingDate || ""} onChange={(e) => handleContainerChange(idx, "stuffingDate", e.target.value)} className="min-w-32 rounded border border-slate-200 px-2 py-1.5" />
                          </td>
                          <td className="py-2 px-3">
                            <input type="text" value={c.warehouse || ""} onChange={(e) => handleContainerChange(idx, "warehouse", e.target.value)} placeholder="Warehouse" className="min-w-28 rounded border border-slate-200 px-2 py-1.5" />
                          </td>
                          <td className="py-2 px-3">
                            <select value={c.status || "Pending"} onChange={(e) => handleContainerChange(idx, "status", e.target.value)} className="min-w-32 rounded border border-slate-200 px-2 py-1.5">
                              {["Pending", "Stuffing Started", "Stuffing In Progress", "Stuffing Completed", "Loading Completed"].map((status) => <option key={status} value={status}>{status}</option>)}
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input type="text" value={c.remarks || ""} onChange={(e) => handleContainerChange(idx, "remarks", e.target.value)} placeholder="Remarks" className="min-w-28 rounded border border-slate-200 px-2 py-1.5" />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              step="0.01"
                              placeholder="e.g. 2.30"
                              value={c.tareWeight}
                              onChange={(e) => handleContainerChange(idx, "tareWeight", e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:border-indigo-500 outline-hidden"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              step="0.01"
                              placeholder="e.g. 28.80"
                              value={c.grossWeight}
                              onChange={(e) => handleContainerChange(idx, "grossWeight", e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:border-indigo-500 outline-hidden font-medium"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              step="0.01"
                              placeholder="Auto: Gross - Tare"
                              value={c.netWeight}
                              onChange={(e) => handleContainerChange(idx, "netWeight", e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-emerald-50/50 border border-emerald-200 rounded-md text-xs text-emerald-800 font-bold focus:border-indigo-500 outline-hidden"
                            />
                          </td>
                          <td className="py-2 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveContainer(idx)}
                              disabled={containers.length === 1}
                              className={`p-1.5 rounded-md transition-colors ${containers.length === 1
                                ? "text-slate-300 cursor-not-allowed"
                                : "text-red-500 hover:bg-red-50 cursor-pointer"
                                }`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4. TRUCK DETAILS (DYNAMIC) */}
              <div className="bg-white border border-slate-200 rounded-xl p-4.5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-indigo-600" />
                    <span className="font-bold text-sm text-indigo-700">4. Truck Details (Dynamic)</span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {trucks.length} {trucks.length === 1 ? "Truck" : "Trucks"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTruck}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Truck</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Truck No.</th>
                        <th className="py-2.5 px-3">Driver Name</th>
                        <th className="py-2.5 px-3">Mobile No.</th>
                        <th className="py-2.5 px-3">Transporter</th>
                        <th className="py-2.5 px-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {trucks.map((t, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2 px-3 text-slate-400 font-bold">{idx + 1}</td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              placeholder="e.g. MH-04-AB-1234"
                              value={t.truckNo}
                              onChange={(e) => handleTruckChange(idx, "truckNo", e.target.value.toUpperCase())}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md font-mono text-xs focus:border-indigo-500 outline-hidden font-medium"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              placeholder="e.g. Ramesh Kumar"
                              value={t.driver}
                              onChange={(e) => handleTruckChange(idx, "driver", e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:border-indigo-500 outline-hidden"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              placeholder="e.g. +91 9876543210"
                              value={t.mobile}
                              onChange={(e) => handleTruckChange(idx, "mobile", e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:border-indigo-500 outline-hidden"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              placeholder="e.g. VRL Logistics"
                              value={t.transporter}
                              onChange={(e) => handleTruckChange(idx, "transporter", e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:border-indigo-500 outline-hidden"
                            />
                          </td>
                          <td className="py-2 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveTruck(idx)}
                              disabled={trucks.length === 1}
                              className={`p-1.5 rounded-md transition-colors ${trucks.length === 1
                                ? "text-slate-300 cursor-not-allowed"
                                : "text-red-500 hover:bg-red-50 cursor-pointer"
                                }`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 5. DYNAMIC ATTACHMENTS (UNLIMITED) */}
              <div className="bg-white border border-slate-200 rounded-xl p-4.5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-indigo-600" />
                    <span className="font-bold text-sm text-indigo-700">5. Dynamic Attachments (Unlimited)</span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {attachments.length} {attachments.length === 1 ? "Document" : "Documents"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddAttachment()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Attachment</span>
                  </button>
                </div>

                {/* Quick Presets Pills */}
                <div className="mb-3.5">
                  <p className="text-[11px] font-medium text-slate-500 mb-1.5">Quick Presets (Click to add document slot):</p>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_DOCUMENTS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleAddAttachment(preset)}
                        className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 transition-all cursor-pointer"
                      >
                        + {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Attachments List */}
                {attachments.length === 0 ? (
                  <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-600 font-medium">No attachments added yet.</p>
                    <p className="text-[11px] text-slate-400">Click a quick preset above or "+ Add Attachment" to upload execution documents.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {attachments.map((att, idx) => (
                      <div
                        key={att.id || idx}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      >
                        <div className="w-full sm:w-56 shrink-0">
                          <label className="block text-[11px] font-medium text-slate-500 mb-0.5">Document Name</label>
                          <input
                            type="text"
                            list={`preset-docs-${idx}`}
                            value={att.documentName}
                            onChange={(e) => handleAttachmentChange(idx, "documentName", e.target.value)}
                            placeholder="e.g. Weight Slip"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:border-indigo-500 outline-hidden"
                          />
                          <datalist id={`preset-docs-${idx}`}>
                            {availableDocumentNames.map((d) => (
                              <option key={d} value={d} />
                            ))}
                          </datalist>
                        </div>

                        {/* File Upload Box */}
                        <div className="flex-1 w-full">
                          <label className="block text-[11px] font-medium text-slate-500 mb-0.5">File Upload</label>
                          <div className="flex items-center gap-2">
                            <label className="px-3 py-1.5 bg-white border border-slate-200 hover:border-indigo-300 rounded-lg font-medium text-slate-700 hover:text-indigo-600 cursor-pointer flex items-center gap-1.5 transition-colors shadow-2xs">
                              {att.isUploading ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                              ) : (
                                <Upload className="h-3.5 w-3.5" />
                              )}
                              <span>{att.fileName ? "Replace File" : "Choose File"}</span>
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => handleFileUpload(idx, e.target.files[0])}
                              />
                            </label>

                            {att.fileName ? (
                              <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium truncate">
                                <FileCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                                <span className="truncate max-w-[200px]" title={att.fileName}>{att.fileName}</span>
                                {att.fileUrl && (
                                  <a
                                    href={att.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-indigo-600 hover:underline p-1"
                                    title="View / Download"
                                  >
                                    <Download className="h-3.5 w-3.5" />
                                  </a>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">No file chosen</span>
                            )}
                          </div>
                        </div>

                        {/* Remarks */}
                        <div className="w-full sm:w-64">
                          <label className="block text-[11px] font-medium text-slate-500 mb-0.5">Remarks</label>
                          <input
                            type="text"
                            placeholder="Optional notes..."
                            value={att.remarks || ""}
                            onChange={(e) => handleAttachmentChange(idx, "remarks", e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:border-indigo-500 outline-hidden"
                          />
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(idx)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors self-end sm:self-center mt-2 sm:mt-0 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 6. EXECUTION REMARKS */}
              <div className="bg-white border border-slate-200 rounded-xl p-4.5 shadow-xs">
                <div className="flex items-center gap-2 pb-2.5 mb-2.5 border-b border-slate-100 text-indigo-700 font-bold text-sm">
                  <FileText className="h-4 w-4 text-indigo-600" />
                  <span>6. Execution Remarks</span>
                </div>
                <textarea
                  rows={4}
                  placeholder="Enter overall stuffing / loading remarks, inspection notes, seal verification comments..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-indigo-500 outline-hidden font-medium"
                />
              </div>

            </div>
          )}
        </div>

        {/* DRAWER FOOTER ACTION BAR - PURE WHITE THEME */}
        <div className="px-6 lg:px-8 py-3.5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>
              Industry Standard Flow: Single tab continuous execution with collapsible auto-populated details.
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            {/* SAVE AS DRAFT */}
            <button
              type="button"
              onClick={() => handleSave("draft")}
              disabled={submitting}
              className="px-4.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              <span>Save Draft</span>
            </button>

            {/* COMPLETE STUFFING */}
            <button
              type="button"
              onClick={() => handleSave("complete")}
              disabled={submitting}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-sm hover:shadow-indigo-500/20 flex items-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Rocket className="h-4 w-4" />
              )}
              <span>Complete Stuffing</span>
            </button>
          </div>
        </div>

      </div>
    </>
  );
}
