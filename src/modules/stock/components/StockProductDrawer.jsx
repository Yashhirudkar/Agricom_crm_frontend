import React, { useEffect, useMemo } from "react";
import { X } from "lucide-react";

const numberFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function formatNumber(value) {
  return numberFormatter.format(Number(value) || 0);
}

function formatMT(value) {
  return `${formatNumber(value)} MT`;
}

// Predefined ERP Movement Type Badges
const MOVEMENT_CONFIG = {
  // Purchases
  "Purchase Contract Created": {
    bg: "bg-[#ECFDF3]",
    text: "text-[#027A48]",
    border: "border-[#A6F4C5]",
    prefix: "+",
  },
  "Purchase Created": {
    bg: "bg-[#ECFDF3]",
    text: "text-[#027A48]",
    border: "border-[#A6F4C5]",
    prefix: "+",
  },
  "Purchase Updated": {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    prefix: "",
  },
  "Purchase Cancelled": {
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-300",
    prefix: "✕",
  },

  // Sales
  "Sales Contract": {
    bg: "bg-[#FEF3F2]",
    text: "text-[#D92D20]",
    border: "border-[#FECDCA]",
    prefix: "-",
  },
  "Sales Created": {
    bg: "bg-[#FEF3F2]",
    text: "text-[#D92D20]",
    border: "border-[#FECDCA]",
    prefix: "-",
  },
  "Sales Allocation": {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    prefix: "↳",
  },

  // Shipments
  "Shipment Loaded": {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    prefix: "",
  },
  "Shipment Created": {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    prefix: "",
  },
  "Shipment Delivered": {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    prefix: "✓",
  },
  "Shipment Cancelled": {
    bg: "bg-gray-100",
    text: "text-gray-600",
    border: "border-gray-300",
    prefix: "✕",
  },

  // Stock Adjustments & Corrections
  "Stock Adjustment": {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    prefix: "",
  },
  "Warehouse Transfer": {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
    prefix: "⇄",
  },
  "Opening Balance": {
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
    prefix: "+",
  },
  "Manual Correction": {
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    prefix: "✎",
  },
  "Return": {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
    prefix: "↩",
  },
  "Debit Note": {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    prefix: "-",
  },
  "Credit Note": {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    prefix: "+",
  },
};

