import React from "react";
import Modal from "@/components/modals/Modal";

export default function CreateCompanyModal({
  isCreateOpen,
  closeModals,
  handleCreateSubmit,
  form,
  setForm,
  isSaving,
  userType,
  clients,
  error,
}) {
  return (
    <Modal isOpen={isCreateOpen} onClose={closeModals} title="New Workspace Company">
      <form onSubmit={handleCreateSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Workspace Company Name
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700"
            placeholder="e.g. TNT Noida"
          />
        </div>

        {userType === "super_admin" && (
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Assign to Tenant Client
            </label>
            <select
              required
              value={form.clientId}
              onChange={(e) => setForm({ ...form, clientId: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-600 bg-white"
            >
              <option value="" disabled>
                Select a tenant client...
              </option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (Client #{c.id})
                </option>
              ))}
            </select>
          </div>
        )}

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
            Create Workspace
          </button>
        </div>
      </form>
    </Modal>
  );
}
