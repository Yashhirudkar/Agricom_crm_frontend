"use client";

import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUserType } from "@/store/slices/authSlice";
import { selectActiveCompanyId } from "@/store/slices/companyContextSlice";
import {
  fetchDesignations,
  createDesignation,
  updateDesignation,
  deleteDesignation,
  selectDesignationsData,
  selectDesignationsLoading,
  selectDesignationsError,
  clearDesignationsError,
} from "@/store/entities/designationsSlice";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { Plus, Shield, Check, AlertCircle } from "lucide-react";

import Pagination from "@/components/common/Pagination";
import DesignationFilters from "@/components/designations/DesignationFilters";
import DesignationsTable from "@/components/designations/DesignationsTable";
import DesignationsTree from "@/components/designations/DesignationsTree";
import CreateDesignationModal from "@/components/designations/CreateDesignationModal";
import DesignationDetailsDrawer from "@/components/designations/DesignationDetailsDrawer";
import useDebounce from "@/hooks/useDebounce";

function DesignationsContent() {
  const dispatch = useDispatch();

  const userType = useSelector(selectUserType);
  const activeCompanyId = useSelector(selectActiveCompanyId) || "";

  const { data: designations, total, page, totalPages } = useSelector(
    selectDesignationsData
  ) || { data: [], total: 0, page: 1, totalPages: 0 };

  const isLoading = useSelector(selectDesignationsLoading);
  const error = useSelector(selectDesignationsError);

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Drawer states
  const [selectedDesig, setSelectedDesig] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Modals states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDesig, setEditingDesig] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "Active",
    departmentId: "",
    parentId: "",
    salaryBandMin: "",
    salaryBandMax: "",
  });

  // Query states
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [viewMode, setViewMode] = useState("list"); // list, tree
  const [designationTree, setDesignationTree] = useState([]);

  // Load tree
  useEffect(() => {
    if (activeCompanyId && viewMode === "tree") {
      fetchDesignationTree();
    }
  }, [activeCompanyId, viewMode]);

  const fetchDesignationTree = async () => {
    try {
      const res = await import("@/lib/axios").then((m) =>
        m.default.get("/designations/hierarchy")
      );
      setDesignationTree(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeCompanyId) {
      dispatch(fetchDesignations({ page: currentPage, limit: itemsPerPage, search: debouncedSearch }));
    }
  }, [dispatch, currentPage, debouncedSearch, activeCompanyId]);

  const handleOpenDrawer = (desigObj) => {
    setSelectedDesig(desigObj);
    setDrawerOpen(true);
    setActiveTab("overview");
  };

  const openCreate = () => {
    dispatch(clearDesignationsError());
    setForm({
      name: "",
      description: "",
      status: "Active",
      departmentId: "",
      parentId: "",
      salaryBandMin: "",
      salaryBandMax: "",
    });
    setEditingDesig(null);
    setIsCreateOpen(true);
  };

  const openEdit = (desig) => {
    dispatch(clearDesignationsError());
    setForm({
      name: desig.name,
      description: desig.description || "",
      status: desig.status || "Active",
      departmentId: desig.departmentId || "",
      parentId: desig.parentId || "",
      salaryBandMin: desig.salaryBandMin || "",
      salaryBandMax: desig.salaryBandMax || "",
    });
    setEditingDesig(desig);
    setIsCreateOpen(true);
  };

  const closeModals = () => {
    setIsCreateOpen(false);
    setEditingDesig(null);
    setDeleteTarget(null);
    dispatch(clearDesignationsError());
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    try {
      const payload = {
        ...form,
        departmentId: form.departmentId ? Number(form.departmentId) : undefined,
        parentDesignationId: form.parentId ? Number(form.parentId) : undefined,
        salaryBandMin: form.salaryBandMin ? Number(form.salaryBandMin) : undefined,
        salaryBandMax: form.salaryBandMax ? Number(form.salaryBandMax) : undefined,
      };
      delete payload.parentId;

      // Remove undefined/empty to avoid strict validation errors
      Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined || payload[key] === null || payload[key] === "") {
          delete payload[key];
        }
      });
      if (editingDesig) {
        await dispatch(updateDesignation({ id: editingDesig.id, data: payload })).unwrap();
        showToast("Designation updated successfully");
      } else {
        await dispatch(createDesignation(payload)).unwrap();
        showToast("Designation created successfully");
      }
      dispatch(fetchDesignations({ page: currentPage, limit: itemsPerPage, search: debouncedSearch }));
      if (viewMode === "tree") fetchDesignationTree();
      closeModals();
    } catch (err) {
      showToast(err || "Save failed", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteDesignation(deleteTarget.id)).unwrap();
      showToast("Designation deleted successfully");
      if (selectedDesig?.id === deleteTarget.id) {
        setDrawerOpen(false);
      }
      
      // Bug Fix: Fix pagination boundary when deleting
      const newTotal = designations.length - 1;
      const newTotalPages = Math.ceil(newTotal / itemsPerPage) || 1;
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      } else {
        dispatch(fetchDesignations({ page: currentPage, limit: itemsPerPage, search: debouncedSearch }));
      }

      closeModals();
    } catch (err) {
      showToast(err || "Delete failed", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading && designations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-400">Loading Designations...</p>
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
            <Shield className="h-6 w-6 text-[#007aff]" />
            Designations
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Manage job titles and roles within departments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm shadow-blue-500/20 cursor-pointer transition-colors self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" /> Add Designation
          </button>
        </div>
      </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <DesignationFilters
            search={search}
            setSearch={setSearch}
            setCurrentPage={setCurrentPage}
            viewMode={viewMode}
            setViewMode={setViewMode}
            total={total}
          />

          {viewMode === "list" ? (
            <>
              <DesignationsTable
                designations={designations}
                selectedDesig={selectedDesig}
                handleOpenDrawer={handleOpenDrawer}
                openEdit={openEdit}
                setDeleteTarget={setDeleteTarget}
                isLoading={isLoading}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <div className="p-8 overflow-auto flex justify-center min-h-[400px]">
              <DesignationsTree
                designationTree={designationTree}
                handleOpenDrawer={handleOpenDrawer}
              />
            </div>
          )}
        </div>

      <DesignationDetailsDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedDesig={selectedDesig}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <CreateDesignationModal
        isCreateOpen={isCreateOpen}
        closeModals={closeModals}
        handleSave={handleSave}
        editingDesig={editingDesig}
        form={form}
        setForm={setForm}
        isSaving={isSaving}
        error={error}
      />

      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Designation"
        message="Are you sure you want to delete this designation? This will fail if there are any employees assigned to it."
        isLoading={isDeleting}
      />
    </div>
  );
}

export default function DesignationsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
          <p className="text-xs font-semibold text-gray-400">Loading...</p>
        </div>
      }
    >
      <DesignationsContent />
    </Suspense>
  );
}
