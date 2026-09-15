export type UserRole = 'admin' | 'doctor' | 'staff';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  created_at?: string;
}

export type ShiftType = 'morning' | 'evening';

export type AppointmentStatus = 'pending' | 'in_consult' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  token_number: string; // e.g. TK-20260915-MORN-001
  patient_id?: string;   // e.g. PAT-1042
  patient_name: string;
  age?: number;
  phone: string;
  address: string;
  booking_date: string; // YYYY-MM-DD
  shift: ShiftType;
  queue_position?: number;
  queue_number?: number;
  status: AppointmentStatus;
  symptoms?: string;
  symptoms_summary?: string;
  doctor_notes?: string;
  consultation_notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface Prescription {
  id: string;
  appointment_id?: string;
  patient_id: string;
  patient_name: string;
  phone: string;
  doctor_name: string;
  prescription_image_url?: string; // base64 or Supabase storage url
  clinical_diagnosis: string;
  repertory_symptoms?: string;
  prescription_notes?: string;
  created_at: string;
}

export interface InvoiceItem {
  id: string;
  item_description: string; // 2-column manual billing: Item Description
  price: number; // Amount / Price (₹)
  inventory_id?: string;
  medicine_name?: string;
  potency?: string;
  quantity?: number;
  unit_price?: number;
  total_price?: number;
}

export type PaymentMode = 'cash' | 'upi' | 'card' | 'unpaid';
export type PaymentStatus = 'paid' | 'pending' | 'waived';

export interface Invoice {
  id: string;
  invoice_number: string; // e.g. INV-2026-0042
  appointment_id?: string;
  patient_id: string;
  patient_name: string;
  phone: string;
  consultation_fee: number;
  subtotal: number;
  discount: number;
  tax: number;
  total_amount: number;
  payment_mode: PaymentMode;
  payment_status: PaymentStatus;
  items: InvoiceItem[];
  gstin?: string;
  created_at: string;
}

export type MedicineCategory = 
  | 'Dilution'
  | 'Mother Tincture (Q)'
  | 'Biochemic / Bio-combination'
  | 'Trituration'
  | 'Patent / Syrups / Drops'
  | 'dilution'
  | 'mother_tincture'
  | 'biochemic'
  | 'trituration'
  | 'patent';

export type StorageLocation = 'Clinic Dispensing Shelf' | 'Godown / Storage Room' | 'clinic_shelf' | 'godown';
export type StorageLocationType = StorageLocation;

export interface InventoryItem {
  id: string;
  medicine_name: string;
  category: MedicineCategory;
  potency: string; // Q, 30, 200, 1M, 10M, 3X, 6X, 12X, etc.
  bottle_size: string; // 30 ml, 100 ml, 450/500 ml, 10g, 25g, 100g, 450g
  rack_location: string; // e.g. 'Rack A-12'
  company: string; // e.g. 'SBL', 'Schwabe India', 'Dr. Reckeweg'
  distributor: string;
  mfg_date?: string;
  expiry_date?: string;
  mrp: number;
  purchase_cost: number;
  stock_quantity: number;
  low_stock_threshold: number; // default 5
  storage_location: StorageLocation;
  updated_at: string;
}

export type StockLogType = 'dispense' | 'restock' | 'transfer' | 'adjustment';

export interface StockLog {
  id: string;
  inventory_id: string;
  medicine_name: string;
  type: StockLogType;
  action_type?: string;
  quantity_changed: number;
  quantity_change?: number;
  previous_quantity: number;
  new_quantity: number;
  source_location?: string;
  destination_location?: string;
  reason?: string;
  performed_by: string;
  timestamp: string;
  created_at?: string;
}

export interface RemedySuggestion {
  remedy_name: string;
  common_name?: string;
  potency: string;
  dosage: string;
  key_indications: string[];
  materia_medica_notes: string;
  modalities: {
    worse: string;
    better: string;
  };
}

export interface AIConsultResult {
  analysis_summary: string;
  remedies: RemedySuggestion[];
  repertory_keynotes: string[];
  diet_and_regimen: string;
  warning_notes?: string;
}

export type AIConsultationResponse = AIConsultResult;
export type AIRemedyRecommendation = RemedySuggestion;
