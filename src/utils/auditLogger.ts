import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { AuditLog, UserProfile } from '../types';

export interface LogAuditOptions {
  user: UserProfile;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'SOFT_DELETE' | 'RESTORE' | 'PAYMENT_RECORD' | 'AUTH_LOGIN' | 'CALCULATE_GST' | 'ROLE_CHANGE';
  tableName: string;
  recordId: string;
  details: Record<string, any> | string;
  ipAddress?: string;
}

/**
 * Authoritative Supabase Audit Logger.
 * Writes immutable operational trail records directly to Supabase PostgreSQL audit_logs table.
 */
export async function logAuditEvent(options: LogAuditOptions): Promise<AuditLog> {
  const detailsString = typeof options.details === 'string' 
    ? options.details 
    : JSON.stringify(options.details);

  const newLog: AuditLog = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    user_id: options.user.id,
    user_email: options.user.email,
    user_role: options.user.role,
    action: options.action as any,
    table_name: options.tableName,
    record_id: options.recordId,
    details: detailsString,
    ip_address: options.ipAddress || (typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1'),
    created_at: new Date().toISOString()
  };

  // If Supabase is connected, persist to Supabase PostgreSQL audit_logs table
  if (isSupabaseConfigured) {
    try {
      await supabase.from('audit_logs').insert({
        user_id: newLog.user_id,
        user_email: newLog.user_email,
        user_role: newLog.user_role,
        action: newLog.action,
        table_name: newLog.table_name,
        record_id: newLog.record_id,
        details: newLog.details,
        ip_address: newLog.ip_address,
        created_at: newLog.created_at
      });
    } catch (err) {
      console.warn('[Audit Logger] Failed to write directly to Supabase PostgreSQL:', err);
    }
  }

  return newLog;
}
