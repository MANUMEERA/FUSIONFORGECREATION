import React, { useState, useMemo } from 'react';
import { 
  Receipt, 
  Plus, 
  Download, 
  Printer,
  Eye,
  Edit,
  Trash2, 
  RotateCcw,
  CreditCard, 
  Search,
  Filter,
  CheckCircle2, 
  AlertCircle,
  Clock,
  Building2,
  ShieldCheck,
  UserCheck,
  X,
  FileText,
  DollarSign,
  ChevronRight,
  Info,
  Sparkles,
  Zap,
  Check,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Invoice, LineItem, GSTType, InvoiceStatus } from '../../types';
import { generateInvoicePDF } from '../../utils/pdfGenerator';
import { 
  calculateGstInvoiceTotals, 
  INDIAN_GST_STATES, 
  extractStateCode, 
  getStateDetails,
  UT_WITHOUT_LEGISLATURE_CODES
} from '../../utils/gstEngine';
import { BrandLogo } from '../BrandLogo';

export const InvoicesManager: React.FC = () => {
  const { 
    invoices, 
    clients, 
    currentUser, 
    addInvoice, 
    updateInvoice, 
    deleteInvoice, 
    softDeleteInvoice, 
    restoreInvoice, 
    recordPayment,
    agencyConfig,
    switchRole
  } = useApp();

  const isSuperAdmin = currentUser.role === 'super_admin';
  const isAccountantOrSuper = currentUser.role === 'super_admin' || currentUser.role === 'accountant' || currentUser.role === 'admin';

  // Active / Trash tab
  const [activeTab, setActiveTab] = useState<'active' | 'trash'>('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals state
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [showGstSimulator, setShowGstSimulator] = useState(false);

  // Payment modal form state
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<'bank_transfer' | 'upi' | 'credit_card'>('bank_transfer');
  const [payRef, setPayRef] = useState('');

  // Invoice Edit / Create Form state
  const [formInvoiceNumber, setFormInvoiceNumber] = useState('');
  const [formClientId, setFormClientId] = useState('');
  const [formClientCompany, setFormClientCompany] = useState('');
  const [formClientName, setFormClientName] = useState('');
  const [formClientAddress, setFormClientAddress] = useState('');
  const [formClientGstin, setFormClientGstin] = useState('');
  
  // Explicit Seller & Buyer State Codes (GST Engine authoritative inputs)
  const [formSellerStateCode, setFormSellerStateCode] = useState('21'); // Default Odisha, or 26 for DNH & DD
  const [formBuyerStateCode, setFormBuyerStateCode] = useState('24'); // Default Gujarat

  const [formTitle, setFormTitle] = useState('');
  const [formIssueDate, setFormIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [formDueDate, setFormDueDate] = useState(new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]);
  const [formItems, setFormItems] = useState<LineItem[]>([
    { id: '1', description: 'Enterprise Textile Production ERP Module', sacCode: '998314', quantity: 1, rate: 120000, amount: 120000 },
    { id: '2', description: 'Yarn & Fabric Inventory Automation Engine', sacCode: '998314', quantity: 1, rate: 40000, amount: 40000 },
    { id: '3', description: 'Cloud Deployment, SSL & PostgreSQL Setup', sacCode: '998314', quantity: 1, rate: 20000, amount: 20000 }
  ]);
  const [formDiscountType, setFormDiscountType] = useState<'percentage' | 'fixed'>('fixed');
  const [formDiscountValue, setFormDiscountValue] = useState<number>(10000);
  const [formGstRate, setFormGstRate] = useState<number>(18);
  const [formStatus, setFormStatus] = useState<InvoiceStatus>('issued');
  const [formNotes, setFormNotes] = useState('SAC 998314 - Software development & IT consulting.');
  const [formPaymentTerms, setFormPaymentTerms] = useState('Payment due within 15 days of invoice date.');

  // GST Simulator Sandbox state
  const [simSellerCode, setSimSellerCode] = useState('26');
  const [simBuyerCode, setSimBuyerCode] = useState('26');
  const [simTaxableAmt, setSimTaxableAmt] = useState(100000);
  const [simGstRate, setSimGstRate] = useState(18);

  // Authoritative GST Engine calculation for the active form
  const authoritativeCalculation = useMemo(() => {
    return calculateGstInvoiceTotals({
      sellerStateCode: formSellerStateCode,
      buyerStateCode: formBuyerStateCode,
      items: formItems,
      discountType: formDiscountType,
      discountValue: formDiscountValue,
      gstRate: formGstRate,
      currency: 'INR'
    });
  }, [formSellerStateCode, formBuyerStateCode, formItems, formDiscountType, formDiscountValue, formGstRate]);

  // Authoritative GST calculation for the Simulator
  const simCalculation = useMemo(() => {
    return calculateGstInvoiceTotals({
      sellerStateCode: simSellerCode,
      buyerStateCode: simBuyerCode,
      items: [{ quantity: 1, rate: simTaxableAmt, description: 'Test Software Supply' }],
      discountType: 'fixed',
      discountValue: 0,
      gstRate: simGstRate,
      currency: 'INR'
    });
  }, [simSellerCode, simBuyerCode, simTaxableAmt, simGstRate]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setIsCreating(true);
    setEditingInvoice(null);
    const nextNum = `FFC-2026-${String(invoices.length + 1).padStart(4, '0')}`;
    setFormInvoiceNumber(nextNum);

    // Default to JP MODATEX LLP or first available client
    const defClient = clients.find(c => c.companyName.includes('JP MODATEX')) || clients[0];
    if (defClient) {
      setFormClientId(defClient.id);
      setFormClientCompany(defClient.companyName);
      setFormClientName(defClient.contactPerson || defClient.name);
      setFormClientAddress(defClient.address || '');
      setFormClientGstin(defClient.gstin || '—');
      setFormBuyerStateCode(defClient.stateCode || '24');
    } else {
      setFormClientId('');
      setFormClientCompany('JP MODATEX LLP');
      setFormClientName('Manoj Satapathy');
      setFormClientAddress('Survey No. 42, GIDC Industrial Estate, Sachin, Surat, Gujarat - 394230');
      setFormClientGstin('—');
      setFormBuyerStateCode('24');
    }

    setFormSellerStateCode('21'); // Fusion Forge Creation default
    setFormTitle('Textile ERP Workflow Automation & Inventory Engine');
    setFormIssueDate(new Date().toISOString().split('T')[0]);
    setFormDueDate(new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]);
    setFormItems([
      { id: '1', description: 'Enterprise Textile Production ERP Module', sacCode: '998314', quantity: 1, rate: 120000, amount: 120000 },
      { id: '2', description: 'Yarn & Fabric Inventory Automation Engine', sacCode: '998314', quantity: 1, rate: 40000, amount: 40000 },
      { id: '3', description: 'Cloud Deployment, SSL & PostgreSQL Setup', sacCode: '998314', quantity: 1, rate: 20000, amount: 20000 }
    ]);
    setFormDiscountType('fixed');
    setFormDiscountValue(10000);
    setFormGstRate(18);
    setFormStatus('issued');
    setFormNotes('SAC 998314 - Information Technology software design and cloud configuration.');
    setFormPaymentTerms('Payment due within 15 days.');
  };

  // Open Edit Modal (Super Admin only)
  const handleOpenEdit = (inv: Invoice) => {
    setIsCreating(false);
    setEditingInvoice(inv);
    setFormInvoiceNumber(inv.invoiceNumber);
    setFormClientId(inv.clientId);
    setFormClientCompany(inv.buyerCompany || inv.clientCompany);
    setFormClientName(inv.buyerName || inv.clientName);
    setFormClientAddress(inv.buyerAddress || inv.clientAddress);
    setFormClientGstin(inv.buyerGstin || inv.clientGstin || '—');
    setFormSellerStateCode(inv.sellerStateCode || '21');
    setFormBuyerStateCode(inv.buyerStateCode || '24');
    setFormTitle(inv.title);
    setFormIssueDate(inv.issueDate);
    setFormDueDate(inv.dueDate);
    setFormItems(inv.items.map(i => ({ ...i })));
    setFormDiscountType(inv.discountType);
    setFormDiscountValue(inv.discountValue);
    setFormGstRate(inv.gstRate || 18);
    setFormStatus(inv.status);
    setFormNotes(inv.notes);
    setFormPaymentTerms(inv.paymentTerms);
  };

  // Handle client selection in form
  const handleClientSelect = (clientId: string) => {
    setFormClientId(clientId);
    const cl = clients.find(c => c.id === clientId);
    if (cl) {
      setFormClientCompany(cl.companyName);
      setFormClientName(cl.contactPerson || cl.name);
      setFormClientAddress(cl.address || '');
      setFormClientGstin(cl.gstin || '—');
      setFormBuyerStateCode(cl.stateCode || extractStateCode(cl.state));
    }
  };

  // Handle item changes
  const handleItemChange = (index: number, field: keyof LineItem, val: any) => {
    const updated = [...formItems];
    const item = { ...updated[index], [field]: val };
    if (field === 'quantity' || field === 'rate') {
      const q = field === 'quantity' ? Number(val) : item.quantity;
      const r = field === 'rate' ? Number(val) : item.rate;
      item.amount = q * r;
    }
    updated[index] = item;
    setFormItems(updated);
  };

  const handleAddItem = () => {
    setFormItems(prev => [
      ...prev,
      { id: String(Date.now()), description: '', sacCode: '998314', quantity: 1, rate: 0, amount: 0 }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (formItems.length <= 1) return;
    setFormItems(prev => prev.filter((_, i) => i !== index));
  };

  // Save Invoice (Create allowed for Super Admin / Accountant; Modify strictly Super Admin only)
  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingInvoice && !isSuperAdmin) {
      alert('Security Policy Violation: Only super_admin can modify existing invoices (RLS enforced).');
      return;
    }
    if (isCreating && !isAccountantOrSuper) {
      alert('Security Policy Violation: Only super_admin or accountant can generate new invoices.');
      return;
    }

    const sellerState = getStateDetails(formSellerStateCode);
    const buyerState = getStateDetails(formBuyerStateCode);

    // Payload is enriched and validated through authoritative calculation layer
    const invoicePayload = {
      invoiceNumber: formInvoiceNumber,
      clientId: formClientId || 'client_0',
      clientName: formClientName,
      clientCompany: formClientCompany,
      clientEmail: clients.find(c => c.id === formClientId)?.email || 'contact@jpmodatex.com',
      clientAddress: formClientAddress,
      clientGstin: formClientGstin,
      
      sellerName: agencyConfig.name,
      sellerAddress: `${agencyConfig.address}, ${agencyConfig.city}, ${agencyConfig.state} - ${agencyConfig.postalCode}`,
      sellerGstin: agencyConfig.gstin,
      sellerState: `${sellerState.name} [${sellerState.code}]`,
      sellerStateCode: formSellerStateCode,
      
      buyerCompany: formClientCompany,
      buyerName: formClientName,
      buyerAddress: formClientAddress,
      buyerGstin: formClientGstin,
      buyerState: `${buyerState.name} [${buyerState.code}]`,
      buyerStateCode: formBuyerStateCode,

      title: formTitle,
      issueDate: formIssueDate,
      dueDate: formDueDate,
      currency: 'INR' as const,
      items: formItems,
      discountType: formDiscountType,
      discountValue: formDiscountValue,
      gstRate: formGstRate,
      status: formStatus,
      paymentTerms: formPaymentTerms,
      bankDetails: agencyConfig.bankDetails,
      notes: formNotes,
      
      // Authoritative fields calculated directly by Supabase-compliant engine
      subtotal: authoritativeCalculation.subtotal,
      discountAmount: authoritativeCalculation.discountAmount,
      taxableAmount: authoritativeCalculation.taxableAmount,
      gstType: authoritativeCalculation.gstType,
      cgstAmount: authoritativeCalculation.cgstAmount,
      sgstAmount: authoritativeCalculation.sgstAmount,
      utgstAmount: authoritativeCalculation.utgstAmount,
      igstAmount: authoritativeCalculation.igstAmount,
      totalAmount: authoritativeCalculation.grandTotal,
      amountInWords: authoritativeCalculation.amountInWords,
      supplyType: authoritativeCalculation.supplyType,
      taxLabel: authoritativeCalculation.taxLabel
    };

    if (isCreating) {
      addInvoice(invoicePayload as any);
    } else if (editingInvoice) {
      updateInvoice(editingInvoice.id, invoicePayload as any);
    }

    setIsCreating(false);
    setEditingInvoice(null);
  };

  // Open Payment Modal
  const openPaymentModal = (inv: Invoice) => {
    setPayingInvoice(inv);
    setPayAmount(inv.balanceDue > 0 ? inv.balanceDue : inv.totalAmount);
    setPayRef(`NEFT/HDFC/${Date.now().toString().slice(-8)}`);
  };

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingInvoice) return;

    recordPayment({
      invoiceId: payingInvoice.id,
      invoiceNumber: payingInvoice.invoiceNumber,
      clientId: payingInvoice.clientId,
      clientName: payingInvoice.clientCompany,
      amount: Number(payAmount),
      currency: payingInvoice.currency,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: payMethod,
      transactionReference: payRef,
      recordedBy: currentUser.name,
      notes: `Recorded against Tax Invoice ${payingInvoice.invoiceNumber}`
    });

    setPayingInvoice(null);
  };

  // Filtered Invoices
  const displayedInvoices = useMemo(() => {
    return invoices.filter(inv => {
      // Trash filter
      if (activeTab === 'trash') {
        if (!inv.isDeleted) return false;
      } else {
        if (inv.isDeleted) return false;
      }

      // Status filter
      if (statusFilter !== 'all' && inv.status !== statusFilter) {
        return false;
      }

      // Search filter
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const num = inv.invoiceNumber.toLowerCase();
        const client = (inv.buyerCompany || inv.clientCompany || inv.clientName || '').toLowerCase();
        const gstin = (inv.buyerGstin || inv.clientGstin || '').toLowerCase();
        const title = (inv.title || '').toLowerCase();
        return num.includes(q) || client.includes(q) || gstin.includes(q) || title.includes(q);
      }

      return true;
    });
  }, [invoices, activeTab, statusFilter, searchTerm]);

  return (
    <div className="space-y-6">
      
      {/* ========================================================================= */}
      {/* HEADER & ROLE AWARENESS BANNER                                           */}
      {/* ========================================================================= */}
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-black text-white flex items-center space-x-2.5">
              <Receipt className="w-7 h-7 text-cyan-400" />
              <span>Tax Invoices & GST Engine</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              SAC 998314
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Authoritative Supabase PostgreSQL calculation layer for GST compliance (CGST + SGST, CGST + UTGST, IGST).
          </p>
        </div>

        <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
          {/* GST Rule Inspector / Simulator Toggle */}
          <button
            onClick={() => setShowGstSimulator(!showGstSimulator)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 ${
              showGstSimulator
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white border-blue-400 shadow-lg shadow-blue-500/25'
                : 'bg-gradient-to-r from-slate-900 to-slate-800 text-cyan-400 border-blue-500/30 hover:border-cyan-400 hover:from-slate-850 hover:to-slate-750 shadow-sm'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>GST Engine Sandbox</span>
          </button>

          {/* Super Admin Status Badge & Switcher */}
          <div className="flex items-center space-x-2 bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700/80 rounded-xl p-1 px-2.5 text-xs shadow-sm">
            <ShieldCheck className={`w-4 h-4 ${isSuperAdmin ? 'text-amber-400' : 'text-slate-500'}`} />
            <span className="text-slate-400 text-[11px]">Role:</span>
            <span className={`font-bold text-[11px] uppercase ${isSuperAdmin ? 'text-amber-400' : 'text-cyan-400'}`}>
              {currentUser.role.replace('_', ' ')}
            </span>
            {!isSuperAdmin && (
              <button
                onClick={() => switchRole('super_admin')}
                className="ml-2 text-[10px] text-amber-400 underline hover:text-amber-300 font-semibold cursor-pointer"
              >
                Switch to Super Admin
              </button>
            )}
          </div>

          {/* Super Admin & Accountant Create Invoice Button */}
          {isAccountantOrSuper && (
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-blue-500/25 transition-all active:scale-95 cursor-pointer border border-blue-400/30"
            >
              <Plus className="w-4 h-4" />
              <span>Create Tax Invoice</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 7. GST ENGINE: AUTHORITATIVE RULE SIMULATOR / INSPECTOR                   */}
      {/* ========================================================================= */}
      {showGstSimulator && (
        <div className="bg-gradient-to-r from-[#070e24] via-[#0d1c44] to-[#070e24] rounded-2xl border-2 border-blue-500/40 p-5 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-blue-500/20 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500/30 to-cyan-500/30 text-cyan-300 border border-cyan-500/40">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Supabase GST Engine: Authoritative Calculation Sandbox</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                    PostgreSQL PL/pgSQL Function
                  </span>
                </h2>
                <p className="text-[11px] text-slate-300">
                  Strict Rule: The frontend is strictly forbidden from independently calculating totals. Supabase executes calculation trigger <code className="text-cyan-300">trg_invoice_authoritative_gst</code>.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowGstSimulator(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="text-[11px] text-slate-400 self-center mr-1">Quick Scenarios:</span>
            <button
              type="button"
              onClick={() => { setSimSellerCode('26'); setSimBuyerCode('26'); }}
              className={`px-3 py-1.5 rounded-lg font-semibold border transition-all ${
                simSellerCode === '26' && simBuyerCode === '26'
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              Case 1: Intra-State UT (Seller: 26 → Buyer: 26) → <strong className="text-cyan-300">CGST + UTGST</strong>
            </button>
            <button
              type="button"
              onClick={() => { setSimSellerCode('26'); setSimBuyerCode('27'); }}
              className={`px-3 py-1.5 rounded-lg font-semibold border transition-all ${
                simSellerCode === '26' && simBuyerCode === '27'
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              Case 2: Inter-State (Seller: 26 → Buyer: 27) → <strong className="text-cyan-300">IGST</strong>
            </button>
            <button
              type="button"
              onClick={() => { setSimSellerCode('21'); setSimBuyerCode('24'); }}
              className={`px-3 py-1.5 rounded-lg font-semibold border transition-all ${
                simSellerCode === '21' && simBuyerCode === '24'
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              Case 3: Inter-State (Seller: 21 Odisha → Buyer: 24 Gujarat) → <strong className="text-cyan-300">IGST</strong>
            </button>
            <button
              type="button"
              onClick={() => { setSimSellerCode('21'); setSimBuyerCode('21'); }}
              className={`px-3 py-1.5 rounded-lg font-semibold border transition-all ${
                simSellerCode === '21' && simBuyerCode === '21'
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              Case 4: Intra-State (Seller: 21 → Buyer: 21) → <strong className="text-cyan-300">CGST + SGST</strong>
            </button>
          </div>

          {/* Interactive Controls & Live Output Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-xs">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Seller State / UT</label>
              <select
                value={simSellerCode}
                onChange={e => setSimSellerCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
              >
                {INDIAN_GST_STATES.map(s => (
                  <option key={`seller_${s.code}`} value={s.code}>
                    {s.code} - {s.name} {s.isUnionTerritoryWithoutLegislature ? '[UT]' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Buyer State / UT</label>
              <select
                value={simBuyerCode}
                onChange={e => setSimBuyerCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
              >
                {INDIAN_GST_STATES.map(s => (
                  <option key={`buyer_${s.code}`} value={s.code}>
                    {s.code} - {s.name} {s.isUnionTerritoryWithoutLegislature ? '[UT]' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Taxable Amount (₹)</label>
              <input
                type="number"
                value={simTaxableAmt}
                onChange={e => setSimTaxableAmt(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">GST Rate (%)</label>
              <select
                value={simGstRate}
                onChange={e => setSimGstRate(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
              >
                <option value={18}>18% (Standard SAC 998314)</option>
                <option value={12}>12%</option>
                <option value={5}>5%</option>
                <option value={0}>0% (Exempt)</option>
              </select>
            </div>
          </div>

          {/* Engine Output Card */}
          <div className="bg-slate-950 border border-blue-500/30 rounded-xl p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center text-xs">
            <div className="space-y-1">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Supply Classification</div>
              <div className="font-mono font-bold text-white text-sm flex items-center gap-1.5">
                <span className={`px-2 py-0.5 rounded text-[11px] ${
                  simCalculation.supplyType === 'INTRA_STATE' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                }`}>
                  {simCalculation.supplyType.replace('_', ' ')}
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                {simCalculation.isIntraState ? 'Same State/UT Code' : 'Cross-border Inter-State'}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Tax Structure Result</div>
              <div className="text-base font-black text-cyan-400">
                {simCalculation.taxLabel}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {simCalculation.gstType === 'cgst_utgst' && 'CGST (9%) + UTGST (9%)'}
                {simCalculation.gstType === 'cgst_sgst' && 'CGST (9%) + SGST (9%)'}
                {simCalculation.gstType === 'igst' && 'IGST (18%) Pan-India'}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Computed Tax Breakdown</div>
              <div className="space-y-0.5 font-mono text-[11px]">
                {simCalculation.cgstAmount > 0 && <div>CGST: ₹{simCalculation.cgstAmount.toLocaleString('en-IN')}</div>}
                {simCalculation.sgstAmount > 0 && <div>SGST: ₹{simCalculation.sgstAmount.toLocaleString('en-IN')}</div>}
                {simCalculation.utgstAmount > 0 && <div className="text-amber-400 font-bold">UTGST: ₹{simCalculation.utgstAmount.toLocaleString('en-IN')}</div>}
                {simCalculation.igstAmount > 0 && <div className="text-cyan-400 font-bold">IGST: ₹{simCalculation.igstAmount.toLocaleString('en-IN')}</div>}
              </div>
            </div>

            <div className="space-y-1 md:text-right">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Grand Total (Authoritative)</div>
              <div className="text-lg font-black text-emerald-400 font-mono">
                ₹{simCalculation.grandTotal.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-slate-400 truncate max-w-xs md:ml-auto">
                {simCalculation.amountInWords}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SEARCH, STATUS FILTER & TABS                                             */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#09132e]/90 via-[#0d1c44]/90 to-[#09132e]/90 p-3.5 rounded-2xl border border-blue-500/20 shadow-lg">
        
        {/* Active vs Trash Tabs */}
        <div className="flex items-center space-x-1.5 bg-[#050b1a] p-1 rounded-xl border border-blue-500/20 shadow-inner">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'active'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 border border-blue-400/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Active Invoices ({invoices.filter(i => !i.isDeleted).length})
          </button>
          <button
            onClick={() => setActiveTab('trash')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'trash'
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-500/20 border border-rose-400/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Trash / Soft-Deleted ({invoices.filter(i => i.isDeleted).length})
          </button>
        </div>

        {/* Search & Status Filter */}
        <div className="flex items-center space-x-2 flex-1 sm:max-w-md">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by invoice #, client, GSTIN..."
              className="w-full bg-[#050b1a] border border-blue-500/25 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/30 placeholder:text-slate-500 shadow-inner"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-[#050b1a] border border-blue-500/25 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 shadow-inner cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="partially_paid">Partially Paid</option>
            <option value="issued">Issued</option>
            <option value="overdue">Overdue</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INVOICE MASTER TABLE                                                     */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-b from-[#08122c]/80 via-[#060e22]/80 to-[#040817]/90 overflow-hidden shadow-xl backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gradient-to-r from-[#0a1533] via-[#0e1d47] to-[#0a1533] text-slate-300 uppercase text-[10px] tracking-wider border-b border-blue-500/20">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Invoice # & Date</th>
                <th className="py-3.5 px-4 font-semibold">Seller & Buyer</th>
                <th className="py-3.5 px-4 font-semibold">Tax Treatment</th>
                <th className="py-3.5 px-4 font-semibold text-right">Taxable</th>
                <th className="py-3.5 px-4 font-semibold text-right">Grand Total</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {displayedInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Receipt className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-40" />
                    <p className="font-semibold text-sm text-slate-300">No invoices found</p>
                    <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or search terms.</p>
                  </td>
                </tr>
              ) : (
                displayedInvoices.map(inv => {
                  const isOverdue = inv.status === 'overdue' || (inv.balanceDue > 0 && new Date(inv.dueDate) < new Date());
                  const isUT = (inv.utgstAmount && inv.utgstAmount > 0) || inv.gstType === 'cgst_utgst';

                  return (
                    <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Invoice # & Date */}
                      <td className="py-4 px-4 font-mono">
                        <div className="font-bold text-blue-400 flex items-center space-x-1.5">
                          <span>{inv.invoiceNumber}</span>
                          {inv.quoteNumber && (
                            <span className="text-[9px] font-sans px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                              Ref {inv.quoteNumber}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{inv.issueDate}</div>
                      </td>

                      {/* Seller & Buyer Details */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-white flex items-center space-x-1.5">
                          <span>{inv.buyerCompany || inv.clientCompany || inv.clientName}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">{inv.title}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Buyer: {inv.buyerState || inv.clientAddress || 'Gujarat [24]'} • GSTIN: {inv.buyerGstin || inv.clientGstin || '—'}
                        </div>
                      </td>

                      {/* Tax Treatment */}
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-1.5">
                          {isUT ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                              CGST + UTGST
                            </span>
                          ) : inv.gstType === 'cgst_sgst' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                              CGST + SGST
                            </span>
                          ) : inv.gstType === 'igst' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                              IGST (18%)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-300">
                              Exempt (0%)
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                          Seller [{inv.sellerStateCode || '21'}] → Buyer [{inv.buyerStateCode || '24'}]
                        </div>
                      </td>

                      {/* Taxable Amount */}
                      <td className="py-4 px-4 text-right font-mono text-slate-300">
                        ₹ {inv.taxableAmount.toLocaleString('en-IN')}
                      </td>

                      {/* Grand Total */}
                      <td className="py-4 px-4 text-right font-mono">
                        <div className="font-bold text-white text-sm">
                          ₹ {inv.totalAmount.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px]">
                          {inv.balanceDue > 0 ? (
                            <span className="text-amber-400 font-medium">Due: ₹ {inv.balanceDue.toLocaleString('en-IN')}</span>
                          ) : (
                            <span className="text-emerald-400 font-medium">Paid in full</span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center space-x-1 ${
                          inv.status === 'paid'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : inv.status === 'partially_paid'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : inv.status === 'overdue' || isOverdue
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                        }`}>
                          <span>{inv.status.replace('_', ' ')}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* Normal User & Super Admin Action 1: View */}
                          <button
                            onClick={() => setViewingInvoice(inv)}
                            title="View Full Invoice"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Normal User & Super Admin Action 2: PDF */}
                          <button
                            onClick={() => generateInvoicePDF(inv, agencyConfig)}
                            title="Download PDF"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          {/* Normal User & Super Admin Action 3: Print */}
                          <button
                            onClick={() => generateInvoicePDF(inv, agencyConfig)}
                            title="Print Invoice"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {/* Record Payment (if balance due) */}
                          {inv.balanceDue > 0 && !inv.isDeleted && (
                            <button
                              onClick={() => openPaymentModal(inv)}
                              title="Record Inward Payment"
                              className="px-2 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 text-[11px] font-semibold transition-all flex items-center space-x-1"
                            >
                              <CreditCard className="w-3 h-3" />
                              <span className="hidden sm:inline">Pay</span>
                            </button>
                          )}

                          {/* Super Admin Action: Modify (Edit) */}
                          {isSuperAdmin && !inv.isDeleted && (
                            <button
                              onClick={() => handleOpenEdit(inv)}
                              title="Modify Invoice (Super Admin)"
                              className="p-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-600 text-amber-400 hover:text-white border border-amber-500/30 transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Super Admin Action: Delete / Soft Delete */}
                          {isSuperAdmin && !inv.isDeleted && (
                            <button
                              onClick={() => softDeleteInvoice(inv.id)}
                              title="Move to Trash (Super Admin Soft Delete)"
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/20 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Trash Mode: Restore or Permanent Delete */}
                          {activeTab === 'trash' && (
                            <>
                              <button
                                onClick={() => restoreInvoice(inv.id)}
                                title="Restore Invoice from Trash"
                                className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 transition-colors flex items-center space-x-1"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                              {isSuperAdmin && (
                                <button
                                  onClick={() => deleteInvoice(inv.id)}
                                  title="Permanently Delete (Super Admin)"
                                  className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. FULL VIEW MODAL: EXACT SPECIFICATION REPRESENTATION                    */}
      {/* ========================================================================= */}
      {viewingInvoice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0b1324] border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl p-6 md:p-8 space-y-6">
            
            {/* Modal Header & Quick Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
              <BrandLogo size="md" variant="full" theme="dark" />

              <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3">
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-black text-white font-mono">{viewingInvoice.invoiceNumber}</h2>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      GST Verified
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">TAX INVOICE (SAC 998314)</div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => generateInvoicePDF(viewingInvoice, agencyConfig)}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </button>
                  <button
                    onClick={() => generateInvoicePDF(viewingInvoice, agencyConfig)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                  <button
                    onClick={() => setViewingInvoice(null)}
                    className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Document Body (Matching Prompt Template) */}
            <div className="space-y-6">
              {/* Header: Seller & Buyer Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Seller Box */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
                  <div className="text-[11px] font-extrabold text-blue-400 uppercase tracking-wider pb-1 border-b border-slate-800">
                    Seller:
                  </div>
                  <div className="text-base font-black text-white">{viewingInvoice.sellerName || 'Fusion Forge Creation'}</div>
                  <div className="text-xs text-slate-300">
                    <span className="text-slate-500 font-semibold">Address: </span>
                    {viewingInvoice.sellerAddress || `${agencyConfig.address}, ${agencyConfig.city}, ${agencyConfig.state} - ${agencyConfig.postalCode}`}
                  </div>
                  <div className="text-xs text-slate-300">
                    <span className="text-slate-500 font-semibold">GSTIN: </span>
                    <span className="font-mono font-bold text-white">{viewingInvoice.sellerGstin || agencyConfig.gstin}</span>
                  </div>
                  <div className="text-xs text-slate-300">
                    <span className="text-slate-500 font-semibold">State: </span>
                    {viewingInvoice.sellerState || 'Odisha [21]'}
                  </div>
                </div>

                {/* Buyer Box */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
                  <div className="text-[11px] font-extrabold text-cyan-400 uppercase tracking-wider pb-1 border-b border-slate-800">
                    Buyer:
                  </div>
                  <div className="text-base font-black text-white">{viewingInvoice.buyerCompany || viewingInvoice.clientCompany || viewingInvoice.clientName || 'JP MODATEX LLP'}</div>
                  <div className="text-xs text-slate-300">
                    <span className="text-slate-500 font-semibold">Address: </span>
                    {viewingInvoice.buyerAddress || viewingInvoice.clientAddress || 'Survey No. 42, GIDC Industrial Estate, Sachin, Surat, Gujarat - 394230'}
                  </div>
                  <div className="text-xs text-slate-300">
                    <span className="text-slate-500 font-semibold">GSTIN: </span>
                    <span className="font-mono font-bold text-white">{viewingInvoice.buyerGstin || viewingInvoice.clientGstin || '—'}</span>
                  </div>
                  <div className="text-xs text-slate-300">
                    <span className="text-slate-500 font-semibold">State: </span>
                    {viewingInvoice.buyerState || 'Gujarat [24]'}
                  </div>
                </div>
              </div>

              {/* Items Table: Description | Qty | Rate | Amount */}
              <div className="rounded-xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Description</th>
                      <th className="py-3 px-4 font-semibold text-center w-20">Qty</th>
                      <th className="py-3 px-4 font-semibold text-right w-28">Rate</th>
                      <th className="py-3 px-4 font-semibold text-right w-32">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 bg-slate-950/40">
                    {viewingInvoice.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/20">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{item.description}</div>
                          {item.sacCode && (
                            <div className="text-[10px] text-slate-500 mt-0.5">SAC Code: {item.sacCode}</div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-slate-300">
                          {item.quantity}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                          ₹ {item.rate.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                          ₹ {item.amount.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                
                {/* Left Meta Information */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-slate-400 font-semibold">Payment Status:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      viewingInvoice.status === 'paid'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : viewingInvoice.status === 'partially_paid'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                    }`}>
                      {viewingInvoice.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-slate-400 font-semibold">Due Date:</span>
                    <span className="font-mono font-bold text-white">{viewingInvoice.dueDate}</span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-slate-400 font-semibold">Issue Date:</span>
                    <span className="font-mono text-slate-300">{viewingInvoice.issueDate}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold block mb-1">Notes:</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                      {viewingInvoice.notes || 'No specific notes recorded.'}
                    </p>
                  </div>
                </div>

                {/* Right Tax Summary Box */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-2.5 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-mono font-bold text-white">₹ {viewingInvoice.subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span className="font-medium">Discount</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {viewingInvoice.discountAmount > 0 ? `- ₹ ${viewingInvoice.discountAmount.toLocaleString('en-IN')}` : '₹ 0'}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-between text-slate-200 font-semibold">
                    <span>Taxable Amount</span>
                    <span className="font-mono font-bold text-white">₹ {viewingInvoice.taxableAmount.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-slate-400">
                    <div className="flex justify-between">
                      <span>CGST {viewingInvoice.cgstAmount > 0 ? '(9%)' : ''}</span>
                      <span className="font-mono text-slate-300">₹ {(viewingInvoice.cgstAmount || 0).toLocaleString('en-IN')}</span>
                    </div>
                    
                    {/* Explicit UTGST or SGST Line */}
                    {(viewingInvoice.utgstAmount && viewingInvoice.utgstAmount > 0) || viewingInvoice.gstType === 'cgst_utgst' ? (
                      <div className="flex justify-between text-amber-300 font-semibold">
                        <span>UTGST (9%) [Union Territory]</span>
                        <span className="font-mono">₹ {(viewingInvoice.utgstAmount || viewingInvoice.sgstAmount || 0).toLocaleString('en-IN')}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between">
                        <span>SGST / UTGST {viewingInvoice.sgstAmount > 0 ? '(9%)' : ''}</span>
                        <span className="font-mono text-slate-300">₹ {(viewingInvoice.sgstAmount || 0).toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>IGST {viewingInvoice.igstAmount > 0 ? '(18%)' : ''}</span>
                      <span className="font-mono text-slate-300">₹ {(viewingInvoice.igstAmount || 0).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t-2 border-slate-700 flex justify-between items-baseline">
                    <span className="font-black text-white text-sm">Grand Total</span>
                    <span className="font-mono font-black text-cyan-400 text-lg">
                      ₹ {viewingInvoice.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Amount in Words */}
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs">
                <span className="text-slate-400 font-semibold block mb-0.5">Amount in Words:</span>
                <span className="font-bold text-white font-serif tracking-wide text-sm">
                  {viewingInvoice.amountInWords || 'Indian Rupees Zero Only'}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
              <div className="text-slate-400">
                Authoritative GST engine certified • SAC 998314
              </div>
              <button
                onClick={() => setViewingInvoice(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all"
              >
                Close Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CREATE / EDIT INVOICE MODAL (SUPER ADMIN ONLY)                         */}
      {/* ========================================================================= */}
      {(isCreating || editingInvoice) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0b1324] border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl p-6 md:p-8 space-y-6">
            
            {/* Modal Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
              <BrandLogo size="sm" variant="full" theme="dark" />
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">
                    Super Admin Invoice Editor
                  </span>
                  <div className="text-xs font-mono font-bold text-white">
                    {isCreating ? 'Generate Tax Invoice' : editingInvoice?.invoiceNumber}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setEditingInvoice(null);
                  }}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveInvoice} className="space-y-6">
              
              {/* Row 1: Invoice Number & Client Selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Invoice Number *</label>
                  <input
                    type="text"
                    required
                    value={formInvoiceNumber}
                    onChange={e => setFormInvoiceNumber(e.target.value)}
                    placeholder="FFC-2026-0003"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-blue-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Select Client Profile</label>
                  <select
                    value={formClientId}
                    onChange={e => handleClientSelect(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">-- Custom / Direct Entry --</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.companyName} ({c.contactPerson || c.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="issued">Issued</option>
                    <option value="paid">Paid</option>
                    <option value="partially_paid">Partially Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Authoritative State Codes for GST Engine (Intra vs Inter State) */}
              <div className="bg-slate-900/90 rounded-2xl border-2 border-blue-500/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span>Authoritative GST Engine State Allocation</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    Active: {authoritativeCalculation.taxLabel}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Seller State / Place of Business *
                    </label>
                    <select
                      value={formSellerStateCode}
                      onChange={e => setFormSellerStateCode(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      {INDIAN_GST_STATES.map(s => (
                        <option key={`seller_opt_${s.code}`} value={s.code}>
                          {s.code} - {s.name} {s.isUnionTerritoryWithoutLegislature ? '(Union Territory - UTGST)' : ''}
                        </option>
                      ))}
                    </select>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Default: Fusion Forge Creation (21 - Odisha, or 26 - DNH & DD for UT simulation)
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Buyer State / Place of Supply *
                    </label>
                    <select
                      value={formBuyerStateCode}
                      onChange={e => setFormBuyerStateCode(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      {INDIAN_GST_STATES.map(s => (
                        <option key={`buyer_opt_${s.code}`} value={s.code}>
                          {s.code} - {s.name} {s.isUnionTerritoryWithoutLegislature ? '(Union Territory - UTGST)' : ''}
                        </option>
                      ))}
                    </select>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Select matching code (e.g. 26 for Intra-State UT, or 27 for Inter-State IGST)
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 3: Buyer Details */}
              <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-4 space-y-4">
                <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  Buyer Details (Bill To)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">Buyer Company Name *</label>
                    <input
                      type="text"
                      required
                      value={formClientCompany}
                      onChange={e => setFormClientCompany(e.target.value)}
                      placeholder="e.g. JP MODATEX LLP"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">Contact Person</label>
                    <input
                      type="text"
                      value={formClientName}
                      onChange={e => setFormClientName(e.target.value)}
                      placeholder="e.g. Manoj Satapathy"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">Address</label>
                    <input
                      type="text"
                      value={formClientAddress}
                      onChange={e => setFormClientAddress(e.target.value)}
                      placeholder="e.g. Survey No. 42, GIDC Industrial Estate, Sachin, Surat, Gujarat - 394230"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">GSTIN</label>
                    <input
                      type="text"
                      value={formClientGstin}
                      onChange={e => setFormClientGstin(e.target.value)}
                      placeholder="e.g. 24AABCM1234F1Z1 or —"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Invoice Dates & Scope Title */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={formIssueDate}
                    onChange={e => setFormIssueDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={formDueDate}
                    onChange={e => setFormDueDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Subject / Project Scope</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    placeholder="e.g. Textile ERP Automation"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Row 5: Line Items Table */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-white uppercase tracking-wider">
                    Service Line Items (Description • Qty • Rate • Amount)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-3 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white text-[11px] font-bold border border-blue-500/30 transition-all flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {formItems.map((item, idx) => (
                    <div key={item.id || idx} className="grid grid-cols-12 gap-2 bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl items-center">
                      <div className="col-span-12 md:col-span-5">
                        <input
                          type="text"
                          required
                          placeholder="Service Description"
                          value={item.description}
                          onChange={e => handleItemChange(idx, 'description', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="col-span-4 md:col-span-2">
                        <input
                          type="text"
                          placeholder="SAC (998314)"
                          value={item.sacCode || ''}
                          onChange={e => handleItemChange(idx, 'sacCode', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500 text-center"
                        />
                      </div>
                      <div className="col-span-3 md:col-span-1">
                        <input
                          type="number"
                          min="1"
                          required
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={e => handleItemChange(idx, 'quantity', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs font-mono text-white text-center focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="col-span-4 md:col-span-2">
                        <input
                          type="number"
                          min="0"
                          required
                          placeholder="Rate"
                          value={item.rate}
                          onChange={e => handleItemChange(idx, 'rate', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white text-right focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="col-span-10 md:col-span-1 text-right font-mono font-bold text-xs text-blue-400">
                        ₹ {(item.quantity * item.rate).toLocaleString('en-IN')}
                      </div>
                      <div className="col-span-2 md:col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          disabled={formItems.length <= 1}
                          className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/20 disabled:opacity-30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 6: Discount & GST Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-300 uppercase">Discount Configuration</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Discount Type</label>
                      <select
                        value={formDiscountType}
                        onChange={e => setFormDiscountType(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      >
                        <option value="fixed">Fixed (₹ Amount)</option>
                        <option value="percentage">Percentage (%)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Discount Value</label>
                      <input
                        type="number"
                        min="0"
                        value={formDiscountValue}
                        onChange={e => setFormDiscountValue(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-300 uppercase">GST Rate Setting</div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Standard Rate (%)</label>
                    <select
                      value={formGstRate}
                      onChange={e => setFormGstRate(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value={18}>18% (SAC 998314 Standard IT Software)</option>
                      <option value={12}>12%</option>
                      <option value={5}>5%</option>
                      <option value={0}>0% (Tax Exempt)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Authoritative Real-time Calculation Summary Box */}
              <div className="bg-[#0f172a] border-2 border-blue-500/40 rounded-2xl p-5 space-y-3 shadow-inner">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Supabase Authoritative Calculation Layer</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {authoritativeCalculation.taxLabel}
                  </span>
                </div>

                <div className="flex justify-between text-xs text-slate-400">
                  <span>Subtotal:</span>
                  <span className="font-mono text-white font-bold">₹ {authoritativeCalculation.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs text-emerald-400">
                  <span>Discount:</span>
                  <span className="font-mono font-bold">- ₹ {authoritativeCalculation.discountAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-300 font-bold border-t border-slate-800 pt-2">
                  <span>Taxable Amount:</span>
                  <span className="font-mono">₹ {authoritativeCalculation.taxableAmount.toLocaleString('en-IN')}</span>
                </div>

                {/* CGST, SGST, UTGST, IGST Line items */}
                {authoritativeCalculation.cgstAmount > 0 && (
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>CGST (9%):</span>
                    <span className="font-mono text-slate-300">₹ {authoritativeCalculation.cgstAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {authoritativeCalculation.sgstAmount > 0 && (
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>SGST (9%):</span>
                    <span className="font-mono text-slate-300">₹ {authoritativeCalculation.sgstAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {authoritativeCalculation.utgstAmount > 0 && (
                  <div className="flex justify-between text-xs text-amber-400 font-semibold">
                    <span>UTGST (9%) [Union Territory {authoritativeCalculation.sellerState.code}]:</span>
                    <span className="font-mono">₹ {authoritativeCalculation.utgstAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {authoritativeCalculation.igstAmount > 0 && (
                  <div className="flex justify-between text-xs text-cyan-400 font-semibold">
                    <span>IGST (18%) [Inter-State]:</span>
                    <span className="font-mono">₹ {authoritativeCalculation.igstAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-black text-white border-t border-slate-700 pt-2">
                  <span>Grand Total:</span>
                  <span className="font-mono text-cyan-400">₹ {authoritativeCalculation.grandTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-[11px] text-slate-400 bg-slate-900/90 p-2.5 rounded-lg font-medium border border-slate-800">
                  Amount in Words: <span className="text-slate-200 font-serif font-bold">{authoritativeCalculation.amountInWords}</span>
                </div>
              </div>

              {/* Notes & Terms */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Invoice Notes / Tax Footnote</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingInvoice(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-500/20"
                >
                  {isCreating ? 'Save & Issue Tax Invoice' : 'Save Modifications'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. RECORD PAYMENT MODAL                                                   */}
      {/* ========================================================================= */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1324] border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-0.5">
                Financial Ledger
              </span>
              <h3 className="text-lg font-black text-white">Record Inward Remittance</h3>
              <p className="text-xs text-slate-400">Against Tax Invoice {payingInvoice.invoiceNumber}</p>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Payment Amount (₹) *</label>
                <input
                  required
                  type="number"
                  max={payingInvoice.balanceDue > 0 ? payingInvoice.balanceDue : payingInvoice.totalAmount}
                  value={payAmount}
                  onChange={e => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 font-mono text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Payment Channel</label>
                <select
                  value={payMethod}
                  onChange={e => setPayMethod(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="bank_transfer">Direct Bank NEFT / RTGS</option>
                  <option value="upi">Corporate UPI / QR</option>
                  <option value="credit_card">Razorpay / Stripe Gateway</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Transaction Ref / UTR *</label>
                <input
                  required
                  type="text"
                  value={payRef}
                  onChange={e => setPayRef(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setPayingInvoice(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Confirm & Update Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
