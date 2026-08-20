import { Quotation, Invoice, Payment, Client } from '../types';
import { AGENCY_CONFIG } from '../mockData';
import { numberToWordsIndian } from './numberToWords';
import { formatDateDDMMYYYY } from './dateUtils';

function getActiveAgencyConfig(customConfig?: any) {
  if (customConfig && (customConfig.gstin || customConfig.name || customConfig.company_name)) {
    return customConfig;
  }
  try {
    const saved = localStorage.getItem('fusion_forge_agency_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        return { ...AGENCY_CONFIG, ...parsed };
      }
    }
  } catch {
    // ignore
  }
  return AGENCY_CONFIG;
}

const BRAND_LOGO_SVG_HTML = `
  <div style="display: flex; align-items: center; gap: 14px;">
    <div style="position: relative; width: 48px; height: 48px; border-radius: 12px; background: #ffffff; padding: 4px; box-shadow: 0 0 12px rgba(0, 180, 255, 0.4), 0 2px 6px rgba(0,0,0,0.1); border: 1.5px solid #00d2ff; display: flex; align-items: center; justify-content: center;">
      <svg width="40" height="40" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="pdfNavy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#051033"/>
            <stop offset="50%" stop-color="#0a2166"/>
            <stop offset="100%" stop-color="#123d9e"/>
          </linearGradient>
          <linearGradient id="pdfCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0055ff"/>
            <stop offset="45%" stop-color="#0099ff"/>
            <stop offset="100%" stop-color="#00e5ff"/>
          </linearGradient>
        </defs>
        <g transform="translate(10, 8) scale(0.88)">
          <path d="M 28 14 C 18 14 12 20 12 30 L 12 142 L 38 122 L 38 86 L 68 86 L 82 66 L 38 66 L 38 40 L 106 40 L 124 14 Z" fill="url(#pdfNavy)"/>
          <rect x="132" y="10" width="13" height="13" rx="2" fill="#00e5ff"/>
          <rect x="114" y="24" width="13" height="13" rx="2" fill="#00b4d8"/>
          <rect x="132" y="27" width="13" height="13" rx="2" fill="#0096ff"/>
          <rect x="114" y="41" width="13" height="13" rx="2" fill="#0066ee"/>
          <path d="M 52 48 C 66 48 88 45 112 45 C 120 45 125 50 116 63 L 68 63 L 68 85 L 103 85 C 109 85 113 90 106 101 L 68 101 L 68 144 L 43 144 L 43 68 C 43 56 47 48 52 48 Z" fill="url(#pdfCyan)"/>
          <path d="M 43 68 L 68 63 L 68 101 L 43 93 Z" fill="#051b4d" opacity="0.55"/>
        </g>
      </svg>
    </div>
    <div>
      <div style="font-size: 20px; font-weight: 900; color: #08143d; letter-spacing: 0.5px; line-height: 1.1; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <span>FUSION </span><span style="color: #0088ff;">FORGE</span>
      </div>
      <div style="font-size: 9px; font-weight: 800; color: #334155; letter-spacing: 3px; text-transform: uppercase; margin-top: 2px;">
        CREATION <span style="color: #0088ff; letter-spacing: 0.5px;">• WHERE IDEAS FUSE WITH TECHNOLOGY</span>
      </div>
    </div>
  </div>
`;

