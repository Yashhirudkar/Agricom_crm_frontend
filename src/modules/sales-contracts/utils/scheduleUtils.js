export const getScheduleStatus = (contractDate) => {
  if (!contractDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(contractDate);
  targetDate.setHours(0, 0, 0, 0);

  const timeDiff = targetDate.getTime() - today.getTime();
  const daysDiff = Math.round(timeDiff / (1000 * 3600 * 24));

  return daysDiff;
};

/**
 * Checks whether Product Qty is an exact multiple of Qty Per Count.
 * Handles floating point precision cleanly.
 *
 * @param {number|string} totalProductQty
 * @param {number|string} qtyPerCount
 * @returns {boolean}
 */
export function isDivisible(totalProductQty, qtyPerCount) {
  const total = parseFloat(totalProductQty) || 0;
  const perCount = parseFloat(qtyPerCount) || 0;
  if (total <= 0 || perCount <= 0) return false;
  const quotient = Math.round((total / perCount) * 1000000) / 1000000;
  return Number.isInteger(quotient) || Math.abs(quotient - Math.round(quotient)) < 0.0001;
}

/**
 * Distributes total product quantity using Qty Per Count.
 *
 * Default Business Rule (non-Rail modes):
 * Shipment Qty must ALWAYS equal Qty Per Count.
 * Every shipment must contain exactly Qty Per Count.
 * Partial/remaining shipment is NOT allowed.
 *
 * If Product Qty % Qty Per Count !== 0 and allowRemainder is false, returns an empty array.
 * When allowRemainder is true (e.g. Rail Freight / Wagon), full chunks of Qty Per Count
 * are followed by any positive remainder so total quantity is preserved.
 *
 * @param {number|string} totalProductQty - Total product quantity in MT
 * @param {number|string} qtyPerCount - Qty Per Count in MT
 * @param {Object} [options={}] - Optional distribution flags
 * @param {boolean} [options.allowRemainder=false] - Allow remainder row when not evenly divisible
 * @returns {number[]} Array of shipment quantities
 */
export function distributeShipmentQuantities(totalProductQty, qtyPerCount, options = {}) {
  const total = Math.max(0, parseFloat(totalProductQty) || 0);
  const perCount = Math.max(0, parseFloat(qtyPerCount) || 0);

  if (total === 0 || perCount === 0) {
    return [];
  }

  if (isDivisible(total, perCount)) {
    const count = Math.round(total / perCount);
    return Array.from({ length: count }, () => perCount);
  }

  if (!options.allowRemainder) {
    return [];
  }

  const fullCount = Math.floor(total / perCount);
  const remainder = Math.round((total - fullCount * perCount) * 1000000) / 1000000;
  const quantities = Array.from({ length: fullCount }, () => perCount);
  if (remainder > 0.0001) {
    quantities.push(remainder);
  }
  return quantities;
}

/**
 * Generates shipment schedule rows.
 * For non-Rail modes, every shipment row strictly has quantity = Qty Per Count
 * and returns [] if Product Qty is not an exact multiple of Qty Per Count.
 * When allowRemainder is true (Rail Freight / Wagon), distributes full chunks plus remainder.
 * Every shipment row automatically receives defaultShipmentDate (Contract Date).
 * Preserves user-entered shipment dates and remarks from existing rows.
 *
 * @param {Object} params
 * @param {number|string} params.totalProductQty - Total product quantity in MT
 * @param {number|string} [params.qtyPerCount] - Qty Per Count in MT
 * @param {number|string} [params.numShipments] - Fallback shipment count
 * @param {Array} [params.existingShipments=[]] - Existing shipment rows
 * @param {string} [params.currencyCode=""] - Contract currency code
 * @param {string} [params.defaultShipmentDate=""] - Default shipment date (Contract Date)
 * @param {boolean} [params.allowRemainder=false] - Allow remainder shipment row (Rail Freight / Wagon)
 * @returns {Array} Array of shipment objects
 */
export function generateAutoShipments({
  totalProductQty,
  qtyPerCount,
  numShipments,
  existingShipments = [],
  currencyCode = "",
  defaultShipmentDate = "",
  allowRemainder = false,
}) {
  const totalQty = Math.max(0, parseFloat(totalProductQty) || 0);
  const perCount = parseFloat(qtyPerCount) || 0;

  if (totalQty > 0 && perCount > 0) {
    const quantities = distributeShipmentQuantities(totalQty, perCount, { allowRemainder });
    if (quantities.length === 0) {
      return [];
    }

    return quantities.map((rowQty, i) => {
      const prev = existingShipments[i] || {};

      return {
        ...(prev.id ? { id: prev.id } : {}),
        shipmentNo: i + 1,
        shipmentDate: prev.shipmentDate || defaultShipmentDate || "",
        isDateCustomized:
          prev.isDateCustomized ||
          (prev.shipmentDate && defaultShipmentDate && prev.shipmentDate !== defaultShipmentDate) ||
          false,
        noOfContainers:
          prev.noOfContainers != null &&
          prev.noOfContainers !== "" &&
          parseInt(prev.noOfContainers, 10) >= 1
            ? parseInt(prev.noOfContainers, 10)
            : 1,
        quantity: rowQty,
        ratePerMt: prev.ratePerMt ?? 0,
        purchaseRate: prev.purchaseRate ?? 0,
        forex: prev.forex ?? 0,
        freight: prev.freight ?? 0,
        currencyCode: currencyCode || prev.currencyCode || "",
        remarks: prev.remarks || "",
      };
    });
  }

  // Fallback for older contracts without qtyPerCount
  const count = Math.max(1, parseInt(numShipments, 10) || 1);
  return existingShipments.slice(0, count);
}
