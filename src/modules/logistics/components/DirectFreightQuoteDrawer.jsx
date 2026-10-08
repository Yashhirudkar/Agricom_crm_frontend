"use client";
import React, { useState, useEffect, useMemo } from "react";
import { X, Save, AlertCircle, PackageOpen, Plus, Trash2 } from "lucide-react";
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
  const [productId, setProductId] = useState("");
  
  const [routes, setRoutes] = useState([
    {
      origin: "",
      destination: "",
      rates: [
        {
          partnerId: "",
          equipment: "",
          transitDays: "",
          currency: "INR",
          amount: "",
          validTill: "",
          status: "Active"
        }
      ]
    }
  ]);

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
        setProductId(quote.productId || "");
        if (quote.freightRoutes && quote.freightRoutes.length > 0) {
          setRoutes(quote.freightRoutes.map(r => ({
            origin: r.origin || "",
            destination: r.destination || "",
            rates: r.rates && r.rates.length > 0 ? r.rates.map(rate => ({
              partnerId: rate.partnerId || "",
              equipment: rate.equipment || "",
              transitDays: rate.transitDays || "",
              currency: rate.currency || "INR",
              amount: rate.amount || "",
              validTill: rate.validTill ? rate.validTill.split("T")[0] : "",
              status: rate.status || "Active"
            })) : [
              { partnerId: "", equipment: "", transitDays: "", currency: "INR", amount: "", validTill: "", status: "Active" }
            ]
          })));
        } else {
          // Legacy mapping
          setRoutes([{
            origin: quote.loadingPoint || "",
            destination: quote.destination || "",
            rates: [{
              partnerId: quote.sellerId || "",
              equipment: quote.vehicleType || "",
              transitDays: quote.transitDays || "",
              currency: quote.currency || "INR",
              amount: quote.freightAmount || "",
              validTill: quote.validityDate ? quote.validityDate.split("T")[0] : "",
              status: "Active"
            }]
          }]);
        }
      } else {
        setProductId("");
        setRoutes([
          {
            origin: "",
            destination: "",
            rates: [
              {
                partnerId: "",
                equipment: "",
                transitDays: "",
                currency: "INR",
                amount: "",
                validTill: "",
                status: "Active"
              }
            ]
          }
        ]);
      }
      setError("");
    }
  }, [isOpen, quote]);

  const handleAddRoute = () => {
    setRoutes([...routes, {
      origin: "",
      destination: "",
      rates: [{ partnerId: "", equipment: "", transitDays: "", currency: "INR", amount: "", validTill: "", status: "Active" }]
    }]);
  };

  const handleRemoveRoute = (index) => {
    const newRoutes = [...routes];
    newRoutes.splice(index, 1);
    setRoutes(newRoutes);
  };

  const handleAddRate = (routeIndex) => {
    const newRoutes = [...routes];
    newRoutes[routeIndex].rates.push({
      partnerId: "", equipment: "", transitDays: "", currency: "INR", amount: "", validTill: "", status: "Active"
    });
    setRoutes(newRoutes);
  };

  const handleRemoveRate = (routeIndex, rateIndex) => {
    const newRoutes = [...routes];
    newRoutes[routeIndex].rates.splice(rateIndex, 1);
    setRoutes(newRoutes);
  };

  const updateRoute = (index, field, value) => {
    const newRoutes = [...routes];
    newRoutes[index][field] = value;
    setRoutes(newRoutes);
  };

  const updateRate = (routeIndex, rateIndex, field, value) => {
    const newRoutes = [...routes];
    newRoutes[routeIndex].rates[rateIndex][field] = value;
    setRoutes(newRoutes);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!productId) throw new Error("Product is required.");
      if (routes.length === 0) throw new Error("At least one route is required.");
      
      const payloadRoutes = routes.map(route => {
        if (!route.origin || !route.destination) throw new Error("Origin and Destination are required for all routes.");
        if (route.rates.length === 0) throw new Error("At least one quote is required for each route.");
        
        const mappedRates = route.rates.map(rate => {
          if (!rate.partnerId) throw new Error("Transport Partner is required for all quotes.");
          if (!rate.currency || !rate.amount) throw new Error("Amount and currency are required for all quotes.");
          
          return {
            partnerId: Number(rate.partnerId),
            equipment: rate.equipment?.trim() || undefined,
            transitDays: rate.transitDays ? parseInt(rate.transitDays, 10) : 0,
            currency: rate.currency,
            amount: parseFloat(rate.amount),
            validTill: rate.validTill || new Date().toISOString().split("T")[0],
            status: rate.status || "Active"
          };
        });
        
        return {
          origin: route.origin.trim(),
          destination: route.destination.trim(),
          rates: mappedRates
        };
      });

      const payload = {
        isDirect: true,
        productId: Number(productId),
        quoteDate: new Date().toISOString().split("T")[0],
        freightRoutes: payloadRoutes,
      };

      await onSave(payload);
    } catch (err) {
      console.error(err);
      setError(err.message || err.response?.data?.message || "Failed to save direct freight quote.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isEditing = quote && quote.id;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-800/40 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-[70] w-full max-w-4xl bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-right">
        
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
              <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Enterprise freight quotation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden bg-slate-50">
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {error && (
              <div className="flex items-center gap-2.5 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-xs font-bold">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Product *</label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 bg-slate-50 focus:outline-none focus:border-indigo-500 focus:bg-white cursor-pointer transition-colors"
                required
              >
                <option value="">Select Product...</option>
                {productOptionsList.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              {routes.map((route, routeIdx) => (
                <div key={routeIdx} className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <div className="bg-slate-100/50 px-4 py-3 border-b border-slate-200 flex items-center justify-between rounded-t-2xl">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                      <span className="flex items-center justify-center bg-indigo-100 text-indigo-700 h-5 w-5 rounded-md text-[10px]">{routeIdx + 1}</span>
                      Route Details
                    </h4>
                    {routes.length > 1 && (
                      <button type="button" onClick={() => handleRemoveRoute(routeIdx)} className="text-slate-400 hover:text-rose-500 transition-colors p-1 rounded-md hover:bg-rose-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Origin *</label>
                        <input
                          type="text"
                          value={route.origin}
                          onChange={(e) => updateRoute(routeIdx, "origin", e.target.value)}
                          placeholder="e.g. Mundra Port"
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:border-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Destination *</label>
                        <input
                          type="text"
                          value={route.destination}
                          onChange={(e) => updateRoute(routeIdx, "destination", e.target.value)}
                          placeholder="e.g. Dubai"
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:border-indigo-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Quotes for this route</h5>
                      <div className="space-y-3">
                        {route.rates.map((rate, rateIdx) => (
                          <div key={rateIdx} className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 relative group">
                            {/* Quote Header */}
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                              <h6 className="text-[11px] font-bold text-slate-800 tracking-wide uppercase">Quote #{rateIdx + 1}</h6>
                              {route.rates.length > 1 && (
                                <button type="button" onClick={() => handleRemoveRate(routeIdx, rateIdx)} className="text-slate-400 hover:text-rose-500 transition-colors bg-white hover:bg-rose-50 p-1.5 rounded-lg border border-transparent hover:border-rose-100" title="Delete Quote">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>

                            <div className="space-y-4">
                              {/* Transport Partner - Full width */}
                              <div>
                                <SearchablePartnerSelect
                                  label="Transport Partner *"
                                  value={rate.partnerId}
                                  onChange={(v) => updateRate(routeIdx, rateIdx, "partnerId", v)}
                                  roleNames={["Transport", "TRANSPORT-DOMESTIC", "TRANSPORT-INTERNATIONAL", "Freight Forwarder", "Shipping Line"]}
                                  mode="entity"
                                  placeholder="Search Partner..."
                                />
                              </div>

                              {/* Equipment - Full width */}
                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Equipment</label>
                                <input
                                  type="text"
                                  value={rate.equipment}
                                  onChange={(e) => updateRate(routeIdx, rateIdx, "equipment", e.target.value)}
                                  placeholder="e.g. 20 FT Container"
                                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                                />
                              </div>

                              {/* Row 1: Transit Days | Currency | Amount */}
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Transit Days</label>
                                  <input
                                    type="number"
                                    value={rate.transitDays}
                                    onChange={(e) => updateRate(routeIdx, rateIdx, "transitDays", e.target.value)}
                                    placeholder="15"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-slate-50/50 focus:bg-white focus:border-indigo-500 outline-none tabular-nums transition-colors"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Currency *</label>
                                  <Select
                                    isClearable={false}
                                    options={currencyOptions}
                                    value={currencyOptions.find(c => c.value === rate.currency) || null}
                                    onChange={(opt) => updateRate(routeIdx, rateIdx, "currency", opt ? opt.value : "INR")}
                                    styles={{...reactSelectStyles, control: (base, state) => ({...reactSelectStyles.control(base, state), minHeight: "36px", height: "36px", borderRadius: "0.75rem", backgroundColor: "#f8fafc"})}}
                                    menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                                    menuPosition="fixed"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Amount *</label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={rate.amount}
                                    onChange={(e) => updateRate(routeIdx, rateIdx, "amount", e.target.value)}
                                    placeholder="Total Amount"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 bg-slate-50/50 focus:bg-white focus:border-indigo-500 outline-none tabular-nums transition-colors"
                                    required
                                  />
                                </div>
                              </div>

                              {/* Row 2: Valid Till | Status */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Valid Till</label>
                                  <input
                                    type="date"
                                    value={rate.validTill}
                                    onChange={(e) => updateRate(routeIdx, rateIdx, "validTill", e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-slate-50/50 focus:bg-white focus:border-indigo-500 outline-none transition-colors"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Status</label>
                                  <select
                                    value={rate.status}
                                    onChange={(e) => updateRate(routeIdx, rateIdx, "status", e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-[11px] font-semibold bg-slate-50/50 focus:bg-white focus:border-indigo-500 outline-none transition-colors"
                                  >
                                    <option value="Active">Active</option>
                                    <option value="Draft">Draft</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-3">
                        <button type="button" onClick={() => handleAddRate(routeIdx)} className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 px-2 py-1.5 rounded-md hover:bg-indigo-50 transition-colors">
                          <Plus className="h-3 w-3" /> Add Quote to Route
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button type="button" onClick={handleAddRoute} className="w-full py-3 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-all cursor-pointer">
              <Plus className="h-4 w-4" /> Add New Route
            </button>
            
          </div>

          <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-end gap-3 shrink-0">
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
              {loading ? "Saving..." : isEditing ? "Update Quotes" : "Save Quotes"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
