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
} from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import { toast } from "sonner";
import AddFreightQuoteModal from "../components/AddFreightQuoteModal";
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
  if (!enquiry) return "—";
  const mode = (enquiry.logistics?.transportMode || "").toLowerCase();
  if (mode === "sea") return enquiry.originPort || enquiry.originCity || enquiry.originCountryId || "—";
  if (mode === "rail") return enquiry.originCity || enquiry.originState || "—";
  return enquiry.originCity || enquiry.originPort || enquiry.originState || "—";
}

function getDestinationDisplay(enquiry) {
  if (!enquiry) return "—";
  const mode = (enquiry.logistics?.transportMode || "").toLowerCase();
  if (mode === "sea") return enquiry.destinationPort || enquiry.destinationCity || enquiry.destinationCountry || "—";
  if (mode === "rail") return enquiry.destinationCity || enquiry.destinationState || "—";
  return enquiry.destinationCity || enquiry.destinationPort || enquiry.destinationState || "—";
}

function getEquipmentDisplay(quote) {
  const mode = (quote?.logistics?.transportMode || "").toLowerCase();
  if (mode === "sea") {
    const parts = [quote.containerType, quote.containerSize].filter(Boolean);
    return parts.join(" · ") || quote.vehicleType || "—";
  }
  if (mode === "rail") {
    const parts = [quote.wagonType, quote.wagonCapacity].filter(Boolean);
    return parts.join(" · ") || "—";
  }
  const parts = [quote.truckType, quote.truckCapacity].filter(Boolean);
  return parts.join(" · ") || quote.vehicleType || "—";
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

  // Dynamic dropdown options derived from current data
  const productOptions = useMemo(() => {
    const set = new Set();
    data.forEach((q) => {
      const name = q.logistics?.enquiry?.product?.name;
      if (name) set.add(name);
    });
    return Array.from(set).sort();
  }, [data]);

  // Cascading dropdown options for Origin & Destination
  const originOptions = useMemo(() => {
    const set = new Set();
    data.forEach((q) => {
      const enquiry = q.logistics?.enquiry;
      const orig = getOriginDisplay(enquiry);
      const dest = getDestinationDisplay(enquiry);

      if (destinationFilter !== "all" && dest !== destinationFilter) {
        return;
      }
      if (orig && orig !== "—") set.add(orig);
    });
    return Array.from(set).sort();
  }, [data, destinationFilter]);

  const destinationOptions = useMemo(() => {
    const set = new Set();
    data.forEach((q) => {
      const enquiry = q.logistics?.enquiry;
      const orig = getOriginDisplay(enquiry);
      const dest = getDestinationDisplay(enquiry);

      if (originFilter !== "all" && orig !== originFilter) {
        return;
      }
      if (dest && dest !== "—") set.add(dest);
    });
    return Array.from(set).sort();
  }, [data, originFilter]);

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
      await logisticsApi.deleteFreightQuote(deleteTarget.logisticsId, deleteTarget.id);
      toast.success(`Quote ${deleteTarget.quoteNumber} deleted.`);
      setDeleteTarget(null);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete quote.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Duplicate handler (opens Add modal pre-filled)
  const handleDuplicate = (quote) => {
    setEditTarget({ ...quote, id: undefined, quoteNumber: undefined, isDuplicate: true });
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
            
            {/* Product Dropdown */}
            <div className="relative min-w-[130px] flex-1 sm:flex-none">
              <select
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-2 bg-gray-50/80 border border-gray-200/80 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#007aff] focus:bg-white focus:ring-2 focus:ring-[#007aff]/10 cursor-pointer"
              >
                <option value="all">All Products</option>
                {productOptions.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            </div>

            {/* Origin Dropdown */}
            <div className="relative min-w-[130px] flex-1 sm:flex-none">
              <select
                value={originFilter}
                onChange={(e) => setOriginFilter(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-2 bg-gray-50/80 border border-gray-200/80 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#007aff] focus:bg-white focus:ring-2 focus:ring-[#007aff]/10 cursor-pointer"
              >
                <option value="all">All Origins</option>
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
                <option value="all">All Destinations</option>
                {destinationOptions.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            </div>

            {/* Transport Mode Dropdown */}
            <div className="relative min-w-[130px] flex-1 sm:flex-none">
              <select
                value={transportMode}
                onChange={(e) => setTransportMode(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-2 bg-gray-50/80 border border-gray-200/80 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#007aff] focus:bg-white focus:ring-2 focus:ring-[#007aff]/10 cursor-pointer"
              >
                <option value="All">All Modes</option>
                <option value="Road">Road</option>
                <option value="Sea">Sea Freight</option>
                <option value="Air">Air Freight</option>
                <option value="Rail">Rail</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            </div>

            {/* Quote Status Dropdown */}
            <div className="relative min-w-[130px] flex-1 sm:flex-none">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-2 bg-gray-50/80 border border-gray-200/80 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#007aff] focus:bg-white focus:ring-2 focus:ring-[#007aff]/10 cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="preferred">Preferred</option>
                <option value="active">Active</option>
                <option value="rejected">Rejected</option>
                <option value="expired">Expired</option>
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
                <th className="px-5 py-3.5">Product</th>
                <th className="px-5 py-3.5">Route</th>
                <th className="px-5 py-3.5">Transport Partner</th>
                <th className="px-5 py-3.5">Equipment</th>
                <th className="px-5 py-3.5">
                  <button onClick={() => handleSort("transitDays")} className="flex items-center gap-0.5 cursor-pointer hover:text-gray-600 transition-colors">
                    Transit Days <SortIcon col="transitDays" />
                  </button>
                </th>
                <th className="px-5 py-3.5">
                  <button onClick={() => handleSort("freightAmount")} className="flex items-center gap-0.5 cursor-pointer hover:text-gray-600 transition-colors">
                    Amount <SortIcon col="freightAmount" />
                  </button>
                </th>
                <th className="px-5 py-3.5">
                  <button onClick={() => handleSort("validityDate")} className="flex items-center gap-0.5 cursor-pointer hover:text-gray-600 transition-colors">
                    Valid Till <SortIcon col="validityDate" />
                  </button>
                </th>
                <th className="px-5 py-3.5 text-center">Status</th>
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
              ) : data.length === 0 ? (
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
                data.map((quote) => {
                  const enquiry = quote.logistics?.enquiry;
                  const origin = getOriginDisplay(enquiry);
                  const destination = getDestinationDisplay(enquiry);
                  const equipment = getEquipmentDisplay(quote);
                  const modeStr = quote.logistics?.transportMode || "Road";

                  return (
                    <tr
                      key={quote.id}
                      className={`group hover:bg-blue-50/30 transition-colors ${
                        quote.isPreferred ? "bg-amber-50/20" : ""
                      }`}
                    >
                      {/* Product */}
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-gray-800">
                          {enquiry?.product?.name || "—"}
                        </span>
                      </td>

                      {/* Route: Origin → Destination */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                          <span className="truncate max-w-[120px]" title={origin}>{origin}</span>
                          <ArrowRight className="h-3 w-3 text-gray-300 shrink-0" />
                          <span className="truncate max-w-[120px]" title={destination}>{destination}</span>
                        </div>
                      </td>

                      {/* Transport Partner */}
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-gray-800 block truncate max-w-[140px]">
                          {quote.seller?.entityName || "—"}
                        </span>
                      </td>

                      {/* Equipment */}
                      <td className="px-5 py-3.5">
                        <span className="text-gray-600 truncate max-w-[140px] block">{equipment}</span>
                      </td>

                      {/* Transit Days */}
                      <td className="px-5 py-3.5 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                          quote.transitDays > 0
                            ? "bg-blue-50 text-[#007aff]"
                            : "text-gray-400"
                        }`}>
                          {quote.transitDays > 0 ? `${quote.transitDays}d` : "—"}
                        </span>
                      </td>

                      {/* Freight Amount */}
                      <td className="px-5 py-3.5">
                        <span className="font-bold text-gray-900">
                          {formatMoney(quote.freightAmount, quote.currency)}
                        </span>
                        {quote.currency && quote.currency !== "INR" && (
                          <span className="text-[10px] text-gray-400 font-mono block">{quote.currency}</span>
                        )}
                      </td>

                      {/* Valid Till */}
                      <td className="px-5 py-3.5">
                        {(() => {
                          const dateStr = safeFormatDate(quote.validityDate);
                          const isExpired = quote.validityDate && new Date(quote.validityDate) < new Date();
                          return (
                            <span className={`font-medium ${isExpired ? "text-red-500" : "text-gray-700"}`}>
                              {dateStr}
                              {isExpired && <span className="block text-[10px] font-bold text-red-400">Expired</span>}
                            </span>
                          );
                        })()}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5 text-center">
                        <StatusBadge quote={quote} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
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
          isReadOnly={false}
        />
      )}
    </div>
  );
}
