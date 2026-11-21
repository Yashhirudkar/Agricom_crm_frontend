"use client";

import React, { useState, useEffect } from "react";
import { X, Building2, AlertCircle } from "lucide-react";

const DOMESTIC_CURRENCIES = [
  { code: "INR", label: "INR - Indian Rupee (Domestic Default)" },
  { code: "USD", label: "USD - US Dollar" },
  { code: "EUR", label: "EUR - Euro" },
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

export default function DomesticBankModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  companies = [],
  isSaving = false,
}) {
  const [form, setForm] = useState({
    companyId: "",
    bankName: "",
    currency: "INR",
    accountNumber: "",
    swiftCode: "",
    bankAddress: "",
    status: "Active",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        companyId: initialData.companyId || (companies[0]?.id ? String(companies[0].id) : ""),
        bankName: initialData.bankName || "",
        currency: initialData.currency || "INR",
        accountNumber: initialData.accountNumber || "",
        swiftCode: initialData.swiftCode || "",
        bankAddress: initialData.bankAddress || "",
        status: initialData.status || "Active",
      });
    } else {
      setForm({
        companyId: companies[0]?.id ? String(companies[0].id) : "",
        bankName: "",
        currency: "INR",
        accountNumber: "",
        swiftCode: "",
        bankAddress: "",
        status: "Active",
      });
    }
    setErrors({});
  }, [initialData, companies, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!form.companyId) errs.companyId = "Enterprise Company is required";
    if (!form.bankName?.trim()) errs.bankName = "Bank Name is required";
    if (!form.currency?.trim()) errs.currency = "Currency is required";
    if (!form.accountNumber?.trim()) errs.accountNumber = "Account Number is required";
    if (!form.swiftCode?.trim()) errs.swiftCode = "SWIFT Code is required";
    if (!form.bankAddress?.trim()) errs.bankAddress = "Bank Address is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...form,
      companyId: Number(form.companyId),
      bankName: form.bankName.trim(),
      currency: form.currency.trim().toUpperCase(),
      accountNumber: form.accountNumber.trim(),
      swiftCode: form.swiftCode.trim().toUpperCase(),
      bankAddress: form.bankAddress.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50/30">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {initialData ? "Edit Domestic Bank" : "Add Domestic Bank"}
              </h2>
              <p className="text-xs text-gray-500">
                Primary domestic bank for receiving international Nostro transfers and domestic INR settlements
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
              onChange={(e) => setForm({ ...form, companyId: e.target.value })}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Bank Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Bank Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. DBS BANK INDIA LIMITED"
                value={form.bankName}
                onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${
                  errors.bankName ? "border-red-400 bg-red-50/30" : "border-gray-200 bg-white"
                }`}
              />
              {errors.bankName && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.bankName}
                </p>
              )}
            </div>

            {/* Currency Dropdown with INR, USD, EUR on top */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Currency (Normally INR) <span className="text-red-500">*</span>
              </label>
              <select
                value={DOMESTIC_CURRENCIES.some((c) => c.code === form.currency) ? form.currency : "OTHER"}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "OTHER") {
                    setForm({ ...form, currency: "" });
                  } else {
                    setForm({ ...form, currency: val });
                  }
                }}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-bold bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${
                  errors.currency ? "border-red-400 bg-red-50/30" : "border-gray-200"
                }`}
              >
                {DOMESTIC_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
                <option value="OTHER">Other Currency (Custom)...</option>
              </select>
              {!DOMESTIC_CURRENCIES.some((c) => c.code === form.currency) && (
                <input
                  type="text"
                  placeholder="Enter currency code (e.g. QAR, KWD)"
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })}
                  className="mt-2 w-full rounded-xl border border-blue-300 px-3.5 py-2 text-sm font-bold uppercase focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-blue-50/20"
                  autoFocus
                />
              )}
              {errors.currency && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.currency}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Account Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Account Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 8871210000025878"
                value={form.accountNumber}
                onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${
                  errors.accountNumber ? "border-red-400 bg-red-50/30" : "border-gray-200 bg-white"
                }`}
              />
              {errors.accountNumber && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.accountNumber}
                </p>
              )}
            </div>

            {/* SWIFT Code */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                SWIFT Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. DBSSINBBXXX"
                value={form.swiftCode}
                onChange={(e) => setForm({ ...form, swiftCode: e.target.value.toUpperCase() })}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-mono font-bold uppercase focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${
                  errors.swiftCode ? "border-red-400 bg-red-50/30" : "border-gray-200 bg-white"
                }`}
              />
              {errors.swiftCode && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.swiftCode}
                </p>
              )}
            </div>
          </div>

          {/* Bank Address */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Bank Address <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Full address of the domestic bank branch..."
              value={form.bankAddress}
              onChange={(e) => setForm({ ...form, bankAddress: e.target.value })}
              className={`w-full rounded-xl border px-3.5 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${
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
                  name="status"
                  value="Active"
                  checked={form.status === "Active"}
                  onChange={() => setForm({ ...form, status: "Active" })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                Active
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="Inactive"
                  checked={form.status === "Inactive"}
                  onChange={() => setForm({ ...form, status: "Inactive" })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
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
              className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/25 transition-all disabled:opacity-50"
            >
              {isSaving ? "Saving..." : initialData ? "Update Bank" : "Create Bank"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
