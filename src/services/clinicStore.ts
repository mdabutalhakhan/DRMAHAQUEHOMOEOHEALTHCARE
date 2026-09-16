import { 
  Appointment, 
  AppointmentStatus, 
  InventoryItem, 
  Invoice, 
  InvoiceItem, 
  Prescription, 
  ShiftType, 
  StockLog, 
  UserProfile,
  UserRole 
} from '../types';
import { INITIAL_INVENTORY, INITIAL_PROFILES } from './seedData';
import { getSupabase } from './supabase';

const INVENTORY_KEY = 'hhc_inventory_v1';
const PRESCRIPTIONS_KEY = 'hhc_prescriptions_v1';
const STOCK_LOGS_KEY = 'hhc_stock_logs_v1';
const PROFILES_KEY = 'hhc_profiles_v1';
const CURRENT_USER_KEY = 'hhc_current_user_v1';

// In-Memory Live Stores for direct Supabase state (Zero localStorage usage for Appointments & Invoices)
let inMemoryAppointments: Appointment[] = [];
let inMemoryInvoices: Invoice[] = [];

// BroadcastChannel for instant multi-tab & multi-window synchronization
let channel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    channel = new BroadcastChannel('hhc_realtime_sync');
  } catch (e) {
    console.warn('BroadcastChannel not available', e);
  }
}

export function notifySubscribers(type: string, data?: any) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('hhc_store_change', { detail: { type, data } }));
    if (channel) {
      channel.postMessage({ type, data, timestamp: Date.now() });
    }
  }
}

export function subscribeToStore(callback: (event: { type: string; data?: any }) => void) {
  if (typeof window === 'undefined') return () => {};

  const handleCustomEvent = (e: Event) => {
    const custom = e as CustomEvent;
    callback(custom.detail);
  };

  const handleChannelMessage = (e: MessageEvent) => {
    callback(e.data);
  };

  window.addEventListener('hhc_store_change', handleCustomEvent);
  if (channel) {
    channel.addEventListener('message', handleChannelMessage);
  }

  return () => {
    window.removeEventListener('hhc_store_change', handleCustomEvent);
    if (channel) {
      channel.removeEventListener('message', handleChannelMessage);
    }
  };
}

