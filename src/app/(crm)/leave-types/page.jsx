"use client";

import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUserType } from "@/store/slices/authSlice";
import { fetchCompanies, selectCompanies } from "@/store/slices/companiesSlice";
import {
  fetchLeaveTypes,
  createLeaveType,
  updateLeaveType,
  deleteLeaveType,
  selectLeaveTypesData,
  selectLeaveTypesLoading,
  selectLeaveTypesError,
  clearLeaveTypesError
} from "@/store/entities/leaveTypesSlice";
import ConfirmModal from "@/components/modals/ConfirmModal";
import HasPermission from "@/components/rbac/HasPermission";
import { Plus, Calendar, Check, AlertCircle, Building2 } from "lucide-react";

import LeaveTypesTable from "@/components/leave-types/LeaveTypesTable";
import CreateLeaveTypeModal from "@/components/leave-types/CreateLeaveTypeModal";

function LeaveTypesContent() {
  const dispatch = useDispatch();

  const userType = useSelector(selectUserType);
  const allCompanies = useSelector(selectCompanies) || [];

  const { data: leaveTypes } = useSelector(selectLeaveTypesData) || { data: [] };
  const isLoading = useSelector(selectLeaveTypesLoading);
  const error = useSelector(selectLeaveTypesError);

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

  useEffect(() => {
    if (userType === "super_admin") {
      dispatch(fetchCompanies());
    }
  }, [dispatch, userType]);

  useEffect(() => {
    if (selectedCompanyId) {
      dispatch(fetchLeaveTypes({}));
    }
  }, [dispatch, selectedCompanyId]);

  useEffect(() => {
    if (error) {
      showToast(error, "error");
      dispatch(clearLeaveTypesError());
    }
  }, [error, dispatch]);

  const handleCompanyChange = (e) => {
    const val = e.target.value;
    setSelectedCompanyId(val);
    if (val) {
      localStorage.setItem("activeCompanyId", val);
    } else {
      localStorage.removeItem("activeCompanyId");
    }
  };

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    daysPerYear: 0,
    minimumServiceDays: 0,
    applicableAfterProbation: false,
    requiresApproval: true,
    isPaid: true,
    encashable: false,
    allowHalfDay: false,
    carryForwardAllowed: false,
    maxCarryForwardDays: 0,
    isActive: true
  });

  const openCreateModal = () => {
    setIsEditMode(false);
    setSelectedLeaveType(null);
    setFormData({
      name: "",
      code: "",
      description: "",
      daysPerYear: 0,
      minimumServiceDays: 0,
      applicableAfterProbation: false,
      requiresApproval: true,
      isPaid: true,
      encashable: false,
      allowHalfDay: false,
      carryForwardAllowed: false,
      maxCarryForwardDays: 0,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (leaveType) => {
    setIsEditMode(true);
    setSelectedLeaveType(leaveType);
    setFormData({
      name: leaveType.name || "",
      code: leaveType.code || "",
      description: leaveType.description || "",
      daysPerYear: leaveType.daysPerYear || 0,
      minimumServiceDays: leaveType.minimumServiceDays || 0,
      applicableAfterProbation: leaveType.applicableAfterProbation || false,
      requiresApproval: leaveType.requiresApproval !== false,
      isPaid: leaveType.isPaid !== false,
      encashable: leaveType.encashable || false,
      allowHalfDay: leaveType.allowHalfDay || false,
      carryForwardAllowed: leaveType.carryForwardAllowed || false,
      maxCarryForwardDays: leaveType.maxCarryForwardDays || 0,
      isActive: leaveType.isActive !== false
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = type === "checkbox" ? checked : value;
    if (type === "number") val = val === "" ? 0 : Number(val);
    
    setFormData(prev => ({
      ...prev,
      [name]: val
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditMode && selectedLeaveType) {
        await dispatch(updateLeaveType({ id: selectedLeaveType.id, data: formData })).unwrap();
        showToast("Leave Type updated successfully");
      } else {
        await dispatch(createLeaveType(formData)).unwrap();
        showToast("Leave Type created successfully");
      }
      setIsModalOpen(false);
      dispatch(fetchLeaveTypes({}));
    } catch (err) {
      // Error handled by useEffect
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await dispatch(deleteLeaveType(deleteTarget.id)).unwrap();
      showToast("Leave Type deleted successfully");
      setDeleteTarget(null);
      dispatch(fetchLeaveTypes({}));
    } catch (err) {
      // Error handled by useEffect
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && leaveTypes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-400">Loading Leave Types...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto space-y-6">
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-xs font-bold text-white transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
          {toast.type === "error" ? <AlertCircle className="h-4 w-4" /> : <Check className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Calendar className="h-6 w-6 text-[#007aff]" />
            Leave Types
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Configure different types of leaves available for your employees.
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
              {allCompanies.map((c, idx) => (
                <option key={`company-${c.id || idx}-${idx}`} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
          <HasPermission permission="leave_types:create">
            <button
              onClick={openCreateModal}
              disabled={!selectedCompanyId}
              className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm shadow-blue-500/20 cursor-pointer transition-colors"
            >
              <Plus className="h-4 w-4" /> Add Leave Type
            </button>
          </HasPermission>
        </div>
      </div>

      {!selectedCompanyId ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
          <Building2 className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <h2 className="text-sm font-bold text-gray-700 mb-1">Company Context Required</h2>
          <p className="text-xs text-gray-500">
            Please select a company to manage leave types.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <LeaveTypesTable
            leaveTypes={leaveTypes}
            openEditModal={openEditModal}
            setDeleteTarget={setDeleteTarget}
          />
        </div>
      )}

      <CreateLeaveTypeModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        isEditMode={isEditMode}
        handleSubmit={handleSubmit}
        formData={formData}
        handleChange={handleChange}
        isSubmitting={isSubmitting}
      />

      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Leave Type"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
        confirmText={isSubmitting ? "Deleting..." : "Delete"}
        isDestructive={true}
      />
    </div>
  );
}

export default function LeaveTypesPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-400">Loading...</p>
      </div>
    }>
      <LeaveTypesContent />
    </Suspense>
  );
}
