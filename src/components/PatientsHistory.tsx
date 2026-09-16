import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
  Phone,
  Calendar,
  Clock,
  Printer,
  FileText,
  CreditCard,
  PlusCircle,
  FolderClock,
  UserCheck,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
  Stethoscope,
  Pill,
  X,
  Copy,
  Check,
  RefreshCw,
  Receipt,
  Download,
  Eye,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { Invoice, Appointment, UserProfile } from '../types';
import { 
  getInvoices, 
  getAppointments, 
  fetchInvoicesFromSupabase, 
  fetchAppointmentsFromSupabase, 
  subscribeToStore 
} from '../services/clinicStore';
import { getSupabase } from '../services/supabase';

interface PatientsHistoryProps {
  currentUser?: UserProfile;
  onStartWalkInVisit: () => void;
  onOpenBillingForPatient?: (patient: { id: string; name: string; phone: string }) => void;
}

export interface PatientGroup {
  id: string; // e.g. "PAT-1001" or "HHC-9448"
  name: string;
  phone: string;
  address?: string;
  age?: number;
  totalVisits: number;
  totalSpent: number;
  lastVisitDate: string;
  firstVisitDate: string;
  invoices: Invoice[];
  appointments: Appointment[];
}

export const PatientsHistory: React.FC<PatientsHistoryProps> = ({
  currentUser,
  onStartWalkInVisit,
  onOpenBillingForPatient,
}) => {
  const [invoices, setInvoices] = useState<Invoice[]>(getInvoices());
  const [appointments, setAppointments] = useState<Appointment[]>(getAppointments());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [mobileExpandedPatientId, setMobileExpandedPatientId] = useState<string | null>(null);

  // Print modal state
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [printFormat, setPrintFormat] = useState<'thermal-80' | 'thermal-58' | 'a4'>('thermal-80');
  const [copiedId, setCopiedId] = useState(false);

  // Prescription Lightbox modal state
  const [lightboxPrescription, setLightboxPrescription] = useState<{
    url: string;
    invoiceNumber: string;
    patientName: string;
    patientId: string;
    date: string;
  } | null>(null);
  const [imageZoom, setImageZoom] = useState<number>(1);

  // Keyboard shortcut (Escape) to close active modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxPrescription) {
          setLightboxPrescription(null);
          setImageZoom(1);
        } else if (viewingInvoice) {
          setViewingInvoice(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxPrescription, viewingInvoice]);

  const handlePrintPrescription = (presc: { url: string; invoiceNumber: string; patientName: string; patientId: string; date: string }) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print the prescription scan.');
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Prescription - ${presc.patientName} (${presc.invoiceNumber})</title>
          <style>
            @page { size: auto; margin: 10mm; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 16px; color: #111; }
            .header { border-bottom: 2px solid #1B4332; padding-bottom: 8px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: flex-end; }
            .clinic { font-size: 16px; font-weight: 800; color: #1B4332; }
            .meta { font-size: 11px; line-height: 1.4; text-align: right; }
            .patient-box { background: #f4f6f5; padding: 8px 12px; border-radius: 6px; margin-bottom: 14px; font-size: 12px; display: flex; justify-content: space-between; }
            .image-container { text-align: center; margin-top: 10px; }
            .presc-img { max-width: 100%; max-height: 82vh; object-fit: contain; border-radius: 6px; }
            .footer { margin-top: 16px; border-top: 1px solid #ddd; padding-top: 6px; font-size: 10px; color: #666; display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="clinic">HOMOEO HEALTH CARE</div>
              <div style="font-size: 11px; color: #444;">Dr. M. A. Haque, M.D. (Homoeo) • Regd. Homoeopathic Clinic</div>
            </div>
            <div class="meta">
              <strong>Invoice #:</strong> ${presc.invoiceNumber}<br/>
              <strong>Date:</strong> ${presc.date}
            </div>
          </div>
          <div class="patient-box">
            <div><strong>Patient:</strong> ${presc.patientName} (${presc.patientId})</div>
            <div><strong>Record:</strong> Physical Clinical Prescription (WebP Archive)</div>
          </div>
          <div class="image-container">
            <img src="${presc.url}" class="presc-img" alt="Prescription Scan" />
          </div>
          <div class="footer">
            <div>Homoeo Health Care • Benachity, Durgapur</div>
            <div>Digitally Archived Clinical Record</div>
          </div>
          <script>
            window.onload = function() {
              window.focus();
              setTimeout(function() { window.print(); }, 400);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownloadPrescription = (presc: { url: string; invoiceNumber: string; patientName: string; patientId: string }) => {
    const cleanName = presc.patientName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const cleanId = presc.patientId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const link = document.createElement('a');
    link.href = presc.url;
    link.download = `Prescription_${cleanName}_${cleanId}_${presc.invoiceNumber}.webp`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fetch Supabase data on mount and provide explicit refresh
  const refreshData = async () => {
    setLoading(true);
    try {
      const [invList, aptList] = await Promise.allSettled([
        fetchInvoicesFromSupabase(),
        fetchAppointmentsFromSupabase(),
      ]);

      if (invList.status === 'fulfilled' && invList.value) {
        setInvoices(invList.value);
      } else {
        setInvoices(getInvoices());
      }

      if (aptList.status === 'fulfilled' && aptList.value) {
        setAppointments(aptList.value);
      } else {
        setAppointments(getAppointments());
      }
    } catch (err) {
      console.warn('PatientsHistory refreshData warning:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();

    // Subscribe to store updates (e.g. newly created invoices or appointments)
    const unsubscribe = subscribeToStore((event) => {
      if (event.type === 'invoices') {
        setInvoices([...getInvoices()]);
      }
      if (event.type === 'appointments') {
        setAppointments([...getAppointments()]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Group invoices & appointments into consolidated Patient records
  const patients = useMemo<PatientGroup[]>(() => {
    const map = new Map<string, PatientGroup>();

    // Helper to generate normalized key
    const getPatientKey = (name: string, phone: string, pid?: string) => {
      const cleanPhone = (phone || '').replace(/[^0-9]/g, '').slice(-10);
      if (cleanPhone && cleanPhone.length >= 7) return `phone-${cleanPhone}`;
      if (pid && pid !== 'PAT-1001' && pid !== 'PAT-AUTO') return `pid-${pid.toLowerCase()}`;
      return `name-${(name || 'unnamed').trim().toLowerCase()}`;
    };

    // 1. Process Invoices
    for (const inv of invoices) {
      const key = getPatientKey(inv.patient_name, inv.phone, inv.patient_id);
      const existing = map.get(key);

      const invDate = inv.created_at || new Date().toISOString();
      const patientId = inv.patient_id || `HHC-${(inv.phone || '9448').slice(-4)}`;

      if (!existing) {
        map.set(key, {
          id: patientId,
          name: inv.patient_name || 'Anonymous Patient',
          phone: inv.phone || '',
          address: inv.address,
          age: inv.age,
          totalVisits: 1,
          totalSpent: inv.total_amount || 0,
          lastVisitDate: invDate,
          firstVisitDate: invDate,
          invoices: [inv],
          appointments: [],
        });
      } else {
        existing.totalVisits += 1;
        existing.totalSpent += inv.total_amount || 0;
        existing.invoices.push(inv);

        if (new Date(invDate) > new Date(existing.lastVisitDate)) {
          existing.lastVisitDate = invDate;
        }
        if (new Date(invDate) < new Date(existing.firstVisitDate)) {
          existing.firstVisitDate = invDate;
        }
        if (!existing.phone && inv.phone) existing.phone = inv.phone;
        if (!existing.address && inv.address) existing.address = inv.address;
        if (!existing.age && inv.age) existing.age = inv.age;
      }
    }

    // 2. Process Appointments
    for (const apt of appointments) {
      const key = getPatientKey(apt.patient_name, apt.phone, apt.patient_id);
      const existing = map.get(key);

      const aptDate = apt.created_at || new Date().toISOString();
      const patientId = apt.patient_id || `HHC-${(apt.phone || '9448').slice(-4)}`;

      if (!existing) {
        map.set(key, {
          id: patientId,
          name: apt.patient_name || 'Anonymous Patient',
          phone: apt.phone || '',
          address: apt.address,
          age: apt.age,
          totalVisits: 1,
          totalSpent: 0,
          lastVisitDate: aptDate,
          firstVisitDate: aptDate,
          invoices: [],
          appointments: [apt],
        });
      } else {
        existing.appointments.push(apt);
        if (new Date(aptDate) > new Date(existing.lastVisitDate)) {
          existing.lastVisitDate = aptDate;
        }
        if (new Date(aptDate) < new Date(existing.firstVisitDate)) {
          existing.firstVisitDate = aptDate;
        }
        if (!existing.phone && apt.phone) existing.phone = apt.phone;
        if (!existing.address && apt.address) existing.address = apt.address;
        if (!existing.age && apt.age) existing.age = apt.age;
      }
    }

    // Sort patients by most recent activity descending
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.lastVisitDate).getTime() - new Date(a.lastVisitDate).getTime()
    );
  }, [invoices, appointments]);

  // Filter patients by real-time query
  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return patients;
    const q = searchQuery.toLowerCase().trim();
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.id.toLowerCase().includes(q) ||
        (p.address && p.address.toLowerCase().includes(q))
    );
  }, [patients, searchQuery]);

  // Active patient selection for Desktop
  const activePatient = useMemo(() => {
    if (selectedPatientId) {
      const found = patients.find((p) => p.id === selectedPatientId);
      if (found) return found;
    }
    return filteredPatients[0] || null;
  }, [selectedPatientId, patients, filteredPatients]);

  const handleCopyPatientId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatientId(patientId);
    setMobileExpandedPatientId(prev => (prev === patientId ? null : patientId));
  };

  const triggerPrint = () => {
    window.print();
  };

  // Reusable Patient Timeline / Visit History component
  const renderPatientChart = (patient: PatientGroup, isMobile = false) => {
    // Sort invoices chronologically descending (newest visit first)
    const sortedInvoices = [...patient.invoices].sort(
      (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    );
    // Dynamic Total Billing (₹) calculated accurately across all invoices
    const totalBilling = sortedInvoices.reduce((sum, inv) => sum + (Number(inv.total_amount) || 0), 0);

    return (
      <div className="space-y-4">
        {/* Patient Header Card */}
        <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
                  {patient.name}
                </h3>
                <button
                  type="button"
                  onClick={() => handleCopyPatientId(patient.id)}
                  className="px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 transition flex items-center gap-1 cursor-pointer"
                  title="Click to copy Patient ID"
                >
                  <span>{patient.id}</span>
                  {copiedId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-emerald-600" />}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                {patient.phone && (
                  <span className="flex items-center gap-1 font-mono font-medium text-slate-700 dark:text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    {patient.phone}
                  </span>
                )}
                {patient.age && <span>Age: {patient.age} yrs</span>}
                {patient.address && <span>• {patient.address}</span>}
              </div>
            </div>

            {/* Actions for this patient */}
            {onOpenBillingForPatient && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    onOpenBillingForPatient({
                      id: patient.id,
                      name: patient.name,
                      phone: patient.phone,
                    })
                  }
                  className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Receipt className="w-3.5 h-3.5 text-emerald-300" />
                  <span>+ Dispense / Bill</span>
                </button>
              </div>
            )}
          </div>

          {/* Patient Summary Stat Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-700 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Visits</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">
                {patient.totalVisits} Recorded
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Billing (₹)</span>
              <span className="font-extrabold text-emerald-700 dark:text-emerald-400 text-sm font-mono">
                ₹{totalBilling}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">First Consultation</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] truncate block">
                {new Date(patient.firstVisitDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Most Recent</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] truncate block">
                {new Date(patient.lastVisitDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Chronological Visit History Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-xs sm:text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Chronological Visit Timeline ({sortedInvoices.length} Invoices)</span>
            </h4>
            <button
              type="button"
              onClick={refreshData}
              disabled={loading}
              className="px-2.5 py-1 rounded-lg text-[11px] text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 font-semibold flex items-center gap-1 cursor-pointer transition"
              title="Sync latest invoices from Supabase database"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              <span>Sync Records</span>
            </button>
          </div>

          {sortedInvoices.length === 0 ? (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-2.5">
              <FileText className="w-7 h-7 mx-auto text-slate-400 opacity-50" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                No invoices recorded yet for {patient.name}.
              </p>
              <p className="text-[11px] text-slate-400">
                Generate an invoice in the Billing module to populate this visit timeline.
              </p>
              {onOpenBillingForPatient && (
                <button
                  type="button"
                  onClick={() =>
                    onOpenBillingForPatient({
                      id: patient.id,
                      name: patient.name,
                      phone: patient.phone,
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-[#1B4332] text-white text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Generate First Invoice</span>
                </button>
              )}
            </div>
          ) : (
            sortedInvoices.map((inv) => {
              const visitDate = inv.created_at ? new Date(inv.created_at) : new Date();
              return (
                <div
                  key={inv.id}
                  className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 shadow-xs space-y-3"
                >
                  {/* Visit Header: Date, Doctor, Invoice No & Print Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100 dark:border-slate-700">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs sm:text-sm text-slate-900 dark:text-white">
                          {visitDate.toLocaleDateString('en-IN', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {visitDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {inv.payment_mode || 'Cash'}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 mt-0.5 flex items-center gap-1">
                        <Stethoscope className="w-3 h-3" />
                        <span>Attending: Dr. M. A. Haque, M.D. (Homoeo)</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                      <span className="text-xs font-mono text-slate-500 font-bold">
                        {inv.invoice_number}
                      </span>
                      <button
                        type="button"
                        onClick={() => setViewingInvoice(inv)}
                        className="px-3 py-1.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                        title="View & Print Thermal / A4 Voucher"
                      >
                        <Printer className="w-3.5 h-3.5 text-emerald-300" />
                        <span>View & Print</span>
                      </button>
                    </div>
                  </div>

                  {/* Prescribed & Dispensed Medicines Table */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Dispensed Remedies & Line Items:
                    </span>
                    <div className="rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden text-xs">
                      <div className="bg-slate-50 dark:bg-slate-900 p-2 flex justify-between font-bold text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700 text-[11px]">
                        <span>Description</span>
                        <span>Amount</span>
                      </div>

                      <div className="divide-y divide-slate-100 dark:divide-slate-700/60 bg-white dark:bg-slate-800">
                        {/* Consultation fee */}
                        <div className="p-2 flex justify-between items-center text-xs">
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            Dr. Consultation & Clinical Review Fee
                          </span>
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                            ₹{inv.consultation_fee || 200}
                          </span>
                        </div>

                        {/* Dispensed Items */}
                        {inv.items && inv.items.length > 0 ? (
                          inv.items.map((item, idx) => (
                            <div key={idx} className="p-2 flex justify-between items-center text-xs">
                              <div className="flex items-center gap-2 min-w-0 pr-2">
                                <Pill className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="text-slate-700 dark:text-slate-300 font-medium truncate">
                                  {item.item_description || item.medicine_name || 'Dispensed Remedy'}
                                </span>
                              </div>
                              <span className="font-mono font-bold text-slate-800 dark:text-slate-200 shrink-0">
                                ₹{item.price || item.total_price}
                              </span>
                            </div>
                          ))
                        ) : (inv.medicine_total !== undefined && inv.medicine_total > 0) ? (
                          <div className="p-2 flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2 min-w-0 pr-2">
                              <Pill className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="text-slate-700 dark:text-slate-300 font-medium truncate">
                                Dispensed Homoeopathic Remedies
                              </span>
                            </div>
                            <span className="font-mono font-bold text-slate-800 dark:text-slate-200 shrink-0">
                              ₹{inv.medicine_total}
                            </span>
                          </div>
                        ) : (
                          <div className="p-2 text-slate-400 italic text-[11px]">No dispensed medicines recorded.</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Prescription Attachment Strip & Status */}
                  <div className="pt-2.5 border-t border-slate-100 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-2.5">
                    {inv.prescription_url ? (
                      <button
                        type="button"
                        onClick={() =>
                          setLightboxPrescription({
                            url: inv.prescription_url!,
                            invoiceNumber: inv.invoice_number,
                            patientName: patient.name,
                            patientId: patient.id,
                            date: visitDate.toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            }),
                          })
                        }
                        className="group inline-flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-800 transition cursor-pointer text-left shadow-2xs"
                        title="Click to view full-screen prescription"
                      >
                        <div className="w-8 h-8 rounded-lg overflow-hidden border border-emerald-400/60 dark:border-emerald-700 bg-white dark:bg-slate-900 shrink-0 relative flex items-center justify-center">
                          <img
                            src={inv.prescription_url}
                            alt="Prescription Thumbnail"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1 leading-none">
                            📄 View Prescription
                          </span>
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 leading-none mt-1 block">
                            Attached Clinical Scan
                          </span>
                        </div>
                      </button>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 text-[11px] font-medium border border-slate-200 dark:border-slate-700">
                        <FileText className="w-3.5 h-3.5 opacity-50 shrink-0" />
                        <span>No Prescription Attached</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2.5">
                      {inv.discount > 0 && (
                        <span className="text-slate-400 text-[11px]">
                          Discount: <strong className="text-slate-600 dark:text-slate-300">-₹{inv.discount}</strong>
                        </span>
                      )}
                      <div className="text-xs sm:text-sm font-extrabold text-[#1B4332] dark:text-emerald-300 font-mono">
                        Total: ₹{inv.total_amount}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] text-white shadow-xs shrink-0">
            <FolderClock className="w-5 h-5 sm:w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
                Patients & Clinical Visit History
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                {patients.length} Profiles
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Electronic Health Records • Chronological Invoices • Dispensed Homoeopathic Medicines
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            id="btn-new-walkin-visit"
            type="button"
            onClick={onStartWalkInVisit}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-emerald-300" />
            <span>+ New Walk-in Visit</span>
          </button>
        </div>
      </div>

      {/* 2-COLUMN SPLIT VIEW LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Patient Directory & Search (With Mobile Inline Accordion)    */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl border border-emerald-950/10 dark:border-slate-700 p-3.5 sm:p-5 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Patient Directory ({filteredPatients.length})
            </span>
            {loading && (
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                <RefreshCw className="w-3 h-3 animate-spin" /> Syncing...
              </span>
            )}
          </div>

          {/* Search Bar (Real-time Filter by Name, Mobile, Patient ID) */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="patient-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Name, Mobile, or ID (e.g. 99335, HHC-9448)..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Patient Cards List */}
          <div className="space-y-2 lg:max-h-[620px] lg:overflow-y-auto pr-0.5">
            {filteredPatients.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Users className="w-8 h-8 mx-auto opacity-40" />
                <p className="text-xs font-semibold">No patients found</p>
                <p className="text-[11px]">Try adjusting your search criteria or register a new walk-in.</p>
              </div>
            ) : (
              filteredPatients.map((patient) => {
                const isSelected = activePatient?.id === patient.id;
                const isMobileExpanded = mobileExpandedPatientId === patient.id;

                return (
                  <div
                    key={patient.id}
                    className={`rounded-2xl transition border overflow-hidden ${
                      isSelected
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500/50 dark:border-emerald-600 shadow-xs'
                        : 'bg-white dark:bg-slate-900/60 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {/* Patient Card Header Button */}
                    <button
                      id={`patient-card-${patient.id}`}
                      type="button"
                      onClick={() => handlePatientSelect(patient.id)}
                      className="w-full text-left p-3 flex items-center justify-between gap-2.5 cursor-pointer"
                    >
                      <div className="min-w-0 space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-slate-900 dark:text-white truncate block">
                            {patient.name}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                            {patient.id}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          {patient.phone ? (
                            <span className="flex items-center gap-1 font-mono text-[11px]">
                              <Phone className="w-3 h-3 text-slate-400" />
                              {patient.phone}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">No phone</span>
                          )}
                          <span>•</span>
                          <span className="text-[11px]">
                            {new Date(patient.lastVisitDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#1B4332] text-white block">
                            {patient.totalVisits} {patient.totalVisits === 1 ? 'Visit' : 'Visits'}
                          </span>
                          {patient.totalSpent > 0 && (
                            <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-bold block mt-0.5 font-mono">
                              ₹{patient.totalSpent}
                            </span>
                          )}
                        </div>

                        {/* Mobile Accordion Indicator Arrow */}
                        <div className="lg:hidden text-stone-400">
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isMobileExpanded ? 'rotate-180 text-emerald-600' : ''
                            }`}
                          />
                        </div>
                      </div>
                    </button>

                    {/* ============================================================= */}
                    {/* MOBILE INLINE ACCORDION: CLINICAL VISITS & INVOICES (lg:hidden) */}
                    {/* ============================================================= */}
                    {isMobileExpanded && (
                      <div className="lg:hidden px-3 pb-3 pt-1 border-t border-emerald-950/10 dark:border-slate-800 bg-stone-50/60 dark:bg-slate-900/60 animate-fade-in">
                        {renderPatientChart(patient, true)}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Active Patient Chart & Chronological Timeline (DESKTOP)     */}
        {/* ========================================================================= */}
        <div className="hidden lg:block lg:col-span-8 space-y-5">
          {activePatient ? (
            renderPatientChart(activePatient, false)
          ) : (
            <div className="p-12 rounded-3xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 text-center space-y-3">
              <Users className="w-12 h-12 text-slate-400 mx-auto opacity-40" />
              <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-200">
                Select a Patient from Directory
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Choose a patient on the left to inspect their complete clinical timeline, previous prescriptions, and historical receipts.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* THERMAL POS & PRINTABLE INVOICE MODAL                                     */}
      {/* ========================================================================= */}
      {viewingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Controls Bar */}
            <div className="shrink-0 p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span className="font-black text-xs sm:text-sm text-slate-900 dark:text-white">
                  Receipt: {viewingInvoice.invoice_number}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Format Toggle Buttons */}
                <div className="flex items-center bg-slate-200 dark:bg-slate-700 p-0.5 rounded-xl text-[10px] sm:text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setPrintFormat('thermal-80')}
                    className={`px-2 py-1 rounded-lg transition ${
                      printFormat === 'thermal-80'
                        ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    80mm
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrintFormat('thermal-58')}
                    className={`px-2 py-1 rounded-lg transition ${
                      printFormat === 'thermal-58'
                        ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    58mm
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrintFormat('a4')}
                    className={`px-2 py-1 rounded-lg transition ${
                      printFormat === 'a4'
                        ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    A4
                  </button>
                </div>

                <button
                  type="button"
                  onClick={triggerPrint}
                  className="px-3 py-1.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewingInvoice(null)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Receipt Preview */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex items-center justify-center bg-slate-100 dark:bg-slate-950">
              {printFormat === 'thermal-80' || printFormat === 'thermal-58' ? (
                /* Thermal Layout */
                <div
                  className={`printable-area ${
                    printFormat === 'thermal-80' ? 'w-full max-w-[340px]' : 'w-full max-w-[270px]'
                  } p-5 rounded-2xl bg-white text-black border border-slate-300 shadow-lg font-mono text-xs space-y-2`}
                >
                  <div className="text-center space-y-0.5 pb-2">
                    <h2 className="text-base font-black tracking-tight uppercase">Homoeo Health Care</h2>
                    <p className="text-xs font-bold">Dr. M. A. Haque, M.D. (Homoeo)</p>
                    <p className="text-[10px] leading-tight">Salbagan Road, Benachity, Durgapur-713213</p>
                    <p className="text-[10px]">Phone: 9933506514</p>
                  </div>

                  <div className="border-t border-dashed border-black my-2"></div>

                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span>Receipt No:</span>
                      <span className="font-bold">{viewingInvoice.invoice_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span>
                        {new Date(viewingInvoice.created_at).toLocaleDateString()} {new Date(viewingInvoice.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Patient:</span>
                      <span className="font-bold truncate max-w-[150px]">{viewingInvoice.patient_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Patient ID:</span>
                      <span>{viewingInvoice.patient_id}</span>
                    </div>
                    {viewingInvoice.phone && (
                      <div className="flex justify-between">
                        <span>Phone:</span>
                        <span>{viewingInvoice.phone}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Payment:</span>
                      <span className="font-bold uppercase">{viewingInvoice.payment_mode} (PAID)</span>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-black my-2"></div>

                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between font-bold border-b border-black/20 pb-1">
                      <span>Item Description</span>
                      <span>Amount (₹)</span>
                    </div>

                    <div className="flex justify-between py-0.5">
                      <span>Dr. Consultation Fee</span>
                      <span>{viewingInvoice.consultation_fee || 200}</span>
                    </div>

                    {viewingInvoice.items &&
                      viewingInvoice.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between py-0.5">
                          <span className="truncate max-w-[190px]">{item.item_description || item.medicine_name}</span>
                          <span>{item.price || item.total_price}</span>
                        </div>
                      ))}
                  </div>

                  <div className="border-t border-dashed border-black my-2"></div>

                  <div className="space-y-1 text-[11px] font-bold">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{(viewingInvoice.total_amount || 0) + (viewingInvoice.discount || 0)}</span>
                    </div>
                    {viewingInvoice.discount > 0 && (
                      <div className="flex justify-between text-slate-700">
                        <span>Discount:</span>
                        <span>-₹{viewingInvoice.discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-black pt-1 border-t border-black">
                      <span>TOTAL PAID:</span>
                      <span>₹{viewingInvoice.total_amount}</span>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-black my-2"></div>

                  <div className="text-center text-[10px] space-y-0.5 pt-1 text-slate-700">
                    <p>Attending: Dr. M. A. Haque, M.D. (Homoeo)</p>
                    <p className="font-bold">Thank you for visiting Homoeo Health Care!</p>
                    <p>Wishing you speedy health and wellness.</p>
                  </div>
                </div>
              ) : (
                /* A4 Voucher Layout */
                <div className="printable-area w-full max-w-[650px] p-8 rounded-2xl bg-white text-slate-900 border border-slate-300 shadow-lg space-y-5 text-xs">
                  {/* Header */}
                  <div className="flex justify-between items-start border-b-2 border-emerald-900 pb-4">
                    <div>
                      <h2 className="text-xl font-black text-[#1B4332] uppercase tracking-wide">
                        Homoeo Health Care
                      </h2>
                      <p className="text-sm font-bold text-slate-700">Dr. M. A. Haque, M.D. (Homoeo)</p>
                      <p className="text-xs text-slate-500">Salbagan Road, Benachity, Durgapur - 713213</p>
                      <p className="text-xs text-slate-500">Chamber Mobile: +91 99335 06514</p>
                    </div>

                    <div className="text-right">
                      <span className="inline-block px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-extrabold text-xs uppercase tracking-wider mb-1">
                        Official Cash Receipt
                      </span>
                      <div className="text-xs text-slate-500">
                        Receipt No: <strong className="text-slate-900 font-mono">{viewingInvoice.invoice_number}</strong>
                      </div>
                      <div className="text-xs text-slate-500">
                        Date:{' '}
                        <strong className="text-slate-900">
                          {new Date(viewingInvoice.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Patient Info Card */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Patient Details</span>
                      <div className="font-bold text-sm text-slate-900">{viewingInvoice.patient_name}</div>
                      {viewingInvoice.phone && (
                        <div className="text-slate-600 font-mono">Mobile: {viewingInvoice.phone}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Registration / Token</span>
                      <div className="font-bold font-mono text-emerald-800">{viewingInvoice.patient_id}</div>
                      <div className="text-slate-600">Payment Mode: <strong className="uppercase">{viewingInvoice.payment_mode}</strong></div>
                    </div>
                  </div>

                  {/* Prescription Attachment Notice in Print Modal */}
                  {viewingInvoice.prescription_url && (
                    <div className="flex items-center justify-between p-2.5 px-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                      <span className="font-semibold flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Clinical Prescription Scan Digitally Attached</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setLightboxPrescription({
                            url: viewingInvoice.prescription_url!,
                            invoiceNumber: viewingInvoice.invoice_number,
                            patientName: viewingInvoice.patient_name,
                            patientId: viewingInvoice.patient_id,
                            date: new Date(viewingInvoice.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            }),
                          });
                        }}
                        className="text-emerald-700 hover:text-emerald-800 underline font-bold cursor-pointer"
                      >
                        View Scan
                      </button>
                    </div>
                  )}

                  {/* Line Items Table */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 text-[11px] font-bold uppercase border-b border-slate-200">
                          <th className="py-2.5 px-3">#</th>
                          <th className="py-2.5 px-3">Service / Dispensed Medicine</th>
                          <th className="py-2.5 px-3 text-right">Amount (INR)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        <tr>
                          <td className="py-2.5 px-3 font-mono text-slate-400">1</td>
                          <td className="py-2.5 px-3 font-medium text-slate-800">
                            Dr. Consultation & Clinical Review Fee
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-right text-slate-800">
                            ₹{viewingInvoice.consultation_fee || 200}
                          </td>
                        </tr>
                        {viewingInvoice.items &&
                          viewingInvoice.items.map((item, i) => (
                            <tr key={i}>
                              <td className="py-2.5 px-3 font-mono text-slate-400">{i + 2}</td>
                              <td className="py-2.5 px-3 text-slate-700 font-medium">
                                {item.item_description || item.medicine_name}
                              </td>
                              <td className="py-2.5 px-3 font-mono font-bold text-right text-slate-800">
                                ₹{item.price || item.total_price}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals */}
                  <div className="flex justify-end pt-2">
                    <div className="w-56 space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-500">
                        <span>Subtotal:</span>
                        <span className="font-mono">
                          ₹{(viewingInvoice.total_amount || 0) + (viewingInvoice.discount || 0)}
                        </span>
                      </div>
                      {viewingInvoice.discount > 0 && (
                        <div className="flex justify-between text-slate-500">
                          <span>Discount:</span>
                          <span className="font-mono text-emerald-700">-₹{viewingInvoice.discount}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm font-black border-t-2 border-slate-900 pt-1 text-slate-900">
                        <span>Total Paid:</span>
                        <span className="font-mono text-[#1B4332]">₹{viewingInvoice.total_amount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Signatures */}
                  <div className="pt-8 flex justify-between items-end text-slate-500 text-[11px]">
                    <div>
                      <p className="font-semibold text-slate-700">Thank you for visiting Homoeo Health Care.</p>
                      <p>This is a computer generated clinical voucher.</p>
                    </div>
                    <div className="text-center">
                      <div className="border-t border-slate-400 w-44 pt-1 font-bold text-slate-800">
                        Dr. M. A. Haque, M.D. (Homoeo)
                      </div>
                      <p className="text-[10px]">Authorized Signature / Seal</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full-screen Lightbox Modal for Prescription Document */}
      {lightboxPrescription && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => {
            setLightboxPrescription(null);
            setImageZoom(1);
          }}
        >
          <div
            className="relative w-full max-w-4xl max-h-[94vh] flex flex-col bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-700/80"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header Bar */}
            <div className="px-4 py-3 sm:px-6 sm:py-3.5 bg-slate-800/95 border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-3 text-white">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-700/60 text-emerald-400 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xs sm:text-sm font-black text-white truncate">
                      {lightboxPrescription.patientName}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-900/60 text-emerald-300 border border-emerald-700/40">
                      {lightboxPrescription.invoiceNumber}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {lightboxPrescription.date}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Verified Clinical Prescription Scan • WebP Format
                  </p>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setImageZoom((prev) => (prev >= 2 ? 1 : prev + 0.5))}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  title="Toggle Zoom"
                >
                  {imageZoom > 1 ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{Math.round(imageZoom * 100)}%</span>
                </button>

                <a
                  href={lightboxPrescription.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  title="Open raw image in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Open in tab</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleDownloadPrescription(lightboxPrescription)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  title="Download WebP prescription file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePrintPrescription(lightboxPrescription)}
                  className="px-3 py-1.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                  title="Print prescription scan"
                >
                  <Printer className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Print</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLightboxPrescription(null);
                    setImageZoom(1);
                  }}
                  className="p-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition cursor-pointer ml-1"
                  title="Close (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Lightbox Image Stage */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center bg-black/60 min-h-[320px] max-h-[78vh]">
              <div
                className="transition-transform duration-200 ease-out flex items-center justify-center"
                style={{ transform: `scale(${imageZoom})`, transformOrigin: 'center center' }}
              >
                <img
                  src={lightboxPrescription.url}
                  alt={`Prescription for ${lightboxPrescription.patientName}`}
                  className="max-h-[72vh] max-w-full object-contain rounded-xl shadow-2xl border border-slate-800"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Lightbox Footer Note */}
            <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Dr. M. A. Haque, M.D. (Homoeo) • Homoeo Health Care Archives</span>
              <span className="font-mono text-emerald-400">Secure WebP Storage</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
