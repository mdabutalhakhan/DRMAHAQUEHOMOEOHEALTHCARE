import React, { useState, useRef } from 'react';
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
} from 'lucide-react';
import { Appointment } from '../types';
import { savePrescription, updateAppointmentStatus } from '../services/clinicStore';
import { getSupabase } from '../services/supabase';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onOpenInvoiceForPatient?: (appointment: Appointment, diagnosis: string) => void;
  onOpenAIConsultant?: (symptoms: string) => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onOpenInvoiceForPatient,
}) => {
  if (!isOpen || !appointment) return null;

  const [prescriptionImage, setPrescriptionImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Camera & File refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageFileChange = async (file: File) => {
    try {
      setUploadingImage(true);

      // 1. First convert to base64 preview
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string;
        setPrescriptionImage(base64Data);

        // 2. If Supabase is connected, upload to 'prescriptions' storage bucket
        const supabase = getSupabase();
        if (supabase) {
          try {
            const fileName = `${appointment.patient_id}_${Date.now()}.jpg`;
            const { data, error } = await supabase.storage
              .from('prescriptions')
              .upload(fileName, file, { contentType: file.type, upsert: true });

            if (!error && data) {
              const { data: publicUrlData } = supabase.storage
                .from('prescriptions')
                .getPublicUrl(fileName);
              if (publicUrlData?.publicUrl) {
                setPrescriptionImage(publicUrlData.publicUrl);
              }
            }
          } catch (storageErr) {
            console.warn('Supabase storage upload notice:', storageErr);
          }
        }
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Prescription image error:', err);
      setUploadingImage(false);
    }
  };

  const handleSaveConsultation = async () => {
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
        prescription_image_url: prescriptionImage || undefined,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg md:max-w-2xl max-h-[90vh] md:max-h-[88vh] flex flex-col bg-[#FAF7EE] dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-emerald-900/20">
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 overscroll-contain">
          {/* Patient Summary Header */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-xs">
            <div className="flex items-start justify-between gap-2 pb-3 border-b border-stone-100 dark:border-slate-700">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base text-slate-900 dark:text-white">
                    {appointment.patient_name}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    appointment.age != null && !isNaN(Number(appointment.age)) && Number(appointment.age) > 0
                      ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                  }`}>
                    {appointment.age != null && !isNaN(Number(appointment.age)) && Number(appointment.age) > 0 ? `${appointment.age} yrs` : 'Age: N/A'}
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
                  <span className="font-bold text-slate-700 dark:text-slate-300">Complaints: </span>
                  <span className="text-slate-600 dark:text-slate-400">{appointment.symptoms_summary}</span>
                </div>
              ) : null}
            </div>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Consultation saved and visit marked complete!</span>
            </div>
          )}

          {/* Physical Prescription Picture Capture */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Physical Prescription Picture / Scan
              </label>
              {uploadingImage && (
                <span className="text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> Uploading image...
                </span>
              )}
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
                      Snap physical prescription paper instantly
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
                      Browse JPG, PNG, or photo from gallery
                    </span>
                  </div>
                </button>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-emerald-300 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800/80 shadow-xs">
                <div className="flex items-center justify-between p-2 mb-2 bg-emerald-100/70 dark:bg-emerald-950/60 rounded-xl text-xs">
                  <span className="font-semibold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Prescription Image Captured
                  </span>
                  <button
                    type="button"
                    onClick={() => setPrescriptionImage(null)}
                    className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer"
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
            disabled={saving}
            className="px-4 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{saving ? 'Saving...' : 'Save Consultation Record'}</span>
          </button>

          {onOpenInvoiceForPatient && (
            <button
              type="button"
              id="btn-proceed-to-invoice"
              onClick={() => {
                handleSaveConsultation();
                onOpenInvoiceForPatient(appointment, 'Clinical evaluation completed');
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center gap-2 transition cursor-pointer"
            >
              <Receipt className="w-4 h-4" />
              <span>Generate Billing & Invoice</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
