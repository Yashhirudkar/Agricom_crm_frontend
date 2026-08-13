/**
 * Dynamic preview generator for Shipment References.
 * WARNING: Must align exactly with backend shipment-reference.util.ts logic.
 * Saved references must always come from the backend.
 */
export function getShipmentReferencePreview(contractNo, shipmentNo, containers, shipmentDate, qty) {
  const contract = contractNo?.trim() || "DRAFT";
  const num = shipmentNo || 1;
  
  const containerCount = containers !== "" && containers !== null && containers !== undefined ? parseInt(containers, 10) : 0;
  const containerStr = `C${containerCount}`;
  
  let monthStr = "MM";
  let yearStr = "YY";
  if (shipmentDate) {
    const dateObj = new Date(shipmentDate);
    if (!isNaN(dateObj.getTime())) {
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      monthStr = months[dateObj.getMonth()] || "MM";
      yearStr = String(dateObj.getFullYear()).slice(-2);
    }
  }
  
  return `${contract}/${num}/${containerStr}/${monthStr}/${yearStr}`;
}
