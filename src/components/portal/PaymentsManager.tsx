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
  Mail,
  Send,
  X,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCheck,
  ShieldCheck,
  Loader2,
  RefreshCw,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useApp } from '../../context/AppContext';
import { Payment, PaymentMethod } from '../../types';
import { generatePaymentReceiptPDF } from '../../utils/pdfGenerator';
import { sendPaymentReceiptEmailBackend } from '../../utils/emailService';

export const PaymentsManager: React.FC = () => {
  const { 
    payments, 
    invoices, 
    clients, 
    recordPayment, 
    updatePayment, 
    deletePayment, 
    agencyConfig,
    addAuditLog,
    currentUser
  } = useApp();

  const { success, error: toastError } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);
  const [paymentToDelete, setPaymentToDelete] = useState<Payment | null>(null);

  // Email Modal State
  const [emailModalReceipt, setEmailModalReceipt] = useState<Payment | null>(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailNotes, setEmailNotes] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSendSuccess, setEmailSendSuccess] = useState<string | null>(null);
  const [emailSendError, setEmailSendError] = useState<string | null>(null);
  const [confirmDuplicateSend, setConfirmDuplicateSend] = useState(false);

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

    const cli = clients.find(c => c.id === inv.clientId);

    recordPayment({
      invoiceId: inv.id,
      invoiceNumber: inv.invoiceNumber,
      clientId: inv.clientId,
      clientCompany: inv.clientCompany || inv.clientName,
      clientName: inv.clientName || inv.clientCompany,
      clientEmail: inv.clientEmail || cli?.email,
      amount: Number(amount),
      currency: inv.currency,
      paymentDate,
      paymentMethod,
      transactionReference: transactionRef || `TXN-${Date.now().toString().slice(-6)}`,
      notes,
      recordedBy: currentUser?.name || 'Accounts Dept'
    });

    setIsModalOpen(false);
    setSelectedInvoiceId('');
    setAmount(0);
    setTransactionRef('');
    setNotes('');
  };

  const handlePrintReceipt = (payment: Payment) => {
    const inv = invoices.find(i => i.id === payment.invoiceId || i.invoiceNumber === payment.invoiceNumber);
    const cli = clients.find(c => c.id === payment.clientId || c.name === payment.clientName || c.company === payment.clientName);
    generatePaymentReceiptPDF(payment, inv, cli, agencyConfig);
  };

  const handleOpenEmailModal = (payment: Payment) => {
    const inv = invoices.find(i => i.id === payment.invoiceId || i.invoiceNumber === payment.invoiceNumber);
    const cli = clients.find(c => c.id === payment.clientId || c.name === payment.clientName || c.company === payment.clientName);
    
    const detectedEmail = payment.clientEmail || inv?.clientEmail || cli?.email || '';
    setRecipientEmail(detectedEmail);
    setEmailSubject(`Payment Receipt: ${payment.receiptNumber} for Invoice ${payment.invoiceNumber} - ${agencyConfig.name || 'Fusion Forge Creation'}`);
    setEmailNotes(`Official payment acknowledgement of ₹${payment.amount.toLocaleString('en-IN')} received via ${(payment.paymentMethod || '').replace('_', ' ').toUpperCase()} on ${payment.paymentDate}.`);
    setEmailSendSuccess(null);
    setEmailSendError(null);
    setConfirmDuplicateSend(false);
    setEmailModalReceipt(payment);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailModalReceipt || !recipientEmail) return;

    // Accidental Duplicate Send Prevention Check
    const hasAlreadySent = emailModalReceipt.emailStatus?.status === 'sent' || emailModalReceipt.email_status === 'sent';
    if (hasAlreadySent && !confirmDuplicateSend) {
      setEmailSendError('Receipt was previously dispatched. Please check the confirmation checkbox to resend.');
      return;
    }

    setIsSendingEmail(true);
    setEmailSendSuccess(null);
    setEmailSendError(null);

    const inv = invoices.find(i => i.id === emailModalReceipt.invoiceId || i.invoiceNumber === emailModalReceipt.invoiceNumber);

    try {
      const result = await sendPaymentReceiptEmailBackend(
        emailModalReceipt,
        inv,
        recipientEmail,
        emailSubject,
        emailNotes,
        agencyConfig
      );

      if (result.success) {
        // Update AppContext and Supabase
        updatePayment(emailModalReceipt.id, {
          emailStatus: {
            status: 'sent',
            sent_at: result.timestamp,
            sentAt: result.timestamp,
            recipient: recipientEmail,
            messageId: result.messageId,
            sentBy: currentUser?.email || 'admin@fusionforgecreation.com'
          },
          email_status: 'sent',
          email_sent_at: result.timestamp,
          email_recipient: recipientEmail,
          email_message_id: result.messageId,
          email_error: undefined
        });

        // Add to audit trail
        addAuditLog({
          user_id: currentUser?.id || 'usr_admin',
          user_email: currentUser?.email || 'admin@fusionforgecreation.com',
          user_role: currentUser?.role || 'Super Admin',
          action: 'EMAIL_DISPATCH',
          table_name: 'payments',
          record_id: emailModalReceipt.id,
          details: `Dispatched Official Payment Receipt ${emailModalReceipt.receiptNumber} to ${recipientEmail} for ₹${emailModalReceipt.amount.toLocaleString('en-IN')}`
        });

        setEmailSendSuccess(`Receipt successfully dispatched to ${recipientEmail} (ID: ${result.messageId})`);
        
        // Refresh selectedReceipt view modal if open
        if (selectedReceipt && selectedReceipt.id === emailModalReceipt.id) {
          setSelectedReceipt({
            ...selectedReceipt,
            emailStatus: {
              status: 'sent',
              sent_at: result.timestamp,
              sentAt: result.timestamp,
              recipient: recipientEmail,
              messageId: result.messageId
            },
            email_status: 'sent',
            email_sent_at: result.timestamp,
            email_recipient: recipientEmail,
            email_message_id: result.messageId
          });
        }
      } else {
        setEmailSendError(result.error || 'Failed to dispatch email. Please verify recipient address and backend status.');
        
        updatePayment(emailModalReceipt.id, {
          emailStatus: {
            status: 'failed',
            recipient: recipientEmail,
            error: result.error,
            sent_at: result.timestamp
          },
          email_status: 'failed',
          email_error: result.error
        });
      }
    } catch (err: any) {
      setEmailSendError(err?.message || 'Unexpected network error during email dispatch.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const filteredPayments = payments.filter(p => {
    const matchesSearch = 
      p.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.clientCompany && p.clientCompany.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.transactionReference && p.transactionReference.toLowerCase().includes(searchTerm.toLowerCase()));
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
          <h1 className="text-2xl font-bold text-[#1E1B2E] flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-[#8E2D9D]" />
            Payments & Receipts
          </h1>
          <p className="text-sm text-[#5F5A72]">
            Track customer payments, reconcile against GST invoices, and issue digital receipts with print & official email dispatch.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#8E2D9D] hover:bg-[#6F42C1] text-white font-semibold text-xs flex items-center space-x-2 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Record Payment</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#E8E0F0] shadow-xs">
          <div className="text-xs text-[#5F5A72] font-semibold mb-1">Total Collections</div>
          <div className="text-2xl font-black text-[#1E1B2E]">₹{totalCollected.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-[#059669] flex items-center gap-1 mt-1 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> {payments.length} verified transactions
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E8E0F0] shadow-xs">
          <div className="text-xs text-[#5F5A72] font-semibold mb-1">NEFT / RTGS / IMPS</div>
          <div className="text-2xl font-black text-[#8E2D9D]">₹{bankTransferTotal.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-[#5F5A72] mt-1 font-medium">
            Direct Corporate Settlements
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E8E0F0] shadow-xs">
          <div className="text-xs text-[#5F5A72] font-semibold mb-1">UPI & Instant Gateway</div>
          <div className="text-2xl font-black text-[#6F42C1]">₹{upiTotal.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-[#5F5A72] mt-1 font-medium">
            Virtual Payment Address (VPA)
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#817B91]" />
          <input
            type="text"
            placeholder="Search by receipt #, client, invoice #, transaction ref..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] placeholder:text-[#817B91] focus:outline-none focus:border-[#8E2D9D]"
          />
        </div>
        <select
          value={methodFilter}
          onChange={e => setMethodFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D]"
        >
          <option value="all">All Payment Methods</option>
          <option value="bank_transfer">Bank Transfer (NEFT/RTGS)</option>
          <option value="upi">UPI / QR Code</option>
          <option value="credit_card">Credit / Debit Card</option>
          <option value="cash">Cash Settlement</option>
          <option value="cheque">Cheque / Demand Draft</option>
        </select>
      </div>

      {/* Payments Table */}
      <div className="rounded-xl border border-[#E8E0F0] bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8FF] text-[#5F5A72] font-semibold border-b border-[#E8E0F0]">
              <tr>
                <th className="p-3.5">Receipt #</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Client & Invoice</th>
                <th className="p-3.5">Method</th>
                <th className="p-3.5">Transaction Ref</th>
                <th className="p-3.5 text-right">Amount</th>
                <th className="p-3.5 text-center">Email Status</th>
                <th className="p-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E0F0]">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#817B91]">
                    No payment records found. Record a payment above to populate the ledger.
                  </td>
                </tr>
              ) : (
                filteredPayments.map(payment => {
                  const isEmailed = payment.emailStatus?.status === 'sent' || payment.email_status === 'sent';
                  const emailRecipient = payment.emailStatus?.recipient || payment.email_recipient;

                  return (
                    <tr key={payment.id} className="hover:bg-[#FAF8FF] transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-[#1E1B2E] font-mono">{payment.receiptNumber}</div>
                        <div className="text-[10px] text-[#817B91]">{payment.recordedBy || 'Accounts'}</div>
                      </td>
                      <td className="p-3.5 text-[#5F5A72]">{payment.paymentDate}</td>
                      <td className="p-3.5">
                        <div className="font-semibold text-[#1E1B2E]">{payment.clientName}</div>
                        <div className="text-[11px] text-[#8E2D9D] font-mono font-bold">{payment.invoiceNumber}</div>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          payment.paymentMethod === 'bank_transfer'
                            ? 'bg-[#FAF5FF] text-[#8E2D9D] border border-[#C084FC]'
                            : payment.paymentMethod === 'upi'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : payment.paymentMethod === 'cash'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : payment.paymentMethod === 'cheque'
                            ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                            : payment.paymentMethod === 'credit_card'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {payment.paymentMethod.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3.5 text-[#5F5A72] font-mono text-[11px]">
                        {payment.transactionReference || payment.transactionRef || 'DIRECT'}
                      </td>
                      <td className="p-3.5 text-right font-bold text-[#059669] text-sm">
                        ₹{payment.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5 text-center">
                        {isEmailed ? (
                          <span 
                            title={`Sent to ${emailRecipient || 'Client'}`}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#059669] text-[10px] font-medium"
                          >
                            <CheckCheck className="w-3 h-3" /> Emailed
                          </span>
                        ) : payment.emailStatus?.status === 'failed' || payment.email_status === 'failed' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-medium">
                            <AlertCircle className="w-3 h-3" /> Failed
                          </span>
                        ) : (
                          <span className="text-[#817B91] text-[10px]">Unsent</span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* View Modal Trigger */}
                          <button
                            onClick={() => setSelectedReceipt(payment)}
                            title="View Receipt"
                            className="p-1.5 rounded-lg bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#8E2D9D] border border-[#E8E0F0] transition-colors cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#8E2D9D]" />
                          </button>

                          {/* Print PDF Trigger */}
                          <button
                            onClick={() => handlePrintReceipt(payment)}
                            title="Print Official PDF Receipt"
                            className="p-1.5 rounded-lg bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#6F42C1] border border-[#E8E0F0] transition-colors cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5 text-[#6F42C1]" />
                          </button>

                          {/* Email Receipt Trigger */}
                          <button
                            onClick={() => handleOpenEmailModal(payment)}
                            title="Email Receipt to Client"
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer border ${
                              isEmailed 
                                ? 'bg-emerald-50 text-[#059669] hover:bg-emerald-100 border-emerald-200' 
                                : 'bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#8E2D9D] border-[#E8E0F0]'
                            }`}
                          >
                            <Mail className="w-3.5 h-3.5 text-[#8E2D9D]" />
                          </button>

                          {/* Delete Payment Receipt Trigger */}
                          {currentUser.role === 'super_admin' && (
                            <button
                              onClick={() => setPaymentToDelete(payment)}
                              title="Delete Payment Receipt"
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
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

      {/* Record Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-[#E8E0F0] rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[#817B91] hover:text-[#1E1B2E] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-[#1E1B2E] mb-1 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[#8E2D9D]" />
              Record Client Payment
            </h2>
            <p className="text-xs text-[#5F5A72] mb-5">
              Enter received funds to automatically reconcile invoice balances.
            </p>

            <form onSubmit={handleCreatePayment} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">Select Invoice</label>
                <select
                  required
                  value={selectedInvoiceId}
                  onChange={e => handleInvoiceSelect(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D] focus:bg-white"
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
                  <label className="block text-[#1E1B2E] font-semibold mb-1">Amount Received (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={amount || ''}
                    onChange={e => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D] focus:bg-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[#1E1B2E] font-semibold mb-1">Payment Date</label>
                  <input
                    type="date"
                    required
                    value={paymentDate}
                    onChange={e => setPaymentDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1E1B2E] font-semibold mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D] focus:bg-white"
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
                  <label className="block text-[#1E1B2E] font-semibold mb-1">Transaction Ref / UTR</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UTR192837465"
                    value={transactionRef}
                    onChange={e => setTransactionRef(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D] focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">Notes / Remarks</label>
                <input
                  type="text"
                  placeholder="e.g. Milestone 1 settlement"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D] focus:bg-white"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-[#E8E0F0]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#5F5A72] font-semibold border border-[#E8E0F0] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#8E2D9D] hover:bg-[#6F42C1] text-white font-semibold shadow-xs cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-[#E8E0F0] rounded-2xl shadow-2xl p-6 relative text-[#1E1B2E] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 text-[#817B91] hover:text-[#1E1B2E] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Receipt Document Header */}
            <div className="text-center pb-4 border-b border-[#E8E0F0]">
              <div className="font-black text-sm uppercase tracking-wider text-[#8E2D9D]">
                {agencyConfig.name}
              </div>
              <div className="text-[11px] text-[#5F5A72]">{agencyConfig.legalName}</div>
              <div className="text-[10px] text-[#817B91]">GSTIN: {agencyConfig.gstin} • SAC: {agencyConfig.sacCode}</div>
              <div className="mt-3 inline-block px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#059669] font-bold text-xs">
                OFFICIAL PAYMENT RECEIPT
              </div>
            </div>

            <div className="py-4 space-y-3 text-xs border-b border-[#E8E0F0]">
              <div className="flex justify-between">
                <span className="text-[#5F5A72]">Receipt Number:</span>
                <span className="font-mono font-bold text-[#1E1B2E]">{selectedReceipt.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F5A72]">Date of Payment:</span>
                <span className="text-[#1E1B2E] font-medium">{selectedReceipt.paymentDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F5A72]">Received From:</span>
                <span className="font-semibold text-[#1E1B2E]">{selectedReceipt.clientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F5A72]">Settled Invoice:</span>
                <span className="font-mono font-bold text-[#8E2D9D]">{selectedReceipt.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F5A72]">Payment Mode:</span>
                <span className="text-[#1E1B2E] capitalize font-medium">{selectedReceipt.paymentMethod.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F5A72]">Transaction Reference:</span>
                <span className="font-mono text-[#1E1B2E]">{selectedReceipt.transactionReference || selectedReceipt.transactionRef || 'DIRECT'}</span>
              </div>
              {selectedReceipt.notes && (
                <div className="flex justify-between">
                  <span className="text-[#5F5A72]">Remarks:</span>
                  <span className="text-[#1E1B2E] text-right">{selectedReceipt.notes}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-[#E8E0F0] items-center">
                <span className="text-sm font-bold text-[#1E1B2E]">Amount Received:</span>
                <span className="text-lg font-black text-[#059669]">
                  ₹{selectedReceipt.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Email Dispatch Audit Info if dispatched */}
            {(selectedReceipt.emailStatus?.status === 'sent' || selectedReceipt.email_status === 'sent') && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                <div className="flex items-center gap-1.5 text-[#059669] font-semibold mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Email Dispatched & Logged</span>
                </div>
                <div className="text-[11px] text-[#5F5A72] space-y-0.5">
                  <div>Recipient: <strong className="text-[#1E1B2E]">{selectedReceipt.emailStatus?.recipient || selectedReceipt.email_recipient}</strong></div>
                  <div>Timestamp: <strong className="text-[#1E1B2E]">{selectedReceipt.emailStatus?.sent_at || selectedReceipt.email_sent_at}</strong></div>
                  {(selectedReceipt.emailStatus?.messageId || selectedReceipt.email_message_id) && (
                    <div className="font-mono text-[10px] text-[#817B91]">ID: {selectedReceipt.emailStatus?.messageId || selectedReceipt.email_message_id}</div>
                  )}
                </div>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between gap-3 text-[11px]">
              <span className="text-[#817B91] hidden sm:inline">Authorized Signatory • Accounts</span>
              
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {/* Email Receipt Button */}
                <button
                  onClick={() => {
                    handleOpenEmailModal(selectedReceipt);
                  }}
                  className="px-3 py-2 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#8E2D9D] border border-[#E8E0F0] font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" /> Email Receipt
                </button>

                {/* Print Receipt Button */}
                <button
                  onClick={() => handlePrintReceipt(selectedReceipt)}
                  className="px-3.5 py-2 rounded-xl bg-[#8E2D9D] hover:bg-[#6F42C1] text-white font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Receipt Modal */}
      {emailModalReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-[#E8E0F0] rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEmailModalReceipt(null)}
              className="absolute top-4 right-4 text-[#817B91] hover:text-[#1E1B2E] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-lg bg-[#FAF5FF] border border-[#E8E0F0] flex items-center justify-center text-[#8E2D9D]">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#1E1B2E]">Email Payment Receipt</h2>
                <p className="text-xs text-[#5F5A72]">Dispatch official verified PDF receipt via official agency email.</p>
              </div>
            </div>

            {/* Official Sender & Verification Info */}
            <div className="mt-4 p-3 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-xs space-y-1.5">
              <div className="flex justify-between items-center text-[#5F5A72]">
                <span>Official Sender:</span>
                <span className="font-semibold text-[#8E2D9D] flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
                  {agencyConfig.email || 'admin@fusionforgecreation.com'}
                </span>
              </div>
              <div className="flex justify-between items-center text-[#5F5A72]">
                <span>Receipt Number:</span>
                <span className="font-mono font-bold text-[#1E1B2E]">{emailModalReceipt.receiptNumber}</span>
              </div>
              <div className="flex justify-between items-center text-[#5F5A72]">
                <span>Amount Acknowledged:</span>
                <span className="font-bold text-[#059669]">₹{emailModalReceipt.amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Duplicate Accidental Send Warning Banner */}
            {(emailModalReceipt.emailStatus?.status === 'sent' || emailModalReceipt.email_status === 'sent') && (
              <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-amber-800">Receipt Already Emailed</div>
                    <div className="text-[11px] text-amber-700 mt-0.5">
                      This receipt was dispatched to <strong>{emailModalReceipt.emailStatus?.recipient || emailModalReceipt.email_recipient}</strong> on {emailModalReceipt.emailStatus?.sent_at || emailModalReceipt.email_sent_at}.
                    </div>
                  </div>
                </div>

                <label className="mt-3 flex items-center gap-2 pt-2 border-t border-amber-200 text-xs cursor-pointer select-none text-amber-900 font-medium">
                  <input
                    type="checkbox"
                    checked={confirmDuplicateSend}
                    onChange={e => setConfirmDuplicateSend(e.target.checked)}
                    className="rounded border-amber-400 text-[#8E2D9D] focus:ring-[#8E2D9D] w-4 h-4"
                  />
                  <span>Confirm: I want to send another copy to this client.</span>
                </label>
              </div>
            )}

            {/* Success Message Banner */}
            {emailSendSuccess && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                <span>{emailSendSuccess}</span>
              </div>
            )}

            {/* Error Message Banner */}
            {emailSendError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{emailSendError}</span>
              </div>
            )}

            <form onSubmit={handleSendEmail} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">
                  Recipient Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. client@company.com"
                  value={recipientEmail}
                  onChange={e => setRecipientEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D] focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">Email Subject</label>
                <input
                  type="text"
                  required
                  value={emailSubject}
                  onChange={e => setEmailSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">Custom Message / Notes</label>
                <textarea
                  rows={2}
                  value={emailNotes}
                  onChange={e => setEmailNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D] focus:bg-white resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-[#E8E0F0]">
                <button
                  type="button"
                  onClick={() => setEmailModalReceipt(null)}
                  className="px-4 py-2 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#5F5A72] font-semibold border border-[#E8E0F0] cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isSendingEmail || ((emailModalReceipt.emailStatus?.status === 'sent' || emailModalReceipt.email_status === 'sent') && !confirmDuplicateSend)}
                  className={`px-5 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
                    isSendingEmail || ((emailModalReceipt.emailStatus?.status === 'sent' || emailModalReceipt.email_status === 'sent') && !confirmDuplicateSend)
                      ? 'bg-[#FAF5FF] text-[#817B91] border border-[#E8E0F0] cursor-not-allowed'
                      : 'bg-[#8E2D9D] hover:bg-[#6F42C1] text-white shadow-xs'
                  }`}
                >
                  {isSendingEmail ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Dispatching...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{(emailModalReceipt.emailStatus?.status === 'sent' || emailModalReceipt.email_status === 'sent') ? 'Resend Receipt' : 'Send Official Receipt'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Payment Confirmation Modal */}
      {paymentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-red-200 rounded-3xl shadow-2xl p-6 relative text-[#1E1B2E]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-2xl bg-red-50 text-red-600 border border-red-200">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1E1B2E]">Delete Payment Receipt</h2>
                <p className="text-xs text-red-600 font-semibold">Confirm payment record removal</p>
              </div>
            </div>

            <p className="text-xs text-[#5F5A72] mb-4 leading-relaxed">
              Are you sure you want to delete payment receipt <strong className="text-[#1E1B2E]">{paymentToDelete.receiptNumber}</strong> of <strong className="text-emerald-700 font-bold">₹{paymentToDelete.amount.toLocaleString('en-IN')}</strong> from <strong className="text-[#1E1B2E]">{paymentToDelete.clientName}</strong>?
              This will automatically recalculate the associated invoice balance due.
            </p>

            <div className="pt-3 border-t border-[#E8E0F0] flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setPaymentToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#5F5A72] font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deletePayment(paymentToDelete.id);
                  success('Payment Deleted', `Receipt ${paymentToDelete.receiptNumber} was successfully removed.`);
                  setPaymentToDelete(null);
                }}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