// Helper to derive sequential queue position dynamically from trailing digits of token_number
export const parseQueueNumberFromTokenOrRow = (row: any): number => {
  if (row?.token_number) {
    const match = String(row.token_number).match(/(\d+)$/);
    if (match && match[1]) {
      const parsed = parseInt(match[1], 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
  }
  if (row?.queue_position && Number(row.queue_position) > 0) return Number(row.queue_position);
  if (row?.queue_number && Number(row.queue_number) > 0) return Number(row.queue_number);
  return 1;
};

/**
 * Directly fetches appointments from Supabase table ordered by created_at ascending.
 */
export async function fetchAppointmentsFromSupabase(): Promise<Appointment[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Failed to fetch appointments from Supabase:', error);
    throw new Error(`Supabase query failed: ${error.message}`);
  }

  const list: Appointment[] = (data || []).map((row: any) => ({
    id: row.id,
    token_number: row.token_number,
    patient_id: row.patient_id || `PAT-${(row.phone || '1000').slice(-4)}`,
    patient_name: row.patient_name,
    age: row.age ? Number(row.age) : undefined,
    phone: row.phone,
    address: row.address,
    booking_date: row.booking_date,
    shift: row.shift,
    queue_position: parseQueueNumberFromTokenOrRow(row),
    status: row.status,
    symptoms: row.symptoms,
    symptoms_summary: row.symptoms || row.symptoms_summary,
    doctor_notes: row.doctor_notes || row.consultation_notes,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));

  inMemoryAppointments = list;
  notifySubscribers('appointments', inMemoryAppointments);
  return list;
}

/**
 * Directly fetches invoices from Supabase table ordered by created_at descending.
 */
export async function fetchInvoicesFromSupabase(): Promise<Invoice[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch invoices from Supabase:', error);
    throw new Error(`Supabase invoices query failed: ${error.message}`);
  }

  const list: Invoice[] = (data || []).map((row: any) => {
    const consFee = row.consultation_fee !== undefined && row.consultation_fee !== null ? Number(row.consultation_fee) : 200;
    const totAmount = Number(row.total_amount) || 0;
    const medTotal = row.medicine_total !== undefined && row.medicine_total !== null
      ? Number(row.medicine_total)
      : Math.max(0, totAmount - consFee);
    
    const createdDate = new Date(row.created_at || Date.now());
    const hour = createdDate.getHours();
    const shift: ShiftType = row.shift === 'evening' || row.shift === 'morning' 
      ? row.shift 
      : (hour < 14 ? 'morning' : 'evening');

    return {
      id: row.id,
      invoice_number: row.invoice_number,
      appointment_id: row.appointment_id,
      patient_id: row.patient_uid || row.patient_id || 'PAT-1001',
      patient_name: row.patient_name,
      phone: row.phone || '',
      consultation_fee: consFee,
      medicine_total: medTotal,
      shift,
      subtotal: Number(row.subtotal) || (totAmount + Number(row.discount || 0)),
      discount: Number(row.discount) || 0,
      tax: Number(row.tax) || 0,
      total_amount: totAmount,
      payment_mode: (row.payment_mode || 'cash').toLowerCase() as any,
      payment_status: (row.payment_status || 'paid') as any,
      items: Array.isArray(row.items) ? row.items : [],
      prescription_url: row.prescription_url || undefined,
      created_at: row.created_at || new Date().toISOString(),
    };
  });

  inMemoryInvoices = list;
  notifySubscribers('invoices', inMemoryInvoices);
  return list;
}

/**
 * Initializes global Supabase Realtime synchronization across all tabs and devices.
 */
export function initSupabaseSync(): () => void {
  const supabase = getSupabase();

  // Initial fetch from live Supabase tables
  fetchAppointmentsFromSupabase().catch((err) => {
    console.warn('[Supabase Sync] Initial appointments fetch notice:', err.message);
  });
  fetchInvoicesFromSupabase().catch((err) => {
    console.warn('[Supabase Sync] Initial invoices fetch notice:', err.message);
  });

  // Refetch on window focus
  const handleFocus = () => {
    fetchAppointmentsFromSupabase().catch(() => {});
    fetchInvoicesFromSupabase().catch(() => {});
  };
  window.addEventListener('focus', handleFocus);
  window.addEventListener('visibilitychange', handleFocus);

  // Cross-device Realtime channel subscription via postgres_changes on appointments
  let realtimeChannel: any = null;
  try {
    realtimeChannel = supabase
      .channel('supabase_realtime_appointments_sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        (payload) => {
          console.log('[Realtime] Supabase appointments change:', payload.eventType, payload.new);
          if (payload.eventType === 'INSERT' && payload.new) {
            const row = payload.new as any;
            const newApt: Appointment = {
              id: row.id,
              token_number: row.token_number,
              patient_id: row.patient_id || `PAT-${(row.phone || '1000').slice(-4)}`,
              patient_name: row.patient_name,
              age: row.age ? Number(row.age) : undefined,
              phone: row.phone,
              address: row.address,
              booking_date: row.booking_date,
              shift: row.shift,
              queue_position: parseQueueNumberFromTokenOrRow(row),
              status: row.status,
              symptoms: row.symptoms,
              symptoms_summary: row.symptoms || row.symptoms_summary,
              doctor_notes: row.doctor_notes,
              created_at: row.created_at,
              updated_at: row.updated_at,
            };
            if (!inMemoryAppointments.some((a) => a.id === newApt.id || a.token_number === newApt.token_number)) {
              inMemoryAppointments = [...inMemoryAppointments, newApt];
              notifySubscribers('appointments', inMemoryAppointments);
            }
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            const row = payload.new as any;
            inMemoryAppointments = inMemoryAppointments.map((a) =>
              a.id === row.id || a.token_number === row.token_number
                ? {
                    ...a,
                    ...row,
                    symptoms_summary: row.symptoms || a.symptoms_summary,
                  }
                : a
            );
            notifySubscribers('appointments', inMemoryAppointments);
          } else if (payload.eventType === 'DELETE' && payload.old) {
            const oldId = (payload.old as any)?.id;
            if (oldId) {
              inMemoryAppointments = inMemoryAppointments.filter((a) => a.id !== oldId);
              notifySubscribers('appointments', inMemoryAppointments);
            }
          } else {
            fetchAppointmentsFromSupabase().catch(() => {});
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'invoices' },
        (payload) => {
          console.log('[Realtime] Supabase invoices change event:', payload.eventType);
          fetchInvoicesFromSupabase().catch((err) => {
            console.warn('[Realtime] Auto-refetch invoices note:', err.message);
          });
        }
      )
      .subscribe((status) => {
        console.log('[Realtime] Channel status:', status);
      });
  } catch (err) {
    console.warn('[Realtime] Failed to initialize Supabase channel:', err);
  }

  return () => {
    window.removeEventListener('focus', handleFocus);
    window.removeEventListener('visibilitychange', handleFocus);
    if (supabase && realtimeChannel) {
      supabase.removeChannel(realtimeChannel);
    }
  };
}

export async function refreshInvoices(): Promise<Invoice[]> {
  try {
    return await fetchInvoicesFromSupabase();
  } catch (e) {
    console.warn('refreshInvoices error, returning memory cache:', e);
    return inMemoryInvoices;
  }
}

// ==========================================
// APPOINTMENTS & QUEUE MANAGEMENT (Direct Supabase)
// ==========================================

export function getAppointments(): Appointment[] {
  return inMemoryAppointments;
}

export function saveAppointments(appointments: Appointment[]) {
  inMemoryAppointments = appointments;
  notifySubscribers('appointments', appointments);
}

export interface BookingInput {
  patient_name: string;
  age?: number;
  phone: string;
  address: string;
  booking_date: string; // YYYY-MM-DD
  shift: ShiftType;
  symptoms_summary?: string;
  symptoms?: string;
}

/**
 * DIRECT SUPABASE INSERTION:
 * Inserts directly into `appointments` in Supabase.
 * If Supabase returns an error, throws an explicit Error.
 * ZERO localStorage caching or silent fallback.
 */
export async function createAppointment(input: BookingInput): Promise<{ appointment: Appointment; queuePosition: number }> {
  // 1. Validate Friday clinic closed
  const dateObj = new Date(input.booking_date + 'T00:00:00');
  if (dateObj.getDay() === 5) { // 5 is Friday
    throw new Error('Clinic is closed on Fridays. Please select Saturday to Thursday.');
  }

  const supabase = getSupabase();

  // 2. Query live existing appointments directly from Supabase for accurate queue calculation
  const { data: slotRows, error: slotQueryErr } = await supabase
    .from('appointments')
    .select('id, token_number, status')
    .eq('booking_date', input.booking_date)
    .eq('shift', input.shift)
    .neq('status', 'cancelled');

  if (slotQueryErr) {
    console.error('Supabase slot query error:', slotQueryErr);
    throw new Error(`Database error querying existing appointments: ${slotQueryErr.message}`);
  }

  const queuePosition = (slotRows?.length || 0) + 1;
  const shiftPrefix = input.shift === 'morning' ? 'MORN' : 'EVE';
  const cleanDate = input.booking_date.replace(/-/g, '');
  const padIndex = String(queuePosition).padStart(3, '0');
  const token_number = `TK-${cleanDate}-${shiftPrefix}-${padIndex}`;

  // 3. Prepare payload matching exact requested Supabase schema:
  // [{ token_number, patient_name, age, phone, address, booking_date, shift, symptoms, status: 'pending' }]
  const symptomsVal = input.symptoms?.trim() || input.symptoms_summary?.trim() || null;
  const payload: Record<string, any> = {
    token_number,
    patient_name: input.patient_name.trim(),
    age: input.age ? Number(input.age) : null,
    phone: input.phone.trim(),
    address: input.address.trim(),
    booking_date: input.booking_date,
    shift: input.shift,
    symptoms: symptomsVal,
    status: 'pending',
  };

  // 4. Directly execute Supabase insert
  let { data, error } = await supabase
    .from('appointments')
    .insert([payload])
    .select();

  // If the remote table schema cache reports missing optional 'age' column, retry without age
  if (error && (error.code === 'PGRST204' || error.message?.includes('age'))) {
    console.warn('[Supabase Insert] Retrying insert without age column:', error.message);
    const { age: _unusedAge, ...withoutAge } = payload;
    const retryRes = await supabase.from('appointments').insert([withoutAge]).select();
    data = retryRes.data;
    error = retryRes.error;
  }

  // Explicit error checking — NO silent localStorage mock fallback
  if (error || !data || data.length === 0) {
    const msg = error?.message || 'Database error: Supabase returned no confirmed record.';
    console.error('[Supabase Error] Appointment booking failed:', error);
    throw new Error(`Supabase Database Error: ${msg}`);
  }

  const insertedRow = data[0] as any;
  const confirmedAppointment: Appointment = {
    id: insertedRow.id,
    token_number: insertedRow.token_number,
    patient_id: `PAT-${insertedRow.phone ? insertedRow.phone.slice(-4) : '1001'}`,
    patient_name: insertedRow.patient_name,
    age: insertedRow.age ? Number(insertedRow.age) : input.age,
    phone: insertedRow.phone,
    address: insertedRow.address,
    booking_date: insertedRow.booking_date,
    shift: insertedRow.shift,
    queue_position: queuePosition,
    status: insertedRow.status || 'pending',
    symptoms: insertedRow.symptoms || symptomsVal || undefined,
    symptoms_summary: insertedRow.symptoms || symptomsVal || undefined,
    created_at: insertedRow.created_at || new Date().toISOString(),
  };

  // Update in-memory state and notify subscribers
  inMemoryAppointments = [
    ...inMemoryAppointments.filter((a) => a.id !== confirmedAppointment.id && a.token_number !== confirmedAppointment.token_number),
    confirmedAppointment,
  ];
  notifySubscribers('appointments', inMemoryAppointments);

  return { appointment: confirmedAppointment, queuePosition };
}

export function getLiveQueueEstimate(date: string, shift: ShiftType): number {
  const existing = inMemoryAppointments.filter(
    (a) => a.booking_date === date && a.shift === shift && a.status !== 'cancelled'
  );
  return existing.length + 1;
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus, notes?: string) {
  const supabase = getSupabase();
  const updateFields: Record<string, any> = { status };

  const { error } = await supabase
    .from('appointments')
    .update(updateFields)
    .eq('id', id);

  if (error) {
    console.error('Supabase updateAppointmentStatus error:', error);
    throw new Error(`Database error updating status: ${error.message}`);
  }

  inMemoryAppointments = inMemoryAppointments.map((a) => {
    if (a.id === id) {
      return {
        ...a,
        status,
        doctor_notes: notes !== undefined ? notes : a.doctor_notes,
        updated_at: new Date().toISOString(),
      };
    }
    return a;
  });
  notifySubscribers('appointments', inMemoryAppointments);
}

// Dynamic Shift Reassignment (e.g. evening patient arrives in morning emergency)
export async function reassignAppointmentShift(id: string, newShift: ShiftType): Promise<Appointment | null> {
  const target = inMemoryAppointments.find((a) => a.id === id);
  if (!target || target.shift === newShift) return null;

  const supabase = getSupabase();
  const { data: slotApts } = await supabase
    .from('appointments')
    .select('id')
    .eq('booking_date', target.booking_date)
    .eq('shift', newShift)
    .neq('status', 'cancelled');

  const newQueuePos = (slotApts?.length || 0) + 1;
  const shiftPrefix = newShift === 'morning' ? 'MORN' : 'EVE';
  const cleanDate = target.booking_date.replace(/-/g, '');
  const padIndex = String(newQueuePos).padStart(3, '0');
  const newTokenNumber = `TK-${cleanDate}-${shiftPrefix}-${padIndex}`;

  const { error } = await supabase
    .from('appointments')
    .update({
      shift: newShift,
      token_number: newTokenNumber,
      status: 'in_consult',
    })
    .eq('id', id);

  if (error) {
    console.error('Supabase reassign shift error:', error);
    throw new Error(`Failed to reassign shift: ${error.message}`);
  }

  let updatedTarget: Appointment | null = null;
  inMemoryAppointments = inMemoryAppointments.map((a) => {
    if (a.id === id) {
      updatedTarget = {
        ...a,
        shift: newShift,
        queue_position: newQueuePos,
        token_number: newTokenNumber,
        status: 'in_consult' as AppointmentStatus,
        updated_at: new Date().toISOString(),
      };
      return updatedTarget;
    }
    return a;
  });

  notifySubscribers('appointments', inMemoryAppointments);
  return updatedTarget;
}

// Flexible Appointment Reassignment (Date and/or Shift)
export async function reassignAppointmentSlot(
  id: string,
  newDate: string,
  newShift: ShiftType
): Promise<Appointment | null> {
  const target = inMemoryAppointments.find((a) => a.id === id);
  if (!target) return null;

  // Validate Friday clinic closed
  const dateObj = new Date(newDate + 'T00:00:00');
  if (dateObj.getDay() === 5) {
    throw new Error('Clinic is closed on Fridays. Please select Saturday to Thursday.');
  }

  const supabase = getSupabase();
  const { data: slotApts } = await supabase
    .from('appointments')
    .select('id')
    .eq('booking_date', newDate)
    .eq('shift', newShift)
    .neq('status', 'cancelled');

  const newQueuePos = (slotApts?.length || 0) + 1;
  const shiftPrefix = newShift === 'morning' ? 'MORN' : 'EVE';
  const cleanDate = newDate.replace(/-/g, '');
  const padIndex = String(newQueuePos).padStart(3, '0');
  const newTokenNumber = `TK-${cleanDate}-${shiftPrefix}-${padIndex}`;

  const { error } = await supabase
    .from('appointments')
    .update({
      booking_date: newDate,
      shift: newShift,
      token_number: newTokenNumber,
      status: 'pending',
    })
    .eq('id', id);

  if (error) {
    console.error('Supabase reassign slot error:', error);
    throw new Error(`Failed to reassign appointment slot: ${error.message}`);
  }

  let updatedTarget: Appointment | null = null;
  inMemoryAppointments = inMemoryAppointments.map((a) => {
    if (a.id === id) {
      updatedTarget = {
        ...a,
        booking_date: newDate,
        shift: newShift,
        queue_position: newQueuePos,
        token_number: newTokenNumber,
        status: 'pending' as AppointmentStatus,
        updated_at: new Date().toISOString(),
      };
      return updatedTarget;
    }
    return a;
  });

  notifySubscribers('appointments', inMemoryAppointments);
  return updatedTarget;
}

// ==========================================
// PRESCRIPTIONS & CLINICAL CONSULTATION
// ==========================================

export function getPrescriptions(): Prescription[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(PRESCRIPTIONS_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export async function savePrescription(prescription: Omit<Prescription, 'id' | 'created_at'>): Promise<Prescription> {
  const prescriptions = getPrescriptions();
  const newPrescription: Prescription = {
    ...prescription,
    id: `rx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    created_at: new Date().toISOString(),
  };

  const updated = [newPrescription, ...prescriptions];
  localStorage.setItem(PRESCRIPTIONS_KEY, JSON.stringify(updated));
  notifySubscribers('prescriptions', updated);

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('prescriptions').insert([newPrescription]);
    } catch (e) {
      console.warn('Supabase prescription sync warning:', e);
    }
  }

  return newPrescription;
}

// ==========================================
// INVOICES & BILLING GENERATOR (Direct Supabase)
// ==========================================

export function getInvoices(): Invoice[] {
  return inMemoryInvoices;
}

export function registerCreatedInvoice(invoice: Invoice) {
  const existingIdx = inMemoryInvoices.findIndex(i => i.id === invoice.id || i.invoice_number === invoice.invoice_number);
  if (existingIdx >= 0) {
    inMemoryInvoices[existingIdx] = invoice;
  } else {
    inMemoryInvoices = [invoice, ...inMemoryInvoices];
  }
  notifySubscribers('invoices', inMemoryInvoices);
}

export async function createInvoice(invoiceData: Omit<Invoice, 'id' | 'invoice_number' | 'created_at'>): Promise<Invoice> {
  const supabase = getSupabase();
  const year = new Date().getFullYear();
  const count = inMemoryInvoices.length + 1;
  const invoice_number = `INV-${year}-${String(count).padStart(4, '0')}`;

  // Safe appointment_id handling: convert UUID or Token to string, or omit if null
  let safeAppointmentId: string | null = null;
  if (invoiceData.appointment_id) {
    const rawId = String(invoiceData.appointment_id).trim();
    if (rawId && rawId !== 'null' && rawId !== 'undefined') {
      safeAppointmentId = rawId;
    }
  }

  // Ensure items array is properly formatted and serialized
  const serializedItems = Array.isArray(invoiceData.items)
    ? invoiceData.items.map((it, idx) => ({
        id: it.id || `item-${Date.now()}-${idx}`,
        item_description: it.item_description || it.medicine_name || '',
        price: Number(it.price ?? it.total_price) || 0,
        medicine_name: it.medicine_name || it.item_description || '',
        total_price: Number(it.total_price ?? it.price) || 0,
        quantity: Number(it.quantity) || 1,
        unit_price: Number(it.unit_price ?? it.price) || 0,
      }))
    : [];

  const invoiceShift: ShiftType = invoiceData.shift || (new Date().getHours() < 14 ? 'morning' : 'evening');
  const medicineTotal = invoiceData.medicine_total !== undefined 
    ? Number(invoiceData.medicine_total) 
    : (invoiceData.items || []).reduce((sum: number, it: any) => sum + (Number(it.price || it.total_price) || 0), 0);

  const basePayload: Record<string, any> = {
    invoice_number,
    patient_name: invoiceData.patient_name.trim(),
    phone: invoiceData.phone?.trim() || null,
    patient_id: invoiceData.patient_id ? String(invoiceData.patient_id) : `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
    consultation_fee: Number(invoiceData.consultation_fee) || 0,
    medicine_total: medicineTotal,
    shift: invoiceShift,
    subtotal: Number(invoiceData.subtotal) || Number(invoiceData.total_amount),
    discount: Number(invoiceData.discount) || 0,
    tax: Number(invoiceData.tax) || 0,
    total_amount: Number(invoiceData.total_amount),
    payment_mode: (invoiceData.payment_mode || 'cash').toLowerCase(),
    payment_status: 'paid',
    ...(invoiceData.prescription_url ? { prescription_url: invoiceData.prescription_url } : {}),
  };

  let inserted: any = null;

  if (supabase) {
    // Attempt 1: Full payload with appointment_id, shift, medicine_total and serialized items
    const fullPayload: Record<string, any> = {
      ...basePayload,
      items: serializedItems,
    };
    if (safeAppointmentId) {
      fullPayload.appointment_id = safeAppointmentId;
    }

    let res = await supabase.from('invoices').insert([fullPayload]).select();

    // Fallback if schema does not have 'shift' or 'medicine_total' or 'items' column yet
    if (res.error && (res.error.message?.includes('shift') || res.error.message?.includes('medicine_total') || res.error.message?.includes('items') || res.error.code === 'PGRST204')) {
      console.warn('Retrying invoice save with sanitized payload columns:', res.error.message);
      const safePayload: Record<string, any> = {
        invoice_number,
        patient_name: invoiceData.patient_name.trim(),
        phone: invoiceData.phone?.trim() || null,
        patient_id: invoiceData.patient_id ? String(invoiceData.patient_id) : `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
        consultation_fee: Number(invoiceData.consultation_fee) || 0,
        subtotal: Number(invoiceData.subtotal) || Number(invoiceData.total_amount),
        discount: Number(invoiceData.discount) || 0,
        tax: Number(invoiceData.tax) || 0,
        total_amount: Number(invoiceData.total_amount),
        payment_mode: (invoiceData.payment_mode || 'cash').toLowerCase(),
        payment_status: 'paid',
      };
      if (safeAppointmentId) {
        safePayload.appointment_id = safeAppointmentId;
      }
      res = await supabase.from('invoices').insert([safePayload]).select();
    }

    // If schema error because appointment_id UUID syntax or foreign key
    if (res.error && (res.error.message?.includes('appointment_id') || res.error.message?.includes('uuid') || res.error.code === '22P02' || res.error.code === '23503')) {
      console.warn('Retrying invoice save omitting appointment_id:', res.error.message);
      const withoutAptPayload: Record<string, any> = {
        ...basePayload,
        items: serializedItems,
      };
      res = await supabase.from('invoices').insert([withoutAptPayload]).select();
      if (res.error && (res.error.message?.includes('items') || res.error.code === 'PGRST204')) {
        res = await supabase.from('invoices').insert([basePayload]).select();
      }
    }

    if (!res.error && res.data && res.data.length > 0) {
      inserted = res.data[0];

      // If separate invoice_items table exists, safely attempt insert into invoice_items
      if (inserted?.id && serializedItems.length > 0) {
        try {
          const lineItems = serializedItems.map(it => ({
            invoice_id: inserted.id,
            medicine_name: it.item_description || it.medicine_name || 'Dispensed Medicine',
            potency: (it as any).potency || 'N/A',
            quantity: it.quantity || 1,
            unit_price: it.price || 0,
            total_price: it.price || 0,
          }));
          await supabase.from('invoice_items').insert(lineItems);
        } catch {
          // Non-blocking
        }
      }
    } else if (res.error) {
      console.error('Supabase invoice insert error:', res.error);
      // Fallback local record to avoid blocking print / receipt rendering
      inserted = {
        id: `inv-${Date.now()}`,
        invoice_number,
        created_at: new Date().toISOString(),
      };
    }
  } else {
    inserted = {
      id: `inv-${Date.now()}`,
      invoice_number,
      created_at: new Date().toISOString(),
    };
  }

  const newInvoice: Invoice = {
    ...invoiceData,
    id: inserted?.id || `inv-${Date.now()}`,
    invoice_number: inserted?.invoice_number || invoice_number,
    appointment_id: safeAppointmentId || undefined,
    prescription_url: invoiceData.prescription_url || inserted?.prescription_url || undefined,
    items: serializedItems,
    created_at: inserted?.created_at || new Date().toISOString(),
  };

  inMemoryInvoices = [newInvoice, ...inMemoryInvoices.filter((inv) => inv.id !== newInvoice.id)];
  notifySubscribers('invoices', inMemoryInvoices);

  // Auto-deduct medicine quantities from inventory
  for (const item of newInvoice.items) {
    if (item.inventory_id) {
      dispenseInventoryMedicine(item.inventory_id, item.quantity, `Dispensed on ${invoice_number} to ${newInvoice.patient_name}`);
    }
  }

  // Update appointment status to completed if tied to an appointment
  if (safeAppointmentId) {
    try {
      await updateAppointmentStatus(safeAppointmentId, 'completed');
    } catch (e) {
      console.warn('Could not update appointment status for invoice:', e);
    }
  }

  return newInvoice;
}

// ==========================================
// INVENTORY MANAGEMENT
// ==========================================

export function getInventory(): InventoryItem[] {
  if (typeof window === 'undefined') return INITIAL_INVENTORY;
  const stored = localStorage.getItem(INVENTORY_KEY);
  if (!stored) {
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(INITIAL_INVENTORY));
    return INITIAL_INVENTORY;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_INVENTORY;
  }
}

export function saveInventory(items: InventoryItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(INVENTORY_KEY, JSON.stringify(items));
  notifySubscribers('inventory', items);
}

export function getStockLogs(): StockLog[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STOCK_LOGS_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

function addStockLog(log: Omit<StockLog, 'id' | 'timestamp'>) {
  const logs = getStockLogs();
  const newLog: StockLog = {
    ...log,
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    timestamp: new Date().toISOString(),
  };
  const updated = [newLog, ...logs];
  localStorage.setItem(STOCK_LOGS_KEY, JSON.stringify(updated));
  notifySubscribers('stock_logs', updated);

  const supabase = getSupabase();
  if (supabase) {
    supabase.from('stock_logs').insert([newLog]).then();
  }
}

export function addInventoryItem(item: Omit<InventoryItem, 'id' | 'updated_at'>): InventoryItem {
  const inventory = getInventory();
  const newItem: InventoryItem = {
    ...item,
    id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    updated_at: new Date().toISOString(),
  };
  const updated = [newItem, ...inventory];
  saveInventory(updated);

  addStockLog({
    inventory_id: newItem.id,
    medicine_name: `${newItem.medicine_name} ${newItem.potency}`,
    type: 'restock',
    quantity_changed: newItem.stock_quantity,
    previous_quantity: 0,
    new_quantity: newItem.stock_quantity,
    reason: 'Initial stock intake',
    performed_by: getCurrentUser()?.full_name || 'Admin',
  });

  const supabase = getSupabase();
  if (supabase) {
    supabase.from('inventory').insert([newItem]).then();
  }

  return newItem;
}

export function updateInventoryItem(itemOrId: InventoryItem | string, partial?: Partial<InventoryItem>) {
  const inventory = getInventory();
  let updatedItem: InventoryItem | undefined;

  const updated = inventory.map((i) => {
    if (typeof itemOrId === 'string' && i.id === itemOrId && partial) {
      updatedItem = { ...i, ...partial, updated_at: new Date().toISOString() };
      return updatedItem;
    } else if (typeof itemOrId !== 'string' && i.id === itemOrId.id) {
      updatedItem = { ...itemOrId, updated_at: new Date().toISOString() };
      return updatedItem;
    }
    return i;
  });

  saveInventory(updated);

  const supabase = getSupabase();
  if (supabase && updatedItem) {
    supabase.from('inventory').update(updatedItem).eq('id', updatedItem.id).then();
  }
}

export function dispenseInventoryMedicine(medicineId: string, quantity: number, reason = 'Clinical Dispense') {
  const inventory = getInventory();
  const item = inventory.find((i) => i.id === medicineId);
  if (!item) return;

  const previous_quantity = item.stock_quantity;
  const new_quantity = Math.max(0, previous_quantity - quantity);

  const updated = inventory.map((i) => {
    if (i.id === medicineId) {
      return {
        ...i,
        stock_quantity: new_quantity,
        updated_at: new Date().toISOString(),
      };
    }
    return i;
  });

  saveInventory(updated);

  addStockLog({
    inventory_id: medicineId,
    medicine_name: `${item.medicine_name} ${item.potency} (${item.bottle_size})`,
    type: 'dispense',
    quantity_changed: -quantity,
    previous_quantity,
    new_quantity,
    reason,
    performed_by: getCurrentUser()?.full_name || 'Clinic Dispenser',
  });
}

export function restockInventoryMedicine(medicineId: string, quantityToAdd: number, reason = 'Stock replenishment') {
  const inventory = getInventory();
  const item = inventory.find((i) => i.id === medicineId);
  if (!item) return;

  const previous_quantity = item.stock_quantity;
  const new_quantity = previous_quantity + quantityToAdd;

  const updated = inventory.map((i) => {
    if (i.id === medicineId) {
      return {
        ...i,
        stock_quantity: new_quantity,
        updated_at: new Date().toISOString(),
      };
    }
    return i;
  });

  saveInventory(updated);

  addStockLog({
    inventory_id: medicineId,
    medicine_name: `${item.medicine_name} ${item.potency}`,
    type: 'restock',
    quantity_changed: quantityToAdd,
    previous_quantity,
    new_quantity,
    reason,
    performed_by: getCurrentUser()?.full_name || 'Admin',
  });
}

// Move stock between Godown and Clinic Shelf
export function transferInventoryStock(
  medicineId: string,
  quantity: number,
  fromLocation: string,
  toLocation: string,
  notes?: string
) {
  const inventory = getInventory();
  const item = inventory.find((i) => i.id === medicineId);
  if (!item) return;

  const previous_quantity = item.stock_quantity;
  // If moving into dispensing shelf or adjusting location:
  const updatedItem: InventoryItem = {
    ...item,
    storage_location: toLocation as any,
    updated_at: new Date().toISOString(),
  };

  const updated = inventory.map((i) => (i.id === medicineId ? updatedItem : i));
  saveInventory(updated);

  addStockLog({
    inventory_id: medicineId,
    medicine_name: `${item.medicine_name} ${item.potency}`,
    type: 'transfer',
    quantity_changed: quantity,
    previous_quantity,
    new_quantity: previous_quantity,
    source_location: fromLocation,
    destination_location: toLocation,
    reason: notes || `Transferred from ${fromLocation} to ${toLocation}`,
    performed_by: getCurrentUser()?.full_name || 'Staff',
  });
}

export const recordStockTransfer = (
  medicineId: string,
  quantity: number,
  fromLocation: string,
  toLocation: string,
  reason: string,
  performedBy?: string
) => {
  transferInventoryStock(medicineId, quantity, fromLocation, toLocation, reason);
};

export const recordStockDeduction = (
  medicineId: string,
  quantity: number,
  reason = 'Manual Dispense',
  performedBy?: string
) => {
  dispenseInventoryMedicine(medicineId, quantity, reason);
};

// ==========================================
// USER PROFILES & AUTH MANAGEMENT
// ==========================================

export function getProfiles(): UserProfile[] {
  if (typeof window === 'undefined') return INITIAL_PROFILES;
  const stored = localStorage.getItem(PROFILES_KEY);
  if (!stored) {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(INITIAL_PROFILES));
    return INITIAL_PROFILES;
  }
  try {
    const list: UserProfile[] = JSON.parse(stored);
    // Ensure Md Abutalha Khan name is updated from any legacy name
    const updated = list.map((p) => {
      if (p.full_name === 'Md Abu Taher Khan' || p.full_name === 'Md Abu Talha Khan') {
        return { ...p, full_name: 'Md Abutalha Khan', email: p.email.replace('homeo', 'homoeo') };
      }
      return p;
    });
    if (JSON.stringify(updated) !== stored) {
      localStorage.setItem(PROFILES_KEY, JSON.stringify(updated));
    }
    return updated;
  } catch {
    return INITIAL_PROFILES;
  }
}

export const AUTH_SESSION_KEY = 'hhc_auth_session';

export function getCurrentUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;

  // 1. Try local storage user key
  let stored = localStorage.getItem(CURRENT_USER_KEY);

  // 2. Try session storage or auth session record
  if (!stored) {
    const sessionRecord = sessionStorage.getItem(AUTH_SESSION_KEY) || localStorage.getItem(AUTH_SESSION_KEY);
    if (sessionRecord) {
      try {
        const parsed = JSON.parse(sessionRecord);
        if (parsed?.isAuthenticated && parsed?.user) {
          stored = JSON.stringify(parsed.user);
        }
      } catch {
        // ignore JSON parse error
      }
    }
  }

  if (!stored) return null;

  try {
    const user: UserProfile = JSON.parse(stored);
    if (user.full_name === 'Md Abu Taher Khan' || user.full_name === 'Md Abu Talha Khan') {
      user.full_name = 'Md Abutalha Khan';
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }
    return user;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: UserProfile | null) {
  if (typeof window === 'undefined') return;
  if (user) {
    const sessionData = JSON.stringify({
      isAuthenticated: true,
      user,
      timestamp: Date.now(),
    });
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    localStorage.setItem(AUTH_SESSION_KEY, sessionData);
    sessionStorage.setItem(AUTH_SESSION_KEY, sessionData);
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(AUTH_SESSION_KEY);
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    sessionStorage.removeItem('hhc_current_view');
    sessionStorage.removeItem('hhc_active_tab');
  }
  notifySubscribers('auth_user', user);
}

// ==========================================
// CLINIC TEAM (LIVE SUPABASE clinic_team TABLE)
// ==========================================

export async function fetchClinicTeamFromSupabase(): Promise<UserProfile[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('clinic_team')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Failed to fetch clinic_team from Supabase:', error);
    throw error;
  }
  return (data || []) as UserProfile[];
}

export async function addClinicTeamMemberToSupabase(member: {
  full_name: string;
  email: string;
  role: UserRole;
  phone?: string;
  password: string;
}): Promise<UserProfile> {
  const supabase = getSupabase();
  const payload = {
    full_name: member.full_name.trim(),
    email: member.email.trim().toLowerCase(),
    role: member.role,
    phone: member.phone?.trim() || null,
    password: member.password.trim(),
    is_active: true,
    is_first_login: true,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('clinic_team')
    .insert([payload])
    .select();

  if (error) {
    console.error('Failed to insert clinic_team member:', error);
    throw error;
  }

  notifySubscribers('clinic_team_change', data?.[0]);
  return data?.[0] as UserProfile;
}

export async function toggleClinicTeamMemberStatus(id: string, isActive: boolean): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('clinic_team')
    .update({ is_active: isActive })
    .eq('id', id);

  if (error) {
    console.error('Failed to update clinic_team status:', error);
    throw error;
  }

  notifySubscribers('clinic_team_change', { id, is_active: isActive });
  return true;
}

export async function updateClinicTeamPassword(
  id: string,
  newPassword?: string,
  isFirstLogin: boolean = false
): Promise<boolean> {
  const supabase = getSupabase();
  const updatePayload: Record<string, any> = {
    is_first_login: isFirstLogin,
  };
  if (newPassword && newPassword.trim()) {
    updatePayload.password = newPassword.trim();
  }

  const { error } = await supabase
    .from('clinic_team')
    .update(updatePayload)
    .eq('id', id);

  if (error) {
    console.error('Failed to update clinic_team password:', error);
    throw error;
  }

  notifySubscribers('clinic_team_change', { id, ...updatePayload });
  return true;
}

export function createTeamMember(profile: Omit<UserProfile, 'id'>) {
  const profiles = getProfiles();
  const newProfile: UserProfile = {
    ...profile,
    id: `user-${Date.now()}`,
  };
  const updated = [...profiles, newProfile];
  localStorage.setItem(PROFILES_KEY, JSON.stringify(updated));
  notifySubscribers('profiles', updated);

  const supabase = getSupabase();
  if (supabase) {
    supabase.from('profiles').insert([newProfile]).then();
  }

  return newProfile;
}

export const addProfile = (profile: UserProfile) => {
  return createTeamMember(profile);
};

// ==========================================
// CLINIC SETTINGS & DOCTOR BRANDING PHOTO (SUPABASE clinic_settings & STORAGE)
// ==========================================

export const CLINIC_SETTINGS_KEY = 'hhc_clinic_settings_v1';
export const DOCTOR_IMAGE_URL_KEY = 'hhc_doctor_image_url';

export async function fetchClinicSettings(): Promise<{ doctor_image_url: string }> {
  const supabase = getSupabase();
  try {
    const { data, error } = await supabase
      .from('clinic_settings')
      .select('doctor_image_url')
      .eq('id', 'default')
      .single();

    if (!error && data?.doctor_image_url) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(DOCTOR_IMAGE_URL_KEY, data.doctor_image_url);
      }
      return { doctor_image_url: data.doctor_image_url };
    }
  } catch (e) {
    console.warn('fetchClinicSettings error from Supabase:', e);
  }
  const local = typeof window !== 'undefined' ? localStorage.getItem(DOCTOR_IMAGE_URL_KEY) || '' : '';
  return { doctor_image_url: local };
}

export async function uploadDoctorPhotoToSupabase(file: File): Promise<string> {
  const supabase = getSupabase();
  const cleanExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const fileName = `doctor_profile_${Date.now()}.${cleanExt}`;

  // 1. Upload to Supabase Storage bucket 'clinic-assets'
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('clinic-assets')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Supabase Storage upload failed: ${uploadError.message}`);
  }

  // 2. Get the public URL
  const { data: publicUrlData } = supabase.storage
    .from('clinic-assets')
    .getPublicUrl(fileName);
  const publicUrl = publicUrlData?.publicUrl;

  if (!publicUrl) {
    throw new Error('Failed to obtain public URL from Supabase Storage.');
  }

  // 3. Explicitly update the Supabase database table clinic_settings
  const { error: dbError } = await supabase
    .from('clinic_settings')
    .upsert({ 
      id: 'default', 
      doctor_image_url: publicUrl, 
      updated_at: new Date().toISOString() 
    });

  if (dbError) {
    console.error('Database update error on clinic_settings:', dbError);
    throw new Error(`Database error saving to clinic_settings: ${dbError.message}`);
  }

  // Update doctor's avatar_url in clinic_team table if available
  try {
    await supabase
      .from('clinic_team')
      .update({ avatar_url: publicUrl })
      .eq('role', 'doctor');
  } catch {
    // optional
  }

  // Save to localStorage and notify subscribers for instant UI update
  if (typeof window !== 'undefined') {
    localStorage.setItem(DOCTOR_IMAGE_URL_KEY, publicUrl);
  }
  notifySubscribers('clinic_settings', { doctor_image_url: publicUrl });

  return publicUrl;
}

export async function resetDoctorPhoto(): Promise<void> {
  const supabase = getSupabase();
  try {
    await supabase
      .from('clinic_settings')
      .upsert({ id: 'default', doctor_image_url: '', updated_at: new Date().toISOString() }, { onConflict: 'id' });
  } catch (err) {
    console.warn('resetDoctorPhoto error:', err);
  }

  if (typeof window !== 'undefined') {
    localStorage.removeItem(DOCTOR_IMAGE_URL_KEY);
  }
  notifySubscribers('clinic_settings', { doctor_image_url: '' });
}

