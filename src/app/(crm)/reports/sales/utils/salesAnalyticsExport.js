import {
  formatCurrencyValue,
  formatNumber,
  getExecutiveFirstName,
} from "./salesAnalyticsUtils";

function getExportFileStamp() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Style a worksheet header row consistently with Agricom Excel reports.
 */
function styleHeaderRow(row) {
  row.height = 24;
  row.eachCell((cell) => {
    cell.font = {
      name: "Segoe UI",
      size: 10,
      bold: true,
      color: { argb: "FFFFFFFF" },
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1E3A8A" },
    };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      top: { style: "thin", color: { argb: "FF3B82F6" } },
      bottom: { style: "thin", color: { argb: "FF3B82F6" } },
      left: { style: "thin", color: { argb: "FF3B82F6" } },
      right: { style: "thin", color: { argb: "FF3B82F6" } },
    };
  });
}

function autoSizeColumns(worksheet, minWidth = 14, maxWidth = 38) {
  worksheet.columns.forEach((col) => {
    let maxLen = minWidth;
    col.eachCell({ includeEmpty: false }, (cell) => {
      const len = String(cell.value ?? "").length + 4;
      if (len > maxLen) maxLen = len;
    });
    col.width = Math.min(maxWidth, maxLen);
  });
}

/**
 * Export full analytics workbook (.xlsx) using ExcelJS.
 */
