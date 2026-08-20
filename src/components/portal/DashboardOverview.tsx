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
  Calculator,
  Scale,
  Activity,
  Eye,
  Globe,
  Lock
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
    legalDocuments,
    visitorEvents,
    isVisitorTrackingEnabled,
    users,
    setActiveTab, 
    recordPayment 
  } = useApp();

  // Active records (exclude soft-deleted)
  const activeInvoices = invoices.filter(i => !i.isDeleted);
  const activeClients = clients.filter(c => !c.isDeleted && c.status !== 'deleted');
  const activeQuotations = quotations;
  const openEnquiries = enquiries.filter(e => !['closed', 'Closed', 'lost', 'won', 'Converted', 'converted'].includes(e.status));
  
  const totalClientsCount = activeClients.length;
  const openEnquiriesCount = openEnquiries.length;
  const quotationsCount = activeQuotations.length;
  const totalInvoicesCount = activeInvoices.length;

  const totalOutstanding = activeInvoices.reduce((acc, i) => acc + (i.balanceDue || 0), 0);
  const totalPaid = activeInvoices.reduce((acc, i) => acc + (i.paidAmount || 0), 0);
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
            className="p-6 rounded-2xl bg-white border border-[#E8E0F0] hover:border-[#C084FC] hover:shadow-md transition-all cursor-pointer shadow-xs relative group"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#5F5A72]">Total Clients</span>
                <div className="mt-3 text-3xl sm:text-4xl font-black text-[#1E1B2E] font-mono tracking-tight">
                  {totalClientsCount}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-[#F3E8FF] text-[#8E2D9D] border border-[#E8E0F0] group-hover:bg-[#8E2D9D] group-hover:text-white transition-all">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-[#5F5A72] border-t border-[#E8E0F0] pt-2.5">
              <span>Active business accounts</span>
              <span className="text-[#8E2D9D] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Manage <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 2: Open Enquiries */}
          <div 
            id="card-open-enquiries"
            onClick={() => setActiveTab('enquiries')}
            className="p-6 rounded-2xl bg-white border border-[#E8E0F0] hover:border-[#C084FC] hover:shadow-md transition-all cursor-pointer shadow-xs relative group"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#5F5A72]">Open Enquiries</span>
                <div className="mt-3 text-3xl sm:text-4xl font-black text-[#1E1B2E] font-mono tracking-tight">
                  {openEnquiriesCount}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Inbox className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-[#5F5A72] border-t border-[#E8E0F0] pt-2.5">
              <span>{openEnquiries.length} new inbound {openEnquiries.length === 1 ? 'lead' : 'leads'}</span>
              <span className="text-blue-600 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Review <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 3: Quotations */}
          <div 
            id="card-quotations"
            onClick={() => setActiveTab('quotations')}
            className="p-6 rounded-2xl bg-white border border-[#E8E0F0] hover:border-[#C084FC] hover:shadow-md transition-all cursor-pointer shadow-xs relative group"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#5F5A72]">Quotations</span>
                <div className="mt-3 text-3xl sm:text-4xl font-black text-[#1E1B2E] font-mono tracking-tight">
                  {quotationsCount}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-[#F3E8FF] text-[#6F42C1] border border-[#E8E0F0] group-hover:bg-[#6F42C1] group-hover:text-white transition-all">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-[#5F5A72] border-t border-[#E8E0F0] pt-2.5">
              <span>Proposals & estimates</span>
              <span className="text-[#6F42C1] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
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
            className="p-6 rounded-2xl bg-white border border-[#E8E0F0] hover:border-[#C084FC] hover:shadow-md transition-all cursor-pointer shadow-xs relative group"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#5F5A72]">Total Invoices</span>
                <div className="mt-3 text-3xl sm:text-4xl font-black text-[#1E1B2E] font-mono tracking-tight">
                  {totalInvoicesCount}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-[#F3E8FF] text-[#8E2D9D] border border-[#E8E0F0] group-hover:bg-[#8E2D9D] group-hover:text-white transition-all">
                <Receipt className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-[#5F5A72] border-t border-[#E8E0F0] pt-2.5">
              <span>Tax invoices with GST</span>
              <span className="text-[#8E2D9D] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Explore <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 5: Outstanding */}
          <div 
            id="card-outstanding"
            onClick={() => setActiveTab('invoices')}
            className="p-6 rounded-2xl bg-[#FFF7ED] border border-[#FED7AA] hover:border-amber-400 hover:shadow-md transition-all cursor-pointer shadow-xs relative group"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Outstanding</span>
                <div className="mt-3 text-3xl sm:text-4xl font-black text-[#D97706] font-mono tracking-tight">
                  ₹{totalOutstanding.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-amber-100 text-[#D97706] border border-amber-200 group-hover:bg-[#D97706] group-hover:text-white transition-all">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-amber-800 border-t border-amber-200 pt-2.5">
              <span>{pendingInvoices.length} pending receivables</span>
              <span className="text-[#D97706] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Collect <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 6: Paid */}
          <div 
            id="card-paid"
            onClick={() => setActiveTab('payments')}
            className="p-6 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer shadow-xs relative group"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Paid</span>
                <div className="mt-3 text-3xl sm:text-4xl font-black text-[#059669] font-mono tracking-tight">
                  ₹{totalPaid.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-100 text-[#059669] border border-emerald-200 group-hover:bg-[#059669] group-hover:text-white transition-all">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-emerald-800 border-t border-emerald-200 pt-2.5">
              <span>Total revenue collected</span>
              <span className="text-[#059669] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Ledger <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* QUICK ACTIONS ROW                                                         */}
      {/* ========================================================================= */}
      <div className="bg-white border border-[#E8E0F0] rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#1E1B2E] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8E2D9D]" />
            <span>Quick Actions</span>
          </h3>
          <span className="text-[11px] text-[#5F5A72]">One-click administrative workflows</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => setActiveTab('invoices')}
            className="p-3 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#1E1B2E] border border-[#E8E0F0] hover:border-[#C084FC] text-xs font-bold transition-all flex flex-col items-center justify-center gap-2 cursor-pointer shadow-xs hover:scale-102"
          >
            <Receipt className="w-4 h-4 text-[#8E2D9D]" />
            <span>Create Invoice</span>
          </button>

          <button
            onClick={() => setActiveTab('quotations')}
            className="p-3 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#1E1B2E] border border-[#E8E0F0] hover:border-[#C084FC] text-xs font-bold transition-all flex flex-col items-center justify-center gap-2 cursor-pointer shadow-xs hover:scale-102"
          >
            <FileText className="w-4 h-4 text-[#6F42C1]" />
            <span>Create Quotation</span>
          </button>

          <button
            onClick={() => setActiveTab('clients')}
            className="p-3 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#1E1B2E] border border-[#E8E0F0] hover:border-[#C084FC] text-xs font-bold transition-all flex flex-col items-center justify-center gap-2 cursor-pointer shadow-xs hover:scale-102"
          >
            <Users className="w-4 h-4 text-[#8E2D9D]" />
            <span>New Client</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className="p-3 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#1E1B2E] border border-[#E8E0F0] hover:border-[#C084FC] text-xs font-bold transition-all flex flex-col items-center justify-center gap-2 cursor-pointer shadow-xs hover:scale-102"
          >
            <CreditCard className="w-4 h-4 text-[#059669]" />
            <span>Record Payment</span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className="p-3 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#1E1B2E] border border-[#E8E0F0] hover:border-[#C084FC] text-xs font-bold transition-all flex flex-col items-center justify-center gap-2 cursor-pointer shadow-xs hover:scale-102"
          >
            <Inbox className="w-4 h-4 text-[#6F42C1]" />
            <span>View Enquiries</span>
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            className="p-3 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#1E1B2E] border border-[#E8E0F0] hover:border-[#C084FC] text-xs font-bold transition-all flex flex-col items-center justify-center gap-2 cursor-pointer shadow-xs hover:scale-102"
          >
            <ShieldCheck className="w-4 h-4 text-[#D97706]" />
            <span>GST Simulator</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* REVENUE SUMMARY SECTION                                                    */}
      {/* ========================================================================= */}
      <div className="bg-white border border-[#E8E0F0] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8E0F0]">
          <div>
            <h3 className="text-sm font-black text-[#1E1B2E] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#059669]" />
              <span>Revenue & Collection Summary</span>
            </h3>
            <p className="text-xs text-[#5F5A72] mt-0.5">Authoritative billing performance across active cycles</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-[#5F5A72]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#059669] inline-block shadow-xs"></span>
              <span className="font-semibold text-[#059669]">Paid: {Math.round((totalPaid / (totalBilled || 1)) * 100)}%</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#5F5A72]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D97706] inline-block shadow-xs"></span>
              <span className="font-semibold text-[#D97706]">Outstanding: {Math.round((totalOutstanding / (totalBilled || 1)) * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-[#FAF5FF] rounded-full h-3.5 p-0.5 border border-[#E8E0F0] overflow-hidden flex shadow-inner">
          <div 
            className="bg-[#059669] h-full rounded-l-full transition-all duration-500 shadow-xs" 
            style={{ width: `${Math.round((totalPaid / (totalBilled || 1)) * 100)}%` }}
          />
          <div 
            className="bg-[#D97706] h-full rounded-r-full transition-all duration-500 shadow-xs" 
            style={{ width: `${Math.round((totalOutstanding / (totalBilled || 1)) * 100)}%` }}
          />
        </div>

        {/* Summary Metric Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs">
            <div className="text-[#5F5A72]">Gross Billed Value</div>
            <div className="text-lg font-black text-[#1E1B2E] font-mono mt-1">₹{totalBilled.toLocaleString('en-IN')}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-xs">
            <div className="text-emerald-800 font-semibold">Realized Inflow (Paid)</div>
            <div className="text-lg font-black text-[#059669] font-mono mt-1">₹{totalPaid.toLocaleString('en-IN')}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#FFF7ED] border border-[#FED7AA] text-xs">
            <div className="text-amber-800 font-semibold">Pending Receivables (Outstanding)</div>
            <div className="text-lg font-black text-[#D97706] font-mono mt-1">₹{totalOutstanding.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FINANCIAL HEALTH & P&L EXECUTIVE SECTION (PHASE 10)                       */}
      {/* ========================================================================= */}
      <div className="bg-white border border-[#E8E0F0] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8E0F0]">
          <div>
            <h3 className="text-sm font-black text-[#1E1B2E] flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#8E2D9D]" />
              <span>Profit & Loss (P&L) & Cost Center Outflows</span>
            </h3>
            <p className="text-xs text-[#5F5A72] mt-0.5">Purchases, OPEX, Employee Payroll, and Net Operating EBITDA</p>
          </div>
          <button
            onClick={() => setActiveTab('accounting')}
            className="text-xs text-[#6F42C1] hover:text-[#8E2D9D] font-bold flex items-center gap-1 cursor-pointer bg-[#F3E8FF] px-3 py-1.5 rounded-xl border border-[#C084FC]/40 transition-colors"
          >
            Full P&L Reports <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            onClick={() => setActiveTab('purchases')}
            className="p-4 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] hover:border-[#C084FC] transition-all cursor-pointer space-y-1"
          >
            <div className="flex justify-between text-xs text-[#6F42C1] font-semibold">
              <span>Vendor Purchases</span>
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
            <div className="text-xl font-black text-[#1E1B2E] font-mono">₹{totalPurchasesAmount.toLocaleString('en-IN')}</div>
            <div className="text-[10px] text-[#059669] font-mono">ITC Claimable: ₹{totalPurchasesItc.toLocaleString('en-IN')}</div>
          </div>

          <div 
            onClick={() => setActiveTab('expenses')}
            className="p-4 rounded-xl bg-rose-50 border border-rose-200 hover:border-rose-300 transition-all cursor-pointer space-y-1"
          >
            <div className="flex justify-between text-xs text-rose-700 font-semibold">
              <span>Operating Expenses (OPEX)</span>
              <CreditCard className="w-3.5 h-3.5" />
            </div>
            <div className="text-xl font-black text-rose-700 font-mono">₹{totalExpensesAmount.toLocaleString('en-IN')}</div>
            <div className="text-[10px] text-[#5F5A72]">{expenses.length} operating vouchers</div>
          </div>

          <div 
            onClick={() => setActiveTab('salary')}
            className="p-4 rounded-xl bg-blue-50 border border-blue-200 hover:border-blue-300 transition-all cursor-pointer space-y-1"
          >
            <div className="flex justify-between text-xs text-blue-700 font-semibold">
              <span>Salary & Payroll</span>
              <Users className="w-3.5 h-3.5" />
            </div>
            <div className="text-xl font-black text-blue-700 font-mono">₹{totalSalariesGross.toLocaleString('en-IN')}</div>
            <div className="text-[10px] text-[#5F5A72]">{staffMembers.length} active team members</div>
          </div>

          <div 
            onClick={() => setActiveTab('accounting')}
            className="p-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] hover:border-emerald-400 transition-all cursor-pointer space-y-1"
          >
            <div className="flex justify-between text-xs text-emerald-800 font-semibold">
              <span>Net Operating Profit</span>
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <div className={`text-xl font-black font-mono ${netOperatingProfit >= 0 ? 'text-[#059669]' : 'text-rose-600'}`}>
              ₹{netOperatingProfit.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-emerald-800 font-bold">
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
        <div className="p-6 rounded-2xl bg-white border border-[#E8E0F0] shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#E8E0F0]">
            <div className="flex items-center space-x-2">
              <Inbox className="w-4 h-4 text-[#8E2D9D]" />
              <h3 className="text-sm font-bold text-[#1E1B2E]">Recent Enquiries</h3>
            </div>
            <button 
              onClick={() => setActiveTab('enquiries')}
              className="text-xs text-[#6F42C1] hover:text-[#8E2D9D] font-semibold flex items-center gap-1 cursor-pointer"
            >
              View All ({enquiries.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {enquiries.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#5F5A72] bg-[#FAF5FF] rounded-xl border border-[#E8E0F0]">
                No lead enquiries received yet.
              </div>
            ) : (
              enquiries.slice(0, 4).map(enq => {
                const assignedUser = users.find(u => u.id === enq.assigned_to);

                return (
                  <div key={enq.id} className="p-3.5 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] flex justify-between items-center text-xs hover:border-[#C084FC] transition-all shadow-xs">
                    <div className="space-y-0.5">
                      <div className="font-bold text-[#1E1B2E] flex items-center gap-2">
                        <span>{enq.name}</span>
                        <span className="text-[10px] text-[#817B91] font-normal">({enq.company || 'Direct'})</span>
                        {assignedUser && (
                          <span className="px-1.5 py-0.2 rounded bg-purple-100 text-[#8E2D9D] text-[9px] font-semibold">
                            👤 {assignedUser.name}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#5F5A72] truncate max-w-xs">{enq.projectDescription}</div>
                      <div className="text-[10px] text-[#817B91]">{new Date(enq.createdAt).toLocaleDateString('en-IN')}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        enq.status === 'new' 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : enq.status === 'contacted'
                          ? 'bg-[#F3E8FF] text-[#6F42C1] border border-[#E8E0F0]'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {enq.status}
                      </span>
                      <div className="text-[11px] font-mono text-emerald-700 font-semibold mt-1">{enq.budgetRange}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Quotations */}
        <div className="p-6 rounded-2xl bg-white border border-[#E8E0F0] shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#E8E0F0]">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-[#6F42C1]" />
              <h3 className="text-sm font-bold text-[#1E1B2E]">Recent Quotations</h3>
            </div>
            <button 
              onClick={() => setActiveTab('quotations')}
              className="text-xs text-[#6F42C1] hover:text-[#8E2D9D] font-semibold flex items-center gap-1 cursor-pointer"
            >
              View All ({activeQuotations.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {activeQuotations.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#5F5A72] bg-[#FAF5FF] rounded-xl border border-[#E8E0F0]">
                No quotations created yet.
              </div>
            ) : (
              activeQuotations.slice(0, 4).map(quote => (
                <div key={quote.id} className="p-3.5 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] flex justify-between items-center text-xs hover:border-[#C084FC] transition-all shadow-xs">
                  <div className="space-y-0.5">
                    <div className="font-bold text-[#1E1B2E]">{quote.clientCompany || quote.clientName}</div>
                    <div className="text-[11px] text-[#6F42C1] font-mono font-semibold">{quote.quoteNumber}</div>
                    <div className="text-[10px] text-[#5F5A72] truncate max-w-xs">{quote.title}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono font-bold text-[#1E1B2E] text-sm">₹{quote.totalAmount.toLocaleString('en-IN')}</div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-block mt-1 ${
                      quote.status === 'converted'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : quote.status === 'sent'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-slate-100 text-[#5F5A72] border border-slate-200'
                    }`}>
                      {quote.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2-COLUMN ROWS: RECENT INVOICES & PENDING PAYMENTS                         */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Invoices */}
        <div className="p-6 rounded-2xl bg-white border border-[#E8E0F0] shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#E8E0F0]">
            <div className="flex items-center space-x-2">
              <Receipt className="w-4 h-4 text-[#8E2D9D]" />
              <h3 className="text-sm font-bold text-[#1E1B2E]">Recent Invoices</h3>
            </div>
            <button 
              onClick={() => setActiveTab('invoices')}
              className="text-xs text-[#6F42C1] hover:text-[#8E2D9D] font-semibold flex items-center gap-1 cursor-pointer"
            >
              View All ({activeInvoices.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {activeInvoices.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#5F5A72] bg-[#FAF5FF] rounded-xl border border-[#E8E0F0]">
                No tax invoices created yet.
              </div>
            ) : (
              activeInvoices.slice(0, 4).map(inv => (
                <div key={inv.id} className="p-3.5 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] flex justify-between items-center text-xs hover:border-[#C084FC] transition-all shadow-xs">
                  <div className="space-y-0.5">
                    <div className="font-bold text-[#1E1B2E] flex items-center gap-2">
                      <span>{inv.buyerCompany || inv.clientCompany || inv.clientName}</span>
                      {inv.invoiceNumber === 'FFC-2026-0003' && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#F3E8FF] text-[#8E2D9D] border border-[#C084FC] font-bold">PROMPT SPEC</span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#5F5A72] font-mono">{inv.invoiceNumber} • {inv.issueDate}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono font-bold text-[#1E1B2E] text-sm">₹{inv.totalAmount.toLocaleString('en-IN')}</div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-block mt-1 ${
                      inv.status === 'paid'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : inv.status === 'partially_paid'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {inv.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending Payments */}
        <div className="p-6 rounded-2xl bg-white border border-[#E8E0F0] shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#E8E0F0]">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-[#D97706]" />
              <h3 className="text-sm font-bold text-[#1E1B2E]">Pending Payments</h3>
            </div>
            <button 
              onClick={() => setActiveTab('invoices')}
              className="text-xs text-[#D97706] hover:text-amber-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              Manage ({pendingInvoices.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {pendingInvoices.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#5F5A72] bg-[#FAF5FF] rounded-xl border border-[#E8E0F0]">
                All invoices have been paid in full!
              </div>
            ) : (
              pendingInvoices.slice(0, 4).map(inv => (
                <div key={inv.id} className="p-3.5 rounded-xl bg-[#FFF7ED] border border-[#FED7AA] flex justify-between items-center text-xs hover:border-amber-400 transition-all shadow-xs">
                  <div className="space-y-0.5">
                    <div className="font-bold text-[#1E1B2E]">{inv.buyerCompany || inv.clientCompany || inv.clientName}</div>
                    <div className="text-[11px] text-[#5F5A72] font-mono">{inv.invoiceNumber} • Due: {inv.dueDate}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono font-bold text-[#D97706] text-sm">
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
                      className="px-2.5 py-0.5 mt-1 rounded-md bg-[#059669] hover:bg-[#047857] text-white text-[10px] font-bold transition-all cursor-pointer inline-flex items-center gap-1 shadow-xs"
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

      {/* ========================================================================= */}
      {/* 4. GOVERNANCE, LEGAL COMPLIANCE & PRIVACY MONITORING (PHASE 16)           */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Legal Document & Regulatory Compliance Monitor */}
        <div className="p-6 rounded-2xl bg-white border border-[#E8E0F0] shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#E8E0F0]">
            <div className="flex items-center space-x-2">
              <Scale className="w-4 h-4 text-[#8E2D9D]" />
              <h3 className="text-sm font-bold text-[#1E1B2E]">Legal Documents & Compliance</h3>
            </div>
            <button 
              onClick={() => setActiveTab('legal_docs')}
              className="text-xs text-[#6F42C1] hover:text-[#8E2D9D] font-semibold flex items-center gap-1 cursor-pointer"
            >
              Manage ({legalDocuments.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {legalDocuments.map(doc => (
              <div 
                key={doc.id}
                onClick={() => setActiveTab('legal_docs')}
                className="p-3.5 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] hover:border-[#C084FC] flex items-center justify-between transition-all cursor-pointer shadow-xs group"
              >
                <div className="space-y-0.5 max-w-[70%]">
                  <div className="font-bold text-[#1E1B2E] text-xs truncate flex items-center gap-1.5">
                    <span>{doc.title}</span>
                  </div>
                  <div className="text-[11px] text-[#5F5A72] flex items-center gap-2">
                    <span className="font-mono text-[#6F42C1] font-bold">{doc.version}</span>
                    <span>• Updated: {doc.lastUpdatedDate}</span>
                    <span>• By: {doc.lastModifiedBy}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    doc.status === 'active' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {doc.status}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#817B91] group-hover:text-[#8E2D9D] group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] flex items-center justify-between text-[11px] text-[#5F5A72]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
              <span>DPDP Act 2023 & GST SAC 998314 Compliant</span>
            </span>
            <span className="font-mono text-[#059669] font-semibold">100% Verified</span>
          </div>
        </div>

        {/* Visitor Telemetry & Privacy Monitoring Summary */}
        <div className="p-6 rounded-2xl bg-white border border-[#E8E0F0] shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#E8E0F0]">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-[#059669]" />
              <h3 className="text-sm font-bold text-[#1E1B2E]">Privacy-Conscious Visitor Telemetry</h3>
            </div>
            <button 
              onClick={() => setActiveTab('visitor_monitoring')}
              className="text-xs text-[#059669] hover:text-emerald-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              View Analytics ({visitorEvents.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0]">
              <div className="text-[10px] uppercase font-bold text-[#817B91]">Total Telemetry Events</div>
              <div className="text-lg font-black text-[#1E1B2E] font-mono mt-1">{visitorEvents.length}</div>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0]">
              <div className="text-[10px] uppercase font-bold text-[#817B91]">Unique Sessions</div>
              <div className="text-lg font-black text-[#8E2D9D] font-mono mt-1">
                {new Set(visitorEvents.map(v => v.sessionId)).size}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0]">
              <div className="text-[10px] uppercase font-bold text-[#817B91]">Telemetry Status</div>
              <div className="text-xs font-bold text-[#059669] font-mono mt-2 flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{isVisitorTrackingEnabled ? 'Active' : 'Paused'}</span>
              </div>
            </div>
          </div>

          {/* Recent Events Feed */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-[#817B91] uppercase tracking-wider">Recent Inbound Traffic</div>
            {visitorEvents.length === 0 ? (
              <div className="p-4 text-center text-xs text-[#5F5A72] bg-[#FAF5FF] rounded-xl border border-[#E8E0F0]">
                No recent visitor traffic recorded yet.
              </div>
            ) : (
              visitorEvents.slice(0, 3).map(ev => (
                <div key={ev.id} className="p-2.5 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-[#1E1B2E] flex items-center gap-2">
                      <span className="text-[11px] font-mono text-[#6F42C1]">{ev.pagePath || '/'}{ev.sectionId || ''}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-white text-[#5F5A72] border border-[#E8E0F0] font-mono">
                        {ev.deviceType} • {ev.browser}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#817B91]">{ev.region || 'India'} • Ref: {ev.referrer || 'direct'}</div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#F3E8FF] text-[#8E2D9D] border border-[#E8E0F0]">
                      {ev.eventType}
                    </span>
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

