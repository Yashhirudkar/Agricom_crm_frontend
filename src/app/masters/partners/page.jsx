"use client";

import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "@/lib/axios";
import {
  fetchPartners,
  createPartner,
  updatePartner,
  deletePartner,
  restorePartner,
  permanentDeletePartner,
  selectPartners,
  selectPartnersLoading,
  selectPartnersError,
  selectPartnersTotalCount,
  selectPartnersTotalPages,
  clearPartnersError,
} from "@/store/entities/partnerSlice";
import { fetchCompanies, selectCompanies } from "@/store/slices/companiesSlice";
import { selectUserType } from "@/store/slices/authSlice";
import HasPermission from "@/components/rbac/HasPermission";
import ConfirmModal from "@/components/modals/ConfirmModal";
import Pagination from "@/components/common/Pagination";
import { Plus, Users, Check, AlertCircle, Building2 } from "lucide-react";

import PartnersTable from "@/components/masters/partners/PartnersTable";
import PartnersFilters from "@/components/masters/partners/PartnersFilters";
import PartnerDrawer from "@/components/masters/partners/PartnerDrawer";
import PartnerFollowUpDrawer from "@/components/masters/partners/PartnerFollowUpDrawer";
import PermanentDeleteModal from "@/components/common/PermanentDeleteModal";

