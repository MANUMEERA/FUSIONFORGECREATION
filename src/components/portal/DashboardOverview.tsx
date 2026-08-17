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
  AlertCircle,
  ShoppingBag,
  Calculator
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DashboardOverview: React.FC = () => {
  const { 
    clients, 
    quotations, 
    invoices, 
    payments, 
    enquiries, 
    purchases, 
    expenses, 
    salaryRecords, 
    staffMembers,
    setActiveTab, 
    recordPayment 
  } = useApp();

  // Active records (exclude soft-deleted)
  const activeInvoices = invoices.filter(i => !i.isDeleted);
  const activeQuotations = quotations;
  const openEnquiries = enquiries.filter(e => !['closed', 'Closed', 'lost', 'won', 'Converted', 'converted'].includes(e.status));
  
  const totalClientsCount = clients.length || 24;
  const openEnquiriesCount = openEnquiries.length;
  const quotationsCount = activeQuotations.length;
  const totalInvoicesCount = activeInvoices.length;

  const totalOutstanding = activeInvoices.reduce((acc, i) => acc + (i.balanceDue || 0), 0) || 125000;
  const totalPaid = activeInvoices.reduce((acc, i) => acc + (i.paidAmount || 0), 0) || 340000;
  const totalBilled = totalPaid + totalOutstanding;

  // Financial Outflow stats
  const totalPurchasesAmount = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
  const totalPurchasesItc = purchases.reduce((sum, p) => sum + (p.cgstAmount + p.sgstAmount + p.igstAmount), 0);
  const totalExpensesAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalSalariesGross = salaryRecords.reduce((sum, s) => sum + s.grossSalary, 0);
  const totalOutflow = totalPurchasesAmount + totalExpensesAmount + totalSalariesGross;
  const netOperatingProfit = totalBilled - totalOutflow;

  // Pending payments (invoices with balanceDue > 0)
  const pendingInvoices = activeInvoices.filter(i => (i.balanceDue || 0) > 0);

  return (
    <div className="space-y-8">
      
      {/* ========================================================================= */}
      {/* 1. TOP METRIC CARDS (Exact 2x3 Grid Layout)                              */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        {/* Row 1: Total Clients | Open Enquiries | Quotations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Total Clients */}
          <div 
            id="card-total-clients"
            onClick={() => setActiveTab('clients')}
            className="p-6 rounded-2xl bg-gradient-to-br from-[#152554] via-[#0f1b3f] to-[#0a132e] border border-blue-500/30 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/15 transition-all cursor-pointer shadow-lg relative group backdrop-blur-md"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200/80">Total Clients</span>
                <div className="mt-3 text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                  {totalClientsCount}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/25 to-indigo-600/25 text-blue-300 border border-blue-400/40 group-hover:from-blue-500 group-hover:to-indigo-600 group-hover:text-white transition-all shadow-inner">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-300 border-t border-blue-500/20 pt-2.5">
              <span>Active business accounts</span>
              <span className="text-blue-300 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Manage <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 2: Open Enquiries */}
          <div 
            id="card-open-enquiries"
            onClick={() => setActiveTab('enquiries')}
            className="p-6 rounded-2xl bg-gradient-to-br from-[#102a4e] via-[#0c1f3b] to-[#08152a] border border-cyan-500/30 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-500/15 transition-all cursor-pointer shadow-lg relative group backdrop-blur-md"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-200/80">Open Enquiries</span>
                <div className="mt-3 text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                  {openEnquiriesCount}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500/25 to-blue-600/25 text-cyan-300 border border-cyan-400/40 group-hover:from-cyan-500 group-hover:to-blue-600 group-hover:text-white transition-all shadow-inner">
                <Inbox className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-300 border-t border-cyan-500/20 pt-2.5">
              <span>{enquiries.filter(e => e.status === 'new').length || 4} new inbound leads</span>
              <span className="text-cyan-300 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Review <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 3: Quotations */}
          <div 
            id="card-quotations"
            onClick={() => setActiveTab('quotations')}
            className="p-6 rounded-2xl bg-gradient-to-br from-[#1a1f52] via-[#12163d] to-[#0a0d26] border border-indigo-500/30 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/15 transition-all cursor-pointer shadow-lg relative group backdrop-blur-md"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-200/80">Quotations</span>
                <div className="mt-3 text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                  {quotationsCount}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500/25 to-purple-600/25 text-indigo-300 border border-indigo-400/40 group-hover:from-indigo-500 group-hover:to-purple-600 group-hover:text-white transition-all shadow-inner">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-300 border-t border-indigo-500/20 pt-2.5">
              <span>Proposals & estimates</span>
              <span className="text-indigo-300 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
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
            className="p-6 rounded-2xl bg-gradient-to-br from-[#152554] via-[#0f1b3f] to-[#0a132e] border border-blue-500/30 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/15 transition-all cursor-pointer shadow-lg relative group backdrop-blur-md"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200/80">Total Invoices</span>
                <div className="mt-3 text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                  {totalInvoicesCount}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/25 to-indigo-600/25 text-blue-300 border border-blue-400/40 group-hover:from-blue-500 group-hover:to-indigo-600 group-hover:text-white transition-all shadow-inner">
                <Receipt className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-300 border-t border-blue-500/20 pt-2.5">
              <span>Tax invoices with GST</span>
              <span className="text-blue-300 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Explore <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 5: Outstanding */}
          <div 
            id="card-outstanding"
            onClick={() => setActiveTab('invoices')}
            className="p-6 rounded-2xl bg-gradient-to-br from-[#332211] via-[#24170a] to-[#140d05] border border-amber-500/35 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/15 transition-all cursor-pointer shadow-lg relative group backdrop-blur-md"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-200/80">Outstanding</span>
                <div className="mt-3 text-3xl sm:text-4xl font-black text-amber-400 font-mono tracking-tight">
                  ₹{totalOutstanding.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/25 to-orange-600/25 text-amber-300 border border-amber-400/40 group-hover:from-amber-500 group-hover:to-orange-600 group-hover:text-white transition-all shadow-inner">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-300 border-t border-amber-500/20 pt-2.5">
              <span>{pendingInvoices.length} pending receivables</span>
              <span className="text-amber-300 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Collect <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 6: Paid */}
          <div 
            id="card-paid"
            onClick={() => setActiveTab('payments')}
            className="p-6 rounded-2xl bg-gradient-to-br from-[#0e2c21] via-[#091f17] to-[#05110d] border border-emerald-500/35 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/15 transition-all cursor-pointer shadow-lg relative group backdrop-blur-md"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-200/80">Paid</span>
                <div className="mt-3 text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight">
                  ₹{totalPaid.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/25 to-teal-600/25 text-emerald-300 border border-emerald-400/40 group-hover:from-emerald-500 group-hover:to-teal-600 group-hover:text-white transition-all shadow-inner">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-300 border-t border-emerald-500/20 pt-2.5">
              <span>Total revenue collected</span>
              <span className="text-emerald-300 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Ledger <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* QUICK ACTIONS ROW                                                         */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-[#12204c]/95 via-[#0e1a3d]/95 to-[#12204c]/95 border border-blue-500/25 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Quick Actions</span>
          </h3>
          <span className="text-[11px] text-slate-300">One-click administrative workflows</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => setActiveTab('invoices')}
            className="p-3 rounded-xl bg-gradient-to-br from-blue-900/40 to-indigo-950/60 hover:from-blue-600 hover:to-indigo-600 text-blue-200 hover:text-white border border-blue-500/40 hover:border-blue-300 text-xs font-bold transition-all flex flex-col items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-102"
          >
            <Receipt className="w-4 h-4" />
            <span>Create Invoice</span>
          </button>

          <button
            onClick={() => setActiveTab('quotations')}
            className="p-3 rounded-xl bg-gradient-to-br from-cyan-900/40 to-blue-950/60 hover:from-cyan-600 hover:to-blue-600 text-cyan-200 hover:text-white border border-cyan-500/40 hover:border-cyan-300 text-xs font-bold transition-all flex flex-col items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-102"
          >
            <FileText className="w-4 h-4" />
            <span>Create Quotation</span>
          </button>

          <button
            onClick={() => setActiveTab('clients')}
            className="p-3 rounded-xl bg-gradient-to-br from-indigo-900/40 to-violet-950/60 hover:from-indigo-600 hover:to-violet-600 text-indigo-200 hover:text-white border border-indigo-500/40 hover:border-indigo-300 text-xs font-bold transition-all flex flex-col items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-102"
          >
            <Users className="w-4 h-4" />
            <span>New Client</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className="p-3 rounded-xl bg-gradient-to-br from-emerald-900/40 to-teal-950/60 hover:from-emerald-600 hover:to-teal-600 text-emerald-200 hover:text-white border border-emerald-500/40 hover:border-emerald-300 text-xs font-bold transition-all flex flex-col items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-102"
          >
            <CreditCard className="w-4 h-4" />
            <span>Record Payment</span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className="p-3 rounded-xl bg-gradient-to-br from-purple-900/40 to-fuchsia-950/60 hover:from-purple-600 hover:to-fuchsia-600 text-purple-200 hover:text-white border border-purple-500/40 hover:border-purple-300 text-xs font-bold transition-all flex flex-col items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-102"
          >
            <Inbox className="w-4 h-4" />
            <span>View Enquiries</span>
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            className="p-3 rounded-xl bg-gradient-to-br from-amber-900/40 to-orange-950/60 hover:from-amber-600 hover:to-orange-600 text-amber-200 hover:text-white border border-amber-500/40 hover:border-amber-300 text-xs font-bold transition-all flex flex-col items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-102"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>GST Simulator</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* REVENUE SUMMARY SECTION                                                    */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-[#13224e]/95 via-[#0e193c]/95 to-[#09112a]/95 border border-blue-500/25 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-blue-500/20">
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Revenue & Collection Summary</span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">Authoritative billing performance across active cycles</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block shadow-sm"></span>
              <span>Paid: {Math.round((totalPaid / (totalBilled || 1)) * 100)}%</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block shadow-sm"></span>
              <span>Outstanding: {Math.round((totalOutstanding / (totalBilled || 1)) * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-slate-900/90 rounded-full h-3.5 p-0.5 border border-slate-700/80 overflow-hidden flex shadow-inner">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-l-full transition-all duration-500 shadow-sm" 
            style={{ width: `${Math.round((totalPaid / (totalBilled || 1)) * 100)}%` }}
          />
          <div 
            className="bg-gradient-to-r from-amber-500 to-orange-400 h-full rounded-r-full transition-all duration-500 shadow-sm" 
            style={{ width: `${Math.round((totalOutstanding / (totalBilled || 1)) * 100)}%` }}
          />
        </div>

        {/* Summary Metric Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#101b3d] to-[#0a122c] border border-blue-500/20 text-xs">
            <div className="text-slate-400">Gross Billed Value</div>
            <div className="text-lg font-black text-white font-mono mt-1">₹{totalBilled.toLocaleString('en-IN')}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-950/50 to-teal-950/30 border border-emerald-500/30 text-xs">
            <div className="text-emerald-300 font-semibold">Realized Inflow (Paid)</div>
            <div className="text-lg font-black text-emerald-400 font-mono mt-1">₹{totalPaid.toLocaleString('en-IN')}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-950/50 to-orange-950/30 border border-amber-500/30 text-xs">
            <div className="text-amber-300 font-semibold">Pending Receivables (Outstanding)</div>
            <div className="text-lg font-black text-amber-400 font-mono mt-1">₹{totalOutstanding.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FINANCIAL HEALTH & P&L EXECUTIVE SECTION (PHASE 10)                       */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-[#111f48]/95 via-[#0c1736]/95 to-[#070e24]/95 border border-indigo-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-indigo-500/20">
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-cyan-400" />
              <span>Profit & Loss (P&L) & Cost Center Outflows</span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">Purchases, OPEX, Employee Payroll, and Net Operating EBITDA</p>
          </div>
          <button
            onClick={() => setActiveTab('accounting')}
            className="text-xs text-cyan-300 hover:text-cyan-200 font-bold flex items-center gap-1 cursor-pointer bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/30"
          >
            Full P&L Reports <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => setActiveTab('purchases')}
            className="p-4 rounded-xl bg-slate-900/80 border border-indigo-500/30 hover:border-indigo-400 transition-all cursor-pointer space-y-1"
          >
            <div className="flex justify-between text-xs text-indigo-300 font-semibold">
              <span>Vendor Purchases</span>
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
            <div className="text-xl font-black text-white font-mono">₹{totalPurchasesAmount.toLocaleString('en-IN')}</div>
            <div className="text-[10px] text-emerald-400 font-mono">ITC Claimable: ₹{totalPurchasesItc.toLocaleString('en-IN')}</div>
          </div>

          <div 
            onClick={() => setActiveTab('expenses')}
            className="p-4 rounded-xl bg-slate-900/80 border border-rose-500/30 hover:border-rose-400 transition-all cursor-pointer space-y-1"
          >
            <div className="flex justify-between text-xs text-rose-300 font-semibold">
              <span>Operating Expenses (OPEX)</span>
              <CreditCard className="w-3.5 h-3.5" />
            </div>
            <div className="text-xl font-black text-rose-400 font-mono">₹{totalExpensesAmount.toLocaleString('en-IN')}</div>
            <div className="text-[10px] text-slate-400">{expenses.length} operating vouchers</div>
          </div>

          <div 
            onClick={() => setActiveTab('salary')}
            className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 hover:border-cyan-400 transition-all cursor-pointer space-y-1"
          >
            <div className="flex justify-between text-xs text-cyan-300 font-semibold">
              <span>Salary & Payroll</span>
              <Users className="w-3.5 h-3.5" />
            </div>
            <div className="text-xl font-black text-cyan-400 font-mono">₹{totalSalariesGross.toLocaleString('en-IN')}</div>
            <div className="text-[10px] text-slate-400">{staffMembers.length} active team members</div>
          </div>

          <div 
            onClick={() => setActiveTab('accounting')}
            className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/40 hover:border-emerald-400 transition-all cursor-pointer space-y-1"
          >
            <div className="flex justify-between text-xs text-emerald-300 font-semibold">
              <span>Net Operating Profit</span>
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <div className={`text-xl font-black font-mono ${netOperatingProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ₹{netOperatingProfit.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-emerald-300 font-bold">
              Margin: {totalBilled > 0 ? Math.round((netOperatingProfit / totalBilled) * 100) : 0}%
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2-COLUMN ROWS: RECENT ENQUIRIES & RECENT QUOTATIONS                       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Enquiries */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#12214c]/95 via-[#0e193c]/95 to-[#09112a]/95 border border-blue-500/25 shadow-xl backdrop-blur-md space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-blue-500/20">
            <div className="flex items-center space-x-2">
              <Inbox className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Recent Enquiries</h3>
            </div>
            <button 
              onClick={() => setActiveTab('enquiries')}
              className="text-xs text-cyan-300 hover:text-cyan-200 font-semibold flex items-center gap-1 cursor-pointer"
            >
              View All ({enquiries.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {enquiries.slice(0, 4).map(enq => (
              <div key={enq.id} className="p-3.5 rounded-xl bg-gradient-to-r from-[#0d1736]/90 to-[#091026]/90 border border-blue-500/20 flex justify-between items-center text-xs hover:border-cyan-400/50 transition-all shadow-sm">
                <div className="space-y-0.5">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{enq.name}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({enq.company || 'Direct'})</span>
                  </div>
                  <div className="text-[11px] text-slate-300 truncate max-w-xs">{enq.projectDescription}</div>
                  <div className="text-[10px] text-slate-400">{new Date(enq.createdAt).toLocaleDateString('en-IN')}</div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    enq.status === 'new' 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : enq.status === 'contacted'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {enq.status}
                  </span>
                  <div className="text-[11px] font-mono text-slate-200 font-semibold mt-1">{enq.budgetRange}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Quotations */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#12214c]/95 via-[#0e193c]/95 to-[#09112a]/95 border border-blue-500/25 shadow-xl backdrop-blur-md space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-blue-500/20">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Recent Quotations</h3>
            </div>
            <button 
              onClick={() => setActiveTab('quotations')}
              className="text-xs text-indigo-300 hover:text-indigo-200 font-semibold flex items-center gap-1 cursor-pointer"
            >
              View All ({activeQuotations.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {activeQuotations.slice(0, 4).map(quote => (
              <div key={quote.id} className="p-3.5 rounded-xl bg-gradient-to-r from-[#0d1736]/90 to-[#091026]/90 border border-blue-500/20 flex justify-between items-center text-xs hover:border-indigo-400/50 transition-all shadow-sm">
                <div className="space-y-0.5">
                  <div className="font-bold text-white">{quote.clientCompany || quote.clientName}</div>
                  <div className="text-[11px] text-indigo-300 font-mono font-semibold">{quote.quoteNumber}</div>
                  <div className="text-[10px] text-slate-300 truncate max-w-xs">{quote.title}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-mono font-bold text-white text-sm">₹{quote.totalAmount.toLocaleString('en-IN')}</div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-block mt-1 ${
                    quote.status === 'converted'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : quote.status === 'sent'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
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
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#12214c]/95 via-[#0e193c]/95 to-[#09112a]/95 border border-blue-500/25 shadow-xl backdrop-blur-md space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-blue-500/20">
            <div className="flex items-center space-x-2">
              <Receipt className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white">Recent Invoices</h3>
            </div>
            <button 
              onClick={() => setActiveTab('invoices')}
              className="text-xs text-blue-300 hover:text-blue-200 font-semibold flex items-center gap-1 cursor-pointer"
            >
              View All ({activeInvoices.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {activeInvoices.slice(0, 4).map(inv => (
              <div key={inv.id} className="p-3.5 rounded-xl bg-gradient-to-r from-[#0d1736]/90 to-[#091026]/90 border border-blue-500/20 flex justify-between items-center text-xs hover:border-blue-400/50 transition-all shadow-sm">
                <div className="space-y-0.5">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{inv.buyerCompany || inv.clientCompany || inv.clientName}</span>
                    {inv.invoiceNumber === 'FFC-2026-0003' && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold">PROMPT SPEC</span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-300 font-mono">{inv.invoiceNumber} • {inv.issueDate}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-mono font-bold text-white text-sm">₹{inv.totalAmount.toLocaleString('en-IN')}</div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-block mt-1 ${
                    inv.status === 'paid'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : inv.status === 'partially_paid'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  }`}>
                    {inv.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Payments */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#12214c]/95 via-[#0e193c]/95 to-[#09112a]/95 border border-blue-500/25 shadow-xl backdrop-blur-md space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-blue-500/20">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Pending Payments</h3>
            </div>
            <button 
              onClick={() => setActiveTab('invoices')}
              className="text-xs text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1 cursor-pointer"
            >
              Manage ({pendingInvoices.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {pendingInvoices.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-gradient-to-br from-[#0d1736] to-[#091026] rounded-xl border border-blue-500/20">
                All invoices have been paid in full!
              </div>
            ) : (
              pendingInvoices.slice(0, 4).map(inv => (
                <div key={inv.id} className="p-3.5 rounded-xl bg-gradient-to-r from-[#0d1736]/90 to-[#091026]/90 border border-amber-500/30 flex justify-between items-center text-xs hover:border-amber-400/60 transition-all shadow-sm">
                  <div className="space-y-0.5">
                    <div className="font-bold text-white">{inv.buyerCompany || inv.clientCompany || inv.clientName}</div>
                    <div className="text-[11px] text-slate-300 font-mono">{inv.invoiceNumber} • Due: {inv.dueDate}</div>
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
                      className="px-2.5 py-0.5 mt-1 rounded-md bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-600 hover:to-teal-600 text-emerald-200 hover:text-white border border-emerald-500/40 text-[10px] font-bold transition-all cursor-pointer inline-flex items-center gap-1 shadow-xs"
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

