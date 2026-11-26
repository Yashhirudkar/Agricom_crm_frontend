"use client";

import React, { useEffect } from "react";
import { X, Wallet } from "lucide-react";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import CurrencyAccountDetailPanel from "./CurrencyAccountDetailPanel";

export default function CurrencyAccountDetailDrawer({
  isOpen,
  onClose,
  account,
  autoOpenLinkedNostro = false,
  canUpdate = false,
  canDelete = false,
  onEdit,
  onDelete,
}) {
  useEscapeKey(onClose, isOpen);

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

  if (!isOpen || !account) return null;

  return (
    <div className="fixed inset-0 z-[115] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative z-10 w-full max-w-3xl bg-white h-full flex flex-col shadow-2xl border-l border-slate-200 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 via-white to-slate-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Currency Account Detail
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                View account metadata and read-only dynamically linked Nostro accounts
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 bg-slate-50/50">
          <CurrencyAccountDetailPanel
            account={account}
            autoOpenLinkedNostro={autoOpenLinkedNostro}
            canUpdate={canUpdate}
            canDelete={canDelete}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-3.5 bg-white flex-shrink-0">
          <span className="text-[11px] text-slate-500">
            Linked Nostro resolution: Domestic Bank + Currency (no direct Nostro FK)
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
