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
