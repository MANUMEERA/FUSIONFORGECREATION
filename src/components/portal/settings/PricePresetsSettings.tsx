import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Power, 
  PowerOff, 
  Tag, 
  Percent, 
  IndianRupee,
  Search,
  Filter,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { useToast } from '../../../context/ToastContext';
import { ServicePricePreset } from '../../../types';

export const PricePresetsSettings: React.FC = () => {
  const { pricePresets, addPricePreset, updatePricePreset, deletePricePreset, togglePricePresetActive, currentUser } = useApp();
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [presetToDelete, setPresetToDelete] = useState<ServicePricePreset | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { success } = useToast();
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');

  const [form, setForm] = useState({
    service_name: '',
    description: '',
    sac_code: '998314',
    default_price: 0,
    gst_applicable: true,
    gst_rate: 18,
    is_active: true
  });

  const isSuperAdmin = currentUser.role === 'super_admin';

  const resetForm = () => {
    setForm({
      service_name: '',
      description: '',
      sac_code: '998314',
      default_price: 0,
      gst_applicable: true,
      gst_rate: 18,
      is_active: true
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleStartEdit = (preset: ServicePricePreset) => {
    setEditingId(preset.id);
    setForm({
      service_name: preset.service_name || preset.name,
      description: preset.description || '',
      sac_code: preset.sac_code || preset.sacCode || '998314',
      default_price: preset.default_price !== undefined ? preset.default_price : (preset.rate || 0),
      gst_applicable: preset.gst_applicable !== undefined ? preset.gst_applicable : true,
      gst_rate: preset.gst_rate !== undefined ? preset.gst_rate : 18,
      is_active: preset.is_active !== undefined ? preset.is_active : true
    });
    setIsAdding(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.service_name.trim()) return;

    if (editingId) {
      updatePricePreset(editingId, {
        service_name: form.service_name.trim(),
        description: form.description.trim(),
        sac_code: form.sac_code.trim(),
        sacCode: form.sac_code.trim(),
        default_price: Number(form.default_price) || 0,
        rate: Number(form.default_price) || 0,
        gst_applicable: form.gst_applicable,
        gst_rate: Number(form.gst_rate) || 18,
        is_active: form.is_active
      });
    } else {
      addPricePreset({
        service_name: form.service_name.trim(),
        name: form.service_name.trim(),
        description: form.description.trim(),
        sac_code: form.sac_code.trim() || '998314',
        sacCode: form.sac_code.trim() || '998314',
        default_price: Number(form.default_price) || 0,
        rate: Number(form.default_price) || 0,
        gst_applicable: form.gst_applicable,
        gst_rate: Number(form.gst_rate) || 18,
        is_active: form.is_active
      });
    }

    resetForm();
  };

  const filteredPresets = pricePresets.filter(p => {
    const matchesSearch = (p.service_name || p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sac_code || p.sacCode || '').includes(searchQuery);
    
    if (filterActive === 'active') return matchesSearch && p.is_active;
    if (filterActive === 'inactive') return matchesSearch && !p.is_active;
    return matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E8E0F0] shadow-sm">
        <div>
          <h3 className="text-sm font-bold text-[#1E1B2E] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8E2D9D]" />
            <span>Quick-Add Service Price Presets</span>
          </h3>
          <p className="text-xs text-[#5F5A72] mt-0.5">
            Pre-configured service line items for 1-click insertion into Quotations & Invoices.
          </p>
        </div>

        {isSuperAdmin && !isAdding && (
          <button
            type="button"
            onClick={() => { resetForm(); setIsAdding(true); }}
            className="px-3.5 py-1.5 rounded-xl bg-[#8E2D9D] hover:bg-[#6F42C1] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#8E2D9D]/20 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Preset</span>
          </button>
        )}
      </div>

      {/* Add / Edit Form Modal or Inline Panel */}
      {isAdding && (
        <form onSubmit={handleSave} className="p-5 rounded-2xl bg-white border border-[#C084FC]/50 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-[#E8E0F0] pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8E2D9D] flex items-center gap-2">
              {editingId ? <Edit3 className="w-3.5 h-3.5 text-[#8E2D9D]" /> : <Plus className="w-3.5 h-3.5 text-[#8E2D9D]" />}
              <span>{editingId ? 'Modify Service Price Preset' : 'New Service Price Preset'}</span>
            </h4>
            <button
              type="button"
              onClick={resetForm}
              className="p-1 text-[#817B91] hover:text-[#1E1B2E]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">
                Service Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.service_name}
                onChange={e => setForm({ ...form, service_name: e.target.value })}
                placeholder="e.g. Enterprise Custom SaaS Development"
                className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15 outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">
                SAC Code
              </label>
              <input
                type="text"
                value={form.sac_code}
                onChange={e => setForm({ ...form, sac_code: e.target.value })}
                placeholder="998314"
                className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] font-mono focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15 outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">
                Default Scope & Deliverables Description
              </label>
              <textarea
                rows={2}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Detailed scope of services, milestones, and deliverables..."
                className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15 outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">
                Default Price (₹ INR) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-2 text-[#817B91] text-xs font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={form.default_price}
                  onChange={e => setForm({ ...form, default_price: parseFloat(e.target.value) || 0 })}
                  className="w-full pl-7 pr-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] font-mono focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">
                GST Rate (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="28"
                  value={form.gst_rate}
                  onChange={e => setForm({ ...form, gst_rate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 pr-7 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] font-mono focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15 outline-none"
                />
                <span className="absolute right-2.5 top-2 text-[#817B91] text-xs font-bold">%</span>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.gst_applicable}
                  onChange={e => setForm({ ...form, gst_applicable: e.target.checked })}
                  className="w-4 h-4 rounded text-[#8E2D9D] focus:ring-0"
                />
                <span className="text-xs text-[#1E1B2E] font-semibold">GST Applicable</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={e => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-[#8E2D9D] focus:ring-0"
                />
                <span className="text-xs text-[#1E1B2E] font-semibold">Active</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E0F0]">
            <button
              type="button"
              onClick={resetForm}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#FAF5FF] border border-[#E8E0F0] text-[#5F5A72] text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-[#8E2D9D] hover:bg-[#6F42C1] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#8E2D9D]/20 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{editingId ? 'Update Preset' : 'Save Preset'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#817B91]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search presets or SAC..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15 outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="text-[#5F5A72] text-[11px] mr-1">Status:</span>
          {(['all', 'active', 'inactive'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilterActive(tab)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all cursor-pointer ${
                filterActive === tab
                  ? 'bg-[#8E2D9D] text-white shadow-xs'
                  : 'bg-white text-[#5F5A72] border border-[#E8E0F0] hover:text-[#1E1B2E]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Presets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredPresets.map(preset => (
          <div
            key={preset.id}
            className={`p-4 rounded-2xl border transition-all space-y-2.5 shadow-sm ${
              preset.is_active
                ? 'bg-white border-[#E8E0F0] hover:border-[#C084FC]'
                : 'bg-[#FAF8FF] border-[#E8E0F0] opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#1E1B2E] text-xs">{preset.service_name || preset.name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-[#F3E8FF] border border-[#C084FC]/40 text-[#8E2D9D] font-bold">
                    SAC {preset.sac_code || preset.sacCode || '998314'}
                  </span>
                </div>
                <p className="text-[11px] text-[#5F5A72] mt-1 line-clamp-2">{preset.description}</p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-sm font-extrabold text-[#8E2D9D] font-mono">
                  ₹{(preset.default_price !== undefined ? preset.default_price : (preset.rate || 0)).toLocaleString('en-IN')}
                </span>
                <span className="block text-[10px] text-[#817B91]">
                  {preset.gst_applicable ? `+ ${preset.gst_rate || 18}% GST` : 'Zero GST'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E8E0F0] text-[11px]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!isSuperAdmin}
                  onClick={() => togglePricePresetActive(preset.id)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                    preset.is_active
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                      : 'bg-slate-100 text-[#5F5A72] hover:bg-slate-200 border border-slate-200'
                  }`}
                  title={isSuperAdmin ? (preset.is_active ? 'Click to deactivate' : 'Click to activate') : 'Super Admin only'}
                >
                  {preset.is_active ? (
                    <>
                      <Power className="w-2.5 h-2.5" />
                      <span>Active</span>
                    </>
                  ) : (
                    <>
                      <PowerOff className="w-2.5 h-2.5" />
                      <span>Inactive</span>
                    </>
                  )}
                </button>
              </div>

              {isSuperAdmin && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(preset)}
                    className="p-1 rounded hover:bg-[#F3E8FF] text-[#817B91] hover:text-[#8E2D9D] transition-colors cursor-pointer"
                    title="Edit Preset"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetToDelete(preset)}
                    className="p-1 rounded hover:bg-red-50 text-[#817B91] hover:text-red-600 transition-colors cursor-pointer"
                    title="Delete Preset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredPresets.length === 0 && (
          <div className="col-span-full p-8 text-center border border-dashed border-[#E8E0F0] rounded-2xl bg-white">
            <Sparkles className="w-6 h-6 mx-auto mb-2 text-[#817B91]" />
            <p className="text-xs font-semibold text-[#1E1B2E]">No service price presets found</p>
            <p className="text-[11px] text-[#5F5A72] mt-0.5">
              {searchQuery ? 'Try clearing your search filters.' : 'Click "Create New Preset" to configure line items.'}
            </p>
          </div>
        )}
      </div>

      {/* Delete Preset Modal */}
      {presetToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-red-200 rounded-3xl shadow-2xl p-6 relative text-[#1E1B2E]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-2xl bg-red-50 text-red-600 border border-red-200">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1E1B2E]">Delete Service Preset</h2>
                <p className="text-xs text-red-600 font-semibold">Confirm preset removal</p>
              </div>
            </div>

            <p className="text-xs text-[#5F5A72] mb-4 leading-relaxed">
              Are you sure you want to delete price preset <strong className="text-[#1E1B2E]">"{presetToDelete.service_name}"</strong> (₹{presetToDelete.default_price.toLocaleString('en-IN')})?
            </p>

            <div className="pt-3 border-t border-[#E8E0F0] flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setPresetToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#5F5A72] font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deletePricePreset(presetToDelete.id);
                  success('Preset Removed', `"${presetToDelete.service_name}" deleted.`);
                  setPresetToDelete(null);
                }}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Preset</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
