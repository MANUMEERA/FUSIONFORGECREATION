import React from 'react';
import { 
  Linkedin, 
  Github, 
  Twitter, 
  Instagram, 
  Youtube, 
  MessageCircle, 
  Facebook, 
  MessageSquare, 
  Send, 
  Globe, 
  Share2,
  ExternalLink
} from 'lucide-react';

interface SocialIconProps {
  platform: string;
  className?: string;
}

export const SocialIcon: React.FC<SocialIconProps> = ({ platform, className = 'w-4 h-4' }) => {
  const p = (platform || '').toLowerCase();
  
  if (p === 'linkedin') return <Linkedin className={className} />;
  if (p === 'github') return <Github className={className} />;
  if (p === 'whatsapp') return <MessageCircle className={className} />;
  if (p === 'twitter' || p === 'x') return <Twitter className={className} />;
  if (p === 'instagram') return <Instagram className={className} />;
  if (p === 'youtube') return <Youtube className={className} />;
  if (p === 'facebook') return <Facebook className={className} />;
  if (p === 'discord') return <MessageSquare className={className} />;
  if (p === 'telegram') return <Send className={className} />;
  if (p === 'medium') return <Globe className={className} />;
  if (p === 'custom' || p === 'globe' || p === 'website') return <Globe className={className} />;
  
  return <Share2 className={className} />;
};
