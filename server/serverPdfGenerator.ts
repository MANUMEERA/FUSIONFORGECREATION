import PDFDocument from 'pdfkit';

// Helper for Indian currency formatting
function formatINR(val: number | string | undefined): string {
  if (val === undefined || val === null || isNaN(Number(val))) return '0';
  return Number(val).toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

// Indian Number to words
function numberToWordsINR(amount: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function belowThousand(num: number): string {
    if (num === 0) return '';
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
    const h = Math.floor(num / 100);
    const rem = num % 100;
    return ones[h] + ' Hundred' + (rem ? ' ' + belowThousand(rem) : '');
  }

  if (!amount || amount === 0) return 'Indian Rupees Zero Only';
  const rounded = Math.round(Math.abs(amount));
  const crore = Math.floor(rounded / 10000000);
  const lakh = Math.floor((rounded % 10000000) / 100000);
  const thousand = Math.floor((rounded % 100000) / 1000);
  const remainder = rounded % 1000;

  const parts: string[] = [];
  if (crore > 0) parts.push(belowThousand(crore) + ' Crore');
  if (lakh > 0) parts.push(belowThousand(lakh) + ' Lakh');
  if (thousand > 0) parts.push(belowThousand(thousand) + ' Thousand');
  if (remainder > 0) parts.push(belowThousand(remainder));

  return `Indian Rupees ${parts.join(' ').trim()} Only`;
}

export interface QuotationPdfOptions {
  quotationNumber: string;
  title?: string;
  clientName: string;
  clientCompany?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  clientGstin?: string;
  issueDate?: string;
  validUntil?: string;
  items?: Array<{ description: string; sacCode?: string; quantity: number; rate: number; amount: number }>;
  subtotal?: number;
  discountAmount?: number;
  taxableAmount?: number;
  gstApplicable?: boolean;
  gstType?: string;
  cgstAmount?: number;
  sgstAmount?: number;
  utgstAmount?: number;
  igstAmount?: number;
  totalAmount: number;
  paymentTerms?: string;
  notes?: string;
}

export function generateQuotationPdfBuffer(data: QuotationPdfOptions): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 36, size: 'A4' });
      const buffers: Buffer[] = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      const primaryColor = '#0f172a';
      const accentColor = '#0284c7';
      const slateDark = '#334155';
      const slateLight = '#64748b';

      // --- Header Top Bar ---
      doc.rect(36, 36, 523, 70).fill('#0f172a');

      doc.fillColor('#ffffff').fontSize(16).font('Helvetica-Bold')
        .text('FUSION FORGE CREATION', 50, 48, { characterSpacing: 0.5 });
      doc.fillColor('#38bdf8').fontSize(8).font('Helvetica-Bold')
        .text('WHERE IDEAS FUSE WITH TECHNOLOGY • ENTERPRISE COMMERCIAL PROPOSAL', 50, 68);
      doc.fillColor('#94a3b8').fontSize(7.5).font('Helvetica')
        .text('Yogi Milan, Near Ring Road, Amli, Silvassa, D&NH - 396230 | GSTIN: 24AALFF1234F1Z1 | admin@fusionforgecreation.com', 50, 80);

      // Title & Document Badge
      doc.fillColor(primaryColor).fontSize(14).font('Helvetica-Bold')
        .text('COMMERCIAL QUOTATION', 36, 120);

      doc.fontSize(9).font('Helvetica-Bold').fillColor(accentColor)
        .text(`Quote No: ${data.quotationNumber}`, 380, 120, { align: 'right', width: 179 });
      doc.fontSize(8).font('Helvetica').fillColor(slateDark)
        .text(`Issue Date: ${data.issueDate || 'Current'}`, 380, 134, { align: 'right', width: 179 })
        .text(`Valid Until: ${data.validUntil || '30 Days from Issue'}`, 380, 146, { align: 'right', width: 179 });

      // Client & Scope Details Box
      const boxTop = 160;
      doc.rect(36, boxTop, 523, 76).fillAndStroke('#f8fafc', '#cbd5e1');

      doc.fillColor(slateLight).fontSize(7.5).font('Helvetica-Bold')
        .text('CLIENT / BILLED TO:', 46, boxTop + 8);
      doc.fillColor(primaryColor).fontSize(10).font('Helvetica-Bold')
        .text(data.clientCompany || data.clientName, 46, boxTop + 20);
      doc.fillColor(slateDark).fontSize(8).font('Helvetica')
        .text(`Attn: ${data.clientName}`, 46, boxTop + 33)
        .text(`Email: ${data.clientEmail || 'N/A'}${data.clientPhone ? ` | Tel: ${data.clientPhone}` : ''}`, 46, boxTop + 45)
        .text(`GSTIN: ${data.clientGstin || 'Unregistered / Individual'}${data.clientAddress ? ` | Addr: ${data.clientAddress}` : ''}`, 46, boxTop + 57, { width: 280 });

      doc.fillColor(slateLight).fontSize(7.5).font('Helvetica-Bold')
        .text('PROPOSAL & TERMS:', 340, boxTop + 8);
      doc.fillColor(accentColor).fontSize(9).font('Helvetica-Bold')
        .text(data.title || 'Enterprise Engineering Scope', 340, boxTop + 20, { width: 200 });
      doc.fillColor(slateDark).fontSize(8).font('Helvetica')
        .text(`Payment Terms: ${data.paymentTerms || '50% Advance, 50% on Delivery'}`, 340, boxTop + 36, { width: 200 })
        .text('Currency: INR (Indian Rupees)', 340, boxTop + 52);

      // --- Items Table ---
      const tableTop = 250;
      doc.rect(36, tableTop, 523, 20).fill(primaryColor);
      doc.fillColor('#ffffff').fontSize(8).font('Helvetica-Bold');
      doc.text('DESCRIPTION OF DELIVERABLES / SERVICES', 46, tableTop + 6);
      doc.text('QTY', 330, tableTop + 6, { width: 35, align: 'center' });
      doc.text('RATE (INR)', 375, tableTop + 6, { width: 85, align: 'right' });
      doc.text('AMOUNT (INR)', 470, tableTop + 6, { width: 80, align: 'right' });

      let currentY = tableTop + 20;
      const items = data.items && data.items.length > 0 ? data.items : [
        { description: data.title || 'Professional Technical & Software Engineering Services', sacCode: '998314', quantity: 1, rate: data.totalAmount, amount: data.totalAmount }
      ];

      items.forEach((item, idx) => {
        const rowHeight = 26;
        if (idx % 2 === 0) {
          doc.rect(36, currentY, 523, rowHeight).fill('#ffffff');
        } else {
          doc.rect(36, currentY, 523, rowHeight).fill('#f8fafc');
        }
        doc.rect(36, currentY, 523, rowHeight).stroke('#e2e8f0');

        doc.fillColor(primaryColor).fontSize(8).font('Helvetica-Bold')
          .text(item.description, 46, currentY + 5, { width: 275 });
        if (item.sacCode) {
          doc.fillColor(slateLight).fontSize(7).font('Helvetica')
            .text(`SAC/HSN: ${item.sacCode}`, 46, currentY + 15);
        }

        doc.fillColor(slateDark).fontSize(8).font('Helvetica')
          .text(String(item.quantity || 1), 330, currentY + 8, { width: 35, align: 'center' });
        doc.text(formatINR(item.rate), 375, currentY + 8, { width: 85, align: 'right' });
        doc.fillColor(primaryColor).fontSize(8).font('Helvetica-Bold')
          .text(formatINR(item.amount), 470, currentY + 8, { width: 80, align: 'right' });

        currentY += rowHeight;
      });

      // --- Totals and Summary Box ---
      currentY += 12;
      const subtotal = data.subtotal || data.totalAmount;
      const totalAmount = data.totalAmount;

      const summaryBoxWidth = 220;
      const summaryLeft = 559 - summaryBoxWidth;

      doc.rect(summaryLeft, currentY, summaryBoxWidth, 75).fillAndStroke('#f8fafc', '#cbd5e1');

      doc.fillColor(slateDark).fontSize(8).font('Helvetica')
        .text('Subtotal:', summaryLeft + 10, currentY + 8)
        .text(`INR ${formatINR(subtotal)}`, summaryLeft + 10, currentY + 8, { width: summaryBoxWidth - 20, align: 'right' });

      if (data.discountAmount && data.discountAmount > 0) {
        doc.text('Discount:', summaryLeft + 10, currentY + 22)
          .text(`- INR ${formatINR(data.discountAmount)}`, summaryLeft + 10, currentY + 22, { width: summaryBoxWidth - 20, align: 'right' });
      }

      if (data.cgstAmount || data.sgstAmount || data.igstAmount) {
        const gstVal = (data.cgstAmount || 0) + (data.sgstAmount || 0) + (data.igstAmount || 0) + (data.utgstAmount || 0);
        doc.text('GST Component:', summaryLeft + 10, currentY + 36)
          .text(`INR ${formatINR(gstVal)}`, summaryLeft + 10, currentY + 36, { width: summaryBoxWidth - 20, align: 'right' });
      }

      // Grand Total Row
      doc.rect(summaryLeft, currentY + 50, summaryBoxWidth, 25).fill(primaryColor);
      doc.fillColor('#ffffff').fontSize(9).font('Helvetica-Bold')
        .text('GRAND TOTAL:', summaryLeft + 10, currentY + 57)
        .text(`INR ${formatINR(totalAmount)}`, summaryLeft + 10, currentY + 57, { width: summaryBoxWidth - 20, align: 'right' });

      // Amount in Words Box
      doc.rect(36, currentY, summaryLeft - 46, 75).fillAndStroke('#f1f5f9', '#cbd5e1');
      doc.fillColor(primaryColor).fontSize(7.5).font('Helvetica-Bold')
        .text('AMOUNT IN WORDS:', 46, currentY + 8);
      doc.fillColor(accentColor).fontSize(8.5).font('Helvetica-Bold')
        .text(numberToWordsINR(totalAmount), 46, currentY + 20, { width: summaryLeft - 66 });
      doc.fillColor(slateLight).fontSize(7).font('Helvetica')
        .text('Bank details: HDFC Bank Ltd | A/c No: 50200012345678 | IFSC: HDFC0001234 | UPI: fusionforge@hdfcbank', 46, currentY + 48, { width: summaryLeft - 66 });

      // --- Terms and Conditions & Signatory ---
      currentY += 88;
      doc.rect(36, currentY, 523, 1).fill('#cbd5e1');
      currentY += 8;

      doc.fillColor(primaryColor).fontSize(8).font('Helvetica-Bold')
        .text('Terms & Conditions:', 36, currentY);
      doc.fillColor(slateDark).fontSize(7).font('Helvetica')
        .text('1. 50% advance along with confirmed work order to initiate sprint kickoff.\n2. Balance 50% payable upon staging delivery and milestone completion.\n3. Taxes applicable as per Indian GST regulations.\n4. For official queries, contact admin@fusionforgecreation.com.', 36, currentY + 12, { width: 330 });

      // Signature Block
      doc.fillColor(primaryColor).fontSize(8).font('Helvetica-Bold')
        .text('For FUSION FORGE CREATION', 390, currentY, { align: 'right', width: 169 });
      doc.fontSize(11).font('Helvetica-Bold').fillColor(accentColor)
        .text('Authorized Signatory', 390, currentY + 28, { align: 'right', width: 169 });
      doc.rect(390, currentY + 44, 169, 1).fill(primaryColor);
      doc.fontSize(7).font('Helvetica').fillColor(slateLight)
        .text('Commercial Director / Signatory Authority', 390, currentY + 47, { align: 'right', width: 169 });

      // --- Footer Notice ---
      doc.fontSize(7).font('Helvetica').fillColor('#94a3b8')
        .text('Generated electronically via Fusion Forge Creation Commercial Infrastructure • https://fusionforgecreation.com', 36, 780, { align: 'center', width: 523 });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

