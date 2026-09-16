import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Boxes, 
  Sparkles, 
  Receipt, 
  ShieldAlert, 
  Calendar, 
  Plus, 
  LogOut,
  Stethoscope,
  ChevronRight,
  HeartHandshake,
  Menu,
  X,
  FolderClock,
  Camera,
  TrendingUp
} from 'lucide-react';
import { Appointment, Invoice, UserProfile } from '../types';
import { QueueManager } from './QueueManager';
import { InventoryManager } from './InventoryManager';
import { AIConsultant } from './AIConsultant';
import { InvoiceGenerator } from './InvoiceGenerator';
import { ConsultationModal } from './ConsultationModal';
import { TeamManagement } from './TeamManagement';
import { PatientsHistory } from './PatientsHistory';
import { ChamberSettings } from './ChamberSettings';
import { SalesSummary } from './SalesSummary';

interface DashboardProps {
  currentUser: UserProfile;
  onLogout: () => void;
  onReturnToHome: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentUser,
  onLogout,
  onReturnToHome,
}) => {
  // Persist and restore active tab from URL hash or sessionStorage
  const [activeTab, setActiveTab] = useState<'queue' | 'inventory' | 'ai' | 'billing' | 'sales' | 'patients' | 'team' | 'settings'>(() => {
    if (typeof window === 'undefined') return 'queue';

    // 1. Check URL hash first
    const hash = window.location.hash.toLowerCase().replace('#', '');
    if (hash === 'inventory') return 'inventory';
    if (hash === 'billing') return 'billing';
    if (hash === 'sales' || hash === 'sales-summary' || hash === 'revenue') return 'sales';
    if (hash === 'patients' || hash === 'history' || hash === 'patients-history') return 'patients';
    if (hash === 'ai' || hash === 'ai-consultant') return 'ai';
    if (hash === 'team' && currentUser.role === 'admin') return 'team';
    if ((hash === 'settings' || hash === 'chamber-settings' || hash === 'doctor-profile') && currentUser.role === 'admin') return 'settings';
    if (hash === 'queue') return 'queue';

    // 2. Check sessionStorage
    const saved = sessionStorage.getItem('hhc_active_tab') as any;
    if (saved && ['queue', 'inventory', 'ai', 'billing', 'sales', 'patients', 'team', 'settings'].includes(saved)) {
      if ((saved === 'team' || saved === 'settings') && currentUser.role !== 'admin') {
        return 'queue';
      }
      return saved;
    }

    return 'queue';
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Sync activeTab to sessionStorage and URL hash
  useEffect(() => {
    sessionStorage.setItem('hhc_active_tab', activeTab);
    const hashVal = activeTab === 'ai' ? 'ai-consultant' : activeTab === 'sales' ? 'sales-summary' : activeTab;
    if (window.location.hash !== `#${hashVal}`) {
      window.history.replaceState(null, '', `#${hashVal}`);
    }
  }, [activeTab]);

  // Handle URL hash changes (browser back/forward navigation)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase().replace('#', '');
      if (hash === 'inventory') setActiveTab('inventory');
      else if (hash === 'billing') setActiveTab('billing');
      else if (hash === 'sales' || hash === 'sales-summary' || hash === 'revenue') setActiveTab('sales');
      else if (hash === 'patients' || hash === 'history' || hash === 'patients-history') setActiveTab('patients');
      else if (hash === 'ai' || hash === 'ai-consultant') setActiveTab('ai');
      else if (hash === 'team' && currentUser.role === 'admin') setActiveTab('team');
      else if ((hash === 'settings' || hash === 'chamber-settings' || hash === 'doctor-profile') && currentUser.role === 'admin') setActiveTab('settings');
      else if (hash === 'queue') setActiveTab('queue');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentUser.role]);
  
  // Consultation modal state
  const [activeConsultAppointment, setActiveConsultAppointment] = useState<Appointment | null>(null);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);

  // Billing pre-filled appointment state
  const [billingAppointment, setBillingAppointment] = useState<Appointment | null>(null);

  // AI Symptoms state passed from consultation
  const [aiInitialSymptoms, setAiInitialSymptoms] = useState('');

  const handleStartConsult = (appointment: Appointment) => {
    setActiveConsultAppointment(appointment);
    setIsConsultModalOpen(true);
  };

  const handleOpenBilling = (appointment: Appointment) => {
    setBillingAppointment(appointment);
    setActiveTab('billing');
  };

  const handleOpenAIFromConsult = (symptoms: string) => {
    setAiInitialSymptoms(symptoms);
    setIsConsultModalOpen(false);
    setActiveTab('ai');
  };

  const navigationItems = [
    {
      id: 'queue' as const,
      label: 'Queue & Chamber Manager',
      shortLabel: 'Queue',
      icon: Users,
      description: 'Live patient queue, tokens & consultations'
    },
    {
      id: 'patients' as const,
      label: 'Patients & History',
      shortLabel: 'Patients',
      icon: FolderClock,
      description: 'Patient directory, visits, dispensed remedies & invoice records'
    },
    {
      id: 'inventory' as const,
      label: 'Medicine Inventory',
      shortLabel: 'Inventory',
      icon: Boxes,
      description: 'Potency, dilutions, mother tinctures & stock alerts'
    },
    {
      id: 'ai' as const,
      label: 'AI Clinical Consultant (Gemini)',
      shortLabel: 'AI Consultant',
      icon: Sparkles,
      description: 'Repertory & materia medica repertorization'
    },
    {
      id: 'billing' as const,
      label: 'Invoice & Billing',
      shortLabel: 'Billing',
      icon: Receipt,
      description: '2-column manual billing & thermal POS receipt'
    },
    {
      id: 'sales' as const,
      label: 'Sales Summary & Analytics',
      shortLabel: 'Sales Summary',
      icon: TrendingUp,
      description: 'Revenue KPI metrics, shift collection & financial reports'
    },
    ...(currentUser.role === 'admin'
      ? [
          {
            id: 'team' as const,
            label: 'Staff & Doctor Team',
            shortLabel: 'Team',
            icon: ShieldAlert,
            description: 'Staff roles, doctor accounts & access control'
          },
          {
            id: 'settings' as const,
            label: 'Doctor Profile & Settings',
            shortLabel: 'Settings',
            icon: Camera,
            description: 'Doctor photo upload, chamber branding & storage assets'
          }
        ]
      : [])
  ];

  const currentNavItem = navigationItems.find((item) => item.id === activeTab) || navigationItems[0];

  return (
    <div className="space-y-6 pb-16">
      {/* Dashboard Sub-Header */}
      <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white shadow-xl shadow-emerald-950/15 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
        <div className="space-y-1 sm:space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-emerald-100">
              Chamber Control Center
            </span>
            <span className="text-xs text-emerald-200 hidden sm:inline">
              Dr. M. A. Haque Homoeo Health Care
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
            Welcome, {currentUser.full_name}
          </h1>
          <p className="text-[11px] sm:text-xs text-emerald-100/90 font-medium">
            Role: <span className="capitalize font-bold text-white">{currentUser.role}</span> • Salbagan Road, Benachity, Durgapur
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            id="btn-public-view"
            onClick={() => {
              sessionStorage.setItem('hhc_current_view', 'home');
              onReturnToHome();
            }}
            className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white text-[#1B4332] hover:bg-emerald-50 text-xs font-bold shadow-md transition cursor-pointer"
          >
            ← Public View
          </button>
        </div>
      </div>

      {/* TOP CONTROL BAR (Active Module & Quick Switcher) */}
      <div className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 shadow-xs">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="p-2 rounded-xl bg-emerald-50 dark:bg-slate-700/60 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 text-[#1B4332] dark:text-emerald-400 transition cursor-pointer"
            title="Open Drawer Menu"
          >
            <Menu className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider hidden sm:inline">
                Active Workspace:
              </span>
              <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <currentNavItem.icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{currentNavItem.label}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Compact Quick Switcher for Instant Navigation */}
        <div className="hidden md:flex items-center gap-1.5">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id === 'billing') setBillingAppointment(null);
                  setActiveTab(item.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                  isActive
                    ? 'bg-[#1B4332] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* OFF-CANVAS COLLAPSIBLE DRAWER / SIDEBAR */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex animate-fade-in">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer Sidebar */}
          <aside className="relative w-80 max-w-[85vw] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl z-50 h-[100dvh] max-h-[100dvh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="shrink-0 p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-emerald-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] text-white flex items-center justify-center font-bold shadow-xs">
                  <Stethoscope className="w-5 h-5 text-emerald-200" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                    Chamber Modules
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Dr. M. A. Haque, M.D. (Homoeo)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                aria-label="Close navigation drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 overscroll-contain">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 block mb-2">
                Chamber Operations
              </span>

              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`drawer-tab-${item.id}`}
                    type="button"
                    onClick={() => {
                      if (item.id === 'billing') setBillingAppointment(null);
                      setActiveTab(item.id);
                      setIsDrawerOpen(false);
                    }}
                    className={`w-full p-3 rounded-2xl text-left transition-all flex items-start gap-3 cursor-pointer ${
                      isActive
                        ? 'bg-[#1B4332] text-white shadow-md'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-emerald-50 dark:bg-slate-800 text-[#1B4332] dark:text-emerald-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs flex items-center justify-between">
                        <span>{item.label}</span>
                        {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-300" />}
                      </div>
                      <p
                        className={`text-[10px] mt-0.5 truncate ${
                          isActive ? 'text-emerald-100' : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer with Log Out Chamber pinned */}
            <div className="shrink-0 p-4 border-t border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-900 mb-6 space-y-2">
              <div className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                <span className="text-[10px] text-slate-400 block">Logged In Personnel</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">
                  {currentUser.full_name}
                </span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold uppercase">
                  {currentUser.role}
                </span>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="w-full py-2.5 px-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out Chamber</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ACTIVE WORKSPACE VIEW (100% VIEWPORT WIDTH) */}
      <div className="w-full">
        {activeTab === 'queue' && (
          <QueueManager
            currentUser={currentUser}
            onStartConsult={handleStartConsult}
            onOpenBilling={handleOpenBilling}
          />
        )}

        {activeTab === 'patients' && (
          <PatientsHistory
            currentUser={currentUser}
            onStartWalkInVisit={() => setActiveTab('queue')}
            onOpenBillingForPatient={(patient) => {
              setBillingAppointment({
                id: `walkin-${Date.now()}`,
                patient_name: patient.name,
                patient_phone: patient.phone,
                patient_id: patient.id,
                token_number: `TK-${Date.now().toString().slice(-4)}`,
                appointment_date: new Date().toISOString().split('T')[0],
                slot: 'walkin',
                status: 'in-consultation',
                symptoms: '',
                fee: 200,
                is_paid: false,
                created_at: new Date().toISOString(),
              });
              setActiveTab('billing');
            }}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryManager currentUser={currentUser} />
        )}

        {activeTab === 'ai' && (
          <AIConsultant
            initialSymptoms={aiInitialSymptoms}
            onAddRemedyToBilling={(remedy) => {
              setActiveTab('billing');
            }}
            onNavigateToInventory={() => {
              setActiveTab('inventory');
            }}
          />
        )}

        {activeTab === 'billing' && (
          <InvoiceGenerator
            initialAppointment={billingAppointment}
            onBackToDashboard={() => setActiveTab('queue')}
          />
        )}

        {activeTab === 'sales' && (
          <SalesSummary
            currentUser={currentUser}
          />
        )}

        {activeTab === 'team' && (
          <TeamManagement currentUser={currentUser} />
        )}

        {activeTab === 'settings' && currentUser.role === 'admin' && (
          <ChamberSettings currentUser={currentUser} />
        )}
      </div>

      {/* Consultation Modal */}
      {isConsultModalOpen && (
        <ConsultationModal
          isOpen={isConsultModalOpen}
          onClose={() => setIsConsultModalOpen(false)}
          appointment={activeConsultAppointment}
          onOpenInvoiceForPatient={(apt) => {
            setIsConsultModalOpen(false);
            handleOpenBilling(apt);
          }}
          onOpenAIConsultant={handleOpenAIFromConsult}
        />
      )}
    </div>
  );
};
