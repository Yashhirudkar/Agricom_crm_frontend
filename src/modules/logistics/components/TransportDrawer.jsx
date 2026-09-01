"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Plus,
  Star,
  Trash2,
  Edit2,
  Calendar,
  FileText,
  Paperclip,
  CheckCircle,
  Truck,
  Loader2,
  AlertTriangle,
  Sparkles,
  MessageSquare,
  RefreshCw,
  FileCheck,
  MapPin,
  Clock,
  ArrowRight,
  UploadCloud,
  Download,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Building2,
  Check,
  RotateCw,
  Layers,
  Package,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { logisticsApi } from "../services/logisticsApi";
import AddFreightQuoteModal from "./AddFreightQuoteModal";
import PartnerDrawer from "@/components/masters/partners/PartnerDrawer";
import VirtualizedAuditLogTimeline from "./VirtualizedAuditLogTimeline";
import axiosClient from "@/lib/axios";
import { resolvePhone } from "@/lib/contactUtils";

const STATUS_STEPS = [
  "Pending",
  "Freight Requested",
  "Quotes Received",
  "Preferred Quote Selected",
  "Transport Assigned",
  "Ready For Shipment",
  "Shipment Created",
  "In Transit",
  "Delivered",
  "Closed",
];

const DOC_CATEGORIES = [
  "Freight Quotation",
  "Rate Sheet",
  "Booking Confirmation",
  "Invoice",
  "LR Copy",
  "POD",
  "Other",
];

