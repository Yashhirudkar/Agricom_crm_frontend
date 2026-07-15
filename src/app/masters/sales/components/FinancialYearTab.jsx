"use client";

import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFinancialYears,
  createFinancialYear,
  updateFinancialYear,
  deleteFinancialYear,
  restoreFinancialYear,
  permanentDeleteFinancialYear,
  selectFinancialYears,
  selectFinancialYearsLoading,
  selectFinancialYearsError,
  selectFinancialYearsTotalCount,
  selectFinancialYearsTotalPages,
  clearFinancialYearsError,
} from "@/store/entities/financialYearSlice";
import HasPermission from "@/components/rbac/HasPermission";
import ConfirmModal from "@/components/modals/ConfirmModal";
import Pagination from "@/components/common/Pagination";
import { Plus, Calendar, Check, AlertCircle } from "lucide-react";

import FinancialYearsTable from "@/components/masters/financial-years/FinancialYearsTable";
import FinancialYearsFilters from "@/components/masters/financial-years/FinancialYearsFilters";
import FinancialYearModal from "@/components/masters/financial-years/FinancialYearModal";
import PermanentDeleteModal from "@/components/common/PermanentDeleteModal";

export default function FinancialYearTab() {
  const dispatch = useDispatch();

  const items = useSelector(selectFinancialYears);
  const isLoading = useSelector(selectFinancialYearsLoading);
  const error = useSelector(selectFinancialYearsError);
  const totalCount = useSelector(selectFinancialYearsTotalCount);
  const totalPages = useSelector(selectFinancialYearsTotalPages);

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

  const initialFormState = { id: null, year: "", displayName: "", isActive: true };
  const [form, setForm] = useState(initialFormState);

  const [search, setSearch] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState("true");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const status = isActiveFilter === "all" ? undefined : (isActiveFilter === "true" ? "Active" : "Inactive");
    dispatch(fetchFinancialYears({ page: currentPage, limit: itemsPerPage, search, status }));
  }, [dispatch, currentPage, search, isActiveFilter]);

  const openCreateModal = () => {
    setForm(initialFormState);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setForm({
      id: item.id,
      year: item.year,
      displayName: item.displayName,
      isActive: item.status === "Active",
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const closeModals = () => {
    setIsModalOpen(false);
    setDeleteTarget(null);
    setRestoreTarget(null);
    setPermanentDeleteTarget(null);
    dispatch(clearFinancialYearsError());
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (isEditMode) {
        await dispatch(updateFinancialYear({ id: form.id, year: form.year, displayName: form.displayName, status: form.isActive ? "Active" : "Inactive" })).unwrap();
        showToast("Financial Year updated successfully");
      } else {
        await dispatch(createFinancialYear({ 
          year: form.year, 
          displayName: form.displayName,
          status: "Active"
        })).unwrap();
        showToast("Financial Year created successfully");
        const status = isActiveFilter === "all" ? undefined : (isActiveFilter === "true" ? "Active" : "Inactive");
        if (currentPage !== 1) setCurrentPage(1);
        else dispatch(fetchFinancialYears({ page: 1, limit: itemsPerPage, search, status }));
      }
      closeModals();
    } catch (err) {
      showToast(err || "Failed to save financial year", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteFinancialYear({ id: deleteTarget.id })).unwrap();
      showToast("Financial Year deactivated successfully");
      
      if (items.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        const status = isActiveFilter === "all" ? undefined : (isActiveFilter === "true" ? "Active" : "Inactive");
        dispatch(fetchFinancialYears({ page: currentPage, limit: itemsPerPage, search, status }));
      }
      
      closeModals();
    } catch (err) {
      showToast(err || "Failed to deactivate financial year", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestore = async () => {
    setIsDeleting(true);
    try {
      await dispatch(restoreFinancialYear(restoreTarget.id)).unwrap();
      showToast("Financial Year restored successfully");
      const status = isActiveFilter === "all" ? undefined : (isActiveFilter === "true" ? "Active" : "Inactive");
      dispatch(fetchFinancialYears({ page: currentPage, limit: itemsPerPage, search, status }));
      closeModals();
    } catch (err) {
      showToast(err || "Failed to restore financial year", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePermanentDelete = async (reason) => {
    setIsDeleting(true);
    try {
      await dispatch(permanentDeleteFinancialYear({ id: permanentDeleteTarget.id, reason })).unwrap();
      showToast("Financial Year permanently deleted");
      
      if (items.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        const status = isActiveFilter === "all" ? undefined : (isActiveFilter === "true" ? "Active" : "Inactive");
        dispatch(fetchFinancialYears({ page: currentPage, limit: itemsPerPage, search, status }));
      }
      
      closeModals();
    } catch (err) {
      showToast(err || "Failed to permanently delete financial year", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-400">Loading financial years...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#007aff]" />
            Financial Years
          </h2>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Manage business financial years.
          </p>
        </div>
        
        <HasPermission permission="financialyear:create">
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm shadow-blue-500/20 cursor-pointer transition-colors self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" /> Create Financial Year
          </button>
        </HasPermission>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <FinancialYearsFilters
          search={search}
          setSearch={setSearch}
          isActiveFilter={isActiveFilter}
          setIsActiveFilter={setIsActiveFilter}
          setCurrentPage={setCurrentPage}
          totalCount={totalCount}
        />

        <FinancialYearsTable
          financialYears={items}
          openEditModal={openEditModal}
          setDeleteTarget={setDeleteTarget}
          setRestoreTarget={setRestoreTarget}
          setPermanentDeleteTarget={setPermanentDeleteTarget}
        />

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      <FinancialYearModal
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
        title="Deactivate Financial Year"
        message={`Are you sure you want to deactivate the financial year "${deleteTarget?.year}"? It will be hidden from normal operations.`}
      />

      <ConfirmModal
        isOpen={restoreTarget !== null}
        onClose={closeModals}
        onConfirm={handleRestore}
        isLoading={isDeleting}
        title="Restore Financial Year"
        message={`Are you sure you want to restore the financial year "${restoreTarget?.year}"? It will become active again.`}
      />

      <PermanentDeleteModal
        isOpen={permanentDeleteTarget !== null}
        onClose={closeModals}
        onConfirm={handlePermanentDelete}
        isDeleting={isDeleting}
        title="Permanently Delete Financial Year"
        message={`Warning: You are about to permanently delete "${permanentDeleteTarget?.year}". This action cannot be undone and will remove all associated data.`}
      />
    </div>
  );
}
