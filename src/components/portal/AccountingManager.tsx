import React, { useState } from 'react';
import { 
  Calculator, 
  Receipt, 
  Download, 
  FileSpreadsheet, 
  CheckCircle2, 
  TrendingUp, 
  Building2, 
  PieChart as PieChartIcon, 
  AlertCircle,
  Calendar,
  Layers,
  ArrowDownRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AccountingManager: React.FC = () => {
  const { invoices, payments, agencyConfig } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('FY 2026-27');
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'gstr1' | 'gstr3b' | 'ledger'>('overview');

  // Compute Tax Metrics from active (non-deleted) invoice data
  const activeInvoices = invoices.filter(inv => !inv.isDeleted);
  const totalInvoiced = activeInvoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalTaxable = activeInvoices.reduce((acc, inv) => acc + inv.taxableAmount, 0);
  const totalCgst = activeInvoices.reduce((acc, inv) => acc + (inv.cgstAmount || 0), 0);
  const totalSgst = activeInvoices.reduce((acc, inv) => acc + (inv.sgstAmount || 0), 0);
  const totalUtgst = activeInvoices.reduce((acc, inv) => acc + (inv.utgstAmount || 0), 0);
  const totalIgst = activeInvoices.reduce((acc, inv) => acc + (inv.igstAmount || 0), 0);
  const totalGstCollected = totalCgst + totalSgst + totalUtgst + totalIgst;
  const totalReceived = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalPendingReceivable = activeInvoices.reduce((acc, inv) => acc + inv.balanceDue, 0);

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
            Accounting & GST Compliance
          </h1>
          <p className="text-sm text-slate-400">
            GSTIN: <span className="font-mono text-white">{agencyConfig.gstin}</span> • SAC Code: <span className="font-mono text-cyan-400">998314</span> (IT Software Services)
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={e => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 outline-none"
          >
            <option value="FY 2026-27">FY 2026-27 (Current)</option>
            <option value="Q2 2026">Q2 2026 (Jul - Sep)</option>
            <option value="Q1 2026">Q1 2026 (Apr - Jun)</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center space-x-2 border border-slate-700 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-800/80 pb-3">
        {[
          { id: 'overview', label: 'Financial Summary' },
          { id: 'gstr1', label: 'GSTR-1 (Outward Supplies)' },
          { id: 'gstr3b', label: 'GSTR-3B (Tax Liability)' },
          { id: 'ledger', label: 'SAC 998314 Ledger' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeSubTab === tab.id
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Bento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-xs text-slate-400 font-medium mb-1">Total Invoiced (Gross)</div>
              <div className="text-2xl font-black text-white">₹{totalInvoiced.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-slate-400 mt-1">Across {invoices.length} tax invoices</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-xs text-slate-400 font-medium mb-1">Taxable Turnover (Net)</div>
              <div className="text-2xl font-black text-cyan-400">₹{totalTaxable.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-slate-400 mt-1">Under SAC 998314 @ 18%</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-xs text-slate-400 font-medium mb-1">Total Output GST</div>
              <div className="text-2xl font-black text-emerald-400">₹{totalGstCollected.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-emerald-400/80 mt-1">CGST + SGST + IGST Collected</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-xs text-slate-400 font-medium mb-1">Receivables Outstanding</div>
              <div className="text-2xl font-black text-amber-400">₹{totalPendingReceivable.toLocaleString('en-IN')}</div>
              <div className="text-[11px] text-amber-400/80 mt-1">Pending client settlement</div>
            </div>
          </div>

          {/* Tax Component Breakdown Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 lg:col-span-2 space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-blue-400" />
                GST Tax Component Summary
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium">CGST (9%)</div>
                  <div className="text-lg font-bold text-white mt-1">₹{totalCgst.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Central Intra-State</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium">SGST (9%)</div>
                  <div className="text-lg font-bold text-white mt-1">₹{totalSgst.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">State Intra-State</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium">UTGST (9%)</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1">₹{totalUtgst.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Union Territory (DNH/DD)</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium">IGST (18%)</div>
                  <div className="text-lg font-bold text-cyan-400 mt-1">₹{totalIgst.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Inter-State Pan-India</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-slate-300 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Full GST Compliance: </span>
                  All tax invoices generated automatically assign SAC Code 998314 with reverse-charge applicability checks and B2B ITC readiness.
                </div>
              </div>
            </div>

            {/* Quick GSTR Filing Checklist */}
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                Statutory Filing Calendar
              </h2>

              <div className="space-y-3 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">GSTR-1 Monthly Return</div>
                    <div className="text-[10px] text-slate-400">Due 11th of every month</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Ready
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">GSTR-3B Summary Return</div>
                    <div className="text-[10px] text-slate-400">Due 20th of every month</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Ready
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">Annual Return (GSTR-9)</div>
                    <div className="text-[10px] text-slate-400">Due 31st December 2026</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-700 text-slate-300">
                    Pending
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GSTR-1 View */}
      {activeSubTab === 'gstr1' && (
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-white">GSTR-1 Table 4A, 4B, 4C, 6B, 6C: B2B Invoices</h3>
            <span className="text-xs text-slate-400 font-mono">SAC 998314 Supply</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/50 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Invoice #</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Customer Name</th>
                  <th className="p-3.5">GSTIN of Recipient</th>
                  <th className="p-3.5 text-right">Taxable Value</th>
                  <th className="p-3.5 text-right">Integrated Tax</th>
                  <th className="p-3.5 text-right">Central Tax</th>
                  <th className="p-3.5 text-right">State Tax</th>
                  <th className="p-3.5 text-right">Invoice Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {activeInvoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-800/30">
                    <td className="p-3.5 font-mono font-bold text-white">{inv.invoiceNumber}</td>
                    <td className="p-3.5 text-slate-300">{inv.issueDate}</td>
                    <td className="p-3.5 font-semibold text-white">{inv.clientCompany || inv.clientName}</td>
                    <td className="p-3.5 font-mono text-cyan-400">{inv.clientGstin || 'Unregistered'}</td>
                    <td className="p-3.5 text-right font-mono">₹{inv.taxableAmount.toLocaleString('en-IN')}</td>
                    <td className="p-3.5 text-right font-mono text-slate-300">₹{(inv.igstAmount || 0).toLocaleString('en-IN')}</td>
                    <td className="p-3.5 text-right font-mono text-slate-300">₹{(inv.cgstAmount || 0).toLocaleString('en-IN')}</td>
                    <td className="p-3.5 text-right font-mono text-slate-300">₹{((inv.sgstAmount || 0) + (inv.utgstAmount || 0)).toLocaleString('en-IN')}</td>
                    <td className="p-3.5 text-right font-mono font-bold text-white">₹{inv.totalAmount.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* GSTR-3B View */}
      {activeSubTab === 'gstr3b' && (
        <div className="p-6 rounded-xl border border-slate-800/80 bg-slate-900/40 space-y-4 text-xs">
          <h3 className="font-bold text-sm text-white">Table 3.1: Details of Outward Supplies and inward supplies liable to reverse charge</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-800/50 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Nature of Supplies</th>
                  <th className="p-3.5 text-right">Total Taxable Value</th>
                  <th className="p-3.5 text-right">Integrated Tax</th>
                  <th className="p-3.5 text-right">Central Tax</th>
                  <th className="p-3.5 text-right">State / UT Tax</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                <tr>
                  <td className="p-3.5 font-sans font-medium text-white">
                    (a) Outward taxable supplies (other than zero rated, nil rated and exempted)
                  </td>
                  <td className="p-3.5 text-right font-bold text-white">₹{totalTaxable.toLocaleString('en-IN')}</td>
                  <td className="p-3.5 text-right text-cyan-400">₹{totalIgst.toLocaleString('en-IN')}</td>
                  <td className="p-3.5 text-right text-slate-300">₹{totalCgst.toLocaleString('en-IN')}</td>
                  <td className="p-3.5 text-right text-slate-300">₹{(totalSgst + totalUtgst).toLocaleString('en-IN')}</td>
                </tr>
                <tr className="bg-slate-800/20 font-bold text-slate-200">
                  <td className="p-3.5 font-sans">Total Tax Payable</td>
                  <td className="p-3.5 text-right">₹{totalTaxable.toLocaleString('en-IN')}</td>
                  <td className="p-3.5 text-right text-cyan-400">₹{totalIgst.toLocaleString('en-IN')}</td>
                  <td className="p-3.5 text-right">₹{totalCgst.toLocaleString('en-IN')}</td>
                  <td className="p-3.5 text-right">₹{(totalSgst + totalUtgst).toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SAC 998314 Ledger */}
      {activeSubTab === 'ledger' && (
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5 space-y-4">
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
                  <div className="text-[10px] text-slate-400">Tax: ₹{((inv.cgstAmount || 0) + (inv.sgstAmount || 0) + (inv.utgstAmount || 0) + (inv.igstAmount || 0)).toLocaleString('en-IN')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
