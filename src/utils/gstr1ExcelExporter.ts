import writeExcelFile from 'write-excel-file/universal';
import { Invoice, CreditDebitNote, AgencyConfig } from '../types';
import { formatDateGstr1, formatDateDDMMYYYY } from './dateUtils';
import { getStateCodeByName, getStateNameByCode, INDIAN_STATES } from '../data/indianStates';

export interface Gstr1ExportOptions {
  periodLabel: string;
  dateRangeType: string;
  startDate: string;
  endDate: string;
  agencyConfig?: AgencyConfig;
}

/**
 * Normalizes Place of Supply to GST standard format: "<code>-<State Name>"
 * e.g. "24-Gujarat", "26-Dadra and Nagar Haveli and Daman and Diu", "03-Punjab", "27-Maharashtra"
 */
export function getStandardGstPlaceOfSupply(stateNameOrCode?: string, fallbackBuyerState?: string): string {
  if (!stateNameOrCode && !fallbackBuyerState) return '26-Dadra and Nagar Haveli and Daman and Diu';
  
  const raw = (stateNameOrCode || fallbackBuyerState || '').trim();

  // If already formatted like "24-Gujarat" or "03 - Punjab"
  const dashMatch = raw.match(/^(\d{1,2})\s*-\s*(.+)$/);
  if (dashMatch) {
    const code = dashMatch[1].padStart(2, '0');
    const stateObj = INDIAN_STATES.find(s => s.code === code);
    const name = stateObj ? stateObj.name : dashMatch[2].trim();
    return `${code}-${name}`;
  }

  // If raw is just code digits e.g. "24" or "03"
  const digitsMatch = raw.match(/^(\d{1,2})$/);
  if (digitsMatch) {
    const code = digitsMatch[1].padStart(2, '0');
    const stateObj = INDIAN_STATES.find(s => s.code === code);
    return stateObj ? `${code}-${stateObj.name}` : `${code}-Unknown`;
  }

  // Bracket format like "Gujarat [24]"
  const bracketMatch = raw.match(/\[(\d{1,2})\]/);
  if (bracketMatch) {
    const code = bracketMatch[1].padStart(2, '0');
    const stateObj = INDIAN_STATES.find(s => s.code === code);
    return stateObj ? `${code}-${stateObj.name}` : `${code}-State`;
  }

  // Search by state name
  const code = getStateCodeByName(raw);
  if (code) {
    const name = getStateNameByCode(code);
    return `${code}-${name}`;
  }

  return '26-Dadra and Nagar Haveli and Daman and Diu';
}

/**
 * Determines whether recipient has a valid GSTIN for B2B vs B2C classification
 */
export function isB2BRecipient(gstin?: string | null): boolean {
  if (!gstin) return false;
  const clean = gstin.trim().toUpperCase();
  // Valid GSTIN is 15 characters alphanumeric
  return clean.length === 15 && clean !== 'N/A' && clean !== 'UNREGISTERED' && clean !== 'NONE';
}

/**
 * Normalizes reverse charge flag to 'Y' or 'N'
 */
export function getReverseChargeFlag(rc?: 'Yes' | 'No' | boolean | string): 'Y' | 'N' {
  if (rc === true || rc === 'Yes' || rc === 'YES' || rc === 'Y') return 'Y';
  return 'N';
}

/**
 * Maps invoice type to official GSTR-1 invoice type description
 */
export function getGstr1InvoiceType(invoice: Invoice): string {
  if (invoice.invoiceType === 'SEZ Supply without Tax') {
    return 'SEZ supplies without payment';
  }
  if (invoice.invoiceType === 'SEZ Supply with Tax') {
    return 'SEZ supplies with payment';
  }
  if (invoice.invoiceType === 'Deemed Exports') {
    return 'Deemed Exp';
  }
  return 'Regular';
}

/**
 * Trigger download of blob in browser
 */
async function downloadExcelBlob(sheets: any[], fileName: string) {
  try {
    const blob = await writeExcelFile(sheets).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating Excel file:', error);
  }
}

