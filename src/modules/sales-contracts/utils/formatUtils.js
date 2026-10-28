/**
 * Utility functions for clean number formatting in Sales Contracts.
 */

/**
 * Strips redundant trailing zero decimals from numbers or strings.
 * e.g. "88.00" -> 88, "22.00" -> 22, "1936.00" -> 1936, "22.50" -> 22.5, null -> ""
 */
export const cleanNumberValue = (val) => {
  if (val === null || val === undefined || val === "") return "";
  const num = Number(val);
  return isNaN(num) ? val : num;
};

/**
 * Normalizes input value for number inputs:
 * If a string ends with redundant ".00" (e.g. from backend decimal fields), it strips them.
 * Does not interfere with active typing of decimals like "22." or "22.0".
 */
export const formatInputVal = (val) => {
  if (val === null || val === undefined || val === "") return "";
  if (typeof val === "string" && val.endsWith(".00")) {
    const num = Number(val);
    return isNaN(num) ? val : num;
  }
  return val;
};

/**
 * Formats a number for display with comma separation without forcing trailing .00 decimals.
 * If whole integer: 1936 -> "1,936" (no .00)
 * If decimal: 1936.5 -> "1,936.5", 1936.75 -> "1,936.75"
 */
export const formatNumberDisplay = (val, maxDecimals = 2) => {
  if (val === null || val === undefined || val === "") return "0";
  const num = Number(val);
  if (isNaN(num)) return String(val);
  return num.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals,
  });
};

/**
 * Standard Incoterms short form mapping.
 */
export const INCOTERM_SHORT_FORMS = {
  "DELIVERY AT PLACE": "DAP",
  "DELIVERED AT PLACE": "DAP",
  "COST INSURANCE AND FREIGHT": "CIF",
  "COST INSURANCE & FREIGHT": "CIF",
  "COST AND FREIGHT": "CFR",
  "COST & FREIGHT": "CFR",
  "FREE ONBOARD": "FOB",
  "FREE ON BOARD": "FOB",
  "FREE CARRIER ALONGSIDE": "FAS",
  "FREE ALONGSIDE SHIP": "FAS",
  "FREE CARRIER": "FCA",
  "EX WORKS": "EXW",
  "CARRIAGE PAID TO": "CPT",
  "CARRIAGE AND INSURANCE PAID TO": "CIP",
  "DELIVERED AT TERMINAL": "DAT",
  "DELIVERED AT PLACE UNLOADED": "DPU",
  "DELIVERED DUTY PAID": "DDP",
};

/**
 * Returns the short form / acronym for a shipment type or incoterm.
 * e.g. "DELIVERY AT PLACE" -> "DAP", "COST INSURANCE AND FREIGHT" -> "CIF"
 */
export const getShipmentTypeShortForm = (item) => {
  if (!item) return "";
  if (typeof item === "string") {
    const trimmed = item.trim();
    const upper = trimmed.toUpperCase();
    if (INCOTERM_SHORT_FORMS[upper]) return INCOTERM_SHORT_FORMS[upper];
    if (trimmed.length <= 5 && !trimmed.includes(" ")) return upper;
    return trimmed;
  }
  const code = typeof item.code === "string" ? item.code.trim().toUpperCase() : "";
  const name = typeof item.name === "string" ? item.name.trim() : "";
  const nameUpper = name.toUpperCase();

  if (code && code.length <= 6) {
    return code;
  }
  if (nameUpper && INCOTERM_SHORT_FORMS[nameUpper]) {
    return INCOTERM_SHORT_FORMS[nameUpper];
  }
  return code || name || "";
};


