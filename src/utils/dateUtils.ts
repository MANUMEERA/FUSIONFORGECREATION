/**
 * Date formatting utility for Fusion Forge Creation
 * Enforces DD-MM-YYYY format across all Commercial Documents, Quotations, and Tax Invoices
 */

export function formatDateDDMMYYYY(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return '—';
  
  if (typeof dateInput === 'string') {
    const trimmed = dateInput.trim();
    // Already in DD-MM-YYYY format
    if (/^\d{2}-\d{2}-\d{4}$/.test(trimmed)) {
      return trimmed;
    }
    // Handle standard YYYY-MM-DD format directly to avoid timezone drift
    if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
      const parts = trimmed.split('T')[0].split('-');
      if (parts.length === 3) {
        const [year, month, day] = parts;
        return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
      }
    }
  }

  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) {
      return String(dateInput);
    }
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return String(dateInput);
  }
}

const MONTH_FULL_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * GSTR-1 Specific Date Formatter: DD-MONTH NAME-YYYY (e.g. "14-August-2026", "05-August-2026")
 */
export function formatDateGstr1(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return '—';
  
  if (typeof dateInput === 'string') {
    const trimmed = dateInput.trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
      const parts = trimmed.split('T')[0].split('-');
      if (parts.length === 3) {
        const year = parts[0];
        const monthIdx = parseInt(parts[1], 10) - 1;
        const day = parts[2].padStart(2, '0');
        const monthName = MONTH_FULL_NAMES[monthIdx] || 'August';
        return `${day}-${monthName}-${year}`;
      }
    }
    if (/^\d{2}-\d{2}-\d{4}$/.test(trimmed)) {
      const parts = trimmed.split('-');
      const day = parts[0].padStart(2, '0');
      const monthIdx = parseInt(parts[1], 10) - 1;
      const year = parts[2];
      const monthName = MONTH_FULL_NAMES[monthIdx] || 'August';
      return `${day}-${monthName}-${year}`;
    }
  }

  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) {
      return String(dateInput);
    }
    const day = String(d.getDate()).padStart(2, '0');
    const monthName = MONTH_FULL_NAMES[d.getMonth()] || 'August';
    const year = d.getFullYear();
    return `${day}-${monthName}-${year}`;
  } catch {
    return String(dateInput);
  }
}

/**
 * Returns today's date in YYYY-MM-DD format for HTML date inputs
 */
export function getTodayInputDate(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns future date in YYYY-MM-DD format for HTML date inputs
 */
export function getFutureInputDate(daysAhead: number = 30): string {
  const d = new Date(Date.now() + daysAhead * 86400000);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
