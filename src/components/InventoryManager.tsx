import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, Plus, RefreshCw, AlertTriangle, Package, 
  X, Filter, Download, Calendar, ChevronDown, Pill, MinusCircle, Check
} from 'lucide-react';
import { getSupabase } from '../services/supabase';
import { HOMEOPATHIC_MEDICINES_CATALOG } from '../data/homeopathicCatalog';

interface MedicineItem {
  id: string;
  name: string;
  category?: string;
  potency?: string;
  bottle_size?: string;
  rack_location?: string;
  batch_number?: string;
  supplier?: string;
  manufacturer?: string;
  stock_qty: number;
  low_stock_alert?: number;
  storage_area?: string;
  purchase_price?: number;
  mrp?: number;
  expiry_date?: string;
  created_at?: string;
}

const COMMON_MANUFACTURERS = [
  'Dr. Reckeweg & Co (Germany)', 'Dr. Willmar Schwabe India (WSI)', 'SBL Pvt Ltd',
  'Adel / Pekana (Germany)', 'Boiron (France)', "Bakson's Drugs & Pharmaceuticals", 'Medisynth',
  "Lord's Homoeopathic", 'Haslab', 'Allen Homoeo', 'Wheezal', 'Dr. Hahnemann Laboratories'
];

const BOTTLE_SIZE_PRESETS = [
  '15ml', '30ml', '60ml', '100ml', '450ml (1 lb)', '500ml', '25g', '100g', '100 Tabs'
];

