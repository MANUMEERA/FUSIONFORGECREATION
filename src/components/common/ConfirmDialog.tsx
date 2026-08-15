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
      iconBg: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
      btnBg: 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30'
    },
    warning: {
      icon: AlertTriangle,
      iconBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      btnBg: 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/30'
    },
    info: {
      icon: Info,
      iconBg: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      btnBg: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30'
    }
  }[variant];

  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-[#0b1220] border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start space-x-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${config.iconBg}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-all cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center space-x-1.5 ${config.btnBg}`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
