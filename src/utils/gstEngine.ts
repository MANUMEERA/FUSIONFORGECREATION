import { numberToWordsIndian } from './numberToWords';
import { GSTType } from '../types';

export interface IndianState {
  code: string;
  name: string;
  isUnionTerritoryWithoutLegislature: boolean;
  selectable: boolean;
  isLegacy?: boolean;
  notes?: string;
}

// Complete Indian GST State Master (Exact official table with legacy support)
export const INDIAN_GST_STATES: IndianState[] = [
  { code: '01', name: 'Jammu and Kashmir', isUnionTerritoryWithoutLegislature: false, selectable: true },
  { code: '02', name: 'Himachal Pradesh', isUnionTerritoryWithoutLegislature: false, selectable: true },
  { code: '03', name: 'Punjab', isUnionTerritoryWithoutLegislature: false, selectable: true },
  { code: '04', name: 'Chandigarh', isUnionTerritoryWithoutLegislature: true, selectable: true },
  { code: '05', name: 'Uttarakhand', isUnionTerritoryWithoutLegislature: false, selectable: true },
  { code: '06', name: 'Haryana', isUnionTerritoryWithoutLegislature: false, selectable: true },
  { code: '07', name: 'Delhi', isUnionTerritoryWithoutLegislature: false, selectable: true },
  { code: '08', name: 'Rajasthan', isUnionTerritoryWithoutLegislature: false, selectable: true },
  { code: '09', name: 'Uttar Pradesh', isUnionTerritoryWithoutLegislature: false, selectable: true },
  { code: '10', name: 'Bihar', isUnionTerritoryWithoutLegislature: false, selectable: true },
  { code: '11', name: 'Sikkim', isUnionTerritoryWithoutLegislature: false, selectable: true },
  { code: '12', name: 'Arunachal Pradesh', isUnionTerritoryWithoutLegislature: false, selectable: true },
  { code: '13', name: 'Nagaland', isUnionTerritoryWithoutLegislature: false, selectable: true },
  { code: '14', name: 'Manipur', isUnionTerritoryWithoutLegislature: false, selectable: true },
  { code: '15', name: 'Mizoram', isUnionTerritoryWithoutLegislature: false, selectable: true },
  { code: '16', name: 'Tripura', isUnionTerritoryWithoutLegislature: false, selectable: true },
  { code: '17', name: 'Meghalaya', isUnionTerritoryWithoutLegislature: false, selectable: true },
  { code: '18', name: 'Assam', isUnionTerritoryWithoutLegislature: false, selectable: true },
  { code: '19', name: 'West Bengal', isUnionTerritoryWithoutLegislature: false, selectable: true },
  { code: '20', name: 'Jharkhand', isUnionTerritoryWithoutLegislature: false, selectable: true },
  { code: '21', name: 'Odisha', isUnionTerritoryWithoutLegislature: false, selectable: true },
  { code: '22', name: 'Chhattisgarh', isUnionTerritoryWithoutLegislature: false, selectable: true },
  { code: '23', name: 'Madhya Pradesh', isUnionTerritoryWithoutLegislature: false, selectable: true },
  { code: '24', name: 'Gujarat', isUnionTerritoryWithoutLegislature: false, selectable: true },
  { code: '25', name: 'Daman and Diu (Legacy)', isUnionTerritoryWithoutLegislature: true, selectable: false, isLegacy: true, notes: 'Merged with 26 Dadra and Nagar Haveli and Daman and Diu' },
  { code: '26', name: 'Dadra and Nagar Haveli and Daman and Diu', isUnionTerritoryWithoutLegislature: true, selectable: true },
  { code: '27', name: 'Maharashtra', isUnionTerritoryWithoutLegislature: false, selectable: true },
  { code: '28', name: 'Andhra Pradesh (Old)', isUnionTerritoryWithoutLegislature: false, selectable: false, isLegacy: true, notes: 'Bifurcated into 36 Telangana and 37 Andhra Pradesh' },
  { code: '29', name: 'Karnataka', isUnionTerritoryWithoutLegislature: false, selectable: true },
  { code: '30', name: 'Goa', isUnionTerritoryWithoutLegislature: false, selectable: true },
  { code: '31', name: 'Lakshadweep', isUnionTerritoryWithoutLegislature: true, selectable: true },
  { code: '32', name: 'Kerala', isUnionTerritoryWithoutLegislature: false, selectable: true },
  { code: '33', name: 'Tamil Nadu', isUnionTerritoryWithoutLegislature: false, selectable: true },
  { code: '34', name: 'Puducherry', isUnionTerritoryWithoutLegislature: false, selectable: true },
  { code: '35', name: 'Andaman and Nicobar Islands', isUnionTerritoryWithoutLegislature: true, selectable: true },
  { code: '36', name: 'Telangana', isUnionTerritoryWithoutLegislature: false, selectable: true },
  { code: '37', name: 'Andhra Pradesh', isUnionTerritoryWithoutLegislature: false, selectable: true },
  { code: '38', name: 'Ladakh', isUnionTerritoryWithoutLegislature: true, selectable: true },
  { code: '97', name: 'Other Territory', isUnionTerritoryWithoutLegislature: true, selectable: true }
];

