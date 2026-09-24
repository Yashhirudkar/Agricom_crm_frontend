import React, { useMemo, useState, useEffect, useCallback } from "react";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { State, City } from "country-state-city";
import { getAllCountryOptions, getAlpha2Code } from "@/lib/countryUtils";
import axiosClient from "@/lib/axios";
import { toast } from "sonner";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Deduplicate options by label, case-insensitive. Library data takes priority. */
function mergeAndDedupe(libraryOptions, customOptions) {
  const seen = new Set(libraryOptions.map((o) => o.label.toLowerCase()));
  const extras = customOptions.filter((o) => !seen.has(o.label.toLowerCase()));
  return [...libraryOptions, ...extras].sort((a, b) =>
    a.label.localeCompare(b.label)
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function LocationHierarchy({
  prefix,
  form,
  setForm,
  errors,
  isView,
  shipmentMode,
}) {
  const labelPrefix = prefix === "origin" ? "Origin" : "Destination";
  const countryKey = prefix === "origin" ? "originCountryId" : "destinationCountry";
  const stateKey = `${prefix}State`;
  const cityKey = `${prefix}City`;
  const zipKey = `${prefix}ZipCode`;
  const stationKey = `${prefix}StationCode`;

  const lbl = "block text-[11px] font-semibold text-gray-600 mb-1.5";
  const inp =
    "w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50/50 text-gray-700 transition-all";
  const err = "text-[10px] text-red-500 mt-1";

  // ── Form values ─────────────────────────────────────────────────────────────
  const countryValue = form[countryKey] || "";
  const stateValue = form[stateKey] || "";
  const cityValue = form[cityKey] || "";
  const zipValue = form[zipKey] || "";
  const stationValue = form[stationKey] || "";

  // ── Country ISO code (needed for API calls) ─────────────────────────────────
  const selectedCountryCode = useMemo(() => {
    if (!countryValue) return "";
    return getAlpha2Code(countryValue);
  }, [countryValue]);

  // ── Library: States for selected country ────────────────────────────────────
  const libraryStateOptions = useMemo(() => {
    if (!selectedCountryCode) return [];
    return State.getStatesOfCountry(selectedCountryCode)
      .map((s) => ({ value: s.name, label: s.name, isoCode: s.isoCode }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [selectedCountryCode]);

  // ── Library: Cities for selected state ──────────────────────────────────────
  const selectedStateCode = useMemo(() => {
    if (!selectedCountryCode || !stateValue) return "";
    const s = State.getStatesOfCountry(selectedCountryCode).find(
      (s) => s.name.toLowerCase() === stateValue.toLowerCase()
    );
    return s ? s.isoCode : "";
  }, [selectedCountryCode, stateValue]);

  const libraryCityOptions = useMemo(() => {
    if (!selectedCountryCode || !selectedStateCode) return [];
    return City.getCitiesOfState(selectedCountryCode, selectedStateCode)
      .map((c) => ({ value: c.name, label: c.name }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [selectedCountryCode, selectedStateCode]);

  // ── Custom locations from DB ─────────────────────────────────────────────────
  const [customStateOptions, setCustomStateOptions] = useState([]);
  const [customCityOptions, setCustomCityOptions] = useState([]);
  const [stateCreating, setStateCreating] = useState(false);
  const [cityCreating, setCityCreating] = useState(false);

  // Fetch custom states when country changes
  const fetchCustomStates = useCallback(async (countryCode) => {
    if (!countryCode) { setCustomStateOptions([]); return; }
    try {
      const res = await axiosClient.get("/masters/custom-locations/states", {
        params: { countryCode },
      });
      const list = res.data?.data || [];
      setCustomStateOptions(
        list.map((s) => ({ value: s.stateName, label: s.stateName }))
      );
    } catch {
      setCustomStateOptions([]);
    }
  }, []);

  // Fetch custom cities when state changes
  const fetchCustomCities = useCallback(async (countryCode, stateName) => {
    if (!countryCode || !stateName) { setCustomCityOptions([]); return; }
    try {
      const res = await axiosClient.get("/masters/custom-locations/cities", {
        params: { countryCode, stateName },
      });
      const list = res.data?.data || [];
      setCustomCityOptions(
        list.map((c) => ({ value: c.cityName, label: c.cityName }))
      );
    } catch {
      setCustomCityOptions([]);
    }
  }, []);

  useEffect(() => {
    fetchCustomStates(selectedCountryCode);
    setCustomCityOptions([]);
  }, [selectedCountryCode, fetchCustomStates]);

  useEffect(() => {
    fetchCustomCities(selectedCountryCode, stateValue);
  }, [selectedCountryCode, stateValue, fetchCustomCities]);

  // ── Merged options ──────────────────────────────────────────────────────────
  const stateOptions = useMemo(
    () => mergeAndDedupe(libraryStateOptions, customStateOptions),
    [libraryStateOptions, customStateOptions]
  );

  const cityOptions = useMemo(
    () => mergeAndDedupe(libraryCityOptions, customCityOptions),
    [libraryCityOptions, customCityOptions]
  );

  // ── Country options ─────────────────────────────────────────────────────────
  const countryOptions = useMemo(() => {
    return getAllCountryOptions().map((c) => ({
      value: c.value,
      label: c.label,
      isoCode: c.alpha2,
    }));
  }, []);

  // ── Select option objects ───────────────────────────────────────────────────
  const selectedCountryOption = useMemo(
    () => (countryValue ? { value: countryValue, label: countryValue } : null),
    [countryValue]
  );
  const selectedStateOption = useMemo(
    () => (stateValue ? { value: stateValue, label: stateValue } : null),
    [stateValue]
  );
  const selectedCityOption = useMemo(
    () => (cityValue ? { value: cityValue, label: cityValue } : null),
    [cityValue]
  );

  // ── Handlers ────────────────────────────────────────────────────────────────
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

  // ── Inline create: State ────────────────────────────────────────────────────
  const handleCreateState = async (inputValue) => {
    if (!selectedCountryCode || !countryValue) {
      toast.error("Select a country first");
      return;
    }
    const name = inputValue.trim();
    if (!name) return;

    setStateCreating(true);
    const toastId = toast.loading(`Creating state "${name}"...`);
    try {
      await axiosClient.post("/masters/custom-locations/states", {
        countryCode: selectedCountryCode,
        countryName: countryValue,
        stateName: name,
      });

      // Append to local list + auto-select
      const newOpt = { value: name, label: name };
      setCustomStateOptions((prev) => [...prev, newOpt]);
      setForm((f) => ({ ...f, [stateKey]: name, [cityKey]: "" }));
      toast.success(`State "${name}" created successfully`, { id: toastId });
    } catch (e) {
      const msg =
        e?.response?.data?.message || `Failed to create state "${name}"`;
      toast.error(msg, { id: toastId });
    } finally {
      setStateCreating(false);
    }
  };

  // ── Inline create: City ─────────────────────────────────────────────────────
  const handleCreateCity = async (inputValue) => {
    if (!selectedCountryCode || !stateValue) {
      toast.error("Select a state first");
      return;
    }
    const name = inputValue.trim();
    if (!name) return;

    setCityCreating(true);
    const toastId = toast.loading(`Creating city "${name}"...`);
    try {
      await axiosClient.post("/masters/custom-locations/cities", {
        countryCode: selectedCountryCode,
        countryName: countryValue,
        stateName: stateValue,
        cityName: name,
      });

      // Append to local list + auto-select
      const newOpt = { value: name, label: name };
      setCustomCityOptions((prev) => [...prev, newOpt]);
      setForm((f) => ({ ...f, [cityKey]: name }));
      toast.success(`City "${name}" created successfully`, { id: toastId });
    } catch (e) {
      const msg =
        e?.response?.data?.message || `Failed to create city "${name}"`;
      toast.error(msg, { id: toastId });
    } finally {
      setCityCreating(false);
    }
  };

  // ── Shared react-select styles ──────────────────────────────────────────────
  const makeStyles = (errorKeys = []) => ({
    control: (base, state) => ({
      ...base,
      borderColor: errorKeys.some((k) => errors[k])
        ? "#ef4444"
        : state.isFocused
        ? "#007aff"
        : "#e2e8f0",
      borderRadius: "0.75rem",
      fontSize: "12px",
      boxShadow: "none",
      minHeight: "38px",
      backgroundColor: "white",
      "&:hover": {
        borderColor: errorKeys.some((k) => errors[k])
          ? "#ef4444"
          : state.isFocused
          ? "#007aff"
          : "#cbd5e1",
      },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#007aff"
        : state.isFocused
        ? "#f8fafc"
        : "white",
      color: state.isSelected ? "white" : "#334155",
      fontSize: "12px",
      cursor: "pointer",
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  });

  const commonSelectProps = {
    menuPortalTarget: typeof document !== "undefined" ? document.body : null,
    menuPosition: "fixed",
    className: "text-xs",
  };

  // ── View mode ───────────────────────────────────────────────────────────────
  if (isView) {
    return (
      <>
        <div>
          <label className={lbl}>{labelPrefix} Country</label>
          <div className={inp}>{countryValue || "—"}</div>
        </div>
        <div>
          <label className={lbl}>{labelPrefix} State</label>
          <div className={inp}>{stateValue || "—"}</div>
        </div>
        <div>
          <label className={lbl}>{labelPrefix} City</label>
          <div className={inp}>{cityValue || "—"}</div>
        </div>
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

  // ── Edit mode ───────────────────────────────────────────────────────────────
  return (
    <>
      {/* Country */}
      <div>
        <label className={lbl}>
          {labelPrefix} Country
        </label>
        <Select
          isClearable
          options={countryOptions}
          value={selectedCountryOption}
          onChange={handleCountryChange}
          styles={makeStyles([countryKey])}
          placeholder="Search country..."
          {...commonSelectProps}
        />
        {errors[countryKey] && <p className={err}>{errors[countryKey]}</p>}
      </div>

      {/* State — CreatableSelect */}
      <div>
        <label className={lbl}>
          {labelPrefix} State
        </label>
        <CreatableSelect
          isClearable
          options={stateOptions}
          value={selectedStateOption}
          onChange={handleStateChange}
          onCreateOption={handleCreateState}
          isDisabled={!countryValue || stateCreating}
          isLoading={stateCreating}
          styles={makeStyles([stateKey])}
          placeholder={!countryValue ? "Select Country first" : "Search state..."}
          formatCreateLabel={(val) => `➕ Create "${val}"`}
          noOptionsMessage={({ inputValue }) =>
            !countryValue
              ? "Select Country first"
              : inputValue.trim()
              ? `No state found — type to create`
              : "Search or type a new state..."
          }
          {...commonSelectProps}
        />
        {errors[stateKey] && <p className={err}>{errors[stateKey]}</p>}
      </div>

      {/* City — CreatableSelect */}
      <div>
        <label className={lbl}>
          {labelPrefix} City
        </label>
        <CreatableSelect
          isClearable
          options={cityOptions}
          value={selectedCityOption}
          onChange={handleCityChange}
          onCreateOption={handleCreateCity}
          isDisabled={!stateValue || cityCreating}
          isLoading={cityCreating}
          styles={makeStyles([cityKey])}
          placeholder={!stateValue ? "Select State first" : "Search city..."}
          formatCreateLabel={(val) => `➕ Create "${val}"`}
          noOptionsMessage={({ inputValue }) =>
            !stateValue
              ? "Select State first"
              : inputValue.trim()
              ? `No city found — type to create`
              : "Search or type a new city..."
          }
          {...commonSelectProps}
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
            onChange={(e) =>
              setForm((f) => ({ ...f, [zipKey]: e.target.value }))
            }
            placeholder="e.g. 90001"
            className={`${inp} ${errors[zipKey] ? "border-red-300" : ""}`}
          />
          {errors[zipKey] && <p className={err}>{errors[zipKey]}</p>}
        </div>
      )}

      {/* Railway Station Code (Rail) */}
      {shipmentMode === "RAIL" && (
        <div>
          <label className={lbl}>
            {labelPrefix} Railway Station Code
          </label>
          <input
            type="text"
            value={stationValue}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                [stationKey]: e.target.value.toUpperCase(),
              }))
            }
            placeholder="e.g. NDLS"
            maxLength={8}
            className={`${inp} uppercase ${
              errors[stationKey] ? "border-red-300" : ""
            }`}
          />
          {errors[stationKey] && (
            <p className={err}>{errors[stationKey]}</p>
          )}
        </div>
      )}
    </>
  );
}
