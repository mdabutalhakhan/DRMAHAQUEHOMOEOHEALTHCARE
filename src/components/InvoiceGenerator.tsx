import React, { useState, useMemo, useEffect } from 'react';
import { 
  Receipt, 
  Plus, 
  Trash2, 
  Printer, 
  CheckCircle2, 
  FileDown, 
  User, 
  Phone, 
  PackageCheck, 
  AlertCircle, 
  Building2, 
  SlidersHorizontal,
  Eye,
  X,
  ExternalLink,
  Download,
  MessageCircle
} from 'lucide-react';
import { Appointment, Invoice, InvoiceItem, PaymentMode } from '../types';
import { createInvoice, getInvoices, registerCreatedInvoice, derivePatientId } from '../services/clinicStore';
import { getSupabase } from '../services/supabase';
import { exportInvoicesToCSV } from '../utils/exportUtils';
import { getWhatsAppReceiptUrl } from '../utils/whatsapp';
import { ClinicLogo } from './ClinicLogo';

interface InvoiceGeneratorProps {
  initialAppointment?: Appointment | null;
  initialPrescriptionUrl?: string;
  onInvoiceCreated?: (invoice: Invoice) => void;
  onBackToDashboard?: () => void;
}

type PrintFormat = 'thermal-80' | 'thermal-58' | 'a4';

