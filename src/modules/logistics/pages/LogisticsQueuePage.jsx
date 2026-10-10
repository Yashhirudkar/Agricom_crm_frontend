"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Truck, Search } from "lucide-react";
import { toast } from "sonner";
import { logisticsApi } from "../services/logisticsApi";
import LogisticsQueueTable from "../components/LogisticsQueueTable";
import TransportDrawer from "../components/TransportDrawer";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { useRouter } from "next/navigation";
import Pagination from "@/components/common/Pagination";
import { selectActiveCompany } from "@/store/slices/companyContextSlice";
import { selectPendingTransportEnquiryId, selectLatestTransportUpdate, setPendingTransportEnquiryId, setLatestTransportUpdate } from "@/store/slices/notificationsSlice";

export default function LogisticsQueuePage() {
  const company = useSelector(selectActiveCompany);
  const companyCountry = company?.country;

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [mode, setMode] = useState("All"); // All, Domestic, Export, Merchant Export
  const [statusFilter, setStatusFilter] = useState("Active"); // Active, Closed, Hidden
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);
  
  const router = useRouter();
  const dispatch = useDispatch();
  
  const pendingTransportEnquiryId = useSelector(selectPendingTransportEnquiryId);
  const latestTransportUpdate = useSelector(selectLatestTransportUpdate);
  
  const [highlightedRowId, setHighlightedRowId] = useState(null);

  // Selected Enquiry for Transport Drawer
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hideTargetEnquiry, setHideTargetEnquiry] = useState(null);
  const [hideLoading, setHideLoading] = useState(false);

  // Debounce search — wait 400ms after user stops typing
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

  // Main data fetch — runs whenever any filter, page, or refreshKey changes
  useEffect(() => {
    let cancelled = false;

    const fetchQueue = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 10,
          ...(debouncedSearch && { search: debouncedSearch }),
          ...(mode !== "All" && { mode }),
          ...(statusFilter !== "Hidden" && { status: statusFilter }),
          ...(statusFilter === "Hidden" && { hiddenOnly: true }),
        };
        const res = await logisticsApi.getAll(params);
        if (!cancelled) {
          setData(res.data?.data || []);
          setTotal(res.data?.total || 0);
          setTotalPages(res.data?.totalPages || 1);
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
    return () => { cancelled = true; };
  }, [page, debouncedSearch, mode, statusFilter, refreshKey]);

  // Handle Redux pending navigation state
  useEffect(() => {
    if (pendingTransportEnquiryId && data.length > 0 && !drawerOpen) {
      const target = data.find(item => item.id === pendingTransportEnquiryId || item.id === Number(pendingTransportEnquiryId));
      if (target) {
        setSelectedEnquiry(target);
        setDrawerOpen(true);
        // Clear it so it doesn't reopen unexpectedly
        dispatch(setPendingTransportEnquiryId(null));
      }
    }
  }, [pendingTransportEnquiryId, data, drawerOpen, dispatch]);

  // Handle real-time transport updates from Redux
  useEffect(() => {
    if (latestTransportUpdate) {
      const payload = latestTransportUpdate;
      setRefreshKey(k => k + 1);
      
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
          "Failed to restore enquiry.",
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
        `Enquiry ${hideTargetEnquiry.enquiryNo} hidden from your Transport queue.`,
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
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${mode === t
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
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${statusFilter === st.id
                    ? st.id === "Closed"
                      ? "bg-slate-800 text-white shadow-xs"
                      : st.id === "Hidden"
                        ? "bg-amber-600 text-white shadow-xs"
                        : "bg-white text-gray-900 shadow-xs border border-gray-200/50"
                    : "text-gray-400 hover:text-gray-600"
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
