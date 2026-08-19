import React, { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Calendar, 
  Tag, 
  TrendingDown, 
  X,
  DollarSign,
  ArrowDownRight
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Expense, ExpenseStatus } from '../../../types';
import { useToast } from '../../../context/ToastContext';

const EXPENSE_CATEGORIES = [
  'Office Rent & Facilities',
  'Software Subscriptions & SaaS',
  'Cloud Infrastructure & Hosting',
  'Marketing & Advertising',
  'Legal & Professional Fees',
  'Hardware & Equipment',
  'Internet & Telecommunications',
  'Travel & Conveyance',
  'Staff Welfare & Refreshments',
  'Bank Charges & Gateway Fees',
  'Taxes & Compliance',
  'Miscellaneous'
];

export const ExpensesSection: React.FC = () => {
  const { expenses, addExpense, updateExpense, deleteExpense } = useApp();
  const { success, error: toastError } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Form states
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [amount, setAmount] = useState<number>(5000);
  const [gstApplicable, setGstApplicable] = useState(false);
  const [gstRate, setGstRate] = useState(18);
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [paidBy, setPaidBy] = useState('Fusion Forge Creations Current A/C');
  const [status, setStatus] = useState<ExpenseStatus>('paid');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [notes, setNotes] = useState('');

  // GST dynamic calculations
  const calculatedTaxable = gstApplicable ? Math.round((amount / (1 + gstRate / 100)) * 100) / 100 : amount;
  const calculatedGst = gstApplicable ? Math.round((amount - calculatedTaxable) * 100) / 100 : 0;

  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = 
      exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (exp.referenceNumber && exp.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      exp.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || exp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalExpenseAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalGstPaidOnExpenses = expenses.reduce((sum, exp) => sum + (exp.gstAmount || 0), 0);

  const handleOpenAddModal = () => {
    setEditingExpense(null);
    setExpenseDate(new Date().toISOString().split('T')[0]);
    setCategory(EXPENSE_CATEGORIES[0]);
    setDescription('');
    setVendorName('');
    setAmount(2500);
    setGstApplicable(false);
    setGstRate(18);
    setPaymentMode('UPI');
    setReferenceNumber(`UPI/${Math.floor(1000000000 + Math.random() * 9000000000)}`);
    setPaidBy('Fusion Forge Creations Current A/C');
    setStatus('paid');
    setAttachmentUrl('');
    setAttachmentName('');
    setNotes('');
    setShowModal(true);
  };

  const handleOpenEditModal = (exp: Expense) => {
    setEditingExpense(exp);
    setExpenseDate(exp.expenseDate);
    setCategory(exp.category);
    setDescription(exp.description);
    setVendorName(exp.vendorName);
    setAmount(exp.amount);
    setGstApplicable(exp.gstApplicable);
    setGstRate(exp.gstRate || 18);
    setPaymentMode(exp.paymentMode);
    setReferenceNumber(exp.referenceNumber || '');
    setPaidBy(exp.paidBy || 'Fusion Forge Creations Current A/C');
    setStatus(exp.status || 'paid');
    setAttachmentUrl(exp.attachmentUrl || '');
    setAttachmentName(exp.attachmentName || '');
    setNotes(exp.notes || '');
    setShowModal(true);
  };

  const handleSaveExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !vendorName.trim() || amount <= 0) {
      toastError('Please enter a description, vendor name, and valid expense amount.');
      return;
    }

    try {
      const payload = {
        expenseDate,
        category,
        description: description.trim(),
        vendorName: vendorName.trim(),
        amount,
        gstApplicable,
        gstRate: gstApplicable ? gstRate : undefined,
        taxableAmount: gstApplicable ? calculatedTaxable : undefined,
        gstAmount: gstApplicable ? calculatedGst : undefined,
        paymentMode,
        referenceNumber: referenceNumber.trim() || undefined,
        paidBy: paidBy.trim() || undefined,
        status,
        attachmentUrl: attachmentUrl.trim() || undefined,
        attachmentName: attachmentName.trim() || undefined,
        notes: notes.trim() || undefined
      };

      if (editingExpense) {
        await updateExpense(editingExpense.id, payload);
        success(`Updated expense "${description}" successfully.`);
      } else {
        await addExpense(payload);
        success(`Recorded expense ₹${amount.toLocaleString('en-IN')} for "${vendorName}".`);
      }
      setShowModal(false);
    } catch (err) {
      toastError('Failed to save expense.');
    }
  };

  const handleDelete = async (id: string, desc: string) => {
    if (confirm(`Delete expense "${desc}"?`)) {
      await deleteExpense(id);
      success(`Expense deleted.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E8E0F0] shadow-xs">
          <div className="text-xs text-rose-600 font-semibold mb-1">Total Operating Expenses (OPEX)</div>
          <div className="text-2xl font-black text-rose-600 font-mono">₹{totalExpenseAmount.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-[#817B91] mt-1">{expenses.length} logged expense entries</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E8E0F0] shadow-xs">
          <div className="text-xs text-[#8E2D9D] font-semibold mb-1">GST Paid on Expenses</div>
          <div className="text-2xl font-black text-[#8E2D9D] font-mono">₹{totalGstPaidOnExpenses.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-[#817B91] mt-1">Available for input tax adjustments</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E8E0F0] shadow-xs">
          <div className="text-xs text-[#059669] font-semibold mb-1">Settled / Paid Vouchers</div>
          <div className="text-2xl font-black text-[#059669] font-mono">
            {expenses.filter(e => e.status === 'paid').length} / {expenses.length}
          </div>
          <div className="text-[11px] text-[#059669] mt-1">100% reconciled digital payments</div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E8E0F0] shadow-xs">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 text-[#817B91] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search expenses by vendor, description, reference..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] placeholder-[#817B91] outline-none focus:border-[#8E2D9D]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-[#817B91]" />
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] outline-none focus:border-[#8E2D9D] cursor-pointer"
            >
              <option value="all">All Categories</option>
              {EXPENSE_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-[#8E2D9D] hover:bg-[#732280] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Expense</span>
        </button>
      </div>

      {/* Expenses Table */}
      <div className="rounded-2xl border border-[#E8E0F0] bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF5FF] text-[#5F5A72] font-bold border-b border-[#E8E0F0] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Description & Payee</th>
                <th className="p-3.5">Payment Mode & Ref</th>
                <th className="p-3.5 text-right">GST (if applicable)</th>
                <th className="p-3.5 text-right">Total Amount</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E0F0]">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#817B91]">
                    No expense records found.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map(exp => (
                  <tr key={exp.id} className="hover:bg-[#FAF5FF] transition-colors">
                    <td className="p-3.5 font-mono text-[#1E1B2E]">
                      {exp.expenseDate}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-[#FAF5FF] text-[#8E2D9D] border border-[#C084FC]/40 text-[10px] font-bold">
                        {exp.category}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-[#1E1B2E]">{exp.description}</div>
                      <div className="text-[11px] text-[#8E2D9D]">{exp.vendorName}</div>
                      {exp.paidBy && <div className="text-[10px] text-[#817B91]">Paid from: {exp.paidBy}</div>}
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-[#1E1B2E]">{exp.paymentMode}</div>
                      {exp.referenceNumber && (
                        <div className="text-[10px] font-mono text-[#5F5A72]">{exp.referenceNumber}</div>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      {exp.gstApplicable && exp.gstAmount ? (
                        <div>
                          <span className="font-mono font-bold text-[#059669]">₹{exp.gstAmount.toLocaleString('en-IN')}</span>
                          <div className="text-[9px] text-[#817B91] font-mono">@{exp.gstRate || 18}% GST</div>
                        </div>
                      ) : (
                        <span className="text-[10px] text-[#817B91]">Non-GST</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right font-mono font-black text-[#1E1B2E] text-sm">
                      ₹{exp.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                        exp.status === 'paid'
                          ? 'bg-emerald-50 text-[#059669] border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {exp.status === 'paid' && <CheckCircle2 className="w-3 h-3" />}
                        <span>{exp.status}</span>
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => handleOpenEditModal(exp)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#5F5A72] hover:text-[#1E1B2E] border border-[#E8E0F0] cursor-pointer transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(exp.id, exp.description)}
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

      {/* Modal for Log / Edit Expense */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-[#E8E0F0] p-6 shadow-xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E0F0]">
              <h3 className="text-base font-bold text-[#1E1B2E] flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#8E2D9D]" />
                {editingExpense ? 'Edit Expense Record' : 'Log Operational Expense (OPEX)'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-[#817B91] hover:text-[#1E1B2E] hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#1E1B2E] font-bold mb-1">Expense Date *</label>
                  <input
                    type="date"
                    required
                    value={expenseDate}
                    onChange={e => setExpenseDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                  />
                </div>
                <div>
                  <label className="block text-[#1E1B2E] font-bold mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                  >
                    {EXPENSE_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#1E1B2E] font-bold mb-1">Description / Purpose *</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="e.g. Office high-speed leased line internet bill"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#1E1B2E] font-bold mb-1">Payee / Vendor Name *</label>
                  <input
                    type="text"
                    required
                    value={vendorName}
                    onChange={e => setVendorName(e.target.value)}
                    placeholder="e.g. Airtel Business / Google Workspace"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                  />
                </div>
                <div>
                  <label className="block text-[#1E1B2E] font-bold mb-1">Total Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    step="any"
                    value={amount}
                    onChange={e => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] font-mono font-bold outline-none focus:border-[#8E2D9D]"
                  />
                </div>
              </div>

              {/* GST Toggle Strip */}
              <div className="p-3 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-[#1E1B2E] font-bold">Includes GST in Amount?</span>
                  <input
                    type="checkbox"
                    checked={gstApplicable}
                    onChange={e => setGstApplicable(e.target.checked)}
                    className="rounded text-[#8E2D9D] focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                </label>
                {gstApplicable && (
                  <div className="flex items-center justify-between pt-2 border-t border-[#E8E0F0] text-[11px]">
                    <div className="text-[#5F5A72]">
                      Taxable: <span className="font-mono font-bold text-[#1E1B2E]">₹{calculatedTaxable.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-[#059669]">
                      GST (18%): <span className="font-mono font-bold">₹{calculatedGst.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#1E1B2E] font-bold mb-1">Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={e => setPaymentMode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                  >
                    <option value="UPI">UPI (Google Pay / PhonePe / PayTM)</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="Debit Card">Corporate Debit Card</option>
                    <option value="Credit Card">Corporate Credit Card</option>
                    <option value="Cash">Petty Cash</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#1E1B2E] font-bold mb-1">Transaction Ref / UTR</label>
                  <input
                    type="text"
                    value={referenceNumber}
                    onChange={e => setReferenceNumber(e.target.value)}
                    placeholder="e.g. UPI/123456789"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] font-mono outline-none focus:border-[#8E2D9D]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#E8E0F0]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#5F5A72] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#8E2D9D] hover:bg-[#732280] text-white font-bold shadow-xs cursor-pointer"
                >
                  {editingExpense ? 'Update Expense' : 'Save Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
