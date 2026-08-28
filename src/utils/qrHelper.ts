import QRCode from 'qrcode';

export interface UpiPaymentDetails {
  upiId: string;
  payeeName: string;
  amount?: number;
  invoiceNumber?: string;
  note?: string;
}

export interface EinvoiceQrPayload {
  sellerGstin: string;
  buyerGstin?: string;
  docNo: string;
  docType?: string;
  docDate: string;
  totalInvoiceValue: number;
  itemCount?: number;
  mainHsnCode?: string;
  irn: string;
  ackNo?: string;
  ackDate?: string;
}

/**
 * Builds standard UPI deep-link URL according to NPCI specifications:
 * upi://pay?pa=...&pn=...&am=...&tn=...&cu=INR
 */
export function buildUpiPaymentUrl(details: UpiPaymentDetails): string {
  const params = new URLSearchParams();
  params.append('pa', details.upiId || 'fusionforge@hdfcbank');
  params.append('pn', details.payeeName || 'Fusion Forge Creation');
  
  if (details.amount && details.amount > 0) {
    params.append('am', details.amount.toFixed(2));
  }
  
  const note = details.invoiceNumber 
    ? `Invoice ${details.invoiceNumber}` 
    : (details.note || 'Fusion Forge Payment');
  params.append('tn', note);
  params.append('cu', 'INR');

  return `upi://pay?${params.toString()}`;
}

/**
 * Builds standard GST E-Invoice payload string (IRP / NIC compliant format)
 */
export function buildEinvoiceQrString(payload: EinvoiceQrPayload): string {
  return JSON.stringify({
    SellerGstin: payload.sellerGstin || '',
    BuyerGstin: payload.buyerGstin && payload.buyerGstin !== '—' ? payload.buyerGstin : 'URP',
    DocNo: payload.docNo || '',
    DocTyp: payload.docType || 'INV',
    DocDt: payload.docDate || '',
    TotInvVal: Math.round((payload.totalInvoiceValue || 0) * 100) / 100,
    ItemCnt: payload.itemCount || 1,
    MainHsnCode: payload.mainHsnCode || '998314',
    Irn: payload.irn || '',
    AckNo: payload.ackNo || '',
    AckDt: payload.ackDate || ''
  });
}

/**
 * Generates an inline SVG string for the QR code (offline, zero-network dependency).
 */
export async function generateQrSvg(data: string, size = 110): Promise<string> {
  try {
    const svg = await QRCode.toString(data, {
      type: 'svg',
      width: size,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    });
    return svg;
  } catch (err) {
    console.error('Failed to generate SVG QR code:', err);
    return `<div style="width:${size}px;height:${size}px;border:1px dashed #cbd5e1;display:flex;align-items:center;justify-content:center;font-size:10px;color:#64748b;">QR Unavailable</div>`;
  }
}

/**
 * Generates base64 PNG data URL for the QR code
 */
export async function generateQrDataUrl(data: string, size = 130): Promise<string> {
  try {
    return await QRCode.toDataURL(data, {
      width: size,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    });
  } catch (err) {
    console.error('Failed to generate data URL QR code:', err);
    return '';
  }
}

/**
 * Generates dedicated Indian GST e-Invoice QR code SVG
 */
export async function generateEinvoiceQrSvg(payload: EinvoiceQrPayload, size = 120): Promise<string> {
  const qrString = buildEinvoiceQrString(payload);
  return generateQrSvg(qrString, size);
}

/**
 * Generates dedicated Indian GST e-Invoice QR code Data URL
 */
export async function generateEinvoiceQrDataUrl(payload: EinvoiceQrPayload, size = 130): Promise<string> {
  const qrString = buildEinvoiceQrString(payload);
  return generateQrDataUrl(qrString, size);
}

