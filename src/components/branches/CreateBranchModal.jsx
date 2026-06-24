import React, { useState, useEffect } from "react";
import Modal from "@/components/modals/Modal";
import SearchableSelect from "@/components/common/SearchableSelect";
import axiosClient from "@/lib/axios";

export default function CreateBranchModal({
  isCreateOpen,
  closeModals,
  editingBranch,
  handleSave,
  form,
  isSaving,
  error,
}) {
  const [selectedManager, setSelectedManager] = useState(null);

  useEffect(() => {
    if (isCreateOpen) {
      if (editingBranch?.manager) {
        setSelectedManager({ value: editingBranch.manager.id, label: `${editingBranch.manager.firstName} ${editingBranch.manager.lastName}` });
      } else {
        setSelectedManager(null);
      }
    }
  }, [isCreateOpen, editingBranch]);
  return (
    <Modal
      isOpen={isCreateOpen}
      onClose={closeModals}
      title={editingBranch ? "Edit Branch" : "Add Branch"}
      size="lg"
    >
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Branch Name
            </label>
            <input
              type="text"
              required
              value={form.branchName}
              onChange={(e) => setForm({ ...form, branchName: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700"
              placeholder="e.g. Mumbai North"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Branch Code
            </label>
            <input
              type="text"
              required
              value={form.branchCode}
              onChange={(e) => setForm({ ...form, branchCode: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 uppercase"
              placeholder="MUM-N-01"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Address
          </label>
          <textarea
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700"
            placeholder="Street address..."
            rows={2}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              City
            </label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              State
            </label>
            <input
              type="text"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Pincode / Zip
            </label>
            <input
              type="text"
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Country
            </label>
            <input
              type="text"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Timezone
            </label>
            <select
              value={form.timezone}
              onChange={(e) => setForm({ ...form, timezone: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 bg-white"
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Manager
            </label>
            <SearchableSelect
              endpoint="/employees/options"
              value={selectedManager}
              onChange={(val) => {
                setSelectedManager(val);
                setForm({ ...form, managerId: val ? val.value : "" });
              }}
              placeholder="Search Manager (Optional)..."
            />
          </div>
        </div>

        <div className="flex items-center gap-4 py-2 border-y border-gray-50 mt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isHeadOffice}
              onChange={(e) => setForm({ ...form, isHeadOffice: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-[#007aff] focus:ring-[#007aff]"
            />
            <span className="text-xs font-bold text-gray-700">Is Head Office</span>
          </label>
          <div className="flex-1 text-[10px] text-gray-400 italic">
            Note: A company can only have one Head Office. Setting this will unset others.
          </div>
        </div>

        {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

        <div className="flex justify-end gap-3 pt-4">
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
            Save Branch
          </button>
        </div>
      </form>
    </Modal>
  );
}