export default function TransportDrawer({ isOpen, onClose, enquiry, isReadOnly = false }) {
  const [activeTab, setActiveTab] = useState("quotes");
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);

  // Quote modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);

  // Attachments
  const [attachments, setAttachments] = useState([]);
  const [uploadCategory, setUploadCategory] = useState("Freight Quotation");
  const [uploading, setUploading] = useState(false);

  // Timeline
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // Editable fields
  const [estDispatch, setEstDispatch] = useState("");
  const [estArrival, setEstArrival] = useState("");
  const [actDispatch, setActDispatch] = useState("");
  const [actArrival, setActArrival] = useState("");
  const [remarks, setRemarks] = useState("");
  const [transportMode, setTransportMode] = useState("Road");
  const [logisticsStatus, setLogisticsStatus] = useState("Pending");

  // Partner Drawer for Inline New Partner / Add Contact
  const [isPartnerDrawerOpen, setIsPartnerDrawerOpen] = useState(false);
  const [partnerEditData, setPartnerEditData] = useState(null);
  const [partnerInitialTab, setPartnerInitialTab] = useState("general");
  const [savingPartner, setSavingPartner] = useState(false);
  const [partnerDrawerError, setPartnerDrawerError] = useState("");
  const [partnerRoles, setPartnerRoles] = useState([]);
  const [autoSelectPartner, setAutoSelectPartner] = useState(null);

  // Fetch partner roles when partner drawer opens
  useEffect(() => {
    if (isPartnerDrawerOpen && partnerRoles.length === 0) {
      axiosClient
        .get("/masters/partner-roles")
        .then((res) => {
          const roles = res.data?.data || res.data || [];
          setPartnerRoles(roles);
        })
        .catch((e) => console.error("Failed to load partner roles", e));
    }
  }, [isPartnerDrawerOpen, partnerRoles.length]);

  const handleOpenCreatePartner = () => {
    setPartnerEditData(null);
    setPartnerInitialTab("general");
    setPartnerDrawerError("");
    setIsPartnerDrawerOpen(true);
  };

  const handleOpenAddContact = async (partnerEntity) => {
    if (!partnerEntity?.id) return;
    try {
      const res = await axiosClient.get(`/masters/partners/${partnerEntity.id}`);
      setPartnerEditData(res.data || partnerEntity);
    } catch (e) {
      setPartnerEditData(partnerEntity);
    }
    setPartnerInitialTab("contacts");
    setPartnerDrawerError("");
    setIsPartnerDrawerOpen(true);
  };

  const handleSavePartnerDrawer = async (payload) => {
    setSavingPartner(true);
    setPartnerDrawerError("");
    try {
      let savedPartner;
      if (partnerEditData?.id) {
        try {
          const res = await axiosClient.patch(`/masters/partners/${partnerEditData.id}`, payload);
          savedPartner = res.data?.data || res.data;
        } catch (err) {
          if (err.response?.status === 404) {
            const res = await axiosClient.post("/masters/partners", payload);
            savedPartner = res.data?.data || res.data;
          } else {
            throw err;
          }
        }
        toast.success(`Updated contacts for ${savedPartner?.entityName || "partner"}!`);
      } else {
        const res = await axiosClient.post("/masters/partners", payload);
        savedPartner = res.data?.data || res.data;
        toast.success(`Transport Partner ${savedPartner?.entityName || ""} created successfully!`);
      }

      setIsPartnerDrawerOpen(false);

      const primaryContact = savedPartner.contacts?.find((c) => c.isPrimary) || savedPartner.contacts?.[0];
      const phone = resolvePhone(primaryContact);

      setAutoSelectPartner({
        partnerId: savedPartner.id,
        contactName: primaryContact?.name || "",
        phoneNumber: phone,
        focusContactField: true,
      });
    } catch (err) {
      console.error(err);
      setPartnerDrawerError(err.response?.data?.message || "Failed to save partner details.");
    } finally {
      setSavingPartner(false);
    }
  };

  const loadDetails = useCallback(async () => {
    if (!enquiry?.id) return;
    setLoading(true);
    try {
      const res = await logisticsApi.getDetails(enquiry.id);
      setDetails(res.data);

      const log = res.data?.logistics;
      if (log) {
        setEstDispatch(log.estimatedDispatchDate || "");
        setEstArrival(log.estimatedArrivalDate || "");
        setActDispatch(log.actualDispatchDate || "");
        setActArrival(log.actualArrivalDate || "");
        setRemarks(log.remarks || "");
        setTransportMode(log.transportMode || "Road");
        setLogisticsStatus(log.status || "Pending");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load transport details.");
    } finally {
      setLoading(false);
    }
  }, [enquiry]);

  useEffect(() => {
    if (isOpen && enquiry?.id) {
      loadDetails();
      setActiveTab("quotes");
    }
  }, [isOpen, enquiry, loadDetails]);

  // Load attachments
  const loadAttachments = useCallback(async () => {
    if (!details?.logistics?.id) return;
    try {
      const res = await logisticsApi.getAttachments(details.logistics.id);
      setAttachments(res.data || []);
    } catch (err) {
      console.error(err);
    }
  }, [details]);

  // Load timeline
  const loadTimeline = useCallback(async () => {
    if (!details?.logistics?.id) return;
    setLoadingActivities(true);
    try {
      const res = await logisticsApi.getActivities(details.logistics.id);
      setActivities(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingActivities(false);
    }
  }, [details]);

  useEffect(() => {
    if (activeTab === "docs") loadAttachments();
    if (activeTab === "timeline") loadTimeline();
  }, [activeTab, loadAttachments, loadTimeline]);

  // Status & Transport Mode update
  const handleUpdateHeader = async () => {
    if (isReadOnly || !details?.logistics?.id) return;
    setSavingStatus(true);
    try {
      const payload = {
        status: logisticsStatus,
        transportMode,
      };
      await logisticsApi.updateStatus(details.logistics.id, payload);
      toast.success("Logistics settings updated successfully!");
      loadDetails();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status.");
    } finally {
      setSavingStatus(false);
    }
  };

  const handleStepClick = async (step) => {
    if (isReadOnly || !details?.logistics?.id || savingStatus) return;
    setLogisticsStatus(step);
    setSavingStatus(true);
    try {
      await logisticsApi.updateStatus(details.logistics.id, {
        status: step,
        transportMode,
      });
      toast.success(`Logistics status updated to "${step}"!`);
      loadDetails();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status.");
    } finally {
      setSavingStatus(false);
    }
  };

  // Add/Edit Quote
  const handleSaveQuote = async (payload) => {
    if (isReadOnly || !details?.logistics?.id) return;
    if (selectedQuote) {
      await logisticsApi.updateFreightQuote(details.logistics.id, selectedQuote.id, payload);
      toast.success("Freight quote revised (New version created).");
    } else {
      await logisticsApi.addFreightQuote(details.logistics.id, payload);
      toast.success("Freight quote added to evaluation matrix.");
    }
    loadDetails();
  };

  const handleDeleteQuote = async (quoteId) => {
    if (isReadOnly || !details?.logistics?.id) return;
    try {
      await logisticsApi.deleteFreightQuote(details.logistics.id, quoteId);
      toast.success("Quote removed.");
      loadDetails();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete quote.");
    }
  };

  const handleSetPreferred = async (quoteId) => {
    if (isReadOnly || !details?.logistics?.id) return;
    try {
      await logisticsApi.setPreferredQuote(details.logistics.id, quoteId);
      toast.success("Preferred Quote selected & locked!");
      loadDetails();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to lock preferred quote.");
    }
  };

  // Generate Shipment
  const handleGenerateShipment = async () => {
    if (isReadOnly || !details?.logistics?.id) return;
    try {
      await logisticsApi.generateShipment(details.logistics.id);
      toast.success("Execution Shipment generated successfully!");
      loadDetails();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate shipment.");
    }
  };

  // Upload Document
  const handleUploadFile = async (e) => {
    const file = e.target.files[0];
    if (isReadOnly || !file || !details?.logistics?.id) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", uploadCategory);

      await logisticsApi.uploadAttachment(details.logistics.id, formData);
      toast.success("Document uploaded successfully.");
      loadAttachments();
    } catch (err) {
      toast.error("Failed to upload document.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAttachment = async (attId) => {
    if (isReadOnly || !details?.logistics?.id) return;
    try {
      await logisticsApi.deleteAttachment(details.logistics.id, attId);
      toast.success("Attachment removed.");
      loadAttachments();
    } catch (err) {
      toast.error("Failed to delete attachment.");
    }
  };

  if (!isOpen) return null;

  const currentStepIndex = STATUS_STEPS.indexOf(logisticsStatus);

  // Quote Badges & Intelligence Logic
  const quotes = details?.logistics?.quotes || [];
  let lowestPriceId = null;
  let fastestTransitId = null;
  let bestValueId = null;
  const expiringSoonIds = [];

  if (quotes.length > 0) {
    const quoteTotals = quotes.map((q) => ({
      id: q.id,
      transit: Number(q.transitDays || 999),
      total: Number(q.freightAmount) + Number(q.fuelCharges || 0) + Number(q.additionalCharges || 0),
    }));

    const minVal = Math.min(...quoteTotals.map((x) => x.total));
    lowestPriceId = quoteTotals.find((x) => x.total === minVal)?.id;

    const minTransit = Math.min(...quoteTotals.map((x) => x.transit));
    fastestTransitId = quoteTotals.find((x) => x.transit === minTransit)?.id;

    if (quotes.length > 1) {
      const maxVal = Math.max(...quoteTotals.map((x) => x.total)) || 1;
      const maxTransit = Math.max(...quoteTotals.map((x) => x.transit)) || 1;
      const scored = quoteTotals.map((x) => ({
        id: x.id,
        score: x.total / maxVal + x.transit / maxTransit,
      }));
      const minScore = Math.min(...scored.map((s) => s.score));
      bestValueId = scored.find((s) => s.score === minScore)?.id;
    }

    const now = new Date();
    quotes.forEach((q) => {
      if (q.validityDate) {
        const diffTime = new Date(q.validityDate) - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays <= 3) {
          expiringSoonIds.push(q.id);
        }
      }
    });
  }

  const getPartnerInitials = (name) => {
    if (!name) return "TP";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-800/40 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 z-50 w-full lg:w-[90vw] lg:max-w-[1800px] lg:min-w-[1400px] bg-slate-50 border-l border-slate-200 shadow-2xl flex flex-col transition-transform duration-300">
        {/* ================================================================================= */}
        {/* 1. DRAWER HEADER */}
        {/* ================================================================================= */}
        <div className="px-6 py-4 bg-white text-slate-900 border-b border-slate-200 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm shadow-md shadow-blue-600/30">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-base font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                  <span>Workspace:</span>
                  <span className="font-mono text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                    {details?.logistics?.logisticsNumber || "LOG/2026/000000"}
                  </span>
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 text-purple-700 border border-purple-200">
                  {details?.logistics?.mode || "Domestic"} Mode
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-700 border border-amber-200">
                  Normal Priority
                </span>
                {isReadOnly && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                    <Eye className="h-3 w-3" /> View Only
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-2">
                <span>Enquiry: <strong className="text-slate-700">{enquiry?.enquiryNo}</strong></span>
                <span>•</span>
                <span>Buyer: <strong className="text-slate-700">{enquiry?.partner?.entityName || "Standard Buyer"}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadDetails}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 border border-slate-200 transition-all cursor-pointer"
              title="Refresh Workspace"
            >
              <RotateCw className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 border border-slate-200 transition-all cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-slate-50">
            <Loader2 className="h-9 w-9 text-blue-600 animate-spin" />
            <span className="text-xs font-bold text-slate-500">
              Loading Transportation Command Center...
            </span>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* ================================================================================= */}
            {/* 2. HORIZONTAL VISUAL STEPPER */}
            {/* ================================================================================= */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 overflow-x-auto">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Shipment Execution Lifecycle Progress
                </h4>
                <span className="text-[10px] text-slate-400 font-medium italic">
                  {isReadOnly ? "Read-Only View" : "Click any stage to update status"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 min-w-[950px]">
                {STATUS_STEPS.map((step, idx) => {
                  const isActive = step === logisticsStatus;
                  const isCompleted = idx < currentStepIndex;

                  let nodeBg =
                    "bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200 hover:text-slate-700 hover:border-slate-300";
                  if (isActive)
                    nodeBg =
                      "bg-blue-600 text-white border-blue-600 ring-4 ring-blue-100 font-extrabold shadow-md shadow-blue-500/30";
                  else if (isCompleted)
                    nodeBg =
                      "bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-500/20 hover:bg-emerald-600";

                  return (
                    <React.Fragment key={step}>
                      <button
                        type="button"
                        onClick={() => handleStepClick(step)}
                        disabled={isReadOnly || savingStatus}
                        className={`flex flex-col items-center text-center space-y-1.5 shrink-0 group focus:outline-none transition-transform ${isReadOnly ? "cursor-default" : "cursor-pointer active:scale-95"} disabled:opacity-75`}
                        title={isReadOnly ? `Current status: ${step}` : `Click to mark status as "${step}"`}
                      >
                        <div
                          className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-extrabold border transition-all ${nodeBg}`}
                        >
                          {isCompleted ? <Check className="h-4 w-4" /> : idx + 1}
                        </div>
                        <span
                          className={`text-[11px] font-bold max-w-[100px] truncate transition-colors ${isActive
                            ? "text-blue-600 font-extrabold"
                            : isCompleted
                              ? "text-emerald-700 font-bold group-hover:text-emerald-800"
                              : "text-slate-400 group-hover:text-slate-700"
                            }`}
                        >
                          {step}
                        </span>
                      </button>

                      {idx < STATUS_STEPS.length - 1 && (
                        <div
                          className={`h-0.5 flex-1 rounded-full transition-all ${idx < currentStepIndex ? "bg-emerald-500" : "bg-slate-200"
                            }`}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* ================================================================================= */}
            {/* 3. MERGED COMPACT CARD: SHIPMENT SUMMARY & STATUS CONTROLS (Hide in View-Only) */}
            {/* ================================================================================= */}
            {!isReadOnly && (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-center">
                  {/* Left Side: Summary Meta Grid */}
                  <div className="xl:col-span-7 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                        <Layers className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-extrabold text-slate-900 uppercase tracking-tight">
                        Shipment Details
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-extrabold border border-slate-200">
                        {enquiry?.shipmentType || "FOB"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Origin</span>
                        <p className="font-extrabold text-slate-800 mt-0.5 truncate" title={enquiry?.originCity || enquiry?.originPort || "—"}>
                          📍 {enquiry?.originCity || enquiry?.originPort || "—"}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Destination</span>
                        <p className="font-extrabold text-slate-800 mt-0.5 truncate" title={enquiry?.destinationCity || enquiry?.destinationPort || "—"}>
                          🏁 {enquiry?.destinationCity || enquiry?.destinationPort || "—"}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Commodity</span>
                        <p className="font-extrabold text-slate-800 mt-0.5 truncate" title={enquiry?.product?.name || "—"}>
                          {enquiry?.product?.name || "—"}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Quantity</span>
                        <p className="font-extrabold text-slate-900 mt-0.5 tabular-nums">
                          {Number(enquiry?.quantity || 0).toLocaleString()} MT
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Mode & Status Controls */}
                  <div className="xl:col-span-5 flex flex-col justify-between space-y-3 xl:border-l xl:border-slate-100 xl:pl-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-900 uppercase tracking-tight flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-blue-600" /> Pipeline Settings
                      </span>
                      <button
                        onClick={handleUpdateHeader}
                        disabled={savingStatus}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-sm shadow-blue-500/20 cursor-pointer active:scale-95 transition-all disabled:opacity-50"
                      >
                        {savingStatus ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        )}
                        Save Settings
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Transport Mode
                        </label>
                        <select
                          value={transportMode}
                          onChange={(e) => setTransportMode(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 font-bold text-xs text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer"
                        >
                          <option value="Road">Road Logistics</option>
                          <option value="Sea">Sea Freight</option>
                          <option value="Rail">Rail Cargo</option>
                          <option value="Air">Air Express</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Logistics Status
                        </label>
                        <select
                          value={logisticsStatus}
                          onChange={(e) => setLogisticsStatus(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 font-bold text-xs text-slate-900 focus:outline-none focus:border-blue-600 cursor-pointer"
                        >
                          {STATUS_STEPS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================================================================================= */}
            {/* 4. TAB NAVIGATION & CONTENT PANELS */}
            {/* ================================================================================= */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="px-6 border-b border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  {[
                    { id: "quotes", label: "Freight Comparison Matrix", count: quotes.length },
                    { id: "docs", label: "Documents & Files", count: attachments.length },
                    { id: "timeline", label: "Operational Audit Logs" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 text-xs font-extrabold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${activeTab === tab.id
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-slate-500 hover:text-slate-900"
                        }`}
                    >
                      {tab.label}
                      {tab.count !== undefined && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* TAB PANELS */}
              <div className="p-6">
                {/* --------------------------------------------------------------------------------- */}
                {/* TAB 1: FREIGHT MATRIX */}
                {/* --------------------------------------------------------------------------------- */}
                {activeTab === "quotes" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-tight">
                          Freight Quote Evaluation Matrix
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          Compare logistics partner quotations by price, transit days, and expiration validity.
                        </p>
                      </div>

                      {!isReadOnly ? (
                        <div className="flex items-center gap-3">
                          {details?.shipmentId ? (
                            <span className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold flex items-center gap-2 text-xs">
                              <CheckCircle className="h-4 w-4 text-emerald-600" /> Shipment Generated
                            </span>
                          ) : !details?.salesContractId ? (
                            <span
                              className="px-4 py-2 bg-slate-100 text-slate-500 border border-slate-200 rounded-xl font-bold flex items-center gap-2 text-xs cursor-not-allowed select-none"
                              title="Sales Contract must be executed first."
                            >
                              <AlertTriangle className="h-4 w-4 text-amber-500" /> Waiting for Sales Contract
                            </span>
                          ) : (
                            <button
                              onClick={handleGenerateShipment}
                              disabled={!details?.logistics?.selectedFreightId}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl flex items-center gap-2 text-xs shadow-md shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all active:scale-95"
                            >
                              <FileCheck className="h-4 w-4" /> Generate Execution Shipment
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setSelectedQuote(null);
                              setIsModalOpen(true);
                            }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl flex items-center gap-2 text-xs shadow-sm shadow-blue-600/20 transition-all cursor-pointer active:scale-95"
                          >
                            <Plus className="h-4 w-4" /> Add Freight Quote
                          </button>
                        </div>
                      ) : details?.shipmentId ? (
                        <span className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold flex items-center gap-2 text-xs">
                          <CheckCircle className="h-4 w-4 text-emerald-600" /> Shipment Generated
                        </span>
                      ) : null}
                    </div>

                    {quotes.length > 0 ? (
                      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs text-slate-700 border-collapse">
                            <thead className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                              <tr>
                                <th className="px-4 py-3.5">Transport Partner</th>
                                <th className="px-4 py-3.5">Contact Person</th>
                                <th className="px-4 py-3.5">Equipment / Mode</th>
                                <th className="px-4 py-3.5 text-center">Transit</th>
                                <th className="px-4 py-3.5">Validity</th>
                                <th className="px-4 py-3.5 text-right">Freight Amount</th>
                                <th className="px-4 py-3.5 text-center">Preferred</th>
                                <th className="px-4 py-3.5 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                              {quotes.map((q) => {
                                const totalCost =
                                  Number(q.freightAmount) +
                                  Number(q.fuelCharges || 0) +
                                  Number(q.additionalCharges || 0);

                                const isPreferred = q.isPreferred;
                                const isLowest = q.id === lowestPriceId;
                                const isFastest = q.id === fastestTransitId;
                                const isBestValue = q.id === bestValueId;
                                const isExpiring = expiringSoonIds.includes(q.id);

                                const initials = getPartnerInitials(q.seller?.entityName);

                                return (
                                  <tr
                                    key={q.id}
                                    className={`transition-colors hover:bg-slate-50/80 ${isPreferred ? "bg-purple-50/30 font-semibold" : ""
                                      }`}
                                  >
                                    <td className="px-4 py-3.5">
                                      <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-extrabold text-[11px] flex items-center justify-center shrink-0 shadow-xs">
                                          {initials}
                                        </div>
                                        <div>
                                          <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                                            <span>{q.seller?.entityName || "Logistics Seller"}</span>
                                            {isPreferred && (
                                              <span className="px-1.5 py-0.2 rounded-md bg-purple-600 text-white text-[9px] font-extrabold flex items-center gap-0.5">
                                                <Star className="h-2.5 w-2.5 fill-white" /> Preferred
                                              </span>
                                            )}
                                          </div>
                                          <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
                                            <span className="font-mono text-slate-700">{q.quoteNumber}</span>
                                            <span>•</span>
                                            <span>v{q.version}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </td>

                                    <td className="px-4 py-3.5">
                                      <div>
                                        <div className="font-bold text-slate-800">
                                          {q.contactPerson || "—"}
                                        </div>
                                        <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                                          {q.contactNumber ? `📞 ${q.contactNumber}` : "—"}
                                        </div>
                                      </div>
                                    </td>

                                    <td className="px-4 py-3.5 font-bold text-slate-800">
                                      {transportMode === "Road" && (q.vehicleType || "Standard Truck")}
                                      {transportMode === "Sea" && `${q.shippingLine || "—"} (${q.containerType || "20 FT"})`}
                                      {transportMode !== "Road" && transportMode !== "Sea" && (q.vehicleType || "—")}
                                    </td>

                                    <td className="px-4 py-3.5 text-center">
                                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 font-extrabold text-xs">
                                        <Clock className="h-3 w-3 text-blue-600" /> {q.transitDays} Days
                                      </span>
                                    </td>

                                    <td className="px-4 py-3.5">
                                      <div className="font-bold text-slate-800">
                                        {q.validityDate
                                          ? new Date(q.validityDate).toLocaleDateString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                          })
                                          : "—"}
                                      </div>
                                      {isExpiring && (
                                        <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded mt-0.5">
                                          <AlertTriangle className="h-2.5 w-2.5 text-amber-600" /> Expiring Soon
                                        </span>
                                      )}
                                    </td>

                                    <td className="px-4 py-3.5 text-right">
                                      <div className="text-sm font-extrabold text-emerald-600 tabular-nums">
                                        {q.currency} {totalCost.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                      </div>
                                      <div className="flex items-center justify-end gap-1 mt-1">
                                        {isLowest && (
                                          <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 text-[9px] font-extrabold flex items-center gap-0.5">
                                            <Zap className="h-2.5 w-2.5 text-emerald-600" /> Lowest
                                          </span>
                                        )}
                                        {isFastest && (
                                          <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-800 border border-blue-300 text-[9px] font-extrabold flex items-center gap-0.5">
                                            <Clock className="h-2.5 w-2.5 text-blue-600" /> Fastest
                                          </span>
                                        )}
                                        {isBestValue && (
                                          <span className="px-1.5 py-0.2 rounded bg-purple-50 text-purple-800 border border-purple-300 text-[9px] font-extrabold flex items-center gap-0.5">
                                            <ShieldCheck className="h-2.5 w-2.5 text-purple-600" /> Best Value
                                          </span>
                                        )}
                                      </div>
                                    </td>

                                    <td className="px-4 py-3.5 text-center">
                                      <button
                                        onClick={() => !isReadOnly && handleSetPreferred(q.id)}
                                        disabled={isReadOnly}
                                        className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] transition-all inline-flex items-center gap-1.5 ${isPreferred
                                          ? "bg-purple-600 text-white shadow-sm"
                                          : isReadOnly
                                            ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                                            : "bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 cursor-pointer"
                                          }`}
                                      >
                                        <Star className={`h-3 w-3 ${isPreferred ? "fill-white" : ""}`} />
                                        {isPreferred ? "Selected" : "Select"}
                                      </button>
                                    </td>

                                    <td className="px-4 py-3.5 text-right">
                                      <div className="flex items-center justify-end gap-1">
                                        {isReadOnly ? (
                                          <button
                                            onClick={() => {
                                              setSelectedQuote(q);
                                              setIsModalOpen(true);
                                            }}
                                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                            title="View Quote Details"
                                          >
                                            <Eye className="h-3.5 w-3.5" />
                                          </button>
                                        ) : (
                                          <>
                                            <button
                                              onClick={() => {
                                                setSelectedQuote(q);
                                                setIsModalOpen(true);
                                              }}
                                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                              title="Revise Quote"
                                            >
                                              <Edit2 className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                              disabled={isPreferred}
                                              onClick={() => handleDeleteQuote(q.id)}
                                              className={`p-1.5 rounded-lg transition-colors ${isPreferred
                                                ? "text-slate-300 cursor-not-allowed"
                                                : "text-slate-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                                                }`}
                                              title={isPreferred ? "Cannot delete preferred quote" : "Delete"}
                                            >
                                              <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-white border border-slate-200/80 rounded-2xl p-6 text-slate-400 space-y-2">
                        <p className="text-xs font-bold text-slate-500">No freight quotes added yet.</p>
                        <p className="text-[11px] text-slate-400">Click "Add Freight Quote" above to enter quotations from transport partners.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* --------------------------------------------------------------------------------- */}
                {/* TAB 2: DOCUMENTS */}
                {/* --------------------------------------------------------------------------------- */}
                {activeTab === "docs" && (
                  <div className="space-y-6">
                    {!isReadOnly && (
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
                            <UploadCloud className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-extrabold text-slate-900 uppercase">
                              Upload Transportation Document
                            </h4>
                            <p className="text-[11px] text-slate-500 font-medium">
                              Attach rate quotes, PODs, LR copies, or booking confirmations.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                          <select
                            value={uploadCategory}
                            onChange={(e) => setUploadCategory(e.target.value)}
                            className="px-3.5 py-2 border border-slate-200 rounded-xl bg-white font-bold text-xs text-slate-800 focus:outline-none cursor-pointer shadow-sm"
                          >
                            {DOC_CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>

                          <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md shadow-blue-500/20 active:scale-95 transition-all">
                            {uploading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Paperclip className="h-4 w-4" />
                            )}
                            Choose File & Upload
                            <input
                              type="file"
                              className="hidden"
                              onChange={handleUploadFile}
                              disabled={uploading}
                            />
                          </label>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {attachments.map((att) => (
                        <div
                          key={att.id}
                          className="border border-slate-200 hover:border-slate-300 bg-white rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
                                <FileText className="h-5 w-5" />
                              </div>
                              <div className="overflow-hidden">
                                <h5 className="font-extrabold text-slate-900 text-xs truncate" title={att.fileName}>
                                  {att.fileName}
                                </h5>
                                <span className="inline-block px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 font-bold text-[9px] mt-1">
                                  {att.category || "General"}
                                </span>
                              </div>
                            </div>

                            {!isReadOnly && (
                              <button
                                onClick={() => handleDeleteAttachment(att.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer opacity-80 group-hover:opacity-100"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                            <span>{(att.fileSize / 1024).toFixed(1)} KB</span>
                            <span>{new Date(att.createdAt).toLocaleDateString()}</span>
                            <a
                              href={`${axiosClient.defaults.baseURL}${att.downloadUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 font-extrabold text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 rounded-xl flex items-center gap-1 transition-colors"
                            >
                              <Download className="h-3 w-3" /> Download
                            </a>
                          </div>
                        </div>
                      ))}

                      {attachments.length === 0 && (
                        <div className="col-span-full py-16 border-2 border-dashed border-slate-200 rounded-2xl text-center bg-slate-50 space-y-2">
                          <FileText className="h-8 w-8 text-slate-400 mx-auto" />
                          <h4 className="text-xs font-extrabold text-slate-700">No Documents Uploaded</h4>
                          <p className="text-[11px] text-slate-500 font-medium">
                            Select a category above and upload quotation PDFs, LR copies, or rate sheets.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* --------------------------------------------------------------------------------- */}
                {/* TAB 3: TIMELINE */}
                {/* --------------------------------------------------------------------------------- */}
                {activeTab === "timeline" && (
                  <VirtualizedAuditLogTimeline
                    activities={activities}
                    isLoading={loadingActivities}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal & Sub-drawer */}
        <AddFreightQuoteModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedQuote(null);
          }}
          onSave={handleSaveQuote}
          quote={selectedQuote}
          transportMode={transportMode}
          mode={details?.logistics?.mode || "Domestic"}
          onOpenCreatePartner={handleOpenCreatePartner}
          onOpenAddContact={handleOpenAddContact}
          autoSelectPartner={autoSelectPartner}
          isReadOnly={isReadOnly}
        />

        <PartnerDrawer
          isOpen={isPartnerDrawerOpen}
          onClose={() => setIsPartnerDrawerOpen(false)}
          onSubmit={handleSavePartnerDrawer}
          editData={partnerEditData}
          isSaving={savingPartner}
          error={partnerDrawerError}
          isEditMode={true}
          initialTab={partnerInitialTab}
          partnerRoles={partnerRoles}
        />
      </div>
    </>
  );
}