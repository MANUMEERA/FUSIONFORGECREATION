import { Quotation, Payment, Invoice, ManagedProject, ProjectStatus, ProjectEnquiry } from '../types';
import { formatDateDDMMYYYY } from './dateUtils';

export interface EmailDispatchResult {
  success: boolean;
  messageId?: string;
  sender: string;
  recipient: string;
  timestamp: string;
  error?: string;
}

export async function sendQuotationEmailBackend(
  quote: Quotation, 
  customRecipient?: string,
  customSubject?: string, 
  customNotes?: string,
  agencyConfig?: any
): Promise<EmailDispatchResult> {
  const senderEmail = agencyConfig?.email || 'admin@fusionforgecreation.com';
  
  let recipientEmail = quote.clientEmail || '';
  let subject = `Commercial Quotation: ${quote.quoteNumber} - ${quote.title}`;
  let notes = quote.notes || '';

  if (customRecipient && customRecipient.includes('@')) {
    recipientEmail = customRecipient;
    if (customSubject) subject = customSubject;
    if (customNotes) notes = customNotes;
  } else if (customRecipient && !customRecipient.includes('@')) {
    subject = customRecipient;
    if (customSubject) notes = customSubject;
  }
  const timestamp = new Date().toISOString();

  const isGstActive = quote.gstApplicable !== false && quote.gstType !== 'none' && (quote.totalAmount > (quote.taxableAmount || quote.subtotal));

  const emailPayload = {
    sender: senderEmail,
    senderName: 'Fusion Forge Creation Admin',
    to: recipientEmail,
    clientName: quote.clientName,
    clientCompany: quote.clientCompany,
    clientEmail: recipientEmail,
    quotationNumber: quote.quoteNumber,
    subject: subject,
    issueDate: formatDateDDMMYYYY(quote.issueDate),
    validUntil: formatDateDDMMYYYY(quote.validUntil),
    totalAmount: quote.totalAmount,
    subtotal: quote.subtotal,
    taxableAmount: quote.taxableAmount,
    discountAmount: quote.discountAmount,
    cgstAmount: quote.cgstAmount,
    sgstAmount: quote.sgstAmount,
    igstAmount: quote.igstAmount,
    currency: quote.currency || 'INR',
    items: quote.items,
    gstApplicable: isGstActive,
    notes: customNotes || quote.notes || 'Please find attached the official Commercial Quotation for your review.',
    paymentTerms: quote.paymentTerms || '50% Milestone Advance, 50% on Project Delivery'
  };

  try {
    const response = await fetch('/api/send-quotation-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    });

    let data: any = {};
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (response.ok && data.success) {
      return {
        success: true,
        messageId: data.messageId || `msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        sender: senderEmail,
        recipient: recipientEmail,
        timestamp
      };
    } else {
      const errorMsg = data.error || 'Failed to dispatch quotation email.';
      return {
        success: false,
        error: errorMsg,
        sender: senderEmail,
        recipient: recipientEmail,
        timestamp
      };
    }
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Quotation email dispatch failed.',
      sender: senderEmail,
      recipient: recipientEmail,
      timestamp
    };
  }
}

export async function sendPaymentReceiptEmailBackend(
  payment: Payment,
  invoice?: Invoice,
  customRecipient?: string,
  customSubject?: string,
  customNotes?: string,
  agencyConfig?: any
): Promise<EmailDispatchResult> {
  const senderEmail = agencyConfig?.email || agencyConfig?.senderEmail || 'admin@fusionforgecreation.com';
  const recipientEmail = customRecipient || payment.clientEmail || invoice?.clientEmail || '';
  const subject = customSubject || `Payment Receipt: ${payment.receiptNumber} for Invoice ${payment.invoiceNumber} - Fusion Forge Creation`;
  const timestamp = new Date().toISOString();

  if (!recipientEmail || !recipientEmail.includes('@')) {
    return {
      success: false,
      sender: senderEmail,
      recipient: recipientEmail,
      timestamp,
      error: 'Invalid or missing recipient email address.'
    };
  }

  const emailPayload = {
    senderEmail,
    to: recipientEmail,
    clientName: payment.clientName,
    clientCompany: payment.clientCompany || payment.clientName,
    receiptNumber: payment.receiptNumber,
    invoiceNumber: payment.invoiceNumber,
    amount: payment.amount,
    currency: payment.currency || 'INR',
    paymentDate: formatDateDDMMYYYY(payment.paymentDate),
    paymentMethod: payment.paymentMethod,
    transactionReference: payment.transactionReference || payment.transactionRef || 'DIRECT',
    subject,
    notes: customNotes || payment.notes || `Official payment acknowledgement for Tax Invoice ${payment.invoiceNumber}.`
  };

  try {
    const response = await fetch('/api/send-payment-receipt-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    });

    let data: any = {};
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (response.ok && data.success) {
      const messageId = data.messageId || `rec_msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      return {
        success: true,
        messageId,
        sender: senderEmail,
        recipient: recipientEmail,
        timestamp
      };
    } else {
      const errorMsg = data.error || 'Server rejected email delivery.';
      return {
        success: false,
        error: errorMsg,
        sender: senderEmail,
        recipient: recipientEmail,
        timestamp
      };
    }
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Payment receipt email delivery failed.',
      sender: senderEmail,
      recipient: recipientEmail,
      timestamp
    };
  }
}

export async function sendInvoiceEmailBackend(
  invoice: Invoice,
  customRecipient?: string,
  customSubject?: string,
  customNotes?: string,
  agencyConfig?: any
): Promise<EmailDispatchResult> {
  const senderEmail = agencyConfig?.email || 'admin@fusionforgecreation.com';
  const recipientEmail = customRecipient || invoice.clientEmail || '';
  const subject = customSubject || `Tax Invoice: ${invoice.invoiceNumber} - Fusion Forge Creation`;
  const timestamp = new Date().toISOString();

  if (!recipientEmail || !recipientEmail.includes('@')) {
    return {
      success: false,
      sender: senderEmail,
      recipient: recipientEmail,
      timestamp,
      error: 'Invalid recipient email address.'
    };
  }

  const emailPayload = {
    sender: senderEmail,
    senderName: 'Fusion Forge Creation Invoicing',
    to: recipientEmail,
    invoiceNumber: invoice.invoiceNumber,
    clientName: invoice.clientName,
    clientCompany: invoice.clientCompany,
    issueDate: formatDateDDMMYYYY(invoice.issueDate),
    dueDate: formatDateDDMMYYYY(invoice.dueDate),
    totalAmount: invoice.totalAmount,
    subtotal: invoice.subtotal,
    taxableAmount: invoice.taxableAmount,
    cgstAmount: invoice.cgstAmount,
    sgstAmount: invoice.sgstAmount,
    igstAmount: invoice.igstAmount,
    currency: invoice.currency || 'INR',
    subject,
    notes: customNotes || invoice.notes || 'Please find attached the official GST Tax Invoice.'
  };

  try {
    const response = await fetch('/api/send-invoice-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailPayload)
    });

    let data: any = {};
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (response.ok && data.success) {
      return {
        success: true,
        messageId: data.messageId || `inv_msg_${Date.now()}`,
        sender: senderEmail,
        recipient: recipientEmail,
        timestamp
      };
    } else {
      return {
        success: false,
        error: data.error || 'Failed to dispatch invoice email',
        sender: senderEmail,
        recipient: recipientEmail,
        timestamp
      };
    }
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Invoice email dispatch error',
      sender: senderEmail,
      recipient: recipientEmail,
      timestamp
    };
  }
}

