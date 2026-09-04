"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import MonthlyStockColumnHeader from "./MonthlyStockColumnHeader";
import MonthlyStockCell from "./MonthlyStockCell";
import { MoreVertical, Plus, Copy, ArrowUp, ArrowDown, Trash2 } from "lucide-react";

export default function MonthlyStockGrid({
  columns = [],
  rows = [],
  onUpdateGrid,
  onColumnRename,
  onColumnInsertLeft,
  onColumnInsertRight,
  onColumnMoveLeft,
  onColumnMoveRight,
  onColumnDuplicate,
  onColumnDelete,
  onRowInsertAbove,
  onRowInsertBelow,
  onRowDuplicate,
  onRowMoveUp,
  onRowMoveDown,
  onRowDelete,
  isReadOnly = false,
}) {
  const [focusedCell, setFocusedCell] = useState({ rIdx: 0, cIdx: 0 }); // { rIdx, cIdx }
  const [editingCell, setEditingCell] = useState(null); // { rIdx, cIdx }
  const [activeRowMenu, setActiveRowMenu] = useState(null);
  const [rowMenuPos, setRowMenuPos] = useState({ top: 0, left: 0 });
  const [columnWidths, setColumnWidths] = useState({});
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  // Mouse Drag Range Selection
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);

  const handleResizeColumn = (colId, newWidth) => {
    setColumnWidths((prev) => ({ ...prev, [colId]: newWidth }));
  };

  const isCellSelected = (rIdx, cIdx) => {
    if (!selectionStart || !selectionEnd) return false;
    const minR = Math.min(selectionStart.rIdx, selectionEnd.rIdx);
    const maxR = Math.max(selectionStart.rIdx, selectionEnd.rIdx);
    const minC = Math.min(selectionStart.cIdx, selectionEnd.cIdx);
    const maxC = Math.max(selectionStart.cIdx, selectionEnd.cIdx);
    return rIdx >= minR && rIdx <= maxR && cIdx >= minC && cIdx <= maxC;
  };

  const handleCellMouseDown = (rIdx, cIdx) => {
    setIsMouseDown(true);
    setFocusedCell({ rIdx, cIdx });
    setSelectionStart({ rIdx, cIdx });
    setSelectionEnd({ rIdx, cIdx });
  };

  const handleCellMouseEnter = (rIdx, cIdx) => {
    if (isMouseDown) {
      setSelectionEnd({ rIdx, cIdx });
    }
  };

  const gridRef = useRef(null);
  const rowMenuRef = useRef(null);

  useEffect(() => {
    const handleMouseUpGlobal = () => setIsMouseDown(false);
    const handleClickOutsideRowMenu = (e) => {
      if (rowMenuRef.current && !rowMenuRef.current.contains(e.target)) {
        setActiveRowMenu(null);
      }
    };
    document.addEventListener("mouseup", handleMouseUpGlobal);
    document.addEventListener("mousedown", handleClickOutsideRowMenu);
    return () => {
      document.removeEventListener("mouseup", handleMouseUpGlobal);
      document.removeEventListener("mousedown", handleClickOutsideRowMenu);
    };
  }, []);

  const handleCellChange = (rIdx, cIdx, colId, newValue) => {
    if (isReadOnly) return;
    const updatedRows = [...rows];
    const targetRow = { ...updatedRows[rIdx] };
    const cellsMap = { ...(targetRow.cellsMap || {}) };
    cellsMap[colId] = newValue;
    targetRow.cellsMap = cellsMap;
    updatedRows[rIdx] = targetRow;

    onUpdateGrid(updatedRows);
  };

  // Keyboard Event Handling for Excel Native Feel
  const handleKeyDown = (e) => {
    if (!focusedCell) return;
    const { rIdx, cIdx } = focusedCell;

    // Undo / Redo
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
      if (e.shiftKey) {
        if (historyIdx < history.length - 1) {
          const nextState = history[historyIdx + 1];
          setHistoryIdx((i) => i + 1);
          onUpdateGrid(nextState);
        }
      } else {
        if (historyIdx > 0) {
          const prevState = history[historyIdx - 1];
          setHistoryIdx((i) => i - 1);
          onUpdateGrid(prevState);
        }
      }
      return;
    }

    // Clear Cell Content on Delete/Backspace when focused (not editing)
    if (!editingCell && (e.key === "Delete" || e.key === "Backspace")) {
      e.preventDefault();
      if (!isReadOnly && columns[cIdx]) {
        handleCellChange(rIdx, cIdx, columns[cIdx].id || columns[cIdx].columnKey, "");
      }
      return;
    }

    // Navigation & Typing when not editing
    if (!editingCell) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (rIdx < rows.length - 1) {
          const next = { rIdx: rIdx + 1, cIdx };
          setFocusedCell(next);
          setSelectionStart(next);
          setSelectionEnd(next);
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (rIdx > 0) {
          const next = { rIdx: rIdx - 1, cIdx };
          setFocusedCell(next);
          setSelectionStart(next);
          setSelectionEnd(next);
        }
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        if (cIdx < columns.length - 1) {
          const next = { rIdx, cIdx: cIdx + 1 };
          setFocusedCell(next);
          setSelectionStart(next);
          setSelectionEnd(next);
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (cIdx > 0) {
          const next = { rIdx, cIdx: cIdx - 1 };
          setFocusedCell(next);
          setSelectionStart(next);
          setSelectionEnd(next);
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (e.shiftKey) {
          if (rIdx > 0) {
            const next = { rIdx: rIdx - 1, cIdx };
            setFocusedCell(next);
            setSelectionStart(next);
            setSelectionEnd(next);
          }
        } else {
          setEditingCell({ rIdx, cIdx });
        }
      } else if (e.key === "F2") {
        e.preventDefault();
        setEditingCell({ rIdx, cIdx });
      } else if (e.key === "Tab") {
        e.preventDefault();
        if (e.shiftKey) {
          if (cIdx > 0) {
            const next = { rIdx, cIdx: cIdx - 1 };
            setFocusedCell(next);
            setSelectionStart(next);
            setSelectionEnd(next);
          }
        } else {
          if (cIdx < columns.length - 1) {
            const next = { rIdx, cIdx: cIdx + 1 };
            setFocusedCell(next);
            setSelectionStart(next);
            setSelectionEnd(next);
          }
        }
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && !isReadOnly) {
        // INSTANT TYPING EDITING: Typing any single character starts editing directly with that value!
        setEditingCell({ rIdx, cIdx });
        if (columns[cIdx]) {
          handleCellChange(rIdx, cIdx, columns[cIdx].id || columns[cIdx].columnKey, e.key);
        }
      }
      return;
    }

    // Navigation & Commit when editing
    if (editingCell) {
      if (e.key === "Enter") {
        e.preventDefault();
        setEditingCell(null);
        if (rIdx < rows.length - 1) {
          const next = { rIdx: rIdx + 1, cIdx };
          setFocusedCell(next);
          setSelectionStart(next);
          setSelectionEnd(next);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setEditingCell(null);
      } else if (e.key === "Tab") {
        e.preventDefault();
        setEditingCell(null);
        if (e.shiftKey) {
          if (cIdx > 0) {
            const next = { rIdx, cIdx: cIdx - 1 };
            setFocusedCell(next);
            setSelectionStart(next);
            setSelectionEnd(next);
          }
        } else {
          if (cIdx < columns.length - 1) {
            const next = { rIdx, cIdx: cIdx + 1 };
            setFocusedCell(next);
            setSelectionStart(next);
            setSelectionEnd(next);
          }
        }
      }
    }
  };

  // Clipboard Multi-Cell Matrix Paste Handler
  const handlePaste = (e) => {
    if (isReadOnly || !focusedCell) return;
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || editingCell) return;

    const clipboardData = e.clipboardData.getData("text/plain");
    if (!clipboardData) return;

    e.preventDefault();
    const pastedMatrix = clipboardData
      .split(/\r\n|\n|\r/)
      .map((row) => row.split("\t"));

    if (pastedMatrix.length === 0) return;

    const startR = focusedCell.rIdx;
    const startC = focusedCell.cIdx;

    let updatedRows = [...rows];

    // Append extra empty rows if pasted matrix exceeds current rows length
    const neededRows = startR + pastedMatrix.length;
    while (updatedRows.length < neededRows) {
      updatedRows.push({
        id: null,
        rowOrder: updatedRows.length + 1,
        isTotalRow: false,
        cellsMap: {},
      });
    }

    pastedMatrix.forEach((pRow, rOffset) => {
      const targetR = startR + rOffset;
      if (targetR < updatedRows.length) {
        const targetRow = { ...updatedRows[targetR] };
        const cellsMap = { ...(targetRow.cellsMap || {}) };

        pRow.forEach((val, cOffset) => {
          const targetC = startC + cOffset;
          if (targetC < columns.length) {
            const col = columns[targetC];
            cellsMap[col.id || col.columnKey] = val.trim();
          }
        });

        targetRow.cellsMap = cellsMap;
        updatedRows[targetR] = targetRow;
      }
    });

    onUpdateGrid(updatedRows);
  };

  const computeColumnSum = (colKey) => {
    let sum = 0;
    let hasNumber = false;
    rows.forEach((r) => {
      if (!r.isTotalRow) {
        const valStr = r.cellsMap ? r.cellsMap[colKey] || "" : "";
        if (valStr) {
          const num = parseFloat(String(valStr).replace(/,/g, "").trim());
          if (!isNaN(num)) {
            sum += num;
            hasNumber = true;
          }
        }
      }
    });

    if (!hasNumber) return "";
    return Number.isInteger(sum) ? String(sum) : sum.toFixed(2);
  };

  return (
    <div
      ref={gridRef}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      tabIndex={0}
      className="w-full max-w-full overflow-x-auto border-t border-b border-[#cbd5e1] bg-white focus:outline-none select-none max-h-[600px] overflow-y-auto"
    >
      <table className="w-max border-collapse text-left table-fixed">
        <thead>
          <tr className="bg-[#f8fafc] border-b border-[#cbd5e1] h-8">
            {/* Index / Action Header */}
            <th className="w-9 min-w-[36px] max-w-[36px] h-8 sticky left-0 z-40 bg-[#e2e8f0] border-r border-b border-[#cbd5e1] text-center font-bold text-[10px] text-gray-700 uppercase">
              #
            </th>

            {columns.map((col, cIdx) => {
              const colW = columnWidths[col.id || col.columnKey] || (col.columnName === "SR" ? 60 : 140);
              return (
                <th
                  key={col.id || col.columnKey || cIdx}
                  className="p-0 font-normal text-left"
                  style={{ width: `${colW}px`, minWidth: `${colW}px` }}
                >
                  <MonthlyStockColumnHeader
                    column={col}
                    index={cIdx}
                    totalColumns={columns.length}
                    width={colW}
                    onResize={handleResizeColumn}
                    onRename={onColumnRename}
                    onInsertLeft={onColumnInsertLeft}
                    onInsertRight={onColumnInsertRight}
                    onMoveLeft={onColumnMoveLeft}
                    onMoveRight={onColumnMoveRight}
                    onDuplicate={onColumnDuplicate}
                    onDelete={onColumnDelete}
                    isReadOnly={isReadOnly}
                    isFirstColumn={cIdx === 0}
                  />
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, rIdx) => {
            const isTotalRow = r.isTotalRow;
            return (
              <tr
                key={r.id != null ? `row-${r.id}` : `row-idx-${rIdx}`}
                className={`transition-none h-8 ${
                  isTotalRow ? "bg-[#f1f5f9] font-bold" : "hover:bg-gray-50/50"
                }`}
              >
                {/* Row Index Column */}
                <td
                  onContextMenu={(e) => {
                    if (isReadOnly) return;
                    e.preventDefault();
                    const rect = e.currentTarget.getBoundingClientRect();
                    setRowMenuPos({ top: rect.bottom + 2, left: rect.left + 30 });
                    setActiveRowMenu(activeRowMenu === rIdx ? null : rIdx);
                  }}
                  className={`w-9 min-w-[36px] max-w-[36px] sticky left-0 z-40 border-r border-b border-[#e2e8f0] text-center relative group cursor-pointer ${
                    isTotalRow ? "bg-[#e2e8f0] text-[#107c41]" : "bg-[#f8fafc]"
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold">
                    {isTotalRow ? "∑" : rIdx + 1}
                  </span>

                  {/* Row Context Menu */}
                  {activeRowMenu === rIdx && !isReadOnly && (
                    <div
                      ref={rowMenuRef}
                      style={{ top: `${rowMenuPos.top}px`, left: `${rowMenuPos.left}px` }}
                      className="fixed w-44 bg-white rounded-xl shadow-2xl border border-gray-200 py-1.5 z-50 text-xs font-normal text-left animate-in fade-in zoom-in-95 duration-100"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          onRowInsertAbove(rIdx);
                          setActiveRowMenu(null);
                        }}
                        className="w-full px-3 py-1.5 text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5 text-blue-500" />
                        Insert Above
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onRowInsertBelow(rIdx);
                          setActiveRowMenu(null);
                        }}
                        className="w-full px-3 py-1.5 text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5 text-blue-500" />
                        Insert Below
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onRowDuplicate(rIdx);
                          setActiveRowMenu(null);
                        }}
                        className="w-full px-3 py-1.5 text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Copy className="h-3.5 w-3.5 text-indigo-500" />
                        Duplicate Row
                      </button>

                      {rIdx > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            onRowMoveUp(rIdx);
                            setActiveRowMenu(null);
                          }}
                          className="w-full px-3 py-1.5 text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                        >
                          <ArrowUp className="h-3.5 w-3.5 text-gray-500" />
                          Move Up
                        </button>
                      )}

                      {rIdx < rows.length - 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            onRowMoveDown(rIdx);
                            setActiveRowMenu(null);
                          }}
                          className="w-full px-3 py-1.5 text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                        >
                          <ArrowDown className="h-3.5 w-3.5 text-gray-500" />
                          Move Down
                        </button>
                      )}

                      <div className="my-1 border-t border-gray-100" />

                      <button
                        type="button"
                        onClick={() => {
                          onRowDelete(rIdx);
                          setActiveRowMenu(null);
                        }}
                        className="w-full px-3 py-1.5 text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                        Delete Row
                      </button>
                    </div>
                  )}
                </td>

                {columns.map((col, cIdx) => {
                  const colKey = col.id || col.columnKey;
                  let val = r.cellsMap
                    ? (r.cellsMap[colKey] !== undefined
                        ? r.cellsMap[colKey]
                        : (col.id ? r.cellsMap[col.id] || "" : ""))
                    : "";

                  if (isTotalRow && !val) {
                    if (cIdx === 0 || col.columnName === "SR" || col.columnName === "PLACE") {
                      val = "TOTAL";
                    } else {
                      val = computeColumnSum(colKey);
                    }
                  }
                  const isFocused = !isReadOnly && focusedCell?.rIdx === rIdx && focusedCell?.cIdx === cIdx;
                  const isEditing = !isReadOnly && editingCell?.rIdx === rIdx && editingCell?.cIdx === cIdx;
                  const selected = !isReadOnly && isCellSelected(rIdx, cIdx);
                  const colW = columnWidths[colKey] || (col.columnName === "SR" ? 60 : 140);

                  return (
                    <td
                      key={colKey != null ? `col-${colKey}` : `col-idx-${cIdx}`}
                      className="p-0 relative"
                      style={{ width: `${colW}px`, minWidth: `${colW}px`, maxWidth: `${colW}px` }}
                    >
                      <MonthlyStockCell
                        value={val}
                        onChange={(v) => handleCellChange(rIdx, cIdx, colKey, v)}
                        isFocused={isFocused}
                        isSelected={selected}
                        isEditing={isEditing}
                        isTotalRow={isTotalRow}
                        isReadOnly={isReadOnly}
                        isFirstColumn={cIdx === 0}
                        width={colW}
                        onFocus={() => {
                          if (isReadOnly) return;
                          setFocusedCell({ rIdx, cIdx });
                          setSelectionStart({ rIdx, cIdx });
                          setSelectionEnd({ rIdx, cIdx });
                        }}
                        onMouseDown={() => {
                          if (isReadOnly) return;
                          handleCellMouseDown(rIdx, cIdx);
                        }}
                        onMouseEnter={() => {
                          if (isReadOnly) return;
                          handleCellMouseEnter(rIdx, cIdx);
                        }}
                        onDoubleClick={() => {
                          if (!isReadOnly) {
                            setFocusedCell({ rIdx, cIdx });
                            setEditingCell({ rIdx, cIdx });
                          }
                        }}
                      />

                      {/* Iconic Excel Active Green Cell Outline & Fill Handle */}
                      {isFocused && !isEditing && (
                        <div className="absolute inset-0 border-2 border-[#107c41] pointer-events-none z-20">
                          {/* Excel Fill Handle Square */}
                          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-[#107c41] border border-white pointer-events-auto cursor-crosshair" />
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
