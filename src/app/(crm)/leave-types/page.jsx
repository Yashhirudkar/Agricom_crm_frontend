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
import Modal from "@/components/modals/Modal";
import ConfirmModal from "@/components/modals/ConfirmModal";
import HasPermission from "@/components/rbac/HasPermission";
import {
  Plus, Edit2, Trash2, Calendar, Check, AlertCircle, Search, Building2
} from "lucide-react";

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
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/30 text-gray-400 uppercase tracking-widest text-[10px] font-bold">
                  <th className="px-6 py-4">Name & Code</th>
                  <th className="px-6 py-4">Days/Year</th>
                  <th className="px-6 py-4">Attributes</th>
                  <th className="px-6 py-4">Carry Forward</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {leaveTypes.length > 0 ? (
                  leaveTypes.map((lt, idx) => (
                    <tr key={`lt-${lt.id || idx}-${idx}`} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-800">{lt.name}</div>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">{lt.code}</div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-700">
                        {lt.daysPerYear}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {lt.isPaid && <span className="px-1.5 py-0.5 bg-green-50 text-green-600 rounded text-[9px] font-bold uppercase">Paid</span>}
                          {!lt.isPaid && <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[9px] font-bold uppercase">Unpaid</span>}
                          {lt.requiresApproval && <span className="px-1.5 py-0.5 bg-blue-50 text-[#007aff] rounded text-[9px] font-bold uppercase">Approval Req</span>}
                          {lt.allowHalfDay && <span className="px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded text-[9px] font-bold uppercase">Half Day</span>}
                          {lt.encashable && <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-bold uppercase">Encashable</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {lt.carryForwardAllowed ? (
                          <span className="font-semibold text-gray-700">Max {lt.maxCarryForwardDays} days</span>
                        ) : (
                          <span className="text-gray-400 italic">Not allowed</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {lt.isActive ? (
                          <span className="px-2 py-0.5 bg-green-50 text-green-600 border border-green-100 rounded text-[10px] font-bold">Active</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded text-[10px] font-bold">Inactive</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <HasPermission permission="leave_types:update">
                          <button
                            onClick={() => openEditModal(lt)}
                            className="p-1 rounded-lg text-gray-400 hover:text-[#007aff] hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4 inline" />
                          </button>
                        </HasPermission>
                        <HasPermission permission="leave_types:delete">
                          <button
                            onClick={() => setDeleteTarget(lt)}
                            className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 inline" />
                          </button>
                        </HasPermission>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr key="no-data">
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400 font-semibold">
                      No leave types found. Click "Add Leave Type" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? "Edit Leave Type" : "Create Leave Type"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Leave Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Sick Leave"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff] text-gray-700"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Leave Code <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="code"
                required
                value={formData.code}
                onChange={handleChange}
                placeholder="e.g. SL"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff] text-gray-700 uppercase"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff] text-gray-700 resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Days Per Year <span className="text-red-500">*</span></label>
              <input
                type="number"
                name="daysPerYear"
                required
                min="0"
                step="0.5"
                value={formData.daysPerYear}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff] text-gray-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Minimum Service Days</label>
              <input
                type="number"
                name="minimumServiceDays"
                min="0"
                value={formData.minimumServiceDays}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff] text-gray-700"
              />
            </div>
          </div>

          <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 space-y-4 mt-4">
            <h4 className="text-xs font-bold text-gray-700 border-b border-gray-200 pb-2">Rules & Attributes</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  name="applicableAfterProbation"
                  checked={formData.applicableAfterProbation}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-[#007aff] focus:ring-[#007aff] border-gray-300"
                />
                <span className="text-xs text-gray-600 group-hover:text-gray-900 font-medium">Applicable After Probation</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  name="requiresApproval"
                  checked={formData.requiresApproval}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-[#007aff] focus:ring-[#007aff] border-gray-300"
                />
                <span className="text-xs text-gray-600 group-hover:text-gray-900 font-medium">Requires Approval</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  name="isPaid"
                  checked={formData.isPaid}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-[#007aff] focus:ring-[#007aff] border-gray-300"
                />
                <span className="text-xs text-gray-600 group-hover:text-gray-900 font-medium">Is Paid Leave</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  name="allowHalfDay"
                  checked={formData.allowHalfDay}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-[#007aff] focus:ring-[#007aff] border-gray-300"
                />
                <span className="text-xs text-gray-600 group-hover:text-gray-900 font-medium">Allow Half Day</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  name="encashable"
                  checked={formData.encashable}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-[#007aff] focus:ring-[#007aff] border-gray-300"
                />
                <span className="text-xs text-gray-600 group-hover:text-gray-900 font-medium">Encashable</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-[#007aff] focus:ring-[#007aff] border-gray-300"
                />
                <span className="text-xs text-gray-600 group-hover:text-gray-900 font-medium">Is Active</span>
              </label>
            </div>
          </div>

          <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 space-y-4">
            <h4 className="text-xs font-bold text-gray-700 border-b border-gray-200 pb-2">Carry Forward Rules</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  name="carryForwardAllowed"
                  checked={formData.carryForwardAllowed}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-[#007aff] focus:ring-[#007aff] border-gray-300"
                />
                <span className="text-xs text-gray-600 group-hover:text-gray-900 font-medium">Allow Carry Forward</span>
              </label>

              {formData.carryForwardAllowed && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Max Carry Forward Days</label>
                  <input
                    type="number"
                    name="maxCarryForwardDays"
                    min="0"
                    step="0.5"
                    value={formData.maxCarryForwardDays}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff] text-gray-700"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#007aff] text-white rounded-xl hover:bg-blue-600 text-xs font-semibold disabled:opacity-50 transition-colors shadow-sm shadow-blue-500/20"
            >
              {isSubmitting ? "Saving..." : isEditMode ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>

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
