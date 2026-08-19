import React, { useState } from 'react';
import { 
  MessageSquare, 
  UserCheck, 
  ArrowRight, 
  Clock, 
  Tag, 
  Building2, 
  Mail, 
  Phone, 
  Sparkles,
  Volume2,
  VolumeX,
  Radio,
  Plus,
  MapPin,
  FileCheck2,
  Copy,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { ProjectEnquiry } from '../../types';

export const EnquiriesManager: React.FC = () => {
  const { 
    enquiries, 
    updateEnquiryStatus, 
    convertEnquiryToClient, 
    setActiveTab,
    triggerSimulatedLeadAlert,
    testBuzzerSound,
    isBuzzerMuted,
    toggleBuzzerMute,
    currentUser
  } = useApp();

  const { success, info } = useToast();
  const [copiedGstin, setCopiedGstin] = useState<string | null>(null);

  const handleConvert = (enqId: string) => {
    convertEnquiryToClient(enqId);
    setActiveTab('clients');
  };

  const handleCopyGstin = (gstin: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(gstin);
    setCopiedGstin(gstin);
    info('GSTIN Copied', `Copied ${gstin} to clipboard`);
    setTimeout(() => setCopiedGstin(null), 2000);
  };

  const handleSimulateLead = () => {
    const lead = triggerSimulatedLeadAlert();
    success(`🚨 Incoming project scope from ${lead.name} received! Alert dispatched to ${currentUser.name}.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-[#E8E0F0] shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-[#1E1B2E]">Project Scope Submissions & Lead Inquiries</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#F3E8FF] text-[#8E2D9D] border border-[#C084FC]/40 text-xs font-bold font-mono">
              {enquiries.length} Total
            </span>
          </div>
          <p className="text-xs text-[#5F5A72] mt-0.5">
            Realtime scope submissions with verified GSTIN, corporate address, estimator selections & active audio buzzer for logged-in user (<span className="text-[#8E2D9D] font-semibold">{currentUser.name}</span>).
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Buzzer Sound Toggle */}
          <button
            onClick={toggleBuzzerMute}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs ${
              isBuzzerMuted
                ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                : 'bg-[#FAF5FF] border-[#E8E0F0] text-[#8E2D9D] hover:bg-[#F3E8FF]'
            }`}
            title={isBuzzerMuted ? 'Lead Alert Buzzer: MUTED' : 'Lead Alert Buzzer: ACTIVE'}
          >
            {isBuzzerMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 animate-pulse text-[#8E2D9D]" />}
            <span>{isBuzzerMuted ? 'Buzzer Muted' : 'Buzzer Active'}</span>
          </button>

          {/* Test Buzzer Tone */}
          <button
            onClick={() => {
              testBuzzerSound();
              info('🔊 Playing test buzzer tone');
            }}
            className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#FAF5FF] text-[#5F5A72] hover:text-[#1E1B2E] border border-[#E8E0F0] text-xs font-medium transition-colors cursor-pointer shadow-xs"
            title="Test Buzzer Tone"
          >
            Test Chime
          </button>

          {/* Simulate Incoming Lead Button */}
          <button
            onClick={handleSimulateLead}
            className="px-3.5 py-1.5 rounded-xl bg-[#8E2D9D] hover:bg-[#6F42C1] text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-purple-200" />
            <span>Simulate Scope (Trigger Buzzer)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {enquiries.map(enq => (
          <div 
            key={enq.id}
            className="p-6 rounded-2xl bg-white border border-[#E8E0F0] shadow-xs flex flex-col md:flex-row justify-between gap-6 hover:border-[#C084FC] transition-all"
          >
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-[#1E1B2E]">{enq.name}</span>
                {(enq.company_name || enq.company) && (
                  <span className="text-xs text-[#5F5A72] font-semibold">({enq.company_name || enq.company})</span>
                )}
                {enq.service && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FAF5FF] text-[#8E2D9D] border border-[#E8E0F0]">
                    {enq.service}
                  </span>
                )}
                {enq.priority && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    enq.priority === 'urgent' 
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {enq.priority} Priority
                  </span>
                )}
                {enq.source && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-100 text-[#5F5A72] border border-slate-200">
                    {enq.source}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#5F5A72]">
                <div className="flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#8E2D9D]" />
                  <a href={`mailto:${enq.email}`} className="hover:text-[#8E2D9D] transition-colors font-medium">{enq.email}</a>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#8E2D9D]" />
                  <a href={`tel:${enq.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-[#8E2D9D] font-mono transition-colors">{enq.phone}</a>
                </div>
                {enq.budgetRange && (
                  <div className="flex items-center space-x-1.5 text-[#059669] font-bold font-mono">
                    <span>Budget: {enq.budgetRange}</span>
                  </div>
                )}
              </div>

              {/* GSTIN and Corporate Address Row */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {enq.gstin ? (
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[#059669] text-xs font-mono">
                    <FileCheck2 className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                    <span className="font-bold">GSTIN: {enq.gstin}</span>
                    <button
                      type="button"
                      onClick={(e) => handleCopyGstin(enq.gstin!, e)}
                      className="p-1 hover:bg-emerald-100 rounded transition-colors text-[#059669] cursor-pointer ml-1"
                      title="Copy GSTIN"
                    >
                      {copiedGstin === enq.gstin ? <Check className="w-3 h-3 text-[#059669]" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                ) : (
                  <span className="text-[11px] text-[#817B91] italic font-mono px-2 py-0.5 rounded bg-[#FAF5FF] border border-[#E8E0F0]">
                    GSTIN: Not Registered / URP
                  </span>
                )}

                {enq.address && (
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#FAF5FF] border border-[#E8E0F0] text-[#5F5A72] text-xs">
                    <MapPin className="w-3.5 h-3.5 text-[#8E2D9D] shrink-0" />
                    <span className="line-clamp-1">{enq.address}</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-[#1E1B2E] bg-[#FAF8FF] p-3.5 rounded-xl border border-[#E8E0F0] leading-relaxed">
                {enq.message || enq.projectDescription}
              </p>

              {enq.featuresRequired && enq.featuresRequired.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {enq.featuresRequired.map((feat, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-[#F3E8FF] text-[#8E2D9D] text-[10px] font-semibold border border-[#E8E0F0]">
                      {feat}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex md:flex-col justify-between items-end gap-3 shrink-0 border-t md:border-t-0 md:border-l border-[#E8E0F0] pt-4 md:pt-0 md:pl-6">
              <div className="text-right">
                <label className="text-[10px] text-[#817B91] font-bold uppercase block mb-1">Status</label>
                <select
                  value={enq.status}
                  onChange={e => updateEnquiryStatus(enq.id, e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-xl bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] outline-none font-medium cursor-pointer focus:border-[#8E2D9D]"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Converted">Converted</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* Convert to Client / Create Quotation Workflow */}
              {!['closed', 'Closed', 'rejected', 'Rejected', 'cancelled', 'Cancelled', 'converted', 'Converted', 'won', 'lost'].includes(enq.status) && (
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <button
                    onClick={() => handleConvert(enq.id)}
                    className="px-3 py-1.5 rounded-xl bg-[#8E2D9D] hover:bg-[#6F42C1] text-white text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
                    title="Convert Lead into active Client record"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Convert to Client</span>
                  </button>
                  <button
                    onClick={() => {
                      const client = convertEnquiryToClient(enq.id);
                      setActiveTab('quotations');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#8E2D9D] border border-[#E8E0F0] text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
                    title="Convert to Client and prepare Quotation"
                  >
                    <span>Create Quote</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
