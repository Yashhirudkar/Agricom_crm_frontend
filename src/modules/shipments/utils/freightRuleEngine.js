export const SUPPORTED_INCOTERMS = [];
export const FREIGHT_COMPATIBILITY_MATRIX = {};

export function extractIncotermCode() {
  return "";
}

export function lookupFreightMatrix() {
  return null;
}

export function evaluateFreightRequired() {
  return {
    matrixResult: null,
    freightRequired: false,
    salesIncoterm: "",
    purchaseIncoterm: "",
    reason: "Freight compatibility is evaluated by the backend.",
  };
}

export function isFreightRequiredForShipment(shipment) {
  if (!shipment) return false;
  if (typeof shipment.freightRequired === "boolean") return shipment.freightRequired;
  if (typeof shipment.isFreightRequired === "boolean") return shipment.isFreightRequired;
  return false;
}

export function isFreightAllocatedForShipment(shipment) {
  if (!isFreightRequiredForShipment(shipment)) return false;
  if (typeof shipment.freightReady === "boolean") return shipment.freightReady;
  return String(shipment.freightAllocationStatus || "").trim().toLowerCase() === "yes";
}

export function openShipmentFreightWorkflow(shipment, router) {
  if (!shipment?.id || !isFreightRequiredForShipment(shipment)) return;

  const params = new URLSearchParams({ from: "shipments" });
  if (shipment.shipmentReference) params.set("shipmentRef", shipment.shipmentReference);
  router.push(`/logistics/transport-workspace/${String(shipment.id)}?${params.toString()}`);
}

export function isFreightRequiredForContracts() {
  return false;
}