function PartnersContent() {
  const dispatch = useDispatch();

  const partners = useSelector(selectPartners);
  const isLoading = useSelector(selectPartnersLoading);
  const error = useSelector(selectPartnersError);
  const totalCount = useSelector(selectPartnersTotalCount);
  const totalPages = useSelector(selectPartnersTotalPages);

  const userType = useSelector(selectUserType);
  const allCompanies = useSelector(selectCompanies) || [];
  const [selectedCompanyId, setSelectedCompanyId] = useState("");

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [restoreTarget, setRestoreTarget] = useState(null);
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isFollowUpDrawerOpen, setIsFollowUpDrawerOpen] = useState(false);
  const [followUpPartner, setFollowUpPartner] = useState(null);

  // External dependencies for dropdowns
  const [partnerRoles, setPartnerRoles] = useState([]);
  const [countries, setCountries] = useState([]);
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState("true");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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

  // Load partners list
  useEffect(() => {
    if (selectedCompanyId) {
      dispatch(fetchPartners({ page: currentPage, limit: itemsPerPage, search, isActive: isActiveFilter }));
    }
  }, [dispatch, currentPage, search, isActiveFilter, selectedCompanyId]);

  // Load dropdown dependencies once securely respecting max 100 limit
  useEffect(() => {
    if (!selectedCompanyId) return;
    const fetchDependencies = async () => {
      try {
        const [rolesRes, prodRes] = await Promise.all([
          axiosClient.get("/masters/partner-roles", { params: { limit: 100, isActive: true } }),
          axiosClient.get("/masters/products", { params: { limit: 100, isActive: true } }),
        ]);
        setPartnerRoles(rolesRes.data.data || []);
        setProducts(prodRes.data.data || []);
      } catch (err) {
        showToast("Failed to load master lookup data", "error");
      }
    };
    fetchDependencies();
  }, [selectedCompanyId]);

  const handleCompanyChange = (e) => {
    const val = e.target.value;
    setSelectedCompanyId(val);
    if (val) {
      localStorage.setItem("activeCompanyId", val);
    } else {
      localStorage.removeItem("activeCompanyId");
    }
    setCurrentPage(1);
  };

  const openCreateModal = () => {
    setEditData(null);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditData(item);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const openViewDrawer = (item) => {
    setEditData(item);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openFollowUpDrawer = (item) => {
    setFollowUpPartner(item);
    setIsFollowUpDrawerOpen(true);
  };

  const closeModals = () => {
    setIsModalOpen(false);
    setDeleteTarget(null);
    setRestoreTarget(null);
    setPermanentDeleteTarget(null);
    dispatch(clearPartnersError());
  };

  const closeFollowUpDrawer = () => {
    setIsFollowUpDrawerOpen(false);
    setFollowUpPartner(null);
  };

  const handleModalSubmit = async (payload) => {
    setIsSaving(true);

    try {
      if (editData) {
        await dispatch(updatePartner({ id: editData.id, ...payload })).unwrap();
        showToast("Partner updated successfully");
      } else {
        const createPayload = { ...payload };
        delete createPayload.id;
        await dispatch(createPartner(createPayload)).unwrap();
        showToast("Partner created successfully");
        if (currentPage !== 1) setCurrentPage(1);
        else dispatch(fetchPartners({ page: 1, limit: itemsPerPage, search, isActive: isActiveFilter }));
      }
      closeModals();
    } catch (err) {
      showToast(err || "Failed to save partner", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deletePartner({ id: deleteTarget.id })).unwrap();
      showToast("Partner deactivated successfully");

      if (partners.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        dispatch(fetchPartners({ page: currentPage, limit: itemsPerPage, search, isActive: isActiveFilter }));
      }

      closeModals();
    } catch (err) {
      showToast(err || "Failed to deactivate partner", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestore = async () => {
    setIsDeleting(true);
    try {
      await dispatch(restorePartner(restoreTarget.id)).unwrap();
      showToast("Partner restored successfully");
      dispatch(fetchPartners({ page: currentPage, limit: itemsPerPage, search, isActive: isActiveFilter }));
      closeModals();
    } catch (err) {
      showToast(err || "Failed to restore partner", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePermanentDelete = async (reason) => {
    setIsDeleting(true);
    try {
      await dispatch(permanentDeletePartner({ id: permanentDeleteTarget.id, reason })).unwrap();
      showToast("Partner permanently deleted");

      if (partners.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        dispatch(fetchPartners({ page: currentPage, limit: itemsPerPage, search, isActive: isActiveFilter }));
      }

      closeModals();
    } catch (err) {
      showToast(err || "Failed to permanently delete partner", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading && partners.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-400">Loading partners...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-xs font-bold text-white transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${toast.type === "error" ? "bg-red-500" : "bg-green-500"
            }`}
        >
          {toast.type === "error" ? <AlertCircle className="h-4 w-4" /> : <Check className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-[#007aff]" />
            Business Partners
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Manage buyers, suppliers, logistics providers and their associated contacts.
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

          <HasPermission permission="partner:create">
            <button
              onClick={openCreateModal}
              disabled={!selectedCompanyId}
              className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm shadow-blue-500/20 cursor-pointer transition-colors self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" /> Add Partner
            </button>
          </HasPermission>
        </div>
      </div>

      {!selectedCompanyId ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center shadow-xs">
          <Building2 className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <h2 className="text-sm font-bold text-gray-700 mb-1">Company Context Required</h2>
          <p className="text-xs text-gray-500">
            Please select a company to continue.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <PartnersFilters
            search={search}
            setSearch={setSearch}
            isActiveFilter={isActiveFilter}
            setIsActiveFilter={setIsActiveFilter}
            setCurrentPage={setCurrentPage}
            totalCount={totalCount}
          />

          <PartnersTable
            partners={partners}
            openViewDrawer={openViewDrawer}
            openEditModal={openEditModal}
            openFollowUpDrawer={openFollowUpDrawer}
            setDeleteTarget={setDeleteTarget}
            setRestoreTarget={setRestoreTarget}
            setPermanentDeleteTarget={setPermanentDeleteTarget}
          />

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}

      <PartnerDrawer
        isOpen={isModalOpen}
        onClose={closeModals}
        onSubmit={handleModalSubmit}
        editData={editData}
        isSaving={isSaving}
        error={error}
        isEditMode={isEditMode}
        countries={countries}
        partnerRoles={partnerRoles}
        products={products}
      />

      <PartnerFollowUpDrawer
        isOpen={isFollowUpDrawerOpen}
        onClose={closeFollowUpDrawer}
        partner={followUpPartner}
        onSaveSuccess={() => {
          // Re-fetch partners to update follow-up badges
          dispatch(fetchPartners({ page: currentPage, limit: itemsPerPage, search, isActive: isActiveFilter }));
        }}
      />

      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={closeModals}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Deactivate Partner"
        message={`Are you sure you want to deactivate the partner "${deleteTarget?.entityName}"? This will deactivate all associated contacts and product mappings.`}
      />

      <ConfirmModal
        isOpen={restoreTarget !== null}
        onClose={closeModals}
        onConfirm={handleRestore}
        isLoading={isDeleting}
        title="Restore Partner"
        message={`Are you sure you want to restore the partner "${restoreTarget?.entityName}"? It will become active again.`}
      />

      <PermanentDeleteModal
        isOpen={permanentDeleteTarget !== null}
        onClose={closeModals}
        onConfirm={handlePermanentDelete}
        isDeleting={isDeleting}
        title="Permanently Delete Partner"
        message={`Warning: You are about to permanently delete "${permanentDeleteTarget?.entityName}". This action cannot be undone and will remove all associated data.`}
      />
    </div>
  );
}

export default function PartnersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
          <p className="text-xs font-semibold text-gray-400">Loading...</p>
        </div>
      }
    >
      <PartnersContent />
    </Suspense>
  );
}