export async function sendProjectStatusEmailBackend(
  project: ManagedProject,
  newStatus: ProjectStatus | string,
  customNotes?: string,
  agencyConfig?: any
): Promise<EmailDispatchResult> {
  const senderEmail = agencyConfig?.email || 'admin@fusionforgecreation.com';
  const recipientEmail = project.clientEmail || '';
  const timestamp = new Date().toISOString();

  if (!recipientEmail || !recipientEmail.includes('@')) {
    return {
      success: false,
      sender: senderEmail,
      recipient: recipientEmail,
      timestamp,
      error: 'Invalid recipient email address.'
    };
  }

  const payload = {
    senderEmail,
    to: recipientEmail,
    projectName: project.title,
    clientName: project.clientName,
    newStatus,
    progressPercentage: project.progressPercentage || 0,
    notes: customNotes || `Status updated to ${newStatus}`
  };

  try {
    const response = await fetch('/api/send-project-status-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    let data: any = {};
    try { data = await response.json(); } catch { data = {}; }

    return {
      success: response.ok && Boolean(data.success),
      messageId: data.messageId || `proj_msg_${Date.now()}`,
      sender: senderEmail,
      recipient: recipientEmail,
      timestamp,
      error: data.error
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Project status email failed',
      sender: senderEmail,
      recipient: recipientEmail,
      timestamp
    };
  }
}

export async function sendGenericEmailBackend(params: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  category?: string;
  senderEmail?: string;
}): Promise<EmailDispatchResult> {
  const senderEmail = params.senderEmail || 'admin@fusionforgecreation.com';
  const timestamp = new Date().toISOString();

  try {
    const response = await fetch('/api/send-generic-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...params, sender: senderEmail })
    });

    let data: any = {};
    try { data = await response.json(); } catch { data = {}; }

    return {
      success: response.ok && Boolean(data.success),
      messageId: data.messageId || `gen_msg_${Date.now()}`,
      sender: senderEmail,
      recipient: params.to,
      timestamp,
      error: data.error
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message,
      sender: senderEmail,
      recipient: params.to,
      timestamp
    };
  }
}

