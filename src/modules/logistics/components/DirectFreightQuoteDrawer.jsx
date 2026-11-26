"use client";
import React, { useState, useEffect, useMemo } from "react";
import { X, Save, AlertCircle, PackageOpen, Plus, Trash2 } from "lucide-react";
import SearchablePartnerSelect from "@/components/common/SearchablePartnerSelect";
import axiosClient from "@/lib/axios";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import {
  getCountryOptions,
  getCityOptions,
  getPlaceOptions,
  getZipCodeOptions,
  parseRouteLocation,
  formatOriginLocation,
  formatDestinationLocation,
  addCustomLocationItem,
} from "@/constants/routeLocationsData";
import { useCurrencyMaster } from "@/modules/enquiries/hooks/useCurrencyMaster";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import useFinalizationLock from "@/hooks/useFinalizationLock";
import CompletedBadge from "@/components/badges/CompletedBadge";

export default function DirectFreightQuoteDrawer({
  isOpen,
  onClose,
  onSave,
  quote = null,
}) {
  useEscapeKey(onClose, isOpen);

  const isFinalized = quote?.status === "Finalized" || quote?.status === "Completed" || Boolean(quote?.isPreferred);
  const { isReadOnly, isOneTimeAllowed, canOverride } = useFinalizationLock({
    status: isFinalized ? "Completed" : quote?.status,
    module: "freight_allocation",
    oneTimeEditUsed: quote?.oneTimeCompletedEditUsed,
  });

  const [productId, setProductId] = useState("");
  
  const [routes, setRoutes] = useState([
    {
      origin: "",
      destination: "",
      originCountry: "",
      originCity: "",
      originPlace: "",
      destCountry: "",
      destCity: "",
      destPlace: "",
      destZip: "",
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
  const { data: currencies = [], isLoading: currenciesLoading } = useCurrencyMaster({
    enabled: isOpen,
  });

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

  const [customLocsVersion, setCustomLocsVersion] = useState(0);
  const countryOptions = useMemo(() => getCountryOptions(), [customLocsVersion]);

  const locationSelectStyles = {
    ...reactSelectStyles,
    control: (base, state) => ({
      ...reactSelectStyles.control(base, state),
      minHeight: "34px",
      height: "34px",
      borderRadius: "0.5rem",
      backgroundColor: isReadOnly ? "#f8fafc" : "white",
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0 8px",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#0f172a",
      fontSize: "0.75rem",
      fontWeight: "700",
      textTransform: "uppercase",
    }),
    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
      fontSize: "0.75rem",
      fontWeight: "600",
      textTransform: "uppercase",
    }),
    placeholder: (base) => ({
      ...base,
      fontSize: "0.75rem",
      color: "#94a3b8",
      textTransform: "uppercase",
      fontWeight: "500",
    }),
    option: (base, state) => ({
      ...reactSelectStyles.option(base, state),
      fontSize: "0.75rem",
      fontWeight: "600",
      textTransform: "uppercase",
      padding: "6px 10px",
    }),
    noOptionsMessage: (base) => ({
      ...base,
      fontSize: "0.75rem",
      color: "#64748b",
      fontWeight: "600",
      padding: "8px",
    }),
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
          setRoutes(quote.freightRoutes.map(r => {
            const origParsed = parseRouteLocation(r.origin || "");
            const destParsed = parseRouteLocation(r.destination || "");
            return {
              origin: r.origin || "",
              destination: r.destination || "",
              originCountry: origParsed.country || "",
              originCity: origParsed.city || "",
              originPlace: origParsed.place || "",
              destCountry: destParsed.country || "",
              destCity: destParsed.city || "",
              destPlace: destParsed.place || "",
              destZip: destParsed.zipCode || "",
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
            };
          }));
        } else {
          // Legacy mapping
          const orig = quote.origin || quote.loadingPoint || "";
          const dest = quote.destination || "";
          const origParsed = parseRouteLocation(orig);
          const destParsed = parseRouteLocation(dest);
          setRoutes([{
            origin: orig,
            destination: dest,
            originCountry: origParsed.country || "",
            originCity: origParsed.city || "",
            originPlace: origParsed.place || "",
            destCountry: destParsed.country || "",
            destCity: destParsed.city || "",
            destPlace: destParsed.place || "",
            destZip: destParsed.zipCode || "",
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
            originCountry: "",
            originCity: "",
            originPlace: "",
            destCountry: "",
            destCity: "",
            destPlace: "",
            destZip: "",
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
      originCountry: "",
      originCity: "",
      originPlace: "",
      destCountry: "",
      destCity: "",
      destPlace: "",
      destZip: "",
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

  const updateOriginField = (routeIndex, field, value) => {
    const newRoutes = [...routes];
    const targetRoute = { ...newRoutes[routeIndex] };
    const upperVal = (value || "").trim().toUpperCase();

    if (field === "originCountry") {
      targetRoute.originCountry = upperVal;
      targetRoute.originCity = "";
      targetRoute.originPlace = "";
    } else if (field === "originCity") {
      targetRoute.originCity = upperVal;
      targetRoute.originPlace = "";
    } else if (field === "originPlace") {
      targetRoute.originPlace = upperVal;
    }

    if (targetRoute.originCountry || targetRoute.originCity || targetRoute.originPlace) {
      addCustomLocationItem({
        country: targetRoute.originCountry,
        city: targetRoute.originCity,
        place: targetRoute.originPlace,
      });
    }

    targetRoute.origin = formatOriginLocation({
      country: targetRoute.originCountry,
      city: targetRoute.originCity,
      place: targetRoute.originPlace,
    });

    newRoutes[routeIndex] = targetRoute;
    setRoutes(newRoutes);
    setCustomLocsVersion((v) => v + 1);
  };

  const updateDestField = (routeIndex, field, value) => {
    const newRoutes = [...routes];
    const targetRoute = { ...newRoutes[routeIndex] };
    const upperVal = (value || "").trim().toUpperCase();

    if (field === "destCountry") {
      targetRoute.destCountry = upperVal;
      targetRoute.destCity = "";
      targetRoute.destPlace = "";
      targetRoute.destZip = "";
    } else if (field === "destCity") {
      targetRoute.destCity = upperVal;
      targetRoute.destPlace = "";
      targetRoute.destZip = "";
    } else if (field === "destPlace") {
      targetRoute.destPlace = upperVal;
      const zips = getZipCodeOptions(targetRoute.destCountry, targetRoute.destCity, upperVal);
      if (zips.length === 1 && !targetRoute.destZip) {
        targetRoute.destZip = zips[0].value;
      }
    } else if (field === "destZip") {
      targetRoute.destZip = (value || "").toUpperCase();
    }

    if (targetRoute.destCountry || targetRoute.destCity || targetRoute.destPlace || targetRoute.destZip) {
      addCustomLocationItem({
        country: targetRoute.destCountry,
        city: targetRoute.destCity,
        place: targetRoute.destPlace,
        zipCode: targetRoute.destZip,
      });
    }

    targetRoute.destination = formatDestinationLocation({
      country: targetRoute.destCountry,
      city: targetRoute.destCity,
      place: targetRoute.destPlace,
      zipCode: targetRoute.destZip,
    });

    newRoutes[routeIndex] = targetRoute;
    setRoutes(newRoutes);
    setCustomLocsVersion((v) => v + 1);
  };

  const updateRate = (routeIndex, rateIndex, field, value) => {
    const newRoutes = [...routes];
    newRoutes[routeIndex].rates[rateIndex][field] = value;
    setRoutes(newRoutes);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isReadOnly) return;
    setLoading(true);
    setError("");
    try {
      if (routes.length === 0) throw new Error("At least one route is required.");
      
      const payloadRoutes = routes.map(route => {
        const originVal = (
          formatOriginLocation({
            country: route.originCountry,
            city: route.originCity,
            place: route.originPlace,
          }) || route.origin || ""
        ).trim().toUpperCase();

        const destVal = (
          formatDestinationLocation({
            country: route.destCountry,
            city: route.destCity,
            place: route.destPlace,
            zipCode: route.destZip,
          }) || route.destination || ""
        ).trim().toUpperCase();

        if (!originVal) throw new Error("Origin is required for all routes.");
        if (!route.destCountry?.trim()) throw new Error("Destination Country is required for all routes.");
        if (!destVal) throw new Error("Destination is required for all routes.");
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
          origin: originVal,
          destination: destVal,
          rates: mappedRates
        };
      });

      const payload = {
        isDirect: true,
        ...(productId ? { productId: Number(productId) } : {}),
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
      <div className="fixed inset-y-0 right-0 z-[70] w-full md:w-[60vw] md:min-w-[760px] lg:min-w-[860px] bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-right">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-sm shadow-indigo-500/20">
              <PackageOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[13px] font-extrabold text-slate-900 uppercase tracking-tight">
                  {isReadOnly ? `View Direct Quote (${quote?.quoteNumber || ""})` : isEditing ? `Revise Direct Quote (${quote.quoteNumber})` : "New Direct Quote"}
                </h3>
                {isFinalized && (
                  <CompletedBadge
                    isReadOnly={isReadOnly}
                    isOneTimeAllowed={isOneTimeAllowed}
                    canOverride={canOverride}
                  />
                )}
              </div>
              <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Enterprise freight quotation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden bg-slate-50">
          <fieldset disabled={isReadOnly} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {isOneTimeAllowed && (
              <div className="flex items-center gap-2.5 p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-800 text-xs font-bold">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                <span>You have 1 correction remaining. Saving changes will permanently lock this direct freight quote.</span>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2.5 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-xs font-bold">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Product</label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 bg-slate-50 focus:outline-none focus:border-indigo-500 focus:bg-white cursor-pointer transition-colors"
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
                    <div className="space-y-4">
                      {/* ─── Origin Section: 3 Dependent Fields ────────────────────── */}
                      <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Origin (Country → City → Place) *
                          </label>
                          {route.origin && (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded uppercase tracking-tight truncate max-w-[320px]">
                              {route.origin}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Country *</label>
                            <CreatableSelect
                              isDisabled={isReadOnly}
                              isClearable
                              options={countryOptions}
                              value={route.originCountry ? { value: route.originCountry, label: route.originCountry } : null}
                              onChange={(sel) => updateOriginField(routeIdx, "originCountry", sel ? sel.value : "")}
                              onCreateOption={(val) => updateOriginField(routeIdx, "originCountry", val)}
                              placeholder="SELECT COUNTRY..."
                              noOptionsMessage={() => "No locations found"}
                              formatCreateLabel={(val) => `ADD "${val.toUpperCase()}"`}
                              styles={locationSelectStyles}
                              menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">City *</label>
                            <CreatableSelect
                              isDisabled={isReadOnly}
                              isClearable
                              options={getCityOptions(route.originCountry, route.originCity)}
                              value={route.originCity ? { value: route.originCity, label: route.originCity } : null}
                              onChange={(sel) => updateOriginField(routeIdx, "originCity", sel ? sel.value : "")}
                              onCreateOption={(val) => updateOriginField(routeIdx, "originCity", val)}
                              placeholder={route.originCountry ? "SELECT CITY..." : "SELECT COUNTRY FIRST"}
                              noOptionsMessage={() => "No locations found"}
                              formatCreateLabel={(val) => `ADD "${val.toUpperCase()}"`}
                              styles={locationSelectStyles}
                              menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Place / Port *</label>
                            <CreatableSelect
                              isDisabled={isReadOnly}
                              isClearable
                              options={getPlaceOptions(route.originCountry, route.originCity, route.originPlace)}
                              value={route.originPlace ? { value: route.originPlace, label: route.originPlace } : null}
                              onChange={(sel) => updateOriginField(routeIdx, "originPlace", sel ? sel.value : "")}
                              onCreateOption={(val) => updateOriginField(routeIdx, "originPlace", val)}
                              placeholder={route.originCity ? "SELECT PLACE / PORT..." : "SELECT CITY FIRST"}
                              noOptionsMessage={() => "No locations found"}
                              formatCreateLabel={(val) => `ADD "${val.toUpperCase()}"`}
                              styles={locationSelectStyles}
                              menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                            />
                          </div>
                        </div>
                      </div>

                      {/* ─── Destination Section: 4 Dependent Fields ────────────────── */}
                      <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-indigo-500"></span> Destination (Country → City → Place → ZIP)
                          </label>
                          {route.destination && (
                            <span className="text-[10px] font-bold text-indigo-800 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded uppercase tracking-tight truncate max-w-[320px]">
                              {route.destination}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Country <span className="text-red-500">*</span></label>
                            <Select
                              isDisabled={isReadOnly}
                              isClearable
                              options={countryOptions}
                              value={route.destCountry ? { value: route.destCountry, label: route.destCountry } : null}
                              onChange={(sel) => updateDestField(routeIdx, "destCountry", sel ? sel.value : "")}
                              placeholder="SELECT COUNTRY..."
                              noOptionsMessage={() => "No countries found"}
                              styles={locationSelectStyles}
                              menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">City</label>
                            <input
                              type="text"
                              disabled={isReadOnly}
                              value={route.destCity || ""}
                              onChange={(e) => updateDestField(routeIdx, "destCity", e.target.value.toUpperCase())}
                              placeholder="ENTER CITY..."
                              className="w-full h-[34px] px-2.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 bg-white placeholder:text-slate-400 placeholder:font-normal uppercase focus:outline-none focus:border-indigo-500 disabled:bg-slate-50 disabled:cursor-not-allowed transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Place / Port</label>
                            <input
                              type="text"
                              disabled={isReadOnly}
                              value={route.destPlace || ""}
                              onChange={(e) => updateDestField(routeIdx, "destPlace", e.target.value.toUpperCase())}
                              placeholder="ENTER PLACE / PORT..."
                              className="w-full h-[34px] px-2.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 bg-white placeholder:text-slate-400 placeholder:font-normal uppercase focus:outline-none focus:border-indigo-500 disabled:bg-slate-50 disabled:cursor-not-allowed transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">ZIP Code</label>
                            <input
                              type="text"
                              disabled={isReadOnly}
                              value={route.destZip || ""}
                              onChange={(e) => updateDestField(routeIdx, "destZip", e.target.value.toUpperCase())}
                              placeholder="ZIP CODE (E.G. 1234)..."
                              className="w-full h-[34px] px-2.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 bg-white placeholder:text-slate-400 placeholder:font-normal uppercase focus:outline-none focus:border-indigo-500 disabled:bg-slate-50 disabled:cursor-not-allowed transition-colors"
                            />
                          </div>
                        </div>
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

            {!isReadOnly && (
              <button type="button" onClick={handleAddRoute} className="w-full py-3 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-all cursor-pointer">
                <Plus className="h-4 w-4" /> Add New Route
              </button>
            )}
            
          </div>
          </fieldset>

          <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {isReadOnly ? "Close" : "Cancel"}
            </button>
            {!isReadOnly && (
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
                {loading ? "Saving..." : isOneTimeAllowed ? "Save Final Correction" : isEditing ? "Update Quotes" : "Save Quotes"}
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
