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
  Stethoscope,
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
  Building2,
  ArrowLeft,
  ChevronRight,
  Key,
  Zap,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';
import {
  MateriaMedicaRemedy,
  RemedyIndexItem,
  TOP_MATERIA_MEDICA_DATABASE,
  getAllIndexedRemedies,
  getOrSynthesizeMateriaMedica
} from '../data/materiaMedicaDatabase';
import { useRealtimeInventory, checkMedicineStock } from '../services/inventoryMatcher';
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
import {
  ORGAN_LIST,
  SYMPTOM_LIST,
  OrganFilterItem,
  SymptomFilterItem,
  OrganRemedyProfile,
  SymptomDifferentialRemedy
} from '../data/materiaMedicaRepertory';
import { getGroqApiKey, hasGroqApiKey, setGroqApiKey } from '../services/groqClient';

export { ORGAN_LIST, SYMPTOM_LIST };
export type { OrganFilterItem, SymptomFilterItem, OrganRemedyProfile, SymptomDifferentialRemedy };

// GROQ MATERIA MEDICA & REPERTORY ZERO-HALLUCINATION GUARDRAIL
const GROQ_MATERIA_MEDICA_GUARDRAIL =
  "You are an expert classical homeopathic repertory engine grounded strictly in William Boericke's Materia Medica and J. T. Kent's Repertory. NEVER fabricate or hallucinate remedies, modalities, or clinical indications. Output strictly verified classical facts.";

/**
 * Executes a structured chat completion against Groq OpenAI-compatible API
 * with candidate model fallback and automatic JSON parsing.
 */
async function executeGroqRequest(
  messages: Array<{ role: string; content: string }>,
  apiKey: string,
  maxTokens = 2000
): Promise<string> {
  const candidateModels = ['llama-3.3-70b-versatile', 'openai/gpt-oss-20b', 'openai/gpt-oss-120b'];
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.2,
          max_tokens: maxTokens,
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        let errMessage = `HTTP ${response.status}`;
        try {
          const errData = await response.json();
          if (errData?.error?.message) errMessage = errData.error.message;
        } catch {
          // ignore
        }

        if (response.status === 401) {
          throw new Error(`Invalid Groq API Key (${errMessage}). Please update your API key.`);
        }
        if (response.status === 429) {
          throw new Error(`Groq API rate limit exceeded (${errMessage}). Please retry in a few moments.`);
        }
        lastError = new Error(`Groq model ${model} error: ${errMessage}`);
        continue;
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;
      if (content && typeof content === 'string') {
        return content.trim();
      }
    } catch (err: any) {
      if (err.message && (err.message.includes('Invalid Groq API Key') || err.message.includes('rate limit'))) {
        throw err;
      }
      lastError = err;
    }
  }

  throw lastError || new Error('All Groq candidate models failed to return a response.');
}

/**
 * Fetches authentic Boericke Monograph via Groq AI
 */
async function fetchAuthenticBoerickeMonographViaGroq(
  remedyName: string,
  apiKey: string
): Promise<MateriaMedicaRemedy> {
  const userPrompt = `Provide the authentic Boericke Materia Medica monograph for homeopathic remedy: "${remedyName}".
Ground all clinical indications, affinities, and modalities strictly in William Boericke's Materia Medica.

CRITICAL: Return STRICT JSON adhering to this exact schema:
{
  "latinName": "${remedyName}",
  "commonName": "English common name",
  "nameBn": "বাংলা নাম",
  "familySource": "Botanical/Chemical/Mineral/Animal source",
  "category": "dilution",
  "sphereOfActionEn": "Physiological sphere of action and tissues affected in English",
  "sphereOfActionBn": "শারীরিক প্রভাব ও প্রধান ক্রিয়াক্ষেত্রের বাংলা বিবরণ",
  "recommendedPotency": "e.g. 30C / 200C / Q",
  "primaryIndications": [
    { "en": "Primary clinical indication in English", "bn": "ক্লিনিক্যাল নির্দেশিকা বাংলায়" },
    { "en": "Primary clinical indication 2 in English", "bn": "ক্লিনিক্যাল নির্দেশিকা ২ বাংলায়" },
    { "en": "Primary clinical indication 3 in English", "bn": "ক্লিনিক্যাল নির্দেশিকা ৩ বাংলায়" }
  ],
  "guidingKeynotes": [
    { "en": "Guiding keynote in English", "bn": "প্রধান চরিত্রগত লক্ষণ বাংলায়" },
    { "en": "Guiding keynote 2 in English", "bn": "চরিত্রগত লক্ষণ ২ বাংলায়" },
    { "en": "Guiding keynote 3 in English", "bn": "চরিত্রগত লক্ষণ ৩ বাংলায়" }
  ],
  "modalities": {
    "worseEn": "Aggravation modalities (motion, cold, night, etc.)",
    "worseBn": "কিসে বাড়ে (নড়াচড়া, ঠান্ডা, রাত্রি ইত্যাদি)",
    "betterEn": "Amelioration modalities (rest, warmth, pressure, etc.)",
    "betterBn": "কিসে কমে (বিশ্রাম, উত্তাপ, চাপ ইত্যাদি)"
  },
  "mindDisposition": {
    "en": "Mental disposition in English",
    "bn": "মানসিক লক্ষণ ও স্বভাব বাংলায়"
  },
  "dosageInstructions": {
    "en": "Posology and dose guidance in English",
    "bn": "সেবন মাত্রা ও নিয়ম বাংলায়"
  },
  "clinicalPearls": [
    "High-yield Boericke clinical pearl 1",
    "Key diagnostic differential indication 2"
  ]
}`;

  const jsonStr = await executeGroqRequest(
    [
      { role: 'system', content: GROQ_MATERIA_MEDICA_GUARDRAIL },
      { role: 'user', content: userPrompt }
    ],
    apiKey,
    2000
  );

  const parsed = JSON.parse(jsonStr);
  const cleanId = remedyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const remedy: MateriaMedicaRemedy = {
    id: cleanId,
    latinName: parsed.latinName || remedyName,
    commonName: parsed.commonName || 'Homoeopathic Specific',
    nameBn: parsed.nameBn || remedyName,
    familySource: parsed.familySource || 'Natural Kingdom Source',
    category: parsed.category || 'dilution',
    sphereOfActionEn: parsed.sphereOfActionEn || 'Affects cellular vitality and physiological homeostasis.',
    sphereOfActionBn: parsed.sphereOfActionBn || 'শারীরিক জীবনীশক্তি ও সার্বিক ক্রিয়া নিয়ন্ত্রণ করে।',
    primaryIndications: Array.isArray(parsed.primaryIndications) && parsed.primaryIndications.length > 0
      ? parsed.primaryIndications
      : [{ en: 'Acute constitutional disturbance', bn: 'তীব্র শারীরিক অসুস্থতা ও উপসর্গ' }],
    guidingKeynotes: Array.isArray(parsed.guidingKeynotes) && parsed.guidingKeynotes.length > 0
      ? parsed.guidingKeynotes
      : [{ en: 'Characteristic symptom totality matching Boericke monograph', bn: 'বোরিকের মেটেরিয়া মেডিকা ভিত্তিক লক্ষণ সমষ্টি' }],
    modalities: {
      worseEn: parsed.modalities?.worseEn || 'Cold air, physical exertion, weather change',
      worseBn: parsed.modalities?.worseBn || 'ঠান্ডা বাতাস, শারীরিক পরিশ্রম, আবহাওয়ার পরিবর্তন',
      betterEn: parsed.modalities?.betterEn || 'Warm applications, quiet rest, open air',
      betterBn: parsed.modalities?.betterBn || 'গরম সেক, শান্ত বিশ্রাম, মুক্ত বাতাস'
    },
    recommendedPotency: parsed.recommendedPotency || '30C / 200C',
    dosageGuidelines:
      (typeof parsed.dosageGuidelines === 'string' && parsed.dosageGuidelines) ||
      (parsed.dosageInstructions && typeof parsed.dosageInstructions === 'object'
        ? parsed.dosageInstructions.en
        : typeof parsed.dosageInstructions === 'string'
        ? parsed.dosageInstructions
        : '4 pills 3 times daily, or 3-5 drops in teaspoon of water.'),
    complementary: Array.isArray(parsed.relationships?.complementary)
      ? parsed.relationships.complementary.join(', ')
      : parsed.complementary || '',
    antidotes: Array.isArray(parsed.relationships?.antidotes)
      ? parsed.relationships.antidotes.join(', ')
      : parsed.antidotes || '',
    inimical: Array.isArray(parsed.relationships?.inimical)
      ? parsed.relationships.inimical.join(', ')
      : parsed.inimical || '',
    clinicalPearls: Array.isArray(parsed.clinicalPearls)
      ? parsed.clinicalPearls.join('. ')
      : typeof parsed.clinicalPearls === 'string'
      ? parsed.clinicalPearls
      : 'Authentic Boericke clinical indication. Match modalities carefully before prescription.',
    aliases: [remedyName.toLowerCase(), cleanId]
  };

  return remedy;
}

