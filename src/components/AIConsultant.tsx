import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  BookOpen, 
  PlusCircle, 
  AlertCircle,
  HeartPulse,
  Apple,
  Copy,
  Check,
  PackageSearch,
  ShieldAlert,
  ChevronDown,
  Info
} from 'lucide-react';
import { AIConsultationResponse, AIRemedyRecommendation, RemedySuggestion } from '../types';
import { getRepertoryAnalysis } from '../data/homeopathicRepertory';
import { getInventory } from '../services/clinicStore';

interface AIConsultantProps {
  initialSymptoms?: string;
  onAddRemedyToBilling?: (remedy: AIRemedyRecommendation) => void;
  onNavigateToInventory?: (searchQuery?: string) => void;
}

export const AIConsultant: React.FC<AIConsultantProps> = ({
  initialSymptoms = '',
  onAddRemedyToBilling,
  onNavigateToInventory,
}) => {
  const [symptoms, setSymptoms] = useState(initialSymptoms);
  const [modalities, setModalities] = useState('');
  const [mindDisposition, setMindDisposition] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState<AIConsultationResponse | null>(null);
  const [engineSource, setEngineSource] = useState<'gemini' | 'repertory'>('repertory');

  // Copy feedback state { [remedyIdx]: boolean }
  const [copiedStates, setCopiedStates] = useState<{ [key: number]: boolean }>({});

  // Stock check states { [remedyIdx]: { checked: boolean; found: boolean; details?: string; stock?: number; rack?: string } }
  const [stockStatus, setStockStatus] = useState<{
    [key: number]: { checked: boolean; found: boolean; details: string; stock?: number; rack?: string };
  }>({});

  // Web Speech API Voice Recognition
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setSpeechSupported(false);
    }
  }, []);

  useEffect(() => {
    if (initialSymptoms) {
      setSymptoms(initialSymptoms);
    }
  }, [initialSymptoms]);

  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN'; // Indian English / Global

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSymptoms((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  const handleConsultGemini = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!symptoms.trim()) {
      setErrorMsg('Please enter symptoms or speak via the voice microphone.');
      return;
    }

    setLoading(true);
    setStockStatus({});

    let consultResult: AIConsultationResponse | null = null;
    let usedEngine: 'gemini' | 'repertory' = 'repertory';

    // 1. Try Gemini API with safety checks
    try {
      // Check for client-side or server-side API call
      const res = await fetch('/api/gemini/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: symptoms.trim(),
          modalities: modalities.trim(),
          mindDisposition: mindDisposition.trim(),
          apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && (data.remedies?.length > 0 || data.analysis_summary)) {
          consultResult = {
            analysis_summary: data.analysis_summary || `Clinical Homoeopathic Evaluation for: ${symptoms.trim()}`,
            remedies: data.remedies || [],
            repertory_keynotes: data.repertory_keynotes || [],
            diet_and_regimen: data.diet_and_regimen || 'Avoid raw onion, garlic, strong coffee, and camphor within 30 minutes of dose.',
            warning_notes: data.warning_notes || 'Clinical Reference only. Final prescription must be verified by Dr. M. A. Haque, M.D.',
          };
          usedEngine = 'gemini';
        }
      }
    } catch (apiErr) {
      console.warn('Gemini API call bypassed or unavailable, falling back seamlessly to Materia Medica Repertory:', apiErr);
    }

    // 2. OFFLINE MATERIA MEDICA FALLBACK
    // If Gemini API fails, is missing, returns non-OK, or is rate-limited:
    // DO NOT SHOW RED ERROR! Automatically fallback to internal comprehensive Homeopathic Repertory dictionary.
    if (!consultResult || consultResult.remedies.length === 0) {
      consultResult = getRepertoryAnalysis(symptoms, modalities, mindDisposition);
      usedEngine = 'repertory';
    }

    setResult(consultResult);
    setEngineSource(usedEngine);
    setLoading(false);
  };

  const handleCopyRemedy = (remedy: RemedySuggestion, idx: number) => {
    const textToCopy = `${remedy.remedy_name} (${remedy.potency}) - Dosage: ${remedy.dosage}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedStates((prev) => ({ ...prev, [idx]: true }));
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [idx]: false }));
    }, 2000);
  };

  const handleCheckStock = (remedy: RemedySuggestion, idx: number) => {
    const currentMedicines = getInventory();
    const rawName = remedy.remedy_name.toLowerCase();
    
    // Extract key token (e.g. "Rhus Tox", "Bryonia", "Nux Vomica", "Arnica")
    const words = rawName
      .replace(/[()]/g, ' ')
      .split(' ')
      .filter((w) => w.length > 2 && !['the', 'and', 'extract'].includes(w));

    const matched = currentMedicines.filter((m) => {
      const medName = m.medicine_name.toLowerCase();
      return words.some((word) => medName.includes(word));
    });

    if (matched.length > 0) {
      const topMatch = matched[0];
      const totalStock = matched.reduce((acc, m) => acc + (m.stock_quantity || 0), 0);
      setStockStatus((prev) => ({
        ...prev,
        [idx]: {
          checked: true,
          found: true,
          details: `Found in inventory: ${topMatch.medicine_name} (${topMatch.category || 'Dilution'})`,
          stock: totalStock,
          rack: topMatch.rack_location || 'Rack General',
        },
      }));
    } else {
      setStockStatus((prev) => ({
        ...prev,
        [idx]: {
          checked: true,
          found: false,
          details: `"${remedy.remedy_name}" not found in current inventory. Can be dispensed from clinic bulk reserve.`,
        },
      }));
    }
  };

  // Quick preset clinical case triggers
  const loadPresetCase = (type: 'arthritis' | 'rhinitis' | 'gastric' | 'skin' | 'cough' | 'headache' | 'anxiety') => {
    if (type === 'arthritis') {
      setSymptoms('Joint pain and stiffness in bilateral knees and lower back. Restless at night.');
      setModalities('Worse cold damp weather, worse beginning to move; better continued gentle motion and warm dry fomentation.');
      setMindDisposition('Anxious, restless, irritable when questioned about illness.');
    } else if (type === 'rhinitis') {
      setSymptoms('Violent paroxysms of sneezing with watery acrid nasal discharge, burning eyes with bland lachrymation.');
      setModalities('Worse warm stuffy room, evening; better open fresh cool breeze.');
      setMindDisposition('Mild, weeping disposition, seeks company and sympathy.');
    } else if (type === 'gastric') {
      setSymptoms('Heartburn, acid dyspepsia, sour eructations, heaviness in epigastrium 2 hours after food.');
      setModalities('Worse morning, sedentary lifestyle, after rich spicy foods and stimulants.');
      setMindDisposition('Short-tempered, fastidious, sensitive to noise and light.');
    } else if (type === 'skin') {
      setSymptoms('Intense voluptuous itching on limbs and skin folds with red vesicular rash followed by burning.');
      setModalities('Worse warmth of bed, washing with water, evening; better warm dry room.');
      setMindDisposition('Aversion to bathing, irritable, heated head with burning soles.');
    } else if (type === 'cough') {
      setSymptoms('Violent paroxysmal dry spasmodic barking cough, suffocative tickling in larynx.');
      setModalities('Worse at night lying down flat, after midnight, cold dry winds; better sitting upright, warm drinks.');
      setMindDisposition('Anxious, holding chest with hands while coughing.');
    } else if (type === 'headache') {
      setSymptoms('Sudden throbbing violent congestive headache with flushed red face and sensitivity to light.');
      setModalities('Worse noise, light, jarring footsteps, afternoon 3 PM; better dark room, tight pressure.');
      setMindDisposition('Sensitive, agitated, desires quiet and darkness.');
    } else if (type === 'anxiety') {
      setSymptoms('Sudden acute panic, rapid heart palpitations, intense restlessness and sleeplessness with racing thoughts.');
      setModalities('Worse midnight (12-2 AM), solitude, cold air; better warmth, presence of doctor or family.');
      setMindDisposition('Extreme anguish, fear of disease, pacing the room.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] text-white shadow-md shrink-0">
              <Sparkles className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  AI Clinical Homoeopathic Consultant
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                  Boericke & Kent Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Classical Similia Repertorization • Modalities Analysis • Real-time Clinic Inventory Lookup
              </p>
            </div>
          </div>

          {/* Mandatory Medical Disclaimer badge */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-semibold shadow-2xs">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Clinical Reference only. Final prescription must be verified by Dr. M. A. Haque, M.D.</span>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-800 rounded-3xl border border-emerald-950/10 dark:border-slate-700 p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              Patient Clinical Presentation
            </span>
            <span className="text-[11px] text-slate-400">Step 1: Record Keynotes</span>
          </div>

          {/* Clinical Presets Chips */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Quick Clinical Presets:
              </span>
              <span className="text-[10px] text-slate-400">One-click populate</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'arthritis', label: 'Joint Pain / Arthritis' },
                { id: 'rhinitis', label: 'Rhinitis / Allergy' },
                { id: 'gastric', label: 'Acidity / GERD' },
                { id: 'skin', label: 'Skin Rash / Eczema' },
                { id: 'cough', label: 'Cough / Bronchial' },
                { id: 'headache', label: 'Migraine / Headache' },
                { id: 'anxiety', label: 'Anxiety / Panic' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => loadPresetCase(p.id as any)}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 hover:text-emerald-900 dark:text-slate-300 text-xs font-semibold transition cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleConsultGemini} className="space-y-4">
            {/* Chief Complaints with Voice Recognition */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Chief Complaints & Physical Sensations *
                </label>
                {speechSupported && (
                  <button
                    type="button"
                    onClick={toggleSpeechRecognition}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                      isListening
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200'
                    }`}
                    title="Speak symptoms using microphone"
                  >
                    {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{isListening ? 'Listening...' : 'Voice Dictate'}</span>
                  </button>
                )}
              </div>
              <textarea
                rows={4}
                required
                id="ai-symptoms-input"
                placeholder="Describe symptoms, locations, sensation (e.g. stitching pain, burning, heaviness, throbbing)..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 transition font-sans"
              />
            </div>

            {/* Modalities */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Modalities (Aggravation & Amelioration)
              </label>
              <input
                type="text"
                id="ai-modalities-input"
                placeholder="e.g. Worse cold damp, night, movement; Better heat, rest, dry weather"
                value={modalities}
                onChange={(e) => setModalities(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
              />
            </div>

            {/* Mental Disposition */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Mental Disposition & Constitution
              </label>
              <input
                type="text"
                id="ai-mind-input"
                placeholder="e.g. Restless, anxious about health, irritable, mild weeping, fastidious"
                value={mindDisposition}
                onChange={(e) => setMindDisposition(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              id="btn-run-ai-consult"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>{loading ? 'Repertorizing Clinical Keynotes...' : 'Analyze Symptoms & Repertorize'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Results & Remedy Cards */}
        <div className="lg:col-span-7 space-y-5">
          {!result && !loading && (
            <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mx-auto">
                <BookOpen className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                  Materia Medica Clinical Intelligence Ready
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Enter patient complaints or select a clinical preset to generate classical homoeopathic differential remedies, modalities, potency recommendations, and inventory stock verification.
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="p-10 rounded-3xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 text-center space-y-4 animate-pulse">
              <div className="w-12 h-12 rounded-2xl bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 flex items-center justify-center mx-auto animate-spin">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Repertorizing Symptoms in Boericke & Kent Materia Medica...
                </p>
                <p className="text-xs text-slate-500">
                  Cross-referencing aggravations, ameliorations, and constitutional keynotes...
                </p>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-5">
              {/* Clinical Assessment Header Box */}
              <div className="p-5 rounded-3xl bg-emerald-50/80 dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[#1B4332] dark:text-emerald-300 font-bold text-sm">
                    <HeartPulse className="w-4 h-4" />
                    <span>Clinical Assessment & Miasmatic Repertory</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-slate-600 shadow-2xs">
                    {engineSource === 'gemini' ? '✨ Gemini AI Engine' : '📚 Materia Medica Repertory Engine'}
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {result.analysis_summary}
                </p>
              </div>

              {/* Remedy Cards List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Recommended Similimum & Differential Remedies ({result.remedies.length})
                  </h3>
                  <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                    Verified Keynotes
                  </span>
                </div>

                {result.remedies.map((remedy, idx) => {
                  const isCopied = copiedStates[idx];
                  const stockInfo = stockStatus[idx];

                  return (
                    <div
                      key={idx}
                      className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 shadow-sm space-y-4 hover:border-emerald-300 dark:hover:border-emerald-700 transition"
                    >
                      {/* Card Header: Remedy Name, Potency, Action Buttons */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-base text-[#1B4332] dark:text-emerald-400">
                              {remedy.remedy_name}
                            </h4>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              {remedy.potency}
                            </span>
                          </div>
                          {remedy.common_name && (
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Common: <span className="font-medium text-slate-700 dark:text-slate-300">{remedy.common_name}</span>
                            </p>
                          )}
                        </div>

                        {/* Top Action Buttons: Copy & Add to Billing */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleCopyRemedy(remedy, idx)}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                            title="Copy Remedy Name & Potency"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                          </button>

                          {onAddRemedyToBilling && (
                            <button
                              type="button"
                              onClick={() => onAddRemedyToBilling(remedy)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                              title="Add to Billing Items"
                            >
                              <PlusCircle className="w-3.5 h-3.5" />
                              <span>+ Bill</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Modalities (Aggravation & Amelioration) */}
                      {remedy.modalities && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 rounded-xl bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50">
                            <span className="font-bold text-red-800 dark:text-red-300 block mb-0.5 text-[11px] uppercase tracking-wide">
                              ⚠️ Aggravation (Worse):
                            </span>
                            <p className="text-slate-700 dark:text-slate-300 leading-snug">
                              {remedy.modalities.worse}
                            </p>
                          </div>
                          <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
                            <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5 text-[11px] uppercase tracking-wide">
                              🌿 Amelioration (Better):
                            </span>
                            <p className="text-slate-700 dark:text-slate-300 leading-snug">
                              {remedy.modalities.better}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Dosage Guide */}
                      <div className="p-3 rounded-2xl bg-stone-50 dark:bg-slate-900/50 border border-stone-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div>
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                            Potency & Dosage Guide:
                          </span>
                          <span className="font-extrabold text-slate-800 dark:text-slate-200">
                            {remedy.potency} • {remedy.dosage}
                          </span>
                        </div>

                        {/* Check Inventory Stock Button */}
                        <button
                          type="button"
                          onClick={() => handleCheckStock(remedy, idx)}
                          className="px-3 py-1.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-2xs self-start sm:self-auto"
                        >
                          <PackageSearch className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Check Inventory Stock</span>
                        </button>
                      </div>

                      {/* Stock Check Result Banner (Appears when clicked) */}
                      {stockInfo && stockInfo.checked && (
                        <div
                          className={`p-3 rounded-2xl text-xs flex items-center justify-between gap-3 border transition-all ${
                            stockInfo.found
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {stockInfo.found ? (
                              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                            )}
                            <div className="min-w-0">
                              <p className="font-bold truncate">{stockInfo.details}</p>
                              {stockInfo.found && (
                                <p className="text-[11px] opacity-85">
                                  Location: <strong className="font-mono">{stockInfo.rack}</strong> • Total Available: <strong>{stockInfo.stock} units</strong>
                                </p>
                              )}
                            </div>
                          </div>

                          {onNavigateToInventory && (
                            <button
                              type="button"
                              onClick={() => onNavigateToInventory(remedy.remedy_name)}
                              className="text-[11px] underline font-bold shrink-0 hover:opacity-80 cursor-pointer"
                            >
                              Go to Inventory →
                            </button>
                          )}
                        </div>
                      )}

                      {/* Materia Medica Keynote */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 leading-relaxed font-serif">
                        <strong className="font-sans font-bold text-slate-800 dark:text-slate-200">Materia Medica Keynote: </strong>
                        {remedy.materia_medica_notes}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Diet & Regimen */}
              {result.diet_and_regimen && (
                <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                    <Apple className="w-4 h-4 text-emerald-600" />
                    <span>Homoeopathic Regimen & Dietary Guidance</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {result.diet_and_regimen}
                  </p>
                </div>
              )}

              {/* Mandatory Medical Disclaimer badge at bottom */}
              <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center gap-2 text-xs text-amber-900 dark:text-amber-200">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-medium">
                  <strong>Prescription Disclaimer:</strong> Clinical Reference only. Final prescription must be verified by Dr. M. A. Haque, M.D.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
