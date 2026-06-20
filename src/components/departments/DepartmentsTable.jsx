import React from "react";
import { Users, Shield, Edit2, Trash2 } from "lucide-react";

export default function DepartmentsTable({
  departments,
  selectedDept,
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
            <th className="px-6 py-4">Dept Name</th>
            <th className="px-6 py-4">Description</th>
            <th className="px-6 py-4">Stats</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-xs">
          {departments.map((dept) => {
            const isSelected = selectedDept?.id === dept.id;
            return (
              <tr
                key={dept.id}
                onClick={() => handleOpenDrawer(dept)}
                className={`hover:bg-gray-50/70 transition-colors cursor-pointer ${
                  isSelected ? "bg-blue-50/40" : ""
                }`}
              >
                <td className="px-6 py-4">
                  <span className="font-bold text-gray-800">{dept.name}</span>
                </td>
                <td className="px-6 py-4 text-gray-500 font-medium max-w-[200px] truncate">
                  {dept.description || (
                    <span className="text-gray-300 italic">No description</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <div
                      className="flex items-center gap-1 text-gray-500"
                      title="Employees"
                    >
                      <Users className="h-3.5 w-3.5" />{" "}
                      <span>{dept.employeeCount || 0}</span>
                    </div>
                    <div
                      className="flex items-center gap-1 text-gray-500"
                      title="Designations"
                    >
                      <Shield className="h-3.5 w-3.5" />{" "}
                      <span>{dept.designationCount || 0}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      dept.status === "Active"
                        ? "bg-green-50 text-green-600 border border-green-100"
                        : "bg-red-50 text-red-600 border border-red-100"
                    }`}
                  >
                    {dept.status}
                  </span>
                </td>
                <td
                  className="px-6 py-4 text-right space-x-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => openEdit(dept)}
                    className="p-1 rounded-lg text-gray-400 hover:text-[#007aff] hover:bg-blue-50 transition-colors cursor-pointer"
                    title="Edit details"
                  >
                    <Edit2 className="h-4 w-4 inline" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(dept)}
                    className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete department"
                  >
                    <Trash2 className="h-4 w-4 inline" />
                  </button>
                </td>
              </tr>
            );
          })}
          {departments.length === 0 && !isLoading && (
            <tr>
              <td
                colSpan="5"
                className="px-6 py-12 text-center text-gray-400 font-semibold"
              >
                No matching departments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
