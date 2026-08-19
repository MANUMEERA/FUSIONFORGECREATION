import React, { useState, useMemo } from 'react';
import { 
  Receipt, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Eye, 
  Trash2, 
  Edit3, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Building2, 
  ShieldCheck, 
  FileText, 
  Layers,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { useToast } from '../../../context/ToastContext';
import { CreditDebitNote, LineItem, NoteReason, NoteType, GSTType } from '../../../types';
import { calculateGstInvoiceTotals, extractStateCode } from '../../../utils/gstEngine';
import { formatDateDDMMYYYY, formatDateGstr1 } from '../../../utils/dateUtils';
import { numberToIndianWords } from '../../../utils/numberToWords';
import { BrandLogo } from '../../BrandLogo';

export const CreditDebitNotesSection: React.FC = () => {
  const { 
    creditDebitNotes, 
    invoices, 
    clients, 
    agencyConfig, 
    addCreditDebitNote, 
    updateCreditDebitNote, 
    deleteCreditDebitNote,
    generateNoteNumber,
    currentUser
  } = useApp();

  const { success, error: toastError, info } = useToast();

  const [typeFilter, setTypeFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isCreating, setIsCreating] = useState(false);
  const [createNoteType, setCreateNoteType] = useState<NoteType>('credit');
  const [viewingNote, setViewingNote] = useState<CreditDebitNote | null>(null);

  // Form State
  const [formSelectedInvoiceId, setFormSelectedInvoiceId] = useState('');
  const [formNoteNumber, setFormNoteNumber] = useState('');
  const [formClientId, setFormClientId] = useState('');
  const [formClientCompany, setFormClientCompany] = useState('');
  const [formClientName, setFormClientName] = useState('');
  const [formClientGstin, setFormClientGstin] = useState('');
  const [formClientAddress, setFormClientAddress] = useState('');
  const [formSellerStateCode, setFormSellerStateCode] = useState(agencyConfig.state_code || '26');
  const [formBuyerStateCode, setFormBuyerStateCode] = useState('24');
  const [formPlaceOfSupply, setFormPlaceOfSupply] = useState('24-Gujarat');
  const [formInvoiceNumber, setFormInvoiceNumber] = useState('');
  const [formInvoiceDate, setFormInvoiceDate] = useState('');
  const [formIssueDate, setFormIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [formReason, setFormReason] = useState<NoteReason>('02-Post Sale Discount');
  const [formReasonNotes, setFormReasonNotes] = useState('');
  const [formReverseCharge, setFormReverseCharge] = useState<'Yes' | 'No'>('No');

  const [formItems, setFormItems] = useState<LineItem[]>([
    {
      id: '1',
      description: 'Post-Sale Commercial Discount / Scope Adjustment',
      sacCode: '998314',
      quantity: 1,
      rate: 5000,
      amount: 5000
    }
  ]);
  const [formGstRate, setFormGstRate] = useState<number>(18);

  // GST Calculation for the active modal form
  const formGstCalculation = useMemo(() => {
    return calculateGstInvoiceTotals({
      sellerStateCode: formSellerStateCode,
      buyerStateCode: formBuyerStateCode,
      items: formItems,
      discountType: 'fixed',
      discountValue: 0,
      gstRate: formGstRate,
      currency: 'INR'
    });
  }, [formSellerStateCode, formBuyerStateCode, formItems, formGstRate]);

  // Open Create Modal
  const handleOpenCreateModal = (type: NoteType, parentInvoice?: any) => {
    setCreateNoteType(type);
    const nextNum = generateNoteNumber(type);
    setFormNoteNumber(nextNum);
    setFormIssueDate(new Date().toISOString().split('T')[0]);
    setFormReason(type === 'credit' ? '02-Post Sale Discount' : '06-Final Price Hike / Adjustment');
    setFormReasonNotes('');
    setFormReverseCharge('No');
    setFormGstRate(18);
    setFormSellerStateCode(agencyConfig.state_code || '26');

    if (parentInvoice) {
      setFormSelectedInvoiceId(parentInvoice.id);
      setFormInvoiceNumber(parentInvoice.invoiceNumber);
      setFormInvoiceDate(parentInvoice.issueDate);
      setFormClientId(parentInvoice.clientId);
      setFormClientCompany(parentInvoice.buyerCompany || parentInvoice.clientCompany);
      setFormClientName(parentInvoice.buyerName || parentInvoice.clientName);
      setFormClientGstin(parentInvoice.buyerGstin || parentInvoice.clientGstin || '');
      setFormClientAddress(parentInvoice.buyerAddress || parentInvoice.clientAddress || '');
      const bCode = parentInvoice.buyerStateCode || extractStateCode(parentInvoice.buyerState) || '24';
      setFormBuyerStateCode(bCode);
      setFormPlaceOfSupply(parentInvoice.placeOfSupply || `${bCode}-State`);
      setFormItems([
        {
          id: '1',
          description: type === 'credit' 
            ? `Credit Adjustment against Invoice ${parentInvoice.invoiceNumber}`
            : `Debit Revision against Invoice ${parentInvoice.invoiceNumber}`,
          sacCode: '998314',
          quantity: 1,
          rate: Math.min(10000, Math.round(parentInvoice.taxableAmount * 0.1)),
          amount: Math.min(10000, Math.round(parentInvoice.taxableAmount * 0.1))
        }
      ]);
    } else {
      const firstInv = invoices.find(i => !i.isDeleted) || invoices[0];
      if (firstInv) {
        setFormSelectedInvoiceId(firstInv.id);
        setFormInvoiceNumber(firstInv.invoiceNumber);
        setFormInvoiceDate(firstInv.issueDate);
        setFormClientId(firstInv.clientId);
        setFormClientCompany(firstInv.buyerCompany || firstInv.clientCompany);
        setFormClientName(firstInv.buyerName || firstInv.clientName);
        setFormClientGstin(firstInv.buyerGstin || firstInv.clientGstin || '');
        setFormClientAddress(firstInv.buyerAddress || firstInv.clientAddress || '');
        const bCode = firstInv.buyerStateCode || extractStateCode(firstInv.buyerState) || '24';
        setFormBuyerStateCode(bCode);
        setFormPlaceOfSupply(firstInv.placeOfSupply || `${bCode}-State`);
      }
      setFormItems([
        {
          id: '1',
          description: type === 'credit' ? 'Commercial Rebate / Service Revision' : 'Supplementary Compute Hours & Cloud Config',
          sacCode: '998314',
          quantity: 1,
          rate: 5000,
          amount: 5000
        }
      ]);
    }

    setIsCreating(true);
  };

  // Handle Parent Invoice Selection in Create Modal
  const handleSelectParentInvoice = (invId: string) => {
    setFormSelectedInvoiceId(invId);
    const target = invoices.find(i => i.id === invId);
    if (target) {
      setFormInvoiceNumber(target.invoiceNumber);
      setFormInvoiceDate(target.issueDate);
      setFormClientId(target.clientId);
      setFormClientCompany(target.buyerCompany || target.clientCompany);
      setFormClientName(target.buyerName || target.clientName);
      setFormClientGstin(target.buyerGstin || target.clientGstin || '');
      setFormClientAddress(target.buyerAddress || target.clientAddress || '');
      const bCode = target.buyerStateCode || extractStateCode(target.buyerState) || '24';
      setFormBuyerStateCode(bCode);
      setFormPlaceOfSupply(target.placeOfSupply || `${bCode}-State`);
    }
  };

  // Handle Item Row Changes
  const handleItemChange = (index: number, field: keyof LineItem, value: any) => {
    const updated = [...formItems];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'quantity' || field === 'rate') {
      const q = field === 'quantity' ? Number(value) : updated[index].quantity;
      const r = field === 'rate' ? Number(value) : updated[index].rate;
      updated[index].amount = q * r;
    }
    setFormItems(updated);
  };

  const handleAddItem = () => {
    setFormItems([
      ...formItems,
      {
        id: String(Date.now()),
        description: 'Statutory Adjustment on IT Services',
        sacCode: '998314',
        quantity: 1,
        rate: 2000,
        amount: 2000
      }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (formItems.length <= 1) return;
    setFormItems(formItems.filter((_, idx) => idx !== index));
  };

  // Submit Note Creation
  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formClientCompany.trim()) {
      toastError('Please select or specify a client recipient.');
      return;
    }

    const calc = formGstCalculation;
    const totalTax = calc.totalTaxAmount;
    const totalAmount = calc.grandTotal;
    const amountInWords = numberToIndianWords(totalAmount);

    try {
      const newNote = await addCreditDebitNote({
        noteNumber: formNoteNumber,
        noteType: createNoteType,
        invoiceId: formSelectedInvoiceId || undefined,
        invoiceNumber: formInvoiceNumber || undefined,
        invoiceDate: formInvoiceDate || undefined,
        clientId: formClientId || 'client_custom',
        clientName: formClientName || formClientCompany,
        clientCompany: formClientCompany,
        clientGstin: formClientGstin,
        clientAddress: formClientAddress,
        sellerName: agencyConfig.company_name,
        sellerGstin: agencyConfig.gstin,
        sellerState: agencyConfig.state,
        sellerStateCode: formSellerStateCode,
        buyerStateCode: formBuyerStateCode,
        placeOfSupply: formPlaceOfSupply,
        issueDate: formIssueDate,
        reason: formReason,
        reasonNotes: formReasonNotes,
        reverseCharge: formReverseCharge,
        items: formItems,
        subtotal: calc.subtotal,
        taxableAmount: calc.taxableAmount,
        gstType: calc.gstType,
        gstRate: calc.gstRate,
        cgstAmount: calc.cgstAmount,
        sgstAmount: calc.sgstAmount,
        utgstAmount: calc.utgstAmount,
        igstAmount: calc.igstAmount,
        totalTax: totalTax,
        totalAmount: totalAmount,
        amountInWords,
        status: 'issued',
        createdBy: currentUser.name || 'Admin User'
      });

      success(`Successfully issued ${createNoteType.toUpperCase()} NOTE: ${newNote.noteNumber}`);
      setIsCreating(false);
    } catch (err) {
      console.error(err);
      toastError('Failed to record credit/debit note.');
    }
  };

  // Delete Note
  const handleDelete = async (id: string, noteNum: string) => {
    if (window.confirm(`Are you sure you want to permanently delete note ${noteNum}?`)) {
      await deleteCreditDebitNote(id);
      success(`Deleted note ${noteNum}`);
    }
  };

  // Filtered Notes
  const filteredNotes = useMemo(() => {
    return creditDebitNotes.filter(note => {
      if (note.isDeleted) return false;
      if (typeFilter !== 'all' && note.noteType !== typeFilter) return false;
      if (statusFilter !== 'all' && note.status !== statusFilter) return false;
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const num = (note.noteNumber || '').toLowerCase();
        const client = (note.clientCompany || note.clientName || '').toLowerCase();
        const invNum = (note.invoiceNumber || '').toLowerCase();
        const gstin = (note.clientGstin || '').toLowerCase();
        if (!num.includes(query) && !client.includes(query) && !invNum.includes(query) && !gstin.includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [creditDebitNotes, typeFilter, statusFilter, searchTerm]);

  // Aggregates
  const totalCreditNotesValue = creditDebitNotes.filter(n => !n.isDeleted && n.noteType === 'credit').reduce((s, n) => s + n.totalAmount, 0);
  const totalDebitNotesValue = creditDebitNotes.filter(n => !n.isDeleted && n.noteType === 'debit').reduce((s, n) => s + n.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1E1B2E] flex items-center gap-2">
            <Receipt className="w-6 h-6 text-[#8E2D9D]" />
            Credit & Debit Note Management (GSTR-1 CDNR)
          </h2>
          <p className="text-xs text-[#5F5A72]">
            Issue statutory Credit Notes (tax reduction) and Debit Notes (supplementary tax charge) linked to tax invoices with full audit trail.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleOpenCreateModal('credit')}
            className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Issue Credit Note</span>
          </button>

          <button
            onClick={() => handleOpenCreateModal('debit')}
            className="px-3.5 py-2 rounded-xl bg-[#8E2D9D] hover:bg-[#732280] text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Issue Debit Note</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E8E0F0] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-[#5F5A72] uppercase font-semibold">Total Credit Notes (CN)</div>
            <div className="text-xl font-bold text-amber-700 font-mono mt-1">
              ₹{totalCreditNotesValue.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-[#817B91] mt-0.5">
              {creditDebitNotes.filter(n => !n.isDeleted && n.noteType === 'credit').length} Notes Issued
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E8E0F0] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-[#5F5A72] uppercase font-semibold">Total Debit Notes (DN)</div>
            <div className="text-xl font-bold text-[#8E2D9D] font-mono mt-1">
              ₹{totalDebitNotesValue.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-[#817B91] mt-0.5">
              {creditDebitNotes.filter(n => !n.isDeleted && n.noteType === 'debit').length} Notes Issued
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FAF5FF] border border-[#C084FC]/40 flex items-center justify-center text-[#8E2D9D]">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E8E0F0] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-[#5F5A72] uppercase font-semibold">Net Output Tax Impact</div>
            <div className="text-xl font-bold text-[#059669] font-mono mt-1">
              {totalCreditNotesValue > totalDebitNotesValue ? '-' : '+'}₹{Math.abs(totalCreditNotesValue - totalDebitNotesValue).toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-[#817B91] mt-0.5">Reconciled in GSTR-3B Table 3.1</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#059669]">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E8E0F0] shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <div className="flex items-center space-x-1 bg-[#FAF5FF] p-1 rounded-xl border border-[#E8E0F0] text-xs">
            {[
              { id: 'all', label: 'All Notes' },
              { id: 'credit', label: 'Credit Notes (CN)' },
              { id: 'debit', label: 'Debit Notes (DN)' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setTypeFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  typeFilter === f.id
                    ? 'bg-[#8E2D9D] text-white shadow-xs'
                    : 'text-[#5F5A72] hover:text-[#1E1B2E] hover:bg-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="issued">Issued / Active</option>
            <option value="applied">Applied to Ledger</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#817B91] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search note #, client, GSTIN, invoice #..."
            className="pl-9 pr-4 py-2 rounded-xl bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] placeholder-[#817B91] outline-none focus:border-[#8E2D9D] w-full sm:w-72"
          />
        </div>
      </div>

      {/* Notes Table */}
      <div className="rounded-2xl border border-[#E8E0F0] bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF5FF] text-[#5F5A72] font-semibold border-b border-[#E8E0F0] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Note Number</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Client & GSTIN</th>
                <th className="p-3.5">Original Invoice</th>
                <th className="p-3.5">Issue Date</th>
                <th className="p-3.5">Reason for Issuance</th>
                <th className="p-3.5 text-right">Taxable</th>
                <th className="p-3.5 text-right">Tax</th>
                <th className="p-3.5 text-right">Total Amount</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E0F0] font-mono">
              {filteredNotes.map(note => {
                const isCredit = note.noteType === 'credit';
                return (
                  <tr key={note.id} className="hover:bg-[#FAF5FF] transition-colors">
                    <td className="p-3.5 font-bold text-[#1E1B2E] flex items-center gap-1.5">
                      {isCredit ? (
                        <ArrowDownLeft className="w-3.5 h-3.5 text-amber-600" />
                      ) : (
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#8E2D9D]" />
                      )}
                      <span>{note.noteNumber}</span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isCredit 
                          ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                          : 'bg-[#F3E8FF] text-[#8E2D9D] border border-[#C084FC]/40'
                      }`}>
                        {isCredit ? 'Credit Note' : 'Debit Note'}
                      </span>
                    </td>
                    <td className="p-3.5 font-sans">
                      <div className="font-semibold text-[#1E1B2E] truncate max-w-[160px]">{note.clientCompany}</div>
                      <div className="text-[10px] text-[#8E2D9D] font-mono">{note.clientGstin || 'Unregistered B2C'}</div>
                    </td>
                    <td className="p-3.5 font-sans text-[#5F5A72]">
                      {note.invoiceNumber ? (
                        <div>
                          <span className="font-mono font-semibold text-[#1E1B2E]">{note.invoiceNumber}</span>
                          {note.invoiceDate && <span className="text-[10px] text-[#817B91] block">{formatDateDDMMYYYY(note.invoiceDate)}</span>}
                        </div>
                      ) : (
                        <span className="text-[#817B91]">—</span>
                      )}
                    </td>
                    <td className="p-3.5 text-[#5F5A72] font-sans">{formatDateDDMMYYYY(note.issueDate)}</td>
                    <td className="p-3.5 font-sans text-[#5F5A72] truncate max-w-[150px]">{note.reason}</td>
                    <td className="p-3.5 text-right font-bold text-[#1E1B2E]">₹{note.taxableAmount.toLocaleString('en-IN')}</td>
                    <td className="p-3.5 text-right text-[#8E2D9D] font-semibold">₹{note.totalTax.toLocaleString('en-IN')}</td>
                    <td className="p-3.5 text-right font-bold text-[#1E1B2E]">₹{note.totalAmount.toLocaleString('en-IN')}</td>
                    <td className="p-3.5 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#059669] border border-emerald-200">
                        {note.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-sans">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setViewingNote(note)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#5F5A72] hover:text-[#1E1B2E] transition-colors cursor-pointer"
                          title="View / Print Voucher"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(note.id, note.noteNumber)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-[#817B91] hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete Note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredNotes.length === 0 && (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-[#817B91] font-sans">
                    No Credit or Debit notes match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE NOTE MODAL */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-[#E8E0F0] rounded-2xl w-full max-w-3xl shadow-xl overflow-hidden my-8">
            <div className={`p-4 border-b flex items-center justify-between ${
              createNoteType === 'credit'
                ? 'bg-amber-50 border-amber-200'
                : 'bg-[#FAF5FF] border-[#E8E0F0]'
            }`}>
              <div className="flex items-center space-x-2">
                {createNoteType === 'credit' ? (
                  <ArrowDownLeft className="w-5 h-5 text-amber-600" />
                ) : (
                  <ArrowUpRight className="w-5 h-5 text-[#8E2D9D]" />
                )}
                <div>
                  <h3 className="font-bold text-sm text-[#1E1B2E]">
                    Issue New {createNoteType === 'credit' ? 'Credit Note (CN)' : 'Debit Note (DN)'}
                  </h3>
                  <p className="text-[11px] text-[#5F5A72]">
                    Statutory document issued under GST Law & Rule 53 of CGST Rules, 2017.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreating(false)}
                className="p-1.5 rounded-lg text-[#817B91] hover:text-[#1E1B2E] hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="p-6 space-y-4 text-xs">
              {/* Type Switcher & Note Number */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#FAF5FF] p-4 rounded-xl border border-[#E8E0F0]">
                <div>
                  <label className="text-[11px] font-semibold text-[#1E1B2E] block mb-1">Note Type</label>
                  <select
                    value={createNoteType}
                    onChange={e => {
                      const nt = e.target.value as NoteType;
                      setCreateNoteType(nt);
                      setFormNoteNumber(generateNoteNumber(nt));
                      setFormReason(nt === 'credit' ? '02-Post Sale Discount' : '06-Final Price Hike / Adjustment');
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] font-bold outline-none"
                  >
                    <option value="credit">Credit Note (Tax Reduction)</option>
                    <option value="debit">Debit Note (Additional Tax Charge)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#1E1B2E] block mb-1">Note Number</label>
                  <input
                    type="text"
                    value={formNoteNumber}
                    onChange={e => setFormNoteNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] font-mono font-bold outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#1E1B2E] block mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={formIssueDate}
                    onChange={e => setFormIssueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] font-mono outline-none"
                    required
                  />
                </div>
              </div>

              {/* Linked Invoice Selector */}
              <div className="bg-[#FAF5FF] p-4 rounded-xl border border-[#E8E0F0] space-y-3">
                <div className="font-bold text-[#1E1B2E] text-xs flex items-center justify-between">
                  <span>Link to Original Tax Invoice</span>
                  <span className="text-[10px] text-[#8E2D9D] font-mono font-bold">GSTR-1 CDNR Mandatory Match</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">Select Active Tax Invoice</label>
                    <select
                      value={formSelectedInvoiceId}
                      onChange={e => handleSelectParentInvoice(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] outline-none"
                    >
                      <option value="">-- Direct Standalone Note --</option>
                      {invoices.filter(i => !i.isDeleted).map(inv => (
                        <option key={inv.id} value={inv.id}>
                          {inv.invoiceNumber} — {inv.buyerCompany || inv.clientCompany} (₹{inv.totalAmount.toLocaleString('en-IN')}) • {formatDateDDMMYYYY(inv.issueDate)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">Original Invoice Date</label>
                    <input
                      type="date"
                      value={formInvoiceDate}
                      onChange={e => setFormInvoiceDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] font-mono outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Recipient Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#FAF5FF] p-4 rounded-xl border border-[#E8E0F0]">
                <div>
                  <label className="text-[11px] font-semibold text-[#1E1B2E] block mb-1">Recipient Company</label>
                  <input
                    type="text"
                    value={formClientCompany}
                    onChange={e => setFormClientCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] outline-none font-semibold"
                    placeholder="e.g. Apex Fintech Solutions Pvt Ltd"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#1E1B2E] block mb-1">Recipient GSTIN</label>
                  <input
                    type="text"
                    value={formClientGstin}
                    onChange={e => setFormClientGstin(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] font-mono outline-none uppercase"
                    placeholder="27AABCA1234F1ZM or Blank (B2C)"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#1E1B2E] block mb-1">Place of Supply (POS)</label>
                  <input
                    type="text"
                    value={formPlaceOfSupply}
                    onChange={e => setFormPlaceOfSupply(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] outline-none font-mono"
                    placeholder="27-Maharashtra"
                    required
                  />
                </div>
              </div>

              {/* Statutory Reason */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FAF5FF] p-4 rounded-xl border border-[#E8E0F0]">
                <div>
                  <label className="text-[11px] font-semibold text-[#1E1B2E] block mb-1">Statutory Reason for Issuance</label>
                  <select
                    value={formReason}
                    onChange={e => setFormReason(e.target.value as NoteReason)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] font-bold outline-none"
                  >
                    <option value="01-Sales Return">01-Sales Return</option>
                    <option value="02-Post Sale Discount">02-Post Sale Discount</option>
                    <option value="03-Deficiency in Services">03-Deficiency in Services</option>
                    <option value="04-Correction in Invoice">04-Correction in Invoice</option>
                    <option value="05-Change in POS">05-Change in POS</option>
                    <option value="06-Final Price Hike / Adjustment">06-Final Price Hike / Adjustment</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#1E1B2E] block mb-1">Reason Notes / Specific Details</label>
                  <input
                    type="text"
                    value={formReasonNotes}
                    onChange={e => setFormReasonNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] outline-none"
                    placeholder="e.g. Annual contract volume rebate agreed in Q2 addendum."
                  />
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1E1B2E] uppercase tracking-wider">Adjustment Line Items</label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-2.5 py-1 rounded-lg bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#8E2D9D] border border-[#C084FC]/40 text-[11px] font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {formItems.map((item, idx) => (
                    <div key={item.id || idx} className="grid grid-cols-12 gap-2 bg-[#FAF5FF] p-2.5 rounded-xl border border-[#E8E0F0] items-center">
                      <div className="col-span-6">
                        <input
                          type="text"
                          value={item.description}
                          onChange={e => handleItemChange(idx, 'description', e.target.value)}
                          placeholder="Description of adjustment"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] outline-none"
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={item.sacCode}
                          onChange={e => handleItemChange(idx, 'sacCode', e.target.value)}
                          placeholder="SAC (998314)"
                          className="w-full px-2 py-1.5 rounded-lg bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] font-mono outline-none"
                          required
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          value={item.rate}
                          onChange={e => handleItemChange(idx, 'rate', Number(e.target.value))}
                          placeholder="Taxable Amount"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] font-mono outline-none"
                          required
                        />
                      </div>
                      <div className="col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1 text-[#817B91] hover:text-red-500 cursor-pointer"
                          title="Remove Row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tax Calculations Summary */}
              <div className="p-4 rounded-xl bg-[#FAF5FF] border border-[#C084FC]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
                <div className="text-xs space-y-1">
                  <div className="text-[#5F5A72]">
                    Tax Type: <strong className="text-[#8E2D9D] font-sans uppercase">{formGstCalculation.taxLabel}</strong> ({formGstRate}%)
                  </div>
                  <div className="text-[#5F5A72]">
                    Taxable: <span className="text-[#1E1B2E] font-bold">₹{formGstCalculation.taxableAmount.toLocaleString('en-IN')}</span> • Tax: <span className="text-[#8E2D9D] font-semibold">₹{formGstCalculation.totalTaxAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-[#5F5A72] uppercase font-sans font-bold">Total Note Value</div>
                  <div className="text-lg font-bold text-[#1E1B2E] font-mono">
                    ₹{formGstCalculation.grandTotal.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#5F5A72] font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-white font-bold text-xs shadow-xs transition-all cursor-pointer ${
                    createNoteType === 'credit'
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-[#8E2D9D] hover:bg-[#732280]'
                  }`}
                >
                  Issue {createNoteType.toUpperCase()} Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW / PRINT NOTE MODAL */}
      {viewingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8 print:m-0 print:w-full print:shadow-none">
            {/* Header / Actions */}
            <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between print:hidden">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-slate-900 font-mono">{viewingNote.noteNumber}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  viewingNote.noteType === 'credit' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'
                }`}>
                  {viewingNote.noteType === 'credit' ? 'CREDIT NOTE' : 'DEBIT NOTE'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center space-x-1 hover:bg-slate-800 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Voucher</span>
                </button>
                <button
                  onClick={() => setViewingNote(null)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Voucher Document Layout */}
            <div className="p-8 space-y-6 text-xs text-slate-800 bg-white" id="printable-voucher">
              {/* Top Company Info */}
              <div className="flex items-start justify-between border-b pb-4 border-slate-200">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">{agencyConfig.company_name || 'Fusion Forge Creation'}</h1>
                  <p className="text-[11px] text-slate-600 max-w-sm mt-0.5">{agencyConfig.address}</p>
                  <div className="mt-2 text-[11px] font-mono text-slate-700">
                    <div>GSTIN: <strong>{agencyConfig.gstin}</strong> • PAN: <strong>{agencyConfig.pan}</strong></div>
                    <div>State: <strong>{agencyConfig.state} [{agencyConfig.state_code}]</strong></div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-block px-3 py-1 bg-slate-900 text-white font-black text-xs uppercase tracking-wider rounded">
                    {viewingNote.noteType === 'credit' ? 'STATUTORY CREDIT NOTE' : 'STATUTORY DEBIT NOTE'}
                  </div>
                  <div className="font-mono text-sm font-bold text-slate-900 mt-2">{viewingNote.noteNumber}</div>
                  <div className="text-[11px] text-slate-600">Date: {formatDateDDMMYYYY(viewingNote.issueDate)}</div>
                </div>
              </div>

              {/* Bill To & Original Reference */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Issued To (Recipient):</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{viewingNote.clientCompany}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">{viewingNote.clientAddress}</div>
                  <div className="text-[11px] font-mono mt-1 text-slate-700">
                    GSTIN: <strong>{viewingNote.clientGstin || 'Unregistered B2C'}</strong>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Original Invoice Reference:</div>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">
                    {viewingNote.invoiceNumber || 'Direct Account Adjustment'}
                  </div>
                  {viewingNote.invoiceDate && (
                    <div className="text-[11px] text-slate-600">Original Date: {formatDateDDMMYYYY(viewingNote.invoiceDate)}</div>
                  )}
                  <div className="text-[11px] font-mono text-slate-700 mt-1">
                    Place of Supply: <strong>{viewingNote.placeOfSupply}</strong>
                  </div>
                  <div className="text-[11px] text-slate-700 mt-1">
                    Statutory Reason: <strong className="text-slate-900">{viewingNote.reason}</strong>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">#</th>
                    <th className="p-2.5">Description of Service Adjustment</th>
                    <th className="p-2.5">SAC</th>
                    <th className="p-2.5 text-right">Qty</th>
                    <th className="p-2.5 text-right">Rate (₹)</th>
                    <th className="p-2.5 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  {viewingNote.items.map((it, idx) => (
                    <tr key={it.id || idx}>
                      <td className="p-2.5">{idx + 1}</td>
                      <td className="p-2.5 font-sans font-medium text-slate-900">{it.description}</td>
                      <td className="p-2.5 text-slate-700">{it.sacCode || '998314'}</td>
                      <td className="p-2.5 text-right">{it.quantity}</td>
                      <td className="p-2.5 text-right">₹{it.rate.toLocaleString('en-IN')}</td>
                      <td className="p-2.5 text-right font-bold text-slate-900">₹{it.amount.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals & Taxes */}
              <div className="flex justify-end font-mono">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Taxable Subtotal:</span>
                    <span>₹{viewingNote.taxableAmount.toLocaleString('en-IN')}</span>
                  </div>
                  {viewingNote.igstAmount > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>IGST (18%):</span>
                      <span>₹{viewingNote.igstAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {viewingNote.cgstAmount > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>CGST (9%):</span>
                      <span>₹{viewingNote.cgstAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {(viewingNote.sgstAmount > 0 || (viewingNote.utgstAmount || 0) > 0) && (
                    <div className="flex justify-between text-slate-600">
                      <span>SGST / UTGST (9%):</span>
                      <span>₹{((viewingNote.sgstAmount || 0) + (viewingNote.utgstAmount || 0)).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-900 font-bold border-t pt-1.5 border-slate-300 text-sm">
                    <span>Net Note Total:</span>
                    <span>₹{viewingNote.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Amount in words */}
              <div className="p-3 bg-slate-50 rounded-lg text-slate-700 text-[11px] font-sans">
                Amount in Words: <strong>{viewingNote.amountInWords || numberToIndianWords(viewingNote.totalAmount)}</strong>
              </div>

              {/* Signatory */}
              <div className="flex justify-between items-end pt-6 border-t border-slate-200">
                <div className="text-[10px] text-slate-500">
                  This is a computer-generated statutory voucher compliant with Section 34 of the CGST Act, 2017.
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900 text-xs">For {agencyConfig.company_name}</div>
                  <div className="mt-8 border-t border-slate-400 pt-1 text-[11px] text-slate-600">
                    Authorized Signatory
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
