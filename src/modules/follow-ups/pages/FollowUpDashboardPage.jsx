"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  useFollowUpStatsQuery,
  useFollowUpListQuery,
  FOLLOW_UP_QUERY_KEYS
} from "../queries/follow-ups.query";
import FollowUpCompleteModal from "../components/FollowUpCompleteModal";
import FollowUpRescheduleModal from "../components/FollowUpRescheduleModal";
import CreateQuotationDrawer from "../components/CreateQuotationDrawer";
import Pagination from "@/components/common/Pagination";
import HasPermission from "@/components/rbac/HasPermission";
import {
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  Briefcase,
  Clock,
  Search,
  Filter,
  RefreshCw,
  CalendarClock,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  Trash2,
  CalendarDays,
  Plus,
  AlertTriangle
} from "lucide-react";
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

export default function FollowUpDashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Filters State
  const [filter, setFilter] = useState(""); // 'today' | 'tomorrow' | 'overdue' | 'upcoming' | ''
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [communicationType, setCommunicationType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Modals State
  const [selectedFollowUp, setSelectedFollowUp] = useState(null);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isQuotationOpen, setIsQuotationOpen] = useState(false);
  const [quotationFollowUp, setQuotationFollowUp] = useState(null);

  // Debounce search text
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // reset to page 1 on search change
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch counts & lists
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useFollowUpStatsQuery();

  const queryParams = useMemo(() => {
    const params = { page, limit };
    if (filter) params.filter = filter;
    if (debouncedSearch) params.search = debouncedSearch;
    if (status) params.status = status;
    if (priority) params.priority = priority;
    if (communicationType) params.communicationType = communicationType;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    return params;
  }, [filter, debouncedSearch, status, priority, communicationType, startDate, endDate, page, limit]);

  const { data: listData, isLoading: listLoading, refetch: refetchList } = useFollowUpListQuery(queryParams);

  const handleRefresh = () => {
    refetchStats();
    refetchList();
  };

  const handleClearFilters = () => {
    setFilter("");
    setSearch("");
    setStatus("");
    setPriority("");
    setCommunicationType("");
    setStartDate("");
    setEndDate("");
    setPage(1);
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

  const getPriorityBadge = (priority) => {
    let classes = "bg-gray-50 text-gray-500 border-gray-100";
    if (priority === "High" || priority === "Critical") {
      classes = "bg-rose-50 text-rose-700 border-rose-100 font-bold";
    } else if (priority === "Medium") {
      classes = "bg-amber-50 text-amber-700 border-amber-100 font-bold";
    } else if (priority === "Low") {
      classes = "bg-blue-50 text-blue-700 border-blue-100";
    }

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border font-medium ${classes}`}>
        {priority}
      </span>
    );
  };

  const getStatusBadge = (item) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(item.nextFollowupDate);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let classes = "bg-gray-50 text-gray-500 border-gray-200";
    let text = item.status;

    if (item.status === "Pending") {
      if (!item.nextFollowupDate) {
        classes = "bg-gray-50 text-gray-500 border-gray-200";
        text = "Pending";
      } else if (diffDays < 0) {
        classes = "bg-rose-50 text-rose-700 border-rose-100";
        text = "Overdue";
      } else if (diffDays === 0) {
        classes = "bg-orange-50 text-orange-700 border-orange-100 animate-pulse";
        text = "Today";
      } else if (diffDays === 1) {
        classes = "bg-blue-50 text-blue-700 border-blue-100";
        text = "Tomorrow";
      }
    } else if (["Confirmed", "Closed", "Deal Finalized", "Completed"].includes(item.status)) {
      classes = "bg-emerald-50 text-emerald-700 border-emerald-100";
    }

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border font-semibold ${classes}`}>
        {text}
      </span>
    );
  };

  const getDaysRemainingText = (dateStr, itemStatus) => {
    if (!dateStr) return "-";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (["Confirmed", "Closed", "Deal Finalized", "Completed"].includes(itemStatus)) {
      return <span className="text-gray-400 font-medium">Completed</span>;
    }

    if (diffDays === 0) {
      return <span className="text-orange-600 font-bold">Today</span>;
    }
    if (diffDays === 1) {
      return <span className="text-blue-600 font-medium">Tomorrow</span>;
    }
    if (diffDays < 0) {
      return <span className="text-rose-600 font-bold animate-pulse">{Math.abs(diffDays)} days overdue</span>;
    }
    return <span className="text-gray-600 font-medium">In {diffDays} days</span>;
  };

  const formattedDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formattedTime = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const counts = stats || {
    todayCount: 0,
    tomorrowCount: 0,
    overdueCount: 0,
    upcomingCount: 0,
    completedToday: 0,
    pendingTotal: 0,
  };

  return (
    <div className="flex-1 flex flex-col gap-6 p-6 min-h-0 bg-gray-50/40 font-sans">
      
      {/* Page Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Follow-up Console</h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Manage, schedule, and log customer touchpoints in real-time.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="p-2 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 rounded-xl text-gray-600 transition-all cursor-pointer shadow-xs bg-white flex items-center gap-1.5 text-xs font-semibold"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      {/* Dashboard Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 shrink-0">
        {[
          {
            id: "today",
            title: "Today's Work",
            count: counts.todayCount,
            bgClass: "bg-orange-50 border-orange-200/60 hover:border-orange-300",
            textClass: "text-orange-700",
            countClass: "text-orange-800",
            icon: <Clock className="h-4 w-4 text-orange-500" />,
            action: () => {
              setFilter("today");
              setStatus("");
            },
            isActive: filter === "today"
          },
          {
            id: "tomorrow",
            title: "Tomorrow",
            count: counts.tomorrowCount,
            bgClass: "bg-blue-50 border-blue-200/60 hover:border-blue-300",
            textClass: "text-blue-700",
            countClass: "text-blue-800",
            icon: <Calendar className="h-4 w-4 text-blue-500" />,
            action: () => {
              setFilter("tomorrow");
              setStatus("");
            },
            isActive: filter === "tomorrow"
          },
          {
            id: "overdue",
            title: "Overdue Items",
            count: counts.overdueCount,
            bgClass: "bg-rose-50 border-rose-200/60 hover:border-rose-300",
            textClass: "text-rose-700",
            countClass: "text-rose-800",
            icon: <AlertTriangle className="h-4 w-4 text-rose-500" />,
            action: () => {
              setFilter("overdue");
              setStatus("");
            },
            isActive: filter === "overdue"
          },
          {
            id: "upcoming",
            title: "Upcoming",
            count: counts.upcomingCount,
            bgClass: "bg-indigo-50 border-indigo-200/60 hover:border-indigo-300",
            textClass: "text-indigo-700",
            countClass: "text-indigo-800",
            icon: <CalendarDays className="h-4 w-4 text-indigo-500" />,
            action: () => {
              setFilter("upcoming");
              setStatus("");
            },
            isActive: filter === "upcoming"
          },
          {
            id: "total_pending",
            title: "Pending Total",
            count: counts.pendingTotal,
            bgClass: "bg-gray-50 border-gray-200 hover:border-gray-300",
            textClass: "text-gray-700",
            countClass: "text-gray-800",
            icon: <CalendarClock className="h-4 w-4 text-gray-500" />,
            action: () => {
              setFilter("");
              setStatus("Pending");
            },
            isActive: !filter && status === "Pending"
          },
          {
            id: "completed_today",
            title: "Completed Today",
            count: counts.completedToday,
            bgClass: "bg-emerald-50 border-emerald-200/60 hover:border-emerald-300",
            textClass: "text-emerald-700",
            countClass: "text-emerald-800",
            icon: <CheckCircle className="h-4 w-4 text-emerald-500" />,
            action: () => {
              setFilter("");
              setStatus("Confirmed"); // display completed items
            },
            isActive: !filter && (status === "Confirmed" || status === "Closed")
          }
        ].map((card) => (
          <div
            key={card.id}
            onClick={card.action}
            className={`border p-4 rounded-2xl shadow-xs cursor-pointer transition-all ${card.bgClass} ${
              card.isActive ? "ring-2 ring-blue-500 ring-offset-2 scale-102 font-bold" : "hover:shadow-md"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-extrabold uppercase tracking-wider ${card.textClass}`}>
                {card.title}
              </span>
              {card.icon}
            </div>
            <p className={`text-2xl font-black mt-2 leading-none ${card.countClass}`}>{card.count}</p>
          </div>
        ))}
      </div>

      {/* Toolbar Filter Section */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-4 flex flex-col lg:flex-row gap-4 items-center justify-between shrink-0 shadow-xs">
        
        {/* Left Toolbar Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:flex flex-wrap items-center gap-3 w-full lg:w-auto">
          
          {/* Text Search */}
          <div className="relative min-w-[200px]">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Buyer or Notes..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-gray-700 bg-gray-50/50"
            />
          </div>

          {/* Status Dropdown */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-gray-600 bg-white"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Closed">Closed</option>
            <option value="Deal Finalized">Deal Finalized</option>
          </select>

          {/* Priority Dropdown */}
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-gray-600 bg-white"
          >
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Channel / Comm Method Dropdown */}
          <select
            value={communicationType}
            onChange={(e) => setCommunicationType(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-gray-600 bg-white"
          >
            <option value="">All Channels</option>
            <option value="Call">Call</option>
            <option value="Email">Email</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Meeting">Meeting</option>
            <option value="Negotiation">Negotiation</option>
          </select>

          {/* Date Picker Start */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase">From</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2.5 py-1.5 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-gray-600 bg-white"
            />
          </div>

          {/* Date Picker End */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase">To</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2.5 py-1.5 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 text-gray-600 bg-white"
            />
          </div>

        </div>

        {/* Clear Filters Action Button */}
        {(filter || search || status || priority || communicationType || startDate || endDate) && (
          <button
            onClick={handleClearFilters}
            className="w-full lg:w-auto text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3.5 py-2 rounded-xl transition-colors cursor-pointer border border-rose-100 shrink-0"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Main Data Table Panel */}
      <div className="flex-1 bg-white border border-gray-200/80 rounded-2xl shadow-xs overflow-hidden flex flex-col min-h-0">
        
        {/* Table Body Area */}
        <div className="flex-1 overflow-x-auto min-h-0">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest shrink-0">
                <th className="px-6 py-4">Buyer / Partner</th>
                <th className="px-6 py-4">Channel</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Next Follow-up</th>
                <th className="px-6 py-4">Timeline</th>
                <th className="px-6 py-4">Created By</th>
                <th className="px-6 py-4">Updated At</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-700">
              {listLoading ? (
                // Table skeleton loader
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-5"><div className="h-4 bg-gray-100 rounded-md w-36" /></td>
                    <td className="px-6 py-5"><div className="h-4 bg-gray-100 rounded-md w-16" /></td>
                    <td className="px-6 py-5"><div className="h-4 bg-gray-100 rounded-md w-14" /></td>
                    <td className="px-6 py-5"><div className="h-4 bg-gray-100 rounded-md w-16" /></td>
                    <td className="px-6 py-5"><div className="h-4 bg-gray-100 rounded-md w-20" /></td>
                    <td className="px-6 py-5"><div className="h-4 bg-gray-100 rounded-md w-24" /></td>
                    <td className="px-6 py-5"><div className="h-4 bg-gray-100 rounded-md w-20" /></td>
                    <td className="px-6 py-5"><div className="h-4 bg-gray-100 rounded-md w-24" /></td>
                    <td className="px-6 py-5 text-right"><div className="h-7 bg-gray-100 rounded-md w-24 ml-auto" /></td>
                  </tr>
                ))
              ) : !listData || listData.data?.length === 0 ? (
                // Empty Table Illustration
                <tr>
                  <td colSpan={9} className="text-center py-20">
                    <div className="flex flex-col items-center justify-center opacity-60">
                      <div className="p-4 bg-gray-50 rounded-full text-gray-300 border border-gray-100">
                        <CalendarClock className="h-10 w-10" />
                      </div>
                      <h3 className="font-extrabold text-gray-800 text-sm mt-3">No follow-ups logged</h3>
                      <p className="text-xs text-gray-400 mt-1 max-w-[280px]">
                        No records match your selected filters. Adjust your search parameters or query filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                listData.data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    
                    {/* Buyer */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <button
                          onClick={() => router.push(`/masters/partners?partnerId=${item.partnerId}`)}
                          className="text-left font-bold text-gray-900 hover:text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          {item.partner?.entityName}
                          <ExternalLink className="h-3 w-3 inline text-gray-300 hover:text-blue-500" />
                        </button>
                        {item.buyerRemark && (
                          <span className="text-[10px] text-gray-500 max-w-[240px] truncate mt-0.5" title={item.buyerRemark}>
                            "{item.buyerRemark}"
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Channel */}
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-gray-600 font-semibold">
                        {getCommIcon(item.communicationType)}
                        {item.communicationType}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="px-6 py-4">{getPriorityBadge(item.priority)}</td>

                    {/* Status */}
                    <td className="px-6 py-4">{getStatusBadge(item)}</td>

                    {/* Next Date */}
                    <td className="px-6 py-4 text-gray-900 font-semibold">
                      {formattedDate(item.nextFollowupDate)}
                    </td>

                    {/* Timeline Days */}
                    <td className="px-6 py-4">{getDaysRemainingText(item.nextFollowupDate, item.status)}</td>

                    {/* Creator */}
                    <td className="px-6 py-4">
                      {item.createdBy ? (
                        <div className="flex items-center gap-2.5">
                          {item.createdBy.avatar ? (
                            <img
                              src={getAvatarUrl(item.createdBy.avatar)}
                              alt={item.createdBy.name}
                              className="h-8 w-8 rounded-full border border-gray-100 object-cover shadow-xs shrink-0"
                            />
                          ) : (
                            <div className={`h-8 w-8 rounded-full border border-gray-200/60 bg-gradient-to-tr ${getAvatarColor(item.createdBy.name)} flex items-center justify-center text-xs font-bold shadow-xs shrink-0`}>
                              {getInitials(item.createdBy.name)}
                            </div>
                          )}
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-gray-900 truncate max-w-[150px]">
                              {item.createdBy.name}
                            </span>
                            {item.createdBy.role && (
                              <span className="text-[10px] text-gray-500 font-medium truncate max-w-[150px] leading-tight">
                                {item.createdBy.role}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Unknown User</span>
                      )}
                    </td>

                    {/* Update Date */}
                    <td className="px-6 py-4 text-gray-400 font-semibold">
                      {formattedTime(item.updatedAt)}
                    </td>

                    {/* Actions List */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {item.status === "Pending" && (
                          <>
                            <HasPermission permission="quotation:create">
                              <button
                                onClick={() => {
                                  setQuotationFollowUp(item);
                                  setIsQuotationOpen(true);
                                }}
                                className="px-2.5 py-1.5 bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200/50 rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                                title="Create Quotation"
                              >
                                + Quote
                              </button>
                            </HasPermission>
                            <button
                              onClick={() => {
                                setSelectedFollowUp(item);
                                setIsCompleteOpen(true);
                              }}
                              className="px-2.5 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200/50 rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                              title="Mark Complete"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => {
                                setSelectedFollowUp(item);
                                setIsRescheduleOpen(true);
                              }}
                              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/50 rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                              title="Reschedule"
                            >
                              Reschedule
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => router.push(`/masters/partners?partnerId=${item.partnerId}`)}
                          className="px-2 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200/80 rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                          title="Open Timeline / Chat"
                        >
                          Chat
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginated Footer */}
        {listData && (
          <Pagination
            currentPage={page}
            totalPages={listData.meta?.totalPages || 1}
            onPageChange={(p) => setPage(p)}
          />
        )}
      </div>

      {/* Completion Modal */}
      <FollowUpCompleteModal
        isOpen={isCompleteOpen}
        onClose={() => {
          setIsCompleteOpen(false);
          setSelectedFollowUp(null);
        }}
        followUp={selectedFollowUp}
      />

      {/* Reschedule Modal */}
      <FollowUpRescheduleModal
        isOpen={isRescheduleOpen}
        onClose={() => {
          setIsRescheduleOpen(false);
          setSelectedFollowUp(null);
        }}
        followUp={selectedFollowUp}
      />

      {/* Create Quotation Drawer */}
      <CreateQuotationDrawer
        isOpen={isQuotationOpen}
        onClose={() => {
          setIsQuotationOpen(false);
          setQuotationFollowUp(null);
        }}
        followUp={quotationFollowUp}
      />

    </div>
  );
}
