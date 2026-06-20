import React from "react";
import { Edit2, Trash2 } from "lucide-react";

export default function RolesTable({
  paginatedRoles,
  selectedRole,
  handleOpenDrawer,
  openEdit,
  setDeleteTarget,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/30 text-gray-400 uppercase tracking-widest text-[10px] font-bold">
            <th className="px-6 py-4">Role ID</th>
            <th className="px-6 py-4">Role Name</th>
            <th className="px-6 py-4">Description</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-xs">
          {paginatedRoles.map((role) => {
            const isSelected = selectedRole?.id === role.id;
            return (
              <tr
                key={role.id}
                onClick={() => handleOpenDrawer(role)}
                className={`hover:bg-gray-50/70 transition-colors cursor-pointer ${
                  isSelected ? "bg-blue-50/40" : ""
                }`}
              >
                <td className="px-6 py-4 text-gray-400 font-mono font-semibold">#{role.id}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800">
                      {role.name
                        ?.split(" ")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                        )
                        .join(" ")}
                    </span>
                    {role.isSystemRole && (
                      <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded text-[9px] font-bold">
                        System
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500 font-medium">
                  {role.description || (
                    <span className="text-gray-300 italic">No description</span>
                  )}
                </td>
                <td
                  className="px-6 py-4 text-right space-x-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => openEdit(role)}
                    className="p-1 rounded-lg text-gray-400 hover:text-[#007aff] hover:bg-blue-50 transition-colors cursor-pointer"
                    title="Edit details"
                  >
                    <Edit2 className="h-4 w-4 inline" />
                  </button>
                  {!role.isSystemRole && (
                    <button
                      onClick={() => setDeleteTarget(role)}
                      className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete role"
                    >
                      <Trash2 className="h-4 w-4 inline" />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}

          {paginatedRoles.length === 0 && (
            <tr>
              <td colSpan="4" className="px-6 py-12 text-center text-gray-400 font-semibold">
                No matching roles found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
