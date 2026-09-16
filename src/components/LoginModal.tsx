import React, { useState } from 'react';
import { X, Lock, Mail, AlertCircle, Loader2, KeyRound, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';
import { setCurrentUser, updateClinicTeamPassword } from '../services/clinicStore';
import { getSupabase } from '../services/supabase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // First-time login change password state
  const [firstLoginUser, setFirstLoginUser] = useState<UserProfile | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  if (!isOpen) return null;

  const resetAllState = () => {
    setEmail('');
    setPassword('');
    setErrorMsg('');
    setLoading(false);
    setFirstLoginUser(null);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setUpdatingPassword(false);
  };

  const handleModalClose = () => {
    resetAllState();
    onClose();
  };

  const completeLogin = (user: UserProfile) => {
    setCurrentUser(user);
    onLoginSuccess(user);
    resetAllState();
    onClose();
  };

  const handleCredentialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMsg('Please enter your clinic work email.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      const supabase = getSupabase();

      // 1. Fetch user by email (case-insensitive) strictly from Supabase clinic_team table
      const { data: users, error } = await supabase
        .from('clinic_team')
        .select('*')
        .ilike('email', cleanEmail);

      if (error) {
        console.error('Supabase clinic_team query error:', error);
        throw new Error('Database connection issue. Please check your network connection.');
      }

      if (!users || users.length === 0) {
        throw new Error('Invalid Work Email or Password');
      }

      // 2. Match credentials against clinic_team table
      const matchedUser = users.find((u) => u.password === password);
      if (!matchedUser) {
        throw new Error('Invalid Work Email or Password');
      }

      // 3. ACCOUNT STATUS CHECK (DISABLE FEATURE)
      if (matchedUser.is_active === false) {
        throw new Error('This account has been deactivated by Admin. Access denied.');
      }

      // 4. FIRST-TIME LOGIN PASSWORD POPUP CHECK
      if (matchedUser.is_first_login === true) {
        setFirstLoginUser(matchedUser as UserProfile);
        setLoading(false);
        return;
      }

      // 5. Successful login
      completeLogin(matchedUser as UserProfile);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid Work Email or Password');
    } finally {
      setLoading(false);
    }
  };

  const handleSkipFirstLogin = async () => {
    if (!firstLoginUser) return;
    setUpdatingPassword(true);
    setPasswordError('');

    try {
      await updateClinicTeamPassword(firstLoginUser.id, undefined, false);
      const updatedUser: UserProfile = {
        ...firstLoginUser,
        is_first_login: false,
      };
      completeLogin(updatedUser);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to update login status.');
      setUpdatingPassword(false);
    }
  };

  const handleUpdateFirstLoginPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstLoginUser) return;
    setPasswordError('');

    const trimmed = newPassword.trim();
    if (!trimmed || trimmed.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (trimmed !== confirmPassword.trim()) {
      setPasswordError('Passwords do not match. Please re-enter.');
      return;
    }

    setUpdatingPassword(true);

    try {
      await updateClinicTeamPassword(firstLoginUser.id, trimmed, false);
      const updatedUser: UserProfile = {
        ...firstLoginUser,
        password: trimmed,
        is_first_login: false,
      };
      completeLogin(updatedUser);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to save new password. Please try again.');
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md md:max-w-lg flex flex-col bg-[#FAF7EE] dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-emerald-900/20">
        
        {/* ========================================================= */}
        {/* VIEW 1: FIRST-TIME LOGIN PASSWORD POPUP                   */}
        {/* ========================================================= */}
        {firstLoginUser ? (
          <div>
            {/* Header */}
            <div className="p-4 border-b border-stone-200 dark:border-slate-800 flex justify-between items-center bg-white/80 dark:bg-slate-900/90">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    Change Your Temporary Password
                  </h3>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                    First-Time Sign In • {firstLoginUser.full_name} ({firstLoginUser.role.toUpperCase()})
                  </p>
                </div>
              </div>
              <button
                onClick={handleModalClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-stone-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <div className="p-5 sm:p-6 space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                Welcome to Homoeo Health Care! You are currently logging in with an initial temporary password set by the Administrator. You can set your personal password now, or skip to keep your current password.
              </div>

              {passwordError && (
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="font-medium">{passwordError}</span>
                </div>
              )}

              <form id="first-login-pwd-form" onSubmit={handleUpdateFirstLoginPassword} className="space-y-3.5">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                      New Personal Password *
                    </label>
                    <span className="text-[11px] text-slate-400">Min. 6 characters</span>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      id="new-temp-password-input"
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332] dark:focus:ring-emerald-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition focus:outline-none cursor-pointer"
                      title={showNewPassword ? 'Hide password' : 'Show password'}
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      id="confirm-temp-password-input"
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332] dark:focus:ring-emerald-500 transition"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-stone-200 dark:border-slate-800 bg-stone-50/80 dark:bg-slate-900/80 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleSkipFirstLogin}
                disabled={updatingPassword}
                className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800 transition cursor-pointer disabled:opacity-50"
              >
                Skip / Keep Current
              </button>
              <button
                type="submit"
                form="first-login-pwd-form"
                disabled={updatingPassword}
                className="px-5 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {updatingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Password & Continue</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* VIEW 2: STRICT CREDENTIAL LOGIN FORM                      */
          /* ========================================================= */
          <div>
            {/* Modal Header */}
            <div className="p-4 border-b border-stone-200 dark:border-slate-800 flex justify-between items-center bg-white/70 dark:bg-slate-900/80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#1B4332] text-white flex items-center justify-center shadow-xs">
                  <Lock className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    Clinic Staff & Doctor Portal
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Dr. M. A. Haque, M.D. (Homoeo) • Benachity
                  </p>
                </div>
              </div>
              <button
                onClick={handleModalClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-stone-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-4 sm:p-6 space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Authorized clinic personnel only. Enter your registered work email and password to open the consultation chamber.
              </p>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="font-semibold">{errorMsg}</span>
                </div>
              )}

              {/* Real Credential Login Form */}
              <form id="staff-login-form" onSubmit={handleCredentialLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                    Work Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      id="login-email-input"
                      type="email"
                      required
                      placeholder="admin@homoeo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332] dark:focus:ring-emerald-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    <span className="text-[11px] text-slate-400">Min. 6 characters</span>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      id="login-password-input"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332] dark:focus:ring-emerald-500 transition"
                    />
                    <button
                      type="button"
                      id="btn-toggle-password-visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition focus:outline-none cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer / Actions */}
            <div className="p-4 border-t border-stone-200 dark:border-slate-800 bg-stone-50/80 dark:bg-slate-900/80 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleModalClose}
                className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="staff-login-form"
                id="btn-submit-login"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate & Open Chamber</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
