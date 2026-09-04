"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Sparkles, Clock, Lock, AlertTriangle, FileText, Plus, Save, Download, Printer, FileSpreadsheet, X } from "lucide-react";
import { toast } from "sonner";
import { monthlyStockSummaryApi } from "../services/monthlyStockSummaryApi";
import MonthlyStockToolbar from "../components/MonthlyStockToolbar";
import MonthlyStockSectionCard from "../components/MonthlyStockSectionCard";

export default function MonthlyStockReportBuilderPage({
  id,
  isModal = false,
  overrideMode = null,
  onClose,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = overrideMode || searchParams?.get("mode");
  const viewOnly = searchParams?.get("viewOnly");
  const summaryId = Number(id);

  const [report, setReport] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState("saved");
  const [savingAll, setSavingAll] = useState(false);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState(null);

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      const res = await monthlyStockSummaryApi.getById(summaryId);
      setReport(res.data);
      setSections(res.data.sections || []);
      setLastSavedTime(res.data.updatedAt ? new Date(res.data.updatedAt) : new Date());
      setIsDirty(false);
      setSaveStatus("saved");
    } catch (err) {
      console.error("Fetch report error:", err);
      toast.error("Failed to load report data.");
    } finally {
      setLoading(false);
    }
  }, [summaryId]);

  useEffect(() => {
    if (summaryId) {
      fetchReport();
    }
  }, [summaryId, fetchReport]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Leave without saving?";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Auto-save debounce timer (2.5 seconds inactivity)
  useEffect(() => {
    if (!isDirty || report?.status === "Published") return;

    setSaveStatus("editing");
    const timer = setTimeout(async () => {
      try {
        setSaveStatus("saving");
        await handleSaveAllInternal();
        setSaveStatus("saved");
        setLastSavedTime(new Date());
        setIsDirty(false);
      } catch (err) {
        console.error("Auto save error:", err);
        setSaveStatus("error");
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [sections, isDirty, report?.status]);

  const stats = useMemo(() => {
    let totalCols = 0;
    let totalRows = 0;
    sections.forEach((sec) => {
      totalCols += (sec.columns || []).length;
      totalRows += (sec.rows || []).length;
    });
    return {
      sectionCount: sections.length,
      columnCount: totalCols,
      rowCount: totalRows,
    };
  }, [sections]);

  const isReadOnly =
    report?.status === "Published" ||
    mode === "view" ||
    viewOnly === "true";

  const handleSaveAllInternal = async () => {
    if (isReadOnly) return;
    const payloadSections = sections.map((sec) => {
      const columns = sec.columns || [];
      const rows = (sec.rows || []).map((r) => {
        const cells = columns.map((col) => {
          const colKey = col.id || col.columnKey;
          const val = r.cellsMap
            ? (r.cellsMap[colKey] !== undefined
                ? r.cellsMap[colKey]
                : (col.id ? r.cellsMap[col.id] || "" : ""))
            : "";
          return {
            columnId: col.id || null,
            columnKey: col.columnKey,
            value: val,
          };
        });
        return {
          id: r.id,
          rowOrder: r.rowOrder,
          isTotalRow: r.isTotalRow,
          cells,
        };
      });

      return {
        sectionId: sec.id,
        sectionName: sec.sectionName,
        layoutX: sec.layoutX,
        layoutY: sec.layoutY,
        layoutWidth: sec.layoutWidth,
        layoutHeight: sec.layoutHeight,
        columns,
        rows,
      };
    });

    await monthlyStockSummaryApi.saveAll(summaryId, { sections: payloadSections });
  };

  const handleSaveAll = async () => {
    if (isReadOnly) return;
    setSavingAll(true);
    setSaveStatus("saving");
    try {
      await handleSaveAllInternal();
      setIsDirty(false);
      setSaveStatus("saved");
      setLastSavedTime(new Date());
      toast.success("All report sections saved successfully!");
    } catch (err) {
      console.error("Save all error:", err);
      setSaveStatus("error");
      toast.error("Failed to save report.");
    } finally {
      setSavingAll(false);
    }
  };

  const handleAddSection = async (data) => {
    if (isReadOnly) return;
    try {
      const count = sections.length;
      const nextX = (count % 2) * 540 + 20;
      const nextY = Math.floor(count / 2) * 380 + 20;

      const payload = {
        ...data,
        layoutX: nextX,
        layoutY: nextY,
        layoutWidth: 520,
        layoutHeight: 340,
      };

      const res = await monthlyStockSummaryApi.addSection(summaryId, payload);
      setReport(res.data);
      setSections(res.data.sections || []);
      toast.success(`Section "${data.sectionName}" created successfully!`);
    } catch (err) {
      console.error("Add section error:", err);
      toast.error("Failed to create section.");
    }
  };

  const handleSaveSection = async (sectionId, payload) => {
    if (isReadOnly) return;
    const res = await monthlyStockSummaryApi.bulkSaveSection(summaryId, sectionId, payload);
    setReport(res.data);
    setSections(res.data.sections || []);
    setLastSavedTime(new Date());
  };

  const handleRenameSection = async (sectionId, sectionName) => {
    if (isReadOnly) return;
    try {
      const res = await monthlyStockSummaryApi.updateSection(summaryId, sectionId, { sectionName });
      setReport(res.data);
      setSections(res.data.sections || []);
      toast.success("Section renamed successfully!");
    } catch (err) {
      console.error("Rename section error:", err);
      toast.error("Failed to rename section.");
    }
  };

  const handleDuplicateSection = async (sectionId) => {
    if (isReadOnly) return;
    try {
      const res = await monthlyStockSummaryApi.duplicateSection(summaryId, sectionId);
      setReport(res.data);
      setSections(res.data.sections || []);
      toast.success("Section structure duplicated successfully!");
    } catch (err) {
      console.error("Duplicate section error:", err);
      toast.error("Failed to duplicate section.");
    }
  };

  const [sectionToDelete, setSectionToDelete] = useState(null);
  const [showPublishModal, setShowPublishModal] = useState(false);

  const handleDeleteSection = (sectionId) => {
    if (isReadOnly) return;
    const sec = sections.find((s) => s.id === sectionId);
    setSectionToDelete(sec || { id: sectionId, sectionName: "Section" });
  };

  const confirmDeleteSection = async () => {
    if (!sectionToDelete) return;
    try {
      const res = await monthlyStockSummaryApi.deleteSection(summaryId, sectionToDelete.id);
      setReport(res.data);
      setSections(res.data.sections || []);
      toast.success(`Section "${sectionToDelete.sectionName}" deleted successfully.`);
    } catch (err) {
      console.error("Delete section error:", err);
      toast.error("Failed to delete section.");
    } finally {
      setSectionToDelete(null);
    }
  };

  const handleMoveUpSection = async (idx) => {
    if (idx <= 0 || isReadOnly) return;
    const newSections = [...sections];
    const temp = newSections[idx];
    newSections[idx] = newSections[idx - 1];
    newSections[idx - 1] = temp;

    const items = newSections.map((s, i) => ({ id: s.id, order: (i + 1) * 10 }));
    setSections(newSections);
    await monthlyStockSummaryApi.reorderSections(summaryId, items);
  };

  const handleMoveDownSection = async (idx) => {
    if (idx >= sections.length - 1 || isReadOnly) return;
    const newSections = [...sections];
    const temp = newSections[idx];
    newSections[idx] = newSections[idx + 1];
    newSections[idx + 1] = temp;

    const items = newSections.map((s, i) => ({ id: s.id, order: (i + 1) * 10 }));
    setSections(newSections);
    await monthlyStockSummaryApi.reorderSections(summaryId, items);
  };

  const handlePublish = () => {
    if (isReadOnly) return;
    setShowPublishModal(true);
  };

  const confirmPublish = async () => {
    setShowPublishModal(false);
    try {
      const res = await monthlyStockSummaryApi.publish(summaryId);
      setReport(res.data);
      toast.success("Report published successfully! Spreadsheet is now read-only.");
    } catch (err) {
      console.error("Publish error:", err);
      toast.error("Failed to publish report.");
    }
  };

  const extractCellValue = (row, col, secRows) => {
    const colId = col.id;
    const colKey = col.columnKey;
    let val = "";

    if (row.cellsMap) {
      if (colId && row.cellsMap[colId] !== undefined && row.cellsMap[colId] !== null) {
        val = String(row.cellsMap[colId]);
      } else if (colKey && row.cellsMap[colKey] !== undefined && row.cellsMap[colKey] !== null) {
        val = String(row.cellsMap[colKey]);
      }
    }

    if (!val && Array.isArray(row.cells)) {
      const matchedCell = row.cells.find(
        (c) =>
          (colId && (c.columnId === colId || Number(c.columnId) === Number(colId))) ||
          (colKey && c.columnKey === colKey)
      );
      if (matchedCell && matchedCell.value !== undefined && matchedCell.value !== null) {
        val = String(matchedCell.value);
      }
    }

    if (row.isTotalRow && !val) {
      if (col.columnName === "SR" || col.columnName === "PLACE") {
        val = "TOTAL";
      } else {
        let sum = 0;
        let hasNum = false;
        (secRows || []).forEach((r) => {
          if (!r.isTotalRow) {
            const numVal = extractCellValue(r, col, secRows);
            if (numVal) {
              const parsed = parseFloat(String(numVal).replace(/,/g, "").trim());
              if (!isNaN(parsed)) {
                sum += parsed;
                hasNum = true;
              }
            }
          }
        });
        if (hasNum) {
          val = Number.isInteger(sum) ? String(sum) : sum.toFixed(2);
        }
      }
    }

    return val;
  };

  const handleExportCSV = () => {
    if (sections.length === 0) {
      toast.error("No sections available to export.");
      return;
    }

    let csvContent = "";
    csvContent += `"${(report?.reportTitle || "MONTHLY STOCK REPORT").replace(/"/g, '""')}"\n`;
    csvContent += `"${report?.monthName || ""} ${report?.year || ""}"\n\n`;

    sections.forEach((sec) => {
      csvContent += `"${sec.sectionName.toUpperCase()}"\n`;
      const colHeaders = (sec.columns || []).map((c) => `"${c.columnName}"`).join(",");
      csvContent += `${colHeaders}\n`;

      (sec.rows || []).forEach((r) => {
        const rowCells = (sec.columns || []).map((c) => {
          const val = extractCellValue(r, c, sec.rows);
          return `"${String(val).replace(/"/g, '""')}"`;
        });
        csvContent += `${rowCells.join(",")}\n`;
      });

      csvContent += `\n\n`;
    });

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `${(report?.reportTitle || "Stock_Report").replace(/[^a-zA-Z0-9]/g, "_")}_${report?.monthName}_${report?.year}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("CSV report exported successfully!");
  };

  const handleExportExcel = async () => {
    if (sections.length === 0) {
      toast.error("No sections available to export.");
      return;
    }

    // 1. Sort sections into Y-bands & X-order based on Builder layout coordinates
    const sortedSections = [...sections].sort((a, b) => {
      const yA = a.layoutY || 0;
      const yB = b.layoutY || 0;
      if (Math.abs(yA - yB) > 150) return yA - yB;
      return (a.layoutX || 0) - (b.layoutX || 0);
    });

    const bands = [];
    sortedSections.forEach((sec) => {
      const secY = sec.layoutY || 0;
      let band = bands.find((b) => Math.abs(b.y - secY) < 150);
      if (!band) {
        band = { y: secY, sections: [] };
        bands.push(band);
      }
      band.sections.push(sec);
    });

    bands.forEach((b) => {
      b.sections.sort((a, b) => (a.layoutX || 0) - (b.layoutX || 0));
    });

    // 2. Build 2D grid matrix mapping
    let currentStartRow = 4; // Row 1: Title, Row 2: Subtitle, Row 3: Blank
    let maxOverallCol = 1;
    const grid = {}; // grid[row][col] = CellConfig

    bands.forEach((band) => {
      let maxBandRows = 0;
      let currentStartCol = 1;

      band.sections.forEach((sec) => {
        const cols = sec.columns || [];
        const rows = sec.rows || [];
        const colCount = Math.max(cols.length, 1);

        const endCol = currentStartCol + colCount - 1;
        if (endCol > maxOverallCol) maxOverallCol = endCol;

        // Section Heading Cell
        grid[currentStartRow] = grid[currentStartRow] || {};
        grid[currentStartRow][currentStartCol] = {
          type: "heading",
          value: sec.sectionName.toUpperCase(),
          colspan: colCount,
        };
        for (let c = currentStartCol + 1; c <= endCol; c++) {
          grid[currentStartRow][c] = { type: "spanned" };
        }

        // Table Header Row
        const headerRowIdx = currentStartRow + 1;
        grid[headerRowIdx] = grid[headerRowIdx] || {};
        cols.forEach((col, cIdx) => {
          grid[headerRowIdx][currentStartCol + cIdx] = {
            type: "header",
            value: col.columnName,
          };
        });

        // Data & Total Rows
        rows.forEach((r, rIdx) => {
          const dataRowIdx = currentStartRow + 2 + rIdx;
          grid[dataRowIdx] = grid[dataRowIdx] || {};
          const isTotalRow = r.isTotalRow;

          cols.forEach((col, cIdx) => {
            const val = extractCellValue(r, col, rows);
            const isNumber = !isNaN(parseFloat(val)) && isFinite(val) && String(val).trim() !== "";
            const align = cIdx === 0 || col.columnName === "SR" ? "center" : (isNumber ? "right" : "left");

            grid[dataRowIdx][currentStartCol + cIdx] = {
              type: isTotalRow ? "total" : "data",
              value: val,
              align,
              isFirstCol: cIdx === 0,
            };
          });
        });

        const totalSecHeight = 2 + rows.length;
        if (totalSecHeight > maxBandRows) maxBandRows = totalSecHeight;

        // Advance start column with 2 blank columns gap
        currentStartCol = endCol + 3;
      });

      // Advance start row with 2 blank rows gap
      currentStartRow += maxBandRows + 2;
    });

    const reportTitle = report?.reportTitle || "MONTHLY STOCK REPORT";
    const reportMonthYear = `${report?.monthName || ""} ${report?.year || ""}`.trim();

    // 3. Try ExcelJS dynamic import if installed
    try {
      const ExcelJSModule = await import("exceljs").catch(() => null);
      if (ExcelJSModule) {
        const ExcelJS = ExcelJSModule.default || ExcelJSModule;
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Stock Summary", {
          views: [{ showGridLines: true }],
        });

        // Report Title
        worksheet.mergeCells(1, 1, 1, maxOverallCol);
        const titleCell = worksheet.getCell(1, 1);
        titleCell.value = reportTitle;
        titleCell.font = { name: "Segoe UI", size: 16, bold: true, color: { argb: "FF0F172A" } };
        titleCell.alignment = { horizontal: "center", vertical: "middle" };
        worksheet.getRow(1).height = 36;

        // Subtitle
        worksheet.mergeCells(2, 1, 2, maxOverallCol);
        const subCell = worksheet.getCell(2, 1);
        subCell.value = reportMonthYear;
        subCell.font = { name: "Segoe UI", size: 12, bold: true, color: { argb: "FF475569" } };
        subCell.alignment = { horizontal: "center", vertical: "middle" };
        worksheet.getRow(2).height = 26;

        // Populate Matrix Cells into ExcelJS worksheet
        const maxRowKeys = Object.keys(grid).map(Number);
        const maxRow = maxRowKeys.length > 0 ? Math.max(...maxRowKeys) : 4;

        for (let r = 4; r <= maxRow; r++) {
          const rowObj = grid[r] || {};
          for (let c = 1; c <= maxOverallCol; c++) {
            const cellData = rowObj[c];
            if (!cellData) continue;

            if (cellData.type === "heading") {
              worksheet.mergeCells(r, c, r, c + cellData.colspan - 1);
              const cell = worksheet.getCell(r, c);
              cell.value = cellData.value;
              cell.font = { name: "Segoe UI", size: 11, bold: true, color: { argb: "FF0F172A" } };
              cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE2E8F0" } };
              cell.alignment = { horizontal: "center", vertical: "middle" };
              cell.border = {
                top: { style: "thin", color: { argb: "FF94A3B8" } },
                bottom: { style: "thin", color: { argb: "FF94A3B8" } },
                left: { style: "thin", color: { argb: "FF94A3B8" } },
                right: { style: "thin", color: { argb: "FF94A3B8" } },
              };
            } else if (cellData.type === "header") {
              const cell = worksheet.getCell(r, c);
              cell.value = cellData.value;
              cell.font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
              cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1E3A8A" } };
              cell.alignment = { horizontal: "center", vertical: "middle" };
              cell.border = {
                top: { style: "thin", color: { argb: "FF3B82F6" } },
                bottom: { style: "thin", color: { argb: "FF3B82F6" } },
                left: { style: "thin", color: { argb: "FF3B82F6" } },
                right: { style: "thin", color: { argb: "FF3B82F6" } },
              };
            } else if (cellData.type === "data") {
              const cell = worksheet.getCell(r, c);
              cell.value = cellData.value;
              cell.font = { name: "Segoe UI", size: 10, bold: cellData.isFirstCol, color: { argb: "FF1E293B" } };
              cell.alignment = { horizontal: cellData.align, vertical: "middle" };
              cell.border = {
                top: { style: "thin", color: { argb: "FFCBD5E1" } },
                bottom: { style: "thin", color: { argb: "FFCBD5E1" } },
                left: { style: "thin", color: { argb: "FFCBD5E1" } },
                right: { style: "thin", color: { argb: "FFCBD5E1" } },
              };
            } else if (cellData.type === "total") {
              const cell = worksheet.getCell(r, c);
              cell.value = cellData.value;
              cell.font = { name: "Segoe UI", size: 10, bold: true, color: cellData.isFirstCol ? { argb: "FF107C41" } : { argb: "FF0F172A" } };
              cell.fill = { type: "pattern", pattern: "solid", fgColor: cellData.isFirstCol ? { argb: "FFE2E8F0" } : { argb: "FFF1F5F9" } };
              cell.alignment = { horizontal: cellData.align, vertical: "middle" };
              cell.border = {
                top: { style: "thin", color: { argb: "FF94A3B8" } },
                bottom: { style: "double", color: { argb: "FF0F172A" } },
                left: { style: "thin", color: { argb: "FF94A3B8" } },
                right: { style: "thin", color: { argb: "FF94A3B8" } },
              };
            }
          }
        }

        for (let c = 1; c <= maxOverallCol; c++) {
          const col = worksheet.getColumn(c);
          col.width = 18;
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${(reportTitle).replace(/[^a-zA-Z0-9]/g, "_")}_${report?.monthName}_${report?.year}.xlsx`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("2D Builder layout Excel (.xlsx) exported successfully!");
        return;
      }
    } catch (e) {
      console.warn("ExcelJS fallback to 2D HTML SpreadsheetML format:", e);
    }

    // 4. Fallback: 2D Matrix SpreadsheetML HTML Export (.xls)
    let excelHTML = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Stock Summary Report</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          table { border-collapse: collapse; font-family: 'Segoe UI', Arial, sans-serif; width: 100%; }
          .report-title { font-size: 16pt; font-weight: bold; text-align: center; height: 38px; vertical-align: middle; color: #0F172A; }
          .report-subtitle { font-size: 12pt; font-weight: bold; text-align: center; height: 26px; vertical-align: middle; color: #475569; }
          .section-heading { font-size: 12pt; font-weight: bold; text-align: center; background-color: #E2E8F0; color: #0F172A; border: 1px solid #94A3B8; height: 30px; vertical-align: middle; }
          .th-header { background-color: #1E3A8A; color: #FFFFFF; font-size: 11pt; font-weight: bold; text-align: center; border: 1px solid #3B82F6; height: 28px; vertical-align: middle; padding: 6px; }
          .td-cell { font-size: 10pt; color: #1E293B; border: 1px solid #CBD5E1; height: 24px; vertical-align: middle; padding: 4px 8px; }
          .td-cell-sr { font-size: 10pt; font-weight: bold; text-align: center; color: #1E293B; border: 1px solid #CBD5E1; height: 24px; vertical-align: middle; }
          .td-total { font-size: 10pt; font-weight: bold; background-color: #F1F5F9; color: #0F172A; border: 1px solid #94A3B8; border-bottom: 3px double #0F172A; height: 26px; vertical-align: middle; padding: 4px 8px; }
          .td-total-sr { font-size: 10pt; font-weight: bold; background-color: #E2E8F0; color: #107C41; text-align: center; border: 1px solid #94A3B8; border-bottom: 3px double #0F172A; height: 26px; vertical-align: middle; }
          .blank-row { height: 20px; }
        </style>
      </head>
      <body>
        <table>
          <tr>
            <td colspan="${maxOverallCol}" class="report-title">${reportTitle}</td>
          </tr>
          <tr>
            <td colspan="${maxOverallCol}" class="report-subtitle">${reportMonthYear}</td>
          </tr>
          <tr class="blank-row"><td colspan="${maxOverallCol}"></td></tr>
    `;

    const maxRowKeys = Object.keys(grid).map(Number);
    const maxRow = maxRowKeys.length > 0 ? Math.max(...maxRowKeys) : 4;

    for (let r = 4; r <= maxRow; r++) {
      const rowObj = grid[r] || {};
      excelHTML += `<tr>`;

      for (let c = 1; c <= maxOverallCol; c++) {
        const cellData = rowObj[c];
        if (!cellData) {
          excelHTML += `<td style="min-width: 140px; width: 180px;"></td>`;
          continue;
        }

        if (cellData.type === "spanned") continue;

        if (cellData.type === "heading") {
          excelHTML += `<td colspan="${cellData.colspan}" class="section-heading">${cellData.value}</td>`;
          c += cellData.colspan - 1;
        } else if (cellData.type === "header") {
          excelHTML += `<th class="th-header" style="min-width: 140px; width: 180px;">${cellData.value}</th>`;
        } else if (cellData.type === "data") {
          excelHTML += `<td class="${cellData.isFirstCol ? "td-cell-sr" : "td-cell"}" style="text-align: ${cellData.align}; min-width: 140px; width: 180px;">${cellData.value}</td>`;
        } else if (cellData.type === "total") {
          excelHTML += `<td class="${cellData.isFirstCol ? "td-total-sr" : "td-total"}" style="text-align: ${cellData.align}; min-width: 140px; width: 180px;">${cellData.value}</td>`;
        }
      }

      excelHTML += `</tr>`;
    }

    excelHTML += `
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([excelHTML], { type: "application/vnd.ms-excel;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `${(reportTitle).replace(/[^a-zA-Z0-9]/g, "_")}_${report?.monthName}_${report?.year}.xls`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("2D Builder layout Excel report exported successfully!");
  };

  const handlePrint = () => {
    window.open(`/logistics/monthly-stock-summary/${summaryId}/print`, "_blank");
  };

  const handleBack = () => {
    if (isDirty) {
      setLeaveModalOpen(true);
    } else if (isModal && onClose) {
      onClose();
    } else {
      router.push("/logistics/monthly-stock-summary");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-4 border-[#107c41] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-gray-600">Loading Excel Spreadsheet Workspace...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full min-h-screen bg-white p-3 md:p-5 space-y-4 font-sans select-none print:p-0 print:bg-white overflow-x-hidden">
      {/* Mobile Screen Warning Banner */}
      <div className="md:hidden p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium no-print flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 flex-shrink-0 text-amber-600" />
        <span>This report builder is optimized for desktop view. Please use a laptop or desktop screen.</span>
      </div>

      {/* Dedicated Production Print-Only Container (Sequential Stacked Full-Width Tables) */}
      <div className="report-print-container hidden print:block">
        <div className="report-print-header">
          <h1 className="report-print-title">
            {report?.reportTitle || "MONTHLY STOCK REPORT"}
          </h1>
          <p className="report-print-subtitle">
            {report?.monthName} {report?.year}
          </p>
        </div>

        {sections.map((sec) => {
          const cols = sec.columns || [];
          const rows = sec.rows || [];
          const colCount = Math.max(cols.length, 1);

          return (
            <div key={sec.id} className="report-print-section">
              <table className="report-print-table">
                <thead>
                  <tr>
                    <th colSpan={colCount} className="report-print-section-title">
                      {sec.sectionName.toUpperCase()}
                    </th>
                  </tr>
                  <tr>
                    {cols.map((col, cIdx) => (
                      <th key={col.id || cIdx} className="report-print-th">
                        {col.columnName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, rIdx) => {
                    const isTotalRow = r.isTotalRow;
                    return (
                      <tr key={r.id || rIdx}>
                        {cols.map((col, cIdx) => {
                          const val = extractCellValue(r, col, rows);
                          const isNumber =
                            !isNaN(parseFloat(val)) &&
                            isFinite(val) &&
                            String(val).trim() !== "";
                          const alignClass =
                            cIdx === 0 || col.columnName === "SR"
                              ? "text-center"
                              : isNumber
                              ? "text-right"
                              : "text-left";

                          if (isTotalRow) {
                            return (
                              <td
                                key={col.id || cIdx}
                                className={`${
                                  cIdx === 0 ? "report-print-total-sr" : "report-print-total-td"
                                } ${alignClass}`}
                              >
                                {val}
                              </td>
                            );
                          }

                          return (
                            <td
                              key={col.id || cIdx}
                              className={`${
                                cIdx === 0 ? "report-print-td-sr" : "report-print-td"
                              } ${alignClass}`}
                            >
                              {val}
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
        })}
      </div>

      {/* Screen-Only Workspace Canvas & UI Chrome */}
      <div className="no-print space-y-4">
        {/* Excel Workspace Header Bar */}
        <div className="bg-[#f8fafc] p-3 md:px-5 border border-[#cbd5e1] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="p-1.5 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
              title="Back to Monthly Stock Summaries"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base md:text-lg font-extrabold text-gray-900 tracking-wide font-sans">
                  {report?.reportTitle || "MONTHLY STOCK REPORT"}
                </h1>
                <span
                  className={`px-2 py-0.2 text-[10px] font-bold uppercase ${
                    isReadOnly
                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                      : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  }`}
                >
                  {report?.status}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium">
                {report?.monthName} {report?.year} • Excel Native Spreadsheet Workspace
              </p>
            </div>
          </div>

          {/* Stats & Save Status Indicators & Export Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Live Save Status Badge */}
            <div className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-white border border-gray-300">
              {saveStatus === "editing" && (
                <span className="text-amber-600">● Editing</span>
              )}
              {saveStatus === "saving" && (
                <span className="text-blue-600 flex items-center gap-1">
                  <div className="w-2.5 h-2.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  Saving...
                </span>
              )}
              {saveStatus === "saved" && (
                <span className="text-emerald-700">Saved ✓</span>
              )}
              {saveStatus === "error" && (
                <span className="text-red-600">Failed to save</span>
              )}
            </div>

            {/* Statistics Pills */}
            <div className="hidden lg:flex items-center gap-2">
              <div className="px-2.5 py-1 bg-white text-gray-700 text-xs font-medium border border-gray-300">
                Sections: <span className="text-gray-900 font-bold">{stats.sectionCount}</span>
              </div>
              <div className="px-2.5 py-1 bg-white text-gray-700 text-xs font-medium border border-gray-300">
                Columns: <span className="text-gray-900 font-bold">{stats.columnCount}</span>
              </div>
              <div className="px-2.5 py-1 bg-white text-gray-700 text-xs font-medium border border-gray-300">
                Rows: <span className="text-gray-900 font-bold">{stats.rowCount}</span>
              </div>
            </div>

            {lastSavedTime && (
              <div className="text-[11px] text-gray-400 font-medium hidden xl:flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Last Saved: {lastSavedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            )}

            <div className="h-5 w-px bg-gray-300 mx-1 hidden sm:block" />

            {/* Top Bar Action Buttons: Excel, CSV, Print */}
            <button
              type="button"
              onClick={handleExportExcel}
              className="px-2.5 py-1 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Export Excel (.xlsx)"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
              Excel
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="px-2.5 py-1 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Export CSV"
            >
              <Download className="h-3.5 w-3.5 text-blue-600" />
              CSV
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-2.5 py-1 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Print A4 Landscape"
            >
              <Printer className="h-3.5 w-3.5 text-gray-600" />
              Print
            </button>

            {isModal && onClose && (
              <button
                type="button"
                onClick={handleBack}
                className="p-1 hover:bg-gray-200 text-gray-500 hover:text-gray-900 rounded-lg transition-colors cursor-pointer ml-1"
                title="Close Drawer"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>



      {/* Workspace Action Toolbar */}
      <MonthlyStockToolbar
        onAddSection={handleAddSection}
        onSaveAll={handleSaveAll}
        onPublish={handlePublish}
        onExportExcel={handleExportExcel}
        onExportCSV={handleExportCSV}
        onPrint={handlePrint}
        isDirty={isDirty}
        savingAll={savingAll}
        isReadOnly={isReadOnly}
      />

      {/* Freeform Drag & Drop Report Canvas Workspace */}
      <div className="print-section-canvas relative min-h-[900px] w-full bg-[#f8fafc]/60 border border-dashed border-gray-300 rounded-lg p-2 overflow-auto print:bg-white print:border-none print:p-0 print:overflow-visible print:min-h-0 print:static print:grid print:grid-cols-2 print:gap-4">
        {sections.length > 0 ? (
          sections.map((sec, idx) => (
            <MonthlyStockSectionCard
              key={sec.id}
              section={sec}
              index={idx}
              totalSections={sections.length}
              onSaveSection={handleSaveSection}
              onRenameSection={handleRenameSection}
              onDuplicateSection={handleDuplicateSection}
              onDeleteSection={handleDeleteSection}
              onMoveUpSection={handleMoveUpSection}
              onMoveDownSection={handleMoveDownSection}
              isReadOnly={isReadOnly}
            />
          ))
        ) : (
          <div className="bg-white p-12 border border-dashed border-gray-300 text-center space-y-3 max-w-lg mx-auto my-8">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-emerald-50 text-[#107c41]">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">No report sections yet</h3>
              <p className="text-xs text-gray-500 mt-1">
                Create your first spreadsheet section or select a preset template to start building this stock report.
              </p>
            </div>
            {!isReadOnly && (
              <button
                type="button"
                onClick={() => handleAddSection({ sectionName: "YELLOW MILLET" })}
                className="px-4 py-2 bg-[#107c41] hover:bg-emerald-700 text-white rounded-none text-xs font-bold shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                + Create First Section
              </button>
            )}
          </div>
        )}
      </div>
      </div>

      {/* Leave Modal Warning */}
      {leaveModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 max-w-sm w-full shadow-2xl space-y-4 border border-gray-300">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Unsaved Changes
            </h4>
            <p className="text-xs text-gray-600">
              You have unsaved changes in your spreadsheet. Leave without saving?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setLeaveModalOpen(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 cursor-pointer"
              >
                Stay & Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setLeaveModalOpen(false);
                  if (isModal && onClose) {
                    onClose();
                  } else {
                    router.push("/logistics/monthly-stock-summary");
                  }
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 cursor-pointer"
              >
                Leave Without Saving
              </button>
            </div>
          </div>
        </div>
      )}
      {sectionToDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white p-6 max-w-sm w-full shadow-2xl rounded-xl space-y-4 border border-gray-200 text-left">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2.5 bg-red-50 rounded-xl">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Delete Section</h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Are you sure you want to delete <span className="font-bold text-gray-900">"{sectionToDelete.sectionName}"</span>?
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
              This action will permanently delete all columns and rows inside this section.
            </p>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSectionToDelete(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteSection}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Delete Section
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Report Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white p-6 max-w-sm w-full shadow-2xl rounded-xl space-y-4 border border-gray-200 text-left">
            <div className="flex items-center gap-3 text-emerald-600">
              <div className="p-2.5 bg-emerald-50 rounded-xl">
                <Sparkles className="h-5 w-5 text-[#107c41]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Publish Monthly Stock Report</h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Publishing locks all spreadsheet edits.
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-600 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100">
              Once published, this monthly stock summary report becomes read-only for audit compliance.
            </p>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowPublishModal(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmPublish}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#107c41] hover:bg-emerald-800 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Publish Report Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
