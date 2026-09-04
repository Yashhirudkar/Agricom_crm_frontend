"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  MoreHorizontal,
  ArrowLeft,
  ArrowRight,
  Copy,
  Trash2,
  Edit2,
  Check,
  Plus,
} from "lucide-react";

export default function MonthlyStockColumnHeader({
  column,
  index,
  totalColumns,
  width = 140,
  onResize,
  onRename,
  onInsertLeft,
  onInsertRight,
  onMoveLeft,
  onMoveRight,
  onDuplicate,
  onDelete,
  isReadOnly = false,
  isFirstColumn = false,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [isEditingName, setIsEditingName] = useState(column.isEditing || false);
  const [nameInput, setNameInput] = useState(column.columnName);
  const [isResizing, setIsResizing] = useState(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(width);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setNameInput(column.columnName);
    if (column.isEditing) {
      setIsEditingName(true);
    }
  }, [column.columnName, column.isEditing]);

  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingName]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target)
      ) {
        if (isEditingName) {
          handleSaveName();
        }
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditingName, nameInput]);

  const openMenuAtElement = () => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 4, left: rect.left });
      setMenuOpen(true);
    }
  };

  // Column Resizing Handler
  const handleMouseDownResize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = width || 130;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startXRef.current;
      const newWidth = Math.max(60, startWidthRef.current + deltaX);
      if (onResize) {
        onResize(column.id || column.columnKey, newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleSaveName = () => {
    const trimmed = nameInput ? nameInput.trim() : "";
    const finalName = trimmed || "NEW COLUMN";
    onRename(column.id || column.columnKey, finalName);
    setIsEditingName(false);
    setMenuOpen(false);
  };

  // Right Click Context Menu Handler
  const handleContextMenu = (e) => {
    if (isReadOnly || isFirstColumn) return;
    e.preventDefault();
    e.stopPropagation();
    openMenuAtElement();
  };

  const headerStyle = {
    width: `${width}px`,
    minWidth: `${width}px`,
    maxWidth: `${width}px`,
  };

  const headerClasses = `
    relative h-8 px-2 flex items-center justify-between font-bold text-[11px] text-gray-800 bg-[#f8fafc] tracking-wider uppercase border-r border-b border-[#cbd5e1] select-none group
    ${isFirstColumn ? "sticky left-0 z-30 bg-[#e2e8f0] text-gray-900 justify-center" : ""}
    ${isResizing ? "bg-blue-100" : ""}
  `;

  return (
    <div
      className={headerClasses}
      style={headerStyle}
      ref={menuRef}
      onContextMenu={handleContextMenu}
      onDoubleClick={() => {
        if (!isReadOnly && !isFirstColumn) {
          setIsEditingName(true);
        }
      }}
    >
      {isEditingName ? (
        <div className="flex items-center gap-1 w-full">
          <input
            ref={inputRef}
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveName();
              if (e.key === "Escape") setIsEditingName(false);
            }}
            className="w-full px-1 py-0.5 text-xs font-bold border border-[#107c41] bg-white text-gray-900 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleSaveName}
            className="p-0.5 text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer"
          >
            <Check className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <>
          <span className="truncate pr-1 font-sans text-[11px]" title="Double click to edit column name">
            {column.columnName}
          </span>

          {!isReadOnly && !isFirstColumn && (
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Boundary + Insert Button */}
              {onInsertRight && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onInsertRight(index);
                  }}
                  className="p-0.5 hover:bg-emerald-100 text-emerald-700 rounded transition-colors cursor-pointer"
                  title="Insert Column Right"
                >
                  <Plus className="h-3 w-3" />
                </button>
              )}

              {/* Menu Trigger */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (menuOpen) {
                    setMenuOpen(false);
                  } else {
                    openMenuAtElement();
                  }
                }}
                className="p-0.5 hover:bg-gray-200 rounded text-gray-500 transition-colors cursor-pointer flex-shrink-0"
                title="Column Options (Right Click)"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Column Resizer Edge (↔ Cursor) */}
          {!isFirstColumn && (
            <div
              onMouseDown={handleMouseDownResize}
              className="absolute right-0 top-0 bottom-0 w-1.5 hover:w-2 hover:bg-[#107c41] cursor-col-resize z-20 group-hover:bg-gray-300"
              title="Drag to resize column width"
            />
          )}

          {/* Floating Context Menu Portal (Does NOT affect layout flow!) */}
          {menuOpen &&
            !isReadOnly &&
            typeof window !== "undefined" &&
            createPortal(
              <div
                ref={dropdownRef}
                style={{
                  position: "fixed",
                  top: `${menuPos.top}px`,
                  left: `${menuPos.left}px`,
                  zIndex: 9999,
                }}
                className="w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 text-xs font-normal normal-case tracking-normal"
              >
                {onInsertLeft && (
                  <button
                    type="button"
                    onClick={() => {
                      onInsertLeft(index);
                      setMenuOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5 text-emerald-600" />
                    Insert Column Left
                  </button>
                )}

                {onInsertRight && (
                  <button
                    type="button"
                    onClick={() => {
                      onInsertRight(index);
                      setMenuOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5 text-emerald-600" />
                    Insert Column Right
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setIsEditingName(true);
                    setMenuOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5 text-blue-500" />
                  Rename Column
                </button>

                {index > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      onMoveLeft(index);
                      setMenuOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5 text-gray-500" />
                    Move Left
                  </button>
                )}

                {index < totalColumns - 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      onMoveRight(index);
                      setMenuOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowRight className="h-3.5 w-3.5 text-gray-500" />
                    Move Right
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    onDuplicate(column.id || column.columnKey);
                    setMenuOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5 text-indigo-500" />
                  Duplicate Column
                </button>

                <div className="my-1 border-t border-gray-100" />

                <button
                  type="button"
                  onClick={() => {
                    onDelete(column.id || column.columnKey);
                    setMenuOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5 text-red-500" />
                  Delete Column
                </button>
              </div>,
              document.body
            )}
        </>
      )}
    </div>
  );
}

