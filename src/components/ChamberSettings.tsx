import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Trash2, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink,
  Image as ImageIcon,
  Check,
  Stethoscope,
  Building,
  HardDrive
} from 'lucide-react';
import { UserProfile } from '../types';
import { 
  fetchClinicSettings, 
  uploadDoctorPhotoToSupabase, 
  resetDoctorPhoto, 
  subscribeToStore,
  notifySubscribers
} from '../services/clinicStore';
import { getSupabase } from '../services/supabase';

interface ChamberSettingsProps {
  currentUser: UserProfile;
}

export const ChamberSettings: React.FC<ChamberSettingsProps> = ({ currentUser }) => {
  const [doctorImageUrl, setDoctorImageUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgressText, setUploadProgressText] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load current doctor photo from Supabase clinic_settings
  useEffect(() => {
    let isMounted = true;
    async function loadSettings() {
      setLoading(true);
      try {
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from('clinic_settings')
          .select('doctor_image_url')
          .eq('id', 'default')
          .single();
        if (data?.doctor_image_url && isMounted) {
          setDoctorImageUrl(data.doctor_image_url);
        }
      } catch (err) {
        console.warn('Error loading clinic settings from Supabase:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadSettings();

    // Subscribe to real-time sync across components/tabs
    const unsubscribe = subscribeToStore((event) => {
      if (event.type === 'clinic_settings' && event.data?.doctor_image_url !== undefined) {
        setDoctorImageUrl(event.data.doctor_image_url);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const handleFileProcess = async (file: File) => {
    setErrorMessage('');
    setSuccessMessage('');

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setErrorMessage('Invalid file format. Please upload a .jpg, .png, or .webp image.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image file is too large. Please select a photo under 5 MB.');
      return;
    }

    setUploading(true);
    setUploadProgressText('Uploading to Supabase Storage (clinic-assets)...');

    try {
      const supabase = getSupabase();
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `doctor_profile_${Date.now()}.${fileExt}`;

      // 1. Upload to Supabase Storage bucket clinic-assets
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('clinic-assets')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Supabase Storage upload failed: ${uploadError.message}`);
      }

      // 2. Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('clinic-assets')
        .getPublicUrl(fileName);
      const publicUrl = publicUrlData?.publicUrl;

      if (!publicUrl) {
        throw new Error('Failed to retrieve public URL from Supabase Storage.');
      }

      // 3. Explicitly update the Supabase database table clinic_settings
      const { error: dbError } = await supabase
        .from('clinic_settings')
        .upsert({ 
          id: 'default', 
          doctor_image_url: publicUrl, 
          updated_at: new Date().toISOString() 
        });

      if (dbError) {
        console.error('Supabase clinic_settings upsert error:', dbError);
        throw new Error(`Database error saving to clinic_settings: ${dbError.message}`);
      }

      // 4. Update UI state & broadcast sync
      if (typeof window !== 'undefined') {
        localStorage.setItem('hhc_doctor_image_url', publicUrl);
      }
      notifySubscribers('clinic_settings', { doctor_image_url: publicUrl });

      setDoctorImageUrl(publicUrl);
      setSuccessMessage('Doctor photo updated successfully!');
      
      // Auto-dismiss success message after 4 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
    } catch (err: any) {
      console.error('Photo upload error:', err);
      setErrorMessage(err.message || 'Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgressText('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleResetPhoto = async () => {
    if (confirm('Are you sure you want to remove the doctor profile photo and revert to the default initials avatar?')) {
      setUploading(true);
      try {
        const supabase = getSupabase();
        await supabase
          .from('clinic_settings')
          .upsert({
            id: 'default',
            doctor_image_url: '',
            updated_at: new Date().toISOString()
          });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('hhc_doctor_image_url');
        }
        notifySubscribers('clinic_settings', { doctor_image_url: '' });
        setDoctorImageUrl('');
        setSuccessMessage('Doctor photo reset to default avatar.');
        setTimeout(() => setSuccessMessage(''), 4000);
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to reset photo.');
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] text-white shadow-xs shrink-0">
            <Camera className="w-5 h-5 sm:w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
                Doctor Profile & Chamber Settings
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                Admin Control
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Dr. M. A. Haque, M.D. (Homoeo) • Supabase Storage `clinic-assets` & Live Website Branding
            </p>
          </div>
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Syncing Supabase...</span>
          </div>
        )}
      </div>

      {/* Success Alert Toast */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/40 text-emerald-900 dark:text-emerald-200 flex items-center gap-3 shadow-xs animate-fade-in">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">{successMessage}</p>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              The updated photo has been synchronized to the Home Page and across all open sessions.
            </p>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 flex items-center gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <p className="text-xs font-semibold">{errorMessage}</p>
        </div>
      )}

      {/* Main Grid: Upload Center + Live Home Page Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Doctor Photo Upload Center */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl border border-emerald-950/10 dark:border-slate-700 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-600" />
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                Doctor Profile Photo Management
              </h3>
            </div>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              clinic-assets
            </span>
          </div>

          {/* Current Doctor Photo Preview Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row items-center gap-5">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] text-white flex items-center justify-center font-black text-3xl shadow-md border-2 border-emerald-500/30 shrink-0">
              {doctorImageUrl ? (
                <img
                  src={doctorImageUrl}
                  alt="Dr. M. A. Haque, M.D."
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={() => setDoctorImageUrl('')}
                />
              ) : (
                <span>MH</span>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-xs">
                  <RefreshCw className="w-7 h-7 text-emerald-300 animate-spin" />
                </div>
              )}
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h4 className="font-black text-base text-slate-900 dark:text-white truncate">
                  Dr. M. A. Haque
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  M.D. (Homoeo)
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {doctorImageUrl 
                  ? 'Custom photo currently active on Public Home Page & Official Vouchers.' 
                  : 'Currently showing default "MH" monogram initials avatar.'}
              </p>
              
              <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                {doctorImageUrl && (
                  <button
                    type="button"
                    onClick={handleResetPhoto}
                    disabled={uploading}
                    className="px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Reset to Monogram</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Drag & Drop File Upload Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition-all cursor-pointer ${
              dragActive
                ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 scale-[1.01]'
                : 'border-slate-300 dark:border-slate-700 hover:border-emerald-600 dark:hover:border-emerald-500 bg-white dark:bg-slate-900/40'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="max-w-xs mx-auto space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-[#1B4332] dark:text-emerald-400 mx-auto flex items-center justify-center shadow-xs">
                {uploading ? (
                  <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
                ) : (
                  <Upload className="w-6 h-6 text-emerald-600" />
                )}
              </div>

              <div>
                <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  {uploading ? uploadProgressText : 'Click to Upload or Drag & Drop'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports JPG, PNG, or WebP (Max 5 MB)
                </p>
              </div>

              <button
                type="button"
                disabled={uploading}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-5 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold inline-flex items-center gap-2 shadow-sm transition cursor-pointer disabled:opacity-50"
              >
                <Camera className="w-4 h-4 text-emerald-300" />
                <span>Select from Gallery / Camera</span>
              </button>
            </div>
          </div>

          {/* Storage & Database Diagnostics Indicator */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-emerald-600" />
                <span>Storage Bucket:</span>
              </span>
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                clinic-assets (Public)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-emerald-600" />
                <span>Database Table:</span>
              </span>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                public.clinic_settings.doctor_image_url
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Website Card Simulation Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl border border-emerald-950/10 dark:border-slate-700 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Live Public Home Preview
                </h3>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                Real-Time View
              </span>
            </div>

            <p className="text-xs text-slate-400">
              This is how Dr. M. A. Haque's profile card appears to visiting patients on the website home page:
            </p>

            {/* Doctor Card Mockup matching PublicHome.tsx */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-950/10 dark:border-slate-700 shadow-md space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] text-white flex items-center justify-center font-bold text-2xl shadow-inner shrink-0 border border-emerald-500/20">
                  {doctorImageUrl ? (
                    <img
                      src={doctorImageUrl}
                      alt="Dr. M. A. Haque"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span>MH</span>
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                    Dr. M. A. Haque
                  </h4>
                  <p className="text-xs font-semibold text-[#2D6A4F] dark:text-emerald-400">
                    M.D. (Homoeo) • Homoeopathic Healthcare
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Senior Consultant & Chronic Disease Specialist
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Specialized in Chronic Rhinitis, Asthma, Rheumatic Arthritis, Gastric issues & Skin Allergies.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Pure Hahnemannian Homeopathy with high-grade German, European & Indian pharmacopoeia remedies.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Complete digitized token & queue tracker to respect patient consultation time.</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Consultation Shifts:</span>
                <span className="font-bold text-emerald-800 dark:text-emerald-300">Morning & Evening (Sat–Thu)</span>
              </div>
            </div>

            {/* Chamber Location & Timing Reference */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-slate-900/40 border border-emerald-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                <span>Chamber Contact & Location</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                Dr. M. A. Haque Homoeo Health Care<br />
                Salbagan Road, Benachity, Durgapur, PIN: 713213<br />
                Helpline: +91 9933506514
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
