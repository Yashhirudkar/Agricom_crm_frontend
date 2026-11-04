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
 * New Business Rule:
 * Shipment Qty must ALWAYS equal Qty Per Count.
 * Every shipment must contain exactly Qty Per Count.
 * Partial/remaining shipment is NOT allowed.
 *
 * If Product Qty % Qty Per Count !== 0, returns an empty array (no rows generated).
 *
 * @param {number|string} totalProductQty - Total product quantity in MT
 * @param {number|string} qtyPerCount - Qty Per Count in MT
 * @returns {number[]} Array of shipment quantities (each strictly equal to qtyPerCount)
 */
export function distributeShipmentQuantities(totalProductQty, qtyPerCount) {
  const total = Math.max(0, parseFloat(totalProductQty) || 0);
  const perCount = Math.max(0, parseFloat(qtyPerCount) || 0);

  if (total === 0 || perCount === 0) {
    return [];
  }

  // Strict rule: partial/remainder is NOT allowed.
  if (!isDivisible(total, perCount)) {
    return [];
  }

  const count = Math.round(total / perCount);
  return Array.from({ length: count }, () => perCount);
}

/**
 * Generates shipment schedule rows when Product Qty is an exact multiple of Qty Per Count.
 * Every shipment row strictly has quantity = Qty Per Count.
 * If Product Qty % Qty Per Count !== 0, returns an empty array.
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
 * @returns {Array} Array of shipment objects
 */
export function generateAutoShipments({
  totalProductQty,
  qtyPerCount,
  numShipments,
  existingShipments = [],
  currencyCode = "",
  defaultShipmentDate = "",
}) {
  const totalQty = Math.max(0, parseFloat(totalProductQty) || 0);
  const perCount = parseFloat(qtyPerCount) || 0;

  if (totalQty > 0 && perCount > 0) {
    // If not divisible, do NOT generate shipment rows.
    if (!isDivisible(totalQty, perCount)) {
      return [];
    }

    const count = Math.round(totalQty / perCount);
    return Array.from({ length: count }, (_, i) => {
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
        quantity: perCount,
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
