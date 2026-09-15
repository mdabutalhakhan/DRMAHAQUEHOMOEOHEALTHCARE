import React, { useState } from 'react';
import { 
  Users, 
  Boxes, 
  Sparkles, 
  Receipt, 
  Database, 
  ShieldAlert, 
  Calendar, 
  Plus, 
  LogOut,
  Stethoscope,
  ChevronRight,
  HeartHandshake
} from 'lucide-react';
import { Appointment, Invoice, UserProfile } from '../types';
import { QueueManager } from './QueueManager';
import { InventoryManager } from './InventoryManager';
import { AIConsultant } from './AIConsultant';
import { InvoiceGenerator } from './InvoiceGenerator';
import { ConsultationModal } from './ConsultationModal';
import { DatabaseSchemaModal } from './DatabaseSchemaModal';
import { TeamManagement } from './TeamManagement';

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
  const [activeTab, setActiveTab] = useState<'queue' | 'inventory' | 'ai' | 'billing' | 'team'>('queue');
  
  // Consultation modal state
  const [activeConsultAppointment, setActiveConsultAppointment] = useState<Appointment | null>(null);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);

  // Billing pre-filled appointment state
  const [billingAppointment, setBillingAppointment] = useState<Appointment | null>(null);

  // AI Symptoms state passed from consultation
  const [aiInitialSymptoms, setAiInitialSymptoms] = useState('');

  // Supabase Schema modal
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);

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

  return (
    <div className="space-y-8 pb-16">
      {/* Dashboard Sub-Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white shadow-xl shadow-emerald-950/15 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-emerald-100">
              Chamber Control Center
            </span>
            <span className="text-xs text-emerald-200">
              Dr. M. A. Haque Homoeo Health Care
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {currentUser.full_name}
          </h1>
          <p className="text-xs text-emerald-100/90 font-medium">
            Role: <span className="capitalize font-bold text-white">{currentUser.role}</span> • Salbagan Road, Benachity, Durgapur
          </p>
        </div>

        {/* Action badges & Database modal trigger */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsSchemaModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-600/40 text-xs font-bold flex items-center gap-2 shadow-sm transition"
          >
            <Database className="w-4 h-4 text-emerald-300" />
            <span>Supabase Architecture</span>
          </button>

          <button
            onClick={onReturnToHome}
            className="px-4 py-2.5 rounded-xl bg-white text-[#1B4332] hover:bg-emerald-50 text-xs font-bold shadow-md transition"
          >
            ← Public Booking View
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        <button
          id="tab-queue"
          onClick={() => setActiveTab('queue')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'queue'
              ? 'bg-[#1B4332] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Queue & Chamber Manager</span>
        </button>

        <button
          id="tab-inventory"
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'inventory'
              ? 'bg-[#1B4332] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Medicine Inventory</span>
        </button>

        <button
          id="tab-ai"
          onClick={() => setActiveTab('ai')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'ai'
              ? 'bg-[#1B4332] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span>AI Clinical Consultant (Gemini)</span>
        </button>

        <button
          id="tab-billing"
          onClick={() => {
            setBillingAppointment(null);
            setActiveTab('billing');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'billing'
              ? 'bg-[#1B4332] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Invoice & Billing</span>
        </button>

        {currentUser.role === 'admin' && (
          <button
            id="tab-team"
            onClick={() => setActiveTab('team')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'team'
                ? 'bg-[#1B4332] text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Staff & Doctor Team</span>
          </button>
        )}
      </div>

      {/* TAB CONTENT VIEWS */}
      <div>
        {activeTab === 'queue' && (
          <QueueManager
            currentUser={currentUser}
            onStartConsult={handleStartConsult}
            onOpenBilling={handleOpenBilling}
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
          />
        )}

        {activeTab === 'billing' && (
          <InvoiceGenerator
            initialAppointment={billingAppointment}
            onBackToDashboard={() => setActiveTab('queue')}
          />
        )}

        {activeTab === 'team' && (
          <TeamManagement currentUser={currentUser} />
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

      {/* Supabase Schema Modal */}
      {isSchemaModalOpen && (
        <DatabaseSchemaModal
          isOpen={isSchemaModalOpen}
          onClose={() => setIsSchemaModalOpen(false)}
        />
      )}
    </div>
  );
};
