/**
 * Multi-shipment execution eligibility helpers across all transport modes
 * (Truck/Road, Rail/Wagon, Sea/Container, Bulk, Air, Courier) for shipments
 * belonging to the same Sales Contract.
 */

import {
  isFreightAllocatedForShipment,
  isFreightRequiredForShipment,
  isRailOriginTransportShipment,
} from "./freightRuleEngine.js";

export function getOriginTransportModeValue(shipment) {
  return String(
    shipment?.salesContract?.originTransportMode ??
      shipment?.originTransportMode ??
      shipment?.salesContract?.transportMode ??
      "",
  )
    .trim()
    .toLowerCase();
}

export function getMultiExecutionTransportCategory(shipment) {
  const mode = getOriginTransportModeValue(shipment);
  if (!mode) return "sea";

  if (mode.includes("rail") || mode.includes("wagon")) {
    return "rail";
  }

  if (mode.includes("road") || mode.includes("truck")) {
    return "truck";
  }

  if (mode.includes("air")) {
    return "air";
  }

  if (mode.includes("bulk")) {
    return "bulk";
  }

  if (mode.includes("courier")) {
    return "courier";
  }

  if (
    mode.includes("sea") ||
    mode.includes("ocean") ||
    mode.includes("container") ||
    mode.includes("fcl") ||
    mode.includes("vessel") ||
    mode.includes("ship")
  ) {
    return "sea";
  }

  return "other";
}

export function hasLinkedPurchaseContract(shipment) {
  const salesContract = shipment?.salesContract;
  if (
    shipment?.purchaseContract?.id ||
    shipment?.purchaseContractId ||
    (Array.isArray(shipment?.purchaseContracts) &&
      shipment.purchaseContracts.some((contract) => contract?.id)) ||
    salesContract?.purchaseContract?.id ||
    (Array.isArray(salesContract?.purchaseContracts) &&
      salesContract.purchaseContracts.some((contract) => contract?.id))
  ) {
    return true;
  }

  const purchaseContractNo = String(
    shipment?.purchaseContractNo ||
      shipment?.purchaseContract?.contractNumber ||
      salesContract?.purchaseContractNo ||
      "",
  )
    .trim()
    .toUpperCase();
  return Boolean(purchaseContractNo && purchaseContractNo !== "-" && purchaseContractNo !== "N/A");
}

export function isEligibleForMultiShipmentExecution(shipments = []) {
  if (!Array.isArray(shipments) || shipments.length <= 1) return false;

  const uniqueShipments = Array.from(
    new Map(
      shipments
        .filter((s) => Number.isSafeInteger(Number(s?.id)) && Number(s.id) > 0)
        .map((s) => [Number(s.id), s]),
    ).values(),
  );
  if (uniqueShipments.length <= 1) return false;

  const firstCategory = getMultiExecutionTransportCategory(uniqueShipments[0]);
  if (!firstCategory) return false;

  const firstContractId = Number(
    uniqueShipments[0]?.salesContractId || uniqueShipments[0]?.salesContract?.id || 0,
  );
  if (!firstContractId) return false;

  return uniqueShipments.every((s) => {
    const scId = Number(s?.salesContractId || s?.salesContract?.id || 0);
    return (
      scId === firstContractId &&
      getMultiExecutionTransportCategory(s) === firstCategory
    );
  });
}

export function resolveSelectedShipmentsForExecution(
  clickedShipment,
  selectedShipmentObjects = [],
) {
  if (!clickedShipment?.id) return [];
  if (
    Array.isArray(clickedShipment.stuffingGroupShipments) &&
    clickedShipment.stuffingGroupShipments.length > 1
  ) {
    return clickedShipment.stuffingGroupShipments;
  }
  if (!isEligibleForMultiShipmentExecution(selectedShipmentObjects)) {
    return [clickedShipment];
  }

  const clickedId = Number(clickedShipment.id);
  const selectedIds = new Set(selectedShipmentObjects.map((s) => Number(s.id)));
  if (!selectedIds.has(clickedId)) {
    return [clickedShipment];
  }

  const category = getMultiExecutionTransportCategory(clickedShipment);
  if (!category) return [clickedShipment];

  const allReady = selectedShipmentObjects.every(
    (s) => s.canExecute === true || s.readyForShipment === true,
  );
  if (!allReady) {
    return [clickedShipment];
  }

  return [
    clickedShipment,
    ...selectedShipmentObjects.filter((s) => Number(s.id) !== clickedId),
  ];
}

/**
 * Resolves bulk "Execute Workspace" behavior when multiple Rail Freight / Wagon
 * shipments are selected: opens Transport Workspace if Freight Quote is still pending,
 * or opens Multi-Shipment Stuffing Execution directly when ready — without calling
 * POST /api/purchase-contracts (reusing existing Purchase Contract(s) linked to the SC).
 * Returns `{ handled: false }` for single-shipment selections and all non-Rail modes.
 */
export function resolveRailMultiBulkExecuteAction(shipments = []) {
  const uniqueShipments = Array.from(
    new Map(
      (Array.isArray(shipments) ? shipments : [])
        .filter((s) => Number.isSafeInteger(Number(s?.id)) && Number(s.id) > 0)
        .map((s) => [Number(s.id), s]),
    ).values(),
  );

  if (
    uniqueShipments.length <= 1 ||
    !uniqueShipments.every((s) => isRailOriginTransportShipment(s))
  ) {
    return { handled: false };
  }

  const salesContractId =
    uniqueShipments[0]?.salesContractId || uniqueShipments[0]?.salesContract?.id;
  const selectedContractIds = new Set(
    uniqueShipments.map((s) =>
      Number(s?.salesContractId || s?.salesContract?.id || 0),
    ),
  );

  if (
    !salesContractId ||
    selectedContractIds.has(0) ||
    selectedContractIds.size !== 1
  ) {
    return {
      handled: true,
      action: "error",
      reason: !salesContractId
        ? "Missing salesContractId on first selected shipment"
        : "Multiple or mismatched Sales Contracts selected",
      selectedContractIds,
      shipments: uniqueShipments,
      message: !salesContractId
        ? "Could not determine Sales Contract for selected shipments"
        : "Execute Workspace can only include shipments from one Sales Contract.",
    };
  }

  const hasPendingFreight = uniqueShipments.some(
    (s) =>
      isFreightRequiredForShipment(s) && !isFreightAllocatedForShipment(s),
  );
  if (hasPendingFreight) {
    const nonFreightRequired = uniqueShipments.filter(
      (s) => !isFreightRequiredForShipment(s),
    );
    if (nonFreightRequired.length > 0) {
      return {
        handled: true,
        action: "error",
        shipments: uniqueShipments,
        message:
          "Transport Workspace is not required for one or more selected shipments.",
      };
    }
    return {
      handled: true,
      action: "transport_workspace",
      primaryShipment: uniqueShipments[0],
      selectedShipmentIds: uniqueShipments.map((s) => Number(s.id)),
    };
  }

  const unreadyShipments = uniqueShipments.filter(
    (s) => !(s.canExecute === true || s.readyForShipment === true),
  );
  if (unreadyShipments.length > 0) {
    const refs = unreadyShipments
      .map((s) => s.shipmentReference || `SHP-${s.id}`)
      .join(", ");
    return {
      handled: true,
      action: "error",
      shipments: uniqueShipments,
      message: `Cannot execute: Shipment(s) pending Cargo or Freight allocation (${refs}).`,
    };
  }

  return {
    handled: true,
    action: "stuffing_execution",
    shipments: uniqueShipments,
  };
}
