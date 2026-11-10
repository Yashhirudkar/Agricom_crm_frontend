import React, { useEffect, useRef, useState } from "react";
import { ChevronRight, FileText, Globe, Package } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { getAlpha2Code } from "@/lib/countryUtils";

const numberFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const CURRENCY_STYLES = {
  USD: "bg-emerald-50 text-emerald-700 border-emerald-100",
  INR: "bg-amber-50 text-amber-700 border-amber-200",
  EUR: "bg-indigo-50 text-indigo-700 border-indigo-200",
  AED: "bg-sky-50 text-sky-700 border-sky-200",
};
const CURRENCY_FLAGS = {
  USD: "🇺🇸",
  EUR: "🇪🇺",
  INR: "🇮🇳",
  GBP: "🇬🇧",
  AED: "🇦🇪",
  JPY: "🇯🇵",
};

function formatExchangeRateDate(value) {
  if (!value) return "Unavailable";
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function GrandTotalValue({ summary, formatAmounts }) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, above: true });
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);
  const currencyBreakdown = summary?.currencyBreakdown || [];
  const grandTotalInr = Number(
    summary?.grandTotalInr ??
      summary?.totalAmountINR ??
      summary?.totalAmountByCurrency?.INR ??
      0,
  );
  const tooltipId = "stock-grand-total-currency-breakdown";

  const showTooltip = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const estimatedHeight = Math.min(360, 132 + currencyBreakdown.length * 38);
    const above = rect.top >= estimatedHeight + 20;
    setPosition({
      top: above ? rect.top - 8 : rect.bottom + 8,
      left: Math.max(8, Math.min(rect.right - 280, window.innerWidth - 296)),
      above,
    });
    setIsOpen(true);
  };
  const handleMouseLeave = () => {
    if (window.matchMedia("(hover: hover)").matches) setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (
        !triggerRef.current?.contains(event.target) &&
        !popoverRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="block w-full cursor-help rounded-sm text-left outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        aria-label={`Grand total INR ${grandTotalInr.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}. Show original currency breakdown.`}
        aria-describedby={isOpen ? tooltipId : undefined}
        aria-expanded={isOpen}
        onMouseEnter={showTooltip}
        onMouseLeave={handleMouseLeave}
        onFocus={showTooltip}
        onClick={showTooltip}
      >
        {formatAmounts({ INR: grandTotalInr }, "", true)}
      </button>
      {isOpen && (
        <div
          ref={popoverRef}
          id={tooltipId}
          role="tooltip"
          className="fixed z-50 w-[280px] max-w-[calc(100vw-16px)] overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 text-left font-normal text-slate-700 shadow-xl"
          style={{
            top: position.top,
            left: position.left,
            maxHeight: "70vh",
            transform: position.above ? "translateY(-100%)" : undefined,
          }}
        >
          <div className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
            Original Currency Breakdown
          </div>
          <div className="space-y-2">
            {currencyBreakdown.map(({ currency, amount }) => (
              <div
                key={currency}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span aria-hidden="true" className="text-base">
                    {CURRENCY_FLAGS[currency] || "🌐"}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      CURRENCY_STYLES[currency] ||
                      "border-slate-200 bg-slate-50 text-slate-600"
                    }`}
                  >
                    {currency}
                  </span>
                </span>
                <span className="font-semibold tabular-nums text-slate-900">
                  {Number(amount || 0).toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            ))}
            {currencyBreakdown.length === 0 && (
              <div className="text-sm text-slate-400">
                No original currency totals available.
              </div>
            )}
          </div>
          <div className="my-3 border-t border-slate-200" />
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-500">
              Converted Total
            </span>
            <span className="font-bold tabular-nums text-slate-900">
              ₹{" "}
              {grandTotalInr.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-3 text-xs">
            <span className="text-slate-500">FX Date</span>
            <span className="font-medium text-slate-700">
              {formatExchangeRateDate(summary?.exchangeRateDate)}
            </span>
          </div>
        </div>
      )}
    </>
  );
}

function Flag({ country }) {
  const code = getAlpha2Code(country);

  if (!code) {
    return <Globe className="h-[18px] w-[18px] shrink-0 text-slate-500" />;
  }

  return (
    <ReactCountryFlag
      countryCode={code}
      svg
      aria-hidden="true"
      style={{
        width: "18px",
        height: "18px",
        borderRadius: "50%",
        verticalAlign: "middle",
        flexShrink: 0,
      }}
    />
  );
}

export default function MasterStockTable({
  countryGroups = [],
  onSelectProduct,
  summary,
}) {
  const [collapsedCountries, setCollapsedCountries] = useState({});

  const toggleCountry = (country) => {
    setCollapsedCountries((previous) => ({
      ...previous,
      [country]: !previous[country],
    }));
  };

  const toTitle = (text = "") =>
    String(text).toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

  const formatMT = (value) => `${numberFormatter.format(Number(value) || 0)} MT`;

  const formatAmounts = (amounts = {}, className = "", indianInrTotal = false) => {
    const entries = Object.entries(amounts);

    if (entries.length === 0) {
      return <span className="text-slate-400">—</span>;
    }

    return (
      <div className={`space-y-1 ${className}`}>
        {entries.map(([currency, amount]) => (
          <div key={currency} className="flex items-center gap-2 whitespace-nowrap">
            <span
              className={`rounded-full border px-1.5 py-px text-[10px] font-semibold uppercase ${CURRENCY_STYLES[currency] ||
                "bg-slate-50 text-slate-600 border-slate-200"
                }`}
            >
              {currency}
            </span>
            <span className="font-semibold">
              {indianInrTotal && currency === "INR"
                ? Number(amount || 0).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : numberFormatter.format(Number(amount) || 0)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const Bar = ({ value, total, className = "bg-orange-500" }) => {
    const pct = total > 0 ? Math.min(100, ((Number(value) || 0) / total) * 100) : 0;
    return (
      <div className="mt-1 flex items-center gap-1.5">
        <div className="h-1.5 w-[72px] overflow-hidden rounded-full bg-slate-200">
          <div className={`h-full rounded-full ${className}`} style={{ width: `${pct}%` }} />
        </div>
        <span className="text-[10px] text-slate-400 font-medium tabular-nums">
          {Math.round(pct)}%
        </span>
      </div>
    );
  };

  const grandTotal = countryGroups.reduce(
    (total, countryGroup) => {
      total.purchased += Number(countryGroup.totalPurchased) || 0;
      total.executed += Number(countryGroup.totalExecuted) || 0;
      total.available +=
        Number(
          countryGroup.totalAvailable !== undefined
            ? countryGroup.totalAvailable
            : countryGroup.totalPurchased,
        ) || 0;

      for (const product of countryGroup.products || []) {
        total.contracts +=
          product.contractCount ?? product.contracts?.length ?? 0;
      }

      return total;
    },
    { purchased: 0, executed: 0, available: 0, contracts: 0 },
  );
  return (
    <div className="overflow-hidden bg-white">
      <div className="max-h-[70vh] overflow-auto">
        <table className="min-w-[960px] w-full table-fixed border-collapse text-sm">
          <colgroup>
            <col className="w-[28%]" />
            <col className="w-[14%]" />
            <col className="w-[14%]" />
            <col className="w-[15%]" />
            <col className="w-[16%]" />
            <col className="w-[8%]" />
            <col className="w-[5%]" />
          </colgroup>

          <thead className="sticky top-0 z-10 bg-white">
            <tr className="h-11 border-b border-slate-200 text-xs font-medium text-slate-500">
              <th className="px-5 text-left">Country / Product</th>
              <th className="border-l border-slate-200 px-4 text-left">
                Purchased (MT)
              </th>
              <th className="border-l border-slate-200 px-4 text-left">
                Executed (MT)
              </th>
              <th className="border-l border-slate-200 px-4 text-left">
                Available (MT)
              </th>
              <th className="border-l border-slate-200 px-4 text-left">
                Total Value
              </th>
              <th className="border-l border-slate-200 px-4 text-left">
                Contracts
              </th>
              <th className="border-l border-slate-200 px-3" />
            </tr>
          </thead>

          <tbody>
            {countryGroups.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="h-32 px-5 text-center text-sm italic text-slate-400"
                >
                  No stock records found matching criteria
                </td>
              </tr>
            ) : (
              countryGroups.map((countryGroup, groupIndex) => {
                const countryProducts = countryGroup.products || [];
                const country =
                  countryGroup.country || `Country ${groupIndex + 1}`;
                const isCollapsed = Boolean(collapsedCountries[country]);
                const countryContracts = countryProducts.reduce(
                  (count, product) =>
                    count +
                    (product.contractCount ?? product.contracts?.length ?? 0),
                  0,
                );
                const cPurchased = Number(countryGroup.totalPurchased) || 0;
                const cExecuted = Number(countryGroup.totalExecuted) || 0;
                const cAvailable =
                  countryGroup.totalAvailable !== undefined
                    ? Number(countryGroup.totalAvailable)
                    : Math.max(0, cPurchased - cExecuted);

                return (
                  <React.Fragment key={country}>
                    {/* Country row */}
                    <tr
                      onClick={() => toggleCountry(country)}
                      className="h-[52px] cursor-pointer select-none border-b border-slate-100 bg-slate-50/70 transition-colors hover:bg-slate-100"
                    >
                      <td className="px-5">
                        <div className="flex items-center gap-3">
                          <ChevronRight
                            className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform ${isCollapsed ? "" : "rotate-90"
                              }`}
                          />
                          <Flag country={country} />
                          <span className="truncate font-semibold text-slate-900">
                            {toTitle(country)}
                          </span>
                          <span className="shrink-0 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                            {countryProducts.length}{" "}
                            {countryProducts.length === 1 ? "item" : "items"}
                          </span>
                        </div>
                      </td>
                      <td className="border-l border-slate-100 px-4">
                        <div className="text-[13px] font-semibold text-slate-900">
                          {formatMT(cPurchased)}
                        </div>
                      </td>
                      <td className="border-l border-slate-100 px-4">
                        <div className="text-[13px] font-semibold text-orange-700">
                          {formatMT(cExecuted)}
                        </div>
                        <Bar
                          value={cExecuted}
                          total={cPurchased}
                          className="bg-orange-500"
                        />
                      </td>
                      <td className="border-l border-slate-100 px-4">
                        <div className="text-[13px] font-bold text-emerald-700">
                          {formatMT(cAvailable)}
                        </div>
                      </td>
                      <td
                        className="border-l border-slate-100 px-4 text-[13px] text-slate-900"
                      >
                        {formatAmounts(countryGroup.amountByCurrency)}
                      </td>
                      <td className="border-l border-slate-100 px-4 text-[13px] font-semibold text-slate-900">
                        {countryContracts}
                      </td>
                      <td className="border-l border-slate-100 px-3" />
                    </tr>

                    {/* Product rows */}
                    {!isCollapsed &&
                      countryProducts.map((product, productIndex) => {
                        const isLast =
                          productIndex === countryProducts.length - 1;
                        const contractsCount =
                          product.contractCount ??
                          product.contracts?.length ??
                          0;

                        const pPurchased = Number(product.purchased) || 0;
                        const pExecuted = Number(product.executed) || 0;
                        const pAvailable =
                          product.available !== undefined
                            ? Number(product.available)
                            : Math.max(0, pPurchased - pExecuted);

                        return (
                          <tr
                            key={`${country}-${product.product || productIndex}`}
                            onClick={() => onSelectProduct?.(product, country)}
                            className="group h-[52px] cursor-pointer border-b border-slate-100 bg-white text-slate-700 transition-colors hover:bg-slate-50"
                          >
                            <td className="relative px-5 pl-16">
                              <span
                                className={`absolute left-8 top-0 border-l border-slate-200 ${isLast ? "h-1/2" : "h-full"
                                  }`}
                              />
                              <span className="absolute left-8 top-1/2 w-5 border-t border-slate-200" />
                              <div className="flex items-center gap-3">
                                <span className="w-5 shrink-0 font-mono text-[11px] text-slate-400">
                                  {String(productIndex + 1).padStart(2, "0")}
                                </span>
                                <Package className="h-4 w-4 shrink-0 text-slate-400" />
                                <span className="truncate text-[13px] font-medium uppercase text-slate-800">
                                  {product.product}
                                </span>
                              </div>
                            </td>
                            <td className="border-l border-slate-100 px-4">
                              <div className="text-[13px] font-semibold text-slate-800">
                                {formatMT(pPurchased)}
                              </div>
                            </td>
                            <td className="border-l border-slate-100 px-4">
                              <div className="text-[13px] font-semibold text-orange-700">
                                {formatMT(pExecuted)}
                              </div>
                              <Bar
                                value={pExecuted}
                                total={pPurchased}
                                className="bg-orange-500"
                              />
                            </td>
                            <td className="border-l border-slate-100 px-4">
                              <div className="text-[13px] font-bold text-emerald-700">
                                {formatMT(pAvailable)}
                              </div>
                            </td>
                            <td
                              className="border-l border-slate-100 px-4 text-[13px] text-slate-800"
                            >
                              {formatAmounts(product.amountByCurrency)}
                            </td>
                            <td className="border-l border-slate-100 px-4">
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  onSelectProduct?.(product, country);
                                }}
                                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
                                aria-label={`Open ${contractsCount} contracts for ${product.product}`}
                              >
                                <FileText className="h-3 w-3 text-slate-400" />
                                {contractsCount}
                              </button>
                            </td>
                            <td className="border-l border-slate-100 px-3 text-right text-slate-400">
                              <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                            </td>
                          </tr>
                        );
                      })}
                  </React.Fragment>
                );
              })
            )}
          </tbody>

          {countryGroups.length > 0 && (
            <tfoot className="sticky bottom-0 z-10">
              <tr className="h-14 border-t border-slate-200 bg-slate-50 text-slate-900">
                <td className="px-5 text-xs font-bold uppercase tracking-wide text-slate-600">
                  Grand Total ({countryGroups.length}{" "}
                  {countryGroups.length === 1 ? "Country" : "Countries"})
                </td>
                <td className="border-l border-slate-200 px-4 text-[13px] font-bold">
                  {formatMT(grandTotal.purchased)}
                </td>
                <td className="border-l border-slate-200 px-4 text-[13px] font-bold text-orange-700">
                  {formatMT(grandTotal.executed)}
                </td>
                <td className="border-l border-slate-200 px-4 text-[13px] font-bold text-emerald-700">
                  {formatMT(grandTotal.available)}
                </td>
                <td className="border-l border-slate-200 px-4 text-[13px] font-bold">
                  <GrandTotalValue
                    summary={summary}
                    formatAmounts={formatAmounts}
                  />
                </td>
                <td className="border-l border-slate-200 px-4 text-[13px] font-bold">
                  {grandTotal.contracts}
                </td>
                <td className="border-l border-slate-200 px-3" />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}