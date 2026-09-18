import React, { useState, useEffect } from 'react';
import {
  Globe,
  Building2,
  DownloadCloud,
  Sparkles,
  Mic,
  MicOff,
  Search,
  CheckSquare,
  Square,
  Edit2,
  Check,
  X,
  Database,
  RefreshCw,
  ExternalLink,
  Layers,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import {
  ExtractedCatalogItem,
  CatalogImportResult,
  importCompanyCatalog,
  convertCatalogItemToCustomRecord
} from '../services/catalogImportService';
import {
  CustomMateriaMedicaRecord,
  saveBulkCustomRemedies
} from '../services/customMateriaMedicaService';

interface CompanyCatalogImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (importedRecords: CustomMateriaMedicaRecord[]) => void;
}

export const CompanyCatalogImportModal: React.FC<CompanyCatalogImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess
}) => {
  const [mode, setMode] = useState<'company' | 'url'>('company');
  const [companyInput, setCompanyInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Extracted Results State
  const [result, setResult] = useState<CatalogImportResult | null>(null);
  const [items, setItems] = useState<ExtractedCatalogItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [previewFilter, setPreviewFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'patent' | 'mother_tincture' | 'biochemic' | 'dilution'>('all');

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    name: string;
    bengaliName: string;
    category: 'dilution' | 'mother_tincture' | 'biochemic' | 'patent';
    indications: string;
    dosage: string;
  }>({
    name: '',
    bengaliName: '',
    category: 'patent',
    indications: '',
    dosage: ''
  });

  // Speech Recognition for Voice Input
  useEffect(() => {
    let recognition: any = null;

    if (isListening && typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'bn-BD'; // supports Bengali & English

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setCompanyInput(transcript);
            setErrorMsg(null);
          }
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        try {
          recognition.start();
        } catch (err) {
          setIsListening(false);
        }
      } else {
        setIsListening(false);
      }
    }

    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch {}
      }
    };
  }, [isListening]);

  if (!isOpen) return null;

  // Handle Catalog Extraction
  const handleExtractCatalog = async (overrideCompany?: string) => {
    const targetComp = overrideCompany || companyInput;
    if (mode === 'company' && !targetComp.trim()) {
      setErrorMsg('অনুগ্রহ করে কোম্পানির নাম টাইপ করুন বা মাইকে বলুন।');
      return;
    }
    if (mode === 'url' && !urlInput.trim()) {
      setErrorMsg('অনুগ্রহ করে কোম্পানির সঠিক ওয়েবসাইটের লিঙ্ক প্রদান করুন।');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setEditingId(null);

    try {
      const data = await importCompanyCatalog({
        mode,
        companyName: targetComp.trim(),
        websiteUrl: urlInput.trim()
      });

      setResult(data);
      setItems(data.items);
    } catch (err: any) {
      setErrorMsg(err.message || 'ক্যাটালগ এক্সট্র্যাকশন সম্পন্ন করা যায়নি। পুনরায় চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle single item selection
  const toggleItemSelect = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  // Select all or Deselect all
  const selectedCount = items.filter((x) => x.selected).length;
  const isAllSelected = items.length > 0 && selectedCount === items.length;

  const toggleSelectAll = () => {
    const newTarget = !isAllSelected;
    setItems((prev) => prev.map((item) => ({ ...item, selected: newTarget })));
  };

  // Start Inline Edit
  const startEdit = (item: ExtractedCatalogItem) => {
    setEditingId(item.id);
    const indStr = item.clinicalIndications.map((i) => i.bn || i.en).join(', ');
    setEditForm({
      name: item.name,
      bengaliName: item.bengaliName,
      category: item.category,
      indications: indStr,
      dosage: item.dosage
    });
  };

  // Save Inline Edit
  const saveEdit = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const indicationsArray = editForm.indications
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .map((txt) => ({ en: txt, bn: txt }));

        return {
          ...item,
          name: editForm.name,
          bengaliName: editForm.bengaliName,
          category: editForm.category,
          clinicalIndications: indicationsArray.length > 0 ? indicationsArray : item.clinicalIndications,
          dosage: editForm.dosage
        };
      })
    );
    setEditingId(null);
  };

  // Bulk Save to Supabase
  const handleBulkSave = async () => {
    const selectedItems = items.filter((x) => x.selected);
    if (selectedItems.length === 0) {
      setErrorMsg('ডাটাবেসে সেভ করার জন্য অন্তত একটি ওষুধ সিলেক্ট করুন।');
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);

    try {
      const recordsToSave = selectedItems.map(convertCatalogItemToCustomRecord);
      await saveBulkCustomRemedies(recordsToSave);

      // Notify parent to refresh active catalog and index
      onImportSuccess(recordsToSave);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'ডাটাবেসে সেভ করার সময় ত্রুটি ঘটেছে।');
    } finally {
      setIsSaving(false);
    }
  };

  // Filtered Items for display
  const displayItems = items.filter((item) => {
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const query = previewFilter.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesQuery =
      item.name.toLowerCase().includes(query) ||
      item.bengaliName.toLowerCase().includes(query) ||
      item.dosage.toLowerCase().includes(query) ||
      item.clinicalIndications.some(
        (ind) => ind.en.toLowerCase().includes(query) || ind.bn.toLowerCase().includes(query)
      );

    return matchesCategory && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh] animate-fade-in">
        
        {/* MODAL HEADER */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-950 via-[#1B4332] to-[#2D6A4F] text-white flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300 shadow-inner">
              <Globe className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">
                  কোম্পানি ক্যাটালগ ও ওয়েবসাইট ইমপোর্টার
                </h3>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-700/80 text-emerald-200 font-bold tracking-wide">
                  Gemini AI Catalog Crawler
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                কোম্পানির নাম লিখে বা ওয়েবসাইট লিঙ্ক দিয়ে এক ক্লিকে সম্পূর্ণ প্রোডাক্ট ক্যাটালগ অ্যানালাইসিস ও চেম্বার ডাটাবেসে সেভ করুন।
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-100">
          
          {/* STEP 1: IMPORT CONFIGURATION */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
            
            {/* Mode Switcher Tabs */}
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span>ইমপোর্ট মোড নির্বাচন করুন (Import Method):</span>
              </span>

              <div className="inline-flex p-1 rounded-xl bg-slate-200/70 dark:bg-slate-900 border border-slate-300 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setMode('company')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    mode === 'company'
                      ? 'bg-[#1B4332] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Mode A: কোম্পানির নামে (AI Research)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('url')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    mode === 'url'
                      ? 'bg-[#1B4332] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Mode B: ওয়েবসাইট লিঙ্কে (Web Crawler)</span>
                </button>
              </div>
            </div>

            {/* Mode A Input: Company Name with Voice */}
            {mode === 'company' ? (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  কোম্পানির নাম লিখুন অথবা ভয়েসে বলুন (Company Name):
                </label>
                
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={companyInput}
                    onChange={(e) => {
                      setCompanyInput(e.target.value);
                      setErrorMsg(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleExtractCatalog();
                    }}
                    placeholder="যেমন: 'SSL Pharma Homeo', 'REPL Dr. Advice', 'Wheezal New Drops', 'Adel Pekana'..."
                    className="w-full pl-3.5 pr-24 py-2.5 sm:py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#1B4332]"
                  />
                  
                  <div className="absolute right-2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setIsListening(!isListening)}
                      className={`p-2 rounded-lg transition cursor-pointer ${
                        isListening
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800'
                      }`}
                      title={isListening ? 'শুনছি... বন্ধ করতে ক্লিক করুন' : 'মুখে বলুন (Voice Dictation)'}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Quick Recommendation Pills */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    জনপ্রিয় কোম্পানি:
                  </span>
                  {[
                    'SSL Pharma',
                    'REPL Dr. Advice',
                    'Wheezal Drops',
                    'Dr. Reckeweg',
                    'Adel Pekana',
                    'SBL World Class',
                    "Bakson's Drugs"
                  ].map((brand) => (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => {
                        setCompanyInput(brand);
                        handleExtractCatalog(brand);
                      }}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400 transition cursor-pointer"
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Mode B Input: Website URL */
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  কোম্পানির প্রোডাক্ট পেজের ওয়েব লিঙ্ক দিন (Product URL):
                </label>

                <div className="relative flex items-center">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => {
                      setUrlInput(e.target.value);
                      setErrorMsg(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleExtractCatalog();
                    }}
                    placeholder="https://www.example-homeo.com/products-catalog"
                    className="w-full pl-3.5 pr-10 py-2.5 sm:py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#1B4332]"
                  />
                  <div className="absolute right-3 text-slate-400">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    নমুনা ওয়েবসাইট:
                  </span>
                  {[
                    'https://www.wheezal.com/drops',
                    'https://www.reckeweg.de/products',
                    'https://www.sblglobal.com'
                  ].map((url) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => setUrlInput(url)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-mono text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 hover:bg-emerald-100 transition cursor-pointer truncate max-w-[200px]"
                    >
                      {url}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Action Button: Start Extraction */}
            <button
              type="button"
              disabled={isLoading || (mode === 'company' ? !companyInput.trim() : !urlInput.trim())}
              onClick={() => handleExtractCatalog()}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-[#1B4332] hover:from-emerald-500 hover:to-emerald-800 text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition shadow-md shadow-emerald-900/10 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Gemini AI কোম্পানি ক্যাটালগ অ্যানালাইসিস করছে... অনুগ্রহ করে অপেক্ষা করুন</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>🚀 ক্যাটালগ অ্যানালাইসিস শুরু করুন (Extract Products)</span>
                </>
              )}
            </button>
          </div>

          {/* STEP 2: INTERACTIVE BATCH PREVIEW & SELECTION */}
          {result && items.length > 0 && (
            <div className="space-y-4 animate-fade-in">
              
              {/* Header with Stats & Master Selection */}
              <div className="flex items-center justify-between flex-wrap gap-3 p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
                      <span>✅ {result.company} এর {items.length} টি ওষুধ পাওয়া গেছে</span>
                    </h4>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                      {selectedCount} টি ওষুধ ডাটাবেসে সেভ করার জন্য নির্বাচিত রয়েছে।
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100/50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {isAllSelected ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                    <span>{isAllSelected ? 'সবগুলো বাতিল করুন' : 'সবগুলো নির্বাচন করুন'}</span>
                  </button>
                </div>
              </div>

              {/* Table Search & Category Filter */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="relative flex-1 min-w-[200px]">
                  <input
                    type="text"
                    value={previewFilter}
                    onChange={(e) => setPreviewFilter(e.target.value)}
                    placeholder="ওষুধের নাম বা রোগ দিয়ে খুঁজুন..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                </div>

                <div className="flex items-center gap-1">
                  {[
                    { id: 'all', label: 'সবগুলো' },
                    { id: 'patent', label: 'পেটেন্ট ড্রপ/সিরাপ' },
                    { id: 'mother_tincture', label: 'মাদার Ø' },
                    { id: 'biochemic', label: 'বায়োকেমিক' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategoryFilter(cat.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition border cursor-pointer ${
                        categoryFilter === cat.id
                          ? 'bg-[#1B4332] text-white border-[#1B4332]'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* PREVIEW TABLE */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
                <div className="overflow-x-auto max-h-[380px]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 uppercase font-extrabold tracking-wider text-[10px] sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-3 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={toggleSelectAll}
                            className="rounded-sm accent-emerald-700 cursor-pointer"
                          />
                        </th>
                        <th className="p-3 min-w-[200px]">ওষুধের নাম (Medicine Name)</th>
                        <th className="p-3 w-28">শ্রেণী (Category)</th>
                        <th className="p-3 min-w-[220px]">মূল রোগ ও লক্ষণসমূহ (Indications)</th>
                        <th className="p-3 min-w-[150px]">সেবনবিধি (Dosage)</th>
                        <th className="p-3 w-16 text-center">সম্পাদনা</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                      {displayItems.map((item) => {
                        const isEditing = editingId === item.id;

                        if (isEditing) {
                          return (
                            <tr key={item.id} className="bg-amber-50/60 dark:bg-amber-950/20">
                              <td className="p-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={!!item.selected}
                                  onChange={() => toggleItemSelect(item.id)}
                                  className="rounded-sm accent-emerald-700 cursor-pointer"
                                />
                              </td>
                              <td className="p-2 space-y-1">
                                <input
                                  type="text"
                                  value={editForm.name}
                                  onChange={(e) =>
                                    setEditForm((prev) => ({ ...prev, name: e.target.value }))
                                  }
                                  placeholder="Latin / Trade name"
                                  className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold"
                                />
                                <input
                                  type="text"
                                  value={editForm.bengaliName}
                                  onChange={(e) =>
                                    setEditForm((prev) => ({ ...prev, bengaliName: e.target.value }))
                                  }
                                  placeholder="বাংলা নাম"
                                  className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-[11px]"
                                />
                              </td>
                              <td className="p-2">
                                <select
                                  value={editForm.category}
                                  onChange={(e) =>
                                    setEditForm((prev) => ({ ...prev, category: e.target.value as any }))
                                  }
                                  className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-[11px]"
                                >
                                  <option value="patent">Patent Drop</option>
                                  <option value="mother_tincture">Mother Tincture Ø</option>
                                  <option value="biochemic">Biochemic</option>
                                  <option value="dilution">Dilution</option>
                                </select>
                              </td>
                              <td className="p-2">
                                <textarea
                                  rows={2}
                                  value={editForm.indications}
                                  onChange={(e) =>
                                    setEditForm((prev) => ({ ...prev, indications: e.target.value }))
                                  }
                                  placeholder="কমা দিয়ে পৃথক করুন"
                                  className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-[11px] resize-none"
                                />
                              </td>
                              <td className="p-2">
                                <input
                                  type="text"
                                  value={editForm.dosage}
                                  onChange={(e) =>
                                    setEditForm((prev) => ({ ...prev, dosage: e.target.value }))
                                  }
                                  className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-[11px]"
                                />
                              </td>
                              <td className="p-2 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => saveEdit(item.id)}
                                    className="p-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                                    title="Save changes"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingId(null)}
                                    className="p-1 rounded-md bg-slate-200 text-slate-700 hover:bg-slate-300 cursor-pointer"
                                    title="Cancel"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        }

                        return (
                          <tr
                            key={item.id}
                            className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition ${
                              item.selected ? 'bg-emerald-50/20 dark:bg-emerald-950/10' : 'opacity-60'
                            }`}
                          >
                            <td className="p-3 text-center">
                              <input
                                type="checkbox"
                                checked={!!item.selected}
                                onChange={() => toggleItemSelect(item.id)}
                                className="rounded-sm accent-emerald-700 cursor-pointer"
                              />
                            </td>
                            <td className="p-3">
                              <div className="font-extrabold text-slate-900 dark:text-white">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                                {item.bengaliName}
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                {item.category === 'mother_tincture'
                                  ? 'মাদার Ø'
                                  : item.category === 'biochemic'
                                  ? 'বায়োকেমিক'
                                  : 'পেটেন্ট'}
                              </span>
                            </td>
                            <td className="p-3 space-y-1">
                              <div className="flex flex-wrap gap-1">
                                {item.clinicalIndications.slice(0, 3).map((ind, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px]"
                                  >
                                    {ind.bn || ind.en}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="p-3 text-[11px] text-slate-600 dark:text-slate-400">
                              {item.dosage}
                            </td>
                            <td className="p-3 text-center">
                              <button
                                type="button"
                                onClick={() => startEdit(item)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                                title="Edit medicine details"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER WITH BATCH SAVE ACTION */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            বাতিল (Cancel)
          </button>

          <button
            type="button"
            disabled={isSaving || selectedCount === 0}
            onClick={handleBulkSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 to-[#1B4332] hover:from-emerald-600 hover:to-emerald-800 text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 transition shadow-lg shadow-emerald-950/20 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Supabase ডাটাবেসে সেভ হচ্ছে...</span>
              </>
            ) : (
              <>
                <Database className="w-4 h-4 text-emerald-300" />
                <span>
                  📥 নির্বাচিত {selectedCount} টি ওষুধ ডাটাবেসে সেভ করুন
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
