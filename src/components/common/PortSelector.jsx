import React, { useMemo, useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import { PORTS_BY_COUNTRY } from "@/constants/portsData";
import { getAlpha2Code } from "@/lib/countryUtils";

export default function PortSelector({ value, onChange, label, placeholder, isView, error, countryName }) {
  const lbl = "block text-[11px] font-semibold text-gray-600 mb-1.5";
  const inp = "w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50/50 text-gray-700 transition-all";
  const err = "text-[10px] text-red-500 mt-1";

  // Resolve country code from country name
  const selectedCountryCode = useMemo(() => {
    if (!countryName) return "";
    return getAlpha2Code(countryName);
  }, [countryName]);

  // Load and map ports for the selected country
  const filteredPorts = useMemo(() => {
    if (!selectedCountryCode) return [];
    const ports = PORTS_BY_COUNTRY[selectedCountryCode] || [];
    return ports
      .map((p) => ({
        value: p.name,
        label: `${p.name} (${p.code})`,
        code: p.code,
        countryCode: selectedCountryCode,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [selectedCountryCode]);

  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Debounce search input by 200ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 200);
    return () => clearTimeout(handler);
  }, [inputValue]);

  // Compute search options (min length 2 if searching, or show first 50 results)
  const options = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!selectedCountryCode) return [];
    if (q.length < 2) {
      return filteredPorts.slice(0, 50);
    }
    return filteredPorts
      .filter(
        (p) =>
          p.value.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q)
      )
      .slice(0, 50);
  }, [searchQuery, filteredPorts, selectedCountryCode]);

  // Map value string to select option object
  const selectedOption = useMemo(() => {
    if (!value) return null;
    const found = filteredPorts.find(
      (p) => p.value.toLowerCase() === value.toLowerCase()
    );
    return found ? found : { value, label: value };
  }, [value, filteredPorts]);

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: error ? "#ef4444" : state.isFocused ? "#007aff" : "#e2e8f0",
      borderRadius: "0.75rem",
      fontSize: "12px",
      boxShadow: "none",
      minHeight: "38px",
      backgroundColor: "white",
      "&:hover": { borderColor: error ? "#ef4444" : state.isFocused ? "#007aff" : "#cbd5e1" },
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

  const handleInputChange = (val, { action }) => {
    if (action === "input-change") {
      setInputValue(val);
    } else if (action === "input-blur" || action === "menu-close") {
      setInputValue("");
    }
  };

  if (isView) {
    return (
      <div>
        <label className={lbl}>{label}</label>
        <div className={inp}>{value || "—"}</div>
      </div>
    );
  }

  return (
    <div>
      <label className={lbl}>{label} <span className="text-red-500">*</span></label>
      <CreatableSelect
        isClearable
        options={options}
        value={selectedOption}
        onChange={(val) => onChange(val ? val.value : "")}
        onInputChange={handleInputChange}
        inputValue={inputValue}
        filterOption={() => true} // Already filtered inside useMemo
        isDisabled={!countryName}
        styles={selectStyles}
        placeholder={!countryName ? "Select Country first" : placeholder || "Search port..."}
        menuPortalTarget={typeof document !== "undefined" ? document.body : null}
        menuPosition="fixed"
        className="text-xs"
        formatCreateLabel={(inputValue) => `➕ Add Custom Port: "${inputValue}"`}
        noOptionsMessage={() => {
          if (!countryName) return "Select Country first";
          return inputValue.trim().length < 2 ? "Type 2+ characters to search..." : "No ports found";
        }}
      />
      {error && <p className={err}>{error}</p>}
    </div>
  );
}
