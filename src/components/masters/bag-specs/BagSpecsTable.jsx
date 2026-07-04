"use client";

import React from "react";
import { Edit2, Trash2, Package2 } from "lucide-react";

function formatSpec(spec) {
  const parts = [
    spec.bagType?.name,
    spec.packingType?.name,
    spec.width && spec.length ? `${spec.width} x ${spec.length}` : null,
    spec.emptyBagWeight ? `${spec.emptyBagWeight} GM` : null,
  ].filter(Boolean);
  return parts.join(" | ");
}

export default function BagSpecsTable({ specs, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/30 text-gray-400 uppercase tracking-widest text-[10px] font-bold">
            <th className="px-6 py-4">Bag Type</th>
            <th className="px-6 py-4">Packing Type</th>
            <th className="px-6 py-4">Dimensions (W×L)</th>
            <th className="px-6 py-4">Empty Weight</th>
            <th className="px-6 py-4">Cost / Bag</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-xs">
          {specs.length > 0 ? (
            specs.map((spec) => (
              <tr
                key={spec.id}
                className="hover:bg-gray-50/75 transition-colors group/row"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Package2 className="h-3.5 w-3.5 text-blue-500" />
                    </div>
                    <span className="font-bold text-gray-800 group-hover/row:text-[#007aff] transition-colors">
                      {spec.bagType?.name || "—"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 font-semibold">
                  {spec.packingType?.name || (
                    <span className="text-gray-300 italic">Bulk / N/A</span>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-600 font-mono">
                  {spec.width && spec.length
                    ? `${spec.width} × ${spec.length}`
                    : <span className="text-gray-300">—</span>}
                </td>
                <td className="px-6 py-4 text-gray-600 font-mono">
                  {spec.emptyBagWeight != null
                    ? `${spec.emptyBagWeight} GM`
                    : <span className="text-gray-300">—</span>}
                </td>
                <td className="px-6 py-4 font-mono font-semibold text-gray-800">
                  {spec.cost != null
                    ? <span className="text-emerald-600">₹ {Number(spec.cost).toFixed(2)}</span>
                    : <span className="text-gray-300">—</span>}
                </td>
                <td className="px-6 py-4">
                  {spec.isActive ? (
                    <span className="px-2 py-0.5 bg-green-50 text-green-600 border border-green-100 rounded text-[10px] font-bold">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 border border-gray-200 rounded text-[10px] font-bold">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-1">
                  <button
                    id={`edit-spec-${spec.id}`}
                    onClick={() => onEdit(spec)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-[#007aff] hover:bg-blue-50 transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    id={`delete-spec-${spec.id}`}
                    onClick={() => onDelete(spec)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Deactivate"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="px-6 py-16 text-center">
                <Package2 className="h-8 w-8 text-gray-200 mx-auto mb-2" />
                <p className="text-gray-400 font-semibold text-xs">No bag specifications found.</p>
                <p className="text-gray-300 text-[11px] mt-1">Create your first specification using the form above.</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