export async function exportSalesAnalyticsExcel({ analytics, orders = [] }) {
  const ExcelJSModule = await import("exceljs");
  const ExcelJS = ExcelJSModule.default || ExcelJSModule;
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Agricom CRM";
  workbook.created = new Date();

  const {
    currencyMeta,
    activeFilters,
    kpis,
    monthOverMonth,
    monthlyTrend,
    productPerformanceTable,
    executivePerformance,
    countrySales,
    customerContribution,
  } = analytics;

  const filterSummary = activeFilters
    .map((f) => `${f.label}: ${f.value}`)
    .join(" | ");

  // 1. Overview & KPIs
  const overviewSheet = workbook.addWorksheet("Overview & KPIs");
  overviewSheet.addRow(["Monthly Sales Analytics Report"]);
  overviewSheet.getRow(1).font = { name: "Segoe UI", size: 15, bold: true };
  overviewSheet.addRow([`Generated: ${new Date().toLocaleString()}`]);
  overviewSheet.addRow([`Filters: ${filterSummary}`]);
  overviewSheet.addRow([]);

  const kpiHeader = overviewSheet.addRow(["KPI Metric", "Value", "Details"]);
  styleHeaderRow(kpiHeader);
  overviewSheet.addRow([
    "Total Revenue",
    formatCurrencyValue(kpis.totalRevenue, currencyMeta),
    currencyMeta.mode === "mixed"
      ? currencyMeta.breakdown
          .map((b) => `${b.code} ${formatNumber(b.total)}`)
          .join(" / ")
      : currencyMeta.code || "Reported Value",
  ]);
  overviewSheet.addRow([
    "Total Quantity (MT)",
    `${formatNumber(kpis.totalQuantity, 2)} MT`,
    `Avg ${formatNumber(kpis.avgOrderQty, 2)} MT / order`,
  ]);
  overviewSheet.addRow([
    "Average Selling Price",
    `${formatCurrencyValue(kpis.avgSellingPrice, currencyMeta)} / MT`,
    "Weighted revenue per MT",
  ]);
  overviewSheet.addRow([
    "Total Orders",
    kpis.totalOrders,
    `${kpis.uniqueCustomers} customers · ${kpis.activeExecutives} executives`,
  ]);
  overviewSheet.addRow([
    "Top Customer",
    kpis.topCustomer?.name || "N/A",
    kpis.topCustomer
      ? `${formatCurrencyValue(kpis.topCustomer.revenue, currencyMeta)} (${kpis.topCustomer.sharePct.toFixed(1)}%)`
      : "",
  ]);
  overviewSheet.addRow([
    "Top Executive",
    kpis.topExecutive?.name || "N/A",
    kpis.topExecutive
      ? `${kpis.topExecutive.orders} orders · ${formatCurrencyValue(kpis.topExecutive.revenue, currencyMeta)}`
      : "",
  ]);

  overviewSheet.addRow([]);
  const momHeader = overviewSheet.addRow([
    "Month-over-Month Comparison",
    monthOverMonth.currentLabel,
    monthOverMonth.canCompare ? monthOverMonth.previousLabel : "Previous Month",
    "Change %",
  ]);
  styleHeaderRow(momHeader);
  [
    {
      label: "Revenue",
      curr: formatCurrencyValue(monthOverMonth.revenue.current, currencyMeta),
      prev: monthOverMonth.canCompare
        ? formatCurrencyValue(monthOverMonth.revenue.previous, currencyMeta)
        : "N/A",
      delta: monthOverMonth.revenue.deltaPct,
    },
    {
      label: "Quantity (MT)",
      curr: formatNumber(monthOverMonth.quantity.current, 2),
      prev: monthOverMonth.canCompare
        ? formatNumber(monthOverMonth.quantity.previous, 2)
        : "N/A",
      delta: monthOverMonth.quantity.deltaPct,
    },
    {
      label: "Orders",
      curr: monthOverMonth.orders.current,
      prev: monthOverMonth.canCompare ? monthOverMonth.orders.previous : "N/A",
      delta: monthOverMonth.orders.deltaPct,
    },
  ].forEach((m) => {
    overviewSheet.addRow([
      m.label,
      m.curr,
      m.prev,
      m.delta === null ? "N/A" : `${m.delta >= 0 ? "+" : ""}${m.delta.toFixed(1)}%`,
    ]);
  });
  autoSizeColumns(overviewSheet);

  // 2. Product Performance
  const prodSheet = workbook.addWorksheet("Product Performance");
  const prodHeader = prodSheet.addRow([
    "Product",
    "Orders",
    "Quantity (MT)",
    "Revenue",
    "Average Price / MT",
    "Contribution %",
  ]);
  styleHeaderRow(prodHeader);
  productPerformanceTable.forEach((p) => {
    prodSheet.addRow([
      p.name,
      p.orders,
      Number(p.quantity.toFixed(2)),
      Number(p.revenue.toFixed(2)),
      Number(p.avgPrice.toFixed(2)),
      `${p.contributionPct.toFixed(2)}%`,
    ]);
  });
  const totalProdRow = prodSheet.addRow([
    "Total",
    kpis.totalOrders,
    Number(kpis.totalQuantity.toFixed(2)),
    Number(kpis.totalRevenue.toFixed(2)),
    Number(kpis.avgSellingPrice.toFixed(2)),
    "100.00%",
  ]);
  totalProdRow.font = { bold: true };
  autoSizeColumns(prodSheet);

  // 3. Monthly Trend
  const trendSheet = workbook.addWorksheet("Monthly Trend");
  const trendHeader = trendSheet.addRow([
    "Month",
    "Orders",
    "Quantity (MT)",
    "Revenue",
  ]);
  styleHeaderRow(trendHeader);
  monthlyTrend.forEach((m) => {
    trendSheet.addRow([
      m.label,
      m.orders,
      Number(m.quantity.toFixed(2)),
      Number(m.revenue.toFixed(2)),
    ]);
  });
  autoSizeColumns(trendSheet);

  // 4. Executive & Country Performance
  const execSheet = workbook.addWorksheet("Executives & Countries");
  const execHeader = execSheet.addRow([
    "Executive",
    "Orders",
    "Quantity (MT)",
    "Revenue",
  ]);
  styleHeaderRow(execHeader);
  executivePerformance.forEach((e) => {
    execSheet.addRow([
      e.fullName || e.name,
      e.orders,
      Number(e.quantity.toFixed(2)),
      Number(e.revenue.toFixed(2)),
    ]);
  });
  execSheet.addRow([]);
  const countryHeader = execSheet.addRow([
    "Country",
    "Orders",
    "Quantity (MT)",
    "Revenue",
    "Share %",
  ]);
  styleHeaderRow(countryHeader);
  countrySales.forEach((c) => {
    execSheet.addRow([
      c.name,
      c.orders,
      Number(c.quantity.toFixed(2)),
      Number(c.revenue.toFixed(2)),
      `${c.pct.toFixed(2)}%`,
    ]);
  });
  autoSizeColumns(execSheet);

  // 5. Customer Contribution
  const custSheet = workbook.addWorksheet("Customer Contribution");
  const custHeader = custSheet.addRow([
    "Customer",
    "Orders",
    "Quantity (MT)",
    "Revenue",
    "Contribution %",
  ]);
  styleHeaderRow(custHeader);
  customerContribution.forEach((c) => {
    custSheet.addRow([
      c.fullName || c.name,
      c.orders,
      Number(c.quantity.toFixed(2)),
      Number(c.revenue.toFixed(2)),
      `${c.pct.toFixed(2)}%`,
    ]);
  });
  autoSizeColumns(custSheet);

  // 6. Filtered Orders
  const ordersSheet = workbook.addWorksheet("Filtered Orders");
  const ordersHeader = ordersSheet.addRow([
    "Business Ref",
    "Order Number",
    "Date",
    "Customer",
    "Executive",
    "Product",
    "Country",
    "Currency",
    "Quantity (MT)",
    "Sales Value",
  ]);
  styleHeaderRow(ordersHeader);
  orders.forEach((o) => {
    ordersSheet.addRow([
      o.businessReference || "",
      o.orderNumber || "",
      o.date || "",
      o.customer || "",
      getExecutiveFirstName(o.salesExecutive) || o.salesExecutive || "",
      o.product || "",
      o.destination || "",
      o.currency || "",
      Number(o.quantity || 0),
      Number(o.salesValue || 0),
    ]);
  });
  autoSizeColumns(ordersSheet);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  triggerDownload(blob, `sales_analytics_${getExportFileStamp()}.xlsx`);
}

