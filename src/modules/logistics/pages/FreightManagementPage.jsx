"use client";
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { selectActiveCompanyId } from "@/store/slices/companyContextSlice";
import { logisticsApi } from "../services/logisticsApi";
import {
  Package,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ArrowUpDown,
  Eye,
  Pencil,
  Copy,
  Trash2,
  Star,
  StarOff,
  RotateCcw,
  Filter,
  Truck,
  Ship,
  Train,
  Plane,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  ArrowRight,
  DollarSign,
  Calendar,
  ExternalLink,
  Plus,
  ClipboardList
} from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import { toast } from "sonner";
import AddFreightQuoteModal from "../components/AddFreightQuoteModal";
import DirectFreightQuoteDrawer from "../components/DirectFreightQuoteDrawer";
import Pagination from "@/components/common/Pagination";

// ─── Constants ───────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { key: "createdAt", label: "Created Date" },
  { key: "freightAmount", label: "Freight Amount" },
  { key: "transitDays", label: "Transit Days" },
  { key: "validityDate", label: "Valid Till" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getOriginDisplay(enquiry) {
  if (!enquiry) return "N/A";
  const mode = (enquiry.logistics?.transportMode || "").toLowerCase();
  if (mode === "sea") return enquiry.originPort || enquiry.originCity || enquiry.originCountryId || "N/A";
  if (mode === "rail") return enquiry.originCity || enquiry.originState || "N/A";
  return enquiry.originCity || enquiry.originPort || enquiry.originState || "N/A";
}

function getDestinationDisplay(enquiry) {
  if (!enquiry) return "N/A";
  const mode = (enquiry.logistics?.transportMode || "").toLowerCase();
  if (mode === "sea") return enquiry.destinationPort || enquiry.destinationCity || enquiry.destinationCountry || "N/A";
  if (mode === "rail") return enquiry.destinationCity || enquiry.destinationState || "N/A";
  return enquiry.destinationCity || enquiry.destinationPort || enquiry.destinationState || "N/A";
}

function getEquipmentDisplay(quote) {
  const mode = (quote?.logistics?.transportMode || "").toLowerCase();
  if (mode === "sea") {
    const parts = [quote.containerType, quote.containerSize].filter(Boolean);
    return parts.join(" · ") || quote.vehicleType || "N/A";
  }
  if (mode === "rail") {
    const parts = [quote.wagonType, quote.wagonCapacity].filter(Boolean);
    return parts.join(" · ") || "N/A";
  }
  const parts = [quote.truckType, quote.truckCapacity].filter(Boolean);
  return parts.join(" · ") || quote.vehicleType || "N/A";
}

function TransportModeIcon({ mode, className = "h-3.5 w-3.5" }) {
  const m = (mode || "").toLowerCase();
  if (m === "sea") return <Ship className={className} />;
  if (m === "rail") return <Train className={className} />;
  if (m === "air") return <Plane className={className} />;
  return <Truck className={className} />;
}

function getQuoteStatus(quote) {
  if (quote.isPreferred) return "preferred";
  if (quote.isRejected) return "rejected";
  if (quote.validityDate && new Date(quote.validityDate) < new Date()) return "expired";
  const st = (quote.status || "").toLowerCase();
  if (st === "draft") return "draft";
  if (st === "submitted") return "submitted";
  return "active";
}

function StatusBadge({ quote }) {
  const status = getQuoteStatus(quote);

  if (status === "preferred")
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
        <Star className="h-2.5 w-2.5 fill-amber-400 stroke-amber-500" /> Preferred
      </span>
    );
  if (status === "rejected")
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-600 border border-red-100">
        <X className="h-2.5 w-2.5" /> Rejected
      </span>
    );
  if (status === "expired")
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
        <AlertCircle className="h-2.5 w-2.5" /> Expired
      </span>
    );
  if (status === "draft")
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200">
        <Pencil className="h-2.5 w-2.5" /> Draft
      </span>
    );
  if (status === "submitted")
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
        <Clock className="h-2.5 w-2.5" /> Submitted
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
      <CheckCircle2 className="h-2.5 w-2.5" /> Active
    </span>
  );
}

