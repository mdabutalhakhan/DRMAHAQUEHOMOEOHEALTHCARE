import React, { useState } from 'react';
import { X, Lock, Mail, AlertCircle, Loader2, KeyRound, Eye, EyeOff } from 'lucide-react';
import { UserProfile } from '../types';
import { getProfiles, setCurrentUser } from '../services/clinicStore';
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
  const profiles = getProfiles();

  if (!isOpen) return null;

  const handleCredentialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMsg('Please enter your clinic work email.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      let authenticatedUser: UserProfile | null = null;
      const supabase = getSupabase();

      // 1. Attempt Supabase Auth if Supabase client is configured
      if (supabase) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password,
          });

          if (!error && data?.user) {
            // Fetch profile record from profiles table
            try {
              const { data: dbProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();

              if (dbProfile) {
                authenticatedUser = dbProfile as UserProfile;
              }
            } catch (profileErr) {
              console.warn('Could not load profile from database:', profileErr);
            }

            if (!authenticatedUser) {
              const matchedLocal = profiles.find((p) => p.email.toLowerCase() === cleanEmail);
              authenticatedUser = matchedLocal || {
                id: data.user.id,
                email: data.user.email || cleanEmail,
                full_name: data.user.user_metadata?.full_name || (cleanEmail.includes('admin') ? 'Md Abu Talha Khan' : 'Homoeo Clinic Staff'),
                role: (data.user.user_metadata?.role as any) || (cleanEmail.includes('admin') ? 'admin' : cleanEmail.includes('dr') ? 'doctor' : 'staff'),
                phone: '9933506514',
              };
            }
          } else if (error) {
            console.warn('Supabase Auth error:', error.message);
          }
        } catch (supabaseErr: any) {
          console.warn('Supabase auth request failed (checking fallback credentials):', supabaseErr?.message || supabaseErr);
        }
      }

      // 2. Fallback local authentication check
      // If user is not pre-registered in Supabase Auth or Supabase client encountered an error:
      if (!authenticatedUser) {
        // Explicit Admin fallback: admin@homoeo.com / admin123
        if (cleanEmail === 'admin@homoeo.com' && password === 'admin123') {
          authenticatedUser = {
            id: 'user-admin-default',
            email: 'admin@homoeo.com',
            full_name: 'Md Abu Talha Khan',
            role: 'admin',
            phone: '9933506514',
          };
        } else {
          // Check authorized local clinic staff / doctors
          const matched = profiles.find((p) => p.email.toLowerCase() === cleanEmail);
          if (matched && password.length >= 6) {
            authenticatedUser = matched;
          }
        }
      }

      if (!authenticatedUser) {
        throw new Error(
          'Invalid email or password. Please verify your credentials or contact clinic administrator.'
        );
      }

      setCurrentUser(authenticatedUser);
      onLoginSuccess(authenticatedUser);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg md:max-w-xl max-h-[90vh] md:max-h-[88vh] flex flex-col bg-[#FAF7EE] dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-emerald-900/20">
        {/* Modal Header */}
        <div className="shrink-0 p-4 border-b border-stone-200 dark:border-slate-800 flex justify-between items-center bg-white/70 dark:bg-slate-900/80">
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
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-stone-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 overscroll-contain">
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Authorized personnel only. Please sign in with your clinic credentials to access the Doctor Consultation Chamber and Queue Manager.
          </p>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="font-medium">{errorMsg}</span>
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

        {/* Modal Footer / Actions (Pinned) */}
        <div className="shrink-0 p-4 border-t border-stone-200 dark:border-slate-800 bg-stone-50/80 dark:bg-slate-900/80 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
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
                <span>Verifying...</span>
              </>
            ) : (
              <span>Authenticate & Open Chamber</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
