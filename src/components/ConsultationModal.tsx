import React, { useState, useRef } from 'react';
import { 
  X, 
  Camera, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Receipt, 
  Sparkles, 
  User, 
  Phone, 
  MapPin, 
  Stethoscope, 
  Trash2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Appointment, Prescription } from '../types';
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
  onOpenAIConsultant,
}) => {
  if (!isOpen || !appointment) return null;

  const [clinicalDiagnosis, setClinicalDiagnosis] = useState('');
  const [repertorySymptoms, setRepertorySymptoms] = useState(appointment.symptoms_summary || '');
  const [prescriptionNotes, setPrescriptionNotes] = useState('');
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

        // 2. If Supabase is connected, upload to 'prescriptions' storage bucket!
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
        clinical_diagnosis: clinicalDiagnosis || 'General Clinical Homoeopathic Evaluation',
        repertory_symptoms: repertorySymptoms,
        prescription_notes: prescriptionNotes,
        prescription_image_url: prescriptionImage || undefined,
      });

      // Update appointment status to in_consult or completed
      updateAppointmentStatus(appointment.id, 'in_consult', prescriptionNotes);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="w-full max-w-3xl my-6 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-950/10 dark:border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6 relative max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                <Stethoscope className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Clinical Consultation & Prescription Chamber
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Doctor: <strong className="text-emerald-700 dark:text-emerald-400">Dr. M. A. Haque, M.D. (Homoeo)</strong>
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Patient Summary Card */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-slate-800/80 border border-emerald-200/60 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-500 dark:text-slate-400 block font-medium">Patient Name</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">{appointment.patient_name}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block font-medium">Patient ID</span>
            <span className="font-mono font-bold text-[#1B4332] dark:text-emerald-300">{appointment.patient_id}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block font-medium">Token & Slot</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {appointment.token_number} ({appointment.shift})
            </span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block font-medium">Phone & Area</span>
            <span className="text-slate-800 dark:text-slate-200">{appointment.phone} • {appointment.address}</span>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Prescription & clinical notes saved successfully!</span>
          </div>
        )}

        {/* Clinical Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
              Clinical Diagnosis / Miasmatic Assessment
            </label>
            <input
              type="text"
              placeholder="e.g. Chronic Allergic Rhinitis with Psora-Sycotic diathesis / Rheumatoid Arthritis"
              value={clinicalDiagnosis}
              onChange={(e) => setClinicalDiagnosis(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                  Repertory Symptoms & Modalities
                </label>
                {onOpenAIConsultant && (
                  <button
                    type="button"
                    onClick={() => onOpenAIConsultant(repertorySymptoms)}
                    className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask Gemini AI</span>
                  </button>
                )}
              </div>
              <textarea
                rows={3}
                placeholder="Key modalities (worse cold damp, better gentle motion, restless at night)..."
                value={repertorySymptoms}
                onChange={(e) => setRepertorySymptoms(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                Prescribed Remedies & Dosages
              </label>
              <textarea
                rows={3}
                placeholder="e.g. 1. Rhus Tox 200C - 4 pills tid&#10;2. Bryonia Alba 30C - 4 pills bid&#10;3. Five Phos 6X - 4 tabs tid"
                value={prescriptionNotes}
                onChange={(e) => setPrescriptionNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* PRESCRIPTION SCAN UPLOAD (Camera / File) */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
              Physical Prescription Picture / Camera Scan (Supabase Storage Bucket: `prescriptions`)
            </label>

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
                  className="p-5 rounded-2xl border-2 border-dashed border-emerald-400/60 dark:border-emerald-700/60 bg-emerald-50/40 dark:bg-emerald-950/20 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/40 transition flex flex-col items-center justify-center gap-2 group"
                >
                  <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 group-hover:scale-110 transition-transform">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <span className="font-bold text-xs text-slate-900 dark:text-white block">
                      Direct Camera Capture
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Snap physical prescription paper via mobile / tablet
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  id="btn-upload-prescription-file"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="p-5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex flex-col items-center justify-center gap-2 group"
                >
                  <div className="p-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <span className="font-bold text-xs text-slate-900 dark:text-white block">
                      Upload Document / Picture
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Browse JPG, PNG, or scanned PDF from device
                    </span>
                  </div>
                </button>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-emerald-300 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center justify-between p-2 mb-2 bg-emerald-100/70 dark:bg-emerald-950/60 rounded-xl text-xs">
                  <span className="font-semibold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Prescription Image Captured
                  </span>
                  <button
                    type="button"
                    onClick={() => setPrescriptionImage(null)}
                    className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
                <div className="max-h-60 overflow-hidden rounded-xl flex items-center justify-center bg-black/5">
                  <img
                    src={prescriptionImage}
                    alt="Prescription"
                    className="object-contain max-h-56 rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            id="btn-save-consultation-notes"
            onClick={handleSaveConsultation}
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-sm shadow-md flex items-center gap-2 transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Consultation Record'}</span>
          </button>

          <div className="flex items-center gap-2">
            {onOpenInvoiceForPatient && (
              <button
                type="button"
                id="btn-proceed-to-invoice"
                onClick={() => {
                  handleSaveConsultation();
                  onOpenInvoiceForPatient(appointment, clinicalDiagnosis);
                }}
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm flex items-center gap-2 transition"
              >
                <Receipt className="w-4 h-4" />
                <span>Generate Billing & Invoice</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
