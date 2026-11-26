"use client";

import React, { useState, useEffect, useMemo } from "react";
import { X, Wallet, AlertCircle, Building2 } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { useEscapeKey } from "@/hooks/useEscapeKey";

const PRIORITY_CURRENCIES = [
  { code: "USD", label: "USD - US Dollar" },
  { code: "EUR", label: "EUR - Euro" },
  { code: "RUB", label: "RUB - Russian Ruble" },
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

function CurrencyAccountDrawerInner({
  onClose,
  onSubmit,
  initialData = null,
  domesticBanks = [],
  preselectedDomesticBankId = null,
  isSaving = false,
  serverError = "",
  masterCurrencies = [],
}) {
  const currencyOptions = useMemo(() => {
    const seen = new Set();
    const list = [];

    for (const c of PRIORITY_CURRENCIES) {
      seen.add(c.code);
      list.push(c);
    }

    for (const c of masterCurrencies) {
      const code = (c.code || "").toUpperCase().trim();
      if (!code || seen.has(code)) continue;
      seen.add(code);
      list.push({
        code,
        label: c.name ? `${code} - ${c.name}` : code,
      });
    }

    return list;
  }, [masterCurrencies]);

  const initialCurrency = (initialData?.currency || "USD").toUpperCase().trim();
  const isInitialCustom = Boolean(
    initialData &&
      initialCurrency &&
      !PRIORITY_CURRENCIES.some((c) => c.code === initialCurrency) &&
      !masterCurrencies.some(
        (c) => (c.code || "").toUpperCase().trim() === initialCurrency
      )
  );

  const defaultDomesticId = initialData?.domesticBankId
    ? String(initialData.domesticBankId)
    : preselectedDomesticBankId
    ? String(preselectedDomesticBankId)
    : domesticBanks[0]?.id
    ? String(domesticBanks[0].id)
    : "";

  const [form, setForm] = useState({
    domesticBankId: defaultDomesticId,
    currency: initialCurrency,
    accountName: initialData?.accountName || "",
    accountNumber: initialData?.accountNumber || "",
    swiftCode: initialData?.swiftCode || "",
    iban: initialData?.iban || "",
    branchName: initialData?.branchName || "",
    address: initialData?.address || "",
    status: initialData?.status || "Active",
    remarks: initialData?.remarks || "",
  });
  const [customCurrencyMode, setCustomCurrencyMode] = useState(isInitialCustom);
  const [errors, setErrors] = useState({});

  const selectedDomesticBank = domesticBanks.find(
    (db) => String(db.id) === String(form.domesticBankId)
  );

  const validate = () => {
    const errs = {};
    if (!form.domesticBankId) {
      errs.domesticBankId = "Domestic Bank is required";
    }
    if (!form.currency?.trim()) {
      errs.currency = "Currency is required";
    }
    if (!form.accountNumber?.trim()) {
      errs.accountNumber = "Account Number is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      domesticBankId: Number(form.domesticBankId),
      ...(selectedDomesticBank?.companyId
        ? { companyId: Number(selectedDomesticBank.companyId) }
        : {}),
      currency: form.currency.trim().toUpperCase(),
      accountName: form.accountName.trim() ? form.accountName.trim() : null,
      accountNumber: form.accountNumber.trim(),
      swiftCode: form.swiftCode.trim()
        ? form.swiftCode.trim().toUpperCase()
        : null,
      iban: form.iban.trim() ? form.iban.trim().toUpperCase() : null,
      branchName: form.branchName.trim() ? form.branchName.trim() : null,
      address: form.address.trim() ? form.address.trim() : null,
      status: form.status || "Active",
      remarks: form.remarks.trim() ? form.remarks.trim() : null,
    };

    onSubmit(payload);
  };

  const isSelectValueCustom =
    customCurrencyMode ||
    (Boolean(form.currency) &&
      !currencyOptions.some((c) => c.code === form.currency));

  return (
    <div className="fixed inset-0 z-[130] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative z-10 w-full max-w-xl bg-white h-full flex flex-col shadow-2xl border-l border-slate-200 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-indigo-50/60 via-white to-slate-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                {initialData ? "Edit Currency Account" : "Add Currency Account"}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Multi-currency bank account linked directly to a Domestic Bank
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {serverError && (
              <div className="p-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-medium flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Domestic Bank (Required) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Domestic Bank <span className="text-red-500">*</span>
              </label>
              <select
                value={form.domesticBankId}
                onChange={(e) =>
                  setForm({ ...form, domesticBankId: e.target.value })
                }
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden ${
                  errors.domesticBankId
                    ? "border-red-400 bg-red-50/30"
                    : "border-slate-200 bg-white"
                }`}
              >
                <option value="">Select Domestic Bank...</option>
                {domesticBanks.map((db) => (
                  <option key={db.id} value={db.id}>
                    {db.bankName} — A/C: {db.accountNumber} (
                    {db.currency || "INR"})
                  </option>
                ))}
              </select>
              {selectedDomesticBank && (
                <p className="mt-1.5 text-[11px] text-slate-500 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-indigo-500" />
                  Company:{" "}
                  <span className="font-semibold text-slate-700">
                    {selectedDomesticBank.company?.legalName ||
                      selectedDomesticBank.company?.name ||
                      "—"}
                  </span>
                </p>
              )}
              {errors.domesticBankId && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.domesticBankId}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Currency (Required) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Currency <span className="text-red-500">*</span>
                </label>
                <select
                  value={isSelectValueCustom ? "OTHER" : form.currency}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "OTHER") {
                      setCustomCurrencyMode(true);
                      setForm({ ...form, currency: "" });
                    } else {
                      setCustomCurrencyMode(false);
                      setForm({ ...form, currency: val });
                    }
                  }}
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-bold bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden ${
                    errors.currency
                      ? "border-red-400 bg-red-50/30"
                      : "border-slate-200"
                  }`}
                >
                  {currencyOptions.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                  <option value="OTHER">Other Currency (Custom)...</option>
                </select>
                {isSelectValueCustom && (
                  <input
                    type="text"
                    placeholder="Enter code (e.g. RUB, CNY)"
                    maxLength={10}
                    value={form.currency}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        currency: e.target.value.toUpperCase(),
                      })
                    }
                    className="mt-2 w-full rounded-xl border border-indigo-300 px-3.5 py-2 text-sm font-bold uppercase focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-indigo-50/20"
                    autoFocus
                  />
                )}
                {errors.currency && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.currency}
                  </p>
                )}
              </div>

              {/* Account Number (Required) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Account Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 8871210000025901"
                  value={form.accountNumber}
                  onChange={(e) =>
                    setForm({ ...form, accountNumber: e.target.value })
                  }
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-mono font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden ${
                    errors.accountNumber
                      ? "border-red-400 bg-red-50/30"
                      : "border-slate-200 bg-white"
                  }`}
                />
                {errors.accountNumber && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.accountNumber}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Account Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Account Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. USD Operating Account"
                  value={form.accountName}
                  onChange={(e) =>
                    setForm({ ...form, accountName: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              {/* SWIFT Code */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  SWIFT Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. DBSSINBBXXX"
                  maxLength={11}
                  value={form.swiftCode}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      swiftCode: e.target.value.toUpperCase().slice(0, 11),
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-mono font-bold uppercase focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* IBAN (Optional) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  IBAN{" "}
                  <span className="text-[10px] font-normal text-slate-400 normal-case">
                    (Optional)
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. DE89370400440532013000"
                  value={form.iban}
                  onChange={(e) =>
                    setForm({ ...form, iban: e.target.value.toUpperCase() })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-mono uppercase focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              {/* Branch Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Branch Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai Fort Branch"
                  value={form.branchName}
                  onChange={(e) =>
                    setForm({ ...form, branchName: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Address
              </label>
              <textarea
                rows={2}
                placeholder="Branch address..."
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Status
              </label>
              <div className="flex gap-4">
                {["Active", "Inactive"].map((st) => (
                  <label
                    key={st}
                    className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="currencyAccountStatus"
                      value={st}
                      checked={form.status === st}
                      onChange={() => setForm({ ...form, status: st })}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    {st}
                  </label>
                ))}
              </div>
            </div>

            {/* Remarks (Optional) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Remarks{" "}
                <span className="text-[10px] font-normal text-slate-400 normal-case">
                  (Optional)
                </span>
              </label>
              <textarea
                rows={2}
                placeholder="Optional notes about this currency account..."
                value={form.remarks}
                onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4 bg-slate-50/70 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSaving
                ? "Saving..."
                : initialData
                ? "Update Currency Account"
                : "Create Currency Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CurrencyAccountDrawer({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  domesticBanks = [],
  preselectedDomesticBankId = null,
  isSaving = false,
  serverError = "",
}) {
  useEscapeKey(onClose, isOpen);

  const [masterCurrencies, setMasterCurrencies] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    axiosInstance
      .get("/masters/currencies", {
        params: { limit: 250 },
        suppressToast: true,
        skipToast: true,
        suppressErrorLog: true,
      })
      .then((res) => {
        if (!mounted) return;
        const rows = res.data?.data || res.data?.rows || [];
        if (Array.isArray(rows) && rows.length > 0) {
          setMasterCurrencies(rows);
        }
      })
      .catch(() => {
        // Fallback silently to PRIORITY_CURRENCIES
      });
    return () => {
      mounted = false;
    };
  }, [isOpen]);

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

  if (!isOpen) return null;

  const formKey = `${initialData?.id || "new"}-${preselectedDomesticBankId || "none"}`;

  return (
    <CurrencyAccountDrawerInner
      key={formKey}
      onClose={onClose}
      onSubmit={onSubmit}
      initialData={initialData}
      domesticBanks={domesticBanks}
      preselectedDomesticBankId={preselectedDomesticBankId}
      isSaving={isSaving}
      serverError={serverError}
      masterCurrencies={masterCurrencies}
    />
  );
}
