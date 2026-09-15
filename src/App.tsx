import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PublicHome } from './components/PublicHome';
import { LiveTracker } from './components/LiveTracker';
import { Dashboard } from './components/Dashboard';
import { LoginModal } from './components/LoginModal';
import { UserProfile } from './types';
import { getCurrentUser, setCurrentUser } from './services/clinicStore';
import { initSupabaseSync } from './services/clinicStore';

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

  // Current view: 'home' | 'tracker' | 'dashboard'
  const [currentView, setCurrentView] = useState<'home' | 'tracker' | 'dashboard'>('home');

  // Login Modal
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  const handleLoginSuccess = (user: UserProfile) => {
    setUser(user);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUser(null);
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
      />

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8">
        {currentView === 'home' && (
          <PublicHome />
        )}

        {currentView === 'tracker' && (
          <LiveTracker />
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

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Footer with Mandatory Attribution & Timings */}
      <Footer
        onOpenBooking={() => setCurrentView('home')}
        onOpenTracker={() => setCurrentView('tracker')}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />
    </div>
  );
}
