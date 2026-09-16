import React from 'react';
import { 
  HeartHandshake, 
  MapPin, 
  Phone, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  Sparkles,
  ExternalLink 
} from 'lucide-react';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenTracker: () => void;
  onOpenLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenBooking,
  onOpenTracker,
  onOpenLogin,
}) => {
  return (
    <footer className="mt-20 border-t border-emerald-900/10 dark:border-slate-800 bg-[#1B4332] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Clinic Brand & Doctor Credential */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700/60 border border-emerald-500/30 flex items-center justify-center">
                <HeartHandshake className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight text-white">Homoeo Health Care</h3>
                <p className="text-xs text-emerald-300 font-medium">Holistic Healing Without Side-Effects</p>
              </div>
            </div>
            <p className="text-sm text-emerald-100/80 leading-relaxed">
              Led by <strong className="text-white">Dr. M. A. Haque, M.D. (Homoeo)</strong>, providing personalized classical homoeopathic treatment, chronic disease management, and constitutional health care for all age groups.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-900/60 border border-emerald-700/50 text-xs text-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Certified Classical Homoeopathic Clinic</span>
            </div>
          </div>

          {/* Timings & Consultation Hours */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Clinic & Doctor Timings</span>
            </h4>
            <div className="space-y-2.5 text-xs text-emerald-100/90">
              <div className="p-3 rounded-lg bg-emerald-900/40 border border-emerald-800/60 space-y-1">
                <p className="font-semibold text-white flex items-center justify-between">
                  <span>Saturday to Thursday</span>
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-red-900/80 text-red-200">Friday Closed</span>
                </p>
                <p className="text-emerald-200">
                  <strong>Clinic Open:</strong> 9:00 AM – 2:00 PM & 5:00 PM – 10:00 PM
                </p>
                <div className="pt-1 border-t border-emerald-800/60 text-emerald-100">
                  <span className="text-emerald-300 font-semibold">Doctor Consultations:</span>
                  <ul className="list-disc list-inside mt-0.5 space-y-0.5 text-[11px]">
                    <li>Morning: 10:00 AM – 12:30 PM</li>
                    <li>Evening: 6:00 PM – 8:30 PM</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Address & Direct WhatsApp Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Visit & Contact Us</span>
            </h4>
            <div className="space-y-3 text-xs text-emerald-100/90">
              <p className="flex items-start gap-2 leading-relaxed">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Dr. M. A. Haque Homoeo Health Care,<br />
                  Salbagan Road, Benachity, Durgapur,<br />
                  PIN: 713213, West Bengal<br />
                  <span className="text-emerald-300">Landmark: Near Roy Medical</span>
                </span>
              </p>
              <div className="pt-2 border-t border-emerald-800/60">
                <p className="text-xs text-emerald-300 font-semibold mb-1">Phone & WhatsApp Helpline:</p>
                <a
                  href="tel:9933506514"
                  className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-emerald-200 transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>+91 9933506514</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Access & Staff Portal */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-300">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenBooking}
                  className="hover:text-emerald-300 transition-colors flex items-center gap-1.5 text-left"
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Book Online Appointment</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTracker}
                  className="hover:text-emerald-300 transition-colors flex items-center gap-1.5 text-left"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Track Token & Live Queue</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenLogin}
                  className="hover:text-emerald-300 transition-colors flex items-center gap-1.5 text-left"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Doctor & Staff Portal Login</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Mandatory Attribution & Copyright */}
        <div className="mt-12 pt-6 border-t border-emerald-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-200/80">
          <p>
            © {new Date().getFullYear()} Homoeo Health Care • Dr. M. A. Haque, M.D. (Homoeo). All rights reserved.
          </p>
          <div className="flex items-center gap-2 font-medium text-emerald-100 bg-emerald-900/80 px-3.5 py-1.5 rounded-full border border-emerald-700/60 shadow-inner">
            <span>Created by</span>
            <strong className="text-white font-semibold">Md Abutalha Khan</strong>
          </div>
        </div>
      </div>
    </footer>
  );
};
