import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Briefcase,
  FolderKanban,
  CheckCircle2,
  Clock,
  IndianRupee,
  UserPlus,
  UserCheck,
  UserX,
  History,
  ShieldCheck,
  Send,
  PhoneCall,
  Sliders,
} from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';
import { memberService } from '../../services';
import { StatCard } from '../../components/common/StatCard';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Button } from '../../components/ui/Button';
import { AddMemberModal } from '../../components/members/AddMemberModal';
import { Member } from '../../types';
import { formatCurrency, maskAadhaar, formatDate } from '../../utils/formatters';
import { toast } from 'sonner';

export const AdminDashboard: React.FC = () => {
  const { members, leads, projects, payments, activities } = usePlatformStore();
  const navigate = useNavigate();

  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [deactivateMember, setDeactivateMember] = useState<Member | null>(null);

  // Metrics computation
  const totalMembers = members.length;
  const totalLeads = leads.length;
  const selectedClients = leads.filter((l) => l.status === 'Selected').length;
  const activeClients = selectedClients;
  const waitingLeads = leads.filter((l) => l.status === 'Waiting').length;
  const activeProjects = projects.filter((p) => p.projectStatus === 'Active').length;
  const pendingProjects = projects.filter((p) => p.projectStatus === 'Pending' || p.projectStatus === 'Not Started').length;
  const completedProjects = projects.filter((p) => p.projectStatus === 'Completed').length;
  const totalRevenue = payments
    .filter((p) => p.status === 'Paid' || p.status === 'Partially Paid')
    .reduce((sum, p) => sum + p.paidAmount, 0);

  // Team counts
  const teamACount = members.filter((m) => m.team === 'Team A' && m.status === 'active').length;
  const teamBCount = members.filter((m) => m.team === 'Team B' && m.status === 'active').length;
  const teamCCount = members.filter((m) => m.team === 'Team C' && m.status === 'active').length;

  const handleConfirmDeactivate = async () => {
    if (!deactivateMember) return;
    try {
      await memberService.deactivateMember(deactivateMember.id);
      toast.success(`Deactivated member ${deactivateMember.name}`);
      setDeactivateMember(null);
    } catch {
      toast.error('Failed to deactivate member.');
    }
  };

  const memberColumns: Column<Member>[] = [
    {
      header: 'Member',
      accessorKey: 'name',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.avatar} alt={row.name} className="h-8 w-8 rounded-full object-cover ring-2 ring-slate-200" />
          <div>
            <p className="font-bold text-slate-900">{row.name}</p>
            <p className="text-[11px] text-slate-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Team',
      accessorKey: 'team',
      sortable: true,
      cell: (row) => (
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded ${
            row.team === 'Team A'
              ? 'bg-indigo-50 text-indigo-700'
              : row.team === 'Team B'
              ? 'bg-blue-50 text-blue-700'
              : 'bg-purple-50 text-purple-700'
          }`}
        >
          {row.team}
        </span>
      ),
    },
    {
      header: 'Contact',
      accessorKey: 'phone',
      cell: (row) => <span className="text-xs font-medium text-slate-700">{row.phone}</span>,
    },
    {
      header: 'Aadhaar ID (Masked)',
      accessorKey: 'aadhaarNumber',
      cell: (row) => (
        <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
          {maskAadhaar(row.aadhaarNumber)}
        </span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Action',
      cell: (row) =>
        row.status === 'active' ? (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setDeactivateMember(row)}
            className="text-xs text-red-600 hover:bg-red-50"
          >
            <UserX className="h-3.5 w-3.5 mr-1" /> Deactivate
          </Button>
        ) : (
          <span className="text-xs text-slate-400 italic">Inactive</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 p-6 rounded-2xl text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider">
              Executive Admin Suite
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">System Control Center</h1>
          <p className="text-xs text-slate-400 mt-1">
            Global management of team rosters, lead pipelines, financials, and real-time activity logs.
          </p>
        </div>
        <Button
          size="lg"
          variant="primary"
          onClick={() => setIsAddMemberOpen(true)}
          className="bg-brand-600 text-white hover:bg-brand-700 font-bold shrink-0 shadow-md"
        >
          <UserPlus className="h-5 w-5 mr-1.5" /> + Add Member
        </Button>
      </div>

      {/* 9 Executive Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
        <StatCard title="Members" value={totalMembers} icon={<Users className="h-4 w-4" />} variant="slate" />
        <StatCard title="Total Leads" value={totalLeads} icon={<Users className="h-4 w-4" />} variant="brand" />
        <StatCard title="Active Clients" value={activeClients} icon={<Briefcase className="h-4 w-4" />} variant="emerald" />
        <StatCard title="Waiting Leads" value={waitingLeads} icon={<Clock className="h-4 w-4" />} variant="amber" />
        <StatCard title="Selected" value={selectedClients} icon={<CheckCircle2 className="h-4 w-4" />} variant="blue" />
        <StatCard title="Active Projects" value={activeProjects} icon={<FolderKanban className="h-4 w-4" />} variant="purple" />
        <StatCard title="Pending Proj" value={pendingProjects} icon={<Clock className="h-4 w-4" />} variant="amber" />
        <StatCard title="Completed Proj" value={completedProjects} icon={<CheckCircle2 className="h-4 w-4" />} variant="emerald" />
        <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon={<IndianRupee className="h-4 w-4" />} variant="emerald" />
      </div>

      {/* Team Distribution & Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Activity History Timeline */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-brand-600" />
              <h3 className="text-sm font-bold text-slate-900">Activity History Timeline</h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">Date + Time Logged</span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {activities.map((act) => (
              <div
                key={act.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors text-xs"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-bold text-[10px]">
                  {act.actorRole === 'Admin' ? 'ADM' : act.actorRole.replace('Team ', 'T')}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-900">{act.actorName}</p>
                    <span className="text-[10px] text-slate-400 font-medium">{act.timestamp}</span>
                  </div>
                  <p className="text-slate-700 font-medium mt-0.5">{act.action}</p>
                  {act.details && <p className="text-[11px] text-slate-500 mt-1 italic">{act.details}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team-wise Member Summary */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Team Rosters Breakdown</h3>

          <div className="space-y-3">
            <div
              onClick={() => navigate('/admin/team-a')}
              className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 hover:bg-indigo-100/70 cursor-pointer transition-all flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-indigo-950 text-xs">Team A (Lead Generation)</h4>
                <p className="text-[11px] text-indigo-700 mt-0.5">{teamACount} Active Team Members</p>
              </div>
              <Send className="h-5 w-5 text-indigo-600" />
            </div>

            <div
              onClick={() => navigate('/admin/team-b')}
              className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 hover:bg-blue-100/70 cursor-pointer transition-all flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-blue-950 text-xs">Team B (Calling & Reqs)</h4>
                <p className="text-[11px] text-blue-700 mt-0.5">{teamBCount} Active Team Members</p>
              </div>
              <PhoneCall className="h-5 w-5 text-blue-600" />
            </div>

            <div
              onClick={() => navigate('/admin/team-c')}
              className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 hover:bg-purple-100/70 cursor-pointer transition-all flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-purple-950 text-xs">Team C (Project Execution)</h4>
                <p className="text-[11px] text-purple-700 mt-0.5">{teamCCount} Active Team Members</p>
              </div>
              <Sliders className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Member Roster Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">All Team Members Roster</h3>
            <p className="text-xs text-slate-500">Manage profiles, Aadhaar verification, and team assignments</p>
          </div>
          <Button size="sm" onClick={() => setIsAddMemberOpen(true)}>
            <UserPlus className="h-4 w-4 mr-1" /> Add Member
          </Button>
        </div>

        <DataTable
          data={members}
          columns={memberColumns}
          pageSize={8}
          searchPlaceholder="Search members by name, email, team..."
          searchFields={['name', 'email', 'team', 'phone']}
        />
      </div>

      {/* Modals & Dialogs */}
      <AddMemberModal isOpen={isAddMemberOpen} onClose={() => setIsAddMemberOpen(false)} />
      <ConfirmDialog
        isOpen={!!deactivateMember}
        onClose={() => setDeactivateMember(null)}
        onConfirm={handleConfirmDeactivate}
        title="Deactivate Member?"
        message={`Are you sure you want to deactivate ${deactivateMember?.name}? Their access will be disabled.`}
        confirmText="Deactivate"
        variant="danger"
      />
    </div>
  );
};
