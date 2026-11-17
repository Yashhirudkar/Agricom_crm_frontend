"use client";
import React from "react";
import { Plus, Trash2, ArrowRight } from "lucide-react";
import { isFreightRequiredForIncoterm } from "@/modules/shipments/utils/incotermFreight";
import { getShipmentTypeShortForm } from "@/modules/sales-contracts/utils/formatUtils";

/**
 * Repeatable Transport Details Grid
 * Columns: Origin* | Shipment Type / Incoterm* | Destination* | Freight Required (auto) | Actions
 */
export default function TransportDetailsGrid({
  routes = [],
  onChange,
  shipmentTypes = [],
  isView = false,
  error = null,
}) {
  const handleAddRoute = () => {
    if (isView) return;
    const newSeq = (routes?.length || 0) + 1;
    const defaultIncoterm = shipmentTypes?.[0]
      ? getShipmentTypeShortForm(shipmentTypes[0])
      : "";
    const updated = [
      ...(routes || []),
      {
        sequence: newSeq,
        origin: "",
        incoterm: defaultIncoterm,
        destination: "",
      },
    ];
    onChange?.(updated);
  };

  const handleRemoveRoute = (index) => {
    if (isView) return;
    const updated = (routes || [])
      .filter((_, idx) => idx !== index)
      .map((r, idx) => ({ ...r, sequence: idx + 1 }));
    onChange?.(updated);
  };

  const handleFieldChange = (index, field, value) => {
    if (isView) return;
    const updated = (routes || []).map((r, idx) => {
      if (idx !== index) return r;
      return {
        ...r,
        [field]: value,
      };
    });
    onChange?.(updated);
  };

  const normalizedRoutes = routes && routes.length > 0 ? routes : [];

  return (
    <div className="w-full flex flex-col gap-2.5">
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-xs text-gray-700">
          <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-gray-200">
            <tr>
              <th className="py-2 px-3 w-10 text-center">#</th>
              <th className="py-2 px-3 min-w-[140px]">
                Origin <span className="text-red-500">*</span>
              </th>
              <th className="py-2 px-3 min-w-[160px]">
                Shipment Type / Incoterm <span className="text-red-500">*</span>
              </th>
              <th className="py-2 px-3 min-w-[140px]">
                Destination <span className="text-red-500">*</span>
              </th>
              <th className="py-2 px-3 w-36 text-center">
                Freight Required
              </th>
              {!isView && (
                <th className="py-2 px-3 w-14 text-center">Action</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {normalizedRoutes.length === 0 ? (
              <tr>
                <td
                  colSpan={isView ? 5 : 6}
                  className="py-5 text-center text-xs text-gray-400 italic"
                >
                  {isView
                    ? "No transport routes configured."
                    : "No routes added yet. Click \"+ Add Route\" to add an Origin → Incoterm → Destination route."}
                </td>
              </tr>
            ) : (
              normalizedRoutes.map((route, idx) => {
                const freightReq = isFreightRequiredForIncoterm(route.incoterm);
                return (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2 px-3 text-center text-xs font-mono text-gray-400">
                      {route.sequence || idx + 1}
                    </td>

                    {/* Origin */}
                    <td className="py-2 px-3">
                      {isView ? (
                        <span className="font-medium text-gray-800">
                          {route.origin || "—"}
                        </span>
                      ) : (
                        <input
                          type="text"
                          value={route.origin || ""}
                          onChange={(e) =>
                            handleFieldChange(idx, "origin", e.target.value)
                          }
                          placeholder="e.g. Nagpur"
                          className="w-full px-2.5 py-1.5 text-xs text-gray-800 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#007aff] transition-all placeholder:text-gray-300"
                        />
                      )}
                    </td>

                    {/* Incoterm */}
                    <td className="py-2 px-3">
                      {isView ? (
                        <span className="font-semibold text-slate-700">
                          {route.incoterm || "—"}
                        </span>
                      ) : (
                        <select
                          value={route.incoterm || ""}
                          onChange={(e) =>
                            handleFieldChange(idx, "incoterm", e.target.value)
                          }
                          className="w-full px-2.5 py-1.5 text-xs text-gray-800 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#007aff] transition-all cursor-pointer font-medium"
                        >
                          <option value="">Select Incoterm</option>
                          {shipmentTypes && shipmentTypes.length > 0 ? (
                            shipmentTypes.map((st) => {
                              const code = getShipmentTypeShortForm(st) || st.code || st.name;
                              const label = st.name && st.name !== code
                                ? `${code} - ${st.name}`
                                : code;
                              return (
                                <option key={st.id || code} value={code}>
                                  {label}
                                </option>
                              );
                            })
                          ) : (
                            <>
                              <option value="FOB">FOB</option>
                              <option value="CFR">CFR</option>
                              <option value="CIF">CIF</option>
                              <option value="EXW">EXW</option>
                              <option value="FCA">FCA</option>
                              <option value="DAP">DAP</option>
                              <option value="DDP">DDP</option>
                            </>
                          )}
                        </select>
                      )}
                    </td>

                    {/* Destination */}
                    <td className="py-2 px-3">
                      {isView ? (
                        <span className="font-medium text-gray-800">
                          {route.destination || "—"}
                        </span>
                      ) : (
                        <input
                          type="text"
                          value={route.destination || ""}
                          onChange={(e) =>
                            handleFieldChange(idx, "destination", e.target.value)
                          }
                          placeholder="e.g. Qingdao"
                          className="w-full px-2.5 py-1.5 text-xs text-gray-800 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#007aff] transition-all placeholder:text-gray-300"
                        />
                      )}
                    </td>

                    {/* Freight Required (calculated automatically) */}
                    <td className="py-2 px-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide select-none ${
                          freightReq
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-gray-100 text-gray-500 border border-gray-200"
                        }`}
                        title={
                          freightReq
                            ? "Freight is required for this Incoterm (automatically evaluated)"
                            : "No freight required for this Incoterm (automatically evaluated)"
                        }
                      >
                        {freightReq ? "Yes" : "No"}
                      </span>
                    </td>

                    {/* Action */}
                    {!isView && (
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveRoute(idx)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Remove Route"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {error && <p className="text-[11px] text-red-500 font-medium">{error}</p>}

      {!isView && (
        <div className="flex items-center justify-between pt-0.5">
          <button
            type="button"
            onClick={handleAddRoute}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#007aff] hover:text-blue-700 hover:bg-blue-50/60 rounded-lg transition-colors cursor-pointer group"
          >
            <div className="h-4.5 w-4.5 rounded bg-blue-100/70 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
              <Plus className="h-3 w-3 text-[#007aff]" />
            </div>
            + Add Route
          </button>
          <span className="text-[10px] text-gray-400">
            Route format: Origin → Incoterm → Destination (Freight calculated automatically)
          </span>
        </div>
      )}
    </div>
  );
}

