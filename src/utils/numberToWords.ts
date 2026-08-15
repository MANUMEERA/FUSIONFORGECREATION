/**
 * Converts Indian currency numbers to words format
 * Example: 118000 -> "Indian Rupees One Lakh Eighteen Thousand Only"
 */

const ones = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const tens = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function convertBelowThousand(num: number): string {
  if (num === 0) return '';
  if (num < 20) return ones[num];
  if (num < 100) {
    const unit = num % 10;
    return tens[Math.floor(num / 10)] + (unit ? ' ' + ones[unit] : '');
  }
  const hundred = Math.floor(num / 100);
  const remainder = num % 100;
  return ones[hundred] + ' Hundred' + (remainder ? ' ' + convertBelowThousand(remainder) : '');
}

export function numberToWordsIndian(amount: number, currency: string = 'INR'): string {
  if (!amount || isNaN(amount) || amount === 0) {
    return currency === 'INR' ? 'Indian Rupees Zero Only' : `${currency} Zero Only`;
  }

  const rounded = Math.round(Math.abs(amount));
  const crore = Math.floor(rounded / 10000000);
  const lakh = Math.floor((rounded % 10000000) / 100000);
  const thousand = Math.floor((rounded % 100000) / 1000);
  const remainder = rounded % 1000;

  const parts: string[] = [];

  if (crore > 0) {
    parts.push(convertBelowThousand(crore) + ' Crore');
  }
  if (lakh > 0) {
    parts.push(convertBelowThousand(lakh) + ' Lakh');
  }
  if (thousand > 0) {
    parts.push(convertBelowThousand(thousand) + ' Thousand');
  }
  if (remainder > 0) {
    parts.push(convertBelowThousand(remainder));
  }

  const wordStr = parts.join(' ').trim();
  const prefix = currency === 'INR' ? 'Indian Rupees' : currency;

  return `${prefix} ${wordStr} Only`;
}
