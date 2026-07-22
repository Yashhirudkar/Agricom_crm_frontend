"use client";
import React, { useEffect } from "react";
import { Ship, ChevronDown } from "lucide-react";

// currencyCode is intentionally omitted — it is always derived from form.currencyCode (Contract Currency)
const emptyShipment = (no) => ({
  shipmentNo: no,
  shipmentDate: "",
  noOfContainers: "",
  ratePerMt: "",
  purchaseRate: "",
  forex: "",
  freight: "",
  quantity: "",
  remarks: "",
});

export default function ShipmentTable({ form, setForm, errors, masters, isView }) {
  const shipments = form.shipments || [];
  const numShipments = form.numShipments || 3;

  // Regenerate rows when count changes — new rows always inherit the Contract Currency
  useEffect(() => {
    const count = parseInt(numShipments, 10) || 0;
    if (count === shipments.length) return;
    setForm(f => {
      const existing = f.shipments || [];
      const contractCurrency = f.currencyCode || "";
      const newShipments = Array.from({ length: count }, (_, i) => {
        if (existing[i]) {
          // Ensure existing rows are also normalized to Contract Currency
          return { ...existing[i], currencyCode: contractCurrency };
        }
        return { ...emptyShipment(i + 1), currencyCode: contractCurrency };
      });
      return { ...f, shipments: newShipments };
    });
  }, [numShipments]);

  const updateShipment = (idx, field, value) => {
    if (field === "currencyCode") {
      // Reverse sync: changing currency in ANY shipment row = changing the Contract Currency
      setForm(f => ({
        ...f,
        currencyCode: value,
        shipments: (f.shipments || []).map(s => ({ ...s, currencyCode: value })),
      }));
    } else {
      setForm(f => {
        const s = [...(f.shipments || [])];
        s[idx] = { ...s[idx], [field]: value };
        return { ...f, shipments: s };
      });
    }
  };

  const inpCls = "w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#007aff]/30 focus:border-[#007aff] bg-white";
  const selCls = "w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#007aff]/30 focus:border-[#007aff] bg-white appearance-none";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-cyan-50 flex items-center justify-center flex-shrink-0">
            <Ship className="h-3.5 w-3.5 text-cyan-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Shipment Schedule</h2>
            <p className="text-[10px] text-gray-400">Delivery schedule and container details</p>
          </div>
        </div>
        {!isView && (
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-semibold text-gray-500 whitespace-nowrap">No. of Shipments</label>
            <input
              type="number"
              min={1}
              max={24}
              value={numShipments}
              onChange={e => setForm(f => ({ ...f, numShipments: Math.max(1, Math.min(24, parseInt(e.target.value) || 1)) }))}
              className="w-16 px-2 py-1.5 text-xs text-center border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff]"
            />
          </div>
        )}
      </div>

      {errors.shipments && <p className="text-[11px] text-red-500 px-5 pt-3">{errors.shipments}</p>}

      {shipments.length === 0 ? (
        <div className="px-5 py-8 text-center">
          <p className="text-xs text-gray-400 font-medium">Set the number of shipments above to generate rows.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Ship #", "Date", "Containers", "Rate/MT", "Currency", "Purchase Rate", "Forex", "Freight", "Qty (MT)", "Remarks"].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {shipments.map((s, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50">
                  <td className="px-3 py-2 font-bold text-gray-600">{idx + 1}</td>
                  <td className="px-3 py-2 min-w-[130px]">
                    <input type="date" value={s.shipmentDate || ""} onChange={e => updateShipment(idx, "shipmentDate", e.target.value)} disabled={isView} className={inpCls} />
                  </td>
                  <td className="px-3 py-2 min-w-[80px]">
                    <input type="number" min="0" value={s.noOfContainers || ""} onChange={e => updateShipment(idx, "noOfContainers", e.target.value)} disabled={isView} className={inpCls} placeholder="0" />
                  </td>
                  <td className="px-3 py-2 min-w-[90px]">
                    <input type="number" min="0" step="0.01" value={s.ratePerMt || ""} onChange={e => updateShipment(idx, "ratePerMt", e.target.value)} disabled={isView} className={inpCls} placeholder="0.00" />
                  </td>
                  <td className="px-3 py-2 min-w-[110px]">
                    {isView ? (
                      // In view mode — show as badge (always equals Contract Currency)
                      <span className="inline-flex items-center px-2 py-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
                        {form.currencyCode || "—"}
                      </span>
                    ) : (
                      <div className="relative">
                        {/* Reads from form.currencyCode — single source of truth */}
                        <select
                          value={form.currencyCode || ""}
                          onChange={e => updateShipment(idx, "currencyCode", e.target.value)}
                          className={selCls}
                        >
                          <option value="">Currency</option>
                          {masters.currencies.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                        </select>
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 min-w-[90px]">
                    <input type="number" min="0" step="0.01" value={s.purchaseRate || ""} onChange={e => updateShipment(idx, "purchaseRate", e.target.value)} disabled={isView} className={inpCls} placeholder="0.00" />
                  </td>
                  <td className="px-3 py-2 min-w-[80px]">
                    <input type="number" min="0" step="0.01" value={s.forex || ""} onChange={e => updateShipment(idx, "forex", e.target.value)} disabled={isView} className={inpCls} placeholder="0.00" />
                  </td>
                  <td className="px-3 py-2 min-w-[80px]">
                    <input type="number" min="0" step="0.01" value={s.freight || ""} onChange={e => updateShipment(idx, "freight", e.target.value)} disabled={isView} className={inpCls} placeholder="0.00" />
                  </td>
                  <td className="px-3 py-2 min-w-[90px]">
                    <input type="number" min="0" step="0.01" value={s.quantity || ""} onChange={e => updateShipment(idx, "quantity", e.target.value)} disabled={isView} className={inpCls} placeholder="0.00" />
                  </td>
                  <td className="px-3 py-2 min-w-[130px]">
                    <input type="text" value={s.remarks || ""} onChange={e => updateShipment(idx, "remarks", e.target.value)} disabled={isView} className={inpCls} placeholder="Remarks" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
