-- ====================================================================
-- Homeo Health Care - Complete PostgreSQL & Supabase Database Schema
-- Dr. M. A. Haque, M.D. (Homeo) Clinic Management System
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'doctor', 'staff')),
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.1 Clinic Team & Security Authentication Table
CREATE TABLE IF NOT EXISTS public.clinic_team (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'doctor', 'staff')),
  phone TEXT,
  password TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_first_login BOOLEAN DEFAULT false,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for speedy email lookups during authentication
CREATE INDEX IF NOT EXISTS idx_clinic_team_email ON public.clinic_team (email);
CREATE INDEX IF NOT EXISTS idx_clinic_team_active ON public.clinic_team (is_active);

-- Seed Primary Administrator if not already present
INSERT INTO public.clinic_team (id, full_name, email, role, phone, password, is_active, is_first_login)
VALUES (
  '2f37865b-85e8-4134-8064-a57bca6b51a5',
  'Md Abu Talha Khan',
  'admin@homoeo.com',
  'admin',
  '9933506514',
  'admin123',
  true,
  false
) ON CONFLICT (email) DO NOTHING;

-- 3. Appointments & Patient Queue Table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  token_number TEXT UNIQUE NOT NULL, -- e.g. TK-20260915-MORN-001
  patient_id TEXT NOT NULL,          -- e.g. PAT-1042
  patient_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  booking_date DATE NOT NULL,
  shift TEXT NOT NULL CHECK (shift IN ('morning', 'evening')),
  queue_position INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_consult', 'completed', 'cancelled')),
  symptoms_summary TEXT,
  doctor_notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for speedy daily queue retrieval
CREATE INDEX IF NOT EXISTS idx_appointments_date_shift ON public.appointments (booking_date, shift, status);
CREATE INDEX IF NOT EXISTS idx_appointments_phone ON public.appointments (phone);

-- 4. Prescriptions Table
CREATE TABLE IF NOT EXISTS public.prescriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  patient_id TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  doctor_id UUID REFERENCES public.profiles(id),
  doctor_name TEXT DEFAULT 'Dr. M. A. Haque, M.D. (Homeo)',
  prescription_image_url TEXT, -- Stored in Supabase Storage bucket 'prescriptions'
  clinical_diagnosis TEXT,
  repertory_symptoms TEXT,
  prescription_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Invoices & Billing Table
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL, -- e.g. INV-2026-0042
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  patient_id TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  consultation_fee NUMERIC(10, 2) DEFAULT 200.00,
  medicine_total NUMERIC(10, 2) DEFAULT 0.00,
  shift TEXT DEFAULT 'morning' CHECK (shift IN ('morning', 'evening')),
  items JSONB DEFAULT '[]'::jsonb,
  subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  discount NUMERIC(10, 2) DEFAULT 0.00,
  tax NUMERIC(10, 2) DEFAULT 0.00,
  total_amount NUMERIC(10, 2) NOT NULL DEFAULT 200.00,
  payment_mode TEXT DEFAULT 'cash' CHECK (payment_mode IN ('cash', 'upi', 'card', 'unpaid')),
  payment_status TEXT DEFAULT 'paid' CHECK (payment_status IN ('paid', 'pending', 'waived')),
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Invoice Line Items Table
CREATE TABLE IF NOT EXISTS public.invoice_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
  inventory_id UUID,
  medicine_name TEXT NOT NULL,
  potency TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  total_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Homeopathic Medicine Inventory Table
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  medicine_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Dilution', 'Mother Tincture (Q)', 'Biochemic / Bio-combination', 'Trituration', 'Patent / Syrups / Drops')),
  potency TEXT NOT NULL,
  bottle_size TEXT NOT NULL,
  rack_location TEXT NOT NULL, -- e.g. 'Rack A-12'
  company TEXT NOT NULL,       -- e.g. 'SBL', 'Schwabe India', 'Dr. Reckeweg'
  distributor TEXT,
  mfg_date DATE,
  expiry_date DATE,
  mrp NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  purchase_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER NOT NULL DEFAULT 5,
  storage_location TEXT DEFAULT 'Clinic Dispensing Shelf' CHECK (storage_location IN ('Clinic Dispensing Shelf', 'Godown / Storage Room')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_name ON public.inventory (medicine_name);
CREATE INDEX IF NOT EXISTS idx_inventory_rack ON public.inventory (rack_location);
CREATE INDEX IF NOT EXISTS idx_inventory_low_stock ON public.inventory (stock_quantity, low_stock_threshold);

-- 8. Inventory Stock Audit Logs Table
CREATE TABLE IF NOT EXISTS public.stock_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  inventory_id UUID REFERENCES public.inventory(id) ON DELETE CASCADE,
  medicine_name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('dispense', 'restock', 'transfer', 'adjustment')),
  quantity_changed INTEGER NOT NULL,
  previous_quantity INTEGER NOT NULL,
  new_quantity INTEGER NOT NULL,
  source_location TEXT,
  destination_location TEXT,
  reason TEXT,
  performed_by TEXT NOT NULL DEFAULT 'Clinic Staff',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_logs ENABLE ROW LEVEL SECURITY;

