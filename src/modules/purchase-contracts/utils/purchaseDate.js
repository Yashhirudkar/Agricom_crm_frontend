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
