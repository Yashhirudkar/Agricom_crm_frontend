"use client";

import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPartnerRoles,
  createPartnerRole,
  updatePartnerRole,
  deletePartnerRole,
  restorePartnerRole,
  permanentDeletePartnerRole,
  selectPartnerRoles,
  selectPartnerRolesLoading,
  selectPartnerRolesError,
  selectPartnerRolesTotalCount,
  selectPartnerRolesTotalPages,
  clearPartnerRolesError,
} from "@/store/entities/partnerRoleSlice";
import HasPermission from "@/components/rbac/HasPermission";
import ConfirmModal from "@/components/modals/ConfirmModal";
import Pagination from "@/components/common/Pagination";
import { Plus, UserCog, Check, AlertCircle, Building2 } from "lucide-react";

import PartnerRolesTable from "@/components/masters/partner-roles/PartnerRolesTable";
import PartnerRolesFilters from "@/components/masters/partner-roles/PartnerRolesFilters";
import PartnerRoleModal from "@/components/masters/partner-roles/PartnerRoleModal";
import PermanentDeleteModal from "@/components/common/PermanentDeleteModal";
import { fetchCompanies, selectCompanies } from "@/store/slices/companiesSlice";
import { selectUserType } from "@/store/slices/authSlice";

function PartnerRolesContent() {
  const dispatch = useDispatch();

  const partnerRoles = useSelector(selectPartnerRoles);
  const isLoading = useSelector(selectPartnerRolesLoading);
  const error = useSelector(selectPartnerRolesError);
  const totalCount = useSelector(selectPartnerRolesTotalCount);
  const totalPages = useSelector(selectPartnerRolesTotalPages);

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
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [restoreTarget, setRestoreTarget] = useState(null);
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const initialFormState = { id: null, name: "", description: "", isActive: true };
  const [form, setForm] = useState(initialFormState);

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

  useEffect(() => {
    if (selectedCompanyId) {
      dispatch(fetchPartnerRoles({ page: currentPage, limit: itemsPerPage, search, isActive: isActiveFilter }));
    }
  }, [dispatch, currentPage, search, isActiveFilter, selectedCompanyId]);

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
    setForm(initialFormState);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (role) => {
    setForm({
      id: role.id,
      name: role.name,
      description: role.description || "",
      isActive: role.isActive,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const closeModals = () => {
    setIsModalOpen(false);
    setDeleteTarget(null);
    setRestoreTarget(null);
    setPermanentDeleteTarget(null);
    dispatch(clearPartnerRolesError());
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (isEditMode) {
        await dispatch(updatePartnerRole(form)).unwrap();
        showToast("Partner Role updated successfully");
      } else {
        await dispatch(createPartnerRole({ name: form.name, description: form.description })).unwrap();
        showToast("Partner Role created successfully");
        if (currentPage !== 1) setCurrentPage(1);
        else dispatch(fetchPartnerRoles({ page: 1, limit: itemsPerPage, search, isActive: isActiveFilter }));
      }
      closeModals();
    } catch (err) {
      showToast(err || "Failed to save partner role", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deletePartnerRole({ id: deleteTarget.id })).unwrap();
      showToast("Partner Role deactivated successfully");
      
      if (partnerRoles.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        dispatch(fetchPartnerRoles({ page: currentPage, limit: itemsPerPage, search, isActive: isActiveFilter }));
      }
      
      closeModals();
    } catch (err) {
      showToast(err || "Failed to deactivate partner role", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestore = async () => {
    setIsDeleting(true);
    try {
      await dispatch(restorePartnerRole(restoreTarget.id)).unwrap();
      showToast("Partner Role restored successfully");
      dispatch(fetchPartnerRoles({ page: currentPage, limit: itemsPerPage, search, isActive: isActiveFilter }));
      closeModals();
    } catch (err) {
      showToast(err || "Failed to restore partner role", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePermanentDelete = async (reason) => {
    setIsDeleting(true);
    try {
      await dispatch(permanentDeletePartnerRole({ id: permanentDeleteTarget.id, reason })).unwrap();
      showToast("Partner Role permanently deleted");
      
      if (partnerRoles.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        dispatch(fetchPartnerRoles({ page: currentPage, limit: itemsPerPage, search, isActive: isActiveFilter }));
      }
      
      closeModals();
    } catch (err) {
      showToast(err || "Failed to permanently delete partner role", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading && partnerRoles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-400">Loading partner roles...</p>
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
            <UserCog className="h-6 w-6 text-[#007aff]" />
            Partner Roles
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Manage classification roles for business partners.
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

          <HasPermission permission="partnerrole:create">
            <button
              onClick={openCreateModal}
              disabled={!selectedCompanyId}
              className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm shadow-blue-500/20 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" /> Create Role
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
          <PartnerRolesFilters
            search={search}
            setSearch={setSearch}
            isActiveFilter={isActiveFilter}
            setIsActiveFilter={setIsActiveFilter}
            setCurrentPage={setCurrentPage}
            totalCount={totalCount}
          />

          <PartnerRolesTable
            partnerRoles={partnerRoles}
            openEditModal={openEditModal}
            setDeleteTarget={setDeleteTarget}
            setRestoreTarget={setRestoreTarget}
            setPermanentDeleteTarget={setPermanentDeleteTarget}
          />

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}

      <PartnerRoleModal
        isOpen={isModalOpen}
        onClose={closeModals}
        onSubmit={handleModalSubmit}
        form={form}
        setForm={setForm}
        isSaving={isSaving}
        error={error}
        isEditMode={isEditMode}
      />

      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={closeModals}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Deactivate Partner Role"
        message={`Are you sure you want to deactivate the role "${deleteTarget?.name}"? It will be hidden from normal operations.`}
      />

      <ConfirmModal
        isOpen={restoreTarget !== null}
        onClose={closeModals}
        onConfirm={handleRestore}
        isLoading={isDeleting}
        title="Restore Partner Role"
        message={`Are you sure you want to restore the role "${restoreTarget?.name}"? It will become active again.`}
      />

      <PermanentDeleteModal
        isOpen={permanentDeleteTarget !== null}
        onClose={closeModals}
        onConfirm={handlePermanentDelete}
        isDeleting={isDeleting}
        title="Permanently Delete Partner Role"
        message={`Warning: You are about to permanently delete "${permanentDeleteTarget?.name}". This action cannot be undone and will remove all associated data.`}
      />
    </div>
  );
}

export default function PartnerRolesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
          <p className="text-xs font-semibold text-gray-400">Loading...</p>
        </div>
      }
    >
      <PartnerRolesContent />
    </Suspense>
  );
}