// Union Territories without separate state legislature where UTGST applies
export const UT_WITHOUT_LEGISLATURE_CODES = new Set(['04', '25', '26', '31', '35', '38', '97']);

/**
 * Extracts a normalized 2-digit GST state code from any string (e.g. "26", "26 - Dadra...", "Gujarat [24]", "21-Odisha")
 */
export function extractStateCode(input: string | undefined | null): string {
  if (!input) return '21'; // Default Odisha
  const str = input.trim();
  
  // Look for bracketed code like [24] or [26]
  const bracketMatch = str.match(/\[(\d{1,2})\]/);
  if (bracketMatch) {
    return bracketMatch[1].padStart(2, '0');
  }

  // Look for leading digits like "26 - Dadra..." or "26"
  const leadingMatch = str.match(/^(\d{1,2})/);
  if (leadingMatch) {
    return leadingMatch[1].padStart(2, '0');
  }

  // Match state name
  const lower = str.toLowerCase();
  const found = INDIAN_GST_STATES.find(s => lower.includes(s.name.toLowerCase()));
  if (found) return found.code;

  return '21';
}

export function getStateDetails(codeOrName: string): IndianState {
  const code = extractStateCode(codeOrName);
  const found = INDIAN_GST_STATES.find(s => s.code === code);
  return found || {
    code,
    name: 'Unknown Territory',
    isUnionTerritoryWithoutLegislature: UT_WITHOUT_LEGISLATURE_CODES.has(code),
    selectable: true,
    isLegacy: false
  };
}

export interface GstLineItemInput {
  description?: string;
  sacCode?: string;
  quantity: number;
  rate: number;
  amount?: number;
}

export interface GstCalculationParams {
  sellerStateCode: string;
  buyerStateCode: string;
  items: GstLineItemInput[];
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  gstRate?: number; // default 18
  currency?: 'INR' | 'USD' | 'EUR';
  overrideGstType?: GSTType; // Optional manual override, e.g. for tax-exempt exports
  invoiceType?: 'Regular' | 'SEZ Supply with Tax' | 'SEZ Supply without Tax' | 'Deemed Exports';
  lutArn?: string;
}

