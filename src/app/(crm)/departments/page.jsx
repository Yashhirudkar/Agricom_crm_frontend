"use client";

import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUserType } from "@/store/slices/authSlice";
import { fetchCompanies, selectCompanies } from "@/store/slices/companiesSlice";
import {
  fetchDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  selectDepartmentsData,
  selectDepartmentsLoading,
  selectDepartmentsError,
  clearDepartmentsError,
} from "@/store/entities/departmentsSlice";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { Plus, Building2, Check, AlertCircle } from "lucide-react";

import Pagination from "@/components/common/Pagination";
import DepartmentFilters from "@/components/departments/DepartmentFilters";
import DepartmentsTable from "@/components/departments/DepartmentsTable";
import DepartmentsTree from "@/components/departments/DepartmentsTree";
import CreateDepartmentModal from "@/components/departments/CreateDepartmentModal";
import DepartmentDetailsDrawer from "@/components/departments/DepartmentDetailsDrawer";
import useDebounce from "@/hooks/useDebounce";

function DepartmentsContent() {
  const dispatch = useDispatch();

  const userType = useSelector(selectUserType);
  const allCompanies = useSelector(selectCompanies) || [];

  const { data: departments, total, page, totalPages } = useSelector(
    selectDepartmentsData
  ) || { data: [], total: 0, page: 1, totalPages: 0 };
  const isLoading = useSelector(selectDepartmentsLoading);
  const error = useSelector(selectDepartmentsError);

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [selectedCompanyId, setSelectedCompanyId] = useState("");

  // Initialize selected company from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("activeCompanyId");
      if (stored) setSelectedCompanyId(stored);
    }
  }, []);

  // Drawer states
  const [selectedDept, setSelectedDept] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Modals states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "Active",
    parentId: "",
  });

  // Query states
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [viewMode, setViewMode] = useState("list"); // list, tree
  const [departmentTree, setDepartmentTree] = useState([]);

  // Load tree
  useEffect(() => {
    if (selectedCompanyId && viewMode === "tree") {
      fetchDepartmentTree();
    }
  }, [selectedCompanyId, viewMode]);

  const fetchDepartmentTree = async () => {
    try {
      const res = await import("@/lib/axios").then((m) =>
        m.default.get("/departments/tree", {
          headers: { "x-company-id": selectedCompanyId },
        })
      );
      setDepartmentTree(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (userType === "super_admin") {
      dispatch(fetchCompanies());
    }
  }, [dispatch, userType]);

  useEffect(() => {
    if (selectedCompanyId) {
      dispatch(fetchDepartments({ page: currentPage, limit: itemsPerPage, search: debouncedSearch }));
    }
  }, [dispatch, currentPage, debouncedSearch, selectedCompanyId]);

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

  const handleOpenDrawer = (deptObj) => {
    setSelectedDept(deptObj);
    setDrawerOpen(true);
    setActiveTab("overview");
  };

  const openCreate = () => {
    dispatch(clearDepartmentsError());
    setForm({ name: "", description: "", status: "Active", parentId: "" });
    setEditingDept(null);
    setIsCreateOpen(true);
  };

  const openEdit = (dept) => {
    dispatch(clearDepartmentsError());
    setForm({
      name: dept.name,
      description: dept.description || "",
      status: dept.status || "Active",
      parentId: dept.parentId || "",
    });
    setEditingDept(dept);
    setIsCreateOpen(true);
  };

  const closeModals = () => {
    setIsCreateOpen(false);
    setEditingDept(null);
    setDeleteTarget(null);
    dispatch(clearDepartmentsError());
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = { ...form };
      if (payload.parentId) {
        payload.parentDepartmentId = Number(payload.parentId);
      }
      delete payload.parentId;

      // Remove nulls to avoid strict class-validator errors on optional fields
      if (
        payload.parentDepartmentId === null ||
        payload.parentDepartmentId === undefined
      ) {
        delete payload.parentDepartmentId;
      }
      if (payload.description === "") {
        delete payload.description;
      }

      if (editingDept) {
        await dispatch(updateDepartment({ id: editingDept.id, data: payload })).unwrap();
        showToast("Department updated successfully");
      } else {
        await dispatch(createDepartment(payload)).unwrap();
        showToast("Department created successfully");
      }
      dispatch(fetchDepartments({ page: currentPage, limit: itemsPerPage, search: debouncedSearch }));
      if (viewMode === "tree") fetchDepartmentTree();
      closeModals();
    } catch (err) {
      showToast(err || "Save failed", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteDepartment(deleteTarget.id)).unwrap();
      showToast("Department deleted successfully");
      if (selectedDept?.id === deleteTarget.id) {
        setDrawerOpen(false);
      }
      
      // Bug Fix: Fix pagination boundary when deleting
      const newTotal = departments.length - 1;
      const newTotalPages = Math.ceil(newTotal / itemsPerPage) || 1;
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      } else {
        dispatch(fetchDepartments({ page: currentPage, limit: itemsPerPage, search: debouncedSearch }));
      }

      closeModals();
    } catch (err) {
      showToast(err || "Delete failed", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading && departments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-400">Loading Departments...</p>
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
          {toast.type === "error" ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          {toast.msg}
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Building2 className="h-6 w-6 text-[#007aff]" />
            Departments
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Manage company departments and their structures.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {userType === "super_admin" && (
            <select
              value={selectedCompanyId}
              onChange={handleCompanyChange}
              className="border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 bg-white"
            >
              <option value="">-- Select Company Context --</option>
              {allCompanies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={openCreate}
            disabled={!selectedCompanyId}
            className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm shadow-blue-500/20 cursor-pointer transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Department
          </button>
        </div>
      </div>

      {!selectedCompanyId ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
          <Building2 className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <h2 className="text-sm font-bold text-gray-700 mb-1">
            Company Context Required
          </h2>
          <p className="text-xs text-gray-500">
            {userType === "super_admin"
              ? "Please select a company from the dropdown above to manage its departments."
              : "You do not have an active company selected. Please select or create a company first."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <DepartmentFilters
            search={search}
            setSearch={setSearch}
            setCurrentPage={setCurrentPage}
            viewMode={viewMode}
            setViewMode={setViewMode}
            total={total}
          />

          {viewMode === "list" ? (
            <>
              <DepartmentsTable
                departments={departments}
                selectedDept={selectedDept}
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
              <DepartmentsTree
                departmentTree={departmentTree}
                handleOpenDrawer={handleOpenDrawer}
              />
            </div>
          )}
        </div>
      )}

      <DepartmentDetailsDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedDept={selectedDept}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <CreateDepartmentModal
        isCreateOpen={isCreateOpen}
        closeModals={closeModals}
        handleSave={handleSave}
        editingDept={editingDept}
        form={form}
        setForm={setForm}
        departments={departments}
        isSaving={isSaving}
        error={error}
      />

      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Department"
        message="Are you sure you want to delete this department? This will fail if there are any employees or designations linked to it."
        isLoading={isDeleting}
      />
    </div>
  );
}

export default function DepartmentsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
          <p className="text-xs font-semibold text-gray-400">Loading...</p>
        </div>
      }
    >
      <DepartmentsContent />
    </Suspense>
  );
}
