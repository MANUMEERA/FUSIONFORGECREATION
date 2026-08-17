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
        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/50 via-slate-900 to-slate-900 border border-rose-500/25">
          <div className="text-xs text-rose-300 font-semibold mb-1">Total Operating Expenses (OPEX)</div>
          <div className="text-2xl font-black text-white font-mono">₹{totalExpenseAmount.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-slate-400 mt-1">{expenses.length} logged expense entries</div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-900 border border-indigo-500/25">
          <div className="text-xs text-indigo-300 font-semibold mb-1">GST Paid on Expenses</div>
          <div className="text-2xl font-black text-indigo-400 font-mono">₹{totalGstPaidOnExpenses.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-slate-400 mt-1">Available for input tax adjustments</div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/50 via-slate-900 to-slate-900 border border-cyan-500/25">
          <div className="text-xs text-cyan-300 font-semibold mb-1">Settled / Paid Vouchers</div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {expenses.filter(e => e.status === 'paid').length} / {expenses.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">100% reconciled digital payments</div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search expenses by vendor, description, reference..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-400 outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-200 outline-none focus:border-cyan-400 cursor-pointer"
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
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Expense</span>
        </button>
      </div>

      {/* Expenses Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/70 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-[10px]">
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
            <tbody className="divide-y divide-slate-800/60">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No expense records found.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map(exp => (
                  <tr key={exp.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-mono text-slate-300">
                      {exp.expenseDate}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] font-bold">
                        {exp.category}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-white">{exp.description}</div>
                      <div className="text-[11px] text-cyan-400">{exp.vendorName}</div>
                      {exp.paidBy && <div className="text-[10px] text-slate-500">Paid from: {exp.paidBy}</div>}
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-200">{exp.paymentMode}</div>
                      {exp.referenceNumber && (
                        <div className="text-[10px] font-mono text-slate-400">{exp.referenceNumber}</div>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      {exp.gstApplicable && exp.gstAmount ? (
                        <div>
                          <span className="font-mono font-bold text-emerald-400">₹{exp.gstAmount.toLocaleString('en-IN')}</span>
                          <div className="text-[9px] text-slate-400 font-mono">@{exp.gstRate || 18}% GST</div>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500">Non-GST</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right font-mono font-black text-white text-sm">
                      ₹{exp.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                        exp.status === 'paid'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {exp.status === 'paid' && <CheckCircle2 className="w-3 h-3" />}
                        <span>{exp.status}</span>
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => handleOpenEditModal(exp)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(exp.id, exp.description)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 cursor-pointer transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-cyan-400" />
                {editingExpense ? 'Edit Expense Record' : 'Log Operational Expense (OPEX)'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Expense Date *</label>
                  <input
                    type="date"
                    required
                    value={expenseDate}
                    onChange={e => setExpenseDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-400"
                  >
                    {EXPENSE_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Description / Purpose *</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="e.g. Office high-speed leased line internet bill"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Payee / Vendor Name *</label>
                  <input
                    type="text"
                    required
                    value={vendorName}
                    onChange={e => setVendorName(e.target.value)}
                    placeholder="e.g. Airtel Business / Google Workspace"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Total Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    step="any"
                    value={amount}
                    onChange={e => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono font-bold outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* GST Toggle Strip */}
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300 font-bold">Includes GST in Amount?</span>
                  <input
                    type="checkbox"
                    checked={gstApplicable}
                    onChange={e => setGstApplicable(e.target.checked)}
                    className="rounded text-cyan-500 focus:ring-0 w-4 h-4"
                  />
                </label>
                {gstApplicable && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-700 text-[11px]">
                    <div className="text-slate-400">
                      Taxable: <span className="font-mono font-bold text-white">₹{calculatedTaxable.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-emerald-400">
                      GST (18%): <span className="font-mono font-bold">₹{calculatedGst.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={e => setPaymentMode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-400"
                  >
                    <option value="UPI">UPI (Google Pay / PhonePe / PayTM)</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="Debit Card">Corporate Debit Card</option>
                    <option value="Credit Card">Corporate Credit Card</option>
                    <option value="Cash">Petty Cash</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Transaction Ref / UTR</label>
                  <input
                    type="text"
                    value={referenceNumber}
                    onChange={e => setReferenceNumber(e.target.value)}
                    placeholder="e.g. UPI/123456789"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-500/20"
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
