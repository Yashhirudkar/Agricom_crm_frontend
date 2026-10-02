"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  Search,
  Filter,
  Tag,
  FolderPlus,
} from "lucide-react";
import { toast } from "sonner";
import { logisticsApi } from "../services/logisticsApi";
import AddFreightQuoteModal from "./AddFreightQuoteModal";
import PartnerDrawer from "@/components/masters/partners/PartnerDrawer";
import VirtualizedAuditLogTimeline from "./VirtualizedAuditLogTimeline";
import axiosClient from "@/lib/axios";
import { resolvePhone } from "@/lib/contactUtils";
import { useSelector } from "react-redux";
import { selectActiveCompany } from "@/store/slices/companyContextSlice";

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

const DEFAULT_DOC_CATEGORIES = [
  "Freight Quotation",
  "Rate Sheet",
  "Booking Confirmation",
  "Invoice",
  "LR Copy",
  "POD",
  "Other",
];

export default function TransportDrawer({ isOpen, onClose, enquiry, isReadOnly = false }) {
  const company = useSelector(selectActiveCompany);
  const companyCountry = company?.country;

  const [activeTab, setActiveTab] = useState("quotes");
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);

  // Quote modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);

  // Attachments & Custom Document Categories
  const [attachments, setAttachments] = useState([]);
  const [uploadCategory, setUploadCategory] = useState("Freight Quotation");
  const [uploading, setUploading] = useState(false);

  const [docCategories, setDocCategories] = useState(() => {
    try {
      const saved = localStorage.getItem("agricom_custom_doc_categories");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return Array.from(new Set([...DEFAULT_DOC_CATEGORIES, ...parsed]));
        }
      }
    } catch (e) { }
    return DEFAULT_DOC_CATEGORIES;
  });

  const [isAddingDocCategory, setIsAddingDocCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Search & Category Filter for Documents tab
  const [docSearchQuery, setDocSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Route Selection
  const [selectedRoute, setSelectedRoute] = useState(null);

  const availableRoutes = useMemo(() => {
    if (!details?.logistics?.routes || details.logistics.routes.length === 0) {
      return [{ id: "all", origin: "—", destination: "—", label: "— → —" }];
    }
    
    return details.logistics.routes.map(r => ({
      id: r.id,
      origin: r.origin,
      destination: r.destination,
      label: `${r.origin} → ${r.destination}`
    }));
  }, [details]);

  useEffect(() => {
    if (availableRoutes.length > 0 && (!selectedRoute || !availableRoutes.find(r => r.id === selectedRoute.id))) {
      setSelectedRoute(availableRoutes[0]);
    }
  }, [availableRoutes, selectedRoute]);

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
      setSelectedRoute(null);
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

  // Add Custom Document Category
  const handleAddCustomCategory = () => {
    if (!newCategoryName || !newCategoryName.trim()) return;
    const trimmed = newCategoryName.trim();
    if (!docCategories.includes(trimmed)) {
      const updated = [...docCategories, trimmed];
      setDocCategories(updated);
      try {
        const customOnly = updated.filter((c) => !DEFAULT_DOC_CATEGORIES.includes(c));
        localStorage.setItem("agricom_custom_doc_categories", JSON.stringify(customOnly));
      } catch (e) { }
      toast.success(`Added document category "${trimmed}"`);
    }
    setUploadCategory(trimmed);
    setNewCategoryName("");
    setIsAddingDocCategory(false);
  };

  // Upload Document(s) - Supports Single/Multiple files & Drag-and-Drop
  const handleUploadFiles = async (files) => {
    if (isReadOnly || !files || files.length === 0 || !details?.logistics?.id) return;

    const fileList = Array.from(files);
    setUploading(true);
    let successCount = 0;
    try {
      for (const file of fileList) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", uploadCategory);

        await logisticsApi.uploadAttachment(details.logistics.id, formData);
        successCount++;
      }
      if (successCount === 1) {
        toast.success("Document uploaded successfully.");
      } else {
        toast.success(`${successCount} documents uploaded successfully.`);
      }
      loadAttachments();
    } catch (err) {
      toast.error("Failed to upload document(s).");
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e) => {
    handleUploadFiles(e.target.files);
    e.target.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isReadOnly) setIsDraggingOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (!isReadOnly && e.dataTransfer?.files?.length > 0) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  const parseAttachmentMeta = useCallback((att) => {
    const rawName = att.fileName || "";
    let displayCat = att.category || "General";
    let displayName = rawName;

    const dashIdx = rawName.indexOf(" - ");
    if (dashIdx > 0 && dashIdx < 40) {
      const possibleCat = rawName.substring(0, dashIdx).trim();
      const possibleName = rawName.substring(dashIdx + 3).trim();
      if (possibleCat && possibleName) {
        displayCat = possibleCat;
        displayName = possibleName;
      }
    }
    return { displayCat, displayName };
  }, []);

  const filteredAttachments = useMemo(() => {
    return attachments.filter((att) => {
      const { displayCat, displayName } = parseAttachmentMeta(att);
      const matchesSearch =
        !docSearchQuery ||
        displayName.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
        displayCat.toLowerCase().includes(docSearchQuery.toLowerCase());
      const matchesCategory =
        selectedCategoryFilter === "All" ||
        displayCat.toLowerCase() === selectedCategoryFilter.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [attachments, docSearchQuery, selectedCategoryFilter, parseAttachmentMeta]);

  const activeAttachmentCategories = useMemo(() => {
    const set = new Set();
    attachments.forEach((att) => {
      const { displayCat } = parseAttachmentMeta(att);
      if (displayCat) set.add(displayCat);
    });
    return Array.from(set);
  }, [attachments, parseAttachmentMeta]);

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
  const quotes = details?.logistics?.quotes?.filter(q => selectedRoute?.id === 'all' || q.routeId === selectedRoute?.id || (!q.routeId && availableRoutes.length === 1)) || [];
  const expiringSoonIds = [];

  if (quotes.length > 0) {

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

  const getDisplayMode = () => {
    if (!enquiry) return details?.logistics?.mode || "Domestic";
    const origin = enquiry.originCountryId;
    const destination = enquiry.destinationCountry;

    if (origin && destination && companyCountry) {
      const isOriginDomestic = origin === companyCountry;
      const isDestinationDomestic = destination === companyCountry;
      if (isOriginDomestic && isDestinationDomestic) return "Domestic";
      if (isOriginDomestic && !isDestinationDomestic) return "Export";
      if (!isOriginDomestic && !isDestinationDomestic) return "Merchant Export";
    }
    return details?.logistics?.mode || "Domestic";
  };
  const displayMode = getDisplayMode();

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
                  {displayMode} Mode
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
            {/* 2. MINIMAL PROGRESS BAR & PREMIUM ROUTE BOARD */}
            {/* ================================================================================= */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex items-center gap-2 overflow-x-auto no-scrollbar">
              {STATUS_STEPS.map((step, idx) => {
                const isActive = step === logisticsStatus;
                const isCompleted = idx < currentStepIndex;
                
                return (
                  <div key={step} onClick={() => !isReadOnly && !savingStatus && handleStepClick(step)} className={`flex items-center shrink-0 ${isReadOnly ? '' : 'cursor-pointer'}`}>
                    <div className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all border ${
                      isActive ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' : 
                      isCompleted ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 
                      'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                    }`}>
                      {isCompleted && <Check className="w-3 h-3 inline-block mr-1" />}
                      {step}
                    </div>
                    {idx < STATUS_STEPS.length - 1 && (
                      <div className={`w-6 h-px mx-1.5 ${isCompleted ? 'bg-emerald-300' : 'bg-slate-200'}`} />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex flex-col xl:flex-row gap-6">
              {/* Left Side: Route Details */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                      <MapPin className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest">Active Route</span>
                  </div>
                  <div className="flex-1 max-w-sm relative">
                    <select
                      value={selectedRoute?.id || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "all") {
                          setSelectedRoute(availableRoutes.find(r => r.id === "all"));
                        } else {
                          const r = availableRoutes.find(ar => ar.id === Number(val));
                          if (r) setSelectedRoute(r);
                        }
                      }}
                      className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer transition-all truncate"
                    >
                      {availableRoutes.map((r, i) => (
                        <option key={r.id || i} value={r.id}>{r.label}</option>
                      ))}
                    </select>
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center pl-2">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Loading Point</p>
                    <p className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5 truncate">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" /> {selectedRoute ? selectedRoute.origin : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Destination</p>
                    <p className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5 truncate">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" /> {selectedRoute ? selectedRoute.destination : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Commodity</p>
                    <p className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5 truncate">
                      <Package className="h-3.5 w-3.5 text-slate-400 shrink-0" /> {enquiry?.product?.name || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Quantity</p>
                    <p className="font-extrabold text-xs text-slate-800 tabular-nums">{Number(enquiry?.quantity || 0).toLocaleString()} MT</p>
                  </div>
                </div>
              </div>

              {/* Right Side: Pipeline Control */}
              {!isReadOnly && (
                <div className="xl:w-[400px] xl:border-l xl:border-slate-100 xl:pl-6 flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Zap className="h-3 w-3 text-blue-600" /> Pipeline Control
                    </h4>
                    <button
                      onClick={handleUpdateHeader}
                      disabled={savingStatus}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-lg text-[10px] flex items-center justify-center gap-1.5 shadow-sm shadow-blue-500/20 cursor-pointer active:scale-95 transition-all disabled:opacity-50"
                    >
                      {savingStatus ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-3 w-3" />
                      )}
                      Apply
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <Truck className="h-3.5 w-3.5" />
                      </div>
                      <select
                        value={transportMode}
                        onChange={(e) => setTransportMode(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-bold text-xs text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer transition-all hover:bg-slate-100 appearance-none truncate"
                      >
                        <option value="Road">Road</option>
                        <option value="Sea">Sea</option>
                        <option value="Rail">Rail</option>
                        <option value="Air">Air</option>
                      </select>
                    </div>

                    <div className="flex-1 relative">
                      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                      <select
                        value={logisticsStatus}
                        onChange={(e) => setLogisticsStatus(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 font-bold text-xs text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer transition-all hover:bg-slate-100 appearance-none truncate"
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
              )}
            </div>

            {/* ================================================================================= */}
            {/* 4. TAB NAVIGATION & CONTENT PANELS */}
            {/* ================================================================================= */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col h-full">
              <div className="p-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2 bg-slate-200/60 p-1.5 rounded-xl border border-slate-300/30">
                  {[
                    { id: "quotes", label: "Freight Matrix", icon: <Package className="h-3.5 w-3.5" />, count: quotes.length },
                    { id: "docs", label: "Documents", icon: <Paperclip className="h-3.5 w-3.5" />, count: attachments.length },
                    ...(!isReadOnly ? [{ id: "timeline", label: "Audit Logs", icon: <Clock className="h-3.5 w-3.5" /> }] : []),
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 rounded-lg ${activeTab === tab.id
                        ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-900/5"
                        : "text-slate-500 hover:text-slate-700 hover:bg-white/40"
                        }`}
                    >
                      {tab.icon}
                      {tab.label}
                      {tab.count !== undefined && (
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-300 text-slate-600'}`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* TAB PANELS */}
              <div className="p-4">
                {/* --------------------------------------------------------------------------------- */}
                {/* TAB 1: FREIGHT MATRIX */}
                {/* --------------------------------------------------------------------------------- */}
                {activeTab === "quotes" && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-tight">
                          Freight Quote Evaluation Matrix
                        </h3>
                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">
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
                            <thead className="bg-slate-50/80 border-b border-slate-200 text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">
                              <tr>
                                <th className="px-3 py-2.5">Transport Partner</th>
                                <th className="px-3 py-2.5">Contact Person</th>
                                <th className="px-3 py-2.5">Equipment / Mode</th>
                                <th className="px-3 py-2.5 text-center">Transit</th>
                                <th className="px-3 py-2.5">Validity</th>
                                <th className="px-3 py-2.5 text-right">Freight Amount</th>
                                <th className="px-3 py-2.5 text-center">Preferred</th>
                                <th className="px-3 py-2.5 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                              {quotes.map((q) => {
                                const totalCost =
                                  Number(q.freightAmount) +
                                  Number(q.fuelCharges || 0) +
                                  Number(q.additionalCharges || 0);

                                const isPreferred = q.isPreferred;
                                const isExpiring = expiringSoonIds.includes(q.id);

                                const initials = getPartnerInitials(q.seller?.entityName);

                                return (
                                  <tr
                                    key={q.id}
                                    className={`transition-colors hover:bg-slate-50/80 ${isPreferred ? "bg-purple-50/30 font-semibold" : ""
                                      }`}
                                  >
                                    <td className="px-3 py-2">
                                      <div className="flex items-center gap-3">
                                        <div className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-extrabold text-[10px] flex items-center justify-center shrink-0 shadow-xs">
                                          {initials}
                                        </div>
                                        <div>
                                          <div className="font-extrabold text-slate-900 flex items-center gap-1.5 text-xs">
                                            <span>{q.seller?.entityName || "Logistics Seller"}</span>
                                            {isPreferred && (
                                              <span className="px-1.5 py-0.2 rounded bg-purple-600 text-white text-[9px] font-extrabold flex items-center gap-0.5">
                                                <Star className="h-2 w-2 fill-white" /> Preferred
                                              </span>
                                            )}
                                          </div>
                                          <div className="text-[9px] text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
                                            <span className="font-mono text-slate-700">{q.quoteNumber}</span>
                                            <span>•</span>
                                            <span>v{q.version}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </td>

                                    <td className="px-3 py-2">
                                      <div>
                                        <div className="font-bold text-slate-800 text-[11px]">
                                          {q.contactPerson || "—"}
                                        </div>
                                        <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                                          {q.contactNumber ? `📞 ${q.contactNumber}` : "—"}
                                        </div>
                                      </div>
                                    </td>

                                    <td className="px-3 py-2 font-bold text-slate-800 text-[11px]">
                                      {(() => {
                                        const modeNorm = (transportMode || "").toLowerCase();
                                        if (modeNorm === "road") {
                                          const type = q.truckType || q.vehicleType || "Standard Truck";
                                          const cap = q.truckCapacity;
                                          return cap ? `${type} (${cap})` : type;
                                        }
                                        if (modeNorm === "sea") {
                                          const line = q.shippingLine ? `${q.shippingLine} • ` : "";
                                          const type = q.containerType || "Container";
                                          const size = q.containerSize ? ` (${q.containerSize})` : "";
                                          return `${line}${type}${size}`;
                                        }
                                        if (modeNorm === "rail") {
                                          const type = q.wagonType || q.vehicleType || "Wagon";
                                          const cap = q.wagonCapacity;
                                          return cap ? `${type} (${cap})` : type;
                                        }
                                        return q.vehicleType || "—";
                                      })()}
                                    </td>

                                    <td className="px-3 py-2 text-center">
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800 font-extrabold text-[10px]">
                                        <Clock className="h-3 w-3 text-blue-600" /> {q.transitDays} Days
                                      </span>
                                    </td>

                                    <td className="px-3 py-2">
                                      <div className="font-bold text-slate-800 text-[11px]">
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

                                    <td className="px-3 py-2 text-right">
                                      <div className="text-sm font-extrabold text-emerald-600 tabular-nums">
                                        {q.currency} {totalCost.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                      </div>

                                      {Array.isArray(q.charges) && q.charges.length > 0 && (
                                        <div className="text-[9px] text-slate-500 font-medium mt-1 space-y-0.5 text-right bg-slate-50/80 p-1.5 rounded-lg border border-slate-100">
                                          {q.charges.map((c, idx) => (
                                            <div key={c.id || idx} className="flex items-center justify-end gap-1.5">
                                              <span className="text-slate-500 truncate max-w-[130px]">{c.chargeName}:</span>
                                              <span className="font-mono font-bold text-slate-800">{q.currency} {Number(c.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                                            </div>
                                          ))}
                                        </div>
                                      )}


                                    </td>

                                    <td className="px-3 py-2 text-center">
                                      <button
                                        onClick={() => !isReadOnly && handleSetPreferred(q.id)}
                                        disabled={isReadOnly}
                                        className={`px-2 py-1 rounded-lg font-extrabold text-[10px] transition-all inline-flex items-center gap-1.5 ${isPreferred
                                          ? "bg-purple-600 text-white shadow-sm"
                                          : isReadOnly
                                            ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                                            : "bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 cursor-pointer"
                                          }`}
                                      >
                                        <Star className={`h-2.5 w-2.5 ${isPreferred ? "fill-white" : ""}`} />
                                        {isPreferred ? "Selected" : "Select"}
                                      </button>
                                    </td>

                                    <td className="px-3 py-2 text-right">
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
                    {/* UPLOAD & CATEGORY SELECTION HEADER CARD */}
                    {!isReadOnly && (
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border rounded-2xl p-5 transition-all shadow-xs ${isDraggingOver
                          ? "bg-blue-50/90 border-blue-500 border-dashed ring-4 ring-blue-100"
                          : "bg-slate-50 border-slate-200"
                          }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/20">
                              <UploadCloud className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-tight">
                                Upload Transportation Document
                              </h4>
                              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                Attach rate quotes, PODs, LR copies, booking confirmations, or custom documents.
                              </p>
                            </div>
                          </div>

                          {/* CATEGORY & UPLOAD CONTROLS */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-1.5">
                              <select
                                value={uploadCategory}
                                onChange={(e) => {
                                  if (e.target.value === "__ADD_NEW_CAT__") {
                                    setIsAddingDocCategory(true);
                                  } else {
                                    setUploadCategory(e.target.value);
                                  }
                                }}
                                className="px-3.5 py-2 border border-slate-200 rounded-xl bg-white font-bold text-xs text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer shadow-2xs"
                              >
                                {docCategories.map((cat) => (
                                  <option key={cat} value={cat}>
                                    {cat}
                                  </option>
                                ))}
                                <option value="__ADD_NEW_CAT__" className="font-extrabold text-blue-600 bg-blue-50">
                                  + Add Custom Category...
                                </option>
                              </select>

                            </div>

                            <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md shadow-blue-600/20 active:scale-95 transition-all">
                              {uploading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Paperclip className="h-4 w-4" />
                              )}
                              Choose Files & Upload
                              <input
                                type="file"
                                multiple
                                className="hidden"
                                onChange={handleFileInputChange}
                                disabled={uploading}
                              />
                            </label>
                          </div>
                        </div>

                        {/* INLINE CUSTOM CATEGORY INPUT FORM */}
                        {isAddingDocCategory && (
                          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-2 animate-in fade-in duration-150 max-w-lg">
                            <input
                              type="text"
                              value={newCategoryName}
                              onChange={(e) => setNewCategoryName(e.target.value)}
                              placeholder="Enter custom category name (e.g. Packing List, Duty Bill)..."
                              className="flex-1 px-3 py-1.5 border border-blue-500 rounded-xl text-xs font-bold text-slate-900 bg-white focus:outline-none shadow-xs"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddCustomCategory();
                                }
                                if (e.key === "Escape") {
                                  setIsAddingDocCategory(false);
                                  setNewCategoryName("");
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={handleAddCustomCategory}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 shadow-xs cursor-pointer"
                            >
                              <Check className="h-3.5 w-3.5" /> Add
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsAddingDocCategory(false);
                                setNewCategoryName("");
                              }}
                              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                            >
                              <X className="h-3.5 w-3.5" /> Cancel
                            </button>
                          </div>
                        )}

                        {/* DRAG AND DROP HINT */}
                        <div className="mt-3 text-center text-[10px] text-slate-400 font-semibold flex items-center justify-center gap-1.5">
                          <UploadCloud className="h-3.5 w-3.5 text-blue-500" />
                          <span>Tip: You can drag and drop multiple files directly into this area to upload.</span>
                        </div>
                      </div>
                    )}

                    {/* SEARCH & CATEGORY FILTER PILLS BAR */}
                    {attachments.length > 0 && (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-xs">
                          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={docSearchQuery}
                            onChange={(e) => setDocSearchQuery(e.target.value)}
                            placeholder="Search documents..."
                            className="w-full pl-8 pr-3 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-slate-800"
                          />
                          {docSearchQuery && (
                            <button
                              onClick={() => setDocSearchQuery("")}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>

                        {/* Category Filter Pills */}
                        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-full scrollbar-none">
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
                            <Filter className="h-3 w-3" /> Filter:
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedCategoryFilter("All")}
                            className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer ${selectedCategoryFilter === "All"
                              ? "bg-blue-600 text-white shadow-2xs"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                              }`}
                          >
                            All ({attachments.length})
                          </button>

                          {activeAttachmentCategories.map((cat) => {
                            const count = attachments.filter((att) => {
                              const { displayCat } = parseAttachmentMeta(att);
                              return displayCat.toLowerCase() === cat.toLowerCase();
                            }).length;
                            const isSel = selectedCategoryFilter.toLowerCase() === cat.toLowerCase();

                            return (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => setSelectedCategoryFilter(cat)}
                                className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer whitespace-nowrap ${isSel
                                  ? "bg-blue-600 text-white shadow-2xs"
                                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                                  }`}
                              >
                                {cat} ({count})
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* DOCUMENT CARDS GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredAttachments.map((att) => {
                        const { displayCat, displayName } = parseAttachmentMeta(att);

                        return (
                          <div
                            key={att.id}
                            className="border border-slate-200 hover:border-slate-300 bg-white rounded-2xl p-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0 shadow-2xs">
                                  <FileText className="h-5 w-5" />
                                </div>
                                <div className="overflow-hidden">
                                  <h5 className="font-extrabold text-slate-900 text-xs truncate" title={displayName}>
                                    {displayName}
                                  </h5>
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 font-extrabold text-[9px] mt-1">
                                    <Tag className="h-2.5 w-2.5 text-blue-600" />
                                    {displayCat}
                                  </span>
                                </div>
                              </div>

                              {!isReadOnly && (
                                <button
                                  onClick={() => handleDeleteAttachment(att.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer opacity-80 group-hover:opacity-100"
                                  title="Delete Document"
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
                        );
                      })}

                      {attachments.length > 0 && filteredAttachments.length === 0 && (
                        <div className="col-span-full py-12 border border-dashed border-slate-200 rounded-2xl text-center bg-slate-50 space-y-2">
                          <Search className="h-7 w-7 text-slate-400 mx-auto" />
                          <h4 className="text-xs font-extrabold text-slate-700">No matching documents found</h4>
                          <p className="text-[11px] text-slate-500 font-medium">
                            Try adjusting your search query or category filter.
                          </p>
                        </div>
                      )}

                      {attachments.length === 0 && (
                        <div
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          className={`col-span-full py-16 border-2 border-dashed rounded-2xl text-center transition-all ${isDraggingOver
                            ? "bg-blue-50 border-blue-500 ring-4 ring-blue-100"
                            : "bg-slate-50 border-slate-200"
                            } space-y-2`}
                        >
                          <FileText className="h-8 w-8 text-slate-400 mx-auto" />
                          <h4 className="text-xs font-extrabold text-slate-700">No Documents Uploaded</h4>
                          <p className="text-[11px] text-slate-500 font-medium max-w-sm mx-auto">
                            Select or create a document category above and upload quotation PDFs, LR copies, or rate sheets.
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
          selectedRoute={selectedRoute}
          lastQuote={quotes && quotes.length > 0 ? quotes[0] : null}
          transportMode={transportMode}
          mode={displayMode}
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