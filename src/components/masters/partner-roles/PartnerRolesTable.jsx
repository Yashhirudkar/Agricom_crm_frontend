import React from "react";
import { Edit2, Trash2, RefreshCcw, ShieldAlert, Ban, Sliders } from "lucide-react";
import HasPermission from "@/components/rbac/HasPermission";
import { usePermissions } from "@/hooks/usePermissions";
import Link from "next/link";

export default function PartnerRolesTable({ partnerRoles, openEditModal, setDeleteTarget, setRestoreTarget, setPermanentDeleteTarget }) {
  const { hasPermission } = usePermissions();

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
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 border border-gray-200 rounded text-[10px] font-bold">Inactive</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {role.isActive ? (
                    <>
                      {hasPermission("partner_dynamic_schema:view") && (
                        <Link
                          href={`/masters/partner-roles/${role.id}/dynamic-schema`}
                          className="px-2.5 py-1 text-[11px] font-bold text-purple-650 hover:text-purple-750 bg-purple-50 hover:bg-purple-100/70 border border-purple-150 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1 inline-block align-middle"
                          title="Configure Fields"
                        >
                          <Sliders className="h-3.5 w-3.5 inline" />
                          Configure Fields
                        </Link>
                      )}
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
                          className="p-1 rounded-lg text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-colors cursor-pointer"
                          title="Deactivate"
                        >
                          <Ban className="h-4 w-4 inline" />
                        </button>
                      </HasPermission>
                    </>
                  ) : (
                    <>
                      <HasPermission permission="partnerrole:update">
                        <button
                          onClick={() => setRestoreTarget(role)}
                          className="p-1 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors cursor-pointer"
                          title="Restore"
                        >
                          <RefreshCcw className="h-4 w-4 inline" />
                        </button>
                      </HasPermission>
                      <HasPermission permission="partnerrole:force_delete">
                        <button
                          onClick={() => setPermanentDeleteTarget(role)}
                          className="p-1 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Permanent Delete"
                        >
                          <ShieldAlert className="h-4 w-4 inline" />
                        </button>
                      </HasPermission>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-6 py-12 text-center text-gray-400 font-semibold">
                No Partner Roles found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
