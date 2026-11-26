export const SUPPORTED_INCOTERMS = [
  "EXW",
  "FCA",
  "FAS",
  "FOB",
  "CFR",
  "CIF",
  "CPT",
  "CIP",
  "DAP",
  "DPU",
  "DDP",
];

export const FREIGHT_COMPATIBILITY_MATRIX = {
  EXW: { EXW: false, FCA: false, FAS: false, FOB: false, CFR: false, CIF: false, CPT: false, CIP: false, DAP: false, DPU: false, DDP: false },
  FCA: { EXW: true,  FCA: false, FAS: false, FOB: false, CFR: false, CIF: false, CPT: false, CIP: false, DAP: false, DPU: false, DDP: false },
  FAS: { EXW: true,  FCA: true,  FAS: false, FOB: false, CFR: false, CIF: false, CPT: false, CIP: false, DAP: false, DPU: false, DDP: false },
  FOB: { EXW: true,  FCA: true,  FAS: true,  FOB: false, CFR: false, CIF: false, CPT: false, CIP: false, DAP: false, DPU: false, DDP: false },
  CFR: { EXW: true,  FCA: true,  FAS: true,  FOB: true,  CFR: false, CIF: false, CPT: false, CIP: false, DAP: false, DPU: false, DDP: false },
  CIF: { EXW: true,  FCA: true,  FAS: true,  FOB: true,  CFR: true,  CIF: false, CPT: false, CIP: false, DAP: false, DPU: false, DDP: false },
  CPT: { EXW: true,  FCA: true,  FAS: true,  FOB: true,  CFR: true,  CIF: true,  CPT: false, CIP: false, DAP: false, DPU: false, DDP: false },
  CIP: { EXW: true,  FCA: true,  FAS: true,  FOB: true,  CFR: true,  CIF: true,  CPT: true,  CIP: false, DAP: false, DPU: false, DDP: false },
  DAP: { EXW: true,  FCA: true,  FAS: true,  FOB: true,  CFR: true,  CIF: true,  CPT: true,  CIP: true,  DAP: false, DPU: false, DDP: false },
  DPU: { EXW: true,  FCA: true,  FAS: true,  FOB: true,  CFR: true,  CIF: true,  CPT: true,  CIP: true,  DAP: true,  DPU: false, DDP: false },
  DDP: { EXW: true,  FCA: true,  FAS: true,  FOB: true,  CFR: true,  CIF: true,  CPT: true,  CIP: true,  DAP: true,  DPU: true,  DDP: false },
};

export const STANDALONE_NO_FREIGHT_INCOTERMS = ["EXW", "FCA", "FAS", "FOB"];
export const STANDALONE_FREIGHT_REQUIRED_INCOTERMS = ["CFR", "CIF", "CPT", "CIP", "DAP", "DPU", "DDP"];

export function extractIncotermCode(st) {
  if (st === undefined || st === null) return "";
  if (typeof st === "number") return "";

  if (typeof st === "string") {
    const trimmed = st.trim().toUpperCase();
    if (SUPPORTED_INCOTERMS.includes(trimmed)) return trimmed;
    const match = trimmed.match(/^([A-Z]{3,4})/);
    let code = match ? match[1] : trimmed;
    if (code === "CNF") code = "CFR";
    if (code === "DAT") code = "DPU";
    if (SUPPORTED_INCOTERMS.includes(code)) return code;
    for (const inc of SUPPORTED_INCOTERMS) {
      if (new RegExp(`\\b${inc}\\b`).test(trimmed)) {
        return inc;
      }
    }
    return code;
  }

  if (typeof st === "object") {
    if (st.code) return extractIncotermCode(st.code);
    if (st.shortName) return extractIncotermCode(st.shortName);
    if (st.name) return extractIncotermCode(st.name);
  }

  return "";
}

export function evaluateStandaloneFreightRequired(incoterm) {
  const code = extractIncotermCode(incoterm);
  if (!code) return false;
  if (STANDALONE_FREIGHT_REQUIRED_INCOTERMS.includes(code)) return true;
  if (STANDALONE_NO_FREIGHT_INCOTERMS.includes(code)) return false;
  return false;
}

export function lookupFreightMatrix(scIncoterm, pcIncoterm) {
  const scCode = extractIncotermCode(scIncoterm);
  const pcCode = extractIncotermCode(pcIncoterm);

  if (!scCode || !pcCode) return false;
  const row = FREIGHT_COMPATIBILITY_MATRIX[scCode];
  if (!row) return false;
  const val = row[pcCode];
  return typeof val === "boolean" ? val : false;
}

export const FREIGHT_INCLUDED_BOTH_CONTRACTS_INCOTERMS = ["CFR", "CNF", "CIF"];

export function evaluateFreightRequired(pcShipmentType, scShipmentType, shipmentId) {
  const scCode = extractIncotermCode(scShipmentType);
  const pcCode = extractIncotermCode(pcShipmentType);

  // Scenario A – Contract Flow: Both Sales and Purchase Incoterms exist
  if (scCode && pcCode) {
    // Isolated rule: if both Purchase and Sales contracts already include freight (CFR/CNF/CIF), freight is not required.
    if (
      FREIGHT_INCLUDED_BOTH_CONTRACTS_INCOTERMS.includes(pcCode) &&
      FREIGHT_INCLUDED_BOTH_CONTRACTS_INCOTERMS.includes(scCode)
    ) {
      return {
        matrixResult: false,
        freightRequired: false,
        salesIncoterm: scCode,
        purchaseIncoterm: pcCode,
        reason: `Both contracts already include freight: SC ${scCode} x PC ${pcCode} = NO.`,
      };
    }

    const matrixResult = lookupFreightMatrix(scCode, pcCode);
    const reason = `Compatibility Matrix: SC ${scCode} x PC ${pcCode} = ${matrixResult ? "YES" : "NO"}.`;

    return {
      matrixResult,
      freightRequired: matrixResult,
      salesIncoterm: scCode,
      purchaseIncoterm: pcCode,
      reason,
    };
  }

  // Scenario B – Enquiry Flow: Purchase Contract is missing, evaluate using Sales/Enquiry Incoterm
  if (scCode && !pcCode) {
    const freightRequired = evaluateStandaloneFreightRequired(scCode);
    const reason = `Enquiry Incoterm: ${scCode} = ${freightRequired ? "YES" : "NO"} (Standalone Evaluation).`;

    return {
      matrixResult: freightRequired,
      freightRequired,
      salesIncoterm: scCode,
      purchaseIncoterm: "",
      reason,
    };
  }

  // Scenario C – Neither defined, or only PC defined (SC missing)
  return {
    matrixResult: false,
    freightRequired: false,
    salesIncoterm: scCode,
    purchaseIncoterm: pcCode,
    reason: `Compatibility Matrix: SC ${scCode || "unknown"} x PC ${pcCode || "unknown"} = NO.`,
  };
}

export function isFreightRequiredForShipment(shipment) {
  if (!shipment) return false;
  if (typeof shipment.freightRequired === "boolean") return shipment.freightRequired;
  if (typeof shipment.isFreightRequired === "boolean") return shipment.isFreightRequired;
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

export function isFreightRequiredForContracts(pcShipmentType, scShipmentType) {
  return evaluateFreightRequired(pcShipmentType, scShipmentType).freightRequired;
}
