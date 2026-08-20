import React, { useState } from 'react';
import { 
  FileText, 
  FileSignature, 
  Plus, 
  Trash2, 
  Save, 
  Check, 
  RotateCcw, 
  ListOrdered, 
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { useToast } from '../../../context/ToastContext';
import { DEFAULT_QUOTATION_TERMS, DEFAULT_INVOICE_TERMS } from '../../../mockData';

export const TermsConditionsSettings: React.FC = () => {
  const { agencyConfig, updateAgencyConfig, currentUser } = useApp();

  const isSuperAdmin = currentUser.role === 'super_admin';

  const [quoteTerms, setQuoteTerms] = useState<string[]>(() => {
    return agencyConfig.quotation_terms || DEFAULT_QUOTATION_TERMS;
  });

  const [invTerms, setInvTerms] = useState<string[]>(() => {
    return agencyConfig.invoice_terms || DEFAULT_INVOICE_TERMS;
  });

  const [delayInterestClause, setDelayInterestClause] = useState<string>(() => {
    return agencyConfig.delay_interest_clause || 'Interest @ 18% per annum will be charged on all delayed payments exceeding the due date.';
  });

  const [reverseChargeDefault, setReverseChargeDefault] = useState<'Yes' | 'No'>(() => {
    return (agencyConfig.reverse_charge_default as any) || (agencyConfig.gstin ? 'No' : 'Yes');
  });

  const [newQuoteClause, setNewQuoteClause] = useState('');
  const [newInvClause, setNewInvClause] = useState('');
  const [saved, setSaved] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const { success } = useToast();

  const handleAddQuoteClause = () => {
    if (!newQuoteClause.trim()) return;
    setQuoteTerms(prev => [...prev, newQuoteClause.trim()]);
    setNewQuoteClause('');
  };

  const handleRemoveQuoteClause = (index: number) => {
    setQuoteTerms(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddInvClause = () => {
    if (!newInvClause.trim()) return;
    setInvTerms(prev => [...prev, newInvClause.trim()]);
    setNewInvClause('');
  };

  const handleRemoveInvClause = (index: number) => {
    setInvTerms(prev => prev.filter((_, i) => i !== index));
  };

  const handleResetToDefaults = () => {
    setQuoteTerms([...DEFAULT_QUOTATION_TERMS]);
    setInvTerms([...DEFAULT_INVOICE_TERMS]);
    setDelayInterestClause('Interest @ 18% per annum will be charged on all delayed payments exceeding the due date.');
    setReverseChargeDefault(agencyConfig.gstin ? 'No' : 'Yes');
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    updateAgencyConfig({
      quotation_terms: quoteTerms,
      invoice_terms: invTerms,
      delay_interest_clause: delayInterestClause,
      reverse_charge_default: reverseChargeDefault,
      terms_conditions: invTerms.join('\n')
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSaveAll} className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8E0F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <h3 className="text-sm font-bold text-[#1E1B2E] flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-[#8E2D9D]" />
            <span>Document Legal Clauses & Terms of Service</span>
          </h3>
          <p className="text-xs text-[#5F5A72] mt-0.5">
            Configure line-by-line legal clauses printed on generated Quotations, Proposals, and Invoices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSuperAdmin && (
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF5FF] text-[#5F5A72] text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-[#E8E0F0]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          )}

          <button
            type="submit"
            className="px-4 py-1.5 rounded-xl bg-[#8E2D9D] hover:bg-[#6F42C1] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#8E2D9D]/20 cursor-pointer"
          >
            {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saved ? 'Terms Saved' : 'Save All Terms'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quotation Terms */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8E0F0] space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E8E0F0] pb-2">
            <div className="flex items-center gap-2">
              <FileSignature className="w-4 h-4 text-[#8E2D9D]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E1B2E]">Quotation Terms & Conditions</h4>
            </div>
            <span className="text-[10px] font-mono text-[#8E2D9D] bg-[#F3E8FF] px-2 py-0.5 rounded-md font-bold">
              {quoteTerms.length} Clauses
            </span>
          </div>

          {/* Add Clause */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newQuoteClause}
              onChange={e => setNewQuoteClause(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddQuoteClause(); } }}
              placeholder="Add new quotation clause..."
              className="flex-1 px-3 py-1.5 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15"
            />
            <button
              type="button"
              onClick={handleAddQuoteClause}
              disabled={!newQuoteClause.trim()}
              className="px-3 py-1.5 rounded-xl bg-[#8E2D9D] hover:bg-[#6F42C1] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* List */}
          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
            {quoteTerms.map((term, index) => (
              <div
                key={index}
                className="p-3 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] flex items-start justify-between gap-2 text-xs"
              >
                <div className="flex items-start gap-2 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-[#F3E8FF] border border-[#C084FC]/40 text-[#8E2D9D] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-[#1E1B2E] text-xs leading-relaxed">{term}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveQuoteClause(index)}
                  className="p-1 rounded hover:bg-red-50 text-[#817B91] hover:text-red-600 transition-colors shrink-0 cursor-pointer"
                  title="Remove Clause"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Invoice Terms */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8E0F0] space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E8E0F0] pb-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#8E2D9D]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E1B2E]">Invoice Terms & Conditions</h4>
            </div>
            <span className="text-[10px] font-mono text-[#8E2D9D] bg-[#F3E8FF] px-2 py-0.5 rounded-md font-bold">
              {invTerms.length} Clauses
            </span>
          </div>

          {/* Add Clause */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newInvClause}
              onChange={e => setNewInvClause(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddInvClause(); } }}
              placeholder="Add new invoice payment clause..."
              className="flex-1 px-3 py-1.5 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15"
            />
            <button
              type="button"
              onClick={handleAddInvClause}
              disabled={!newInvClause.trim()}
              className="px-3 py-1.5 rounded-xl bg-[#8E2D9D] hover:bg-[#6F42C1] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* List */}
          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
            {invTerms.map((term, index) => (
              <div
                key={index}
                className="p-3 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] flex items-start justify-between gap-2 text-xs"
              >
                <div className="flex items-start gap-2 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-[#F3E8FF] border border-[#C084FC]/40 text-[#8E2D9D] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-[#1E1B2E] text-xs leading-relaxed">{term}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveInvClause(index)}
                  className="p-1 rounded hover:bg-red-50 text-[#817B91] hover:text-red-600 transition-colors shrink-0 cursor-pointer"
                  title="Remove Clause"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delay Interest & Statutory Defaults Section */}
      <div className="p-5 rounded-2xl bg-white border border-[#E8E0F0] space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E8E0F0] pb-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#8E2D9D]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E1B2E]">Delay Interest Clause & Reverse Charge Defaults</h4>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="text-[11px] font-bold text-[#5F5A72] block mb-1">
              Late Payment / Delay-Interest Clause (Printed on Invoices)
            </label>
            <input
              type="text"
              value={delayInterestClause}
              onChange={e => setDelayInterestClause(e.target.value)}
              placeholder="Interest @ 18% per annum will be charged on all delayed payments exceeding the due date."
              className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15"
            />
            <p className="text-[10px] text-[#817B91] mt-1">
              Legal clause printed on all issued and overdue invoices as specified in Phase 7.
            </p>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#5F5A72] block mb-1">
              Default Reverse Charge (RCM)
            </label>
            <select
              value={reverseChargeDefault}
              onChange={e => setReverseChargeDefault(e.target.value as 'Yes' | 'No')}
              className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15 cursor-pointer"
            >
              <option value="No">No (Standard GST forward charge)</option>
              <option value="Yes">Yes (Reverse Charge applicable)</option>
            </select>
            <p className="text-[10px] text-[#817B91] mt-1">
              {agencyConfig.gstin ? 'Agency is GST registered (Defaults to No).' : 'Agency has no GSTIN (Configurable RCM default).'}
            </p>
          </div>
        </div>
      </div>

      {/* Reset Terms Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-amber-200 rounded-3xl shadow-2xl p-6 relative text-[#1E1B2E]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1E1B2E]">Reset All Clauses to Default</h2>
                <p className="text-xs text-amber-600 font-semibold">Confirm overwrite</p>
              </div>
            </div>

            <p className="text-xs text-[#5F5A72] mb-4 leading-relaxed">
              Are you sure you want to reset all quotation and invoice terms to the standard system defaults? Any custom clauses you typed will be replaced.
            </p>

            <div className="pt-3 border-t border-[#E8E0F0] flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#5F5A72] font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleResetToDefaults();
                  setShowResetConfirm(false);
                  success('Defaults Restored', 'Standard terms & conditions clauses loaded.');
                }}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Defaults</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};
