"use client";

import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  restoreCategory,
  permanentDeleteCategory,
  selectCategories,
  selectCategoriesLoading,
  selectCategoriesError,
  selectCategoriesTotalCount,
  selectCategoriesTotalPages,
  clearCategoriesError,
} from "@/store/entities/categoriesSlice";
import HasPermission from "@/components/rbac/HasPermission";
import ConfirmModal from "@/components/modals/ConfirmModal";
import Pagination from "@/components/common/Pagination";
import { Plus, Tags, Check, AlertCircle } from "lucide-react";

import CategoriesTable from "@/components/masters/categories/CategoriesTable";
import CategoriesFilters from "@/components/masters/categories/CategoriesFilters";
import CategoryModal from "@/components/masters/categories/CategoryModal";
import PermanentDeleteModal from "@/components/common/PermanentDeleteModal";

function CategoriesContent() {
  const dispatch = useDispatch();

  const categories = useSelector(selectCategories);
  const isLoading = useSelector(selectCategoriesLoading);
  const error = useSelector(selectCategoriesError);
  const totalCount = useSelector(selectCategoriesTotalCount);
  const totalPages = useSelector(selectCategoriesTotalPages);

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Modals states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [restoreTarget, setRestoreTarget] = useState(null);
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const initialFormState = { id: null, name: "", description: "", isActive: true };
  const [form, setForm] = useState(initialFormState);

  // Query states
  const [search, setSearch] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState("true");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    dispatch(fetchCategories({ page: currentPage, limit: itemsPerPage, search, isActive: isActiveFilter }));
  }, [dispatch, currentPage, search, isActiveFilter]);

  const openCreateModal = () => {
    setForm(initialFormState);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setForm({
      id: category.id,
      name: category.name,
      description: category.description || "",
      isActive: category.isActive,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const closeModals = () => {
    setIsModalOpen(false);
    setDeleteTarget(null);
    setRestoreTarget(null);
    setPermanentDeleteTarget(null);
    dispatch(clearCategoriesError());
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (isEditMode) {
        await dispatch(updateCategory(form)).unwrap();
        showToast("Category updated successfully");
      } else {
        await dispatch(createCategory({ name: form.name, description: form.description })).unwrap();
        showToast("Category created successfully");
      }
      closeModals();
    } catch (err) {
      showToast(err || "Failed to save category", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteCategory({ id: deleteTarget.id })).unwrap();
      showToast("Category deactivated successfully");
      
      if (categories.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        dispatch(fetchCategories({ page: currentPage, limit: itemsPerPage, search, isActive: isActiveFilter }));
      }
      
      closeModals();
    } catch (err) {
      showToast(err || "Failed to deactivate category", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestore = async () => {
    setIsDeleting(true);
    try {
      await dispatch(restoreCategory(restoreTarget.id)).unwrap();
      showToast("Category restored successfully");
      dispatch(fetchCategories({ page: currentPage, limit: itemsPerPage, search, isActive: isActiveFilter }));
      closeModals();
    } catch (err) {
      showToast(err || "Failed to restore category", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePermanentDelete = async (reason) => {
    setIsDeleting(true);
    try {
      await dispatch(permanentDeleteCategory({ id: permanentDeleteTarget.id, reason })).unwrap();
      showToast("Category permanently deleted");
      
      if (categories.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        dispatch(fetchCategories({ page: currentPage, limit: itemsPerPage, search, isActive: isActiveFilter }));
      }
      
      closeModals();
    } catch (err) {
      showToast(err || "Failed to permanently delete category", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading && categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-400">Loading categories...</p>
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

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Tags className="h-6 w-6 text-[#007aff]" />
            Categories
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Manage classification categories for products.
          </p>
        </div>
        
        <HasPermission permission="category:create">
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm shadow-blue-500/20 cursor-pointer transition-colors self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" /> Create Category
          </button>
        </HasPermission>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <CategoriesFilters
          search={search}
          setSearch={setSearch}
          isActiveFilter={isActiveFilter}
          setIsActiveFilter={setIsActiveFilter}
          setCurrentPage={setCurrentPage}
          totalCount={totalCount}
        />

        <CategoriesTable
          categories={categories}
          openEditModal={openEditModal}
          setDeleteTarget={setDeleteTarget}
          setRestoreTarget={setRestoreTarget}
          setPermanentDeleteTarget={setPermanentDeleteTarget}
        />

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      <CategoryModal
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
        title="Deactivate Category"
        message={`Are you sure you want to deactivate the category "${deleteTarget?.name}"? It will be hidden from normal operations.`}
      />

      <ConfirmModal
        isOpen={restoreTarget !== null}
        onClose={closeModals}
        onConfirm={handleRestore}
        isLoading={isDeleting}
        title="Restore Category"
        message={`Are you sure you want to restore the category "${restoreTarget?.name}"? It will become active again.`}
      />

      <PermanentDeleteModal
        isOpen={permanentDeleteTarget !== null}
        onClose={closeModals}
        onConfirm={handlePermanentDelete}
        isDeleting={isDeleting}
        title="Permanently Delete Category"
        message={`Warning: You are about to permanently delete "${permanentDeleteTarget?.name}". This action cannot be undone and will remove all associated data.`}
      />
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
          <p className="text-xs font-semibold text-gray-400">Loading...</p>
        </div>
      }
    >
      <CategoriesContent />
    </Suspense>
  );
}
