import React from 'react';
import { AlertTriangle, Info, Trash2, X, Check } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  const config = {
    danger: {
      icon: Trash2,
      iconBg: 'bg-rose-50 text-[#DC2626] border border-rose-200',
      btnBg: 'bg-[#DC2626] hover:bg-rose-700 text-white shadow-xs'
    },
    warning: {
      icon: AlertTriangle,
      iconBg: 'bg-[#FFF7ED] text-[#D97706] border border-[#FED7AA]',
      btnBg: 'bg-[#D97706] hover:bg-amber-700 text-white shadow-xs'
    },
    info: {
      icon: Info,
      iconBg: 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]',
      btnBg: 'bg-[#8E2D9D] hover:bg-[#782485] text-white shadow-xs'
    }
  }[variant];

  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white border border-[#E8E0F0] rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 text-[#1E1B2E]"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start space-x-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${config.iconBg}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-[#1E1B2E] tracking-tight">{title}</h3>
            <p className="text-xs text-[#5F5A72] mt-1.5 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#E8E0F0]">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5F5A72] hover:text-[#1E1B2E] bg-[#FAF5FF] hover:bg-[#F3E8FF] border border-[#E8E0F0] transition-all cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center space-x-1.5 ${config.btnBg}`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
