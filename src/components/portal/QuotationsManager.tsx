import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Plus, 
  Download, 
  Trash2, 
  Eye, 
  Send, 
  Save,
  CheckCircle2,
  Calendar,
  User,
  Percent,
  Sparkles,
  ArrowRight,
  Printer,
  X,
  Zap,
  ShieldCheck,
  Mail,
  Lock,
  Clock,
  AlertCircle,
  Building2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Quotation, LineItem, GSTType, ServicePricePreset, QuoteStatus } from '../../types';
import { generateQuotationPDF } from '../../utils/pdfGenerator';
import { AGENCY_CONFIG } from '../../mockData';
import { calculateGstInvoiceTotals, extractStateCode } from '../../utils/gstEngine';
import { generateNextDocumentNumber, DEFAULT_QUOTATION_NUMBERING } from '../../utils/documentNumbering';
import { formatDateDDMMYYYY, getTodayInputDate, getFutureInputDate } from '../../utils/dateUtils';
import { sendQuotationEmailBackend } from '../../utils/emailService';
import { BrandLogo } from '../BrandLogo';

export const QuotationsManager: React.FC = () => {
  const { 
    quotations, 
    clients, 
    invoices,
    addQuotation, 
    updateQuotation, 
    convertQuoteToInvoice, 
    addClient, 
    agencyConfig, 
    pricePresets, 
    setActiveTab,
    testBuzzerSound 
  } = useApp();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [previewQuote, setPreviewQuote] = useState<Quotation | null>(null);
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);

  // Email Modal State
  const [emailModalQuote, setEmailModalQuote] = useState<Quotation | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailNotes, setEmailNotes] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Banner Notification State
  const [notificationMsg, setNotificationMsg] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showNotification = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotificationMsg({ text, type });
    setTimeout(() => {
      setNotificationMsg(null);
    }, 6000);
  };

  // Form State
  const [quoteNumber, setQuoteNumber] = useState('');
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [title, setTitle] = useState('Website Design & Hosting Infrastructure');
  const [issueDate, setIssueDate] = useState(() => getTodayInputDate());
  const [validUntil, setValidUntil] = useState(() => {
    const days = agencyConfig?.default_quotation_validity_days || 30;
    return getFutureInputDate(days);
  });
  const [currency, setCurrency] = useState<'INR' | 'USD' | 'EUR'>('INR');

  // GST / Non-GST Choice State
  const [isGstApplicable, setIsGstApplicable] = useState<boolean>(true);
  const [gstType, setGstType] = useState<GSTType>('igst');
  const [gstRate, setGstRate] = useState<number>(18);
  const [paymentTerms, setPaymentTerms] = useState<string>('50% Milestone Advance on Project Kickoff, 50% on Production Handover.');
  
  // Discount state
  const [discountType, setDiscountType] = useState<'fixed' | 'percentage'>('fixed');
  const [discountValue, setDiscountValue] = useState<number>(5000);

  // Default items matching user requirement
  const [items, setItems] = useState<LineItem[]>([
    { id: '1', description: 'Website Design', sacCode: '998314', quantity: 1, rate: 50000, amount: 50000 },
    { id: '2', description: 'Hosting', sacCode: '998314', quantity: 1, rate: 10000, amount: 10000 }
  ]);

  // Quick Client creation inline
  const [showQuickClient, setShowQuickClient] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientCompany, setNewClientCompany] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');

  const selectedClient = clients.find(c => c.id === clientId) || clients[0];
  const clientBuyerCode = selectedClient?.stateCode || extractStateCode(selectedClient?.state) || '24';

  // Authoritative calculation respecting GST / Non-GST Choice
  const authoritativeQuoteCalc = useMemo(() => {
    return calculateGstInvoiceTotals({
      sellerStateCode: '21',
      buyerStateCode: clientBuyerCode,
      items,
      discountType,
      discountValue: Number(discountValue) || 0,
      gstRate: isGstApplicable && gstType !== 'none' ? gstRate : 0,
      currency: currency || 'INR',
      overrideGstType: !isGstApplicable || gstType === 'none' ? 'none' : undefined
    });
  }, [clientBuyerCode, items, discountType, discountValue, isGstApplicable, gstType, gstRate, currency]);

  const openCreateModal = () => {
    setEditingQuoteId(null);
    const quoteConfig = agencyConfig.numbering_configs?.quotation || DEFAULT_QUOTATION_NUMBERING;
    const existingNums = quotations.map(q => q.quoteNumber);
    const { number } = generateNextDocumentNumber('quotation', quoteConfig, existingNums);
    setQuoteNumber(number);
    setClientId(clients[0]?.id || '');
    setTitle('Website Design & Hosting Infrastructure');
    setIssueDate(getTodayInputDate());
    const validityDays = agencyConfig.default_quotation_validity_days || 30;
    setValidUntil(getFutureInputDate(validityDays));
    setIsGstApplicable(true);
    setPaymentTerms('50% Milestone Advance on Project Kickoff, 50% on Production Handover.');
    setDiscountType('fixed');
    setDiscountValue(5000);
    setGstType('igst');
    setGstRate(18);
    setItems([
      { id: '1', description: 'Website Design', sacCode: '998314', quantity: 1, rate: 50000, amount: 50000 },
      { id: '2', description: 'Hosting', sacCode: '998314', quantity: 1, rate: 10000, amount: 10000 }
    ]);
    setShowCreateModal(true);
  };

  const openEditModal = (q: Quotation) => {
    setEditingQuoteId(q.id);
    setQuoteNumber(q.quoteNumber);
    setClientId(q.clientId);
    setTitle(q.title);
    setIssueDate(q.issueDate);
    setValidUntil(q.validUntil);
    setIsGstApplicable(q.gstApplicable !== false && q.gstType !== 'none');
    setPaymentTerms(q.paymentTerms || '50% Milestone Advance on Project Kickoff, 50% on Production Handover.');
    setDiscountType(q.discountType || 'fixed');
    setDiscountValue(q.discountValue || 0);
    setGstType(q.gstType || 'igst');
    setGstRate(q.gstRate || 18);
    setItems(q.items.length > 0 ? q.items : [
      { id: '1', description: 'Website Design', sacCode: '998314', quantity: 1, rate: 50000, amount: 50000 }
    ]);
    setShowCreateModal(true);
  };

  const updateItem = (index: number, field: keyof LineItem, val: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: val };
    if (field === 'quantity' || field === 'rate') {
      const q = Number(item.quantity) || 0;
      const r = Number(item.rate) || 0;
      item.amount = q * r;
    }
    updated[index] = item;
    setItems(updated);
  };

  const addItem = (presetDesc?: string, presetRate?: number, presetSac?: string) => {
    const newRate = presetRate ?? 10000;
    const newDesc = presetDesc ?? '';
    const newSac = presetSac ?? '998314';
    setItems([
      ...items,
      {
        id: String(Date.now() + Math.random()),
        description: newDesc,
        sacCode: newSac,
        quantity: 1,
        rate: newRate,
        amount: newRate
      }
    ]);
  };

  const removeItem = (idx: number) => {
    if (items.length <= 1) {
      alert('Quotation must contain at least one line item.');
      return;
    }
    setItems(items.filter((_, i) => i !== idx));
  };

  // Authoritative computed totals
  const subtotal = authoritativeQuoteCalc.subtotal;
  const discountAmount = authoritativeQuoteCalc.discountAmount;
  const taxableAmount = authoritativeQuoteCalc.taxableAmount;
  const effectiveGstRate = isGstApplicable && gstType !== 'none' ? authoritativeQuoteCalc.gstRate : 0;
  const cgstAmount = isGstApplicable && gstType !== 'none' ? authoritativeQuoteCalc.cgstAmount : 0;
  const sgstAmount = isGstApplicable && gstType !== 'none' ? authoritativeQuoteCalc.sgstAmount : 0;
  const igstAmount = isGstApplicable && gstType !== 'none' ? authoritativeQuoteCalc.igstAmount : 0;
  const totalAmount = isGstApplicable && gstType !== 'none' ? authoritativeQuoteCalc.grandTotal : taxableAmount;

  const handleQuickAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientEmail) return;
    const created = addClient({
      name: newClientName,
      companyName: newClientCompany || `${newClientName} Enterprise`,
      email: newClientEmail,
      phone: newClientPhone || '+91 98000 00000',
      billingAddress: {
        street: 'Commercial Hub',
        city: 'Mumbai',
        state: 'Maharashtra',
        stateCode: '27',
        postalCode: '400001',
        country: 'India'
      },
      currency: 'INR',
      status: 'active'
    });
    setClientId(created.id);
    setShowQuickClient(false);
    setNewClientName('');
    setNewClientCompany('');
    setNewClientEmail('');
    setNewClientPhone('');
  };

  const handleSaveQuotation = (targetStatus: QuoteStatus) => {
    const selClient = clients.find(c => c.id === clientId) || clients[0];
    if (!selClient) {
      alert('Please select or create a client first.');
      return;
    }

    const payload = {
      quoteNumber: quoteNumber.trim() || `QTN-2026-${String(quotations.length + 1).padStart(4, '0')}`,
      clientId: selClient.id,
      clientName: selClient.name,
      clientCompany: selClient.companyName,
      clientEmail: selClient.email,
      clientAddress: selClient.billingAddress 
        ? `${selClient.billingAddress.street}, ${selClient.billingAddress.city}, ${selClient.billingAddress.state} - ${selClient.billingAddress.postalCode}`
        : (selClient.address || ''),
      clientGstin: selClient.gstin || '—',
      buyerStateCode: selClient.placeOfSupplyCode || selClient.stateCode || (selClient.gstin && selClient.gstin.length >= 2 ? selClient.gstin.slice(0, 2) : '24'),
      placeOfSupply: selClient.placeOfSupply || (selClient.state ? `${selClient.stateCode || '24'}-${selClient.state}` : '24-Gujarat'),
      sameAsBilling: selClient.sameAsBilling !== false,
      shippingName: selClient.shippingName || selClient.name,
      shippingCompany: selClient.shippingCompany || selClient.companyName,
      shippingAddress: selClient.shippingAddress || selClient.address,
      shippingCity: selClient.shippingCity || selClient.city,
      shippingState: selClient.shippingState || selClient.state,
      shippingStateCode: selClient.shippingStateCode || selClient.stateCode,
      shippingPincode: selClient.shippingPincode || selClient.pincode,
      shippingGstin: selClient.shippingGstin || selClient.gstin,
      title: title || 'Commercial Deliverables & Services',
      projectScope: 'Custom design, technical development, integration, and cloud deployment.',
      issueDate,
      validUntil,
      currency,
      items,
      subtotal,
      discountType,
      discountValue: Number(discountValue) || 0,
      discountAmount,
      taxableAmount,
      gstApplicable: isGstApplicable,
      gstType: isGstApplicable ? gstType : 'none',
      gstRate: isGstApplicable ? effectiveGstRate : 0,
      cgstAmount,
      sgstAmount,
      igstAmount,
      totalAmount,
      paymentTerms,
      notes: 'Includes comprehensive quality audit, SLA support, and source repository handover.',
      termsAndConditions: AGENCY_CONFIG.terms,
      status: targetStatus,
      createdBy: 'Manoj Satapathy'
    };

    if (editingQuoteId) {
      updateQuotation(editingQuoteId, payload);
      showNotification(`Commercial Quotation ${payload.quoteNumber} updated successfully.`);
    } else {
      addQuotation(payload);
      showNotification(`New Commercial Quotation ${payload.quoteNumber} created.`);
    }

    setShowCreateModal(false);
  };

  const handleGeneratePDFFromModal = () => {
    const selClient = clients.find(c => c.id === clientId) || clients[0];
    const tempQuote: Quotation = {
      id: editingQuoteId || 'temp_quote',
      quoteNumber: quoteNumber.trim() || 'QTN-2026-0001',
      clientId: selClient?.id || 'client_1',
      clientName: selClient?.name || 'Client',
      clientCompany: selClient?.companyName || 'Client Company',
      clientEmail: selClient?.email || 'client@example.com',
      title: title || 'Quotation Estimate',
      projectScope: 'Deliverables & Services Scope',
      issueDate,
      validUntil,
      currency,
      items,
      subtotal,
      discountType,
      discountValue: Number(discountValue) || 0,
      discountAmount,
      taxableAmount,
      gstApplicable: isGstApplicable,
      gstType: isGstApplicable ? gstType : 'none',
      gstRate: isGstApplicable ? effectiveGstRate : 0,
      cgstAmount,
      sgstAmount,
      igstAmount,
      totalAmount,
      paymentTerms,
      notes: 'Generated via Fusion Forge Creation Commercial Engine',
      termsAndConditions: AGENCY_CONFIG.terms,
      status: 'draft',
      createdBy: 'Manoj Satapathy',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    generateQuotationPDF(tempQuote, agencyConfig);
  };

  // Trigger SEND FOR INVOICE workflow
  const handleSendForInvoice = (quote: Quotation) => {
    // Only enabled when status is Received Order
    const isOrderReceived = quote.status === 'Order Received' || quote.status === 'order_received';
    if (!isOrderReceived) {
      alert("Quotation must be marked as 'Received Order' before it can be sent for invoice generation.");
      return;
    }

    // Idempotency: Prevent duplicate invoices
    if (quote.convertedInvoiceId) {
      showNotification(`Invoice already generated for ${quote.quoteNumber}. Linked Invoice ID: ${quote.convertedInvoiceId}`, 'info');
      return;
    }

    const createdInvoice = convertQuoteToInvoice(quote.id);
    if (createdInvoice) {
      testBuzzerSound();
      showNotification(`Quotation ${quote.quoteNumber} successfully sent for invoice! Tax Invoice ${createdInvoice.invoiceNumber} created.`, 'success');
    }
  };

  // Open Official Email Modal
  const openEmailModal = (q: Quotation) => {
    setEmailModalQuote(q);
    setEmailSubject(`COMMERCIAL QUOTATION: ${q.quoteNumber} - ${q.title}`);
    setEmailNotes(`Dear ${q.clientName},\n\nPlease find attached the official Commercial Quotation (${q.quoteNumber}) from Fusion Forge Creation for your review.\n\nTotal Value: ₹ ${q.totalAmount.toLocaleString('en-IN')}\nValidity: ${formatDateDDMMYYYY(q.validUntil)}\n\nBest regards,\nFusion Forge Creation Admin\nadmin@fusionforgecreation.com`);
  };

  // Send Email via Backend Integration
  const handleSendEmailSubmit = async () => {
    if (!emailModalQuote) return;
    setIsSendingEmail(true);

    try {
      const res = await sendQuotationEmailBackend(emailModalQuote, emailSubject, emailNotes);
      if (res.success) {
        updateQuotation(emailModalQuote.id, {
          status: emailModalQuote.status === 'draft' || emailModalQuote.status === 'Draft' ? 'Sent' : emailModalQuote.status,
          emailSentAt: res.timestamp,
          emailSentBy: res.sender
        });
        showNotification(`Official email sent from admin@fusionforgecreation.com to ${emailModalQuote.clientEmail} successfully!`, 'success');
        setEmailModalQuote(null);
      } else {
        showNotification(`Failed to dispatch email: ${res.error || 'Unknown error'}`, 'error');
      }
    } catch (err: any) {
      showNotification(`Email dispatch error: ${err.message || 'Network error'}`, 'error');
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {notificationMsg && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between shadow-md transition-all animate-fadeIn ${
          notificationMsg.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-[#059669]'
            : notificationMsg.type === 'info'
            ? 'bg-purple-50 border-purple-200 text-[#8E2D9D]'
            : 'bg-rose-50 border-rose-200 text-[#DC2626]'
        }`}>
          <div className="flex items-center space-x-3 text-xs sm:text-sm font-bold">
            {notificationMsg.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-[#059669] shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-[#8E2D9D] shrink-0" />
            )}
            <span>{notificationMsg.text}</span>
          </div>
          <button 
            onClick={() => setNotificationMsg(null)}
            className="p-1 rounded-lg hover:bg-black/5 text-[#817B91] hover:text-[#1E1B2E] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-[#E8E0F0] shadow-xs">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 rounded-2xl bg-[#FAF5FF] border border-[#E8E0F0] text-[#8E2D9D]">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-[#1E1B2E] tracking-tight">COMMERCIAL QUOTATIONS</h2>
          </div>
          <p className="text-xs text-[#5F5A72] mt-1 font-medium">
            Enterprise commercial proposal workflow with GST/non-GST control, official email dispatch (<span className="text-[#8E2D9D] font-mono font-bold">admin@fusionforgecreation.com</span>), and structured SEND FOR INVOICE governance.
          </p>
        </div>
        <button
          id="btn-create-quote-top"
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-[#8E2D9D] hover:bg-[#6F42C1] text-white text-xs font-bold flex items-center space-x-2 transition-all shadow-md shadow-[#8E2D9D]/25 hover:scale-[1.01] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Commercial Quotation</span>
        </button>
      </div>

      {/* Quotations List */}
      <div className="rounded-3xl border border-[#E8E0F0] bg-white overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-[#E8E0F0] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-[#FAF8FF]">
          <div className="text-xs font-bold uppercase tracking-wider text-[#1E1B2E] flex items-center gap-2">
            <span>Commercial Quotation Records ({quotations.length})</span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#FAF5FF] text-[#8E2D9D] border border-[#E8E0F0] font-bold">
              DD-MM-YYYY Dates
            </span>
          </div>
          <div className="text-[11px] text-[#5F5A72]">
            Order Status Rule: <span className="font-bold text-[#059669]">"Received Order"</span> unlocks <span className="font-bold text-[#8E2D9D]">SEND FOR INVOICE</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1E1B2E]">
            <thead className="bg-[#FAF5FF] text-[#5F5A72] uppercase text-[10px] tracking-wider border-b border-[#E8E0F0]">
              <tr>
                <th className="py-3.5 px-4 font-bold">Quotation No</th>
                <th className="py-3.5 px-4 font-bold">Client & Scope</th>
                <th className="py-3.5 px-4 font-bold">Dates (DD-MM-YYYY)</th>
                <th className="py-3.5 px-4 font-bold text-right">Tax Mode & Total</th>
                <th className="py-3.5 px-4 font-bold text-center">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions / Workflow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E0F0]">
              {quotations.map(q => {
                const isConverted = q.status === 'converted' || q.status === 'Converted' || Boolean(q.convertedInvoiceId);
                const isOrderReceived = q.status === 'Order Received' || q.status === 'order_received';
                const isGstActive = q.gstApplicable !== false && q.gstType !== 'none';
                
                return (
                  <tr key={q.id} className="hover:bg-[#FAF8FF] transition-colors">
                    {/* Quotation No */}
                    <td className="py-4 px-4 font-mono font-bold text-[#8E2D9D]">
                      <div>{q.quoteNumber}</div>
                      {q.emailSentAt && (
                        <div className="text-[9px] text-[#059669] flex items-center gap-1 font-sans mt-0.5 font-bold" title={`Emailed via ${q.emailSentBy || 'admin@fusionforgecreation.com'}`}>
                          <Mail className="w-2.5 h-2.5" />
                          <span>Emailed</span>
                        </div>
                      )}
                    </td>

                    {/* Client & Scope */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-[#1E1B2E] text-sm">{q.clientCompany || q.clientName}</div>
                      <div className="text-[11px] text-[#5F5A72] truncate max-w-xs">{q.title}</div>
                      <div className="text-[10px] text-[#817B91] font-semibold">{q.items?.length || 0} line item(s)</div>
                    </td>

                    {/* Dates */}
                    <td className="py-4 px-4 text-[#5F5A72] text-[11px] font-mono">
                      <div>Issued: <span className="text-[#1E1B2E] font-bold">{formatDateDDMMYYYY(q.issueDate)}</span></div>
                      <div className="text-[#817B91]">Valid: <span className="text-[#1E1B2E] font-semibold">{formatDateDDMMYYYY(q.validUntil)}</span></div>
                    </td>

                    {/* Tax Mode & Total */}
                    <td className="py-4 px-4 text-right">
                      <div className="font-bold text-[#1E1B2E] font-mono text-sm">
                        ₹ {q.totalAmount.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-[#5F5A72]">
                        {isGstActive ? (
                          <span className="text-[#8E2D9D] font-bold">GST ({q.gstRate || 18}%)</span>
                        ) : (
                          <span className="text-[#059669] font-bold">Non-GST / Zero Tax</span>
                        )}
                      </div>
                    </td>

                    {/* Status Dropdown with Pending & Received Order Ordered Prominently */}
                    <td className="py-4 px-4 text-center">
                      <select
                        id={`select-status-${q.id}`}
                        value={q.status}
                        onChange={(e) => updateQuotation(q.id, { status: e.target.value as any })}
                        className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-xl border outline-none cursor-pointer ${
                          isConverted
                            ? 'bg-purple-50 text-[#6F42C1] border-purple-200'
                            : isOrderReceived
                            ? 'bg-emerald-50 text-[#059669] border-emerald-300 font-black shadow-xs'
                            : q.status === 'Pending' || q.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border-amber-300'
                            : q.status === 'approved' || q.status === 'Approved'
                            ? 'bg-teal-50 text-teal-700 border-teal-300'
                            : q.status === 'sent' || q.status === 'Sent'
                            ? 'bg-blue-50 text-blue-700 border-blue-300'
                            : q.status === 'rejected' || q.status === 'Rejected'
                            ? 'bg-rose-50 text-rose-700 border-rose-300'
                            : q.status === 'cancelled' || q.status === 'Cancelled'
                            ? 'bg-red-50 text-red-700 border-red-300'
                            : q.status === 'closed' || q.status === 'Closed'
                            ? 'bg-slate-100 text-slate-600 border-slate-300'
                            : 'bg-[#FAF5FF] text-[#5F5A72] border-[#E8E0F0]'
                        }`}
                      >
                        {/* Required Prominent Ordering: Pending and Received Order */}
                        <option value="Pending" className="bg-white text-amber-800 font-bold">1. Pending</option>
                        <option value="Order Received" className="bg-white text-emerald-800 font-black">2. Received Order</option>
                        <option value="draft" className="bg-white text-slate-700">Draft</option>
                        <option value="sent" className="bg-white text-blue-800">Sent</option>
                        <option value="approved" className="bg-white text-teal-800">Approved</option>
                        <option value="converted" className="bg-white text-purple-800">Converted to Invoice</option>
                        <option value="Rejected" className="bg-white text-rose-800">Rejected</option>
                        <option value="Cancelled" className="bg-white text-red-800">Cancelled</option>
                        <option value="Closed" className="bg-white text-slate-600">Closed</option>
                      </select>
                    </td>

                    {/* Actions & SEND FOR INVOICE Button */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {/* Preview Action */}
                        <button
                          id={`btn-view-${q.id}`}
                          onClick={() => setPreviewQuote(q)}
                          title="Preview Commercial Quotation"
                          className="p-2 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#5F5A72] hover:text-[#8E2D9D] border border-[#E8E0F0] transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* PDF Generator */}
                        <button
                          id={`btn-pdf-${q.id}`}
                          onClick={() => generateQuotationPDF(q, agencyConfig)}
                          title="Print / Export Commercial Quotation"
                          className="p-2 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#8E2D9D] hover:text-[#6F42C1] border border-[#E8E0F0] transition-all cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        {/* Official Email Dispatch */}
                        <button
                          id={`btn-email-${q.id}`}
                          onClick={() => openEmailModal(q)}
                          title="Email Quotation via admin@fusionforgecreation.com"
                          className="p-2 rounded-xl bg-[#FAF5FF] hover:bg-emerald-50 text-[#5F5A72] hover:text-[#059669] border border-[#E8E0F0] transition-all cursor-pointer"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit Quotation (if not converted) */}
                        {!isConverted && !['closed', 'Closed', 'cancelled', 'Cancelled'].includes(q.status) && (
                          <button
                            id={`btn-edit-${q.id}`}
                            onClick={() => openEditModal(q)}
                            title="Edit Quotation"
                            className="px-2.5 py-1.5 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#1E1B2E] text-[11px] font-bold border border-[#E8E0F0] transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                        )}

                        {/* SEND FOR INVOICE BUTTON (Phase 6 Core Workflow) */}
                        {isConverted ? (
                          <div 
                            className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-[11px] font-bold text-[#6F42C1] flex items-center space-x-1"
                            title="Quotation already converted to Invoice"
                          >
                            <CheckCircle2 className="w-3 h-3 text-[#6F42C1]" />
                            <span>Invoice Created</span>
                          </div>
                        ) : isOrderReceived ? (
                          <button
                            id={`btn-send-for-invoice-${q.id}`}
                            onClick={() => handleSendForInvoice(q)}
                            className="px-3 py-1.5 rounded-xl bg-[#059669] hover:bg-emerald-700 text-white border border-emerald-600 text-[11px] font-black tracking-wide transition-all flex items-center space-x-1.5 shadow-sm hover:scale-[1.02] cursor-pointer"
                            title="Order received! Click to send for tax invoice generation"
                          >
                            <span>SEND FOR INVOICE</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            id={`btn-send-for-invoice-disabled-${q.id}`}
                            disabled
                            className="px-3 py-1.5 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-[11px] font-bold text-[#817B91] cursor-not-allowed flex items-center space-x-1.5 opacity-60"
                            title="Disabled: Requires status to be 'Received Order'"
                          >
                            <Lock className="w-3 h-3 text-[#817B91]" />
                            <span>SEND FOR INVOICE</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT COMMERCIAL QUOTATION MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-[#E8E0F0] rounded-3xl w-full max-w-4xl p-6 sm:p-8 shadow-2xl my-auto text-[#1E1B2E]">
            
            {/* Template Header Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E8E0F0] mb-6">
              <BrandLogo size="md" variant="full" theme="light" />
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] font-bold tracking-widest text-[#8E2D9D] uppercase bg-[#FAF5FF] px-3 py-1 rounded-full border border-[#E8E0F0]">
                    Commercial Quotation Builder
                  </span>
                  <div className="font-mono text-xs text-[#5F5A72] mt-1 font-bold">{quoteNumber}</div>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#817B91] hover:text-[#1E1B2E] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {/* GST vs. Non-GST Choice Selector (Phase 6 Mandate) */}
              <div className="p-4 rounded-2xl bg-[#FAF8FF] border-2 border-[#E8E0F0] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#1E1B2E] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#8E2D9D]" />
                    <span>Taxation Architecture (GST Mode)</span>
                  </div>
                  <p className="text-[11px] text-[#5F5A72] mt-0.5">
                    Choose whether this commercial quotation is issued with standard GST taxation or as a Zero-Tax / Non-GST proposal.
                  </p>
                </div>

                <div className="flex items-center space-x-2 bg-white p-1 rounded-xl border border-[#E8E0F0] shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setIsGstApplicable(true);
                      if (gstType === 'none') setGstType('igst');
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isGstApplicable 
                        ? 'bg-[#8E2D9D] text-white shadow-xs' 
                        : 'text-[#5F5A72] hover:text-[#1E1B2E]'
                    }`}
                  >
                    Quote with GST
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsGstApplicable(false);
                      setGstType('none');
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      !isGstApplicable 
                        ? 'bg-[#059669] text-white shadow-xs' 
                        : 'text-[#5F5A72] hover:text-[#1E1B2E]'
                    }`}
                  >
                    Quote without GST
                  </button>
                </div>
              </div>

              {/* Top Meta Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FAF5FF] p-4 rounded-2xl border border-[#E8E0F0]">
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#1E1B2E] block mb-1">
                      Quotation No:
                    </label>
                    <input
                      id="input-quote-number"
                      type="text"
                      value={quoteNumber}
                      onChange={e => setQuoteNumber(e.target.value)}
                      placeholder="QTN-2026-0001"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#D9D2E3] text-sm font-mono font-bold text-[#8E2D9D] outline-none focus:border-[#8E2D9D]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#1E1B2E]">
                        Client / Billed To:
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowQuickClient(!showQuickClient)}
                        className="text-[10px] text-[#8E2D9D] hover:text-[#6F42C1] font-bold underline cursor-pointer"
                      >
                        {showQuickClient ? 'Cancel New' : '+ Add New Client'}
                      </button>
                    </div>

                    {!showQuickClient ? (
                      <select
                        id="select-client"
                        value={clientId}
                        onChange={e => setClientId(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#D9D2E3] text-xs font-semibold text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                      >
                        {clients.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.companyName} ({c.name})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="p-3 bg-white rounded-xl border border-[#E8E0F0] space-y-2 mt-1 shadow-md">
                        <div className="text-[10px] font-bold text-[#8E2D9D] uppercase">Quick Add New Client</div>
                        <input
                          type="text"
                          placeholder="Client / Representative Name *"
                          value={newClientName}
                          onChange={e => setNewClientName(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#D9D2E3] text-xs text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                        />
                        <input
                          type="text"
                          placeholder="Company / Business Name"
                          value={newClientCompany}
                          onChange={e => setNewClientCompany(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#D9D2E3] text-xs text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                        />
                        <input
                          type="email"
                          placeholder="Email Address *"
                          value={newClientEmail}
                          onChange={e => setNewClientEmail(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#D9D2E3] text-xs text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                        />
                        <button
                          type="button"
                          onClick={handleQuickAddClient}
                          className="w-full py-1.5 rounded-lg bg-[#8E2D9D] text-white text-xs font-bold hover:bg-[#6F42C1] cursor-pointer"
                        >
                          Save & Select Client
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#1E1B2E] block mb-1">
                        Issue Date (DD-MM-YYYY):
                      </label>
                      <input
                        id="input-issue-date"
                        type="date"
                        value={issueDate}
                        onChange={e => setIssueDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#D9D2E3] text-xs font-mono text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#1E1B2E] block mb-1">
                        Valid Until (DD-MM-YYYY):
                      </label>
                      <input
                        id="input-valid-until"
                        type="date"
                        value={validUntil}
                        onChange={e => setValidUntil(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#D9D2E3] text-xs font-mono text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                      />
                    </div>
                  </div>

                  {isGstApplicable ? (
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#1E1B2E] block mb-1">
                        Tax Rate & State Tax Type:
                      </label>
                      <select
                        id="select-gst-mode"
                        value={gstType}
                        onChange={e => setGstType(e.target.value as any)}
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#D9D2E3] text-xs text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                      >
                        <option value="igst">Integrated GST (IGST 18%) - Standard Inter-State</option>
                        <option value="cgst_sgst">CGST (9%) + SGST (9%) - Intra-State Odisha</option>
                      </select>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-[#059669]">
                      <strong>Non-GST Commercial Proposal:</strong> Zero tax is computed. No IGST or CGST/SGST lines will appear on the document.
                    </div>
                  )}
                </div>
              </div>

              {/* Title & Payment Terms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#1E1B2E] block mb-1">
                    Project Title / Scope:
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Website Design & Hosting Infrastructure"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#D9D2E3] text-xs text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#1E1B2E] block mb-1">
                    Payment Terms:
                  </label>
                  <input
                    type="text"
                    value={paymentTerms}
                    onChange={e => setPaymentTerms(e.target.value)}
                    placeholder="e.g. 50% Milestone Advance, 50% on Delivery"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#D9D2E3] text-xs text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                  />
                </div>
              </div>

              {/* Quick Presets */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[10px] font-bold text-[#5F5A72] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#8E2D9D]" />
                    <span>Quick Add Service Presets (Supabase Master):</span>
                  </div>
                  <span className="text-[10px] text-[#817B91]">Click to insert line item</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {pricePresets.filter(p => p.is_active).map(preset => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => addItem(preset.service_name, preset.default_price, preset.sac_code || '998314')}
                      className="px-3 py-1.5 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] border border-[#E8E0F0] text-[11px] font-bold text-[#8E2D9D] transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs"
                      title={preset.description ? `${preset.description} (SAC: ${preset.sac_code || '998314'})` : `SAC: ${preset.sac_code || '998314'}`}
                    >
                      <Plus className="w-3 h-3 text-[#8E2D9D]" />
                      <span>{preset.service_name}</span>
                      <span className="font-mono text-[#1E1B2E] font-bold">₹{preset.default_price.toLocaleString('en-IN')}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* LINE ITEMS TABLE */}
              <div className="border border-[#E8E0F0] rounded-2xl overflow-hidden bg-white">
                <div className="p-3 bg-[#FAF8FF] border-b border-[#E8E0F0] flex justify-between items-center">
                  <div className="text-xs font-bold text-[#1E1B2E] uppercase tracking-wider">
                    Commercial Line Items
                  </div>
                  <button
                    type="button"
                    onClick={() => addItem('', 10000)}
                    className="text-xs font-bold text-[#8E2D9D] hover:text-white flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-[#FAF5FF] hover:bg-[#8E2D9D] border border-[#E8E0F0] cursor-pointer transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="p-3 space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-[#5F5A72] uppercase tracking-wider px-2">
                    <div className="col-span-5">Description</div>
                    <div className="col-span-2 text-center">Qty</div>
                    <div className="col-span-2 text-right">Rate (₹)</div>
                    <div className="col-span-2 text-right">Amount (₹)</div>
                    <div className="col-span-1 text-center">Del</div>
                  </div>

                  {items.map((item, idx) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-[#FAF8FF] p-2.5 rounded-xl border border-[#E8E0F0] hover:border-[#C084FC]/60 transition-colors">
                      <div className="col-span-5">
                        <input
                          required
                          type="text"
                          placeholder="e.g. Website Design"
                          value={item.description}
                          onChange={e => updateItem(idx, 'description', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#D9D2E3] text-xs font-semibold text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          required
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={e => updateItem(idx, 'quantity', Number(e.target.value))}
                          className="w-full px-2 py-1.5 rounded-lg bg-white border border-[#D9D2E3] text-xs font-mono text-center text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          required
                          type="number"
                          min="0"
                          step="500"
                          value={item.rate}
                          onChange={e => updateItem(idx, 'rate', Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#D9D2E3] text-xs font-mono text-right text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                        />
                      </div>
                      <div className="col-span-2 text-right font-mono font-bold text-[#1E1B2E] text-xs pr-1">
                        ₹ {item.amount.toLocaleString('en-IN')}
                      </div>
                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="p-1.5 text-[#817B91] hover:text-[#DC2626] rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FINANCIAL BREAKDOWN BOX */}
              <div className="bg-[#FAF5FF] rounded-2xl border-2 border-[#E8E0F0] p-5 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-[#5F5A72]">Subtotal</span>
                  <span className="font-mono font-bold text-[#1E1B2E] text-base">
                    ₹ {subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Discount Row */}
                <div className="flex justify-between items-center text-sm py-1 border-t border-[#E8E0F0]">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-[#5F5A72]">Discount</span>
                    <div className="flex items-center space-x-1 bg-white rounded-lg p-0.5 border border-[#E8E0F0]">
                      <button
                        type="button"
                        onClick={() => setDiscountType('fixed')}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer ${discountType === 'fixed' ? 'bg-[#8E2D9D] text-white' : 'text-[#5F5A72]'}`}
                      >
                        ₹ Fixed
                      </button>
                      <button
                        type="button"
                        onClick={() => setDiscountType('percentage')}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer ${discountType === 'percentage' ? 'bg-[#8E2D9D] text-white' : 'text-[#5F5A72]'}`}
                      >
                        % Percent
                      </button>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={discountValue}
                      onChange={e => setDiscountValue(Number(e.target.value))}
                      placeholder="5000"
                      className="w-24 px-2 py-1 rounded-lg bg-white border border-[#D9D2E3] text-xs font-mono text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                    />
                  </div>
                  <span className="font-mono font-bold text-[#059669]">
                    - ₹ {discountAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Taxable Amount Row */}
                <div className="flex justify-between items-center text-sm py-1 border-t border-[#E8E0F0]">
                  <span className="font-bold text-[#1E1B2E]">Taxable Amount</span>
                  <span className="font-mono font-bold text-[#1E1B2E] text-base">
                    ₹ {taxableAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* GST Row (Only when GST is active) */}
                {isGstApplicable ? (
                  <div className="flex justify-between items-center text-sm py-1 border-t border-[#E8E0F0]">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-[#5F5A72]">
                        GST ({effectiveGstRate}%)
                      </span>
                      <span className="text-[11px] text-[#817B91]">
                        {gstType === 'cgst_sgst' ? '(CGST 9% + SGST 9%)' : '(IGST 18%)'}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-[#8E2D9D]">
                      ₹ {(cgstAmount + sgstAmount + igstAmount).toLocaleString('en-IN')}
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-between items-center text-xs py-1 border-t border-[#E8E0F0] text-[#059669]">
                    <span>Taxation Mode</span>
                    <span className="font-bold uppercase tracking-wider">Non-GST Commercial Proposal (₹ 0 Tax)</span>
                  </div>
                )}

                {/* Grand Total Row */}
                <div className="flex justify-between items-center pt-3 border-t-2 border-[#E8E0F0] text-base">
                  <span className="font-black text-[#1E1B2E] text-lg">Grand Total</span>
                  <span className="font-mono font-black text-[#8E2D9D] text-xl tracking-tight">
                    ₹ {totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-[#E8E0F0]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] text-xs font-bold text-[#5F5A72] border border-[#E8E0F0] transition-colors w-full sm:w-auto cursor-pointer"
                >
                  Cancel
                </button>

                <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                  {/* [Save Draft] */}
                  <button
                    id="btn-save-draft"
                    type="button"
                    onClick={() => handleSaveQuotation('draft')}
                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF5FF] border border-[#E8E0F0] text-[#1E1B2E] text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <Save className="w-4 h-4 text-[#817B91]" />
                    <span>Save Draft</span>
                  </button>

                  {/* [Generate PDF] */}
                  <button
                    id="btn-generate-pdf"
                    type="button"
                    onClick={handleGeneratePDFFromModal}
                    className="px-4 py-2.5 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#8E2D9D] border border-[#E8E0F0] text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Generate PDF</span>
                  </button>

                  {/* [Save & Mark Pending] */}
                  <button
                    id="btn-save-pending"
                    type="button"
                    onClick={() => handleSaveQuotation('Pending')}
                    className="px-5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Save Pending</span>
                  </button>

                  {/* [Save & Send Quotation] */}
                  <button
                    id="btn-send-quote"
                    type="button"
                    onClick={() => handleSaveQuotation('sent')}
                    className="px-6 py-2.5 rounded-xl bg-[#8E2D9D] hover:bg-[#6F42C1] text-white text-xs font-black flex items-center space-x-2 transition-all shadow-md shadow-[#8E2D9D]/25 hover:scale-[1.01] cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Save & Send Quote</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* OFFICIAL EMAIL MODAL (Phase 6 Mandate) */}
      {emailModalQuote && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E0F0] rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl text-[#1E1B2E]">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E0F0] mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-[#FAF5FF] border border-[#E8E0F0] text-[#8E2D9D]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1E1B2E]">Email Commercial Quotation</h3>
                  <p className="text-xs text-[#5F5A72]">Sent via verified agency address: <span className="font-mono text-[#8E2D9D] font-bold">admin@fusionforgecreation.com</span></p>
                </div>
              </div>
              <button
                onClick={() => setEmailModalQuote(null)}
                className="p-2 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#817B91] hover:text-[#1E1B2E] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs bg-[#FAF8FF] p-3.5 rounded-2xl border border-[#E8E0F0]">
                <div>
                  <span className="text-[#817B91] block text-[10px] uppercase font-bold">From (Official Sender):</span>
                  <span className="font-mono text-[#8E2D9D] font-bold">admin@fusionforgecreation.com</span>
                </div>
                <div>
                  <span className="text-[#817B91] block text-[10px] uppercase font-bold">Recipient (Customer):</span>
                  <span className="font-bold text-[#1E1B2E]">{emailModalQuote.clientEmail}</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#1E1B2E] block mb-1">
                  Subject Line:
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={e => setEmailSubject(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#D9D2E3] text-xs text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#1E1B2E] block mb-1">
                  Email Message Body:
                </label>
                <textarea
                  rows={6}
                  value={emailNotes}
                  onChange={e => setEmailNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#D9D2E3] text-xs font-sans text-[#1E1B2E] outline-none focus:border-[#8E2D9D] leading-relaxed"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-[#E8E0F0]">
                <button
                  type="button"
                  onClick={() => setEmailModalQuote(null)}
                  className="px-4 py-2 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] text-xs font-bold text-[#5F5A72] border border-[#E8E0F0] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSendingEmail}
                  onClick={handleSendEmailSubmit}
                  className="px-6 py-2 rounded-xl bg-[#8E2D9D] hover:bg-[#6F42C1] text-white text-xs font-black flex items-center space-x-2 transition-all shadow-md shadow-[#8E2D9D]/25 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSendingEmail ? 'Dispatching...' : 'Dispatch Email Now'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMMERCIAL QUOTATION PREVIEW MODAL */}
      {previewQuote && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E0F0] rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl text-[#1E1B2E] max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E0F0] mb-6">
              <BrandLogo size="md" variant="full" theme="light" />
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] font-black tracking-widest text-[#8E2D9D] uppercase bg-[#FAF5FF] px-3 py-1 rounded-full border border-[#E8E0F0]">
                    COMMERCIAL QUOTATION
                  </span>
                  <div className="font-mono text-xs font-bold text-[#8E2D9D] mt-1">{previewQuote.quoteNumber}</div>
                </div>
                <button
                  onClick={() => setPreviewQuote(null)}
                  className="p-2 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#817B91] hover:text-[#1E1B2E] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-5">
              {/* Seller & Client Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#FAF8FF] border border-[#E8E0F0] text-xs">
                <div>
                  <div className="text-[#8E2D9D] font-bold uppercase text-[10px] tracking-wider mb-1 flex items-center justify-between">
                    <span>Seller / Agency</span>
                    <span className="font-mono text-[9px] text-[#817B91]">SAC: {agencyConfig.sacCode || '998314'}</span>
                  </div>
                  <div className="text-[#1E1B2E] font-bold text-sm">{agencyConfig.company_name || agencyConfig.name || 'Fusion Forge Creation'}</div>
                  <div className="text-[#5F5A72] text-[11px] mt-0.5">{agencyConfig.address}</div>
                  <div className="text-[#817B91] text-[11px] font-mono mt-1">
                    {agencyConfig.gstin ? `GSTIN: ${agencyConfig.gstin} | ` : ''}PAN: {agencyConfig.pan || 'AALFF1234F'}
                    {agencyConfig.msme_number ? ` | MSME: ${agencyConfig.msme_number}` : ''}
                  </div>
                </div>

                <div className="sm:border-l sm:border-[#E8E0F0] sm:pl-4">
                  <div className="text-[#8E2D9D] font-bold uppercase text-[10px] tracking-wider mb-1">Client / Billed To:</div>
                  <div className="text-[#1E1B2E] font-bold text-sm">{previewQuote.clientCompany || previewQuote.clientName}</div>
                  <div className="text-[#5F5A72] text-[11px]">Attn: {previewQuote.clientName}</div>
                  <div className="text-[#817B91] text-[11px]">{previewQuote.clientEmail}</div>
                  <div className="text-[#817B91] text-[10px] mt-1 font-mono">
                    Issue: <span className="text-[#1E1B2E] font-bold">{formatDateDDMMYYYY(previewQuote.issueDate)}</span> • Valid: <span className="text-[#1E1B2E] font-bold">{formatDateDDMMYYYY(previewQuote.validUntil)}</span>
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E8E0F0] text-[#5F5A72] uppercase text-[10px]">
                    <th className="py-2.5 px-2">Description</th>
                    <th className="py-2.5 px-2 text-center">Qty</th>
                    <th className="py-2.5 px-2 text-right">Rate (₹)</th>
                    <th className="py-2.5 px-2 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E0F0] font-mono">
                  {previewQuote.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF8FF]">
                      <td className="py-3 px-2 font-sans font-bold text-[#1E1B2E]">{item.description}</td>
                      <td className="py-3 px-2 text-center text-[#5F5A72]">{item.quantity}</td>
                      <td className="py-3 px-2 text-right text-[#5F5A72]">₹ {item.rate.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-2 text-right font-bold text-[#1E1B2E]">₹ {item.amount.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Summary Card */}
              <div className="p-4 rounded-2xl bg-[#FAF8FF] border border-[#E8E0F0] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#5F5A72] font-semibold">Subtotal:</span>
                  <span className="font-mono font-bold text-[#1E1B2E]">₹ {previewQuote.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {previewQuote.discountAmount > 0 && (
                  <div className="flex justify-between text-[#059669] font-semibold">
                    <span>Discount:</span>
                    <span className="font-mono font-bold">- ₹ {previewQuote.discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                
                {previewQuote.gstApplicable !== false && previewQuote.gstType !== 'none' && (previewQuote.totalAmount > (previewQuote.taxableAmount || previewQuote.subtotal)) ? (
                  <>
                    <div className="flex justify-between border-t border-[#E8E0F0] pt-1.5 font-bold">
                      <span className="text-[#5F5A72]">Taxable Amount:</span>
                      <span className="font-mono text-[#1E1B2E]">₹ {(previewQuote.taxableAmount || (previewQuote.subtotal - previewQuote.discountAmount)).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-[#8E2D9D] font-bold">
                      <span>GST ({previewQuote.gstRate || 18}%):</span>
                      <span className="font-mono font-bold">₹ {((previewQuote.cgstAmount || 0) + (previewQuote.sgstAmount || 0) + (previewQuote.igstAmount || 0)).toLocaleString('en-IN')}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between border-t border-[#E8E0F0] pt-1.5 text-[#059669] font-bold">
                    <span>Taxation:</span>
                    <span>Commercial Non-GST Quotation (₹ 0 Tax)</span>
                  </div>
                )}

                <div className="flex justify-between border-t-2 border-[#E8E0F0] pt-2 text-sm font-black">
                  <span className="text-[#1E1B2E]">Grand Total:</span>
                  <span className="font-mono text-[#8E2D9D] text-base font-black">₹ {previewQuote.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="p-4 rounded-2xl bg-[#FAF8FF] border border-[#E8E0F0] text-xs space-y-1.5">
                <div className="text-[#5F5A72] font-bold uppercase tracking-wider text-[10px]">Terms & Conditions:</div>
                <div className="text-[11px] text-[#4F4960] space-y-1 leading-relaxed">
                  {(previewQuote.termsAndConditions && previewQuote.termsAndConditions.length > 0) ? (
                    previewQuote.termsAndConditions.map((t, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#817B91] font-bold">{idx + 1}.</span>
                        <span>{t}</span>
                      </div>
                    ))
                  ) : (
                    <div>1. 50% advance on project kickoff, balance on milestone deliverables.<br/>2. Quotation is valid for 30 days from issue date.</div>
                  )}
                </div>
              </div>

              {/* Footer: Stamp & Signatures */}
              <div className="p-4 rounded-2xl bg-[#FAF8FF] border border-[#E8E0F0] flex flex-col sm:flex-row justify-between items-end gap-6 text-xs">
                {/* Stamp on the left of Authorized Signatory area */}
                <div>
                  {(agencyConfig.stamp_url || agencyConfig.stampUrl) ? (
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-2xl bg-white border border-[#E8E0F0] p-1 flex items-center justify-center overflow-hidden shadow-xs">
                        <img 
                          src={agencyConfig.stamp_url || agencyConfig.stampUrl} 
                          alt="Company Stamp" 
                          className="max-h-full max-w-full object-contain mix-blend-multiply" 
                        />
                      </div>
                      <span className="text-[9px] font-bold text-[#817B91] mt-1 uppercase tracking-wider">Official Stamp</span>
                    </div>
                  ) : (
                    <div className="w-20 h-20 border-2 border-dashed border-[#D9D2E3] rounded-2xl flex flex-col items-center justify-center text-[#817B91] text-[10px] text-center p-1 bg-white">
                      <div className="font-bold text-[#5F5A72]">OFFICIAL STAMP</div>
                      <div className="text-[8px] text-[#817B91] mt-0.5">{agencyConfig.company_name || agencyConfig.name || 'Fusion Forge Creation'}</div>
                    </div>
                  )}
                </div>

                <div className="text-center sm:text-right space-y-1.5">
                  <div className="text-[11px] text-[#5F5A72]">For <strong>{agencyConfig.company_name || agencyConfig.name || 'Fusion Forge Creation'}</strong></div>
                  <div className="h-12 flex items-center justify-center sm:justify-end">
                    {agencyConfig.signature_url ? (
                      <img 
                        src={agencyConfig.signature_url} 
                        alt="Authorized Signature" 
                        className="max-h-12 max-w-[160px] object-contain" 
                      />
                    ) : (
                      <div className="font-serif italic text-[#8E2D9D] font-bold text-base tracking-wider opacity-90">
                        Authorized Signature
                      </div>
                    )}
                  </div>
                  <div className="text-[11px] font-bold text-[#1E1B2E] border-t border-[#E8E0F0] pt-1 uppercase tracking-wider">
                    Authorised Signatory
                  </div>
                </div>
              </div>

              {/* Actions in Preview */}
              <div className="flex justify-between items-center pt-4 border-t border-[#E8E0F0]">
                <button
                  onClick={() => openEmailModal(previewQuote)}
                  className="px-4 py-2 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#8E2D9D] text-xs font-bold flex items-center space-x-1.5 border border-[#E8E0F0] cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email Quote</span>
                </button>

                <button
                  onClick={() => generateQuotationPDF(previewQuote, agencyConfig)}
                  className="px-5 py-2 rounded-xl bg-[#8E2D9D] hover:bg-[#6F42C1] text-white text-xs font-bold flex items-center space-x-2 transition-all shadow-md shadow-[#8E2D9D]/25 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download COMMERCIAL QUOTATION PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
