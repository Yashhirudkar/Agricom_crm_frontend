/**
 * locationProvider.js
 *
 * Centralised location-data service for Sales Contract transport routing.
 * CommercialSection imports ONLY this module — never raw data packages directly.
 *
 * Internally routes to:
 *   sea  → PORTS_BY_COUNTRY (existing portsData.js constant)
 *   air  → AIRPORTS_BY_COUNTRY (airportsData.js constant — same pattern as ports)
 *   road → country-state-city City.getCitiesOfCountry (same as PartnerDrawer)
 *   rail → country-state-city City.getCitiesOfCountry (fallback — replaceable later
 *          by a dedicated railway package without touching CommercialSection)
 *
 * All returned options are in react-select shape: { value: string, label: string }
 */

import { PORTS_BY_COUNTRY } from '@/constants/portsData';
import { City } from 'country-state-city';

// ---------------------------------------------------------------------------
// Transport Mode config — labels, placeholders, validation messages per mode
// ---------------------------------------------------------------------------

export const TRANSPORT_MODES = [
  { value: 'sea', label: 'Sea Freight' },
  { value: 'air', label: 'Air Freight' },
  { value: 'road', label: 'Road Transport' },
  { value: 'rail', label: 'Rail Freight / Wagon' },
];

export const TRANSPORT_MODE_CONFIG = {
  sea: {
    originLabel: 'Port of Loading',
    destLabel: 'Port of Discharge',
    originPlaceholder: 'Select port of loading',
    destPlaceholder: 'Select port of discharge',
    originError: 'Port of Loading is required',
    destError: 'Port of Discharge is required',
    noCountryHint: 'Select origin country first',
    noDestCountryHint: 'Select destination country first',
    isSearchable: true,
  },
  air: {
    originLabel: 'Origin Airport',
    destLabel: 'Destination Airport',
    originPlaceholder: 'Search origin airport…',
    destPlaceholder: 'Search destination airport…',
    originError: 'Origin Airport is required',
    destError: 'Destination Airport is required',
    noCountryHint: 'Select origin country first',
    noDestCountryHint: 'Select destination country first',
    isSearchable: true,
  },
  road: {
    originLabel: 'Pickup City',
    destLabel: 'Delivery City',
    originPlaceholder: 'Search pickup city…',
    destPlaceholder: 'Search delivery city…',
    originError: 'Pickup City is required',
    destError: 'Delivery City is required',
    noCountryHint: 'Select origin country first',
    noDestCountryHint: 'Select destination country first',
    isSearchable: true,
  },
  rail: {
    originLabel: 'Origin Railway Station',
    destLabel: 'Destination Railway Station',
    originPlaceholder: 'Search origin city / station…',
    destPlaceholder: 'Search destination city / station…',
    originError: 'Origin Railway Station is required',
    destError: 'Destination Railway Station is required',
    noCountryHint: 'Select origin country first',
    noDestCountryHint: 'Select destination country first',
    isSearchable: true,
  },
};

// ---------------------------------------------------------------------------
// Main API
// ---------------------------------------------------------------------------

function fetchCustomLocations(countryCode, transportMode) {
  try {
    const local = localStorage.getItem("customLocations_" + countryCode + "_" + transportMode);
    if (local) {
      const parsed = JSON.parse(local);
      return parsed.map(c => ({ value: c.cityName, label: c.cityName }));
    }
  } catch (e) {}
  return [];
}

export function saveCustomLocation(countryCode, countryName, transportMode, cityName) {
  try {
    const key = "customLocations_" + countryCode + "_" + transportMode;
    const local = localStorage.getItem(key);
    let parsed = [];
    if (local) parsed = JSON.parse(local);
    if (!parsed.find(p => p.cityName === cityName)) {
      parsed.push({ cityName });
      localStorage.setItem(key, JSON.stringify(parsed));
    }
  } catch (e) {}
}

export async function getLocations({ countryCode, transportMode, search = '' }) {
  if (!countryCode) return [];
  const custom = fetchCustomLocations(countryCode, transportMode);

  let local = [];
  switch (transportMode) {
    case 'sea':
      local = getSeaPorts(countryCode, search);
      break;
    case 'air':
      local = await getAirports(countryCode, search);
      break;
    case 'road':
    case 'rail':
      local = getCities(countryCode, search);
      break;
    default:
      local = getSeaPorts(countryCode, search);
  }

  const q = search.toLowerCase();
  const filteredCustom = custom.filter(c => c.label.toLowerCase().includes(q));

  const all = [...filteredCustom, ...local];
  const unique = [];
  const map = new Map();
  for (const item of all) {
      if (!map.has(item.value)) {
          map.set(item.value, true);
          unique.push(item);
      }
  }
  return unique.slice(0, 50);
}

// ---------------------------------------------------------------------------
// Internal providers — none of these are imported directly by UI components
// ---------------------------------------------------------------------------

function getSeaPorts(countryCode, search = "") {
  const ports = PORTS_BY_COUNTRY[countryCode] || [];
  const q = search.toLowerCase();
  return ports
    .filter(p => p.name.toLowerCase().includes(q))
    .slice(0, 20)
    .map((p) => ({ value: p.name, label: p.name }));
}

async function getAirports(countryCode, search = "") {
  // Custom airports stored locally (same pattern as ports)
  return fetchCustomLocations(countryCode, 'air').filter(a =>
    a.label.toLowerCase().includes(search.toLowerCase())
  );
}

function getCities(countryCode, search = "") {
  const cities = City.getCitiesOfCountry(countryCode) || [];
  const q = search.toLowerCase();
  
  return cities
    .filter((city) => city.name.toLowerCase().includes(q))
    .slice(0, 20)
    .map((city) => ({ value: city.name, label: city.name }));
}
