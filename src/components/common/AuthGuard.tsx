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
        <div className="bg-white border border-[#E8E0F0] rounded-3xl p-8 max-w-lg w-full text-center space-y-5 shadow-xl text-[#1E1B2E]">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF7ED] text-[#D97706] flex items-center justify-center mx-auto border border-[#FED7AA]">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-black tracking-widest text-[#D97706] uppercase bg-[#FFF7ED] px-3 py-1 rounded-full border border-[#FED7AA]">
              Access Restricted
            </span>
            <h3 className="text-xl font-black text-[#1E1B2E] mt-2">Permission Denied</h3>
            <p className="text-xs text-[#5F5A72] mt-2 leading-relaxed">
              {fallbackMessage || `Your current role (${userRole.replace('_', ' ').toUpperCase()}) does not possess authorization to access this section.`}
            </p>
          </div>

          <div className="pt-2 flex justify-center">
            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] border border-[#E8E0F0] text-[#1E1B2E] text-xs font-bold transition-all"
              >
                <ArrowLeft className="w-4 h-4 text-[#8E2D9D]" />
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
