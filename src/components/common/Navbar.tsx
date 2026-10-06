import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, User, RefreshCw, CheckCircle2 } from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';
import { StatusBadge } from './StatusBadge';

interface NavbarProps {
  onOpenMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu }) => {
  const { role, setRole, currentUser, setCurrentUser, members, activities, resetToDefaultData } = usePlatformStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as any;
    setRole(newRole);
    const matchingMember = members.find((m) => m.role === newRole) || members[0];
    setCurrentUser(matchingMember);
    if (newRole === 'Admin') navigate('/admin');
    else if (newRole === 'Team A') navigate('/team-a');
    else if (newRole === 'Team B') navigate('/team-b');
    else if (newRole === 'Team C') navigate('/team-c');
  };

  const handleResetData = () => {
    resetToDefaultData();
    setShowResetConfirm(false);
    navigate('/admin');
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-6 backdrop-blur shadow-xs">
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobileMenu}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Quick Search */}
        <div className="hidden sm:flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 w-64 text-slate-500 focus-within:border-brand-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search leads, projects..."
            className="w-full bg-transparent text-xs text-slate-800 focus:outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Role Switcher in Navbar for Demo */}
        <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1 border border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 uppercase px-2 hidden md:inline">Role:</span>
          <select
            value={role}
            onChange={handleRoleChange}
            className="bg-white rounded-md text-xs font-bold text-brand-700 px-2.5 py-1 border border-slate-200 focus:outline-none cursor-pointer shadow-2xs"
          >
            <option value="Admin">Admin</option>
            <option value="Team A">Team A</option>
            <option value="Team B">Team B</option>
            <option value="Team C">Team C</option>
          </select>
        </div>

        {/* Reset Store Data Button for Demo */}
        <button
          onClick={() => setShowResetConfirm(true)}
          title="Reset mock data state to default"
          className="hidden sm:flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs"
        >
          <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
          <span className="hidden md:inline">Reset Seed</span>
        </button>

        {/* Notifications Popover Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[9px] font-bold text-white ring-2 ring-white">
              {activities.length > 5 ? '5+' : activities.length}
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-4 shadow-xl z-50 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Live System Activity</h4>
                <span className="text-[10px] text-slate-400 font-semibold">{activities.length} total</span>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {activities.slice(0, 5).map((act) => (
                  <div key={act.id} className="flex items-start gap-2.5 text-xs border-b border-slate-50 pb-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-slate-800 font-medium leading-snug">
                        <span className="font-bold text-slate-900">{act.actorName}</span> ({act.actorRole}) {act.action}
                      </p>
                      <span className="text-[10px] text-slate-400">{act.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="h-8 w-8 rounded-full object-cover ring-2 ring-brand-500/30"
          />
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-slate-900 leading-tight">{currentUser?.name}</p>
            <StatusBadge status={currentUser?.role === 'Admin' ? 'active' : 'New'} className="py-0 px-1.5 text-[9px]" />
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Reset Demo Data?</h3>
            <p className="text-xs text-slate-600 mt-2">
              This will restore all leads, calls, follow-ups, requirements, payments, and projects to initial seed data.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleResetData}
                className="px-3 py-1.5 text-xs font-semibold bg-brand-600 text-white rounded-lg hover:bg-brand-700"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
