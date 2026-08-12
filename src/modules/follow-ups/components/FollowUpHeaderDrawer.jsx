"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Drawer from "@/components/common/Drawer";
import { useFollowUpHeaderQuery } from "../queries/follow-ups.query";
import { useQueryClient } from "@tanstack/react-query";
import { getAvatarUrl } from "@/lib/axios";

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
import {
  Calendar,
  AlertTriangle,
  Clock,
  Phone,
  Mail,
  MessageCircle,
  Briefcase,
  ExternalLink,
  ChevronDown,
  RefreshCw,
  CalendarDays,
  CheckCircle,
  Inbox,
  Sparkles
} from "lucide-react";

export default function FollowUpHeaderDrawer({ isOpen, onClose }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Collapsible section state
  const [expandedSections, setExpandedSections] = useState({
    today: true,
    overdue: true,
    tomorrow: false,
    recent: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const { data, isLoading, isError, refetch, isRefetching } = useFollowUpHeaderQuery(isOpen);

  const [highlightedId, setHighlightedId] = useState(null);

  useEffect(() => {
    const handleOpen = (e) => {
      const id = e.detail?.followUpId;
      if (id && data) {
        // Verify if follow-up exists in the loaded lists
        const allItems = [
          ...(data.today || []),
          ...(data.overdue || []),
          ...(data.tomorrow || []),
          ...(data.recent || []),
        ];
        const exists = allItems.some(item => item.id === id);
        
        if (!exists) {
          toast.error("Follow-up no longer available.");
          return;
        }

        // Determine which section has this followUp and expand it
        const sectionId = 
          data.today?.some(item => item.id === id) ? 'today' :
          data.overdue?.some(item => item.id === id) ? 'overdue' :
          data.tomorrow?.some(item => item.id === id) ? 'tomorrow' :
          data.recent?.some(item => item.id === id) ? 'recent' : null;
          
        if (sectionId) {
          setExpandedSections(prev => ({ ...prev, [sectionId]: true }));
        }

        setHighlightedId(id);
        
        // Scroll to element after drawer opens and renders
        setTimeout(() => {
          const el = document.getElementById(`followup-card-${id}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 400);

        // Clear highlight after 2.4 seconds
        setTimeout(() => {
          setHighlightedId(null);
        }, 2400);
      }
    };
    window.addEventListener("open-followups", handleOpen);
    return () => window.removeEventListener("open-followups", handleOpen);
  }, [data]);

  const handleRefresh = async () => {
    await refetch();
  };

  const getCommIcon = (type) => {
    switch (type) {
      case "Call": return <Phone className="h-3 w-3" />;
      case "Email": return <Mail className="h-3 w-3" />;
      case "WhatsApp": return <MessageCircle className="h-3 w-3" />;
      case "Meeting": return <Calendar className="h-3 w-3" />;
      case "Negotiation": return <Briefcase className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case "Critical":
      case "High": return "bg-rose-50 text-rose-600 border-rose-200";
      case "Medium": return "bg-amber-50 text-amber-600 border-amber-200";
      default: return "bg-blue-50 text-blue-600 border-blue-200";
    }
  };

  const getPriorityBorder = (priority) => {
    switch (priority) {
      case "Critical":
      case "High": return "border-l-2 border-l-rose-500";
      case "Medium": return "border-l-2 border-l-amber-500";
      default: return "border-l-2 border-l-blue-500";
    }
  };

  const getDaysRemainingText = (dateStr, itemStatus) => {
    if (!dateStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (["Confirmed", "Closed", "Deal Finalized", "Completed"].includes(itemStatus)) {
      return <span className="text-[9px] font-bold text-emerald-600">Completed</span>;
    }

    if (diffDays === 0) {
      return <span className="text-[9px] font-bold text-orange-600">Today</span>;
    }
    if (diffDays === 1) {
      return <span className="text-[9px] font-bold text-blue-600">Tomorrow</span>;
    }
    if (diffDays < 0) {
      return <span className="text-[9px] font-bold text-rose-600 animate-pulse">{Math.abs(diffDays)}d overdue</span>;
    }
    return <span className="text-[9px] font-medium text-slate-500">In {diffDays}d</span>;
  };

  const getAvatarGradient = (name) => {
    const code = (name || "Partner").charCodeAt(0) % 5;
    const gradients = [
      "from-blue-500 to-indigo-500",
      "from-orange-400 to-amber-500",
      "from-emerald-400 to-teal-500",
      "from-rose-400 to-pink-500",
      "from-purple-500 to-violet-500",
    ];
    return gradients[code];
  };

  const handleViewAll = () => {
    onClose();
    router.push("/follow-ups");
  };

  const handleOpenPartner = (partnerId) => {
    onClose();
    router.push(`/masters/partners?partnerId=${partnerId}`);
  };

  const stats = data?.stats || {
    todayCount: 0,
    tomorrowCount: 0,
    overdueCount: 0,
    upcomingCount: 0,
    completedToday: 0,
    pendingTotal: 0,
  };

  const sections = [
    { id: "today", label: "Today's Follow-ups", count: data?.today?.length || 0, list: data?.today || [], emptyMsg: "No Follow-ups Today" },
    { id: "overdue", label: "Overdue Items", count: data?.overdue?.length || 0, list: data?.overdue || [], emptyMsg: "No Overdue Follow-ups" },
    { id: "tomorrow", label: "Tomorrow's Schedule", count: data?.tomorrow?.length || 0, list: data?.tomorrow || [], emptyMsg: "No Follow-ups Tomorrow" },
    { id: "recent", label: "Recent Interactions", count: data?.recent?.length || 0, list: data?.recent || [], emptyMsg: "No Recent Interactions" }
  ];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Follow-up Center"
      widthClass="w-full sm:w-[500px] md:w-[600px]"
    >
      <div className="flex flex-col flex-1 bg-white font-sans overflow-hidden">

        {/* COMPACT: Sticky Header Summary */}
        <div className="shrink-0 bg-white border-b border-slate-200 z-10 shadow-sm">
          <div className="px-4 py-2 bg-slate-50 flex items-center justify-between border-b border-slate-100">
            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Today's Summary</span>
            <span className="text-[10px] font-semibold text-slate-600 bg-slate-200/60 px-2 py-0.5 rounded-md">{stats.pendingTotal} pending total</span>
          </div>

          <div className="grid grid-cols-4 gap-2 p-3 bg-white">
            <div className="border border-slate-100 border-t-2 border-t-orange-400 p-2 rounded-lg bg-orange-50/20 cursor-pointer">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Today</p>
              <p className="text-lg font-bold text-slate-800 leading-tight mt-0.5">{stats.todayCount}</p>
            </div>
            <div className="border border-slate-100 border-t-2 border-t-rose-400 p-2 rounded-lg bg-rose-50/20 cursor-pointer">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Overdue</p>
              <p className="text-lg font-bold text-rose-600 leading-tight mt-0.5">{stats.overdueCount}</p>
            </div>
            <div className="border border-slate-100 border-t-2 border-t-blue-400 p-2 rounded-lg bg-blue-50/20 cursor-pointer">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Tomorrow</p>
              <p className="text-lg font-bold text-slate-800 leading-tight mt-0.5">{stats.tomorrowCount}</p>
            </div>
            <div className="border border-slate-100 border-t-2 border-t-emerald-400 p-2 rounded-lg bg-emerald-50/20 cursor-pointer">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Done</p>
              <p className="text-lg font-bold text-slate-800 leading-tight mt-0.5">{stats.completedToday}</p>
            </div>
          </div>
        </div>

        {/* Scrollable List Section */}
        <div
          className="flex-1 overflow-y-auto bg-slate-50/30 p-3 space-y-4"
          style={{ scrollbarWidth: "thin" }}
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-2">
              <div className="h-5 w-5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
              <p className="text-xs font-medium text-slate-500">Loading schedules...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-6 w-6 text-rose-500 mx-auto mb-1" />
              <p className="text-xs font-semibold text-slate-700">Failed to load</p>
            </div>
          ) : (
            sections.map((sec) => {
              const isExpanded = !!expandedSections[sec.id];
              return (
                <div key={sec.id} className="space-y-1.5">
                  {/* Compact Header */}
                  <button
                    onClick={() => toggleSection(sec.id)}
                    className="w-full flex items-center justify-between py-1.5 px-2 text-left hover:bg-slate-100 rounded-md transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700">{sec.label}</span>
                      <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                        {sec.count}
                      </span>
                    </div>
                    <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 group-hover:text-slate-600 ${isExpanded ? "rotate-0" : "-rotate-90"}`} />
                  </button>

                  {/* COMPACT: List Content */}
                  {isExpanded && (
                    <div className="space-y-2 px-1">
                      {sec.list.length === 0 ? (
                        <div className="border border-dashed border-slate-200 rounded-lg py-5 text-center bg-slate-50/50">
                          <p className="text-xs font-medium text-slate-500">{sec.emptyMsg}</p>
                        </div>
                      ) : (
                        sec.list.map((item) => {
                          const partnerName = item.partner?.entityName || "Partner";
                          const initials = partnerName.slice(0, 2).toUpperCase();
                          const avatarGrad = getAvatarGradient(partnerName);

                          const isHighlighted = highlightedId === item.id;

                          return (
                            <div
                              key={item.id}
                              id={`followup-card-${item.id}`}
                              className={`bg-white p-3 border border-slate-200/80 rounded-lg shadow-sm hover:border-slate-300 transition-all duration-300 group flex flex-col gap-1.5 ${getPriorityBorder(item.priority)} ${
                                isHighlighted ? "ring-2 ring-yellow-400 scale-102 bg-yellow-50/50 shadow-md" : ""
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                {/* Left Side: Avatar + Name + Tags */}
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className={`h-7 w-7 rounded-full bg-gradient-to-tr ${avatarGrad} text-white font-bold flex items-center justify-center text-[10px] shrink-0`}>
                                    {initials}
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <h4 className="text-[13px] font-bold text-slate-800 truncate" title={partnerName}>
                                      {partnerName}
                                    </h4>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                      <span className={`text-[8.5px] font-bold uppercase px-1.5 py-0.5 rounded border ${getPriorityBadgeClass(item.priority)}`}>
                                        {item.priority}
                                      </span>
                                      <span className="text-[9px] font-medium bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded flex items-center gap-1">
                                        {getCommIcon(item.communicationType)}
                                        {item.communicationType}
                                      </span>
                                      <span className="text-[9px] font-medium text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded">
                                        {item.status}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Right Side: Quick Actions & Time */}
                                <div className="flex flex-col items-end gap-1.5 shrink-0">
                                  {getDaysRemainingText(item.nextFollowupDate, item.status)}
                                  <button
                                    onClick={() => handleOpenPartner(item.partnerId)}
                                    className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    title="Open Partner Screen"
                                  >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Created By Section */}
                              <div className="mt-1.5 pt-1.5 border-t border-slate-100/80 flex flex-col gap-1">
                                <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider">Created By</span>
                                <div className="flex items-center gap-1.5 min-w-0">
                                  {item.createdBy?.avatar ? (
                                    <img
                                      src={getAvatarUrl(item.createdBy.avatar)}
                                      alt={item.createdBy.name}
                                      className="h-6 w-6 rounded-full border border-slate-100 object-cover shrink-0"
                                    />
                                  ) : (
                                    <div className={`h-6 w-6 rounded-full bg-gradient-to-tr ${getAvatarColor(item.createdBy?.name || "Unknown User")} text-white font-extrabold flex items-center justify-center text-[9px] shrink-0`}>
                                      {getInitials(item.createdBy?.name || "Unknown User")}
                                    </div>
                                  )}
                                  <div className="flex flex-col min-w-0 leading-tight">
                                    <span className="text-[11px] font-bold text-slate-700 truncate">
                                      {item.createdBy?.name || "Unknown User"}
                                    </span>
                                    {item.createdBy?.role && (
                                      <span className="text-[9px] text-slate-400 font-semibold truncate leading-none">
                                        {item.createdBy.role}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Compact Footer */}
        <div className="shrink-0 bg-white p-3 border-t border-slate-200 flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefetching}
            className="p-2 border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors disabled:opacity-50"
            title="Refresh Feed"
          >
            <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={handleViewAll}
            className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-[13px] transition-colors flex items-center justify-center gap-1.5"
          >
            View All Follow-ups
          </button>
        </div>

      </div>
    </Drawer>
  );
}