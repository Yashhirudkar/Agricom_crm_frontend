
export const CLOSURE_REASONS = [
  "Call Not Connected (CNR)",
  "No Current Requirement",
  "Already Working with Another Supplier",
  "Requested Email Instead",
  "Price Too High",
  "Delivery Timeline Too Long",
  "Quality Requirements Not Matched",
  "Specification Mismatch",
  "Product Not Available",
  "Budget Constraints",
  "Order Postponed",
  "Purchased from Another Supplier",
  "No Response After Multiple Follow-ups",
  "Customer Not Interested",
  "Invalid Lead",
  "Duplicate Enquiry",
  "Spam / Test Enquiry",
  "Other"
];
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  X,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  Briefcase,
  Search,
  Clock,
  Send,
  User,
  Info,
  Edit2,
  FileText
} from "lucide-react";
import Drawer from "@/components/common/Drawer";
import axiosClient from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";
import UserProfileModal from "@/modules/chat/components/Common/UserProfileModal";
import HasPermission from "@/components/rbac/HasPermission";
import CreateQuotationDrawer from "@/modules/follow-ups/components/CreateQuotationDrawer";
import QuotationActivityCard from "@/modules/follow-ups/components/QuotationActivityCard";
import QuotationPreviewDrawer from "@/modules/follow-ups/components/QuotationPreviewDrawer";
import EnquiryActivityCard from "./EnquiryActivityCard";
import { enquiriesApi } from "@/modules/enquiries/services/enquiriesApi";

