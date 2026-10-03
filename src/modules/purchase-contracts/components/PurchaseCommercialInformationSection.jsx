"use client";
import React, { useRef } from "react";
import { DollarSign, ChevronDown, CreditCard, CalendarDays } from "lucide-react";

export default function PurchaseCommercialInformationSection({
  contract,
  summary,
  form,
  setForm,
  masters = {},
  isView = false,
}) {
  const lbl = "block text-[11px] font-semibold text-gray-500 mb-1 uppercase tracking-wider";
  const inp =
    "w-full text-xs bg-gray-50/60 border border-gray-200 rounded-xl p-2.5 font-medium text-gray-900 focus:bg-white focus:border-[#007aff] focus:ring-2 focus:ring-[#007aff]/20 focus:outline-none transition-all disabled:opacity-75 disabled:bg-gray-100";

  const paymentDueDateRef = useRef(null);
  const isManual = contract?.purchaseType === "MTT" || !contract?.salesContractId;
  const productsMaster = masters?.products || [];
  const paymentTermsMaster = masters?.paymentTerms || [];
  const brokersMaster = masters?.brokers || masters?.partners || [];

  const existingProducts = summary?.productSummary || contract?.items || contract?.salesContract?.items || [];
  const defaultProductName = existingProducts.map((p) => p.product?.name || p.productName || "Commodity").join(", ") || "";
  const defaultPaymentTermName = summary?.commercialInfo?.paymentTerm?.name || contract?.salesContract?.paymentTerm?.name || "";

  // Master-driven dropdown option builder
  const getDropdownOptions = (masterList, currentValue) => {
    let options = (masterList && Array.isArray(masterList))
      ? masterList.map((item) => ({
        id: item.id || item.code || item.name || item,
        name: item.name || item.code || item,
        code: item.code,
      }))
      : [];

    if (currentValue) {
      const existingOpt = options.find(
        (opt) =>
          opt.name === currentValue ||
          opt.id === currentValue ||
          (opt.code && opt.code === currentValue) ||
          String(opt.id) === String(currentValue)
      );
      if (!existingOpt) {
        options = [{ id: currentValue, name: currentValue }, ...options];
      }
    }
    return options;
  };

  const packingOptions = getDropdownOptions(masters?.packingTypes, form.packing);
  const bagTypeOptions = getDropdownOptions(masters?.bagTypes, form.bagType);
  const bagSpecMasterList = masters?.bagSpecifications?.map((b) => {
    const label = [(b.width && b.length) ? `${b.width}x${b.length}` : '', b.emptyBagWeight ? `${b.emptyBagWeight}g` : ''].filter(Boolean).join(' - ') || `Spec #${b.id}`;
    return { id: b.id, name: label };
  });
  const bagSpecOptions = getDropdownOptions(bagSpecMasterList, form.bagSpec);
  const stitchingOptions = getDropdownOptions(masters?.stitchingTypes, form.stitching);
  const markingOptions = getDropdownOptions(masters?.markingTypes, form.marking);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      {/* Section Header */}
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2.5">
        <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
          <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900">Commercial Information</h2>
          <p className="text-[10px] text-gray-400">Product specs, incoterms, payment conditions, and broker details</p>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Row 1: Product, Quantity, Price, Currency, Quality, Packing */}
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
          <div>
            <label className={lbl}>Product *</label>
            {isManual && productsMaster.length > 0 ? (
              <div className="relative">
                <select
                  value={form.productId || ""}
                  onChange={(e) => {
                    const pId = Number(e.target.value);
                    const pObj = productsMaster.find((p) => p.id === pId);
                    
                    let newQuality = "";
                    if (pObj) {
                      newQuality = [pObj.qualitySubType, pObj.specification].filter(Boolean).join(" - ");
                    }

                    setForm((f) => {
                      const updatedItems = [...(f.items || [])];
                      if (updatedItems.length === 0) {
                        updatedItems.push({
                          productId: pId,
                          productName: pObj?.name || "",
                          quantity: f.quantity || 0,
                          productQuality: newQuality || f.productQuality || "",
                          packing: f.packing || "",
                        });
                      } else {
                        updatedItems[0] = {
                          ...updatedItems[0],
                          productId: pId,
                          productName: pObj?.name || "",
                          productQuality: newQuality || updatedItems[0].productQuality || "",
                        };
                      }
                      return {
                        ...f,
                        productId: pId || null,
                        productName: pObj?.name || "",
                        productQuality: newQuality || f.productQuality || "",
                        items: updatedItems,
                      };
                    });
                  }}
                  disabled={isView}
                  className={`${inp} appearance-none pr-8 font-bold text-gray-900`}
                >
                  <option value="">Select Product Item</option>
                  {productsMaster.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.code ? `(${p.code})` : ""}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
              </div>
            ) : (
              <input
                type="text"
                value={form.productName || defaultProductName}
                onChange={(e) => setForm((f) => ({ ...f, productName: e.target.value }))}
                readOnly={!isManual}
                disabled={isView}
                className={`${inp} ${!isManual ? "bg-gray-50" : ""} font-bold text-gray-900`}
              />
            )}
          </div>

          <div>
            <label className={lbl}>Qty (MT) *</label>
            <input
              type="number"
              step="0.01"
              value={form.quantity ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                setForm((f) => {
                  const updatedItems = [...(f.items || [])];
                  if (updatedItems.length > 0) {
                    updatedItems[0] = { ...updatedItems[0], quantity: parseFloat(val) || 0 };
                  }
                  return { ...f, quantity: val, items: updatedItems };
                });
              }}
              disabled={isView}
              placeholder="e.g. 200"
              className={`${inp} font-bold text-gray-900 tabular-nums`}
            />
          </div>

          <div>
            <label className={lbl}>Price *</label>
            <input
              type="number"
              step="0.01"
              value={form.ratePerMt ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                setForm((f) => {
                  const updatedItems = [...(f.items || [])];
                  if (updatedItems.length > 0) {
                    updatedItems[0] = { ...updatedItems[0], ratePerMt: parseFloat(val) || 0 };
                  }
                  return { ...f, ratePerMt: val, items: updatedItems };
                });
              }}
              disabled={isView}
              placeholder="e.g. 500"
              className={`${inp} font-bold text-gray-900 tabular-nums`}
            />
          </div>

          <div>
            <label className={lbl}>Currency *</label>
            <div className="relative">
              <select
                value={form.currencyCode || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm((f) => {
                    const updatedItems = [...(f.items || [])];
                    if (updatedItems.length > 0) {
                      updatedItems[0] = { ...updatedItems[0], currencyCode: val };
                    }
                    return { ...f, currencyCode: val, items: updatedItems };
                  });
                }}
                disabled={isView}
                className={`${inp} appearance-none pr-8 font-bold text-gray-900`}
              >
                <option value="">Select</option>
                {(masters?.currencies || [
                  { code: 'USD' }, { code: 'EUR' }, { code: 'INR' }, { code: 'CNY' }, { code: 'GBP' }
                ]).map(c => (
                  <option key={c.code} value={c.code}>{c.code}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
            </div>
          </div>

          <div>
            <label className={lbl}>Product Quality</label>
            <input
              type="text"
              value={form.productQuality || ""}
              onChange={(e) => setForm((f) => ({ ...f, productQuality: e.target.value }))}
              disabled={isView}
              placeholder="e.g. Export Grade A Specification"
              className={`${inp} font-medium text-gray-900`}
            />
          </div>

          <div>
            <label className={lbl}>Packing</label>
            <div className="relative">
              <select
                value={form.packing || ""}
                onChange={(e) => setForm((f) => ({ ...f, packing: e.target.value }))}
                disabled={isView}
                className={`${inp} appearance-none pr-8 font-medium text-gray-900`}
              >
                <option value="">Select Packing</option>
                {packingOptions.map((opt) => (
                  <option key={opt.id} value={opt.name}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Row 2: Bag Type, Bag Spec, Stitching, Marking */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className={lbl}>Bag Type</label>
            <div className="relative">
              <select
                value={form.bagType || ""}
                onChange={(e) => setForm((f) => ({ ...f, bagType: e.target.value }))}
                disabled={isView}
                className={`${inp} appearance-none pr-8 font-medium text-gray-900`}
              >
                <option value="">Select Bag Type</option>
                {bagTypeOptions.map((opt) => (
                  <option key={opt.id} value={opt.name}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
            </div>
          </div>

          <div>
            <label className={lbl}>Bag Spec</label>
            <div className="relative">
              <select
                value={form.bagSpec || ""}
                onChange={(e) => setForm((f) => ({ ...f, bagSpec: e.target.value }))}
                disabled={isView}
                className={`${inp} appearance-none pr-8 font-medium text-gray-900`}
              >
                <option value="">Select Bag Spec</option>
                {bagSpecOptions.map((opt) => (
                  <option key={opt.id} value={opt.name}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
            </div>
          </div>

          <div>
            <label className={lbl}>Stitching</label>
            <div className="relative">
              <select
                value={form.stitching || ""}
                onChange={(e) => setForm((f) => ({ ...f, stitching: e.target.value }))}
                disabled={isView}
                className={`${inp} appearance-none pr-8 font-medium text-gray-900`}
              >
                <option value="">Select Stitching</option>
                {stitchingOptions.map((opt) => (
                  <option key={opt.id} value={opt.name}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
            </div>
          </div>

          <div>
            <label className={lbl}>Marking</label>
            <div className="relative">
              <select
                value={form.marking || ""}
                onChange={(e) => setForm((f) => ({ ...f, marking: e.target.value }))}
                disabled={isView}
                className={`${inp} appearance-none pr-8 font-medium text-gray-900`}
              >
                <option value="">Select Marking</option>
                {markingOptions.map((opt) => (
                  <option key={opt.id} value={opt.name}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Row 3: Delivery Place & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-gray-100">
          <div>
            <label className={lbl}>Delivery Place</label>
            <input
              type="text"
              value={form.deliveryPlace || ""}
              onChange={(e) => setForm((f) => ({ ...f, deliveryPlace: e.target.value }))}
              disabled={isView}
              className={`${inp}`}
              placeholder="e.g. Port of Loading / Location"
            />
          </div>

          <div>
            <label className={lbl}>Delivery / Dispatch Date (From)</label>
            <input
              type="date"
              value={form.deliveryDate || ""}
              onChange={(e) => setForm((f) => ({ ...f, deliveryDate: e.target.value }))}
              disabled={isView}
              className={`${inp}`}
            />
          </div>

          <div>
            <label className={lbl}>Delivery / Dispatch Date (To)</label>
            <input
              type="date"
              value={form.deliveryToDate || ""}
              onChange={(e) => setForm((f) => ({ ...f, deliveryToDate: e.target.value }))}
              disabled={isView}
              className={`${inp}`}
            />
          </div>
        </div>

        {/* Payment Terms Sub-Section */}
        <div className="bg-blue-50/40 rounded-xl border border-blue-100 overflow-hidden">
          {/* Sub-header */}
          <div className="px-4 py-2.5 border-b border-blue-100 flex items-center gap-2">
            <div className="h-5 w-5 rounded-md bg-blue-100 flex items-center justify-center flex-shrink-0">
              <CreditCard className="h-3 w-3 text-blue-600" />
            </div>
            <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Payment Terms</span>
          </div>

          <div className="p-4 flex flex-col gap-4">

            {/* Row 1: Payment Terms text — full width */}
            <div>
              <label className={lbl} htmlFor="pc-paymentTermsText">
                Payment Terms Condition
              </label>
              <input
                id="pc-paymentTermsText"
                type="text"
                value={form.paymentTermsText || ""}
                onChange={(e) => setForm((f) => ({ ...f, paymentTermsText: e.target.value }))}
                disabled={isView}
                placeholder="e.g. 100% Before Unloading, 100% CAD Against Documents, 20% Advance + 80% Before Dispatch"
                className={inp}
              />
            </div>

            {/* Row 2: Advance / Balance (auto) / Due Date / Unloading Date */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">

              {/* Advance % */}
              <div>
                <label className={lbl} htmlFor="pc-advancePercent">Advance (%)</label>
                <input
                  id="pc-advancePercent"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={form.advancePercent ?? ""}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const val = raw === "" ? "" : Math.min(100, Math.max(0, Number(raw)));
                    const balance = val === "" ? "" : Math.max(0, 100 - Number(val));
                    setForm((f) => ({ ...f, advancePercent: val, balancePercent: balance }));
                  }}
                  disabled={isView}
                  placeholder="Enter Advance %"
                  className={inp}
                />
              </div>

              {/* Balance % — read-only, auto-calculated as 100 - Advance */}
              <div>
                <label className={lbl} htmlFor="pc-balancePercent">
                  Balance (%)
                  <span className="ml-1.5 text-[9px] font-normal text-gray-400 normal-case tracking-normal">auto</span>
                </label>
                <input
                  id="pc-balancePercent"
                  type="number"
                  readOnly
                  tabIndex={-1}
                  value={form.balancePercent ?? ""}
                  className={`${inp} !bg-gray-100 text-gray-500 cursor-not-allowed`}
                  style={{ WebkitUserSelect: "none" }}
                />
              </div>

              {/* Payment Due Date */}
              <div>
                <label className={lbl} htmlFor="pc-paymentDueDate">
                  Payment Due Date
                  <span className="ml-1 text-[10px] font-normal text-gray-500">(Tentative)</span>
                </label>
                <div className="relative">
                  <input
                    id="pc-paymentDueDate"
                    ref={paymentDueDateRef}
                    type="date"
                    value={form.paymentDueDate || ""}
                    onChange={(e) => setForm((f) => ({ ...f, paymentDueDate: e.target.value }))}
                    onClick={() => paymentDueDateRef.current?.showPicker?.()}
                    disabled={isView}
                    className={`${inp} pr-9 cursor-pointer`}
                  />
                  <CalendarDays
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 cursor-pointer hover:text-blue-500 transition-colors"
                    onClick={() => !isView && paymentDueDateRef.current?.showPicker?.()}
                  />
                </div>
              </div>

              {/* Unloading Date */}
              <div>
                <label className={lbl} htmlFor="pc-unloadingDate">Unloading Date</label>
                <div className="relative">
                  <input
                    id="pc-unloadingDate"
                    ref={useRef()}
                    type="date"
                    value={form.unloadingDate || ""}
                    onChange={(e) => setForm((f) => ({ ...f, unloadingDate: e.target.value }))}
                    disabled={isView}
                    className={`${inp}`}
                  />
                </div>
              </div>

            </div>

            {/* Payment Terms Master Dropdown (optional override for MTT) */}
            {isManual && paymentTermsMaster.length > 0 && (
              <div className="pt-3 border-t border-blue-100">
                <label className={lbl}>Payment Term (Master)</label>
                <div className="relative">
                  <select
                    value={form.paymentTermId || ""}
                    onChange={(e) => {
                      const ptId = Number(e.target.value);
                      const ptObj = paymentTermsMaster.find((p) => p.id === ptId);
                      setForm((f) => ({
                        ...f,
                        paymentTermId: ptId || null,
                        paymentTermName: ptObj?.name || "",
                        paymentTermsText: f.paymentTermsText || ptObj?.name || "",
                      }));
                    }}
                    disabled={isView}
                    className={`${inp} appearance-none pr-8 font-semibold text-gray-800`}
                  >
                    <option value="">Select from Master (optional)</option>
                    {paymentTermsMaster.map((pt) => (
                      <option key={pt.id} value={pt.id}>
                        {pt.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Selecting a master term will auto-fill the Payment Terms text above if empty.</p>
              </div>
            )}

          </div>
        </div>

        {/* Row 4: Broker / Agent & Broker Commission */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2 border-t border-gray-100">
          <div>
            <label className={lbl}>Broker / Agent</label>
            {isManual && brokersMaster.length > 0 ? (
              <div className="relative">
                <select
                  value={form.brokerId || ""}
                  onChange={(e) => {
                    const brId = Number(e.target.value);
                    const brObj = brokersMaster.find((b) => b.id === brId);
                    setForm((f) => ({
                      ...f,
                      brokerId: brId || null,
                      brokerName: brObj?.entityName || brObj?.name || "",
                    }));
                  }}
                  disabled={isView}
                  className={`${inp} appearance-none pr-8 font-medium text-gray-900`}
                >
                  <option value="">Select Broker</option>
                  {brokersMaster.map((br) => (
                    <option key={br.id} value={br.id}>
                      {br.entityName || br.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
              </div>
            ) : (
              <input
                type="text"
                value={form.brokerName || ""}
                onChange={(e) => setForm((f) => ({ ...f, brokerName: e.target.value }))}
                disabled={isView}
                className={`${inp} font-medium text-gray-900`}
                placeholder="Enter Broker Name"
              />
            )}
          </div>

          <div>
            <label className={lbl}>Broker Commission</label>
            <input
              type="text"
              value={form.brokerCommission || ""}
              onChange={(e) => setForm((f) => ({ ...f, brokerCommission: e.target.value }))}
              disabled={isView}
              className={`${inp} font-medium text-gray-900`}
              placeholder="e.g. 1.00 %"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
