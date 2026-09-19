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
  Layers
} from 'lucide-react';
import { ClinicLogo } from './ClinicLogo';
import { getSupabase } from '../services/supabase';
import { getInventory } from '../services/clinicStore';
import { useRealtimeInventory } from '../services/inventoryMatcher';
import { 
  findRepertoryMatch, 
  ClinicalCondition, 
  ClassicalRemedy, 
  PatentFormulation 
} from '../data/clinicalRepertoryData';
import { synthesizeMateriaMedicaOffline } from '../services/materiaMedicaEngine';
import { 
  callGroqAPI, 
  getGroqApiKey, 
  setGroqApiKey, 
  hasGroqApiKey, 
  buildGroqConsultQuery,
  parseGroqResponse
} from '../services/groqClient';

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
  const [consultSource, setConsultSource] = useState<'repertory' | 'groq'>('repertory');
  const [errorMsg, setErrorMsg] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [searchedQuery, setSearchedQuery] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);

  // Groq LPU API Key State (silent reader from Settings/localStorage)
  const [activeGroqKey, setActiveGroqKey] = useState<string>('');

  // Initialize and load Groq API key on mount and listen to storage updates
  useEffect(() => {
    const syncKey = () => {
      setActiveGroqKey(getGroqApiKey());
    };
    syncKey();
    window.addEventListener('storage', syncKey);
    return () => window.removeEventListener('storage', syncKey);
  }, []);

  const showToast = (message: string, type: 'error' | 'success' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 6000);
  };

  // Voice Engine State
  const [speechLang, setSpeechLang] = useState<'en' | 'bn'>('en');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  // Real-time Normalized Inventory Matcher Hook (Supabase medicines table + Clinic Store)
  const { inventoryList, loading: inventoryLoading, checkStock } = useRealtimeInventory();
  const [showInStockFirst, setShowInStockFirst] = useState(true);

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

  // Stock status resolver for every remedy / patent formulation with normalized fuzzy matching
  const getInventoryStatus = (name: string, aliases: string[] = [], potency?: string) => {
    const res = checkStock(name, potency, aliases);
    return {
      found: res.found,
      inStock: res.inStock,
      stock: res.current_stock,
      current_stock: res.current_stock,
      rack: res.rack_location || 'General Shelf',
      rack_location: res.rack_location || 'General Shelf',
      mrp: res.mrp || 0,
      potencyMatched: res.potencyMatched,
      matchedName: res.matchedName || name
    };
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

  // Displayed Classical Remedies sorted by in-stock status when showInStockFirst is active
  const displayedClassicalRemedies = useMemo(() => {
    if (!selectedCondition?.classicalRemedies) return [];
    if (!showInStockFirst) return selectedCondition.classicalRemedies;

    return [...selectedCondition.classicalRemedies].sort((a, b) => {
      const stockA = getInventoryStatus(a.name, a.aliases, a.potency);
      const stockB = getInventoryStatus(b.name, b.aliases, b.potency);
      if (stockA.inStock && !stockB.inStock) return -1;
      if (!stockA.inStock && stockB.inStock) return 1;
      return 0;
    });
  }, [selectedCondition?.classicalRemedies, showInStockFirst, inventoryList]);

  // Displayed Patents sorted by in-stock status when showInStockFirst is active
  const displayedPatents = useMemo(() => {
    if (!filteredPatents) return [];
    if (!showInStockFirst) return filteredPatents;
    return [...filteredPatents].sort((a, b) => {
      const stockA = getInventoryStatus(a.name, a.aliases);
      const stockB = getInventoryStatus(b.name, b.aliases);
      if (stockA.inStock && !stockB.inStock) return -1;
      if (!stockA.inStock && stockB.inStock) return 1;
      return 0;
    });
  }, [filteredPatents, showInStockFirst, inventoryList]);

  // Analyze symptoms through the Dual-Tier Clinical Repertory Engine (Instant Local)
  const handleAnalyze = (overrideQuery?: string) => {
    const query = (overrideQuery !== undefined ? overrideQuery : symptoms).trim();
    if (!query) {
      setErrorMsg('Please enter symptoms in English or Bengali, or speak using the voice microphone.');
      return;
    }

    setErrorMsg('');
    setLoading(true);
    setHasSearched(true);
    setSearchedQuery(query);

    try {
      let match = findRepertoryMatch(query);
      if (!match) {
        match = synthesizeMateriaMedicaOffline(query);
      }
      setSelectedCondition(match);
      setConsultSource('repertory');
      setSelectedBrandFilter('all');
      setErrorMsg('');
      if (match) {
        showToast('Clinical repertory condition matched.', 'success');
      }
    } catch (err) {
      console.error('Repertory analysis error, activating offline engine:', err);
      const fallback = synthesizeMateriaMedicaOffline(query);
      setSelectedCondition(fallback);
      setConsultSource('repertory');
      setSelectedBrandFilter('all');
      setErrorMsg('');
    } finally {
      setLoading(false);
    }
  };

  // Analyze symptoms through Groq Cloud LPU Inference Engine (GPT-OSS / Llama)
  const handleGroqConsult = async (overrideQuery?: string) => {
    const query = (overrideQuery !== undefined ? overrideQuery : symptoms).trim();
    if (!query) {
      const msg = 'Please enter symptoms in English or Bengali, or speak using the voice microphone.';
      setErrorMsg(msg);
      showToast(msg, 'error');
      return;
    }

    const groqApiKey = getGroqApiKey();
    if (!groqApiKey) {
      const alertMsg = 'Please configure your Groq API Key in Settings to enable AI Clinical Consultations.';
      setErrorMsg(alertMsg);
      showToast(alertMsg, 'error');
      return;
    }

    setErrorMsg('');
    setIsAiLoading(true);
    setHasSearched(true);
    setSearchedQuery(query);

    try {
      const groqUserQuery = buildGroqConsultQuery(query);
      const data = await callGroqAPI(groqUserQuery, { apiKey: groqApiKey });

      if (!data) {
        throw new Error('Groq AI response did not contain clinical remedies.');
      }

      // 1. ROBUST JSON PARSER: Clean and parse Groq's response safely (handling Markdown code blocks, truncation, or wrapping text)
      let parsedData: any = data;
      if (typeof data.raw_text === 'string' && (!data.remedies?.length || typeof data.analysis_summary !== 'string')) {
        const directParsed = parseGroqResponse(data.raw_text);
        if (directParsed && typeof directParsed === 'object') {
          parsedData = directParsed;
        }
      }

      // Ensure pathology is clean human text, NEVER raw JSON like {"analysis_summary": ...}
      let pathologyText = parsedData?.analysis_summary || data.analysis_summary || `Constitutional & Pathological Synthesis for: ${query}`;
      if (typeof pathologyText === 'string' && (pathologyText.trim().startsWith('{') || pathologyText.includes('"analysis_summary"'))) {
        const inner = parseGroqResponse(pathologyText);
        if (inner?.analysis_summary && typeof inner.analysis_summary === 'string' && !inner.analysis_summary.startsWith('{')) {
          pathologyText = inner.analysis_summary;
        } else {
          pathologyText = `Constitutional & Pathological Synthesis for: ${query}`;
        }
      }

      // Map classical remedies conforming to system prompt schema:
      // { name, potency, commonName, guidingKeynotes, aggravation, amelioration, dosage }
      const rawRemedies = Array.isArray(parsedData?.remedies)
        ? parsedData.remedies
        : Array.isArray(data.remedies)
        ? data.remedies
        : [];

      const classicalRemedies = rawRemedies.map((r: any) => {
        const rawKeynotes = r.guidingKeynotes || r.key_indications || r.keynotes || '';
        const keynotesList: string[] = Array.isArray(rawKeynotes)
          ? rawKeynotes.map((k: any) => String(k).trim().replace(/^[-*•]\s*/, '')).filter(Boolean)
          : typeof rawKeynotes === 'string' && rawKeynotes.trim()
          ? rawKeynotes.split('\n').map((s: string) => s.trim().replace(/^[-*•]\s*/, '')).filter(Boolean)
          : [String(rawKeynotes || 'Guiding clinical keynote symptom')];

        const worse = r.aggravation || r.modalities?.worse || 'Weather changes, motion, or cold';
        const better = r.amelioration || r.modalities?.better || 'Warmth, rest, or fresh air';
        const remedyName = r.name || r.remedy_name || 'Homeopathic Simillimum';
        const commonName = r.commonName || r.common_name || '';

        return {
          name: remedyName,
          commonName,
          potency: r.potency || '30C',
          dosage: r.dosage || '4 pills 3 times daily',
          keynotes: keynotesList.length > 0 ? keynotesList : ['Classical keynote symptom'],
          materiaMedicaNotes: typeof r.guidingKeynotes === 'string' ? r.guidingKeynotes : keynotesList.join('. '),
          modalities: { worse, better },
          aliases: [remedyName, commonName].filter(Boolean),
        };
      });

      // Map patents conforming to system prompt schema:
      // { brand, name, indications, dosage }
      const rawPatents = Array.isArray(parsedData?.patents)
        ? parsedData.patents
        : Array.isArray(parsedData?.patent_formulations)
        ? parsedData.patent_formulations
        : Array.isArray(data.patents)
        ? data.patents
        : Array.isArray(data.patent_formulations)
        ? data.patent_formulations
        : [];

      const patentFormulations = rawPatents.map((p: any) => {
        const b = (p.brand || '').toLowerCase();
        const isGerman = b.includes('reckeweg') || b.includes('adel') || (p.company || '').toLowerCase().includes('germany');
        return {
          name: p.name || 'Patent Formulation',
          brand: p.brand || 'Dr. Reckeweg',
          company: p.company || (p.brand ? `${p.brand} Homoeopathic Laboratories` : 'Homoeopathic Laboratories'),
          country: isGerman ? 'Germany' : 'India',
          bottleSize: p.bottleSize || p.bottle_size || '22-30 ml Drops',
          indications: p.indications || '',
          dosage: p.dosage || '10-15 drops in water 3 times daily',
          mrp: Number(p.mrp) || 220,
          aliases: Array.isArray(p.aliases) ? p.aliases : [p.name, p.brand].filter(Boolean),
        };
      });

      if (classicalRemedies.length === 0 && patentFormulations.length === 0) {
        throw new Error('Groq AI response did not contain clinical remedies.');
      }

      const aiCondition: ClinicalCondition = {
        id: `groq-consult-${Date.now()}`,
        nameEn: `AI Repertorization: ${query.length > 50 ? query.slice(0, 50) + '...' : query}`,
        nameBn: 'এআই প্রেসক্রিপশন ও মাল্টি-ব্র্যান্ড পেটেন্ট ফরমুলেশন',
        chipLabel: 'Powered by Groq LPU (GPT-OSS / Llama Engine)',
        pathology: pathologyText,
        miasm: parsedData?.miasm || data.miasm || 'Psora / Sycosis / Syphilis / Tubercular',
        keywords: [query],
        typicalPresentation: query,
        classicalRemedies,
        patentFormulations,
        dietAndRegimen: parsedData?.diet_and_regimen || data.diet_and_regimen || 'Sip warm water. Avoid raw onion, garlic, menthol, camphor and strong coffee during homoeopathic treatment.',
        warningNotes: parsedData?.warning_notes || data.warning_notes || 'Clinical decision-support aid for Dr. M. A. Haque, M.D. (Homoeo). Final clinical decisions rest with the attending homeopathic physician.',
      };

      setSelectedCondition(aiCondition);
      setConsultSource('groq');
      setSelectedBrandFilter('all');
      setErrorMsg('');
      showToast('Groq AI consultation completed successfully.', 'success');
    } catch (err: any) {
      console.warn('Groq API encounter, activating Boericke/Kent Emergency Repertory Engine:', err);
      const friendlyError = err?.message || 'Unable to connect to AI engine.';
      setErrorMsg(friendlyError);
      // Fail-safe: Try verified offline repertory match first, then organ-sensation synthesis
      let offlineCondition = findRepertoryMatch(query);
      if (!offlineCondition) {
        offlineCondition = synthesizeMateriaMedicaOffline(query);
      }
      setSelectedCondition(offlineCondition);
      setConsultSource('repertory');
      setSelectedBrandFilter('all');
      if (offlineCondition) {
        showToast('Materia Medica Offline Engine Active: Boericke & Kent protocol synthesized.', 'info');
      }
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

        {/* Header Controls: Clean AI Engine Badge and Dynamic Chamber Stock Pill */}
        <div className="flex flex-wrap items-center gap-2.5 self-end md:self-auto text-xs">
          <span
            id="badge-search-with-ai"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-xs"
            title="AI Search Engine is active & ready"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Search with AI</span>
          </span>

          {/* Dynamic Chamber Stock Pill */}
          <div
            id="inventory-sync-pill"
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 font-medium transition-colors ${
              (inventoryList?.length || 0) === 0
                ? 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                : 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
            }`}
            title={`Live Chamber Inventory: ${inventoryList?.length || 0} active stock items`}
          >
            <PackageSearch className={`w-4 h-4 ${(inventoryList?.length || 0) === 0 ? 'text-slate-400' : 'text-emerald-600'}`} />
            <span id="inventory-sync-badge">
              {`Chamber Stock: ${inventoryList?.length || 0} Items`}
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
            { label: 'Hydrocele / হাইড্রোসিল', query: 'হাইড্রোসিল অণ্ডকোষ বৃদ্ধি hydrocele scrotum' },
            { label: 'Piles / অর্শ', query: 'অর্শ পাইলস bleeding piles haemorrhoids' },
            { label: 'Fissure / এনাল ফিসার', query: 'এনাল ফিসার মলদ্বারে তীব্র জ্বালা কাটা ব্যথা anal fissure' },
            { label: 'Hair Fall / চুল পড়া', query: 'চুল পড়া alopecia hair loss dandruff' },
            { label: 'Tonsillitis / টনসিল', query: 'টনসিল টনসিলাইটিস গলা ব্যথা tonsillitis sore throat' },
            { label: 'Asthma / হাঁপানি', query: 'হাঁপানি শ্বাসকষ্ট bronchial asthma wheezing' },
            { label: 'Ringworm / দাদ', query: 'দাদ ringworm tinea fungal rash' },
            { label: 'Corns & Warts / কড়া ও আঁচিল', query: 'পায়ের কড়া আঁচিল corns warts verruca' },
            { label: 'Fish Bone / গলায় কাঁটা', query: 'গলায় কাঁটা মাছের কাঁটা fish bone in throat' },
            { label: 'Kidney Stone / পাথর', query: 'kidney stone renal calculus right flank' },
            { label: 'Sciatica / সায়াটিকা', query: 'sciatica lower back to leg shooting pain' },
            { label: 'Arthritis / বাত', query: 'arthritis knee pain joint morning stiffness' },
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

        {/* Action Buttons: Instant Repertory & Groq AI Consult */}
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
              id="btn-groq-consult"
              type="button"
              onClick={() => handleGroqConsult()}
              disabled={loading || isAiLoading}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-700 to-[#1B4332] hover:opacity-95 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer disabled:opacity-50"
              title="Query Groq LPU (GPT-OSS / Llama Engine) for expert repertorization, differential remedy analysis, and patent formulations"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>{isAiLoading ? 'Groq LPU Analyzing...' : 'Groq AI Consult'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Informative Guidance Banner when No Exact Simillimum is Found */}
      {hasSearched && !selectedCondition && !loading && !isAiLoading && (
        <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 shadow-sm space-y-4 animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 shrink-0">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-amber-900 dark:text-amber-200">
                No Specific Clinical Repertory Simillimum Found for &ldquo;{searchedQuery}&rdquo;
              </h3>
              <p className="text-xs sm:text-sm text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
                অনুগ্রহ করে রোগীর সুনির্দিষ্ট অঙ্গ (Anatomical Location) অথবা লক্ষণ (Clinical Sensation/Modality) উল্লেখ করুন।
                হোমিওপ্যাথিক মূলনীতি অনুযায়ী অনুমানমূলক বা জেনেরিক ওষুধ প্রেসক্রাইব করা কঠোরভাবে অনুচিত।
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-amber-200/70 dark:border-amber-800/40 text-xs space-y-3">
            <p className="font-semibold text-slate-700 dark:text-slate-200">
              Try searching with clinical organ keywords or common pathology rubrics:
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Hydrocele / অণ্ডকোষ বৃদ্ধি', query: 'হাইড্রোসিল অণ্ডকোষ বৃদ্ধি' },
                { label: 'Piles / অর্শ', query: 'অর্শ পাইলস রক্তক্ষরণ' },
                { label: 'Anal Fissure / এনাল ফিসার', query: 'এনাল ফিসার মলদ্বারে তীব্র জ্বালা' },
                { label: 'Hair Fall / চুল পড়া', query: 'চুল পড়া alopecia' },
                { label: 'Tonsillitis / টনসিল', query: 'টনসিল গলা ব্যথা tonsillitis' },
                { label: 'Asthma / হাঁপানি', query: 'হাঁপানি শ্বাসকষ্ট asthma' },
                { label: 'Ringworm / দাদ', query: 'দাদ ringworm tinea' },
                { label: 'Corns & Warts / কড়া ও আঁচিল', query: 'পায়ের কড়া আঁচিল corn wart' },
                { label: 'Throat & Foreign Body / গলায় কাঁটা', query: 'গলায় কাঁটা fish bone in throat' },
                { label: 'Kidney Stone / কিডনির পাথর', query: 'kidney stone renal calculi' },
                { label: 'Sciatica / সায়াটিকা', query: 'সায়াটিকা sciatica pain' },
                { label: 'Arthritis / বাত ব্যথা', query: 'বাত ব্যথা arthritis knee pain' },
              ].map((rec, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setSymptoms(rec.query);
                    handleAnalyze(rec.query);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-100/70 hover:bg-amber-200 dark:bg-slate-700 dark:hover:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300/60 dark:border-slate-600 text-xs font-medium transition cursor-pointer"
                >
                  {rec.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results Container: Dual-Tier Output */}
      {selectedCondition && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Clinical Overview Summary Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-950 via-[#1B4332] to-[#081C15] text-white shadow-md border border-emerald-800/40">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
                  <div className="flex items-center gap-1.5">
                    <Stethoscope className="w-4 h-4 text-emerald-400" />
                    <span>Clinical Pathology & Miasmatic Evaluation</span>
                  </div>
                  {selectedCondition.chipLabel && (
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-normal ${
                      selectedCondition.chipLabel.includes('Offline')
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-xs'
                        : 'bg-emerald-400/20 text-emerald-200 border border-emerald-400/30'
                    }`}>
                      {selectedCondition.chipLabel.includes('Offline') ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                      )}
                      <span>{selectedCondition.chipLabel}</span>
                    </span>
                  )}
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

              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                {/* Show In-Stock First Quick Filter Toggle */}
                <button
                  type="button"
                  onClick={() => setShowInStockFirst(!showInStockFirst)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
                    showInStockFirst
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                  }`}
                  title="Toggle placing remedies currently available in clinic stock at the top"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Show In-Stock First {showInStockFirst ? '✓' : ''}</span>
                </button>

                <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                  {displayedClassicalRemedies.length} Classical Simillimum Matches
                </span>
              </div>
            </div>

            {/* Classical Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedClassicalRemedies.map((remedy, idx) => {
                const stock = getInventoryStatus(remedy.name, remedy.aliases, remedy.potency);
                const cardKey = `classical-${idx}`;
                const isCopied = copiedKey === cardKey;
                const isAdded = addedBillKey === cardKey;

                return (
                  <div
                    key={cardKey}
                    className={`p-5 rounded-3xl transition-all flex flex-col justify-between space-y-4 shadow-xs ${
                      stock.inStock && stock.current_stock > 0
                        ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-2 border-emerald-500/40 hover:border-emerald-500'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-700'
                    }`}
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
                        {stock.inStock && stock.current_stock > 0 ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 shadow-xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>
                              ✓ Stock Available • {stock.current_stock} Units in Rack: {stock.rack_location}
                            </span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-extrabold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800 shadow-xs">
                            <span className="w-2 h-2 rounded-full bg-rose-500" />
                            <span>
                              ✕ Stock Unavailable / চেম্বার স্টকে নেই
                            </span>
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
              {displayedPatents.map((patent, pIdx) => {
                const stock = getInventoryStatus(patent.name, patent.aliases);
                const brandBadge = getBrandBadge(patent.brand, patent.company, patent.country);
                const cardKey = `patent-${pIdx}-${patent.name}`;
                const isCopied = copiedKey === cardKey;
                const isAdded = addedBillKey === cardKey;

                return (
                  <div
                    key={cardKey}
                    className={`p-5 rounded-3xl transition-all flex flex-col justify-between space-y-3.5 shadow-xs ${
                      stock.inStock && stock.current_stock > 0
                        ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-2 border-emerald-500/40 hover:border-emerald-500'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-700'
                    }`}
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
                        {stock.inStock && stock.current_stock > 0 ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 shadow-xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>
                              ✓ Stock Available • {stock.current_stock} Units in Rack: {stock.rack_location}
                            </span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-extrabold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800 shadow-xs">
                            <span className="w-2 h-2 rounded-full bg-rose-500" />
                            <span>
                              ✕ Stock Unavailable / চেম্বার স্টকে নেই
                            </span>
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
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-800 dark:text-emerald-300">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
            {symptoms.trim() ? 'No Direct Offline Repertory Match' : 'Clinical Decision Support'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Enter symptoms or click <strong>'Groq AI Consult'</strong> to analyze with Groq AI.
          </p>
          {symptoms.trim() && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleGroqConsult()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-[#1B4332] hover:from-emerald-700 hover:to-[#235841] text-white text-xs font-bold shadow-sm transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>Run Groq AI Consult</span>
              </button>
            </div>
          )}
        </div>
      )}



      {/* Floating Toast Notification for API status and actions */}
      {toast && (
        <div
          role="alert"
          className={`fixed bottom-6 right-6 z-50 max-w-md p-4 rounded-2xl shadow-xl border flex items-start gap-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
            toast.type === 'error'
              ? 'bg-red-50 dark:bg-red-950/95 border-red-300 dark:border-red-800 text-red-900 dark:text-red-100'
              : toast.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/95 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
              : 'bg-slate-50 dark:bg-slate-900/95 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          ) : toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 text-xs font-semibold leading-relaxed">
            {toast.message}
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold cursor-pointer"
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
