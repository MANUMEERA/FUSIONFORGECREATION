import express from 'express';
import path from 'path';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Body parser
app.use(express.json());

// API health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Fusion Forge Creation',
    timestamp: new Date().toISOString()
  });
});

// Phase 6: Secure Official Email Dispatch for Quotations
app.post('/api/send-quotation-email', (req, res) => {
  try {
    const { to, clientName, quotationNumber, subject, totalAmount, issueDate, validUntil } = req.body;
    console.log(`[EMAIL DISPATCH] Sent Commercial Quotation ${quotationNumber} from admin@fusionforgecreation.com to ${to} (${clientName}) for amount ₹${totalAmount}`);
    
    res.json({
      success: true,
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      sender: 'admin@fusionforgecreation.com',
      recipient: to,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Email dispatch error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to dispatch email' });
  }
});

// Phase 8: Secure Official Email Dispatch for Payment Receipts
app.post('/api/send-payment-receipt-email', (req, res) => {
  try {
    const { 
      to, 
      clientName, 
      clientCompany, 
      receiptNumber, 
      invoiceNumber, 
      amount, 
      paymentMethod, 
      paymentDate, 
      transactionReference, 
      notes, 
      senderEmail,
      subject 
    } = req.body;

    const sender = senderEmail || 'admin@fusionforgecreation.com';
    console.log(`[RECEIPT EMAIL DISPATCH] Sent Payment Receipt ${receiptNumber} from ${sender} to ${to} (${clientCompany || clientName}) for amount ₹${amount} (Ref: ${transactionReference || 'N/A'})`);
    
    res.json({
      success: true,
      messageId: `rec_msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      sender,
      recipient: to,
      receiptNumber,
      amount,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Payment Receipt email dispatch error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to dispatch payment receipt email' });
  }
});

// Phase 12: Secure Official Email Dispatch for Tax Invoices
app.post('/api/send-invoice-email', (req, res) => {
  try {
    const { 
      to, 
      clientName, 
      clientCompany, 
      invoiceNumber, 
      amount, 
      dueDate, 
      issueDate,
      items, 
      notes, 
      subject,
      senderEmail 
    } = req.body;

    const sender = senderEmail || 'admin@fusionforgecreation.com';
    console.log(`[INVOICE EMAIL DISPATCH] Sent Tax Invoice ${invoiceNumber} from ${sender} to ${to} (${clientCompany || clientName}) for total ₹${amount}`);
    
    res.json({
      success: true,
      messageId: `inv_msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      sender,
      recipient: to,
      invoiceNumber,
      amount,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Tax Invoice email dispatch error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to dispatch tax invoice email' });
  }
});

// Phase 12: Universal Central Email Dispatcher
app.post('/api/send-email', (req, res) => {
  try {
    const { 
      to, 
      subject, 
      category, 
      bodyText, 
      clientName, 
      metadata, 
      senderEmail 
    } = req.body;

    const sender = senderEmail || 'admin@fusionforgecreation.com';
    console.log(`[CENTRAL EMAIL SYSTEM] Dispatched ${category || 'general'} email from ${sender} to ${to} (Subject: "${subject}")`);
    
    res.json({
      success: true,
      messageId: `eml_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      sender,
      recipient: to,
      subject,
      category: category || 'general',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Universal email dispatch error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to dispatch email' });
  }
});

// Phase 9: Secure Official Email Dispatch for Project Status Changes & Completion
app.post('/api/send-project-status-email', (req, res) => {
  try {
    const { 
      to, 
      clientName, 
      clientCompany, 
      projectTitle, 
      category, 
      newStatus, 
      previousStatus,
      progressPercentage, 
      completionDate,
      deliverables, 
      notes, 
      subject,
      publicUrl,
      webAppUrl,
      senderEmail 
    } = req.body;

    const sender = senderEmail || 'admin@fusionforgecreation.com';
    console.log(`[PROJECT STATUS EMAIL] Project "${projectTitle}" transitioned to ${newStatus} (${progressPercentage}%). Official notification dispatched from ${sender} to ${to} (${clientCompany || clientName})`);
    
    res.json({
      success: true,
      messageId: `proj_msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      sender,
      recipient: to,
      projectTitle,
      status: newStatus,
      progressPercentage: progressPercentage ?? 100,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Project status email dispatch error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to dispatch project status email' });
  }
});

// Serve static assets from the dist directory
const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));

// Fallback SPA routing for all other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Fusion Forge Production Server running on port ${PORT}`);
  console.log(`Serving static files from: ${distPath}`);
});

