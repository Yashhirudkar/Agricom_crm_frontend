"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { selectUserType } from "@/store/slices/authSlice";
import { selectActiveCompanyId } from "@/store/slices/companyContextSlice";
import { Plus, MessageSquare, Check, AlertCircle } from "lucide-react";
import { useEnquiries } from "../hooks/useEnquiries";
import { enquiriesApi } from "../services/enquiriesApi";
import EnquiriesTable from "../components/EnquiriesTable";
import EnquiriesFilter from "../components/EnquiriesFilter";
import Pagination from "@/components/common/Pagination";
import ConfirmModal from "@/components/modals/ConfirmModal";
import PartnerFollowUpDrawer from "@/components/masters/partners/PartnerFollowUpDrawer";
import EnquiryDrawer from "../components/EnquiryDrawer";

export default function EnquiriesListPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const enquiryIdParam = searchParams.get("enquiryId");
  const newParam = searchParams.get("new");

  const userType = useSelector(selectUserType);
  const activeCompanyId = useSelector(selectActiveCompanyId) || "";

  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [followUpPartner, setFollowUpPartner] = useState(null);

  // Form Drawer states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editEnquiry, setEditEnquiry] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);

  const activeQuery = useEnquiries(activeCompanyId, "NEW,PENDING,WAITING_RESPONSE,IN_PROGRESS", search);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Deep-link: auto-open the follow-up drawer for the enquiry from notification
  useEffect(() => {
    if (!enquiryIdParam) return;
    const id = enquiryIdParam;
    enquiriesApi.getOne(id)
      .then((enquiry) => {
        if (!enquiry) return;
        const pId = enquiry.partner?.id || enquiry.partnerId || 0;
        const pName = enquiry.partner?.entityName || enquiry.partnerName || "Unknown Partner";
        const roleName = enquiry.partner?.partnerRole?.name || "";
        setFollowUpPartner({
          partner: { id: pId, entityName: pName, partnerRole: { name: roleName } },
          enquiryId: enquiry.id,
          partnerId: pId,
        });
      })
      .catch(() => {
        // silently fail
      });
  }, [enquiryIdParam]);

  // Deep-link: auto-open Create drawer if ?new=true is present
  useEffect(() => {
    if (newParam === "true") {
      setEditEnquiry(null);
      setIsViewMode(false);
      setIsFormOpen(true);

      // Clean query parameter from history
      const url = new URL(window.location.href);
      url.searchParams.delete("new");
      window.history.replaceState({}, "", url.toString());
    }
  }, [newParam]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await enquiriesApi.remove(deleteTarget.id);
      showToast("Enquiry deleted successfully");
      setDeleteTarget(null);
      activeQuery.fetchEnquiries();
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-[#007aff]" />
            Enquiries
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Manage product enquiries and follow-ups.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => router.push("/enquiries/view-orders")}
            className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
          >
            View Orders
          </button>
          <button
            onClick={() => {
              setEditEnquiry(null);
              setIsViewMode(false);
              setIsFormOpen(true);
            }}
            className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm shadow-blue-500/20 cursor-pointer transition-colors self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" /> New Enquiry
          </button>
        </div>
      </div>

      {/* Active Enquiries Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <EnquiriesFilter
          search={search}
          setSearch={setSearch}
          setPage={activeQuery.setPage}
          total={activeQuery.total}
        />

        <EnquiriesTable
          enquiries={activeQuery.enquiries}
          loading={activeQuery.loading}
          onFollowUp={handleFollowUp}
          onDelete={(e) => setDeleteTarget(e)}
          onExecute={(e) => router.push(`/sales-contracts/new?enquiryId=${e.id}`)}
          onEdit={(e) => {
            setEditEnquiry(e);
            setIsViewMode(false);
            setIsFormOpen(true);
          }}
          onView={(e) => {
            setEditEnquiry(e);
            setIsViewMode(true);
            setIsFormOpen(true);
          }}
        />

        <Pagination currentPage={activeQuery.page} totalPages={activeQuery.totalPages} onPageChange={activeQuery.setPage} />
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
          activeQuery.fetchEnquiries();
        }}
      />

      {/* Enquiry View/Create/Edit Drawer */}
      <EnquiryDrawer
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditEnquiry(null);
        }}
        editData={editEnquiry}
        isViewMode={isViewMode}
        onSaveSuccess={() => {
          activeQuery.fetchEnquiries();
          showToast(editEnquiry ? "Enquiry updated successfully" : "Enquiry created successfully");
        }}
      />
    </div>
  );
}