export const InventoryManager: React.FC<any> = () => {
  const [medicines, setMedicines] = useState<MedicineItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedRack, setSelectedRack] = useState('ALL');
  const [selectedStorage, setSelectedStorage] = useState('ALL');
  const [filterLowStock, setFilterLowStock] = useState(false);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [dispenseMed, setDispenseMed] = useState<MedicineItem | null>(null);
  const [dispenseQty, setDispenseQty] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Mobile Accordion Expansion
  const [expandedMedId, setExpandedMedId] = useState<string | null>(null);

  // Autocomplete suggestions active state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Form State - strictly clean and empty by default
  const [formData, setFormData] = useState({
    name: '',
    category: 'Dilution',
    potency: '',
    bottle_size: '',
    rack_location: '',
    batch_number: '',
    supplier: '',
    manufacturer: '',
    stock_qty: '',
    low_stock_alert: '',
    storage_area: 'Clinic Shelf',
    purchase_price: '',
    mrp: '',
    expiry_date: ''
  });

  const fetchMedicines = async () => {
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('medicines')
        .select('*')
        .order('name', { ascending: true });

      if (!error && data) {
        setMedicines(data as MedicineItem[]);
      }
    } catch (err) {
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();

    const supabase = getSupabase();
    if (!supabase) return;

    const channel = supabase
      .channel('medicines-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'medicines' }, () => {
        fetchMedicines();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const uniqueRacks = useMemo(() => {
    const racks = medicines
      .map(m => m.rack_location?.trim())
      .filter((r): r is string => Boolean(r));
    return Array.from(new Set(racks)).sort();
  }, [medicines]);

  const uniqueCategories = useMemo(() => {
    const cats = medicines
      .map(m => m.category?.trim())
      .filter((c): c is string => Boolean(c));
    return Array.from(new Set(cats)).sort();
  }, [medicines]);

  // Autocomplete matching list for Add Medicine Modal
  const medicineSuggestions = useMemo(() => {
    const term = formData.name.trim().toLowerCase();
    if (!term || term.length < 1) return [];
    return HOMEOPATHIC_MEDICINES_CATALOG.filter(item => 
      item.toLowerCase().includes(term)
    ).slice(0, 10);
  }, [formData.name]);

  const filtered = useMemo(() => {
    return medicines.filter(m => {
      const matchesSearch = 
        m.name?.toLowerCase().includes(search.toLowerCase()) ||
        m.rack_location?.toLowerCase().includes(search.toLowerCase()) ||
        m.manufacturer?.toLowerCase().includes(search.toLowerCase()) ||
        m.batch_number?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = selectedCategory === 'ALL' || m.category === selectedCategory;
      const matchesRack = selectedRack === 'ALL' || m.rack_location === selectedRack;
      const matchesStorage = selectedStorage === 'ALL' || m.storage_area === selectedStorage;
      const isLow = (m.stock_qty || 0) <= (m.low_stock_alert || 5);

      if (filterLowStock && !isLow) return false;
      return matchesSearch && matchesCategory && matchesRack && matchesStorage;
    });
  }, [medicines, search, selectedCategory, selectedRack, selectedStorage, filterLowStock]);

  const handleExportCSV = () => {
    if (filtered.length === 0) {
      alert('No medicines to export with current filters.');
      return;
    }

    const headers = [
      'Medicine Name', 'Potency', 'Category', 'Pack Size', 'Rack Location',
      'Batch Number', 'Company / Manufacturer', 'Supplier', 'Stock Quantity',
      'Low Stock Alert', 'Storage Area', 'Purchase Price (INR)', 'MRP (INR)', 'Expiry Date'
    ];

    const rows = filtered.map(m => [
      `"${m.name || ''}"`,
      `"${m.potency || ''}"`,
      `"${m.category || ''}"`,
      `"${m.bottle_size || ''}"`,
      `"${m.rack_location || ''}"`,
      `"${m.batch_number || ''}"`,
      `"${m.manufacturer || ''}"`,
      `"${m.supplier || ''}"`,
      m.stock_qty || 0,
      m.low_stock_alert || 5,
      `"${m.storage_area || ''}"`,
      m.purchase_price || 0,
      m.mrp || 0,
      `"${m.expiry_date || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);

    const rackName = selectedRack !== 'ALL' ? `_Rack_${selectedRack}` : '';
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `Homoeo_Stock${rackName}_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fresh Reset on Open: Clear all inputs strictly to empty blanks
  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      category: 'Dilution',
      potency: '',
      bottle_size: '',
      rack_location: '',
      batch_number: '',
      supplier: '',
      manufacturer: '',
      stock_qty: '',
      low_stock_alert: '',
      storage_area: 'Clinic Shelf',
      purchase_price: '',
      mrp: '',
      expiry_date: ''
    });
    setFormError('');
    setShowSuggestions(false);
    setShowAddModal(true);
  };

  // Zero Leading Zeros in Numeric Inputs
  const handleNumericInput = (field: 'stock_qty' | 'low_stock_alert' | 'purchase_price' | 'mrp', val: string) => {
    // If empty, keep blank
    if (val === '') {
      setFormData(prev => ({ ...prev, [field]: '' }));
      return;
    }
    // Remove non-numeric characters (allow decimal for price if needed)
    let cleaned = val.replace(/[^0-9.]/g, '');
    // Strip leading zeros if followed by another digit (e.g. "010" -> "10", "0270" -> "270")
    cleaned = cleaned.replace(/^0+(?=\d)/, '');
    setFormData(prev => ({ ...prev, [field]: cleaned }));
  };

  const handleSelectRemedy = (remedyName: string) => {
    let autoCategory = formData.category;
    let autoMfg = formData.manufacturer;

    if (remedyName.includes('Dr. Reckeweg')) {
      autoMfg = 'Dr. Reckeweg & Co (Germany)';
      autoCategory = 'Patent';
    } else if (remedyName.includes('Adel')) {
      autoMfg = 'Adel / Pekana (Germany)';
      autoCategory = 'Patent';
    } else if (remedyName.endsWith(' Q') || remedyName.includes('Mother Tincture')) {
      autoCategory = 'Mother Tincture';
    } else if (remedyName.includes('Bio-Combination')) {
      autoCategory = 'Bio-combination';
    } else if (remedyName.includes('3X') || remedyName.includes('6X') || remedyName.includes('12X')) {
      autoCategory = 'Biochemic';
    }

    setFormData(prev => ({
      ...prev,
      name: remedyName,
      category: autoCategory,
      manufacturer: autoMfg || prev.manufacturer
    }));
    setShowSuggestions(false);
  };

  const handleAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const supabase = getSupabase();
    if (!supabase) {
      setFormError('Database connection unavailable.');
      return;
    }

    if (!formData.name.trim()) {
      setFormError('Please enter a medicine name.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category || 'Dilution',
        potency: formData.potency.trim() || '30C',
        bottle_size: formData.bottle_size.trim() || '30ml',
        rack_location: formData.rack_location.trim().toUpperCase() || 'R001',
        batch_number: formData.batch_number.trim() || null,
        supplier: formData.supplier.trim() || null,
        manufacturer: formData.manufacturer.trim() || 'SBL Pvt Ltd',
        stock_qty: formData.stock_qty !== '' ? Number(formData.stock_qty) : 0,
        low_stock_alert: formData.low_stock_alert !== '' ? Number(formData.low_stock_alert) : 5,
        storage_area: formData.storage_area || 'Clinic Shelf',
        purchase_price: formData.purchase_price !== '' ? Number(formData.purchase_price) : 0,
        mrp: formData.mrp !== '' ? Number(formData.mrp) : 0,
        expiry_date: formData.expiry_date.trim() || null
      };

      const { error } = await supabase.from('medicines').insert([payload]);
      if (error) throw error;

      setShowAddModal(false);
      fetchMedicines();
    } catch (err: any) {
      setFormError('Error adding medicine: ' + (err.message || 'Check database permissions'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDispense = async () => {
    if (!dispenseMed) return;
    const supabase = getSupabase();
    if (!supabase) {
      alert('Database connection unavailable.');
      return;
    }

    setSubmitting(true);
    try {
      const currentStock = dispenseMed.stock_qty || 0;
      const updatedQty = Math.max(0, currentStock - Number(dispenseQty));

      const { error } = await supabase
        .from('medicines')
        .update({ stock_qty: updatedQty })
        .eq('id', dispenseMed.id);

      if (error) throw error;

      setMedicines(prev => prev.map(m => m.id === dispenseMed.id ? { ...m, stock_qty: updatedQty } : m));
      setDispenseMed(null);
    } catch (err: any) {
      alert('Error updating stock: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const totalMedicines = medicines.length;
  const lowStockCount = medicines.filter(m => (m.stock_qty || 0) <= (m.low_stock_alert || 5)).length;
  const godownCount = medicines.filter(m => m.storage_area === 'Godown Storage').length;
  const totalUnits = medicines.reduce((sum, m) => sum + (m.stock_qty || 0), 0);

  return (
    <div className="space-y-4">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-3.5 sm:p-4 rounded-xl shadow-xs">
          <div className="text-[11px] sm:text-xs text-stone-500 font-medium">Total Registered Stock</div>
          <div className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white mt-0.5">{totalMedicines}</div>
        </div>

        <div 
          onClick={() => setFilterLowStock(!filterLowStock)}
          className={`border p-3.5 sm:p-4 rounded-xl shadow-xs cursor-pointer transition-colors ${
            filterLowStock 
              ? 'bg-rose-50 border-rose-400 dark:bg-rose-950/40 dark:border-rose-800' 
              : 'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-medium text-rose-600 dark:text-rose-400">Low Stock Alert</span>
            <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-400 mt-0.5">{lowStockCount}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-3.5 sm:p-4 rounded-xl shadow-xs">
          <div className="text-[11px] sm:text-xs text-stone-500 font-medium">Godown Bulk Storage</div>
          <div className="text-xl sm:text-2xl font-bold text-stone-800 dark:text-stone-200 mt-0.5">{godownCount}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-3.5 sm:p-4 rounded-xl shadow-xs">
          <div className="text-[11px] sm:text-xs text-stone-500 font-medium">Total Inventory Units</div>
          <div className="text-xl sm:text-2xl font-bold text-stone-800 dark:text-stone-200 mt-0.5">{totalUnits}</div>
        </div>
      </div>

      {/* Action Header with Search, Export and Add */}
      <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl border border-stone-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search medicine, rack, company, batch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-lg text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-lg text-xs sm:text-sm font-semibold hover:bg-emerald-100 transition-colors cursor-pointer"
              title="Export filtered records to CSV"
            >
              <Download className="h-4 w-4" /> 
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleOpenAddModal}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-lg text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" /> 
              <span>Add Medicine</span>
            </button>
          </div>
        </div>

        {/* Dynamic Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-stone-100 dark:border-slate-800">
          <div>
            <label className="block text-[11px] font-semibold text-stone-500 mb-1">Rack / Shelf Filter</label>
            <select
              value={selectedRack}
              onChange={(e) => setSelectedRack(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-lg text-stone-800 dark:text-stone-200 focus:ring-1 focus:ring-emerald-600"
            >
              <option value="ALL">All Racks / Shelves ({uniqueRacks.length})</option>
              {uniqueRacks.map(rack => (
                <option key={rack} value={rack}>{rack}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-500 mb-1">Category Filter</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-lg text-stone-800 dark:text-stone-200 focus:ring-1 focus:ring-emerald-600"
            >
              <option value="ALL">All Categories</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-500 mb-1">Storage Area</label>
            <select
              value={selectedStorage}
              onChange={(e) => setSelectedStorage(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-lg text-stone-800 dark:text-stone-200 focus:ring-1 focus:ring-emerald-600"
            >
              <option value="ALL">All Locations</option>
              <option value="Clinic Shelf">Clinic Shelf (Dispensing)</option>
              <option value="Godown Storage">Godown Storage (Bulk)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. MOBILE VIEW: ACCORDION MEDICINE CARDS (ZERO HORIZONTAL SCROLL)         */}
      {/* ========================================================================= */}
      <div className="sm:hidden space-y-2.5">
        {loading && medicines.length === 0 ? (
          <div className="py-12 text-center text-stone-500 bg-white dark:bg-slate-900 rounded-xl border border-stone-200 dark:border-slate-800 p-4">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-emerald-600" />
            Loading database records...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-stone-400 bg-white dark:bg-slate-900 rounded-xl border border-stone-200 dark:border-slate-800 p-4">
            No medicines match the selected filter or rack.
          </div>
        ) : (
          filtered.map((med) => {
            const isExpanded = expandedMedId === med.id;
            const isLow = (med.stock_qty || 0) <= (med.low_stock_alert || 5);

            return (
              <div
                key={med.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-xs overflow-hidden transition-all"
              >
                {/* Top Line / Tap anywhere on card to toggle */}
                <button
                  type="button"
                  onClick={() => setExpandedMedId(isExpanded ? null : med.id)}
                  className="w-full text-left p-3.5 flex items-center justify-between gap-2.5 cursor-pointer hover:bg-stone-50/70 dark:hover:bg-slate-800/40"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-sm text-stone-900 dark:text-white leading-tight">
                        {med.name}
                      </span>
                      {med.potency && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                          {med.potency}
                        </span>
                      )}
                      {med.bottle_size && (
                        <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                          • {med.bottle_size}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-[11px] font-bold bg-stone-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-stone-700 dark:text-stone-300">
                        {med.rack_location || 'Rack N/A'}
                      </span>
                      <span className="text-stone-400">•</span>
                      <span className="text-[11px] text-stone-500 truncate max-w-[130px]">
                        {med.manufacturer || med.category || 'Dilution'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <span className={`font-bold text-sm ${isLow ? 'text-rose-600' : 'text-stone-900 dark:text-white'}`}>
                        {med.stock_qty}
                      </span>
                      <span className="text-[10px] text-stone-400 block -mt-0.5">units</span>
                      {isLow && (
                        <span className="block text-[9px] font-extrabold text-rose-600 uppercase">
                          LOW STOCK
                        </span>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180 text-emerald-600' : ''
                      }`}
                    />
                  </div>
                </button>

                {/* Smooth Inline Expanded Details */}
                {isExpanded && (
                  <div className="px-3.5 pb-3.5 pt-1 border-t border-stone-100 dark:border-slate-800 space-y-3 bg-stone-50/50 dark:bg-slate-900/60 animate-fade-in">
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-stone-200/80 dark:border-slate-700">
                        <span className="text-[10px] text-stone-400 uppercase font-semibold block">Rack / Shelf</span>
                        <span className="font-mono font-bold text-stone-900 dark:text-stone-100 text-xs">
                          {med.rack_location || 'Not Assigned'}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-stone-200/80 dark:border-slate-700">
                        <span className="text-[10px] text-stone-400 uppercase font-semibold block">Category</span>
                        <span className="font-semibold text-stone-800 dark:text-stone-200 text-xs">
                          {med.category || 'Dilution'}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-stone-200/80 dark:border-slate-700">
                        <span className="text-[10px] text-stone-400 uppercase font-semibold block">Batch No</span>
                        <span className="font-mono text-stone-800 dark:text-stone-200 text-xs">
                          {med.batch_number || 'N/A'}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-stone-200/80 dark:border-slate-700">
                        <span className="text-[10px] text-stone-400 uppercase font-semibold block">Expiry Date</span>
                        <span className="font-semibold text-stone-800 dark:text-stone-200 text-xs">
                          {med.expiry_date || 'N/A'}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-stone-200/80 dark:border-slate-700">
                        <span className="text-[10px] text-stone-400 uppercase font-semibold block">MRP / Cost</span>
                        <span className="font-bold text-stone-900 dark:text-stone-100 text-xs">
                          ₹{med.mrp || 0} <span className="text-stone-400 font-normal">/ ₹{med.purchase_price || 0}</span>
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-stone-200/80 dark:border-slate-700">
                        <span className="text-[10px] text-stone-400 uppercase font-semibold block">Storage Area</span>
                        <span className="font-semibold text-stone-800 dark:text-stone-200 text-xs">
                          {med.storage_area || 'Clinic Shelf'}
                        </span>
                      </div>
                    </div>

                    {med.manufacturer && (
                      <div className="text-[11px] text-stone-500 dark:text-stone-400">
                        <span className="font-semibold text-stone-700 dark:text-stone-300">Manufacturer: </span>
                        {med.manufacturer} {med.supplier ? `• Supplier: ${med.supplier}` : ''}
                      </div>
                    )}

                    {/* Prominent Dispense / Stock Out Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDispenseQty(1);
                        setDispenseMed(med);
                      }}
                      className="w-full py-2.5 px-4 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Pill className="w-4 h-4" />
                      <span>Dispense / Stock Out</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP VIEW: MULTI-COLUMN TABLE (hidden sm:block)                     */}
      {/* ========================================================================= */}
      <div className="hidden sm:block bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="w-full overflow-x-auto p-2">
          <table className="w-full min-w-[950px] border-collapse text-left text-xs">
            <thead>
              <tr className="bg-stone-50 dark:bg-slate-800/80 border-b border-stone-200 dark:border-slate-800 text-stone-500 font-semibold uppercase">
                <th className="py-3 px-4 min-w-[220px]">Medicine & Potency</th>
                <th className="py-3 px-3">Category & Size</th>
                <th className="py-3 px-3">Rack / Shelf</th>
                <th className="py-3 px-3 text-center">Current Stock</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3">MRP / Cost</th>
                <th className="py-3 px-3">Company</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-slate-800">
              {loading && medicines.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-500">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-emerald-600" />
                    Loading database records...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    No medicines match the selected filter or rack.
                  </td>
                </tr>
              ) : (
                filtered.map(med => {
                  const isLow = (med.stock_qty || 0) <= (med.low_stock_alert || 5);

                  return (
                    <tr key={med.id} className="hover:bg-stone-50/70 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-sm text-stone-900 dark:text-white">{med.name}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {med.potency && (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">
                              {med.potency}
                            </span>
                          )}
                          {med.batch_number && (
                            <span className="text-[10px] text-stone-400">Batch: {med.batch_number}</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3 text-stone-600 dark:text-stone-300">
                        <div>{med.category || 'Dilution'}</div>
                        <div className="text-[11px] text-stone-400">{med.bottle_size}</div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          {med.rack_location || 'N/A'}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className={`font-bold text-sm ${isLow ? 'text-rose-600' : 'text-stone-900 dark:text-white'}`}>
                          {med.stock_qty}
                        </span>
                        {isLow && (
                          <span className="block text-[9px] font-bold text-rose-600 uppercase">LOW STOCK</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-stone-600 dark:text-stone-300">
                        <span className="px-2 py-0.5 bg-stone-100 dark:bg-slate-800 rounded text-[11px]">
                          {med.storage_area || 'Clinic Shelf'}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-medium text-stone-900 dark:text-white">
                        <div>₹{med.mrp || 0}</div>
                        {med.purchase_price ? (
                          <div className="text-[10px] text-stone-400 font-normal">Cost: ₹{med.purchase_price}</div>
                        ) : null}
                      </td>

                      <td className="py-3 px-3 text-stone-600 dark:text-stone-400 text-[11px]">
                        <div>{med.manufacturer || 'SBL'}</div>
                        {med.supplier && <div className="text-stone-400">{med.supplier}</div>}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            setDispenseQty(1);
                            setDispenseMed(med);
                          }}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Dispense
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. ADD MEDICINE MODAL (MOBILE OVERHAUL & ZERO LEADING ZEROS)              */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#FAF7EE] dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-emerald-950/20 max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-3.5 sm:p-4 border-b border-stone-200 dark:border-slate-800 flex justify-between items-center bg-white/80 dark:bg-slate-900/90 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#1B4332] text-white flex items-center justify-center shadow-xs">
                  <Package className="h-4 w-4 text-emerald-300" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-stone-900 dark:text-white leading-tight">
                    Add Homoeopathic Medicine
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-stone-500 dark:text-stone-400">
                    SBL, Schwabe, Reckeweg & Classical Repertory Catalog
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-200/60 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleAddMedicine} className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-3 text-xs">
              {formError && (
                <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Medicine Name with Vast Autocomplete */}
              <div className="relative">
                <label className="block font-bold uppercase text-[11px] text-stone-700 dark:text-stone-300 mb-1">
                  Medicine Name * (Classical / Reckeweg / Biochemic)
                </label>
                <input
                  type="text"
                  list="remedy-datalist"
                  required
                  placeholder="e.g. Arnica, Merc Sol, Dr. Reckeweg R1, Calc Phos"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-white font-medium focus:ring-2 focus:ring-[#1B4332] outline-none"
                />

                {/* Native Datalist Fallback */}
                <datalist id="remedy-datalist">
                  {HOMEOPATHIC_MEDICINES_CATALOG.map((r, i) => (
                    <option key={i} value={r} />
                  ))}
                </datalist>

                {/* Instant Reactive Autocomplete Suggestions Overlay */}
                {showSuggestions && medicineSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 shadow-xl max-h-48 overflow-y-auto z-50 divide-y divide-stone-100 dark:divide-slate-700">
                    {medicineSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectRemedy(suggestion)}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-emerald-50 dark:hover:bg-slate-700 flex items-center justify-between text-stone-800 dark:text-stone-200 transition"
                      >
                        <span className="font-semibold truncate">{suggestion}</span>
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-mono ml-2 shrink-0">Select</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Potency & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold uppercase text-[11px] text-stone-700 dark:text-stone-300 mb-1">
                    Potency / Scale
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 30C, 200C, 1M, Q, 6X"
                    value={formData.potency}
                    onChange={(e) => setFormData({ ...formData, potency: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-white font-medium focus:ring-2 focus:ring-[#1B4332] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-[11px] text-stone-700 dark:text-stone-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-white font-medium focus:ring-2 focus:ring-[#1B4332] outline-none"
                  >
                    <option value="Dilution">Dilution</option>
                    <option value="Mother Tincture">Mother Tincture</option>
                    <option value="Biochemic">Biochemic</option>
                    <option value="Bio-combination">Bio-combination</option>
                    <option value="Patent">Patent / Drops</option>
                    <option value="Trituration">Trituration</option>
                    <option value="External / Ointment">External / Ointment</option>
                    <option value="Tablets">Tablets</option>
                  </select>
                </div>
              </div>

              {/* Company / Manufacturer & Rack Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold uppercase text-[11px] text-stone-700 dark:text-stone-300 mb-1">
                    Company / Manufacturer
                  </label>
                  <input
                    type="text"
                    list="mfg-datalist"
                    placeholder="e.g. SBL, Dr. Reckeweg, Schwabe"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-white font-medium focus:ring-2 focus:ring-[#1B4332] outline-none"
                  />
                  <datalist id="mfg-datalist">
                    {COMMON_MANUFACTURERS.map((m, i) => <option key={i} value={m} />)}
                  </datalist>
                </div>

                <div>
                  <label className="block font-bold uppercase text-[11px] text-stone-700 dark:text-stone-300 mb-1">
                    Rack Location *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. R005, Rack A-01"
                    value={formData.rack_location}
                    onChange={(e) => setFormData({ ...formData, rack_location: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-white font-mono font-bold focus:ring-2 focus:ring-[#1B4332] outline-none"
                  />
                </div>
              </div>

              {/* Batch & Bottle Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold uppercase text-[11px] text-stone-700 dark:text-stone-300 mb-1">
                    Batch Number (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. B-9982"
                    value={formData.batch_number}
                    onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-white font-medium focus:ring-2 focus:ring-[#1B4332] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-[11px] text-stone-700 dark:text-stone-300 mb-1">
                    Bottle / Pack Size
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 30ml, 100ml, 450ml"
                    value={formData.bottle_size}
                    onChange={(e) => setFormData({ ...formData, bottle_size: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-white font-medium focus:ring-2 focus:ring-[#1B4332] outline-none"
                  />
                  <div className="flex flex-wrap gap-1 mt-1">
                    {BOTTLE_SIZE_PRESETS.slice(0, 5).map((size) => (
                      <button
                        type="button"
                        key={size}
                        onClick={() => setFormData({ ...formData, bottle_size: size })}
                        className="px-1.5 py-0.5 bg-stone-100 hover:bg-emerald-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 rounded text-[9px] font-medium border border-stone-200 dark:border-slate-700 cursor-pointer"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Zero Leading Zeros: Stock Qty, Low Alert, Cost, MRP */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div>
                  <label className="block font-bold uppercase text-[10px] text-stone-700 dark:text-stone-300 mb-1">
                    Stock Qty *
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    placeholder="e.g. 10"
                    value={formData.stock_qty}
                    onChange={(e) => handleNumericInput('stock_qty', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-white font-bold focus:ring-2 focus:ring-[#1B4332] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-[10px] text-stone-700 dark:text-stone-300 mb-1">
                    Low Alert
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g. 5"
                    value={formData.low_stock_alert}
                    onChange={(e) => handleNumericInput('low_stock_alert', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-white focus:ring-2 focus:ring-[#1B4332] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-[10px] text-stone-700 dark:text-stone-300 mb-1">
                    Cost (₹)
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="e.g. 75"
                    value={formData.purchase_price}
                    onChange={(e) => handleNumericInput('purchase_price', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-white focus:ring-2 focus:ring-[#1B4332] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-[10px] text-stone-700 dark:text-stone-300 mb-1">
                    MRP (₹) *
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    required
                    placeholder="e.g. 110"
                    value={formData.mrp}
                    onChange={(e) => handleNumericInput('mrp', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-white font-bold focus:ring-2 focus:ring-[#1B4332] outline-none"
                  />
                </div>
              </div>

              {/* Dual-Mode Expiry Date & Storage Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold uppercase text-[11px] text-stone-700 dark:text-stone-300 mb-1">
                    Expiry Date (Type or Pick Calendar)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="DD/MM/YYYY or YYYY-MM-DD"
                      value={formData.expiry_date}
                      onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                      className="w-full pl-3 pr-10 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-white font-medium focus:ring-2 focus:ring-[#1B4332] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (dateInputRef.current) {
                          if ('showPicker' in HTMLInputElement.prototype) {
                            try {
                              dateInputRef.current.showPicker();
                            } catch {
                              dateInputRef.current.click();
                            }
                          } else {
                            dateInputRef.current.click();
                          }
                        }
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition cursor-pointer"
                      title="Open calendar picker"
                      aria-label="Open calendar picker"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                    {/* Hidden Native Date Picker for dual-mode */}
                    <input
                      ref={dateInputRef}
                      type="date"
                      tabIndex={-1}
                      aria-hidden="true"
                      className="sr-only absolute opacity-0 pointer-events-none"
                      onChange={(e) => {
                        if (e.target.value) {
                          setFormData({ ...formData, expiry_date: e.target.value });
                        }
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase text-[11px] text-stone-700 dark:text-stone-300 mb-1">
                    Storage Area
                  </label>
                  <select
                    value={formData.storage_area}
                    onChange={(e) => setFormData({ ...formData, storage_area: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-white font-medium focus:ring-2 focus:ring-[#1B4332] outline-none"
                  >
                    <option value="Clinic Shelf">Clinic Shelf (Dispensing)</option>
                    <option value="Godown Storage">Godown Storage (Bulk)</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-stone-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 dark:border-slate-700 text-stone-700 dark:text-stone-300 font-semibold cursor-pointer hover:bg-stone-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Saving to Database...' : 'Save Medicine to Supabase'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dispense Modal */}
      {dispenseMed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-stone-200 dark:border-slate-800 p-5 space-y-4 text-xs">
            <h3 className="font-bold text-base text-stone-900 dark:text-white">Dispense Medicine</h3>
            <p className="text-stone-500">
              Dispensing <strong className="text-stone-800 dark:text-stone-200">{dispenseMed.name} ({dispenseMed.potency})</strong>.<br />
              Current Available Stock: <strong className="text-emerald-700">{dispenseMed.stock_qty}</strong> units.
            </p>

            <div>
              <label className="block font-semibold text-stone-600 dark:text-stone-400 mb-1">Quantity to Deduct</label>
              <input
                type="number"
                min="1"
                max={dispenseMed.stock_qty}
                value={dispenseQty}
                onChange={(e) => setDispenseQty(Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl text-base font-bold text-center text-stone-900 dark:text-white"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setDispenseMed(null)}
                className="flex-1 py-2 border border-stone-300 dark:border-slate-700 text-stone-600 dark:text-stone-300 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDispense}
                disabled={submitting}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition cursor-pointer"
              >
                {submitting ? 'Updating...' : 'Confirm Dispense'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
