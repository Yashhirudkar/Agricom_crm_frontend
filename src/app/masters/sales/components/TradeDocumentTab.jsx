"use client";

import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTradeDocuments,
  createTradeDocument,
  updateTradeDocument,
  deleteTradeDocument,
  restoreTradeDocument,
  permanentDeleteTradeDocument,
  selectTradeDocuments,
  selectTradeDocumentsLoading,
  selectTradeDocumentsError,
  selectTradeDocumentsTotalCount,
  selectTradeDocumentsTotalPages,
  clearTradeDocumentsError,
} from "@/store/entities/tradeDocumentSlice";
import HasPermission from "@/components/rbac/HasPermission";
import ConfirmModal from "@/components/modals/ConfirmModal";
import Pagination from "@/components/common/Pagination";
import { Plus, FileText, Check, AlertCircle } from "lucide-react";

import TradeDocumentsTable from "@/components/masters/trade-documents/TradeDocumentsTable";
import TradeDocumentsFilters from "@/components/masters/trade-documents/TradeDocumentsFilters";
import TradeDocumentModal from "@/components/masters/trade-documents/TradeDocumentModal";
import PermanentDeleteModal from "@/components/common/PermanentDeleteModal";

export default function TradeDocumentTab() {
  const dispatch = useDispatch();

  const items = useSelector(selectTradeDocuments);
  const isLoading = useSelector(selectTradeDocumentsLoading);
  const error = useSelector(selectTradeDocumentsError);
  const totalCount = useSelector(selectTradeDocumentsTotalCount);
  const totalPages = useSelector(selectTradeDocumentsTotalPages);

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

  const initialFormState = { id: null, code: "", name: "", isActive: true };
  const [form, setForm] = useState(initialFormState);

  const [search, setSearch] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState("true");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const status = isActiveFilter === "all" ? undefined : (isActiveFilter === "true" ? "Active" : "Inactive");
    dispatch(fetchTradeDocuments({ page: currentPage, limit: itemsPerPage, search, status }));
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
      name: item.name,
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
    dispatch(clearTradeDocumentsError());
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (isEditMode) {
        await dispatch(updateTradeDocument({ id: form.id, code: form.code, name: form.name, status: form.isActive ? "Active" : "Inactive" })).unwrap();
        showToast("Trade Document updated successfully");
      } else {
        await dispatch(createTradeDocument({ code: form.code, name: form.name, status: "Active" })).unwrap();
        showToast("Trade Document created successfully");
        const status = isActiveFilter === "all" ? undefined : (isActiveFilter === "true" ? "Active" : "Inactive");
        if (currentPage !== 1) setCurrentPage(1);
        else dispatch(fetchTradeDocuments({ page: 1, limit: itemsPerPage, search, status }));
      }
      closeModals();
    } catch (err) {
      showToast(err || "Failed to save trade document", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteTradeDocument({ id: deleteTarget.id })).unwrap();
      showToast("Trade Document deactivated successfully");
      
      if (items.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        const status = isActiveFilter === "all" ? undefined : (isActiveFilter === "true" ? "Active" : "Inactive");
        dispatch(fetchTradeDocuments({ page: currentPage, limit: itemsPerPage, search, status }));
      }
      
      closeModals();
    } catch (err) {
      showToast(err || "Failed to deactivate trade document", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestore = async () => {
    setIsDeleting(true);
    try {
      await dispatch(restoreTradeDocument(restoreTarget.id)).unwrap();
      showToast("Trade Document restored successfully");
      const status = isActiveFilter === "all" ? undefined : (isActiveFilter === "true" ? "Active" : "Inactive");
      dispatch(fetchTradeDocuments({ page: currentPage, limit: itemsPerPage, search, status }));
      closeModals();
    } catch (err) {
      showToast(err || "Failed to restore trade document", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePermanentDelete = async (reason) => {
    setIsDeleting(true);
    try {
      await dispatch(permanentDeleteTradeDocument({ id: permanentDeleteTarget.id, reason })).unwrap();
      showToast("Trade Document permanently deleted");
      
      if (items.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        const status = isActiveFilter === "all" ? undefined : (isActiveFilter === "true" ? "Active" : "Inactive");
        dispatch(fetchTradeDocuments({ page: currentPage, limit: itemsPerPage, search, status }));
      }
      
      closeModals();
    } catch (err) {
      showToast(err || "Failed to permanently delete trade document", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-400">Loading trade documents...</p>
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
            <FileText className="h-5 w-5 text-[#007aff]" />
            Trade Documents
          </h2>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Manage standard trade documents.
          </p>
        </div>
        
        <HasPermission permission="tradedocument:create">
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm shadow-blue-500/20 cursor-pointer transition-colors self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" /> Create Trade Document
          </button>
        </HasPermission>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <TradeDocumentsFilters
          search={search}
          setSearch={setSearch}
          isActiveFilter={isActiveFilter}
          setIsActiveFilter={setIsActiveFilter}
          setCurrentPage={setCurrentPage}
          totalCount={totalCount}
        />

        <TradeDocumentsTable
          tradeDocuments={items}
          openEditModal={openEditModal}
          setDeleteTarget={setDeleteTarget}
          setRestoreTarget={setRestoreTarget}
          setPermanentDeleteTarget={setPermanentDeleteTarget}
        />

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      <TradeDocumentModal
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
        title="Deactivate Trade Document"
        message={`Are you sure you want to deactivate the trade document "${deleteTarget?.name}"? It will be hidden from normal operations.`}
      />

      <ConfirmModal
        isOpen={restoreTarget !== null}
        onClose={closeModals}
        onConfirm={handleRestore}
        isLoading={isDeleting}
        title="Restore Trade Document"
        message={`Are you sure you want to restore the trade document "${restoreTarget?.name}"? It will become active again.`}
      />

      <PermanentDeleteModal
        isOpen={permanentDeleteTarget !== null}
        onClose={closeModals}
        onConfirm={handlePermanentDelete}
        isDeleting={isDeleting}
        title="Permanently Delete Trade Document"
        message={`Warning: You are about to permanently delete "${permanentDeleteTarget?.name}". This action cannot be undone and will remove all associated data.`}
      />
    </div>
  );
}
