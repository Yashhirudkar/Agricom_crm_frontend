import React from "react";
import { Building2, Users, Edit2, Trash2 } from "lucide-react";

export default function DesignationsTable({
  designations,
  selectedDesig,
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
            <th className="px-6 py-4">Designation</th>
            <th className="px-6 py-4">Department</th>
            <th className="px-6 py-4">Employees</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-xs">
          {designations.map((desig) => {
            const isSelected = selectedDesig?.id === desig.id;
            return (
              <tr
                key={desig.id}
                onClick={() => handleOpenDrawer(desig)}
                className={`hover:bg-gray-50/70 transition-colors cursor-pointer ${
                  isSelected ? "bg-blue-50/40" : ""
                }`}
              >
                <td className="px-6 py-4">
                  <span className="font-bold text-gray-800">{desig.name}</span>
                </td>
                <td className="px-6 py-4 text-gray-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-gray-400" />
                    {desig.department?.name || (
                      <span className="text-gray-300 italic">None</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-gray-500" title="Employees">
                    <Users className="h-3.5 w-3.5" /> <span>{desig.employeeCount || 0}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      desig.status === "Active"
                        ? "bg-green-50 text-green-600 border border-green-100"
                        : "bg-red-50 text-red-600 border border-red-100"
                    }`}
                  >
                    {desig.status}
                  </span>
                </td>
                <td
                  className="px-6 py-4 text-right space-x-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => openEdit(desig)}
                    className="p-1 rounded-lg text-gray-400 hover:text-[#007aff] hover:bg-blue-50 transition-colors cursor-pointer"
                    title="Edit details"
                  >
                    <Edit2 className="h-4 w-4 inline" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(desig)}
                    className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete designation"
                  >
                    <Trash2 className="h-4 w-4 inline" />
                  </button>
                </td>
              </tr>
            );
          })}
          {designations.length === 0 && !isLoading && (
            <tr>
              <td colSpan="5" className="px-6 py-12 text-center text-gray-400 font-semibold">
                No matching designations found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