/**
 * Fetches symptom differentials via Groq AI using J. T. Kent & William Boericke
 */
async function fetchSymptomDifferentialsViaGroq(
  symptomQuery: string,
  apiKey: string
): Promise<SymptomFilterItem> {
  const userPrompt = `Provide a classical homeopathic repertory differential analysis for the clinical condition/symptom: "${symptomQuery}".
Ground your recommendations strictly in J. T. Kent's Repertory and William Boericke's Materia Medica.
Provide exactly 4 to 6 proven Simillimum remedies with distinct, high-yield differentiating modalities (e.g. why one remedy is indicated over another).

CRITICAL: Return STRICT JSON adhering to this exact schema:
{
  "nameEn": "${symptomQuery}",
  "nameBn": "রোগ বা লক্ষণের নাম বাংলায়",
  "icon": "Relevant single emoji (e.g. 🩺, ⚡, 🩹, 🫁, 🧊, 🔥)",
  "definitionEn": "Concise medical definition and clinical repertory context in English",
  "definitionBn": "লক্ষণ ও ক্লিনিক্যাল রেপার্টরির সংক্ষিপ্ত বাংলা বিবরণ",
  "differentials": [
    {
      "name": "Remedy Latin Name (e.g. Colocynthis)",
      "nameBn": "ঔষধের বাংলা নাম",
      "category": "dilution",
      "potency": "e.g. 30C / 200C",
      "keynoteEn": "Peculiar symptom or sensation in English",
      "keynoteBn": "প্রধান চরিত্রগত লক্ষণ বা অনুভূতি বাংলায়",
      "modalityEn": "Aggravation and amelioration in English",
      "modalityBn": "হ্রাস ও বৃদ্ধি বাংলায়",
      "differentiatingFeature": "Clear differentiator explaining why this remedy is indicated over others"
    }
  ]
}`;

  const jsonStr = await executeGroqRequest(
    [
      { role: 'system', content: GROQ_MATERIA_MEDICA_GUARDRAIL },
      { role: 'user', content: userPrompt }
    ],
    apiKey,
    2000
  );

  const parsed = JSON.parse(jsonStr);
  const cleanId = 'ai-sym-' + symptomQuery.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const differentials: SymptomDifferentialRemedy[] = (parsed.differentials || []).map((diff: any, index: number) => {
    const remId = (diff.name || `remedy-${index}`).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return {
      remedyId: remId,
      name: diff.name || 'Classical Remedy',
      nameBn: diff.nameBn || diff.name || 'হোমিওপ্যাথিক ঔষধ',
      category: diff.category || 'dilution',
      keynoteEn: diff.keynoteEn || 'Keynote indication for condition',
      keynoteBn: diff.keynoteBn || 'রোগলক্ষণের বিশেষ নির্দেশক',
      modalityEn: diff.modalityEn || 'Specific aggravating and ameliorating factors',
      modalityBn: diff.modalityBn || 'হ্রাস-বৃদ্ধির নির্দিষ্ট নিয়ামক',
      differentiatingFeature: diff.differentiatingFeature || 'Clear differential indication',
      potency: diff.potency || '30C'
    };
  });

  const item: SymptomFilterItem = {
    id: cleanId,
    icon: parsed.icon || '🩺',
    nameEn: parsed.nameEn || symptomQuery,
    nameBn: parsed.nameBn || symptomQuery,
    definitionEn: parsed.definitionEn || `Clinical differential repertory guide for ${symptomQuery} according to Boericke and Kent.`,
    definitionBn: parsed.definitionBn || `${symptomQuery}-এর জন্য বোরিক ও কেন্ট রেপার্টরি ভিত্তিক নির্দেশিকা।`,
    keywords: [symptomQuery.toLowerCase(), cleanId, ...differentials.map((d) => d.name.toLowerCase())],
    remedyIds: differentials.map((d) => d.remedyId),
    differentials
  };

  return item;
}

interface MateriaMedicaExplorerProps {
  onAddRemedyToBilling?: (remedyName: string, potency?: string) => void;
  onNavigateToInventory?: (medicineName: string) => void;
}

