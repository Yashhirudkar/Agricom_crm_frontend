import React from "react";
import { Edit2, Trash2, RefreshCcw, ShieldAlert, Ban } from "lucide-react";
import HasPermission from "@/components/rbac/HasPermission";

export default function ProductsTable({ products, openEditModal, setDeleteTarget, setRestoreTarget, setPermanentDeleteTarget }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/30 text-gray-400 uppercase tracking-widest text-[10px] font-bold">
            <th className="px-6 py-4">Product Name</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Origin / HS Code</th>
            <th className="px-6 py-4">SubType / Spec</th>
            <th className="px-6 py-4">Logistics Base</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-xs">
          {products.length > 0 ? (
            products.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-800">{item.name}</div>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {item.category?.name || "-"}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  <div><span className="font-semibold">Country:</span> {item.country?.name || "-"}</div>
                  <div><span className="font-semibold">HS Code:</span> {item.hsCode?.code || "-"}</div>
                </td>
                <td className="px-6 py-4 text-gray-600 max-w-[200px]">
                  <div className="truncate" title={item.qualitySubType || ""}><span className="font-semibold">Type:</span> {item.qualitySubType || "-"}</div>
                  <div className="truncate" title={item.specification || ""}><span className="font-semibold">Spec:</span> {item.specification || "-"}</div>
                </td>
                <td className="px-6 py-4 text-gray-600 font-mono text-[10px]">
                  <div>20ft: {item.qty20ftContainer ?? "-"}</div>
                  <div>40ft: {item.qty40ftContainer ?? "-"}</div>
                  <div>40HC: {item.qty40hcContainer ?? "-"}</div>
                </td>
                <td className="px-6 py-4">
                  {item.isActive ? (
                    <span className="px-2 py-0.5 bg-green-50 text-green-600 border border-green-100 rounded text-[10px] font-bold">Active</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 border border-gray-200 rounded text-[10px] font-bold">Inactive</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {item.isActive ? (
                    <>
                      <HasPermission permission="product:update">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1 rounded-lg text-gray-400 hover:text-[#007aff] hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4 inline" />
                        </button>
                      </HasPermission>
                      <HasPermission permission="product:delete">
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="p-1 rounded-lg text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-colors cursor-pointer"
                          title="Deactivate"
                        >
                          <Ban className="h-4 w-4 inline" />
                        </button>
                      </HasPermission>
                    </>
                  ) : (
                    <>
                      <HasPermission permission="product:update">
                        <button
                          onClick={() => setRestoreTarget(item)}
                          className="p-1 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors cursor-pointer"
                          title="Restore"
                        >
                          <RefreshCcw className="h-4 w-4 inline" />
                        </button>
                      </HasPermission>
                      <HasPermission permission="product:force_delete">
                        <button
                          onClick={() => setPermanentDeleteTarget(item)}
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
              <td colSpan="7" className="px-6 py-12 text-center text-gray-400 font-semibold">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
