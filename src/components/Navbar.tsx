import React from 'react';
import { 
  HeartHandshake, 
  Moon, 
  Sun, 
  Phone, 
  UserCheck, 
  LogOut, 
  LayoutDashboard, 
  CalendarCheck, 
  Stethoscope, 
  ShieldAlert,
  Search
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  currentUser: UserProfile | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  currentView: 'home' | 'tracker' | 'dashboard';
  setCurrentView: (view: 'home' | 'tracker' | 'dashboard') => void;
  onOpenTracker?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  currentUser,
  onOpenLogin,
  onLogout,
  currentView,
  setCurrentView,
  onOpenTracker,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-950/10 dark:border-slate-800 bg-[#FAF7EE]/95 dark:bg-[#0F172A]/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 md:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Clinic Info */}
        <div 
          onClick={() => setCurrentView('home')} 
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group min-w-0"
          id="brand-logo-button"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] text-white flex items-center justify-center shadow-sm sm:shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform shrink-0">
            <HeartHandshake className="w-4.5 h-4.5 sm:w-5 sm:h-5 md:w-7 md:h-7 text-emerald-200" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-bold text-sm sm:text-lg md:text-2xl tracking-tight text-[#1B4332] dark:text-emerald-400 truncate">
                Homoeo Health Care
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium truncate leading-tight">
              Dr. M. A. Haque, <span className="text-[#2D6A4F] dark:text-emerald-400 font-semibold">M.D. (Homoeo)</span> • Benachity
            </p>
          </div>
        </div>

        {/* Right Action Controls: Dark/Light Mode Toggle & Staff/Doctor Login */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Quick Clinic Phone link */}
          <a
            href="tel:9933506514"
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 transition-colors"
            title="Clinic WhatsApp & Helpline"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>9933506514</span>
          </a>

          {/* Dark / Light Mode Toggle */}
          <button
            id="theme-toggle-button"
            onClick={() => setDarkMode(!darkMode)}
            className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Bright/Dark Mode"
            title={darkMode ? 'Switch to Bright Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
            )}
          </button>

          {/* Authentication / Dashboard state */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                id="btn-goto-dashboard"
                onClick={() => setCurrentView('dashboard')}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  currentView === 'dashboard'
                    ? 'bg-[#1B4332] text-white shadow-sm'
                    : 'bg-emerald-800 text-white hover:bg-emerald-900'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Dashboard</span>
                <span className="capitalize px-1 sm:px-1.5 py-0.5 rounded bg-white/20 text-[10px] sm:text-[11px]">
                  {currentUser.role}
                </span>
              </button>
              <button
                id="btn-logout"
                onClick={onLogout}
                className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          ) : (
            <button
              id="btn-staff-login"
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold bg-[#1B4332] hover:bg-[#2D6A4F] text-white shadow-xs sm:shadow-sm transition-all"
            >
              <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden sm:inline">Staff / Doctor Login</span>
              <span className="sm:hidden">Staff Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
