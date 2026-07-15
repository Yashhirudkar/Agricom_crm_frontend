import React from "react";
import { Edit2, Ban, RotateCcw, Trash2 } from "lucide-react";
import HasPermission from "@/components/rbac/HasPermission";

export default function TradeDocumentsTable({
  tradeDocuments,
  openEditModal,
  setDeleteTarget,
  setRestoreTarget,
  setPermanentDeleteTarget,
}) {
  return (
    <div className="overflow-x-auto min-h-[300px]">
      <table className="w-full text-left text-xs whitespace-nowrap">
        <thead className="bg-gray-50/80 text-gray-500 font-semibold border-b border-gray-100">
          <tr>
            <th className="px-6 py-4 rounded-tl-xl">Code</th>
            <th className="px-6 py-4">Document Name</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right rounded-tr-xl">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {tradeDocuments?.length === 0 ? (
            <tr>
              <td colSpan="4" className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <p className="text-sm font-medium text-gray-500">No trade documents found</p>
                  <p className="text-xs mt-1">Try adjusting your filters or create a new one.</p>
                </div>
              </td>
            </tr>
          ) : (
            tradeDocuments?.map((td) => (
              <tr key={td.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4 font-bold text-gray-900">
                  {td.code}
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-900">{td.name}</p>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      td.status === "Active"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-red-100 text-red-700 border border-red-200"
                    }`}
                  >
                    {td.status === "Active" ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2 transition-opacity">
                    <HasPermission permission="tradedocument:edit">
                      <button
                        onClick={() => openEditModal(td)}
                        className="p-1.5 text-gray-400 hover:text-[#007aff] hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </HasPermission>
                    {td.status === "Active" ? (
                      <HasPermission permission="tradedocument:delete">
                        <button
                          onClick={() => setDeleteTarget(td)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Deactivate"
                        >
                          <Ban className="h-4 w-4" />
                        </button>
                      </HasPermission>
                    ) : (
                      <>
                        <HasPermission permission="tradedocument:edit">
                          <button
                            onClick={() => setRestoreTarget(td)}
                            className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                            title="Restore"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                        </HasPermission>
                        <HasPermission permission="tradedocument:delete">
                          <button
                            onClick={() => setPermanentDeleteTarget(td)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Permanent Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </HasPermission>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
