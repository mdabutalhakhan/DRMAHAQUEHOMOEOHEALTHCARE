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
import { INITIAL_APPOINTMENTS, INITIAL_INVENTORY, INITIAL_PROFILES } from './seedData';
import { getSupabase } from './supabase';

const APPOINTMENTS_KEY = 'hhc_appointments_v1';
const INVENTORY_KEY = 'hhc_inventory_v1';
const PRESCRIPTIONS_KEY = 'hhc_prescriptions_v1';
const INVOICES_KEY = 'hhc_invoices_v1';
const STOCK_LOGS_KEY = 'hhc_stock_logs_v1';
const PROFILES_KEY = 'hhc_profiles_v1';
const CURRENT_USER_KEY = 'hhc_current_user_v1';

// BroadcastChannel for instant multi-tab & multi-window synchronization
let channel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    channel = new BroadcastChannel('hhc_realtime_sync');
  } catch (e) {
    console.warn('BroadcastChannel not available', e);
  }
}

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
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

export function initSupabaseSync(): () => void {
  const supabase = getSupabase();
  if (!supabase) return () => {};

  // Fetch live appointments from Supabase and merge
  const fetchLiveAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) {
        const local = getAppointments();
        const map = new Map<string, Appointment>();
        // Add Supabase records
        for (const item of data) {
          if (item && item.id) map.set(item.id, item as Appointment);
        }
        // Add any pending local-only records
        for (const item of local) {
          if (item && item.id && !map.has(item.id)) {
            map.set(item.id, item);
          }
        }
        const sorted = Array.from(map.values()).sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        saveAppointments(sorted);
      }
    } catch (err) {
      console.warn('Could not fetch Supabase appointments:', err);
    }
  };

  fetchLiveAppointments();

  // Cross-device window focus check
  const handleFocus = () => {
    fetchLiveAppointments();
  };
  window.addEventListener('focus', handleFocus);
  window.addEventListener('visibilitychange', handleFocus);

  // Cross-device Realtime channel subscription via postgres_changes
  let realtimeChannel: any = null;
  try {
    realtimeChannel = supabase
      .channel('supabase_realtime_appointments_sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        (payload) => {
          console.log('[Realtime] Supabase appointment event received:', payload);
          if (payload.eventType === 'INSERT' && payload.new) {
            const newApt = payload.new as Appointment;
            const current = getAppointments();
            if (!current.some((a) => a.id === newApt.id || a.token_number === newApt.token_number)) {
              const updated = [newApt, ...current];
              localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));
              notifySubscribers('appointments', updated);
            }
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            const updatedApt = payload.new as Appointment;
            const current = getAppointments();
            const updated = current.map((a) =>
              a.id === updatedApt.id || a.token_number === updatedApt.token_number
                ? { ...a, ...updatedApt }
                : a
            );
            localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));
            notifySubscribers('appointments', updated);
          } else if (payload.eventType === 'DELETE' && payload.old) {
            const oldId = (payload.old as any)?.id;
            if (oldId) {
              const current = getAppointments();
              const updated = current.filter((a) => a.id !== oldId);
              localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));
              notifySubscribers('appointments', updated);
            }
          } else {
            fetchLiveAppointments();
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
// APPOINTMENTS & QUEUE MANAGEMENT
// ==========================================

export function getAppointments(): Appointment[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(APPOINTMENTS_KEY);
  if (!stored) {
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify([]));
    return [];
  }
  try {
    const list: Appointment[] = JSON.parse(stored);
    // Filter out any legacy dummy/mock patients
    const mockNames = new Set([
      'Ananya Banerjee',
      'Rajesh Mukherjee',
      'Suman Sen',
      'Priyanka Das',
      'Subhashish Roy',
      'Debjani Ghosh',
    ]);
    const cleaned = list.filter(
      (a) => !mockNames.has(a.patient_name) && !a.patient_id?.startsWith('PAT-102')
    );
    if (cleaned.length !== list.length) {
      localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch {
    return [];
  }
}

export function saveAppointments(appointments: Appointment[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
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
}

export async function createAppointment(input: BookingInput): Promise<{ appointment: Appointment; queuePosition: number }> {
  const currentAppointments = getAppointments();

  // Validate Friday clinic closed
  const dateObj = new Date(input.booking_date + 'T00:00:00');
  if (dateObj.getDay() === 5) { // 5 is Friday
    throw new Error('Clinic is closed on Fridays. Please select Saturday to Thursday.');
  }

  // Calculate live queue count for this specific date and shift
  const existingForSlot = currentAppointments.filter(
    (a) => a.booking_date === input.booking_date && a.shift === input.shift && a.status !== 'cancelled'
  );

  const queuePosition = existingForSlot.length + 1;
  const shiftPrefix = input.shift === 'morning' ? 'MORN' : 'EVE';
  const cleanDate = input.booking_date.replace(/-/g, '');
  const padIndex = String(queuePosition).padStart(3, '0');
  const token_number = `TK-${cleanDate}-${shiftPrefix}-${padIndex}`;

  // Find existing patient ID by phone or generate new one
  const existingPatient = currentAppointments.find((a) => a.phone === input.phone);
  const patient_id = existingPatient ? existingPatient.patient_id : `PAT-${Math.floor(1000 + Math.random() * 9000)}`;

  const newAppointment: Appointment = {
    id: generateUUID(),
    token_number,
    patient_id,
    patient_name: input.patient_name.trim(),
    age: input.age ? Number(input.age) : undefined,
    phone: input.phone.trim(),
    address: input.address.trim(),
    booking_date: input.booking_date,
    shift: input.shift,
    queue_position: queuePosition,
    status: 'pending',
    symptoms_summary: input.symptoms_summary?.trim(),
    created_at: new Date().toISOString(),
  };

  const updated = [newAppointment, ...currentAppointments];
  saveAppointments(updated);

  // Sync to Supabase if configured
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error: insertErr } = await supabase.from('appointments').insert([newAppointment]);
      if (insertErr) {
        console.warn('Supabase appointment insert error:', insertErr);
      }
    } catch (e) {
      console.warn('Supabase appointment sync warning:', e);
    }
  }

  return { appointment: newAppointment, queuePosition };
}