/**
 * Generates and downloads the official Sequence-Based GSTR-1 Excel Workbook with 5 sheets + Audit Summary
 */
export function exportGstr1Workbook(
  invoices: Invoice[],
  creditDebitNotes: CreditDebitNote[] = [],
  options: Gstr1ExportOptions
): { fileName: string; totalInvoices: number; totalTaxable: number; totalTax: number } {
  // Filter out soft-deleted records and non-billable drafts if desired, but keep cancelled for DOCS reconciliation
  const activeInvoices = invoices.filter(inv => !inv.isDeleted && inv.status !== 'draft');
  const activeNotes = creditDebitNotes.filter(cn => !cn.isDeleted && cn.status !== 'draft');

  // Separate B2B (with GSTIN) and B2C (without GSTIN / Unregistered)
  const b2bInvoices = activeInvoices.filter(inv => isB2BRecipient(inv.buyerGstin || inv.clientGstin));
  const b2cInvoices = activeInvoices.filter(inv => !isB2BRecipient(inv.buyerGstin || inv.clientGstin));

  // =========================================================================
  // 1. SHEET: b2b (B2B Tax Invoices for Registered Recipients)
  // =========================================================================
  const b2bHeaders = [
    'GSTIN/UIN of Recipient',
    'Receiver Name',
    'Invoice Number',
    'Invoice Date',
    'Invoice Value',
    'Place Of Supply',
    'Reverse Charge',
    'Invoice Type',
    'Rate',
    'Taxable Value',
    'IGST',
    'CGST',
    'SGST/UTGST'
  ];

  const b2bRows: any[][] = [
    b2bHeaders.map(h => ({ value: h, fontWeight: 'bold' }))
  ];

  if (b2bInvoices.length > 0) {
    b2bInvoices.forEach(inv => {
      const recipientGstin = (inv.buyerGstin || inv.clientGstin || '').trim().toUpperCase();
      const receiverName = inv.buyerCompany || inv.clientCompany || inv.clientName || 'Registered Client';
      const invoiceNumber = inv.invoiceNumber || inv.invoice_number || 'INV-001';
      const invoiceDate = formatDateGstr1(inv.issueDate || inv.issue_date);
      const invoiceValue = Number(inv.totalAmount || inv.grand_total || 0);
      const pos = getStandardGstPlaceOfSupply(inv.placeOfSupply || inv.place_of_supply, inv.buyerState);
      const reverseCharge = getReverseChargeFlag(inv.reverseCharge || inv.reverse_charge);
      const invType = getGstr1InvoiceType(inv);
      const rate = inv.gstRate !== undefined ? inv.gstRate : 18;
      const taxableValue = Number(inv.taxableAmount || inv.taxable_amount || 0);
      const igst = Number(inv.igstAmount || inv.igst_amount || 0);
      const cgst = Number(inv.cgstAmount || inv.cgst_amount || 0);
      const sgstUtgst = Number((inv.sgstAmount || inv.sgst_amount || 0) + (inv.utgstAmount || inv.utgst_amount || 0));

      b2bRows.push([
        { value: recipientGstin, type: String },
        { value: receiverName, type: String },
        { value: invoiceNumber, type: String },
        { value: invoiceDate, type: String },
        { value: invoiceValue, type: Number },
        { value: pos, type: String },
        { value: reverseCharge, type: String },
        { value: invType, type: String },
        { value: rate, type: Number },
        { value: taxableValue, type: Number },
        { value: igst, type: Number },
        { value: cgst, type: Number },
        { value: sgstUtgst, type: Number }
      ]);
    });
  } else {
    b2bRows.push([
      { value: '', type: String },
      { value: 'No B2B Invoices in selected period', type: String },
      { value: '', type: String },
      { value: '', type: String },
      { value: 0, type: Number },
      { value: '', type: String },
      { value: 'N', type: String },
      { value: 'Regular', type: String },
      { value: 0, type: Number },
      { value: 0, type: Number },
      { value: 0, type: Number },
      { value: 0, type: Number },
      { value: 0, type: Number }
    ]);
  }

  const b2bColumns = [
    { width: 18 },
    { width: 32 },
    { width: 18 },
    { width: 20 },
    { width: 15 },
    { width: 35 },
    { width: 14 },
    { width: 25 },
    { width: 10 },
    { width: 15 },
    { width: 14 },
    { width: 14 },
    { width: 14 }
  ];

  // =========================================================================
  // 2. SHEET: b2c (B2C / Unregistered Outward Supplies)
  // =========================================================================
  const b2cHeaders = [
    'Type',
    'Receiver Name',
    'Invoice Number',
    'Invoice Date',
    'Invoice Value',
    'Place Of Supply',
    'Rate',
    'Taxable Value',
    'IGST',
    'CGST',
    'SGST/UTGST',
    'Cess Amount'
  ];

  const b2cRows: any[][] = [
    b2cHeaders.map(h => ({ value: h, fontWeight: 'bold' }))
  ];

  if (b2cInvoices.length > 0) {
    b2cInvoices.forEach(inv => {
      const receiverName = inv.buyerCompany || inv.clientCompany || inv.clientName || 'Direct Consumer';
      const invoiceNumber = inv.invoiceNumber || inv.invoice_number || 'INV-001';
      const invoiceDate = formatDateGstr1(inv.issueDate || inv.issue_date);
      const invoiceValue = Number(inv.totalAmount || inv.grand_total || 0);
      const pos = getStandardGstPlaceOfSupply(inv.placeOfSupply || inv.place_of_supply, inv.buyerState);
      const rate = inv.gstRate !== undefined ? inv.gstRate : 18;
      const taxableValue = Number(inv.taxableAmount || inv.taxable_amount || 0);
      const igst = Number(inv.igstAmount || inv.igst_amount || 0);
      const cgst = Number(inv.cgstAmount || inv.cgst_amount || 0);
      const sgstUtgst = Number((inv.sgstAmount || inv.sgst_amount || 0) + (inv.utgstAmount || inv.utgst_amount || 0));

      b2cRows.push([
        { value: 'OE', type: String },
        { value: receiverName, type: String },
        { value: invoiceNumber, type: String },
        { value: invoiceDate, type: String },
        { value: invoiceValue, type: Number },
        { value: pos, type: String },
        { value: rate, type: Number },
        { value: taxableValue, type: Number },
        { value: igst, type: Number },
        { value: cgst, type: Number },
        { value: sgstUtgst, type: Number },
        { value: 0, type: Number }
      ]);
    });
  } else {
    b2cRows.push([
      { value: 'OE', type: String },
      { value: 'No B2C Invoices in selected period', type: String },
      { value: '', type: String },
      { value: '', type: String },
      { value: 0, type: Number },
      { value: '', type: String },
      { value: 0, type: Number },
      { value: 0, type: Number },
      { value: 0, type: Number },
      { value: 0, type: Number },
      { value: 0, type: Number },
      { value: 0, type: Number }
    ]);
  }

  const b2cColumns = [
    { width: 10 },
    { width: 30 },
    { width: 18 },
    { width: 20 },
    { width: 15 },
    { width: 35 },
    { width: 10 },
    { width: 15 },
    { width: 14 },
    { width: 14 },
    { width: 14 },
    { width: 12 }
  ];

  // =========================================================================
  // 3. SHEET: cdnr (Credit & Debit Notes Registered & Unregistered)
  // =========================================================================
  const cdnrHeaders = [
    'GSTIN/UIN of Recipient',
    'Receiver Name',
    'Note/Voucher Number',
    'Note Date',
    'Note Type',
    'Original Invoice Number',
    'Original Invoice Date',
    'Place Of Supply',
    'Reverse Charge',
    'Note Value',
    'Rate',
    'Taxable Value',
    'IGST',
    'CGST',
    'SGST/UTGST',
    'Reason for Issuance'
  ];

  const cdnrRows: any[][] = [
    cdnrHeaders.map(h => ({ value: h, fontWeight: 'bold' }))
  ];

  if (activeNotes.length > 0) {
    activeNotes.forEach(note => {
      const recipientGstin = (note.clientGstin || '').trim().toUpperCase() || 'UNREGISTERED';
      const receiverName = note.clientCompany || note.clientName || 'Client';
      const noteNumber = note.noteNumber || note.note_number || 'CN-001';
      const noteDate = formatDateGstr1(note.issueDate || note.issue_date);
      const noteType = note.noteType === 'credit' ? 'Credit Note' : 'Debit Note';
      const origInvNumber = note.invoiceNumber || note.invoice_number || 'N/A';
      const origInvDate = note.invoiceDate ? formatDateGstr1(note.invoiceDate) : 'N/A';
      const pos = getStandardGstPlaceOfSupply(note.placeOfSupply || note.place_of_supply, note.buyerState);
      const reverseCharge = getReverseChargeFlag(note.reverseCharge || note.reverse_charge);
      const noteValue = Number(note.totalAmount || note.total_amount || 0);
      const rate = note.gstRate !== undefined ? note.gstRate : 18;
      const taxableValue = Number(note.taxableAmount || note.taxable_amount || 0);
      const igst = Number(note.igstAmount || note.igst_amount || 0);
      const cgst = Number(note.cgstAmount || note.cgst_amount || 0);
      const sgstUtgst = Number((note.sgstAmount || note.sgst_amount || 0) + (note.utgstAmount || note.utgst_amount || 0));
      const reason = note.reason || '04-Correction in Invoice';

      cdnrRows.push([
        { value: recipientGstin, type: String },
        { value: receiverName, type: String },
        { value: noteNumber, type: String },
        { value: noteDate, type: String },
        { value: noteType, type: String },
        { value: origInvNumber, type: String },
        { value: origInvDate, type: String },
        { value: pos, type: String },
        { value: reverseCharge, type: String },
        { value: noteValue, type: Number },
        { value: rate, type: Number },
        { value: taxableValue, type: Number },
        { value: igst, type: Number },
        { value: cgst, type: Number },
        { value: sgstUtgst, type: Number },
        { value: reason, type: String }
      ]);
    });
  } else {
    cdnrRows.push([
      { value: '', type: String },
      { value: 'No Credit/Debit Notes in selected period', type: String },
      { value: '', type: String },
      { value: '', type: String },
      { value: 'Credit Note', type: String },
      { value: '', type: String },
      { value: '', type: String },
      { value: '', type: String },
      { value: 'N', type: String },
      { value: 0, type: Number },
      { value: 0, type: Number },
      { value: 0, type: Number },
      { value: 0, type: Number },
      { value: 0, type: Number },
      { value: 0, type: Number },
      { value: 'None', type: String }
    ]);
  }

  const cdnrColumns = [
    { width: 18 },
    { width: 30 },
    { width: 18 },
    { width: 20 },
    { width: 14 },
    { width: 20 },
    { width: 20 },
    { width: 35 },
    { width: 14 },
    { width: 14 },
    { width: 10 },
    { width: 14 },
    { width: 14 },
    { width: 14 },
    { width: 14 },
    { width: 28 }
  ];

  // =========================================================================
  // 4. SHEET: hsn (HSN / SAC Summary of Outward Supplies)
  // =========================================================================
  const hsnMap: { [hsnKey: string]: {
    hsn: string;
    description: string;
    uqc: string;
    totalQuantity: number;
    totalValue: number;
    rate: number;
    taxableValue: number;
    igst: number;
    cgst: number;
    sgstUtgst: number;
  } } = {};

  activeInvoices.forEach(inv => {
    const invGstRate = inv.gstRate !== undefined ? inv.gstRate : 18;
    const isInter = (inv.igstAmount || 0) > 0;

    (inv.items || []).forEach(item => {
      const hsnCode = item.sacCode || (item as any).sac_code || '998314';
      const key = `${hsnCode}_${invGstRate}`;
      const lineQty = Number(item.quantity) || 1;
      const lineTaxable = Number(item.amount || (item.quantity * item.rate) || 0);
      
      let itemIgst = 0;
      let itemCgst = 0;
      let itemSgstUtgst = 0;

      if (inv.invoiceType === 'SEZ Supply without Tax') {
        // 0 tax
      } else if (isInter) {
        itemIgst = Math.round((lineTaxable * invGstRate) / 100 * 100) / 100;
      } else {
        const half = invGstRate / 2;
        itemCgst = Math.round((lineTaxable * half) / 100 * 100) / 100;
        itemSgstUtgst = Math.round((lineTaxable * half) / 100 * 100) / 100;
      }

      const itemTotalValue = lineTaxable + itemIgst + itemCgst + itemSgstUtgst;

      if (!hsnMap[key]) {
        hsnMap[key] = {
          hsn: hsnCode,
          description: item.description || 'Information Technology & Software Development Services',
          uqc: 'OTH-OTHERS',
          totalQuantity: 0,
          totalValue: 0,
          rate: invGstRate,
          taxableValue: 0,
          igst: 0,
          cgst: 0,
          sgstUtgst: 0
        };
      }

      hsnMap[key].totalQuantity += lineQty;
      hsnMap[key].totalValue += itemTotalValue;
      hsnMap[key].taxableValue += lineTaxable;
      hsnMap[key].igst += itemIgst;
      hsnMap[key].cgst += itemCgst;
      hsnMap[key].sgstUtgst += itemSgstUtgst;
    });
  });

  const hsnHeaders = [
    'HSN',
    'Description',
    'UQC',
    'Total Quantity',
    'Total Value',
    'Rate',
    'Taxable Value',
    'IGST',
    'CGST',
    'SGST/UTGST'
  ];

  const hsnRows: any[][] = [
    hsnHeaders.map(h => ({ value: h, fontWeight: 'bold' }))
  ];

  const hsnList = Object.values(hsnMap);
  if (hsnList.length > 0) {
    hsnList.forEach(h => {
      hsnRows.push([
        { value: h.hsn, type: String },
        { value: h.description, type: String },
        { value: h.uqc, type: String },
        { value: h.totalQuantity, type: Number },
        { value: Math.round(h.totalValue * 100) / 100, type: Number },
        { value: h.rate, type: Number },
        { value: Math.round(h.taxableValue * 100) / 100, type: Number },
        { value: Math.round(h.igst * 100) / 100, type: Number },
        { value: Math.round(h.cgst * 100) / 100, type: Number },
        { value: Math.round(h.sgstUtgst * 100) / 100, type: Number }
      ]);
    });
  } else {
    hsnRows.push([
      { value: '998314', type: String },
      { value: 'Information Technology & Software Development Services', type: String },
      { value: 'OTH-OTHERS', type: String },
      { value: 0, type: Number },
      { value: 0, type: Number },
      { value: 18, type: Number },
      { value: 0, type: Number },
      { value: 0, type: Number },
      { value: 0, type: Number },
      { value: 0, type: Number }
    ]);
  }

  const hsnColumns = [
    { width: 12 },
    { width: 45 },
    { width: 15 },
    { width: 14 },
    { width: 16 },
    { width: 10 },
    { width: 16 },
    { width: 14 },
    { width: 14 },
    { width: 14 }
  ];

  // =========================================================================
  // 5. SHEET: docs (Document Sequences & Summaries)
  // =========================================================================
  const allInvoices = invoices.filter(inv => !inv.isDeleted);
  const sortedInvoices = [...allInvoices].sort((a, b) => (a.invoiceNumber || '').localeCompare(b.invoiceNumber || ''));
  const cancelledInvoices = sortedInvoices.filter(i => i.status === 'cancelled').length;

  const invFrom = sortedInvoices.length > 0 ? sortedInvoices[0].invoiceNumber : 'FFC-2026-0001';
  const invTo = sortedInvoices.length > 0 ? sortedInvoices[sortedInvoices.length - 1].invoiceNumber : 'FFC-2026-0001';
  const totalInvCount = sortedInvoices.length;
  const netIssuedInv = totalInvCount - cancelledInvoices;

  const creditNotes = activeNotes.filter(n => n.noteType === 'credit');
  const debitNotes = activeNotes.filter(n => n.noteType === 'debit');

  const cnFrom = creditNotes.length > 0 ? creditNotes[0].noteNumber : 'N/A';
  const cnTo = creditNotes.length > 0 ? creditNotes[creditNotes.length - 1].noteNumber : 'N/A';
  const totalCn = creditNotes.length;
  const cancelledCn = creditNotes.filter(c => c.status === 'cancelled').length;

  const dnFrom = debitNotes.length > 0 ? debitNotes[0].noteNumber : 'N/A';
  const dnTo = debitNotes.length > 0 ? debitNotes[debitNotes.length - 1].noteNumber : 'N/A';
  const totalDn = debitNotes.length;
  const cancelledDn = debitNotes.filter(d => d.status === 'cancelled').length;

  const docsHeaders = [
    'Nature of Document',
    'Sr. No. From',
    'Sr. No. To',
    'Total Number',
    'Cancelled',
    'Net Issued'
  ];

  const docsRows: any[][] = [
    docsHeaders.map(h => ({ value: h, fontWeight: 'bold' })),
    [
      { value: '1. Invoices for outward supply', type: String },
      { value: invFrom, type: String },
      { value: invTo, type: String },
      { value: totalInvCount, type: Number },
      { value: cancelledInvoices, type: Number },
      { value: netIssuedInv, type: Number }
    ],
    [
      { value: '2. Credit Notes for outward supply', type: String },
      { value: cnFrom, type: String },
      { value: cnTo, type: String },
      { value: totalCn, type: Number },
      { value: cancelledCn, type: Number },
      { value: totalCn - cancelledCn, type: Number }
    ],
    [
      { value: '3. Debit Notes for outward supply', type: String },
      { value: dnFrom, type: String },
      { value: dnTo, type: String },
      { value: totalDn, type: Number },
      { value: cancelledDn, type: Number },
      { value: totalDn - cancelledDn, type: Number }
    ]
  ];

  const docsColumns = [
    { width: 38 },
    { width: 20 },
    { width: 20 },
    { width: 14 },
    { width: 12 },
    { width: 14 }
  ];

  // =========================================================================
  // 6. SHEET: summary (Formal Audit & Reconciliation Sheet)
  // =========================================================================
  const agency = options.agencyConfig;
  const generationTimestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  
  const totalTaxable = activeInvoices.reduce((sum, i) => sum + (i.taxableAmount || 0), 0);
  const totalIgst = activeInvoices.reduce((sum, i) => sum + (i.igstAmount || 0), 0);
  const totalCgst = activeInvoices.reduce((sum, i) => sum + (i.cgstAmount || 0), 0);
  const totalSgstUtgst = activeInvoices.reduce((sum, i) => sum + (i.sgstAmount || 0) + (i.utgstAmount || 0), 0);
  const totalTax = totalIgst + totalCgst + totalSgstUtgst;
  const grandTotalValue = activeInvoices.reduce((sum, i) => sum + (i.totalAmount || 0), 0);

  const totalCnTaxable = creditNotes.reduce((sum, c) => sum + (c.taxableAmount || 0), 0);
  const totalCnTax = creditNotes.reduce((sum, c) => sum + (c.totalTax || (c.cgstAmount + c.sgstAmount + c.igstAmount) || 0), 0);

  const totalDnTaxable = debitNotes.reduce((sum, d) => sum + (d.taxableAmount || 0), 0);
  const totalDnTax = debitNotes.reduce((sum, d) => sum + (d.totalTax || (d.cgstAmount + d.sgstAmount + d.igstAmount) || 0), 0);

  const netGstr3bTaxable = totalTaxable - totalCnTaxable + totalDnTaxable;
  const netGstr3bTax = totalTax - totalCnTax + totalDnTax;

  const summaryRawData = [
    ['FUSION FORGE CREATIONS — STATUTORY GST REPORTING SUMMARY', ''],
    ['Generated Under Authority of Goods & Services Tax Rules, India', ''],
    ['', ''],
    ['Report Attribute', 'Configuration / Value'],
    ['Taxpayer Legal Name', agency?.legal_name || 'Fusion Forge Creations Private Limited'],
    ['Taxpayer Trade Name', agency?.trade_name || agency?.name || 'Fusion Forge Creations'],
    ['GSTIN of Supplier', agency?.gstin || '26AABCF1234F1Z5'],
    ['PAN of Supplier', agency?.pan || 'AABCF1234F'],
    ['Place of Business / POS', '26-Dadra and Nagar Haveli and Daman and Diu'],
    ['Reporting Date Range', options.periodLabel],
    ['Date Range Filter Type', options.dateRangeType.toUpperCase()],
    ['Filter Start Date', options.startDate],
    ['Filter End Date', options.endDate],
    ['Report Generation Timestamp', `${generationTimestamp} IST`],
    ['Active LUT ARN for SEZ/Export', agency?.lutNumber || 'AD260426001234F (Valid FY 2026-27)'],
    ['', ''],
    ['STATUTORY OUTWARD SUMMARY (GSTR-1 RECONCILIATION)', ''],
    ['Metric', 'Count / Value (₹ INR)'],
    ['Total B2B Invoices (Table 4)', b2bInvoices.length],
    ['Total B2C Invoices (Table 7)', b2cInvoices.length],
    ['Total Credit Notes Issued (Table 9B)', creditNotes.length],
    ['Total Debit Notes Issued (Table 9B)', debitNotes.length],
    ['Gross Invoiced Value (₹)', grandTotalValue],
    ['Gross Taxable Value of Outward Supplies (₹)', totalTaxable],
    ['Total IGST Outward (₹)', totalIgst],
    ['Total CGST Outward (₹)', totalCgst],
    ['Total SGST / UTGST Outward (₹)', totalSgstUtgst],
    ['Total Tax Liability on Outward Supplies (₹)', totalTax],
    ['', ''],
    ['GSTR-3B TABLE 3.1 NET RECONCILIATION', ''],
    ['Net Taxable Value (Invoices - CN + DN) (₹)', netGstr3bTaxable],
    ['Net Tax Payable to Govt (Invoices - CN + DN) (₹)', netGstr3bTax]
  ];

  const summaryRows: any[][] = summaryRawData.map((row, idx) => {
    const isHeading = idx === 0 || idx === 3 || idx === 16 || idx === 17 || idx === 29;
    return [
      { value: row[0], type: String, fontWeight: isHeading ? 'bold' : undefined },
      { value: typeof row[1] === 'number' ? row[1] : String(row[1] || ''), type: typeof row[1] === 'number' ? Number : String, fontWeight: isHeading ? 'bold' : undefined }
    ];
  });

  const summaryColumns = [
    { width: 45 },
    { width: 45 }
  ];

  // Generate File Name: GSTR1_<GSTIN>_<Period>_<Timestamp>.xlsx
  const safeGstin = (agency?.gstin || '26AABCF1234F1Z5').replace(/[^a-zA-Z0-9]/g, '');
  const safePeriod = options.periodLabel.replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileName = `GSTR1_${safeGstin}_${safePeriod}.xlsx`;

  const sheetsPayload = [
    {
      data: b2bRows,
      sheet: 'b2b',
      columns: b2bColumns
    },
    {
      data: b2cRows,
      sheet: 'b2c',
      columns: b2cColumns
    },
    {
      data: cdnrRows,
      sheet: 'cdnr',
      columns: cdnrColumns
    },
    {
      data: hsnRows,
      sheet: 'hsn',
      columns: hsnColumns
    },
    {
      data: docsRows,
      sheet: 'docs',
      columns: docsColumns
    },
    {
      data: summaryRows,
      sheet: 'summary',
      columns: summaryColumns
    }
  ];

  // Initiate download via browser
  downloadExcelBlob(sheetsPayload, fileName);

  return {
    fileName,
    totalInvoices: activeInvoices.length,
    totalTaxable,
    totalTax
  };
}
