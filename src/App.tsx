import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PublicHome } from './components/PublicHome';
import { LiveTracker } from './components/LiveTracker';
import { LiveTrackerModal } from './components/LiveTrackerModal';
import { Dashboard } from './components/Dashboard';
import { LoginModal } from './components/LoginModal';
import { UserProfile } from './types';
import { getCurrentUser, setCurrentUser, autoCancelExpiredAppointments } from './services/clinicStore';
import { initSupabaseSync } from './services/clinicStore';
import { getSupabase } from './services/supabase';

export default function App() {
  // Dark mode state: default to false (Medical Bright aesthetic #F8FAF9), supports dark mode #0F172A
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('homoeo_dark_mode') || localStorage.getItem('homeo_dark_mode');
    const isDark = saved ? JSON.parse(saved) : false;
    if (typeof document !== 'undefined') {
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    return isDark;
  });

  // Current authenticated user (Doctor, Staff, Admin)
  const [currentUser, setUser] = useState<UserProfile | null>(() => getCurrentUser());

  // Current view: 'home' | 'tracker' | 'dashboard' (Persisted across refreshes)
  const [currentView, setCurrentView] = useState<'home' | 'tracker' | 'dashboard'>(() => {
    if (typeof window === 'undefined') return 'home';

    const hash = window.location.hash.toLowerCase().replace('#', '');
    if (hash === 'tracker') return 'tracker';

    const dashboardTabs = ['queue', 'inventory', 'billing', 'ai', 'ai-consultant', 'team', 'dashboard'];
    const user = getCurrentUser();

    if (dashboardTabs.includes(hash)) {
      return user ? 'dashboard' : 'home';
    }

    const savedView = sessionStorage.getItem('hhc_current_view');
    if (savedView === 'tracker') return 'tracker';
    if (savedView === 'dashboard' && user) return 'dashboard';
    if (savedView === 'home') return 'home';

    // If authenticated user is present, stay in dashboard by default on refresh
    if (user) return 'dashboard';

    return 'home';
  });

  // Login Modal
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  // Live Queue Tracker Modal
  const [isTrackerModalOpen, setIsTrackerModalOpen] = useState(false);

  // Persist currentView to sessionStorage & sync hash
  useEffect(() => {
    sessionStorage.setItem('hhc_current_view', currentView);

    if (currentView === 'home') {
      if (window.location.hash && window.location.hash !== '#home') {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    } else if (currentView === 'tracker') {
      if (window.location.hash !== '#tracker') {
        window.history.replaceState(null, '', '#tracker');
      }
    } else if (currentView === 'dashboard') {
      const hash = window.location.hash.toLowerCase().replace('#', '');
      const dashboardTabs = ['queue', 'inventory', 'billing', 'ai', 'ai-consultant', 'team'];
      if (!dashboardTabs.includes(hash)) {
        const savedTab = sessionStorage.getItem('hhc_active_tab') || 'queue';
        const hashTarget = savedTab === 'ai' ? 'ai-consultant' : savedTab;
        window.history.replaceState(null, '', `#${hashTarget}`);
      }
    }
  }, [currentView]);

  // Sync hash changes (e.g. browser forward/backward buttons)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase().replace('#', '');
      if (hash === 'tracker') {
        setCurrentView('tracker');
      } else if (hash === 'home' || hash === '') {
        const savedView = sessionStorage.getItem('hhc_current_view');
        if (savedView === 'home') {
          setCurrentView('home');
        }
      } else {
        const dashboardTabs = ['queue', 'inventory', 'billing', 'ai', 'ai-consultant', 'team', 'dashboard'];
        if (dashboardTabs.includes(hash) && currentUser) {
          setCurrentView('dashboard');
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentUser]);

  // Sync dark mode class on document.documentElement
  useEffect(() => {
    localStorage.setItem('homoeo_dark_mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Initialize Supabase realtime listeners & cross-tab sync
  useEffect(() => {
    const cleanup = initSupabaseSync();
    // Run auto-cancel check on mount and every 5 minutes
    autoCancelExpiredAppointments().catch((err) =>
      console.warn('Auto cancel initial check warning:', err)
    );
    const interval = setInterval(() => {
      autoCancelExpiredAppointments().catch((err) =>
        console.warn('Auto cancel interval check warning:', err)
      );
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
      if (cleanup) cleanup();
    };
  }, []);

  // Periodic and on-mount verification of active account status against Supabase clinic_team
  useEffect(() => {
    if (!currentUser) return;

    const verifyActiveStatus = async () => {
      try {
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from('clinic_team')
          .select('is_active')
          .eq('id', currentUser.id)
          .maybeSingle();

        if (data && data.is_active === false) {
          handleLogout();
          alert('This account has been deactivated by Admin. Access denied.');
        }
      } catch {
        // Silently continue if network check is unavailable
      }
    };

    verifyActiveStatus();
  }, [currentUser]);

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setUser(user);
    sessionStorage.setItem('hhc_current_view', 'dashboard');
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUser(null);
    sessionStorage.removeItem('hhc_current_view');
    sessionStorage.removeItem('hhc_active_tab');
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen bg-[#FAF7EE] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Navigation Bar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenTracker={() => setIsTrackerModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8">
        {currentView === 'home' && (
          <PublicHome onOpenTracker={() => setIsTrackerModalOpen(true)} />
        )}

        {currentView === 'tracker' && (
          <LiveTracker onBackHome={() => setCurrentView('home')} />
        )}

        {currentView === 'dashboard' && (
          currentUser ? (
            <Dashboard
              currentUser={currentUser}
              onLogout={handleLogout}
              onReturnToHome={() => setCurrentView('home')}
            />
          ) : (
            <div className="p-12 text-center space-y-4 max-w-md mx-auto">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Authorized Access Required
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Patients cannot log in. Please authenticate with a Doctor, Staff, or Admin account to access the clinic chamber and inventory.
              </p>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-6 py-3 rounded-xl bg-[#1B4332] text-white font-bold text-xs shadow-md"
              >
                Open Staff Login
              </button>
            </div>
          )
        )}
      </main>

      {/* Live Queue & Token Tracker Modal */}
      <LiveTrackerModal
        isOpen={isTrackerModalOpen}
        onClose={() => setIsTrackerModalOpen(false)}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Footer with Mandatory Attribution & Timings */}
      <Footer
        onOpenBooking={() => setCurrentView('home')}
        onOpenTracker={() => setIsTrackerModalOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />
    </div>
  );
}
