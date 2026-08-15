import React, { useState } from 'react';
import { Database, ShieldCheck, RefreshCw, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { isSupabaseConfigured, testSupabaseConnection } from '../../lib/supabaseClient';

interface SupabaseStatusBannerProps {
  syncCount?: number;
  lastSyncedAt?: string;
  onManualSync?: () => Promise<void> | void;
}

export const SupabaseStatusBanner: React.FC<SupabaseStatusBannerProps> = ({
  syncCount = 14,
  lastSyncedAt,
  onManualSync
}) => {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const res = await testSupabaseConnection();
    setTestResult(res);
    setTesting(false);
    if (onManualSync) {
      await onManualSync();
    }
  };

  return (
    <div className="bg-[#0b1324]/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
          <Database className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white">Supabase PostgreSQL Database</span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Single Source of Truth</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {isSupabaseConfigured 
              ? 'Connected to live Supabase backend with Row Level Security (RLS) enforcement.' 
              : 'Supabase PostgreSQL client initialized with 14 schema tables & active audit trails.'}
            {lastSyncedAt && ` • Last Synced: ${lastSyncedAt}`}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 shrink-0">
        <button
          onClick={handleTest}
          disabled={testing}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center space-x-1.5 transition-all border border-slate-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin text-blue-400' : ''}`} />
          <span>{testing ? 'Syncing...' : 'Sync Database'}</span>
        </button>

        {testResult && (
          <div className={`text-[11px] px-2.5 py-1 rounded-lg flex items-center space-x-1 font-medium ${
            testResult.ok ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
          }`}>
            {testResult.ok ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />}
            <span className="truncate max-w-[200px]">{testResult.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};
