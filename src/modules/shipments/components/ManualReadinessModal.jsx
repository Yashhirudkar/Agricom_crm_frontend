"use client";
import React, { useState, useEffect } from "react";
import {
  X,
  Check,
  Loader2,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Info,
  Lock,
} from "lucide-react";
import { shipmentsApi } from "../services/shipmentsApi";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";

export default function ManualReadinessModal({
  shipment,
  isOpen,
  onClose,
  onSaveSuccess,
}) {
  const { hasPermission } = usePermissions();
  const canEdit =
    hasPermission("shipments:update") ||
    hasPermission("shipments:override_readiness") ||
    hasPermission("shipments:edit");

  // Options: "default" | "yes" | "no"
  const [selectedOption, setSelectedOption] = useState("default");
  const [reason, setReason] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (shipment) {
      if (shipment.manualReadyOverride === true) {
        setSelectedOption("yes");
      } else if (shipment.manualReadyOverride === false) {
        setSelectedOption("no");
      } else {
        setSelectedOption("default");
      }
      setReason(shipment.manualReadyReason || "");
      setError("");
    }
  }, [shipment, isOpen]);

  if (!isOpen || !shipment) return null;

  // System Ready = YES strictly when Cargo Allocation = Allocated AND Freight Allocation = Allocated
  const isSystemReady = Boolean(shipment.cargoReady && shipment.freightReady);

  const handleSave = async (e) => {
    e?.preventDefault();
    if (!canEdit) {
      toast.error(
        "You do not have permission to modify manual readiness override."
      );
      return;
    }

    if (selectedOption !== "default" && !reason.trim()) {
      setError("Reason is required when selecting Yes or No.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      let overrideValue = null;
      if (selectedOption === "yes") overrideValue = true;
      if (selectedOption === "no") overrideValue = false;

      const res = await shipmentsApi.updateManualReadiness(shipment.id, {
        manualReadyOverride: overrideValue,
        reason: selectedOption === "default" ? null : reason.trim(),
      });

      toast.success("Shipment readiness updated successfully.");
      if (onSaveSuccess) {
        onSaveSuccess(
          res?.data || {
            ...shipment,
            manualReadyOverride: overrideValue,
            manualReadyReason: selectedOption === "default" ? null : reason.trim(),
          }
        );
      }
      onClose();
    } catch (err) {
      console.error("Failed to update manual readiness:", err);
      const msg =
        err.response?.data?.message || "Failed to update manual readiness";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const formattedDate = shipment.manualReadyAt
    ? new Date(shipment.manualReadyAt).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#007aff]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                Shipment Readiness Control
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                Shipment Ref:{" "}
                <span className="font-semibold text-gray-800">
                  {shipment.shipmentReference || `#${shipment.id}`}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          {/* Permission Notice */}
          {!canEdit && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-800 text-xs">
              <Lock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold">View Only Mode:</span> You can view
                readiness status. Only users with{" "}
                <span className="font-semibold underline">
                  Shipment Execute / Manager
                </span>{" "}
                permission can change manual override.
              </div>
            </div>
          )}

          {/* SECTION 1: System Ready (Read Only) */}
          <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
                  System Ready (Read Only)
                </span>
              </div>
              <div>
                {isSystemReady ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Yes
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    <XCircle className="w-3.5 h-3.5" />
                    No
                  </span>
                )}
              </div>
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-gray-200">
                <span className="text-gray-600">Cargo Allocation:</span>
                <span
                  className={`font-semibold ${shipment.cargoReady ? "text-emerald-600" : "text-amber-600"
                    }`}
                >
                  {shipment.cargoReady ? "Allocated" : "Pending"}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-gray-200">
                <span className="text-gray-600">Freight Allocation:</span>
                <span
                  className={`font-semibold ${shipment.freightReady ? "text-emerald-600" : "text-amber-600"
                    }`}
                >
                  {shipment.freightReady ? "Allocated" : "Pending"}
                </span>
              </div>
            </div>

            {/* Reasons if system not ready */}
            {!isSystemReady && (
              <div className="text-[11px] text-gray-500 bg-white/70 p-2 rounded-lg border border-gray-100">
                <span className="font-semibold text-gray-700">System Ready Logic:</span>{" "}
                {!shipment.cargoReady && !shipment.freightReady
                  ? "Both Cargo Allocation and Freight Allocation are pending."
                  : !shipment.cargoReady
                  ? "Cargo Allocation is pending."
                  : "Freight Allocation is pending."}
              </div>
            )}
          </div>

          {/* SECTION 2: Manual Override */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
              Manual Override
            </label>

            <div className="grid grid-cols-1 gap-2.5">
              {/* Option: Default */}
              <label
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${selectedOption === "default"
                    ? "bg-blue-50/40 border-blue-400 ring-2 ring-blue-100"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                  } ${!canEdit ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <input
                  type="radio"
                  name="manualReadyOverride"
                  value="default"
                  disabled={!canEdit}
                  checked={selectedOption === "default"}
                  onChange={() => {
                    setSelectedOption("default");
                    setError("");
                  }}
                  className="mt-0.5 text-[#007aff] focus:ring-blue-500 h-4 w-4"
                />
                <div className="flex-1 text-xs">
                  <div className="font-bold text-gray-900 flex items-center gap-1.5">
                    Default (Use System Status)
                  </div>
                  <div className="text-gray-500 text-[11px] mt-0.5">
                    Readiness will strictly track automatic Cargo and Freight
                    allocation status.
                  </div>
                </div>
              </label>

              {/* Option: Yes */}
              <label
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${selectedOption === "yes"
                    ? "bg-emerald-50/50 border-emerald-400 ring-2 ring-emerald-100"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                  } ${!canEdit ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <input
                  type="radio"
                  name="manualReadyOverride"
                  value="yes"
                  disabled={!canEdit}
                  checked={selectedOption === "yes"}
                  onChange={() => {
                    setSelectedOption("yes");
                    setError("");
                  }}
                  className="mt-0.5 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <div className="flex-1 text-xs">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    Yes (Force Ready for Execution)
                  </div>
                  <div className="text-gray-500 text-[11px] mt-0.5">
                    Allows executing purchase contract even if allocations are
                    still pending.
                  </div>
                </div>
              </label>

              {/* Option: No */}
              <label
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${selectedOption === "no"
                    ? "bg-rose-50/50 border-rose-400 ring-2 ring-rose-100"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                  } ${!canEdit ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <input
                  type="radio"
                  name="manualReadyOverride"
                  value="no"
                  disabled={!canEdit}
                  checked={selectedOption === "no"}
                  onChange={() => {
                    setSelectedOption("no");
                    setError("");
                  }}
                  className="mt-0.5 text-rose-600 focus:ring-rose-500 h-4 w-4"
                />
                <div className="flex-1 text-xs">
                  <div className="font-bold text-rose-900 flex items-center gap-1.5">
                    No (Block Execution)
                  </div>
                  <div className="text-gray-500 text-[11px] mt-0.5">
                    Prevents execution even if both Cargo and Freight allocations
                    are completed.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* SECTION 3: Reason Textarea (Required for Yes or No) */}
          {selectedOption !== "default" && (
            <div className="space-y-1.5 animate-in fade-in duration-150">
              <label className="block text-xs font-bold text-gray-700">
                Reason <span className="text-rose-500">* (Required)</span>
              </label>
              <textarea
                rows={3}
                disabled={!canEdit}
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError("");
                }}
                placeholder="State the operational reason for this override (e.g., Authorized by Management, Waiting on QA approval)..."
                className={`w-full px-3 py-2 text-xs border rounded-xl resize-none transition-all outline-hidden ${error
                    ? "border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                    : "border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  } ${!canEdit ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
              />
              {error && (
                <p className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {error}
                </p>
              )}
            </div>
          )}

          {/* SECTION 4: Active Audit Info */}
          {shipment.isManualOverride && (
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-1">
              <div className="font-bold text-gray-700 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-500" />
                Current Manual Override Info
              </div>
              <div className="text-gray-600 text-[11px]">
                Overridden by:{" "}
                <span className="font-semibold text-gray-800">
                  {shipment.manualReadyByUser?.name || "Authorized User"}
                </span>
                {formattedDate && (
                  <span>
                    {" "}
                    on <span className="font-semibold">{formattedDate}</span>
                  </span>
                )}
              </div>
              {shipment.manualReadyReason && (
                <div className="text-gray-600 text-[11px]">
                  Reason:{" "}
                  <span className="italic text-gray-800">
                    "{shipment.manualReadyReason}"
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            {canEdit && (
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 text-xs font-bold text-white bg-[#007aff] hover:bg-blue-600 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Save
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}