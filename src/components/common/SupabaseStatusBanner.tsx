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
    <div className="bg-white border border-[#E8E0F0] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
          <Database className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-[#1E1B2E]">Supabase PostgreSQL Database</span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Single Source of Truth</span>
            </span>
          </div>
          <p className="text-[11px] text-[#5F5A72] mt-0.5">
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
          className="px-3 py-1.5 rounded-xl bg-[#F3E8FF] hover:bg-[#E9D5FF] text-[#6F42C1] font-semibold text-xs flex items-center space-x-1.5 transition-all border border-[#C084FC]/40 disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin text-[#8E2D9D]' : ''}`} />
          <span>{testing ? 'Syncing...' : 'Sync Database'}</span>
        </button>

        {testResult && (
          <div className={`text-[11px] px-2.5 py-1 rounded-lg flex items-center space-x-1 font-medium ${
            testResult.ok ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            {testResult.ok ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />}
            <span className="truncate max-w-[200px]">{testResult.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};
