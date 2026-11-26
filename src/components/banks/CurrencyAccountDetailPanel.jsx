"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Wallet,
  Building2,
  Globe2,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  RefreshCw,
  ShieldCheck,
  Eye,
  Lock,
  AlertCircle,
} from "lucide-react";
import banksApi from "@/api/banksApi";

function CurrencyAccountDetailPanelInner({
  account,
  autoOpenLinkedNostro = false,
  canUpdate = false,
  canDelete = false,
  onEdit,
  onDelete,
}) {
  const [showLinkedNostro, setShowLinkedNostro] = useState(
    Boolean(autoOpenLinkedNostro)
  );
  const [linkedNostros, setLinkedNostros] = useState([]);
  const [loadingNostros, setLoadingNostros] = useState(
    Boolean(autoOpenLinkedNostro)
  );
  const [nostroError, setNostroError] = useState("");
  const [hasLoadedNostros, setHasLoadedNostros] = useState(false);

  const accountId = account?.id;

  const fetchLinkedNostros = useCallback(() => {
    if (!accountId) return Promise.resolve();
    return banksApi
      .getCurrencyAccountLinkedNostros(accountId)
      .then((res) => {
        const rows = res.data?.rows || [];
        setLinkedNostros(rows);
        setHasLoadedNostros(true);
        setNostroError("");
      })
      .catch((err) => {
        console.error("Failed to fetch linked nostros:", err);
        setNostroError(
          err.response?.data?.message || "Failed to load linked Nostro accounts"
        );
        setLinkedNostros([]);
      })
      .finally(() => {
        setLoadingNostros(false);
      });
  }, [accountId]);

  useEffect(() => {
    if (!autoOpenLinkedNostro || !accountId) return;
    let cancelled = false;
    banksApi
      .getCurrencyAccountLinkedNostros(accountId)
      .then((res) => {
        if (cancelled) return;
        setLinkedNostros(res.data?.rows || []);
        setHasLoadedNostros(true);
        setNostroError("");
      })
      .catch((err) => {
        if (cancelled) return;
        setNostroError(
          err.response?.data?.message || "Failed to load linked Nostro accounts"
        );
        setLinkedNostros([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingNostros(false);
      });
    return () => {
      cancelled = true;
    };
  }, [autoOpenLinkedNostro, accountId]);

  if (!account) return null;

  const domesticBank = account.domesticBank || {};
  const companyName =
    account.company?.legalName ||
    account.company?.name ||
    domesticBank.company?.legalName ||
    domesticBank.company?.name ||
    "—";

  const handleViewLinkedNostroClick = () => {
    setShowLinkedNostro(true);
    setLoadingNostros(true);
    setNostroError("");
    fetchLinkedNostros();
  };

  const handleRefreshNostros = () => {
    setLoadingNostros(true);
    setNostroError("");
    fetchLinkedNostros();
  };

  return (
    <div className="space-y-5">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-black bg-indigo-50 text-indigo-800 border border-indigo-200">
                {account.currency}
              </span>
              <h3 className="text-base font-bold text-slate-900">
                {account.accountName || `${account.currency} Currency Account`}
              </h3>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  account.status === "Active"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {account.status === "Active" ? (
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                ) : (
                  <XCircle className="h-3 w-3 text-slate-400" />
                )}
                {account.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
              {companyName} • Account #{account.accountNumber}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleViewLinkedNostroClick}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              showLinkedNostro
                ? "bg-emerald-600 text-white shadow-xs"
                : "border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            View Linked Nostro
            {hasLoadedNostros ? ` (${linkedNostros.length})` : ""}
          </button>

          {canUpdate && onEdit && (
            <button
              type="button"
              onClick={() => onEdit(account)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <Edit2 className="h-3.5 w-3.5 text-slate-500" />
              Edit
            </button>
          )}

          {canDelete && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(account)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Parent Domestic Bank Card */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-blue-600" />
            Parent Domestic Bank
          </h4>
          <span className="text-[11px] font-semibold text-slate-500">
            1 Domestic Bank → Many Currency Accounts
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Bank Name
            </span>
            <span className="font-bold text-slate-900 mt-0.5 block">
              {domesticBank.bankName || "—"}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Domestic A/C No.
            </span>
            <span className="font-mono font-bold text-slate-800 mt-0.5 block">
              {domesticBank.accountNumber || "—"}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Domestic SWIFT
            </span>
            <span className="font-mono font-bold text-blue-700 mt-0.5 block">
              {domesticBank.swiftCode || "—"}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Base Currency
            </span>
            <span className="font-bold text-slate-800 mt-0.5 block">
              {domesticBank.currency || "INR"}
            </span>
          </div>
        </div>
      </div>

      {/* Currency Account Fields Grid */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 border-b border-slate-100 pb-2.5">
          Currency Account Details
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Currency
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-black bg-indigo-50 text-indigo-800 border border-indigo-200 mt-1">
              {account.currency}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Account Name
            </span>
            <span className="font-semibold text-slate-900 mt-1 block">
              {account.accountName || "—"}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Account Number
            </span>
            <span className="font-mono font-bold text-slate-900 mt-1 block">
              {account.accountNumber}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              SWIFT Code
            </span>
            <span className="font-mono font-bold text-blue-700 mt-1 block">
              {account.swiftCode || "—"}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              IBAN
            </span>
            <span className="font-mono font-semibold text-slate-800 mt-1 block break-all">
              {account.iban || "—"}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Branch Name
            </span>
            <span className="font-semibold text-slate-800 mt-1 block">
              {account.branchName || "—"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Address
            </span>
            <p className="text-slate-700 whitespace-pre-line leading-relaxed">
              {account.address || "—"}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Remarks
            </span>
            <p className="text-slate-700 whitespace-pre-line leading-relaxed">
              {account.remarks || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Read-Only Linked Nostro(s) Section */}
      {showLinkedNostro && (
        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-100 pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-emerald-600" />
                Linked Nostro(s)
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  <Lock className="h-2.5 w-2.5" />
                  Read-Only
                </span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Automatically filtered by Domestic Bank (
                <span className="font-semibold text-slate-700">
                  {domesticBank.bankName || `#${account.domesticBankId}`}
                </span>
                ) + Currency (
                <span className="font-bold text-emerald-700">
                  {account.currency}
                </span>
                )
              </p>
            </div>

            <button
              type="button"
              onClick={handleRefreshNostros}
              disabled={loadingNostros}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${
                  loadingNostros ? "animate-spin text-emerald-600" : ""
                }`}
              />
              Refresh
            </button>
          </div>

          {nostroError && (
            <div className="p-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{nostroError}</span>
            </div>
          )}

          {loadingNostros ? (
            <div className="py-8 text-center text-xs text-slate-500">
              Loading matching {account.currency} Nostro accounts...
            </div>
          ) : linkedNostros.length === 0 ? (
            <div className="text-center py-8 px-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
              <Globe2 className="h-7 w-7 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">
                No {account.currency} Nostro Accounts Linked
              </p>
              <p className="text-[11px] text-slate-500 max-w-md mx-auto mt-1">
                No Nostro accounts exist under{" "}
                {domesticBank.bankName || "this Domestic Bank"} for currency{" "}
                <span className="font-bold">{account.currency}</span>.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-emerald-50/60 text-[10px] font-bold uppercase tracking-wider text-slate-600 border-b border-emerald-100">
                  <tr>
                    <th className="px-4 py-2.5">Currency</th>
                    <th className="px-4 py-2.5">Nostro Bank Name</th>
                    <th className="px-4 py-2.5">Account Name</th>
                    <th className="px-4 py-2.5">Account Number</th>
                    <th className="px-4 py-2.5">SWIFT Code</th>
                    <th className="px-4 py-2.5">Address</th>
                    <th className="px-4 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white font-medium">
                  {linkedNostros.map((nostro) => (
                    <tr key={nostro.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {nostro.currency}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-900">
                        {nostro.bankName}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {nostro.accountName || "—"}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-800">
                        {nostro.accountNumber}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-blue-700">
                        {nostro.swiftCode}
                      </td>
                      <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                        {nostro.bankAddress || "—"}
                      </td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CurrencyAccountDetailPanel(props) {
  const { account, autoOpenLinkedNostro } = props;
  if (!account) return null;
  const key = `${account.id}-${account.currency}-${account.domesticBankId}-${autoOpenLinkedNostro ? "nostro" : "overview"}`;
  return <CurrencyAccountDetailPanelInner key={key} {...props} />;
}
