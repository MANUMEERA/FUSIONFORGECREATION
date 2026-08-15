import React from 'react';
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
  Plus
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

  const handleConvert = (enqId: string) => {
    convertEnquiryToClient(enqId);
    setActiveTab('clients');
  };

  const handleSimulateLead = () => {
    const lead = triggerSimulatedLeadAlert();
    success(`🚨 Incoming lead from ${lead.name} received! Alert dispatched to ${currentUser.name}.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-[#0d1a3c]/90 via-[#0a1430]/90 to-[#060c1e]/90 p-4 rounded-2xl border border-blue-500/25 shadow-lg backdrop-blur-md">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white">Project Enquiries & Leads</h2>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold font-mono">
              {enquiries.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Realtime leads from public estimator, AI chatbot & contact forms with active audio buzzer for logged-in user (<span className="text-cyan-300 font-semibold">{currentUser.name}</span>).
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Buzzer Sound Toggle */}
          <button
            onClick={toggleBuzzerMute}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm ${
              isBuzzerMuted
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-300 hover:bg-rose-500/25'
                : 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/25'
            }`}
            title={isBuzzerMuted ? 'Lead Alert Buzzer: MUTED' : 'Lead Alert Buzzer: ACTIVE'}
          >
            {isBuzzerMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 animate-pulse" />}
            <span>{isBuzzerMuted ? 'Buzzer Muted' : 'Buzzer Active'}</span>
          </button>

          {/* Test Buzzer Tone */}
          <button
            onClick={() => {
              testBuzzerSound();
              info('🔊 Playing test buzzer tone');
            }}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
            title="Test Buzzer Tone"
          >
            Test Chime
          </button>

          {/* Simulate Incoming Lead Button */}
          <button
            onClick={handleSimulateLead}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer border border-cyan-400/40"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-200" />
            <span>Simulate Incoming Lead (Trigger Buzzer)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {enquiries.map(enq => (
          <div 
            key={enq.id}
            className="p-6 rounded-2xl bg-gradient-to-b from-[#101c44]/90 to-[#0b1433]/90 border border-slate-700/80 shadow-lg backdrop-blur-md flex flex-col md:flex-row justify-between gap-6"
          >
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-white">{enq.name}</span>
                {(enq.company_name || enq.company) && (
                  <span className="text-xs text-slate-300 font-medium">({enq.company_name || enq.company})</span>
                )}
                {enq.service && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    {enq.service}
                  </span>
                )}
                {enq.priority && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    enq.priority === 'urgent' 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  }`}>
                    {enq.priority} Priority
                  </span>
                )}
                {enq.source && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-800/80 text-slate-300 border border-slate-700">
                    {enq.source}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-slate-300">
                <div className="flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>{enq.email}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  <span>{enq.phone}</span>
                </div>
                {enq.budgetRange && (
                  <div className="flex items-center space-x-1.5 text-cyan-300 font-medium">
                    <span>Budget: {enq.budgetRange}</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-200 bg-[#091129] p-3.5 rounded-xl border border-slate-700/80">
                {enq.message || enq.projectDescription}
              </p>

              {enq.featuresRequired && enq.featuresRequired.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {enq.featuresRequired.map((feat, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-medium border border-blue-500/30">
                      {feat}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex md:flex-col justify-between items-end gap-3 shrink-0 border-t md:border-t-0 md:border-l border-slate-700/80 pt-4 md:pt-0 md:pl-6">
              <div className="text-right">
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Status</label>
                <select
                  value={enq.status}
                  onChange={e => updateEnquiryStatus(enq.id, e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-xl bg-[#091129] border border-slate-700 text-xs text-white outline-none font-medium cursor-pointer"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Converted">Converted</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {enq.status !== 'Converted' && enq.status !== 'won' && (
                <button
                  onClick={() => handleConvert(enq.id)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md shadow-blue-500/25 cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Convert to Client</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
