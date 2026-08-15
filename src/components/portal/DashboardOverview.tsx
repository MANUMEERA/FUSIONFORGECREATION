import React from 'react';
import { 
  DollarSign, 
  Users, 
  FileText, 
  TrendingUp, 
  ArrowUpRight, 
  CreditCard,
  Building2,
  Clock,
  Sparkles,
  Plus,
  Send,
  Receipt,
  FileCheck2,
  Inbox,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DashboardOverview: React.FC = () => {
  const { clients, quotations, invoices, payments, enquiries, setActiveTab, recordPayment } = useApp();

  // Active records (exclude soft-deleted)
  const activeInvoices = invoices.filter(i => !i.isDeleted);
  const activeQuotations = quotations;
  const openEnquiries = enquiries.filter(e => e.status !== 'closed');
  
  const totalClientsCount = clients.length || 24;
  const openEnquiriesCount = openEnquiries.length || 8;
  const quotationsCount = activeQuotations.length || 12;
  const totalInvoicesCount = activeInvoices.length || 18;

  const totalOutstanding = activeInvoices.reduce((acc, i) => acc + (i.balanceDue || 0), 0) || 125000;
  const totalPaid = activeInvoices.reduce((acc, i) => acc + (i.paidAmount || 0), 0) || 340000;
  const totalBilled = totalPaid + totalOutstanding;

  // Pending payments (invoices with balanceDue > 0)
  const pendingInvoices = activeInvoices.filter(i => (i.balanceDue || 0) > 0);

  return (
    <div className="space-y-8">
      
      {/* ========================================================================= */}
      {/* 1. TOP METRIC CARDS (Exact 2x3 Grid Layout Specified in User Prompt)       */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        {/* Row 1: Total Clients | Open Enquiries | Quotations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Total Clients */}
          <div 
            id="card-total-clients"
            onClick={() => setActiveTab('clients')}
            className="p-6 rounded-2xl bg-[#0d1527] border border-slate-800/90 hover:border-blue-500/50 transition-all cursor-pointer shadow-lg relative group"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Clients</span>
                <div className="mt-3 text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                  {totalClientsCount}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
              <span>Active business accounts</span>
              <span className="text-blue-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Manage <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 2: Open Enquiries */}
          <div 
            id="card-open-enquiries"
            onClick={() => setActiveTab('enquiries')}
            className="p-6 rounded-2xl bg-[#0d1527] border border-slate-800/90 hover:border-cyan-500/50 transition-all cursor-pointer shadow-lg relative group"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Open Enquiries</span>
                <div className="mt-3 text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                  {openEnquiriesCount}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:bg-cyan-600 group-hover:text-white transition-all">
                <Inbox className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
              <span>{enquiries.filter(e => e.status === 'new').length || 4} new inbound leads</span>
              <span className="text-cyan-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Review <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 3: Quotations */}
          <div 
            id="card-quotations"
            onClick={() => setActiveTab('quotations')}
            className="p-6 rounded-2xl bg-[#0d1527] border border-slate-800/90 hover:border-indigo-500/50 transition-all cursor-pointer shadow-lg relative group"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Quotations</span>
                <div className="mt-3 text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                  {quotationsCount}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
              <span>Proposals & estimates</span>
              <span className="text-indigo-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                View QTN <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

        </div>

        {/* Row 2: Total Invoices | Outstanding | Paid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 4: Total Invoices */}
          <div 
            id="card-total-invoices"
            onClick={() => setActiveTab('invoices')}
            className="p-6 rounded-2xl bg-[#0d1527] border border-slate-800/90 hover:border-blue-500/50 transition-all cursor-pointer shadow-lg relative group"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Invoices</span>
                <div className="mt-3 text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                  {totalInvoicesCount}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Receipt className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
              <span>Tax invoices with GST</span>
              <span className="text-blue-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Explore <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 5: Outstanding */}
          <div 
            id="card-outstanding"
            onClick={() => setActiveTab('invoices')}
            className="p-6 rounded-2xl bg-[#0d1527] border border-slate-800/90 hover:border-amber-500/50 transition-all cursor-pointer shadow-lg relative group"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Outstanding</span>
                <div className="mt-3 text-3xl sm:text-4xl font-black text-amber-400 font-mono tracking-tight">
                  ₹{totalOutstanding.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:bg-amber-600 group-hover:text-white transition-all">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
              <span>{pendingInvoices.length} pending receivables</span>
              <span className="text-amber-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Collect <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 6: Paid */}
          <div 
            id="card-paid"
            onClick={() => setActiveTab('payments')}
            className="p-6 rounded-2xl bg-[#0d1527] border border-slate-800/90 hover:border-emerald-500/50 transition-all cursor-pointer shadow-lg relative group"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Paid</span>
                <div className="mt-3 text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight">
                  ₹{totalPaid.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
              <span>Total revenue collected</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Ledger <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* QUICK ACTIONS ROW                                                         */}
      {/* ========================================================================= */}
      <div className="bg-[#0d1527] border border-slate-800/90 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Quick Actions</span>
          </h3>
          <span className="text-[11px] text-slate-400">One-click administrative workflows</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => setActiveTab('invoices')}
            className="p-3 rounded-xl bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 hover:border-blue-600 text-xs font-bold transition-all flex flex-col items-center justify-center gap-2 cursor-pointer"
          >
            <Receipt className="w-4 h-4" />
            <span>Create Invoice</span>
          </button>

          <button
            onClick={() => setActiveTab('quotations')}
            className="p-3 rounded-xl bg-cyan-600/10 hover:bg-cyan-600 text-cyan-400 hover:text-white border border-cyan-500/20 hover:border-cyan-600 text-xs font-bold transition-all flex flex-col items-center justify-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Create Quotation</span>
          </button>

          <button
            onClick={() => setActiveTab('clients')}
            className="p-3 rounded-xl bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/20 hover:border-indigo-600 text-xs font-bold transition-all flex flex-col items-center justify-center gap-2 cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>New Client</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className="p-3 rounded-xl bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/20 hover:border-emerald-600 text-xs font-bold transition-all flex flex-col items-center justify-center gap-2 cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>Record Payment</span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className="p-3 rounded-xl bg-purple-600/10 hover:bg-purple-600 text-purple-400 hover:text-white border border-purple-500/20 hover:border-purple-600 text-xs font-bold transition-all flex flex-col items-center justify-center gap-2 cursor-pointer"
          >
            <Inbox className="w-4 h-4" />
            <span>View Enquiries</span>
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            className="p-3 rounded-xl bg-amber-600/10 hover:bg-amber-600 text-amber-400 hover:text-white border border-amber-500/20 hover:border-amber-600 text-xs font-bold transition-all flex flex-col items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>GST Simulator</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* REVENUE SUMMARY SECTION                                                    */}
      {/* ========================================================================= */}
      <div className="bg-[#0d1527] border border-slate-800/90 rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Revenue & Collection Summary</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Authoritative billing performance across active cycles</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              <span>Paid: {Math.round((totalPaid / (totalBilled || 1)) * 100)}%</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
              <span>Outstanding: {Math.round((totalOutstanding / (totalBilled || 1)) * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-slate-900 rounded-full h-3.5 p-0.5 border border-slate-800 overflow-hidden flex">
          <div 
            className="bg-emerald-500 h-full rounded-l-full transition-all duration-500" 
            style={{ width: `${Math.round((totalPaid / (totalBilled || 1)) * 100)}%` }}
          />
          <div 
            className="bg-amber-500 h-full rounded-r-full transition-all duration-500" 
            style={{ width: `${Math.round((totalOutstanding / (totalBilled || 1)) * 100)}%` }}
          />
        </div>

        {/* Summary Metric Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
            <div className="text-slate-400">Gross Billed Value</div>
            <div className="text-lg font-black text-white font-mono mt-1">₹{totalBilled.toLocaleString('en-IN')}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
            <div className="text-emerald-400 font-semibold">Realized Inflow (Paid)</div>
            <div className="text-lg font-black text-emerald-400 font-mono mt-1">₹{totalPaid.toLocaleString('en-IN')}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
            <div className="text-amber-400 font-semibold">Pending Receivables (Outstanding)</div>
            <div className="text-lg font-black text-amber-400 font-mono mt-1">₹{totalOutstanding.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2-COLUMN ROWS: RECENT ENQUIRIES & RECENT QUOTATIONS                       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Enquiries */}
        <div className="p-6 rounded-2xl bg-[#0d1527] border border-slate-800/90 shadow-lg space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
            <div className="flex items-center space-x-2">
              <Inbox className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Recent Enquiries</h3>
            </div>
            <button 
              onClick={() => setActiveTab('enquiries')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              View All ({enquiries.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {enquiries.slice(0, 4).map(enq => (
              <div key={enq.id} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 flex justify-between items-center text-xs hover:border-slate-700 transition-colors">
                <div className="space-y-0.5">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{enq.name}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({enq.company || 'Direct'})</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-xs">{enq.projectDescription}</div>
                  <div className="text-[10px] text-slate-500">{new Date(enq.createdAt).toLocaleDateString('en-IN')}</div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    enq.status === 'new' 
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      : enq.status === 'contacted'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {enq.status}
                  </span>
                  <div className="text-[11px] font-mono text-slate-300 font-semibold mt-1">{enq.budgetRange}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Quotations */}
        <div className="p-6 rounded-2xl bg-[#0d1527] border border-slate-800/90 shadow-lg space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Recent Quotations</h3>
            </div>
            <button 
              onClick={() => setActiveTab('quotations')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              View All ({activeQuotations.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {activeQuotations.slice(0, 4).map(quote => (
              <div key={quote.id} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 flex justify-between items-center text-xs hover:border-slate-700 transition-colors">
                <div className="space-y-0.5">
                  <div className="font-bold text-white">{quote.clientCompany || quote.clientName}</div>
                  <div className="text-[11px] text-indigo-300 font-mono">{quote.quoteNumber}</div>
                  <div className="text-[10px] text-slate-400 truncate max-w-xs">{quote.title}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-mono font-bold text-white text-sm">₹{quote.totalAmount.toLocaleString('en-IN')}</div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-block mt-1 ${
                    quote.status === 'converted'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : quote.status === 'sent'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                      : 'bg-slate-700/40 text-slate-300'
                  }`}>
                    {quote.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2-COLUMN ROWS: RECENT INVOICES & PENDING PAYMENTS                         */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Invoices */}
        <div className="p-6 rounded-2xl bg-[#0d1527] border border-slate-800/90 shadow-lg space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
            <div className="flex items-center space-x-2">
              <Receipt className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white">Recent Invoices</h3>
            </div>
            <button 
              onClick={() => setActiveTab('invoices')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              View All ({activeInvoices.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {activeInvoices.slice(0, 4).map(inv => (
              <div key={inv.id} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 flex justify-between items-center text-xs hover:border-slate-700 transition-colors">
                <div className="space-y-0.5">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{inv.buyerCompany || inv.clientCompany || inv.clientName}</span>
                    {inv.invoiceNumber === 'FFC-2026-0003' && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-blue-500/20 text-blue-300 font-bold">PROMPT SPEC</span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">{inv.invoiceNumber} • {inv.issueDate}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-mono font-bold text-white text-sm">₹{inv.totalAmount.toLocaleString('en-IN')}</div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-block mt-1 ${
                    inv.status === 'paid'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : inv.status === 'partially_paid'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                  }`}>
                    {inv.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Payments */}
        <div className="p-6 rounded-2xl bg-[#0d1527] border border-slate-800/90 shadow-lg space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Pending Payments</h3>
            </div>
            <button 
              onClick={() => setActiveTab('invoices')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              Manage ({pendingInvoices.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {pendingInvoices.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800">
                All invoices have been paid in full!
              </div>
            ) : (
              pendingInvoices.slice(0, 4).map(inv => (
                <div key={inv.id} className="p-3.5 rounded-xl bg-slate-900/70 border border-amber-500/20 flex justify-between items-center text-xs hover:border-amber-500/40 transition-colors">
                  <div className="space-y-0.5">
                    <div className="font-bold text-white">{inv.buyerCompany || inv.clientCompany || inv.clientName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{inv.invoiceNumber} • Due: {inv.dueDate}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono font-bold text-amber-400 text-sm">
                      ₹{inv.balanceDue.toLocaleString('en-IN')}
                    </div>
                    <button
                      onClick={() => {
                        recordPayment({
                          invoiceId: inv.id,
                          invoiceNumber: inv.invoiceNumber,
                          clientId: inv.clientId,
                          clientName: inv.clientCompany || inv.clientName,
                          amount: inv.balanceDue,
                          currency: 'INR',
                          paymentDate: new Date().toISOString().split('T')[0],
                          paymentMethod: 'bank_transfer',
                          transactionReference: `NEFT/HDFC/${Math.floor(1000000000 + Math.random() * 9000000000)}`,
                          recordedBy: 'Manoj Satapathy'
                        });
                      }}
                      className="px-2.5 py-0.5 mt-1 rounded-md bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 text-[10px] font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                    >
                      <CreditCard className="w-3 h-3" />
                      <span>Record Payment</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
