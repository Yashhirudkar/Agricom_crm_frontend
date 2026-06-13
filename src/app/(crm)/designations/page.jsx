"use client";

import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUserType } from "@/store/slices/authSlice";
import { fetchCompanies, selectCompanies } from "@/store/slices/companiesSlice";
import {
  fetchDesignations,
  createDesignation,
  updateDesignation,
  deleteDesignation,
  selectDesignationsData,
  selectDesignationsLoading,
  selectDesignationsError,
  clearDesignationsError,
} from "@/store/slices/designationsSlice";
import { fetchDepartments, selectDepartmentsData } from "@/store/slices/departmentsSlice";
import Drawer from "@/components/drawers/Drawer";
import Modal from "@/components/modals/Modal";
import ConfirmModal from "@/components/modals/ConfirmModal";
import {
  Plus,
  Edit2,
  Trash2,
  Shield,
  Check,
  AlertCircle,
  Info,
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
  Building2,
} from "lucide-react";

function DesignationsContent() {
  const dispatch = useDispatch();

  const userType = useSelector(selectUserType);
  const allCompanies = useSelector(selectCompanies) || [];

  const { data: designations, total, page, totalPages } = useSelector(selectDesignationsData) || { data: [], total: 0, page: 1, totalPages: 0 };
  const { data: departmentsObj } = useSelector(selectDepartmentsData) || { data: [] };
  const departments = departmentsObj?.data || departmentsObj || [];

  const isLoading = useSelector(selectDesignationsLoading);
  const error = useSelector(selectDesignationsError);

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
  const [selectedDesig, setSelectedDesig] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Modals states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDesig, setEditingDesig] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [form, setForm] = useState({ name: "", description: "", status: "Active", departmentId: "" });

  // Query states
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
      dispatch(fetchDesignations({ page: currentPage, limit: itemsPerPage, search }));
      dispatch(fetchDepartments({ limit: 1000 }));
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

  const handleOpenDrawer = (desigObj) => {
    setSelectedDesig(desigObj);
    setDrawerOpen(true);
    setActiveTab("overview");
  };

  const openCreate = () => {
    dispatch(clearDesignationsError());
    setForm({ name: "", description: "", status: "Active", departmentId: "" });
    setEditingDesig(null);
    setIsCreateOpen(true);
  };

  const openEdit = (desig) => {
    dispatch(clearDesignationsError());
    setForm({ 
      name: desig.name, 
      description: desig.description || "", 
      status: desig.status || "Active",
      departmentId: desig.departmentId || ""
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
    setIsSaving(true);
    try {
      const payload = {
        ...form,
        departmentId: form.departmentId ? Number(form.departmentId) : null
      };
      if (editingDesig) {
        await dispatch(updateDesignation({ id: editingDesig.id, data: payload })).unwrap();
        showToast("Designation updated successfully");
      } else {
        await dispatch(createDesignation(payload)).unwrap();
        showToast("Designation created successfully");
      }
      dispatch(fetchDesignations({ page: currentPage, limit: itemsPerPage, search }));
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
      await dispatch(deleteDesignation(deleteTarget.id)).unwrap();
      showToast("Designation deleted successfully");
      if (selectedDesig?.id === deleteTarget.id) {
        setDrawerOpen(false);
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
        <div className={`fixed top-5 right-5 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-xs font-bold text-white transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
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
            className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm shadow-blue-500/20 cursor-pointer transition-colors self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" /> Add Designation
          </button>
        </div>
      </div>

      {!selectedCompanyId ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
          <Shield className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <h2 className="text-sm font-bold text-gray-700 mb-1">Company Context Required</h2>
          <p className="text-xs text-gray-500">
            {userType === "super_admin" 
              ? "Please select a company from the dropdown above to manage its designations."
              : "You do not have an active company selected. Please select or create a company first."}
          </p>
        </div>
      ) : (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-50 bg-gray-50/20 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff] text-gray-600 transition-colors"
              placeholder="Search designations..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
          </div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Total {total} Designations
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/30 text-gray-400 uppercase tracking-widest text-[10px] font-bold">
                <th className="px-6 py-4">Designation</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Employees</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {designations.map((desig) => {
                const isSelected = selectedDesig?.id === desig.id;
                return (
                  <tr
                    key={desig.id}
                    onClick={() => handleOpenDrawer(desig)}
                    className={`hover:bg-gray-50/70 transition-colors cursor-pointer ${isSelected ? "bg-blue-50/40" : ""}`}
                  >
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-800">{desig.name}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-gray-400" />
                        {desig.department?.name || <span className="text-gray-300 italic">None</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-gray-500" title="Employees">
                        <Users className="h-3.5 w-3.5" /> <span>{desig.employeeCount || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${desig.status === 'Active' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                        {desig.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => openEdit(desig)}
                        className="p-1 rounded-lg text-gray-400 hover:text-[#007aff] hover:bg-blue-50 transition-colors cursor-pointer"
                        title="Edit details"
                      >
                        <Edit2 className="h-4 w-4 inline" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(desig)}
                        className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete designation"
                      >
                        <Trash2 className="h-4 w-4 inline" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {designations.length === 0 && !isLoading && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400 font-semibold">
                    No matching designations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-50 bg-gray-50/20 flex items-center justify-between text-xs font-semibold text-gray-500">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-opacity cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-opacity cursor-pointer flex items-center gap-1"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
      )}

      {/* Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedDesig?.name || "Designation Details"}
        subtitle={selectedDesig?.description}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={[
          { id: "overview", label: "Overview" },
        ]}
      >
        <div className="space-y-6">
          {activeTab === "overview" && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-gray-50 bg-gray-50/20 text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <Info className="h-4 w-4 text-gray-400" />
                Designation Info
              </div>
              <div className="p-4 space-y-3.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Department</span>
                  <span className="font-bold text-gray-800">{selectedDesig?.department?.name || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Status</span>
                  <span className={`font-bold ${selectedDesig?.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedDesig?.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-medium">Total Employees</span>
                  <span className="font-bold text-gray-800">{selectedDesig?.employeeCount || 0}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Drawer>

      {/* Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={closeModals}
        title={editingDesig ? "Edit Designation" : "Add Designation"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Designation Name
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700"
              placeholder="e.g. Senior Developer"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Department
            </label>
            <select
              required
              value={form.departmentId}
              onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 bg-white"
            >
              <option value="" disabled>Select Department</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 bg-white"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief description..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 resize-none"
            />
          </div>

          {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={closeModals}
              className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
            >
              {isSaving && <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              Save Designation
            </button>
          </div>
        </form>
      </Modal>

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
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-400">Loading...</p>
      </div>
    }>
      <DesignationsContent />
    </Suspense>
  );
}
