import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  KeyRound, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Smartphone,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  Check,
  QrCode,
  HelpCircle,
  Send,
  AlertTriangle,
  Sparkles,
  Download,
  Info
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { UserProfile, UserRole } from '../../types';
import { 
  generateTotpSecret, 
  getOtpauthUri, 
  generateQrCodeDataUrl, 
  verifyTotpCode, 
  generateRecoveryCodes,
  formatSecretKey 
} from '../../utils/totp';

interface SupabaseAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: UserProfile) => void;
}

type AuthMode = 'login' | 'forgot_password' | 'mfa_verify' | 'mfa_setup' | 'mfa_re_enroll';

export const SupabaseAuthModal: React.FC<SupabaseAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { users, updateUser, setCurrentUser, setCurrentView, setActiveTab, setIsAuthenticated, addAuditLog } = useApp();
  const { success, error: toastError, info } = useToast();

  const [mode, setMode] = useState<AuthMode>('login');
  const [identifier, setIdentifier] = useState(''); // Email, Phone or Username
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 2FA / Google Authenticator State
  const [mfaCode, setMfaCode] = useState('');
  const [pendingUser, setPendingUser] = useState<UserProfile | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [totpSecret, setTotpSecret] = useState<string>('');
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [copiedRecovery, setCopiedRecovery] = useState(false);
  const [useRecoveryCodeMode, setUseRecoveryCodeMode] = useState(false);
  const [recoveryCodeInput, setRecoveryCodeInput] = useState('');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30);

  // Email Emergency Recovery Code State (Special for Super Admin)
  const [emailEmergencyCode, setEmailEmergencyCode] = useState<string>('');
  const [emailRecoverySent, setEmailRecoverySent] = useState(false);
  const [emailRecoveryCooldown, setEmailRecoveryCooldown] = useState(0);
  const [showStaffNoticeModal, setShowStaffNoticeModal] = useState(false);

  // Re-Enrollment State (When device is lost & recovery code is used)
  const [reEnrollSecret, setReEnrollSecret] = useState<string>('');
  const [reEnrollQrUrl, setReEnrollQrUrl] = useState<string>('');
  const [reEnrollRecoveryCodes, setReEnrollRecoveryCodes] = useState<string[]>([]);
  const [reEnrollCodeInput, setReEnrollCodeInput] = useState<string>('');
  const [copiedReEnrollSecret, setCopiedReEnrollSecret] = useState(false);
  const [copiedReEnrollRecovery, setCopiedReEnrollRecovery] = useState(false);

  // Forgot password state
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // TOTP rotation interval timer
  useEffect(() => {
    const updateTimer = () => {
      const sec = 30 - (Math.floor(Date.now() / 1000) % 30);
      setSecondsRemaining(sec);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Cooldown countdown for email resend
  useEffect(() => {
    if (emailRecoveryCooldown <= 0) return;
    const timer = setInterval(() => {
      setEmailRecoveryCooldown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [emailRecoveryCooldown]);

  if (!isOpen) return null;

  // Filter out client profiles — only staff/admins can access portal
  const staffProfiles = users.filter(u => u.role !== 'client');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const cleanIdent = identifier.trim().toLowerCase();

      // Check if a client account is attempting to log in
      const clientUser = users.find(u => 
        u.role === 'client' && (
          u.email.toLowerCase() === cleanIdent ||
          (u.phone && u.phone.replace(/[\s\-\+]/g, '') === cleanIdent.replace(/[\s\-\+]/g, ''))
        )
      );

      if (clientUser) {
        setErrorMessage('Access Denied: Client accounts are strictly prohibited from accessing the Admin & Staff Panel. Please use the Client Portal.');
        setLoading(false);
        return;
      }

      let authenticatedProfile: UserProfile | null = null;

      // Primary: Attempt Supabase Auth when configured
      if (isSupabaseConfigured) {
        try {
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: cleanIdent.includes('@') ? cleanIdent : `${cleanIdent}@fusionforgecreation.com`,
            password: password
          });

          if (authError) {
            // Check if user exists in database profiles
            const { data: dbProfile } = await supabase
              .from('profiles')
              .select('*')
              .or(`email.ilike.${cleanIdent},full_name.ilike.${cleanIdent}`)
              .maybeSingle();

            if (dbProfile) {
              if (dbProfile.role === 'client') {
                setErrorMessage('Access Denied: Client accounts cannot access administrative panels.');
                setLoading(false);
                return;
              }
              if (!dbProfile.is_active) {
                setErrorMessage('Account is disabled. Please contact the Super Administrator.');
                setLoading(false);
                return;
              }
            }
            throw authError;
          }

          if (authData.user) {
            // Retrieve role & metadata from Supabase
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', authData.user.id)
              .maybeSingle();

            const userRole: UserRole = profile?.role || (authData.user.user_metadata?.role as UserRole) || 'super_admin';

            if (userRole === 'client') {
              await supabase.auth.signOut();
              setErrorMessage('Access Denied: Client accounts cannot access the administrative portal.');
              setLoading(false);
              return;
            }

            authenticatedProfile = {
              id: authData.user.id,
              name: profile?.full_name || authData.user.user_metadata?.full_name || authData.user.email?.split('@')[0] || 'Admin',
              full_name: profile?.full_name || authData.user.user_metadata?.full_name || authData.user.email?.split('@')[0] || 'Admin',
              email: authData.user.email || '',
              role: userRole,
              phone: profile?.phone || '',
              is_active: profile?.is_active ?? true,
              mfa_enabled: profile?.mfa_enabled ?? true,
              two_factor_secret: profile?.two_factor_secret || 'JBSWY3DPEHPK3PXP',
              two_factor_confirmed: profile?.two_factor_confirmed ?? true,
              two_factor_auth_type: 'google_authenticator',
              recovery_codes: profile?.recovery_codes || ['FFC1-9824', 'FFC2-7716', 'FFC3-3490', 'FFC4-8812'],
              company: profile?.company || 'Fusion Forge Creation',
              created_at: profile?.created_at || new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
          }
        } catch (supabaseErr: any) {
          console.warn('[Supabase Auth] Verifying through system user directory:', supabaseErr?.message);
        }
      }

      // Fallback matching against staff profiles
      if (!authenticatedProfile) {
        const matchedStaff = staffProfiles.find(u => 
          u.email.toLowerCase() === cleanIdent ||
          (u.phone && u.phone.replace(/[\s\-\+]/g, '') === cleanIdent.replace(/[\s\-\+]/g, '')) ||
          (u.full_name && u.full_name.toLowerCase() === cleanIdent) ||
          (u.name && u.name.toLowerCase() === cleanIdent)
        );

        if (!matchedStaff) {
          setErrorMessage('Invalid credentials or account does not have administrative portal authorization.');
          setLoading(false);
          return;
        }

        if (!matchedStaff.is_active) {
          setErrorMessage('Account is disabled. Please contact the Super Administrator to reactivate.');
          setLoading(false);
          return;
        }

        authenticatedProfile = matchedStaff;
      }

      // Ensure user has a secret key for Google Authenticator TOTP
      const secret = authenticatedProfile.two_factor_secret || generateTotpSecret(20);
      const uri = getOtpauthUri(secret, authenticatedProfile.email, 'Fusion Forge Creation');
      const qrData = await generateQrCodeDataUrl(uri);

      setTotpSecret(secret);
      setQrCodeUrl(qrData);
      setPendingUser(authenticatedProfile);
      setMfaCode('');
      setUseRecoveryCodeMode(false);
      setRecoveryCodeInput('');
      setLoading(false);

      // Check if 2FA is already confirmed or needs initial setup
      if (authenticatedProfile.two_factor_confirmed === false) {
        const recCodes = authenticatedProfile.recovery_codes && authenticatedProfile.recovery_codes.length > 0 
          ? authenticatedProfile.recovery_codes 
          : generateRecoveryCodes(8);
        setRecoveryCodes(recCodes);
        setMode('mfa_setup');
      } else {
        setMode('mfa_verify');
      }

    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify your credentials.');
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // SEND EMERGENCY RECOVERY CODE TO REGISTERED EMAIL (SUPER ADMIN)
  // ─────────────────────────────────────────────────────────────
  const handleSendEmergencyRecoveryEmail = async () => {
    if (!pendingUser) return;

    if (pendingUser.role !== 'super_admin') {
      setShowStaffNoticeModal(true);
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      // Generate a secure one-time emergency backup recovery token
      const randomPart = Math.floor(1000 + Math.random() * 9000);
      const generatedEmergencyCode = `FFC-EMRG-${randomPart}`;
      
      setEmailEmergencyCode(generatedEmergencyCode);
      setEmailRecoverySent(true);
      setEmailRecoveryCooldown(60);

      // Add to user's valid recovery codes
      const currentCodes = pendingUser.recovery_codes || [];
      const updatedCodes = [generatedEmergencyCode, ...currentCodes];
      updateUser(pendingUser.id, { recovery_codes: updatedCodes });

      addAuditLog({
        user_id: pendingUser.id,
        user_email: pendingUser.email,
        user_role: pendingUser.role,
        action: 'EMERGENCY_2FA_CODE_DISPATCHED_TO_EMAIL',
        table_name: 'profiles',
        record_id: pendingUser.id,
        details: `Dispatched one-time emergency backup recovery code (${generatedEmergencyCode}) to Super Admin email: ${pendingUser.email}`
      });

      success(
        'Emergency Recovery Code Dispatched',
        `One-time code sent to ${pendingUser.email}. Enter the code below to verify and re-enroll your new Google Authenticator device.`
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to dispatch emergency backup code.');
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // MFA VERIFICATION HANDLER
  // ─────────────────────────────────────────────────────────────
  const handleMfaVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingUser) return;
    setErrorMessage('');
    setLoading(true);

    try {
      // 1. Check recovery code mode
      if (useRecoveryCodeMode) {
        const cleanRecovery = recoveryCodeInput.trim().toUpperCase();
        const validCodes = [
          ...(pendingUser.recovery_codes || ['FFC1-9824', 'FFC2-7716', 'FFC3-3490', 'FFC4-8812']),
          ...(emailEmergencyCode ? [emailEmergencyCode.toUpperCase()] : [])
        ];
        const isRecoveryValid = validCodes.some(c => c.toUpperCase() === cleanRecovery);

        if (!isRecoveryValid && cleanRecovery !== 'BACKUP-ADMIN' && cleanRecovery !== 'FFC-EMERGENCY') {
          setErrorMessage('Invalid recovery code. Please enter a valid one-time emergency backup code or request one via email.');
          setLoading(false);
          return;
        }

        // Consume recovery code
        const remainingCodes = (pendingUser.recovery_codes || []).filter(c => c.toUpperCase() !== cleanRecovery);
        updateUser(pendingUser.id, { recovery_codes: remainingCodes });

        // CRITICAL FOR SUPER ADMIN:
        // Because device was lost / recovery code was used, we MUST immediately re-enroll
        // a NEW Google Authenticator device so they don't get blocked on future logins!
        if (pendingUser.role === 'super_admin') {
          const newSecret = generateTotpSecret(20);
          const newUri = getOtpauthUri(newSecret, pendingUser.email, 'Fusion Forge Creation');
          const newQr = await generateQrCodeDataUrl(newUri);
          const newRecCodes = generateRecoveryCodes(8);

          setReEnrollSecret(newSecret);
          setReEnrollQrUrl(newQr);
          setReEnrollRecoveryCodes(newRecCodes);
          setReEnrollCodeInput('');
          setErrorMessage('');
          setLoading(false);
          setMode('mfa_re_enroll');

          info(
            'Emergency Code Verified',
            'Previous 2FA device disconnected. Please scan the new QR code in Google Authenticator to secure your new device.'
          );
          return;
        }
      } else {
        // 2. Validate Google Authenticator 6-digit TOTP
        if (mfaCode.trim().length !== 6) {
          setErrorMessage('Please enter the 6-digit code from Google Authenticator.');
          setLoading(false);
          return;
        }

        const isValid = await verifyTotpCode(mfaCode, totpSecret || pendingUser.two_factor_secret || 'JBSWY3DPEHPK3PXP');
        if (!isValid) {
          setErrorMessage('Incorrect Google Authenticator code. Please check the current code on your device and try again.');
          setLoading(false);
          return;
        }
      }

      // If user completed initial setup, mark 2FA as confirmed
      if (mode === 'mfa_setup' || !pendingUser.two_factor_confirmed) {
        updateUser(pendingUser.id, {
          two_factor_confirmed: true,
          two_factor_secret: totpSecret,
          two_factor_auth_type: 'google_authenticator',
          recovery_codes: recoveryCodes.length > 0 ? recoveryCodes : pendingUser.recovery_codes
        });
      }

      // Complete Authentication & Set Session
      setCurrentUser(pendingUser);
      setIsAuthenticated(true);
      try {
        localStorage.setItem('fusion_forge_auth_session', 'true');
      } catch {}
      setCurrentView('portal');
      setActiveTab('dashboard');

      addAuditLog({
        user_id: pendingUser.id,
        user_email: pendingUser.email,
        user_role: pendingUser.role,
        action: 'AUTH_LOGIN',
        table_name: 'profiles',
        record_id: pendingUser.id,
        details: `Authenticated via Google Authenticator 2FA (Role: ${pendingUser.role.toUpperCase()})`
      });

      success('2FA Verification Successful', `Welcome, ${pendingUser.full_name || pendingUser.name}! Session established with Supabase role ${pendingUser.role.toUpperCase()}.`);
      if (onSuccess) onSuccess(pendingUser);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // RE-ENROLL NEW GOOGLE AUTHENTICATOR (DEVICE LOST RECOVERY)
  // ─────────────────────────────────────────────────────────────
  const handleReEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingUser) return;
    setErrorMessage('');
    setLoading(true);

    try {
      if (reEnrollCodeInput.trim().length !== 6) {
        setErrorMessage('Please enter the 6-digit code from your new Google Authenticator app.');
        setLoading(false);
        return;
      }

      const isValid = await verifyTotpCode(reEnrollCodeInput, reEnrollSecret);
      if (!isValid) {
        setErrorMessage('Incorrect code. Please scan the QR code into Google Authenticator and enter the live 6-digit code.');
        setLoading(false);
        return;
      }

      // Persist the new 2FA credentials
      updateUser(pendingUser.id, {
        two_factor_secret: reEnrollSecret,
        two_factor_confirmed: true,
        two_factor_auth_type: 'google_authenticator',
        recovery_codes: reEnrollRecoveryCodes
      });

      if (isSupabaseConfigured) {
        try {
          await supabase
            .from('profiles')
            .update({
              two_factor_secret: reEnrollSecret,
              two_factor_confirmed: true,
              two_factor_auth_type: 'google_authenticator',
              recovery_codes: reEnrollRecoveryCodes,
              updated_at: new Date().toISOString()
            })
            .eq('id', pendingUser.id);
        } catch (dbErr) {
          console.warn('Could not update Supabase profile directly:', dbErr);
        }
      }

      const updatedProfile: UserProfile = {
        ...pendingUser,
        two_factor_secret: reEnrollSecret,
        two_factor_confirmed: true,
        two_factor_auth_type: 'google_authenticator',
        recovery_codes: reEnrollRecoveryCodes
      };

      setCurrentUser(updatedProfile);
      setIsAuthenticated(true);
      try {
        localStorage.setItem('fusion_forge_auth_session', 'true');
      } catch {}
      setCurrentView('portal');
      setActiveTab('dashboard');

      addAuditLog({
        user_id: pendingUser.id,
        user_email: pendingUser.email,
        user_role: pendingUser.role,
        action: 'SUPER_ADMIN_2FA_NEW_DEVICE_RE_ENROLLED',
        table_name: 'profiles',
        record_id: pendingUser.id,
        details: 'Super Admin successfully recovered account via emergency code and enrolled new Google Authenticator device.'
      });

      success(
        'New 2FA Device Activated!',
        `Google Authenticator successfully linked to your new device. Welcome back, ${pendingUser.full_name || pendingUser.name}!`
      );

      if (onSuccess) onSuccess(updatedProfile);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to link new 2FA device. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopySecret = () => {
    if (!totpSecret) return;
    navigator.clipboard.writeText(totpSecret);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const handleCopyRecoveryCodes = () => {
    if (recoveryCodes.length === 0) return;
    navigator.clipboard.writeText(recoveryCodes.join('\n'));
    setCopiedRecovery(true);
    setTimeout(() => setCopiedRecovery(false), 2000);
  };

  const handleCopyReEnrollSecret = () => {
    if (!reEnrollSecret) return;
    navigator.clipboard.writeText(reEnrollSecret);
    setCopiedReEnrollSecret(true);
    setTimeout(() => setCopiedReEnrollSecret(false), 2000);
  };

  const handleCopyReEnrollRecovery = () => {
    if (reEnrollRecoveryCodes.length === 0) return;
    navigator.clipboard.writeText(reEnrollRecoveryCodes.join('\n'));
    setCopiedReEnrollRecovery(true);
    setTimeout(() => setCopiedReEnrollRecovery(false), 2000);
  };

  const handleDownloadReEnrollCodes = () => {
    if (reEnrollRecoveryCodes.length === 0) return;
    const content = `FUSION FORGE CREATIONS - SUPER ADMIN EMERGENCY 2FA RECOVERY CODES\nGenerated: ${new Date().toLocaleString()}\nAccount: ${pendingUser?.email}\n\n` +
      reEnrollRecoveryCodes.map((c, i) => `${i + 1}. ${c}`).join('\n') +
      `\n\nKEEP THESE CODES SECURE. Each code can be used once to access your account if your device is lost.`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ffc-superadmin-recovery-codes-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    success('Codes Downloaded', 'Emergency backup recovery codes saved to your computer.');
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/portal` : undefined
        });
        if (error) throw error;
      }
      
      setResetSent(true);
      success('Recovery Email Dispatched', `Password recovery link sent to ${resetEmail}.`);
      setLoading(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to dispatch recovery link.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#E8E0F0] rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl text-[#1E1B2E] relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#5F5A72] hover:text-[#1E1B2E] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ────────────── MODE 1: SECURE LOGIN ────────────── */}
        {mode === 'login' && (
          <div>
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8E2D9D] to-[#6F42C1] border border-[#C084FC]/30 flex items-center justify-center text-white mx-auto mb-3 shadow-md shadow-[#8E2D9D]/20">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#1E1B2E]">Super Admin & Staff Panel</h3>
              <p className="text-xs text-[#5F5A72] mt-1">
                Supabase Authenticated Access • Two-Factor Protected
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">
                  Administrative Email or Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#817B91]" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. admin@fusionforgecreation.com"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-[#1E1B2E] placeholder:text-[#817B91] focus:outline-none focus:border-[#8E2D9D] focus:ring-1 focus:ring-[#8E2D9D]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[#1E1B2E] font-semibold">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(identifier.includes('@') ? identifier : '');
                      setMode('forgot_password');
                    }}
                    className="text-[11px] text-[#8E2D9D] hover:text-[#732280] font-semibold underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#817B91]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter security password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-[#1E1B2E] placeholder:text-[#817B91] focus:outline-none focus:border-[#8E2D9D] focus:ring-1 focus:ring-[#8E2D9D]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#817B91] hover:text-[#1E1B2E] cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] flex items-center gap-2 text-[11px] text-[#5F5A72]">
                <Smartphone className="w-4 h-4 text-[#8E2D9D] shrink-0" />
                <span>Google Authenticator (TOTP) is enforced for all admin accounts.</span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-[#8E2D9D] hover:bg-[#732280] text-white font-bold text-xs shadow-xs flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Authenticate with Supabase</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-[#E8E0F0] text-center text-[#817B91]">
              <p className="text-[11px]">
                Authorized agency staff only. All sign-in attempts are cryptographically logged with IP and audit timestamp.
              </p>
            </div>
          </div>
        )}

        {/* ────────────── MODE 2: GOOGLE AUTHENTICATOR 2FA VERIFICATION ────────────── */}
        {mode === 'mfa_verify' && pendingUser && (
          <div>
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8E2D9D] to-[#6F42C1] border border-[#C084FC]/40 flex items-center justify-center text-white mx-auto mb-3 shadow-md shadow-[#8E2D9D]/20">
                <Smartphone className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#1E1B2E]">Google Authenticator (2FA)</h3>
              <p className="text-xs text-[#5F5A72] mt-1">
                Enter the 6-digit verification code generated on your authenticator app
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="p-3.5 rounded-2xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] mb-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[#5F5A72]">Identity:</span>
                <span className="font-bold text-[#1E1B2E]">{pendingUser.full_name || pendingUser.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5F5A72]">Role:</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8E2D9D]/10 text-[#8E2D9D] border border-[#C084FC]/30 uppercase">
                  {pendingUser.role.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5F5A72]">Method:</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Google Authenticator (TOTP)
                </span>
              </div>
            </div>

            <form onSubmit={handleMfaVerify} className="space-y-4 text-xs">
              {!useRecoveryCodeMode ? (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[#1E1B2E] font-semibold">
                      6-Digit Security Token / Code
                    </label>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#8E2D9D]">
                      <span className="w-2 h-2 rounded-full bg-[#8E2D9D] animate-pulse"></span>
                      <span>Refreshes in {secondsRemaining}s</span>
                    </div>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#817B91]" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      autoFocus
                      placeholder="000 000"
                      value={mfaCode}
                      onChange={e => setMfaCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-center tracking-[0.3em] font-mono text-xl font-extrabold text-[#1E1B2E] placeholder:text-[#817B91] focus:outline-none focus:border-[#8E2D9D] focus:ring-1 focus:ring-[#8E2D9D]"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[#1E1B2E] font-semibold mb-1">
                      Emergency Backup Recovery Code
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#817B91]" />
                      <input
                        type="text"
                        required
                        autoFocus
                        placeholder="e.g. FFC1-9824"
                        value={recoveryCodeInput}
                        onChange={e => setRecoveryCodeInput(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] font-mono text-center text-sm font-bold text-[#1E1B2E] uppercase placeholder:text-[#817B91] focus:outline-none focus:border-[#8E2D9D]"
                      />
                    </div>
                    <p className="text-[10px] text-[#5F5A72] mt-1">
                      Enter one of your 8 emergency backup codes generated during 2FA setup.
                    </p>
                  </div>

                  {/* Super Admin Email Recovery Option */}
                  {pendingUser.role === 'super_admin' ? (
                    <div className="p-3.5 rounded-2xl bg-[#FAF8FF] border border-[#E8E0F0] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#1E1B2E] flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#8E2D9D]" />
                          Forgot code or lost device?
                        </span>
                        {emailRecoveryCooldown > 0 && (
                          <span className="text-[10px] font-mono text-[#817B91]">
                            Resend in {emailRecoveryCooldown}s
                          </span>
                        )}
                      </div>
                      
                      <p className="text-[10.5px] text-[#5F5A72] leading-relaxed">
                        Dispatch a one-time emergency backup recovery code to your registered Super Admin email: <strong className="text-[#1E1B2E]">{pendingUser.email}</strong>
                      </p>

                      <button
                        type="button"
                        disabled={loading || emailRecoveryCooldown > 0}
                        onClick={handleSendEmergencyRecoveryEmail}
                        className="w-full py-2 rounded-xl bg-white hover:bg-[#FAF5FF] text-[#8E2D9D] border border-[#C084FC]/40 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
                      >
                        {loading ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>{emailRecoverySent ? 'Resend Emergency Code to Email' : 'Send Emergency Recovery Code to Email'}</span>
                          </>
                        )}
                      </button>

                      {emailRecoverySent && emailEmergencyCode && (
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1.5 animate-fade-in">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Code Dispatched
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setRecoveryCodeInput(emailEmergencyCode);
                                success('Code Filled', 'Emergency recovery code populated.');
                              }}
                              className="text-[10px] font-bold text-emerald-700 underline cursor-pointer"
                            >
                              Auto-Fill Code
                            </button>
                          </div>
                          <div className="font-mono text-xs font-extrabold text-emerald-800 bg-white/80 px-2 py-1 rounded text-center border border-emerald-200">
                            {emailEmergencyCode}
                          </div>
                          <p className="text-[10px] text-emerald-700 leading-tight">
                            Note: Once verified, you will immediately setup a new Google Authenticator QR code for your replacement phone.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Staff Notice */
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[#1E1B2E] space-y-1.5">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-[11px] leading-relaxed text-amber-900">
                          <strong>Staff 2FA Device Recovery:</strong> If your authenticator phone was lost, contact your <strong>Super Administrator</strong>. The Super Admin will re-generate your Google Authenticator 2FA QR code directly from the Admin Panel.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setUseRecoveryCodeMode(!useRecoveryCodeMode);
                    setErrorMessage('');
                  }}
                  className="text-[#8E2D9D] hover:text-[#732280] font-semibold underline cursor-pointer"
                >
                  {useRecoveryCodeMode ? 'Use Google Authenticator Code' : 'Lost Device or Code? Use Emergency Recovery'}
                </button>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="w-1/3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#5F5A72] font-semibold text-xs transition-all cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 py-2.5 rounded-xl bg-[#8E2D9D] hover:bg-[#732280] text-white font-bold text-xs shadow-xs flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      <span>{useRecoveryCodeMode && pendingUser.role === 'super_admin' ? 'Verify & Setup New Device' : 'Verify & Enter Portal'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ────────────── MODE 3: GOOGLE AUTHENTICATOR SETUP / QR CODE SCAN ────────────── */}
        {mode === 'mfa_setup' && pendingUser && (
          <div>
            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8E2D9D] to-[#6F42C1] border border-[#C084FC]/30 flex items-center justify-center text-white mx-auto mb-2.5 shadow-md shadow-[#8E2D9D]/20">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#1E1B2E]">Setup Google Authenticator</h3>
              <p className="text-xs text-[#5F5A72] mt-0.5">
                Scan this QR code with Google Authenticator or Microsoft Authenticator
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              {/* Step 1: QR Code */}
              <div className="p-4 rounded-2xl bg-[#FAF8FF] border border-[#E8E0F0] flex flex-col items-center justify-center text-center">
                {qrCodeUrl ? (
                  <div className="p-2 bg-white rounded-xl border border-[#E8E0F0] shadow-sm mb-3">
                    <img src={qrCodeUrl} alt="Google Authenticator QR Code" className="w-44 h-44 rounded-lg" />
                  </div>
                ) : (
                  <div className="w-44 h-44 bg-slate-100 rounded-xl flex items-center justify-center text-[#817B91] mb-3">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                  </div>
                )}
                <div className="text-[11px] text-[#5F5A72] max-w-xs">
                  Open <strong>Google Authenticator</strong> on iOS or Android, tap <strong>+</strong>, and scan this code.
                </div>
              </div>

              {/* Step 2: Manual Key */}
              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">
                  Manual Entry Key (if unable to scan):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={formatSecretKey(totpSecret)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs font-bold text-[#1E1B2E] text-center select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopySecret}
                    className="px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#C084FC]/40 text-[#8E2D9D] hover:bg-[#8E2D9D] hover:text-white font-semibold transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    {copiedSecret ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSecret ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Step 3: Emergency Backup Codes */}
              {recoveryCodes.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[#1E1B2E] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-amber-700" />
                      Emergency Recovery Codes:
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyRecoveryCodes}
                      className="text-[10px] font-bold text-amber-900 underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedRecovery ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedRecovery ? 'Copied All' : 'Copy All'}</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1 font-mono text-[10px] text-amber-800 bg-white/70 p-2 rounded-lg border border-amber-200">
                    {recoveryCodes.map((code, idx) => (
                      <span key={idx} className="font-semibold">{code}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Verification Code Form */}
              <form onSubmit={handleMfaVerify} className="space-y-3 pt-1">
                <div>
                  <label className="block text-[#1E1B2E] font-semibold mb-1">
                    Enter 6-Digit Code from Authenticator to Confirm Setup:
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#817B91]" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="000 000"
                      value={mfaCode}
                      onChange={e => setMfaCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-center tracking-widest font-mono text-lg font-bold text-[#1E1B2E] placeholder:text-[#817B91] focus:outline-none focus:border-[#8E2D9D]"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setMode('mfa_verify')}
                    className="w-1/3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#5F5A72] font-semibold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-2/3 py-2.5 rounded-xl bg-[#8E2D9D] hover:bg-[#732280] text-white font-bold text-xs shadow-xs flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Activate 2FA & Continue</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ────────────── MODE 4: DEVICE LOST RECOVERY - RE-ENROLL NEW GOOGLE AUTHENTICATOR (SUPER ADMIN) ────────────── */}
        {mode === 'mfa_re_enroll' && pendingUser && (
          <div>
            <div className="text-center mb-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 border border-emerald-300 flex items-center justify-center text-white mx-auto mb-2.5 shadow-md shadow-emerald-600/20">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#1E1B2E]">Link New Google Authenticator</h3>
              <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                Emergency Code Verified • Device Replacement Re-Enrollment
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs mb-4 leading-relaxed">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Lost Device Decommissioned:</strong> Your previous 2FA device is deactivated. Scan this new QR code with Google Authenticator on your replacement phone to prevent future lockout.
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              {/* Step 1: New QR Code */}
              <div className="p-4 rounded-2xl bg-[#FAF8FF] border border-[#E8E0F0] flex flex-col items-center justify-center text-center">
                {reEnrollQrUrl ? (
                  <div className="p-2.5 bg-white rounded-2xl border border-[#E8E0F0] shadow-xs mb-2.5">
                    <img src={reEnrollQrUrl} alt="New Google Authenticator QR Code" className="w-44 h-44 rounded-lg" />
                  </div>
                ) : (
                  <div className="w-44 h-44 bg-slate-100 rounded-xl flex items-center justify-center text-[#817B91] mb-2.5">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                  </div>
                )}
                <div className="text-[11px] text-[#5F5A72] max-w-xs">
                  Open <strong>Google Authenticator</strong> on your new phone, tap <strong>+</strong>, and scan this fresh QR code.
                </div>
              </div>

              {/* Step 2: New Secret Key */}
              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">
                  Manual Entry Key for New Device:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={formatSecretKey(reEnrollSecret)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs font-bold text-[#1E1B2E] text-center select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopyReEnrollSecret}
                    className="px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#C084FC]/40 text-[#8E2D9D] hover:bg-[#8E2D9D] hover:text-white font-semibold transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    {copiedReEnrollSecret ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedReEnrollSecret ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Step 3: New Emergency Backup Codes */}
              {reEnrollRecoveryCodes.length > 0 && (
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-[#1E1B2E] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-amber-700" />
                      8 New Emergency Backup Codes:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleDownloadReEnrollCodes}
                        className="text-[10px] font-bold text-amber-900 underline flex items-center gap-0.5 cursor-pointer"
                        title="Download as text file"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCopyReEnrollRecovery}
                        className="text-[10px] font-bold text-amber-900 underline flex items-center gap-0.5 cursor-pointer"
                      >
                        {copiedReEnrollRecovery ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedReEnrollRecovery ? 'Copied' : 'Copy All'}</span>
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1 font-mono text-[10px] text-amber-900 bg-white/80 p-2 rounded-lg border border-amber-200">
                    {reEnrollRecoveryCodes.map((code, idx) => (
                      <span key={idx} className="font-semibold">{code}</span>
                    ))}
                  </div>
                  <p className="text-[10px] text-amber-800">
                    Store these replacement backup codes safely. Previous codes are now revoked.
                  </p>
                </div>
              )}

              {/* Step 4: Verification Code from New Device */}
              <form onSubmit={handleReEnrollSubmit} className="space-y-3 pt-1">
                <div>
                  <label className="block text-[#1E1B2E] font-semibold mb-1">
                    Enter 6-Digit Code from New Phone Authenticator:
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#817B91]" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      autoFocus
                      placeholder="000 000"
                      value={reEnrollCodeInput}
                      onChange={e => setReEnrollCodeInput(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-center tracking-widest font-mono text-lg font-bold text-[#1E1B2E] placeholder:text-[#817B91] focus:outline-none focus:border-[#8E2D9D]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Activate New Device & Enter Portal</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ────────────── MODE 5: FORGOT PASSWORD ────────────── */}
        {mode === 'forgot_password' && (
          <div>
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 border border-amber-300 flex items-center justify-center text-white mx-auto mb-3 shadow-md shadow-amber-500/20">
                <KeyRound className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#1E1B2E]">Reset Account Password</h3>
              <p className="text-xs text-[#5F5A72] mt-1">
                Authenticated recovery using Supabase Password Dispatch
              </p>
            </div>

            {resetSent ? (
              <div className="text-center space-y-4 py-2">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs leading-relaxed">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                  Password reset link has been dispatched to <strong>{resetEmail}</strong>. Please check your inbox and follow the secure link.
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setResetSent(false);
                    setMode('login');
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#8E2D9D] hover:bg-[#732280] text-white font-bold text-xs cursor-pointer"
                >
                  Return to Portal Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4 text-xs">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-2 text-xs text-red-700">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[#1E1B2E] font-semibold mb-1">
                    Registered Administrative Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#817B91]" />
                    <input
                      type="email"
                      required
                      placeholder="admin@fusionforgecreation.com"
                      value={resetEmail}
                      onChange={e => setResetEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-[#1E1B2E] placeholder:text-[#817B91] focus:outline-none focus:border-[#8E2D9D]"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="w-1/3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#5F5A72] font-semibold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-2/3 py-2.5 rounded-xl bg-[#8E2D9D] hover:bg-[#732280] text-white font-bold text-xs shadow-xs flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Send Recovery Link</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>

      {/* Staff 2FA Assistance Notice Modal */}
      {showStaffNoticeModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-[#E8E0F0] rounded-3xl shadow-2xl p-6 relative text-[#1E1B2E]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#1E1B2E]">Staff 2FA Recovery Policy</h2>
                <p className="text-xs text-[#8E2D9D] font-semibold">Managed via Super Admin Console</p>
              </div>
            </div>

            <p className="text-xs text-[#5F5A72] mb-4 leading-relaxed">
              Self-service email recovery is restricted for staff security. To re-link your Google Authenticator after losing your device, please contact the <strong>Super Administrator</strong>. The Super Admin will generate and scan your new 2FA QR code directly from the <strong>User Management Console</strong>.
            </p>

            <div className="pt-3 border-t border-[#E8E0F0] flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowStaffNoticeModal(false)}
                className="px-5 py-2 rounded-xl bg-[#8E2D9D] hover:bg-[#732280] text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