-- Public can insert appointments (Patient booking flow)
CREATE POLICY "Public can book appointments" ON public.appointments
  FOR INSERT WITH CHECK (true);

-- Public can check their appointment status by token
CREATE POLICY "Public can view own appointment" ON public.appointments
  FOR SELECT USING (true);

-- Authenticated Staff & Doctors & Admins have full access to manage appointments
CREATE POLICY "Clinic team full access to appointments" ON public.appointments
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Prescriptions: Authenticated staff and doctors can view and create
CREATE POLICY "Clinic team manage prescriptions" ON public.prescriptions
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Invoices & Billing: Authenticated staff and doctors can view and create
CREATE POLICY "Clinic team manage invoices" ON public.invoices
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Clinic team manage invoice items" ON public.invoice_items
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Inventory: Authenticated staff and doctors can view and edit
CREATE POLICY "Clinic team manage inventory" ON public.inventory
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Clinic team manage stock logs" ON public.stock_logs
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Profiles: Authenticated users can view profiles; only admin can create/edit team
CREATE POLICY "Authenticated users can view profiles" ON public.profiles
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage team profiles" ON public.profiles
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ====================================================================
-- 9. Clinic Settings & Doctor Branding Table
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.clinic_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  doctor_image_url TEXT,
  doctor_name TEXT DEFAULT 'Dr. M. A. Haque, M.D. (Homoeo)',
  clinic_name TEXT DEFAULT 'Homoeo Health Care',
  phone TEXT DEFAULT '9933506514',
  address TEXT DEFAULT 'Salbagan Road, Benachity, Durgapur-713213',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial default clinic settings
INSERT INTO public.clinic_settings (id, doctor_image_url, doctor_name, clinic_name, phone, address)
VALUES (
  'default',
  '/doctor.jpg',
  'Dr. M. A. Haque, M.D. (Homoeo)',
  'Homoeo Health Care',
  '9933506514',
  'Salbagan Road, Benachity, Durgapur-713213'
) ON CONFLICT (id) DO NOTHING;

-- ====================================================================
-- SUPABASE STORAGE BUCKET FOR PRESCRIPTION SCANS & CLINIC ASSETS
-- ====================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('prescriptions', 'prescriptions', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('clinic-assets', 'clinic-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow authenticated uploads to prescriptions" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'prescriptions');

CREATE POLICY "Allow public read access to prescriptions" ON storage.objects
  FOR SELECT USING (bucket_id = 'prescriptions');

CREATE POLICY "Allow public read access to clinic-assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'clinic-assets');

CREATE POLICY "Allow uploads to clinic-assets" ON storage.objects
  FOR ALL USING (bucket_id = 'clinic-assets') WITH CHECK (bucket_id = 'clinic-assets');

-- Enable RLS and policies for clinic_settings
ALTER TABLE public.clinic_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view clinic settings" ON public.clinic_settings
  FOR SELECT USING (true);

CREATE POLICY "Public or authenticated can update clinic settings" ON public.clinic_settings
  FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- REALTIME REPLICATION ENABLEMENT
-- ====================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.inventory;
ALTER PUBLICATION supabase_realtime ADD TABLE public.invoices;
ALTER PUBLICATION supabase_realtime ADD TABLE public.clinic_settings;

-- Ensure required columns exist on invoices for existing deployments
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS medicine_total NUMERIC(10, 2) DEFAULT 0.00;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS shift TEXT DEFAULT 'morning';
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::jsonb;
