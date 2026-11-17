/**
 * Dynamic Freight Rule Engine (Frontend)
 *
 * Evaluates dynamic freight requirement by comparing Purchase Contract Shipment Type
 * and Sales Contract Shipment Type metadata from the Shipment Type Master.
 *
 * Rules:
 * - Sales Stage > Purchase Stage AND Sales freightRequiredAfterStage is Yes (true) => Freight Required = YES
 * - Sales Stage <= Purchase Stage => Freight Required = NO
 * - Sales freightRequiredAfterStage is No (false) => Freight Required = NO
 *
 * If no Purchase Contract is linked yet:
 * - Sales freightRequiredAfterStage is Yes (true) and stageOrder > 0 => Freight Required = YES
 * - Else => Freight Required = NO
 */
export function evaluateFreightRequired(pcShipmentType, scShipmentType) {
  const scStage =
    scShipmentType?.stageOrder !== undefined && scShipmentType?.stageOrder !== null
      ? Number(scShipmentType.stageOrder)
      : 0;
  const pcStage =
    pcShipmentType?.stageOrder !== undefined && pcShipmentType?.stageOrder !== null
      ? Number(pcShipmentType.stageOrder)
      : 0;
  const scFreightAfterStage = Boolean(scShipmentType?.freightRequiredAfterStage);

  if (!scShipmentType && !pcShipmentType) {
    return {
      freightRequired: false,
      salesStage: 0,
      purchaseStage: 0,
      freightRequiredAfterStage: false,
      reason: "Neither Sales nor Purchase shipment type is defined.",
    };
  }

  // When Sales Contract shipment type exists:
  if (scShipmentType) {
    if (pcShipmentType) {
      const isSalesStageGreater = scStage > pcStage;
      const required = isSalesStageGreater && scFreightAfterStage;
      return {
        freightRequired: required,
        salesStage: scStage,
        purchaseStage: pcStage,
        freightRequiredAfterStage: scFreightAfterStage,
        reason: required
          ? `Sales Stage (${scStage}) > Purchase Stage (${pcStage}) and Freight Required After Stage = Yes.`
          : !isSalesStageGreater
          ? `Sales Stage (${scStage}) <= Purchase Stage (${pcStage}). Freight Required = NO.`
          : `Freight Required After Stage is No for Sales Shipment Type (${scShipmentType.code || scShipmentType.name || "SC"}). Freight Required = NO.`,
      };
    }

    // Standalone Sales Contract without linked Purchase Contract
    const required = scFreightAfterStage && scStage > 0;
    return {
      freightRequired: required,
      salesStage: scStage,
      purchaseStage: 0,
      freightRequiredAfterStage: scFreightAfterStage,
      reason: required
        ? `No linked Purchase Contract. Sales Shipment Type requires freight after Stage ${scStage}. Freight Required = YES.`
        : `Sales Shipment Type does not require freight after Stage ${scStage}. Freight Required = NO.`,
    };
  }

  // Only Purchase Contract exists without Sales Contract
  return {
    freightRequired: false,
    salesStage: 0,
    purchaseStage: pcStage,
    freightRequiredAfterStage: false,
    reason: "Sales Contract shipment type is not defined. Freight Required = NO.",
  };
}

/**
 * Helper to determine whether freight is required for a shipment.
 * Reads backend evaluated flag if present, otherwise evaluates dynamically from master metadata.
 */
export function isFreightRequiredForShipment(shipment) {
  if (!shipment) return false;
  if (typeof shipment.freightRequired === "boolean") {
    return shipment.freightRequired;
  }
  if (typeof shipment.isFreightRequired === "boolean") {
    return shipment.isFreightRequired;
  }
  if (shipment.isFreightNotApplicable === true || shipment.freightAllocationStatus === "Not Applicable") {
    return false;
  }

  const scShipmentType =
    shipment.salesContract?.shipmentType ||
    shipment.shipmentType ||
    null;

  const pcShipmentType =
    shipment.purchaseContract?.shipmentType ||
    shipment.salesContract?.purchaseContract?.shipmentType ||
    (Array.isArray(shipment.purchaseContracts) && shipment.purchaseContracts[0]?.shipmentType) ||
    null;

  return evaluateFreightRequired(pcShipmentType, scShipmentType).freightRequired;
}

/**
 * Helper to determine whether freight is required for contracts.
 */
export function isFreightRequiredForContracts(pcShipmentType, scShipmentType) {
  return evaluateFreightRequired(pcShipmentType, scShipmentType).freightRequired;
}
