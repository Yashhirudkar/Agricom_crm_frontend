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
 * Distributes total product quantity evenly across a specified number of shipments.
 * Ensures the sum of distributed quantities strictly equals totalProductQty by placing
 * any rounding remainder in the final shipment.
 *
 * @param {number|string} totalProductQty - Total product quantity in MT
 * @param {number|string} numShipments - Number of shipments (>= 1)
 * @returns {number[]} Array of shipment quantities
 */
export function distributeShipmentQuantities(totalProductQty, numShipments) {
  const count = Math.max(1, parseInt(numShipments, 10) || 1);
  const total = Math.max(0, Math.round(parseFloat(totalProductQty) || 0));

  if (total === 0) {
    return Array.from({ length: count }, () => 0);
  }

  const baseQty = 22; // Each shipment carries max 22 MT whole integer
  const quantities = [];
  let allocated = 0;

  for (let i = 0; i < count - 1; i++) {
    quantities.push(baseQty);
    allocated += baseQty;
  }

  const remainder = total - allocated;
  quantities.push(remainder);

  return quantities;
}

/**
 * Generates shipment schedule rows with auto-distributed quantities and default container counts.
 * Preserves user-entered shipment dates and remarks from existing rows.
 *
 * @param {Object} params
 * @param {number|string} params.totalProductQty - Total product quantity in MT
 * @param {number|string} params.numShipments - Total shipment rows to generate
 * @param {Array} [params.existingShipments=[]] - Existing shipment rows
 * @param {string} [params.currencyCode=""] - Contract currency code
 * @returns {Array} Array of shipment objects
 */
export function generateAutoShipments({
  totalProductQty,
  numShipments,
  existingShipments = [],
  currencyCode = "",
}) {
  const count = Math.max(1, parseInt(numShipments, 10) || 1);
  const totalQty = Math.max(0, parseFloat(totalProductQty) || 0);
  const distributedQuantities = distributeShipmentQuantities(totalQty, count);

  return Array.from({ length: count }, (_, i) => {
    const prev = existingShipments[i] || {};
    const qty = distributedQuantities[i];

    return {
      ...(prev.id ? { id: prev.id } : {}),
      shipmentNo: i + 1,
      shipmentDate: prev.shipmentDate || "",
      noOfContainers: (prev.noOfContainers != null && prev.noOfContainers !== "" && parseInt(prev.noOfContainers, 10) >= 1) ? parseInt(prev.noOfContainers, 10) : 1,
      quantity: totalQty > 0 ? (qty > 0 ? qty : 0) : "",
      ratePerMt: 0,
      purchaseRate: 0,
      forex: 0,
      freight: 0,
      currencyCode: currencyCode || prev.currencyCode || "",
      remarks: prev.remarks || "",
    };
  });
}