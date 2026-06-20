import React from "react";
import Modal from "@/components/modals/Modal";

export default function CreateClientModal({
  isModalOpen,
  closeModal,
  handleSubmit,
  formData,
  setFormData,
  editingClient,
  isSaving,
}) {
  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      title={editingClient ? "Modify Tenant Limits" : "Create Tenant Owner"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Company / Group Name
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700"
            placeholder="e.g. TNT Group"
            disabled={isSaving}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Owner Admin Email
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700"
            placeholder="admin@tntgroup.com"
            disabled={isSaving}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Password{" "}
            {editingClient && (
              <span className="text-[10px] text-gray-400 font-medium lowercase">
                (leave blank to keep)
              </span>
            )}
          </label>
          <input
            type="password"
            required={!editingClient}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700"
            placeholder="Minimum 6 characters"
            disabled={isSaving}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Max Workspaces
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.allowedCompanies}
              onChange={(e) =>
                setFormData({ ...formData, allowedCompanies: parseInt(e.target.value) })
              }
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700"
              disabled={isSaving}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Max Allowed Users
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.allowedUsers}
              onChange={(e) =>
                setFormData({ ...formData, allowedUsers: parseInt(e.target.value) })
              }
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700"
              disabled={isSaving}
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={closeModal}
            disabled={isSaving}
            className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 disabled:opacity-50 rounded-xl text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            {isSaving ? "Saving..." : "Save Tenant"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
