"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Truck, Search } from "lucide-react";
import { toast } from "sonner";
import { logisticsApi } from "../services/logisticsApi";
import LogisticsQueueTable from "../components/LogisticsQueueTable";
import TransportDrawer from "../components/TransportDrawer";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/components/common/Pagination";
import { selectActiveCompany } from "@/store/slices/companyContextSlice";
import { selectPendingTransportEnquiryId, selectLatestTransportUpdate, setPendingTransportEnquiryId, setLatestTransportUpdate } from "@/store/slices/notificationsSlice";

export default function LogisticsQueuePage() {
  const company = useSelector(selectActiveCompany);
  const companyCountry = company?.country;

  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  // Read URL query params for deep linking
  const urlSearch = searchParams?.get("search") || "";
  const urlBusinessRef = searchParams?.get("businessRef") || searchParams?.get("businessReference") || "";
  const urlOpenDrawer = searchParams?.get("openDrawer") === "true";
  const urlLogisticsId = searchParams?.get("logisticsId") || "";
  const urlEnquiryId = searchParams?.get("enquiryId") || "";

  // Initial values based on deep-link query parameters
  const initialSearch = urlSearch || urlBusinessRef || "";
  const initialBusinessRef = urlBusinessRef || "";

  const [search, setSearch] = useState(initialSearch);
  const [businessReference, setBusinessReference] = useState(initialBusinessRef);
  const [businessReferenceSortOrder, setBusinessReferenceSortOrder] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [mode, setMode] = useState("All"); // All, Domestic, Export, Merchant Export
  const [statusFilter, setStatusFilter] = useState("Active"); // Active, Closed, Hidden
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  const pendingTransportEnquiryId = useSelector(selectPendingTransportEnquiryId);
  const latestTransportUpdate = useSelector(selectLatestTransportUpdate);

  const [highlightedRowId, setHighlightedRowId] = useState(null);

  // Selected Enquiry for Transport Drawer
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hideTargetEnquiry, setHideTargetEnquiry] = useState(null);
  const [hideLoading, setHideLoading] = useState(false);

  // Ref to prevent multiple auto-open triggers during same session
  const autoOpenHandled = useRef(false);

  // Synchronize state when URL search params change
  useEffect(() => {
    if (!searchParams) return;
    const qSearch = searchParams.get("search") || "";
    const qBRef = searchParams.get("businessRef") || searchParams.get("businessReference") || "";
    const qOpen = searchParams.get("openDrawer") === "true";

    if (qSearch || qBRef) {
      const targetQuery = qSearch || qBRef;
      setSearch(targetQuery);
      setDebouncedSearch(targetQuery);
      if (qBRef) setBusinessReference(qBRef);
    }
    if (qOpen) {
      autoOpenHandled.current = false;
    }
  }, [searchParams]);

  // Debounce search - wait 400ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // reset to page 1 on new search
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page to 1 when mode or statusFilter changes
  useEffect(() => {
    setPage(1);
  }, [mode, statusFilter]);

  // Matching helper to identify targeted row for drawer opening
  const findMatchingEnquiry = useCallback((list) => {
    if (!list || list.length === 0) return null;
    if (urlEnquiryId) {
      const match = list.find((e) => String(e.id) === String(urlEnquiryId));
      if (match) return match;
    }
    if (urlLogisticsId) {
      const match = list.find(
        (e) =>
          String(e.logistics?.id) === String(urlLogisticsId) ||
          String(e.logisticsId) === String(urlLogisticsId)
      );
      if (match) return match;
    }
    if (urlBusinessRef || urlSearch) {
      const q = (urlBusinessRef || urlSearch).toLowerCase().trim();
      const match = list.find((e) => {
        const bRef = String(
          e.businessReference ||
            e.purchaseContract?.businessReference ||
            e.businessTransaction?.businessReference ||
            ""
        ).toLowerCase();
        const eNo = String(e.enquiryNo || "").toLowerCase();
        const cNo = String(e.purchaseContract?.contractNumber || "").toLowerCase();
        return (
          bRef === q ||
          bRef.includes(q) ||
          eNo === q ||
          eNo.includes(q) ||
          cNo === q ||
          cNo.includes(q)
        );
      });
      if (match) return match;
    }
    // If only 1 result returned or user specifically searched for this record, pick it
    if (list.length === 1) return list[0];
    if ((urlBusinessRef || urlSearch) && list.length > 0) return list[0];
    return null;
  }, [urlEnquiryId, urlLogisticsId, urlBusinessRef, urlSearch]);

  // Main data fetch - runs whenever any filter, page, or refreshKey changes
  useEffect(() => {
    let cancelled = false;

    const fetchQueue = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 10,
          ...(debouncedSearch && { search: debouncedSearch }),
          ...(businessReference && { businessReference }),
          ...(businessReferenceSortOrder && {
            sortBy: "businessReference",
            sortOrder: businessReferenceSortOrder,
          }),
          ...(mode !== "All" && { mode }),
          ...(statusFilter !== "Hidden" && { status: statusFilter }),
          ...(statusFilter === "Hidden" && { hiddenOnly: true }),
        };
        const res = await logisticsApi.getAll(params);
        if (!cancelled) {
          const list = res.data?.data || [];
          setData(list);
          setTotal(res.data?.total || 0);
          setTotalPages(res.data?.totalPages || 1);

          // Deep-link auto-open handling
          if (urlOpenDrawer && !autoOpenHandled.current) {
            const matched = findMatchingEnquiry(list);
            if (matched) {
              autoOpenHandled.current = true;
              setSelectedEnquiry(matched);
              setDrawerOpen(true);
              setHighlightedRowId(matched.id);

              // Clear openDrawer parameter from URL silently without reloading
              try {
                const url = new URL(window.location.href);
                url.searchParams.delete("openDrawer");
                window.history.replaceState(
                  {},
                  "",
                  url.pathname + (url.searchParams.toString() ? `?${url.searchParams.toString()}` : "")
                );
              } catch (e) {
                console.warn("Could not clean openDrawer query param:", e);
              }
            } else if (urlEnquiryId) {
              // Direct fallback if not on current page or filtered
              try {
                const directRes = await logisticsApi.getDetails(urlEnquiryId);
                if (directRes.data && !cancelled) {
                  autoOpenHandled.current = true;
                  setSelectedEnquiry(directRes.data);
                  setDrawerOpen(true);
                  try {
                    const url = new URL(window.location.href);
                    url.searchParams.delete("openDrawer");
                    window.history.replaceState(
                      {},
                      "",
                      url.pathname + (url.searchParams.toString() ? `?${url.searchParams.toString()}` : "")
                    );
                  } catch (e) {}
                }
              } catch (err) {
                console.warn("Direct enquiry lookup failed:", err);
              }
            }
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch logistics queue", err);
          toast.error("Failed to load logistics queue.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchQueue();

    // Cleanup: if filters change before fetch completes, ignore stale response
    return () => {
      cancelled = true;
    };
  }, [
    page,
    debouncedSearch,
    businessReference,
    businessReferenceSortOrder,
    mode,
    statusFilter,
    refreshKey,
    urlOpenDrawer,
    urlEnquiryId,
    findMatchingEnquiry,
  ]);

  // Handle Redux pending navigation state
  useEffect(() => {
    if (pendingTransportEnquiryId && data.length > 0 && !drawerOpen) {
      const target = data.find(
        (item) =>
          item.id === pendingTransportEnquiryId ||
          item.id === Number(pendingTransportEnquiryId)
      );
      if (target) {
        setSelectedEnquiry(target);
        setDrawerOpen(true);
        // Clear it so it doesn't reopen unexpectedly
        dispatch(setPendingTransportEnquiryId(null));
      }
    }
  }, [pendingTransportEnquiryId, data, drawerOpen, dispatch]);

  // Fallback deep-link check when data changes
  useEffect(() => {
    if (urlOpenDrawer && !autoOpenHandled.current && data.length > 0 && !drawerOpen) {
      const matched = findMatchingEnquiry(data);
      if (matched) {
        autoOpenHandled.current = true;
        setSelectedEnquiry(matched);
        setDrawerOpen(true);
        setHighlightedRowId(matched.id);

        try {
          const url = new URL(window.location.href);
          url.searchParams.delete("openDrawer");
          window.history.replaceState(
            {},
            "",
            url.pathname + (url.searchParams.toString() ? `?${url.searchParams.toString()}` : "")
          );
        } catch (e) {}
      }
    }
  }, [data, urlOpenDrawer, drawerOpen, findMatchingEnquiry]);

  // Handle real-time transport updates from Redux
  useEffect(() => {
    if (latestTransportUpdate) {
      const payload = latestTransportUpdate;
      setRefreshKey((k) => k + 1);

      if (payload.enquiryId) {
        setHighlightedRowId(payload.enquiryId);
        setTimeout(() => {
          setHighlightedRowId(null);
        }, 5000);
      }

      // Clear the update so it doesn't re-trigger continuously
      dispatch(setLatestTransportUpdate(null));
    }
  }, [latestTransportUpdate, dispatch]);

  const handleOpenDrawer = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setDrawerOpen(true);
    toast.dismiss("new-transport-toast");
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedEnquiry(null);
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.has("openDrawer")) {
        url.searchParams.delete("openDrawer");
        window.history.replaceState(
          {},
          "",
          url.pathname + (url.searchParams.toString() ? `?${url.searchParams.toString()}` : "")
        );
      }
    } catch (e) {}
    setRefreshKey((k) => k + 1); // Trigger refetch on current page
  };

  const handleToggleHidden = async (enquiry) => {
    if (statusFilter !== "Hidden") {
      setHideTargetEnquiry(enquiry);
      return;
    }

    try {
      await logisticsApi.unhideEnquiry(enquiry.id);
      toast.success(`Enquiry ${enquiry.enquiryNo} restored to your Transport queue.`);
      setRefreshKey((key) => key + 1);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to restore enquiry."
      );
      console.error("Failed to update personal Transport visibility", error);
    }
  };

  const confirmHideEnquiry = async () => {
    if (!hideTargetEnquiry) return;
    setHideLoading(true);
    try {
      await logisticsApi.hideEnquiry(hideTargetEnquiry.id);
      toast.success(
        `Enquiry ${hideTargetEnquiry.enquiryNo} hidden from your Transport queue.`
      );
      setHideTargetEnquiry(null);
      setRefreshKey((key) => key + 1);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to hide enquiry.");
      console.error("Failed to hide enquiry from personal Transport queue", error);
    } finally {
      setHideLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
            <Truck className="h-6 w-6 text-[#007aff]" />
            Transport Management
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Evaluate freight quotes, assign logistics, and generate execution shipments.
          </p>
        </div>
      </div>

      {/* Filter and Search Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Mode Tabs */}
          <div className="flex items-center bg-gray-50/80 p-1 rounded-xl border border-gray-100">
            {["All", "Domestic", "Export", "Merchant Export"].map((t) => (
              <button
                key={t}
                onClick={() => setMode(t)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === t
                    ? "bg-white text-gray-900 shadow-xs border border-gray-200/50"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center bg-gray-50/80 p-1 rounded-xl border border-gray-100">
            {[
              { id: "Active", label: "Active Queue" },
              { id: "Closed", label: "Closed" },
              { id: "Hidden", label: "Hidden" },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  statusFilter === st.id
                    ? "bg-slate-800 text-white shadow-xs"
                    : statusFilter === "Hidden" && st.id === "Hidden"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-white text-gray-900 shadow-xs border border-gray-200/50"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Enquiry No, Product, Buyer..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff]"
          />
        </div>
        <input
          type="text"
          aria-label="Business Ref No."
          placeholder="Business Ref No."
          value={businessReference}
          onChange={(e) => {
            setBusinessReference(e.target.value);
            setPage(1);
          }}
          className="w-full md:max-w-[11rem] px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono placeholder-gray-400 focus:outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff]"
        />
      </div>

      {/* Queue Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
        <LogisticsQueueTable
          data={data}
          mode={mode}
          loading={loading}
          onManage={handleOpenDrawer}
          onToggleHidden={handleToggleHidden}
          hiddenOnly={statusFilter === "Hidden"}
          highlightedRowId={highlightedRowId}
          onSortBusinessReference={() =>
            setBusinessReferenceSortOrder((order) => (order === "ASC" ? "DESC" : "ASC"))
          }
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {/* Detail Transport Drawer Workspace */}
      <TransportDrawer
        isOpen={drawerOpen}
        onClose={handleCloseDrawer}
        enquiry={selectedEnquiry}
      />

      <ConfirmModal
        isOpen={hideTargetEnquiry !== null}
        onClose={() => setHideTargetEnquiry(null)}
        onConfirm={confirmHideEnquiry}
        isLoading={hideLoading}
        title="Hide from Transport?"
        message={`Hide enquiry "${hideTargetEnquiry?.enquiryNo}" from your Transport queue? It will remain available in Enquiries and can be restored from the Hidden tab.`}
        confirmLabel="Hide from Transport"
        confirmVariant="primary"
      />
    </div>
  );
}
