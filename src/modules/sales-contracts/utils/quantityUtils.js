/**
 * Utility functions for generating dynamic Quantity descriptions for Sales Contracts
 * following international trade documentation standards.
 */

/**
 * Normalizes transport mode to standard enum keys: 'ROAD', 'SEA', 'BULK', 'RAIL', 'AIR'
 */
export function normalizeTransportMode(mode) {
  if (!mode) return "SEA";
  const m = String(mode).trim().toLowerCase();
  if (m.includes("bulk")) return "BULK";
  if (m.includes("road") || m.includes("truck")) return "ROAD";
  if (
    m.includes("sea") ||
    m.includes("ocean") ||
    m.includes("fcl") ||
    m.includes("container") ||
    m.includes("ship")
  ) {
    return "SEA";
  }
  if (m.includes("rail") || m.includes("wagon")) return "RAIL";
  if (m.includes("air") || m.includes("flight")) return "AIR";
  return "OTHER";
}

export function getContractTransportMode(contract = {}) {
  return normalizeTransportMode(
    contract.originTransportMode ||
    contract.destinationTransportMode ||
    contract.transportMode ||
    "SEA"
  );
}

/**
 * Normalizes container type (e.g. '40 FT', '20 FT', '40 HC')
 */
export function formatContainerType(containerType) {
  if (!containerType) return "40 FEET";
  const raw = String(containerType).trim().toUpperCase();
  if (raw.includes("20")) return "20 FEET";
  if (raw.includes("40") && (raw.includes("HC") || raw.includes("HIGH"))) return "40 HC FEET";
  if (raw.includes("40")) return "40 FEET";
  return raw;
}

/**
 * Formats a metric tonne quantity according to standard conventions:
 * Whole numbers without decimals (e.g. 22, 44, 104, 5000),
 * Decimal numbers with up to 2 decimal places (e.g. 21.50, 64.50).
 */
export function formatQuantityNumber(val) {
  if (val == null || val === "") return "0";
  const num = typeof val === "number" ? val : parseFloat(String(val));
  if (isNaN(num)) return "0";
  if (num % 1 === 0) {
    return String(Math.round(num));
  }
  return num.toFixed(2);
}

/**
 * Formats tolerance percentage (default: 5%)
 */
export function formatTolerancePercentage(tol) {
  if (tol == null || tol === "") return "5%";
  const num = typeof tol === "number" ? tol : parseFloat(String(tol));
  if (isNaN(num)) return "5%";
  return num % 1 === 0 ? `${Math.round(num)}%` : `${num.toFixed(2)}%`;
}

/**
 * Returns the human-readable unit label for a transport mode
 */
export function getTransportUnitName(transportMode, isPlural = false) {
  const mode = normalizeTransportMode(transportMode);
  switch (mode) {
    case "ROAD":
      return isPlural ? "Trucks" : "Truck";
    case "SEA":
      return isPlural ? "Containers" : "Container";
    case "BULK":
      return isPlural ? "Holds" : "Hold";
    case "RAIL":
      return isPlural ? "Wagons" : "Wagon";
    case "AIR":
      return isPlural ? "Shipments" : "Shipment";
    default:
      return isPlural ? "Units" : "Unit";
  }
}

/**
 * Generates human-readable, international trade standard Quantity text.
 *
 * Examples:
 * - Road:
 *   "2 TRUCKS OF 22 MT EACH,\nTOTAL ABOUT 44 MT +/- 5%"
 *   "3 TRUCKS OF APPROX. 21.50 MT EACH,\nTOTAL ABOUT 64.50 MT +/- 5%"
 * - Sea:
 *   "4 FCL (40 FT) OF APPROX. 26 MT EACH,\nTOTAL ABOUT 104 MT +/- 5%"
 *   "2 FCL (20 FT) OF APPROX. 24 MT EACH,\nTOTAL ABOUT 48 MT +/- 5%"
 * - Bulk:
 *   "TOTAL ABOUT 5000 MT +/- 5%\nIN BULK"
 */
