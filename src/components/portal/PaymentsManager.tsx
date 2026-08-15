import React, { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  FileText, 
  CheckCircle2, 
  ArrowUpRight, 
  Building2, 
  Receipt,
  Printer,
  X,
  Clock,
  DollarSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Payment, PaymentMethod } from '../../types';

export const PaymentsManager: React.FC = () => {
  const { payments, invoices, clients, recordPayment, deletePayment, agencyConfig } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);

  // Form State for new payment
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank_transfer');
  const [transactionRef, setTransactionRef] = useState('');
  const [notes, setNotes] = useState('');

  const unpaidInvoices = invoices.filter(inv => inv.balanceDue > 0);

  const handleInvoiceSelect = (invId: string) => {
    setSelectedInvoiceId(invId);
    const inv = invoices.find(i => i.id === invId);
    if (inv) {
      setAmount(inv.balanceDue);
    }
  };

  const handleCreatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const inv = invoices.find(i => i.id === selectedInvoiceId);
    if (!inv || amount <= 0) return;

    recordPayment({
      invoiceId: inv.id,
      invoiceNumber: inv.invoiceNumber,
      clientId: inv.clientId,
      clientName: inv.clientCompany || inv.clientName,
      amount: Number(amount),
      currency: inv.currency,
      paymentDate,
      paymentMethod,
      transactionReference: transactionRef || `TXN-${Date.now().toString().slice(-6)}`,
      notes,
      recordedBy: 'Accounts Dept'
    });

    setIsModalOpen(false);
    setSelectedInvoiceId('');
    setAmount(0);
    setTransactionRef('');
    setNotes('');
  };

  const filteredPayments = payments.filter(p => {
    const matchesSearch = 
      p.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.transactionReference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = methodFilter === 'all' || p.paymentMethod === methodFilter;
    return matchesSearch && matchesMethod;
  });

  const totalCollected = payments.reduce((acc, p) => acc + p.amount, 0);
  const bankTransferTotal = payments.filter(p => p.paymentMethod === 'bank_transfer').reduce((acc, p) => acc + p.amount, 0);
  const upiTotal = payments.filter(p => p.paymentMethod === 'upi').reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-blue-400" />
            Payments & Receipts
          </h1>
          <p className="text-sm text-slate-400">
            Track customer payments, reconcile against GST invoices, and issue digital receipts.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-2 transition-all shadow-lg shadow-blue-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Record Payment</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="text-xs text-slate-400 font-medium mb-1">Total Collections</div>
          <div className="text-2xl font-black text-white">₹{totalCollected.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> {payments.length} verified transactions
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="text-xs text-slate-400 font-medium mb-1">NEFT / RTGS / IMPS</div>
          <div className="text-2xl font-black text-cyan-400">₹{bankTransferTotal.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">
            Direct Corporate Settlements
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="text-xs text-slate-400 font-medium mb-1">UPI & Instant Gateway</div>
          <div className="text-2xl font-black text-purple-400">₹{upiTotal.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">
            Virtual Payment Address (VPA)
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by receipt #, client, invoice #, transaction ref..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={methodFilter}
          onChange={e => setMethodFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Payment Methods</option>
          <option value="bank_transfer">Bank Transfer (NEFT/RTGS)</option>
          <option value="upi">UPI / QR Code</option>
          <option value="credit_card">Credit / Debit Card</option>
        </select>
      </div>

      {/* Payments Table */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/50 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Receipt #</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Client & Invoice</th>
                <th className="p-3.5">Method</th>
                <th className="p-3.5">Transaction Ref</th>
                <th className="p-3.5 text-right">Amount</th>
                <th className="p-3.5 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No payment records found. Record a payment above to populate the ledger.
                  </td>
                </tr>
              ) : (
                filteredPayments.map(payment => (
                  <tr key={payment.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5 font-bold text-white font-mono">{payment.receiptNumber}</td>
                    <td className="p-3.5 text-slate-300">{payment.paymentDate}</td>
                    <td className="p-3.5">
                      <div className="font-semibold text-white">{payment.clientName}</div>
                      <div className="text-[11px] text-blue-400 font-mono">{payment.invoiceNumber}</div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        payment.paymentMethod === 'bank_transfer'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : payment.paymentMethod === 'upi'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          : payment.paymentMethod === 'cash'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : payment.paymentMethod === 'cheque'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                          : payment.paymentMethod === 'credit_card'
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {payment.paymentMethod.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-300 font-mono text-[11px]">
                      {payment.transactionReference}
                    </td>
                    <td className="p-3.5 text-right font-bold text-emerald-400 text-sm">
                      ₹{payment.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => setSelectedReceipt(payment)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-[11px] font-medium inline-flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0d1527] border border-slate-700 rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-blue-400" />
              Record Client Payment
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              Enter received funds to automatically reconcile invoice balances.
            </p>

            <form onSubmit={handleCreatePayment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Invoice</label>
                <select
                  required
                  value={selectedInvoiceId}
                  onChange={e => handleInvoiceSelect(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500"
                >
                  <option value="">-- Choose Pending Invoice --</option>
                  {invoices.map(inv => (
                    <option key={inv.id} value={inv.id}>
                      {inv.invoiceNumber} • {inv.clientCompany || inv.clientName} (Due: ₹{inv.balanceDue.toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Amount Received (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={amount || ''}
                    onChange={e => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Payment Date</label>
                  <input
                    type="date"
                    required
                    value={paymentDate}
                    onChange={e => setPaymentDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500"
                  >
                    <option value="bank_transfer">Bank Transfer (NEFT / RTGS / IMPS)</option>
                    <option value="upi">UPI (GPay / PhonePe / QR)</option>
                    <option value="cash">Cash Payment</option>
                    <option value="cheque">Cheque (Demand Draft)</option>
                    <option value="credit_card">Credit / Debit Card</option>
                    <option value="other">Other Settlement Mode</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Transaction Ref / UTR</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UTR192837465"
                    value={transactionRef}
                    onChange={e => setTransactionRef(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notes / Remarks</label>
                <input
                  type="text"
                  placeholder="e.g. Milestone 1 settlement"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30"
                >
                  Save & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Digital Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0b1220] border border-slate-700 rounded-2xl shadow-2xl p-6 relative text-slate-100">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Receipt Document Header */}
            <div className="text-center pb-4 border-b border-slate-800">
              <div className="font-black text-sm uppercase tracking-wider text-blue-400">
                {agencyConfig.name}
              </div>
              <div className="text-[11px] text-slate-400">{agencyConfig.legalName}</div>
              <div className="text-[10px] text-slate-400">GSTIN: {agencyConfig.gstin} • SAC: {agencyConfig.sacCode}</div>
              <div className="mt-3 inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs">
                OFFICIAL PAYMENT RECEIPT
              </div>
            </div>

            <div className="py-4 space-y-3 text-xs border-b border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Receipt Number:</span>
                <span className="font-mono font-bold text-white">{selectedReceipt.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date of Payment:</span>
                <span className="text-white">{selectedReceipt.paymentDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Received From:</span>
                <span className="font-semibold text-white">{selectedReceipt.clientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Settled Invoice:</span>
                <span className="font-mono text-blue-400">{selectedReceipt.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Mode:</span>
                <span className="text-white capitalize">{selectedReceipt.paymentMethod.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Transaction Reference:</span>
                <span className="font-mono text-slate-300">{selectedReceipt.transactionReference}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800/80 items-center">
                <span className="text-sm font-bold text-white">Amount Received:</span>
                <span className="text-lg font-black text-emerald-400">
                  ₹{selectedReceipt.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between text-[11px] text-slate-500">
              <span>Authorized Signature • Accounts Dept</span>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
