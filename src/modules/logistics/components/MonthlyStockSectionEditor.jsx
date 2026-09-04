"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Edit2,
  Check,
  X,
  Layers,
  Save,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { monthlyStockSummaryApi } from "../services/monthlyStockSummaryApi";

export default function MonthlyStockSectionEditor({
  summaryId,
  sections = [],
  isReadOnly = false,
  onRefresh,
}) {
  const [localSections, setLocalSections] = useState([]);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingSectionName, setEditingSectionName] = useState("");

  // Add Section Modal
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");

  // Add Column Modal
  const [addColumnSectionId, setAddColumnSectionId] = useState(null);
  const [newColumnName, setNewColumnName] = useState("");

  // Edit Column Modal
  const [editColumnInfo, setEditColumnInfo] = useState(null); // { sectionId, columnId, columnName }
  const [editColumnNameInput, setEditColumnNameInput] = useState("");

  // Loading state per section
  const [savingSectionId, setSavingSectionId] = useState(null);

  useEffect(() => {
    // Map initial sections to local state with rows & cells structure
    if (sections) {
      setLocalSections(
        sections.map((sec) => ({
          ...sec,
          columns: sec.columns || [],
          rows: (sec.rows || []).map((r) => {
            const cellMap = {};
            (r.cells || []).forEach((c) => {
              cellMap[c.columnId] = c.value || "";
            });
            return {
              id: r.id,
              rowOrder: r.rowOrder,
              isTotalRow: r.isTotalRow || false,
              cellMap,
            };
          }),
        }))
      );
    }
  }, [sections]);

  // ─── SECTION MANAGEMENT ──────────────────────────────────────────────────

  const handleCreateSection = async (e) => {
    e.preventDefault();
    if (!newSectionName.trim()) return;

    try {
      await monthlyStockSummaryApi.addSection(summaryId, {
        sectionName: newSectionName.trim(),
      });
      toast.success(`Section "${newSectionName.trim()}" created successfully!`);
      setNewSectionName("");
      setIsAddSectionOpen(false);
      onRefresh?.();
    } catch (err) {
      console.error("Add section error:", err);
      toast.error(err.response?.data?.message || "Failed to create section.");
    }
  };

  const handleStartRenameSection = (sec) => {
    setEditingSectionId(sec.id);
    setEditingSectionName(sec.sectionName);
  };

  const handleSaveRenameSection = async (secId) => {
    if (!editingSectionName.trim()) return;
    try {
      await monthlyStockSummaryApi.updateSection(summaryId, secId, {
        sectionName: editingSectionName.trim(),
      });
      toast.success("Section name updated.");
      setEditingSectionId(null);
      onRefresh?.();
    } catch (err) {
      console.error("Rename section error:", err);
      toast.error(err.response?.data?.message || "Failed to rename section.");
    }
  };

  const handleDeleteSection = async (sec) => {
    if (!window.confirm(`Are you sure you want to delete section "${sec.sectionName}"?`)) return;

    try {
      await monthlyStockSummaryApi.deleteSection(summaryId, sec.id);
      toast.success(`Section "${sec.sectionName}" deleted.`);
      onRefresh?.();
    } catch (err) {
      console.error("Delete section error:", err);
      toast.error(err.response?.data?.message || "Failed to delete section.");
    }
  };

  const handleDuplicateSection = async (sec) => {
    try {
      await monthlyStockSummaryApi.duplicateSection(summaryId, sec.id);
      toast.success(`Section "${sec.sectionName}" duplicated successfully!`);
      onRefresh?.();
    } catch (err) {
      console.error("Duplicate section error:", err);
      toast.error(err.response?.data?.message || "Failed to duplicate section.");
    }
  };

  const handleMoveSection = async (index, direction) => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= localSections.length) return;

    const newSecs = [...localSections];
    const temp = newSecs[index];
    newSecs[index] = newSecs[targetIdx];
    newSecs[targetIdx] = temp;

    const items = newSecs.map((sec, idx) => ({ id: sec.id, order: (idx + 1) * 10 }));
    setLocalSections(newSecs);

    try {
      await monthlyStockSummaryApi.reorderSections(summaryId, items);
      onRefresh?.();
    } catch (err) {
      console.error("Reorder sections error:", err);
      toast.error("Failed to reorder sections.");
    }
  };

  // ─── COLUMN MANAGEMENT ───────────────────────────────────────────────────

  const handleCreateColumn = async (e) => {
    e.preventDefault();
    if (!newColumnName.trim() || !addColumnSectionId) return;

    try {
      await monthlyStockSummaryApi.addColumn(summaryId, addColumnSectionId, {
        columnName: newColumnName.trim(),
      });
      toast.success(`Column "${newColumnName.trim()}" added successfully!`);
      setNewColumnName("");
      setAddColumnSectionId(null);
      onRefresh?.();
    } catch (err) {
      console.error("Add column error:", err);
      toast.error(err.response?.data?.message || "Failed to add column.");
    }
  };

  const handleSaveRenameColumn = async (e) => {
    e.preventDefault();
    if (!editColumnInfo || !editColumnNameInput.trim()) return;

    const { sectionId, columnId } = editColumnInfo;

    try {
      await monthlyStockSummaryApi.updateColumn(summaryId, sectionId, columnId, {
        columnName: editColumnNameInput.trim(),
      });
      toast.success("Column name updated.");
      setEditColumnInfo(null);
      onRefresh?.();
    } catch (err) {
      console.error("Rename column error:", err);
      toast.error(err.response?.data?.message || "Failed to rename column.");
    }
  };

  const handleDeleteColumn = async (secId, col) => {
    if (!window.confirm(`Are you sure you want to delete column "${col.columnName}"? All cell values under this column will be removed.`)) return;

    try {
      await monthlyStockSummaryApi.deleteColumn(summaryId, secId, col.id);
      toast.success(`Column "${col.columnName}" deleted.`);
      onRefresh?.();
    } catch (err) {
      console.error("Delete column error:", err);
      toast.error(err.response?.data?.message || "Failed to delete column.");
    }
  };

  // ─── ROW & CELL LOCAL GRID EDITING ────────────────────────────────────────

  const handleCellChange = (secId, rowIdx, colId, value) => {
    setLocalSections((prev) =>
      prev.map((sec) => {
        if (sec.id !== secId) return sec;
        const newRows = [...sec.rows];
        const targetRow = { ...newRows[rowIdx] };
        targetRow.cellMap = { ...targetRow.cellMap, [colId]: value };
        newRows[rowIdx] = targetRow;
        return { ...sec, rows: newRows };
      })
    );
  };

  // Clipboard Excel TSV Matrix Paste Handler
  const handleMatrixPaste = (e, secId, startRIdx, startColId) => {
    const clipboardData = e.clipboardData.getData("text/plain");
    if (!clipboardData || (!clipboardData.includes("\t") && !clipboardData.includes("\n"))) {
      return; // Allow standard single-value paste
    }

    e.preventDefault();

    const matrix = clipboardData
      .split(/\r\n|\n|\r/)
      .filter((line) => line.trim() !== "")
      .map((row) => row.split("\t"));

    if (matrix.length === 0) return;

    setLocalSections((prev) =>
      prev.map((sec) => {
        if (sec.id !== secId) return sec;

        const colIndexMap = {};
        sec.columns.forEach((c, idx) => {
          colIndexMap[c.id] = idx;
        });

        const startCIdx = colIndexMap[startColId] !== undefined ? colIndexMap[startColId] : 0;
        let newRows = [...sec.rows];

        const neededCount = startRIdx + matrix.length;
        while (newRows.length < neededCount) {
          newRows.push({
            id: undefined,
            tempId: `temp_${Date.now()}_${Math.random()}`,
            rowOrder: newRows.length + 1,
            isTotalRow: false,
            cellMap: {},
          });
        }

        matrix.forEach((pRow, rOffset) => {
          const targetR = startRIdx + rOffset;
          if (targetR < newRows.length) {
            const targetRow = { ...newRows[targetR] };
            const cellMap = { ...(targetRow.cellMap || {}) };

            pRow.forEach((val, cOffset) => {
              const targetCIdx = startCIdx + cOffset;
              if (targetCIdx < sec.columns.length) {
                const targetCol = sec.columns[targetCIdx];
                cellMap[targetCol.id] = val.trim();
              }
            });

            targetRow.cellMap = cellMap;
            newRows[targetR] = targetRow;
          }
        });

        return { ...sec, rows: newRows };
      })
    );

    toast.success(`Pasted ${matrix.length} row(s) from Excel!`);
  };

  const handleAddRow = (secId, isTotalRow = false) => {
    setLocalSections((prev) =>
      prev.map((sec) => {
        if (sec.id !== secId) return sec;
        const newRowOrder = sec.rows.length + 1;
        const defaultCellMap = {};

        sec.columns.forEach((col, idx) => {
          if (isTotalRow && idx === 0) {
            defaultCellMap[col.id] = "TOTAL";
          } else {
            defaultCellMap[col.id] = "";
          }
        });

        const newRow = {
          id: undefined, // temporary local row until saved
          tempId: `temp_${Date.now()}_${Math.random()}`,
          rowOrder: newRowOrder,
          isTotalRow,
          cellMap: defaultCellMap,
        };

        return { ...sec, rows: [...sec.rows, newRow] };
      })
    );
  };

  const handleDeleteRow = (secId, rowIdx) => {
    setLocalSections((prev) =>
      prev.map((sec) => {
        if (sec.id !== secId) return sec;
        const newRows = sec.rows.filter((_, idx) => idx !== rowIdx);
        return { ...sec, rows: newRows };
      })
    );
  };

  const handleSaveSectionData = async (sec) => {
    setSavingSectionId(sec.id);
    try {
      const payloadRows = sec.rows.map((r, rIdx) => ({
        id: typeof r.id === "number" ? r.id : undefined,
        rowOrder: rIdx + 1,
        isTotalRow: r.isTotalRow,
        cells: sec.columns.map((col) => ({
          columnId: col.id,
          value: r.cellMap[col.id] || "",
        })),
      }));

      await monthlyStockSummaryApi.bulkSaveSection(summaryId, sec.id, {
        sectionName: sec.sectionName,
        rows: payloadRows,
      });

      toast.success(`Section "${sec.sectionName}" saved successfully!`);
      onRefresh?.();
    } catch (err) {
      console.error("Save section data error:", err);
      toast.error(err.response?.data?.message || "Failed to save section data.");
    } finally {
      setSavingSectionId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Editor Header Toolbar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-[#007aff]" />
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Report Stock Sections</h3>
            <p className="text-[11px] text-gray-400 font-medium">
              Create and manage report blocks exactly like Excel.
            </p>
          </div>
        </div>

        {!isReadOnly && (
          <button
            type="button"
            onClick={() => setIsAddSectionOpen(true)}
            className="px-3.5 py-2 bg-[#007aff] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Section
          </button>
        )}
      </div>

      {/* Sections List */}
      {localSections.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-200 text-center space-y-3">
          <div className="w-10 h-10 bg-blue-50 text-[#007aff] rounded-full flex items-center justify-center mx-auto">
            <Layers className="h-5 w-5" />
          </div>
          <h4 className="text-xs font-bold text-gray-800">No Stock Sections Created</h4>
          <p className="text-[11px] text-gray-400 max-w-sm mx-auto">
            Click "+ Add Section" above to create report blocks (e.g. Yellow Millet, Import Mumbai, Russia Stock).
          </p>
        </div>
      ) : (
        localSections.map((sec, secIdx) => (
          <div
            key={sec.id || `sec_${secIdx}`}
            className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden"
          >
            {/* Section Header Card Bar */}
            <div className="p-4 bg-gray-50/70 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Section Name & Rename */}
              <div className="flex items-center gap-2">
                {editingSectionId === sec.id ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={editingSectionName}
                      onChange={(e) => setEditingSectionName(e.target.value)}
                      className="px-2.5 py-1 text-xs border border-[#007aff] rounded-lg bg-white focus:outline-none font-bold text-gray-900"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveRenameSection(sec.id)}
                      className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingSectionId(null)}
                      className="p-1 text-gray-400 hover:bg-gray-100 rounded-md"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wide">
                      {sec.sectionName}
                    </h4>
                    {!isReadOnly && (
                      <button
                        type="button"
                        onClick={() => handleStartRenameSection(sec)}
                        title="Rename Section"
                        className="text-gray-400 hover:text-gray-700 p-1 rounded-md transition-colors"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Section Action Toolbar */}
              {!isReadOnly && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {/* Move Section Up / Down */}
                  <button
                    type="button"
                    disabled={secIdx === 0}
                    onClick={() => handleMoveSection(secIdx, "up")}
                    title="Move Section Up"
                    className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 rounded-lg hover:bg-gray-100"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    disabled={secIdx === localSections.length - 1}
                    onClick={() => handleMoveSection(secIdx, "down")}
                    title="Move Section Down"
                    className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 rounded-lg hover:bg-gray-100"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  <div className="h-4 w-px bg-gray-200 mx-1" />

                  {/* Add Column */}
                  <button
                    type="button"
                    onClick={() => setAddColumnSectionId(sec.id)}
                    className="px-2.5 py-1 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5 text-[#007aff]" />
                    Column
                  </button>

                  {/* Add Row */}
                  <button
                    type="button"
                    onClick={() => handleAddRow(sec.id, false)}
                    className="px-2.5 py-1 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5 text-emerald-600" />
                    Row
                  </button>

                  {/* Add TOTAL Row */}
                  <button
                    type="button"
                    onClick={() => handleAddRow(sec.id, true)}
                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    + TOTAL Row
                  </button>

                  {/* Duplicate Section */}
                  <button
                    type="button"
                    onClick={() => handleDuplicateSection(sec)}
                    title="Duplicate Section (Structure Only)"
                    className="p-1.5 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>

                  {/* Save Changes */}
                  <button
                    type="button"
                    onClick={() => handleSaveSectionData(sec)}
                    disabled={savingSectionId === sec.id}
                    title="Save Section Data"
                    className="px-3 py-1 bg-[#007aff] hover:bg-blue-600 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {savingSectionId === sec.id ? (
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="h-3.5 w-3.5" />
                    )}
                    Save
                  </button>

                  {/* Delete Section */}
                  <button
                    type="button"
                    onClick={() => handleDeleteSection(sec)}
                    title="Delete Section"
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Dynamic Grid Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-gray-100/70 border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                    {sec.columns.map((col) => (
                      <th key={col.id} className="py-2.5 px-3 border-r border-gray-200/60 relative group/col">
                        <div className="flex items-center justify-between gap-2">
                          <span title={col.columnName}>{col.columnName}</span>
                          {!isReadOnly && (
                            <div className="flex items-center opacity-0 group-hover/col:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditColumnInfo({
                                    sectionId: sec.id,
                                    columnId: col.id,
                                    columnName: col.columnName,
                                  });
                                  setEditColumnNameInput(col.columnName);
                                }}
                                title="Rename Column Display Name"
                                className="p-0.5 text-gray-400 hover:text-gray-700"
                              >
                                <Edit2 className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteColumn(sec.id, col)}
                                title="Delete Column"
                                className="p-0.5 text-red-400 hover:text-red-600"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </th>
                    ))}
                    {!isReadOnly && <th className="py-2.5 px-3 w-12 text-center"></th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs text-gray-800">
                  {sec.rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={sec.columns.length + (isReadOnly ? 0 : 1)}
                        className="py-6 text-center text-gray-400 text-xs font-medium bg-gray-50/30"
                      >
                        No data rows added yet. Click "+ Row" to start entering values.
                      </td>
                    </tr>
                  ) : (
                    sec.rows.map((row, rIdx) => {
                      const isTotal = row.isTotalRow;
                      return (
                        <tr
                          key={row.id || row.tempId || `r_${rIdx}`}
                          className={`transition-colors ${
                            isTotal
                              ? "bg-amber-50/80 font-bold border-t-2 border-b-2 border-amber-200/80"
                              : "hover:bg-blue-50/30"
                          }`}
                        >
                          {sec.columns.map((col) => (
                            <td key={col.id} className="p-1 border-r border-gray-100">
                              <input
                                type="text"
                                disabled={isReadOnly}
                                value={row.cellMap[col.id] || ""}
                                onChange={(e) =>
                                  handleCellChange(sec.id, rIdx, col.id, e.target.value)
                                }
                                onPaste={(e) => handleMatrixPaste(e, sec.id, rIdx, col.id)}
                                placeholder={isTotal ? "TOTAL" : "—"}
                                className={`w-full px-2 py-1.5 text-xs rounded-lg border border-transparent hover:border-gray-200 focus:border-[#007aff] focus:bg-white focus:outline-none transition-colors ${
                                  isTotal ? "font-bold text-amber-900 bg-transparent" : "bg-transparent text-gray-900"
                                } ${isReadOnly ? "cursor-not-allowed opacity-90" : ""}`}
                              />
                            </td>
                          ))}

                          {!isReadOnly && (
                            <td className="p-1 text-center">
                              <button
                                type="button"
                                onClick={() => handleDeleteRow(sec.id, rIdx)}
                                title="Delete Row"
                                className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}

      {/* Add Section Modal */}
      {isAddSectionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 space-y-4 animate-in zoom-in-95">
            <h3 className="text-sm font-bold text-gray-900">Create New Stock Section</h3>
            <p className="text-xs text-gray-400 font-medium">
              Enter a section name (e.g. Yellow Millet, Import Mumbai, Russia Stock).
            </p>
            <input
              type="text"
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              placeholder="e.g. YELLOW MILLET"
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#007aff] font-semibold text-gray-900"
              autoFocus
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsAddSectionOpen(false);
                  setNewSectionName("");
                }}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateSection}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#007aff] hover:bg-blue-600 rounded-xl shadow-xs"
              >
                Create Section
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Column Modal */}
      {addColumnSectionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 space-y-4 animate-in zoom-in-95">
            <h3 className="text-sm font-bold text-gray-900">Add New Column</h3>
            <p className="text-xs text-gray-400 font-medium">
              Enter column name (e.g. PLACE, QTY, RATE, AMOUNT, PAYMENT STATUS, STOCK MT).
            </p>
            <input
              type="text"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              placeholder="e.g. PLACE"
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#007aff] font-semibold text-gray-900"
              autoFocus
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setAddColumnSectionId(null);
                  setNewColumnName("");
                }}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateColumn}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#007aff] hover:bg-blue-600 rounded-xl shadow-xs"
              >
                Add Column
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Column Display Name Modal */}
      {editColumnInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 space-y-4 animate-in zoom-in-95">
            <h3 className="text-sm font-bold text-gray-900">Rename Column Display Name</h3>
            <p className="text-xs text-gray-400 font-medium">
              Updating the column display name will maintain all existing cell value mappings safely.
            </p>
            <input
              type="text"
              value={editColumnNameInput}
              onChange={(e) => setEditColumnNameInput(e.target.value)}
              placeholder="e.g. QTY (MT)"
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#007aff] font-semibold text-gray-900"
              autoFocus
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditColumnInfo(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveRenameColumn}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#007aff] hover:bg-blue-600 rounded-xl shadow-xs"
              >
                Rename Column
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
