import React, { useState } from 'react';
import { 
  FileCode, 
  Save, 
  Check, 
  RefreshCw, 
  ShieldAlert, 
  HelpCircle, 
  Eye, 
  FileText, 
  FileSignature, 
  Hash, 
  Sliders
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { DocumentNumberConfig } from '../../../types';
import { 
  formatDocumentNumber, 
  DEFAULT_INVOICE_NUMBERING, 
  DEFAULT_QUOTATION_NUMBERING 
} from '../../../utils/documentNumbering';

export const DocumentNumberingSettings: React.FC = () => {
  const { agencyConfig, updateDocumentNumberConfig, currentUser, invoices, quotations } = useApp();

  const isSuperAdmin = currentUser.role === 'super_admin';

  const [invoiceConfig, setInvoiceConfig] = useState<DocumentNumberConfig>(() => {
    return agencyConfig.numbering_configs?.invoice || DEFAULT_INVOICE_NUMBERING;
  });

  const [quotationConfig, setQuotationConfig] = useState<DocumentNumberConfig>(() => {
    return agencyConfig.numbering_configs?.quotation || DEFAULT_QUOTATION_NUMBERING;
  });

  const [savedType, setSavedType] = useState<'invoice' | 'quotation' | null>(null);

  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) return;
    updateDocumentNumberConfig('invoice', invoiceConfig);
    setSavedType('invoice');
    setTimeout(() => setSavedType(null), 2500);
  };

  const handleSaveQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) return;
    updateDocumentNumberConfig('quotation', quotationConfig);
    setSavedType('quotation');
    setTimeout(() => setSavedType(null), 2500);
  };

  const invoicePreview = formatDocumentNumber(invoiceConfig, invoiceConfig.current_sequence || invoiceConfig.starting_sequence);
  const quotationPreview = formatDocumentNumber(quotationConfig, quotationConfig.current_sequence || quotationConfig.starting_sequence);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Document Numbering & Sequence Engine</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure transaction-safe serial prefixes, financial year tokens, and sequence formatting.
          </p>
        </div>

        {!isSuperAdmin && (
          <div className="flex items-center gap-1.5 text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-lg">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Super Admin permissions required to modify sequence rules</span>
          </div>
        )}
      </div>

      {/* Grid: Invoices & Quotations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invoices Numbering Config */}
        <form onSubmit={handleSaveInvoice} className="p-5 rounded-xl bg-slate-950/80 border border-blue-500/30 space-y-4 shadow-lg flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Tax Invoice Numbering</h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {invoices.length} Invoices Issued
              </span>
            </div>

            {/* Live Preview Box */}
            <div className="p-3.5 rounded-lg bg-blue-950/20 border border-blue-500/30">
              <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>Next Generated Invoice Number</span>
              </span>
              <div className="text-lg font-mono font-extrabold text-white tracking-wide">
                {invoicePreview}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Sample preview formatted according to active sequence rules.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Prefix</label>
                <input
                  type="text"
                  disabled={!isSuperAdmin}
                  value={invoiceConfig.prefix}
                  onChange={e => setInvoiceConfig({ ...invoiceConfig, prefix: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono uppercase focus:border-cyan-400 outline-none disabled:opacity-60"
                  placeholder="INV"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Company Token</label>
                <input
                  type="text"
                  disabled={!isSuperAdmin}
                  value={invoiceConfig.company_code || ''}
                  onChange={e => setInvoiceConfig({ ...invoiceConfig, company_code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono uppercase focus:border-cyan-400 outline-none disabled:opacity-60"
                  placeholder="FFC"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Separator</label>
                <select
                  disabled={!isSuperAdmin}
                  value={invoiceConfig.separator}
                  onChange={e => setInvoiceConfig({ ...invoiceConfig, separator: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 outline-none disabled:opacity-60"
                >
                  <option value="/">Slash ( / )</option>
                  <option value="-">Hyphen ( - )</option>
                  <option value=".">Dot ( . )</option>
                  <option value="">None (Concatenated)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Year Format</label>
                <select
                  disabled={!isSuperAdmin}
                  value={invoiceConfig.year_format}
                  onChange={e => setInvoiceConfig({ ...invoiceConfig, year_format: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 outline-none disabled:opacity-60"
                >
                  <option value="YYYY">4-Digit Year (2026)</option>
                  <option value="YY">2-Digit Year (26)</option>
                  <option value="FY">Indian Financial Year (FY25-26)</option>
                  <option value="YYYY-YY">Academic / Split (2025-26)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Starting Sequence</label>
                <input
                  type="number"
                  min="1"
                  disabled={!isSuperAdmin}
                  value={invoiceConfig.starting_sequence}
                  onChange={e => setInvoiceConfig({ ...invoiceConfig, starting_sequence: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:border-cyan-400 outline-none disabled:opacity-60"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Numbering Style</label>
                <select
                  disabled={!isSuperAdmin}
                  value={invoiceConfig.style}
                  onChange={e => setInvoiceConfig({ ...invoiceConfig, style: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 outline-none disabled:opacity-60"
                >
                  <option value="standard">Standard (INV/FFC/2026/10001)</option>
                  <option value="fiscal">Fiscal (INV/FY25-26/10001)</option>
                  <option value="compact">Compact (INV-10001)</option>
                  <option value="sequential">Sequential (10001)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    disabled={!isSuperAdmin}
                    checked={invoiceConfig.include_year}
                    onChange={e => setInvoiceConfig({ ...invoiceConfig, include_year: e.target.checked })}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-500 focus:ring-0"
                  />
                  <span className="text-xs text-slate-300 font-medium">Include Year in Number Pattern</span>
                </label>
              </div>
            </div>
          </div>

          {isSuperAdmin && (
            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
              >
                {savedType === 'invoice' ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                <span>{savedType === 'invoice' ? 'Invoice Rules Saved' : 'Save Invoice Pattern'}</span>
              </button>
            </div>
          )}
        </form>

        {/* Quotations Numbering Config */}
        <form onSubmit={handleSaveQuotation} className="p-5 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-4 shadow-lg flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileSignature className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Quotation Numbering</h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {quotations.length} Quotations Drafted
              </span>
            </div>

            {/* Live Preview Box */}
            <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>Next Generated Quotation Number</span>
              </span>
              <div className="text-lg font-mono font-extrabold text-white tracking-wide">
                {quotationPreview}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Sample preview formatted according to active sequence rules.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Prefix</label>
                <input
                  type="text"
                  disabled={!isSuperAdmin}
                  value={quotationConfig.prefix}
                  onChange={e => setQuotationConfig({ ...quotationConfig, prefix: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono uppercase focus:border-cyan-400 outline-none disabled:opacity-60"
                  placeholder="QTN"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Company Token</label>
                <input
                  type="text"
                  disabled={!isSuperAdmin}
                  value={quotationConfig.company_code || ''}
                  onChange={e => setQuotationConfig({ ...quotationConfig, company_code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono uppercase focus:border-cyan-400 outline-none disabled:opacity-60"
                  placeholder="FFC"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Separator</label>
                <select
                  disabled={!isSuperAdmin}
                  value={quotationConfig.separator}
                  onChange={e => setQuotationConfig({ ...quotationConfig, separator: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 outline-none disabled:opacity-60"
                >
                  <option value="/">Slash ( / )</option>
                  <option value="-">Hyphen ( - )</option>
                  <option value=".">Dot ( . )</option>
                  <option value="">None (Concatenated)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Year Format</label>
                <select
                  disabled={!isSuperAdmin}
                  value={quotationConfig.year_format}
                  onChange={e => setQuotationConfig({ ...quotationConfig, year_format: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 outline-none disabled:opacity-60"
                >
                  <option value="YYYY">4-Digit Year (2026)</option>
                  <option value="YY">2-Digit Year (26)</option>
                  <option value="FY">Indian Financial Year (FY25-26)</option>
                  <option value="YYYY-YY">Academic / Split (2025-26)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Starting Sequence</label>
                <input
                  type="number"
                  min="1"
                  disabled={!isSuperAdmin}
                  value={quotationConfig.starting_sequence}
                  onChange={e => setQuotationConfig({ ...quotationConfig, starting_sequence: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:border-cyan-400 outline-none disabled:opacity-60"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Numbering Style</label>
                <select
                  disabled={!isSuperAdmin}
                  value={quotationConfig.style}
                  onChange={e => setQuotationConfig({ ...quotationConfig, style: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 outline-none disabled:opacity-60"
                >
                  <option value="standard">Standard (QTN/FFC/2026/10001)</option>
                  <option value="fiscal">Fiscal (QTN/FY25-26/10001)</option>
                  <option value="compact">Compact (QTN-10001)</option>
                  <option value="sequential">Sequential (10001)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    disabled={!isSuperAdmin}
                    checked={quotationConfig.include_year}
                    onChange={e => setQuotationConfig({ ...quotationConfig, include_year: e.target.checked })}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-0"
                  />
                  <span className="text-xs text-slate-300 font-medium">Include Year in Number Pattern</span>
                </label>
              </div>
            </div>
          </div>

          {isSuperAdmin && (
            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
              >
                {savedType === 'quotation' ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                <span>{savedType === 'quotation' ? 'Quotation Rules Saved' : 'Save Quotation Pattern'}</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
