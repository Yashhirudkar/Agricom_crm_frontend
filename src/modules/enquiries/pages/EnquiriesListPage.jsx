"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanies, selectCompanies } from "@/store/slices/companiesSlice";
import { selectUserType } from "@/store/slices/authSlice";
import { Plus, MessageSquare, Check, AlertCircle } from "lucide-react";
import { useEnquiries } from "../hooks/useEnquiries";
import { enquiriesApi } from "../services/enquiriesApi";
import EnquiriesTable from "../components/EnquiriesTable";
import EnquiriesFilter from "../components/EnquiriesFilter";
import Pagination from "@/components/common/Pagination";
import ConfirmModal from "@/components/modals/ConfirmModal";
import PartnerFollowUpDrawer from "@/components/masters/partners/PartnerFollowUpDrawer";

export default function EnquiriesListPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const userType = useSelector(selectUserType);
  const allCompanies = useSelector(selectCompanies) || [];
  const [selectedCompanyId, setSelectedCompanyId] = useState("");

  const [search, setSearch] = useState("");

  const activeQuery = useEnquiries(selectedCompanyId, "NEW,PENDING,WAITING_RESPONSE,IN_PROGRESS", search);

  const [toast, setToast] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [followUpPartner, setFollowUpPartner] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("activeCompanyId");
      if (stored) setSelectedCompanyId(stored);
    }
  }, []);

  useEffect(() => {
    if (userType === "super_admin") {
      dispatch(fetchCompanies());
    }
  }, [dispatch, userType]);

  const handleCompanyChange = (e) => {
    const val = e.target.value;
    setSelectedCompanyId(val);
    if (typeof window !== "undefined") {
      if (val) localStorage.setItem("activeCompanyId", val);
      else localStorage.removeItem("activeCompanyId");
    }
  };

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
          {userType === "super_admin" && (
            <select
              value={selectedCompanyId}
              onChange={handleCompanyChange}
              className="border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 bg-white"
            >
              <option value="">-- Select Company Context --</option>
              {allCompanies.map((c, idx) => (
                <option key={`company-${c.id || idx}-${idx}`} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={() => router.push("/enquiries/view-orders")}
            className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
          >
            View Orders
          </button>
          <button
            onClick={() => router.push("/enquiries/new")}
            disabled={!selectedCompanyId && userType === "super_admin"}
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
    </div>
  );
}

