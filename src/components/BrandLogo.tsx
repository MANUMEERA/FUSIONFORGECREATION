import React from 'react';

interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'full' | 'icon' | 'badge' | 'stacked' | 'horizontal';
  theme?: 'dark' | 'light' | 'auto';
  showTagline?: boolean;
  className?: string;
  badgeGlowColor?: 'cyan' | 'blue' | 'purple';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'full',
  theme = 'dark',
  showTagline = true,
  className = '',
  badgeGlowColor = 'cyan'
}) => {
  const isLight = theme === 'light';

  // Sizing maps
  const iconSizeMap = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
    '2xl': 'w-28 h-28'
  };

  const badgePaddingMap = {
    xs: 'p-1 rounded-lg',
    sm: 'p-1.5 rounded-xl',
    md: 'p-1.5 sm:p-2 rounded-xl',
    lg: 'p-2 sm:p-2.5 rounded-2xl',
    xl: 'p-3 rounded-2xl',
    '2xl': 'p-4 rounded-3xl'
  };

  const glowBlurMap = {
    xs: 'blur-[2.5px] -inset-0.5',
    sm: 'blur-[3.5px] -inset-0.5',
    md: 'blur-[5px] -inset-1',
    lg: 'blur-[6px] -inset-1',
    xl: 'blur-[8px] -inset-1.5',
    '2xl': 'blur-[12px] -inset-2'
  };

  const titleSizeMap = {
    xs: 'text-xs',
    sm: 'text-sm font-extrabold',
    md: 'text-base sm:text-lg font-black',
    lg: 'text-xl sm:text-2xl font-black',
    xl: 'text-2xl sm:text-3xl font-black',
    '2xl': 'text-4xl sm:text-5xl font-black'
  };

  const subtitleSizeMap = {
    xs: 'text-[7px]',
    sm: 'text-[8px]',
    md: 'text-[9px] sm:text-[10px]',
    lg: 'text-[11px]',
    xl: 'text-xs',
    '2xl': 'text-sm'
  };

  const taglineSizeMap = {
    xs: 'text-[6px]',
    sm: 'text-[7px]',
    md: 'text-[8px] sm:text-[9px]',
    lg: 'text-[10px]',
    xl: 'text-[11px]',
    '2xl': 'text-xs'
  };

  // High-Definition Brand Emblem Vector - True brand colors on clean light background
  const EmblemSVG = ({ className: svgClass = 'w-full h-full' }: { className?: string }) => (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={svgClass}
    >
      <defs>
        {/* Navy/Cobalt Spine Gradient for Primary Left F */}
        <linearGradient id="ff_navy_brand" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#051033" />
          <stop offset="50%" stopColor="#0a2166" />
          <stop offset="100%" stopColor="#123d9e" />
        </linearGradient>

        {/* Electric Azure / Bright Cyan Gradient for Secondary Overlapping F */}
        <linearGradient id="ff_cyan_brand" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0055ff" />
          <stop offset="45%" stopColor="#0099ff" />
          <stop offset="100%" stopColor="#00e5ff" />
        </linearGradient>
      </defs>

      <g transform="translate(10, 8) scale(0.88)">
        {/* 1. Main Left 'F' Spine - Solid, Bold Navy/Cobalt */}
        <path
          d="M 28 14 C 18 14 12 20 12 30 L 12 142 L 38 122 L 38 86 L 68 86 L 82 66 L 38 66 L 38 40 L 106 40 L 124 14 Z"
          fill="url(#ff_navy_brand)"
        />

        {/* 2. Four Digital Pixel Squares at Top Right */}
        <rect x="132" y="10" width="13" height="13" rx="2" fill="#00e5ff" />
        <rect x="114" y="24" width="13" height="13" rx="2" fill="#00b4d8" />
        <rect x="132" y="27" width="13" height="13" rx="2" fill="#0096ff" />
        <rect x="114" y="41" width="13" height="13" rx="2" fill="#0066ee" />

        {/* 3. Dynamic Overlapping Ribbon Right 'F' */}
        <path
          d="M 52 48 C 66 48 88 45 112 45 C 120 45 125 50 116 63 L 68 63 L 68 85 L 103 85 C 109 85 113 90 106 101 L 68 101 L 68 144 L 43 144 L 43 68 C 43 56 47 48 52 48 Z"
          fill="url(#ff_cyan_brand)"
        />
        
        {/* Overlap Fold Shadow */}
        <path d="M 43 68 L 68 63 L 68 101 L 43 93 Z" fill="#051b4d" opacity="0.55" />
      </g>
    </svg>
  );

  // Emblem Container with White/Light Background & Blurred Colored Glow Border
  const EmblemBadge = () => (
    <div className={`relative ${iconSizeMap[size]} shrink-0 group`}>
      {/* 1. Blurred Colored Border Glow Aura */}
      <div 
        className={`absolute ${glowBlurMap[size]} rounded-2xl pointer-events-none transition-all duration-300 opacity-80 group-hover:opacity-100 ${
          badgeGlowColor === 'cyan'
            ? 'bg-gradient-to-tr from-cyan-500 via-sky-400 to-blue-600'
            : badgeGlowColor === 'purple'
            ? 'bg-gradient-to-tr from-indigo-500 via-purple-400 to-cyan-400'
            : 'bg-gradient-to-tr from-blue-600 via-cyan-400 to-indigo-600'
        }`}
      />

      {/* 2. Secondary soft ambient glow ring */}
      <div 
        className={`absolute ${glowBlurMap[size]} rounded-2xl pointer-events-none bg-sky-400/30 blur-md opacity-60 group-hover:opacity-90 transition-opacity duration-300`} 
      />

      {/* 3. Pure White / Crisp Light Badge Housing (Ensures 100% Logo Visibility) */}
      <div 
        className={`relative w-full h-full ${badgePaddingMap[size]} bg-white shadow-[0_2px_10px_rgba(0,0,0,0.15),0_0_12px_rgba(0,180,255,0.35)] border border-cyan-400/60 flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}
      >
        <EmblemSVG />
      </div>
    </div>
  );

  // Icon-only or Badge Variant
  if (variant === 'icon' || variant === 'badge') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <EmblemBadge />
      </div>
    );
  }

  // Stacked Full Logo Variant (Hero / Splash / Center Showcase)
  if (variant === 'stacked') {
    return (
      <div className={`inline-flex flex-col items-center text-center select-none ${className}`}>
        <div className="mb-3.5">
          <EmblemBadge />
        </div>

        <div className="flex items-center justify-center gap-1.5 font-black tracking-tight leading-none uppercase">
          <span className={`${titleSizeMap[size]} ${isLight ? 'text-[#08143d]' : 'text-white'}`}>
            FUSION
          </span>
          <span className={`${titleSizeMap[size]} bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 bg-clip-text text-transparent`}>
            FORGE
          </span>
        </div>

        {/* Spaced CREATION line */}
        <div className="w-full flex items-center justify-center gap-2 mt-1.5 opacity-90">
          <div className={`h-[1.5px] flex-1 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />
          <span className={`font-bold uppercase tracking-[0.35em] ${subtitleSizeMap[size]} ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            CREATION
          </span>
          <div className={`h-[1.5px] flex-1 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />
        </div>

        {/* Slogan */}
        {showTagline && (
          <p className={`font-bold uppercase tracking-[0.2em] mt-1 ${taglineSizeMap[size]} ${isLight ? 'text-sky-700' : 'text-cyan-400'}`}>
            Where Ideas Fuse With Technology
          </p>
        )}
      </div>
    );
  }

  // Default Full / Horizontal Variant (Navbar, Header, Sidebar, Footer, Modals)
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Emblem Badge with White Background and Blurred Colored Border */}
      <EmblemBadge />

      {/* Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 font-black tracking-tight leading-none uppercase">
          <span className={`${titleSizeMap[size]} ${isLight ? 'text-[#08143d]' : 'text-white'}`}>
            FUSION
          </span>
          <span className={`${titleSizeMap[size]} bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 bg-clip-text text-transparent`}>
            FORGE
          </span>
        </div>

        {/* Subtitle & Tagline */}
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`font-bold uppercase tracking-[0.25em] ${subtitleSizeMap[size]} ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            CREATION
          </span>
          {showTagline && (
            <>
              <span className="text-slate-500 text-[9px]">•</span>
              <span className={`font-bold uppercase tracking-wider ${taglineSizeMap[size]} ${isLight ? 'text-sky-700' : 'text-cyan-400'}`}>
                Where Ideas Fuse With Technology
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

