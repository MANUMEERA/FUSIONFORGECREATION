import React, { useState, useMemo } from 'react';
import { 
  Receipt, 
  FileSpreadsheet, 
  Printer, 
  Download, 
  Calendar, 
  Filter, 
  ShieldCheck, 
  Building2, 
  ArrowUpRight, 
  ArrowDownRight, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  Search
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { useToast } from '../../../context/ToastContext';
import { exportGstr1Workbook, isB2BRecipient, getStandardGstPlaceOfSupply, getGstr1InvoiceType } from '../../../utils/gstr1ExcelExporter';
import { formatDateGstr1, formatDateDDMMYYYY } from '../../../utils/dateUtils';
import { CreditDebitNote, Invoice } from '../../../types';

type DateRangePreset = 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';

export const GstReportsSection: React.FC = () => {
  const { invoices, creditDebitNotes, agencyConfig } = useApp();
  const { success, info } = useToast();

  const [preset, setPreset] = useState<DateRangePreset>('monthly');

  // Custom date range state
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(todayStr);

  const [activeReportTab, setActiveReportTab] = useState<'b2b' | 'b2c' | 'cdnr' | 'hsn' | 'docs' | 'gstr3b'>('b2b');
  const [searchTerm, setSearchTerm] = useState('');

  // Handle Preset Switching
  const handlePresetChange = (newPreset: DateRangePreset) => {
    setPreset(newPreset);
    const currentDate = new Date();

    if (newPreset === 'weekly') {
      const lastWeek = new Date(currentDate.getTime() - 7 * 86400000);
      setStartDate(lastWeek.toISOString().split('T')[0]);
      setEndDate(currentDate.toISOString().split('T')[0]);
    } else if (newPreset === 'monthly') {
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      setStartDate(monthStart.toISOString().split('T')[0]);
      setEndDate(currentDate.toISOString().split('T')[0]);
    } else if (newPreset === 'quarterly') {
      // Indian Financial Year Quarter: Q1 (Apr-Jun), Q2 (Jul-Sep), Q3 (Oct-Dec), Q4 (Jan-Mar)
      const currentMonth = currentDate.getMonth(); // 0-11
      let qStartMonth = 3; // default April
      if (currentMonth >= 3 && currentMonth <= 5) qStartMonth = 3; // Q1: Apr
      else if (currentMonth >= 6 && currentMonth <= 8) qStartMonth = 6; // Q2: Jul
      else if (currentMonth >= 9 && currentMonth <= 11) qStartMonth = 9; // Q3: Oct
      else qStartMonth = 0; // Q4: Jan

      const qYear = currentDate.getFullYear();
      const quarterStart = new Date(qYear, qStartMonth, 1);
      setStartDate(quarterStart.toISOString().split('T')[0]);
      setEndDate(currentDate.toISOString().split('T')[0]);
    } else if (newPreset === 'yearly') {
      // FY 2026-27 (Apr 1, 2026 to Mar 31, 2027)
      const fyStart = new Date(2026, 3, 1);
      const fyEnd = new Date(2027, 2, 31);
      setStartDate(fyStart.toISOString().split('T')[0]);
      setEndDate(currentDate <= fyEnd ? currentDate.toISOString().split('T')[0] : fyEnd.toISOString().split('T')[0]);
    }
  };

  // Helper date checker
  const isDateInRange = (dateStr?: string) => {
    if (!dateStr) return true;
    const clean = dateStr.split('T')[0];
    return clean >= startDate && clean <= endDate;
  };

  // Filtered Invoices and Credit/Debit Notes within active Date Range
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => !inv.isDeleted && inv.status !== 'draft' && isDateInRange(inv.issueDate || inv.issue_date));
  }, [invoices, startDate, endDate]);

  const filteredCreditDebitNotes = useMemo(() => {
    return creditDebitNotes.filter(note => !note.isDeleted && note.status !== 'draft' && isDateInRange(note.issueDate || note.issue_date));
  }, [creditDebitNotes, startDate, endDate]);

  // Breakdown: B2B Invoices (has GSTIN) vs B2C Invoices (unregistered)
  const b2bInvoices = useMemo(() => {
    return filteredInvoices.filter(inv => isB2BRecipient(inv.buyerGstin || inv.clientGstin));
  }, [filteredInvoices]);

  const b2cInvoices = useMemo(() => {
    return filteredInvoices.filter(inv => !isB2BRecipient(inv.buyerGstin || inv.clientGstin));
  }, [filteredInvoices]);

  const creditNotes = useMemo(() => {
    return filteredCreditDebitNotes.filter(n => n.noteType === 'credit');
  }, [filteredCreditDebitNotes]);

  const debitNotes = useMemo(() => {
    return filteredCreditDebitNotes.filter(n => n.noteType === 'debit');
  }, [filteredCreditDebitNotes]);

  // Summary Metrics
  const grossInvoicedValue = filteredInvoices.reduce((sum, i) => sum + (i.totalAmount || 0), 0);
  const grossTaxableValue = filteredInvoices.reduce((sum, i) => sum + (i.taxableAmount || 0), 0);
  const totalIgst = filteredInvoices.reduce((sum, i) => sum + (i.igstAmount || 0), 0);
  const totalCgst = filteredInvoices.reduce((sum, i) => sum + (i.cgstAmount || 0), 0);
  const totalSgstUtgst = filteredInvoices.reduce((sum, i) => sum + (i.sgstAmount || 0) + (i.utgstAmount || 0), 0);
  const totalOutputGst = totalIgst + totalCgst + totalSgstUtgst;

  // Credit / Debit Note Adjustments
  const totalCnTaxable = creditNotes.reduce((sum, c) => sum + (c.taxableAmount || 0), 0);
  const totalCnTax = creditNotes.reduce((sum, c) => sum + (c.totalTax || ((c.cgstAmount || 0) + (c.sgstAmount || 0) + (c.utgstAmount || 0) + (c.igstAmount || 0))), 0);

  const totalDnTaxable = debitNotes.reduce((sum, d) => sum + (d.taxableAmount || 0), 0);
  const totalDnTax = debitNotes.reduce((sum, d) => sum + (d.totalTax || ((d.cgstAmount || 0) + (d.sgstAmount || 0) + (d.utgstAmount || 0) + (d.igstAmount || 0))), 0);

  // Net GSTR-3B Values
  const netGstr3bTaxable = grossTaxableValue - totalCnTaxable + totalDnTaxable;
  const netGstr3bTax = totalOutputGst - totalCnTax + totalDnTax;

  // Period Label
  const periodLabel = useMemo(() => {
    if (preset === 'weekly') return 'Weekly Outward Report';
    if (preset === 'monthly') return `Monthly Return (${formatDateDDMMYYYY(startDate)} to ${formatDateDDMMYYYY(endDate)})`;
    if (preset === 'quarterly') return `Quarterly Return (${formatDateDDMMYYYY(startDate)} to ${formatDateDDMMYYYY(endDate)})`;
    if (preset === 'yearly') return `Annual FY 2026-27 Return`;
    return `Custom Period (${startDate} to ${endDate})`;
  }, [preset, startDate, endDate]);

  // Export Sequence-Based GSTR-1 Excel File
  const handleExportGstr1Excel = () => {
    try {
      const result = exportGstr1Workbook(filteredInvoices, filteredCreditDebitNotes, {
        periodLabel,
        dateRangeType: preset,
        startDate,
        endDate,
        agencyConfig
      });
      success(`GSTR-1 Excel Generated: ${result.fileName} (${result.totalInvoices} Invoices reconciled)`);
    } catch (err) {
      console.error('Failed to export GSTR-1 Excel:', err);
      info('Error compiling GSTR-1 Excel workbook. Please verify browser permissions.');
    }
  };

  // HSN Aggregator for Table 12
  const hsnSummary = useMemo(() => {
    const map: { [key: string]: any } = {};
    filteredInvoices.forEach(inv => {
      const invRate = inv.gstRate !== undefined ? inv.gstRate : 18;
      const isInter = (inv.igstAmount || 0) > 0;
      (inv.items || []).forEach(item => {
        const hsn = item.sacCode || (item as any).sac_code || '998314';
        const key = `${hsn}_${invRate}`;
        const qty = Number(item.quantity) || 1;
        const taxable = Number(item.amount || (item.quantity * item.rate) || 0);

        let igst = 0;
        let cgst = 0;
        let sgstUtgst = 0;

        if (inv.invoiceType === 'SEZ Supply without Tax') {
          // Zero rated
        } else if (isInter) {
          igst = Math.round((taxable * invRate) / 100 * 100) / 100;
        } else {
          cgst = Math.round((taxable * (invRate / 2)) / 100 * 100) / 100;
          sgstUtgst = Math.round((taxable * (invRate / 2)) / 100 * 100) / 100;
        }

        if (!map[key]) {
          map[key] = {
            hsn,
            description: item.description || 'IT Software Development Services',
            uqc: 'OTH-OTHERS',
            totalQuantity: 0,
            totalValue: 0,
            rate: invRate,
            taxableValue: 0,
            igst: 0,
            cgst: 0,
            sgstUtgst: 0
          };
        }

        map[key].totalQuantity += qty;
        map[key].totalValue += taxable + igst + cgst + sgstUtgst;
        map[key].taxableValue += taxable;
        map[key].igst += igst;
        map[key].cgst += cgst;
        map[key].sgstUtgst += sgstUtgst;
      });
    });
    return Object.values(map);
  }, [filteredInvoices]);

  // Documents Sequence for Table 13
  const docSequences = useMemo(() => {
    const allInvs = filteredInvoices;
    const sortedInvs = [...allInvs].sort((a, b) => (a.invoiceNumber || '').localeCompare(b.invoiceNumber || ''));
    const cancelledInvs = sortedInvs.filter(i => i.status === 'cancelled').length;

    const invFrom = sortedInvs.length > 0 ? sortedInvs[0].invoiceNumber : 'FFC-2026-0001';
    const invTo = sortedInvs.length > 0 ? sortedInvs[sortedInvs.length - 1].invoiceNumber : 'FFC-2026-0001';
    const totalInvs = sortedInvs.length;

    const cnFrom = creditNotes.length > 0 ? creditNotes[0].noteNumber : 'N/A';
    const cnTo = creditNotes.length > 0 ? creditNotes[creditNotes.length - 1].noteNumber : 'N/A';

    const dnFrom = debitNotes.length > 0 ? debitNotes[0].noteNumber : 'N/A';
    const dnTo = debitNotes.length > 0 ? debitNotes[debitNotes.length - 1].noteNumber : 'N/A';

    return [
      {
        nature: '1. Invoices for outward supply (Regular / SEZ)',
        from: invFrom,
        to: invTo,
        total: totalInvs,
        cancelled: cancelledInvs,
        net: totalInvs - cancelledInvs
      },
      {
        nature: '2. Credit Notes for outward supply (CDNR / CDNUR)',
        from: cnFrom,
        to: cnTo,
        total: creditNotes.length,
        cancelled: creditNotes.filter(c => c.status === 'cancelled').length,
        net: creditNotes.filter(c => c.status !== 'cancelled').length
      },
      {
        nature: '3. Debit Notes for outward supply (CDNR / CDNUR)',
        from: dnFrom,
        to: dnTo,
        total: debitNotes.length,
        cancelled: debitNotes.filter(d => d.status === 'cancelled').length,
        net: debitNotes.filter(d => d.status !== 'cancelled').length
      }
    ];
  }, [filteredInvoices, creditNotes, debitNotes]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Date Range Controls */}
      <div className="p-5 rounded-2xl bg-white border border-[#E8E0F0] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#F3E8FF] text-[#8E2D9D] border border-[#C084FC]/40 text-[10px] font-bold uppercase tracking-wider font-mono">
                Statutory Return Engine
              </span>
              <span className="text-xs text-[#5F5A72]">
                GSTIN: <strong className="text-[#1E1B2E] font-mono">{agencyConfig.gstin || '26AALFF1234F1Z5'}</strong>
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#1E1B2E] mt-1 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[#8E2D9D]" />
              GSTR-1 & GSTR-3B Statutory Outward Return Suite
            </h2>
            <p className="text-xs text-[#5F5A72]">
              Sequence-based multi-sheet GST return compiler with B2B, B2C, Credit/Debit Notes (CDNR), SAC 998314 HSN breakdown and Table 13 Document Series.
            </p>
          </div>

          {/* Export GSTR-1 Excel Action Button */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportGstr1Excel}
              className="px-4 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs flex items-center space-x-2 shadow-xs transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-100" />
              <span>Export Official GSTR-1 Excel</span>
            </button>
          </div>
        </div>

        {/* Date Range Selector Bar */}
        <div className="pt-3 border-t border-[#E8E0F0] flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Presets */}
          <div className="flex items-center space-x-1.5 bg-[#FAF5FF] p-1 rounded-xl border border-[#E8E0F0]">
            {(['weekly', 'monthly', 'quarterly', 'yearly', 'custom'] as DateRangePreset[]).map(p => (
              <button
                key={p}
                onClick={() => handlePresetChange(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  preset === p
                    ? 'bg-[#8E2D9D] text-white shadow-xs'
                    : 'text-[#5F5A72] hover:text-[#1E1B2E] hover:bg-white'
                }`}
              >
                {p === 'yearly' ? 'Annual (FY 26-27)' : p}
              </button>
            ))}
          </div>

          {/* Date Range Inputs */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#E8E0F0]">
              <Calendar className="w-3.5 h-3.5 text-[#817B91]" />
              <span className="text-[11px] text-[#5F5A72]">From:</span>
              <input
                type="date"
                value={startDate}
                onChange={e => {
                  setStartDate(e.target.value);
                  setPreset('custom');
                }}
                className="bg-transparent text-[#1E1B2E] font-mono text-xs outline-none cursor-pointer"
              />
            </div>
            <div className="flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#E8E0F0]">
              <Calendar className="w-3.5 h-3.5 text-[#817B91]" />
              <span className="text-[11px] text-[#5F5A72]">To:</span>
              <input
                type="date"
                value={endDate}
                onChange={e => {
                  setEndDate(e.target.value);
                  setPreset('custom');
                }}
                className="bg-transparent text-[#1E1B2E] font-mono text-xs outline-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-[#E8E0F0] shadow-xs">
          <div className="text-[10px] text-[#5F5A72] uppercase font-semibold">Gross Invoiced</div>
          <div className="text-base font-bold text-[#1E1B2E] font-mono mt-0.5">
            ₹{grossInvoicedValue.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-[#817B91] mt-0.5">{filteredInvoices.length} Active Invoices</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#E8E0F0] shadow-xs">
          <div className="text-[10px] text-[#5F5A72] uppercase font-semibold">Table 4 (B2B)</div>
          <div className="text-base font-bold text-[#8E2D9D] font-mono mt-0.5">
            ₹{b2bInvoices.reduce((s, i) => s + i.taxableAmount, 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-[#817B91] mt-0.5">{b2bInvoices.length} Registered Bills</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#E8E0F0] shadow-xs">
          <div className="text-[10px] text-[#5F5A72] uppercase font-semibold">Table 7 (B2C)</div>
          <div className="text-base font-bold text-[#059669] font-mono mt-0.5">
            ₹{b2cInvoices.reduce((s, i) => s + i.taxableAmount, 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-[#817B91] mt-0.5">{b2cInvoices.length} Consumer Bills</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#E8E0F0] shadow-xs">
          <div className="text-[10px] text-[#5F5A72] uppercase font-semibold">Table 9B (CN/DN)</div>
          <div className="text-base font-bold text-[#D97706] font-mono mt-0.5">
            -₹{(totalCnTaxable - totalDnTaxable).toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-[#817B91] mt-0.5">{creditNotes.length} CN • {debitNotes.length} DN</div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#E8E0F0] shadow-xs">
          <div className="text-[10px] text-[#5F5A72] uppercase font-semibold">Net Taxable (3B)</div>
          <div className="text-base font-bold text-[#1E1B2E] font-mono mt-0.5">
            ₹{netGstr3bTaxable.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-[#817B91] mt-0.5">Base Taxable Base</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAF5FF] border border-[#C084FC]/40 shadow-xs">
          <div className="text-[10px] text-[#8E2D9D] uppercase font-bold">Net Output Tax</div>
          <div className="text-base font-bold text-[#8E2D9D] font-mono mt-0.5">
            ₹{netGstr3bTax.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-[#6F42C1] font-mono mt-0.5">IGST + CGST + SGST</div>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E8E0F0] pb-2.5">
        {[
          { id: 'b2b', label: `Table 4: B2B Invoices (${b2bInvoices.length})` },
          { id: 'b2c', label: `Table 7: B2C Invoices (${b2cInvoices.length})` },
          { id: 'cdnr', label: `Table 9B: Credit & Debit Notes (${filteredCreditDebitNotes.length})` },
          { id: 'hsn', label: `Table 12: HSN/SAC Summary (${hsnSummary.length})` },
          { id: 'docs', label: 'Table 13: Document Series' },
          { id: 'gstr3b', label: 'GSTR-3B Net Tax Reconciliation' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveReportTab(t.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeReportTab === t.id
                ? 'bg-[#8E2D9D] text-white shadow-xs'
                : 'bg-white hover:bg-[#FAF5FF] text-[#5F5A72] hover:text-[#8E2D9D] border border-[#E8E0F0]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: B2B Invoices */}
      {activeReportTab === 'b2b' && (
        <div className="rounded-2xl border border-[#E8E0F0] bg-white overflow-hidden shadow-xs">
          <div className="p-4 border-b border-[#E8E0F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-[#1E1B2E]">Table 4: Taxable Outward Supplies Made to Registered Persons (B2B)</h3>
              <p className="text-xs text-[#5F5A72]">Includes Place of Supply, Reverse Charge (Y/N), and Statutory GST Breakdowns.</p>
            </div>
            <div className="text-xs text-[#8E2D9D] font-mono bg-[#F3E8FF] px-3 py-1 rounded-lg border border-[#C084FC]/40 font-bold">
              Taxable: ₹{b2bInvoices.reduce((s, i) => s + i.taxableAmount, 0).toLocaleString('en-IN')}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF5FF] text-[#5F5A72] font-semibold border-b border-[#E8E0F0] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">GSTIN of Recipient</th>
                  <th className="p-3.5">Receiver Name</th>
                  <th className="p-3.5">Invoice #</th>
                  <th className="p-3.5">Invoice Date</th>
                  <th className="p-3.5 text-right">Invoice Value</th>
                  <th className="p-3.5">Place of Supply</th>
                  <th className="p-3.5 text-center">Reverse Charge</th>
                  <th className="p-3.5">Invoice Type</th>
                  <th className="p-3.5 text-right">Rate</th>
                  <th className="p-3.5 text-right">Taxable Value</th>
                  <th className="p-3.5 text-right">IGST</th>
                  <th className="p-3.5 text-right">CGST</th>
                  <th className="p-3.5 text-right">SGST/UTGST</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0F0] font-mono">
                {b2bInvoices.map(inv => {
                  const pos = getStandardGstPlaceOfSupply(inv.placeOfSupply || inv.place_of_supply, inv.buyerState);
                  const isRc = inv.reverseCharge === 'Yes' || inv.reverseCharge === true;
                  const invType = getGstr1InvoiceType(inv);
                  const invDateFormatted = formatDateGstr1(inv.issueDate || inv.issue_date);

                  return (
                    <tr key={inv.id} className="hover:bg-[#FAF5FF] transition-colors">
                      <td className="p-3.5 text-[#8E2D9D] font-bold">{inv.buyerGstin || inv.clientGstin}</td>
                      <td className="p-3.5 font-sans font-semibold text-[#1E1B2E] truncate max-w-[180px]">
                        {inv.buyerCompany || inv.clientCompany || inv.clientName}
                      </td>
                      <td className="p-3.5 font-bold text-[#1E1B2E]">{inv.invoiceNumber}</td>
                      <td className="p-3.5 text-[#5F5A72] font-sans">{invDateFormatted}</td>
                      <td className="p-3.5 text-right font-bold text-[#1E1B2E]">₹{inv.totalAmount.toLocaleString('en-IN')}</td>
                      <td className="p-3.5 font-sans text-[#5F5A72]">{pos}</td>
                      <td className="p-3.5 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isRc ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-[#817B91]'}`}>
                          {isRc ? 'Y' : 'N'}
                        </span>
                      </td>
                      <td className="p-3.5 font-sans text-[#5F5A72]">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${invType.includes('SEZ') ? 'bg-[#F3E8FF] text-[#8E2D9D] border border-[#C084FC]/40 font-bold' : 'text-[#5F5A72]'}`}>
                          {invType}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">{inv.gstRate || 18}%</td>
                      <td className="p-3.5 text-right font-bold text-[#1E1B2E]">₹{inv.taxableAmount.toLocaleString('en-IN')}</td>
                      <td className="p-3.5 text-right text-[#8E2D9D] font-semibold">₹{(inv.igstAmount || 0).toLocaleString('en-IN')}</td>
                      <td className="p-3.5 text-right text-[#5F5A72]">₹{(inv.cgstAmount || 0).toLocaleString('en-IN')}</td>
                      <td className="p-3.5 text-right text-[#5F5A72]">₹{((inv.sgstAmount || 0) + (inv.utgstAmount || 0)).toLocaleString('en-IN')}</td>
                    </tr>
                  );
                })}
                {b2bInvoices.length === 0 && (
                  <tr>
                    <td colSpan={13} className="p-8 text-center text-[#817B91] font-sans">
                      No B2B registered invoices found in the selected date range.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: B2C Invoices */}
      {activeReportTab === 'b2c' && (
        <div className="rounded-2xl border border-[#E8E0F0] bg-white overflow-hidden shadow-xs">
          <div className="p-4 border-b border-[#E8E0F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-[#1E1B2E]">Table 7: Taxable Outward Supplies to Unregistered Persons (B2C Other)</h3>
              <p className="text-xs text-[#5F5A72]">All retail and unregistered client supplies compiled by Place of Supply.</p>
            </div>
            <div className="text-xs text-[#059669] font-mono bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 font-bold">
              Taxable: ₹{b2cInvoices.reduce((s, i) => s + i.taxableAmount, 0).toLocaleString('en-IN')}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF5FF] text-[#5F5A72] font-semibold border-b border-[#E8E0F0] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Receiver Name</th>
                  <th className="p-3.5">Invoice #</th>
                  <th className="p-3.5">Invoice Date</th>
                  <th className="p-3.5 text-right">Invoice Value</th>
                  <th className="p-3.5">Place of Supply</th>
                  <th className="p-3.5 text-right">Rate</th>
                  <th className="p-3.5 text-right">Taxable Value</th>
                  <th className="p-3.5 text-right">IGST</th>
                  <th className="p-3.5 text-right">CGST</th>
                  <th className="p-3.5 text-right">SGST/UTGST</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0F0] font-mono">
                {b2cInvoices.map(inv => {
                  const pos = getStandardGstPlaceOfSupply(inv.placeOfSupply || inv.place_of_supply, inv.buyerState);
                  const invDateFormatted = formatDateGstr1(inv.issueDate || inv.issue_date);

                  return (
                    <tr key={inv.id} className="hover:bg-[#FAF5FF] transition-colors">
                      <td className="p-3.5 text-amber-700 font-bold">OE</td>
                      <td className="p-3.5 font-sans font-semibold text-[#1E1B2E]">{inv.buyerCompany || inv.clientCompany || inv.clientName}</td>
                      <td className="p-3.5 font-bold text-[#1E1B2E]">{inv.invoiceNumber}</td>
                      <td className="p-3.5 text-[#5F5A72] font-sans">{invDateFormatted}</td>
                      <td className="p-3.5 text-right font-bold text-[#1E1B2E]">₹{inv.totalAmount.toLocaleString('en-IN')}</td>
                      <td className="p-3.5 font-sans text-[#5F5A72]">{pos}</td>
                      <td className="p-3.5 text-right">{inv.gstRate || 18}%</td>
                      <td className="p-3.5 text-right font-bold text-[#1E1B2E]">₹{inv.taxableAmount.toLocaleString('en-IN')}</td>
                      <td className="p-3.5 text-right text-[#8E2D9D] font-semibold">₹{(inv.igstAmount || 0).toLocaleString('en-IN')}</td>
                      <td className="p-3.5 text-right text-[#5F5A72]">₹{(inv.cgstAmount || 0).toLocaleString('en-IN')}</td>
                      <td className="p-3.5 text-right text-[#5F5A72]">₹{((inv.sgstAmount || 0) + (inv.utgstAmount || 0)).toLocaleString('en-IN')}</td>
                    </tr>
                  );
                })}
                {b2cInvoices.length === 0 && (
                  <tr>
                    <td colSpan={11} className="p-8 text-center text-[#817B91] font-sans">
                      No B2C unregistered invoices found in the selected date range.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Table 9B Credit / Debit Notes (CDNR) */}
      {activeReportTab === 'cdnr' && (
        <div className="rounded-2xl border border-[#E8E0F0] bg-white overflow-hidden shadow-xs">
          <div className="p-4 border-b border-[#E8E0F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-[#1E1B2E]">Table 9B: Credit / Debit Notes (Registered & Unregistered CDNR/CDNUR)</h3>
              <p className="text-xs text-[#5F5A72]">Adjustments against original tax invoices for discounts, scope changes, or rate revisions.</p>
            </div>
            <div className="text-xs text-[#D97706] font-mono bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 font-bold">
              Net Note Impact: ₹{(totalCnTaxable - totalDnTaxable).toLocaleString('en-IN')} (Reduction)
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF5FF] text-[#5F5A72] font-semibold border-b border-[#E8E0F0] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">GSTIN / Recipient</th>
                  <th className="p-3.5">Receiver Name</th>
                  <th className="p-3.5">Note #</th>
                  <th className="p-3.5">Note Date</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Original Inv #</th>
                  <th className="p-3.5">Original Inv Date</th>
                  <th className="p-3.5">Place of Supply</th>
                  <th className="p-3.5 text-right">Note Value</th>
                  <th className="p-3.5 text-right">Taxable Value</th>
                  <th className="p-3.5 text-right">IGST</th>
                  <th className="p-3.5 text-right">CGST</th>
                  <th className="p-3.5 text-right">SGST/UTGST</th>
                  <th className="p-3.5">Statutory Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0F0] font-mono">
                {filteredCreditDebitNotes.map(note => {
                  const pos = getStandardGstPlaceOfSupply(note.placeOfSupply || note.place_of_supply, note.buyerState);
                  const isCredit = note.noteType === 'credit';
                  const noteDateFormatted = formatDateGstr1(note.issueDate || note.issue_date);
                  const origInvDateFormatted = note.invoiceDate ? formatDateGstr1(note.invoiceDate) : '—';

                  return (
                    <tr key={note.id} className="hover:bg-[#FAF5FF] transition-colors">
                      <td className="p-3.5 text-[#8E2D9D] font-bold">{note.clientGstin || 'UNREGISTERED'}</td>
                      <td className="p-3.5 font-sans font-semibold text-[#1E1B2E]">{note.clientCompany || note.clientName}</td>
                      <td className="p-3.5 font-bold text-[#1E1B2E]">{note.noteNumber}</td>
                      <td className="p-3.5 text-[#5F5A72] font-sans">{noteDateFormatted}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isCredit ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-purple-50 text-purple-700 border border-purple-200'}`}>
                          {isCredit ? 'Credit Note' : 'Debit Note'}
                        </span>
                      </td>
                      <td className="p-3.5 text-[#5F5A72] font-bold">{note.invoiceNumber || '—'}</td>
                      <td className="p-3.5 text-[#817B91] font-sans">{origInvDateFormatted}</td>
                      <td className="p-3.5 font-sans text-[#5F5A72]">{pos}</td>
                      <td className="p-3.5 text-right font-bold text-[#1E1B2E]">₹{note.totalAmount.toLocaleString('en-IN')}</td>
                      <td className="p-3.5 text-right font-bold text-[#1E1B2E]">₹{note.taxableAmount.toLocaleString('en-IN')}</td>
                      <td className="p-3.5 text-right text-[#8E2D9D] font-semibold">₹{(note.igstAmount || 0).toLocaleString('en-IN')}</td>
                      <td className="p-3.5 text-right text-[#5F5A72]">₹{(note.cgstAmount || 0).toLocaleString('en-IN')}</td>
                      <td className="p-3.5 text-right text-[#5F5A72]">₹{((note.sgstAmount || 0) + (note.utgstAmount || 0)).toLocaleString('en-IN')}</td>
                      <td className="p-3.5 font-sans text-[#5F5A72] truncate max-w-[160px]">{note.reason}</td>
                    </tr>
                  );
                })}
                {filteredCreditDebitNotes.length === 0 && (
                  <tr>
                    <td colSpan={14} className="p-8 text-center text-[#817B91] font-sans">
                      No Credit or Debit notes issued in the selected date range.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Table 12 HSN Summary */}
      {activeReportTab === 'hsn' && (
        <div className="rounded-2xl border border-[#E8E0F0] bg-white overflow-hidden shadow-xs">
          <div className="p-4 border-b border-[#E8E0F0] flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#1E1B2E]">Table 12: HSN / SAC Summary of Outward Supplies</h3>
              <p className="text-xs text-[#5F5A72]">Services under SAC 998314 aggregated by tax rate and total turnover value.</p>
            </div>
            <div className="text-xs text-[#8E2D9D] font-mono bg-[#F3E8FF] px-3 py-1 rounded-lg border border-[#C084FC]/40 font-bold">
              SAC 998314 Primary IT Code
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF5FF] text-[#5F5A72] font-semibold border-b border-[#E8E0F0] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">HSN / SAC</th>
                  <th className="p-3.5">Description</th>
                  <th className="p-3.5">UQC</th>
                  <th className="p-3.5 text-right">Total Quantity</th>
                  <th className="p-3.5 text-right">Total Value</th>
                  <th className="p-3.5 text-right">Rate</th>
                  <th className="p-3.5 text-right">Taxable Value</th>
                  <th className="p-3.5 text-right">Integrated Tax</th>
                  <th className="p-3.5 text-right">Central Tax</th>
                  <th className="p-3.5 text-right">State / UT Tax</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0F0] font-mono">
                {hsnSummary.map((h, idx) => (
                  <tr key={idx} className="hover:bg-[#FAF5FF] transition-colors">
                    <td className="p-3.5 text-[#8E2D9D] font-bold">{h.hsn}</td>
                    <td className="p-3.5 font-sans font-semibold text-[#1E1B2E]">{h.description}</td>
                    <td className="p-3.5 text-[#817B91]">{h.uqc}</td>
                    <td className="p-3.5 text-right">{h.totalQuantity}</td>
                    <td className="p-3.5 text-right font-bold text-[#1E1B2E]">₹{h.totalValue.toLocaleString('en-IN')}</td>
                    <td className="p-3.5 text-right">{h.rate}%</td>
                    <td className="p-3.5 text-right font-bold text-[#1E1B2E]">₹{h.taxableValue.toLocaleString('en-IN')}</td>
                    <td className="p-3.5 text-right text-[#8E2D9D] font-semibold">₹{h.igst.toLocaleString('en-IN')}</td>
                    <td className="p-3.5 text-right text-[#5F5A72]">₹{h.cgst.toLocaleString('en-IN')}</td>
                    <td className="p-3.5 text-right text-[#5F5A72]">₹{h.sgstUtgst.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: Table 13 Document Series */}
      {activeReportTab === 'docs' && (
        <div className="rounded-2xl border border-[#E8E0F0] bg-white overflow-hidden shadow-xs">
          <div className="p-4 border-b border-[#E8E0F0] flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#1E1B2E]">Table 13: Documents Issued During the Tax Period</h3>
              <p className="text-xs text-[#5F5A72]">Auditable document series tracking starting serial numbers, ending serial numbers, and cancellations.</p>
            </div>
            <div className="text-xs text-[#059669] font-mono bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 font-bold">
              Sequence Reconciled
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF5FF] text-[#5F5A72] font-semibold border-b border-[#E8E0F0] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Nature of Document</th>
                  <th className="p-3.5">Sr. No. From</th>
                  <th className="p-3.5">Sr. No. To</th>
                  <th className="p-3.5 text-right">Total Number</th>
                  <th className="p-3.5 text-right">Cancelled</th>
                  <th className="p-3.5 text-right">Net Issued</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0F0] font-mono">
                {docSequences.map((doc, idx) => (
                  <tr key={idx} className="hover:bg-[#FAF5FF] transition-colors">
                    <td className="p-3.5 font-sans font-semibold text-[#1E1B2E]">{doc.nature}</td>
                    <td className="p-3.5 text-[#8E2D9D] font-bold">{doc.from}</td>
                    <td className="p-3.5 text-[#8E2D9D] font-bold">{doc.to}</td>
                    <td className="p-3.5 text-right font-bold text-[#1E1B2E]">{doc.total}</td>
                    <td className="p-3.5 text-right text-amber-700 font-bold">{doc.cancelled}</td>
                    <td className="p-3.5 text-right font-bold text-[#059669]">{doc.net}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: GSTR-3B Net Tax Reconciliation */}
      {activeReportTab === 'gstr3b' && (
        <div className="p-6 rounded-2xl border border-[#E8E0F0] bg-white space-y-6 shadow-xs">
          <div>
            <h3 className="font-bold text-base text-[#1E1B2E] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#059669]" />
              GSTR-3B Table 3.1: Details of Outward Supplies & Net Tax Liability
            </h3>
            <p className="text-xs text-[#5F5A72] mt-0.5">
              Strict reconciliation subtracting Credit Notes and adding Debit Notes to establish legally binding monthly tax liability.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#E8E0F0]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF5FF] text-[#5F5A72] font-semibold border-b border-[#E8E0F0] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Statutory Section / Nature of Supply</th>
                  <th className="p-3.5 text-right">Total Taxable Value (₹)</th>
                  <th className="p-3.5 text-right">Integrated Tax (₹)</th>
                  <th className="p-3.5 text-right">Central Tax (₹)</th>
                  <th className="p-3.5 text-right">State / UT Tax (₹)</th>
                  <th className="p-3.5 text-right">Total Tax (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0F0] font-mono">
                <tr>
                  <td className="p-3.5 font-sans font-medium text-[#1E1B2E]">
                    (a) Gross Outward Taxable Supplies (Tax Invoices)
                  </td>
                  <td className="p-3.5 text-right text-[#1E1B2E] font-bold">₹{grossTaxableValue.toLocaleString('en-IN')}</td>
                  <td className="p-3.5 text-right text-[#8E2D9D] font-bold">₹{totalIgst.toLocaleString('en-IN')}</td>
                  <td className="p-3.5 text-right text-[#5F5A72]">₹{totalCgst.toLocaleString('en-IN')}</td>
                  <td className="p-3.5 text-right text-[#5F5A72]">₹{totalSgstUtgst.toLocaleString('en-IN')}</td>
                  <td className="p-3.5 text-right text-[#1E1B2E] font-bold">₹{totalOutputGst.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="text-amber-700 bg-amber-50/50">
                  <td className="p-3.5 font-sans font-medium">
                    (b) Less: Credit Notes Issued (Table 9B)
                  </td>
                  <td className="p-3.5 text-right">-₹{totalCnTaxable.toLocaleString('en-IN')}</td>
                  <td className="p-3.5 text-right">-₹{creditNotes.reduce((s, c) => s + (c.igstAmount || 0), 0).toLocaleString('en-IN')}</td>
                  <td className="p-3.5 text-right">-₹{creditNotes.reduce((s, c) => s + (c.cgstAmount || 0), 0).toLocaleString('en-IN')}</td>
                  <td className="p-3.5 text-right">-₹{creditNotes.reduce((s, c) => s + (c.sgstAmount || 0) + (c.utgstAmount || 0), 0).toLocaleString('en-IN')}</td>
                  <td className="p-3.5 text-right font-bold">-₹{totalCnTax.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="text-[#6F42C1] bg-[#FAF5FF]">
                  <td className="p-3.5 font-sans font-medium">
                    (c) Add: Debit Notes Issued (Table 9B)
                  </td>
                  <td className="p-3.5 text-right">+₹{totalDnTaxable.toLocaleString('en-IN')}</td>
                  <td className="p-3.5 text-right">+₹{debitNotes.reduce((s, d) => s + (d.igstAmount || 0), 0).toLocaleString('en-IN')}</td>
                  <td className="p-3.5 text-right">+₹{debitNotes.reduce((s, d) => s + (d.cgstAmount || 0), 0).toLocaleString('en-IN')}</td>
                  <td className="p-3.5 text-right">+₹{debitNotes.reduce((s, d) => s + (d.sgstAmount || 0) + (d.utgstAmount || 0), 0).toLocaleString('en-IN')}</td>
                  <td className="p-3.5 text-right font-bold">+₹{totalDnTax.toLocaleString('en-IN')}</td>
                </tr>
                <tr className="bg-emerald-50 border-t-2 border-emerald-300 font-bold text-sm">
                  <td className="p-4 font-sans text-emerald-900">
                    Net Tax Liability on Outward Supplies (3.1.a Net)
                  </td>
                  <td className="p-4 text-right text-emerald-900 font-extrabold">₹{netGstr3bTaxable.toLocaleString('en-IN')}</td>
                  <td className="p-4 text-right text-[#8E2D9D] font-extrabold">₹{(totalIgst - creditNotes.reduce((s, c) => s + (c.igstAmount || 0), 0) + debitNotes.reduce((s, d) => s + (d.igstAmount || 0), 0)).toLocaleString('en-IN')}</td>
                  <td className="p-4 text-right text-[#1E1B2E] font-extrabold">₹{(totalCgst - creditNotes.reduce((s, c) => s + (c.cgstAmount || 0), 0) + debitNotes.reduce((s, d) => s + (d.cgstAmount || 0), 0)).toLocaleString('en-IN')}</td>
                  <td className="p-4 text-right text-[#1E1B2E] font-extrabold">₹{(totalSgstUtgst - creditNotes.reduce((s, c) => s + (c.sgstAmount || 0) + (c.utgstAmount || 0), 0) + debitNotes.reduce((s, d) => s + (d.sgstAmount || 0) + (d.utgstAmount || 0), 0)).toLocaleString('en-IN')}</td>
                  <td className="p-4 text-right text-[#059669] font-extrabold">₹{netGstr3bTax.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
