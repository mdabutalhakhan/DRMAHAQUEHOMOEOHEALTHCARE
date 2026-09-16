import React, { useState, useMemo, useEffect } from 'react';
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
  Check,
  X
} from 'lucide-react';
import { Appointment, ShiftType } from '../types';
import { createAppointment, getAppointments, subscribeToStore } from '../services/clinicStore';
import { BookingModal } from './BookingModal';
import { getSupabase } from '../services/supabase';

interface PublicHomeProps {
  onAppointmentBooked?: (appointment: Appointment) => void;
  onOpenTracker?: () => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({ onAppointmentBooked, onOpenTracker }) => {
  const [doctorPhotoUrl, setDoctorPhotoUrl] = useState<string>('');
  
  // Directly query Supabase clinic_settings on mount
  useEffect(() => {
    async function fetchDoctorPhoto() {
      const supabase = getSupabase();
      const { data } = await supabase
        .from('clinic_settings')
        .select('doctor_image_url')
        .eq('id', 'default')
        .single();
      if (data?.doctor_image_url) {
        setDoctorPhotoUrl(data.doctor_image_url);
      }
    }
    fetchDoctorPhoto();

    // Listen for real-time updates across open tabs
    const unsubscribe = subscribeToStore((event) => {
      if (event.type === 'clinic_settings' && event.data) {
        setDoctorPhotoUrl(event.data.doctor_image_url || '');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
  
  // Popup Booking Modal state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  // Confirmation Modal State
  const [confirmedAppointment, setConfirmedAppointment] = useState<{
    appointment: Appointment;
    queuePosition: number;
  } | null>(null);
  
  const [copiedToken, setCopiedToken] = useState(false);

  const copyTokenToClipboard = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* 1. HERO & WELCOME SECTION */}
      <section className="relative overflow-hidden pt-3 sm:pt-8 pb-6 sm:pb-12 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-emerald-50/70 via-white to-[#F8FAF9] dark:from-slate-900 dark:via-[#0F172A] dark:to-slate-900/60 border border-emerald-900/5 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-10 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-2.5 sm:space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#1B4332] dark:text-white tracking-tight leading-[1.15]">
                Homoeo Health Care
              </h1>

              <p className="text-sm sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-normal py-1 sm:py-0">
                Personalized, gentle, and lasting healing for acute and chronic conditions. Experience genuine holistic recovery with zero side-effects under expert clinical supervision.
              </p>

              {/* Call to Action buttons - Full-width on mobile with matching heights */}
              <div className="pt-1 sm:pt-2 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3.5">
                <button
                  type="button"
                  id="hero-book-appointment-btn"
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full sm:w-auto h-12 px-5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-sm shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
                >
                  <CalendarCheck className="w-4.5 h-4.5 text-emerald-200 shrink-0" />
                  <span>Book Appointment Now</span>
                </button>

                {onOpenTracker && (
                  <button
                    type="button"
                    id="hero-live-tracker-btn"
                    onClick={onOpenTracker}
                    className="w-full sm:w-auto h-12 px-5 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-emerald-950/20 dark:border-slate-700 text-[#1B4332] dark:text-emerald-300 font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <Clock className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Live Queue Tracker</span>
                  </button>
                )}

                <a
                  href="https://wa.me/919933506514"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto h-12 px-5 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-[#1B4332] dark:text-emerald-300 font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-200/80 transition-colors"
                >
                  <Phone className="w-4.5 h-4.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                  <span>WhatsApp: 9933506514</span>
                </a>
              </div>

              {/* Trust Badges - Relocated below action buttons */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2 sm:pt-3">
                <div className="px-2 py-2 sm:px-3 sm:py-2.5 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-emerald-950/10 dark:border-slate-700 shadow-xs flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
                  <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">Zero Side-Effects</span>
                </div>
                <div className="px-2 py-2 sm:px-3 sm:py-2.5 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-emerald-950/10 dark:border-slate-700 shadow-xs flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
                  <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">Root-Cause Cure</span>
                </div>
                <div className="px-2 py-2 sm:px-3 sm:py-2.5 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-emerald-950/10 dark:border-slate-700 shadow-xs flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">Personalized Care</span>
                </div>
              </div>
            </div>

            {/* Right Card: Doctor Profile & Highlights */}
            <div className="lg:col-span-5">
              <div className="p-5 sm:p-7 md:p-8 rounded-2xl bg-white dark:bg-slate-800/90 border border-emerald-950/10 dark:border-slate-700 shadow-xl shadow-emerald-950/5 relative">
                <div className="flex items-center gap-3.5 sm:gap-5 pb-5 border-b border-slate-100 dark:border-slate-700">
                  <div className="w-24 h-32 sm:w-28 sm:h-36 rounded-2xl overflow-hidden bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0 border-2 border-emerald-100 dark:border-emerald-800">
                    {doctorPhotoUrl ? (
                      <img
                        src={doctorPhotoUrl}
                        alt="Dr. M. A. Haque"
                        className="w-full h-full object-cover object-top rounded-2xl"
                        referrerPolicy="no-referrer"
                        onError={() => setDoctorPhotoUrl('')}
                      />
                    ) : (
                      <span>MH</span>
                    )}
                  </div>
                  <div className="flex flex-col justify-center space-y-0.5 sm:space-y-1 min-w-0">
                    <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                      <span>Senior Homoeopath</span>
                    </div>
                    <h2 className="whitespace-nowrap font-bold text-lg md:text-xl tracking-tight text-emerald-950 dark:text-emerald-50 leading-tight">
                      Dr. M. A. Haque
                    </h2>
                    <p className="text-xs sm:text-sm font-semibold text-[#2D6A4F] dark:text-emerald-400">
                      M.D. (Homoeo)
                    </p>
                    <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-snug">
                      Senior Consultant & Chronic Disease Specialist
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                      Govt. Regd. Medical Practitioner • Durgapur Chamber
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
                    <span>Pure Hahnemannian Homeopathy with high-grade German, European & Indian pharmacopoeia remedies.</span>
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

      {/* 2. CLINIC LOCATION & TIMINGS BANNER (Single unified clean section) */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-800/95 border border-emerald-950/10 dark:border-slate-700 p-5 sm:p-7 md:p-8 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
            {/* Card 1: Clinic Location with full Google Maps destination */}
            <div className="w-full p-5 sm:p-6 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between space-y-4">
              <div className="flex items-start gap-3.5 sm:gap-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/50 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white tracking-wide">
                      Clinic Location
                    </h3>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Benachity, Durgapur
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    <p className="font-bold text-slate-900 dark:text-white">Dr. M. A. Haque Homoeo Health Care</p>
                    <p>Salbagan Road, Benachity, Durgapur</p>
                    <p>PIN: 713213, West Bengal</p>
                    <p className="font-medium text-slate-800 dark:text-slate-200 mt-1">Landmark: Near Roy Medical</p>
                  </div>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium pt-1">
                    Landmark: Salbagan Road, Benachity (Near Roy Medical)
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                <a
                  href="https://maps.google.com/?q=Dr.+M.+A.+Haque+Homoeo+Health+Care,+Salbagan+Road,+Benachity,+Durgapur,+713213"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm inline-flex items-center gap-1.5 underline-offset-2 hover:underline"
                  title="Open exact clinic location on Google Maps"
                >
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Open Clinic in Google Maps ↗</span>
                </a>
              </div>
            </div>

            {/* Card 2: Clinic & Doctor Timings (Unified) */}
            <div className="w-full p-5 sm:p-6 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between space-y-4">
              <div className="flex items-start gap-3.5 sm:gap-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/50 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white tracking-wide">
                      Clinic & Doctor Timings
                    </h3>
                    <span className="text-red-600 font-bold text-sm tracking-wide">
                      Friday Closed
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Chamber Consultation Hours */}
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700">
                      <span className="text-emerald-800 dark:text-emerald-400 font-bold block text-xs">
                        Dr. M. A. Haque Consultations
                      </span>
                      <ul className="mt-1.5 space-y-1 text-slate-700 dark:text-slate-300">
                        <li>• <strong>Morning Slot:</strong> 10:00 AM – 12:30 PM</li>
                        <li>• <strong>Evening Slot:</strong> 6:00 PM – 8:30 PM</li>
                      </ul>
                      <span className="block text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                        Days: Saturday to Thursday
                      </span>
                    </div>

                    {/* Pharmacy & Clinic Working Hours */}
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700">
                      <span className="text-emerald-800 dark:text-emerald-400 font-bold block text-xs">
                        Clinic & Dispensary Hours
                      </span>
                      <ul className="mt-1.5 space-y-1 text-slate-700 dark:text-slate-300">
                        <li>• <strong>Morning:</strong> 9:00 AM – 2:00 PM</li>
                        <li>• <strong>Evening:</strong> 5:00 PM – 10:00 PM</li>
                      </ul>
                      <span className="block text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                        Pharmacy open throughout shifts
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
                <span>Helpline / WhatsApp: <strong className="text-slate-900 dark:text-white">9933506514</strong></span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">Digital queue & instant token system</span>
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

      {/* 4. CONFIRMATION POPUP / MODAL */}
      {confirmedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg md:max-w-xl max-h-[90vh] md:max-h-[88vh] flex flex-col bg-[#FAF7EE] dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-emerald-900/20">
            {/* Modal Header */}
            <div className="shrink-0 p-4 border-b border-stone-200 dark:border-slate-800 flex justify-between items-center bg-white/70 dark:bg-slate-900/80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shadow-xs shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#1B4332] dark:text-emerald-300 leading-tight">
                    Appointment Confirmed!
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Live Token generated for Dr. M. A. Haque Chamber
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setConfirmedAppointment(null);
                  setIsBookingModalOpen(false);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-stone-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 overscroll-contain">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Hi <strong className="text-slate-900 dark:text-white">{confirmedAppointment.appointment.patient_name}</strong>, your consultation slot has been reserved successfully.
              </p>

              {/* Rich Token Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 dark:bg-slate-800/90 border border-emerald-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-200/70 dark:border-slate-700">
                  <div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Your Token Number</span>
                    <span className="font-mono font-extrabold text-xl text-[#1B4332] dark:text-emerald-300">
                      {confirmedAppointment.appointment.token_number}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyTokenToClipboard(confirmedAppointment.appointment.token_number)}
                    className="p-2 rounded-lg bg-white dark:bg-slate-700 border border-emerald-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-emerald-100 transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                    title="Copy Token"
                  >
                    {copiedToken ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied</span>
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
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Queue Position</span>
                    <span className="font-extrabold text-base text-emerald-800 dark:text-emerald-300">
                      #{confirmedAppointment.queuePosition}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Patient ID</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {confirmedAppointment.appointment.patient_id}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Date</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {confirmedAppointment.appointment.booking_date}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Shift Slot</span>
                    <span className="font-semibold capitalize text-slate-800 dark:text-slate-200">
                      {confirmedAppointment.appointment.shift} Slot ({confirmedAppointment.appointment.shift === 'morning' ? '10 AM - 12:30 PM' : '6 PM - 8:30 PM'})
                    </span>
                  </div>
                </div>
              </div>

              {/* Instructions notice */}
              <div className="p-3.5 rounded-xl bg-stone-100/90 dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-1">
                <p>
                  <strong>Notice:</strong> Token <strong>{confirmedAppointment.appointment.token_number}</strong> (#{confirmedAppointment.queuePosition} in queue). Date: <strong>{confirmedAppointment.appointment.booking_date}</strong> ({confirmedAppointment.appointment.shift.toUpperCase()} Shift).
                </p>
                <p className="text-emerald-800 dark:text-emerald-300 font-medium">
                  Please visit the clinic on time. For assistance, contact 9933506514.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="shrink-0 p-4 border-t border-stone-200 dark:border-slate-800 bg-stone-50/90 dark:bg-slate-900/90 flex items-center justify-end">
              <button
                id="btn-close-confirmation-modal"
                type="button"
                onClick={() => {
                  setConfirmedAppointment(null);
                  setIsBookingModalOpen(false);
                }}
                className="w-full py-3 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-sm shadow-md transition cursor-pointer"
              >
                Done / Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSuccess={(appointment, queuePosition) => {
          setConfirmedAppointment({ appointment, queuePosition });
          setIsBookingModalOpen(false);
          if (onAppointmentBooked) {
            onAppointmentBooked(appointment);
          }
        }}
      />
    </div>
  );
};
