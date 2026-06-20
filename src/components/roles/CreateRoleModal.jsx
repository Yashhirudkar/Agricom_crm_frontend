import React from "react";
import Modal from "@/components/modals/Modal";

export default function CreateRoleModal({
  isCreateOpen,
  closeModals,
  handleSave,
  editingRole,
  isCustomRole,
  selectedRoleNameOption,
  handleRoleNameOptionChange,
  roles,
  form,
  setForm,
  isSaving,
  error,
}) {
  return (
    <Modal
      isOpen={isCreateOpen}
      onClose={closeModals}
      title={editingRole ? "Edit Role Configuration" : "New Custom Scoped Role"}
    >
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Role Name
          </label>
          <select
            required
            value={isCustomRole ? "new_role" : selectedRoleNameOption}
            onChange={(e) => handleRoleNameOptionChange(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 bg-white mb-2"
            disabled={isSaving}
          >
            <option value="" disabled>
              Select Role Name...
            </option>
            {Array.from(new Set(roles.map((r) => r.name)))
              .filter(Boolean)
              .map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            <option value="new_role" className="font-semibold text-[#007aff]">
              + Create New Role...
            </option>
          </select>

          {isCustomRole && (
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 mt-2"
              placeholder="Enter custom role name (e.g. Sales Coordinator)"
              disabled={isSaving}
            />
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description of role permissions..."
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 resize-none"
            disabled={isSaving}
          />
        </div>

        {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={closeModals}
            disabled={isSaving}
            className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 disabled:opacity-50 rounded-xl text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
          >
            {isSaving && (
              <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            Save Configuration
          </button>
        </div>
      </form>
    </Modal>
  );
}
