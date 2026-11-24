/**
 * routeLocationsData.js
 *
 * Master location dataset and helper functions for Freight Management routing.
 * Supports separate dependent searchable dropdowns:
 * - Origin: Place, City, Country
 * - Destination: Place, City, Country, ZIP Code
 *
 * All text is strictly UPPERCASE.
 */

import seaPorts from "sea-ports";

export const CANONICAL_TRADE_LOCATIONS = [
  // India
  { place: "MUNDRA PORT", city: "MUNDRA", country: "INDIA", zipCode: "370421" },
  { place: "NHAVA SHEVA PORT", city: "MUMBAI", country: "INDIA", zipCode: "400707" },
  { place: "MUMBAI PORT", city: "MUMBAI", country: "INDIA", zipCode: "400001" },
  { place: "KANDLA PORT", city: "KANDLA", country: "INDIA", zipCode: "370210" },
  { place: "PIPAVAV PORT", city: "PIPAVAV", country: "INDIA", zipCode: "365560" },
  { place: "HAZIRA PORT", city: "SURAT", country: "INDIA", zipCode: "394270" },
  { place: "DAHEJ PORT", city: "BHARUCH", country: "INDIA", zipCode: "392130" },
  { place: "CHENNAI PORT", city: "CHENNAI", country: "INDIA", zipCode: "600001" },
  { place: "COCHIN (KOCHI) PORT", city: "KOCHI", country: "INDIA", zipCode: "682003" },
  { place: "VISAKHAPATNAM PORT", city: "VISAKHAPATNAM", country: "INDIA", zipCode: "530035" },
  { place: "HALDIA PORT", city: "HALDIA", country: "INDIA", zipCode: "721607" },
  { place: "KOLKATA PORT", city: "KOLKATA", country: "INDIA", zipCode: "700043" },
  { place: "TUTICORIN PORT", city: "THOOTHUKUDI", country: "INDIA", zipCode: "628004" },
  { place: "MANGALORE PORT", city: "MANGALORE", country: "INDIA", zipCode: "575010" },
  { place: "KRISHNAPATNAM PORT", city: "NELLORE", country: "INDIA", zipCode: "524344" },

  // UAE
  { place: "JEBEL ALI PORT", city: "DUBAI", country: "UAE", zipCode: "1234" },
  { place: "DUBAI PORT (RASHID)", city: "DUBAI", country: "UAE", zipCode: "52005" },
  { place: "ABU DHABI PORT (ZAYED)", city: "ABU DHABI", country: "UAE", zipCode: "52001" },
  { place: "KHALIFA PORT", city: "ABU DHABI", country: "UAE", zipCode: "52001" },
  { place: "SHARJAH PORT (KHALED)", city: "SHARJAH", country: "UAE", zipCode: "52070" },
  { place: "FUJAIRAH PORT", city: "FUJAIRAH", country: "UAE", zipCode: "52000" },

  // Germany
  { place: "HAMBURG PORT", city: "HAMBURG", country: "GERMANY", zipCode: "2045" },
  { place: "BREMERHAVEN PORT", city: "BREMERHAVEN", country: "GERMANY", zipCode: "27568" },

  // Netherlands
  { place: "ROTTERDAM PORT", city: "ROTTERDAM", country: "NETHERLANDS", zipCode: "3011" },
  { place: "AMSTERDAM PORT", city: "AMSTERDAM", country: "NETHERLANDS", zipCode: "1013" },

  // China
  { place: "SHANGHAI PORT", city: "SHANGHAI", country: "CHINA", zipCode: "200000" },
  { place: "NINGBO-ZHOUSHAN PORT", city: "NINGBO", country: "CHINA", zipCode: "315000" },
  { place: "TIANJIN PORT", city: "TIANJIN", country: "CHINA", zipCode: "300450" },
  { place: "QINGDAO PORT", city: "QINGDAO", country: "CHINA", zipCode: "266011" },
  { place: "GUANGZHOU PORT (NANSHA)", city: "GUANGZHOU", country: "CHINA", zipCode: "511458" },
  { place: "SHENZHEN (YANTIAN) PORT", city: "SHENZHEN", country: "CHINA", zipCode: "518081" },
  { place: "XIAMEN PORT", city: "XIAMEN", country: "CHINA", zipCode: "361026" },

  // Singapore & SE Asia
  { place: "SINGAPORE PORT (PSA)", city: "SINGAPORE", country: "SINGAPORE", zipCode: "098585" },
  { place: "PORT KLANG", city: "KLANG", country: "MALAYSIA", zipCode: "42000" },
  { place: "TANJUNG PELEPAS PORT", city: "JOHOR", country: "MALAYSIA", zipCode: "81560" },
  { place: "BUSAN PORT", city: "BUSAN", country: "SOUTH KOREA", zipCode: "48998" },
  { place: "LAEM CHABANG PORT", city: "CHONBURI", country: "THAILAND", zipCode: "20230" },
  { place: "TAN CANG CAT LAI PORT", city: "HO CHI MINH CITY", country: "VIETNAM", zipCode: "70000" },

  // Europe & Americas
  { place: "ANTWERP PORT", city: "ANTWERP", country: "BELGIUM", zipCode: "2030" },
  { place: "VALENCIA PORT", city: "VALENCIA", country: "SPAIN", zipCode: "46024" },
  { place: "FELIXSTOWE PORT", city: "SUFFOLK", country: "UK", zipCode: "IP11 3SY" },
  { place: "GENOA PORT", city: "GENOA", country: "ITALY", zipCode: "16126" },
  { place: "LOS ANGELES PORT", city: "LOS ANGELES", country: "USA", zipCode: "90731" },
  { place: "LONG BEACH PORT", city: "LONG BEACH", country: "USA", zipCode: "90802" },
  { place: "NEW YORK / NEW JERSEY PORT", city: "NEW YORK", country: "USA", zipCode: "10004" },
  { place: "SAVANNAH PORT", city: "SAVANNAH", country: "USA", zipCode: "31401" },
  { place: "HOUSTON PORT", city: "HOUSTON", country: "USA", zipCode: "77029" },
  { place: "SANTOS PORT", city: "SANTOS", country: "BRAZIL", zipCode: "11013-001" },
];

