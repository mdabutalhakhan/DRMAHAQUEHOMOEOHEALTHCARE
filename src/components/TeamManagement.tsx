import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Stethoscope, 
  UserCheck, 
  UserX, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Lock, 
  Mail, 
  Phone, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Loader2, 
  ShieldCheck, 
  X,
  AlertTriangle,
  Camera
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { 
  fetchClinicTeamFromSupabase, 
  addClinicTeamMemberToSupabase, 
  toggleClinicTeamMemberStatus 
} from '../services/clinicStore';

interface TeamManagementProps {
  currentUser: UserProfile;
}

export const TeamManagement: React.FC<TeamManagementProps> = ({ currentUser }) => {
  const [teamMembers, setTeamMembers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Add Member Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('staff');
  const [phone, setPhone] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [showTempPassword, setShowTempPassword] = useState(false);
  const [addModalError, setAddModalError] = useState('');
  const [submittingMember, setSubmittingMember] = useState(false);

  // Deactivate Confirmation Modal State
  const [deactivatingMember, setDeactivatingMember] = useState<UserProfile | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Filter State
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const loadTeam = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    setErrorMsg('');

    try {
      const data = await fetchClinicTeamFromSupabase();
      setTeamMembers(data);
    } catch (err: any) {
      console.error('Failed to load clinic team:', err);
      setErrorMsg('Could not fetch team directory from Supabase. ' + (err.message || ''));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddModalError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    const cleanPass = tempPassword.trim();

    if (!cleanName) {
      setAddModalError('Please enter member full name.');
      return;
    }
    if (!cleanEmail) {
      setAddModalError('Please enter a valid work email.');
      return;
    }
    if (!cleanPass || cleanPass.length < 6) {
      setAddModalError('Initial temporary password must be at least 6 characters long.');
      return;
    }

    // Check duplicate email
    const duplicate = teamMembers.some((m) => m.email.toLowerCase() === cleanEmail);
    if (duplicate) {
      setAddModalError(`A team member with email ${cleanEmail} already exists.`);
      return;
    }

    setSubmittingMember(true);

    try {
      const created = await addClinicTeamMemberToSupabase({
        full_name: cleanName,
        email: cleanEmail,
        role,
        phone: phone.trim() || undefined,
        password: cleanPass,
      });

      setSuccessMsg(`Team member ${created.full_name} (${created.role}) created successfully!`);
      setTimeout(() => setSuccessMsg(''), 5000);

      // Reset form
      setFullName('');
      setEmail('');
      setRole('staff');
      setPhone('');
      setTempPassword('');
      setIsAddModalOpen(false);

      // Reload live list
      await loadTeam();
    } catch (err: any) {
      setAddModalError(err.message || 'Failed to add team member.');
    } finally {
      setSubmittingMember(false);
    }
  };

  const handleToggleStatus = async (member: UserProfile, newStatus: boolean) => {
    // Protect Primary Admin
    if (member.email.toLowerCase() === 'admin@homoeo.com') {
      alert('The primary clinic administrator account cannot be deactivated.');
      return;
    }

    setTogglingId(member.id);
    try {
      await toggleClinicTeamMemberStatus(member.id, newStatus);
      
      // Update local state immediately
      setTeamMembers((prev) =>
        prev.map((m) => (m.id === member.id ? { ...m, is_active: newStatus } : m))
      );

      if (newStatus) {
        setSuccessMsg(`Access restored for ${member.full_name}. Staff can now sign in.`);
      } else {
        setSuccessMsg(`${member.full_name} has been deactivated. Dashboard login access is now blocked.`);
      }
      setTimeout(() => setSuccessMsg(''), 5000);
      setDeactivatingMember(null);
    } catch (err: any) {
      setErrorMsg('Failed to update member status: ' + (err.message || ''));
    } finally {
      setTogglingId(null);
    }
  };

  const filteredMembers = teamMembers.filter((m) => {
    if (statusFilter === 'active') return m.is_active !== false;
    if (statusFilter === 'inactive') return m.is_active === false;
    return true;
  });

  const activeCount = teamMembers.filter((m) => m.is_active !== false).length;
  const inactiveCount = teamMembers.filter((m) => m.is_active === false).length;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#1B4332] text-white flex items-center justify-center shadow-sm">
              <Users className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Clinic Staff & Doctor Team
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Admin Security Portal • Live synchronization with Supabase <code className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-slate-800 font-mono text-[11px] text-emerald-700 dark:text-emerald-400">clinic_team</code>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => loadTeam(true)}
            disabled={loading || refreshing}
            className="px-3.5 py-2 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-stone-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs disabled:opacity-50"
            title="Refresh from Supabase"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sync Live</span>
          </button>

          <button
            onClick={() => {
              window.location.hash = '#settings';
            }}
            className="px-3.5 py-2 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/80 dark:bg-emerald-950/50 hover:bg-emerald-100 text-[#1B4332] dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            title="Update Doctor Photo and Chamber Settings"
          >
            <Camera className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Doctor Photo</span>
          </button>

          <button
            onClick={() => {
              setAddModalError('');
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold flex items-center gap-2 transition shadow-sm cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Team Member</span>
          </button>
        </div>
      </div>

      {/* Status Notifications */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold flex items-center gap-2 animate-fade-in shadow-xs">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Summary Stats & Filter Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/70 dark:bg-slate-800/80 border border-stone-200 dark:border-slate-700">
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Directory Breakdown:</span>
          <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-slate-700 font-bold text-slate-800 dark:text-slate-200">
            Total: {teamMembers.length}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 font-bold text-emerald-800 dark:text-emerald-300">
            Active: {activeCount}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-950/60 font-bold text-rose-800 dark:text-rose-300">
            Disabled: {inactiveCount}
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-[#1B4332] text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-700'
            }`}
          >
            All Members ({teamMembers.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              statusFilter === 'active'
                ? 'bg-emerald-700 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-700'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setStatusFilter('inactive')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              statusFilter === 'inactive'
                ? 'bg-rose-700 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-700'
            }`}
          >
            Disabled ({inactiveCount})
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Fetching real team members from Supabase clinic_team...</p>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-stone-300 dark:border-slate-700 p-8">
          <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">No Team Members Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {statusFilter === 'all'
              ? 'Click the button below to add doctors and staff with temporary passwords.'
              : `No members match the "${statusFilter}" filter.`}
          </p>
          {statusFilter === 'all' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#1B4332] text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add First Team Member</span>
            </button>
          )}
        </div>
      ) : (
        /* Team Members Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMembers.map((member) => {
            const isPrimaryAdmin = member.email.toLowerCase() === 'admin@homoeo.com';
            const isActive = member.is_active !== false;

            return (
              <div
                key={member.id}
                className={`p-5 rounded-3xl border transition shadow-xs flex flex-col justify-between space-y-4 ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 border-stone-200 dark:border-slate-700'
                    : 'bg-stone-50/80 dark:bg-slate-900/60 border-rose-200 dark:border-rose-950/60 opacity-90'
                }`}
              >
                {/* Top: Avatar, Name & Role */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white shadow-xs ${
                          member.role === 'admin'
                            ? 'bg-[#1B4332]'
                            : member.role === 'doctor'
                            ? 'bg-[#2D6A4F]'
                            : 'bg-emerald-600'
                        }`}
                      >
                        {member.role === 'admin' ? (
                          <Shield className="w-5 h-5 text-emerald-200" />
                        ) : member.role === 'doctor' ? (
                          <Stethoscope className="w-5 h-5 text-emerald-200" />
                        ) : (
                          <UserCheck className="w-5 h-5 text-emerald-100" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                          {member.full_name}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              member.role === 'admin'
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                                : member.role === 'doctor'
                                ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            }`}
                          >
                            {member.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Account Status Badge */}
                    <div>
                      {isActive ? (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 flex items-center gap-1.5 border border-rose-200 dark:border-rose-800">
                          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                          <span>Disabled</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Temporary Password Pending Notice */}
                  {member.is_first_login && (
                    <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center gap-2 text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                      <KeyRound className="w-3.5 h-3.5 shrink-0" />
                      <span>Temporary password pending update on next login</span>
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 pt-2 border-t border-stone-100 dark:border-slate-700/60">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate font-medium text-slate-700 dark:text-slate-300">
                        {member.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{member.phone || <em className="text-slate-400">No phone provided</em>}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom: Member Controls & Deactivate Toggle */}
                <div className="pt-3 border-t border-stone-100 dark:border-slate-700/60 flex items-center justify-between">
                  {isPrimaryAdmin ? (
                    <div className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium py-2 rounded-xl bg-stone-100 dark:bg-slate-700/50 border border-stone-200 dark:border-slate-700">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Primary Admin (Protected)</span>
                    </div>
                  ) : isActive ? (
                    <button
                      type="button"
                      disabled={togglingId === member.id}
                      onClick={() => setDeactivatingMember(member)}
                      className="w-full py-2 px-3 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {togglingId === member.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                      ) : (
                        <UserX className="w-4 h-4" />
                      )}
                      <span>Deactivate Staff</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={togglingId === member.id}
                      onClick={() => handleToggleStatus(member, true)}
                      className="w-full py-2 px-3 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      {togglingId === member.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <UserCheck className="w-4 h-4" />
                      )}
                      <span>Reactivate Staff</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD TEAM MEMBER (LIVE SUPABASE clinic_team)                      */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#FAF7EE] dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-emerald-950/20">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-slate-800 flex items-center justify-between bg-white/70 dark:bg-slate-900/80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#1B4332] text-white flex items-center justify-center shadow-xs">
                  <UserPlus className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    Add Authorized Team Member
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Inserts into Supabase <code className="font-mono text-emerald-700 dark:text-emerald-400">clinic_team</code> with is_active: true
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-stone-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddMember} className="p-5 sm:p-6 space-y-4 text-xs">
              {addModalError && (
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{addModalError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. A. Rahman / Sister Priyanka"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#1B4332] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="staff@homoeohealthcare.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#1B4332] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Role *
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#1B4332] outline-none"
                  >
                    <option value="doctor">Doctor (Chamber Consultations)</option>
                    <option value="staff">Staff / Front Desk (Queue & Billing)</option>
                    <option value="admin">Administrator (Full Control)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 9832100000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#1B4332] outline-none"
                  />
                </div>
              </div>

              {/* Initial Temporary Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold uppercase text-slate-700 dark:text-slate-300">
                    Initial Temporary Password *
                  </label>
                  <span className="text-[11px] text-slate-400">Min. 6 characters</span>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showTempPassword ? 'text' : 'password'}
                    required
                    placeholder="Set temporary password for first sign-in"
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-[#1B4332] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowTempPassword(!showTempPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                  >
                    {showTempPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  The staff member will be prompted to replace this temporary password upon their first sign-in.
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={submittingMember}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer hover:bg-stone-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingMember}
                  className="px-5 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold shadow-sm transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submittingMember ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to Supabase...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Add Member</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CONFIRM DEACTIVATION                                             */}
      {/* ========================================================================= */}
      {deactivatingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 border border-rose-200 dark:border-rose-900/40 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Deactivate Staff Member?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {deactivatingMember.full_name} ({deactivatingMember.email})
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
              <strong>Access Denied Effect:</strong> This will set <code className="font-mono">is_active = false</code> in Supabase. The staff member will immediately be blocked from logging into the clinic dashboard. Their past prescriptions, patient records, and invoice audit history will remain 100% intact.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeactivatingMember(null)}
                disabled={togglingId === deactivatingMember.id}
                className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={togglingId === deactivatingMember.id}
                onClick={() => handleToggleStatus(deactivatingMember, false)}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
              >
                {togglingId === deactivatingMember.id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deactivating...</span>
                  </>
                ) : (
                  <>
                    <UserX className="w-4 h-4" />
                    <span>Yes, Deactivate Account</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
