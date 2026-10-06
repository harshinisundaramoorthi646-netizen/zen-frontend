import React from 'react';
import { usePlatformStore } from '../../store/usePlatformStore';
import { StatCard } from '../../components/common/StatCard';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Lead, Member } from '../../types';

export const AdminTeamA: React.FC = () => {
  const { members, leads } = usePlatformStore();

  const teamAMembers = members.filter((m) => m.team === 'Team A');

  // Breakdown statistics
  const totalLeads = leads.length;
  const forwardedCount = leads.filter((l) => l.status === 'Forwarded to Team B').length;
  const selectedCount = leads.filter((l) => l.status === 'Selected').length;
  const rejectedCount = leads.filter((l) => l.status === 'Rejected').length;

  const memberBreakdown = teamAMembers.map((m) => {
    const mLeads = leads.filter((l) => l.generatedByMemberId === m.id);
    return {
      ...m,
      totalGenerated: mLeads.length,
      forwarded: mLeads.filter((l) => l.status !== 'New').length,
      selected: mLeads.filter((l) => l.status === 'Selected').length,
      rejected: mLeads.filter((l) => l.status === 'Rejected').length,
    };
  });

  const memberColumns: Column<typeof memberBreakdown[0]>[] = [
    {
      header: 'Member Name',
      accessorKey: 'name',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <img src={row.avatar} alt={row.name} className="h-7 w-7 rounded-full object-cover" />
          <span className="font-bold text-slate-900">{row.name}</span>
        </div>
      ),
    },
    {
      header: 'Total Leads Generated',
      accessorKey: 'totalGenerated',
      sortable: true,
      cell: (row) => <span className="font-bold text-brand-700">{row.totalGenerated}</span>,
    },
    {
      header: 'Forwarded to Team B',
      accessorKey: 'forwarded',
      sortable: true,
      cell: (row) => <span className="font-semibold text-blue-600">{row.forwarded}</span>,
    },
    {
      header: 'Selected (Converted)',
      accessorKey: 'selected',
      sortable: true,
      cell: (row) => <span className="font-bold text-emerald-600">{row.selected}</span>,
    },
    {
      header: 'Rejected',
      accessorKey: 'rejected',
      sortable: true,
      cell: (row) => <span className="font-semibold text-red-600">{row.rejected}</span>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900">Admin Overview — Team A (Lead Gen)</h1>
        <p className="text-xs text-slate-500 mt-1">
          Detailed metrics on Team A member lead generation and conversion performance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Team A Members" value={teamAMembers.length} icon={<span className="font-bold">TA</span>} variant="purple" />
        <StatCard title="Total Generated" value={totalLeads} icon={<span className="font-bold">GEN</span>} variant="brand" />
        <StatCard title="Forwarded" value={forwardedCount} icon={<span className="font-bold">FWD</span>} variant="blue" />
        <StatCard title="Selected" value={selectedCount} icon={<span className="font-bold">SEL</span>} variant="emerald" />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Team A Member Leads Performance Table</h3>
        <DataTable data={memberBreakdown} columns={memberColumns} pageSize={10} searchPlaceholder="Search Team A members..." />
      </div>
    </div>
  );
};
