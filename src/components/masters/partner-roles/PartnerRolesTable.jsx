import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import HasPermission from "@/components/rbac/HasPermission";

export default function PartnerRolesTable({ partnerRoles, openEditModal, setDeleteTarget }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/30 text-gray-400 uppercase tracking-widest text-[10px] font-bold">
            <th className="px-6 py-4">Role Name</th>
            <th className="px-6 py-4">Description</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-xs">
          {partnerRoles.length > 0 ? (
            partnerRoles.map((role) => (
              <tr key={role.id} className="hover:bg-gray-50/70 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-800">{role.name}</div>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {role.description || <span className="text-gray-400 italic">No description</span>}
                </td>
                <td className="px-6 py-4">
                  {role.isActive ? (
                    <span className="px-2 py-0.5 bg-green-50 text-green-600 border border-green-100 rounded text-[10px] font-bold">Active</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded text-[10px] font-bold">Inactive</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <HasPermission permission="partnerrole:update">
                    <button
                      onClick={() => openEditModal(role)}
                      className="p-1 rounded-lg text-gray-400 hover:text-[#007aff] hover:bg-blue-50 transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4 inline" />
                    </button>
                  </HasPermission>
                  <HasPermission permission="partnerrole:delete">
                    <button
                      onClick={() => setDeleteTarget(role)}
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
            <tr>
              <td colSpan="4" className="px-6 py-12 text-center text-gray-400 font-semibold">
                No Partner Roles found. Click "Create Role" to add one.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