/**
 * Rasterize a live SVG node into an HTMLImageElement for high-DPI Canvas export.
 */
function svgElementToImage(svgEl, targetWidth, targetHeight) {
  return new Promise((resolve, reject) => {
    try {
      const rect = svgEl.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width || targetWidth || 500));
      const height = Math.max(1, Math.round(rect.height || targetHeight || 260));

      const clone = svgEl.cloneNode(true);
      clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      clone.setAttribute("width", String(width));
      clone.setAttribute("height", String(height));
      if (!clone.getAttribute("viewBox")) {
        clone.setAttribute("viewBox", `0 0 ${width} ${height}`);
      }
      clone.style.fontFamily = "Inter, Arial, sans-serif";

      const serialized = new XMLSerializer().serializeToString(clone);
      const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
        serialized
      )}`;

      const img = new Image();
      img.onload = () => resolve({ img, width, height });
      img.onerror = (err) => reject(err);
      img.src = dataUrl;
    } catch (err) {
      reject(err);
    }
  });
}

function drawRoundedRect(ctx, x, y, w, h, r, fill, stroke) {
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.rect(x, y, w, h);
  }
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function drawTruncatedText(ctx, text, x, y, maxWidth) {
  const str = String(text ?? "");
  if (ctx.measureText(str).width <= maxWidth) {
    ctx.fillText(str, x, y);
    return;
  }
  let trimmed = str;
  while (trimmed.length > 1 && ctx.measureText(`${trimmed}…`).width > maxWidth) {
    trimmed = trimmed.slice(0, -1);
  }
  ctx.fillText(`${trimmed}…`, x, y);
}

/**
 * Compose a 2x HiDPI PNG infographic containing KPIs, MoM cards, live chart SVGs, and Product Table.
 */
export async function exportSalesAnalyticsPng({ containerEl, analytics }) {
  const {
    currencyMeta,
    activeFilters,
    kpis,
    monthOverMonth,
    productDistribution,
    customerContribution,
    productPerformanceTable,
  } = analytics;

  // Snapshot live chart SVGs from container
  const chartMap = new Map();
  if (containerEl) {
    const cards = containerEl.querySelectorAll("[data-chart-card='true']");
    await Promise.all(
      Array.from(cards).map(async (card) => {
        const title = card.getAttribute("data-chart-title") || "";
        const svg = card.querySelector("svg.recharts-surface");
        if (!title || !svg) return;
        try {
          const snapshot = await svgElementToImage(svg);
          chartMap.set(title, snapshot);
        } catch {
          // Ignore single chart rasterization issue gracefully
        }
      })
    );
  }

  const width = 1440;
  const pad = 36;
  const contentW = width - pad * 2;
  const tableRows = productPerformanceTable.slice(0, 12);
  const tableHeight = 96 + Math.max(1, tableRows.length) * 34 + 38;
  const height = 1460 + tableHeight;

  const scale = 2;
  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);

  // Canvas background
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, width, height);

  // Header Banner
  drawRoundedRect(ctx, pad, 28, contentW, 92, 16, "#ffffff", "#e2e8f0");
  ctx.fillStyle = "#0f172a";
  ctx.font = "700 22px Inter, Arial, sans-serif";
  ctx.fillText("Monthly Sales Analytics Dashboard", pad + 24, 66);

  ctx.fillStyle = "#64748b";
  ctx.font = "500 12px Inter, Arial, sans-serif";
  const filterText = activeFilters.map((f) => `${f.label}: ${f.value}`).join("  •  ");
  drawTruncatedText(
    ctx,
    `${filterText}   |   Generated ${new Date().toLocaleString()}`,
    pad + 24,
    94,
    contentW - 48
  );

  // KPI Cards (3x2 grid)
  const kpiCards = [
    {
      label: "TOTAL REVENUE",
      value: formatCurrencyValue(kpis.totalRevenue, currencyMeta),
      sub:
        currencyMeta.mode === "mixed"
          ? "Mixed currencies"
          : currencyMeta.code || "Confirmed order value",
      accent: "#007aff",
    },
    {
      label: "TOTAL QUANTITY",
      value: `${formatNumber(kpis.totalQuantity, 2)} MT`,
      sub: `Avg ${formatNumber(kpis.avgOrderQty, 2)} MT / order`,
      accent: "#10b981",
    },
    {
      label: "AVERAGE SELLING PRICE",
      value: `${formatCurrencyValue(kpis.avgSellingPrice, currencyMeta)} / MT`,
      sub: "Weighted average",
      accent: "#6366f1",
    },
    {
      label: "TOTAL ORDERS",
      value: String(kpis.totalOrders),
      sub: `${kpis.uniqueCustomers} customers · ${kpis.activeExecutives} execs`,
      accent: "#f59e0b",
    },
    {
      label: "TOP CUSTOMER",
      value: kpis.topCustomer?.name || "N/A",
      sub: kpis.topCustomer
        ? `${formatCurrencyValue(kpis.topCustomer.revenue, currencyMeta)} (${kpis.topCustomer.sharePct.toFixed(1)}%)`
        : "No orders",
      accent: "#ec4899",
    },
    {
      label: "TOP EXECUTIVE",
      value: kpis.topExecutive?.name || "N/A",
      sub: kpis.topExecutive
        ? `${kpis.topExecutive.orders} orders · ${formatCurrencyValue(kpis.topExecutive.revenue, currencyMeta)}`
        : "No orders",
      accent: "#06b6d4",
    },
  ];

  let yCursor = 140;
  const kpiW = (contentW - 32) / 3;
  const kpiH = 88;
  kpiCards.forEach((card, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const x = pad + col * (kpiW + 16);
    const y = yCursor + row * (kpiH + 14);
    drawRoundedRect(ctx, x, y, kpiW, kpiH, 14, "#ffffff", "#e2e8f0");
    drawRoundedRect(ctx, x + 16, y + 18, 4, 52, 2, card.accent, null);

    ctx.fillStyle = "#64748b";
    ctx.font = "700 10px Inter, Arial, sans-serif";
    ctx.fillText(card.label, x + 32, y + 28);

    ctx.fillStyle = "#0f172a";
    ctx.font = "700 18px Inter, Arial, sans-serif";
    drawTruncatedText(ctx, card.value, x + 32, y + 54, kpiW - 48);

    ctx.fillStyle = "#64748b";
    ctx.font = "500 11px Inter, Arial, sans-serif";
    drawTruncatedText(ctx, card.sub, x + 32, y + 74, kpiW - 48);
  });

  // MoM Comparison Row
  yCursor += kpiH * 2 + 34;
  const momItems = [
    {
      title: "MoM REVENUE",
      val: formatCurrencyValue(monthOverMonth.revenue.current, currencyMeta),
      prev: formatCurrencyValue(monthOverMonth.revenue.previous, currencyMeta),
      delta: monthOverMonth.revenue.deltaPct,
    },
    {
      title: "MoM QUANTITY",
      val: `${formatNumber(monthOverMonth.quantity.current, 2)} MT`,
      prev: `${formatNumber(monthOverMonth.quantity.previous, 2)} MT`,
      delta: monthOverMonth.quantity.deltaPct,
    },
    {
      title: "MoM ORDERS",
      val: String(monthOverMonth.orders.current),
      prev: String(monthOverMonth.orders.previous),
      delta: monthOverMonth.orders.deltaPct,
    },
  ];
  momItems.forEach((m, idx) => {
    const x = pad + idx * (kpiW + 16);
    drawRoundedRect(ctx, x, yCursor, kpiW, 80, 14, "#ffffff", "#e2e8f0");
    ctx.fillStyle = "#64748b";
    ctx.font = "700 10px Inter, Arial, sans-serif";
    ctx.fillText(
      `${m.title} (${monthOverMonth.currentLabel})`,
      x + 18,
      yCursor + 24
    );
    ctx.fillStyle = "#0f172a";
    ctx.font = "700 17px Inter, Arial, sans-serif";
    ctx.fillText(m.val, x + 18, yCursor + 50);

    const deltaText =
      m.delta === null
        ? "Single Month"
        : `${m.delta >= 0 ? "+" : ""}${m.delta.toFixed(1)}%`;
    ctx.fillStyle =
      m.delta === null ? "#64748b" : m.delta >= 0 ? "#059669" : "#dc2626";
    ctx.font = "700 13px Inter, Arial, sans-serif";
    ctx.fillText(deltaText, x + kpiW - 108, yCursor + 50);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "500 10px Inter, Arial, sans-serif";
    ctx.fillText(
      monthOverMonth.canCompare
        ? `vs ${monthOverMonth.previousLabel}: ${m.prev}`
        : "Select 'All Months' for MoM delta",
      x + 18,
      yCursor + 68
    );
  });

  // Helper to draw a chart card with captured SVG (plus legend for donut charts)
  const drawChartCard = (title, x, y, w, h, donutItems = null) => {
    drawRoundedRect(ctx, x, y, w, h, 14, "#ffffff", "#e2e8f0");
    ctx.fillStyle = "#0f172a";
    ctx.font = "700 14px Inter, Arial, sans-serif";
    ctx.fillText(title, x + 20, y + 30);

    const snap = chartMap.get(title);
    if (snap?.img) {
      const hasLegend = Array.isArray(donutItems) && donutItems.length > 0;
      const chartAreaW = hasLegend ? (w - 44) * 0.44 : w - 36;
      const availH = h - 56;
      const ratio = Math.min(chartAreaW / snap.width, availH / snap.height);
      const drawW = snap.width * ratio;
      const drawH = snap.height * ratio;
      const dx = hasLegend ? x + 18 + (chartAreaW - drawW) / 2 : x + (w - drawW) / 2;
      const dy = y + 44 + (availH - drawH) / 2;
      ctx.drawImage(snap.img, dx, dy, drawW, drawH);

      if (hasLegend) {
        const legendX = x + 28 + chartAreaW;
        const legendW = w - (legendX - x) - 20;
        let ly = y + 58;
        donutItems.slice(0, 7).forEach((item) => {
          drawRoundedRect(ctx, legendX, ly - 9, 10, 10, 5, item.fill || "#007aff", null);
          ctx.fillStyle = "#334155";
          ctx.font = "500 11px Inter, Arial, sans-serif";
          drawTruncatedText(ctx, item.name, legendX + 18, ly, legendW - 76);

          ctx.fillStyle = "#0f172a";
          ctx.font = "700 11px Inter, Arial, sans-serif";
          ctx.textAlign = "right";
          ctx.fillText(`${(item.pct || 0).toFixed(1)}%`, legendX + legendW, ly);
          ctx.textAlign = "left";
          ly += 27;
        });
      }
    } else {
      ctx.fillStyle = "#94a3b8";
      ctx.font = "500 12px Inter, Arial, sans-serif";
      ctx.fillText("No chart data", x + 20, y + h / 2);
    }
  };

  // Monthly Sales Trend (Full Width)
  yCursor += 98;
  drawChartCard("Monthly Sales Trend", pad, yCursor, contentW, 300);

  // Row 2: Product Distribution & Executive Performance
  yCursor += 318;
  const halfW = (contentW - 18) / 2;
  drawChartCard("Product Distribution", pad, yCursor, halfW, 280, productDistribution);
  drawChartCard("Executive Performance", pad + halfW + 18, yCursor, halfW, 280);

  // Row 3: Country-wise Sales & Customer Contribution
  yCursor += 298;
  drawChartCard("Country-wise Sales", pad, yCursor, halfW, 280);
  drawChartCard("Customer Contribution", pad + halfW + 18, yCursor, halfW, 280, customerContribution);

  // Product Performance Table
  yCursor += 300;
  drawRoundedRect(ctx, pad, yCursor, contentW, tableHeight, 14, "#ffffff", "#e2e8f0");
  ctx.fillStyle = "#0f172a";
  ctx.font = "700 14px Inter, Arial, sans-serif";
  ctx.fillText("Product Performance Summary", pad + 20, yCursor + 30);

  const cols = [
    { label: "PRODUCT", x: pad + 20, align: "left", w: 360 },
    { label: "ORDERS", x: pad + 440, align: "right", w: 90 },
    { label: "QUANTITY (MT)", x: pad + 610, align: "right", w: 140 },
    { label: "REVENUE", x: pad + 850, align: "right", w: 200 },
    { label: "AVG PRICE / MT", x: pad + 1090, align: "right", w: 180 },
    { label: "CONTRIBUTION %", x: pad + contentW - 24, align: "right", w: 130 },
  ];

  const headerY = yCursor + 54;
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(pad + 1, headerY - 16, contentW - 2, 32);
  ctx.fillStyle = "#64748b";
  ctx.font = "700 10px Inter, Arial, sans-serif";
  cols.forEach((c) => {
    ctx.textAlign = c.align;
    ctx.fillText(c.label, c.x, headerY + 4);
  });

  let rowY = headerY + 34;
  ctx.font = "500 12px Inter, Arial, sans-serif";
  tableRows.forEach((row) => {
    ctx.fillStyle = "#1e293b";
    ctx.textAlign = "left";
    drawTruncatedText(ctx, row.name, cols[0].x, rowY, cols[0].w);
    ctx.textAlign = "right";
    ctx.fillText(String(row.orders), cols[1].x, rowY);
    ctx.fillText(formatNumber(row.quantity, 2), cols[2].x, rowY);
    ctx.fillText(formatCurrencyValue(row.revenue, currencyMeta), cols[3].x, rowY);
    ctx.fillText(formatCurrencyValue(row.avgPrice, currencyMeta), cols[4].x, rowY);
    ctx.fillStyle = "#007aff";
    ctx.font = "700 12px Inter, Arial, sans-serif";
    ctx.fillText(`${row.contributionPct.toFixed(1)}%`, cols[5].x, rowY);
    ctx.font = "500 12px Inter, Arial, sans-serif";

    ctx.strokeStyle = "#f1f5f9";
    ctx.beginPath();
    ctx.moveTo(pad + 16, rowY + 11);
    ctx.lineTo(pad + contentW - 16, rowY + 11);
    ctx.stroke();
    rowY += 34;
  });
  ctx.textAlign = "left";

  await new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Could not generate PNG image."));
        return;
      }
      triggerDownload(blob, `sales_analytics_${getExportFileStamp()}.png`);
      resolve();
    }, "image/png");
  });
}

/**
 * Export Analytics Dashboard as clean A4 Landscape PDF using an isolated hidden iframe.
 * Mirrors the repo's printInvoiceUtil pattern to prevent AppShell overflow clipping.
 */
export function exportSalesAnalyticsPdf({
  elementId = "sales-analytics-print-area",
  documentTitle = `Monthly_Sales_Analytics_${getExportFileStamp()}`,
} = {}) {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }

  const target = document.getElementById(elementId);
  if (!target) {
    return false;
  }

  const oldIframe = document.getElementById("sales-analytics-print-iframe");
  if (oldIframe) {
    try {
      oldIframe.remove();
    } catch {
      // Ignore cleanup errors
    }
  }

  const clone = target.cloneNode(true);
  clone.querySelectorAll("[data-export-hide='true']").forEach((el) => el.remove());

  // Freeze exact SVG dimensions from live DOM so Recharts charts never collapse in iframe
  const liveSvgs = target.querySelectorAll("svg.recharts-surface");
  const clonedSvgs = clone.querySelectorAll("svg.recharts-surface");
  liveSvgs.forEach((liveSvg, idx) => {
    const clonedSvg = clonedSvgs[idx];
    if (!clonedSvg) return;
    const rect = liveSvg.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      if (!clonedSvg.getAttribute("viewBox")) {
        clonedSvg.setAttribute(
          "viewBox",
          `0 0 ${Math.round(rect.width)} ${Math.round(rect.height)}`
        );
      }
      clonedSvg.style.width = "100%";
      clonedSvg.style.height = `${Math.round(rect.height)}px`;
      clonedSvg.style.maxWidth = "100%";
    }
  });

  const iframe = document.createElement("iframe");
  iframe.id = "sales-analytics-print-iframe";
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.position = "fixed";
  iframe.style.top = "0";
  iframe.style.left = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  iframe.style.opacity = "0";
  iframe.style.pointerEvents = "none";
  iframe.style.zIndex = "-9999";
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;
  if (!iframeDoc) {
    iframe.remove();
    return false;
  }

  const headStyles = [];
  document.querySelectorAll("link[rel='stylesheet'], style").forEach((node) => {
    headStyles.push(node.outerHTML);
  });

  const printCss = `
    <style id="sales-analytics-pdf-css">
      @page {
        size: A4 landscape;
        margin: 10mm;
      }
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        height: auto !important;
        overflow: visible !important;
        background: #ffffff !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      #${elementId} {
        padding: 0 !important;
        background: #ffffff !important;
      }
      [data-chart-card="true"], section {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
        box-shadow: none !important;
        border: 1px solid #e2e8f0 !important;
      }
    </style>
  `;

  iframeDoc.open();
  iframeDoc.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>${documentTitle}</title>
        ${headStyles.join("\n")}
        ${printCss}
      </head>
      <body>
        ${clone.outerHTML}
      </body>
    </html>
  `);
  iframeDoc.close();

  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } finally {
      setTimeout(() => {
        try {
          iframe.remove();
        } catch {
          // Ignore cleanup errors
        }
      }, 2000);
    }
  }, 350);

  return true;
}
