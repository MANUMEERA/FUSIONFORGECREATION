import { SocialChannelItem } from '../types';

export interface PlatformPreset {
  id: string;
  name: string;
  placeholder: string;
  defaultColor: string;
  iconName: 'linkedin' | 'github' | 'whatsapp' | 'twitter' | 'instagram' | 'youtube' | 'facebook' | 'discord' | 'telegram' | 'medium' | 'custom';
}

export const PLATFORM_PRESETS: PlatformPreset[] = [
  { id: 'linkedin', name: 'LinkedIn', placeholder: 'https://linkedin.com/company/...', defaultColor: '#0A66C2', iconName: 'linkedin' },
  { id: 'github', name: 'GitHub', placeholder: 'https://github.com/...', defaultColor: '#8b949e', iconName: 'github' },
  { id: 'whatsapp', name: 'WhatsApp', placeholder: 'https://wa.me/919004077126', defaultColor: '#25D366', iconName: 'whatsapp' },
  { id: 'twitter', name: 'Twitter / X', placeholder: 'https://twitter.com/...', defaultColor: '#1DA1F2', iconName: 'twitter' },
  { id: 'instagram', name: 'Instagram', placeholder: 'https://instagram.com/...', defaultColor: '#E1306C', iconName: 'instagram' },
  { id: 'youtube', name: 'YouTube', placeholder: 'https://youtube.com/@...', defaultColor: '#FF0000', iconName: 'youtube' },
  { id: 'facebook', name: 'Facebook', placeholder: 'https://facebook.com/...', defaultColor: '#1877F2', iconName: 'facebook' },
  { id: 'discord', name: 'Discord', placeholder: 'https://discord.gg/...', defaultColor: '#5865F2', iconName: 'discord' },
  { id: 'telegram', name: 'Telegram', placeholder: 'https://t.me/...', defaultColor: '#0088cc', iconName: 'telegram' },
  { id: 'medium', name: 'Medium', placeholder: 'https://medium.com/@...', defaultColor: '#00ab6c', iconName: 'medium' },
  { id: 'custom', name: 'Custom Channel / Link', placeholder: 'https://...', defaultColor: '#06b6d4', iconName: 'custom' },
];

/**
 * Normalizes WhatsApp or web links for proper browser redirection
 */
export function formatSocialUrl(url: string, platform: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (platform === 'whatsapp') {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    const cleanNumber = trimmed.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanNumber}`;
  }
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

/**
 * Derives a legacy social_links object dictionary from active channels
 */
export function buildSocialLinksDictionary(channels: SocialChannelItem[]): Record<string, string> {
  const dict: Record<string, string> = {};
  for (const ch of channels) {
    if (ch.active && ch.url && ch.url.trim().length > 0) {
      dict[ch.id] = ch.url.trim();
      dict[ch.platform] = ch.url.trim();
    }
  }
  return dict;
}
