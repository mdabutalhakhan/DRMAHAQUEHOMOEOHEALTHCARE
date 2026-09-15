import { 
  Appointment, 
  AppointmentStatus, 
  InventoryItem, 
  Invoice, 
  InvoiceItem, 
  Prescription, 
  ShiftType, 
  StockLog, 
  UserProfile 
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

function notifySubscribers(type: string, data?: any) {
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
    queue_position: row.queue_position || row.queue_number || 1,
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

  const list: Invoice[] = (data || []).map((row: any) => ({
    id: row.id,
    invoice_number: row.invoice_number,
    patient_id: row.patient_uid || row.patient_id || 'PAT-1001',
    patient_name: row.patient_name,
    phone: row.phone || '',
    consultation_fee: Number(row.consultation_fee) || 200,
    subtotal: Number(row.total_amount) + Number(row.discount || 0),
    discount: Number(row.discount) || 0,
    tax: 0,
    total_amount: Number(row.total_amount),
    payment_mode: (row.payment_mode || 'cash').toLowerCase() as any,
    payment_status: 'paid',
    items: Array.isArray(row.items) ? row.items : [],
    created_at: row.created_at,
  }));

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
              queue_position: row.queue_position || row.queue_number || 1,
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
      .subscribe((status) => {
        console.log('[Realtime] Appointments channel status:', status);
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

export async function createInvoice(invoiceData: Omit<Invoice, 'id' | 'invoice_number' | 'created_at'>): Promise<Invoice> {
  const supabase = getSupabase();
  const year = new Date().getFullYear();
  const count = inMemoryInvoices.length + 1;
  const invoice_number = `INV-${year}-${String(count).padStart(4, '0')}`;

  const payload: Record<string, any> = {
    invoice_number,
    patient_name: invoiceData.patient_name.trim(),
    phone: invoiceData.phone?.trim() || null,
    patient_id: invoiceData.patient_id || null,
    consultation_fee: Number(invoiceData.consultation_fee) || 200,
    subtotal: Number(invoiceData.subtotal) || Number(invoiceData.total_amount),
    discount: Number(invoiceData.discount) || 0,
    tax: 0,
    total_amount: Number(invoiceData.total_amount),
    payment_mode: (invoiceData.payment_mode || 'cash').toLowerCase(),
    appointment_id: invoiceData.appointment_id || null,
  };

  const { data, error } = await supabase
    .from('invoices')
    .insert([payload])
    .select();

  if (error || !data || data.length === 0) {
    console.error('Supabase invoice insert error:', error);
    throw new Error(`Database error saving invoice: ${error?.message || 'No record returned'}`);
  }

  const inserted = data[0] as any;
  const newInvoice: Invoice = {
    ...invoiceData,
    id: inserted.id,
    invoice_number: inserted.invoice_number,
    created_at: inserted.created_at || new Date().toISOString(),
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
  if (newInvoice.appointment_id) {
    try {
      await updateAppointmentStatus(newInvoice.appointment_id, 'completed');
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
    // Ensure Md Abu Talha Khan name is updated from any legacy Taher name
    const updated = list.map((p) => {
      if (p.full_name === 'Md Abu Taher Khan') {
        return { ...p, full_name: 'Md Abu Talha Khan', email: p.email.replace('homeo', 'homoeo') };
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

export function getCurrentUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  if (!stored) return null;
  try {
    const user: UserProfile = JSON.parse(stored);
    if (user.full_name === 'Md Abu Taher Khan') {
      user.full_name = 'Md Abu Talha Khan';
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
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
  notifySubscribers('auth_user', user);
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