export interface InvoicePdfOptions {
  invoiceNumber: string;
  clientName: string;
  clientCompany?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  clientGstin?: string;
  issueDate?: string;
  dueDate?: string;
  items?: Array<{ description: string; sacCode?: string; quantity: number; rate: number; amount: number }>;
  subtotal?: number;
  discountAmount?: number;
  taxableAmount?: number;
  cgstAmount?: number;
  sgstAmount?: number;
  utgstAmount?: number;
  igstAmount?: number;
  totalAmount: number;
  notes?: string;
  paymentTerms?: string;
}

export function generateInvoicePdfBuffer(data: InvoicePdfOptions): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 36, size: 'A4' });
      const buffers: Buffer[] = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      const primaryColor = '#0f172a';
      const accentColor = '#0284c7';
      const slateDark = '#334155';
      const slateLight = '#64748b';

      // --- Header Top Bar ---
      doc.rect(36, 36, 523, 70).fill('#0f172a');

      doc.fillColor('#ffffff').fontSize(16).font('Helvetica-Bold')
        .text('FUSION FORGE CREATION', 50, 48, { characterSpacing: 0.5 });
      doc.fillColor('#38bdf8').fontSize(8).font('Helvetica-Bold')
        .text('WHERE IDEAS FUSE WITH TECHNOLOGY • OFFICIAL GST TAX INVOICE', 50, 68);
      doc.fillColor('#94a3b8').fontSize(7.5).font('Helvetica')
        .text('Yogi Milan, Near Ring Road, Amli, Silvassa, D&NH - 396230 | GSTIN: 24AALFF1234F1Z1 | PAN: AALFF1234F | admin@fusionforgecreation.com', 50, 80);

      // Title & Document Badge
      doc.fillColor(primaryColor).fontSize(14).font('Helvetica-Bold')
        .text('TAX INVOICE', 36, 120);

      doc.fontSize(9).font('Helvetica-Bold').fillColor(accentColor)
        .text(`Invoice No: ${data.invoiceNumber}`, 380, 120, { align: 'right', width: 179 });
      doc.fontSize(8).font('Helvetica').fillColor(slateDark)
        .text(`Date of Issue: ${data.issueDate || 'Current'}`, 380, 134, { align: 'right', width: 179 })
        .text(`Due Date: ${data.dueDate || 'Immediate / 15 Days'}`, 380, 146, { align: 'right', width: 179 });

      // Client & Billed Details Box
      const boxTop = 160;
      doc.rect(36, boxTop, 523, 76).fillAndStroke('#f8fafc', '#cbd5e1');

      doc.fillColor(slateLight).fontSize(7.5).font('Helvetica-Bold')
        .text('BILLED TO (BUYER / RECIPIENT):', 46, boxTop + 8);
      doc.fillColor(primaryColor).fontSize(10).font('Helvetica-Bold')
        .text(data.clientCompany || data.clientName, 46, boxTop + 20);
      doc.fillColor(slateDark).fontSize(8).font('Helvetica')
        .text(`Attn: ${data.clientName}`, 46, boxTop + 33)
        .text(`Email: ${data.clientEmail || 'N/A'}${data.clientPhone ? ` | Tel: ${data.clientPhone}` : ''}`, 46, boxTop + 45)
        .text(`GSTIN: ${data.clientGstin || 'URP / Unregistered'}${data.clientAddress ? ` | Addr: ${data.clientAddress}` : ''}`, 46, boxTop + 57, { width: 280 });

      doc.fillColor(slateLight).fontSize(7.5).font('Helvetica-Bold')
        .text('STATUTORY DETAILS:', 340, boxTop + 8);
      doc.fillColor(primaryColor).fontSize(8).font('Helvetica')
        .text('Reverse Charge: No', 340, boxTop + 20)
        .text('Place of Supply: 24-Gujarat / D&NH', 340, boxTop + 33)
        .text('SAC Code: 998314 (IT Consulting & Dev)', 340, boxTop + 46)
        .text(`Payment Due: ${data.dueDate || '15 Days'}`, 340, boxTop + 59);

      // --- Items Table ---
      const tableTop = 250;
      doc.rect(36, tableTop, 523, 20).fill(primaryColor);
      doc.fillColor('#ffffff').fontSize(8).font('Helvetica-Bold');
      doc.text('DESCRIPTION OF GOODS / SERVICES', 46, tableTop + 6);
      doc.text('QTY', 330, tableTop + 6, { width: 35, align: 'center' });
      doc.text('UNIT RATE (INR)', 375, tableTop + 6, { width: 85, align: 'right' });
      doc.text('AMOUNT (INR)', 470, tableTop + 6, { width: 80, align: 'right' });

      let currentY = tableTop + 20;
      const items = data.items && data.items.length > 0 ? data.items : [
        { description: 'Enterprise Full-Stack Software Engineering & Deployment Services', sacCode: '998314', quantity: 1, rate: data.totalAmount, amount: data.totalAmount }
      ];

      items.forEach((item, idx) => {
        const rowHeight = 26;
        if (idx % 2 === 0) {
          doc.rect(36, currentY, 523, rowHeight).fill('#ffffff');
        } else {
          doc.rect(36, currentY, 523, rowHeight).fill('#f8fafc');
        }
        doc.rect(36, currentY, 523, rowHeight).stroke('#e2e8f0');

        doc.fillColor(primaryColor).fontSize(8).font('Helvetica-Bold')
          .text(item.description, 46, currentY + 5, { width: 275 });
        if (item.sacCode) {
          doc.fillColor(slateLight).fontSize(7).font('Helvetica')
            .text(`SAC/HSN: ${item.sacCode}`, 46, currentY + 15);
        }

        doc.fillColor(slateDark).fontSize(8).font('Helvetica')
          .text(String(item.quantity || 1), 330, currentY + 8, { width: 35, align: 'center' });
        doc.text(formatINR(item.rate), 375, currentY + 8, { width: 85, align: 'right' });
        doc.fillColor(primaryColor).fontSize(8).font('Helvetica-Bold')
          .text(formatINR(item.amount), 470, currentY + 8, { width: 80, align: 'right' });

        currentY += rowHeight;
      });

      // --- Financial Totals Box ---
      currentY += 12;
      const subtotal = data.subtotal || data.totalAmount;
      const totalAmount = data.totalAmount;

      const summaryBoxWidth = 220;
      const summaryLeft = 559 - summaryBoxWidth;

      doc.rect(summaryLeft, currentY, summaryBoxWidth, 80).fillAndStroke('#f8fafc', '#cbd5e1');

      doc.fillColor(slateDark).fontSize(8).font('Helvetica')
        .text('Taxable Amount:', summaryLeft + 10, currentY + 8)
        .text(`INR ${formatINR(subtotal)}`, summaryLeft + 10, currentY + 8, { width: summaryBoxWidth - 20, align: 'right' });

      if (data.cgstAmount || data.sgstAmount || data.igstAmount) {
        const gstVal = (data.cgstAmount || 0) + (data.sgstAmount || 0) + (data.igstAmount || 0) + (data.utgstAmount || 0);
        doc.text('GST Component (18%):', summaryLeft + 10, currentY + 22)
          .text(`INR ${formatINR(gstVal)}`, summaryLeft + 10, currentY + 22, { width: summaryBoxWidth - 20, align: 'right' });
      }

      // Grand Total Due Row
      doc.rect(summaryLeft, currentY + 50, summaryBoxWidth, 30).fill(primaryColor);
      doc.fillColor('#ffffff').fontSize(9).font('Helvetica-Bold')
        .text('TOTAL INVOICE DUE:', summaryLeft + 10, currentY + 59)
        .text(`INR ${formatINR(totalAmount)}`, summaryLeft + 10, currentY + 59, { width: summaryBoxWidth - 20, align: 'right' });

      // Amount in Words & Bank Details Box
      doc.rect(36, currentY, summaryLeft - 46, 80).fillAndStroke('#f1f5f9', '#cbd5e1');
      doc.fillColor(primaryColor).fontSize(7.5).font('Helvetica-Bold')
        .text('INVOICE TOTAL IN WORDS:', 46, currentY + 8);
      doc.fillColor(accentColor).fontSize(8.5).font('Helvetica-Bold')
        .text(numberToWordsINR(totalAmount), 46, currentY + 20, { width: summaryLeft - 66 });
      doc.fillColor(slateDark).fontSize(7.5).font('Helvetica')
        .text('Bank Name: HDFC Bank Ltd | A/c No: 50200012345678 | IFSC: HDFC0001234 | UPI VPA: fusionforge@hdfcbank', 46, currentY + 48, { width: summaryLeft - 66 });

      // --- Terms & Signatory ---
      currentY += 92;
      doc.rect(36, currentY, 523, 1).fill('#cbd5e1');
      currentY += 8;

      doc.fillColor(primaryColor).fontSize(8).font('Helvetica-Bold')
        .text('Declarations & Terms:', 36, currentY);
      doc.fillColor(slateDark).fontSize(7).font('Helvetica')
        .text('1. We declare that this invoice shows the actual price of the services described.\n2. Delayed payments exceeding due date attract interest @ 18% p.a.\n3. Subject to Silvassa / Dadra & Nagar Haveli jurisdiction.\n4. Official Mail: admin@fusionforgecreation.com', 36, currentY + 12, { width: 330 });

      // Signature Block
      doc.fillColor(primaryColor).fontSize(8).font('Helvetica-Bold')
        .text('For FUSION FORGE CREATION', 390, currentY, { align: 'right', width: 169 });
      doc.fontSize(11).font('Helvetica-Bold').fillColor(accentColor)
        .text('Authorized Signatory', 390, currentY + 28, { align: 'right', width: 169 });
      doc.rect(390, currentY + 44, 169, 1).fill(primaryColor);
      doc.fontSize(7).font('Helvetica').fillColor(slateLight)
        .text('Authorised Representative', 390, currentY + 47, { align: 'right', width: 169 });

      // Footer
      doc.fontSize(7).font('Helvetica').fillColor('#94a3b8')
        .text('Electronic GST Tax Invoice • Fusion Forge Creation • https://fusionforgecreation.com', 36, 780, { align: 'center', width: 523 });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
