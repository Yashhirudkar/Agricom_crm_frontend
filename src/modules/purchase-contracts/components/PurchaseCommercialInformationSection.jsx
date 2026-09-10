"use client";
import React from "react";
import { DollarSign, ChevronDown } from "lucide-react";

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
  const incotermOptions = getDropdownOptions(masters?.shipmentTypes, form.incoterm);

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
        {/* Row 1: Product, Quantity, Quality, Packing */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className={lbl}>Product *</label>
            {isManual && productsMaster.length > 0 ? (
              <div className="relative">
                <select
                  value={form.productId || ""}
                  onChange={(e) => {
                    const pId = Number(e.target.value);
                    const pObj = productsMaster.find((p) => p.id === pId);
                    setForm((f) => {
                      const updatedItems = [...(f.items || [])];
                      if (updatedItems.length === 0) {
                        updatedItems.push({
                          productId: pId,
                          productName: pObj?.name || "",
                          quantity: f.quantity || 0,
                          productQuality: f.productQuality || "",
                          packing: f.packing || "",
                        });
                      } else {
                        updatedItems[0] = {
                          ...updatedItems[0],
                          productId: pId,
                          productName: pObj?.name || "",
                        };
                      }
                      return {
                        ...f,
                        productId: pId || null,
                        productName: pObj?.name || "",
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

        {/* Row 3: Incoterms, Delivery Place & Date, Payment Terms */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2 border-t border-gray-100">
          <div>
            <label className={lbl}>Shipment Type / Incoterm</label>
            <div className="relative">
              <select
                value={
                  incotermOptions.find(
                    (opt) =>
                      opt.name === form.incoterm ||
                      opt.code === form.incoterm ||
                      String(opt.id) === String(form.incoterm)
                  )?.name || form.incoterm || ""
                }
                onChange={(e) => setForm((f) => ({ ...f, incoterm: e.target.value }))}
                disabled={isView}
                className={`${inp} appearance-none pr-8 font-semibold text-gray-800`}
              >
                <option value="">Select Incoterm</option>
                {incotermOptions.map((opt) => (
                  <option key={opt.id || opt.name} value={opt.name}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
            </div>
          </div>

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
            <label className={lbl}>Delivery / Dispatch Date</label>
            <input
              type="date"
              value={form.deliveryDate || ""}
              onChange={(e) => setForm((f) => ({ ...f, deliveryDate: e.target.value }))}
              disabled={isView}
              className={`${inp}`}
            />
          </div>

          <div>
            <label className={lbl}>Payment Terms</label>
            {isManual && paymentTermsMaster.length > 0 ? (
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
                    }));
                  }}
                  disabled={isView}
                  className={`${inp} appearance-none pr-8 font-semibold text-gray-800`}
                >
                  <option value="">Select Payment Terms</option>
                  {paymentTermsMaster.map((pt) => (
                    <option key={pt.id} value={pt.id}>
                      {pt.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
              </div>
            ) : (
              <input
                type="text"
                value={form.paymentTermName || defaultPaymentTermName}
                onChange={(e) => setForm((f) => ({ ...f, paymentTermName: e.target.value }))}
                readOnly={!isManual}
                disabled={isView}
                className={`${inp} ${!isManual ? "bg-gray-50" : ""} font-semibold text-gray-800`}
              />
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
