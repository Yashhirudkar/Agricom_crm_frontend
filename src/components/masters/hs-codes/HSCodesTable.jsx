import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import HasPermission from "@/components/rbac/HasPermission";

export default function HSCodesTable({ hscodes, openEditModal, setDeleteTarget }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/30 text-gray-400 uppercase tracking-widest text-[10px] font-bold">
            <th className="px-6 py-4">HS Code</th>
            <th className="px-6 py-4">Description</th>
            <th className="px-6 py-4">Chapter / Sub-heading</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-xs">
          {hscodes.length > 0 ? (
            hscodes.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-800 font-mono text-[13px]">{item.code}</div>
                </td>
                <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                  {item.description}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  <div>Ch: {item.chapter || "-"}</div>
                  <div>Sub: {item.subHeading || "-"}</div>
                </td>
                <td className="px-6 py-4">
                  {item.isActive ? (
                    <span className="px-2 py-0.5 bg-green-50 text-green-600 border border-green-100 rounded text-[10px] font-bold">Active</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded text-[10px] font-bold">Inactive</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <HasPermission permission="hscode:update">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1 rounded-lg text-gray-400 hover:text-[#007aff] hover:bg-blue-50 transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4 inline" />
                    </button>
                  </HasPermission>
                  <HasPermission permission="hscode:delete">
                    <button
                      onClick={() => setDeleteTarget(item)}
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
              <td colSpan="5" className="px-6 py-12 text-center text-gray-400 font-semibold">
                No HS Codes found. Click "Create HS Code" to add one.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
