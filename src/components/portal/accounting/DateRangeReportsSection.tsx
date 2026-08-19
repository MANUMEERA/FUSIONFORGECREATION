import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Download, 
  Printer, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle,
  Filter,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { useToast } from '../../../context/ToastContext';

type ReportPreset = 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';

export const DateRangeReportsSection: React.FC = () => {
  const { invoices, purchases, expenses, salaryRecords, agencyConfig } = useApp();
  const { success } = useToast();

  const [preset, setPreset] = useState<ReportPreset>('monthly');

  // Custom date range defaults
  const todayStr = new Date().toISOString().split('T')[0];
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(todayStr);

  // Set preset ranges
  const applyPreset = (newPreset: ReportPreset) => {
    setPreset(newPreset);
    const now = new Date();

    if (newPreset === 'weekly') {
      const lastWeek = new Date(now.getTime() - 7 * 86400000);
      setStartDate(lastWeek.toISOString().split('T')[0]);
      setEndDate(now.toISOString().split('T')[0]);
    } else if (newPreset === 'monthly') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      setStartDate(monthStart.toISOString().split('T')[0]);
      setEndDate(now.toISOString().split('T')[0]);
    } else if (newPreset === 'quarterly') {
      // Current FY Quarter
      const currentMonth = now.getMonth(); // 0 to 11
      const qStartMonth = Math.floor(currentMonth / 3) * 3;
      const quarterStart = new Date(now.getFullYear(), qStartMonth, 1);
      setStartDate(quarterStart.toISOString().split('T')[0]);
      setEndDate(now.toISOString().split('T')[0]);
    } else if (newPreset === 'yearly') {
      // FY 2026-27 (Apr 1 to Mar 31)
      const fyStart = new Date(2026, 3, 1); // Apr 1 2026
      setStartDate(fyStart.toISOString().split('T')[0]);
      setEndDate(now.toISOString().split('T')[0]);
    }
  };

  // Helper date checker
  const isDateInRange = (dateStr?: string) => {
    if (!dateStr) return true;
    return dateStr >= startDate && dateStr <= endDate;
  };

  // Filtered Datasets within active Date Range
  const filteredInvoices = useMemo(() => {
    return invoices.filter(i => !i.isDeleted && isDateInRange(i.issueDate));
  }, [invoices, startDate, endDate]);

  const filteredPurchases = useMemo(() => {
    return purchases.filter(p => isDateInRange(p.purchaseDate));
  }, [purchases, startDate, endDate]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => isDateInRange(e.expenseDate));
  }, [expenses, startDate, endDate]);

  const filteredSalaries = useMemo(() => {
    return salaryRecords.filter(s => isDateInRange(s.paymentDate || `${s.periodYear}-${s.periodMonth}-01`));
  }, [salaryRecords, startDate, endDate]);

  // Aggregated Financial Metrics
  // 1. Inward Revenue
  const totalInvoicedAmount = filteredInvoices.reduce((sum, i) => sum + i.totalAmount, 0);
  const totalTaxableRevenue = filteredInvoices.reduce((sum, i) => sum + i.taxableAmount, 0);
  const totalOutputGstCollected = filteredInvoices.reduce((sum, i) => sum + (i.totalTax ?? (i.cgstAmount + i.sgstAmount + (i.utgstAmount || 0) + i.igstAmount)), 0);
  const totalRevenueCollected = filteredInvoices.reduce((sum, i) => sum + (i.paidAmount || 0), 0);

  // 2. Outflow: Purchases
  const totalPurchasesAmount = filteredPurchases.reduce((sum, p) => sum + p.totalAmount, 0);
  const totalPurchasesTaxable = filteredPurchases.reduce((sum, p) => sum + p.taxableAmount, 0);
  const totalPurchasesItcGst = filteredPurchases.reduce((sum, p) => sum + (p.cgstAmount + p.sgstAmount + p.igstAmount), 0);

  // 3. Outflow: Operational Expenses (OPEX)
  const totalExpensesAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalExpensesGst = filteredExpenses.reduce((sum, e) => sum + (e.gstAmount || 0), 0);

  // 4. Outflow: Salary & Payroll
  const totalGrossSalaries = filteredSalaries.reduce((sum, s) => sum + s.grossSalary, 0);
  const totalNetSalariesDisbursed = filteredSalaries.reduce((sum, s) => sum + s.netSalary, 0);
  const totalSalaryDeductions = filteredSalaries.reduce((sum, s) => sum + s.totalDeductions, 0);

  // 5. Total Cost of Operations & Outflow
  const totalOutflow = totalPurchasesAmount + totalExpensesAmount + totalGrossSalaries;

  // 6. Net Operating Profit / Loss
  const netOperatingProfit = totalInvoicedAmount - totalOutflow;
  const profitMarginPercent = totalInvoicedAmount > 0 
    ? Math.round((netOperatingProfit / totalInvoicedAmount) * 100) 
    : 0;

  // 7. Net GST Liability (Output GST - Total ITC)
  const totalInputTaxCredit = totalPurchasesItcGst + totalExpensesGst;
  const netGstPayable = totalOutputGstCollected - totalInputTaxCredit;

  // CSV Export
  const handleExportCsv = () => {
    const csvRows = [
      ['FUSION FORGE CREATIONS - FINANCIAL P&L STATEMENT'],
      ['Reporting Period', `${startDate} to ${endDate}`],
      ['Generated On', new Date().toLocaleString('en-IN')],
      [],
      ['SECTION', 'LINE ITEM', 'AMOUNT (INR)'],
      ['REVENUE', 'Total Gross Invoiced (Sales)', totalInvoicedAmount],
      ['REVENUE', 'Base Taxable Service Revenue', totalTaxableRevenue],
      ['REVENUE', 'Output GST Collected (18%)', totalOutputGstCollected],
      ['REVENUE', 'Realized Inflow (Collected)', totalRevenueCollected],
      [],
      ['EXPENSES & PURCHASES', 'Purchases & Vendor Bills', totalPurchasesAmount],
      ['EXPENSES & PURCHASES', 'Operating Expenses (OPEX)', totalExpensesAmount],
      ['EXPENSES & PURCHASES', 'Employee Payroll & Salaries', totalGrossSalaries],
      ['EXPENSES & PURCHASES', 'TOTAL EXPENDITURE / OUTFLOW', totalOutflow],
      [],
      ['PROFIT & LOSS', 'NET OPERATING PROFIT / (LOSS)', netOperatingProfit],
      ['PROFIT & LOSS', 'Net Operating Margin (%)', `${profitMarginPercent}%`],
      [],
      ['GST LEDGER', 'Output GST Collected (Sales Invoices)', totalOutputGstCollected],
      ['GST LEDGER', 'Input Tax Credit Claimable (Purchases + OPEX)', totalInputTaxCredit],
      ['GST LEDGER', 'NET GST PAYABLE / (REFUNDABLE)', netGstPayable]
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FFC_Financial_Report_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('Exported Financial P&L Report to CSV successfully.');
  };

  return (
    <div className="space-y-6">
      {/* Date Range Selector Header */}
      <div className="bg-white border border-[#E8E0F0] p-5 rounded-2xl shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-[#1E1B2E] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#8E2D9D]" />
              <span>Accounting & Date-Range Financial Reports</span>
            </h3>
            <p className="text-xs text-[#5F5A72] mt-0.5">
              Comprehensive Profit & Loss, Cashflow, Purchases, OPEX, Payroll, and GST Balance
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2">
            {(['weekly', 'monthly', 'quarterly', 'yearly', 'custom'] as const).map(p => (
              <button
                key={p}
                onClick={() => applyPreset(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                  preset === p
                    ? 'bg-[#8E2D9D] text-white shadow-xs'
                    : 'bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#5F5A72] border border-[#E8E0F0]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Date Range Inputs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#E8E0F0] text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[#5F5A72] font-semibold">Active Window:</span>
            <div className="flex items-center space-x-2 bg-[#FAF5FF] px-3 py-1.5 rounded-xl border border-[#E8E0F0]">
              <Calendar className="w-3.5 h-3.5 text-[#8E2D9D]" />
              <input
                type="date"
                value={startDate}
                onChange={e => {
                  setStartDate(e.target.value);
                  setPreset('custom');
                }}
                className="bg-transparent text-[#1E1B2E] font-mono outline-none cursor-pointer"
              />
              <span className="text-[#817B91]">to</span>
              <input
                type="date"
                value={endDate}
                onChange={e => {
                  setEndDate(e.target.value);
                  setPreset('custom');
                }}
                className="bg-transparent text-[#1E1B2E] font-mono outline-none cursor-pointer"
              />
            </div>
            <span className="text-[11px] text-[#8E2D9D] font-mono font-semibold">
              ({filteredInvoices.length} invoices, {filteredPurchases.length} purchases, {filteredExpenses.length} expenses)
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#059669] border border-emerald-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1E1B2E] border border-[#E8E0F0] font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Level P&L KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inward Revenue */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8E0F0] shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-[#5F5A72] font-bold uppercase tracking-wider">Gross Invoiced Revenue</span>
              <div className="text-2xl sm:text-3xl font-black text-[#1E1B2E] font-mono mt-2">
                ₹{totalInvoicedAmount.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="p-2 rounded-xl bg-[#FAF5FF] text-[#8E2D9D] border border-[#C084FC]/40">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[11px] text-[#817B91] mt-2">
            Taxable Base: ₹{totalTaxableRevenue.toLocaleString('en-IN')}
          </div>
        </div>

        {/* Total Operational Outflow */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8E0F0] shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-rose-600 font-bold uppercase tracking-wider">Total Outflow & Costs</span>
              <div className="text-2xl sm:text-3xl font-black text-rose-600 font-mono mt-2">
                ₹{totalOutflow.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[11px] text-[#817B91] mt-2">
            Purchases + OPEX + Payroll
          </div>
        </div>

        {/* Net Operating Profit */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8E0F0] shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-[#059669] font-bold uppercase tracking-wider">Net Operating Profit</span>
              <div className={`text-2xl sm:text-3xl font-black font-mono mt-2 ${netOperatingProfit >= 0 ? 'text-[#059669]' : 'text-rose-600'}`}>
                ₹{netOperatingProfit.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="p-2 rounded-xl bg-emerald-50 text-[#059669] border border-emerald-200">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[11px] text-[#059669] font-bold mt-2">
            Operating Margin: {profitMarginPercent}%
          </div>
        </div>

        {/* Net GST Balance */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8E0F0] shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-[#8E2D9D] font-bold uppercase tracking-wider">Net GST Position</span>
              <div className="text-2xl sm:text-3xl font-black text-[#8E2D9D] font-mono mt-2">
                ₹{Math.abs(netGstPayable).toLocaleString('en-IN')}
              </div>
            </div>
            <div className="p-2 rounded-xl bg-[#FAF5FF] text-[#8E2D9D] border border-[#C084FC]/40">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[11px] text-[#5F5A72] mt-2">
            {netGstPayable >= 0 ? 'Govt Tax Payable (GSTR-3B)' : 'Input Credit Refund Carry-forward'}
          </div>
        </div>
      </div>

      {/* Outflow Breakdown Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Outflow Breakdown Bar */}
        <div className="p-6 rounded-2xl bg-white border border-[#E8E0F0] shadow-xs space-y-4">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#1E1B2E]">
            Outflow Breakdown (Cost Centers)
          </h4>

          {/* Visual distribution bar */}
          <div className="w-full bg-[#FAF5FF] rounded-full h-4 p-0.5 border border-[#E8E0F0] flex overflow-hidden">
            <div 
              className="bg-[#8E2D9D] h-full rounded-l-full" 
              style={{ width: `${totalOutflow > 0 ? (totalPurchasesAmount / totalOutflow) * 100 : 33}%` }} 
              title="Purchases"
            />
            <div 
              className="bg-rose-500 h-full" 
              style={{ width: `${totalOutflow > 0 ? (totalExpensesAmount / totalOutflow) * 100 : 33}%` }} 
              title="Operating Expenses"
            />
            <div 
              className="bg-purple-400 h-full rounded-r-full" 
              style={{ width: `${totalOutflow > 0 ? (totalGrossSalaries / totalOutflow) * 100 : 34}%` }} 
              title="Salaries"
            />
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#8E2D9D]"></span>
                <span className="text-[#5F5A72] font-semibold">Vendor Purchases & Bills</span>
              </div>
              <span className="font-mono font-bold text-[#1E1B2E]">₹{totalPurchasesAmount.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span className="text-[#5F5A72] font-semibold">Operating Expenses (OPEX)</span>
              </div>
              <span className="font-mono font-bold text-[#1E1B2E]">₹{totalExpensesAmount.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-400"></span>
                <span className="text-[#5F5A72] font-semibold">Salary & Employee Payroll</span>
              </div>
              <span className="font-mono font-bold text-[#1E1B2E]">₹{totalGrossSalaries.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* GST Settlement Ledger */}
        <div className="p-6 rounded-2xl bg-white border border-[#E8E0F0] shadow-xs space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#1E1B2E] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8E2D9D]" />
              <span>Goods & Services Tax (GST) Balance Ledger</span>
            </h4>
            <span className="text-[11px] text-[#5F5A72] font-mono">SAC 998314 & GSTR-3B Reconciled</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] space-y-1">
              <div className="text-[#5F5A72] text-[11px]">Output GST Collected</div>
              <div className="text-xl font-black text-[#8E2D9D] font-mono">₹{totalOutputGstCollected.toLocaleString('en-IN')}</div>
              <div className="text-[10px] text-[#817B91]">From Client Invoices</div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
              <div className="text-[#5F5A72] text-[11px]">Input Tax Credit (ITC)</div>
              <div className="text-xl font-black text-[#059669] font-mono">₹{totalInputTaxCredit.toLocaleString('en-IN')}</div>
              <div className="text-[10px] text-[#817B91]">Purchases & Expenses</div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF5FF] border border-[#C084FC]/40 space-y-1">
              <div className="text-[#5F5A72] text-[11px]">Net GST Payable</div>
              <div className="text-xl font-black text-[#8E2D9D] font-mono">₹{Math.max(0, netGstPayable).toLocaleString('en-IN')}</div>
              <div className="text-[10px] text-[#817B91]">Due for GSTR-3B Filing</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#5F5A72] space-y-2">
            <div className="flex justify-between items-center">
              <span>Odisha State GSTIN:</span>
              <span className="font-mono font-bold text-[#8E2D9D]">{agencyConfig.gstin || '21AAACF9876B1Z5'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Primary HSN/SAC Classification:</span>
              <span className="font-mono font-bold text-[#1E1B2E]">998314 - Information Technology Design and Development</span>
            </div>
            <div className="flex justify-between items-center">
              <span>GST Threshold Exemption / Standard Rate:</span>
              <span className="font-bold text-[#059669]">18.00% (9% CGST + 9% SGST / 18% IGST)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
