import React, { useState, useMemo } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { Appointment, ShiftType, AppointmentStatus, UserProfile } from '../types';
import { 
  getAppointments, 
  updateAppointmentStatus, 
  reassignAppointmentShift 
} from '../services/clinicStore';
import { exportAppointmentsToCSV } from '../utils/exportUtils';

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
  const appointments = getAppointments();

  // Filters
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [shiftFilter, setShiftFilter] = useState<'all' | ShiftType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | AppointmentStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [reassignSuccessNotice, setReassignSuccessNotice] = useState('');

  // Metrics calculation
  const todayAppointments = useMemo(() => {
    return appointments.filter((a) => a.booking_date === todayStr && a.status !== 'cancelled');
  }, [appointments, todayStr]);

  const morningCount = todayAppointments.filter((a) => a.shift === 'morning').length;
  const eveningCount = todayAppointments.filter((a) => a.shift === 'evening').length;
  const inConsultNow = todayAppointments.find((a) => a.status === 'in_consult');

  // Next day preview
  const nextDateStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  const nextDayCount = useMemo(() => {
    return appointments.filter((a) => a.booking_date === nextDateStr && a.status !== 'cancelled').length;
  }, [appointments, nextDateStr]);

  // Filtered Queue
  const filteredQueue = useMemo(() => {
    return appointments.filter((a) => {
      if (selectedDate && a.booking_date !== selectedDate) return false;
      if (shiftFilter !== 'all' && a.shift !== shiftFilter) return false;
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
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
      // Sort by shift first (morning then evening) then by queue_position
      if (a.shift !== b.shift) {
        return a.shift === 'morning' ? -1 : 1;
      }
      return a.queue_position - b.queue_position;
    });
  }, [appointments, selectedDate, shiftFilter, statusFilter, searchQuery]);

  // Handle Shift Reassignment (e.g. evening patient arrives early morning)
  const handleShiftReassign = (appointment: Appointment, targetShift: ShiftType) => {
    const updated = reassignAppointmentShift(appointment.id, targetShift);
    if (updated) {
      setReassignSuccessNotice(
        `Patient ${appointment.patient_name} shifted to ${targetShift.toUpperCase()} shift with Token ${updated.token_number} (Queue #${updated.queue_position}).`
      );
      setTimeout(() => setReassignSuccessNotice(''), 4000);
    }
  };

  // Handle Mark Completed
  const handleMarkStatus = (appointmentId: string, newStatus: AppointmentStatus) => {
    updateAppointmentStatus(appointmentId, newStatus);
  };

  return (
    <div className="space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Clinic Patient Queue & Shift Manager</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold uppercase tracking-wider">
              Live Real-Time
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Dr. M. A. Haque, M.D. (Homeo) • Managing Chamber Queue & Emergency Shift Reassignments
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-export-queue-csv"
            onClick={() => exportAppointmentsToCSV(filteredQueue)}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 shadow-sm transition"
          >
            <FileDown className="w-4 h-4 text-emerald-600" />
            <span>Export Queue (CSV)</span>
          </button>
        </div>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Total Queue */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Today's Total Queue</span>
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-[#1B4332] dark:text-emerald-400">
              {todayAppointments.length}
            </span>
            <span className="text-xs text-slate-500">Confirmed</span>
          </div>
          <p className="text-[11px] text-slate-400">Date: {todayStr}</p>
        </div>

        {/* Morning Shift Count */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Morning Shift Slot</span>
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {morningCount}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
              10:00 AM – 12:30 PM
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Pending: {todayAppointments.filter((a) => a.shift === 'morning' && a.status === 'pending').length}
          </p>
        </div>

        {/* Evening Shift Count */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Evening Shift Slot</span>
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {eveningCount}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
              6:00 PM – 8:30 PM
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Pending: {todayAppointments.filter((a) => a.shift === 'evening' && a.status === 'pending').length}
          </p>
        </div>

        {/* Next Day Queue Preview */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-slate-800 dark:to-emerald-950/30 border border-emerald-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
            <span>Next Day Queue Preview</span>
            <Calendar className="w-4 h-4" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-[#1B4332] dark:text-emerald-300">
              {nextDayCount}
            </span>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Pre-Booked</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Date: {nextDateStr}</p>
        </div>
      </div>

      {/* Dynamic Shift Reassignment Notice */}
      {reassignSuccessNotice && (
        <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{reassignSuccessNotice}</span>
        </div>
      )}

      {/* FILTER & SEARCH CONTROLS */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            id="queue-search-input"
            type="text"
            placeholder="Search queue by patient name, token, phone or area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        {/* Date, Shift, and Status Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200"
          />

          <select
            value={shiftFilter}
            onChange={(e) => setShiftFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 font-medium"
          >
            <option value="all">All Shifts</option>
            <option value="morning">Morning Shift (10AM - 12:30PM)</option>
            <option value="evening">Evening Shift (6PM - 8:30PM)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_consult">In Consult</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* QUEUE TABLE / LIST */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-emerald-950/10 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Queue Roster ({filteredQueue.length} {filteredQueue.length === 1 ? 'Patient' : 'Patients'})
          </h3>
          <span className="text-xs text-slate-500">Sorted by Shift & Position</span>
        </div>

        {filteredQueue.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 space-y-2">
            <Users className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-sm">No appointments booked for this date</p>
            <p className="text-xs">Appointments booked online or walk-in entries for {selectedDate} will appear here in real-time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
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
                {filteredQueue.map((apt) => (
                  <tr
                    key={apt.id}
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
                          #{apt.queue_position}
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
                      <div className="font-bold text-slate-900 dark:text-white text-sm">
                        {apt.patient_name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
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
                      {apt.status === 'in_consult' ? (
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
                          onClick={() => onStartConsult(apt)}
                          className="px-3 py-1.5 rounded-lg bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                          title="Open Doctor Consultation & Prescription Chamber"
                        >
                          <Stethoscope className="w-3.5 h-3.5" />
                          <span>Start Consult</span>
                        </button>

                        {/* Bill / Invoice */}
                        <button
                          type="button"
                          id={`btn-bill-${apt.id}`}
                          onClick={() => onOpenBilling(apt)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                          title="Generate Invoice & Receipt"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                        </button>

                        {/* Dynamic Shift Reassignment Button (e.g. evening to morning emergency) */}
                        {apt.status !== 'completed' && (
                          <div className="relative group inline-block">
                            <button
                              type="button"
                              onClick={() => {
                                const target = apt.shift === 'morning' ? 'evening' : 'morning';
                                handleShiftReassign(apt, target);
                              }}
                              className="p-1.5 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 transition"
                              title={`Emergency Reassign to ${apt.shift === 'morning' ? 'Evening' : 'Morning'} Shift`}
                            >
                              <ArrowRightLeft className="w-3.5 h-3.5" />
                            </button>
                            <span className="hidden group-hover:block absolute right-0 top-8 z-10 w-48 p-2 rounded-lg bg-slate-900 text-white text-[10px] text-center shadow-lg pointer-events-none">
                              Click to reassign to {apt.shift === 'morning' ? 'Evening' : 'Morning'} slot
                            </span>
                          </div>
                        )}

                        {/* Mark Completed quick toggle */}
                        {apt.status !== 'completed' ? (
                          <button
                            type="button"
                            onClick={() => handleMarkStatus(apt.id, 'completed')}
                            className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition"
                            title="Mark as Completed"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleMarkStatus(apt.id, 'pending')}
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
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
        )}
      </div>
    </div>
  );
};
