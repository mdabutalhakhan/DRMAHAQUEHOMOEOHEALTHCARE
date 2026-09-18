import React, { useState, useEffect, useMemo } from 'react';
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
  Search,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Pill,
  Languages,
  X,
  Stethoscope,
  ExternalLink,
  Layers
} from 'lucide-react';
import { ClinicLogo } from './ClinicLogo';
import { getSupabase } from '../services/supabase';
import { getInventory } from '../services/clinicStore';
import { 
  findRepertoryMatch, 
  ClinicalCondition, 
  ClassicalRemedy, 
  PatentFormulation 
} from '../data/clinicalRepertoryData';
import { callGeminiDirectlyFromClient } from '../services/geminiClient';

interface AIConsultantProps {
  initialSymptoms?: string;
  onAddRemedyToBilling?: (remedy: any) => void;
  onNavigateToInventory?: (medicineName?: string) => void;
}

export const AIConsultant: React.FC<AIConsultantProps> = ({
  initialSymptoms = '',
  onAddRemedyToBilling,
  onNavigateToInventory,
}) => {
  const [symptoms, setSymptoms] = useState(initialSymptoms);
  const [selectedCondition, setSelectedCondition] = useState<ClinicalCondition | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('all');
  const [consultSource, setConsultSource] = useState<'repertory' | 'gemini'>('repertory');
  const [errorMsg, setErrorMsg] = useState('');

  // Voice Engine State
  const [speechLang, setSpeechLang] = useState<'en' | 'bn'>('en');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  // Live Inventory State from Supabase & Store
  const [inventoryItems, setInventoryItems] = useState<
    Array<{ id: string; name: string; rack_location?: string; stock_qty: number; mrp?: number }>
  >([]);
  const [inventoryLoaded, setInventoryLoaded] = useState(false);

  // User Action Feedback
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [addedBillKey, setAddedBillKey] = useState<string | null>(null);

  // Check Web Speech API support
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setSpeechSupported(false);
    }
  }, []);

  // Sync initialSymptoms prop if provided
  useEffect(() => {
    if (initialSymptoms) {
      setSymptoms(initialSymptoms);
      handleAnalyze(initialSymptoms);
    }
  }, [initialSymptoms]);

  // Load Inventory from Supabase (or clinicStore fallback)
  useEffect(() => {
    const fetchInventory = async () => {
      let items: Array<{ id: string; name: string; rack_location?: string; stock_qty: number; mrp?: number }> = [];
      const supabase = getSupabase();
      
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('medicines')
            .select('id, name, rack_location, stock_qty, mrp');
          
          if (!error && data && data.length > 0) {
            items = data.map((d: any) => ({
              id: String(d.id),
              name: String(d.name || ''),
              rack_location: d.rack_location || undefined,
              stock_qty: Number(d.stock_qty) || 0,
              mrp: Number(d.mrp) || 0,
            }));
          }
        } catch (err) {
          console.warn('Supabase medicines query error, falling back to local inventory:', err);
        }
      }

      // Merge / fallback with local clinic store
      if (items.length === 0) {
        try {
          const localInv = getInventory();
          if (localInv && localInv.length > 0) {
            items = localInv.map((m) => ({
              id: m.id,
              name: m.medicine_name,
              rack_location: m.rack_location,
              stock_qty: m.stock_quantity || 0,
              mrp: m.mrp || 0,
            }));
          }
        } catch (err) {
          console.warn('Local inventory load error:', err);
        }
      }

      setInventoryItems(items);
      setInventoryLoaded(true);
    };

    fetchInventory();
  }, []);

  // Voice Dictation Handler with EN / বাংলা Language Switching
  const handleToggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMsg('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
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

      // When বাংলা is active: 'bn-IN'. When EN is active: 'en-IN'
      recognition.lang = speechLang === 'bn' ? 'bn-IN' : 'en-IN';

      recognition.onstart = () => {
        // Automatically clear previous text upon starting a new speech session to avoid text duplication
        setSymptoms('');
        setIsListening(true);
        setErrorMsg('');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setSymptoms(transcript);
          setIsListening(false);
          // Auto analyze recognized symptoms
          handleAnalyze(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition start failed:', err);
      setIsListening(false);
    }
  };

  // Stock status resolver for every remedy / patent formulation
  const getInventoryStatus = (name: string, aliases: string[] = []) => {
    if (!inventoryItems || inventoryItems.length === 0) {
      return { found: false, inStock: false, stock: 0, rack: '' };
    }

    const searchTokens = [name, ...aliases]
      .filter(Boolean)
      .map((s) => s.toLowerCase().trim().replace(/[^a-z0-9]/g, ' '));

    for (const item of inventoryItems) {
      const itemName = (item.name || '').toLowerCase().replace(/[^a-z0-9]/g, ' ');

      for (const term of searchTokens) {
        if (!term || term.length < 2) continue;

        // Direct containment
        if (itemName.includes(term) || term.includes(itemName)) {
          return {
            found: true,
            inStock: item.stock_qty > 0,
            stock: item.stock_qty,
            rack: item.rack_location || 'General Shelf',
            mrp: item.mrp || 0,
            catalogName: item.name,
          };
        }

        // Token match (e.g., "Berberis Vulgaris" -> ["berberis", "vulgaris"])
        const words = term.split(/\s+/).filter((w) => w.length >= 3);
        if (words.length > 1 && words.every((w) => itemName.includes(w))) {
          return {
            found: true,
            inStock: item.stock_qty > 0,
            stock: item.stock_qty,
            rack: item.rack_location || 'General Shelf',
            mrp: item.mrp || 0,
            catalogName: item.name,
          };
        }
      }
    }

    return { found: false, inStock: false, stock: 0, rack: '' };
  };

  // Brand Pill Badge Generator with Country & Styling
  const getBrandBadge = (brandName: string, company: string, country?: string) => {
    const b = (brandName || '').toLowerCase();
    const c = (company || '').toLowerCase();

    if (b.includes('bakson') || c.includes('bakson')) {
      return { label: "Bakson's 🇮🇳", color: 'bg-purple-100 text-purple-900 dark:bg-purple-950/80 dark:text-purple-200 border-purple-300 dark:border-purple-800' };
    }
    if (b.includes('reckeweg') || c.includes('reckeweg')) {
      return { label: 'Dr. Reckeweg 🇩🇪', color: 'bg-blue-100 text-blue-900 dark:bg-blue-950/80 dark:text-blue-200 border-blue-300 dark:border-blue-800' };
    }
    if (b.includes('sbl') || c.includes('sbl')) {
      return { label: 'SBL 🇮🇳', color: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800' };
    }
    if (b.includes('adel') || c.includes('adel')) {
      return { label: 'Adel Pekana 🇩🇪', color: 'bg-rose-100 text-rose-900 dark:bg-rose-950/80 dark:text-rose-200 border-rose-300 dark:border-rose-800' };
    }
    if (b.includes('wheezal') || c.includes('wheezal')) {
      return { label: 'Wheezal 🇮🇳', color: 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200 border-amber-300 dark:border-amber-800' };
    }
    if (b.includes('schwabe') || c.includes('schwabe')) {
      return { label: 'Dr. Willmar Schwabe 🇩🇪', color: 'bg-teal-100 text-teal-900 dark:bg-teal-950/80 dark:text-teal-200 border-teal-300 dark:border-teal-800' };
    }
    if (b.includes('medisynth') || c.includes('medisynth')) {
      return { label: 'Medisynth 🇮🇳', color: 'bg-cyan-100 text-cyan-900 dark:bg-cyan-950/80 dark:text-cyan-200 border-cyan-300 dark:border-cyan-800' };
    }
    if (b.includes('allen') || c.includes('allen')) {
      return { label: 'Allen 🇮🇳', color: 'bg-orange-100 text-orange-900 dark:bg-orange-950/80 dark:text-orange-200 border-orange-300 dark:border-orange-800' };
    }
    if (b.includes('new life') || c.includes('new life')) {
      return { label: 'New Life 🇮🇳', color: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800' };
    }
    if (b.includes('lord') || c.includes('lord')) {
      return { label: "Lord's 🇮🇳", color: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-950/80 dark:text-yellow-200 border-yellow-300 dark:border-yellow-800' };
    }
    return {
      label: country === 'Germany' ? `${brandName || 'German'} 🇩🇪` : `${brandName || 'Patent'} 🇮🇳`,
      color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    };
  };

  // Available Brands and Filtered Patents
  const availableBrands = useMemo(() => {
    if (!selectedCondition?.patentFormulations) return [];
    const map = new Map<string, number>();
    selectedCondition.patentFormulations.forEach((p) => {
      const badge = getBrandBadge(p.brand, p.company, p.country);
      map.set(badge.label, (map.get(badge.label) || 0) + 1);
    });
    return Array.from(map.entries()).map(([label, count]) => ({ label, count }));
  }, [selectedCondition]);

  const filteredPatents = useMemo(() => {
    if (!selectedCondition?.patentFormulations) return [];
    if (selectedBrandFilter === 'all') return selectedCondition.patentFormulations;
    return selectedCondition.patentFormulations.filter((p) => {
      const badge = getBrandBadge(p.brand, p.company, p.country);
      return badge.label === selectedBrandFilter;
    });
  }, [selectedCondition, selectedBrandFilter]);

  // Analyze symptoms through the Dual-Tier Clinical Repertory Engine (Instant Local)
  const handleAnalyze = (overrideQuery?: string) => {
    const query = (overrideQuery !== undefined ? overrideQuery : symptoms).trim();
    if (!query) {
      setErrorMsg('Please enter symptoms in English or Bengali, or speak using the voice microphone.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      const match = findRepertoryMatch(query);
      setSelectedCondition(match);
      setConsultSource('repertory');
      setSelectedBrandFilter('all');
    } catch (err) {
      console.error('Repertory analysis error:', err);
      setErrorMsg('Failed to process symptoms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Analyze symptoms through Deep Gemini AI Engine (Multi-Brand Global & Indian Patent Synthesis)
  const handleGeminiConsult = async (overrideQuery?: string) => {
    const query = (overrideQuery !== undefined ? overrideQuery : symptoms).trim();
    if (!query) {
      setErrorMsg('Please enter symptoms in English or Bengali, or speak using the voice microphone.');
      return;
    }

    // 1. Direct REST fetch priority (passes API key via URL query param, strictly NO Authorization header)
    const apiKey = (
      (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) ||
      (typeof process !== 'undefined' && process.env && process.env.VITE_GEMINI_API_KEY) ||
      (typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY) ||
      ''
    ).trim();

    setErrorMsg('');
    setIsAiLoading(true);

    let data: any = null;
    let usedClientFallback = false;

    // Step 1: Direct Client REST call first (strictly avoids OAuth 401 error on Vercel)
    if (apiKey) {
      try {
        usedClientFallback = true;
        data = await callGeminiDirectlyFromClient(query);
      } catch (clientErr: any) {
        console.warn('Direct client REST call failed, attempting server route /api/consult:', clientErr);
      }
    }

    // Step 2: Attempt server route /api/consult if client direct call was not used or failed
    if (!data) {
      try {
        const response = await fetch('/api/consult', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symptoms: query, apiKey }),
        });

        if (response.ok) {
          data = await response.json();
        }
      } catch (serverErr: any) {
        console.warn('Serverless /api/consult unavailable or returned error:', serverErr);
      }
    }

    // Step 3: If remote AI is offline or model busy, smoothly fall back to internal verified clinical repertory engine
    if (!data || !data.remedies || data.remedies.length === 0) {
      handleAnalyze(query);
      setErrorMsg('');
      setIsAiLoading(false);
      return;
    }

    try {
      if (data && data.remedies && data.patent_formulations) {
        const aiCondition: ClinicalCondition = {
          id: 'gemini-ai-consult',
          nameEn: `AI Consultation: ${query.length > 50 ? query.slice(0, 50) + '...' : query}`,
          nameBn: 'এআই প্রেসক্রিপশন ও মাল্টি-ব্র্যান্ড পেটেন্ট ফরমুলেশন',
          chipLabel: usedClientFallback ? 'Gemini AI (Direct Client REST)' : 'Gemini Deep AI Consult',
          pathology: data.analysis_summary || 'Constitutional & Pathological Evaluation',
          miasm: 'Miasmatic Synthesis (Kent/Boericke & Commercial Patents)',
          keywords: [query],
          typicalPresentation: query,
          classicalRemedies: (data.remedies || []).map((r: any) => ({
            name: r.remedy_name,
            commonName: r.common_name || '',
            potency: r.potency || '30C / 200C',
            dosage: r.dosage || '4 pills twice daily',
            keynotes: r.key_indications || [],
            materiaMedicaNotes: r.materia_medica_notes || '',
            modalities: r.modalities || { worse: 'Motion/Cold', better: 'Rest/Warmth' },
            aliases: [r.remedy_name, r.common_name].filter(Boolean),
          })),
          patentFormulations: (data.patent_formulations || []).map((p: any) => {
            const b = (p.brand || '').toLowerCase();
            const isGerman = b.includes('reckeweg') || b.includes('adel') || (p.company || '').toLowerCase().includes('germany');
            return {
              name: p.name,
              brand: p.brand || 'Patent',
              company: p.company || 'Homeopathic Manufacturer',
              country: isGerman ? 'Germany' : 'India',
              bottleSize: p.bottle_size || p.bottleSize || '30 ml Drops',
              indications: p.indications || '',
              dosage: p.dosage || '10-15 drops in water 3 times daily.',
              mrp: p.mrp || 160,
              aliases: p.aliases || [p.name, p.brand].filter(Boolean),
            };
          }),
          dietAndRegimen: data.diet_and_regimen || 'Sip warm water. Avoid raw onion, garlic, menthol and strong coffee during homoeopathic treatment.',
          warningNotes: data.warning_notes || 'Clinical decision-support aid for Dr. M. A. Haque, M.D. (Homoeo).',
        };

        setSelectedCondition(aiCondition);
        setConsultSource('gemini');
        setSelectedBrandFilter('all');
      } else {
        throw new Error('Unexpected data format from Gemini consultation');
      }
    } catch (err: any) {
      console.warn('Gemini data processing error, seamlessly using verified local repertory:', err);
      handleAnalyze(query);
      setErrorMsg('');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Copy prescription details
  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Add remedy or patent to billing counter
  const handleAddToBill = (
    item: {
      name: string;
      potency?: string;
      bottleSize?: string;
      price?: number;
      rack?: string;
    },
    key: string
  ) => {
    const itemDesc = `${item.name}${item.potency ? ` (${item.potency})` : item.bottleSize ? ` [${item.bottleSize}]` : ''}${item.rack ? ` - ${item.rack}` : ''}`;
    const pendingItem = {
      item_description: itemDesc,
      price: item.price || '',
    };

    try {
      sessionStorage.setItem('hhc_pending_billing_item', JSON.stringify(pendingItem));
    } catch (e) {
      console.warn('Could not write to sessionStorage:', e);
    }

    setAddedBillKey(key);
    setTimeout(() => setAddedBillKey(null), 2200);

    if (onAddRemedyToBilling) {
      onAddRemedyToBilling({
        remedy_name: item.name,
        potency: item.potency || item.bottleSize || '',
        dosage: '',
        key_indications: [],
      });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-800/95 border border-emerald-900/10 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] flex items-center justify-center text-white shadow-md shrink-0">
            <ClinicLogo size={28} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Clinical Repertory & Prescription Engine
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <Sparkles className="w-3 h-3" />
                Dual-Tier Kent + Patents
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Classical Kent & Boericke Simillimum Repertory + Renowned German & Indian Patent Formulations
            </p>
          </div>
        </div>

        {/* Live Inventory Status Pill */}
        <div className="flex items-center gap-2 self-end md:self-auto text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center gap-2 font-medium">
            <PackageSearch className="w-4 h-4 text-emerald-600" />
            <span id="inventory-sync-badge">
              {`Chamber Stock: ${inventoryItems?.length || 0} Items`}
            </span>
          </div>
        </div>
      </div>

      {/* Main Unified Input Section with Dual-Language Voice Engine */}
      <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-800/95 border border-emerald-900/10 dark:border-slate-700 shadow-sm space-y-4">
        {/* Input Bar Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-1 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            <Stethoscope className="w-4 h-4 text-emerald-600" />
            <span>Clinical Presentation & Symptom Totality</span>
          </div>

          {/* Language Switcher & Voice Dictation Controls */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="inline-flex items-center rounded-xl bg-slate-100 dark:bg-slate-900 p-0.5 border border-slate-200 dark:border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setSpeechLang('en')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  speechLang === 'en'
                    ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                English (India)
              </button>
              <button
                type="button"
                onClick={() => setSpeechLang('bn')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  speechLang === 'bn'
                    ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                বাংলা (Bengali)
              </button>
            </div>

            {/* Microphone Button with Active Listening State */}
            {speechSupported ? (
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse shadow-md'
                    : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-200 dark:border-emerald-800'
                }`}
                title={isListening ? 'Click to stop voice dictation' : `Dictate symptoms in ${speechLang === 'bn' ? 'Bengali' : 'English'}`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-3.5 h-3.5 text-white" />
                    <span>Listening ({speechLang === 'bn' ? 'বাংলা' : 'EN'})...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Voice Input ({speechLang === 'bn' ? 'বাংলা' : 'EN'})</span>
                  </>
                )}
              </button>
            ) : null}

            {symptoms && (
              <button
                type="button"
                onClick={() => {
                  setSymptoms('');
                  setSelectedCondition(null);
                }}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Unified Spacious Textarea */}
        <div className="relative">
          <textarea
            value={symptoms}
            onChange={(e) => {
              setSymptoms(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAnalyze(symptoms);
              }
            }}
            placeholder="Describe symptoms in English or Bengali (e.g. fibroid uterus menorrhagia, ক্ষুধামন্দা খিদে নেই, পায়ে তীব্র বাতের ব্যথা, kidney stone severe right side pain, knee arthritis stiffness, toothache with swollen gums)..."
            rows={4}
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition resize-none leading-relaxed"
          />

          {isListening && (
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 text-xs font-bold flex items-center gap-1.5 border border-red-200 dark:border-red-800">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>Speaking in {speechLang === 'bn' ? 'বাংলা' : 'English'}... Click microphone to finish</span>
            </div>
          )}
        </div>

        {/* Error Message if any */}
        {errorMsg && (
          <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Quick Clinical Condition Preset Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            Quick Repertory:
          </span>
          {[
            { label: 'Vomiting / বমি', query: 'vomiting nausea বমি retching' },
            { label: 'Fever / জ্বর', query: 'fever pyrexia chills' },
            { label: 'Dysentery / আমাশয়', query: 'dysentery mucus stool colic' },
            { label: 'Sciatica / সায়াটিকা', query: 'sciatica lower back to leg shooting pain' },
            { label: 'Neuro Problem / নার্ভের সমস্যা', query: 'neuro neuropathy numbness tingling' },
            { label: 'Body Pain / শরীর ব্যথা', query: 'body pain myalgia muscular ache' },
            { label: 'Arthritis & Knee / বাত', query: 'arthritis knee pain joint morning stiffness' },
            { label: 'Fibroid / ফাইব্রয়েড', query: 'uterine fibroid tumor menorrhagia' },
            { label: 'Kidney Stone / পাথর', query: 'kidney stone renal calculus right flank' },
            { label: 'Acidity / এসিডিটি', query: 'acidity gas heartburn sour eructation' },
          ].map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSymptoms(chip.query);
                handleAnalyze(chip.query);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 dark:bg-slate-700/60 dark:hover:bg-emerald-950/60 text-slate-700 hover:text-emerald-800 dark:text-slate-300 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-emerald-700 font-medium transition cursor-pointer"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Action Buttons: Instant Repertory & Gemini Deep AI Consult */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-mono text-[10px]">Enter</kbd> to repertorize, <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-mono text-[10px]">Shift</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-mono text-[10px]">Enter</kbd> for new line
          </span>

          <div className="flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleAnalyze(symptoms)}
              disabled={loading || isAiLoading}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer disabled:opacity-50"
            >
              <BookOpen className="w-4 h-4 text-emerald-300" />
              <span>{loading ? 'Repertorizing...' : 'Instant Repertorize'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleGeminiConsult()}
              disabled={loading || isAiLoading}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:opacity-90 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer disabled:opacity-50"
              title="Query Gemini AI for custom constitutional synthesis & multi-brand patent formulations"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isAiLoading ? 'Gemini AI Analyzing...' : 'Gemini Deep AI Consult'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Container: Dual-Tier Output */}
      {selectedCondition && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Clinical Overview Summary Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-950 via-[#1B4332] to-[#081C15] text-white shadow-md border border-emerald-800/40">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
                  <Stethoscope className="w-4 h-4" />
                  <span>Clinical Pathology & Miasmatic Evaluation</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  {selectedCondition.nameEn}
                </h2>
                <p className="text-sm text-emerald-200/90 font-medium mt-0.5">
                  {selectedCondition.nameBn}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-emerald-100">
                  <span className="opacity-75 block text-[10px] uppercase">Pathology:</span>
                  <span className="font-bold">{selectedCondition.pathology}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-emerald-100">
                  <span className="opacity-75 block text-[10px] uppercase">Miasm:</span>
                  <span className="font-bold">{selectedCondition.miasm}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION A: CLASSICAL SIMILLIMUM REMEDIES (Kent & Boericke)  */}
          {/* ============================================================ */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-800 dark:text-emerald-300 font-black text-sm">
                  A
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                    SECTION A: CLASSICAL SIMILLIMUM REMEDIES
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Materia Medica & Repertory Keynotes (Kent & Boericke Classical Prescriptions)
                  </p>
                </div>
              </div>

              <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto">
                {selectedCondition.classicalRemedies.length} Classical Simillimum Matches
              </span>
            </div>

            {/* Classical Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedCondition.classicalRemedies.map((remedy, idx) => {
                const stock = getInventoryStatus(remedy.name, remedy.aliases);
                const cardKey = `classical-${idx}`;
                const isCopied = copiedKey === cardKey;
                const isAdded = addedBillKey === cardKey;

                return (
                  <div
                    key={cardKey}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4"
                  >
                    {/* Top Row: Remedy Name, Common Name & Badges */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <h4 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                              {remedy.name}
                            </h4>
                          </div>
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-7">
                            Common Name: <strong>{remedy.commonName}</strong>
                          </span>
                        </div>

                        {/* Potency Pill */}
                        <span className="px-2.5 py-1 rounded-xl bg-[#1B4332] text-emerald-200 text-xs font-extrabold shrink-0">
                          {remedy.potency}
                        </span>
                      </div>

                      {/* Live Inventory Lookup & Rack Location Badge */}
                      <div className="pt-1">
                        {stock.found ? (
                          stock.inStock ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              <span>
                                ✔ In Stock: {stock.stock} units • Rack: {stock.rack}
                              </span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                              <span>⚠ Out of Stock (Rack: {stock.rack})</span>
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-medium bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                            <PackageSearch className="w-3.5 h-3.5 text-slate-400" />
                            <span>Not in Clinic Catalog (Order Needed)</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Keynote Symptoms & Materia Medica */}
                    <div className="space-y-2 text-xs">
                      <div className="space-y-1">
                        <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] block">
                          Guiding Keynotes:
                        </span>
                        <ul className="space-y-1 text-slate-600 dark:text-slate-300 list-disc list-inside">
                          {remedy.keynotes.map((note, kIdx) => (
                            <li key={kIdx} className="leading-relaxed">
                              {note}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Modalities: Aggravation & Amelioration */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <div className="p-2.5 rounded-xl bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50">
                          <span className="font-bold text-red-800 dark:text-red-300 block mb-0.5 text-[10px] uppercase tracking-wide">
                            ⚠️ Aggravation (Worse):
                          </span>
                          <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-snug">
                            {remedy.modalities.worse}
                          </p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
                          <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5 text-[10px] uppercase tracking-wide">
                            🌿 Amelioration (Better):
                          </span>
                          <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-snug">
                            {remedy.modalities.better}
                          </p>
                        </div>
                      </div>

                      {/* Dosage Guidance */}
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                          Prescribed Dosage:
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                          {remedy.dosage}
                        </span>
                      </div>
                    </div>

                    {/* Card Actions: Add to Bill + Copy */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyText(
                            `${remedy.name} (${remedy.potency})\nDosage: ${remedy.dosage}\nKeynotes: ${remedy.keynotes.join('; ')}`,
                            cardKey
                          )
                        }
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleAddToBill(
                            {
                              name: remedy.name,
                              potency: remedy.potency,
                              price: stock.mrp || 0,
                              rack: stock.rack,
                            },
                            cardKey
                          )
                        }
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                      >
                        {isAdded ? <Check className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />}
                        <span>{isAdded ? 'Added to Bill!' : '+ Add to Bill'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION B: PATENTED CLINICAL COMBINATIONS                     */}
          {/* ============================================================ */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-800 dark:text-amber-300 font-black text-sm">
                  B
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                      SECTION B: PATENTED CLINICAL COMBINATIONS
                    </h3>
                    <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                      Multi-Brand Engine
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Bakson's, Dr. Reckeweg Germany, SBL India, Adel Pekana, Wheezal, Schwabe, Medisynth, Allen & Lord's
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800">
                  {selectedCondition.patentFormulations.length} Formulations Available
                </span>
              </div>
            </div>

            {/* Brand Filter Chips Row */}
            {availableBrands.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                  Filter Brand:
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedBrandFilter('all')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 border ${
                    selectedBrandFilter === 'all'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-stone-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                  }`}
                >
                  All Brands ({selectedCondition.patentFormulations.length})
                </button>

                {availableBrands.map(({ label, count }) => {
                  const isSelected = selectedBrandFilter === label;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setSelectedBrandFilter(label)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 border ${
                        isSelected
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-stone-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                      }`}
                    >
                      {label} ({count})
                    </button>
                  );
                })}
              </div>
            )}

            {/* Patent Formulations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPatents.map((patent, pIdx) => {
                const stock = getInventoryStatus(patent.name, patent.aliases);
                const brandBadge = getBrandBadge(patent.brand, patent.company, patent.country);
                const cardKey = `patent-${pIdx}-${patent.name}`;
                const isCopied = copiedKey === cardKey;
                const isAdded = addedBillKey === cardKey;

                return (
                  <div
                    key={cardKey}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-3.5"
                  >
                    {/* Top Row: Name, Brand Pill & Bottle Size */}
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <h4 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                            {patent.name}
                          </h4>
                          {/* Distinctive Brand Badge with Country Flag */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${brandBadge.color}`}
                            >
                              {brandBadge.label}
                            </span>
                            {patent.country && (
                              <span className="text-[10px] font-bold text-slate-400">
                                • {patent.country}
                              </span>
                            )}
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-extrabold shrink-0 border border-slate-200 dark:border-slate-600">
                          {patent.bottleSize}
                        </span>
                      </div>

                      {/* Manufacturer and Approx MRP */}
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700 pb-2">
                        <span className="truncate pr-2 font-medium">{patent.company}</span>
                        <span className="font-extrabold text-slate-800 dark:text-slate-200 shrink-0">
                          MRP: ₹{patent.mrp}
                        </span>
                      </div>

                      {/* Live Inventory Lookup & Rack Location Badge */}
                      <div className="pt-0.5">
                        {stock.found ? (
                          stock.inStock ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              <span>
                                ✔ In Stock: {stock.stock} • Rack: {stock.rack}
                              </span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                              <span>⚠ Out of Stock (Rack: {stock.rack})</span>
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-medium bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                            <PackageSearch className="w-3.5 h-3.5 text-slate-400" />
                            <span>Not in Catalog (Order Needed)</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Indications & Dosage */}
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Clinical Indications:
                        </span>
                        <p className="text-slate-700 dark:text-slate-300 leading-snug">
                          {patent.indications}
                        </p>
                      </div>

                      <div className="p-2 rounded-xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-slate-700">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Recommended Dosage:
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                          {patent.dosage}
                        </span>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyText(
                            `${patent.name} - ${patent.brand} (${patent.company})\nBottle: ${patent.bottleSize} | MRP: ₹${patent.mrp}\nDosage: ${patent.dosage}`,
                            cardKey
                          )
                        }
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleAddToBill(
                            {
                              name: patent.name,
                              bottleSize: patent.bottleSize,
                              price: stock.mrp || patent.mrp,
                              rack: stock.rack,
                            },
                            cardKey
                          )
                        }
                        className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                      >
                        {isAdded ? <Check className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />}
                        <span>{isAdded ? 'Added!' : '+ Add to Bill'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Diet & Hahnemannian Regimen */}
          {selectedCondition.dietAndRegimen && (
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-emerald-900/10 dark:border-slate-700 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                <Apple className="w-4 h-4 text-emerald-600" />
                <span>Homoeopathic Regimen & Dietary Guidance</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedCondition.dietAndRegimen}
              </p>
            </div>
          )}

          {/* Mandatory Clinical Disclaimer */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center gap-3 text-xs text-amber-900 dark:text-amber-200">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="leading-snug">
              <strong>Prescription Disclaimer: </strong>
              <span>
                {selectedCondition.warningNotes} Final prescription and potency selection must be verified by Dr. M. A. Haque, M.D. (Homoeo).
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Clean, Neutral Initial State when no condition is selected */}
      {!selectedCondition && !loading && !isAiLoading && (
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-800 dark:text-emerald-300">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
            Awaiting Patient Symptoms
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Enter symptoms or rubrics above in English or Bengali (or click the microphone to dictate), then press <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px]">Enter</kbd> or click <strong>Instant Repertorize</strong>.
          </p>
        </div>
      )}
    </div>
  );
};
