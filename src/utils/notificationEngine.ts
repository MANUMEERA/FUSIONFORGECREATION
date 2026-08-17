import { AppNotification, UserProfile, NotificationCategory } from '../types';
import { buzzerEngine } from './buzzerSound';

/**
 * Filter notifications based on the current user's role and identity.
 * Strictly prevents exposure of private administrative data to unauthorized users or clients.
 */
export function filterNotificationsByRole(
  notifications: AppNotification[],
  currentUser?: UserProfile | null
): AppNotification[] {
  if (!currentUser) return [];

  const role = currentUser.role || 'staff';

  // Super Admin has full unrestricted visibility
  if (role === 'super_admin') {
    return notifications;
  }

  // Admin sees operational, financial, and project alerts
  if (role === 'admin') {
    return notifications.filter(n => {
      // Hide super_admin specific root permission alerts if strictly targeted to super_admin
      if (n.target_role === 'super_admin' && n.type === 'permission_changed') {
        return false;
      }
      return true;
    });
  }

  // Accountant sees financial, accounting, GST, and invoice/payment alerts
  if (role === 'accountant') {
    return notifications.filter(n => {
      return (
        n.category === 'financials' ||
        n.category === 'accounting' ||
        n.type.includes('invoice') ||
        n.type.includes('payment') ||
        n.type.includes('quotation') ||
        n.type.includes('gst') ||
        n.type.includes('accounting') ||
        n.target_role === 'accountant' ||
        n.target_user_id === currentUser.id
      );
    });
  }

  // Project Manager sees leads, projects, quotations, invoices, client updates
  if (role === 'project_manager') {
    return notifications.filter(n => {
      return (
        n.category === 'projects' ||
        n.category === 'leads' ||
        n.type.includes('project') ||
        n.type.includes('lead') ||
        n.type.includes('quotation') ||
        n.type.includes('invoice') ||
        n.target_role === 'project_manager' ||
        n.target_user_id === currentUser.id
      );
    });
  }

  // Staff sees assigned projects, deliverables, team updates
  if (role === 'staff' || role === 'editor') {
    return notifications.filter(n => {
      if (n.category === 'accounting' || n.category === 'users') {
        return false;
      }
      return (
        n.category === 'projects' ||
        n.type.includes('project') ||
        n.type === 'lead_received' ||
        n.target_role === role ||
        n.target_role === 'all' ||
        n.target_user_id === currentUser.id
      );
    });
  }

  // Client role (Customer Portal): ONLY see client's own invoices, receipts, project status, quotes
  if (role === 'client') {
    const userCompany = currentUser.company?.toLowerCase() || '';
    const userEmail = currentUser.email?.toLowerCase() || '';
    const clientId = currentUser.clientId || currentUser.id;

    return notifications.filter(n => {
      // Must be financial or project category
      if (n.category !== 'financials' && n.category !== 'projects') {
        return false;
      }

      // Check direct assignment
      if (n.target_user_id === currentUser.id || n.target_client_id === clientId) {
        return true;
      }

      // Check metadata matching
      if (n.metadata) {
        const metaEmail = (n.metadata.email || n.metadata.recipient || '').toLowerCase();
        const metaCompany = (n.metadata.clientCompany || n.metadata.company || '').toLowerCase();
        const metaClientId = n.metadata.clientId;

        if (userEmail && metaEmail && metaEmail.includes(userEmail)) return true;
        if (userCompany && metaCompany && (metaCompany.includes(userCompany) || userCompany.includes(metaCompany))) return true;
        if (clientId && metaClientId && metaClientId === clientId) return true;
      }

      return false;
    });
  }

  return [];
}

/**
 * Audio Synthesizer Chime for regular system & operational notifications
 */
export function playNotificationChime(priority: string = 'normal'): void {
  try {
    if (buzzerEngine.isSoundMuted()) return;

    // For urgent leads or critical alerts, trigger the prominent buzzer
    if (priority === 'urgent') {
      buzzerEngine.playLeadBuzzer();
      return;
    }

    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtxClass) return;

    const ctx = new AudioCtxClass();
    const now = ctx.currentTime;

    // Tone 1: C5 (523.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now);
    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.linearRampToValueAtTime(0.18, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.22);

    // Tone 2: E5 (659.25 Hz) or G5 (783.99 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(priority === 'high' ? 783.99 : 659.25, now + 0.12);
    gain2.gain.setValueAtTime(0.001, now + 0.12);
    gain2.gain.linearRampToValueAtTime(0.22, now + 0.14);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.45);
  } catch {
    // Graceful fallback if Web Audio is suspended/unsupported
  }
}

/**
 * Checks if an event is already present to prevent duplicate notifications
 */
export function isDuplicateEvent(
  existingNotifications: AppNotification[],
  eventKey?: string,
  type?: string,
  entityId?: string
): boolean {
  if (!existingNotifications || existingNotifications.length === 0) return false;

  if (eventKey) {
    const found = existingNotifications.some(n => n.event_key === eventKey);
    if (found) return true;
  }

  if (type && entityId) {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    const foundRecent = existingNotifications.some(n => {
      if (n.type === type && n.entity_id === entityId) {
        const notifTime = new Date(n.created_at).getTime();
        return notifTime > fiveMinutesAgo;
      }
      return false;
    });
    if (foundRecent) return true;
  }

  return false;
}
