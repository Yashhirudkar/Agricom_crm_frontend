"use client";

import React, { useState, useEffect, useRef } from "react";
import MonthlyStockGrid from "./MonthlyStockGrid";
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Plus,
  Copy,
  ArrowUp,
  ArrowDown,
  Trash2,
  Edit2,
  Save,
  Check,
  GripHorizontal,
} from "lucide-react";
import { toast } from "sonner";

export default function MonthlyStockSectionCard({
  section,
  index,
  totalSections,
  onSaveSection,
  onRenameSection,
  onDuplicateSection,
  onDeleteSection,
  onMoveUpSection,
  onMoveDownSection,
  isReadOnly = false,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(section.sectionName);

  // Freeform Position & Dimensions (x, y, width, height)
  const defaultX = (section.layoutX && section.layoutX > 0) ? section.layoutX : (index % 2) * 540 + 20;
  const defaultY = (section.layoutY && section.layoutY > 0) ? section.layoutY : Math.floor(index / 2) * 380 + 20;
  const defaultW = section.layoutWidth && section.layoutWidth > 12 ? section.layoutWidth : 520;
  const defaultH = section.layoutHeight && section.layoutHeight > 1 ? section.layoutHeight : 340;

  const [pos, setPos] = useState({ x: defaultX, y: defaultY });
  const [size, setSize] = useState({ width: defaultW, height: defaultH });
  const [isDragging, setIsDragging] = useState(false);

  const [columns, setColumns] = useState(section.columns || []);
  const [rows, setRows] = useState(section.rows || []);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  const cardRef = useRef(null);

  useEffect(() => {
    setTitleInput(section.sectionName);
    const initX = (section.layoutX && section.layoutX > 0) ? section.layoutX : (index % 2) * 540 + 20;
    const initY = (section.layoutY && section.layoutY > 0) ? section.layoutY : Math.floor(index / 2) * 380 + 20;
    const initW = section.layoutWidth && section.layoutWidth > 12 ? section.layoutWidth : 520;
    const initH = section.layoutHeight && section.layoutHeight > 1 ? section.layoutHeight : 340;

    setPos({ x: initX, y: initY });
    setSize({ width: initW, height: initH });
    setColumns(section.columns || []);

    const formattedRows = (section.rows || []).map((r) => {
      const cellsMap = {};
      (r.cells || []).forEach((c) => {
        if (c.columnId) cellsMap[c.columnId] = c.value || "";
        const matchCol = (section.columns || []).find((col) => col.id === c.columnId);
        if (matchCol?.columnKey) {
          cellsMap[matchCol.columnKey] = c.value || "";
        }
      });
      return {
        id: r.id,
        rowOrder: r.rowOrder,
        isTotalRow: r.isTotalRow,
        cellsMap,
      };
    });
    setRows(formattedRows);
    setIsDirty(false);
  }, [section, index]);

  const markDirty = () => {
    setIsDirty(true);
  };

  const handleSaveTitle = () => {
    if (titleInput && titleInput.trim() && titleInput.trim() !== section.sectionName) {
      onRenameSection(section.id, titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  const handleSave = async (isAutoSave = false) => {
    if (isReadOnly) return;
    setSaving(true);
    try {
      const sanitizedColumns = columns.map((col) => ({
        id: col.id || undefined,
        columnName: col.columnName,
        columnKey: col.columnKey,
        displayOrder: col.displayOrder,
      }));

      const sanitizedRows = rows.map((r) => {
        const cells = columns.map((c) => {
          const colKey = c.id || c.columnKey;
          const val = r.cellsMap
            ? (r.cellsMap[colKey] !== undefined
                ? r.cellsMap[colKey]
                : (c.id ? r.cellsMap[c.id] || "" : ""))
            : "";
          return {
            columnId: c.id || undefined,
            columnKey: c.columnKey,
            value: val,
          };
        });

        return {
          id: r.id || undefined,
          rowOrder: r.rowOrder,
          isTotalRow: r.isTotalRow,
          cells,
        };
      });

      await onSaveSection(section.id, {
        sectionName: titleInput,
        layoutX: pos.x,
        layoutY: pos.y,
        layoutWidth: size.width,
        layoutHeight: size.height,
        columns: sanitizedColumns,
        rows: sanitizedRows,
      });
      setIsDirty(false);
      if (!isAutoSave) {
        toast.success(`Section "${titleInput}" saved successfully!`);
      }
    } catch (err) {
      console.error("Save section error:", err);
      if (!isAutoSave) {
        toast.error("Failed to save section.");
      }
    } finally {
      setSaving(false);
    }
  };

  // Excel / Google Sheets Automatic Background Auto-Save (2.5s debounce)
  useEffect(() => {
    if (!isDirty || isReadOnly || saving) return;

    const timer = setTimeout(() => {
      handleSave(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, [isDirty, columns, rows, titleInput, pos, size, isReadOnly]);

  // ─── FREEFORM DRAG & DROP POSITIONING ─────────────────────────────────────

  const handleDragMouseDown = (e) => {
    if (isReadOnly || isEditingTitle) return;
    // Don't initiate drag if clicking buttons/inputs
    if (e.target.closest("button, input, select, svg")) return;

    e.preventDefault();
    setIsDragging(true);

    const startX = e.clientX - pos.x;
    const startY = e.clientY - pos.y;

    const handleMouseMove = (moveEvent) => {
      const newX = Math.max(0, moveEvent.clientX - startX);
      const newY = Math.max(0, moveEvent.clientY - startY);
      setPos({ x: newX, y: newY });
      markDirty();
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // ─── CORNER RESIZE HANDLE (◢) ─────────────────────────────────────────────

  const handleCornerResizeMouseDown = (e) => {
    if (isReadOnly) return;
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const handleMouseMove = (moveEvent) => {
      const newW = Math.max(300, startWidth + (moveEvent.clientX - startX));
      const newH = Math.max(160, startHeight + (moveEvent.clientY - startY));
      setSize({ width: newW, height: newH });
      markDirty();
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // ─── COLUMN & ROW ACTIONS ──────────────────────────────────────────────────

  const handleAddColumn = () => {
    const newColKey = `col_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newCol = {
      id: null,
      columnName: "NEW COLUMN",
      columnKey: newColKey,
      displayOrder: columns.length + 1,
      isEditing: true,
    };

    setColumns([...columns, newCol]);
    markDirty();
  };

  const handleColumnInsertLeft = (cIdx) => {
    const newColKey = `col_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newCol = {
      id: null,
      columnName: "NEW COLUMN",
      columnKey: newColKey,
      displayOrder: cIdx + 1,
      isEditing: true,
    };

    const updated = [...columns];
    updated.splice(cIdx, 0, newCol);
    updated.forEach((c, i) => (c.displayOrder = i + 1));
    setColumns(updated);
    markDirty();
  };

  const handleColumnInsertRight = (cIdx) => {
    const newColKey = `col_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newCol = {
      id: null,
      columnName: "NEW COLUMN",
      columnKey: newColKey,
      displayOrder: cIdx + 2,
      isEditing: true,
    };

    const updated = [...columns];
    updated.splice(cIdx + 1, 0, newCol);
    updated.forEach((c, i) => (c.displayOrder = i + 1));
    setColumns(updated);
    markDirty();
  };

  const handleColumnRename = (colIdOrKey, newName) => {
    setColumns(
      columns.map((c) => {
        if (c.id === colIdOrKey || c.columnKey === colIdOrKey) {
          return { ...c, columnName: newName, isEditing: false };
        }
        return c;
      })
    );
    markDirty();
  };

  const handleColumnMoveLeft = (cIdx) => {
    if (cIdx <= 1) return;
    const newCols = [...columns];
    const temp = newCols[cIdx];
    newCols[cIdx] = newCols[cIdx - 1];
    newCols[cIdx - 1] = temp;

    newCols.forEach((c, i) => (c.displayOrder = i + 1));
    setColumns(newCols);
    markDirty();
  };

  const handleColumnMoveRight = (cIdx) => {
    if (cIdx >= columns.length - 1) return;
    const newCols = [...columns];
    const temp = newCols[cIdx];
    newCols[cIdx] = newCols[cIdx + 1];
    newCols[cIdx + 1] = temp;

    newCols.forEach((c, i) => (c.displayOrder = i + 1));
    setColumns(newCols);
    markDirty();
  };

  const handleColumnDuplicate = (colIdOrKey) => {
    const colToDup = columns.find((c) => c.id === colIdOrKey || c.columnKey === colIdOrKey);
    if (!colToDup) return;
    const newCol = {
      id: null,
      columnName: `${colToDup.columnName} (Copy)`,
      columnKey: `col_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      displayOrder: columns.length + 1,
    };
    setColumns([...columns, newCol]);
    markDirty();
  };

  const handleColumnDelete = (colIdOrKey) => {
    const colToDelete = columns.find((c) => c.id === colIdOrKey || c.columnKey === colIdOrKey);
    if (colToDelete?.columnName === "SR") {
      toast.error("SR column cannot be deleted.");
      return;
    }
    setColumns(columns.filter((c) => c.id !== colIdOrKey && c.columnKey !== colIdOrKey));
    markDirty();
  };

  const handleAddRow = (isTotal = false) => {
    const newRow = {
      id: null,
      rowOrder: rows.length + 1,
      isTotalRow: isTotal,
      cellsMap: {},
    };
    setRows([...rows, newRow]);
    markDirty();
  };

  const handleRowInsertAbove = (rIdx) => {
    const newRow = { id: null, rowOrder: rIdx + 1, isTotalRow: false, cellsMap: {} };
    const updated = [...rows];
    updated.splice(rIdx, 0, newRow);
    updated.forEach((r, i) => (r.rowOrder = i + 1));
    setRows(updated);
    markDirty();
  };

  const handleRowInsertBelow = (rIdx) => {
    const newRow = { id: null, rowOrder: rIdx + 2, isTotalRow: false, cellsMap: {} };
    const updated = [...rows];
    updated.splice(rIdx + 1, 0, newRow);
    updated.forEach((r, i) => (r.rowOrder = i + 1));
    setRows(updated);
    markDirty();
  };

  const handleRowDuplicate = (rIdx) => {
    const sourceRow = rows[rIdx];
    const newRow = {
      id: null,
      rowOrder: rIdx + 2,
      isTotalRow: sourceRow.isTotalRow,
      cellsMap: { ...(sourceRow.cellsMap || {}) },
    };
    const updated = [...rows];
    updated.splice(rIdx + 1, 0, newRow);
    updated.forEach((r, i) => (r.rowOrder = i + 1));
    setRows(updated);
    markDirty();
  };

  const handleRowMoveUp = (rIdx) => {
    if (rIdx <= 0) return;
    const updated = [...rows];
    const temp = updated[rIdx];
    updated[rIdx] = updated[rIdx - 1];
    updated[rIdx - 1] = temp;
    updated.forEach((r, i) => (r.rowOrder = i + 1));
    setRows(updated);
    markDirty();
  };

  const handleRowMoveDown = (rIdx) => {
    if (rIdx >= rows.length - 1) return;
    const updated = [...rows];
    const temp = updated[rIdx];
    updated[rIdx] = updated[rIdx + 1];
    updated[rIdx + 1] = temp;
    updated.forEach((r, i) => (r.rowOrder = i + 1));
    setRows(updated);
    markDirty();
  };

  const handleRowDelete = (rIdx) => {
    const updated = rows.filter((_, idx) => idx !== rIdx);
    updated.forEach((r, i) => (r.rowOrder = i + 1));
    setRows(updated);
    markDirty();
  };

  const handleUpdateGrid = (newRows) => {
    setRows(newRows);
    markDirty();
  };

  return (
    <div
      ref={cardRef}
      style={{
        position: "absolute",
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        width: `${size.width}px`,
        minHeight: `${size.height}px`,
      }}
      className={`print-section-card bg-white py-2 space-y-2 border border-gray-300 shadow-md rounded-lg z-20 print:static print:left-auto print:top-auto print:w-full print:min-w-0 print:max-w-full print:h-auto print:min-h-0 print:shadow-none print:border print:border-gray-400 print:break-inside-avoid print:mb-0 ${
        isDragging ? "opacity-90 shadow-2xl ring-2 ring-[#107c41] z-30" : ""
      }`}
    >
      {/* Section Header Bar - Drag Handle */}
      <div
        onMouseDown={handleDragMouseDown}
        className={`px-3 py-2 bg-[#f8fafc] border-l-4 border-[#107c41] border-b border-[#cbd5e1] flex flex-wrap items-center justify-between gap-2 rounded-t-md select-none print:py-1 print:bg-gray-100 print:border-l-4 print:border-gray-800 ${
          !isReadOnly ? "cursor-grab active:cursor-grabbing" : ""
        }`}
        title="Drag header to move section block"
      >
        <div className="flex items-center gap-2">
          {!isReadOnly && <GripHorizontal className="h-4 w-4 text-gray-400 flex-shrink-0 no-print" />}

          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="p-0.5 hover:bg-gray-200 rounded text-gray-500 transition-colors cursor-pointer no-print"
          >
            {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>

          {isEditingTitle ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveTitle();
                  if (e.key === "Escape") setIsEditingTitle(false);
                }}
                autoFocus
                className="px-2 py-0.5 text-xs font-bold border border-[#107c41] bg-white text-gray-900 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSaveTitle}
                className="p-0.5 text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <h3
              onDoubleClick={() => !isReadOnly && setIsEditingTitle(true)}
              className="text-xs font-extrabold text-gray-900 tracking-wider uppercase font-sans flex items-center gap-1.5 cursor-pointer group truncate max-w-[200px] print:max-w-none print:text-xs print:font-black"
            >
              <span className="truncate">{titleInput}</span>
              {!isReadOnly && (
                <Edit2
                  onClick={() => setIsEditingTitle(true)}
                  className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-emerald-600 transition-opacity flex-shrink-0 no-print"
                />
              )}
            </h3>
          )}

          <div className="flex items-center gap-1.5 ml-1 no-print">
            <span className="text-[10px] font-mono text-gray-500">
              ({rows.length}r, {columns.length}c)
            </span>
            {saving ? (
              <span className="px-1.5 py-0.2 text-[10px] font-bold text-blue-700 bg-blue-50 rounded animate-pulse">
                ● Saving...
              </span>
            ) : isDirty ? (
              <span className="px-1.5 py-0.2 text-[10px] font-bold text-amber-700 bg-amber-50 rounded">
                ● Editing...
              </span>
            ) : (
              <span className="px-1.5 py-0.2 text-[10px] font-bold text-emerald-700 bg-emerald-50 rounded">
                Saved ✓
              </span>
            )}
          </div>
        </div>

        {/* Section Header Controls */}
        <div className="flex items-center gap-1.5 no-print">
          {!isReadOnly && (
            <>
              <button
                type="button"
                onClick={handleAddColumn}
                className="px-2 py-0.5 bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title="Instant blank column creation"
              >
                <Plus className="h-3 w-3 text-[#107c41]" />
                Col
              </button>

              <button
                type="button"
                onClick={() => handleAddRow(false)}
                className="px-2 py-0.5 bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="h-3 w-3 text-blue-600" />
                Row
              </button>

              <button
                type="button"
                onClick={() => handleAddRow(true)}
                className="px-2 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                title="Add Excel TOTAL row with Auto Sum calculation"
              >
                + TOTAL Row
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !isDirty}
                className={`px-2.5 py-0.5 text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  isDirty
                    ? "bg-[#107c41] hover:bg-emerald-700 text-white shadow-2xs"
                    : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                }`}
              >
                {saving ? (
                  <div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="h-3 w-3" />
                )}
                Save
              </button>
            </>
          )}

          {!isReadOnly && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1 hover:bg-gray-200 rounded text-gray-500 transition-colors cursor-pointer"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-8 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-50 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingTitle(true);
                    setMenuOpen(false);
                  }}
                  className="w-full px-4 py-1.5 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5 text-blue-500" />
                  Rename Section
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onDuplicateSection(section.id);
                    setMenuOpen(false);
                  }}
                  className="w-full px-4 py-1.5 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5 text-indigo-500" />
                  Duplicate Structure
                </button>

                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      onMoveUpSection(index);
                      setMenuOpen(false);
                    }}
                    className="w-full px-4 py-1.5 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowUp className="h-3.5 w-3.5 text-gray-500" />
                    Move Up
                  </button>
                )}

                {index < totalSections - 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      onMoveDownSection(index);
                      setMenuOpen(false);
                    }}
                    className="w-full px-4 py-1.5 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowDown className="h-3.5 w-3.5 text-gray-500" />
                    Move Down
                  </button>
                )}

                <div className="my-1 border-t border-gray-100" />

                <button
                  type="button"
                  onClick={() => {
                    onDeleteSection(section.id);
                    setMenuOpen(false);
                  }}
                  className="w-full px-4 py-1.5 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5 text-red-500" />
                  Delete Section
                </button>
              </div>
            )}
          </div>
        )}
        </div>
      </div>

      {/* Grid Content */}
      {!collapsed && (
        <MonthlyStockGrid
          columns={columns}
          rows={rows}
          onUpdateGrid={handleUpdateGrid}
          onColumnRename={handleColumnRename}
          onColumnInsertLeft={handleColumnInsertLeft}
          onColumnInsertRight={handleColumnInsertRight}
          onColumnMoveLeft={handleColumnMoveLeft}
          onColumnMoveRight={handleColumnMoveRight}
          onColumnDuplicate={handleColumnDuplicate}
          onColumnDelete={handleColumnDelete}
          onRowInsertAbove={handleRowInsertAbove}
          onRowInsertBelow={handleRowInsertBelow}
          onRowDuplicate={handleRowDuplicate}
          onRowMoveUp={handleRowMoveUp}
          onRowMoveDown={handleRowMoveDown}
          onRowDelete={handleRowDelete}
          isReadOnly={isReadOnly}
        />
      )}

      {/* Excel Table Corner Resize Handle ◢ */}
      {!isReadOnly && (
        <div
          onMouseDown={handleCornerResizeMouseDown}
          className="absolute right-0 bottom-0 w-4 h-4 cursor-nwse-resize z-40 flex items-end justify-end p-0.5 text-gray-400 hover:text-[#107c41] transition-colors select-none no-print"
          title="Excel Table Corner Resize Handle (Drag mouse to resize block width & height)"
        >
          <svg className="w-3.5 h-3.5 fill-current pointer-events-none" viewBox="0 0 10 10">
            <path d="M6 9 L9 6 L9 9 Z M3 9 L9 3 L9 4.5 L4.5 9 Z M0 9 L9 0 L9 1.5 L1.5 9 Z" />
          </svg>
        </div>
      )}
    </div>
  );
}
