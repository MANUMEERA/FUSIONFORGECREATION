import React, { useState } from 'react';
import { 
  Calculator, 
  ShoppingBag, 
  CreditCard, 
  Users, 
  BarChart3, 
  FileSpreadsheet, 
  Receipt,
  FileText,
  Calendar,
  Layers,
  ShieldCheck,
  Building2,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PurchasesSection } from './accounting/PurchasesSection';
import { ExpensesSection } from './accounting/ExpensesSection';
import { SalarySection } from './accounting/SalarySection';
import { DateRangeReportsSection } from './accounting/DateRangeReportsSection';
import { GstReportsSection } from './accounting/GstReportsSection';
import { CreditDebitNotesSection } from './accounting/CreditDebitNotesSection';

export const AccountingManager: React.FC = () => {
  const { invoices, creditDebitNotes, purchases, expenses, salaryRecords, agencyConfig } = useApp();
  const [activeTab, setActiveTab] = useState<'reports' | 'gst_reports' | 'credit_debit' | 'purchases' | 'expenses' | 'salary' | 'ledger'>('gst_reports');

  // Compute Tax Metrics from active invoice data
  const activeInvoices = invoices.filter(inv => !inv.isDeleted);
  const totalInvoiced = activeInvoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalTaxable = activeInvoices.reduce((acc, inv) => acc + inv.taxableAmount, 0);
  const totalCgst = activeInvoices.reduce((acc, inv) => acc + (inv.cgstAmount || 0), 0);
  const totalSgst = activeInvoices.reduce((acc, inv) => acc + (inv.sgstAmount || 0), 0);
  const totalUtgst = activeInvoices.reduce((acc, inv) => acc + (inv.utgstAmount || 0), 0);
  const totalIgst = activeInvoices.reduce((acc, inv) => acc + (inv.igstAmount || 0), 0);
  const totalGstCollected = totalCgst + totalSgst + totalUtgst + totalIgst;

  // Export GST Report CSV
  const handleExportCSV = () => {
    const headers = ['Invoice Number', 'Issue Date', 'Client Name', 'Client GSTIN', 'SAC Code', 'Taxable Amount', 'GST Type', 'CGST (9%)', 'SGST (9%)', 'UTGST (9%)', 'IGST (18%)', 'Total Invoice Value', 'Status'];
    const rows = activeInvoices.map(inv => [
      inv.invoiceNumber,
      inv.issueDate,
      `"${inv.clientCompany || inv.clientName}"`,
      inv.clientGstin || 'Unregistered B2C',
      '998314',
      inv.taxableAmount,
      inv.gstType.toUpperCase(),
      inv.cgstAmount || 0,
      inv.sgstAmount || 0,
      inv.utgstAmount || 0,
      inv.igstAmount || 0,
      inv.totalAmount,
      inv.status.toUpperCase()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Fusion_Forge_GST_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Calculator className="w-6 h-6 text-cyan-400" />
            Financials, GST Compliance & Accounting Suite
          </h1>
          <p className="text-sm text-slate-400">
            GSTIN: <span className="font-mono text-white font-semibold">{agencyConfig.gstin || '26AALFF1234F1Z5'}</span> • Primary SAC: <span className="font-mono text-cyan-400 font-bold">998314</span> (IT Software Design & Development)
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center space-x-2 border border-slate-700 transition-colors shadow-sm cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export Master CSV</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/80 pb-3">
        {[
          { id: 'gst_reports', label: 'GSTR-1 & 3B Statutory Returns', icon: Receipt },
          { id: 'credit_debit', label: `Credit / Debit Notes (${creditDebitNotes.filter(n => !n.isDeleted).length})`, icon: ArrowDownLeft },
          { id: 'reports', label: 'P&L Reports & Date Range', icon: BarChart3 },
          { id: 'purchases', label: `Purchases & ITC (${purchases.length})`, icon: ShoppingBag },
          { id: 'expenses', label: `Operating Expenses (${expenses.length})`, icon: CreditCard },
          { id: 'salary', label: `Salary & Payroll (${salaryRecords.length})`, icon: Users },
          { id: 'ledger', label: 'SAC 998314 Matrix', icon: Layers }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-500/20 font-extrabold'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: GSTR-1 & GSTR-3B Statutory Outward Return Suite */}
      {activeTab === 'gst_reports' && <GstReportsSection />}

      {/* Tab 2: Credit & Debit Note Management (CDNR) */}
      {activeTab === 'credit_debit' && <CreditDebitNotesSection />}

      {/* Tab 3: P&L Date Range Reports */}
      {activeTab === 'reports' && <DateRangeReportsSection />}

      {/* Tab 4: Purchases */}
      {activeTab === 'purchases' && <PurchasesSection />}

      {/* Tab 5: Operating Expenses */}
      {activeTab === 'expenses' && <ExpensesSection />}

      {/* Tab 6: Salary & Payroll */}
      {activeTab === 'salary' && <SalarySection />}

      {/* Tab 7: SAC 998314 Ledger */}
      {activeTab === 'ledger' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white">SAC 998314 Service Breakdown</h3>
              <p className="text-xs text-slate-400">Information technology software design and development services</p>
            </div>
            <div className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono text-xs font-bold">
              Standard Rate: 18% GST
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {activeInvoices.map(inv => (
              <div key={inv.id} className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">{inv.title}</div>
                  <div className="text-[11px] text-slate-400">
                    {inv.invoiceNumber} • Client: {inv.clientCompany || inv.clientName}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-emerald-400 text-sm">₹{inv.totalAmount.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-slate-400 font-mono">Tax: ₹{((inv.cgstAmount || 0) + (inv.sgstAmount || 0) + (inv.utgstAmount || 0) + (inv.igstAmount || 0)).toLocaleString('en-IN')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
