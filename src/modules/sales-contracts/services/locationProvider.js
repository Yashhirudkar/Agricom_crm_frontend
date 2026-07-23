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
import axiosClient from "@/lib/axios";

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
    isSearchable: false,
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

/**
 * getLocations({ countryCode, transportMode })
 *
 * @param {string} countryCode    ISO 3166-1 alpha-2 code (e.g. "IN", "AE")
 * @param {string} transportMode  One of: "sea" | "air" | "road" | "rail"
 * @returns {Promise<Array<{ value: string, label: string }>>}
 */
export async function getLocations({ countryCode, transportMode, search = '' }) {
  if (!countryCode) return [];

  switch (transportMode) {
    case 'sea':
      return getSeaPorts(countryCode);

    case 'air':
      return await getAirports(countryCode, search);

    case 'road':
    case 'rail':
      return getCities(countryCode, search);

    default:
      return getSeaPorts(countryCode, search);
  }
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
  try {
    const { data } = await axiosClient.get("/locations/airports", {
      params: { countryCode, search, limit: 10 }
    });
    return (data || [])
      .map((a) => ({
        value: `${a.name} (${a.code})`,
        label: `${a.name} (${a.code})`,
      }));
  } catch (err) {
    console.warn("Failed to load airports:", err);
    return [];
  }
}

function getCities(countryCode, search = "") {
  // Exact same provider as PartnerDrawer — country-state-city package
  const cities = City.getCitiesOfCountry(countryCode) || [];
  const q = search.toLowerCase();
  
  // We only return the top 20 matches for lightning-fast dropdown rendering
  return cities
    .filter((city) => city.name.toLowerCase().includes(q))
    .slice(0, 20)
    .map((city) => ({ value: city.name, label: city.name }));
}
