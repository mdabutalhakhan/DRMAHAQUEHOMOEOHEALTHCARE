import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { InventoryItem, StockLog, Appointment, Invoice } from '../types';

export function exportInventoryToExcel(items: InventoryItem[], filename = 'Homoeo_Health_Care_Inventory.xlsx') {
  const formattedData = items.map((item) => ({
    'Medicine Name': item.medicine_name,
    'Potency': item.potency,
    'Category': item.category,
    'Bottle Size': item.bottle_size,
    'Rack / Shelf': item.rack_location,
    'Current Stock': item.stock_quantity,
    'Low Stock Alert (<)': item.low_stock_threshold,
    'Stock Status': item.stock_quantity <= item.low_stock_threshold ? 'URGENT LOW' : 'Normal',
    'MRP (INR)': item.mrp,
    'Purchase Cost (INR)': item.purchase_cost,
    'Company': item.company,
    'Distributor': item.distributor || 'N/A',
    'Storage Location': item.storage_location,
    'Mfg Date': item.mfg_date || 'N/A',
    'Expiry Date': item.expiry_date || 'N/A',
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');

  XLSX.writeFile(workbook, filename);
}

export function exportInventoryToCSV(items: InventoryItem[], filename = 'Homoeo_Health_Care_Inventory.csv') {
  const formattedData = items.map((item) => ({
    'Medicine Name': item.medicine_name,
    'Potency': item.potency,
    'Category': item.category,
    'Bottle Size': item.bottle_size,
    'Rack Location': item.rack_location,
    'Stock Quantity': item.stock_quantity,
    'Low Stock Threshold': item.low_stock_threshold,
    'MRP': item.mrp,
    'Purchase Cost': item.purchase_cost,
    'Company': item.company,
    'Storage Location': item.storage_location,
    'Expiry Date': item.expiry_date || '',
  }));

  const csv = Papa.unparse(formattedData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportAppointmentsToCSV(appointments: Appointment[], filename = 'Appointments_Queue.csv') {
  const formattedData = appointments.map((apt) => ({
    'Token Number': apt.token_number,
    'Patient ID': apt.patient_id,
    'Patient Name': apt.patient_name,
    'Phone': apt.phone,
    'Address': apt.address,
    'Date': apt.booking_date,
    'Shift': apt.shift.toUpperCase(),
    'Queue Position': `#${apt.queue_position}`,
    'Status': apt.status.toUpperCase(),
    'Symptoms': apt.symptoms_summary || '',
  }));

  const csv = Papa.unparse(formattedData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportInvoicesToCSV(invoices: Invoice[], filename = 'Clinic_Invoices_Billing.csv') {
  const formattedData = invoices.map((inv) => ({
    'Invoice Number': inv.invoice_number,
    'Patient ID': inv.patient_id,
    'Patient Name': inv.patient_name,
    'Phone': inv.phone,
    'GSTIN': inv.gstin || 'N/A',
    'Consultation Fee': inv.consultation_fee,
    'Subtotal': inv.subtotal,
    'Total Amount': inv.total_amount,
    'Payment Mode': inv.payment_mode.toUpperCase(),
    'Payment Status': inv.payment_status.toUpperCase(),
    'Date': new Date(inv.created_at).toLocaleDateString(),
  }));

  const csv = Papa.unparse(formattedData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
