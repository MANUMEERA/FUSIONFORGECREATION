import React from 'react';
import { LucideIcon, FolderSearch, Plus } from 'lucide-react';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = FolderSearch,
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`p-10 text-center rounded-3xl border border-dashed border-[#E8E0F0] bg-[#FAF5FF]/50 flex flex-col items-center justify-center space-y-3.5 ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-[#F3E8FF] border border-[#E8E0F0] text-[#8E2D9D] flex items-center justify-center">
        <Icon className="w-6 h-6" />
      </div>
      <div className="max-w-sm">
        <h4 className="text-sm font-bold text-[#1E1B2E] tracking-tight">{title}</h4>
        <p className="text-xs text-[#5F5A72] mt-1 leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 inline-flex items-center space-x-2 px-4 py-2 bg-[#8E2D9D] hover:bg-[#782485] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};
