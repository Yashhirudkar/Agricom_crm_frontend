"use client";
import React from "react";
import { Package, Plus, Trash2, AlertTriangle } from "lucide-react";
import { cleanNumberValue, formatInputVal, formatNumberDisplay } from "../utils/formatUtils";
import { isDivisible } from "../utils/scheduleUtils";

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
  productId: "", origin: "", quality: "", qtyPerCount: "", quantity: "", unitPrice: "", amount: 0,
  bagTypeId: "", packingTypeId: "", bagSpecificationId: "", marking: "", remarks: "",
});

function ItemField({ label, children, required, isView }) {
  return (
    <label className="min-w-0">
      <span className="block mb-1 text-[10px] font-semibold text-gray-500">
        {label}{required && !isView ? <span className="ml-0.5 text-red-500">*</span> : null}
      </span>
      {children}
    </label>
  );
}

export default function ItemsTable({ form, setForm, errors, masters, isView }) {
  const items = form.items || [];
  const currency = form.currencyCode || "";
  const currencySymbol = getCurrencySymbol(currency);
  const selectClass = "w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#007aff]/30 focus:border-[#007aff] bg-white";
  const inputClass = `${selectClass} disabled:bg-gray-50`;

  const addItem = () => setForm(f => ({ ...f, items: [...(f.items || []), emptyItem()] }));
  const removeItem = (idx) => setForm(f => ({ ...f, items: (f.items || []).filter((_, i) => i !== idx) }));
  const updateItem = (idx, field, value) => {
    setForm(f => {
      const next = [...(f.items || [])];
      next[idx] = { ...next[idx], [field]: value };
      const qty = parseFloat(field === "quantity" ? value : next[idx].quantity) || 0;
      const price = parseFloat(field === "unitPrice" ? value : next[idx].unitPrice) || 0;
      next[idx].amount = parseFloat((qty * price).toFixed(2));
      return { ...f, items: next };
    });
  };
  const totalQty = items.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0);
  const totalAmount = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  const numberField = (item, idx, field, placeholder, step = "any") => (
    <input
      type="number" min="0" step={step} value={formatInputVal(item[field])}
      onChange={e => updateItem(idx, field, e.target.value)}
      onBlur={() => updateItem(idx, field, cleanNumberValue(item[field]))}
      disabled={isView} className={inputClass} placeholder={placeholder}
    />
  );

  return (
    <div className="overflow-hidden bg-white border border-gray-100 shadow-xs rounded-2xl">
      <div className="flex items-center justify-between gap-2.5 px-5 py-3.5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center flex-shrink-0 rounded-lg h-7 w-7 bg-orange-50">
            <Package className="w-3.5 h-3.5 text-orange-500" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Product Items</h2>
            <p className="text-[10px] text-gray-400">
              {items.length} item{items.length !== 1 ? "s" : ""} · Total: {formatNumberDisplay(totalQty)} MT · {currency && <span className="font-semibold">{currencySymbol}</span>}{formatNumberDisplay(totalAmount)}
            </p>
          </div>
        </div>
        {!isView && <button type="button" onClick={addItem} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-[#007aff] bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100">
          <Plus className="w-3.5 h-3.5" /> Add Item
        </button>}
      </div>
      {errors.items && <p className="px-5 pt-3 text-[11px] text-red-500">{errors.items}</p>}
      {items.length === 0 ? (
        <div className="px-5 py-10 text-center"><Package className="mx-auto mb-2 w-8 h-8 text-gray-300" /><p className="text-xs font-medium text-gray-400">No items added. Click &quot;Add Item&quot; to begin.</p></div>
      ) : (
        <div className="p-4 space-y-3">
          {items.map((item, idx) => {
            const invalidQty = parseFloat(item.quantity) > 0 && parseFloat(item.qtyPerCount) > 0 && !isDivisible(item.quantity, item.qtyPerCount);
            return (
              <div key={item.id || idx} className="p-3 border border-gray-100 rounded-xl bg-gray-50/40">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-gray-500">Item {idx + 1}</span>
                  {!isView && <button type="button" onClick={() => removeItem(idx)} className="p-1 text-gray-400 rounded-lg hover:text-red-500 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></button>}
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  <ItemField label="Product" required isView={isView}><select value={item.productId || ""} onChange={e => updateItem(idx, "productId", e.target.value ? Number(e.target.value) : "")} disabled={isView} className={selectClass}><option value="">Select Product</option>{masters.products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></ItemField>
                  <ItemField label="Origin" isView={isView}><select value={item.origin || item.originCountry || ""} onChange={e => updateItem(idx, "origin", e.target.value)} disabled={isView} className={selectClass}><option value="">Country</option>{masters.countries.map(c => <option key={c.code || c.id || c.name || c} value={c.name || c.id || c}>{c.name || c}</option>)}</select></ItemField>
                  <ItemField label="Packing Type" required isView={isView}><select value={item.packingTypeId || ""} onChange={e => updateItem(idx, "packingTypeId", e.target.value ? Number(e.target.value) : "")} disabled={isView} className={selectClass}><option value="">Packing Type</option>{masters.packingTypes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></ItemField>
                  <ItemField label="Bag Type" required isView={isView}><select value={item.bagTypeId || ""} onChange={e => updateItem(idx, "bagTypeId", e.target.value ? Number(e.target.value) : "")} disabled={isView} className={selectClass}><option value="">Bag Type</option>{masters.bagTypes.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select></ItemField>
                  <ItemField label="Quality" required isView={isView}><input type="text" value={item.quality || ""} onChange={e => updateItem(idx, "quality", e.target.value)} disabled={isView} className={inputClass} placeholder="Quality" /></ItemField>
                </div>
                <div className="grid grid-cols-1 gap-3 mt-3 sm:grid-cols-2 lg:grid-cols-5">
                  <ItemField label="Bag Specification" isView={isView}><select value={item.bagSpecificationId || ""} onChange={e => updateItem(idx, "bagSpecificationId", e.target.value ? Number(e.target.value) : null)} disabled={isView} className={selectClass}><option value="">Bag Spec.</option>{masters.bagSpecifications.map(b => <option key={b.id} value={b.id}>{[(b.width && b.length) ? `${b.width}x${b.length}` : "", b.emptyBagWeight ? `${b.emptyBagWeight}g` : ""].filter(Boolean).join(" - ") || `Spec #${b.id}`}</option>)}</select></ItemField>
                  <ItemField label="Qty Per Count" required isView={isView}>{numberField(item, idx, "qtyPerCount", "0")}</ItemField>
                  <ItemField label="Qty (MT)" required isView={isView}>{numberField(item, idx, "quantity", "0", "1")}</ItemField>
                  <ItemField label="Unit Price" required isView={isView}>{numberField(item, idx, "unitPrice", "0", "0.01")}</ItemField>
                  <ItemField label="Marking" isView={isView}><input type="text" value={item.marking || ""} onChange={e => updateItem(idx, "marking", e.target.value)} disabled={isView} className={inputClass} placeholder="Marking" /></ItemField>
                </div>
                <div className="flex justify-end pt-3 mt-3 text-xs border-t border-gray-100">
                  <span className="mr-2 font-semibold text-gray-500">Amount:</span>
                  <span className="font-bold text-gray-800 tabular-nums">{currency && <span className="mr-1 text-[10px]">{currencySymbol}</span>}{formatNumberDisplay(item.amount)}</span>
                </div>
                {invalidQty && <div className="flex items-center gap-1.5 mt-2 text-[11px] font-bold text-red-600"><AlertTriangle className="w-3.5 h-3.5" /> Product Quantity ({item.quantity} MT) must be an exact multiple of Qty Per Count ({item.qtyPerCount} MT).</div>}
              </div>
            );
          })}
          <div className="flex justify-end gap-6 px-2 pt-2 text-xs font-semibold text-gray-600 border-t border-gray-100">
            <span>Total Qty: <b className="text-gray-900">{formatNumberDisplay(totalQty)} MT</b></span>
            <span>Total Amount: <b className="text-gray-900">{currency && currencySymbol}{formatNumberDisplay(totalAmount)}</b></span>
          </div>
        </div>
      )}
    </div>
  );
}
