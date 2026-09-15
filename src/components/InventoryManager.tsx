import React, { useState, useMemo } from 'react';
import { 
  Boxes, 
  Plus, 
  Search, 
  FileSpreadsheet, 
  FileDown, 
  AlertTriangle, 
  ArrowRightLeft, 
  MinusCircle, 
  Edit3, 
  History, 
  Building2, 
  Layers, 
  Filter, 
  CheckCircle2, 
  X,
  Package,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  InventoryItem, 
  MedicineCategory, 
  StorageLocationType, 
  StockLog, 
  UserProfile 
} from '../types';
import { 
  getInventory, 
  getStockLogs, 
  addInventoryItem, 
  updateInventoryItem, 
  recordStockDeduction, 
  recordStockTransfer 
} from '../services/clinicStore';
import { exportInventoryToExcel, exportInventoryToCSV } from '../utils/exportUtils';

interface InventoryManagerProps {
  currentUser: UserProfile;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({ currentUser }) => {
  const inventory = getInventory();
  const stockLogs = getStockLogs();

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | MedicineCategory>('all');
  const [locationFilter, setLocationFilter] = useState<'all' | StorageLocationType>('all');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<'stock' | 'logs'>('stock');

  // Accordion card toggle state for tablet & mobile
  const [expandedCardIds, setExpandedCardIds] = useState<Record<string, boolean>>({});
  const toggleCardExpand = (id: string) => {
    setExpandedCardIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [transferringItem, setTransferringItem] = useState<InventoryItem | null>(null);
  const [dispensingItem, setDispensingItem] = useState<InventoryItem | null>(null);

  // Forms state
  const [transferQty, setTransferQty] = useState(5);
  const [transferReason, setTransferReason] = useState('Shelf replenishment from Godown');
  const [dispenseQty, setDispenseQty] = useState(1);
  const [dispenseReason, setDispenseReason] = useState('Manual clinic counter dispensing');
  const [successToast, setSuccessToast] = useState('');

  // Low stock calculation
  const lowStockCount = useMemo(() => {
    return inventory.filter((item) => item.stock_quantity <= item.low_stock_threshold).length;
  }, [inventory]);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return inventory.filter((item) => {
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
      if (locationFilter !== 'all' && item.storage_location !== locationFilter) return false;
      if (showLowStockOnly && item.stock_quantity > item.low_stock_threshold) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          item.medicine_name.toLowerCase().includes(q) ||
          item.potency.toLowerCase().includes(q) ||
          item.rack_location.toLowerCase().includes(q) ||
          item.company.toLowerCase().includes(q) ||
          (item.distributor && item.distributor.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    }).sort((a, b) => {
      // Sort by rack location, then medicine name
      if (a.rack_location < b.rack_location) return -1;
      if (a.rack_location > b.rack_location) return 1;
      return a.medicine_name.localeCompare(b.medicine_name);
    });
  }, [inventory, categoryFilter, locationFilter, showLowStockOnly, searchQuery]);

  // Handle Transfer Action
  const handleExecuteTransfer = () => {
    if (!transferringItem) return;
    const targetLoc: StorageLocationType =
      transferringItem.storage_location === 'godown' ? 'clinic_shelf' : 'godown';

    recordStockTransfer(
      transferringItem.id,
      Number(transferQty),
      transferringItem.storage_location,
      targetLoc,
      transferReason,
      currentUser.full_name
    );

    setSuccessToast(
      `Transferred ${transferQty} units of ${transferringItem.medicine_name} to ${
        targetLoc === 'clinic_shelf' ? 'Clinic Dispensing Shelf' : 'Godown Reserve'
      }`
    );
    setTransferringItem(null);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  // Handle Manual Dispensing Action
  const handleExecuteDispense = () => {
    if (!dispensingItem) return;
    recordStockDeduction(
      dispensingItem.id,
      Number(dispenseQty),
      dispenseReason,
      currentUser.full_name
    );

    setSuccessToast(`Dispensed ${dispenseQty} units of ${dispensingItem.medicine_name}`);
    setDispensingItem(null);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              <Boxes className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Homeopathic Medicine Inventory
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Dilutions, Mother Tinctures, Biochemics, Triturations & Patents with Rack-wise location & Godown Transfer
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Excel Export */}
          <button
            type="button"
            id="btn-export-excel"
            onClick={() => exportInventoryToExcel(filteredItems)}
            className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            title="Single-click export of inventory to Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel</span>
          </button>

          {/* CSV Export */}
          <button
            type="button"
            id="btn-export-csv"
            onClick={() => exportInventoryToCSV(filteredItems)}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            title="Export inventory to CSV"
          >
            <FileDown className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          {/* Add Medicine */}
          <button
            type="button"
            id="btn-add-new-medicine"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Medicine</span>
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">Total Catalog Medicines</span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{inventory.length}</span>
          <span className="text-[11px] text-slate-400 block">Across all categories & potencies</span>
        </div>

        {/* Low Stock Alert Metric */}
        <div 
          onClick={() => setShowLowStockOnly(!showLowStockOnly)}
          className={`p-5 rounded-2xl border shadow-sm space-y-1 cursor-pointer transition ${
            lowStockCount > 0
              ? 'bg-red-50/70 dark:bg-red-950/30 border-red-300 dark:border-red-800 ring-2 ring-red-500/20'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-700 dark:text-red-400">Urgent Low Stock Alert</span>
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-red-700 dark:text-red-400">{lowStockCount}</span>
            <span className="text-xs text-red-600 dark:text-red-300 font-medium">below threshold (&lt;5 units)</span>
          </div>
          <span className="text-[11px] text-red-600/80 block">Click to toggle low-stock view</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">Clinic Shelf Units</span>
          <span className="text-2xl font-extrabold text-[#1B4332] dark:text-emerald-400">
            {inventory.filter((i) => i.storage_location.toLowerCase().includes('shelf')).reduce((s, i) => s + i.stock_quantity, 0)}
          </span>
          <span className="text-[11px] text-slate-400 block">Immediate dispensing ready</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">Godown Reserve Units</span>
          <span className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-400">
            {inventory.filter((i) => i.storage_location.toLowerCase().includes('godown')).reduce((s, i) => s + i.stock_quantity, 0)}
          </span>
          <span className="text-[11px] text-slate-400 block">Bulk storage in back godown</span>
        </div>
      </div>

      {/* Tabs: Stock Catalog vs Stock Audit Logs */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-700 pb-2">
        <button
          onClick={() => setActiveTab('stock')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'stock'
              ? 'bg-[#1B4332] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Medicine Catalog ({filteredItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'logs'
              ? 'bg-[#1B4332] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Stock Movement & Audit Logs ({stockLogs.length})</span>
        </button>
      </div>

      {activeTab === 'stock' ? (
        <div className="space-y-4">
          {/* SEARCH & FILTER CONTROLS */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                id="inventory-search-input"
                type="text"
                placeholder="Search by remedy name, potency, rack (e.g. A-12), or brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
              >
                <option value="all">All Forms / Categories</option>
                <option value="dilution">Dilution</option>
                <option value="mother_tincture">Mother Tincture (Q)</option>
                <option value="biochemic">Biochemic</option>
                <option value="trituration">Trituration</option>
                <option value="patent">Patents / Syrups / Drops</option>
              </select>

              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
              >
                <option value="all">All Locations</option>
                <option value="clinic_shelf">Clinic Dispensing Shelf</option>
                <option value="godown">Godown Storage</option>
              </select>

              <button
                type="button"
                onClick={() => setShowLowStockOnly(!showLowStockOnly)}
                className={`px-3 py-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                  showLowStockOnly
                    ? 'bg-red-600 border-red-600 text-white'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Low Stock Only</span>
              </button>
            </div>
          </div>

          {/* 1. DESKTOP INVENTORY DATA TABLE (≥ 1024px / lg:block) */}
          <div className="hidden lg:block bg-white dark:bg-slate-800 rounded-3xl border border-emerald-950/10 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 uppercase font-bold">
                    <th className="py-3 px-4">Medicine & Potency</th>
                    <th className="py-3 px-4">Category & Size</th>
                    <th className="py-3 px-4">Rack / Shelf</th>
                    <th className="py-3 px-4">Current Stock</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">MRP / Cost</th>
                    <th className="py-3 px-4">Manufacturer</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filteredItems.map((item) => {
                    const isLow = item.stock_quantity <= item.low_stock_threshold;
                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-750 transition ${
                          isLow ? 'bg-red-50/40 dark:bg-red-950/20' : ''
                        }`}
                      >
                        {/* Name & Potency */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-bold text-slate-900 dark:text-white text-sm">
                            {item.medicine_name}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                              {item.potency}
                            </span>
                            {item.expiry_date && (
                              <span className="text-[10px] text-slate-400">
                                Exp: {item.expiry_date}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Category & Size */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-medium text-slate-800 dark:text-slate-200 capitalize block">
                            {item.category.replace('_', ' ')}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {item.bottle_size}
                          </span>
                        </td>

                        {/* Rack Location */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                            {item.rack_location}
                          </span>
                        </td>

                        {/* Current Stock with Urgent Red badge */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className={`font-extrabold text-sm ${isLow ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                              {item.stock_quantity} units
                            </span>
                            {isLow && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-600 text-white animate-pulse">
                                LOW (&lt;{item.low_stock_threshold})
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Storage Location */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                            item.storage_location === 'clinic_shelf'
                              ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-300'
                          }`}>
                            {item.storage_location === 'clinic_shelf' ? 'Clinic Shelf' : 'Godown Storage'}
                          </span>
                        </td>

                        {/* Financials */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-bold text-slate-900 dark:text-white block">
                            MRP: ₹{item.mrp}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Cost: ₹{item.purchase_cost}
                          </span>
                        </td>

                        {/* Company & Distributor */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                            {item.company}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate max-w-xs">
                            {item.distributor || 'Direct'}
                          </span>
                        </td>

                        {/* Action Controls */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Dispense button */}
                            <button
                              type="button"
                              onClick={() => setDispensingItem(item)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                              title="Direct dispense / Stock out"
                            >
                              <MinusCircle className="w-3.5 h-3.5" />
                              <span>Dispense</span>
                            </button>

                            {/* Move / Transfer between Godown and Shelf */}
                            <button
                              type="button"
                              onClick={() => setTransferringItem(item)}
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                              title={`Internal Transfer: ${item.storage_location === 'godown' ? 'Godown to Clinic Shelf' : 'Clinic Shelf to Godown'}`}
                            >
                              <ArrowRightLeft className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => setEditingItem(item)}
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                              title="Edit medicine details"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. TABLET & MOBILE ACCORDION CARDS (< 1024px / block lg:hidden) */}
          <div className="block lg:hidden space-y-3 w-full max-w-full">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 text-sm">
                No medicines matching current filters.
              </div>
            ) : (
              filteredItems.map((item) => {
                const isExpanded = !!expandedCardIds[item.id];
                const isLow = item.stock_quantity <= item.low_stock_threshold;
                const formattedCategory = item.category.replace('_', ' ');
                const formText = `${formattedCategory.charAt(0).toUpperCase() + formattedCategory.slice(1)} ${item.bottle_size}`;

                return (
                  <div
                    key={`mobile-card-${item.id}`}
                    className={`w-full max-w-full rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isLow
                        ? 'bg-white dark:bg-slate-800 border-red-300 dark:border-red-900/60 shadow-xs'
                        : 'bg-white dark:bg-slate-800 border-emerald-950/10 dark:border-slate-700 shadow-xs'
                    }`}
                  >
                    {/* Card Header (Always visible, 100% width) */}
                    <button
                      type="button"
                      onClick={() => toggleCardExpand(item.id)}
                      className="w-full max-w-full p-3.5 sm:p-4 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/70 dark:hover:bg-slate-750 transition"
                      aria-expanded={isExpanded}
                    >
                      <div className="flex-1 min-w-0 space-y-1.5">
                        {/* Top Row: Medicine Name in bold, Potency Badge, Form */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                            {item.medicine_name}
                          </span>
                          <span className="px-2 py-0.5 rounded-md font-mono font-bold text-[11px] bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                            {item.potency}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            {formText}
                          </span>
                        </div>

                        {/* Middle Row: Current Stock + Storage Area pill */}
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-xs sm:text-sm font-extrabold ${
                              isLow ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'
                            }`}>
                              {item.stock_quantity} units
                            </span>
                            {isLow && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-extrabold uppercase bg-red-600 text-white animate-pulse">
                                LOW (&lt;{item.low_stock_threshold})
                              </span>
                            )}
                          </div>

                          <span className="text-slate-300 dark:text-slate-600">•</span>

                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                            item.storage_location === 'clinic_shelf'
                              ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-300'
                          }`}>
                            {item.storage_location === 'clinic_shelf' ? 'Clinic Shelf' : 'Godown'}
                          </span>
                        </div>
                      </div>

                      {/* Right edge: Expand/collapse chevron icon */}
                      <div className="shrink-0 p-1.5 rounded-lg bg-stone-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </button>

                    {/* Card Expanded Body (Toggles smoothly on click/tap) */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 dark:border-slate-700/80 p-3.5 sm:p-4 bg-slate-50/70 dark:bg-slate-800/60 space-y-3.5 animate-fade-in">
                        {/* Two-column grid showing Rack, Manufacturer, MRP/Cost, Expiry */}
                        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-xs">
                          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/60">
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold block mb-0.5">
                              Rack / Shelf
                            </span>
                            <span className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100">
                              {item.rack_location}
                            </span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/60">
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold block mb-0.5">
                              Manufacturer
                            </span>
                            <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate block" title={item.company}>
                              {item.company}
                            </span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/60">
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold block mb-0.5">
                              MRP | Purchase Cost
                            </span>
                            <div className="flex items-center gap-1 font-bold text-xs text-slate-900 dark:text-slate-100">
                              <span>₹{item.mrp}</span>
                              <span className="text-slate-400 font-normal text-[11px]">| Cost: ₹{item.purchase_cost}</span>
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/60">
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold block mb-0.5">
                              Expiry Date
                            </span>
                            <span className="font-medium text-xs text-slate-700 dark:text-slate-300">
                              {item.expiry_date || 'Not specified'}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons Row: Full-width green "Dispense / Stock Out" button + Edit button */}
                        <div className="pt-1 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setDispensingItem(item)}
                            className="flex-1 py-2.5 px-3 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
                          >
                            <MinusCircle className="w-3.5 h-3.5" />
                            <span>Dispense / Stock Out</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setTransferringItem(item)}
                            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                            title={`Transfer to ${item.storage_location === 'godown' ? 'Clinic Shelf' : 'Godown'}`}
                          >
                            <ArrowRightLeft className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setEditingItem(item)}
                            className="py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* STOCK AUDIT LOGS VIEW */
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-emerald-950/10 dark:border-slate-700 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Inventory Movement & Audit History
            </h3>
            <span className="text-xs text-slate-500">Tracked stock out, refills, & godown transfers</span>
          </div>

          <div className="space-y-3">
            {stockLogs.map((log) => {
              const actionType = (log.action_type || log.type || 'dispense');
              const qty = log.quantity_changed ?? log.quantity_change ?? 0;
              const dateStr = log.timestamp || log.created_at || new Date().toISOString();
              return (
                <div
                  key={log.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                        actionType === 'dispense' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                        actionType === 'transfer' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                        'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}>
                        {actionType}
                      </span>
                      <strong className="text-slate-900 dark:text-white text-sm">{log.medicine_name}</strong>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                      Qty: <strong>{qty}</strong> • Reason: {log.reason}
                    </p>
                  </div>

                  <div className="text-right text-slate-400 text-[11px]">
                    <span>By: <strong className="text-slate-700 dark:text-slate-300">{log.performed_by}</strong></span>
                    <span className="block">{new Date(dateStr).toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL 1: ADD / EDIT MEDICINE */}
      {(isAddModalOpen || editingItem) && (
        <AddEditMedicineModal
          initialItem={editingItem}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingItem(null);
          }}
          onSave={(itemData) => {
            if (editingItem) {
              updateInventoryItem(editingItem.id, itemData);
              setSuccessToast(`Updated ${itemData.medicine_name}`);
            } else {
              addInventoryItem(itemData as any);
              setSuccessToast(`Added new medicine: ${itemData.medicine_name}`);
            }
            setIsAddModalOpen(false);
            setEditingItem(null);
            setTimeout(() => setSuccessToast(''), 4000);
          }}
        />
      )}

      {/* MODAL 2: TRANSFER STOCK (Godown <-> Clinic Shelf) */}
      {transferringItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-emerald-950/10 dark:border-slate-700 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-emerald-600" />
                <span>Internal Stock Transfer</span>
              </h3>
              <button onClick={() => setTransferringItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1">
              <p><strong>Medicine:</strong> {transferringItem.medicine_name} {transferringItem.potency}</p>
              <p><strong>Current Stock:</strong> {transferringItem.stock_quantity} units</p>
              <p><strong>Source Location:</strong> {transferringItem.storage_location === 'godown' ? 'Godown' : 'Clinic Shelf'}</p>
              <p><strong>Destination:</strong> {transferringItem.storage_location === 'godown' ? 'Clinic Dispensing Shelf' : 'Godown'}</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Units to Move *
                </label>
                <input
                  type="number"
                  min="1"
                  max={transferringItem.stock_quantity}
                  value={transferQty}
                  onChange={(e) => setTransferQty(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Transfer Audit Reason
                </label>
                <input
                  type="text"
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setTransferringItem(null)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteTransfer}
                className="w-1/2 py-2.5 rounded-xl bg-[#1B4332] text-white text-xs font-bold"
              >
                Confirm Move
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: MANUAL DISPENSE / STOCK OUT */}
      {dispensingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-emerald-950/10 dark:border-slate-700 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <MinusCircle className="w-5 h-5 text-emerald-600" />
                <span>Manual Dispense / Stock Out</span>
              </h3>
              <button onClick={() => setDispensingItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1">
              <p><strong>Medicine:</strong> {dispensingItem.medicine_name} {dispensingItem.potency}</p>
              <p><strong>Available Stock:</strong> {dispensingItem.stock_quantity} units</p>
              <p><strong>Rack:</strong> {dispensingItem.rack_location}</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Dispense Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  max={dispensingItem.stock_quantity}
                  value={dispenseQty}
                  onChange={(e) => setDispenseQty(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Reason for Dispensing
                </label>
                <input
                  type="text"
                  value={dispenseReason}
                  onChange={(e) => setDispenseReason(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDispensingItem(null)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDispense}
                className="w-1/2 py-2.5 rounded-xl bg-[#1B4332] text-white text-xs font-bold"
              >
                Dispense Units
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// SUBCOMPONENT: Add / Edit Medicine Modal
const AddEditMedicineModal: React.FC<{
  initialItem: InventoryItem | null;
  onClose: () => void;
  onSave: (itemData: Partial<InventoryItem>) => void;
}> = ({ initialItem, onClose, onSave }) => {
  const [name, setName] = useState(initialItem?.medicine_name || '');
  const [category, setCategory] = useState<MedicineCategory>(initialItem?.category || 'dilution');
  const [potency, setPotency] = useState(initialItem?.potency || '30C');
  const [bottleSize, setBottleSize] = useState(initialItem?.bottle_size || '30ml');
  const [rack, setRack] = useState(initialItem?.rack_location || 'Rack A-01');
  const [stock, setStock] = useState(initialItem?.stock_quantity ?? 10);
  const [threshold, setThreshold] = useState(initialItem?.low_stock_threshold ?? 5);
  const [mrp, setMrp] = useState(initialItem?.mrp ?? 110);
  const [cost, setCost] = useState(initialItem?.purchase_cost ?? 75);
  const [company, setCompany] = useState(initialItem?.company || 'Dr. Reckeweg & Co.');
  const [distributor, setDistributor] = useState(initialItem?.distributor || 'National Homeo Agency');
  const [storageLocation, setStorageLocation] = useState<StorageLocationType>(
    initialItem?.storage_location || 'clinic_shelf'
  );
  const [expiryDate, setExpiryDate] = useState(initialItem?.expiry_date || '2028-12-31');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      medicine_name: name,
      category,
      potency,
      bottle_size: bottleSize,
      rack_location: rack,
      stock_quantity: Number(stock),
      low_stock_threshold: Number(threshold),
      mrp: Number(mrp),
      purchase_cost: Number(cost),
      company,
      distributor,
      storage_location: storageLocation,
      expiry_date: expiryDate,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl my-6 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-950/10 dark:border-slate-700 p-6 sm:p-8 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            {initialItem ? 'Edit Medicine Details' : 'Add New Medicine to Catalog'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Medicine Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rhus Toxicodendron"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Form / Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium"
              >
                <option value="dilution">Dilution</option>
                <option value="mother_tincture">Mother Tincture (Q)</option>
                <option value="biochemic">Biochemic</option>
                <option value="trituration">Trituration</option>
                <option value="patent">Patent / Syrups / Drops</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Potency *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 30C, 200C, 1M, Q"
                value={potency}
                onChange={(e) => setPotency(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Bottle / Pack Size *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 30ml, 100ml, 450ml, 25g"
                value={bottleSize}
                onChange={(e) => setBottleSize(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Rack / Shelf Location *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rack A-12, Shelf B"
                value={rack}
                onChange={(e) => setRack(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Current Stock Qty *
              </label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Low-Stock Alert (&lt;) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-red-600"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Storage Area *
              </label>
              <select
                value={storageLocation}
                onChange={(e) => setStorageLocation(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium"
              >
                <option value="clinic_shelf">Clinic Dispensing Shelf</option>
                <option value="godown">Godown Reserve Storage</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                MRP (Selling Price ₹) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={mrp}
                onChange={(e) => setMrp(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Purchase Cost (₹)
              </label>
              <input
                type="number"
                min="0"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Company / Manufacturer *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. SBL, Dr. Reckeweg, Schwabe"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Distributor / Vendor
              </label>
              <input
                type="text"
                placeholder="e.g. Kolkata Homoeo Depot"
                value={distributor}
                onChange={(e) => setDistributor(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-3 rounded-xl bg-[#1B4332] text-white text-xs font-bold shadow-md"
            >
              Save Medicine Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
