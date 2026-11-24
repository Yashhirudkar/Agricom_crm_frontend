/**
 * Helper to format multi-line address fields with proper indentation aligning to the colon.
 *
 * @param {string} address - Multi-line or single-line address string
 * @param {string} label - Field label (defaults to 'Address')
 * @returns {string} Formatted address line(s)
 */
export function formatAddressField(address, label = 'Address') {
  if (!address || !String(address).trim()) return '';
  const lines = String(address)
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return '';

  const prefix = `${label.padEnd(16, ' ')} : `;
  const indent = ' '.repeat(prefix.length);

  return lines
    .map((line, idx) => (idx === 0 ? `${prefix}${line}` : `${indent}${line}`))
    .join('\n');
}

/**
 * Formats bank details exactly according to the international trade ERP specification.
 *
 * If Document Currency = INR:
 * -> Prints only Domestic Bank Details.
 *
 * If Document Currency = USD / EUR / GBP / AED etc.:
 * -> Prints Nostro Bank Details first.
 * -> Then prints the linked Domestic (Beneficiary) Bank Details.
 *
 * @param {Object} params
 * @param {string} params.currency - Document currency code (e.g. 'EUR', 'USD', 'INR')
 * @param {string} [params.beneficiaryName] - Company / Beneficiary Name
 * @param {Object} params.domesticBank - Domestic bank info
 * @param {Object} [params.nostroBank] - Nostro bank info (optional for INR)
 * @returns {string} Formatted text matching the exact PDF output requirements
 */
export function formatBankDetails({
  currency = 'INR',
  beneficiaryName = 'AGRICOM IMPEX',
  domesticBank = {},
  nostroBank = null,
}) {
  const curr = (currency || 'INR').toUpperCase().trim();
  const benef = beneficiaryName || 'AGRICOM IMPEX';
  const domestic = domesticBank || {};
  const nostro = nostroBank;

  const isDomesticOnly = curr === 'INR' || !nostro || !nostro.bankName;
  const domesticAddrBlock = formatAddressField(
    domestic.bankAddress || domestic.address || '',
    'Address',
  );

  if (isDomesticOnly) {
    const lines = [
      `BANK DETAILS (${curr})`,
      '',
      '==========================================',
      'BENEFICIARY BANK DETAILS',
      '==========================================',
      `Beneficiary Name : ${benef}`,
      `Bank Name        : ${domestic.bankName || ''}`,
      `Account Number   : ${domestic.accountNumber || ''}`,
      `SWIFT Code       : ${domestic.swiftCode || ''}`,
    ];
    if (domesticAddrBlock) {
      lines.push(domesticAddrBlock);
    }
    return lines.join('\n').toUpperCase();
  }

  const nostroAddr =
    nostro.bankAddress ||
    nostro.address ||
    nostro.nostroBankAddress ||
    nostro.branchAddress ||
    (nostro.bankName?.toLowerCase().includes('frankfurt')
      ? 'Frankfurt, Germany'
      : nostro.bankName?.toLowerCase().includes('chase')
      ? 'New York, USA'
      : '');

  const nostroAddrBlock = formatAddressField(nostroAddr, 'Address');

  const lines = [
    `BANK DETAILS (${curr})`,
    '',
    '==========================================',
    'NOSTRO BANK DETAILS',
    '==========================================',
    `Bank Name        : ${nostro.bankName || ''}`,
    `Account Name     : ${nostro.accountName || ''}`,
    `Account Number   : ${nostro.accountNumber || ''}`,
    `SWIFT Code       : ${nostro.swiftCode || ''}`,
  ];

  if (nostroAddrBlock) {
    lines.push(nostroAddrBlock);
  }

  lines.push(
    '',
    '==========================================',
    'BENEFICIARY BANK DETAILS',
    '==========================================',
    `Beneficiary Name : ${benef}`,
    `Bank Name        : ${domestic.bankName || ''}`,
    `Account Number   : ${domestic.accountNumber || ''}`,
    `SWIFT Code       : ${domestic.swiftCode || ''}`,
  );

  if (domesticAddrBlock) {
    lines.push(domesticAddrBlock);
  }

  return lines.join('\n').toUpperCase();
}
