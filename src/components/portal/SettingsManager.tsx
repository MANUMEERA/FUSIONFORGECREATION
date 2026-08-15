import React, { useState } from 'react';
import { 
  Building2, 
  Save, 
  ShieldCheck, 
  Check, 
  Landmark,
  FileText,
  FileSignature,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../BrandLogo';

export const SettingsManager: React.FC = () => {
  const { agencyConfig, updateAgencyConfig } = useApp();
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    company_name: agencyConfig.company_name || agencyConfig.name || 'Fusion Forge Creation',
    tagline: agencyConfig.tagline || 'Where Ideas Fuse With Technology',
    email: agencyConfig.email || 'contact@fusionforgecreation.com',
    phone: agencyConfig.phone || '+91 [Enter Phone Number]',
    address: agencyConfig.address || '[Enter Business Address, Cyber City, Patia]',
    gstin: agencyConfig.gstin || '21XXXXXXXXXX1ZX',
    state_code: agencyConfig.state_code || '21',
    jurisdiction: agencyConfig.jurisdiction || 'Bhubaneswar, Odisha',
    logo_url: agencyConfig.logo_url || '/logo.png',
    signature_url: agencyConfig.signature_url || '/signatures/authorized_signatory.png',
    bank_name: agencyConfig.bank_name || agencyConfig.bankDetails?.bankName || '[Enter Bank Name - e.g. HDFC Bank Ltd.]',
    account_name: agencyConfig.account_name || agencyConfig.bankDetails?.accountName || 'Fusion Forge Creation',
    account_number: agencyConfig.account_number || agencyConfig.bankDetails?.accountNumber || '[Enter Account Number]',
    ifsc_code: agencyConfig.ifsc_code || agencyConfig.bankDetails?.ifscCode || '[Enter IFSC Code - e.g. HDFC000XXXX]',
    branch_name: agencyConfig.branch_name || agencyConfig.bankDetails?.branch || '[Enter Branch Name - e.g. Patia Branch]',
    terms_conditions: agencyConfig.terms_conditions || '1. 50% advance on project kickoff, balance on completion.\n2. Invoices are payable within 15 days of issue date.\n3. Goods & Services Tax (GST) charged as per Indian taxation norms (SAC 998314).\n4. All payments to be remitted to the aforementioned bank account only.'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAgencyConfig({
      name: form.company_name,
      legalName: form.company_name,
      company_name: form.company_name,
      tagline: form.tagline,
      email: form.email,
      phone: form.phone,
      address: form.address,
      gstin: form.gstin,
      state_code: form.state_code,
      jurisdiction: form.jurisdiction,
      logo_url: form.logo_url,
      signature_url: form.signature_url,
      bank_name: form.bank_name,
      account_name: form.account_name,
      account_number: form.account_number,
      ifsc_code: form.ifsc_code,
      branch_name: form.branch_name,
      terms_conditions: form.terms_conditions,
      bankDetails: {
        accountName: form.account_name,
        bankName: form.bank_name,
        accountNumber: form.account_number,
        ifscCode: form.ifsc_code,
        branch: form.branch_name,
        upiId: agencyConfig.bankDetails?.upiId || 'fusionforge@bank'
      }
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            Seller Master Profile
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Single authoritative master record for Fusion Forge Creation business identity, GSTIN, jurisdiction, and banking.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl text-amber-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Placeholder data active until production credentials are saved</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-[#0d1527] border border-slate-800 space-y-6">
        {/* 1. Core Company Identity */}
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-cyan-400 tracking-wider mb-3">
            <Building2 className="w-4 h-4" />
            <span>1. Core Business Identity</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Company / Brand Name</label>
              <input
                type="text"
                value={form.company_name}
                onChange={e => setForm({ ...form, company_name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-blue-500"
                placeholder="Fusion Forge Creation"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Tagline / Mission</label>
              <input
                type="text"
                value={form.tagline}
                onChange={e => setForm({ ...form, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-blue-500"
                placeholder="Where Ideas Fuse With Technology"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Official Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-blue-500"
                placeholder="contact@fusionforgecreation.com"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Contact Phone / WhatsApp</label>
              <input
                type="text"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-blue-500"
                placeholder="+91 [Enter Business Phone]"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Full Business Address</label>
              <input
                type="text"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-blue-500"
                placeholder="Suite 504, Tech Park Cyber City, Patia, Bhubaneswar, Odisha 751024"
                required
              />
            </div>
          </div>
        </div>

        {/* 2. Tax, GSTIN & Jurisdiction */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-cyan-400 tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>2. GST Registration & Legal Jurisdiction</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">GSTIN Number (15 Digits)</label>
              <input
                type="text"
                value={form.gstin}
                onChange={e => setForm({ ...form, gstin: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono uppercase outline-none focus:border-blue-500"
                placeholder="21XXXXXXXXXX1ZX"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">State Code (GST Master)</label>
              <input
                type="text"
                value={form.state_code}
                onChange={e => setForm({ ...form, state_code: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono outline-none focus:border-blue-500"
                placeholder="21"
                maxLength={2}
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Legal Tax Jurisdiction</label>
              <input
                type="text"
                value={form.jurisdiction}
                onChange={e => setForm({ ...form, jurisdiction: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-blue-500"
                placeholder="Bhubaneswar, Odisha"
                required
              />
            </div>
          </div>
        </div>

        {/* 3. Branding & Signatures */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-cyan-400 tracking-wider">
              <FileSignature className="w-4 h-4" />
              <span>3. Brand Logo & Authorized Signature</span>
            </div>
            <div className="px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400">
              Active Brand Identity
            </div>
          </div>

          {/* Live Logo Visual Preview */}
          <div className="mb-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BrandLogo size="md" variant="full" theme="dark" />
            </div>
            <div className="p-3 rounded-lg bg-white/95 border border-slate-200">
              <BrandLogo size="sm" variant="full" theme="light" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Brand Logo Asset URL</label>
              <input
                type="text"
                value={form.logo_url}
                onChange={e => setForm({ ...form, logo_url: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-blue-500"
                placeholder="/logo.svg"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Authorized Signatory Image URL</label>
              <input
                type="text"
                value={form.signature_url}
                onChange={e => setForm({ ...form, signature_url: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-blue-500"
                placeholder="/signatures/authorized_signatory.png"
              />
            </div>
          </div>
        </div>

        {/* 4. Settlement Bank Details */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-cyan-400 tracking-wider mb-3">
            <Landmark className="w-4 h-4" />
            <span>4. Settlement Bank Account Details</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Bank Name</label>
              <input
                type="text"
                value={form.bank_name}
                onChange={e => setForm({ ...form, bank_name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-blue-500"
                placeholder="[Enter Bank Name - e.g. HDFC Bank Ltd.]"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Account Holder Name</label>
              <input
                type="text"
                value={form.account_name}
                onChange={e => setForm({ ...form, account_name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-blue-500"
                placeholder="Fusion Forge Creation"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Account Number</label>
              <input
                type="text"
                value={form.account_number}
                onChange={e => setForm({ ...form, account_number: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono outline-none focus:border-blue-500"
                placeholder="[Enter Bank Account Number]"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">IFSC Code</label>
              <input
                type="text"
                value={form.ifsc_code}
                onChange={e => setForm({ ...form, ifsc_code: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono uppercase outline-none focus:border-blue-500"
                placeholder="[Enter IFSC Code - e.g. HDFC000XXXX]"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Branch Name</label>
              <input
                type="text"
                value={form.branch_name}
                onChange={e => setForm({ ...form, branch_name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-blue-500"
                placeholder="[Enter Branch Name - e.g. Patia Branch]"
                required
              />
            </div>
          </div>
        </div>

        {/* 5. Terms & Conditions */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-cyan-400 tracking-wider mb-3">
            <FileText className="w-4 h-4" />
            <span>5. Standard Terms & Conditions</span>
          </div>
          <div>
            <textarea
              rows={4}
              value={form.terms_conditions}
              onChange={e => setForm({ ...form, terms_conditions: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-blue-500 font-mono leading-relaxed"
              placeholder="Enter standard invoice & quotation terms..."
              required
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center space-x-2 transition-all shadow-md shadow-blue-600/20"
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Seller Profile Saved' : 'Save Seller Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
