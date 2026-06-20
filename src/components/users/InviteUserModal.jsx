import React from "react";
import Modal from "@/components/modals/Modal";

export default function InviteUserModal({
  inviteOpen,
  closeInviteModal,
  inviteForm,
  setInviteForm,
  handleInviteSubmit,
  userType,
  inviteClients,
  handleInviteClientChange,
  inviteCompanies,
  inviteRoles,
  inviteSaving,
  error,
}) {
  return (
    <Modal isOpen={inviteOpen} onClose={closeInviteModal} title="Create New User Account">
      <form onSubmit={handleInviteSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Full Name
          </label>
          <input
            type="text"
            required
            value={inviteForm.name}
            onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Email Address
          </label>
          <input
            type="email"
            required
            value={inviteForm.email}
            onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700"
            placeholder="colleague@domain.com"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Password
          </label>
          <input
            type="password"
            required
            value={inviteForm.password}
            onChange={(e) => setInviteForm({ ...inviteForm, password: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700"
            placeholder="••••••••"
          />
        </div>

        {userType === "super_admin" && (
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Select Target Client Tenant
            </label>
            <select
              required
              value={inviteForm.clientId}
              onChange={(e) => handleInviteClientChange(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-600 bg-white"
            >
              <option value="" disabled>
                Select client...
              </option>
              {inviteClients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} ({client.email})
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Select Base Role
          </label>
          <select
            required
            value={inviteForm.roleId}
            onChange={(e) => setInviteForm({ ...inviteForm, roleId: e.target.value })}
            disabled={userType === "super_admin" && !inviteForm.clientId}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-600 bg-white disabled:opacity-50"
          >
            <option value="" disabled>
              {userType === "super_admin" && !inviteForm.clientId
                ? "Select a client first..."
                : "Select role level..."}
            </option>
            {inviteRoles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Scope Workspaces (Optional)
          </label>
          <div className="max-h-[140px] overflow-y-auto border border-gray-100 rounded-xl p-3 bg-gray-50/50 space-y-2">
            {inviteCompanies.map((co) => {
              const isChecked = inviteForm.companyIds.includes(co.id);
              return (
                <label key={co.id} className="flex items-center gap-2 text-xs text-gray-600 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      const newIds = e.target.checked
                        ? [...inviteForm.companyIds, co.id]
                        : inviteForm.companyIds.filter((x) => x !== co.id);
                      setInviteForm({ ...inviteForm, companyIds: newIds });
                    }}
                    className="rounded border-gray-300 text-[#007aff] focus:ring-[#007aff]"
                  />
                  {co.name}
                </label>
              );
            })}
            {userType === "super_admin" && !inviteForm.clientId && (
              <p className="text-[10px] text-gray-400 text-center font-medium">
                Select a client first to view their workspaces.
              </p>
            )}
            {(userType !== "super_admin" || inviteForm.clientId) && inviteCompanies.length === 0 && (
              <p className="text-[10px] text-gray-400 text-center font-medium">
                No active company workspaces to scope.
              </p>
            )}
          </div>
        </div>

        {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={closeInviteModal}
            className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={inviteSaving}
            className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-xs"
          >
            {inviteSaving ? "Creating..." : "Create User"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
