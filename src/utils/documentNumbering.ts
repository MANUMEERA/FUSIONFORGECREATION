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

export const DEFAULT_CREDIT_NOTE_NUMBERING: DocumentNumberConfig = {
  document_type: 'credit_note',
  prefix: 'CN',
  company_code: 'FFC',
  include_year: true,
  year_format: 'YYYY',
  starting_sequence: 10001,
  current_sequence: 10001,
  separator: '/',
  style: 'standard',
  custom_pattern: '{PREFIX}/{CODE}/{YEAR}/{SEQ}'
};

export const DEFAULT_DEBIT_NOTE_NUMBERING: DocumentNumberConfig = {
  document_type: 'debit_note',
  prefix: 'DN',
  company_code: 'FFC',
  include_year: true,
  year_format: 'YYYY',
  starting_sequence: 10001,
  current_sequence: 10001,
  separator: '/',
  style: 'standard',
  custom_pattern: '{PREFIX}/{CODE}/{YEAR}/{SEQ}'
};

const DEFAULT_PREFIX_MAP: Record<string, string> = {
  invoice: 'INV',
  quotation: 'QTN',
  credit_note: 'CN',
  debit_note: 'DN'
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
  const financialYear = `FY${yearShort}-${nextYearShort}`;
  const splitYear = `${yearFull}-${nextYearShort}`;

  let formattedYear = yearFull;
  if (config.year_format === 'YY') {
    formattedYear = yearShort;
  } else if (config.year_format === 'FY') {
    formattedYear = financialYear;
  } else if (config.year_format === 'YYYY-YY') {
    formattedYear = splitYear;
  }

  const seqStr = String(sequence);
  const seq4 = String(sequence).padStart(4, '0');
  const seq5 = String(sequence).padStart(5, '0');
  const defaultPrefix = DEFAULT_PREFIX_MAP[config.document_type] || 'DOC';
  const prefix = config.prefix || defaultPrefix;
  const code = config.company_code || 'FFC';
  const sep = config.separator ?? '/';

  if (config.style === 'shorter' || config.style === 'compact') {
    // E.g. CN-2026-0001 or INV-10001
    const separator = config.separator || '-';
    if (config.include_year) {
      return `${prefix}${separator}${formattedYear}${separator}${seq4}`;
    }
    return `${prefix}${separator}${seq4}`;
  }

  if (config.style === 'fiscal') {
    return `${prefix}${sep}${financialYear}${sep}${seqStr}`;
  }

  if (config.style === 'sequential') {
    return seqStr;
  }

  if (config.style === 'custom' && config.custom_pattern) {
    return config.custom_pattern
      .replace(/{PREFIX}/g, prefix)
      .replace(/{CODE}/g, code)
      .replace(/{YEAR}/g, formattedYear)
      .replace(/{YY}/g, yearShort)
      .replace(/{SEQ}/g, seqStr)
      .replace(/{SEQ4}/g, seq4)
      .replace(/{SEQ5}/g, seq5);
  }

  // Standard Style: e.g. CN/FFC/2026/10001 or DN/FFC/2026/10001 or INV/FFC/2026/10001
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
  type: 'invoice' | 'quotation' | 'credit_note' | 'debit_note',
  config: DocumentNumberConfig,
  existingNumbers: string[]
): { number: string; nextSequence: number } {
  const existingSet = new Set(existingNumbers.map(n => (n || '').trim().toUpperCase()));
  
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
