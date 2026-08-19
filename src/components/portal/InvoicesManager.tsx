import React, { useState, useMemo, useEffect } from 'react';
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
  ArrowRight,
  Truck,
  QrCode,
  FolderKanban
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
import { generateNextDocumentNumber, DEFAULT_INVOICE_NUMBERING } from '../../utils/documentNumbering';
import { formatDateDDMMYYYY } from '../../utils/dateUtils';
import { generateQrSvg } from '../../utils/qrHelper';
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
    pricePresets,
    paymentTerms,
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
  
  // Phase 7: Reverse Charge & Shipping Address
  const [formReverseCharge, setFormReverseCharge] = useState<'Yes' | 'No'>('No');
  const [formSameAsBilling, setFormSameAsBilling] = useState<boolean>(true);
  const [formShippingName, setFormShippingName] = useState('');
  const [formShippingCompany, setFormShippingCompany] = useState('');
  const [formShippingAddress, setFormShippingAddress] = useState('');
  const [formShippingCity, setFormShippingCity] = useState('');
  const [formShippingState, setFormShippingState] = useState('');
  const [formShippingStateCode, setFormShippingStateCode] = useState('');
  const [formShippingPincode, setFormShippingPincode] = useState('');
  const [formShippingGstin, setFormShippingGstin] = useState('');

  // Phase 7: E-Invoice & Statutory Reference fields
  const [formArn, setFormArn] = useState('');
  const [formAckNo, setFormAckNo] = useState('');
  const [formAckDate, setFormAckDate] = useState('');
  const [formIrn, setFormIrn] = useState('');

  // Phase 11: Statutory Invoice Type & LUT ARN
  const [formInvoiceType, setFormInvoiceType] = useState<string>('Regular');
  const [formLutArn, setFormLutArn] = useState<string>('AD260426001234F');

  // View modal QR SVG state
  const [viewModalQrSvg, setViewModalQrSvg] = useState<string>('');

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

  // Dynamically generate Payment QR for Viewing Modal
  useEffect(() => {
    if (viewingInvoice) {
      const upiId = viewingInvoice.bankDetails?.upiId || agencyConfig.upi_id || agencyConfig.bankDetails?.upiId || 'fusionforge@hdfcbank';
      const payeeName = agencyConfig.company_name || agencyConfig.name || 'Fusion Forge Creation';
      const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${viewingInvoice.totalAmount.toFixed(2)}&tn=${encodeURIComponent(`Invoice ${viewingInvoice.invoiceNumber}`)}&cu=INR`;
      generateQrSvg(upiUrl, 95).then(svg => setViewModalQrSvg(svg)).catch(() => setViewModalQrSvg(''));
    }
  }, [viewingInvoice, agencyConfig]);

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
      invoiceType: formInvoiceType as any,
      lutArn: formLutArn,
      currency: 'INR'
    });
  }, [formSellerStateCode, formBuyerStateCode, formItems, formDiscountType, formDiscountValue, formGstRate, formInvoiceType, formLutArn]);

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
    const invConfig = agencyConfig.numbering_configs?.invoice || DEFAULT_INVOICE_NUMBERING;
    const existingNums = invoices.map(i => i.invoiceNumber);
    const { number } = generateNextDocumentNumber('invoice', invConfig, existingNums);
    setFormInvoiceNumber(number);

    // Default Reverse charge based on agency config
    setFormReverseCharge((agencyConfig.reverse_charge_default as any) || (agencyConfig.gstin ? 'No' : 'Yes'));
    setFormInvoiceType((agencyConfig.default_invoice_type as string) || 'Regular');
    setFormLutArn(agencyConfig.lut_arn || 'AD260426001234F');

    // Default to JP MODATEX LLP or first available client
    const defClient = clients.find(c => c.companyName.includes('JP MODATEX')) || clients[0];
    if (defClient) {
      setFormClientId(defClient.id);
      setFormClientCompany(defClient.companyName);
      setFormClientName(defClient.contactPerson || defClient.name);
      const addr = defClient.billingAddress 
        ? `${defClient.billingAddress.street}, ${defClient.billingAddress.city}, ${defClient.billingAddress.state} - ${defClient.billingAddress.postalCode}`
        : (defClient.address || '');
      setFormClientAddress(addr);
      setFormClientGstin(defClient.gstin || '—');
      setFormBuyerStateCode(defClient.placeOfSupplyCode || defClient.stateCode || extractStateCode(defClient.state) || '24');

      // Shipping address initialization
      if (defClient.shippingAddress || defClient.shippingCity || defClient.sameAsBilling === false) {
        setFormSameAsBilling(defClient.sameAsBilling ?? false);
        setFormShippingName(defClient.shippingName || defClient.contactPerson || defClient.name || '');
        setFormShippingCompany(defClient.shippingCompany || defClient.companyName || '');
        setFormShippingAddress(defClient.shippingAddress || '');
        setFormShippingCity(defClient.shippingCity || '');
        setFormShippingState(defClient.shippingState || '');
        setFormShippingStateCode(defClient.shippingStateCode || '');
        setFormShippingPincode(defClient.shippingPincode || '');
        setFormShippingGstin(defClient.shippingGstin || defClient.gstin || '');
      } else {
        setFormSameAsBilling(true);
        setFormShippingName('');
        setFormShippingCompany('');
        setFormShippingAddress('');
        setFormShippingCity('');
        setFormShippingState('');
        setFormShippingStateCode('');
        setFormShippingPincode('');
        setFormShippingGstin('');
      }
    } else {
      setFormClientId('');
      setFormClientCompany('JP MODATEX LLP');
      setFormClientName('Manoj Satapathy');
      setFormClientAddress('Survey No. 42, GIDC Industrial Estate, Sachin, Surat, Gujarat - 394230');
      setFormClientGstin('—');
      setFormBuyerStateCode('24');
      setFormSameAsBilling(true);
      setFormShippingName('');
      setFormShippingCompany('');
      setFormShippingAddress('');
      setFormShippingCity('');
      setFormShippingState('');
      setFormShippingStateCode('');
      setFormShippingPincode('');
      setFormShippingGstin('');
    }

    setFormArn('');
    setFormAckNo('');
    setFormAckDate('');
    setFormIrn('');

    setFormSellerStateCode(agencyConfig.state_code || '21'); // Fusion Forge Creation default
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
    
    // Set default payment terms
    const defaultTerm = paymentTerms.find(t => t.is_default);
    if (defaultTerm) {
      setFormPaymentTerms(`${defaultTerm.name}: ${defaultTerm.description}`);
    } else if (agencyConfig.invoice_terms) {
      setFormPaymentTerms(Array.isArray(agencyConfig.invoice_terms) ? agencyConfig.invoice_terms.join('\n') : String(agencyConfig.invoice_terms));
    } else {
      setFormPaymentTerms('Payment due within 15 days.');
    }
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

    // Phase 7 fields
    setFormReverseCharge(inv.reverseCharge === 'Yes' || inv.reverseCharge === true ? 'Yes' : 'No');
    setFormInvoiceType(inv.invoiceType || 'Regular');
    setFormLutArn(inv.lutArn || agencyConfig.lut_arn || 'AD260426001234F');
    setFormSameAsBilling(inv.sameAsBilling !== false);
    setFormShippingName(inv.shippingName || '');
    setFormShippingCompany(inv.shippingCompany || '');
    setFormShippingAddress(inv.shippingAddress || '');
    setFormShippingCity(inv.shippingCity || '');
    setFormShippingState(inv.shippingState || '');
    setFormShippingStateCode(inv.shippingStateCode || '');
    setFormShippingPincode(inv.shippingPincode || '');
    setFormShippingGstin(inv.shippingGstin || '');
    setFormArn(inv.arn || '');
    setFormAckNo(inv.ackNo || inv.acknowledgement_number || '');
    setFormAckDate(inv.ackDate || inv.acknowledgement_date || '');
    setFormIrn(inv.irn || '');
  };

  // Handle client selection in form
  const handleClientSelect = (clientId: string) => {
    setFormClientId(clientId);
    const cl = clients.find(c => c.id === clientId);
    if (cl) {
      setFormClientCompany(cl.companyName);
      setFormClientName(cl.contactPerson || cl.name);
      const addr = cl.billingAddress 
        ? `${cl.billingAddress.street}, ${cl.billingAddress.city}, ${cl.billingAddress.state} - ${cl.billingAddress.postalCode}`
        : (cl.address || '');
      setFormClientAddress(addr);
      setFormClientGstin(cl.gstin || '—');
      setFormBuyerStateCode(cl.placeOfSupplyCode || cl.stateCode || extractStateCode(cl.state) || (cl.gstin && cl.gstin.length >= 2 ? cl.gstin.slice(0, 2) : '24'));

      // Shipping details if available
      if (cl.shippingAddress || cl.shippingCity || cl.sameAsBilling === false) {
        setFormSameAsBilling(cl.sameAsBilling ?? false);
        setFormShippingName(cl.shippingName || cl.contactPerson || cl.name || '');
        setFormShippingCompany(cl.shippingCompany || cl.companyName || '');
        setFormShippingAddress(cl.shippingAddress || '');
        setFormShippingCity(cl.shippingCity || '');
        setFormShippingState(cl.shippingState || '');
        setFormShippingStateCode(cl.shippingStateCode || '');
        setFormShippingPincode(cl.shippingPincode || '');
        setFormShippingGstin(cl.shippingGstin || cl.gstin || '');
      } else {
        setFormSameAsBilling(true);
      }
    }
  };

  // Live GSTIN input handler with automatic Place of Supply derivation
  const handleFormGstinChange = (val: string) => {
    const uppercaseVal = val.toUpperCase();
    setFormClientGstin(uppercaseVal);
    if (uppercaseVal.length >= 2) {
      const code = uppercaseVal.slice(0, 2);
      const match = INDIAN_GST_STATES.find(s => s.code === code);
      if (match) {
        setFormBuyerStateCode(match.code);
      }
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

  const handleAddItem = (presetDesc?: string, presetRate?: number, presetSac?: string) => {
    const rate = presetRate ?? 0;
    setFormItems(prev => [
      ...prev,
      { 
        id: String(Date.now() + Math.random()), 
        description: presetDesc ?? '', 
        sacCode: presetSac ?? '998314', 
        quantity: 1, 
        rate: rate, 
        amount: rate 
      }
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

      // Phase 7: Reverse Charge, Shipping Address & E-Invoice metadata
      reverseCharge: formReverseCharge,
      sameAsBilling: formSameAsBilling,
      shippingName: formSameAsBilling ? formClientName : (formShippingName || formClientName),
      shippingCompany: formSameAsBilling ? formClientCompany : (formShippingCompany || formClientCompany),
      shippingAddress: formSameAsBilling ? formClientAddress : formShippingAddress,
      shippingCity: formShippingCity,
      shippingState: formShippingState,
      shippingStateCode: formShippingStateCode,
      shippingPincode: formShippingPincode,
      shippingGstin: formShippingGstin || formClientGstin,
      arn: formArn,
      ackNo: formAckNo,
      acknowledgement_number: formAckNo,
      ackDate: formAckDate,
      acknowledgement_date: formAckDate,
      irn: formIrn,

      // Phase 11: Statutory Invoice Type & LUT ARN
      invoiceType: formInvoiceType,
      lutArn: formInvoiceType === 'SEZ Supply without Tax' ? formLutArn : undefined,

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
            <h1 className="text-2xl font-black text-[#1E1B2E] flex items-center space-x-2.5">
              <Receipt className="w-7 h-7 text-[#8E2D9D]" />
              <span>Tax Invoices & GST Engine</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FAF5FF] text-[#8E2D9D] border border-[#E8E0F0]">
              SAC 998314
            </span>
          </div>
          <p className="text-xs text-[#5F5A72] mt-1">
            Authoritative Supabase PostgreSQL calculation layer for GST compliance (CGST + SGST, CGST + UTGST, IGST).
          </p>
        </div>

        <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
          {/* GST Rule Inspector / Simulator Toggle */}
          <button
            onClick={() => setShowGstSimulator(!showGstSimulator)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 cursor-pointer ${
              showGstSimulator
                ? 'bg-[#8E2D9D] text-white border-[#8E2D9D] shadow-md shadow-[#8E2D9D]/20'
                : 'bg-white text-[#8E2D9D] border-[#E8E0F0] hover:bg-[#FAF5FF] shadow-xs'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>GST Engine Sandbox</span>
          </button>

          {/* Super Admin Status Badge & Switcher */}
          <div className="flex items-center space-x-2 bg-white border border-[#E8E0F0] rounded-xl p-1 px-2.5 text-xs shadow-xs">
            <ShieldCheck className={`w-4 h-4 ${isSuperAdmin ? 'text-[#8E2D9D]' : 'text-[#817B91]'}`} />
            <span className="text-[#5F5A72] text-[11px]">Role:</span>
            <span className={`font-bold text-[11px] uppercase ${isSuperAdmin ? 'text-[#8E2D9D]' : 'text-[#6F42C1]'}`}>
              {currentUser.role.replace('_', ' ')}
            </span>
            {!isSuperAdmin && (
              <button
                onClick={() => switchRole('super_admin')}
                className="ml-2 text-[10px] text-[#8E2D9D] underline hover:text-[#6F42C1] font-semibold cursor-pointer"
              >
                Switch to Super Admin
              </button>
            )}
          </div>

          {/* Super Admin & Accountant Create Invoice Button */}
          {isAccountantOrSuper && (
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 rounded-xl bg-[#8E2D9D] hover:bg-[#6F42C1] text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-[#8E2D9D]/25 transition-all active:scale-95 cursor-pointer border border-[#8E2D9D]"
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
        <div className="bg-white rounded-2xl border border-[#E8E0F0] p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E8E0F0] pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-[#FAF5FF] text-[#8E2D9D] border border-[#E8E0F0]">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#1E1B2E] flex items-center gap-2">
                  <span>Supabase GST Engine: Authoritative Calculation Sandbox</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                    PostgreSQL PL/pgSQL Function
                  </span>
                </h2>
                <p className="text-[11px] text-[#5F5A72]">
                  Strict Rule: The frontend is strictly forbidden from independently calculating totals. Supabase executes calculation trigger <code className="text-[#8E2D9D]">trg_invoice_authoritative_gst</code>.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowGstSimulator(false)}
              className="p-1 rounded-lg text-[#817B91] hover:text-[#1E1B2E] hover:bg-[#FAF5FF] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="text-[11px] text-[#5F5A72] self-center mr-1">Quick Scenarios:</span>
            <button
              type="button"
              onClick={() => { setSimSellerCode('26'); setSimBuyerCode('26'); }}
              className={`px-3 py-1.5 rounded-lg font-semibold border transition-all cursor-pointer ${
                simSellerCode === '26' && simBuyerCode === '26'
                  ? 'bg-[#8E2D9D] text-white border-[#8E2D9D]'
                  : 'bg-[#FAF8FF] text-[#5F5A72] border-[#E8E0F0] hover:bg-[#FAF5FF] hover:text-[#1E1B2E]'
              }`}
            >
              Case 1: Intra-State UT (Seller: 26 → Buyer: 26) → <strong className="text-[#8E2D9D]">CGST + UTGST</strong>
            </button>
            <button
              type="button"
              onClick={() => { setSimSellerCode('26'); setSimBuyerCode('27'); }}
              className={`px-3 py-1.5 rounded-lg font-semibold border transition-all cursor-pointer ${
                simSellerCode === '26' && simBuyerCode === '27'
                  ? 'bg-[#8E2D9D] text-white border-[#8E2D9D]'
                  : 'bg-[#FAF8FF] text-[#5F5A72] border-[#E8E0F0] hover:bg-[#FAF5FF] hover:text-[#1E1B2E]'
              }`}
            >
              Case 2: Inter-State (Seller: 26 → Buyer: 27) → <strong className="text-[#8E2D9D]">IGST</strong>
            </button>
            <button
              type="button"
              onClick={() => { setSimSellerCode('21'); setSimBuyerCode('24'); }}
              className={`px-3 py-1.5 rounded-lg font-semibold border transition-all cursor-pointer ${
                simSellerCode === '21' && simBuyerCode === '24'
                  ? 'bg-[#8E2D9D] text-white border-[#8E2D9D]'
                  : 'bg-[#FAF8FF] text-[#5F5A72] border-[#E8E0F0] hover:bg-[#FAF5FF] hover:text-[#1E1B2E]'
              }`}
            >
              Case 3: Inter-State (Seller: 21 Odisha → Buyer: 24 Gujarat) → <strong className="text-[#8E2D9D]">IGST</strong>
            </button>
            <button
              type="button"
              onClick={() => { setSimSellerCode('21'); setSimBuyerCode('21'); }}
              className={`px-3 py-1.5 rounded-lg font-semibold border transition-all cursor-pointer ${
                simSellerCode === '21' && simBuyerCode === '21'
                  ? 'bg-[#8E2D9D] text-white border-[#8E2D9D]'
                  : 'bg-[#FAF8FF] text-[#5F5A72] border-[#E8E0F0] hover:bg-[#FAF5FF] hover:text-[#1E1B2E]'
              }`}
            >
              Case 4: Intra-State (Seller: 21 → Buyer: 21) → <strong className="text-[#8E2D9D]">CGST + SGST</strong>
            </button>
          </div>

          {/* Interactive Controls & Live Output Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#FAF8FF] p-4 rounded-xl border border-[#E8E0F0] text-xs">
            <div>
              <label className="text-[11px] font-bold text-[#5F5A72] block mb-1">Seller State / UT</label>
              <select
                value={simSellerCode}
                onChange={e => setSimSellerCode(e.target.value)}
                className="w-full bg-white border border-[#E8E0F0] rounded-lg px-2.5 py-1.5 text-xs text-[#1E1B2E]"
              >
                {INDIAN_GST_STATES.map(s => (
                  <option key={`seller_${s.code}`} value={s.code}>
                    {s.code} - {s.name} {s.isUnionTerritoryWithoutLegislature ? '[UT]' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#5F5A72] block mb-1">Buyer State / UT</label>
              <select
                value={simBuyerCode}
                onChange={e => setSimBuyerCode(e.target.value)}
                className="w-full bg-white border border-[#E8E0F0] rounded-lg px-2.5 py-1.5 text-xs text-[#1E1B2E]"
              >
                {INDIAN_GST_STATES.map(s => (
                  <option key={`buyer_${s.code}`} value={s.code}>
                    {s.code} - {s.name} {s.isUnionTerritoryWithoutLegislature ? '[UT]' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#5F5A72] block mb-1">Taxable Amount (₹)</label>
              <input
                type="number"
                value={simTaxableAmt}
                onChange={e => setSimTaxableAmt(Number(e.target.value))}
                className="w-full bg-white border border-[#E8E0F0] rounded-lg px-2.5 py-1.5 text-xs font-mono text-[#1E1B2E]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#5F5A72] block mb-1">GST Rate (%)</label>
              <select
                value={simGstRate}
                onChange={e => setSimGstRate(Number(e.target.value))}
                className="w-full bg-white border border-[#E8E0F0] rounded-lg px-2.5 py-1.5 text-xs text-[#1E1B2E]"
              >
                <option value={18}>18% (Standard SAC 998314)</option>
                <option value={12}>12%</option>
                <option value={5}>5%</option>
                <option value={0}>0% (Exempt)</option>
              </select>
            </div>
          </div>

          {/* Engine Output Card */}
          <div className="bg-white border border-[#E8E0F0] rounded-xl p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center text-xs">
            <div className="space-y-1">
              <div className="text-[10px] text-[#817B91] font-bold uppercase">Supply Classification</div>
              <div className="font-mono font-bold text-[#1E1B2E] text-sm flex items-center gap-1.5">
                <span className={`px-2 py-0.5 rounded text-[11px] ${
                  simCalculation.supplyType === 'INTRA_STATE' ? 'bg-[#FAF5FF] text-[#8E2D9D] border border-[#E8E0F0]' : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {simCalculation.supplyType.replace('_', ' ')}
                </span>
              </div>
              <div className="text-[10px] text-[#817B91]">
                {simCalculation.isIntraState ? 'Same State/UT Code' : 'Cross-border Inter-State'}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] text-[#817B91] font-bold uppercase">Tax Structure Result</div>
              <div className="text-base font-black text-[#8E2D9D]">
                {simCalculation.taxLabel}
              </div>
              <div className="text-[10px] text-[#817B91] font-mono">
                {simCalculation.gstType === 'cgst_utgst' && 'CGST (9%) + UTGST (9%)'}
                {simCalculation.gstType === 'cgst_sgst' && 'CGST (9%) + SGST (9%)'}
                {simCalculation.gstType === 'igst' && 'IGST (18%) Pan-India'}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] text-[#817B91] font-bold uppercase">Computed Tax Breakdown</div>
              <div className="space-y-0.5 font-mono text-[11px] text-[#1E1B2E]">
                {simCalculation.cgstAmount > 0 && <div>CGST: ₹{simCalculation.cgstAmount.toLocaleString('en-IN')}</div>}
                {simCalculation.sgstAmount > 0 && <div>SGST: ₹{simCalculation.sgstAmount.toLocaleString('en-IN')}</div>}
                {simCalculation.utgstAmount > 0 && <div className="text-[#8E2D9D] font-bold">UTGST: ₹{simCalculation.utgstAmount.toLocaleString('en-IN')}</div>}
                {simCalculation.igstAmount > 0 && <div className="text-[#6F42C1] font-bold">IGST: ₹{simCalculation.igstAmount.toLocaleString('en-IN')}</div>}
              </div>
            </div>

            <div className="space-y-1 md:text-right">
              <div className="text-[10px] text-[#817B91] font-bold uppercase">Grand Total (Authoritative)</div>
              <div className="text-lg font-black text-emerald-700 font-mono">
                ₹{simCalculation.grandTotal.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-[#5F5A72] truncate max-w-xs md:ml-auto">
                {simCalculation.amountInWords}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SEARCH, STATUS FILTER & TABS                                             */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#E8E0F0] shadow-xs">
        
        {/* Active vs Trash Tabs */}
        <div className="flex items-center space-x-1.5 bg-[#FAF5FF] p-1 rounded-xl border border-[#E8E0F0]">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'active'
                ? 'bg-[#8E2D9D] text-white shadow-xs'
                : 'text-[#5F5A72] hover:text-[#1E1B2E]'
            }`}
          >
            Active Invoices ({invoices.filter(i => !i.isDeleted).length})
          </button>
          <button
            onClick={() => setActiveTab('trash')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'trash'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-[#5F5A72] hover:text-[#1E1B2E]'
            }`}
          >
            Trash / Soft-Deleted ({invoices.filter(i => i.isDeleted).length})
          </button>
        </div>

        {/* Search & Status Filter */}
        <div className="flex items-center space-x-2 flex-1 sm:max-w-md">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-[#817B91] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by invoice #, client, GSTIN..."
              className="w-full bg-[#FAF8FF] border border-[#E8E0F0] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D] focus:ring-1 focus:ring-[#8E2D9D]/20 placeholder:text-[#817B91]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-[#FAF8FF] border border-[#E8E0F0] rounded-xl px-2.5 py-1.5 text-xs text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D] cursor-pointer font-medium"
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
      <div className="rounded-2xl border border-[#E8E0F0] bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF5FF] text-[#5F5A72] uppercase text-[10px] tracking-wider border-b border-[#E8E0F0]">
              <tr>
                <th className="py-3.5 px-4 font-bold">Invoice # & Date</th>
                <th className="py-3.5 px-4 font-bold">Seller & Buyer</th>
                <th className="py-3.5 px-4 font-bold">Tax Treatment</th>
                <th className="py-3.5 px-4 font-bold text-right">Taxable</th>
                <th className="py-3.5 px-4 font-bold text-right">Grand Total</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E0F0]">
              {displayedInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#817B91]">
                    <Receipt className="w-8 h-8 text-[#817B91] mx-auto mb-2 opacity-40" />
                    <p className="font-bold text-sm text-[#1E1B2E]">No invoices found</p>
                    <p className="text-xs text-[#5F5A72] mt-1">Try adjusting your filters or search terms.</p>
                  </td>
                </tr>
              ) : (
                displayedInvoices.map(inv => {
                  const isOverdue = inv.status === 'overdue' || (inv.balanceDue > 0 && new Date(inv.dueDate) < new Date());
                  const isUT = (inv.utgstAmount && inv.utgstAmount > 0) || inv.gstType === 'cgst_utgst';

                  return (
                    <tr key={inv.id} className="hover:bg-[#FAF8FF] transition-colors">
                      {/* Invoice # & Date */}
                      <td className="py-4 px-4 font-mono">
                        <div className="font-bold text-[#8E2D9D] flex items-center space-x-1.5 flex-wrap gap-1">
                          <span>{inv.invoiceNumber}</span>
                          {inv.quoteNumber && (
                            <span className="text-[9px] font-sans px-1.5 py-0.5 rounded bg-[#FAF5FF] text-[#5F5A72] border border-[#E8E0F0]">
                              Ref {inv.quoteNumber}
                            </span>
                          )}
                          {inv.projectTitle && (
                            <span className="text-[9px] font-sans px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-0.5">
                              <FolderKanban className="w-2.5 h-2.5 text-emerald-700" />
                              <span>Project</span>
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-[#817B91] mt-0.5">{inv.issueDate}</div>
                      </td>

                      {/* Seller & Buyer Details */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-[#1E1B2E] flex items-center space-x-1.5">
                          <span>{inv.buyerCompany || inv.clientCompany || inv.clientName}</span>
                        </div>
                        <div className="text-[11px] text-[#5F5A72] truncate max-w-xs">{inv.title}</div>
                        <div className="text-[10px] text-[#817B91] mt-0.5">
                          Buyer: {inv.buyerState || inv.clientAddress || 'Gujarat [24]'} • GSTIN: {inv.buyerGstin || inv.clientGstin || '—'}
                        </div>
                      </td>

                      {/* Tax Treatment */}
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-1.5">
                          {isUT ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF5FF] text-[#8E2D9D] border border-[#E8E0F0]">
                              CGST + UTGST
                            </span>
                          ) : inv.gstType === 'cgst_sgst' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF5FF] text-[#6F42C1] border border-[#E8E0F0]">
                              CGST + SGST
                            </span>
                          ) : inv.gstType === 'igst' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F3E8FF] text-[#8E2D9D] border border-[#E8E0F0]">
                              IGST (18%)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              Exempt (0%)
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-[#817B91] mt-0.5 font-mono">
                          Seller [{inv.sellerStateCode || '21'}] → Buyer [{inv.buyerStateCode || '24'}]
                        </div>
                      </td>

                      {/* Taxable Amount */}
                      <td className="py-4 px-4 text-right font-mono text-[#5F5A72] font-semibold">
                        ₹ {inv.taxableAmount.toLocaleString('en-IN')}
                      </td>

                      {/* Grand Total */}
                      <td className="py-4 px-4 text-right font-mono">
                        <div className="font-bold text-[#1E1B2E] text-sm">
                          ₹ {inv.totalAmount.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px]">
                          {inv.balanceDue > 0 ? (
                            <span className="text-[#D97706] font-bold">Due: ₹ {inv.balanceDue.toLocaleString('en-IN')}</span>
                          ) : (
                            <span className="text-[#059669] font-bold">Paid in full</span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center space-x-1 ${
                          inv.status === 'paid'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : inv.status === 'partially_paid'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : inv.status === 'overdue' || isOverdue
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : 'bg-[#FAF5FF] text-[#8E2D9D] border border-[#E8E0F0]'
                        }`}>
                          <span>{inv.status.replace('_', ' ')}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* View */}
                          <button
                            onClick={() => setViewingInvoice(inv)}
                            title="View Full Invoice"
                            className="p-1.5 rounded-lg bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#5F5A72] hover:text-[#1E1B2E] border border-[#E8E0F0] transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* PDF */}
                          <button
                            onClick={() => generateInvoicePDF(inv, agencyConfig)}
                            title="Download PDF"
                            className="p-1.5 rounded-lg bg-[#FAF5FF] hover:bg-[#8E2D9D] text-[#5F5A72] hover:text-white border border-[#E8E0F0] transition-colors cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          {/* Print */}
                          <button
                            onClick={() => generateInvoicePDF(inv, agencyConfig)}
                            title="Print Invoice"
                            className="p-1.5 rounded-lg bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#5F5A72] hover:text-[#1E1B2E] border border-[#E8E0F0] transition-colors cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {/* Record Payment (if balance due) */}
                          {inv.balanceDue > 0 && !inv.isDeleted && (
                            <button
                              onClick={() => openPaymentModal(inv)}
                              title="Record Inward Payment"
                              className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white border border-emerald-200 text-[11px] font-bold transition-all flex items-center space-x-1 cursor-pointer"
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
                              className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-600 text-amber-800 hover:text-white border border-amber-200 transition-colors cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Super Admin Action: Delete / Soft Delete */}
                          {isSuperAdmin && !inv.isDeleted && (
                            <button
                              onClick={() => softDeleteInvoice(inv.id)}
                              title="Move to Trash (Super Admin Soft Delete)"
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 transition-colors cursor-pointer"
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
                                className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white border border-emerald-200 transition-colors flex items-center space-x-1 cursor-pointer"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                              {isSuperAdmin && (
                                <button
                                  onClick={() => deleteInvoice(inv.id)}
                                  title="Permanently Delete (Super Admin)"
                                  className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#E8E0F0] rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl p-6 md:p-8 space-y-6">
            
            {/* Modal Header & Quick Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8E0F0] gap-4">
              <div>
                <BrandLogo size="md" variant="full" theme="light" />
                <div className="mt-2 text-xs text-[#5F5A72] space-y-0.5">
                  <div>{agencyConfig.address}, {agencyConfig.city}, {agencyConfig.state} - {agencyConfig.postalCode}</div>
                  <div className="flex flex-wrap gap-x-3 text-[11px] text-[#817B91]">
                    {agencyConfig.gstin && <span><strong className="text-[#1E1B2E]">GSTIN:</strong> {agencyConfig.gstin}</span>}
                    <span><strong className="text-[#1E1B2E]">PAN:</strong> {agencyConfig.pan || (agencyConfig.gstin && agencyConfig.gstin.length >= 12 ? agencyConfig.gstin.slice(2, 12) : 'AALFF1234F')}</span>
                    <span><strong className="text-[#1E1B2E]">Email:</strong> {agencyConfig.email || 'admin@fusionforgecreation.com'}</span>
                    <span><strong className="text-[#1E1B2E]">Contact:</strong> {agencyConfig.phone || '+91 90040 77126'}</span>
                  </div>
                  {(agencyConfig.msme_number || agencyConfig.msmeNumber) && (
                    <div className="text-[11px] text-[#D97706] font-semibold">
                      MSME / Udyam Reg: {agencyConfig.msme_number || agencyConfig.msmeNumber}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-start sm:items-end justify-between gap-3">
                <div className="text-left sm:text-right">
                  <div className="text-xs font-black text-[#8E2D9D] tracking-wider uppercase mb-1">TAX INVOICE</div>
                  <div className="text-base font-black text-[#1E1B2E] font-mono">{viewingInvoice.invoiceNumber}</div>
                  <div className="text-xs text-[#5F5A72] font-mono mt-0.5">
                    <span className="text-[#817B91]">Invoice Date:</span> <strong className="text-[#1E1B2E]">{formatDateDDMMYYYY(viewingInvoice.issueDate || viewingInvoice.createdAt)}</strong>
                  </div>
                  <div className="text-xs text-[#5F5A72] font-mono">
                    <span className="text-[#817B91]">Due Date:</span> <strong className="text-[#1E1B2E]">{formatDateDDMMYYYY(viewingInvoice.dueDate)}</strong>
                  </div>
                  <div className="text-[11px] text-[#817B91] mt-0.5">
                    <span>Reverse Charge: </span>
                    <strong className={viewingInvoice.reverseCharge === 'Yes' || viewingInvoice.reverseCharge === true ? 'text-[#D97706]' : 'text-[#059669]'}>
                      {viewingInvoice.reverseCharge === 'Yes' || viewingInvoice.reverseCharge === true ? 'Yes' : 'No'}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => generateInvoicePDF(viewingInvoice, agencyConfig)}
                    className="px-3.5 py-2 rounded-xl bg-[#8E2D9D] hover:bg-[#6F42C1] text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </button>
                  <button
                    onClick={() => generateInvoicePDF(viewingInvoice, agencyConfig)}
                    className="px-3.5 py-2 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#5F5A72] hover:text-[#1E1B2E] border border-[#E8E0F0] text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                  <button
                    onClick={() => setViewingInvoice(null)}
                    className="p-2 rounded-xl bg-[#FAF5FF] text-[#817B91] hover:text-[#1E1B2E] border border-[#E8E0F0] transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* E-Invoice / Statutory Reference Bar */}
            {(viewingInvoice.irn || viewingInvoice.ackNo || viewingInvoice.acknowledgement_number || viewingInvoice.arn) && (
              <div className="bg-[#FAF8FF] border border-[#E8E0F0] rounded-xl p-3 text-[11px] font-mono grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-[#5F5A72]">
                {viewingInvoice.irn && (
                  <div className="col-span-full break-all">
                    <span className="text-[#817B91] font-bold">IRN: </span>
                    <span className="text-[#8E2D9D]">{viewingInvoice.irn}</span>
                  </div>
                )}
                {(viewingInvoice.ackNo || viewingInvoice.acknowledgement_number) && (
                  <div>
                    <span className="text-[#817B91] font-bold">Ack No: </span>
                    <span className="text-[#1E1B2E]">{viewingInvoice.ackNo || viewingInvoice.acknowledgement_number}</span>
                  </div>
                )}
                {(viewingInvoice.ackDate || viewingInvoice.acknowledgement_date) && (
                  <div>
                    <span className="text-[#817B91] font-bold">Ack Date: </span>
                    <span className="text-[#1E1B2E]">{formatDateDDMMYYYY(viewingInvoice.ackDate || viewingInvoice.acknowledgement_date)}</span>
                  </div>
                )}
                {viewingInvoice.arn && (
                  <div>
                    <span className="text-[#817B91] font-bold">ARN: </span>
                    <span className="text-[#1E1B2E]">{viewingInvoice.arn}</span>
                  </div>
                )}
              </div>
            )}

            {/* Linked Project Banner */}
            {viewingInvoice.projectTitle && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderKanban className="w-4 h-4 text-emerald-700" />
                  <span className="text-[#5F5A72]">
                    Linked Engagement: <strong className="text-[#1E1B2E]">{viewingInvoice.projectTitle}</strong>
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                  Deliverables Verified & Invoiced
                </span>
              </div>
            )}

            {/* SEZ / LUT Statutory Endorsement Banner */}
            {viewingInvoice.invoiceType === 'SEZ Supply without Tax' && (
              <div className="bg-[#FAF5FF] border border-[#C084FC] rounded-xl p-3.5 text-xs text-[#5F5A72] space-y-1">
                <div className="flex items-center gap-2 text-[#8E2D9D] font-bold uppercase tracking-wider text-[11px]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Statutory Endorsement (Rule 46(j) CGST Rules, 2017)</span>
                </div>
                <p className="font-semibold leading-relaxed text-[#1E1B2E]">
                  "SUPPLY MEANT FOR EXPORT / SUPPLY TO SEZ UNIT OR SEZ DEVELOPER FOR AUTHORISED OPERATIONS UNDER BOND OR LETTER OF UNDERTAKING WITHOUT PAYMENT OF INTEGRATED TAX"
                </p>
                <div className="text-[11px] text-[#817B91]">
                  Letter of Undertaking (LUT ARN): <strong className="text-[#1E1B2E] font-mono">{viewingInvoice.lutArn || agencyConfig.lut_arn || 'AD260426001234F'}</strong> • IGST Charged: <strong className="text-[#059669]">0.00% (Zero-Rated)</strong>
                </div>
              </div>
            )}

            {viewingInvoice.invoiceType === 'SEZ Supply with Tax' && (
              <div className="bg-[#FAF5FF] border border-[#E8E0F0] rounded-xl p-3 text-xs text-[#5F5A72]">
                <div className="flex items-center gap-2 text-[#8E2D9D] font-bold uppercase tracking-wider text-[11px]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Statutory Endorsement (Rule 46(j) CGST Rules, 2017)</span>
                </div>
                <p className="font-semibold mt-1 text-[#1E1B2E]">
                  "SUPPLY MEANT FOR EXPORT / SUPPLY TO SEZ UNIT OR SEZ DEVELOPER FOR AUTHORISED OPERATIONS ON PAYMENT OF INTEGRATED TAX"
                </p>
              </div>
            )}

            {/* Document Body: Billed To & Shipped To */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* BILLED TO Box */}
                <div className="bg-[#FAF8FF] border border-[#E8E0F0] rounded-2xl p-5 space-y-2">
                  <div className="text-[11px] font-extrabold text-[#8E2D9D] uppercase tracking-wider pb-1 border-b border-[#E8E0F0]">
                    BILLED TO:
                  </div>
                  <div className="text-base font-black text-[#1E1B2E]">{viewingInvoice.buyerCompany || viewingInvoice.clientCompany || viewingInvoice.clientName || 'JP MODATEX LLP'}</div>
                  {(viewingInvoice.buyerName || viewingInvoice.clientName) && (
                    <div className="text-xs text-[#5F5A72]">
                      <span className="text-[#817B91] font-semibold">Attn: </span>
                      {viewingInvoice.buyerName || viewingInvoice.clientName}
                    </div>
                  )}
                  <div className="text-xs text-[#5F5A72]">
                    <span className="text-[#817B91] font-semibold">Address: </span>
                    {viewingInvoice.buyerAddress || viewingInvoice.clientAddress || 'Survey No. 42, GIDC Industrial Estate, Sachin, Surat, Gujarat - 394230'}
                  </div>
                  <div className="text-xs text-[#5F5A72]">
                    <span className="text-[#817B91] font-semibold">GSTIN: </span>
                    <span className="font-mono font-bold text-[#1E1B2E]">
                      {(viewingInvoice.buyerGstin && viewingInvoice.buyerGstin !== '—') 
                        ? viewingInvoice.buyerGstin 
                        : (viewingInvoice.clientGstin && viewingInvoice.clientGstin !== '—' ? viewingInvoice.clientGstin : 'URP')}
                    </span>
                  </div>
                  <div className="text-xs text-[#5F5A72] flex justify-between">
                    <span>
                      <span className="text-[#817B91] font-semibold">State: </span>
                      {viewingInvoice.buyerState || 'Gujarat [24]'}
                    </span>
                    <span>
                      <span className="text-[#817B91] font-semibold">POS: </span>
                      {viewingInvoice.placeOfSupply || viewingInvoice.buyerStateCode || '24-Gujarat'}
                    </span>
                  </div>
                </div>

                {/* SHIPPED TO Box */}
                <div className="bg-[#FAF8FF] border border-[#E8E0F0] rounded-2xl p-5 space-y-2">
                  <div className="text-[11px] font-extrabold text-[#6F42C1] uppercase tracking-wider pb-1 border-b border-[#E8E0F0] flex items-center justify-between">
                    <span>SHIPPED TO:</span>
                    {viewingInvoice.sameAsBilling !== false && (
                      <span className="text-[9px] font-mono text-[#5F5A72] bg-[#FAF5FF] border border-[#E8E0F0] px-2 py-0.5 rounded">
                        Same as Billed To
                      </span>
                    )}
                  </div>
                  <div className="text-base font-black text-[#1E1B2E]">
                    {viewingInvoice.sameAsBilling === false && viewingInvoice.shippingCompany 
                      ? viewingInvoice.shippingCompany 
                      : (viewingInvoice.buyerCompany || viewingInvoice.clientCompany || viewingInvoice.clientName || 'JP MODATEX LLP')}
                  </div>
                  {viewingInvoice.sameAsBilling === false && viewingInvoice.shippingName && (
                    <div className="text-xs text-[#5F5A72]">
                      <span className="text-[#817B91] font-semibold">Contact: </span>
                      {viewingInvoice.shippingName}
                    </div>
                  )}
                  <div className="text-xs text-[#5F5A72]">
                    <span className="text-[#817B91] font-semibold">Address: </span>
                    {viewingInvoice.sameAsBilling === false && viewingInvoice.shippingAddress
                      ? `${viewingInvoice.shippingAddress}${viewingInvoice.shippingCity ? `, ${viewingInvoice.shippingCity}` : ''}${viewingInvoice.shippingState ? `, ${viewingInvoice.shippingState}` : ''}${viewingInvoice.shippingPincode ? ` - ${viewingInvoice.shippingPincode}` : ''}`
                      : (viewingInvoice.buyerAddress || viewingInvoice.clientAddress || 'Survey No. 42, GIDC Industrial Estate, Sachin, Surat, Gujarat - 394230')}
                  </div>
                  <div className="text-xs text-[#5F5A72]">
                    <span className="text-[#817B91] font-semibold">GSTIN: </span>
                    <span className="font-mono font-bold text-[#1E1B2E]">
                      {viewingInvoice.sameAsBilling === false && viewingInvoice.shippingGstin
                        ? viewingInvoice.shippingGstin
                        : ((viewingInvoice.buyerGstin && viewingInvoice.buyerGstin !== '—') 
                            ? viewingInvoice.buyerGstin 
                            : (viewingInvoice.clientGstin && viewingInvoice.clientGstin !== '—' ? viewingInvoice.clientGstin : 'URP'))}
                    </span>
                  </div>
                  <div className="text-xs text-[#5F5A72]">
                    <span className="text-[#817B91] font-semibold">Place of Delivery: </span>
                    {viewingInvoice.sameAsBilling === false && viewingInvoice.shippingState
                      ? `${viewingInvoice.shippingState} [${viewingInvoice.shippingStateCode || ''}]`
                      : (viewingInvoice.buyerState || 'Gujarat [24]')}
                  </div>
                </div>
              </div>

              {/* Items Table: Description | Qty | Rate | Amount */}
              <div className="rounded-xl border border-[#E8E0F0] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF5FF] text-[#5F5A72] uppercase text-[10px] tracking-wider border-b border-[#E8E0F0]">
                    <tr>
                      <th className="py-3 px-4 font-bold">Description</th>
                      <th className="py-3 px-4 font-bold text-center w-20">Qty</th>
                      <th className="py-3 px-4 font-bold text-right w-28">Rate</th>
                      <th className="py-3 px-4 font-bold text-right w-32">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E0F0] bg-white">
                    {viewingInvoice.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#FAF8FF]">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#1E1B2E]">{item.description}</div>
                          {item.sacCode && (
                            <div className="text-[10px] text-[#817B91] mt-0.5">SAC Code: {item.sacCode}</div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-[#5F5A72]">
                          {item.quantity}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-[#5F5A72]">
                          ₹ {item.rate.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-[#1E1B2E]">
                          ₹ {item.amount.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Calculation & Payment QR Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                
                {/* Left Payment & Bank Details Box */}
                <div className="bg-[#FAF8FF] border border-[#E8E0F0] rounded-xl p-4 space-y-3 text-xs">
                  <div className="text-[11px] font-bold text-[#1E1B2E] uppercase tracking-wider pb-1 border-b border-[#E8E0F0] flex items-center justify-between">
                    <span>Payment Channel & Bank Details</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      viewingInvoice.status === 'paid'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : viewingInvoice.status === 'partially_paid'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-[#FAF5FF] text-[#8E2D9D] border border-[#E8E0F0]'
                    }`}>
                      {viewingInvoice.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 pt-1">
                    {viewModalQrSvg ? (
                      <div className="flex flex-col items-center">
                        <div 
                          className="w-[95px] h-[95px] bg-white rounded-lg p-1 flex items-center justify-center shadow-xs border border-[#E8E0F0]"
                          dangerouslySetInnerHTML={{ __html: viewModalQrSvg }}
                        />
                        <span className="text-[9px] font-bold text-[#8E2D9D] mt-1 text-center whitespace-nowrap">
                          Please Scan for Payment
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-[95px] h-[95px] bg-white border border-[#E8E0F0] rounded-lg flex items-center justify-center text-[#817B91]">
                          <QrCode className="w-8 h-8" />
                        </div>
                        <span className="text-[9px] font-bold text-[#817B91] mt-1">Please Scan for Payment</span>
                      </div>
                    )}

                    <div className="space-y-1 text-[11px] text-[#5F5A72] flex-1">
                      <div><strong className="text-[#1E1B2E]">Bank:</strong> {agencyConfig.bankDetails?.bankName || 'HDFC Bank'}</div>
                      <div><strong className="text-[#1E1B2E]">Account:</strong> {agencyConfig.bankDetails?.accountName || 'Fusion Forge Creation'}</div>
                      <div><strong className="text-[#1E1B2E]">A/C No:</strong> <span className="font-mono font-bold text-[#1E1B2E]">{agencyConfig.bankDetails?.accountNumber || '50200012345678'}</span></div>
                      <div><strong className="text-[#1E1B2E]">IFSC:</strong> <span className="font-mono text-[#8E2D9D]">{agencyConfig.bankDetails?.ifscCode || 'HDFC0001234'}</span></div>
                      <div><strong className="text-[#1E1B2E]">UPI:</strong> <span className="font-mono text-emerald-700 font-bold">{agencyConfig.upi_id || agencyConfig.bankDetails?.upiId || 'fusionforge@hdfcbank'}</span></div>
                    </div>
                  </div>

                  {viewingInvoice.notes && (
                    <div className="pt-2 border-t border-[#E8E0F0]">
                      <span className="text-[#817B91] font-semibold block mb-0.5 text-[10px]">Notes:</span>
                      <p className="text-[#5F5A72] text-[11px] leading-relaxed bg-white p-2 rounded-lg border border-[#E8E0F0]">
                        {viewingInvoice.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Tax Summary Box */}
                <div className="bg-[#FAF8FF] border border-[#E8E0F0] rounded-xl p-5 space-y-2.5 text-xs">
                  <div className="flex justify-between text-[#5F5A72]">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-mono font-bold text-[#1E1B2E]">₹ {viewingInvoice.subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between text-[#5F5A72]">
                    <span className="font-medium">Discount</span>
                    <span className="font-mono text-emerald-700 font-bold">
                      {viewingInvoice.discountAmount > 0 ? `- ₹ ${viewingInvoice.discountAmount.toLocaleString('en-IN')}` : '₹ 0'}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#E8E0F0] flex justify-between text-[#1E1B2E] font-bold">
                    <span>Total Taxable Value</span>
                    <span className="font-mono">₹ {viewingInvoice.taxableAmount.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="pt-2 border-t border-[#E8E0F0] space-y-1.5 text-[#5F5A72]">
                    <div className="flex justify-between">
                      <span>CGST {viewingInvoice.cgstAmount > 0 ? '(9%)' : ''}</span>
                      <span className="font-mono text-[#1E1B2E]">₹ {(viewingInvoice.cgstAmount || 0).toLocaleString('en-IN')}</span>
                    </div>
                    
                    {/* Explicit UTGST or SGST Line */}
                    {(viewingInvoice.utgstAmount && viewingInvoice.utgstAmount > 0) || viewingInvoice.gstType === 'cgst_utgst' ? (
                      <div className="flex justify-between text-[#8E2D9D] font-bold">
                        <span>UTGST (9%) [Union Territory]</span>
                        <span className="font-mono">₹ {(viewingInvoice.utgstAmount || viewingInvoice.sgstAmount || 0).toLocaleString('en-IN')}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between">
                        <span>SGST / UTGST {viewingInvoice.sgstAmount > 0 ? '(9%)' : ''}</span>
                        <span className="font-mono text-[#1E1B2E]">₹ {(viewingInvoice.sgstAmount || 0).toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>IGST {viewingInvoice.igstAmount > 0 ? '(18%)' : ''}</span>
                      <span className="font-mono text-[#1E1B2E]">₹ {(viewingInvoice.igstAmount || 0).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t-2 border-[#E8E0F0] flex justify-between items-baseline">
                    <span className="font-black text-[#1E1B2E] text-sm">Grand Total</span>
                    <span className="font-mono font-black text-[#8E2D9D] text-lg">
                      ₹ {viewingInvoice.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Amount in Words */}
              <div className="p-4 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-xs">
                <span className="text-[#817B91] font-semibold block mb-0.5">Amount in Words:</span>
                <span className="font-bold text-[#1E1B2E] font-serif tracking-wide text-sm">
                  {viewingInvoice.amountInWords || 'Indian Rupees Zero Only'}
                </span>
              </div>

              {/* Terms & Conditions (with delay interest clause) */}
              <div className="p-4 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-xs space-y-1.5">
                <div className="text-[#817B91] font-bold uppercase tracking-wider text-[10px]">Terms & Conditions:</div>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-[#5F5A72] leading-relaxed">
                  <li>Payment is due within configured terms from the invoice date.</li>
                  <li>All payments should be remitted to the official bank account or UPI specified above.</li>
                  <li className="text-[#D97706] font-medium">
                    {agencyConfig.delay_interest_clause || 'Interest @ 18% per annum will be charged on all delayed payments beyond the due date.'}
                  </li>
                </ul>
              </div>

              {/* Footer: Stamp & Signatures */}
              <div className="pt-4 border-t border-[#E8E0F0] flex flex-col sm:flex-row justify-between items-end gap-6 text-xs">
                {/* Stamp left of Signatory area */}
                <div>
                  {(agencyConfig.stamp_url || agencyConfig.stampUrl) ? (
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 rounded-2xl bg-white border border-[#E8E0F0] p-1 flex items-center justify-center overflow-hidden shadow-xs">
                        <img 
                          src={agencyConfig.stamp_url || agencyConfig.stampUrl} 
                          alt="Company Stamp" 
                          className="max-h-full max-w-full object-contain mix-blend-multiply" 
                        />
                      </div>
                      <span className="text-[9px] font-bold text-[#817B91] mt-1 uppercase tracking-wider">Official Company Stamp</span>
                    </div>
                  ) : (
                    <div className="w-24 h-24 border-2 border-dashed border-[#E8E0F0] rounded-2xl flex flex-col items-center justify-center text-[#817B91] text-[10px] text-center p-1 bg-[#FAF8FF]">
                      <div className="font-bold text-[#5F5A72]">OFFICIAL STAMP</div>
                      <div className="text-[8px] text-[#817B91] mt-1">{agencyConfig.company_name || agencyConfig.name || 'Fusion Forge Creation'}</div>
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
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-[#E8E0F0] flex justify-between items-center text-xs">
              <div className="text-[#817B91]">
                Authoritative GST engine certified • SAC 998314
              </div>
              <button
                onClick={() => setViewingInvoice(null)}
                className="px-5 py-2 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#1E1B2E] font-bold border border-[#E8E0F0] transition-all cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-[#E8E0F0] rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl p-6 md:p-8 space-y-6">
            
            {/* Modal Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8E0F0] gap-4">
              <BrandLogo size="sm" variant="full" theme="light" />
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-[#8E2D9D] uppercase tracking-widest block">
                    Super Admin Invoice Editor
                  </span>
                  <div className="text-xs font-mono font-bold text-[#1E1B2E]">
                    {isCreating ? 'Generate Tax Invoice' : editingInvoice?.invoiceNumber}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setEditingInvoice(null);
                  }}
                  className="p-2 rounded-xl bg-[#FAF5FF] text-[#817B91] hover:text-[#1E1B2E] border border-[#E8E0F0] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveInvoice} className="space-y-6">
              
              {/* Row 1: Invoice Number & Client Selection & Reverse Charge */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#1E1B2E] block mb-1">Invoice Number *</label>
                  <input
                    type="text"
                    required
                    value={formInvoiceNumber}
                    onChange={e => setFormInvoiceNumber(e.target.value)}
                    placeholder="FFC-2026-0003"
                    className="w-full bg-[#FAF8FF] border border-[#E8E0F0] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#8E2D9D] focus:outline-none focus:border-[#8E2D9D] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#1E1B2E] block mb-1">Select Client Profile</label>
                  <select
                    value={formClientId}
                    onChange={e => handleClientSelect(e.target.value)}
                    className="w-full bg-[#FAF8FF] border border-[#E8E0F0] rounded-xl px-3 py-2 text-xs text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D] focus:bg-white"
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
                  <label className="text-[11px] font-bold text-[#1E1B2E] block mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value as any)}
                    className="w-full bg-[#FAF8FF] border border-[#E8E0F0] rounded-xl px-3 py-2 text-xs text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D] focus:bg-white"
                  >
                    <option value="issued">Issued</option>
                    <option value="paid">Paid</option>
                    <option value="partially_paid">Partially Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#1E1B2E] block mb-1">Reverse Charge (RCM)</label>
                  <select
                    value={formReverseCharge}
                    onChange={e => setFormReverseCharge(e.target.value as 'Yes' | 'No')}
                    className="w-full bg-[#FAF8FF] border border-[#E8E0F0] rounded-xl px-3 py-2 text-xs font-bold text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D] focus:bg-white"
                  >
                    <option value="No">No (Normal Tax Invoice)</option>
                    <option value="Yes">Yes (Recipient Pays Tax under RCM)</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Statutory Supply Type & SEZ / LUT ARN Classification */}
              <div className="bg-[#FAF8FF] rounded-2xl border border-[#E8E0F0] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-[#8E2D9D] uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#8E2D9D]" />
                    <span>Statutory Invoice Classification (GSTR-1 & SEZ Compliance)</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#8E2D9D] bg-[#FAF5FF] px-2.5 py-0.5 rounded border border-[#E8E0F0]">
                    Type: {formInvoiceType}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="md:col-span-2">
                    <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">
                      Statutory Invoice Type / Export Category *
                    </label>
                    <select
                      value={formInvoiceType}
                      onChange={e => setFormInvoiceType(e.target.value)}
                      className="w-full bg-white border border-[#E8E0F0] rounded-xl px-3 py-2 text-xs font-medium text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D]"
                    >
                      <option value="Regular">Regular (Standard Domestic B2B / B2C Supply)</option>
                      <option value="SEZ Supply with Tax">SEZ Supply with Payment of Tax (Deemed Inter-State IGST)</option>
                      <option value="SEZ Supply without Tax">SEZ Supply without Payment of Tax (Zero-Rated Under LUT / Bond)</option>
                      <option value="Deemed Exports">Deemed Exports (Section 147)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">
                      Letter of Undertaking (LUT ARN)
                    </label>
                    <input
                      type="text"
                      disabled={formInvoiceType !== 'SEZ Supply without Tax'}
                      value={formLutArn}
                      onChange={e => setFormLutArn(e.target.value.toUpperCase())}
                      placeholder="AD260426001234F"
                      className="w-full bg-white border border-[#E8E0F0] rounded-xl px-3 py-2 text-xs font-mono text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D] disabled:opacity-40 disabled:bg-[#FAF8FF] disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {formInvoiceType === 'SEZ Supply without Tax' && (
                  <div className="p-3 rounded-xl bg-[#FAF5FF] border border-[#C084FC] text-[11px] text-[#5F5A72] flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-[#8E2D9D] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#1E1B2E]">SEZ Zero-Rated Supply Active:</strong> Taxable amount will be billed with 0% IGST under Letter of Undertaking (LUT ARN: <span className="font-mono font-bold text-[#8E2D9D]">{formLutArn || 'PENDING'}</span>). Statutory legal endorsement will be rendered on the invoice.
                    </div>
                  </div>
                )}
              </div>

              {/* Row 2.5: Authoritative State Codes for GST Engine (Intra vs Inter State) */}
              <div className="bg-[#FAF8FF] rounded-2xl border border-[#C084FC] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-[#1E1B2E] flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#8E2D9D]" />
                    <span>Authoritative GST Engine State Allocation</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#8E2D9D] bg-[#FAF5FF] px-2 py-0.5 rounded border border-[#E8E0F0]">
                    Active: {authoritativeCalculation.taxLabel}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">
                      Seller State / Place of Business *
                    </label>
                    <select
                      value={formSellerStateCode}
                      onChange={e => setFormSellerStateCode(e.target.value)}
                      className="w-full bg-white border border-[#E8E0F0] rounded-xl px-3 py-2 text-xs text-[#1E1B2E]"
                    >
                      {INDIAN_GST_STATES.map(s => (
                        <option key={`seller_opt_${s.code}`} value={s.code}>
                          {s.code} - {s.name} {s.isUnionTerritoryWithoutLegislature ? '(Union Territory - UTGST)' : ''}
                        </option>
                      ))}
                    </select>
                    <span className="text-[10px] text-[#817B91] mt-1 block">
                      Default: Fusion Forge Creation (21 - Odisha, or 26 - DNH & DD for UT simulation)
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">
                      Buyer State / Place of Supply *
                    </label>
                    <select
                      value={formBuyerStateCode}
                      onChange={e => setFormBuyerStateCode(e.target.value)}
                      className="w-full bg-white border border-[#E8E0F0] rounded-xl px-3 py-2 text-xs text-[#1E1B2E]"
                    >
                      {INDIAN_GST_STATES.map(s => (
                        <option key={`buyer_opt_${s.code}`} value={s.code}>
                          {s.code} - {s.name} {s.isUnionTerritoryWithoutLegislature ? '(Union Territory - UTGST)' : ''}
                        </option>
                      ))}
                    </select>
                    <span className="text-[10px] text-[#817B91] mt-1 block">
                      Select matching code (e.g. 26 for Intra-State UT, or 27 for Inter-State IGST)
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 3: Buyer Details (BILLED TO) */}
              <div className="bg-[#FAF8FF] rounded-2xl border border-[#E8E0F0] p-4 space-y-4">
                <div className="text-xs font-bold text-[#8E2D9D] uppercase tracking-wider">
                  Buyer Details (BILLED TO)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">Buyer Company Name *</label>
                    <input
                      type="text"
                      required
                      value={formClientCompany}
                      onChange={e => setFormClientCompany(e.target.value)}
                      placeholder="e.g. JP MODATEX LLP"
                      className="w-full bg-white border border-[#E8E0F0] rounded-xl px-3 py-2 text-xs text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">Contact Person</label>
                    <input
                      type="text"
                      value={formClientName}
                      onChange={e => setFormClientName(e.target.value)}
                      placeholder="e.g. Manoj Satapathy"
                      className="w-full bg-white border border-[#E8E0F0] rounded-xl px-3 py-2 text-xs text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">Billing Address</label>
                    <input
                      type="text"
                      value={formClientAddress}
                      onChange={e => setFormClientAddress(e.target.value)}
                      placeholder="e.g. Survey No. 42, GIDC Industrial Estate, Sachin, Surat, Gujarat - 394230"
                      className="w-full bg-white border border-[#E8E0F0] rounded-xl px-3 py-2 text-xs text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">
                      GSTIN <span className="text-[10px] text-[#8E2D9D] font-normal">(Auto-derives State & POS)</span>
                    </label>
                    <input
                      type="text"
                      value={formClientGstin}
                      onChange={e => handleFormGstinChange(e.target.value)}
                      placeholder="e.g. 24AABCM1234F1Z1 or —"
                      className="w-full bg-white border border-[#E8E0F0] rounded-xl px-3 py-2 text-xs font-mono text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D]"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3.5: Shipping Details (SHIPPED TO) */}
              <div className="bg-[#FAF8FF] rounded-2xl border border-[#E8E0F0] p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-[#6F42C1] uppercase tracking-wider flex items-center space-x-2">
                    <Truck className="w-4 h-4" />
                    <span>Shipping Details (SHIPPED TO)</span>
                  </div>
                  <label className="flex items-center space-x-2 text-xs text-[#5F5A72] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formSameAsBilling}
                      onChange={e => setFormSameAsBilling(e.target.checked)}
                      className="rounded border-[#E8E0F0] text-[#8E2D9D] focus:ring-0"
                    />
                    <span className="font-semibold text-[#1E1B2E]">Shipped to same as Billed to</span>
                  </label>
                </div>

                {!formSameAsBilling && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2 border-t border-[#E8E0F0]">
                    <div>
                      <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">Shipping Company / Entity</label>
                      <input
                        type="text"
                        value={formShippingCompany}
                        onChange={e => setFormShippingCompany(e.target.value)}
                        placeholder="e.g. JP MODATEX Unit 2"
                        className="w-full bg-white border border-[#E8E0F0] rounded-xl px-3 py-2 text-xs text-[#1E1B2E]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">Contact / Attn</label>
                      <input
                        type="text"
                        value={formShippingName}
                        onChange={e => setFormShippingName(e.target.value)}
                        placeholder="e.g. Manoj Satapathy (Plant Head)"
                        className="w-full bg-white border border-[#E8E0F0] rounded-xl px-3 py-2 text-xs text-[#1E1B2E]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">Shipping GSTIN</label>
                      <input
                        type="text"
                        value={formShippingGstin}
                        onChange={e => setFormShippingGstin(e.target.value.toUpperCase())}
                        placeholder="e.g. 24AABCM1234F1Z1"
                        className="w-full bg-white border border-[#E8E0F0] rounded-xl px-3 py-2 text-xs font-mono text-[#1E1B2E]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">Delivery Address / Street</label>
                      <input
                        type="text"
                        value={formShippingAddress}
                        onChange={e => setFormShippingAddress(e.target.value)}
                        placeholder="e.g. Plot 108, Sachin GIDC Phase 2"
                        className="w-full bg-white border border-[#E8E0F0] rounded-xl px-3 py-2 text-xs text-[#1E1B2E]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">City</label>
                      <input
                        type="text"
                        value={formShippingCity}
                        onChange={e => setFormShippingCity(e.target.value)}
                        placeholder="Surat"
                        className="w-full bg-white border border-[#E8E0F0] rounded-xl px-3 py-2 text-xs text-[#1E1B2E]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">State</label>
                      <input
                        type="text"
                        value={formShippingState}
                        onChange={e => setFormShippingState(e.target.value)}
                        placeholder="Gujarat"
                        className="w-full bg-white border border-[#E8E0F0] rounded-xl px-3 py-2 text-xs text-[#1E1B2E]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">State Code</label>
                      <input
                        type="text"
                        value={formShippingStateCode}
                        onChange={e => setFormShippingStateCode(e.target.value)}
                        placeholder="24"
                        className="w-full bg-white border border-[#E8E0F0] rounded-xl px-3 py-2 text-xs font-mono text-[#1E1B2E]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">Pincode</label>
                      <input
                        type="text"
                        value={formShippingPincode}
                        onChange={e => setFormShippingPincode(e.target.value)}
                        placeholder="394230"
                        className="w-full bg-white border border-[#E8E0F0] rounded-xl px-3 py-2 text-xs font-mono text-[#1E1B2E]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Row 3.7: E-Invoice & Statutory References (Optional) */}
              <div className="bg-[#FAF8FF] rounded-2xl border border-[#E8E0F0] p-4 space-y-3">
                <div className="text-xs font-bold text-[#5F5A72] uppercase tracking-wider flex items-center space-x-2">
                  <QrCode className="w-4 h-4 text-[#8E2D9D]" />
                  <span>E-Invoice & Statutory References (Optional)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] text-[#5F5A72] block mb-1">Ack No.</label>
                    <input
                      type="text"
                      value={formAckNo}
                      onChange={e => setFormAckNo(e.target.value)}
                      placeholder="112233445566"
                      className="w-full bg-white border border-[#E8E0F0] rounded-xl px-3 py-2 font-mono text-[#1E1B2E]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#5F5A72] block mb-1">Ack Date</label>
                    <input
                      type="date"
                      value={formAckDate}
                      onChange={e => setFormAckDate(e.target.value)}
                      className="w-full bg-white border border-[#E8E0F0] rounded-xl px-3 py-2 text-[#1E1B2E]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#5F5A72] block mb-1">ARN (Application Ref)</label>
                    <input
                      type="text"
                      value={formArn}
                      onChange={e => setFormArn(e.target.value)}
                      placeholder="AA240226001234Z"
                      className="w-full bg-white border border-[#E8E0F0] rounded-xl px-3 py-2 font-mono text-[#1E1B2E]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#5F5A72] block mb-1">IRN (Invoice Ref Num)</label>
                    <input
                      type="text"
                      value={formIrn}
                      onChange={e => setFormIrn(e.target.value)}
                      placeholder="64-digit IRN hash"
                      className="w-full bg-white border border-[#E8E0F0] rounded-xl px-3 py-2 font-mono text-[#1E1B2E]"
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Invoice Dates & Scope Title */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#1E1B2E] block mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={formIssueDate}
                    onChange={e => setFormIssueDate(e.target.value)}
                    className="w-full bg-[#FAF8FF] border border-[#E8E0F0] rounded-xl px-3 py-2 text-xs text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#1E1B2E] block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={formDueDate}
                    onChange={e => setFormDueDate(e.target.value)}
                    className="w-full bg-[#FAF8FF] border border-[#E8E0F0] rounded-xl px-3 py-2 text-xs text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#1E1B2E] block mb-1">Subject / Project Scope</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    placeholder="e.g. Textile ERP Automation"
                    className="w-full bg-[#FAF8FF] border border-[#E8E0F0] rounded-xl px-3 py-2 text-xs text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D] focus:bg-white"
                  />
                </div>
              </div>

              {/* Row 5: Line Items Table */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-[#1E1B2E] uppercase tracking-wider">
                    Service Line Items (Description • Qty • Rate • Amount)
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddItem()}
                    className="px-3 py-1 rounded-lg bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#8E2D9D] hover:text-[#6F42C1] text-[11px] font-bold border border-[#E8E0F0] transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Blank Item</span>
                  </button>
                </div>

                {/* Quick Add Presets Bar */}
                {pricePresets && pricePresets.filter(p => p.is_active).length > 0 && (
                  <div className="p-2.5 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] space-y-1.5">
                    <div className="text-[10px] font-bold text-[#5F5A72] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[#8E2D9D]" />
                      <span>Quick Add Service Presets (Supabase Master):</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {pricePresets.filter(p => p.is_active).map(p => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleAddItem(p.service_name, p.default_price, p.sac_code || '998314')}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#FAF5FF] border border-[#E8E0F0] hover:border-[#C084FC] text-[11px] font-medium text-[#5F5A72] transition-all cursor-pointer flex items-center gap-1.5"
                          title={p.description || p.service_name}
                        >
                          <Plus className="w-2.5 h-2.5 text-[#8E2D9D]" />
                          <span>{p.service_name}</span>
                          <span className="font-mono font-bold text-[#1E1B2E]">₹{p.default_price.toLocaleString('en-IN')}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {formItems.map((item, idx) => (
                    <div key={item.id || idx} className="grid grid-cols-12 gap-2 bg-[#FAF8FF] border border-[#E8E0F0] p-2.5 rounded-xl items-center">
                      <div className="col-span-12 md:col-span-5">
                        <input
                          type="text"
                          required
                          placeholder="Service Description"
                          value={item.description}
                          onChange={e => handleItemChange(idx, 'description', e.target.value)}
                          className="w-full bg-white border border-[#E8E0F0] rounded-lg px-2.5 py-1.5 text-xs text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D]"
                        />
                      </div>
                      <div className="col-span-4 md:col-span-2">
                        <input
                          type="text"
                          placeholder="SAC (998314)"
                          value={item.sacCode || ''}
                          onChange={e => handleItemChange(idx, 'sacCode', e.target.value)}
                          className="w-full bg-white border border-[#E8E0F0] rounded-lg px-2.5 py-1.5 text-xs font-mono text-[#5F5A72] focus:outline-none focus:border-[#8E2D9D] text-center"
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
                          className="w-full bg-white border border-[#E8E0F0] rounded-lg px-2 py-1.5 text-xs font-mono text-[#1E1B2E] text-center focus:outline-none focus:border-[#8E2D9D]"
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
                          className="w-full bg-white border border-[#E8E0F0] rounded-lg px-2.5 py-1.5 text-xs font-mono text-[#1E1B2E] text-right focus:outline-none focus:border-[#8E2D9D]"
                        />
                      </div>
                      <div className="col-span-10 md:col-span-1 text-right font-mono font-bold text-xs text-[#8E2D9D]">
                        ₹ {(item.quantity * item.rate).toLocaleString('en-IN')}
                      </div>
                      <div className="col-span-2 md:col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          disabled={formItems.length <= 1}
                          className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 disabled:opacity-30 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 6: Discount & GST Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FAF8FF] p-4 rounded-2xl border border-[#E8E0F0]">
                <div className="space-y-3">
                  <div className="text-xs font-bold text-[#1E1B2E] uppercase">Discount Configuration</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-[#5F5A72] block mb-1">Discount Type</label>
                      <select
                        value={formDiscountType}
                        onChange={e => setFormDiscountType(e.target.value as any)}
                        className="w-full bg-white border border-[#E8E0F0] rounded-xl px-3 py-2 text-xs text-[#1E1B2E]"
                      >
                        <option value="fixed">Fixed (₹ Amount)</option>
                        <option value="percentage">Percentage (%)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] text-[#5F5A72] block mb-1">Discount Value</label>
                      <input
                        type="number"
                        min="0"
                        value={formDiscountValue}
                        onChange={e => setFormDiscountValue(Number(e.target.value))}
                        className="w-full bg-white border border-[#E8E0F0] rounded-xl px-3 py-2 text-xs font-mono text-[#1E1B2E]"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-bold text-[#1E1B2E] uppercase">GST Rate Setting</div>
                  <div>
                    <label className="text-[11px] text-[#5F5A72] block mb-1">Standard Rate (%)</label>
                    <select
                      value={formGstRate}
                      onChange={e => setFormGstRate(Number(e.target.value))}
                      className="w-full bg-white border border-[#E8E0F0] rounded-xl px-3 py-2 text-xs text-[#1E1B2E]"
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
              <div className="bg-[#FAF8FF] border border-[#C084FC] rounded-2xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#E8E0F0]">
                  <div className="text-xs font-bold text-[#1E1B2E] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#059669]" />
                    <span>Supabase Authoritative Calculation Layer</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#059669] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {authoritativeCalculation.taxLabel}
                  </span>
                </div>

                <div className="flex justify-between text-xs text-[#5F5A72]">
                  <span>Subtotal:</span>
                  <span className="font-mono text-[#1E1B2E] font-bold">₹ {authoritativeCalculation.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs text-[#059669]">
                  <span>Discount:</span>
                  <span className="font-mono font-bold">- ₹ {authoritativeCalculation.discountAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs text-[#1E1B2E] font-bold border-t border-[#E8E0F0] pt-2">
                  <span>Taxable Amount:</span>
                  <span className="font-mono">₹ {authoritativeCalculation.taxableAmount.toLocaleString('en-IN')}</span>
                </div>

                {/* CGST, SGST, UTGST, IGST Line items */}
                {authoritativeCalculation.cgstAmount > 0 && (
                  <div className="flex justify-between text-xs text-[#5F5A72]">
                    <span>CGST (9%):</span>
                    <span className="font-mono text-[#1E1B2E]">₹ {authoritativeCalculation.cgstAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {authoritativeCalculation.sgstAmount > 0 && (
                  <div className="flex justify-between text-xs text-[#5F5A72]">
                    <span>SGST (9%):</span>
                    <span className="font-mono text-[#1E1B2E]">₹ {authoritativeCalculation.sgstAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {authoritativeCalculation.utgstAmount > 0 && (
                  <div className="flex justify-between text-xs text-[#8E2D9D] font-bold">
                    <span>UTGST (9%) [Union Territory {authoritativeCalculation.sellerState.code}]:</span>
                    <span className="font-mono">₹ {authoritativeCalculation.utgstAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {authoritativeCalculation.igstAmount > 0 && (
                  <div className="flex justify-between text-xs text-[#8E2D9D] font-bold">
                    <span>IGST (18%) [Inter-State]:</span>
                    <span className="font-mono">₹ {authoritativeCalculation.igstAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-black text-[#1E1B2E] border-t border-[#E8E0F0] pt-2">
                  <span>Grand Total:</span>
                  <span className="font-mono text-[#8E2D9D]">₹ {authoritativeCalculation.grandTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-[11px] text-[#5F5A72] bg-white p-2.5 rounded-lg font-medium border border-[#E8E0F0]">
                  Amount in Words: <span className="text-[#1E1B2E] font-serif font-bold">{authoritativeCalculation.amountInWords}</span>
                </div>
              </div>

              {/* Notes & Terms */}
              <div>
                <label className="text-[11px] font-bold text-[#1E1B2E] block mb-1">Invoice Notes / Tax Footnote</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  className="w-full bg-[#FAF8FF] border border-[#E8E0F0] rounded-xl px-3 py-2 text-xs text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D] focus:bg-white"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#E8E0F0]">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingInvoice(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#FAF5FF] text-xs font-bold text-[#5F5A72] hover:text-[#1E1B2E] hover:bg-[#F3E8FF] border border-[#E8E0F0] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#8E2D9D] hover:bg-[#6F42C1] text-xs font-bold text-white shadow-xs cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E0F0] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div>
              <span className="text-[10px] font-bold text-[#059669] uppercase tracking-widest block mb-0.5">
                Financial Ledger
              </span>
              <h3 className="text-lg font-black text-[#1E1B2E]">Record Inward Remittance</h3>
              <p className="text-xs text-[#5F5A72]">Against Tax Invoice {payingInvoice.invoiceNumber}</p>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#1E1B2E] block mb-1">Payment Amount (₹) *</label>
                <input
                  required
                  type="number"
                  max={payingInvoice.balanceDue > 0 ? payingInvoice.balanceDue : payingInvoice.totalAmount}
                  value={payAmount}
                  onChange={e => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] font-mono text-[#1E1B2E] text-sm focus:outline-none focus:border-[#059669] focus:bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-[#1E1B2E] block mb-1">Payment Channel</label>
                <select
                  value={payMethod}
                  onChange={e => setPayMethod(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-[#1E1B2E] focus:outline-none focus:border-[#059669] focus:bg-white"
                >
                  <option value="bank_transfer">Direct Bank NEFT / RTGS</option>
                  <option value="upi">Corporate UPI / QR</option>
                  <option value="credit_card">Razorpay / Stripe Gateway</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#1E1B2E] block mb-1">Transaction Ref / UTR *</label>
                <input
                  required
                  type="text"
                  value={payRef}
                  onChange={e => setPayRef(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] font-mono text-[#1E1B2E] focus:outline-none focus:border-[#059669] focus:bg-white"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-[#E8E0F0]">
                <button
                  type="button"
                  onClick={() => setPayingInvoice(null)}
                  className="px-4 py-2 rounded-xl bg-[#FAF5FF] text-[#5F5A72] font-semibold hover:bg-[#F3E8FF] border border-[#E8E0F0] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#059669] hover:bg-emerald-700 text-white font-bold cursor-pointer shadow-xs"
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
