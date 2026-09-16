import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  Receipt, 
  Calendar, 
  Filter, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Search, 
  Printer, 
  Eye, 
  X, 
  RefreshCw, 
  CreditCard, 
  Banknote, 
  Stethoscope, 
  Pill, 
  Sun, 
  Moon, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { Invoice, UserProfile, ShiftType, PaymentMode } from '../types';
import { getInvoices, fetchInvoicesFromSupabase, refreshInvoices, subscribeToStore } from '../services/clinicStore';

interface SalesSummaryProps {
  currentUser: UserProfile;
  onOpenInvoiceModal?: (invoice: Invoice) => void;
}

type TimePeriod = 'today' | 'week' | 'month' | 'year' | 'custom';
type ShiftFilter = 'all' | 'morning' | 'evening';
type RevenueView = 'combined' | 'medicine' | 'consultation';
type PaymentFilter = 'all' | 'cash' | 'online';

export const SalesSummary: React.FC<SalesSummaryProps> = ({
  currentUser,
}) => {
  const [invoices, setInvoices] = useState<Invoice[]>(() => getInvoices());
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Filters State
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('today');
  const [shiftFilter, setShiftFilter] = useState<ShiftFilter>('all');
  const [revenueView, setRevenueView] = useState<RevenueView>('combined');
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Custom date range state (default to today)
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [customStartDate, setCustomStartDate] = useState(todayStr);
  const [customEndDate, setCustomEndDate] = useState(todayStr);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Viewing/Reprinting Invoice modal state
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [printFormat, setPrintFormat] = useState<'thermal-80' | 'a4-standard'>('thermal-80');

  // Load and subscribe to real-time invoice updates
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      try {
        const data = await fetchInvoicesFromSupabase();
        if (isMounted) {
          setInvoices(data);
          setLastRefreshed(new Date());
        }
      } catch (err) {
        console.warn('SalesSummary fetch error:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();

    const unsubscribe = subscribeToStore((event) => {
      if (event.type === 'invoices' && Array.isArray(event.data)) {
        if (isMounted) {
          setInvoices(event.data);
          setLastRefreshed(new Date());
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const handleManualRefresh = async () => {
    setIsLoading(true);
    try {
      const data = await refreshInvoices();
      setInvoices(data);
      setLastRefreshed(new Date());
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to format ISO date to YYYY-MM-DD in local time
  const getLocalDateString = (dateInput: string | Date): string => {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Filter Invoices
  const filteredInvoices = useMemo(() => {
    const now = new Date();
    const todayLocalStr = getLocalDateString(now);

    return invoices.filter((inv) => {
      const invDate = new Date(inv.created_at || Date.now());
      const invLocalStr = getLocalDateString(invDate);

      // 1. Time Period Filter
      if (timePeriod === 'today') {
        if (invLocalStr !== todayLocalStr) return false;
        // Shift sub-filter for Today
        if (shiftFilter !== 'all') {
          const invShift = inv.shift || (invDate.getHours() < 14 ? 'morning' : 'evening');
          if (invShift !== shiftFilter) return false;
        }
      } else if (timePeriod === 'week') {
        // Last 7 days
        const diffDays = (now.getTime() - invDate.getTime()) / (1000 * 3600 * 24);
        if (diffDays < 0 || diffDays > 7) return false;
      } else if (timePeriod === 'month') {
        // Current Month
        if (invDate.getFullYear() !== now.getFullYear() || invDate.getMonth() !== now.getMonth()) {
          return false;
        }
      } else if (timePeriod === 'year') {
        // Current Year
        if (invDate.getFullYear() !== now.getFullYear()) {
          return false;
        }
      } else if (timePeriod === 'custom') {
        if (customStartDate && invLocalStr < customStartDate) return false;
        if (customEndDate && invLocalStr > customEndDate) return false;
      }

      // 2. Payment Mode Filter
      const pMode = (inv.payment_mode || 'cash').toLowerCase();
      if (paymentFilter === 'cash' && pMode !== 'cash') return false;
      if (paymentFilter === 'online' && pMode !== 'upi' && pMode !== 'card') return false;

      // 3. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = (inv.patient_name || '').toLowerCase().includes(query);
        const matchesPhone = (inv.phone || '').includes(query);
        const matchesInvNum = (inv.invoice_number || '').toLowerCase().includes(query);
        const matchesId = (inv.patient_id || '').toLowerCase().includes(query);
        if (!matchesName && !matchesPhone && !matchesInvNum && !matchesId) {
          return false;
        }
      }

      return true;
    });
  }, [invoices, timePeriod, shiftFilter, paymentFilter, searchQuery, customStartDate, customEndDate]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [timePeriod, shiftFilter, revenueView, paymentFilter, searchQuery, customStartDate, customEndDate, pageSize]);

  // KPI Calculations
  const metrics = useMemo(() => {
    let totalGross = 0;
    let totalConsultation = 0;
    let totalMedicine = 0;
    let cashRevenue = 0;
    let onlineRevenue = 0;
    let morningSales = 0;
    let morningPatients = 0;
    let eveningSales = 0;
    let eveningPatients = 0;

    filteredInvoices.forEach((inv) => {
      const gross = Number(inv.total_amount) || 0;
      const consFee = Number(inv.consultation_fee) || 0;
      const medFee = inv.medicine_total !== undefined && inv.medicine_total !== null
        ? Number(inv.medicine_total)
        : Math.max(0, gross - consFee);

      totalGross += gross;
      totalConsultation += consFee;
      totalMedicine += medFee;

      const pMode = (inv.payment_mode || 'cash').toLowerCase();
      if (pMode === 'cash') {
        cashRevenue += gross;
      } else {
        onlineRevenue += gross;
      }

      const invDate = new Date(inv.created_at || Date.now());
      const shift = inv.shift || (invDate.getHours() < 14 ? 'morning' : 'evening');
      if (shift === 'morning') {
        morningSales += gross;
        morningPatients += 1;
      } else {
        eveningSales += gross;
        eveningPatients += 1;
      }
    });

    const cashPercentage = totalGross > 0 ? Math.round((cashRevenue / totalGross) * 100) : 0;
    const onlinePercentage = totalGross > 0 ? Math.round((onlineRevenue / totalGross) * 100) : 0;
    const medPercentage = totalGross > 0 ? Math.round((totalMedicine / totalGross) * 100) : 0;
    const consPercentage = totalGross > 0 ? Math.round((totalConsultation / totalGross) * 100) : 0;

    return {
      totalGross,
      totalConsultation,
      totalMedicine,
      cashRevenue,
      onlineRevenue,
      cashPercentage,
      onlinePercentage,
      medPercentage,
      consPercentage,
      morningSales,
      morningPatients,
      eveningSales,
      eveningPatients,
      invoiceCount: filteredInvoices.length,
    };
  }, [filteredInvoices]);

  // Paginated Invoices
  const paginatedInvoices = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return filteredInvoices.slice(startIdx, startIdx + pageSize);
  }, [filteredInvoices, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / pageSize));

  // Export to Excel (.xlsx)
  const handleExportExcel = () => {
    if (filteredInvoices.length === 0) {
      alert('No invoice records found to export for the current filters.');
      return;
    }

    const exportData = filteredInvoices.map((inv) => {
      const invDate = new Date(inv.created_at || Date.now());
      const consFee = Number(inv.consultation_fee) || 0;
      const medFee = inv.medicine_total !== undefined && inv.medicine_total !== null
        ? Number(inv.medicine_total)
        : Math.max(0, (Number(inv.total_amount) || 0) - consFee);
      const shift = inv.shift || (invDate.getHours() < 14 ? 'morning' : 'evening');

      return {
        'Date': invDate.toLocaleDateString('en-IN'),
        'Time': invDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        'Shift': shift === 'morning' ? 'Morning Shift' : 'Evening Shift',
        'Invoice ID': inv.invoice_number,
        'Patient ID': inv.patient_id,
        'Patient Name': inv.patient_name,
        'Phone': inv.phone || 'N/A',
        'Doctor Fee (₹)': consFee,
        'Medicine Amount (₹)': medFee,
        'Discount (₹)': Number(inv.discount) || 0,
        'Grand Total (₹)': Number(inv.total_amount) || 0,
        'Payment Mode': (inv.payment_mode || 'cash').toUpperCase(),
        'Payment Status': (inv.payment_status || 'PAID').toUpperCase(),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Auto-fit column widths
    const colWidths = [
      { wch: 12 }, // Date
      { wch: 10 }, // Time
      { wch: 15 }, // Shift
      { wch: 18 }, // Invoice ID
      { wch: 14 }, // Patient ID
      { wch: 22 }, // Patient Name
      { wch: 14 }, // Phone
      { wch: 14 }, // Doctor Fee
      { wch: 18 }, // Medicine Amount
      { wch: 12 }, // Discount
      { wch: 16 }, // Grand Total
      { wch: 14 }, // Payment Mode
      { wch: 14 }, // Payment Status
    ];
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Summary');

    const fileName = `HomoeoHealthCare_Sales_${timePeriod}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredInvoices.length === 0) {
      alert('No invoice records found to export for the current filters.');
      return;
    }

    const headers = [
      'Date',
      'Time',
      'Shift',
      'Invoice ID',
      'Patient ID',
      'Patient Name',
      'Phone',
      'Doctor Fee (INR)',
      'Medicine Amount (INR)',
      'Discount (INR)',
      'Grand Total (INR)',
      'Payment Mode',
      'Payment Status'
    ];

    const rows = filteredInvoices.map((inv) => {
      const invDate = new Date(inv.created_at || Date.now());
      const consFee = Number(inv.consultation_fee) || 0;
      const medFee = inv.medicine_total !== undefined && inv.medicine_total !== null
        ? Number(inv.medicine_total)
        : Math.max(0, (Number(inv.total_amount) || 0) - consFee);
      const shift = inv.shift || (invDate.getHours() < 14 ? 'morning' : 'evening');

      return [
        `"${invDate.toLocaleDateString('en-IN')}"`,
        `"${invDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}"`,
        `"${shift === 'morning' ? 'Morning Shift' : 'Evening Shift'}"`,
        `"${inv.invoice_number}"`,
        `"${inv.patient_id}"`,
        `"${(inv.patient_name || '').replace(/"/g, '""')}"`,
        `"${inv.phone || ''}"`,
        consFee,
        medFee,
        Number(inv.discount) || 0,
        Number(inv.total_amount) || 0,
        `"${(inv.payment_mode || 'cash').toUpperCase()}"`,
        `"${(inv.payment_status || 'PAID').toUpperCase()}"`,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `HomoeoHealthCare_Sales_${timePeriod}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const triggerPrintModal = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 dark:text-slate-100">
      {/* 1. Header Banner & Top Controls */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#1B4332] via-[#2D6A4F] to-[#1B4332] text-white shadow-xl shadow-emerald-950/15 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-emerald-100 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Financial & Revenue Analytics
            </span>
            <span className="text-xs text-emerald-200 hidden sm:inline">
              Live Supabase Integration
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Sales Summary & Chamber Analytics
          </h2>
          <p className="text-xs text-emerald-100/90 font-medium">
            Real-time tracking of Doctor Consultation Fees, Dispensed Medicine Sales & Shift Collections
          </p>
        </div>

        {/* Action Controls & Export Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <button
            id="btn-refresh-sales"
            type="button"
            onClick={handleManualRefresh}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Refresh from Supabase"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            id="btn-export-csv"
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-300" />
            <span>Export CSV</span>
          </button>

          <button
            id="btn-export-excel"
            type="button"
            onClick={handleExportExcel}
            className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-[#1B4332] text-xs font-extrabold shadow-md shadow-emerald-950/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* 2. Filter & Timeframe Controller Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Time Period Selector Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-700/60 overflow-x-auto max-w-full">
            {(
              [
                { id: 'today', label: 'Today' },
                { id: 'week', label: 'This Week' },
                { id: 'month', label: 'This Month' },
                { id: 'year', label: 'This Year' },
                { id: 'custom', label: 'Custom Range' },
              ] as { id: TimePeriod; label: string }[]
            ).map((tab) => {
              const active = timePeriod === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-period-${tab.id}`}
                  type="button"
                  onClick={() => setTimePeriod(tab.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    active
                      ? 'bg-[#1B4332] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Revenue View Toggle */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-semibold text-[11px] hidden sm:inline">
              View Focus:
            </span>
            <div className="flex p-0.5 rounded-lg bg-slate-100 dark:bg-slate-700/60">
              <button
                type="button"
                id="toggle-rev-combined"
                onClick={() => setRevenueView('combined')}
                className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition cursor-pointer ${
                  revenueView === 'combined'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Combined Total
              </button>
              <button
                type="button"
                id="toggle-rev-medicine"
                onClick={() => setRevenueView('medicine')}
                className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition cursor-pointer ${
                  revenueView === 'medicine'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Medicines Only
              </button>
              <button
                type="button"
                id="toggle-rev-consult"
                onClick={() => setRevenueView('consultation')}
                className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition cursor-pointer ${
                  revenueView === 'consultation'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Doctor Fee Only
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Row: Shift Selector (when Today is active), Payment Mode & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
          <div className="flex flex-wrap items-center gap-3">
            {/* Instant Toggle for Today: All Day / Morning / Evening */}
            {timePeriod === 'today' && (
              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-semibold text-[11px]">
                  Today Shift:
                </span>
                <div className="flex p-0.5 rounded-lg bg-emerald-50 dark:bg-slate-700 border border-emerald-200 dark:border-slate-600">
                  <button
                    type="button"
                    onClick={() => setShiftFilter('all')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                      shiftFilter === 'all'
                        ? 'bg-[#1B4332] text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-emerald-100/50'
                    }`}
                  >
                    All Day
                  </button>
                  <button
                    type="button"
                    onClick={() => setShiftFilter('morning')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
                      shiftFilter === 'morning'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-amber-700 dark:text-amber-300 hover:bg-amber-100/50'
                    }`}
                  >
                    <Sun className="w-3 h-3" />
                    Morning Shift
                  </button>
                  <button
                    type="button"
                    onClick={() => setShiftFilter('evening')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
                      shiftFilter === 'evening'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100/50'
                    }`}
                  >
                    <Moon className="w-3 h-3" />
                    Evening Shift
                  </button>
                </div>
              </div>
            )}

            {/* Custom Date Range Picker */}
            {timePeriod === 'custom' && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-semibold text-[11px]">
                  Range:
                </span>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-white"
                />
                <span className="text-slate-400">to</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-white"
                />
              </div>
            )}

            {/* Payment Mode Filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-semibold text-[11px]">
                Payment:
              </span>
              <select
                id="select-payment-filter"
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value as PaymentFilter)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                <option value="all">All Modes</option>
                <option value="cash">Cash Only</option>
                <option value="online">Online Only (UPI / Card)</option>
              </select>
            </div>
          </div>

          {/* Quick Search Field */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              id="input-sales-search"
              placeholder="Search invoice, patient, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/60 text-xs focus:ring-2 focus:ring-[#1B4332] outline-hidden placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Real-Time KPI Summary Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tile 1: Total Gross Revenue */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] text-white shadow-md shadow-emerald-950/15 relative overflow-hidden">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
              Total Gross Revenue
            </span>
            <span className="p-2 rounded-xl bg-white/10 text-emerald-200">
              <TrendingUp className="w-5 h-5" />
            </span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black tracking-tight">
              ₹{metrics.totalGross.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-emerald-100/80 font-medium flex items-center gap-1.5">
              <span>{metrics.invoiceCount} invoices generated</span>
              <span>•</span>
              <span className="capitalize">{timePeriod}</span>
            </div>
          </div>
          {/* Subtle Progress Bar */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-100/90 font-medium">
            <span>Fees: ₹{metrics.totalConsultation.toLocaleString('en-IN')}</span>
            <span>Meds: ₹{metrics.totalMedicine.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Tile 2: Total Medicine Sales */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Medicine Sales
            </span>
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300">
              <Pill className="w-5 h-5" />
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              ₹{metrics.totalMedicine.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {metrics.medPercentage}%
              </span>
              <span>of gross clinic sales</span>
            </div>
          </div>
          <div className="pt-2">
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${metrics.medPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tile 3: Total Consultation Fees */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Consultation Fees
            </span>
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300">
              <Stethoscope className="w-5 h-5" />
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              ₹{metrics.totalConsultation.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
              <span className="font-bold text-blue-700 dark:text-blue-400">
                {metrics.consPercentage}%
              </span>
              <span>of gross clinic sales</span>
            </div>
          </div>
          <div className="pt-2">
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${metrics.consPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tile 4: Payment Mode Split */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Payment Mode Split
            </span>
            <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300">
              <CreditCard className="w-5 h-5" />
            </span>
          </div>

          <div className="space-y-2">
            {/* Cash Row */}
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                Cash
              </span>
              <div className="text-right">
                <span className="font-bold font-mono text-slate-900 dark:text-white">
                  ₹{metrics.cashRevenue.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-slate-400 ml-1.5">
                  ({metrics.cashPercentage}%)
                </span>
              </div>
            </div>

            {/* Online Row */}
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
                UPI / Online
              </span>
              <div className="text-right">
                <span className="font-bold font-mono text-slate-900 dark:text-white">
                  ₹{metrics.onlineRevenue.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-slate-400 ml-1.5">
                  ({metrics.onlinePercentage}%)
                </span>
              </div>
            </div>
          </div>

          {/* Split bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-600 h-full transition-all duration-500"
              style={{ width: `${metrics.cashPercentage}%` }}
              title={`Cash: ${metrics.cashPercentage}%`}
            />
            <div
              className="bg-indigo-600 h-full transition-all duration-500"
              style={{ width: `${metrics.onlinePercentage}%` }}
              title={`Online: ${metrics.onlinePercentage}%`}
            />
          </div>
        </div>
      </div>

      {/* Shift Comparison Banner (Always displayed, especially detailed for Daily view) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 dark:bg-slate-800/80 border border-emerald-100 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-700 text-[#1B4332] dark:text-emerald-400 shadow-xs">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Shift Breakdown & Performance
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Comparative morning vs. evening chamber footfall and collections
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 text-xs">
          {/* Morning Shift */}
          <div className="p-3 rounded-xl bg-white dark:bg-slate-700/80 border border-amber-200/70 dark:border-slate-600 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
              <Sun className="w-4 h-4 text-amber-600" />
              Morning Shift
            </div>
            <div className="text-lg font-black font-mono text-slate-900 dark:text-white">
              ₹{metrics.morningSales.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {metrics.morningPatients} patient{metrics.morningPatients !== 1 ? 's' : ''} billed
            </div>
          </div>

          {/* Evening Shift */}
          <div className="p-3 rounded-xl bg-white dark:bg-slate-700/80 border border-indigo-200/70 dark:border-slate-600 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-indigo-800 dark:text-indigo-300">
              <Moon className="w-4 h-4 text-indigo-600" />
              Evening Shift
            </div>
            <div className="text-lg font-black font-mono text-slate-900 dark:text-white">
              ₹{metrics.eveningSales.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {metrics.eveningPatients} patient{metrics.eveningPatients !== 1 ? 's' : ''} billed
            </div>
          </div>
        </div>
      </div>

      {/* 4. Detailed Sales Breakdown Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 shadow-xs overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#1B4332] dark:text-emerald-400" />
              Transaction Ledger
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing {filteredInvoices.length} matching sales record{filteredInvoices.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Page size selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700 text-xs font-semibold cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {/* Empty State */}
        {filteredInvoices.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-400 flex items-center justify-center mx-auto">
              <Receipt className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 dark:text-white text-base">
                No sales records found
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                No sales records found for this selected period/shift. Try adjusting your filters or search query.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setTimePeriod('today');
                setShiftFilter('all');
                setPaymentFilter('all');
                setRevenueView('combined');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-100 dark:bg-slate-700 text-[#1B4332] dark:text-emerald-300 text-xs font-bold hover:bg-emerald-200 transition cursor-pointer"
            >
              Reset Filters to Today
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100 dark:border-slate-700">
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-3">Shift</th>
                  <th className="py-3 px-3">Invoice / Token</th>
                  <th className="py-3 px-4">Patient Name & Phone</th>
                  {(revenueView === 'combined' || revenueView === 'consultation') && (
                    <th className="py-3 px-3 text-right">Doctor Fee (₹)</th>
                  )}
                  {(revenueView === 'combined' || revenueView === 'medicine') && (
                    <th className="py-3 px-3 text-right">Medicine (₹)</th>
                  )}
                  <th className="py-3 px-4 text-right">Grand Total (₹)</th>
                  <th className="py-3 px-3 text-center">Payment Mode</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {paginatedInvoices.map((inv) => {
                  const invDate = new Date(inv.created_at || Date.now());
                  const consFee = Number(inv.consultation_fee) || 0;
                  const medFee = inv.medicine_total !== undefined && inv.medicine_total !== null
                    ? Number(inv.medicine_total)
                    : Math.max(0, (Number(inv.total_amount) || 0) - consFee);
                  const shift = inv.shift || (invDate.getHours() < 14 ? 'morning' : 'evening');
                  const pMode = (inv.payment_mode || 'cash').toLowerCase();

                  return (
                    <tr 
                      key={inv.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-700/40 transition-colors"
                    >
                      {/* Date & Time */}
                      <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                        <div className="font-bold">
                          {invDate.toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {invDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      {/* Shift Badge */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {shift === 'morning' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                            <Sun className="w-3 h-3" />
                            Morning
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300">
                            <Moon className="w-3 h-3" />
                            Evening
                          </span>
                        )}
                      </td>

                      {/* Invoice ID */}
                      <td className="py-3.5 px-3 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                          {inv.invoice_number}
                        </span>
                      </td>

                      {/* Patient Name & Phone */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {inv.patient_name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          {inv.phone || inv.patient_id}
                        </div>
                      </td>

                      {/* Doctor Fee */}
                      {(revenueView === 'combined' || revenueView === 'consultation') && (
                        <td className="py-3.5 px-3 text-right font-mono font-semibold text-slate-700 dark:text-slate-300">
                          ₹{consFee.toLocaleString('en-IN')}
                        </td>
                      )}

                      {/* Medicine Amount */}
                      {(revenueView === 'combined' || revenueView === 'medicine') && (
                        <td className="py-3.5 px-3 text-right font-mono font-semibold text-slate-700 dark:text-slate-300">
                          ₹{medFee.toLocaleString('en-IN')}
                        </td>
                      )}

                      {/* Grand Total */}
                      <td className="py-3.5 px-4 text-right font-mono font-black text-sm text-[#1B4332] dark:text-emerald-400">
                        ₹{(Number(inv.total_amount) || 0).toLocaleString('en-IN')}
                      </td>

                      {/* Payment Mode Badge */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        {pMode === 'cash' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                            <Banknote className="w-3 h-3" />
                            Cash
                          </span>
                        ) : pMode === 'upi' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300">
                            <CreditCard className="w-3 h-3" />
                            UPI
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300">
                            <CreditCard className="w-3 h-3" />
                            Card
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          id={`btn-view-invoice-${inv.id}`}
                          onClick={() => setSelectedInvoice(inv)}
                          className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-[#1B4332] hover:text-white dark:hover:bg-emerald-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1 mx-auto cursor-pointer"
                          title="View / Reprint Invoice"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Reprint</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {filteredInvoices.length > 0 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
            <div>
              Showing <strong className="text-slate-800 dark:text-white font-mono">{(currentPage - 1) * pageSize + 1}</strong> to{' '}
              <strong className="text-slate-800 dark:text-white font-mono">
                {Math.min(currentPage * pageSize, filteredInvoices.length)}
              </strong>{' '}
              of <strong className="text-slate-800 dark:text-white font-mono">{filteredInvoices.length}</strong> transactions
            </div>

            <div className="flex items-center gap-1.5 self-center">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-3 py-1 font-bold text-slate-800 dark:text-white text-xs">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. View / Reprint Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-emerald-50/50 dark:bg-slate-800/50 no-print">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#1B4332] dark:text-emerald-400">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    Invoice Details & Reprint
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {selectedInvoice.invoice_number} • {selectedInvoice.patient_name}
                  </p>
                </div>
              </div>

              {/* Format switcher & Close */}
              <div className="flex items-center gap-2">
                <div className="p-0.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-xs hidden sm:flex">
                  <button
                    type="button"
                    onClick={() => setPrintFormat('thermal-80')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                      printFormat === 'thermal-80'
                        ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Thermal POS (80mm)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrintFormat('a4-standard')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                      printFormat === 'a4-standard'
                        ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    A4 Voucher
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Preview Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100 dark:bg-slate-950/50 flex justify-center items-start">
              {printFormat === 'thermal-80' ? (
                /* Thermal 80mm Layout */
                <div className="printable-area w-[300px] sm:w-[320px] bg-white text-black p-4 rounded-xl shadow-md border border-slate-200 text-xs font-mono space-y-3">
                  <div className="text-center space-y-0.5 border-b border-dashed border-black pb-2">
                    <h2 className="text-sm font-black uppercase tracking-wider">HOMOEO HEALTH CARE</h2>
                    <p className="text-[11px] font-bold">DR. M. A. HAQUE, M.D. (Homoeo)</p>
                    <p className="text-[9px] text-slate-600">Salbagan Road, Benachity, Durgapur</p>
                    <p className="text-[9px] text-slate-600">Helpline: +91 99335 06514</p>
                  </div>

                  <div className="text-[10px] space-y-0.5 border-b border-dashed border-black pb-2">
                    <div className="flex justify-between">
                      <span>Receipt No:</span>
                      <strong className="font-bold">{selectedInvoice.invoice_number}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span>
                        {new Date(selectedInvoice.created_at).toLocaleDateString('en-IN')}{' '}
                        {new Date(selectedInvoice.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shift:</span>
                      <span className="uppercase font-bold">{selectedInvoice.shift || 'MORNING'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Patient:</span>
                      <strong className="truncate max-w-[170px]">{selectedInvoice.patient_name}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Mobile:</span>
                      <span>{selectedInvoice.phone || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment:</span>
                      <strong className="uppercase">{selectedInvoice.payment_mode} (PAID)</strong>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="space-y-1 text-[10px] border-b border-dashed border-black pb-2">
                    <div className="flex justify-between font-bold border-b border-slate-300 pb-1">
                      <span>Particulars</span>
                      <span>Amount</span>
                    </div>
                    <div className="flex justify-between">
                      <span>1. Dr. Consultation Fee</span>
                      <span className="font-bold">₹{selectedInvoice.consultation_fee || 200}</span>
                    </div>
                    {selectedInvoice.items &&
                      selectedInvoice.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span className="truncate max-w-[200px]">
                            {idx + 2}. {item.item_description || item.medicine_name || 'Dispensed Remedy'}
                          </span>
                          <span className="font-bold">₹{item.price || item.total_price}</span>
                        </div>
                      ))}
                  </div>

                  {/* Total Calculations */}
                  <div className="space-y-1 text-[11px] font-bold">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{(selectedInvoice.total_amount || 0) + (selectedInvoice.discount || 0)}</span>
                    </div>
                    {selectedInvoice.discount > 0 && (
                      <div className="flex justify-between text-slate-600">
                        <span>Discount:</span>
                        <span>-₹{selectedInvoice.discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-black pt-1 border-t border-black">
                      <span>TOTAL PAID:</span>
                      <span>₹{selectedInvoice.total_amount}</span>
                    </div>
                  </div>

                  <div className="text-center text-[9px] border-t border-dashed border-black pt-2 text-slate-600 space-y-0.5">
                    <p className="font-bold">Pure Hahnemannian Homeopathy</p>
                    <p>Wishing you rapid, gentle & permanent cure.</p>
                  </div>
                </div>
              ) : (
                /* A4 Clinical Voucher Layout */
                <div className="printable-area w-full max-w-[620px] bg-white text-slate-900 p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-300 text-xs space-y-4">
                  <div className="flex justify-between items-start border-b-2 border-[#1B4332] pb-3">
                    <div>
                      <h2 className="text-lg font-black text-[#1B4332] uppercase tracking-wide">
                        HOMOEO HEALTH CARE
                      </h2>
                      <p className="text-xs font-bold text-slate-700">Dr. M. A. Haque, M.D. (Homoeo)</p>
                      <p className="text-[11px] text-slate-500">Salbagan Road, Benachity, Durgapur - 713213</p>
                      <p className="text-[11px] text-slate-500">Chamber Phone: +91 99335 06514</p>
                    </div>

                    <div className="text-right">
                      <span className="inline-block px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 font-extrabold text-[11px] uppercase tracking-wider mb-1">
                        OFFICIAL PAYMENT RECEIPT
                      </span>
                      <div className="text-xs text-slate-500">
                        Invoice No: <strong className="text-slate-900 font-mono">{selectedInvoice.invoice_number}</strong>
                      </div>
                      <div className="text-xs text-slate-500">
                        Date: <strong className="text-slate-900">{new Date(selectedInvoice.created_at).toLocaleDateString('en-IN')}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Patient Info Card */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Patient Details</span>
                      <div className="font-bold text-sm text-slate-900">{selectedInvoice.patient_name}</div>
                      <div className="text-slate-600 font-mono">Mobile: {selectedInvoice.phone || 'N/A'}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Patient ID / Shift</span>
                      <div className="font-bold font-mono text-emerald-800">{selectedInvoice.patient_id}</div>
                      <div className="text-slate-600">
                        Payment: <strong className="uppercase">{selectedInvoice.payment_mode} (PAID)</strong>
                      </div>
                    </div>
                  </div>

                  {/* Table of items */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 text-[11px] font-bold uppercase border-b border-slate-200">
                          <th className="py-2 px-3">#</th>
                          <th className="py-2 px-3">Service / Dispensed Medicine</th>
                          <th className="py-2 px-3 text-right">Amount (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        <tr>
                          <td className="py-2 px-3 font-mono text-slate-400">1</td>
                          <td className="py-2 px-3 font-medium text-slate-800">
                            Dr. Consultation & Clinical Evaluation
                          </td>
                          <td className="py-2 px-3 font-mono font-bold text-right text-slate-800">
                            ₹{selectedInvoice.consultation_fee || 200}
                          </td>
                        </tr>
                        {selectedInvoice.items &&
                          selectedInvoice.items.map((item, i) => (
                            <tr key={i}>
                              <td className="py-2 px-3 font-mono text-slate-400">{i + 2}</td>
                              <td className="py-2 px-3 text-slate-700 font-medium">
                                {item.item_description || item.medicine_name || 'Dispensed Remedy'}
                              </td>
                              <td className="py-2 px-3 font-mono font-bold text-right text-slate-800">
                                ₹{item.price || item.total_price}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals */}
                  <div className="flex justify-end pt-1">
                    <div className="w-52 space-y-1 text-xs">
                      <div className="flex justify-between text-slate-500">
                        <span>Subtotal:</span>
                        <span className="font-mono">₹{(selectedInvoice.total_amount || 0) + (selectedInvoice.discount || 0)}</span>
                      </div>
                      {selectedInvoice.discount > 0 && (
                        <div className="flex justify-between text-slate-500">
                          <span>Discount:</span>
                          <span className="font-mono text-emerald-700">-₹{selectedInvoice.discount}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm font-black border-t-2 border-slate-900 pt-1 text-slate-900">
                        <span>Total Paid:</span>
                        <span className="font-mono text-[#1B4332]">₹{selectedInvoice.total_amount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 no-print">
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                id="btn-print-reprint"
                onClick={triggerPrintModal}
                className="px-5 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-extrabold shadow-md shadow-emerald-950/20 transition flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
