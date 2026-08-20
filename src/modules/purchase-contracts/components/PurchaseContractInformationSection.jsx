"use client";
import React from "react";
import { FileText, Building2, Calendar } from "lucide-react";

export default function PurchaseContractInformationSection({
  contract,
  summary,
  form,
  setForm,
  isView = false,
}) {
  const inp = "w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] bg-white transition-all";
  const lbl = "block text-[11px] font-semibold text-gray-600 mb-1.5";

  const contractNo = summary?.contractInfo?.contractNumber || (contract?.salesContract?.contractNumber ? `PC-${contract.salesContract.contractNumber}` : (contract?.id ? `PC-${contract.id}` : ""));
  const buyerName = summary?.commercialInfo?.buyer?.entityName || contract?.salesContract?.buyer?.entityName || "";
  const defaultSeller = summary?.commercialInfo?.seller?.entityName || contract?.salesContract?.seller?.entityName || "";
  const contractType = contract?.salesContract?.contractType || "";

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
            <p className="text-[10px] text-gray-400">Basic purchase contract details and parties</p>
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
              value={contractType}
              readOnly
              className={`${inp} bg-gray-50 font-bold text-purple-700`}
            />
          </div>

          <div>
            <label className={lbl}>Buyer (Readonly from SC)</label>
            <input
              type="text"
              value={buyerName}
              readOnly
              className={`${inp} bg-gray-50 font-semibold text-gray-800`}
            />
          </div>

          <div>
            <label className={lbl}>Seller / Supplier</label>
            <input
              type="text"
              value={form.supplierName || defaultSeller}
              onChange={(e) => setForm((f) => ({ ...f, supplierName: e.target.value }))}
              disabled={isView}
              className={`${inp} font-semibold text-gray-900`}
              placeholder="Enter Supplier Name"
            />
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
