/**
 * Helper to format multi-line address fields aligning to colon.
 */
export function formatAddressField(address, label = 'Address', padLength = 16) {
  if (!address || !address.trim()) return '';
  const lines = address
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return '';

  if (lines.length === 1) {
    return `${label.padEnd(padLength, ' ')} : ${lines[0]}`;
  }

  return `${label.padEnd(padLength, ' ')} :\n${lines.join('\n')}`;
}

export function generateBankDetailsText({ currency, domesticBank, nostroBank, beneficiaryName }) {
  const curr = (currency || 'INR').toUpperCase().trim();
  const bName = beneficiaryName || 'Agricom Impex Private Limited';
  const divider = '========================================';

  const isDomesticOnly = curr === 'INR' || !nostroBank;
  const domesticAddrBlock = formatAddressField(domesticBank?.bankAddress, 'Address', 16);

  if (isDomesticOnly) {
    const lines = [
      `BANK DETAILS (${curr})`,
      divider,
      'BENEFICIARY BANK DETAILS',
      `Beneficiary Name : ${bName}`,
      `Bank Name        : ${domesticBank?.bankName || ''}`,
      `Account Number   : ${domesticBank?.accountNumber || ''}`,
      `SWIFT Code       : ${domesticBank?.swiftCode || ''}`,
    ];
    if (domesticAddrBlock) {
      lines.push(domesticAddrBlock);
    }
    return lines.join('\n');
  }

  const nostroAddr =
    nostroBank?.bankAddress ||
    nostroBank?.address ||
    nostroBank?.nostroBankAddress ||
    '';
  const nostroAddrBlock = formatAddressField(nostroAddr, 'Address', 14);

  const lines = [
    `BANK DETAILS (${curr})`,
    divider,
    'NOSTRO BANK DETAILS',
    `Bank Name      : ${nostroBank?.bankName || ''}`,
    `Account Name   : ${nostroBank?.accountName || ''}`,
    `Account Number : ${nostroBank?.accountNumber || ''}`,
    `SWIFT Code     : ${nostroBank?.swiftCode || ''}`,
  ];

  if (nostroAddrBlock) {
    lines.push(nostroAddrBlock);
  }

  lines.push(
    '',
    divider,
    'BENEFICIARY BANK DETAILS',
    `Beneficiary Name : ${bName}`,
    `Bank Name        : ${domesticBank?.bankName || ''}`,
    `Account Number   : ${domesticBank?.accountNumber || ''}`,
    `SWIFT Code       : ${domesticBank?.swiftCode || ''}`,
  );

  if (domesticAddrBlock) {
    lines.push(domesticAddrBlock);
  }

  return lines.join('\n');
}

export function createBankDetailsSnapshot({
  domesticBank,
  nostroBank,
  currency,
  beneficiaryName,
  customFormattedText,
}) {
  const curr = (currency || domesticBank?.currency || 'INR').toUpperCase().trim();
  const bName =
    beneficiaryName ||
    domesticBank?.company?.legalName ||
    domesticBank?.company?.name ||
    'Agricom Impex Private Limited';

  const formatted =
    customFormattedText !== undefined && customFormattedText !== null
      ? customFormattedText
      : generateBankDetailsText({ currency: curr, domesticBank, nostroBank, beneficiaryName: bName });

  const bankKey = nostroBank
    ? `NOSTRO_${curr}_${nostroBank.id}`
    : `DOMESTIC_${curr}_${domesticBank?.id || 1}`;

  return {
    key: bankKey,
    selectedDomesticBankId: domesticBank?.id || null,
    selectedCurrency: curr,
    resolvedNostroBankId: nostroBank?.id || null,
    bankName: domesticBank?.bankName || '',
    accountName: bName,
    accountNumber: domesticBank?.accountNumber || '',
    swiftCode: domesticBank?.swiftCode || '',
    branch: domesticBank?.bankAddress || '',
    currency: curr,
    bankDetailsText: formatted,
    formattedText: formatted,
    additionalDetails: formatted,
    domesticBank: domesticBank
      ? {
        id: domesticBank.id,
        bankName: domesticBank.bankName,
        accountName: bName,
        accountNumber: domesticBank.accountNumber,
        swiftCode: domesticBank.swiftCode,
        bankAddress: domesticBank.bankAddress,
        currency: domesticBank.currency || 'INR',
      }
      : null,
    nostroBank: nostroBank
      ? {
        id: nostroBank.id,
        bankName: nostroBank.bankName,
        accountName: nostroBank.accountName,
        accountNumber: nostroBank.accountNumber,
        swiftCode: nostroBank.swiftCode,
        bankAddress: nostroBank.bankAddress,
        currency: nostroBank.currency,
      }
      : null,
    domesticBankName: domesticBank?.bankName || '',
    domesticAccountNumber: domesticBank?.accountNumber || '',
    domesticSwiftCode: domesticBank?.swiftCode || '',
    domesticBankAddress: domesticBank?.bankAddress || '',
    beneficiaryName: bName,
    ...(nostroBank
      ? {
        nostroBankName: nostroBank.bankName,
        nostroAccountName: nostroBank.accountName,
        nostroAccountNumber: nostroBank.accountNumber,
        nostroSwiftCode: nostroBank.swiftCode,
        nostroBankAddress: nostroBank.bankAddress,
      }
      : {}),
  };
}
