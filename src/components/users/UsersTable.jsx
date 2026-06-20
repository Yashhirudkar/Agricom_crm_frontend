import React from "react";
import { Trash2 } from "lucide-react";
import StatusBadge from "@/components/common/StatusBadge";

export default function UsersTable({
  paginatedUsers,
  selectedUserIds,
  selectedUser,
  sortField,
  sortOrder,
  handleSort,
  handleSelectAll,
  handleSelectRow,
  handleOpenDrawer,
  setDeleteTarget,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/30 text-gray-400 uppercase tracking-widest text-[10px] font-bold">
            <th className="px-6 py-4 w-4">
              <input
                type="checkbox"
                checked={
                  paginatedUsers.length > 0 &&
                  paginatedUsers.every((u) => selectedUserIds.includes(u.id))
                }
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-[#007aff] focus:ring-[#007aff] cursor-pointer"
              />
            </th>
            <th
              onClick={() => handleSort("name")}
              className="px-6 py-4 cursor-pointer hover:text-gray-900 transition-colors"
            >
              User Profile {sortField === "name" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th
              onClick={() => handleSort("email")}
              className="px-6 py-4 cursor-pointer hover:text-gray-900 transition-colors"
            >
              Contact Email {sortField === "email" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th className="px-6 py-4">Assigned Workspaces</th>
            <th
              onClick={() => handleSort("status")}
              className="px-6 py-4 cursor-pointer hover:text-gray-900 transition-colors"
            >
              Account Status {sortField === "status" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-xs">
          {paginatedUsers.map((u) => {
            const isSelected = selectedUser?.id === u.id;
            const isChecked = selectedUserIds.includes(u.id);
            return (
              <tr
                key={u.id}
                onClick={() => handleOpenDrawer(u)}
                className={`hover:bg-gray-50/70 transition-colors cursor-pointer ${
                  isSelected ? "bg-blue-50/40" : ""
                } ${isChecked ? "bg-blue-50/20" : ""}`}
              >
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => handleSelectRow(u.id, e.target.checked)}
                    className="rounded border-gray-300 text-[#007aff] focus:ring-[#007aff] cursor-pointer"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                      {u.name ? u.name.slice(0, 2).toUpperCase() : "??"}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">
                        {u.name
                          ? u.name
                              .split(" ")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() +
                                  word.slice(1).toLowerCase()
                              )
                              .join(" ")
                          : "Invitation Pending"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500 font-semibold">{u.email}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {u.userCompanies && u.userCompanies.length > 0 ? (
                      u.userCompanies.map((uc) => (
                        <span
                          key={uc.companyId}
                          className="px-2 py-0.5 rounded bg-gray-50 border border-gray-200 text-[10px] text-gray-500 font-semibold"
                        >
                          {uc.company?.name || "Workspace"}
                          {uc.role && (
                            <span className="text-gray-400 font-bold ml-1">
                              ({uc.role.name})
                            </span>
                          )}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-gray-400 font-medium">None assigned</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={u.status} />
                </td>
                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setDeleteTarget(u)}
                    className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete user"
                  >
                    <Trash2 className="h-4 w-4 inline" />
                  </button>
                </td>
              </tr>
            );
          })}

          {paginatedUsers.length === 0 && (
            <tr>
              <td colSpan="6" className="px-6 py-12 text-center text-gray-400 font-semibold">
                No users matching the filter criteria found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
