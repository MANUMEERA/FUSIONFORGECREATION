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
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Quotation, LineItem, GSTType, ServicePricePreset } from '../../types';
import { generateQuotationPDF } from '../../utils/pdfGenerator';
import { AGENCY_CONFIG } from '../../mockData';
import { calculateGstInvoiceTotals, INDIAN_GST_STATES, extractStateCode } from '../../utils/gstEngine';
import { generateNextDocumentNumber, DEFAULT_QUOTATION_NUMBERING } from '../../utils/documentNumbering';
import { BrandLogo } from '../BrandLogo';

export const QuotationsManager: React.FC = () => {
  const { quotations, clients, addQuotation, updateQuotation, convertQuoteToInvoice, addClient, agencyConfig, pricePresets, setActiveTab } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [previewQuote, setPreviewQuote] = useState<Quotation | null>(null);
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);

  // Form State
  const [quoteNumber, setQuoteNumber] = useState('');
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [title, setTitle] = useState('Website Design & Hosting Infrastructure');
  const [issueDate, setIssueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [validUntil, setValidUntil] = useState(() => {
    const days = agencyConfig?.default_quotation_validity_days || 30;
    return new Date(Date.now() + days * 86400000).toISOString().split('T')[0];
  });
  const [currency, setCurrency] = useState<'INR' | 'USD' | 'EUR'>('INR');
  const [gstType, setGstType] = useState<GSTType>('igst');
  const [gstRate, setGstRate] = useState<number>(18);
  
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

  // Authoritative GST calculation
  const authoritativeQuoteCalc = useMemo(() => {
    return calculateGstInvoiceTotals({
      sellerStateCode: '21',
      buyerStateCode: clientBuyerCode,
      items,
      discountType,
      discountValue: Number(discountValue) || 0,
      gstRate: gstType === 'none' ? 0 : gstRate,
      currency: currency || 'INR',
      overrideGstType: gstType === 'none' ? 'none' : undefined
    });
  }, [clientBuyerCode, items, discountType, discountValue, gstType, gstRate, currency]);

  const openCreateModal = () => {
    setEditingQuoteId(null);
    const quoteConfig = agencyConfig.numbering_configs?.quotation || DEFAULT_QUOTATION_NUMBERING;
    const existingNums = quotations.map(q => q.quoteNumber);
    const { number } = generateNextDocumentNumber('quotation', quoteConfig, existingNums);
    setQuoteNumber(number);
    setClientId(clients[0]?.id || '');
    setTitle('Website Design & Hosting Infrastructure');
    setIssueDate(new Date().toISOString().split('T')[0]);
    const validityDays = agencyConfig.default_quotation_validity_days || 30;
    setValidUntil(new Date(Date.now() + validityDays * 86400000).toISOString().split('T')[0]);
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
    setDiscountType(q.discountType || 'fixed');
    setDiscountValue(q.discountValue || 0);
    setGstType(q.gstType);
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
  const effectiveGstRate = authoritativeQuoteCalc.gstRate;
  const cgstAmount = authoritativeQuoteCalc.cgstAmount;
  const sgstAmount = authoritativeQuoteCalc.sgstAmount;
  const igstAmount = authoritativeQuoteCalc.igstAmount;
  const totalAmount = authoritativeQuoteCalc.grandTotal;

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

  const handleSaveQuotation = (targetStatus: 'draft' | 'sent') => {
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
      gstType,
      gstRate: effectiveGstRate,
      cgstAmount,
      sgstAmount,
      igstAmount,
      totalAmount,
      notes: 'Includes comprehensive quality audit, SLA support, and source repository handover.',
      termsAndConditions: AGENCY_CONFIG.terms,
      status: targetStatus,
      createdBy: 'Manoj Satapathy'
    };

    if (editingQuoteId) {
      updateQuotation(editingQuoteId, payload);
    } else {
      addQuotation(payload);
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
      gstType,
      gstRate: effectiveGstRate,
      cgstAmount,
      sgstAmount,
      igstAmount,
      totalAmount,
      notes: 'Generated via Fusion Forge Creation',
      termsAndConditions: AGENCY_CONFIG.terms,
      status: 'draft',
      createdBy: 'Manoj Satapathy',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    generateQuotationPDF(tempQuote, agencyConfig);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-[#111e47]/90 via-[#0d1b3e]/90 to-[#081430]/90 p-6 rounded-2xl border border-blue-500/20 shadow-lg">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">QUOTATIONS & ESTIMATES</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Create professional commercial proposals with Subtotal, Discount, Taxable Amount, GST calculation, and instant PDF generation.
          </p>
        </div>
        <button
          id="btn-create-quote-top"
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center space-x-2 transition-all shadow-md shadow-blue-600/30 hover:scale-[1.02] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Quotation</span>
        </button>
      </div>

      {/* Quotations List */}
      <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-b from-[#111e47]/90 to-[#0a1330]/90 overflow-hidden shadow-xl">
        <div className="px-5 py-4 border-b border-blue-500/20 flex justify-between items-center bg-[#0d1b3e]/80">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Active Quotation Records ({quotations.length})
          </div>
          <div className="text-[11px] text-slate-400">
            Standard Format: <span className="font-mono text-blue-400 font-semibold">QTN-YYYY-XXXX</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-[#09132c]/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-blue-500/20">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Quotation No</th>
                <th className="py-3.5 px-4 font-semibold">Client & Scope</th>
                <th className="py-3.5 px-4 font-semibold">Dates</th>
                <th className="py-3.5 px-4 font-semibold text-right">Taxable</th>
                <th className="py-3.5 px-4 font-semibold text-right">Grand Total (incl. GST)</th>
                <th className="py-3.5 px-4 font-semibold text-center">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-500/10">
              {quotations.map(q => {
                const taxAmt = q.taxableAmount ?? (q.subtotal - (q.discountAmount || 0));
                return (
                  <tr key={q.id} className="hover:bg-blue-600/10 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-blue-400">
                      {q.quoteNumber}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-white text-sm">{q.clientCompany || q.clientName}</div>
                      <div className="text-[11px] text-slate-300 truncate max-w-xs">{q.title}</div>
                      <div className="text-[10px] text-slate-400">{q.items?.length || 0} line item(s)</div>
                    </td>
                    <td className="py-4 px-4 text-slate-300 text-[11px]">
                      <div>Issued: <span className="text-white font-medium">{q.issueDate}</span></div>
                      <div className="text-slate-400">Valid: <span className="text-slate-200">{q.validUntil}</span></div>
                    </td>
                    <td className="py-4 px-4 text-right font-mono text-slate-200">
                      ₹ {taxAmt.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="font-bold text-cyan-400 font-mono text-sm">
                        ₹ {q.totalAmount.toLocaleString('en-IN')}
                      </div>
                      {q.discountAmount > 0 && (
                        <div className="text-[10px] text-emerald-400 font-mono">
                          Discount: -₹{q.discountAmount.toLocaleString('en-IN')}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <select
                        id={`select-status-${q.id}`}
                        value={q.status}
                        onChange={(e) => updateQuotation(q.id, { status: e.target.value as any })}
                        className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border outline-none cursor-pointer ${
                          q.status === 'converted' || q.status === 'Converted'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                            : q.status === 'Order Received' || q.status === 'order_received'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-black'
                            : q.status === 'approved' || q.status === 'Approved'
                            ? 'bg-teal-500/20 text-teal-300 border-teal-500/30'
                            : q.status === 'sent' || q.status === 'Sent'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                            : q.status === 'pending' || q.status === 'Pending'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : q.status === 'rejected' || q.status === 'Rejected'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : q.status === 'cancelled' || q.status === 'Cancelled'
                            ? 'bg-red-500/20 text-red-300 border-red-500/30'
                            : q.status === 'closed' || q.status === 'Closed'
                            ? 'bg-slate-700/50 text-slate-400 border-slate-600'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        <option value="draft" className="bg-[#0b132c] text-slate-200">Draft</option>
                        <option value="sent" className="bg-[#0b132c] text-blue-300">Sent</option>
                        <option value="Pending" className="bg-[#0b132c] text-amber-300">Pending</option>
                        <option value="Order Received" className="bg-[#0b132c] text-emerald-300">Order Received</option>
                        <option value="approved" className="bg-[#0b132c] text-teal-300">Approved</option>
                        <option value="converted" className="bg-[#0b132c] text-purple-300">Converted to Invoice</option>
                        <option value="Rejected" className="bg-[#0b132c] text-rose-300">Rejected</option>
                        <option value="Cancelled" className="bg-[#0b132c] text-red-300">Cancelled</option>
                        <option value="Closed" className="bg-[#0b132c] text-slate-400">Closed</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          id={`btn-view-${q.id}`}
                          onClick={() => setPreviewQuote(q)}
                          title="Preview Quotation Card"
                          className="p-2 rounded-lg bg-[#142352] hover:bg-blue-600 text-slate-300 hover:text-white border border-blue-500/20 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`btn-pdf-${q.id}`}
                          onClick={() => generateQuotationPDF(q, agencyConfig)}
                          title="Generate & Download PDF"
                          className="p-2 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 transition-all cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        {/* Only allow edit if not in final closed/converted/cancelled states */}
                        {!['closed', 'Closed', 'cancelled', 'Cancelled'].includes(q.status) && (
                          <button
                            id={`btn-edit-${q.id}`}
                            onClick={() => openEditModal(q)}
                            title="Edit Quotation"
                            className="px-2.5 py-1.5 rounded-lg bg-[#142352] hover:bg-[#1d3275] text-slate-200 text-[11px] font-semibold border border-blue-500/20 transition-colors"
                          >
                            Edit
                          </button>
                        )}
                        {/* Only allow invoice conversion if not already converted and not in non-convertible final state (Closed/Rejected/Cancelled) */}
                        {!['converted', 'Converted', 'closed', 'Closed', 'rejected', 'Rejected', 'cancelled', 'Cancelled'].includes(q.status) && (
                          <button
                            id={`btn-convert-${q.id}`}
                            onClick={() => convertQuoteToInvoice(q.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-600 border border-emerald-500/30 text-[11px] font-bold text-emerald-300 hover:text-white transition-all flex items-center space-x-1"
                            title="Progress Quotation to Tax Invoice"
                          >
                            <span>Invoice</span>
                            <ArrowRight className="w-3 h-3" />
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

      {/* CREATE / EDIT QUOTATION MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#0b132c] border border-blue-500/30 rounded-3xl w-full max-w-4xl p-6 sm:p-8 shadow-2xl my-auto text-slate-200">
            
            {/* Template Header Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-blue-500/20 mb-6">
              <BrandLogo size="md" variant="full" theme="dark" />
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/30">
                    Commercial Proposal Builder
                  </span>
                  <div className="font-mono text-xs text-slate-400 mt-1">{quoteNumber}</div>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Top Meta Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0e1938] p-4 rounded-2xl border border-blue-500/20">
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Quotation No:
                    </label>
                    <input
                      id="input-quote-number"
                      type="text"
                      value={quoteNumber}
                      onChange={e => setQuoteNumber(e.target.value)}
                      placeholder="QTN-2026-0001"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm font-mono font-bold text-blue-400 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                        Client: [Select Client]
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowQuickClient(!showQuickClient)}
                        className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold underline cursor-pointer"
                      >
                        {showQuickClient ? 'Cancel New' : '+ Add New Client'}
                      </button>
                    </div>

                    {!showQuickClient ? (
                      <select
                        id="select-client"
                        value={clientId}
                        onChange={e => setClientId(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-blue-500"
                      >
                        {clients.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.companyName} ({c.name})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="p-3 bg-slate-900 rounded-xl border border-blue-500/40 space-y-2 mt-1 shadow-lg">
                        <div className="text-[10px] font-bold text-blue-400 uppercase">Quick Add New Client</div>
                        <input
                          type="text"
                          placeholder="Client / Representative Name *"
                          value={newClientName}
                          onChange={e => setNewClientName(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="Company / Business Name"
                          value={newClientCompany}
                          onChange={e => setNewClientCompany(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-blue-500"
                        />
                        <input
                          type="email"
                          placeholder="Email Address *"
                          value={newClientEmail}
                          onChange={e => setNewClientEmail(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={handleQuickAddClient}
                          className="w-full py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-500"
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
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                        Issue Date: [Date]
                      </label>
                      <input
                        id="input-issue-date"
                        type="date"
                        value={issueDate}
                        onChange={e => setIssueDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                        Valid Until: [Date]
                      </label>
                      <input
                        id="input-valid-until"
                        type="date"
                        value={validUntil}
                        onChange={e => setValidUntil(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Taxation & GST Mode:
                    </label>
                    <select
                      id="select-gst-mode"
                      value={gstType}
                      onChange={e => setGstType(e.target.value as any)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-blue-500"
                    >
                      <option value="igst">Integrated GST (IGST 18%) - Standard Inter-State</option>
                      <option value="cgst_sgst">CGST (9%) + SGST (9%) - Intra-State Odisha</option>
                      <option value="none">Tax Exempt / 0% Export</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Title / Scope */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                  Project Title / Scope:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Website Design & Hosting Infrastructure"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              {/* Quick Presets */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Quick Add Service Presets (Supabase Master):</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Click to insert line item</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {pricePresets.filter(p => p.is_active).map(preset => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => addItem(preset.service_name, preset.default_price, preset.sac_code || '998314')}
                      className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 border border-blue-500/30 text-[11px] font-semibold text-blue-300 hover:text-white transition-all cursor-pointer flex items-center space-x-1.5"
                      title={preset.description ? `${preset.description} (SAC: ${preset.sac_code || '998314'})` : `SAC: ${preset.sac_code || '998314'}`}
                    >
                      <Plus className="w-3 h-3 text-cyan-400" />
                      <span>{preset.service_name}</span>
                      <span className="font-mono text-cyan-300 font-bold">₹{preset.default_price.toLocaleString('en-IN')}</span>
                    </button>
                  ))}

                  {pricePresets.filter(p => p.is_active).length === 0 && (
                    <div className="text-xs text-slate-400 italic">
                      No active presets found. Configure price presets in Agency Settings.
                    </div>
                  )}
                </div>
              </div>

              {/* LINE ITEMS TABLE */}
              <div className="border border-blue-500/20 rounded-2xl overflow-hidden bg-[#0e1938]">
                <div className="p-3 bg-[#0a132c] border-b border-blue-500/20 flex justify-between items-center">
                  <div className="text-xs font-bold text-white uppercase tracking-wider">
                    Line Items
                  </div>
                  <button
                    type="button"
                    onClick={() => addItem('', 10000)}
                    className="text-xs font-bold text-blue-400 hover:text-white flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600 border border-blue-500/30 cursor-pointer transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="p-3 space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                    <div className="col-span-5">Description</div>
                    <div className="col-span-2 text-center">Qty</div>
                    <div className="col-span-2 text-right">Rate (₹)</div>
                    <div className="col-span-2 text-right">Amount (₹)</div>
                    <div className="col-span-1 text-center">Del</div>
                  </div>

                  {items.map((item, idx) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 hover:border-blue-500/40 transition-colors shadow-inner">
                      <div className="col-span-5">
                        <input
                          required
                          type="text"
                          placeholder="e.g. Website Design"
                          value={item.description}
                          onChange={e => updateItem(idx, 'description', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs font-semibold text-white outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          required
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={e => updateItem(idx, 'quantity', Number(e.target.value))}
                          className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-center text-white outline-none focus:border-blue-500"
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
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-right text-white outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="col-span-2 text-right font-mono font-bold text-cyan-400 text-xs pr-1">
                        ₹ {item.amount.toLocaleString('en-IN')}
                      </div>
                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FINANCIAL BREAKDOWN BOX */}
              <div className="bg-[#0e1938] rounded-2xl border-2 border-blue-500/30 p-5 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-slate-300">Subtotal</span>
                  <span className="font-mono font-bold text-white text-base">
                    ₹ {subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Discount Row */}
                <div className="flex justify-between items-center text-sm py-1 border-t border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-300">Discount</span>
                    <div className="flex items-center space-x-1 bg-slate-900 rounded-lg p-0.5 border border-slate-700">
                      <button
                        type="button"
                        onClick={() => setDiscountType('fixed')}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded ${discountType === 'fixed' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                      >
                        ₹ Fixed
                      </button>
                      <button
                        type="button"
                        onClick={() => setDiscountType('percentage')}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded ${discountType === 'percentage' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
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
                      className="w-24 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <span className="font-mono font-bold text-emerald-400">
                    - ₹ {discountAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Taxable Amount Row */}
                <div className="flex justify-between items-center text-sm py-1 border-t border-slate-800">
                  <span className="font-bold text-slate-200">Taxable Amount</span>
                  <span className="font-mono font-bold text-white text-base">
                    ₹ {taxableAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* GST Row */}
                <div className="flex justify-between items-center text-sm py-1 border-t border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-300">
                      GST ({effectiveGstRate}%)
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {gstType === 'cgst_sgst' ? '(CGST 9% + SGST 9%)' : gstType === 'igst' ? '(IGST 18%)' : '(Exempt)'}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-blue-400">
                    ₹ {(cgstAmount + sgstAmount + igstAmount).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Grand Total Row */}
                <div className="flex justify-between items-center pt-3 border-t-2 border-slate-700 text-base">
                  <span className="font-black text-white text-lg">Grand Total</span>
                  <span className="font-mono font-black text-cyan-400 text-xl tracking-tight">
                    ₹ {totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors w-full sm:w-auto"
                >
                  Cancel
                </button>

                <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                  {/* [Save Draft] */}
                  <button
                    id="btn-save-draft"
                    type="button"
                    onClick={() => handleSaveQuotation('draft')}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <Save className="w-4 h-4 text-slate-400" />
                    <span>Save Draft</span>
                  </button>

                  {/* [Generate PDF] */}
                  <button
                    id="btn-generate-pdf"
                    type="button"
                    onClick={handleGeneratePDFFromModal}
                    className="px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/30 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Generate PDF</span>
                  </button>

                  {/* [Send] */}
                  <button
                    id="btn-send-quote"
                    type="button"
                    onClick={() => handleSaveQuotation('sent')}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black flex items-center space-x-2 transition-all shadow-md shadow-blue-600/30 hover:scale-[1.02] cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* QUOTATION PREVIEW MODAL */}
      {previewQuote && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b132c] border border-blue-500/30 rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl text-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
              <BrandLogo size="md" variant="full" theme="dark" />
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/30">
                    Commercial Estimate
                  </span>
                  <div className="font-mono text-xs font-bold text-blue-400 mt-1">{previewQuote.quoteNumber}</div>
                </div>
                <button
                  onClick={() => setPreviewQuote(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-5">
              {/* Seller & Client Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#0e1938] border border-blue-500/20 text-xs">
                <div>
                  <div className="text-cyan-400 font-bold uppercase text-[10px] tracking-wider mb-1 flex items-center justify-between">
                    <span>Seller / Agency (Live Compliance)</span>
                    <span className="font-mono text-[9px] text-slate-400">SAC: {agencyConfig.sacCode || '998314'}</span>
                  </div>
                  <div className="text-white font-bold text-sm">{agencyConfig.company_name || agencyConfig.name || 'Fusion Forge Creation'}</div>
                  <div className="text-slate-300 text-[11px] mt-0.5">{agencyConfig.address}</div>
                  <div className="text-slate-400 text-[11px] font-mono mt-1">
                    GSTIN: <strong className="text-slate-200">{agencyConfig.gstin}</strong> | PAN: <strong className="text-slate-200">{agencyConfig.pan}</strong>
                  </div>
                </div>

                <div className="sm:border-l sm:border-slate-800 sm:pl-4">
                  <div className="text-blue-400 font-bold uppercase text-[10px] tracking-wider mb-1">Client:</div>
                  <div className="text-white font-bold text-sm">{previewQuote.clientCompany || previewQuote.clientName}</div>
                  <div className="text-slate-300 text-[11px]">Attn: {previewQuote.clientName}</div>
                  <div className="text-slate-400 text-[11px]">{previewQuote.clientEmail}</div>
                  <div className="text-slate-400 text-[10px] mt-1">
                    Issue: <span className="font-mono text-white font-bold">{previewQuote.issueDate}</span> • Valid: <span className="font-mono text-white font-bold">{previewQuote.validUntil}</span>
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                    <th className="py-2.5 px-2">Description</th>
                    <th className="py-2.5 px-2 text-center">Qty</th>
                    <th className="py-2.5 px-2 text-right">Rate</th>
                    <th className="py-2.5 px-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {previewQuote.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50">
                      <td className="py-3 px-2 font-sans font-semibold text-slate-200">{item.description}</td>
                      <td className="py-3 px-2 text-center text-slate-300">{item.quantity}</td>
                      <td className="py-3 px-2 text-right text-slate-300">₹ {item.rate.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-2 text-right font-bold text-cyan-400">₹ {item.amount.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Summary Card */}
              <div className="p-4 rounded-xl bg-[#0e1938] border border-blue-500/20 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subtotal:</span>
                  <span className="font-mono font-bold text-white">₹ {previewQuote.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {previewQuote.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount:</span>
                    <span className="font-mono font-bold">- ₹ {previewQuote.discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-slate-800 pt-1.5 font-bold">
                  <span className="text-slate-300">Taxable Amount:</span>
                  <span className="font-mono text-white">₹ {(previewQuote.taxableAmount || (previewQuote.subtotal - previewQuote.discountAmount)).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-blue-400">
                  <span>GST ({previewQuote.gstRate || 18}%):</span>
                  <span className="font-mono font-bold">₹ {((previewQuote.cgstAmount || 0) + (previewQuote.sgstAmount || 0) + (previewQuote.igstAmount || 0)).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-t-2 border-slate-700 pt-2 text-sm font-black">
                  <span className="text-white">Grand Total:</span>
                  <span className="font-mono text-cyan-400 text-base">₹ {previewQuote.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  onClick={() => generateQuotationPDF(previewQuote, agencyConfig)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center space-x-2 transition-all shadow-sm cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Document</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
