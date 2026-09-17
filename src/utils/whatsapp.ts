export const getWhatsAppReceiptUrl = (data: {
  phone: string;
  patientName: string;
  invoiceNumber: string;
  date: string;
  doctorFee: number;
  medicineTotal: number;
  totalAmount: number;
  paymentMode: string;
}) => {
  let cleanPhone = (data.phone || '').replace(/\D/g, '');
  if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;

  const message = 
    `🌿 *Homoeo Health Care*\n` +
    `Dr. M. A. Haque, M.D. (Homoeo)\n` +
    `Benachity, Durgapur | 📞 9933056514\n` +
    `--------------------------------\n` +
    `Dear *${data.patientName || 'Patient'}*,\n` +
    `Thank you for visiting Homoeo Health Care.\n\n` +
    `📋 *Digital Cash Receipt / Bill:*\n` +
    `• Invoice No: *${data.invoiceNumber || 'N/A'}*\n` +
    `• Date: *${data.date}*\n` +
    `• Doctor Consultation Fee: ₹${data.doctorFee || 0}\n` +
    `• Medicine & Charges: ₹${data.medicineTotal || 0}\n` +
    `• *Total Paid:* *₹${data.totalAmount || 0}* (${data.paymentMode || 'Cash'})\n\n` +
    `Wishing you good health and a speedy recovery! ✨`;

  const encoded = encodeURIComponent(message);
  
  // On desktop/laptop browsers, directly target web.whatsapp.com to use the logged-in Business Web session seamlessly
  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  return isMobile 
    ? `https://wa.me/${cleanPhone}?text=${encoded}`
    : `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`;
};
