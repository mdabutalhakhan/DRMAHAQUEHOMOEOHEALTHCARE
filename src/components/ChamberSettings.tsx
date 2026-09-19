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
  HardDrive,
  Key,
  Zap,
  Eye,
  EyeOff
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
import { 
  getGroqApiKey, 
  setGroqApiKey, 
  testGroqConnection 
} from '../services/groqClient';

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

  // AI Engine & API Configuration State
  const [groqKeyInput, setGroqKeyInput] = useState<string>('');
  const [activeGroqKey, setActiveGroqKey] = useState<string>('');
  const [showKeySecret, setShowKeySecret] = useState<boolean>(false);
  const [testingConnection, setTestingConnection] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [apiSaveMessage, setApiSaveMessage] = useState<string>('');

  // Load Groq API Key on mount and sync with local storage
  useEffect(() => {
    const key = getGroqApiKey();
    setActiveGroqKey(key);
    setGroqKeyInput(key);
  }, []);

  const handleSaveGroqKey = (overrideKey?: string) => {
    const key = (overrideKey !== undefined ? overrideKey : groqKeyInput).trim();
    setGroqApiKey(key);
    const updated = getGroqApiKey();
    setActiveGroqKey(updated);
    setGroqKeyInput(updated);
    setTestResult(null);
    if (updated) {
      setApiSaveMessage('Groq API Key saved successfully. AI Engine is active and ready.');
    } else {
      setApiSaveMessage('Groq API Key removed.');
    }
    // Notify all other components across the app via storage event
    window.dispatchEvent(new Event('storage'));
    setTimeout(() => {
      setApiSaveMessage('');
    }, 4500);
  };

  const handleTestConnection = async () => {
    const keyToTest = (groqKeyInput.trim() || activeGroqKey).trim();
    if (!keyToTest) {
      setTestResult({
        success: false,
        message: 'Please enter a Groq API Key (starts with gsk_...) before testing.'
      });
      return;
    }
    setTestingConnection(true);
    setTestResult(null);
    try {
      const res = await testGroqConnection(keyToTest);
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Failed to reach Groq API endpoint.'
      });
    } finally {
      setTestingConnection(false);
    }
  };

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
                Settings
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                Admin Control
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Dr. M. A. Haque, M.D. (Homoeo) • Doctor Profile, AI Engine Configuration & Chamber Assets
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

      {/* Dedicated Section: AI Engine & API Configuration */}
      <div 
        id="section-ai-engine-configuration"
        className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl border border-emerald-950/10 dark:border-slate-700 p-5 sm:p-7 shadow-xs space-y-5"
      >
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xs shrink-0">
              <Sparkles className="w-5 h-5 sm:w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  AI Engine & API Configuration
                </h3>
                <span className="text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  LPU Inference
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Configure Groq API Key for clinical Kent repertorization, differential remedies & prescription generation
              </p>
            </div>
          </div>

          {/* Status Indicator */}
          <div>
            {activeGroqKey ? (
              <div 
                id="status-indicator-groq-active"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-xs"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>Key Active: {activeGroqKey.slice(0, 7)}••••••••{activeGroqKey.slice(-4)}</span>
              </div>
            ) : (
              <div 
                id="status-indicator-groq-inactive"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold shadow-xs"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                <span>API Key Not Configured (Offline Mode)</span>
              </div>
            )}
          </div>
        </div>

        {/* Success Alert Banner */}
        {apiSaveMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/40 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2.5 animate-fade-in shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{apiSaveMessage}</span>
          </div>
        )}

        {/* Form Controls */}
        <div className="space-y-4 max-w-3xl">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label 
                htmlFor="groq-api-key-input" 
                className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
              >
                Groq API Key (starts with <code className="text-emerald-600 dark:text-emerald-400 font-mono">gsk_...</code>)
              </label>
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <span>Get Free Groq API Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative">
              <input
                id="groq-api-key-input"
                type={showKeySecret ? 'text' : 'password'}
                value={groqKeyInput}
                onChange={(e) => {
                  setGroqKeyInput(e.target.value);
                  if (testResult) setTestResult(null);
                }}
                placeholder="gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full px-4 py-3 pr-11 text-xs sm:text-sm font-mono rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden transition shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowKeySecret(!showKeySecret)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer rounded-lg"
                title={showKeySecret ? 'Hide Key' : 'Show Key'}
                aria-label={showKeySecret ? 'Hide Key' : 'Show Key'}
              >
                {showKeySecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              Your key is stored securely in your browser's chamber storage (<code className="font-mono text-emerald-600 dark:text-emerald-400">localStorage</code>) and connects directly to Groq's official LPU endpoint for high-speed homeopathic repertory queries.
            </p>
          </div>

          {/* Test Connection Result Alert */}
          {testResult && (
            <div
              id="test-connection-alert"
              className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 transition-all animate-fade-in ${
                testResult.success
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-red-50 dark:bg-red-950/60 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <p className="font-bold">{testResult.success ? 'Connection Successful' : 'Connection Error'}</p>
                <p className="text-[11px] opacity-90">{testResult.message}</p>
              </div>
            </div>
          )}

          {/* Action Buttons: Save Key, Test Connection, Clear */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              id="btn-save-api-key"
              type="button"
              onClick={() => handleSaveGroqKey()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] hover:from-[#2D6A4F] hover:to-[#1B4332] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save API Key</span>
            </button>

            <button
              id="btn-test-connection"
              type="button"
              onClick={handleTestConnection}
              disabled={testingConnection || (!groqKeyInput.trim() && !activeGroqKey)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {testingConnection ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                  <span>Testing Connection...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Test Connection</span>
                </>
              )}
            </button>

            {activeGroqKey && (
              <button
                id="btn-clear-api-key"
                type="button"
                onClick={() => handleSaveGroqKey('')}
                className="px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs sm:text-sm font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Key</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Settings = ChamberSettings;
export default ChamberSettings;