export function getLiveQueueEstimate(date: string, shift: ShiftType): number {
  const currentAppointments = getAppointments();
  const existing = currentAppointments.filter(
    (a) => a.booking_date === date && a.shift === shift && a.status !== 'cancelled'
  );
  return existing.length + 1;
}

export function updateAppointmentStatus(id: string, status: AppointmentStatus, notes?: string) {
  const appointments = getAppointments();
  const updated = appointments.map((a) => {
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
  saveAppointments(updated);

  const supabase = getSupabase();
  if (supabase) {
    supabase.from('appointments').update({ status, doctor_notes: notes }).eq('id', id).then();
  }
}

// Dynamic Shift Reassignment (e.g. evening patient arrives in morning emergency)
export function reassignAppointmentShift(id: string, newShift: ShiftType): Appointment | null {
  const appointments = getAppointments();
  const target = appointments.find((a) => a.id === id);
  if (!target || target.shift === newShift) return null;

  // Calculate new queue position in destination shift
  const existingInTargetShift = appointments.filter(
    (a) => a.booking_date === target.booking_date && a.shift === newShift && a.id !== id && a.status !== 'cancelled'
  );
  const newQueuePos = existingInTargetShift.length + 1;
  const shiftPrefix = newShift === 'morning' ? 'MORN' : 'EVE';
  const cleanDate = target.booking_date.replace(/-/g, '');
  const padIndex = String(newQueuePos).padStart(3, '0');
  const newTokenNumber = `TK-${cleanDate}-${shiftPrefix}-${padIndex}`;

  let updatedTarget: Appointment | null = null;
  const updated = appointments.map((a) => {
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

  saveAppointments(updated);

  const supabase = getSupabase();
  if (supabase) {
    supabase
      .from('appointments')
      .update({ shift: newShift, queue_position: newQueuePos, token_number: newTokenNumber, status: 'in_consult' })
      .eq('id', id)
      .then();
  }

  return updatedTarget;
}

// Flexible Appointment Reassignment (Date and/or Shift)
export function reassignAppointmentSlot(
  id: string,
  newDate: string,
  newShift: ShiftType
): Appointment | null {
  const appointments = getAppointments();
  const target = appointments.find((a) => a.id === id);
  if (!target) return null;

  // Validate Friday clinic closed
  const dateObj = new Date(newDate + 'T00:00:00');
  if (dateObj.getDay() === 5) {
    throw new Error('Clinic is closed on Fridays. Please select Saturday to Thursday.');
  }

  // Calculate new queue position in destination slot
  const existingInTargetSlot = appointments.filter(
    (a) => a.booking_date === newDate && a.shift === newShift && a.id !== id && a.status !== 'cancelled'
  );
  const newQueuePos = existingInTargetSlot.length + 1;
  const shiftPrefix = newShift === 'morning' ? 'MORN' : 'EVE';
  const cleanDate = newDate.replace(/-/g, '');
  const padIndex = String(newQueuePos).padStart(3, '0');
  const newTokenNumber = `TK-${cleanDate}-${shiftPrefix}-${padIndex}`;

  let updatedTarget: Appointment | null = null;
  const updated = appointments.map((a) => {
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

  saveAppointments(updated);

  const supabase = getSupabase();
  if (supabase) {
    supabase
      .from('appointments')
      .update({
        booking_date: newDate,
        shift: newShift,
        queue_position: newQueuePos,
        token_number: newTokenNumber,
        status: 'pending',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .then();
  }

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
// INVOICES & BILLING GENERATOR
// ==========================================

export function getInvoices(): Invoice[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(INVOICES_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export async function createInvoice(invoiceData: Omit<Invoice, 'id' | 'invoice_number' | 'created_at'>): Promise<Invoice> {
  const invoices = getInvoices();
  const year = new Date().getFullYear();
  const count = invoices.length + 1;
  const invoice_number = `INV-${year}-${String(count).padStart(4, '0')}`;

  const newInvoice: Invoice = {
    ...invoiceData,
    id: `inv-${Date.now()}`,
    invoice_number,
    created_at: new Date().toISOString(),
  };

  const updated = [newInvoice, ...invoices];
  localStorage.setItem(INVOICES_KEY, JSON.stringify(updated));
  notifySubscribers('invoices', updated);

  // Auto-deduct medicine quantities from inventory
  for (const item of newInvoice.items) {
    if (item.inventory_id) {
      dispenseInventoryMedicine(item.inventory_id, item.quantity, `Dispensed on ${invoice_number} to ${newInvoice.patient_name}`);
    }
  }

  // Update appointment status to completed if tied to an appointment
  if (newInvoice.appointment_id) {
    updateAppointmentStatus(newInvoice.appointment_id, 'completed');
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('invoices').insert([newInvoice]);
      if (newInvoice.items.length > 0) {
        await supabase.from('invoice_items').insert(
          newInvoice.items.map((it) => ({
            ...it,
            invoice_id: newInvoice.id,
          }))
        );
      }
    } catch (e) {
      console.warn('Supabase invoice sync warning:', e);
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
