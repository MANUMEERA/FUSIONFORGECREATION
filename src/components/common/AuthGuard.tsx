import React from 'react';
import { UserRole } from '../../types';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface AuthGuardProps {
  userRole: UserRole;
  allowedRoles?: UserRole[];
  requiredPermission?: string;
  children: React.ReactNode;
  fallbackMessage?: string;
  onNavigateHome?: () => void;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  userRole,
  allowedRoles,
  requiredPermission,
  children,
  fallbackMessage,
  onNavigateHome
}) => {
  const isSuperAdmin = userRole === 'super_admin';
  
  let isAuthorized = false;
  if (isSuperAdmin) {
    isAuthorized = true;
  } else if (allowedRoles && allowedRoles.includes(userRole)) {
    isAuthorized = true;
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-6">
        <div className="bg-[#0b1324] border border-amber-500/30 rounded-3xl p-8 max-w-lg w-full text-center space-y-5 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Access Restricted
            </span>
            <h3 className="text-xl font-black text-white mt-2">Permission Denied</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {fallbackMessage || `Your current role (${userRole.replace('_', ' ').toUpperCase()}) does not possess authorization to access this section.`}
            </p>
          </div>

          <div className="pt-2 flex justify-center">
            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Dashboard</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
