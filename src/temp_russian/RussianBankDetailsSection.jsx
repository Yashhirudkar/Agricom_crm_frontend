"use client";
import React from "react";
import { Landmark } from "lucide-react";

const BANK_FIELDS = [
  // Seller side
  { key: "sellerBank", label: "Seller Bank Name", placeholder: "e.g. Sberbank PJSC", side: "seller" },
  { key: "sellerAccount", label: "Seller Account No.", placeholder: "e.g. 40702840038XXXXXXXXX", side: "seller" },
  { key: "sellerSwift", label: "Seller SWIFT / BIC", placeholder: "e.g. SABRRUMM", side: "seller" },
  { key: "sellerIban", label: "Seller IBAN (if applicable)", placeholder: "e.g. RU…", side: "seller", optional: true },
  { key: "sellerIntermediaryBank", label: "Intermediary / Correspondent Bank", placeholder: "e.g. Deutsche Bank AG", side: "seller", optional: true },
  { key: "sellerNostroAccount", label: "Nostro Account (Seller)", placeholder: "e.g. 0473XXXXXX", side: "seller", optional: true },

  // Buyer side
  { key: "buyerBank", label: "Buyer Bank Name", placeholder: "e.g. Alfa-Bank JSC", side: "buyer" },
  { key: "buyerAccount", label: "Buyer Account No.", placeholder: "e.g. 40702XXXXXXXXX", side: "buyer" },
  { key: "buyerSwift", label: "Buyer SWIFT / BIC", placeholder: "e.g. ALFARU2P", side: "buyer" },
  { key: "buyerIban", label: "Buyer IBAN (if applicable)", placeholder: "e.g. RU…", side: "buyer", optional: true },
  { key: "buyerIntermediaryBank", label: "Buyer Intermediary Bank", placeholder: "e.g. Citibank N.A.", side: "buyer", optional: true },
];

/**
 * RussianBankDetailsSection
 * Shown on the contract form only when contractFormat === 'RUSSIAN'.
 * Stores all fields in form.russianBankDetails JSONB field.
 *
 * Props:
 *  - form, setForm: parent form state
 *  - isView: boolean — disables inputs in view mode
 */
export default function RussianBankDetailsSection({ form, setForm, isView }) {
  const bank = form.russianBankDetails || {};

  const handleChange = (key, value) => {
    setForm((f) => ({
      ...f,
      russianBankDetails: {
        ...(f.russianBankDetails || {}),
        [key]: value,
      },
    }));
  };

  const inp =
    "w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] bg-white transition-all";
  const lbl = "block text-[11px] font-semibold text-gray-600 mb-1.5";

  const sellerFields = BANK_FIELDS.filter((f) => f.side === "seller");
  const buyerFields = BANK_FIELDS.filter((f) => f.side === "buyer");

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2.5">
        <div className="h-7 w-7 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
          <Landmark className="h-3.5 w-3.5 text-red-500" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900">
            Banking Details{" "}
            <span className="text-[10px] font-normal text-red-500 ml-1">
              (Russian Export Template)
            </span>
          </h2>
          <p className="text-[10px] text-gray-400">
            Seller & Buyer banking details for Section 12 of the Russian contract
          </p>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── SELLER BANK ──────────────────────────────────────── */}
        <div className="space-y-4">
          <h3 className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
            Seller Bank Details
          </h3>
          {sellerFields.map((field) => (
            <div key={field.key}>
              <label className={lbl}>
                {field.label}
                {!field.optional && <span className="text-red-500 ml-0.5">*</span>}
                {field.optional && (
                  <span className="text-gray-400 font-normal ml-1">(optional)</span>
                )}
              </label>
              <input
                type="text"
                value={bank[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                disabled={isView}
                placeholder={field.placeholder}
                className={inp}
              />
            </div>
          ))}
        </div>

        {/* ── BUYER BANK ───────────────────────────────────────── */}
        <div className="space-y-4">
          <h3 className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
            Buyer Bank Details
          </h3>
          {buyerFields.map((field) => (
            <div key={field.key}>
              <label className={lbl}>
                {field.label}
                {!field.optional && <span className="text-red-500 ml-0.5">*</span>}
                {field.optional && (
                  <span className="text-gray-400 font-normal ml-1">(optional)</span>
                )}
              </label>
              <input
                type="text"
                value={bank[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                disabled={isView}
                placeholder={field.placeholder}
                className={inp}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
