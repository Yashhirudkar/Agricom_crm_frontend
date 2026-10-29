const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatPurchaseDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value || "");
  if (!match) return "";

  const [, year, month, day] = match;
  const monthName = MONTHS[Number(month) - 1];
  return monthName ? `${day}-${monthName}-${year}` : "";
}

export function parsePurchaseDate(value) {
  const match = /^(\d{2})-([A-Za-z]{3})-(\d{4})$/.exec(value || "");
  if (!match) return null;

  const [, day, monthName, year] = match;
  const month = MONTHS.findIndex((name) => name.toLowerCase() === monthName.toLowerCase());
  if (month < 0) return null;

  const date = new Date(Date.UTC(Number(year), month, Number(day)));
  if (
    date.getUTCFullYear() !== Number(year)
    || date.getUTCMonth() !== month
    || date.getUTCDate() !== Number(day)
  ) {
    return null;
  }

  return `${year}-${String(month + 1).padStart(2, "0")}-${day}`;
}

/**
 * Auto-calculates Payment Due Date (Tentative) = Contract Date + 7 Days.
 * Handles month changes, year changes, and leap years correctly using UTC to avoid timezone off-by-one issues.
 * Returns date in YYYY-MM-DD format (standard for HTML date inputs and database storage).
 *
 * @param {string|Date} contractDate - The contract date in YYYY-MM-DD, DD-MMM-YYYY, or Date/ISO format
 * @param {number} daysToAdd - Default is 7 days
 * @returns {string} Date string in YYYY-MM-DD format, or "" if input is invalid/empty
 */
export function calculatePaymentDueDate(contractDate, daysToAdd = 7) {
  if (!contractDate) return "";

  let year, month, day;

  if (typeof contractDate === "string") {
    const trimmed = contractDate.trim();
    const isoMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed);
    if (isoMatch) {
      year = Number(isoMatch[1]);
      month = Number(isoMatch[2]) - 1;
      day = Number(isoMatch[3]);
    } else {
      const ddmmyyyyMatch = /^(\d{2})-([A-Za-z]{3})-(\d{4})$/.exec(trimmed);
      if (ddmmyyyyMatch) {
        day = Number(ddmmyyyyMatch[1]);
        const mStr = ddmmyyyyMatch[2];
        year = Number(ddmmyyyyMatch[3]);
        month = MONTHS.findIndex((name) => name.toLowerCase() === mStr.toLowerCase());
        if (month < 0) return "";
      } else {
        const parsed = new Date(trimmed);
        if (isNaN(parsed.getTime())) return "";
        year = parsed.getUTCFullYear();
        month = parsed.getUTCMonth();
        day = parsed.getUTCDate();
      }
    }
  } else if (contractDate instanceof Date) {
    if (isNaN(contractDate.getTime())) return "";
    year = contractDate.getFullYear();
    month = contractDate.getMonth();
    day = contractDate.getDate();
  } else {
    return "";
  }

  const utcDate = new Date(Date.UTC(year, month, day));
  if (
    utcDate.getUTCFullYear() !== year ||
    utcDate.getUTCMonth() !== month ||
    utcDate.getUTCDate() !== day
  ) {
    return "";
  }

  utcDate.setUTCDate(utcDate.getUTCDate() + daysToAdd);

  const resYear = utcDate.getUTCFullYear();
  const resMonth = String(utcDate.getUTCMonth() + 1).padStart(2, "0");
  const resDay = String(utcDate.getUTCDate()).padStart(2, "0");

  return `${resYear}-${resMonth}-${resDay}`;
}
