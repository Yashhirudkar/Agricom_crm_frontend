/**
 * Derives the financial year string (e.g. "2026-2027") for a given date.
 * Financial year starts on 1 April.
 * If month >= 4 (April or later): FY = "year-(year+1)"
 * If month < 4 (before April):   FY = "(year-1)-year"
 */
export function getFinancialYearForDate(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth() + 1; // 1-indexed
  if (month >= 4) {
    return `${year}-${year + 1}`;
  }
  return `${year - 1}-${year}`;
}

/**
 * Returns the array of financial year strings to display in the dropdown.
 * Always includes [Previous FY, Current FY (default), Next FY].
 * If existingValue is provided and is not already in the list
 * (i.e. it is an older historical value), it is prepended.
 *
 * @param {string|null} existingValue - e.g. "2012-2013" for an existing edited contract
 * @returns {string[]} Array of FY strings, oldest historical first if applicable
 */
export function getDynamicFinancialYears(existingValue = null) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  // Current FY start year
  const currentStartYear = month >= 4 ? year : year - 1;

  const prevFY = `${currentStartYear - 1}-${currentStartYear}`;
  const currentFY = `${currentStartYear}-${currentStartYear + 1}`;
  const nextFY = `${currentStartYear + 1}-${currentStartYear + 2}`;

  const standard = [prevFY, currentFY, nextFY];

  // If editing an old contract with a year not in the standard list, prepend it
  if (existingValue && !standard.includes(existingValue)) {
    return [existingValue, ...standard];
  }

  return standard;
}

/**
 * Returns the current financial year string (e.g. "2026-2027").
 */
export function getCurrentFinancialYear() {
  return getFinancialYearForDate(new Date());
}
