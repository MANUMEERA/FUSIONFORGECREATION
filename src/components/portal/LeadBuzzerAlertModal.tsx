import React, { useEffect, useState } from 'react';
import { 
  BellRing, 
  Volume2, 
  VolumeX, 
  X, 
  ArrowRight, 
  Mail, 
  Phone, 
  Building2, 
  DollarSign, 
  ShieldCheck, 
  Sparkles,
  Radio
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LeadBuzzerAlertModal: React.FC = () => {
  const { 
    latestLeadAlert, 
    clearLeadAlert, 
    currentUser, 
    setActiveTab,
    isBuzzerMuted,
    toggleBuzzerMute,
    testBuzzerSound
  } = useApp();

  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (latestLeadAlert) {
      setVisible(true);
      setProgress(100);

      // Auto dismiss after 18 seconds if untouched
      const duration = 18000;
      const intervalTime = 100;
      const step = (intervalTime / duration) * 100;

      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev <= step) {
            clearInterval(timer);
            return 0;
          }
          return prev - step;
        });
      }, intervalTime);

      const timeout = setTimeout(() => {
        setVisible(false);
        clearLeadAlert();
      }, duration);

      return () => {
        clearInterval(timer);
        clearTimeout(timeout);
      };
    } else {
      setVisible(false);
    }
  }, [latestLeadAlert, clearLeadAlert]);

  if (!visible || !latestLeadAlert) return null;

  const handleOpenLead = () => {
    setActiveTab('enquiries');
    setVisible(false);
    clearLeadAlert();
  };

  const handleDismiss = () => {
    setVisible(false);
    clearLeadAlert();
  };

  return (
    <div className="fixed top-5 right-4 sm:right-8 z-50 max-w-lg w-[calc(100vw-2rem)] animate-in slide-in-from-top-6 duration-300">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#0e1e4a] via-[#091433] to-[#050b1a] border-2 border-cyan-400/60 shadow-2xl shadow-cyan-500/20 text-white backdrop-blur-xl">
        {/* Animated Soundwave & Siren Top Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 px-4 py-2.5 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2.5">
            <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-white/20 text-white animate-bounce">
              <BellRing className="w-4 h-4 text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black tracking-wider uppercase text-white">
                🚨 Incoming Lead Enquiry Alert
              </span>
              <span className="px-1.5 py-0.5 rounded bg-black/30 text-[10px] font-mono font-bold text-cyan-200 border border-white/20">
                LIVE
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={toggleBuzzerMute}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isBuzzerMuted 
                  ? 'bg-rose-500/30 border-rose-400/50 text-rose-200 hover:bg-rose-500/50' 
                  : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
              }`}
              title={isBuzzerMuted ? 'Unmute Buzzer' : 'Mute Buzzer'}
            >
              {isBuzzerMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Dismiss Alert"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Logged In User Recipient Banner */}
        <div className="px-4 py-2 bg-[#060e22] border-b border-cyan-500/20 flex items-center justify-between text-[11px]">
          <div className="flex items-center space-x-1.5 truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-slate-400">Recipient:</span>
            <span className="font-bold text-white truncate">{currentUser.name}</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase">
              {currentUser.role.replace('_', ' ')}
            </span>
          </div>
          <div className="flex items-center space-x-1 text-cyan-400 font-mono text-[10px] shrink-0 pl-2">
            <Radio className="w-3 h-3 animate-pulse text-cyan-400" />
            <span>Buzzer Alert Ringing</span>
          </div>
        </div>

        {/* Lead Content Summary */}
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center space-x-1.5">
                <span>{latestLeadAlert.name}</span>
                {(latestLeadAlert.company || latestLeadAlert.company_name) && (
                  <span className="text-xs font-normal text-slate-300">
                    — {latestLeadAlert.company || latestLeadAlert.company_name}
                  </span>
                )}
              </h4>
              <p className="text-xs text-cyan-300 font-medium mt-0.5">
                Interested in: {latestLeadAlert.service || latestLeadAlert.serviceCategory || 'Custom Solution'}
              </p>
            </div>
            {latestLeadAlert.budgetRange && (
              <span className="px-2 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-xs shrink-0">
                {latestLeadAlert.budgetRange}
              </span>
            )}
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-2 gap-2 text-xs bg-[#060c1d] p-2.5 rounded-xl border border-blue-500/20">
            <div className="flex items-center space-x-1.5 text-slate-300 truncate">
              <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{latestLeadAlert.email}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-slate-300 truncate">
              <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{latestLeadAlert.phone || 'Phone not provided'}</span>
            </div>
          </div>

          {/* Message Preview */}
          {(latestLeadAlert.projectDescription || latestLeadAlert.message) && (
            <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 line-clamp-2 italic">
              "{latestLeadAlert.projectDescription || latestLeadAlert.message}"
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 pt-1">
            <button
              onClick={handleOpenLead}
              className="flex-1 py-2 px-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-cyan-500/25 active:scale-95 cursor-pointer border border-cyan-400/40"
            >
              <span>View & Process Enquiry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={testBuzzerSound}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-1 border border-slate-700 transition-colors cursor-pointer"
              title="Test Replay Buzzer Tone"
            >
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Chime</span>
            </button>
          </div>
        </div>

        {/* Progress Bar for Auto-dismiss */}
        <div className="h-1 w-full bg-slate-800 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
