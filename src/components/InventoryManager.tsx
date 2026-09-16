import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Plus, RefreshCw, AlertTriangle, Package, 
  X, Filter, Download
} from 'lucide-react';
import { getSupabase } from '../services/supabase';

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

const COMMON_REMEDIES = [
  'Arnica Montana', 'Rhus Toxicodendron', 'Bryonia Alba', 'Nux Vomica',
  'Aconitum Napellus', 'Belladonna', 'Arsenicum Album', 'Pulsatilla',
  'Hepar Sulphuris', 'Lycopodium Clavatum', 'Sulphur', 'Calcarea Carbonica',
  'Chamomilla', 'Gelsemium', 'Ignatia Amara', 'Thuja Occidentalis',
  'Ledum Palustre', 'Hypericum Perforatum', 'Ruta Graveolens', 'Cantharis',
  'Silicea', 'Carbo Vegetabilis', 'Natrum Muriaticum', 'Phosphorus', 'Sepia',
  'Allium Cepa', 'Drosera', 'Berberis Vulgaris', 'Cinchona (China)', 'Staphysagria',
  'Colocynthis', 'Antimonium Tartaricum', 'Spongia Tosta', 'Causticum',
  'Adel 1', 'Adel 10', 'Adel 11', 'Adel 12', 'Adel 14', 'Adel 16', 'Adel 18',
  'Dr. Reckeweg R1', 'Dr. Reckeweg R2', 'Dr. Reckeweg R3', 'Dr. Reckeweg R5', 'Dr. Reckeweg R10', 'Dr. Reckeweg R11'
];

