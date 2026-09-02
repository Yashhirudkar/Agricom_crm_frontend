import React, { useMemo } from "react";
import Select from "react-select";
import { State, City } from "country-state-city";
import { getAllCountryOptions, getAlpha2Code } from "@/lib/countryUtils";

export default function LocationHierarchy({ prefix, form, setForm, errors, isView, shipmentMode }) {
  const labelPrefix = prefix === "origin" ? "Origin" : "Destination";
  const countryKey = prefix === "origin" ? "originCountryId" : "destinationCountry";
  const stateKey = `${prefix}State`;
  const cityKey = `${prefix}City`;

  const lbl = "block text-[11px] font-semibold text-gray-600 mb-1.5";
  const inp = "w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50/50 text-gray-700 transition-all";
  const err = "text-[10px] text-red-500 mt-1";

  // Get selected values from form state
  const countryValue = form[countryKey] || "";
  const stateValue = form[stateKey] || "";
  const cityValue = form[cityKey] || "";

  const zipKey = `${prefix}ZipCode`;
  const stationKey = `${prefix}StationCode`;

  const zipValue = form[zipKey] || "";
  const stationValue = form[stationKey] || "";

  // 1. Generate sorted country options once
  const countryOptions = useMemo(() => {
    return getAllCountryOptions().map((c) => ({
      value: c.value,
      label: c.label,
      isoCode: c.alpha2,
    }));
  }, []);

  // 2. Resolve country ISO code when countryValue changes
  const selectedCountryCode = useMemo(() => {
    if (!countryValue) return "";
    return getAlpha2Code(countryValue);
  }, [countryValue]);

  // 3. Load states for selected country
  const stateOptions = useMemo(() => {
    if (!selectedCountryCode) return [];
    return State.getStatesOfCountry(selectedCountryCode)
      .map((s) => ({
        value: s.name,
        label: s.name,
        isoCode: s.isoCode,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [selectedCountryCode]);

  // 4. Resolve state ISO code when stateValue and selectedCountryCode change
  const selectedStateCode = useMemo(() => {
    if (!selectedCountryCode || !stateValue) return "";
    const state = State.getStatesOfCountry(selectedCountryCode).find(
      (s) => s.name.toLowerCase() === stateValue.toLowerCase()
    );
    return state ? state.isoCode : "";
  }, [selectedCountryCode, stateValue]);

  // 5. Load cities for selected state
  const cityOptions = useMemo(() => {
    if (!selectedCountryCode || !selectedStateCode) return [];
    return City.getCitiesOfState(selectedCountryCode, selectedStateCode)
      .map((c) => ({
        value: c.name,
        label: c.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [selectedCountryCode, selectedStateCode]);

  // Select Option formatting helpers
  const selectedCountryOption = useMemo(() => {
    if (!countryValue) return null;
    return { value: countryValue, label: countryValue };
  }, [countryValue]);

  const selectedStateOption = useMemo(() => {
    if (!stateValue) return null;
    return { value: stateValue, label: stateValue };
  }, [stateValue]);

  const selectedCityOption = useMemo(() => {
    if (!cityValue) return null;
    return { value: cityValue, label: cityValue };
  }, [cityValue]);

  // Select handlers with reset dependencies
  const handleCountryChange = (selected) => {
    setForm((f) => ({
      ...f,
      [countryKey]: selected ? selected.value : "",
      [stateKey]: "",
      [cityKey]: "",
    }));
  };

  const handleStateChange = (selected) => {
    setForm((f) => ({
      ...f,
      [stateKey]: selected ? selected.value : "",
      [cityKey]: "",
    }));
  };

  const handleCityChange = (selected) => {
    setForm((f) => ({
      ...f,
      [cityKey]: selected ? selected.value : "",
    }));
  };

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: errors[countryKey] || errors[stateKey] || errors[cityKey] ? "#ef4444" : state.isFocused ? "#007aff" : "#e2e8f0",
      borderRadius: "0.75rem",
      fontSize: "12px",
      boxShadow: "none",
      minHeight: "38px",
      backgroundColor: "white",
      "&:hover": { borderColor: errors[countryKey] || errors[stateKey] || errors[cityKey] ? "#ef4444" : state.isFocused ? "#007aff" : "#cbd5e1" },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "#007aff" : state.isFocused ? "#f8fafc" : "white",
      color: state.isSelected ? "white" : "#334155",
      fontSize: "12px",
      cursor: "pointer",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  if (isView) {
    return (
      <>
        {/* Country */}
        <div>
          <label className={lbl}>{labelPrefix} Country</label>
          <div className={inp}>{countryValue || "—"}</div>
        </div>
        {/* State */}
        <div>
          <label className={lbl}>{labelPrefix} State</label>
          <div className={inp}>{stateValue || "—"}</div>
        </div>
        {/* City */}
        <div>
          <label className={lbl}>{labelPrefix} City</label>
          <div className={inp}>{cityValue || "—"}</div>
        </div>
        {/* ZIP / Station */}
        {shipmentMode === "ROAD" && (
          <div>
            <label className={lbl}>{labelPrefix} ZIP / Postal Code</label>
            <div className={inp}>{zipValue || "—"}</div>
          </div>
        )}
        {shipmentMode === "RAIL" && (
          <div>
            <label className={lbl}>{labelPrefix} Railway Station Code</label>
            <div className={inp}>{stationValue || "—"}</div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {/* Country Selection */}
      <div>
        <label className={lbl}>{labelPrefix} Country <span className="text-red-500">*</span></label>
        <Select
          isClearable
          options={countryOptions}
          value={selectedCountryOption}
          onChange={handleCountryChange}
          styles={selectStyles}
          placeholder="Search country..."
          menuPortalTarget={typeof document !== "undefined" ? document.body : null}
          menuPosition="fixed"
          className="text-xs"
        />
        {errors[countryKey] && <p className={err}>{errors[countryKey]}</p>}
      </div>

      {/* State Selection */}
      <div>
        <label className={lbl}>{labelPrefix} State <span className="text-red-500">*</span></label>
        <Select
          isClearable
          options={stateOptions}
          value={selectedStateOption}
          onChange={handleStateChange}
          isDisabled={!countryValue || stateOptions.length === 0}
          styles={selectStyles}
          placeholder={!countryValue ? "Select Country first" : "Search state..."}
          menuPortalTarget={typeof document !== "undefined" ? document.body : null}
          menuPosition="fixed"
          className="text-xs"
        />
        {errors[stateKey] && <p className={err}>{errors[stateKey]}</p>}
      </div>

      {/* City Selection */}
      <div>
        <label className={lbl}>{labelPrefix} City <span className="text-red-500">*</span></label>
        <Select
          isClearable
          options={cityOptions}
          value={selectedCityOption}
          onChange={handleCityChange}
          isDisabled={!stateValue || cityOptions.length === 0}
          styles={selectStyles}
          placeholder={!stateValue ? "Select State first" : "Search city..."}
          menuPortalTarget={typeof document !== "undefined" ? document.body : null}
          menuPosition="fixed"
          className="text-xs"
        />
        {errors[cityKey] && <p className={err}>{errors[cityKey]}</p>}
      </div>

      {/* ZIP / Postal Code (Road) */}
      {shipmentMode === "ROAD" && (
        <div>
          <label className={lbl}>{labelPrefix} ZIP / Postal Code</label>
          <input
            type="text"
            value={zipValue}
            onChange={(e) => setForm((f) => ({ ...f, [zipKey]: e.target.value }))}
            placeholder="e.g. 90001"
            className={`${inp} ${errors[zipKey] ? "border-red-300" : ""}`}
          />
          {errors[zipKey] && <p className={err}>{errors[zipKey]}</p>}
        </div>
      )}

      {/* Railway Station Code (Rail) */}
      {shipmentMode === "RAIL" && (
        <div>
          <label className={lbl}>{labelPrefix} Railway Station Code <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={stationValue}
            onChange={(e) => setForm((f) => ({ ...f, [stationKey]: e.target.value.toUpperCase() }))}
            placeholder="e.g. NDLS"
            maxLength={8}
            className={`${inp} uppercase ${errors[stationKey] ? "border-red-300" : ""}`}
          />
          {errors[stationKey] && <p className={err}>{errors[stationKey]}</p>}
        </div>
      )}
    </>
  );
}
