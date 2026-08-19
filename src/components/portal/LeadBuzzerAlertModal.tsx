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
  Radio,
  MapPin,
  FileCheck2
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
      <div className="relative overflow-hidden rounded-2xl bg-white border-2 border-[#8E2D9D] shadow-2xl shadow-[#8E2D9D]/20 text-[#1E1B2E]">
        {/* Animated Soundwave & Siren Top Banner */}
        <div className="bg-gradient-to-r from-[#8E2D9D] to-[#6F42C1] px-4 py-2.5 flex items-center justify-between shadow-md text-white">
          <div className="flex items-center space-x-2.5">
            <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-white/20 text-white animate-bounce">
              <BellRing className="w-4 h-4 text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black tracking-wider uppercase text-white">
                🚨 Incoming Lead Enquiry Alert
              </span>
              <span className="px-1.5 py-0.5 rounded bg-black/30 text-[10px] font-mono font-bold text-white border border-white/20">
                LIVE
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={toggleBuzzerMute}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isBuzzerMuted 
                  ? 'bg-rose-500/30 border-rose-400/50 text-white hover:bg-rose-500/50' 
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
        <div className="px-4 py-2 bg-[#FAF5FF] border-b border-[#E8E0F0] flex items-center justify-between text-[11px]">
          <div className="flex items-center space-x-1.5 truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8E2D9D] shrink-0" />
            <span className="text-[#5F5A72]">Recipient:</span>
            <span className="font-bold text-[#1E1B2E] truncate">{currentUser.name}</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#F3E8FF] text-[#8E2D9D] border border-[#E8E0F0] uppercase">
              {currentUser.role.replace('_', ' ')}
            </span>
          </div>
          <div className="flex items-center space-x-1 text-[#8E2D9D] font-mono text-[10px] shrink-0 pl-2">
            <Radio className="w-3 h-3 animate-pulse text-[#8E2D9D]" />
            <span>Buzzer Alert Ringing</span>
          </div>
        </div>

        {/* Lead Content Summary */}
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-sm font-bold text-[#1E1B2E] flex items-center space-x-1.5">
                <span>{latestLeadAlert.name}</span>
                {(latestLeadAlert.company || latestLeadAlert.company_name) && (
                  <span className="text-xs font-normal text-[#5F5A72]">
                    — {latestLeadAlert.company || latestLeadAlert.company_name}
                  </span>
                )}
              </h4>
              <p className="text-xs text-[#8E2D9D] font-semibold mt-0.5">
                Interested in: {latestLeadAlert.service || latestLeadAlert.serviceCategory || 'Custom Solution'}
              </p>
            </div>
            {latestLeadAlert.budgetRange && (
              <span className="px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs shrink-0">
                {latestLeadAlert.budgetRange}
              </span>
            )}
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-2 gap-2 text-xs bg-[#FAF5FF] p-2.5 rounded-xl border border-[#E8E0F0]">
            <div className="flex items-center space-x-1.5 text-[#1E1B2E] truncate">
              <Mail className="w-3.5 h-3.5 text-[#8E2D9D] shrink-0" />
              <span className="truncate">{latestLeadAlert.email}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-[#1E1B2E] truncate">
              <Phone className="w-3.5 h-3.5 text-[#8E2D9D] shrink-0" />
              <span className="truncate">{latestLeadAlert.phone || 'Phone not provided'}</span>
            </div>
          </div>

          {/* GSTIN and Address if available */}
          {(latestLeadAlert.gstin || latestLeadAlert.address) && (
            <div className="space-y-1.5 text-xs bg-[#FAF5FF] p-2.5 rounded-xl border border-[#E8E0F0]">
              {latestLeadAlert.gstin && (
                <div className="flex items-center space-x-1.5 text-emerald-700 font-mono">
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-semibold">GSTIN: {latestLeadAlert.gstin}</span>
                </div>
              )}
              {latestLeadAlert.address && (
                <div className="flex items-start space-x-1.5 text-[#5F5A72]">
                  <MapPin className="w-3.5 h-3.5 text-[#8E2D9D] shrink-0 mt-0.5" />
                  <span className="line-clamp-2 leading-relaxed">{latestLeadAlert.address}</span>
                </div>
              )}
            </div>
          )}

          {/* Message Preview */}
          {(latestLeadAlert.projectDescription || latestLeadAlert.message) && (
            <p className="text-xs text-[#5F5A72] bg-[#FAF5FF] p-2.5 rounded-xl border border-[#E8E0F0] line-clamp-2 italic">
              "{latestLeadAlert.projectDescription || latestLeadAlert.message}"
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 pt-1">
            <button
              onClick={handleOpenLead}
              className="flex-1 py-2 px-3.5 rounded-xl bg-[#8E2D9D] hover:bg-[#6F42C1] text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-[#8E2D9D]/25 active:scale-95 cursor-pointer"
            >
              <span>View & Process Enquiry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={testBuzzerSound}
              className="py-2 px-3 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#5F5A72] hover:text-[#1E1B2E] text-xs font-semibold flex items-center space-x-1 border border-[#E8E0F0] transition-colors cursor-pointer"
              title="Test Replay Buzzer Tone"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#8E2D9D]" />
              <span>Chime</span>
            </button>
          </div>
        </div>

        {/* Progress Bar for Auto-dismiss */}
        <div className="h-1 w-full bg-[#E8E0F0] overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#8E2D9D] to-[#6F42C1] transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
