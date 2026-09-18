import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  BookOpen,
  Search,
  Pill,
  Sparkles,
  Printer,
  Copy,
  Check,
  PlusCircle,
  PackageSearch,
  ArrowRight,
  Flame,
  CheckCircle2,
  ShieldAlert,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  Layers,
  FileText,
  Activity,
  HeartPulse,
  Info,
  X,
  Mic,
  MicOff,
  Plus,
  Database,
  Save,
  Bot,
  RefreshCw,
  SlidersHorizontal,
  Volume2,
  Globe,
  Building2
} from 'lucide-react';
import {
  MateriaMedicaRemedy,
  RemedyIndexItem,
  TOP_MATERIA_MEDICA_DATABASE,
  getAllIndexedRemedies,
  getOrSynthesizeMateriaMedica
} from '../data/materiaMedicaDatabase';
import { getInventory } from '../services/clinicStore';
import { fetchRemedyTreatiseText, enrichRemedyWithGemini } from '../services/geminiClient';
import { synthesizeMateriaMedicaOffline } from '../services/materiaMedicaEngine';
import {
  CustomMateriaMedicaRecord,
  loadCustomRemedies,
  saveCustomRemedy,
  convertCustomToMateriaMedicaRemedy,
  convertCustomToRemedyIndexItem
} from '../services/customMateriaMedicaService';
import { CompanyCatalogImportModal } from './CompanyCatalogImportModal';

interface MateriaMedicaExplorerProps {
  onAddRemedyToBilling?: (remedyName: string, potency?: string) => void;
  onNavigateToInventory?: (medicineName: string) => void;
}

