import React, { useState, useMemo } from 'react';
import { 
  Receipt, 
  Plus, 
  Trash2, 
  Printer, 
  CheckCircle2, 
  FileDown, 
  Sparkles, 
  IndianRupee, 
  User, 
  Phone,
  PackageCheck,
  AlertCircle
} from 'lucide-react';
import { Appointment, InventoryItem, Invoice, InvoiceItem, PaymentMode } from '../types';
import { createInvoice, getInventory } from '../services/clinicStore';
import { exportInvoicesToCSV } from '../utils/exportUtils';

interface InvoiceGeneratorProps {
  initialAppointment?: Appointment | null;
  onInvoiceCreated?: (invoice: Invoice) => void;
  onBackToDashboard?: () => void;
}

export const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({
  initialAppointment,
  onInvoiceCreated,
  onBackToDashboard,
}) => {
  const inventory = getInventory();

  // Patient Info
  const [patientName, setPatientName] = useState(initialAppointment?.patient_name || '');
  const [patientId, setPatientId] = useState(initialAppointment?.patient_id || `PAT-${Math.floor(1000 + Math.random() * 9000)}`);
  const [phone, setPhone] = useState(initialAppointment?.phone || '');
  
  // Financials
  const [consultationFee, setConsultationFee] = useState<number>(200); // Pre-filled default Consultation Charge: ₹200 (fully editable)
  const [discount, setDiscount] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('cash');
  
  // Dynamic Medicine Rows
  const [items, setItems] = useState<Array<Omit<InvoiceItem, 'id' | 'total_price'>>>([
    {
      medicine_name: 'Arnica Montana',
      potency: '200C',
      quantity: 1,
      unit_price: 110,
    },
  ]);

  const [savedInvoice, setSavedInvoice] = useState<Invoice | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-calculate Subtotal
  const medicinesSubtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unit_price) || 0), 0);
  }, [items]);

  const subtotal = medicinesSubtotal + (Number(consultationFee) || 0);
  const totalAmount = Math.max(0, subtotal - (Number(discount) || 0) + (Number(tax) || 0));

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        medicine_name: '',
        potency: '30C',
        quantity: 1,
        unit_price: 100,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    setItems(updated);
  };

  // Quick select from inventory to auto-populate unit price & potency
  const handleSelectFromInventory = (index: number, inventoryId: string) => {
    const found = inventory.find((i) => i.id === inventoryId);
    if (found) {
      const updated = [...items];
      updated[index] = {
        inventory_id: found.id,
        medicine_name: found.medicine_name,
        potency: found.potency,
        quantity: 1,
        unit_price: found.mrp,
      };
      setItems(updated);
    }
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
      const formattedItems: InvoiceItem[] = items.map((it, idx) => ({
        ...it,
        id: `item-${Date.now()}-${idx}`,
        total_price: (Number(it.quantity) || 0) * (Number(it.unit_price) || 0),
      }));

      const newInv = await createInvoice({
        appointment_id: initialAppointment?.id,
        patient_id: patientId,
        patient_name: patientName,
        phone,
        consultation_fee: consultationFee,
        subtotal,
        discount,
        tax,
        total_amount: totalAmount,
        payment_mode: paymentMode,
        payment_status: 'paid',
        items: formattedItems,
      });

      setSavedInvoice(newInv);
      if (onInvoiceCreated) {
        onInvoiceCreated(newInv);
      }
    } catch (e: any) {
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
              <Receipt className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Invoice & Clinical Billing Generator
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Dr. M. A. Haque Homeo Health Care • Automatic Patient ID & Invoice Sequence
          </p>
        </div>

        {onBackToDashboard && (
          <button
            onClick={onBackToDashboard}
            className="text-xs font-semibold px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            ← Back to Queue Dashboard
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* INVOICE FORM OR PRINTABLE VOUCHER */}
      {!savedInvoice ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Billing Form */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-3xl border border-emerald-950/10 dark:border-slate-700 p-6 sm:p-8 shadow-sm space-y-6">
            {/* Patient Header Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-slate-100 dark:border-slate-700 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Patient Full Name *
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    id="invoice-patient-name"
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Patient Name"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Mobile Phone *
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    id="invoice-patient-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Unique Patient ID
                </label>
                <input
                  id="invoice-patient-id"
                  type="text"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-emerald-50/50 dark:bg-slate-900 font-mono font-bold text-[#1B4332] dark:text-emerald-400"
                />
              </div>
            </div>

            {/* Consultation Charge Row */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-slate-900/60 border border-emerald-200/60 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-sm text-slate-900 dark:text-white block">
                  Default Doctor Consultation Fee
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Pre-filled at ₹200 (fully customizable for follow-ups or waivers)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold">₹</span>
                <input
                  id="invoice-consultation-fee"
                  type="number"
                  min="0"
                  value={consultationFee}
                  onChange={(e) => setConsultationFee(Number(e.target.value))}
                  className="w-28 px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-bold text-sm text-right focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            {/* Dynamic Medicine Line Items */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Prescribed Medicines & Dilutions Dispensed
                </h3>
                <button
                  type="button"
                  id="btn-add-medicine-row"
                  onClick={handleAddItem}
                  className="px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/80 dark:hover:bg-emerald-900 text-emerald-900 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Medicine Row</span>
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                  >
                    {/* Medicine Name or Inventory Quick Selector */}
                    <div className="sm:col-span-4">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-semibold text-slate-500">Medicine Name</label>
                        <select
                          onChange={(e) => handleSelectFromInventory(idx, e.target.value)}
                          className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-transparent border-0 cursor-pointer font-semibold"
                        >
                          <option value="">(Select from stock)</option>
                          {inventory.map((inv) => (
                            <option key={inv.id} value={inv.id}>
                              {inv.medicine_name} {inv.potency} (Stock: {inv.stock_quantity})
                            </option>
                          ))}
                        </select>
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. Rhus Tox"
                        value={item.medicine_name}
                        onChange={(e) => handleItemChange(idx, 'medicine_name', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                      />
                    </div>

                    {/* Potency */}
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Potency</label>
                      <input
                        type="text"
                        placeholder="e.g. 200C / Q"
                        value={item.potency}
                        onChange={(e) => handleItemChange(idx, 'potency', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                      />
                    </div>

                    {/* Quantity / Phials */}
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-center"
                      />
                    </div>

                    {/* Unit Price */}
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">Unit Price (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={item.unit_price}
                        onChange={(e) => handleItemChange(idx, 'unit_price', Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-right"
                      />
                    </div>

                    {/* Line Total & Remove */}
                    <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        ₹{(Number(item.quantity) || 0) * (Number(item.unit_price) || 0)}
                      </span>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
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
                <span>Medicine Subtotal ({items.length} items):</span>
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
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-16 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-right font-semibold"
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
                    className={`py-2 px-3 rounded-xl border text-center font-bold uppercase tracking-wider transition ${
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

            {/* Action Buttons */}
            <button
              type="button"
              id="btn-save-invoice"
              disabled={isSaving}
              onClick={handleSaveInvoice}
              className="w-full py-4 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-sm shadow-md shadow-emerald-950/20 flex items-center justify-center gap-2 transition"
            >
              <PackageCheck className="w-5 h-5 text-emerald-300" />
              <span>{isSaving ? 'Dispensing & Saving...' : 'Save & Generate Invoice'}</span>
            </button>
            <p className="text-[11px] text-center text-slate-500">
              Saving automatically deducts stock from inventory with an audit log.
            </p>
          </div>
        </div>
      ) : (
        /* PRINTABLE INVOICE RECEIPT VOUCHER */
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between no-print">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-sm font-bold">
              <CheckCircle2 className="w-5 h-5" />
              <span>Invoice Generated Successfully: {savedInvoice.invoice_number}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSavedInvoice(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
              >
                Create Another Invoice
              </button>
              <button
                id="btn-print-invoice"
                onClick={triggerPrint}
                className="px-5 py-2 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Download PDF</span>
              </button>
            </div>
          </div>

          {/* Clean Printed Voucher Box */}
          <div className="printable-area p-8 sm:p-10 rounded-3xl bg-white text-slate-900 border border-slate-200 shadow-xl space-y-6 font-sans">
            {/* Clinic Header */}
            <div className="flex justify-between items-start pb-6 border-b border-slate-200">
              <div>
                <h1 className="text-2xl font-extrabold text-[#1B4332] tracking-tight">Homoeo Health Care</h1>
                <p className="text-sm font-semibold text-slate-700">Dr. M. A. Haque, M.D. (Homoeo)</p>
                <p className="text-xs text-slate-500 mt-1">
                  Salbagan Road, Benachity, Durgapur, PIN: 713213
                </p>
                <p className="text-xs text-slate-500">Phone / WhatsApp: 9933506514</p>
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

            {/* Itemized Table */}
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-slate-700 uppercase font-bold">
                  <th className="py-2.5">Item Description</th>
                  <th className="py-2.5">Potency</th>
                  <th className="py-2.5 text-center">Qty</th>
                  <th className="py-2.5 text-right">Unit Price</th>
                  <th className="py-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5 font-medium">Doctor Clinical Consultation Fee</td>
                  <td className="py-2.5 text-slate-500">-</td>
                  <td className="py-2.5 text-center">1</td>
                  <td className="py-2.5 text-right">₹{savedInvoice.consultation_fee}</td>
                  <td className="py-2.5 text-right font-bold">₹{savedInvoice.consultation_fee}</td>
                </tr>
                {savedInvoice.items.map((it, i) => (
                  <tr key={i}>
                    <td className="py-2.5 font-medium">{it.medicine_name}</td>
                    <td className="py-2.5 text-slate-600 font-semibold">{it.potency}</td>
                    <td className="py-2.5 text-center">{it.quantity}</td>
                    <td className="py-2.5 text-right">₹{it.unit_price}</td>
                    <td className="py-2.5 text-right font-bold">₹{it.total_price}</td>
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
                <p className="text-[11px] text-slate-400 mt-0.5">Created by Md Abu Talha Khan • Homoeo Health Care</p>
              </div>
              <div className="text-right">
                <div className="w-40 border-b border-slate-300 pb-1 mb-1"></div>
                <span className="font-bold text-slate-800">Authorized Signatory</span>
                <p className="text-[11px] text-slate-500">Dr. M. A. Haque, M.D. (Homoeo)</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
