import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Send, 
  BookOpen, 
  Activity, 
  CheckCircle2, 
  PlusCircle, 
  AlertCircle,
  Lightbulb,
  HeartPulse,
  Apple
} from 'lucide-react';
import { AIConsultationResponse, AIRemedyRecommendation } from '../types';

interface AIConsultantProps {
  initialSymptoms?: string;
  onAddRemedyToBilling?: (remedy: AIRemedyRecommendation) => void;
}

export const AIConsultant: React.FC<AIConsultantProps> = ({
  initialSymptoms = '',
  onAddRemedyToBilling,
}) => {
  const [symptoms, setSymptoms] = useState(initialSymptoms);
  const [modalities, setModalities] = useState('');
  const [mindDisposition, setMindDisposition] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState<AIConsultationResponse | null>(null);

  // Web Speech API Voice Recognition
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setSpeechSupported(false);
    }
  }, []);

  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
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
      setErrorMsg('Please describe patient symptoms or speak via the microphone.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/gemini/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms,
          modalities,
          mindDisposition,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get clinical homoeopathic analysis');
      }

      const data: AIConsultationResponse = await res.json();
      setResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with AI Assistant');
    } finally {
      setLoading(false);
    }
  };

  // Quick preset clinical case triggers
  const loadPresetCase = (type: 'arthritis' | 'rhinitis' | 'gastric') => {
    if (type === 'arthritis') {
      setSymptoms('Joint pain and stiffness in bilateral knees and lower back. Restless at night.');
      setModalities('Worse cold damp weather, worse beginning to move; better continued gentle motion and warm applications.');
      setMindDisposition('Anxious, restless, irritable when questioned.');
    } else if (type === 'rhinitis') {
      setSymptoms('Violent paroxysms of sneezing with watery acrid nasal discharge, burning eyes with bland lachrymation.');
      setModalities('Worse warm room, evening; better open fresh cool air.');
      setMindDisposition('Mild, weeping disposition, seeks company and sympathy.');
    } else if (type === 'gastric') {
      setSymptoms('Heartburn, acid dyspepsia, sour eructations, heaviness in abdomen 2 hours after food.');
      setModalities('Worse morning, sedentary lifestyle, after rich spicy food and stimulants.');
      setMindDisposition('Short-tempered, ambitious, sensitive to noise and light.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] text-white shadow-md">
            <Sparkles className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              AI Clinical Homoeopathic Consultant
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Powered by Google Gemini (@google/genai) • Repertory & Boericke / Kent Materia Medica Engine
            </p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 bg-white dark:bg-slate-800 rounded-3xl border border-emerald-950/10 dark:border-slate-700 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              Clinical Inputs
            </span>

            {/* Presets */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400">Presets:</span>
              <button
                type="button"
                onClick={() => loadPresetCase('arthritis')}
                className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 transition text-[11px]"
              >
                Arthritis
              </button>
              <button
                type="button"
                onClick={() => loadPresetCase('rhinitis')}
                className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 transition text-[11px]"
              >
                Rhinitis
              </button>
              <button
                type="button"
                onClick={() => loadPresetCase('gastric')}
                className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 transition text-[11px]"
              >
                Gastric
              </button>
            </div>
          </div>

          <form onSubmit={handleConsultGemini} className="space-y-4">
            {/* Chief Complaints with Voice Button */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                  Chief Complaints & Physical Sensations *
                </label>
                {speechSupported && (
                  <button
                    type="button"
                    onClick={toggleSpeechRecognition}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
                      isListening
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200'
                    }`}
                    title="Speak symptoms using Web Speech API"
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
                placeholder="Describe symptoms, locations, sensation (e.g. throbbing, burning, stitching pain), onset..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
              />
            </div>

            {/* Modalities */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
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

            {/* Mind & Disposition */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                Mental Disposition & Constitution
              </label>
              <input
                type="text"
                id="ai-mind-input"
                placeholder="e.g. Restless, anxious about health, weep easily, obstinate, fastidious"
                value={mindDisposition}
                onChange={(e) => setMindDisposition(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              id="btn-run-ai-consult"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>{loading ? 'Consulting Gemini Materia Medica...' : 'Analyze Symptoms with Gemini AI'}</span>
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-6 space-y-6">
          {!result && !loading && (
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mx-auto">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Materia Medica Clinical Intelligence</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Provide patient symptoms or select a clinical preset above. The Gemini AI engine repertorizes keynotes according to classical Hahnemannian principles.
              </p>
            </div>
          )}

          {loading && (
            <div className="p-10 rounded-3xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 text-center space-y-4 animate-pulse">
              <div className="w-12 h-12 rounded-2xl bg-emerald-200 text-emerald-800 flex items-center justify-center mx-auto animate-spin">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Repertorizing Symptoms in Boericke & Kent Materia Medica...
              </p>
              <p className="text-xs text-slate-500">Cross-referencing modalities and potencies...</p>
            </div>
          )}

          {result && (
            <div className="space-y-5">
              {/* Clinical Analysis Box */}
              <div className="p-5 rounded-3xl bg-emerald-50/70 dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 text-[#1B4332] dark:text-emerald-300 font-bold text-sm">
                  <HeartPulse className="w-4 h-4" />
                  <span>Clinical Assessment & Miasmatic Analysis</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {result.analysis}
                </p>
              </div>

              {/* Recommended Remedies List */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center justify-between">
                  <span>Similimum & Differential Remedies ({result.remedies?.length || 0})</span>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400">Classical Potencies</span>
                </h3>

                {result.remedies?.map((remedy, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 shadow-sm space-y-3 hover:border-emerald-300 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-base text-[#1B4332] dark:text-emerald-400">
                            {remedy.name}
                          </h4>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                            {remedy.potency}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Dosage: <strong className="text-slate-800 dark:text-slate-200">{remedy.dosage}</strong>
                        </p>
                      </div>

                      {onAddRemedyToBilling && (
                        <button
                          type="button"
                          onClick={() => onAddRemedyToBilling(remedy)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-900 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition"
                          title="Add this remedy directly to active billing items"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Add to Billing</span>
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed">
                      <strong>Materia Medica Keynote:</strong> {remedy.materia_medica_notes}
                    </p>
                  </div>
                ))}
              </div>

              {/* Diet & Lifestyle */}
              {result.diet_and_lifestyle && result.diet_and_lifestyle.length > 0 && (
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                    <Apple className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Homoeopathic Regimen & Dietary Advice</span>
                  </div>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                    {result.diet_and_lifestyle.map((advice, i) => (
                      <li key={i}>{advice}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
