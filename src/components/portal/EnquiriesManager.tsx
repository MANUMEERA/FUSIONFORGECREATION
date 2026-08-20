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
  Check,
  Trash2,
  AlertTriangle,
  Globe,
  Eraser,
  BellRing
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { ProjectEnquiry } from '../../types';

export const EnquiriesManager: React.FC = () => {
  const { 
    enquiries, 
    updateEnquiryStatus, 
    convertEnquiryToClient, 
    deleteEnquiry,
    clearAllEnquiries,
    setActiveTab,
    setCurrentView,
    triggerSimulatedLeadAlert,
    testBuzzerSound,
    isBuzzerMuted,
    toggleBuzzerMute,
    currentUser,
    latestLeadAlert
  } = useApp();

  const { success, info } = useToast();
  const [copiedGstin, setCopiedGstin] = useState<string | null>(null);
  const [enquiryToDelete, setEnquiryToDelete] = useState<ProjectEnquiry | null>(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

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
    if (isSimulating) return;
    setIsSimulating(true);

    const lead = triggerSimulatedLeadAlert();
    if (lead) {
      success(`🚨 Incoming project scope alert from ${lead.name} active! Buzzer dispatched to ${currentUser.name}.`);
    } else {
      info('Alert Active', 'Incoming scope alert is already ringing. Review or dismiss the active alert banner.');
    }

    setTimeout(() => {
      setIsSimulating(false);
    }, 1200);
  };

  const isSimulateDisabled = isSimulating || Boolean(latestLeadAlert);

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Modal for Single Enquiry */}
      {enquiryToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#E8E0F0] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1E1B2E]">Delete Lead Enquiry</h3>
                <p className="text-xs text-[#5F5A72]">Super Admin Privileged Operation</p>
              </div>
            </div>

            <p className="text-xs text-[#5F5A72] leading-relaxed">
              Are you sure you want to permanently delete the project scope submission from <strong className="text-[#1E1B2E]">{enquiryToDelete.name}</strong> ({enquiryToDelete.company || 'Direct'})? This record will be removed from your database.
            </p>

            <div className="flex justify-end items-center gap-2 pt-2 border-t border-[#E8E0F0]">
              <button
                type="button"
                onClick={() => setEnquiryToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#5F5A72] font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const target = enquiryToDelete;
                  setEnquiryToDelete(null);
                  if (target) {
                    await deleteEnquiry(target.id);
                    success('Enquiry Deleted', `Lead from ${target.name} has been deleted.`);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center space-x-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Demo/Test Enquiries Confirmation Modal */}
      {showClearAllModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-rose-200 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center">
                <Eraser className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1E1B2E]">Clear All Enquiries</h3>
                <p className="text-xs text-rose-600 font-semibold">Purge {enquiries.length} enquiry records</p>
              </div>
            </div>

            <p className="text-xs text-[#5F5A72] leading-relaxed">
              Are you sure you want to delete all <strong className="text-[#1E1B2E]">{enquiries.length}</strong> enquiry records? This will clear all existing test or demo data so you can test incoming leads freshly from the public website front page.
            </p>

            <div className="flex justify-end items-center gap-2 pt-2 border-t border-[#E8E0F0]">
              <button
                type="button"
                onClick={() => setShowClearAllModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#5F5A72] font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  setShowClearAllModal(false);
                  await clearAllEnquiries();
                  success('Enquiries Purged', 'All enquiries cleared. Ready for fresh front-page submissions.');
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center space-x-1.5"
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>Purge All Records</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
          {/* Quick link to Front Page for testing */}
          <button
            type="button"
            onClick={() => setCurrentView('public')}
            className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-[#1E1B2E] border border-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs"
            title="Open Public Front Page to submit a real enquiry form"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>Open Front Page</span>
          </button>

          {/* Buzzer Sound Toggle */}
          <button
            type="button"
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
            type="button"
            onClick={() => {
              testBuzzerSound();
              info('🔊 Playing test buzzer tone');
            }}
            className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#FAF5FF] text-[#5F5A72] hover:text-[#1E1B2E] border border-[#E8E0F0] text-xs font-medium transition-colors cursor-pointer shadow-xs"
            title="Test Buzzer Tone"
          >
            Test Chime
          </button>

          {/* Simulate / Replay Lead Alert Button */}
          <button
            type="button"
            onClick={handleSimulateLead}
            disabled={isSimulateDisabled}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs ${
              isSimulateDisabled
                ? 'bg-purple-100 text-purple-600 border border-purple-200 opacity-70 cursor-not-allowed'
                : 'bg-[#8E2D9D] hover:bg-[#6F42C1] text-white cursor-pointer'
            }`}
            title={
              latestLeadAlert
                ? 'Incoming scope alert modal is currently active'
                : enquiries.length > 0
                  ? 'Replay buzzer alert for the latest received project scope'
                  : 'Simulate 1 incoming project scope submission with audio buzzer'
            }
          >
            {latestLeadAlert ? (
              <BellRing className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
            ) : (
              <Radio className={`w-3.5 h-3.5 ${isSimulateDisabled ? 'text-purple-400' : 'animate-pulse text-purple-200'}`} />
            )}
            <span>
              {isSimulating 
                ? 'Dispatching...' 
                : latestLeadAlert 
                  ? 'Alert Active (Buzzer Ringing)' 
                  : enquiries.length > 0 
                    ? 'Replay Alert on Latest Lead' 
                    : 'Simulate Scope (Trigger Buzzer)'}
            </span>
          </button>

          {/* Clear All Inquiries (for clean testing) */}
          {enquiries.length > 0 && currentUser?.role === 'super_admin' && (
            <button
              type="button"
              onClick={() => setShowClearAllModal(true)}
              className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs"
              title="Clear all demo/test enquiries for clean testing"
            >
              <Eraser className="w-3.5 h-3.5 text-rose-600" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {enquiries.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#E8E0F0] text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-[#F3E8FF] text-[#8E2D9D] flex items-center justify-center mx-auto shadow-inner">
            <MessageSquare className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#1E1B2E]">No Project Enquiries in Database</h3>
            <p className="text-xs text-[#5F5A72] max-w-md mx-auto leading-relaxed">
              When prospective clients submit project scopes via the public front page (<span className="font-semibold text-[#8E2D9D]">Get a Quote</span>, <span className="font-semibold text-[#8E2D9D]">Cost Estimator</span>, or <span className="font-semibold text-[#8E2D9D]">Contact Form</span>), incoming leads will trigger an immediate audio buzzer and appear here.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setCurrentView('public')}
              className="px-4 py-2.5 rounded-xl bg-[#8E2D9D] hover:bg-[#6F42C1] text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center space-x-2"
            >
              <Globe className="w-4 h-4" />
              <span>Go to Front Page to Add Enquiry</span>
            </button>
            <button
              type="button"
              onClick={handleSimulateLead}
              disabled={isSimulateDisabled}
              className="px-4 py-2.5 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#8E2D9D] border border-[#E8E0F0] text-xs font-bold transition-all cursor-pointer flex items-center space-x-2"
            >
              <Radio className="w-4 h-4" />
              <span>Simulate 1 Test Scope</span>
            </button>
          </div>
        </div>
      ) : (
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
                <div className="flex flex-wrap items-center justify-end gap-2">
                  {!['closed', 'Closed', 'rejected', 'Rejected', 'cancelled', 'Cancelled', 'converted', 'Converted', 'won', 'lost'].includes(enq.status) && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleConvert(enq.id)}
                        className="px-3 py-1.5 rounded-xl bg-[#8E2D9D] hover:bg-[#6F42C1] text-white text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
                        title="Convert Lead into active Client record"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Convert to Client</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          convertEnquiryToClient(enq.id);
                          setActiveTab('quotations');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#8E2D9D] border border-[#E8E0F0] text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
                        title="Convert to Client and prepare Quotation"
                      >
                        <span>Create Quote</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </>
                  )}

                  {/* Super Admin Privileged Delete Button */}
                  {currentUser?.role === 'super_admin' && (
                    <button
                      type="button"
                      onClick={() => setEnquiryToDelete(enq)}
                      className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs"
                      title="Delete enquiry permanently (Super Admin only)"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