export const MateriaMedicaExplorer: React.FC<MateriaMedicaExplorerProps> = ({
  onAddRemedyToBilling,
  onNavigateToInventory
}) => {
  // Custom remedies from Supabase + localStorage
  const [customRemedies, setCustomRemedies] = useState<CustomMateriaMedicaRecord[]>([]);

  // Master index of 500+ remedies combined with custom remedies
  const masterRemedies = useMemo(() => {
    const base = getAllIndexedRemedies();
    if (!customRemedies.length) return base;

    const customItems = customRemedies.map((rec) => convertCustomToRemedyIndexItem(rec));
    const customIds = new Set(customItems.map((c) => c.id));
    return [...customItems, ...base.filter((b) => !customIds.has(b.id))];
  }, [customRemedies]);

  // Load custom remedies on mount
  useEffect(() => {
    loadCustomRemedies().then((records) => {
      if (records && records.length > 0) {
        setCustomRemedies(records);
      }
    });
  }, []);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'dilution' | 'mother_tincture' | 'biochemic' | 'patent'
  >('all');
  const [selectedRemedyId, setSelectedRemedyId] = useState<string>('arnica-montana');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  // Voice Search States
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState<string | null>(null);

  // Active Remedy Data
  const [activeRemedy, setActiveRemedy] = useState<MateriaMedicaRemedy>(() => {
    return TOP_MATERIA_MEDICA_DATABASE['arnica-montana'];
  });

  // UI States
  const [copied, setCopied] = useState(false);
  const [addedToBill, setAddedToBill] = useState(false);
  const [inventoryMatch, setInventoryMatch] = useState<{
    found: boolean;
    name: string;
    stock: number;
    rack: string;
  } | null>(null);

  // Extended Boericke Fetch State
  const [isFetchingExtended, setIsFetchingExtended] = useState(false);
  const [extendedTreatise, setExtendedTreatise] = useState<string | null>(null);

  // Auto-Add / AI Enrich Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCatalogImportModalOpen, setIsCatalogImportModalOpen] = useState(false);
  const [isEnrichingAI, setIsEnrichingAI] = useState(false);
  const [isSavingCustom, setIsSavingCustom] = useState(false);
  const [isModalDictating, setIsModalDictating] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Add Modal Form State
  const [modalForm, setModalForm] = useState<{
    name: string;
    bengaliName: string;
    brand: string;
    category: 'dilution' | 'mother_tincture' | 'biochemic' | 'patent';
    sphereOfAction: string;
    sphereOfActionBn: string;
    clinicalIndications: Array<{ en: string; bn: string }>;
    keynotes: Array<{ en: string; bn: string }>;
    dosage: string;
    worseModalities: string;
    betterModalities: string;
  }>({
    name: '',
    bengaliName: '',
    brand: '',
    category: 'patent',
    sphereOfAction: '',
    sphereOfActionBn: '',
    clinicalIndications: [
      { en: '', bn: '' },
      { en: '', bn: '' }
    ],
    keynotes: [
      { en: '', bn: '' },
      { en: '', bn: '' }
    ],
    dosage: '10-15 drops in quarter glass of lukewarm water 3 times daily before meals.',
    worseModalities: 'Cold drafts, weather change, physical exertion',
    betterModalities: 'Rest, quiet room, warm liquids'
  });

  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filtered dropdown matches based on query and category
  const filteredMatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return masterRemedies.filter((item) => {
      // Category check
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;

      // Autocomplete check (2+ characters or matches start/aliases)
      const matchesName = item.name.toLowerCase().includes(q);
      const matchesBn = item.nameBn.toLowerCase().includes(q);
      const matchesCommon = item.commonName.toLowerCase().includes(q);
      const matchesAlias = item.aliases.some((a) => a.toLowerCase().includes(q));

      return matchesName || matchesBn || matchesCommon || matchesAlias;
    });
  }, [masterRemedies, searchQuery, selectedCategory]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Check inventory whenever active remedy changes
  useEffect(() => {
    if (!activeRemedy) return;
    try {
      const allInventory = getInventory();
      const remedyNameLower = activeRemedy.latinName.toLowerCase();
      const firstWord = remedyNameLower.split(' ')[0];

      const match = allInventory.find((item) => {
        const itemLower = item.medicine_name.toLowerCase();
        return itemLower.includes(remedyNameLower) || (firstWord.length > 3 && itemLower.includes(firstWord));
      });

      if (match) {
        setInventoryMatch({
          found: true,
          name: match.medicine_name,
          stock: match.stock_quantity,
          rack: match.rack_location || 'General Shelf'
        });
      } else {
        setInventoryMatch({
          found: false,
          name: activeRemedy.latinName,
          stock: 0,
          rack: 'N/A'
        });
      }
    } catch (e) {
      console.warn('Error checking inventory:', e);
    }
  }, [activeRemedy]);

  // Select a remedy (supports custom and preloaded database)
  const handleSelectRemedy = (item: RemedyIndexItem & { isCustom?: boolean }) => {
    setSelectedRemedyId(item.id);
    const customMatch = customRemedies.find((c) => c.id === item.id);
    if (customMatch) {
      const remedyData = convertCustomToMateriaMedicaRemedy(customMatch);
      setActiveRemedy(remedyData);
    } else {
      const remedyData = getOrSynthesizeMateriaMedica(item);
      setActiveRemedy(remedyData);
    }
    setSearchQuery(item.name);
    setIsDropdownOpen(false);
    setExtendedTreatise(null);
  };

  // Voice Search recognition for main search input
  const toggleVoiceSearch = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in this browser. Please try Google Chrome, MS Edge, or Safari.');
      return;
    }

    if (isListeningVoice) {
      setIsListeningVoice(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US'; // recognizes latin remedy names and phonetic speech
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListeningVoice(true);
        setVoiceFeedback('Listening... Speak remedy name (e.g. "Arnica", "Rhus Tox", "Thuja", "R41", "Syzygium")');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setSearchQuery(transcript);
          setIsDropdownOpen(true);
          setVoiceFeedback(`Recognized: "${transcript}"`);

          // Look for direct or alias matches
          const lower = transcript.toLowerCase();
          const match = masterRemedies.find(
            (r) =>
              r.name.toLowerCase().includes(lower) ||
              r.aliases.some((a) => a.toLowerCase().includes(lower))
          );
          if (match) {
            handleSelectRemedy(match);
          }
        }
        setTimeout(() => setVoiceFeedback(null), 3500);
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        setIsListeningVoice(false);
        setVoiceFeedback('No speech detected or mic permission denied');
        setTimeout(() => setVoiceFeedback(null), 3000);
      };

      recognition.onend = () => {
        setIsListeningVoice(false);
      };

      recognition.start();
    } catch (err) {
      console.warn('Speech recognition failed to initialize:', err);
      setIsListeningVoice(false);
    }
  };

  // Voice dictation inside the Add Remedy modal
  const toggleModalDictation = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice speech recognition is not supported in this browser. Please try Google Chrome or MS Edge.');
      return;
    }

    if (isModalDictating) {
      setIsModalDictating(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'bn-BD'; // supports Bengali speech or English
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsModalDictating(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setModalForm((prev) => ({
            ...prev,
            name: prev.name ? `${prev.name} ${transcript}` : transcript
          }));
        }
      };

      recognition.onerror = () => setIsModalDictating(false);
      recognition.onend = () => setIsModalDictating(false);
      recognition.start();
    } catch (err) {
      setIsModalDictating(false);
    }
  };

  // AI Auto-Enrich via Gemini
  const handleEnrichRemedyAI = async () => {
    if (!modalForm.name.trim()) {
      alert('Please enter or dictate a remedy or patent name first.');
      return;
    }
    setIsEnrichingAI(true);
    try {
      const result = await enrichRemedyWithGemini(modalForm.name.trim());
      setModalForm((prev) => ({
        ...prev,
        name: result.name || prev.name,
        bengaliName: result.bengaliName || prev.bengaliName || result.name,
        brand: result.brand || prev.brand || 'Dr. Reckeweg / Classical',
        category: result.category || prev.category,
        sphereOfAction: result.sphereOfAction || prev.sphereOfAction,
        sphereOfActionBn: result.sphereOfAction || prev.sphereOfActionBn,
        clinicalIndications:
          result.clinicalIndications && result.clinicalIndications.length > 0
            ? result.clinicalIndications
            : prev.clinicalIndications,
        keynotes:
          result.keynotes && result.keynotes.length > 0 ? result.keynotes : prev.keynotes,
        dosage: result.dosage || prev.dosage,
        worseModalities: result.modalities?.worse || prev.worseModalities,
        betterModalities: result.modalities?.better || prev.betterModalities
      }));
    } catch (err) {
      console.error('AI enrichment error:', err);
    } finally {
      setIsEnrichingAI(false);
    }
  };

  // Save Custom Remedy to Supabase & LocalStorage
  const handleSaveCustomRemedy = async () => {
    if (!modalForm.name.trim()) {
      alert('Please enter a valid remedy name.');
      return;
    }
    setIsSavingCustom(true);
    const cleanId =
      'custom-' +
      modalForm.name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') +
      '-' +
      Date.now().toString(36);

    const record: CustomMateriaMedicaRecord = {
      id: cleanId,
      name: modalForm.name.trim(),
      bengali_name: modalForm.bengaliName.trim() || modalForm.name.trim(),
      brand: modalForm.brand.trim() || 'Clinic Custom Monograph',
      category: modalForm.category,
      sphere_of_action: modalForm.sphereOfAction.trim() || `${modalForm.name.trim()} clinical sphere of action.`,
      clinical_indications: modalForm.clinicalIndications.filter(
        (i) => i.en.trim() || i.bn.trim()
      ),
      keynotes: modalForm.keynotes.filter((k) => k.en.trim() || k.bn.trim()),
      dosage: modalForm.dosage.trim(),
      modalities: {
        worse: modalForm.worseModalities.trim(),
        better: modalForm.betterModalities.trim()
      },
      created_at: new Date().toISOString()
    };

    await saveCustomRemedy(record);
    setCustomRemedies((prev) => [record, ...prev.filter((r) => r.id !== record.id)]);

    const fullRemedy = convertCustomToMateriaMedicaRemedy(record);
    setActiveRemedy(fullRemedy);
    setSelectedRemedyId(fullRemedy.id);
    setSearchQuery(fullRemedy.latinName);

    setIsSavingCustom(false);
    setIsAddModalOpen(false);
    setSaveSuccessMsg(`'${fullRemedy.latinName}' successfully synced to Supabase & offline cache!`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // Bulk Import Success Callback
  const handleBulkImportSuccess = (importedRecords: CustomMateriaMedicaRecord[]) => {
    if (!importedRecords || importedRecords.length === 0) return;

    setCustomRemedies((prev) => {
      const map = new Map<string, CustomMateriaMedicaRecord>();
      // Prepend newly imported items so they appear at the top
      importedRecords.forEach((rec) => map.set(rec.id, rec));
      prev.forEach((rec) => {
        if (!map.has(rec.id)) {
          map.set(rec.id, rec);
        }
      });
      return Array.from(map.values());
    });

    // Select the first imported remedy immediately
    const first = importedRecords[0];
    const fullRemedy = convertCustomToMateriaMedicaRemedy(first);
    setSelectedRemedyId(first.id);
    setActiveRemedy(fullRemedy);
    setSearchQuery(fullRemedy.latinName);

    setSaveSuccessMsg(`✅ সফলভাবে ${importedRecords.length} টি কোম্পানি ওষুধ ক্যাটালগ থেকে ডাটাবেসে সেভ ও যুক্ত হয়েছে!`);
    setTimeout(() => setSaveSuccessMsg(null), 5000);
  };

  // Quick chips popular remedies
  const popularRemedies: Array<{ id: string; name: string; nameBn: string }> = [
    { id: 'arnica-montana', name: 'Arnica Mont', nameBn: 'আর্নিকা' },
    { id: 'aconitum-napellus', name: 'Aconite Nap', nameBn: 'একোনাইট' },
    { id: 'belladonna', name: 'Belladonna', nameBn: 'বেলাডোনা' },
    { id: 'bryonia-alba', name: 'Bryonia Alba', nameBn: 'ব্রায়োনিয়া' },
    { id: 'berberis-vulgaris', name: 'Berberis Vulg Q', nameBn: 'বারবারিস Ø' },
    { id: 'arsenicum-album', name: 'Arsenic Alb', nameBn: 'আর্সেনিক' },
    { id: 'calcarea-carbonica', name: 'Calc Carb', nameBn: 'ক্যালক কার্ব' },
    { id: 'nux-vomica', name: 'Nux Vomica', nameBn: 'নাক্স ভমিকা' },
    { id: 'lycopodium-clavatum', name: 'Lycopodium', nameBn: 'লাইকোপোডিয়াম' },
    { id: 'pulsatilla-nigricans', name: 'Pulsatilla', nameBn: 'পালসেটিলা' },
    { id: 'rhus-toxicodendron', name: 'Rhus Tox', nameBn: 'রাস টক্স' },
    { id: 'silicea', name: 'Silicea 6X', nameBn: 'সিলিসিয়া' },
    { id: 'thuja-occidentalis', name: 'Thuja Occ', nameBn: 'থুজা' },
    { id: 'passiflora-incarnata', name: 'Passiflora Q', nameBn: 'প্যাসিফ্লোরা Ø' },
    { id: 'magnesia-phosphorica', name: 'Mag Phos 6X', nameBn: 'ম্যাগ ফস' },
    { id: 'reckeweg-r41', name: 'Dr. Reckeweg R41', nameBn: 'আর৪১' }
  ];

  // Copy clinical profile to clipboard
  const handleCopyProfile = () => {
    if (!activeRemedy) return;
    const text = `
=== MATERIA MEDICA CLINICAL PROFILE ===
Remedy: ${activeRemedy.latinName} (${activeRemedy.nameBn})
Common Name: ${activeRemedy.commonName} | Family/Source: ${activeRemedy.familySource}
Category: ${activeRemedy.category.toUpperCase()}

[SPHERE OF ACTION & CORE FUNCTION]
English: ${activeRemedy.sphereOfActionEn}
Bengali: ${activeRemedy.sphereOfActionBn}

[PRIMARY CLINICAL INDICATIONS]
${activeRemedy.primaryIndications.map((ind, i) => `${i + 1}. ${ind.en} (${ind.bn})`).join('\n')}

[GUIDING KEYNOTES & PECULIAR SYMPTOMS]
${activeRemedy.guidingKeynotes.map((k, i) => `• ${k.en} [${k.bn}]`).join('\n')}

[MODALITIES]
- Aggravation (কিসে বাড়ে): ${activeRemedy.modalities.worseEn} | ${activeRemedy.modalities.worseBn}
- Amelioration (কিসে কমে): ${activeRemedy.modalities.betterEn} | ${activeRemedy.modalities.betterBn}

[RECOMMENDED POTENCY & DOSAGE]
Potency: ${activeRemedy.recommendedPotency}
Dosage: ${activeRemedy.dosageGuidelines}
${activeRemedy.complementary ? `Complementary: ${activeRemedy.complementary}\n` : ''}${
      activeRemedy.clinicalPearls ? `Pearls: ${activeRemedy.clinicalPearls}\n` : ''
    }
=== Dr. M. A. Haque Homoeo Health Care ===
    `.trim();

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  // Add remedy to patient billing
  const handleAddToBilling = () => {
    if (!activeRemedy) return;
    const desc = `${activeRemedy.latinName} (${activeRemedy.recommendedPotency.split('/')[0].trim() || 'Dilution'})`;
    sessionStorage.setItem(
      'hhc_pending_billing_item',
      JSON.stringify({
        item_description: desc,
        price: 150
      })
    );

    if (onAddRemedyToBilling) {
      onAddRemedyToBilling(activeRemedy.latinName, activeRemedy.recommendedPotency);
    }

    setAddedToBill(true);
    setTimeout(() => setAddedToBill(false), 3000);
  };

  // Fetch Extended Boericke/Kent treatise
  const handleFetchExtendedTreatise = async () => {
    if (!activeRemedy) return;
    setIsFetchingExtended(true);
    setExtendedTreatise(null);

    try {
      const aiResponse = await fetchRemedyTreatiseText(activeRemedy.latinName);
      if (aiResponse && aiResponse.length > 50) {
        setExtendedTreatise(aiResponse);
      } else {
        // Fallback to offline Boericke synthesis
        const offlineTreatise = `
### William Boericke, M.D. - Materia Medica Reference for ${activeRemedy.latinName}

**MIND & DISPOSITION:**
- Marked nervous irritability and constitutional susceptibility characteristic of ${activeRemedy.latinName}.
- Restlessness, mental fatigue from prolonged strain, or quiet sadness corresponding with tissue pathology.

**HEAD & SENSORY:**
- Congestive sensations, stitching pains, fullness in forehead or occiput.
- Modalities closely linked to atmospheric pressure, temperature changes, and physical movement.

**GASTROINTESTINAL & ABDOMINAL:**
- Affects digestion, assimilation, and secretory glands.
- Dyspepsia, flatulent distension, and hepatic sluggishness responsive to specific potency.

**CLINICAL APPLICATION & DOSAGE (ডোজ ও প্রয়োগবিধি):**
- Dilutions: 30C in subacute manifestations; 200C or 1M in constitutional chronic states.
- Mother Tinctures (Q): 10-15 drops in water for physiological tissue affinity.
        `.trim();
        setExtendedTreatise(offlineTreatise);
      }
    } catch (err) {
      console.warn('Gemini fetch error, using offline Boericke synthesis:', err);
      const offlineTreatise = `
### William Boericke, M.D. - Materia Medica Reference for ${activeRemedy.latinName}

**SPHERE OF INFLUENCE & CHARACTERISTICS:**
${activeRemedy.sphereOfActionEn}

**বাংলায় প্রয়োগ ক্ষেত্র:**
${activeRemedy.sphereOfActionBn}

**CARDINAL CLINICAL PEARLS:**
${activeRemedy.guidingKeynotes.map((k) => `• ${k.en}`).join('\n')}

**MODALITIES:**
- Worse: ${activeRemedy.modalities.worseEn}
- Better: ${activeRemedy.modalities.betterEn}
      `.trim();
      setExtendedTreatise(offlineTreatise);
    } finally {
      setIsFetchingExtended(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-[#1B4332] dark:text-emerald-400 flex items-center justify-center font-bold shadow-xs">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Materia Medica Explorer
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                ঔষধ সহায়িকা
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              500+ classical remedies, Mother Tinctures (Q), Biochemics & Patents with Kent & Boericke references
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsCatalogImportModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-emerald-950 text-white dark:text-emerald-200 border border-slate-700 dark:border-emerald-800 text-xs font-bold transition shadow-xs hover:bg-slate-800 dark:hover:bg-emerald-900 cursor-pointer"
            title="Bulk Import Pharmaceutical Company Catalog or Website URL"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>🌐 কোম্পানি ক্যাটালগ ইমপোর্ট</span>
            <span className="hidden sm:inline text-[10px] text-slate-300 dark:text-emerald-300 font-normal">(Bulk Import)</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-[#1B4332] text-white text-xs font-bold transition shadow-xs hover:shadow-md hover:from-emerald-500 hover:to-[#235841] cursor-pointer"
            title="Auto-Add / AI Enrich New Remedy into Supabase & Offline Cache"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>+ Enrich & Add Remedy</span>
            <span className="hidden sm:inline text-[10px] text-emerald-200 font-normal">(নতুন ঔষধ যোগ)</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Print Materia Medica Sheet"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print Sheet</span>
          </button>
          <button
            type="button"
            onClick={handleCopyProfile}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-[#1B4332] hover:bg-emerald-800 text-white'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Clinical Profile'}</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert if custom remedy was saved */}
      {saveSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-between gap-3 text-xs sm:text-sm animate-fade-in shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{saveSuccessMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveSuccessMsg(null)}
            className="p-1 text-emerald-600 hover:text-emerald-900 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Voice Recognition Feedback Bar */}
      {voiceFeedback && (
        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-center gap-2 text-xs animate-fade-in">
          <Mic className="w-3.5 h-3.5 text-amber-600 animate-pulse shrink-0" />
          <span className="font-medium">{voiceFeedback}</span>
        </div>
      )}

      {/* SEARCH AND FILTER CONTROL PANEL */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: 'All Remedies (সকল)', count: masterRemedies.length },
            {
              id: 'dilution',
              label: 'Dilutions (ডাইলুশন)',
              count: masterRemedies.filter((r) => r.category === 'dilution').length
            },
            {
              id: 'mother_tincture',
              label: 'Mother Tinctures (মাদার Ø)',
              count: masterRemedies.filter((r) => r.category === 'mother_tincture').length
            },
            {
              id: 'biochemic',
              label: 'Biochemic Salts (বায়োকেমিক)',
              count: masterRemedies.filter((r) => r.category === 'biochemic').length
            },
            {
              id: 'patent',
              label: 'Patent Formulations (পেটেন্ট)',
              count: masterRemedies.filter((r) => r.category === 'patent').length
            }
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.id as any);
                setIsDropdownOpen(true);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-[#1B4332] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedCategory === cat.id
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Intelligent Autocomplete Input Bar with Voice Search */}
        <div className="relative">
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-slate-400">
              <Search className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              id="materia-medica-search-input"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
                setHighlightedIndex(0);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              onKeyDown={(e) => {
                if (!isDropdownOpen) return;
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setHighlightedIndex((prev) => Math.min(prev + 1, filteredMatches.length - 1));
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setHighlightedIndex((prev) => Math.max(prev - 1, 0));
                } else if (e.key === 'Enter') {
                  e.preventDefault();
                  if (filteredMatches[highlightedIndex]) {
                    handleSelectRemedy(filteredMatches[highlightedIndex]);
                  }
                } else if (e.key === 'Escape') {
                  setIsDropdownOpen(false);
                }
              }}
              placeholder="Type 2+ letters (e.g., 'Ar', 'Bel', 'Thu', 'Rhus', 'Berb', 'আর্নিকা', 'R41')..."
              className="w-full pl-11 pr-32 py-3 sm:py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm sm:text-base font-medium placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#1B4332] transition"
            />
            <div className="absolute right-3 flex items-center gap-1.5">
              {/* Voice Search Button */}
              <button
                type="button"
                onClick={toggleVoiceSearch}
                className={`p-1.5 rounded-xl transition cursor-pointer flex items-center justify-center ${
                  isListeningVoice
                    ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
                    : 'text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-700'
                }`}
                title={isListeningVoice ? 'Listening... click to stop' : 'Voice Search (কথা বলে খুঁজুন)'}
              >
                {isListeningVoice ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setIsDropdownOpen(true);
                    searchInputRef.current?.focus();
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <span className="hidden sm:inline-block px-2 py-1 rounded-lg bg-slate-200/80 dark:bg-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                {filteredMatches.length} Found
              </span>
            </div>
          </div>

          {/* Autocomplete Dropdown Menu */}
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-full left-0 right-0 mt-2 max-h-80 overflow-y-auto rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl z-50 p-2 space-y-1"
            >
              {filteredMatches.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    কোনো ওষুধ খুঁজে পাওয়া যায়নি (No matching remedy found).
                  </p>
                  <p className="text-[11px] mt-0.5 mb-2">
                    Try searching by common Latin name, Bengali spelling, or category filter above.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setModalForm((prev) => ({
                        ...prev,
                        name: searchQuery.trim(),
                        bengaliName: searchQuery.trim()
                      }));
                      setIsDropdownOpen(false);
                      setIsAddModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1B4332] text-white text-xs font-bold hover:bg-emerald-800 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>+ AI Enrich '{searchQuery}' Now</span>
                  </button>
                </div>
              ) : (
                filteredMatches.slice(0, 40).map((item, index) => {
                  const isHighlighted = highlightedIndex === index;
                  const isSelected = selectedRemedyId === item.id;
                  const isCustom = 'isCustom' in item && (item as any).isCustom;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectRemedy(item)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={`w-full p-2.5 rounded-xl text-left transition flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-[#1B4332] dark:text-emerald-300 font-bold'
                          : isHighlighted
                          ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                            isCustom
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                              : item.category === 'mother_tincture'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : item.category === 'biochemic'
                              ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300'
                              : item.category === 'patent'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}
                        >
                          <Pill className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-sm">{item.name}</span>
                            {isCustom && (
                              <span className="px-1.5 py-0.2 rounded-md bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-[9px] font-bold">
                                Chamber
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            ({item.nameBn})
                          </span>
                          <span className="text-[11px] text-slate-400 block truncate">
                            {item.commonName}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            item.category === 'mother_tincture'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : item.category === 'biochemic'
                              ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300'
                              : item.category === 'patent'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}
                        >
                          {item.category.replace('_', ' ')}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Quick Popular Remedies Chips */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">
            Quick Polycrests & Specifics (বহুল ব্যবহৃত ঔষধসমূহ):
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {popularRemedies.map((pop) => (
              <button
                key={pop.id}
                type="button"
                onClick={() => {
                  const match = masterRemedies.find((r) => r.id === pop.id);
                  if (match) handleSelectRemedy(match);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer flex items-center gap-1 ${
                  selectedRemedyId === pop.id
                    ? 'bg-[#1B4332] text-white border-[#1B4332]'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:border-emerald-300'
                }`}
              >
                <span>{pop.name}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">({pop.nameBn})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DETAILED MATERIA MEDICA PROFILE SHEET */}
      {activeRemedy && (
        <div className="space-y-6 animate-fade-in print:space-y-4">
          {/* SECTION 1: HEADER CARD */}
          <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-emerald-900 via-[#1B4332] to-[#2D6A4F] text-white shadow-xl shadow-emerald-950/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-3 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                      activeRemedy.category === 'mother_tincture'
                        ? 'bg-amber-400 text-slate-950'
                        : activeRemedy.category === 'biochemic'
                        ? 'bg-sky-300 text-slate-950'
                        : activeRemedy.category === 'patent'
                        ? 'bg-purple-300 text-slate-950'
                        : 'bg-emerald-300 text-slate-950'
                    }`}
                  >
                    {activeRemedy.category.toUpperCase().replace('_', ' ')}
                  </span>
                  <span className="text-xs text-emerald-200 font-medium">
                    Family / Source: {activeRemedy.familySource}
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight italic">
                    {activeRemedy.latinName}
                  </h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-lg sm:text-xl font-bold text-emerald-200">
                      {activeRemedy.nameBn}
                    </span>
                    <span className="text-emerald-300/80">•</span>
                    <span className="text-xs sm:text-sm text-emerald-100/90 font-medium">
                      {activeRemedy.commonName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons in Header */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleAddToBilling}
                  className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition cursor-pointer shadow-md ${
                    addedToBill
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white text-[#1B4332] hover:bg-emerald-50'
                  }`}
                  title="Add to Patient Invoice"
                >
                  {addedToBill ? <Check className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                  <span>{addedToBill ? 'Added to Prescription!' : '+ Add to Patient Bill'}</span>
                </button>

                {onNavigateToInventory && (
                  <button
                    type="button"
                    onClick={() => onNavigateToInventory(activeRemedy.latinName)}
                    className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white/15 hover:bg-white/25 text-white flex items-center gap-1.5 transition cursor-pointer border border-white/20"
                    title="Check stock in chamber pharmacy"
                  >
                    <PackageSearch className="w-4 h-4" />
                    <span>Check Inventory</span>
                  </button>
                )}
              </div>
            </div>

            {/* Chamber Stock Quick Indicator Bar */}
            {inventoryMatch && (
              <div className="mt-5 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      inventoryMatch.stock > 0 ? 'bg-emerald-300 animate-pulse' : 'bg-amber-300'
                    }`}
                  />
                  <span className="font-semibold text-emerald-100">
                    Chamber Stock Status:
                  </span>
                  <span className="font-bold text-white">
                    {inventoryMatch.stock > 0
                      ? `${inventoryMatch.stock} in stock (Rack: ${inventoryMatch.rack})`
                      : 'Available on order / standard potency kit'}
                  </span>
                </div>
                <div className="text-[11px] text-emerald-200">
                  Standard Dispensary Reference • Dr. M. A. Haque Clinic
                </div>
              </div>
            )}
          </div>

          {/* GRID LAYOUT: SECTIONS 2, 3, 4, 5 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT 2 COLUMNS: Clinical Knowledge & Keynotes */}
            <div className="lg:col-span-2 space-y-6">
              {/* SECTION 2: SPHERE OF ACTION */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#1B4332] dark:text-emerald-400 flex items-center justify-center font-bold">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      Sphere of Action & Core Function
                    </h3>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                      মূল কাজ ও প্রভাব ক্ষেত্র (Organ Affinity & Pathogenesis)
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-slate-800/50 border border-emerald-100 dark:border-slate-700 space-y-2">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                    {activeRemedy.sphereOfActionEn}
                  </p>
                  <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-300 leading-relaxed pt-1 border-t border-emerald-100/60 dark:border-slate-700/60">
                    <span className="font-bold">বাংলায়: </span>
                    {activeRemedy.sphereOfActionBn}
                  </p>
                </div>
              </div>

              {/* SECTION 3: PRIMARY CLINICAL INDICATIONS */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold">
                    <HeartPulse className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      Primary Diseases & Clinical Indications
                    </h3>
                    <p className="text-[11px] text-blue-700 dark:text-blue-400 font-semibold">
                      যে যে রোগে ব্যবহারযোগ্য ও প্রধান প্রয়োগ ক্ষেত্র
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {activeRemedy.primaryIndications.map((ind, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {ind.en}
                        </p>
                        <p className="text-xs font-medium text-emerald-800 dark:text-emerald-400">
                          {ind.bn}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 4: GUIDING KEYNOTES & PECULIAR SYMPTOMS */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      Guiding Keynotes & Peculiar Symptoms
                    </h3>
                    <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
                      মূল নির্দেশক লক্ষণ ও স্বতন্ত্র বৈশিষ্ট্য (Kent & Boericke)
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {activeRemedy.guidingKeynotes.map((keynote, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 flex items-start gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-2" />
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {keynote.en}
                        </p>
                        <p className="text-xs font-medium text-amber-900 dark:text-amber-300">
                          {keynote.bn}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT 1 COLUMN: Modalities, Potency, Dosage, Relationships */}
            <div className="space-y-6">
              {/* SECTION 5: MODALITIES (AGGRAVATION & AMELIORATION) */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 flex items-center justify-center font-bold">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      Modalities (বৃদ্ধি ও উপশম)
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Aggravation & Amelioration factors
                    </p>
                  </div>
                </div>

                {/* Aggravation */}
                <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/40 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-rose-800 dark:text-rose-300 font-extrabold text-xs uppercase tracking-wider">
                    <Flame className="w-3.5 h-3.5" />
                    <span>Aggravation (কিসে রোগ বাড়ে):</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {activeRemedy.modalities.worseEn}
                  </p>
                  <p className="text-xs text-rose-900 dark:text-rose-300 font-medium">
                    {activeRemedy.modalities.worseBn}
                  </p>
                </div>

                {/* Amelioration */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/40 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Amelioration (কিসে উপশম হয়):</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {activeRemedy.modalities.betterEn}
                  </p>
                  <p className="text-xs text-emerald-900 dark:text-emerald-300 font-medium">
                    {activeRemedy.modalities.betterBn}
                  </p>
                </div>
              </div>

              {/* SECTION 6: RECOMMENDED POTENCY & DOSAGE */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400 flex items-center justify-center font-bold">
                    <Pill className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      Recommended Potency & Dosage
                    </h3>
                    <p className="text-[11px] text-purple-700 dark:text-purple-400 font-semibold">
                      প্রস্তাবিত শক্তি ও সেবনবিধি
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300 block">
                      Potency Spectrum:
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5 block">
                      {activeRemedy.recommendedPotency}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                      Clinical Dosage Guidelines (সেবনবিধি):
                    </span>
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                      {activeRemedy.dosageGuidelines}
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 7: CLINICAL RELATIONSHIPS & REMEDY ALLIANCES */}
              {(activeRemedy.complementary || activeRemedy.antidotes || activeRemedy.inimical) && (
                <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <span>Remedy Relationships (ঔষধের পারস্পরিক সম্বন্ধ)</span>
                  </h3>

                  <div className="space-y-2 text-xs">
                    {activeRemedy.complementary && (
                      <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-slate-800 border border-emerald-100 dark:border-slate-700">
                        <span className="font-bold text-emerald-800 dark:text-emerald-400 block">
                          Complementary (পরিপূরক):
                        </span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {activeRemedy.complementary}
                        </span>
                      </div>
                    )}

                    {activeRemedy.antidotes && (
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="font-bold text-slate-700 dark:text-slate-300 block">
                          Antidoted by (প্রতিষেধক):
                        </span>
                        <span className="text-slate-600 dark:text-slate-400 font-medium">
                          {activeRemedy.antidotes}
                        </span>
                      </div>
                    )}

                    {activeRemedy.inimical && (
                      <div className="p-2.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40">
                        <span className="font-bold text-rose-800 dark:text-rose-400 block">
                          Inimical / Incompatible (শত্রুভাবাপন্ন):
                        </span>
                        <span className="text-rose-900 dark:text-rose-300 font-medium">
                          {activeRemedy.inimical}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SECTION 8: BOERICKE EXTENDED TREATISE TRIGGER */}
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                    <FileText className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    <span>Boericke & Kent Treatise</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                    Live Engine
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Access William Boericke's complete Materia Medica text with exhaustive anatomical rubrics for this remedy.
                </p>

                <button
                  type="button"
                  disabled={isFetchingExtended}
                  onClick={handleFetchExtendedTreatise}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#1B4332] hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                >
                  {isFetchingExtended ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Retrieving Boericke Treatise...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Fetch Extended Boericke Monograph</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* EXTENDED TREATISE DISPLAY IF REQUESTED */}
          {extendedTreatise && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-600/30 dark:border-emerald-500/30 shadow-lg space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-[#1B4332] dark:text-emerald-400 flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      William Boericke & J. T. Kent Extended Clinical Monograph
                    </h3>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400">
                      In-depth regional pathology & constitutional proving notes for {activeRemedy.latinName}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setExtendedTreatise(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  title="Close treatise"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-sans bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                {extendedTreatise}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VOICE-TO-SUPABASE AI AUTO-ENRICH MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden my-auto animate-fade-in flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-900 via-[#1B4332] to-[#2D6A4F] text-white flex items-start justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold flex items-center gap-2">
                    <span>AI Auto-Enrich & Add Remedy</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-700/80 text-emerald-200 font-semibold">
                      ভয়েস ও এআই সহায়িকা
                    </span>
                  </h3>
                  <p className="text-xs text-emerald-200 mt-0.5">
                    Dictate or type any remedy, tincture, biochemic salt, or patent drop to automatically generate clinical monographs.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Scrollable */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-slate-900 dark:text-white">
              {/* STEP 1: Medicine Input & Auto-Enrichment Trigger */}
              <div className="p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-emerald-600" />
                    <span>1. Remedy / Patent / Mother Tincture Name</span>
                  </label>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                    Voice Dictation Enabled
                  </span>
                </div>

                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={modalForm.name}
                    onChange={(e) =>
                      setModalForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                        bengaliName: prev.bengaliName || e.target.value
                      }))
                    }
                    placeholder="e.g., 'Adel 39', 'Passiflora Q', 'Calcarea Fluorica 6X', 'SBL Tonsilat'..."
                    className="w-full pl-3.5 pr-20 py-2.5 sm:py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#1B4332]"
                  />
                  <div className="absolute right-2.5 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={toggleModalDictation}
                      className={`p-1.5 rounded-lg transition cursor-pointer ${
                        isModalDictating
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800'
                      }`}
                      title={isModalDictating ? 'Listening... click to stop' : 'Voice Dictate Name (মুখে বলুন)'}
                    >
                      {isModalDictating ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Category Selection */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Category (শ্রেণী নির্বাচন):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'dilution', label: 'Dilution (ডাইলুশন)' },
                      { id: 'mother_tincture', label: 'Mother Tincture (মাদার Ø)' },
                      { id: 'biochemic', label: 'Biochemic (বায়োকেমিক)' },
                      { id: 'patent', label: 'Patent Drop / Syrup (পেটেন্ট)' }
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() =>
                          setModalForm((prev) => ({ ...prev, category: cat.id as any }))
                        }
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                          modalForm.category === cat.id
                            ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-xs'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Brand Pills */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Manufacturer / Brand:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      'Dr. Reckeweg',
                      'Dr. Willmar Schwabe',
                      'SBL World Class',
                      "Bakson's Drugs",
                      'Adel Pekana',
                      'Wheezal',
                      'Classical Source'
                    ].map((brand) => (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => setModalForm((prev) => ({ ...prev, brand }))}
                        className={`px-2 py-0.8 rounded-lg text-[11px] font-medium transition cursor-pointer border ${
                          modalForm.brand === brand
                            ? 'bg-emerald-100 border-emerald-300 text-emerald-900 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300 font-bold'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>

                {/* The AI Auto-Enrich Button */}
                <button
                  type="button"
                  disabled={isEnrichingAI || !modalForm.name.trim()}
                  onClick={handleEnrichRemedyAI}
                  className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-[#1B4332] hover:from-emerald-500 hover:to-emerald-800 text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition shadow-md shadow-emerald-900/10 cursor-pointer disabled:opacity-50"
                >
                  {isEnrichingAI ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Gemini AI Auto-Enriching Kent & Boericke Monograph...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>⚡ AI Auto-Enrich Clinical Monograph (অটো-বিশ্লেষণ করুন)</span>
                    </>
                  )}
                </button>
              </div>

              {/* STEP 2: Editable Monograph Details */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-1.5 flex items-center justify-between">
                  <span>2. Clinical Monograph Details (বাংলা ও ইংরেজি বিবরণ)</span>
                  <span className="text-[10px] text-emerald-600 lowercase font-medium">
                    editable before saving
                  </span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Remedy Name (Latin):
                    </label>
                    <input
                      type="text"
                      value={modalForm.name}
                      onChange={(e) => setModalForm((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Bengali Name (বাংলা নাম):
                    </label>
                    <input
                      type="text"
                      value={modalForm.bengaliName}
                      onChange={(e) =>
                        setModalForm((prev) => ({ ...prev, bengaliName: e.target.value }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold"
                    />
                  </div>
                </div>

                {/* Sphere of Action */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">
                    Sphere of Action & Affinity (কার্যক্ষেত্র ও প্রধান প্রভাব):
                  </label>
                  <textarea
                    rows={2}
                    value={modalForm.sphereOfAction}
                    onChange={(e) =>
                      setModalForm((prev) => ({ ...prev, sphereOfAction: e.target.value }))
                    }
                    placeholder="Describe anatomical affinity, primary physiological target..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm resize-none"
                  />
                </div>

                {/* Primary Indications (Add/Remove Rows) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Primary Clinical Indications (প্রধান নির্দেশক লক্ষণসমূহ):
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setModalForm((prev) => ({
                          ...prev,
                          clinicalIndications: [...prev.clinicalIndications, { en: '', bn: '' }]
                        }))
                      }
                      className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Indication</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {modalForm.clinicalIndications.map((ind, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={ind.en}
                          onChange={(e) => {
                            const val = e.target.value;
                            setModalForm((prev) => {
                              const updated = [...prev.clinicalIndications];
                              updated[idx] = { ...updated[idx], en: val };
                              return { ...prev, clinicalIndications: updated };
                            });
                          }}
                          placeholder={`Indication #${idx + 1} in English`}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                        />
                        <input
                          type="text"
                          value={ind.bn}
                          onChange={(e) => {
                            const val = e.target.value;
                            setModalForm((prev) => {
                              const updated = [...prev.clinicalIndications];
                              updated[idx] = { ...updated[idx], bn: val };
                              return { ...prev, clinicalIndications: updated };
                            });
                          }}
                          placeholder={`বাংলায় লক্ষণ #${idx + 1}`}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                        />
                        {modalForm.clinicalIndications.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setModalForm((prev) => ({
                                ...prev,
                                clinicalIndications: prev.clinicalIndications.filter(
                                  (_, i) => i !== idx
                                )
                              }))
                            }
                            className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                            title="Remove indication"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Keynotes */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Guiding Keynotes & Red-String Symptoms (স্বতন্ত্র বৈশিষ্ট্য):
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setModalForm((prev) => ({
                          ...prev,
                          keynotes: [...prev.keynotes, { en: '', bn: '' }]
                        }))
                      }
                      className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Keynote</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {modalForm.keynotes.map((kn, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={kn.en}
                          onChange={(e) => {
                            const val = e.target.value;
                            setModalForm((prev) => {
                              const updated = [...prev.keynotes];
                              updated[idx] = { ...updated[idx], en: val };
                              return { ...prev, keynotes: updated };
                            });
                          }}
                          placeholder={`Keynote #${idx + 1} in English`}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                        />
                        <input
                          type="text"
                          value={kn.bn}
                          onChange={(e) => {
                            const val = e.target.value;
                            setModalForm((prev) => {
                              const updated = [...prev.keynotes];
                              updated[idx] = { ...updated[idx], bn: val };
                              return { ...prev, keynotes: updated };
                            });
                          }}
                          placeholder={`বাংলায় মূল নির্দেশক লক্ষণ #${idx + 1}`}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                        />
                        {modalForm.keynotes.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setModalForm((prev) => ({
                                ...prev,
                                keynotes: prev.keynotes.filter((_, i) => i !== idx)
                              }))
                            }
                            className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                            title="Remove keynote"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modalities: Worse & Better */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-rose-700 dark:text-rose-400 block mb-1">
                      Aggravation (কিসে বাড়ে / Worse):
                    </label>
                    <input
                      type="text"
                      value={modalForm.worseModalities}
                      onChange={(e) =>
                        setModalForm((prev) => ({ ...prev, worseModalities: e.target.value }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 block mb-1">
                      Amelioration (কিসে কমে / Better):
                    </label>
                    <input
                      type="text"
                      value={modalForm.betterModalities}
                      onChange={(e) =>
                        setModalForm((prev) => ({ ...prev, betterModalities: e.target.value }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-xs"
                    />
                  </div>
                </div>

                {/* Dosage */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Dosage & Administration Guidelines (সেবনবিধি):
                  </label>
                  <input
                    type="text"
                    value={modalForm.dosage}
                    onChange={(e) =>
                      setModalForm((prev) => ({ ...prev, dosage: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Cancel (বাতিল)
              </button>

              <button
                type="button"
                disabled={isSavingCustom || !modalForm.name.trim()}
                onClick={handleSaveCustomRemedy}
                className="px-5 py-2.5 rounded-xl bg-[#1B4332] hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2 transition shadow-md shadow-emerald-950/20 cursor-pointer disabled:opacity-50"
              >
                {isSavingCustom ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving to Supabase & Cache...</span>
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4 text-emerald-300" />
                    <span>Save to Supabase & Offline Cache</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Company Catalog Bulk Importer Modal */}
      <CompanyCatalogImportModal
        isOpen={isCatalogImportModalOpen}
        onClose={() => setIsCatalogImportModalOpen(false)}
        onImportSuccess={handleBulkImportSuccess}
      />
    </div>
  );
};
