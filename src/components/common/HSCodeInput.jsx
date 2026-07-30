import React, { useRef } from "react";

export default function HSCodeInput({
  value = "",
  onChange,
  placeholder = "Enter HS Code",
  disabled = false,
  className = "",
  required = false,
  id,
  name,
}) {
  const inputRef = useRef(null);

  // Helper to sanitize value: allow only numbers (0-9) and dot (.)
  const sanitizeValue = (val) => {
    if (typeof val !== "string" && typeof val !== "number") return "";
    return String(val).replace(/[^0-9.]/g, "");
  };

  const handleInputChange = (e) => {
    const sanitized = sanitizeValue(e.target.value);
    if (onChange) {
      onChange(sanitized);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text/plain");
    const sanitizedPasted = sanitizeValue(pastedText);

    const inputEl = inputRef.current;
    if (inputEl) {
      const start = inputEl.selectionStart || 0;
      const end = inputEl.selectionEnd || 0;
      const currentVal = sanitizeValue(value);
      const newVal = sanitizeValue(
        currentVal.substring(0, start) + sanitizedPasted + currentVal.substring(end)
      );

      if (onChange) {
        onChange(newVal);
      }
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      id={id}
      name={name}
      required={required}
      disabled={disabled}
      value={sanitizeValue(value)}
      onChange={handleInputChange}
      onPaste={handlePaste}
      placeholder={placeholder}
      autoComplete="off"
      className={
        className ||
        "w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#007aff] outline-none text-gray-700 font-mono shadow-xs transition-all disabled:bg-gray-100"
      }
    />
  );
}
