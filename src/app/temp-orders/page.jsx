"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectActiveCompanyId } from "@/store/slices/companyContextSlice";
import { ChevronLeft, FileCheck, Check, AlertCircle } from "lucide-react";
import { useEnquiries } from "@/modules/enquiries/hooks/useEnquiries";
import { enquiriesApi } from "@/modules/enquiries/services/enquiriesApi";
import EnquiriesTable from "@/modules/enquiries/components/EnquiriesTable";
import EnquiriesFilter from "@/modules/enquiries/components/EnquiriesFilter";
import Pagination from "@/components/common/Pagination";
import ConfirmModal from "@/components/modals/ConfirmModal";
import EnquiryDrawer from "@/modules/enquiries/components/EnquiryDrawer";
import LoadingPointsDrawer from "@/modules/enquiries/components/LoadingPointsDrawer";
import TransportDrawer from "@/modules/logistics/components/TransportDrawer";

export default function TempOrdersPage() {
  const router = useRouter();
  const activeCompanyId = useSelector(selectActiveCompanyId) || "";

  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [activeTab, setActiveTab] = useState("CONFIRMED"); // "CONFIRMED" | "CLOSED"

  // Form Drawer states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editEnquiry, setEditEnquiry] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);

  // Transport & Loading Points Drawer states
  const [transportEnquiry, setTransportEnquiry] = useState(null);
  const [loadingPointsEnquiry, setLoadingPointsEnquiry] = useState(null);

  // Fetch enquiries based on the active tab status. 
  // We pass false for both withoutSalesContract and withoutPurchaseContract
  // so that it shows ALL enquiries for that status, regardless of contract creation.
  const enquiriesQuery = useEnquiries(
    activeCompanyId,
    activeTab === "ALL" ? "" : activeTab, // Empty string fetches all
    search,
    false, // withoutSalesContract
    false  // withoutPurchaseContract
  );

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await enquiriesApi.remove(deleteTarget.id);
      showToast("Order deleted successfully");
      setDeleteTarget(null);
      enquiriesQuery.fetchEnquiries();
    } catch (e) {
      showToast("Failed to delete order", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const tabs = [
    { id: "ALL", label: "All Enquiries" },
    { id: "CONFIRMED", label: "Confirmed" },
    { id: "CANCELLED", label: "Cancelled" },
    { id: "CLOSED", label: "Closed" },
    { id: "COMPLETED", label: "Completed" },
  ];

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-xs font-bold text-white transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${toast.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}>
          {toast.type === "error" ? <AlertCircle className="h-4 w-4" /> : <Check className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <FileCheck className="h-6 w-6 text-[#007aff]" />
              Temp Orders View
            </h1>
            <p className="text-xs text-gray-400 font-medium mt-1">
              Temporary view showing Enquiries across different statuses (including converted ones).
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-100 flex flex-wrap gap-6 px-6 bg-gray-50/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 pt-5 text-sm font-semibold transition-colors relative ${activeTab === tab.id
                  ? "text-[#007aff]"
                  : "text-gray-500 hover:text-gray-900"
                }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#007aff] rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Filters */}
        <EnquiriesFilter
          search={search}
          setSearch={setSearch}
          setPage={enquiriesQuery.setPage}
          total={enquiriesQuery.total}
        />

        <EnquiriesTable
          isOrderMode={true}
          enquiries={enquiriesQuery.enquiries}
          loading={enquiriesQuery.loading}
          onFollowUp={(e) => { }}
          onOpenTransport={(e) => setTransportEnquiry(e)}
          onOpenLoadingPoints={(e) => setLoadingPointsEnquiry(e)}
          onDelete={(e) => setDeleteTarget(e)}
          onExecute={(e) => router.push(`/sales-contracts/new?enquiryId=${e.id}`)}
          onView={(e) => {
            setEditEnquiry(e);
            setIsViewMode(true);
            setIsFormOpen(true);
          }}
          onEdit={(e) => {
            setEditEnquiry(e);
            setIsViewMode(false);
            setIsFormOpen(true);
          }}
        />

        <Pagination
          currentPage={enquiriesQuery.page}
          totalPages={enquiriesQuery.totalPages}
          onPageChange={enquiriesQuery.setPage}
        />
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Order"
        message={`Are you sure you want to delete order "${deleteTarget?.enquiryNo}"?`}
      />

      {/* Enquiry View/Edit Drawer */}
      <EnquiryDrawer
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditEnquiry(null);
        }}
        editData={editEnquiry}
        isViewMode={isViewMode}
        onSaveSuccess={() => {
          enquiriesQuery.fetchEnquiries();
          showToast("Order updated successfully");
        }}
      />

      {/* Transport Drawer (View Only Mode) */}
      <TransportDrawer
        isOpen={transportEnquiry !== null}
        onClose={() => setTransportEnquiry(null)}
        enquiry={transportEnquiry}
        isReadOnly={true}
      />

      {/* Loading Points Drawer */}
      <LoadingPointsDrawer
        isOpen={loadingPointsEnquiry !== null}
        onClose={() => setLoadingPointsEnquiry(null)}
        enquiry={loadingPointsEnquiry}
      />
    </div>
  );
}
