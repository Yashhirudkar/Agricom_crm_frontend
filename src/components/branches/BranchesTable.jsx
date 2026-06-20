import React from "react";
import { Edit2, Trash2 } from "lucide-react";

export default function BranchesTable({
  branches,
  selectedBranch,
  handleOpenDrawer,
  openEdit,
  setDeleteTarget,
  isLoading,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/30 text-gray-400 uppercase tracking-widest text-[10px] font-bold">
            <th className="px-6 py-4">Branch</th>
            <th className="px-6 py-4">Location</th>
            <th className="px-6 py-4">Manager</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-xs">
          {branches.map((branch) => {
            const isSelected = selectedBranch?.id === branch.id;
            return (
              <tr
                key={branch.id}
                onClick={() => handleOpenDrawer(branch)}
                className={`hover:bg-gray-50/70 transition-colors cursor-pointer ${
                  isSelected ? "bg-blue-50/40" : ""
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800 flex items-center gap-1.5">
                      {branch.branchName}
                      {branch.isHeadOffice && (
                        <span className="px-1.5 py-0.5 bg-blue-50 text-[#007aff] text-[9px] rounded font-bold uppercase">
                          HO
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono mt-0.5">
                      {branch.branchCode}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500 font-medium max-w-[200px] truncate">
                  {branch.city}, {branch.state}
                </td>
                <td className="px-6 py-4 text-gray-500 font-medium">
                  {branch.manager ? (
                    `${branch.manager.firstName} ${branch.manager.lastName}`
                  ) : (
                    <span className="text-gray-400 italic">Unassigned</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      branch.isActive !== false
                        ? "bg-green-50 text-green-600 border border-green-100"
                        : "bg-red-50 text-red-600 border border-red-100"
                    }`}
                  >
                    {branch.isActive !== false ? "Active" : "Inactive"}
                  </span>
                </td>
                <td
                  className="px-6 py-4 text-right space-x-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => openEdit(branch)}
                    className="p-1 rounded-lg text-gray-400 hover:text-[#007aff] hover:bg-blue-50 transition-colors cursor-pointer"
                    title="Edit details"
                  >
                    <Edit2 className="h-4 w-4 inline" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(branch)}
                    className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete branch"
                  >
                    <Trash2 className="h-4 w-4 inline" />
                  </button>
                </td>
              </tr>
            );
          })}
          {branches.length === 0 && !isLoading && (
            <tr>
              <td
                colSpan="5"
                className="px-6 py-12 text-center text-gray-400 font-semibold"
              >
                No matching branches found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
