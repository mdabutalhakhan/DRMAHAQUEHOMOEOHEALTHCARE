import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Search,
  Sparkles,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  CalendarClock,
  ArrowRight,
  Phone,
  Check,
  RefreshCw,
  MapPin,
  CalendarCheck
} from 'lucide-react';
import { Appointment, ShiftType } from '../types';
import { 
  getAppointments, 
  subscribeToStore, 
  reassignAppointmentSlot, 
  isAppointmentExpired, 
  autoCancelExpiredAppointments 
} from '../services/clinicStore';

interface LiveTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveTrackerModal: React.FC<LiveTrackerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>(getAppointments());

  // Reschedule state
  const [reschedulingAptId, setReschedulingAptId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState<string>('');
  const [newShift, setNewShift] = useState<ShiftType>('morning');
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [rescheduleError, setRescheduleError] = useState<string>('');
  const [rescheduleSuccess, setRescheduleSuccess] = useState<string>('');

  // Lock background scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setAppointments(getAppointments());
      setRescheduleError('');
      setRescheduleSuccess('');
      // Check and auto-cancel expired pending appointments
      autoCancelExpiredAppointments().catch((err) =>
        console.warn('[LiveTrackerModal] Auto-cancel note:', err)
      );
    }
    const unsubscribe = subscribeToStore((event) => {
      if (event.type === 'appointments') {
        setAppointments(getAppointments());
      }
    });
    return () => unsubscribe();
  }, [isOpen]);

  // Today's live local date
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.trim().toLowerCase();
    return appointments.filter(
      (a) =>
        a.phone.includes(q) ||
        a.token_number.toLowerCase().includes(q) ||
        (a.patient_id && a.patient_id.toLowerCase().includes(q)) ||
        a.patient_name.toLowerCase().includes(q)
    );
  }, [appointments, searchQuery]);

  const todayAppointments = useMemo(() => {
    return appointments.filter((a) => a.booking_date === todayStr && a.status !== 'cancelled' && !isAppointmentExpired(a));
  }, [appointments, todayStr]);

  const morningQueue = todayAppointments.filter((a) => a.shift === 'morning');
  const eveningQueue = todayAppointments.filter((a) => a.shift === 'evening');

  if (!isOpen) return null;

  const handleStartReschedule = (apt: Appointment) => {
    setReschedulingAptId(apt.id);
    setNewDate(apt.booking_date);
    setNewShift(apt.shift);
    setRescheduleError('');
    setRescheduleSuccess('');
  };

  const handleConfirmReschedule = async (aptId: string) => {
    if (!newDate) {
      setRescheduleError('Please choose a valid appointment date.');
      return;
    }
    const dateObj = new Date(newDate + 'T00:00:00');
    if (dateObj.getDay() === 5) {
      setRescheduleError('The clinic is closed on Fridays. Please pick Saturday to Thursday.');
      return;
    }

    setRescheduleLoading(true);
    setRescheduleError('');
    try {
      const updated = await reassignAppointmentSlot(aptId, newDate, newShift);
      if (updated) {
        setAppointments(getAppointments());
        setRescheduleSuccess(
          `Slot updated! New Token: ${updated.token_number} (#${updated.queue_position} in ${updated.shift} queue)`
        );
        setTimeout(() => {
          setReschedulingAptId(null);
        }, 2500);
      } else {
        setRescheduleError('Could not find the appointment record to reschedule.');
      }
    } catch (err: any) {
      setRescheduleError(err.message || 'Failed to reschedule appointment slot.');
    } finally {
      setRescheduleLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl my-auto bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-emerald-100 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="shrink-0 p-4 sm:p-5 border-b border-stone-200 dark:border-slate-800 flex justify-between items-center bg-white/80 dark:bg-slate-900/90 backdrop-blur-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shadow-xs shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#1B4332] dark:text-emerald-300 leading-tight">
                Live Queue & Token Tracker
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                Dr. M. A. Haque Chamber • Real-Time Patient Status
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-stone-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close live tracker modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto overscroll-contain flex-1 min-h-0 p-5 md:p-6 space-y-6">
          
          {/* 1. Clean Search Input */}
          <div className="space-y-2">
            <label htmlFor="modal-tracker-search" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Find Your Appointment / Token
            </label>
            <div className="relative">
              <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                id="modal-tracker-search"
                type="text"
                placeholder="Enter 10-digit Phone or Token (e.g. 9933506514 or TK-...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-xs"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Suggestions if any */}
            {todayAppointments.length > 0 && !searchQuery && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-medium">Recent tokens:</span>
                {todayAppointments.slice(0, 3).map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setSearchQuery(a.phone)}
                    className="px-2 py-0.5 rounded-md bg-stone-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-100 font-mono transition text-[10px]"
                  >
                    {a.phone}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Search Results */}
          {searchQuery.trim() && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Matching Appointments ({searchResults.length})</span>
                <span>Live Verification</span>
              </div>

              {searchResults.length === 0 ? (
                <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-center space-y-1.5">
                  <AlertCircle className="w-6 h-6 text-amber-500 mx-auto" />
                  <p className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                    No active appointment found for "{searchQuery}"
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Please ensure the 10-digit phone number matches your booking. For help, contact chamber helpline: 9933506514.
                  </p>
                </div>
              ) : (
                searchResults.map((apt) => {
                  const isExpired = isAppointmentExpired(apt);
                  const isCancelled = apt.status === 'cancelled' || isExpired;
                  const isPending = apt.status === 'pending' && !isExpired;
                  const isEditingThis = reschedulingAptId === apt.id;

                  // Ahead in line calculation for the same shift
                  const priorInShift = appointments.filter(
                    (a) =>
                      a.booking_date === apt.booking_date &&
                      a.shift === apt.shift &&
                      a.status === 'pending' &&
                      !isAppointmentExpired(a) &&
                      a.queue_position < apt.queue_position
                  ).length;

                  return (
                    <div
                      key={apt.id}
                      className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-900/15 dark:border-slate-700 shadow-sm space-y-3"
                    >
                      {/* Top Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100 dark:border-slate-700">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base text-slate-900 dark:text-white">
                              {apt.patient_name}
                            </h3>
                            <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                              {apt.shift} Slot
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Patient ID: <strong className="font-mono text-slate-700 dark:text-slate-300">{apt.patient_id}</strong> • Phone: {apt.phone}
                          </p>
                        </div>

                        {/* Status Badge */}
                        <div>
                          {apt.status === 'in_consult' ? (
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-amber-500" />
                              Inside Doctor Chamber
                            </span>
                          ) : apt.status === 'completed' ? (
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Consulted & Done
                            </span>
                          ) : isCancelled ? (
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300 border border-red-200 dark:border-red-800">
                              Cancelled
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              Waiting in Queue
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 4 Metrics Grid: Patient Name, Token ID, Position in Queue, Shift */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-slate-900/60 border border-stone-100 dark:border-slate-800">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Token Number</span>
                          <span className="font-mono font-bold text-xs sm:text-sm text-[#1B4332] dark:text-emerald-400 truncate block mt-0.5">
                            {apt.token_number}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-slate-900/60 border border-stone-100 dark:border-slate-800">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Queue Position</span>
                          <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white block mt-0.5">
                            #{apt.queue_position}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-slate-900/60 border border-stone-100 dark:border-slate-800">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Ahead in Line</span>
                          <span className="font-bold text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 block mt-0.5">
                            {apt.status === 'completed' ? '0 (Done)' : isCancelled ? '0 (Cancelled)' : `${priorInShift} patient(s)`}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-slate-900/60 border border-stone-100 dark:border-slate-800">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Date & Shift</span>
                          <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 block mt-0.5 truncate">
                            {apt.booking_date} ({apt.shift === 'morning' ? '10AM' : '6PM'})
                          </span>
                        </div>
                      </div>

                      {/* Reschedule Button / Inline Reschedule Drawer (Only for non-cancelled/non-expired pending) */}
                      {isPending && !isCancelled && (
                        <div className="pt-2 border-t border-stone-100 dark:border-slate-700">
                          {!isEditingThis ? (
                            <button
                              type="button"
                              onClick={() => handleStartReschedule(apt)}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-100 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 transition cursor-pointer"
                            >
                              <CalendarClock className="w-3.5 h-3.5" />
                              <span>Reschedule Slot / Date</span>
                            </button>
                          ) : (
                            <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-slate-900/80 border border-emerald-200 dark:border-slate-700 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-[#1B4332] dark:text-emerald-300 flex items-center gap-1.5">
                                  <CalendarClock className="w-4 h-4" />
                                  <span>Select New Consultation Slot</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setReschedulingAptId(null)}
                                  className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                >
                                  Cancel
                                </button>
                              </div>

                              {rescheduleError && (
                                <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                                  {rescheduleError}
                                </p>
                              )}
                              {rescheduleSuccess && (
                                <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                                  {rescheduleSuccess}
                                </p>
                              )}

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                <div>
                                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                                    New Date (Sat–Thu)
                                  </label>
                                  <input
                                    type="date"
                                    min={todayStr}
                                    value={newDate}
                                    onChange={(e) => {
                                      setNewDate(e.target.value);
                                      setRescheduleError('');
                                    }}
                                    className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                                    Consultation Shift
                                  </label>
                                  <select
                                    value={newShift}
                                    onChange={(e) => setNewShift(e.target.value as ShiftType)}
                                    className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                  >
                                    <option value="morning">Morning (10:00 AM – 12:30 PM)</option>
                                    <option value="evening">Evening (6:00 PM – 8:30 PM)</option>
                                  </select>
                                </div>
                              </div>

                              <button
                                type="button"
                                disabled={rescheduleLoading}
                                onClick={() => handleConfirmReschedule(apt.id)}
                                className="w-full py-2.5 rounded-lg bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                              >
                                {rescheduleLoading ? (
                                  <>
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                    <span>Updating Slot...</span>
                                  </>
                                ) : (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Confirm Reschedule</span>
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* When Cancelled or Expired: Hide Reschedule button and show notice */}
                      {isCancelled && (
                        <div className="pt-2 border-t border-stone-100 dark:border-slate-700">
                          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0 text-red-500 dark:text-red-400" />
                            <span className="font-medium">Clinic hours passed. Please book a fresh appointment.</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* 3. Today's Live Queue Board */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Today's Live Queue Board ({todayStr})</span>
              </h3>
              <span className="text-[11px] font-medium text-slate-500">
                {todayAppointments.length} Booked Today
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Morning Slot Queue */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-slate-700">
                  <span className="font-bold text-xs text-slate-800 dark:text-white">Morning Slot</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    10 AM – 12:30 PM
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Total: <strong>{morningQueue.length}</strong></span>
                  <span>Pending: <strong>{morningQueue.filter((a) => a.status === 'pending').length}</strong></span>
                </div>

                {morningQueue.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2 text-center">No morning bookings</p>
                ) : (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {morningQueue.map((a) => (
                      <div
                        key={a.id}
                        className="p-1.5 rounded-lg bg-stone-50 dark:bg-slate-900 flex items-center justify-between text-xs"
                      >
                        <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                          #{a.queue_position} {a.patient_name}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0 ${
                            a.status === 'in_consult'
                              ? 'bg-amber-100 text-amber-800'
                              : a.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {a.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Evening Slot Queue */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-slate-700">
                  <span className="font-bold text-xs text-slate-800 dark:text-white">Evening Slot</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    6:00 PM – 8:30 PM
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Total: <strong>{eveningQueue.length}</strong></span>
                  <span>Pending: <strong>{eveningQueue.filter((a) => a.status === 'pending').length}</strong></span>
                </div>

                {eveningQueue.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2 text-center">No evening bookings</p>
                ) : (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {eveningQueue.map((a) => (
                      <div
                        key={a.id}
                        className="p-1.5 rounded-lg bg-stone-50 dark:bg-slate-900 flex items-center justify-between text-xs"
                      >
                        <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                          #{a.queue_position} {a.patient_name}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0 ${
                            a.status === 'in_consult'
                              ? 'bg-amber-100 text-amber-800'
                              : a.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {a.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="shrink-0 p-3.5 sm:p-4 border-t border-stone-200 dark:border-slate-800 bg-stone-50/90 dark:bg-slate-900/90 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-xs sm:text-sm shadow-sm transition cursor-pointer"
          >
            Close / Done
          </button>
        </div>
      </div>
    </div>
  );
};
