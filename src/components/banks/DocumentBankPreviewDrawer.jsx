"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  FileText,
  Copy,
  Check,
} from "lucide-react";
import { formatBankDetails } from "@/utils/bankFormatter";

export default function DocumentBankPreviewDrawer({
  isOpen,
  onClose,
  domesticBank,
  linkedNostroAccounts = [],
}) {
  const [selectedCurrency, setSelectedCurrency] = useState("EUR");
  const [copied, setCopied] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll when drawer is open
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

  const beneficiaryName =
    domesticBank.company?.legalName || domesticBank.company?.name || "AGRICOM IMPEX";

  // Find linked nostro for chosen currency if foreign
  const matchingNostro = linkedNostroAccounts.find(
    (n) => n.currency?.toUpperCase() === selectedCurrency.toUpperCase()
  );

  const activeNostro =
    matchingNostro || (selectedCurrency !== "INR" ? linkedNostroAccounts[0] : null);

  const previewRawText = formatBankDetails({
    currency: selectedCurrency,
    beneficiaryName,
    domesticBank: {
      bankName: domesticBank.bankName,
      accountNumber: domesticBank.accountNumber,
      swiftCode: domesticBank.swiftCode,
      bankAddress: domesticBank.bankAddress,
    },
    nostroBank: activeNostro
      ? {
          bankName: activeNostro.bankName,
          accountName: activeNostro.accountName,
          accountNumber: activeNostro.accountNumber,
          swiftCode: activeNostro.swiftCode,
          bankAddress:
            activeNostro.bankAddress ||
            activeNostro.address ||
            activeNostro.nostroBankAddress ||
            (activeNostro.bankName?.toLowerCase().includes("frankfurt")
              ? "Frankfurt, Germany"
              : activeNostro.bankName?.toLowerCase().includes("chase")
              ? "New York, USA"
              : ""),
        }
      : null,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(previewRawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const availableCurrencies = [
    "INR",
    ...new Set(linkedNostroAccounts.map((n) => n.currency)),
  ];
  if (!availableCurrencies.includes("EUR")) availableCurrencies.push("EUR");
  if (!availableCurrencies.includes("USD")) availableCurrencies.push("USD");

  return (
    <div className="fixed inset-0 z-[110] flex justify-end">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative z-10 w-full max-w-2xl bg-white h-full flex flex-col shadow-2xl border-l border-slate-200 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-blue-50/30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Bank Details Document Preview
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Exact layout printed on Invoices, Contracts & Payment Instructions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Currency Switcher Toolbar */}
        <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          {/* Currency Pills */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
              CURRENCY:
            </span>
            {availableCurrencies.map((c) => {
              const active = selectedCurrency === c;
              return (
                <button
                  key={c}
                  onClick={() => setSelectedCurrency(c)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    active
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {c} {c === "INR" ? "(Domestic)" : "(Nostro)"}
                </button>
              );
            })}
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs cursor-pointer"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy Text"}
          </button>
        </div>

        {/* Drawer Scrollable Content: Document Text on Clean Paper Sheet */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100/70">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 md:p-8">
            <pre className="whitespace-pre-wrap font-mono text-[13px] leading-tight tracking-tight text-slate-900 selection:bg-blue-100">
              {previewRawText}
            </pre>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-600 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Check className="h-3.5 w-3.5 text-emerald-600" />
            <span>
              {selectedCurrency === "INR"
                ? "Domestic settlement: Prints Beneficiary Bank details"
                : `Export document (${selectedCurrency}): Prints Nostro Bank first, then Beneficiary Bank`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              {copied ? "Copied!" : "Copy Output"}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
