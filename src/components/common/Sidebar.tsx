import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  PhoneCall,
  Calendar,
  Briefcase,
  FolderKanban,
  FileBarChart2,
  Settings,
  UserPlus,
  LogOut,
  ShieldCheck,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';
import { cn } from '../../utils/formatters';

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { role, currentUser, setCurrentUser, members } = usePlatformStore();
  const navigate = useNavigate();

  const handleRoleChange = (newRole: string) => {
    const matchingMember = members.find((m) => m.role === newRole) || members[0];
    setCurrentUser(matchingMember);
    if (newRole === 'Admin') navigate('/admin');
    else if (newRole === 'Team A') navigate('/team-a');
    else if (newRole === 'Team B') navigate('/team-b');
    else if (newRole === 'Team C') navigate('/team-c');
    if (onCloseMobile) onCloseMobile();
  };

  const getNavItems = () => {
    switch (role) {
      case 'Admin':
        return [
          { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
          { label: 'Team A (Lead Gen)', path: '/admin/team-a', icon: UserPlus },
          { label: 'Team B (Calling)', path: '/admin/team-b', icon: PhoneCall },
          { label: 'Team C (Execution)', path: '/admin/team-c', icon: FolderKanban },
          { label: 'All Leads', path: '/admin/leads', icon: Users },
          { label: 'All Clients', path: '/admin/clients', icon: Briefcase },
          { label: 'All Projects', path: '/admin/projects', icon: Layers },
          { label: 'Reports & Analytics', path: '/admin/reports', icon: FileBarChart2 },
          { label: 'Settings & Data', path: '/admin/settings', icon: Settings },
        ];
      case 'Team A':
        return [
          { label: 'Team A Overview', path: '/team-a', icon: LayoutDashboard },
          { label: 'My Leads', path: '/team-a/leads', icon: Users },
          { label: '+ Add New Lead', path: '/team-a/add-lead', icon: UserPlus },
        ];
      case 'Team B':
        return [
          { label: 'Team B Overview', path: '/team-b', icon: LayoutDashboard },
          { label: 'Leads Received', path: '/team-b/leads', icon: Users },
          { label: 'Follow-ups', path: '/team-b/follow-ups', icon: Calendar },
          { label: 'Call Workspace', path: '/team-b/calls', icon: PhoneCall },
          { label: 'Clients & Payments', path: '/team-b/clients', icon: Briefcase },
        ];
      case 'Team C':
        return [
          { label: 'Team C Overview', path: '/team-c', icon: LayoutDashboard },
          { label: 'Projects Execution', path: '/team-c/projects', icon: FolderKanban },
          { label: 'Client Requirements', path: '/team-c/clients', icon: Briefcase },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-slate-900 text-slate-300 w-64 border-r border-slate-800">
      <div>
        {/* Brand Header */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white font-black text-xl shadow-md">
            Z
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-tight">ZEN PLATFORM</h1>
            <p className="text-[10px] text-brand-400 font-semibold uppercase tracking-wider">Freelancer Operations</p>
          </div>
        </div>

        {/* Current Active Role Badge */}
        <div className="mx-4 my-4 rounded-xl bg-slate-800/80 p-3 border border-slate-700/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Active Demo Scope</span>
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <select
            value={role}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="w-full rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold py-1.5 px-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
          >
            <option value="Admin">Admin (Full Access)</option>
            <option value="Team A">Team A (Lead Gen)</option>
            <option value="Team B">Team B (Calling & Reqs)</option>
            <option value="Team C">Team C (Project Execution)</option>
          </select>
        </div>

        {/* Navigation Section */}
        <nav className="space-y-1 px-3">
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Navigation</p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin' || item.path === '/team-a' || item.path === '/team-b' || item.path === '/team-c'}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all group',
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm font-bold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                )
              }
            >
              <item.icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
              <span className="flex-1">{item.label}</span>
              <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User Footer Card */}
      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={currentUser?.name}
            className="h-9 w-9 rounded-full object-cover ring-2 ring-brand-500/40"
          />
          <div className="flex-1 overflow-hidden">
            <h4 className="text-xs font-bold text-white truncate">{currentUser?.name}</h4>
            <p className="text-[10px] text-slate-400 truncate">{currentUser?.email}</p>
          </div>
          <button
            onClick={() => navigate('/login')}
            title="Switch User / Logout"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative flex w-64 max-w-xs flex-1 flex-col bg-slate-900 z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
