import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { 
  Search, Plus, RefreshCw, AlertTriangle, Package, 
  ChevronDown, ChevronUp, X, Filter, Building2, 
  MapPin, Calendar, CheckCircle2, Layers
} from 'lucide-react';

const COMMON_REMEDIES = [
  'Arnica Montana', 'Rhus Toxicodendron', 'Bryonia Alba', 'Nux Vomica',
  'Aconitum Napellus', 'Belladonna', 'Arsenicum Album', 'Pulsatilla',
  'Hepar Sulphuris', 'Lycopodium Clavatum', 'Sulphur', 'Calcarea Carbonica',
  'Chamomilla', 'Gelsemium', 'Ignatia Amara', 'Thuja Occidentalis',
  'Ledum Palustre', 'Hypericum Perforatum', 'Ruta Graveolens', 'Cantharis',
  'Silicea', 'Carbo Vegetabilis', 'Natrum Muriaticum', 'Phosphorus', 'Sepia',
  'Allium Cepa', 'Drosera', 'Berberis Vulgaris', 'Cinchona (China)', 'Staphysagria',
  'Colocynthis', 'Antimonium Tartaricum', 'Spongia Tosta', 'Causticum'
];

const COMMON_MANUFACTURERS = [
  'SBL Pvt Ltd', 'Dr. Reckeweg & Co (Germany)', 'Dr. Willmar Schwabe India (WSI)',
  'Boiron', "Bakson's Drugs & Pharmaceuticals", 'Medisynth', "Lord's Homoeopathic",
  'Haslab', 'Allen Homoeo', 'Wheezal', 'Dr. Hahnemann Laboratories'
];

