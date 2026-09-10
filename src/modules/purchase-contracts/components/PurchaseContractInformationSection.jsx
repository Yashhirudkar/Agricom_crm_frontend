"use client";
import React from "react";
import { FileText, ChevronDown } from "lucide-react";

export default function PurchaseContractInformationSection({
  contract,
  summary,
  form,
  setForm,
  masters = {},
  isView = false,
}) {
  const inp = "w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] bg-white transition-all disabled:opacity-75 disabled:bg-gray-100";
  const lbl = "block text-[11px] font-semibold text-gray-600 mb-1.5";

  const isManual = contract?.purchaseType === "MTT" || !contract?.salesContractId;
  const contractNo = form.contractNumber || summary?.contractInfo?.contractNumber || (contract?.salesContract?.contractNumber ? `PC-${contract.salesContract.contractNumber}` : (contract?.id ? `PC-${contract.id}` : "PC-NEW"));
  const defaultBuyer = summary?.commercialInfo?.buyer?.entityName || contract?.salesContract?.buyer?.entityName || "";
  const defaultSeller = summary?.commercialInfo?.seller?.entityName || contract?.salesContract?.seller?.entityName || "";
  const contractTypeDisplay = isManual ? "MTT (Manual Trade)" : (contract?.salesContract?.contractType || "SC (Sales Contract)");

  const buyersOptions = masters?.buyers || masters?.partners || [];
  const sellersOptions = masters?.sellers || masters?.partners || [];

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
        <span className="text-xs font-mono font-bold text-[#007aff] bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg">
          {contractNo}
        </span>
      </div>

      <div className="p-5 space-y-4">
        {/* Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className={lbl}>Contract Date</label>
            <input
              type="date"
              value={form.contractDate || new Date().toISOString().split("T")[0]}
              onChange={(e) => setForm((f) => ({ ...f, contractDate: e.target.value }))}
              disabled={isView}
              className={`${inp} font-medium`}
            />
          </div>

          <div>
            <label className={lbl}>Contract Type</label>
            <input
              type="text"
              value={contractTypeDisplay}
              readOnly
              className={`${inp} bg-purple-50/60 font-bold text-purple-700 border-purple-200`}
            />
          </div>

          {/* Buyer Entity */}
          <div>
            <label className={lbl}>Buyer Entity {isManual ? "*" : "(Readonly)"}</label>
            {isManual && buyersOptions.length > 0 ? (
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
                  disabled={isView}
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
                disabled={isView}
                placeholder="Enter Buyer Entity"
                className={`${inp} ${!isManual ? "bg-gray-50" : ""} font-semibold text-gray-800`}
              />
            )}
          </div>

          {/* Seller / Supplier Entity */}
          <div>
            <label className={lbl}>Seller / Supplier *</label>
            {isManual && sellersOptions.length > 0 ? (
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
                  disabled={isView}
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
            ) : (
              <input
                type="text"
                value={form.supplierName || defaultSeller}
                onChange={(e) => setForm((f) => ({ ...f, supplierName: e.target.value }))}
                disabled={isView}
                className={`${inp} font-semibold text-gray-900`}
                placeholder="Enter Supplier Name"
              />
            )}
          </div>

          <div>
            <label className={lbl}>Seller Contract No (Optional)</label>
            <input
              type="text"
              value={form.sellerContractNo || ""}
              onChange={(e) => setForm((f) => ({ ...f, sellerContractNo: e.target.value }))}
              disabled={isView}
              className={`${inp} font-mono`}
              placeholder="e.g. SUP-88219"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