function buildMasterLocations() {
  const list = [];
  const seenKey = new Set();

  const add = (loc) => {
    const place = (loc.place || "").trim().toUpperCase();
    const city = (loc.city || "").trim().toUpperCase();
    const country = (loc.country || "").trim().toUpperCase();
    const zipCode = (loc.zipCode || "").trim().toUpperCase();

    if (!place || !country) return;
    const key = `${place}|${city}|${country}`;
    if (!seenKey.has(key)) {
      seenKey.add(key);
      list.push({ place, city, country, zipCode });
    }
  };

  // 1. Add canonical trade routes
  CANONICAL_TRADE_LOCATIONS.forEach(add);

  // 2. Add global sea-ports
  const rawPortsObj = seaPorts?.JSON || seaPorts?.default?.JSON || seaPorts || {};
  const rawPorts = Object.values(rawPortsObj);

  for (const p of rawPorts) {
    if (!p || !p.name) continue;
    let country = (p.country || "").trim().toUpperCase();
    if (country === "UNITED ARAB EMIRATES") country = "UAE";
    if (country === "UNITED STATES") country = "USA";
    if (country === "UNITED KINGDOM") country = "UK";
    if (country === "RUSSIAN FEDERATION") country = "RUSSIA";
    if (country === "KOREA, REPUBLIC OF") country = "SOUTH KOREA";

    let rawName = (p.name || "").trim().toUpperCase();
    let place = rawName;
    if (!place.includes("PORT") && !place.includes("TERMINAL") && !place.includes("DOCK")) {
      place = `${place} PORT`;
    }

    let city = (p.city || p.province || p.name || "").trim().toUpperCase();
    let zipCode = (p.code || "").trim().toUpperCase();

    add({ place, city, country, zipCode });
  }

  // 3. Sort alphabetically: Country -> City -> Place
  list.sort((a, b) => {
    if (a.country !== b.country) return a.country.localeCompare(b.country);
    if (a.city !== b.city) return a.city.localeCompare(b.city);
    return a.place.localeCompare(b.place);
  });

  return list;
}

let cachedMaster = null;
const CUSTOM_STORAGE_KEY = "agricom_custom_route_locations";
let inMemoryCustom = [];

function getStoredCustomList() {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const raw = window.localStorage.getItem(CUSTOM_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // ignore
    }
  }
  return inMemoryCustom;
}

function saveStoredCustomList(list) {
  inMemoryCustom = list;
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      window.localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      // ignore
    }
  }
}

export function getMasterLocations() {
  if (!cachedMaster) {
    cachedMaster = buildMasterLocations();
    const customList = getStoredCustomList();
    if (Array.isArray(customList) && customList.length > 0) {
      customList.forEach(item => {
        if (item && (item.country || item.city || item.place)) {
          cachedMaster.push(item);
        }
      });
    }
  }
  return cachedMaster;
}

/**
 * Persists user-created custom location item (e.g., YASH as City, custom Port, etc.)
 */
export function addCustomLocationItem({ country = "", city = "", place = "", zipCode = "" } = {}) {
  const c = (country || "").trim().toUpperCase();
  const ci = (city || "").trim().toUpperCase();
  const p = (place || "").trim().toUpperCase();
  const z = (zipCode || "").trim().toUpperCase();

  if (!c && !ci && !p && !z) return;

  const currentList = getStoredCustomList();
  const exists = currentList.some(
    item =>
      (item.country || "") === c &&
      (item.city || "") === ci &&
      (item.place || "") === p &&
      (item.zipCode || "") === z
  );

  if (!exists) {
    const newItem = { country: c, city: ci, place: p, zipCode: z };
    const updated = [...currentList, newItem];
    saveStoredCustomList(updated);

    if (cachedMaster) {
      cachedMaster.push(newItem);
    }
  }
}