const COMMON_MANUFACTURERS = [
  'Dr. Reckeweg & Co (Germany)', 'Dr. Willmar Schwabe India (WSI)', 'SBL Pvt Ltd',
  'Adel / Pekana', 'Boiron', "Bakson's Drugs & Pharmaceuticals", 'Medisynth',
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

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Dilution',
    potency: '30C',
    bottle_size: '30ml',
    rack_location: '',
    batch_number: '',
    supplier: '',
    manufacturer: 'SBL Pvt Ltd',
    stock_qty: 10,
    low_stock_alert: 5,
    storage_area: 'Clinic Shelf',
    purchase_price: 75,
    mrp: 110,
    expiry_date: '2028-12-31'
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

  const handleAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = getSupabase();
    if (!supabase) {
      alert('Database connection unavailable.');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('medicines').insert([formData]);
      if (error) throw error;

      setShowAddModal(false);
      setFormData({
        name: '',
        category: 'Dilution',
        potency: '30C',
        bottle_size: '30ml',
        rack_location: '',
        batch_number: '',
        supplier: '',
        manufacturer: 'SBL Pvt Ltd',
        stock_qty: 10,
        low_stock_alert: 5,
        storage_area: 'Clinic Shelf',
        purchase_price: 75,
        mrp: 110,
        expiry_date: '2028-12-31'
      });
      fetchMedicines();
    } catch (err: any) {
      alert('Error adding medicine: ' + err.message);
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

      setDispenseMed(null);
      setDispenseQty(1);
      fetchMedicines();
    } catch (err: any) {
      alert('Error dispensing medicine: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const lowStockCount = medicines.filter(m => (m.stock_qty || 0) <= (m.low_stock_alert || 5)).length;
  const totalUnits = medicines.reduce((sum, m) => sum + (Number(m.stock_qty) || 0), 0);

  return (
    <div className="space-y-4 w-full">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
          <div className="text-xs text-stone-500 font-medium">Catalog Items</div>
          <div className="text-2xl font-bold text-stone-900 dark:text-white mt-1">{medicines.length}</div>
        </div>

        <div 
          onClick={() => setFilterLowStock(!filterLowStock)}
          className={`cursor-pointer border p-4 rounded-xl shadow-sm transition-all ${
            filterLowStock 
              ? 'bg-rose-50 border-rose-300 dark:bg-rose-950/40 dark:border-rose-800' 
              : 'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-800'
          }`}
        >
          <div className="text-xs text-rose-600 font-semibold flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> Urgent Low Stock
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-1">{lowStockCount}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
          <div className="text-xs text-stone-500 font-medium">Clinic Shelf Units</div>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">
            {medicines.filter(m => m.storage_area !== 'Godown Storage').reduce((acc, m) => acc + (Number(m.stock_qty) || 0), 0)}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
          <div className="text-xs text-stone-500 font-medium">Total Inventory Units</div>
          <div className="text-2xl font-bold text-stone-800 dark:text-stone-200 mt-1">{totalUnits}</div>
        </div>
      </div>

      {/* Action Header with Export and Add */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-stone-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search by medicine, rack, company, batch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-lg text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-lg text-sm font-semibold hover:bg-emerald-100 transition-colors"
              title="Export filtered records to CSV"
            >
              <Download className="h-4 w-4" /> Export CSV
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors"
            >
              <Plus className="h-4 w-4" /> Add Medicine
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
              <option value="ALL">All Racks / Shelves</option>
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
              <option value="Clinic Shelf">Clinic Shelf</option>
              <option value="Godown Storage">Godown Storage</option>
            </select>
          </div>
        </div>
      </div>

      {/* Full Table */}
      <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
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
                          <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">
                            {med.potency}
                          </span>
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

                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          med.storage_area === 'Godown Storage'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        }`}>
                          {med.storage_area || 'Clinic Shelf'}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-stone-700 dark:text-stone-300">
                        <div className="font-semibold">MRP: ₹{med.mrp || 0}</div>
                        <div className="text-[10px] text-stone-400">Cost: ₹{med.purchase_price || 0}</div>
                      </td>

                      <td className="py-3 px-3 text-stone-600 dark:text-stone-400">
                        <div>{med.manufacturer || 'SBL'}</div>
                        {med.supplier && <div className="text-[10px] text-stone-400">{med.supplier}</div>}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setDispenseMed(med)}
                          className="px-3 py-1.5 bg-stone-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 text-stone-700 dark:text-stone-300 rounded border border-stone-200 dark:border-slate-700 text-xs font-medium transition-colors"
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

      {/* Add Medicine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-xl max-h-[90vh] flex flex-col bg-[#FAF7EE] dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-emerald-900/20">
            <div className="p-4 border-b border-stone-200 dark:border-slate-800 flex justify-between items-center shrink-0">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-emerald-800 dark:text-emerald-400 uppercase">New Stock Record</span>
                <h3 className="font-bold text-lg text-stone-900 dark:text-white">Add Medicine</h3>
              </div>
              <button onClick={() => setShowAddModal(false)}><X className="h-5 w-5 text-stone-500" /></button>
            </div>

            <form onSubmit={handleAddMedicine} className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-600 dark:text-stone-400 mb-1">Medicine Name *</label>
                  <input
                    type="text"
                    list="remedy-datalist"
                    required
                    placeholder="e.g. Arnica Montana"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg text-sm text-stone-900 dark:text-white focus:ring-2 focus:ring-emerald-600"
                  />
                  <datalist id="remedy-datalist">
                    {COMMON_REMEDIES.map((r, i) => <option key={i} value={r} />)}
                  </datalist>
                </div>

                <div>
                  <label className="block font-semibold text-stone-600 dark:text-stone-400 mb-1">Potency</label>
                  <input
                    type="text"
                    placeholder="e.g. 30C, 200C, 1M, Q"
                    value={formData.potency}
                    onChange={(e) => setFormData({ ...formData, potency: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg text-sm text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-600 dark:text-stone-400 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg text-sm text-stone-900 dark:text-white"
                  >
                    <option value="Dilution">Dilution</option>
                    <option value="Mother Tincture">Mother Tincture</option>
                    <option value="Biochemic">Biochemic</option>
                    <option value="Trituration">Trituration</option>
                    <option value="Patent">Patent</option>
                    <option value="Bio-combination">Bio-combination</option>
                    <option value="External / Ointment">External / Ointment</option>
                    <option value="Tablets">Tablets</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-600 dark:text-stone-400 mb-1">Company / Manufacturer</label>
                  <input
                    type="text"
                    list="mfg-datalist"
                    placeholder="e.g. Dr. Reckeweg, SBL, Schwabe"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg text-sm text-stone-900 dark:text-white"
                  />
                  <datalist id="mfg-datalist">
                    {COMMON_MANUFACTURERS.map((m, i) => <option key={i} value={m} />)}
                  </datalist>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-600 dark:text-stone-400 mb-1">Supplier / Distributor (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Gupta Agencies, City Pharma"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg text-sm text-stone-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-600 dark:text-stone-400 mb-1">Rack Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. R005, Rack A-01"
                    value={formData.rack_location}
                    onChange={(e) => setFormData({ ...formData, rack_location: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg text-sm text-stone-900 dark:text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-600 dark:text-stone-400 mb-1">Batch Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. B-9982"
                    value={formData.batch_number}
                    onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg text-sm text-stone-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-600 dark:text-stone-400 mb-1">Storage Area</label>
                  <select
                    value={formData.storage_area}
                    onChange={(e) => setFormData({ ...formData, storage_area: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg text-sm text-stone-900 dark:text-white"
                  >
                    <option value="Clinic Shelf">Clinic Shelf (Dispensing)</option>
                    <option value="Godown Storage">Godown Storage (Bulk)</option>
                  </select>
                </div>
              </div>

              {/* Pack Size with Chips */}
              <div>
                <label className="block font-semibold text-stone-600 dark:text-stone-400 mb-1">Bottle / Pack Size</label>
                <input
                  type="text"
                  value={formData.bottle_size}
                  onChange={(e) => setFormData({ ...formData, bottle_size: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg text-sm text-stone-900 dark:text-white mb-1.5"
                />
                <div className="flex flex-wrap gap-1.5">
                  {BOTTLE_SIZE_PRESETS.map((size) => (
                    <button
                      type="button"
                      key={size}
                      onClick={() => setFormData({ ...formData, bottle_size: size })}
                      className="px-2 py-0.5 bg-stone-100 hover:bg-emerald-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 rounded text-[10px] font-medium border border-stone-200 dark:border-slate-700"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block font-semibold text-stone-600 dark:text-stone-400 mb-1">Stock Qty *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock_qty}
                    onChange={(e) => setFormData({ ...formData, stock_qty: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg text-sm text-stone-900 dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-600 dark:text-stone-400 mb-1">Low Alert</label>
                  <input
                    type="number"
                    value={formData.low_stock_alert}
                    onChange={(e) => setFormData({ ...formData, low_stock_alert: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg text-sm text-stone-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-600 dark:text-stone-400 mb-1">Cost (₹)</label>
                  <input
                    type="number"
                    value={formData.purchase_price}
                    onChange={(e) => setFormData({ ...formData, purchase_price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg text-sm text-stone-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-600 dark:text-stone-400 mb-1">MRP (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg text-sm text-stone-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-600 dark:text-stone-400 mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={formData.expiry_date}
                  onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg text-sm text-stone-900 dark:text-white"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-semibold shadow-md transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm">
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
                className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg text-base font-bold text-center text-stone-900 dark:text-white"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setDispenseMed(null)}
                className="flex-1 py-2 border border-stone-300 dark:border-slate-700 text-stone-600 dark:text-stone-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDispense}
                disabled={submitting}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium"
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

export default InventoryManager;