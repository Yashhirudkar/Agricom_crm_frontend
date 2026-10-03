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

export default function ConfirmedOrdersPage() {
  const router = useRouter();
  const activeCompanyId = useSelector(selectActiveCompanyId) || "";

  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form Drawer states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editEnquiry, setEditEnquiry] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);

  // We explicitly fetch only CONFIRMED enquiries that DO NOT have a Sales Contract mapped yet.
  const confirmedQuery = useEnquiries(activeCompanyId, "CONFIRMED", search, true);

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
      confirmedQuery.fetchEnquiries();
    } catch (e) {
      showToast("Failed to delete order", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-xs font-bold text-white transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${
          toast.type === "error" ? "bg-red-500" : "bg-green-500"
        }`}>
          {toast.type === "error" ? <AlertCircle className="h-4 w-4" /> : <Check className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/sales-contracts")}
            className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <FileCheck className="h-6 w-6 text-[#007aff]" />
              Confirmed Orders
            </h1>
            <p className="text-xs text-gray-400 font-medium mt-1">
              View confirmed orders that are waiting to be converted into Sales Contracts.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        {/* Filters */}
        <EnquiriesFilter
          search={search}
          setSearch={setSearch}
          setPage={confirmedQuery.setPage}
          total={confirmedQuery.total}
        />

        <EnquiriesTable
          isOrderMode={true}
          enquiries={confirmedQuery.enquiries}
          loading={confirmedQuery.loading}
          onFollowUp={(e) => {}}
          onOpenTransport={(e) => {}}
          onOpenLoadingPoints={(e) => {}}
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
          currentPage={confirmedQuery.page}
          totalPages={confirmedQuery.totalPages}
          onPageChange={confirmedQuery.setPage}
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
          confirmedQuery.fetchEnquiries();
          showToast("Order updated successfully");
        }}
      />
    </div>
  );
}
