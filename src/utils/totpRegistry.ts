export interface PersistedTotpRecord {
  email: string;
  user_id?: string;
  secret?: string;
  confirmed: boolean;
  auth_type: string;
  recovery_codes?: string[];
  updated_at: string;
}

export function getLocalTotpRecord(email: string): PersistedTotpRecord | null {
  return null;
}

export function saveLocalTotpRecord(record: PersistedTotpRecord) {}

export function removeLocalTotpRecord(email: string) {
  try {
    localStorage.removeItem('fusion_forge_totp_registry');
  } catch (e) {
    console.warn('Could not clear local TOTP storage:', e);
  }
}

export async function fetchServerTotpStatus(email: string): Promise<PersistedTotpRecord | null> {
  return null;
}