export function generateQuantityDescription({
  transportMode,
  unitCount,
  containerType,
  qtyPerUnit,
  totalQuantity,
  tolerancePercentage,
} = {}) {
  const totalQty = typeof totalQuantity === "number"
    ? totalQuantity
    : parseFloat(String(totalQuantity ?? 0)) || 0;

  const unitQty = typeof qtyPerUnit === "number"
    ? qtyPerUnit
    : parseFloat(String(qtyPerUnit ?? 0)) || 0;

  let uCount = unitCount != null && unitCount !== ""
    ? (typeof unitCount === "number" ? unitCount : parseFloat(String(unitCount)) || 0)
    : 0;

  // Auto-calculate unit count if not provided but total and per-unit exist
  if (!uCount && totalQty > 0 && unitQty > 0) {
    uCount = Math.round(totalQty / unitQty);
  }

  const mode = normalizeTransportMode(transportMode);
  const totalStr = formatQuantityNumber(totalQty);
  const tolStr = formatTolerancePercentage(tolerancePercentage);

  // 1. Bulk Vessel
  if (mode === "BULK") {
    return `TOTAL ABOUT ${totalStr} MT +/- ${tolStr} IN BULK`;
  }

  const unitQtyStr = formatQuantityNumber(unitQty);

  // 2. Road Transport
  if (mode === "ROAD") {
    if (uCount > 0 && unitQty > 0) {
      const truckLabel = uCount === 1 ? "TRUCK" : "TRUCKS";
      return `${uCount} ${truckLabel} OF ${unitQtyStr} MT EACH, TOTAL ABOUT ${totalStr} MT +/- ${tolStr}`;
    }
    return `TOTAL ABOUT ${totalStr} MT +/- ${tolStr}`;
  }

  // 3. Sea Shipment (FCL)
  if (mode === "SEA") {
    const contType = formatContainerType(containerType);
    if (uCount > 0 && unitQty > 0) {
      return `${uCount} FCL OF ${contType}, ${unitQtyStr} MT EACH, TOTAL ABOUT ${totalStr} MT +/- ${tolStr}`;
    }
    return `TOTAL ABOUT ${totalStr} MT +/- ${tolStr}`;
  }

  // 4. Rail Freight / Wagon
  if (mode === "RAIL") {
    if (uCount > 0 && unitQty > 0) {
      const wagonLabel = uCount === 1 ? "WAGON" : "WAGONS";
      return `${uCount} ${wagonLabel} OF ${unitQtyStr} MT EACH, TOTAL ABOUT ${totalStr} MT +/- ${tolStr}`;
    }
    return `TOTAL ABOUT ${totalStr} MT +/- ${tolStr}`;
  }

  // 5. Air Freight
  if (mode === "AIR") {
    if (uCount > 0 && unitQty > 0) {
      const airLabel = uCount === 1 ? "AIR SHIPMENT" : "AIR SHIPMENTS";
      return `${uCount} ${airLabel} OF ${unitQtyStr} MT EACH, TOTAL ABOUT ${totalStr} MT +/- ${tolStr}`;
    }
    return `TOTAL ABOUT ${totalStr} MT +/- ${tolStr}`;
  }

  // Fallback
  if (uCount > 0 && unitQty > 0) {
    const unitLabel = uCount === 1 ? "UNIT" : "UNITS";
    return `${uCount} ${unitLabel} OF ${unitQtyStr} MT EACH, TOTAL ABOUT ${totalStr} MT +/- ${tolStr}`;
  }

  return `TOTAL ABOUT ${totalStr} MT +/- ${tolStr}`;
}

/**
 * Automatically calculates the Quantity description for a contract item
 * from the contract's Shipment Schedule and Product Item data,
 * strictly without requiring manual input or extra fields.
 *
 * @param {Object} contract - The full Sales Contract object (including shipments, transport mode, etc.)
 * @param {Object} item - The specific product item in contract.items
 * @returns {string} The formatted quantity description
 */
