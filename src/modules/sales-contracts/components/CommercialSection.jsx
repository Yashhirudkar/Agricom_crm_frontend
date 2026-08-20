"use client";
import React, { useState, useEffect, useRef } from "react";
import { DollarSign, ChevronDown, Truck, Plane, Ship, Train, MapPin } from "lucide-react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  TRANSPORT_MODES,
  TRANSPORT_MODE_CONFIG,
  getLocations,
} from "../services/locationProvider";
import CountrySelect from "@/components/common/CountrySelect";
import { getAlpha2Code } from "@/lib/countryUtils";


// ---------------------------------------------------------------------------
// VirtualMenuList — reused from PartnerDrawer for large city dropdowns
// Ensures smooth scrolling for 1000+ city options
// ---------------------------------------------------------------------------
const VirtualMenuList = (props) => {
  const { children, maxHeight } = props;
  const parentRef = useRef(null);
  const childrenArray = React.Children.toArray(children);

  const rowVirtualizer = useVirtualizer({
    count: childrenArray.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5,
  });

  return (
    <div
      ref={parentRef}
      style={{ maxHeight: maxHeight || 300, overflow: "auto" }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            ref={rowVirtualizer.measureElement}
            data-index={virtualRow.index}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {childrenArray[virtualRow.index]}
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Transport mode icon map
// ---------------------------------------------------------------------------
const TRANSPORT_ICONS = {
  sea: Ship,
  air: Plane,
  road: Truck,
  rail: Train,
};

// ---------------------------------------------------------------------------
// react-select shared styles (matches existing design system)
// ---------------------------------------------------------------------------
const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "34px",
    fontSize: "12px",
    borderRadius: "12px",
    borderColor: state.isFocused ? "#007aff" : "#e5e7eb",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(0,122,255,0.12)" : "none",
    "&:hover": { borderColor: "#007aff" },
    backgroundColor: state.isDisabled ? "#f9fafb" : "#fff",
    cursor: state.isDisabled ? "not-allowed" : "default",
  }),
  option: (base, state) => ({
    ...base,
    fontSize: "12px",
    backgroundColor: state.isSelected
      ? "#007aff"
      : state.isFocused
      ? "#eff6ff"
      : "#fff",
    color: state.isSelected ? "#fff" : "#111827",
    cursor: "pointer",
    padding: "8px 12px",
  }),
  singleValue: (base) => ({ ...base, fontSize: "12px", color: "#111827" }),
  placeholder: (base) => ({ ...base, fontSize: "12px", color: "#9ca3af" }),
  menu: (base) => ({ ...base, borderRadius: "12px", zIndex: 50, fontSize: "12px" }),
  menuList: (base) => ({ ...base, borderRadius: "12px", padding: 0 }),
  input: (base) => ({ ...base, fontSize: "12px" }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({ ...base, padding: "4px 8px", color: "#9ca3af" }),
  clearIndicator: (base) => ({ ...base, padding: "4px 6px", color: "#9ca3af" }),
  noOptionsMessage: (base) => ({ ...base, fontSize: "12px" }),
  loadingMessage: (base) => ({ ...base, fontSize: "12px" }),
};

// ---------------------------------------------------------------------------
// LocationSelect — shared dropdown for all transport mode routing fields
// ---------------------------------------------------------------------------
function LocationSelect({ value, onChange, options, loadOptions, placeholder, isDisabled, isSearchable, hasError }) {
  const selectedOption = options.find((o) => o.value === value) || (value ? { value, label: value } : null);

  const selectProps = {
    value: selectedOption,
    onChange: (opt) => onChange(opt ? opt.value : ""),
    placeholder,
    isDisabled,
    isSearchable,
    isClearable: true,
    menuPortalTarget: typeof document !== 'undefined' ? document.body : null,
    menuPosition: "fixed",
    styles: {
      ...selectStyles,
      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
      control: (base, state) => ({
        ...selectStyles.control(base, state),
        borderColor: hasError
          ? "#fca5a5"
          : state.isFocused
          ? "#007aff"
          : "#e5e7eb",
      }),
    },
    components: { MenuList: VirtualMenuList },
    noOptionsMessage: () =>
      isDisabled ? "Select a country first" : "No options found",
  };

  if (loadOptions) {
    return (
      <AsyncSelect
        {...selectProps}
        loadOptions={loadOptions}
        defaultOptions
      />
    );
  }

  return <Select {...selectProps} options={options} />;
}

// ---------------------------------------------------------------------------
// Main CommercialSection component
// ---------------------------------------------------------------------------
export default function CommercialSection({ form, setForm, errors, masters, isView }) {
  const inp = "w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007aff]/20 focus:border-[#007aff] bg-white transition-all";
  const lbl = "block text-[11px] font-semibold text-gray-600 mb-1.5";
  const err = "text-[10px] text-red-500 mt-1";

  // Resolve country ISO codes
  const originCode = form.originCountry ? (getAlpha2Code(form.originCountry) || "") : "";
  const destCode = form.destinationCountry ? (getAlpha2Code(form.destinationCountry) || "") : "";

  // Current transport modes
  const originTransportMode = form.originTransportMode || "sea";
  const destTransportMode = form.destinationTransportMode || "sea";
  
  const originConfig = TRANSPORT_MODE_CONFIG[originTransportMode] || TRANSPORT_MODE_CONFIG.sea;
  const destConfig = TRANSPORT_MODE_CONFIG[destTransportMode] || TRANSPORT_MODE_CONFIG.sea;

  // Load location options asynchronously
  const [originOptions, setOriginOptions] = useState([]);
  const [destOptions, setDestOptions] = useState([]);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!originCode) {
        setOriginOptions([]);
        return;
      }
      try {
        const opts = await getLocations({ countryCode: originCode, transportMode: originTransportMode, search: "" });
        if (active) setOriginOptions(opts);
      } catch (err) {
        console.error(err);
      }
    }
    load();
    return () => { active = false; };
  }, [originCode, originTransportMode]);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!destCode) {
        setDestOptions([]);
        return;
      }
      try {
        const opts = await getLocations({ countryCode: destCode, transportMode: destTransportMode, search: "" });
        if (active) setDestOptions(opts);
      } catch (err) {
        console.error(err);
      }
    }
    load();
    return () => { active = false; };
  }, [destCode, destTransportMode]);

  // Load options for AsyncSelect (Airports)
  const loadOriginOptions = async (inputValue) => {
    if (!originCode) return [];
    return await getLocations({ countryCode: originCode, transportMode: originTransportMode, search: inputValue });
  };

  const loadDestOptions = async (inputValue) => {
    if (!destCode) return [];
    return await getLocations({ countryCode: destCode, transportMode: destTransportMode, search: inputValue });
  };

  // Transport mode icons
  const OriginTransportIcon = TRANSPORT_ICONS[originTransportMode] || Ship;
  const DestTransportIcon = TRANSPORT_ICONS[destTransportMode] || Ship;

  // Handler: change origin transport mode → clear location
  const handleOriginTransportModeChange = (newMode) => {
    setForm((f) => ({
      ...f,
      originTransportMode: newMode,
      originLocationName: "",
    }));
  };

  // Handler: change destination transport mode → clear location
  const handleDestTransportModeChange = (newMode) => {
    setForm((f) => ({
      ...f,
      destinationTransportMode: newMode,
      destinationLocationName: "",
    }));
  };

  // Handler: change origin country → clear origin location
  const handleOriginCountryChange = (countryName) => {
    setForm((f) => ({
      ...f,
      originCountry: countryName || "",
      originLocationName: "",
    }));
  };

  // Handler: change destination country → clear destination location
  const handleDestCountryChange = (countryName) => {
    setForm((f) => ({
      ...f,
      destinationCountry: countryName || "",
      destinationLocationName: "",
    }));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      {/* Section Header */}
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2.5">
        <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
          <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900">Commercial Details</h2>
          <p className="text-[10px] text-gray-400">Shipment, payment, and currency terms</p>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-6">

        {/* ── Split Section: Origin vs Destination ──────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Origin Section */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h3 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <OriginTransportIcon className="h-3.5 w-3.5 text-blue-500" />
              Origin / Shipment
            </h3>
            
            <div className="mb-4">
              <label className={lbl}>
                Transport Mode <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="originTransportMode"
                  value={originTransportMode}
                  onChange={(e) => handleOriginTransportModeChange(e.target.value)}
                  disabled={isView}
                  className={`${inp} appearance-none pr-8`}
                >
                  {TRANSPORT_MODES.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Origin Country */}
              <div>
                <label className={lbl}>
                  Country <span className="text-red-500">*</span>
                </label>
                {isView ? (
                  <div className={`${inp} text-gray-700 bg-gray-50/50`}>
                    {form.originCountry || "—"}
                  </div>
                ) : (
                  <CountrySelect
                    value={form.originCountry || ""}
                    onChange={(val) => handleOriginCountryChange(val?.name || "")}
                  />
                )}
                {errors.originCountry && <p className={err}>{errors.originCountry}</p>}
              </div>

              {/* Origin Location */}
              <div>
                <label className={lbl}>
                  {originConfig.originLabel} <span className="text-red-500">*</span>
                </label>
                {isView ? (
                  <div className={`${inp} text-gray-700`}>
                    {form.originLocationName || "—"}
                  </div>
                ) : (
                  <LocationSelect
                    key={`origin-${originCode}-${originTransportMode}`}
                    value={form.originLocationName || ""}
                    onChange={(val) => setForm((f) => ({ ...f, originLocationName: val }))}
                    options={originOptions}
                    loadOptions={loadOriginOptions}
                    placeholder={originCode ? originConfig.originPlaceholder : originConfig.noCountryHint}
                    isDisabled={!originCode}
                    isSearchable={originConfig.isSearchable}
                    hasError={!!errors.originLocationName}
                  />
                )}
                {errors.originLocationName && (
                  <p className={err}>{errors.originLocationName}</p>
                )}
                {!originCode && !isView && (
                  <p className="text-[10px] text-gray-400 mt-1">
                    {originConfig.noCountryHint}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Destination Section */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h3 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-emerald-500" />
              Destination
            </h3>
            
            <div className="mb-4">
              <label className={lbl}>
                Transport Mode <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="destinationTransportMode"
                  value={destTransportMode}
                  onChange={(e) => handleDestTransportModeChange(e.target.value)}
                  disabled={isView}
                  className={`${inp} appearance-none pr-8`}
                >
                  {TRANSPORT_MODES.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Destination Country */}
              <div>
                <label className={lbl}>
                  Country <span className="text-red-500">*</span>
                </label>
                {isView ? (
                  <div className={`${inp} text-gray-700 bg-gray-50/50`}>
                    {form.destinationCountry || "—"}
                  </div>
                ) : (
                  <CountrySelect
                    value={form.destinationCountry || ""}
                    onChange={(val) => handleDestCountryChange(val?.name || "")}
                  />
                )}
                {errors.destinationCountry && (
                  <p className={err}>{errors.destinationCountry}</p>
                )}
              </div>

              {/* Destination Location */}
              <div>
                <label className={lbl}>
                  {destConfig.destLabel} <span className="text-red-500">*</span>
                </label>
                {isView ? (
                  <div className={`${inp} text-gray-700`}>
                    {form.destinationLocationName || "—"}
                  </div>
                ) : (
                  <LocationSelect
                    key={`dest-${destCode}-${destTransportMode}`}
                    value={form.destinationLocationName || ""}
                    onChange={(val) => setForm((f) => ({ ...f, destinationLocationName: val }))}
                    options={destOptions}
                    loadOptions={loadDestOptions}
                    placeholder={destCode ? destConfig.destPlaceholder : destConfig.noDestCountryHint}
                    isDisabled={!destCode}
                    isSearchable={destConfig.isSearchable}
                    hasError={!!errors.destinationLocationName}
                  />
                )}
                {errors.destinationLocationName && (
                  <p className={err}>{errors.destinationLocationName}</p>
                )}
                {!destCode && !isView && (
                  <p className="text-[10px] text-gray-400 mt-1">
                    {destConfig.noDestCountryHint}
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* ── Common Commercial Terms ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-gray-100">
          
          {/* Shipment Type */}
          <div>
            <label className={lbl}>
              Shipment Type <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="shipmentTypeId"
                value={form.shipmentTypeId || ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    shipmentTypeId: e.target.value ? Number(e.target.value) : "",
                  }))
                }
                disabled={isView}
                className={`${inp} appearance-none pr-8 ${errors.shipmentTypeId ? "border-red-300" : ""}`}
              >
                <option value="">Select Shipment Type</option>
                {masters.shipmentTypes.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
            </div>
            {errors.shipmentTypeId && <p className={err}>{errors.shipmentTypeId}</p>}
          </div>

          {/* Payment Terms */}
          <div>
            <label className={lbl}>
              Payment Terms <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="paymentTermId"
                value={form.paymentTermId || ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    paymentTermId: e.target.value ? Number(e.target.value) : "",
                  }))
                }
                disabled={isView}
                className={`${inp} appearance-none pr-8 ${errors.paymentTermId ? "border-red-300" : ""}`}
              >
                <option value="">Select Payment Terms</option>
                {masters.paymentTerms.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
            </div>
            {errors.paymentTermId && <p className={err}>{errors.paymentTermId}</p>}
          </div>

          {/* Currency */}
          <div>
            <label className={lbl}>
              Currency <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="currencyCode"
                value={form.currencyCode || ""}
                onChange={(e) => {
                  const newCurrency = e.target.value;
                  setForm((f) => ({
                    ...f,
                    currencyCode: newCurrency,
                    // Sync Contract Currency to every shipment row immediately
                    shipments: (f.shipments || []).map((s) => ({
                      ...s,
                      currencyCode: newCurrency,
                    })),
                  }));
                }}
                disabled={isView}
                className={`${inp} appearance-none pr-8 ${errors.currencyCode ? "border-red-300" : ""}`}
              >
                <option value="">Select Currency</option>
                {masters.currencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
            </div>
            {errors.currencyCode && <p className={err}>{errors.currencyCode}</p>}
          </div>

        </div>

      </div>
    </div>
  );
}
