/**
 * Freight Required Logic by Incoterm (Frontend)
 *
 * Rules:
 * - EXW, FCA, FAS, FOB => FreightRequired = false
 * - CFR, CNF, CIF, CPT, CIP, DAP, DPU, DDP => FreightRequired = true
 */
export const NO_FREIGHT_INCOTERMS = ['EXW', 'FCA', 'FAS', 'FOB'];
export const FREIGHT_REQUIRED_INCOTERMS = [
  'CFR',
  'CNF',
  'CIF',
  'CPT',
  'CIP',
  'DAP',
  'DPU',
  'DDP',
];

export function extractIncotermCode(incoterm) {
  if (!incoterm || typeof incoterm !== 'string') return '';
  const trimmed = incoterm.trim().toUpperCase();
  const match = trimmed.match(/^([A-Z]{3,4})/);
  if (match) {
    return match[1];
  }
  return trimmed;
}

export function isFreightRequiredForIncoterm(incoterm) {
  if (!incoterm || typeof incoterm !== 'string') return false;
  const upper = incoterm.trim().toUpperCase();
  const code = extractIncotermCode(upper);

  if (NO_FREIGHT_INCOTERMS.includes(code)) {
    return false;
  }

  if (
    FREIGHT_REQUIRED_INCOTERMS.includes(code) ||
    upper.includes('CNF') ||
    upper.startsWith('CFR') ||
    upper.startsWith('CIF') ||
    upper.startsWith('CPT') ||
    upper.startsWith('CIP') ||
    upper.startsWith('DAP') ||
    upper.startsWith('DPU') ||
    upper.startsWith('DDP')
  ) {
    return true;
  }

  return false;
}
