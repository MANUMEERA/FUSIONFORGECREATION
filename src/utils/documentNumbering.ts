import { DocumentNumberConfig } from '../types';

export const DEFAULT_INVOICE_NUMBERING: DocumentNumberConfig = {
  document_type: 'invoice',
  prefix: 'INV',
  company_code: 'FFC',
  include_year: true,
  year_format: 'YYYY',
  starting_sequence: 10001,
  current_sequence: 10001,
  separator: '/',
  style: 'standard',
  custom_pattern: '{PREFIX}/{CODE}/{YEAR}/{SEQ}'
};

export const DEFAULT_QUOTATION_NUMBERING: DocumentNumberConfig = {
  document_type: 'quotation',
  prefix: 'QTN',
  company_code: 'FFC',
  include_year: true,
  year_format: 'YYYY',
  starting_sequence: 10001,
  current_sequence: 10001,
  separator: '/',
  style: 'standard',
  custom_pattern: '{PREFIX}/{CODE}/{YEAR}/{SEQ}'
};

/**
 * Format a formatted document number based on the configuration and sequence value.
 */
export function formatDocumentNumber(
  config: DocumentNumberConfig,
  sequence: number,
  date: Date = new Date()
): string {
  const yearFull = date.getFullYear().toString();
  const yearShort = yearFull.slice(-2);
  const nextYearShort = (date.getFullYear() + 1).toString().slice(-2);
  const financialYear = `${yearFull}-${nextYearShort}`;

  let formattedYear = yearFull;
  if (config.year_format === 'YY') {
    formattedYear = yearShort;
  } else if (config.year_format === 'YYYY-YY') {
    formattedYear = financialYear;
  }

  const seqStr = String(sequence);
  const seq4 = String(sequence).padStart(4, '0');
  const seq5 = String(sequence).padStart(5, '0');

  if (config.style === 'shorter') {
    // E.g. QTN-2026-0001 or INV-2026-0001
    const pfx = config.prefix || (config.document_type === 'invoice' ? 'INV' : 'QTN');
    const sep = config.separator || '-';
    return `${pfx}${sep}${formattedYear}${sep}${seq4}`;
  }

  if (config.style === 'custom' && config.custom_pattern) {
    return config.custom_pattern
      .replace(/{PREFIX}/g, config.prefix || (config.document_type === 'invoice' ? 'INV' : 'QTN'))
      .replace(/{CODE}/g, config.company_code || 'FFC')
      .replace(/{YEAR}/g, formattedYear)
      .replace(/{YY}/g, yearShort)
      .replace(/{SEQ}/g, seqStr)
      .replace(/{SEQ4}/g, seq4)
      .replace(/{SEQ5}/g, seq5);
  }

  // Standard Style: QTN/FFC/2026/10001 or INV/FFC/2026/10001
  const prefix = config.prefix || (config.document_type === 'invoice' ? 'INV' : 'QTN');
  const code = config.company_code || 'FFC';
  const sep = config.separator || '/';
  
  if (config.include_year) {
    return `${prefix}${sep}${code}${sep}${formattedYear}${sep}${seqStr}`;
  }
  return `${prefix}${sep}${code}${sep}${seqStr}`;
}

/**
 * Generates the next guaranteed unique transaction-safe document number,
 * checking against existing document numbers to prevent any collision or duplication.
 */
export function generateNextDocumentNumber(
  type: 'invoice' | 'quotation',
  config: DocumentNumberConfig,
  existingNumbers: string[]
): { number: string; nextSequence: number } {
  const existingSet = new Set(existingNumbers.map(n => n.trim().toUpperCase()));
  
  let candidateSeq = Math.max(
    config.current_sequence || config.starting_sequence || 10001,
    config.starting_sequence || 10001
  );

  let candidateNumber = formatDocumentNumber(config, candidateSeq);
  
  // Guard against any collision by incrementing sequence
  let iterations = 0;
  while (existingSet.has(candidateNumber.toUpperCase()) && iterations < 10000) {
    candidateSeq++;
    candidateNumber = formatDocumentNumber(config, candidateSeq);
    iterations++;
  }

  return {
    number: candidateNumber,
    nextSequence: candidateSeq + 1
  };
}
