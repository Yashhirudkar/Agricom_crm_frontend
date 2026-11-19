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
  Building2,
  RotateCw,
  Copy,
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
import SingleShipmentWorkspace from "./SingleShipmentWorkspace";
import axiosClient from "@/lib/axios";
import { resolvePhone } from "@/lib/contactUtils";
import { useSelector } from "react-redux";
import { selectActiveCompany } from "@/store/slices/companyContextSlice";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { isFreightRequiredForShipment } from "@/modules/shipments/utils/freightRuleEngine";
import { shipmentsApi } from "@/modules/shipments/services/shipmentsApi";

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

export default function TransportDrawer({
  isOpen,
  onClose,
  enquiry,
  isReadOnly = false,
  targetShipmentId = null,
  targetShipmentRef = null,
  fromSource = null,
  shipment = null,
}) {
  useEscapeKey(onClose, isOpen);

  const company = useSelector(selectActiveCompany);
  const companyCountry = company?.country;

  const [activeTab, setActiveTab] = useState("quotes");
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);

  // Quote modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [targetShipmentForQuote, setTargetShipmentForQuote] = useState(null);
  const [collapsedShipments, setCollapsedShipments] = useState(new Set());

  const toggleShipmentCollapse = (shipmentId) => {
    setCollapsedShipments((prev) => {
      const next = new Set(prev);
      if (next.has(shipmentId)) next.delete(shipmentId);
      else next.add(shipmentId);
      return next;
    });
  };

  const effectiveTargetShipmentId = useMemo(() => {
    if (targetShipmentId) return String(targetShipmentId);
    if (enquiry?.targetShipmentId) return String(enquiry.targetShipmentId);
    if (typeof window !== "undefined") {
      const param = new URLSearchParams(window.location.search).get("shipmentId");
      if (param) return String(param);
    }
    return null;
  }, [targetShipmentId, enquiry]);

  const effectiveTargetShipmentRef = useMemo(() => {
    if (targetShipmentRef) return String(targetShipmentRef);
    if (enquiry?.targetShipmentRef) return String(enquiry.targetShipmentRef);
    if (typeof window !== "undefined") {
      const param = new URLSearchParams(window.location.search).get("shipmentRef");
      if (param) return String(param);
    }
    return null;
  }, [targetShipmentRef, enquiry]);

  const effectiveFrom = useMemo(() => {
    if (fromSource) return String(fromSource);
    if (typeof window !== "undefined") {
      const param = new URLSearchParams(window.location.search).get("from");
      if (param) return String(param);
    }
    return null;
  }, [fromSource]);

  const isSingleShipmentMode = Boolean(
    effectiveTargetShipmentId ||
    effectiveFrom === "shipments"
  );

  const isSingleShipmentView = isSingleShipmentMode;

  useEffect(() => {
    if (effectiveTargetShipmentId && details?.shipments?.length > 0) {
      setCollapsedShipments((prev) => {
        const next = new Set(prev);
        next.delete(Number(effectiveTargetShipmentId));
        next.delete(String(effectiveTargetShipmentId));
        return next;
      });
      setTimeout(() => {
        const el = document.getElementById(`shipment-card-${effectiveTargetShipmentId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 250);
    }
  }, [effectiveTargetShipmentId, details?.shipments]);

  const [shipmentNotFoundError, setShipmentNotFoundError] = useState(false);

  const visibleShipments = useMemo(() => {
    const list = details?.shipments || [];
    if (!isSingleShipmentView) return list;
    return list.filter(
      (s) =>
        String(s.id) === String(effectiveTargetShipmentId) ||
        (effectiveTargetShipmentRef && s.shipmentReference === effectiveTargetShipmentRef)
    );
  }, [details?.shipments, isSingleShipmentView, effectiveTargetShipmentId, effectiveTargetShipmentRef]);

  const singleShipment = useMemo(() => {
    const list = details?.shipments || [];
    if (list.length === 0) return null;
    if (effectiveTargetShipmentId) {
      const found = list.find((s) => String(s.id) === String(effectiveTargetShipmentId));
      if (found) return found;
      return null;
    }
    if (effectiveTargetShipmentRef) {
      const found = list.find((s) => s.shipmentReference === effectiveTargetShipmentRef);
      if (found) return found;
      return null;
    }
    if (list.length === 1) return list[0];
    return null;
  }, [details?.shipments, effectiveTargetShipmentId, effectiveTargetShipmentRef]);

  const handleOpenAddQuoteForShipment = (shipment) => {
    setSelectedQuote(null);
    setTargetShipmentForQuote(shipment);
    if (availableRoutes.length > 0) {
      const matched = availableRoutes.find(
        (r) =>
          r.origin?.toLowerCase() === shipment.origin?.toLowerCase() &&
          r.destination?.toLowerCase() === shipment.destination?.toLowerCase()
      );
      setSelectedRoute(matched || availableRoutes[0]);
    }
    setIsModalOpen(true);
  };

  const handleOpenEditQuoteForShipment = (quote, shipment) => {
    setSelectedQuote(quote);
    setTargetShipmentForQuote(shipment);
    setIsModalOpen(true);
  };

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
    const pc = details?.purchaseContract || enquiry?.purchaseContract;
    const sc = details?.salesContract || enquiry?.salesContract;
    const hasPc = Boolean(pc);
    const hasSc = Boolean(sc);

    const loadingPlace = pc?.placeOfLoading?.trim();
    const loadingCountry = pc?.loadingCountry?.trim();
    const pcOrigin = hasPc
      ? loadingPlace
        ? `${loadingPlace}${
            loadingCountry &&
            !loadingPlace.toLowerCase().includes(loadingCountry.toLowerCase())
              ? `, ${loadingCountry}`
              : ""
          }`
        : loadingCountry || null
      : null;
    const scDest = (hasSc && (sc.destinationLocationName || sc.portOfDischarge || sc.deliveryPlace))
      ? (sc.destinationLocationName || sc.portOfDischarge || sc.deliveryPlace)
      : (details?.destination && details.destination !== "—" ? details.destination : null);

    const enquiryRoutes = details?.enquiry?.transportDetails || enquiry?.transportDetails || [];
    const targetRoute = enquiry?.transportRoute;

    if (details?.logistics?.routes && details.logistics.routes.length > 0) {
      return details.logistics.routes.map((r, idx) => {
        const matchingTd = enquiryRoutes[idx] || (idx === 0 ? targetRoute : null);
        const origin = pcOrigin ||
          ((r.origin && r.origin !== "Unknown Origin" && r.origin !== "—")
            ? r.origin
            : (matchingTd?.origin || enquiry?.origin || details?.enquiry?.originPort || details?.enquiry?.originCity || "—"));

        const destination = (r.destination && r.destination !== "Unknown Destination" && r.destination !== "—")
          ? r.destination
          : (scDest || matchingTd?.destination || enquiry?.destination || details?.destination || details?.enquiry?.destinationCountry || "—");

        const incoterm = matchingTd?.incoterm || enquiry?.incoterm || details?.purchaseContract?.shipmentTypeName || null;

        return {
          id: r.id,
          origin,
          destination,
          incoterm,
          label: `${origin} → ${destination}`
        };
      });
    }

    if (enquiryRoutes.length > 0) {
      return enquiryRoutes.map((td, idx) => {
        const origin = pcOrigin || td.origin || "—";
        const destination = td.destination || scDest || "—";
        return {
          id: td.id || `td_${idx + 1}`,
          origin,
          destination,
          incoterm: td.incoterm || null,
          label: `${origin} → ${destination}`
        };
      });
    }

    const fallbackO = pcOrigin || enquiry?.origin || details?.enquiry?.originPort || details?.enquiry?.originCity || "—";
    const fallbackD = scDest || enquiry?.destination || details?.destination || details?.enquiry?.destinationCountry || "—";
    return [{ id: "pc-sc", origin: fallbackO, destination: fallbackD, incoterm: enquiry?.incoterm || null, label: `${fallbackO} → ${fallbackD}` }];
  }, [details, enquiry]);

  useEffect(() => {
    if (availableRoutes.length > 0) {
      const currentSelection = availableRoutes.find(
        (route) => route.id === selectedRoute?.id
      );
      if (currentSelection) {
        if (currentSelection !== selectedRoute) setSelectedRoute(currentSelection);
        return;
      }

      const target = enquiry?.transportRoute || enquiry;
      let matched = null;
      if (target?.origin && target?.destination) {
        matched = availableRoutes.find(
          (r) =>
            r.origin?.toLowerCase() === target.origin?.toLowerCase() &&
            r.destination?.toLowerCase() === target.destination?.toLowerCase()
        );
      }
      setSelectedRoute(matched || availableRoutes[0]);
    }
  }, [availableRoutes, selectedRoute, enquiry]);

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
    // Guard 1: Direct shipment prop or enquiry shipment check
    const effectiveShipment =
      shipment ||
      enquiry?.targetShipment ||
      enquiry?.shipment ||
      (effectiveTargetShipmentId && (
        enquiry?.shipments?.find((s) => String(s.id) === String(effectiveTargetShipmentId)) ||
        enquiry?.purchaseContract?.shipments?.find((s) => String(s.id) === String(effectiveTargetShipmentId))
      ));

    if (effectiveShipment && !isFreightRequiredForShipment(effectiveShipment)) {
      setLoading(false);
      onClose?.();
      return;
    }

    // Guard 2: If effectiveTargetShipmentId is provided, verify freight requirement before making logistics calls
    if (effectiveTargetShipmentId) {
      try {
        if (typeof shipmentsApi?.getShipment === "function") {
          const sRes = await shipmentsApi.getShipment(effectiveTargetShipmentId);
          const sData = sRes?.data;
          if (sData && !isFreightRequiredForShipment(sData)) {
            setLoading(false);
            onClose?.();
            return;
          }
        }
      } catch (e) {
        // Safe bypass if shipment check fails
      }
    }

    const rawEnquiryId = enquiry?.enquiryId || enquiry?.id;
    const cleanEnquiryId = rawEnquiryId ? String(rawEnquiryId).split('_')[0] : rawEnquiryId;
    if (!cleanEnquiryId) return;
    setLoading(true);
    setShipmentNotFoundError(false);
    try {
      const sId = effectiveTargetShipmentId ? Number(effectiveTargetShipmentId) : undefined;
      const res = await logisticsApi.getDetails(cleanEnquiryId, sId);

      // Handled business rule: If backend returned business response indicating freight not required, exit cleanly
      if (res?.data?.isBusinessRule || res?.data?.freightRequired === false) {
        setLoading(false);
        onClose?.();
        return;
      }

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
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "";
      const isExpectedBusinessRule =
        err.response?.status === 400 &&
        (String(errorMsg).toLowerCase().includes("freight is not required") ||
          String(errorMsg).toLowerCase().includes("freight required = no") ||
          String(errorMsg).toLowerCase().includes("transport management is not available"));

      if (isExpectedBusinessRule) {
        // Handled business rule: Do NOT log console.error or show error overlay
        onClose?.();
        return;
      }

      console.error(err);
      if (err.response?.status === 404 && effectiveTargetShipmentId) {
        setShipmentNotFoundError(true);
      } else {
        toast.error(errorMsg || "Failed to load transport details.");
      }
    } finally {
      setLoading(false);
    }
  }, [enquiry, effectiveTargetShipmentId, shipment, onClose]);

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
      const shipmentId = isSingleShipmentMode && effectiveTargetShipmentId
        ? Number(effectiveTargetShipmentId)
        : undefined;
      await logisticsApi.deleteFreightQuote(
        details.logistics.id,
        quoteId,
        shipmentId,
      );
      toast.success("Quote removed.");
      loadDetails();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete quote.");
    }
  };

  const handleSetPreferred = async (quoteId) => {
    if (isReadOnly || !details?.logistics?.id) return;
    try {
      const shipmentId = isSingleShipmentMode && effectiveTargetShipmentId
        ? Number(effectiveTargetShipmentId)
        : undefined;
      await logisticsApi.setPreferredQuote(
        details.logistics.id,
        quoteId,
        shipmentId,
      );
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
  const businessReference =
    details?.purchaseContract?.businessReference ||
    enquiry?.purchaseContract?.businessReference ||
    enquiry?.businessReference ||
    enquiry?.businessTransaction?.businessReference ||
    details?.enquiry?.businessReference ||
    "";
  const purchaseContractNumber =
    details?.purchaseContract?.contractNumber ||
    enquiry?.purchaseContract?.contractNumber ||
    "";
  const salesContractBuyer =
    details?.salesContract?.buyer?.entityName ||
    enquiry?.salesContract?.buyer?.entityName ||
    details?.salesContract?.buyerName ||
    "—";
  const purchaseContractSeller =
    details?.purchaseContract?.sellerName ||
    details?.purchaseContract?.seller?.entityName ||
    enquiry?.purchaseContract?.sellerName ||
    enquiry?.purchaseContract?.seller?.entityName ||
    "—";

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
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-base font-extrabold tracking-tight text-slate-900">
                  Shipments Transport
                </h2>
                <div className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1">
                  <span className="text-xs font-semibold text-blue-700">Ref No:</span>
                  <span className="font-mono text-sm font-extrabold text-blue-800">
                    {businessReference || "—"}
                  </span>
                  <button
                    type="button"
                    disabled={!businessReference}
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(String(businessReference));
                        toast.success("Reference number copied.");
                      } catch {
                        toast.error("Could not copy reference number.");
                      }
                    }}
                    aria-label="Copy reference number"
                    title="Copy reference number"
                    className="ml-0.5 rounded p-1 text-blue-700 transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
                {purchaseContractNumber && (
                  <span className="text-sm font-semibold text-slate-600">
                    PC: <strong className="font-extrabold text-slate-800">{purchaseContractNumber}</strong>
                  </span>
                )}
                {isReadOnly && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                    <Eye className="h-3 w-3" /> View Only
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-2">
                {enquiry?.enquiryNo && (
                  <>
                    <span>Enquiry: <strong className="text-slate-700">{enquiry.enquiryNo}</strong></span>
                    <span>•</span>
                  </>
                )}
                <span>Buyer: <strong className="text-slate-700">{salesContractBuyer}</strong></span>
                <span>•</span>
                <span>Seller: <strong className="text-slate-700">{purchaseContractSeller}</strong></span>
                {(() => {
                  const incotermDisplay =
                    selectedRoute?.incoterm ||
                    enquiry?.incoterm ||
                    enquiry?.transportRoute?.incoterm ||
                    details?.enquiry?.transportDetails?.[0]?.incoterm ||
                    enquiry?.transportDetails?.[0]?.incoterm ||
                    details?.purchaseContract?.shipmentTypeName ||
                    enquiry?.purchaseContract?.shipmentTypeName;
                  return incotermDisplay ? (
                    <>
                      <span>•</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {incotermDisplay}
                      </span>
                    </>
                  ) : null;
                })()}
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
          <div className="flex-1 flex flex-col min-h-0 px-3 pb-3 pt-0 sm:px-4 sm:pb-4 lg:px-5 lg:pb-5 gap-2">
            {/* ================================================================================= */}
            {/* 4. FREIGHT MATRIX CONTENT (SHIPMENT-WISE & ROUTE FALLBACK) */}
            {/* ================================================================================= */}
            <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
              <div className="p-4 flex-1 overflow-y-auto">
                {isSingleShipmentMode ? (
                  singleShipment ? (
                    /* ================= DEDICATED SINGLE SHIPMENT WORKSPACE ================= */
                    <SingleShipmentWorkspace
                      shipment={singleShipment}
                      details={details}
                      isReadOnly={isReadOnly}
                      onAddQuote={handleOpenAddQuoteForShipment}
                      onEditQuote={handleOpenEditQuoteForShipment}
                      onDeleteQuote={handleDeleteQuote}
                      onSetPreferred={handleSetPreferred}
                      expiringSoonIds={expiringSoonIds}
                      getPartnerInitials={getPartnerInitials}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-2xl border-2 border-dashed border-rose-200 m-2">
                      <div className="h-12 w-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 mb-3 shadow-xs">
                        <AlertTriangle className="h-6 w-6" />
                      </div>
                      <h3 className="text-sm font-black text-slate-800">Selected shipment not found</h3>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm">
                        {effectiveTargetShipmentRef
                          ? `Shipment "${effectiveTargetShipmentRef}" could not be found.`
                          : "The requested shipment could not be located in this transport workspace."}
                      </p>
                    </div>
                  )
                ) : details?.shipments && details.shipments.length > 0 ? (
                  /* ================= GROUPED PURCHASE CONTRACT WORKSPACE ================= */
                  <div className="space-y-4">
                    <div className="sticky top-0 z-20 -mx-4 -mt-4 -translate-y-2 flex flex-wrap items-center gap-3 border-b border-slate-100 bg-white/95 px-4 py-0 backdrop-blur-sm xl:flex-nowrap xl:justify-between">
                      <div className="flex flex-1 flex-wrap items-center justify-start gap-x-4 gap-y-1 xl:min-w-0 xl:flex-nowrap">
                        <div className="flex shrink-0 items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px]">
                          <span className="text-[9px] font-bold text-blue-700 uppercase tracking-wider">From</span>
                          {Boolean(details?.purchaseContract || enquiry?.purchaseContract) && (
                            <span className="rounded-full bg-white px-1.5 py-0.5 text-[9px] font-medium text-blue-700 border border-blue-200/60">PC</span>
                          )}
                          <span className="max-w-[170px] truncate font-extrabold text-blue-900" title={selectedRoute?.origin || "—"}>
                            {selectedRoute?.origin || "—"}
                          </span>
                        </div>
                        <div className="flex shrink-0 items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px]">
                          <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider">To</span>
                          <span className="rounded-full bg-white px-1.5 py-0.5 text-[9px] font-medium text-emerald-700 border border-emerald-200/60">SC</span>
                          <span className="max-w-[170px] truncate font-extrabold text-emerald-900" title={selectedRoute?.destination || "—"}>
                            {selectedRoute?.destination || "—"}
                          </span>
                        </div>
                        <div className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px]">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Commodity</span>
                          <Package className="h-3 w-3 text-slate-500 shrink-0" />
                          <span className="max-w-[130px] truncate font-extrabold text-slate-800" title={details?.purchaseContract?.productName || enquiry?.purchaseContract?.productName || enquiry?.product?.name || "—"}>
                            {details?.purchaseContract?.productName || enquiry?.purchaseContract?.productName || enquiry?.product?.name || "—"}
                          </span>
                        </div>
                        <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-violet-200 bg-violet-50 px-2.5 py-1 text-[11px] font-semibold text-violet-700">
                          Total Commodity:
                          <strong className="font-extrabold text-violet-800">
                            {Number(enquiry?.quantity || details?.purchaseContract?.quantity || 0).toLocaleString()} MT
                          </strong>
                        </span>
                      </div>
                      {!isReadOnly && (
                        <div className="ml-auto flex shrink-0 items-center gap-2">
                          <div className="w-28 relative">
                            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                              <Truck className="h-3 w-3" />
                            </div>
                            <select
                              value={transportMode}
                              onChange={(e) => setTransportMode(e.target.value)}
                              className="w-full pl-7 pr-2 py-1 border border-slate-200 rounded-lg bg-slate-50 font-bold text-[10px] text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer transition-all hover:bg-slate-100 appearance-none truncate"
                            >
                              <option value="Road">Road</option>
                              <option value="Sea">Sea</option>
                              <option value="Rail">Rail</option>
                              <option value="Air">Air</option>
                            </select>
                          </div>
                          <div className="w-32 relative">
                            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                              <CheckCircle2 className="h-3 w-3" />
                            </div>
                            <select
                              value={logisticsStatus}
                              onChange={(e) => setLogisticsStatus(e.target.value)}
                              className="w-full pl-7 pr-2 py-1 border border-slate-200 rounded-lg bg-slate-50 font-bold text-[10px] text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer transition-all hover:bg-slate-100 appearance-none truncate"
                            >
                              {STATUS_STEPS.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </div>
                          <button
                            onClick={handleUpdateHeader}
                            disabled={savingStatus}
                            className="shrink-0 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-lg text-[9px] flex items-center justify-center gap-1 shadow-sm shadow-blue-500/20 cursor-pointer active:scale-95 transition-all disabled:opacity-50"
                          >
                            {savingStatus ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-3 w-3" />
                            )}
                            Apply
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Shipments List (Grouped Multi-Shipment Layout) */}
                    <div className="space-y-5">
                      {details.shipments.map((s, sIdx) => {
                        const isTargeted = String(s.id) === String(effectiveTargetShipmentId);
                        const isCollapsed = isSingleShipmentView ? false : (collapsedShipments.has(s.id) && !isTargeted);
                        const sQuotes = s.quotes || [];
                        const prefQuote = s.preferredQuote || sQuotes.find(q => q.isPreferred);

                        return (
                          <div
                            key={s.id}
                            id={`shipment-card-${s.id}`}
                            className={`rounded-2xl border transition-all duration-300 overflow-hidden bg-white ${
                              isTargeted
                                ? "border-blue-500 ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/10"
                                : "border-slate-200/90 shadow-2xs hover:border-slate-300"
                            }`}
                          >
                            {/* Shipment Header Bar */}
                            <div className={`p-4 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                              isTargeted
                                ? "bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-white border-b border-blue-200"
                                : isCollapsed
                                ? "hover:bg-slate-50/80 bg-white"
                                : "bg-slate-50/60 border-b border-slate-100"
                            }`}>
                              {/* Left: Collapsible Toggle, Ref, Route, Qty */}
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                {!isSingleShipmentView && (
                                  <button
                                    type="button"
                                    onClick={() => toggleShipmentCollapse(s.id)}
                                    className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 transition-colors cursor-pointer shrink-0"
                                    title={isCollapsed ? "Expand Shipment Details" : "Collapse Shipment Details"}
                                  >
                                    {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                  </button>
                                )}

                                <div className="flex items-center gap-2.5 flex-wrap min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-black uppercase text-slate-500">
                                      {isSingleShipmentView ? "Shipment Ref:" : `#${s.shipmentNo || sIdx + 1}`}
                                    </span>
                                    <span className="px-2.5 py-1 rounded-lg text-xs font-black font-mono tracking-wider bg-blue-600 text-white shadow-2xs">
                                      {s.shipmentReference || `REF-${String(s.id).padStart(5, "0")}`}
                                    </span>
                                  </div>

                                  {!isSingleShipmentView && isTargeted && (
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white shadow-xs animate-pulse">
                                      Targeted Shipment
                                    </span>
                                  )}

                                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200/80 shadow-2xs text-xs font-bold text-slate-800">
                                    <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                                    <span className="text-slate-900">{s.origin || "—"}</span>
                                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                    <span className="text-slate-900">{s.destination || "—"}</span>
                                  </div>

                                  <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-blue-50 text-blue-700 border border-blue-200/80">
                                    {s.quantity ? `${Number(s.quantity).toLocaleString()} MT` : "— MT"}
                                  </span>

                                  {s.noOfContainers > 0 && (
                                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                      {s.noOfContainers} {s.noOfContainers === 1 ? "Container" : "Containers"}
                                    </span>
                                  )}

                                  {s.shipmentDate && (
                                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                      {new Date(s.shipmentDate).toLocaleDateString("en-IN", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      })}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Right: Gate Badges & Action Buttons */}
                              <div className="flex items-center gap-2.5 flex-wrap justify-end shrink-0">
                                {!isReadOnly && (
                                  <>
                                    {/* + Add Quote for THIS Shipment */}
                                    <button
                                      type="button"
                                      onClick={() => handleOpenAddQuoteForShipment(s)}
                                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl flex items-center gap-1.5 text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
                                    >
                                      <Plus className="h-3.5 w-3.5" />
                                      Add Freight Quote
                                    </button>

                                    {s.status === "Executed" && (
                                      <span className="px-3.5 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold flex items-center gap-1.5 text-xs select-none">
                                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Executed
                                      </span>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Shipment Body Content */}
                            {!isCollapsed && (
                              <div className="p-4 bg-slate-50/40 space-y-4">
                                {/* Preferred Quote Highlight Ribbon */}
                                {prefQuote && (
                                  <div className="bg-gradient-to-r from-purple-50 via-indigo-50/60 to-purple-50/40 border border-purple-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                                    <div className="flex items-center gap-3">
                                      <div className="h-8 w-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                                        <Star className="h-4 w-4 fill-white" />
                                      </div>
                                      <div>
                                        <div className="text-xs font-extrabold text-purple-950 flex items-center gap-2">
                                          <span>Preferred Carrier:</span>
                                          <span className="font-black text-purple-700 bg-white px-2 py-0.5 rounded border border-purple-200">
                                            {prefQuote.seller?.entityName || prefQuote.carrier || "Transport Partner"}
                                          </span>
                                        </div>
                                        <div className="text-[11px] text-purple-700 font-medium flex items-center gap-2 mt-1">
                                          <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" /> {prefQuote.transitDays} Transit Days
                                          </span>
                                          <span>•</span>
                                          <span>Quote #{prefQuote.quoteNumber || "Q-1"}</span>
                                          {prefQuote.validityDate && (
                                            <>
                                              <span>•</span>
                                              <span>
                                                Valid till{" "}
                                                {new Date(prefQuote.validityDate).toLocaleDateString("en-IN", {
                                                  day: "2-digit",
                                                  month: "short",
                                                  year: "numeric",
                                                })}
                                              </span>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3 self-end sm:self-auto">
                                      <div className="text-right">
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
                                          Locked Freight Rate
                                        </div>
                                        <div className="text-sm font-black text-purple-950 font-mono">
                                          {prefQuote.currency || "INR"}{" "}
                                          {Number(prefQuote.freightAmount || 0).toLocaleString("en-US", {
                                            minimumFractionDigits: 2,
                                          })}
                                        </div>
                                      </div>
                                      <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase bg-purple-600 text-white shadow-2xs">
                                        Locked
                                      </span>
                                    </div>
                                  </div>
                                )}

                                {/* Quotes Table for this Shipment */}
                                {sQuotes.length > 0 ? (
                                  <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-2xs">
                                    <div className="overflow-x-auto">
                                      <table className="w-full text-left text-xs text-slate-700 border-collapse">
                                        <thead className="bg-slate-50/90 border-b border-slate-200 text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">
                                          <tr>
                                            <th className="px-3 py-2.5">Transport Partner</th>
                                            <th className="px-3 py-2.5">Contact Person</th>
                                            <th className="px-3 py-2.5 text-center">Transit</th>
                                            <th className="px-3 py-2.5">Validity</th>
                                            <th className="px-3 py-2.5 text-right">Freight Rate</th>
                                            <th className="px-3 py-2.5 text-center">Preferred Status</th>
                                            <th className="px-3 py-2.5 text-right">Actions</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 font-medium">
                                          {sQuotes.map((q) => {
                                            const totalCost =
                                              Number(q.freightAmount || 0) +
                                              Number(q.fuelCharges || 0) +
                                              Number(q.additionalCharges || 0);
                                            const isPreferred = q.isPreferred || (prefQuote && prefQuote.id === q.id);
                                            const isExpiring = expiringSoonIds.includes(q.id);
                                            const initials = getPartnerInitials(q.seller?.entityName);

                                            return (
                                              <tr
                                                key={q.id}
                                                className={`transition-colors hover:bg-slate-50/80 ${
                                                  isPreferred ? "bg-purple-50/40 font-semibold" : ""
                                                }`}
                                              >
                                                {/* Transport Partner */}
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

                                                {/* Contact Person */}
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

                                                {/* Transit */}
                                                <td className="px-3 py-2 text-center">
                                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800 font-extrabold text-[10px]">
                                                    <Clock className="h-3 w-3 text-blue-600" /> {q.transitDays} Days
                                                  </span>
                                                </td>

                                                {/* Validity */}
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

                                                {/* Freight Rate */}
                                                <td className="px-3 py-2 text-right">
                                                  <div className="flex flex-wrap items-center justify-end gap-2">
                                                    {(!Array.isArray(q.containerRates) || q.containerRates.length === 0) &&
                                                      (!Array.isArray(q.charges) || q.charges.length === 0) && (
                                                        <div className="text-sm font-extrabold text-emerald-600 tabular-nums">
                                                          {q.currency || "INR"}{" "}
                                                          {totalCost.toLocaleString("en-US", {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                          })}
                                                        </div>
                                                      )}
                                                    {Array.isArray(q.containerRates) && q.containerRates.length > 0 &&
                                                      q.containerRates.map((cr, idx) => (
                                                        <div
                                                          key={cr.id || idx}
                                                          className="flex min-w-[130px] flex-col items-start rounded-lg border border-slate-200/80 bg-white p-2"
                                                        >
                                                          <span className="text-slate-500 font-bold text-[9px] uppercase tracking-wider">
                                                            {cr.containerSize || "Container"} {cr.containerType || ""}
                                                          </span>
                                                          <span className="font-mono font-extrabold text-emerald-600 text-[11px] mt-0.5">
                                                            {q.currency || "USD"}{" "}
                                                            {Number(cr.freightAmount).toLocaleString("en-US", {
                                                              minimumFractionDigits: 2,
                                                            })}
                                                          </span>
                                                        </div>
                                                      ))}
                                                  </div>
                                                </td>

                                                {/* Preferred Selection */}
                                                <td className="px-3 py-2 text-center">
                                                  <button
                                                    type="button"
                                                    onClick={() => !isReadOnly && handleSetPreferred(q.id)}
                                                    disabled={isReadOnly}
                                                    className={`px-2.5 py-1 rounded-lg font-extrabold text-[10px] transition-all inline-flex items-center gap-1.5 ${
                                                      isPreferred
                                                        ? "bg-purple-600 text-white shadow-xs"
                                                        : isReadOnly
                                                        ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                                                        : "bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 cursor-pointer"
                                                    }`}
                                                  >
                                                    <Star className={`h-2.5 w-2.5 ${isPreferred ? "fill-white" : ""}`} />
                                                    {isPreferred ? "Selected" : "Select"}
                                                  </button>
                                                </td>

                                                {/* Edit / Delete */}
                                                <td className="px-3 py-2 text-right">
                                                  <div className="flex items-center justify-end gap-1">
                                                    {isReadOnly ? (
                                                      <button
                                                        type="button"
                                                        onClick={() => handleOpenEditQuoteForShipment(q, s)}
                                                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                        title="View Quote Details"
                                                      >
                                                        <Eye className="h-3.5 w-3.5" />
                                                      </button>
                                                    ) : (
                                                      <>
                                                        <button
                                                          type="button"
                                                          onClick={() => handleOpenEditQuoteForShipment(q, s)}
                                                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                          title="Revise Quote"
                                                        >
                                                          <Edit2 className="h-3.5 w-3.5" />
                                                        </button>
                                                        <button
                                                          type="button"
                                                          disabled={isPreferred}
                                                          onClick={() => handleDeleteQuote(q.id)}
                                                          className={`p-1.5 rounded-lg transition-colors ${
                                                            isPreferred
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
                                  <div className="pending-action-card">
                                    <div className="flex flex-col items-center justify-center py-10 px-4 text-center bg-white rounded-2xl">
                                      <div className="flex items-center gap-2 mb-2">
                                        <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
                                        <p className="text-xs font-bold text-slate-800">No freight quotes added yet</p>
                                      </div>
                                      <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">
                                        Add at least one Freight Quote to continue the transport process.
                                      </p>
                                      {!isReadOnly && (
                                        <button
                                          type="button"
                                          onClick={() => handleOpenAddQuoteForShipment(s)}
                                          className="mt-4 px-3.5 py-1.5 text-xs font-bold text-blue-600 bg-white hover:bg-blue-50 rounded-lg border border-blue-200 shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
                                        >
                                          <Plus className="h-3.5 w-3.5" /> Add First Freight Quote
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* ================= FALLBACK: ROUTE-BASED CARDS FOR STANDALONE ENQUIRIES ================= */
                  <div className="space-y-5">
                    {(() => {
                      const routesToRender = availableRoutes.filter(r => r.id !== 'all');
                      const routesArray = routesToRender.length > 0 ? routesToRender : [{ id: 'all', origin: '—', destination: '—' }];
                      
                      return routesArray.map((route, rIdx) => {
                        const routeQuotes = details?.logistics?.quotes?.filter(q => route.id === 'all' || q.routeId === route.id || (!q.routeId && routesArray.length === 1)) || [];
                        const isExpiring = expiringSoonIds;
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
                                    <div className="overflow-x-auto">
                                      <table className="w-full text-left text-xs text-slate-700 border-collapse">
                                        <thead className="bg-slate-50/80 border-b border-slate-200 text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">
                                          <tr>
                                            <th className="px-3 py-2.5">Transport Partner</th>
                                            <th className="px-3 py-2.5">Contact Person</th>
                                            <th className="px-3 py-2.5 text-center">Transit</th>
                                            <th className="px-3 py-2.5">Validity</th>
                                            <th className="px-3 py-2.5 text-right">Freight Amount</th>
                                            <th className="px-3 py-2.5 text-center">Preferred</th>
                                            <th className="px-3 py-2.5 text-right">Actions</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 font-medium">
                                          {routeQuotes.map((q) => {
                                            const totalCost =
                                              Number(q.freightAmount || 0) +
                                              Number(q.fuelCharges || 0) +
                                              Number(q.additionalCharges || 0);
                                            const isPreferred = q.isPreferred;
                                            const isExpiring = expiringSoonIds.includes(q.id);
                                            const initials = getPartnerInitials(q.seller?.entityName);

                                            return (
                                              <tr
                                                key={q.id}
                                                className={`transition-colors hover:bg-slate-50/80 ${isPreferred ? "bg-purple-50/30 font-semibold" : ""}`}
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
                                                    <div className="font-bold text-slate-800 text-[11px]">{q.contactPerson || "N/A"}</div>
                                                    <div className="text-[10px] font-mono text-slate-500 mt-0.5">{q.contactNumber ? `📞 ${q.contactNumber}` : "N/A"}</div>
                                                  </div>
                                                </td>
                                                <td className="px-3 py-2 text-center">
                                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800 font-extrabold text-[10px]">
                                                    <Clock className="h-3 w-3 text-blue-600" /> {q.transitDays} Days
                                                  </span>
                                                </td>
                                                <td className="px-3 py-2">
                                                  <div className="font-bold text-slate-800 text-[11px]">
                                                    {q.validityDate ? new Date(q.validityDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "N/A"}
                                                  </div>
                                                </td>
                                                <td className="px-3 py-2 text-right font-mono font-extrabold text-emerald-600 text-sm">
                                                  {q.currency || "INR"} {totalCost.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-3 py-2 text-center">
                                                  <button
                                                    onClick={() => !isReadOnly && handleSetPreferred(q.id)}
                                                    disabled={isReadOnly}
                                                    className={`px-2 py-1 rounded-lg font-extrabold text-[10px] transition-all inline-flex items-center gap-1.5 ${
                                                      isPreferred
                                                        ? "bg-purple-600 text-white shadow-sm"
                                                        : "bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 cursor-pointer"
                                                    }`}
                                                  >
                                                    <Star className={`h-2.5 w-2.5 ${isPreferred ? "fill-white" : ""}`} />
                                                    {isPreferred ? "Selected" : "Select"}
                                                  </button>
                                                </td>
                                                <td className="px-3 py-2 text-right">
                                                  <div className="flex items-center justify-end gap-1">
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
                                                      className={`p-1.5 rounded-lg transition-colors ${
                                                        isPreferred
                                                          ? "text-slate-300 cursor-not-allowed"
                                                          : "text-slate-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                                                      }`}
                                                      title={isPreferred ? "Cannot delete preferred quote" : "Delete"}
                                                    >
                                                      <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
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
                                  <div className="pending-action-card">
                                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-2xl">
                                      <div className="flex items-center gap-2 mb-2">
                                        <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
                                        <p className="text-xs font-bold text-slate-800">No freight quotes added yet</p>
                                      </div>
                                      <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">
                                        Add at least one Freight Quote to continue the transport process.
                                      </p>
                                      {!isReadOnly && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setSelectedQuote(null);
                                            if (route.id !== 'all') {
                                              setSelectedRoute(availableRoutes.find(r => r.id === route.id));
                                            } else {
                                              setSelectedRoute(availableRoutes[0]);
                                            }
                                            setIsModalOpen(true);
                                          }}
                                          className="mt-4 px-3.5 py-1.5 text-xs font-bold text-blue-600 bg-white hover:bg-blue-50 rounded-lg border border-blue-200 shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
                                        >
                                          <Plus className="h-4 w-4" /> Add First Freight Quote
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      });
                    })()}
                  </div>
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
            setTargetShipmentForQuote(null);
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
          targetShipment={targetShipmentForQuote}
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