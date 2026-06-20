import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import HasPermission from "@/components/rbac/HasPermission";

export default function LeaveTypesTable({ leaveTypes, openEditModal, setDeleteTarget }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/30 text-gray-400 uppercase tracking-widest text-[10px] font-bold">
            <th className="px-6 py-4">Name & Code</th>
            <th className="px-6 py-4">Days/Year</th>
            <th className="px-6 py-4">Attributes</th>
            <th className="px-6 py-4">Carry Forward</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-xs">
          {leaveTypes.length > 0 ? (
            leaveTypes.map((lt, idx) => (
              <tr key={`lt-${lt.id || idx}-${idx}`} className="hover:bg-gray-50/70 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-800">{lt.name}</div>
                  <div className="text-[10px] text-gray-400 font-mono mt-0.5">{lt.code}</div>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-700">
                  {lt.daysPerYear}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {lt.isPaid ? (
                      <span className="px-1.5 py-0.5 bg-green-50 text-green-600 rounded text-[9px] font-bold uppercase">Paid</span>
                    ) : (
                      <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[9px] font-bold uppercase">Unpaid</span>
                    )}
                    {lt.requiresApproval && <span className="px-1.5 py-0.5 bg-blue-50 text-[#007aff] rounded text-[9px] font-bold uppercase">Approval Req</span>}
                    {lt.allowHalfDay && <span className="px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded text-[9px] font-bold uppercase">Half Day</span>}
                    {lt.encashable && <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-bold uppercase">Encashable</span>}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {lt.carryForwardAllowed ? (
                    <span className="font-semibold text-gray-700">Max {lt.maxCarryForwardDays} days</span>
                  ) : (
                    <span className="text-gray-400 italic">Not allowed</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {lt.isActive ? (
                    <span className="px-2 py-0.5 bg-green-50 text-green-600 border border-green-100 rounded text-[10px] font-bold">Active</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded text-[10px] font-bold">Inactive</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <HasPermission permission="leave_types:update">
                    <button
                      onClick={() => openEditModal(lt)}
                      className="p-1 rounded-lg text-gray-400 hover:text-[#007aff] hover:bg-blue-50 transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4 inline" />
                    </button>
                  </HasPermission>
                  <HasPermission permission="leave_types:delete">
                    <button
                      onClick={() => setDeleteTarget(lt)}
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
            <tr key="no-data">
              <td colSpan="6" className="px-6 py-12 text-center text-gray-400 font-semibold">
                No leave types found. Click "Add Leave Type" to create one.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
