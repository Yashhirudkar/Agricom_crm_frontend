"use client";
import React, { useMemo, useState } from "react";
import CreatableSelect from "react-select/creatable";
import {
  getAllCountryOptions,
  COUNTRY_ALIASES,
} from "@/lib/countryUtils";

export default function CountryMultiSelect({ value = [], onChange, error, className, disabled = false }) {
  const [inputValue, setInputValue] = useState("");

  // 1. Generate sorted country options once
  const countryOptions = useMemo(() => {
    return getAllCountryOptions();
  }, []);

  // 2. Dynamically filter & rank options based on search query
  const filteredOptions = useMemo(() => {
    if (!inputValue || !inputValue.trim()) return countryOptions;

    const q = inputValue.toLowerCase().trim();

    const getOptionRank = (opt) => {
      const label = opt.label.toLowerCase();
      const alpha2 = (opt.alpha2 || "").toLowerCase();
      const alpha3 = (opt.alpha3 || "").toLowerCase();

      if (alpha2 === q || alpha3 === q || label === q) return 1;
      if (label.startsWith(q)) return 2;

      const aliasedCode = COUNTRY_ALIASES[q];
      if (aliasedCode && aliasedCode.toLowerCase() === alpha2) return 2;
      if (q === "china" && alpha2 === "cn") return 2;
      if (q === "prc" && alpha2 === "cn") return 2;
      if (q === "uk" && (alpha2 === "gb" || label.includes("united kingdom"))) return 2;
      if (q === "usa" && (alpha2 === "us" || label.includes("united states"))) return 2;
      if (q === "uae" && (alpha2 === "ae" || label.includes("united arab emirates"))) return 2;

      const words = label.split(/[\s,()]+/);
      if (words.some((w) => w.startsWith(q))) return 3;
      if (label.includes(q)) return 4;

      return 0;
    };

    const scored = [];
    for (const opt of countryOptions) {
      const rank = getOptionRank(opt);
      if (rank > 0) {
        scored.push({ opt, rank });
      }
    }

    scored.sort((a, b) => {
      if (a.rank !== b.rank) return a.rank - b.rank;
      return a.opt.label.localeCompare(b.opt.label);
    });

    return scored.map((item) => item.opt);
  }, [countryOptions, inputValue]);

  // 3. Map selected array from parent state to select option objects
  const selectedOptions = useMemo(() => {
    if (!Array.isArray(value)) return [];

    return value.map((val) => {
      const name = typeof val === "object" ? val.countryName || val.name : val;
      const code = typeof val === "object" ? val.iso2Code || val.code : "";

      const found = countryOptions.find(
        (opt) =>
          opt.label.toLowerCase() === (name || "").toLowerCase() ||
          (code && opt.alpha2.toLowerCase() === code.toLowerCase())
      );

      if (found) return found;

      return {
        value: name,
        label: name,
        alpha2: code || "CUSTOM",
        alpha3: "CUSTOM",
        isCustom: true,
      };
    });
  }, [value, countryOptions]);

  // 4. Handle multi-selection change
  const handleChange = (selected) => {
    if (!selected || selected.length === 0) {
      onChange([]);
      return;
    }

    const result = selected.map((item) => ({
      iso2Code: item.alpha2 || "CUSTOM",
      countryName: item.label || item.value,
    }));

    onChange(result);
  };

  const handleInputChange = (val, { action }) => {
    if (action === "input-change") {
      setInputValue(val);
    } else if (action === "input-blur" || action === "menu-close") {
      setInputValue("");
    }
  };

  // 5. Custom styles matching Agricom UI guidelines
  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: error ? "#ef4444" : state.isFocused ? "#007aff" : "#e2e8f0",
      borderRadius: "0.75rem",
      fontSize: "12px",
      boxShadow: "none",
      minHeight: "42px",
      backgroundColor: disabled ? "#f8fafc" : "white",
      "&:hover": { borderColor: error ? "#ef4444" : state.isFocused ? "#007aff" : "#cbd5e1" },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "#007aff" : state.isFocused ? "#f8fafc" : "white",
      color: state.isSelected ? "white" : "#334155",
      fontSize: "12px",
      cursor: "pointer",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#eff6ff",
      borderRadius: "0.5rem",
      border: "1px solid #bfdbfe",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#1d4ed8",
      fontSize: "11px",
      fontWeight: "600",
      padding: "2px 6px",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#3b82f6",
      "&:hover": {
        backgroundColor: "#dbeafe",
        color: "#1e40af",
        borderRadius: "0.375rem",
      },
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  return (
    <CreatableSelect
      isMulti
      isClearable
      isDisabled={disabled}
      options={filteredOptions}
      value={selectedOptions}
      onChange={handleChange}
      onInputChange={handleInputChange}
      inputValue={inputValue}
      filterOption={() => true}
      menuPortalTarget={typeof document !== "undefined" ? document.body : null}
      menuPosition="fixed"
      styles={customStyles}
      placeholder="Search and select countries..."
      formatCreateLabel={(val) => `+ Add "${val}"`}
      className={className}
    />
  );
}
