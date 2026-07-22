"use client";
import React from "react";
import { Package, Plus, Trash2, ChevronDown } from "lucide-react";

function getCurrencySymbol(code) {
  if (!code) return "";
  try {
    return (0).toLocaleString("en", {
      style: "currency",
      currency: code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).replace(/\d/g, "").trim();
  } catch {
    return code;
  }
}

const emptyItem = () => ({
  productId: "", quantity: "", unitPrice: "", amount: 0,
  bagTypeId: "", packingTypeId: "", bagSpecificationId: "",
  marking: "", remarks: "",
});

export default function ItemsTable({ form, setForm, errors, masters, isView }) {
  const items = form.items || [];
  const currency = form.currencyCode || "";
  const currencySymbol = getCurrencySymbol(currency);

  const addItem = () => setForm(f => ({ ...f, items: [...(f.items || []), emptyItem()] }));

  const removeItem = (idx) => setForm(f => ({
    ...f,
    items: (f.items || []).filter((_, i) => i !== idx),
  }));

  const updateItem = (idx, field, value) => {
    setForm(f => {
      const items = [...(f.items || [])];
      items[idx] = { ...items[idx], [field]: value };
      // Recalculate amount
      const qty = parseFloat(field === "quantity" ? value : items[idx].quantity) || 0;
      const price = parseFloat(field === "unitPrice" ? value : items[idx].unitPrice) || 0;
      items[idx].amount = parseFloat((qty * price).toFixed(2));
      return { ...f, items };
    });
  };

  const totalQty = items.reduce((s, i) => s + (parseFloat(i.quantity) || 0), 0);
  const totalAmt = items.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);

  const selCls = "w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#007aff]/30 focus:border-[#007aff] bg-white appearance-none";
  const inpCls = "w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#007aff]/30 focus:border-[#007aff] bg-white";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
            <Package className="h-3.5 w-3.5 text-orange-500" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Product Items</h2>
            <p className="text-[10px] text-gray-400">{items.length} item{items.length !== 1 ? "s" : ""} · Total: {totalQty.toLocaleString("en-IN")} MT · {currency && <span className="font-semibold">{currencySymbol}</span>}{totalAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
        {!isView && (
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-[#007aff] bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Add Item
          </button>
        )}
      </div>

      {errors.items && <p className="text-[11px] text-red-500 px-5 pt-3">{errors.items}</p>}

      {items.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <Package className="h-8 w-8 text-gray-300 mx-auto mb-2" />
          <p className="text-xs text-gray-400 font-medium">No items added. Click &quot;Add Item&quot; to begin.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {[
                  { label: "#", req: false },
                  { label: "Product", req: true },
                  { label: "Origin", req: false },
                  { label: "Packing Type", req: true },
                  { label: "Bag Type", req: true },
                  { label: "Bag Spec.", req: false },
                  { label: "Qty (MT)", req: true },
                  { label: "Unit Price", req: true },
                  { label: currency ? `Amount (${currencySymbol})` : "Amount", req: false },
                  { label: "Marking", req: false },
                  ...(!isView ? [{ label: "", req: false }] : []),
                ].map((h, i) => (
                  <th key={i} className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 whitespace-nowrap">
                    {h.label}{h.req && !isView ? <span className="text-red-500 ml-0.5">*</span> : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50">
                  <td className="px-3 py-2 text-gray-400 font-semibold">{idx + 1}</td>
                  <td className="px-3 py-2 min-w-[140px]">
                    <div className="relative">
                      <select value={item.productId || ""} onChange={e => updateItem(idx, "productId", e.target.value ? Number(e.target.value) : "")} disabled={isView} className={selCls}>
                        <option value="">Select Product</option>
                        {masters.products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                  </td>
                  <td className="px-3 py-2 min-w-[130px]">
                    <div className="relative">
                      <select value={item.originCountryId || ""} onChange={e => updateItem(idx, "originCountryId", e.target.value ? Number(e.target.value) : "")} disabled={isView} className={selCls}>
                        <option value="">Country</option>
                        {masters.countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  </td>
                  <td className="px-3 py-2 min-w-[130px]">
                    <div className="relative">
                      <select value={item.packingTypeId || ""} onChange={e => updateItem(idx, "packingTypeId", e.target.value ? Number(e.target.value) : "")} disabled={isView} className={selCls}>
                        <option value="">Packing Type</option>
                        {masters.packingTypes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                  </td>
                  <td className="px-3 py-2 min-w-[120px]">
                    <div className="relative">
                      <select value={item.bagTypeId || ""} onChange={e => updateItem(idx, "bagTypeId", e.target.value ? Number(e.target.value) : "")} disabled={isView} className={selCls}>
                        <option value="">Bag Type</option>
                        {masters.bagTypes.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                    </div>
                  </td>
                  <td className="px-3 py-2 min-w-[130px]">
                    <div className="relative">
                      <select value={item.bagSpecificationId || ""} onChange={e => updateItem(idx, "bagSpecificationId", e.target.value ? Number(e.target.value) : null)} disabled={isView} className={selCls}>
                        <option value="">Bag Spec.</option>
                        {masters.bagSpecifications.map(b => {
                          const label = [
                            (b.width && b.length) ? `${b.width}x${b.length}` : '',
                            b.emptyBagWeight ? `${b.emptyBagWeight}g` : ''
                          ].filter(Boolean).join(' - ') || `Spec #${b.id}`;
                          return <option key={b.id} value={b.id}>{label}</option>;
                        })}
                      </select>
                    </div>
                  </td>
                  <td className="px-3 py-2 min-w-[90px]">
                    <input type="number" min="0" step="0.01" value={item.quantity || ""} onChange={e => updateItem(idx, "quantity", e.target.value)} disabled={isView} className={inpCls} placeholder="0.00" />
                  </td>
                  <td className="px-3 py-2 min-w-[90px]">
                    <input type="number" min="0" step="0.01" value={item.unitPrice || ""} onChange={e => updateItem(idx, "unitPrice", e.target.value)} disabled={isView} className={inpCls} placeholder="0.00" />
                  </td>
                  <td className="px-3 py-2 min-w-[100px]">
                    <span className="font-semibold text-gray-800 tabular-nums flex items-center">
                      {currency && (
                        <span className="mr-1 text-[10px] font-medium text-gray-900">
                          {currencySymbol}
                        </span>
                      )}
                      <span>
                        {Number(item.amount || 0).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </span>
                  </td>
                  <td className="px-3 py-2 min-w-[100px]">
                    <input type="text" value={item.marking || ""} onChange={e => updateItem(idx, "marking", e.target.value)} disabled={isView} className={inpCls} placeholder="Marking" />
                  </td>
                  {!isView && (
                    <td className="px-3 py-2">
                      <button type="button" onClick={() => removeItem(idx)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 border-t border-gray-100 font-semibold">
                <td colSpan={6} className="px-3 py-2.5 text-right text-xs text-gray-600">Total</td>
                <td className="px-3 py-2.5 text-xs tabular-nums text-gray-900">{totalQty.toLocaleString("en-IN")}</td>
                <td className="px-3 py-2.5"></td>
                <td className="px-3 py-2.5 text-xs tabular-nums text-gray">{currency && <span className="text-gray-900 font-medium text-[10px] mr-0.5">{currencySymbol}</span>}{totalAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
