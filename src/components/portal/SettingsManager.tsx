import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Save, 
  ShieldCheck, 
  Check, 
  Landmark,
  FileText,
  FileSignature,
  AlertCircle,
  HelpCircle,
  Share2,
  MapPin,
  CreditCard,
  CheckCircle2,
  ExternalLink,
  Globe,
  Copy,
  Edit3,
  ArrowRight,
  Sparkles,
  RefreshCw,
  X,
  Plus,
  Trash2,
  Power,
  PowerOff,
  Link as LinkIcon,
  Stamp,
  Sliders,
  ListOrdered,
  Tag,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../BrandLogo';
import { SocialChannelItem } from '../../types';
import { PLATFORM_PRESETS, formatSocialUrl, buildSocialLinksDictionary } from '../../utils/socialPlatforms';
import { SocialIcon } from '../common/SocialIcon';
import { INITIAL_SOCIAL_CHANNELS } from '../../mockData';
import { PricePresetsSettings } from './settings/PricePresetsSettings';
import { PaymentTermsSettings } from './settings/PaymentTermsSettings';
import { DocumentNumberingSettings } from './settings/DocumentNumberingSettings';
import { TermsConditionsSettings } from './settings/TermsConditionsSettings';
import { AssetUploadSettings } from './settings/AssetUploadSettings';

type SettingsTab = 'profile' | 'presets' | 'payment-terms' | 'numbering' | 'terms' | 'assets';

