import { Quotation, Invoice } from '../types';
import { AGENCY_CONFIG } from '../mockData';
import { numberToWordsIndian } from './numberToWords';

const BRAND_LOGO_SVG_HTML = `
  <div style="display: flex; align-items: center; gap: 14px;">
    <svg width="48" height="48" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pdfNavy" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#08143d"/>
          <stop offset="60%" stop-color="#0d2466"/>
          <stop offset="100%" stop-color="#13368a"/>
        </linearGradient>
        <linearGradient id="pdfCyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0056d6"/>
          <stop offset="45%" stop-color="#0088ff"/>
          <stop offset="100%" stop-color="#00d2ff"/>
        </linearGradient>
      </defs>
      <g transform="translate(10, 4) scale(0.9)">
        <path d="M 32 15 C 22 15 15 22 15 32 L 15 140 L 40 120 L 40 85 L 68 85 L 82 65 L 40 65 L 40 40 L 105 40 L 125 15 Z" fill="url(#pdfNavy)"/>
        <rect x="132" y="10" width="13" height="13" rx="1.5" fill="#00d2ff"/>
        <rect x="114" y="24" width="13" height="13" rx="1.5" fill="#00a2ff"/>
        <rect x="132" y="27" width="13" height="13" rx="1.5" fill="#0088ff"/>
        <rect x="114" y="41" width="13" height="13" rx="1.5" fill="#0066ee"/>
        <path d="M 52 48 C 65 48 85 45 110 45 C 118 45 125 50 115 62 L 68 62 L 68 85 L 102 85 C 108 85 112 90 105 100 L 68 100 L 68 145 L 44 145 L 44 68 C 44 56 48 48 52 48 Z" fill="url(#pdfCyan)"/>
        <path d="M 44 68 L 68 62 L 68 100 L 44 92 Z" fill="#003899" opacity="0.45"/>
      </g>
    </svg>
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

export function generateQuotationPDF(quote: Quotation) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to view/print the official quotation document.');
    return;
  }

  const taxableAmount = quote.taxableAmount ?? (quote.subtotal - (quote.discountAmount || 0));
  const totalGst = (quote.cgstAmount || 0) + (quote.sgstAmount || 0) + (quote.igstAmount || 0);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Quotation ${quote.quoteNumber} - Fusion Forge Creation</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
            color: #0f172a; 
            margin: 0; 
            padding: 40px; 
            background: #fff; 
            max-width: 800px; 
            margin: 0 auto; 
          }
          .header { 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-start; 
            border-bottom: 2px solid #0f172a; 
            padding-bottom: 20px; 
            margin-bottom: 24px; 
          }
          .brand-title { 
            font-size: 24px; 
            font-weight: 900; 
            color: #0f172a; 
            letter-spacing: -0.5px; 
          }
          .brand-subtitle { 
            font-size: 11px; 
            font-weight: 700; 
            color: #0284c7; 
            text-transform: uppercase; 
            margin-top: 2px; 
            letter-spacing: 0.5px; 
          }
          .doc-badge { 
            display: inline-block; 
            font-size: 18px; 
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
            gap: 24px; 
            margin-bottom: 24px; 
            background: #f8fafc; 
            padding: 16px; 
            border-radius: 8px; 
            border: 1px solid #e2e8f0; 
            font-size: 13px; 
          }
          .table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 24px; 
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
            margin-bottom: 30px; 
          }
          .summary-box { 
            width: 320px; 
            font-size: 13px; 
            background: #f8fafc; 
            padding: 16px; 
            border-radius: 8px; 
            border: 1px solid #e2e8f0; 
          }
          .summary-row { 
            display: flex; 
            justify-content: space-between; 
            padding: 6px 0; 
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
            margin-top: 36px; 
            border-top: 1px solid #e2e8f0; 
            padding-top: 16px; 
            line-height: 1.6; 
          }
          .footer-sig { 
            margin-top: 40px; 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-end; 
            font-size: 12px; 
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            ${BRAND_LOGO_SVG_HTML}
            <div style="font-size: 11px; color: #64748b; margin-top: 8px; line-height: 1.4;">
              ${AGENCY_CONFIG.address}, ${AGENCY_CONFIG.city}, ${AGENCY_CONFIG.state} - ${AGENCY_CONFIG.postalCode}<br/>
              GSTIN: <strong>${AGENCY_CONFIG.gstin}</strong> | PAN: <strong>${AGENCY_CONFIG.pan}</strong> | Email: ${AGENCY_CONFIG.email}
            </div>
          </div>
          <div class="meta-box">
            <div class="doc-badge">QUOTATION</div>
            <div><strong>Quotation No:</strong> ${quote.quoteNumber}</div>
            <div><strong>Issue Date:</strong> ${quote.issueDate}</div>
            <div><strong>Valid Until:</strong> ${quote.validUntil}</div>
          </div>
        </div>

        <div class="client-grid">
          <div>
            <div style="font-weight: 700; color: #64748b; text-transform: uppercase; font-size: 10px; margin-bottom: 4px;">Client Details:</div>
            <div style="font-size: 15px; font-weight: 800; color: #0f172a;">${quote.clientCompany || quote.clientName}</div>
            <div>Contact: <strong>${quote.clientName}</strong></div>
            <div>Email: ${quote.clientEmail}</div>
          </div>
          <div>
            <div style="font-weight: 700; color: #64748b; text-transform: uppercase; font-size: 10px; margin-bottom: 4px;">Scope / Subject:</div>
            <div style="font-size: 13px; font-weight: 700; color: #1e3a8a; margin-bottom: 4px;">${quote.title}</div>
            <div style="font-size: 12px; color: #475569;">Taxation: ${quote.gstType === 'none' ? 'Tax Exempt' : quote.gstType === 'cgst_sgst' ? 'CGST (9%) + SGST (9%)' : 'IGST (18%)'}</div>
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th style="width: 45%;">Description</th>
              <th style="width: 15%; text-align: center;">Qty</th>
              <th style="width: 20%; text-align: right;">Rate</th>
              <th style="width: 20%; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${quote.items.map(item => `
              <tr>
                <td><strong>${item.description}</strong></td>
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
            <div class="summary-row" style="border-top: 1px dashed #cbd5e1; padding-top: 8px;">
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
            ` : quote.gstType === 'igst' ? `
              <div class="summary-row">
                <span>Integrated Tax (IGST 18%)</span>
                <span class="val">₹ ${(quote.igstAmount || totalGst).toLocaleString('en-IN')}</span>
              </div>
            ` : `
              <div class="summary-row">
                <span>GST (0%)</span>
                <span class="val">₹ 0</span>
              </div>
            `}
            <div class="summary-row summary-total">
              <span>Grand Total</span>
              <span class="val">₹ ${quote.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div class="terms">
          <strong style="color: #0f172a;">Terms & Conditions:</strong><br/>
          ${(quote.termsAndConditions || AGENCY_CONFIG.terms).map((t, i) => `${i + 1}. ${t}<br/>`).join('')}
        </div>

        <div class="footer-sig">
          <div style="font-size: 11px; color: #64748b;">
            System Generated Electronic Estimate<br/>
            Valid for commercial procurement
          </div>
          <div style="text-align: right;">
            <div>For <strong>FUSION FORGE CREATION</strong></div>
            <div style="margin-top: 36px; font-weight: 700; color: #0f172a; border-top: 1px solid #0f172a; display: inline-block; padding-top: 4px;">Authorized Signatory</div>
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

export function generateInvoicePDF(invoice: Invoice) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to view/print the official tax invoice.');
    return;
  }

  const taxableAmount = invoice.taxableAmount ?? (invoice.subtotal - (invoice.discountAmount || 0));
  const amountWords = invoice.amountInWords || numberToWordsIndian(invoice.totalAmount, invoice.currency || 'INR');

  // Seller values
  const sellerName = invoice.sellerName || 'Fusion Forge Creation';
  const sellerAddress = invoice.sellerAddress || `${AGENCY_CONFIG.address}, ${AGENCY_CONFIG.city}, ${AGENCY_CONFIG.state} - ${AGENCY_CONFIG.postalCode}`;
  const sellerGstin = invoice.sellerGstin || AGENCY_CONFIG.gstin;
  const sellerState = invoice.sellerState || 'Odisha [21]';

  // Buyer values
  const buyerCompany = invoice.buyerCompany || invoice.clientCompany || invoice.clientName || 'JP MODATEX LLP';
  const buyerAddress = invoice.buyerAddress || invoice.clientAddress || 'Survey No. 42, GIDC Industrial Estate, Sachin, Surat, Gujarat - 394230';
  const buyerGstin = invoice.buyerGstin || invoice.clientGstin || '—';
  const buyerState = invoice.buyerState || (invoice.buyerStateCode ? `${invoice.buyerState} [${invoice.buyerStateCode}]` : 'Gujarat [24]');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>INVOICE ${invoice.invoiceNumber} - Fusion Forge Creation</title>
        <style>
          @page {
            size: A4;
            margin: 15mm;
          }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
            color: #0f172a; 
            margin: 0; 
            padding: 30px; 
            background: #fff; 
            max-width: 820px;
            margin: 0 auto;
            line-height: 1.5;
          }
          .header-title-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid #0f172a;
            padding-bottom: 14px;
            margin-bottom: 20px;
          }
          .doc-type-title {
            font-size: 26px;
            font-weight: 900;
            letter-spacing: 1px;
            color: #0f172a;
          }
          .invoice-ref-number {
            font-size: 20px;
            font-weight: 800;
            font-family: ui-monospace, monospace;
            color: #0284c7;
          }
          .parties-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 24px;
          }
          .party-card {
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 16px;
            font-size: 13px;
          }
          .party-header {
            font-size: 12px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #475569;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 6px;
            margin-bottom: 8px;
          }
          .party-name {
            font-size: 16px;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 4px;
          }
          .party-detail {
            color: #334155;
            margin-bottom: 3px;
          }
          .party-detail strong {
            color: #0f172a;
          }
          .table-container {
            margin-bottom: 20px;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
          }
          .items-table th {
            background: #0f172a;
            color: #ffffff;
            padding: 10px 12px;
            text-align: left;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.5px;
          }
          .items-table td {
            padding: 12px;
            border-bottom: 1px solid #e2e8f0;
          }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .font-mono { font-family: ui-monospace, monospace; }
          
          .calc-section {
            display: grid;
            grid-template-columns: 1fr 340px;
            gap: 24px;
            margin-bottom: 24px;
          }
          .meta-info-card {
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 14px;
            font-size: 12px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .meta-row {
            margin-bottom: 8px;
          }
          .meta-row strong {
            color: #0f172a;
          }
          .status-badge {
            display: inline-block;
            padding: 2px 10px;
            border-radius: 12px;
            font-weight: 800;
            font-size: 11px;
            text-transform: uppercase;
            background: #dcfce7;
            color: #166534;
            border: 1px solid #bbf7d0;
          }
          .summary-card {
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 16px;
            font-size: 13px;
          }
          .summary-item {
            display: flex;
            justify-content: space-between;
            padding: 4px 0;
            color: #475569;
          }
          .summary-item .val {
            color: #0f172a;
            font-weight: 600;
            font-family: ui-monospace, monospace;
          }
          .divider {
            border-top: 1px dashed #cbd5e1;
            margin: 6px 0;
          }
          .grand-total-row {
            display: flex;
            justify-content: space-between;
            font-size: 16px;
            font-weight: 900;
            color: #0f172a;
            border-top: 2px solid #0f172a;
            padding-top: 8px;
            margin-top: 8px;
          }
          .words-card {
            background: #f1f5f9;
            border-left: 4px solid #0284c7;
            padding: 10px 14px;
            font-size: 12px;
            margin-bottom: 20px;
            border-radius: 0 6px 6px 0;
          }
          .words-card strong {
            color: #0f172a;
          }
          .sig-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            font-size: 12px;
            padding-top: 14px;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header-title-bar">
          <div style="display: flex; align-items: center; gap: 16px;">
            ${BRAND_LOGO_SVG_HTML}
          </div>
          <div style="text-align: right;">
            <div class="doc-type-title">TAX INVOICE</div>
            <div class="invoice-ref-number">${invoice.invoiceNumber}</div>
            <div style="font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase;">GST COMPLIANT (SAC: 998314)</div>
          </div>
        </div>

        <div class="parties-grid">
          <!-- Seller Details -->
          <div class="party-card">
            <div class="party-header">Seller:</div>
            <div class="party-name">${sellerName}</div>
            <div class="party-detail"><strong>Address:</strong> ${sellerAddress}</div>
            <div class="party-detail"><strong>GSTIN:</strong> ${sellerGstin}</div>
            <div class="party-detail"><strong>State:</strong> ${sellerState}</div>
          </div>

          <!-- Buyer Details -->
          <div class="party-card">
            <div class="party-header">Buyer:</div>
            <div class="party-name">${buyerCompany}</div>
            <div class="party-detail"><strong>Address:</strong> ${buyerAddress}</div>
            <div class="party-detail"><strong>GSTIN:</strong> ${buyerGstin}</div>
            <div class="party-detail"><strong>State:</strong> ${buyerState}</div>
          </div>
        </div>

        <!-- Description Table -->
        <div class="table-container">
          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 50%;">Description</th>
                <th style="width: 14%; text-align: center;">Qty</th>
                <th style="width: 18%; text-align: right;">Rate</th>
                <th style="width: 18%; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map(item => `
                <tr>
                  <td>
                    <div style="font-weight: 700; color: #0f172a;">${item.description}</div>
                    ${item.sacCode ? `<div style="font-size: 10px; color: #64748b;">SAC Code: ${item.sacCode}</div>` : ''}
                  </td>
                  <td class="text-center font-mono">${item.quantity}</td>
                  <td class="text-right font-mono">₹ ${item.rate.toLocaleString('en-IN')}</td>
                  <td class="text-right font-mono" style="font-weight: 700; color: #0f172a;">₹ ${item.amount.toLocaleString('en-IN')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Calculations & Tax Summary -->
        <div class="calc-section">
          <div class="meta-info-card">
            <div>
              <div class="meta-row"><strong>Payment Status:</strong> <span class="status-badge">${invoice.status.replace('_', ' ')}</span></div>
              <div class="meta-row"><strong>Due Date:</strong> ${invoice.dueDate}</div>
              <div class="meta-row"><strong>Issue Date:</strong> ${invoice.issueDate}</div>
              ${invoice.notes ? `<div class="meta-row"><strong>Notes:</strong> ${invoice.notes}</div>` : ''}
            </div>
            <div style="font-size: 11px; color: #64748b; margin-top: 10px;">
              Bank: <strong>${invoice.bankDetails.bankName}</strong> | A/C: <strong>${invoice.bankDetails.accountNumber}</strong><br/>
              IFSC: <strong>${invoice.bankDetails.ifscCode}</strong> | UPI: <strong>${invoice.bankDetails.upiId}</strong>
            </div>
          </div>

          <div class="summary-card">
            <div class="summary-item">
              <span>Subtotal</span>
              <span class="val">₹ ${invoice.subtotal.toLocaleString('en-IN')}</span>
            </div>
            
            <div class="summary-item" style="color: ${invoice.discountAmount > 0 ? '#059669' : '#64748b'};">
              <span>Discount</span>
              <span class="val" style="color: ${invoice.discountAmount > 0 ? '#059669' : '#0f172a'};">
                ${invoice.discountAmount > 0 ? `- ₹ ${invoice.discountAmount.toLocaleString('en-IN')}` : '₹ 0'}
              </span>
            </div>

            <div class="divider"></div>

            <div class="summary-item">
              <span><strong>Taxable Amount</strong></span>
              <span class="val"><strong>₹ ${taxableAmount.toLocaleString('en-IN')}</strong></span>
            </div>

            <div class="divider"></div>

            ${(invoice.cgstAmount || 0) > 0 ? `
            <div class="summary-item">
              <span>Central Tax (CGST 9%)</span>
              <span class="val">₹ ${(invoice.cgstAmount || 0).toLocaleString('en-IN')}</span>
            </div>` : ''}

            ${(invoice.sgstAmount || 0) > 0 ? `
            <div class="summary-item">
              <span>State Tax (SGST 9%)</span>
              <span class="val">₹ ${(invoice.sgstAmount || 0).toLocaleString('en-IN')}</span>
            </div>` : ''}

            ${(invoice.utgstAmount || 0) > 0 ? `
            <div class="summary-item">
              <span>Union Territory Tax (UTGST 9%)</span>
              <span class="val">₹ ${(invoice.utgstAmount || 0).toLocaleString('en-IN')}</span>
            </div>` : ''}

            ${(invoice.igstAmount || 0) > 0 ? `
            <div class="summary-item">
              <span>Integrated Tax (IGST 18%)</span>
              <span class="val">₹ ${(invoice.igstAmount || 0).toLocaleString('en-IN')}</span>
            </div>` : ''}

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

        <!-- Signatures & Authority -->
        <div class="sig-row">
          <div style="font-size: 11px; color: #64748b;">
            This is a computer-generated tax invoice and requires no physical signature.<br/>
            Issued by <strong>${sellerName}</strong>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 12px; font-weight: 700; color: #0f172a;">For ${sellerName}</div>
            <div style="margin-top: 36px; font-weight: 800; color: #0f172a; border-top: 1px solid #0f172a; display: inline-block; padding-top: 4px; font-size: 12px;">
              Authorized Signatory
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
