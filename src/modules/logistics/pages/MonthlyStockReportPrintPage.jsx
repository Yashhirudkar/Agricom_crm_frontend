"use client";

import React, { useState, useEffect, useCallback } from "react";
import { monthlyStockSummaryApi } from "../services/monthlyStockSummaryApi";

export default function MonthlyStockReportPrintPage({ id }) {
  const summaryId = Number(id);
  const [report, setReport] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      const res = await monthlyStockSummaryApi.getById(summaryId);
      setReport(res.data);
      setSections(res.data.sections || []);
    } catch (err) {
      console.error("Fetch print report error:", err);
    } finally {
      setLoading(false);
    }
  }, [summaryId]);

  useEffect(() => {
    if (summaryId) {
      fetchReport();
    }
  }, [summaryId, fetchReport]);

  // Trigger print dialog once content is fully rendered
  useEffect(() => {
    if (!loading && report) {
      const timer = setTimeout(() => {
        window.print();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [loading, report]);

  const extractCellValue = (row, col, secRows) => {
    if (!row) return "";
    const colKey = col.columnKey;
    const colId = col.id;

    if (row.isTotalRow) {
      if (colKey === "col_1" || col.columnName === "SR" || col.columnName === "PLACE") {
        return "TOTAL";
      }

      let sum = 0;
      let hasValue = false;
      secRows.forEach((r) => {
        if (r.isTotalRow) return;
        let v = null;
        if (r.cellsMap) {
          v = r.cellsMap[colKey] ?? r.cellsMap[colId];
        } else if (Array.isArray(r.cells)) {
          const matchObj = r.cells.find(
            (cObj) => cObj.columnKey === colKey || cObj.columnId === colId
          );
          if (matchObj) v = matchObj.value;
        }

        const num = parseFloat(v);
        if (!isNaN(num)) {
          sum += num;
          hasValue = true;
        }
      });
      return hasValue ? (Number.isInteger(sum) ? String(sum) : sum.toFixed(2)) : "";
    }

    if (row.cellsMap && row.cellsMap[colKey] !== undefined) {
      return row.cellsMap[colKey] ?? "";
    }
    if (row.cellsMap && row.cellsMap[colId] !== undefined) {
      return row.cellsMap[colId] ?? "";
    }

    if (Array.isArray(row.cells)) {
      const cellObj = row.cells.find(
        (c) => c.columnKey === colKey || c.columnId === colId
      );
      if (cellObj) return cellObj.value ?? "";
    }

    return "";
  };

  if (loading) {
    return (
      <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
        <p style={{ fontSize: "14px", color: "#475569", fontWeight: 600 }}>Loading printable stock report...</p>
      </div>
    );
  }

  const reportTitle = report?.reportTitle || "MONTHLY STOCK REPORT";
  const reportMonthYear = `${report?.monthName || ""} ${report?.year || ""}`.trim();

  return (
    <div className="report-print-container" style={{ width: "100%", margin: 0, padding: 0, background: "#ffffff", color: "#000000", fontFamily: "sans-serif" }}>
      {/* Report Header */}
      <div className="report-print-header" style={{ textAlign: "center", marginBottom: "20px", paddingBottom: "8px", borderBottom: "2px solid #000000" }}>
        <h1 className="report-print-title" style={{ fontSize: "18pt", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.05em", color: "#0f172a", margin: "0 0 4px 0" }}>
          {reportTitle}
        </h1>
        <p className="report-print-subtitle" style={{ fontSize: "12pt", fontWeight: 700, color: "#475569", margin: 0 }}>
          {reportMonthYear}
        </p>
      </div>

      {/* Sequential Sections (Stacked vertically) */}
      {sections.map((sec) => {
        const cols = sec.columns || [];
        const rows = sec.rows || [];
        const colCount = Math.max(cols.length, 1);

        return (
          <div key={sec.id} className="report-print-section" style={{ width: "100%", marginBottom: "22px", breakInside: "avoid", pageBreakInside: "avoid", display: "block" }}>
            <table className="report-print-table" style={{ width: "100%", tableLayout: "fixed", borderCollapse: "collapse", border: "1px solid #000000", background: "#ffffff" }}>
              <thead>
                <tr>
                  <th colSpan={colCount} className="report-print-section-title" style={{ fontSize: "11pt", fontWeight: 800, textTransform: "uppercase", textAlign: "center", backgroundColor: "#e2e8f0", color: "#0f172a", border: "1px solid #000000", padding: "6px 8px", letterSpacing: "0.05em" }}>
                    {sec.sectionName.toUpperCase()}
                  </th>
                </tr>
                <tr>
                  {cols.map((col, cIdx) => (
                    <th key={col.id || cIdx} className="report-print-th" style={{ backgroundColor: "#1e3a8a", color: "#ffffff", fontSize: "10pt", fontWeight: 700, textAlign: "center", border: "1px solid #000000", padding: "5px 8px" }}>
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
                        const isNumber = !isNaN(parseFloat(val)) && isFinite(val) && String(val).trim() !== "";
                        const align = cIdx === 0 || col.columnName === "SR" ? "center" : isNumber ? "right" : "left";

                        if (isTotalRow) {
                          return (
                            <td
                              key={col.id || cIdx}
                              className={cIdx === 0 ? "report-print-total-sr" : "report-print-total-td"}
                              style={{
                                fontSize: "9.5pt",
                                fontWeight: 800,
                                backgroundColor: cIdx === 0 ? "#e2e8f0" : "#f1f5f9",
                                color: cIdx === 0 ? "#107c41" : "#0f172a",
                                border: "1px solid #000000",
                                borderBottom: "3px double #000000",
                                padding: "5px 8px",
                                textAlign: align,
                              }}
                            >
                              {val}
                            </td>
                          );
                        }

                        return (
                          <td
                            key={col.id || cIdx}
                            className={cIdx === 0 ? "report-print-td-sr" : "report-print-td"}
                            style={{
                              fontSize: "9.5pt",
                              fontWeight: cIdx === 0 ? 700 : 400,
                              color: "#000000",
                              border: "1px solid #000000",
                              padding: "4px 8px",
                              backgroundColor: "#ffffff",
                              textAlign: align,
                            }}
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
  );
}
