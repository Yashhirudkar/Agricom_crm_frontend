"use client";
import React from "react";
import { CheckCircle2, Clock, XCircle, ShieldCheck } from "lucide-react";
import { cargoAvailabilityApi } from "../services/cargoAvailabilityApi";

export default function MttReadinessTab({ cargoRecord, onRefresh }) {
  const readinessEntries = cargoRecord?.readinessEntries || [];

  const handleApprove = async (id, status) => {
    try {
      await cargoAvailabilityApi.approveReadiness(id, status);
      onRefresh();
    } catch (err) {
      console.error("Failed to update readiness status", err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Approved</span>;
      case "Rejected":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">Rejected</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Pending Approval</span>;
    }
  };

  if (!readinessEntries || readinessEntries.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <CheckCircle2 className="h-8 w-8 text-gray-300 mx-auto mb-2" />
        <h4 className="text-xs font-bold text-gray-700">No Readiness Entries Logged</h4>
        <p className="text-[11px] text-gray-400 mt-0.5">Click "+ Readiness" in the grid to record physical stock readiness.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
      <div className="px-4 py-3 bg-gray-50/60 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-xs font-bold text-gray-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <span>MTT Physical Stock Readiness Entries</span>
        </h3>
        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          Approved Total: {cargoRecord.readyQty} MT
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-4">Ready Date</th>
              <th className="py-2.5 px-4">Warehouse Location</th>
              <th className="py-2.5 px-4 text-right">Ready Qty</th>
              <th className="py-2.5 px-4">Packaging / Specs</th>
              <th className="py-2.5 px-4">Quality & Moisture</th>
              <th className="py-2.5 px-4">Status</th>
              <th className="py-2.5 px-4 text-right">Approval Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {readinessEntries.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-3 px-4 font-bold text-gray-900">
                  {entry.readyDate ? new Date(entry.readyDate).toLocaleDateString("en-GB") : "—"}
                </td>
                <td className="py-3 px-4">
                  <div className="font-bold text-gray-800">{entry.warehouseName || "Warehouse"}</div>
                  <div className="text-[10px] text-gray-400 font-mono">
                    Lot: {entry.lotNumber || "—"} | Batch: {entry.batchNumber || "—"} | Stack: {entry.stackNumber || "—"}
                  </div>
                </td>
                <td className="py-3 px-4 text-right font-bold text-emerald-600 text-sm">
                  {entry.readyQty} {entry.uom || "MT"}
                </td>
                <td className="py-3 px-4">
                  <div className="text-gray-800 font-semibold">{entry.bagBulk}</div>
                  <div className="text-[10px] text-gray-400">{entry.storageLocation || "Standard Storage"}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-gray-800 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-emerald-500" />
                    <span>Grade: {entry.qualityGrade || "Grade A"}</span>
                  </div>
                  <div className="text-[10px] text-gray-400">
                    Moisture: {entry.moisture || "—"} | FM: {entry.foreignMatter || "—"}
                  </div>
                </td>
                <td className="py-3 px-4">
                  {getStatusBadge(entry.status)}
                </td>
                <td className="py-3 px-4 text-right">
                  {entry.status !== "Approved" && (
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleApprove(entry.id, "Approved")}
                        className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[10px] font-bold border border-emerald-200 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleApprove(entry.id, "Rejected")}
                        className="px-2 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded text-[10px] font-bold border border-red-200 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {entry.status === "Approved" && (
                    <span className="text-[10px] text-gray-400 italic">Approved & Added to Stock Pool</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
