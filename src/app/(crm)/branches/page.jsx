"use client";

import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUserType } from "@/store/slices/authSlice";
import { fetchCompanies, selectCompanies } from "@/store/slices/companiesSlice";
import {
  fetchBranches,
  createBranch,
  updateBranch,
  deleteBranch,
  selectBranchesData,
  selectBranchesLoading,
  selectBranchesError,
  clearBranchesError,
} from "@/store/entities/branchesSlice";
import { fetchEmployees, selectEmployeesData } from "@/store/entities/employeesSlice";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { Plus, MapPin, Check, AlertCircle, Building2 } from "lucide-react";

import Pagination from "@/components/common/Pagination";
import BranchesFilters from "@/components/branches/BranchesFilters";
import BranchesTable from "@/components/branches/BranchesTable";
import BranchDetailsDrawer from "@/components/branches/BranchDetailsDrawer";
import CreateBranchModal from "@/components/branches/CreateBranchModal";

function BranchesContent() {
  const dispatch = useDispatch();

  const userType = useSelector(selectUserType);
  const allCompanies = useSelector(selectCompanies) || [];

  const { data: branches, total, page, totalPages } = useSelector(
    selectBranchesData
  ) || { data: [], total: 0, page: 1, totalPages: 0 };
  const { data: employees } = useSelector(selectEmployeesData) || { data: [] };

  const isLoading = useSelector(selectBranchesLoading);
  const error = useSelector(selectBranchesError);

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [selectedCompanyId, setSelectedCompanyId] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("activeCompanyId");
      if (stored) setSelectedCompanyId(stored);
    }
  }, []);

  const [selectedBranch, setSelectedBranch] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [form, setForm] = useState({
    branchName: "",
    branchCode: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    timezone: "Asia/Kolkata",
    isHeadOffice: false,
    isActive: true,
    managerId: "",
  });

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (userType === "super_admin") {
      dispatch(fetchCompanies());
    }
  }, [dispatch, userType]);

  useEffect(() => {
    if (selectedCompanyId) {
      dispatch(fetchBranches({ page: currentPage, limit: itemsPerPage, search }));
      dispatch(fetchEmployees({ limit: 1000 }));
    }
  }, [dispatch, currentPage, search, selectedCompanyId]);

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

  const handleOpenDrawer = (branchObj) => {
    setSelectedBranch(branchObj);
    setDrawerOpen(true);
    setActiveTab("overview");
  };

  const openCreate = () => {
    dispatch(clearBranchesError());
    setForm({
      branchName: "",
      branchCode: "",
      address: "",
      city: "",
      state: "",
      country: "India",
      pincode: "",
      timezone: "Asia/Kolkata",
      isHeadOffice: false,
      isActive: true,
      managerId: "",
    });
    setEditingBranch(null);
    setIsCreateOpen(true);
  };

  const openEdit = (branch) => {
    dispatch(clearBranchesError());
    setForm({
      branchName: branch.branchName || "",
      branchCode: branch.branchCode || "",
      address: branch.address || "",
      city: branch.city || "",
      state: branch.state || "",
      country: branch.country || "India",
      pincode: branch.pincode || "",
      timezone: branch.timezone || "Asia/Kolkata",
      isHeadOffice: branch.isHeadOffice || false,
      isActive: branch.isActive !== undefined ? branch.isActive : true,
      managerId: branch.managerId || "",
    });
    setEditingBranch(branch);
    setIsCreateOpen(true);
  };

  const closeModals = () => {
    setIsCreateOpen(false);
    setEditingBranch(null);
    setDeleteTarget(null);
    dispatch(clearBranchesError());
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        ...form,
        managerId: form.managerId ? Number(form.managerId) : null,
      };
      if (editingBranch) {
        await dispatch(
          updateBranch({ id: editingBranch.id, data: payload })
        ).unwrap();
        showToast("Branch updated successfully");
      } else {
        await dispatch(createBranch(payload)).unwrap();
        showToast("Branch created successfully");
      }
      dispatch(fetchBranches({ page: currentPage, limit: itemsPerPage, search }));
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
      await dispatch(deleteBranch(deleteTarget.id)).unwrap();
      showToast("Branch deleted successfully");
      if (selectedBranch?.id === deleteTarget.id) {
        setDrawerOpen(false);
      }
      
      const newTotal = branches.length - 1;
      const newTotalPages = Math.ceil(newTotal / itemsPerPage) || 1;
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      } else {
        dispatch(fetchBranches({ page: currentPage, limit: itemsPerPage, search }));
      }

      closeModals();
    } catch (err) {
      showToast(err || "Delete failed", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading && branches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-400">Loading Branches...</p>
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <MapPin className="h-6 w-6 text-[#007aff]" />
            Branches
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Manage company branches and locations.
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
            <Plus className="h-4 w-4" /> Add Branch
          </button>
        </div>
      </div>

      {!selectedCompanyId ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
          <MapPin className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <h2 className="text-sm font-bold text-gray-700 mb-1">
            Company Context Required
          </h2>
          <p className="text-xs text-gray-500">
            Please select a company from the dropdown above.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <BranchesFilters
            search={search}
            setSearch={setSearch}
            setCurrentPage={setCurrentPage}
            total={total}
          />

          <BranchesTable
            branches={branches}
            selectedBranch={selectedBranch}
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
        </div>
      )}

      <BranchDetailsDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedBranch={selectedBranch}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <CreateBranchModal
        isCreateOpen={isCreateOpen}
        closeModals={closeModals}
        editingBranch={editingBranch}
        handleSave={handleSave}
        form={form}
        setForm={setForm}
        employees={employees}
        isSaving={isSaving}
        error={error}
      />

      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Branch"
        message="Are you sure you want to delete this branch? This cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
}

export default function BranchesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
          <p className="text-xs font-semibold text-gray-400">Loading...</p>
        </div>
      }
    >
      <BranchesContent />
    </Suspense>
  );
}
