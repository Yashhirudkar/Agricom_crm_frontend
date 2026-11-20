const MT_WEIGHT_INPUT_PATTERN = /^\d{0,3}(?:\.\d{0,3})?$/;

export function isValidMtWeightInput(value) {
  return MT_WEIGHT_INPUT_PATTERN.test(value);
}

export function formatMtWeightInput(value) {
  const input = value === null || value === undefined ? "" : String(value).trim();
  if (input === "") return "";

  if (!isValidMtWeightInput(input)) {
    const numericValue = Number(input);
    if (!Number.isFinite(numericValue) || numericValue < 0 || numericValue > 999.999) {
      return "";
    }
    return numericValue.toFixed(3).padStart(7, "0");
  }

  const [integerPart = "", fractionalPart = ""] = input.split(".");
  return `${integerPart.padStart(3, "0")}.${fractionalPart.padEnd(3, "0")}`;
}

export function formatMtWeightDigits(value) {
  const digits = String(value ?? "").replace(/\D/g, "").slice(-6);
  if (digits === "") return "";

  const paddedDigits = digits.padStart(6, "0");
  return `${paddedDigits.slice(0, 3)}.${paddedDigits.slice(3)}`;
}