export interface GstCalculationResult {
  // Line items with computed amounts
  computedItems: Array<{
    description: string;
    sacCode: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  
  subtotal: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  taxableAmount: number;
  
  // Tax determinations
  sellerState: IndianState;
  buyerState: IndianState;
  isInterState: boolean;
  isIntraState: boolean;
  isUnionTerritory: boolean;
  
  supplyType: 'INTRA_STATE' | 'INTER_STATE' | 'EXEMPT';
  gstType: GSTType; // 'cgst_sgst' | 'cgst_utgst' | 'igst' | 'none'
  gstRate: number;
  taxLabel: string; // e.g. "CGST + UTGST", "CGST + SGST", "IGST", or "Tax Exempt"
  invoiceType: 'Regular' | 'SEZ Supply with Tax' | 'SEZ Supply without Tax' | 'Deemed Exports';
  lutArn?: string;
  
  // Breakdown amounts
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  utgstRate: number;
  utgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalTaxAmount: number;
  
  // Final Totals
  grandTotal: number;
  amountInWords: string;
  
  // Authoritative metadata
  authoritativeSource: string;
  generatedAt: string;
}

/**
 * AUTHORITATIVE GST ENGINE
 * 
 * Implements the authoritative GST calculation rules matching InsForge database triggers & RPCs.
 * 
 * Rules:
 * 1. Intra-State (Seller State Code === Buyer State Code):
 *    - If Seller is Union Territory without Legislature (e.g. 26 - Dadra & Nagar Haveli and Daman & Diu):
 *      -> CGST (Rate/2) + UTGST (Rate/2)
 *    - Else (State or UT with Legislature, e.g. 21 - Odisha, 24 - Gujarat, 27 - Maharashtra, 07 - Delhi):
 *      -> CGST (Rate/2) + SGST (Rate/2)
 * 2. Inter-State (Seller State Code !== Buyer State Code):
 *    - Example: Seller 26, Buyer 27 -> IGST (Full Rate)
 * 3. Tax Exempt / Zero Rated:
 *    - Rate = 0%
 */
export function calculateGstInvoiceTotals(params: GstCalculationParams): GstCalculationResult {
  const sellerCode = extractStateCode(params.sellerStateCode);
  const buyerCode = extractStateCode(params.buyerStateCode);
  
  const sellerState = getStateDetails(sellerCode);
  const buyerState = getStateDetails(buyerCode);
  
  const gstRate = params.gstRate !== undefined ? Number(params.gstRate) : 18;
  const currency = params.currency || 'INR';
  const discountType = params.discountType || 'fixed';
  const discountValue = Number(params.discountValue) || 0;

  // 1. Calculate items & Subtotal
  let subtotal = 0;
  const computedItems = (params.items || []).map((item, idx) => {
    const q = Number(item.quantity) || 0;
    const r = Number(item.rate) || 0;
    const lineAmount = Math.round(q * r * 100) / 100;
    subtotal += lineAmount;
    return {
      description: item.description || `Deliverable Line Item ${idx + 1}`,
      sacCode: item.sacCode || '998314',
      quantity: q,
      rate: r,
      amount: lineAmount
    };
  });

  subtotal = Math.round(subtotal * 100) / 100;

  // 2. Calculate Discount
  let discountAmount = 0;
  if (discountType === 'percentage') {
    discountAmount = Math.round((subtotal * discountValue) / 100 * 100) / 100;
  } else {
    discountAmount = Math.min(subtotal, Math.round(discountValue * 100) / 100);
  }
  discountAmount = Math.max(0, discountAmount);

  // 3. Taxable Amount
  const taxableAmount = Math.max(0, Math.round((subtotal - discountAmount) * 100) / 100);

  // 4. Supply Classification & Tax Breakdown
  const invoiceType = params.invoiceType || 'Regular';
  const lutArn = params.lutArn || '';

  const isIntraState = sellerCode === buyerCode;
  const isInterState = !isIntraState;
  const isUnionTerritory = isIntraState && UT_WITHOUT_LEGISLATURE_CODES.has(sellerCode);

  let gstType: GSTType = 'igst';
  let supplyType: 'INTRA_STATE' | 'INTER_STATE' | 'EXEMPT' = 'INTER_STATE';
  let taxLabel = 'IGST';

  let cgstRate = 0;
  let cgstAmount = 0;
  let sgstRate = 0;
  let sgstAmount = 0;
  let utgstRate = 0;
  let utgstAmount = 0;
  let igstRate = 0;
  let igstAmount = 0;

  if (invoiceType === 'SEZ Supply without Tax') {
    // Zero-rated supply to SEZ under Letter of Undertaking (LUT) / Bond without payment of IGST
    gstType = 'none';
    supplyType = 'EXEMPT';
    taxLabel = lutArn ? `SEZ Zero-Rated (LUT ARN: ${lutArn})` : 'SEZ Zero-Rated Supply (Under LUT)';
  } else if (invoiceType === 'SEZ Supply with Tax') {
    // Supply to SEZ unit is deemed Inter-State under IGST Act Section 7(5)(b), IGST is charged in full
    supplyType = 'INTER_STATE';
    gstType = 'igst';
    igstRate = gstRate;
    igstAmount = Math.round((taxableAmount * gstRate) / 100 * 100) / 100;
    taxLabel = `SEZ Supply (IGST ${gstRate}%)`;
  } else if (params.overrideGstType === 'none' || gstRate === 0) {
    gstType = 'none';
    supplyType = 'EXEMPT';
    taxLabel = 'Tax Exempt (0%)';
  } else if (isIntraState) {
    supplyType = 'INTRA_STATE';
    const halfRate = gstRate / 2;
    cgstRate = halfRate;
    cgstAmount = Math.round((taxableAmount * halfRate) / 100 * 100) / 100;

    if (isUnionTerritory) {
      // Intra-State Union Territory without Legislature (e.g. 26 - DNH & DD)
      gstType = 'cgst_utgst';
      utgstRate = halfRate;
      utgstAmount = Math.round((taxableAmount * halfRate) / 100 * 100) / 100;
      taxLabel = 'CGST + UTGST';
    } else {
      // Intra-State State / UT with Legislature (e.g. 21 - Odisha)
      gstType = 'cgst_sgst';
      sgstRate = halfRate;
      sgstAmount = Math.round((taxableAmount * halfRate) / 100 * 100) / 100;
      taxLabel = 'CGST + SGST';
    }
  } else {
    // Inter-State (e.g. Seller 26, Buyer 27)
    supplyType = 'INTER_STATE';
    gstType = 'igst';
    igstRate = gstRate;
    igstAmount = Math.round((taxableAmount * gstRate) / 100 * 100) / 100;
    taxLabel = 'IGST';
  }

  const totalTaxAmount = Math.round((cgstAmount + sgstAmount + utgstAmount + igstAmount) * 100) / 100;
  const grandTotal = Math.round((taxableAmount + totalTaxAmount) * 100) / 100;
  const amountInWords = numberToWordsIndian(grandTotal, currency);

  return {
    computedItems,
    subtotal,
    discountType,
    discountValue,
    discountAmount,
    taxableAmount,
    sellerState,
    buyerState,
    isInterState,
    isIntraState,
    isUnionTerritory,
    supplyType,
    gstType,
    gstRate: invoiceType === 'SEZ Supply without Tax' ? 0 : gstRate,
    taxLabel,
    invoiceType,
    lutArn,
    cgstRate,
    cgstAmount,
    sgstRate,
    sgstAmount,
    utgstRate,
    utgstAmount,
    igstRate,
    igstAmount,
    totalTaxAmount,
    grandTotal,
    amountInWords,
    authoritativeSource: 'InsForge Database Engine (public.calculate_invoice_totals)',
    generatedAt: new Date().toISOString()
  };
}
