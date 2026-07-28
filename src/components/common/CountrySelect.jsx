import React, { useMemo } from "react";
import CreatableSelect from "react-select/creatable";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

// Register the English locale language resource
countries.registerLocale(enLocale);

export default function CountrySelect({ value, onChange, error, className }) {
  // 1. Generate sorted country options once and cache it via useMemo
  const countryOptions = useMemo(() => {
    const rawNames = countries.getNames("en");
    return Object.entries(rawNames)
      .map(([alpha2, name]) => ({
        label: name,
        value: name,
        alpha2: alpha2,
        alpha3: countries.alpha2ToAlpha3(alpha2) || "",
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  // 2. Map current string value from parent state to select option object (handles standard & custom)
  const selectedOption = useMemo(() => {
    if (!value) return null;
    const standard = countryOptions.find(
      (opt) => opt.label.toLowerCase() === value.toLowerCase()
    );
    if (standard) return standard;
    // Fallback: If not found in standard i18n database, represent as custom option
    return { label: value, value: value, isCustom: true };
  }, [value, countryOptions]);

  // 3. Handle selection change
  const handleChange = (selected) => {
    if (!selected) {
      onChange({ name: "", iso2Code: "", iso3Code: "", isCustom: false });
      return;
    }

    if (selected.__isNew__ || selected.isCustom) {
      // Custom country (e.g. Atlantis) - clears ISO codes to prevent stale/incorrect codes
      onChange({
        name: selected.value,
        iso2Code: "",
        iso3Code: "",
        isCustom: true,
      });
    } else {
      // Standard country - auto-populates correct ISO codes
      onChange({
        name: selected.label,
        iso2Code: selected.alpha2,
        iso3Code: selected.alpha3,
        isCustom: false,
      });
    }
  };

  // 4. Premium theme styles matching existing tailwind input elements
  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: error ? "#ef4444" : state.isFocused ? "#007aff" : "#e2e8f0",
      borderRadius: "0.75rem",
      fontSize: "12px",
      boxShadow: "none",
      minHeight: "38px",
      "&:hover": { borderColor: error ? "#ef4444" : state.isFocused ? "#007aff" : "#cbd5e1" },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "#007aff" : state.isFocused ? "#f8fafc" : "white",
      color: state.isSelected ? "white" : "#334155",
      fontSize: "12px",
    }),
  };

  return (
    <CreatableSelect
      isClearable
      options={countryOptions}
      value={selectedOption}
      onChange={handleChange}
      styles={customStyles}
      placeholder="Search country..."
      formatCreateLabel={(inputValue) => `+ Add "${inputValue}"`}
      className={className}
    />
  );
}
