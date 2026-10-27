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

