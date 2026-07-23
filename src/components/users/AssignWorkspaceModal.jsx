import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Modal from "@/components/modals/Modal";
import axiosClient from "@/lib/axios";
import { selectUser } from "@/store/slices/authSlice";

export default function AssignWorkspaceModal({
  isOpen,
  onClose,
  onSubmit,
  assignForm,
  setAssignForm,
  companies = [],
  selectedUser,
}) {
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const currentUser = useSelector(selectUser);

  // Determine target client ID based on selectedUser, falling back to currentUser
  const targetClientId = selectedUser?.clientId || currentUser?.clientId;

  // Fetch roles for the selected user's client when modal opens
  useEffect(() => {
    if (isOpen) {
      setLoadingRoles(true);
      const url = targetClientId ? `/GetRoles?clientId=${targetClientId}` : "/GetRoles";
      axiosClient
        .get(url)
        .then((res) => {
          const fetchedRoles = res.data?.data || res.data || [];
          setRoles(fetchedRoles);
          console.log("AssignWorkspaceModal: Fetched roles", fetchedRoles);
        })
        .catch((err) => {
          console.error("Failed to fetch roles for user's client:", err);
        })
        .finally(() => {
          setLoadingRoles(false);
        });
    }
  }, [isOpen, targetClientId]);

  // Filter companies:
  // 1. For Client Admins: Must belong to the user's client organization (targetClientId) if defined.
  // 2. For Super Admins: Can see all companies across all clients.
  // 3. Must not be already assigned to the user.
  const assignedCompanyIds = selectedUser?.userCompanies?.map((uc) => Number(uc.companyId)) || [];
  const isSuperAdmin = currentUser?.type === "super_admin";
  const availableCompanies = companies.filter(
    (company) =>
      (isSuperAdmin || !targetClientId || Number(company.clientId) === Number(targetClientId)) &&
      !assignedCompanyIds.includes(Number(company.id))
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!assignForm.companyId) return;

    const selectedCompany = companies.find((c) => Number(c.id) === Number(assignForm.companyId));
    const isTransfer = selectedUser?.clientId && selectedCompany && Number(selectedCompany.clientId) !== Number(selectedUser.clientId);

    if (isTransfer && isSuperAdmin) {
      const oldClientName = selectedUser?.client?.name || `Client #${selectedUser.clientId}`;
      const newClientName = selectedCompany?.client?.name || `Client #${selectedCompany.clientId}`;
      
      const confirmTransfer = window.confirm(
        `This workspace belongs to another Client.\n\nThe user will be transferred from\n\n${oldClientName}\n\nto\n\n${newClientName}.\n\nThis will remove previous workspace mappings.\n\nContinue?`
      );
      if (!confirmTransfer) return;
    }

    onSubmit(e);
  };

  useEffect(() => {
    if (isOpen) {
      console.log("AssignWorkspaceModal Open Debug:", {
        selectedUser,
        currentUser,
        targetClientId,
        allCompanies: companies,
        assignedCompanyIds,
        availableCompanies,
      });
    }
  }, [isOpen, selectedUser, currentUser, targetClientId, companies]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Workspace Membership">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Target Workspace (Company)
          </label>
          <select
            required
            value={assignForm.companyId}
            onChange={(e) => setAssignForm({ ...assignForm, companyId: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-600 bg-white"
          >
            <option value="" disabled>
              Select workspace...
            </option>
            {availableCompanies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
          {availableCompanies.length === 0 && (
            <p className="text-[10px] text-gray-400 mt-1 font-semibold">
              No unassigned company workspaces available for this client.
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Security Role Scope
          </label>
          <select
            required
            value={assignForm.roleId}
            onChange={(e) => setAssignForm({ ...assignForm, roleId: e.target.value })}
            disabled={loadingRoles}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-600 bg-white disabled:opacity-50"
          >
            <option value="" disabled>
              {loadingRoles ? "Loading roles..." : "Select role level..."}
            </option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={availableCompanies.length === 0}
            className="px-4 py-2 bg-[#007aff] hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-xs"
          >
            Assign Workspace
          </button>
        </div>
      </form>
    </Modal>
  );
}
