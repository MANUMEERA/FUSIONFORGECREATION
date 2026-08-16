import React, { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Star, 
  Clock, 
  Calendar
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { PaymentTermItem } from '../../../types';

export const PaymentTermsSettings: React.FC = () => {
  const { 
    paymentTerms, 
    addPaymentTerm, 
    updatePaymentTerm, 
    deletePaymentTerm, 
    setDefaultPaymentTerm, 
    agencyConfig, 
    updateAgencyConfig,
    currentUser 
  } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    is_default: false
  });

  const [validityDays, setValidityDays] = useState<number>(() => {
    return agencyConfig.default_quotation_validity_days || 30;
  });
  const [validitySaved, setValiditySaved] = useState(false);

  const isSuperAdmin = currentUser.role === 'super_admin';

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      is_default: false
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleStartEdit = (term: PaymentTermItem) => {
    setEditingId(term.id);
    setForm({
      name: term.name,
      description: term.description || '',
      is_default: term.is_default
    });
    setIsAdding(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (editingId) {
      updatePaymentTerm(editingId, {
        name: form.name.trim(),
        description: form.description.trim(),
        is_default: form.is_default
      });
    } else {
      addPaymentTerm({
        name: form.name.trim(),
        description: form.description.trim(),
        is_default: form.is_default,
        sort_order: paymentTerms.length
      });
    }

    resetForm();
  };

  const handleSaveValidity = () => {
    updateAgencyConfig({
      default_quotation_validity_days: Number(validityDays) || 30
    });
    setValiditySaved(true);
    setTimeout(() => setValiditySaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Quotation Validity Period Setting */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Default Quotation Validity Period</span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Automatically sets the default "Valid Until" date when new quotations are generated. Can still be manually adjusted per quotation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="number"
                min="1"
                max="365"
                value={validityDays}
                onChange={e => setValidityDays(parseInt(e.target.value) || 30)}
                className="w-24 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono text-center outline-none focus:border-cyan-400"
              />
              <span className="absolute right-2.5 top-1.5 text-slate-500 text-xs">days</span>
            </div>

            <button
              type="button"
              onClick={handleSaveValidity}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1 shadow cursor-pointer"
            >
              {validitySaved ? <Check className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5" />}
              <span>{validitySaved ? 'Updated' : 'Set Default'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Payment Terms Management */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-cyan-400" />
              <span>Payment Terms & Milestone Schedules</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Configured milestone terms available in dropdowns for invoices and quotations.
            </p>
          </div>

          {isSuperAdmin && !isAdding && (
            <button
              type="button"
              onClick={() => { resetForm(); setIsAdding(true); }}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Payment Term</span>
            </button>
          )}
        </div>

        {/* Add / Edit Term Form */}
        {isAdding && (
          <form onSubmit={handleSave} className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                {editingId ? <Edit3 className="w-3.5 h-3.5 text-cyan-400" /> : <Plus className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{editingId ? 'Edit Payment Term' : 'Add New Payment Term'}</span>
              </h4>
              <button
                type="button"
                onClick={resetForm}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Term Name / Label <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. 50% Advance / 50% on UAT Delivery"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Description / Milestone Breakdown
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g. 50% on initiation, 50% on final production rollout"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 outline-none"
                />
              </div>

              <div className="sm:col-span-2 flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_default}
                    onChange={e => setForm({ ...form, is_default: e.target.checked })}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <span className="text-xs text-slate-300 font-medium">Set as System Default Term</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={resetForm}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{editingId ? 'Update Term' : 'Save Term'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Terms List */}
        <div className="space-y-2.5">
          {paymentTerms.map(term => (
            <div
              key={term.id}
              className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                term.is_default
                  ? 'bg-cyan-950/20 border-cyan-500/40 shadow-sm'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg shrink-0 ${term.is_default ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{term.name}</span>
                    {term.is_default && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-cyan-400 text-cyan-400" />
                        <span>Default</span>
                      </span>
                    )}
                  </div>
                  {term.description && (
                    <p className="text-[11px] text-slate-400 mt-0.5">{term.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                {!term.is_default && isSuperAdmin && (
                  <button
                    type="button"
                    onClick={() => setDefaultPaymentTerm(term.id)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors border border-slate-700"
                  >
                    <Star className="w-3 h-3" />
                    <span>Set Default</span>
                  </button>
                )}

                {isSuperAdmin && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleStartEdit(term)}
                      className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                      title="Edit Term"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deletePaymentTerm(term.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete Term"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
