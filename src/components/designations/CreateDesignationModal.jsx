import React, { useState, useEffect } from "react";
import Modal from "@/components/modals/Modal";
import SearchableSelect from "@/components/common/SearchableSelect";
import axiosClient from "@/lib/axios";

export default function CreateDesignationModal({
  isCreateOpen,
  closeModals,
  handleSave,
  editingDesig,
  form,
  setForm,
  isSaving,
  error,
}) {
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedParent, setSelectedParent] = useState(null);

  useEffect(() => {
    if (isCreateOpen) {
      if (editingDesig?.department) {
        setSelectedDept({ value: editingDesig.department.id, label: editingDesig.department.name });
      } else {
        setSelectedDept(null);
      }
      if (editingDesig?.parentDesignation) {
        setSelectedParent({ value: editingDesig.parentDesignation.id, label: editingDesig.parentDesignation.name });
      } else {
        setSelectedParent(null);
      }
    }
  }, [isCreateOpen, editingDesig]);
  return (
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
          <SearchableSelect
            endpoint="/departments/options"
            value={selectedDept}
            onChange={(val) => {
              setSelectedDept(val);
              setForm({ ...form, departmentId: val ? val.value : "" });
            }}
            placeholder="Search Department..."
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Parent Designation
          </label>
          <SearchableSelect
            endpoint="/designations/options"
            value={selectedParent}
            onChange={(val) => {
              setSelectedParent(val);
              setForm({ ...form, parentId: val ? val.value : "" });
            }}
            placeholder="Search Parent Designation (Optional)..."
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Salary Min
            </label>
            <input
              type="number"
              value={form.salaryBandMin}
              onChange={(e) => setForm({ ...form, salaryBandMin: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700"
              placeholder="0"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Salary Max
            </label>
            <input
              type="number"
              value={form.salaryBandMax}
              onChange={(e) => setForm({ ...form, salaryBandMax: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700"
              placeholder="0"
            />
          </div>
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
            {isSaving && (
              <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            Save Designation
          </button>
        </div>
      </form>
    </Modal>
  );
}
