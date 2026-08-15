import React from 'react';

interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'full' | 'icon' | 'badge' | 'stacked' | 'horizontal';
  theme?: 'dark' | 'light' | 'auto';
  showTagline?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'full',
  theme = 'dark',
  showTagline = true,
  className = ''
}) => {
  const isLight = theme === 'light';

  // Sizing maps - scaled with higher crispness & visual punch
  const iconSizeMap = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
    '2xl': 'w-28 h-28'
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

  // Emblem Vector Component matching the official brand logo - crystal clear & high-definition
  const EmblemSVG = ({ className: svgClass = 'w-full h-full' }: { className?: string }) => (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={svgClass}
    >
      <defs>
        {/* High contrast Navy / Cobalt Gradient for the primary Left F */}
        <linearGradient id={`ff_navy_${isLight ? 'l' : 'd'}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isLight ? '#061033' : '#1d4ed8'} />
          <stop offset="50%" stopColor={isLight ? '#0a1d56' : '#2563eb'} />
          <stop offset="100%" stopColor={isLight ? '#0f2b7a' : '#3b82f6'} />
        </linearGradient>

        {/* High vibrancy Electric Azure / Cyan Gradient for the secondary Overlapping F */}
        <linearGradient id={`ff_cyan_${isLight ? 'l' : 'd'}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0062ff" />
          <stop offset="40%" stopColor="#0099ff" />
          <stop offset="100%" stopColor="#00e5ff" />
        </linearGradient>

        {/* Top Pixel Gradients */}
        <linearGradient id={`ff_px1_${isLight ? 'l' : 'd'}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#00f0ff" />
        </linearGradient>
      </defs>

      <g transform="translate(10, 8) scale(0.88)">
        {/* 1. Main Left 'F' Spine - Solid, Bold, and Sharp */}
        <path
          d="M 28 14 C 18 14 12 20 12 30 L 12 142 L 38 122 L 38 86 L 68 86 L 82 66 L 38 66 L 38 40 L 106 40 L 124 14 Z"
          fill={`url(#ff_navy_${isLight ? 'l' : 'd'})`}
        />

        {/* Subtle white/bright highlight stroke on dark background for clarity */}
        {!isLight && (
          <path
            d="M 28 14 C 18 14 12 20 12 30 L 12 142 L 38 122 L 38 86 L 68 86 L 82 66 L 38 66 L 38 40 L 106 40 L 124 14 Z"
            stroke="#60a5fa"
            strokeWidth="0.8"
            strokeOpacity="0.4"
            fill="none"
          />
        )}

        {/* 2. Four Sharp Digital Pixel Squares at Top Right */}
        <rect x="132" y="10" width="13" height="13" rx="2" fill="#00e5ff" />
        <rect x="114" y="24" width="13" height="13" rx="2" fill="#00b4d8" />
        <rect x="132" y="27" width="13" height="13" rx="2" fill="#0096ff" />
        <rect x="114" y="41" width="13" height="13" rx="2" fill="#0066ee" />

        {/* 3. Dynamic Overlapping Ribbon Right 'F' */}
        <path
          d="M 52 48 C 66 48 88 45 112 45 C 120 45 125 50 116 63 L 68 63 L 68 85 L 103 85 C 109 85 113 90 106 101 L 68 101 L 68 144 L 43 144 L 43 68 C 43 56 47 48 52 48 Z"
          fill={`url(#ff_cyan_${isLight ? 'l' : 'd'})`}
        />
        
        {/* Overlap Interlock Fold Shadow */}
        <path d="M 43 68 L 68 63 L 68 101 L 43 93 Z" fill="#051b4d" opacity="0.55" />
      </g>
    </svg>
  );

  // If icon-only variant requested
  if (variant === 'icon' || variant === 'badge') {
    return (
      <div className={`relative ${iconSizeMap[size]} shrink-0 inline-flex items-center justify-center ${className}`}>
        {!isLight && (
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600 rounded-xl blur-[4px] opacity-60 pointer-events-none" />
        )}
        <div className={`relative w-full h-full p-1 rounded-xl ${isLight ? 'bg-slate-50 border border-slate-200 shadow-sm' : 'bg-slate-950/80 border border-slate-800'}`}>
          <EmblemSVG />
        </div>
      </div>
    );
  }

  // If stacked full logo (like the uploaded hero asset)
  if (variant === 'stacked') {
    return (
      <div className={`inline-flex flex-col items-center text-center select-none ${className}`}>
        <div className={`relative ${iconSizeMap[size]} mb-3`}>
          <EmblemSVG />
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
          <div className={`h-[1.5px] flex-1 ${isLight ? 'bg-slate-400' : 'bg-slate-700'}`} />
          <span className={`font-bold uppercase tracking-[0.35em] ${subtitleSizeMap[size]} ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
            CREATION
          </span>
          <div className={`h-[1.5px] flex-1 ${isLight ? 'bg-slate-400' : 'bg-slate-700'}`} />
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

  // Default Full / Horizontal Variant (Navbar, Header, PDF, Footer)
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Emblem Icon */}
      <div className={`relative ${iconSizeMap[size]} shrink-0 group`}>
        {!isLight && (
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600 rounded-xl blur-[4px] opacity-50 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        )}
        <div className={`relative w-full h-full p-0.5 rounded-xl transition-transform duration-300 group-hover:scale-105 ${isLight ? 'bg-transparent' : 'bg-slate-900/60'}`}>
          <EmblemSVG />
        </div>
      </div>

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
