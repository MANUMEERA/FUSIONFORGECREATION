import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import { generateAdminLeadAlertEmailHtml, generateCustomerAutoReplyEmailHtml } from './server/emailTemplates';

// Official Business Email Configuration Defaults
const OFFICIAL_EMAIL = process.env.OFFICIAL_EMAIL || 'admin@fusionforgecreation.com';
const SENDER_NAME = process.env.SENDER_NAME || 'Fusion Forge Creation';
const EMAIL_FROM = process.env.EMAIL_FROM || `${SENDER_NAME} <${OFFICIAL_EMAIL}>`;

// Resend API Configuration
const RESEND_API_KEY = (process.env.RESEND_API_KEY || '').trim();
const RESEND_FROM = process.env.RESEND_FROM || `${SENDER_NAME} <${OFFICIAL_EMAIL}>`;
const RESEND_SANDBOX_FROM = `${SENDER_NAME} <onboarding@resend.dev>`;
const RESEND_ACCOUNT_OWNER = process.env.ADMIN_NOTIFY_EMAIL || 'manojsatapathy.jp@gmail.com';
const resendClient = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

// Hostinger SMTP Configuration (Direct Mailbox Transport Fallback)
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.hostinger.com';
const SMTP_PORT = Number(process.env.SMTP_PORT) || 465;
const SMTP_SECURE = process.env.SMTP_SECURE !== undefined ? process.env.SMTP_SECURE === 'true' : SMTP_PORT === 465;
const SMTP_USER = process.env.SMTP_USER || OFFICIAL_EMAIL;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD || process.env.SMTP_PASS || process.env.EMAIL_PASSWORD;

export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
}

async function dispatchEmail(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  category?: string;
  attachments?: EmailAttachment[];
}): Promise<{ success: boolean; messageId: string; sender: string; provider: string; error?: string; note?: string }> {
  const recipient = options.to;
  const replyTo = options.replyTo || OFFICIAL_EMAIL;

  if (!recipient || !recipient.includes('@')) {
    return {
      success: false,
      messageId: '',
      sender: OFFICIAL_EMAIL,
      provider: 'none',
      error: 'Invalid recipient email address.'
    };
  }

  // 1. Primary Engine: RESEND API
  if (resendClient) {
    try {
      const resendAttachments = options.attachments?.map(att => ({
        filename: att.filename,
        content: Buffer.isBuffer(att.content) ? att.content : (typeof att.content === 'string' ? Buffer.from(att.content, 'base64') : att.content),
        contentType: att.contentType || 'application/pdf'
      }));

      const primaryResendResponse = await resendClient.emails.send({
        from: RESEND_FROM,
        to: [recipient],
        replyTo: replyTo,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: resendAttachments
      });

      if (primaryResendResponse.data && primaryResendResponse.data.id) {
        return {
          success: true,
          messageId: primaryResendResponse.data.id,
          sender: RESEND_FROM,
          provider: 'resend_custom_domain'
        };
      }
    } catch (resendErr: any) {
      console.warn('[RESEND WARNING]', resendErr.message);
    }
  }

  // 2. Fallback Engine: HOSTINGER SMTP
  if (SMTP_PASSWORD) {
    try {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_SECURE,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASSWORD
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000
      });

      const smtpAttachments = options.attachments?.map(att => ({
        filename: att.filename,
        content: Buffer.isBuffer(att.content) ? att.content : (typeof att.content === 'string' ? Buffer.from(att.content, 'base64') : att.content),
        contentType: att.contentType || 'application/pdf'
      }));

      const smtpInfo = await transporter.sendMail({
        from: EMAIL_FROM,
        to: recipient,
        replyTo: replyTo,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: smtpAttachments
      });

      return {
        success: true,
        messageId: smtpInfo.messageId,
        sender: EMAIL_FROM,
        provider: 'hostinger_smtp'
      };
    } catch (smtpErr: any) {
      console.warn('[SMTP WARNING]', smtpErr.message);
    }
  }

  return {
    success: false,
    messageId: '',
    sender: OFFICIAL_EMAIL,
    provider: 'none',
    error: 'Email delivery providers unconfigured or failed.'
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // API: Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Fusion Forge Creation Web Application',
      timestamp: new Date().toISOString()
    });
  });

  // API: Send Project Scope Enquiry Alert
  app.post('/api/send-scope-enquiry-alert', async (req, res) => {
    try {
      const { enquiry, senderEmail } = req.body;
      if (!enquiry || !enquiry.email) {
        return res.status(400).json({ success: false, error: 'Enquiry details with valid email required.' });
      }

      const adminNotificationHtml = generateAdminLeadAlertEmailHtml(enquiry, OFFICIAL_EMAIL);
      const customerAutoReplyHtml = generateCustomerAutoReplyEmailHtml(enquiry, OFFICIAL_EMAIL);

      const adminAlertResult = await dispatchEmail({
        to: senderEmail || OFFICIAL_EMAIL,
        subject: `⚡ [NEW LEAD] Project Enquiry: ${enquiry.name}${enquiry.company ? ` (${enquiry.company})` : ''}`,
        html: adminNotificationHtml,
        category: 'lead_alert'
      });

      const customerReplyResult = await dispatchEmail({
        to: enquiry.email,
        subject: `Thank you for contacting Fusion Forge Creation - Project Scope Received`,
        html: customerAutoReplyHtml,
        category: 'customer_reply'
      });

      res.json({
        success: true,
        adminNotification: { sent: adminAlertResult.success, messageId: adminAlertResult.messageId },
        customerAutoReply: { sent: customerReplyResult.success, messageId: customerReplyResult.messageId }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Generic Email Dispatch Route
  app.post('/api/send-generic-email', async (req, res) => {
    try {
      const { to, subject, html, text, replyTo } = req.body;
      const result = await dispatchEmail({ to, subject, html, text, replyTo });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
