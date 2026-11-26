"use client";

import React, { useState, useEffect } from "react";
import { X, Globe2, AlertCircle } from "lucide-react";

const NOSTRO_CURRENCIES = [
  { code: "USD", label: "USD - US Dollar" },
  { code: "EUR", label: "EUR - Euro" },
  { code: "INR", label: "INR - Indian Rupee" },
  { code: "GBP", label: "GBP - British Pound" },
  { code: "AED", label: "AED - UAE Dirham" },
  { code: "SGD", label: "SGD - Singapore Dollar" },
  { code: "CAD", label: "CAD - Canadian Dollar" },
  { code: "AUD", label: "AUD - Australian Dollar" },
  { code: "JPY", label: "JPY - Japanese Yen" },
  { code: "CHF", label: "CHF - Swiss Franc" },
  { code: "SAR", label: "SAR - Saudi Riyal" },
  { code: "CNY", label: "CNY - Chinese Yuan" },
];

export default function NostroBankModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  companies = [],
  domesticBanks = [],
  preselectedDomesticBankId = null,
  isSaving = false,
}) {
  const [form, setForm] = useState({
    companyId: "",
    domesticBankId: "",
    currency: "USD",
    bankName: "",
    accountName: "",
    accountNumber: "",
    swiftCode: "",
    bankAddress: "",
    status: "Active",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        companyId: initialData.companyId ? String(initialData.companyId) : (companies[0]?.id ? String(companies[0].id) : ""),
        domesticBankId: initialData.domesticBankId ? String(initialData.domesticBankId) : "",
        currency: initialData.currency || "USD",
        bankName: (initialData.bankName || "").toUpperCase(),
        accountName: (initialData.accountName || "").toUpperCase(),
        accountNumber: initialData.accountNumber || "",
        swiftCode: initialData.swiftCode || "",
        bankAddress: (initialData.bankAddress || "").toUpperCase(),
        status: initialData.status || "Active",
      });
    } else {
      const parentId = preselectedDomesticBankId ? String(preselectedDomesticBankId) : (domesticBanks[0]?.id ? String(domesticBanks[0].id) : "");
      const selectedDom = domesticBanks.find((d) => String(d.id) === parentId);
      const companyId = selectedDom?.companyId ? String(selectedDom.companyId) : (companies[0]?.id ? String(companies[0].id) : "");

      setForm({
        companyId,
        domesticBankId: parentId,
        currency: "USD",
        bankName: "",
        accountName: "",
        accountNumber: "",
        swiftCode: "",
        bankAddress: "",
        status: "Active",
      });
    }
    setErrors({});
  }, [initialData, preselectedDomesticBankId, domesticBanks, companies, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter domestic banks by selected company if company is chosen
  const filteredDomesticBanks = form.companyId
    ? domesticBanks.filter((d) => String(d.companyId) === String(form.companyId))
    : domesticBanks;

  const validate = () => {
    const errs = {};
    if (!form.companyId) errs.companyId = "Enterprise Company is required";
    if (!form.domesticBankId) errs.domesticBankId = "Parent Domestic Bank is required";
    if (!form.currency?.trim()) errs.currency = "Currency is required";
    if (!form.bankName?.trim()) errs.bankName = "Nostro Bank Name is required";
    if (!form.accountName?.trim()) errs.accountName = "Nostro Account Name is required";
    if (!form.accountNumber?.trim()) errs.accountNumber = "Nostro Account Number is required";
    if (!form.swiftCode?.trim()) {
      errs.swiftCode = "Nostro SWIFT Code is required";
    } else if (form.swiftCode.trim().length !== 11) {
      errs.swiftCode = "Nostro SWIFT Code must be exactly 11 characters";
    }
    if (!form.bankAddress?.trim()) errs.bankAddress = "Nostro Bank Address is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...form,
      companyId: Number(form.companyId),
      domesticBankId: Number(form.domesticBankId),
      currency: form.currency.trim().toUpperCase(),
      bankName: form.bankName.trim().toUpperCase(),
      accountName: form.accountName.trim().toUpperCase(),
      accountNumber: form.accountNumber.trim(),
      swiftCode: form.swiftCode.trim().toUpperCase(),
      bankAddress: form.bankAddress.trim().toUpperCase(),
    });
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gradient-to-r from-gray-50 to-emerald-50/30">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-500/20">
              <Globe2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {initialData ? "Edit Nostro Account" : "Add Nostro Account"}
              </h2>
              <p className="text-xs text-gray-500">
                Foreign currency correspondent account linked to a Domestic Bank
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Company Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Enterprise Company <span className="text-red-500">*</span>
            </label>
            <select
              value={form.companyId}
              onChange={(e) => {
                const nextCompId = e.target.value;
                const nextDomBanks = domesticBanks.filter((d) => String(d.companyId) === String(nextCompId));
                setForm({
                  ...form,
                  companyId: nextCompId,
                  domesticBankId: nextDomBanks[0]?.id ? String(nextDomBanks[0].id) : "",
                });
              }}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden ${
                errors.companyId ? "border-red-400 bg-red-50/30" : "border-gray-200 bg-white"
              }`}
            >
              <option value="">Select Enterprise Company...</option>
              {companies.map((co) => (
                <option key={co.id} value={co.id}>
                  {co.name || co.legalName} {co.legalName && co.name && co.legalName !== co.name ? `(${co.legalName})` : ""}
                </option>
              ))}
            </select>
            {errors.companyId && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.companyId}
              </p>
            )}
          </div>

          {/* Parent Domestic Bank (Required Dropdown displaying ONLY Domestic banks) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Parent Domestic Bank <span className="text-red-500">*</span>
            </label>
            <select
              value={form.domesticBankId}
              onChange={(e) => setForm({ ...form, domesticBankId: e.target.value })}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden ${
                errors.domesticBankId ? "border-red-400 bg-red-50/30" : "border-gray-200 bg-white"
              }`}
            >
              <option value="">Select Parent Domestic Bank Account...</option>
              {filteredDomesticBanks.map((db) => (
                <option key={db.id} value={db.id}>
                  {db.bankName} - A/C: {db.accountNumber} ({db.currency || "INR"})
                </option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-gray-400">
              Rule: Every Nostro account must be strictly linked to exactly one Domestic Bank account.
            </p>
            {errors.domesticBankId && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.domesticBankId}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Currency Dropdown with USD, EUR, INR on top */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Currency <span className="text-red-500">*</span>
              </label>
              <select
                value={NOSTRO_CURRENCIES.some((c) => c.code === form.currency) ? form.currency : "OTHER"}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "OTHER") {
                    setForm({ ...form, currency: "" });
                  } else {
                    setForm({ ...form, currency: val });
                  }
                }}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-bold bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden ${
                  errors.currency ? "border-red-400 bg-red-50/30" : "border-gray-200"
                }`}
              >
                {NOSTRO_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
                <option value="OTHER">Other Currency (Custom)...</option>
              </select>
              {!NOSTRO_CURRENCIES.some((c) => c.code === form.currency) && (
                <input
                  type="text"
                  placeholder="Enter currency code (e.g. QAR, KWD)"
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })}
                  className="mt-2 w-full rounded-xl border border-emerald-300 px-3.5 py-2 text-sm font-bold uppercase focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-emerald-50/20"
                  autoFocus
                />
              )}
              {errors.currency && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.currency}
                </p>
              )}
            </div>

            {/* Nostro Bank Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Nostro Bank Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Barclays Bank, Frankfurt"
                value={form.bankName}
                onChange={(e) => setForm({ ...form, bankName: e.target.value.toUpperCase() })}
                className={`w-full rounded-xl border px-3.5 py-2 text-sm font-medium uppercase focus:ring-2 focus:ring-emerald-500 focus:outline-hidden ${
                  errors.bankName ? "border-red-400 bg-red-50/30" : "border-gray-200 bg-white"
                }`}
              />
              {errors.bankName && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.bankName}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nostro Account Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Nostro Account Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. DBS Bank India Ltd. - Mumbai Branch"
                value={form.accountName}
                onChange={(e) => setForm({ ...form, accountName: e.target.value.toUpperCase() })}
                className={`w-full rounded-xl border px-3.5 py-2 text-sm font-medium uppercase focus:ring-2 focus:ring-emerald-500 focus:outline-hidden ${
                  errors.accountName ? "border-red-400 bg-red-50/30" : "border-gray-200 bg-white"
                }`}
              />
              {errors.accountName && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.accountName}
                </p>
              )}
            </div>

            {/* Nostro Account Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Nostro Account Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. DE17503104000210575900"
                value={form.accountNumber}
                onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                className={`w-full rounded-xl border px-3.5 py-2 text-sm font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden ${
                  errors.accountNumber ? "border-red-400 bg-red-50/30" : "border-gray-200 bg-white"
                }`}
              />
              {errors.accountNumber && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.accountNumber}
                </p>
              )}
            </div>
          </div>

          {/* Nostro SWIFT Code */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Nostro SWIFT Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. BARCDEFF"
              value={form.swiftCode}
              maxLength={11}
              onChange={(e) => setForm({ ...form, swiftCode: e.target.value.toUpperCase().slice(0, 11) })}
              className={`w-full rounded-xl border px-3.5 py-2 text-sm font-mono font-bold uppercase focus:ring-2 focus:ring-emerald-500 focus:outline-hidden ${
                errors.swiftCode ? "border-red-400 bg-red-50/30" : "border-gray-200 bg-white"
              }`}
            />
            {errors.swiftCode && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.swiftCode}
              </p>
            )}
          </div>

          {/* Nostro Bank Address */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Nostro Bank Address <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Frankfurt, Germany"
              value={form.bankAddress}
              onChange={(e) => setForm({ ...form, bankAddress: e.target.value.toUpperCase() })}
              className={`w-full rounded-xl border px-3.5 py-2 text-sm uppercase focus:ring-2 focus:ring-emerald-500 focus:outline-hidden ${
                errors.bankAddress ? "border-red-400 bg-red-50/30" : "border-gray-200 bg-white"
              }`}
            />
            {errors.bankAddress && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.bankAddress}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Status
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="nostroStatus"
                  value="Active"
                  checked={form.status === "Active"}
                  onChange={() => setForm({ ...form, status: "Active" })}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                />
                Active
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="nostroStatus"
                  value="Inactive"
                  checked={form.status === "Inactive"}
                  onChange={() => setForm({ ...form, status: "Inactive" })}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                />
                Inactive
              </label>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-500/25 transition-all disabled:opacity-50"
            >
              {isSaving ? "Saving..." : initialData ? "Update Nostro Account" : "Link Nostro Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
