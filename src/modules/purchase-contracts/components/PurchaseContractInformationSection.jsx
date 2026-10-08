"use client";
import React, { useState } from "react";
import { FileText, ChevronDown, Plus, Minus } from "lucide-react";

export default function PurchaseContractInformationSection({
  contract,
  summary,
  form,
  setForm,
  masters = {},
  isView = false,
}) {
  const [showSpec, setShowSpec] = useState(!!(form?.specificationNo || form?.specificationDate));

  const inp = "w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] bg-white transition-all disabled:opacity-75 disabled:bg-gray-100";
  const lbl = "block text-[11px] font-semibold text-gray-600 mb-1.5";

  const isManual = contract?.purchaseType === "MTT" || !contract?.salesContractId;
  const contractNo = form.contractNumber || summary?.contractInfo?.contractNumber || (contract?.salesContract?.contractNumber ? `PC-${contract.salesContract.contractNumber}` : (contract?.id ? `PC-${contract.id}` : "PC-NEW"));
  const defaultBuyer = contract?.salesContract?.seller?.entityName || summary?.commercialInfo?.buyer?.entityName || "";
  const defaultSeller = summary?.commercialInfo?.seller?.entityName || "";
  const contractTypeDisplay = isManual ? "MTT (Manual Trade)" : (contract?.salesContract?.contractType || "SC (Sales Contract)");

  const buyersOptions = masters?.buyers || masters?.partners || [];
  const sellersOptions = masters?.purchaseSuppliers || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      {/* Section Header */}
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <FileText className="h-3.5 w-3.5 text-[#007aff]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Contract Information</h2>
            <p className="text-[10px] text-gray-400">Basic purchase contract details and counterparty entities</p>
          </div>
        </div>
        {!isView && (
          <button
            type="button"
            onClick={() => {
              if (showSpec) {
                setShowSpec(false);
                setForm((f) => ({ ...f, specificationNo: "", specificationDate: "" }));
              } else {
                setShowSpec(true);
              }
            }}
            className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            {showSpec ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            <span>{showSpec ? "Remove Spec" : "Attach Spec"}</span>
          </button>
        )}
      </div>

      <div className="p-5 space-y-4">
        {/* Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className={lbl}>Contract Date</label>
            {isView ? (
              <div className="text-sm font-semibold text-gray-900 py-1.5">{form.contractDate || new Date().toISOString().split("T")[0] || "\u00A0"}</div>
            ) : (
              <input
                type="date"
                value={form.contractDate || new Date().toISOString().split("T")[0]}
                onChange={(e) => setForm((f) => ({ ...f, contractDate: e.target.value }))}
                className={`${inp} font-medium`}
              />
            )}
          </div>

          <div>
            <label className={lbl}>Contract Type</label>
            {isView ? (
              <div className="text-sm font-semibold text-gray-900 py-1.5">{contractTypeDisplay || "\u00A0"}</div>
            ) : (
              <input
                type="text"
                value={contractTypeDisplay}
                readOnly
                className={`${inp} bg-purple-50/60 font-bold text-purple-700 border-purple-200`}
              />
            )}
          </div>

          {/* Buyer Entity */}
          <div>
            <label className={lbl}>Buyer Entity {isManual && !isView ? "*" : ""}</label>
            {isView ? (
              <div className="text-sm font-semibold text-gray-900 py-1.5">{form.buyerName || defaultBuyer || "\u00A0"}</div>
            ) : isManual && buyersOptions.length > 0 ? (
              <div className="relative">
                <select
                  value={form.buyerId || ""}
                  onChange={(e) => {
                    const bId = Number(e.target.value);
                    const bObj = buyersOptions.find((b) => b.id === bId);
                    setForm((f) => ({
                      ...f,
                      buyerId: bId || null,
                      buyerName: bObj?.entityName || bObj?.name || "",
                    }));
                  }}
                  className={`${inp} appearance-none pr-8 font-semibold text-gray-900`}
                >
                  <option value="">Select Buyer Entity</option>
                  {buyersOptions.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.entityName || b.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
              </div>
            ) : (
              <input
                type="text"
                value={form.buyerName || defaultBuyer}
                onChange={(e) => setForm((f) => ({ ...f, buyerName: e.target.value }))}
                readOnly={!isManual}
                placeholder="Enter Buyer Entity"
                className={`${inp} ${!isManual ? "bg-gray-50" : ""} font-semibold text-gray-800`}
              />
            )}
          </div>

          {/* Seller / Supplier Entity */}
          <div>
            <label className={lbl}>Seller / Supplier {!isView && "*"}</label>
            {isView ? (
              <div className="text-sm font-semibold text-gray-900 py-1.5">{form.supplierName || "\u00A0"}</div>
            ) : (
              <div className="relative">
                <select
                  value={form.sellerId || ""}
                  onChange={(e) => {
                    const sId = Number(e.target.value);
                    const sObj = sellersOptions.find((s) => s.id === sId);
                    setForm((f) => ({
                      ...f,
                      sellerId: sId || null,
                      supplierName: sObj?.entityName || sObj?.name || "",
                    }));
                  }}
                  className={`${inp} appearance-none pr-8 font-semibold text-gray-900`}
                >
                  <option value="">Select Supplier Entity</option>
                  {sellersOptions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.entityName || s.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
              </div>
            )}
          </div>

          <div>
            <label className={lbl}>Seller Contract No</label>
            {isView ? (
              <div className="text-sm font-mono text-gray-900 py-1.5">{form.sellerContractNo || "\u00A0"}</div>
            ) : (
              <input
                type="text"
                value={form.sellerContractNo || ""}
                onChange={(e) => setForm((f) => ({ ...f, sellerContractNo: e.target.value }))}
                className={`${inp} font-mono`}
                placeholder="e.g. SUP-88219"
              />
            )}
          </div>

          {showSpec && (
            <>
              <div>
                <label className={lbl}>Specification No</label>
                {isView ? (
                  <div className="text-sm font-mono text-gray-900 py-1.5">{form.specificationNo || "\u00A0"}</div>
                ) : (
                  <input
                    type="text"
                    value={form.specificationNo || ""}
                    onChange={(e) => setForm((f) => ({ ...f, specificationNo: e.target.value }))}
                    className={`${inp} font-mono`}
                    placeholder="e.g. SPEC-2026"
                  />
                )}
              </div>

              <div>
                <label className={lbl}>Specification Date</label>
                {isView ? (
                  <div className="text-sm font-semibold text-gray-900 py-1.5">{form.specificationDate || "\u00A0"}</div>
                ) : (
                  <input
                    type="date"
                    value={form.specificationDate || ""}
                    onChange={(e) => setForm((f) => ({ ...f, specificationDate: e.target.value }))}
                    className={`${inp}`}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
