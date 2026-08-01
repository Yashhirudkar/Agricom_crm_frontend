"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Drawer from "@/components/common/Drawer";
import { useFollowUpHeaderQuery } from "../queries/follow-ups.query";
import { useQueryClient } from "@tanstack/react-query";
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

  const handleRefresh = async () => {
    await refetch();
  };

  const getCommIcon = (type) => {
    switch (type) {
      case "Call":
        return <Phone className="h-3.5 w-3.5" />;
      case "Email":
        return <Mail className="h-3.5 w-3.5" />;
      case "WhatsApp":
        return <MessageCircle className="h-3.5 w-3.5" />;
      case "Meeting":
        return <Calendar className="h-3.5 w-3.5" />;
      case "Negotiation":
        return <Briefcase className="h-3.5 w-3.5" />;
      default:
        return <Clock className="h-3.5 w-3.5" />;
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case "Critical":
      case "High":
        return "bg-rose-50/50 text-rose-600 border-rose-100/80";
      case "Medium":
        return "bg-amber-50/50 text-amber-600 border-amber-100/80";
      default:
        return "bg-blue-50/50 text-blue-600 border-blue-100/80";
    }
  };

  const getPriorityBorder = (priority) => {
    switch (priority) {
      case "Critical":
      case "High":
        return "border-l-3 border-l-rose-500";
      case "Medium":
        return "border-l-3 border-l-amber-500";
      default:
        return "border-l-3 border-l-blue-500";
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
      return <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Completed</span>;
    }

    if (diffDays === 0) {
      return <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">Today</span>;
    }
    if (diffDays === 1) {
      return <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">Tomorrow</span>;
    }
    if (diffDays < 0) {
      return <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100 animate-pulse">{Math.abs(diffDays)}d overdue</span>;
    }
    return <span className="text-[10px] font-semibold text-slate-500">In {diffDays}d</span>;
  };

  const formattedDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
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

  // Sections config
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
      <div className="flex flex-col flex-1 bg-slate-50/50 font-sans overflow-hidden">

        {/* Sticky Header Summary (Fixed below drawer title) */}
        <div className="shrink-0 bg-white border-b border-slate-200/60 shadow-xs">
          <div className="px-6 py-2.5 bg-slate-50/60 border-b border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Today's Summary</span>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">{stats.pendingTotal} pending total</span>
          </div>

          <div className="grid grid-cols-4 gap-3 p-5">
            {/* Today KPI */}
            <div className="bg-white border border-slate-100 border-t-2 border-t-orange-400 p-3 rounded-xl shadow-xs flex flex-col justify-between hover:shadow-sm hover:scale-102 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Today</p>
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
              </div>
              <p className="text-xl font-bold text-slate-800 mt-2.5 leading-none">{stats.todayCount}</p>
            </div>

            {/* Overdue KPI */}
            <div className="bg-white border border-slate-100 border-t-2 border-t-rose-400 p-3 rounded-xl shadow-xs flex flex-col justify-between hover:shadow-sm hover:scale-102 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Overdue</p>
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
              </div>
              <p className="text-xl font-bold text-slate-800 mt-2.5 leading-none">{stats.overdueCount}</p>
            </div>

            {/* Tomorrow KPI */}
            <div className="bg-white border border-slate-100 border-t-2 border-t-blue-400 p-3 rounded-xl shadow-xs flex flex-col justify-between hover:shadow-sm hover:scale-102 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Tomorrow</p>
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              </div>
              <p className="text-xl font-bold text-slate-800 mt-2.5 leading-none">{stats.tomorrowCount}</p>
            </div>

            {/* Completed KPI */}
            <div className="bg-white border border-slate-100 border-t-2 border-t-emerald-400 p-3 rounded-xl shadow-xs flex flex-col justify-between hover:shadow-sm hover:scale-102 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Done</p>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </div>
              <p className="text-xl font-bold text-slate-800 mt-2.5 leading-none">{stats.completedToday}</p>
            </div>
          </div>
        </div>

        {/* Scrollable Collapsible Sections */}
        <div
          className="flex-1 overflow-y-auto p-5 space-y-6"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <div className="h-6 w-6 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
              <p className="text-xs font-semibold text-slate-400">Loading schedules...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <AlertTriangle className="h-8 w-8 text-rose-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600">Failed to load follow-ups</p>
              <p className="text-[11px] text-slate-400 mt-1">Please try refreshing the feed.</p>
            </div>
          ) : (
            sections.map((sec) => {
              const isExpanded = !!expandedSections[sec.id];
              return (
                <div key={sec.id} className="space-y-3">
                  {/* Collapsible Toggler Header */}
                  <button
                    onClick={() => toggleSection(sec.id)}
                    className="w-full flex items-center justify-between py-2 px-1 text-left hover:bg-slate-100/50 rounded-lg transition-colors focus:outline-none cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-[15px] font-bold text-slate-800 tracking-tight">
                        {sec.label}
                      </span>
                      <span className="bg-slate-200/80 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {sec.count}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${isExpanded ? "rotate-0" : "-rotate-90"
                        }`}
                    />
                  </button>

                  {/* Section Content */}
                  {isExpanded && (
                    <div className="space-y-3.5 transition-all duration-300 animate-in fade-in slide-in-from-top-1">
                      {sec.list.length === 0 ? (
                        // HubSpot-style Dashed Empty State Card
                        <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50/20 shadow-inner">
                          <Inbox className="h-8 w-8 text-slate-300 stroke-[1.5] mx-auto mb-2" />
                          <p className="text-xs font-bold text-slate-700">{sec.emptyMsg}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">You're all caught up.</p>
                        </div>
                      ) : (
                        sec.list.map((item) => {
                          const partnerName = item.partner?.entityName || "Partner";
                          const initials = partnerName.slice(0, 2).toUpperCase();
                          const avatarGrad = getAvatarGradient(partnerName);

                          return (
                            <div
                              key={item.id}
                              className={`bg-white p-4 border border-slate-200/60 rounded-xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between ${getPriorityBorder(
                                item.priority
                              )}`}
                            >
                              <div className="flex items-start gap-3">
                                {/* Initial Avatar Gradient */}
                                <div
                                  className={`h-9 w-9 rounded-full bg-gradient-to-tr ${avatarGrad} text-white font-extrabold flex items-center justify-center text-[11px] shadow-sm flex-shrink-0`}
                                >
                                  {initials}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <h4 className="text-[14px] font-bold text-slate-800 leading-snug truncate">
                                    {partnerName}
                                  </h4>
                                  {item.partner?.country && (
                                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                                      {item.partner.country}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <p className="text-[12px] text-slate-600 line-clamp-2 mt-2.5 italic leading-relaxed">
                                "{item.title || "No description provided"}"
                              </p>

                              {/* Priority & Comm channels */}
                              <div className="flex flex-wrap items-center gap-2 mt-3.5">
                                <span
                                  className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getPriorityBadgeClass(
                                    item.priority
                                  )}`}
                                >
                                  {item.priority}
                                </span>
                                <span className="text-[9px] font-bold bg-slate-50 text-slate-500 border border-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1.5">
                                  {getCommIcon(item.communicationType)}
                                  {item.communicationType}
                                </span>
                                <span className="text-[9px] font-bold bg-slate-50 text-slate-500 border border-slate-100 px-2 py-0.5 rounded-md">
                                  {item.status}
                                </span>
                              </div>

                              {/* Date & Trigger Open */}
                              <div className="border-t border-slate-100 mt-3.5 pt-2.5 flex items-center justify-between shrink-0">
                                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
                                  <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                                  <span>Due: {formattedDate(item.nextFollowupDate)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {getDaysRemainingText(item.nextFollowupDate, item.status)}
                                  <button
                                    onClick={() => handleOpenPartner(item.partnerId)}
                                    className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                    title="Open Partner Screen"
                                  >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                  </button>
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

        {/* Sticky Footer (Fixed at bottom) */}
        <div className="shrink-0 bg-white p-4 border-t border-slate-200/80 flex items-center justify-between gap-3 shadow-xs">
          <button
            onClick={handleRefresh}
            disabled={isRefetching}
            className="p-2.5 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh Feed"
          >
            <RefreshCw className={`h-4 w-4 text-slate-500 ${isRefetching ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={handleViewAll}
            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-blue-200/50"
          >
            View All Follow-ups
          </button>
        </div>

      </div>
    </Drawer>
  );
}
