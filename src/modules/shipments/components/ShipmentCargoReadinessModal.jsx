"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  CircleCheck,
  Clock3,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { usePermissions } from "@/hooks/usePermissions";
import { useSelector } from "react-redux";
import { shipmentsApi } from "../services/shipmentsApi";

export default function ShipmentCargoReadinessModal({
  shipment,
  onClose,
  onSuccess,
}) {
  useEscapeKey(onClose, Boolean(shipment));

  const { hasPermission } = usePermissions();
  const userType = useSelector((state) => state.auth.user?.type);
  const hasSavedReadiness =
    shipment?.cargoReadyConfirmed === true ||
    shipment?.cargoReadyConfirmed === false;
  const canEditSavedReadiness =
    userType === "super_admin" ||
    hasPermission("cargo_allocation:edit_completed");
  const canCreateReadiness =
    userType === "super_admin" ||
    hasPermission("cargo_allocation:create") ||
    hasPermission("cargo_allocation:update");

  const [isReady, setIsReady] = useState(
    shipment?.cargoReadyConfirmed === true,
  );
  const [readyDate, setReadyDate] = useState(
    shipment?.cargoReadyDate || new Date().toISOString().slice(0, 10),
  );
  const [isEditing, setIsEditing] = useState(
    () => !hasSavedReadiness && canCreateReadiness,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!shipment) return null;

  const canEdit = hasSavedReadiness
    ? canEditSavedReadiness && isEditing
    : canCreateReadiness && isEditing;
  const purchaseContractNo =
    shipment.purchaseContractNo ||
    shipment.purchaseContract?.contractNumber ||
    "—";
  const businessReference =
    shipment.businessReference ||
    shipment.businessTransaction?.businessReference ||
    "—";
  const supplier =
    shipment.supplier || shipment.purchaseContract?.sellerName || "—";
  const product =
    shipment.commodity ||
    shipment.purchaseContract?.productName ||
    shipment.product?.name ||
    "—";
  const quantity = Number(
    shipment.purchaseContractQuantity ??
      shipment.purchaseContract?.quantity ??
      shipment.quantity,
  );
  const formattedQuantity = Number.isFinite(quantity)
    ? `${quantity.toLocaleString()} MT`
    : "—";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (isReady && !readyDate) {
      setError("Select the Ready Date.");
      return;
    }

    setLoading(true);
    try {
      await shipmentsApi.updateCargoReadiness(shipment.id, {
        cargoReadyConfirmed: isReady,
        cargoReadyDate: isReady ? readyDate : null,
      });
      toast.success("Cargo Allocation updated.");
      onSuccess?.();
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        requestError.message ||
        "Could not update Cargo Allocation.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsReady(shipment.cargoReadyConfirmed === true);
    setReadyDate(
      shipment.cargoReadyDate || new Date().toISOString().slice(0, 10),
    );
    setError("");
    setIsEditing(false);
  };

  const formattedReadyDate = shipment.cargoReadyDate
    ? new Date(`${shipment.cargoReadyDate}T00:00:00`).toLocaleDateString(
        "en-GB",
        { day: "2-digit", month: "short", year: "numeric" },
      )
    : "—";

  return (
    <>
      <button
        type="button"
        aria-label="Close Cargo Allocation"
        className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-xs"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        >
          <div className="flex items-start justify-between border-b border-slate-100 bg-slate-50/80 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-bold text-slate-900">Cargo Allocation</h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  {shipment.shipmentReference || `Shipment #${shipment.id}`}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-white hover:text-slate-700"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4 p-5">
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <section
              aria-label="Shipment details"
              className="grid grid-cols-2 gap-x-5 gap-y-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Purchase Contract No.
                </p>
                <p className="mt-1 break-words text-xs font-semibold text-slate-800">
                  {purchaseContractNo}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Business Ref
                </p>
                <p className="mt-1 break-words text-xs font-semibold text-blue-700">
                  {businessReference}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Supplier
                </p>
                <p className="mt-1 break-words text-xs font-semibold text-slate-800">
                  {supplier}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Product
                </p>
                <p className="mt-1 break-words text-xs font-semibold text-slate-800">
                  {product}
                </p>
              </div>
              <div className="col-span-2 border-t border-slate-200 pt-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Purchase Quantity
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-800">
                  {formattedQuantity}
                </p>
              </div>
            </section>

            <fieldset className="space-y-2">
              <legend className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Ready Status{" "}
                {canEdit && <span className="text-rose-500">*</span>}
              </legend>
              <div className="grid grid-cols-2 gap-2">
                {canEdit
                  ? [true, false].map((value) => (
                      <label
                        key={String(value)}
                        className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-semibold transition-colors ${
                          isReady === value
                            ? value
                              ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                              : "border-amber-400 bg-amber-50 text-amber-700"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="cargoReady"
                          checked={isReady === value}
                          onChange={() => setIsReady(value)}
                          className="sr-only"
                        />
                        {value ? (
                          <CircleCheck className="h-3.5 w-3.5" />
                        ) : (
                          <Clock3 className="h-3.5 w-3.5" />
                        )}
                        {value ? "Ready" : "Not Ready"}
                      </label>
                    ))
                  : [true, false].map((value) => (
                      <div
                        key={String(value)}
                        className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-semibold ${
                          hasSavedReadiness && isReady === value
                            ? value
                              ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                              : "border-amber-400 bg-amber-50 text-amber-700"
                            : "border-slate-200 bg-white text-slate-400"
                        }`}
                      >
                        {value ? (
                          <CircleCheck className="h-3.5 w-3.5" />
                        ) : (
                          <Clock3 className="h-3.5 w-3.5" />
                        )}
                        {value ? "Ready" : "Not Ready"}
                      </div>
                    ))}
              </div>
            </fieldset>

            <div className="block space-y-1.5">
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <CalendarDays className="h-4 w-4 text-slate-500" />
                Ready Date *
              </span>
              {canEdit ? (
                <input
                  type="date"
                  required={isReady}
                  value={readyDate}
                  onChange={(event) => setReadyDate(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                />
              ) : (
                <div className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700">
                  {hasSavedReadiness ? formattedReadyDate : "—"}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50/80 px-5 py-4">
            {canEdit ? (
              <>
                <button
                  type="button"
                  onClick={hasSavedReadiness ? handleCancelEdit : onClose}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Save Readiness"}
                </button>
              </>
            ) : hasSavedReadiness && canEditSavedReadiness ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
              >
                Edit Readiness
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </>
  );
}
