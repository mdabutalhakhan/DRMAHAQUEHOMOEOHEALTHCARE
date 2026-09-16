import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  FileText,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  CalendarCheck,
} from 'lucide-react';
import { ShiftType, Appointment } from '../types';
import { createAppointment, getLiveQueueEstimate } from '../services/clinicStore';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (appointment: Appointment, queuePosition: number) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  // Helper to calculate nearest non-Friday date
  const getInitialBookingDate = () => {
    const today = new Date();
    if (today.getDay() === 5) {
      // If Friday, push to Saturday
      today.setDate(today.getDate() + 1);
    }
    return today.toISOString().split('T')[0];
  };

  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState<string>('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [bookingDate, setBookingDate] = useState(getInitialBookingDate);
  const [shift, setShift] = useState<ShiftType>('morning');
  const [symptoms, setSymptoms] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Queue estimate for selected date and shift
  const [queueEstimate, setQueueEstimate] = useState<number>(0);

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
    if (bookingDate && shift) {
      const est = getLiveQueueEstimate(bookingDate, shift);
      setQueueEstimate(est);
    }
  }, [bookingDate, shift]);

  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = e.target.value;
    if (!chosen) return;
    const dateObj = new Date(chosen + 'T00:00:00');
    if (dateObj.getDay() === 5) {
      setErrorMsg('The clinic is closed on Fridays. Please pick Saturday through Thursday.');
      return;
    }
    setErrorMsg('');
    setBookingDate(chosen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanName = patientName.trim();
    if (!cleanName || cleanName.length < 2) {
      setErrorMsg('Please enter the patient’s full name.');
      return;
    }

    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number for WhatsApp token notification.');
      return;
    }

    const cleanAddress = address.trim();
    if (!cleanAddress || cleanAddress.length < 3) {
      setErrorMsg('Please specify your residential town or area (e.g. Benachity, Durgapur).');
      return;
    }

    const dateObj = new Date(bookingDate + 'T00:00:00');
    if (dateObj.getDay() === 5) {
      setErrorMsg('Clinic is closed on Fridays. Please choose another date.');
      return;
    }

    const parsedAge = age ? parseInt(age, 10) : undefined;
    if (parsedAge !== undefined && (isNaN(parsedAge) || parsedAge < 1 || parsedAge > 125)) {
      setErrorMsg('Please enter a valid age between 1 and 125 years.');
      return;
    }

    setLoading(true);

    try {
      const { appointment, queuePosition } = await createAppointment({
        patient_name: cleanName,
        age: parsedAge,
        phone: cleanPhone,
        address: cleanAddress,
        booking_date: bookingDate,
        shift,
        symptoms_summary: symptoms.trim() || undefined,
      });

      onSuccess(appointment, queuePosition);
      // Reset form
      setPatientName('');
      setAge('');
      setPhone('');
      setAddress('');
      setSymptoms('');
      setErrorMsg('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to confirm booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-lg md:max-w-xl my-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-emerald-100 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="shrink-0 p-4 border-b border-stone-200 dark:border-slate-800 flex justify-between items-center bg-white/70 dark:bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#1B4332] text-white flex items-center justify-center shadow-xs">
              <CalendarCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#1B4332] dark:text-white leading-tight">
                Book Doctor Consultation
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                Dr. M. A. Haque, M.D. (Homoeo) • Benachity, Durgapur
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-stone-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form id="booking-modal-form" onSubmit={handleSubmit} className="overflow-y-auto overscroll-contain flex-1 min-h-0 p-5 md:p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Patient Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              1. Patient Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                placeholder="e.g. Suman Mukherjee"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332] dark:focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* 2. Age & 3. Mobile in a responsive 2-column row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 2. Age (Years) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                2. Age (Years) <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="number"
                min="1"
                max="125"
                placeholder="e.g. 32"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332] dark:focus:ring-emerald-500"
              />
            </div>

            {/* 3. Mobile / WhatsApp */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                3. Mobile / WhatsApp <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9933506514"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332] dark:focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* 4. Residential Area / Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              4. Residential Area / Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                placeholder="e.g. Salbagan Road, Benachity, Durgapur"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332] dark:focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* 5. Consultation Date (Calendar selector, Fridays disabled) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                5. Consultation Date <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-red-600 dark:text-red-400 font-semibold">
                Friday Closed
              </span>
            </div>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="date"
                required
                min={todayStr}
                value={bookingDate}
                onChange={handleDateChange}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332] dark:focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* 6. Shift Selector */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                6. Shift Selector <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-medium">
                Current waiting: {queueEstimate} patients
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setShift('morning')}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  shift === 'morning'
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
                onClick={() => setShift('evening')}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  shift === 'evening'
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

          {/* 7. Chief Health Complaints / Symptoms (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              7. Chief Health Complaints / Symptoms <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <textarea
                rows={2}
                placeholder="e.g. Chronic sneezing, seasonal asthma, joint stiffness in cold weather..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332] dark:focus:ring-emerald-500"
              />
            </div>
          </div>
        </form>

        {/* Modal Footer / Actions - Pinned and never clipped */}
        <div className="shrink-0 p-4 border-t border-stone-200 dark:border-slate-800 bg-stone-50/90 dark:bg-slate-900/90 flex flex-col gap-2">
          <button
            type="submit"
            form="booking-modal-form"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-sm shadow-md shadow-emerald-950/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Confirming Appointment...</span>
              </>
            ) : (
              <>
                <CalendarCheck className="w-4 h-4" />
                <span>Confirm Appointment & Get Token</span>
              </>
            )}
          </button>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Instant token generated • No upfront payment needed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