export const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({
  initialAppointment,
  initialPrescriptionUrl,
  onInvoiceCreated,
  onBackToDashboard,
}) => {
  // Patient Info
  const [patientName, setPatientName] = useState(initialAppointment?.patient_name || '');
  const [patientId, setPatientId] = useState(
    derivePatientId(initialAppointment?.patient_id, initialAppointment?.phone, initialAppointment?.id)
  );
  const [phone, setPhone] = useState(initialAppointment?.phone || '');
  const [prescriptionUrl, setPrescriptionUrl] = useState<string>(
    initialPrescriptionUrl || initialAppointment?.prescription_url || ''
  );
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  // Sync props when initialAppointment or initialPrescriptionUrl changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('root')?.scrollTo({ top: 0, behavior: 'smooth' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    if (initialAppointment) {
      setPatientName(initialAppointment.patient_name || '');
      setPatientId(
        derivePatientId(initialAppointment.patient_id, initialAppointment.phone, initialAppointment.id)
      );
      setPhone(initialAppointment.phone || '');
    }
    const newPresc = initialPrescriptionUrl || initialAppointment?.prescription_url || '';
    if (newPresc) {
      setPrescriptionUrl(newPresc);
    }
  }, [initialAppointment, initialPrescriptionUrl]);
  
  // Clinic & Tax Credentials
  const [gstin, setGstin] = useState('GSTIN: [To be added / Optional]');

  // Financials
  const [consultationFee, setConsultationFee] = useState<number>(200); // Pre-filled default Consultation Charge: ₹200 (fully editable)
  const [discount, setDiscount] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('cash');
  
  // 2-Column Manual Billing Items: "Item Description" and "Amount / Price (₹)"
  const [items, setItems] = useState<Array<{ item_description: string; price: number | '' }>>([
    {
      item_description: '',
      price: '',
    },
  ]);

  const [savedInvoice, setSavedInvoice] = useState<Invoice | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [printFormat, setPrintFormat] = useState<PrintFormat>('thermal-80');

  // Auto-calculate Subtotal
  const medicinesSubtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  }, [items]);

  const subtotal = medicinesSubtotal + (Number(consultationFee) || 0);
  const totalAmount = Math.max(0, subtotal - (Number(discount) || 0) + (Number(tax) || 0));

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        item_description: '',
        price: '',
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: 'item_description' | 'price', value: any) => {
    const updated = [...items];
    if (field === 'price') {
      updated[index].price = value === '' ? '' : Math.max(0, Number(value) || 0);
    } else {
      updated[index].item_description = value;
    }
    setItems(updated);
  };

  const handleSaveInvoice = async () => {
    setErrorMsg('');
    if (!patientName.trim()) {
      setErrorMsg('Please enter patient name.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Please enter patient phone number.');
      return;
    }

    setIsSaving(true);
    try {
      const supabase = getSupabase();
      const currentShift = initialAppointment?.shift 
        ? (initialAppointment.shift.toLowerCase() === 'morning' ? 'Morning' : 'Evening')
        : (new Date().getHours() < 14 ? 'Morning' : 'Evening');

      const year = new Date().getFullYear();
      const existingInvoices = getInvoices();
      const invoiceNumber = `INV-${year}-${String(existingInvoices.length + 1).padStart(4, '0')}`;
      const cleanPatientId = patientId.trim() || `PAT-${(phone.trim() || '1000').slice(-4)}`;

      const medicineRows: InvoiceItem[] = items
        .filter((it) => it.item_description.trim() !== '' || (Number(it.price) || 0) > 0)
        .map((it, idx) => ({
          id: `item-${Date.now()}-${idx}`,
          item_description: it.item_description.trim() || 'Dispensed Medicine',
          price: Number(it.price) || 0,
          medicine_name: it.item_description.trim() || 'Dispensed Medicine',
          total_price: Number(it.price) || 0,
          quantity: 1,
          unit_price: Number(it.price) || 0,
        }));

      // Safe appointment_id handling: convert UUID or Token to string, or omit if null/empty
      const safeAptId = initialAppointment?.id ? String(initialAppointment.id).trim() : undefined;

      const resolvedFee = consultationFee !== '' ? Number(consultationFee) : 0;

      // Prepare payload to explicitly write the record into Supabase invoices table
      const invoicePayload: Record<string, any> = {
        invoice_number: invoiceNumber,
        patient_id: cleanPatientId,
        patient_name: patientName.trim(),
        phone: phone.trim(),
        consultation_fee: resolvedFee,
        doctor_fee: resolvedFee,
        medicine_total: Number(medicinesSubtotal) || 0,
        subtotal: Number(subtotal) || Number(totalAmount),
        discount: Number(discount) || 0,
        tax: Number(tax) || 0,
        total_amount: Number(totalAmount),
        payment_mode: (paymentMode || 'Cash').toLowerCase(), // 'cash' | 'upi' | 'card'
        shift: currentShift.toLowerCase(), // 'morning' | 'evening'
        items: medicineRows,
        ...(prescriptionUrl.trim() ? { prescription_url: prescriptionUrl.trim() } : {}),
        created_at: new Date().toISOString()
      };

      if (safeAptId && safeAptId !== 'null' && safeAptId !== 'undefined') {
        invoicePayload.appointment_id = safeAptId;
      }

      // Explicit insert into Supabase invoices table
      let insertResult = await supabase.from('invoices').insert([invoicePayload]).select();

      // Gracefully retry if items, shift, medicine_total or prescription_url column is missing in older schemas
      if (insertResult.error && (insertResult.error.message?.includes('items') || insertResult.error.message?.includes('shift') || insertResult.error.message?.includes('medicine_total') || insertResult.error.message?.includes('prescription_url') || insertResult.error.code === 'PGRST204')) {
        console.warn('Retrying invoice save with sanitized base columns:', insertResult.error.message);
        const fallbackPayload = { ...invoicePayload };
        delete fallbackPayload.items;
        if (insertResult.error.message?.includes('prescription_url')) {
          delete fallbackPayload.prescription_url;
        }
        insertResult = await supabase.from('invoices').insert([fallbackPayload]).select();
      }

      // Retry without appointment_id if foreign key or UUID validation error
      if (insertResult.error && (insertResult.error.message?.includes('appointment_id') || insertResult.error.code === '22P02' || insertResult.error.code === '23503')) {
        const withoutApt = { ...invoicePayload };
        delete withoutApt.appointment_id;
        insertResult = await supabase.from('invoices').insert([withoutApt]).select();
      }

      const { data, error } = insertResult;

      if (error) {
        console.error("Invoice Save Error:", error);
        alert("Failed to save invoice to Supabase: " + error.message);
        setErrorMsg("Failed to save invoice to Supabase: " + error.message);
        return;
      }

      const savedFee = data && data[0]
        ? (data[0].consultation_fee !== undefined && data[0].consultation_fee !== null
            ? Number(data[0].consultation_fee)
            : (data[0].doctor_fee !== undefined && data[0].doctor_fee !== null ? Number(data[0].doctor_fee) : resolvedFee))
        : resolvedFee;

      const savedRecord: Invoice = data && data[0] ? {
        id: data[0].id,
        invoice_number: data[0].invoice_number || invoiceNumber,
        appointment_id: data[0].appointment_id,
        patient_id: data[0].patient_id || cleanPatientId,
        patient_name: data[0].patient_name || patientName.trim(),
        phone: data[0].phone || phone.trim(),
        consultation_fee: savedFee,
        doctor_fee: savedFee,
        medicine_total: Number(data[0].medicine_total) || Number(medicinesSubtotal),
        shift: (data[0].shift || currentShift.toLowerCase()) as any,
        subtotal: Number(data[0].subtotal) || Number(subtotal),
        discount: Number(data[0].discount) || Number(discount),
        tax: Number(data[0].tax) || Number(tax),
        total_amount: Number(data[0].total_amount) || Number(totalAmount),
        payment_mode: data[0].payment_mode || (paymentMode || 'Cash').toLowerCase(),
        payment_status: data[0].payment_status || 'paid',
        items: (data[0].items && Array.isArray(data[0].items)) ? data[0].items : medicineRows,
        prescription_url: data[0].prescription_url || (prescriptionUrl.trim() || undefined),
        created_at: data[0].created_at || new Date().toISOString(),
        gstin: gstin.trim() || undefined,
      } : {
        id: `inv-${Date.now()}`,
        invoice_number: invoiceNumber,
        patient_id: cleanPatientId,
        patient_name: patientName.trim(),
        phone: phone.trim(),
        consultation_fee: resolvedFee,
        doctor_fee: resolvedFee,
        medicine_total: Number(medicinesSubtotal),
        shift: currentShift.toLowerCase() as any,
        subtotal: Number(subtotal),
        discount: Number(discount),
        tax: Number(tax),
        total_amount: Number(totalAmount),
        payment_mode: (paymentMode || 'Cash').toLowerCase() as any,
        payment_status: 'paid',
        items: medicineRows,
        prescription_url: prescriptionUrl.trim() || undefined,
        created_at: new Date().toISOString(),
        gstin: gstin.trim() || undefined,
      };

      // Safely insert into invoice_items table if present
      if (savedRecord.id && medicineRows.length > 0) {
        try {
          const lineItems = medicineRows.map(it => ({
            invoice_id: savedRecord.id,
            medicine_name: it.item_description || 'Dispensed Medicine',
            potency: 'N/A',
            quantity: it.quantity || 1,
            unit_price: it.price || 0,
            total_price: it.price || 0,
          }));
          await supabase.from('invoice_items').insert(lineItems);
        } catch {
          // Non-blocking
        }
      }

      // Instantly register in store and broadcast to all tabs
      registerCreatedInvoice(savedRecord);

      setSavedInvoice(savedRecord);
      if (onInvoiceCreated) {
        onInvoiceCreated(savedRecord);
      }
    } catch (e: any) {
      console.error("Invoice Save Exception:", e);
      alert("Failed to save invoice to Supabase: " + (e.message || String(e)));
      setErrorMsg(e.message || 'Failed to generate invoice');
    } finally {
      setIsSaving(false);
    }
  };

  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
              <Receipt className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Billing & Receipt Generator
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manual 2-column billing • Thermal POS receipt (80mm / 58mm) & GST ready
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-export-invoices-csv"
            onClick={() => exportInvoicesToCSV(getInvoices())}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          >
            <FileDown className="w-4 h-4 text-emerald-600" />
            <span>Export Invoices (CSV)</span>
          </button>
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              Back
            </button>
          )}
        </div>
      </div>

      {!savedInvoice ? (
        /* BILLING ENTRY FORM */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Patient Info & 2-Column Charges */}
          <div className="lg:col-span-8 space-y-6">
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Patient Header Box */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                Patient & Clinic Details
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Patient Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      id="invoice-patient-name"
                      type="text"
                      placeholder="e.g. Ramesh Chandra"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Patient ID
                  </label>
                  <input
                    id="invoice-patient-id"
                    type="text"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-xs font-medium text-emerald-800 dark:text-emerald-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Contact Phone *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      id="invoice-patient-phone"
                      type="tel"
                      placeholder="10-digit mobile"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* GSTIN Field */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Clinic GSTIN
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="invoice-gstin"
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    placeholder="GSTIN: [To be added / Optional]"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Attached Prescription Preview Indicator */}
              {prescriptionUrl ? (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      type="button"
                      onClick={() => setShowPrescriptionModal(true)}
                      className="w-10 h-10 rounded-lg overflow-hidden border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 shrink-0 hover:opacity-90 transition group cursor-pointer relative"
                      title="Click to view full prescription scan"
                    >
                      <img
                        src={prescriptionUrl}
                        alt="Attached Prescription"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 truncate">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Prescription Attached (WebP)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPrescriptionModal(true)}
                        className="text-[11px] text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View Document Preview</span>
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPrescriptionUrl('')}
                    className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-xs transition cursor-pointer"
                    title="Remove attached prescription"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : null}
            </div>

            {/* Doctor Consultation Fee Card */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs uppercase tracking-wider text-[#1B4332] dark:text-emerald-300 block">
                  Doctor Consultation Charge
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Pre-filled default at ₹200 (fully customizable or set to 0 for follow-ups)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold">₹</span>
                <input
                  id="invoice-consultation-fee"
                  type="number"
                  min="0"
                  value={consultationFee}
                  onChange={(e) => setConsultationFee(Number(e.target.value) || 0)}
                  className="w-28 px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-bold text-sm text-right focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            {/* 2-Column Medicine & Charge Line Items (Only: Item Description and Amount / Price) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Dispensed Medicines & Charges
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    2-column manual billing: Enter item description and amount directly
                  </p>
                </div>
                <button
                  type="button"
                  id="btn-add-blank-row"
                  onClick={handleAddItem}
                  className="px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                  title="Add blank row"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Blank Row</span>
                </button>
              </div>

              {/* Items List (Each row single-row on both mobile and desktop) */}
              <div className="space-y-2 pt-1">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2 sm:p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex items-center gap-2"
                  >
                    <input
                      type="text"
                      placeholder="Item Description (e.g. Arnica 200C / Dilution / Tonic)"
                      value={item.item_description}
                      onChange={(e) => handleItemChange(idx, 'item_description', e.target.value)}
                      className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />

                    <div className="relative w-24 sm:w-28 shrink-0">
                      <span className="absolute left-2.5 top-2 text-xs text-slate-400 font-semibold">₹</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={item.price}
                        onChange={(e) => handleItemChange(idx, 'price', e.target.value)}
                        className="w-full pl-6 pr-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-right text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      disabled={items.length <= 1}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 disabled:opacity-25 transition cursor-pointer shrink-0"
                      title="Remove row"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  id="btn-add-row-bottom"
                  onClick={handleAddItem}
                  className="w-full py-2.5 rounded-xl border border-dashed border-emerald-300 dark:border-slate-700 hover:bg-emerald-50/50 dark:hover:bg-slate-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer mt-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Blank Row</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Billing Summary & Payment Modes */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-3xl border border-emerald-950/10 dark:border-slate-700 p-6 shadow-sm space-y-6">
            <h3 className="font-bold text-base text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-700">
              Billing Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Doctor Consultation:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">₹{consultationFee}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Items Subtotal ({items.length} items):</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">₹{medicinesSubtotal}</span>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Gross Subtotal:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">₹{subtotal}</span>
              </div>

              {/* Discount */}
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Discount / Concession:</span>
                <div className="flex items-center gap-1">
                  <span>- ₹</span>
                  <input
                    type="number"
                    min="0"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                    className="w-16 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-right font-semibold text-xs"
                  />
                </div>
              </div>

              {/* Grand Total */}
              <div className="pt-3 border-t-2 border-emerald-500/30 flex items-center justify-between text-base font-extrabold text-[#1B4332] dark:text-emerald-300">
                <span>Total Payable:</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            {/* Payment Mode */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                Payment Mode
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(['cash', 'upi', 'card'] as PaymentMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPaymentMode(mode)}
                    className={`py-2 px-3 rounded-xl border text-center font-bold uppercase tracking-wider transition cursor-pointer ${
                      paymentMode === mode
                        ? 'bg-[#1B4332] border-[#1B4332] text-white shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <button
              type="button"
              id="btn-save-invoice"
              disabled={isSaving}
              onClick={handleSaveInvoice}
              className="w-full py-4 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-sm shadow-md shadow-emerald-950/20 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <PackageCheck className="w-5 h-5 text-emerald-300" />
              <span>{isSaving ? 'Saving Invoice...' : 'Save & Generate Invoice'}</span>
            </button>
            <p className="text-[11px] text-center text-slate-500">
              Generates official printable receipt with thermal POS and PDF print options.
            </p>
          </div>
        </div>
      ) : (
        /* PRINTABLE INVOICE RECEIPT & THERMAL POS SECTION */
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Print Controls Toolbar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4 no-print shadow-sm">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-sm font-bold">
              <CheckCircle2 className="w-5 h-5" />
              <span>Invoice Generated: {savedInvoice.invoice_number}</span>
            </div>

            {/* Print Format Selector: Thermal 80mm / 58mm / A4 */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex flex-wrap items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl text-xs font-semibold">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
                <button
                  type="button"
                  onClick={() => setPrintFormat('thermal-80')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    printFormat === 'thermal-80'
                      ? 'bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                  title="80mm Thermal POS Receipt (Standard roll)"
                >
                  80mm POS
                </button>
                <button
                  type="button"
                  onClick={() => setPrintFormat('thermal-58')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    printFormat === 'thermal-58'
                      ? 'bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                  title="58mm Thermal POS Receipt (Compact roll)"
                >
                  58mm POS
                </button>
                <button
                  type="button"
                  onClick={() => setPrintFormat('a4')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    printFormat === 'a4'
                      ? 'bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                  title="Standard A4 / A5 Clinic Voucher"
                >
                  A4 Voucher
                </button>
              </div>

              <button
                onClick={() => setSavedInvoice(null)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
              >
                New Invoice
              </button>

              <a
                id="btn-whatsapp-invoice"
                href={getWhatsAppReceiptUrl({
                  phone: savedInvoice.phone,
                  patientName: savedInvoice.patient_name,
                  invoiceNumber: savedInvoice.invoice_number,
                  date: new Date(savedInvoice.created_at).toLocaleDateString(),
                  doctorFee: Number(savedInvoice.consultation_fee ?? savedInvoice.doctor_fee ?? 0),
                  medicineTotal: savedInvoice.medicine_total !== undefined && savedInvoice.medicine_total !== null
                    ? Number(savedInvoice.medicine_total)
                    : (savedInvoice.items?.reduce((acc, it) => acc + (Number(it.total_price) || Number(it.price) || 0), 0) || Math.max(0, (savedInvoice.subtotal || savedInvoice.total_amount) - Number(savedInvoice.consultation_fee ?? savedInvoice.doctor_fee ?? 0))),
                  totalAmount: Number(savedInvoice.total_amount || 0),
                  paymentMode: (savedInvoice.payment_mode || 'Cash').toUpperCase(),
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                title="Send Digital Receipt via WhatsApp Business"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Share on WhatsApp</span>
              </a>

              <button
                id="btn-print-invoice"
                onClick={triggerPrint}
                className="px-4 py-2 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Download PDF</span>
              </button>
            </div>
          </div>

          {/* RECEIPT VIEWPORT (Dynamically adapts class according to chosen print format, centered on mobile/tablet) */}
          <div className="w-full flex items-center justify-center py-2 px-2 overflow-x-auto">
            {printFormat === 'thermal-80' || printFormat === 'thermal-58' ? (
              /* THERMAL POS RECEIPT LAYOUT */
              <div
                className={`printable-area ${
                  printFormat === 'thermal-80' ? 'thermal-receipt-80 w-full max-w-[340px]' : 'thermal-receipt-58 w-full max-w-[270px]'
                } mx-auto p-4 sm:p-5 rounded-2xl bg-white text-black border border-slate-300 shadow-lg font-mono text-xs`}
              >
                {/* Header */}
                <div className="text-center space-y-1 pb-2">
                  <h1 className="text-base font-black tracking-tight uppercase">Homoeo Health Care</h1>
                  <p className="text-xs font-bold">Dr. M. A. Haque, M.D. (Homoeo)</p>
                  <p className="text-[10px] leading-tight">Salbagan Road, Benachity, Durgapur-713213</p>
                  <p className="text-[10px]">Phone: 9933506514</p>
                  <p className="text-[10px] font-semibold">{savedInvoice.gstin || 'GSTIN: [To be added / Optional]'}</p>
                </div>

                <div className="receipt-divider border-t border-dashed border-black my-2"></div>

                {/* Receipt Metadata */}
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span>Receipt No:</span>
                    <span className="font-bold">{savedInvoice.invoice_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{new Date(savedInvoice.created_at).toLocaleDateString()} {new Date(savedInvoice.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Patient:</span>
                    <span className="font-bold truncate max-w-[150px]">{savedInvoice.patient_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Patient ID:</span>
                    <span>{savedInvoice.patient_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone:</span>
                    <span>{savedInvoice.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment:</span>
                    <span className="font-bold uppercase">{savedInvoice.payment_mode} (PAID)</span>
                  </div>
                </div>

                <div className="receipt-divider border-t border-dashed border-black my-2"></div>

                {/* 2-Column Items Table */}
                <div className="text-[11px]">
                  <div className="flex justify-between font-bold pb-1 border-b border-black">
                    <span>ITEM DESCRIPTION</span>
                    <span>AMOUNT</span>
                  </div>
                  <div className="divide-y divide-dotted divide-slate-400 pt-1">
                    {/* Consultation fee */}
                    <div className="py-1 flex justify-between gap-2">
                      <span className="font-medium">
                        {Number(savedInvoice.consultation_fee ?? savedInvoice.doctor_fee ?? 0) === 0
                          ? 'Dr. Consultation Fee (Complimentary / Follow-up)'
                          : 'Dr. Consultation Fee'}
                      </span>
                      <span className="font-bold shrink-0">
                        ₹{savedInvoice.consultation_fee !== undefined && savedInvoice.consultation_fee !== null
                          ? savedInvoice.consultation_fee
                          : (savedInvoice.doctor_fee !== undefined && savedInvoice.doctor_fee !== null ? savedInvoice.doctor_fee : 0)}
                      </span>
                    </div>

                    {/* Dispensed items */}
                    {savedInvoice.items.map((it, i) => (
                      <div key={i} className="py-1 flex justify-between gap-2">
                        <span className="break-words leading-tight">{it.item_description || it.medicine_name}</span>
                        <span className="font-bold shrink-0">₹{it.price || it.total_price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="receipt-divider border-t border-dashed border-black my-2"></div>

                {/* Totals */}
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{savedInvoice.subtotal}</span>
                  </div>
                  {savedInvoice.discount > 0 && (
                    <div className="flex justify-between font-semibold">
                      <span>Discount:</span>
                      <span>- ₹{savedInvoice.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-black pt-1 border-t border-black">
                    <span>TOTAL PAID:</span>
                    <span>₹{savedInvoice.total_amount}</span>
                  </div>
                </div>

                <div className="receipt-divider border-t border-dashed border-black my-3"></div>

                {/* Footer Notice */}
                <div className="text-center text-[10px] space-y-1 pt-1">
                  <p className="font-semibold">Clinic: Sat - Thu (Friday Closed)</p>
                  <p>Wishing you good health & wellness</p>
                  <p className="font-bold text-[11px] pt-1">Authorized Signatory</p>
                  <p>Dr. M. A. Haque, M.D. (Homoeo)</p>
                </div>
              </div>
            ) : (
              /* STANDARD A4 / A5 CLINIC VOUCHER LAYOUT */
              <div className="printable-area standard-voucher w-full p-8 rounded-3xl bg-white text-slate-900 border border-slate-200 shadow-xl space-y-6 font-sans">
                {/* Clinic Header */}
                <div className="flex justify-between items-start pb-6 border-b border-slate-200">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200/60 p-1.5 flex items-center justify-center shrink-0">
                      <ClinicLogo className="w-full h-full" color="#1B4332" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-extrabold text-[#1B4332] tracking-tight">Homoeo Health Care</h1>
                      <p className="text-sm font-semibold text-slate-700">Dr. M. A. Haque, M.D. (Homoeo)</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Salbagan Road, Benachity, Durgapur, PIN: 713213
                      </p>
                      <p className="text-xs text-slate-500">Phone / WhatsApp: 9933506514</p>
                      <p className="text-xs font-mono font-semibold text-slate-600 mt-0.5">
                        {savedInvoice.gstin || 'GSTIN: [To be added / Optional]'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">Official Receipt</span>
                    <span className="font-mono font-extrabold text-base text-slate-900 block mt-0.5">
                      {savedInvoice.invoice_number}
                    </span>
                    <span className="text-xs text-slate-500 block">
                      Date: {new Date(savedInvoice.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Patient Credentials */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-500 block">Patient Name:</span>
                    <strong className="text-slate-900 text-sm">{savedInvoice.patient_name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Patient ID:</span>
                    <strong className="font-mono text-emerald-800 text-sm">{savedInvoice.patient_id}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Contact Phone:</span>
                    <strong className="text-slate-900">{savedInvoice.phone}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Payment Mode:</span>
                    <strong className="uppercase text-emerald-800 font-bold">{savedInvoice.payment_mode} (PAID)</strong>
                  </div>
                </div>

                {/* 2-Column Itemized Table */}
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-200 text-slate-700 uppercase font-bold">
                      <th className="py-2.5">Item Description</th>
                      <th className="py-2.5 text-right">Amount / Price (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2.5 font-medium">
                        {Number(savedInvoice.consultation_fee ?? savedInvoice.doctor_fee ?? 0) === 0
                          ? 'Doctor Clinical Consultation Fee (Complimentary / Follow-up)'
                          : 'Doctor Clinical Consultation Fee'}
                      </td>
                      <td className="py-2.5 text-right font-bold">
                        ₹{savedInvoice.consultation_fee !== undefined && savedInvoice.consultation_fee !== null
                          ? savedInvoice.consultation_fee
                          : (savedInvoice.doctor_fee !== undefined && savedInvoice.doctor_fee !== null ? savedInvoice.doctor_fee : 0)}
                      </td>
                    </tr>
                    {savedInvoice.items.map((it, i) => (
                      <tr key={i}>
                        <td className="py-2.5 font-medium">{it.item_description || it.medicine_name}</td>
                        <td className="py-2.5 text-right font-bold">₹{it.price || it.total_price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Calculations Footer */}
                <div className="pt-4 border-t border-slate-200 flex justify-end">
                  <div className="w-64 space-y-1.5 text-xs text-right">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal:</span>
                      <span className="font-semibold">₹{savedInvoice.subtotal}</span>
                    </div>
                    {savedInvoice.discount > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Discount:</span>
                        <span>- ₹{savedInvoice.discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-extrabold text-[#1B4332] pt-2 border-t border-slate-200">
                      <span>Total Amount Paid:</span>
                      <span>₹{savedInvoice.total_amount}</span>
                    </div>
                  </div>
                </div>

                {/* Signatory */}
                <div className="pt-8 flex items-end justify-between text-xs text-slate-500">
                  <div>
                    <p>Clinic Hours: Sat - Thu (Fri Closed)</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Homoeo Health Care • Benachity, Durgapur</p>
                  </div>
                  <div className="text-right">
                    <div className="w-40 border-b border-slate-300 pb-1 mb-1"></div>
                    <span className="font-bold text-slate-800">Authorized Signatory</span>
                    <p className="text-[11px] text-slate-500">Dr. M. A. Haque, M.D. (Homoeo)</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Action Footer for WhatsApp & Print */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 no-print shadow-sm">
            <div className="text-xs text-slate-600 dark:text-slate-300">
              Receipt ready for <strong className="text-slate-900 dark:text-white">{savedInvoice.patient_name}</strong> {savedInvoice.phone ? `(${savedInvoice.phone})` : ''}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={getWhatsAppReceiptUrl({
                  phone: savedInvoice.phone,
                  patientName: savedInvoice.patient_name,
                  invoiceNumber: savedInvoice.invoice_number,
                  date: new Date(savedInvoice.created_at).toLocaleDateString(),
                  doctorFee: Number(savedInvoice.consultation_fee ?? savedInvoice.doctor_fee ?? 0),
                  medicineTotal: savedInvoice.medicine_total !== undefined && savedInvoice.medicine_total !== null
                    ? Number(savedInvoice.medicine_total)
                    : (savedInvoice.items?.reduce((acc, it) => acc + (Number(it.total_price) || Number(it.price) || 0), 0) || Math.max(0, (savedInvoice.subtotal || savedInvoice.total_amount) - Number(savedInvoice.consultation_fee ?? savedInvoice.doctor_fee ?? 0))),
                  totalAmount: Number(savedInvoice.total_amount || 0),
                  paymentMode: (savedInvoice.payment_mode || 'Cash').toUpperCase(),
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                title="Send Digital Receipt via WhatsApp Business"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send WhatsApp Receipt</span>
              </a>
              <button
                type="button"
                onClick={triggerPrint}
                className="px-4 py-2 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attached Prescription Modal Preview */}
      {showPrescriptionModal && prescriptionUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700 flex flex-col max-h-[90vh]">
            <div className="p-3.5 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-100">
                  Prescription Document Preview
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono">
                  WebP Compressed
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={prescriptionUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in tab</span>
                </a>
                <button
                  type="button"
                  onClick={() => setShowPrescriptionModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4 overflow-auto flex items-center justify-center bg-stone-900/10 dark:bg-black/40 min-h-[300px]">
              <img
                src={prescriptionUrl}
                alt="Prescription Document"
                className="max-h-[70vh] object-contain rounded-lg shadow-md"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
