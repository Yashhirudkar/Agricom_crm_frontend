/**
 * Converts a numeric amount to its English word representation.
 * Supports both International (USD, EUR, GBP, etc.) and Indian (INR) numbering formats.
 *
 * @param {number|string} amount - The numerical amount
 * @param {string} currency - Currency code (e.g. 'USD', 'INR', 'EUR', 'GBP')
 * @returns {string} Words representation (e.g. "USD One Thousand Two Hundred Fifty Only")
 */
export function numberToWords(amount, currency = 'USD') {
  const num = parseFloat(amount);
  if (isNaN(num) || num === 0) return `${currency} Zero Only`;

  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];

  const tens = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
  ];

  const convertChunk = (n) => {
    if (n === 0) return '';
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convertChunk(n % 100) : '');
    return '';
  };

  const absNum = Math.abs(num);
  const wholePart = Math.floor(absNum);
  const decimalPart = Math.round((absNum - wholePart) * 100);

  let words = '';

  if (currency === 'INR') {
    let n = wholePart;
    if (n === 0) {
      words = 'Zero';
    } else {
      const crore = Math.floor(n / 10000000);
      n %= 10000000;
      const lakh = Math.floor(n / 100000);
      n %= 100000;
      const thousand = Math.floor(n / 1000);
      n %= 1000;

      if (crore > 0) words += convertChunk(crore) + ' Crore ';
      if (lakh > 0) words += convertChunk(lakh) + ' Lakh ';
      if (thousand > 0) words += convertChunk(thousand) + ' Thousand ';
      if (n > 0) words += convertChunk(n);
    }
  } else {
    let n = wholePart;
    if (n === 0) {
      words = 'Zero';
    } else {
      const billion = Math.floor(n / 1000000000);
      n %= 1000000000;
      const million = Math.floor(n / 1000000);
      n %= 1000000;
      const thousand = Math.floor(n / 1000);
      n %= 1000;

      if (billion > 0) words += convertChunk(billion) + ' Billion ';
      if (million > 0) words += convertChunk(million) + ' Million ';
      if (thousand > 0) words += convertChunk(thousand) + ' Thousand ';
      if (n > 0) words += convertChunk(n);
    }
  }

  words = words.trim();

  let subUnit = 'Cents';
  if (currency === 'INR') subUnit = 'Paise';
  else if (currency === 'EUR') subUnit = 'Cents';
  else if (currency === 'GBP') subUnit = 'Pence';

  if (decimalPart > 0) {
    const decimalWords = convertChunk(decimalPart);
    words += ` and ${subUnit} ${decimalWords}`;
  }

  return `${currency} ${words} Only`;
}
