"use client";

import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "@/lib/axios";
import {
  fetchPartners,
  createPartner,
  updatePartner,
  deletePartner,
  selectPartners,
  selectPartnersLoading,
  selectPartnersError,
  selectPartnersTotalCount,
  selectPartnersTotalPages,
  clearPartnersError,
} from "@/store/entities/partnerSlice";
import HasPermission from "@/components/rbac/HasPermission";
import ConfirmModal from "@/components/modals/ConfirmModal";
import Pagination from "@/components/common/Pagination";
import { Plus, Users, Check, AlertCircle } from "lucide-react";

import PartnersTable from "@/components/masters/partners/PartnersTable";
import PartnersFilters from "@/components/masters/partners/PartnersFilters";
import PartnerModal from "@/components/masters/partners/PartnerModal";

function PartnersContent() {
  const dispatch = useDispatch();

  const partners = useSelector(selectPartners);
  const isLoading = useSelector(selectPartnersLoading);
  const error = useSelector(selectPartnersError);
  const totalCount = useSelector(selectPartnersTotalCount);
  const totalPages = useSelector(selectPartnersTotalPages);

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // External dependencies for dropdowns
  const [partnerRoles, setPartnerRoles] = useState([]);
  const [countries, setCountries] = useState([]);
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Load partners list
  useEffect(() => {
    dispatch(fetchPartners({ page: currentPage, limit: itemsPerPage, search }));
  }, [dispatch, currentPage, search]);

  // Load dropdown dependencies once securely respecting max 100 limit
  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const [rolesRes, conRes, prodRes] = await Promise.all([
          axiosClient.get("/masters/partner-roles", { params: { limit: 100, isActive: true } }),
          axiosClient.get("/masters/countries", { params: { limit: 100, isActive: true } }),
          axiosClient.get("/masters/products", { params: { limit: 100, isActive: true } }),
        ]);
        setPartnerRoles(rolesRes.data.data || []);
        setCountries(conRes.data.data || []);
        setProducts(prodRes.data.data || []);
      } catch (err) {
        showToast("Failed to load master lookup data", "error");
      }
    };
    fetchDependencies();
  }, []);

  const openCreateModal = () => {
    setEditData(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditData(item);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const closeModals = () => {
    setIsModalOpen(false);
    setDeleteTarget(null);
    dispatch(clearPartnersError());
  };

  const handleModalSubmit = async (payload) => {
    setIsSaving(true);
    
    try {
      if (isEditMode) {
        await dispatch(updatePartner({ id: editData.id, ...payload })).unwrap();
        showToast("Partner updated successfully");
      } else {
        await dispatch(createPartner(payload)).unwrap();
        showToast("Partner created successfully");
        if (currentPage !== 1) setCurrentPage(1);
        else dispatch(fetchPartners({ page: 1, limit: itemsPerPage, search }));
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
      await dispatch(deletePartner(deleteTarget.id)).unwrap();
      showToast("Partner deleted successfully");
      
      if (partners.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        dispatch(fetchPartners({ page: currentPage, limit: itemsPerPage, search }));
      }
      
      closeModals();
    } catch (err) {
      showToast(err || "Failed to delete partner", "error");
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
          className={`fixed top-5 right-5 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-xs font-bold text-white transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${
            toast.type === "error" ? "bg-red-500" : "bg-green-500"
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
        
        <HasPermission permission="partner:create">
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm shadow-blue-500/20 cursor-pointer transition-colors self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" /> Add Partner
          </button>
        </HasPermission>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <PartnersFilters
          search={search}
          setSearch={setSearch}
          setCurrentPage={setCurrentPage}
          totalCount={totalCount}
        />

        <PartnersTable
          partners={partners}
          openEditModal={openEditModal}
          setDeleteTarget={setDeleteTarget}
        />

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      <PartnerModal
        isOpen={isModalOpen}
        onClose={closeModals}
        onSubmit={handleModalSubmit}
        editData={editData}
        isSaving={isSaving}
        error={error}
        isEditMode={isEditMode}
        categories={[]} 
        countries={countries}
        hscodes={[]} 
        partnerRoles={partnerRoles}
        products={products}
      />

      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={closeModals}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Partner"
        message={`Are you sure you want to delete the partner "${deleteTarget?.entityName}"? This will deactivate all associated contacts and product mappings.`}
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
