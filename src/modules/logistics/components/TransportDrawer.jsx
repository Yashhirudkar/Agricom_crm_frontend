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
  ChevronDown,
  ChevronRight,
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
  const [collapsedRoutes, setCollapsedRoutes] = useState(new Set());
  
  const toggleRouteCollapse = (routeId) => {
    setCollapsedRoutes(prev => {
      const next = new Set(prev);
      if (next.has(routeId)) next.delete(routeId);
      else next.add(routeId);
      return next;
    });
  };

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

      <div className="fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-slate-200 bg-slate-50 shadow-2xl transition-transform duration-300 lg:w-[96vw] lg:max-w-[1600px]">
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
          <div className="flex-1 flex flex-col min-h-0 p-3 sm:p-4 lg:p-5 gap-5">
            {/* ================================================================================= */}
            {/* 2. MINIMAL PROGRESS BAR & PREMIUM ROUTE BOARD */}
            {/* ================================================================================= */}
            <div className="shrink-0 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex items-center gap-2 overflow-x-auto no-scrollbar">
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

            <div className="shrink-0 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex flex-col xl:flex-row gap-6">
              {/* Left Side: Route Details */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                        <MapPin className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest whitespace-nowrap">Active Route</span>
                    </div>

                    <div className="flex items-center gap-2 flex-1 w-full max-w-xl">
                      {/* From */}
                      <div className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 truncate" title={Array.from(new Set(availableRoutes.filter(r => r.origin !== "—").map(r => r.origin))).join(", ") || "—"}>
                        {Array.from(new Set(availableRoutes.filter(r => r.origin !== "—").map(r => r.origin))).join(", ") || "—"}
                      </div>

                      <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />

                      {/* To */}
                      <div className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 truncate" title={Array.from(new Set(availableRoutes.filter(r => r.destination !== "—").map(r => r.destination))).join(", ") || "—"}>
                        {Array.from(new Set(availableRoutes.filter(r => r.destination !== "—").map(r => r.destination))).join(", ") || "—"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center pl-2">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">From</p>
                    <p className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5 truncate">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" /> {selectedRoute ? selectedRoute.origin : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">To</p>
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
            {/* 4. FREIGHT MATRIX CONTENT */}
            {/* ================================================================================= */}
            <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
              <div className="p-4 flex-1 overflow-y-auto">
                <div className="space-y-5">
                    {(() => {
                      const routesToRender = availableRoutes.filter(r => r.id !== 'all');
                      const routesArray = routesToRender.length > 0 ? routesToRender : [{ id: 'all', origin: '—', destination: '—' }];
                      
                      return routesArray.map((route, rIdx) => {
                        const routeQuotes = details?.logistics?.quotes?.filter(q => route.id === 'all' || q.routeId === route.id || (!q.routeId && routesArray.length === 1)) || [];
                        const isExpiring = expiringSoonIds; // Required for table below
                        const isCollapsed = collapsedRoutes.has(route.id);
                        
                        return (
                          <div key={route.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                            <div className={`flex flex-col gap-4 p-4 transition-colors sm:flex-row sm:items-center sm:justify-between ${
                              isCollapsed ? "hover:bg-slate-50" : "border-b border-slate-100 bg-slate-50/50"
                            }`}>
                              <button
                                type="button"
                                onClick={() => toggleRouteCollapse(route.id)}
                                aria-expanded={!isCollapsed}
                                className="flex min-w-0 flex-1 cursor-pointer select-none items-center gap-3 rounded-lg text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                              >
                                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                                  isCollapsed ? "bg-blue-50 text-blue-600 hover:bg-blue-100" : "text-slate-500 hover:bg-slate-200"
                                }`}>
                                  {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                </span>
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center">
                                  <MapPin className="h-4 w-4 text-blue-600" />
                                </span>
                                <span className="flex min-w-0 flex-wrap items-center gap-2">
                                  <span className="text-sm font-semibold text-slate-800">{route.origin}</span>
                                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
                                  <span className="text-sm font-semibold text-slate-800">{route.destination}</span>
                                </span>
                                <span className="ml-2 w-fit shrink-0 rounded-full border border-blue-200 bg-white px-2.5 py-1 text-[10px] font-extrabold text-blue-700">
                                  {routeQuotes.length} {routeQuotes.length === 1 ? "Quote" : "Quotes"}
                                </span>
                              </button>

                              {!isReadOnly && (
                                <div className="flex flex-wrap items-center gap-3">
                                  {rIdx === 0 && (
                                    <>
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
                                    </>
                                  )}

                                  <button
                                    onClick={() => {
                                      setSelectedQuote(null);
                                      if (route.id !== 'all') {
                                        setSelectedRoute(availableRoutes.find(r => r.id === route.id));
                                      } else {
                                        setSelectedRoute(availableRoutes[0]);
                                      }
                                      setIsModalOpen(true);
                                    }}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl flex items-center gap-2 text-xs shadow-sm shadow-blue-600/20 transition-all cursor-pointer active:scale-95"
                                  >
                                    <Plus className="h-4 w-4" /> Add Freight Quote
                                  </button>
                                </div>
                              )}
                            </div>

                            {!isCollapsed && (
                              <div className="bg-slate-50/30 p-4">
                                {routeQuotes.length > 0 ? (
                                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
                                  <div className="overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400">
                                    <table className="w-full text-left text-xs text-slate-700 border-collapse">
                                      <thead className="bg-slate-50/80 border-b border-slate-200 text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">
                                        <tr>
                                          <th className="px-3 py-2.5">Transport Partner</th>
                                          <th className="px-3 py-2.5">Contact Person</th>
                                          <th className="px-3 py-2.5 text-center">Transit</th>
                                          <th className="px-3 py-2.5">Validity</th>
                                          {(() => {
                                              const tMode = (transportMode || "").toLowerCase();
                                              if (tMode === "sea") {
                                                return (
                                                  <>
                                                    <th className="px-3 py-2.5 text-right min-w-[140px]">20 FT Freight Amount</th>
                                                    <th className="px-3 py-2.5 text-right min-w-[140px]">40 FT Freight Amount</th>
                                                  </>
                                                );
                                              }
                                              let title = "Vehicle Rates";
                                              if (tMode === "air") title = "Air Rates";
                                              if (tMode === "rail") title = "Rail Rates";
                                              return <th className="px-3 py-2.5 text-right">{title}</th>;
                                            })()}
                                          <th className="px-3 py-2.5 text-center">Preferred</th>
                                          <th className="px-3 py-2.5 text-right">Actions</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-100 font-medium">
                                        {routeQuotes.map((q) => {
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
                                            {q.contactPerson || "N/A"}
                                          </div>
                                          <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                                            {q.contactNumber ? `📞 ${q.contactNumber}` : "N/A"}
                                          </div>
                                        </div>
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
                                            : "N/A"}
                                        </div>
                                        {isExpiring && (
                                          <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded mt-0.5">
                                            <AlertTriangle className="h-2.5 w-2.5 text-amber-600" /> Expiring Soon
                                          </span>
                                        )}
                                      </td>

                                      {(() => {
                                        const tMode = (transportMode || "").toLowerCase();

                                        if (tMode === "sea") {
                                          const rates20 = Array.isArray(q.containerRates) ? q.containerRates.filter(cr => (cr.containerSize || "").includes("20")) : [];
                                          const rates40 = Array.isArray(q.containerRates) ? q.containerRates.filter(cr => (cr.containerSize || "").includes("40")) : [];
                                          
                                          return (
                                            <>
                                              <td className="px-3 py-2 align-top text-right min-w-[140px]">
                                                {rates20.length === 0 ? (
                                                  <div className="text-slate-400 font-extrabold text-[10px] mt-2 mr-4">N/A</div>
                                                ) : (
                                                  <div className="flex flex-col gap-2 items-end">
                                                    {rates20.map((cr, idx) => (
                                                      <div key={cr.id || idx} className="flex flex-col items-start bg-white border border-slate-200/80 p-2 rounded-lg shadow-xs w-[130px]">
                                                        <span className="text-slate-500 font-bold text-[9px] uppercase tracking-wider truncate w-full text-left">{cr.containerType || "Standard"}</span>
                                                        <span className="font-mono font-extrabold text-emerald-600 text-[11px] mt-0.5">
                                                          {q.currency} {Number(cr.freightAmount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                                        </span>
                                                      </div>
                                                    ))}
                                                  </div>
                                                )}
                                              </td>
                                              <td className="px-3 py-2 align-top text-right min-w-[140px]">
                                                {rates40.length === 0 ? (
                                                  <div className="text-slate-400 font-extrabold text-[10px] mt-2 mr-4">N/A</div>
                                                ) : (
                                                  <div className="flex flex-col gap-2 items-end">
                                                    {rates40.map((cr, idx) => (
                                                      <div key={cr.id || idx} className="flex flex-col items-start bg-white border border-slate-200/80 p-2 rounded-lg shadow-xs w-[130px]">
                                                        <span className="text-slate-500 font-bold text-[9px] uppercase tracking-wider truncate w-full text-left">{cr.containerType || "Standard"}</span>
                                                        <span className="font-mono font-extrabold text-emerald-600 text-[11px] mt-0.5">
                                                          {q.currency} {Number(cr.freightAmount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                                        </span>
                                                      </div>
                                                    ))}
                                                  </div>
                                                )}
                                              </td>
                                            </>
                                          );
                                        }

                                        return (
                                          <td className="px-3 py-2 text-right">
                                            <div className="flex flex-wrap items-center justify-end gap-2">
                                              {(!Array.isArray(q.containerRates) || q.containerRates.length === 0) &&
                                                (!Array.isArray(q.charges) || q.charges.length === 0) && (
                                                <div className="text-sm font-extrabold text-emerald-600 tabular-nums">
                                                  {q.currency} {totalCost.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </div>
                                              )}

                                              {Array.isArray(q.containerRates) && q.containerRates.length > 0 &&
                                                q.containerRates.map((cr, idx) => (
                                                  <div key={cr.id || idx} className="flex min-w-[130px] flex-col items-start rounded-lg border border-slate-200/80 bg-white p-2">
                                                    <span className="text-slate-500 font-bold text-[9px] uppercase tracking-wider">
                                                      {cr.containerSize || "Container"} {cr.containerType || ""}
                                                    </span>
                                                    <span className="font-mono font-extrabold text-emerald-600 text-[11px] mt-0.5">
                                                      {q.currency} {Number(cr.freightAmount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                                    </span>
                                                  </div>
                                                ))}

                                              {Array.isArray(q.charges) && q.charges.length > 0 &&
                                                  q.charges.map((c, idx) => (
                                                    <div key={c.id || idx} className="flex flex-col items-start rounded-lg border border-slate-200/80 bg-slate-50 p-2 text-left">
                                                      <span className="text-slate-500 font-bold text-[9px] uppercase tracking-wider whitespace-nowrap max-w-[120px] truncate" title={c.chargeName}>
                                                        {c.chargeName}
                                                      </span>
                                                      <span className="font-mono font-extrabold text-slate-700 text-xs whitespace-nowrap mt-0.5">
                                                        {q.currency} {Number(c.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                                      </span>
                                                    </div>
                                                  ))}
                                            </div>
                                          </td>
                                        );
                                      })()}

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
                            <div className="space-y-2 rounded-2xl border border-slate-200/80 bg-white p-6 py-12 text-center text-slate-400">
                                <p className="text-xs font-bold text-slate-500">No freight quotes added yet for this route.</p>
                                <p className="text-[11px] text-slate-400">Click &quot;Add Freight Quote&quot; above to enter quotations from transport partners.</p>
                              </div>
                            )}
                            </div>
                            )}
                          </div>
                      );
                      });
                    })()}
                </div>
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