const getInitials = (name) => {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();

  

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getAvatarColor = (name) => {
  if (!name) return "from-slate-400 to-slate-500 text-white";
  const colors = [
    "from-blue-500 to-indigo-600 text-white",
    "from-emerald-500 to-teal-600 text-white",
    "from-violet-500 to-purple-600 text-white",
    "from-amber-500 to-orange-600 text-white",
    "from-rose-500 to-pink-600 text-white",
    "from-cyan-500 to-blue-600 text-white"
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

function PartnerFollowUpDrawer({
  isOpen,
  onClose,
  partner,
  onSaveSuccess,
  enquiryId,
  partnerId,
  entityType,
}) {
  const queryClient = useQueryClient();
  const isEnquiry = Boolean(enquiryId);

  const [followUps, setFollowUps] = useState([]);
  const [activities, setActivities] = useState([]);
  const [hasMoreOlder, setHasMoreOlder] = useState(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [timelineSearch, setTimelineSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [enquiryData, setEnquiryData] = useState(null);
  const [isReopening, setIsReopening] = useState(false);
  const [selectedUserProfile, setSelectedUserProfile] = useState(null);
  const [isQuotationOpen, setIsQuotationOpen] = useState(false);
  const [previewQuotationId, setPreviewQuotationId] = useState(null);
  const [isPreviewDrawerOpen, setIsPreviewDrawerOpen] = useState(false);

  const handleOpenQuotationPreview = (target) => {
    const id = typeof target === "object" ? target?.id : target;
    if (id) {
      setPreviewQuotationId(id);
      setIsPreviewDrawerOpen(true);
    }
  };

  // Ref for the chat scroll container
  const chatContainerRef = useRef(null);
  // Track whether the user is near the bottom
  const isNearBottomRef = useRef(true);
  // Set to true when the current user explicitly sends a message
  const isSendingRef = useRef(false);
  const buyerTextareaRef = useRef(null);
  const responseTextareaRef = useRef(null);

  const scrollToBottom = (smooth = true) => {
    const el = chatContainerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "instant" });
  };

  const handleScroll = async () => {
    const el = chatContainerRef.current;
    if (!el) return;
    isNearBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 100;

    // Detect scroll near top for lazy-loading older activities in Enquiry mode
    if (
      el.scrollTop < 40 &&
      isEnquiry &&
      hasMoreOlder &&
      !isLoadingOlder &&
      activities.length > 0
    ) {
      const oldestId = activities[0]?.id;
      if (oldestId) {
        setIsLoadingOlder(true);
        const prevScrollHeight = el.scrollHeight;
        try {
          const older = await enquiriesApi.getActivity(enquiryId, {
            limit: 50,
            before: oldestId,
          });
          if (!older || older.length < 50) {
            setHasMoreOlder(false);
          }
          if (older && older.length > 0) {
            setActivities((prev) => [...older, ...prev]);
            requestAnimationFrame(() => {
              if (el) {
                el.scrollTop = el.scrollHeight - prevScrollHeight;
              }
            });
          }
        } catch (err) {
          console.error("Failed to load older activities", err);
        } finally {
          setIsLoadingOlder(false);
        }
      }
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
  } = useForm({
    defaultValues: {
      followupDate: new Date().toISOString().split("T")[0],
      communicationType: "Call",
      buyerRemark: "",
      ourResponse: "",
      nextFollowupDate: "",
      status: "Pending",
      priority: "Medium",
    },
  });

  const selectedNextDate = watch("nextFollowupDate");
  const currentWatchStatus = watch("status");
  const lastFollowUp = followUps.length > 0 ? followUps[followUps.length - 1] : null;
  const isAlreadyClosed = isEnquiry
    ? String(enquiryData?.status || "").toUpperCase() === "CLOSED"
    : lastFollowUp?.status === "Closed";
  const closedInfo = isEnquiry
    ? {
        reason: enquiryData?.closureReason,
        remark: enquiryData?.closureRemark,
      }
    : {
        reason: lastFollowUp?.closureReason,
        remark: lastFollowUp?.closureRemark,
      };

  const { ref: buyerRegisterRef, ...buyerField } = register("buyerRemark");
  const { ref: responseRegisterRef, ...responseField } = register("ourResponse");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isSaving) {
        handleSubmit(onSubmit)();
      }
    }
  };

  useEffect(() => {
    if (isOpen && (partner || enquiryId)) {
      setEditingId(null);
      isNearBottomRef.current = true;
      reset({
        followupDate: new Date().toISOString().split("T")[0],
        communicationType: "Call",
        buyerRemark: "",
        ourResponse: "",
        nextFollowupDate: "",
        status: "Pending",
        priority: "Medium",
      });

      if (isEnquiry) {
        fetchEnquiryActivities(true);
      } else {
        fetchFollowUps(true);
      }
    }
  }, [isOpen, partner, enquiryId, isEnquiry, reset]);

  useEffect(() => {
    const handleQuotationChanged = () => {
      if (isOpen) {
        isSendingRef.current = true;
        if (isEnquiry) {
          fetchEnquiryActivities(false);
        } else {
          fetchFollowUps(false);
        }
      }
    };
    window.addEventListener("quotation-created", handleQuotationChanged);
    window.addEventListener("quotation-deleted", handleQuotationChanged);
    return () => {
      window.removeEventListener("quotation-created", handleQuotationChanged);
      window.removeEventListener("quotation-deleted", handleQuotationChanged);
    };
  }, [isOpen, isEnquiry, partner]);

  useEffect(() => {
    // isSendingRef = user just sent → always scroll to bottom
    // isNearBottomRef = user was already near bottom → keep them there
    if (isSendingRef.current || isNearBottomRef.current) {
      scrollToBottom();
      isSendingRef.current = false;
    }
  }, [followUps, activities]);

  const fetchEnquiryDetails = async () => {
    if (!enquiryId) return;
    try {
      const data = await enquiriesApi.getOne(enquiryId);
      setEnquiryData(data);
    } catch (err) {
      console.error("Failed to fetch enquiry details", err);
    }
  };

  const fetchEnquiryActivities = async (showLoading = true) => {
    if (!enquiryId) return;
    if (showLoading) setIsLoading(true);
    try {
      fetchEnquiryDetails();
      const data = await enquiriesApi.getActivity(enquiryId, { limit: 50 });
      const items = Array.isArray(data) ? data : data?.data ?? [];
      setActivities(items);
      setHasMoreOlder(items.length >= 50);
      isSendingRef.current = true;
    } catch (err) {
      console.error("Failed to fetch enquiry activity timeline", err);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  const handleReopen = async () => {
    if (isReopening) return;
    setIsReopening(true);
    try {
      const pId = partnerId || partner?.id;
      const payload = {
        followupDate: new Date().toISOString(),
        communicationType: "Call",
        status: "Pending",
        buyerRemark: "Enquiry reopened",
        ourResponse: "Status updated from Closed to Pending",
      };
      if (pId) payload.partnerId = Number(pId);
      if (enquiryId) payload.enquiryId = String(enquiryId);
      const eType = entityType || "partner";
      payload.entityType = eType;
      if (eType !== "enquiry") payload.entityId = Number(pId);

      await axiosClient.post(`/masters/partners/${partner?.id || pId}/follow-ups`, payload);
      reset({
        followupDate: new Date().toISOString().split("T")[0],
        communicationType: "Call",
        buyerRemark: "",
        ourResponse: "",
        nextFollowupDate: "",
        status: "Pending",
        priority: "Medium",
        closureReason: "",
        closureRemark: "",
      });
      if (isEnquiry) {
        await fetchEnquiryDetails();
        await fetchEnquiryActivities(false);
      } else {
        await fetchFollowUps(false);
      }
      queryClient.invalidateQueries({ queryKey: ["follow-ups"] });
      if (onSaveSuccess) onSaveSuccess();
    } catch (err) {
      console.error("Failed to reopen enquiry", err);
    } finally {
      setIsReopening(false);
    }
  };

  const fetchFollowUps = async (showLoading = true) => {
    if (!partner) return;
    if (showLoading) setIsLoading(true);
    try {
      const eType = entityType || "partner";
      const eId = entityType === "enquiry" ? enquiryId : (partnerId || partner.id);

      const res = await axiosClient.get(`/masters/partners/${partner.id}/follow-ups`, {
        params: {
          entityType: eType,
          entityId: eId,
        },
      });
      const sorted = [...res.data].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      setFollowUps(sorted);
    } catch (err) {
      console.error("Failed to fetch follow ups", err);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    reset({
      followupDate: item.followupDate
        ? new Date(item.followupDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      communicationType: item.communicationType || "Call",
      buyerRemark: item.buyerRemark || item.metadata?.buyerRemark || item.message || "",
      ourResponse: item.ourResponse || item.metadata?.ourResponse || "",
      nextFollowupDate: item.nextFollowupDate
        ? new Date(item.nextFollowupDate).toISOString().split("T")[0]
        : item.metadata?.nextFollowupDate
        ? new Date(item.metadata.nextFollowupDate).toISOString().split("T")[0]
        : "",
      status: item.status || item.metadata?.status || "Pending",
      priority: item.priority || "Medium",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    reset({
      followupDate: new Date().toISOString().split("T")[0],
      communicationType: "Call",
      buyerRemark: "",
      ourResponse: "",
      nextFollowupDate: "",
      status: "Pending",
      priority: "Medium",
    });
  };

  const onSubmit = async (data) => {
    if (data.status === "Closed") {
      if (!data.closureReason) {
        return;
      }
    } else if (!editingId && !data.buyerRemark?.trim() && !data.ourResponse?.trim()) {
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        ...data,
        followupDate: new Date(data.followupDate).toISOString(),
        nextFollowupDate: data.nextFollowupDate
          ? new Date(data.nextFollowupDate).toISOString()
          : null,
      };
      if (data.status === "Closed" && !payload.ourResponse?.trim()) {
        payload.ourResponse = payload.closureRemark || ("Closed: " + payload.closureReason);
      }
      const pId = partnerId || partner?.id;
      if (pId) payload.partnerId = Number(pId);
      if (enquiryId) payload.enquiryId = String(enquiryId);

      const eType = entityType || "partner";
      const eId = entityType === "enquiry" ? enquiryId : pId;

      payload.entityType = eType;
      if (eType === "enquiry") {
        payload.entityId = undefined;
      } else {
        payload.entityId = Number(eId);
      }

      if (editingId) {
        await axiosClient.patch(`/masters/partners/${partner.id}/follow-ups/${editingId}`, payload);
        setEditingId(null);
      } else {
        await axiosClient.post(`/masters/partners/${partner.id}/follow-ups`, payload);
      }

      // Reset text fields
      reset({
        ...data,
        buyerRemark: "",
        ourResponse: "",
        nextFollowupDate: "",
      });

      if (buyerTextareaRef.current) buyerTextareaRef.current.style.height = 'auto';
      if (responseTextareaRef.current) responseTextareaRef.current.style.height = 'auto';

      isSendingRef.current = true;
      if (isEnquiry) {
        await fetchEnquiryActivities(false);
      } else {
        await fetchFollowUps(false);
      }

      queryClient.invalidateQueries({ queryKey: ["follow-ups"] });
      if (onSaveSuccess) onSaveSuccess();
    } catch (err) {
      console.error("Failed to save follow up", err);
    } finally {
      setIsSaving(false);
    }
  };

  const getCommunicationIcon = (type) => {
    switch (type) {
      case "Call": return <Phone className="h-3.5 w-3.5" />;
      case "Email": return <Mail className="h-3.5 w-3.5" />;
      case "WhatsApp": return <MessageCircle className="h-3.5 w-3.5" />;
      case "Meeting": return <Calendar className="h-3.5 w-3.5" />;
      case "Negotiation": return <Briefcase className="h-3.5 w-3.5" />;
      default: return <MessageCircle className="h-3.5 w-3.5" />;
    }
  };

  const getStatusColor = (status) => {
    if (status === "Pending" || status === "Waiting Response") return "bg-yellow-100 text-yellow-700";
    if (status === "Confirmed" || status === "Deal Finalized" || status === "Closed") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-700";
  };

  const displayList = isEnquiry ? activities : followUps;

  const filteredTimeline = useMemo(() => {
    return displayList.filter((item) => {
      if (timelineSearch) {
        const search = timelineSearch.toLowerCase();
        if (isEnquiry) {
          return (
            (item.message && item.message.toLowerCase().includes(search)) ||
            (item.type && item.type.toLowerCase().includes(search)) ||
            (item.activityType && item.activityType.toLowerCase().includes(search)) ||
            (item.metadata?.productName && item.metadata.productName.toLowerCase().includes(search)) ||
            (item.metadata?.partnerName && item.metadata.partnerName.toLowerCase().includes(search)) ||
            (item.metadata?.buyerRemark && item.metadata.buyerRemark.toLowerCase().includes(search)) ||
            (item.metadata?.ourResponse && item.metadata.ourResponse.toLowerCase().includes(search))
          );
        }
        return (
          (item.buyerRemark && item.buyerRemark.toLowerCase().includes(search)) ||
          (item.ourResponse && item.ourResponse.toLowerCase().includes(search)) ||
          item.communicationType?.toLowerCase().includes(search)
        );
      }
      return true;
    });
  }, [displayList, timelineSearch, isEnquiry]);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title=""
      hideHeader={true}
      widthClass="w-full md:w-[600px] lg:w-[650px]"
    >
      <div className="flex flex-col h-full bg-[#E5ECEF] relative overflow-hidden">

        {/* --- CHAT HEADER --- */}
        <div className="bg-white px-5 py-3 flex items-center justify-between shadow-sm z-20 shrink-0 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
              {partner?.entityName ? partner.entityName.charAt(0).toUpperCase() : "A"}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800 leading-tight flex items-center gap-2">
                {isEnquiry ? "Activity Timeline" : partner?.entityName || "Follow-up Chat"}
                {isEnquiry && partner?.entityName && (
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                    {partner.entityName}
                  </span>
                )}
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Active"></span>
              </h2>
              <div className="text-xs text-gray-500 font-medium flex items-center gap-1.5 mt-0.5">
                <span className="truncate max-w-[150px]">{partner?.partnerRole?.name || "Enquiry Activity"}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span>{partner?.country || "Global"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-2.5 top-2 text-gray-400" />
              <input
                type="text"
                placeholder={isEnquiry ? "Search timeline..." : "Search chat..."}
                value={timelineSearch}
                onChange={(e) => setTimelineSearch(e.target.value)}
                className="w-36 transition-all focus:w-48 pl-8 pr-3 py-1.5 bg-gray-100 border-none rounded-full text-xs focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* --- CHAT BODY (MESSAGES / TIMELINE) --- */}
        <div
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-5 scroll-smooth custom-scrollbar"
          style={{ backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 0)', backgroundSize: '20px 20px' }}
        >

          {/* Lazy load older spinner */}
          {isLoadingOlder && (
            <div className="flex justify-center py-2 mb-3">
              <div className="px-3.5 py-1.5 bg-white/90 backdrop-blur-xs rounded-full shadow-xs text-xs font-semibold text-gray-500 flex items-center gap-2 border border-gray-200">
                <div className="h-3 w-3 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                Loading older activities...
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="px-4 py-2 bg-white rounded-full shadow-sm text-sm text-gray-500 flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin" />
                Loading timeline...
              </div>
            </div>
          ) : filteredTimeline.length === 0 ? (
            isEnquiry ? (
              /* Section 1 Required Empty State for Enquiry */
              <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
                <div className="bg-white p-4 rounded-3xl mb-4 shadow-sm border border-gray-100 text-[#007aff]">
                  <Clock className="h-8 w-8" />
                </div>
                <h3 className="text-base font-extrabold text-gray-800">No activities yet.</h3>
                <p className="text-xs text-gray-500 mt-2 max-w-xs leading-relaxed">
                  Activities such as enquiry creation,
                  price negotiations,
                  WhatsApp messages,
                  follow-ups,
                  quotations
                  and orders
                  will appear here.
                </p>
              </div>
            ) : (
              /* Empty state for non-enquiry partner chat */
              <div className="flex flex-col items-center justify-center h-full text-center opacity-70">
                <div className="bg-white p-4 rounded-full mb-3 shadow-sm text-blue-500">
                  <MessageCircle className="h-8 w-8" />
                </div>
                <p className="text-sm font-semibold text-gray-600">No conversation history</p>
                <p className="text-xs text-gray-500 mt-1">Start by logging a new follow-up below.</p>
              </div>
            )
          ) : isEnquiry ? (
            /* ──────────────── ENQUIRY COMPLETE ACTIVITY TIMELINE ──────────────── */
            <div className="space-y-4">
              {filteredTimeline.map((item) => (
                <div
                  key={item.id}
                  className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                  <EnquiryActivityCard
                    activity={item}
                    onOpenQuotation={handleOpenQuotationPreview}
                    onOpenUserProfile={setSelectedUserProfile}
                  />
                </div>
              ))}
            </div>
          ) : (
            /* ──────────────── PARTNER FOLLOW-UP CHAT ──────────────── */
            <div className="space-y-6">
              {filteredTimeline.map((item) => (
                <div key={item.id} className="flex flex-col space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">

                  {/* Date & System Meta Pill */}
                  <div className="flex justify-center my-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white border border-gray-200 text-gray-500 px-3 py-1 rounded-full shadow-sm flex items-center gap-2">
                      <Clock className="w-3 h-3 text-gray-400" />
                      {new Date(item.followupDate).toLocaleDateString()}
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span className="flex items-center gap-1 text-blue-600">
                        {getCommunicationIcon(item.communicationType)}
                        {item.communicationType}
                      </span>
                    </span>
                  </div>

                  {/* Quotation card */}
                  {item.communicationType === "QUOTATION" || item.communicationType === "Quotation" || item.entityType === "Quotation" ? (
                    <div className="flex justify-center my-1">
                      <QuotationActivityCard
                        quotation={item.quotation}
                        onClick={(q) => handleOpenQuotationPreview(q || item.entityId)}
                      />
                    </div>
                  ) : (
                    <>
                      {/* Buyer Remark */}
                      {item.buyerRemark && (
                        <div className="flex items-end gap-2 self-start max-w-[70%] sm:max-w-[65%]">
                          <div className="w-7 h-7 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-600 shadow-sm border border-gray-300">
                            <User className="h-4 w-4" />
                          </div>
                          <div className="bg-white px-4 py-3 rounded-[14px] sm:rounded-[16px] rounded-tl-xs shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-gray-100/80 relative group">
                            <p className="text-[13px] text-[#111827] whitespace-pre-wrap leading-relaxed">{item.buyerRemark}</p>
                            <div className="text-right mt-1 text-[9px] text-gray-400">
                              {new Date(item.createdAt || item.followupDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Our Action */}
                      <div className="flex items-end gap-2 self-end max-w-[85%] sm:max-w-[75%] group">
                        <button
                          onClick={() => handleEdit(item)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 hover:text-blue-600 transition-all mb-1 shrink-0 shadow-sm border border-gray-200"
                          title="Edit this interaction"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex flex-col items-end gap-1.5 min-w-[160px]">
                          {item.ourResponse && (
                            <div className="bg-[#DCF8C6] p-3 rounded-[14px] sm:rounded-[16px] rounded-tr-xs shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-[#d0ecb8]/70 relative">
                              <p className="text-[13px] text-[#111827] whitespace-pre-wrap leading-relaxed px-1">
                                {item.ourResponse}
                              </p>
                              <div className="text-right mt-1 text-[9px] text-gray-500/80">
                                {new Date(item.createdAt || item.followupDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          )}

                          <div className="flex flex-wrap items-center justify-end gap-1.5">
                            {item.nextFollowupDate && (
                              <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                                Next: {new Date(item.nextFollowupDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                              </span>
                            )}
                          </div>
                        </div>
                        <div
                          onClick={() => item.createdBy && setSelectedUserProfile(item.createdBy)}
                          className={`w-7 h-7 rounded-full bg-gradient-to-tr ${getAvatarColor(item.createdBy?.name || "Unknown User")} text-white font-extrabold flex items-center justify-center text-[9px] shadow-sm border border-blue-200 shrink-0 cursor-pointer hover:scale-105 transition-transform`}
                          title={item.createdBy?.name || "Unknown User"}
                        >
                          {getInitials(item.createdBy?.name || "Unknown User")}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- CHAT INPUT / CLOSED SUMMARY (FOOTER) --- */}
        {isAlreadyClosed ? (
          <div className="bg-white p-3 md:p-4 shrink-0 shadow-[0_-4px_15px_-5px_rgba(0,0,0,0.05)] z-20 border-t border-gray-100">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200/70">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Status:
                  </span>
                  <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                    Closed
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleReopen}
                  disabled={isReopening}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer disabled:opacity-50 flex items-center gap-1"
                >
                  {isReopening ? (
                    <span className="h-3 w-3 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                  ) : null}
                  Reopen Enquiry
                </button>
              </div>

              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    Reason
                  </span>
                  <p className="font-semibold text-gray-800">
                    {closedInfo.reason || "N/A"}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    Custom Remark
                  </span>
                  <p className="text-gray-700 italic whitespace-pre-wrap">
                    {closedInfo.remark || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-3 md:p-4 shrink-0 shadow-[0_-4px_15px_-5px_rgba(0,0,0,0.05)] z-20 border-t border-gray-100 relative">
            {editingId && (
              <div className="absolute -top-8 left-0 right-0 bg-yellow-50 border-t border-b border-yellow-200 px-4 py-1.5 flex justify-between items-center z-10">
                <span className="text-xs font-semibold text-yellow-800 flex items-center gap-2">
                  <Edit2 className="w-3.5 h-3.5" /> Editing Interaction
                </span>
                <button
                  onClick={handleCancelEdit}
                  className="text-[10px] font-bold text-gray-500 hover:text-gray-800 uppercase tracking-wider px-2 py-0.5 bg-white border border-gray-200 rounded shadow-sm cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              {currentWatchStatus === "Closed" ? (
                /* SIMPLIFIED CLOSED VIEW */
                <div className="space-y-2.5 bg-red-50/40 p-3 rounded-2xl border border-red-100">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Status: Closed */}
                    <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 shadow-xs">
                      <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status:</span>
                      <select
                        {...register("status")}
                        className="bg-transparent outline-none text-red-600 font-bold text-xs cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Waiting Response">Waiting Response</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Deal Finalized">Deal Finalized</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>

                    {/* Reason: Dropdown (Required) */}
                    <div className="flex items-center gap-1.5 bg-white border border-red-200 rounded-xl px-2.5 py-1.5 flex-1 min-w-[220px] shadow-xs">
                      <span className="text-[11px] font-bold text-red-700 whitespace-nowrap">Reason:</span>
                      <select
                        {...register("closureReason", { required: true })}
                        className="bg-transparent outline-none text-gray-800 font-medium text-xs w-full cursor-pointer"
                        required
                      >
                        <option value="">Select Reason for Closure...</option>
                        {CLOSURE_REASONS.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Custom Remark (Optional) + Save Button */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-1.5 shadow-xs focus-within:border-blue-400">
                      <input
                        type="text"
                        {...register("closureRemark")}
                        placeholder="Custom Remark (Optional - e.g. Buyer requested reconnect after harvest)"
                        className="w-full bg-transparent text-xs text-gray-800 placeholder:text-gray-400 outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      {isSaving ? (
                        <div className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      ) : null}
                      Close Enquiry
                    </button>
                  </div>
                </div>
              ) : (
                /* STANDARD INTERACTION FORM */
                <>
                  {/* Quick Controls Toolbar */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-full px-2 py-1">
                      {getCommunicationIcon("Call")}
                      <select {...register("communicationType")} className="bg-transparent outline-none text-gray-700 font-medium cursor-pointer">
                        <option value="Call">Call</option>
                        <option value="Email">Email</option>
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Negotiation">Negotiation</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-full px-2 py-1">
                      <Info className="h-3.5 w-3.5 text-gray-400" />
                      <select {...register("status")} className="bg-transparent outline-none text-gray-700 font-medium cursor-pointer">
                        <option value="Pending">Status: Pending</option>
                        <option value="Waiting Response">Waiting Response</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Deal Finalized">Deal Finalized</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>

                    {/* + Create Quotation Button */}
                    <HasPermission permission="quotation:create">
                      <button
                        type="button"
                        onClick={() => setIsQuotationOpen(true)}
                        className="flex items-center gap-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-xs px-3 py-1 rounded-full shadow-sm hover:shadow cursor-pointer transition-all shrink-0"
                        title="Create Quotation for this partner"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        + Create Quotation
                      </button>
                    </HasPermission>

                    <div className="relative flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100/80 border border-blue-100 rounded-full px-3 py-1 ml-auto cursor-pointer transition-colors select-none">
                      <span className="font-semibold text-blue-700 pointer-events-none">Next Follow-Up:</span>
                      {selectedNextDate ? (
                        <span className="text-blue-700 font-medium text-[11px] bg-white px-2 py-0.5 rounded shadow-sm pointer-events-none">
                          {new Date(selectedNextDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                        </span>
                      ) : null}
                      <div className="flex items-center justify-center h-5 w-5 rounded-full pointer-events-none">
                        <Calendar className="h-3.5 w-3.5 text-red-800" />
                      </div>
                      <input
                        type="date"
                        {...register("nextFollowupDate")}
                        onClick={(e) => {
                          if (e.target.showPicker) {
                            try {
                              e.target.showPicker();
                            } catch { }
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                        title="Select Next Follow-Up Date"
                      />
                    </div>
                  </div>

                  {/* Smart Message Input Box */}
                  <div className="flex items-end gap-3">
                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl p-1 focus-within:bg-white focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-sm">

                      {/* Buyer Remark Area */}
                      <div className="px-3 py-2 flex gap-2">
                        <User className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                        <textarea
                          {...buyerField}
                          ref={(el) => {
                            buyerRegisterRef(el);
                            buyerTextareaRef.current = el;
                          }}
                          placeholder="What did the buyer say?"
                          className="w-full bg-transparent resize-none text-[13px] outline-none text-gray-800 placeholder:text-gray-400 min-h-[20px] max-h-[80px]"
                          rows={1}
                          onKeyDown={handleKeyDown}
                          onInput={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                          }}
                        />
                      </div>

                      <div className="h-[1px] w-[95%] mx-auto bg-gray-200"></div>

                      {/* Our Response Area */}
                      <div className="px-3 py-2 flex gap-2">
                        <div className="h-4 w-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[9px] font-bold mt-0.5 shrink-0">ME</div>
                        <textarea
                          {...responseField}
                          ref={(el) => {
                            responseRegisterRef(el);
                            responseTextareaRef.current = el;
                          }}
                          placeholder="Type your response here..."
                          className="w-full bg-transparent resize-none text-[13px] outline-none text-gray-800 placeholder:text-gray-400 min-h-[20px] max-h-[80px]"
                          rows={1}
                          onKeyDown={handleKeyDown}
                          onInput={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                          }}
                        />
                      </div>
                    </div>

                    {/* Send Button */}
                    <button
                      type="submit"
                      disabled={isSaving}
                      className={`mb-1 h-12 w-12 shrink-0 ${editingId ? 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-500/30' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'} text-white rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-md cursor-pointer`}
                    >
                      {isSaving ? (
                        <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      ) : editingId ? (
                        <Edit2 className="w-5 h-5 ml-0.5" />
                      ) : (
                        <Send className="w-5 h-5 ml-0.5" />
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        )}
      </div>
      <UserProfileModal
        user={selectedUserProfile}
        isOpen={!!selectedUserProfile}
        onClose={() => setSelectedUserProfile(null)}
      />
      <CreateQuotationDrawer
        isOpen={isQuotationOpen}
        onClose={() => setIsQuotationOpen(false)}
        followUp={{ partner, id: editingId || undefined }}
        onQuotationCreated={() => {
          isSendingRef.current = true;
          if (isEnquiry) {
            fetchEnquiryActivities(false);
          } else {
            fetchFollowUps(false);
          }
        }}
      />
      <QuotationPreviewDrawer
        isOpen={isPreviewDrawerOpen}
        onClose={() => {
          setIsPreviewDrawerOpen(false);
          setPreviewQuotationId(null);
        }}
        quotationId={previewQuotationId}
      />
    </Drawer>
  );
}

export default React.memo(PartnerFollowUpDrawer);
