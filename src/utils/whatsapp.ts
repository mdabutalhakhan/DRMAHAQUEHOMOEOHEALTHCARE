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
    `নমস্কার *${data.patientName || 'Patient'}*,\n` +
    `হোমিও হেলথ কেয়ারে আসার জন্য আপনাকে ধন্যবাদ।\n\n` +
    `📋 *ডিজিটাল ক্যাশ রসিদ (Cash Memo):*\n` +
    `• বিল নং: *${data.invoiceNumber || 'N/A'}*\n` +
    `• তারিখ: *${data.date}*\n` +
    `• ডক্টর ফি: ₹${data.doctorFee || 0}\n` +
    `• ওষুধ চার্জ: ₹${data.medicineTotal || 0}\n` +
    `• *সর্বমোট পরিশোধিত:* *₹${data.totalAmount || 0}* (${data.paymentMode || 'Cash'})\n\n` +
    `সুস্থ থাকুন, ভালো থাকুন। ✨`;

  const encoded = encodeURIComponent(message);
  
  // On desktop/laptop browsers, directly target web.whatsapp.com to use the logged-in Business Web session seamlessly
  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  return isMobile 
    ? `https://wa.me/${cleanPhone}?text=${encoded}`
    : `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`;
};
