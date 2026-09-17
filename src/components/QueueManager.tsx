import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Users, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Play, 
  ArrowRightLeft, 
  FileDown, 
  Search, 
  Filter, 
  Phone, 
  MapPin, 
  Stethoscope, 
  Receipt,
  Sparkles,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Radio,
  User
} from 'lucide-react';
import { Appointment, ShiftType, AppointmentStatus, UserProfile } from '../types';
import { 
  getAppointments, 
  updateAppointmentStatus, 
  reassignAppointmentShift,
  reassignAppointmentSlot,
  autoCancelExpiredAppointments,
  isAppointmentExpired,
  subscribeToStore,
  parseQueueNumberFromTokenOrRow,
  derivePatientId
} from '../services/clinicStore';
import { getSupabase } from '../services/supabase';
import { exportAppointmentsToCSV } from '../utils/exportUtils';

// Helper to derive sequential queue position dynamically from trailing digits of token_number
export const getDisplayQueueNumber = (apt: Appointment, index?: number): number => {
  if (apt?.token_number) {
    const match = String(apt.token_number).match(/(\d+)$/);
    if (match && match[1]) {
      const parsed = parseInt(match[1], 10);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }
  }
  if (apt?.queue_position && apt.queue_position > 0) {
    return apt.queue_position;
  }
  return index !== undefined ? index + 1 : 1;
};
export const isExpiredAppt = (appt: any): boolean => {
  if (!appt) return false;

  const status = (appt.status || '').toLowerCase().trim();
  // If status is 'completed', 'in-consult', or 'cancelled', return false
  if (
    status === 'completed' ||
    status === 'in_consult' ||
    status === 'in-consult' ||
    status === 'cancelled'
  ) {
    return false;
  }

  // 1. DATE COMPARISON LOGIC:
  // Extract appointment date (YYYY-MM-DD) from apt.token_number (via regex /TK-(\d{4})(\d{2})(\d{2})/) or normalize apt.booking_date
  let aptDate = '';

  const rawToken = String(appt.token_number || appt.token || '');
  const tokenMatch = rawToken.match(/TK-(\d{4})(\d{2})(\d{2})/i);
  if (tokenMatch) {
    aptDate = `${tokenMatch[1]}-${tokenMatch[2]}-${tokenMatch[3]}`;
  }

  // Also normalize apt.booking_date / appointment_date
  const rawDate = String(appt.booking_date || appt.appointment_date || appt.date || '').trim();
  let normalizedBookingDate = '';
  if (rawDate) {
    const ddmmyyyyMatch = rawDate.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
    if (ddmmyyyyMatch) {
      const day = ddmmyyyyMatch[1].padStart(2, '0');
      const month = ddmmyyyyMatch[2].padStart(2, '0');
      const year = ddmmyyyyMatch[3];
      normalizedBookingDate = `${year}-${month}-${day}`;
    } else {
      const yyyymmddMatch = rawDate.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})/);
      if (yyyymmddMatch) {
        const year = yyyymmddMatch[1];
        const month = yyyymmddMatch[2].padStart(2, '0');
        const day = yyyymmddMatch[3].padStart(2, '0');
        normalizedBookingDate = `${year}-${month}-${day}`;
      } else {
        normalizedBookingDate = rawDate.split('T')[0];
      }
    }
  }

  if (!aptDate) {
    aptDate = normalizedBookingDate;
  }

  if (!aptDate) return false;

  // Today's date (YYYY-MM-DD):
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const currentHour = now.getHours() + now.getMinutes() / 60;

  // 2. STRICT CUT-OFF RULES:
  // PAST DATES (aptDate < todayStr or normalizedBookingDate < todayStr): Return true IMMEDIATELY!
  // Any pending appointment from yesterday or earlier (e.g. 16/09) is EXPIRED/CANCELLED 24 hours a day, regardless of shift or current time.
  if (aptDate < todayStr || (normalizedBookingDate && normalizedBookingDate < todayStr)) {
    return true;
  }

  // FUTURE DATES (aptDate > todayStr): Return false (Always active)
  if (aptDate > todayStr) {
    return false;
  }

  // TODAY (aptDate === todayStr):
  if (aptDate === todayStr) {
    const shift = (appt.shift_slot || appt.shift || appt.slot || '').toLowerCase();

    // Morning Shift: Expires ONLY after 2:00 PM (14.0 hrs)
    if (shift.includes('morning') && currentHour >= 14.0) return true;

    // Evening Shift: Expires ONLY after 10:00 PM (22.0 hrs)
    if (shift.includes('evening') && currentHour >= 22.0) return true;
  }

  return false;
};

