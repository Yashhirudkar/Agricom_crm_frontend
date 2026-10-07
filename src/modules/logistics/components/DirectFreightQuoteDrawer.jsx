"use client";
import React, { useState, useEffect, useMemo } from "react";
import { X, Save, AlertCircle, PackageOpen, Plus } from "lucide-react";
import SearchablePartnerSelect from "@/components/common/SearchablePartnerSelect";
import axiosClient from "@/lib/axios";
import Select from "react-select";
import { useCurrencyMaster } from "@/modules/enquiries/hooks/useCurrencyMaster";

export default function DirectFreightQuoteDrawer({
  isOpen,
  onClose,
  onSave,
  quote = null,
}) {
  const [sellerId, setSellerId] = useState("");
  const [productId, setProductId] = useState("");
  const [loadingPoint, setLoadingPoint] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [transitDays, setTransitDays] = useState("");
  const [freightAmount, setFreightAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [validityDate, setValidityDate] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [productOptionsList, setProductOptionsList] = useState([]);
  const { data: currencies = [], isLoading: currenciesLoading } = useCurrencyMaster();

  const currencyOptions = useMemo(() => {
    return currencies.map((c) => ({
      value: c.code,
      label: `${c.code} - ${c.name}`
    }));
  }, [currencies]);

  const selectedCurrencyOption = useMemo(() => {
    if (!currency) return null;
    const found = currencies.find(c => c.code === currency);
    return found ? { value: found.code, label: `${found.code} - ${found.name}` } : { value: currency, label: currency };
  }, [currency, currencies]);

  const reactSelectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "36px",
      height: "36px",
      borderRadius: "0.75rem",
      borderColor: state.isFocused ? "#4f46e5" : "#e2e8f0",
      boxShadow: state.isFocused ? "0 0 0 1px #4f46e5" : "none",
      fontSize: "0.75rem",
      fontWeight: "700",
      backgroundColor: "white",
      "&:hover": { borderColor: state.isFocused ? "#4f46e5" : "#cbd5e1" },
    }),
    valueContainer: (base) => ({ ...base, padding: "0 10px" }),
    input: (base) => ({ ...base, margin: 0, padding: 0 }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (base) => ({ ...base, padding: "6px" }),
    singleValue: (base) => ({ ...base, color: "#0f172a" }),
    option: (base, state) => ({
      ...base,
      fontSize: "0.75rem",
      fontWeight: "600",
      backgroundColor: state.isSelected ? "#4f46e5" : state.isFocused ? "#eef2ff" : "white",
      color: state.isSelected ? "white" : "#1e293b",
      cursor: "pointer",
      "&:active": { backgroundColor: "#e0e7ff" },
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "0.75rem",
      overflow: "hidden",
      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      zIndex: 9999,
      width: "max-content",
      minWidth: "100%",
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };

  useEffect(() => {
    if (isOpen) {
      axiosClient.get("/masters/products/options", { params: { limit: 100, isActive: true } })
        .then(res => setProductOptionsList(res.data?.data || []))
        .catch(err => console.warn(err));
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (quote && quote.id) {
        setSellerId(quote.sellerId || "");
        setProductId(quote.productId || "");
        setLoadingPoint(quote.loadingPoint || "");
        setDestination(quote.destination || "");
        setVehicleType(quote.vehicleType || "");
        setTransitDays(quote.transitDays || "");
        setFreightAmount(quote.freightAmount || "");
        setCurrency(quote.currency || "INR");
        setValidityDate(quote.validityDate ? quote.validityDate.split("T")[0] : "");
      } else {
        setSellerId("");
        setProductId("");
        setLoadingPoint("");
        setDestination("");
        setVehicleType("");
        setTransitDays("");
        setFreightAmount("");
        setCurrency("INR");
        setValidityDate("");
      }
      setError("");
    }
  }, [isOpen, quote]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        isDirect: true,
        ...(productId && { productId: Number(productId) }),
        ...(loadingPoint.trim() && { loadingPoint: loadingPoint.trim() }),
        ...(destination.trim() && { destination: destination.trim() }),
        ...(sellerId && { sellerId: Number(sellerId) }),
        ...(vehicleType.trim() && { vehicleType: vehicleType.trim() }),
        transitDays: transitDays ? parseInt(transitDays, 10) : 0,
        ...(freightAmount && { freightAmount: parseFloat(freightAmount) }),
        currency,
        validityDate: validityDate || new Date().toISOString().split("T")[0],
        quoteDate: new Date().toISOString().split("T")[0],
      };

      await onSave(payload);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save direct freight quote.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isEditing = quote && quote.id;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-800/40 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-right">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-sm shadow-indigo-500/20">
              <PackageOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-[13px] font-extrabold text-slate-900 uppercase tracking-tight">
                {isEditing ? `Revise Direct Quote (${quote.quoteNumber})` : "New Direct Quote"}
              </h3>
              <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Single freight quotation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            
            {error && (
              <div className="flex items-center gap-2.5 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-xs font-bold">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Product</label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 bg-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="">Select Product...</option>
                {productOptionsList.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Origin / Loading</label>
                <input
                  type="text"
                  value={loadingPoint}
                  onChange={(e) => setLoadingPoint(e.target.value)}
                  placeholder="e.g. Mundra Port"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Destination</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Dubai"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <SearchablePartnerSelect
                label="Transport Partner"
                value={sellerId}
                onChange={setSellerId}
                roleNames={["Transport", "Freight Forwarder", "Shipping Line"]}
                mode="entity"
                placeholder="Search Partner..."
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Equipment / Vehicle</label>
              <input
                type="text"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                placeholder="e.g. 20 FT Container, 32 FT Truck"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Transit Days</label>
                <input
                  type="number"
                  value={transitDays}
                  onChange={(e) => setTransitDays(e.target.value)}
                  placeholder="e.g. 15"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:border-indigo-500 tabular-nums"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Valid Till</label>
                <input
                  type="date"
                  value={validityDate}
                  onChange={(e) => setValidityDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Amount</label>
              <div className="flex gap-2">
                <div className="w-[130px]">
                  <Select
                    isClearable
                    options={currencyOptions}
                    value={selectedCurrencyOption}
                    onChange={(opt) => setCurrency(opt ? opt.value : "INR")}
                    styles={reactSelectStyles}
                    placeholder="Currency"
                    formatOptionLabel={(option, { context }) => (
                      context === 'value' ? option.value : option.label
                    )}
                    menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                    menuPosition="fixed"
                    className="text-xs"
                    isLoading={currenciesLoading}
                  />
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={freightAmount}
                  onChange={(e) => setFreightAmount(e.target.value)}
                  placeholder="Total Amount"
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-900 bg-white focus:outline-none focus:border-indigo-500 tabular-nums"
                />
              </div>
            </div>
            
          </div>

          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-sm shadow-indigo-500/30 cursor-pointer"
            >
              {loading ? (
                <div className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              {loading ? "Saving..." : isEditing ? "Update Quote" : "Save Quote"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
