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
    return numericValue.toFixed(3);
  }

  const [integerPart = "", fractionalPart = ""] = input.split(".");
  return `${integerPart || "0"}.${fractionalPart.padEnd(3, "0")}`;
}
