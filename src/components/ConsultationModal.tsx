import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Camera,
  Upload,
  CheckCircle2,
  Receipt,
  Stethoscope,
  Trash2,
  User,
  Phone,
  Calendar,
  Clock,
  MapPin,
  Loader2,
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  FileText,
  Pill,
  History,
  UserCheck,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Appointment } from '../types';
import {
  savePrescription,
  updateAppointmentStatus,
  fetchInvoicesFromSupabase,
  fetchAppointmentsFromSupabase,
  getInvoices,
  getAppointments,
  getPrescriptions,
} from '../services/clinicStore';
import { getSupabase } from '../services/supabase';
import { compressImageToWebP } from '../utils/imageCompression';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onOpenInvoiceForPatient?: (appointment: Appointment, diagnosis: string, prescriptionUrl?: string) => void;
  onOpenAIConsultant?: (symptoms: string) => void;
}

interface PastVisitRecord {
  id: string;
  date: string;
  formattedDate: string;
  shift?: string;
  invoiceNumber?: string;
  prescriptionUrl?: string;
  medicines: Array<{
    description: string;
    price?: number;
  }>;
  complaints?: string;
  totalAmount?: number;
}

const formatPastVisitDateTime = (dateStr: string, shift?: string) => {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const weekday = days[d.getDay()];
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;
    const shiftText = shift
      ? `${shift.charAt(0).toUpperCase() + shift.slice(1).toLowerCase()} Shift`
      : (d.getHours() < 14 ? 'Morning Shift' : 'Evening Shift');
    return `${weekday}, ${day} ${month}, ${year} (${timeStr}) - ${shiftText}`;
  } catch {
    return dateStr;
  }
};

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onOpenInvoiceForPatient,
}) => {
  if (!isOpen || !appointment) return null;

  const [prescriptionImage, setPrescriptionImage] = useState<string | null>(appointment.prescription_url || null);
  const [prescriptionUrl, setPrescriptionUrl] = useState<string | null>(appointment.prescription_url || null);
  const [compressionStats, setCompressionStats] = useState<{
    originalSizeKb: number;
    compressedSizeKb: number;
    dimensions: string;
    fileName: string;
  } | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Past clinical records state
  const [pastRecords, setPastRecords] = useState<PastVisitRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  // Accordion state: maps record.id to boolean (expanded/collapsed)
  const [expandedVisitIds, setExpandedVisitIds] = useState<Record<string, boolean>>({});

  const toggleVisitAccordion = (recordId: string) => {
    setExpandedVisitIds((prev) => ({
      ...prev,
      [recordId]: !prev[recordId],
    }));
  };

  // Lightbox viewer state
  const [selectedPastPrescription, setSelectedPastPrescription] = useState<PastVisitRecord | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  // Camera & File refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Sync state when appointment changes
  useEffect(() => {
    if (appointment) {
      setPrescriptionImage(appointment.prescription_url || null);
      setPrescriptionUrl(appointment.prescription_url || null);
      setCompressionStats(null);
      setUploadNotice('');
      setSelectedPastPrescription(null);
      setZoom(1);
      setRotation(0);
      setExpandedVisitIds({});
    }
  }, [appointment?.id]);

  // Handle ESC key for Lightbox & Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedPastPrescription) {
          setSelectedPastPrescription(null);
          setZoom(1);
          setRotation(0);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPastPrescription, onClose]);

  // Fetch previous clinical records for this patient
  useEffect(() => {
    if (!isOpen || !appointment) return;
    let active = true;

    const fetchPastHistory = async () => {
      setLoadingHistory(true);
      try {
        const [invRes, aptRes] = await Promise.allSettled([
          fetchInvoicesFromSupabase(),
          fetchAppointmentsFromSupabase(),
        ]);

        const allInvoices = invRes.status === 'fulfilled' && invRes.value ? invRes.value : getInvoices();
        const allAppointments = aptRes.status === 'fulfilled' && aptRes.value ? aptRes.value : getAppointments();
        const allPrescriptions = getPrescriptions();

        const currentPhone = appointment.phone ? appointment.phone.replace(/\D/g, '').slice(-10) : '';
        const currentPid = (appointment.patient_id || '').trim().toLowerCase();
        const currentName = (appointment.patient_name || '').trim().toLowerCase();
        const currentAptId = String(appointment.id || '').trim();
        const currentToken = (appointment.token_number || '').trim();

        // Invoices for this patient
        const patientInvoices = allInvoices.filter((inv) => {
          const invPhone = inv.phone ? inv.phone.replace(/\D/g, '').slice(-10) : '';
          const invPid = (inv.patient_id || '').trim().toLowerCase();
          const invName = (inv.patient_name || '').trim().toLowerCase();

          const phoneMatch = Boolean(
            currentPhone &&
            invPhone &&
            (currentPhone === invPhone || currentPhone.endsWith(invPhone) || invPhone.endsWith(currentPhone))
          );

          const pidMatch = Boolean(
            currentPid &&
            invPid &&
            (
              currentPid === invPid ||
              currentPid.replace(/^pat-/, '') === invPid.replace(/^pat-/, '') ||
              (currentPhone && (invPid.includes(currentPhone.slice(-4)) || invPid.includes(currentPhone.slice(-6))))
            )
          );

          const nameMatch = Boolean(!currentPhone && currentName && invName && currentName === invName);

          return phoneMatch || pidMatch || nameMatch;
        });

        // Completed appointments for this patient excluding current active queue token/session
        const patientAppointments = allAppointments.filter((apt) => {
          const aptIdStr = String(apt.id || '').trim();
          const aptTokenStr = (apt.token_number || '').trim();

          // Exclude current in-consultation session / active queue token
          if (aptIdStr === currentAptId) return false;
          if (currentToken && aptTokenStr === currentToken) return false;
          if (apt.status === 'in_consult' || apt.status === 'pending') return false;

          const aptPhone = apt.phone ? apt.phone.replace(/\D/g, '').slice(-10) : '';
          const aptPid = (apt.patient_id || '').trim().toLowerCase();
          const aptName = (apt.patient_name || '').trim().toLowerCase();

          const isMatch =
            (currentPhone && aptPhone && (currentPhone === aptPhone || currentPhone.endsWith(aptPhone) || aptPhone.endsWith(currentPhone))) ||
            (currentPid && aptPid && currentPid === aptPid) ||
            (!currentPhone && currentName && aptName && currentName === aptName);

          return isMatch;
        });

        const records: PastVisitRecord[] = [];
        const handledAptIds = new Set<string>();

        // 1. Process all patient invoices
        for (const inv of patientInvoices) {
          let apt = inv.appointment_id
            ? allAppointments.find((a) => String(a.id).trim() === String(inv.appointment_id).trim())
            : undefined;
          if (apt) {
            handledAptIds.add(String(apt.id).trim());
          }

          const presc = allPrescriptions.find((p) => {
            if (inv.appointment_id && String(p.appointment_id).trim() === String(inv.appointment_id).trim()) return true;
            return false;
          });

          const prescriptionUrl = inv.prescription_url || apt?.prescription_url || presc?.prescription_image_url;
          const dateStr = inv.created_at || (apt?.booking_date ? `${apt.booking_date}T12:00:00Z` : new Date().toISOString());
          const shiftStr = inv.shift || apt?.shift || 'evening';

          const medicines = (inv.items || []).map((it: any) => ({
            description: it.item_description || it.medicine_name || 'Dispensed Remedy',
            price:
              it.price !== undefined && it.price !== ''
                ? Number(it.price)
                : it.total_price
                ? Number(it.total_price)
                : undefined,
          }));

          records.push({
            id: inv.id || inv.invoice_number,
            date: dateStr,
            formattedDate: formatPastVisitDateTime(dateStr, shiftStr),
            shift: shiftStr,
            invoiceNumber: inv.invoice_number,
            prescriptionUrl: prescriptionUrl || undefined,
            medicines,
            complaints: apt?.symptoms_summary || apt?.symptoms || undefined,
            totalAmount: Number(inv.total_amount) || undefined,
          });
        }

        // 2. Process any remaining completed appointments not covered by an invoice
        for (const apt of patientAppointments) {
          const aptIdStr = String(apt.id).trim();
          if (handledAptIds.has(aptIdStr)) continue;

          const presc = allPrescriptions.find((p) => String(p.appointment_id).trim() === aptIdStr);
          const prescriptionUrl = apt.prescription_url || presc?.prescription_image_url;
          const dateStr = apt.booking_date
            ? `${apt.booking_date}T12:00:00Z`
            : apt.created_at || new Date().toISOString();
          const shiftStr = apt.shift || 'evening';

          records.push({
            id: apt.id,
            date: dateStr,
            formattedDate: formatPastVisitDateTime(dateStr, shiftStr),
            shift: shiftStr,
            prescriptionUrl: prescriptionUrl || undefined,
            medicines: [],
            complaints: apt.symptoms_summary || apt.symptoms || undefined,
          });
        }

        // Sort newest to oldest
        records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        if (active) {
          setPastRecords(records);
          // Default: Keep the most recent past visit expanded and older ones collapsed
          const initialExpanded: Record<string, boolean> = {};
          records.forEach((rec, idx) => {
            initialExpanded[rec.id] = idx === 0;
          });
          setExpandedVisitIds(initialExpanded);
        }
      } catch (e) {
        console.warn('Error loading past records in chamber:', e);
      } finally {
        if (active) {
          setLoadingHistory(false);
        }
      }
    };

    fetchPastHistory();

    return () => {
      active = false;
    };
  }, [isOpen, appointment?.id, appointment?.phone, appointment?.patient_id]);

  const handleImageFileChange = async (file: File) => {
    try {
      setUploadingImage(true);
      setUploadNotice('Compressing client-side to WebP (max 1280px)...');

      // 1. Compress and convert the image client-side using HTML5 Canvas
      // Max dimension 1280px, format image/webp 0.75 quality, clean filename
      const patientIdClean = appointment.patient_id || (appointment.phone ? `PAT-${appointment.phone.replace(/\D/g, '').slice(-6)}` : 'PAT-1001');
      const compressed = await compressImageToWebP(file, patientIdClean, 1280, 0.75);

      // Immediate visual preview & state assignment
      setPrescriptionImage(compressed.dataUrl);
      setPrescriptionUrl(compressed.dataUrl); // fallback dataUrl
      setCompressionStats({
        originalSizeKb: Math.round(compressed.originalSize / 1024),
        compressedSizeKb: Math.round(compressed.compressedSize / 1024),
        dimensions: `${compressed.width}×${compressed.height}px`,
        fileName: compressed.fileName,
      });

      // 2. Upload compressed WebP blob to Supabase Storage bucket 'prescriptions'
      const supabase = getSupabase();
      if (supabase) {
        setUploadNotice('Uploading compressed WebP to cloud storage...');
        try {
          const { data, error } = await supabase.storage
            .from('prescriptions')
            .upload(compressed.fileName, compressed.blob, {
              contentType: 'image/webp',
              upsert: true,
            });

          if (error) {
            console.warn('Supabase storage upload notice:', error.message);
            // Even if cloud storage bucket is restricted, local base64 preview is active
            setUploadNotice('Saved locally (WebP format)');
          } else if (data) {
            const { data: publicUrlData } = supabase.storage
              .from('prescriptions')
              .getPublicUrl(compressed.fileName);

            if (publicUrlData?.publicUrl) {
              setPrescriptionUrl(publicUrlData.publicUrl);
              setPrescriptionImage(publicUrlData.publicUrl);
              setUploadNotice('Uploaded & verified on Supabase Storage');
            }
          }
        } catch (storageErr) {
          console.warn('Supabase storage upload error:', storageErr);
        }
      }
    } catch (err: any) {
      console.error('Prescription compression/upload error:', err);
      alert('Failed to process image: ' + (err.message || 'Unknown error'));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveConsultation = async () => {
    setSaving(true);
    try {
      const finalUrl = prescriptionUrl || prescriptionImage || undefined;
      await savePrescription({
        appointment_id: appointment.id,
        patient_id: appointment.patient_id,
        patient_name: appointment.patient_name,
        phone: appointment.phone,
        doctor_name: 'Dr. M. A. Haque, M.D. (Homoeo)',
        clinical_diagnosis: 'Physical Clinical Prescription Archived',
        repertory_symptoms: appointment.symptoms_summary || '',
        prescription_notes: 'Physical prescription photographed & verified.',
        prescription_image_url: finalUrl,
      });

      // Mark visit completed
      updateAppointmentStatus(appointment.id, 'completed', 'Consultation finished');
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1200);
    } catch (e) {
      console.error('Error saving consultation:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleProceedToInvoice = async () => {
    const finalUrl = prescriptionUrl || prescriptionImage || undefined;
    setSaving(true);
    try {
      await savePrescription({
        appointment_id: appointment.id,
        patient_id: appointment.patient_id,
        patient_name: appointment.patient_name,
        phone: appointment.phone,
        doctor_name: 'Dr. M. A. Haque, M.D. (Homoeo)',
        clinical_diagnosis: 'Physical Clinical Prescription Archived',
        repertory_symptoms: appointment.symptoms_summary || '',
        prescription_notes: 'Physical prescription photographed & verified.',
        prescription_image_url: finalUrl,
      });
      updateAppointmentStatus(appointment.id, 'completed', 'Consultation finished');
    } catch (e) {
      console.warn('Auto-save prescription before invoice note:', e);
    } finally {
      setSaving(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.getElementById('root')?.scrollTo({ top: 0, behavior: 'smooth' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      onOpenInvoiceForPatient?.(
        {
          ...appointment,
          prescription_url: finalUrl,
        },
        'Clinical evaluation completed',
        finalUrl
      );
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div className="w-full max-w-xl md:max-w-3xl max-h-[92vh] flex flex-col bg-[#FAF7EE] dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-emerald-900/20">
          {/* Modal Header */}
          <div className="shrink-0 p-4 border-b border-stone-200 dark:border-slate-800 flex justify-between items-center bg-white/70 dark:bg-slate-900/80">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#1B4332] text-white flex items-center justify-center shadow-xs">
                <Stethoscope className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                  Doctor Consultation Chamber
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Dr. M. A. Haque, M.D. (Homoeo)
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-stone-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4.5 overscroll-contain">
            {/* Patient Summary Header */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs">
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-stone-100 dark:border-slate-700">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base text-slate-900 dark:text-white">
                      {appointment.patient_name}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        appointment.age != null && !isNaN(Number(appointment.age)) && Number(appointment.age) > 0
                          ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {appointment.age != null && !isNaN(Number(appointment.age)) && Number(appointment.age) > 0
                        ? `${appointment.age} yrs`
                        : 'Age: N/A'}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#1B4332] dark:text-emerald-400">
                    {appointment.patient_id}
                  </span>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-[#1B4332] dark:text-emerald-300 font-mono text-xs font-bold">
                    {appointment.token_number}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-3 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{appointment.booking_date}</span>
                </div>
                <div className="flex items-center gap-1.5 capitalize">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{appointment.shift} Shift</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{appointment.phone}</span>
                </div>
                <div className="col-span-2 sm:col-span-3 flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{appointment.address}</span>
                </div>
                {appointment.symptoms_summary ? (
                  <div className="col-span-2 sm:col-span-3 pt-1 border-t border-stone-100 dark:border-slate-700/60 text-[11px]">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Today's Complaints: </span>
                    <span className="text-slate-600 dark:text-slate-400">{appointment.symptoms_summary}</span>
                  </div>
                ) : null}
              </div>
            </div>

            {savedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Consultation saved and visit marked complete!</span>
              </div>
            )}

            {/* PREVIOUS CLINICAL RECORDS & PRESCRIPTIONS SECTION */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-[#1B4332] dark:text-emerald-300">
                    <History className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      Previous Clinical Records & Prescriptions
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Historical visits, dispensed remedies & archived prescriptions
                    </p>
                  </div>
                </div>
                {pastRecords.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-[#1B4332] dark:text-emerald-300 text-[11px] font-bold">
                    {pastRecords.length} {pastRecords.length === 1 ? 'Past Visit' : 'Past Visits'}
                  </span>
                )}
              </div>

              {loadingHistory ? (
                <div className="p-4 rounded-xl border border-stone-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/60 flex items-center justify-center gap-2 text-xs text-slate-500">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                  <span>Loading previous clinical records...</span>
                </div>
              ) : pastRecords.length === 0 ? (
                <div className="p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center gap-2 text-xs text-blue-900 dark:text-blue-300">
                  <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="font-semibold">First-time Patient (No prior history recorded)</span>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {pastRecords.map((record) => {
                    const isExpanded = Boolean(expandedVisitIds[record.id]);
                    return (
                      <div
                        key={record.id}
                        className="rounded-xl bg-white dark:bg-slate-800 border border-emerald-900/15 dark:border-slate-700 shadow-2xs overflow-hidden transition-all"
                      >
                        {/* Accordion Summary Header (Clickable) */}
                        <button
                          type="button"
                          id={`btn-toggle-visit-${record.id}`}
                          onClick={() => toggleVisitAccordion(record.id)}
                          className={`w-full p-3 sm:p-3.5 flex flex-wrap items-center justify-between gap-2 text-left cursor-pointer transition select-none ${
                            isExpanded
                              ? 'bg-stone-100/90 dark:bg-slate-750/90 border-b border-stone-200 dark:border-slate-700'
                              : 'bg-stone-50/70 dark:bg-slate-800/80 hover:bg-stone-100/70 dark:hover:bg-slate-750'
                          }`}
                          aria-expanded={isExpanded}
                        >
                          {/* Left: Date, Time, Shift & Invoice Badge */}
                          <div className="flex items-center gap-2 flex-wrap min-w-0">
                            <Calendar className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                            <span className="font-bold text-xs text-slate-900 dark:text-white">
                              {record.formattedDate}
                            </span>
                            {record.invoiceNumber && (
                              <span className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-stone-200 dark:border-slate-600 text-stone-700 dark:text-slate-300 text-[10px] font-mono font-bold">
                                {record.invoiceNumber}
                              </span>
                            )}
                            {record.prescriptionUrl && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-semibold">
                                <FileText className="w-3 h-3" />
                                <span>Rx</span>
                              </span>
                            )}
                          </div>

                          {/* Right: Total Amount & Chevron Toggle */}
                          <div className="flex items-center gap-3 shrink-0 ml-auto">
                            {record.totalAmount != null && (
                              <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
                                Total: <strong className="text-slate-900 dark:text-white font-bold">₹{record.totalAmount}</strong>
                              </span>
                            )}
                            <div className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-white dark:bg-slate-700 border border-stone-200 dark:border-slate-600 flex items-center justify-center">
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                              )}
                            </div>
                          </div>
                        </button>

                        {/* Accordion Expanded Details */}
                        {isExpanded && (
                          <div className="p-3.5 space-y-3 bg-white dark:bg-slate-800 animate-fade-in">
                            {/* Complaints if any */}
                            {record.complaints && (
                              <div className="text-[11px] text-slate-600 dark:text-slate-400 bg-stone-50 dark:bg-slate-850 p-2.5 rounded-lg border border-stone-100 dark:border-slate-750">
                                <strong className="text-slate-700 dark:text-slate-300">Past Complaints: </strong>
                                <span>{record.complaints}</span>
                              </div>
                            )}

                            {/* Dispensed Medicines & dosages */}
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                                <Pill className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span>Dispensed Medicines & Dosages</span>
                              </div>
                              {record.medicines && record.medicines.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                  {record.medicines.map((med, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-[#1B4332] dark:text-emerald-200 font-medium"
                                    >
                                      <span>{med.description}</span>
                                      {med.price != null && med.price > 0 && (
                                        <span className="font-mono text-emerald-700 dark:text-emerald-400 text-[11px]">
                                          (₹{med.price})
                                        </span>
                                      )}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-[11px] text-slate-400 italic">No medicine items recorded for this visit.</p>
                              )}
                            </div>

                            {/* Prescription Thumbnail & View Button */}
                            <div className="pt-2 border-t border-stone-100 dark:border-slate-700/80 flex items-center justify-between">
                              {record.prescriptionUrl ? (
                                <div className="flex items-center gap-3">
                                  <div
                                    onClick={() => setSelectedPastPrescription(record)}
                                    className="w-12 h-12 rounded-lg border border-stone-200 dark:border-slate-700 overflow-hidden bg-black/5 dark:bg-black/20 cursor-pointer shrink-0 hover:opacity-85 transition shadow-2xs group relative"
                                    title="Click to expand prescription"
                                  >
                                    <img
                                      src={record.prescriptionUrl}
                                      alt="Prescription thumbnail"
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                      <Eye className="w-4 h-4 text-white drop-shadow" />
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    id={`btn-view-past-rx-${record.id}`}
                                    onClick={() => setSelectedPastPrescription(record)}
                                    className="px-3 py-1.5 rounded-lg bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>View Past Prescription</span>
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 italic">
                                  <FileText className="w-3.5 h-3.5 text-slate-300" />
                                  <span>No physical prescription photo archived</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* DIVIDER: TODAY'S PRESCRIPTION CAPTURE */}
            <div className="pt-3 border-t-2 border-dashed border-stone-200 dark:border-slate-700/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Today's Physical Prescription Capture
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Photograph or upload today's handwritten clinical prescription
                  </p>
                </div>
                {uploadingImage ? (
                  <span className="text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 font-medium animate-pulse">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> {uploadNotice || 'Processing WebP image...'}
                  </span>
                ) : uploadNotice ? (
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                    ✓ {uploadNotice}
                  </span>
                ) : null}
              </div>

              {/* Hidden file inputs */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleImageFileChange(e.target.files[0]);
                  }
                }}
              />
              <input
                type="file"
                ref={cameraInputRef}
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleImageFileChange(e.target.files[0]);
                  }
                }}
              />

              {!prescriptionImage ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    id="btn-camera-capture"
                    onClick={() => cameraInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="p-5 rounded-2xl border-2 border-dashed border-emerald-500/60 dark:border-emerald-700/60 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-100/60 dark:hover:bg-emerald-950/40 transition flex flex-col items-center justify-center gap-2 group cursor-pointer"
                  >
                    <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 group-hover:scale-110 transition-transform">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <span className="font-bold text-xs text-slate-900 dark:text-white block">
                        Direct Camera Capture
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Snap physical prescription (Auto-compressed WebP)
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    id="btn-upload-prescription-file"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="p-5 rounded-2xl border-2 border-dashed border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800/60 hover:bg-stone-100/70 dark:hover:bg-slate-800 transition flex flex-col items-center justify-center gap-2 group cursor-pointer"
                  >
                    <div className="p-3 rounded-xl bg-stone-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <span className="font-bold text-xs text-slate-900 dark:text-white block">
                        Upload Document / Picture
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Browse gallery photo (Auto-converts to WebP &lt;200KB)
                      </span>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-emerald-300 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800/80 shadow-xs">
                  <div className="flex items-center justify-between p-2 mb-2 bg-emerald-100/70 dark:bg-emerald-950/60 rounded-xl text-xs">
                    <div className="flex flex-wrap items-center gap-1.5 min-w-0 pr-2">
                      <span className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        Today's Prescription Attached
                      </span>
                      {compressionStats && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-950 dark:text-emerald-100 font-mono text-[10px] font-bold">
                          WebP • {compressionStats.compressedSizeKb} KB ({compressionStats.dimensions})
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPrescriptionImage(null);
                        setPrescriptionUrl(null);
                        setCompressionStats(null);
                        setUploadNotice('');
                      }}
                      className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Retake
                    </button>
                  </div>
                  <div className="max-h-64 overflow-hidden rounded-xl flex items-center justify-center bg-black/5 dark:bg-black/20">
                    <img
                      src={prescriptionImage}
                      alt="Prescription Scan"
                      className="object-contain max-h-60 rounded-lg shadow-inner"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer / Actions (Sticky & Pinned) */}
          <div className="shrink-0 p-4 border-t border-stone-200 dark:border-slate-800 bg-stone-50/90 dark:bg-slate-900/90 flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              id="btn-save-consultation-notes"
              onClick={handleSaveConsultation}
              disabled={saving || uploadingImage}
              className="px-4 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>{saving ? 'Saving...' : 'Save Consultation Record'}</span>
            </button>

            {onOpenInvoiceForPatient && (
              <button
                type="button"
                id="btn-proceed-to-invoice"
                onClick={handleProceedToInvoice}
                disabled={saving || uploadingImage}
                className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Receipt className="w-4 h-4" />}
                <span>Generate Billing & Invoice</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FULL-SIZE PRESCRIPTION LIGHTBOX VIEWER */}
      {selectedPastPrescription && selectedPastPrescription.prescriptionUrl && (
        <div
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex flex-col animate-fade-in"
          onClick={() => {
            setSelectedPastPrescription(null);
            setZoom(1);
            setRotation(0);
          }}
        >
          {/* Lightbox Header Bar */}
          <div
            className="shrink-0 p-3 sm:p-4 bg-black/85 border-b border-white/10 flex items-center justify-between text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-2">
              <div className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-700/50 text-emerald-400">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-xs sm:text-sm text-white truncate">
                  Past Prescription: {appointment.patient_name}
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-400">
                  {selectedPastPrescription.formattedDate}
                </p>
              </div>
            </div>

            {/* Action Controls */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(3.5, z + 0.25))}
                title="Zoom In"
                className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                title="Zoom Out"
                className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setRotation((r) => (r + 90) % 360)}
                title="Rotate 90°"
                className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setZoom(1);
                  setRotation(0);
                }}
                title="Reset Zoom & Rotation"
                className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              {selectedPastPrescription.prescriptionUrl.startsWith('http') && (
                <a
                  href={selectedPastPrescription.prescriptionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open image in new tab"
                  className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <button
                type="button"
                onClick={() => {
                  setSelectedPastPrescription(null);
                  setZoom(1);
                  setRotation(0);
                }}
                title="Close Lightbox (Esc)"
                className="p-1.5 sm:p-2 rounded-lg bg-red-600/80 hover:bg-red-600 text-white transition cursor-pointer ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Lightbox Body */}
          <div
            className="flex-1 overflow-auto p-4 flex items-center justify-center cursor-zoom-out select-none"
            onClick={() => {
              setSelectedPastPrescription(null);
              setZoom(1);
              setRotation(0);
            }}
          >
            <div
              className="transition-transform duration-200 ease-out flex items-center justify-center"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPastPrescription.prescriptionUrl}
                alt={`Prescription ${selectedPastPrescription.formattedDate}`}
                className="max-h-[82vh] max-w-[92vw] object-contain rounded-lg shadow-2xl bg-white select-none pointer-events-auto"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

