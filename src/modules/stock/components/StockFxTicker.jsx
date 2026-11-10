import React from "react";

function formatEffectiveDate(value) {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function formatUpdatedTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unavailable";
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  })
    .format(date)
    .toUpperCase();
}

export default function StockFxTicker({
  rates = [],
  usingPreviousRates = false,
  hasStoredRates = false,
  previousRatesDate = null,
  loading = false,
  loadError = false,
}) {
  return (
    <div className="mt-2 flex min-w-0 flex-wrap items-center gap-2 pl-11">
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Live FX
      </span>
      <div
        className="flex min-w-0 max-w-full items-center gap-2 overflow-x-auto whitespace-nowrap py-1"
        aria-label="Latest stored exchange rates"
      >
        {rates.map((rate) => (
          <React.Fragment key={`${rate.baseCurrency}-${rate.targetCurrency}`}>
            <span
              className="inline-flex shrink-0 cursor-help items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm"
              title={[
                `${rate.baseCurrency} → ${rate.targetCurrency}`,
                `Rate: ${Number(rate.exchangeRate).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`,
                `Base Currency: ${rate.baseCurrency}`,
                `Target Currency: ${rate.targetCurrency}`,
                `Effective Date: ${formatEffectiveDate(rate.effectiveDate)}`,
                `Updated: ${formatUpdatedTime(rate.updatedAt)}`,
                `Source: ${rate.source}`,
              ].join("\n")}
            >
              {rate.baseCurrency} → ₹
              {Number(rate.exchangeRate).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6,
              })}
            </span>
          </React.Fragment>
        ))}
        {loading && rates.length === 0 && (
          <span className="text-xs text-slate-400">Loading stored exchange rates…</span>
        )}
        {loadError && (
          <span className="text-xs text-rose-600">
            Unable to load stored exchange rates.
          </span>
        )}
        {!loading && !loadError && !hasStoredRates && (
          <span className="text-xs text-slate-400">
            Exchange rates are not available yet.
          </span>
        )}
        {!loading && !loadError && hasStoredRates && rates.length === 0 && (
          <span className="text-xs text-amber-700">
            Stored rates are unavailable for currencies currently used in contracts.
          </span>
        )}
      </div>
      {usingPreviousRates && (
        <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-800">
          Using previous FX rates
          {previousRatesDate ? ` (${formatEffectiveDate(previousRatesDate)})` : ""}.
        </span>
      )}
    </div>
  );
}
