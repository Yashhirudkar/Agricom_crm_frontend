"use client";

import React from "react";
import {
  Wallet,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Plus,
  Globe2,
} from "lucide-react";

export default function CurrencyAccountsTable({
  accounts = [],
  loading = false,
  showDomesticBankColumn = true,
  canCreate = false,
  canUpdate = false,
  canDelete = false,
  onAdd,
  onView,
  onViewLinkedNostro,
  onEdit,
  onDelete,
}) {
  const colCount = showDomesticBankColumn ? 7 : 6;

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white py-12 text-center text-xs text-slate-500">
        Loading Currency Accounts...
      </div>
    );
  }

  if (!accounts || accounts.length === 0) {
    return (
      <div className="text-center py-8 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-white">
        <Wallet className="h-8 w-8 text-slate-300 mx-auto mb-2" />
        <p className="text-xs font-bold text-slate-700">
          No Currency Accounts Found
        </p>
        <p className="text-[11px] text-slate-500 max-w-sm mx-auto mt-0.5">
          Create currency-specific accounts (USD, EUR, RUB, INR, etc.) directly under a Domestic Bank.
        </p>
        {canCreate && onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="mt-3 px-3.5 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Add Currency Account
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3">Currency</th>
            <th className="px-4 py-3">Account Name &amp; Number</th>
            <th className="px-4 py-3">SWIFT / IBAN</th>
            <th className="px-4 py-3">Branch</th>
            {showDomesticBankColumn && (
              <th className="px-4 py-3">Domestic Bank</th>
            )}
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium">
          {accounts.map((acc) => (
            <tr
              key={acc.id}
              className="hover:bg-indigo-50/20 transition-colors"
            >
              {/* Currency */}
              <td className="px-4 py-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-black bg-indigo-50 text-indigo-800 border border-indigo-200/80">
                  {acc.currency}
                </span>
              </td>

              {/* Account Name & Number */}
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => onView?.(acc)}
                  className="font-bold text-indigo-700 hover:text-indigo-900 hover:underline text-left block cursor-pointer"
                >
                  {acc.accountName || `${acc.currency} Account`}
                </button>
                <span className="font-mono font-bold text-slate-800 block mt-0.5">
                  {acc.accountNumber}
                </span>
              </td>

              {/* SWIFT / IBAN */}
              <td className="px-4 py-3">
                <span className="font-mono font-bold text-blue-700 block">
                  {acc.swiftCode || "—"}
                </span>
                {acc.iban && (
                  <span className="font-mono text-[10px] text-slate-500 block mt-0.5">
                    IBAN: {acc.iban}
                  </span>
                )}
              </td>

              {/* Branch */}
              <td className="px-4 py-3">
                <span className="text-slate-800 block">
                  {acc.branchName || "—"}
                </span>
                {acc.address && (
                  <span className="text-[10px] text-slate-400 line-clamp-1 block max-w-[200px]">
                    {acc.address}
                  </span>
                )}
              </td>

              {/* Parent Domestic Bank */}
              {showDomesticBankColumn && (
                <td className="px-4 py-3">
                  <span className="font-bold text-slate-900 block">
                    {acc.domesticBank?.bankName || "—"}
                  </span>
                  {acc.domesticBank?.accountNumber && (
                    <span className="text-[10px] text-slate-500 font-mono block">
                      A/C: {acc.domesticBank.accountNumber} (
                      {acc.domesticBank.currency || "INR"})
                    </span>
                  )}
                </td>
              )}

              {/* Status */}
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    acc.status === "Active"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                  }`}
                >
                  {acc.status === "Active" ? (
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <XCircle className="h-3 w-3 text-slate-400" />
                  )}
                  {acc.status}
                </span>
              </td>

              {/* Actions */}
              <td className="px-4 py-3 text-right space-x-1 whitespace-nowrap">
                {onViewLinkedNostro && (
                  <button
                    type="button"
                    onClick={() => onViewLinkedNostro(acc)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-semibold transition-colors cursor-pointer mr-1"
                    title={`View Linked ${acc.currency} Nostro(s)`}
                  >
                    <Globe2 className="h-3 w-3" />
                    Linked Nostro
                  </button>
                )}

                {onView && (
                  <button
                    type="button"
                    onClick={() => onView(acc)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
                    title="View Currency Account Detail"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                )}

                {canUpdate && onEdit && (
                  <button
                    type="button"
                    onClick={() => onEdit(acc)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                    title="Edit Currency Account"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                )}

                {canDelete && onDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(acc)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                    title="Delete Currency Account"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}

                {!onView &&
                  !onViewLinkedNostro &&
                  !canUpdate &&
                  !canDelete && (
                    <span className="text-slate-400 text-xs">—</span>
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {colCount < 0 && null}
    </div>
  );
}
