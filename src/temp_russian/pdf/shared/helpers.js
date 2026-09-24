// ─── Shared PDF helpers ───────────────────────────────────────────────────────
// Used by all contract templates (Standard, Russian, future templates).
// Extract once here so we never duplicate logic across templates.

/**
 * Format a date string or Date to "12 JAN 2026" format.
 */
export function formatDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString)
    .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase();
}

/**
 * Build a one-line address string from a Partner object.
 */
export function partnerAddress(p) {
  if (!p) return "—";
  const parts = [p.entityName, p.address, p.city, p.country?.name || p.country].filter(Boolean);
  return parts.join(", ").toUpperCase() || "—";
}

/**
 * Build the incoterm label for display on the contract.
 * e.g., "CIF NOVOROSSIYSK" or "DAP MOSCOW"
 */
export function incotermLabel(contract) {
  const mode = contract.destinationTransportMode || "sea";
  const loc = contract.destinationLocationName || contract.portOfDischarge || "";
  if (mode === "sea" || mode === "air") return loc ? `CIF ${loc}` : "CIF";
  return loc ? `DAP ${loc}` : "DAP";
}

/**
 * Compute the shipment period text from an array of shipment objects.
 * e.g., "OCT – NOV 2026 SHIPMENT"
 */
export function getShipmentPeriodText(shipments) {
  if (!shipments || shipments.length === 0) return "—";
  const dates = shipments
    .map((s) => (s.shipmentDate ? new Date(s.shipmentDate) : null))
    .filter((d) => d && !isNaN(d.getTime()));
  if (dates.length === 0) return "—";
  dates.sort((a, b) => a.getTime() - b.getTime());
  const startDate = dates[0];
  const lastDate = dates[dates.length - 1];
  const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  const startOfFirstMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const startOfLastMonth = new Date(lastDate.getFullYear(), lastDate.getMonth(), 1);
  const startOfFirstMonthPlusOne = new Date(startOfFirstMonth);
  startOfFirstMonthPlusOne.setMonth(startOfFirstMonthPlusOne.getMonth() + 1);

  let endMonthDate;
  if (startOfLastMonth.getTime() > startOfFirstMonthPlusOne.getTime()) {
    endMonthDate = startOfLastMonth;
  } else {
    endMonthDate = startOfFirstMonthPlusOne;
  }

  const firstMonth = MONTHS[startDate.getMonth()];
  const firstYear = startDate.getFullYear();
  const lastMonth = MONTHS[endMonthDate.getMonth()];
  const lastYear = endMonthDate.getFullYear();

  if (firstYear === lastYear) {
    return `${firstMonth} – ${lastMonth} ${firstYear} SHIPMENT`;
  } else {
    return `${firstMonth} ${firstYear} – ${lastMonth} ${lastYear} SHIPMENT`;
  }
}

/**
 * Detect if a contract should use the Russian template.
 * Handles common variations of the country name.
 */
export function isRussianCountry(countryName) {
  if (!countryName) return false;
  const n = countryName.toLowerCase().trim();
  return n === "russia" || n === "russian federation" || n === "россия";
}

/**
 * Return the display label for a contractFormat code.
 */
export const CONTRACT_FORMAT_LABELS = {
  STANDARD: "India Standard",
  RUSSIAN: "Russian Export",
  GAFTA: "GAFTA",
  CUSTOM: "Custom",
};

export const CONTRACT_FORMAT_OPTIONS = [
  { value: "STANDARD", label: "India Standard" },
  { value: "RUSSIAN", label: "Russian Export" },
  // Future: { value: 'GAFTA', label: 'GAFTA' },
  // Future: { value: 'DOMESTIC', label: 'Domestic Sale' },
];