export const SettingsManager: React.FC = () => {
  const { agencyConfig, updateAgencyConfig, setActiveTab, setCurrentView, currentUser } = useApp();
  const [activeSettingsTab, setActiveSettingsTab] = useState<SettingsTab>('profile');
  const [saved, setSaved] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isEditingCompliance, setIsEditingCompliance] = useState(false);
  const [isAddingChannel, setIsAddingChannel] = useState(false);
  const [newChannelPlatform, setNewChannelPlatform] = useState('linkedin');
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelUrl, setNewChannelUrl] = useState('');

  // Manage dynamic social channels list
  const [socialChannels, setSocialChannels] = useState<SocialChannelItem[]>(() => {
    if (agencyConfig.social_channels && Array.isArray(agencyConfig.social_channels) && agencyConfig.social_channels.length > 0) {
      return agencyConfig.social_channels;
    }
    if (agencyConfig.socialChannels && Array.isArray(agencyConfig.socialChannels) && agencyConfig.socialChannels.length > 0) {
      return agencyConfig.socialChannels;
    }
    const sl = (agencyConfig.social_links || agencyConfig.socialLinks || {}) as Record<string, string | undefined>;
    return [
      { id: 'linkedin', platform: 'linkedin', name: 'LinkedIn', url: sl.linkedin || 'https://linkedin.com/company/fusionforgecreation', active: true, color: '#0A66C2' },
      { id: 'github', platform: 'github', name: 'GitHub', url: sl.github || 'https://github.com/fusionforgecreation', active: true, color: '#8b949e' },
      { id: 'whatsapp', platform: 'whatsapp', name: 'WhatsApp', url: sl.whatsapp || 'https://wa.me/919004077126', active: true, color: '#25D366' },
      { id: 'twitter', platform: 'twitter', name: 'Twitter / X', url: sl.twitter || 'https://twitter.com/fusionforge_dev', active: true, color: '#1DA1F2' },
      { id: 'instagram', platform: 'instagram', name: 'Instagram', url: sl.instagram || 'https://instagram.com/fusionforgecreation', active: true, color: '#E1306C' },
      { id: 'youtube', platform: 'youtube', name: 'YouTube', url: sl.youtube || 'https://youtube.com/@fusionforgecreation', active: true, color: '#FF0000' }
    ];
  });

  const initialSocial: Record<string, string | undefined> = (agencyConfig.social_links || agencyConfig.socialLinks || {}) as Record<string, string | undefined>;

  const [form, setForm] = useState({
    company_name: agencyConfig.company_name || agencyConfig.name || 'Fusion Forge Creation',
    tagline: agencyConfig.tagline || 'Where Ideas Fuse With Technology',
    email: agencyConfig.email || 'contact@fusionforge.io',
    phone: agencyConfig.phone || '+91 90040 77126',
    address: agencyConfig.address || 'H2/203, Yogi Milan, Near Ring Road, Silvassa, Dadra & Nagar Haveli - 396230',
    city: agencyConfig.city || 'Silvassa',
    state: agencyConfig.state || 'Dadra & Nagar Haveli',
    postalCode: agencyConfig.postalCode || '396230',
    gstin: agencyConfig.gstin || '26AALFF1234F1Z5',
    pan: agencyConfig.pan || (agencyConfig.gstin && agencyConfig.gstin.length >= 12 ? agencyConfig.gstin.substring(2, 12) : 'AALFF1234F'),
    sacCode: agencyConfig.sacCode || '998314',
    state_code: agencyConfig.state_code || '26',
    msme_number: agencyConfig.msme_number || agencyConfig.msmeNumber || 'UDYAM-DN-01-0012345',
    jurisdiction: agencyConfig.jurisdiction || 'Silvassa, Dadra & Nagar Haveli',
    logo_url: agencyConfig.logo_url || '/logo.svg',
    signature_url: agencyConfig.signature_url || '/signatures/authorized_signatory.png',
    
    // Social Links
    github: initialSocial.github || 'https://github.com/fusionforgecreation',
    linkedin: initialSocial.linkedin || 'https://linkedin.com/company/fusionforgecreation',
    twitter: initialSocial.twitter || 'https://twitter.com/fusionforge_dev',
    instagram: initialSocial.instagram || 'https://instagram.com/fusionforgecreation',
    whatsapp: initialSocial.whatsapp || 'https://wa.me/919004077126',
    youtube: initialSocial.youtube || 'https://youtube.com/@fusionforgecreation',

    // Bank Details
    bank_name: agencyConfig.bank_name || agencyConfig.bankDetails?.bankName || 'HDFC Bank Ltd',
    account_name: agencyConfig.account_name || agencyConfig.bankDetails?.accountName || 'Fusion Forge Creation',
    account_number: agencyConfig.account_number || agencyConfig.bankDetails?.accountNumber || '50200012345678',
    ifsc_code: agencyConfig.ifsc_code || agencyConfig.bankDetails?.ifscCode || 'HDFC0001234',
    branch_name: agencyConfig.branch_name || agencyConfig.bankDetails?.branch || 'Silvassa Branch',
    upi_id: agencyConfig.bankDetails?.upiId || 'fusionforge@hdfcbank',
    terms_conditions: agencyConfig.terms_conditions || '1. 50% advance on project kickoff, balance on milestone deliverables.\n2. Invoices are payable within 15 days of issue date.\n3. Goods & Services Tax (GST) charged as per Indian taxation norms (SAC 998314).\n4. All payments to be remitted to the aforementioned bank account only.'
  });

  // Keep form updated if agencyConfig changes elsewhere
  useEffect(() => {
    setForm(prev => ({
      ...prev,
      company_name: agencyConfig.company_name || agencyConfig.name || prev.company_name,
      gstin: agencyConfig.gstin || prev.gstin,
      pan: agencyConfig.pan || prev.pan,
      sacCode: agencyConfig.sacCode || prev.sacCode,
      address: agencyConfig.address || prev.address,
      city: agencyConfig.city || prev.city,
      state: agencyConfig.state || prev.state,
      postalCode: agencyConfig.postalCode || prev.postalCode,
      msme_number: agencyConfig.msme_number || agencyConfig.msmeNumber || prev.msme_number,
      phone: agencyConfig.phone || prev.phone,
      email: agencyConfig.email || prev.email,
    }));
  }, [agencyConfig]);

  // Quick compliance fields local draft
  const [quickCompliance, setQuickCompliance] = useState({
    company_name: form.company_name,
    gstin: form.gstin,
    pan: form.pan,
    sacCode: form.sacCode,
    address: form.address,
    city: form.city,
    state: form.state,
    postalCode: form.postalCode,
  });

  useEffect(() => {
    setQuickCompliance({
      company_name: form.company_name,
      gstin: form.gstin,
      pan: form.pan,
      sacCode: form.sacCode,
      address: form.address,
      city: form.city,
      state: form.state,
      postalCode: form.postalCode,
    });
  }, [form.company_name, form.gstin, form.pan, form.sacCode, form.address, form.city, form.state, form.postalCode]);

  // Handle Quick GSTIN change with smart PAN & State code extraction
  const handleQuickGstinChange = (val: string) => {
    const cleanGst = val.toUpperCase().trim();
    let updatedPan = quickCompliance.pan;

    if (cleanGst.length >= 12) {
      const extractedPan = cleanGst.substring(2, 12);
      if (/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(extractedPan)) {
        updatedPan = extractedPan;
      }
    }

    setQuickCompliance(prev => ({
      ...prev,
      gstin: cleanGst,
      pan: updatedPan,
    }));
  };

  const handleSaveQuickCompliance = () => {
    const updated = {
      ...form,
      company_name: quickCompliance.company_name,
      gstin: quickCompliance.gstin,
      pan: quickCompliance.pan,
      sacCode: quickCompliance.sacCode,
      address: quickCompliance.address,
      city: quickCompliance.city,
      state: quickCompliance.state,
      postalCode: quickCompliance.postalCode,
    };
    setForm(updated);

    updateAgencyConfig({
      name: quickCompliance.company_name,
      legalName: quickCompliance.company_name,
      company_name: quickCompliance.company_name,
      gstin: quickCompliance.gstin,
      pan: quickCompliance.pan,
      sacCode: quickCompliance.sacCode,
      address: quickCompliance.address,
      city: quickCompliance.city,
      state: quickCompliance.state,
      postalCode: quickCompliance.postalCode,
      jurisdiction: `${quickCompliance.city}, ${quickCompliance.state}`,
    });

    setIsEditingCompliance(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // Handle GSTIN change with smart PAN & State code extraction
  const handleGstinChange = (val: string) => {
    const cleanGst = val.toUpperCase().trim();
    let updatedPan = form.pan;
    let updatedStateCode = form.state_code;

    // Auto extract PAN (chars 3 to 12) if 15 chars or matching standard format
    if (cleanGst.length >= 12) {
      const extractedPan = cleanGst.substring(2, 12);
      if (/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(extractedPan)) {
        updatedPan = extractedPan;
      }
    }
    // Auto extract State Code (first 2 digits)
    if (cleanGst.length >= 2) {
      const extractedCode = cleanGst.substring(0, 2);
      if (/^[0-9]{2}$/.test(extractedCode)) {
        updatedStateCode = extractedCode;
      }
    }

    setForm(prev => ({
      ...prev,
      gstin: cleanGst,
      pan: updatedPan,
      state_code: updatedStateCode
    }));
  };

  // Toggle active/inactive for a social channel
  const handleToggleChannelActive = (channelId: string) => {
    setSocialChannels(prev => {
      const updated = prev.map(ch => ch.id === channelId ? { ...ch, active: !ch.active } : ch);
      const dict = buildSocialLinksDictionary(updated);
      updateAgencyConfig({
        social_channels: updated,
        socialChannels: updated,
        social_links: dict,
        socialLinks: dict
      });
      return updated;
    });
  };

  // Delete a social channel
  const handleDeleteChannel = (channelId: string) => {
    setSocialChannels(prev => {
      const updated = prev.filter(ch => ch.id !== channelId);
      const dict = buildSocialLinksDictionary(updated);
      updateAgencyConfig({
        social_channels: updated,
        socialChannels: updated,
        social_links: dict,
        socialLinks: dict
      });
      return updated;
    });
  };

  // Update channel URL directly
  const handleUpdateChannelUrl = (channelId: string, url: string) => {
    setSocialChannels(prev => {
      const updated = prev.map(ch => ch.id === channelId ? { ...ch, url } : ch);
      return updated;
    });
  };

  // Add a new custom or preset social channel
  const handleAddSocialChannel = () => {
    if (!newChannelUrl.trim()) return;
    const preset = PLATFORM_PRESETS.find(p => p.id === newChannelPlatform);
    const finalName = newChannelName.trim() || (preset ? preset.name : 'Custom Channel');
    const newId = `${newChannelPlatform}-${Date.now()}`;
    const newChannel: SocialChannelItem = {
      id: newId,
      platform: newChannelPlatform,
      name: finalName,
      url: newChannelUrl.trim(),
      active: true,
      color: preset?.defaultColor || '#06b6d4'
    };

    const updated = [...socialChannels, newChannel];
    setSocialChannels(updated);
    const dict = buildSocialLinksDictionary(updated);
    updateAgencyConfig({
      social_channels: updated,
      socialChannels: updated,
      social_links: dict,
      socialLinks: dict
    });

    setNewChannelName('');
    setNewChannelUrl('');
    setIsAddingChannel(false);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const derivedSocialDict = buildSocialLinksDictionary(socialChannels);

    updateAgencyConfig({
      name: form.company_name,
      legalName: form.company_name,
      company_name: form.company_name,
      tagline: form.tagline,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      state: form.state,
      postalCode: form.postalCode,
      gstin: form.gstin,
      pan: form.pan,
      sacCode: form.sacCode,
      state_code: form.state_code,
      jurisdiction: form.jurisdiction,
      logo_url: form.logo_url,
      signature_url: form.signature_url,
      social_channels: socialChannels,
      socialChannels: socialChannels,
      social_links: derivedSocialDict,
      socialLinks: derivedSocialDict,
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
        upiId: form.upi_id
      }
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const isGstinValid = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(form.gstin);
  const isPanValid = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.pan);

  const settingsTabs = [
    { id: 'profile' as const, label: 'Master Profile & Tax', icon: Building2, desc: 'Company identity, GSTIN, PAN, Bank & Social' },
    { id: 'presets' as const, label: 'Price Presets', icon: Tag, desc: 'Supabase-backed Quick Add service rates & SAC' },
    { id: 'payment-terms' as const, label: 'Payment Terms & Validity', icon: Clock, desc: 'Default quote validity & milestone terms' },
    { id: 'numbering' as const, label: 'Document Numbering', icon: ListOrdered, desc: 'Invoice & Quotation prefixes & sequences' },
    { id: 'terms' as const, label: 'Terms & Conditions', icon: FileText, desc: 'Quotation & Invoice legal terms templates' },
    { id: 'assets' as const, label: 'Seals & Signatures', icon: Stamp, desc: 'Official company stamp & signatory assets' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            Agency Settings & Governance
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Admin configuration for GSTIN, PAN, office address, service presets, payment terms, document numbering, and legal master records.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-emerald-300 text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>Live Synchronized with Database & Invoices</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-inner">
        {settingsTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeSettingsTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSettingsTab(tab.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-extrabold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* RENDER ACTIVE TAB CONTENT */}
      {activeSettingsTab === 'presets' && <PricePresetsSettings />}
      {activeSettingsTab === 'payment-terms' && <PaymentTermsSettings />}
      {activeSettingsTab === 'numbering' && <DocumentNumberingSettings />}
      {activeSettingsTab === 'terms' && <TermsConditionsSettings />}
      {activeSettingsTab === 'assets' && <AssetUploadSettings />}

      {activeSettingsTab === 'profile' && (
        <div className="space-y-6">
          {/* Live Compliance & Office Preview Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#071126] via-[#091838] to-[#050e24] border border-cyan-500/30 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                <span className="text-xs font-black uppercase tracking-wider text-cyan-300">
                  Live Compliance Preview (Public Website & Invoices)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {!isEditingCompliance ? (
                  <button
                    type="button"
                    onClick={() => setIsEditingCompliance(true)}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Quick Edit Compliance</span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={handleSaveQuickCompliance}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer shadow"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save & Apply</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingCompliance(false)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

        {isEditingCompliance ? (
          /* Inline Compliance Editor */
          <div className="p-4 rounded-xl bg-slate-950/90 border border-cyan-500/40 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Editing Live Legal & Tax Compliance (Direct Sync)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Instant application across all modules</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Company / Legal Name</label>
                <input
                  type="text"
                  value={quickCompliance.company_name}
                  onChange={e => setQuickCompliance({ ...quickCompliance, company_name: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 outline-none"
                  placeholder="Fusion Forge Creation"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">GSTIN (15 Digits)</label>
                <input
                  type="text"
                  maxLength={15}
                  value={quickCompliance.gstin}
                  onChange={e => handleQuickGstinChange(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono font-bold focus:border-cyan-400 outline-none uppercase"
                  placeholder="26AALFF1234F1Z5"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">PAN (10 Digits)</label>
                <input
                  type="text"
                  maxLength={10}
                  value={quickCompliance.pan}
                  onChange={e => setQuickCompliance({ ...quickCompliance, pan: e.target.value.toUpperCase().trim() })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono font-bold focus:border-cyan-400 outline-none uppercase"
                  placeholder="AALFF1234F"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Office Street Address</label>
                <input
                  type="text"
                  value={quickCompliance.address}
                  onChange={e => setQuickCompliance({ ...quickCompliance, address: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 outline-none"
                  placeholder="H2/203, Yogi Milan, Near Ring Road, Silvassa"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">City</label>
                <input
                  type="text"
                  value={quickCompliance.city}
                  onChange={e => setQuickCompliance({ ...quickCompliance, city: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 outline-none"
                  placeholder="Silvassa"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">State & Pincode</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={quickCompliance.state}
                    onChange={e => setQuickCompliance({ ...quickCompliance, state: e.target.value })}
                    className="w-2/3 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 outline-none"
                    placeholder="Dadra & Nagar Haveli"
                  />
                  <input
                    type="text"
                    value={quickCompliance.postalCode}
                    onChange={e => setQuickCompliance({ ...quickCompliance, postalCode: e.target.value })}
                    className="w-1/3 px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:border-cyan-400 outline-none"
                    placeholder="396230"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsEditingCompliance(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveQuickCompliance}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save & Apply Everywhere</span>
              </button>
            </div>
          </div>
        ) : (
          /* Live Compliance Details Display */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-cyan-500/20">
            {/* Compliance & Office Box */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-white text-xs uppercase tracking-wider flex items-center justify-between">
                <span>COMPLIANCE & OFFICE</span>
                <span className="text-[10px] text-cyan-400 lowercase font-mono">SAC: {form.sacCode}</span>
              </div>
              <div className="space-y-1 text-slate-300">
                <div className="flex items-center justify-between">
                  <span>GSTIN:</span>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                      {form.gstin || '—'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(form.gstin, 'gstin')}
                      className="p-1 hover:text-cyan-400 text-slate-500 cursor-pointer"
                      title="Copy GSTIN"
                    >
                      {copiedKey === 'gstin' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>PAN:</span>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                      {form.pan || '—'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(form.pan, 'pan')}
                      className="p-1 hover:text-cyan-400 text-slate-500 cursor-pointer"
                      title="Copy PAN"
                    >
                      {copiedKey === 'pan' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>SAC Code:</span>
                  <span className="font-mono text-slate-200">{form.sacCode} (IT Software)</span>
                </div>
                <div className="flex items-start justify-between gap-2 pt-1 border-t border-slate-800">
                  <span className="shrink-0">Office:</span>
                  <span className="text-right text-slate-200 text-[11px] font-medium">{form.address}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>City & State:</span>
                  <span className="text-slate-200 font-semibold">{form.city}, {form.state} - {form.postalCode}</span>
                </div>
              </div>
            </div>

            {/* Connected Social Channels Preview & Management */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5 text-xs">
              <div className="font-bold text-white text-xs uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                  CONNECTED SOCIAL CHANNELS
                </span>
                <span className="text-[10px] text-cyan-400 font-mono">
                  {socialChannels.filter(c => c.active).length} Active Channels
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                {socialChannels.map(channel => (
                  <div 
                    key={channel.id}
                    className={`p-2.5 rounded-lg border transition-all flex items-center justify-between gap-2 ${
                      channel.active 
                        ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700' 
                        : 'bg-slate-950/50 border-slate-900 opacity-60'
                    }`}
                  >
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <span 
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: channel.active ? (channel.color || '#06b6d4') : '#64748b' }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <SocialIcon platform={channel.platform} className="w-3 h-3 text-slate-300" />
                          <span className="text-slate-200 font-semibold truncate text-xs">{channel.name}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">{channel.url || 'No URL configured'}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      {/* Active/Inactive Toggle Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleChannelActive(channel.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                          channel.active
                            ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
                        }`}
                        title={channel.active ? 'Click to Deactivate' : 'Click to Activate'}
                      >
                        {channel.active ? (
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

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteChannel(channel.id)}
                        className="p-1 rounded hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete Channel"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {socialChannels.length === 0 && (
                <div className="p-3 text-center text-slate-500 text-xs italic bg-slate-900/50 rounded-lg">
                  No social channels configured. Add links below in Section 4.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Direct Links Row - Reflected Destinations */}
        <div className="p-3.5 rounded-xl bg-[#061026] border border-cyan-500/20 text-xs">
          <div className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              Direct Links Where Edits Are Reflected Live:
            </span>
            <span className="text-slate-400 font-mono text-[9px]">Click to inspect live output</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* 1. Frontend Website Link */}
            <button
              type="button"
              onClick={() => setCurrentView('public')}
              className="p-2.5 rounded-xl bg-gradient-to-r from-blue-950/60 to-slate-900/90 border border-blue-500/30 hover:border-blue-400 text-left transition-all group cursor-pointer hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-white text-xs flex items-center gap-1.5 group-hover:text-cyan-300">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  Frontend Website
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:text-cyan-400 transition-all" />
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1">
                Footer, Contact & FAQ: <strong className="text-slate-300">{form.gstin}</strong>
              </p>
            </button>

            {/* 2. Tax Invoices Link */}
            <button
              type="button"
              onClick={() => setActiveTab('invoices')}
              className="p-2.5 rounded-xl bg-gradient-to-r from-blue-950/60 to-slate-900/90 border border-blue-500/30 hover:border-blue-400 text-left transition-all group cursor-pointer hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-white text-xs flex items-center gap-1.5 group-hover:text-cyan-300">
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  Tax Invoices
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:text-cyan-400 transition-all" />
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1">
                Seller GSTIN & PDF: <strong className="text-slate-300">{form.gstin}</strong>
              </p>
            </button>

            {/* 3. Quotations Link */}
            <button
              type="button"
              onClick={() => setActiveTab('quotations')}
              className="p-2.5 rounded-xl bg-gradient-to-r from-blue-950/60 to-slate-900/90 border border-blue-500/30 hover:border-blue-400 text-left transition-all group cursor-pointer hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-white text-xs flex items-center gap-1.5 group-hover:text-cyan-300">
                  <FileSignature className="w-3.5 h-3.5 text-emerald-400" />
                  Quotations
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:text-cyan-400 transition-all" />
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1">
                Estimates & Proposals: <strong className="text-slate-300">SAC {form.sacCode}</strong>
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-gradient-to-b from-[#0d1a3b]/95 via-[#09132e]/95 to-[#060c1f]/95 border border-blue-500/25 space-y-6 shadow-2xl backdrop-blur-md">
        
        {/* 1. Core Company Identity */}
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-cyan-400 tracking-wider mb-3">
            <Building2 className="w-4 h-4" />
            <span>1. Business Identity & Public Contacts</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Company / Brand Name</label>
              <input
                type="text"
                value={form.company_name}
                onChange={e => setForm({ ...form, company_name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-cyan-400"
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
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-cyan-400"
                placeholder="Where Ideas Fuse With Technology"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Official Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-cyan-400"
                placeholder="contact@fusionforge.io"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Contact Phone / WhatsApp</label>
              <input
                type="text"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-cyan-400"
                placeholder="+91 90040 77126"
                required
              />
            </div>
          </div>
        </div>

        {/* 2. Official Address & Location Controls */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-cyan-400 tracking-wider mb-3">
            <MapPin className="w-4 h-4" />
            <span>2. Official Office Address & Postal Details</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-3">
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Full Registered Office Address
              </label>
              <input
                type="text"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-cyan-400 font-medium"
                placeholder="H2/203, Yogi Milan, Near Ring Road, Silvassa, Dadra & Nagar Haveli - 396230"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">City</label>
              <input
                type="text"
                value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-cyan-400"
                placeholder="Silvassa"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">State / Union Territory</label>
              <input
                type="text"
                value={form.state}
                onChange={e => setForm({ ...form, state: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-cyan-400"
                placeholder="Dadra & Nagar Haveli"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Postal / PIN Code</label>
              <input
                type="text"
                value={form.postalCode}
                onChange={e => setForm({ ...form, postalCode: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono outline-none focus:border-cyan-400"
                placeholder="396230"
                required
              />
            </div>
          </div>
        </div>

        {/* 3. GSTIN, PAN & Tax Jurisdiction Controls */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-cyan-400 tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>3. GSTIN, PAN & Tax Compliance Control</span>
            </div>
            <div className="text-[10px] text-slate-400">
              PAN is auto-extracted from 3rd-12th chars of GSTIN or can be edited directly
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-semibold text-slate-300 block mb-1 flex items-center justify-between">
                <span>GSTIN Number (15 Digits)</span>
                {form.gstin && (
                  <span className={`text-[10px] font-mono ${isGstinValid ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {isGstinValid ? '✓ Valid Format' : '⚠️ Check Format'}
                  </span>
                )}
              </label>
              <input
                type="text"
                value={form.gstin}
                onChange={e => handleGstinChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono uppercase outline-none focus:border-cyan-400"
                placeholder="26AALFF1234F1Z5"
                maxLength={15}
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1 flex items-center justify-between">
                <span>PAN Number (10 Digits)</span>
                {form.pan && (
                  <span className={`text-[10px] font-mono ${isPanValid ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {isPanValid ? '✓ Valid' : '⚠️ Format'}
                  </span>
                )}
              </label>
              <input
                type="text"
                value={form.pan}
                onChange={e => setForm({ ...form, pan: e.target.value.toUpperCase().trim() })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono uppercase outline-none focus:border-cyan-400"
                placeholder="AALFF1234F"
                maxLength={10}
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">SAC Code (IT Software)</label>
              <input
                type="text"
                value={form.sacCode}
                onChange={e => setForm({ ...form, sacCode: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono outline-none focus:border-cyan-400"
                placeholder="998314"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">State Code (GST Master)</label>
              <input
                type="text"
                value={form.state_code}
                onChange={e => setForm({ ...form, state_code: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono outline-none focus:border-cyan-400"
                placeholder="26"
                maxLength={2}
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">MSME / Udyam Reg. No.</label>
              <input
                type="text"
                value={form.msme_number}
                onChange={e => setForm({ ...form, msme_number: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono outline-none focus:border-cyan-400"
                placeholder="UDYAM-DN-01-0012345"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Legal Arbitration Jurisdiction</label>
              <input
                type="text"
                value={form.jurisdiction}
                onChange={e => setForm({ ...form, jurisdiction: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-cyan-400"
                placeholder="Silvassa, Dadra & Nagar Haveli"
                required
              />
            </div>
          </div>
        </div>

        {/* 4. Social Media Channels & Links */}
        <div className="pt-4 border-t border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-cyan-400 tracking-wider">
              <Share2 className="w-4 h-4" />
              <span>4. Social Media Channels & Interactive Links</span>
            </div>
            
            <button
              type="button"
              onClick={() => setIsAddingChannel(!isAddingChannel)}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center space-x-1.5 transition-all self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Social Channel</span>
            </button>
          </div>

          {/* Add Channel Modal / Inline Form */}
          {isAddingChannel && (
            <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-cyan-400" />
                  Connect New Social Media Channel
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingChannel(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Platform</label>
                  <select
                    value={newChannelPlatform}
                    onChange={e => {
                      const p = e.target.value;
                      setNewChannelPlatform(p);
                      const preset = PLATFORM_PRESETS.find(item => item.id === p);
                      if (preset) {
                        setNewChannelName(preset.name);
                      }
                    }}
                    className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 outline-none"
                  >
                    {PLATFORM_PRESETS.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Display Label / Name</label>
                  <input
                    type="text"
                    value={newChannelName}
                    onChange={e => setNewChannelName(e.target.value)}
                    placeholder="e.g. LinkedIn Profile, Discord Server"
                    className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Destination URL / Link</label>
                  <input
                    type="text"
                    value={newChannelUrl}
                    onChange={e => setNewChannelUrl(e.target.value)}
                    placeholder={PLATFORM_PRESETS.find(p => p.id === newChannelPlatform)?.placeholder || 'https://...'}
                    className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingChannel(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddSocialChannel}
                  disabled={!newChannelUrl.trim()}
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Add Channel</span>
                </button>
              </div>
            </div>
          )}

          {/* Social Channels List with Direct Edit, Activation and Delete */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {socialChannels.map(channel => (
              <div 
                key={channel.id}
                className={`p-3 rounded-xl border transition-all space-y-2 ${
                  channel.active 
                    ? 'bg-slate-900/90 border-slate-700 hover:border-slate-600' 
                    : 'bg-slate-950/60 border-slate-900 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
                      <SocialIcon platform={channel.platform} className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{channel.name}</span>
                      <span className="text-[10px] text-slate-400 capitalize">{channel.platform}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    {/* Active/Inactive Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleChannelActive(channel.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                        channel.active
                          ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
                      }`}
                      title={channel.active ? 'Click to Deactivate' : 'Click to Activate'}
                    >
                      {channel.active ? (
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

                    {/* Delete Channel */}
                    <button
                      type="button"
                      onClick={() => handleDeleteChannel(channel.id)}
                      className="p-1 rounded hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete Channel"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-medium text-slate-400 block mb-1">Target URL / Account</label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={channel.url}
                      onChange={e => handleUpdateChannelUrl(channel.id, e.target.value)}
                      className="w-full px-2.5 py-1.5 pr-7 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-cyan-400"
                      placeholder="https://..."
                    />
                    {channel.url && (
                      <a
                        href={formatSocialUrl(channel.url, channel.platform)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute right-2 text-slate-400 hover:text-cyan-300"
                        title="Test Link in New Tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {socialChannels.length === 0 && (
            <div className="p-6 text-center text-slate-400 border border-dashed border-slate-800 rounded-xl">
              <Share2 className="w-6 h-6 mx-auto mb-2 text-slate-500 opacity-50" />
              <p className="text-xs font-semibold">No Social Media Channels</p>
              <p className="text-[11px] text-slate-500 mb-3">Click "Add Social Channel" to configure your links.</p>
              <button
                type="button"
                onClick={() => setIsAddingChannel(true)}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Channel</span>
              </button>
            </div>
          )}
        </div>

        {/* 5. Branding & Signatures */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-cyan-400 tracking-wider">
              <FileSignature className="w-4 h-4" />
              <span>5. Brand Logo & Authorized Signature</span>
            </div>
          </div>

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
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-cyan-400"
                placeholder="/logo.svg"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Authorized Signatory Image URL</label>
              <input
                type="text"
                value={form.signature_url}
                onChange={e => setForm({ ...form, signature_url: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-cyan-400"
                placeholder="/signatures/authorized_signatory.png"
              />
            </div>
          </div>
        </div>

        {/* 6. Settlement Bank Details */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-cyan-400 tracking-wider mb-3">
            <Landmark className="w-4 h-4" />
            <span>6. Settlement Bank Account Details</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Bank Name</label>
              <input
                type="text"
                value={form.bank_name}
                onChange={e => setForm({ ...form, bank_name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-cyan-400"
                placeholder="HDFC Bank Ltd"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Account Holder Name</label>
              <input
                type="text"
                value={form.account_name}
                onChange={e => setForm({ ...form, account_name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-cyan-400"
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
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono outline-none focus:border-cyan-400"
                placeholder="50200012345678"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">IFSC Code</label>
              <input
                type="text"
                value={form.ifsc_code}
                onChange={e => setForm({ ...form, ifsc_code: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono uppercase outline-none focus:border-cyan-400"
                placeholder="HDFC0001234"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Branch Name</label>
              <input
                type="text"
                value={form.branch_name}
                onChange={e => setForm({ ...form, branch_name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-cyan-400"
                placeholder="Silvassa Branch"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">UPI VPA ID</label>
              <input
                type="text"
                value={form.upi_id}
                onChange={e => setForm({ ...form, upi_id: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono outline-none focus:border-cyan-400"
                placeholder="fusionforge@hdfcbank"
              />
            </div>
          </div>
        </div>

        {/* 7. Terms & Conditions */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-cyan-400 tracking-wider mb-3">
            <FileText className="w-4 h-4" />
            <span>7. Standard Quotation & Invoice Terms</span>
          </div>
          <div>
            <textarea
              rows={4}
              value={form.terms_conditions}
              onChange={e => setForm({ ...form, terms_conditions: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-cyan-400 font-mono leading-relaxed"
              placeholder="Enter standard invoice & quotation terms..."
              required
            />
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <span className="text-xs text-slate-400">
            Changes will update invoices, quotations, PDF generator, and public site immediately.
          </span>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-xs font-bold text-slate-950 flex items-center space-x-2 transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
          >
            {saved ? <Check className="w-4 h-4 text-slate-950" /> : <Save className="w-4 h-4 text-slate-950" />}
            <span>{saved ? 'Changes Saved Successfully!' : 'Save & Publish Master Profile'}</span>
          </button>
        </div>
      </form>
      </div>
      )}
    </div>
  );
};
