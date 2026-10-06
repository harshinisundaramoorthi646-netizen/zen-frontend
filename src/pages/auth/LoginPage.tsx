import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, UserCheck, ArrowRight, Layers } from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';
import { Button } from '../../components/ui/Button';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const { members, setCurrentUser, setRole } = usePlatformStore();
  const [selectedRole, setSelectedRole] = useState<UserRole>('Admin');
  const [selectedMemberId, setSelectedMemberId] = useState<string>(members[0].id);
  const navigate = useNavigate();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    const matchingMember = members.find((m) => m.role === role) || members[0];
    setSelectedMemberId(matchingMember.id);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const targetMember = members.find((m) => m.id === selectedMemberId) || members[0];
    setCurrentUser(targetMember);
    setRole(selectedRole);

    if (selectedRole === 'Admin') navigate('/admin');
    else if (selectedRole === 'Team A') navigate('/team-a');
    else if (selectedRole === 'Team B') navigate('/team-b');
    else if (selectedRole === 'Team C') navigate('/team-c');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl border border-slate-200 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white font-black text-2xl shadow-lg mb-2">
            Z
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Zen Platform Login</h1>
          <p className="text-xs text-slate-500">
            Freelancer Team Management & End-to-End Client Lifecycle Platform
          </p>
        </div>

        {/* Demo Role Picker Tabs */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            Select Role to Demo Access Scope:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleRoleSelect('Admin')}
              className={`p-3 rounded-xl border text-left transition-all text-xs font-bold ${
                selectedRole === 'Admin'
                  ? 'border-brand-600 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="h-4 w-4 mb-1 text-emerald-600" />
              Admin (Full Access)
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('Team A')}
              className={`p-3 rounded-xl border text-left transition-all text-xs font-bold ${
                selectedRole === 'Team A'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <UserCheck className="h-4 w-4 mb-1 text-indigo-600" />
              Team A (Lead Gen)
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('Team B')}
              className={`p-3 rounded-xl border text-left transition-all text-xs font-bold ${
                selectedRole === 'Team B'
                  ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <UserCheck className="h-4 w-4 mb-1 text-blue-600" />
              Team B (Calling)
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('Team C')}
              className={`p-3 rounded-xl border text-left transition-all text-xs font-bold ${
                selectedRole === 'Team C'
                  ? 'border-purple-600 bg-purple-50 text-purple-700 ring-2 ring-purple-500/20'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Layers className="h-4 w-4 mb-1 text-purple-600" />
              Team C (Execution)
            </button>
          </div>
        </div>

        {/* Member Select */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Select Demo User Roster Identity:
            </label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 focus:border-brand-500 focus:outline-none"
            >
              {members
                .filter((m) => m.role === selectedRole || selectedRole === 'Admin')
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.team} — {m.email})
                  </option>
                ))}
            </select>
          </div>

          <Button type="submit" size="lg" className="w-full font-bold shadow-md">
            Enter Workspace <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </form>

        <p className="text-[11px] text-center text-slate-400">
          Demo login. Switch roles anytime using the top navbar selector.
        </p>
      </div>
    </div>
  );
};
