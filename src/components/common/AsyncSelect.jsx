import React from "react";
import AsyncSelect from "react-select/async";

export default function ReusableAsyncSelect({
  loadOptions,
  value,
  onChange,
  placeholder = "Search...",
  error = false,
  className = "",
  isClearable = true,
}) {
  const customStyles = {
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
    }),
    singleValue: (base) => ({
      ...base,
      color: "#334155",
      fontSize: "12px",
    }),
  };

  return (
    <AsyncSelect
      cacheOptions
      defaultOptions
      isClearable={isClearable}
      loadOptions={loadOptions}
      value={value}
      onChange={onChange}
      styles={customStyles}
      placeholder={placeholder}
      className={className}
    />
  );
}
