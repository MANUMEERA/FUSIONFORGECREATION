import QRCode from 'qrcode';

export interface UpiPaymentDetails {
  upiId: string;
  payeeName: string;
  amount?: number;
  invoiceNumber?: string;
  note?: string;
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
