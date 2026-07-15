import React from "react";
import { currencies } from "@/constants/currenciesData";
import { Eye, Pencil, Trash2, Rocket } from "lucide-react";
import ContractStatusBadge from "./ContractStatusBadge";
import ScheduleBadge from "./ScheduleBadge";

export default function ContractsTable({ contracts, loading, onView, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-[#007aff] border-t-transparent animate-spin" />
        <p className="text-xs text-gray-400 font-semibold">Loading contracts...</p>
      </div>
    );
  }

  if (!contracts.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
          <svg className="h-7 w-7 text-[#007aff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-sm font-bold text-gray-700">No Contracts Found</p>
        <p className="text-xs text-gray-400 mt-1">Create your first sales contract to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/60">
            {["Contract No.", "Date", "Schedule", "Buyer", "Currency", "Total Qty (MT)", "Total Amount", "Documents", "Status", "Actions"].map(h => (
              <th key={h} className="px-4 py-3 text-left font-semibold text-gray-500 tracking-wide whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {contracts.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50/70 transition-colors group">
              <td className="px-4 py-3 font-mono font-bold text-[#007aff] whitespace-nowrap">
                {c.contractNumber}
              </td>
              <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                {c.contractDate ? new Date(c.contractDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <ScheduleBadge date={c.contractDate} />
              </td>
              <td className="px-4 py-3 text-gray-800 font-medium whitespace-nowrap">
                {c.buyer?.name || c.buyer?.entityName || "—"}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {c.currencyCode || "—"}
              </td>
              <td className="px-4 py-3 text-gray-800 font-semibold tabular-nums">
                {Number(c.totalQuantity || 0).toLocaleString("en-IN")}
              </td>
              <td className="px-4 py-3 text-gray-800 font-semibold tabular-nums">
                {currencies[c.currencyCode]?.symbol || ""} {Number(c.totalAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </td>
              <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                {c.documents?.length > 0 ? (
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${(c.documentFiles?.length || 0) === c.documents?.length
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                    {c.documentFiles?.length || 0} / {c.documents?.length}
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-400 font-normal italic">None</span>
                )}
              </td>
              <td className="px-4 py-3">
                <ContractStatusBadge status={c.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onView(c)}
                    className="p-1.5 text-gray-400 hover:text-[#007aff] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="View"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onEdit(c)}
                    className="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                    title="Execute Contract"
                  >
                    <Rocket className="h-3.5 w-3.5" />
                  </button>
                  {(c.status === "Draft" || c.status === "Cancelled") && (
                    <button
                      onClick={() => onDelete(c)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Cancel"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
