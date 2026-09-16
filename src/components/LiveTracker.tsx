import React, { useState, useMemo, useEffect } from 'react';
import { Search, Sparkles, Clock, CheckCircle2, User, Phone, MapPin, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { getAppointments, subscribeToStore } from '../services/clinicStore';
import { Appointment } from '../types';

interface LiveTrackerProps {
  onBackHome?: () => void;
}

export const LiveTracker: React.FC<LiveTrackerProps> = ({ onBackHome }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>(getAppointments());

  useEffect(() => {
    setAppointments(getAppointments());
    const unsubscribe = subscribeToStore((event) => {
      if (event.type === 'appointments') {
        setAppointments(getAppointments());
      }
    });
    return () => unsubscribe();
  }, []);

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

  // Today's live queue summary
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = useMemo(() => {
    return appointments.filter((a) => a.booking_date === todayStr && a.status !== 'cancelled');
  }, [appointments, todayStr]);

  const morningQueue = todayAppointments.filter((a) => a.shift === 'morning');
  const eveningQueue = todayAppointments.filter((a) => a.shift === 'evening');

  const currentlyConsulting = todayAppointments.find((a) => a.status === 'in_consult');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {onBackHome && (
        <button
          type="button"
          onClick={onBackHome}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-emerald-200 transition mb-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Homepage</span>
        </button>
      )}

      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Patient Live Queue Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Track Your Token & Waiting Status
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          Enter your registered 10-digit Phone Number or Token ID (`TK-...`) to check your real-time position in Dr. M. A. Haque's clinic queue.
        </p>
      </div>

      {/* Search Box */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 shadow-md">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
          <input
            id="tracker-search-input"
            type="text"
            placeholder="Enter Phone Number or Token (e.g. 9832104567 or TK-2026...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900 text-slate-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        {/* Quick Demo Tokens */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>Quick test:</span>
          {todayAppointments.slice(0, 3).map((a) => (
            <button
              key={a.id}
              onClick={() => setSearchQuery(a.phone)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition font-mono text-[11px]"
            >
              {a.phone} ({a.patient_name.split(' ')[0]})
            </button>
          ))}
        </div>
      </div>

      {/* Search Results */}
      {searchQuery.trim() && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>Found {searchResults.length} {searchResults.length === 1 ? 'Appointment' : 'Appointments'}</span>
            <span className="text-xs text-slate-500">Live Status</span>
          </h2>

          {searchResults.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="font-semibold text-slate-800 dark:text-slate-200">No appointment found matching "{searchQuery}"</p>
              <p className="text-xs text-slate-500">Please check the phone number or call clinic support at 9933506514.</p>
            </div>
          ) : (
            searchResults.map((apt) => {
              // Calculate live queue ahead
              const priorInShift = appointments.filter(
                (a) =>
                  a.booking_date === apt.booking_date &&
                  a.shift === apt.shift &&
                  a.status === 'pending' &&
                  a.queue_position < apt.queue_position
              ).length;

              return (
                <div
                  key={apt.id}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">{apt.patient_name}</h3>
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                          {apt.shift} Slot
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Patient ID: <strong className="font-mono text-slate-700 dark:text-slate-300">{apt.patient_id}</strong> • Age: <strong className="text-slate-700 dark:text-slate-300">{apt.age != null && !isNaN(Number(apt.age)) && Number(apt.age) > 0 ? `${apt.age} yrs` : 'N/A'}</strong> • Phone: {apt.phone}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {apt.status === 'in_consult' ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          Currently In Doctor Chamber
                        </span>
                      ) : apt.status === 'completed' ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Consultation Completed
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          Waiting in Queue
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Metrics grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 block">Token Number</span>
                      <span className="font-mono font-bold text-sm text-[#1B4332] dark:text-emerald-400 block mt-0.5">
                        {apt.token_number}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 block">Queue Position</span>
                      <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200 block mt-0.5">
                        #{apt.queue_position}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 block">Ahead in Line</span>
                      <span className="font-extrabold text-sm text-emerald-700 dark:text-emerald-400 block mt-0.5">
                        {apt.status === 'completed' ? '0 (Done)' : `${priorInShift} patient(s)`}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 block">Date & Shift</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block mt-0.5">
                        {apt.booking_date} ({apt.shift === 'morning' ? '10AM-12:30PM' : '6PM-8:30PM'})
                      </span>
                    </div>
                  </div>

                  {apt.symptoms_summary && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <strong>Recorded Complaints:</strong> {apt.symptoms_summary}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Today's Live Clinic Board */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>Today's Clinic Live Board ({todayStr})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Morning Shift Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <span className="font-bold text-slate-800 dark:text-white">Morning Slot Queue</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                10:00 AM – 12:30 PM
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Total Booked: <strong>{morningQueue.length}</strong></span>
              <span className="text-slate-500">
                Pending: <strong>{morningQueue.filter((a) => a.status === 'pending').length}</strong>
              </span>
            </div>
            {morningQueue.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">No patients scheduled for morning shift yet.</p>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {morningQueue.map((a) => (
                  <div key={a.id} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      #{a.queue_position} {a.patient_name}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      a.status === 'in_consult' ? 'bg-amber-100 text-amber-800' :
                      a.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                    }`}>
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Evening Shift Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <span className="font-bold text-slate-800 dark:text-white">Evening Slot Queue</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                6:00 PM – 8:30 PM
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Total Booked: <strong>{eveningQueue.length}</strong></span>
              <span className="text-slate-500">
                Pending: <strong>{eveningQueue.filter((a) => a.status === 'pending').length}</strong>
              </span>
            </div>
            {eveningQueue.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">No patients scheduled for evening shift yet.</p>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {eveningQueue.map((a) => (
                  <div key={a.id} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      #{a.queue_position} {a.patient_name}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      a.status === 'in_consult' ? 'bg-amber-100 text-amber-800' :
                      a.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                    }`}>
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
  );
};