/**
 * Returns all unique countries in UPPERCASE sorted A-Z
 */
export function getCountryOptions(currentSelected = "") {
  const master = getMasterLocations();
  const set = new Set();
  master.forEach((m) => {
    if (m.country) set.add(m.country);
  });
  if (currentSelected && currentSelected.trim()) {
    set.add(currentSelected.trim().toUpperCase());
  }
  return Array.from(set)
    .sort((a, b) => a.localeCompare(b))
    .map((c) => ({ value: c, label: c }));
}

/**
 * Returns unique cities for a selected country (or all cities if no country)
 */
export function getCityOptions(country = "", currentSelected = "") {
  const master = getMasterLocations();
  const set = new Set();
  const normC = (country || "").trim().toUpperCase();

  master.forEach((m) => {
    if (!normC || m.country === normC) {
      if (m.city) set.add(m.city);
    }
  });

  if (currentSelected && currentSelected.trim()) {
    set.add(currentSelected.trim().toUpperCase());
  }

  return Array.from(set)
    .sort((a, b) => a.localeCompare(b))
    .map((c) => ({ value: c, label: c }));
}

/**
 * Returns unique places/ports for a selected country and city
 */
export function getPlaceOptions(country = "", city = "", currentSelected = "") {
  const master = getMasterLocations();
  const set = new Set();
  const normC = (country || "").trim().toUpperCase();
  const normCity = (city || "").trim().toUpperCase();

  master.forEach((m) => {
    if (normC && m.country !== normC) return;
    if (normCity && m.city !== normCity) return;
    if (m.place) set.add(m.place);
  });

  // If newly created custom city has no pre-existing places yet, fallback to show country ports
  if (set.size === 0 && normC) {
    master.forEach((m) => {
      if (m.country === normC && m.place) {
        set.add(m.place);
      }
    });
  }

  if (currentSelected && currentSelected.trim()) {
    set.add(currentSelected.trim().toUpperCase());
  }

  return Array.from(set)
    .sort((a, b) => a.localeCompare(b))
    .map((p) => ({ value: p, label: p }));
}

/**
 * Returns available ZIP codes for a selected place, city, and country
 */
export function getZipCodeOptions(country = "", city = "", place = "", currentSelected = "") {
  const master = getMasterLocations();
  const set = new Set();
  const normC = (country || "").trim().toUpperCase();
  const normCity = (city || "").trim().toUpperCase();
  const normP = (place || "").trim().toUpperCase();

  master.forEach((m) => {
    if (normC && m.country !== normC) return;
    if (normCity && m.city !== normCity) return;
    if (normP && m.place !== normP) return;
    if (m.zipCode) set.add(m.zipCode);
  });

  if (currentSelected && currentSelected.trim()) {
    set.add(currentSelected.trim().toUpperCase());
  }

  return Array.from(set)
    .sort((a, b) => a.localeCompare(b))
    .map((z) => ({ value: z, label: z }));
}

/**
 * Parses existing formatted string (e.g., "MUNDRA PORT, MUNDRA, INDIA" or legacy "Dubai")
 */
export function parseRouteLocation(str = "") {
  if (!str) return { place: "", city: "", country: "", zipCode: "" };
  let main = str.trim().toUpperCase();
  let zipCode = "";

  if (main.includes(" - ")) {
    const parts = main.split(" - ");
    main = parts[0].trim();
    zipCode = parts[1]?.trim() || "";
  }

  const chunks = main.split(",").map((s) => s.trim()).filter(Boolean);

  if (chunks.length >= 3) {
    return {
      place: chunks[0],
      city: chunks[1],
      country: chunks.slice(2).join(", "),
      zipCode,
    };
  } else if (chunks.length === 2) {
    return {
      place: chunks[0],
      city: "",
      country: chunks[1],
      zipCode,
    };
  } else if (chunks.length === 1) {
    return {
      place: chunks[0],
      city: "",
      country: "",
      zipCode,
    };
  }

  return { place: "", city: "", country: "", zipCode };
}

/**
 * Formats Origin components into uppercase string: PLACE, CITY, COUNTRY
 */
export function formatOriginLocation({ country = "", city = "", place = "" } = {}) {
  const parts = [place.trim(), city.trim(), country.trim()].filter(Boolean);
  return parts.join(", ").toUpperCase();
}

/**
 * Formats Destination components into uppercase string: PLACE, CITY, COUNTRY - ZIP CODE
 */
export function formatDestinationLocation({ country = "", city = "", place = "", zipCode = "" } = {}) {
  const parts = [place.trim(), city.trim(), country.trim()].filter(Boolean);
  const base = parts.join(", ").toUpperCase();
  const cleanZip = zipCode.trim().toUpperCase();
  if (base && cleanZip) {
    return `${base} - ${cleanZip}`;
  }
  return base || cleanZip;
}