export async function sendProjectScopeEnquiryEmailsBackend(
  enquiry: ProjectEnquiry,
  agencyConfig?: any
): Promise<{
  success: boolean;
  adminResult?: EmailDispatchResult;
  customerResult?: EmailDispatchResult;
  error?: string;
}> {
  const officialSender = agencyConfig?.email || 'admin@fusionforgecreation.com';
  const timestamp = new Date().toISOString();

  const payload = {
    senderEmail: officialSender,
    enquiry: {
      id: enquiry.id,
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      company: enquiry.company,
      gstin: enquiry.gstin,
      address: enquiry.address,
      serviceCategory: enquiry.serviceCategory,
      budgetRange: enquiry.budgetRange,
      estimatedTimeline: enquiry.estimatedTimeline,
      projectDescription: enquiry.projectDescription,
      featuresRequired: enquiry.featuresRequired,
      source: enquiry.source || 'website_form',
      createdAt: enquiry.createdAt
    }
  };

  try {
    const response = await fetch('/api/send-enquiry.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    let data: any = {};
    try { data = await response.json(); } catch { data = {}; }

    if (response.ok && data.success) {
      return {
        success: true,
        adminResult: {
          success: Boolean(data.adminNotification?.sent),
          messageId: data.adminNotification?.messageId || `adm_${Date.now()}`,
          sender: officialSender,
          recipient: officialSender,
          timestamp,
          error: data.adminNotification?.error
        },
        customerResult: {
          success: Boolean(data.customerAutoReply?.sent),
          messageId: data.customerAutoReply?.messageId || `cust_${Date.now()}`,
          sender: officialSender,
          recipient: enquiry.email,
          timestamp,
          error: data.customerAutoReply?.error
        }
      };
    } else {
      return {
        success: false,
        error: data.error || 'Failed to dispatch enquiry emails'
      };
    }
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Enquiry email dispatch failed'
    };
  }
}
