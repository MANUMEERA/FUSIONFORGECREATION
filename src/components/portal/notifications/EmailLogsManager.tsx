import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { EmailLog } from '../../../types';
import { 
  Mail, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink, 
  Send, 
  AlertCircle, 
  RefreshCw, 
  ShieldCheck, 
  FileText, 
  Receipt, 
  CreditCard, 
  FolderKanban,
  Database,
  Check,
  Copy,
  Info
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export const EmailLogsManager: React.FC = () => {
  const { emailLogs, sendInvoiceEmail, sendQuotationEmail, invoices, quotations, agencyConfig } = useApp();
  const { success, error: toastError, info } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<EmailLog | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Test dispatch modal state
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testEmailRecipient, setTestEmailRecipient] = useState('');
  const [testEmailSubject, setTestEmailSubject] = useState('Fusion Forge Creation — Official Test Relay');
  const [testEmailBody, setTestEmailBody] = useState('This is an authoritative test dispatch from Fusion Forge Creation central notification & email engine.');
  const [isSendingTest, setIsSendingTest] = useState(false);

  // Filtered Email Logs
  const filteredLogs = useMemo(() => {
    return emailLogs.filter(log => {
      if (selectedStatus !== 'all' && log.status !== selectedStatus) return false;
      if (selectedCategory !== 'all' && log.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const recipientMatch = log.recipient.toLowerCase().includes(q);
        const subjectMatch = log.subject.toLowerCase().includes(q);
        const senderMatch = log.sender.toLowerCase().includes(q);
        const idMatch = log.id.toLowerCase().includes(q);
        return recipientMatch || subjectMatch || senderMatch || idMatch;
      }
      return true;
    });
  }, [emailLogs, selectedStatus, selectedCategory, searchQuery]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    success('Copied', 'Message ID copied to clipboard.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailRecipient || !testEmailRecipient.includes('@')) {
      toastError('Invalid Recipient', 'Please provide a valid destination email address.');
      return;
    }

    setIsSendingTest(true);
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: testEmailRecipient,
          subject: testEmailSubject,
          html: `<div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
            <h2 style="color: #2563eb;">Fusion Forge Creation — Notification Relay</h2>
            <p>${testEmailBody}</p>
            <hr style="border: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="font-size: 12px; color: #64748b;">Official Agency Sender: <strong>admin@fusionforgecreation.com</strong></p>
          </div>`,
          category: 'test'
        })
      });

      const data = await res.json();
      if (data.success) {
        success('Email Dispatched', `Test email dispatched to ${testEmailRecipient}.`);
        setIsTestModalOpen(false);
        setTestEmailRecipient('');
      } else {
        toastError('Delivery Failed', data.error || 'Could not dispatch test email.');
      }
    } catch (err: any) {
      toastError('Dispatch Error', err.message || 'Network error occurred while contacting email relay.');
    } finally {
      setIsSendingTest(false);
    }
  };

  const getStatusBadge = (status: EmailLog['status']) => {
    switch (status) {
      case 'sent':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Delivered
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3 mr-1 animate-spin" />
            Queued
          </span>
        );
      default:
        return null;
    }
  };

  const getCategoryBadge = (cat: EmailLog['category']) => {
    switch (cat) {
      case 'invoice':
        return <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-cyan-900/40 text-cyan-300 border border-cyan-500/30">Tax Invoice</span>;
      case 'quotation':
        return <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-900/40 text-blue-300 border border-blue-500/30">Quotation</span>;
      case 'payment_receipt':
        return <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-900/40 text-emerald-300 border border-emerald-500/30">Payment Receipt</span>;
      case 'project_status':
        return <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-purple-900/40 text-purple-300 border border-purple-500/30">Project Alert</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">General</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-white border border-[#E8E0F0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-[#F3E8FF] border border-[#E8E0F0] text-[#8E2D9D] shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1E1B2E] tracking-tight">Central Email Dispatch & Audit Logs</h2>
            <p className="text-xs text-[#5F5A72] mt-0.5">
              Official Agency Sender: <span className="font-mono text-[#8E2D9D] font-semibold">admin@fusionforgecreation.com</span> • Stored in Supabase
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsTestModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#8E2D9D] hover:bg-[#6F42C1] text-white font-semibold text-xs shadow-md flex items-center space-x-2 cursor-pointer transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Send Test Relay Email</span>
          </button>
        </div>
      </div>

      {/* Filter and Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#E8E0F0] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#5F5A72] font-semibold">Total Dispatched</span>
            <Mail className="w-4 h-4 text-[#8E2D9D]" />
          </div>
          <div className="text-2xl font-bold text-[#1E1B2E] mt-1">{emailLogs.length}</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E8E0F0] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#5F5A72] font-semibold">Delivered Successfully</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {emailLogs.filter(e => e.status === 'sent').length}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E8E0F0] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#5F5A72] font-semibold">Failed Attempts</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-1">
            {emailLogs.filter(e => e.status === 'failed').length}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E8E0F0] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#5F5A72] font-semibold">Audited Categories</span>
            <Database className="w-4 h-4 text-[#6F42C1]" />
          </div>
          <div className="text-2xl font-bold text-[#6F42C1] mt-1">4 Types</div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="p-4 rounded-2xl bg-white border border-[#E8E0F0] flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#817B91] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by recipient, subject, or message ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] placeholder-[#817B91] focus:outline-none focus:border-[#8E2D9D] focus:ring-1 focus:ring-[#8E2D9D] transition-all"
          />
        </div>

        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D] cursor-pointer"
          >
            <option value="all">All Delivery Statuses</option>
            <option value="sent">Delivered (Sent)</option>
            <option value="failed">Failed / Bounced</option>
            <option value="pending">Pending Queue</option>
          </select>

          {/* Category filter */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D] cursor-pointer"
          >
            <option value="all">All Email Categories</option>
            <option value="invoice">Tax Invoices</option>
            <option value="quotation">Quotations & Scopes</option>
            <option value="payment_receipt">Payment Receipts</option>
            <option value="project_status">Project Alerts</option>
            <option value="general">General / Other</option>
          </select>
        </div>
      </div>

      {/* Email Logs Table */}
      <div className="rounded-2xl bg-white border border-[#E8E0F0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs text-[#1E1B2E]">
            <thead className="bg-[#FAF5FF] border-b border-[#E8E0F0] text-[#5F5A72] uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Delivery Status</th>
                <th className="py-3.5 px-4">Recipient Email</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Subject & Details</th>
                <th className="py-3.5 px-4">Dispatched At</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E0F0] font-medium">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#817B91]">
                    <Mail className="w-8 h-8 text-[#817B91] mx-auto mb-2" />
                    <p className="font-semibold text-[#1E1B2E]">No email logs matching current filters</p>
                    <p className="text-[11px] text-[#817B91] mt-1">Dispatches from invoice, quote, or project updates will appear here.</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-[#FAF5FF] transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getStatusBadge(log.status)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-bold text-[#1E1B2E]">{log.recipient}</div>
                      <div className="text-[10px] text-[#817B91]">From: {log.sender}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getCategoryBadge(log.category)}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate">
                      <div className="text-[#1E1B2E] font-semibold truncate">{log.subject}</div>
                      {log.error_message && (
                        <div className="text-[10px] text-rose-600 truncate flex items-center space-x-1 mt-0.5">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{log.error_message}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-[11px] text-[#5F5A72]">
                      <div>{new Date(log.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                      <div className="text-[10px] text-[#817B91]">{new Date(log.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="px-2.5 py-1 rounded-lg bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#8E2D9D] font-semibold text-xs border border-[#E8E0F0] transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Log Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-[#E8E0F0] rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 text-[#1E1B2E]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E0F0]">
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-[#8E2D9D]" />
                <h3 className="text-base font-bold text-[#1E1B2E]">Email Dispatch Audit Record</h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-lg text-[#817B91] hover:text-[#1E1B2E] hover:bg-[#FAF5FF] transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0]">
                <span className="text-[#5F5A72]">Delivery Status:</span>
                <div>{getStatusBadge(selectedLog.status)}</div>
              </div>

              <div>
                <label className="text-[10px] text-[#817B91] uppercase font-bold tracking-wider">Subject Line</label>
                <div className="p-2.5 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] font-semibold text-[#1E1B2E] mt-1">
                  {selectedLog.subject}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-[#817B91] uppercase font-bold tracking-wider">Recipient</label>
                  <div className="p-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-[#1E1B2E] font-mono mt-1 truncate">
                    {selectedLog.recipient}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-[#817B91] uppercase font-bold tracking-wider">Official Sender</label>
                  <div className="p-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-[#1E1B2E] font-mono mt-1 truncate">
                    {selectedLog.sender}
                  </div>
                </div>
              </div>

              {selectedLog.message_id && (
                <div>
                  <label className="text-[10px] text-[#817B91] uppercase font-bold tracking-wider">Relay Message ID</label>
                  <div className="p-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] font-mono text-[#8E2D9D] text-[11px] mt-1 flex items-center justify-between">
                    <span className="truncate">{selectedLog.message_id}</span>
                    <button
                      onClick={() => handleCopy(selectedLog.message_id!, selectedLog.id)}
                      className="p-1 text-[#817B91] hover:text-[#1E1B2E]"
                      title="Copy Message ID"
                    >
                      {copiedId === selectedLog.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              {selectedLog.error_message && (
                <div>
                  <label className="text-[10px] text-rose-600 uppercase font-bold tracking-wider">Failure Reason / Relay Exception</label>
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 mt-1 font-mono text-[11px]">
                    {selectedLog.error_message}
                  </div>
                </div>
              )}

              {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                <div>
                  <label className="text-[10px] text-[#817B91] uppercase font-bold tracking-wider">Dispatch Metadata</label>
                  <div className="p-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-[11px] font-mono text-[#1E1B2E] mt-1 max-h-28 overflow-y-auto custom-scrollbar">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </div>
                </div>
              )}

              <div className="text-[10px] text-[#817B91] text-right pt-2 border-t border-[#E8E0F0]">
                Logged at {new Date(selectedLog.created_at).toLocaleString('en-IN')}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl bg-white hover:bg-[#FAF5FF] text-[#5F5A72] font-semibold text-xs border border-[#E8E0F0] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Email Dispatch Modal */}
      {isTestModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-[#E8E0F0] rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 text-[#1E1B2E]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E0F0]">
              <div className="flex items-center space-x-2">
                <Send className="w-5 h-5 text-[#8E2D9D]" />
                <h3 className="text-base font-bold text-[#1E1B2E]">Send Test Relay Email</h3>
              </div>
              <button
                onClick={() => setIsTestModalOpen(false)}
                className="p-1 rounded-lg text-[#817B91] hover:text-[#1E1B2E] hover:bg-[#FAF5FF] transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendTestEmail} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[11px] text-[#1E1B2E] font-semibold block mb-1">
                  Recipient Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. client@example.com"
                  value={testEmailRecipient}
                  onChange={e => setTestEmailRecipient(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-[#1E1B2E] text-xs placeholder-[#817B91] focus:outline-none focus:border-[#8E2D9D]"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#1E1B2E] font-semibold block mb-1">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={testEmailSubject}
                  onChange={e => setTestEmailSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-[#1E1B2E] text-xs placeholder-[#817B91] focus:outline-none focus:border-[#8E2D9D]"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#1E1B2E] font-semibold block mb-1">
                  Message Content
                </label>
                <textarea
                  rows={3}
                  value={testEmailBody}
                  onChange={e => setTestEmailBody(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-[#1E1B2E] text-xs placeholder-[#817B91] focus:outline-none focus:border-[#8E2D9D]"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-[11px] text-[#5F5A72] flex items-start space-x-2">
                <Info className="w-4 h-4 text-[#8E2D9D] shrink-0 mt-0.5" />
                <span>
                  Dispatched via verified backend relay under sender <strong>admin@fusionforgecreation.com</strong>.
                </span>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#E8E0F0]">
                <button
                  type="button"
                  onClick={() => setIsTestModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-[#FAF5FF] text-[#5F5A72] font-semibold text-xs border border-[#E8E0F0] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingTest}
                  className="px-4 py-2 rounded-xl bg-[#8E2D9D] hover:bg-[#6F42C1] text-white font-semibold text-xs shadow-md flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSendingTest ? (
                    <>
                      <Clock className="w-3.5 h-3.5 animate-spin" />
                      <span>Dispatching...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Dispatch Email</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
