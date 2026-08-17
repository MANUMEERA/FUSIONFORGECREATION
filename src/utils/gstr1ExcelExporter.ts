import * as XLSX from 'xlsx';
import { Invoice, CreditDebitNote, AgencyConfig } from '../types';
import { formatDateGstr1, formatDateDDMMYYYY } from './dateUtils';
import { formatPlaceOfSupply, getStateCodeByName, getStateNameByCode, INDIAN_STATES } from '../data/indianStates';

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

  const wb = XLSX.utils.book_new();

  // =========================================================================
  // 1. SHEET: b2b (B2B Tax Invoices for Registered Recipients)
  // =========================================================================
  const b2bRows: any[] = [];
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

    b2bRows.push({
      'GSTIN/UIN of Recipient': recipientGstin,
      'Receiver Name': receiverName,
      'Invoice Number': invoiceNumber,
      'Invoice Date': invoiceDate,
      'Invoice Value': invoiceValue,
      'Place Of Supply': pos,
      'Reverse Charge': reverseCharge,
      'Invoice Type': invType,
      'Rate': rate,
      'Taxable Value': taxableValue,
      'IGST': igst,
      'CGST': cgst,
      'SGST/UTGST': sgstUtgst
    });
  });

  const b2bSheet = XLSX.utils.json_to_sheet(b2bRows.length > 0 ? b2bRows : [{
    'GSTIN/UIN of Recipient': '',
    'Receiver Name': 'No B2B Invoices in selected period',
    'Invoice Number': '',
    'Invoice Date': '',
    'Invoice Value': 0,
    'Place Of Supply': '',
    'Reverse Charge': 'N',
    'Invoice Type': 'Regular',
    'Rate': 0,
    'Taxable Value': 0,
    'IGST': 0,
    'CGST': 0,
    'SGST/UTGST': 0
  }]);
  b2bSheet['!cols'] = [
    { wch: 18 }, // GSTIN
    { wch: 32 }, // Receiver Name
    { wch: 18 }, // Invoice Number
    { wch: 20 }, // Invoice Date (DD-MONTH NAME-YYYY)
    { wch: 15 }, // Invoice Value
    { wch: 35 }, // Place of Supply
    { wch: 14 }, // Reverse Charge
    { wch: 25 }, // Invoice Type
    { wch: 10 }, // Rate
    { wch: 15 }, // Taxable Value
    { wch: 14 }, // IGST
    { wch: 14 }, // CGST
    { wch: 14 }  // SGST/UTGST
  ];
  XLSX.utils.book_append_sheet(wb, b2bSheet, 'b2b');

  // =========================================================================
  // 2. SHEET: b2c (B2C / Unregistered Outward Supplies)
  // =========================================================================
  const b2cRows: any[] = [];
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

    b2cRows.push({
      'Type': 'OE',
      'Receiver Name': receiverName,
      'Invoice Number': invoiceNumber,
      'Invoice Date': invoiceDate,
      'Invoice Value': invoiceValue,
      'Place Of Supply': pos,
      'Rate': rate,
      'Taxable Value': taxableValue,
      'IGST': igst,
      'CGST': cgst,
      'SGST/UTGST': sgstUtgst,
      'Cess Amount': 0
    });
  });

  const b2cSheet = XLSX.utils.json_to_sheet(b2cRows.length > 0 ? b2cRows : [{
    'Type': 'OE',
    'Receiver Name': 'No B2C Invoices in selected period',
    'Invoice Number': '',
    'Invoice Date': '',
    'Invoice Value': 0,
    'Place Of Supply': '',
    'Rate': 0,
    'Taxable Value': 0,
    'IGST': 0,
    'CGST': 0,
    'SGST/UTGST': 0,
    'Cess Amount': 0
  }]);
  b2cSheet['!cols'] = [
    { wch: 10 }, // Type
    { wch: 30 }, // Receiver Name
    { wch: 18 }, // Invoice Number
    { wch: 20 }, // Invoice Date
    { wch: 15 }, // Invoice Value
    { wch: 35 }, // Place of Supply
    { wch: 10 }, // Rate
    { wch: 15 }, // Taxable Value
    { wch: 14 }, // IGST
    { wch: 14 }, // CGST
    { wch: 14 }, // SGST/UTGST
    { wch: 12 }  // Cess
  ];
  XLSX.utils.book_append_sheet(wb, b2cSheet, 'b2c');

  // =========================================================================
  // 3. SHEET: cdnr (Credit & Debit Notes Registered & Unregistered)
  // =========================================================================
  const cdnrRows: any[] = [];
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

    cdnrRows.push({
      'GSTIN/UIN of Recipient': recipientGstin,
      'Receiver Name': receiverName,
      'Note/Voucher Number': noteNumber,
      'Note Date': noteDate,
      'Note Type': noteType,
      'Original Invoice Number': origInvNumber,
      'Original Invoice Date': origInvDate,
      'Place Of Supply': pos,
      'Reverse Charge': reverseCharge,
      'Note Value': noteValue,
      'Rate': rate,
      'Taxable Value': taxableValue,
      'IGST': igst,
      'CGST': cgst,
      'SGST/UTGST': sgstUtgst,
      'Reason for Issuance': reason
    });
  });

  const cdnrSheet = XLSX.utils.json_to_sheet(cdnrRows.length > 0 ? cdnrRows : [{
    'GSTIN/UIN of Recipient': '',
    'Receiver Name': 'No Credit/Debit Notes in selected period',
    'Note/Voucher Number': '',
    'Note Date': '',
    'Note Type': 'Credit Note',
    'Original Invoice Number': '',
    'Original Invoice Date': '',
    'Place Of Supply': '',
    'Reverse Charge': 'N',
    'Note Value': 0,
    'Rate': 0,
    'Taxable Value': 0,
    'IGST': 0,
    'CGST': 0,
    'SGST/UTGST': 0,
    'Reason for Issuance': 'None'
  }]);
  cdnrSheet['!cols'] = [
    { wch: 18 }, // GSTIN
    { wch: 30 }, // Receiver Name
    { wch: 18 }, // Note Number
    { wch: 20 }, // Note Date
    { wch: 14 }, // Note Type
    { wch: 20 }, // Original Inv Num
    { wch: 20 }, // Original Inv Date
    { wch: 35 }, // Place of Supply
    { wch: 14 }, // Reverse Charge
    { wch: 14 }, // Note Value
    { wch: 10 }, // Rate
    { wch: 14 }, // Taxable Value
    { wch: 14 }, // IGST
    { wch: 14 }, // CGST
    { wch: 14 }, // SGST/UTGST
    { wch: 28 }  // Reason
  ];
  XLSX.utils.book_append_sheet(wb, cdnrSheet, 'cdnr');

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
    const isUt = (inv.utgstAmount || 0) > 0;

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

  const hsnRows: any[] = Object.values(hsnMap).map(h => ({
    'HSN': h.hsn,
    'Description': h.description,
    'UQC': h.uqc,
    'Total Quantity': h.totalQuantity,
    'Total Value': Math.round(h.totalValue * 100) / 100,
    'Rate': h.rate,
    'Taxable Value': Math.round(h.taxableValue * 100) / 100,
    'IGST': Math.round(h.igst * 100) / 100,
    'CGST': Math.round(h.cgst * 100) / 100,
    'SGST/UTGST': Math.round(h.sgstUtgst * 100) / 100
  }));

  const hsnSheet = XLSX.utils.json_to_sheet(hsnRows.length > 0 ? hsnRows : [{
    'HSN': '998314',
    'Description': 'Information Technology & Software Development Services',
    'UQC': 'OTH-OTHERS',
    'Total Quantity': 0,
    'Total Value': 0,
    'Rate': 18,
    'Taxable Value': 0,
    'IGST': 0,
    'CGST': 0,
    'SGST/UTGST': 0
  }]);
  hsnSheet['!cols'] = [
    { wch: 12 }, // HSN/SAC
    { wch: 45 }, // Description
    { wch: 15 }, // UQC
    { wch: 14 }, // Total Quantity
    { wch: 16 }, // Total Value
    { wch: 10 }, // Rate
    { wch: 16 }, // Taxable Value
    { wch: 14 }, // IGST
    { wch: 14 }, // CGST
    { wch: 14 }  // SGST/UTGST
  ];
  XLSX.utils.book_append_sheet(wb, hsnSheet, 'hsn');

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

  const cnFrom = creditNotes.length > 0 ? creditNotes[0].noteNumber : (creditNotes.length > 0 ? 'CN-2026-0001' : 'N/A');
  const cnTo = creditNotes.length > 0 ? creditNotes[creditNotes.length - 1].noteNumber : 'N/A';
  const totalCn = creditNotes.length;
  const cancelledCn = creditNotes.filter(c => c.status === 'cancelled').length;

  const dnFrom = debitNotes.length > 0 ? debitNotes[0].noteNumber : 'N/A';
  const dnTo = debitNotes.length > 0 ? debitNotes[debitNotes.length - 1].noteNumber : 'N/A';
  const totalDn = debitNotes.length;
  const cancelledDn = debitNotes.filter(d => d.status === 'cancelled').length;

  const docsRows: any[] = [
    {
      'Nature of Document': '1. Invoices for outward supply',
      'Sr. No. From': invFrom,
      'Sr. No. To': invTo,
      'Total Number': totalInvCount,
      'Cancelled': cancelledInvoices,
      'Net Issued': netIssuedInv
    },
    {
      'Nature of Document': '2. Credit Notes for outward supply',
      'Sr. No. From': cnFrom,
      'Sr. No. To': cnTo,
      'Total Number': totalCn,
      'Cancelled': cancelledCn,
      'Net Issued': totalCn - cancelledCn
    },
    {
      'Nature of Document': '3. Debit Notes for outward supply',
      'Sr. No. From': dnFrom,
      'Sr. No. To': dnTo,
      'Total Number': totalDn,
      'Cancelled': cancelledDn,
      'Net Issued': totalDn - cancelledDn
    }
  ];

  const docsSheet = XLSX.utils.json_to_sheet(docsRows);
  docsSheet['!cols'] = [
    { wch: 38 }, // Nature of Document
    { wch: 20 }, // From
    { wch: 20 }, // To
    { wch: 14 }, // Total Number
    { wch: 12 }, // Cancelled
    { wch: 14 }  // Net Issued
  ];
  XLSX.utils.book_append_sheet(wb, docsSheet, 'docs');

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

  const summaryData = [
    ['FUSION FORGE CREATIONS — STATUTORY GST REPORTING SUMMARY'],
    ['Generated Under Authority of Goods & Services Tax Rules, India'],
    [''],
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
    [''],
    ['STATUTORY OUTWARD SUMMARY (GSTR-1 RECONCILIATION)'],
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
    [''],
    ['GSTR-3B TABLE 3.1 NET RECONCILIATION'],
    ['Net Taxable Value (Invoices - CN + DN) (₹)', netGstr3bTaxable],
    ['Net Tax Payable to Govt (Invoices - CN + DN) (₹)', netGstr3bTax]
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  summarySheet['!cols'] = [{ wch: 45 }, { wch: 45 }];
  XLSX.utils.book_append_sheet(wb, summarySheet, 'summary');

  // Generate File Name: GSTR1_<GSTIN>_<Period>_<Timestamp>.xlsx
  const safeGstin = (agency?.gstin || '26AABCF1234F1Z5').replace(/[^a-zA-Z0-9]/g, '');
  const safePeriod = options.periodLabel.replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileName = `GSTR1_${safeGstin}_${safePeriod}.xlsx`;

  XLSX.writeFile(wb, fileName);

  return {
    fileName,
    totalInvoices: activeInvoices.length,
    totalTaxable,
    totalTax
  };
}
