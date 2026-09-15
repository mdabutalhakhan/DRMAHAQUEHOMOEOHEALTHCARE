import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Shield, 
  Leaf, 
  Activity, 
  Users, 
  ArrowRight, 
  MessageSquareText, 
  Info,
  CalendarCheck,
  Copy,
  Check
} from 'lucide-react';
import { Appointment, ShiftType } from '../types';
import { createAppointment, getAppointments } from '../services/clinicStore';

interface PublicHomeProps {
  onAppointmentBooked?: (appointment: Appointment) => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({ onAppointmentBooked }) => {
  // Booking Form State
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [doctorImageUrl, setDoctorImageUrl] = useState('');
  
  // Set default booking date to tomorrow or next non-Friday
  const getDefaultDate = () => {
    const d = new Date();
    // If today is Friday or past consultation hours, default to next day
    if (d.getDay() === 5) {
      d.setDate(d.getDate() + 1);
    }
    return d.toISOString().split('T')[0];
  };

  const [bookingDate, setBookingDate] = useState(getDefaultDate());
  const [shift, setShift] = useState<ShiftType>('morning');
  const [symptoms, setSymptoms] = useState('');
  
  // Confirmation Modal State
  const [confirmedAppointment, setConfirmedAppointment] = useState<{
    appointment: Appointment;
    queuePosition: number;
  } | null>(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedToken, setCopiedToken] = useState(false);

  // Live Queue metrics for selected date
  const appointments = getAppointments();
  
  const isFriday = useMemo(() => {
    if (!bookingDate) return false;
    const d = new Date(bookingDate + 'T00:00:00');
    return d.getDay() === 5;
  }, [bookingDate]);

  const existingInSlotCount = useMemo(() => {
    if (!bookingDate) return 0;
    return appointments.filter(
      (a) => a.booking_date === bookingDate && a.shift === shift && a.status !== 'cancelled'
    ).length;
  }, [appointments, bookingDate, shift]);

  const totalForDateCount = useMemo(() => {
    if (!bookingDate) return 0;
    return appointments.filter(
      (a) => a.booking_date === bookingDate && a.status !== 'cancelled'
    ).length;
  }, [appointments, bookingDate]);

  const estimatedQueuePos = existingInSlotCount + 1;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!patientName.trim()) {
      setErrorMsg('Please provide your full name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setErrorMsg('Please provide a valid 10-digit phone number for appointment confirmation SMS / WhatsApp.');
      return;
    }
    if (!address.trim()) {
      setErrorMsg('Please specify your residential town or area (e.g., Benachity, Durgapur).');
      return;
    }
    if (isFriday) {
      setErrorMsg('Clinic is closed on Fridays. Please select Saturday through Thursday.');
      return;
    }

    try {
      setSubmitting(true);
      const result = await createAppointment({
        patient_name: patientName,
        phone,
        address,
        booking_date: bookingDate,
        shift,
        symptoms_summary: symptoms,
      });

      setConfirmedAppointment(result);
      if (onAppointmentBooked) {
        onAppointmentBooked(result.appointment);
      }

      // Reset form
      setPatientName('');
      setPhone('');
      setAddress('');
      setSymptoms('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to book appointment. Please try again or call 9933506514.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyTokenToClipboard = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="space-y-16 pb-12">
      {/* 1. HERO & WELCOME SECTION */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pb-16 rounded-3xl bg-gradient-to-b from-emerald-50/70 via-white to-[#F8FAF9] dark:from-slate-900 dark:via-[#0F172A] dark:to-slate-900/60 border border-emerald-900/5 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 dark:bg-emerald-950/80 border border-emerald-300/80 dark:border-emerald-800 text-[#1B4332] dark:text-emerald-300 text-xs font-bold tracking-wide">
                <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Dr. M. A. Haque, M.D. (Homoeo) • Homoeopathic Healthcare</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1B4332] dark:text-white tracking-tight leading-[1.15]">
                Homoeo Health Care
              </h1>

              <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                Personalized, gentle, and lasting healing for acute and chronic conditions. Experience genuine holistic recovery with zero side-effects under expert clinical supervision.
              </p>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-emerald-950/10 dark:border-slate-700 shadow-sm flex items-center gap-2.5">
                  <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Zero Side-Effects</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-emerald-950/10 dark:border-slate-700 shadow-sm flex items-center gap-2.5">
                  <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Root-Cause Cure</span>
                </div>
                <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-emerald-950/10 dark:border-slate-700 shadow-sm flex items-center gap-2.5">
                  <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Personalized Care</span>
                </div>
              </div>

              {/* Call to Action scroll buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#booking-section"
                  className="px-6 py-3.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-sm shadow-md shadow-emerald-900/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Book Appointment Now</span>
                </a>
                <a
                  href="https://wa.me/919933506514"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-[#1B4332] dark:text-emerald-300 font-bold text-sm flex items-center gap-2 hover:bg-emerald-200/80 transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <span>WhatsApp: 9933506514</span>
                </a>
              </div>
            </div>

            {/* Right Card: Doctor Profile & Highlights */}
            <div className="lg:col-span-5">
              <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-800/90 border border-emerald-950/10 dark:border-slate-700 shadow-xl shadow-emerald-950/5 relative">
                <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-700">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] text-white flex items-center justify-center font-bold text-2xl shadow-inner shrink-0 border border-emerald-500/20">
                    {doctorImageUrl ? (
                      <img
                        src={doctorImageUrl}
                        alt="Dr. M. A. Haque"
                        className="w-full h-full object-cover"
                        onError={() => setDoctorImageUrl('')}
                      />
                    ) : (
                      <span>MH</span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Dr. M. A. Haque
                    </h2>
                    <p className="text-sm font-semibold text-[#2D6A4F] dark:text-emerald-400">
                      M.D. (Homoeo) • Homoeopathic Healthcare
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Senior Consultant & Chronic Disease Specialist
                    </p>
                  </div>
                </div>

                <div className="py-5 space-y-3.5 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>Specialized in Chronic Rhinitis, Asthma, Rheumatic Arthritis, Gastric issues & Skin Allergies.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>Pure Hahnemannian Homoeopathy with high-grade European & Indian pharmacopoeia remedies.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>Complete digitized token & queue tracker to respect patient consultation time.</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span className="font-medium text-slate-600 dark:text-slate-300">Consultation Shifts</span>
                  <span className="font-semibold text-emerald-800 dark:text-emerald-300">Morning & Evening (Sat–Thu)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CLINIC INFO & TIMINGS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#1B4332] text-white p-6 sm:p-8 shadow-xl shadow-emerald-950/15">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Address */}
            <a
              href="https://maps.google.com/?q=Salbagan+Road,+Benachity,+Durgapur,+713213"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 group p-2 -m-2 rounded-xl hover:bg-emerald-800/40 transition-colors"
              title="Open Clinic Location in Google Maps"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-700/60 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 transition">
                <MapPin className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-base text-white tracking-wide group-hover:text-emerald-200 transition">
                    Clinic Location
                  </h3>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-700/80 text-emerald-200">
                    Google Maps ↗
                  </span>
                </div>
                <p className="text-sm text-emerald-100/90 mt-1 leading-relaxed underline-offset-2 group-hover:underline">
                  Dr. M. A. Haque Homoeo Health Care,<br />
                  Salbagan Road, Benachity, Durgapur,<br />
                  PIN: 713213, West Bengal
                </p>
                <p className="text-xs text-emerald-300 mt-1">Landmark: Salbagan Road, Benachity (Click to view map)</p>
              </div>
            </a>

            {/* Clinic Opening Hours */}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-700/60 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-white tracking-wide">Clinic Hours</h3>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-red-800 text-red-100 font-semibold">
                    Friday Closed
                  </span>
                </div>
                <p className="text-xs text-emerald-200 font-semibold mt-1">Saturday to Thursday:</p>
                <ul className="text-xs text-emerald-100/90 mt-1 space-y-0.5">
                  <li>• Morning: 9:00 AM – 2:00 PM</li>
                  <li>• Evening: 5:00 PM – 10:00 PM</li>
                </ul>
              </div>
            </div>

            {/* Doctor Consultation Hours */}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-700/60 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white tracking-wide">Doctor Consultations</h3>
                <p className="text-xs text-emerald-200 font-semibold mt-1">Dr. M. A. Haque Chamber Timings:</p>
                <ul className="text-xs text-emerald-100/90 mt-1 space-y-0.5">
                  <li>• <strong className="text-white">Morning Slot:</strong> 10:00 AM – 12:30 PM</li>
                  <li>• <strong className="text-white">Evening Slot:</strong> 6:00 PM – 8:30 PM</li>
                </ul>
                <p className="text-xs text-emerald-300/80 mt-1">Phone / WhatsApp: 9933506514</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHY HOMOEOPATHY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Natural Principles of Cure
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
            Why Choose Homoeopathy?
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 mt-2">
            Similia Similibus Curentur — Like cures like. Homoeopathic medicine stimulates your body's intrinsic vital force to heal naturally.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">100% Safe & Natural</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Prepared from natural botanical, mineral, and biological sources through ultra-dilution. Non-toxic, non-addictive, and gentle for infants, pregnant women, and elderly patients.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Root-Cause Eradication</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Rather than merely suppressing symptoms temporarily with chemical painkillers, homoeopathy identifies the miasmatic root cause to bring deep constitutional restoration.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Holistic Individualization</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Two individuals with the same diagnosis receive different remedies tailored to their unique mental disposition, thermal modalities, physical keynotes, and emotional constitution.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Chronic Management</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Proven high efficacy in long-standing refractory conditions: chronic sinusitis, migraine, eczema, psoriasis, irritable bowel syndrome, thyroid disorders, and rheumatic pain.
            </p>
          </div>
        </div>
      </section>

      {/* 4. APPOINTMENT BOOKING FLOW WITH LIVE QUEUE PREVIEW */}
      <section id="booking-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Booking Form */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-3xl border border-emerald-950/10 dark:border-slate-700 p-6 sm:p-10 shadow-lg">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Patient Self-Registration
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                Book Your Doctor Consultation
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                Fill your details below to generate your unique Token Number and live queue position.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block">Booking Alert:</strong>
                  <span>{errorMsg}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Patient Name */}
                <div>
                  <label htmlFor="patient-name-input" className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                    Patient Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      id="patient-name-input"
                      type="text"
                      required
                      placeholder="e.g. Ramesh Chandra Sen"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phone-number-input" className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                    Mobile Phone / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      id="phone-number-input"
                      type="tel"
                      required
                      placeholder="e.g. 9832100000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Residential Address */}
              <div>
                <label htmlFor="patient-address-input" className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                  Residential Area / Address *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="patient-address-input"
                    type="text"
                    required
                    placeholder="e.g. Salbagan Road, Benachity, Durgapur"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
                  />
                </div>
              </div>

              {/* Date & Shift Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="booking-date-picker" className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                    Booking Date (Sat - Thu) *
                  </label>
                  <input
                    id="booking-date-picker"
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
                  />
                  {isFriday && (
                    <p className="text-xs text-red-600 dark:text-red-400 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Clinic is closed on Fridays. Please pick another date.
                    </p>
                  )}
                </div>

                {/* Shift Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                    Consultation Shift Slot *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      id="shift-morning-btn"
                      onClick={() => setShift('morning')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        shift === 'morning'
                          ? 'border-[#1B4332] bg-emerald-50 dark:bg-emerald-950/60 text-[#1B4332] dark:text-emerald-300 font-bold ring-2 ring-[#1B4332]'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="block text-xs font-semibold">Morning Slot</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">10:00 AM – 12:30 PM</span>
                    </button>

                    <button
                      type="button"
                      id="shift-evening-btn"
                      onClick={() => setShift('evening')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        shift === 'evening'
                          ? 'border-[#1B4332] bg-emerald-50 dark:bg-emerald-950/60 text-[#1B4332] dark:text-emerald-300 font-bold ring-2 ring-[#1B4332]'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="block text-xs font-semibold">Evening Slot</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">6:00 PM – 8:30 PM</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Symptoms brief note */}
              <div>
                <label htmlFor="symptoms-summary-input" className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                  Chief Health Complaints / Symptoms (Optional)
                </label>
                <textarea
                  id="symptoms-summary-input"
                  rows={2}
                  placeholder="Describe your symptoms (e.g. chronic cough, knee joint stiffness, skin rash)..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  id="btn-confirm-appointment"
                  disabled={submitting || isFriday}
                  className={`w-full py-4 rounded-xl text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg transition-all ${
                    isFriday
                      ? 'bg-slate-400 cursor-not-allowed'
                      : 'bg-[#1B4332] hover:bg-[#2D6A4F] shadow-emerald-950/20 active:scale-[0.99]'
                  }`}
                >
                  {submitting ? (
                    <span>Registering Patient...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                      <span>Confirm Appointment & Get Token</span>
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-2.5">
                  Instant token assigned with real-time queue position. No advance payment required online.
                </p>
              </div>
            </form>
          </div>

          {/* Right Column: Live Queue Status & Clinic Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-3xl bg-emerald-50/80 dark:bg-slate-800/80 border border-emerald-200 dark:border-slate-700 p-6 shadow-sm">
              <h3 className="font-bold text-base text-[#1B4332] dark:text-emerald-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Live Queue Preview</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Appointments confirmed for {bookingDate}:
              </p>

              {totalForDateCount === 0 ? (
                <div className="mt-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-emerald-300 dark:border-slate-700 text-center space-y-1">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    No appointments booked for this date
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Be the first patient to register and receive Token #001!
                  </p>
                </div>
              ) : null}

              <div className="mt-4 space-y-3">
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Selected Slot</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                      {shift} Shift
                    </span>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {shift === 'morning' ? '10 AM – 12:30 PM' : '6 PM – 8:30 PM'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Patients Before You</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {existingInSlotCount} {existingInSlotCount === 1 ? 'patient' : 'patients'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    in {shift} queue
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] text-white flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-xs text-emerald-200 block font-medium">Your Estimated Position</span>
                    <span className="text-2xl font-extrabold tracking-tight">#{estimatedQueuePos}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-emerald-200 block">Status</span>
                    <span className="text-xs font-semibold text-emerald-100">Immediate Sync</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-emerald-200/60 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Please arrive 15 minutes before your shift time to complete vital check-in.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Helpline & Rescheduling: <strong>9933506514</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CONFIRMATION POPUP / MODAL (As explicitly specified in Prompt) */}
      {confirmedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl space-y-6 relative">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#1B4332] dark:text-emerald-300">
                Appointment Confirmed!
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Hi <strong className="text-slate-900 dark:text-white">{confirmedAppointment.appointment.patient_name}</strong>, your appointment is confirmed!
              </p>
            </div>

            {/* Rich Token Card */}
            <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-slate-800/90 border border-emerald-200 dark:border-slate-700 space-y-3.5">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-200/70 dark:border-slate-700">
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Your Token Number</span>
                  <span className="font-mono font-bold text-lg text-[#1B4332] dark:text-emerald-300">
                    {confirmedAppointment.appointment.token_number}
                  </span>
                </div>
                <button
                  onClick={() => copyTokenToClipboard(confirmedAppointment.appointment.token_number)}
                  className="p-2 rounded-lg bg-white dark:bg-slate-700 border border-emerald-200 dark:border-slate-600 text-slate-600 dark:text-slate-200 hover:bg-emerald-100 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                  title="Copy Token"
                >
                  {copiedToken ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Queue Position</span>
                  <span className="font-extrabold text-base text-emerald-800 dark:text-emerald-300">
                    #{confirmedAppointment.queuePosition}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Patient ID</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {confirmedAppointment.appointment.patient_id}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Date</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {confirmedAppointment.appointment.booking_date}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Shift Slot</span>
                  <span className="font-semibold capitalize text-slate-800 dark:text-slate-200">
                    {confirmedAppointment.appointment.shift} Slot ({confirmedAppointment.appointment.shift === 'morning' ? '10 AM - 12:30 PM' : '6 PM - 8:30 PM'})
                  </span>
                </div>
              </div>
            </div>

            {/* Prompt's verbatim message */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <p>
                <strong>Notice:</strong> Token: <strong>{confirmedAppointment.appointment.token_number}</strong>, Queue Position: <strong>#{confirmedAppointment.queuePosition}</strong>. Date: <strong>{confirmedAppointment.appointment.booking_date}</strong>, Shift: <strong>{confirmedAppointment.appointment.shift.toUpperCase()}</strong>.
              </p>
              <p className="mt-1.5 font-medium text-emerald-800 dark:text-emerald-300">
                Please visit the clinic on time. For details, contact 9933506514.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                id="btn-close-confirmation-modal"
                onClick={() => setConfirmedAppointment(null)}
                className="w-full py-3.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-sm shadow-md transition"
              >
                Okay, Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
