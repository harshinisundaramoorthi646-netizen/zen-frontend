import React from 'react';
import { usePlatformStore } from '../../store/usePlatformStore';
import { StatCard } from '../../components/common/StatCard';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDuration, formatCurrency } from '../../utils/formatters';

export const AdminTeamB: React.FC = () => {
  const { members, leads, calls, followUps, payments } = usePlatformStore();

  const teamBMembers = members.filter((m) => m.team === 'Team B');

  // Breakdown statistics
  const totalCalls = calls.length;
  const totalTalkTimeSec = calls.reduce((acc, c) => acc + c.durationSeconds, 0);
  const totalFollowups = followUps.length;
  const paymentsConfirmedCount = payments.filter((p) => p.status === 'Paid').length;
  const totalRevenueCollected = payments.filter((p) => p.status === 'Paid').reduce((acc, p) => acc + p.paidAmount, 0);

  const memberBreakdown = teamBMembers.map((m) => {
    const mCalls = calls.filter((c) => c.memberId === m.id);
    const mFollowups = followUps.filter((f) => f.memberId === m.id);
    const talkSec = mCalls.reduce((sum, c) => sum + c.durationSeconds, 0);

    return {
      ...m,
      callsCompleted: mCalls.length,
      followupsTotal: mFollowups.length,
      followupsDone: mFollowups.filter((f) => f.status === 'Completed').length,
      talkTime: formatDuration(talkSec),
      selectedCount: mCalls.filter((c) => c.outcome === 'Selected' || c.outcome === 'Interested').length,
    };
  });

  const memberColumns: Column<typeof memberBreakdown[0]>[] = [
    {
      header: 'Caller Member',
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
      header: 'Calls Completed',
      accessorKey: 'callsCompleted',
      sortable: true,
      cell: (row) => <span className="font-bold text-slate-900">{row.callsCompleted}</span>,
    },
    {
      header: 'Total Talk Time',
      accessorKey: 'talkTime',
      sortable: true,
      cell: (row) => <span className="font-mono text-xs font-bold text-emerald-600">{row.talkTime}</span>,
    },
    {
      header: 'Follow-ups Handled',
      accessorKey: 'followupsTotal',
      cell: (row) => (
        <span className="text-xs">
          <span className="font-bold text-blue-600">{row.followupsDone}</span> / {row.followupsTotal}
        </span>
      ),
    },
    {
      header: 'Interested / Selected',
      accessorKey: 'selectedCount',
      cell: (row) => <span className="font-bold text-emerald-600">{row.selectedCount}</span>,
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
        <h1 className="text-xl font-bold text-slate-900">Admin Overview — Team B (Calling & Scope)</h1>
        <p className="text-xs text-slate-500 mt-1">
          Detailed metrics on Team B calling performance, total talk time, follow-ups, and payment collections.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        <StatCard title="Team B Members" value={teamBMembers.length} icon={<span className="font-bold">TB</span>} variant="blue" />
        <StatCard title="Calls Completed" value={totalCalls} icon={<span className="font-bold">CAL</span>} variant="brand" />
        <StatCard title="Total Talk Time" value={formatDuration(totalTalkTimeSec)} icon={<span className="font-bold">TT</span>} variant="purple" />
        <StatCard title="Follow-ups" value={totalFollowups} icon={<span className="font-bold">FLP</span>} variant="amber" />
        <StatCard title="Payments Paid" value={formatCurrency(totalRevenueCollected)} icon={<span className="font-bold">₹</span>} variant="emerald" />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Team B Call Performance & Talk Time Breakdown</h3>
        <DataTable data={memberBreakdown} columns={memberColumns} pageSize={10} searchPlaceholder="Search Team B callers..." />
      </div>
    </div>
  );
};
