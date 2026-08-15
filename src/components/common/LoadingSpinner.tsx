import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  label = 'Loading data...',
  className = ''
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10'
  };

  return (
    <div className={`flex flex-col items-center justify-center p-6 space-y-3 text-slate-400 ${className}`}>
      <Loader2 className={`${sizeMap[size]} animate-spin text-blue-500`} />
      {label && <p className="text-xs font-medium tracking-wide text-slate-400">{label}</p>}
    </div>
  );
};
