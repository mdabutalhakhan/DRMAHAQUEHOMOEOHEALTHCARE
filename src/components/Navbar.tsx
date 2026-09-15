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
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  currentUser,
  onOpenLogin,
  onLogout,
  currentView,
  setCurrentView,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-950/10 dark:border-slate-800 bg-[#F8FAF9]/95 dark:bg-[#0F172A]/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Clinic Info */}
        <div 
          onClick={() => setCurrentView('home')} 
          className="flex items-center gap-3 cursor-pointer group"
          id="brand-logo-button"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] text-white flex items-center justify-center shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform">
            <HeartHandshake className="w-7 h-7 text-emerald-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl sm:text-2xl tracking-tight text-[#1B4332] dark:text-emerald-400">
                Homoeo Health Care
              </span>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                Est. Benachity
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Dr. M. A. Haque, <span className="text-[#2D6A4F] dark:text-emerald-400 font-semibold">M.D. (Homoeo)</span>
            </p>
          </div>
        </div>

        {/* Navigation & Action Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          <nav className="hidden md:flex items-center gap-1">
            <button
              id="nav-book-btn"
              onClick={() => setCurrentView('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'home'
                  ? 'bg-emerald-100/80 text-[#1B4332] dark:bg-emerald-900/40 dark:text-emerald-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Book Appointment
            </button>
            <button
              id="nav-tracker-btn"
              onClick={() => setCurrentView('tracker')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentView === 'tracker'
                  ? 'bg-emerald-100/80 text-[#1B4332] dark:bg-emerald-900/40 dark:text-emerald-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Live Queue Tracker
            </button>
          </nav>

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
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Bright/Dark Mode"
            title={darkMode ? 'Switch to Bright Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700" />
            )}
          </button>

          {/* Authentication / Dashboard state */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                id="btn-goto-dashboard"
                onClick={() => setCurrentView('dashboard')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  currentView === 'dashboard'
                    ? 'bg-[#1B4332] text-white shadow-md'
                    : 'bg-emerald-800 text-white hover:bg-emerald-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Clinic Dashboard</span>
                <span className="capitalize px-1.5 py-0.5 rounded bg-white/20 text-[11px]">
                  {currentUser.role}
                </span>
              </button>
              <button
                id="btn-logout"
                onClick={onLogout}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              id="btn-staff-login"
              onClick={onOpenLogin}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold bg-[#1B4332] hover:bg-[#2D6A4F] text-white shadow-sm transition-all"
            >
              <UserCheck className="w-4 h-4" />
              <span>Staff / Doctor Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
