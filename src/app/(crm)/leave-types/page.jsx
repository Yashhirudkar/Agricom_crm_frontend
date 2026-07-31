"use client";

import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUserType } from "@/store/slices/authSlice";
import { selectActiveCompanyId } from "@/store/slices/companyContextSlice";
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
import Pagination from "@/components/common/Pagination";

function LeaveTypesContent() {
  const dispatch = useDispatch();

  const userType = useSelector(selectUserType);
  const activeCompanyId = useSelector(selectActiveCompanyId) || "";

  const { data: leaveTypes, totalPages } = useSelector(selectLeaveTypesData) || { data: [], totalPages: 1 };
  const isLoading = useSelector(selectLeaveTypesLoading);
  const error = useSelector(selectLeaveTypesError);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (activeCompanyId) {
      dispatch(fetchLeaveTypes({ page: currentPage, limit: itemsPerPage }));
    }
  }, [dispatch, activeCompanyId, currentPage]);

  useEffect(() => {
    if (error) {
      showToast(error, "error");
      dispatch(clearLeaveTypesError());
    }
  }, [error, dispatch]);

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
      dispatch(fetchLeaveTypes({ page: currentPage, limit: itemsPerPage }));
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
      if (leaveTypes.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        dispatch(fetchLeaveTypes({ page: currentPage, limit: itemsPerPage }));
      }
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
          <HasPermission permission="leave_types:create">
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl flex items-center gap-2 text-xs font-semibold shadow-sm shadow-blue-500/20 cursor-pointer transition-colors"
            >
              <Plus className="h-4 w-4" /> Add Leave Type
            </button>
          </HasPermission>
        </div>
      </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <LeaveTypesTable
            leaveTypes={leaveTypes}
            openEditModal={openEditModal}
            setDeleteTarget={setDeleteTarget}
          />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>

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
