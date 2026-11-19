import { evaluateFreightRequired } from './freightRuleEngine';

export function isFreightRequiredForIncoterm(salesIncoterm, purchaseIncoterm = null) {
  return evaluateFreightRequired(purchaseIncoterm, salesIncoterm).freightRequired;
}
