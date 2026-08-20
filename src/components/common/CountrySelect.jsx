import React, { useMemo, useState } from "react";
import CreatableSelect from "react-select/creatable";
import {
  getAllCountryOptions,
  getAlpha2Code,
  findCountryOption,
  COUNTRY_ALIASES,
} from "@/lib/countryUtils";

export default function CountrySelect({ value, onChange, error, className }) {
  const [inputValue, setInputValue] = useState("");

  // 1. Generate sorted country options once and cache it via useMemo
  const countryOptions = useMemo(() => {
    return getAllCountryOptions();
  }, []);

  // 2. Dynamically filter & rank options based on search query so prefix & ISO matches come first
  const filteredOptions = useMemo(() => {
    if (!inputValue || !inputValue.trim()) return countryOptions;

    const q = inputValue.toLowerCase().trim();

    const getOptionRank = (opt) => {
      const label = opt.label.toLowerCase();
      const alpha2 = (opt.alpha2 || "").toLowerCase();
      const alpha3 = (opt.alpha3 || "").toLowerCase();

      // Rank 1: Exact ISO code match or exact country name
      if (alpha2 === q || alpha3 === q || label === q) return 1;

      // Rank 2: Starts with query (e.g. "China", "India", "Indonesia")
      if (label.startsWith(q)) return 2;

      // Rank 2: Common country aliases (e.g., "uk", "usa", "uae", "prc", "china")
      const aliasedCode = COUNTRY_ALIASES[q];
      if (aliasedCode && aliasedCode.toLowerCase() === alpha2) return 2;
      if (q === "china" && alpha2 === "cn") return 2;
      if (q === "prc" && alpha2 === "cn") return 2;
      if (q === "uk" && (alpha2 === "gb" || label.includes("united kingdom"))) return 2;
      if (q === "usa" && (alpha2 === "us" || label.includes("united states"))) return 2;
      if (q === "uae" && (alpha2 === "ae" || label.includes("united arab emirates"))) return 2;

      // Rank 3: Word boundary prefix match (e.g. "Emirates" in "United Arab Emirates")
      const words = label.split(/[\s,()]+/);
      if (words.some((w) => w.startsWith(q))) return 3;

      // Rank 4: General substring match (e.g. "Argentina" for "in")
      if (label.includes(q)) return 4;

      return 0; // No match
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

  // 3. Map current string value from parent state to select option object
  const selectedOption = useMemo(() => {
    return findCountryOption(value, countryOptions);
  }, [value, countryOptions]);

  // 4. Handle selection change
  const handleChange = (selected) => {
    if (!selected) {
      onChange({ name: "", iso2Code: "", iso3Code: "", isCustom: false });
      return;
    }

    if (selected.__isNew__ || selected.isCustom) {
      // Custom country - clears ISO codes
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

  const handleInputChange = (val, { action }) => {
    if (action === "input-change") {
      setInputValue(val);
    } else if (action === "input-blur" || action === "menu-close") {
      setInputValue("");
    }
  };

  // 5. Premium theme styles matching existing tailwind input elements
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
      cursor: "pointer",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  return (
    <CreatableSelect
      isClearable
      options={filteredOptions}
      value={selectedOption}
      onChange={handleChange}
      onInputChange={handleInputChange}
      inputValue={inputValue}
      filterOption={() => true}
      menuPortalTarget={typeof document !== "undefined" ? document.body : null}
      menuPosition="fixed"
      styles={customStyles}
      placeholder="Search country..."
      formatCreateLabel={(val) => `+ Add "${val}"`}
      className={className}
    />
  );
}