export function getContractItemQuantityDescription(contract = {}, item = {}) {
  const mode = getContractTransportMode({
    ...contract,
    transportMode: contract.originTransportMode ||
      contract.destinationTransportMode ||
      contract.transportMode ||
      item.transportMode,
  });

  const totalQuantity =
    parseFloat(item.quantity) ||
    (contract.shipments || []).reduce((sum, s) => sum + (parseFloat(s.quantity) || 0), 0) ||
    parseFloat(contract.totalQuantity) ||
    0;

  const shipments = contract.shipments || [];
  const shipmentCount = shipments.length;
  const totalContainers = shipments.reduce(
    (sum, s) => sum + (parseInt(s.noOfContainers, 10) || 0),
    0
  );
  const firstShipmentQty = parseFloat(shipments[0]?.quantity) || 0;
  const itemQtyPerCount = parseFloat(item.qtyPerCount) || 0;

  let unitCount = 0;
  let qtyPerUnit = 0;

  if (mode === "ROAD") {
    // ROAD TRANSPORT:
    // Number of Shipments = Number of Trucks
    // Qty (MT) = Quantity per Truck
    if (shipmentCount > 0) {
      unitCount = totalContainers > shipmentCount ? totalContainers : shipmentCount;
      qtyPerUnit = firstShipmentQty > 0 ? firstShipmentQty : (itemQtyPerCount > 0 ? itemQtyPerCount : (totalQuantity / unitCount));
    } else if (totalQuantity > 0 && itemQtyPerCount > 0) {
      unitCount = Math.round(totalQuantity / itemQtyPerCount);
      qtyPerUnit = itemQtyPerCount;
    } else {
      unitCount = parseInt(item.unitCount, 10) || 1;
      qtyPerUnit = itemQtyPerCount > 0 ? itemQtyPerCount : totalQuantity;
    }
  } else if (mode === "SEA") {
    // SEA (FCL):
    // Container count from Shipment Schedule, Container Type, Qty Per Shipment
    if (shipmentCount > 0) {
      unitCount = totalContainers > 0 ? totalContainers : shipmentCount;
      qtyPerUnit = firstShipmentQty > 0 ? firstShipmentQty : (itemQtyPerCount > 0 ? itemQtyPerCount : (totalQuantity / unitCount));
    } else if (totalQuantity > 0 && itemQtyPerCount > 0) {
      unitCount = Math.round(totalQuantity / itemQtyPerCount);
      qtyPerUnit = itemQtyPerCount;
    } else {
      unitCount = parseInt(item.unitCount, 10) || 1;
      qtyPerUnit = itemQtyPerCount > 0 ? itemQtyPerCount : totalQuantity;
    }
  } else if (mode === "BULK") {
    unitCount = shipmentCount > 0 ? shipmentCount : 1;
    qtyPerUnit = totalQuantity;
  } else {
    // Rail / Air / Other
    if (shipmentCount > 0) {
      unitCount = totalContainers > 0 ? totalContainers : shipmentCount;
      qtyPerUnit = firstShipmentQty > 0 ? firstShipmentQty : (itemQtyPerCount > 0 ? itemQtyPerCount : (totalQuantity / unitCount));
    } else if (totalQuantity > 0 && itemQtyPerCount > 0) {
      unitCount = Math.round(totalQuantity / itemQtyPerCount);
      qtyPerUnit = itemQtyPerCount;
    } else {
      unitCount = parseInt(item.unitCount, 10) || 1;
      qtyPerUnit = itemQtyPerCount > 0 ? itemQtyPerCount : totalQuantity;
    }
  }

  // Container Type (only for Sea)
  let containerType = item.containerType || contract.containerType;
  if (!containerType) {
    const p = item.product || {};
    const pCont = p.containerType || p.containerSize;
    if (pCont) {
      containerType = pCont;
    } else if (p.qty20ftContainer && Math.abs(qtyPerUnit - parseFloat(p.qty20ftContainer)) < 0.5) {
      containerType = "20 FEET";
    } else if (p.qty40ftContainer && Math.abs(qtyPerUnit - parseFloat(p.qty40ftContainer)) < 0.5) {
      containerType = "40 FEET";
    } else {
      containerType = "40 FEET";
    }
  }

  const tolerancePercentage =
    item.tolerancePercentage !== undefined && item.tolerancePercentage !== null
      ? item.tolerancePercentage
      : (contract.tolerancePercentage ?? 5);

  return generateQuantityDescription({
    transportMode: mode,
    unitCount,
    containerType,
    qtyPerUnit,
    totalQuantity,
    tolerancePercentage,
  });
}

