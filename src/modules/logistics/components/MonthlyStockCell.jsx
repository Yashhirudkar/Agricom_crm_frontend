"use client";

import React, { useRef, useEffect } from "react";

export default function MonthlyStockCell({
  value = "",
  onChange,
  isEditing = false,
  isFocused = false,
  isSelected = false,
  isTotalRow = false,
  isReadOnly = false,
  isFirstColumn = false,
  onFocus,
  onMouseDown,
  onMouseEnter,
  onDoubleClick,
  placeholder = "",
  width,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // Position cursor at end of input or select all
      inputRef.current.select();
    }
  }, [isEditing]);

  const cellStyle = width ? { width: `${width}px`, minWidth: `${width}px`, maxWidth: `${width}px` } : {};

  // Excel Native Cell Styling
  // Flat cells, sharp 1px gridlines (#e2e8f0), no rounded corners
  const cellClasses = `
    relative h-8 px-2 flex items-center text-xs transition-none select-none font-sans font-normal border-r border-b border-[#e2e8f0]
    ${isTotalRow ? "font-bold text-gray-900 bg-[#f1f5f9]" : "text-gray-900 bg-white"}
    ${isFirstColumn ? "font-bold text-gray-900 justify-center bg-[#f8fafc]" : ""}
    ${isSelected && !isFocused ? "bg-[#107c41]/10" : ""}
    ${isEditing ? "p-0 z-30 ring-2 ring-[#107c41] bg-white shadow-xs" : "cursor-cell hover:bg-gray-50/70"}
    ${isReadOnly ? "bg-gray-50/70 text-gray-500 cursor-default hover:bg-gray-50/70" : ""}
  `;

  if (isEditing && !isReadOnly) {
    return (
      <div className={cellClasses} style={cellStyle}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full px-2 text-xs font-sans text-gray-900 bg-white focus:outline-none border-none m-0 shadow-none rounded-none"
          placeholder={placeholder}
        />
      </div>
    );
  }

  return (
    <div
      onClick={onFocus}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onDoubleClick={onDoubleClick}
      className={cellClasses}
      style={cellStyle}
    >
      <span className="truncate w-full font-mono text-[12px]">
        {value || (isFirstColumn && isTotalRow ? "TOTAL" : "")}
      </span>
    </div>
  );
}
