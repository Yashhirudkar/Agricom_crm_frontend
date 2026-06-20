import React from "react";
import Modal from "@/components/modals/Modal";

export default function CategoryModal({
  isOpen,
  onClose,
  onSubmit,
  form,
  setForm,
  isSaving,
  error,
  isEditMode,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? "Edit Category" : "New Category"}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Category Name
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700"
            placeholder="e.g. Electronics"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Description
          </label>
          <textarea
            rows="3"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 resize-none"
            placeholder="Brief description of the category..."
          />
        </div>

        {isEditMode && (
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-[#007aff] focus:ring-[#007aff]"
            />
            <label htmlFor="isActive" className="text-xs font-semibold text-gray-700">
              Active Status
            </label>
          </div>
        )}

        {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
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
            {isEditMode ? "Save Changes" : "Create Category"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