export function generateQuotationPDF(quote: Quotation, customAgencyConfig?: any) {
  const cfg = getActiveAgencyConfig(customAgencyConfig);
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to view/print the official quotation document.');
    return;
  }

  const isGstApplicable = quote.gstApplicable !== false && 
    quote.gstType !== 'none' && 
    quote.supplyType !== 'EXEMPT' &&
    ((quote.cgstAmount || 0) + (quote.sgstAmount || 0) + (quote.igstAmount || 0) > 0 || (quote.gstRate ? quote.gstRate > 0 : false));

  const taxableAmount = quote.taxableAmount ?? (quote.subtotal - (quote.discountAmount || 0));
  const totalGst = (quote.cgstAmount || 0) + (quote.sgstAmount || 0) + (quote.igstAmount || 0);

  const formattedIssueDate = formatDateDDMMYYYY(quote.issueDate);
  const formattedValidUntil = formatDateDDMMYYYY(quote.validUntil);

  const sellerCompanyName = cfg.company_name || cfg.name || 'Fusion Forge Creation';
  const msmeText = cfg.msme_number || cfg.msmeNumber;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>COMMERCIAL QUOTATION ${quote.quoteNumber} - ${sellerCompanyName}</title>
        <style>
          @page {
            size: A4;
            margin: 15mm;
          }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
            color: #0f172a; 
            margin: 0; 
            padding: 36px; 
            background: #fff; 
            max-width: 820px; 
            margin: 0 auto; 
            line-height: 1.5;
          }
          .header { 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-start; 
            border-bottom: 2.5px solid #0f172a; 
            padding-bottom: 18px; 
            margin-bottom: 22px; 
          }
          .doc-badge { 
            display: inline-block; 
            font-size: 19px; 
            font-weight: 900; 
            color: #0f172a; 
            letter-spacing: 1px; 
            margin-bottom: 6px; 
            text-transform: uppercase; 
          }
          .meta-box { 
            font-size: 13px; 
            color: #334155; 
            text-align: right; 
            line-height: 1.6; 
          }
          .client-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 20px; 
            margin-bottom: 22px; 
            background: #f8fafc; 
            padding: 16px; 
            border-radius: 8px; 
            border: 1px solid #e2e8f0; 
            font-size: 13px; 
          }
          .table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 22px; 
            font-size: 13px; 
          }
          .table th { 
            background: #0f172a; 
            color: #fff; 
            padding: 10px 14px; 
            text-align: left; 
            font-weight: 700; 
            text-transform: uppercase; 
            font-size: 11px; 
            letter-spacing: 0.5px; 
          }
          .table td { 
            padding: 12px 14px; 
            border-bottom: 1px solid #e2e8f0; 
          }
          .summary-container { 
            display: flex; 
            justify-content: flex-end; 
            margin-bottom: 26px; 
          }
          .summary-box { 
            width: 340px; 
            font-size: 13px; 
            background: #f8fafc; 
            padding: 16px; 
            border-radius: 8px; 
            border: 1px solid #e2e8f0; 
          }
          .summary-row { 
            display: flex; 
            justify-content: space-between; 
            padding: 5px 0; 
            color: #475569; 
          }
          .summary-row strong, .summary-row span.val { 
            color: #0f172a; 
            font-weight: 600; 
            font-family: ui-monospace, monospace; 
          }
          .summary-total { 
            font-weight: 800; 
            font-size: 16px; 
            border-top: 2px solid #0f172a; 
            padding-top: 10px; 
            margin-top: 8px; 
            color: #0f172a; 
          }
          .summary-total .val { 
            color: #0284c7; 
            font-weight: 900; 
          }
          .terms { 
            font-size: 11px; 
            color: #64748b; 
            margin-top: 28px; 
            border-top: 1px solid #e2e8f0; 
            padding-top: 14px; 
            line-height: 1.6; 
          }
          .footer-sig { 
            margin-top: 36px; 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-end; 
            font-size: 12px; 
            border-top: 1px dashed #cbd5e1;
            padding-top: 18px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            ${BRAND_LOGO_SVG_HTML}
            <div style="font-size: 11px; color: #64748b; margin-top: 8px; line-height: 1.45;">
              ${cfg.address || 'H2/203, Yogi Milan, Near Ring Road, Silvassa'}, ${cfg.city || 'Silvassa'}, ${cfg.state || 'Dadra & Nagar Haveli'} - ${cfg.postalCode || '396230'}<br/>
              ${cfg.gstin ? `GSTIN: <strong>${cfg.gstin}</strong> | ` : ''}PAN: <strong>${cfg.pan || 'AALFF1234F'}</strong> | SAC: <strong>${cfg.sacCode || '998314'}</strong>${msmeText ? ` | MSME: <strong>${msmeText}</strong>` : ''} | Email: ${cfg.email || 'admin@fusionforgecreation.com'}
            </div>
          </div>
          <div class="meta-box">
            <div class="doc-badge">COMMERCIAL QUOTATION</div>
            <div><strong>Quotation No:</strong> <span style="font-family: monospace; font-weight: 700; color: #0284c7;">${quote.quoteNumber}</span></div>
            <div><strong>Issue Date:</strong> ${formattedIssueDate}</div>
            <div><strong>Valid Until:</strong> ${formattedValidUntil}</div>
          </div>
        </div>

        <div class="client-grid">
          <div>
            <div style="font-weight: 700; color: #64748b; text-transform: uppercase; font-size: 10px; margin-bottom: 4px; letter-spacing: 0.5px;">Client / Billed To:</div>
            <div style="font-size: 15px; font-weight: 800; color: #0f172a;">${quote.clientCompany || quote.clientName}</div>
            <div>Attn: <strong>${quote.clientName}</strong></div>
            <div>Email: ${quote.clientEmail}</div>
            ${quote.clientAddress ? `<div style="color: #475569; font-size: 11px; margin-top: 2px;">Address: ${quote.clientAddress}</div>` : ''}
            ${quote.clientGstin && quote.clientGstin !== '—' ? `<div style="font-size: 11px; margin-top: 2px;">GSTIN: <strong style="font-family: monospace;">${quote.clientGstin}</strong></div>` : ''}
            ${isGstApplicable && quote.placeOfSupply ? `<div style="font-size: 11px; color: #0284c7; margin-top: 2px;">Place of Supply: <strong>${quote.placeOfSupply}</strong></div>` : ''}
          </div>
          <div>
            <div style="font-weight: 700; color: #64748b; text-transform: uppercase; font-size: 10px; margin-bottom: 4px; letter-spacing: 0.5px;">Scope / Subject:</div>
            <div style="font-size: 13px; font-weight: 700; color: #1e3a8a; margin-bottom: 4px;">${quote.title}</div>
            ${isGstApplicable ? `
              <div style="font-size: 12px; color: #475569;">
                Taxation: <strong>${quote.gstType === 'cgst_sgst' ? 'CGST (9%) + SGST (9%)' : quote.gstType === 'cgst_utgst' ? 'CGST (9%) + UTGST (9%)' : `IGST (${quote.gstRate || 18}%)`}</strong>
              </div>
            ` : `
              <div style="font-size: 12px; color: #059669; font-weight: 600;">
                Commercial Proposal (Zero Tax / Non-GST Quotation)
              </div>
            `}
            ${quote.paymentTerms ? `
              <div style="margin-top: 6px; font-size: 11px; color: #475569;">
                <strong>Payment Terms:</strong> ${quote.paymentTerms}
              </div>
            ` : ''}
            ${quote.sameAsBilling === false && quote.shippingAddress ? `
              <div style="margin-top: 8px; padding-top: 6px; border-top: 1px dashed #cbd5e1; font-size: 11px; color: #475569;">
                <strong>Shipped To:</strong> ${quote.shippingName || quote.shippingCompany || quote.clientCompany}<br/>
                ${quote.shippingAddress}${quote.shippingCity ? `, ${quote.shippingCity}` : ''} (${quote.shippingState || ''})
              </div>
            ` : ''}
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th style="width: 45%;">Description</th>
              <th style="width: 15%; text-align: center;">Qty</th>
              <th style="width: 20%; text-align: right;">Rate (₹)</th>
              <th style="width: 20%; text-align: right;">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${quote.items.map(item => `
              <tr>
                <td><strong>${item.description}</strong>${item.sacCode ? ` <span style="font-size: 10px; color: #64748b; font-family: monospace;">(SAC: ${item.sacCode})</span>` : ''}</td>
                <td style="text-align: center; font-family: ui-monospace, monospace;">${item.quantity}</td>
                <td style="text-align: right; font-family: ui-monospace, monospace;">₹ ${item.rate.toLocaleString('en-IN')}</td>
                <td style="text-align: right; font-weight: 700; font-family: ui-monospace, monospace;">₹ ${item.amount.toLocaleString('en-IN')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="summary-container">
          <div class="summary-box">
            <div class="summary-row">
              <span>Subtotal</span>
              <span class="val">₹ ${quote.subtotal.toLocaleString('en-IN')}</span>
            </div>
            ${(quote.discountAmount > 0 || quote.discountValue > 0) ? `
              <div class="summary-row" style="color: #059669;">
                <span>Discount</span>
                <span class="val" style="color: #059669;">- ₹ ${quote.discountAmount.toLocaleString('en-IN')}</span>
              </div>
            ` : ''}
            
            ${isGstApplicable ? `
              <div class="summary-row" style="border-top: 1px dashed #cbd5e1; padding-top: 6px;">
                <span><strong>Taxable Amount</strong></span>
                <span class="val">₹ ${taxableAmount.toLocaleString('en-IN')}</span>
              </div>
              ${quote.gstType === 'cgst_utgst' || ((quote.utgstAmount || 0) > 0) ? `
                <div class="summary-row">
                  <span>Central Tax (CGST 9%)</span>
                  <span class="val">₹ ${(quote.cgstAmount || 0).toLocaleString('en-IN')}</span>
                </div>
                <div class="summary-row">
                  <span>Union Territory Tax (UTGST 9%)</span>
                  <span class="val">₹ ${(quote.utgstAmount || 0).toLocaleString('en-IN')}</span>
                </div>
              ` : quote.gstType === 'cgst_sgst' ? `
                <div class="summary-row">
                  <span>Central Tax (CGST 9%)</span>
                  <span class="val">₹ ${(quote.cgstAmount || 0).toLocaleString('en-IN')}</span>
                </div>
                <div class="summary-row">
                  <span>State Tax (SGST 9%)</span>
                  <span class="val">₹ ${(quote.sgstAmount || 0).toLocaleString('en-IN')}</span>
                </div>
              ` : `
                <div class="summary-row">
                  <span>Integrated Tax (IGST ${quote.gstRate || 18}%)</span>
                  <span class="val">₹ ${(quote.igstAmount || totalGst).toLocaleString('en-IN')}</span>
                </div>
              `}
            ` : ''}

            <div class="summary-row summary-total">
              <span>Grand Total</span>
              <span class="val">₹ ${quote.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div class="terms">
          <strong style="color: #0f172a;">Terms & Conditions:</strong><br/>
          ${cfg.quotation_terms 
            ? (Array.isArray(cfg.quotation_terms) ? cfg.quotation_terms : cfg.quotation_terms.split('\n')).filter(Boolean).map((t: string, i: number) => `${i + 1}. ${t}<br/>`).join('')
            : (quote.termsAndConditions || AGENCY_CONFIG.terms).map((t, i) => `${i + 1}. ${t}<br/>`).join('')}
        </div>

        <div class="footer-sig">
          <div style="font-size: 11px; color: #64748b; max-width: 320px;">
            <strong style="color: #0f172a;">Official Agency Communication</strong><br/>
            Email: <strong style="color: #0284c7;">admin@fusionforgecreation.com</strong><br/>
            ${quote.paymentTerms ? `Payment Terms: <span>${quote.paymentTerms}</span><br/>` : ''}
            <span style="font-size: 10px; color: #94a3b8;">Generated via Fusion Forge Creations Enterprise Commercial Workflow</span>
          </div>

          <div style="display: flex; align-items: flex-end; gap: 24px;">
            ${cfg.stamp_url ? `
              <div style="display: flex; flex-direction: column; align-items: center; justify-content: flex-end; padding-bottom: 2px;">
                <img src="${cfg.stamp_url}" alt="Official Stamp" style="max-height: 65px; max-width: 65px; object-fit: contain; opacity: 0.9;" />
                <span style="font-size: 9px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-top: 2px;">Official Stamp</span>
              </div>
            ` : ''}

            <div style="text-align: right; min-width: 190px;">
              <div style="font-size: 12px; font-weight: 700; color: #0f172a;">For <strong>${sellerCompanyName}</strong></div>
              ${cfg.signature_url ? `
                <div style="margin: 6px 0; height: 48px; display: flex; align-items: center; justify-content: flex-end;">
                  <img src="${cfg.signature_url}" alt="Authorized Signature" style="max-height: 46px; max-width: 140px; object-fit: contain;" />
                </div>
              ` : `
                <div style="margin: 6px 0; height: 48px; display: flex; align-items: center; justify-content: flex-end;">
                  <span style="font-family: 'Brush Script MT', cursive, serif; font-style: italic; font-size: 20px; color: #0284c7; font-weight: 700; opacity: 0.9;">Authorized Signature</span>
                </div>
              `}
              <div style="font-weight: 700; color: #0f172a; border-top: 1.5px solid #0f172a; display: inline-block; padding-top: 4px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">
                Authorised Signatory
              </div>
            </div>
          </div>
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

export async function generateInvoicePDF(invoice: Invoice, customAgencyConfig?: any) {
  const cfg = getActiveAgencyConfig(customAgencyConfig);
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to view/print the official tax invoice.');
    return;
  }

  const taxableAmount = invoice.taxableAmount ?? (invoice.subtotal - (invoice.discountAmount || 0));
  const amountWords = invoice.amountInWords || numberToWordsIndian(invoice.totalAmount, invoice.currency || 'INR');

  // Seller values (dynamically from cfg and invoice)
  const sellerName = cfg.company_name || cfg.name || invoice.sellerName || 'Fusion Forge Creation';
  const sellerAddress = `${cfg.address || 'H2/203, Yogi Milan, Near Ring Road, Silvassa'}, ${cfg.city || 'Silvassa'}, ${cfg.state || 'Dadra & Nagar Haveli'} - ${cfg.postalCode || '396230'}`;
  const sellerGstin = cfg.gstin || invoice.sellerGstin || '';
  const sellerPan = cfg.pan || (sellerGstin && sellerGstin.length >= 12 ? sellerGstin.slice(2, 12) : 'AALFF1234F');
  const sellerEmail = cfg.email || 'admin@fusionforgecreation.com';
  const sellerPhone = cfg.phone || '+91 90040 77126';
  const msmeNumber = cfg.msme_number || cfg.msmeNumber || '';

  // Dates (Formatted strictly as DD-MM-YYYY)
  const invoiceDateStr = formatDateDDMMYYYY(invoice.issueDate || invoice.createdAt || new Date().toISOString());
  const dueDateStr = formatDateDDMMYYYY(invoice.dueDate || new Date().toISOString());

  // Buyer / Billed To values
  const buyerCompany = invoice.buyerCompany || invoice.clientCompany || invoice.clientName || 'JP MODATEX LLP';
  const buyerContactPerson = invoice.buyerName || invoice.clientName || '';
  const buyerAddress = invoice.buyerAddress || invoice.clientAddress || '';
  const rawBuyerGstin = invoice.buyerGstin || invoice.clientGstin || '';
  const isUrp = !rawBuyerGstin || rawBuyerGstin === '—' || rawBuyerGstin.trim().toUpperCase() === 'URP';
  const buyerGstin = isUrp ? 'URP' : rawBuyerGstin;
  const buyerState = invoice.buyerState || (invoice.buyerStateCode ? `${invoice.buyerStateCode}-State` : '24-Gujarat');
  const placeOfSupply = invoice.placeOfSupply || invoice.buyerStateCode || buyerState;
  const clientEmail = invoice.clientEmail || '';

  // Shipping / Shipped To values
  const hasDistinctShipping = invoice.sameAsBilling === false && Boolean(invoice.shippingAddress || invoice.shippingCity || invoice.shippingName);
  const shippingName = invoice.shippingCompany || invoice.shippingName || buyerCompany;
  const shippingContact = invoice.shippingName || buyerContactPerson;
  const shippingAddress = invoice.shippingAddress || buyerAddress;
  const shippingCity = invoice.shippingCity || '';
  const shippingState = invoice.shippingState || (invoice.shippingStateCode ? `${invoice.shippingStateCode}-State` : buyerState);
  const shippingPincode = invoice.shippingPincode || '';
  const shippingGstin = invoice.shippingGstin ? (invoice.shippingGstin.toUpperCase() === 'URP' ? 'URP' : invoice.shippingGstin) : buyerGstin;

  // Reverse Charge Logic
  const reverseChargeValue = invoice.reverseCharge === 'Yes' || invoice.reverseCharge === true 
    ? 'Yes' 
    : (invoice.reverseCharge === 'No' || invoice.reverseCharge === false ? 'No' : (cfg.reverse_charge_default || (sellerGstin ? 'No' : 'Yes')));

  // Bank & Payment Details
  const bankName = invoice.bankDetails?.bankName || cfg.bank_name || cfg.bankDetails?.bankName || 'HDFC Bank Ltd';
  const accountName = invoice.bankDetails?.accountName || cfg.account_name || cfg.bankDetails?.accountName || sellerName;
  const accountNumber = invoice.bankDetails?.accountNumber || cfg.account_number || cfg.bankDetails?.accountNumber || '50200012345678';
  const ifscCode = invoice.bankDetails?.ifscCode || cfg.ifsc_code || cfg.bankDetails?.ifscCode || 'HDFC0001234';
  const branch = invoice.bankDetails?.branch || cfg.branch_name || cfg.bankDetails?.branch || 'Silvassa Branch';
  const upiId = invoice.bankDetails?.upiId || cfg.upi_id || cfg.bankDetails?.upiId || 'fusionforge@hdfcbank';

  // Generate UPI payment URL & QR Code
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(sellerName)}&am=${invoice.totalAmount.toFixed(2)}&tn=${encodeURIComponent(`Invoice ${invoice.invoiceNumber}`)}&cu=INR`;
  
  let paymentQrSvg = '';
  try {
    const QRCode = (await import('qrcode')).default;
    paymentQrSvg = await QRCode.toString(upiUrl, {
      type: 'svg',
      width: 110,
      margin: 1,
      color: { dark: '#0f172a', light: '#ffffff' }
    });
  } catch (err) {
    paymentQrSvg = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(upiUrl)}" alt="UPI QR" style="width:105px;height:105px;" />`;
  }

  // Generate E-Invoice Official QR Code (Indian GST B2B IRP format)
  const hasEinvoiceDetails = Boolean(invoice.irn || invoice.ackNo || invoice.acknowledgement_number || invoice.arn);
  let einvoiceQrSvg = '';
  if (hasEinvoiceDetails) {
    const einvoicePayload = JSON.stringify({
      SellerGstin: sellerGstin,
      BuyerGstin: buyerGstin && buyerGstin !== '—' ? buyerGstin : 'URP',
      DocNo: invoice.invoiceNumber,
      DocTyp: 'INV',
      DocDt: invoiceDateStr,
      TotInvVal: invoice.totalAmount,
      ItemCnt: invoice.items?.length || 1,
      MainHsnCode: invoice.items?.[0]?.sacCode || '998314',
      Irn: invoice.irn || '',
      AckNo: invoice.ackNo || invoice.acknowledgement_number || '',
      AckDt: invoice.ackDate || invoice.acknowledgement_date || invoiceDateStr
    });
    try {
      const QRCode = (await import('qrcode')).default;
      einvoiceQrSvg = await QRCode.toString(einvoicePayload, {
        type: 'svg',
        width: 100,
        margin: 1,
        color: { dark: '#0f172a', light: '#ffffff' }
      });
    } catch (err) {
      einvoiceQrSvg = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(einvoicePayload)}" alt="e-Invoice QR" style="width:95px;height:95px;" />`;
    }
  }

  // Terms and Delay-Interest Clause
  const rawTerms = cfg.invoice_terms 
    ? (Array.isArray(cfg.invoice_terms) ? cfg.invoice_terms : cfg.invoice_terms.split('\n')).filter(Boolean)
    : (invoice.paymentTerms ? [invoice.paymentTerms] : AGENCY_CONFIG.terms);

  const delayInterest = cfg.delay_interest_clause || 'Interest @ 18% per annum will be charged on all delayed payments exceeding the due date.';
  const combinedTerms = [...rawTerms];
  if (delayInterest && !combinedTerms.some(t => t.toLowerCase().includes('interest'))) {
    combinedTerms.push(delayInterest);
  }

  // Total Tax Calculation
  const totalTaxAmount = (invoice.cgstAmount || 0) + (invoice.sgstAmount || 0) + (invoice.utgstAmount || 0) + (invoice.igstAmount || 0);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>TAX INVOICE ${invoice.invoiceNumber} - ${sellerName}</title>
        <style>
          @page {
            size: A4;
            margin: 10mm;
          }
          * {
            box-sizing: border-box;
          }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
            color: #0f172a; 
            margin: 0; 
            padding: 20px; 
            background: #ffffff; 
            max-width: 860px;
            margin: 0 auto;
            line-height: 1.45;
          }
          /* Full Outer Border around Invoice */
          .invoice-outer-box {
            border: 2px solid #0f172a;
            border-radius: 6px;
            padding: 20px;
            background: #ffffff;
          }
          .header-main-bar {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #0f172a;
            padding-bottom: 14px;
            margin-bottom: 16px;
          }
          .seller-meta-line {
            font-size: 11px;
            color: #334155;
            margin-top: 6px;
            line-height: 1.5;
          }
          .seller-meta-line strong {
            color: #0f172a;
          }
          .invoice-title-block {
            text-align: right;
          }
          .doc-type-title {
            font-size: 24px;
            font-weight: 900;
            letter-spacing: 1.5px;
            color: #0f172a;
            text-transform: uppercase;
          }
          .invoice-ref-number {
            font-size: 16px;
            font-weight: 800;
            font-family: ui-monospace, monospace;
            color: #0284c7;
            margin-top: 2px;
          }
          .header-dates-box {
            font-size: 12px;
            color: #334155;
            margin-top: 4px;
            line-height: 1.4;
          }
          .header-dates-box strong {
            color: #0f172a;
          }

          /* E-Invoice / Statutory Reference Container with QR Code */
          .einvoice-container {
            background: #f8fafc;
            border: 1.5px solid #cbd5e1;
            border-radius: 6px;
            padding: 8px 12px;
            margin-bottom: 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
          }
          .einvoice-details-side {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          .einvoice-title-tag {
            font-size: 9px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            color: #0f172a;
            display: flex;
            align-items: center;
            gap: 5px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 3px;
            margin-bottom: 2px;
          }
          .einvoice-title-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #10b981;
            display: inline-block;
          }
          .einvoice-item {
            font-size: 11px;
            line-height: 1.3;
          }
          .einvoice-item strong {
            color: #0f172a;
            font-size: 10px;
            display: inline-block;
          }
          .einvoice-val {
            font-family: ui-monospace, monospace;
            color: #0369a1;
            font-weight: 700;
            word-break: break-all;
          }
          .einvoice-qr-side {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 4px;
            background: #ffffff;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
          }
          .einvoice-qr-label {
            font-size: 8px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #0369a1;
            margin-top: 2px;
          }

          /* Parties Grid: Strictly BILLED TO & SHIPPED TO */
          .parties-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
            margin-bottom: 16px;
          }
          .party-card {
            background: #f8fafc;
            border: 1.5px solid #cbd5e1;
            border-radius: 6px;
            padding: 12px 14px;
            font-size: 12px;
          }
          .party-header-title {
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: #475569;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 4px;
            margin-bottom: 6px;
          }
          .party-name {
            font-size: 14px;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 2px;
          }
          .party-detail {
            color: #334155;
            margin-bottom: 2px;
          }
          .party-detail strong {
            color: #0f172a;
          }

          /* Items Table */
          .items-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
            margin-bottom: 16px;
          }
          .items-table th {
            background: #0f172a;
            color: #ffffff;
            padding: 8px 10px;
            text-align: left;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 10.5px;
            letter-spacing: 0.5px;
          }
          .items-table td {
            padding: 9px 10px;
            border-bottom: 1px solid #e2e8f0;
            vertical-align: top;
          }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .font-mono { font-family: ui-monospace, monospace; }

          /* Bottom Section: Payment QR, Bank & Summary */
          .bottom-split {
            display: grid;
            grid-template-columns: 1fr 330px;
            gap: 16px;
            margin-bottom: 14px;
          }
          .payment-bank-box {
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            padding: 12px;
            display: flex;
            gap: 14px;
            align-items: center;
          }
          .qr-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            min-width: 110px;
          }
          .qr-caption {
            font-size: 9.5px;
            font-weight: 800;
            color: #0284c7;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 4px;
          }
          .bank-info-block {
            font-size: 11px;
            color: #334155;
            line-height: 1.45;
          }
          .bank-info-block strong {
            color: #0f172a;
          }
          .bank-title {
            font-size: 11px;
            font-weight: 800;
            color: #0f172a;
            text-transform: uppercase;
            margin-bottom: 4px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 2px;
          }

          /* Financial Summary Card */
          .summary-card {
            background: #f8fafc;
            border: 1.5px solid #cbd5e1;
            border-radius: 6px;
            padding: 12px 14px;
            font-size: 12px;
          }
          .summary-item {
            display: flex;
            justify-content: space-between;
            padding: 3px 0;
            color: #475569;
          }
          .summary-item .val {
            color: #0f172a;
            font-weight: 600;
            font-family: ui-monospace, monospace;
          }
          .divider-dashed {
            border-top: 1px dashed #cbd5e1;
            margin: 4px 0;
          }
          .grand-total-row {
            display: flex;
            justify-content: space-between;
            font-size: 15px;
            font-weight: 900;
            color: #0f172a;
            border-top: 2px solid #0f172a;
            padding-top: 6px;
            margin-top: 6px;
          }

          /* Words Card */
          .words-card {
            background: #f1f5f9;
            border-left: 3px solid #0284c7;
            padding: 8px 12px;
            font-size: 11.5px;
            margin-bottom: 14px;
          }
          .words-card strong {
            color: #0f172a;
          }

          /* Terms */
          .terms-block {
            font-size: 10px;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
            padding-top: 8px;
            margin-bottom: 12px;
            line-height: 1.4;
          }

          /* Footer Signatory Section */
          .footer-sig-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            font-size: 11px;
            padding-top: 8px;
            border-top: 1px dashed #cbd5e1;
          }
          @media print {
            body { padding: 0; }
            .invoice-outer-box { border: 2px solid #0f172a; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-outer-box">
          
          <!-- Header Bar: Company Brand, Details & Invoice Meta -->
          <div class="header-main-bar">
            <div>
              ${BRAND_LOGO_SVG_HTML}
              <div class="seller-meta-line">
                ${sellerAddress}<br/>
                ${sellerGstin ? `GSTIN: <strong>${sellerGstin}</strong> | ` : ''}PAN: <strong>${sellerPan}</strong> | Email: <strong>${sellerEmail}</strong> | Contact: <strong>${sellerPhone}</strong>
                ${msmeNumber ? `<br/>MSME / Udyam Reg: <strong>${msmeNumber}</strong>` : ''}
              </div>
            </div>
            <div class="invoice-title-block">
              <div class="doc-type-title">TAX INVOICE</div>
              <div class="invoice-ref-number">${invoice.invoiceNumber}</div>
              <div class="header-dates-box">
                <div><strong>Invoice Date:</strong> ${invoiceDateStr}</div>
                <div><strong>Due Date:</strong> ${dueDateStr}</div>
                <div><strong>Reverse Charge:</strong> ${reverseChargeValue}</div>
              </div>
            </div>
          </div>

          <!-- E-Invoice Reference Bar with QR Code (if populated) -->
          ${hasEinvoiceDetails ? `
            <div class="einvoice-container">
              <div class="einvoice-details-side">
                <div class="einvoice-title-tag">
                  <span class="einvoice-title-dot"></span>
                  GOVERNMENT OF INDIA • GST e-INVOICE AUTHENTICATED (IRP)
                </div>
                ${invoice.irn ? `
                  <div class="einvoice-item">
                    <strong>IRN:</strong> <span class="einvoice-val">${invoice.irn}</span>
                  </div>
                ` : ''}
                <div style="display: flex; gap: 16px; flex-wrap: wrap; margin-top: 2px;">
                  ${invoice.ackNo || invoice.acknowledgement_number ? `
                    <div class="einvoice-item">
                      <strong>Ack No:</strong> <span class="einvoice-val">${invoice.ackNo || invoice.acknowledgement_number}</span>
                    </div>
                  ` : ''}
                  ${invoice.ackDate || invoice.acknowledgement_date ? `
                    <div class="einvoice-item">
                      <strong>Ack Date:</strong> <span class="einvoice-val">${formatDateDDMMYYYY(invoice.ackDate || invoice.acknowledgement_date || '')}</span>
                    </div>
                  ` : ''}
                  ${invoice.arn ? `
                    <div class="einvoice-item">
                      <strong>ARN:</strong> <span class="einvoice-val">${invoice.arn}</span>
                    </div>
                  ` : ''}
                </div>
              </div>
              ${einvoiceQrSvg ? `
                <div class="einvoice-qr-side">
                  <div style="width: 85px; height: 85px; display: flex; align-items: center; justify-content: center;">
                    ${einvoiceQrSvg}
                  </div>
                  <div class="einvoice-qr-label">e-Invoice QR</div>
                </div>
              ` : ''}
            </div>
          ` : ''}

          <!-- Parties Grid: Strictly BILLED TO & SHIPPED TO -->
          <div class="parties-grid">
            
            <!-- BILLED TO -->
            <div class="party-card">
              <div class="party-header-title">BILLED TO (Buyer / Recipient):</div>
              <div class="party-name">${buyerCompany}</div>
              ${buyerContactPerson && buyerContactPerson !== buyerCompany ? `<div class="party-detail">Attn: <strong>${buyerContactPerson}</strong></div>` : ''}
              ${buyerAddress ? `<div class="party-detail"><strong>Address:</strong> ${buyerAddress}</div>` : ''}
              <div class="party-detail"><strong>GSTIN:</strong> <span style="font-family: ui-monospace, monospace; font-weight: 700;">${buyerGstin}</span></div>
              <div class="party-detail"><strong>Place of Supply:</strong> ${placeOfSupply}</div>
              ${clientEmail ? `<div class="party-detail"><strong>Email:</strong> ${clientEmail}</div>` : ''}
            </div>

            <!-- SHIPPED TO -->
            <div class="party-card">
              <div class="party-header-title">SHIPPED TO (Delivery Destination):</div>
              <div class="party-name">${shippingName}</div>
              ${shippingContact && shippingContact !== shippingName ? `<div class="party-detail">Attn: <strong>${shippingContact}</strong></div>` : ''}
              <div class="party-detail"><strong>Address:</strong> ${shippingAddress}${shippingCity ? `, ${shippingCity}` : ''}</div>
              ${shippingState ? `<div class="party-detail"><strong>State:</strong> ${shippingState}${shippingPincode ? ` - ${shippingPincode}` : ''}</div>` : ''}
              <div class="party-detail"><strong>GSTIN:</strong> <span style="font-family: ui-monospace, monospace; font-weight: 700;">${shippingGstin}</span></div>
              ${!hasDistinctShipping ? `<div style="font-size: 10px; color: #0284c7; font-weight: 600; margin-top: 3px;">(Same as Billing Address)</div>` : ''}
            </div>

          </div>

          <!-- Items Table -->
          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 52%;">Description of Goods / Services</th>
                <th style="width: 12%; text-align: center;">Qty</th>
                <th style="width: 18%; text-align: right;">Unit Rate</th>
                <th style="width: 18%; text-align: right;">Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map(item => `
                <tr>
                  <td>
                    <div style="font-weight: 700; color: #0f172a;">${item.description}</div>
                    ${item.sacCode ? `<div style="font-size: 10px; color: #64748b;">SAC / HSN: ${item.sacCode}</div>` : ''}
                  </td>
                  <td class="text-center font-mono">${item.quantity}</td>
                  <td class="text-right font-mono">₹ ${item.rate.toLocaleString('en-IN')}</td>
                  <td class="text-right font-mono" style="font-weight: 700; color: #0f172a;">₹ ${item.amount.toLocaleString('en-IN')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <!-- Bottom Section: Payment QR & Bank (Left), Financial Calculation (Right) -->
          <div class="bottom-split">
            
            <!-- Left: Payment QR & Bank Details -->
            <div class="payment-bank-box">
              <div class="qr-wrapper">
                <div style="background: #ffffff; padding: 4px; border: 1px solid #cbd5e1; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
                  ${paymentQrSvg}
                </div>
                <div class="qr-caption">Please Scan for Payment</div>
              </div>

              <div class="bank-info-block">
                <div class="bank-title">Bank Payment Details</div>
                <div>Bank Name: <strong>${bankName}</strong></div>
                <div>Account Name: <strong>${accountName}</strong></div>
                <div>Account No: <strong>${accountNumber}</strong></div>
                <div>IFSC Code: <strong>${ifscCode}</strong></div>
                <div>Branch: <strong>${branch}</strong></div>
                <div>UPI VPA: <strong>${upiId}</strong></div>
              </div>
            </div>

            <!-- Right: Financial Summary -->
            <div class="summary-card">
              <div class="summary-item">
                <span>Total Taxable Value</span>
                <span class="val">₹ ${taxableAmount.toLocaleString('en-IN')}</span>
              </div>
              
              ${invoice.discountAmount > 0 ? `
                <div class="summary-item" style="color: #059669;">
                  <span>Discount</span>
                  <span class="val" style="color: #059669;">- ₹ ${invoice.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              ` : ''}

              <div class="divider-dashed"></div>

              ${(invoice.cgstAmount || 0) > 0 ? `
                <div class="summary-item">
                  <span>Central Tax (CGST 9%)</span>
                  <span class="val">₹ ${(invoice.cgstAmount || 0).toLocaleString('en-IN')}</span>
                </div>
              ` : ''}

              ${(invoice.sgstAmount || 0) > 0 ? `
                <div class="summary-item">
                  <span>State Tax (SGST 9%)</span>
                  <span class="val">₹ ${(invoice.sgstAmount || 0).toLocaleString('en-IN')}</span>
                </div>
              ` : ''}

              ${(invoice.utgstAmount || 0) > 0 ? `
                <div class="summary-item">
                  <span>Union Territory Tax (UTGST 9%)</span>
                  <span class="val">₹ ${(invoice.utgstAmount || 0).toLocaleString('en-IN')}</span>
                </div>
              ` : ''}

              ${(invoice.igstAmount || 0) > 0 ? `
                <div class="summary-item">
                  <span>Integrated Tax (IGST 18%)</span>
                  <span class="val">₹ ${(invoice.igstAmount || 0).toLocaleString('en-IN')}</span>
                </div>
              ` : ''}

              ${totalTaxAmount > 0 ? `
                <div class="summary-item" style="font-weight: 700; color: #0f172a;">
                  <span>Total Tax</span>
                  <span class="val">₹ ${totalTaxAmount.toLocaleString('en-IN')}</span>
                </div>
              ` : ''}

              <div class="grand-total-row">
                <span>Grand Total</span>
                <span class="val">₹ ${invoice.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

          </div>

          <!-- Amount in Words -->
          <div class="words-card">
            <strong>Amount in Words:</strong> ${amountWords}
          </div>

          <!-- Terms & Conditions -->
          <div class="terms-block">
            <strong style="color: #0f172a;">Terms & Conditions:</strong><br/>
            ${combinedTerms.map((t, i) => `${i + 1}. ${t}<br/>`).join('')}
          </div>

          <!-- Footer: Stamp (Left of Signatory), Authorized Signatory (Between Company Name & Signatory) -->
          <div class="footer-sig-row">
            <div style="font-size: 10px; color: #64748b; max-width: 380px;">
              This is a computer-generated Tax Invoice and legally valid under statutory rules.<br/>
              Official Communication: <strong>${sellerEmail}</strong>
            </div>

            <div style="display: flex; align-items: flex-end; gap: 20px;">
              ${cfg.stamp_url ? `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: flex-end; padding-bottom: 2px;">
                  <img src="${cfg.stamp_url}" alt="Official Stamp" style="max-height: 60px; max-width: 60px; object-fit: contain; opacity: 0.9;" />
                  <span style="font-size: 8.5px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-top: 2px;">Company Stamp</span>
                </div>
              ` : ''}

              <div style="text-align: right; min-width: 190px;">
                <div style="font-size: 11.5px; font-weight: 700; color: #0f172a;">For <strong>${sellerName}</strong></div>
                ${cfg.signature_url ? `
                  <div style="margin: 4px 0; height: 44px; display: flex; align-items: center; justify-content: flex-end;">
                    <img src="${cfg.signature_url}" alt="Authorized Signature" style="max-height: 42px; max-width: 140px; object-fit: contain;" />
                  </div>
                ` : `
                  <div style="margin: 4px 0; height: 44px; display: flex; align-items: center; justify-content: flex-end;">
                    <span style="font-family: 'Brush Script MT', cursive, serif; font-style: italic; font-size: 19px; color: #0284c7; font-weight: 700; opacity: 0.9;">Authorized Signature</span>
                  </div>
                `}
                <div style="font-weight: 800; color: #0f172a; border-top: 1.5px solid #0f172a; display: inline-block; padding-top: 3px; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.5px;">
                  Authorised Signatory
                </div>
              </div>
            </div>
          </div>

        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

export function generatePaymentReceiptPDF(
  payment: Payment,
  invoice?: Invoice,
  client?: Client,
  customAgencyConfig?: any
) {
  const cfg = getActiveAgencyConfig(customAgencyConfig);
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to view/print the official Payment Receipt.');
    return;
  }

  const sellerCompanyName = cfg.company_name || cfg.name || 'Fusion Forge Creation';
  const sellerLegalName = cfg.legal_name || cfg.legalName || 'Fusion Forge Creation LLP';
  const sellerAddress = cfg.address || 'H2/203, Yogi Milan, Near Ring Road, Silvassa, Dadra & Nagar Haveli - 396230';
  const sellerGstin = cfg.gstin || '26AALFF1234F1Z5';
  const sellerPan = cfg.pan || 'AALFF1234F';
  const sellerEmail = cfg.email || 'admin@fusionforgecreation.com';
  const sellerPhone = cfg.phone || '+91 98765 43210';
  const msmeNumber = cfg.msme_number || cfg.msmeNumber || 'UDYAM-DN-00-0012345';

  const clientName = client?.name || payment.clientName;
  const clientCompany = client?.company || payment.clientCompany || payment.clientName;
  const clientEmail = client?.email || payment.clientEmail || invoice?.clientEmail || '';
  const clientGstin = client?.gstin || invoice?.buyerGstin || invoice?.clientGstin || 'URP / Not Applicable';
  const clientAddress = client?.address || invoice?.buyerAddress || invoice?.clientAddress || '';

  const paymentDateStr = formatDateDDMMYYYY(payment.paymentDate || new Date().toISOString());
  const amountWords = numberToWordsIndian(payment.amount);
  
  const paymentMethodLabel = (payment.paymentMethod || 'bank_transfer')
    .toString()
    .replace('_', ' ')
    .toUpperCase();

  const bankName = cfg.bank_name || cfg.bankDetails?.bankName || 'HDFC Bank';
  const accountName = cfg.account_name || cfg.bankDetails?.accountName || 'Fusion Forge Creation';
  const accountNumber = cfg.account_number || cfg.bankDetails?.accountNumber || '50200012345678';
  const ifscCode = cfg.ifsc_code || cfg.bankDetails?.ifscCode || 'HDFC0001234';
  const branch = cfg.branch_name || cfg.bankDetails?.branch || 'Silvassa Branch';
  const upiId = cfg.upi_id || cfg.upiId || cfg.bankDetails?.upiId || 'fusionforge@hdfcbank';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>PAYMENT RECEIPT ${payment.receiptNumber} - ${sellerCompanyName}</title>
        <style>
          @page {
            size: A4;
            margin: 15mm;
          }
          * {
            box-sizing: border-box;
          }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
            color: #0f172a; 
            margin: 0; 
            padding: 32px; 
            background: #f8fafc; 
            max-width: 820px; 
            margin: 0 auto; 
            font-size: 12px;
            line-height: 1.45;
          }
          .receipt-outer-box {
            background: #ffffff;
            border: 2px solid #0f172a;
            border-radius: 4px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          }
          .header-main-bar {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 24px;
            border-bottom: 2px solid #0f172a;
            background: #ffffff;
          }
          .seller-meta-line {
            font-size: 10.5px;
            color: #475569;
            margin-top: 8px;
            line-height: 1.5;
          }
          .receipt-title-block {
            text-align: right;
            min-width: 220px;
          }
          .doc-type-title {
            font-size: 20px;
            font-weight: 900;
            color: #0f172a;
            letter-spacing: 1px;
            line-height: 1.1;
          }
          .receipt-ref-number {
            font-family: ui-monospace, monospace;
            font-size: 14px;
            font-weight: 800;
            color: #0284c7;
            margin-top: 4px;
          }
          .receipt-status-badge {
            display: inline-block;
            margin-top: 8px;
            background: #ecfdf5;
            border: 1px solid #10b981;
            color: #047857;
            font-weight: 800;
            font-size: 10px;
            letter-spacing: 0.5px;
            padding: 3px 8px;
            border-radius: 9999px;
            text-transform: uppercase;
          }
          .meta-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            border-bottom: 1px solid #cbd5e1;
            background: #f8fafc;
          }
          .meta-cell {
            padding: 16px 24px;
          }
          .meta-cell:first-child {
            border-right: 1px solid #cbd5e1;
          }
          .section-heading {
            font-size: 11px;
            font-weight: 800;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 4px;
          }
          .party-name {
            font-size: 13.5px;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 4px;
          }
          .party-line {
            font-size: 11px;
            color: #334155;
            margin-bottom: 3px;
          }
          .amount-hero-card {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: #ffffff;
            padding: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #0f172a;
          }
          .amount-hero-left {
            max-width: 60%;
          }
          .amount-hero-label {
            font-size: 11px;
            font-weight: 700;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .amount-hero-val {
            font-size: 28px;
            font-weight: 900;
            color: #38bdf8;
            font-family: ui-monospace, monospace;
            margin-top: 4px;
          }
          .amount-hero-words {
            font-size: 11px;
            color: #e2e8f0;
            margin-top: 6px;
            font-weight: 500;
          }
          .payment-mode-pill {
            background: rgba(255,255,255,0.12);
            border: 1px solid rgba(255,255,255,0.25);
            padding: 8px 16px;
            border-radius: 8px;
            text-align: right;
          }
          .payment-mode-pill .mode-title {
            font-size: 9.5px;
            color: #94a3b8;
            text-transform: uppercase;
            font-weight: 700;
          }
          .payment-mode-pill .mode-val {
            font-size: 12.5px;
            font-weight: 800;
            color: #ffffff;
            margin-top: 2px;
          }
          .payment-details-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11.5px;
          }
          .payment-details-table th, .payment-details-table td {
            padding: 12px 24px;
            border-bottom: 1px solid #e2e8f0;
          }
          .payment-details-table th {
            background: #f1f5f9;
            color: #475569;
            font-weight: 700;
            text-align: left;
            width: 32%;
          }
          .payment-details-table td {
            color: #0f172a;
            font-weight: 600;
          }
          .bank-and-notes-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            border-bottom: 1px solid #cbd5e1;
            background: #ffffff;
          }
          .sub-box {
            padding: 18px 24px;
          }
          .sub-box:first-child {
            border-right: 1px solid #cbd5e1;
            background: #f8fafc;
          }
          .bank-line {
            font-size: 10.5px;
            color: #334155;
            margin-bottom: 3px;
          }
          .footer-sig-row {
            padding: 24px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            background: #ffffff;
          }
          @media print {
            body { padding: 0; background: #fff; }
            .receipt-outer-box { border: 2px solid #0f172a; box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="receipt-outer-box">
          
          <!-- Header Bar: Brand, Details & Document Meta -->
          <div class="header-main-bar">
            <div>
              ${BRAND_LOGO_SVG_HTML}
              <div class="seller-meta-line">
                ${sellerAddress}<br/>
                ${sellerGstin ? `GSTIN: <strong>${sellerGstin}</strong> | ` : ''}PAN: <strong>${sellerPan}</strong> | Email: <strong>${sellerEmail}</strong><br/>
                Contact: <strong>${sellerPhone}</strong>${msmeNumber ? ` | MSME / Udyam: <strong>${msmeNumber}</strong>` : ''}
              </div>
            </div>
            <div class="receipt-title-block">
              <div class="doc-type-title">PAYMENT RECEIPT</div>
              <div class="receipt-ref-number">${payment.receiptNumber}</div>
              <div style="font-size: 11px; color: #475569; margin-top: 4px;">
                <strong>Date:</strong> ${paymentDateStr}
              </div>
              <div class="receipt-status-badge">
                ✓ VERIFIED & SETTLED
              </div>
            </div>
          </div>

          <!-- Parties & Settlement Meta -->
          <div class="meta-grid">
            <div class="meta-cell">
              <div class="section-heading">Received From (Customer / Client)</div>
              <div class="party-name">${clientCompany}</div>
              ${clientName && clientName !== clientCompany ? `<div class="party-line">Attn: <strong>${clientName}</strong></div>` : ''}
              ${clientAddress ? `<div class="party-line">Address: ${clientAddress}</div>` : ''}
              <div class="party-line">GSTIN: <strong style="font-family: ui-monospace, monospace;">${clientGstin}</strong></div>
              ${clientEmail ? `<div class="party-line">Email: <strong>${clientEmail}</strong></div>` : ''}
            </div>

            <div class="meta-cell">
              <div class="section-heading">Reconciled Against Document</div>
              <div class="party-line">Tax Invoice Ref: <strong style="font-family: ui-monospace, monospace; color: #0284c7;">${payment.invoiceNumber}</strong></div>
              ${invoice ? `
                <div class="party-line">Invoice Date: <strong>${formatDateDDMMYYYY(invoice.issueDate)}</strong></div>
                <div class="party-line">Invoice Grand Total: <strong>₹ ${invoice.totalAmount.toLocaleString('en-IN')}</strong></div>
                <div class="party-line">Balance Remaining: <strong style="color: ${invoice.balanceDue > 0 ? '#b91c1c' : '#047857'};">₹ ${invoice.balanceDue.toLocaleString('en-IN')}</strong></div>
              ` : ''}
              <div class="party-line" style="margin-top: 6px;">Issued By: <strong>${payment.recordedBy || 'Accounts Department'}</strong></div>
            </div>
          </div>

          <!-- Amount Banner -->
          <div class="amount-hero-card">
            <div class="amount-hero-left">
              <div class="amount-hero-label">Total Amount Received</div>
              <div class="amount-hero-val">₹ ${payment.amount.toLocaleString('en-IN')}</div>
              <div class="amount-hero-words"><strong>In Words:</strong> ${amountWords}</div>
            </div>
            <div class="payment-mode-pill">
              <div class="mode-title">Settlement Channel</div>
              <div class="mode-val">${paymentMethodLabel}</div>
              <div style="font-size: 10px; color: #93c5fd; font-family: ui-monospace, monospace; margin-top: 4px;">
                ${payment.transactionReference || payment.transactionRef || 'DIRECT SETTLEMENT'}
              </div>
            </div>
          </div>

          <!-- Transaction Breakdown Table -->
          <table class="payment-details-table">
            <tbody>
              <tr>
                <th>Transaction / UTR Reference</th>
                <td style="font-family: ui-monospace, monospace; font-size: 12px; color: #0369a1;">
                  ${payment.transactionReference || payment.transactionRef || 'N/A'}
                </td>
              </tr>
              <tr>
                <th>Settlement Method</th>
                <td>${paymentMethodLabel}</td>
              </tr>
              <tr>
                <th>Payment Date & Time</th>
                <td>${paymentDateStr}</td>
              </tr>
              <tr>
                <th>Narration / Purpose</th>
                <td>${payment.notes || `Settlement towards Tax Invoice ${payment.invoiceNumber}`}</td>
              </tr>
            </tbody>
          </table>

          <!-- Bank & Acknowledgement -->
          <div class="bank-and-notes-grid">
            <div class="sub-box">
              <div class="section-heading">Beneficiary Bank Account</div>
              <div class="bank-line">Bank Name: <strong>${bankName}</strong></div>
              <div class="bank-line">Account Name: <strong>${accountName}</strong></div>
              <div class="bank-line">Account No: <strong>${accountNumber}</strong></div>
              <div class="bank-line">IFSC Code: <strong>${ifscCode}</strong> (${branch})</div>
              <div class="bank-line">UPI VPA: <strong>${upiId}</strong></div>
            </div>

            <div class="sub-box">
              <div class="section-heading">Statutory & Compliance Notice</div>
              <div style="font-size: 10.5px; color: #475569; line-height: 1.5;">
                This document serves as an official electronic money receipt acknowledging receipt of funds. Goods/services are supplied under applicable GST legislation. For any billing queries, write to <strong>${sellerEmail}</strong>.
              </div>
            </div>
          </div>

          <!-- Footer & Signatory -->
          <div class="footer-sig-row">
            <div style="font-size: 10px; color: #64748b; max-width: 400px;">
              Generated securely by <strong>Fusion Forge Creation ERP</strong>.<br/>
              Official Corporate Email: <strong>${sellerEmail}</strong>
            </div>

            <div style="display: flex; align-items: flex-end; gap: 20px;">
              ${cfg.stamp_url ? `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: flex-end; padding-bottom: 2px;">
                  <img src="${cfg.stamp_url}" alt="Company Stamp" style="max-height: 60px; max-width: 60px; object-fit: contain; opacity: 0.9;" />
                  <span style="font-size: 8.5px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-top: 2px;">Company Stamp</span>
                </div>
              ` : ''}

              <div style="text-align: right; min-width: 190px;">
                <div style="font-size: 11.5px; font-weight: 700; color: #0f172a;">For <strong>${sellerCompanyName}</strong></div>
                ${cfg.signature_url ? `
                  <div style="margin: 4px 0; height: 44px; display: flex; align-items: center; justify-content: flex-end;">
                    <img src="${cfg.signature_url}" alt="Authorized Signature" style="max-height: 42px; max-width: 140px; object-fit: contain;" />
                  </div>
                ` : `
                  <div style="margin: 4px 0; height: 44px; display: flex; align-items: center; justify-content: flex-end;">
                    <span style="font-family: 'Brush Script MT', cursive, serif; font-style: italic; font-size: 19px; color: #0284c7; font-weight: 700; opacity: 0.9;">Authorized Signature</span>
                  </div>
                `}
                <div style="font-weight: 800; color: #0f172a; border-top: 1.5px solid #0f172a; display: inline-block; padding-top: 3px; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.5px;">
                  Authorised Signatory
                </div>
              </div>
            </div>
          </div>

        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
