import React, { useState } from 'react';
import { Users, UserPlus, Shield, Stethoscope, UserCheck, Trash2, CheckCircle2 } from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { getProfiles, addProfile } from '../services/clinicStore';

interface TeamManagementProps {
  currentUser: UserProfile;
}

export const TeamManagement: React.FC<TeamManagementProps> = ({ currentUser }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>(getProfiles());
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('staff');
  const [phone, setPhone] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    const newMember: UserProfile = {
      id: `user-${Date.now()}`,
      email: email.trim(),
      full_name: fullName.trim(),
      role,
      phone: phone.trim() || undefined,
      created_at: new Date().toISOString(),
    };

    addProfile(newMember);
    setProfiles(getProfiles());
    setFullName('');
    setEmail('');
    setPhone('');
    setIsAdding(false);
    setSuccessMsg(`Team member ${newMember.full_name} added successfully!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-600" />
            <span>Clinic Staff & Doctor Team Directory</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Admin access only • Manage authorized clinic personnel for Homoeo Health Care
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Team Member</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {isAdding && (
        <form onSubmit={handleAddMember} className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 shadow-sm space-y-4 text-xs">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Add New Clinic Staff / Doctor</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. A. Rahman / Sister Anjali"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Work Email *</label>
              <input
                type="email"
                required
                placeholder="staff@homoeohealthcare.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Role *</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              >
                <option value="doctor">Doctor</option>
                <option value="staff">Staff / Front Desk</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Contact Phone</label>
              <input
                type="tel"
                placeholder="9832100000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#1B4332] text-white font-bold shadow-sm"
            >
              Confirm & Save Member
            </button>
          </div>
        </form>
      )}

      {/* Team Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {profiles.map((p) => (
          <div
            key={p.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-emerald-950/10 dark:border-slate-700 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm ${
                  p.role === 'admin' ? 'bg-[#1B4332]' : p.role === 'doctor' ? 'bg-[#2D6A4F]' : 'bg-emerald-600'
                }`}>
                  {p.role === 'admin' ? <Shield className="w-5 h-5" /> : p.role === 'doctor' ? <Stethoscope className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{p.full_name}</h4>
                  <span className="text-xs text-slate-400 capitalize block">{p.role}</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 pt-2 border-t border-slate-100 dark:border-slate-700">
              <p>Email: <strong className="text-slate-700 dark:text-slate-300">{p.email}</strong></p>
              {p.phone && <p>Phone: <strong className="text-slate-700 dark:text-slate-300">{p.phone}</strong></p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
