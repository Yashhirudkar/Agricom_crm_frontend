"use client";
import React from "react";
import { FileText, ChevronDown, Loader2, Wand2, Lock } from "lucide-react";
import { getDynamicFinancialYears } from "../utils/dateUtils";

const CONTRACT_TYPES = ["Export", "Import", "MTT"];

export default function HeaderSection({ form, setForm, errors, masters, isView, contractNumberPreview, isLoadingContractNumber }) {
  const inp = "w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] bg-white transition-all";
  const lbl = "block text-[11px] font-semibold text-gray-600 mb-1.5";
  const err = "text-[10px] text-red-500 mt-1";

  // Generate dynamic financial years (Prev, Current, Next) + existing historical value if present
  const fyOptions = getDynamicFinancialYears(form.financialYear || null);

  // Determine if auto-number mode is active
  const isAutoNumber = contractNumberPreview !== undefined;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2.5">
        <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
          <FileText className="h-3.5 w-3.5 text-[#007aff]" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900">Contract Header</h2>
          <p className="text-[10px] text-gray-400">Basic identification and date information</p>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Financial Year */}
        <div>
          <label className={lbl}>Financial Year <span className="text-red-500">*</span></label>
          <div className="relative">
            <select
              value={form.financialYear || ""}
              onChange={e => setForm(f => ({ ...f, financialYear: e.target.value }))}
              disabled={isView}
              className={`${inp} appearance-none pr-8 ${errors.financialYear ? "border-red-300 focus:border-red-400 focus:ring-red-100" : ""}`}
            >
              <option value="">Select FY</option>
              {fyOptions.map(fy => (
                <option key={fy} value={fy}>{fy}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
          </div>
          {errors.financialYear && <p className={err}>{errors.financialYear}</p>}
        </div>

        {/* Contract Number */}
        <div>
          <label className={lbl}>
            Contract No. <span className="text-red-500">*</span>
            {isAutoNumber && !isView && (
              <span className="ml-1.5 inline-flex items-center gap-0.5 text-[9px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-md px-1.5 py-0.5">
                <Wand2 className="h-2.5 w-2.5" />
                Auto
              </span>
            )}
          </label>

          {isAutoNumber && !isView ? (
            /* Auto-generated mode */
            <div className={`${inp} relative flex items-center gap-2 bg-gradient-to-r from-indigo-50/60 to-blue-50/40 border-indigo-200 cursor-not-allowed`}>
              <Lock className="h-3 w-3 text-indigo-400 flex-shrink-0" />
              {isLoadingContractNumber ? (
                <span className="flex items-center gap-1.5 text-indigo-400 font-medium">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Generating...
                </span>
              ) : contractNumberPreview ? (
                <span className="font-bold text-indigo-700 tracking-wide">{contractNumberPreview}</span>
              ) : (
                <span className="text-gray-400 italic">Select Seller &amp; Buyer above</span>
              )}
            </div>
          ) : (
            /* Manual mode */
            <input
              type="text"
              value={form.contractNumber || ""}
              onChange={e => setForm(f => ({ ...f, contractNumber: e.target.value }))}
              disabled={isView}
              placeholder="Enter Contract No."
              className={`${inp} ${errors.contractNumber ? "border-red-300" : ""}`}
            />
          )}
          {errors.contractNumber && <p className={err}>{errors.contractNumber}</p>}
        </div>

        {/* Contract Date */}
        <div>
          <label className={lbl}>Contract Date <span className="text-red-500">*</span></label>
          <input
            type="date"
            value={form.contractDate || ""}
            onChange={e => setForm(f => ({ ...f, contractDate: e.target.value }))}
            disabled={isView}
            className={`${inp} ${errors.contractDate ? "border-red-300" : ""}`}
          />
          {errors.contractDate && <p className={err}>{errors.contractDate}</p>}
        </div>

        {/* Contract Type */}
        <div>
          <label className={lbl}>Contract Type</label>
          <div className="relative">
            <select
              value={form.contractType || "Export"}
              onChange={e => setForm(f => ({ ...f, contractType: e.target.value }))}
              disabled={isView}
              className={`${inp} appearance-none pr-8`}
            >
              {CONTRACT_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
