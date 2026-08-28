import { AuditLog, UserProfile } from '../types';

export interface LogAuditOptions {
  user: UserProfile;
  action: AuditLog['action'];
  tableName: string;
  recordId: string;
  details: Record<string, any> | string;
  ipAddress?: string;
}

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

  return newLog;
}