export const MateriaMedicaExplorer: React.FC<MateriaMedicaExplorerProps> = ({
  onAddRemedyToBilling,
  onNavigateToInventory
}) => {
  // Real-time Supabase + local inventory matcher
  const { inventoryList, checkStock } = useRealtimeInventory();

  // Custom remedies from Supabase + localStorage
  const [customRemedies, setCustomRemedies] = useState<CustomMateriaMedicaRecord[]>([]);

  // Master index of 500+ remedies combined with custom remedies, guaranteed 100% unique IDs
  const masterRemedies = useMemo(() => {
    const base = getAllIndexedRemedies();
    const customItems = customRemedies.map((rec) => convertCustomToRemedyIndexItem(rec));
    const all = [...customItems, ...base];

    const seen = new Set<string>();
    const uniqueList: (RemedyIndexItem & { isCustom?: boolean })[] = [];
    for (const item of all) {
      if (item && item.id && !seen.has(item.id)) {
        seen.add(item.id);
        uniqueList.push(item);
      }
    }
    return uniqueList;
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
  const [searchMode, setSearchMode] = useState<'medicine' | 'organ' | 'symptom'>('medicine');
  const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null);
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'dilution' | 'mother_tincture' | 'biochemic' | 'patent'
  >('all');
  const [selectedRemedyId, setSelectedRemedyId] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  // Dynamic Symptoms fetched on-demand via Groq AI Repertory
  const [dynamicSymptoms, setDynamicSymptoms] = useState<SymptomFilterItem[]>(() => {
    try {
      const saved = localStorage.getItem('materia_medica_dynamic_symptoms');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // All symptoms combined with preloaded catalog, guaranteed unique IDs
  const allSymptoms = useMemo(() => {
    const list = [...dynamicSymptoms, ...SYMPTOM_LIST];
    const seen = new Set<string>();
    return list.filter((s) => {
      if (!s || !s.id || seen.has(s.id)) return false;
      seen.add(s.id);
      return true;
    });
  }, [dynamicSymptoms]);

  // Groq AI Monograph & Repertory States
  const [isGroqLoading, setIsGroqLoading] = useState(false);
  const [groqLoadingMessage, setGroqLoadingMessage] = useState<string | null>(null);
  const [groqError, setGroqError] = useState<string | null>(null);
  const [isGroqKeyModalOpen, setIsGroqKeyModalOpen] = useState(false);
  const [groqKeyInput, setGroqKeyInput] = useState('');
  const [pendingGroqAction, setPendingGroqAction] = useState<(() => void) | null>(null);

  // Voice Search States
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState<string | null>(null);

  // Active Remedy Data - null by default (empty state first)
  const [activeRemedy, setActiveRemedy] = useState<MateriaMedicaRemedy | null>(null);

  // UI States
  const [copied, setCopied] = useState(false);
  const [addedToBill, setAddedToBill] = useState(false);

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

  // Mode 1: Filtered medicines (Only active in medicine mode)
  const filteredMatches = useMemo(() => {
    if (searchMode !== 'medicine') return [];
    const q = searchQuery.trim().toLowerCase();

    return masterRemedies.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;
      const matchesName = item.name.toLowerCase().includes(q);
      const matchesBn = item.nameBn.toLowerCase().includes(q);
      const matchesCommon = item.commonName.toLowerCase().includes(q);
      const matchesAlias = item.aliases.some((a) => a.toLowerCase().includes(q));
      return matchesName || matchesBn || matchesCommon || matchesAlias;
    });
  }, [masterRemedies, searchQuery, searchMode, selectedCategory]);

  // Mode 2: Filtered organs (Only active in organ mode)
  const filteredOrgans = useMemo(() => {
    if (searchMode !== 'organ') return [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return ORGAN_LIST;

    return ORGAN_LIST.filter((org) => {
      const matchesName = org.nameEn.toLowerCase().includes(q);
      const matchesBn = org.nameBn.toLowerCase().includes(q);
      const matchesDescEn = org.descriptionEn.toLowerCase().includes(q);
      const matchesDescBn = org.descriptionBn.toLowerCase().includes(q);
      const matchesKeywords = org.keywords.some((k) => k.toLowerCase().includes(q));
      return matchesName || matchesBn || matchesDescEn || matchesDescBn || matchesKeywords;
    });
  }, [searchQuery, searchMode]);

  // Mode 3: Filtered symptoms (Only active in symptom mode, includes dynamic AI symptoms)
  const filteredSymptoms = useMemo(() => {
    if (searchMode !== 'symptom') return [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allSymptoms;

    return allSymptoms.filter((sym) => {
      const matchesName = sym.nameEn.toLowerCase().includes(q);
      const matchesBn = sym.nameBn.toLowerCase().includes(q);
      const matchesDefEn = sym.definitionEn.toLowerCase().includes(q);
      const matchesDefBn = sym.definitionBn.toLowerCase().includes(q);
      const matchesKeywords = sym.keywords.some((k) => k.toLowerCase().includes(q));
      return matchesName || matchesBn || matchesDefEn || matchesDefBn || matchesKeywords;
    });
  }, [searchQuery, searchMode, allSymptoms]);

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

  // Check inventory reactively whenever active remedy or inventory updates
  const inventoryMatch = useMemo(() => {
    if (!activeRemedy) return null;
    const res = checkStock(activeRemedy.latinName);
    return {
      found: res.found,
      inStock: res.inStock,
      name: res.matchedItem?.medicine_name || activeRemedy.latinName,
      stock: res.current_stock,
      rack: res.rack_location || 'General Shelf'
    };
  }, [activeRemedy, checkStock, inventoryList]);

  // Tab mode switcher: strictly resets active remedy and all selections
  const handleSwitchTab = (mode: 'medicine' | 'organ' | 'symptom') => {
    setSearchMode(mode);
    setSearchQuery('');
    setIsDropdownOpen(false);
    setActiveRemedy(null);
    setSelectedRemedyId(null);
    setHighlightedIndex(0);
    setSelectedOrgan(null);
    setSelectedSymptom(null);
    setGroqError(null);
  };

  // Select an organ: resets active remedy to show dedicated Organ Clinical Repertory
  const handleSelectOrgan = (organId: string | null) => {
    setSelectedOrgan(organId);
    setActiveRemedy(null);
    setSelectedRemedyId(null);
    setSearchQuery('');
    setIsDropdownOpen(false);
  };

  // Select a symptom: resets active remedy to show dedicated Clinical Indication Guide
  const handleSelectSymptom = (symptomId: string | null) => {
    setSelectedSymptom(symptomId);
    setActiveRemedy(null);
    setSelectedRemedyId(null);
    setSearchQuery('');
    setIsDropdownOpen(false);
  };

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

  // Fetch authentic Boericke Monograph via Groq AI
  const handleFetchMedicineMonographViaGroq = async (remedyName: string) => {
    const cleanName = remedyName.trim();
    if (!cleanName) return;

    const apiKey = getGroqApiKey();
    if (!apiKey) {
      setGroqKeyInput(getGroqApiKey());
      setPendingGroqAction(() => () => handleFetchMedicineMonographViaGroq(cleanName));
      setIsGroqKeyModalOpen(true);
      return;
    }

    setIsGroqLoading(true);
    setGroqLoadingMessage(`Fetching Authentic Boericke Monograph for "${cleanName}" via Groq AI...`);
    setGroqError(null);

    try {
      const remedy = await fetchAuthenticBoerickeMonographViaGroq(cleanName, apiKey);

      // Persist to custom chamber storage so it's instantly cached offline
      const customRecord: CustomMateriaMedicaRecord = {
        id: remedy.id,
        name: remedy.latinName,
        bengali_name: remedy.nameBn,
        brand: 'Boericke Classical Proving',
        category: remedy.category || 'dilution',
        sphere_of_action: remedy.sphereOfActionEn,
        clinical_indications: remedy.primaryIndications,
        keynotes: remedy.guidingKeynotes,
        dosage: remedy.dosageGuidelines || '3-5 drops in water',
        modalities: {
          worse: remedy.modalities.worseEn,
          better: remedy.modalities.betterEn
        },
        created_at: new Date().toISOString()
      };

      await saveCustomRemedy(customRecord);
      setCustomRemedies((prev) => [customRecord, ...prev.filter((r) => r.id !== customRecord.id)]);

      setActiveRemedy(remedy);
      setSelectedRemedyId(remedy.id);
      setSearchQuery(remedy.latinName);
      setIsDropdownOpen(false);
      setExtendedTreatise(null);
      setSaveSuccessMsg(`Authentic Boericke monograph for '${remedy.latinName}' loaded and saved.`);
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Failed to fetch Boericke monograph via Groq:', err);
      setGroqError(err?.message || 'Failed to fetch monograph via Groq AI. Please check your network or API key.');
    } finally {
      setIsGroqLoading(false);
      setGroqLoadingMessage(null);
    }
  };

  // Fetch symptom differentials via Groq AI using Kent & Boericke
  const handleFetchSymptomDifferentialsViaGroq = async (symptomQuery: string) => {
    const cleanQuery = symptomQuery.trim();
    if (!cleanQuery) return;

    const apiKey = getGroqApiKey();
    if (!apiKey) {
      setGroqKeyInput(getGroqApiKey());
      setPendingGroqAction(() => () => handleFetchSymptomDifferentialsViaGroq(cleanQuery));
      setIsGroqKeyModalOpen(true);
      return;
    }

    setIsGroqLoading(true);
    setGroqLoadingMessage(`Consulting Kent's Repertory & Boericke Materia Medica for "${cleanQuery}" via Groq AI...`);
    setGroqError(null);

    try {
      const symptomItem = await fetchSymptomDifferentialsViaGroq(cleanQuery, apiKey);

      // Save to dynamic symptoms state and localStorage
      setDynamicSymptoms((prev) => {
        const updated = [symptomItem, ...prev.filter((s) => s.id !== symptomItem.id)];
        try {
          localStorage.setItem('materia_medica_dynamic_symptoms', JSON.stringify(updated.slice(0, 30)));
        } catch {
          // ignore
        }
        return updated;
      });

      // Switch view to dedicated Clinical Indication Guide
      setSelectedSymptom(symptomItem.id);
      setActiveRemedy(null);
      setSelectedRemedyId(null);
      setSearchQuery('');
      setIsDropdownOpen(false);
    } catch (err: any) {
      console.error('Failed to fetch symptom differentials via Groq:', err);
      setGroqError(err?.message || 'Failed to repertorize symptom via Groq AI. Please check your network or API key.');
    } finally {
      setIsGroqLoading(false);
      setGroqLoadingMessage(null);
    }
  };

  // Select a remedy directly by its database ID or name
  const handleSelectRemedyById = (id: string, nameFallback?: string) => {
    const cleanId = id.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const match = masterRemedies.find(
      (r) =>
        r.id === id ||
        r.id === cleanId ||
        r.name.toLowerCase() === id.toLowerCase() ||
        (nameFallback && r.name.toLowerCase() === nameFallback.toLowerCase())
    );

    if (match) {
      handleSelectRemedy(match);
      return;
    }

    if (TOP_MATERIA_MEDICA_DATABASE[id] || TOP_MATERIA_MEDICA_DATABASE[cleanId]) {
      const full = TOP_MATERIA_MEDICA_DATABASE[id] || TOP_MATERIA_MEDICA_DATABASE[cleanId];
      setActiveRemedy(full);
      setSelectedRemedyId(full.id);
      setSearchQuery(full.latinName);
      setIsDropdownOpen(false);
      setExtendedTreatise(null);
      return;
    }

    // If Groq key is available, fetch authentic monograph, else fallback to synthesis
    const apiKey = getGroqApiKey();
    if (apiKey) {
      handleFetchMedicineMonographViaGroq(nameFallback || id);
    } else {
      const synthetic = getOrSynthesizeMateriaMedica({
        id: cleanId,
        name: nameFallback || id.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
        nameBn: nameFallback || id,
        commonName: 'Homoeopathic Specific',
        category: 'dilution',
        aliases: []
      });
      setActiveRemedy(synthetic);
      setSelectedRemedyId(synthetic.id);
      setSearchQuery(synthetic.latinName);
      setIsDropdownOpen(false);
      setExtendedTreatise(null);
    }
  };

  // View full monograph from within organ or symptom views
  const handleViewFullMonograph = (remedyId: string, nameFallback?: string) => {
    handleSelectRemedyById(remedyId, nameFallback);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle saving the user's Groq API Key
  const handleSaveGroqKey = () => {
    const key = groqKeyInput.trim();
    setGroqApiKey(key);
    setIsGroqKeyModalOpen(false);
    setGroqError(null);
    if (key && pendingGroqAction) {
      const action = pendingGroqAction;
      setPendingGroqAction(null);
      setTimeout(() => action(), 100);
    }
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

          // Mode-specific voice matching
          const lower = transcript.toLowerCase();
          if (searchMode === 'organ') {
            const matchOrg = ORGAN_LIST.find(
              (o) =>
                o.nameEn.toLowerCase().includes(lower) ||
                o.nameBn.toLowerCase().includes(lower) ||
                o.keywords.some((k) => k.toLowerCase().includes(lower))
            );
            if (matchOrg) {
              handleSelectOrgan(matchOrg.id);
            }
          } else if (searchMode === 'symptom') {
            const matchSym = SYMPTOM_LIST.find(
              (s) =>
                s.nameEn.toLowerCase().includes(lower) ||
                s.nameBn.toLowerCase().includes(lower) ||
                s.keywords.some((k) => k.toLowerCase().includes(lower))
            );
            if (matchSym) {
              handleSelectSymptom(matchSym.id);
            }
          } else {
            const match = masterRemedies.find(
              (r) =>
                r.name.toLowerCase().includes(lower) ||
                r.nameBn.toLowerCase().includes(lower) ||
                r.aliases.some((a) => a.toLowerCase().includes(lower))
            );
            if (match) {
              handleSelectRemedy(match);
            }
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

          {activeRemedy && (
            <>
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
            </>
          )}
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
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* TRIPLE SEARCH MODE CONTROLLER (MEDICINE / ORGAN / SYMPTOM) */}
        <div>
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
            <button
              type="button"
              onClick={() => handleSwitchTab('medicine')}
              className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                searchMode === 'medicine'
                  ? 'bg-[#1B4332] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
              }`}
            >
              <Pill className="w-4 h-4" />
              <span>💊 By Medicine Name (ঔষধের নাম)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchTab('organ')}
              className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                searchMode === 'organ'
                  ? 'bg-[#1B4332] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
              }`}
            >
              <Activity className="w-4 h-4 text-rose-400" />
              <span>🫀 By Body Organ / System (অঙ্গভিত্তিক)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchTab('symptom')}
              className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                searchMode === 'symptom'
                  ? 'bg-[#1B4332] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-sky-400" />
              <span>🩺 By Symptom / Indication (লক্ষণভিত্তিক)</span>
            </button>
          </div>
        </div>

        {/* MODE-SPECIFIC SUB-CONTROLS */}
        {searchMode === 'medicine' && (
          /* Category Pills */
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar animate-fade-in">
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
        )}

        {searchMode === 'organ' && (
          /* Quick Organ Filter Chips */
          <div className="space-y-1.5 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Select Anatomical Organ / System (নির্দিষ্ট শারীরিক অঙ্গ নির্বাচন করুন):
              </span>
              {selectedOrgan && (
                <button
                  type="button"
                  onClick={() => handleSelectOrgan(null)}
                  className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
                >
                  Show All Organs (সব অঙ্গ দেখুন)
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {ORGAN_LIST.map((org) => {
                const isSelected = selectedOrgan === org.id;
                return (
                  <button
                    key={org.id}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        handleSelectOrgan(null);
                      } else {
                        handleSelectOrgan(org.id);
                      }
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:border-emerald-300'
                    }`}
                  >
                    <span>{org.icon}</span>
                    <span>{org.nameEn.split('/')[0].trim()}</span>
                    <span className="text-[10px] opacity-80">({org.nameBn.split('/')[0].trim()})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {searchMode === 'symptom' && (
          /* Quick Symptom Filter Chips */
          <div className="space-y-1.5 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Select Clinical Indication / Condition (ক্লিনিক্যাল লক্ষণ নির্বাচন করুন):
              </span>
              {selectedSymptom && (
                <button
                  type="button"
                  onClick={() => handleSelectSymptom(null)}
                  className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
                >
                  Show All Symptoms (সব লক্ষণ দেখুন)
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {allSymptoms.slice(0, 16).map((sym) => {
                const isSelected = selectedSymptom === sym.id;
                return (
                  <button
                    key={sym.id}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        handleSelectSymptom(null);
                      } else {
                        handleSelectSymptom(sym.id);
                      }
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-slate-700 hover:border-sky-300'
                    }`}
                  >
                    <span>{sym.icon}</span>
                    <span>{sym.nameEn.split('&')[0].trim()}</span>
                    <span className="text-[10px] opacity-80">({sym.nameBn.split('ও')[0].trim()})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

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
                const activeListLength =
                  searchMode === 'medicine'
                    ? filteredMatches.length
                    : searchMode === 'organ'
                    ? filteredOrgans.length
                    : filteredSymptoms.length;

                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setHighlightedIndex((prev) => Math.min(prev + 1, Math.max(activeListLength - 1, 0)));
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setHighlightedIndex((prev) => Math.max(prev - 1, 0));
                } else if (e.key === 'Enter') {
                  e.preventDefault();
                  if (searchMode === 'medicine') {
                    if (filteredMatches[highlightedIndex]) {
                      handleSelectRemedy(filteredMatches[highlightedIndex]);
                    } else if (searchQuery.trim()) {
                      handleFetchMedicineMonographViaGroq(searchQuery.trim());
                    }
                  } else if (searchMode === 'organ' && filteredOrgans[highlightedIndex]) {
                    handleSelectOrgan(filteredOrgans[highlightedIndex].id);
                  } else if (searchMode === 'symptom') {
                    if (filteredSymptoms[highlightedIndex]) {
                      handleSelectSymptom(filteredSymptoms[highlightedIndex].id);
                    } else if (searchQuery.trim()) {
                      handleFetchSymptomDifferentialsViaGroq(searchQuery.trim());
                    }
                  }
                } else if (e.key === 'Escape') {
                  setIsDropdownOpen(false);
                }
              }}
              placeholder={
                searchMode === 'organ'
                  ? "Search organs or systems (e.g., 'Heart', 'হৃদপিণ্ড', 'Liver', 'Stomach', 'Joints', 'Skin', 'Spine')..."
                  : searchMode === 'symptom'
                  ? "Search symptoms or conditions (e.g., 'Sprain', 'মচকানো', 'Acidity', 'Migraine', 'Vomiting', 'Sciatica')..."
                  : "Search 500+ medicines by Latin, Bengali, or common name (e.g., 'Arnica', 'Nux Vomica', 'R41', 'আর্নিকা')..."
              }
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
                {searchMode === 'medicine'
                  ? `${filteredMatches.length} Found`
                  : searchMode === 'organ'
                  ? `${filteredOrgans.length} Organs`
                  : `${filteredSymptoms.length} Indications`}
              </span>
            </div>
          </div>

          {/* Autocomplete Dropdown Menu */}
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-full left-0 right-0 mt-2 max-h-80 overflow-y-auto rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl z-50 p-2 space-y-1"
            >
              {/* TAB 1: MEDICINE AUTOCOMPLETE */}
              {searchMode === 'medicine' && (
                filteredMatches.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400 space-y-3">
                    <div>
                      <p className="font-semibold text-slate-700 dark:text-slate-300">
                        কোনো ওষুধ খুঁজে পাওয়া যায়নি (No matching remedy found).
                      </p>
                      <p className="text-[11px] mt-0.5">
                        Try searching by common Latin name or Bengali spelling.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {searchQuery.trim() && (
                        <button
                          type="button"
                          onClick={() => handleFetchMedicineMonographViaGroq(searchQuery.trim())}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1B4332] text-white text-xs font-bold hover:bg-emerald-800 transition cursor-pointer shadow-xs"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-300" />
                          <span>Fetch Boericke Monograph for '{searchQuery}' via Groq AI</span>
                        </button>
                      )}

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
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                        <span>+ Custom Add Remedy</span>
                      </button>
                    </div>
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
                )
              )}

              {/* TAB 2: ORGAN AUTOCOMPLETE (NEVER SHOWS MEDICINE NAMES) */}
              {searchMode === 'organ' && (
                filteredOrgans.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400">
                    <p className="font-semibold text-slate-700 dark:text-slate-300">
                      কোনো অঙ্গ বা সিস্টেম খুঁজে পাওয়া যায়নি (No matching organ found).
                    </p>
                    <p className="text-[11px] mt-0.5">
                      Try searching 'Heart', 'হৃদপিণ্ড', 'Liver', 'যকৃৎ', 'Stomach', 'Joints', 'Skin', etc.
                    </p>
                  </div>
                ) : (
                  filteredOrgans.map((org, index) => {
                    const isHighlighted = highlightedIndex === index;
                    const isSelected = selectedOrgan === org.id;

                    return (
                      <button
                        key={org.id}
                        type="button"
                        onClick={() => handleSelectOrgan(org.id)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        className={`w-full p-2.5 rounded-xl text-left transition flex items-center justify-between gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 font-bold'
                            : isHighlighted
                            ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 flex items-center justify-center text-base shrink-0">
                            {org.icon}
                          </div>
                          <div className="truncate">
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-sm">{org.nameEn}</span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">({org.nameBn})</span>
                            </div>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                              {org.descriptionEn}
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300">
                            {org.primaryRemedies.length} Curated Remedies
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-rose-600 dark:text-rose-400" />}
                        </div>
                      </button>
                    );
                  })
                )
              )}

              {/* TAB 3: SYMPTOM AUTOCOMPLETE (NEVER SHOWS MEDICINE NAMES) */}
              {searchMode === 'symptom' && (
                filteredSymptoms.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400 space-y-3">
                    <div>
                      <p className="font-semibold text-slate-700 dark:text-slate-300">
                        কোনো ক্লিনিক্যাল লক্ষণ পাওয়া যায়নি (No matching symptom found).
                      </p>
                      <p className="text-[11px] mt-0.5">
                        Try searching 'Sprain', 'মচকানো', 'Acidity', 'বুকজ্বালা', 'Migraine', 'Vomiting', 'Sciatica', etc.
                      </p>
                    </div>

                    {searchQuery.trim() && (
                      <button
                        type="button"
                        onClick={() => handleFetchSymptomDifferentialsViaGroq(searchQuery.trim())}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold transition cursor-pointer shadow-xs"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-300" />
                        <span>Repertorize '{searchQuery}' via Groq AI (Kent & Boericke)</span>
                      </button>
                    )}
                  </div>
                ) : (
                  filteredSymptoms.map((sym, index) => {
                    const isHighlighted = highlightedIndex === index;
                    const isSelected = selectedSymptom === sym.id;

                    return (
                      <button
                        key={sym.id}
                        type="button"
                        onClick={() => handleSelectSymptom(sym.id)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        className={`w-full p-2.5 rounded-xl text-left transition flex items-center justify-between gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-900 dark:text-sky-200 font-bold'
                            : isHighlighted
                            ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 flex items-center justify-center text-base shrink-0">
                            {sym.icon}
                          </div>
                          <div className="truncate">
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-sm">{sym.nameEn}</span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">({sym.nameBn})</span>
                            </div>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                              {sym.definitionEn}
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-300">
                            {sym.differentials.length} Differentials
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-sky-600 dark:text-sky-400" />}
                        </div>
                      </button>
                    );
                  })
                )
              )}
            </div>
          )}
        </div>

        {/* MODE-SPECIFIC QUICK RECOMMENDATION CHIPS */}
        {searchMode === 'medicine' && (
          <div>
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">
              Quick Polycrests & Specifics (বহুল ব্যবহৃত ঔষধসমূহ):
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {popularRemedies.map((pop) => (
                <button
                  key={pop.id}
                  type="button"
                  onClick={() => handleSelectRemedyById(pop.id)}
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
        )}

        {searchMode === 'organ' && (
          <div>
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">
              Anatomical Systems & Organ Affinities (অঙ্গভিত্তিক দ্রুত বাছাই):
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {ORGAN_LIST.map((org) => {
                const isSelected = selectedOrgan === org.id;
                return (
                  <button
                    key={org.id}
                    type="button"
                    onClick={() => handleSelectOrgan(org.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-slate-700 hover:border-rose-300'
                    }`}
                  >
                    <span>{org.icon}</span>
                    <span>{org.nameEn.split('/')[0].trim()}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">({org.nameBn.split('/')[0].trim()})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {searchMode === 'symptom' && (
          <div>
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">
              Key Clinical Conditions & Symptoms (লক্ষণভিত্তিক দ্রুত নির্দেশিকা):
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {allSymptoms.slice(0, 16).map((sym) => {
                const isSelected = selectedSymptom === sym.id;
                return (
                  <button
                    key={sym.id}
                    type="button"
                    onClick={() => handleSelectSymptom(sym.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-slate-700 hover:border-sky-300'
                    }`}
                  >
                    <span>{sym.icon}</span>
                    <span>{sym.nameEn.split('&')[0].trim()}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">({sym.nameBn.split('ও')[0].trim()})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Groq AI Loading State Banner */}
      {isGroqLoading && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-900 via-[#1B4332] to-[#2D6A4F] text-white shadow-lg flex items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 shrink-0">
              <RefreshCw className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold flex items-center gap-2">
                <span>Groq High-Speed LPU Inference Active</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-400 text-slate-950 font-black uppercase tracking-wider">
                  Boericke & Kent
                </span>
              </h4>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                {groqLoadingMessage || 'Querying authentic classical homeopathic monographs...'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Groq AI Error / Missing Key Banner */}
      {groqError && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm animate-fade-in shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="font-medium">{groqError}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setGroqKeyInput(getGroqApiKey());
                setIsGroqKeyModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Configure Groq Key</span>
            </button>
            <button
              type="button"
              onClick={() => setGroqError(null)}
              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/50 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* DETAILED MATERIA MEDICA PROFILE SHEET */}
      {activeRemedy && (
        <div className="space-y-6 animate-fade-in print:space-y-4">
          {/* Contextual Back Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 px-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
            <button
              type="button"
              onClick={() => {
                setActiveRemedy(null);
                setSelectedRemedyId(null);
              }}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-[#1B4332] dark:hover:text-emerald-400 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              {searchMode === 'organ' && selectedOrgan ? (
                <span>Back to {ORGAN_LIST.find((o) => o.id === selectedOrgan)?.nameEn || 'Organ Clinical Repertory'}</span>
              ) : searchMode === 'symptom' && selectedSymptom ? (
                <span>Back to {allSymptoms.find((s) => s.id === selectedSymptom)?.nameEn || 'Clinical Indication Guide'}</span>
              ) : (
                <span>Back to Search & Explorer Overview (সংক্ষিপ্ত সূচী)</span>
              )}
            </button>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Mode:
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                {searchMode === 'organ' ? 'Body Organ / System' : searchMode === 'symptom' ? 'Clinical Indication' : 'Medicine Name'}
              </span>
            </div>
          </div>

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
                {onNavigateToInventory && (
                  <button
                    type="button"
                    onClick={() => onNavigateToInventory(activeRemedy.latinName)}
                    className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white/15 hover:bg-white/25 text-white flex items-center gap-1.5 transition cursor-pointer border border-white/20 shadow-xs"
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
                  {inventoryMatch.stock > 0 ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-400 text-slate-950 shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse" />
                      <span>✔ In Stock: {inventoryMatch.stock} units • Rack: {inventoryMatch.rack}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-rose-400 text-slate-950 shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-slate-950" />
                      <span>✕ Out of Stock / চেম্বার স্টকে নেই</span>
                    </span>
                  )}
                  <span className="font-semibold text-emerald-100 hidden sm:inline">
                    (Live Chamber Inventory)
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

      {/* DEDICATED RESULTS VIEWS WHEN NO SINGLE REMEDY IS SELECTED */}
      {!activeRemedy && (
        <div className="space-y-6 animate-fade-in">
          {/* ========================================================================= */}
          {/* MODE 2: ORGAN & SYSTEM CLINICAL REPERTORY VIEW                            */}
          {/* ========================================================================= */}
          {searchMode === 'organ' && (
            selectedOrgan ? (
              /* SPECIFIC ORGAN SELECTED: SHOW DEDICATED CLINICAL REPERTORY */
              (() => {
                const activeOrgan = ORGAN_LIST.find((o) => o.id === selectedOrgan) || ORGAN_LIST[0];
                return (
                  <div className="space-y-6">
                    {/* Organ Banner */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-rose-900 via-rose-950 to-slate-900 text-white shadow-xl shadow-rose-950/20 relative overflow-hidden border border-rose-800/40">
                      <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
                      
                      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl shrink-0 border border-white/15 shadow-inner">
                            {activeOrgan.icon}
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-rose-400 text-slate-950">
                                Organ Clinical Repertory
                              </span>
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-rose-200 border border-white/10">
                                {activeOrgan.primaryRemedies.length} Curated Specifics
                              </span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                              {activeOrgan.nameEn}
                              <span className="text-lg sm:text-xl font-bold text-rose-200 ml-2 font-bengali">
                                ({activeOrgan.nameBn})
                              </span>
                            </h2>
                            <p className="text-xs sm:text-sm text-rose-100/90 max-w-3xl leading-relaxed">
                              {activeOrgan.descriptionEn}
                            </p>
                            <p className="text-xs text-rose-300 font-bengali">
                              {activeOrgan.descriptionBn}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setSelectedOrgan(null)}
                            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/20 cursor-pointer flex items-center gap-1.5"
                          >
                            <span>Browse All Organs (সব অঙ্গ)</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Curated Primary Remedies for this Organ */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                          <Activity className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                          <span>Primary Remedies with Specific Tissue Affinity</span>
                        </h3>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Click any card to inspect full Materia Medica monograph
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeOrgan.primaryRemedies.map((rem) => {
                          const stockRes = checkStock(rem.name, rem.recommendedPotency);
                          return (
                            <div
                              key={rem.remedyId}
                              className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 hover:border-rose-300 dark:hover:border-rose-700 transition shadow-xs hover:shadow-md flex flex-col justify-between space-y-4 group"
                            >
                              <div className="space-y-3">
                                {/* Header: Name + Category + Stock */}
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition">
                                      {rem.name}
                                    </h4>
                                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-bengali">
                                      {rem.nameBn}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                                    <span
                                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${
                                        rem.category === 'mother_tincture'
                                          ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300'
                                          : rem.category === 'biochemic'
                                          ? 'bg-sky-100 text-sky-900 dark:bg-sky-950/80 dark:text-sky-300'
                                          : rem.category === 'patent'
                                          ? 'bg-purple-100 text-purple-900 dark:bg-purple-950/80 dark:text-purple-300'
                                          : 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300'
                                      }`}
                                    >
                                      {rem.category.replace('_', ' ')}
                                    </span>
                                    {stockRes.inStock && stockRes.current_stock > 0 ? (
                                      <span
                                        className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800"
                                        title={`Rack: ${stockRes.rack_location || 'General Shelf'}`}
                                      >
                                        🟢 {stockRes.current_stock} in stock
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-800">
                                        🔴 Out of stock
                                      </span>
                                    )}
                                  </div>
                                </div>

                              {/* Specific Action */}
                              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
                                  Specific Organ Action (অঙ্গে ক্রিয়া):
                                </span>
                                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                                  {rem.specificActionEn}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bengali">
                                  {rem.specificActionBn}
                                </p>
                              </div>

                              {/* Differentiator & Potency */}
                              <div className="space-y-2 text-xs">
                                <div className="flex items-start gap-2">
                                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                  <div>
                                    <span className="font-bold text-slate-900 dark:text-slate-200">Keynote: </span>
                                    <span className="text-slate-600 dark:text-slate-400">{rem.keyDifferentiator}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Pill className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <div>
                                    <span className="font-bold text-slate-900 dark:text-slate-200">Potency: </span>
                                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{rem.recommendedPotency}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* View Monograph Trigger */}
                            <button
                              type="button"
                              onClick={() => handleViewFullMonograph(rem.remedyId, rem.name)}
                              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-[#1B4332] dark:bg-slate-700 hover:text-white dark:hover:bg-[#1B4332] text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <span>View Full Monograph (সম্পূর্ণ মনোগ্রাফ)</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              /* NO ORGAN SELECTED YET: SHOW DIRECTORY OF ALL 10 ORGANS */
              <div className="space-y-6">
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-center max-w-3xl mx-auto space-y-2.5">
                  <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto text-2xl">
                    <Activity className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    Organ & System Clinical Repertory (অঙ্গভিত্তিক ক্লিনিক্যাল রেপার্টরি)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    Select any anatomical organ or body system below to compare primary specifics, clinical tissue affinities, and key differential monographs.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {ORGAN_LIST.map((org) => (
                    <button
                      key={org.id}
                      type="button"
                      onClick={() => handleSelectOrgan(org.id)}
                      className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-rose-400 dark:hover:border-rose-600 hover:shadow-md transition text-left space-y-3 cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-3xl">{org.icon}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                          {org.primaryRemedies.length} Specifics
                        </span>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition text-base">
                          {org.nameEn}
                        </h4>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-bengali">
                          {org.nameBn}
                        </p>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {org.descriptionEn}
                      </p>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-rose-600 dark:text-rose-400">
                        <span>Explore Repertory</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )
          )}

          {/* ========================================================================= */}
          {/* MODE 3: SYMPTOM & INDICATION DIFFERENTIAL GUIDE VIEW                      */}
          {/* ========================================================================= */}
          {searchMode === 'symptom' && (
            selectedSymptom ? (
              /* SPECIFIC SYMPTOM SELECTED: SHOW DEDICATED DIFFERENTIAL GUIDE */
              (() => {
                const activeSymptom = allSymptoms.find((s) => s.id === selectedSymptom) || allSymptoms[0];
                return (
                  <div className="space-y-6">
                    {/* Symptom Banner */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-sky-900 via-sky-950 to-slate-900 text-white shadow-xl shadow-sky-950/20 relative overflow-hidden border border-sky-800/40">
                      <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

                      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl shrink-0 border border-white/15 shadow-inner">
                            {activeSymptom.icon}
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-sky-300 text-slate-950">
                                Clinical Indication Guide
                              </span>
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-sky-200 border border-white/10">
                                {activeSymptom.differentials.length} Differential Remedies
                              </span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                              {activeSymptom.nameEn}
                              <span className="text-lg sm:text-xl font-bold text-sky-200 ml-2 font-bengali">
                                ({activeSymptom.nameBn})
                              </span>
                            </h2>
                            <p className="text-xs sm:text-sm text-sky-100/90 max-w-3xl leading-relaxed">
                              {activeSymptom.definitionEn}
                            </p>
                            <p className="text-xs text-sky-300 font-bengali">
                              {activeSymptom.definitionBn}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setSelectedSymptom(null)}
                            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/20 cursor-pointer flex items-center gap-1.5"
                          >
                            <span>Browse All Symptoms (সব লক্ষণ)</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Differential Remedy Comparison Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                          <Stethoscope className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                          <span>Differential Remedy Comparison & Keynotes</span>
                        </h3>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Differentiate by acute modality and symptom character
                        </span>
                      </div>

                      {/* Desktop / Tablet Comparison Table */}
                      <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xs">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-extrabold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                            <tr>
                              <th className="py-3.5 px-4">Remedy (ঔষধ)</th>
                              <th className="py-3.5 px-4">Keynote Indication (লক্ষণ নির্দেশিকা)</th>
                              <th className="py-3.5 px-4">Modalities (হ্রাস-বৃদ্ধি)</th>
                              <th className="py-3.5 px-4">Differentiating Feature (স্বাতন্ত্র্য)</th>
                              <th className="py-3.5 px-4">Potency (মাত্রা)</th>
                              <th className="py-3.5 px-4 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                            {activeSymptom.differentials.map((diff) => {
                              const diffStock = checkStock(diff.name, diff.potency);
                              return (
                                <tr key={diff.remedyId} className="hover:bg-sky-50/50 dark:hover:bg-slate-800/50 transition">
                                  <td className="py-4 px-4 align-top">
                                    <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                                      {diff.name}
                                    </div>
                                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-bengali">
                                      {diff.nameBn}
                                    </div>
                                    <div className="mt-1.5">
                                      {diffStock.inStock && diffStock.current_stock > 0 ? (
                                        <span
                                          className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800"
                                          title={`Rack: ${diffStock.rack_location || 'General Shelf'}`}
                                        >
                                          🟢 In Stock ({diffStock.current_stock})
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-800">
                                          🔴 Out of stock
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                <td className="py-4 px-4 align-top max-w-xs leading-relaxed">
                                  <div className="font-medium text-slate-900 dark:text-slate-200">
                                    {diff.keynoteEn}
                                  </div>
                                  <div className="text-[11px] text-slate-500 font-bengali mt-0.5">
                                    {diff.keynoteBn}
                                  </div>
                                </td>
                                <td className="py-4 px-4 align-top max-w-xs leading-relaxed">
                                  <span className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-medium block">
                                    {diff.modalityEn}
                                  </span>
                                  <span className="text-[10px] text-slate-500 font-bengali mt-0.5 block">
                                    {diff.modalityBn}
                                  </span>
                                </td>
                                <td className="py-4 px-4 align-top max-w-xs leading-relaxed">
                                  <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-medium border border-amber-200/60 dark:border-amber-900/40">
                                    {diff.differentiatingFeature}
                                  </div>
                                </td>
                                <td className="py-4 px-4 align-top whitespace-nowrap">
                                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                                    {diff.potency}
                                  </span>
                                </td>
                                <td className="py-4 px-4 align-top text-right whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => handleViewFullMonograph(diff.remedyId, diff.name)}
                                    className="px-3 py-1.5 rounded-xl bg-[#1B4332] text-white hover:bg-emerald-800 text-xs font-bold transition inline-flex items-center gap-1 cursor-pointer shadow-xs"
                                  >
                                    <span>Monograph</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile Stacked Differential Cards */}
                      <div className="md:hidden space-y-3">
                        {activeSymptom.differentials.map((diff) => {
                          const diffStock = checkStock(diff.name, diff.potency);
                          return (
                            <div
                              key={diff.remedyId}
                              className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                                    {diff.name}
                                  </h4>
                                  <p className="text-xs text-slate-500 font-bengali">{diff.nameBn}</p>
                                  <div className="mt-1">
                                    {diffStock.inStock && diffStock.current_stock > 0 ? (
                                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                                        🟢 In Stock ({diffStock.current_stock})
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-800">
                                        🔴 Out of stock
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs">
                                  {diff.potency}
                                </span>
                              </div>

                            <div className="space-y-1.5 text-xs">
                              <p className="text-slate-800 dark:text-slate-200 font-medium">
                                <span className="font-bold">Indication: </span>
                                {diff.keynoteEn}
                              </p>
                              <p className="text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 p-2 rounded-lg font-medium">
                                <span className="font-bold">Modalities: </span>
                                {diff.modalityEn}
                              </p>
                              <p className="text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-lg font-medium">
                                <span className="font-bold">Differentiator: </span>
                                {diff.differentiatingFeature}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleViewFullMonograph(diff.remedyId, diff.name)}
                              className="w-full py-2 px-3 rounded-xl bg-[#1B4332] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <span>View Full Monograph</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              /* NO SYMPTOM SELECTED YET: SHOW DIRECTORY OF SYMPTOMS OR GROQ ON-DEMAND */
              <div className="space-y-6">
                {searchQuery.trim() && filteredSymptoms.length === 0 ? (
                  <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/70 border-2 border-dashed border-sky-300 dark:border-sky-800 text-center max-w-2xl mx-auto space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center mx-auto text-2xl">
                      <Sparkles className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                        Repertorize '{searchQuery.trim()}' with Groq AI
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                        This clinical symptom is not currently in the preloaded repertory index. Groq AI can synthesize authentic Kent & Boericke rubrics, modalities, and key differentials instantly.
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={isGroqLoading}
                      onClick={() => handleFetchSymptomDifferentialsViaGroq(searchQuery.trim())}
                      className="px-5 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold inline-flex items-center gap-2 transition shadow-md shadow-sky-900/20 cursor-pointer disabled:opacity-50"
                    >
                      <Zap className="w-4 h-4 text-amber-300" />
                      <span>Repertorize '{searchQuery.trim()}' Now (Kent & Boericke)</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-center max-w-3xl mx-auto space-y-2.5">
                    <div className="w-14 h-14 rounded-2xl bg-sky-100 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto text-2xl">
                      <Stethoscope className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      Clinical Indication & Keynote Guide (লক্ষণভিত্তিক ক্লিনিক্যাল নির্দেশিকা)
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      Select any clinical indication or keynote condition below to compare acute differentials, modalities, and characteristic symptoms.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {allSymptoms.map((sym) => (
                    <button
                      key={sym.id}
                      type="button"
                      onClick={() => handleSelectSymptom(sym.id)}
                      className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-sky-400 dark:hover:border-sky-600 hover:shadow-md transition text-left space-y-3 cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-3xl">{sym.icon}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-sky-50 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                          {sym.differentials.length} Differentials
                        </span>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition text-base">
                          {sym.nameEn}
                        </h4>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-bengali">
                          {sym.nameBn}
                        </p>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {sym.definitionEn}
                      </p>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-sky-600 dark:text-sky-400">
                        <span>Compare Differentials</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )
          )}

          {/* ========================================================================= */}
          {/* MODE 1: MEDICINE SEARCH EMPTY STATE WELCOMING CONTAINER                   */}
          {/* ========================================================================= */}
          {searchMode === 'medicine' && (
            <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-8">
              {/* Hero Emblem & Titles */}
              <div className="max-w-2xl mx-auto space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center mx-auto text-[#1B4332] dark:text-emerald-300 shadow-sm">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Materia Medica & Repertory Explorer
                </h2>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  Search by Medicine Name, Body Organ, or Clinical Symptoms above, or pick from the quick pills to view comprehensive clinical monographs.
                </p>
                <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300/90 font-medium font-bengali">
                  ওষুধের নাম, শারীরিক অঙ্গ বা ক্লিনিক্যাল লক্ষণ দিয়ে উপরে সার্চ করুন অথবা নিচের যেকোনো বোতামে ক্লিক করে বিস্তারিত মনোগ্রাফ দেখুন।
                </p>
              </div>

              {/* 3 Quick Launch Guidance Sections */}
              <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                {/* 1. By Medicine Name */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[#1B4332] dark:text-emerald-300 font-bold text-sm">
                      <Pill className="w-4 h-4" />
                      <span>Popular Remedies (ঔষধসমূহ)</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Select a classical polycrest remedy to open its monograph immediately:
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'arnica-montana', name: 'Arnica Mont', bn: 'আর্নিকা' },
                      { id: 'nux-vomica', name: 'Nux Vomica', bn: 'নাক্স ভমিকা' },
                      { id: 'belladonna', name: 'Belladonna', bn: 'বেলেডোনা' },
                      { id: 'rhus-toxicodendron', name: 'Rhus Tox', bn: 'রাস টক্স' },
                      { id: 'bryonia-alba', name: 'Bryonia', bn: 'ব্রায়োনিয়া' },
                      { id: 'arsenicum-album', name: 'Arsenic Alb', bn: 'আর্সেনিক' },
                      { id: 'lycopodium-clavatum', name: 'Lycopodium', bn: 'লাইকোপোডিয়াম' },
                      { id: 'berberis-vulgaris', name: 'Berberis Vulg Q', bn: 'বার্বারিস' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectRemedyById(item.id)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-600 hover:border-emerald-400 transition cursor-pointer"
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. By Organ & System */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
                      <Activity className="w-4 h-4" />
                      <span>By Organ / System (অঙ্গভিত্তিক)</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Target remedies with primary tissue affinity for specific body systems:
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {ORGAN_LIST.slice(0, 8).map((org) => (
                      <button
                        key={org.id}
                        type="button"
                        onClick={() => {
                          handleSwitchTab('organ');
                          handleSelectOrgan(org.id);
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-rose-50 dark:hover:bg-slate-600 hover:border-rose-400 transition cursor-pointer flex items-center gap-1"
                      >
                        <span>{org.icon}</span>
                        <span>{org.nameEn.split('/')[0].trim()}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. By Symptom & Indication */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-sm">
                      <Stethoscope className="w-4 h-4" />
                      <span>By Clinical Keynote (লক্ষণভিত্তিক)</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Quickly repertorize and compare differential keynotes for common conditions:
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {SYMPTOM_LIST.slice(0, 8).map((sym) => (
                      <button
                        key={sym.id}
                        type="button"
                        onClick={() => {
                          handleSwitchTab('symptom');
                          handleSelectSymptom(sym.id);
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-600 hover:border-sky-400 transition cursor-pointer flex items-center gap-1"
                      >
                        <span>{sym.icon}</span>
                        <span>{sym.nameEn.split('&')[0].trim()}</span>
                      </button>
                    ))}
                  </div>
                </div>
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

      {/* Groq Cloud API Key Modal */}
      {isGroqKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Configure Groq AI API Key
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    High-speed Boericke & Kent inference engine
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsGroqKeyModalOpen(false);
                  setPendingGroqAction(null);
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Groq API Key (gsk_...):
              </label>
              <input
                type="password"
                value={groqKeyInput}
                onChange={(e) => setGroqKeyInput(e.target.value)}
                placeholder="Enter gsk_..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Your key is stored securely in your local browser cache and used exclusively for Boericke monographs and symptom differentials. Free keys available at{' '}
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-600 dark:text-sky-400 font-bold hover:underline"
                >
                  console.groq.com/keys
                </a>
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              {hasGroqApiKey() ? (
                <button
                  type="button"
                  onClick={() => {
                    setGroqApiKey('');
                    setGroqKeyInput('');
                    setIsGroqKeyModalOpen(false);
                  }}
                  className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold cursor-pointer"
                >
                  Clear Key
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsGroqKeyModalOpen(false);
                    setPendingGroqAction(null);
                  }}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!groqKeyInput.trim()}
                  onClick={handleSaveGroqKey}
                  className="px-4 py-2 rounded-xl bg-[#1B4332] hover:bg-emerald-800 text-white text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
                >
                  Save & Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
