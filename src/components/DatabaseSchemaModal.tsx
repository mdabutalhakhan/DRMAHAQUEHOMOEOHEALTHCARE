import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Copy, 
  Check, 
  ExternalLink, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  Key, 
  Server
} from 'lucide-react';
import { getSupabaseConfig, saveSupabaseConfig, testSupabaseConnection } from '../services/supabase';

interface DatabaseSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FULL_SQL_SCHEMA = `-- ==============================================================================
-- HOMOEO HEALTH CARE - COMPLETE SUPABASE POSTGRESQL PRODUCTION DATABASE SCHEMA
-- Dr. M. A. Haque, M.D. (Homoeo) • Salbagan Road, Benachity, Durgapur, PIN: 713213
-- Designed & Built with Row Level Security (RLS) & Storage Buckets
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USER ROLES ENUM
CREATE TYPE user_role AS ENUM ('admin', 'doctor', 'staff');

-- 3. PROFILES TABLE (Linked with Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'staff',
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token_number TEXT NOT NULL,
    patient_id TEXT NOT NULL,
    patient_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    booking_date DATE NOT NULL,
    shift TEXT NOT NULL CHECK (shift IN ('morning', 'evening')),
    queue_position INT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_consult', 'completed', 'cancelled')),
    symptoms_summary TEXT,
    consultation_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. PRESCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    patient_id TEXT NOT NULL,
    patient_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    doctor_name TEXT NOT NULL DEFAULT 'Dr. M. A. Haque, M.D. (Homoeo)',
    clinical_diagnosis TEXT NOT NULL,
    repertory_symptoms TEXT,
    prescription_notes TEXT,
    prescription_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. INVOICES TABLE
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number TEXT UNIQUE NOT NULL,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    patient_id TEXT NOT NULL,
    patient_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    consultation_fee NUMERIC(10,2) NOT NULL DEFAULT 200.00,
    subtotal NUMERIC(10,2) NOT NULL,
    discount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    tax NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(10,2) NOT NULL,
    payment_mode TEXT NOT NULL CHECK (payment_mode IN ('cash', 'upi', 'card')),
    payment_status TEXT NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('paid', 'pending')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. INVOICE ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
    inventory_id UUID,
    medicine_name TEXT NOT NULL,
    potency TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(10,2) NOT NULL,
    total_price NUMERIC(10,2) NOT NULL
);

-- 8. INVENTORY TABLE
CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    medicine_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('dilution', 'mother_tincture', 'biochemic', 'trituration', 'patent')),
    potency TEXT NOT NULL,
    bottle_size TEXT NOT NULL,
    rack_location TEXT NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    low_stock_threshold INT NOT NULL DEFAULT 5,
    mrp NUMERIC(10,2) NOT NULL,
    purchase_cost NUMERIC(10,2) NOT NULL DEFAULT 0,
    company TEXT NOT NULL,
    distributor TEXT,
    storage_location TEXT NOT NULL DEFAULT 'clinic_shelf' CHECK (storage_location IN ('clinic_shelf', 'godown')),
    mfg_date DATE,
    expiry_date DATE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. STOCK AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.stock_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventory_id UUID REFERENCES public.inventory(id) ON DELETE SET NULL,
    medicine_name TEXT NOT NULL,
    quantity_change INT NOT NULL,
    action_type TEXT NOT NULL CHECK (action_type IN ('dispense', 'transfer', 'restock', 'audit_correction')),
    from_location TEXT,
    to_location TEXT,
    reason TEXT NOT NULL,
    performed_by TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 10. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_logs ENABLE ROW LEVEL SECURITY;

-- 11. POLICIES: Public insert for patient appointments
CREATE POLICY "Public patients can create appointments"
    ON public.appointments FOR INSERT WITH CHECK (true);

CREATE POLICY "Public patients can view their appointment tokens"
    ON public.appointments FOR SELECT USING (true);

-- 12. POLICIES: Authenticated Clinic Staff / Doctors full CRUD
CREATE POLICY "Clinic Staff full access to appointments"
    ON public.appointments FOR ALL TO authenticated USING (true);

CREATE POLICY "Clinic Staff full access to prescriptions"
    ON public.prescriptions FOR ALL TO authenticated USING (true);

CREATE POLICY "Clinic Staff full access to billing"
    ON public.invoices FOR ALL TO authenticated USING (true);

CREATE POLICY "Clinic Staff full access to inventory"
    ON public.inventory FOR ALL TO authenticated USING (true);

CREATE POLICY "Clinic Staff full access to stock logs"
    ON public.stock_logs FOR ALL TO authenticated USING (true);

-- 13. STORAGE BUCKET FOR PRESCRIPTION IMAGES
INSERT INTO storage.buckets (id, name, public)
VALUES ('prescriptions', 'prescriptions', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access to Prescription Images"
    ON storage.objects FOR SELECT USING (bucket_id = 'prescriptions');

CREATE POLICY "Authenticated users can upload prescriptions"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'prescriptions');
`;

export const DatabaseSchemaModal: React.FC<DatabaseSchemaModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const currentCfg = getSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(currentCfg.url);
  const [anonKey, setAnonKey] = useState(currentCfg.anonKey);
  const [copied, setCopied] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [testing, setTesting] = useState(false);

  const handleCopySQL = () => {
    navigator.clipboard.writeText(FULL_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveAndTest = async () => {
    saveSupabaseConfig(supabaseUrl, anonKey);
    const clean = getSupabaseConfig();
    setSupabaseUrl(clean.url);
    setAnonKey(clean.anonKey);
    setTesting(true);
    const res = await testSupabaseConnection();
    setTestResult(res);
    setTesting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="w-full max-w-4xl my-6 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-950/10 dark:border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Supabase Database Architecture & Schema
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                PostgreSQL • Row Level Security (RLS) • Supabase Storage (`prescriptions`)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Credentials & Live Connection Tester */}
        <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-slate-800/80 border border-emerald-200 dark:border-slate-700 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
              <Server className="w-4 h-4" />
              <span>Connect Your Live Supabase Project</span>
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200 font-semibold">
              Client & Background Sync Ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Supabase Project URL
              </label>
              <input
                type="text"
                placeholder="https://your-project.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Supabase Anon / Public Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleSaveAndTest}
              disabled={testing}
              className="px-4 py-2 rounded-xl bg-[#1B4332] text-white text-xs font-bold hover:bg-[#2D6A4F] transition flex items-center gap-1.5"
            >
              <Key className="w-3.5 h-3.5" />
              <span>{testing ? 'Testing Connection...' : 'Save & Verify Connection'}</span>
            </button>

            {testResult && (
              <span className={`text-xs font-semibold ${testResult.success ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-600'}`}>
                {testResult.message}
              </span>
            )}
          </div>
        </div>

        {/* Database Schema SQL Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Supabase PostgreSQL SQL DDL Script
            </span>
            <button
              type="button"
              onClick={handleCopySQL}
              className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>SQL Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Full SQL</span>
                </>
              )}
            </button>
          </div>

          <div className="relative rounded-2xl bg-slate-950 p-4 font-mono text-xs text-emerald-300 overflow-x-auto max-h-72 border border-slate-800">
            <pre>{FULL_SQL_SCHEMA}</pre>
          </div>
          <p className="text-[11px] text-slate-500">
            Tip: You can paste this directly into the <strong>Supabase SQL Editor</strong> to create all 6 tables, storage bucket, and RLS policies at once.
          </p>
        </div>
      </div>
    </div>
  );
};
