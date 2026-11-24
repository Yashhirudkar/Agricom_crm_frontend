"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Globe2,
  Plus,
  Edit2,
  Trash2,
  FileText,
  CheckCircle2,
  XCircle,
  Landmark,
  ShieldCheck,
} from "lucide-react";
import DocumentBankPreviewDrawer from "./DocumentBankPreviewDrawer";

export default function DomesticBankDetailDrawer({
  isOpen,
  onClose,
  domesticBank,
  onEditDomestic,
  onAddNostro,
  onEditNostro,
  onDeleteNostro,
  onRefresh,
  canCreate = true,
  canUpdate = true,
  canDelete = true,
}) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isPreviewOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isPreviewOpen, onClose]);

  // Prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !domesticBank) return null;

  const linkedAccounts = domesticBank.nostroAccounts || [];

  return (
    <>
      <div className="fixed inset-0 z-[100] flex justify-end">
        {/* Backdrop overlay */}
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          onClick={onClose}
        />

        {/* Slide-over Drawer Panel */}
        <div className="relative z-10 w-full max-w-3xl bg-white h-full flex flex-col shadow-2xl border-l border-slate-200 animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-50/50 via-white to-slate-50 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                <Landmark className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900 leading-tight">
                    {domesticBank.bankName?.toUpperCase()}
                  </h2>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      domesticBank.status === "Active"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {domesticBank.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                  {domesticBank.company?.legalName || domesticBank.company?.name || "Enterprise Company"} • Domestic Settlement ({domesticBank.currency || "INR"})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPreviewOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer"
                title="Preview document output"
              >
                <FileText className="h-3.5 w-3.5" />
                Preview PDF Layout
              </button>

              {canUpdate && (
                <button
                  onClick={() => onEditDomestic(domesticBank)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5 text-slate-500" />
                  Edit
                </button>
              )}

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-1 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Drawer Body Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/40">
            {/* Bank Key Information Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              <div className="bg-white p-2.5 px-3 rounded-xl border border-slate-200/80 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Account Number
                </span>
                <span className="text-xs font-mono font-bold text-slate-900 mt-0.5 block truncate">
                  {domesticBank.accountNumber}
                </span>
              </div>

              <div className="bg-white p-2.5 px-3 rounded-xl border border-slate-200/80 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  SWIFT / BIC Code
                </span>
                <span className="text-xs font-mono font-bold text-blue-700 mt-0.5 block truncate">
                  {domesticBank.swiftCode}
                </span>
              </div>

              <div className="bg-white p-2.5 px-3 rounded-xl border border-slate-200/80 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Currency
                </span>
                <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                  {domesticBank.currency || "INR"}
                </span>
              </div>

              <div className="bg-white p-2.5 px-3 rounded-xl border border-slate-200/80 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Linked Nostro
                </span>
                <span className="text-xs font-bold text-emerald-700 mt-0.5 block">
                  {linkedAccounts.length} {linkedAccounts.length === 1 ? "Account" : "Accounts"}
                </span>
              </div>
            </div>

            {/* Bank Branch Address */}
            <div className="bg-white p-3 px-3.5 rounded-xl border border-slate-200/80 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Bank Branch Address
              </span>
              <p className="text-xs text-slate-700 whitespace-pre-line leading-snug">
                {domesticBank.bankAddress?.toUpperCase()}
              </p>
            </div>

            {/* ── Linked Nostro Accounts Section ── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Globe2 className="h-4 w-4 text-emerald-600" />
                    Linked Nostro Accounts
                  </h3>
                  <p className="max-w-xl text-[11px] leading-snug text-slate-500">
                    Foreign currency correspondent accounts linked directly to this Domestic Bank.
                    <br />
                    Used automatically for export documents.
                  </p>
                </div>

                {canCreate && (
                  <button
                    onClick={() => onAddNostro(domesticBank.id)}
                    className="inline-flex shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold leading-none text-emerald-700 transition-colors hover:bg-emerald-100 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Nostro
                  </button>
                )}
              </div>

              {linkedAccounts.length === 0 ? (
                <div className="text-center py-8 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-white">
                  <Globe2 className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">No Linked Nostro Accounts</p>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto mt-0.5">
                    Link foreign currency accounts (USD, EUR, GBP, AED, etc.) to this domestic bank so export invoices and contracts automatically print correct routing instructions.
                  </p>
                  {canCreate && (
                    <button
                      onClick={() => onAddNostro(domesticBank.id)}
                      className="mt-3 px-3.5 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" /> Link First Nostro Account
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Currency</th>
                        <th className="px-4 py-3">Nostro Bank Name</th>
                        <th className="px-4 py-3">Account Number</th>
                        <th className="px-4 py-3">SWIFT Code</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {linkedAccounts.map((nostro) => (
                        <tr key={nostro.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* Currency */}
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                              {nostro.currency}
                            </span>
                          </td>

                          {/* Nostro Bank Name & Account Name */}
                          <td className="px-4 py-3">
                            <span className="font-bold text-slate-900 block">{nostro.bankName?.toUpperCase()}</span>
                            {nostro.accountName && (
                              <span className="text-[11px] text-slate-500 block">
                                A/C Name: {nostro.accountName?.toUpperCase()}
                              </span>
                            )}
                          </td>

                          {/* Account Number */}
                          <td className="px-4 py-3 font-mono font-bold text-slate-800">
                            {nostro.accountNumber}
                          </td>

                          {/* SWIFT Code */}
                          <td className="px-4 py-3 font-mono font-bold text-blue-700">
                            {nostro.swiftCode}
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                nostro.status === "Active"
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                  : "bg-slate-100 text-slate-600 border border-slate-200"
                              }`}
                            >
                              {nostro.status === "Active" ? (
                                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                              ) : (
                                <XCircle className="h-3 w-3 text-slate-400" />
                              )}
                              {nostro.status}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3 text-right space-x-1 whitespace-nowrap">
                            {canUpdate && (
                              <button
                                onClick={() => onEditNostro(nostro)}
                                className="p-1.5 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                                title="Edit Nostro Account"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => onDeleteNostro(nostro)}
                                className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                                title="Delete Nostro Account"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                            {!canUpdate && !canDelete && (
                              <span className="text-slate-400 text-xs">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-3.5 bg-white flex-shrink-0">
            <span className="text-[11px] text-slate-500">
              Rule: 1 Domestic Bank → Unlimited linked Nostro Accounts. Export documents auto-map by currency.
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* PDF Document Preview Drawer */}
      <DocumentBankPreviewDrawer
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        domesticBank={domesticBank}
        linkedNostroAccounts={linkedAccounts}
      />
    </>
  );
}
