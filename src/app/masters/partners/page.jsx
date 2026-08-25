"use client";

import { useEffect, useState, Suspense, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "@/lib/axios";
import { getCountryNameList } from "@/lib/countryUtils";
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
import { selectUserType } from "@/store/slices/authSlice";
import { selectActiveCompanyId } from "@/store/slices/companyContextSlice";
import HasPermission from "@/components/rbac/HasPermission";
import ConfirmModal from "@/components/modals/ConfirmModal";
import Pagination from "@/components/common/Pagination";
import { Plus, Users, Check, AlertCircle, Building2 } from "lucide-react";

import PartnersTable from "@/components/masters/partners/PartnersTable";
import PartnersFilters from "@/components/masters/partners/PartnersFilters";
import PartnerDrawer from "@/components/masters/partners/PartnerDrawer";
import PartnerFollowUpDrawer from "@/components/masters/partners/PartnerFollowUpDrawer";
import PartnerQuotationsDrawer from "@/components/masters/partners/PartnerQuotationsDrawer";
import PermanentDeleteModal from "@/components/common/PermanentDeleteModal";

function PartnersContent() {
  const dispatch = useDispatch();

  const partners = useSelector(selectPartners);
  const isLoading = useSelector(selectPartnersLoading);
  const error = useSelector(selectPartnersError);
  const totalCount = useSelector(selectPartnersTotalCount);
  const totalPages = useSelector(selectPartnersTotalPages);

  const userType = useSelector(selectUserType);
  const activeCompanyId = useSelector(selectActiveCompanyId) || "";
  const activeRequestRef = useRef(null);

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [drawerInitialTab, setDrawerInitialTab] = useState("contacts");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [restoreTarget, setRestoreTarget] = useState(null);
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isFollowUpDrawerOpen, setIsFollowUpDrawerOpen] = useState(false);
  const [followUpPartner, setFollowUpPartner] = useState(null);

  const [isQuotationsDrawerOpen, setIsQuotationsDrawerOpen] = useState(false);
  const [quotationsPartner, setQuotationsPartner] = useState(null);

  // External dependencies for dropdowns
  const [partnerRoles, setPartnerRoles] = useState([]);

  const [products, setProducts] = useState([]);

  const [filters, setFilters] = useState({
    search: "",
    role: "",
    country: "",
    dbRisk: "",
    status: "true",
    page: 1,
    limit: 8,
  });

  const searchParams = useSearchParams();
  const partnerIdParam = searchParams.get("partnerId");

  const reFetchPartners = (customPage) => {
    dispatch(fetchPartners({
      page: customPage !== undefined ? customPage : filters.page,
      limit: filters.limit,
      search: filters.search || undefined,
      isActive: filters.status,
      partnerRoleId: filters.role || undefined,
      country: filters.country || undefined,
      dnbRiskFactor: filters.dbRisk || undefined,
    }));
  };

  // Load partners list
  useEffect(() => {
    if (activeCompanyId) {
      if (activeRequestRef.current) {
        activeRequestRef.current.abort();
      }
      activeRequestRef.current = dispatch(fetchPartners({
        page: filters.page,
        limit: filters.limit,
        search: filters.search || undefined,
        isActive: filters.status,
        partnerRoleId: filters.role || undefined,
        country: filters.country || undefined,
        dnbRiskFactor: filters.dbRisk || undefined,
      }));
    }
    return () => {
      if (activeRequestRef.current) {
        activeRequestRef.current.abort();
      }
    };
  }, [dispatch, filters, activeCompanyId]);

  // Refetch partners on quotation creation
  useEffect(() => {
    const handleQuotationCreated = () => {
      reFetchPartners();
    };
    window.addEventListener("quotation-created", handleQuotationCreated);
    return () => window.removeEventListener("quotation-created", handleQuotationCreated);
  }, [filters]);

  // Toast error listener
  useEffect(() => {
    if (error && error !== "canceled") {
      showToast(error, "error");
      dispatch(clearPartnersError());
    }
  }, [error, dispatch]);

  // Load dropdown dependencies once
  useEffect(() => {
    if (!activeCompanyId) return;
    const fetchDependencies = async () => {
      try {
        const [rolesRes, prodRes] = await Promise.all([
          axiosClient.get("/masters/partner-roles/options", { params: { limit: 100, isActive: true } }),
          axiosClient.get("/masters/products/options", { params: { limit: 100, isActive: true } }),
        ]);
        setPartnerRoles(rolesRes.data.data || []);
        setProducts(prodRes.data.data || []);
      } catch (err) {
        showToast("Failed to load master lookup data", "error");
      }
    };
    fetchDependencies();
  }, [activeCompanyId]);


  // Populate countries from standard countryUtils (with canonical names like "China")
  const countries = useMemo(() => {
    return getCountryNameList();
  }, []);

  // Deep-link: auto-open the follow-up drawer for a partner from notification
  useEffect(() => {
    if (!partnerIdParam) return;
    const id = parseInt(partnerIdParam, 10);
    if (!id) return;
    axiosClient.get(`/masters/partners/${id}`)
      .then((res) => {
        const partner = res.data?.data ?? res.data;
        if (!partner) return;
        setFollowUpPartner(partner);
        setIsFollowUpDrawerOpen(true);
      })
      .catch(() => {
        // silently fail — user is still on the correct page
      });
  }, [partnerIdParam]);


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

  const openViewDrawer = (item, tab = "contacts") => {
    setEditData(item);
    setIsEditMode(false);
    setDrawerInitialTab(tab);
    setIsModalOpen(true);
  };

  const openFollowUpDrawer = (item) => {
    setFollowUpPartner(item);
    setIsFollowUpDrawerOpen(true);
  };

  const openPartnerQuotationsDrawer = (item) => {
    setQuotationsPartner(item);
    setIsQuotationsDrawerOpen(true);
  };

  const closeQuotationsDrawer = () => {
    setIsQuotationsDrawerOpen(false);
    setQuotationsPartner(null);
  };

  const closeModals = () => {
    setIsModalOpen(false);
    setDeleteTarget(null);
    setRestoreTarget(null);
    setPermanentDeleteTarget(null);
    setDrawerInitialTab("contacts");
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
        const dnbDraft = createPayload.dnbDraft;
        if (dnbDraft?.yearOfEstablishment && !createPayload.yearOfEstablishment) {
          createPayload.yearOfEstablishment = parseInt(dnbDraft.yearOfEstablishment, 10);
        }

        const createdPartner = await dispatch(createPartner(createPayload)).unwrap();

        if (dnbDraft && dnbDraft.selectedFile) {
          try {
            const formData = new FormData();
            formData.append("file", dnbDraft.selectedFile);
            formData.append("reportDate", dnbDraft.reportDate || new Date().toISOString().split("T")[0]);
            formData.append("riskFactor", dnbDraft.riskFactor || "LOW");
            formData.append("creditLimit", dnbDraft.creditLimit || 0);
            formData.append("failureScore", dnbDraft.failureScore || "MODERATE");
            formData.append("paydex", dnbDraft.paydex || 0);
            formData.append("dnbRating", (dnbDraft.dnbRating || "EE1").toUpperCase().trim());

            await axiosClient.post(`/masters/partners/${createdPartner.id}/dnb-reports`, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            showToast("Partner & D&B Report created successfully");
          } catch (dnbErr) {
            console.error("Failed to upload D&B report on partner creation", dnbErr);
            showToast("Partner created, but D&B report upload failed", "warning");
          }
        } else {
          showToast("Partner created successfully");
        }

        if (filters.page !== 1) {
          setFilters((prev) => ({ ...prev, page: 1 }));
        } else {
          reFetchPartners(1);
        }
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

      if (partners.length === 1 && filters.page > 1) {
        setFilters((prev) => ({ ...prev, page: prev.page - 1 }));
      } else {
        reFetchPartners();
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
      reFetchPartners();
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

      if (partners.length === 1 && filters.page > 1) {
        setFilters((prev) => ({ ...prev, page: prev.page - 1 }));
      } else {
        reFetchPartners();
      }

      closeModals();
    } catch (err) {
      showToast(err || "Failed to permanently delete partner", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Removed full-page loading check to prevent unmounting filter inputs and losing focus.

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
          <p className="text-xs text-gray-500 font-medium mt-1">
            Manage buyers, suppliers, logistics providers and their associated contacts.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <HasPermission permission="partner:create">
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm shadow-blue-500/20 cursor-pointer transition-colors self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" /> Add Partner
            </button>
          </HasPermission>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <PartnersFilters
          filters={filters}
          setFilters={setFilters}
          totalCount={totalCount}
          partnerRoles={partnerRoles}
          countries={countries}
          isLoading={isLoading}
        />

        <PartnersTable
          partners={partners}
          openViewDrawer={openViewDrawer}
          openEditModal={openEditModal}
          openFollowUpDrawer={openFollowUpDrawer}
          openPartnerQuotationsDrawer={openPartnerQuotationsDrawer}
          setDeleteTarget={setDeleteTarget}
          setRestoreTarget={setRestoreTarget}
          setPermanentDeleteTarget={setPermanentDeleteTarget}
          isLoading={isLoading}
        />

        <Pagination
          currentPage={filters.page}
          totalPages={totalPages}
          onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
        />
      </div>

      <PartnerDrawer
        isOpen={isModalOpen}
        onClose={closeModals}
        onSubmit={handleModalSubmit}
        editData={editData}
        isSaving={isSaving}
        error={error}
        isEditMode={isEditMode}
        initialTab={drawerInitialTab}
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
          reFetchPartners();
        }}
      />

      <PartnerQuotationsDrawer
        isOpen={isQuotationsDrawerOpen}
        onClose={closeQuotationsDrawer}
        partner={quotationsPartner}
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