function getMovementBadgeStyle(movement) {
  if (movement && MOVEMENT_CONFIG[movement]) {
    return MOVEMENT_CONFIG[movement];
  }
  const lower = (movement || "").toLowerCase();
  if (lower.includes("purchase") || lower.includes("credit") || lower.includes("opening")) {
    return { bg: "bg-[#ECFDF3]", text: "text-[#027A48]", border: "border-[#A6F4C5]", prefix: "+" };
  }
  if (lower.includes("sales") || lower.includes("debit")) {
    return { bg: "bg-[#FEF3F2]", text: "text-[#D92D20]", border: "border-[#FECDCA]", prefix: "-" };
  }
  if (lower.includes("loaded") || lower.includes("transit")) {
    return { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", prefix: "" };
  }
  if (lower.includes("cancel")) {
    return { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-300", prefix: "✕" };
  }
  if (lower.includes("transfer")) {
    return { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", prefix: "⇄" };
  }
  if (lower.includes("adjust") || lower.includes("correct")) {
    return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", prefix: "" };
  }
  return { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", prefix: "" };
}

function MovementBadge({ movement }) {
  const style = getMovementBadgeStyle(movement);
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded px-2 py-0.5 text-[11px] font-medium border ${style.bg} ${style.text} ${style.border}`}
    >
      {style.prefix && <span className="font-bold text-[10px] leading-none">{style.prefix}</span>}
      <span>{movement || "—"}</span>
    </span>
  );
}

function formatDate(value) {
  if (!value) return <span className="text-slate-400">—</span>;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return <span className="text-slate-400">{String(value)}</span>;

  const d = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const t = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="leading-tight">
      <div className="font-medium text-slate-800">{d}</div>
      <div className="text-[10px] text-slate-400 tabular-nums">{t}</div>
    </div>
  );
}

function resolveParty(m) {
  if (m.party && m.party !== "—") return m.party;
  const movementType = (m.movement || "").toLowerCase();

  // 1. Purchase Contract -> Supplier Name
  if (movementType.includes("purchase")) {
    return m.supplierName || (m.supplier && m.supplier !== "N/A" ? m.supplier : null) || "—";
  }

  // 2. Sales Contract -> Buyer Name
  if (movementType.includes("sales")) {
    return m.buyerName || m.buyer || "—";
  }

  // 3. Shipment:
  // If linked to Sales Contract -> Buyer
  // If linked only to Purchase Contract -> Supplier
  if (movementType.includes("shipment")) {
    if (m.buyerName || m.buyer) return m.buyerName || m.buyer;
    if (m.supplierName || (m.supplier && m.supplier !== "N/A" ? m.supplier : null)) {
      return m.supplierName || m.supplier;
    }
    return "—";
  }

  // 4. Internal Stock Movement -> "—"
  if (
    movementType.includes("transfer") ||
    movementType.includes("adjust") ||
    movementType.includes("correction") ||
    movementType.includes("opening")
  ) {
    return "—";
  }

  return (
    m.supplierName ||
    (m.supplier && m.supplier !== "N/A" ? m.supplier : null) ||
    m.buyerName ||
    m.buyer ||
    "—"
  );
}

export default function StockProductDrawer({ isOpen, onClose, selectedProduct, countryName }) {
  const movements = useMemo(() => {
    if (Array.isArray(selectedProduct?.movements) && selectedProduct.movements.length > 0) {
      let runningBalance = 0;
      return selectedProduct.movements.map((m, idx) => {
        const qtyIn = Number(m.in ?? m.qtyIn ?? (m.type === "IN" ? m.quantity : 0)) || 0;
        const qtyOut = Number(m.out ?? m.qtyOut ?? (m.type === "OUT" ? m.quantity : 0)) || 0;
        runningBalance = m.balance !== undefined ? Number(m.balance) : runningBalance + qtyIn - qtyOut;
        const partyName = resolveParty(m);
        return {
          id: m.id || m._id || idx,
          date: m.date || m.timestamp || m.contractDate || m.createdAt,
          movement: m.movement || m.movementType || "Stock Adjustment",
          reference: m.businessReference || m.businessTransaction?.businessReference || m.reference || m.contractNo || "—",
          party: partyName,
          buyer: m.buyer || m.buyerName || null,
          supplier: m.supplier || m.supplierName || null,
          product: m.product || selectedProduct?.product,
          in: qtyIn,
          out: qtyOut,
          balance: runningBalance,
          user: m.user || m.userName || m.createdByName || null,
          remarks: m.remarks || m.notes || null,
          contractId: m.contractId,
        };
      });
    }

    const contractsList = selectedProduct?.contracts || [];
    let running = 0;
    return contractsList.map((c, i) => {
      const qtyIn = Number(c.purchaseQty !== undefined ? c.purchaseQty : c.in || 0);
      const qtyOut = Number(c.out || 0);
      running += qtyIn - qtyOut;
      const supplierName = c.supplierName || (c.supplier && c.supplier !== "N/A" ? c.supplier : null);
      const buyerName = c.buyerName || c.buyer || null;
      return {
        id: c.contractId || c.id || i,
        date: c.contractDate || c.purchaseDate || c.createdAt,
        movement: c.movement || "Purchase Contract Created",
        reference: c.businessReference || c.businessTransaction?.businessReference || c.reference || "—",
        party: supplierName || "—",
        supplier: supplierName,
        buyer: buyerName,
        product: selectedProduct?.product,
        in: qtyIn,
        out: qtyOut,
        balance: running,
        user: c.user || c.createdByName || c.userName || null,
        remarks: c.remarks || c.notes || null,
        contractId: c.contractId,
      };
    });
  }, [selectedProduct]);

  const totals = useMemo(() => {
    const totalIn = movements.reduce((sum, m) => sum + (Number(m.in) || 0), 0);
    const totalOut = movements.reduce((sum, m) => sum + (Number(m.out) || 0), 0);
    const closingBalance =
      movements.length > 0 ? movements[movements.length - 1].balance : totalIn - totalOut;
    return { totalIn, totalOut, closingBalance };
  }, [movements]);

  const totalsByCurrency = useMemo(
    () =>
      Object.entries(selectedProduct?.amountByCurrency || {}).map(
        ([currency, amount]) => `${currency} ${formatNumber(amount)}`
      ),
    [selectedProduct]
  );
  const totalAmount = totalsByCurrency.length > 0 ? totalsByCurrency.join(" / ") : "—";

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !selectedProduct) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Stock Movement Register Drawer"
    >
      <button
        type="button"
        className="absolute inset-0 h-full w-full cursor-default bg-slate-950/40 transition-opacity"
        onClick={onClose}
        aria-label="Close drawer backdrop"
      />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-[82vw] flex-col border-l border-slate-300 bg-white shadow-2xl">
        {/* Compact ERP Header */}
        <header className="shrink-0 border-b border-slate-200 bg-white px-5 py-3.5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <span>Stock Movement Register</span>
                <span>•</span>
                <span>Place of Loading: <strong className="text-slate-700">{countryName || "—"}</strong></span>
              </div>
              <h2 className="mt-0.5 text-lg font-bold uppercase tracking-tight text-slate-950">
                {selectedProduct.product || "—"}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Quick ERP Density Metrics Strip */}
          <div className="mt-3 flex flex-wrap items-center gap-6 border-t border-slate-100 pt-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 text-[11px]">Total Purchased:</span>
              <span className="font-semibold text-slate-900">{formatMT(selectedProduct.purchased)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 text-[11px]">Total Purchase Value:</span>
              <span className="font-semibold text-slate-900">{totalAmount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 text-[11px]">Closing Balance:</span>
              <span className="font-bold text-slate-950">{formatMT(totals.closingBalance)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 text-[11px]">Total Records:</span>
              <span className="font-semibold text-slate-700">{movements.length}</span>
            </div>
          </div>
        </header>

        {/* Main Content - Only Stock Movement Register Table */}
        <main className="min-h-0 flex-1 overflow-hidden p-5 flex flex-col bg-white">
          <div className="relative flex-1 overflow-auto border border-slate-200 rounded-none bg-white">
            <table className="w-full min-w-[850px] border-collapse text-left text-xs">
              {/* Sticky ERP Header */}
              <thead className="sticky top-0 z-20 bg-slate-100 text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-600 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <tr className="border-b border-slate-200">
                  <th scope="col" className="px-3 py-2.5 whitespace-nowrap w-[130px] border-r border-slate-200/60">
                    Date / Time
                  </th>
                  <th scope="col" className="px-3 py-2.5 whitespace-nowrap min-w-[180px] border-r border-slate-200/60">
                    Movement
                  </th>
                  <th scope="col" className="px-3 py-2.5 whitespace-nowrap min-w-[140px] border-r border-slate-200/60">
                    Reference
                  </th>
                  <th scope="col" className="px-3 py-2.5 whitespace-nowrap min-w-[160px] border-r border-slate-200/60">
                    Buyer / Supplier
                  </th>
                  <th scope="col" className="px-3 py-2.5 whitespace-nowrap min-w-[160px] border-r border-slate-200/60">
                    Product
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-right whitespace-nowrap min-w-[110px] border-r border-slate-200/60">
                    Qty In
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-right whitespace-nowrap min-w-[110px] border-r border-slate-200/60">
                    Qty Out
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-right whitespace-nowrap min-w-[110px]">
                    Balance
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                {movements.length > 0 ? (
                  movements.map((m, idx) => (
                    <tr
                      key={m.id || idx}
                      className="cursor-pointer transition-colors hover:bg-[#F0F7FF]"
                    >
                      {/* Date */}
                      <td className="px-3 py-2 whitespace-nowrap border-r border-slate-100">
                        {formatDate(m.date)}
                      </td>

                      {/* Movement */}
                      <td className="px-3 py-2 whitespace-nowrap border-r border-slate-100">
                        <MovementBadge movement={m.movement} />
                      </td>

                      {/* Reference */}
                      <td className="px-3 py-2 whitespace-nowrap border-r border-slate-100 font-mono font-medium text-slate-800 cursor-default">
                        {m.reference && m.reference !== "—" ? (
                          m.reference
                        ) : (
                          <span className="text-slate-400 font-sans font-normal">—</span>
                        )}
                      </td>

                      {/* Buyer / Supplier */}
                      <td className="px-3 py-2 font-medium text-slate-800 whitespace-nowrap border-r border-slate-100">
                        {m.party && m.party !== "—" ? (
                          m.party
                        ) : (
                          <span className="text-slate-400 font-normal">—</span>
                        )}
                      </td>

                      {/* Product */}
                      <td className="px-3 py-2 font-medium text-slate-800 whitespace-nowrap border-r border-slate-100">
                        {m.product || selectedProduct.product || "—"}
                      </td>

                      {/* Qty In */}
                      <td className="px-3 py-2 text-right whitespace-nowrap border-r border-slate-100">
                        {m.in > 0 ? (
                          <span className="font-semibold text-[#027A48] tabular-nums">
                            +{formatNumber(m.in)} MT
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Qty Out */}
                      <td className="px-3 py-2 text-right whitespace-nowrap border-r border-slate-100">
                        {m.out > 0 ? (
                          <span className="font-semibold text-[#D92D20] tabular-nums">
                            -{formatNumber(m.out)} MT
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Balance */}
                      <td className="px-3 py-2 text-right whitespace-nowrap">
                        <span className="font-bold text-slate-900 tabular-nums">
                          {formatNumber(m.balance)} MT
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="py-10 px-4 text-center bg-white">
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-xs font-semibold text-slate-800">
                          No Stock Movements Found
                        </p>
                        <p className="mt-1 text-[11px] text-slate-500">
                          No inventory transactions have been recorded for this product.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>

              {/* Sticky ERP Footer Summary Row */}
              <tfoot className="sticky bottom-0 z-20 bg-slate-100/95 backdrop-blur-sm border-t-2 border-slate-300 text-xs shadow-[0_-2px_4px_rgba(0,0,0,0.03)] font-semibold">
                <tr>
                  <td
                    colSpan="5"
                    className="px-3 py-2.5 text-right uppercase tracking-wider text-[11px] text-slate-700 border-r border-slate-200/60 font-bold"
                  >
                    Total / Closing Balance:
                  </td>
                  <td className="px-3 py-2.5 text-right font-semibold text-[#027A48] tabular-nums whitespace-nowrap border-r border-slate-200/60">
                    +{formatNumber(totals.totalIn)} MT
                  </td>
                  <td className="px-3 py-2.5 text-right font-semibold text-[#D92D20] tabular-nums whitespace-nowrap border-r border-slate-200/60">
                    {totals.totalOut > 0 ? `-${formatNumber(totals.totalOut)} MT` : "—"}
                  </td>
                  <td className="px-3 py-2.5 text-right font-bold text-slate-900 tabular-nums whitespace-nowrap">
                    {formatNumber(totals.closingBalance)} MT
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </main>

        {/* Compact Footer Bar */}
        <footer className="shrink-0 border-t border-slate-300 bg-slate-50 px-5 py-2.5">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
              <span className="text-slate-600">
                Total Qty In:{" "}
                <strong className="text-[#027A48]">+{formatNumber(totals.totalIn)} MT</strong>
              </span>
              <span className="text-slate-600">
                Total Qty Out:{" "}
                <strong className="text-[#D92D20]">
                  {totals.totalOut > 0 ? `-${formatNumber(totals.totalOut)} MT` : "0 MT"}
                </strong>
              </span>
              <span className="text-slate-600">
                Closing Balance:{" "}
                <strong className="text-slate-900 font-bold">
                  {formatNumber(totals.closingBalance)} MT
                </strong>
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              ERP Stock Movement Register • Live Data
            </span>
          </div>
        </footer>
      </aside>
    </div>
  );
}
