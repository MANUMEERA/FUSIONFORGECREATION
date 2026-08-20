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
import { NotificationCenter } from './notifications/NotificationCenter';
import { EmailLogsManager } from './notifications/EmailLogsManager';
import { Bell, Mail } from 'lucide-react';

type SettingsTab = 'profile' | 'presets' | 'payment-terms' | 'numbering' | 'terms' | 'assets' | 'notifications' | 'email-logs';

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
      { id: 'whatsapp', platform: 'whatsapp', name: 'WhatsApp', url: sl.whatsapp || '', active: false, color: '#25D366' },
      { id: 'twitter', platform: 'twitter', name: 'Twitter / X', url: sl.twitter || 'https://twitter.com/fusionforge_dev', active: true, color: '#1DA1F2' },
      { id: 'instagram', platform: 'instagram', name: 'Instagram', url: sl.instagram || 'https://instagram.com/fusionforgecreation', active: true, color: '#E1306C' },
      { id: 'youtube', platform: 'youtube', name: 'YouTube', url: sl.youtube || 'https://youtube.com/@fusionforgecreation', active: true, color: '#FF0000' }
    ];
  });

  const initialSocial: Record<string, string | undefined> = (agencyConfig.social_links || agencyConfig.socialLinks || {}) as Record<string, string | undefined>;

  const [form, setForm] = useState({
    company_name: agencyConfig.company_name || agencyConfig.name || 'Fusion Forge Creation',
    tagline: agencyConfig.tagline || 'Where Ideas Fuse With Technology',
    email: agencyConfig.email || '',
    phone: agencyConfig.phone || '',
    address: agencyConfig.address || 'H2/203, Yogi Milan, Near Ring Road, Silvassa, Dadra & Nagar Haveli - 396230',
    city: agencyConfig.city || 'Silvassa',
    state: agencyConfig.state || 'Dadra & Nagar Haveli',
    postalCode: agencyConfig.postalCode || '396230',
    gstin: agencyConfig.gstin || '',
    pan: agencyConfig.pan || (agencyConfig.gstin && agencyConfig.gstin.length >= 12 ? agencyConfig.gstin.substring(2, 12) : ''),
    sacCode: agencyConfig.sacCode || '998314',
    state_code: agencyConfig.state_code || '26',
    msme_number: agencyConfig.msme_number || agencyConfig.msmeNumber || '',
    jurisdiction: agencyConfig.jurisdiction || 'Silvassa, Dadra & Nagar Haveli',
    logo_url: agencyConfig.logo_url || '/logo.svg',
    signature_url: agencyConfig.signature_url || '/signatures/authorized_signatory.png',
    
    // Social Links
    github: initialSocial.github || 'https://github.com/fusionforgecreation',
    linkedin: initialSocial.linkedin || 'https://linkedin.com/company/fusionforgecreation',
    twitter: initialSocial.twitter || 'https://twitter.com/fusionforge_dev',
    instagram: initialSocial.instagram || 'https://instagram.com/fusionforgecreation',
    whatsapp: initialSocial.whatsapp || '',
    youtube: initialSocial.youtube || 'https://youtube.com/@fusionforgecreation',

    // Bank Details
    bank_name: agencyConfig.bank_name || agencyConfig.bankDetails?.bankName || '',
    account_name: agencyConfig.account_name || agencyConfig.bankDetails?.accountName || 'Fusion Forge Creation',
    account_number: agencyConfig.account_number || agencyConfig.bankDetails?.accountNumber || '',
    ifsc_code: agencyConfig.ifsc_code || agencyConfig.bankDetails?.ifscCode || '',
    branch_name: agencyConfig.branch_name || agencyConfig.bankDetails?.branch || '',
    upi_id: agencyConfig.bankDetails?.upiId || '',
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
    { id: 'notifications' as const, label: 'Notification Center', icon: Bell, desc: 'Central Supabase event feed & role triggers' },
    { id: 'email-logs' as const, label: 'Email Dispatch Logs', icon: Mail, desc: 'Official agency email transmission audit' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#1E1B2E] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#8E2D9D]" />
            Agency Settings & Governance
          </h2>
          <p className="text-xs text-[#5F5A72] mt-0.5">
            Admin configuration for GSTIN, PAN, office address, service presets, payment terms, document numbering, and legal master records.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-emerald-700 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Live Synchronized with Database & Invoices</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-white border border-[#E8E0F0] shadow-sm">
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
                  ? 'bg-[#8E2D9D] text-white shadow-md shadow-[#8E2D9D]/20 font-bold'
                  : 'text-[#5F5A72] hover:text-[#1E1B2E] hover:bg-[#F3E8FF]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#817B91]'}`} />
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
      {activeSettingsTab === 'notifications' && (
        <div className="max-w-2xl">
          <NotificationCenter isModal={true} />
        </div>
      )}
      {activeSettingsTab === 'email-logs' && <EmailLogsManager />}

      {activeSettingsTab === 'profile' && (
        <div className="space-y-6">
          {/* Live Compliance & Office Preview Card */}
          <div className="p-5 rounded-2xl bg-white border border-[#E8E0F0] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8E2D9D] animate-pulse"></span>
                <span className="text-xs font-black uppercase tracking-wider text-[#8E2D9D]">
                  Live Compliance Preview (Public Website & Invoices)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {!isEditingCompliance ? (
                  <button
                    type="button"
                    onClick={() => setIsEditingCompliance(true)}
                    className="px-3 py-1.5 rounded-lg bg-[#F3E8FF] hover:bg-[#E9D5FF] text-[#8E2D9D] border border-[#C084FC]/50 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Quick Edit Compliance</span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={handleSaveQuickCompliance}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save & Apply</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingCompliance(false)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#FAF5FF] hover:bg-[#F3E8FF] border border-[#E8E0F0] text-[#5F5A72] text-xs font-medium transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

        {isEditingCompliance ? (
          /* Inline Compliance Editor */
          <div className="p-4 rounded-xl bg-[#FAF8FF] border border-[#C084FC]/50 space-y-3">
            <div className="flex items-center justify-between border-b border-[#E8E0F0] pb-2">
              <span className="text-xs font-bold text-[#8E2D9D] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#8E2D9D]" />
                Editing Live Legal & Tax Compliance (Direct Sync)
              </span>
              <span className="text-[10px] text-[#5F5A72] font-mono">Instant application across all modules</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-[#5F5A72] uppercase block mb-1">Company / Legal Name</label>
                <input
                  type="text"
                  value={quickCompliance.company_name}
                  onChange={e => setQuickCompliance({ ...quickCompliance, company_name: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15 outline-none"
                  placeholder="Fusion Forge Creation"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#5F5A72] uppercase block mb-1">GSTIN (15 Digits)</label>
                <input
                  type="text"
                  maxLength={15}
                  value={quickCompliance.gstin}
                  onChange={e => handleQuickGstinChange(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] font-mono font-bold focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15 outline-none uppercase"
                  placeholder="e.g. 26AAAAA0000A1Z5"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#5F5A72] uppercase block mb-1">PAN (10 Digits)</label>
                <input
                  type="text"
                  maxLength={10}
                  value={quickCompliance.pan}
                  onChange={e => setQuickCompliance({ ...quickCompliance, pan: e.target.value.toUpperCase().trim() })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] font-mono font-bold focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15 outline-none uppercase"
                  placeholder="e.g. AAAAA0000A"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-[#5F5A72] uppercase block mb-1">Office Street Address</label>
                <input
                  type="text"
                  value={quickCompliance.address}
                  onChange={e => setQuickCompliance({ ...quickCompliance, address: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15 outline-none"
                  placeholder="H2/203, Yogi Milan, Near Ring Road, Silvassa"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#5F5A72] uppercase block mb-1">City</label>
                <input
                  type="text"
                  value={quickCompliance.city}
                  onChange={e => setQuickCompliance({ ...quickCompliance, city: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15 outline-none"
                  placeholder="Silvassa"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#5F5A72] uppercase block mb-1">State & Pincode</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={quickCompliance.state}
                    onChange={e => setQuickCompliance({ ...quickCompliance, state: e.target.value })}
                    className="w-2/3 px-2.5 py-1.5 rounded-lg bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15 outline-none"
                    placeholder="Dadra & Nagar Haveli"
                  />
                  <input
                    type="text"
                    value={quickCompliance.postalCode}
                    onChange={e => setQuickCompliance({ ...quickCompliance, postalCode: e.target.value })}
                    className="w-1/3 px-2 py-1.5 rounded-lg bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] font-mono focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15 outline-none"
                    placeholder="396230"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E0F0]">
              <button
                type="button"
                onClick={() => setIsEditingCompliance(false)}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#FAF5FF] border border-[#E8E0F0] text-[#5F5A72] text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveQuickCompliance}
                className="px-4 py-1.5 rounded-lg bg-[#8E2D9D] hover:bg-[#6F42C1] text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save & Apply Everywhere</span>
              </button>
            </div>
          </div>
        ) : (
          /* Live Compliance Details Display */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#E8E0F0]">
            {/* Compliance & Office Box */}
            <div className="p-4 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] space-y-2 text-xs">
              <div className="font-bold text-[#1E1B2E] text-xs uppercase tracking-wider flex items-center justify-between">
                <span>COMPLIANCE & OFFICE</span>
                <span className="text-[10px] text-[#8E2D9D] lowercase font-mono font-bold">SAC: {form.sacCode}</span>
              </div>
              <div className="space-y-1 text-[#5F5A72]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">GSTIN:</span>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono font-bold text-[#1E1B2E] bg-white px-2 py-0.5 rounded border border-[#E8E0F0]">
                      {form.gstin || '—'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(form.gstin, 'gstin')}
                      className="p-1 hover:text-[#8E2D9D] text-[#817B91] cursor-pointer"
                      title="Copy GSTIN"
                    >
                      {copiedKey === 'gstin' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">PAN:</span>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono font-bold text-[#1E1B2E] bg-white px-2 py-0.5 rounded border border-[#E8E0F0]">
                      {form.pan || '—'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(form.pan, 'pan')}
                      className="p-1 hover:text-[#8E2D9D] text-[#817B91] cursor-pointer"
                      title="Copy PAN"
                    >
                      {copiedKey === 'pan' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">SAC Code:</span>
                  <span className="font-mono font-bold text-[#1E1B2E]">{form.sacCode} (IT Software)</span>
                </div>
                <div className="flex items-start justify-between gap-2 pt-1 border-t border-[#E8E0F0]">
                  <span className="shrink-0 font-semibold">Office:</span>
                  <span className="text-right text-[#1E1B2E] text-[11px] font-medium">{form.address}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">City & State:</span>
                  <span className="text-[#1E1B2E] font-semibold">{form.city}, {form.state} - {form.postalCode}</span>
                </div>
              </div>
            </div>

            {/* Connected Social Channels Preview & Management */}
            <div className="p-4 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] space-y-2.5 text-xs">
              <div className="font-bold text-[#1E1B2E] text-xs uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-[#8E2D9D]" />
                  CONNECTED SOCIAL CHANNELS
                </span>
                <span className="text-[10px] text-[#8E2D9D] font-mono font-bold">
                  {socialChannels.filter(c => c.active).length} Active Channels
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                {socialChannels.map(channel => (
                  <div 
                    key={channel.id}
                    className={`p-2.5 rounded-lg border transition-all flex items-center justify-between gap-2 ${
                      channel.active 
                        ? 'bg-white border-[#E8E0F0] hover:border-[#C084FC]' 
                        : 'bg-[#FAF8FF] border-[#E8E0F0] opacity-60'
                    }`}
                  >
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <span 
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: channel.active ? (channel.color || '#8E2D9D') : '#817B91' }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <SocialIcon platform={channel.platform} className="w-3 h-3 text-[#5F5A72]" />
                          <span className="text-[#1E1B2E] font-semibold truncate text-xs">{channel.name}</span>
                        </div>
                        <p className="text-[10px] text-[#817B91] truncate">{channel.url || 'No URL configured'}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      {/* Active/Inactive Toggle Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleChannelActive(channel.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                          channel.active
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            : 'bg-slate-100 text-[#5F5A72] hover:bg-slate-200 border border-slate-200'
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
                        className="p-1 rounded hover:bg-red-50 text-[#817B91] hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete Channel"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {socialChannels.length === 0 && (
                <div className="p-3 text-center text-[#817B91] text-xs italic bg-white rounded-lg border border-[#E8E0F0]">
                  No social channels configured. Add links below in Section 4.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Direct Links Row - Reflected Destinations */}
        <div className="p-3.5 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-xs">
          <div className="text-[10px] font-bold text-[#8E2D9D] uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#8E2D9D]" />
              Direct Links Where Edits Are Reflected Live:
            </span>
            <span className="text-[#5F5A72] font-mono text-[9px]">Click to inspect live output</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* 1. Frontend Website Link */}
            <button
              type="button"
              onClick={() => setCurrentView('public')}
              className="p-2.5 rounded-xl bg-white border border-[#E8E0F0] hover:border-[#8E2D9D] text-left transition-all group cursor-pointer hover:shadow-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#1E1B2E] text-xs flex items-center gap-1.5 group-hover:text-[#8E2D9D]">
                  <Globe className="w-3.5 h-3.5 text-[#8E2D9D]" />
                  Frontend Website
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#817B91] group-hover:translate-x-0.5 group-hover:text-[#8E2D9D] transition-all" />
              </div>
              <p className="text-[11px] text-[#5F5A72] line-clamp-1">
                Footer, Contact & FAQ: <strong className="text-[#1E1B2E]">{form.gstin}</strong>
              </p>
            </button>

            {/* 2. Tax Invoices Link */}
            <button
              type="button"
              onClick={() => setActiveTab('invoices')}
              className="p-2.5 rounded-xl bg-white border border-[#E8E0F0] hover:border-[#8E2D9D] text-left transition-all group cursor-pointer hover:shadow-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#1E1B2E] text-xs flex items-center gap-1.5 group-hover:text-[#8E2D9D]">
                  <FileText className="w-3.5 h-3.5 text-[#8E2D9D]" />
                  Tax Invoices
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#817B91] group-hover:translate-x-0.5 group-hover:text-[#8E2D9D] transition-all" />
              </div>
              <p className="text-[11px] text-[#5F5A72] line-clamp-1">
                Seller GSTIN & PDF: <strong className="text-[#1E1B2E]">{form.gstin}</strong>
              </p>
            </button>

            {/* 3. Quotations Link */}
            <button
              type="button"
              onClick={() => setActiveTab('quotations')}
              className="p-2.5 rounded-xl bg-white border border-[#E8E0F0] hover:border-[#8E2D9D] text-left transition-all group cursor-pointer hover:shadow-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#1E1B2E] text-xs flex items-center gap-1.5 group-hover:text-[#8E2D9D]">
                  <FileSignature className="w-3.5 h-3.5 text-emerald-600" />
                  Quotations
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#817B91] group-hover:translate-x-0.5 group-hover:text-[#8E2D9D] transition-all" />
              </div>
              <p className="text-[11px] text-[#5F5A72] line-clamp-1">
                Estimates & Proposals: <strong className="text-[#1E1B2E]">SAC {form.sacCode}</strong>
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-white border border-[#E8E0F0] space-y-6 shadow-sm">
        
        {/* 1. Core Company Identity */}
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#8E2D9D] tracking-wider mb-3">
            <Building2 className="w-4 h-4" />
            <span>1. Business Identity & Public Contacts</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">Company / Brand Name</label>
              <input
                type="text"
                value={form.company_name}
                onChange={e => setForm({ ...form, company_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15"
                placeholder="Fusion Forge Creation"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">Tagline / Mission</label>
              <input
                type="text"
                value={form.tagline}
                onChange={e => setForm({ ...form, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15"
                placeholder="Where Ideas Fuse With Technology"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">Official Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15"
                placeholder="e.g. contact@yourcompany.com"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">Contact Phone / WhatsApp</label>
              <input
                type="text"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15"
                placeholder="e.g. +91 98765 43210"
              />
            </div>
          </div>
        </div>

        {/* 2. Official Address & Location Controls */}
        <div className="pt-4 border-t border-[#E8E0F0]">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#8E2D9D] tracking-wider mb-3">
            <MapPin className="w-4 h-4" />
            <span>2. Official Office Address & Postal Details</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-3">
              <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">
                Full Registered Office Address
              </label>
              <input
                type="text"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15 font-medium"
                placeholder="H2/203, Yogi Milan, Near Ring Road, Silvassa, Dadra & Nagar Haveli - 396230"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">City</label>
              <input
                type="text"
                value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15"
                placeholder="Silvassa"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">State / Union Territory</label>
              <input
                type="text"
                value={form.state}
                onChange={e => setForm({ ...form, state: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15"
                placeholder="Dadra & Nagar Haveli"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">Postal / PIN Code</label>
              <input
                type="text"
                value={form.postalCode}
                onChange={e => setForm({ ...form, postalCode: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] font-mono outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15"
                placeholder="396230"
              />
            </div>
          </div>
        </div>

        {/* 3. GSTIN, PAN & Tax Jurisdiction Controls */}
        <div className="pt-4 border-t border-[#E8E0F0]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#8E2D9D] tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>3. GSTIN, PAN & Tax Compliance Control</span>
            </div>
            <div className="text-[10px] text-[#5F5A72]">
              PAN is auto-extracted from 3rd-12th chars of GSTIN or can be edited directly
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1 flex items-center justify-between">
                <span>GSTIN Number (15 Digits)</span>
                {form.gstin && (
                  <span className={`text-[10px] font-mono font-bold ${isGstinValid ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {isGstinValid ? '✓ Valid Format' : '⚠️ Check Format'}
                  </span>
                )}
              </label>
              <input
                type="text"
                value={form.gstin}
                onChange={e => handleGstinChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] font-mono uppercase outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15"
                placeholder="e.g. 26AAAAA0000A1Z5"
                maxLength={15}
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1 flex items-center justify-between">
                <span>PAN Number (10 Digits)</span>
                {form.pan && (
                  <span className={`text-[10px] font-mono font-bold ${isPanValid ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {isPanValid ? '✓ Valid' : '⚠️ Format'}
                  </span>
                )}
              </label>
              <input
                type="text"
                value={form.pan}
                onChange={e => setForm({ ...form, pan: e.target.value.toUpperCase().trim() })}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] font-mono uppercase outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15"
                placeholder="e.g. AAAAA0000A"
                maxLength={10}
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">SAC Code (IT Software)</label>
              <input
                type="text"
                value={form.sacCode}
                onChange={e => setForm({ ...form, sacCode: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] font-mono outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15"
                placeholder="998314"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">State Code (GST Master)</label>
              <input
                type="text"
                value={form.state_code}
                onChange={e => setForm({ ...form, state_code: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] font-mono outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15"
                placeholder="26"
                maxLength={2}
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">MSME / Udyam Reg. No.</label>
              <input
                type="text"
                value={form.msme_number}
                onChange={e => setForm({ ...form, msme_number: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] font-mono outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15"
                placeholder="UDYAM-DN-01-0012345"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">Legal Arbitration Jurisdiction</label>
              <input
                type="text"
                value={form.jurisdiction}
                onChange={e => setForm({ ...form, jurisdiction: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15"
                placeholder="Silvassa, Dadra & Nagar Haveli"
                required
              />
            </div>
          </div>
        </div>

        {/* 4. Social Media Channels & Links */}
        <div className="pt-4 border-t border-[#E8E0F0] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#8E2D9D] tracking-wider">
              <Share2 className="w-4 h-4" />
              <span>4. Social Media Channels & Interactive Links</span>
            </div>
            
            <button
              type="button"
              onClick={() => setIsAddingChannel(!isAddingChannel)}
              className="px-3 py-1.5 rounded-xl bg-[#F3E8FF] hover:bg-[#E9D5FF] text-[#8E2D9D] border border-[#C084FC]/50 text-xs font-bold flex items-center space-x-1.5 transition-all self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Social Channel</span>
            </button>
          </div>

          {/* Add Channel Modal / Inline Form */}
          {isAddingChannel && (
            <div className="p-4 rounded-xl bg-[#FAF8FF] border border-[#C084FC]/50 space-y-3">
              <div className="flex items-center justify-between border-b border-[#E8E0F0] pb-2">
                <span className="text-xs font-bold text-[#8E2D9D] flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-[#8E2D9D]" />
                  Connect New Social Media Channel
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingChannel(false)}
                  className="p-1 text-[#817B91] hover:text-[#1E1B2E]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-[#5F5A72] uppercase block mb-1">Platform</label>
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
                    className="w-full px-2.5 py-2 rounded-xl bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15 outline-none"
                  >
                    {PLATFORM_PRESETS.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#5F5A72] uppercase block mb-1">Display Label / Name</label>
                  <input
                    type="text"
                    value={newChannelName}
                    onChange={e => setNewChannelName(e.target.value)}
                    placeholder="e.g. LinkedIn Profile, Discord Server"
                    className="w-full px-2.5 py-2 rounded-xl bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#5F5A72] uppercase block mb-1">Destination URL / Link</label>
                  <input
                    type="text"
                    value={newChannelUrl}
                    onChange={e => setNewChannelUrl(e.target.value)}
                    placeholder={PLATFORM_PRESETS.find(p => p.id === newChannelPlatform)?.placeholder || 'https://...'}
                    className="w-full px-2.5 py-2 rounded-xl bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingChannel(false)}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#FAF5FF] border border-[#E8E0F0] text-[#5F5A72] text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddSocialChannel}
                  disabled={!newChannelUrl.trim()}
                  className="px-4 py-1.5 rounded-lg bg-[#8E2D9D] hover:bg-[#6F42C1] disabled:opacity-50 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs"
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
                    ? 'bg-white border-[#E8E0F0] hover:border-[#C084FC]' 
                    : 'bg-[#FAF8FF] border-[#E8E0F0] opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-lg bg-[#F3E8FF] text-[#8E2D9D]">
                      <SocialIcon platform={channel.platform} className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#1E1B2E] block">{channel.name}</span>
                      <span className="text-[10px] text-[#817B91] capitalize">{channel.platform}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    {/* Active/Inactive Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleChannelActive(channel.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                        channel.active
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          : 'bg-slate-100 text-[#5F5A72] hover:bg-slate-200 border border-slate-200'
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
                      className="p-1 rounded hover:bg-red-50 text-[#817B91] hover:text-red-600 transition-colors cursor-pointer"
                      title="Delete Channel"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-medium text-[#5F5A72] block mb-1">Target URL / Account</label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={channel.url}
                      onChange={e => handleUpdateChannelUrl(channel.id, e.target.value)}
                      className="w-full px-2.5 py-1.5 pr-7 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15"
                      placeholder="https://..."
                    />
                    {channel.url && (
                      <a
                        href={formatSocialUrl(channel.url, channel.platform)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute right-2 text-[#817B91] hover:text-[#8E2D9D]"
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
            <div className="p-6 text-center text-[#5F5A72] border border-dashed border-[#E8E0F0] rounded-xl bg-[#FAF8FF]">
              <Share2 className="w-6 h-6 mx-auto mb-2 text-[#817B91] opacity-50" />
              <p className="text-xs font-semibold text-[#1E1B2E]">No Social Media Channels</p>
              <p className="text-[11px] text-[#5F5A72] mb-3">Click "Add Social Channel" to configure your links.</p>
              <button
                type="button"
                onClick={() => setIsAddingChannel(true)}
                className="px-3 py-1.5 rounded-lg bg-[#8E2D9D] hover:bg-[#6F42C1] text-white text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Channel</span>
              </button>
            </div>
          )}
        </div>

        {/* 5. Branding & Signatures */}
        <div className="pt-4 border-t border-[#E8E0F0]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#8E2D9D] tracking-wider">
              <FileSignature className="w-4 h-4" />
              <span>5. Brand Logo, Company Stamp & Authorized Signature</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveSettingsTab('assets')}
              className="text-xs text-[#8E2D9D] hover:text-[#6F42C1] font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Seals & Signatures Tab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Logo Preview Card */}
            <div className="p-3.5 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#1E1B2E] uppercase tracking-wider">Brand Logo</span>
                  <span className="text-[9px] text-emerald-600 font-mono font-bold">SVG / PNG</span>
                </div>
                <div className="h-20 rounded-lg bg-white flex items-center justify-center p-2 border border-[#E8E0F0]">
                  <BrandLogo size="sm" variant="full" theme="light" />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveSettingsTab('assets')}
                className="w-full py-1.5 rounded-lg bg-white hover:bg-[#F3E8FF] border border-[#E8E0F0] text-[#8E2D9D] text-[11px] font-bold text-center transition-colors cursor-pointer"
              >
                Upload / Change Logo
              </button>
            </div>

            {/* Stamp Preview Card */}
            <div className="p-3.5 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#1E1B2E] uppercase tracking-wider">Company Stamp</span>
                  <span className="text-[9px] text-[#8E2D9D] font-mono font-bold">Seal Asset</span>
                </div>
                <div className="h-20 rounded-lg bg-white flex items-center justify-center p-2 border border-[#E8E0F0]">
                  {(agencyConfig.stamp_url || agencyConfig.stampUrl) ? (
                    <img
                      src={agencyConfig.stamp_url || agencyConfig.stampUrl}
                      alt="Company Stamp"
                      className="max-h-full max-w-full object-contain mix-blend-multiply"
                    />
                  ) : (
                    <div className="text-center text-[#817B91] text-[10px]">
                      <Stamp className="w-5 h-5 mx-auto mb-1 opacity-50 text-[#817B91]" />
                      <span>No Stamp Uploaded</span>
                    </div>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveSettingsTab('assets')}
                className="w-full py-1.5 rounded-lg bg-white hover:bg-[#F3E8FF] border border-[#E8E0F0] text-[#8E2D9D] text-[11px] font-bold text-center transition-colors cursor-pointer"
              >
                Upload Company Stamp
              </button>
            </div>

            {/* Signature Preview Card */}
            <div className="p-3.5 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#1E1B2E] uppercase tracking-wider">Authorized Signatory</span>
                  <span className="text-[9px] text-[#8E2D9D] font-mono font-bold">Signature</span>
                </div>
                <div className="h-20 rounded-lg bg-white flex items-center justify-center p-2 border border-[#E8E0F0]">
                  {agencyConfig.signature_url ? (
                    <img
                      src={agencyConfig.signature_url}
                      alt="Authorized Signature"
                      className="max-h-full max-w-full object-contain mix-blend-multiply"
                    />
                  ) : (
                    <div className="font-serif italic text-[#8E2D9D] font-bold text-sm">
                      Authorized Signature
                    </div>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveSettingsTab('assets')}
                className="w-full py-1.5 rounded-lg bg-white hover:bg-[#F3E8FF] border border-[#E8E0F0] text-[#8E2D9D] text-[11px] font-bold text-center transition-colors cursor-pointer"
              >
                Upload Signature
              </button>
            </div>
          </div>
        </div>

        {/* 6. Settlement Bank Details */}
        <div className="pt-4 border-t border-[#E8E0F0]">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#8E2D9D] tracking-wider mb-3">
            <Landmark className="w-4 h-4" />
            <span>6. Settlement Bank Account Details</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">Bank Name</label>
              <input
                type="text"
                value={form.bank_name}
                onChange={e => setForm({ ...form, bank_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15"
                placeholder="HDFC Bank Ltd"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">Account Holder Name</label>
              <input
                type="text"
                value={form.account_name}
                onChange={e => setForm({ ...form, account_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15"
                placeholder="Fusion Forge Creation"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">Account Number</label>
              <input
                type="text"
                value={form.account_number}
                onChange={e => setForm({ ...form, account_number: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] font-mono outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15"
                placeholder="50200012345678"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">IFSC Code</label>
              <input
                type="text"
                value={form.ifsc_code}
                onChange={e => setForm({ ...form, ifsc_code: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] font-mono uppercase outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15"
                placeholder="HDFC0001234"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">Branch Name</label>
              <input
                type="text"
                value={form.branch_name}
                onChange={e => setForm({ ...form, branch_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15"
                placeholder="Silvassa Branch"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#5F5A72] block mb-1">UPI VPA ID</label>
              <input
                type="text"
                value={form.upi_id}
                onChange={e => setForm({ ...form, upi_id: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] font-mono outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15"
                placeholder="fusionforge@hdfcbank"
              />
            </div>
          </div>
        </div>

        {/* 7. Terms & Conditions */}
        <div className="pt-4 border-t border-[#E8E0F0]">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#8E2D9D] tracking-wider mb-3">
            <FileText className="w-4 h-4" />
            <span>7. Standard Quotation & Invoice Terms</span>
          </div>
          <div>
            <textarea
              rows={4}
              value={form.terms_conditions}
              onChange={e => setForm({ ...form, terms_conditions: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15 font-mono leading-relaxed"
              placeholder="Enter standard invoice & quotation terms..."
              required
            />
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E8E0F0]">
          <span className="text-xs text-[#5F5A72]">
            Changes will update invoices, quotations, PDF generator, and public site immediately.
          </span>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#8E2D9D] hover:bg-[#6F42C1] text-xs font-bold text-white flex items-center space-x-2 transition-all shadow-md shadow-[#8E2D9D]/20 active:scale-95 cursor-pointer"
          >
            {saved ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4 text-white" />}
            <span>{saved ? 'Changes Saved Successfully!' : 'Save & Publish Master Profile'}</span>
          </button>
        </div>
      </form>
        </div>
      )}
    </div>
  );
};
