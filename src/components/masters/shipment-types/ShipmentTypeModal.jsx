import React from "react";
import Modal from "@/components/modals/Modal";

export default function ShipmentTypeModal({
  isOpen,
  onClose,
  onSubmit,
  form,
  setForm,
  isSaving,
  error,
  isEditMode,
}) {
  const lbl = "block text-xs font-semibold text-gray-700 mb-1.5";
  const inp = "w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] focus:bg-white transition-all";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Edit Shipment Type" : "Create Shipment Type"}
      size="md"
    >
      <form onSubmit={onSubmit} className="p-6 space-y-5">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lbl}>Code <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              className={inp}
              placeholder="e.g. FOB"
            />
          </div>
          <div>
            <label className={lbl}>Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inp}
              placeholder="e.g. Free On Board"
            />
          </div>
        </div>

        {isEditMode && (
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="w-4 h-4 text-[#007aff] bg-gray-100 border-gray-300 rounded focus:ring-[#007aff] focus:ring-2"
            />
            <label htmlFor="isActive" className="text-xs font-semibold text-gray-700 cursor-pointer">
              Active Status
            </label>
          </div>
        )}

        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 text-xs font-bold text-white bg-[#007aff] hover:bg-blue-600 rounded-xl transition-all shadow-sm shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving && <div className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />}
            {isEditMode ? "Save Changes" : "Create Shipment Type"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