function formatMoney(amount, currency = "INR") {
  if (!amount && amount !== 0) return "—";
  const num = Number(amount);
  if (isNaN(num)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency || "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}

function safeFormatDate(dateStr, fmt = "dd MMM yyyy") {
  if (!dateStr) return "—";
  try {
    const parsed = typeof dateStr === "string" ? parseISO(dateStr) : new Date(dateStr);
    return isValid(parsed) ? format(parsed, fmt) : "—";
  } catch {
    return "—";
  }
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FreightManagementPage() {
  const activeCompanyId = useSelector(selectActiveCompanyId);

  // Data state
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filter & pagination state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [productFilter, setProductFilter] = useState("all");
  const [originFilter, setOriginFilter] = useState("all");
  const [destinationFilter, setDestinationFilter] = useState("all");
  const [transportMode, setTransportMode] = useState("All");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("DESC");
  const [refreshKey, setRefreshKey] = useState(0);

  // Modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  // Confirm delete state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [transportMode, statusFilter, productFilter, originFilter, destinationFilter, dateFrom, dateTo]);

  const [expandedQuotes, setExpandedQuotes] = useState(new Set());

  const toggleQuote = (quoteId) => {
    setExpandedQuotes(prev => {
      const next = new Set(prev);
      if (next.has(quoteId)) next.delete(quoteId);
      else next.add(quoteId);
      return next;
    });
  };

  const normalizedData = useMemo(() => {
    return data.map(quote => {
      const enquiry = quote.logistics?.enquiry;
      const productName = quote.isDirect ? (quote.product?.name || "N/A") : (enquiry?.product?.name || "N/A");
      
      let routes = quote.freightRoutes || [];
      
      if (!routes || routes.length === 0) {
        routes = [{
          id: `legacy_route_${quote.id}`,
          origin: quote.isDirect ? quote.loadingPoint : getOriginDisplay(enquiry),
          destination: quote.isDirect ? quote.destination : getDestinationDisplay(enquiry),
          rates: [{
            id: `legacy_rate_${quote.id}`,
            partner: quote.seller,
            partnerId: quote.sellerId,
            equipment: getEquipmentDisplay(quote),
            transitDays: quote.transitDays,
            currency: quote.currency,
            amount: quote.freightAmount,
            validTill: quote.validityDate,
            status: quote.status || "Active",
            _legacyQuote: quote
          }]
        }];
      }

      let totalQuotes = 0;
      let minRate = Infinity;
      let maxRate = -Infinity;
      let currencyStr = "INR";

      const normalizedRoutes = routes.map((route, routeIdx) => {
        let rMin = Infinity;
        let rMax = -Infinity;
        let rActive = 0;
        let rExpired = 0;
        let rTotalTrans = 0;
        let rTransCount = 0;

        const rates = route.rates || [];
        rates.forEach(rate => {
          totalQuotes++;
          const amt = Number(rate.amount);
          if (!isNaN(amt) && amt > 0) {
            if (amt < minRate) minRate = amt;
            if (amt > maxRate) maxRate = amt;
            if (amt < rMin) rMin = amt;
            if (amt > rMax) rMax = amt;
            if (rate.currency && rate.currency !== 'INR') currencyStr = rate.currency;
          }
          
          const isExpired = rate.validTill && new Date(rate.validTill) < new Date();
          if (isExpired) rExpired++;
          else rActive++;

          const tDays = Number(rate.transitDays);
          if (tDays > 0) {
            rTotalTrans += tDays;
            rTransCount++;
          }
        });

        return {
          ...route,
          routeKey: route.id || `route_${quote.id}_${routeIdx}`,
          stats: {
            quotesCount: rates.length,
            minRate: rMin === Infinity ? null : rMin,
            maxRate: rMax === -Infinity ? null : rMax,
            avgTransit: rTransCount > 0 ? Math.round(rTotalTrans / rTransCount) : null,
            activeQuotes: rActive,
            expiredQuotes: rExpired
          }
        };
      });

      return {
        ...quote,
        productName,
        normalizedRoutes,
        stats: {
          totalRoutes: normalizedRoutes.length,
          totalQuotes,
          minRate: minRate === Infinity ? null : minRate,
          maxRate: maxRate === -Infinity ? null : maxRate,
          currencyStr
        }
      };
    });
  }, [data]);

  // Dynamic dropdown options derived from current data
  const productOptions = useMemo(() => {
    const set = new Set();
    normalizedData.forEach((q) => {
      if (q.productName && q.productName !== "N/A" && q.productName !== "—") set.add(q.productName);
    });
    return Array.from(set).sort();
  }, [normalizedData]);

  // Cascading dropdown options for Origin & Destination
  const originOptions = useMemo(() => {
    const set = new Set();
    normalizedData.forEach((q) => {
      const matchesDest = destinationFilter === "all" || q.normalizedRoutes?.some(r => r.destination === destinationFilter);
      if (!matchesDest) return;

      q.normalizedRoutes?.forEach(r => {
        if (r.origin && r.origin !== "N/A" && r.origin !== "—") set.add(r.origin);
      });
    });
    return Array.from(set).sort();
  }, [normalizedData, destinationFilter]);

  const destinationOptions = useMemo(() => {
    const set = new Set();
    normalizedData.forEach((q) => {
      const matchesOrig = originFilter === "all" || q.normalizedRoutes?.some(r => r.origin === originFilter);
      if (!matchesOrig) return;

      q.normalizedRoutes?.forEach(r => {
        if (r.destination && r.destination !== "N/A" && r.destination !== "—") set.add(r.destination);
      });
    });
    return Array.from(set).sort();
  }, [normalizedData, originFilter]);

  // Auto-reset invalid dependent selections
  useEffect(() => {
    if (originFilter !== "all" && !originOptions.includes(originFilter)) {
      setOriginFilter("all");
    }
  }, [originOptions, originFilter]);

  useEffect(() => {
    if (destinationFilter !== "all" && !destinationOptions.includes(destinationFilter)) {
      setDestinationFilter("all");
    }
  }, [destinationOptions, destinationFilter]);

  // Fetch data
  const fetchData = useCallback(async () => {
    if (!activeCompanyId) return;
    setIsLoading(true);
    try {
      const params = {
        page,
        limit: 15,
        sortBy,
        sortDir,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(productFilter !== "all" && { product: productFilter }),
        ...(originFilter !== "all" && { origin: originFilter }),
        ...(destinationFilter !== "all" && { destination: destinationFilter }),
        ...(transportMode !== "All" && { transportMode }),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(dateFrom && { dateFrom }),
        ...(dateTo && { dateTo }),
      };
      const res = await logisticsApi.getAllFreightQuotes(params);
      setData(res.data?.data || []);
      setTotal(res.data?.total || 0);
      setTotalPages(res.data?.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch freight quotes", err);
      toast.error("Failed to load freight quotes.");
    } finally {
      setIsLoading(false);
    }
  }, [
    activeCompanyId,
    page,
    debouncedSearch,
    productFilter,
    originFilter,
    destinationFilter,
    transportMode,
    statusFilter,
    dateFrom,
    dateTo,
    sortBy,
    sortDir,
    refreshKey,
  ]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Sorting toggle
  const handleSort = (col) => {
    if (sortBy === col) {
      setSortDir((d) => (d === "DESC" ? "ASC" : "DESC"));
    } else {
      setSortBy(col);
      setSortDir("DESC");
    }
    setPage(1);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setProductFilter("all");
    setOriginFilter("all");
    setDestinationFilter("all");
    setTransportMode("All");
    setStatusFilter("all");
    setDateFrom("");
    setDateTo("");
    setSortBy("createdAt");
    setSortDir("DESC");
    setPage(1);
    setRefreshKey((k) => k + 1);
  };

  const hasActiveFilters =
    Boolean(debouncedSearch) ||
    productFilter !== "all" ||
    originFilter !== "all" ||
    destinationFilter !== "all" ||
    transportMode !== "All" ||
    statusFilter !== "all" ||
    Boolean(dateFrom) ||
    Boolean(dateTo);

  // Delete handler
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      if (deleteTarget.isDirect || !deleteTarget.logisticsId) {
        await logisticsApi.deleteDirectFreightQuote(deleteTarget.id);
      } else {
        await logisticsApi.deleteFreightQuote(deleteTarget.logisticsId, deleteTarget.id);
      }
      toast.success(`Quote ${deleteTarget.quoteNumber} deleted.`);
      setDeleteTarget(null);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete quote.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // View handler (opens modal in read-only mode)
  const handleView = (quote) => {
    setEditTarget({ ...quote, isViewOnly: true });
    setAddModalOpen(true);
  };

  // Sort indicator helper
  const SortIcon = ({ col }) => {
    if (sortBy !== col) return <ArrowUpDown className="h-3 w-3 text-gray-300 ml-1 inline" />;
    return sortDir === "DESC"
      ? <ChevronDown className="h-3 w-3 text-[#007aff] ml-1 inline" />
      : <ChevronUp className="h-3 w-3 text-[#007aff] ml-1 inline" />;
  };

  return (
    <div className="p-5 md:p-7 max-w-[1700px] mx-auto space-y-5">

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-sm shadow-blue-500/30">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Freight Management
            </h1>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              View, search, filter and manage all freight quotations across every shipment from one place.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditTarget({ isDirect: true });
              setAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#007aff] to-indigo-600 text-white text-xs font-semibold rounded-xl hover:shadow-md transition-all cursor-pointer shadow-sm shadow-blue-500/20"
          >
            <Plus className="h-3.5 w-3.5" /> Add Freight Quote
          </button>
        </div>
      </div>


      {/* ── Filters & Search ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-4 flex flex-col gap-3.5">

        {/* Row 1: Search Box */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Freight No, Enquiry No, Transport Partner..."
            className="w-full pl-10 pr-9 py-2.5 bg-gray-50/60 border border-gray-200/80 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#007aff] focus:bg-white focus:ring-2 focus:ring-[#007aff]/10 transition-all font-medium"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Row 2: Filter Dropdowns & Right Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3">

          {/* Dropdown Filters Group */}
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">



            {/* Origin Dropdown */}
            <div className="relative min-w-[130px] flex-1 sm:flex-none">
              <select
                value={originFilter}
                onChange={(e) => setOriginFilter(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-2 bg-gray-50/80 border border-gray-200/80 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#007aff] focus:bg-white focus:ring-2 focus:ring-[#007aff]/10 cursor-pointer"
              >
                <option value="all">From</option>
                {originOptions.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            </div>

            {/* Destination Dropdown */}
            <div className="relative min-w-[130px] flex-1 sm:flex-none">
              <select
                value={destinationFilter}
                onChange={(e) => setDestinationFilter(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-2 bg-gray-50/80 border border-gray-200/80 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#007aff] focus:bg-white focus:ring-2 focus:ring-[#007aff]/10 cursor-pointer"
              >
                <option value="all">To</option>
                {destinationOptions.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            </div>



            {/* Date Range Picker */}
            <div className="flex items-center gap-1.5 bg-gray-50/80 border border-gray-200/80 rounded-xl px-2.5 py-1.5 shrink-0">
              <Calendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                title="Start Date"
                className="bg-transparent text-xs font-semibold text-gray-700 outline-none w-[105px] cursor-pointer"
              />
              <span className="text-gray-300 text-xs">—</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                title="End Date"
                className="bg-transparent text-xs font-semibold text-gray-700 outline-none w-[105px] cursor-pointer"
              />
            </div>
          </div>

          {/* Right Action Buttons */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 shrink-0 ml-auto">
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl transition-all cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Filters
              </button>
            </div>
          )}

        </div>

        {hasActiveFilters && (
          <p className="text-[10px] text-gray-400 font-medium pt-0.5">
            Filters active — showing {data.length} of {total} result{total !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* ── Table ────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1300px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60 text-gray-400 uppercase tracking-widest text-[10px] font-bold">
                <th className="px-5 py-3.5 w-10"></th>
                <th className="px-5 py-3.5">Route</th>
                <th className="px-5 py-3.5 text-center">Total Quotes</th>
                <th className="px-5 py-3.5">
                  <button onClick={() => handleSort("freightAmount")} className="flex items-center gap-0.5 cursor-pointer hover:text-gray-600 transition-colors">
                    Lowest Rate <SortIcon col="freightAmount" />
                  </button>
                </th>
                <th className="px-5 py-3.5">Highest Rate</th>
                <th className="px-5 py-3.5">
                  <button onClick={() => handleSort("updatedAt")} className="flex items-center gap-0.5 cursor-pointer hover:text-gray-600 transition-colors">
                    Last Updated <SortIcon col="updatedAt" />
                  </button>
                </th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="py-20 text-center">
                    <Loader2 className="h-7 w-7 animate-spin text-[#007aff] mx-auto mb-2" />
                    <p className="text-xs font-semibold text-gray-400">Loading freight quotes...</p>
                  </td>
                </tr>
              ) : normalizedData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-20 text-center">
                    <Package className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-sm font-bold text-gray-600 mb-1">No Freight Quotes Found</p>
                    <p className="text-xs text-gray-400">
                      {hasActiveFilters
                        ? "Try adjusting your filters or search query."
                        : <>Add your first freight quote by clicking {"Add Freight Quote"}.</>}
                    </p>
                  </td>
                </tr>
              ) : (
                normalizedData.map((quote) => (
                  <React.Fragment key={quote.id}>
                    {/* Main Row */}
                    <tr 
                      className={`group hover:bg-slate-50 transition-colors cursor-pointer border-b border-gray-50 ${quote.isPreferred ? "bg-amber-50/20" : ""}`}
                      onClick={() => toggleQuote(quote.id)}
                    >
                      <td className="px-5 py-3.5 text-slate-400">
                        {expandedQuotes.has(quote.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </td>
                      <td className="px-5 py-3.5 align-top">
                        <div className="flex items-center gap-6 mb-2">
                          <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 ml-[22px]">From</p>
                            <div className="flex items-center gap-1.5 text-[13px] font-bold text-slate-800">
                              <div className="flex items-center justify-center w-4 h-4 rounded bg-blue-50 text-blue-500 shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                              </div>
                              <span className="truncate max-w-[150px]" title={quote.normalizedRoutes?.[0]?.origin}>{quote.normalizedRoutes?.[0]?.origin || "N/A"}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 ml-[22px]">To</p>
                            <div className="flex items-center gap-1.5 text-[13px] font-bold text-slate-800">
                              <div className="flex items-center justify-center w-4 h-4 rounded bg-emerald-50 text-emerald-500 shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                              </div>
                              <span className="truncate max-w-[150px]" title={quote.normalizedRoutes?.[0]?.destination}>{quote.normalizedRoutes?.[0]?.destination || "N/A"}</span>
                            </div>
                          </div>
                          {quote.normalizedRoutes?.length > 1 && (
                            <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-1.5 py-0.5 rounded-md mt-4">+{quote.normalizedRoutes.length - 1} more</span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{quote.quoteNumber}</span>
                        {quote.isDirect ? (
                          <div className="mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-green-50 text-green-700 border border-green-200">
                            <Truck className="h-3 w-3" />
                            DIRECT FREIGHT
                          </div>
                        ) : (
                          <div className="mt-1.5 flex flex-col gap-1 items-start">
                            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              <ClipboardList className="h-3 w-3" />
                              ENQUIRY FREIGHT
                            </div>
                            {quote.logistics?.enquiry?.enquiryNumber && (
                              <span className="text-[9px] text-slate-500 font-medium">Ref: {quote.logistics.enquiry.enquiryNumber}</span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-center font-semibold text-slate-600">{quote.stats.totalQuotes}</td>
                      <td className="px-5 py-3.5 font-bold text-emerald-600">
                        {quote.stats.minRate !== null ? formatMoney(quote.stats.minRate, quote.stats.currencyStr) : "—"}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-slate-600">
                        {quote.stats.maxRate !== null ? formatMoney(quote.stats.maxRate, quote.stats.currencyStr) : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 font-medium">
                        {safeFormatDate(quote.updatedAt)}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <StatusBadge quote={quote} />
                      </td>
                      <td className="px-5 py-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-2 transition-opacity">
                          <button
                            onClick={() => handleView(quote)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditTarget(quote);
                              setAddModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(quote)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Routes */}
                    {expandedQuotes.has(quote.id) && (
                      <tr>
                        <td colSpan="8" className="p-0 bg-slate-50/60 border-b border-slate-200">
                          <div className="pl-[60px] pr-5 py-4 space-y-3">
                            {/* Metadata Banner */}
                            <div className="flex flex-wrap gap-x-6 gap-y-2 items-center bg-slate-100/50 p-3 rounded-lg border border-slate-200 mb-2">
                              {quote.isDirect ? (
                                <>
                                  <div className="text-xs">
                                    <span className="text-slate-400 font-medium mr-1.5">Source:</span>
                                    <span className="font-bold text-slate-700">Created Directly</span>
                                  </div>
                                  <div className="text-xs">
                                    <span className="text-slate-400 font-medium mr-1.5">Created By:</span>
                                    <span className="font-bold text-slate-700">{quote.createdBy?.name || quote.createdById || "System"}</span>
                                  </div>
                                  <div className="text-xs">
                                    <span className="text-slate-400 font-medium mr-1.5">Created Date:</span>
                                    <span className="font-bold text-slate-700">{safeFormatDate(quote.createdAt)}</span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="text-xs flex items-center">
                                    <span className="text-slate-400 font-medium mr-1.5">Linked Enquiry:</span>
                                    <span className="font-bold text-blue-600 hover:underline cursor-pointer">{quote.logistics?.enquiry?.enquiryNumber || "N/A"}</span>
                                  </div>
                                  <div className="text-xs">
                                    <span className="text-slate-400 font-medium mr-1.5">Buyer:</span>
                                    <span className="font-bold text-slate-700">{quote.logistics?.enquiry?.companyName || quote.logistics?.enquiry?.buyer?.name || quote.logistics?.enquiry?.company?.name || "N/A"}</span>
                                  </div>
                                  <div className="text-xs">
                                    <span className="text-slate-400 font-medium mr-1.5">Enquiry Date:</span>
                                    <span className="font-bold text-slate-700">{safeFormatDate(quote.logistics?.enquiry?.enquiryDate || quote.logistics?.enquiry?.createdAt || quote.createdAt)}</span>
                                  </div>
                                  {quote.logistics?.enquiry?.selectedQuoteId && (
                                    <div className="text-xs">
                                      <span className="text-slate-400 font-medium mr-1.5">Selected Quote:</span>
                                      <span className="font-bold text-emerald-600">Yes</span>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                            {quote.normalizedRoutes.map((route) => {
                              return (
                                <div key={route.routeKey} className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                                  {/* Route Header */}
                                  <div className="flex flex-wrap items-center justify-between p-3 border-b border-slate-100 bg-slate-50/50">
                                    <div className="flex items-center gap-6">
                                      <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 ml-[22px]">From</p>
                                        <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-800">
                                          <div className="flex items-center justify-center w-4 h-4 rounded bg-blue-50 text-blue-500 shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                                          </div>
                                          <span className="truncate max-w-[150px]" title={route.origin}>{route.origin}</span>
                                        </div>
                                      </div>
                                      <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 ml-[22px]">To</p>
                                        <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-800">
                                          <div className="flex items-center justify-center w-4 h-4 rounded bg-emerald-50 text-emerald-500 shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                                          </div>
                                          <span className="truncate max-w-[150px]" title={route.destination}>{route.destination}</span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-5 text-[11px] font-semibold text-slate-500">
                                      <div className="flex items-center gap-1.5"><span className="text-slate-400">Quotes:</span> <span className="text-slate-800">{route.stats.quotesCount}</span></div>
                                      <div className="flex items-center gap-1.5"><span className="text-slate-400">Lowest:</span> <span className="text-emerald-600">{route.stats.minRate !== null ? formatMoney(route.stats.minRate, quote.stats.currencyStr) : "—"}</span></div>
                                      <div className="flex items-center gap-1.5"><span className="text-slate-400">Highest:</span> <span className="text-slate-800">{route.stats.maxRate !== null ? formatMoney(route.stats.maxRate, quote.stats.currencyStr) : "—"}</span></div>
                                      <div className="flex items-center gap-1.5"><span className="text-slate-400">Avg Transit:</span> <span className="text-slate-800">{route.stats.avgTransit ? `${route.stats.avgTransit}d` : "—"}</span></div>
                                    </div>
                                  </div>

                                  {/* Expanded Quotes inside Route */}
                                  <div className="bg-white">
                                    <table className="w-full text-left">
                                        <thead>
                                          <tr className="bg-slate-50/50 text-[10px] uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100">
                                            <th className="px-4 py-2.5">Partner</th>
                                            <th className="px-4 py-2.5">Equipment</th>
                                            <th className="px-4 py-2.5 text-center">Transit</th>
                                            <th className="px-4 py-2.5">Amount</th>
                                            <th className="px-4 py-2.5">Valid Till</th>
                                            <th className="px-4 py-2.5 text-center">Status</th>
                                            <th className="px-4 py-2.5 text-center">Actions</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50 text-xs">
                                          {route.rates.map((rate, rIdx) => (
                                            <tr key={rate.id || rIdx} className="hover:bg-slate-50/50 transition-colors group/rate">
                                              <td className="px-4 py-2.5 font-bold text-slate-800 truncate max-w-[140px]" title={rate.partner?.entityName}>
                                                {rate.partner?.entityName || "N/A"}
                                              </td>
                                              <td className="px-4 py-2.5 text-slate-600 font-medium truncate max-w-[120px]">{rate.equipment || "N/A"}</td>
                                              <td className="px-4 py-2.5 text-center">
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold ${rate.transitDays > 0 ? "bg-blue-50 text-[#007aff]" : "text-slate-400"}`}>
                                                  {rate.transitDays > 0 ? `${rate.transitDays}d` : "N/A"}
                                                </span>
                                              </td>
                                              <td className="px-4 py-2.5 font-bold text-slate-900">
                                                {formatMoney(rate.amount, rate.currency)}
                                                {rate.currency && rate.currency !== 'INR' && <span className="ml-1 text-[9px] text-slate-400 font-mono">{rate.currency}</span>}
                                              </td>
                                              <td className="px-4 py-2.5">
                                                {(() => {
                                                  const dateStr = safeFormatDate(rate.validTill);
                                                  const isExpired = rate.validTill && new Date(rate.validTill) < new Date();
                                                  return (
                                                    <span className={`font-medium ${isExpired ? "text-red-500" : "text-slate-600"}`}>
                                                      {dateStr}
                                                      {isExpired && <span className="ml-1 text-[9px] font-bold text-red-400">Expired</span>}
                                                    </span>
                                                  );
                                                })()}
                                              </td>
                                              <td className="px-4 py-2.5 text-center">
                                                <StatusBadge quote={rate._legacyQuote || {...quote, status: rate.status}} />
                                              </td>
                                              <td className="px-4 py-2.5 text-center flex items-center justify-center gap-2">
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleView(rate._legacyQuote || quote);
                                                  }}
                                                  className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                                                  title="View"
                                                >
                                                  <Eye className="h-3 w-3" />
                                                </button>
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditTarget(rate._legacyQuote || quote);
                                                    setAddModalOpen(true);
                                                  }}
                                                  className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                                                  title="Edit"
                                                >
                                                  <Pencil className="h-3 w-3" />
                                                </button>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
        {!isLoading && data.length > 0 && (
          <div className="px-5 py-2.5 border-t border-gray-50 text-[10px] text-gray-400 font-medium">
            Showing {((page - 1) * 15) + 1}–{Math.min((page - 1) * 15 + data.length, total)} of {total} quotes
          </div>
        )}
      </div>

      {/* ── Delete Confirm Modal ─────────────────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-2xl bg-red-50 text-red-600">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Delete Freight Quote</h3>
                <p className="text-xs text-gray-500 mt-0.5">This action cannot be undone.</p>
              </div>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-5 flex gap-2">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-red-800">
                You are about to permanently delete{" "}
                <strong>{deleteTarget.quoteNumber}</strong> from{" "}
                <strong>{deleteTarget.seller?.entityName}</strong>.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                {deleteLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                {deleteLoading ? "Deleting..." : "Delete Quote"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add/Edit Freight Quote Modal ─────────────────────────────────────── */}
      {addModalOpen && (
        editTarget?.isDirect ? (
          <DirectFreightQuoteDrawer
            isOpen={addModalOpen}
            onClose={() => {
              setAddModalOpen(false);
              setEditTarget(null);
            }}
            onSave={async (data) => {
              try {
                if (editTarget?.id && !editTarget?.isDuplicate) {
                  if (data.isDirect) {
                    await logisticsApi.updateDirectFreightQuote(editTarget.id, data);
                    toast.success("Direct Freight quote updated.");
                  } else {
                    await logisticsApi.updateFreightQuote(editTarget.logisticsId, editTarget.id, data);
                    toast.success("Freight quote updated.");
                  }
                } else {
                  await logisticsApi.addDirectFreightQuote(data);
                  toast.success("Direct Freight quote added.");
                }
                setAddModalOpen(false);
                setEditTarget(null);
                setRefreshKey((k) => k + 1);
              } catch (err) {
                toast.error(err?.response?.data?.message || "Failed to save quote.");
              }
            }}
            quote={editTarget}
          />
        ) : (
          <AddFreightQuoteModal
            isOpen={addModalOpen}
            onClose={() => {
              setAddModalOpen(false);
              setEditTarget(null);
            }}
            onSave={async (data) => {
              try {
                if (editTarget?.id && !editTarget?.isDuplicate) {
                  await logisticsApi.updateFreightQuote(editTarget.logisticsId, editTarget.id, data);
                  toast.success("Freight quote updated.");
                } else if (editTarget?.logisticsId) {
                  await logisticsApi.addFreightQuote(editTarget.logisticsId, data);
                  toast.success("Freight quote duplicated.");
                } else {
                  toast.error("Cannot add quote without a logistics context from this view. Please open Transport Management.");
                  return;
                }
                setAddModalOpen(false);
                setEditTarget(null);
                setRefreshKey((k) => k + 1);
              } catch (err) {
                toast.error(err?.response?.data?.message || "Failed to save quote.");
              }
            }}
            quote={editTarget}
            transportMode={editTarget?.logistics?.transportMode || "Road"}
            mode={editTarget?.logistics?.mode || "Domestic"}
            isReadOnly={editTarget?.isViewOnly || false}
          />
        )
      )}
    </div>
  );
}