export const InventoryManager: React.FC<any> = () => {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [dispenseMed, setDispenseMed] = useState<any | null>(null);
  const [dispenseQty, setDispenseQty] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // New Medicine Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Dilution',
    potency: '30C',
    bottle_size: '30ml',
    rack_location: '',
    stock_qty: 10,
    low_stock_alert: 5,
    storage_area: 'Clinic Shelf',
    mrp: 110,
    purchase_cost: 75,
    manufacturer: 'SBL Pvt Ltd',
    distributor: '',
    expiry_date: '2028-12-31'
  });

  // Fetch medicines from Supabase
  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('medicines')
        .select('*')
        .order('name', { ascending: true });

      if (!error && data) {
        setMedicines(data);
      }
    } catch (err) {
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();

    // Supabase Realtime Sync across all phones/tablets
    const channel = supabase
      .channel('medicines-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'medicines' }, () => {
        fetchMedicines();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Stock In: Add Medicine to Supabase
  const handleAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
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
        stock_qty: 10,
        low_stock_alert: 5,
        storage_area: 'Clinic Shelf',
        mrp: 110,
        purchase_cost: 75,
        manufacturer: 'SBL Pvt Ltd',
        distributor: '',
        expiry_date: '2028-12-31'
      });
      fetchMedicines();
    } catch (err: any) {
      alert('Error adding medicine: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Stock Out: Dispense Medicine
  const handleDispense = async () => {
    if (!dispenseMed) return;
    setSubmitting(true);
    try {
      const updatedQty = Math.max(0, (dispenseMed.stock_qty || 0) - Number(dispenseQty));

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

  // Filtered list
  const filtered = medicines.filter(m => {
    const matchesSearch = 
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.rack_location?.toLowerCase().includes(search.toLowerCase()) ||
      m.manufacturer?.toLowerCase().includes(search.toLowerCase());
    
    const isLow = (m.stock_qty || 0) <= (m.low_stock_alert || 5);
    return filterLowStock ? matchesSearch && isLow : matchesSearch;
  });

  const lowStockCount = medicines.filter(m => (m.stock_qty || 0) <= (m.low_stock_alert || 5)).length;
  const totalUnits = medicines.reduce((sum, m) => sum + (Number(m.stock_qty) || 0), 0);

  return (
    <div className="space-y-4 w-full max-w-full">
      {/* Metric Cards Banner */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-3 sm:p-4 rounded-xl shadow-sm">
          <div className="text-xs text-stone-500 font-medium">Catalog Items</div>
          <div className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white mt-1">
            {medicines.length}
          </div>
        </div>

        <div 
          onClick={() => setFilterLowStock(!filterLowStock)}
          className={`cursor-pointer border p-3 sm:p-4 rounded-xl shadow-sm transition-all ${
            filterLowStock 
              ? 'bg-rose-50 border-rose-300 dark:bg-rose-950/40 dark:border-rose-800' 
              : 'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-800'
          }`}
        >
          <div className="text-xs text-rose-600 font-semibold flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> Low Stock
          </div>
          <div className="text-xl sm:text-2xl font-bold text-rose-600 mt-1">
            {lowStockCount}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-3 sm:p-4 rounded-xl shadow-sm">
          <div className="text-xs text-stone-500 font-medium">Total Stock Units</div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">
            {totalUnits}
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-stone-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search medicine, rack, manufacturer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 text-stone-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={fetchMedicines}
            className="p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-lg border border-stone-200 dark:border-slate-700"
            title="Refresh Live Data"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Medicine
          </button>
        </div>
      </div>

      {/* Responsive Accordion Cards (Zero Horizontal Cut-Off) */}
      <div className="space-y-2.5">
        {loading && medicines.length === 0 ? (
          <div className="text-center py-12 text-stone-500 font-medium bg-white dark:bg-slate-900 rounded-xl border border-stone-200 dark:border-slate-800">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-emerald-600" />
            Loading Supabase Inventory...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-stone-400 bg-white dark:bg-slate-900 rounded-xl border border-stone-200 dark:border-slate-800">
            No medicines found matching criteria. Click "+ Add Medicine" to stock items.
          </div>
        ) : (
          filtered.map((med) => {
            const isExpanded = expandedId === med.id;
            const isLow = (med.stock_qty || 0) <= (med.low_stock_alert || 5);

            return (
              <div
                key={med.id}
                className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm transition-all"
              >
                {/* Header (Tap to Expand) */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : med.id)}
                  className="p-3.5 sm:p-4 cursor-pointer flex items-center justify-between gap-3 hover:bg-stone-50/70 dark:hover:bg-slate-800/60"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="font-bold text-stone-900 dark:text-white text-sm sm:text-base">
                        {med.name}
                      </span>
                      <span className="px-1.5 py-0.5 text-xs font-bold rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {med.potency}
                      </span>
                      <span className="text-xs text-stone-500 font-medium">
                        {med.bottle_size}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-500">
                      <span>Rack: <strong className="text-stone-800 dark:text-stone-200">{med.rack_location || 'N/A'}</strong></span>
                      <span>•</span>
                      <span>{med.storage_area}</span>
                    </div>
                  </div>

                  {/* Stock count & Chevron */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className={`text-sm sm:text-base font-bold ${isLow ? 'text-rose-600' : 'text-stone-900 dark:text-stone-100'}`}>
                        {med.stock_qty} <span className="text-xs font-normal text-stone-500">units</span>
                      </div>
                      {isLow && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-600 uppercase">
                          <AlertTriangle className="h-2.5 w-2.5" /> Low
                        </span>
                      )}
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-stone-400 shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-stone-400 shrink-0" />
                    )}
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="p-3.5 sm:p-4 pt-0 border-t border-stone-100 dark:border-slate-800 bg-stone-50/50 dark:bg-slate-900/40 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs pt-3 text-stone-600 dark:text-stone-400">
                      <div>
                        <span className="text-stone-400 block">Manufacturer:</span>
                        <strong className="text-stone-700 dark:text-stone-200">{med.manufacturer || 'N/A'}</strong>
                      </div>
                      <div>
                        <span className="text-stone-400 block">MRP / Cost:</span>
                        <strong className="text-stone-700 dark:text-stone-200">₹{med.mrp || 0} (Cost: ₹{med.purchase_cost || 0})</strong>
                      </div>
                      <div>
                        <span className="text-stone-400 block">Category:</span>
                        <strong className="text-stone-700 dark:text-stone-200">{med.category || 'Dilution'}</strong>
                      </div>
                      <div>
                        <span className="text-stone-400 block">Expiry Date:</span>
                        <strong className="text-stone-700 dark:text-stone-200">{med.expiry_date || 'N/A'}</strong>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDispenseMed(med);
                      }}
                      className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                      <Package className="h-4 w-4" /> Dispense / Stock Out
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Medicine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg max-h-[90vh] flex flex-col bg-[#FAF7EE] dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-emerald-900/20">
            <div className="p-4 border-b border-stone-200 dark:border-slate-800 flex justify-between items-center shrink-0">
              <h3 className="font-bold text-base sm:text-lg text-stone-900 dark:text-white">Add Medicine to Supabase</h3>
              <button onClick={() => setShowAddModal(false)}><X className="h-5 w-5 text-stone-500" /></button>
            </div>

            <form onSubmit={handleAddMedicine} className="flex-1 overflow-y-auto p-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Medicine Name *</label>
                <input
                  type="text"
                  list="remedies-autocomplete"
                  required
                  placeholder="e.g. Arnica Montana"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg text-sm text-stone-900 dark:text-white focus:ring-2 focus:ring-emerald-600"
                />
                <datalist id="remedies-autocomplete">
                  {COMMON_REMEDIES.map((r, i) => <option key={i} value={r} />)}
                </datalist>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Potency</label>
                  <input
                    type="text"
                    placeholder="e.g. 30C, 200C, Q"
                    value={formData.potency}
                    onChange={(e) => setFormData({ ...formData, potency: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg text-sm text-stone-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Bottle / Pack Size</label>
                  <input
                    type="text"
                    placeholder="e.g. 30ml, 500ml"
                    value={formData.bottle_size}
                    onChange={(e) => setFormData({ ...formData, bottle_size: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg text-sm text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Rack / Shelf</label>
                  <input
                    type="text"
                    placeholder="e.g. R005"
                    value={formData.rack_location}
                    onChange={(e) => setFormData({ ...formData, rack_location: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg text-sm text-stone-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Current Stock Qty</label>
                  <input
                    type="number"
                    value={formData.stock_qty}
                    onChange={(e) => setFormData({ ...formData, stock_qty: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg text-sm text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Manufacturer</label>
                <input
                  type="text"
                  list="mfg-autocomplete"
                  placeholder="e.g. SBL Pvt Ltd"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg text-sm text-stone-900 dark:text-white"
                />
                <datalist id="mfg-autocomplete">
                  {COMMON_MANUFACTURERS.map((m, i) => <option key={i} value={m} />)}
                </datalist>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">MRP Price (₹)</label>
                  <input
                    type="number"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg text-sm text-stone-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiry_date}
                    onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg text-sm text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-medium shadow-md transition-colors"
                >
                  {submitting ? 'Saving to Cloud...' : 'Save Medicine to Supabase'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dispense Modal */}
      {dispenseMed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-stone-200 dark:border-slate-800 p-5 space-y-4">
            <h3 className="font-bold text-base text-stone-900 dark:text-white">Dispense Medicine</h3>
            <p className="text-xs text-stone-500">
              Dispensing <strong className="text-stone-800 dark:text-stone-200">{dispenseMed.name} ({dispenseMed.potency})</strong>. 
              Available stock: {dispenseMed.stock_qty} units.
            </p>

            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">Quantity to Stock Out</label>
              <input
                type="number"
                min="1"
                max={dispenseMed.stock_qty}
                value={dispenseQty}
                onChange={(e) => setDispenseQty(Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg text-sm font-bold text-center text-stone-900 dark:text-white"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setDispenseMed(null)}
                className="flex-1 py-2 border border-stone-300 dark:border-slate-700 text-stone-600 dark:text-stone-300 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDispense}
                disabled={submitting}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium"
              >
                {submitting ? 'Updating...' : 'Confirm Stock Out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManager;