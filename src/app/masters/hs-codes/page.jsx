"use client";

import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchHSCodes,
  createHSCode,
  updateHSCode,
  deleteHSCode,
  restoreHSCode,
  permanentDeleteHSCode,
  selectHSCodes,
  selectHSCodesLoading,
  selectHSCodesError,
  selectHSCodesTotalCount,
  selectHSCodesTotalPages,
  clearHSCodesError,
} from "@/store/entities/hscodeSlice";
import HasPermission from "@/components/rbac/HasPermission";
import ConfirmModal from "@/components/modals/ConfirmModal";
import Pagination from "@/components/common/Pagination";
import { Plus, Barcode, Check, AlertCircle } from "lucide-react";

import HSCodesTable from "@/components/masters/hs-codes/HSCodesTable";
import HSCodesFilters from "@/components/masters/hs-codes/HSCodesFilters";
import HSCodeModal from "@/components/masters/hs-codes/HSCodeModal";
import PermanentDeleteModal from "@/components/common/PermanentDeleteModal";

function HSCodesContent() {
  const dispatch = useDispatch();

  const hscodes = useSelector(selectHSCodes);
  const isLoading = useSelector(selectHSCodesLoading);
  const error = useSelector(selectHSCodesError);
  const totalCount = useSelector(selectHSCodesTotalCount);
  const totalPages = useSelector(selectHSCodesTotalPages);

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

  const initialFormState = { id: null, code: "", description: "", chapter: "", subHeading: "", isActive: true };
  const [form, setForm] = useState(initialFormState);

  const [search, setSearch] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState("true");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    dispatch(fetchHSCodes({ page: currentPage, limit: itemsPerPage, search, isActive: isActiveFilter }));
  }, [dispatch, currentPage, search, isActiveFilter]);

  const openCreateModal = () => {
    setForm(initialFormState);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setForm({
      id: item.id,
      code: item.code,
      description: item.description,
      chapter: item.chapter || "",
      subHeading: item.subHeading || "",
      isActive: item.isActive,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const closeModals = () => {
    setIsModalOpen(false);
    setDeleteTarget(null);
    setRestoreTarget(null);
    setPermanentDeleteTarget(null);
    dispatch(clearHSCodesError());
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (isEditMode) {
        await dispatch(updateHSCode(form)).unwrap();
        showToast("HS Code updated successfully");
      } else {
        await dispatch(createHSCode({ 
          code: form.code, 
          description: form.description, 
          chapter: form.chapter, 
          subHeading: form.subHeading 
        })).unwrap();
        showToast("HS Code created successfully");
        if (currentPage !== 1) setCurrentPage(1);
        else dispatch(fetchHSCodes({ page: 1, limit: itemsPerPage, search, isActive: isActiveFilter }));
      }
      closeModals();
    } catch (err) {
      showToast(err || "Failed to save HS Code", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteHSCode({ id: deleteTarget.id })).unwrap();
      showToast("HS Code deactivated successfully");
      
      if (hscodes.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        dispatch(fetchHSCodes({ page: currentPage, limit: itemsPerPage, search, isActive: isActiveFilter }));
      }
      
      closeModals();
    } catch (err) {
      showToast(err || "Failed to deactivate HS Code", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestore = async () => {
    setIsDeleting(true);
    try {
      await dispatch(restoreHSCode(restoreTarget.id)).unwrap();
      showToast("HS Code restored successfully");
      dispatch(fetchHSCodes({ page: currentPage, limit: itemsPerPage, search, isActive: isActiveFilter }));
      closeModals();
    } catch (err) {
      showToast(err || "Failed to restore HS Code", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePermanentDelete = async (reason) => {
    setIsDeleting(true);
    try {
      await dispatch(permanentDeleteHSCode({ id: permanentDeleteTarget.id, reason })).unwrap();
      showToast("HS Code permanently deleted");
      
      if (hscodes.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        dispatch(fetchHSCodes({ page: currentPage, limit: itemsPerPage, search, isActive: isActiveFilter }));
      }
      
      closeModals();
    } catch (err) {
      showToast(err || "Failed to permanently delete HS Code", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading && hscodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-400">Loading HS Codes...</p>
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
            <Barcode className="h-6 w-6 text-[#007aff]" />
            HS Codes
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Manage global harmonized system codes for products.
          </p>
        </div>
        
        <HasPermission permission="hscode:create">
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm shadow-blue-500/20 cursor-pointer transition-colors self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" /> Create HS Code
          </button>
        </HasPermission>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <HSCodesFilters
          search={search}
          setSearch={setSearch}
          isActiveFilter={isActiveFilter}
          setIsActiveFilter={setIsActiveFilter}
          setCurrentPage={setCurrentPage}
          totalCount={totalCount}
        />

        <HSCodesTable
          hscodes={hscodes}
          openEditModal={openEditModal}
          setDeleteTarget={setDeleteTarget}
          setRestoreTarget={setRestoreTarget}
          setPermanentDeleteTarget={setPermanentDeleteTarget}
        />

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      <HSCodeModal
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
        title="Deactivate HS Code"
        message={`Are you sure you want to deactivate the HS Code "${deleteTarget?.code}"? It will be hidden from normal operations.`}
      />

      <ConfirmModal
        isOpen={restoreTarget !== null}
        onClose={closeModals}
        onConfirm={handleRestore}
        isLoading={isDeleting}
        title="Restore HS Code"
        message={`Are you sure you want to restore the HS Code "${restoreTarget?.code}"? It will become active again.`}
      />

      <PermanentDeleteModal
        isOpen={permanentDeleteTarget !== null}
        onClose={closeModals}
        onConfirm={handlePermanentDelete}
        isDeleting={isDeleting}
        title="Permanently Delete HS Code"
        message={`Warning: You are about to permanently delete "${permanentDeleteTarget?.code}". This action cannot be undone and will remove all associated data.`}
      />
    </div>
  );
}

export default function HSCodesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
          <p className="text-xs font-semibold text-gray-400">Loading...</p>
        </div>
      }
    >
      <HSCodesContent />
    </Suspense>
  );
}