interface QueueManagerProps {
  currentUser: UserProfile;
  onStartConsult: (appointment: Appointment) => void;
  onOpenBilling: (appointment: Appointment) => void;
}

export const QueueManager: React.FC<QueueManagerProps> = ({
  currentUser,
  onStartConsult,
  onOpenBilling,
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>(getAppointments());
  const [isLoading, setIsLoading] = useState(false);
  const [isRealtimeActive, setIsRealtimeActive] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Direct Supabase fetch ordered by created_at ascending
  const fetchDirectAppointments = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('[QueueManager] Supabase fetch error:', error);
        setFetchError(`Database error: ${error.message}`);
        return;
      }

      const list: Appointment[] = (data || []).map((row: any) => ({
        id: row.id,
        token_number: row.token_number,
        patient_id: derivePatientId(row.patient_id, row.phone, row.id),
        patient_name: row.patient_name,
        age: row.age != null && row.age !== '' && !isNaN(Number(row.age)) ? Number(row.age) : undefined,
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
      }));

      setAppointments(list);
      // Run background cancellation for expired pending appointments
      autoCancelExpiredAppointments(list).catch((err) =>
        console.warn('[QueueManager] Auto cancel check note:', err)
      );
    } catch (err: any) {
      console.error('[QueueManager] Direct fetch exception:', err);
      setFetchError(err.message || 'Failed to fetch queue from Supabase');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Supabase Realtime channel subscription + store subscription
  useEffect(() => {
    fetchDirectAppointments();

    const supabase = getSupabase();
    const channel = supabase
      .channel('admin_staff_queue_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        (payload) => {
          console.log('[Realtime Queue] Live Supabase event:', payload.eventType, payload.new);
          if (payload.eventType === 'INSERT' && payload.new) {
            const row = payload.new as any;
            const newApt: Appointment = {
              id: row.id,
              token_number: row.token_number,
              patient_id: derivePatientId(row.patient_id, row.phone, row.id),
              patient_name: row.patient_name,
              age: row.age != null && row.age !== '' && !isNaN(Number(row.age)) ? Number(row.age) : undefined,
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
            setAppointments((prev) => {
              if (prev.some((a) => a.id === newApt.id || a.token_number === newApt.token_number)) {
                return prev.map((a) => (a.id === newApt.id || a.token_number === newApt.token_number ? { ...a, ...newApt } : a));
              }
              return [...prev, newApt];
            });
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            const row = payload.new as any;
            setAppointments((prev) =>
              prev.map((a) =>
                a.id === row.id || a.token_number === row.token_number
                  ? {
                      ...a,
                      ...row,
                      symptoms_summary: row.symptoms || a.symptoms_summary,
                    }
                  : a
              )
            );
          } else if (payload.eventType === 'DELETE' && payload.old) {
            const oldId = (payload.old as any)?.id;
            if (oldId) {
              setAppointments((prev) => prev.filter((a) => a.id !== oldId));
            }
          } else {
            fetchDirectAppointments();
          }
        }
      )
      .subscribe((status) => {
        setIsRealtimeActive(status === 'SUBSCRIBED');
      });

    // In-tab store updates
    const unsubscribeStore = subscribeToStore((event) => {
      if (event.type === 'appointments' && Array.isArray(event.data)) {
        setAppointments(event.data);
      }
    });

    // Recurring interval every 30s to immediately auto-cancel appointments passing shift cutoffs
    const cancelInterval = setInterval(() => {
      autoCancelExpiredAppointments().catch((err) =>
        console.warn('[QueueManager] Interval auto-cancel note:', err)
      );
    }, 30000);

    return () => {
      supabase.removeChannel(channel);
      unsubscribeStore();
      clearInterval(cancelInterval);
    };
  }, [fetchDirectAppointments]);

  // Filters with local calendar date
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [shiftFilter, setShiftFilter] = useState<'all' | ShiftType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | AppointmentStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [reassignSuccessNotice, setReassignSuccessNotice] = useState('');
  const [expandedAptIds, setExpandedAptIds] = useState<Record<string, boolean>>({});

  // Reassignment Modal State
  const [reassignModalApt, setReassignModalApt] = useState<Appointment | null>(null);
  const [targetDate, setTargetDate] = useState('');
  const [targetShift, setTargetShift] = useState<ShiftType>('morning');
  const [reassignError, setReassignError] = useState('');

  const toggleCardExpand = (id: string) => {
    setExpandedAptIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Metrics calculation (excluding cancelled and expired)
  const todayAppointments = useMemo(() => {
    return appointments.filter((a) => a.booking_date === todayStr && a.status !== 'cancelled' && !isExpiredAppt(a));
  }, [appointments, todayStr]);

  // Dynamic Queue Calculation: Only active pending appointments count toward the waiting queue size
  const todayPendingQueue = useMemo(() => {
    return todayAppointments.filter((a) => a.status === 'pending');
  }, [todayAppointments]);

  const morningPendingCount = todayPendingQueue.filter((a) => a.shift === 'morning').length;
  const eveningPendingCount = todayPendingQueue.filter((a) => a.shift === 'evening').length;
  const completedTodayCount = todayAppointments.filter((a) => a.status === 'completed').length;
  const inConsultNow = todayAppointments.find((a) => a.status === 'in_consult');

  // Next day preview with local date
  const nextDateStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const ny = d.getFullYear();
    const nm = String(d.getMonth() + 1).padStart(2, '0');
    const nd = String(d.getDate()).padStart(2, '0');
    return `${ny}-${nm}-${nd}`;
  }, []);

  const nextDayPendingCount = useMemo(() => {
    return appointments.filter((a) => a.booking_date === nextDateStr && a.status === 'pending' && !isExpiredAppt(a)).length;
  }, [appointments, nextDateStr]);

  const nextDayTotalCount = useMemo(() => {
    return appointments.filter((a) => a.booking_date === nextDateStr && a.status !== 'cancelled' && !isExpiredAppt(a)).length;
  }, [appointments, nextDateStr]);

  // Filtered Queue
  const filteredQueue = useMemo(() => {
    return appointments.filter((a) => {
      const isExpired = isExpiredAppt(a);
      const effectiveStatus: AppointmentStatus = (a.status === 'cancelled' || isExpired) ? 'cancelled' : a.status;

      if (selectedDate && a.booking_date !== selectedDate) return false;
      if (shiftFilter !== 'all' && a.shift !== shiftFilter) return false;
      if (statusFilter !== 'all' && effectiveStatus !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          a.patient_name.toLowerCase().includes(q) ||
          a.phone.includes(q) ||
          a.token_number.toLowerCase().includes(q) ||
          a.patient_id.toLowerCase().includes(q) ||
          a.address.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    }).sort((a, b) => {
      // Sort by shift first (morning then evening) then by sequential queue position
      if (a.shift !== b.shift) {
        return a.shift === 'morning' ? -1 : 1;
      }
      const posA = getDisplayQueueNumber(a);
      const posB = getDisplayQueueNumber(b);
      if (posA !== posB) return posA - posB;
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });
  }, [appointments, selectedDate, shiftFilter, statusFilter, searchQuery]);

  // Handle Shift Reassignment (e.g. evening patient arrives early morning)
  const handleShiftReassign = async (appointment: Appointment, targetShift: ShiftType) => {
    try {
      const updated = await reassignAppointmentShift(appointment.id, targetShift);
      if (updated) {
        setReassignSuccessNotice(
          `Patient ${appointment.patient_name} shifted to ${targetShift.toUpperCase()} shift with Token ${updated.token_number} (Queue #${updated.queue_position}).`
        );
        setTimeout(() => setReassignSuccessNotice(''), 4000);
      }
    } catch (err: any) {
      alert(`Could not reassign shift: ${err.message}`);
    }
  };

  const openReassignModal = (apt: Appointment) => {
    setReassignModalApt(apt);
    setTargetDate(apt.booking_date);
    setTargetShift(apt.shift);
    setReassignError('');
  };

  const handleConfirmReassign = async () => {
    if (!reassignModalApt) return;
    setReassignError('');

    const dateObj = new Date(targetDate + 'T00:00:00');
    if (dateObj.getDay() === 5) {
      setReassignError('The clinic is closed on Fridays. Please select Saturday to Thursday.');
      return;
    }

    try {
      const updated = await reassignAppointmentSlot(reassignModalApt.id, targetDate, targetShift);
      if (updated) {
        setReassignSuccessNotice(
          `Reassigned ${reassignModalApt.patient_name} to ${targetDate} (${targetShift.toUpperCase()} shift). New Token: ${updated.token_number} (Queue #${updated.queue_position}).`
        );
        setTimeout(() => setReassignSuccessNotice(''), 5000);
        setReassignModalApt(null);
      }
    } catch (err: any) {
      setReassignError(err.message || 'Failed to reassign slot');
    }
  };

  // Handle Mark Completed
  const handleMarkStatus = async (appointmentId: string, newStatus: AppointmentStatus) => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
    } catch (err: any) {
      alert(`Could not update appointment status: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Clinic Patient Queue & Shift Manager</span>
            <span className={`text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isRealtimeActive 
                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300' 
                : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isRealtimeActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              {isRealtimeActive ? 'Supabase Realtime Live' : 'Supabase Live Connected'}
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Dr. M. A. Haque, M.D. (Homeo) • Managing Chamber Queue & Emergency Shift Reassignments
          </p>
          {fetchError && (
            <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {fetchError}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-refresh-queue"
            type="button"
            onClick={fetchDirectAppointments}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 shadow-sm transition cursor-pointer disabled:opacity-50"
            title="Fetch live appointments directly from Supabase"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Syncing...' : 'Sync Supabase'}</span>
          </button>

          <button
            id="btn-export-queue-csv"
            onClick={() => exportAppointmentsToCSV(filteredQueue)}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 shadow-sm transition cursor-pointer"
          >
            <FileDown className="w-4 h-4 text-emerald-600" />
            <span>Export Queue (CSV)</span>
          </button>
        </div>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Today's Active Waiting Queue */}
        <button
          type="button"
          onClick={() => setSelectedDate(todayStr)}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition cursor-pointer space-y-2 ${
            selectedDate === todayStr
              ? 'bg-white dark:bg-slate-800 border-emerald-600 ring-2 ring-emerald-600/30 shadow-md'
              : 'bg-white dark:bg-slate-800 border-emerald-950/10 dark:border-slate-700 hover:border-emerald-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Today's Active Queue</span>
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] dark:text-emerald-400">
              {todayPendingQueue.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {completedTodayCount} done / {todayAppointments.length} total
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            {todayPendingQueue.length === 0 ? 'All patients attended' : `${todayPendingQueue.length} patients waiting in chamber`}
          </p>
        </button>

        {/* Morning Shift Count */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Morning Shift Slot</span>
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {morningPendingCount}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
              10:00 AM – 12:30 PM
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Pending Waiting: {morningPendingCount} patients
          </p>
        </div>

        {/* Evening Shift Count */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Evening Shift Slot</span>
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {eveningPendingCount}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
              6:00 PM – 8:30 PM
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Pending Waiting: {eveningPendingCount} patients
          </p>
        </div>

        {/* Next Day Queue Preview (Clickable to switch date filter) */}
        <button
          type="button"
          id="btn-next-day-preview-card"
          onClick={() => setSelectedDate(nextDateStr)}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition cursor-pointer space-y-2 ${
            selectedDate === nextDateStr
              ? 'bg-emerald-100/90 dark:bg-emerald-950/80 border-emerald-600 ring-2 ring-emerald-600/40 shadow-md'
              : 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-slate-800 dark:to-emerald-950/30 border-emerald-200 dark:border-slate-700 hover:border-emerald-400 shadow-sm'
          }`}
          title="Click to switch date filter to tomorrow"
        >
          <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
            <span>Next Day Queue Preview</span>
            <Calendar className="w-4 h-4" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] dark:text-emerald-300">
              {nextDayPendingCount}
            </span>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              {selectedDate === nextDateStr ? 'Viewing Tomorrow' : 'Click to View'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Tomorrow ({nextDateStr}) • {nextDayTotalCount} registered
          </p>
        </button>
      </div>

      {/* Dynamic Shift Reassignment Notice */}
      {reassignSuccessNotice && (
        <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{reassignSuccessNotice}</span>
        </div>
      )}

      {/* FILTER & SEARCH CONTROLS */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            id="queue-search-input"
            type="text"
            placeholder="Search queue by patient name, token, phone or area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        {/* Date, Shift, and Status Selectors */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 font-semibold"
            />
          </div>

          <select
            value={shiftFilter}
            onChange={(e) => setShiftFilter(e.target.value as any)}
            className="px-3 py-1.5 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 font-medium"
          >
            <option value="all">All Shifts</option>
            <option value="morning">Morning (10AM - 12:30PM)</option>
            <option value="evening">Evening (6PM - 8:30PM)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_consult">In Consult</option>
            <option value="completed">Completed</option>
          </select>

          {selectedDate !== todayStr && (
            <button
              type="button"
              onClick={() => setSelectedDate(todayStr)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-700 transition"
            >
              Reset to Today
            </button>
          )}
        </div>
      </div>

      {/* QUEUE ROSTER CONTAINER */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-emerald-950/10 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
            Queue Roster ({filteredQueue.length} {filteredQueue.length === 1 ? 'Patient' : 'Patients'})
          </h3>
          <span className="text-[11px] sm:text-xs text-slate-500">Sorted by Shift & Position</span>
        </div>

        {filteredQueue.length === 0 ? (
          <div className="p-10 sm:p-12 text-center text-slate-500 dark:text-slate-400 space-y-2">
            <Users className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-sm">No appointments found for selected filter</p>
            <p className="text-xs">Appointments booked online or walk-in entries for {selectedDate} will appear here in real-time.</p>
          </div>
        ) : (
          <>
            {/* 1. MOBILE & TABLET EXPANDABLE CARDS (Shown on screens < 1024px) */}
            <div className="block lg:hidden divide-y divide-slate-100 dark:divide-slate-700/80">
              {filteredQueue.map((apt, index) => {
                const isExpanded = !!expandedAptIds[apt.id];
                return (
                  <div
                    key={`card-${apt.id || apt.token_number || index}`}
                    className={`p-3.5 sm:p-4 transition ${
                      apt.status === 'in_consult'
                        ? 'bg-amber-50/40 dark:bg-amber-950/20'
                        : apt.status === 'completed'
                        ? 'bg-slate-50/50 dark:bg-slate-900/30'
                        : 'hover:bg-slate-50/70 dark:hover:bg-slate-750'
                    }`}
                  >
                    {/* Header Row: Token #, Queue #, Patient Name, Time Slot, Status Badge, Chevron */}
                    <div
                      className="flex items-center justify-between gap-2.5 cursor-pointer select-none"
                      onClick={() => toggleCardExpand(apt.id)}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 font-extrabold flex items-center justify-center text-xs shrink-0">
                          #{getDisplayQueueNumber(apt, index)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                              {apt.patient_name}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold tracking-wide shrink-0 ${
                                apt.age != null && !isNaN(Number(apt.age)) && Number(apt.age) > 0
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                              }`}
                              title={apt.age != null && Number(apt.age) > 0 ? `Age: ${apt.age} years` : 'Age not provided'}
                            >
                              {apt.age != null && !isNaN(Number(apt.age)) && Number(apt.age) > 0 ? `${apt.age} yrs` : 'Age: N/A'}
                            </span>
                            <span className="font-mono text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                              {apt.token_number}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            <span className="capitalize font-semibold text-slate-600 dark:text-slate-300">
                              {apt.shift} Slot ({apt.shift === 'morning' ? '10AM - 12:30PM' : '6PM - 8:30PM'})
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isExpiredAppt(apt) || apt.status === 'cancelled' ? (
                          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900">
                            Cancelled
                          </span>
                        ) : apt.status === 'in_consult' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Consulting
                          </span>
                        ) : apt.status === 'completed' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Completed
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                            Pending
                          </span>
                        )}

                        <button
                          type="button"
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          aria-label={isExpanded ? 'Collapse card details' : 'Expand card details'}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Body */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 space-y-3 animate-fade-in text-xs">
                        {/* Complaints & Symptoms */}
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                            Chief Complaints / Symptoms:
                          </span>
                          <p className="text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl text-xs">
                            {apt.symptoms_summary || <span className="text-slate-400 italic">No symptoms entered</span>}
                          </p>
                        </div>

                        {/* Patient Contact, Age & Address Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="font-semibold">Age:</span>
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              {apt.age != null && !isNaN(Number(apt.age)) && Number(apt.age) > 0 ? `${apt.age} yrs` : 'Age: N/A'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="font-semibold">Phone:</span>
                            <span>{apt.phone}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="font-semibold">Location:</span>
                            <span className="truncate">{apt.address}</span>
                          </div>
                        </div>

                        {/* Action Buttons & Status Toggles */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                          {/* Left: Shift reassign & mark completed */}
                          <div className="flex items-center gap-2">
                            {apt.status !== 'completed' ? (
                              <button
                                type="button"
                                onClick={() => handleMarkStatus(apt.id, 'completed')}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold text-[11px] flex items-center gap-1 border border-emerald-200 dark:border-emerald-800"
                              >
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Mark Completed</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleMarkStatus(apt.id, 'pending')}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-[11px] flex items-center gap-1"
                              >
                                <Clock className="w-3 h-3" />
                                <span>Re-open Pending</span>
                              </button>
                            )}

                            {apt.status !== 'completed' && (
                              <button
                                type="button"
                                disabled={isExpiredAppt(apt) || apt.status === 'cancelled'}
                                onClick={() => openReassignModal(apt)}
                                className={`px-2.5 py-1.5 rounded-lg border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-semibold text-[11px] flex items-center gap-1 ${
                                  isExpiredAppt(apt) || apt.status === 'cancelled'
                                    ? 'opacity-30 pointer-events-none cursor-not-allowed bg-slate-200 dark:bg-slate-800 text-slate-400'
                                    : 'bg-amber-50 dark:bg-amber-950/40'
                                }`}
                                title={isExpiredAppt(apt) || apt.status === 'cancelled' ? "Expired / Cancelled" : "Reassign slot or date"}
                              >
                                <ArrowRightLeft className="w-3 h-3" />
                                <span>Reassign Slot / Date</span>
                              </button>
                            )}
                          </div>

                          {/* Right: Start Consult & Create Bill */}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onOpenBilling(apt)}
                              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition"
                            >
                              <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Create Bill</span>
                            </button>

                            <button
                              type="button"
                              disabled={isExpiredAppt(apt) || apt.status === 'cancelled'}
                              onClick={() => onStartConsult(apt)}
                              className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition ${
                                isExpiredAppt(apt) || apt.status === 'cancelled'
                                  ? 'opacity-30 pointer-events-none cursor-not-allowed bg-slate-200 dark:bg-slate-800 text-slate-400'
                                  : 'bg-[#1B4332] hover:bg-[#2D6A4F] text-white'
                              }`}
                            >
                              <Stethoscope className="w-3.5 h-3.5 text-emerald-300" />
                              <span>Start Consult</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 2. DESKTOP COMPREHENSIVE TABLE VIEW (Shown on screens >= 1024px) */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 uppercase font-bold">
                    <th className="py-3 px-4">Pos / Token</th>
                    <th className="py-3 px-4">Patient Info</th>
                    <th className="py-3 px-4">Shift Slot</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Complaints</th>
                    <th className="py-3 px-4 text-right">Actions & Shift Reassign</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filteredQueue.map((apt, index) => (
                    <tr
                      key={apt.id || `row-${apt.token_number || index}`}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-750 transition ${
                        apt.status === 'in_consult'
                          ? 'bg-amber-50/50 dark:bg-amber-950/20 font-medium'
                          : ''
                      }`}
                    >
                      {/* Position & Token */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 font-extrabold flex items-center justify-center text-xs">
                            #{getDisplayQueueNumber(apt, index)}
                          </span>
                          <div>
                            <span className="font-mono font-bold text-slate-900 dark:text-white block">
                              {apt.token_number}
                            </span>
                            <span className="text-[10px] text-slate-400 block font-mono">
                              {apt.patient_id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Patient Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">
                            {apt.patient_name}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${
                              apt.age != null && !isNaN(Number(apt.age)) && Number(apt.age) > 0
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                            }`}
                            title={apt.age != null && Number(apt.age) > 0 ? `Age: ${apt.age} years` : 'Age not provided'}
                          >
                            {apt.age != null && !isNaN(Number(apt.age)) && Number(apt.age) > 0 ? `${apt.age} yrs` : 'Age: N/A'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {apt.phone}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {apt.address}
                          </span>
                        </div>
                      </td>

                      {/* Shift */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full font-bold uppercase tracking-wider text-[11px] ${
                          apt.shift === 'morning'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                        }`}>
                          {apt.shift}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-1">
                          {apt.shift === 'morning' ? '10 AM - 12:30 PM' : '6 PM - 8:30 PM'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isExpiredAppt(apt) || apt.status === 'cancelled' ? (
                          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900">
                            Cancelled
                          </span>
                        ) : apt.status === 'in_consult' ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1.5 w-max animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            In Consult
                          </span>
                        ) : apt.status === 'completed' ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1 w-max">
                            <CheckCircle2 className="w-3 h-3" />
                            Completed
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 w-max block">
                            Pending
                          </span>
                        )}
                      </td>

                      {/* Symptoms summary */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-slate-600 dark:text-slate-300 truncate" title={apt.symptoms_summary}>
                          {apt.symptoms_summary || <span className="text-slate-400 italic">None noted</span>}
                        </p>
                      </td>

                      {/* Actions & Shift Reassignment */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {/* Start Consult */}
                          <button
                            type="button"
                            id={`btn-start-consult-${apt.id}`}
                            disabled={isExpiredAppt(apt) || apt.status === 'cancelled'}
                            onClick={() => onStartConsult(apt)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-sm ${
                              isExpiredAppt(apt) || apt.status === 'cancelled'
                                ? 'opacity-30 pointer-events-none cursor-not-allowed bg-slate-200 dark:bg-slate-800 text-slate-400'
                                : 'bg-[#1B4332] hover:bg-[#2D6A4F] text-white cursor-pointer'
                            }`}
                            title={isExpiredAppt(apt) || apt.status === 'cancelled' ? "Expired / Cancelled" : "Open Doctor Consultation & Prescription Chamber"}
                          >
                            <Stethoscope className="w-3.5 h-3.5" />
                            <span>Start Consult</span>
                          </button>

                          {/* Bill / Invoice */}
                          <button
                            type="button"
                            id={`btn-bill-${apt.id}`}
                            onClick={() => onOpenBilling(apt)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                            title="Generate Invoice & Receipt"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                          </button>

                          {/* Dynamic Slot / Date Reassignment Button */}
                          {apt.status !== 'completed' && (
                            <button
                              type="button"
                              id={`btn-reassign-${apt.id}`}
                              disabled={isExpiredAppt(apt) || apt.status === 'cancelled'}
                              onClick={() => openReassignModal(apt)}
                              className={`px-2.5 py-1.5 rounded-lg border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center gap-1 transition ${
                                isExpiredAppt(apt) || apt.status === 'cancelled'
                                  ? 'opacity-30 pointer-events-none cursor-not-allowed bg-slate-200 dark:bg-slate-800 text-slate-400'
                                  : 'bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 cursor-pointer'
                              }`}
                              title={isExpiredAppt(apt) || apt.status === 'cancelled' ? "Expired / Cancelled" : "Reassign Slot or Date"}
                            >
                              <ArrowRightLeft className="w-3.5 h-3.5" />
                              <span className="hidden xl:inline">Reassign</span>
                            </button>
                          )}

                          {/* Mark Completed quick toggle */}
                          {apt.status !== 'completed' ? (
                            <button
                              type="button"
                              onClick={() => handleMarkStatus(apt.id, 'completed')}
                              className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition cursor-pointer"
                              title="Mark as Completed"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleMarkStatus(apt.id, 'pending')}
                              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                              title="Re-open into Pending"
                            >
                              <Clock className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Reassign Slot / Date Modal Dialog */}
      {reassignModalApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg max-h-[90vh] md:max-h-[88vh] flex flex-col bg-[#FAF7EE] dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-emerald-900/20">
            {/* Header */}
            <div className="shrink-0 p-4 border-b border-stone-200 dark:border-slate-800 flex justify-between items-center bg-white/70 dark:bg-slate-900/80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
                  <ArrowRightLeft className="w-5 h-5 text-amber-100" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    Reassign Slot / Date
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Patient: {reassignModalApt.patient_name} ({reassignModalApt.token_number})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReassignModalApt(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-stone-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <ChevronUp className="w-5 h-5 rotate-45" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 overscroll-contain">
              {reassignError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{reassignError}</span>
                </div>
              )}

              {/* Current details badge */}
              <div className="p-3 rounded-xl bg-stone-100 dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 text-xs flex items-center justify-between">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">CURRENT ASSIGNMENT</span>
                  <span className="font-bold text-slate-900 dark:text-white">{reassignModalApt.booking_date}</span>
                </div>
                <span className="px-2 py-1 rounded-md bg-stone-200 dark:bg-slate-700 font-bold capitalize text-slate-700 dark:text-slate-200">
                  {reassignModalApt.shift} Shift
                </span>
              </div>

              {/* Quick Date Buttons */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  1. Choose Date
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2.5">
                  <button
                    type="button"
                    onClick={() => setTargetDate(todayStr)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      targetDate === todayStr
                        ? 'border-[#1B4332] bg-emerald-100/70 dark:bg-emerald-950/60 text-[#1B4332] dark:text-emerald-300'
                        : 'border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Move to Today ({todayStr})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetDate(nextDateStr)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      targetDate === nextDateStr
                        ? 'border-[#1B4332] bg-emerald-100/70 dark:bg-emerald-950/60 text-[#1B4332] dark:text-emerald-300'
                        : 'border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Move to Tomorrow ({nextDateStr})
                  </button>
                </div>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="date"
                    min={todayStr}
                    value={targetDate}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val) return;
                      const d = new Date(val + 'T00:00:00');
                      if (d.getDay() === 5) {
                        setReassignError('Fridays are clinic closed days. Pick another date.');
                        return;
                      }
                      setReassignError('');
                      setTargetDate(val);
                    }}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                  />
                </div>
              </div>

              {/* Shift Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  2. Choose Shift
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setTargetShift('morning')}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      targetShift === 'morning'
                        ? 'border-[#1B4332] bg-emerald-100/70 dark:bg-emerald-950/60 ring-2 ring-[#1B4332]/40 text-[#1B4332] dark:text-emerald-300 font-bold'
                        : 'border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">Morning Shift</span>
                      <Clock className="w-3.5 h-3.5 opacity-70" />
                    </div>
                    <p className="text-[11px] opacity-80 mt-0.5">10:00 AM – 12:30 PM</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetShift('evening')}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      targetShift === 'evening'
                        ? 'border-[#1B4332] bg-emerald-100/70 dark:bg-emerald-950/60 ring-2 ring-[#1B4332]/40 text-[#1B4332] dark:text-emerald-300 font-bold'
                        : 'border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">Evening Shift</span>
                      <Clock className="w-3.5 h-3.5 opacity-70" />
                    </div>
                    <p className="text-[11px] opacity-80 mt-0.5">6:00 PM – 8:30 PM</p>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 p-4 border-t border-stone-200 dark:border-slate-800 bg-stone-50/90 dark:bg-slate-900/90 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setReassignModalApt(null)}
                className="px-4 py-2 rounded-xl border border-stone-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-confirm-reassign-slot"
                onClick={handleConfirmReassign}
                className="px-5 py-2 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs sm:text-sm font-bold shadow-md transition cursor-pointer"
              >
                Update & Reassign Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

