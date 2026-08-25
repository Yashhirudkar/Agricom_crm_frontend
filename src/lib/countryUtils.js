import countriesLib from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countriesLib.registerLocale(enLocale);

// Canonical display name overrides for ISO names that are overly formal or non-standard in trade
export const COUNTRY_NAME_OVERRIDES = {
  CN: "China",
  TW: "Taiwan",
  RU: "Russia",
  US: "United States",
  GB: "United Kingdom",
  KR: "South Korea",
  KP: "North Korea",
  VN: "Vietnam",
  SY: "Syria",
  IR: "Iran",
  LA: "Laos",
  BO: "Bolivia",
  VE: "Venezuela",
  TZ: "Tanzania",
  MD: "Moldova",
  CD: "Democratic Republic of the Congo",
  CG: "Republic of the Congo",
  CZ: "Czech Republic",
};

// Aliases mapping common search terms / variations to ISO2 code
export const COUNTRY_ALIASES = {
  "people's republic of china": "CN",
  "peoples republic of china": "CN",
  "prc": "CN",
  "china": "CN",
  "taiwan": "TW",
  "taiwan, province of china": "TW",
  "usa": "US",
  "united states of america": "US",
  "united states": "US",
  "uk": "GB",
  "united kingdom": "GB",
  "great britain": "GB",
  "uae": "AE",
  "united arab emirates": "AE",
  "russia": "RU",
  "russian federation": "RU",
  "vietnam": "VN",
  "viet nam": "VN",
  "south korea": "KR",
  "korea, republic of": "KR",
  "north korea": "KP",
  "korea, democratic people's republic of": "KP",
  "czech republic": "CZ",
  "czechia": "CZ",
};

/**
 * Get all country options formatted for React Select
 * @returns {Array<{ label: string, value: string, alpha2: string, alpha3: string }>}
 */
export function getAllCountryOptions() {
  const rawNames = countriesLib.getNames("en");
  const options = Object.entries(rawNames).map(([alpha2, defaultName]) => {
    const name = COUNTRY_NAME_OVERRIDES[alpha2] || defaultName;
    return {
      label: name,
      value: name,
      alpha2: alpha2,
      alpha3: countriesLib.alpha2ToAlpha3(alpha2) || "",
    };
  });
  return options.sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Get list of standard country names (e.g. for filter dropdowns)
 * @returns {string[]}
 */
export function getCountryNameList() {
  return getAllCountryOptions().map((c) => c.value);
}

/**
 * Resolve ISO alpha-2 code from country name or alias (case-insensitive)
 * @param {string} val
 * @returns {string}
 */
export function getAlpha2Code(val) {
  if (!val || typeof val !== "string") return "";
  const clean = val.trim().toLowerCase();
  if (COUNTRY_ALIASES[clean]) return COUNTRY_ALIASES[clean];
  const direct = countriesLib.getAlpha2Code(val, "en");
  if (direct) return direct;
  return "";
}

/**
 * Resolve ISO alpha-3 code from country name or alias (case-insensitive)
 * @param {string} val
 * @returns {string}
 */
export function getAlpha3Code(val) {
  const alpha2 = getAlpha2Code(val);
  if (alpha2) {
    return countriesLib.alpha2ToAlpha3(alpha2) || "";
  }
  return "";
}

/**
 * Normalize any country name variant (e.g., "People's Republic of China", "CHINA") to canonical name (e.g., "China")
 * @param {string} val
 * @returns {string}
 */
export function normalizeCountryName(val) {
  if (!val || typeof val !== "string") return "";
  const alpha2 = getAlpha2Code(val);
  if (alpha2) {
    return COUNTRY_NAME_OVERRIDES[alpha2] || countriesLib.getName(alpha2, "en") || val;
  }
  return val;
}

/**
 * Find matched country option for a given string value
 * @param {string} val
 * @param {Array} options
 * @returns {Object|null}
 */
export function findCountryOption(val, options = null) {
  if (!val) return null;
  const rawString = typeof val === "object" && val !== null ? val.name || "" : String(val);
  if (!rawString || !rawString.trim()) return null;
  const opts = options || getAllCountryOptions();
  const vLower = rawString.trim().toLowerCase();

  // 1. Direct label match
  let matched = opts.find((opt) => opt.label.toLowerCase() === vLower || opt.value.toLowerCase() === vLower);
  if (matched) return matched;

  // 2. Alias or ISO matching
  const alpha2 = getAlpha2Code(val);
  if (alpha2) {
    matched = opts.find((opt) => opt.alpha2.toUpperCase() === alpha2.toUpperCase());
    if (matched) return matched;
  }

  // 3. Fallback custom option
  return { label: val, value: val, isCustom: true };
}

export default {
  getAllCountryOptions,
  getCountryNameList,
  getAlpha2Code,
  getAlpha3Code,
  normalizeCountryName,
  findCountryOption,
};
