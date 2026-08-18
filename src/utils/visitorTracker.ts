/**
 * Fusion Forge Creation — Privacy-Conscious Visitor Telemetry Engine
 * Phase 16 Compliance: Digital Personal Data Protection (DPDP) Act, 2023 & IT Act, 2000
 * 
 * Strict Privacy Rules:
 * 1. Anonymized, ephemeral session identifier (rotated periodically or per-session)
 * 2. Zero PII collection (no passwords, no form keystrokes, no exact GPS coordinates, no personal IPs)
 * 3. Only aggregates non-sensitive structural metrics (section viewed, device category, screen resolution, duration)
 * 4. Stored persistently in Supabase PostgreSQL visitor_events table with Super Admin monitoring controls
 */

import { VisitorEvent } from '../types';

const SESSION_STORAGE_KEY = 'ffc_visitor_session_id';

export function getOrCreateSessionId(): string {
  try {
    let sessId = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessId) {
      sessId = `sess_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
      sessionStorage.setItem(SESSION_STORAGE_KEY, sessId);
    }
    return sessId;
  } catch {
    return `sess_${Date.now().toString(36)}`;
  }
}

export function detectDeviceType(): 'desktop' | 'mobile' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

export function detectBrowser(): string {
  if (typeof window === 'undefined') return 'Browser';
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('SamsungBrowser')) return 'Samsung Internet';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  if (ua.includes('Edge') || ua.includes('Edg/')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  return 'Modern Browser';
}

export function detectOS(): string {
  if (typeof window === 'undefined') return 'OS';
  const ua = navigator.userAgent;
  if (ua.includes('Win')) return 'Windows';
  if (ua.includes('Mac') && !ua.includes('iPhone') && !ua.includes('iPad')) return 'macOS';
  if (ua.includes('Linux') && !ua.includes('Android')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  return 'Standard OS';
}

export function getSanitizedReferrer(): string {
  if (typeof document === 'undefined' || !document.referrer) return 'direct';
  try {
    const url = new URL(document.referrer);
    return url.hostname.replace(/^www\./, '');
  } catch {
    return 'external';
  }
}

export function buildPrivacySafeMetadata(extra?: Record<string, any>): Record<string, any> {
  const meta: Record<string, any> = {
    screenResolution: typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : '1920x1080',
    language: typeof navigator !== 'undefined' ? navigator.language : 'en-IN',
    theme: typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    ...extra
  };
  return meta;
}
