"use client";
import React, { useState } from "react";
import { CheckCircle2, Clock, FileText, AlertCircle, Edit3 } from "lucide-react";
import MttReadinessFormModal from "./MttReadinessFormModal";

export default function MttReadinessTab({ cargoRecord, onRefresh }) {
  const [openModal, setOpenModal] = useState(false);

  const contract = cargoRecord?.purchaseContract || {};
  const product = cargoRecord?.product || {};
  const contractNo =
    contract.contractNumber || `PC-${contract.id || cargoRecord?.purchaseContractId || ""}`;
  const businessRef =
    cargoRecord?.businessReference ||
    cargoRecord?.businessTransaction?.businessReference ||
    contract.businessReference ||
    "—";
  const productName = product.name || cargoRecord?.purchaseContractItem?.productName || "Product";

  const isReady =
    cargoRecord?.isReady ||
    cargoRecord?.status === "Ready" ||
    cargoRecord?.status === "Partially Allocated" ||
    cargoRecord?.status === "Fully Allocated" ||
    cargoRecord?.status === "Loading" ||
    cargoRecord?.status === "Dispatched" ||
    cargoRecord?.status === "Completed";

  const readyDate = cargoRecord?.readyDate || cargoRecord?.readinessEntries?.[0]?.readyDate;
  const remarks = cargoRecord?.remarks || cargoRecord?.readinessEntries?.[0]?.remarks;

  return (
    <div className="space-y-4 font-sans">
      {/* Main Readiness Status Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Header Banner */}
        <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isReady
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                  : "bg-amber-100 text-amber-700 border border-amber-200"
              }`}
            >
              {isReady ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <Clock className="h-4 w-4" />
              )}
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                MTT Cargo Readiness Status
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Procurement readiness confirmation for outbound allocation & loading
              </p>
            </div>
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Update Readiness</span>
          </button>
        </div>

        {/* Card Body */}
        <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Status Display */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Current Readiness
            </span>
            <div className="mt-2">
              {isReady ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Ready
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  <Clock className="h-3.5 w-3.5 text-amber-600" />
                  Not Ready
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-2 font-medium">
              {isReady
                ? "Cargo is authorized for allocation & truck loading."
                : "Cargo is not ready. Stock allocation is held."}
            </p>
          </div>

          {/* Contract Details */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Purchase Contract
              </span>
              <span className="font-bold text-slate-900 mt-0.5 block">
                {contractNo}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Business Ref
              </span>
              <span className="font-mono font-semibold text-indigo-700 mt-0.5 block">
                {businessRef}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Product
              </span>
              <span className="font-medium text-slate-800 mt-0.5 block truncate">
                {productName}
              </span>
            </div>
          </div>

          {/* Quantities */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Purchase Quantity
              </span>
              <span className="text-base font-extrabold text-slate-900 font-mono mt-0.5 block">
                {Number(cargoRecord.purchaseQty || 0).toLocaleString()} MT
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Available Cargo
              </span>
              <span className="text-sm font-bold text-cyan-700 font-mono mt-0.5 block">
                {Number(cargoRecord.availableQty || 0).toLocaleString()} MT
              </span>
            </div>
          </div>

          {/* Ready Date & Remarks */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Ready Date
              </span>
              <span className="font-bold text-slate-800 mt-0.5 block">
                {readyDate ? new Date(readyDate).toLocaleDateString("en-GB") : "—"}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Remarks
              </span>
              <p className="text-[11px] text-slate-600 mt-0.5 italic line-clamp-3">
                {remarks || "No operational remarks recorded."}
              </p>
            </div>
          </div>
        </div>

        {/* Operational Guidance Notice */}
        <div className="px-5 py-3 bg-slate-100/60 border-t border-slate-200/80 flex items-center gap-2 text-xs text-slate-600">
          <AlertCircle className="h-4 w-4 text-slate-400 flex-shrink-0" />
          <span>
            {isReady
              ? "Cargo is marked Ready. You can proceed to the Allocation and Exporter Loading Execution workflows."
              : "Cargo is marked Not Ready. Click 'Update Readiness' once cargo is confirmed ready."}
          </span>
        </div>
      </div>

      {/* Modal Dialog */}
      {openModal && (
        <MttReadinessFormModal
          cargoRecord={cargoRecord}
          onClose={() => setOpenModal(false)}
          onSuccess={() => {
            onRefresh?.();
            setOpenModal(false);
          }}
        />
      )}
    </div>
  );
}
