"use client";
import React, { useEffect, useRef } from "react";
import { Ship, CheckCircle2, AlertTriangle } from "lucide-react";
import { getShipmentReferencePreview } from "../utils/shipmentReference";
import { generateAutoShipments, isDivisible } from "../utils/scheduleUtils";
import { cleanNumberValue, formatInputVal, formatNumberDisplay } from "../utils/formatUtils";

// Returns the unit label based on transport mode
function getTransportUnitLabel(mode) {
  if (!mode) return "Containers";
  const m = mode.toLowerCase();
  if (m.includes("road")) return "Trucks";
  if (m.includes("rail") || m.includes("wagon")) return "Wagons";
  if (m.includes("air")) return "Flights";
  return "Containers"; // sea or default
}

export default function ShipmentTable({
  form,
  setForm,
  errors,
  isView,
  totalProductQty: propTotalProductQty,
  numberOfShipments: propNumberOfShipments,
  productItems: propProductItems,
}) {
  const productItems = propProductItems || form.items || [];
  const totalProductQty =
    propTotalProductQty ??
    productItems.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0);
  const roundedProductQty = Math.round(totalProductQty * 100) / 100;

  // Active Qty Per Count from product items
  const activeItem =
    productItems.find((i) => parseFloat(i.qtyPerCount) > 0) || productItems[0];
  const qtyPerCount = parseFloat(activeItem?.qtyPerCount) || 0;

  const isNotDivisible =
    roundedProductQty > 0 &&
    qtyPerCount > 0 &&
    !isDivisible(roundedProductQty, qtyPerCount);

  // Shipment Count = Product Qty / Qty Per Count (only when exact multiple)
  const calculatedCount =
    roundedProductQty > 0 && qtyPerCount > 0
      ? isNotDivisible
        ? 0
        : Math.round(roundedProductQty / qtyPerCount)
      : Math.max(1, parseInt(form.numShipments, 10) || 1);

  const shipments = form.shipments || [];
  const transportUnitLabel = getTransportUnitLabel(
    form.originTransportMode || form.destinationTransportMode
  );

  const totalShipmentQty = shipments.reduce(
    (sum, s) => sum + (parseFloat(s.quantity) || 0),
    0
  );
  const totalContainers = shipments.reduce(
    (sum, s) => sum + (parseInt(s.noOfContainers, 10) || 0),
    0
  );

  // Trigger signature: ONLY product quantity, qtyPerCount, item count changes trigger regeneration
  const itemsSignature =
    productItems
      .map(
        (i) => `${parseFloat(i.quantity) || 0}_${parseFloat(i.qtyPerCount) || 0}`
      )
      .join("|") + `_len_${productItems.length}`;

  const prevSignatureRef = useRef(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isView) return;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevSignatureRef.current = itemsSignature;

      // In edit mode or if shipments are already populated from DB / enquiry, preserve them on mount
      if ((form.shipments || []).length > 0 && form.shipments.some((s) => s.quantity)) {
        return;
      }

      // If new form and qtyPerCount + totalProductQty exist, auto generate only if divisible
      if (roundedProductQty > 0 && qtyPerCount > 0 && !isNotDivisible) {
        setForm((f) => ({
          ...f,
          numShipments: calculatedCount,
          shipments: generateAutoShipments({
            totalProductQty: roundedProductQty,
            qtyPerCount,
            numShipments: calculatedCount,
            existingShipments: f.shipments || [],
            currencyCode: f.currencyCode,
            defaultShipmentDate: f.contractDate || "",
          }),
        }));
      }
      return;
    }

    // Trigger ONLY when Product Items change (quantity, qtyPerCount, added, removed)
    if (prevSignatureRef.current !== itemsSignature) {
      prevSignatureRef.current = itemsSignature;

      // Backward compatibility: If qtyPerCount is null/0, do NOT regenerate shipment schedule
      if (!qtyPerCount || qtyPerCount <= 0) {
        return;
      }

      // If not divisible, clear generated shipments
      if (isNotDivisible) {
        setForm((f) => ({
          ...f,
          numShipments: 0,
          shipments: [],
        }));
        return;
      }

      setForm((f) => ({
        ...f,
        numShipments: calculatedCount,
        shipments: generateAutoShipments({
          totalProductQty: roundedProductQty,
          qtyPerCount,
          numShipments: calculatedCount,
          existingShipments: f.shipments || [],
          currencyCode: f.currencyCode,
          defaultShipmentDate: f.contractDate || "",
        }),
      }));
    }
  }, [
    itemsSignature,
    roundedProductQty,
    qtyPerCount,
    calculatedCount,
    isNotDivisible,
    isView,
    setForm,
    form.shipments,
  ]);

  const updateShipment = (idx, field, value) => {
    setForm((f) => {
      const s = [...(f.shipments || [])];
      s[idx] = {
        ...s[idx],
        [field]: value,
        ...(field === "shipmentDate" ? { isDateCustomized: true } : {}),
      };
      return { ...f, shipments: s };
    });
  };

  const isBalanced =
    !isNotDivisible &&
    totalProductQty > 0 &&
    Math.abs(totalShipmentQty - totalProductQty) < 0.001;
  const isMismatched =
    !isNotDivisible &&
    totalProductQty > 0 &&
    Math.abs(totalShipmentQty - totalProductQty) >= 0.001;
  const qtyDifference = totalShipmentQty - totalProductQty;

  const inpCls =
    "w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#007aff]/30 focus:border-[#007aff] bg-white";

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden transition-opacity duration-200 ${
        isNotDivisible ? "opacity-45 pointer-events-none select-none" : ""
      }`}
    >
      <div className="px-5 py-3.5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-cyan-50 flex items-center justify-center flex-shrink-0">
            <Ship className="h-3.5 w-3.5 text-cyan-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-gray-900">Shipment Schedule</h2>
              {!isNotDivisible && isBalanced && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="h-3 w-3" />
                  Balanced ({formatNumberDisplay(totalShipmentQty)} MT)
                </span>
              )}
              {!isNotDivisible && isMismatched && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200">
                  <AlertTriangle className="h-3 w-3" />
                  Diff: {qtyDifference > 0 ? `+${Math.round(qtyDifference)}` : Math.round(qtyDifference)} MT
                </span>
              )}
            </div>
            <p className="text-[10px] text-gray-400">
              Delivery schedule and {transportUnitLabel.toLowerCase()} details (auto-distributed from {formatNumberDisplay(totalProductQty)} MT product quantity)
            </p>
          </div>
        </div>

        {/* Read-only display of No. of Shipments calculated automatically */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500">No. of Shipments:</span>
          <span className="text-xs font-bold text-gray-800 px-3 py-1 bg-gray-50 rounded-lg border border-gray-200">
            {!isView ? (isNotDivisible ? "—" : calculatedCount) : (propNumberOfShipments ?? calculatedCount)}
          </span>
        </div>
      </div>

      {!isNotDivisible && errors?.shipments && (
        <p className="text-[11px] text-red-500 px-5 pt-3">{errors.shipments}</p>
      )}

      {shipments.length === 0 ? (
        !isNotDivisible ? (
          <div className="px-5 py-8 text-center">
            <p className="text-xs text-gray-400 font-medium">
              Enter Product Quantity and Qty Per Count to generate shipment rows.
            </p>
          </div>
        ) : (
          <div className="px-5 py-8 text-center" />
        )
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Ship #", "Shipment Ref", "Date", transportUnitLabel, "Qty (MT)", "Remarks"].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {shipments.map((s, idx) => {
                const displayRef =
                  s.shipmentReference ??
                  getShipmentReferencePreview(
                    form.contractNumber,
                    idx + 1,
                    s.noOfContainers,
                    s.shipmentDate,
                    s.quantity
                  );

                return (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="px-3 py-2 font-bold text-gray-600">{idx + 1}</td>
                    <td className="px-3 py-2 font-mono text-xs text-slate-600 select-all whitespace-nowrap">
                      {displayRef}
                    </td>
                    <td className="px-3 py-2 min-w-[130px]">
                      <input
                        type="date"
                        value={s.shipmentDate || ""}
                        onChange={(e) => updateShipment(idx, "shipmentDate", e.target.value)}
                        disabled={isView || isNotDivisible}
                        className={inpCls}
                      />
                    </td>
                    <td className="px-3 py-2 min-w-[80px]">
                      <input
                        type="number"
                        min="1"
                        value={s.noOfContainers != null && s.noOfContainers !== "" ? s.noOfContainers : 1}
                        onChange={(e) =>
                          updateShipment(
                            idx,
                            "noOfContainers",
                            e.target.value ? Math.max(1, parseInt(e.target.value, 10)) : 1
                          )
                        }
                        disabled={isView || isNotDivisible}
                        className={inpCls}
                        placeholder="1"
                        title={transportUnitLabel}
                      />
                    </td>
                    <td className="px-3 py-2 min-w-[90px]">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={formatInputVal(s.quantity)}
                        onChange={(e) => updateShipment(idx, "quantity", e.target.value)}
                        onBlur={() => updateShipment(idx, "quantity", cleanNumberValue(s.quantity))}
                        disabled={isView || isNotDivisible}
                        className={inpCls}
                        placeholder="0"
                      />
                    </td>
                    <td className="px-3 py-2 min-w-[130px]">
                      <input
                        type="text"
                        value={s.remarks || ""}
                        onChange={(e) => updateShipment(idx, "remarks", e.target.value)}
                        disabled={isView || isNotDivisible}
                        className={inpCls}
                        placeholder="Remarks"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {shipments.length > 0 && (
              <tfoot>
                <tr className="bg-gray-50/80 border-t border-gray-200 font-bold text-xs">
                  <td colSpan={3} className="px-3 py-2 text-right text-gray-500 font-normal">
                    Containers: <span className="font-bold text-gray-900">{totalContainers}</span>
                  </td>
                  <td className="px-3 py-2 text-right text-gray-700 whitespace-nowrap">
                    Total Qty (MT):
                  </td>
                  <td className="px-3 py-2 font-mono text-gray-900 whitespace-nowrap">
                    <span className={!isNotDivisible && isMismatched ? "text-red-600 font-bold" : "text-gray-900 font-bold"}>
                      {formatNumberDisplay(totalShipmentQty)} MT
                    </span>
                  </td>
                  <td className="px-3 py-2"></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}
    </div>
  );
}
