"use client";

import React from "react";
import Select from "react-select";

export const taskSelectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "38px",
    borderRadius: "0.75rem",
    borderColor: state.isFocused ? "#007aff" : "#e5e7eb",
    boxShadow: state.isFocused ? "0 0 0 1px #007aff" : "none",
    "&:hover": {
      borderColor: state.isFocused ? "#007aff" : "#9ca3af",
    },
    fontSize: "0.8125rem",
    backgroundColor: "#ffffff",
    cursor: "pointer",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#eff6ff",
    borderRadius: "0.375rem",
    border: "1px solid #bfdbfe",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#1e40af",
    fontWeight: "600",
    fontSize: "0.75rem",
    padding: "2px 6px",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#3b82f6",
    borderRadius: "0.375rem",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#dbeafe",
      color: "#1d4ed8",
    },
  }),
  option: (base, state) => ({
    ...base,
    fontSize: "0.8125rem",
    backgroundColor: state.isSelected
      ? "#007aff"
      : state.isFocused
      ? "#f3f4f6"
      : "transparent",
    color: state.isSelected ? "white" : "#374151",
    cursor: "pointer",
    "&:active": {
      backgroundColor: "#007aff",
      color: "white",
    },
  }),
  menu: (base) => ({
    ...base,
    zIndex: 99999,
    borderRadius: "0.5rem",
    overflow: "hidden",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 99999,
  }),
};

/**
 * Reusable Employee Multi-Select Dropdown matching Task -> Associates UI/UX.
 *
 * @param {Array} options - List of { value: number|string, label: string }
 * @param {Array} value - Array of selected IDs [1, 2, 3] or objects
 * @param {Function} onChange - Callback receiving array of selected IDs
 * @param {string} placeholder - Placeholder text
 * @param {boolean} isDisabled - Disabled state
 * @param {boolean} isLoading - Loading spinner
 */
export default function EmployeeMultiSelect({
  options = [],
  value = [],
  onChange,
  placeholder = "Select employees...",
  isDisabled = false,
  isLoading = false,
  className = "",
  error = false,
  ...rest
}) {
  const selectedOptions = options.filter((opt) =>
    (value || []).some((v) => String(v) === String(opt.value))
  );

  const customStyles = {
    ...taskSelectStyles,
    control: (base, state) => ({
      ...taskSelectStyles.control(base, state),
      ...(error
        ? {
            borderColor: "#ef4444",
            boxShadow: state.isFocused ? "0 0 0 1px #ef4444" : "none",
          }
        : {}),
    }),
  };

  return (
    <div className={`relative ${className}`}>
      <Select
        isMulti
        options={options}
        value={selectedOptions}
        onChange={(selected) => {
          const ids = selected ? selected.map((s) => s.value) : [];
          onChange(ids);
        }}
        placeholder={placeholder}
        styles={customStyles}
        isDisabled={isDisabled}
        isLoading={isLoading}
        closeMenuOnSelect={false}
        menuPortalTarget={typeof document !== "undefined" ? document.body : null}
        menuPosition="fixed"
        noOptionsMessage={() => "No employees found"}
        {...rest}
      />
    </div>
  );
}

