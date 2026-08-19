import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Edit3, 
  Download, 
  Receipt,
  Building2,
  Calendar,
  AlertCircle,
  X,
  Upload,
  Percent
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Purchase, PurchasePaymentStatus } from '../../../types';
import { useToast } from '../../../context/ToastContext';

export const PurchasesSection: React.FC = () => {
  const { purchases, addPurchase, updatePurchase, deletePurchase, markPurchasePaid, currentUser, agencyConfig } = useApp();
  const { success, error: toastError } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PurchasePaymentStatus>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);
  const [previewAttachment, setPreviewAttachment] = useState<{ url: string; name: string } | null>(null);

  // Form State
  const [supplierName, setSupplierName] = useState('');
  const [supplierGstin, setSupplierGstin] = useState('');
  const [supplierEmail, setSupplierEmail] = useState('');
  const [supplierPhone, setSupplierPhone] = useState('');
  const [supplierAddress, setSupplierAddress] = useState('');
  const [supplierStateCode, setSupplierStateCode] = useState('27');
  const [billNumber, setBillNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [hsnSacCode, setHsnSacCode] = useState('998313');
  const [category, setCategory] = useState('Cloud Infrastructure & Servers');
  const [taxableAmount, setTaxableAmount] = useState<number>(10000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [isInterState, setIsInterState] = useState<boolean>(true);
  const [paymentStatus, setPaymentStatus] = useState<PurchasePaymentStatus>('pending');
  const [paymentMode, setPaymentMode] = useState('Bank Transfer (NEFT/RTGS)');
  const [paymentRef, setPaymentRef] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [isItcClaimable, setIsItcClaimable] = useState(true);
  const [notes, setNotes] = useState('');

  // Tax calculations
  const calculatedTaxAmount = Math.round((taxableAmount * (gstRate / 100)) * 100) / 100;
  const calculatedCgst = isInterState ? 0 : calculatedTaxAmount / 2;
  const calculatedSgst = isInterState ? 0 : calculatedTaxAmount / 2;
  const calculatedIgst = isInterState ? calculatedTaxAmount : 0;
  const calculatedTotal = taxableAmount + calculatedTaxAmount;

  // Filtered Purchases
  const filteredPurchases = purchases.filter(p => {
    const matchesSearch = 
      p.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.supplierGstin && p.supplierGstin.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.hsnSacCode && p.hsnSacCode.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || p.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Aggregated Metrics
  const totalPurchasesAmount = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
  const totalTaxablePurchases = purchases.reduce((sum, p) => sum + p.taxableAmount, 0);
  const totalItcClaimable = purchases
    .filter(p => p.isItcClaimable !== false)
    .reduce((sum, p) => sum + (p.cgstAmount + p.sgstAmount + p.igstAmount), 0);
  const totalPendingPayables = purchases
    .filter(p => p.paymentStatus === 'pending')
    .reduce((sum, p) => sum + p.totalAmount, 0);

  const handleOpenAddModal = () => {
    setEditingPurchase(null);
    setSupplierName('');
    setSupplierGstin('');
    setSupplierEmail('');
    setSupplierPhone('');
    setSupplierAddress('');
    setSupplierStateCode('27');
    setBillNumber(`BILL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
    setPurchaseDate(new Date().toISOString().split('T')[0]);
    setDueDate(new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]);
    setDescription('');
    setHsnSacCode('998313');
    setCategory('Cloud Infrastructure & Servers');
    setTaxableAmount(25000);
    setGstRate(18);
    setIsInterState(true);
    setPaymentStatus('pending');
    setPaymentMode('Bank Transfer (NEFT/RTGS)');
    setPaymentRef('');
    setAttachmentUrl('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80');
    setAttachmentName('Vendor_Tax_Invoice.pdf');
    setIsItcClaimable(true);
    setNotes('');
    setShowModal(true);
  };

  const handleOpenEditModal = (p: Purchase) => {
    setEditingPurchase(p);
    setSupplierName(p.supplierName);
    setSupplierGstin(p.supplierGstin || '');
    setSupplierEmail(p.supplierEmail || '');
    setSupplierPhone(p.supplierPhone || '');
    setSupplierAddress(p.supplierAddress || '');
    setSupplierStateCode(p.supplierStateCode || '27');
    setBillNumber(p.billNumber);
    setPurchaseDate(p.purchaseDate);
    setDueDate(p.dueDate || '');
    setDescription(p.description);
    setHsnSacCode(p.hsnSacCode || '998313');
    setCategory(p.category || 'Cloud Infrastructure & Servers');
    setTaxableAmount(p.taxableAmount);
    setGstRate(p.gstRate);
    setIsInterState(p.igstAmount > 0);
    setPaymentStatus(p.paymentStatus);
    setPaymentMode(p.paymentMode || 'Bank Transfer (NEFT/RTGS)');
    setPaymentRef(p.paymentRef || '');
    setAttachmentUrl(p.attachmentUrl || '');
    setAttachmentName(p.attachmentName || '');
    setIsItcClaimable(p.isItcClaimable ?? true);
    setNotes(p.notes || '');
    setShowModal(true);
  };

  const handleSavePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierName.trim() || !billNumber.trim() || taxableAmount <= 0) {
      toastError('Please fill in the Supplier Name, Bill Number, and a valid Taxable Amount.');
      return;
    }

    try {
      const payload = {
        supplierName: supplierName.trim(),
        supplierGstin: supplierGstin.trim() ? supplierGstin.trim().toUpperCase() : undefined,
        supplierEmail: supplierEmail.trim() || undefined,
        supplierPhone: supplierPhone.trim() || undefined,
        supplierAddress: supplierAddress.trim() || undefined,
        supplierStateCode: supplierStateCode || undefined,
        billNumber: billNumber.trim(),
        purchaseDate,
        dueDate: dueDate || undefined,
        description: description.trim() || 'Software/Cloud Procurement',
        hsnSacCode: hsnSacCode.trim() || '998313',
        category,
        taxableAmount,
        gstRate,
        cgstAmount: calculatedCgst,
        sgstAmount: calculatedSgst,
        utgstAmount: 0,
        igstAmount: calculatedIgst,
        totalAmount: calculatedTotal,
        paymentStatus,
        paymentMode: paymentStatus === 'paid' ? paymentMode : undefined,
        paymentDate: paymentStatus === 'paid' ? (editingPurchase?.paymentDate || purchaseDate) : undefined,
        paymentRef: paymentRef.trim() || undefined,
        attachmentUrl: attachmentUrl.trim() || undefined,
        attachmentName: attachmentName.trim() || undefined,
        isItcClaimable,
        notes: notes.trim() || undefined
      };

      if (editingPurchase) {
        await updatePurchase(editingPurchase.id, payload);
        success(`Updated purchase bill #${billNumber} successfully.`);
      } else {
        await addPurchase(payload);
        success(`Recorded new purchase bill #${billNumber} from ${supplierName}.`);
      }
      setShowModal(false);
    } catch (err) {
      toastError('Failed to save purchase bill.');
    }
  };

  const handleDelete = async (id: string, billNo: string) => {
    if (confirm(`Are you sure you want to delete purchase bill #${billNo}?`)) {
      await deletePurchase(id);
      success(`Purchase bill #${billNo} deleted.`);
    }
  };

  const handleQuickPay = async (p: Purchase) => {
    const ref = prompt('Enter Bank UTR / Transaction Reference number:', `NEFT/HDFC/${Math.floor(1000000000 + Math.random() * 9000000000)}`);
    if (ref !== null) {
      await markPurchasePaid(p.id, 'Bank Transfer (NEFT/RTGS)', ref);
      success(`Purchase #${p.billNumber} marked as Paid.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E8E0F0] shadow-xs">
          <div className="text-xs text-[#5F5A72] font-semibold mb-1">Total Purchases (Gross)</div>
          <div className="text-2xl font-black text-[#1E1B2E] font-mono">₹{totalPurchasesAmount.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-[#817B91] mt-1">{purchases.length} B2B vendor bills</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E8E0F0] shadow-xs">
          <div className="text-xs text-[#8E2D9D] font-semibold mb-1">Taxable Inward Supply</div>
          <div className="text-2xl font-black text-[#8E2D9D] font-mono">₹{totalTaxablePurchases.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-[#817B91] mt-1">Base cost of services & goods</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E8E0F0] shadow-xs">
          <div className="text-xs text-[#059669] font-semibold mb-1">Input Tax Credit (ITC)</div>
          <div className="text-2xl font-black text-[#059669] font-mono">₹{totalItcClaimable.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-[#059669] mt-1">GSTR-2B Claimable Credit</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E8E0F0] shadow-xs">
          <div className="text-xs text-amber-700 font-semibold mb-1">Pending Payables</div>
          <div className="text-2xl font-black text-amber-700 font-mono">₹{totalPendingPayables.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-amber-700/80 mt-1">
            {purchases.filter(p => p.paymentStatus === 'pending').length} bills awaiting settlement
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E8E0F0] shadow-xs">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#817B91] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by supplier, bill #, GSTIN, HSN/SAC..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] placeholder-[#817B91] outline-none focus:border-[#8E2D9D]"
            />
          </div>

          <div className="flex items-center space-x-1.5 bg-[#FAF5FF] p-1 rounded-xl border border-[#E8E0F0] text-xs">
            {(['all', 'paid', 'pending'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                  statusFilter === st 
                    ? 'bg-[#8E2D9D] text-white shadow-xs' 
                    : 'text-[#5F5A72] hover:text-[#1E1B2E]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-[#8E2D9D] hover:bg-[#732280] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Record Purchase Bill</span>
        </button>
      </div>

      {/* Purchases Table */}
      <div className="rounded-2xl border border-[#E8E0F0] bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF5FF] text-[#5F5A72] font-bold border-b border-[#E8E0F0] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Bill # & Date</th>
                <th className="p-3.5">Supplier / Vendor</th>
                <th className="p-3.5">HSN / SAC</th>
                <th className="p-3.5 text-right">Taxable</th>
                <th className="p-3.5 text-right">GST (CGST/SGST/IGST)</th>
                <th className="p-3.5 text-right">Total Bill</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-center">Attachment</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E0F0]">
              {filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-[#817B91]">
                    No purchase records match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredPurchases.map(p => (
                  <tr key={p.id} className="hover:bg-[#FAF5FF] transition-colors">
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-[#1E1B2E]">{p.billNumber}</div>
                      <div className="text-[10px] text-[#5F5A72]">{p.purchaseDate}</div>
                      {p.dueDate && p.paymentStatus === 'pending' && (
                        <div className="text-[10px] text-amber-700 font-medium">Due: {p.dueDate}</div>
                      )}
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-[#1E1B2E]">{p.supplierName}</div>
                      <div className="text-[10px] font-mono text-[#8E2D9D]">{p.supplierGstin || 'Unregistered Vendor'}</div>
                      <div className="text-[10px] text-[#5F5A72] truncate max-w-xs">{p.description}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-[#FAF5FF] border border-[#E8E0F0] font-mono text-[10px] text-[#5F5A72] font-bold">
                        {p.hsnSacCode || '998313'}
                      </span>
                      <div className="text-[9px] text-[#817B91] mt-0.5">{p.category || 'IT Services'}</div>
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-[#1E1B2E]">
                      ₹{p.taxableAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="font-mono font-bold text-[#059669]">
                        ₹{(p.cgstAmount + p.sgstAmount + p.igstAmount).toLocaleString('en-IN')}
                      </div>
                      <div className="text-[9px] text-[#817B91] font-mono">
                        {p.igstAmount > 0 ? `IGST @ ${p.gstRate}%` : `CGST+SGST @ ${p.gstRate}%`}
                      </div>
                    </td>
                    <td className="p-3.5 text-right font-mono font-black text-[#1E1B2E] text-sm">
                      ₹{p.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                        p.paymentStatus === 'paid'
                          ? 'bg-emerald-50 text-[#059669] border border-emerald-200'
                          : p.paymentStatus === 'pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-[#5F5A72] border border-slate-200'
                      }`}>
                        {p.paymentStatus === 'paid' && <CheckCircle2 className="w-3 h-3" />}
                        {p.paymentStatus === 'pending' && <Clock className="w-3 h-3" />}
                        <span>{p.paymentStatus.replace('_', ' ')}</span>
                      </span>
                      {p.paymentMode && (
                        <div className="text-[9px] text-[#817B91] mt-0.5">{p.paymentMode}</div>
                      )}
                    </td>
                    <td className="p-3.5 text-center">
                      {p.attachmentUrl ? (
                        <button
                          onClick={() => setPreviewAttachment({ url: p.attachmentUrl!, name: p.attachmentName || 'Bill Receipt' })}
                          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#8E2D9D] border border-[#E8E0F0] text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <FileText className="w-3 h-3" />
                          <span>View</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-[#817B91]">None</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {p.paymentStatus === 'pending' && (
                          <button
                            onClick={() => handleQuickPay(p)}
                            title="Mark as Paid"
                            className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#059669] border border-emerald-200 text-[10px] font-bold cursor-pointer transition-all"
                          >
                            Pay
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          title="Edit Bill"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#5F5A72] hover:text-[#1E1B2E] border border-[#E8E0F0] cursor-pointer transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.billNumber)}
                          title="Delete Bill"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-[#817B91] hover:text-red-600 border border-[#E8E0F0] cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record / Edit Purchase Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-[#E8E0F0] p-6 shadow-xl space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E0F0]">
              <div className="flex items-center space-x-2.5">
                <ShoppingBag className="w-5 h-5 text-[#8E2D9D]" />
                <h3 className="text-base font-bold text-[#1E1B2E]">
                  {editingPurchase ? 'Edit Purchase Bill' : 'Record New Purchase Bill'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-[#817B91] hover:text-[#1E1B2E] hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePurchase} className="space-y-4 text-xs">
              {/* Row 1: Supplier & GSTIN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#1E1B2E] font-bold mb-1">Supplier / Vendor Name *</label>
                  <input
                    type="text"
                    required
                    value={supplierName}
                    onChange={e => setSupplierName(e.target.value)}
                    placeholder="e.g. Amazon Web Services India Pvt Ltd"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                  />
                </div>
                <div>
                  <label className="block text-[#1E1B2E] font-bold mb-1">Supplier GSTIN (15-char)</label>
                  <input
                    type="text"
                    maxLength={15}
                    value={supplierGstin}
                    onChange={e => setSupplierGstin(e.target.value.toUpperCase())}
                    placeholder="e.g. 27AABCA9008R1ZM"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] font-mono outline-none focus:border-[#8E2D9D]"
                  />
                </div>
              </div>

              {/* Row 2: Bill #, Date & Due Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#1E1B2E] font-bold mb-1">Bill / Invoice # *</label>
                  <input
                    type="text"
                    required
                    value={billNumber}
                    onChange={e => setBillNumber(e.target.value)}
                    placeholder="e.g. AWS-2026-9901"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] font-mono outline-none focus:border-[#8E2D9D]"
                  />
                </div>
                <div>
                  <label className="block text-[#1E1B2E] font-bold mb-1">Purchase Date *</label>
                  <input
                    type="date"
                    required
                    value={purchaseDate}
                    onChange={e => setPurchaseDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                  />
                </div>
                <div>
                  <label className="block text-[#1E1B2E] font-bold mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                  />
                </div>
              </div>

              {/* Row 3: Description & HSN/SAC */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[#1E1B2E] font-bold mb-1">Description of Goods / Services</label>
                  <input
                    type="text"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="e.g. Monthly EC2 compute, RDS database & S3 storage"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                  />
                </div>
                <div>
                  <label className="block text-[#1E1B2E] font-bold mb-1">HSN / SAC Code</label>
                  <select
                    value={hsnSacCode}
                    onChange={e => setHsnSacCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D] font-mono"
                  >
                    <option value="998313">998313 - IT Infrastructure & Hosting</option>
                    <option value="998314">998314 - IT Software Design & Dev</option>
                    <option value="998315">998315 - Web Hosting & Cloud</option>
                    <option value="847130">847130 - Laptops & Hardware</option>
                    <option value="998221">998221 - Accounting & Legal</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Taxable, GST Rate, Jurisdiction */}
              <div className="p-4 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[#1E1B2E] font-bold mb-1">Taxable Amount (₹) *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      step="any"
                      value={taxableAmount}
                      onChange={e => setTaxableAmount(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] font-mono font-bold outline-none focus:border-[#8E2D9D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#1E1B2E] font-bold mb-1">GST Rate (%)</label>
                    <select
                      value={gstRate}
                      onChange={e => setGstRate(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D] font-mono font-bold"
                    >
                      <option value={18}>18% (Standard IT Services)</option>
                      <option value={12}>12% (Hardware/IT Peripherals)</option>
                      <option value={5}>5% (Transport/Essential)</option>
                      <option value={28}>28% (Luxury Goods)</option>
                      <option value={0}>0% (Exempted Supply)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#1E1B2E] font-bold mb-1">Tax Jurisdiction</label>
                    <button
                      type="button"
                      onClick={() => setIsInterState(!isInterState)}
                      className={`w-full py-2 px-3 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                        isInterState
                          ? 'bg-[#F3E8FF] text-[#8E2D9D] border-[#C084FC]/40'
                          : 'bg-emerald-50 text-[#059669] border-emerald-200'
                      }`}
                    >
                      {isInterState ? 'Inter-State (IGST 18%)' : 'Intra-State (CGST 9% + SGST 9%)'}
                    </button>
                  </div>
                </div>

                {/* Tax Breakdown Strip */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E8E0F0] text-center font-mono">
                  <div className="p-2 rounded-lg bg-white border border-[#E8E0F0]">
                    <div className="text-[10px] text-[#5F5A72]">CGST + SGST</div>
                    <div className="font-bold text-[#1E1B2E]">₹{(calculatedCgst + calculatedSgst).toLocaleString('en-IN')}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-[#E8E0F0]">
                    <div className="text-[10px] text-[#5F5A72]">IGST</div>
                    <div className="font-bold text-[#8E2D9D]">₹{calculatedIgst.toLocaleString('en-IN')}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-[#C084FC]/40">
                    <div className="text-[10px] text-[#8E2D9D] font-semibold">Total Payable</div>
                    <div className="font-bold text-[#059669] text-sm">₹{calculatedTotal.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              </div>

              {/* Row 5: Payment Status, Mode & Attachment */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#1E1B2E] font-bold mb-1">Payment Status</label>
                  <select
                    value={paymentStatus}
                    onChange={e => setPaymentStatus(e.target.value as PurchasePaymentStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="partially_paid">Partially Paid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#1E1B2E] font-bold mb-1">Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={e => setPaymentMode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                  >
                    <option value="Bank Transfer (NEFT/RTGS)">Bank Transfer (NEFT/RTGS)</option>
                    <option value="IMPS">IMPS</option>
                    <option value="UPI">UPI</option>
                    <option value="Credit Card">Corporate Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#1E1B2E] font-bold mb-1">Attachment File URL</label>
                  <input
                    type="text"
                    value={attachmentUrl}
                    onChange={e => setAttachmentUrl(e.target.value)}
                    placeholder="https://.../bill.pdf"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                  />
                </div>
              </div>

              {/* ITC Claim Checkbox */}
              <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isItcClaimable}
                  onChange={e => setIsItcClaimable(e.target.checked)}
                  className="rounded text-[#8E2D9D] focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span className="text-xs text-[#1E1B2E] font-medium">
                  Eligible for GST Input Tax Credit (ITC) under GSTR-2B & GSTR-3B
                </span>
              </label>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#E8E0F0]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#5F5A72] font-semibold text-xs cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#8E2D9D] hover:bg-[#732280] text-white font-bold text-xs shadow-xs cursor-pointer transition-all"
                >
                  {editingPurchase ? 'Update Purchase Bill' : 'Save Purchase Bill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attachment Preview Modal */}
      {previewAttachment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-[#E8E0F0] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E0F0]">
              <h3 className="font-bold text-sm text-[#1E1B2E] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#8E2D9D]" />
                {previewAttachment.name}
              </h3>
              <button
                onClick={() => setPreviewAttachment(null)}
                className="p-1.5 rounded-lg text-[#817B91] hover:text-[#1E1B2E] hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="rounded-xl overflow-hidden border border-[#E8E0F0] bg-[#FAF5FF] flex items-center justify-center p-2 min-h-64">
              <img
                src={previewAttachment.url}
                alt={previewAttachment.name}
                className="max-h-80 w-auto object-contain rounded-lg shadow-xs"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setPreviewAttachment(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1E1B2E] text-xs font-bold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
