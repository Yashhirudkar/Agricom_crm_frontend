"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { selectUserType } from "@/store/slices/authSlice";
import { selectActiveCompanyId } from "@/store/slices/companyContextSlice";
import { ChevronLeft, MessageSquare, Check, AlertCircle } from "lucide-react";
import { useEnquiries } from "@/modules/enquiries/hooks/useEnquiries";
import { enquiriesApi } from "@/modules/enquiries/services/enquiriesApi";
import EnquiriesTable from "@/modules/enquiries/components/EnquiriesTable";
import EnquiriesFilter from "@/modules/enquiries/components/EnquiriesFilter";
import Pagination from "@/components/common/Pagination";
import ConfirmModal from "@/components/modals/ConfirmModal";
import PartnerFollowUpDrawer from "@/components/masters/partners/PartnerFollowUpDrawer";

export default function CompletedEnquiriesListPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const userType = useSelector(selectUserType);
  const activeCompanyId = useSelector(selectActiveCompanyId) || "";

  const [search, setSearch] = useState("");
  const [completedTab, setCompletedTab] = useState("CONFIRMED,COMPLETED");
  const [toast, setToast] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [followUpPartner, setFollowUpPartner] = useState(null);

  const completedQuery = useEnquiries(activeCompanyId, completedTab, search);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await enquiriesApi.remove(deleteTarget.id);
      showToast("Enquiry deleted successfully");
      setDeleteTarget(null);
      completedQuery.fetchEnquiries();
    } catch (e) {
      showToast("Failed to delete enquiry", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFollowUp = (e) => {
    const pId = e.partner?.id || e.partnerId || e.partner_id || e.partner || 0;
    const pName = e.partner?.entityName || e.partnerName || e.partner_name || "Unknown Partner";
    const roleName = e.partner?.partnerRole?.name || e.roleName || e.role_name || "";
    
    setFollowUpPartner({
      partner: { id: pId, entityName: pName, partnerRole: { name: roleName } },
      enquiryId: e.id,
      partnerId: pId,
    });
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
            onClick={() => router.push("/enquiries")}
            className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-[#007aff]" />
              Completed Enquiries (Orders)
            </h1>
            <p className="text-xs text-gray-400 font-medium mt-1">
              View confirmed and closed enquiries.
            </p>
          </div>
        </div>
      </div>

      {/* Completed Enquiries Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        {/* Filters */}
        <EnquiriesFilter
          search={search}
          setSearch={setSearch}
          setPage={completedQuery.setPage}
          total={completedQuery.total}
        />

        {/* Tabs header */}
        <div className="border-b border-gray-100 px-5 flex items-center gap-6">
          <button
            onClick={() => setCompletedTab("CONFIRMED,COMPLETED")}
            className={`py-3.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 -mb-[1px] cursor-pointer ${
              completedTab === "CONFIRMED,COMPLETED"
                ? "border-[#007aff] text-[#007aff]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Confirmed
          </button>
          <button
            onClick={() => setCompletedTab("CLOSED,CANCELLED")}
            className={`py-3.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 -mb-[1px] cursor-pointer ${
              completedTab === "CLOSED,CANCELLED"
                ? "border-[#007aff] text-[#007aff]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Closed
          </button>
        </div>

        <EnquiriesTable
          enquiries={completedQuery.enquiries}
          loading={completedQuery.loading}
          onFollowUp={handleFollowUp}
          onDelete={(e) => setDeleteTarget(e)}
          onExecute={(e) => router.push(`/sales-contracts/new?enquiryId=${e.id}`)}
        />

        <Pagination
          currentPage={completedQuery.page}
          totalPages={completedQuery.totalPages}
          onPageChange={completedQuery.setPage}
        />
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Enquiry"
        message={`Are you sure you want to delete enquiry "${deleteTarget?.enquiryNo}"?`}
      />

      {/* Follow Up Drawer */}
      <PartnerFollowUpDrawer
        isOpen={followUpPartner !== null}
        onClose={() => setFollowUpPartner(null)}
        partner={followUpPartner?.partner}
        enquiryId={followUpPartner?.enquiryId}
        partnerId={followUpPartner?.partnerId}
        entityType="enquiry"
        onSaveSuccess={() => {
          completedQuery.fetchEnquiries();
        }}
      />
    </div>
  );
}
